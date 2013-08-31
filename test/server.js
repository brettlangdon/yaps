var assert = require("assert");

var sinon = require("sinon");

var yaps = require("../");

suite("Server.Constructor", function(){
    test("should setup default attributes", function(){
        var server = new yaps.server();
        assert.deepEqual(server.settings, {});
        assert.equal(server.bind, "0.0.0.0:8000");
        assert.deepEqual(server.enabledPlugins, []);
        assert.deepEqual(server.routes, {});
        assert.deepEqual(server.notFound, []);
        assert.deepEqual(server.setup, []);
        assert.ok(server.server.yaps);
    });

    test("should take our provided settings", function(){
        var server = new yaps.server({
            test: true,
            bind: "127.0.0.1:9090",
        });

        assert.deepEqual(server.settings, {
            test: true,
            bind: "127.0.0.1:9090",
        });
        assert.equal(server.bind, "127.0.0.1:9090");
    });

    test("should take out provided http server", function(){
        var server = new yaps.server({}, {
            test: true,
        });
        var keys = [];
        for(var key in server.server){
            keys.push(key);
        }
        assert.deepEqual(keys, ["test", "yaps"]);
        assert.equal(server.server.test, true);
        assert.ok(server.server.yaps);
    });
});

suite("Server.Stop", function(){
    test("should call http_server.close on stop", function(){
        var http_server_api = {
            close: function(){}
        };
        var http_server = sinon.mock(http_server_api);
        http_server.expects("close").once();
        var server = new yaps.server({}, http_server_api);
        server.stop();
        http_server.verify();
    });
});

suite("Server.ErrorHandler", function(){
    test("should raise Error when errorHandler is called", function(){
        var server = new yaps.server();
        assert.throws(function(){
            server.errorHandler("test error message");
        }, Error);
    });
});

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

suite("Server.Start", function(){
    test("should call http_server.on and http_server.listen", function(){
        var http_server_api = {
            on: function(){},
            listen: function(){}
        };
        var http_server = sinon.mock(http_server_api);
        http_server.expects("listen").withArgs("8000", "0.0.0.0").once();
        http_server.expects("on").twice();
        var server = new yaps.server({}, http_server_api);
        server.start();
        http_server.verify();
    });

    test("should call http_server.listen with different http bind", function(){
        var http_server_api = {
            on: function(){},
            listen: function(){}
        };
        var http_server = sinon.mock(http_server_api);
        http_server.expects("listen").withArgs("9090", "127.0.0.1").once();
        http_server.expects("on").twice();
        var server = new yaps.server({
            bind: "127.0.0.1:9090",
        }, http_server_api);
        server.start();
        http_server.verify();
    });

    test("should call http_server.listen with unix socket", function(){
        var http_server_api = {
            on: function(){},
            listen: function(){}
        };
        var http_server = sinon.mock(http_server_api);
        http_server.expects("listen").withArgs("unix://tmp/my.sock").once();
        http_server.expects("on").twice();
        var server = new yaps.server({
            bind: "unix://tmp/my.sock",
        }, http_server_api);
        server.start();
        http_server.verify();
    });

    test("should raise error when bind has more than 1 :", function(){
        var http_server_api = {
            on: function(){},
            listen: function(){}
        };
        var http_server = sinon.mock(http_server_api);
        var server = new yaps.server({
            bind: "127.0.0.1:90:90",
        }, http_server_api);
        assert.throws(function(){
            server.start();
        }, Error);
    });

    test("should call http_server.listen properly with only port number", function(){
        var http_server_api = {
            on: function(){},
            listen: function(){}
        };
        var http_server = sinon.mock(http_server_api);
        http_server.expects("listen").withArgs("9090", "0.0.0.0").once();
        http_server.expects("on").twice();
        var server = new yaps.server({
            bind: "9090",
        }, http_server_api);
        server.start();
        http_server.verify();
    });

});
