//instagram page, error page, home page, search page, rolldice page with EJS in views and CSS & JS in public

//npm init -y: for package.json
//installed packages: express, EJS-> npm install express/EJS (both)
//EXPRESS-> framework node.js back end web application framework. Used to built RESTful APIs.
//EJS-> tool/blueprint/layout/template for generating HTML with plain JavaScript

//require() a built-in function to include external modules that exist in separate files
//4 basic uses of express: 1.listen to request, 2.parse request, 3.route request, 4.send response to request 
const express=require("express");   //requiring express, it return a value i.e. express()
const app=express();    //storing express() in app
const path=require("path"); //'path' is a package we need to require:-
                            //provides a way of working with directories and file paths

//nodemon indes.js: starts the server   //Ctrl+C to stop
let port=8080;  //connection point- logical endpoints of network connection b/w web server and web client
app.listen(port,()=>{   //use to start the server- listens to incomming API request
    console.log(`listning on port ${port}`);
});
//localhost:8080-> on brouser to send API request to port 8080

//app.use listen request and/or send response to all types of routes
// app.use((req,res)=>{  //'use' listen to all types of request, e.g. get, post, etc. Then execte the callback
//     console.log("requesr received");    //req,res are two parameters created by express
//     console.log(req);//http request are text based so every programming language/technologies can understand
//                      //but express converts/parss it into object i.e 'req' object
//     res.send("this is a basic response");  //sending basic string response using 'res' object
// });
//express converts incoming text based request to object which is 'req' parameter
//and to send response 'res' object(also a parameter) is used

//static files should be in 'public' folder in same directory (default)
//serving static files: 'public' folder will serve all static files like CSS, JS.
//or it we make other folders inside 'public' to server static files
//using this we can use CSS and JS with EJS externelly
//and also do not need to write directory of these files in EJS
app.use(express.static(path.join(__dirname,"/public/css")));    //do require 'path' package first
app.use(express.static(path.join(__dirname,"/public/js")));
//also always define directory using path.join() for these files, just to be safe
//express.static()-> Middleware?

//we do not need to require EJS, express required it internally
app.set("view engine","ejs");   //view-> template, view/template engine-> ejs //setting 'view engine' to 'ejs'
//generally we store EJS file in 'views' folder in same directory
app.set("views",path.join(__dirname,"/views"));    //do require 'path' package first
//setting path of 'views' folder is needed if running server form a different directory
//or just to be safe, always set path
//'path.join'-> use to join two paths, '__dirname'-> current directory where server is running form


app.get("/",(req,res)=>{    //routing- localhost:8080/   :this is root path
    res.render("home.ejs");     //using EJS we do not use 'send', we use 'render' to send the EJS file
});

app.get("*",(req,res)=>{    //if path does to exist, then this will execute
    res.send("This page does not exist!");  //this can be used as custom error
});

//app.get is used to listen request and send response to specific path
app.get("/hello",(req,res)=>{   //routing- localhost:8080/hello
    res.send("HELLO");
});

app.get("/search",(req,res)=>{  //routing- localhost:8080/search?q=apple&color=red
    //                          //here apple and red are query strings (multiple query strings are possible)
    //console.log(req.query)    //prints all the query strings as an object e.g. {q:'apple', color:'red'}
    let {q}=req.query;          //storing query string(s)
    if(!q){                     //if there is no query string
        res.send("<h1>Nothing Searched</h1>");  //res.send() sends respond one at a time
    }
    res.send(`<h1>search results for query ${q}</h1>`); //will be ignored if (!q)
});

//rolldice
app.get("/rolldice",(req,res)=>{
    let diceVal=Math.floor(Math.random()*6)+1;
    res.render("rolldice.ejs",{diceVal});   //EJS will be able to use this object
});

//instagram
app.get("/ig/:username",(req,res)=>{//routing- localhost:8080/ig/(variable)
    //                              //:username is a variable i.e. path parameter, it will be saved in req object
    // console.log(req.params)  //prints all incoming values path parameter as an object
    // let {username}=req.params;   //store :username(path parameter)
    // let followers=["adam","eve","mark","jene"];
    // console.log(username);
    // res.render("instagram.ejs",{username,followers});    

    let {username}=req.params;  //storing requested ':username'
    const instaData=require("./data.json"); //requiring JSON file which contains data of all the users
    const data=instaData[username]; //storing data only for specific/requested user
    // console.log(data);
    if(data){
        res.render("instagram.ejs",{data}); //EJS will be able to use this object i.e. data of the user
    }                                       //render EJS as a response to client
    else{
        res.render("error.ejs"); //if user not found in JSON
    }
});




