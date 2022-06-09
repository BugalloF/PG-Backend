// Dependencies
const {Router} = require("express");
const router = Router();
const {Op} = require("sequelize");
// Files
const {Artwork, Category, Profile, Likes} = require("../db.js");
const {verifyToken} = require("../controllers/tokens");
const {API_KEY} = process.env;



// --------------------------GET-------------------------------- //

const getArtWorks = async (req, res, next) => {
  const {apiKey} = req.query;
  
  if(apiKey === API_KEY)
  {
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

              attributes: ["userName", "img", "id", "country"],
            },
          ],
          attributes: ["imgCompress", "id", "likes", "price", "title"],
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

              attributes: ["userName", "img", "id", "country"],
            },
          ],
          attributes: ["imgCompress", "id", "likes", "price", "title"],
          limit: 12,
          offset: from * 12,
        });
        res.json({ artWorks, counter });
      }
    } catch (error) {
      next(error);
    }
  }
  else
  {
    res.status(401).send("No authorization.");
  };
};

router.get("/", getArtWorks);
// ruta de detalle
router.get("/:id", async (req, res, next) => {
  const {apiKey} = req.query;
  
  if(apiKey === API_KEY)
  {
    try {
      const { id } = req.params;
      const { authorization } = req.headers;
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
            attributes: ["userName", "img", "id"],
          },
        ],
        attributes: { exlude: ["img"] },
        where: { id: id },
      });
      
      let likes = await Likes.findAll({
        where: { idPost: id },
      });
      let likesCounter = likes.length;
      
      if (authorization) {
        const token = authorization.split(" ").pop();
        const tokenData = await verifyToken(token);
        const idUser = tokenData !== undefined ? tokenData.id : null;
        // console.log('aaaaaaaaaaaaaaaaaaa')
        if (idUser) {
          let isLiked = false;
          // Array.from(likes, ({ dataValues }) => {
          //   if (dataValues.idUser === idUser) {
          //     isLiked = true;
          //   }
          // });
          let search= await Likes.findAll({
            where: [{ idUser: idUser },{idPost:id}],
          });
          console.log('soyyy',search)
          console.log('soyyylengthhhh',search.length)
          if(search.length>0) isLiked=true

          res.status(200).json({ artWork, likesCounter, isLiked });
        }
      }
      else {
        res.status(200).json({ artWork, likesCounter })
        // console.log('bbbbbbbbbbbbbb',likesCounter)  
      };
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }
  else
  {
    res.status(401).send("No authorization.");
  };
});


// ------------------------------- POST ------------------------------- //

const postArtWork = async (req, res, next) => {
  const { title, content, price, category, id, original, compress } = req.body;

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

router.post("/likes/:id", async (req, res, next) => {
  try {
    const  idPost  = req.params.id;
    const { authorization } = req.body.headers;
    // console.log('Authorization:',authorization)
    // console.log('Req:',req.params)
    // console.log('POSTTT',idPost)
    if (authorization) {
      const token = authorization.split(" ").pop();
      const tokenData = await verifyToken(token);
      const idUser = tokenData !== undefined ? tokenData.id : null;
      let likeador = await Profile.findByPk(idUser);

      if (likeador) {
        await Likes.create({
          idPost: idPost,
          idUser: idUser,
        });

        res.status(200).send("Likeado!");
      } else {
        res.status(409).send("Invalid token.");
      }
    } else {
      res.status(401).send("No authorization.");
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/likes/:id", async (req, res, next) => {
  try {
    const  idPost  = req.params.id;
    const  idUser  = req.body.idUser;
    // console.log(req.body)
    await Likes.destroy({
      where: [{ idUser: idUser }, { idPost: idPost }],
    });
    res.status(200).send("Has quitado tu like ! ");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
