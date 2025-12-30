var exec = require('cordova/exec');

var AgeCheckPlugin = {
    checkAge: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'AgeCheckPlugin', 'checkAge', []);
    },
    isSupported: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback || function() {}, 'AgeCheckPlugin', 'isSupported', []);
    }
};

module.exports = AgeCheckPlugin;