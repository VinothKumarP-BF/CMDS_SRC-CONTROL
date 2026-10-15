// =======================
// SAMPLE DATA
// =======================

let configData = null;

// =======================
// GLOBALS
// =======================

let selectedPage = null;
let selectedSection = null;
let providers = [];
let selectedEnrollType = null;
let existingMappings = [];
let enrollmentTypes = [];
let totalFldCount = ""
let existingProviders = [];
let activeTab = "requiredDocs";
let docFldList = [];
let reqDocuments = [];
let auditFldsRecords = [];
let isDataChange = false
let selectedPrvCount = 0
let documentDropDown = []
let attachedDocs = {}
const formatFileTxt = "Please upload a format file";
const newDocument = "New document"
let isAnyConfigSave = false;
let optFlds = []
let optionDomainName = []
const tabs = [
    {
        id: "requiredDocs",
        label: "Required Documents",
    },
    {
        id: "providerType",
        label: "Provider Type",
    },
];
const configForms = {
    enrollmentFields:[
            {
                "name":"enrollmentName",
                "label":"Enrollment Name",
                "type":"text",
                "placeholder":"Enter Text",
                "maxlength":"100",
                "required":true,
                "validations":[
                    {
                        "type":"required",
                        "errMsg":"Enrollment Name is required."
                    },
                    {
                        "type":"unique",
                        "errMsg":"Enrollment Name already exists.",
                        "key":"title"
                    },
                    {
                        "type":"minLength",
                        "errMsg":"Enrollment Name must contain at least 3 characters."
                    },
                    {
                        "type":"invalidChars",
                        "errMsg":"Invalid characters are not allowed."
                    }

                ]
                
            },
            {
                "name":"enrollmentDesc",
                "label":"Description",
                "type":"text",
                "placeholder":"Enter Text",
                "maxlength":"255",
                "required":false,
                "validations":[
                     {
                        "type":"invalidChars",
                        "errMsg":"Invalid characters are not allowed."
                    }
                ]
                
            },
            {
                "name":"tooltip",
                "label":"Tooltip",
                "type":"text",
                "placeholder":"Enter Text",
                "maxlength":"100",
                "required":true,
                "validations":[
                     {
                        "type":"required",
                        "errMsg":"Tooltip is required."
                    },
                     {
                        "type":"invalidChars",
                        "errMsg":"Invalid characters are not allowed."
                    }
                ]
                
            },
            {
                "name":"iconUpload",
                "label":"",
                "type":"file",
                "placeholder":"",
                "maxlength":"",
                "validations":[
                    {
                        "type":"allowedExt",
                        "errMsg":"Invalid file type. Allowed formats 'png','jpg','jpeg' ",
                        "allowedExtensions":['png','jpg','jpeg'],
                        "size":10,
                        "sizeErrMsg":"File size cannot exceed 10 MB",

                    }
                ]
            }
    ],
    providerFields:[
        {
                "name":"providerCode",
                "label":"Provider Code",
                "type":"text",
                "dataType":"number",
                "placeholder":"Enter Code",
                "maxlength":"100",
                "required":true,
                "validations":[
                    {
                        "type":"required",
                        "errMsg":"Provider Code is required."
                    },
                    {
                        "type":"unique",
                        "errMsg":"Provider already exists.",
                        "key":"type"
                    },
                    {
                        "type":"minLength",
                        "errMsg":"Minimum 3 character in Provider Code."
                    },
                     {
                        "type":"invalidChars",
                        "errMsg":"Invalid characters are not allowed."
                    }

                ]
                
            },
            {
                "name":"providerDesc",
                "label":"Provider Description",
                "type":"text",
                "placeholder":"Enter Text",
                "maxlength":"255",
                "required":true,
                "validations":[
                    {
                        "type":"required",
                        "errMsg":"Provider Description is required."
                    },
                     {
                        "type":"invalidChars",
                        "errMsg":"Invalid characters are not allowed."
                    }
                ]
                
            },

    ],
    documentFields:[
            {
                "name":"documentList",
                "label":"Document List",
                "type":"select",
                "placeholder":"Select",
                "required":true,
                "validations":[
                    {
                        "type":"required",
                        "errMsg":"Document List is required."
                    },
                    {
                        "type":"unique",
                        "errMsg":"This document is already attached",
                        "key":"id"
                    }

                ]
                
            },
            {
                "name":"documentName",
                "label":"For New, Enter Document Name",
                "type":"text",
                "placeholder":"Enter Text",
                "maxlength":"100",
                "required":false,
                "validations":[
                     {
                        "type":"required",
                        "errMsg":"Document List is required."
                    },
                    {
                        "type":"unique",
                        "errMsg":"This document is already attached",
                        "key":"type"
                    }
                ]
                
            },
            {
                "name":"esignature",
                "label":"E-Signature",
                "type":"select",
                "placeholder":"Select",
                "maxlength":"100",
                "required":true,
                "options":[
                    {"label":"Yes","value":"true"},
                    {"label":"No","value":"false"}
                ],
                "validations":[
                     {
                        "type":"required",
                        "errMsg":"E-Signature is required."
                    }
                ]
                
            },
           {
                "name":"conditional",
                "label":"Conditional",
                "type":"select",
                "placeholder":"Select",
                "maxlength":"100",
                "required":true,
                "options":[
                    {"label":"Yes","value":"true"},
                    {"label":"No","value":"false"}
                ],
                "validations":[
                     {
                        "type":"required",
                        "errMsg":"E-Signature is required."
                    }
                ]
                
            },
            {            
                "name":"fieldName",
                "label":"Field Name",
                "type":"select",
                "placeholder":"Select",
                "required":true,
                "validations":[
                     {
                        "type":"required",
                        "errMsg":"Field Name is required."
                    }
                ],
                "dependency":[
                    {
                        "type":"visibility",
                        "depId":"conditional",
                        "depValue":[true]
                    }
                ],
                "shouldNotRender":true
                
            },
            {            
                "name":"operator",
                "label":"Operator",
                "type":"select",
                "placeholder":"Select",
                "required":true,
                 "options":[
                    {"label":"=<","value":"1"},
                    {"label":"!=","value":"2"},
                    {"label":">","value":"3"},
                    {"label":"<","value":"4"},
                    {"label":">=","value":"5"},
                    {"label":"<=","value":"6"}
                ],
                "validations":[
                     {
                        "type":"required",
                        "errMsg":"Operator is required."
                    }
                ],
                "dependency":[
                    {
                        "type":"visibility",
                        "depId":"conditional",
                        "depValue":[true]
                    }
                ],
                "shouldNotRender":true
                
            },
             {            
                "name":"fieldValue",
                "label":"Value",
                "type":"select",
                "placeholder":"Select",
                "required":true,
                "options":[],
                "validations":[
                     {
                        "type":"required",
                        "errMsg":"Value is required."
                    }
                ],
                "dependency":[
                    {
                        "type":"visibility",
                        "depId":"conditional",
                        "depValue":[true]
                    }
                ],
                "shouldNotRender":true
                
            }
    ],
};
// =======================
// INIT
// =======================

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

document.addEventListener("DOMContentLoaded", async () => {

     // Safely embed the raw JSON string using the `json` filter (escapes quotes/HTML properly)
      var cmdsppRaw2 = {{ settings["cmdspp_ENV_Form_Config_Automate_Flow_Url1"] | json }};
     var cmdsppRaw1 = {{ settings["cmdspp_ENV_Form_Config_Flow_Url1"] | json }};
     var cmdsppRaw3 = {{ settings["cmdspp_ENV_Automate_Flow_Url"] | json }};
     var cmdsppRaw4 = {{ settings["cmdspp_ENV_Automate_Flow_Url_2"] | json }};

    const saveBtn = document.querySelector(".save-btn");

    if (saveBtn) {
        saveBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            saveConfiguration();
        });
    }

function transformData(data, optFlds, optionDomainName,mappings) {
    const pageMap = new Map();

    data.forEach(item => {
        const page = item.cmdspp_p_enrol_map_to_pg_fk;
        const section = item.cmdspp_p_enrol_map_to_section_fk;
        const field = item.cmdspp_p_enrol_map_to_ctrl_fk;

        // Create page
        if (!pageMap.has(page.cmdspp_pc_pg_tbid)) {
            pageMap.set(page.cmdspp_pc_pg_tbid, {
                id: page.cmdspp_pc_pg_tbid,
                title: page.cmdspp_p_pg_nam,
                name: page.cmdspp_p_pg_nam,
                order: page.cmdspp_p_pg_order,
                code: page.cmdspp_p_pg_id_pk,
                sections: []
            });
        }

        const pageObj = pageMap.get(page.cmdspp_pc_pg_tbid);

        // Create section
        let sectionObj = pageObj.sections.find(
            s => s.id === section.cmdspp_pc_section_tbid
        );

        if (!sectionObj) {
            sectionObj = {
                id: section.cmdspp_pc_section_tbid,
                name: section.cmdspp_p_section_nam,
                code: section.cmdspp_p_section_id_sk,
                order: section.cmdspp_p_section_order,
                fields: []
            };

            pageObj.sections.push(sectionObj);
        }

        // Add field
        const fieldExists = sectionObj.fields.some(
            f => f.id === field.cmdspp_pc_ctrl_tbid
        );

        if (!fieldExists) {
            if (field.cmdspp_p_options_clm && field.cmdspp_p_ctrl_typ && (field.cmdspp_p_ctrl_typ.includes("Dropdown") || field.cmdspp_p_ctrl_typ.includes("Multi-select") || field.cmdspp_p_ctrl_typ.includes("Multi-Checkbox"))) {
                optFlds.push({
                    id: field.cmdspp_pc_ctrl_tbid,
                    optionCd: field.cmdspp_p_options_clm
                })
                let isExists = optionDomainName.some(o => o === field.cmdspp_p_options_clm);
                if (!isExists) optionDomainName.push(field.cmdspp_p_options_clm)
            }
            mappings.push(
                {
                    id:item.cmdspp_pc_enrol_typ_mapid,
                    ctrlId:field.cmdspp_pc_ctrl_tbid,
                    secId:section.cmdspp_pc_section_tbid,
                    pageId:page.cmdspp_pc_pg_tbid,
                    visible:item.cmdspp_p_visible,
                    validate:item.cmdspp_p_req_ind,
                    required:item.cmdspp_p_validated_ind

                }
            )
            sectionObj.fields.push({
                id: field.cmdspp_pc_ctrl_tbid,
                code: field.cmdspp_p_ctrl_id_sk,
                name: field.cmdspp_p_ctrl_nam,
                placeholder: field.cmdspp_p_ctrl_place_hldr,
                type: field.cmdspp_p_ctrl_typ,
                validateRule: field.cmdspp_p_valid_rule,
                ctlDtlTb: field.cmdspp_p_ctrl_dtl,
                ctrlDtlClm: field.cmdspp_p_ctrl_dtl_clm,
                ctlOptTb: field.cmdspp_p_options_tb_list,
                ctrlOptKey: field.cmdspp_p_options_clm,
                required: item.cmdspp_p_req_ind,
                validate: item.cmdspp_p_validated_ind,
                optionCode: item.cmdspp_p_options_vv_cd,
                uniqFldCd: field.cmdspp_p_dependent_field || null
            });
        }
    })
    return Array.from(pageMap.values())
        .sort((a, b) => Number(a.order) - Number(b.order))
        .map(page => ({
            ...page,
            sections: page.sections.sort(
                (a, b) => (a.order || 9999) - (b.order || 9999)
            )
        }));
}

