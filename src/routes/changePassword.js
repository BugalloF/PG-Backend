// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {Profile} = require("../db");
const {encrypt, compare} = require("../controllers/bcrypt");


router.put("/:id", async (req, res) => {
    const {id} = req.params;
    const {oldPassword, password} = req.body;
    
    try
    {
        if(id && oldPassword && password)
        {
            const foundUser = await Profile.findByPk(id).catch(e => console.log(e));
            
            if(foundUser !== undefined && foundUser !== null && Object.keys(foundUser).length)
            {
                const foundPassword = foundUser.password;
                const checkPassword = await compare(oldPassword, foundPassword);
                
                if(checkPassword)
                {
                    const passwordHash = await encrypt(password);
                    
                    await foundUser.update({
                        password: passwordHash,
                    });
                    
                    res.send("Password updated.");
                }
                else
                {
                    res.status(404).send("Incorrect password.");
                };
            }
            else
            {
                res.status(404).send("Cannot find any user with this id");
            };
        }
        else
        {
            res.status(404).send("Complete all fields.");
        };
    }
    catch(error)
    {
        console.log(error);
    };
});


module.exports = router;