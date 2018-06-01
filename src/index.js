const {ForeverChildProcess} = require('forever-process');
const {EventEmitter} = require('events');

class ProcessCluster extends EventEmitter{
    constructor(
        options
    ){
        super();
        this._init(options || {});
    }
    _init({
        size,
        fork
    }){
        this.destination = size;
        this.lastCount = size;
        this.fork = fork;
        this.children = [];
        if (!fork)
            throw new Error('Please supply a fork function')
        if (isNaN(size + 0))
            throw new Error('Please supply `size` of the cluster (the amount of child process you want to fork)')

        this.on('removed', (child)=>{
            child.stop();
            child.removeAllListeners()
        });
    }
    getCurrentChildProcess(){
        return this.children.map(foreverProcess => foreverProcess.process);
    }
    createProcess(){
        const child = new ForeverChildProcess({
            fork : this.fork
        });
        child.on('child' , (childProcess)=>{
            this.emit('childProcess' , childProcess)
        });
        child.on('removed' , (childProcess)=>{
            this.emit('childProcessRemoved' , childProcess)
        })
        child.fork(this.fork);

        return child;
    }
    createForkedChild(){
        const child = this.createProcess();
        this.children.push(child);
    }
    removeForkedChild(child){
        let childToBeRemoved;
        if (child){
            const index = this.children.indexOf(child);
            if (index != -1){
                this.children.splice(index , 1);
                childToBeRemoved = child;
            }
        }
        else 
            childToBeRemoved = this.children.shift();

        if (childToBeRemoved)
            this.emit('removed' , childToBeRemoved)
    }
    forkToDetination(){
        let delta = this.destination- this.children.length;
        if (delta > 0){
            for (let i=0;i<delta;i++)
                this.createForkedChild()
        }
        else {
            delta = Math.abs(delta);
            for (let i=0;i<delta;i++)
                this.removeForkedChild()
        }
    }
    increaseBy(n){
        this.destination+=n;
        this.forkToDetination();
    }
    decreaseBy(n){
        this.destination-=n;
        this.forkToDetination();
    }
    setSize(n){
        this.destination=n;
        this.forkToDetination();
    }
    stop(){
        this.lastCount = this.destination;
        this.destination = 0;
        this.forkToDetination();
    }
    start(){
        this.destination = this.lastCount;
        this.forkToDetination();
    }
}

module.exports = {
    ProcessCluster
}