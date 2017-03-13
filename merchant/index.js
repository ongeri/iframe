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
//http://172.26.40.95:6082/collections/api/v1/payments
app.post('/collections/payment', function(req ,resp){
	
	//make request here
	var obj = {
		transactionReference: req.body.transactionReference || "",
		merchantCode: req.body.merchantCode || "",
		currencyCode: req.body.currencyCode || "",
		payableId: req.body.payableId || "",
		amount: req.body.amount || "",
		dataOfPayment: "2016-09-05T10:20:26",
		merchantCustomerId: req.body.merchantCustomerId || "",
		channel: req.body.channel || ""
	};
	console.log("request from browser "+JSON.stringify(obj));
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