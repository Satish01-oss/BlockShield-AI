from flask import Flask, request, jsonify
from flask_cors import CORS

import pandas as pd
import numpy as np
import joblib
import traceback
import os

# =========================================================
# FLASK APP
# =========================================================

app = Flask(__name__)

CORS(app)

# =========================================================
# LOAD MODEL BUNDLE
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    'fraud_detection_output',
    'fraud_detection_bundle.pkl'
)

try:

    bundle = joblib.load(MODEL_PATH)

except Exception as e:

    print(f'Model loading failed: {e}')

    raise

# =========================================================
# LOAD BEST MODEL ONLY
# =========================================================

model = bundle['best_model']

model_name = bundle['best_model_name']

preprocessor = bundle['preprocessor']

feature_cols = bundle['feature_cols']

threshold = bundle['thresholds'][model_name]

metrics = bundle['metrics'][model_name]

print("================================================")
print(" BLOCKCHAIN FRAUD DETECTION API ")
print("================================================")
print(f"Loaded Model: {model_name}")
print(f"ROC-AUC: {metrics['roc_auc']:.4f}")
print("================================================")

# =========================================================
# HOME ROUTE
# =========================================================

@app.route('/', methods=['GET'])
def home():

    return jsonify({

        'message': 'Blockchain Fraud Detection API Running',

        'model': model_name,

        'roc_auc': metrics['roc_auc']

    })

# =========================================================
# FEATURE GENERATION
# =========================================================

def generate_features(data):

    df = pd.DataFrame([data])

    defaults = {

        'gas_used': 21000,
        'block_time_sec': 13,
        'network_congestion': 0.5,
        'nonce': 1,
        'balance_before_eth': 10,
        'tx_per_address_24h': 5,
        'unique_counterparties': 3,
        'known_exchange_addr': 0,
        'hour_of_day': 12,
        'day_of_week': 3,
        'is_weekend': 0,
        'is_contract_call': 0

    }

    for key, value in defaults.items():

        if key not in df.columns:

            df[key] = value

    numeric_cols = [

        'tx_value_eth',
        'gas_price_gwei',
        'account_age_days',
        'gas_used',
        'balance_before_eth',
        'tx_per_address_24h'

    ]

    for col in numeric_cols:

        df[col] = pd.to_numeric(
            df[col],
            errors='coerce'
        ).fillna(0)

    # =====================================================
    # FEATURE ENGINEERING
    # =====================================================

    df['value_to_balance_ratio'] = (

        df['tx_value_eth'] /
        (df['balance_before_eth'] + 1e-6)

    )

    df['gas_efficiency'] = (

        df['gas_used'] /
        (df['gas_price_gwei'] + 1e-6)

    )

    df['tx_velocity_ratio'] = (

        df['tx_per_address_24h'] /
        (df['account_age_days'] + 1)

    )

    df['value_per_counterparty'] = (

        df['tx_value_eth'] /
        (df['unique_counterparties'] + 1)

    )

    # =====================================================
    # LOG FEATURES
    # =====================================================

    for col in [

        'tx_value_eth',
        'gas_price_gwei',
        'balance_before_eth',
        'tx_per_address_24h'

    ]:

        df[f'log_{col}'] = np.log1p(

            df[col]
            .fillna(0)
            .clip(lower=0)

        )

    # =====================================================
    # FLAGS
    # =====================================================

    df['high_velocity'] = (
        df['tx_per_address_24h'] > 50
    ).astype(int)

    df['new_account'] = (
        df['account_age_days'] < 7
    ).astype(int)

    df['large_tx'] = (
        df['tx_value_eth'] > 5
    ).astype(int)

    df['off_hours'] = df['hour_of_day'].apply(
        lambda h: 1 if h < 6 or h > 22 else 0
    )

    df['low_nonce'] = (
        df['nonce'] < 5
    ).astype(int)

    df['concentrated'] = (
        df['unique_counterparties'] < 3
    ).astype(int)

    df['risk_score_raw'] = (

        df['high_velocity'] +
        df['new_account'] +
        df['large_tx'] +
        df['off_hours'] +
        df['low_nonce'] +
        df['concentrated']

    )

    # =====================================================
    # ENSURE ALL FEATURES EXIST
    # =====================================================

    for col in feature_cols:

        if col not in df.columns:

            df[col] = 0

    return df

# =========================================================
# RISK LEVEL
# =========================================================

def get_risk_level(probability):

    if probability >= 0.8:
        return 'Critical'

    elif probability >= 0.6:
        return 'High'

    elif probability >= 0.4:
        return 'Medium'

    return 'Low'

# =========================================================
# EXPLANATIONS
# =========================================================

def generate_explanation(df):

    reasons = []

    if bool(df['large_tx'].iloc[0]):
        reasons.append('High Transaction Value')

    if bool(df['new_account'].iloc[0]):
        reasons.append('New Account')

    if bool(df['high_velocity'].iloc[0]):
        reasons.append('High Transaction Velocity')

    if bool(df['low_nonce'].iloc[0]):
        reasons.append('Low Nonce')

    if bool(df['off_hours'].iloc[0]):
        reasons.append('Off Hours Activity')

    return reasons

# =========================================================
# MAIN PREDICTION API
# =========================================================

@app.route('/predict', methods=['POST'])
def predict():

    try:

        data = request.get_json(silent=True)

        if not data:

            return jsonify({

                'success': False,
                'message': 'No input data provided'

            }), 400

        required_fields = [

            'tx_value_eth',
            'gas_price_gwei',
            'account_age_days'

        ]

        missing_fields = [

            field for field in required_fields
            if field not in data

        ]

        if missing_fields:

            return jsonify({

                'success': False,
                'message': f'Missing fields: {missing_fields}'

            }), 400

        # =================================================
        # FEATURE ENGINEERING
        # =================================================

        df = generate_features(data)

        # =================================================
        # PREPROCESSING
        # =================================================

        X = preprocessor.transform(
            df[feature_cols]
        )

        # =================================================
        # PREDICTION
        # =================================================

        probability = float(
            model.predict_proba(X)[0][1]
        )

        is_fraud = int(
            probability >= threshold
        )

        risk_level = get_risk_level(
            probability
        )

        # =================================================
        # RESPONSE
        # =================================================

        return jsonify({

            'success': True,

            'model_used': model_name,

            'fraud_probability': round(probability, 4),

            'threshold': round(threshold, 4),

            'is_fraud': is_fraud,

            'risk_level': risk_level,

            'explanations': generate_explanation(df)

        })

    except Exception as e:

        traceback.print_exc()

        return jsonify({

            'success': False,
            'message': str(e)

        }), 500

# =========================================================
# HEALTH CHECK
# =========================================================

@app.route('/health', methods=['GET'])
def health_check():

    return jsonify({

        'status': 'healthy',

        'model': model_name

    })

# =========================================================
# START SERVER
# =========================================================

if __name__ == '__main__':

    app.run(

        host='0.0.0.0',
        port=8000,
        debug=False

    )