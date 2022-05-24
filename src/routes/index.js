const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const { Artwork, Category } = require("../db.js");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
// ------------------------------- GET UTILS -------------------------------
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
        name: e.name,
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
router.get("/arte", async (req, res) => {
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
    const { title, content, category, price, img } = req.body;
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

    res.status(200).json(artWorkCreate);
  } catch (error) {
    console.log(error);
    res.status(404).send("Cannot create the Artwork!.");
  }
};

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

router.post("/art", postArtWork);

router.post("/categories", postCategory);
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
router.delete("/art/:id", deleteArtWork);
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

router.put("/art/:id", putArtWork);

// ------------------------------- FILTERS -------------------------------
/*Por Pais de origen
Por Precio
Por Likes
Por Categorias
Por Tiempo Publicado*/
router.get("/filter/category", async (req, res) => {
  const { category } = req.query;
  // console.log(category)
  try {
    let allArtWorks = await getArtWorks();
    if (category === "all") res.status(200).json(allArtWorks);
    else {
      let filteredArtWoks = allArtWorks.filter((e) => e.category === category);
      // console.log(filteredArtWoks)
      res.status(200).json(filteredArtWoks);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/filter/likes", async (req, res) => {
  const { likes } = req.query;
  // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',likes)
  let allArtWorks = await getArtWorks();
  if (likes === "Asc") {
    allArtWorks.sort((a, b) => {
      return b.likes - a.likes;
    });
  } else {
    allArtWorks.sort((a, b) => {
      return a.likes - b.likes;
    });
  }
  res.status(200).json(allArtWorks);
});

router.get("/filter/price", async (req, res) => {
  const { price } = req.query;
  // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',likes)
  let allArtWorks = await getArtWorks();
  if (price === "Asc") {
    allArtWorks.sort((a, b) => {
      return b.price - a.price;
    });
  } else {
    allArtWorks.sort((a, b) => {
      return a.price - b.price;
    });
  }
  res.status(200).json(allArtWorks);
});

router.get("/filter/antiquity", async (req, res) => {
  const { antiquity } = req.query;
  // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',likes)
  let allArtWorks = await getArtWorks();
  if (antiquity === "Recently") res.status(200).json(allArtWorks.reverse());
  else res.status(200).json(allArtWorks);
});
module.exports = router;
