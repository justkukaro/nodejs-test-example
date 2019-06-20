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
    res.render('pwd');
});

router.post('/', function (req, res, next) {
    const {user_name, user_password} = req.body;
    const query = `UPDATE person SET user_password='${user_password}' WHERE user_name='${user_name}'`;
    db.serialize();
    db.each(query);
    res.send({user_name, user_password});
});

module.exports = router;
