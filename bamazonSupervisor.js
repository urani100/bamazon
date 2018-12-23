
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
      supervisorOptions();
    });


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
            addDepartment();
        }
      })
  }


const cTable = require('console.table');
  function productSales(){
      var query ="select a.department_id as DEP_ID, a.department_name as DEP_Name, a.over_head_costs as Over_Head_cost, sum(b.product_sales) as Total_Product_Sale,  FORMAT(over_head_costs - sum(b.product_sales), 2) as Total_Profit from  departments a left join  products b on a.department_name = b.department_name group by  a.department_id order by a.department_id"

      connection.query(query, function(err, res){
        
          if(err) throw err;
          console.table(res);
          connection.end();
      })
  }


  function addDepartment(){
    inquirer
    .prompt(
        [{
            name: 'department_name',
            type:'input',
            message: 'Enter Department Name'
        },
        {
            name: 'over_head_costs',
            type:'input',
            message: 'Enter Stock Over Head Costs',
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return 'You must enter a number';
              }
        }]
    ).then(function(res){
        var query = 'insert into departments SET ?';
        connection.query(query, 
            [{  
                department_name: res.department_name, 
                over_head_cost:res.over_head_cost
            }], function(err, resonse){
                console.log('The item ' + res.department_id + ' has successfully been added to the departments table')
            connection.end();
        })
        
    })
}

