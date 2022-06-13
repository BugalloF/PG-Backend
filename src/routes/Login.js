// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {Profile} = require("../db");
const {compare} = require("../controllers/bcrypt");
const {signToken} = require("../controllers/tokens");
const {Op} = require("sequelize");


router.post("/", async (req, res, next) => {
    const {user, password} = req.body;
    try
    {
        if(user && password)
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


            

        if(foundUser[0].dataValues.is_banned){
            console.log('hola')
            return res.status(200).json({is_banned:foundUser[0].dataValues.is_banned,banned_time:foundUser[0].dataValues.banned_time})

        }

            
            if(foundUser.length)
            {
                const foundPassword = foundUser[0].dataValues.password;
                const checkPassword = await compare(password, foundPassword);
                const token = await signToken(foundUser[0].dataValues);
                
                if(checkPassword)
                {
                    res.send({foundUser, token});
                }
                else
                {
                    res.status(404).send("Incorrect user or password.");
                };
            }
            else
            {
                res.status(404).send("Incorrect user or password.");
            }
        }
        else
        {
            res.status(404).send("All fields are required.");
        };
    }
    catch(error)
    {
        next(error);
    };
});


module.exports = router;