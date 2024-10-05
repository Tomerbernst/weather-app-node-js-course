const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express()
const geocode = require('../src/utils/geocode');
const forecast = require('../src/utils/forecast');

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname,'..','public')
app.use( express.static( publicDirectoryPath ) )

app.set('views', path.join(__dirname, '../templates/views'));
hbs.registerPartials(path.join(__dirname, '../templates/partials'));

app.set('view engine', 'hbs')

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Andrew Mead'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Andrew Mead'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'help',
        name: 'Avi'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must enter an address'
        });
    }

    geocode(req.query.address, (error, geocodeData) => {
        if (error) {
            return res.send({ error });
        }

        const { latitude, longitude, location } = geocodeData;

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            }

            res.send({
                forecast: forecastData,
                location: location
            });
        });
    });
});


app.get('*', (req, res) => {
    res.render('404', {
        pageNotFound: 'Page not found',
        title:'404',
        name: 'David'
    });
})

app.listen(port, () => {
    console.log('Server is up on port' + port)
})