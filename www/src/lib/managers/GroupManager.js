var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var artemis;
(function (artemis) {
    var Bag = artemis.utils.Bag;
    var HashMap = artemis.utils.HashMap;
    var managers;
    (function (managers) {
        /**
        * If you need to group your entities together, e.g. tanks going into "units" group or explosions into "effects",
        * then use this manager. You must retrieve it using world instance.
        *
        * A entity can be assigned to more than one group.
        *
        * @author Arni Arent
        *
        */
        var GroupManager = (function (_super) {
            __extends(GroupManager, _super);
            function GroupManager() {
                _super.call(this);
                this.entitiesByGroup_ = new HashMap();
                this.groupsByEntity_ = new HashMap();
            }
            GroupManager.prototype.initialize = function () {
            };
            /**
            * Set the group of the entity.
            *
            * @param group group to add the entity into.
            * @param e entity to add into the group.
            */
            GroupManager.prototype.add = function (e, group) {
                var entities = this.entitiesByGroup_.get(group);
                if (entities == null) {
                    entities = new Bag();
                    this.entitiesByGroup_.put(group, entities);
                }
                entities.add(e);
                var groups = this.groupsByEntity_.get(e);
                if (groups == null) {
                    groups = new Bag();
                    this.groupsByEntity_.put(e, groups);
                }
                groups.add(group);
            };
            /**
            * Remove the entity from the specified group.
            * @param e
            * @param group
            */
            GroupManager.prototype.remove = function (e, group) {
                var entities = this.entitiesByGroup_.get(group);
                if (entities != null) {
                    entities.remove(e);
                }
                var groups = this.groupsByEntity_.get(e);
                if (groups != null) {
                    groups.remove(group);
                }
            };
            GroupManager.prototype.removeFromAllGroups = function (e) {
                var groups = this.groupsByEntity_.get(e);
                if (groups != null) {
                    for (var i = 0; groups.size() > i; i++) {
                        var entities = this.entitiesByGroup_.get(groups.get(i));
                        if (entities != null) {
                            entities.remove(e);
                        }
                    }
                    groups.clear();
                }
            };
            /**
            * Get all entities that belong to the provided group.
            * @param group name of the group.
            * @return read-only bag of entities belonging to the group.
            */
            GroupManager.prototype.getEntities = function (group) {
                var entities = this.entitiesByGroup_.get(group);
                if (entities == null) {
                    entities = new Bag();
                    this.entitiesByGroup_.put(group, entities);
                }
                return entities;
            };
            /**
            * @param e entity
            * @return the groups the entity belongs to, null if none.
            */
            GroupManager.prototype.getGroups = function (e) {
                return this.groupsByEntity_.get(e);
            };
            /**
            * Checks if the entity belongs to any group.
            * @param e the entity to check.
            * @return true if it is in any group, false if none.
            */
            GroupManager.prototype.isInAnyGroup = function (e) {
                return this.getGroups(e) != null;
            };
            /**
            * Check if the entity is in the supplied group.
            * @param group the group to check in.
            * @param e the entity to check for.
            * @return true if the entity is in the supplied group, false if not.
            */
            GroupManager.prototype.isInGroup = function (e, group) {
                if (group != null) {
                    var groups = this.groupsByEntity_.get(e);
                    for (var i = 0; groups.size() > i; i++) {
                        var g = groups.get(i);
                        if (group === g) {
                            return true;
                        }
                    }
                }
                return false;
            };
            GroupManager.prototype.deleted = function (e) {
                this.removeFromAllGroups(e);
            };
            return GroupManager;
        })(artemis.Manager);
        managers.GroupManager = GroupManager;
    })(managers = artemis.managers || (artemis.managers = {}));
})(artemis || (artemis = {}));
//# sourceMappingURL=GroupManager.js.map