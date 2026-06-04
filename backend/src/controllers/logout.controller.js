const jwt = require("jsonwebtoken");
async function logout(req, res) {

    try {

        res.clearCookie("token");

        res.status(200).json({
            message: "Logout successful"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = { logout };