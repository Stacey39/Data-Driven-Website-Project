var http = require('http');
http.createServer(function(req,res){
res.writeHead{200,'Context-Type':'text/html'});
res.edn('Hello word!');
}).listen(8080);