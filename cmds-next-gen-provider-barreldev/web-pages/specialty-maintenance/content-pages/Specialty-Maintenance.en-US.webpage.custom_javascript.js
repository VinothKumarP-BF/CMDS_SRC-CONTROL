let specialtyArray = []
let selectedSpecialty=""
let taxonomyArray = []
let selectedList = []
let providerId = ""
let activeList = []
const fetchSpecialtyTaxonamyUri = window.flowConfig.cmdspp_Fetch_Specialty_Taxonamy;
const fetchProvidersUri = window.flowConfig.cmdssp_fetch_providers;
 let loggedInUserID = window.cmdsppUserId

document.addEventListener("DOMContentLoaded", async function () {
    try {
        fetchProviderTypesbasedOnEnrollment();
        showLoader();
        const providerTypes = await getProviders();
        const providers = providerTypes?.providers || [];

        const dropdown = document.getElementById("providerType");
        if (dropdown) {
            dropdown.addEventListener("change", function () {
                const selectErrorText = document.getElementById("providerTypeError");
                selectErrorText.style.display = "none";
                dropdown.classList.remove("select-error");
                dropdown.style.border="1px solid #E3E8EE"; 
                const selectedValue = this.value;
                const selectedText = this.options[this.selectedIndex].text;
                console.log("Selected Value:", selectedValue);
                console.log("Selected Text:", selectedText);
                providerId = selectedValue
                renderSpecialityAndTaxonomy(selectedValue)
            });
        };
        // Clear existing options
        dropdown.innerHTML = "";
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Select Provider Type";
        placeholder.disabled = true;
        placeholder.selected = true;

dropdown.appendChild(placeholder);

        providers.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = `${item.code} - ${item.name}`;

            dropdown.appendChild(option);
        });
        saveCatalog();

        // Optional: reset selection
        dropdown.value = "";
        hideLoader();
    } catch (error) {
        hideLoader();
        console.error("Error loading providers:", error);
    }
});

(function(webapi, $) {
    function safeAjax(ajaxOptions) {
        var deferredAjax = $.Deferred();
        shell.getTokenDeferred().done(function(token) {
            if (!token) {
                deferredAjax.rejectWith(this, [{
                    status: 403,
                    statusText: "No CSRF Token"
                }]);
                return;
            }
            if (!ajaxOptions.headers) {
                ajaxOptions.headers = {};
            }
            ajaxOptions.headers["__RequestVerificationToken"] = token;
            $.ajax(ajaxOptions)
                .done(function(data, textStatus, jqXHR) {
                    deferredAjax.resolveWith(this, [data, textStatus, jqXHR]);
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    deferredAjax.rejectWith(this, [jqXHR, textStatus, errorThrown]);
                });
        }).fail(function() {
            deferredAjax.rejectWith(this, [{
                status: 403,
                statusText: "Token retrieval failed"
            }]);
        });
        return deferredAjax.promise();
    }
    webapi.safeAjax = safeAjax;
})(window.webapi = window.webapi || {}, jQuery);
async function fetchProviderTypesbasedOnEnrollment(){

   let flowURL = `/_api/cmdspp_p_dtl_tbs
?$filter=_cmdspp_created_by_user_value eq b7a318e0-4c87-f111-b27e-000d3a61726b and _cmdspp_p_provider_ty_lkpid_value ne null and cmdspp_p_appln_status ne 7 and statecode eq 0 
&$select=cmdspp_p_provider_ty_lkpid
&$expand=
cmdspp_p_provider_ty_lkpid($select=cmdspp_p_pvd_typ_nam,cmdspp_pc_pvd_typ_tbid)`;
return new Promise((resolve, reject) => {
    webapi.safeAjax({
        type: "GET",
        url: flowURL,
        contentType: "application/json",
        success: function(res) {
            console.log(res)
            
        },
        error: function(err) {
            console.log(err);
        }
    });
})

}


