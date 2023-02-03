const nodemailer = require('nodemailer');
const ejs = require('ejs');



let transporter = nodemailer.createTransport(
{
    service: 'gmail',
    host: 'smptp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'hassan.aun96@gmail.com',
        pass: 'SmndrDats@57'
    }
}
);


let renderTemplate = (data,relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){console.log('error in rendiering email template'); return;}

            mailHTML = template;
        }
    );

        return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}