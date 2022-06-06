const { Router } = require("express");
const router = Router();
const { Profile,Artwork,Follower } = require("../db.js");
const {verifyToken} = require("../controllers/tokens");


const getProfiles = async (req, res,next) => {
  try {
    const { name } = req.query;

    if (!name) {
      let profiles = await Profile.findAll({include:{model:Artwork}});

      profiles.map((e) => {
        // console.log(artWorks)
        return { 
          id: e.id,
          name: e.name,
          lastName: e.lastName,
          userName: e.userName,
          email: e.email,
          password: e.password,
          day_of_birth: e.day_of_birth,
          gender: e.gender,
          is_Admin: e.is_Admin,
          img: e.img,
          phone: e.phone,
          public_email: e.public_email,
          description: e.description,
          country: e.country,
        };
      });
      res.status(200).json(profiles);
    } else {
      let oneProfile = await Profile.findAll({ where: { name: name } });
      oneProfile.length
        ? res.status(200).json(oneProfile)
        : res.status(404).send("No existe ese perfil.");
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
};

router.get("/", getProfiles);

// const postProfile = async (req, res,next) => {
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

//     const passwordHash = await encrypt(password);

//     let profileCreate = await Profile.create({
//       name,
//       lastName,
//       userName,
//       email,
//       password: passwordHash,
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
//     next(error)
//   }
// };
// router.post("/", postProfile);

// ------------------------------- UPDATE -------------------------------
const putProfile = async (req, res,next) => {
  try {
    const { id } = req.params;
    const {
      name,
      lastName,
      userName,
      email,
      password,
      day_of_birth,
      gender,
      img,
      phone,
      public_email,
      description,
      country,
    } = req.body;
    let updatedProfile = await Profile.findOne({
      where: {
        id: id,
      },
    });
    await updatedProfile.update({
      name,
      lastName,
      userName,
      email,
      password,
      day_of_birth,
      gender,
      img,
      phone,
      public_email,
      description,
      country,
    });
    res.status(201).json(updatedProfile);
  } catch (error) {
    next(error)
  }
};

router.put("/:id", putProfile);



// router.get("/:id", async (req, res,next) => {
//   try {
//     const { id } = req.params;
//     let found = await Profile.findByPk(id, {
//       include: 
//           {
//               model: Artwork,
           
//               }});
//     if (found) res.status(200).json(found);
//   } catch (error) {
//     next(error)
//   }
// });

// router.get("/:id", async (req, res,next) => {
  
//   try {
//     const { id } = req.params;
//     const { idUser } = req.body;

//     let seguidos = await Follower.findAll({
//       where: { idUser: id },
//     });
//     // console.log("SEGUIDORESS", seguidores)
//     let cantSeguidos = seguidos.length;
//     // console.log("SEGUIDORESS", cantSeguidores);

//     let seguidores = await Follower.findAll({
//       where: { idFollow: id },
//     });
//     let cantSeguidores = seguidores.length;
//     // console.log("SEGUIDOSSS", cantSeguidos);

    
//     let found = await Profile.findByPk(id, {
//       include: 
//           {
//               model: Artwork,
           
//               }});

//     if(idUser){  
//       let isFollowing = false
//       Array.from(seguidores, ({dataValues}) => {if(dataValues.idFollow === id){
//         isFollowing=true
//       }})
//       res.status(200).json({found, cantSeguidores, cantSeguidos, isFollowing});
//   }
//     else res.status(200).json({found, cantSeguidores, cantSeguidos});
//   } catch (error) {
//     next(error)
//   }
// });

router.get("/:id", async (req, res, next) => {
  try
  {
      const { id } = req.params;
      // const { idUser } = req.body;
      const {authorization} = req.headers;
      
      if(true)
      {
          const token = authorization.split(" ").pop();
          const tokenData = await verifyToken(token);
          const idUser = tokenData !== undefined ? tokenData.id : null;
          
          if(idUser)
          {
              let seguidos = await Follower.findAll({
                  where: { idUser: id },
                });
                // console.log("SEGUIDORESS", seguidores)
                let cantSeguidos = seguidos.length;
                // console.log("SEGUIDORESS", cantSeguidores);
            
                let seguidores = await Follower.findAll({
                  where: { idFollow: id },
                });
                let cantSeguidores = seguidores.length;
                // console.log("SEGUIDOSSS", cantSeguidos);
            
                
                let found = await Profile.findByPk(id, {
                  include: 
                      {
                          model: Artwork,
                       
                          }});
                  if(found !== null)
                  {
                    if(idUser){  
                      let isFollowing = false
                      Array.from(seguidores, ({dataValues}) => {if(dataValues.idFollow === id){
                        isFollowing=true
                      }})
                      res.status(200).json({found, cantSeguidores, cantSeguidos, isFollowing});
                  }
                  else res.status(200).json({found, cantSeguidores, cantSeguidos});
                }
                else
                {
                  res.status(416).send("User not found.");
                };
              
          }
          else
          {
              res.status(409).send("Invalid token.");
          };
      }
      else
      {
          res.status(401).send("No authorization.");
      };
  }
  catch(error)
  {
      next(error);
  };
});

router.delete("/:id", async (req, res,next) => {
  try {
    const { id } = req.params;
    const { idUser } = req.body;

    // if (id && idUser) {
    //   var idToDestroy = await Follower.findAll({
    //     where: [{ idUser: idUser }, { idFollow: id }],
    //   });
      // console.log("destruido", idToDestroy);
    // }
     await Follower.destroy({
      where: [{ idUser: idUser }, { idFollow: id }],
    });
    res.status(200).send('Has dejado de seguir')
  } catch (error) {
    next(error)
  }
});

router.post("/follow", async (req, res,next) => {
  try
    {
        const { idSeguido } = req.body;
        const {authorization} = req.headers;
        
        if(authorization)
        {
            const token = authorization.split(" ").pop();
            const tokenData = await verifyToken(token);
            const idSeguidor = tokenData !== undefined ? tokenData.id : null;
            let seguidor = await Profile.findByPk(idSeguidor);
            let seguido = await Profile.findByPk(idSeguido);
            
            if(seguidor && seguido)
            {
              await Follower.create({
                idUser: idSeguidor,
                idFollow: idSeguido,
              });
              
              res.status(200).send("SEGUIDO!");
            }
            else
            {
                res.status(409).send("Invalid token.");
            };
        }
        else
        {
            res.status(401).send("No authorization.");
        };
    }
    catch(error)
    {
        next(error);
    };
});
module.exports = router;

// {
//   idSeguidor:96cdb5b9-8012-4e6d-93f8-a6e8b5cb53d1,
//   idSeguido:5e3c56bb-0a44-4cce-8bd4-968c84a86ac5

// }