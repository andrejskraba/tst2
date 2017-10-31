var http = require("http");
var firmata = require("firmata");

var timer1;
var timer2;


console.log("Starting the code");

var board = new firmata.Board("/dev/ttyACM0", function(){
    console.log("Connecting to Arduino");
    console.log("Activation of Pin 13");
    board.pinMode(13, board.MODES.OUTPUT); // pin13 as out
});

http.createServer(function(req, res) {
    var parts = req.url.split("/"), // split request on / character
    operator = parseInt(parts[1],10); // 10 is radix - decimal notation
    
    if (operator == 0) {
        console.log("Putting LED to OFF.");
        board.digitalWrite(13, board.LOW);
        clearTimeout(timer2);
        clearInterval(timer1);
    }
    if (operator == 1) {
        
        timer1 = setInterval(function(){
            board.digitalWrite(13, board.HIGH); // each 1000ms we put pin 13 to HIGH
            timer2 = setTimeout(function(){
                board.digitalWrite(13, board.LOW); // // each 5000ms we put pin 13 to LOW
            }, 500);
        }, 1000);
        

        console.log("Putting LED to BLINK.");
        
    }
    
    res.writeHead(200, {"Content-Type": "text/plain"}); // 200=OK
    res.write("For test write into browser e.g. 123.1.2.3:8080/1 \n");
    res.end("The value of the operator is: " + operator);
    
}).listen(8080, "192.168.254.133"); // listen on port 8080