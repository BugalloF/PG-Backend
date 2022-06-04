const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const artRouter = require("./Artworks.js");
const profileRouter = require("./Profile.js");
const filtersRouter = require("./Filters.js");
const categoryRouter = require("./Category.js");
const sendMail = require("./sendMail.js")
const login = require("./Login");
const register = require("./Register");
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/art", artRouter);
router.use("/filter", filtersRouter);
router.use("/profile", profileRouter);
router.use("/categories", categoryRouter);
router.use("/login", login);
router.use("/register", register);
router.use("/emails",sendMail)
module.exports = router;

// ------------------------------- GET UTILS -------------------------------
// const getArtWorks = async () => {
//   try {
//     let artWorks = await Artwork.findAll({
//       include: {
//         model: Category,
//         attributes: ["title"],
//         through: {
//           attributes: [],
//         },
//       },
//     });

//     return artWorks.map((e) => {
//       // console.log(artWorks)
//       return {
//         id: e.id,
//         img: e.img,
//         title: e.title,
//         content: e.content,
//         category: e.categories[0].title,
//         likes: e.likes,
//         price: e.price,
//       };
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// // ------------------------------- GET CONTROLLERS -------------------------------
// router.get("/arte", async (req, res) => {
//   try {
//     let art = await getArtWorks();
//     res.status(201).json(art);
//   } catch (error) {
//     console.log(error);
//   }
// });
// ------------------------------- POST -------------------------------
// const postArtWork = async (req, res) => {
//   try {
//     const { title, content, category, price, img ,id} = req.body;
//     let artWorkCreate = await Artwork.create({
//       title,
//       content,
//       price,
//       img,
//     });
//     let categoryMatch = await Category.findAll({
//       where: { title: category },
//     });
//     // console.log(Artwork)
//     await artWorkCreate.addCategories(categoryMatch);

//     let profileMatch = await Profile.findByPk(id)

//     await artWorkCreate.addProfile(profileMatch)
//     res.status(200).json(artWorkCreate);
//   } catch (error) {
//     console.log(error);
//     res.status(404).send("Cannot create the Artwork!.");
//   }
// };

// const postCategory = async (req, res) => {
//   try {
//     const { category } = req.body;
//     let catCreate = await Category.create({
//       title: category,
//     });

//     res.status(200).json(catCreate);
//   } catch (error) {
//     console.log(error);
//     res.status(404).send("Cannot create the category!.");
//   }
// };

// const postProfile = async (req, res) => {
//   try {
//     const {
//       name,
//       lastName,
//       userName,
//       email,
//       password,
//       day_of_birth,
//       gender,
//       img,
//       phone,
//       public_email,
//       description,
//       country,
//     } = req.body;
//     let profileCreate = await Profile.create({
//       name,
//       lastName,
//       userName,
//       email,
//       password,
//       day_of_birth,
//       gender,
//       img,
//       phone,
//       public_email,
//       description,
//       country,
//     });

//     res.status(200).json(profileCreate);
//   } catch (error) {
//     console.log(error);
//     res.status(404).send("Cannot create the profile!.");
//   }
// };
// router.post("/profile", postProfile);

// router.post("/user", postUser);

// router.post("/art", postArtWork);

// router.post("/categories", postCategory);

// ------------------------------- DELETE -------------------------------
// const deleteArtWork = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const artWorkToDelete = await Artwork.findByPk(id);
//     artWorkToDelete.destroy();
//     res.status(200).send("Artwork deleted from DB!");
//   } catch (error) {
//     console.log(error);
//   }
// };
// router.delete("/art/:id", deleteArtWork);
// ------------------------------- UPDATE -------------------------------

// const putArtWork = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, content, category, price, img } = req.body;
//     let updatedArtWork = await Artwork.findOne({
//       where: {
//         id: id,
//       },
//     });
//     await updatedArtWork.update({
//       title,
//       content,
//       price,
//       img,
//     });
//     let categoriesFromDb = await Category.findAll({
//       where: { title: category },
//     });
//     await updatedArtWork.setCategories(categoriesFromDb);
//     res.status(201).json(updatedArtWork);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// };

