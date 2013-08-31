Yet Another Plugin Server
=========================

[![Build Status](https://travis-ci.org/brettlangdon/yaps.png?branch=master)](https://travis-ci.org/brettlangdon/yaps)
[![Coverage Status](https://coveralls.io/repos/brettlangdon/yaps/badge.png?branch=master)](https://coveralls.io/r/brettlangdon/yaps?branch=master)
[![NPM version](https://badge.fury.io/js/yaps.png)](http://badge.fury.io/js/yaps)

YAPS is plugin based HTTP server that gets out of your way and lets you do what you need to do.

## Installation
### Via NPM
```bash
npm install [-g] yaps
```

### Via Git
```bash
git clone git://github.com/brettlangdon/yaps.git
cd ./yaps
npm install
```

## Usage
```javascript
var yaps = require("yaps");
var user_auth = require("user_auth");
var user_routes = require("user_routes");
var admin_routes = require("admin_routes");

// create instance of yaps application
var server = new yaps({
    bind: "0.0.0.0:8000",
});

// register each plugin
server.registerPlugin(user_auth);
server.registerPlugin(user_routes);
server.registerPlugin(admin_routes);

// start the server listening at http://0.0.0.0:8000
server.start();
```

## Writing Plugins
Plugins are meant to be a small contained representation of a portion of your application.
This way you can easily package and move portions of your application around.

### Example
```javascript
var yaps = require("yaps");

var plugin = function(){
    this.addRoute("GET", "/test", this.handle_test);
    // OR
    this.GET("/test", this.handle_test);

    // this handler gets called for every new request regardless of route
    this.on("setup", this.request_setup);

    // for when there isn't a handler that responds to the request, call this
    this.on("not-found", this.not_found);
};

// `request` is the current request
// `server` is the current yaps instance
// `respond` is a function which must be called by each handler
plugin.prototype.handle_test = function(request, server, respond){
    if(server.some.setting >= 200){
	    // this passes execution to the next handler for this route
        respond(null);
    } else{
	    // this interrupts the handler chain and returns to the user
        respond.addHeader("extra_header", "used /test");
        respond(200, "Thanks for visiting /test");
    }
};

plugin.prototype.request_setup = function(request, server, done){
    // do some setup stuff here, like setup sessions or do auth
	done();
};

var server = new yaps({
    bind: "0.0.0.0:8000",
});
server.registerPlugin(plugin);
server.start();
```

## License
```
The MIT License (MIT)

Copyright (c) 2013 Brett Langdon <brett@blangdon.com> (http://www.brett.is)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
