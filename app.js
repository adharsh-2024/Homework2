/*
  app.js -- This creates an Express webserver
*/

//added 942 june 23
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const layouts = require("express-ejs-layouts");
const session = require("express-session");
const bodyParser = require("body-parser");
const axios = require("axios");
var debug = require("debug")("personalapp:server");

////////////////////////////////////////////
//monguse stuff
const mongoose = require( 'mongoose' );
//mongoose.connect( `mongodb+srv://${auth.atlasAuth.username}:${auth.atlasAuth.password}@cluster0-yjamu.mongodb.net/authdemo?retryWrites=true&w=majority`);
mongoose.connect( 'mongodb://localhost/personalapp'); //do we need to change this?
//const mongoDB_URI = process.env.MONGODB_URI
//mongoose.connect(mongoDB_URI)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});
//////////////////////////////////////////
const User = require('./models/User');
const authRouter = require('./routes/authentication');
const isLoggedIn = authRouter.isLoggedIn
const loggingRouter = require('./routes/logging');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');




const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(layouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRouter)
app.use(loggingRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);


const myLogger = (req,res,next) => {
  console.log('inside a route!')
  next()
}
// First we load in all of the packages we need for the server...





// Here we specify that we will be using EJS as our view engine


// Here we process the requests so they are easy to handle
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Here we specify that static files will be in the public folder
app.use(express.static(path.join(__dirname, "public")));

// Here we enable session handling ..
app.use(
  session({
    secret: "zzbbya789fds89snana789sdfa",
    resave: false,
    saveUninitialized: false
  })
);

//app.use(bodyParser.urlencoded({ extended: false }));

// This is an example of middleware
// where we look at a request and process it!
app.use(function(req, res, next) {
  //console.log("about to look for routes!!! "+new Date())
  console.log(`${req.method} ${req.url}`);
  //console.dir(req.headers)
  next();
});

// here we start handling routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/demo",
        function (req, res){res.render("demo");});

app.get("/about", (request, response) => {
  response.render("about");
});

app.get("/form", (request,response) => {
  response.render("form")
})

app.post("/showformdata", (request,response) => {
  response.locals.title = "Form Page"
  response.locals.name = request.body.fullname
  response.locals.age = request.body.age
  response.locals.body = request.body
  response.render("formData")
})

app.get("/dataDemo", (request,response) => {
  response.locals.name="Adharsh Ravi"
  response.locals.vals =[1,2,3,4,5]
  response.locals.people =[
    {'name':'Adharsh','age':19}]
  response.render("dataDemo")
})



// Here is where we will explore using forms!



// this example shows how to get the current US covid data
// and send it back to the browser in raw JSON form, see
// https://covidtracking.com/data/api
// for all of the kinds of data you can get
app.get("/c19",
  async (req,res,next) => {
    try {
      const url = "https://covidtracking.com/api/v1/us/current.json"
      const result = await axios.get(url)
      res.json(result.data)
    } catch(error){
      next(error)
    }
})


///app.get("/carboninterface",
/*  async (req, res, next) => {
    try {
      const url = "https://www.carboninterface.com/api/v1/auth"
      const result = await axios.get(url,
      {  headers:
        {
          "Content-Type":"application/json",
          "Authorization":"Bearer 6eDvnMFc8Ku2khxTR3A"
        }
      }
      )
      res.json(result.data)
    } catch(error){
      next(error)
   }
 }) */
 app.get("/climateform", (request,response) => {
   response.render("climatedataform")
 })



 app.post("/showmonthlyData",
   async (req,res,next) => {
     try {
       const datafeature = req.body.datafeature
       const datatype = req.body.datatype
       const startyear = req.body.startyear
       const endyear = req.body.endyear
       const country = req.body.country
       const url = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/"+datafeature+"/"+datatype+"/"+startyear+"/"+endyear+"/"+country
       console.log(url)
       const result = await axios.get(url)
       console.dir(result.data)
       console.log('results')
       res.locals.results = result.data
       res.render('showClimateData')
     } catch(error){
       next(error)
     }
 })





app.get("/monthlyavgprec",
  async (req, res, next) => {
    try {
      const url = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/mavg/pr/1940/1959/CHE"
      const result = await axios.get(url)
      console.dir(result.data)
      console.log('results')
      res.locals.results = result.data
      res.render('showmonthlyavgprec')
    } catch(error){
      next(error)
   }
  })


