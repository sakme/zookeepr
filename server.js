const express = require('express');
const app = express();
// parse incoming string or array
app.use(express.urlencoded({ extended: true}));
// parse incoming JSON
app.use(express.json());
// location of supporting files (css, js, etc.)
app.use(express.static('public'));
const { animals } = require('./data/animals');
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');

// retrieve data using queries
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits
        };

        //loop through each traitin the personalityTraitsArray
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
        }

    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }

    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }

    return filteredResults;
};

// retrieve data using params
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
};

// save post data
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    return body;
};

// validate post data
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }

    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }

    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }

    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }

    return true;
};

// receive get using queries
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }

    res.json(results);
});

// receive get using params
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// receive post data
app.post('/api/animals', (req,res) => {
    //set id
    req.body.id = animals.length.toString();

    // add animal to json file and animals array
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

// serve up index.html
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// serve up animals.html
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// serve up zookeepers.html
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// serve up index.html for wild cards
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// listener
app.listen(PORT, () => {
    console.log('API server now on port ' + PORT + '!');
});