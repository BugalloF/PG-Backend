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
            // const {payer,surname,time,idPost} = req.body;
            const {payer,surname,time,idPost,userSeller,userPayer,email} = req.body;
            const art = await Artwork.findByPk(idPost)
            
            const image = art.dataValues.img
            const title = art.dataValues.title
            const price = art.dataValues.price
            
            const contentHtmlPayer = `
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="utf-8">
                <meta http-equiv="x-ua-compatible" content="ie=edge">
                <title>Compra Email</title>
                </head>
                <body>
                <h2>Hola ${userPayer}!</h2>
                <p>Gracias por tu compra en DigitalizArte.</p>
                <p>Obra: ${title}</p>
                <p>Hora de pago: ${time}</p>
                <br></br>
                <h5>Gracias por utilizar DigitalizArte.</h5>
                </body>
                </html>
                `
            ;
            const contentHtmlSeller = `
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="utf-8">
                <meta http-equiv="x-ua-compatible" content="ie=edge">
                <title>Venta Email</title>
                </head>
                <body>
                <h2>Hola ${userSeller}!</h2>
                <p>Acabamos de registrar una nueva venta de una de tus obras!.</p>
                <br></br>
                <h5>Información de venta: </h5>
                <p>Obra vendida: ${title}</p>
                <p>Hora de pago: ${time}</p>
                <p>Precio: ${price}</p>
                <br></br>
                <h5>Gracias por utilizar DigitalizArte! en las próximas horas se acreditará el dinero en tu cuenta.</h5>
                </body>
                </html>
                `
            ;
            
            const oAuth2Client = new google.auth.OAuth2(CLIENT_ID , CLIENT_SECRET , REDIRECT_URI);
            oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
            
            async function sendMailPayer(){
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
                        subject: "compra en DigitalizArte",
                        html: contentHtmlPayer,
                        attachments: [{
                            filename: `${title}.jpg`,
                            path: image,
                        }],
                    };
                    
                    const result = await transporter.sendMailPayer(mailOptions);
                    return result;
                }
                catch(err)
                {
                    console.log(err.message);
                };
            };

            async function sendMailSeller(){
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
                        to: email,
                        subject: "Venta en DigitalizArte",
                        html: contentHtmlSeller
                    };
                    
                    const result = await transporter. sendMailSeller(mailOptions);
                    return result;
                }
                catch(err)
                {
                    console.log(err.message);
                };
            };
            
            sendMailPayer()
            sendMailSeller()
                .then(result => res.status(200).send("ENVIADOO 2"))
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