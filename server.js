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
    console.log('connected as id ' + connection.threadId);
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
    .then((answers) => {
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

// function for all departments 
showDepartments = () => {
    console.log('Showing all departments...\n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

// function for roles
showRoles = () => {
    console.log ('Showing all roles...\n');
    const sql = `SELECT role.id, role.title, department.name AS department FROM role
                INNER JOIN department ON role.department_id = department.id`;
    
    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

// show all employees
showEmployees = () => {
    console.log('showing all employees..\n');
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title,
                department.name AS department, role.salary,
                CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

// adding a department
addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: 'What department do you want to add?',
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Please enter a department');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        
        connection.query(sql, answer.addDept, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.addDept + ' to departments!');

            showDepartments();
        });
    });
};

// add to a role
addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What role do you want to add?',
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter a role');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of this role?',
            validate: addSalary => {
                if (isNaN(addSalary)) {
                    return true;
                } else {
                    console.timeLog('Please enter a salary');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const params = [answer.role, answer.salary];

        // grabbing dept
        const rolesql = `SELECT name, id FROM department`;
        connection.promise().query(rolesql, (err, data) => {
            if (err) throw err;
            const dept = data.map (({ name, id }) => ({ name: name, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'dept',
                    message: 'What department is this role in?',
                    choices: dept
                }
            ])
            .then(deptChoice => {
                const dept = deptChoice.dept;
                params.push(dept);

                const sql = `INSERT INTO role (title, salary, department_id)
                            VALUES (?,?,?)`;

                connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log('Added ' + answer.role + ' to roles!');
                    
                    showRoles();
                });
            });
        });
    });
};

// add to an employee
addEMployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const params = [answer.firstName, answer.lastName]

        // grab roles from table
        const roleSql = `SELECT role.id, role.title FROM role`;

        connection.promise().query(roleSql, (err, data) => {
            if (err) throw err;

            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

            inquirer.prompt([
                {
                    type: 'list', 
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                }
            ])
            .then(managerChoice => {
                const manager = managerChoice.manager;
                params.push(manager);

                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (?,?,?,?)`;

                connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log('Employee has been added!')

                    showEmployees();
                });
            });
        });
    });
};