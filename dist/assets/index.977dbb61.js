const ve=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))v(l);new MutationObserver(l=>{for(const w of l)if(w.type==="childList")for(const S of w.addedNodes)S.tagName==="LINK"&&S.rel==="modulepreload"&&v(S)}).observe(document,{childList:!0,subtree:!0});function t(l){const w={};return l.integrity&&(w.integrity=l.integrity),l.referrerpolicy&&(w.referrerPolicy=l.referrerpolicy),l.crossorigin==="use-credentials"?w.credentials="include":l.crossorigin==="anonymous"?w.credentials="omit":w.credentials="same-origin",w}function v(l){if(l.ep)return;l.ep=!0;const w=t(l);fetch(l.href,w)}};ve();var ee=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{},de={exports:{}};(function(i){(function(s){var t=V(),v=u(),l=p(),w=x(),S={imagePlaceholder:void 0,cacheBust:!1},h={toSvg:A,toPng:f,toJpeg:R,toBlob:b,toPixelData:e,impl:{fontFaces:l,images:w,util:t,inliner:v,options:{}}};i.exports=h;function A(o,n){return n=n||{},T(n),Promise.resolve(o).then(function(r){return U(r,n.filter,!0)}).then(I).then(M).then(a).then(function(r){return F(r,n.width||t.width(o),n.height||t.height(o))});function a(r){return n.bgcolor&&(r.style.backgroundColor=n.bgcolor),n.width&&(r.style.width=n.width+"px"),n.height&&(r.style.height=n.height+"px"),n.style&&Object.keys(n.style).forEach(function(m){r.style[m]=n.style[m]}),r}}function e(o,n){return j(o,n||{}).then(function(a){return a.getContext("2d").getImageData(0,0,t.width(o),t.height(o)).data})}function f(o,n){return j(o,n||{}).then(function(a){return a.toDataURL()})}function R(o,n){return n=n||{},j(o,n).then(function(a){return a.toDataURL("image/jpeg",n.quality||1)})}function b(o,n){return j(o,n||{}).then(t.canvasToBlob)}function T(o){typeof o.imagePlaceholder=="undefined"?h.impl.options.imagePlaceholder=S.imagePlaceholder:h.impl.options.imagePlaceholder=o.imagePlaceholder,typeof o.cacheBust=="undefined"?h.impl.options.cacheBust=S.cacheBust:h.impl.options.cacheBust=o.cacheBust}function j(o,n){return A(o,n).then(t.makeImage).then(t.delay(100)).then(function(r){var m=a(o);return m.getContext("2d").drawImage(r,0,0),m});function a(r){var m=document.createElement("canvas");if(m.width=n.width||t.width(r),m.height=n.height||t.height(r),n.bgcolor){var g=m.getContext("2d");g.fillStyle=n.bgcolor,g.fillRect(0,0,m.width,m.height)}return m}}function U(o,n,a){if(!a&&n&&!n(o))return Promise.resolve();return Promise.resolve(o).then(r).then(function(d){return m(o,d,n)}).then(function(d){return g(o,d)});function r(d){return d instanceof HTMLCanvasElement?t.makeImage(d.toDataURL()):d.cloneNode(!1)}function m(d,y,q){var H=d.childNodes;if(H.length===0)return Promise.resolve(y);return E(y,t.asArray(H),q).then(function(){return y});function E(X,B,C){var k=Promise.resolve();return B.forEach(function(_){k=k.then(function(){return U(_,C)}).then(function(N){N&&X.appendChild(N)})}),k}}function g(d,y){if(!(y instanceof Element))return y;return Promise.resolve().then(q).then(H).then(E).then(X).then(function(){return y});function q(){B(window.getComputedStyle(d),y.style);function B(C,k){C.cssText?k.cssText=C.cssText:_(C,k);function _(N,G){t.asArray(N).forEach(function(c){G.setProperty(c,N.getPropertyValue(c),N.getPropertyPriority(c))})}}}function H(){[":before",":after"].forEach(function(C){B(C)});function B(C){var k=window.getComputedStyle(d,C),_=k.getPropertyValue("content");if(_===""||_==="none")return;var N=t.uid();y.className=y.className+" "+N;var G=document.createElement("style");G.appendChild(c(N,C,k)),y.appendChild(G);function c(P,$,L){var D="."+P+":"+$,J=L.cssText?re(L):ie(L);return document.createTextNode(D+"{"+J+"}");function re(Y){var K=Y.getPropertyValue("content");return Y.cssText+" content: "+K+";"}function ie(Y){return t.asArray(Y).map(K).join("; ")+";";function K(Z){return Z+": "+Y.getPropertyValue(Z)+(Y.getPropertyPriority(Z)?" !important":"")}}}}}function E(){d instanceof HTMLTextAreaElement&&(y.innerHTML=d.value),d instanceof HTMLInputElement&&y.setAttribute("value",d.value)}function X(){y instanceof SVGElement&&(y.setAttribute("xmlns","http://www.w3.org/2000/svg"),y instanceof SVGRectElement&&["width","height"].forEach(function(B){var C=y.getAttribute(B);!C||y.style.setProperty(B,C)}))}}}function I(o){return l.resolveAll().then(function(n){var a=document.createElement("style");return o.appendChild(a),a.appendChild(document.createTextNode(n)),o})}function M(o){return w.inlineAll(o).then(function(){return o})}function F(o,n,a){return Promise.resolve(o).then(function(r){return r.setAttribute("xmlns","http://www.w3.org/1999/xhtml"),new XMLSerializer().serializeToString(r)}).then(t.escapeXhtml).then(function(r){return'<foreignObject x="0" y="0" width="100%" height="100%">'+r+"</foreignObject>"}).then(function(r){return'<svg xmlns="http://www.w3.org/2000/svg" width="'+n+'" height="'+a+'">'+r+"</svg>"}).then(function(r){return"data:image/svg+xml;charset=utf-8,"+r})}function V(){return{escape:X,parseExtension:n,mimeType:a,dataAsUrl:E,isDataUrl:r,canvasToBlob:g,resolveUrl:d,getAndEncode:H,uid:y(),delay:B,asArray:C,escapeXhtml:k,makeImage:q,width:_,height:N};function o(){var c="application/font-woff",P="image/jpeg";return{woff:c,woff2:c,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:P,jpeg:P,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml"}}function n(c){var P=/\.([^\.\/]*?)$/g.exec(c);return P?P[1]:""}function a(c){var P=n(c).toLowerCase();return o()[P]||""}function r(c){return c.search(/^(data:)/)!==-1}function m(c){return new Promise(function(P){for(var $=window.atob(c.toDataURL().split(",")[1]),L=$.length,D=new Uint8Array(L),J=0;J<L;J++)D[J]=$.charCodeAt(J);P(new Blob([D],{type:"image/png"}))})}function g(c){return c.toBlob?new Promise(function(P){c.toBlob(P)}):m(c)}function d(c,P){var $=document.implementation.createHTMLDocument(),L=$.createElement("base");$.head.appendChild(L);var D=$.createElement("a");return $.body.appendChild(D),L.href=P,D.href=c,D.href}function y(){var c=0;return function(){return"u"+P()+c++;function P(){return("0000"+(Math.random()*Math.pow(36,4)<<0).toString(36)).slice(-4)}}}function q(c){return new Promise(function(P,$){var L=new Image;L.onload=function(){P(L)},L.onerror=$,L.src=c})}function H(c){var P=3e4;return h.impl.options.cacheBust&&(c+=(/\?/.test(c)?"&":"?")+new Date().getTime()),new Promise(function($){var L=new XMLHttpRequest;L.onreadystatechange=re,L.ontimeout=ie,L.responseType="blob",L.timeout=P,L.open("GET",c,!0),L.send();var D;if(h.impl.options.imagePlaceholder){var J=h.impl.options.imagePlaceholder.split(/,/);J&&J[1]&&(D=J[1])}function re(){if(L.readyState===4){if(L.status!==200){D?$(D):Y("cannot fetch resource: "+c+", status: "+L.status);return}var K=new FileReader;K.onloadend=function(){var Z=K.result.split(/,/)[1];$(Z)},K.readAsDataURL(L.response)}}function ie(){D?$(D):Y("timeout of "+P+"ms occured while fetching resource: "+c)}function Y(K){console.error(K),$("")}})}function E(c,P){return"data:"+P+";base64,"+c}function X(c){return c.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1")}function B(c){return function(P){return new Promise(function($){setTimeout(function(){$(P)},c)})}}function C(c){for(var P=[],$=c.length,L=0;L<$;L++)P.push(c[L]);return P}function k(c){return c.replace(/#/g,"%23").replace(/\n/g,"%0A")}function _(c){var P=G(c,"border-left-width"),$=G(c,"border-right-width");return c.scrollWidth+P+$}function N(c){var P=G(c,"border-top-width"),$=G(c,"border-bottom-width");return c.scrollHeight+P+$}function G(c,P){var $=window.getComputedStyle(c).getPropertyValue(P);return parseFloat($.replace("px",""))}}function u(){var o=/url\(['"]?([^'"]+?)['"]?\)/g;return{inlineAll:m,shouldProcess:n,impl:{readUrls:a,inline:r}};function n(g){return g.search(o)!==-1}function a(g){for(var d=[],y;(y=o.exec(g))!==null;)d.push(y[1]);return d.filter(function(q){return!t.isDataUrl(q)})}function r(g,d,y,q){return Promise.resolve(d).then(function(E){return y?t.resolveUrl(E,y):E}).then(q||t.getAndEncode).then(function(E){return t.dataAsUrl(E,t.mimeType(d))}).then(function(E){return g.replace(H(d),"$1"+E+"$3")});function H(E){return new RegExp(`(url\\(['"]?)(`+t.escape(E)+`)(['"]?\\))`,"g")}}function m(g,d,y){if(q())return Promise.resolve(g);return Promise.resolve(g).then(a).then(function(H){var E=Promise.resolve(g);return H.forEach(function(X){E=E.then(function(B){return r(B,X,d,y)})}),E});function q(){return!n(g)}}}function p(){return{resolveAll:o,impl:{readAll:n}};function o(){return n().then(function(a){return Promise.all(a.map(function(r){return r.resolve()}))}).then(function(a){return a.join(`
`)})}function n(){return Promise.resolve(t.asArray(document.styleSheets)).then(r).then(a).then(function(g){return g.map(m)});function a(g){return g.filter(function(d){return d.type===CSSRule.FONT_FACE_RULE}).filter(function(d){return v.shouldProcess(d.style.getPropertyValue("src"))})}function r(g){var d=[];return g.forEach(function(y){try{t.asArray(y.cssRules||[]).forEach(d.push.bind(d))}catch(q){console.log("Error while reading CSS rules from "+y.href,q.toString())}}),d}function m(g){return{resolve:function(){var y=(g.parentStyleSheet||{}).href;return v.inlineAll(g.cssText,y)},src:function(){return g.style.getPropertyValue("src")}}}}}function x(){return{inlineAll:n,impl:{newImage:o}};function o(a){return{inline:r};function r(m){return t.isDataUrl(a.src)?Promise.resolve():Promise.resolve(a.src).then(m||t.getAndEncode).then(function(g){return t.dataAsUrl(g,t.mimeType(a.src))}).then(function(g){return new Promise(function(d,y){a.onload=d,a.onerror=y,a.src=g})})}}function n(a){if(!(a instanceof Element))return Promise.resolve(a);return r(a).then(function(){return a instanceof HTMLImageElement?o(a).inline():Promise.all(t.asArray(a.childNodes).map(function(m){return n(m)}))});function r(m){var g=m.style.getPropertyValue("background");return g?v.inlineAll(g).then(function(d){m.style.setProperty("background",d,m.style.getPropertyPriority("background"))}).then(function(){return m}):Promise.resolve(m)}}}})()})(de);var we=de.exports,he={exports:{}};(function(i,s){(function(t,v){v()})(ee,function(){function t(e,f){return typeof f=="undefined"?f={autoBom:!1}:typeof f!="object"&&(console.warn("Deprecated: Expected third argument to be a object"),f={autoBom:!f}),f.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\uFEFF",e],{type:e.type}):e}function v(e,f,R){var b=new XMLHttpRequest;b.open("GET",e),b.responseType="blob",b.onload=function(){A(b.response,f,R)},b.onerror=function(){console.error("could not download file")},b.send()}function l(e){var f=new XMLHttpRequest;f.open("HEAD",e,!1);try{f.send()}catch{}return 200<=f.status&&299>=f.status}function w(e){try{e.dispatchEvent(new MouseEvent("click"))}catch{var f=document.createEvent("MouseEvents");f.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),e.dispatchEvent(f)}}var S=typeof window=="object"&&window.window===window?window:typeof self=="object"&&self.self===self?self:typeof ee=="object"&&ee.global===ee?ee:void 0,h=S.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),A=S.saveAs||(typeof window!="object"||window!==S?function(){}:"download"in HTMLAnchorElement.prototype&&!h?function(e,f,R){var b=S.URL||S.webkitURL,T=document.createElement("a");f=f||e.name||"download",T.download=f,T.rel="noopener",typeof e=="string"?(T.href=e,T.origin===location.origin?w(T):l(T.href)?v(e,f,R):w(T,T.target="_blank")):(T.href=b.createObjectURL(e),setTimeout(function(){b.revokeObjectURL(T.href)},4e4),setTimeout(function(){w(T)},0))}:"msSaveOrOpenBlob"in navigator?function(e,f,R){if(f=f||e.name||"download",typeof e!="string")navigator.msSaveOrOpenBlob(t(e,R),f);else if(l(e))v(e,f,R);else{var b=document.createElement("a");b.href=e,b.target="_blank",setTimeout(function(){w(b)})}}:function(e,f,R,b){if(b=b||open("","_blank"),b&&(b.document.title=b.document.body.innerText="downloading..."),typeof e=="string")return v(e,f,R);var T=e.type==="application/octet-stream",j=/constructor/i.test(S.HTMLElement)||S.safari,U=/CriOS\/[\d]+/.test(navigator.userAgent);if((U||T&&j||h)&&typeof FileReader!="undefined"){var I=new FileReader;I.onloadend=function(){var V=I.result;V=U?V:V.replace(/^data:[^;]*;/,"data:attachment/file;"),b?b.location.href=V:location=V,b=null},I.readAsDataURL(e)}else{var M=S.URL||S.webkitURL,F=M.createObjectURL(e);b?b.location=F:location.href=F,b=null,setTimeout(function(){M.revokeObjectURL(F)},4e4)}});S.saveAs=A.saveAs=A,i.exports=A})})(he);const ae=new Set(["Australian Greens","Australian Labor Party","Liberal-National Coalition"]),be=new Map([["Australian Greens","brocolli"],["Australian Labor Party","tomatoes"],["Liberal-National Coalition","blueberries"]]),Pe=new Map([["National Party","Liberal-National Coalition"],["Liberal Party","Liberal-National Coalition"],["Liberal National Party","Liberal-National Coalition"],["Country Liberal Party","Liberal-National Coalition"]]),Ee=i=>{let s=4,t=1;for(;s;)t*=i- --s;return t},O=new Proxy(window.console,{get(){return()=>{}}}),W=(i,s,t=[])=>{var v;return(v=i.get(s))!=null?v:i.set(s,t)&&t},Se=async()=>{const i=await fetch("/db.json").then(h=>h.json()),s=Object.keys(i.people),t=new Map(Object.entries(i.people)),v=new Map(Object.entries(i.policies)),l=new Map,w=new Map;let S=0;for(const[h,A]of t){const e=A.name[0].replace(/-/g,"").toLowerCase(),f=W(w,e);A.index=++S,A.lookup={name:e,list:f,index:f.push(h)},A.policies=new Map(Object.entries(A.policies));const R=W(l,A.party,{policies:new Map,people:[]});R.people.push(h);const b=Pe.get(A.party),T=b&&W(l,b,{policies:new Map,people:[]});T&&T.people.push(h);for(const[j,U]of A.policies){if(U%100)continue;const I=v.get(j);if(!I)continue;I.parties||(I.parties=new Map);const M=W(I.parties,A.party,{for:[],against:[]});if(U?M.for.push(h):M.against.push(h),R.policies.has(j)||R.policies.set(j,M),!b)continue;const F=W(I.parties,b,{for:[],against:[]});U?F.for.push(h):F.against.push(h),T.policies.has(j)||T.policies.set(j,F)}}return O.log("NAMES",w),O.log("POLICIES",v),O.log("PARTIES",l),{permutations:Ee(t.size).toLocaleString(),names:w,ids:s,people:t,policies:v,parties:l}},Le=i=>{if(i.length<2)return;const s=i.slice(1).split("/"),t=s.pop().split("-"),v=s.length?s.pop().split(/\B/):[],l=v.slice(),w=[];for(const S of t){const h=z.names.get(S);if(!h)continue;let A=0;h.length>1&&v.length&&(O.log(h),A=Math.max(1,Math.min(h.length,parseInt(v.shift(),36)))-1),w.push(h[A])}return O.log("PARSE",i,s,l,w),w},Ae=(...i)=>{const s=[];let t="";for(const v of i){const l=z.people.get(v);l&&(s.push(l.lookup.name),l.lookup.list.length>1&&(t+=l.lookup.index.toString(36)))}return O.log({names:s,indexes:t},[""].concat(t||[],s.join("-")).join("/")),[""].concat(t||[],s.join("-")).join("/")},Te=330/800,$e=300/800;let oe,te,ge=0;const je=document.querySelector(".description"),Me=document.querySelector(".twitter"),xe=document.querySelector(".email"),Q=document.querySelector(".partials"),se=document.querySelectorAll(".partial-image"),Ce=document.querySelectorAll(".info"),me=i=>{++ge>=se.length&&setTimeout(()=>{delete Q.dataset.loading},500)},Re=i=>{if(i.target.classList.contains("default"))return me();i.target.parentElement.parentElement.style="",i.target.parentElement.style="",i.target.classList.add("default"),i.target.src="/assets/whereswilma.webp"};Q.addEventListener("load",me,!0);Q.addEventListener("error",Re,!0);const Oe=(i=[])=>{var t;const s=[];for(;s.length<se.length;){const v=(t=i[s.length])!=null?t:z.ids[Math.floor(Math.random()*z.ids.length)];v&&!s.includes(v)&&z.people.get(v)&&s.push(v)}return s},ce=i=>{ge=0,Q.dataset.alt=+Q.dataset.alt?0:1,Q.dataset.loading=1;const s=[0,0],t=[],v=new Map,l=Oe(i);let w=1;for(const[h,A]of Object.entries(l)){const e=z.people.get(A);w*=e.index;const f=se[h],R=e.image,b="/assets/manofmystery.webp";f.src=R?`/assets/people/${A}.webp`:b,f.classList.toggle("default",!R);const T=new Map;let j=0;for(const[u,p]of e.policies){const x=W(v,u,{aggregate:0,count:0,parties:new Map,people:{names:[],ids:[],parties:new Set}});if(x.people.names.push(e.name[0]),x.people.ids.push(A),x.people.parties.add(e.party),x.aggregate+=p,++x.count,p%100)continue;++j;const o=2*p/100-1,n=[];for(const[a,r]of z.policies.get(u).parties){const m=Math.max(-1,Math.min(1,r.for.length-r.against.length));if(m&&x.parties.set(a,m),!ae.has(a)||m!==o)continue;n.push(a),W(T,a).push(u)}n.length||W(T,"Other").push(u)}let U=0;const I=Array.from(T).sort(([u,p],[x,o])=>(U=Math.max(U,p.length,o.length),o.length-p.length||(u===e.party?1:0)));U||(U=I[0][1].length,O.log({alignmentMax:U},I));const M=Ce[h];if(M){const u=`${e.house[0]==="s"?"Senator":"Representative"} for ${e.electorate}`,p=e.offices.length?[e.offices[0].replace(/ (to|for) .*?(?= \(|$)/,"")]:[];M.dataset.party=e.party.toLowerCase().replace(/ /g,"-").replace(/[^a-z-]/g,""),M.querySelector("img").src=f.classList.contains("default")?f.src:f.src.replace(".webp","-sm.webp"),M.querySelector(".name").innerText=e.name.join(" "),M.querySelector(".role").innerText=u,M.querySelector(".party").innerText=e.party==="CWM"?"":e.party,M.querySelector(".offices").innerHTML=p.concat(e.offices.length>1?`+${e.offices.length-1} more offices`:[]).join("<br>"),M.querySelector(".votes").innerHTML=`Consistent votes: ${j.toLocaleString()}`;for(const x of M.querySelectorAll(".partial-alignment li"))x.style=null;M.querySelector(".partial-alignment").title=`${e.name[0]}'s consistent voting alignment with the major parties`;for(const[x,[o,n]]of Object.entries(I)){O.log(o);const a=M.querySelector(`.partial-alignment li[data-party="${o}"]`);a.style.order=+x+1,a.style.width=`${Math.round(100*n.length/U)}%`,O.log(x,o,n)}}O.log(A,e.name,e.party,e),O.log("ALIGNMENT",T),O.log(I),t.push(e.name[0]);let F,V;if(R){const u=e.image[36],p=e.image[45],x=e.image[8],o=e.image[0],n=e.image[16],a=[p[0]-u[0],p[1]-u[1]],r=[x[0]-u[0],x[1]-u[1]],m=[u[0]-o[0],u[1]-o[1]],g=[n[0]-p[0],n[1]-p[1]],d=(a[0]**2+a[1]**2)**.5,y=(r[0]**2+r[1]**2)**.5,q=(m[0]**2+m[1]**2)**.5,H=(g[0]**2+g[1]**2)**.5,E=Math.atan(a[1]/a[0]),X=Math.atan(r[1]/r[0]),B=Math.sin(X-E)*y,C=q>H?1:-1,k=$e/B,_=.5-u[0]-k*d/2,N=Te-u[1];if(h==0){const G=N*k-u[1]*(k-1);s[0]=Math.max(0,G)}else if(h==l.length-1){const G=(1-u[1])*(k-1)+N*k;s[1]=Math.max(0,-G)}C<0&&(F=`transform: scaleX(${C});`),V=`transform: translate(${_*100}%, ${N*100}%) scale(${k}, ${k}) rotate(${-E}rad); transform-origin: ${u[0]*100}% ${u[1]*100}%;`}f.parentElement.parentElement.style=F,f.parentElement.style=V}const S=(s[1]-s[0])/4;Q.style=`transform: translateY(${S*100}%)`,O.log({topBottomTransform:s,offsetTransformY:S}),oe=`${t[0]} "the ${t[1]}" ${t[2]}-${t[3]}`;for(const h of document.querySelectorAll(".pollie"))h.dataset.permutation=w.toLocaleString(),h.dataset.permutations=z.permutations.toLocaleString(),h.innerText=oe;te=Ae(...l),history.state&&history.state.ids&&history.state.ids.join("")!==l.join("")?(O.log("PUSH STATE!",history.state,te),history.pushState({ids:l},"",te)):(O.log("REPLACE STATE!"),history.replaceState({ids:l},"",te)),Me.href=Ue(oe),xe.href=Ie(),qe(v)},Ue=i=>{const s=new URL("https://twitter.com/intent/tweet");return s.searchParams.set("text",`${i} is truly the Perfect \u2764\uFE0F Pollie`),s.searchParams.set("url",location.origin+location.pathname),s},Ie=i=>{const s=encodeURIComponent(`Hey I found the the Perfect Pollie -

${location.origin+location.pathname}

Love ya guts!`);return`mailto:?subject=${encodeURIComponent("found the the perfect pollie")}&body=${s}`},le=i=>i.length<=2?i.join(" and "):i.slice(0,-2).join(", ").concat(", ",i.slice(-2).join(" and ")),ue=document.querySelector(".policies-for-bigticket"),fe=document.querySelector(".policies-for-major"),pe=document.querySelector(".policies-for");document.querySelector(".policies-against-bigticket");document.querySelector(".policies-against-major");document.querySelector(".policies-against");const ke=document.querySelectorAll(".alignment li"),qe=i=>{let s=0,t=0;const v=new Map,l=new Map,w=new Map,S=new Map;for(const[u,p]of i){const x=p.aggregate/p.count;let o;if(x===100)o=w;else if(x===0)o=S;else continue;const n=z.policies.get(u),a=2*x/100-1,r=p.count**2;r>10&&O.log(u,n.name,p.count,r);const m=[],g=[];for(const[E,X]of p.parties)if(a===X){g.push(E);const B=W(v,E,{score:0,total:0});if(ae.has(E)){m.push(u);const C=W(l,E,{score:0,total:0});C[u]=r,C.score+=r,++C.total,t+=r,r>10&&O.log(C,E,a,X)}B[u]=r,B.score+=r,s+=r}if(!m.length){const E=W(l,"Other",{score:0,total:0});E[u]=r,E.score+=r,++E.total,t+=r}const d=W(o,p.count),y=le(p.people.names),q=p.count>1?"agree":"agrees",H=p.count>1?"do not agree":"does not agree";d.push(`<li class="${x?"is-for":"is-against"}">
      <details>
        <summary title="${y} ${q} this is a ${x?"great":"terrible"} policy" data-count="${p.count}">${n.name}</summary>
        <p><i>${y}</i> ${x?q:H} that ${n.description}
          <br><small>Aligned Parties: ${g.sort().join(", ")}</small>
        </p>
      </details>
    </li>`)}O.log("POLICY ALIGNMENT",s,v),O.log("POLICY ALIGNMENT MAJOR",t,l);let h,A=0;const e=[],f=[];for(const[u,p]of l)p.percent=100*p.score/t,p.percentRounded=Math.ceil(p.percent),A+=p.percentRounded,(!h||p.score>h.score)&&(h=p),(u!=="Other"||p.percent>75)&&(p.percent>=25?e.push(u):p.percent>10&&f.push(be.get(u)));h.percentRounded+=100-A;for(const u of ke){const p=l.get(u.dataset.party);delete u.dataset.primary,p?(u.style.width=`${p.percent}%`,u.style.order=u.dataset.percent=p.percentRounded,u.dataset.score=p.score,u.dataset.total=p.total,h===p&&(u.dataset.primary="1")):(delete u.dataset.total,delete u.dataset.score,delete u.dataset.percent,u.style=null)}const R=[].concat(w.get(2)||[],w.get(1)||[]),b=[].concat(S.get(2)||[],S.get(1)||[]),T=(w.get(4)||[]).concat(S.get(4)||[]),j=T.length,U=(w.get(3)||[]).concat(S.get(3)||[]),I=R.concat(b);ue.innerHTML=T.join(""),ue.parentElement.dataset.total=j,fe.innerHTML=U.join(""),fe.parentElement.dataset.total=U.length,pe.innerHTML=I.join(""),pe.parentElement.dataset.total=I.length;const M=l.get("Other"),F=e.length===ae.size,V=[`<i>${oe}</i>`].concat(j?"has":"has the look, but doesn't have any",j>5?"any number of":j||[],`<a href="#big-ticket-policies">big ticket ${j===1?"policy":"policies"}</a>`,h.percent>=75?(e[0]==="Other"?"and is essentially a bizarre non-conformist":`${j<5?"&hellip; and":"but"} `+(j?"(of course) is essentially a":"is really just a plain-packaged")+` <span class="party-align">${e[0]}</span> stooge`)+` (who enjoys a side of ${le(f)})`:`${j?"and susbscribes to":"&hellip; despite subscribing to"} `+(F?"a confused middle ground in the divine trinity of major party ideaologies":"a soggy sandwich of "+(e.length>1?`<span class="party-align">${e.join('</span> and <span class="party-align">')}</span>`:`<span class="party-align">${e[0]}</span>`)+" thinking"+(f.length?` (with a side of ${f.join(" and ")})`:""))+(M?`. And, in true Canberra style, tops things off with ${M.percent<2?"an efficient smidge":M.percent<10&&"conservative pinch"||"fair dollop"} of bizarre otherness`:"")).join(" ").concat(".");je.innerHTML=V};document.querySelector(".btn-refresh").addEventListener("click",i=>{i.target.blur(),document.body.focus(),ce()});window.addEventListener("popstate",({state:i})=>{i&&i.ids&&ce(i.ids),O.log("POPSTATE",i)});const Be=/^((?!chrome|android).)*safari/i.test(navigator.userAgent),Ne=["iPad Simulator","iPhone Simulator","iPod Simulator","iPad","iPhone","iPod"].includes(navigator.platform)||navigator.userAgent.includes("Mac")&&"ontouchend"in document;Ne&&(document.body.dataset.ios=1);const ye=async i=>{const s=643.2/ne.offsetWidth,t=await we.toJpeg(ne,{width:ne.offsetWidth*s,height:ne.offsetHeight*s,style:{transform:`scale(${s})`,transformOrigin:"0 0"},bgcolor:"#fff"});return Be&&!i?ye(!0):t};for(const i of document.querySelectorAll("[data-hint]")){const s=i.dataset.hint==="over"?"pointerover":"click";i.addEventListener(s,()=>{delete i.dataset.hint},{once:!0})}const ne=document.querySelector(".image");document.querySelector(".copy").addEventListener("click",()=>{navigator.clipboard.writeText(location.origin+location.pathname).then(()=>{O.log("saved!")},()=>{O.log("whoops!")})});document.querySelector(".save").addEventListener("click",async()=>{const i=await ye(),s=`${location.pathname.slice(1).replace(/([^\/]+)\/(.*)$/,"$2-$1")}.jpg`;he.exports.saveAs(i,s)});let z;const Fe=async()=>{z=await Se();const i=document.querySelector(".combos");i&&(i.innerText=z.permutations);const s=Le(location.pathname);ce(s)};Fe();