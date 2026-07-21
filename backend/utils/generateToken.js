const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.user_id,
            email: user.email,
        },
        process.env.JWT_SECRET,{
            expiresIn:"1d",
        }
    );
};

module.exports = generateToken;