const http =  require('http')
const fs= require('fs')
var requests= require('requests')
const homefile=fs.readFileSync("home.html","utf-8")
const replaceVal=(tempval,orgval)=>{
    let temperature=tempval.replace("{%tempval%}",orgval.main.temp)
    temperature=temperature.replace("{%tempmin%}",orgval.main.temp_min)
    temperature=temperature.replace("{%tempmax%}",orgval.main.temp_max)
    temperature=temperature.replace("{%location%}",orgval.name)
    temperature=temperature.replace("{%country%}",orgval.sys.country)
    temperature=temperature.replace("{%tempstatus%}",orgval.weather[0].main)
    return temperature

}
const server = http.createServer((req,res)=>{
    if(req.url == "/" ){
       requests(
       " https://api.openweathermap.org/data/2.5/weather?q=Bengaluru&units=metric&appid=f45bd856b45b710942f39d85e218ed72"
       )
       .on("data" ,(chunk)=>{
        const objdata=JSON.parse(chunk)
        const arrdata=[objdata]
        const realtimedata=arrdata.map((val)=>replaceVal(homefile,val))
        .join("")
        res.write(realtimedata)
        console.log(realtimedata)
       })
       .on("end",(err)=>{
        if(err) return console.log("connection closed due to errors",err)
        
        res.end();
        
       })
    }
})
server.listen(8000,"127.0.0.1")
