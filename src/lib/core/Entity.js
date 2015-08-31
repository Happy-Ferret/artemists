var artemis;
(function (artemis) {
    var BitSet = artemis.utils.BitSet;
    var UUID = artemis.utils.UUID;
    /**
    * The entity class. Cannot be instantiated outside the framework, you must
    * create new entities using World.
    *
    * @author Arni Arent
    *
    */
    var Entity = (function () {
        function Entity(world, id) {
            this.world_ = world;
            this.id_ = id;
            this.entityManager_ = world.getEntityManager();
            this.componentManager_ = world.getComponentManager();
            this.systemBits_ = new BitSet();
            this.componentBits_ = new BitSet();
            this.reset();
        }
        /**
        * The internal id for this entity within the framework. No other entity
        * will have the same ID, but ID's are however reused so another entity may
        * acquire this ID if the previous entity was deleted.
        *
        * @return id of the entity.
        */
        Entity.prototype.getId = function () {
            return this.id_;
        };
        /**
        * Returns a BitSet instance containing bits of the components the entity possesses.
        * @return
        */
        Entity.prototype.getComponentBits = function () {
            return this.componentBits_;
        };
        /**
        * Returns a BitSet instance containing bits of the components the entity possesses.
        * @return
        */
        Entity.prototype.getSystemBits = function () {
            return this.systemBits_;
        };
        /**
        * Make entity ready for re-use.
        * Will generate a new uuid for the entity.
        */
        Entity.prototype.reset = function () {
            this.systemBits_.clear();
            this.componentBits_.clear();
            this.uuid = UUID.randomUUID();
        };
        Entity.prototype.toString = function () {
            return "Entity[" + this.id_ + "]";
        };
        /**
        * Add a component to this entity.
        *
        * @param component to add to this entity
        *
        * @return this entity for chaining.
        */
        // public addComponent(component: Component):Entity {
        // 	this.addComponent(component, ComponentType.getTypeFor(component.getClass()));
        // 	return this;
        // }
        /**
        * Faster adding of components into the entity. Not neccessery to use this, but
        * in some cases you might need the extra performance.
        *
        * @param component the component to add
        * @param type of the component
        *
        * @return this entity for chaining.
        */
        Entity.prototype.addComponent = function (component, type) {
            if (type === void 0) { type = artemis.ComponentType.getTypeFor(component.constructor); }
            this.componentManager_.addComponent(this, type, component);
            return this;
        };
        /**
        * Removes the component from this entity.
        *
        * @param component to remove from this entity.
        *
        * @return this entity for chaining.
        */
        Entity.prototype.removeComponentInstance = function (component) {
            //this.removeComponent(component.getClass());
            this.removeComponent(artemis.ComponentType.getTypeFor(component.constructor));
            return this;
        };
        /**
        * Faster removal of components from a entity.
        *
        * @param component to remove from this entity.
        *
        * @return this entity for chaining.
        */
        Entity.prototype.removeComponent = function (type) {
            this.componentManager_.removeComponent(this, type);
            return this;
        };
        /**
        * Remove component by its type.
        * @param type
        *
        * @return this entity for chaining.
        */
        Entity.prototype.removeComponentByType = function (type) {
            this.removeComponent(artemis.ComponentType.getTypeFor(type));
            return this;
        };
        /**
        * Checks if the entity has been added to the world and has not been deleted from it.
        * If the entity has been disabled this will still return true.
        *
        * @return if it's active.
        */
        Entity.prototype.isActive = function () {
            return this.entityManager_.isActive(this.id_);
        };
        /**
        * Will check if the entity is enabled in the world.
        * By default all entities that are added to world are enabled,
        * this will only return false if an entity has been explicitly disabled.
        *
        * @return if it's enabled
        */
        Entity.prototype.isEnabled = function () {
            return this.entityManager_.isEnabled(this.id_);
        };
        /**
        * This is the preferred method to use when retrieving a component from a
        * entity. It will provide good performance.
        * But the recommended way to retrieve components from an entity is using
        * the ComponentMapper.
        *
        * @param type
        *            in order to retrieve the component fast you must provide a
        *            ComponentType instance for the expected component.
        * @return
        */
        Entity.prototype.getComponent = function (type) {
            return this.componentManager_.getComponent(this, type);
        };
        // public <T extends Component> T getComponent(Class<T> type) {
        // 	return type.cast(getComponent(ComponentType.getTypeFor(type)));
        // }
        /**
        * Slower retrieval of components from this entity. Minimize usage of this,
        * but is fine to use e.g. when creating new entities and setting data in
        * components.
        *
        * @param <T>
        *            the expected return component type.
        * @param type
        *            the expected return component type.
        * @return component that matches, or null if none is found.
        */
        Entity.prototype.getComponentByType = function (type) {
            //return type.cast(getComponent(ComponentType.getTypeFor(type)));
            return this.componentManager_.getComponent(this, artemis.ComponentType.getTypeFor(type));
        };
        /**
        * Returns a bag of all components this entity has.
        * You need to reset the bag yourself if you intend to fill it more than once.
        *
        * @param fillBag the bag to put the components into.
        * @return the fillBag with the components in.
        */
        Entity.prototype.getComponents = function (fillBag) {
            return this.componentManager_.getComponentsFor(this, fillBag);
        };
        /**
        * Refresh all changes to components for this entity. After adding or
        * removing components, you must call this method. It will update all
        * relevant systems. It is typical to call this after adding components to a
        * newly created entity.
        */
        Entity.prototype.addToWorld = function () {
            this.world_.addEntity(this);
        };
        /**
        * This entity has changed, a component added or deleted.
        */
        Entity.prototype.changedInWorld = function () {
            this.world_.changedEntity(this);
        };
        /**
        * Delete this entity from the world.
        */
        Entity.prototype.deleteFromWorld = function () {
            this.world_.deleteEntity(this);
        };
        /**
        * (Re)enable the entity in the world, after it having being disabled.
        * Won't do anything unless it was already disabled.
        */
        Entity.prototype.enable = function () {
            this.world_.enable(this);
        };
        /**
        * Disable the entity from being processed. Won't delete it, it will
        * continue to exist but won't get processed.
        */
        Entity.prototype.disable = function () {
            this.world_.disable(this);
        };
        /**
        * Get the UUID for this entity.
        * This UUID is unique per entity (re-used entities get a new UUID).
        * @return uuid instance for this entity.
        */
        Entity.prototype.getUuid = function () {
            return this.uuid;
        };
        /**
        * Returns the world this entity belongs to.
        * @return world of entity.
        */
        Entity.prototype.getWorld = function () {
            return this.world_;
        };
        return Entity;
    })();
    artemis.Entity = Entity;
})(artemis || (artemis = {}));
//# sourceMappingURL=Entity.js.map