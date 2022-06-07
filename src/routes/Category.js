// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {Category} = require("../db.js");
const {API_KEY} = process.env;


const getCategories = async (req, res,next) => {
  const {apiKey} = process.env;
  
  if(apiKey === API_KEY)
  {
    try {
      let categories = await Category.findAll();
  
      categories.map((e) => {
        // console.log(artWorks)
        return {
          id: e.id,
          title: e.title,
        };
      });
      res.status(200).json(categories);
    } catch (error) {
      next(error)
    }
  }
  else
  {
    res.status(401).send("No authorization.");
  };
};

router.get("/", getCategories);

const postCategory = async (req, res,next) => {
  try {
    const { category } = req.body;
    let catCreate = await Category.create({
      title: category,
    });

    res.status(200).json(catCreate);
  } catch (error) {
    console.log(error);
    next(error) 
  }
};
router.post("/", postCategory);

module.exports = router;
