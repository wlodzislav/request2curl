function request2curl(options) {
	var curl = "curl";

	if (typeof(options) == "string") {
		curl += " '" + options + "'";
		return curl;
	}

	if (options.method) {
		curl += " -X " + options.method;
	}
	
	var url = "";
	if (options.url || options.uri) {
		url = options.url || options.uri;
	}

	if (options.qs) {
		curl += " '" + url + "?" + querystring.stringify(options.qs) + "'";
	} else {
		curl += " '" + url + "'";
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
