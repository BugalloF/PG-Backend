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
        },
        JWT_SECRET,
        {
            expiresIn: "24h",
        },
    );
};


async function verifyToken(token)
{
    try
    {
        return jwt.verify(token, JWT_SECRET);
    }
    catch(error)
    {
        console.log(error);
        return null;
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