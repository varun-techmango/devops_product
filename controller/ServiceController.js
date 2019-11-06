const express        = require('express');
const router         = express.Router();	
const http = require('http');	
const parseJson = require('parse-json');
const redisServer 		 = require('../redis/redisServer')

function getArrayObjectValue(array,key,start){
	if(array.length <= start){
		return -1;
	}else if(Object.keys(array[start]).indexOf(key)!= -1 ){
		return array[start][key];
	}else{
		return getArrayObjectValue(array,key,++start)
	}
}
function mergeArrayOfObjectArray(array,key,start,result){
	if(array.length <= start){
		return result;
	}else{
		if(Object.keys(array[start]).indexOf(key)){
			result = result.concat(array[start][key]); 
		}
		return mergeArrayOfObjectArray(array,key,++start,result)
	}
}
exports.getCpuStatistics = async function(req, res){
	var io = req.app.get('io');
	var getCpustatistics = await redisServer.getServers_Hash('server','cpu_statistics');
	if(getCpustatistics){
		var result = mergeArrayOfObjectArray(getCpustatistics,'data',0,[]);
		io.emit('send', result);
		res.send({status:1,msg:'',result:result})
	}else{
		io.emit('send', []);
		res.send({status:1,msg:'',result:[]})
	}
}
exports.clearRedis = function(req, res){
	var setCpustatisticss = redisServer.storeServers_Hash('server', 'cpu_statistics',[]); 
	res.send({status:1,msg:'Success'})
}
exports.getServer = async function(req, res){
	var serverData = req.body;
	var result = {status:0,msg:'Something went to wrong.Please check input.'};
	if(serverData['disk.msg'] && serverData['disk.msg'].length > 0){
		var volume = getArrayObjectValue(serverData['disk.msg'],'volume',0);
		var ipaddress = getArrayObjectValue(serverData['disk.msg'],'ipaddress',0);
		if(volume != -1 && volume.length > 0){
			var data = [];
			for(var i=0;i<volume.length;i++){
				var insertObject = {total:0,used:0,free:0};
				if(volume[i].block_total){
					insertObject.total = volume[i].block_total;
				}
				if(volume[i].block_used){
					insertObject.used = volume[i].block_used;
				}
				insertObject.free = insertObject.total - insertObject.used;
				insertObject.mount = volume[i].mount;
				insertObject.label = ipaddress + volume[i].device.replace('/dev/', '-');;
				data.push(insertObject);
			}
			result.cpu_statistics = {'label':ipaddress,data:data};
			var getCpustatistics = await redisServer.getServers_Hash('server','cpu_statistics');
			if(getCpustatistics){
				var index_of = getCpustatistics.map(function(e){return e.label}).indexOf(ipaddress);
				if(index_of == -1){
					getCpustatistics.push(result.cpu_statistics);
				}else{
					getCpustatistics[index_of] = result.cpu_statistics;
				}
			}else{
				getCpustatistics = [];
				getCpustatistics.push(result.cpu_statistics);
			}
			var setCpustatisticss = await redisServer.storeServers_Hash('server', 'cpu_statistics',getCpustatistics);
			var getCpustatistics = await redisServer.getServers_Hash('server','cpu_statistics');
			var io = req.app.get('io');
			var final_result = mergeArrayOfObjectArray(getCpustatistics,'data',0,[]);
			io.emit('send', final_result);
			result.status = 1;
			result.msg = 'Successfuly send data';
			res.send(result)
		}else{
			res.send(result)
		}
	}else{
		res.send(result)
	}
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
		outData.serverData = serverData;


	var io = req.app.get('io');
	io.emit('DashboardJenkins', outData);
	var result = {status:1,msg:"Successfuly send data"};
	res.send(result)


}


