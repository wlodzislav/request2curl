var fs = require("fs");
var path = require("path");
var qs = require("qs");
var extend = require("extend");
var jsonSafeStringify = require("json-stringify-safe");

// escape ' for shell
function escapeQuote(s) {
	return s.replace(/'/g, "'\"'\"'");
}

function formDataField(key, value) {
	if (value instanceof fs.ReadStream) {
		return " -F '" + key + "=@" + escapeQuote(value.path) + "'";
	} else if (value.options) {
		var c =  " -F '" + key + "=@" + escapeQuote(value.value.path);
		if (value.options.filename) {
			c += ";filename=" + escapeQuote(value.options.filename);
		}
		if (value.options.contentType) {
			c += ";type=" + escapeQuote(value.options.contentType);
		}
		c += "'";
		return c;
	} else {
		return " -F '" + key + "=" + value + "'";
	}
}

function request2curl(options, defaults) {
	var curl = "curl";

	if (typeof(options) == "string") {
		options = { uri: options };
	}

	if (!options.headers) {
		options.headers = {};
	}

	if (!("followRedirect" in options)) {
		options.followRedirect = true;
	}

	if (defaults) {
    	extend(true, options, defaults);
	}

	if (options.method) {
		curl += " -X " + options.method;
	}

	if (options.url) {
		options.uri = options.url;
	}
	var uri = "";
	if (options.baseUrl) {
		uri = options.baseUrl.replace(/\/$/, "") + "/" + options.uri.replace(/^\//, "");
	} else {
		uri = options.uri;
	}

	if (options.qs) {
		curl += " '" + uri + "?" + qs.stringify(options.qs) + "'";
	} else {
		curl += " '" + uri + "'";
	}

	var data = "";
	if (options.body) {
		if (typeof(options.body) == "string") {
			data = options.body;
		} else if (options.body instanceof Buffer) {
			data = options.body.toString();
		} else {
			data = jsonSafeStringify(options.body);
		}
		curl += " --data '" + escapeQuote(data) + "'";
	}

	if (options.json && !options.headers["accept"]) {
		options.headers["accept"] = "application/json";
	}

	if (options.json && options.body && !options.headers["content-type"]) {
		options.headers["content-type"] = "application/json";
	}

	if (options.form) {
		// always overwrite header
		options.headers["content-type"] = "application/x-www-form-urlencoded";
		var data = (typeof(options.form) == "string") ? options.form : qs.stringify(options.form);
		curl += " --data '" + data + "'";
	}

	if (options.formData) {
		for (var key in options.formData) {
			var value = options.formData[key];
			if (Array.isArray(value)) {
				value.forEach(function (v) {
					curl += formDataField(key, v);
				});
			} else {
				curl += formDataField(key, value);
			}
		}
	}

	var getMethod = !("method" in options) || options.method.toUpperCase() == "GET";
	if (options.followAllRedirects || (options.followRedirect && getMethod)) {
		curl += " --location";
		if ("maxRedirects" in options) {
			curl += " --max-redirs " + options.maxRedirects;
		} else {
			curl += " --max-redirs 10";
		}
	}

	if (options.auth && options.auth.user) {
		curl += " --user " + options.auth.user + ":" + options.auth.pass;
	}

	if (options.auth && options.auth.bearer) {
		curl += " -H 'authorization: Bearer " + options.auth.bearer + "'";
	}

	if (options.gzip) {
		curl += " -H 'accept-encoding: gzip, deflate'";
	}

	if (("forever" in options) && !options.forever) {
		curl += " --no-keepalive";
	}

	if (options.timeout) {
		curl += " --max-time " + (options.timeout / 1000);
	}

	if (options.proxy) {
		curl += " --proxy " + options.proxy;
	}

	if (Object.keys(options.headers).length) {
		for (var headerName in options.headers) {
			var headersValue = options.headers[headerName];
			curl += " -H '" + headerName + ":" + headersValue + "'";
		}
	}

	return curl;
}

module.exports = request2curl;
