const { Router } = require("express");
const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const router = Router();
const {Artwork} = require('../db')

router.post("/send-email", async (req, res) => {
    console.log("enviadooooo",req.body)
    console.log('holis')

    const {payer,surname,time,idPost} = req.body;
    const art = await Artwork.findByPk(idPost)
    
    const image = art.dataValues.imgCompress
  
    const contentHtml = `
        <h1>hola Fermincin y ${payer} ${surname}!</h1>
        <p>Buen día</p>
        <p> los pecesitos del demi: </p>
        <p>horario de compra: ${time}</p>
        `
    ;
    
    const CLIENT_ID = "475383196747-ck55d8ufludt02tvpqisqjfniuq0hnku.apps.googleusercontent.com";
    const CLIENT_SECRET = "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";
    const REDIRECT_URI = "https://developers.google.com/oauthplayground";
    const REFRESH_TOKEN = "1//04jZSAFoYEBKACgYIARAAGAQSNwF-L9Ir7I_Rh26vNPsksqqaNu0WLsjaNH8qpAZGbytSecnJwaphD_ibaeJ965NIv_YARJlFhcY";

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID , CLIENT_SECRET , REDIRECT_URI);
    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

    async function sendMail(){
        try{
            const accessToken = await oAuth2Client.getAccessToken();
            const transporter = nodemailer.createTransport({
                service:"gmail",
                auth: {
                    type: "OAuth2",
                    user: "julianacarreno678@gmail.com",
                    clientId : CLIENT_ID,
                    clientSecret : CLIENT_SECRET,
                    refreshToken : REFRESH_TOKEN,
                    accessToken: accessToken,
                },
            });
            const mailOptions = {
                from: "DigitalizArte",
                to: 'demiancra@gmail.com',
                subject: "Compra en DigitalizArte",
                html: contentHtml,
                attachments: [{
                    path: image,
                }]
            };

            const result = await transporter.sendMail(mailOptions)
            return result;
        }catch(err){
            console.log(err.message)
        }
    }
    sendMail()
        .then(result => res.status(200).send("ENVIADOO"))
        .catch((error)=>console.log(error.message));
})  



module.exports = router;