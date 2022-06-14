// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {Profile, Artwork, Follower} = require("../db.js");
const {signToken, verifyToken} = require("../controllers/tokens");
const { Op } = require("sequelize");
const {API_KEY} = process.env;

const countProfiles =async (req,res,next) => {
  try{

    const count = await Profile.count()

    res.status(200).json(count)

  }catch(error){
    next(error)
  }
}

router.get('/count',countProfiles)


const profiles =async(req,res,next) => {
  const {from = 0, name, by, type} = req.query

  var order = null;

  if(by && type) order = 'order';
  try{

    if(name){
      const profiles = await Profile.findAll({
        where: {name :{ [Op.iLike]: `%${name}%` } },
        limit: 12,
        offset: from * 12,

      })

      const counter = await Profile.count({
        where: {name :{ [Op.iLike]: `%${name}%` } },
      })





      res.status(200).json({profiles,counter})

    }else{
      
          const profiles = await Profile.findAll({
            [order]: [[by,type]],
            limit: 12,
            offset: from * 12,
          })
      
          const counter = await Profile.count()
      
          res.status(200).json({profiles,counter})

    }
    
  }catch(error){
    next(error)
  }
}

router.get('/profiles', profiles)

const getProfiles = async (req, res,next) => {
  const {apiKey} = req.query;
  
  if(apiKey === API_KEY)
  {
    try {
      const { userName } = req.query;
  
      if (!userName) {
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
            description: e.description,
            country: e.country,
          };
        });
        res.status(200).json(profiles);
      } else {
        let oneProfile = await Profile.findAll({ where: { userName: userName } });
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

const getBannedProfiles = async (req, res,next) => {
  const {apiKey} = req.query;
  
  if(apiKey === API_KEY)
  {
    try {
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
            description: e.description,
            country: e.country,
            is_banned:e.is_banned,
            banned_time:e.banned_time
          };
        });
        let filtrados = profiles.filter(el=>el.is_banned)
        res.status(200).json(filtrados);
      
        
    } catch (error) {
      console.log(error);
      next(error)
    }
  }
  else
  {
    res.status(401).send("No authorization!!!. CRUCE DE RUTAS CON BANNED USERS");
  };
};

router.get("/bannedusers", getBannedProfiles);
// ------------------------------- UPDATE -------------------------------
const putProfile = async (req, res,next) => {
  try
  {
    const {id} = req.params;
    const {name, lastName, userName, email, password, day_of_birth, gender, img, phone, description, country, facebook, instagram, linkedIn, is_banned, banned_time} = req.body;
    
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
      linkedIn,
      is_banned,
      banned_time,
    });
    
    const token = await signToken(updatedProfile);
    console.log(token);
    res.status(201).json({updatedProfile, token});
  }
  catch(error)
  {
    next(error);
  };
};

router.put("/:id", putProfile);


router.get("/:id", async (req, res, next) => {
  const {apiKey} = req.query;
  
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
                        let search= await Follower.findAll({
                          where: [{ idUser: idUser }, { idFollow: id }],
                        });
                        // console.log('soyyy',search)
                        // console.log('soyyylengthhhh',search.length)
                        if(search.length>0) isFollowing=true
                        
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



// --------------------- DELETE PROFILE -------------------- //

router.delete("/delete/:id", async (req, res,next) => {
  const {apiKey} = req.query
  const {id} = req.params
  try {
    if(apiKey === API_KEY){

     const artworks =  await Artwork.findAll({
        include:[{
          model: Profile,
          where: {id:id}
        }]
        
      })

    const ARRAY_ARTWORKS = artworks.map(e => e.id)

      await Artwork.destroy({
        where: {
          id: ARRAY_ARTWORKS
        }
      })

      await Profile.destroy({
        where:{
          id: id
        }
      })
      res.status(201).send('Delete User')
    }else res.status(401).send('No auth')
  
  } catch (error) {
    next(error)
  }
});









module.exports = router;