'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const request = require('request');
const request_promise = require('request-promise');
const querystring = require('querystring');

// Set up authentication from .env using dotenv package.
// .env file is ignored in this repo, you must set it up locally with params below:
// REDDIT_API_SECRET=
// REDDIT_API_CLIENT=
// REDDIT_REDIRECT_URI=
// REDDIT_USER=
// REDDIT_PASS=
const CLIENT_ID = process.env.REDDIT_API_CLIENT;
const CLIENT_SECRET = process.env.REDDIT_API_SECRET;
const USER = process.env.REDDIT_USER;
const PASS = process.env.REDDIT_PASS;

// Function: getToken
// Retrieves token using client_id, client_secret, usr(username), and pswd(password)
// using Request package to make a POST call to the Reddit API
const getToken = (cliend_id, client_secret, usr, pswd) => {
    const accessuri = `https://www.reddit.com/api/v1/access_token`;
    const data_object = { grant_type: "password", username: usr, password: pswd };
    const post_data = querystring.stringify(data_object);
    const length = post_data.length;

    // Headers with Basic Auth
    let req_headers = {
        'Authorization' : 'Basic ' + new Buffer.from(cliend_id + ':' + client_secret).toString('base64'),
        'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0',
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length' : length
    };

    // Promisify request for now, might use request-promise instead
    // more logical syntax with resolve and reject to return the token
    return new Promise((resolves, rejects) => {
        request({uri: accessuri, headers: req_headers, body : post_data, method: 'POST'}, (error, response) => {
            let access_object = JSON.parse(response.body);
            resolves(access_object);
        }).on('error', (error) => {
            let Error = new Error(error);
            rejects(Error);
        });
    });
};

// Run getToken  and Store token in token.json for modular use
const main = () => {
    getToken(CLIENT_ID, CLIENT_SECRET, USER, PASS)
        .then(object => {
            fs.writeFileSync(__dirname + '/token.json', JSON.stringify(object));
            console.log("Token written to " + __dirname + '\\token.json');
            return object;
        }).catch(error => {
            throw new Error(error);
        });
};

main();

exports.getToken = main;




