const { Router } = require("express");
const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const router = Router();
const {Artwork} = require('../db')

router.post("/send-email", async (req, res) => {

    const {payer,surname,time,idPost} = req.body;
    const art = await Artwork.findByPk(idPost)
    
    const image = art.dataValues.img
    const title = art.dataValues.title
    console.log(title)
  
    const contentHtml = `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Compra Email</title>
        </head>
        <body>
        <h2>Hola ${payer} ${surname}!</h2>
        <p>Gracias por tu compra en DigitalizArte.</p>
        <p>Obra: ${title}</p>
        <p>Hora de pago: ${time}</p>
        </body>
        </html>
        `
    ;
    const CLIENT_ID = "594461393565-e9gf5f9jcppur66d6prco4rgp5f45bfs.apps.googleusercontent.com";
    const CLIENT_SECRET = "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";
    const REDIRECT_URI = "https://developers.google.com/oauthplayground";
    const REFRESH_TOKEN = "1//04dMhzShr-GKACgYIARAAGAQSNwF-L9IracZOV_PPQufbw5YObGB0UMIAmSapuIQD_5hgC352MHkl6yslGUGcrq5DKtIygVv4LLQ";
    // const CLIENT_ID = "475383196747-ck55d8ufludt02tvpqisqjfniuq0hnku.apps.googleusercontent.com";
    // const CLIENT_SECRET = "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";
    // const REDIRECT_URI = "https://developers.google.com/oauthplayground";
    // const REFRESH_TOKEN = "1//04jZSAFoYEBKACgYIARAAGAQSNwF-L9Ir7I_Rh26vNPsksqqaNu0WLsjaNH8qpAZGbytSecnJwaphD_ibaeJ965NIv_YARJlFhcY";

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID , CLIENT_SECRET , REDIRECT_URI);
    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

    async function sendMail(){
        try{
            const accessToken = await oAuth2Client.getAccessToken();
            const transporter = nodemailer.createTransport({
                service:"gmail",
                auth: {
                    type: "OAuth2",
                    user: "digitalizartecompras@gmail.com",
                    clientId : CLIENT_ID,
                    clientSecret : CLIENT_SECRET,
                    refreshToken : REFRESH_TOKEN,
                    accessToken: accessToken,
                },
            });
            const mailOptions = {
                from: '"DigitalizArte" <digitalizartecompras@gmail.com>',
                to: 'bugallof@gmail.com',  //falta cambiar el mail!!!
                subject: "Compra en DigitalizArte",
                html: contentHtml,
                attachments: [{
                    filename: `${title}.jpg`,
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