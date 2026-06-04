"""
================================================================
  BLOCKCHAIN FRAUD DETECTION — Complete ML Pipeline
================================================================
  Features:
   1.  Synthetic on-chain transaction data generation
   2.  Exploratory Data Analysis  (EDA)
   3.  Feature Engineering (ratios, log-transforms, flags)
   4.  Preprocessing  (median imputation + RobustScaler)
   5.  Imbalanced-class handling  (random oversampling)
   6.  Model Training
         ▸ Logistic Regression      (interpretable baseline)
         ▸ Random Forest            (best overall)
         ▸ Gradient Boosting        (high precision)
         ▸ Voting Ensemble          (model combination)
         ▸ Isolation Forest         (unsupervised anomaly)
   7.  Evaluation  (ROC-AUC, Avg-Precision, F1, CM)
   8.  Decision-threshold optimisation  (maximise F1)
   9.  Feature Importance plots
  10.  Model persistence  (joblib)
  11.  FraudDetector inference class

  Dependencies (all standard):
      numpy  pandas  matplotlib  seaborn  scikit-learn  joblib
================================================================
"""

import os, warnings, joblib
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

try:
    import seaborn as sns
except ImportError:
    sns = None

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import RobustScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.utils.class_weight import compute_class_weight
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import (RandomForestClassifier, GradientBoostingClassifier,
                               IsolationForest, VotingClassifier)
from sklearn.metrics import (classification_report, confusion_matrix,
                              roc_auc_score, roc_curve, precision_recall_curve,
                              average_precision_score, f1_score)

warnings.filterwarnings("ignore")

OUT          = "fraud_detection_output"
RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)
os.makedirs(OUT, exist_ok=True)


# ═══════════════════════════════════════════════════════════════
# 1. SYNTHETIC BLOCKCHAIN TRANSACTION DATA
# ═══════════════════════════════════════════════════════════════

def generate_blockchain_data(n_samples=20_000, fraud_rate=0.035):
    """
    Generates labelled blockchain transactions mimicking Ethereum / ERC-20
    on-chain behaviour (inspired by the Elliptic dataset feature set).

    Fraud signatures:
      - higher value & gas price, low nonce, new account
      - very high 24-h tx velocity, few unique counterparties
      - off-hours activity, high network congestion
      - low balance relative to transfer value
    """
    n_fraud = int(n_samples * fraud_rate)
    n_legit = n_samples - n_fraud
    rng     = np.random.default_rng(RANDOM_STATE)

    def rows(n, f):
        return dict(
            tx_value_eth         = rng.lognormal(1.5+2*f,   1.2+0.6*f, n),
            gas_price_gwei       = rng.lognormal(3.5+1.0*f, 0.5+0.5*f, n),
            gas_used             = rng.integers(21_000, 200_000+300_000*f, n),
            block_time_sec       = rng.normal(13, 2+3*f, n).clip(1),
            network_congestion   = rng.uniform(0+0.5*f, 1, n),
            nonce                = rng.integers(0, 500-450*f, n),
            account_age_days     = rng.integers(0+30*(1-f), 60+1440*(1-f), n),
            balance_before_eth   = rng.lognormal(2.0-1.5*f, 1.5+0.5*f, n),
            tx_per_address_24h   = rng.integers(1+9*f, 20+180*f, n),
            unique_counterparties= rng.integers(1, 10+40*(1-f), n),
            known_exchange_addr  = rng.choice([0,1], p=[0.6-0.3*f,0.4+0.3*f], size=n),
            hour_of_day          = rng.integers(0, 24, n),
            day_of_week          = rng.integers(0, 7,  n),
            is_weekend           = rng.integers(0, 2,  n),
            is_contract_call     = rng.integers(0, 2,  n),
            label                = f,
        )

    df = (pd.concat([pd.DataFrame(rows(n_legit,0)),
                     pd.DataFrame(rows(n_fraud,1))], ignore_index=True)
            .sample(frac=1, random_state=RANDOM_STATE)
            .reset_index(drop=True))

    for col in ["gas_price_gwei","balance_before_eth","account_age_days"]:
        df.loc[rng.choice(df.index, int(0.005*len(df)), replace=False), col] = np.nan

    print(f"[DATA] {len(df):,} rows | fraud = {df['label'].mean()*100:.2f}%")
    return df


