const { Router } = require("express");
const { Op } = require("sequelize");
const router = Router();
const upload = require("../multer/multer.js")
const  checkAuth  = require('./auth/auth.js')
const { Artwork, Category, Profile } = require("../db.js");

const getArtWorks = async (req, res, next) => {
  try {
    const { name, from = 0 } = req.query;

    if (!name) {
      let artWorks = await Artwork.findAll({
        include: [{
          model: Category,
          attributes: ["title"],
          through: {attributes:[],}
         },
         {
            model: Profile,
            attributes: ["userName","img"]
          }
        ],
        limit: 12,
        offset: from * 12,
      });
      
      let counter = await Artwork.count();

      res.status(200).json({ artWorks, counter });
    } else {

      let counter = await Artwork.count({
        where: { title: { [Op.iLike]: `%${name}%` } },
      });
      
      let artWorks = await Artwork.findAll({
        where: { title: { [Op.iLike]: `%${name}%` } },
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
        limit: 12,
        offset: from * 12,
      });
      res.json({artWorks,counter});
    }
  } catch (err) {
    next(err)
  }
};

router.get("/",checkAuth,getArtWorks);



// ruta de detalle
router.get("/:id", async (req,res,next) => {
  try {
    const { id } = req.params;
    let artWork = await Artwork.findAll({
      include: [{
        model: Category,
        attributes: ["title"],
        through: {attributes:[],}
       },{
          model: Profile,
          attributes: ["id","userName","img"]
        }
      ],
      where: { id: id },
    });
    res.status(200).json(artWork);
  } catch (err) {
    next(err)
  }
});
// ------------------------------- POST -------------------------------
const postArtWork = async (req,res,next) => {
  const { title, content, category, price, imgCompress, id } = req.body;

  
    try {
    
      let categoryMatch = await Category.findOne({
        where: { title: category },

      });

      let profileMatch = await Profile.findByPk(id)

     if(categoryMatch && profileMatch){
      let artWorkCreate = await Artwork.create({
        title,
        content,
        price,
        img: req.files.original[0].filename,
        imgCompress: req.files.compress[0].filename,
      });

      await artWorkCreate.setCategories(categoryMatch);
      await profileMatch.addArtwork(artWorkCreate);

      res.status(201).json(artWorkCreate)
     }else{
       !profileMatch ? res.status(404).send('not match profile') : res.status(404).send('category not exist')
     }
         
    } catch (err) {
      next(err)
      
    }
  
};

router.post("/",upload.fields([{name:'original'},{name:'compress'}]), postArtWork);

// ------------------------------- DELETE -------------------------------
const deleteArtWork = async (req, res, next) => {
  const { id } = req.params;
  try {
    const artWorkToDelete = await Artwork.findByPk(id);
    artWorkToDelete.destroy();
    res.status(200).send("Artwork deleted from DB!");
  } catch (err) {
    next(err)
  }
};
router.delete("/:id", deleteArtWork);

// ------------------------------- UPDATE -------------------------------
const putArtWork = async (req,res,next) => {
  try {
    const { id } = req.params;

    const { title, content, category, price, img } = req.body;

    let updatedArtWork = await Artwork.findOne({
      where: {
        id: id,
      },
    });

    if(updatedArtWork){

      await updatedArtWork.update({
        title,
        content,
        price,
        img,
      });
      let categoriesFromDb = await Category.findAll({
        where: { title: category },
      });
      let updated = await updatedArtWork.setCategories(categoriesFromDb);
      res.status(201).json(updated);
    }else res.status(404).send('id artwork not match')

  } catch (err) {
    next(err)
  }
};

router.put("/:id", putArtWork);

module.exports = router;
