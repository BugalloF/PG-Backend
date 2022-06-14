const {Router} = require("express");
const router = Router();
const {Transactions} = require("../db.js");
const { Op } = require("sequelize")



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

        const {name, from = 0, by, type} = req.query
        var order = null;
        if(by && type) order = 'order'

        if(name){
            const result = await Transactions.findAll({
                where:{
                    [Op.or]:[
                        {userSeller: name},
                        {userPayer: name}
                    ]
                },
                limit: 12,
                offset: 12 * from
    
            })

            const counter = await Transactions.count({
                where:{
                    [Op.or]:[
                        {userSeller: name},
                        {userPayer: name}
                    ]
                }

            })

            return res.status(201).json({result,counter})
        }

        const result = await Transactions.findAll({
            [order] :[[by,type]],
            limit: 12,
            offset: 12 * from

        })

        const counter = await Transactions.count()

        

        

        res.status(201).json({result,counter})
        
    }catch(error){
        next(error)
    }
})



module.exports = router;