# ═══════════════════════════════════════════════════════════════
# 2. EDA
# ═══════════════════════════════════════════════════════════════

def run_eda(df):
    print("\n[EDA] Exploratory Data Analysis …")
    num = df.select_dtypes(include=np.number).columns.drop("label")
    print(f"  Shape: {df.shape}")
    print(f"  Label counts:\n{df['label'].value_counts().to_string()}")
    print(f"  Nulls:\n{df.isnull().sum()[df.isnull().sum()>0].to_string()}")

    # class dist + heatmap
    fig, axes = plt.subplots(1, 2, figsize=(14,5))
    fig.suptitle("EDA — Overview", fontsize=13, fontweight="bold")
    c = df["label"].value_counts()
    axes[0].bar(["Legit","Fraud"], c.values, color=["#1976D2","#D32F2F"], width=0.5, edgecolor="white")
    axes[0].set(title="Class Distribution", ylabel="Count")
    for i, v in enumerate(c.values):
        axes[0].text(i, v+50, f"{v:,}", ha="center", fontsize=10)
    sns.heatmap(df[list(num)+["label"]].corr(), ax=axes[1], cmap="coolwarm", center=0, linewidths=0.3)
    axes[1].set_title("Correlation Heatmap")
    plt.tight_layout(); plt.savefig(f"{OUT}/eda_overview.png", dpi=130, bbox_inches="tight"); plt.close()

    # feature distributions
    feats = ["tx_value_eth","gas_price_gwei","tx_per_address_24h",
             "account_age_days","unique_counterparties","balance_before_eth"]
    fig, axes = plt.subplots(2, 3, figsize=(15,7))
    fig.suptitle("Feature Distributions by Class", fontsize=13, fontweight="bold")
    for ax, feat in zip(axes.flat, feats):
        for lbl, col, nm in [(0,"#1976D2","Legit"),(1,"#D32F2F","Fraud")]:
            ax.hist(df.loc[df["label"]==lbl, feat].dropna(), bins=40,
                    alpha=0.6, color=col, label=nm, density=True, edgecolor="none")
        ax.set_title(feat, fontsize=9); ax.legend(fontsize=8)
    plt.tight_layout(); plt.savefig(f"{OUT}/eda_feature_dist.png", dpi=130, bbox_inches="tight"); plt.close()
    print(f"  EDA plots saved to {OUT}/")


# ═══════════════════════════════════════════════════════════════
# 3. FEATURE ENGINEERING
# ═══════════════════════════════════════════════════════════════

def engineer_features(df):
    print("\n[FEAT] Engineering features …")
    d = df.copy()

    # ratio / interaction
    d["value_to_balance_ratio"] = d["tx_value_eth"]       / (d["balance_before_eth"]     + 1e-6)
    d["gas_efficiency"]         = d["gas_used"]           / (d["gas_price_gwei"]          + 1e-6)
    d["tx_velocity_ratio"]      = d["tx_per_address_24h"] / (d["account_age_days"]        + 1)
    d["value_per_counterparty"] = d["tx_value_eth"]       / (d["unique_counterparties"]   + 1)

    # log transforms (reduce skew)
    for col in ["tx_value_eth","gas_price_gwei","balance_before_eth","tx_per_address_24h"]:
        d[f"log_{col}"] = np.log1p(d[col].fillna(0).clip(lower=0))

    # binary risk flags
    d["high_velocity"] = (d["tx_per_address_24h"]    > 50).astype(int)
    d["new_account"]   = (d["account_age_days"]       < 7 ).astype(int)
    d["large_tx"]      = (d["tx_value_eth"]           > d["tx_value_eth"].quantile(0.95)).astype(int)
    d["off_hours"]     = d["hour_of_day"].apply(lambda h: 1 if h<6 or h>22 else 0)
    d["low_nonce"]     = (d["nonce"]                  < 5 ).astype(int)
    d["concentrated"]  = (d["unique_counterparties"]  < 3 ).astype(int)

    # composite risk score
    d["risk_score_raw"] = (d["high_velocity"]+d["new_account"]+d["large_tx"]+
                           d["off_hours"]+d["low_nonce"]+d["concentrated"])

    print(f"  Features after engineering: {d.shape[1]-1}")
    return d


