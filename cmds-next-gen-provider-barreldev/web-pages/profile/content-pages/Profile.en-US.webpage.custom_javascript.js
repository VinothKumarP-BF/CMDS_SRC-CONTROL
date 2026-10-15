$(window).on('load', function () {
    // document.documentElement.style.visibility = "hidden";
    document.body.style.visibility = "hidden";


    const forceLogout = sessionStorage.getItem("cmdsppForceLogout");
    const currentRole = window.cmdsppCurrentRole || "";

    console.log("forceLog", forceLogout);

    if (forceLogout === "true") {

        sessionStorage.removeItem("cmdsppForceLogout");
        sessionStorage.removeItem('pp_login_contact_updated');

        let url = "/Account/Login/LogOff?returnUrl=/signin";
        cmdsppNavigateWithToast("success", "Password set successfully", url);

    } else {
        if (currentRole.indexOf("Organization Administrator") !== -1) {
            window.location.href = "/dashboard";
        } else if (currentRole.indexOf("Configuration Administrator") !== -1) {
            window.location.href = "/Form-Config/";
        } else {
            window.location.href = "/dashboard"; // fallback default
        }
    }

});