import Cordova
import DeclaredAgeRange  // This will only compile on iOS 26+ with the entitlement

@objc(AgeCheckPlugin) class AgeCheckPlugin: CDVPlugin {

    @objc(checkAge:)
    func checkAge(command: CDVInvokedUrlCommand) {
        Task {
            do {
                // Request age gate at 18+ (adjust as needed, or pass from JS later)
                let response = try await AgeRangeService.shared.requestAgeRange(ageGates: 18)

                var result: [String: Any] = [:]

                switch response {
                case .sharing(let ageRange):
                    result["userStatus"] = "sharing"
                    result["ageLower"] = ageRange.lowerBound ?? NSNull()
                    result["ageUpper"] = ageRange.upperBound ?? NSNull()
                    result["mostRecentApprovalDate"] = NSNull()  // Not available on iOS
                    result["installId"] = NSNull()               // Not available on iOS

                case .declinedSharing:
                    result["userStatus"] = "declined"
                }

                let pluginResult = CDVPluginResult(status: .ok, messageAs: result)
                self.commandDelegate.send(pluginResult, callbackId: command.callbackId)

            } catch {
                let pluginResult = CDVPluginResult(status: .error, messageAs: "Error: \(error.localizedDescription)")
                self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
            }
        }
    }

    @objc(isSupported:)
    func isSupported(command: CDVInvokedUrlCommand) {
        let supported = AgeRangeService.isSupported
        let pluginResult = CDVPluginResult(status: .ok, messageAs: supported ? 1 : 0)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }
}