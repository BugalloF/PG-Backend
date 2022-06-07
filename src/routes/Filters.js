// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {Artwork, Category, Profile} = require("../db.js");


router.get("/category", async (req, res,next) => {
  const { category, from =0} = req.query;
  
  try {
    let Artworks = await Artwork.findAll({
      include: [{
        model: Category,
        where: {title: category},
        attributes: ["title"],
        through: {
          attributes: [],
        }, 
      }],
      limit: 12,
      offset: from * 12,
      attributes:['imgCompress','id','likes','price','title'],
    });
    let counter = await Artwork.count();
    res.status(200).json({Artworks,counter});
    
  } catch (error) {
    next(error)
  }
});
// -------------------------------- ORDENAMIENTOS --------------------
router.get("/likes", async (req, res,next) => {
  const { likes,from =0} = req.query;
  
try {
  if (likes === "ASC" || likes === "DESC") {
    let Artworks = await Artwork.findAll({

      include: [
        {
          model: Category,
          attributes: ["title"],
          through: {
            attributes: [],
          }, 
        },
        {
          model: Profile,
          attributes: ["name", "img", "country"],
        },
      ],
      order: [["likes", likes]],
      limit: 12,
      offset: from * 12,

    });
    let counter = await Artwork.count();
    res.status(200).json({Artworks,counter});
  }
  
} catch (error) {
  next(error)
}
});

router.get("/price", async (req, res,next) => {
  const { price,from=0 } = req.query;
  
  try {
    if (price === "ASC" || price === "DESC") {
      let Artworks = await Artwork.findAll({

        include: [
          {
            model: Category,
            attributes: ["title"],
            through: {
              attributes: [],
            }, 
          },
          {
            model: Profile,
            attributes: ["name", "img", "country"],
          },
        ],

        order: [["price", price]],
        limit: 12,
        offset: from * 12,
      });
      let counter = await Artwork.count();
      res.status(200).json({ Artworks, counter });
    }
    
  } catch (error) {
    next(error)
  }
});

router.get("/antiquity", async (req, res,next) => {
  try {
    const { antiquity,from=0 } = req.query;

    if (antiquity === "ASC" || antiquity === "DESC") {
      let Artoworks = await Artwork.findAll({
        order: [["createdAt", antiquity]],

        include: [
          {
            model: Category,
            attributes: ["title"],
            through: {
              attributes: [],
            }, 
          },
          {
            model: Profile,
            attributes: ["name", "img", "country"],
          },
        ],

        limit: 12,
        offset: from * 12,
      });
      let counter = await Artwork.count();
      res.status(200).json({ Artoworks, counter });
    
  } }catch (error) {
    next(error)
  }
  
});

module.exports = router;
