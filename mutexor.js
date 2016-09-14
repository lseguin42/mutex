'use strict';

const Promise = require('bluebird');

function Mutex() {
    let locked = false;
    let callbacks = [];

    function noop() {};

    function once(callback) {
        return function () {
            if (callback) {
                let res = callback.apply(this, arguments);
                callback = null;
                return res;
            }
        };
    }

    function next() {
        if (!locked && callbacks.length > 0) {
            locked = true;
            let callback = callbacks.shift();

            callback(function () {
                locked = false;
                next();
            });
        }
    }

    function wrapper(callback) {
        let deferred = Promise.defer();

        function wrap(terminate) {
            let unlock = once(function () {
                if (callback) {
                    deferred.resolve();
                }
                terminate();
            });
            if (callback) {
                callback(unlock);
            } else {
                deferred.resolve(unlock);
            }
        }
        wrap.promise = deferred.promise;
        return wrap;
    }

    return {
        lock: function (callback) {
            let wrapCallback = wrapper(callback);
            callbacks.push(wrapCallback);
            next();
            return wrapCallback.promise;
        },
        inWaiting: function () {
            return callbacks.length
        },
        isLocked: function () {
            return locked;
        }
    }
}

module.exports = Mutex;
