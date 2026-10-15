(function () {
    if (window.cmdsppCurrentRole === "Configuration Administrator") {
        window.location.replace("/form-config");
    }
})();

function cmdsppRenderNotifications() {

    const records = window.cmdsppInboxNotificationData || [];
    const count = window.cmdsppUnreadInboxCount

    if (count > 0) {
        const formattedCount = count.toString().padStart(2, "0");
        $("#cmdspp-bottom-card-title-count-span").text(`(${formattedCount})`);
    }

    const html = records.map(x => `

        <div class="cmdspp-notification-item cmdspp-notification-item-dashboard" data-threadid="${x.threadId}">
            <div class="cmdspp-notification-avatar">
                ${x.senderName.charAt(0)}
            </div>
            <div class="cmdspp-notification-content">
                <div class="cmdspp-notification-sender">
                    <div>${x.emailSubject}</div>
                    ${!x.readInd
            ? '<div class="cmdspp-notification-unread"></div>'
            : ''
        }
                </div>
                <div class="cmdspp-notification-subject">
                    ${x.emailBody}
                </div>
            </div>
            
        </div>
    `).join("");

    $("#cmdspp-inbox-activity-body").html(html + `
     <div class="cmdspp-notification-footer cmdspp-notification-footer-dashboard">
            <a href="/inbox">
                View all messages →
            </a>
      </div>
    `);
}


