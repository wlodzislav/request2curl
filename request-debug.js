var request = require("request");
var http = require("http");

function wrap(obj, key, fun) {
	var _fun = obj[key];
	obj[key] = function () {
		fun.apply(this, arguments);
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
					console.log("CALL: " + key);
					this[key] = _fun;
					this[key].apply(this, arguments);
				};
			})(key);
		}
	}
	*/

	var body = "";
	wrap(req, "_writeRaw", function (data) {
		body += data;
	});

	wrap(req, "_finish", function () {
		console.log("=== RAW ===");
		console.log(body);
	});


	return req;
};

var server = http.createServer(function(req, res) {
	res.end();
});
server.listen(8080);

request({
	uri: "http://localhost:8080",
	qs: { a: [1,2], b: "text" },
	headers: {
		"User-Agent": "request"
	}
});
