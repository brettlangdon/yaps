var assert = require("assert");

var yaps = require("../");

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
	var handler = function(request, server, respond){};
	plugin.on("not-found", handler);

	assert.ok(plugin.notFound);
	assert.equal(plugin.notFound, handler);
    });

    test("calling on not-found twice should overwrite not-found handler", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, respond){};
	plugin.on("not-found", false);
	plugin.on("not-found", handler);

	assert.ok(plugin.notFound);
	assert.equal(plugin.notFound, handler);
    });

    test("on 404 should set not-found handler", function(){
	var plugin = new yaps.plugin();
	var handler = function(request, server, respond){};
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
