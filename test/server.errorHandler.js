var assert = require("assert");

var yaps = require("../");

suite("Server.ErrorHandler", function(){
    test("should raise Error when errorHandler is called", function(){
        var server = new yaps.server();
        assert.throws(function(){
            server.errorHandler("test error message");
        }, Error);
    });
});
