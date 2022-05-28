const { Router } = require("express");
const { Op } = require("sequelize");
const router = Router();
const { Artwork, Category, Profile } = require("../db.js");

const getArtWorks = async (req, res) => {
  try {
    const { name, from=0 } = req.query;
     
    if (!name) {
      let artWorks = await Artwork.findAll({
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
      let counter = await Artwork.count()

      res.status(200).json({artWorks,counter});
    } else {
      //  return artWorks.filter(e=> e.title.toLowerCase() === name.toLowerCase())
      let found = await Artwork.findAll({
        where: { title: { [Op.iLike]: `%${name}%` } },
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
      res.json(found);
    }
  } catch (error) {
    console.log(error);
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
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let artWork = await Artwork.findAll({
      include: {
        model: Category,
        attributes: ["title"],
        through: {
          attributes: [],
        },
      },
      where: { id: id },
    });
    res.status(200).json(artWork);
  } catch (error) {
    console.log(error);
  }
});
// ------------------------------- POST -------------------------------
const postArtWork = async (req, res) => {
  const { title, content, category, price, img, imgCompress, id } = req.body;
  if (id && category) {
    try {
      let artWorkCreate = await Artwork.create({
        title,
        content,
        price,
        img,
        imgCompress,
      });
      let categoryMatch = await Category.findAll({
        where: { title: category },
      });
      // console.log(Artwork)
      await artWorkCreate.setCategories(categoryMatch);

      let profileMatch = await Profile.findByPk(id);

      await profileMatch.addArtwork(artWorkCreate);
      res.status(200).json(artWorkCreate);
    } catch (error) {
      console.log(error);
      res.status(404).send("Cannot create the Artwork!.");
    }
  } else res.status(404).send("No se puedo postear la obra!");
};
router.post("/", postArtWork);

// ------------------------------- DELETE -------------------------------
const deleteArtWork = async (req, res) => {
  const { id } = req.params;
  try {
    const artWorkToDelete = await Artwork.findByPk(id);
    artWorkToDelete.destroy();
    res.status(200).send("Artwork deleted from DB!");
  } catch (error) {
    console.log(error);
  }
};
router.delete("/:id", deleteArtWork);

// ------------------------------- UPDATE -------------------------------

const putArtWork = async (req, res) => {
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
    res.status(400).send(error);
  }
};
router.put("/:id", putArtWork);

module.exports = router;
