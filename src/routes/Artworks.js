const { Router } = require("express");
const { Op } = require("sequelize");
const router = Router();
const { Artwork, Category, Profile } = require("../db.js");

const getArtWorks = async (req, res, next) => {
  try {
    const { name, from = 0 } = req.query;

    if (!name) {
      let artWorks = await Artwork.findAll({
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
            attributes: ["name", "img"],
          },
        ],
        limit: 12,
        offset: from * 12,
      });
      artWorks.map((e) => {
        // console.log(artWorks)
        return {
          id: e.id,
          img: e.img,
          imgCompress: e.imgCompress,
          title: e.title,
          content: e.content,
          category: e.categories[0].title,
          likes: e.likes,
          price: e.price,
        };
      });
      let counter = await Artwork.count();

      res.status(200).json({ artWorks, counter });
    } else {
      //  return artWorks.filter(e=> e.title.toLowerCase() === name.toLowerCase())
      let counter = await Artwork.count({
        where: { title: { [Op.iLike]: `%${name}%` } },
      });
      let artWorks = await Artwork.findAll({
        where: { title: { [Op.iLike]: `%${name}%` } },
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
            attributes: ["name", "img"],
          },
        ],
        limit: 12,
        offset: from * 12,
      });
      res.json({ artWorks, counter });
    }
  } catch (error) {
    next(error);
  }
};

//#region

//------- PAGINADO --------
// function  paginado(){

//   const from = Number(req.query.from) || 0;
//   const registerpp = 5;

//   const [users, total] = await Promise.all([
//     Usuario.find({}, "title").skip(from).limit(registerpp),
//     Usuario.countDocuments()
//   ])

//   res.json({
//     ok: true,
//     msg: "getArtWorks",
//     users,
//     page: {
//       from,
//       registerpp,
//       total
//     }
//   })
// }
// router.get("/", async (req, res) => {
//   const from = Number(req.query.from) || 0;
//   const registerpp = 6;

//   const [obras, total] = await Promise.all([
//     Artwork.findAll({ limit: registerpp, offset: from * registerpp }),
//     Artwork.count(),
//   ]);
//   // const obras = await  Artwork.findAll({limit:3,skip:0})
//   // const total = await Artwork.count()

//   res.json({
//     ok: true,
//     msg: "getArtWorks",
//     obras,
//     page: {
//       from,
//       registerpp,
//       total,
//     },
//   });
//   console.log(await paginado(Artwork,from))
//   res.json(await paginado(Artwork, from));

// });
//#endregion

router.get("/", getArtWorks);
// ruta de detalle
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    let artWork = await Artwork.findAll({
      include: [{
        model: Category,
        attributes: ["title"],
        through: {
          attributes: []
        }},{
          model: Profile,
          attributes: ["name","img"]
        }
      ],
      where: { id: id },
    });
    res.status(200).json(artWork);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// ------------------------------- POST -------------------------------
const postArtWork = async (req, res, next) => {
  const { title, content, category, price, img, imgCompress, id } = req.body;
  try {
    let profileMatch = await Profile.findByPk(id);

    let categoryMatch = await Category.findAll({
      where: { title: category },
    });
    // console.log(Artwork)

    if (profileMatch && categoryMatch) {
      let artWorkCreate = await Artwork.create({
        title,
        content,
        price,
        img,
        imgCompress,
      });
      await artWorkCreate.setCategories(categoryMatch);
      await profileMatch.addArtwork(artWorkCreate);
      res.status(200).json(artWorkCreate);
    }
  } catch (error) {
    next(error);
  }
}; 

router.post("/", postArtWork);

// ------------------------------- DELETE -------------------------------
const deleteArtWork = async (req, res, next) => {
  const { id } = req.params;
  try {
    const artWorkToDelete = await Artwork.findByPk(id);
    artWorkToDelete.destroy();
    res.status(200).send("Artwork deleted from DB!");
  } catch (error) {
    next(error);
  }
};
router.delete("/:id", deleteArtWork);

// ------------------------------- UPDATE -------------------------------

const putArtWork = async (req, res,next) => {
  try {
    const { id } = req.params;
    const { title, content, category, price, img } = req.body;
    let updatedArtWork = await Artwork.findOne({
      where: {
        id: id,
      },
    });
    await updatedArtWork.update({
      title,
      content,
      price,
      img,
    });
    let categoriesFromDb = await Category.findAll({
      where: { title: category },
    });
    await updatedArtWork.setCategories(categoriesFromDb);
    res.status(201).json(updatedArtWork);
  } catch (error) {
  next(error)
  }
};
router.put("/:id", putArtWork);

module.exports = router;
