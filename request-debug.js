var request = require("request");
request.debug = true

var http = require("http");
var server = http.createServer(function(req, res) {
});
server.listen(8080);

request("http://localhost:8080");
request({ url: "http://localhost:8080" });
request({ uri: "http://localhost:8080" });

request({
	baseUrl: "https://localhost:8080",
	url: "/a"
});

request({
	baseUrl: "https://localhost:8080",
	url: "a"
});
