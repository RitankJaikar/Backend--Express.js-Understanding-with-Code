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