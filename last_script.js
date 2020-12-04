//connect express
var express = require('express');
var app = express();
app.set('port', 3000);
app.use(express.static('public'));

// connect MySQL 
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_bartonme',
  password        : '0212',
  database        : 'cs290_bartonme'
});

module.exports.pool = pool;


app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";r
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.get('/insert',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO todo (`name`) VALUES (?)", [req.query.c], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.render('home',context);
  });
});

var table_data = {
  Options: [],
  Name: [],
  Reps: [],
  Weight: [],
  Date: [],
  Unit: []
};


var index = 0;
var table = document.createElement("table");
table.border = "2px";

// create headers
var header = Object.keys(table_data);
var headRow = document.createElement("tr");
header.forEach(function(header) {
    var headerCell = document.createElement("th");
    headerCell.appendChild(document.createTextNode(header));
    // headRow is parent of each header
    headRow.appendChild(headerCell);
})
table.appendChild(headRow);

// add table to document
document.body.appendChild(table);

//add row button
var addRow = document.createElement("button");
document.body.appendChild(addRow);
addRow.appendChild(document.createTextNode("add row"));
addRow.addEventListener("click", addRow);

function addRow() {
    var newRow = document.createElement("tr");

      // edit and delete row buttons
    var edit = document.createElement("button");
    newRow.appendChild(edit);
    edit.appendChild(document.createTextNode("edit row"));
    edit.addEventListener("click", edit);

    var deleteRow = document.createElement("button");
    newRow.appendChild(deleteRow);
    deleteRow.appendChild(document.createTextNode("delete row"));
    deleteRow.addEventListener("click", deleteRow);

    table.appendChild(newRow);
}


//row1 will be parent of first set of date
// data is in order of name, reps, weight, date, then units
var row1 = document.createElement("tr");
table.appendChild(row1);

    var edit = document.createElement("button");
    row1.appendChild(edit);
    edit.appendChild(document.createTextNode("edit row"));
    edit.addEventListener("click", edit);

    var deleteRow = document.createElement("button");
    row1.appendChild(deleteRow);
    deleteRow.appendChild(document.createTextNode("delete row"));
    deleteRow.addEventListener("click", deleteRow);


function addCells(parent_header, cell_data, row) {
  dataCell = document.createElement("td");
  dataCell.appendChild(document.createTextNode(cell_data));
  parent_header.appendChild(dataCell);
  row.appendChild(dataCell);
}

var h1 = table.firstChild.children[0];
addCells(h1, "1,1", row1)


function edit() {
    console.log("edit fired");
}

function deleteRow() {
  console.log("delete fired");
} 