function formOptionsMap(optionList) {
    const optionsMap = optionList.reduce((acc, item) => {
        const domain = item.cmdspp_r_vv_domain_nam;

        if (!acc[domain]) {
            acc[domain] = [];
        }

        acc[domain].push({
            value: item.cmdspp_r_vv_tbid,
            label: item.cmdspp_r_vv_short_desc,
            code: item.cmdspp_r_vv_cd

        });

        return acc;
    }, {});
    return optionsMap;
}
   async function getConfigMapping(type) {
        showLoader();
        let flowURL = cmdsppRaw1?.cmdssp_fetch_config_mappings
        // "https://68800e766659e6b2b28f47b46ad295.0f.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/12/workflows/2fcfedef45c44d7cb61d372b5e709015/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=O1HV_Gsa1utHCG16avushKdA9rwvTugKIHzR-EglSpY"
        const response = await fetch(flowURL,
           
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    flowName: "fetch config mapping",
                },
                body: JSON.stringify({
                    enrollId: selectedEnrollType?.id,
                    transType: type ? type : "",
                }),
            }
        );
        hideLoader();
        return response.json();
    }

async function getMapTypeData(type) {
    showLoader();
    let flowURL = `/_api/cmdspp_pc_enrol_typ_maps
?$filter=_cmdspp_p_enrol_map_to_enrol_fk_value eq ${selectedEnrollType?.id} and cmdspp_p_visible eq true
&$select=cmdspp_pc_enrol_typ_mapid,cmdspp_p_validated_ind,cmdspp_p_req_ind,cmdspp_p_visible
&$expand=
cmdspp_p_enrol_map_to_pg_fk($select=cmdspp_pc_pg_tbid,cmdspp_p_pg_nam,cmdspp_p_pg_order,cmdspp_p_pg_id_pk),
cmdspp_p_enrol_map_to_section_fk($select=cmdspp_pc_section_tbid,cmdspp_p_section_nam,cmdspp_p_section_order,cmdspp_p_section_id_sk),
cmdspp_p_enrol_map_to_ctrl_fk($select=cmdspp_p_ctrl_dtl_clm,cmdspp_p_ctrl_place_hldr,cmdspp_p_alow_format,cmdspp_p_dependent_field,cmdspp_p_ctrl_nam,cmdspp_p_ctrl_id_sk,cmdspp_p_ctrl_typ,cmdspp_p_ctrl_dtl,cmdspp_p_options_vv_cd,cmdspp_p_options_clm,cmdspp_pc_ctrl_tbid,cmdspp_p_valid_rule,cmdspp_p_options_tb_list,cmdspp_p_options_vv_cd)`;
return new Promise((resolve, reject) => {
    webapi.safeAjax({
        type: "GET",
        url: flowURL,
        contentType: "application/json",
        success: function(res) {
            optFlds = []
            optionDomainName = []
            let mappings = []
            const formattedData = transformData(res.value, optFlds, optionDomainName,mappings);
            hideLoader();
            console.log("transformData****",formattedData)
            resolve(formattedData)
            
        },
        error: function(err) {
            hideLoader();
            console.log(err);
        }
    });
})
}

async function getUpdateRecord() {
    return new Promise((resolve, reject) => {
        webapi.safeAjax({
            type: "GET",
            url: `/_api/cmdspp_p_enrol_dyn_flds?$filter=_cmdspp_p_enrol_dyn_to_enrol_fk_value eq ${selectedEnrollType?.id} and statecode eq 0&$select=cmdspp_p_enrol_dyn_fldid`,
            contentType: "application/json",
            success: function (res) {
                const recId = res?.value?.[0]?.cmdspp_p_enrol_dyn_fldid;

                if (!recId) {
                    resolve();
                    return;
                }

                webapi.safeAjax({
                    type: "PATCH",
                    url: `/_api/cmdspp_p_enrol_dyn_flds(${recId})`,
                    contentType: "application/json",
                    data: JSON.stringify({
                        statecode: 1
                    }),
                    success: function () {
                        resolve();
                    },
                    error: function (xhr) {
                        reject(xhr);
                    }
                });
            },
            error: function (xhr) {
                reject(xhr);
            }
        });
    });
}

async function saveJsontoDB(jsonData){

    let rec = await getUpdateRecord()
            webapi.safeAjax({
    type: "POST",
    url: "/_api/cmdspp_p_enrol_dyn_flds",
    contentType: "application/json",
    data: JSON.stringify({
        'cmdspp_p_enrol_dyn_to_enrol_fk@odata.bind': `/cmdspp_pc_enrol_typ_tbs(${selectedEnrollType?.id})`,
        cmdspp_p_field_json_txt: JSON.stringify(jsonData),
        cmdspp_p_enrol_dyn_fld__sk:"1"
    }),
    success: function (res, status, xhr) {
        const id = xhr.getResponseHeader("entityid");
        console.log("Created Record Id:", id);
        hideLoader()
    },
    error: function (xhr) {
        hideLoader();
        console.error(xhr.responseText);
    }
      });

}
async function saveFormJson(){

    const jsonData = await getMapTypeData()

    return new Promise((resolve, reject) => {
 if (optFlds?.length) {
                const uniqueDomains = [...new Set(optionDomainName)];
                const filter = uniqueDomains
                    .map(domain => `cmdspp_r_vv_domain_nam eq '${domain}'`)
                    .join(' or ');

                let optflowURL = `/_api/cmdspp_r_vv_tbs?$filter=${filter} &$select=cmdspp_r_vv_cd,cmdspp_r_vv_domain_nam,cmdspp_r_vv_long_desc,cmdspp_r_vv_short_desc,cmdspp_r_vv_tbid`
            showLoader()
                webapi.safeAjax({
                    type: "GET",
                    url: optflowURL,
                    contentType: "application/json",
                    success: function(optRes) {
                        let formatedOpt = formOptionsMap(optRes.value)
                        jsonData.forEach(p=>{
                            p.sections.forEach(s=>{
                                s.fields.forEach(f=>{
                                    if(f.ctrlOptKey && f.type && (f.type.includes("Dropdown") || f.type.includes("Multi-select") || f.type.includes("Multi-Checkbox"))){
                                        f.options = formatedOpt[f.ctrlOptKey]
                                    }if(f.optionCode){
                                        let opts =  formatedOpt[f.ctrlOptKey]
                                        if(f.optionCode === opts?.[0]?.code)  f.optionCdData=formatedOpt[f.ctrlOptKey]
                                    }
                                })
                            })
                        })
                        console.log("config full data***", jsonData);
                        saveJsontoDB(jsonData)

                    },
                    error: function(err) {
                        hideLoader();
                        console.log(err);
                    }
                });
            }else  saveJsontoDB(jsonData)
})     

}
async function formingDisplayFormFldObj(pages,sects,flds){
    const result = pages.map(page => ({
    ...page,
    sections: sects
        .filter(
            section =>
                section._cmdspp_p_section_to_pg_fk_value === page.cmdspp_pc_pg_tbid
        )
        .map(section => ({
            ...section,
            fields: flds.filter(
                field =>
                    field._cmdspp_p_ctrl_to_section_fk_value === section.cmdspp_pc_section_tbid
            )
        }))
}));
const formattedObj= result.map(page => ({
  id: page.cmdspp_pc_pg_tbid,
  title: page.cmdspp_p_pg_nam,
  name: page.cmdspp_p_pg_nam,
  code:page.cmdspp_p_pg_id_pk,
  enrollId: page._cmdspp_p_pg_to_enrol_fk_value,
  sections: (page.sections || []).map(section => ({
    id: section.cmdspp_pc_section_tbid,
    name: section.cmdspp_p_section_nam,
    code: section.cmdspp_p_section_id_sk,
    pageId:page.cmdspp_pc_pg_tbid,
    fields: (section.fields || []).map(field => ({
      id: field.cmdspp_pc_ctrl_tbid,
      name: field.cmdspp_p_ctrl_nam,
      type:field.cmdspp_p_ctrl_typ,
      code:field.cmdspp_p_ctrl_id_sk,
      secId:section.cmdspp_pc_section_tbid,
      visible: true,
      //required: field.required || false,                        
      //validate: field.validate || false
    }))
  }))
}));

console.log(formattedObj);
return formattedObj
}
async function getFormFields() {

    let pages = []
    let secs = []
    let ctrls = []
    const pagesQuery = `/_api/cmdspp_pc_pg_tbs?$filter=_cmdspp_p_pg_to_enrol_fk_value eq ${selectedEnrollType?.id}&$select=cmdspp_p_pg_nam,cmdspp_p_pg_order,cmdspp_pc_pg_tbid,cmdspp_p_pg_id_pk,_cmdspp_p_pg_to_enrol_fk_value`;
    showLoader();
    return new Promise((resolve, reject) => {
        webapi.safeAjax({
            type: "GET",
            url: pagesQuery,
            contentType: "application/json",
            success: function (res) {
                if (res.value?.length) {
                    pages = res.value
                    const filter = res.value.map(page => `_cmdspp_p_section_to_pg_fk_value eq ${page.cmdspp_pc_pg_tbid}`).join(" or ");
                    const secQuery = `/_api/cmdspp_pc_section_tbs?$filter=${filter}&$select=cmdspp_p_section_nam,_cmdspp_p_section_to_pg_fk_value,cmdspp_pc_section_tbid,cmdspp_p_section_id_sk`

                    webapi.safeAjax({
                        type: "GET",
                        url: secQuery,
                        contentType: "application/json",
                        success: function (resp) {
                            if (resp.value?.length) {
                                secs = resp.value
                                const filterSec = resp.value.map(sec => `_cmdspp_p_ctrl_to_section_fk_value eq ${sec.cmdspp_pc_section_tbid}`).join(" or ");
                                const ctrlQuery = `/_api/cmdspp_pc_ctrl_tbs?$select=cmdspp_pc_ctrl_tbid,cmdspp_p_ctrl_nam,cmdspp_p_ctrl_id_sk,_cmdspp_p_ctrl_to_section_fk_value,cmdspp_p_ctrl_typ`
                                webapi.safeAjax({
                                    type: "GET",
                                    url: ctrlQuery,
                                    contentType: "application/json",
                                    success: function (resps) {
                                        if (resps.value?.length) {
                                            ctrls = resps.value
                                            hideLoader();
                                            resolve(formingDisplayFormFldObj(pages,secs,ctrls))
                                        }
                                    },
                                    error: function (err) {
                                        hideLoader();
                                        console.log(err);
                                    }
                                });
                            }
                        },
                        error: function (err) {
                            hideLoader();
                            console.log(err);
                        }
                    });

                }
                console.log("formFlds***", res)
            },
            error: function (err) {
                hideLoader();
                console.log(err);
            }
        });
    })
}


    async function getEnrollmentTypes() {
        let flowURL = cmdsppRaw3?.cmdspp_Enrollmenttype
        //"https://68800e766659e6b2b28f47b46ad295.0f.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/26/workflows/3e7db58f5250454a9e4a2bc8f134d463/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=02i7XD4gWJBvDyXxhBwX_Kdq7QKZs9Ygi0uKIGUAgzE",
        const response = await fetch(flowURL,
             {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    flowName: "fetch enrollments",
                },
                body: JSON.stringify({
                    action: "GetEnrollmentTypes",
                }),
            }
        );
       return response.json();

    }
    async function getProviders() {
        showLoader();
        let flowURl = cmdsppRaw2?.cmdssp_fetch_providers
        //"https://68800e766659e6b2b28f47b46ad295.0f.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/09/workflows/c626f5b4a3bf4b71a6106dce5adec9f3/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3hThgINTNQTBOINzxDsLWFdj--_WDdkRjiFujhc2Tj8"
        const response = await fetch(flowURl,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    flowName: "fetch providers",
                },
                body: JSON.stringify({
                    enrollId: selectedEnrollType?.id,
                }),
            }
        );
        hideLoader();
        return response.json();
    }

    async function getPages() {
        showLoader()
        let flowURL = cmdsppRaw2?.cmdssp_fetch_pages_by_enrolltype
        //"https://68800e766659e6b2b28f47b46ad295.0f.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/06/workflows/46f2d8ce4af5432ca2505242cad07e2f/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4yrqkxjJ5UNPkU8izYt-BQJpyrZL4qEz37soq_ptySA"
        const response = await fetch(flowURL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    flowName: "fetch pages",
                },
                body: JSON.stringify({
                    enrollId: selectedEnrollType?.id,
                }),
            }
        );
        hideLoader()
        return response.json();
    }


    enrollmentTypes = await getEnrollmentTypes();
    enrollmentTypes = (enrollmentTypes || []).sort((a, b) => Number(a.code) - Number(b.code));
    renderEnrollmentTypes();

    getExistingMappingData = (f) => {
        let fldObj = existingMappings.find((rec) => rec.ctrlId == f.id && rec.visible);
        return fldObj;
    };

    function setconfigMapping(configData,type) {
        configData.pages.map((p) => {
            p.active = p.hasOwnProperty("active") ? p.active : existingMappings.some((rec) => rec.pageId == p.id && rec.visible);
            p.sections.map((s) => {
                s.active = s.hasOwnProperty("active") ? s.active : existingMappings.some((rec) => rec.secId == s.id && rec.visible);
                s.fields.map((f) => {
                    let fldObj = getExistingMappingData(f);
                    f.active = f.hasOwnProperty("active")
                        ? f.active
                        : existingMappings.some((rec) => rec.ctrlId == f.id && rec.visible);
                    f.required = f.hasOwnProperty("required")
                        ? f.required
                        : fldObj?.required && fldObj?.required == "True"
                          ? true
                          : false;
                    f.validate = f.hasOwnProperty("validate")
                        ? f.validate
                        : fldObj?.validate && fldObj?.validate == "True"
                          ? true
                          : false;
                });
            });
        });
        updatePageSectionFieldCounts(type)
    }
    function updatePageSectionFieldCounts(type) {
        if (!configData?.pages?.length) {
            return;
        }
        configData.pages.forEach((page) => {
            // Active sections count for page
            const pageMappings = existingMappings.filter((m) => m.pageId === page.id && m.visible);

            page.activeSectionCount = [...new Set(pageMappings.map((m) => m.secId))].length;
            if (page?.sections?.length) {
                page.activeSectionCount = page.sections.filter((sec) => sec.active).length;
            }


            page.sections.forEach((section) => {
                
                
              if (section?.fields?.length) {
                section.activeFieldCount = section.fields.filter((fld) => fld.active).length;
             }else{
                const sectionMappings = existingMappings.filter(
                    (m) => m.pageId === page.id && m.secId === section.id && m.visible
                );

                section.activeFieldCount = [...new Set(sectionMappings.map((m) => m.ctrlId))].length;
             }

            });
        });
        if(type=="sec") renderPages(true)
        if(type=="fld") renderSections(true)
    }




    document.addEventListener("change", function (e) {
        if (e.target.id === "iconUpload") {
            const file = e.target.files[0];

            if (!file) return;

                const allowedExtensions = ['png','jpg','jpeg'];
    const maxSizeMB = 10;
  // Check size
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > maxSizeMB) {
        cmdsppShowToast("error",`File size cannot exceed ${maxSizeMB} MB.`);
        $(this).val('');
        return;
    }

    // Check extension
    const extension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
        cmdsppShowToast("error",`Invalid file type. Allowed formats: ${allowedExtensions.join(', ')}` );
        $(this).val('');
        return;
    }
            const reader = new FileReader();

            reader.onload = function (ev) {                   
                imagePreview.src = ev.target.result;
                uploadContent.style.display = "none";
                previewWrapper.style.display = "block";
            };

            reader.readAsDataURL(file);
        }
    });

    function getFormFieldsHtml() {
        return `
      <!-- BUILDER -->
      <div class="builder">
        <!-- PAGES -->
        <div class="column PagesColumn">
          <div class="column-header"><span>Pages</span><span id="pagesCount" class="small-badge"></span></div>
          <div id="pagesList"></div>
        </div>
        <!-- SECTIONS -->
        <div class="column sectionColumn">
          <div class="column-header"><span> Sections </span><span id="selectedPageName"></span></div>
          <div id="sectionsList"></div>
        </div>
        <!-- FIELDS -->
        <div class="column fields-column">
          <div class="column-header field-head">
            <div class="column-header field-head-name"><span> Fields</span> <span id="selectedSecName"></span> </div>
            <div class="field-switches"><span id="requiredCount"> REQUIRED </span><span id="validatedCount"> VALIDATED </span></div>
          </div>
          <div id="fieldsList"></div>
          <div class="field-summary">
    <span id="selectedCountText">
        <span class="count-selectedcount">0</span> /
        <span class="count-selectedtotalfields">0</span> selected
    </span>

    <span class="summary-divider">|</span>

    <span id="requiredCountText">
        <span class="count-required">0</span> required
    </span>

    <span class="summary-divider">|</span>

    <span id="validatedCountText">
        <span class="count-validated">0</span> validated
    </span>

</div>
        </div>
      </div>`;
    }



    function getProviderTypeHtml() {
         selectedPrvCount = providers.filter((x) => x.active).length;

        const pvdHtml = `
        <div class="provider-type-wrapper">

            <div class="provider-type-header">

                <div>
                    <h3>
                        Provider Types
                        (${selectedPrvCount}/${providers.length} selected)
                    </h3>

                    <small>
                        Select all applicable provider type
                        for all selected enrollment type
                    </small>
                </div>

                <button
                    type="button"
                    class="add-provider-btn"
                    id="addProviderTypeBtn">
                    + Add Provider Type
                </button>

            </div>

            



            <div class="provider-type-container">
 

    <div class="provider-type-list" id="providerList">
        ${providers
            .map(
                (item) => `
            <div class="provider-row" data-name="${item.name.toLowerCase()}">
                <label>
                    <input
                        type="checkbox"
                        class="provider-checkbox"
                        data-id="${item.id}"
                        ${item.active ? "checked" : ""}>
                    <span>${item.type} - ${item.name}</span>
                </label>
            </div>
        `
            )
            .join("")}
    </div>
</div>


        </div>
    `;

        return pvdHtml;
    }



    function bindProviderEvents() {
        // document.getElementById("providerFilter").addEventListener("input", function () {
        //     const searchValue = this.value.toLowerCase();

        //     document.querySelectorAll(".provider-row").forEach((row) => {
        //         const providerName = row.dataset.name;
        //         row.style.display = providerName.includes(searchValue) ? "" : "none";
        //     });
        // });

        document.querySelectorAll(".provider-checkbox").forEach((box) => {
            box.addEventListener("change", function () {
                const provider = providers.find((x) => x.id === this.dataset.id);
                if (provider) {
                    isDataChange = true
                    provider.active = this.checked;
                    // const content = document.getElementById("tabContent");
                    // content.innerHTML = getProviderTypeHtml(); 
                    // bindProviderEvents();

                     selectedPrvCount = providers.filter((x) => x.active).length;
                const headerCountEl = document.querySelector(".provider-type-header h3");
                if (headerCountEl) {
                    headerCountEl.innerHTML = `
                        Provider Types
                        (${selectedPrvCount}/${providers.length} selected)
                    `;
                }
                }

            });
        });

       
    }

