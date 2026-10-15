async function callPowerAutomatePinFlow(payload) {

    // const flowUrl = "https://68800e766659e6b2b28f47b46ad295.0f.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/23/workflows/5fec314660994d8188e4a3ffb4054ae1/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=uxn0GLnUIv74eO0B37L9aLI3LSZfaeBykWMV3sJqrC4";
    const flowUrl = window.flowConfig.cmdspp_createValidatePinForUser;

    try {

        const response = await fetch(flowUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();

        console.log("Flow Response:", result);

        return result;

    } catch (error) {

        console.error("Flow Call Failed:", error);

        throw error;
    }
}
document.addEventListener("DOMContentLoaded", async function () {

    const params = new URLSearchParams(window.location.search);

    const contactId = params.get("id");

    if (!contactId) {

        alert("Contact Id not found.");
        return;
    }

    const forgotPass = sessionStorage.getItem("forgotPassword");

    const res = await callPowerAutomatePinFlow({
            registrationId: contactId,
            transType:"set",
            isReset:forgotPass === "true" ? true :false
        })
        
    sessionStorage.removeItem("forgotPassword");

});

$(document).on(
    "click",
    "#cmdspp-validatepage-verifyCode-id",
    async function () {

        const pinInputs = document.querySelectorAll(
            ".cmdspp-validatepage-pin-input"
        );

        let pin = "";
        let hasEmptyField = false;

        pinInputs.forEach(input => {

            const value = input.value.trim();
            
           if (!value) {
             hasEmptyField = true;
             input.classList.add("cmdspp-field-error");
           } else {
             input.classList.remove("cmdspp-field-error");
           }

            pin += value;
        });

        if (hasEmptyField) {
            
          cmdsppShowToast("error","Verification code is required");

            // alert("Please enter all 6 digits.");
            return;
        }

        const params = new URLSearchParams(window.location.search);

        const id = params.get("id");

        const $button = $(this);
        $button.prop("disabled", true);

        let result = await callPowerAutomatePinFlow({
            pin: pin,
            registrationId:id,
            transType:"validate"
        });

        $button.prop("disabled", false);
        // Handle the response from the Power Automate flow
        if (result && typeof result.success !== 'undefined') {
            if (result.success === true) {
                var invitationCode = result.invitationCode;
                if (invitationCode) {
                    // Navigate to the native set password page
                    let url = '/Account/Register?invitation=' + invitationCode;
                    cmdsppNavigateWithToast("success","PIN verified successfully",url);
                } else {
                    cmdsppShowToast("error",'Invitation code is missing. Please contact support.');

                }
            } else {
                // Show error message from result or a generic error
                var errorMsg = result.message || 'Invalid PIN. Please try again.';
                cmdsppShowToast("error",errorMsg);
            }
        } else {
            // Handle unexpected response
            cmdsppShowToast("error",'Unexpected response from server. Please try again later.');
        }
    }
);

$(document).on(
    "input",
    ".cmdspp-validatepage-pin-input",
    function () {
        $(this).removeClass("cmdspp-field-error");
        const currentInput = $(this);

        // Keep only one digit
        currentInput.val(
            currentInput.val().replace(/\D/g, "").slice(0, 1)
        );

        // Move to next box if a digit was entered
        if (currentInput.val()) {

            currentInput
                .next(".cmdspp-validatepage-pin-input")
                .focus();

        }

    }
);

$(document).on(
    "click",
    "#cmdspp-validatepage-resendCode-id",
    async function () {

        const pinInputs = document.querySelectorAll(
            ".cmdspp-validatepage-pin-input"
        );

        pinInputs.forEach(input => {

            input.value = "";
            
        });

        const params = new URLSearchParams(window.location.search);

        const id = params.get("id");

        const $button = $(this);
        $button.prop("disabled", true);

        let result = await callPowerAutomatePinFlow({
            registrationId:id,
            transType:"set",
            isReset:true
        });

        $button.prop("disabled", false);

        if(result){
            if(result.message==="PIN sent"){
                cmdsppShowToast("success","PIN sent successfully");
            }
        }
    }
);