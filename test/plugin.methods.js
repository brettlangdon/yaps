var assert = require("assert");

var yaps = require("../");

suite("Plugin.GET", function(){
    test("should add a route for GET method", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, respond){};

	plugin.GET("/test", handler);

	assert.ok(plugin.routes);
	assert.ok(plugin.routes.GET);
	assert.ok(plugin.routes.GET["/test"]);
	assert.deepEqual(plugin.routes.GET["/test"], [handler]);
    });
});

suite("Plugin.POST", function(){
    test("should add a route for POST method", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, respond){};

	plugin.POST("/test", handler);

	assert.ok(plugin.routes);
	assert.ok(plugin.routes.POST);
	assert.ok(plugin.routes.POST["/test"]);
	assert.deepEqual(plugin.routes.POST["/test"], [handler]);
    });
});

suite("Plugin.PUT", function(){
    test("should add a route for PUT method", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, respond){};

	plugin.PUT("/test", handler);

	assert.ok(plugin.routes);
	assert.ok(plugin.routes.PUT);
	assert.ok(plugin.routes.PUT["/test"]);
	assert.deepEqual(plugin.routes.PUT["/test"], [handler]);
    });
});

suite("Plugin.HEAD", function(){
    test("should add a route for HEAD method", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, respond){};

	plugin.HEAD("/test", handler);

	assert.ok(plugin.routes);
	assert.ok(plugin.routes.HEAD);
	assert.ok(plugin.routes.HEAD["/test"]);
	assert.deepEqual(plugin.routes.HEAD["/test"], [handler]);
    });
});

suite("Plugin.DELETE", function(){
    test("should add a route for DELETE method", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, respond){};

	plugin.DELETE("/test", handler);

	assert.ok(plugin.routes);
	assert.ok(plugin.routes.DELETE);
	assert.ok(plugin.routes.DELETE["/test"]);
	assert.deepEqual(plugin.routes.DELETE["/test"], [handler]);
    });
});

suite("Plugin.PATCH", function(){
    test("should add a route for PATCH method", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, respond){};

	plugin.PATCH("/test", handler);

	assert.ok(plugin.routes);
	assert.ok(plugin.routes.PATCH);
	assert.ok(plugin.routes.PATCH["/test"]);
	assert.deepEqual(plugin.routes.PATCH["/test"], [handler]);
    });
});
