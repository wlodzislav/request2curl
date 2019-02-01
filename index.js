var qs = require("qs");

function request2curl(options, defaults) {
	var curl = "curl";

	if (typeof(options) == "string") {
		options = { uri: options };
	}

	if (defaults) {
		Object.assign(options, defaults);
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
		curl += " --data '" + querystring.stringify(options.form) + "'";
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
	if (options.headers) {
		for (var headerName in options.headers) {
			var headersValue = options.headers[headerName];
			curl += " -H '" + headerName + ":" + headersValue + "'";
		}
	}
	return curl;
}

module.exports = request2curl;
