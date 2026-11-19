# cordova-plugin-age-check

One Cordova call to ask whether the person meets an age your app requires.

On Android this uses [@globules-io/cordova-plugin-google-play-age](https://github.com/globules-io/cordova-plugin-google-play-age) (Play Age Signals `0.0.4`). On iOS it uses [@globules-io/cordova-plugin-apple-age-check](https://github.com/globules-io/cordova-plugin-apple-age-check) (Declared Age Range). Those plugins stay separate. This one only answers the age question.

### Add the plugin

> cordova plugin add @globules-io/cordova-plugin-age-check

Installing it also installs the Android and iOS plugins.

### Remove the plugin

> cordova plugin rm @globules-io/cordova-plugin-age-check

### Usage

```javascript
AgeCheck.checkAge(16, function(result) {
    if (result.allowed === true) {
        // The whole reported band is 16 or older.
        return;
    }
    if (result.allowed === false) {
        // The whole reported band is under 16.
        return;
    }

    // allowed is null. result.reason says why there is no yes or no.
    console.log(result.reason, result.ageLower, result.ageUpper);
}, function(error) {
    console.error(error.code, error.message);
});

AgeCheck.isSupported(function(supported) {
    console.log(supported);
});
```

`minimumAge` is a whole number of 1 or more.

## Result

| Field | Values |
| --- | --- |
| `allowed` | `true`, `false`, or `null` |
| `reason` | Why `allowed` has that value |
| `ageLower` | Inclusive lower bound of the band, or `null` |
| `ageUpper` | Inclusive upper bound of the band, or `null` for an open top band |

| `reason` | `allowed` | Meaning |
| --- | --- | --- |
| `meets_age` | `true` | The band starts at or above `minimumAge`. |
| `below_age` | `false` | The band ends below `minimumAge`. On iOS, a missing lower bound also means the person is under the requested age. |
| `not_shared` | `null` | The person or parent did not share an age. |
| `verification_required` | `null` | Android only. Play requires the user to resolve their age in the Play Store before it will share a band. |
| `band_overlap` | `null` | The band includes ages both under and over `minimumAge`. |
| `unavailable` | `null` | The store returned a share without a usable band. |

A store failure, such as no network or an outdated Play Store, is passed to the error callback. Declining to share is a result, with `allowed: null`.

Play does not take an age at call time. It returns its own bands. The defaults are `0–12`, `13–15`, `16–17`, and `18+`. A required age of 16 lines up with those bands. A required age of 14 does not: the `13–15` band comes back as `band_overlap`. Set custom age ranges in Play Console when the app's age is not one of Play's boundaries. An `18+` band also overlaps a required age above 18, such as 21.

iOS cuts the band at `minimumAge`. `ageLower` is `null` when the person is under that age, and `ageUpper` is `null` when they are at or above it. In a regulated region Apple can still return a different band. That band is compared the same way.

`allowed` does not look at how the age was checked, or at parental approval for a later app change. Those fields stay on the store plugins.