function validateReqDocument(docObj) {
  let errCount=0       
  let isExists = false;
         if(docObj.documentSelected!==newDocument){
           isExists = reqDocuments.some(doc=>doc.docTypeId===docObj.documentId) 
          }
        if(isExists){
            $("#documentList").addClass("error-border");
            $("#documentListUniqeError").show();
             $("#documentListError").hide();
            errCount++
        }
        if(!docObj.documentId){
           $("#documentList").addClass("error-border");
            $("#documentListError").show();
            errCount++
        }
        if(docObj.documentSelected===newDocument){
             $("#documentListError").hide();
             $("#documentList").removeClass("error-border");
            $("#documentListUniqeError").hide();
             isExists = reqDocuments.some(doc=>doc.docName===docObj.documentName|| doc.docType===docObj.documentName)
            if(!docObj.documentName){
            $("#documentName").addClass("error-border");
            $("#documentNameError").show();
            errCount++
           }else if(isExists){
            $("#documentName").addClass("error-border");
            $("#documentNameUniqueError").show();
             $("#documentNameError").hide();
             errCount++
           }
        }
        
        if(!docObj.esignature){
           $("#esignature").addClass("error-border");
            $("#esignatureError").show();
            errCount++
        }
        if(!docObj.conditional){
           $("#conditional").addClass("error-border");
            $("#conditionalError").show();
            errCount++
        }
         if (docObj.conditional === "Yes") {
            if(!docObj.fieldName){
            $("#fieldName").addClass("error-border");
            $("#fieldNameError").show();
            errCount++
           }
           if(!docObj.operator){
            $("#operator").addClass("error-border");
            $("#operatorError").show();
            errCount++
           }
           if(!docObj.value){
            $("#fieldValue").addClass("error-border");
            $("#fieldValueError").show();
            errCount++
           }

         }
        
    return errCount>0 ? false :true;
}



    document.addEventListener("click", async function (e) {
        
    });

function populateDropdown(selectId, data, placeholder = "Select") {
    const select = document.getElementById(selectId);

    select.innerHTML = `
        <option value="">${placeholder}</option>
        ${(data || []).map(item => {

            const label = item?.label || item?.name || "";

            const displayText =
                label.length > 50
                    ? label.substring(0, 50) + "..."
                    : label;

            return `
                <option
                    value="${item?.value || ""}"
                    title="${label}">
                    ${displayText}
                </option>
            `;
        }).join("")}
    `;
}

function bindFileUploads() {
    document.querySelectorAll(".upload-container").forEach(container => {
        const input = container.querySelector(".file-input");
        const uploadContent = container.querySelector(".upload-content");
        const previewWrapper = container.querySelector(".preview-wrapper");
        const preview = container.querySelector(".image-preview");
        const removeBtn = container.querySelector(".remove-image");

        container.addEventListener("click", () => {
            if (previewWrapper.style.display !== "block") {
                input.click();
            }
        });

        input.addEventListener("change", function () {
            const file = this.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = e => {
                preview.src = e.target.result;
                uploadContent.style.display = "none";
                previewWrapper.style.display = "block";
            };

            reader.readAsDataURL(file);
        });

        removeBtn.addEventListener("click", e => {
            e.stopPropagation();

            input.value = "";
            preview.src = "";

            previewWrapper.style.display = "none";
            uploadContent.style.display = "block";
        });
    });

}
function normalizeText(value) {
   return value.trim().replace(/\s+/g, " ");
}

function renderFormFieldsHtml(fields) {
    return fields.map(field => {
        const requiredMark = field.required
            ? '<span class="required">*</span>'
            : '';

        let inputHtml = '';

        switch (field.type.toLowerCase()) {
            case "text":
                inputHtml = `
                    <input
                        type="${field.dataType ? field.dataType : 'text'}"
                        id="${field.name}"
                        name="${field.name}"
                        class="form-control"
                        placeholder="${field.placeholder || ''}"
                        maxlength="${field.maxlength || ''}"
                    />
                    <span id="${field.name}Error" class="field-error text-danger" style="display:none;"></span>
                `;
                break;

           case "file":
    inputHtml = `
        <div class="upload-container" data-field="${field.name}">
            
            <input
                type="file"
                id="${field.name}"
                name="${field.name}"
                class="file-input"
                accept=".jpg,.jpeg,.png"
                hidden
            />

            <div class="upload-content">
                <div class="upload-icon"> <img src="/cmdspp_uploadDocument_icon" alt="upload"/></div>

                <p class="upload-title">
                    Drag & drop your icon here
                </p>

                <p class="upload-subtitle">
                    or click to browse from your computer
                </p>

                <div class="file-types">
                    <span>.jpeg</span>
                    <span>.png</span>
                    <span class="max-size">• max 10 MB</span>
                </div>
            </div>

            <div class="preview-wrapper" style="display:none;">
            <button type="button" class="remove-image">×</button>
                <img class="image-preview" src="" alt="Preview"/>
                
            </div>
        
        </div>
    `;
    break;
                break;

            case "textarea":
                inputHtml = `
                    <textarea
                        id="${field.name}"
                        name="${field.name}"
                        class="form-control"
                        placeholder="${field.placeholder || ''}"
                        maxlength="${field.maxlength || ''}"
                    ></textarea>
                `;
                break;

            case "select":
               inputHtml = `
                    <select
                        id="${field.name}"
                        name="${field.name}"
                        class="form-select"
                        placeholder="${field.placeholder || ''}"
                    >
                        <option value="">Select</option>
                        ${(field.options || [])
                            .map(opt => `
                                <option value="${opt.value}">
                                    ${opt.label}
                                </option>
                            `)
                            .join("")}
                    </select>
                    <span id="${field.name}Error" class="field-error text-danger" style="display:none;"></span>
                `;
                break;

            default:
               inputHtml = `
                    <input
                        type="text"
                        id="${field.name}"
                        name="${field.name}"
                        class="form-control"
                    />
                `;
        }

    return `
        <div class="mb-3 ${field.label}">
            <label class="form-label">
                ${field.label}
                ${requiredMark}
            </label>

            ${inputHtml}

            <span
                id="${field.name}Error"
                class="text-danger"
                style="display:none;"
            ></span>
        </div>
    `;
;
     
    }).join("");
}


