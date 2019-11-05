const express        = require('express');
const router         = express.Router();	
const http = require('http');	
const parseJson = require('parse-json');

exports.getServer = function(req, res){
	
	console.log(req.body);
	/*var params =  js.replace(/u'(?=[^:]+')/g, '"')
					.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
					.replace(/\\/g, "")
					.replace(/""/g,'{"')
					.replace(/}"}/g,"}}");
	var j = JSON.parse(params+"}");*/

	var serverData = req.body;
	var io = req.app.get('io');
	//console.log(io);
	io.emit('send', serverData);
}



exports.getJenkins = function(req,res){

	//console.log(req.body);
	/*var params =  js.replace(/u'(?=[^:]+')/g, '"')
					.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
					.replace(/\\/g, "")
					.replace(/""/g,'{"')
					.replace(/}"}/g,"}}");
	var j = JSON.parse(params+"}");*/

	var serverData = req.body;

	var disableCount = 0;
	var errorCount = 0;
	var successCount = 0;

	for(var i=0; i<serverData.jobs.length; i++){
		if(serverData.jobs[i].color=='notbuilt'){
			disableCount+=1;
		}else if(serverData.jobs[i].color=='red'){
			errorCount+=1;
		}else{
			successCount+=1;
		}
	}

	var outData = {};
		outData.disableCount = 	disableCount;
		outData.errorCount = 	errorCount;
		outData.successCount = 	successCount;
		outData.total = i;


	var io = req.app.get('io');
	console.log(outData);
	io.emit('DashboardJenkins', outData);

}
