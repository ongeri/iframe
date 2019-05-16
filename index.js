var express = require('express');
var fs = require('fs');
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
app.set('views', path.join(__dirname, '/server/public'));
//app.enable('view cache');
app.use(serveStatic(path.join(__dirname, 'dist')));
app.use(express.static('public'));

var hbs = exphbs.create({

    layoutsDir: path.join(app.get('views'), '/'),

    partialsDir: path.join(app.get('views'), 'partials/')

});

app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(multer());

app.use(methodOverride());

//allow cross origin request
app.use(function (req, res, next) {
    //console.log("It hit the server");
    //res.header("Access-Control-Allow-Origin", "*");
    var allowedOrigins = ['https://testids.interswitch.co.ke:7784', 'http://localhost:7784', 'http://154.118.230.214:8006', 'http://154.118.230.18:8006', 'https://flutterwavestagingv2.com', 'http://flutterwavestagingv2.com', 'https://testmerchant.interswitch-ke.com:7787', 'https://testmerchant.interswitch-ke.com'];
    var origin = req.headers.origin;
    console.log("Request origin is : " + origin);
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Timestamp, Nonce, Authorization, Signature, SignatureMethod");
    next();
});

// app.use(methodOverride());

app.get('/status', function (req, res) {
    res.status(200).jsonp({message: "Hi There!!!", status: 200});
});
//send simple file back

app.get('/api/v1/configuration', function (req, res) {
    res.status(200).json({
        clienturl: 'http://172.16.112.4:3000/api/'
    });
});

app.get('/api/v1/merchant/configuration', function (req, res) {
    console.log("request to get config is " + JSON.stringify(req.body));
    console.log("request to get MID is " + JSON.stringify(req.query.MID));
    console.log("header to get config is " + JSON.stringify(req.headers));
    res.status(200).json([
        {
            clienturl: 'http://172.16.112.4:3000/api/'
        },
        {
            MID: '100',
            name: 'interswitch',
            card: '1',
            mpesa: '1',
            equitel: '1',
            tkash: '1',
            airtel: '1',
            paycode: '1',
            mpesaPaybill: '889104',
            equitelPaybill: '123456',
            clientId: 'IKIAB8FA9382D1FAC6FCA2F30195029B0A1558A9FECA',
            clientSecret: 'dxdmtf12FhLVIFRz8IzhnuAJzNd6AAFVgx/3LlJHc+4='
        },
        {
            MID: '101',
            name: 'Card merchant',
            card: '1',
            mpesa: '0',
            equitel: '0',
            tkash: '0',
            airtel: '0',
            paycode: '0',
            mpesaPaybill: '889104',
            equitelPaybill: '123456',
            clientId: 'IKIAB8FA9382D1FAC6FCA2F30195029B0A1558A9FECA',
            clientSecret: 'dxdmtf12FhLVIFRz8IzhnuAJzNd6AAFVgx/3LlJHc+4='
        },
        {
            MID: '102',
            name: 'Mobile Money merchant',
            card: '0',
            mpesa: '1',
            equitel: '1',
            tkash: '1',
            airtel: '0',
            paycode: '0',
            mpesaPaybill: '889104',
            equitelPaybill: '123456',
            clientId: 'IKIAB8FA9382D1FAC6FCA2F30195029B0A1558A9FECA',
            clientSecret: 'dxdmtf12FhLVIFRz8IzhnuAJzNd6AAFVgx/3LlJHc+4='
        },
        {
            MID: '103',
            name: 'paycode merchant',
            card: '0',
            mpesa: '0',
            equitel: '0',
            tkash: '0',
            airtel: '0',
            paycode: '1',
            mpesaPaybill: '889104',
            equitelPaybill: '123456',
            clientId: 'IKIAB8FA9382D1FAC6FCA2F30195029B0A1558A9FECA',
            clientSecret: 'dxdmtf12FhLVIFRz8IzhnuAJzNd6AAFVgx/3LlJHc+4='
        }

    ]);
});

