// Dependencies
const nodemailer = require("nodemailer");
const {google} = require("googleapis");
// Files
const {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN, DEPLOY_FRONT_URL} = process.env;


async function sendEmail(email, id)
{
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID , CLIENT_SECRET , REDIRECT_URI);
    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
    
    try
    {
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
        const link = `<a href=${DEPLOY_FRONT_URL}/reset/${id}>link</a>`;
        
        const message =
        {
            from: '"DigitalizArte" <digitalizartecompras@gmail.com>',
            to: email,
            subject: "Reset your password.",
            html: `For reset your password, follow this ${link}. <br/> The link will be able for five minutes.`,
        };
        
        await transporter.sendMail(message);
    }
    catch(error)
    {
        console.log(error);
        // return next;
    };
};


module.exports =
{
    sendEmail,
};