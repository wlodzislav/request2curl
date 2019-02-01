function request2curl(options) {
	var curl = "curl";
	if (options.followAllRedirects) {
		curl += " -v --location";
	}
	if (options.method) {
		curl += " -X " + options.method;
	}
	if (options.qs) {
		curl += " '" + options.url + "?" + querystring.stringify(options.qs) + "'";
	} else {
		curl += " '" + options.url + "'";
	}
	if (options.form) {
		curl += " --data '" + querystring.stringify(options.form) + "'";
	}
	if (options.body) {
		curl += " --data '" + options.body + "'";
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
