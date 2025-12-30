package io.globules.agecheck;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;

import com.google.android.play.agesignals.AgeSignalsManager;
import com.google.android.play.agesignals.AgeSignalsManagerFactory;
import com.google.android.play.agesignals.AgeSignalsRequest;
import com.google.android.play.agesignals.AgeSignalsException;

public class AgeCheckPlugin extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("checkAge".equals(action)) {
            checkAge(callbackContext);
            return true;
        }
        if ("isSupported".equals(action)) {
            // Google Play Age Signals is supported on all devices with Google Play Services
            callbackContext.success(1); // true
            return true;
        }
        return false;
    }

    private void checkAge(CallbackContext callbackContext) {
        Context context = cordova.getActivity().getApplicationContext();
        AgeSignalsManager manager = AgeSignalsManagerFactory.create(context);

        manager.checkAgeSignals(AgeSignalsRequest.builder().build())
            .addOnSuccessListener(result -> {
                JSONObject response = new JSONObject();
                try {
                    response.put("userStatus", result.userStatus() != null ? result.userStatus().toString() : null);
                    response.put("ageLower", result.ageLower());
                    response.put("ageUpper", result.ageUpper());
                    response.put("mostRecentApprovalDate", result.mostRecentApprovalDate());
                    response.put("installId", result.installId());

                    callbackContext.success(response);
                } catch (JSONException e) {
                    callbackContext.error("JSON error: " + e.getMessage());
                }
            })
            .addOnFailureListener(throwable -> {
                int errorCode = extractErrorCode(throwable);
                callbackContext.error(String.valueOf(errorCode));
            });
    }

    private int extractErrorCode(Throwable throwable) {
        if (throwable instanceof AgeSignalsException) {
            return ((AgeSignalsException) throwable).getErrorCode();
        }
        return -100;
    }
}