var express = require('express');
var fs=require('fs');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var serveStatic = require('serve-static');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var exphbs = require('express-handlebars');
const uuidV4 = require('uuid/v4');

app.disable('X-Powered-By');
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname,'/demo'));
//app.enable('view cache');
app.use(serveStatic(path.join(__dirname, '../dist')));
app.use(serveStatic(path.join(__dirname, 'public')));

var hbs = exphbs.create({

	layoutsDir : path.join(app.get('views'),'/'),

	partialsDir : path.join(app.get('views'),'partials/')

});

app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(multer());

app.use(methodOverride());

//allow cross origin request
app.use(function(req, res, next) {
  //console.log("It hit the server");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.use(methodOverride());


app.get('*', function(req,res){

	//req.log.info({session : req.session, req : req});
	//res.render('index');

	res.render("demo",
		{
			showTitle : true
		}
	);
});

app.listen(4000, function () {
  console.log('Server up and running on port 4000!')
})