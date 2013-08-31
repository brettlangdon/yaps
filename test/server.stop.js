var assert = require("assert");

var sinon = require("sinon");

var yaps = require("../");

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
