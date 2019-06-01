const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const bodyParser = require('body-parser')

const app = express();
app.use(morgan('dev'));

// parse application/x-www-form-urlencode
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

let movieData = {};

// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter
app.get('/', function(req, res) {
    let key, type;
    if (req.query.hasOwnProperty('i')) {
        key = req.query.i;
        type = 'i';
    } else if (req.query.hasOwnProperty('t')) {
        key = req.query.t.replace(/ /g,'%20');
        type = 't';
    } else {
        res.status(400).send('Improper parameters sent').end();
    }

    if (movieData.hasOwnProperty(key)) {
        res.status(200).json(movieData[key]);
    } else {
        let url = 'http://www.omdbapi.com/?' + type + '=' + key + '&apikey=8730e0e'; 
        axios
            .get(url)
            .then(response => {   
                movieData[key] = response.data;
                res.status(200).json(movieData[key]);
            })
            .catch(error => {
                res.status(404).send('Movie not found: ' + error);
            });
    }
});

module.exports = app;