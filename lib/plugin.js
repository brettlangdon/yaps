var plugin = function(){};

plugin.prototype.on = function(event, handler){
    if(event == "not-found" || event == "404"){
	this.not_found = handler;
    } else if(event == "setup"){
	this.setup = this.setup || [];
	this.setup.push(handler);
    } else{
	throw new Error("YAPS, cannot add handler for unknown event: " + event);
    }
};

plugin.prototype.addRoute = function(method, route, handler){
    this.routes = this.routes || {};
    method = method.toUpperCase();
    this.routes[method] = this.routes[method] || {};
    this.routes[method][route] = this.routes[method][route] || [];
    this.routes[method][route].push(handler);
};

plugin.prototype.GET = function(route, handler){
    this.addRoute("GET", route, handler);
};

plugin.prototype.POST = function(route, handler){
    this.addRoute("POST", route, handler);
};

plugin.prototype.PUT = function(route, handler){
    this.addRoute("PUT", route, handler);
};

plugin.prototype.HEAD = function(route, handler){
    this.addRoute("HEAD", route, handler);
};

plugin.prototype.DELETE = function(route, handler){
    this.addRoute("DELETE", route, handler);
};

plugin.prototype.PATCH = function(route, handler){
    this.addRoute("PATCH", route, handler);
};


module.exports = plugin;
