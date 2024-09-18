const express = require('express');
const mysql2 = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyparse = require('body-parser');
const path = require('path');
const {check, validationResult } = require('express-validator');
const { request } = require('http');
const { table, error } = require('console');
const { exit } = require('process');

// iniatialize
const app = express();

// configure midleware
app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyparse.json);
app.use(express.urlencoded({ extended: true }));

// create connection
const connection = mysql2.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Omokh@fue1234',
    database: 'expense_tracker'
});


connection.connect((err) => {
    if(err){
        console.error('error occured while connecting to the server: ' + err.stack);
        return;
    }
    console.log('DB server connected succeffully,');
});
app.get('/', (req, res) => {
    res.json({
      status: 'success',
      message: 'Welcome to whatevever',
    });
  });
//define rout to reistration form
app.get('/register', (request, response) => {
 //   response.sendFile(path.join(__dirname, 'register.html'));
 response.json({register: "hey"})
});

//define a user object - registration
const User = {
    tableName: 'users',
    createUser: function(newUser, callback){
        connection.query('INSER INTO ' + this.table + 'SET ?', newUser, callback);
    },   
    getUserByEmail: function(email, callback){
        connection.query('SELECT * FROM ', + this.tableName + 'WHERE email = ?', email, callback);
    },
    getUserByUsername: function(username, callback){
        connection.query('SELECT * FROM ' + this.tableName + 'WHERE username = ?', usrename, callback);
    },
}

//define registration route and logic
app.post('/plp/users/registration',[

//validation
check('email').isEmail(),
check('username').isAlphanumeric().withMessage('invalid username. provide alphanumeric value'),

check('email').custom(async(value) => {
const exist = await user.getUserByEmail(value);
if(exist){
    throw new Error('email already exist');
}
}),

check('username').custom(async(value) => {
    const exist = await user.getUserByUsername(value);
    if(exist){
        throw new error('username alredy in use')
    }
})

], async (request, response) => {
    
//check for validation
const errors = validationResult(request);
if(!errors.isEmpty()){
    return response.status(400).json({errors: errors.array()})
}

//hash password
const saltRounds = 10;
const hashepassword = await bcrypt.hash(request.body.password, saltRounds);

//define a new user object
const newUser = {
    full_name: request.body.full_name,
    email: request.body.email,
    username: request.body.username,
    password: hashepassword
}
// save new user
User.createUser(newUser, (error) => {
if(error){
    console.error('an error occured while saving the record: ' + error. message);
    return responsee.status(500).json({error: error.message});
}
console.log('newUser record saved');
response.status(201).send('registration successfull');
});

});


app.listen(4000,() => {
    console.log('server is runing on port 3000');
});