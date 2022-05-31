const { Router } = require("express");
const router = Router();
const { Category } = require("../db.js");

const getCategories = async (req,res,next) => {
  try {

    let categories = await Category.findAll();
    res.status(200).json(categories);

  } catch (err) {
    next(err)
  }
};

router.get("/", getCategories);

const postCategory = async (req,res,next) => {
  try {
    const { category } = req.body;

    let catCreate = await Category.create({
      title: category,
    });

    res.status(200).json(catCreate);
  } catch (err) {
    next(err)
  }
};
router.post("/", postCategory);

module.exports = router;