function getUpdatedCatalog (){
    let data = []
    let finalArray = []
    let auditArray = []
    selectedList.length && selectedList.map((selecteditem)=>{
        item = {...selecteditem}
        activeList?.forEach((activeItem)=>{
            if(activeItem.specialty.id==item.specialty?.id && item.taxonomyObject?.id == activeItem.taxonomyObject?.id){
                if(item.specialty.active == false || item.taxonomyObject.active == false){
                    item.status = 0
                    item.transtype = "update"
                    item.recordID = activeItem.recordID
                }
            }
        })
        delete item.specialty.taxonomyActiveList
        data.push(item)

    })
    
    const uniqueData = data.filter(
        (obj, index, self) =>
        index === self.findIndex(item => item.specialty.id === obj.specialty.id && item.taxonomyObject.id === obj.taxonomyObject.id)
    );
   
    uniqueData.map((uniqueItem,ind)=>{
        if(uniqueItem.transtype=="update"){
            finalArray.push(uniqueItem)
            
        auditArray.push({
            "oldValue": "Added",
            "newValue": "Removed",
            "fieldName": uniqueItem.taxonomyObject.description,
            "operationType": "Update",
            "modifiedBy": loggedInUserID
        })


        }else{
            if(uniqueItem.specialty.active == true && uniqueItem.taxonomyObject.active == true){
                finalArray.push(uniqueItem)
                auditArray.push({
            "oldValue": "",
            "newValue": "Added",
            "fieldName": uniqueItem.taxonomyObject.description,
            "operationType": "Add",
            "modifiedBy": loggedInUserID
        })
            }

        }
    })


    return {
        saveData:finalArray,
        auditData:auditArray}

}
function saveCatalog (){
    const saveButton = document.getElementById("save-specialty-catalog");
    
    saveButton.addEventListener("click", function () {
        let catalogList = getUpdatedCatalog()
        if(catalogList?.saveData?.length && providerId){
            showLoader()
            getSpecialityAndTaxonomy("saveCatalog",providerId,selectedSpecialty,catalogList?.saveData);
            hideLoader()
            cmdsppShowToast("success", "Configuration saved successfully.")
        }else{
            if(!providerId){
               const select = document.getElementById("providerType");
                if (!select.value) {
                    const selectErrorText = document.getElementById("providerTypeError");
                    selectErrorText.style.display = " block";
                    select.style.border="1px solid red";
                    return;
                }

                select.style.border="1px solid #E3E8EE";   
            }
        }
        if(catalogList?.auditData?.length){
            saveAuditlog(catalogList?.auditData)

        }
        
    });
}
async function saveAuditlog(auditData){
    var cmdsppRaw = {{ settings["cmdspp_ENV_Automate_Flow_Url_2"] | json }};

    var cmdsppUrls = typeof cmdsppRaw === "string" ? JSON.parse(cmdsppRaw) : cmdsppRaw;
    window.cmdsppConfig = {
        ConfigAduitApiUrl: cmdsppUrls?.cmdspp_fetch_configAudits
    };
    const flowUrl = window.cmdsppConfig.ConfigAduitApiUrl;
    const response = await fetch(
        flowUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "flowName":"fetch providers"
            },
            body: JSON.stringify({
                "action": "Create",
                'auditList': auditData?.length?auditData:[]
            })
            // body: JSON.stringify(selectedArray)
        }
    );
    return response.json();

}
async function getProviders() {
    
    const response = await fetch(
        fetchProvidersUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "flowName":"fetch providers"
            },
            body: JSON.stringify({
                'fetchAll': true
            })
        }
    );
    return response.json();

}

function submitSpecialtyForm() {
    isSubmitting = true;
    let btn = $("#InsertButton");ws
    btn.prop("disabled", true);
    btn.text("Saving...");
    $("#cmdspp_pc_specl_to_pvd_typ_fk").val(providerId);
    $("#EntityFormPanel").submit();
    isSubmitting = false;

}
async function getSpecialityAndTaxonomy(transType,providerTypeID,specialtyID,selectedArray,addSpecialty){
    const response = await fetch(
        fetchSpecialtyTaxonamyUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "flowName":"fetch providers"
            },
            body: JSON.stringify({
                'transType':transType,
                'providerTypeID': providerTypeID?providerTypeID:"",
                'specialtyID':specialtyID?specialtyID:"",
                'catalogArray':selectedArray?selectedArray:[],
                'specialtyObj':addSpecialty?addSpecialty:{}
            })
            // body: JSON.stringify(selectedArray)
        }
    );
    return response.json();
    
};

