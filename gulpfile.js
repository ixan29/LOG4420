"use strict";

const connect = require("gulp-connect");

var products = [
    {
        name: "Apple TV",
        price: 299.99
    },
    {
        name: "gaming PC",
        price: 1199.99
    }
];

function getUrlPath(url)
{
    if(url.indexOf('?'))
        return url;

    return url.slice(0, url.indexOf('?'));
}

function getUrlQueryParams(url)
{
    var vars = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        var hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars;
}

var queries = {
    "/getProducts":
    function(req)
    {
        return JSON.stringify(products);
    } 
};

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
                    
                    console.log(res.read);

                    const response = queries[getUrlPath(req.url)](req);
                    
                    if(response !== undefined)
                    {
                        res.write(response);
                        res.end();
                    }

                    /*
                    console.log(getUrlPath(req.url));
                    //req.method = "GET";
                    res.write(JSON.stringify(getUrlQueryParams(req.url)));
                    res.end();
                    return next();
                    */
                }
            ];
        }
    });
}


module.exports = {
    "web-server": webServer,
    default: webServer
};
