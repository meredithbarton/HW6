var dest = "flip3.engr.oregonstate.edu:3212/"

document.addEventListener('onload', displayTable);

var submitButton = document.getElementById("submit");
submitButton.addEventListener("click", addRow);

function displayTable() {
  var table = document.getElementById("table");

  //a table with children is a populated table
  //clear a table until unpopulated
  //credit to https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
  while (table.firstChild) {
    table.removeChild
  }

  //then rebuild the table with database data
  var req = new XMLHttpRequest();
  req.open('GET', dest + "/reset-table", true);

  req.addEventListener('load', function() {
    if (req.status >= 200 && req.status < 400) {
      var res = JSON.parse(req.responseText);
      displayRows(res);
    }else {
      console.log("Tough Luck");
    }
  })
}

function displayRows(res) {
  //res comes in the form of a list
  //each element makes up a row. Iterate to get values
  for (var i = 0; i < res.length; i++) {
    var newRow = document.createElement("tr");

    var idCell = document.createElement("td");
    idCell.textContent = i;
    newRow.appendChild(idCell);

    var nameCell = document.createElement("td");
    nameCell.textContent = res[i].name;
    newRow.appendChild(nameCell);

    var repsCell = document.createElement("td");
    repsCell.textContent = res[i].reps;
    newRow.appendChild(repsCell);

    var weightCell = document.createElement("td");
    weightCell.textContent = res[i].weight;
    newRow.appendChild(weightCell);

    var dateCell = document.createElement("td");
    dataCell.textContent = res[i].date;
    newRow.appendChild(dateCell);

    var unitCell = document.createElement("td");
    unitCell.textContent = res[i].units;
    newRow.appendChild(unitCell);  

  // edit and delete row buttons
   var update = document.createElement("button");
   newRow.appendChild(update);
   update.appendChild(document.createTextNode("edit row"));
   update.addEventListener("click", updateRow);

   var deleteRow = document.createElement("button");
   newRow.appendChild(deleteRow);
   deleteRow.appendChild(document.createTextNode("delete row"));
   deleteRow.addEventListener("click", deleteRow(i));
   var table = document.getElementById("table");
   table.appendChild(newRow);
 }
}


function addRow() {
   var req = new XMLHttpRequest();
   var addName = document.getElementById("name").value;
   var addReps = document.getElementById("reps").value;
   var addWeight = document.getElementById("weight").value;
   var addDate = document.getElementById("date").value;
   var addUnit = document.getElementById("units").value;

   var queryString = dest + "/" + "name=" + addName + "&reps=" + addReps + "&weight=" + addWeight +
   "&date=" + addDate + "&units=" + addUnit;

   req.open("POST", queryString, true);

   req.addEventListener('load', function(){
           if (req.status >= 200 && req.status < 400){
        displayTable();     
      } else {
        console.log("error");
      }
    });
}

function updateRow(){
    var req = new XMLHttpRequest();
    var data = {};
    data.name = document.getElementById("name").value;
    data.reps = document.getElementById("reps").value;
    data.weight = document.getElementById("weight").value;
    data.date = document.getElementById("date").value;
    data.units = document.getElementById("units").value;

    req.open("PUT", dest + name + "&reps=" + reps + "&weight=" + weight + "&date=" + date + "&lbs=" + lbs + "/", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener("load", function(event){
      if (req.status >= 200 && req.status < 400){
        displayTable();     
      } else {
        console.log("error");
      }
    });
    req.send(JSON.stringify(data));
    event.preventDefault();
  };

function deleteRow(id) {
   console.log("delete fired");
   var req = new XMLHttpRequest();
   req.open('DELETE', dest + "/?id=" + id);
   req.addEventListener("load", function(event){
      if (req.status >= 200 && req.status < 400){
        displayTable();     
      } else {
        console.log("error");
      }
    });
    req.send(null);
} 