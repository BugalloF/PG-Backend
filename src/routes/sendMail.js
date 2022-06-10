// Dependencies
const {Router} = require("express");
const router = Router();
const nodemailer = require('nodemailer');
const {google} = require('googleapis');
// Files
const {Artwork} = require('../db');
const {verifyToken} = require("../controllers/tokens");
const {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN} = process.env;


router.post("/send-email", async (req, res) => {
    const {authorization} = req.headers;
    
    if(authorization)
    {
        const token = authorization.split(" ").pop();
        const tokenData = await verifyToken(token);
        const tokenEmail = tokenData !== undefined ? tokenData.email : null;
        
        if(tokenEmail)
        {
            const {payer, surname, time, idPost} = req.body;
            const art = await Artwork.findByPk(idPost)
            
            const image = art.dataValues.img
            const title = art.dataValues.title
            
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
                        to: tokenEmail,
                        subject: "Compra en DigitalizArte",
                        html: contentHtml,
                        attachments: [{
                            filename: `${title}.jpg`,
                            path: image,
                        }],
                    };
                    
                    const result = await transporter.sendMail(mailOptions);
                    return result;
                }
                catch(err)
                {
                    console.log(err.message);
                };
            };
            
            sendMail()
                .then(result => res.status(200).send("ENVIADOO"))
                .catch((error)=>console.log(error.message));
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
});


module.exports = router;