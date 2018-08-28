var cache=require("../cache");var sourcelist=function sourcelist(module){var sourcecnt=0;var source={};for(var key in global.hybridd.source){if(typeof global.hybridd.source[key].module!=="undefined"&&global.hybridd.source[key].module===module){if(typeof global.hybridd.source[key].mode==="undefined"){if(key===global.hybridd.source[key].module){source[key]=""}else{source[key]=global.hybridd.source[key].module}}else{source[key]=global.hybridd.source[key].mode}sourcecnt+=1}}return{error:0,info:"List of available source id's and their modes.",id:`source/${module}`,count:sourcecnt,data:functions.sortObjectByKey(source)}};var modelist=function modelist(module){var modecnt=0;var mode=[];for(var key in global.hybridd.source){if(typeof global.hybridd.source[key].module!=="undefined"&&global.hybridd.source[key].module===module){if(typeof global.hybridd.source[key].mode!=="undefined"&&mode.indexOf(global.hybridd.source[key].mode)===-1){mode.push(global.hybridd.source[key].mode);modecnt+=1}}}return{count:modecnt,data:mode,error:0,id:`source/${module}`,info:"List of available modes."}};var directcommand=function directcommand(target,lxpath,sessionID){if(lxpath[3]){var processID=scheduler.init(0,{sessionID:sessionID});var cnta=1;var cntb=4;var command=[];command[0]=lxpath[3];while(typeof lxpath[cntb]!=="undefined"){command[cnta]=lxpath[cntb];cnta+=1;cntb+=1}if(typeof modules.module[target.module]==="undefined"){console.log(` [!] module ${target.module}: not loaded, or disfunctional!`);var result={error:1,info:"Module not found or dysfunctional!"}}else{modules.module[target.module].main.link({command:command,processID:processID,target:target});result={data:processID,error:0,id:"id",info:"Command process ID.",request:command}}}else{result={error:1,info:`You must give a command! (Example: http://${global.hybridd.restbind}:${global.hybridd.restport}/source/blockexplorer/command/help)`}}return result};var sourceexec=function sourceexec(target,lxpath,sessionID){var processID=scheduler.init(0,{sessionID:sessionID});var cnta=1;var cntb=3;var command=[];command[0]=lxpath[2];while(typeof lxpath[cntb]!=="undefined"){command[cnta]=lxpath[cntb];cnta+=1;cntb+=1}if(typeof global.hybridd.source[target.id]==="undefined"||typeof modules.module[global.hybridd.source[target.id].module]==="undefined"){console.log(` [!] module ${module}: not loaded, or disfunctional!`);var result={error:1,info:"Module not found or disfunctional!"}}else{modules.module[global.hybridd.source[target.id].module].main.exec({command:command,processID:processID,target:target});result={data:processID,error:0,id:"id",info:"Command process ID.",request:command}}return result};var process=function process(request,xpath){var result=null;var target={};if(xpath.length===1){result={count:3,data:["blockexplorer","deterministic","storage"],error:0,id:"source",info:"List of available sources."}}else{var pathsSourceExec=[];var command=null;switch(xpath[1]){case"storage":command=xpath[2];pathsSourceExec=["get","set","del","pow","meta"];target={id:"storage",module:"storage"};break;case"deterministic":command=xpath[2];pathsSourceExec=["assets","code","hash","hashes","modes"];target={id:"deterministic",module:"deterministic"};break;case"blockexplorer":command=xpath[3];pathsSourceExec=["balance","command","status","unspent"];if(typeof xpath[2]==="undefined"){return sourcelist(xpath[1])}if(typeof xpath[2]==="string"&&xpath[2].substr(0,1)==="*"){if(typeof xpath[3]==="undefined"){return modelist(xpath[1])}target=modules.getsource(xpath[3]);if(!target){return{error:1,id:"source/*",info:"An existing mode must be specified after wildcard! Example: */bitcoin/unspent/ADDRESS"}}command=xpath[4];xpath.shift();xpath[1]=xpath[0]}else{var resxpath=null;if(typeof xpath[2]==="string"&&typeof global.hybridd.source[xpath[2]]==="undefined"){for(var key in global.hybridd.source){if(typeof global.hybridd.source[key].mode!=="undefined"&&global.hybridd.source[key].mode===xpath[2]){resxpath=global.hybridd.source[key].id}}}else{resxpath=xpath[2]}if(resxpath){target=global.hybridd.source[resxpath]}else{return{error:1,id:"source/*",info:"An existing id or mode must be specified! Example: insight.btc/unspent/ADDRESS"}}if(!target){return{error:1,id:"source",info:"Source '"+xpath[2]+"' not found."}}}xpath.shift();xpath[1]=xpath[0];break;default:break}if(["blockexplorer","deterministic","storage"].indexOf(xpath[1])>-1||typeof target!=="undefined"){if(xpath[2]==="command"&&request.sessionID===1){result=directcommand(target,xpath,request.sessionID)}else if(pathsSourceExec.indexOf(command)>-1){var cacheVal=typeof target.cache!=="undefined"?target.cache:12e3;var cacheIdx=DJB2.hash(request.sessionID+xpath.join("/"));var cacheResult=cache.get(cacheIdx,cacheVal);if(!cacheResult){result=sourceexec(target,xpath,request.sessionID);if(!result.error){cache.add(cacheIdx,result)}}else if(cacheResult.fresh){result=cacheResult.data}else{result=sourceexec(target,xpath,request.sessionID);if(!result.error){cache.add(cacheIdx,result)}else{result=cacheResult.data}}}else{result={error:0,id:`source/${xpath[1]}`,info:"Please use a source function!",data:pathsSourceExec}}}else{result={error:1,id:`source/${xpath[1]}`,info:"Source not found!"}}}return result};exports.process=process;