function gettabContentHtml(specialtyArray) { 
    return `
    <!-- BUILDER -->
    <div class="builder">
    <div class="column PagesColumn">
        <div class="column-header">
            <div>
               <span>Specialty</span><span id="pagesCount" class="small-badge">(${1}/${5})</span>
            </div>
            <button
                type="button"
                class="add-provider-btn"
                id="addSpecialtyTypeBtn">
                + Add Specialty
            </button>

        </div>
        <div id="specialtyList">
        
        </div>
    </div>
    <div class="column sectionColumn">
        <div class="column-header">
           <div>
            <span> Taxonomy </span>
           </div>
           <button
                type="button"
                class="add-provider-btn"
                id="addTaxonomyTypeBtn">
                + Add Taxonomy
            </button>
        </div>
        <div id="taxonomyList"></div>
    </div>
    </div>`
}

async function renderSpecialityAndTaxonomy (providerTypeID,refresh){
    showLoader();
    let respData = await getSpecialityAndTaxonomy("fetchSpecialty",providerTypeID)
    specialtyArray = respData?.data?.length ? respData.data:[];
    if(!refresh){
        selectedSpecialty = specialtyArray[0]?.id
    }
    activeList = respData?.activeList?.length ? respData.activeList:[];
    updateActiveList()
    let tabContent = gettabContentHtml(specialtyArray);
    const tabContentContainer = document.getElementById("tabContent");
    console.log(tabContentContainer)
    tabContentContainer.innerHTML = tabContent;
    renderSepecialtyList();
    hideLoader();
    renderTaxonomyList(selectedSpecialty)
}

function updateActiveList (){
    activeList.map((activeobj)=>{
        let activeSpecialty = activeobj.specialty
        let activeTaxonomy = activeobj.taxonomyObject
        let specInd = specialtyArray.findIndex((spec)=>spec.id == activeSpecialty.id)
        if(specInd !=-1){
            specialtyArray[specInd].active =  true
            
            let taxonomyActiveList = specialtyArray[specInd].taxonomyActiveList?specialtyArray[specInd].taxonomyActiveList:[]
            taxonomyActiveList.push(activeTaxonomy)
            specialtyArray[specInd].taxonomyActiveList = taxonomyActiveList
        }
        if(selectedSpecialty){
           let taxonomyInd = taxonomyArray.findIndex((spec)=>spec.id == activeTaxonomy.id && activeSpecialty.id == selectedSpecialty);
           if(taxonomyInd !=-1){
            taxonomyArray[specInd].active =  true
           }
        }
    })
    console.log(specialtyArray,taxonomyArray)
}

function renderSepecialtyList() {
    const specialtyContainer = document.getElementById("specialtyList");
    
    const sortedSpecialtyArray = [...specialtyArray].sort(
        (a, b) => Number(Boolean(b.active)) - Number(Boolean(a.active))
    );


    specialtyContainer.innerHTML = sortedSpecialtyArray?.map(item => `
        <div class="row-item page-item specialty-row ${selectedSpecialty==item.id ? "active-row" : ""}" data-page-id="${item.id}">
            <div class="cmdspp-specialty-row ${item.active?"cmdspp-selected-specialty-row" :"" }">
                <input
                   class="specialty-checkbox"
                   type="checkbox"
                   value=${item.active}
                   data-id = ${item.id}
                   ${item.active ? "checked" : ""}
                />
            
            <span>
                ${item.code} - ${item.description}
            </span>
            </div>
            ${selectedSpecialty==item.id ? `<span>></span>`:""}
        </div>
    `).join("") || "";
    bindSpecialtyEvents()
}
function updateTaxonomyActiveList (resData){
    let taxArray = resData
    let specialtyObj = specialtyArray.find(item=>item.id == selectedSpecialty)
    if(specialtyObj?.taxonomyActiveList?.length){
        specialtyObj?.taxonomyActiveList.forEach((item)=>{
            let taxonomyIndex = taxArray.findIndex(tItem=>tItem.id == item.id)
            if(taxonomyIndex !=-1){
                taxArray[taxonomyIndex].active = true
            }
        })
    }
    return taxArray;
}
async function renderTaxonomyList(specialtyId,refresh) {
    if(!refresh){
        showLoader()
        respData = await getSpecialityAndTaxonomy("fetchTaxonomy",null,specialtyId)
        taxonomyArray = updateTaxonomyActiveList(respData.data)
    }
    
    const taxonomyContainer = document.getElementById("taxonomyList");
    const sortedTaxonomyArray = [...taxonomyArray].sort(
    (a, b) => Number(Boolean(b.active)) - Number(Boolean(a.active))
);
    taxonomyContainer.innerHTML = sortedTaxonomyArray?.map(item => `
        <div class="field-card ${item.active? "cmdspp-selected-field-card":""}"
                     data-field-id="${item.id}">

                    <div class="field-left">

                        <input
                            type="checkbox"
                            class="taxonomy-checkbox"
                            data-id= ${item.id}
                            value=${item.active}
                            ${item.active ? "checked" : ""}
                        />
                        <span class="field-name">
                            ${item.code} - ${item.description}
                        </span>

                    </div>

                </div>
    `).join("") || "";
    bindTaxonomyEvents()
    hideLoader();
}

