(function () {
    if (window.cmdsppCurrentRole != "Configuration Administrator") {
        window.location.replace("/Dashboard");
    }
})();

document.addEventListener("DOMContentLoaded", function () {

    var cmdsppRaw = {{ settings["cmdspp_ENV_Automate_Flow_Url_2"] | json }};

    var cmdsppUrls = typeof cmdsppRaw === "string" ? JSON.parse(cmdsppRaw) : cmdsppRaw;
    window.cmdsppConfig = {
        ConfigAduitApiUrl: cmdsppUrls?.cmdspp_fetch_configAudits
    };

    const flowUrl = window.cmdsppConfig.ConfigAduitApiUrl;

    const PAGE_SIZE = 25;
    let searchTimeout = null;

    let allAccumulatedRecords = [];
    let localPageIndex = 1;
    let serverNextLink = null;
    let storedTotalCount = 0;

    const auditColumns = [
        { field: "operationType", label: "OPERATION TYPE" },
        { field: "modifiedBy", label: "MODIFIED BY" },
        { field: "modifiedDate", label: "MODIFIED DATE" },
        { field: "fieldName", label: "FIELD NAME" },
        { field: "oldValue", label: "OLD VALUE" },
        { field: "newValue", label: "NEW VALUE" }
    ];

    // ---------------------------------------------------------------
    // DISPLAY: Dataverse gives UTC ISO strings. Non-UTC getters convert
    // automatically to the browser's (system) local timezone.
    // ---------------------------------------------------------------
    function formatDateOnly(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;

    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
}

    // Strip the milliseconds Date#toISOString() adds, e.g.
    // "2026-08-05T18:30:00.000Z" -> "2026-08-05T18:30:00Z"
    function toCleanIso(dateObj) {
        return dateObj.toISOString().replace(/\.\d{3}Z$/, 'Z');
    }

    // ---------------------------------------------------------------
    // SEARCH: the user types local date/time (that's what's displayed).
    // A local CALENDAR DAY does not map to a single UTC calendar date
    // (e.g. IST midnight Aug 6 = UTC 18:30 Aug 5), so instead of trying
    // to reformat a date string, compute the actual UTC start/end
    // INSTANT of the user's local range and send both boundaries.
    // Plain text (names, field names, values) passes through untouched.
    // ---------------------------------------------------------------
    function buildSearchPayload(rawValue) {
        const trimmed = (rawValue || "").trim();
        if (!trimmed) {
            return { searchTerm: "" };
        }

        const firstToken = trimmed.split(' ')[0];
        const segments = firstToken.split('/');
        const looksLikeDate = segments.length === 3 && /^[0-9]/.test(firstToken);

        if (!looksLikeDate) {
            return { searchTerm: trimmed }; // plain text search
        }

        const [mStr, dStr, yStr] = segments;
        const m = Number(mStr), d = Number(dStr), y = Number(yStr);
        if (!m || !d || !y) {
            return { searchTerm: trimmed }; // not actually numeric -> treat as text
        }

        const rest = trimmed.slice(firstToken.length).trim(); // e.g. "11:52 AM" or ""
        let startLocal, endLocal;

        if (rest) {
            // Parse time, correctly handling optional AM/PM
            const ampmMatch = rest.match(/\b(AM|PM)\b/i);
            const ampm = ampmMatch ? ampmMatch[1].toUpperCase() : null;
            const timeOnly = rest.replace(/\s*(AM|PM)\s*/i, '').trim();
            const [hStr, minStr] = timeOnly.split(':');
            let hh = Number(hStr);
            const mm = Number(minStr) || 0;
            if (isNaN(hh)) return { searchTerm: trimmed };

            if (ampm === 'PM' && hh < 12) hh += 12;
            if (ampm === 'AM' && hh === 12) hh = 0;

            // Match to the minute (mirrors the Flow's original minute-range intent)
            startLocal = new Date(y, m - 1, d, hh, mm, 0);
            endLocal = new Date(y, m - 1, d, hh, mm, 59);
        } else {
            // Date only -> the user's full local calendar day
            startLocal = new Date(y, m - 1, d, 0, 0, 0);
            endLocal = new Date(y, m - 1, d, 23, 59, 59);
        }

        if (isNaN(startLocal.getTime()) || isNaN(endLocal.getTime())) {
            return { searchTerm: trimmed };
        }

        return {
            searchTerm: trimmed,                       // kept for the text-field OR conditions / logging
            searchDateStartUtc: toCleanIso(startLocal), // e.g. "2026-08-05T18:30:00Z"
            searchDateEndUtc: toCleanIso(endLocal)
        };
    }

    function escapeHtml(value) {
        if (value === null || value === undefined || value === "") return "-";
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "'")
            .replace(/'/g, "&#39;");
    }

    function renderCurrentPage() {
        const startIndex = (localPageIndex - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const pageRecords = allAccumulatedRecords.slice(startIndex, endIndex);

        const hasNextLocal = endIndex < allAccumulatedRecords.length;
        const hasNextServer = !!serverNextLink;
        const hasNext = hasNextLocal || hasNextServer;

        const totalRecords = storedTotalCount || allAccumulatedRecords.length;

        // Cumulative count shown so far: page 1 -> 25, page 2 -> 50, etc.
        // Capped at the real total so the last partial page doesn't overshoot.
        const cumulativeShown = Math.min(startIndex + pageRecords.length, totalRecords);

        // Total pages based on the real record count (not just what's been fetched yet)
        const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));

        // Sliding 2-wide window of page numbers to display, e.g. [1,2] or [2,3].
        // Stays within [1, totalPages] and always tries to show 2 numbers
        // (falls back to 1 when totalPages === 1).
        let windowStart = localPageIndex;
        if (windowStart + 1 > totalPages) {
            windowStart = Math.max(1, totalPages - 1);
        }
        const pageWindow = [];
        for (let p = windowStart; p < windowStart + 2 && p <= totalPages; p++) {
            pageWindow.push(p);
        }

        CommonTableTemplate.render(auditColumns, pageRecords, {
            visibleCount: cumulativeShown,
            totalCount: totalRecords,
            currentPage: localPageIndex,
            totalPages: totalPages,
            pageWindow: pageWindow,
            hasPrev: localPageIndex > 1,
            hasNext: hasNext,
            onPrev: function () {
                if (localPageIndex > 1) {
                    localPageIndex--;
                    renderCurrentPage();
                }
            },
            onNext: function () {
                const maxLocalPage = Math.ceil(allAccumulatedRecords.length / PAGE_SIZE);

                if (localPageIndex < maxLocalPage) {
                    localPageIndex++;
                    renderCurrentPage();
                } else if (serverNextLink) {
                    const rawSearchVal = document.getElementById("cmdspp-search-modified-by")?.value.trim() || "";
                    const payload = buildSearchPayload(rawSearchVal);
                    fetchBatch(payload, serverNextLink, true);
                }
            },
            // Jump directly to a page number clicked in the pagination window.
            // If that page's records haven't been fetched from the server yet,
            // keep pulling batches until we have enough (or run out of pages).
            onPageClick: function (pageNum) {
                const maxLocalPage = Math.ceil(allAccumulatedRecords.length / PAGE_SIZE);

                if (pageNum <= maxLocalPage) {
                    localPageIndex = pageNum;
                    renderCurrentPage();
                    return;
                }

                if (serverNextLink) {
                    localPageIndex = pageNum;
                    const rawSearchVal = document.getElementById("cmdspp-search-modified-by")?.value.trim() || "";
                    const payload = buildSearchPayload(rawSearchVal);
                    fetchBatch(payload, serverNextLink, false);
                }
            }
        });
    }

    function fetchBatch(searchPayload = { searchTerm: "" }, nextUrl = "", isNextPageTrigger = false) {
        if (typeof showLoader === "function") {
            showLoader("Loading details...");
        }

        fetch(flowUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                searchTerm: searchPayload.searchTerm || "",
                searchDateStartUtc: searchPayload.searchDateStartUtc || "",
                searchDateEndUtc: searchPayload.searchDateEndUtc || "",
                action: "fetch",
                nextLink: nextUrl || ""
            })
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return res.json();
        })
        .then(data => {
            const rawRecords = data?.auditinfo || [];
            console.log(rawRecords, "rawRecords");
            serverNextLink = data?.nextLink || null;

            if (data?.totalCount !== null && data?.totalCount !== undefined && data?.totalCount !== "") {
                storedTotalCount = Number(data.totalCount);
            }

            const newRecords = rawRecords.map(item => {
                const operationType = (item.operationType || "—");
                const modifiedBy = (item.mofifiedBy || item.modifiedBy || "System Admin");
                const formattedModifiedDate = formatDateOnly(item.modifiedOn);
                const fieldName = item.fieldName;
                const oldValue = item.oldValue;
                const newValue = item.newValue;

                return {
                    operationType: operationType,
                    modifiedBy: modifiedBy,
                    modifiedDate: formattedModifiedDate,
                    fieldName: fieldName,
                    oldValue: oldValue,
                    newValue: newValue
                };
            });

            allAccumulatedRecords = allAccumulatedRecords.concat(newRecords);

            if (isNextPageTrigger) {
                localPageIndex++;
            }

            renderCurrentPage();
        })
        .catch(error => {
            console.error("Fetch failed:", error);
            cmdsppShowToast("error", "Unable to fetch records. Please try again.");
            if (allAccumulatedRecords.length === 0) {
                CommonTableTemplate.render(auditColumns, [], {
                    totalCount: storedTotalCount,
                    currentPage: 1,
                    hasPrev: false,
                    hasNext: false
                });
            }
        })
        .finally(() => {
            if (typeof hideLoader === "function") {
                hideLoader();
            }
        });
    }

    // Initial load
    fetchBatch({ searchTerm: "" }, "", false);

    // Search input handler
    let hasActiveSearch = false;
    const searchInput = document.getElementById("cmdspp-search-modified-by");
    if (searchInput) {
        searchInput.addEventListener("input", function (e) {
            clearTimeout(searchTimeout);
            const value = e.target.value.trim(); // box keeps showing raw local-time text

            if (value.length > 0 && value.length < 2) {
                return;
            }

            if (value.length === 0 && !hasActiveSearch) {
                return;
            }

            searchTimeout = setTimeout(() => {
                hasActiveSearch = value.length >= 2;

                allAccumulatedRecords = [];
                localPageIndex = 1;
                serverNextLink = null;
                storedTotalCount = 0;

                const payload = buildSearchPayload(value);
                fetchBatch(payload, "", false);
            }, 350);
        });
    }
});