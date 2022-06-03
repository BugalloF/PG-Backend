// Dependencies
const bcrypt = require("bcryptjs");


async function encrypt(text)
{
    const hash = await bcrypt.hash(text, 10);
    return hash;
};

async function compare(password, hashPassword)
{
    return await bcrypt.compare(password, hashPassword);
};



module.exports =
{
    encrypt,
    compare,
};