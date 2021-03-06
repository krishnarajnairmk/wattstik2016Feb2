var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require('MD5');

var rest = require("./REST.js");

var app  = express();

function REST(){
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
		waitForConnections : true,
        queueLimit :0,
        host     : 'us-cdbr-iron-east-03.cleardb.net',
        user     : 'b66276f8f3ed9f',
        password : 'e3d4f6b4',
        database : 'heroku_2f2b3584c2e81bb',
        debug    :  true,
		wait_timeout : 28800,
        connect_timeout :10
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
            console.log('connected to db');
		  //connection.release();
        }
    });
	
	self.configureExpress(pool);
}

REST.prototype.configureExpress = function(pool) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/api', router);
      var rest_router = new rest(router,pool,md5);
      self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(process.env.PORT || 5000,function(){
          console.log("All right ! I am alive at Port 5000.");
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();