# ═══════════════════════════════════════════════════════════════
# 4. PREPROCESSING HELPERS
# ═══════════════════════════════════════════════════════════════

def build_preprocessor(feature_cols):
    return ColumnTransformer([
        ("num", Pipeline([("imputer", SimpleImputer(strategy="median")),
                          ("scaler",  RobustScaler())]), feature_cols)
    ], remainder="drop")


def random_oversample(X, y, random_state=RANDOM_STATE):
    rng      = np.random.default_rng(random_state)
    min_idx  = np.where(y==1)[0]
    maj_idx  = np.where(y==0)[0]
    n_add    = len(maj_idx) - len(min_idx)
    chosen   = rng.choice(min_idx, size=n_add, replace=True)
    X_res    = np.vstack([X, X[chosen]])
    y_res    = np.concatenate([y, y[chosen]])
    perm     = rng.permutation(len(y_res))
    print(f"  Oversampled minority: {len(min_idx):,} → {len(min_idx)+n_add:,}")
    return X_res[perm], y_res[perm]


# ═══════════════════════════════════════════════════════════════
# 5. MODEL DEFINITIONS
# ═══════════════════════════════════════════════════════════════

def build_models(class_weight):
    return {
        "Logistic Regression": LogisticRegression(
            max_iter=500, C=0.5, class_weight=class_weight,
            random_state=RANDOM_STATE, solver="lbfgs"),
        "Random Forest": RandomForestClassifier(
            n_estimators=150, max_depth=10, min_samples_leaf=4,
            n_jobs=-1, class_weight=class_weight, random_state=RANDOM_STATE),
        "Gradient Boosting": GradientBoostingClassifier(
            n_estimators=100, learning_rate=0.1, max_depth=4,
            subsample=0.8, random_state=RANDOM_STATE),
    }


# ═══════════════════════════════════════════════════════════════
# 6–7. THRESHOLD OPT + EVALUATION
# ═══════════════════════════════════════════════════════════════

def best_f1_threshold(y_true, y_prob):
    prec, rec, threshs = precision_recall_curve(y_true, y_prob)
    f1 = 2*prec*rec / (prec+rec+1e-9)
    idx = int(np.argmax(f1))
    return float(threshs[idx]) if idx < len(threshs) else 0.5


def evaluate(name, model, X_test, y_test, threshold=0.5):
    y_prob = model.predict_proba(X_test)[:,1]
    y_pred = (y_prob >= threshold).astype(int)
    roc    = roc_auc_score(y_test, y_prob)
    ap     = average_precision_score(y_test, y_prob)
    f1     = f1_score(y_test, y_pred)
    print(f"\n{'─'*55}\n  {name}  (thr={threshold:.3f})\n{'─'*55}")
    print(classification_report(y_test, y_pred, target_names=["Legit","Fraud"], digits=4))
    print(f"  ROC-AUC={roc:.4f}  AvgPR={ap:.4f}  F1={f1:.4f}")
    return dict(name=name, roc_auc=roc, avg_pr=ap, f1=f1,
                y_prob=y_prob, y_pred=y_pred, threshold=threshold)


# ═══════════════════════════════════════════════════════════════
# TRAINING PIPELINE
# ═══════════════════════════════════════════════════════════════

