var http = require("http");
var mime = require("mime");
var fs = require("fs");
var path = require("path");
var url = require("url");
var config = require("/home/webserver/house/config.js");
var engine = require("engine.io");

var server = http.createServer(function(request, response) {
  var ua = request.headers['user-agent'];
  var uri = url.parse(request.url).pathname;
  var filename = path.join(config.web_root + "/" + uri);
  console.log ("Serving " + filename);
  
  fs.exists(filename, function(exists) {
    if (fs.statSync(filename).isDirectory()) {
      filename += "/index.html";
    }

    if (!exists) {
      console.log("HTTP Server: 404 error: " + filename);
      response.writeHead(404, {"Content-Type": "test/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }
    fs.readFile(filename, "binary", function(err, file) {
      if (err) {
        console.log("HTTP Server: 500 Error : " + err);
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
var listeningServer = server.listen(config.httpServerPort);
console.log("HTTP server listening on port " + config.httpServerPort);


var wss = engine.attach(listeningServer);
wss.on('connection', function(socket) {
  console.log("Engine.io: connection!");
  socket.send('hi');

  socket.on('message', function(data) {
    console.log("Engine.io: Received message: " + data);
  });

  socket.on('close', function() {
    console.log("Engine.io: Closing connection");
  });
});

