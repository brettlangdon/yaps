var assert = require("assert");

var sinon = require("sinon");

var yaps = require("../");

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