app.get("/monthlyavgtemp",
  async (req, res, next) => {
    try {
      const url = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/mavg/tas/1940/1959/CHE"
      const result = await axios.get(url)
      console.dir(result.data)
      console.log('results')
      res.locals.results = result.data
      res.render('showmonthlyavgtemp')
    } catch(error){
      next(error)
   }
  })

app.get("/annualavgprec",
  async (req, res, next) => {
    try {
      const url = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/annualavg/pr/1940/1959/CHE"
      const result = await axios.get(url)
      console.dir(result.data)
      console.log('results')
      res.locals.results = result.data
      res.render('showannualavgprec')
    } catch(error){
      next(error)
   }
  })

app.get("/annualavgtemp",
  async (req, res, next) => {
    try {
      const url = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/annualavg/tas/1940/1959/CHE"
      const result = await axios.get(url)
      console.dir(result.data)
      console.log('results')
      res.locals.results = result.data
      res.render('showannualavgtemp')
    } catch(error){
      next(error)
   }
  })

app.get("/monthlyanomprec",
  async (req, res, next) => {
    try {
      const url = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/manom/pr/2020/2039/CHE"
      const result = await axios.get(url)
      console.dir(result.data)
      console.log('results')
      res.locals.results = result.data
      res.render('showmonthlyanomprec')
    } catch(error){
      next(error)
   }
  })

app.get("/monthlyanomtemp",
  async (req, res, next) => {
    try {
      const url = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/manom/tas/2020/2039/CHE"
      const result = await axios.get(url)
      console.dir(result.data)
      console.log('results')
      res.locals.results = result.data
      res.render('showmonthlyanomtemp')
    } catch(error){
      next(error)
   }
  })

app.get("/annualanomprec",
  async (req, res, next) => {
    try {
      const url = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/annualanom/pr/2020/2039/CHE"
      const result = await axios.get(url)
      console.dir(result.data)
      console.log('results')
      res.locals.results = result.data
      res.render('showannualanomprec')
    } catch(error){
      next(error)
   }
  })

app.get("/annualanomtemp",
  async (req, res, next) => {
    try {
      const url = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/annualanom/tas/2020/2039/CHE"
      const result = await axios.get(url)
      console.dir(result.data)
      console.log('results')
      res.locals.results = result.data
      res.render('showannualanomtemp')
    } catch(error){
      next(error)
   }
  })


  app.get("/apikey", async (req,res,next) => {
    res.render('apikey')
  })

  const APIKey = require('./models/APIKey')

  app.post("/apikey",
    isLoggedIn,
    async (req,res,next) => {
      const domainName = req.body.domainName
      const apikey = req.body.apikey
      const apikeydoc = new APIKey({
        userId:req.user._id,
        domainName:domainName,
        apikey:apikey
      })
      const result = await apikeydoc.save()
      console.log('result=')
      console.dir(result)
      res.redirect('/apikeys')
  })


// this shows how to use an API to get recipes
// http://www.recipepuppy.com/about/api/
// the example here finds omelet recipes with onions and garlic
app.get("/omelet",
  async (req,res,next) => {
    try {
      const url = "http://www.recipepuppy.com/api/?i=onions,garlic&q=omelet&p=3"
      const result = await axios.get(url)
      res.json(result.data)
    } catch(error){
      next(error)
    }
})


app.get('/cocktail', (req,res) => {
  res.render('cocktail')
})

app.post("/findspecificCocktail",
  async (req,res,next) => {
    try {
      const cocktail = req.body.cocktail
      const url = "http://www.thecocktaildb.com/api/json/v1/1/search.php?s="+cocktail
      const result = await axios.get(url)
      console.dir(result.data)
      console.log('results')
      console.dir(result.data.drinks)
      res.locals.results = result.data
      //res.json(res.locals.results)
      res.render('showCocktail')
    } catch(error){
      next(error)
    }
})

// Don't change anything below here ...

// here we catch 404 errors and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// this processes any errors generated by the previous routes
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Here we set the port to use
const port = "5000";
app.set("port", port);

// and now we startup the server listening on that port
const http = require("http");
const server = http.createServer(app);

server.listen(port);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on("error", onError);

server.on("listening", onListening);

module.exports = app;