document.addEventListener("DOMContentLoaded", function () {

    if (window.cmdsppCurrentRole === "Configuration Administrator") {
        window.location.replace("/form-config");
        return;
    }

    const columns = [
        { field: "applicationId", label: "APPLICATION ID" },
        { field: "providerType", label: "PROVIDER TYPE" },
        { field: "status", label: "STATUS" },
        { field: "lastUpdated", label: "LAST UPDATED" },
        { field: "action", label: "ACTION" }
    ];


    function loadDashboard() {

        const summarySection = document.getElementById("cmdspp-application-summary");
        const enrollmentPage = document.querySelector(".cmdspp-enrollment-page");

        if (summarySection) {
            summarySection.style.display = "none";
        }

        if (enrollmentPage) {
            enrollmentPage.style.paddingTop = "0px";
        }

        return webapi.safeAjax({
            type: "GET",
            url:
                "/_api/cmdspp_p_idt_inf_dtls" +
                "?$select=_cmdspp_p_app_id_lkp_value,_cmdspp_p_pvd_typ_lkp_value" +
                "&$filter=_cmdspp_p_createdby_user_id_value eq " +
                window.cmdsppUserId,

            contentType: "application/json"
        })
.then(function (idtResponse) {

    const idtRecords = idtResponse.value || [];

    if (!idtRecords.length) {
        if (summarySection) {
            summarySection.style.display = "none";
        }
        return [];
    }

    const applicationIds = idtRecords
        .map(idt => idt["_cmdspp_p_app_id_lkp_value"])
        .filter(Boolean);

    if (!applicationIds.length) {
        return [];
    }

    const idFilter = applicationIds
        .map(id => "cmdspp_p_dtl_tbid eq " + id)
        .join(" or ");

    return webapi.safeAjax({
        type: "GET",
        url:
            "/_api/cmdspp_p_dtl_tbs" +
            "?$select=cmdspp_p_dtl_tbid,cmdspp_p_appln_status,cmdspp_p_pg_num,cmdspp_p_section_num,modifiedon,cmdspp_p_page_nam,_cmdspp_p_enrollment_id_value" +
            "&$filter=(" + idFilter + ") and cmdspp_p_appln_status ne 7" +
            "&$orderby=modifiedon desc",
        contentType: "application/json"
    }).then(function (pdtlResponse) {

        const pdtlMap = {};
        (pdtlResponse.value || []).forEach(function (row) {
            const key = row.cmdspp_p_dtl_tbid;
            if (!pdtlMap[key]) {
                pdtlMap[key] = row;
            }
        });

        return idtRecords.map(function (idt) {

            const applicationId = idt["_cmdspp_p_app_id_lkp_value"];
            const pdtl = pdtlMap[applicationId];

            return {
                applicationId:
                    idt["_cmdspp_p_app_id_lkp_value@OData.Community.Display.V1.FormattedValue"] ||
                    applicationId,
                recordId:
                    pdtl?.["cmdspp_p_dtl_tbid"],
                providerType: idt["_cmdspp_p_pvd_typ_lkp_value@OData.Community.Display.V1.FormattedValue"] || "",
                pageTitle:
                    pdtl?.["cmdspp_p_page_nam"],
                status:
                    pdtl?.["cmdspp_p_appln_status@OData.Community.Display.V1.FormattedValue"] || "",
                lastUpdated:
                    pdtl?.["modifiedon@OData.Community.Display.V1.FormattedValue"] || "",
                pageNumber:
                    pdtl?.["cmdspp_p_pg_num"] || "",
                sectionNumber:
                    pdtl?.["cmdspp_p_section_num"] || "",
                enrollmentId:
                    pdtl?.["_cmdspp_p_enrollment_id_value"]
            };
        });
    });
})
            .then(function (records) {
                records = (records || []).filter(function (record) {
                return record &&
                record.status &&
                record.status.toLowerCase() !== "cancelled";
                });
               records.sort(function (a, b) {
               return new Date(b.lastUpdated) - new Date(a.lastUpdated);
               });
                if (!records || !records.length) {
                    if (summarySection) {
                        summarySection.style.display = "none";
                    }
                    return;
                }

                if (summarySection) {
                    summarySection.style.display = "block";
                }

                CommonTableTemplate.render(columns, records);
            })
            .catch(function (error) {

             //   console.error("Dashboard Load Error:", error);

                if (summarySection) {
                    summarySection.style.display = "none";
                }

                cmdsppShowToast("error", "Unable to load applications");
            });
    }

//     CommonTableTemplate.onContinue = function (record) {

//     if (!record) return;

//     window.location.href =
//         "/Enrollment-PP/Enroll-Form/" +
//         "?id=" + encodeURIComponent(record.applicationId) +
//         "&record=" + encodeURIComponent(record.recordId) +
//         "&enrollmentId=" + encodeURIComponent(record.enrollmentId);
// };
CommonTableTemplate.onContinue = function (record) {

    if (!record) return;

    window.location.href =
        "/Enrollment-PP/" + record.pageTitle + "/" +
        "?id=" + encodeURIComponent(record.applicationId) +
        "&record=" + encodeURIComponent(record.recordId) +
        "&enrollmentId=" + encodeURIComponent(record.enrollmentId);
};
CommonTableTemplate.onView = function (record) {

    if (!record) return;

    window.location.href =
        "/Enrollment-PP/" + "Enroll-Form" + "/" +
        "?id=" + encodeURIComponent(record.applicationId) +
        "&record=" + encodeURIComponent(record.recordId) +
        "&enrollmentId=" + encodeURIComponent(record.enrollmentId);
};
CommonTableTemplate.onAWTSign = function (record) {

    if (!record) return;

    window.location.href =
        "/Enrollment-PP/" + "Attachments" + "/" +
        "?id=" + encodeURIComponent(record.applicationId) +
        "&record=" + encodeURIComponent(record.recordId) +
        "&enrollmentId=" + encodeURIComponent(record.enrollmentId);
}

    CommonTableTemplate.onCancel = function (applicationId,recId) {

        console.log("Cancel clicked", applicationId);

        if (!applicationId) return;

        openCmdsppModal({
            title: "Cancel Application",
            message: "Are you sure you want to cancel this application? This action cannot be undone.",
            primaryText: "Confirm",
            secondaryText: "Close",

            onConfirm: function () {

                cancelApplication(recId);

            }
        });
    };
    if (!window.loaderCounterInitialized) {
    window.loaderCounterInitialized = true;
    window.loaderCounter = 0;

    const originalShowLoader = window.showLoader;
    const originalHideLoader = window.hideLoader;

    window.showLoader = function (message) {
        window.loaderCounter++;

        if (window.loaderCounter === 1) {
            originalShowLoader(message);
        }
    };

    window.hideLoader = function () {
        window.loaderCounter--;

        if (window.loaderCounter <= 0) {
            window.loaderCounter = 0;
            originalHideLoader();
        }
    };
}

   function cancelApplication(recordId) {

    console.log("Cancel Clicked", recordId);

    showLoader("");

    return webapi.safeAjax({
        type: "PATCH",
        url: "/_api/cmdspp_p_dtl_tbs(" + recordId + ")",
        contentType: "application/json",
        data: JSON.stringify({
            cmdspp_p_appln_status: 7
        })
    })
    .then(function () {
        return loadDashboard();
    })
    .then(function () {
        hideLoader();
        cmdsppShowToast("success", "Application cancelled successfully");
    })
    .catch(function (error) {
        hideLoader();
        cmdsppShowToast("error", "Unable to cancel application. Please try again.");
      //  console.error("Error cancelling application:", error);
    });
}
showLoader("");

loadDashboard()
    .then(function () {
        cmdsppRenderNotifications();
        hideLoader();
    })
    .catch(function (error) {
        console.error(error);
          cmdsppShowToast("error", "Please try again.");
        hideLoader();
    });

});