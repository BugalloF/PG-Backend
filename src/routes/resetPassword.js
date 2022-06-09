// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {Profile} = require("../db");
const {encrypt} = require("../controllers/bcrypt");
const {verifyToken} = require("../controllers/tokens");


router.put("/reset/:id", async (req, res) => {
    const {id} = req.params;
    const {password} = req.body;
    const {authorization} = req.headers;
    
    try
    {
        if(authorization)
        {
            const token = authorization.split(" ").pop();
            const tokenData = await verifyToken(token);
            const userID = tokenData !== undefined ? tokenData.id : null;
            
            if(userID)
            {
                // Console.log porque sino rompe si no encuentra id
                const foundUser = await Profile.findByPk(id).catch(e => console.log(e));
                
                if(foundUser !== undefined && foundUser !== null && Object.keys(foundUser).length)
                {
                    if(foundUser.id === userID)
                    {
                        const passwordHash = await encrypt(password);
                        
                        await foundUser.update({
                            password: passwordHash,
                        });
                        
                        res.send("Password updated.");
                    }
                    else
                    {
                        res.status(404).send("Invalid id.");
                    };
                }
                else
                {
                    res.status(404).send("Cannot find any user with tihs username or email.");
                };
            }
            else
            {
                res.status(409).send("Invalid token.");
            };
        }
        else
        {
            res.status(401).send("No authorization.");
        };
    }
    catch(error)
    {
        console.log(error);
    };
});


module.exports = router;