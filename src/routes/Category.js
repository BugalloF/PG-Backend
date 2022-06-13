// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {Category, Artwork} = require("../db.js");
const {API_KEY} = process.env;


const getCategories = async (req, res,next) => {
  const {apiKey} = req.query;
  
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
    next(error) 
  }
};
router.post("/", postCategory);

const deleteCategory = async (req, res,next) => {
  try {
    const { id } = req.params;
    let artworks = await Artwork.findAll({
      include:{
        model:Category,
        where: {id: id}
      }
    })
    if(artworks){

      let ARTWORKS_IDS_ARRAY = artworks.map( e => e.id)
      await Artwork.destroy({
        where:{ id: ARTWORKS_IDS_ARRAY}
      })
    }
     await Category.destroy({
      where: {id: id}
    });

    res.status(201).send('Success');
  } catch (error) {
    next(error) 
  }
};
router.delete("/:id", deleteCategory);

const putCategory = async (req, res,next) => {
  try {
    const { id } = req.params;
    const { title } = req.body

    const category = await Category.findByPk(id)

     await category.update({
      title: title
    });

    res.status(201).json(category);
  } catch (error) {
    next(error) 
  }
};
router.put("/:id", putCategory);

const countCategory = async (req,res,next) => {
  try{
    const count = await Category.count()

    res.status(200).json(count)

  }catch(error){
    next(error)
  }
}

router.get("/count", countCategory)



module.exports = router;
