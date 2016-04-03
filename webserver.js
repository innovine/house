var http = require("http");
var mime = require("mime");
var fs = require("fs");
var path = require("path");
var url = require("url");

var config = require("/home/webserver/house/config.js");


var server = http.createServer(function(request, response) {

  var ua = request.headers['user-agent'];

  var uri = url.parse(request.url).pathname;
  var filename = path.join(process.cwd(), "/" + config.web_root + "/" + uri);
  console.log ("Serving " + filename);
  
  fs.exists(filename, function(exists) {
    if (!exists) {
      console.log("404 error: " + filename);
      response.writeHead(404, {"Content-Type": "test/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }
    if (fs.statSync(filename).isDirectory()) {
      filename += "/index.html";
    }

    fs.readFile(filename, "binary", function(err, file) {
      if (err) {
        console.log("500 Error : " + err);
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200, {"Content-Type" : mime.lookup(filename)});
      response.write(file, "binary");
      response.end();
    });
  });
});
server.listen(80);
console.log("Server running");
