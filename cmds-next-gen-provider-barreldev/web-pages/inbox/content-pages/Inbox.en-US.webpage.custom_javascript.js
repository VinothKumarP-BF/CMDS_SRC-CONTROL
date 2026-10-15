/* ==========================================
   GLOBALS
========================================== */

let cmdsppThreadData = [];

window.cmdsppSelectedThreadId = null;


/* ==========================================
   LOAD INBOX
========================================== */

async function cmdsppLoadInbox(isSearch,searchstring) {

    try {

        
        //Uncomment once flow is ready
        showLoader(" ");
        $(".cmdspp-inbox-container").hide();

        const result =
            await cmdsppExecuteInboxAction(
                {
                    userId: window.cmdsppUserId,
                    transType: isSearch? "searchEmails" : "fetchThreads",
                    rowCount:5000,
                    searchString:searchstring
                }
            );

        cmdsppThreadData = []
        let res =  result.data || [];

        res.forEach((data)=>{
            data.senderName = data.senderName ? data.senderName : "System Admin"
            data.modifiedTime = cmdsppFormatInboxDate(data.modifiedTime)
            cmdsppThreadData.push(data)
        })

        if(res.length == 0){
            // $("#cmdspp-inbox-placeholder-heading").text = "No messages found in your Secure Inbox."
            document.getElementById("cmdspp-inbox-placeholder-heading").textContent ="No messages found in your Secure Inbox";
            document.getElementById("cmdspp-inbox-placeholder-subheading").textContent ="";

            // $("#cmdspp-inbox-placeholder-subheading").hide();
        }
        $(".cmdspp-inbox-container").show();
        hideLoader();
        window.originalInboxData = cmdsppThreadData;

        cmdsppRenderThreads(
            cmdsppThreadData
        );

    }
    catch (error) {

        console.error(
            "Inbox load failed",
            error
        );
        hideLoader();

    }

}


/* ==========================================
   RENDER THREADS
========================================== */

function cmdsppRenderThreads(data) {

    let html = "";

    data.forEach(thread => {

        html += `
            <div class="cmdspp-thread-item ${!thread.readInd ? 'cmdspp-thread-item-unread' : ''}"
                 data-threadid="${thread.threadId}">

                <div class="cmdspp-avatar">
                    ${thread.senderName.charAt(0)}
                </div>

                <div class="cmdspp-thread-content">

                    <div class="cmdspp-thread-name">
                        ${thread.senderName}
                    </div>

                    <div class="cmdspp-thread-subject">
                        ${thread.emailSubject}
                    </div>

                    <div class="cmdspp-thread-preview">
                        ${thread.emailBody}
                    </div>

                    <div class="cmdspp-thread-bottom">
                         <div class="cmdspp-thread-messageType">
                           ${thread.messageType}
                        </div>

                        <div class="cmdspp-thread-time">
                           ${thread.modifiedTime}
                        </div>
                    </div>

                </div>

            </div>
        `;
    });

    $("#cmdspp-thread-list")
        .html(html);

}

function cmdsppSearchInbox(searchText) {

    const search =
        searchText.trim().toLowerCase();

    if (!search) {
        return window.originalInboxData;
    }

    return window.originalInboxData.filter(item => {

        const senderEmail =
            (item.senderEmail || "")
                .toLowerCase();

        const emailSubject =
            (item.emailSubject || "")
                .toLowerCase();

        const emailBody =
            (item.emailBody || "")
                .toLowerCase();

        return (
            senderEmail.includes(search) ||
            emailSubject.includes(search) ||
            emailBody.includes(search)
        );

    });

}


/* ==========================================
   OPEN THREAD
========================================== */

async function cmdsppOpenThread(threadId) {

    window.cmdsppSelectedThreadId =
        threadId;


    const result =
        await cmdsppExecuteInboxAction(
            {
                threadId: threadId,
                transType: "fetchThreadDetail"
            }
        );

    const messages = result.data || [];


    const thread =
        cmdsppThreadData.find(
            x => x.threadId == threadId
        );

    let attachmentHtml = "";

    // thread.attachments.forEach(att => {

    //     attachmentHtml += `
    //         <div class="cmdspp-attachment">

    //             <div class="cmdspp-attachment-name">
    //                 ${att.name}
    //             </div>

    //             <div class="cmdspp-attachment-size">
    //                 ${att.size}
    //             </div>

    //         </div>
    //     `;
    // });

    const messagesHtml = messages.map(message => `

    <div class="cmdspp-message-card">

        <div class="cmdspp-message-subject">
            ${message.emailSubject}
        </div>

        <div class="cmdspp-message-meta">

            <div class="cmdspp-avatar">
                ${message.senderFirstName ? message.senderFirstName.charAt(0) : "S"}
            </div>

            <div>

                <div class="cmdspp-thread-name">
                    ${message.senderFirstName ? message.senderFirstName +' ' +senderLastName : 'System Admin'}
                </div>

                <div class="cmdspp-thread-preview">
                    ${message.senderEmail}
                </div>

            </div>

        </div>

        <div class="cmdspp-message-info">

            <span>
                <img src="/cmdspp_EmailNormal"/>${thread.messageType}
            </span>

            <span>•</span>

            <span>
                <img src="/cmdspp_ProviderTypeIcon"/>${message.providerType}
            </span>

            <span>•</span>

            <span>
                ${cmdsppFormatInboxDate(message.createdTime,true)}
            </span>

        </div>

        <div class="cmdspp-message-body">${message.emailBody}</div>


    </div>

`).join('');

    $("#cmdspp-message-view").html(`
        ${messagesHtml}
    `);

    $(".cmdspp-thread-item")
        .removeClass("active");

    $(
        `.cmdspp-thread-item[data-threadid="${threadId}"]`
    ).addClass("active");

}


