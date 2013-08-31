var my_plugin = function(options){
    this.settings = options || {};

    this.on("setup", this.set_time);
    this.on("setup", this.add_headers);

    this.on("not-found", this.not_found);

    this.GET("/test", this.handle_test);

    this.GET("/", this.no_respond);
    this.GET("/", this.handle_root);
};

my_plugin.prototype.set_time = function(request, server, done){
    request.current_time = new Date();
    done();
};

my_plugin.prototype.add_headers = function(request, server, done){
    var time = request.current_time;
    request.extra_headers = {
        request_time: time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds(),
    };
    done();
};

my_plugin.prototype.handle_test = function(request, server, respond){
    respond(200, "thanks for visiting /test", request.extra_headers);
};

my_plugin.prototype.handle_root = function(request, server, respond){
    respond(200, "check out /test", request.extra_headers);
};

my_plugin.prototype.no_respond = function(request, server, respond){
    request.extra_headers.no_respond = "true";
    respond();
};

my_plugin.prototype.not_found = function(request, server, respond){
    respond(404, "couldn't find handler for url: " + request.url, request.extra_headers);
};

module.exports = my_plugin;
