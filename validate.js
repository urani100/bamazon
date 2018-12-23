 
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Tutu100!",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('connection established : ' + connection.threadId)
    validateItem();
  });
 
 function validateItem(num){
     var num = 'JE89782'
     var query = 'select distinct item_id from products'
     var itemId =[];
     connection.query(query, function(err, res){
         if(err) throw err;
         for(var i = 0; i<res.length; i++){
            itemId.push(res[i].item_id);
         }
       
        var itemExist = itemId.indexOf(num); 
        if(itemExist >-1 ){
            console.log('The Item exist.')
            return true;
            
        } else{
            console.log('The Item Id that you entered do not exist.')
        }
     }) 
 }
