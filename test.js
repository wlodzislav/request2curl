var assert = require("assert");
var request2curl = require("./index");

it("single string url", function () {
	var options = "https://example.com";
	var expected = "curl 'https://example.com'";
	assert.equal(request2curl(options), expected);
});

it("request.defaults");

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

	it("baseUrl");
	it("method");
	it("headers");
	it("qs");
	it("qsParseOptions");
	it("qsStringifyOptions");
	it("useQuerystring");
	it("body");
	it("form");
	it("formData");
	it("multipart");
	it("preampleCRLF");
	it("postambleCRLF");
	it("json");
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