function showFieldError(fieldName, message) {
    const errorEl = document.getElementById(`${fieldName}Error`);

    if (errorEl) {
        errorEl.innerText = message;
        errorEl.style.display = "block";
    }

    document.getElementById(fieldName)?.classList.add("error-border");
}

function clearFieldError(fieldName) {
    const errorEl = document.getElementById(`${fieldName}Error`);

    if (errorEl) {
        errorEl.innerText = "";
        errorEl.style.display = "none";
    }

    document.getElementById(fieldName)?.classList.remove("error-border");
}
function validateForm(fields,data) {
    let isValid = true;

    fields.forEach(field => {

        const value = document.getElementById(field.name)?.value?.trim();
        clearFieldError(field.name);
        
        field.validations?.forEach(validation => {
            if (validation.type === "required" &&!value) {
                showFieldError(field.name,validation.errMsg);
                isValid = false;
            }
            if (validation.type === "unique" && value && data?.length) {
                let isExists = data.some(t=>t[validation.key]===value)
                if(isExists){
                   showFieldError(field.name,validation.errMsg);
                  isValid = false;
                }
               
            }
            if (validation.type === "minLength" && value && value.length < 3) {
                showFieldError(field.name,validation.errMsg);
                isValid = false;
            }
            if(validation.type === "allowedExt" && field.type=="file"){
                const file = document.getElementById(field.name).files[0]
                if(file){
                const extension = file.name.split('.').pop().toLowerCase();
              if (!validation.allowedExtensions?.includes(extension)) {
                 showFieldError(field.name,validation.errMsg);
                 isValid = false;
              }else{
                 let size = document.getElementById(field.name)?.files[0]?.size;
                 size = size / (1024 * 1024)
                if (size && size > validation.size) {
                     showFieldError(field.name,validation.sizeErrMsg);
                     isValid = false;
                }
              }
                }
             
            }
            if(validation.type === "invalidChars" && value){
                const pattern = /^[A-Za-z0-9& -]+$/;
                if (!pattern.test(value)) {
                    showFieldError(field.name,validation.errMsg);
                    isValid = false;
                }
            }
        });
    });

    return isValid;
}

function validateProviderForm(providerCode,providerDesc) {
  let errCount=0
          let isExists = providers.some(p=>p.type===providerCode)
        if(isExists){
            $("#providerCode").addClass("error-border");
            $("#providerCodeUniqueError").show();
            errCount++
        }
        if(!providerCode){
           $("#providerCode").addClass("error-border");
            $("#providerCodeError").show();
            errCount++
        }else{
             $("#providerCode").removeClass("error-border");
           $("#providerCodeError").hide("");
        }
          if(!providerDesc){
           $("#providerDesc").addClass("error-border");
            $("#providerDescError").show();
            errCount++
        }else{
             $("#providerDesc").removeClass("error-border");
           $("#providerDescError").hide("");
        }
    return errCount>0 ? false :true;
}


    async function getDocumentDrpdwn(type, selectedField) {
        const docDrpDwnFlow = cmdsppRaw1?.cmdspp_fetch_document_dropdowns
            //"https://68800e766659e6b2b28f47b46ad295.0f.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/31/workflows/31cf4632f40a470cad7725545eb5b236/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=QwtH9gzOyh6_j98OkRSMSorsv6Rhml4niw3_NxPpWG0";
        // showLoader();
        showModalLoader();
        const response = await fetch(docDrpDwnFlow, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                flowName: "fetch docDrpDwnFlow",
            },
            body: JSON.stringify({ transType: type, fieldOptName: selectedField?.optionClm }),
        });
        // hideLoader();
        hideModalLoader();
        return response.json();
    }

function openModal(base64) {
     const isPdf = base64.startsWith("data:application/pdf")
    if(isPdf){
      document.getElementById("pdfViewer").src = base64;
      bootstrap.Modal.getOrCreateInstance(document.getElementById("pdfModal")).show();
    }else{
      document.getElementById("previewImage").src =base64;
       bootstrap.Modal.getOrCreateInstance(document.getElementById("imageModal")).show();
    }
}


async function dataLossConfirmDetach(id){
        showConfirmationModal(
           "Detach",
           "Are you sure you want to remove this document?",
            async function () {
                 await updateUploadedDocument("Detach",id)      
                 cmdsppShowToast("success", "Document removed successfully.");
            }
           );
}

document.addEventListener("click", async function (e) {
  
     if (e.target.closest("#uploadDocument")) {
          const id = e.target.closest("#uploadDocument")?.dataset.id;
             const fileInput = document.getElementById(`file_${id}`);
              if (fileInput) {
                fileInput.click();
               }
   
    }else if(e.target.closest("#editDocument")){
 const id = e.target.closest("#editDocument")?.dataset.id;
             const fileInput = document.getElementById(`file_${id}`);
              if (fileInput) {
                fileInput.click();
               }
   
    }
 else if (e.target.closest("#viewDocument")) {
      const id = e.target.closest("#viewDocument")?.dataset.id;
    let fileData =  await updateUploadedDocument("",id)
    openModal(fileData.fileContent)
 }else if (e.target.closest("#deleteDocument")) {
     const id = e.target.closest("#deleteDocument")?.dataset.id;
          const fileInput = document.getElementById(`file_${id}`);
          dataLossConfirmDetach(id)
 }else  if (e.target.closest("#closeDocument")) {
    bootstrap.Modal.getOrCreateInstance(document.getElementById("imageModal")).show();
     bootstrap.Modal.getOrCreateInstance(document.getElementById("pdfModal")).show();
 }
 else return
   
    
});

document.addEventListener("change", function (event) {
    if (!event.target.classList.contains("fileInput") && !event.target.classList.contains("fileAttach")) {
        return;
    }
    

    const file = event.target.files[0];

    if (!file) return;

    const allowedExtensions = ['pdf', 'doc', 'docx','png','jpg','jpeg'];
    const maxSizeMB = 10;
  // Check size
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > maxSizeMB) {
        cmdsppShowToast("error",`File size cannot exceed ${maxSizeMB} MB.`);
        $(this).val('');
        return;
    }

    // Check extension
    const extension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
        cmdsppShowToast("error",`Invalid file type. Allowed formats: ${allowedExtensions.join(', ')}` );
        $(this).val('');
        return;
    }

    const id = event.target.dataset.id;

    const reader = new FileReader();

    reader.onload = function (e) {
        const documentData = {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            fileContent: e.target.result.split(",")[1]
        };

        const doc = reqDocuments.find(d => d.id === id);
        if(event.target.classList.contains("fileAttach")) doc.update = true;
        if (doc) {
            doc.documentData = documentData;
            doc.esignature = true
        }
        attachedDocs[id] = documentData;

        console.log("Uploaded document:", reqDocuments);
        const row = event.target.closest(".document-row");
         const uploadCell = row.querySelector(".document-upload");
         uploadCell.innerHTML = `
                       ${doc.esignature && doc.documentData ?  
                          `<a javascript:void(0) class="uploadDocument" data-id="${doc.id}">${doc.documentData.fileName} </a>`
                          : 
                       doc.esignature && doc.fileName ?  
                          `<a javascript:void(0) class="uploadDocument" data-id="${doc.id}">${doc.fileName} </a>`
                          : 
                          doc.esignature ?  `<a javascript:void(0) class="uploadDocument" data-id="${doc.id}">${formatFileTxt} </a>`
                          :`<span class="disabled-upload">NA</span>`
                            }
                      `
        getReqDocumentsHtml(reqDocuments)
    };

    reader.readAsDataURL(file);
});

document.addEventListener("change", function (event) {
    const target = event.target;

    if (!target.matches(".document-esign input")) {
        return;
    }

    const id = target.dataset.id;
    const isChecked = target.checked;
    let docIndex = reqDocuments.findIndex(doc=>doc.id==id)
    if(docIndex>=0) {
        reqDocuments[docIndex]['esignature'] = isChecked
        reqDocuments[docIndex]['esignatureChg'] = true
    }
    const row = target.closest(".document-row");
    const uploadCell = row.querySelector(".document-upload");
    const actionsCell = row.querySelector(".document-actions");

    if (isChecked) {
        // Upload section
        uploadCell.innerHTML = `
            <a javascript:void(0) data-id="${id}">
              ${formatFileTxt}
            </a>
        `;

        // Actions section
        actionsCell.innerHTML = `
    <button type="button"
        class="icon-btn"
        title="Upload"
        id= "uploadDocument"
        data-id="${id}">
        <img src="/cmdspp_uploadIcon" id= "uploadDocument" data-id="${id}" Alt="upload"/> 
        
    </button>

    <input
        type="file"
        id="file_${id}"
        class="fileInput"
        data-id="${id}"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        style="display:none;">
`;

    } else {
        const doc = reqDocuments.find(d => d.id === id);
            uploadCell.innerHTML = `<span>NA</span>`;
            actionsCell.innerHTML = `<span>NA</span>`;
    }
});

function bindPagination() {

    document.getElementById("prevBtn")?.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
             renderTabContent()
        }
    });

    document.getElementById("nextBtn")?.addEventListener("click", () => {
        const totalPages = Math.ceil(reqDocuments.length / pageSize);

        if (currentPage < totalPages) {
            currentPage++;
            renderTabContent();
        }
    });

    document.querySelectorAll("#pageNumbers .page-btn")
        .forEach(btn => {
            btn.addEventListener("click", () => {
                currentPage = Number(btn.dataset.page);
                renderTabContent();
            });
        });
}

