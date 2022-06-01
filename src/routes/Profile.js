const { Router } = require("express");
const router = Router();
const { Profile,Artwork,Follower } = require("../db.js");

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

const postProfile = async (req, res,next) => {
  try {
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
    let profileCreate = await Profile.create({
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

    res.status(200).json(profileCreate);
  } catch (error) {
    next(error)
  }
};
router.post("/", postProfile);

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



router.get("/:id", async (req, res,next) => {
  try {
    const { id } = req.params;
    let found = await Profile.findByPk(id, {
      include: 
          {
              model: Artwork,
           
              }});
    if (found) res.status(200).json(found);
  } catch (error) {
    next(error)
  }
});

router.get("/:id", async (req, res,next) => {
  try {
    const { id } = req.params;
    const { idUser } = req.body;

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

    
    let found = await Profile.findByPk(id);

    if(idUser){  
      let isFollowing = false
      Array.from(seguidores, ({dataValues}) => {if(dataValues.idFollow === id){
        isFollowing=true
      }})
      res.status(200).json({found, cantSeguidores, cantSeguidos, isFollowing});
  }
    else res.status(200).json({found, cantSeguidores, cantSeguidos});
  } catch (error) {
    next(error)
  }
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
  const { idSeguido, idSeguidor } = req.body;

  let seguidor = await Profile.findByPk(idSeguidor);
  let seguido = await Profile.findByPk(idSeguido);

  if (seguidor && seguido) {
    try {
      await Follower.create({
        idUser: idSeguidor,
        idFollow: idSeguido,
      });

      res.status(200).send("SEGUIDO!");
    } catch (e) {
      next(e)
    }
  }
});
module.exports = router;