function updateSelectedList(updatedItem,specialtyObject,taxonomyObject,){
    let selectedItems = [...selectedList]
    if(updatedItem == "specialty" && specialtyObject.active==false ){
        taxonomyOBJ = {}
        if(selectedList?.length){
            selectedItems = selectedList.map((item)=>{
                if(item.specialty.id ==specialtyObject.id){
                    return item
                }
            })
        }
        specialtyObject.taxonomyActiveList.forEach((item,index)=>{
            item.active = false
            taxonomyOBJ = item
            selectedItems.push({
                specialty:specialtyObject,
                taxonomyObject:taxonomyOBJ
            })

        })
        


    }else if(specialtyObject.active==true && selectedList.length ){
        selectedItems = selectedItems.map((item)=>{
            if(item.specialty.id ==specialtyObject.id ){
                if(!item.specialty.active){
                    item.specialty.active = specialtyObject.active
                }
                if(item?.taxonomyObject?.id){
                    return item
                }
            }else{
                return item
            }
            
        })
    }
    if(taxonomyObject?.id){
        selectedItems.push(
        {
            specialty:specialtyObject,
            taxonomyObject:taxonomyObject
        }
    )

    }
    
    selectedList = selectedItems


}

function bindSpecialtyEvents() {
        
        document.querySelectorAll(".specialty-row").forEach(row => {
            row.addEventListener("click", function () {
                selectedSpecialty = this.dataset.pageId
                renderSepecialtyList()
                renderTaxonomyList(this.dataset.pageId)
            });
        });

    document.querySelectorAll(".specialty-checkbox")?.forEach(box => {
        box.addEventListener("click", function() {
            console.log(specialtyArray)
            let selectedSpecialtyList = {}
            specialtyArray.map((x,index) =>{
                let specailtyItem = x;
                console.log(this.checked)
                if(x.id === this.dataset.id){
                    specailtyItem.active = this.checked;
                    selectedSpecialtyList = x
                }
                return specailtyItem
                
            });
            updateSelectedList("specialty",selectedSpecialtyList)
            console.log(specialtyArray)
            })
            

        });

        document
            .getElementById("addSpecialtyTypeBtn")
            ?.addEventListener("click", function(e) {

                e.preventDefault();
                e.stopPropagation();
                cmdspp_openModal("specialty")
                    
            });
}
function bindTaxonomyEvents() {
        document
            .querySelectorAll(".taxonomy-checkbox")
            ?.forEach(box => {

                box.addEventListener("click", function() {
                    let selectedTaxonomy = {}
                    let taxonomyList = []
                    taxonomyArray.map((x,index) =>{
                        let taxonomyItem = x;
                        if(x.id == this.dataset.id){
                            taxonomyItem.active = this.checked;
                            selectedTaxonomy = taxonomyItem
                        }
                        if(taxonomyItem.active){
                            taxonomyList.push(taxonomyItem);
                        }
                        return taxonomyItem
                    });
                    specialtyIndex = specialtyArray.findIndex((item)=>item.id == selectedSpecialty)
                    console.log(specialtyIndex)
                    if(specialtyIndex != -1){
                        specialtyArray[specialtyIndex]["taxonomyActiveList"] = taxonomyList
                        updateSelectedList("taxanomy",specialtyArray[specialtyIndex],selectedTaxonomy)
                    }
                    renderTaxonomyList(selectedSpecialty,true)
                    
                })
            });

        document
            .getElementById("addTaxonomyTypeBtn")
            ?.addEventListener("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                cmdspp_openModal("taxonomy")
            });
}
const cmdspp_modalConfig = {
    specialty: {
        modalId:"cmdspp_specialtyModal",
        buttonId:"cmdspp_specialtySubmitBtn",
        apiUrl:"YOUR_SPECIALTY_FLOW_URL",
        fields:[
            {
                id:"cmdspp_specialtyCode",
                error:"cmdspp_specialtyCodeError",
                key:"code",
                message:"Specialty Code is required"
            },
            {
                id:"cmdspp_specialtyDescription",
                error:"cmdspp_specialtyDescriptionError",
                key:"description",
                message:"Specialty Description is required"
            }
        ],
        success:"Specialty created successfully"

    },
    taxonomy:{
        modalId:"cmdspp_TaxonomyModal",
        buttonId:"cmdspp_TaxonomySubmitBtn",
        apiUrl:"YOUR_PROVIDER_TYPE_FLOW_URL",
        fields:[
            {
                id:"cmdspp_TaxonomyCode",
                error:"cmdspp_TaxonomyCodeError",
                key:"code",
                message:"Taxonomy Code is required"
            },
            {
                id:"cmdspp_TaxonomyDescription",
                error:"cmdspp_TaxonomyDescriptionError",
                key:"description",
                message:"Taxonomy Description is required"
            }
        ],
        success:"Taxonomy created successfully"

    }
};

