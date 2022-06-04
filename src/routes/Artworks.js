  const { Router } = require("express");
  const { Op } = require("sequelize");
  const router = Router();
  const { Artwork, Category, Profile } = require("../db.js");



// --------------------------GET-------------------------------- //

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
            attributes: ["userName", "img","id"],
          },
        ],
        attributes:['imgCompress','id','likes','price'],
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
        attributes: {exclude: ['img']},
        limit: 12,
        offset: from * 12,
      });
      res.json({ artWorks, counter });
    }
  } catch (error) {
    next(error);
  }
};

router.get("/", getArtWorks);
// ruta de detalle
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    let artWork = await Artwork.findAll({
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
      where: { id: id },
    });
    res.status(200).json(artWork);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// ------------------------------- POST ------------------------------- //
const postArtWork = async (req, res, next) => {



  const {title,content,price,category,id,original,compress} = req.body

 
  try {
    let categoryMatch = await Category.findOne({
      where: { title: category },
    });

    let profileMatch = await Profile.findByPk(id);

    if (categoryMatch && profileMatch) {
      let artWorkCreate = await Artwork.create({
        title,
        content,
        price,
        img: original,
        imgCompress: compress,
      });

      await artWorkCreate.setCategories(categoryMatch);
      await profileMatch.addArtwork(artWorkCreate);

      res.status(201).json(artWorkCreate);
    } else {
      !profileMatch
        ? res.status(404).send("not match profile")
        : res.status(404).send("category not exist");
    }
  } catch (err) {
    next(err);
  }
};
router.post("/",postArtWork);

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

// ------------------------------- UPDATE ------------------------------- //

const putArtWork = async (req, res, next) => {
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
    next(error);
  }
};
router.put("/:id", putArtWork);

module.exports = router;
