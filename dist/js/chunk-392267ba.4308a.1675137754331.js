(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-392267ba"],{"032a":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"staking-detail-view"},[a("div",{staticClass:"staking-detail__navigation"},[a("base-icon",{staticClass:"icon-back mr-12",attrs:{icon:"icon-arrow-left-black",size:"28"},nativeOn:{click:function(e){return t.$router.push({name:"Staking"})}}}),a("base-icon",{attrs:{icon:"icon-"+t.stakingCurrency.toLowerCase(),size:"24"}}),a("span",{staticClass:"navigation-header"},[t._v(t._s(t.stakingCurrency)+" - "+t._s(t.stakingPack.planName))])],1),a("div",{staticClass:"staking-detail__wrap-info"},[a("div",{staticClass:"staking-info-item left"},[a("div",{staticClass:"staking-amount-wrap"},[a("div",{staticClass:"title"},[t._v("Total staked amount")]),a("div",{staticClass:"total-amount"},[t._v(t._s(t._f("convertAmountDecimal")(t.stakingPack.totalStakedAmount,t.stakingCurrency))+" "+t._s(t.stakingCurrency))]),a("div",{staticClass:"total-amount-usd"},[t._v("~ $"+t._s(t._f("convertAmountDecimal")(t.getUsdValue(t.stakingPack.totalStakedAmount),"USD")))]),a("div",{staticClass:"info-item mt-32"},[a("div",{staticClass:"label"},[t._v("My staked amount")]),a("div",{staticClass:"value"},[t._v(" "+t._s(t._f("convertAmountDecimal")(t.stakingPack.userAmount,t.stakingCurrency))+" "+t._s(t.stakingCurrency)+" "),a("span",{staticStyle:{color:"#5b616e"}},[t._v("(~"+t._s(t.getPercentage(t.stakingPack.userAmount,t.stakingPack.totalStakedAmount))+"%)")])])]),a("div",{staticClass:"info-item mt-16"},[a("div",{staticClass:"label"},[t._v("Total investors")]),a("div",{staticClass:"value"},[t._v(t._s(t._f("formatNumber")(t.stakingPack.totalInvestor)))])])]),a("div",{staticClass:"staking-info-wrap"},[a("div",{staticClass:"info-item"},[a("div",{staticClass:"label"},[t._v("Duration")]),a("div",{staticClass:"value"},[t._v(t._s(t.stakingPack.durations)+" "+t._s(t.getDurationType(t.stakingPack.durationType,t.stakingPack.durations)))])]),a("div",{staticClass:"info-item mt-16"},[a("div",{staticClass:"label"},[t._v("APR")]),a("div",{staticClass:"value"},[t._v(t._s(t.stakingPack.aprPercent)+"%")])]),a("div",{staticClass:"info-item mt-16"},[a("div",{staticClass:"label"},[t._v("Interest distribution type")]),a("div",{staticClass:"value"},[t._v(t._s(t.getInterestType(t.stakingPack.interestType)))])]),a("div",{staticClass:"info-item mt-16"},[a("div",{staticClass:"label"},[t._v("Minimum amount")]),a("div",{staticClass:"value"},[t._v(t._s(t._f("convertAmountDecimal")(t.stakingPack.minAmount,t.stakingCurrency))+" "+t._s(t.stakingCurrency))])]),a("div",{staticClass:"info-item mt-16"},[a("div",{staticClass:"label"},[t._v("Maximum amount")]),a("div",{staticClass:"value"},[t._v(t._s(t._f("convertAmountDecimal")(t.stakingPack.maxQuantity,t.stakingCurrency))+" "+t._s(t.stakingCurrency))])]),a("div",{staticClass:"info-item mt-16"},[a("div",{staticClass:"label"},[t._v("Total amount")]),a("div",{staticClass:"value"},[t._v(t._s(t._f("convertAmountDecimal")(t.stakingPack.limitAmount,t.stakingCurrency))+" "+t._s(t.stakingCurrency))])])])]),a("div",{staticClass:"staking-info-item right"},[a("el-form",{staticClass:"form-staking",attrs:{rules:t.rules,model:t.stakingFormData}},[a("el-form-item",{staticClass:"mb-1",attrs:{prop:"amount"}},[a("el-input",{staticClass:"text-form-item",attrs:{disabled:!1,placeholder:"Enter staking amount"},on:{input:t.handleInputAmount},nativeOn:{keypress:function(e){return t.onlyNumber(e,"amount")},keyup:function(e){return t.numberFormat(e)}},model:{value:t.stakingFormData.amount,callback:function(e){t.$set(t.stakingFormData,"amount",e)},expression:"stakingFormData.amount"}}),a("div",{staticClass:"prefix prefix--amount"},[a("span",{staticClass:"text-form-item"},[t._v(t._s(t.stakingCurrency))])]),a("div",{staticClass:"be-flex jc-space-between w-100",attrs:{slot:"label"},slot:"label"},[a("span",{staticClass:"be-flex jc-space-center align-center"},[t._v(" Amount   "),a("span",{staticClass:"text-amount-min"},[t._v("(min: "),a("span",{class:"amount-"+t.stakingCurrency},[t._v(t._s(t._f("convertAmountDecimal")(t.stakingPack.minAmount,t.stakingCurrency))+" "+t._s(t.stakingCurrency))]),t._v(")")]),a("el-popover",{staticClass:"icon-information",attrs:{trigger:"click",placement:"bottom",popperClass:"amount-information"},model:{value:t.amountInfo,callback:function(e){t.amountInfo=e},expression:"amountInfo"}},[a("div",{attrs:{slot:"reference"},slot:"reference"},[a("base-icon",{staticClass:"be-flex",attrs:{icon:"icon-information",size:"16"}})],1),a("div",{staticClass:"content-popper"},[a("div",{staticClass:"nft-body-base cursor element"},[t._v(" "+t._s(t.$t("withdraw.information-1"))+" "),a("span",{class:"amount-"+t.stakingCurrency},[t._v(t._s(t._f("convertAmountDecimal")(t.stakingPack.minAmount,t.stakingCurrency))+" "+t._s(t.stakingCurrency))]),t._v(" "+t._s(t.$t("withdraw.information-2"))+" ")])])])],1),a("span",{staticClass:"text-avail-pc"},[t._v(t._s(t.$t("withdraw.available"))+": "),a("span",{class:"amount-"+t.stakingCurrency},[t._v(t._s(t._f("convertAmountDecimal")(t.stakingFormData.available,t.stakingCurrency))+" "+t._s(t.stakingCurrency))])]),a("span",{staticClass:"text-avail-mb"},[t._v(t._s(t.$t("withdraw.avail"))+" "),a("span",{class:"amount-"+t.stakingCurrency,staticStyle:{"margin-left":"2px"}},[t._v(t._s(t._f("convertAmountDecimal")(t.stakingFormData.available,t.stakingCurrency))+" "+t._s(t.stakingCurrency))])])])],1),a("div",{staticClass:"be-flex jc-space-between amount-option-tab mb-20"},t._l(t.percentOptions,(function(e){return a("div",{key:e,staticClass:"text-base cursor amount-item",class:e===t.percentSelected?"active":null,on:{click:function(a){return t.handleSelectPercent(e)}}},[a("span",[t._v(t._s(e)+"%")])])})),0),a("el-form-item",{staticClass:"mb-20"},[a("el-input",{staticClass:"text-form-item",attrs:{disabled:!0,placeholder:"Service fee",value:t.stakingServiceFee+" "+t.stakingCurrency}}),a("div",{staticClass:"prefix prefix--amount"},[a("span",{staticClass:"text-form-item"},[t._v("~ $"+t._s(t.stakingServiceFeeUsd))])]),a("div",{staticClass:"be-flex jc-space-between w-100",attrs:{slot:"label"},slot:"label"},[a("span",[t._v(" Service fee ("+t._s(t.stakingPack.feeAmount)+"%) ")])])],1),a("el-form-item",{staticClass:"mb-20",attrs:{label:t.$t("buy-nft.ref-code"),prop:"stakingReferralCode"}},[a("el-input",{attrs:{placeholder:t.$t("placeholder.ref-code"),readonly:!1},model:{value:t.stakingReferralCode,callback:function(e){t.stakingReferralCode=e},expression:"stakingReferralCode"}})],1),a("div",{staticClass:"form-stake-footer flex jc-space-between w-100"},[a("p",[t._v("You will reward")]),a("p",[t._v(t._s(t._f("convertAmountDecimal")(t.stakingReward,t.stakingCurrency))+" "+t._s(t.stakingCurrency))])]),a("p",{staticClass:"will-stake-usd text-right mb-20"},[a("span",[t._v("~ $"+t._s(t._f("convertAmountDecimal")(t.stakingRewardUsd,"USD")))])]),a("div",{staticClass:"chk-accept"},[a("el-checkbox",{model:{value:t.isCheckedTerm,callback:function(e){t.isCheckedTerm=e},expression:"isCheckedTerm"}},[a("div",{staticClass:"terms text-left mb-20",staticStyle:{"font-size":"14px","line-height":"24px",color:"var(--bc-text-discript)"}},[t._v(" "+t._s(t.$t("text-tern.click-confirm"))+" "),a("a",{staticStyle:{color:"var(--bc-theme-primary)","text-decoration":"none"},attrs:{href:t.getTerm,target:"#"==t.getTerm||""==t.getTerm?null:"_blank"}},[t._v(" "+t._s(t.$t("text-tern.term")))])])])],1),t.isLogin||t.walletAddress?a("el-button",{staticClass:"staking-btn is-none-border",class:t.disabledStaking?"btn--disabled btn-default-bg text-regular btn-h48 w-100 btn":"btn-default-bg text-regular btn-h48 w-100 btn",attrs:{loading:t.isLoadingStakingBtn,disabled:t.disabledStaking,type:"button"},on:{click:t.handleStaking}},[t._v(" Stake now ")]):a("el-button",{staticClass:"staking-btn is-none-border btn-default-bg text-regular btn-h48 w-100 btn",attrs:{type:"button"},on:{click:t.handleLogin}},[t._v(" Login ")])],1)],1)]),a("div",{staticClass:"staking-detail__wrap-descriptions"},[a("div",{staticClass:"tab-info"},[a("div",{staticClass:"be-scroll-custom list-item"},[a("div",{staticClass:"be-flex"},t._l(t.stakingTabsActive,(function(e){return a("div",{key:e.value,staticClass:"item",class:t.stakingTabActive===e.value?"active":null,on:{click:function(a){return t.handleChangeTab(e.value)}}},[t._v(" "+t._s(e.label)+" ")])})),0)])]),a("div",{staticClass:"tab-data"},[a("transition",{attrs:{name:"fade",mode:"out-in"}},["DETAIL"===t.stakingTabActive?a("div",{staticClass:"tab-details ck-text-description"},[a("div",{domProps:{innerHTML:t._s(t.stakingPack.description)}})]):"ALL_TXS"===t.stakingTabActive&&t.stakingTxs.length&&t.isDesktop?a("base-table",{key:"TABLE_ALL_TXS",staticClass:"base-table table-all-staking",attrs:{data:t.stakingTxs,table:t.query,isLoading:t.isLoading,showEmpty:!1,emptyText:"No data",paginationInfo:"transactions"},on:{sizeChange:t.handleSizeChange,currentChange:t.handleCurrentChange}},[a("el-table-column",{attrs:{label:t.$t("wallet.table.transaction"),prop:"transactionCode",width:"240"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",{staticClass:"be-flex align-center",staticStyle:{position:"relative"}},[a("span",{staticClass:"d-ib mr-2"},[t._v(t._s(t._f("formatTransactionCode")(e.row.transactionCode,5,5)))])])]}}])}),a("el-table-column",{attrs:{label:t.$t("wallet.table.date"),prop:"transactionDate",width:"260"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t._f("formatMMDDYY")(e.row.transactionDate)))])]}}])}),a("el-table-column",{attrs:{label:"From",prop:"from",width:"280"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",{staticClass:"user-data"},[a("img",{staticClass:"avatar",attrs:{src:e.row.avatar,alt:""}}),a("span",[t._v(t._s(e.row.userName))])])]}}])}),a("el-table-column",{attrs:{label:t.$t("wallet.table.type"),prop:"transactionType"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.transactionType.replaceAll("_"," ")))])]}}])}),a("el-table-column",{attrs:{label:t.$t("wallet.table.amount"),align:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return["STAKE"===e.row.transactionType?a("div",{staticClass:"amount-increase"},[a("span",[t._v("+"+t._s(t._f("convertAmountDecimal")(e.row.amount,e.row.currency))+" "+t._s(e.row.currency))]),a("span",{staticClass:"d-block amount-exchange-small"},[t._v("~$"+t._s(t._f("convertAmountDecimal")(t.getUsdValue(e.row.amount),"USD")))])]):a("div",{staticClass:"amount-decrease"},[a("span",[t._v("-"+t._s(t._f("convertAmountDecimal")(e.row.amount,e.row.currency))+" "+t._s(e.row.currency))]),a("span",{staticClass:"d-block amount-exchange-small"},[t._v("~$"+t._s(t._f("convertAmountDecimal")(t.getUsdValue(e.row.amount),"USD")))])])]}}])})],1):"MY_TXS"===t.stakingTabActive&&t.stakingTxs.length&&t.isDesktop?a("base-table",{key:"TABLE_MY_TXS",staticClass:"base-table table-all-staking",attrs:{data:t.stakingTxs,table:t.query,isLoading:t.isLoading,emptyText:"No data",showEmpty:!1,paginationInfo:"transactions"},on:{sizeChange:t.handleSizeChange,currentChange:t.handleCurrentChange}},[a("el-table-column",{attrs:{label:t.$t("wallet.table.transaction"),prop:"transactionCode",width:"260"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",{staticClass:"be-flex align-center",staticStyle:{position:"relative"}},[a("span",{staticClass:"d-ib mr-2"},[t._v(t._s(t._f("formatTransactionCode")(e.row.transactionCode,5,5)))])])]}}])}),a("el-table-column",{attrs:{label:t.$t("wallet.table.date"),prop:"transactionDate",width:"310"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t._f("formatMMDDYY")(e.row.transactionDate)))])]}}])}),a("el-table-column",{attrs:{label:t.$t("wallet.table.type"),prop:"transactionType",width:"210"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.transactionType.replaceAll("_"," ")))])]}}])}),a("el-table-column",{attrs:{label:t.$t("wallet.table.amount"),align:"right",width:"230"},scopedSlots:t._u([{key:"default",fn:function(e){return["STAKE"===e.row.transactionType?a("div",{staticClass:"amount-increase"},[a("span",[t._v("+"+t._s(t._f("convertAmountDecimal")(e.row.amount,e.row.currency))+" "+t._s(e.row.currency))]),a("span",{staticClass:"d-block amount-exchange-small"},[t._v("~$"+t._s(t._f("convertAmountDecimal")(t.getUsdValue(e.row.amount),"USD")))])]):a("div",{staticClass:"amount-decrease"},[a("span",[t._v("-"+t._s(t._f("convertAmountDecimal")(e.row.amount,e.row.currency))+" "+t._s(e.row.currency))]),a("span",{staticClass:"d-block amount-exchange-small"},[t._v("~$"+t._s(t._f("convertAmountDecimal")(t.getUsdValue(e.row.amount),"USD")))])])]}}])}),a("el-table-column",{attrs:{label:"",align:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[t.isShowUnstakeButton(e.row)?a("el-button",{staticClass:"btn-unstake",on:{click:function(a){return t.openPopupConfirmUnstake(e.row)}}},[t._v("Unstake")]):t._e()]}}])})],1):t.stakingTxs.length&&!t.isDesktop?a("TransactionMobile",{key:"TABLE_TXS_MOBILE",staticClass:"transaction-mobile",attrs:{data:t.stakingTxs,exchangeRate:t.exchangeRate,tabActive:t.stakingTabActive,query:t.query},on:{sizeChange:t.handleSizeChange,currentChange:t.handleCurrentChange,unstake:t.openPopupConfirmUnstake}}):0==t.stakingTxs.length?a("empty-block",{staticClass:"empty-block",attrs:{showNoData:""}}):t._e()],1)],1)]),a("popup-staking-success",{attrs:{amountNumber:t.stakingAmount,type:t.stakingType,currency:t.stakingCurrency},on:{"click-success":t.handleAfterStakingSuccess}}),a("popup-confirm-unstake",{on:{"click-confirm":t.handleUnstake}})],1)},s=[],i=a("1da1"),r=a("d4ec"),c=a("bee2"),o=a("262e"),l=a("2caf"),u=(a("96cf"),a("ac1f"),a("5319"),a("5b81"),a("d3b7"),a("25f0"),a("b680"),a("4de4"),a("7db0"),a("fb6a"),a("a9e3"),a("9ab4")),p=a("9f48"),d=a("2ef0"),m=a("1b40"),g=a("4bb5"),v=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"transaction-mobile"},[a("base-collapse-table",{attrs:{data:t.data},scopedSlots:t._u([{key:"top",fn:function(e){var n=e.transactionType,s=e.currency,i=e.amount;return[a("div",{staticClass:"be-flex align-center wrap-top"},[a("div",{staticClass:"be-flex jc-space-center align-center left"},[a("p",{staticClass:"text-0a0b0d text-body-small"},[t._v(t._s(n.charAt(0).toUpperCase()+n.slice(1).toLowerCase().replaceAll("_"," ")))])]),a("div",{staticClass:"right"},[a("div",{staticClass:"be-flex jc-space-center align-center"},["STAKE"===n?a("div",{staticClass:"amount-increase"},[a("p",{staticClass:"text-ec text-body-small"},[t._v("+"+t._s(t._f("convertAmountDecimal")(i,s))+" "+t._s(s))])]):a("div",{staticClass:"amount-decrease"},[a("span",[t._v("-"+t._s(t._f("convertAmountDecimal")(i,s))+" "+t._s(s))])])]),a("base-icon",{staticClass:"square-icon be-flex jc-center align-center",attrs:{icon:"icon-arrow-down-staking",size:"16"}})],1)])]}},{key:"bottom",fn:function(e){return[a("div",{staticClass:"list"},[a("div",{staticClass:"list-item"},[a("p",{staticClass:"text-body-small text-0a0b0d title"},[t._v("Transaction ID")]),a("p",{staticClass:"text-body-small",staticStyle:{color:"#201f1e"}},[t._v(t._s(t._f("formatTransactionCode")(e.transactionCode,5,5)))])]),a("div",{staticClass:"list-item"},[a("p",{staticClass:"text-body-small text-0a0b0d title"},[t._v("Date")]),a("p",{staticClass:"text-0a0b0d text-body-small text-0a0b0d"},[t._v(t._s(t._f("formatMMDDYY")(e.transactionDate)))])]),"ALL_TXS"===t.tabActive?a("div",{staticClass:"list-item"},[a("p",{staticClass:"text-body-small text-0a0b0d title"},[t._v("From")]),a("p",{staticClass:"text-ec text-body-small",staticStyle:{color:"#201f1e"},on:{click:function(a){return t.handleOpenDetail(e)}}},[t._v(t._s(e.userName))])]):t._e(),a("div",{staticClass:"list-item"},[a("p",{staticClass:"text-body-small text-0a0b0d title"},[t._v("Type")]),a("p",{staticClass:"text-ec text-body-small text-0a0b0d"},[t._v(t._s(e.transactionType.replaceAll("_"," ")))])]),a("div",{staticClass:"list-item"},[a("p",{staticClass:"text-body-small text-0a0b0d title"},[t._v("Amount")]),a("div",{staticClass:"text-ec text-body-small text-right"},["STAKE"===e.transactionType?a("div",{staticClass:"amount-increase"},[a("p",{staticClass:"text-ec text-body-small"},[t._v("+"+t._s(t._f("convertAmountDecimal")(e.amount,e.currency))+" "+t._s(e.currency))])]):a("div",{staticClass:"amount-decrease"},[a("span",[t._v("-"+t._s(t._f("convertAmountDecimal")(e.amount,e.currency))+" "+t._s(e.currency))])]),a("p",{staticClass:"text-xs text-5b616e"},[t._v("~$"+t._s(t._f("convertAmountDecimal")(t.getUsdValue(e.amount),"USD")))])])]),"MY_TXS"===t.tabActive&&t.isShowUnstakeButton(e)?a("el-button",{staticClass:"btn-unstake",on:{click:function(a){return t.$emit("unstake",e)}}},[t._v("Unstake")]):t._e()],1)]}}])},[0!=t.data.length?a("base-pagination",{attrs:{table:t.query,info:"transaction",popperClass:"staking-pagination",arrPageSize:[10,20,30,50],sizeChangeCustom:""},on:{sizeChange:t.handleSizeChange,currentChange:t.handleCurrentChange}}):t._e(),0==t.data.length?a("empty-block",{staticClass:"be-flex-column align-center",attrs:{showNoData:""}}):t._e()],1)],1)},k=[],b=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"base-collapse-table",style:t.data.length?null:"min-height:unset"},[t._l(t.data,(function(e){return a("div",{key:e.id,staticClass:"collapse-item",class:e.isShow?"row-active":null},[a("div",{staticClass:"top",on:{click:function(a){e.isShow=!e.isShow,t.$forceUpdate()}}},[t._t("top",null,null,e)],2),a("div",{staticClass:"bottom"},[t._t("bottom",null,null,e)],2)])})),t._t("default")],2)},h=[],f=function(t){Object(o["a"])(a,t);var e=Object(l["a"])(a);function a(){return Object(r["a"])(this,a),e.apply(this,arguments)}return Object(c["a"])(a)}(m["d"]);Object(u["c"])([Object(m["c"])({required:!1,type:Array,default:function(){return[]}})],f.prototype,"data",void 0),f=Object(u["c"])([m["a"]],f);var y=f,_=y,C=(a("99cb"),a("2877")),w=Object(C["a"])(_,b,h,!1,null,"943519d0",null),S=w.exports,x=a("0554"),A=a("dc94"),T=Object(g["a"])("beAuth"),D=function(t){Object(o["a"])(a,t);var e=Object(l["a"])(a);function a(){return Object(r["a"])(this,a),e.apply(this,arguments)}return Object(c["a"])(a,[{key:"getUsdValue",value:function(t){var e=0;return e="string"===typeof t?+t.replaceAll(",",""):+t,(e*+this.exchangeRate).toString()}},{key:"handleSizeChange",value:function(t){this.$emit("sizeChange",t)}},{key:"handleCurrentChange",value:function(t){this.$emit("currentChange",t)}},{key:"handleOpenDetail",value:function(t){}},{key:"isShowUnstakeButton",value:function(t){var e=t.transactionType,a=t.status,n=t.transactionDate,s=t.endStakeDate,i=t.unstakeDay,r=n+1e3*i*3600*24,c=Date.now();return"STAKE"===e&&"STAKE"===a&&r<s&&r<=c&&s>c&&!this.walletAddress}}]),a}(m["d"]);Object(u["c"])([Object(m["c"])({required:!1,type:Array,default:function(){return[]}})],D.prototype,"data",void 0),Object(u["c"])([Object(m["c"])({required:!1,type:String,default:""})],D.prototype,"exchangeRate",void 0),Object(u["c"])([Object(m["c"])({required:!1,type:String,default:""})],D.prototype,"tabActive",void 0),Object(u["c"])([Object(m["c"])({required:!1,type:Object,default:""})],D.prototype,"query",void 0),Object(u["c"])([T.State("walletAddress")],D.prototype,"walletAddress",void 0),D=Object(u["c"])([Object(m["a"])({components:{BaseCollapseTable:S,BasePagination:A["a"],EmptyBlock:x["a"]}})],D);var O=D,j=O,P=(a("6341"),a("7d76"),Object(C["a"])(j,v,k,!1,null,"6dafc589",null)),R=P.exports,L=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("base-popup",{staticClass:"popup-staking-success",attrs:{name:"popup-staking-success",width:"400px",open:t.handleOpen,close:t.handleClose,isShowFooter:!1}},[n("p",{staticClass:"header-popup",attrs:{slot:"title"},slot:"title"},[t._v(t._s(t.$t("detail-nft.popup-success.title")))]),n("div",{staticClass:"content"},[n("img",{staticClass:"img-success",attrs:{src:a("65f0c"),alt:""}}),n("div",{staticClass:"title-success text-base color-primary text-semibold"},["STAKING"===t.type?n("span",[t._v("You have successfully staked the amount")]):n("span",[t._v("You have successfully unstaked the amount")])]),n("div",{staticClass:"monney-transaction text-base text-semibold"},[t._v(t._s(t._f("convertAmountDecimal")(t.amountNumber,t.currency))+" "+t._s(t.currency))]),"STAKING"===t.type?n("div",{staticClass:"router_center router_setting mt-24",on:{click:t.handleOpenWallet}},[n("el-button",{staticClass:"btn is-none-border cursor btn-default-bg nft-header6 btn-theme btn-success"},[t._v(t._s(t.$t("button.go-to-wallet")))])],1):n("div",{staticClass:"router_center router_setting mt-24",on:{click:t.handleContinue}},[n("el-button",{staticClass:"btn is-none-border cursor btn-default-bg nft-header6 btn-theme btn-success"},[t._v(t._s(t.$t("button.continue")))])],1)])])},E=[],$=(Object(g["a"])("bcNft"),Object(g["a"])("beAuth"),function(t){Object(o["a"])(a,t);var e=Object(l["a"])(a);function a(){return Object(r["a"])(this,a),e.apply(this,arguments)}return Object(c["a"])(a,[{key:"handleOpen",value:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:case"end":return t.stop()}}),t)})));function e(){return t.apply(this,arguments)}return e}()},{key:"handleClose",value:function(){this.handleContinue()}},{key:"handleOpenWallet",value:function(){this.setOpenPopup({popupName:"popup-staking-success",isOpen:!1}),this.$router.push({path:"/wallet/".concat(this.currency)})}},{key:"handleContinue",value:function(){this.setOpenPopup({popupName:"popup-staking-success",isOpen:!1}),this.$emit("click-success")}}]),a}(Object(m["b"])(p["a"])));Object(u["c"])([Object(m["c"])({required:!0,type:String})],$.prototype,"currency",void 0),Object(u["c"])([Object(m["c"])({required:!0,type:Number})],$.prototype,"amountNumber",void 0),Object(u["c"])([Object(m["c"])({required:!0,type:String})],$.prototype,"type",void 0),$=Object(u["c"])([m["a"]],$);var N=$,I=N,U=(a("7886"),Object(C["a"])(I,L,E,!1,null,"01176a71",null)),F=U.exports,M=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("base-popup",{staticClass:"popup-confirm-unstake",attrs:{name:"popup-confirm-unstake",width:"480px",open:t.handleOpen,close:t.handleClose}},[a("p",{staticClass:"header-popup",attrs:{slot:"title"},slot:"title"},[t._v("UNSTAKE")]),a("div",{staticClass:"content"},[a("div",{staticClass:"title-text text-base color-primary text-regular"},[a("span",[t._v("Are you sure you want to unstake this transaction? This action cannot be undone. All your interest will be forfeited.")])])]),a("div",{staticClass:"footer",attrs:{slot:"footer"},slot:"footer"},[a("button",{staticClass:"cursor btn-default btn-success",on:{click:t.handleCancel}},[t._v(t._s(t.$t("button.cancel")))]),a("button",{staticClass:"btn is-none-border cursor btn-default-bg nft-header6 btn-theme btn-success",on:{click:t.handleContinue}},[t._v(t._s(t.$t("button.confirm")))])])])},Y=[],q=function(t){Object(o["a"])(a,t);var e=Object(l["a"])(a);function a(){return Object(r["a"])(this,a),e.apply(this,arguments)}return Object(c["a"])(a,[{key:"handleOpen",value:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:case"end":return t.stop()}}),t)})));function e(){return t.apply(this,arguments)}return e}()},{key:"handleClose",value:function(){}},{key:"handleContinue",value:function(){this.setOpenPopup({popupName:"popup-confirm-unstake",isOpen:!1}),this.$emit("click-confirm")}},{key:"handleCancel",value:function(){this.setOpenPopup({popupName:"popup-confirm-unstake",isOpen:!1})}}]),a}(Object(m["b"])(p["a"]));q=Object(u["c"])([m["a"]],q);var B=q,K=B,z=(a("1763"),Object(C["a"])(K,M,Y,!1,null,"70087445",null)),X=z.exports,W=a("1849"),G=a("3b19"),V=a("08ba"),H=a("4128"),Q=a.n(H),J=Object(g["a"])("beAuth"),Z=Object(g["a"])("beBase"),tt=Object(g["a"])("stakingStore"),et=Object(V["a"])("earn"),at=Object(V["a"])("wallet"),nt=function(t){Object(o["a"])(a,t);var e=Object(l["a"])(a);function a(){var t;return Object(r["a"])(this,a),t=e.apply(this,arguments),t.amountInfo=!1,t.percentSelected=null,t.percentOptions=[25,50,75,100],t.stakingFormData={amount:"",address:"",available:"1000",exchangeRate:.005},t.rules={amount:[{required:!0,message:" ",trigger:"blur"}]},t.isLoading=!1,t.isLoadingStakingBtn=!1,t.isCheckedTerm=!1,t.listExchangeRate=[],t.exchangeRateListener=null,t.stakingTabs=[{label:"Details",value:"DETAIL"},{label:"All transactions",value:"ALL_TXS"},{label:"My transactions",value:"MY_TXS"}],t.stakingTabActive="DETAIL",t.stakingTxs=[],t.stakingMyTxs=[],t.rowUnstake={},t.stakingType="STAKING",t.stakingAmount=0,t.stakingReferralCode="",t.query={page:1,limit:20,total:0},t}return Object(c["a"])(a,[{key:"amountNumber",get:function(){return+this.stakingFormData.amount.replaceAll(",","")}},{key:"stakingServiceFee",get:function(){var t=this.stakingFormData.amount.replaceAll(",","")||"0",e=Q.a.mul(t,this.stakingPack.feeAmount/100).toString();return e}},{key:"stakingServiceFeeFormat",get:function(){return Object(W["l"])(this.stakingServiceFee)}},{key:"stakingServiceFeeUsd",get:function(){var t=this.stakingFormData.amount.replaceAll(",",""),e=+t*(this.stakingPack.feeAmount/100),a=e*+this.exchangeRate;return Object(W["l"])(a.toFixed(2))}},{key:"stakingCurrency",get:function(){return this.stakingPack.currency||""}},{key:"disabledStaking",get:function(){return!this.isCheckedTerm||!this.stakingFormData.amount||+this.stakingFormData.amount.replaceAll(",","")<this.stakingPack.minAmount||""!==this.walletAddress}},{key:"stakingId",get:function(){var t;return(null===(t=this.$route.params)||void 0===t?void 0:t.stakingId)||""}},{key:"stakingTabsActive",get:function(){return this.isLogin?this.stakingTabs:this.stakingTabs.filter((function(t){return"MY_TXS"!==t.value}))}},{key:"stakingInterestType",get:function(){return this.stakingPack.interestType}},{key:"stakingDurationType",get:function(){return this.stakingPack.durationType}},{key:"stakingReward",get:function(){var t=+this.stakingFormData.amount.replaceAll(",","")||0,e={DAY:1,WEEK:7,MONTH:30,YEAR:365},a={DAILY:[365,1],WEEKLY:[52,7],MONTHLY:[12,30],YEARLY:[1,365]},n=a[this.stakingInterestType][0],s=e[this.stakingDurationType],i=a[this.stakingInterestType][1],r=this.stakingPack.durations*Math.round(s/i),c=t*this.stakingPack.aprPercent/100/n;return t+c*r}},{key:"stakingRewardUsd",get:function(){return this.stakingReward*+this.exchangeRate}},{key:"exchangeRate",get:function(){var t,e=this;return(null===(t=this.listExchangeRate.find((function(t){return t.currency===e.stakingCurrency})))||void 0===t?void 0:t.exchangeRate)||"0"}},{key:"init",value:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:case"end":return t.stop()}}),t)})));function e(){return t.apply(this,arguments)}return e}()},{key:"handleLogin",value:function(){this.$router.push({name:"login"})}},{key:"handleStaking",value:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){var e,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,e={stakingPlanId:this.stakingId,currency:this.stakingCurrency,amount:this.amountNumber,feeAmount:+this.stakingServiceFee,refUserCode:this.stakingReferralCode},this.isLoadingStakingBtn=!0,t.next=5,et.createNewStaking(e);case 5:a=t.sent,a&&(this.stakingAmount=this.amountNumber,this.stakingType="STAKING",this.setOpenPopup({popupName:"popup-staking-success",isOpen:!0})),this.isLoadingStakingBtn=!1,t.next=13;break;case 10:t.prev=10,t.t0=t["catch"](0),this.isLoadingStakingBtn=!1;case 13:case"end":return t.stop()}}),t,this,[[0,10]])})));function e(){return t.apply(this,arguments)}return e}()},{key:"handleUnstake",value:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){var e,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e={transactionCode:this.rowUnstake.transactionCode},t.next=3,et.unstake(e);case 3:a=t.sent,a&&(this.stakingType="UNSTAKING",this.stakingAmount=this.rowUnstake.amount,this.setOpenPopup({popupName:"popup-staking-success",isOpen:!0}));case 5:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}()},{key:"openPopupConfirmUnstake",value:function(t){console.log("open confirm"),this.rowUnstake=t,this.setOpenPopup({popupName:"popup-confirm-unstake",isOpen:!0})}},{key:"handleAfterStakingSuccess",value:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.initStakingPackData();case 2:return t.next=4,this.getAvailableBalance();case 4:this.stakingFormData.amount="",this.isCheckedTerm=!1,this.handleSelectStakingTab(this.stakingTabActive);case 7:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}()},{key:"handleSelectStakingTab",value:function(t){switch(t){case"DETAIL":return void this.getStakingDetail();case"ALL_TXS":return void this.getStakingAllTransations();case"MY_TXS":return void this.getStakingMyTransaction()}}},{key:"getStakingDetail",value:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:console.log("get staking detail");case 1:case"end":return t.stop()}}),t)})));function e(){return t.apply(this,arguments)}return e}()},{key:"getStakingAllTransations",value:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){var e;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return this.isLoading=!0,this.stakingTxs=[],t.next=4,et.getTransactionStaking(+this.stakingId,0,{page:this.query.page,limit:this.query.limit});case 4:e=t.sent,this.stakingTxs=(null===e||void 0===e?void 0:e.content)||[],this.query.total=(null===e||void 0===e?void 0:e.totalElements)||0,this.isLoading=!1;case 8:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}()},{key:"getStakingMyTransaction",value:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){var e,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!this.isLogin){t.next=10;break}return this.isLoading=!0,console.log("getStakingMyTransaction"),this.stakingTxs=[],t.next=6,et.getTransactionStaking(+this.stakingId,null===(e=this.user)||void 0===e?void 0:e.userId,{page:this.query.page,limit:this.query.limit});case 6:a=t.sent,this.stakingTxs=(null===a||void 0===a?void 0:a.content)||[],this.query.total=(null===a||void 0===a?void 0:a.totalElements)||0,this.isLoading=!1;case 10:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}()},{key:"getAvailableBalance",value:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){var e,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!this.isLogin){t.next=8;break}return t.next=3,at.getMyWallet({currency:this.stakingCurrency});case 3:a=t.sent,console.log(">>> / file: StakingDetail.vue:389 / rs",a),this.stakingFormData.available="".concat(null===(e=a[0])||void 0===e?void 0:e.assetBalances.availableBalance),t.next=9;break;case 8:this.stakingFormData.available="0";case 9:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}()},{key:"initStakingPackData",value:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){var e,a,n,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a=+(null===(e=this.$route.params)||void 0===e?void 0:e.stakingId),t.next=3,et.getStakingPackDetail(a);case 3:if(n=t.sent,s=null===n||void 0===n?void 0:n.content[0],s){t.next=9;break}return this.$message.error("Staking plan is not exist"),this.$router.push({name:"Staking"}),t.abrupt("return");case 9:this.setStakingPackData(s);case 10:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}()},{key:"getDurationType",value:function(t,e){switch(t){case"DAY":return 1==e?"day":"days";case"MONTH":return 1==e?"month":"months";case"WEEK":return 1==e?"week":"weeks";case"YEAR":return 1==e?"year":"years";default:var a=(null===t||void 0===t?void 0:t.charAt(0).toUpperCase())+(null===t||void 0===t?void 0:t.slice(1).toLowerCase())||"";return 1==e?a:"".concat(a,"s")}}},{key:"getInterestType",value:function(t){switch(t){case"DAILY":return"Daily Rewards";case"MONTHLY":return"Monthly Rewards";case"WEEKLY":return"Weekly Rewards";case"YEARLY":return"Yearly Rewards";default:return(null===t||void 0===t?void 0:t.charAt(0).toUpperCase())+(null===t||void 0===t?void 0:t.slice(1).toLowerCase())||""}}},{key:"getUsdValue",value:function(t){var e=0;return e="string"===typeof t?+t.replaceAll(",",""):+t,(e*+this.exchangeRate).toString()}},{key:"isShowUnstakeButton",value:function(t){var e=t.transactionType,a=t.status,n=t.transactionDate,s=t.endStakeDate,i=t.unstakeDay,r=n+1e3*i*3600*24,c=Date.now();return"STAKE"===e&&"STAKE"===a&&r<s&&r<=c&&s>c&&!this.walletAddress}},{key:"created",value:function(){var t=this;console.log("🚀 ~ file: StakingDetail.vue:322 ~ stakingPack",this.stakingPack),console.log("STAKING-DETAIL-CREATED");var e=G["a"].database().ref("exchange_rates");this.exchangeRateListener=e.on("value",(function(e){t.listExchangeRate=e.val()}))}},{key:"mounted",value:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return console.log("STAKING-DETAIL-MOUNTED"),t.next=3,this.initStakingPackData();case 3:return this.handleChangeTab("DETAIL"),t.next=6,this.getAvailableBalance();case 6:return t.abrupt("return");case 7:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}()},{key:"destroy",value:function(){var t=G["a"].database().ref("exchange_rates");t.off(this.exchangeRateListener)}},{key:"getTerm",get:function(){return this.urlSystem["system.token.terms"]||""}},{key:"getIndex",get:function(){return this.query.limit*(this.query.page-1)+1}},{key:"handleSizeChange",value:function(t){this.query.page=1,this.query.limit=t,this.handleSelectStakingTab(this.stakingTabActive)}},{key:"handleCurrentChange",value:function(t){this.query.page=t,this.handleSelectStakingTab(this.stakingTabActive)}},{key:"handleChangeTab",value:function(t){this.stakingTabActive=t,this.resetQuery(),this.handleSelectStakingTab(t)}},{key:"handleSelectPercent",value:function(t){if(this.percentSelected===t)this.percentSelected=null,this.stakingFormData.amount="";else{var e;this.percentSelected=t;var a=Number(this.stakingFormData.available.replaceAll(",","")),n=t*a/100;this.stakingFormData.amount=null===(e=this.$options.filters)||void 0===e?void 0:e.convertAmountDecimal(n,this.stakingCurrency);Number(this.stakingFormData.amount.replaceAll(",",""))}}},{key:"handleInputAmount",value:function(t){Number(t.replaceAll(",",""));this.percentSelected=null}},{key:"onlyNumber",value:function(t,e){var a=t.keyCode?t.keyCode:t.which;(a<48||a>57)&&46!==a&&t.preventDefault(),46===a&&Object(d["includes"])(this.stakingFormData[e],".")&&t.preventDefault()}},{key:"numberFormat",value:function(t){var e,a=t,n=a.target.value;n.length>0&&(n=n.replaceAll(",",""),n=null===(e=this.$options.filters)||void 0===e?void 0:e.numberWithCommas(n),a.target.value=n)}},{key:"convertWeiToAmount",value:function(t,e){var a=Object(W["n"])(e||this.stakingCurrency);return(+t/Math.pow(10,a)).toString()}},{key:"resetQuery",value:function(){this.query={page:1,limit:10,total:0}}},{key:"getPercentage",value:function(t,e){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2;return e<=0||t<0?(0).toFixed(a):(t/e*100).toFixed(a)}}]),a}(Object(m["b"])(p["a"]));Object(u["c"])([J.State("user")],nt.prototype,"user",void 0),Object(u["c"])([J.Getter("isLogin")],nt.prototype,"isLogin",void 0),Object(u["c"])([Z.State("urlSystem")],nt.prototype,"urlSystem",void 0),Object(u["c"])([Z.State("isDesktop")],nt.prototype,"isDesktop",void 0),Object(u["c"])([tt.State("stakingPack")],nt.prototype,"stakingPack",void 0),Object(u["c"])([tt.State("allStakingPack")],nt.prototype,"allStakingPack",void 0),Object(u["c"])([J.State("walletAddress")],nt.prototype,"walletAddress",void 0),Object(u["c"])([tt.Mutation("SET_STAKING_PACK_DATA")],nt.prototype,"setStakingPackData",void 0),nt=Object(u["c"])([Object(m["a"])({components:{PopupStakingSuccess:F,PopupConfirmUnstake:X,TransactionMobile:R,EmptyBlock:x["a"]}})],nt);var st=nt,it=st,rt=(a("5a3c"),a("5eec"),Object(C["a"])(it,n,s,!1,null,"246b43d5",null));e["default"]=rt.exports},1763:function(t,e,a){"use strict";a("41e8")},"41e8":function(t,e,a){},"5a3c":function(t,e,a){"use strict";a("eaf0")},"5eec":function(t,e,a){"use strict";a("ee15")},6341:function(t,e,a){"use strict";a("6b2b")},"6b2b":function(t,e,a){},7767:function(t,e,a){},7886:function(t,e,a){"use strict";a("7767")},"7d76":function(t,e,a){"use strict";a("d3a8")},"99cb":function(t,e,a){"use strict";a("ac18")},ac18:function(t,e,a){},d3a8:function(t,e,a){},eaf0:function(t,e,a){},ee15:function(t,e,a){}}]);