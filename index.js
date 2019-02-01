var qs = require("qs");
var extend = require("extend");

function request2curl(options, defaults) {
	var curl = "curl";

	if (typeof(options) == "string") {
		options = { uri: options };
	}

	if (!options.headers) {
		options.headers = {};
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

	if (options.form) {
		if (!options.headers["content-type"]) {
		  options.headers["content-type"] = "application/x-www-form-urlencoded";
		}
		var data = (typeof(options.form) == "string") ? options.form : qs.stringify(options.form);
		curl += " --data '" + data + "'";
	}

	if (options.body) {
		curl += " --data '" + options.body + "'";
	}

	if (options.followAllRedirects) {
		curl += " -v --location";
	}

	if (options.auth) {
		curl += " --user " + options.auth.user + ":" + options.auth.pass;
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
