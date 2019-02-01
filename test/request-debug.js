var request = require("request");
var http = require("http");
var express = require("express");
var fileUpload = require("express-fileupload");
var fs = require("fs");

function wrap(obj, key, hook) {
	var _fun = obj[key];
	obj[key] = function () {
		hook.apply(this, arguments);
		this[key] = _fun;
		this[key].apply(this, arguments);
	};
}

var _request = http.request;
http.request = function (options) {
	var req = _request.apply(http, arguments);

	/*
	for (var key in req) {
		if (typeof(req[key]) == "function") {
			(function (key) {
				var _fun = req[key];
				req[key] = function () {
					this[key] = _fun;
					console.log("CALL: " + key);
					return this[key].apply(this, arguments);
				};
			})(key);
		}
	}
	*/

	var body = "";
	wrap(req, "_finish", function () {
		console.log("=== RAW ===");
		console.log(body);
	});

	wrap(req, "_send", function (data) {
		if (!req._headerSent) {
			data = req._header + data.toString();
		}
		body += data.toString();
	});


	return req;
};

var app = express();

app.use(fileUpload());

app.post("/upload", function(req, res) {
	console.log(JSON.stringify(req.body.array), " == [\"1\",\"2\"]");
	console.log(req.body.field, " == value");
	console.log(req.files.file.name, " == attachment1.png");
	console.log(req.files.attachments[0].name, " == attachment1.png");
	console.log(req.files.attachments[1].name, " == attachment1.png");
	console.log(req.files.custom.name, " == custom.png");
	console.log(req.files.custom.mimetype, " == image/custom");
	res.send("");
});

app.get("/", function (req, res) {
	res.send("");
});

app.listen(8080);

console.log("========================");

request({
	uri: "http://localhost:8080/1",
	qs: { a: [1,2], b: "text" },
	headers: {
		"User-Agent": "request"
	}
});

request({
	uri: "http://localhost:8080/2",
	body: "text"
});

request({
	uri: "http://localhost:8080/3",
	body: { a: 1, b: 2 },
	json: true
});

request({
	uri: "http://localhost:8080/3.1",
	body: { a: 1, b: 2 },
	headers: {
		"accept": "application/json1",
		"content-type": "application/json1"
	},
	json: true
});

request({
	uri: "http://localhost:8080/3.2",
	json: true
});

request({
	uri: "http://localhost:8080/4",
	method: "POST",
	body: Buffer.from("text")
});

request({
	uri: "http://localhost:8080/5",
	form: { a: 1, b: 2 }
});

request({
	uri: "http://localhost:8080/5.1",
	form: { a: 1, b: 2 },
	headers: {
		"content-type": "application/other"
	}
});

request({
	uri: "http://localhost:8080/upload",
	method: "POST",
	formData: {
		field: "value",
		array: [1,2],
		file: fs.createReadStream(__dirname + "/attachment1.png"),
		attachments: [
			fs.createReadStream(__dirname + "/attachment2.png"),
			fs.createReadStream(__dirname + "/attachment3.png")
		],
		custom: {
			value:  fs.createReadStream(__dirname + "/attachment4.png"),
			options: {
				filename: "custom.png",
				contentType: "image/custom"
			}
		}
	},
	headers: {
		"content-type": "application/other"
	}
});

request({
	uri: "http://localhost:8080/6",
	"auth": {
		"user": "user",
		"pass": "pass"
	}
});

request({
	uri: "http://localhost:8080/6.1",
	"auth": {
		"bearer": "token111"
	}
});
