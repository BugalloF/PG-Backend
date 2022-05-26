const { Router } = require("express");
const router = Router();
const { Category } = require("../db.js");


const getCategories = async (req,res) => {
  try {
    let categories = await Category.findAll()

     categories.map((e) => {
      // console.log(artWorks)
      return {
        id: e.id,
        title: e.title,
      };
    });
    res.status(200).json(categories)
  } catch (error) {
    console.log(error);
  }
};

router.get("/", getCategories);

const postCategory = async (req, res) => {
    try {
      const { category } = req.body;
      let catCreate = await Category.create({
        title: category,
      });
  
      res.status(200).json(catCreate);
    } catch (error) {
      console.log(error);
      res.status(404).send("Cannot create the category!.");
    }
  };
router.post("/", postCategory);

  module.exports = router;
