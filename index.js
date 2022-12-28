const http=require('http');
const fs=require('fs');
var requests = require('requests');

const homeFile=fs.readFileSync("home.html","UTF-8");

const replaceVal=(tempval,orgval)=>{
let temperature=tempval.replace("{%tempval%}",((orgval.main.temp)-273).toFixed(2));
temperature=temperature.replace("{%tempmin%}",((orgval.main.temp_min)-273).toFixed(2));
temperature=temperature.replace("{%tempmax%}",((orgval.main.temp_max)-273).toFixed(2));
temperature=temperature.replace("{%location%}",orgval.name);
temperature=temperature.replace("{%country%}",orgval.sys.country);  
temperature=temperature.replace("{%tempstatus%}",orgval.weather[0].main);  
return temperature;
}   
http.createServer((req,res)=>{
if(req.url==="/"){
    requests('http://api.openweathermap.org/data/2.5/weather?q=Fatehpur&appid=50faf56f16d91279aca5311be1a524e6')
    .on('data', (chunk)=> {
     const objdata=JSON.parse(chunk);
     const arrData=[objdata];
        //console.log((arrData[0].main.temp)-273);
    const realTimeData =arrData.map((val) => replaceVal(homeFile,val)).join(" ");
    res.write(realTimeData);
   //console.log(realTimeData)
    })
    .on("end",  (err)=> {
      if (err) return console.log("connection closed due to errors", err);
    res.end(); 
    });
}
}).listen(process.env.PORT || 8000,()=>{console.log("listening port 8000")});
