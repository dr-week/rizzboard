var Q=Object.defineProperty;var Y=(r,e,t)=>e in r?Q(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var p=(r,e,t)=>Y(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function t(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(o){if(o.ep)return;o.ep=!0;const i=t(o);fetch(o.href,i)}})();let F=null;const $=new Set;let k=!1;function R(){return F}function _(r){const e=F;return F=r,e}function V(r){r.isStale=!0,k?$.add(r):r.execute()}function ee(r){const e=k;k=!0;try{return r()}finally{k=e,k||te()}}function te(){for(;$.size>0;){const r=Array.from($);$.clear();for(const e of r)e.isStale&&e.execute()}}class re{constructor(e){p(this,"_value");p(this,"_subscribers",new Set);this._value=e}get value(){const e=R();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}set value(e){Object.is(this._value,e)||(this._value=e,this.notify())}peek(){return this._value}notify(){const e=Array.from(this._subscribers);for(const t of e)V(t)}_unsubscribe(e){this._subscribers.delete(e)}}function v(r){return new re(r)}class oe{constructor(e){p(this,"_value");p(this,"_node");p(this,"_subscribers",new Set);p(this,"_isDirty",!0);p(this,"_fn");this._fn=e,this._node={dependencies:new Set,isStale:!0,execute:()=>{if(!this._isDirty){this._isDirty=!0;const t=Array.from(this._subscribers);for(const n of t)V(n)}}}}get value(){this._isDirty&&this._recompute();const e=R();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}peek(){return this._isDirty&&this._recompute(),this._value}_unsubscribe(e){this._subscribers.delete(e)}_recompute(){for(const t of this._node.dependencies)t._unsubscribe(this._node);this._node.dependencies.clear();const e=_(this._node);try{this._value=this._fn(),this._isDirty=!1,this._node.isStale=!1}finally{_(e)}}}function z(r){return new oe(r)}let ne=null;function ie(){return ne}function E(r){let e;const t={dependencies:new Set,isStale:!1,execute:()=>{for(const c of t.dependencies)c._unsubscribe(t);if(t.dependencies.clear(),typeof e=="function")try{e()}catch(c){console.error("[Nova Signal Effect Cleanup Error]:",c)}const i=_(t);try{e=r()}finally{_(i),t.isStale=!1}}};t.execute();const n=()=>{for(const i of t.dependencies)i._unsubscribe(t);t.dependencies.clear(),typeof e=="function"&&e()},o=ie();return o&&o.addCleanup(n),n}function H(){return typeof window<"u"&&"Part"in window&&"ChildNodePart"in window&&typeof window.getParts=="function"}class B{constructor(e){p(this,"parentNode");p(this,"previousSibling");p(this,"nextSibling");p(this,"value");p(this,"_currentNode");const t=e.parentNode;if(!t)throw new Error("[Zuari DOM Parts]: Placeholder node must have a parent container.");this.parentNode=t,this.previousSibling=e.previousSibling,this.nextSibling=e.nextSibling;const n=document.createTextNode("");t.replaceChild(n,e),this._currentNode=n}setValue(e){if(this.value=e,e instanceof DocumentFragment){const t=document.createTextNode("");this.parentNode.replaceChild(t,this._currentNode),this.parentNode.insertBefore(e,t),this._currentNode=t;return}if(e instanceof Node){this._currentNode!==e&&(this.parentNode.replaceChild(e,this._currentNode),this._currentNode=e);return}if(this._currentNode instanceof Text)this._currentNode.data=String(e??"");else{const t=document.createTextNode(String(e??""));this.parentNode.replaceChild(t,this._currentNode),this._currentNode=t}}disconnect(){}}class Z{constructor(e,t){p(this,"element");p(this,"attributeName");p(this,"value");this.element=e,this.attributeName=t}setValue(e){this.value=e,e===!1||e===null||e===void 0?this.element.removeAttribute(this.attributeName):this.element.setAttribute(this.attributeName,String(e))}disconnect(){this.element.removeAttribute(this.attributeName)}}function se(r){if(H())try{const e=window.ChildNodePart;return new e(r)}catch{return new B(r)}return new B(r)}function ae(r,e){if(H())try{const t=window.AttributePart;return new t(r,e)}catch{return new Z(r,e)}return new Z(r,e)}const L=new Map,I="<!--zuari-hole-",K="-->",U="data-zuari-attr-";function h(r,...e){return{strings:r,values:e}}function ce(r,e){const{strings:t,values:n}=r,o=t.join("<!--?-->");let i=L.get(o);if(!i){i=document.createElement("template");let l="";for(let f=0;f<t.length;f++)if(l+=t[f],f<n.length){const g=t[f]??"";/=["']?[^"'>]*$/.test(g)?l+=`"${U}${f}"`:l+=`${I}${f}${K}`}i.innerHTML=l,L.set(o,i)}const c=i.content.cloneNode(!0),d=[];return n.forEach((l,f)=>{ue(c,f,l,d)}),{fragment:c,destroy:()=>{for(const l of d)l()}}}function ue(r,e,t,n){const o=le(r,`${I}${e}${K}`);if(o){const d=se(o);if(M(t)){const l=E(()=>{d.setValue(j(t))});n.push(()=>{var f;l(),(f=d.disconnect)==null||f.call(d)})}else d.setValue(t);return}const i=`${U}${e}`,c=de(r,i);if(c){const{element:d,attrName:l}=c;if(l.startsWith("@")||l.startsWith("on")){const g=(l.startsWith("@")?l.slice(1):l.slice(2)).toLowerCase();if(d.removeAttribute(l),typeof t=="function"){const s=t;d.addEventListener(g,s),n.push(()=>d.removeEventListener(g,s))}return}const f=ae(d,l);if(M(t)){const g=E(()=>{f.setValue(j(t))});n.push(()=>{var s;g(),(s=f.disconnect)==null||s.call(f)})}else f.setValue(t)}}function M(r){return typeof r=="object"&&r!==null&&"value"in r||typeof r=="function"}function j(r){return typeof r=="object"&&r!==null&&"value"in r?r.value:typeof r=="function"?r():r}function le(r,e){const t=document.createNodeIterator(r,NodeFilter.SHOW_COMMENT);let n=t.nextNode();for(;n;){if(`<!--${n.data}-->`===e)return n;n=t.nextNode()}return null}function de(r,e){const t=document.createNodeIterator(r,NodeFilter.SHOW_ELEMENT);let n=t.nextNode();for(;n;){for(let o=0;o<n.attributes.length;o++){const i=n.attributes[o];if(i&&i.value.includes(e))return{element:n,attrName:i.name}}n=t.nextNode()}return null}const fe={primary:"#006A6A",onPrimary:"#FFFFFF",primaryContainer:"#6FF7F6",onPrimaryContainer:"#002020",secondary:"#4A6363",onSecondary:"#FFFFFF",background:"#FAFDFD",onBackground:"#191C1C",surface:"#FAFDFD",onSurface:"#191C1C",surfaceVariant:"#DAE5E4",outline:"#6F7979"},me={primary:"#4CDADA",onPrimary:"#003737",primaryContainer:"#004F4F",onPrimaryContainer:"#6FF7F6",secondary:"#B1CCCC",onSecondary:"#1C3534",background:"#191C1C",onBackground:"#E1E3E3",surface:"#191C1C",onSurface:"#E1E3E3",surfaceVariant:"#3F4948",outline:"#899392"};function pe(r=!1){const e=v(r),t=v(r?{...me}:{...fe}),n=z(()=>!!(typeof navigator<"u"&&/android/i.test(navigator.userAgent)||typeof window<"u"&&window.Android)),o=new Map;typeof window<"u"&&(window.__zuariKotlinDispatcher=(s,u)=>{const a=o.get(s);if(a)try{const m=JSON.parse(u);a(m)}catch{a(u)}});function i(s,...u){return new Promise((a,m)=>{if(typeof window<"u"&&window.Android){const T=window.Android;if(typeof T[s]=="function")try{const S=T[s](...u);try{a(JSON.parse(S))}catch{a(S)}return}catch(S){m(S);return}}a({success:!0,mock:!0,function:s,args:u})})}function c(s,u){return o.set(s,u),()=>{o.delete(s)}}function d(s){ee(()=>{t.value={...t.value,...s}})}function l(s){const u=(s==null?void 0:s.packageName)??"com.zuari.ui.theme",a=(s==null?void 0:s.themeName)??"ZuariTheme",m={...t.value,...(s==null?void 0:s.colors)??{}};return`package ${u}

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Native Material 3 Dynamic Colors generated by Zuari (@zuari/kotlin)
val ZuariPrimary = Color(android.graphics.Color.parseColor("${m.primary}"))
val ZuariOnPrimary = Color(android.graphics.Color.parseColor("${m.onPrimary}"))
val ZuariPrimaryContainer = Color(android.graphics.Color.parseColor("${m.primaryContainer}"))
val ZuariOnPrimaryContainer = Color(android.graphics.Color.parseColor("${m.onPrimaryContainer}"))
val ZuariSecondary = Color(android.graphics.Color.parseColor("${m.secondary}"))
val ZuariOnSecondary = Color(android.graphics.Color.parseColor("${m.onSecondary}"))
val ZuariBackground = Color(android.graphics.Color.parseColor("${m.background}"))
val ZuariOnBackground = Color(android.graphics.Color.parseColor("${m.onBackground}"))
val ZuariSurface = Color(android.graphics.Color.parseColor("${m.surface}"))
val ZuariOnSurface = Color(android.graphics.Color.parseColor("${m.onSurface}"))
val ZuariSurfaceVariant = Color(android.graphics.Color.parseColor("${m.surfaceVariant}"))
val ZuariOutline = Color(android.graphics.Color.parseColor("${m.outline}"))

private val ZuariColorScheme = lightColorScheme(
    primary = ZuariPrimary,
    onPrimary = ZuariOnPrimary,
    primaryContainer = ZuariPrimaryContainer,
    onPrimaryContainer = ZuariOnPrimaryContainer,
    secondary = ZuariSecondary,
    onSecondary = ZuariOnSecondary,
    background = ZuariBackground,
    onBackground = ZuariOnBackground,
    surface = ZuariSurface,
    onSurface = ZuariOnSurface,
    surfaceVariant = ZuariSurfaceVariant,
    outline = ZuariOutline
)

@Composable
fun ${a}(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = ZuariColorScheme,
        typography = Typography(),
        content = content
    )
}
`}function f(s){const u=(s==null?void 0:s.themeName)??"Theme.Zuari.Native",a={...t.value,...(s==null?void 0:s.colors)??{}};return`<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by @zuari/kotlin Native Android Bridge -->
<resources>
    <style name="${u}" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="colorPrimary">${a.primary}</item>
        <item name="colorOnPrimary">${a.onPrimary}</item>
        <item name="colorPrimaryContainer">${a.primaryContainer}</item>
        <item name="colorOnPrimaryContainer">${a.onPrimaryContainer}</item>
        <item name="colorSecondary">${a.secondary}</item>
        <item name="colorOnSecondary">${a.onSecondary}</item>
        <item name="android:colorBackground">${a.background}</item>
        <item name="colorOnBackground">${a.onBackground}</item>
        <item name="colorSurface">${a.surface}</item>
        <item name="colorOnSurface">${a.onSurface}</item>
        <item name="colorSurfaceVariant">${a.surfaceVariant}</item>
        <item name="colorOutline">${a.outline}</item>
    </style>
</resources>
`}function g(s){const u=s??(typeof document<"u"?document.documentElement:null);return u?E(()=>{const a=t.value;u.style.setProperty("--md-sys-color-primary",a.primary),u.style.setProperty("--md-sys-color-on-primary",a.onPrimary),u.style.setProperty("--md-sys-color-primary-container",a.primaryContainer),u.style.setProperty("--md-sys-color-on-primary-container",a.onPrimaryContainer),u.style.setProperty("--md-sys-color-secondary",a.secondary),u.style.setProperty("--md-sys-color-on-secondary",a.onSecondary),u.style.setProperty("--md-sys-color-background",a.background),u.style.setProperty("--md-sys-color-on-background",a.onBackground),u.style.setProperty("--md-sys-color-surface",a.surface),u.style.setProperty("--md-sys-color-on-surface",a.onSurface),u.style.setProperty("--md-sys-color-surface-variant",a.surfaceVariant),u.style.setProperty("--md-sys-color-outline",a.outline)}):()=>{}}return{isAndroid:n,dynamicColors:t,isDarkTheme:e,callNativeFunction:i,registerNativeCallback:c,generateComposeThemeCode:l,generateXmlThemeCode:f,ingestDynamicPalette:d,applyToCssVariables:g}}const G=pe(!0);function N(r){typeof window<"u"&&window.Android?window.Android.commitText(r):console.log("[Dev Mock Commit]:",r)}function x(){typeof window<"u"&&window.Android?window.Android.deleteBackward():console.log("[Dev Mock Delete]")}function ye(){typeof window<"u"&&window.Android?window.Android.sendEnter():console.log("[Dev Mock Enter]")}function C(r="click"){typeof window<"u"&&window.Android&&window.Android.triggerHaptic(r)}class he{constructor(){this.root={children:new Map,isWord:!1,frequency:0},this.bigrams=new Map,this.seedCommonVocabulary()}insert(e,t=1){let n=this.root;const o=e.toLowerCase();for(const i of o)n.children.has(i)||n.children.set(i,{children:new Map,isWord:!1,frequency:0}),n=n.children.get(i);n.isWord=!0,n.frequency+=t}addBigram(e,t){const n=e.toLowerCase(),o=t.toLowerCase();let i=this.bigrams.get(n);i||(i=[],this.bigrams.set(n,i));const c=i.find(d=>d.word===o);c?c.count++:i.push({word:o,count:1}),i.sort((d,l)=>l.count-d.count)}completePrefix(e,t=3){if(!e)return[];let n=this.root;const o=e.toLowerCase();for(const c of o){if(!n.children.has(c))return[];n=n.children.get(c)}const i=[];return this.collectWords(n,o,i),i.sort((c,d)=>d.frequency-c.frequency),i.slice(0,t).map(c=>c.word)}predictNextWord(e,t=3){if(!e)return["the","you","i"];const n=e.toLowerCase(),o=this.bigrams.get(n);return o&&o.length>0?o.slice(0,t).map(i=>i.word):["and","to","you"]}collectWords(e,t,n){e.isWord&&n.push({word:t,frequency:e.frequency});for(const[o,i]of e.children.entries())this.collectWords(i,t+o,n)}seedCommonVocabulary(){const e=[["are",100],["you",120],["free",80],["tonight",75],["tomorrow",70],["weekend",85],["coffee",65],["drinks",65],["dinner",60],["what",110],["when",95],["where",90],["why",85],["how",105],["about",80],["going",85],["good",90],["great",85],["plans",70],["sounds",80],["like",100],["love",95],["see",85],["talking",60]];for(const[n,o]of e)this.insert(n,o);const t=[["how","are"],["are","you"],["you","free"],["free","tonight"],["free","this"],["this","weekend"],["what","are"],["sounds","like"],["let","us"],["see","you"],["good","to"],["grab","coffee"]];for(const[n,o]of t)this.addBigram(n,o)}}const A=[{name:"Smileys & Rizz",icon:"😏",emojis:["😏","😉","😎","😜","🔥","👀","✨","💅","😈","🫦","🫠","🤭","🥰","😘","❤️‍🔥"]},{name:"Love & Hearts",icon:"❤️",emojis:["❤️","💖","💘","💕","💌","🌹","💐","🥂","🍾","🍫","💍","💋"]},{name:"Reactions & Gestures",icon:"✌️",emojis:["✌️","🤙","🤌","🤝","🙌","👏","🫡","🤷‍♂️","🤷‍♀️","🤦‍♂️","💯","🎯"]},{name:"Food & Dates",icon:"☕",emojis:["☕","🍸","🍷","🍕","🍣","🌮","🍦","🍿","🎬","🎳","🏎️","✈️"]}];function X(r){const e=r.trim(),t=e.toLowerCase();return e?/^(hey|hi|hello|sup|yo|wyd|what'?s up)$/i.test(e)?{score:2,verdict:"Dry",feedback:"Low effort opener. High ghosting probability (~90%).",improved:"Important question: what is your most controversial food opinion?"}:t.includes("how are you")||t.includes("how was your day")?{score:4,verdict:"Safe",feedback:"Polite but sounds like an HR interview.",improved:"Tell me your day was more exciting than grocery shopping."}:t.includes("cutie")||t.includes("beautiful")||t.includes("gorgeous")?{score:5,verdict:"Safe",feedback:"Compliment is sweet, but every other match says the exact same thing.",improved:"I was going to play it cool, but you made that impossible."}:t.includes("trouble")||t.includes("bet")||t.includes("drinks")||t.includes("coffee")?{score:9,verdict:"Smooth",feedback:"High energy, playful intrigue. Ready to send.",improved:e}:{score:7,verdict:"Smooth",feedback:"Solid message. Could use 10% more cheekiness.",improved:`${e} — unless you scare easily.`}:{score:1,verdict:"Dry",feedback:"Empty canvas. Drop something bold.",improved:"Are we breaking records or rules tonight?"}}const W=new he,y=v("qwerty"),b=v(""),P=v(0),D=v(["Hey! Are we still on for coffee?","Check this out: https://instagram.com/reel/xyz"]),O=v(null),J=v(null),be=z(()=>{const r=b.value;if(!r)return["how","are","you"];const e=r.trim().split(/\s+/),t=e[e.length-1];if(r.endsWith(" "))return W.predictNextWord(t,3);{const n=W.completePrefix(t,3);return n.length>0?n:[t]}});G.registerNativeCallback("screenshotDetected",r=>{O.value=r.uri,C("heavy")});G.registerNativeCallback("clipboardAdded",r=>{r.text&&(D.value=[r.text,...D.value.slice(0,9)])});function w(r){C("light"),b.value+=r,N(r)}function ge(){C("light"),b.value.length>0&&(b.value=b.value.slice(0,-1)),x()}function ve(r){C("click");const e=b.value,t=e.trim().split(/\s+/);if(!e.endsWith(" ")&&t.length>0){const n=t[t.length-1];for(let o=0;o<n.length;o++)x()}N(r+" "),b.value=(e.endsWith(" ")?e:t.slice(0,-1).join(" ")+" ")+r+" "}function we(){C("heavy");const r=X(b.value);J.value=r,y.value="roast"}function Ce(r){C("click");for(let e=0;e<b.value.length;e++)x();N(r),b.value=r,y.value="qwerty"}function ke(){const r=["q","w","e","r","t","y","u","i","o","p"],e=["a","s","d","f","g","h","j","k","l"],t=["z","x","c","v","b","n","m"];return h`
    <div class="rizz-app">
      <!-- Top Action Ribbon -->
      <div class="action-bar">
        ${()=>O.value?h`
          <button class="action-pill highlight" @click=${()=>{O.value=null,we()}}>
            📸 Screenshot Detected: Analyze Next Move
          </button>
        `:null}
        <button class="action-pill" @click=${()=>y.value=y.value==="qwerty"?"roast":"qwerty"}>
          🔥 Roast Draft (Rizz Test)
        </button>
        <button class="action-pill" @click=${()=>y.value=y.value==="clipboard"?"qwerty":"clipboard"}>
          📋 Clipboard
        </button>
        <button class="action-pill" @click=${()=>y.value=y.value==="emojis"?"qwerty":"emojis"}>
          😏 Emojis
        </button>
      </div>

      <!-- Real-time Next-Word Autocomplete Strip -->
      <div class="suggestions-panel">
        ${()=>be.value.map(n=>h`
          <div class="suggestion-card" @click=${()=>ve(n)}>
            <span class="suggestion-text">${n}</span>
          </div>
        `)}
      </div>

      <!-- Main Body Panels -->
      ${()=>{const n=y.value;if(n==="emojis"){const o=A[P.value]??A[0];return h`
            <div class="emoji-view">
              <div class="emoji-tabs">
                ${A.map((i,c)=>h`
                  <button class="emoji-tab ${c===P.value?"active":""}"
                          @click=${()=>P.value=c}>
                    ${i.icon}
                  </button>
                `)}
                <button class="emoji-tab back-key" @click=${()=>y.value="qwerty"}>ABC</button>
              </div>
              <div class="emoji-grid">
                ${o.emojis.map(i=>h`
                  <button class="emoji-btn" @click=${()=>w(i)}>${i}</button>
                `)}
              </div>
            </div>
          `}if(n==="clipboard")return h`
            <div class="clipboard-view">
              <div class="clipboard-header">
                <span>Recent Copied Snippets</span>
                <button class="back-link" @click=${()=>y.value="qwerty"}>Close ✕</button>
              </div>
              <div class="clipboard-list">
                ${D.value.map(o=>h`
                  <div class="clipboard-item" @click=${()=>{N(o),y.value="qwerty"}}>
                    ${o}
                  </div>
                `)}
              </div>
            </div>
          `;if(n==="roast"){const o=J.value??X(b.value);return h`
            <div class="roast-view">
              <div class="roast-badge">
                <span>Score: ${o.score}/10 — ${o.verdict}</span>
                <button class="back-link" @click=${()=>y.value="qwerty"}>Back to typing ✕</button>
              </div>
              <p class="roast-feedback">"${o.feedback}"</p>
              <div class="roast-upgrade" @click=${()=>Ce(o.improved)}>
                <span class="upgrade-tag">1-Tap Upgrade:</span>
                <span class="upgrade-line">${o.improved}</span>
              </div>
            </div>
          `}return h`
          <div class="keyboard-grid">
            <div class="keyboard-row">
              ${r.map(o=>h`<button class="key-btn" @click=${()=>w(o)}>${o}</button>`)}
            </div>
            <div class="keyboard-row">
              ${e.map(o=>h`<button class="key-btn" @click=${()=>w(o)}>${o}</button>`)}
            </div>
            <div class="keyboard-row">
              <button class="key-btn special" @click=${()=>y.value="emojis"}>123</button>
              ${t.map(o=>h`<button class="key-btn" @click=${()=>w(o)}>${o}</button>`)}
              <button class="key-btn special" @click=${ge}>⌫</button>
            </div>
            <div class="keyboard-row">
              <button class="key-btn special" @click=${()=>y.value="emojis"}>😏</button>
              <button class="key-btn special" @click=${()=>w(",")}>,</button>
              <button class="key-btn space" @click=${()=>w(" ")}>space</button>
              <button class="key-btn special" @click=${()=>w(".")}>.</button>
              <button class="key-btn send" @click=${()=>{C("heavy"),ye()}}>Send</button>
            </div>
          </div>
        `}}
    </div>
  `}const q=document.getElementById("app");if(q){const{fragment:r}=ce(ke());q.appendChild(r)}
