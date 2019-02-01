# Request2curl - Convert request(...) options to curl without executing the request

Function to convert [request](https://github.com/request/request) options into curl command. Module supports most of the common request options.

```javascript
var request2curl = require("request2curl");

var options = {
	url: "https://example.com",
	qs: { a: [1,2], b: "text" }
};

var curlCmd = request2curl(options);
// curl 'https://example.com?a%5B0%5D=1&a%5B1%5D=2&b=text' --location --max-redirs 10

request(options, function() { ... })
```

Install:

	npm install request2curl

## request.defaults

To use `request.defaults` pass them manually into `request2curl`.

```javascript
var options = { ...  };
var curlCmd = request2curl(options, request.defaults);
```

## Supported options

- [x] uri||url
- [x] baseUrl
- [x] method
- [x] headers
- [x] qs
- [ ] qsParseOptions
- [ ] qsStringifyOptions
- [ ] useQuerystring
- [x] body
- [x] form
- [x] formData
- [ ] multipart
- [ ] preampleCRLF
- [ ] postambleCRLF
- [x] json
- [x] auth
- [ ] oauth
- [ ] hawk
- [ ] aws
- [ ] httpSignature
- [x] followRedirect
- [x] followAllRedirects
- [ ] followOriginalHTTPMethod
- [x] maxRedirects
- [ ] removeRefererHeader - no analog in curl
- [x] gzip
- [ ] agentOptions
- [x] forever
- [x] timeout
- [x] localAddress
- [x] proxy
- [ ] strictSSL
- [ ] tunnel
- [ ] proxyHeaderWhiteList
- [ ] proxyHeaderExclusiveList
- [ ] har

