'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const request = require('request');
const request_promise = require('request-promise');
const querystring = require('querystring');
const accessToken = require('./token.json');

const CLIENT_ID = process.env.REDDIT_API_CLIENT;
const CLIENT_SECRET = process.env.REDDIT_API_SECRET;
const USER = process.env.REDDIT_USER;
const PASS = process.env.REDDIT_PASS;

let token = accessToken.access_token;
console.log("Token retrieved: " + token);

// Function: getRecipes()
// Example to retrieve posts about food recipes and store using Access Token Auth for Reddit API
// parameters: subreddit - subreddit to search for recipes
const getPostsFromSubreddit = (subreddit) => {
    const count = '10';
    const sorttype = 'new';
    const timeinterval = 'hour';
    let req_headers = {
        'Authorization' : 'bearer ' + token,
        'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0'
    };
    let posts = {};
    request_promise({uri: `https://reddit.com/r/${subreddit}/.json?count=${count}?sort=${sorttype}?t=${timeinterval}`, headers: req_headers, method: 'GET'}, (error, response) => {
        let body_parsed = JSON.parse(response.body);
        posts = JSON.stringify(body_parsed.data.children);
    }).then((posts) => {
        fs.writeFileSync(__dirname + '/posts.json', posts);
        console.log('File written to: ' + __dirname + '/posts.json');
    });
};

// getting posts from r/food
getPostsFromSubreddit('food');