var exec = require('cordova/exec');

var AgeCheck = {};

/**
 * Ask whether the person meets minimumAge.
 *
 * Android reads the Play age band. iOS asks Declared Age Range with that
 * age as the only gate. allowed is null when the store did not share a
 * band, or the band crosses minimumAge.
 *
 * Result:
 * {
 *   allowed: true | false | null,
 *   reason: "meets_age" | "below_age" | "not_shared" |
 *           "verification_required" | "band_overlap" | "unavailable",
 *   ageLower: number | null,
 *   ageUpper: number | null
 * }
 */
AgeCheck.checkAge = function(minimumAge, successCallback, errorCallback) {
    if (typeof successCallback !== 'function') {
        console.warn('AgeCheck.checkAge: successCallback is required');
        return;
    }
    if (typeof errorCallback !== 'function') {
        errorCallback = function(err) {
            console.error('AgeCheck error:', err);
        };
    }
    if (!isAge(minimumAge)) {
        errorCallback({
            code: 'INVALID_AGE',
            message: 'minimumAge must be a whole number of 1 or more.'
        });
        return;
    }

    var platform = cordova.platformId;
    if (platform === 'android') {
        exec(function(result) {
            successCallback(fromAndroid(minimumAge, result));
        }, errorCallback, 'AgeSignalsPlugin', 'checkAgeSignals', []);
        return;
    }
    if (platform === 'ios') {
        exec(function(result) {
            successCallback(fromApple(minimumAge, result));
        }, errorCallback, 'AgeCheck', 'checkAge', [[minimumAge]]);
        return;
    }

    errorCallback({
        code: 'UNSUPPORTED',
        message: 'Age check is available on Android and iOS.'
    });
};

/**
 * True on Android. On iOS, true when the device is on iOS 26 or later.
 */
AgeCheck.isSupported = function(successCallback, errorCallback) {
    if (typeof successCallback !== 'function') {
        return;
    }

    var platform = cordova.platformId;
    if (platform === 'android') {
        successCallback(true);
    } else if (platform === 'ios') {
        exec(successCallback, errorCallback || function() {}, 'AgeCheck', 'isSupported', []);
    } else {
        successCallback(false);
    }
};

function isAge(value) {
    return typeof value === 'number' && Number.isInteger(value) && value >= 1;
}

function bound(value) {
    return typeof value === 'number' && Number.isInteger(value) ? value : null;
}

function outcome(allowed, reason, ageLower, ageUpper) {
    return {
        allowed: allowed,
        reason: reason,
        ageLower: ageLower,
        ageUpper: ageUpper
    };
}

/**
 * Compare an inclusive band with minimumAge.
 * nilLowerMeansBelow is Apple's rule: a missing lower bound means the
 * person is under the gate that was requested.
 */
function compareBand(minimumAge, ageLower, ageUpper, nilLowerMeansBelow) {
    if (ageLower !== null && ageLower >= minimumAge) {
        return outcome(true, 'meets_age', ageLower, ageUpper);
    }
    if (nilLowerMeansBelow && ageLower === null) {
        return outcome(false, 'below_age', null, ageUpper);
    }
    if (ageUpper !== null && ageUpper < minimumAge) {
        return outcome(false, 'below_age', ageLower, ageUpper);
    }
    if (ageLower === null && ageUpper === null) {
        return outcome(null, 'unavailable', null, null);
    }
    return outcome(null, 'band_overlap', ageLower, ageUpper);
}

function fromAndroid(minimumAge, result) {
    var status = result && result.ageSignalsStatus;
    if (status === 'VERIFICATION_REQUIRED') {
        return outcome(null, 'verification_required', null, null);
    }
    if (status === 'NOT_SHARED' || status === 'UNSPECIFIED') {
        return outcome(null, 'not_shared', null, null);
    }
    if (status !== 'SHARED') {
        return outcome(null, 'unavailable', null, null);
    }
    return compareBand(minimumAge, bound(result.ageLower), bound(result.ageUpper), false);
}

function fromApple(minimumAge, result) {
    var status = result && result.sharingStatus;
    if (status === 'DECLINED') {
        return outcome(null, 'not_shared', null, null);
    }
    if (status !== 'SHARING') {
        return outcome(null, 'unavailable', null, null);
    }
    return compareBand(minimumAge, bound(result.ageLower), bound(result.ageUpper), true);
}

AgeCheck._fromAndroid = fromAndroid;
AgeCheck._fromApple = fromApple;

module.exports = AgeCheck;
