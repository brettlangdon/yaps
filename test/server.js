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
	var http_server = sinon.stub();
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
