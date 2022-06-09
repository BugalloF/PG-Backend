const { API_KEY } = process.env;
const { Artwork, Category, Profile, Follower } = require("../db.js");
const { Router } = require("express");
const router = Router();
const {verifyToken} = require("../controllers/tokens");

router.get("/", async (req, res, next) => {
    const {apiKey, from = 0 } = req.query;
;

  if (apiKey === API_KEY) {
    try {

      const { authorization } = req.headers;
      if (authorization) {
        const token = authorization.split(" ").pop();
        const tokenData = await verifyToken(token);
        const idUser = tokenData !== undefined ? tokenData.id : null;

        if (idUser) {
          let seguidos = await Follower.findAll({
            where: { idUser: idUser },
          });
        let idsFollowed= seguidos.map(e=>{
            return e.idFollow
        })
        console.log('IDS',idsFollowed)
        let arr=  await Promise.all(
          idsFollowed.map(async  e=>{
            console.log('MAP',e)
            return await Artwork.findAll({
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
                where:{profileId:e},
                attributes: ["imgCompress", "id", "likes", "price", "title"],
                limit: 12,
                offset: from * 12,
              });
            })
            )
            
            let counter = arr.flat(Infinity).length
            

        res.status(200).json({arr,counter})
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
