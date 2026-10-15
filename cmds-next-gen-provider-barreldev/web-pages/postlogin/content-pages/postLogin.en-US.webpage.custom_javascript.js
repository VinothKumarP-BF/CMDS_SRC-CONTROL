document.addEventListener("DOMContentLoaded", function () {
    document.body.style.visibility = "hidden";
    const forceLogout = sessionStorage.getItem("cmdsppForceLogout");

    if (forceLogout === "true") {

        sessionStorage.removeItem("cmdsppForceLogout");
        sessionStorage.removeItem('pp_login_contact_updated');

        let url = "/Account/Login/LogOff?returnUrl=/signin?returnUrl=/postLogin";
        cmdsppNavigateWithToast("success", "Password set successfully", url);

    } else {

       if (window.cmdsppCurrentRole &&
           window.cmdsppCurrentRole.includes("Configuration Administrator")) {
           window.location.href = "/Form-Config/";
       } else {
           window.location.href = "/Dashboard";
       }
    }

});