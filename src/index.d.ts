import {ChildProcess} from 'child_process';
import {EventEmitter} from 'events';
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
		public setSize(size : number):void;
		public stop():void;
		public start():void;
	}
}