"use strict";

const connect = require("gulp-connect");

/**
 * Web Server Task
 * --------------
 * Starts a web server to host the files.
 */
function webServer() {
    connect.server({
        port: 8000,
        middleware: function() {
            return [
                function(req, res, next) {
                    req.method = "GET";
                    return next();
                }
            ];
        }
    });
}


module.exports = {
    "web-server": webServer,
    default: webServer
};
