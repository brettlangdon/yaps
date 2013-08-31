var http = require("http");
var util = require("util");

var yaps_plugin = require("./plugin.js");

var handler_chain = function(handlers, request, server, response, not_found){
    if(handlers.length){
        handlers[0](request, server, function(status, body, headers){
            if(status === null || status === undefined){
                handler_chain(handlers.slice(1), request, server, response, not_found);
            } else{
                response.writeHead(status, headers);
                response.end(body);
            }
        });
    } else{
        not_found();
    }
};

var server = function(settings, http_server){
    this.settings = settings || {};
    this.bind = this.settings.bind || "0.0.0.0:8000";
    this.enabledPlugins = [];
    this.routes = {};
    this.notFound = [];
    this.setup = [];

    // they gave us an http server, lets use that
    if(http_server !== null && http_server !== undefined){
        this.server = http_server;
    } else{
        this.server = new http.Server();
    }
    this.server.yaps = this;
};

server.prototype.rootHandler = function(request, response){
    var self = this.yaps;
    var handlers = [];
    var method = request.method.toUpperCase();
    for(var route in self.routes[method]){
        if(!self.routes[method][route].length){
            continue;
        }
        var pattern = new RegExp(route);
        if(pattern.test(request.url)){
            handlers = handlers.concat(self.routes[method][route]);
        }
    }

    handlers = self.setup.concat(handlers);

    if(handlers.length){
        handler_chain(handlers, request, self, response, function(){
            handler_chain(self.notFound, request, self, response, function(){
                response.writeHead(404);
                response.end("Not Found");
            });
        });
    } else{
        handler_chain(self.notFound, request, self, response, function(){
            response.writeHead(404);
            response.end("Not Found");
        });
    }
};

server.prototype.errorHandler = function(error){
    throw Error("YAPS, HTTP Server Error:" + error);
};

server.prototype.registerPlugin = function(plugin_constructor){
    var new_plugin = function(options){
        yaps_plugin.call(this, options);
        plugin_constructor.call(this, options);
    };
    // dont judge me!
    util._extend(new_plugin.prototype, yaps_plugin.prototype);
    util._extend(new_plugin.prototype, plugin_constructor.prototype);
    var plugin = new new_plugin(this.settings);
    this.enabledPlugins.push(plugin);
    for(var method in plugin.routes){
        this.routes[method] = this.routes[method] || {};
        for(var route in plugin.routes[method]){
            this.routes[method][route] = this.routes[method][route] || [];
            this.routes[method][route] = this.routes[method][route].concat(plugin.routes[method][route]);
        }
    }
    if(plugin.notFound){
        this.notFound.push(plugin.notFound);
    }
    if(plugin.setup && plugin.setup.length){
        this.setup = this.setup.concat(plugin.setup);
    }
};

server.prototype.start = function(){
    this.server.on("error", this.errorHandler);
    this.server.on("request", this.rootHandler);

    var bind_parts = [undefined, undefined];
    if(this.bind.indexOf("unix://") === 0){
        bind_parts[1] = this.bind;
    } else{
        if(!~this.bind.indexOf(":")){
            bind_parts = ["0.0.0.0", this.bind];
        } else{
            bind_parts = this.bind.split(":");
            if(bind_parts.length > 2){
                throw new Error("YAPS, Malformed bind parameter:", this.bind);
            }
        }
    }

    this.server.listen(bind_parts[1], bind_parts[0]);
};

server.prototype.stop = function(){
    this.server.close();
};

module.exports = server;
