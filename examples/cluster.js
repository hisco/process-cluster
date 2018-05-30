const {ProcessCluster} = require('../src');
const cluster = require('cluster');
const processCluster = new ProcessCluster({
    size : 3,
    fork(){
        cluster.setupMaster({
                exec : './examples/child.js',
                args : [ 
                    ...process.argv.slice(2)
                ]
            });
        return cluster.fork();
    }
});
processCluster.on('childProcess' , (childProcess)=>{
    console.log('You can do any operation on `childProcess`');
});
processCluster.on('childProcessRemoved' , (childProcess)=>{
    console.log('Removed');
});
processCluster.start();