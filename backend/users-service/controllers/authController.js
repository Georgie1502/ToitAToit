const AuthService = require("../services/authService");

exports.signup = async (req, res) => {
    try {
        const result = await AuthService.signup(req.body);
        res.status(201).json({success: true, data: result});
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
};
exports.login = async (req, res) => {
    try {
        const result = await AuthService.login(req.body);   
        res.status(200).json({success: true, data: result});
    } catch (error) {
        res.status(401).json({success: false, message: error.message});
    }   
};