const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sql');

const database = {}

database.run = function (query) {
    db.run(query);
};

database.runPrepared = function (query, parameter) {
    let stmt = db.prepare(query);
    stmt.run(parameter);
    stmt.finalize();
}

module.exports = database;