//Handling GET and POST request
//This is Backend.
//Go to Frontend and open index.html, then Submit responses.

app.get("/register",(req,res)=>{
    let {user,password} = req.query;
    res.send(`Standard GET response. WELCOME ${user}!`);
});
//GET: used to get some response, data set in query strings (drawbacks): limited, only sting data, visible in URL
//GET request Data can be accessed using 'req.query', as data here can only be query strings


//parse data, if data is in urlencoded format (this is request data)
app.use(express.urlencoded({extended:true}));   //standard line, used every time when using post request
//express.urlencoded()-> middleware?
// parse data, if data is in JSON format
// app.use(express.json());

app.post("/register",(req,res)=>{
    let {user,password} = req.body;
    res.send(`Standard POST response. WELCOME ${user}!`);
});
//POST: used to post something(for create, write, update), data sent via request body: any type of data
//POST request Data can be accessed by parsing, then using 'req.body' 
//'req.body' has no default format, we have to define middlewares to parse data
//if right middleware is not defined, then 'req.body' will be 'undefined'




var methodOverride = require('method-override');    //used to override POST request to PUT, PATCH, DELETE etc.
app.use(methodOverride('_method'));    //finds _method in query string and override accodingly
//e.g. html form-> <form method="POST" action="/user/<%= user.id %>?_method=DELETE">
                //overrides POST request with DELETE request


//REST API requsets types to perform CURD operations- GET, POST, PATCH, DELETE
//app.get()- to show/read
//app.post()- to create
//app.pach()- to update/edit
//app.delete()- to destroy/delete


const { v4: uuidv4 } = require('uuid');     //used to create unique id
//e.g. uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'




//inseting random data(using faker) to MySQL database though node(using MySQL2 package)
const { faker } = require('@faker-js/faker');
//generates random data i.e. id, name, email, image, password, birthdate, registration date, etc.
const mysql = require('mysql2');
//connects/links Node wih MySQL


// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'DB1',        //database name
    password: '123'   //MySQL password
}); //connection established

// let q='SHOW TABLES'; //SQL query

//manually entring data //'?'-> placeholder
// let q='INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?);';   //SQL query
// let user=["123", "123user","123user@gmil.com","123userPass"];   //to insert new data(row) into user table
// let user2=["123b", "123userb","123userb@gmil.com","123userPassb"];   //one at a time

//another way to insert new multiple data(rows) into user table
// let q='INSERT INTO user (id, username, email, password) VALUES ?;'; //single question mark
// let users=[
//     ["123c", "123userc","123userc@gmil.com","123userPassc"],
//     ["123d", "123userd","123userd@gmil.com","123userPassd"],
//     ["123e", "123usere","123usere@gmil.com","123userPasse"],
//     ["123f", "123userf","123userf@gmil.com","123userPassf"]
// ];
//'user'->'(?,?,?,?)' for single insert, '[users]'-> '?' for one or multiple insert using 'connection.query'

let getRandomUser= () => {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];    //return array with random data
}
let q='INSERT INTO user (id, username, email, password) VALUES ?;';
let data=[]
for(let i=1;i<=100;i++){
    data.push(getRandomUser());
}   //100 random user data

// simple query
try{//here 'connection' object has a method/function 'query' that runs SQL query
    connection.query(q, [data],
        (err, results, fields)=> {
            if(err)     throw err;
            console.log(results); // results contains rows/result of query returned by server
            // console.log(fields); // fields contains extra meta data about results, if available (not required)
        }
    );
}
catch(err){ //if error occurs, maybe wrong query syntax, etc.
    console.log(err);
}
/*
ResultSetHeader {
    fieldCount: 0,
    affectedRows: 4,
    insertId: 0,
    info: 'Records: 4  Duplicates: 0  Warnings: 0',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 0
}*/ //result in terminal for INSERT query

connection.end();   //to close connection with database


// let getRandomUser= () => {
//   return {
//     id: faker.string.uuid(),
//     username: faker.internet.userName(),
//     email: faker.internet.email(),
//     password: faker.internet.password(),
//   };    //return object with random data
// }
// console.log(getRandomUser());