app.get('/api/v1/merchant/configuration/new', function (req, resp) {
    //console.log("request to complete pay is "+JSON.stringify(req.body));
    console.log("request to get config MID is " + req.query.MID);
    //console.log("header to complete pay is "+JSON.stringify(req.headers));
    //console.log("header host to complete pay is "+req.headers.host);
    req.headers.host = "http://172.16.112.4:9080";
    //headers: req.headers,
    request({
        url: req.headers.host + '/api/v1/merchant/mfb/config/' + req.query.MID,
        json: true,
        body: req.body,
        headers: req.headers,
        method: 'GET'
    }, function (err, res, body) {

        if (err) {
            console.log(err);
            resp.status(400).json(body);
            console.log(JSON.stringify(body));
        }
        else {
            console.log(JSON.stringify(body));
            /*if(res.statusCode == 200){
                var esbresp = body;
                var config = esbresp.config;

                body = [
                            {
                                clienturl: 'http://172.16.112.4:3000/api/'
                            },
                            {
                                MID: config.merchantId,
                                name: config.merchantName,
                                card: config.cardStatus,
                                mpesa: config.mpesaStatus,
                                equitel: config.equitelStatus,
                                tkash: config.tkashStatus,
                                airtel: config.airtelStatus,
                                paycode: config.paycodeStatus,
                                mpesaPaybill: config.mpesaPaybill,
                                equitelPaybill: config.equitelPaybill,
                                clientId : config.clientId,
                                clientSecret : config.clientSecret
                            }

                        ];

                var bodyres = body;

                resp.status(res.statusCode).json(bodyres);
            }
            else{
                resp.status(res.statusCode).json(body);
            }*/

            resp.status(res.statusCode).json(body);

        }
    });
});

app.post('/api/v1/payment/hosted', function (req, res) {
    //console.log("pay request "+JSON.stringify(req.body));
    var creditModel = req.body.creditCardDetails || {};
    var pan = creditModel.pan;
    console.log("pan is " + pan);
    var pin = creditModel.pin;
    var uniq = uuidV4();
    //console.log("paying with a pan of "+JSON.stringify(req.body));
    res.status(200).json({
        message: "Payment Successful for " + pan,
        payref: uniq,
        pan: pan
    });
});

app.post('/collections/pay', function (req, resp) {
    console.log("request to complete pay is " + JSON.stringify(req.body));
    request({
        url: 'https://qa.interswitchng.com/collections/api/v1/pay',
        json: true,
        body: req.body,
        method: 'POST'
    }, function (err, res, body) {
        if (err) {
            resp.status(400).json(body);
        }
        else {
            console.log(JSON.stringify(body));
            resp.status(res.statusCode).json(body);

        }
    });
});

app.post('/collections/pay/ke', function (req, resp) {
    console.log("request to complete pay is " + JSON.stringify(req.body));
    console.log("header to complete pay is " + JSON.stringify(req.headers));
    request({
        url: req.headers.host + '/api/v1/merchant/transact/cards',
        json: true,
        body: req.body,
        headers: req.headers,
        method: 'POST'
    }, function (err, res, body) {
        if (err) {
            resp.status(400).json(body);
        }
        else {
            console.log(JSON.stringify(body));
            /*if(res.statusCode == 200){
                var esbresp = body;
                var payref = esbresp.transactionRef;

                var bodyres = {
                    message: "Payment Successful",
                    payref: payref
                }

                resp.status(res.statusCode).json(bodyres);
            }
            else{
                resp.status(res.statusCode).json(body);
            }*/

            resp.status(res.statusCode).json(body);

        }
    });
});

/*app.post('/collections/payment', function(req, resp){
	console.log("request from internal-hosted-field "+JSON.stringify(req.body));
	var response = {
      id: 200,
      payableId: 10,
      amount: 100,
      surcharge: 10,
      paymentCancelled: 0,
      dateOfPayment: '24/07/2018',
      remittanceAmount: 150,
      currencyCode: '404',
      merchantCustomerId: '10',
      transactionRef: '12345',
      responseCode: '00',
      responseDescription: 'success',
      channel: 'web',
      merchantCode: '112'
	};
	resp.status(201).json(response);
	// request({
	// 	url: 'http://172.26.40.95:6082/collections/api/v1/payments',
	// 	json:true,
	// 	body: req.body,
	// 	method: 'POST',
	// 	headers: {
	// 	 'content-type': 'application/json',
	// 	 Authorization: "Bearer eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOlsiaXN3LWNvbGxlY3Rpb25zIiwiaXN3LWNvcmUiLCJpc3ctaW5zdGl0dXRpb24iLCJpc3ctcGF5bWVudGdhdGV3YXkiLCJwYXNzcG9ydCJdLCJzY29wZSI6WyJwcm9maWxlIl0sImp0aSI6ImI2NWEyNTI4LTc5YjMtNDIyNi05MmQxLWY2NTVkM2ExOTE5MyIsImNsaWVudF9pZCI6Imlzdy1wYXltZW50Z2F0ZXdheSJ9.JFDZlcOquq07T_-lqeDPJl9N2zT5pziWzI7HTcoUgz3MyUKvBuTbOsBbjLaXX4SEHe78kw62Tqq2seboJMoK6K6k89-pA4-hHcWw2y7qFEhZThxJtQeBk6VtfjcfJZYwRjSGgbl7uA7_K0729iRjlFucBdS7DzzAZC90FtotIVJvvFlBtTvSSzMC33RUcZliPpcz4CDEXfZupNLG-QgHtt8vNrGQxR6tYGiPPbbbnWZIJk7wcdwE_TmQsvgF83NmDGHnso_KFQcdQTz1GIYULzi38vxDMjwtD6vF3b_E_CvS3bOA8yhujzcvuJb1au915WMewW3VEj6d1bJsR2guAQ"
	// 	}
	// 	}, function(err, res, body){
	// 		if(err) {
	// 			resp.status(400).json(body);
	// 		}
	// 		else {
	// 		console.log(JSON.stringify(body));
	// 		resp.status(res.statusCode).json(body);

	// 	}
 //  	});
});*/

