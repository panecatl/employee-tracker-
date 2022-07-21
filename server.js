// importing sql modules 
const mysql = require('mysql2');
// importing express
const express = require('express');
// importing inquirer
const inquirer = require('inquirer');
// import console.table
const cTable = require('console.table');

require('dotenv').config()

// connecting to databse 
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'ringomillie',
        database: 'employee'
    },
    console.log('Connected to the employee database.')
);
