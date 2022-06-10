// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {Artwork, Category} = require("../db.js");


router.get("/category", async (req, res,next) => {

  const { category, from =0, by, type } = req.query;

  var order = null;

  if(by && type) order = 'order';
 
  try { 

    let Artworks = await Artwork.findAll({
      include: [{
        model: Category,
        where: {title: category},
        attributes: ["title"],
        through: {
          attributes: [],
        }, 
        
      },
      {
        model: Profile,

        attributes: ["userName", "img", "id", "country"],
      },
    ],
      [order]: [[by, type]],
      limit: 12,
      offset: from * 12,
      attributes:['imgCompress','id','likes','price','title'],
    });

    let counter = await Artwork.count({
      include: [{
        model: Category,
        where: {title: category},
      }],
    });

    res.status(200).json({Artworks,counter});
    
  } catch (error) {

    next(error)

  }
});;


module.exports = router;
