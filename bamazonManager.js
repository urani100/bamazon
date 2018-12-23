var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Tutu100!",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
      if (err) throw err;
      console.log('connection established : ' + connection.threadId)
      mangerOptions();
    });


  function mangerOptions(){
      inquirer
      .prompt({
          name: 'options',
          type: 'list',
          message: 'What action would you like to perform',
          choices:[
            'View Products for Sale',
            'View Low Inventory',
            'Update Inventory',
            'Add New Product',
          ]
      }).then(function(answer){

        if(answer.options === 'View Products for Sale') {
            showAllProducts();
        }else if(answer.options === 'View Low Inventory'){
            lowInventory();
        }else if(answer.options === 'Update Inventory'){
            updateInventory()
        }else{
            addProduct();
        }
      })
  }

 
  function showAllProducts(){
    var query = "SELECT item_id , product_name,  department_name, price,  stock_quantity from products";
    displayItems(query);

}
function lowInventory(){
    var query= 'select * from products where stock_quantity < 5';
    displayItems(query);
}


function updateInventory(){
    inquirer
    .prompt([
        {
        name: 'itemId',
        type:'input',
        message:'Enter the Item Id of the product to be updated'
        },
        {
        name: 'quantity',
        type:'input',
        message:'Enter the Quantity'
        }]).then(function(answer){
            var existingCount = 'select stock_quantity from products WHERE ?'
            connection.query(existingCount, {item_id:answer.itemId}, function(err, res){
                for(var i =0; i< res.length; i++){
                    var newQuantity = res[i].stock_quantity + parseInt(answer.quantity); 
                }
                executeUpdate(newQuantity, answer.itemId);
            });
        }) 
}


function executeUpdate(quantity, Id){
var query = "update products SET?  WHERE ?"
    connection.query(query, [{stock_quantity: quantity}, {item_id: Id}], function(err, res){
    if(err) throw err;
    console.log('Item Id ' + Id + ' has sucessfully been updated.');
    connection.end();
    })
}


function addProduct(){
    inquirer
    .prompt(
        [{
            name: 'item_id',
            type:'input',
            message: 'Enter Item-Id'
        },
        {
            name: 'product_name',
            type:'input',
            message: 'Enter Product Name'
        },
        {
            name: 'department_name',
            type:'list',
            message: 'Enter Department Name',
            choices:[
                'Accessories',
                'Dresses',
                'Jeans',
                'Shoes',
                'Shirts',
                'Sweaters'
            ]
        },
        {
            name: 'price',
            type:'input',
            message: 'Enter Price',
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
               return 'You must enter a number';;
              }
        },
        {
            name: 'stock_quantity',
            type:'input',
            message: 'Enter Stock Quantity',
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return 'You must enter a number';
              }
        }]
    ).then(function(res){
        var query = 'insert into products SET ?';
        connection.query(query, 
            [{
                item_id: res.item_id , 
                product_name: res.product_name,  
                department_name: res.department_name, 
                price:res.price,  
                stock_quantity: res.stock_quantity
            }], function(err, resonse){
                console.log('The item ' + res.item_id + ' has successfully been added to the Products table')
            connection.end();
        })
        
    })
}


  function displayItems(query) {
    connection.query(query, function(err, res){
        if(err) throw err;
        //to do: use console.table instead
        console.log('\n' + 'Item-ID  ' + 'Product-Name  ' +  'Department-Name  '  +  'Price  ' +  'Quantity '); 
        console.log('------------------------------------------------------------------------------------------')
        for(var i =0; i<res.length; i++){
            var inventory = res[i];
            console.log(res[i].item_id +  " " +
                        res[i].product_name +  " " +
                        res[i].department_name +  " " +
                        '$' + res[i].price.toFixed(2) +  " " + 
                        res[i].stock_quantity); 
            console.log('------------------------------------------------------------------------------------------')
        }
        connection.end();
    })     
}

