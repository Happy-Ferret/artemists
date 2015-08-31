var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var artemis;
(function (artemis) {
    var Bag = artemis.utils.Bag;
    var BitSet = artemis.utils.BitSet;
    var Manager = artemis.Manager;
    var EntityManager = (function (_super) {
        __extends(EntityManager, _super);
        function EntityManager() {
            _super.call(this);
            this.entities_ = new Bag();
            this.disabled_ = new BitSet();
            this.identifierPool_ = new IdentifierPool();
        }
        EntityManager.prototype.initialize = function () {
        };
        EntityManager.prototype.createEntityInstance = function () {
            var e = new artemis.Entity(this.world_, this.identifierPool_.checkOut());
            this.created_++;
            return e;
        };
        EntityManager.prototype.added = function (e) {
            this.active_++;
            this.added_++;
            this.entities_.set(e.getId(), e);
        };
        EntityManager.prototype.enabled = function (e) {
            this.disabled_.clear(e.getId());
        };
        EntityManager.prototype.disabled = function (e) {
            this.disabled_.set(e.getId());
        };
        EntityManager.prototype.deleted = function (e) {
            this.entities_.set(e.getId(), null);
            this.disabled_.clear(e.getId());
            this.identifierPool_.checkIn(e.getId());
            this.active_--;
            this.deleted_++;
        };
        /**
        * Check if this entity is active.
        * Active means the entity is being actively processed.
        *
        * @param entityId
        * @return true if active, false if not.
        */
        EntityManager.prototype.isActive = function (entityId) {
            return this.entities_.get(entityId) != null;
        };
        /**
        * Check if the specified entityId is enabled.
        *
        * @param entityId
        * @return true if the entity is enabled, false if it is disabled.
        */
        EntityManager.prototype.isEnabled = function (entityId) {
            return !this.disabled_.get(entityId);
        };
        /**
        * Get a entity with this id.
        *
        * @param entityId
        * @return the entity
        */
        EntityManager.prototype.getEntity = function (entityId) {
            return this.entities_.get(entityId);
        };
        /**
        * Get how many entities are active in this world.
        * @return how many entities are currently active.
        */
        EntityManager.prototype.getActiveEntityCount = function () {
            return this.active_;
        };
        /**
        * Get how many entities have been created in the world since start.
        * Note: A created entity may not have been added to the world, thus
        * created count is always equal or larger than added count.
        * @return how many entities have been created since start.
        */
        EntityManager.prototype.getTotalCreated = function () {
            return this.created_;
        };
        /**
        * Get how many entities have been added to the world since start.
        * @return how many entities have been added.
        */
        EntityManager.prototype.getTotalAdded = function () {
            return this.added_;
        };
        /**
        * Get how many entities have been deleted from the world since start.
        * @return how many entities have been deleted since start.
        */
        EntityManager.prototype.getTotalDeleted = function () {
            return this.deleted_;
        };
        return EntityManager;
    })(Manager);
    artemis.EntityManager = EntityManager;
    /*
* Used only internally to generate distinct ids for entities and reuse them.
*/
    var IdentifierPool = (function () {
        function IdentifierPool() {
            this.nextAvailableId_ = 0;
            this.ids_ = new Bag();
        }
        IdentifierPool.prototype.checkOut = function () {
            if (this.ids_.size() > 0) {
                return this.ids_.removeLast();
            }
            return this.nextAvailableId_++;
        };
        IdentifierPool.prototype.checkIn = function (id) {
            this.ids_.add(id);
        };
        return IdentifierPool;
    })();
})(artemis || (artemis = {}));
//# sourceMappingURL=EntityManager.js.map