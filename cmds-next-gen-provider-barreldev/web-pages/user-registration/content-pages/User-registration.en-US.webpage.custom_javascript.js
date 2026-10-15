$(window).on('load', function () {

    $("input[type='text'], input[type='email'], textarea")
        .attr("placeholder", "Enter Text");

    $("#cmdspp_g_phn_num")
        .attr("placeholder", "Enter Number");

    $("input[type='text'], input[type='email'], textarea")
        .attr("title", "");

});

// Clear error state / re-enable submit as the user edits any field
$(document).on(
    "input",
    "input, textarea",
    function () {
        $(this).removeClass("cmdspp-field-error");
        document.getElementById("cmdsppSubmitBtn").disabled = false;
    }
);

$("#termsCheckbox").on("change", function () {
    $(this).removeClass("cmdspp-field-error");
    document.getElementById("cmdsppSubmitBtn").disabled = false;
});

function showValidationError(field, message) {
    $(field).addClass("cmdspp-field-error");
    cmdsppShowToast("error", message);
    return false;
}

function validateRegistrationForm() {

    const firstName = $("#cmdspp_g_fst_nam");
    const lastName = $("#cmdspp_g_lst_nam");
    const email = $("#cmdspp_g_email");
    const phone = $("#cmdspp_g_phn_num");
    const organization = $("#cmdspp_g_org_nam");

    const nameRegex = /^[A-Za-z0-9\s'-]+$/;
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    if (!firstName.val().trim()) {
        return showValidationError(firstName[0], "First name is required");
    }
    if (!nameRegex.test(firstName.val().trim())) {
        return showValidationError(firstName[0], "First name contains invalid characters");
    }

    if (!lastName.val().trim()) {
        return showValidationError(lastName[0], "Last name is required");
    }
    if (!nameRegex.test(lastName.val().trim())) {
        return showValidationError(lastName[0], "Last name contains invalid characters");
    }

    if (!email.val().trim()) {
        return showValidationError(email[0], "Email address is required");
    }
    if (!emailRegex.test(email.val().trim())) {
        return showValidationError(email[0], "Enter a valid email address");
    }

    if (!phone.val().trim()) {
        return showValidationError(phone[0], "Phone number is required");
    }
    if (!phoneRegex.test(phone.val().trim())) {
        return showValidationError(phone[0], "Not a valid phone number");
    }

    if (organization.val().trim() && !nameRegex.test(organization.val().trim())) {
        return showValidationError(organization[0], "Organization Name contains invalid characters");
    }

    if (!$("#termsCheckbox").is(":checked")) {
        return showValidationError($("#termsCheckbox")[0], "Please accept the Terms and Conditions");
    }

    return true;
}

// Auto-format phone number as ###-###-####
$("#cmdspp_g_phn_num").on("input", function () {

    let value = $(this).val().replace(/\D/g, "");
    value = value.substring(0, 10);

    if (value.length > 6) {
        value = value.substring(0, 3) + "-" + value.substring(3, 6) + "-" + value.substring(6);
    } else if (value.length > 3) {
        value = value.substring(0, 3) + "-" + value.substring(3);
    }

    $(this).val(value);
});

// Build the payload sent to the Power Automate flow.
// Adjust the property names on the left to match what your flow (and the
// Dataverse "Add a new row" action inside it) expects.
function buildRegistrationPayload() {
    return {
        firstName: $("#cmdspp_g_fst_nam").val().trim(),
        lastName: $("#cmdspp_g_lst_nam").val().trim(),
        email: $("#cmdspp_g_email").val().trim(),
        phoneNumber: $("#cmdspp_g_phn_num").val().trim(),
        organizationName: $("#cmdspp_g_org_nam").val().trim(),
        termsAccepted: $("#termsCheckbox").is(":checked"),
        transType:"registerUser2"
    };
}

function submitRegistrationToFlow() {

    const $submitBtn = $("#cmdsppSubmitBtn");
    $submitBtn.prop("disabled", true);

    fetch(window.flowConfig.cmdspp_validateUserExists, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRegistrationPayload())
    })
        .then(function (response) {
            return response.json().catch(function () { return {}; }).then(function (data) {
                return { ok: response.ok, data: data };
            });
        })
        .then(function (result) {
            console.log("res",result.data)
            if (result.ok && (!result.data || result.data.success !== false)) {
                // cmdsppShowToast("success", "Registration submitted successfully.");
                window.location.href = "/validate-pin?id="+result.data.recordId;
                return;
            }

            // Expecting the flow to return something like:
            // { success: false, error: "DuplicateEmail" | "DuplicatePhone" | "GenericError" }
            const errorCode = result.data && result.data.error;

            if (errorCode === "DuplicateEmail") {
                cmdsppShowToast("error", "An account with the entered email address already exists");
                $("#cmdspp_g_email").addClass("cmdspp-field-error");
            } else if (errorCode === "DuplicatePhone") {
                cmdsppShowToast("error", "Phone Number is already used.");
                $("#cmdspp_g_phn_num").addClass("cmdspp-field-error");
            } else {
                cmdsppShowToast("error", "Something went wrong while submitting your registration. Please try again.");
            }

            $submitBtn.prop("disabled", false);
        })
        .catch(function () {
            cmdsppShowToast("error", "Unable to reach the server. Please check your connection and try again.");
            $submitBtn.prop("disabled", false);
        })
        .finally(function () {
            $submitBtn.text("Submit");
        });
}

$(document).ready(function () {

    $("#cmdsppSubmitBtn").on("click", function () {
        if (validateRegistrationForm()) {
            submitRegistrationToFlow();
        }
    });

    $("#cmdsppCancelBtn").on("click", function () {
        window.location.href = "/";
    });

});