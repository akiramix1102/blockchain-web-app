(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-77525e56"],{"01a8":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"setting-activity"},[i("div",{staticClass:"box-mobile-app"},[i("div",{staticClass:"title-box"},[t._v(t._s(t.$t("setting.activity.title1")))]),i("div",{staticClass:"discription"},[t._v(t._s(t.$t("setting.activity.discript3")))]),i("base-table",{attrs:{data:t.dataTableMobile,showPagination:!1}},[i("el-table-column",{attrs:{label:"#",type:"index",align:"center",width:"40"}}),i("el-table-column",{attrs:{label:t.$t("setting.activity.signedIn"),prop:"createdAt",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(t._f("timeAgo")(e.row.createdAt)))])]}}])}),i("el-table-column",{attrs:{label:t.$t("setting.activity.ipAddress"),prop:"ipAddress",width:"160"}}),i("el-table-column",{attrs:{label:t.$t("setting.activity.source"),prop:"deviceName",width:"250"}}),i("el-table-column",{attrs:{label:t.$t("setting.activity.location"),prop:"metaDescription"}}),i("el-table-column",{attrs:{label:t.$t("setting.activity.current"),width:"164",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("div",{staticClass:"action"},[e.row.id===t.activityMobileCurent.id?i("base-icon",{attrs:{icon:"iconSuccess"}}):t._e()],1)]}}])}),i("el-table-column",{attrs:{label:"",width:"40",align:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("div",{staticClass:"action",on:{click:function(i){return t.handleDeleteActivity(e.row,"mobile")}}},[i("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"Sign out",placement:"bottom"}},[i("base-icon",{attrs:{icon:"iconDelete"}})],1)],1)]}}])})],1)],1),i("div",{staticClass:"hr"}),i("div",{staticClass:"box-sessions"},[i("div",{staticClass:"title-box"},[t._v(t._s(t.$t("setting.activity.title2")))]),i("div",{staticClass:"discription"},[t._v(" "+t._s(t.$t("setting.activity.discript4"))+" "),i("span",{staticClass:"link",on:{click:t.handleOpenPopup}},[t._v(t._s(t.$t("setting.activity.discript5")))])]),i("base-table",{attrs:{data:t.activityWeb,showPagination:!1}},[i("el-table-column",{attrs:{label:"#",type:"index",align:"center",width:"40"}}),i("el-table-column",{attrs:{label:t.$t("setting.activity.signedIn"),prop:"createdAt",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(t._f("timeAgo")(e.row.createdAt)))])]}}])}),i("el-table-column",{attrs:{label:t.$t("setting.activity.ipAddress"),prop:"ipAddress",width:"160"}}),i("el-table-column",{attrs:{label:t.$t("setting.activity.source"),prop:"deviceName",width:"250"}}),i("el-table-column",{attrs:{label:t.$t("setting.activity.location"),prop:"metaDescription"}}),i("el-table-column",{attrs:{label:t.$t("setting.activity.current"),width:"164",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("div",{staticClass:"action"},[e.row.id===t.activityWebCurent.id?i("base-icon",{attrs:{icon:"iconSuccess"}}):t._e()],1)]}}])}),i("el-table-column",{attrs:{label:"",width:"40",align:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("div",{staticClass:"action",on:{click:function(i){return t.handleDeleteActivity(e.row)}}},[i("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:t.$t("setting.activity.sign-out"),placement:"bottom"}},[i("base-icon",{attrs:{icon:"iconDelete"}})],1)],1)]}}])})],1)],1),i("popup-confirm",{on:{confirm:t.handleDeleteAllActivity}})],1)},n=[],c=i("d4ec"),s=i("bee2"),l=i("262e"),o=i("2caf"),r=i("9ab4"),u=i("1b40"),d=i("08ba"),b=i("9380"),p=i.n(b),v=i("9f48"),f=i("9ea4"),y=Object(d["a"])("activity"),h=function(t){Object(l["a"])(i,t);var e=Object(o["a"])(i);function i(){var t;return Object(c["a"])(this,i),t=e.apply(this,arguments),t.dataTable=[],t.activityWebCurent={},t.activityMobileCurent={},t.dataTableMobile=[],t}return Object(s["a"])(i,[{key:"activityMobiLe",get:function(){return p()(this.dataTable,(function(t){return"MOBILE"===t.sourceType}))}},{key:"activityWeb",get:function(){return p()(this.dataTable,(function(t){return"WEB"===t.sourceType}))}},{key:"created",value:function(){var t=this;y.getListActivity({sourceType:"WEB"}).then((function(e){t.dataTable=e.content,t.activityWebCurent=p()(t.dataTable,(function(t){return"WEB"===t.sourceType}))[0]})),y.getListActivity({sourceType:"MOBILE"}).then((function(e){t.dataTableMobile=e.content,t.activityMobileCurent=p()(t.dataTableMobile,(function(t){return"MOBILE"===t.sourceType}))[0]}))}},{key:"handleDeleteActivity",value:function(t){var e=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"web";y.deleteActivity(t.id).then((function(){var a=e.$i18n.t("notify.delete-success");e.$message.success({message:a,duration:5e3}),"web"===i?e.dataTable=p()(e.dataTable,(function(e){return e.id!==t.id})):e.dataTableMobile=p()(e.dataTableMobile,(function(e){return e.id!==t.id}))}))}},{key:"handleOpenPopup",value:function(){this.setOpenPopup({popupName:"popup-confirm-activity",isOpen:!0})}},{key:"handleDeleteAllActivity",value:function(){var t=this;y.deleteAllActivity().then((function(){var e=t.$i18n.t("notify.delete-success");t.$message.success({message:e,duration:5e3}),t.dataTable=p()(t.dataTable,(function(t){return"WEB"!==t.sourceType})),t.dataTable.push(t.activityWebCurent)}))}}]),i}(Object(u["b"])(v["a"]));h=Object(r["c"])([Object(u["a"])({components:{PopupConfirm:f["a"]}})],h);var m=h,g=m,_=(i("1a2a6"),i("2877")),C=Object(_["a"])(g,a,n,!1,null,"66bd48ad",null);e["default"]=C.exports},"1a2a6":function(t,e,i){"use strict";i("df3c")},"9ea4":function(t,e,i){"use strict";var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("base-popup",{staticClass:"popup-confirm-activity",attrs:{name:"popup-confirm-activity",width:"480px"}},[i("div",{attrs:{slot:"title"},slot:"title"},[i("span",[t._v(t._s(t.$t("setting.activity.delete")))])]),i("div",{staticClass:"content"},[i("h3",{staticClass:"text-2xl text-bold text-center",staticStyle:{"margin-bottom":"8px",color:"#0a0b0d"}},[t._v(t._s(t.$t("setting.activity.question-delete")))]),i("h4",{staticClass:"text-base text-center",staticStyle:{color:"#5b616e"}},[t._v(t._s(t.$t("setting.activity.warning")))])]),i("div",{staticClass:"footer",attrs:{slot:"footer"},slot:"footer"},[i("button",{staticClass:"btn-default mr-15 text-regular btn-h40 btn-reset",on:{click:t.hanldeReset}},[i("p",[t._v(t._s(t.$t("button.cancel")))])]),i("button",{staticClass:"btn-default-bg text-regular btn-h40 bg-delete bth-theme",on:{click:t.handleConfirm}},[t._v(t._s(t.$t("button.delete")))])])])},n=[],c=i("d4ec"),s=i("bee2"),l=i("262e"),o=i("2caf"),r=i("9ab4"),u=i("9f48"),d=i("1b40"),b=function(t){Object(l["a"])(i,t);var e=Object(o["a"])(i);function i(){return Object(c["a"])(this,i),e.apply(this,arguments)}return Object(s["a"])(i,[{key:"hanldeReset",value:function(){this.setOpenPopup({popupName:"popup-confirm-activity",isOpen:!1})}},{key:"handleConfirm",value:function(){this.$emit("confirm"),this.hanldeReset()}}]),i}(Object(d["b"])(u["a"]));b=Object(r["c"])([d["a"]],b);var p=b,v=p,f=(i("ee90"),i("2877")),y=Object(f["a"])(v,a,n,!1,null,"652c3614",null);e["a"]=y.exports},df3c:function(t,e,i){},eb75:function(t,e,i){},ee90:function(t,e,i){"use strict";i("eb75")}}]);