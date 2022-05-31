const { Router } = require("express");
const router = Router();
const { Profile } = require('F:\\PG\\src\\db.js');
const bcrypt = require('bcrypt')
const {tokenSign} = require('./jwt.js')
router.post('/', async (req,res,next) =>{
   const {userName, password} = req.body;


   try{
       const user = await Profile.findOne({where:{userName}})

       const passwordValidator = bcrypt.compare(password,user.password)
       if(user && passwordValidator){
           const token = await tokenSign(user)

           res.status(200).json({
               name: user.name,
               username: user.userName,
               token

           })

       }
   }catch(err){
       next(err)
   }
})



module.exports = router