def train_pipeline(df):
    print("\n[TRAIN] Starting training pipeline …")

    feature_cols = [c for c in df.columns if c != "label"]
    X_df, y = df[feature_cols], df["label"].values

    # stratified 70/15/15 split
    X_tmp, X_te_df, y_tmp, y_te = train_test_split(
        X_df, y, test_size=0.15, stratify=y, random_state=RANDOM_STATE)
    X_tr_df, X_va_df, y_tr, y_va = train_test_split(
        X_tmp, y_tmp, test_size=0.15/0.85, stratify=y_tmp, random_state=RANDOM_STATE)

    print(f"  Train={len(y_tr):,}  Val={len(y_va):,}  Test={len(y_te):,}")

    prep   = build_preprocessor(feature_cols)
    X_tr   = prep.fit_transform(X_tr_df)
    X_va   = prep.transform(X_va_df)
    X_te   = prep.transform(X_te_df)

    cw = dict(zip(*[np.unique(y_tr),
                    compute_class_weight("balanced", classes=np.unique(y_tr), y=y_tr)]))
    print(f"  Class weights: {cw}")

    print("\n[PREP] Oversampling training set …")
    X_tr_bal, y_tr_bal = random_oversample(X_tr, y_tr)

    results, trained = {}, {}
    for name, clf in build_models(cw).items():
        print(f"\n[TRAIN] Fitting {name} …")
        Xf, yf = (X_tr_bal, y_tr_bal) if "Gradient" in name else (X_tr, y_tr)
        clf.fit(Xf, yf)
        thr           = best_f1_threshold(y_va, clf.predict_proba(X_va)[:,1])
        results[name] = evaluate(name, clf, X_te, y_te, thr)
        trained[name] = clf

    # ensemble
    print("\n[TRAIN] Building Voting Ensemble …")
    ens = VotingClassifier(list(trained.items()), voting="soft", n_jobs=-1)
    ens.fit(X_tr, y_tr)
    thr_e = best_f1_threshold(y_va, ens.predict_proba(X_va)[:,1])
    results["Ensemble"] = evaluate("Ensemble", ens, X_te, y_te, thr_e)
    trained["Ensemble"] = ens

    # isolation forest
    print("\n[TRAIN] Fitting Isolation Forest …")
    iso = IsolationForest(n_estimators=100, contamination=0.035,
                          random_state=RANDOM_STATE, n_jobs=-1)
    iso.fit(X_tr)
    iso_sc = -iso.score_samples(X_te)
    print(f"  Isolation Forest ROC-AUC: {roc_auc_score(y_te, iso_sc):.4f}")
    print(classification_report(y_te, (iso.predict(X_te)==-1).astype(int),
                                target_names=["Legit","Fraud"], digits=4))

    return results, trained, prep, feature_cols, X_te, y_te, iso, iso_sc


# ═══════════════════════════════════════════════════════════════
# 8. EVALUATION PLOTS
# ═══════════════════════════════════════════════════════════════

PAL = {"Logistic Regression":"#607D8B","Random Forest":"#4CAF50",
       "Gradient Boosting":"#FF9800","Ensemble":"#9C27B0","Isolation Forest":"#E91E63"}


