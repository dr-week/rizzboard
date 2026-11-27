var le=Object.defineProperty;var ue=(t,e,r)=>e in t?le(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var v=(t,e,r)=>ue(t,typeof e!="symbol"?e+"":e,r);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}})();let z=null;const L=new Set;let B=!1;function ne(){return z}function M(t){const e=z;return z=t,e}function oe(t){t.isStale=!0,B?L.add(t):t.execute()}function de(t){const e=B;B=!0;try{return t()}finally{B=e,B||me()}}function me(){for(;L.size>0;){const t=Array.from(L);L.clear();for(const e of t)e.isStale&&e.execute()}}class fe{constructor(e){v(this,"_value");v(this,"_subscribers",new Set);this._value=e}get value(){const e=ne();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}set value(e){Object.is(this._value,e)||(this._value=e,this.notify())}peek(){return this._value}notify(){const e=Array.from(this._subscribers);for(const r of e)oe(r)}_unsubscribe(e){this._subscribers.delete(e)}}function k(t){return new fe(t)}class he{constructor(e){v(this,"_value");v(this,"_node");v(this,"_subscribers",new Set);v(this,"_isDirty",!0);v(this,"_fn");this._fn=e,this._node={dependencies:new Set,isStale:!0,execute:()=>{if(!this._isDirty){this._isDirty=!0;const r=Array.from(this._subscribers);for(const n of r)oe(n)}}}}get value(){this._isDirty&&this._recompute();const e=ne();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}peek(){return this._isDirty&&this._recompute(),this._value}_unsubscribe(e){this._subscribers.delete(e)}_recompute(){for(const r of this._node.dependencies)r._unsubscribe(this._node);this._node.dependencies.clear();const e=M(this._node);try{this._value=this._fn(),this._isDirty=!1,this._node.isStale=!1}finally{M(e)}}}function ae(t){return new he(t)}let pe=null;function ge(){return pe}function W(t){let e;const r={dependencies:new Set,isStale:!1,execute:()=>{for(const i of r.dependencies)i._unsubscribe(r);if(r.dependencies.clear(),typeof e=="function")try{e()}catch(i){console.error("[Nova Signal Effect Cleanup Error]:",i)}const a=M(r);try{e=t()}finally{M(a),r.isStale=!1}}};r.execute();const n=()=>{for(const a of r.dependencies)a._unsubscribe(r);r.dependencies.clear(),typeof e=="function"&&e()},o=ge();return o&&o.addCleanup(n),n}function ie(){return typeof window<"u"&&"Part"in window&&"ChildNodePart"in window&&typeof window.getParts=="function"}class V{constructor(e){v(this,"parentNode");v(this,"previousSibling");v(this,"nextSibling");v(this,"value");v(this,"_currentNode");const r=e.parentNode;if(!r)throw new Error("[Zuari DOM Parts]: Placeholder node must have a parent container.");this.parentNode=r,this.previousSibling=e.previousSibling,this.nextSibling=e.nextSibling;const n=document.createTextNode("");r.replaceChild(n,e),this._currentNode=n}setValue(e){if(this.value=e,e instanceof DocumentFragment){const r=document.createTextNode("");this.parentNode.replaceChild(r,this._currentNode),this.parentNode.insertBefore(e,r),this._currentNode=r;return}if(e instanceof Node){this._currentNode!==e&&(this.parentNode.replaceChild(e,this._currentNode),this._currentNode=e);return}if(this._currentNode instanceof Text)this._currentNode.data=String(e??"");else{const r=document.createTextNode(String(e??""));this.parentNode.replaceChild(r,this._currentNode),this._currentNode=r}}disconnect(){}}class U{constructor(e,r){v(this,"element");v(this,"attributeName");v(this,"value");this.element=e,this.attributeName=r}setValue(e){this.value=e,e===!1||e===null||e===void 0?this.element.removeAttribute(this.attributeName):this.element.setAttribute(this.attributeName,String(e))}disconnect(){this.element.removeAttribute(this.attributeName)}}function ye(t){if(ie())try{const e=window.ChildNodePart;return new e(t)}catch{return new V(t)}return new V(t)}function ve(t,e){if(ie())try{const r=window.AttributePart;return new r(t,e)}catch{return new U(t,e)}return new U(t,e)}function be(t,e,r,n){const o=we(t,`<!--zuari-hole-${e}-->`);if(o){const u=ye(o);if(G(r)){const c=W(()=>u.setValue(J(r)));n.push(()=>{var s;c(),(s=u.disconnect)==null||s.call(u)})}else u.setValue(r);return}const a=`data-zuari-attr-${e}`,i=ke(t,a);if(!i)return;const{element:f,attrName:p}=i;if(p.startsWith("@")||p.startsWith("on")){const u=(p.startsWith("@")?p.slice(1):p.slice(2)).toLowerCase();if(f.removeAttribute(p),typeof r!="function")return;const c=r;f.addEventListener(u,c),n.push(()=>f.removeEventListener(u,c));return}const h=ve(f,p);if(G(r)){const u=W(()=>h.setValue(J(r)));n.push(()=>{var c;u(),(c=h.disconnect)==null||c.call(h)})}else h.setValue(r)}function G(t){return typeof t=="object"&&t!==null&&"value"in t||typeof t=="function"}function J(t){return typeof t=="object"&&t!==null&&"value"in t?t.value:typeof t=="function"?t():t}function we(t,e){const r=document.createNodeIterator(t,NodeFilter.SHOW_COMMENT);let n=r.nextNode();for(;n;){if(`<!--${n.data}-->`===e)return n;n=r.nextNode()}return null}function ke(t,e){const r=document.createNodeIterator(t,NodeFilter.SHOW_ELEMENT);let n=r.nextNode();for(;n;){for(const o of Array.from(n.attributes))if(o.value.includes(e))return{element:n,attrName:o.name};n=r.nextNode()}return null}const Y=new Map,Ce="<!--zuari-hole-",Se="-->",$e="data-zuari-attr-";function d(t,...e){return{strings:t,values:e}}function Z(t,e){const{strings:r,values:n}=t,o=r.join("<!--?-->");let a=Y.get(o);a||(a=document.createElement("template"),a.innerHTML=r.reduce((h,u,c)=>{if(c>=n.length)return h+u;const l=/=["']?[^"'>]*$/.test(u)?`"${$e}${c}"`:`${Ce}${c}${Se}`;return h+u+l},""),Y.set(o,a));const i=a.content.cloneNode(!0),f=Array.from(i.childNodes),p=[];return n.forEach((h,u)=>be(i,u,h,p)),{fragment:i,destroy(){p.forEach(h=>h()),f.forEach(h=>{var u;return(u=h.parentNode)==null?void 0:u.removeChild(h)})}}}const xe={primary:"#006A6A",onPrimary:"#FFFFFF",primaryContainer:"#6FF7F6",onPrimaryContainer:"#002020",secondary:"#4A6363",onSecondary:"#FFFFFF",background:"#FAFDFD",onBackground:"#191C1C",surface:"#FAFDFD",onSurface:"#191C1C",surfaceVariant:"#DAE5E4",outline:"#6F7979"},Pe={primary:"#4CDADA",onPrimary:"#003737",primaryContainer:"#004F4F",onPrimaryContainer:"#6FF7F6",secondary:"#B1CCCC",onSecondary:"#1C3534",background:"#191C1C",onBackground:"#E1E3E3",surface:"#191C1C",onSurface:"#E1E3E3",surfaceVariant:"#3F4948",outline:"#899392"};function Ne(t=!1){const e=k(t),r=k(t?{...Pe}:{...xe}),n=ae(()=>!!(typeof navigator<"u"&&/android/i.test(navigator.userAgent)||typeof window<"u"&&window.Android)),o=new Map;typeof window<"u"&&(window.__zuariKotlinDispatcher=(c,s)=>{const l=o.get(c);if(l)try{const y=JSON.parse(s);l(y)}catch{l(s)}});function a(c,...s){return new Promise((l,y)=>{if(typeof window<"u"&&window.Android){const H=window.Android;if(typeof H[c]=="function")try{const F=H[c](...s);try{l(JSON.parse(F))}catch{l(F)}return}catch(F){y(F);return}}l({success:!0,mock:!0,function:c,args:s})})}function i(c,s){return o.set(c,s),()=>{o.delete(c)}}function f(c){de(()=>{r.value={...r.value,...c}})}function p(c){const s=(c==null?void 0:c.packageName)??"com.zuari.ui.theme",l=(c==null?void 0:c.themeName)??"ZuariTheme",y={...r.value,...(c==null?void 0:c.colors)??{}};return`package ${s}

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Native Material 3 Dynamic Colors generated by Zuari (@zuari/kotlin)
val ZuariPrimary = Color(android.graphics.Color.parseColor("${y.primary}"))
val ZuariOnPrimary = Color(android.graphics.Color.parseColor("${y.onPrimary}"))
val ZuariPrimaryContainer = Color(android.graphics.Color.parseColor("${y.primaryContainer}"))
val ZuariOnPrimaryContainer = Color(android.graphics.Color.parseColor("${y.onPrimaryContainer}"))
val ZuariSecondary = Color(android.graphics.Color.parseColor("${y.secondary}"))
val ZuariOnSecondary = Color(android.graphics.Color.parseColor("${y.onSecondary}"))
val ZuariBackground = Color(android.graphics.Color.parseColor("${y.background}"))
val ZuariOnBackground = Color(android.graphics.Color.parseColor("${y.onBackground}"))
val ZuariSurface = Color(android.graphics.Color.parseColor("${y.surface}"))
val ZuariOnSurface = Color(android.graphics.Color.parseColor("${y.onSurface}"))
val ZuariSurfaceVariant = Color(android.graphics.Color.parseColor("${y.surfaceVariant}"))
val ZuariOutline = Color(android.graphics.Color.parseColor("${y.outline}"))

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
fun ${l}(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = ZuariColorScheme,
        typography = Typography(),
        content = content
    )
}
`}function h(c){const s=(c==null?void 0:c.themeName)??"Theme.Zuari.Native",l={...r.value,...(c==null?void 0:c.colors)??{}};return`<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by @zuari/kotlin Native Android Bridge -->
<resources>
    <style name="${s}" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="colorPrimary">${l.primary}</item>
        <item name="colorOnPrimary">${l.onPrimary}</item>
        <item name="colorPrimaryContainer">${l.primaryContainer}</item>
        <item name="colorOnPrimaryContainer">${l.onPrimaryContainer}</item>
        <item name="colorSecondary">${l.secondary}</item>
        <item name="colorOnSecondary">${l.onSecondary}</item>
        <item name="android:colorBackground">${l.background}</item>
        <item name="colorOnBackground">${l.onBackground}</item>
        <item name="colorSurface">${l.surface}</item>
        <item name="colorOnSurface">${l.onSurface}</item>
        <item name="colorSurfaceVariant">${l.surfaceVariant}</item>
        <item name="colorOutline">${l.outline}</item>
    </style>
</resources>
`}function u(c){const s=c??(typeof document<"u"?document.documentElement:null);return s?W(()=>{const l=r.value;s.style.setProperty("--md-sys-color-primary",l.primary),s.style.setProperty("--md-sys-color-on-primary",l.onPrimary),s.style.setProperty("--md-sys-color-primary-container",l.primaryContainer),s.style.setProperty("--md-sys-color-on-primary-container",l.onPrimaryContainer),s.style.setProperty("--md-sys-color-secondary",l.secondary),s.style.setProperty("--md-sys-color-on-secondary",l.onSecondary),s.style.setProperty("--md-sys-color-background",l.background),s.style.setProperty("--md-sys-color-on-background",l.onBackground),s.style.setProperty("--md-sys-color-surface",l.surface),s.style.setProperty("--md-sys-color-on-surface",l.onSurface),s.style.setProperty("--md-sys-color-surface-variant",l.surfaceVariant),s.style.setProperty("--md-sys-color-outline",l.outline)}):()=>{}}return{isAndroid:n,dynamicColors:r,isDarkTheme:e,callNativeFunction:a,registerNativeCallback:i,generateComposeThemeCode:p,generateXmlThemeCode:h,ingestDynamicPalette:f,applyToCssVariables:u}}const I=Ne(!0);function N(){return typeof window<"u"&&window.Android?window.Android:null}function D(t){const e=N();e?e.commitText(t):console.log("[Dev Mock Commit]:",t)}function K(){const t=N();t?t.deleteBackward():console.log("[Dev Mock Delete]")}function Te(){const t=N();t?t.sendEnter():console.log("[Dev Mock Enter]")}function C(t="click"){const e=N();e&&typeof e.triggerHaptic=="function"&&e.triggerHaptic(t)}function Ae(t){const e=N();if(e&&typeof e.requestScreenshotAnalysis=="function")try{const r=e.requestScreenshotAnalysis(t);return JSON.parse(r)}catch{return{status:"error",blocks:[]}}return{status:"ok",blocks:[{text:"Are you free for drinks this weekend?",x:48,y:420,width:320,screenWidth:1080}]}}function Ee(){const t=N();if(t&&typeof t.requestScreenScan=="function")try{const e=t.requestScreenScan();return JSON.parse(e)}catch{return{status:"error",blocks:[]}}return{status:"ok",appPackage:"com.snapchat.android",blocks:[{text:"What is your biggest red flag?",x:52,y:460,width:300,screenWidth:1080}]}}function _e(){const t=N();if(t&&typeof t.getActiveContext=="function")try{return JSON.parse(t.getActiveContext())}catch{return{status:"none"}}return{status:"none"}}function Be(t){const e=N();e&&typeof e.openSystemSetting=="function"?e.openSystemSetting(t):console.log("[Dev Mock Open Setting]:",t)}function Re(t,e){return`You are an elite wingman who excels at playful, concise, charismatic banter.
Your task: Suggest 3 distinct next moves for a dating app conversation.
Strict rules:
1. MAX 12 words per line.
2. NO cheesy cliché compliments like "Hey cutie" or "You must be tired from running through my mind".
3. Use witty banter, slight teasing, or confident playful framing.
4. Output MUST be valid JSON array with keys: "vibe" (Smooth | Tease | Bold) and "line" (string).

Partner said: "${t}"
${e?`Context I said previously: "${e}"`:""}

Respond ONLY with the JSON array:`}function Oe(t){return`You are a charisma coach. Rewrite this bland text message into 3 sharper, confident, flirty versions.
Max 12 words each.
Bland text: "${t}"

Output ONLY a JSON array with objects: [{"vibe": "Smooth", "line": "..."}, {"vibe": "Tease", "line": "..."}, {"vibe": "Bold", "line": "..."}]`}const X={"com.snapchat.android":"Snapchat","org.telegram.messenger":"Telegram","org.thoughtcrime.securesms":"Signal","co.hinge.app":"Hinge","com.bumble.app":"Bumble","com.tinder":"Tinder","com.instagram.android":"Instagram","com.whatsapp":"WhatsApp","web.whatsapp.com":"WhatsApp Web","instagram.com":"Instagram DM","web.telegram.org":"Telegram Web","tinder.com":"Tinder Web","bumble.com":"Bumble Web","discord.com":"Discord","x.com":"X DM"};function se(t){if(!t)return;const e=t.replace(/^www\./i,"");if(X[e])return X[e];const r=e.split("."),n=r[r.length-1];if(!n||["android","app","messenger","com","org","io"].includes(n)){const o=r[r.length-2];return o?o.charAt(0).toUpperCase()+o.slice(1):void 0}return n.charAt(0).toUpperCase()+n.slice(1)}function De(t){const e=se(t.appPackage);switch(t.source){case"screenshot":return"📸 Screenshot";case"notification":return e?`🔔 ${e} Msg`:"🔔 Incoming Msg";case"clipboard":return"📋 Copied Bubble";case"accessibility":return e?`👁️ ${e} Scan`:"👁️ Screen Scan";case"selection":return"✨ Selected Text";case"dom":return e?`🌐 ${e} Chat`:"🌐 Web Chat";case"manual":return"💬 Stealth Context"}}function Fe(t){const e=t.partnerText.length>26?`${t.partnerText.slice(0,26).trim()}…`:t.partnerText;switch(t.source){case"screenshot":return"📸 Screenshot Detected: Analyze Next Move";case"notification":{const r=se(t.appPackage);return r?`🔔 ${r}: "${e}" — Reply`:`🔔 New Msg: "${e}" — Reply`}case"clipboard":return`📋 Copied: "${e}" — Reply`;case"accessibility":case"dom":return`👁️ Scanned: "${e}" — Reply`;case"selection":return`✨ Selected: "${e}" — Reply`;case"manual":return"💬 Context Ready — View Replies"}}class Le{constructor(){this.recentSelfCommits=new Set}recordSelfCommit(e){const r=this.normalize(e);if(r&&(this.recentSelfCommits.add(r),this.recentSelfCommits.size>25)){const n=this.recentSelfCommits.values().next().value;n&&this.recentSelfCommits.delete(n)}}isIgnored(e,r){const n=e.trim();if(!n)return!0;if(r==="manual"||r==="selection")return!1;const o=this.normalize(n);return!!(this.recentSelfCommits.has(o)||/^https?:\/\/\S+$/i.test(n)||/^\d{4,8}$/.test(n))}normalize(e){return e.toLowerCase().replace(/\s+/g," ").trim()}}function Me(t){const e={rawBlocks:t.map(n=>n.text)};if(t.length===0)return e;const r=t.filter(n=>{const o=n.y<120,a=n.y>n.screenWidth*1.8;return!o&&!a});r.sort((n,o)=>n.y-o.y);for(let n=r.length-1;n>=0;n--){const o=r[n],a=o.x+o.width/2>o.screenWidth/2;if(!a&&!e.senderText?e.senderText=o.text:a&&!e.myLastText&&(e.myLastText=o.text),e.senderText&&e.myLastText)break}return e}const Ie=[{id:"op-1",category:"opener",vibe:"playful",triggerKeywords:["travel","hiking","nature"],template:"Are you as adventurous as your profile says, or do you also get lost in grocery stores?"},{id:"op-2",category:"opener",vibe:"smooth",triggerKeywords:["smile","eyes","cute"],template:"I was going to wait two days to message you, but patience was never my strong suit."},{id:"op-3",category:"opener",vibe:"witty",triggerKeywords:["food","coffee","cooking"],template:"Important question: what is your most controversial culinary opinion?"},{id:"bt-1",category:"banter",vibe:"playful",triggerKeywords:["trouble","sarcasm","bad"],template:"Are you always this much trouble or did I catch you on a good day?"},{id:"bt-2",category:"banter",vibe:"witty",triggerKeywords:["challenge","bet","win"],template:"Careful, high expectations are my only weakness."},{id:"bt-3",category:"banter",vibe:"bold",triggerKeywords:["rules","late","fast"],template:"I would say you are five minutes away from being my favorite person."},{id:"wp-1",category:"wordplay",vibe:"witty",triggerKeywords:["smart","books","study","work"],template:"Are you an overdue library book? Because you have fine written all over you."},{id:"wp-2",category:"wordplay",vibe:"smooth",triggerKeywords:["music","song","playlist"],template:"If our conversation was a playlist, I would have it on repeat."},{id:"cl-1",category:"closer",vibe:"bold",triggerKeywords:["drinks","date","weekend","meet","free","tonight"],template:"Drinks this Thursday. You pick the spot, I will bring the conversation."},{id:"cl-2",category:"closer",vibe:"smooth",triggerKeywords:["coffee","tea","afternoon","sunday","morning"],template:"Let us see if you are as fun in person. Coffee tomorrow?"},{id:"rf-1",category:"banter",vibe:"playful",triggerKeywords:["red flag","toxic","flaw","worst"],template:"My biggest red flag is thinking I can win every staring contest."},{id:"sn-1",category:"banter",vibe:"bold",triggerKeywords:["snap","streak","vanish","secret","disappear"],template:"Disappearing messages just mean we have to make every line count."},{id:"wy-1",category:"banter",vibe:"witty",triggerKeywords:["wyd","doing","bored","up to","plans"],template:"Plotting my next move, and you just walked right into it."},{id:"pt-1",category:"opener",vibe:"playful",triggerKeywords:["dog","puppy","cat","pet","gym","workout"],template:"Be honest: am I competing with your pet for attention, or do I stand a chance?"}];function je(t,e=3){const r=t.toLowerCase();if(!r.trim())return[];const n=Ie.map(o=>{let a=0;for(const i of o.triggerKeywords)r.includes(i)&&(a+=2);return{entry:o,score:a}}).filter(o=>o.score>0);return n.sort((o,a)=>a.score-o.score),n.slice(0,e).map(o=>o.entry)}class ze{generateOfflineSuggestions(e,r){const n=e.trim(),o=n.toLowerCase(),a=je(n,3),i={};for(const s of a)s.vibe==="smooth"&&!i.Smooth?i.Smooth=s.template:(s.vibe==="playful"||s.vibe==="witty")&&!i.Tease?i.Tease=s.template:s.vibe==="bold"&&!i.Bold&&(i.Bold=s.template);for(const s of a)!i.Smooth&&s.template!==i.Tease&&s.template!==i.Bold?i.Smooth=s.template:!i.Tease&&s.template!==i.Smooth&&s.template!==i.Bold?i.Tease=s.template:!i.Bold&&s.template!==i.Smooth&&s.template!==i.Tease&&(i.Bold=s.template);const f=n.includes("?")||/^(what|why|how|where|when|who|are|do|did|would)\b/i.test(n),p=n.length>0&&n.split(/\s+/).length<=2&&!f,h=f?"Careful, the honest answer might make you like me more.":p?"You are a person of few words—good thing I speak fluent mystery.":o.includes("haha")||o.includes("lol")?"Making you laugh this early is dangerous for both of us.":"I was going to play it cool, but you made that impossible.",u=f?"I plead the fifth—unless you are buying the first round.":p?"Do not hurt your thumbs typing a whole novel over there.":"Are you always this much trouble or is today special?",c=f?"Better story in person. Are you free Thursday night?":"Skip the small talk: what is your go-to spot for drinks?";return[{vibe:"Smooth",line:i.Smooth??h},{vibe:"Tease",line:i.Tease??u},{vibe:"Bold",line:i.Bold??c}]}getPromptForChat(e,r){return Re(e,r)}getPromptForRewrite(e){return Oe(e)}}class We{constructor(){this.engine=new ze,this.filter=new Le,this.lastProcessedSignature=""}recordCommittedReply(e){this.filter.recordSelfCommit(e)}isIgnoredNoiseOrSelf(e,r){return this.filter.isIgnored(e,r)}ingestRawContext(e){var a,i;const r=e.text.replace(/\s+/g," ").trim();if(this.filter.isIgnored(r,e.source))return null;const n=`${e.source}:${e.appPackage??""}:${this.filter.normalize(r)}`;if(e.source!=="manual"&&e.source!=="selection"&&n===this.lastProcessedSignature)return null;this.lastProcessedSignature=n;const o=e.timestamp??Date.now();return{id:`${e.source}-${o}`,source:e.source,partnerText:r,myLastText:((a=e.myLastText)==null?void 0:a.trim())||void 0,senderName:((i=e.senderName)==null?void 0:i.trim())||void 0,appPackage:e.appPackage,uri:e.uri,timestamp:o}}ingestScreenBlocks(e,r,n){var i;if(!e||e.length===0)return null;const o=Me(e),a=o.senderText??o.rawBlocks.find(f=>!this.filter.isIgnored(f,r));return a?{id:`${r}-${(n==null?void 0:n.timestamp)??Date.now()}`,source:r,partnerText:a.trim(),myLastText:(i=o.myLastText)==null?void 0:i.trim(),appPackage:n==null?void 0:n.appPackage,uri:n==null?void 0:n.uri,timestamp:(n==null?void 0:n.timestamp)??Date.now()}:null}resolveSuggestions(e){const r=this.engine.generateOfflineSuggestions(e.partnerText,e.myLastText);return{context:e,suggestions:r}}}class qe{constructor(){this.root={children:new Map,isWord:!1,frequency:0},this.bigrams=new Map,this.seedCommonVocabulary()}insert(e,r=1){let n=this.root;const o=e.toLowerCase();for(const a of o)n.children.has(a)||n.children.set(a,{children:new Map,isWord:!1,frequency:0}),n=n.children.get(a);n.isWord=!0,n.frequency+=r}addBigram(e,r){const n=e.toLowerCase(),o=r.toLowerCase();let a=this.bigrams.get(n);a||(a=[],this.bigrams.set(n,a));const i=a.find(f=>f.word===o);i?i.count++:a.push({word:o,count:1}),a.sort((f,p)=>p.count-f.count)}completePrefix(e,r=3){if(!e)return[];let n=this.root;const o=e.toLowerCase();for(const i of o){if(!n.children.has(i))return[];n=n.children.get(i)}const a=[];return this.collectWords(n,o,a),a.sort((i,f)=>f.frequency-i.frequency),a.slice(0,r).map(i=>i.word)}predictNextWord(e,r=3){if(!e)return["the","you","i"];const n=e.toLowerCase(),o=this.bigrams.get(n);return o&&o.length>0?o.slice(0,r).map(a=>a.word):["and","to","you"]}collectWords(e,r,n){e.isWord&&n.push({word:r,frequency:e.frequency});for(const[o,a]of e.children.entries())this.collectWords(a,r+o,n)}seedCommonVocabulary(){const e=[["are",100],["you",120],["free",80],["tonight",75],["tomorrow",70],["weekend",85],["coffee",65],["drinks",65],["dinner",60],["what",110],["when",95],["where",90],["why",85],["how",105],["about",80],["going",85],["good",90],["great",85],["plans",70],["sounds",80],["like",100],["love",95],["see",85],["talking",60]];for(const[n,o]of e)this.insert(n,o);const r=[["how","are"],["are","you"],["you","free"],["free","tonight"],["free","this"],["this","weekend"],["what","are"],["sounds","like"],["let","us"],["see","you"],["good","to"],["grab","coffee"]];for(const[n,o]of r)this.addBigram(n,o)}}function Ze(t){const e=t.trim(),r=e.toLowerCase();return e?/^(hey|hi|hello|sup|yo|wyd|what'?s up)$/i.test(e)?{score:2,verdict:"Dry",feedback:"Low effort opener. High ghosting probability (~90%).",improved:"Important question: what is your most controversial food opinion?"}:r.includes("how are you")||r.includes("how was your day")?{score:4,verdict:"Safe",feedback:"Polite but sounds like an HR interview.",improved:"Tell me your day was more exciting than grocery shopping."}:r.includes("cutie")||r.includes("beautiful")||r.includes("gorgeous")?{score:5,verdict:"Safe",feedback:"Compliment is sweet, but every other match says the exact same thing.",improved:"I was going to play it cool, but you made that impossible."}:r.includes("trouble")||r.includes("bet")||r.includes("drinks")||r.includes("coffee")?{score:9,verdict:"Smooth",feedback:"High energy, playful intrigue. Ready to send.",improved:e}:{score:7,verdict:"Smooth",feedback:"Solid message. Could use 10% more cheekiness.",improved:`${e} — unless you scare easily.`}:{score:1,verdict:"Dry",feedback:"Empty canvas. Drop something bold.",improved:"Are we breaking records or rules tonight?"}}const j=[{name:"Smileys & Rizz",icon:"😏",emojis:["😏","😉","😎","😜","🔥","👀","✨","💅","😈","🫦","🫠","🤭","🥰","😘","❤️‍🔥"]},{name:"Love & Hearts",icon:"❤️",emojis:["❤️","💖","💘","💕","💌","🌹","💐","🥂","🍾","🍫","💍","💋"]},{name:"Reactions & Gestures",icon:"✌️",emojis:["✌️","🤙","🤌","🤝","🙌","👏","🫡","🤷‍♂️","🤷‍♀️","🤦‍♂️","💯","🎯"]},{name:"Food & Dates",icon:"☕",emojis:["☕","🍸","🍷","🍕","🍣","🌮","🍦","🍿","🎬","🎳","🏎️","✈️"]}];function b(t){const{fragment:e}=Z(t);if(e.childElementCount===1&&e.firstElementChild)return e.firstElementChild;const r=document.createElement("div");return r.style.display="contents",r.appendChild(e),r}function _(t,e){const r=document.createElement("div");r.className=t;for(const n of e){const{fragment:o}=Z(n);r.appendChild(o)}return r}function Ke(t){return b(d`
    <div class="action-bar">
      ${()=>t.activeContext.value?b(d`
            <button class="action-pill highlight" @click=${t.onOpenContextReplies}>
              ${Fe(t.activeContext.value)}
            </button>
          `):""}
      <button class="action-pill" @click=${t.onScanScreen}>
        👁️ Scan Screen
      </button>
      <button
        class=${()=>t.stealthMode.value?"action-pill active-mode":"action-pill"}
        @click=${t.onToggleStealth}>
        💬 Tell Rizz
      </button>
      <button class="action-pill" @click=${t.onToggleRoast}>
        🔥 Roast Draft
      </button>
      <button class="action-pill" @click=${t.onToggleClipboard}>
        📋 Clipboard
      </button>
      <button class="action-pill" @click=${t.onToggleEmojis}>
        😏 Emojis
      </button>
    </div>
  `)}function He(t){return b(d`
    <div class="stealth-bar">
      <div class="stealth-top">
        <span class="stealth-badge">🛡️ STEALTH MODE · Hidden from chat</span>
        <div class="stealth-actions">
          ${()=>t.showEnableScanner.value?b(d`
                <button class="stealth-link" @click=${t.onEnableScanner}>
                  Enable Scanner ⚙
                </button>
              `):""}
          <button class="back-link" @click=${t.onCancel}>Cancel ✕</button>
        </div>
      </div>
      <div class="stealth-input-row">
        <div class="stealth-preview">
          ${()=>t.buffer.value?t.buffer.value:t.hint.value??'Type what they said or asked (e.g. "asked my red flag")…'}
        </div>
        <button class="stealth-go-btn" @click=${t.onGenerate}>
          ⚡ Replies
        </button>
      </div>
    </div>
  `)}function Ve(t){return b(d`
    <div class="suggestions-shell">
      ${()=>_("suggestions-panel",t.suggestions.value.map(e=>d`
          <div class="suggestion-card" @click=${()=>t.onSelectSuggestion(e)}>
            <span class="suggestion-text">${e}</span>
          </div>
        `))}
    </div>
  `)}function Ue(t){const e=["q","w","e","r","t","y","u","i","o","p"],r=["a","s","d","f","g","h","j","k","l"],n=["z","x","c","v","b","n","m"],o=document.createElement("div");o.className="keyboard-row",o.appendChild(b(d`<button class="key-btn special" @click=${t.onOpenEmojis}>123</button>`));for(const a of n)o.appendChild(b(d`<button class="key-btn" @click=${()=>t.onKeyPress(a)}>${a}</button>`));return o.appendChild(b(d`<button class="key-btn special" @click=${t.onBackspace}>⌫</button>`)),b(d`
    <div class="keyboard-grid">
      ${_("keyboard-row",e.map(a=>d`<button class="key-btn" @click=${()=>t.onKeyPress(a)}>${a}</button>`))}
      ${_("keyboard-row",r.map(a=>d`<button class="key-btn" @click=${()=>t.onKeyPress(a)}>${a}</button>`))}
      ${o}
      <div class="keyboard-row">
        <button class="key-btn special" @click=${t.onOpenEmojis}>😏</button>
        <button class="key-btn special" @click=${()=>t.onKeyPress("?")}>?</button>
        <button class="key-btn space" @click=${()=>t.onKeyPress(" ")}>
          ${()=>t.stealthMode.value?"stealth space":"space"}
        </button>
        <button class="key-btn special" @click=${()=>t.onKeyPress(".")}>.</button>
        <button class="key-btn send" @click=${t.onSend}>
          ${()=>t.stealthMode.value?"Ask ⚡":"Send"}
        </button>
      </div>
    </div>
  `)}function Ge(t){const e=k(0),r=document.createElement("div");return r.className="emoji-tabs",j.forEach((n,o)=>{r.appendChild(b(d`
        <button
          class=${()=>o===e.value?"emoji-tab active":"emoji-tab"}
          @click=${()=>e.value=o}>
          ${n.icon}
        </button>
      `))}),r.appendChild(b(d`<button class="emoji-tab back-key" @click=${t.onClose}>ABC</button>`)),b(d`
    <div class="emoji-view">
      ${r}
      ${()=>{const n=j[e.value]??j[0];return _("emoji-grid",n.emojis.map(o=>d`
            <button class="emoji-btn" @click=${()=>t.onSelectEmoji(o)}>${o}</button>
          `))}}
    </div>
  `)}function Je(t){return b(d`
    <div class="clipboard-view">
      <div class="clipboard-header">
        <span>Copied Bubbles — Tap to Paste or ⚡ Reply</span>
        <button class="back-link" @click=${t.onClose}>Close ✕</button>
      </div>
      ${()=>_("clipboard-list",t.history.value.map(e=>d`
          <div class="clipboard-item-row">
            <div class="clipboard-item" @click=${()=>t.onSelectClip(e)}>
              ${e}
            </div>
            <button class="clip-analyze-btn" @click=${()=>t.onAnalyzeClip(e)}>
              ⚡ Reply
            </button>
          </div>
        `))}
    </div>
  `)}function Ye(t){return b(d`
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
  `)}function Xe(t){return b(d`
    <div class="nextmove-view">
      <div class="nextmove-header">
        <div class="nextmove-meta">
          <span class="source-chip">
            ${()=>t.resolution.value?De(t.resolution.value.context):"⚡ Next Move"}
          </span>
          <span class="partner-quote">
            "${()=>{var r;const e=((r=t.resolution.value)==null?void 0:r.context.partnerText)??"";return e.length>44?`${e.slice(0,44).trim()}…`:e}}"
          </span>
        </div>
        <div class="nextmove-actions">
          <button class="back-link" @click=${t.onSwitchToStealth}>Edit</button>
          <button class="back-link" @click=${t.onClose}>Close ✕</button>
        </div>
      </div>

      ${()=>{const e=t.resolution.value;return!e||e.suggestions.length===0?b(d`
            <div class="roast-feedback">Tap "Tell Rizz" or "Scan Screen" to load chat context.</div>
          `):_("nextmove-cards",e.suggestions.map(r=>d`
            <div class="vibe-card" @click=${()=>t.onSelectReply(r.line)}>
              <span class="vibe-tag vibe-${r.vibe.toLowerCase()}">${r.vibe}</span>
              <span class="vibe-line">${r.line}</span>
            </div>
          `))}}
    </div>
  `)}const Q=new qe,w=new We,m=k("qwerty"),S=k(""),E=k(void 0),x=k(null),T=k(null),g=k(!1),$=k(""),R=k(null),A=k(!1),ce=k(null),q=k(["What is your biggest red flag?","Are we still on for coffee this weekend?"]),Qe=ae(()=>{const t=g.value?$.value:S.value;if(!t)return g.value?["asked","red","weekend"]:["how","are","you"];const e=t.trim().split(/\s+/),r=e[e.length-1];if(t.endsWith(" "))return Q.predictNextWord(r,3);{const n=Q.completePrefix(r,3);return n.length>0?n:[r]}});I.registerNativeCallback("appContextChanged",t=>{t!=null&&t.packageName&&(E.value=t.packageName)});I.registerNativeCallback("screenshotDetected",t=>{t!=null&&t.uri&&(x.value={id:`screenshot-${t.timestamp??Date.now()}`,source:"screenshot",partnerText:"Screenshot captured",uri:t.uri,appPackage:t.appPackage??E.value,timestamp:Date.now()},C("heavy"))});I.registerNativeCallback("contextDetected",t=>{if(!(t!=null&&t.text)||!(t!=null&&t.source))return;const e=w.ingestRawContext({source:t.source,text:t.text,senderName:t.senderName,appPackage:t.appPackage??E.value,timestamp:t.timestamp});e&&(x.value=e,C("click"))});I.registerNativeCallback("clipboardAdded",t=>{if(t!=null&&t.text){const e=String(t.text).trim();if(!e)return;q.value=[e,...q.value.filter(n=>n!==e).slice(0,9)];const r=w.ingestRawContext({source:"clipboard",text:e,appPackage:E.value});r&&(x.value=r)}});const P=_e();if(P.status==="ok"&&P.text&&P.source){const t=w.ingestRawContext({source:P.source,text:P.text,senderName:P.senderName,appPackage:P.appPackage,timestamp:P.timestamp});t&&(x.value=t)}function et(t){if(C("heavy"),t.source==="screenshot"&&t.uri){const e=Ae(t.uri),r=w.ingestScreenBlocks(e.blocks,"screenshot",{appPackage:e.appPackage??t.appPackage,uri:t.uri});if(!r){x.value=null,O("Screenshot looked blank/protected — type what they said:");return}T.value=w.resolveSuggestions(r),x.value=null,g.value=!1,m.value="nextmove";return}T.value=w.resolveSuggestions(t),x.value=null,g.value=!1,m.value="nextmove"}function tt(){C("click");const t=Ee();if(t.status==="ok"&&t.blocks.length>0){const e=w.ingestScreenBlocks(t.blocks,"accessibility",{appPackage:t.appPackage??E.value});if(e){T.value=w.resolveSuggestions(e),g.value=!1,m.value="nextmove";return}}if(t.status==="not_enabled"){A.value=!0,O("Scanner off — type what they said, or tap Enable Scanner ⚙");return}A.value=!1,O("Screen protected (FLAG_SECURE) — type a quick summary here:")}function O(t){R.value=t??null,g.value=!0,m.value="qwerty"}function rt(){C("click"),g.value?(g.value=!1,R.value=null,A.value=!1):(A.value=!1,O())}function ee(){C("heavy");const t=$.value.trim(),e=w.ingestRawContext({source:"manual",text:t||"start playful conversation",appPackage:E.value});e&&(T.value=w.resolveSuggestions(e),g.value=!1,R.value=null,A.value=!1,m.value="nextmove")}function nt(t){C("heavy"),w.recordCommittedReply(t),D(t),S.value=t,$.value="",m.value="qwerty"}function ot(t){const e=w.ingestRawContext({source:"manual",text:t,appPackage:E.value});e&&(e.source="clipboard",T.value=w.resolveSuggestions(e),m.value="nextmove")}function te(t){if(C("light"),g.value){$.value+=t;return}S.value+=t,D(t)}function at(){if(C("light"),g.value){$.value.length>0&&($.value=$.value.slice(0,-1));return}S.value.length>0&&(S.value=S.value.slice(0,-1)),K()}function it(t){if(C("click"),g.value){const n=$.value,o=n.trim().split(/\s+/),a=n.endsWith(" ")?n:o.length>1?o.slice(0,-1).join(" ")+" ":"";$.value=`${a}${t} `;return}const e=S.value,r=e.trim().split(/\s+/);if(!e.endsWith(" ")&&r.length>0){const n=r[r.length-1];for(let o=0;o<n.length;o++)K()}D(t+" "),S.value=(e.endsWith(" ")?e:r.length>1?r.slice(0,-1).join(" ")+" ":"")+t+" "}function st(){C("heavy"),ce.value=Ze(S.value),m.value="roast"}function ct(t){C("click");for(let e=0;e<S.value.length;e++)K();w.recordCommittedReply(t),D(t),S.value=t,m.value="qwerty"}function lt(){return d`
    <div class="rizz-app">
      ${Ke({activeContext:x,stealthMode:g,onOpenContextReplies:()=>{x.value&&et(x.value)},onScanScreen:tt,onToggleStealth:rt,onToggleRoast:()=>{m.value==="roast"?m.value="qwerty":st()},onToggleClipboard:()=>m.value=m.value==="clipboard"?"qwerty":"clipboard",onToggleEmojis:()=>m.value=m.value==="emojis"?"qwerty":"emojis"})}

      ${()=>g.value?He({buffer:$,hint:R,showEnableScanner:A,onGenerate:ee,onEnableScanner:()=>Be("accessibility"),onCancel:()=>{g.value=!1,R.value=null,A.value=!1}}):""}

      ${Ve({suggestions:Qe,onSelectSuggestion:it})}

      ${()=>{const t=m.value;return t==="nextmove"?Xe({resolution:T,onSelectReply:nt,onSwitchToStealth:()=>{var e;$.value=((e=T.value)==null?void 0:e.context.partnerText)??"",O()},onClose:()=>m.value="qwerty"}):t==="emojis"?Ge({onSelectEmoji:te,onClose:()=>m.value="qwerty"}):t==="clipboard"?Je({history:q,onSelectClip:e=>{w.recordCommittedReply(e),D(e),m.value="qwerty"},onAnalyzeClip:e=>{C("heavy"),ot(e)},onClose:()=>m.value="qwerty"}):t==="roast"?Ye({roast:ce,onApplyUpgrade:ct,onClose:()=>m.value="qwerty"}):Ue({stealthMode:g,onKeyPress:te,onBackspace:at,onSend:()=>{g.value?ee():(C("heavy"),Te())},onOpenEmojis:()=>m.value="emojis"})}}
    </div>
  `}const re=document.getElementById("app");if(re){const{fragment:t}=Z(lt());re.appendChild(t)}
