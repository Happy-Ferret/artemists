var artemis;
(function (artemis) {
    var BitSet = artemis.utils.BitSet;
    /**
    * An Aspects is used by systems as a matcher against entities, to check if a system is
    * interested in an entity. Aspects define what sort of component types an entity must
    * possess, or not possess.
    *
    * This creates an aspect where an entity must possess A and B and C:
    * Aspect.getAspectForAll(A.class, B.class, C.class)
    *
    * This creates an aspect where an entity must possess A and B and C, but must not possess U or V.
    * Aspect.getAspectForAll(A.class, B.class, C.class).exclude(U.class, V.class)
    *
    * This creates an aspect where an entity must possess A and B and C, but must not possess U or V, but must possess one of X or Y or Z.
    * Aspect.getAspectForAll(A.class, B.class, C.class).exclude(U.class, V.class).one(X.class, Y.class, Z.class)
    *
    * You can create and compose aspects in many ways:
    * Aspect.getEmpty().one(X.class, Y.class, Z.class).all(A.class, B.class, C.class).exclude(U.class, V.class)
    * is the same as:
    * Aspect.getAspectForAll(A.class, B.class, C.class).exclude(U.class, V.class).one(X.class, Y.class, Z.class)
    *
    * @author Arni Arent
    *
    */
    var Aspect = (function () {
        function Aspect() {
            this.allSet_ = new BitSet();
            this.exclusionSet_ = new BitSet();
            this.oneSet_ = new BitSet();
        }
        Aspect.prototype.getAllSet = function () {
            return this.allSet_;
        };
        Aspect.prototype.getExclusionSet = function () {
            return this.exclusionSet_;
        };
        Aspect.prototype.getOneSet = function () {
            return this.oneSet_;
        };
        /**
        * Returns an aspect where an entity must possess all of the specified component types.
        * @param type a required component type
        * @param types a required component type
        * @return an aspect that can be matched against entities
        */
        Aspect.prototype.all = function (type) {
            var types = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                types[_i - 1] = arguments[_i];
            }
            this.allSet_.set(artemis.ComponentType.getIndexFor(type));
            for (var t in types) {
                this.allSet_.set(artemis.ComponentType.getIndexFor(types[t]));
            }
            return this;
        };
        /**
        * Excludes all of the specified component types from the aspect. A system will not be
        * interested in an entity that possesses one of the specified exclusion component types.
        *
        * @param type component type to exclude
        * @param types component type to exclude
        * @return an aspect that can be matched against entities
        */
        Aspect.prototype.exclude = function (type) {
            var types = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                types[_i - 1] = arguments[_i];
            }
            this.exclusionSet_.set(artemis.ComponentType.getIndexFor(type));
            for (var t in types) {
                this.exclusionSet_.set(artemis.ComponentType.getIndexFor(types[t]));
            }
            return this;
        };
        /**
        * Returns an aspect where an entity must possess one of the specified component types.
        * @param type one of the types the entity must possess
        * @param types one of the types the entity must possess
        * @return an aspect that can be matched against entities
        */
        Aspect.prototype.one = function (type) {
            var types = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                types[_i - 1] = arguments[_i];
            }
            this.oneSet_.set(artemis.ComponentType.getIndexFor(type));
            for (var t in types) {
                this.oneSet_.set(artemis.ComponentType.getIndexFor(types[t]));
            }
            return this;
        };
        /**
        * Creates an aspect where an entity must possess all of the specified component types.
        *
        * @param type the type the entity must possess
        * @param types the type the entity must possess
        * @return an aspect that can be matched against entities
        *
        * @deprecated
        * @see getAspectForAll
        */
        Aspect.getAspectFor = function (type) {
            var types = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                types[_i - 1] = arguments[_i];
            }
            return Aspect.getAspectForAll.apply(Aspect, [type].concat(types));
        };
        /**
        * Creates an aspect where an entity must possess all of the specified component types.
        *
        * @param type a required component type
        * @param types a required component type
        * @return an aspect that can be matched against entities
        */
        Aspect.getAspectForAll = function (type) {
            var types = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                types[_i - 1] = arguments[_i];
            }
            var aspect = new Aspect();
            aspect.all.apply(aspect, [type].concat(types));
            return aspect;
        };
        /**
        * Creates an aspect where an entity must possess one of the specified component types.
        *
        * @param type one of the types the entity must possess
        * @param types one of the types the entity must possess
        * @return an aspect that can be matched against entities
        */
        Aspect.getAspectForOne = function (type) {
            var types = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                types[_i - 1] = arguments[_i];
            }
            var aspect = new Aspect();
            aspect.one.apply(aspect, [type].concat(types));
            return aspect;
        };
        /**
        * Creates and returns an empty aspect. This can be used if you want a system that processes no entities, but
        * still gets invoked. Typical usages is when you need to create special purpose systems for debug rendering,
        * like rendering FPS, how many entities are active in the world, etc.
        *
        * You can also use the all, one and exclude methods on this aspect, so if you wanted to create a system that
        * processes only entities possessing just one of the components A or B or C, then you can do:
        * Aspect.getEmpty().one(A,B,C);
        *
        * @return an empty Aspect that will reject all entities.
        */
        Aspect.getEmpty = function () {
            return new Aspect();
        };
        return Aspect;
    })();
    artemis.Aspect = Aspect;
})(artemis || (artemis = {}));
//# sourceMappingURL=Aspect.js.map