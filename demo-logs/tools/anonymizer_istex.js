/*
*  Tool to anonymize logs file
*  It reads line by line the file and remove unwanted values
*
*/ 
var fs = require('fs');
var lineReader = require('readline').createInterface({
  input: fs.createReadStream('../istex.old.log')
});

lineReader.on('line', function (line) {
	if((match = /^([0-9\.]+)\s([a-z0-9\"]+[^X])\s([0-9a-zÀ-ÿ\s\"\-\']+)\s-/ig.exec(line)) !== null){
		//185.61.163.0 "ABESCWN7PF5JA" "Université d'Aix-Marseille" 
	  var new_line = line;
	  new_line = new_line.replace(match[2], "XXX");
    new_line = new_line.replace(match[3], "XXX");
	  fs.appendFileSync('../istex.log', new_line+'\n');	
	}else{
	  fs.appendFileSync('../istex.log', line+'\n');	
	}
});
