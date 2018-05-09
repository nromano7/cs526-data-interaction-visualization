const express = require('express');
const app = express();
const mysql = require('mysql');

app.set('view engine', 'ejs')
app.use(express.static('public'));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  multipleStatements: true // see docs
});

var query = '';
query += "SELECT * FROM ta_apps.students;";
query += "SELECT * FROM ta_apps.professors;";
query += "SELECT * FROM ta_apps.courses;";
query += "SELECT * FROM ta_apps.apps;";

var context = {},
  s_list = [],
  p_list = [],
  c_list = [],
  a_list = [];

con.connect(function (err) {
  if (err) throw err;
});

con.query(query, function (err, result) {
  if (err) {
    throw err;
  } else {

    result[0].forEach(function (student) {
      s_list.push([student.sid, student.full_name])
    });

    result[1].forEach(function (professor) {
      p_list.push([professor.pid, professor.full_name])
    });

    result[2].forEach(function (course) {
      c_list.push([course.cid, course.cnumber, course.cname])
    });

    result[3].forEach(function (app) {
      a_list.push([app.appid, app.sid, app.pid, app.cid])
    });

    context = {
      s: s_list,
      p: p_list,
      c: c_list,
      a: a_list
    };
  }
});

app.get('/', function (req, res) {
  res.render('index', context)
})

app.listen(3000, function () {
  console.log('App listening on port 3000!')
})