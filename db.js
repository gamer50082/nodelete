const settings = require("./settings.json");
const chalk = require("chalk");

module.exports = async function (app) {
    if (settings.database.mysql.enabled === true) {
        const mysql = require("mysql");

        const connection = mysql.createConnection({
            host: "localhost",
            user: "me",
            password: "secret",
            database: "my_db",
        });

    } else if (settings.database.json.enabled === true) {

    } else if (settings.database.mongodb.enabled === true) {
        const session = require("express-session");
        const MongoDBStore = require("connect-mongodb-session")(session);
        const { MongoClient } = require("mongodb");

        const store = new MongoDBStore({
            uri: settings.database.mongodb.url,
            databaseName: settings.database.mongodb.dbname,
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
        })
        );

        const client = new MongoClient(settings.database.mongodb.url);

        await client.connect();
        console.log(chalk.green('[DATABASE] Connected to the database'));


        // Catch errors
        store.on("error", function (error) {
            console.log(error);
        });

        return client

    } else if (settings.database.sqlite.enabled === true) {

    } else if (settings.database.mariadb.enabled === true) {

    }
}