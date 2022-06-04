const { Router } = require("express");
const router = Router();
const { Artwork, Category, Profile } = require("../db.js");

router.get("/country", async (req, res,next) => {
  const { country, from =0} = req.query;
  try {
    // console.log(country)
    let filtered = await Artwork.findAll({

      include: [
        {
          model: Profile,
          where: { country: country },
        },      
        {
          model: Category,
          attributes: ["title"],
          through: {
            attributes: [],
          }, 
        },
      ],

      limit: 12, 
      offset: from * 12,

    });
    // console.log(filtered)

    res.status(200).json(filtered);
  } catch (error) {
    next(error)
  }
});

router.get("/category", async (req, res,next) => {
  const { category, from =0} = req.query;
  // // console.log(category)
  // try {
  //   let allArtWorks = await getArtWorks();
  //   if (category === "all") res.status(200).json(allArtWorks);
  //   else {
  //     let filteredArtWoks = allArtWorks.filter((e) => e.category === category);
  //     // console.log(filteredArtWoks)
  //     res.status(200).json(filteredArtWoks);
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
  // Ahora lo hacemos como se tinee que hacer :
  try {
    let Artworks = await Artwork.findAll({
      include: [{
        model: Category,
        attributes: ["title"],
        through: {
          attributes: [],
        }, 
      }],
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
  // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',likes)
  // let allArtWorks = await getArtWorks();
  // if (likes === "Asc") {
  //   allArtWorks.sort((a, b) => {
  //     return b.likes - a.likes;      ESTO ES LOO QUE NO HAY QUE HACER
  //   });
  // } else {
  //   allArtWorks.sort((a, b) => {
  //     return a.likes - b.likes;
  //   });
  // }
  //Ahora como se debe
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
  // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',likes)
  // let allArtWorks = await getArtWorks();
  // if (price === "Asc") {
  //   allArtWorks.sort((a, b) => {
  //     return b.price - a.price;
  //   });
  // } else {
  //   allArtWorks.sort((a, b) => {
  //     return a.price - b.price;
  //   });
  // }
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
    // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',likes)
    // let allArtWorks = await getArtWorks();
    // if (antiquity === "Recently") res.status(200).json(allArtWorks.reverse());
    // else res.status(200).json(allArtWorks);
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