const pageSize = 3;
let currentPage = 1;

    async function getReqDocumentsHtml(reqDocuments = []) {
        const totalDocs = reqDocuments.length;
        const esignDocs = reqDocuments.filter((d) => d.esignature).length;
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const pageData = reqDocuments.slice(start, end);

        return `
        <div class="documents-container">

            <div class="document-summary">
                <span>${totalDocs} documents</span>
                <span>${esignDocs} e-signature required</span>

                <button
                    type="button"
                    id="addDocumentType"
                    class="add-document-btn">
                    + Add Document
                </button>
            </div>

            <div class="document-header">
                <div>DOCUMENT NAME</div>
                <div>E-SIGN</div>
                <div>UPLOADED FILE NAME</div>
                <div>CONDITION</div>
                <div></div>
            </div>

            <div class="document-list">

                ${pageData
                    .map(
                        (doc) => `
                    <div class="document-row" data-id="${doc.id}">
                        <div class="document-name">
                            <div class="title"> ${doc.docType===newDocument ? doc.docName : doc.docType}</div>
                           
                        </div>

                        <div class="document-esign">
                            <label class="switch">
                                <input type="checkbox" ${doc.esignature ? "checked" : ""} data-id="${doc.id}">
                                <span class="slider"></span>
                            </label>
                        </div>

                      <div class="document-upload">
                       ${doc.esignature && (doc.fileName || doc?.documentData?.fileName) ?  
                          `<a javascript:void(0) class="uploadDocument" data-id="${doc.id}">${doc.fileName || doc?.documentData?.fileName} </a>`
                          : 
                          doc.esignature ?  `<a javascript:void(0) class="uploadDocument" data-id="${doc.id}">${formatFileTxt} </a>`
                          :`<span class="disabled-upload">NA</span>`
                            }
                      </div>

                        <div class="document-condition"> ${doc.condition? "Yes" : "No"}</div>

         <div class="document-actions">
                ${doc.esignature && !doc.fileName  ? `
                <button type="button" class="icon-btn" id= "uploadDocument" title="Upload" data-id="${doc.id}"> <img src="/cmdspp_uploadIcon" Alt="upload"/>  </button>
               <input type="file" id="file_${doc.id}" class="fileInput" data-id="${doc.id}" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style="display:none;">`
              :
               doc.esignature? `
                    <button type="button" class="icon-btn viewDocument"  title="View"  id= "viewDocument" data-id="${doc.id}"> <img src="/cmdspp_viewIcon" Alt="view"/> </button>
                    <button type="button" class="icon-btn" id= "editDocument" title="Replace" data-id="${doc.id}"> <img src="/cmdspp_replaceIcon" Alt="replace"/>  </button>   
                    <input type="file" id="file_${doc.id}" class="fileAttach" data-id="${doc.id}" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style="display:none;">               
                    <button type="button" class="icon-btn" title="Detach" id= "deleteDocument" data-id="${doc.id}"> <img src="/cmdspp_detachIcon" Alt="detach"/> </button> `
                : `NA`
               }
         </div>
       </div> ` ).join("")}
            </div>
            ${getRequiredDocumentModalHtml()}
        </div>
        <div class="pagination-container">
    <span id="paginationInfo">
        Showing ${Math.min(end, reqDocuments.length)} of ${reqDocuments.length} documents
    </span>

    <div class="pagination-controls">
        <button id="prevBtn" class="page-btn" ${currentPage === 1 ? "disabled" : ""}>
            ←
        </button>

        <div id="pageNumbers">
            ${Array.from(
                { length: Math.ceil(reqDocuments.length / pageSize) },
                (_, i) => `
                    <button
                        class="page-btn ${currentPage === i + 1 ? "active" : ""}"
                        data-page="${i + 1}">
                        ${i + 1}
                    </button>
                `
            ).join("")}
        </div>

        <button
            id="nextBtn"
            class="page-btn"
            ${currentPage === Math.ceil(reqDocuments.length / pageSize) ? "disabled" : ""}
        >
            →
        </button>
    </div>
</div>
<div class="field-switches">
    <span id="totalDoc">
        <span class="legend-dot mandatory"></span>
        Mandatory - must be submitted by provider
    </span>

    <span id="esignDocs">
        <span class="legend-dot esign"></span>
        E-Signature - requires DocuSign signature
    </span>
</div>
 `;
    }

    document.addEventListener("change", async function (e) {
        if(e.target.id == "documentList"){
            const documentNameFld = document.getElementById("NewDocument");
            let documentSelected = documentDropDown.find(d=>d.value===e.target.value)?.label
             documentNameFld.style.display = documentSelected===newDocument ? "block" : "none";
        }
        if (e.target.id == "conditional") {
            if (e.target.value === "Yes") {
                if (!docFldList?.length) {
                    docFldList = await getDocumentDrpdwn("Fields");
                }

                populateDropdown("fieldName", docFldList);
            }
            const conditionFields = document.getElementById("conditionFields");
                document.getElementById("fieldName").value = "";
                document.getElementById("operator").value = "";
                document.getElementById("fieldValue").value = "";
            conditionFields.style.display = e.target.value === "Yes" ? "block" : "none";
        } else if (e.target.id == "fieldName") {
            const selectedField = docFldList.find((field) => field.value === e.target.value);
            selectedField.options = selectedField.options ? selectedField.options : []
            if (selectedField.type.contains("Dropdown")) {
                let dropDownList = [];
                if (selectedField?.optionClm) dropDownList = await getDocumentDrpdwn("Options", selectedField);
                populateDropdown("fieldValue", dropDownList);
                if(dropDownList?.length) selectedField.options = dropDownList
            }

            const container = document.getElementById("valueContainer");

            if (!selectedField) {
                container.innerHTML = `
            <select id="fieldValue" class="form-select">
                <option value="">Select</option>
            </select>
        `;
                return;
            }

            // Text field
            if (!selectedField.type.contains("Dropdown")) {
                container.innerHTML = `
            <input
                type="text"
                id="fieldValue"
                class = "form-control inputfieldvalue" 
                placeholder="Enter Value"
            />
        `;
            }

            // Dropdown field
            if (selectedField.type.contains("Dropdown")) {
                container.innerHTML = `
            <select id="fieldValue" class="form-select">
                <option value="">Select</option>

                ${selectedField.options
                    .map(
                        (option) => `
                    <option value="${option.value}">
                        ${option.label}
                    </option>
                `
                    )
                    .join("")}
            </select>
        `;
            }
        }
    });

function showModalLoader() {
    const loader = document.querySelector(".required-doc-loader");
    if (loader) loader.style.display = "flex";
}

function hideModalLoader() {
    const loader = document.querySelector(".required-doc-loader");
    if (loader) loader.style.display = "none";
}
 function getRequiredDocumentModalHtml() {
        return `
        <div class="modal fade"
             id="requiredDocumentModal"
             tabindex="-1">

            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="required-doc-loader">
                    <div class="required-doc-spinner"></div>
                </div>

                    <div class="modal-header border-0">
                        <div>
                            <h5>Add New Required Document</h5>
                            <small>
                                Add a new user to the Provider Connect portal
                            </small>
                        </div>

                        <button
                            type="button"
                            class="btn-close"
                            id = "cancelDocument"
                            data-bs-dismiss="modal"><img src="/cmdspp_closeIcon" alt="close"/>
                        </button>
                    </div>

                    <div class="modal-body">

                        <div class="mb-3">
                            <label class="form-label">Document List <span class= "required">*</span></label>
                            <select id="documentList" class="form-select">
                                <option>Select</option>
                            </select>
                            <span id="documentListError" class="text-danger" style="display: none;">Document List is required.</span>
                             <span id="documentListUniqeError" class="text-danger" style="display: none;">This document is already attached</span>
                        </div>

                        <div class="mb-3" id="NewDocument" style="display:none;">
                            <label class="form-label">
                                For New, Enter Document Name <span class= "required">*</span>
                            </label>

                            <input
                                type="text"
                                id="documentName"
                                class="form-control"
                                placeholder="Enter Text">
                                <span id="documentNameError" class="text-danger" style="display: none;">Document Name is required.</span>
                                <span id="documentNameUniqueError" class="text-danger" style="display: none;">This document is already attached</span>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">E-Signature <span class= "required">*</span></label>

                            <select id="esignature"
                                    class="form-select">
                                    <option value="">Select</option>
                                 <option>Yes</option>
                                <option>No</option>
                            </select>
                             <span id="esignatureError" class="text-danger" style="display: none;">E-Signature is required.</span>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Conditional <span class= "required">*</span></label>

                            <select id="conditional"
                                    class="form-select">
                                    <option value="">Select</option>
                                <option>Yes</option>
                                <option>No</option>
                            </select>
                            <span id="conditionalError" class="text-danger" style="display: none;">Conditional is required.</span>
                        </div>

                       <div id="conditionFields" style="display:none;">

    <div class="mb-3">
        <label class="form-label">Field Name <span class= "required">*</span></label>
        <select id="fieldName" class="form-select">
            <option value="">Select</option>
        </select>
         <span id="fieldNameError" class="text-danger" style="display: none;">Field Name is required.</span>
    </div>

    <div class="row">
        <div class="operatorvalue">
            <label class="form-label">Operator <span class= "required">*</span></label>
            <select id="operator" class="form-select">
                <option value="">Select</option>
                  <option value="1">=</option>
                   <option value="2">!=</option>
                   <option value="3">></option>
                     <option value="4"><</option>
                   <option value="5">>=</option>
                   <option value="6"><=</option>
            </select>
             <span id="operatorError" class="text-danger" style="display: none;">Operator is required.</span>
        </div>

        <div class="operatorvalue">
<label class="form-label">Value <span class= "required">*</span></label>
<div id="valueContainer">
<select id="fieldValue" class="form-select">
<option value="">Select</option>
</select>
<span id="fieldValueError" class="text-danger" style="display: none;">Value is required.</span>
</div>
        </div>
    </div>

</div>
                    </div>

                    <div class="modal-footer">

                        <button
                            type="button"
                            class="btn btn-outline-primary"
                            id = "cancelDocument"
                            >
                            Cancel
                        </button>

                        <button
                            type="button"
                            class="btn btn-primary"
                            id="submitRequiredDoc">
                            Submit
                        </button>

                    </div>

                </div>
            </div>
        </div>
    `;
    }

    document.getElementById("fileUpload")?.addEventListener("change", function () {
        const file = this.files[0];

        if (!file) return;

        const doc = documents.find((d) => d.id == window.currentDocId);

        if (doc) {
            doc.fileName = file.name;

            renderTabContent(); // re-render table

            bindDocumentEvents();
        }
    });

    function bindDocumentEvents() {
        document.querySelectorAll(".upload-link").forEach((link) => {
            link.addEventListener("click", function (e) {
                e.preventDefault();

                const docId = this.dataset.id;

                document.getElementById("fileUpload").click();

                window.currentDocId = docId;
            });
        });
    }

    async function renderTabContent() {
        const content = document.getElementById("tabContent");

        switch (activeTab) {
            case "formFields":
                content.innerHTML = getFormFieldsHtml();
                renderPages();

                break;

            case "requiredDocs":
               if(!reqDocuments?.length){
                   let savedList = await getConfigMapping("Documents");
                   reqDocuments = savedList?.docList;
               }          
                content.innerHTML = await getReqDocumentsHtml(reqDocuments);
                bindPagination();
                break;

            case "providerType":
                content.innerHTML = getProviderTypeHtml();
                bindProviderEvents();

                break;
        }
    }

    async function renderTabs() {
        document.getElementById("tabsContainer").innerHTML = tabs
            .map(
                (tab) => `
            <div
                class="tab ${activeTab === tab.id ? "active" : ""}"
                data-tab="${tab.id}">
                ${tab.label}
            </div>
        `
            )
            .join("");

        document.querySelectorAll(".tab").forEach((tab) => {
            tab.addEventListener("click", async () => {
                activeTab = tab.dataset.tab;
                renderTabs();
                renderTabContent();
            });
        });
    }

    async function renderEnrollmentTypes() {
        const cardGrid = document.getElementById("cardGrid");

        cardGrid.innerHTML = enrollmentTypes
            .map(
                (item) => `
        <div class="enrollment-card ${!item.status && "Disable-card"} ${item.id === 1 ? "active" : ""}" data-id="${item.id}">
          
       
          <div class="cmdspp-card-icon ">
 
<img src="${window.location.origin}${item.Icon || ""}"
alt="${item.title || ""}"
class="cmdspp-enrollment-icon"/>
</div>

          <div class="content">
            <h4>${item.title}</h4>
            <p>${item.description}</p>
          </div>

          ${
              item.id === 1
                  ? `<div class="check">
                    <img src="/cmdspp_selectedtile_icon" alt= "selected"/>
                 </div>`
                  : ""
          }
        </div>
      `
            )
            .join("");

        cardGrid.innerHTML += `
  <div class="add-enrollment-card" id="addEnrollTypeCard">
    <span>+ Add Type</span>
  </div>
`;

    bindEnrollEvents();
       
    }


    document.addEventListener("click", async function (e) {
        if (!e.target.closest("#addDocumentType")) return;
        if(!documentDropDown?.length) documentDropDown = await getDocumentDrpdwn("");
         documentDropDown =  (documentDropDown || []).sort((a, b) => Number(a.code) - Number(b.code));
         populateDropdown("documentList", documentDropDown);
        bootstrap.Modal.getOrCreateInstance(document.getElementById("requiredDocumentModal")).show();
        document.getElementById("conditional").value = "";
        document.getElementById("fieldName").value = "";
        document.getElementById("operator").value = "";
        document.getElementById("fieldValue").value = "";
        
        document.getElementById("conditionFields").style.display = "none";
    });

