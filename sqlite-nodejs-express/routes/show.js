var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/my.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('success');
    }
});

/* GET users listing. */



router.get('/', function (req, res, next) {
    const query = `SELECT * FROM person`;
    db.serialize();
    db.all(query, (err, row) => {
        res.render('show', {data : row});
    });
});

module.exports = router;
