const settings = require("./settings.json");
const chalk = require("chalk");

module.exports = async function (app) {
    const session = require("express-session");
    const MongoDBStore = require("connect-mongodb-session")(session);
    const {
        MongoClient
    } = require("mongodb");

    const store = new MongoDBStore({
        uri: settings.database.url,
        databaseName: settings.database.dbname,
        collection: "sessions",
    });

    app.use(require('express-session')({
        secret: settings.website.secret,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        },
        store: store,
        resave: true,
        saveUninitialized: true,
    }));

    const client = new MongoClient(settings.database.url);

    await client.connect();
    console.log(chalk.green('[DATABASE] Connected to the database'));


    // Catch errors
    store.on("error", function (error) {
        console.log(error);
    });

    return client
}