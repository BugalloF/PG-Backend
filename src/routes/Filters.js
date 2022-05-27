const { Router } = require("express");
const router = Router();
const { Artwork, Category, Profile } = require("../db.js");

router.get("/category", async (req, res) => {
  const { category } = req.query;
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
  let filtered = await Artwork.findAll({
    include: {
      model: Category,
      attributes: ["title"],
      through: {
        attributes: [],
      },
      where: {
        title: category,
      },
    },
  });
  res.status(200).json(filtered);
});

router.get("/likes", async (req, res) => {
  const { likes } = req.query;
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

  if (likes === "ASC" || likes === "DESC") {
    let ordered = await Artwork.findAll({ order: [["likes", likes]] });
    res.status(200).json(ordered);
  }
});

router.get("/price", async (req, res) => {
  const { price } = req.query;
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
  if (price === "ASC" || price === "DESC") {
    let ordered = await Artwork.findAll({ order: [["price", price]] });
    res.status(200).json(ordered);
  }
});

router.get("/antiquity", async (req, res) => {
  const { antiquity } = req.query;
  // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',likes)
  // let allArtWorks = await getArtWorks();
  // if (antiquity === "Recently") res.status(200).json(allArtWorks.reverse());
  // else res.status(200).json(allArtWorks);
  if (antiquity === "ASC" || antiquity === "DESC") {
    let ordered = await Artwork.findAll({
      order: [["createdAt", antiquity]],
      include: {
        model: Category,
        attributes: ["title"],
        through: {
          attributes: [],
        },
      },
    });
    res.status(200).json(ordered);
  }
});

router.get("/country", async (req, res) => {
  const { country } = req.query;
  let filtered = await Artwork.findAll({
    include: {
      model: Profile,
      attributes: ["country"],
      through: {
        attributes: [],
      },
      where: {
        country: country,
      },
    },
  });
  res.status(200).json(filtered);
});

module.exports = router;