document.addEventListener("click", async (e) => {
    if(e.target.closest("#addEnrollTypeCard")){
     document.querySelector("#modalEnrollment").innerHTML = renderFormFieldsHtml(configForms.enrollmentFields);
     bindFileUploads();
     const modal = new bootstrap.Modal(document.getElementById("enrollmentTypeModal"));
     modal.show();
    }
    if(e.target.id==="addProviderTypeBtn"){
        $($("#cmdspp_p_pvd_typ")[0]).addClass("cmdspp-field-error");
        document.querySelector("#modalProvider").innerHTML = renderFormFieldsHtml(configForms.providerFields);
        bootstrap.Modal.getOrCreateInstance(document.getElementById("providerTypeModal")).show();
     }
    //  if (e.target.closest("#addDocumentType")){
    //     document.querySelector("#modalReqDocuments").innerHTML = renderFormFieldsHtml(configForms.documentFields);
    //     if(!documentDropDown?.length) documentDropDown = await getDocumentDrpdwn("");
    //      documentDropDown =  (documentDropDown || []).sort((a, b) => Number(a.code) - Number(b.code));
    //      populateDropdown("documentList", documentDropDown);
    //     bootstrap.Modal.getOrCreateInstance(document.getElementById("requiredDocumentModal")).show();
    //  }
     if(e.target.id==="submitEnrollment"){
        const enrollmentName = normalizeText(document.getElementById("enrollmentName").value);
        const subText = normalizeText(document.getElementById("enrollmentDesc").value);
        const toolTip = normalizeText(document.getElementById("tooltip").value);
        const file = document.getElementById("iconUpload")?.files[0];

        let isValid = validateForm(configForms.enrollmentFields,enrollmentTypes);
        if (!isValid) {return;}
       let enrollObj = {
            enrollmentName,
            subText,
            toolTip
        };
        if(file){
       const reader = new FileReader();
        reader.onload = async function () {
            // Base64 string without data:image/png;base64,
           enrollObj['formData'] = reader.result.split(',')[1];
           console.log(enrollObj);
           enrollmentSave(enrollObj)
           };
          reader.readAsDataURL(file);

        }else{
         enrollmentSave(enrollObj)
        }
     }
     if(e.target.id==="cancelEnrollment"){
        resetEnrollData();
     }
     if(e.target.id==="submitProvider"){
        const providerCode = document.getElementById("providerCode").value;
        const providerDesc = document.getElementById("providerDesc").value;

        let isValid = validateForm(configForms.providerFields,providers);

        if (!isValid) { return}

        let providerObj = {
            providerCode,
            providerDesc
        };
        const prvSaveResp = await saveEnrollPvdFlow("addProvider",providerObj)
        resetProviderData();
         let rec1 = {
        oldValue: "",
        newValue: providerObj.providerCode +" - "+ providerObj.providerDesc,
        fieldName: "Provider Type",
        operationType:"Create",
        modifiedBy: window.cmdsppUserId
        };
        auditFldsRecords.push(rec1)
        saveAudit("Create")
        let providersList = await getProviders()
        bindProviders(providersList)
        const content = document.getElementById("tabContent");
        content.innerHTML = getProviderTypeHtml(); 
        bindProviderEvents();
        cmdsppShowToast("success", "saved successfully");

     }
     if(e.target.id==="cancelProvider"){
        resetProviderData();
     }


});


    async function bindProviders(providersList){
        providers = providersList?.providers;
                existingProviders = providersList?.mappedProviders;
                providersList?.mappedProviders?.forEach((prv) => {
                    if (prv.status == 0) {
                        const prvIndx = providers.findIndex((p) => p.id === prv.pvdId);
                        providers[prvIndx].active = true;                        
                    }
                });
    }


async function changeEnrollType(card){
            isDataChange = false
             document.querySelectorAll(".enrollment-card").forEach((c) => c.classList.remove("active"));
                document.querySelectorAll(".check").forEach((c) => c.remove());
                card.classList.add("active");

                const check = document.createElement("div");
                check.className = "check";
                check.innerHTML = '<img src="/cmdspp_selectedtile_icon" alt= "selected"/>';

                card.appendChild(check);
           
       
                ////reset on enroll change
                selectedPage = null;
                selectedSection = null;
                providers = [];
                existingMappings = [];
                existingProviders = [];
                activeTab = "requiredDocs";
                docFldList = [];
                reqDocuments = [];
                selectedPrvCount = 0
                optFlds = []
                optionDomainName = []

                selectedEnrollType = enrollmentTypes.find((p) => p.id === card.dataset.id);
                selectedPage = null;
                selectedSection = null;
                    const [configMapping, providersList] = await Promise.all([
                    getConfigMapping(),
                    //getFormFields(),
                    getProviders(),
                ]);
                existingMappings = configMapping?.mappings;
                totalFldCount =  configMapping?.fieldCount;   
                //configData = {pages},             
                //configData.pages = (configData.pages || []).sort((a, b) => Number(a.order) - Number(b.order));
                //setconfigMapping(configData);
                bindProviders(providersList)
                renderTabs();
                renderTabContent();
}

    async function bindEnrollEvents() {
        const cards = document.querySelectorAll(".enrollment-card");

        cards.forEach(async (card) => {
            card.addEventListener("click", async () => {
              if(isDataChange){
                  showConfirmationModal(
                "Enrollment Change",
                "Changing the enrollment type may result in data loss. Continue?",
                function () {
                   changeEnrollType(card);
                }
               );
              }else{
                changeEnrollType(card);
              }           

            });
        });
    }


    function updateSectionFieldHeader(){
        if(!configData?.pages?.length){
           return;
        }
         let selectedPages = configData.pages.filter(p=>p.active).length
        let totalPages = configData.pages.length
        if(document.getElementById("pagesCount")) document.getElementById("pagesCount").innerText =`${selectedPages}/${totalPages}`;
        if(document.getElementById("selectedPageName")) document.getElementById("selectedPageName").innerText =`- ${selectedPage?.name}`;
        if(document.getElementById("selectedSecName")) document.getElementById("selectedSecName").innerText =`- ${selectedPage?.name}/${selectedSection?.name}`;
        
    }
    // =======================
    // PAGE RENDERING
    // =======================

    async function renderPages(isEdit) {
        //provider filter
        const pagesList = document.getElementById("pagesList");

        if (!pagesList) return;

        const enrollId = selectedEnrollType ? selectedEnrollType.id : null;

        const visiblePages = configData.pages;

        pagesList.innerHTML = "";

        visiblePages.forEach((page) => {
            pagesList.insertAdjacentHTML(
                "beforeend",
                `
            <div class="row-item page-item"
                 data-page-id="${page.id}">

                <input  class="active-toggle" type="checkbox"
                       ${page.active ? "checked" : ""}>

                <div>
                    <div>${page.name}</div>
                   <small>
    ${page.activeSectionCount || 0} active sections
</small>
                </div>
            </div>
            `
            );
        });

        bindPageEvents();

        if(!isEdit) selectedPage = visiblePages[0];
       
        renderSections(isEdit);

        if (!isEdit && selectedPage?.sections.length > 0) {
            selectedSection = selectedPage.sections[0];
            renderFields();            
        }
        if (selectedPage && document.querySelector(`[data-page-id="${selectedPage.id}"]`)) {
            document.querySelector(`[data-page-id="${selectedPage.id}"]`)?.classList.add("active-row");
            document.querySelector(`[data-section-id="${selectedSection.id}"]`)?.classList.add("active-row");
            updateSectionFieldHeader(); 

        }
    }

    // =======================
    // PAGE EVENTS
    // =======================

    async function bindPageEvents() {
        document.querySelectorAll(".page-item").forEach((item) => {
             const pageId = item.dataset.pageId;
             const pageIndx = configData?.pages.findIndex(x=>x.id==pageId)
            item.addEventListener("click", async () => {               
                selectPage(pageId);
            });
            item.querySelector(".active-toggle").addEventListener("change", function () {
                isDataChange = true
                configData.pages[pageIndx].active = this.checked;
                if(!this.checked){
                     configData.pages[pageIndx].sections.forEach(section => {
                      section.active = false;
                       section.fields.forEach(field => {
                      field.active = false;
                      });
                    });
                     renderSections()
                     selectedSection?.fields.filter(f=>f.active=false)
                     renderFields()
                }
                updateCounters();
                setconfigMapping(configData);
                
            });
        });
    }

    // =======================
    // SELECT PAGE
    // =======================

    async function selectPage(pageId) {
        document.querySelectorAll(".page-item").forEach((x) => x.classList.remove("active-row"));

        const currentPage = document.querySelector(`[data-page-id="${pageId}"]`);

        if (currentPage) {
            currentPage.classList.add("active-row");
        }

        const enrollId = selectedEnrollType ? selectedEnrollType.id : null;

        selectedPage = configData?.pages.find((x) => x.id === pageId);
        const pageIndx = configData.pages.findIndex((p) => p.id == pageId);
        renderSections();
        updateSectionFieldHeader();
    }

    // =======================
    // SECTIONS
    // =======================

    async function renderSections(isEdit) {

        const sectionsList = document.getElementById("sectionsList");

        sectionsList.innerHTML = "";
        renderFields();

        if (!sectionsList || !selectedPage) return;

        selectedPage.sections.forEach(async (section) => {
            sectionsList.insertAdjacentHTML(
                "beforeend",
                `
            <div class="row-item section-item"
                 data-section-id="${section.id}">

                <input  class="active-toggle" type="checkbox"  ${section.active ? "checked" : ""}>

                <div>
                    <div>${section.name}</div>
                   <small>
    ${section.activeFieldCount || 0} fields active
</small>
                </div>

            </div>
            `
            );
        });

        bindSectionEvents();

        if (!isEdit && selectedPage.sections.length > 0) {
            selectSection(selectedPage.sections[0].id);
        }
        if (selectedSection && document.querySelector(`[data-section-id="${selectedSection.id}"]`)) {
            document.querySelector(`[data-section-id="${selectedSection.id}"]`).classList.add("active-row");
            updateSectionFieldHeader();
        }
        
    }

    function bindSectionEvents() {
        document.querySelectorAll(".section-item").forEach((item) => {
            const sectionId = item.dataset.sectionId;
            const section = selectedPage.sections.find((x) => x.id === sectionId);
            item.addEventListener("click", () => {
                selectSection(sectionId);
            });
            item.querySelector(".active-toggle").addEventListener("change", function () {
            const pageIndx = configData.pages.findIndex((p) => p.id === selectedPage.id);
            const secIndx = configData.pages[pageIndx].sections.findIndex((s) => s.id == sectionId);
            configData.pages[pageIndx].sections[secIndx].active = this.checked;
            isDataChange = true
                 if(!this.checked){
                     configData.pages[pageIndx].sections[secIndx].fields.forEach(f => {
                     f.active = false;
                     });
                     renderFields()
                }
                updateCounters();
                setconfigMapping(configData,"sec");
            });
        });
    }

    async function selectSection(sectionId) {
        document.querySelectorAll(".section-item").forEach((x) => x.classList.remove("active-row"));

        const row = document.querySelector(`[data-section-id="${sectionId}"]`);

        row.classList.add("active-row");

        selectedSection = selectedPage.sections.find((s) => s.id === sectionId);
        renderFields();
        updateSectionFieldHeader();
    }

    // =======================
    // FIELDS
    // =======================

    function renderFields() {
        const fieldsList = document.getElementById("fieldsList");

        fieldsList.innerHTML = "";
        if (!fieldsList || !selectedSection) return;

        selectedSection.fields.forEach((field, index) => {
            fieldsList.insertAdjacentHTML(
                "beforeend",
                `
                <div class="field-card"
                     data-field-id="${field.id}">

                    <div class="field-left">

                        <input
                            type="checkbox"
                            class="active-toggle"
                            ${field.active ? "checked" : ""}
                        >

                        <span class="field-name-index">
                            ${index + 1}
                        </span>

                        <span class="field-name">
                            ${field.name}
                        </span>

                        <span class="tag select">
                            ${field.type}
                        </span>

                    </div>

                    <div class="toggles">

                       
                        <label class="switch">
                            <input
                              type="checkbox"
                              class="required-toggle"
                              ${field.required ? "checked" : ""}
                            >
                            <span></span>
                        </label>

                        <label class="switch">
                            <input
                              type="checkbox"
                              class="validated-toggle"
                              ${field.validate ? "checked" : ""}
                            >
                            <span></span>
                        </label>

                    </div>

                </div>
                `
            );
        });

        bindFieldEvents();

        updateCounters();
    }

    // =======================
    // FIELD EVENTS
    // =======================

    function bindFieldEvents() {
        document.querySelectorAll(".field-card").forEach((card) => {
            const fieldId = card.dataset.fieldId;
            // Number(
            //     card.dataset.fieldId
            // );

            const field = selectedSection.fields.find((x) => x.id === fieldId);

            card.querySelector(".required-toggle").addEventListener("change", function () {
                field.required = this.checked;
                isDataChange = true
                updateCounters();
            });

            card.querySelector(".validated-toggle").addEventListener("change", function () {
                field.validate = this.checked;
                isDataChange = true
                updateCounters();
            });

            card.querySelector(".active-toggle").addEventListener("change", function () {
                field.active = this.checked;
                isDataChange = true
                setconfigMapping(configData,"fld");
                updateCounters();
            });
        });
    }

    // =======================
    // COUNTERS
    // =======================

    function updateCounters() {
        let activeCount = 0;
        let requiredCount = 0;
        let validatedCount = 0;
        let selectedcount = 0;
        

        const enrollId = selectedEnrollType ? selectedEnrollType.id : null;
        configData?.pages.forEach((page) => {
            page.sections.forEach((section) => {
                section.fields.forEach((field) => {
                    if (field.active){ activeCount++, selectedcount++;}
                    if (field.required) requiredCount++;
                    if (field.validate) validatedCount++;
                });
            });
        });

        activeCount = existingMappings?.length;

        const counter = document.querySelector(".counter");

        if (counter) {
            counter.innerHTML = `${activeCount} / ${totalFldCount} fields active `;
        }
       const totalFields = selectedSection.fields.length;

        const selectedValue = document.getElementById("selectedCount");
       document.getElementById("selectedCountText").innerHTML =
`<span class="count-selectedcount">${selectedcount}</span> /
 <span class="count-selectedtotalfields">${totalFields}</span> selected`;

document.getElementById("requiredCountText").innerHTML =
`<span class="count-required">${requiredCount}</span> required`;

document.getElementById("validatedCountText").innerHTML =
`<span class="count-validated">${validatedCount}</span> validated`;


        if (selectedValue) {
            selectedValue.innerText = activeCount;
        }

      //  const requiredValue = document.getElementById("requiredCount");

        // if (requiredValue) {
        //     requiredValue.innerText = requiredCount;
        // }

        // const validatedValue = document.getElementById("validatedCount");

        // if (validatedValue) {
        //     validatedValue.innerText = validatedCount;
        // }

    }

    // =======================
    // SAVE
    // =======================

    function resetEnrollData() {
           bootstrap.Modal.getOrCreateInstance(document.getElementById("enrollmentTypeModal")).hide();
    }

    function resetProviderData(){
        bootstrap.Modal.getOrCreateInstance(document.getElementById("providerTypeModal")).hide();
    }
    function resetReqDocumentData(){
        $("#documentList").val("");
        $("#documentName").val("");
        $("#esignature").val("");
        $("#conditional").val("");
        $("#fieldName").val("");
        $("#operator").val("");
        $("#fieldValue").val("");

        $("#documentListError").hide();
         $("#documentListUniqeError").hide();
          $("#documentNameUniqueError").hide();         
        $("#documentNameError").hide();
         $("#esignatureError").hide();
        $("#conditionalError").hide();
         $("#fieldNameError").hide();
        $("#operatorError").hide();
         $("#valueError").hide();

        $("#documentList").removeClass("error-border");
        $("#documentName").removeClass("error-border");
        $("#esignature").removeClass("error-border");
        $("#conditional").removeClass("error-border");
        $("#fieldName").removeClass("error-border");
        $("#operator").removeClass("error-border");
        $("#fieldValue").removeClass("error-border");
        
        bootstrap.Modal.getOrCreateInstance(document.getElementById("requiredDocumentModal")).hide();
    }

    async function saveEnrollPvdFlow(action,payload){
        showModalLoader();
                const enrollSaveFlow = cmdsppRaw1?.cmdssp_add_enrollmentType
            //"https://68800e766659e6b2b28f47b46ad295.0f.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/01/workflows/6e2824ad69d9407198e26e539f77dbc8/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xtnaiuxA62W957JBIVZQRdHl8RWhdbTKMsyErgRv4qo";

        await fetch(enrollSaveFlow, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                flowName: "save enroll",
            },
            body: JSON.stringify({action,payload}),
        });

        hideModalLoader();
    }

    async function enrollmentSave(enrollObj){
         await saveEnrollPvdFlow("addEnroll",enrollObj)
           let rec1 = {
        oldValue: "",
        newValue: enrollObj.enrollmentName,
        fieldName: enrollObj.enrollmentName,
        operationType:"Create",
        modifiedBy: window.cmdsppUserId
        };
        auditFldsRecords.push(rec1)
        saveAudit("Create")
        resetEnrollData();
        enrollmentTypes = await getEnrollmentTypes();
        enrollmentTypes = (enrollmentTypes || []).sort((a, b) => Number(a.code) - Number(b.code));
        renderEnrollmentTypes();
        cmdsppShowToast("success", "saved successfully");
  
    }



        document.addEventListener("click", async function (e) {
        if (e.target.id === "submitRequiredDoc"){

        const documentId = document.getElementById("documentList")?.value;
        let esignature = document.getElementById("esignature")?.value;
        const conditional = document.getElementById("conditional")?.value;

        let fieldName = "";
        let operator = null;
        let value = "";
        let documentName = ""
        let documentSelected = documentDropDown.find(d=>d.value===documentId)?.label
        if(documentSelected===newDocument){
            documentName = document.getElementById("documentName")?.value;
        }

        if (conditional === "Yes") {
            fieldName = document.getElementById("fieldName")?.value;
            operator = document.getElementById("operator")?.value;
            value = document.getElementById("fieldValue")?.value;
        }

        const payload = {
            documentId,
            documentName,
            esignature,
            conditional,
            fieldName,
            operator,
            value,
            documentSelected
        };
         const isValid = await validateReqDocument(payload)
        if(!isValid) return
        if (payload.esignature === "Yes") payload.esignature = true;
        else payload.esignature = false;
         if (payload.conditional === "Yes") payload.conditional = true;
        else payload.conditional = false;

       
        console.log("Document Payload:", reqDocuments);
        let docResp = await addReqDoctoEnroll(payload);
        resetReqDocumentData() 
        updateHtmlAfterAction()       
    }else if(e.target.id === "cancelDocument"){
         resetReqDocumentData();
    }
               
    });

    async function updateHtmlAfterAction(){
         let savedList = await getConfigMapping("Documents");
        reqDocuments = savedList?.docList;
        if(attachedDocs){
            reqDocuments.forEach(d=>{
                if(attachedDocs[d.id]) d.documentData = attachedDocs[d.id]
            })
        }
        const container = document.getElementById("tabContent");
        container.innerHTML  = await getReqDocumentsHtml(reqDocuments);
        bindPagination()
    }


    async function formJsonAndSave() {
        const saveJsonFlow = cmdsppRaw1?.cmdssp_fetch_config_tbs
           // "https://68800e766659e6b2b28f47b46ad295.0f.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/21/workflows/3a35dc0b2b184aa3932ab31955d98476/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zZRqX_LZi4mwzZcV4txvGJ8NtmKDtNah21YYrv50N_Q";

        let response = await fetch(saveJsonFlow, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                flowName: "save config form fields json",
            },
            body: JSON.stringify({ enrollId: selectedEnrollType?.id }),
        });



        return response.json();
    }

