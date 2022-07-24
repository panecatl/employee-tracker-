// importing sql modules 
const mysql = require('mysql2');
// importing express
const express = require('express');
// importing inquirer
const inquirer = require('inquirer');
// import console.table
const cTable = require('console.table');

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

connection.connect(err => {
    if (err) throw err;
    console;e.log('connected as id ' + connection.threadId);
    afterConnection();
});

//  function that will show load screen
afterConnection = () => {
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*        EMPLOYEE MANAGER         *")
    console.log("*                                 *")
    console.log("***********************************")
    promptUser();
};

// inquirer prompt for first question
const promptUser = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a depatment', 'Add a role', 'Add an employee', 'Update and employee role', 'Update an employee manager',
                        'View employees by department', 'Delete a department', 'Delete a role', 'Delete an employee', 'View department budgets', 'No action']
        }
    ])
    .thhen((answers) => {
        const { choices } = answers;

        if (choices === 'View all departments') {
            showDepartments();
        }

        if (choices === 'View all roles') {
            showRoles();
        }

        if (choices === 'View all employees') {
            showEmployees();
        }

        if (choices === 'Add department') {
            addDepartment();
        }

        if (choices === 'Add role') {
            addRole();
        }

        if (choices === 'Add an employee') {
            addEMployee();
        }

        if (choices === 'Update an employee role') {
            updateEmployee();
        }

        if (choices === 'Update an employee manager') {
            updateManager();
        }

        if (choices === 'View employees by department') {
            employeeDepartment();
        }

        if (choices === 'Delete a department') {
            deleteDepartment();
        }

        if (choices === 'Delete a role') {
            deleteRole();
        }

        if (choices === 'Delete an employee') {
            deleteEMployee();
        }

        if (choices === 'View department budgets') {
            viewBudget();
        }

        if (choices === 'No action') {
            connection.end()
        };
    });
};