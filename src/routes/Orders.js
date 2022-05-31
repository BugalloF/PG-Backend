const { Router } = require("express");
const router = Router();
const { Artwork } = require("../db.js");



// -------------------------------- ORDENAMIENTOS -------------------- //


router.get("/likes", async (req, res,next) => {
    const { k ,from = 0} = req.query;
    
    try{
        
    if (k === "ASC" || k === "DESC") {
        let artWorks = await Artwork.findAll({
          order: [["likes", k]],
          limit: 12,
          offset: from * 12,
        });

        let counter = await Artwork.count()
        res.status(200).json({artWorks,counter});
      }else res.status(404).send('invalid query')
    }catch(err){
        next(err)
    }
  });
  
  router.get("/price", async (req,res,next) => {
    const { k ,from = 0 } = req.query;

   try{
    if (k === "ASC" || k === "DESC") {
        let artWorks = await Artwork.findAll({
          order: [["price", k]],
          limit: 12,
          offset: from * 12,
        });
        let counter = await Artwork.count();
        res.status(200).json({ artWorks, counter });
      }else res.status(404).send('invalid query')
   }catch(err){
       next(err)
   }
  });
  
  router.get("/k", async (req, res, next) => {

    const { k ,from=0 } = req.query;

    try{
        if (k === "ASC" || k === "DESC") {
            let artWorks = await Artwork.findAll({
              order: [["createdAt", k]],
              include: {
                model: Category,
                attributes: ["title"],
                through: {
                  attributes: [],
                },
              },
              limit: 12,
              offset: from * 12,
            });
            let counter = await Artwork.count();
            res.status(200).json({ artWorks, counter });
          }else res.status(404).send('invalid query')
          
    }catch(err){
        next(err)
    }
  });
  
  module.exports = router;