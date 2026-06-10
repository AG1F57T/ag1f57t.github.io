var Database = require('better-sqlite3');
var db = new Database('./data.db');
db.exec(require('fs').readFileSync('./sql/01-recipe.sql', 'utf8'));
module.exports = db;