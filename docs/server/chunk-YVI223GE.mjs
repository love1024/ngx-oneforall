import './polyfills.server.mjs';
import{b as o,c as g}from"./chunk-BEH5JPNY.mjs";var i=new Map;function a(e,n){return e.toString()+(n??"")}function c(e="memory",n){if(typeof window>"u")return new g;let r=a(e,n);if(i.has(r))return i.get(r);let t;return e==="local"?t=new o(localStorage,n):e==="session"?t=new o(sessionStorage,n):t=new g,i.set(r,t),t}export{c as a};
