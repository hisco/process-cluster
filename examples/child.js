console.log('hi');
let i = 0;
setInterval(()=>{
    console.log('count ' , i++)
} ,1000)
setTimeout(()=>{
    process.exit(0)
} , 6000)