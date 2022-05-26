const { Router } = require("express");
const router = Router();
const { Artwork, Category,Profile } = require("../db.js");

const getArtWorks = async () => {
    try {
      let artWorks = await Artwork.findAll({
        include: {
          model: Category,
          attributes: ["title"],
          through: {
            attributes: [],
          },
        },
      });
      return artWorks.map((e) => {
        // console.log(artWorks)
        return {
          id: e.id,
          img: e.img,
          title: e.title,
          content: e.content,
          category: e.categories[0].title,
          likes: e.likes,
          price: e.price,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  // ------------------------------- GET CONTROLLERS -------------------------------
  router.get("/", async (req, res) => {
    try {
      let art = await getArtWorks();
      res.status(201).json(art);
    } catch (error) {
      console.log(error);
    }
  });

  // ------------------------------- POST -------------------------------
const postArtWork = async (req, res) => {
    try {
      const { title, content, category, price, img ,id} = req.body;
      let artWorkCreate = await Artwork.create({
        title,
        content,
        price,
        img,
      });
      let categoryMatch = await Category.findAll({
        where: { title: category },
      });
      // console.log(Artwork)
      await artWorkCreate.addCategories(categoryMatch);
  
      let profileMatch = await Profile.findByPk(id)
  
      await artWorkCreate.addProfile(profileMatch)
      res.status(200).json(artWorkCreate);
    } catch (error) {
      console.log(error);
      res.status(404).send("Cannot create the Artwork!.");
    }
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
