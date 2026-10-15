$(document).ready(function () {
    var logicalName = "cr834_poc_enroll_id_lkp";

    function hideLookupField() {
        $('[data-logical-name="' + logicalName + '"]')
            .closest("tr")
            .hide();
    }

    const params = new URLSearchParams(window.location.search);
    const recordId = params.get("record");
    const displayId = params.get("id");

    if(recordId){
        const $idInput = $("#" + logicalName);
const $nameInput = $("#" + logicalName + "_name");
 
console.log("GUID input:", $idInput.length);
console.log("Name input:", $nameInput.length);
        // Remove braces and normalize the GUID
        const cleanId = recordId.replace(/[{}]/g, "");

        $("#" + logicalName).val(cleanId).trigger("change");
        $nameInput.val(displayId).trigger("change");

        console.log("GUID input:", $idInput.val());
console.log("Name input:", $nameInput.val());
    }

    hideLookupField();
});