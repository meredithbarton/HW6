var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_bartonme',
  password        : '0212',
  database        : 'cs290_bartonme'
});

module.exports.pool = pool;
