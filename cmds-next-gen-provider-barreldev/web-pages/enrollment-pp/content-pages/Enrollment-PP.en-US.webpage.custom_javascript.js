(function () {
    if (window.cmdsppCurrentRole === "Configuration Administrator") {
      window.location.replace("/form-config"); // <-- swap in the real form config page URL/slug
    }
  })();