//npm pacakes
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');

//databse connection 
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "****", //use appropriate password
    database: "bamazon"
  });
  
  connection.connect(function(err) {
      if (err) throw err;
      console.log('connection established : ' + connection.threadId)
      supervisorOptions();
    });

//supervisorOptions function
  function supervisorOptions(){
      inquirer
      .prompt({
          name: 'options',
          type: 'list',
          message: 'What action would you like to perform',
          choices:[
            'View Product Sales by Department',
            'Create New Department'
          ]
      }).then(function(answer){

        if(answer.options === 'View Product Sales by Department') {
            productSales();
        }else{
            addDept();
        }
      })
  }


//productSales function
  function productSales(){
      var query ="select a.department_id as DEP_ID, a.department_name as DEP_Name, a.over_head_costs as Over_Head_cost, FORMAT(sum(b.product_sales),2) as Total_Product_Sale,  FORMAT(over_head_costs - sum(b.product_sales), 2) as Total_Profit from  departments a left join  products b on a.department_name = b.department_name group by  a.department_id order by a.department_id"
      connection.query(query, function(err, res){
          if(err) throw err;
          console.table(res);
          connection.end();
      })
  }


//addDept function
function addDept(){
    inquirer
    .prompt(
        [{
            name:'department_name',
            type:'input',
            message: 'Enter the department_name'
        },
        {
            name: 'over_head_costs',
            type:'input',
            message: 'Enter the over_head_costs'
        }]
    ).then(function(res){
        var query = 'insert into departments SET ?';
        connection.query(query, 
            [{
                department_name: res.department_name, 
                over_head_costs: res.over_head_costs
            }], function(err, resonse){
                console.log('The Department ' + res.department_name + ' has successfully been added to the Department table')
            connection.end();
        })
        
    })
}
