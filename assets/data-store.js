/* Local data boundary for future authenticated API migration.
 * No credentials, API endpoints, or automatic uploads belong in browser code.
 */
(()=>{"use strict";
const keys=Object.freeze({checklist:"mbo_phase1_v1",cv:"mbo_cv_draft_v1"});
function read(key){try{const value=JSON.parse(localStorage.getItem(key)||"{}");return value&&typeof value==="object"&&!Array.isArray(value)?value:{}}catch{return {}}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent("mbo:datachange",{detail:{key}}));return true}catch{return false}}
function clear(key){try{localStorage.removeItem(key);window.dispatchEvent(new CustomEvent("mbo:datachange",{detail:{key}}));return true}catch{return false}}
Object.defineProperty(window,"MboData",{value:Object.freeze({
 readChecklistState:()=>read(keys.checklist),writeChecklistState:value=>write(keys.checklist,value),clearChecklistState:()=>clear(keys.checklist),
 readCvDraft:()=>read(keys.cv),writeCvDraft:value=>write(keys.cv,value),clearCvDraft:()=>clear(keys.cv)
}),writable:false,configurable:false});
})();
