 const nodemailer = require('../config/nodemailer');
const User = require('../models/user');
const passToken = require('../models/resetPassToken');

 exports.PassReset = (passToken) => {

    let htmlString = nodemailer.renderTemplate({passToken: passToken},'/account/reset_password_template.ejs');

    nodemailer.transporter.sendMail({
        from : 'hassan.aun96@gmail.com',
        to : passToken.user.email,
        subject : "Password reset email Link",
        html : htmlString
    }, (err, info) => {
        if(err){console.log("error in sending pass-reset mail", err); return;}

        console.log("Message sent", info);
        return;

    });

 }