
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval : '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'blahsomething',
    // database name need to be private
    db: 'codial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'hassan.aun96@gmail.com',
            pass: 'yzelyurkdtbgqvzd'
        }
        
    },
    google_client_id: "869707501348-edfcc075125iatt4ru3mffioum19j2uu.apps.googleusercontent.com",
    google_client_secret: "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",
    google_callback_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }

}


const production = {
    name: 'production',
    asset_path: process.env.CODIAL_ASSET_PTH,
    session_cookie_key: process.env.CODIAL_SESSION_COOKIE_KEY,
    // database name need to be private
    db: process.env.CODIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODIAL_GMAIL_USERNAME,
            pass: process.env.CODIAL_GMAIL_PASSWORD
        }
        
    },
    google_client_id: process.env.CODIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODIAL_GOOGLE_CLIENT_SECRET,
    google_callback_url: process.env.CODIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

module.exports = development;

// eval(process.env.CODIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODIAL_ENVIRONMENT);