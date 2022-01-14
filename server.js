const express = require('express');
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
// parse incoming string or array
app.use(express.urlencoded({ extended: true}));
// location of supporting files (css, js, etc.)
app.use(express.static('public'));
// parse incoming JSON
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);
const PORT = process.env.PORT || 3001;



// listener
app.listen(PORT, () => {
    console.log('API server now on port ' + PORT + '!');
});