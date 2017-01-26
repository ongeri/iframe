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

app.disable('X-Powered-By');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'/server/public'));
//app.enable('view cache');
app.use(serveStatic(path.join(__dirname, 'dist')));

var hbs = exphbs.create({

	layoutsDir : path.join(app.get('views'),'/'),

	partialsDir : path.join(app.get('views'),'partials/')

});

app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer());


// app.use(methodOverride());

app.get('/status', function(req, res){
  res.status(200).json({message: "Hi There!!!"});
});
//send simple file back

app.get('*', function(req,res){

	//req.log.info({session : req.session, req : req});
	//res.render('index');

	res.render("help",
		{
			showTitle : true
		}
	);
});

app.listen(3000, function () {
  console.log('Server up and running on port 3000!')
})