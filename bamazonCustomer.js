var mysql = require("mysql");
var inquirer = require("inquirer");

  var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "*****",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
      if (err) throw err;
      console.log('connection established : ' + connection.threadId)
      displayItems();
    });



  function displayItems() {
    var query = "SELECT item_id , product_name,  department_name, price,  stock_quantity from products";
    connection.query(query, function(err, res){
        if(err) throw err;
        console.log('\n' + 'Item-ID  ' + 'Product-Name  ' +  'Department-Name  '  +  'Price  ' +  'Quantity '); 
        console.log('------------------------------------------------------------------------------------------')
        for(var i =0; i<res.length; i++){
            console.log(res[i].item_id +  " " +
                        res[i].product_name +  " " +
                        res[i].department_name +  " " +
                        '$' + res[i].price.toFixed(2) +  " " + 
                        res[i].stock_quantity); 
            console.log('------------------------------------------------------------------------------------------')
        }
        purchase();
       
    })     
}


//to do: trim input
function purchase() {
    inquirer
      .prompt({
        name: "item_id",
        type: "input",
        message: "Enter the Item ID of the product you wish to purchase?",
        // validate: validateAnswer 
      })
      .then(function(answer){
            var query = "SELECT item_id , product_name,  department_name, price,  stock_quantity, product_sales from products WHERE ?";
            connection.query(query, { item_id: answer.item_id }, function(err, res) {
              for (var i = 0; i < res.length; i++) { 
                var purchaseInfo = res[i];
                    console.log("Item number " + res[i].item_id +  " :  " +
                    res[i].product_name +  " " + ' is available.  We have ' + res[i].stock_quantity + " left."); 
                    transaction(purchaseInfo); 
              }
            });
      });
  }


function transaction(purchaseInfo) {
    inquirer
      .prompt({
        name: "quantity",
        type: "input",
        message: "Please enter the number of item(s) you wish to purchase:"
        // To do: validate: validateNum
        //what if quantity is 0?
      })
      .then(function(answer) {
          if(parseInt(answer.quantity) <= info.stock_quantity ){
            var total =  (answer.quantity * purchaseInfo.price).toFixed(2);
            var num = answer.quantity;
            console.log("Your total is $" + total +
            "\nThank you for shopping with us.");
            updateItemCount(info, num);
          }else{
              console.log('Sorry we only have ' + info.stock_quantity + ' left.' +
              "\nPlease try again!");
              transaction(info);
          }
          
    });
}


  function updateItemCount(info, num){
    var newStockQuantity = info.stock_quantity - num;
    var query = "update products SET? WHERE ?"
    connection.query(query, 
      [{stock_quantity: newStockQuantity}, {item_id: info.item_id}],function(err,res){
    }) 
    updateSales(info, num)
}
  
function updateSales(info, num){
  var newSale = (info.price * num) + info.product_sales;
  var query = "update products SET? WHERE ?"
  connection.query(query, 
    [{product_sales: newSale}, {item_id: info.item_id}],function(err,res){
  }) 
  connection.end();
}
  



