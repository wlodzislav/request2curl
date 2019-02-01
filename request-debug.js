var request = require("request");
var http = require("http");

function wrap(obj, key, hook) {
	var _fun = obj[key];
	obj[key] = function () {
		hook.apply(this, arguments);
		this[key] = _fun;
		this[key].apply(this, arguments);
	};
}
_request = http.request;
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

var server = http.createServer(function(req, res) {
	res.end();
});
server.listen(8080);

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
