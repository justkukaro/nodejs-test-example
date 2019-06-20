var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sqlite3 = require('sqlite3').verbose();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var insertRouter = require('./routes/insert');
var showRouter = require('./routes/show');
var deleteRouter = require('./routes/delete');
var pwdRouter = require('./routes/pwd');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/insert', insertRouter);
app.use('/show', showRouter);
app.use('/delete', deleteRouter);
app.use('/pwd', pwdRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

let db = new sqlite3.Database('./db/my.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the mydb database.');
    }
});

const dropQuery = `
    DROP TABLE IF EXISTS person
`;

const insertQuery = `
  CREATE TABLE IF NOT EXISTS person(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name VARCHAR(20),
    user_password VARCHAR(20)
  )
`;

const dummyDataQuery = `
  insert into person(user_name, user_password) values ('doraemong', 'daenamuhelicopter'),
    ('kukaro', 'wordpass'),
    ('jiharu', 'password')
`;

db.serialize(() => {
    db.each(dropQuery);
    db.each(insertQuery);
    db.each(dummyDataQuery);
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Close the database connection.');
    }
});

module.exports = app;
