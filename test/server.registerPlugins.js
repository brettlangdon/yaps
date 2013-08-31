var assert = require("assert");

var yaps = require("../");

suite("Server.RegisterPlugin", function(){
    test("should push an instance of the plugin to server.enabledPlugins", function(){
	var plugin = function(options){
            this.test = true;
            this.settings = options;
	};
        var server = new yaps.server({
            some: "setting",
	});
	server.registerPlugin(plugin);
        assert.equal(server.enabledPlugins.length, 1);
        assert.equal(server.enabledPlugins[0].test, true);
        assert.deepEqual(server.enabledPlugins[0].settings, {
            some: "setting",
        });
    });

    test("should transfer routes from plugin to server", function(){
	var plugin = function(options){
            this.routes = {
                GET: {
                    "/test": [
                        "handler_1",
                        "handler_2",
                    ]
                },
                TEST: {
                    "/test": [
                        "handler_3",
                        "handler_4",
                    ]
                }
            };
	};
        var server = new yaps.server();
	server.registerPlugin(plugin);

        assert.ok(server.routes.GET);
        assert.ok(server.routes.TEST);
        assert.deepEqual(server.routes.GET["/test"], ["handler_1", "handler_2"]);
        assert.deepEqual(server.routes.TEST["/test"], ["handler_3", "handler_4"]);
    });

    test("should transfer routes from multiple plugins without overwriting any", function(){
	var plugin_1 = function(options){
            this.routes = {
                GET: {
                    "/test": [
                        "handler_1",
                        "handler_2",
                    ]
                },
            };
	};
	var plugin_2 = function(options){
            this.routes = {
                GET: {
                    "/test": [
                        "handler_3",
                        "handler_4",
                    ]
                },
            };
	};

        var server = new yaps.server();
	server.registerPlugin(plugin_1);
        server.registerPlugin(plugin_2);

        assert.ok(server.routes.GET);
        assert.deepEqual(server.routes.GET["/test"], ["handler_1", "handler_2", "handler_3", "handler_4"]);
    });

    test("should append plugins notFound to server", function(){
	var plugin = function(options){
            this.notFound = "handler";
	};
        var server = new yaps.server();
	server.registerPlugin(plugin);
        assert.deepEqual(server.notFound, ["handler"]);
    });

    test("should append notFound from multiple plugins", function(){
	var plugin_1 = function(options){
            this.notFound = "handler_1";
	};

	var plugin_2 = function(options){
            this.notFound = "handler_2";
	};
        var server = new yaps.server();
	server.registerPlugin(plugin_1);
	server.registerPlugin(plugin_2);
        assert.deepEqual(server.notFound, ["handler_1", "handler_2"]);
    });

    test("should append plugins setup to server", function(){
	var plugin = function(options){
            this.setup = ["handler_1", "handler_2"];
	};
        var server = new yaps.server();
	server.registerPlugin(plugin);
        assert.deepEqual(server.setup, ["handler_1", "handler_2"]);
    });

    test("should append setup from multiple plugins", function(){
	var plugin_1 = function(options){
            this.setup = ["handler_1", "handler_2"];
	};
	var plugin_2 = function(options){
            this.setup = ["handler_3", "handler_4"];
	};
        var server = new yaps.server();
	server.registerPlugin(plugin_1);
	server.registerPlugin(plugin_2);
        assert.deepEqual(server.setup, ["handler_1", "handler_2", "handler_3", "handler_4"]);
    });
});
