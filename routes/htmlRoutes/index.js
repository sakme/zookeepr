const path = require('path');
const router = require('express').Router();

// serve up index.html
router.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// serve up animals.html
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

// serve up zookeepers.html
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// serve up index.html for wild cards
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;