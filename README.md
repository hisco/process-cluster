# Process cluster

`process-cluster` will asist you in creating any child process cluster, it uses
`forever-process` to makes sure that cluster will run forever.

## Features
  * Fork a child process
  * Spawn any process
  * Fork a chile process with node cluster capabilities
  * To any size of cluster
  * Cluster will run forever, we use `forever-process` to make sure it does.

## Simple usage
Creating a cluster of Node cluster module.
Notice, the with this multiple nodejs process will be able to "share"(over IPC) the same port when receiving any net requst such as http.

```js
const {ProcessCluster} = require('process-cluster');
const cluster = require('cluster');
const processCluster = new ProcessCluster({
    size : 3,
    fork(){
        cluster.setupMaster({
                exec : `${prcessPath}`,
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

```

Creating a cluster of Node process with IPC communication without 'port' sharing.
```js
const {ProcessCluster} = require('process-cluster');
const {fork} = require('child_process');
const processCluster = new ProcessCluster({
    size : 3,
    fork(){
        return fork(`${prcessPath}`);
    }
});
processCluster.on('childProcess' , (childProcess)=>{
    console.log('You can do any operation on `childProcess`');
});
processCluster.on('childProcessRemoved' , (childProcess)=>{
    console.log('Removed');
});
processCluster.start();

```

### API
Well, the API is quite simple.
You can see this TypeScript declaration.

```ts
declare module ProcessCluster {
	export class ProcessCluster extends EventEmitter{
		constructor(options : {
            size : number,
            fork : ()=>ChildProcess
        });
		public createForkedChild():void;
		public removeForkedChild(child? : any):void;
		public forkToDetination():void;
		public increaseBy(size : number):void;
		public decreaseBy(size : number):void;
		public stop():void;
		public start():void;
	}
}
```

## License

  [MIT](LICENSE)