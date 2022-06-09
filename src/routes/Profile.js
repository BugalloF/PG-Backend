// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {Profile, Artwork, Follower} = require("../db.js");
const {verifyToken} = require("../controllers/tokens");
const {API_KEY} = process.env;


const getProfiles = async (req, res,next) => {
  const {apiKey} = req.query;
  
  if(apiKey === API_KEY)
  {
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
  }
  else
  {
    res.status(401).send("No authorization.");
  };
};

router.get("/", getProfiles);


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
      facebook,
      instagram,
      linkedIn
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
      description,
      country,
      facebook,
      instagram,
      linkedIn
    });
    res.status(201).json(updatedProfile);
  } catch (error) {
    next(error)
  }
};

router.put("/:id", putProfile);


router.get("/:id", async (req, res, next) => {
  const {apiKey} = req.query;
  var search= await Follower.findAll({
    where: [{ idUser: idUser }, { idFollow: id }],
  });
  if(apiKey === API_KEY)
  {
    try
    {
        const { id } = req.params;
        const {authorization} = req.headers;
        
        if(authorization)
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
                        // Array.from(seguidores, ({dataValues}) => {if(dataValues.idFollow === id){
                        //   isFollowing=true
                        // }})
                        
                        console.log('soy el search',search)
                        if(search!==[ ]) isFollowing=true
                        
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
  }
  else
  {
    res.status(401).send("No authorization.");
  }
});

router.delete("/:idSeguido", async (req, res,next) => {
  try {
    const { idSeguido } = req.params;
    const { idSeguidor } = req.body;
    console.log(req.body)
     await Follower.destroy({
      where: [{ idUser: idSeguidor }, { idFollow: idSeguido }],
    });
    res.status(200).send('Has dejado de seguir')
  } catch (error) {
    next(error)
  }
});

router.post("/follow/:idSeguido", async (req, res,next) => {
  try
    {
        const { idSeguido } = req.params;
        const {idSeguidor} = req.body;
        console.log(req.body)
        
            
            if(idSeguido && idSeguidor)
            {
              await Follower.create({
                idUser: idSeguidor,
                idFollow: idSeguido,
              });
              
              res.status(200).send("SEGUIDO!");
            }
            else
            {
                res.status(409).send("Invalid ID users.");
            };
       
       
    }
    catch(error)
    {
        next(error);
    };
});


module.exports = router;