const { API_KEY } = process.env;
const { Artwork, Category, Profile, Follower } = require("../db.js");
const { Router } = require("express");
const router = Router();

router.get("/", async (req, res, next) => {
  const { apiKey } = req.query;

  if (apiKey === API_KEY) {
    try {
      const { authorization } = req.headers;
      if (authorization) {
        const token = authorization.split(" ").pop();
        const tokenData = await verifyToken(token);
        const idUser = tokenData !== undefined ? tokenData.id : null;

        if (idUser) {
          let seguidos = await Follower.findAll({
            where: { idUser: id },
          });
        //   console.log("SEGUIDOSS", seguidos)
          
        //   let found = await Profile.findByPk(id, {
        //     include: {
        //       model: Artwork,
        //     },
        //   });
        res.status(200).json(seguidos)
        }
      }
    } catch (error) {
        next(error)
    }
  } else {
    res.status(401).send("No authorization.");
  }
});

module.exports = router;
