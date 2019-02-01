var assert = require("assert");
var fs = require("fs");
var path = require("path");
var request2curl = require("../index");

it("single string url", function () {
	var options = "https://example.com";
	var expected = "curl 'https://example.com' --location --max-redirs 10";
	assert.equal(request2curl(options), expected);
});

it("request.defaults", function () {
	var options = {
		url: "/a"
	};
	var defaults = {
		baseUrl: "https://example.com/",
	};
	var expected = "curl 'https://example.com/a' --location --max-redirs 10";
	assert.equal(request2curl(options, defaults), expected);
});

describe("Options", function () {
	it("uri", function () {
		var options = {
			uri: "https://example.com",
		};
		var expected = "curl 'https://example.com' --location --max-redirs 10";
		assert.equal(request2curl(options), expected);
	});

	it("url", function () {
		var options = {
			url: "https://example.com",
		};
		var expected = "curl 'https://example.com' --location --max-redirs 10";
		assert.equal(request2curl(options), expected);
	});

	describe("baseUrl", function () {
		it("baseUrl/ + /url", function () {
			var options = {
				baseUrl: "https://example.com/",
				url: "/a"
			};
			var expected = "curl 'https://example.com/a' --location --max-redirs 10";
			assert.equal(request2curl(options), expected);
		});

		it("baseUrl + /url", function () {
			var options = {
				baseUrl: "https://example.com",
				url: "/a"
			};
			var expected = "curl 'https://example.com/a' --location --max-redirs 10";
			assert.equal(request2curl(options), expected);
		});

		it("baseUrl/ + url", function () {
			var options = {
				baseUrl: "https://example.com/",
				url: "a"
			};
			var expected = "curl 'https://example.com/a' --location --max-redirs 10";
			assert.equal(request2curl(options), expected);
		});

		it("baseUrl + url", function () {
			var options = {
				baseUrl: "https://example.com",
				url: "a"
			};
			var expected = "curl 'https://example.com/a' --location --max-redirs 10";
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
		var expected = "curl 'https://example.com' --location --max-redirs 10 -H 'User-Agent:request'";
		assert.equal(request2curl(options), expected);
	});

	it("qs", function () {
		var options = {
			url: "https://example.com",
			qs: { a: [1,2], b: "text" }
		};
		var expected = "curl 'https://example.com?a%5B0%5D=1&a%5B1%5D=2&b=text' --location --max-redirs 10";
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
			var expected = "curl 'https://example.com' --data 'text' --location --max-redirs 10";
			assert.equal(request2curl(options), expected);
		});

		it("json serializable", function () {
			var options = {
				url: "https://example.com",
				body: { a: 1, b: 2 },
				json: true
			};
			var expected = "curl 'https://example.com' --data '{\"a\":1,\"b\":2}' --location --max-redirs 10 -H 'accept:application/json' -H 'content-type:application/json'";
			assert.equal(request2curl(options), expected);
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
			var expected = "curl 'http://example.com' --data '{\"a\":1,\"b\":2}' --location --max-redirs 10 -H 'accept:application/json1' -H 'content-type:application/json1'";
			assert.equal(request2curl(options), expected);
		});

		it("Buffer", function () {
			var options = {
				url: "http://example.com",
				body: Buffer.from("text")
			};
			var expected = "curl 'http://example.com' --data 'text' --location --max-redirs 10";
			assert.equal(request2curl(options), expected);
		});

		it("escape '", function () {
			var options = {
				url: "http://example.com",
				body: { a: "'a'", b: 2 },
				json: true
			};
			var expected = `curl 'http://example.com' --data '{"a":"'"'"'a'"'"'","b":2}' --location --max-redirs 10 -H 'accept:application/json' -H 'content-type:application/json'`;
			assert.equal(request2curl(options), expected);
		});

	});

	it("form", function () {
		var options = {
			url: "http://example.com",
			form: { a: 1, b: 2 }
		};
		var expected = "curl 'http://example.com' --data 'a=1&b=2' --location --max-redirs 10 -H 'content-type:application/x-www-form-urlencoded'";
		assert.equal(request2curl(options), expected);
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
		var expected = "curl 'http://example.com' -F 'field=value' -F 'array=1' -F 'array=2' -F 'file=@/home/example/attachment1.png' -F 'attachments=@/home/example/attachment2.png' -F 'attachments=@/home/example/attachment3.png' -F 'custom=@/home/example/attachment4.png;filename=custom.png;type=image/custom' --location --max-redirs 10";
		assert.equal(request2curl(options), expected);
	});

	it("multipart");
	it("preampleCRLF");
	it("postambleCRLF");

	it("json without body", function () {
		var options = {
			url: "http://example.com",
			json: true
		};
		var expected = "curl 'http://example.com' --location --max-redirs 10 -H 'accept:application/json'";
		assert.equal(request2curl(options), expected);
	});

	describe("auth", function () {
		it("http basic", function () {
			var options = {
				url: "http://example.com",
				"auth": {
					"user": "user",
					"pass": "pass"
				}
			};
			var expected = "curl 'http://example.com' --location --max-redirs 10 --user user:pass";
			assert.equal(request2curl(options), expected);
		});

		it("bearer", function () {
			var options = {
				url: "http://example.com",
				"auth": {
					"bearer": "token"
				}
			};
			var expected = "curl 'http://example.com' --location --max-redirs 10 -H 'authorization: Bearer token'";
			assert.equal(request2curl(options), expected);
		});
	});

	it("oauth");
	it("hawk");
	it("aws");
	it("httpSignature");

	it("followRedirect", function () {
		var options = {
			url: "http://example.com",
			followRedirect: false
		};
		var expected = "curl 'http://example.com'";
		assert.equal(request2curl(options), expected);
	});

	it("followAllRedirects", function () {
		var options = {
			url: "http://example.com"
		};
		var expected = "curl 'http://example.com' --location --max-redirs 10";
		assert.equal(request2curl(options), expected);
	});

	it("maxRedirects", function () {
		var options = {
			url: "http://example.com",
			maxRedirects: 20
		};
		var expected = "curl 'http://example.com' --location --max-redirs 20";
		assert.equal(request2curl(options), expected);
	});

	it("removeRefererHeader");
	it("encoding");

	it("gzip", function () {
		var options = {
			url: "http://example.com",
			gzip: true
		};
		var expected = "curl 'http://example.com' --location --max-redirs 10 -H 'accept-encoding: gzip, deflate'";
		assert.equal(request2curl(options), expected);
	});

	it("jar");
	it("agent");
	it("agentClass");
	it("agentOptions");

	it("forever", function () {
		var options = {
			url: "http://example.com",
			forever: false
		};
		var expected = "curl 'http://example.com' --location --max-redirs 10 --no-keepalive";
		assert.equal(request2curl(options), expected);
	});

	it("timeout", function () {
		var options = {
			url: "http://example.com",
			timeout: 2567
		};
		var expected = "curl 'http://example.com' --location --max-redirs 10 --max-time 2.567";
		assert.equal(request2curl(options), expected);
	});

	it("localAddress", function () {
		var options = {
			url: "http://example.com",
			localAddress: "200.1.1.1"
		};
		var expected = "curl 'http://example.com' --location --max-redirs 10 --interface 200.1.1.1";
		assert.equal(request2curl(options), expected);
	});
	it("proxy");
	it("strictSSL");
	it("tunnel");
	it("proxyHeaderWhiteList");
	it("proxyHeaderExclusiveList");
	it("time");
	it("har");
});
