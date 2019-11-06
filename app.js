require('dotenv').config();
var fs = require('fs');
const express = require('express');
const app = express();
const response = require("./data/response.json");
const response401 = require("./data/response401.json");

var https = require('https');
var privateKey  = fs.readFileSync("./"+process.env.private_key, 'utf8');
var certificate = fs.readFileSync("./"+process.env.certificate, 'utf8');

var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);

app.get('/zosmf/info', (req, res) => {

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    
    console.log("Login with credentials: ", username, password);

    if (!(username == "user")) {
        return res.status(401).json(response401);
    }

    //res.setHeader("Set-Cookie","LtpaToken2=OQIU+q38PJaGixJxw5dyVZHwZFLJqTUijwb7dH251fKsWA0I13jqMN3fupnYnwfRPSO4LRbExwQJH7p5iPEikQ4y+32XY0zTFv9e6QaUV2HyllF5AKvt2CsZZiJoKUOH/crl+ogdIH7/1+A28gaVA7Uc1wS+woGZNKAc9uup8wVo8z2+7l0TibqupfdlamEIJUyGNNCG9LgnwA0CuvRpq7OrjF77kQ2DYJO9ubOCfWNLp6UwiXRRY9E/TdnGXCWM6mZDcl5HYb+Am/tEb8++fg257VpjkHR66KbWZf32kPxwAPZL5OEhwq2xCjfe6YBo; Path=/; Secure; HttpOnly");
    res.setHeader("Set-Cookie","LtpaToken2=TOKEN; Path=/; Secure; HttpOnly");
    res.send(response);
});


httpsServer.listen(process.env.port, () => console.log(`ZOSMF mock listening on port ${process.env.port}!`));