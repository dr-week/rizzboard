var X=Object.defineProperty;var J=(t,e,r)=>e in t?X(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var y=(t,e,r)=>J(t,typeof e!="symbol"?e+"":e,r);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function r(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(n){if(n.ep)return;n.ep=!0;const i=r(n);fetch(n.href,i)}})();let _=null;const S=new Set;let C=!1;function q(){return _}function $(t){const e=_;return _=t,e}function W(t){t.isStale=!0,C?S.add(t):t.execute()}function Q(t){const e=C;C=!0;try{return t()}finally{C=e,C||Y()}}function Y(){for(;S.size>0;){const t=Array.from(S);S.clear();for(const e of t)e.isStale&&e.execute()}}class ee{constructor(e){y(this,"_value");y(this,"_subscribers",new Set);this._value=e}get value(){const e=q();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}set value(e){Object.is(this._value,e)||(this._value=e,this.notify())}peek(){return this._value}notify(){const e=Array.from(this._subscribers);for(const r of e)W(r)}_unsubscribe(e){this._subscribers.delete(e)}}function v(t){return new ee(t)}class te{constructor(e){y(this,"_value");y(this,"_node");y(this,"_subscribers",new Set);y(this,"_isDirty",!0);y(this,"_fn");this._fn=e,this._node={dependencies:new Set,isStale:!0,execute:()=>{if(!this._isDirty){this._isDirty=!0;const r=Array.from(this._subscribers);for(const o of r)W(o)}}}}get value(){this._isDirty&&this._recompute();const e=q();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}peek(){return this._isDirty&&this._recompute(),this._value}_unsubscribe(e){this._subscribers.delete(e)}_recompute(){for(const r of this._node.dependencies)r._unsubscribe(this._node);this._node.dependencies.clear();const e=$(this._node);try{this._value=this._fn(),this._isDirty=!1,this._node.isStale=!1}finally{$(e)}}}function z(t){return new te(t)}let re=null;function oe(){return re}function N(t){let e;const r={dependencies:new Set,isStale:!1,execute:()=>{for(const c of r.dependencies)c._unsubscribe(r);if(r.dependencies.clear(),typeof e=="function")try{e()}catch(c){console.error("[Nova Signal Effect Cleanup Error]:",c)}const i=$(r);try{e=t()}finally{$(i),r.isStale=!1}}};r.execute();const o=()=>{for(const i of r.dependencies)i._unsubscribe(r);r.dependencies.clear(),typeof e=="function"&&e()},n=oe();return n&&n.addCleanup(o),o}function V(){return typeof window<"u"&&"Part"in window&&"ChildNodePart"in window&&typeof window.getParts=="function"}class D{constructor(e){y(this,"parentNode");y(this,"previousSibling");y(this,"nextSibling");y(this,"value");y(this,"_currentNode");const r=e.parentNode;if(!r)throw new Error("[Zuari DOM Parts]: Placeholder node must have a parent container.");this.parentNode=r,this.previousSibling=e.previousSibling,this.nextSibling=e.nextSibling;const o=document.createTextNode("");r.replaceChild(o,e),this._currentNode=o}setValue(e){if(this.value=e,e instanceof DocumentFragment){const r=document.createTextNode("");this.parentNode.replaceChild(r,this._currentNode),this.parentNode.insertBefore(e,r),this._currentNode=r;return}if(e instanceof Node){this._currentNode!==e&&(this.parentNode.replaceChild(e,this._currentNode),this._currentNode=e);return}if(this._currentNode instanceof Text)this._currentNode.data=String(e??"");else{const r=document.createTextNode(String(e??""));this.parentNode.replaceChild(r,this._currentNode),this._currentNode=r}}disconnect(){}}class x{constructor(e,r){y(this,"element");y(this,"attributeName");y(this,"value");this.element=e,this.attributeName=r}setValue(e){this.value=e,e===!1||e===null||e===void 0?this.element.removeAttribute(this.attributeName):this.element.setAttribute(this.attributeName,String(e))}disconnect(){this.element.removeAttribute(this.attributeName)}}function ne(t){if(V())try{const e=window.ChildNodePart;return new e(t)}catch{return new D(t)}return new D(t)}function ie(t,e){if(V())try{const r=window.AttributePart;return new r(t,e)}catch{return new x(t,e)}return new x(t,e)}const B=new Map,H="<!--zuari-hole-",I="-->",K="data-zuari-attr-";function h(t,...e){return{strings:t,values:e}}function ae(t,e){const{strings:r,values:o}=t,n=r.join("<!--?-->");let i=B.get(n);if(!i){i=document.createElement("template");let l="";for(let f=0;f<r.length;f++)if(l+=r[f],f<o.length){const g=r[f]??"";/=["']?[^"'>]*$/.test(g)?l+=`"${K}${f}"`:l+=`${H}${f}${I}`}i.innerHTML=l,B.set(n,i)}const c=i.content.cloneNode(!0),d=[];return o.forEach((l,f)=>{se(c,f,l,d)}),{fragment:c,destroy:()=>{for(const l of d)l()}}}function se(t,e,r,o){const n=ce(t,`${H}${e}${I}`);if(n){const d=ne(n);if(j(r)){const l=N(()=>{d.setValue(Z(r))});o.push(()=>{var f;l(),(f=d.disconnect)==null||f.call(d)})}else d.setValue(r);return}const i=`${K}${e}`,c=ue(t,i);if(c){const{element:d,attrName:l}=c;if(l.startsWith("@")||l.startsWith("on")){const g=(l.startsWith("@")?l.slice(1):l.slice(2)).toLowerCase();if(d.removeAttribute(l),typeof r=="function"){const a=r;d.addEventListener(g,a),o.push(()=>d.removeEventListener(g,a))}return}const f=ie(d,l);if(j(r)){const g=N(()=>{f.setValue(Z(r))});o.push(()=>{var a;g(),(a=f.disconnect)==null||a.call(f)})}else f.setValue(r)}}function j(t){return typeof t=="object"&&t!==null&&"value"in t||typeof t=="function"}function Z(t){return typeof t=="object"&&t!==null&&"value"in t?t.value:typeof t=="function"?t():t}function ce(t,e){const r=document.createNodeIterator(t,NodeFilter.SHOW_COMMENT);let o=r.nextNode();for(;o;){if(`<!--${o.data}-->`===e)return o;o=r.nextNode()}return null}function ue(t,e){const r=document.createNodeIterator(t,NodeFilter.SHOW_ELEMENT);let o=r.nextNode();for(;o;){for(let n=0;n<o.attributes.length;n++){const i=o.attributes[n];if(i&&i.value.includes(e))return{element:o,attrName:i.name}}o=r.nextNode()}return null}const le={primary:"#006A6A",onPrimary:"#FFFFFF",primaryContainer:"#6FF7F6",onPrimaryContainer:"#002020",secondary:"#4A6363",onSecondary:"#FFFFFF",background:"#FAFDFD",onBackground:"#191C1C",surface:"#FAFDFD",onSurface:"#191C1C",surfaceVariant:"#DAE5E4",outline:"#6F7979"},de={primary:"#4CDADA",onPrimary:"#003737",primaryContainer:"#004F4F",onPrimaryContainer:"#6FF7F6",secondary:"#B1CCCC",onSecondary:"#1C3534",background:"#191C1C",onBackground:"#E1E3E3",surface:"#191C1C",onSurface:"#E1E3E3",surfaceVariant:"#3F4948",outline:"#899392"};function fe(t=!1){const e=v(t),r=v(t?{...de}:{...le}),o=z(()=>!!(typeof navigator<"u"&&/android/i.test(navigator.userAgent)||typeof window<"u"&&window.Android)),n=new Map;typeof window<"u"&&(window.__zuariKotlinDispatcher=(a,u)=>{const s=n.get(a);if(s)try{const m=JSON.parse(u);s(m)}catch{s(u)}});function i(a,...u){return new Promise((s,m)=>{if(typeof window<"u"&&window.Android){const T=window.Android;if(typeof T[a]=="function")try{const k=T[a](...u);try{s(JSON.parse(k))}catch{s(k)}return}catch(k){m(k);return}}s({success:!0,mock:!0,function:a,args:u})})}function c(a,u){return n.set(a,u),()=>{n.delete(a)}}function d(a){Q(()=>{r.value={...r.value,...a}})}function l(a){const u=(a==null?void 0:a.packageName)??"com.zuari.ui.theme",s=(a==null?void 0:a.themeName)??"ZuariTheme",m={...r.value,...(a==null?void 0:a.colors)??{}};return`package ${u}

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
fun ${s}(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = ZuariColorScheme,
        typography = Typography(),
        content = content
    )
}
`}function f(a){const u=(a==null?void 0:a.themeName)??"Theme.Zuari.Native",s={...r.value,...(a==null?void 0:a.colors)??{}};return`<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by @zuari/kotlin Native Android Bridge -->
<resources>
    <style name="${u}" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="colorPrimary">${s.primary}</item>
        <item name="colorOnPrimary">${s.onPrimary}</item>
        <item name="colorPrimaryContainer">${s.primaryContainer}</item>
        <item name="colorOnPrimaryContainer">${s.onPrimaryContainer}</item>
        <item name="colorSecondary">${s.secondary}</item>
        <item name="colorOnSecondary">${s.onSecondary}</item>
        <item name="android:colorBackground">${s.background}</item>
        <item name="colorOnBackground">${s.onBackground}</item>
        <item name="colorSurface">${s.surface}</item>
        <item name="colorOnSurface">${s.onSurface}</item>
        <item name="colorSurfaceVariant">${s.surfaceVariant}</item>
        <item name="colorOutline">${s.outline}</item>
    </style>
</resources>
`}function g(a){const u=a??(typeof document<"u"?document.documentElement:null);return u?N(()=>{const s=r.value;u.style.setProperty("--md-sys-color-primary",s.primary),u.style.setProperty("--md-sys-color-on-primary",s.onPrimary),u.style.setProperty("--md-sys-color-primary-container",s.primaryContainer),u.style.setProperty("--md-sys-color-on-primary-container",s.onPrimaryContainer),u.style.setProperty("--md-sys-color-secondary",s.secondary),u.style.setProperty("--md-sys-color-on-secondary",s.onSecondary),u.style.setProperty("--md-sys-color-background",s.background),u.style.setProperty("--md-sys-color-on-background",s.onBackground),u.style.setProperty("--md-sys-color-surface",s.surface),u.style.setProperty("--md-sys-color-on-surface",s.onSurface),u.style.setProperty("--md-sys-color-surface-variant",s.surfaceVariant),u.style.setProperty("--md-sys-color-outline",s.outline)}):()=>{}}return{isAndroid:o,dynamicColors:r,isDarkTheme:e,callNativeFunction:i,registerNativeCallback:c,generateComposeThemeCode:l,generateXmlThemeCode:f,ingestDynamicPalette:d,applyToCssVariables:g}}const U=fe(!0);function P(t){typeof window<"u"&&window.Android?window.Android.commitText(t):console.log("[Dev Mock Commit]:",t)}function O(){typeof window<"u"&&window.Android?window.Android.deleteBackward():console.log("[Dev Mock Delete]")}function me(){typeof window<"u"&&window.Android?window.Android.sendEnter():console.log("[Dev Mock Enter]")}function w(t="click"){typeof window<"u"&&window.Android&&window.Android.triggerHaptic(t)}class ye{constructor(){this.root={children:new Map,isWord:!1,frequency:0},this.bigrams=new Map,this.seedCommonVocabulary()}insert(e,r=1){let o=this.root;const n=e.toLowerCase();for(const i of n)o.children.has(i)||o.children.set(i,{children:new Map,isWord:!1,frequency:0}),o=o.children.get(i);o.isWord=!0,o.frequency+=r}addBigram(e,r){const o=e.toLowerCase(),n=r.toLowerCase();let i=this.bigrams.get(o);i||(i=[],this.bigrams.set(o,i));const c=i.find(d=>d.word===n);c?c.count++:i.push({word:n,count:1}),i.sort((d,l)=>l.count-d.count)}completePrefix(e,r=3){if(!e)return[];let o=this.root;const n=e.toLowerCase();for(const c of n){if(!o.children.has(c))return[];o=o.children.get(c)}const i=[];return this.collectWords(o,n,i),i.sort((c,d)=>d.frequency-c.frequency),i.slice(0,r).map(c=>c.word)}predictNextWord(e,r=3){if(!e)return["the","you","i"];const o=e.toLowerCase(),n=this.bigrams.get(o);return n&&n.length>0?n.slice(0,r).map(i=>i.word):["and","to","you"]}collectWords(e,r,o){e.isWord&&o.push({word:r,frequency:e.frequency});for(const[n,i]of e.children.entries())this.collectWords(i,r+n,o)}seedCommonVocabulary(){const e=[["are",100],["you",120],["free",80],["tonight",75],["tomorrow",70],["weekend",85],["coffee",65],["drinks",65],["dinner",60],["what",110],["when",95],["where",90],["why",85],["how",105],["about",80],["going",85],["good",90],["great",85],["plans",70],["sounds",80],["like",100],["love",95],["see",85],["talking",60]];for(const[o,n]of e)this.insert(o,n);const r=[["how","are"],["are","you"],["you","free"],["free","tonight"],["free","this"],["this","weekend"],["what","are"],["sounds","like"],["let","us"],["see","you"],["good","to"],["grab","coffee"]];for(const[o,n]of r)this.addBigram(o,n)}}function he(t){const e=t.trim(),r=e.toLowerCase();return e?/^(hey|hi|hello|sup|yo|wyd|what'?s up)$/i.test(e)?{score:2,verdict:"Dry",feedback:"Low effort opener. High ghosting probability (~90%).",improved:"Important question: what is your most controversial food opinion?"}:r.includes("how are you")||r.includes("how was your day")?{score:4,verdict:"Safe",feedback:"Polite but sounds like an HR interview.",improved:"Tell me your day was more exciting than grocery shopping."}:r.includes("cutie")||r.includes("beautiful")||r.includes("gorgeous")?{score:5,verdict:"Safe",feedback:"Compliment is sweet, but every other match says the exact same thing.",improved:"I was going to play it cool, but you made that impossible."}:r.includes("trouble")||r.includes("bet")||r.includes("drinks")||r.includes("coffee")?{score:9,verdict:"Smooth",feedback:"High energy, playful intrigue. Ready to send.",improved:e}:{score:7,verdict:"Smooth",feedback:"Solid message. Could use 10% more cheekiness.",improved:`${e} — unless you scare easily.`}:{score:1,verdict:"Dry",feedback:"Empty canvas. Drop something bold.",improved:"Are we breaking records or rules tonight?"}}function pe(t){return h`
    <div class="action-bar">
      ${()=>t.screenshotAlert.value?h`
        <button class="action-pill highlight" @click=${t.onAnalyzeScreenshot}>
          📸 Screenshot Detected: Analyze Next Move
        </button>
      `:null}
      <button class="action-pill" @click=${t.onToggleRoast}>
        🔥 Roast Draft (Rizz Test)
      </button>
      <button class="action-pill" @click=${t.onToggleClipboard}>
        📋 Clipboard
      </button>
      <button class="action-pill" @click=${t.onToggleEmojis}>
        😏 Emojis
      </button>
    </div>
  `}function be(t){return h`
    <div class="suggestions-panel">
      ${()=>t.suggestions.value.map(e=>h`
        <div class="suggestion-card" @click=${()=>t.onSelectSuggestion(e)}>
          <span class="suggestion-text">${e}</span>
        </div>
      `)}
    </div>
  `}function ge(t){const e=["q","w","e","r","t","y","u","i","o","p"],r=["a","s","d","f","g","h","j","k","l"],o=["z","x","c","v","b","n","m"];return h`
    <div class="keyboard-grid">
      <div class="keyboard-row">
        ${e.map(n=>h`<button class="key-btn" @click=${()=>t.onKeyPress(n)}>${n}</button>`)}
      </div>
      <div class="keyboard-row">
        ${r.map(n=>h`<button class="key-btn" @click=${()=>t.onKeyPress(n)}>${n}</button>`)}
      </div>
      <div class="keyboard-row">
        <button class="key-btn special" @click=${t.onOpenEmojis}>123</button>
        ${o.map(n=>h`<button class="key-btn" @click=${()=>t.onKeyPress(n)}>${n}</button>`)}
        <button class="key-btn special" @click=${t.onBackspace}>⌫</button>
      </div>
      <div class="keyboard-row">
        <button class="key-btn special" @click=${t.onOpenEmojis}>😏</button>
        <button class="key-btn special" @click=${()=>t.onKeyPress(",")}>,</button>
        <button class="key-btn space" @click=${()=>t.onKeyPress(" ")}>space</button>
        <button class="key-btn special" @click=${()=>t.onKeyPress(".")}>.</button>
        <button class="key-btn send" @click=${t.onSend}>Send</button>
      </div>
    </div>
  `}const A=[{name:"Smileys & Rizz",icon:"😏",emojis:["😏","😉","😎","😜","🔥","👀","✨","💅","😈","🫦","🫠","🤭","🥰","😘","❤️‍🔥"]},{name:"Love & Hearts",icon:"❤️",emojis:["❤️","💖","💘","💕","💌","🌹","💐","🥂","🍾","🍫","💍","💋"]},{name:"Reactions & Gestures",icon:"✌️",emojis:["✌️","🤙","🤌","🤝","🙌","👏","🫡","🤷‍♂️","🤷‍♀️","🤦‍♂️","💯","🎯"]},{name:"Food & Dates",icon:"☕",emojis:["☕","🍸","🍷","🍕","🍣","🌮","🍦","🍿","🎬","🎳","🏎️","✈️"]}];function ve(t){const e=v(0);return h`
    <div class="emoji-view">
      <div class="emoji-tabs">
        ${A.map((r,o)=>h`
          <button class="emoji-tab ${()=>o===e.value?"active":""}"
                  @click=${()=>e.value=o}>
            ${r.icon}
          </button>
        `)}
        <button class="emoji-tab back-key" @click=${t.onClose}>ABC</button>
      </div>
      <div class="emoji-grid">
        ${()=>(A[e.value]??A[0]).emojis.map(o=>h`
            <button class="emoji-btn" @click=${()=>t.onSelectEmoji(o)}>${o}</button>
          `)}
      </div>
    </div>
  `}function we(t){return h`
    <div class="clipboard-view">
      <div class="clipboard-header">
        <span>Recent Copied Snippets</span>
        <button class="back-link" @click=${t.onClose}>Close ✕</button>
      </div>
      <div class="clipboard-list">
        ${()=>t.history.value.map(e=>h`
          <div class="clipboard-item" @click=${()=>t.onSelectClip(e)}>
            ${e}
          </div>
        `)}
      </div>
    </div>
  `}function Ce(t){return h`
    <div class="roast-view">
      <div class="roast-badge">
        <span>Score: ${()=>t.roast.value?`${t.roast.value.score}/10 — ${t.roast.value.verdict}`:"Analyzing..."}</span>
        <button class="back-link" @click=${t.onClose}>Back to typing ✕</button>
      </div>
      <p class="roast-feedback">"${()=>t.roast.value?t.roast.value.feedback:""}"</p>
      <div class="roast-upgrade" @click=${()=>{t.roast.value&&t.onApplyUpgrade(t.roast.value.improved)}}>
        <span class="upgrade-tag">1-Tap Upgrade:</span>
        <span class="upgrade-line">${()=>t.roast.value?t.roast.value.improved:""}</span>
      </div>
    </div>
  `}const L=new ye,p=v("qwerty"),b=v(""),E=v(null),G=v(null),F=v(["Hey! Are we still on for coffee?","Check this out: https://instagram.com/reel/xyz"]),ke=z(()=>{const t=b.value;if(!t)return["how","are","you"];const e=t.trim().split(/\s+/),r=e[e.length-1];if(t.endsWith(" "))return L.predictNextWord(r,3);{const o=L.completePrefix(r,3);return o.length>0?o:[r]}});U.registerNativeCallback("screenshotDetected",t=>{E.value=t.uri,w("heavy")});U.registerNativeCallback("clipboardAdded",t=>{t.text&&(F.value=[t.text,...F.value.slice(0,9)])});function M(t){w("light"),b.value+=t,P(t)}function Se(){w("light"),b.value.length>0&&(b.value=b.value.slice(0,-1)),O()}function $e(t){w("click");const e=b.value,r=e.trim().split(/\s+/);if(!e.endsWith(" ")&&r.length>0){const o=r[r.length-1];for(let n=0;n<o.length;n++)O()}P(t+" "),b.value=(e.endsWith(" ")?e:r.slice(0,-1).join(" ")+" ")+t+" "}function Pe(){w("heavy"),G.value=he(b.value),p.value="roast"}function Ae(t){w("click");for(let e=0;e<b.value.length;e++)O();P(t),b.value=t,p.value="qwerty"}function _e(){return h`
    <div class="rizz-app">
      ${pe({screenshotAlert:E,onAnalyzeScreenshot:()=>{E.value=null,Pe()},onToggleRoast:()=>p.value=p.value==="qwerty"?"roast":"qwerty",onToggleClipboard:()=>p.value=p.value==="clipboard"?"qwerty":"clipboard",onToggleEmojis:()=>p.value=p.value==="emojis"?"qwerty":"emojis"})}

      ${be({suggestions:ke,onSelectSuggestion:$e})}

      ${()=>{const t=p.value;return t==="emojis"?ve({onSelectEmoji:M,onClose:()=>p.value="qwerty"}):t==="clipboard"?we({history:F,onSelectClip:e=>{P(e),p.value="qwerty"},onClose:()=>p.value="qwerty"}):t==="roast"?Ce({roast:G,onApplyUpgrade:Ae,onClose:()=>p.value="qwerty"}):ge({onKeyPress:M,onBackspace:Se,onSend:()=>{w("heavy"),me()},onOpenEmojis:()=>p.value="emojis"})}}
    </div>
  `}const R=document.getElementById("app");if(R){const{fragment:t}=ae(_e());R.appendChild(t)}