// const putProfile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       day_of_birth,
//       gender,
//       img,
//       phone,
//       public_email,
//       description,
//       country,
//     } = req.body;
//     let updatedProfile = await Profile.findOne({
//       where: {
//         id: id,
//       },
//     });
//     await updatedProfile.update({
//       day_of_birth,
//       gender,
//       img,
//       phone,
//       public_email,
//       description,
//       country,
//     });
//     res.status(201).json(updatedProfile);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// };

// router.put("/profile/:id", putProfile);

// router.put("/art/:id", putArtWork);

// ------------------------------- FILTERS -------------------------------
/*Por Pais de origen  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Por Precio
Por Likes
Por Categorias
Por Tiempo Publicado*/
// router.get("/filter/category", async (req, res) => {
//   const { category } = req.query;
//   // // console.log(category)
//   // try {
//   //   let allArtWorks = await getArtWorks();
//   //   if (category === "all") res.status(200).json(allArtWorks);
//   //   else {
//   //     let filteredArtWoks = allArtWorks.filter((e) => e.category === category);
//   //     // console.log(filteredArtWoks)
//   //     res.status(200).json(filteredArtWoks);
//   //   }
//   // } catch (error) {
//   //   console.log(error);
//   // }
//   // Ahora lo hacemos como se tinee que hacer :
//   let filtered = await Artwork.findAll({
//     include: {
//       model: Category,
//       attributes: ["title"],
//       through: {
//         attributes: [],
//       },
//       where: {
//         title: category,
//       },
//     },
//   });
//   res.status(200).json(filtered);
// });

// router.get("/filter/likes", async (req, res) => {
//   const { likes } = req.query;
//   // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',likes)
//   // let allArtWorks = await getArtWorks();
//   // if (likes === "Asc") {
//   //   allArtWorks.sort((a, b) => {
//   //     return b.likes - a.likes;      ESTO ES LOO QUE NO HAY QUE HACER
//   //   });
//   // } else {
//   //   allArtWorks.sort((a, b) => {
//   //     return a.likes - b.likes;
//   //   });
//   // }
//   //Ahora como se debe

//   if (likes === "ASC" || likes === "DESC") {
//     let ordered = await Artwork.findAll({ order: [["likes", likes]] });
//     res.status(200).json(ordered);
//   }
// });

// router.get("/filter/price", async (req, res) => {
//   const { price } = req.query;
//   // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',likes)
//   // let allArtWorks = await getArtWorks();
//   // if (price === "Asc") {
//   //   allArtWorks.sort((a, b) => {
//   //     return b.price - a.price;
//   //   });
//   // } else {
//   //   allArtWorks.sort((a, b) => {
//   //     return a.price - b.price;
//   //   });
//   // }
//   if (price === "ASC" || price === "DESC") {
//     let ordered = await Artwork.findAll({ order: [["price", price]] });
//     res.status(200).json(ordered);
//   }
// });

// router.get("/filter/antiquity", async (req, res) => {
//   const { antiquity } = req.query;
//   // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',likes)
//   // let allArtWorks = await getArtWorks();
//   // if (antiquity === "Recently") res.status(200).json(allArtWorks.reverse());
//   // else res.status(200).json(allArtWorks);
//   if (antiquity === "ASC" || antiquity === "DESC") {
//     let ordered = await Artwork.findAll({
//       order: [["createdAt", antiquity]],
//       include: {
//         model: Category,
//         attributes: ["title"],
//         through: {
//           attributes: [],
//         },
//       },
//     });
//     res.status(200).json(ordered);
//   }
// });

// router.get("/filter/country", async (req, res) => {
//   const { country } = req.query;
//   let filtered = await Artwork.findAll({
//     include: {
//       model: Profile,
//       attributes: ["country"],
//       through: {
//         attributes: [],
//       },
//       where: {
//         country: country,
//       },
//     },
//   });
//   res.status(200).json(filtered);
// });
