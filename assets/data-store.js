/* The CV draft stays on this device. */
(()=>{"use strict";
const key="mbo_cv_draft_v1";
function read(key){try{const value=JSON.parse(localStorage.getItem(key)||"{}");return value&&typeof value==="object"&&!Array.isArray(value)?value:{}}catch{return {}}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent("mbo:datachange",{detail:{key}}));return true}catch{return false}}
function clear(key){try{localStorage.removeItem(key);window.dispatchEvent(new CustomEvent("mbo:datachange",{detail:{key}}));return true}catch{return false}}
Object.defineProperty(window,"MboData",{value:Object.freeze({
 readCvDraft:()=>read(key),writeCvDraft:value=>write(key,value),clearCvDraft:()=>clear(key)
}),writable:false,configurable:false});
})();
