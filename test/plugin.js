var assert = require("assert");

var yaps = require("../");

suite("Plugin.addRoute", function(){
});

suite("Plugin.GET", function(){
    test("should add a route for GET method", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, respond){};

	plugin.GET("/test", handler);

	assert.ok(plugin.routes);
	assert.ok(plugin.routes["GET"]);
	assert.ok(plugin.routes["GET"]["/test"]);
	assert.deepEqual(plugin.routes["GET"]["/test"], [handler]);
    });
});

suite("Plugin.POST", function(){
    test("should add a route for POST method", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, respond){};

	plugin.POST("/test", handler);

	assert.ok(plugin.routes);
	assert.ok(plugin.routes["POST"]);
	assert.ok(plugin.routes["POST"]["/test"]);
	assert.deepEqual(plugin.routes["POST"]["/test"], [handler]);
    });
});

suite("Plugin.PUT", function(){
    test("should add a route for PUT method", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, respond){};

	plugin.PUT("/test", handler);

	assert.ok(plugin.routes);
	assert.ok(plugin.routes["PUT"]);
	assert.ok(plugin.routes["PUT"]["/test"]);
	assert.deepEqual(plugin.routes["PUT"]["/test"], [handler]);
    });
});

suite("Plugin.HEAD", function(){
    test("should add a route for HEAD method", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, respond){};

	plugin.HEAD("/test", handler);

	assert.ok(plugin.routes);
	assert.ok(plugin.routes["HEAD"]);
	assert.ok(plugin.routes["HEAD"]["/test"]);
	assert.deepEqual(plugin.routes["HEAD"]["/test"], [handler]);
    });
});

suite("Plugin.DELETE", function(){
    test("should add a route for DELETE method", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, respond){};

	plugin.DELETE("/test", handler);

	assert.ok(plugin.routes);
	assert.ok(plugin.routes["DELETE"]);
	assert.ok(plugin.routes["DELETE"]["/test"]);
	assert.deepEqual(plugin.routes["DELETE"]["/test"], [handler]);
    });
});

suite("Plugin.PATCH", function(){
    test("should add a route for PATCH method", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, respond){};

	plugin.PATCH("/test", handler);

	assert.ok(plugin.routes);
	assert.ok(plugin.routes["PATCH"]);
	assert.ok(plugin.routes["PATCH"]["/test"]);
	assert.deepEqual(plugin.routes["PATCH"]["/test"], [handler]);
    });
});

suite("Plugin.on", function(){
    test("on setup should add setup handler", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, done){};
	plugin.on("setup", handler);

	assert.ok(plugin.setup);
	assert.equal(plugin.setup.length, 1);
	assert.equal(plugin.setup[0], handler);
    });

    test("on not-found should set not-found handler", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, done){};
	plugin.on("not-found", handler);

	assert.ok(plugin.notFound);
	assert.equal(plugin.notFound, handler);
    });

    test("calling on not-found twice should overwrite not-found handler", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, done){};
	plugin.on("not-found", false);
	plugin.on("not-found", handler);

	assert.ok(plugin.notFound);
	assert.equal(plugin.notFound, handler);
    });

    test("on 404 should set not-found handler", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, done){};
	plugin.on("404", handler);

	assert.ok(plugin.notFound);
	assert.equal(plugin.notFound, handler);
    });

    test("on with unknown event should raise Error", function(){
	var plugin = new yaps.plugin();
	assert.throws(function(){
	    plugin.on("uknown-event", false);
	}, Error);
    });

});
