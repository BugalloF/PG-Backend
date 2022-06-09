// Dependencies
const {Router} = require("express");
const router = Router();
const {Op} = require("sequelize");
// Files
const {Profile} = require("../db");
const {signTokenForResetPassword} = require("../controllers/tokens");
const {sendEmail} = require("../controllers/nodemailer");


router.post("/", async (req, res) => {
    const {user} = req.body;
    
    try
    {
        const foundUser = await Profile.findAll({
            where:
            {
                // Para iniciar sesion con usuario o mail
                [Op.or]:
                [
                    {userName: user},
                    {email: user},
                ],
            },
        });
        
        if(foundUser.length)
        {
            const id = foundUser[0].dataValues.id;
            const email = foundUser[0].dataValues.email;
            const token = await signTokenForResetPassword(foundUser[0].dataValues);
            
            await sendEmail(email, id);
            
            res.send(token);
        }
        else
        {
            res.status(404).send("Cannot find any user with tihs username or email.");
        };
    }
    catch(error)
    {
        console.log(error);
    };
});


module.exports = router;