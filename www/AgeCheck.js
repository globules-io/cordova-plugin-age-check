var exec = require('cordova/exec');
var AgeCheck = {};
/**
 * Check age verification status.
 * 
 * On Android → calls AgeSignalsPlugin.checkAgeSignals
 * On iOS     → calls AgeCheckPlugin.checkAge
 */
AgeCheck.checkAge = function(successCallback, errorCallback) {
    if (typeof successCallback !== 'function') {
        console.warn('AgeCheck.checkAge: successCallback is required');
        return;
    }
    if (typeof errorCallback !== 'function') {
        errorCallback = function(err) {
            console.error('AgeCheck error:', err);
        };
    }
    const platform = cordova.platformId;
    let serviceName = 'AgeCheck';
    let actionName = 'checkAge';
    if (platform === 'android') {
        serviceName = 'AgeSignalsPlugin';   // Use the actual service name from Android plugin
        actionName = 'checkAgeSignals';
    }
    // On iOS we keep serviceName = 'AgeCheck' and actionName = 'checkAge'
    exec(
        successCallback,
        errorCallback,
        serviceName,
        actionName,
        []
    );
};
/**
 * Check if age verification is supported on this platform.
 */
AgeCheck.isSupported = function(successCallback, errorCallback) {
    if (typeof successCallback !== 'function') return;

    const platform = cordova.platformId;

    if (platform === 'android') {
        successCallback(true);
    } else if (platform === 'ios') {
        exec(successCallback, errorCallback || function(){}, 'AgeCheck', 'isSupported', []);
    } else {
        successCallback(false);
    }
};
module.exports = AgeCheck;