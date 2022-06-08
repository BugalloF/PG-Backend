// Dependencies
const jwt = require("jsonwebtoken");
// Files
const {JWT_SECRET} = process.env


async function signToken(user)
{
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            img: user.img,
            is_Admin: user.is_Admin,
        },
        JWT_SECRET,
        {
            expiresIn: "24h",
        },
    );
};


async function verifyToken(token, next)
{
    try
    {
        return jwt.verify(token, JWT_SECRET);
    }
    catch(error)
    {
        return next;
    };
};


module.exports =
{
    signToken,
    verifyToken,
};