function cmdspp_openModal(type) {
    let config = cmdspp_modalConfig[type];
    config.fields.forEach(field => {
        $("#" + field.id)
            .val("")
            .removeClass("cmdspp_input-error");
        $("#" + field.error).text("");

    });
    $("#" + config.buttonId)
        .prop("disabled", false)
        .text("Submit");
    $("#" + config.modalId).show();
}

function cmdspp_closeModal(type) {
    let config = cmdspp_modalConfig[type];
    config.fields.forEach(field => {
        $("#" + field.id)
            .val("")
            .removeClass("cmdspp_input-error");
        $("#" + field.error).text("");
    });
    $("#" + config.buttonId)
        .prop("disabled", false)
        .text("Submit");
    $("#" + config.modalId).hide();
}


async function cmdspp_submitModal(type){
    let config=cmdspp_modalConfig[type];
    let valid=true;
    let payload={};
    config.fields.forEach(field=>{
        let value=$("#"+field.id)
                    .val()
                    .trim();
        $("#"+field.error).text();
        $("#"+field.id)
            .removeClass("cmdspp_input-error");
        if(value===""){
            $("#"+field.error)
                .text(field.message);
            $("#"+field.id)
                .addClass("cmdspp_input-error");
            valid=false;
        }
        payload[field.key]=value;

    });
    if(!valid){
        return;
    }
    let button=$("#"+config.buttonId);



    button.prop("disabled",true);
    console.log(payload)
    let response= {}
    if(type=="specialty"){
        
       response = await getSpecialityAndTaxonomy("saveSpecialty",providerId,null,null,payload);

    }
    if(type=="taxonomy"){
        response = await getSpecialityAndTaxonomy("saveTaxonomy",providerId,null,null,payload);
    }
    let auditArray = []
    auditArray.push({
            "oldValue": "",
            "newValue": payload.description,
            "fieldName": type=="taxonomy"?"Taxonomy":"Specialty",
            "operationType": "Add",
            "modifiedBy": loggedInUserID
        })

    if(response.status=="Success"){
        cmdsppShowToast("success", "Configuration saved successfully.")
        if(type=="specialty"){
            renderSpecialityAndTaxonomy(providerId,true)
        }else if(type=="taxonomy"){
            renderTaxonomyList(selectedSpecialty);
        }
        cmdspp_closeModal(type)
    }
    else if(response.status=="Duplicate record"){
        cmdsppShowToast("error", "Duplicate record")
        button.prop("disabled",false);

    }else{
        cmdsppShowToast("error", "Technical error")
        button.prop("disabled",false);
    }
    saveAuditlog(auditArray)


}