/* ==========================================
   SHOW REPLY PANEL
========================================== */

function cmdsppShowReplyPanel() {

    const thread =
        cmdsppThreadData.find(
            x =>
            x.threadId ==
            window.cmdsppSelectedThreadId
        );

    if (!thread) {
        return;
    }

    $("#cmdspp-reply-container")
        .html(`

        <div class="cmdspp-reply-box">

            <div class="cmdspp-reply-header">

                <div>
                    ↩ Reply to
                    <strong>
                        ${thread.senderName}
                    </strong>
                    &lt;${thread.senderEmail}&gt;
                </div>

                <button
                    id="cmdspp-close-reply"
                    type="button">

                    ✕

                </button>

            </div>

            <textarea
                id="cmdspp-reply-text"
                class="cmdspp-reply-text"
                placeholder="Write your reply..."></textarea>

            <div class="cmdspp-reply-footer">

                <button
                    id="cmdspp-send-reply"
                    class="cmdspp-send-btn">

                    Send

                </button>

                <button
                    id="cmdspp-attach-document"
                    class="cmdspp-attach-btn">

                    Attach Document

                </button>

            </div>

        </div>

    `);

}


/* ==========================================
   SEND REPLY
========================================== */

async function cmdsppSendReply() {

    const reply =
        $("#cmdspp-reply-text")
            .val()
            .trim();

    if (!reply) {

        alert(
            "Please enter a reply."
        );

        return;
    }

    try {

        await cmdsppExecuteInboxAction(
            "REPLY",
            {
                threadId:
                    window.cmdsppSelectedThreadId,

                message:
                    reply
            }
        );

        $("#cmdspp-reply-container")
            .empty();

        alert(
            "Reply sent successfully."
        );

    }
    catch (error) {

        console.error(
            error
        );

        alert(
            "Unable to send reply."
        );
    }

}


/* ==========================================
   MARK READ
========================================== */

async function cmdsppMarkRead() {

    await cmdsppExecuteInboxAction({
                threadId: window.cmdsppSelectedThreadId,
                transType: "markThreadAsRead"
            });
    window.location.reload();       

}


/* ==========================================
   DELETE THREAD
========================================== */

async function cmdsppDeleteThread() {

    await cmdsppExecuteInboxAction({
                threadId: window.cmdsppSelectedThreadId,
                transType: "deleteThread"
            });

    window.location.reload();        

}


/* ==========================================
   EVENTS
========================================== */

$(document)

    .on(
        "click",
        ".cmdspp-thread-item",
        function () {

            const threadId =
                $(this)
                    .data("threadid");

            cmdsppOpenThread(
                threadId
            );

        }
    )

    .on(
        "click",
        "#cmdspp-inline-reply-btn",
        function () {

            cmdsppShowReplyPanel();

        }
    )

    .on(
        "click",
        "#cmdspp-btn-reply",
        function () {

            cmdsppShowReplyPanel();

        }
    )

    .on(
        "click",
        "#cmdspp-send-reply",
        function () {

            cmdsppSendReply();

        }
    )

    .on(
        "click",
        "#cmdspp-close-reply",
        function () {

            $("#cmdspp-reply-container")
                .empty();

        }
    );


$("#cmdspp-btn-markread").on(
    "click",
    function () {

        cmdsppMarkRead();

    }
);


$("#cmdspp-btn-delete").on(
    "click",
    function () {

        cmdsppDeleteThread();

    }
);


/* ==========================================
   SEARCH
========================================== */

$("#cmdspp-search").on(
    "keyup",
    function () {

        const search =
            $(this)
                .val()
                .toLowerCase();

        // if(search.length >=3){
        //     // cmdsppLoadInbox(true,search)
        // }
        const filteredData =cmdsppSearchInbox(search);
        cmdsppRenderThreads(filteredData);
        

    }
);


/* ==========================================
   INIT
========================================== */

$(document).ready(function () {

    cmdsppLoadInbox();

});