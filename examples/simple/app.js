var yaps = require("../../");

var my_plugin = require("./my_plugin.js");

var app = new yaps.server({
    some: "settings",
    that: "get passed into each plugin on construct",
});

app.registerPlugin(my_plugin);
// listening on default 0.0.0.0:8000
app.start();
