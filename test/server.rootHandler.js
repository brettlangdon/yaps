var assert = require("assert");

var sinon = require("sinon");

var yaps = require("../");

suite("Server.RootHandler", function(){
    test("should call default 404 when no handlers, setup or notFounds registered", function(done){
        var response_api = {
            writeHead: function(){},
            end: function(){}
        };

        var response_writeHead = sinon.stub(response_api, "writeHead");
        var response_end = sinon.stub(response_api, "end", function(){
            assert.ok(this.writeHead.calledOnce);
            assert.ok(this.end.calledOnce);

            assert.ok(this.writeHead.calledWith(404));
            assert.ok(this.end.calledWith("Not Found"));
            done();
        });
        var server = new yaps.server();

        server.rootHandler.call(server.server, {
            url: "/test",
            method: "GET",
        }, response_api);
    });

    test("should call default 404 when no handlers respond", function(done){
        var handler = function(request, server, respond){
            respond(null);
        };
        var handler_spy = sinon.spy(handler);

        var response_api = {
            writeHead: function(){},
            end: function(){}
        };
        var response_writeHead = sinon.stub(response_api, "writeHead");
        var response_end = sinon.stub(response_api, "end", function(){
            assert.ok(handler_spy.calledOnce);

            assert.ok(this.writeHead.calledOnce);
            assert.ok(this.end.calledOnce);

            assert.ok(this.writeHead.calledWith(404));
            assert.ok(this.end.calledWith("Not Found"));
            done();
        });

        var server = new yaps.server();
        server.routes.GET = {
            "/test": [
                handler_spy,
            ]
        };

        server.rootHandler.call(server.server, {
            url: "/test",
            method: "GET",
        }, response_api);
    });

    test("should call default 404 when route has no handlers", function(done){
        var response_api = {
            writeHead: function(){},
            end: function(){}
        };

        var response_writeHead = sinon.stub(response_api, "writeHead");
        var response_end = sinon.stub(response_api, "end", function(){
            assert.ok(this.writeHead.calledOnce);
            assert.ok(this.end.calledOnce);

            assert.ok(this.writeHead.calledWith(404));
            assert.ok(this.end.calledWith("Not Found"));
            done();
        });
        var server = new yaps.server();
        server.routes.GET = {
            "/test": []
        };

        server.rootHandler.call(server.server, {
            url: "/test",
            method: "GET",
        }, response_api);
    });

    test("should properly end response when handler responds", function(done){
        var handler = function(request, server, respond){
            request.addHeader("extra", "header");
            respond(200, "here is a test");
        };
        var handler_spy = sinon.spy(handler);

        var response_api = {
            writeHead: function(){},
            end: function(){}
        };
        var response_writeHead = sinon.stub(response_api, "writeHead");
        var response_end = sinon.stub(response_api, "end", function(){
            assert.ok(handler_spy.calledOnce);

            assert.ok(this.writeHead.calledOnce);
            assert.ok(this.end.calledOnce);

            assert.ok(this.writeHead.calledWith(200, [["extra", "header"]]));
            assert.ok(this.end.calledWith("here is a test"));
            done();
        });

        var server = new yaps.server();
        server.routes.GET = {
            "/test": [
                handler_spy,
            ]
        };

        server.rootHandler.call(server.server, {
            url: "/test",
            method: "GET",
        }, response_api);
    });
});
