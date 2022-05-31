const { Router } = require("express");
const router = Router();
const bcrypt = require('bcrypt')
const { Profile,Artwork } = require("../db.js");

const getProfiles = async (req, res, next) => {
  try {
      let profiles = await Profile.findAll({
        attributes: ["id","userName","email"],
      });
      res.status(200).json(profiles);
    
  } catch (err) {
    next(err)
  }
};

router.get("/", getProfiles);

const postProfile = async (req, res, next) => {
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

    const passwordHash = await bcrypt.hash(password,10)

    let profileCreate = await Profile.create({
      name,
      lastName,
      userName,
      email,
      password: passwordHash,
      day_of_birth,
      gender,
      img,
      phone,
      public_email,
      description,
      country,
    });

    res.status(200).json(profileCreate.id);
  } catch (err) {
    next(err)
  }
};
router.post("/", postProfile);

// ------------------------------- UPDATE -------------------------------
const putProfile = async (req,res,next) => {
  try {
    const { id } = req.params;

    const {
      email,
      password,
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
    if(updatedProfile){
      await updatedProfile.update({
        email,
        password,
        img,
        phone,
        public_email,
        description,
        country,
      });
      res.status(201).send('Changes made');
    }else res.status(404).send('profile not exist')
  } catch (err) {
    next(err)
  }
};

router.put("/:id", putProfile);



router.get("/:id", async (req,res,next) => {
  try {

    const { id } = req.params;
    let found = await Profile.findOne({
      where:{
        id:id
      },
      attributes: ["id","userName","img","description","country"],
      include:{
        model: Artwork,
        attributes: ["id","title","img","price","likes"],
      }
    });

     if(found)  res.status(200).json(found);
     else res.status(404).send('profile not exist')
    
  } catch (err) {

    next(err)
  }
});
module.exports = router;
