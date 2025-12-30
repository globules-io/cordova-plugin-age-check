# cordova-plugin-age-check

A Cordova plugin for privacy-safe age verification on both Android and iOS.

- **Android**: Uses Google Play Age Signals API  
- **iOS**: Uses Apple Declared Age Range API (available on iOS 26 and later)

The plugin provides a unified JavaScript API that works today on Android and will automatically start working on iOS 26+ without any code changes.

## Installation

```bash
cordova plugin add @globules-io/cordova-plugin-age-check
cordova plugin rm @globules-io/cordova-plugin-age-check
```
## Supported Platforms

Android (35+)
iOS (graceful fallback on iOS < 26, full support on iOS 26+)

## JS API
```bash
AgeCheckPlugin.isSupported(function(supported) {
    if (supported) {
        console.log("Native age verification is available");
    } else {
        console.log("Native age verification not supported – use fallback");
    }
}, function(error) {
    console.error("Error checking support:", error);
});

AgeCheckPlugin.checkAge(function(result) {
    console.log("Age verification result:", result);
    // Example result on Android:
    // {
    //   userStatus: "VERIFIED_AGE_RANGE",
    //   ageLower: 18,
    //   ageUpper: null,
    //   mostRecentApprovalDate: 1735603200000,
    //   installId: "abc123..."
    // }
    //
    // Example result on iOS 26+ (18+ gate):
    // {
    //   userStatus: "sharing",
    //   ageLower: 18,
    //   ageUpper: null,
    //   mostRecentApprovalDate: null,
    //   installId: null
    // }
}, function(error) {
    console.error("Age verification failed or declined:", error);
});
```
