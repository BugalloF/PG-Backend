const { Router } = require("express");
const router = Router();
const { Profile } = require("../db.js");

const postProfile = async (req, res) => {
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
    console.log(error);
    res.status(404).send("Cannot create the profile!.");
  }
};
router.post("/", postProfile);

// ------------------------------- UPDATE -------------------------------
const putProfile = async (req, res) => {
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
    console.log(error);
  }
};

router.put("/:id", putProfile);

const getProfiles = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      let profiles = await Profile.findAll();

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
  }
};

router.get("/", getProfiles);
module.exports = router;
