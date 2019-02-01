var assert = require("assert");
var request2curl = require("./index");

it("single string url", function () {
	var options = "https://example.com";
	var expected = "curl 'https://example.com'";
	assert.equal(request2curl(options), expected);
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
		assert.equal(request2curl(options), expected);
	});

	it("url", function () {
		var options = {
			url: "https://example.com",
		};
		var expected = "curl 'https://example.com'";
		assert.equal(request2curl(options), expected);
	});

	describe("baseUrl", function () {
		it("baseUrl/ + /url", function () {
			var options = {
				baseUrl: "https://example.com/",
				url: "/a"
			};
			var expected = "curl 'https://example.com/a'";
			assert.equal(request2curl(options), expected);
		});

		it("baseUrl + /url", function () {
			var options = {
				baseUrl: "https://example.com",
				url: "/a"
			};
			var expected = "curl 'https://example.com/a'";
			assert.equal(request2curl(options), expected);
		});

		it("baseUrl/ + url", function () {
			var options = {
				baseUrl: "https://example.com/",
				url: "a"
			};
			var expected = "curl 'https://example.com/a'";
			assert.equal(request2curl(options), expected);
		});

		it("baseUrl + url", function () {
			var options = {
				baseUrl: "https://example.com",
				url: "a"
			};
			var expected = "curl 'https://example.com/a'";
			assert.equal(request2curl(options), expected);
		});
	});

	it("method", function () {
		var options = {
			url: "https://example.com",
			method: "POST"
		};
		var expected = "curl -X POST 'https://example.com'";
		assert.equal(request2curl(options), expected);
	});

	it("headers", function () {
		var options = {
			url: "https://example.com",
			headers: {
				"User-Agent": "request"
			}
		};
		var expected = "curl 'https://example.com' -H 'User-Agent:request'";
		assert.equal(request2curl(options), expected);
	});

	it("qs", function () {
		var options = {
			url: "https://example.com",
			qs: { a: [1,2], b: "text" }
		};
		var expected = "curl 'https://example.com?a%5B0%5D=1&a%5B1%5D=2&b=text'";
		assert.equal(request2curl(options), expected);
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
			assert.equal(request2curl(options), expected);
		});

		it("json serializable", function () {
			var options = {
				url: "https://example.com",
				body: { a: 1, b: 2 },
				json: true
			};
			var expected = "curl 'https://example.com' --data '{\"a\":1,\"b\":2}' -H 'accept:application/json' -H 'content-type:application/json'";
			assert.equal(request2curl(options), expected);
		});

		it("json serializable + overwrite headers", function () {
			var options = {
				url: "https://example.com",
				body: { a: 1, b: 2 },
				headers: {
					"accept": "application/json1",
					"content-type": "application/json1"
				},
				json: true
			};
			var expected = "curl 'https://example.com' --data '{\"a\":1,\"b\":2}' -H 'accept:application/json1' -H 'content-type:application/json1'";
			assert.equal(request2curl(options), expected);
		});

		it("Buffer", function () {
			var options = {
				url: "https://example.com",
				body: Buffer.from("text")
			};
			var expected = "curl 'https://example.com' --data 'text'";
			assert.equal(request2curl(options), expected);
		});

		it("escape '", function () {
			var options = {
				url: "https://example.com",
				body: { a: "'a'", b: 2 },
				json: true
			};
			var expected = `curl 'https://example.com' --data '{"a":"'"'"'a'"'"'","b":2}' -H 'accept:application/json' -H 'content-type:application/json'`;
			assert.equal(request2curl(options), expected);
		});

	});

	it("form");
	it("formData");
	it("multipart");
	it("preampleCRLF");
	it("postambleCRLF");

	it("json without body", function () {
		var options = {
			url: "https://example.com",
			json: true
		};
		var expected = "curl 'https://example.com' -H 'accept:application/json'";
		assert.equal(request2curl(options), expected);
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
