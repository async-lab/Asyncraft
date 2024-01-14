"use strict";(self.webpackChunkasyncraft=self.webpackChunkasyncraft||[]).push([[7920],{2027:(e,t,r)=>{r.r(t),r.d(t,{default:()=>$});var s=r(7294),a=r(2263),n=r(2045),c=r(5742),l=r(3692),o=r(5999);const u=["zero","one","two","few","many","other"];function h(e){return u.filter((t=>e.includes(t)))}const i={locale:"en",pluralForms:h(["one","other"]),select:e=>1===e?"one":"other"};function m(){const{i18n:{currentLocale:e}}=(0,a.Z)();return(0,s.useMemo)((()=>{try{return function(e){const t=new Intl.PluralRules(e);return{locale:e,pluralForms:h(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".\nDocusaurus will fallback to the default (English) implementation.\nError: ${t.message}\n`),i}}),[e])}function d(){const e=m();return{selectMessage:(t,r)=>function(e,t,r){const s=e.split("|");if(1===s.length)return s[0];s.length>r.pluralForms.length&&console.error(`For locale=${r.locale}, a maximum of ${r.pluralForms.length} plural forms are expected (${r.pluralForms.join(",")}), but the message contains ${s.length}: ${e}`);const a=r.select(t),n=r.pluralForms.indexOf(a);return s[Math.min(n,s.length-1)]}(r,t,e)}}var p=r(2850),g=r(6550),x=r(2389),f=r(1029);const y=function(){const e=(0,x.Z)(),t=(0,g.k6)(),r=(0,g.TH)(),{siteConfig:{baseUrl:s}}=(0,a.Z)(),n=e?new URLSearchParams(r.search):null,c=n?.get("q")||"",l=n?.get("ctx")||"",o=n?.get("version")||"",u=e=>{const t=new URLSearchParams(r.search);return e?t.set("q",e):t.delete("q"),t};return{searchValue:c,searchContext:l&&Array.isArray(f.Kc)&&f.Kc.some((e=>"string"==typeof e?e===l:e.path===l))?l:"",searchVersion:o,updateSearchPath:e=>{const r=u(e);t.replace({search:r.toString()})},updateSearchContext:e=>{const s=new URLSearchParams(r.search);s.set("ctx",e),t.replace({search:s.toString()})},generateSearchPageLink:e=>{const t=u(e);return`${s}search?${t.toString()}`}}};var S=r(22),C=r(8202),j=r(2539),I=r(726),v=r(1073),w=r(311),R=r(3926);const P={searchContextInput:"searchContextInput_mXoe",searchQueryInput:"searchQueryInput_CFBF",searchResultItem:"searchResultItem_U687",searchResultItemPath:"searchResultItemPath_uIbk",searchResultItemSummary:"searchResultItemSummary_oZHr",searchQueryColumn:"searchQueryColumn_q7nx",searchContextColumn:"searchContextColumn_oWAF"};var b=r(51),_=r(5893);function F(){const{siteConfig:{baseUrl:e},i18n:{currentLocale:t}}=(0,a.Z)(),{selectMessage:r}=d(),{searchValue:n,searchContext:l,searchVersion:u,updateSearchPath:h,updateSearchContext:i}=y(),[m,g]=(0,s.useState)(n),[x,j]=(0,s.useState)(),[I,v]=(0,s.useState)(),R=`${e}${u}`,F=(0,s.useMemo)((()=>m?(0,o.I)({id:"theme.SearchPage.existingResultsTitle",message:'Search results for "{query}"',description:"The search page title for non-empty query"},{query:m}):(0,o.I)({id:"theme.SearchPage.emptyResultsTitle",message:"Search the documentation",description:"The search page title for empty query"})),[m]);(0,s.useEffect)((()=>{h(m),x&&(m?x(m,(e=>{v(e)})):v(void 0))}),[m,x]);const $=(0,s.useCallback)((e=>{g(e.target.value)}),[]);return(0,s.useEffect)((()=>{n&&n!==m&&g(n)}),[n]),(0,s.useEffect)((()=>{!async function(){const{wrappedIndexes:e,zhDictionary:t}=!Array.isArray(f.Kc)||l||f.pQ?await(0,S.w)(R,l):{wrappedIndexes:[],zhDictionary:[]};j((()=>(0,C.v)(e,t,100)))}()}),[l,R]),(0,_.jsxs)(s.Fragment,{children:[(0,_.jsxs)(c.Z,{children:[(0,_.jsx)("meta",{property:"robots",content:"noindex, follow"}),(0,_.jsx)("title",{children:F})]}),(0,_.jsxs)("div",{className:"container margin-vert--lg",children:[(0,_.jsx)("h1",{children:F}),(0,_.jsxs)("div",{className:"row",children:[(0,_.jsx)("div",{className:(0,p.Z)("col",{[P.searchQueryColumn]:Array.isArray(f.Kc),"col--9":Array.isArray(f.Kc),"col--12":!Array.isArray(f.Kc)}),children:(0,_.jsx)("input",{type:"search",name:"q",className:P.searchQueryInput,"aria-label":"Search",onChange:$,value:m,autoComplete:"off",autoFocus:!0})}),Array.isArray(f.Kc)?(0,_.jsx)("div",{className:(0,p.Z)("col","col--3","padding-left--none",P.searchContextColumn),children:(0,_.jsxs)("select",{name:"search-context",className:P.searchContextInput,id:"context-selector",value:l,onChange:e=>i(e.target.value),children:[f.pQ&&(0,_.jsx)("option",{value:"",children:(0,o.I)({id:"theme.SearchPage.searchContext.everywhere",message:"everywhere"})}),f.Kc.map((e=>{const{label:r,path:s}=(0,b._)(e,t);return(0,_.jsx)("option",{value:s,children:r},s)}))]})}):null]}),!x&&m&&(0,_.jsx)("div",{children:(0,_.jsx)(w.Z,{})}),I&&(I.length>0?(0,_.jsx)("p",{children:r(I.length,(0,o.I)({id:"theme.SearchPage.documentsFound.plurals",message:"1 document found|{count} documents found",description:'Pluralized label for "{count} documents found". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)'},{count:I.length}))}):(0,_.jsx)("p",{children:(0,o.I)({id:"theme.SearchPage.noResultsText",message:"No documents were found",description:"The paragraph for empty search result"})})),(0,_.jsx)("section",{children:I&&I.map((e=>(0,_.jsx)(A,{searchResult:e},e.document.i)))})]})]})}function A(e){let{searchResult:{document:t,type:r,page:s,tokens:a,metadata:n}}=e;const c=0===r,o=2===r,u=(c?t.b:s.b).slice(),h=o?t.s:t.t;c||u.push(s.t);let i="";if(f.vc&&a.length>0){const e=new URLSearchParams;for(const t of a)e.append("_highlight",t);i=`?${e.toString()}`}return(0,_.jsxs)("article",{className:P.searchResultItem,children:[(0,_.jsx)("h2",{children:(0,_.jsx)(l.Z,{to:t.u+i+(t.h||""),dangerouslySetInnerHTML:{__html:o?(0,j.C)(h,a):(0,I.o)(h,(0,v.m)(n,"t"),a,100)}})}),u.length>0&&(0,_.jsx)("p",{className:P.searchResultItemPath,children:(0,R.e)(u)}),o&&(0,_.jsx)("p",{className:P.searchResultItemSummary,dangerouslySetInnerHTML:{__html:(0,I.o)(t.t,(0,v.m)(n,"t"),a,100)}})]})}const $=function(){return(0,_.jsx)(n.Z,{children:(0,_.jsx)(F,{})})}}}]);