app.post('/collections/payment', function (req, resp) {
    console.log("request from internal-hosted-field " + JSON.stringify(req.body));
    var response = {
        id: 200,
        payableId: 10,
        amount: req.body.amount,
        surcharge: req.body.surcharge,
        paymentCancelled: 0,
        dateOfPayment: req.body.dateOfPayment,
        remittanceAmount: req.body.remittanceAmount,
        currencyCode: req.body.currencyCode,
        merchantCustomerId: req.body.merchantCustomerId,
        transactionRef: req.body.transactionReference,
        responseCode: '00',
        responseDescription: 'success',
        channel: req.body.channel,
        merchantCode: req.body.merchantCode,
        orderId: req.body.orderId || "",
        terminalId: req.body.terminalId || "",
        paymentItem: req.body.paymentItem || "",
        provider: req.body.provider || "",
        customerInfor: req.body.customerInfor || "",
        domain: req.body.domain || "",
        narration: req.body.narration || "",
        fee: req.body.fee || "",
        preauth: req.body.preauth || "",
        tokenize: req.body.tokenize || "",
        tranleg: req.body.tranleg || "",
    };

    console.log("response from internal-hosted-field " + JSON.stringify(response));
    resp.status(201).json(response);
    // request({
    // 	url: 'http://172.26.40.95:6082/collections/api/v1/payments',
    // 	json:true,
    // 	body: req.body,
    // 	method: 'POST',
    // 	headers: {
    // 	 'content-type': 'application/json',
    // 	 Authorization: "Bearer eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOlsiaXN3LWNvbGxlY3Rpb25zIiwiaXN3LWNvcmUiLCJpc3ctaW5zdGl0dXRpb24iLCJpc3ctcGF5bWVudGdhdGV3YXkiLCJwYXNzcG9ydCJdLCJzY29wZSI6WyJwcm9maWxlIl0sImp0aSI6ImI2NWEyNTI4LTc5YjMtNDIyNi05MmQxLWY2NTVkM2ExOTE5MyIsImNsaWVudF9pZCI6Imlzdy1wYXltZW50Z2F0ZXdheSJ9.JFDZlcOquq07T_-lqeDPJl9N2zT5pziWzI7HTcoUgz3MyUKvBuTbOsBbjLaXX4SEHe78kw62Tqq2seboJMoK6K6k89-pA4-hHcWw2y7qFEhZThxJtQeBk6VtfjcfJZYwRjSGgbl7uA7_K0729iRjlFucBdS7DzzAZC90FtotIVJvvFlBtTvSSzMC33RUcZliPpcz4CDEXfZupNLG-QgHtt8vNrGQxR6tYGiPPbbbnWZIJk7wcdwE_TmQsvgF83NmDGHnso_KFQcdQTz1GIYULzi38vxDMjwtD6vF3b_E_CvS3bOA8yhujzcvuJb1au915WMewW3VEj6d1bJsR2guAQ"
    // 	}
    // 	}, function(err, res, body){
    // 		if(err) {
    // 			resp.status(400).json(body);
    // 		}
    // 		else {
    // 		console.log(JSON.stringify(body));
    // 		resp.status(res.statusCode).json(body);

    // 	}
    //  	});
});

app.get('/file', function (req, res) {

    //req.log.info({session : req.session, req : req});
    //res.render('index');

    res.render("help",
        {
            showTitle: true
        }
    );
});

app.listen(3000, function () {
    console.log('Server up and running on port 3000!')
})
