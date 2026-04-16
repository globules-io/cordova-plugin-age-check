# cordova-plugin-age-check

Unified cross-platform age verification plugin for Cordova.
This plugin acts as a **thin wrapper** that provides a consistent API for age verification on both Android and iOS.

## Features

- Single unified API: `AgeCheck.checkAge()`
- On **Android**: Uses [Google Play Age Signals API](https://github.com/globules-io/cordova-plugin-google-play-age)
- On **iOS**: Uses [Apple Declared Age Range API](https://github.com/globules-io/cordova-plugin-apple-age-check)
- Normalized `userStatus` values across platforms
- Simple and lightweight

## Installation

```bash
cordova plugin add @globules-io/cordova-plugin-age-check
cordova plugin rm @globules-io/cordova-plugin-age-check
```
## Supported Platforms

Android (35+)
iOS (26+)

## JS API
```bash
AgeCheck.checkAge(
    function(result) {
        console.log("Age Check Result:", result);
        
        switch (result.userStatus) {
            case "VERIFIED":
            case "DECLARED":
                // Full access
                break;
            case "DECLINED":
            case "SUPERVISED_APPROVAL_DENIED":
                // Restricted mode
                break;
            default:
                // Unknown or fallback
        }
    },
    function(error) {
        console.error("Age check failed:", error);
    }
);

AgeCheck.isSupported(function(supported) {
    console.log("AgeCheck supported:", supported);
});
```
