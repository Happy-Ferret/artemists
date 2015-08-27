(function (root, factory) {
    if ('function' === typeof define && undefined.amd) {
        define(factory);
    }
    else if ('object' == typeof exports) {
        module.exports = factory();
    }
    else {
        root['artemis'] = factory();
    }
})(this, function () { return artemis; });