def plot_evaluation(results, y_test, iso_scores):
    print("\n[PLOT] Generating evaluation plots …")

    fig, axes = plt.subplots(1, 3, figsize=(18,5))
    fig.suptitle("Fraud Detection — Evaluation", fontsize=13, fontweight="bold")

    # ROC
    ax = axes[0]
    for name, res in results.items():
        fpr,tpr,_ = roc_curve(y_test, res["y_prob"])
        ax.plot(fpr,tpr,lw=2,color=PAL.get(name,"grey"),label=f"{name} ({res['roc_auc']:.3f})")
    fi,ti,_ = roc_curve(y_test, iso_scores)
    ax.plot(fi,ti,lw=2,ls="--",color=PAL["Isolation Forest"],
            label=f"IsoForest ({roc_auc_score(y_test,iso_scores):.3f})")
    ax.plot([0,1],[0,1],"k--",lw=1)
    ax.set(title="ROC Curves",xlabel="FPR",ylabel="TPR"); ax.legend(fontsize=8)

    # PR
    ax = axes[1]
    for name, res in results.items():
        p,r,_ = precision_recall_curve(y_test, res["y_prob"])
        ax.plot(r,p,lw=2,color=PAL.get(name,"grey"),label=f"{name} (AP={res['avg_pr']:.3f})")
    ax.set(title="Precision-Recall Curves",xlabel="Recall",ylabel="Precision"); ax.legend(fontsize=8)

    # bar comparison
    ax = axes[2]
    names = list(results.keys())
    x,w  = np.arange(len(names)), 0.25
    for i,(metric,key,col) in enumerate([("ROC-AUC","roc_auc","#1976D2"),
                                          ("Avg-PR","avg_pr","#388E3C"),
                                          ("F1","f1","#F57C00")]):
        ax.bar(x+i*w,[results[n][key] for n in names],w,label=metric,
               color=col,alpha=0.85,edgecolor="white")
    ax.set_xticks(x+w); ax.set_xticklabels(names,rotation=20,ha="right",fontsize=8)
    ax.set_ylim(0.4,1.02); ax.legend(fontsize=8)
    ax.set(title="Model Comparison",ylabel="Score")

    plt.tight_layout(); plt.savefig(f"{OUT}/evaluation_plots.png",dpi=130,bbox_inches="tight"); plt.close()

    # confusion matrices
    best  = max(results, key=lambda n: results[n]["roc_auc"])
    ncols = len(results)
    fig, axes = plt.subplots(1,ncols,figsize=(5*ncols,4))
    fig.suptitle("Confusion Matrices",fontsize=13,fontweight="bold")
    for ax,(name,res) in zip(axes,results.items()):
        sns.heatmap(confusion_matrix(y_test,res["y_pred"]),annot=True,fmt="d",
                    cmap="Blues",ax=ax,xticklabels=["Legit","Fraud"],yticklabels=["Legit","Fraud"])
        ax.set_title(f"{name}{' ★' if name==best else ''}",fontsize=9)
        ax.set_xlabel("Predicted"); ax.set_ylabel("Actual")
    plt.tight_layout(); plt.savefig(f"{OUT}/confusion_matrices.png",dpi=130,bbox_inches="tight"); plt.close()
    print(f"  Plots saved to {OUT}/")


# ═══════════════════════════════════════════════════════════════
# 9. FEATURE IMPORTANCE
# ═══════════════════════════════════════════════════════════════

def plot_feature_importance(trained, feature_cols):
    tree_m = {n:m for n,m in trained.items() if hasattr(m,"feature_importances_")}
    if not tree_m: return
    print("\n[FEAT] Plotting feature importances …")
    fig, axes = plt.subplots(1,len(tree_m),figsize=(9*len(tree_m),7))
    if len(tree_m)==1: axes=[axes]
    fig.suptitle("Feature Importances",fontsize=13,fontweight="bold")
    for ax,(name,model) in zip(axes,tree_m.items()):
        imp = model.feature_importances_
        idx = np.argsort(imp)[::-1][:20]
        ax.barh([feature_cols[i] for i in idx[::-1]], imp[idx[::-1]],
                color="#4CAF50",edgecolor="white")
        ax.set_title(f"{name} — Top 20"); ax.set_xlabel("Importance")
    plt.tight_layout(); plt.savefig(f"{OUT}/feature_importance.png",dpi=130,bbox_inches="tight"); plt.close()
    print(f"  Saved → {OUT}/feature_importance.png")


# ═══════════════════════════════════════════════════════════════
# 10. SAVE ARTIFACTS
# ═══════════════════════════════════════════════════════════════

def save_artifacts(trained, prep, iso, feature_cols, results):
    print("\n[SAVE] Persisting artifacts …")
    best = max(results, key=lambda n: results[n]["roc_auc"])
    bundle = dict(
        best_model_name = best,
        best_model      = trained[best],
        all_models      = trained,
        preprocessor    = prep,
        isolation_forest= iso,
        feature_cols    = feature_cols,
        thresholds      = {n: results[n]["threshold"] for n in results},
        metrics         = {n: {k:results[n][k] for k in ["roc_auc","avg_pr","f1"]}
                           for n in results},
    )
    path = f"{OUT}/fraud_detection_bundle.pkl"
    joblib.dump(bundle, path, compress=3)
    print(f"  Bundle → {path}  ({os.path.getsize(path)/1024**2:.1f} MB)")
    return path


