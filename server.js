const express = require('express');
const path = require('path');
const sequelize = require('./config/connection');
const routes = require('./controllers');
const exphbs = require('express-handlebars');
const session = require('express-session');
const helpers = require('./utils/helper');

const SequelizeStore = require('connect-session-sequelize')(session.Store);
require('dotenv').config;

const sess = {
    secret: process.env.SECRET,
    cookie: { /*maxAge: 60*60*24*30*/ },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

const hbs = exphbs.create({ helpers });

const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => { console.log(`Server listening on port ${PORT}.`) });
});