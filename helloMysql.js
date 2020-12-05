var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
app.set('port', 3212);

var CORS = require('cors');
app.use(CORS());

app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

const getAllQuery = 'SELECT * FROM workouts';
const insertQuery = "INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `unit`) VALUES (?, ?, ?, ?, ?)";
const updateQuery = 'UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ';
const deleteQuery = 'DELETE FROM workouts WHERE id=?';
const dropTableQuery = "DROP TABLE IF EXISTS workouts";
const makeTableQuery = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "unit BOOLEAN)"

const getAllData = () => {
  mysql.pool.query(getAllQuery, (err, rows, fields) =>{
    if (err){
      next(err);
      return;
    }
    res.json({rows: rows});
  })
}


app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query(getAllQuery, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    getAllData();
  });
});

app.post('/',function(req,res,next){
  var context = {};
  var {name, reps, weight, date, units} = req.body;
  mysql.pool.query(insertQuery, [name, reps, weight, date, units], function(err, result){
    if(err){
      next(err);
      return;
    }
    getAllData();
  });
});

app.delete('/',function(req,res,next){
  var context = {};
    var {name, reps, weight, date, units} = req.body;
  mysql.pool.query(deleteQuery, [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    getAllData();
  });
});

app.put('/',function(req,res,next){
  var context = {};
  var {name, reps, weight, date, units} = req.body;
  mysql.pool.query(getAllQuery, [name, reps, weight, date, units],
    function(err, result){
    if(err){
      next(err);
      return;
    }
        if(result.length == 1){
      var vals = result[0];
      mysql.pool.query(updateQuery, [name || vals.name, reps || vals.reps, weight || 
        vals.weight, date || vals.date, units || vals.units, [name, reps, weight, date, units],
        function(err, result){
        if(err){
          next(err);
          return;
        }
      getAllData();
      });
    }
  });
});


app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query(dropTableQuery, function(err){
    mysql.pool.query(makeTableQuery, function(err){
      context.results = "Table reset";
      res.render('home', context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
