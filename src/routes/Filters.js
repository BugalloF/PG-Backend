const { Router } = require("express");
const router = Router();
const { Artwork, Category, Profile } = require("../db.js");
const {Op} = require('sequelize')

router.get("/country", async (req,res,next) => {
  const { k, from =0} = req.query;
  try {
    let artWorks = await Artwork.findAll({
      include: {
        model: Profile,
        attributes:["id","userName","img"],
        where:{  country: { [Op.iLike] : `%${k}%`} },

      },
      limit: 12,
      offset: from * 12,
    });

    let counter = await Artwork.count({
      include: {
        model: Profile,
        attributes:["id","userName","img"],
        where:{  country: { [Op.iLike] : `%${k}%`} },
      }

    })
    res.status(200).json({artWorks,counter});
  } catch (err) {
    next(err)
  }
});

router.get("/category", async (req,res,next) => {
  const { k, from = 0} = req.query;

  try{
    let artWorks = await Artwork.findAll({
      include: {
        model: Category,
        attributes: ["title"],
        where: {
          title: {[Op.iLike]: `%${k}%`},
        },
      },
      limit: 12,
      offset: from * 12,
    });

    let counter = await Artwork.count({
      include: {
        model: Category,
        attributes: ["title"],
        where: {
          title: {[Op.iLike]: `%${k}%`},
        },
      }
    })
    res.status(200).json({artWorks,counter});
 
  }catch(err){
    next(err)
  }
});


module.exports = router;
