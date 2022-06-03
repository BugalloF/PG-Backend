// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {Profile} = require("../db");
const {encrypt} = require("../controllers/bcrypt");


router.post("/", async (req, res, next) => {
    const {name, lastName, userName, email, password, day_of_birth, gender, img, phone, public_email, description, country} = req.body;
    const foundUser = await Profile.findAll({
        where:
        {
            userName: userName,
        },
    });
    const foundEmail = await Profile.findAll({
        where:
        {
            email: email,
        },
    });
    
    try
    {
        if(foundUser.length)
        {
            res.status(404).send("This username isn't available. Please try another.");
        }
        else if(foundEmail.length)
        {
            res.status(404).send("This email is already in use available. Please try another.");
        }
        else
        {
            if(name, lastName, userName, email, password)
            {
                const passwordHash = await encrypt(password);
                
                await Profile.create({
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
                
                res.send("User created successfully.");
            }
            else
            {
                res.status(404).send("All fields are required.");
            };
        };
    }
    catch(error)
    {
        next(error);
    };
});


module.exports = router;