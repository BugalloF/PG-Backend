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
            img: user.img,
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


async function decodeToken(token)
{

};


module.exports =
{
    signToken,
    verifyToken,
    decodeToken,
};