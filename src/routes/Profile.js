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
      country
      
    });
    res.status(201).json(updatedProfile);
  } catch (error) {
    console.log(error)
  }
};

router.put("/:id", putProfile);

module.exports = router;
