$("#verificationPinBtn").on("click", async function () {

    const email = $("#emailAddress").val()?.trim();

    // Required validation
    if (!email) {

        cmdsppShowToast(
            "error",
            "Email address is required"
        );
        $("#emailAddress").addClass("cmdspp-field-error");

        return;
    }

    try {
        const $button = $(this);
        $button.prop("disabled", true);

        const flowUrl =  window.flowConfig.cmdspp_validateUserExists;
        const response = await fetch(flowUrl, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                transType:"validateuserEmail",
                email: email
            })

        });

        // let pay = {
        //     text:JSON.stringify({
        //         "transType":"validateuserEmail",
        //         "email": email
        //    })
        //    }
        // const response = await cmdsppExecutePowerPageFlow("/_api/cloudflow/v1.0/trigger/670ccffb-cd90-f111-8076-70a8a5b02d34",pay)
        $button.prop("disabled", false);

        const result = await response.json();

        if (result.exists) {

            console.log("Record Id:", result.recordId);
            sessionStorage.setItem("forgotPassword","true");

            // Navigate to verification page
            window.location.href = "/validate-pin?id="+result.recordId;

        } else {

            cmdsppShowToast(
                "error",
                "Invalid credentials"
            );

        }

    } catch (error) {

        console.error(error);

        cmdsppShowToast(
            "error",
            "An unexpected error occurred. Please try again."
        );

    }

});

$(document).on(
    "input",
    "#emailAddress",
    function () {
        $(this).removeClass("cmdspp-field-error");
    }
);