# ═══════════════════════════════════════════════════════════════
# 11. FRAUD DETECTOR (inference class)
# ═══════════════════════════════════════════════════════════════

class FraudDetector:
    """
    Production inference wrapper.

    Usage
    -----
    >>> detector = FraudDetector("fraud_detection_output/fraud_detection_bundle.pkl")
    >>> preds = detector.predict(new_transactions_df)
    >>> print(preds[["fraud_probability","risk_level","is_fraud"]])
    """

    def __init__(self, bundle_path: str):
        b = joblib.load(bundle_path)
        self.model        = b["best_model"]
        self.model_name   = b["best_model_name"]
        self.preprocessor = b["preprocessor"]
        self.iso          = b["isolation_forest"]
        self.feature_cols = b["feature_cols"]
        self.threshold    = b["thresholds"][self.model_name]
        self.metrics      = b["metrics"][self.model_name]
        print(f"\n[FraudDetector] Model: {self.model_name} | "
              f"thr={self.threshold:.4f} | ROC-AUC={self.metrics['roc_auc']:.4f}")

    def predict(self, df: pd.DataFrame, threshold: float = None) -> pd.DataFrame:
        """
        Parameters
        ----------
        df        : DataFrame with required feature columns.
        threshold : Override decision threshold (optional).

        Returns
        -------
        DataFrame: fraud_probability, anomaly_score, is_fraud, risk_level
        """
        thr  = threshold if threshold is not None else self.threshold
        X    = self.preprocessor.transform(df[self.feature_cols])
        prob = self.model.predict_proba(X)[:,1]
        iso  = -self.iso.score_samples(X)

        out = pd.DataFrame({
            "fraud_probability": prob.round(4),
            "anomaly_score"    : iso.round(4),
            "is_fraud"         : (prob >= thr).astype(int),
        }, index=df.index)

        out["risk_level"] = pd.cut(prob,
            bins=[0.0,0.3,0.5,0.7,1.0], labels=["Low","Medium","High","Critical"], include_lowest=True)
        return out

    def predict_single(self, tx: dict) -> dict:
        """Predict a single transaction dictionary."""
        return self.predict(pd.DataFrame([tx])).iloc[0].to_dict()


# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════

def main():
    print("="*60)
    print("  BLOCKCHAIN FRAUD DETECTION — ML Pipeline")
    print("="*60)

    df           = generate_blockchain_data(20_000, 0.035)
    run_eda(df)
    df           = engineer_features(df)

    (results, trained, prep,
     feat_cols, X_te, y_te,
     iso, iso_sc) = train_pipeline(df)

    plot_evaluation(results, y_te, iso_sc)
    plot_feature_importance(trained, feat_cols)
    bundle       = save_artifacts(trained, prep, iso, feat_cols, results)

    # inference demo
    print("\n[DEMO] Inference on 5 sample transactions …")
    det    = FraudDetector(bundle)
    sample = df.drop(columns=["label"]).sample(5, random_state=7)
    preds  = det.predict(sample)
    preds["actual"] = df.loc[sample.index,"label"].values
    print("\n" + preds.to_string())

    best = max(results, key=lambda n: results[n]["roc_auc"])
    r    = results[best]
    print(f"\n{'='*60}")
    print(f"  ✅  Best model  : {best}")
    print(f"      ROC-AUC    : {r['roc_auc']:.4f}")
    print(f"      Avg-PR     : {r['avg_pr']:.4f}")
    print(f"      F1         : {r['f1']:.4f}")
    print(f"      Threshold  : {r['threshold']:.4f}")
    print(f"  📁  Output dir  : ./{OUT}/")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
