module artemis {
	
	import HashMap = artemis.utils.HashMap;
	
	export class ComponentType {
		private static INDEX:number = 0;
	
		private index_:number;
		private type_:Function; //Class<? extends Component>;
	
		constructor(type:Function) {
			this.index_ = ComponentType.INDEX++;
			this.type_ = type;
		}
	
		public getIndex():number {
			return this.index_;
		}
		
		
		public toString():string {
			var klass:any = ComponentType;
			return "ComponentType["+klass.name+"] ("+this.index_+")";
			// return "ComponentType["+klass.getSimpleName()+"] ("+this.index_+")";
		}
	
		private static componentTypes:HashMap<Function, ComponentType> = new HashMap<Function, ComponentType>();
	
		public static getTypeFor(c:Function):ComponentType {
			var type:ComponentType = ComponentType.componentTypes.get(c);
	
			if (type == null) {
				type = new ComponentType(c);
				ComponentType.componentTypes.put(c, type);
			}
	
			return type;
		}
	
		public static getIndexFor(c:Function):number {
			return ComponentType.getTypeFor(c).getIndex();
		}
	}
}