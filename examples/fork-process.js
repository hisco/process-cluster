const {ProcessCluster} = require('../src');
const {fork} = require('child_process');
const cluster = new ProcessCluster({
    size : 3,
    fork(){
        return fork('./examples/child.js');
    }
});
cluster.on('childProcess' , (childProcess)=>{
    console.log('You can do any operation on `childProcess`');
});
cluster.on('childProcessRemoved' , (childProcess)=>{
    console.log('Removed');
});
cluster.start();