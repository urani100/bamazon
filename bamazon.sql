create database bamazon;

use bamazon;
SET SQL_SAFE_UPDATES = 0;

create table products ( 
	id integer NOT NULL AUTO_INCREMENT primary key,
    item_id varchar(30),
    product_name varchar(255),
    department_name varchar(255),
    price float,
    stock_quantity integer,
    product_sales float

);

create table departments( 
	department_id integer NOT NULL AUTO_INCREMENT primary key,
    department_name varchar(30) ,
    over_head_costs float
);


select * from products;
select * from departments;
