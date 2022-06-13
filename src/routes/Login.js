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
            const foundUser = await Profile.findOne({
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
        
        if(foundUser.dataValues.is_banned){

            function sumarDias(){
                let fechita= new Date().toISOString().split('T')[0];
                return fechita;
              }

              console.log(sumarDias(),'sumardias')
              console.log(foundUser.dataValues.banned_time)

              if(sumarDias() == foundUser.dataValues.banned_time){

                

                

                await foundUser.update({
                    is_banned:false,
                    banned_time:null
                })
              }else{
                                
                    return res.status(200).json({is_banned:foundUser[0].dataValues.is_banned,banned_time:foundUser[0].dataValues.banned_time})
        
              }

        }
           
            if(foundUser.length)
            {
                const foundPassword = foundUser.dataValues.password;
                const checkPassword = await compare(password, foundPassword);
                const token = await signToken(foundUser.dataValues);
                
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