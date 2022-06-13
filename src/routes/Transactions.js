const {Router} = require("express");
const router = Router();
const {Transactions} = require("../db.js");




router.post('/',async (req,res,next)=>{
    try{

        const {userSeller,userPayer,title,price,email} = req.body


       const result = await Transactions.create({
        userSeller,
        userPayer,
        title,
        price,
        email
        })

        res.status(201).json(result)

    }catch(error){
        next(error)
    }
})


router.get('/',async (req,res,next)=>{
    try{

        const result = await Transactions.findAll()

        

        

        res.status(201).json(result)
        
    }catch(error){
        next(error)
    }
})



module.exports = router;