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
        clearTimeout(timer1);
        clearTimeout(timer2);
    }
    if (operator == 1) {
        
        
        function blink() {
            
        board.digitalWrite(13, board.HIGH);
        
        
        timer1 = setTimeout(function () {
		      board.digitalWrite(13, board.LOW);
	       }, 500);    
            
        // and schedule a repeat
        timer2 = setTimeout(blink, 1000);
        }

        clearTimeout(timer2);
        clearTimeout(timer1);
        
        blink();
        console.log("Putting LED to BLINK.");
        
    }
    
    res.writeHead(200, {"Content-Type": "text/plain"}); // 200=OK
    res.write("For test write into browser e.g. 123.1.2.3:8080/1 \n");
    res.end("The value of the operator is: " + operator);
    
}).listen(8080, "192.168.254.133"); // listen on port 8080