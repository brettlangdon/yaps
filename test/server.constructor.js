var assert = require("assert");

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