function createRecord(record) {
   
    return new Promise((resolve, reject) => {
        webapi.safeAjax({
            type: "POST",
            url: "/_api/cmdspp_pc_enrol_typ_maps",
            contentType: "application/json",
             data: JSON.stringify({
                 'cmdspp_p_enrol_map_to_ctrl_fk@odata.bind': `/cmdspp_pc_ctrl_tbs(${record?.fieldId})`,
                 'cmdspp_p_enrol_map_to_enrol_fk@odata.bind':`/cmdspp_pc_enrol_typ_tbs(${selectedEnrollType?.id})`,
                 'cmdspp_p_enrol_map_to_pg_fk@odata.bind':`/cmdspp_pc_pg_tbs(${record?.pageId})`,
                 'cmdspp_p_enrol_map_to_section_fk@odata.bind':`/cmdspp_pc_section_tbs(${record?.secId})`,
                 'cmdspp_p_req_ind':record.required ? "True" : "False",
                 'cmdspp_p_validated_ind':record.validate ? "True" : "False",
                 'cmdspp_p_visible':record.visible,
            }),
            success: function (res, status, xhr) {
                resolve(xhr.getResponseHeader("entityid"));
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}

function updateRecord(record) {
    return new Promise((resolve, reject) => {
        webapi.safeAjax({
            type: "PATCH",
            url: `/_api/cmdspp_pc_enrol_typ_maps(${record.id})`,
            contentType: "application/json",
            data: JSON.stringify({
                 'cmdspp_p_req_ind':record.required ? "True" : "False",
                 'cmdspp_p_validated_ind':record.validate ? "True" : "False",
                 'cmdspp_p_visible':record.visible,
            }),
            success: function (res) {
                resolve(res);
            },
            error: reject
        });
    });
}

async function saveMapping(addRecords,updateRecords){
 const createPromises = addRecords.map(r => createRecord(r));
 const updatePromises = updateRecords.map(r =>updateRecord(r));

Promise.all([
    ...createPromises,
    ...updatePromises
])
.then(results => {
    saveFormJson();
})
.catch(error => {
    console.error("Operation failed", error);
});


 }
    async function saveUpdateFormFields(selectedControls, updateMappingRecs) {
        if (selectedControls?.length || updateMappingRecs?.length) {
            let flowUrl = cmdsppRaw2?.cmdssp_add_config_mappings
                //"https://68800e766659e6b2b28f47b46ad295.0f.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/15/workflows/66f98ddedbe840e59870a5356996b7b5/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=5GmgpeEIc9VAUsM539SLoEZpuCFoHtHmCQlThKTdgGw";
            showLoader();
            isAnyConfigSave = true          
            await saveMapping(selectedControls,updateMappingRecs)
            const latestMapping = await getConfigMapping();
            existingMappings = latestMapping?.mappings;
            hideLoader(); 
        }

        // if (updateMappingRecs?.length) {
        //     showLoader();
        //     let updateflowUrl = cmdsppRaw2?.cmdssp_update_config_mapping
        //         //"https://68800e766659e6b2b28f47b46ad295.0f.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/24/workflows/64661b2887e84f28badd4b789ce2a31e/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=DZGy0gcB5ShiOx2xN1dT3ZTT2hrFU1Ok8mBL0lQENwc";

        //     await fetch(updateflowUrl, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             flowName: "update config form fields",
        //         },
        //         body: JSON.stringify(updateMappingRecs),
        //     });

        //     const latestMapping = await getConfigMapping();
        //     existingMappings = latestMapping?.mappings;
        //     hideLoader();
        //     saveFormJson();
        // }        
         
    }

    async function addUpdatePvdDoc(payload){
        showLoader();
        isAnyConfigSave = true
        let prvflowUrl = cmdsppRaw1?.cmdssp_add_config_pvd_enroll
            //"https://68800e766659e6b2b28f47b46ad295.0f.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/17/workflows/a3c0822d99f94269867e23cb487546db/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2tHQFuQGoSMYKrl2aR4eRy2ku7pQGo272dUil2iAkUU";

        await fetch(prvflowUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                flowName: "save config provider",
            },
            body: JSON.stringify(payload),
        });
        const providersD = await getProviders()
        bindProviders(providersD)
        hideLoader();

    }

    async function addProvidertoEnroll(mappedProviders) {
        auditFldsRecords = []
        let newlyMappedPvds = [];
        const newlyUnMappedPvds = [];
        if (existingProviders?.length) {
            mappedProviders.forEach((mpr) => {
                let isPresent = existingProviders.some((pr) => pr.pvdId === mpr.id && pr.status == 0);
                if (!isPresent) newlyMappedPvds.push(mpr);
            });
            existingProviders.forEach((pr) => {
                let notPresent = !mappedProviders.some((mpr) => mpr.id === pr.pvdId);
                if (notPresent){
                     pr.name = providers.find(p=>p.id === pr.pvdId)?.name
                     pr.type = providers.find(p=>p.id === pr.pvdId)?.type
                     newlyUnMappedPvds.push(pr);
                } 
            });
        } else {
            newlyMappedPvds = mappedProviders;
        }

        let prvPayload = {
            enrollId: selectedEnrollType?.id,
            mappedProviders: newlyMappedPvds,
            unMappedProviders: newlyUnMappedPvds,
            transType: "AddProviders",
        };
        if(newlyMappedPvds?.length){
            newlyMappedPvds.map(p=>{
                auditFldsRecords.push({
                     oldValue: "",
                     newValue:  p.type+ " - " +p.name,
                     fieldName: selectedEnrollType?.title,
                     operationType:"Create",
                     modifiedBy: window.cmdsppUserId
                })
            })
        }
        if(newlyUnMappedPvds?.length){
              newlyUnMappedPvds.map(p=>{
                auditFldsRecords.push({
                     oldValue: p.type+ " - " + p.name,
                     newValue: "",
                     fieldName: selectedEnrollType?.title,
                     operationType:"Delete",
                     modifiedBy: window.cmdsppUserId
                })
            })
        }
        if(newlyMappedPvds?.length || newlyUnMappedPvds?.length) {
            await addUpdatePvdDoc(prvPayload)
            saveAudit("Create")
        }
        
        
    }

    async function addReqDoctoEnroll(docObj) {
        let docPayload = {
            enrollId: selectedEnrollType?.id,
            mappedProviders: [],
            unMappedProviders: [],
            transType: "AddDocument",
            documentData: docObj,
        };
      
       await addUpdatePvdDoc(docPayload)
       
    }

        async function updateUploadedDocument(type,id) {
        auditFldsRecords = []
        let docPayload = {
            enrollId: selectedEnrollType?.id,
            action: type,
            docList: reqDocuments.filter(doc=>doc.esignature && doc.documentData),
            docId:id,
            //enrollType:selectedEnrollType?.title
        };
        let isEsignChg = reqDocuments.some(d=>d.esignatureChg)
        if(type==="Upload" && !docPayload?.docList?.length && !isEsignChg){
            return false
        }
        if(!docPayload?.docList?.length && isEsignChg){
            docPayload.docList = reqDocuments.filter(doc=>doc.esignatureChg)
            docPayload.action = "Update"
        }
       showLoader();
       isAnyConfigSave = true
        let docflowUrl = cmdsppRaw1?.cmdspp_config_req_document
            //"https://68800e766659e6b2b28f47b46ad295.0f.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/20/workflows/09ba36046ced4c66a784729406a56f1b/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=18jjt7aTTpYjmJcK7n6VMTg4TCO4nzpqFd--bCdF_h4";
        
        let response =  await fetch(docflowUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                flowName: "document flow",
            },
            body: JSON.stringify(docPayload),
        });
        if(type==="Upload" && docPayload?.docList){
            docPayload?.docList.forEach(d=>{
                  auditFldsRecords.push({
                     oldValue: "",
                     newValue: d.docType,
                     fieldName: selectedEnrollType?.title,
                     operationType:d.fileName?"Update":"Create",
                     modifiedBy: window.cmdsppUserId
                })
            })    
         saveAudit("Create")
        }else if(type==="Detach"){
            let rec = reqDocuments.find(doc=>doc.id===id)
            if(rec){
                let auditRec = []
                auditRec.push({
                     oldValue: rec.docType,
                     newValue: "",
                     fieldName: selectedEnrollType?.title,
                     operationType:"Delete",
                     modifiedBy: window.cmdsppUserId
                })
                saveAudit("Create",auditRec)
            }
           
        }
        if(type){
          attachedDocs = {}
          updateHtmlAfterAction()
        }
        hideLoader();
        return response.json();
    }


function formAuditFieldsRecords(f, fldObj,type) {
    
   if(type=="Create"){
    let rec1 = {
        oldValue: "",
        newValue: f.name,
        fieldName: selectedEnrollType?.title,
        operationType:type,
        modifiedBy: window.cmdsppUserId
    };
    let rec2 = {
        oldValue: "",
        newValue: f.required ? "Required" : "",
        fieldName: selectedEnrollType?.title + "-" + f.name,
        operationType:type,
        modifiedBy: window.cmdsppUserId
    };
    let rec3 = {
        oldValue: "",
        newValue: f.validate ? "Validate" : "",
        fieldName: selectedEnrollType?.title + "-" + f.name,
        operationType:type,
        modifiedBy: window.cmdsppUserId
    };
    if(f.required && f.validate) auditFldsRecords.push(rec1,rec2,rec3)
    else if(f.required) auditFldsRecords.push(rec1,rec2)
    else if(f.validate) auditFldsRecords.push(rec1,rec3)
    else auditFldsRecords.push(rec1)

}else if(type=="Update"){
    let reqValChang = false
    let validateValChang = false
    if (f.required !== fldObj.required ) reqValChang = true
    if(f.validate !== fldObj.validate) validateValChang = true
    let rec1 = {
        oldValue: f.required ? "Not Required" : "Required",
        newValue: reqValChang && f.required ? "Required" : "Not Required",
        fieldName: selectedEnrollType?.title + "-" + f.name,
        operationType:type,
        modifiedBy: window.cmdsppUserId
    };
    let rec2 = {
        oldValue: f.validate ? "Not Validate" : "Validate",
        newValue: validateValChang && f.validate ? "Validate" : "Not Validate",
        fieldName: selectedEnrollType?.title + "-" + f.name,
        operationType:type,
        modifiedBy: window.cmdsppUserId
    };
     if(reqValChang && validateValChang) auditFldsRecords.push(rec1,rec2)
    else if(reqValChang) auditFldsRecords.push(rec1)
    else if(validateValChang) auditFldsRecords.push(rec2)

}else if(type=="Delete"){
     let rec1 = {
        oldValue: f.name,
        newValue: "",
        fieldName: selectedEnrollType?.title + "-" + f.name,
        operationType:type,
        modifiedBy: window.cmdsppUserId
    };
    auditFldsRecords.push(rec1)
}    
}

    async function saveAudit(action,auditRec){
        showLoader();
                const enrollSaveFlow = cmdsppRaw4?.cmdspp_fetch_configAudits

        await fetch(enrollSaveFlow, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                flowName: "save audit",
            },
            body: JSON.stringify({action,auditList:auditRec? auditRec :auditFldsRecords}),
        });
        hideLoader();
    }

    async function saveConfiguration() {
        
        auditFldsRecords = []
        if(!selectedEnrollType) return cmdsppShowToast("error", "Enrollment type required.");

         let eSignDoc = reqDocuments.some(doc=>doc.esignature && !doc.documentData && !doc.fileName)
        if(eSignDoc){
           return cmdsppShowToast("error", "Upload document is required.");
        }
       
        const mappingLookup = {};
        existingMappings.forEach((item) => {
            mappingLookup[item.ctrlId] = item;
        });


         const selectedControls = []
        // configData.pages.flatMap((page) =>
        //     page.sections.flatMap((section) =>
        //         section.fields
        //             .filter((field) => field.active && !mappingLookup[field.id])
        //             .map((field) => {
        //             selectedControls.push({
        //                 modifiedBy: window.cmdsppUserId,
        //                 fieldName:field.name,
        //                 enrollType:selectedEnrollType?.title,
        //                 id: field.id,
        //                 fieldId: field.id,
        //                 secId: section.id,
        //                 pageId: page.id,
        //                 enrollId: page.enrollId,
        //                 visible: true,
        //                 required: field.required,                        
        //                 validate: field.validate
        //               })
        //             formAuditFieldsRecords(field,field,"Create")
        //              }
        //             )
        //     )
        // );

         const fieldChanges = [];

        // configData.pages.forEach((p) => {
        //     p.sections.forEach((s) => {
        //         s.fields.forEach((f) => {
        //             if (f.active && mappingLookup[f.id]) {                        
        //                 let fldObj = mappingLookup[f.id];
        //                 if (fldObj.required === "True") fldObj.required = true;
        //                 if (fldObj.validate === "True") fldObj.validate = true;
        //                  if (fldObj.required === "False") fldObj.required = false;
        //                 if (fldObj.validate === "False") fldObj.validate = false;
        //                 if (f.required !== fldObj.required || f.validate !== fldObj.validate) {
        //                     fieldChanges.push({
        //                         id: mappingLookup[f.id]["id"],
        //                         required: f.required ? "True" : "False",
        //                         validate: f.validate ? "True" : "False",
        //                         visible: true,
        //                         name: f.name
        //                     });

        //                 }
        //                 formAuditFieldsRecords(f,fldObj,"Update")
        //             }
        //         });
        //     });
        // });
     console.log("auditFldsRecords*******",auditFldsRecords)
        const unSelectedControls = []
        //  configData.pages.flatMap((page) =>
        //     page.sections.flatMap((section) =>
        //         section.fields
        //             .filter((field) => !field.active && mappingLookup[field.id])
        //             .map((field) => {
        //              unSelectedControls.push({
        //                 fldId: field.id,
        //                 id: mappingLookup[field.id]["id"],
        //                 validate: mappingLookup[field.id]["validate"] ? mappingLookup[field.id]["validate"] : "false",
        //                 required: mappingLookup[field.id]["required"] ? mappingLookup[field.id]["required"] : "false",
        //                 name: field.name,
        //                 visible: false,
        //             })
        //             formAuditFieldsRecords(field,field,"Delete")
        //             }
                   
        //             )
        //     )
        // );


        const updateMappingRecs = [...fieldChanges, ...unSelectedControls];
        const mappedProviders = providers.filter((p) => p.active);
        if (!mappedProviders?.length) {
            return cmdsppShowToast("error", "Provider type is required.");
        } else {
           
            if (selectedControls?.length || updateMappingRecs?.length) {
                await saveUpdateFormFields(selectedControls, updateMappingRecs);
               
                saveAudit("Create")
                  //JSON SAVE FLOW CALL
                 
                //  showLoader()
                // setTimeout(() => {
                // hideLoader()
                // $("#infoModal").modal("show");
                // }, 9000);
              
            }
             await addProvidertoEnroll(mappedProviders);
             await updateUploadedDocument("Upload")
            if(isAnyConfigSave){
                 isDataChange = false
                isAnyConfigSave = false
                cmdsppShowToast("success", "Configuration saved successfully");
            } 
            else  cmdsppShowToast("error", "No changes made to save");
           
        }

       

    }

});

const placeholderSelectIds = ["documentList", "esignature", "conditional", "fieldName", "operator", "fieldValue"];

function updateSelectPlaceholderState(selectEl) {
    if (!selectEl) return;
    selectEl.classList.toggle("is-placeholder", !selectEl.value);
}

function refreshAllPlaceholderStates() {
    placeholderSelectIds.forEach(id => updateSelectPlaceholderState(document.getElementById(id)));
}

// live update on user interaction
document.addEventListener("change", function (e) {
    if (placeholderSelectIds.includes(e.target.id)) {
        updateSelectPlaceholderState(e.target);
    }
});

// auto-detect whenever these selects are added/replaced in the DOM (modal open, dropdown repopulated, etc.)
const placeholderObserver = new MutationObserver(() => {
    refreshAllPlaceholderStates();
});

placeholderObserver.observe(document.body, {
    childList: true,
    subtree: true
});