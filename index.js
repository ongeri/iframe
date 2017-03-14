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
var request = require('request');

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

app.get('/status', function(req, res){
  res.status(200).jsonp({message: "Hi There!!!", status: 200});
});
//send simple file back

app.get('/api/v1/configuration', function(req, res){
	res.status(200).json({
		clienturl: 'http://localhost:3000/api/'
	});
});

app.post('/api/v1/payment/hosted', function(req, res){
	//console.log("pay request "+JSON.stringify(req.body));
	var creditModel= req.body.creditCardDetails || {};
	var pan = creditModel.pan;
	console.log("pan is "+pan);
	var pin = creditModel.pin;
	var uniq = uuidV4();
	//console.log("paying with a pan of "+JSON.stringify(req.body));
	res.status(200).json({
		message: "Payment Successful for "+pan,
		payref: uniq,
		pan: pan
	});
});

app.post('/collections/pay', function(req, resp){
	console.log("request to complete pay is "+JSON.stringify(req.body));
	request({
		url: 'https://qa.interswitchng.com/collections/api/v1/pay',
		json:true,
		body: req.body,
		method: 'POST'
		}, function(err, res, body){
			if(err) {
				resp.status(400).json(body);
			}
			else {
			console.log(JSON.stringify(body));
			resp.status(res.statusCode).json(body);
			
		}
  	});
});
app.post('/collections/payment', function(req, resp){
	console.log("request from internal-hosted-field "+JSON.stringify(req.body));
	request({
		url: 'http://172.26.40.95:6082/collections/api/v1/payments',
		json:true,
		body: req.body,
		method: 'POST',
		headers: {
		 'content-type': 'application/json',
		 Authorization: "Bearer eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOlsiaXN3LWNvbGxlY3Rpb25zIiwiaXN3LWNvcmUiLCJpc3ctaW5zdGl0dXRpb24iLCJpc3ctcGF5bWVudGdhdGV3YXkiLCJwYXNzcG9ydCJdLCJzY29wZSI6WyJwcm9maWxlIl0sImp0aSI6ImI2NWEyNTI4LTc5YjMtNDIyNi05MmQxLWY2NTVkM2ExOTE5MyIsImNsaWVudF9pZCI6Imlzdy1wYXltZW50Z2F0ZXdheSJ9.JFDZlcOquq07T_-lqeDPJl9N2zT5pziWzI7HTcoUgz3MyUKvBuTbOsBbjLaXX4SEHe78kw62Tqq2seboJMoK6K6k89-pA4-hHcWw2y7qFEhZThxJtQeBk6VtfjcfJZYwRjSGgbl7uA7_K0729iRjlFucBdS7DzzAZC90FtotIVJvvFlBtTvSSzMC33RUcZliPpcz4CDEXfZupNLG-QgHtt8vNrGQxR6tYGiPPbbbnWZIJk7wcdwE_TmQsvgF83NmDGHnso_KFQcdQTz1GIYULzi38vxDMjwtD6vF3b_E_CvS3bOA8yhujzcvuJb1au915WMewW3VEj6d1bJsR2guAQ"
		}
		}, function(err, res, body){
			if(err) {
				resp.status(400).json(body);
			}
			else {
			console.log(JSON.stringify(body));
			resp.status(res.statusCode).json(body);
			
		}
  	});
});

app.get('/file', function(req,res){

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