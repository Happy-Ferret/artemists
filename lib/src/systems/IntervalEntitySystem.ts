module artemis.systems {
  "use strict";

	import EntitySystem = artemis.EntitySystem;
	import Aspect = artemis.Aspect;

	/**
	* A system that processes entities at a interval in milliseconds.
	* A typical usage would be a collision system or physics system.
	*
	* @author Arni Arent
	*
	*/
	export class IntervalEntitySystem extends EntitySystem {
		private acc_:number=0;
		private interval_:number=0;

		constructor(aspect:Aspect, interval:number) {
			super(aspect);
			this.interval_ = interval;
		}


		protected checkProcessing():boolean {
			//this.acc_ += this.world.getDelta();
			//if(this.acc_ >= this.interval_) {

			if((this.acc_ += this.world.getDelta()) >= this.interval_) {
				this.acc_ -= this.interval_;
				return true;
			}
			return false;
		}

	}
}
