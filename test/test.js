var assert = require("assert");
var fs = require("fs");
var path = require("path");
var request2curl = require("../index");

it("single string url", function () {
	var options = "https://example.com";
	var expected = "curl 'https://example.com'";
	assert.equal(expected, request2curl(options));
});

it("request.defaults", function () {
		var options = {
			url: "/a"
		};
		var defaults = {
			baseUrl: "https://example.com/",
		};
		var expected = "curl 'https://example.com/a'";
		assert.equal(request2curl(options, defaults), expected);
	});

describe("Options", function () {
	it("uri", function () {
		var options = {
			uri: "https://example.com",
		};
		var expected = "curl 'https://example.com'";
		assert.equal(expected, request2curl(options));
	});

	it("url", function () {
		var options = {
			url: "https://example.com",
		};
		var expected = "curl 'https://example.com'";
		assert.equal(expected, request2curl(options));
	});

	describe("baseUrl", function () {
		it("baseUrl/ + /url", function () {
			var options = {
				baseUrl: "https://example.com/",
				url: "/a"
			};
			var expected = "curl 'https://example.com/a'";
			assert.equal(expected, request2curl(options));
		});

		it("baseUrl + /url", function () {
			var options = {
				baseUrl: "https://example.com",
				url: "/a"
			};
			var expected = "curl 'https://example.com/a'";
			assert.equal(expected, request2curl(options));
		});

		it("baseUrl/ + url", function () {
			var options = {
				baseUrl: "https://example.com/",
				url: "a"
			};
			var expected = "curl 'https://example.com/a'";
			assert.equal(expected, request2curl(options));
		});

		it("baseUrl + url", function () {
			var options = {
				baseUrl: "https://example.com",
				url: "a"
			};
			var expected = "curl 'https://example.com/a'";
			assert.equal(expected, request2curl(options));
		});
	});

	it("method", function () {
		var options = {
			url: "https://example.com",
			method: "POST"
		};
		var expected = "curl -X POST 'https://example.com'";
		assert.equal(expected, request2curl(options));
	});

	it("headers", function () {
		var options = {
			url: "https://example.com",
			headers: {
				"User-Agent": "request"
			}
		};
		var expected = "curl 'https://example.com' -H 'User-Agent:request'";
		assert.equal(expected, request2curl(options));
	});

	it("qs", function () {
		var options = {
			url: "https://example.com",
			qs: { a: [1,2], b: "text" }
		};
		var expected = "curl 'https://example.com?a%5B0%5D=1&a%5B1%5D=2&b=text'";
		assert.equal(expected, request2curl(options));
	});

	it("qsParseOptions");
	it("qsStringifyOptions");
	it("useQuerystring");

	describe("body", function () {
		it("string", function () {
			var options = {
				url: "https://example.com",
				body: "text"
			};
			var expected = "curl 'https://example.com' --data 'text'";
			assert.equal(expected, request2curl(options));
		});

		it("json serializable", function () {
			var options = {
				url: "https://example.com",
				body: { a: 1, b: 2 },
				json: true
			};
			var expected = "curl 'https://example.com' --data '{\"a\":1,\"b\":2}' -H 'accept:application/json' -H 'content-type:application/json'";
			assert.equal(expected, request2curl(options));
		});

		it("json serializable + overwrite headers", function () {
			var options = {
				url: "http://example.com",
				body: { a: 1, b: 2 },
				headers: {
					"accept": "application/json1",
					"content-type": "application/json1"
				},
				json: true
			};
			var expected = "curl 'http://example.com' --data '{\"a\":1,\"b\":2}' -H 'accept:application/json1' -H 'content-type:application/json1'";
			assert.equal(expected, request2curl(options));
		});

		it("Buffer", function () {
			var options = {
				url: "http://example.com",
				body: Buffer.from("text")
			};
			var expected = "curl 'http://example.com' --data 'text'";
			assert.equal(expected, request2curl(options));
		});

		it("escape '", function () {
			var options = {
				url: "http://example.com",
				body: { a: "'a'", b: 2 },
				json: true
			};
			var expected = `curl 'http://example.com' --data '{"a":"'"'"'a'"'"'","b":2}' -H 'accept:application/json' -H 'content-type:application/json'`;
			assert.equal(expected, request2curl(options));
		});

	});

	it("form", function () {
		var options = {
			url: "http://example.com",
			form: { a: 1, b: 2 }
		};
		var expected = "curl 'http://example.com' --data 'a=1&b=2' -H 'content-type:application/x-www-form-urlencoded'";
		assert.equal(expected, request2curl(options));
	});

	it("formData", function () {
		function fakePath(stream) {
			stream.path = "/home/example/" + path.basename(stream.path);
			return stream;
		}
		var options = {
			url: "http://example.com",
			formData: {
				field: "value",
				array: [1,2],
				file: fakePath(fs.createReadStream(__dirname + "/attachment1.png")),
				attachments: [
					fakePath(fs.createReadStream(__dirname + "/attachment2.png")),
					fakePath(fs.createReadStream(__dirname + "/attachment3.png"))
				],
				custom: {
					value:  fakePath(fs.createReadStream(__dirname + "/attachment4.png")),
					options: {
						filename: "custom.png",
						contentType: "image/custom"
					}
				}
			},
		};
		var expected = "curl 'http://example.com' -F 'field=value' -F 'array=1' -F 'array=2' -F 'file=@/home/example/attachment1.png' -F 'attachments=@/home/example/attachment2.png' -F 'attachments=@/home/example/attachment3.png' -F 'custom=@/home/example/attachment4.png;filename=custom.png;type=image/custom'";
		assert.equal(expected, request2curl(options));
	});

	it("multipart");
	it("preampleCRLF");
	it("postambleCRLF");

	it("json without body", function () {
		var options = {
			url: "http://example.com",
			json: true
		};
		var expected = "curl 'http://example.com' -H 'accept:application/json'";
		assert.equal(expected, request2curl(options));
	});

	it("auth");
	it("oauth");
	it("hawk");
	it("aws");
	it("httpSignature");
	it("followRedirect");
	it("followAllRedirects");
	it("followOriginalHTTPMethod");
	it("maxRedirects");
	it("removeRefererHeader");
	it("encoding");
	it("gzip");
	it("jar");
	it("agent");
	it("agentClass");
	it("agentOptions");
	it("forever");
	it("timeout");
	it("localAddress");
	it("proxy");
	it("strictSSL");
	it("tunnel");
	it("proxyHeaderWhiteList");
	it("proxyHeaderExclusiveList");
	it("time");
	it("har");
});
