var pe=Object.defineProperty;var he=(e,t,r)=>t in e?pe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var k=(e,t,r)=>he(e,typeof t!="symbol"?t+"":t,r);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}})();let H=null;const W=new Set;let F=!1;function ce(){return H}function q(e){const t=H;return H=e,t}function le(e){e.isStale=!0,F?W.add(e):e.execute()}function ye(e){const t=F;F=!0;try{return e()}finally{F=t,F||ge()}}function ge(){for(;W.size>0;){const e=Array.from(W);W.clear();for(const t of e)t.isStale&&t.execute()}}class be{constructor(t){k(this,"_value");k(this,"_subscribers",new Set);this._value=t}get value(){const t=ce();return t&&(this._subscribers.add(t),t.dependencies.add(this)),this._value}set value(t){Object.is(this._value,t)||(this._value=t,this.notify())}peek(){return this._value}notify(){const t=Array.from(this._subscribers);for(const r of t)le(r)}_unsubscribe(t){this._subscribers.delete(t)}}function S(e){return new be(e)}class ve{constructor(t){k(this,"_value");k(this,"_node");k(this,"_subscribers",new Set);k(this,"_isDirty",!0);k(this,"_fn");this._fn=t,this._node={dependencies:new Set,isStale:!0,execute:()=>{if(!this._isDirty){this._isDirty=!0;const r=Array.from(this._subscribers);for(const n of r)le(n)}}}}get value(){this._isDirty&&this._recompute();const t=ce();return t&&(this._subscribers.add(t),t.dependencies.add(this)),this._value}peek(){return this._isDirty&&this._recompute(),this._value}_unsubscribe(t){this._subscribers.delete(t)}_recompute(){for(const r of this._node.dependencies)r._unsubscribe(this._node);this._node.dependencies.clear();const t=q(this._node);try{this._value=this._fn(),this._isDirty=!1,this._node.isStale=!1}finally{q(t)}}}function ue(e){return new ve(e)}let we=null;function ke(){return we}function U(e){let t;const r={dependencies:new Set,isStale:!1,execute:()=>{for(const s of r.dependencies)s._unsubscribe(r);if(r.dependencies.clear(),typeof t=="function")try{t()}catch(s){console.error("[Nova Signal Effect Cleanup Error]:",s)}const a=q(r);try{t=e()}finally{q(a),r.isStale=!1}}};r.execute();const n=()=>{for(const a of r.dependencies)a._unsubscribe(r);r.dependencies.clear(),typeof t=="function"&&t()},o=ke();return o&&o.addCleanup(n),n}function de(){return typeof window<"u"&&"Part"in window&&"ChildNodePart"in window&&typeof window.getParts=="function"}class X{constructor(t){k(this,"parentNode");k(this,"previousSibling");k(this,"nextSibling");k(this,"value");k(this,"_currentNode");const r=t.parentNode;if(!r)throw new Error("[Zuari DOM Parts]: Placeholder node must have a parent container.");this.parentNode=r,this.previousSibling=t.previousSibling,this.nextSibling=t.nextSibling;const n=document.createTextNode("");r.replaceChild(n,t),this._currentNode=n}setValue(t){if(this.value=t,t instanceof DocumentFragment){const r=document.createTextNode("");this.parentNode.replaceChild(r,this._currentNode),this.parentNode.insertBefore(t,r),this._currentNode=r;return}if(t instanceof Node){this._currentNode!==t&&(this.parentNode.replaceChild(t,this._currentNode),this._currentNode=t);return}if(this._currentNode instanceof Text)this._currentNode.data=String(t??"");else{const r=document.createTextNode(String(t??""));this.parentNode.replaceChild(r,this._currentNode),this._currentNode=r}}disconnect(){}}class Q{constructor(t,r){k(this,"element");k(this,"attributeName");k(this,"value");this.element=t,this.attributeName=r}setValue(t){this.value=t,t===!1||t===null||t===void 0?this.element.removeAttribute(this.attributeName):this.element.setAttribute(this.attributeName,String(t))}disconnect(){this.element.removeAttribute(this.attributeName)}}function Ce(e){if(de())try{const t=window.ChildNodePart;return new t(e)}catch{return new X(e)}return new X(e)}function Se(e,t){if(de())try{const r=window.AttributePart;return new r(e,t)}catch{return new Q(e,t)}return new Q(e,t)}function $e(e,t,r,n){const o=xe(e,`<!--zuari-hole-${t}-->`);if(o){const d=Ce(o);if(ee(r)){const c=U(()=>d.setValue(te(r)));n.push(()=>{var i;c(),(i=d.disconnect)==null||i.call(d)})}else d.setValue(r);return}const a=`data-zuari-attr-${t}`,s=Pe(e,a);if(!s)return;const{element:f,attrName:y}=s;if(y.startsWith("@")||y.startsWith("on")){const d=(y.startsWith("@")?y.slice(1):y.slice(2)).toLowerCase();if(f.removeAttribute(y),typeof r!="function")return;const c=r;f.addEventListener(d,c),n.push(()=>f.removeEventListener(d,c));return}const p=Se(f,y);if(ee(r)){const d=U(()=>p.setValue(te(r)));n.push(()=>{var c;d(),(c=p.disconnect)==null||c.call(p)})}else p.setValue(r)}function ee(e){return typeof e=="object"&&e!==null&&"value"in e||typeof e=="function"}function te(e){return typeof e=="object"&&e!==null&&"value"in e?e.value:typeof e=="function"?e():e}function xe(e,t){const r=document.createNodeIterator(e,NodeFilter.SHOW_COMMENT);let n=r.nextNode();for(;n;){if(`<!--${n.data}-->`===t)return n;n=r.nextNode()}return null}function Pe(e,t){const r=document.createNodeIterator(e,NodeFilter.SHOW_ELEMENT);let n=r.nextNode();for(;n;){for(const o of Array.from(n.attributes))if(o.value.includes(t))return{element:n,attrName:o.name};n=r.nextNode()}return null}const re=new Map,Ne="<!--zuari-hole-",Te="-->",Ae="data-zuari-attr-";function u(e,...t){return{strings:e,values:t}}function J(e,t){const{strings:r,values:n}=e,o=r.join("<!--?-->");let a=re.get(o);a||(a=document.createElement("template"),a.innerHTML=r.reduce((p,d,c)=>{if(c>=n.length)return p+d;const l=/=["']?[^"'>]*$/.test(d)?`"${Ae}${c}"`:`${Ne}${c}${Te}`;return p+d+l},""),re.set(o,a));const s=a.content.cloneNode(!0),f=Array.from(s.childNodes),y=[];return n.forEach((p,d)=>$e(s,d,p,y)),{fragment:s,destroy(){y.forEach(p=>p()),f.forEach(p=>{var d;return(d=p.parentNode)==null?void 0:d.removeChild(p)})}}}const Ee={primary:"#006A6A",onPrimary:"#FFFFFF",primaryContainer:"#6FF7F6",onPrimaryContainer:"#002020",secondary:"#4A6363",onSecondary:"#FFFFFF",background:"#FAFDFD",onBackground:"#191C1C",surface:"#FAFDFD",onSurface:"#191C1C",surfaceVariant:"#DAE5E4",outline:"#6F7979"},_e={primary:"#4CDADA",onPrimary:"#003737",primaryContainer:"#004F4F",onPrimaryContainer:"#6FF7F6",secondary:"#B1CCCC",onSecondary:"#1C3534",background:"#191C1C",onBackground:"#E1E3E3",surface:"#191C1C",onSurface:"#E1E3E3",surfaceVariant:"#3F4948",outline:"#899392"};function Re(e=!1){const t=S(e),r=S(e?{..._e}:{...Ee}),n=ue(()=>!!(typeof navigator<"u"&&/android/i.test(navigator.userAgent)||typeof window<"u"&&window.Android)),o=new Map;typeof window<"u"&&(window.__zuariKotlinDispatcher=(c,i)=>{const l=o.get(c);if(l)try{const g=JSON.parse(i);l(g)}catch{l(i)}});function a(c,...i){return new Promise((l,g)=>{if(typeof window<"u"&&window.Android){const M=window.Android;if(typeof M[c]=="function")try{const b=M[c](...i);try{l(JSON.parse(b))}catch{l(b)}return}catch(b){g(b);return}}l({success:!0,mock:!0,function:c,args:i})})}function s(c,i){return o.set(c,i),()=>{o.delete(c)}}function f(c){ye(()=>{r.value={...r.value,...c}})}function y(c){const i=(c==null?void 0:c.packageName)??"com.zuari.ui.theme",l=(c==null?void 0:c.themeName)??"ZuariTheme",g={...r.value,...(c==null?void 0:c.colors)??{}};return`package ${i}

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Native Material 3 Dynamic Colors generated by Zuari (@zuari/kotlin)
val ZuariPrimary = Color(android.graphics.Color.parseColor("${g.primary}"))
val ZuariOnPrimary = Color(android.graphics.Color.parseColor("${g.onPrimary}"))
val ZuariPrimaryContainer = Color(android.graphics.Color.parseColor("${g.primaryContainer}"))
val ZuariOnPrimaryContainer = Color(android.graphics.Color.parseColor("${g.onPrimaryContainer}"))
val ZuariSecondary = Color(android.graphics.Color.parseColor("${g.secondary}"))
val ZuariOnSecondary = Color(android.graphics.Color.parseColor("${g.onSecondary}"))
val ZuariBackground = Color(android.graphics.Color.parseColor("${g.background}"))
val ZuariOnBackground = Color(android.graphics.Color.parseColor("${g.onBackground}"))
val ZuariSurface = Color(android.graphics.Color.parseColor("${g.surface}"))
val ZuariOnSurface = Color(android.graphics.Color.parseColor("${g.onSurface}"))
val ZuariSurfaceVariant = Color(android.graphics.Color.parseColor("${g.surfaceVariant}"))
val ZuariOutline = Color(android.graphics.Color.parseColor("${g.outline}"))

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
`}function p(c){const i=(c==null?void 0:c.themeName)??"Theme.Zuari.Native",l={...r.value,...(c==null?void 0:c.colors)??{}};return`<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by @zuari/kotlin Native Android Bridge -->
<resources>
    <style name="${i}" parent="Theme.Material3.DayNight.NoActionBar">
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
`}function d(c){const i=c??(typeof document<"u"?document.documentElement:null);return i?U(()=>{const l=r.value;i.style.setProperty("--md-sys-color-primary",l.primary),i.style.setProperty("--md-sys-color-on-primary",l.onPrimary),i.style.setProperty("--md-sys-color-primary-container",l.primaryContainer),i.style.setProperty("--md-sys-color-on-primary-container",l.onPrimaryContainer),i.style.setProperty("--md-sys-color-secondary",l.secondary),i.style.setProperty("--md-sys-color-on-secondary",l.onSecondary),i.style.setProperty("--md-sys-color-background",l.background),i.style.setProperty("--md-sys-color-on-background",l.onBackground),i.style.setProperty("--md-sys-color-surface",l.surface),i.style.setProperty("--md-sys-color-on-surface",l.onSurface),i.style.setProperty("--md-sys-color-surface-variant",l.surfaceVariant),i.style.setProperty("--md-sys-color-outline",l.outline)}):()=>{}}return{isAndroid:n,dynamicColors:r,isDarkTheme:t,callNativeFunction:a,registerNativeCallback:s,generateComposeThemeCode:y,generateXmlThemeCode:p,ingestDynamicPalette:f,applyToCssVariables:d}}const Z=Re(!0);function A(){return typeof window<"u"&&window.Android?window.Android:null}function K(e){const t=A();t?t.commitText(e):console.log("[Dev Mock Commit]:",e)}function Y(){const e=A();e?e.deleteBackward():console.log("[Dev Mock Delete]")}function Be(){const e=A();e?e.sendEnter():console.log("[Dev Mock Enter]")}function C(e="click"){const t=A();t&&typeof t.triggerHaptic=="function"&&t.triggerHaptic(e)}function Oe(e){const t=A();if(t&&typeof t.requestScreenshotAnalysis=="function")try{const r=t.requestScreenshotAnalysis(e);return JSON.parse(r)}catch{return{status:"error",blocks:[]}}return{status:"ok",blocks:[{text:"Are you free for drinks this weekend?",x:48,y:420,width:320,screenWidth:1080}]}}function De(){const e=A();if(e&&typeof e.requestScreenScan=="function")try{const t=e.requestScreenScan();return JSON.parse(t)}catch{return{status:"error",blocks:[]}}return{status:"ok",appPackage:"com.snapchat.android",blocks:[{text:"What is your biggest red flag?",x:52,y:460,width:300,screenWidth:1080}]}}function Me(){const e=A();if(e&&typeof e.getActiveContext=="function")try{return JSON.parse(e.getActiveContext())}catch{return{status:"none"}}return{status:"none"}}function Le(e){const t=A();t&&typeof t.openSystemSetting=="function"?t.openSystemSetting(e):console.log("[Dev Mock Open Setting]:",e)}function Fe(){const e=A();e&&typeof e.startVoiceTyping=="function"?e.startVoiceTyping():console.log("[Dev Mock Voice Typing]")}function Ie(){const e=A();e&&typeof e.showInputMethodPicker=="function"?e.showInputMethodPicker():console.log("[Dev Mock IME Picker]")}function je(e,t){return`You are an elite wingman who excels at playful, concise, charismatic banter.
Your task: Suggest 3 distinct next moves for a dating app conversation.
Strict rules:
1. MAX 12 words per line.
2. NO cheesy cliché compliments like "Hey cutie" or "You must be tired from running through my mind".
3. Use witty banter, slight teasing, or confident playful framing.
4. Output MUST be valid JSON array with keys: "vibe" (Smooth | Tease | Bold) and "line" (string).

Partner said: "${e}"
${t?`Context I said previously: "${t}"`:""}

Respond ONLY with the JSON array:`}function Ke(e){return`You are a charisma coach. Rewrite this bland text message into 3 sharper, confident, flirty versions.
Max 12 words each.
Bland text: "${e}"

Output ONLY a JSON array with objects: [{"vibe": "Smooth", "line": "..."}, {"vibe": "Tease", "line": "..."}, {"vibe": "Bold", "line": "..."}]`}const ne={"com.snapchat.android":"Snapchat","org.telegram.messenger":"Telegram","org.thoughtcrime.securesms":"Signal","co.hinge.app":"Hinge","com.bumble.app":"Bumble","com.tinder":"Tinder","com.instagram.android":"Instagram","com.whatsapp":"WhatsApp","web.whatsapp.com":"WhatsApp Web","instagram.com":"Instagram DM","web.telegram.org":"Telegram Web","tinder.com":"Tinder Web","bumble.com":"Bumble Web","discord.com":"Discord","x.com":"X DM"};function fe(e){if(!e)return;const t=e.replace(/^www\./i,"");if(ne[t])return ne[t];const r=t.split("."),n=r[r.length-1];if(!n||["android","app","messenger","com","org","io"].includes(n)){const o=r[r.length-2];return o?o.charAt(0).toUpperCase()+o.slice(1):void 0}return n.charAt(0).toUpperCase()+n.slice(1)}function ze(e){const t=fe(e.appPackage);switch(e.source){case"screenshot":return"📸 Screenshot";case"notification":return t?`🔔 ${t} Msg`:"🔔 Incoming Msg";case"clipboard":return"📋 Copied Bubble";case"accessibility":return t?`👁️ ${t} Scan`:"👁️ Screen Scan";case"selection":return"✨ Selected Text";case"dom":return t?`🌐 ${t} Chat`:"🌐 Web Chat";case"manual":return"💬 Stealth Context"}}function We(e){const t=e.partnerText.length>26?`${e.partnerText.slice(0,26).trim()}…`:e.partnerText;switch(e.source){case"screenshot":return"📸 Screenshot Detected: Analyze Next Move";case"notification":{const r=fe(e.appPackage);return r?`🔔 ${r}: "${t}" — Reply`:`🔔 New Msg: "${t}" — Reply`}case"clipboard":return`📋 Copied: "${t}" — Reply`;case"accessibility":case"dom":return`👁️ Scanned: "${t}" — Reply`;case"selection":return`✨ Selected: "${t}" — Reply`;case"manual":return"💬 Context Ready — View Replies"}}class qe{constructor(){this.recentSelfCommits=new Set}recordSelfCommit(t){const r=this.normalize(t);if(r&&(this.recentSelfCommits.add(r),this.recentSelfCommits.size>25)){const n=this.recentSelfCommits.values().next().value;n&&this.recentSelfCommits.delete(n)}}isIgnored(t,r){const n=t.trim();if(!n)return!0;if(r==="manual"||r==="selection")return!1;const o=this.normalize(n);return!!(this.recentSelfCommits.has(o)||/^https?:\/\/\S+$/i.test(n)||/^\d{4,8}$/.test(n))}normalize(t){return t.toLowerCase().replace(/\s+/g," ").trim()}}function Ze(e){const t={rawBlocks:e.map(n=>n.text)};if(e.length===0)return t;const r=e.filter(n=>{const o=n.y<120,a=n.y>n.screenWidth*1.8;return!o&&!a});r.sort((n,o)=>n.y-o.y);for(let n=r.length-1;n>=0;n--){const o=r[n],a=o.x+o.width/2>o.screenWidth/2;if(!a&&!t.senderText?t.senderText=o.text:a&&!t.myLastText&&(t.myLastText=o.text),t.senderText&&t.myLastText)break}return t}const Ve=[{id:"op-1",category:"opener",vibe:"playful",triggerKeywords:["travel","hiking","nature"],template:"Are you as adventurous as your profile says, or do you also get lost in grocery stores?"},{id:"op-2",category:"opener",vibe:"smooth",triggerKeywords:["smile","eyes","cute"],template:"I was going to wait two days to message you, but patience was never my strong suit."},{id:"op-3",category:"opener",vibe:"witty",triggerKeywords:["food","coffee","cooking"],template:"Important question: what is your most controversial culinary opinion?"},{id:"bt-1",category:"banter",vibe:"playful",triggerKeywords:["trouble","sarcasm","bad"],template:"Are you always this much trouble or did I catch you on a good day?"},{id:"bt-2",category:"banter",vibe:"witty",triggerKeywords:["challenge","bet","win"],template:"Careful, high expectations are my only weakness."},{id:"bt-3",category:"banter",vibe:"bold",triggerKeywords:["rules","late","fast"],template:"I would say you are five minutes away from being my favorite person."},{id:"wp-1",category:"wordplay",vibe:"witty",triggerKeywords:["smart","books","study","work"],template:"Are you an overdue library book? Because you have fine written all over you."},{id:"wp-2",category:"wordplay",vibe:"smooth",triggerKeywords:["music","song","playlist"],template:"If our conversation was a playlist, I would have it on repeat."},{id:"cl-1",category:"closer",vibe:"bold",triggerKeywords:["drinks","date","weekend","meet","free","tonight"],template:"Drinks this Thursday. You pick the spot, I will bring the conversation."},{id:"cl-2",category:"closer",vibe:"smooth",triggerKeywords:["coffee","tea","afternoon","sunday","morning"],template:"Let us see if you are as fun in person. Coffee tomorrow?"},{id:"rf-1",category:"banter",vibe:"playful",triggerKeywords:["red flag","toxic","flaw","worst"],template:"My biggest red flag is thinking I can win every staring contest."},{id:"sn-1",category:"banter",vibe:"bold",triggerKeywords:["snap","streak","vanish","secret","disappear"],template:"Disappearing messages just mean we have to make every line count."},{id:"wy-1",category:"banter",vibe:"witty",triggerKeywords:["wyd","doing","bored","up to","plans"],template:"Plotting my next move, and you just walked right into it."},{id:"pt-1",category:"opener",vibe:"playful",triggerKeywords:["dog","puppy","cat","pet","gym","workout"],template:"Be honest: am I competing with your pet for attention, or do I stand a chance?"}];function He(e,t=3){const r=e.toLowerCase();if(!r.trim())return[];const n=Ve.map(o=>{let a=0;for(const s of o.triggerKeywords)r.includes(s)&&(a+=2);return{entry:o,score:a}}).filter(o=>o.score>0);return n.sort((o,a)=>a.score-o.score),n.slice(0,t).map(o=>o.entry)}class Ue{generateOfflineSuggestions(t,r){const n=t.trim(),o=n.toLowerCase(),a=He(n,3),s={};for(const i of a)i.vibe==="smooth"&&!s.Smooth?s.Smooth=i.template:(i.vibe==="playful"||i.vibe==="witty")&&!s.Tease?s.Tease=i.template:i.vibe==="bold"&&!s.Bold&&(s.Bold=i.template);for(const i of a)!s.Smooth&&i.template!==s.Tease&&i.template!==s.Bold?s.Smooth=i.template:!s.Tease&&i.template!==s.Smooth&&i.template!==s.Bold?s.Tease=i.template:!s.Bold&&i.template!==s.Smooth&&i.template!==s.Tease&&(s.Bold=i.template);const f=n.includes("?")||/^(what|why|how|where|when|who|are|do|did|would)\b/i.test(n),y=n.length>0&&n.split(/\s+/).length<=2&&!f,p=f?"Careful, the honest answer might make you like me more.":y?"You are a person of few words—good thing I speak fluent mystery.":o.includes("haha")||o.includes("lol")?"Making you laugh this early is dangerous for both of us.":"I was going to play it cool, but you made that impossible.",d=f?"I plead the fifth—unless you are buying the first round.":y?"Do not hurt your thumbs typing a whole novel over there.":"Are you always this much trouble or is today special?",c=f?"Better story in person. Are you free Thursday night?":"Skip the small talk: what is your go-to spot for drinks?";return[{vibe:"Smooth",line:s.Smooth??p},{vibe:"Tease",line:s.Tease??d},{vibe:"Bold",line:s.Bold??c}]}getPromptForChat(t,r){return je(t,r)}getPromptForRewrite(t){return Ke(t)}}class Ge{constructor(){this.engine=new Ue,this.filter=new qe,this.lastProcessedSignature=""}recordCommittedReply(t){this.filter.recordSelfCommit(t)}isIgnoredNoiseOrSelf(t,r){return this.filter.isIgnored(t,r)}ingestRawContext(t){var a,s;const r=t.text.replace(/\s+/g," ").trim();if(this.filter.isIgnored(r,t.source))return null;const n=`${t.source}:${t.appPackage??""}:${this.filter.normalize(r)}`;if(t.source!=="manual"&&t.source!=="selection"&&n===this.lastProcessedSignature)return null;this.lastProcessedSignature=n;const o=t.timestamp??Date.now();return{id:`${t.source}-${o}`,source:t.source,partnerText:r,myLastText:((a=t.myLastText)==null?void 0:a.trim())||void 0,senderName:((s=t.senderName)==null?void 0:s.trim())||void 0,appPackage:t.appPackage,uri:t.uri,timestamp:o}}ingestScreenBlocks(t,r,n){var s;if(!t||t.length===0)return null;const o=Ze(t),a=o.senderText??o.rawBlocks.find(f=>!this.filter.isIgnored(f,r));return a?{id:`${r}-${(n==null?void 0:n.timestamp)??Date.now()}`,source:r,partnerText:a.trim(),myLastText:(s=o.myLastText)==null?void 0:s.trim(),appPackage:n==null?void 0:n.appPackage,uri:n==null?void 0:n.uri,timestamp:(n==null?void 0:n.timestamp)??Date.now()}:null}resolveSuggestions(t){const r=this.engine.generateOfflineSuggestions(t.partnerText,t.myLastText);return{context:t,suggestions:r}}}class Je{constructor(){this.root={children:new Map,isWord:!1,frequency:0},this.bigrams=new Map,this.seedCommonVocabulary()}insert(t,r=1){let n=this.root;const o=t.toLowerCase();for(const a of o)n.children.has(a)||n.children.set(a,{children:new Map,isWord:!1,frequency:0}),n=n.children.get(a);n.isWord=!0,n.frequency+=r}addBigram(t,r){const n=t.toLowerCase(),o=r.toLowerCase();let a=this.bigrams.get(n);a||(a=[],this.bigrams.set(n,a));const s=a.find(f=>f.word===o);s?s.count++:a.push({word:o,count:1}),a.sort((f,y)=>y.count-f.count)}completePrefix(t,r=3){if(!t)return[];let n=this.root;const o=t.toLowerCase();for(const s of o){if(!n.children.has(s))return[];n=n.children.get(s)}const a=[];return this.collectWords(n,o,a),a.sort((s,f)=>f.frequency-s.frequency),a.slice(0,r).map(s=>s.word)}predictNextWord(t,r=3){if(!t)return["the","you","i"];const n=t.toLowerCase(),o=this.bigrams.get(n);return o&&o.length>0?o.slice(0,r).map(a=>a.word):["and","to","you"]}collectWords(t,r,n){t.isWord&&n.push({word:r,frequency:t.frequency});for(const[o,a]of t.children.entries())this.collectWords(a,r+o,n)}seedCommonVocabulary(){const t=[["are",100],["you",120],["free",80],["tonight",75],["tomorrow",70],["weekend",85],["coffee",65],["drinks",65],["dinner",60],["what",110],["when",95],["where",90],["why",85],["how",105],["about",80],["going",85],["good",90],["great",85],["plans",70],["sounds",80],["like",100],["love",95],["see",85],["talking",60]];for(const[n,o]of t)this.insert(n,o);const r=[["how","are"],["are","you"],["you","free"],["free","tonight"],["free","this"],["this","weekend"],["what","are"],["sounds","like"],["let","us"],["see","you"],["good","to"],["grab","coffee"]];for(const[n,o]of r)this.addBigram(n,o)}}function Ye(e){const t=e.trim(),r=t.toLowerCase();return t?/^(hey|hi|hello|sup|yo|wyd|what'?s up)$/i.test(t)?{score:2,verdict:"Dry",feedback:"Low effort opener. High ghosting probability (~90%).",improved:"Important question: what is your most controversial food opinion?"}:r.includes("how are you")||r.includes("how was your day")?{score:4,verdict:"Safe",feedback:"Polite but sounds like an HR interview.",improved:"Tell me your day was more exciting than grocery shopping."}:r.includes("cutie")||r.includes("beautiful")||r.includes("gorgeous")?{score:5,verdict:"Safe",feedback:"Compliment is sweet, but every other match says the exact same thing.",improved:"I was going to play it cool, but you made that impossible."}:r.includes("trouble")||r.includes("bet")||r.includes("drinks")||r.includes("coffee")?{score:9,verdict:"Smooth",feedback:"High energy, playful intrigue. Ready to send.",improved:t}:{score:7,verdict:"Smooth",feedback:"Solid message. Could use 10% more cheekiness.",improved:`${t} — unless you scare easily.`}:{score:1,verdict:"Dry",feedback:"Empty canvas. Drop something bold.",improved:"Are we breaking records or rules tonight?"}}const V=[{name:"Smileys & Rizz",icon:"😏",emojis:["😏","😉","😎","😜","😝","😛","🥳","🤩","😍","🥰","😘","😗","😙","😚","🤗","🤭","🤫","🫠","🫡","🤔","🤨","😐","😑","😶","🙄","😬","😌","😔","😪","😴","😂","🤣","😭","😅","😆","😁","😄","😃","😀","🙂","😈","👿","🫦","💅","👀","✨","🔥","💀","🤡","🥺"]},{name:"Love & Hearts",icon:"❤️",emojis:["❤️","❤️‍🔥","❤️‍🩹","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💖","💗","💓","💞","💕","💘","💝","💟","❣️","💔","💋","💌","💍","💎","🌹","🥀","💐","🌷","🌸","🥂","🍾","🍫","🍓","🍒","🫶","🫰","💑","👩‍❤️‍👨","💏"]},{name:"Gestures & Reactions",icon:"✌️",emojis:["👍","👎","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","☝️","✋","🤚","🖐️","🖖","👋","🤝","🙏","👏","🙌","👐","🤲","✊","👊","🤛","🤜","💪","🦾","🫶","🤦‍♂️","🤦‍♀️","🤷‍♂️","🤷‍♀️","💯","🎯"]},{name:"People & Vibes",icon:"🕺",emojis:["🕺","💃","👯","🧘","🏄","🚴","🏋️","🤸","🥷","🕵️","👑","🎩","🕶️","👓","🧣","👗","👔","👟","👠","👜","🧠","🫀","👁️","👅","👄","👂","👃","🫂","🗣️","👤"]},{name:"Food & Dates",icon:"☕",emojis:["☕","🍵","🧋","🥤","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🍾","🍕","🍔","🍟","🌭","🌮","🌯","🍣","🍜","🍝","🍛","🍱","🥟","🍤","🍦","🍨","🍩","🍪","🎂","🍰","🧁","🍫","🍿","🥐","🥯","🥞","🧇","🥓","🍳"]},{name:"Activities & Travel",icon:"✈️",emojis:["✈️","🚗","🏎️","🚕","🚌","🚆","🚀","🛸","⛵","🏖️","🏝️","🏔️","🏕️","🌅","🌄","🌃","🌆","🎡","🎢","🎬","🎤","🎧","🎼","🎹","🎸","🥁","🎮","🕹️","🎲","♟️","🎳","🎯","⚽","🏀","🏈","⚾","🎾","🏐","🏆","🥇"]},{name:"Symbols & Tech",icon:"⚡",emojis:["⚡","⭐","🌟","💫","✨","💥","💢","💦","💨","💤","💬","💭","🗯️","🔔","🔕","🔒","🔓","🔑","📱","💻","⌨️","📷","📸","🎥","📺","📻","⏰","⏳","💡","🔋","✅","❌","❓","❗","‼️","⁉️","⚠️","🚫","♻️","♾️"]}];function h(e){const{fragment:t}=J(e);if(t.childElementCount===1&&t.firstElementChild)return t.firstElementChild;const r=document.createElement("div");return r.style.display="contents",r.appendChild(t),r}function _(e,t){const r=document.createElement("div");r.className=e;for(const n of t){const{fragment:o}=J(n);r.appendChild(o)}return r}function Xe(e){return h(u`
    <div class="action-bar">
      ${()=>e.activeContext.value?h(u`
            <button class="action-pill highlight" @click=${e.onOpenContextReplies}>
              ${We(e.activeContext.value)}
            </button>
          `):""}
      <button class="action-pill" @click=${e.onVoiceInput} title="Google Voice Typing">
        🎙️ Mic
      </button>
      <button class="action-pill" @click=${e.onScanScreen}>
        👁️ Scan
      </button>
      <button
        class=${()=>e.stealthMode.value?"action-pill active-mode":"action-pill"}
        @click=${e.onToggleStealth}>
        💬 Tell Rizz
      </button>
      <button class="action-pill" @click=${e.onToggleRoast}>
        🔥 Roast
      </button>
      <button class="action-pill" @click=${e.onToggleClipboard}>
        📋 Clipboard
      </button>
      <button class="action-pill" @click=${e.onToggleEmojis}>
        😏 Emojis
      </button>
      <button class="action-pill" @click=${e.onSwitchKeyboard} title="Switch Keyboard">
        🌐
      </button>
    </div>
  `)}function Qe(e){return h(u`
    <div class="stealth-bar">
      <div class="stealth-top">
        <span class="stealth-badge">🛡️ STEALTH MODE · Hidden from chat</span>
        <div class="stealth-actions">
          ${()=>e.showEnableScanner.value?h(u`
                <button class="stealth-link" @click=${e.onEnableScanner}>
                  Enable Scanner ⚙
                </button>
              `):""}
          <button class="back-link" @click=${e.onCancel}>Cancel ✕</button>
        </div>
      </div>
      <div class="stealth-input-row">
        <div class="stealth-preview">
          ${()=>e.buffer.value?e.buffer.value:e.hint.value??'Type what they said or asked (e.g. "asked my red flag")…'}
        </div>
        <button class="stealth-go-btn" @click=${e.onGenerate}>
          ⚡ Replies
        </button>
      </div>
    </div>
  `)}function et(e){return h(u`
    <div class="suggestions-shell">
      ${()=>_("suggestions-panel",e.suggestions.value.map(t=>u`
          <div class="suggestion-card" @click=${()=>e.onSelectSuggestion(t)}>
            <span class="suggestion-text">${t}</span>
          </div>
        `))}
    </div>
  `)}function tt(e){const t=S("off"),r=S("alpha"),n=["q","w","e","r","t","y","u","i","o","p"],o=["a","s","d","f","g","h","j","k","l"],a=["z","x","c","v","b","n","m"],s=["1","2","3","4","5","6","7","8","9","0"],f=["@","#","$","_","&","-","+","(",")","/"],y=["*",'"',"'",":",";","!","?"],p=["~","`","|","•","√","π","÷","×","§","Δ"],d=["£","€","¥","^","°","=","{","}","\\","©"],c=["%","®","™","✓","[","]","<",">"],i=b=>{const L=t.value!=="off"?b.toUpperCase():b;e.onKeyPress(L),t.value==="once"&&(t.value="off")},l=()=>{t.value==="off"?t.value="once":t.value==="once"?t.value="caps":t.value="off"},g=()=>{const b=t.value!=="off",z=t.value==="caps"?"⇪":t.value==="once"?"⬆":"⇧",L=t.value==="off"?"key-btn special":"key-btn special active-shift",R=document.createElement("div");R.className="keyboard-row",R.appendChild(h(u`<button class=${L} @click=${l}>${z}</button>`));for(const v of a){const x=b?v.toUpperCase():v;R.appendChild(h(u`<button class="key-btn" @click=${()=>i(v)}>${x}</button>`))}return R.appendChild(h(u`<button class="key-btn special" @click=${e.onBackspace}>⌫</button>`)),h(u`
      <div class="keyboard-grid">
        ${_("keyboard-row",n.map(v=>{const x=b?v.toUpperCase():v;return u`<button class="key-btn" @click=${()=>i(v)}>${x}</button>`}))}
        ${_("keyboard-row",o.map(v=>{const x=b?v.toUpperCase():v;return u`<button class="key-btn" @click=${()=>i(v)}>${x}</button>`}))}
        ${R}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>r.value="numbers"}>123</button>
          <button class="key-btn special" @click=${e.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${()=>e.onKeyPress(",")}>,</button>
          <button class="key-btn space" @click=${()=>e.onKeyPress(" ")}>
            ${()=>e.stealthMode.value?"stealth space":"space"}
          </button>
          <button class="key-btn special" @click=${()=>e.onKeyPress(".")}>.</button>
          <button class="key-btn send" @click=${e.onSend}>
            ${()=>e.stealthMode.value?"Ask ⚡":"Send"}
          </button>
        </div>
      </div>
    `)},M=b=>{const z=b?p:s,L=b?d:f,R=b?c:y,v=document.createElement("div");v.className="keyboard-row",v.appendChild(h(u`
        <button
          class="key-btn special"
          @click=${()=>r.value=b?"numbers":"symbols"}>
          ${b?"123":"=\\<"}
        </button>
      `));for(const x of R)v.appendChild(h(u`<button class="key-btn" @click=${()=>e.onKeyPress(x)}>${x}</button>`));return v.appendChild(h(u`<button class="key-btn special" @click=${e.onBackspace}>⌫</button>`)),h(u`
      <div class="keyboard-grid">
        ${_("keyboard-row",z.map(x=>u`<button class="key-btn" @click=${()=>e.onKeyPress(x)}>${x}</button>`))}
        ${_("keyboard-row",L.map(x=>u`<button class="key-btn" @click=${()=>e.onKeyPress(x)}>${x}</button>`))}
        ${v}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>r.value="alpha"}>ABC</button>
          <button class="key-btn special" @click=${e.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${()=>e.onKeyPress(",")}>,</button>
          <button class="key-btn space" @click=${()=>e.onKeyPress(" ")}>
            ${()=>e.stealthMode.value?"stealth space":"space"}
          </button>
          <button class="key-btn special" @click=${()=>e.onKeyPress(".")}>.</button>
          <button class="key-btn send" @click=${e.onSend}>
            ${()=>e.stealthMode.value?"Ask ⚡":"Send"}
          </button>
        </div>
      </div>
    `)};return h(u`
    <div class="keyboard-grid-wrapper">
      ${()=>r.value==="numbers"?M(!1):r.value==="symbols"?M(!0):g()}
    </div>
  `)}function rt(e){const t=S(0),r=document.createElement("div");return r.className="emoji-tabs",V.forEach((n,o)=>{r.appendChild(h(u`
        <button
          class=${()=>o===t.value?"emoji-tab active":"emoji-tab"}
          @click=${()=>t.value=o}>
          ${n.icon}
        </button>
      `))}),r.appendChild(h(u`<button class="emoji-tab back-key" @click=${e.onClose}>ABC</button>`)),h(u`
    <div class="emoji-view">
      ${r}
      ${()=>{const n=V[t.value]??V[0];return _("emoji-grid",n.emojis.map(o=>u`
            <button class="emoji-btn" @click=${()=>e.onSelectEmoji(o)}>${o}</button>
          `))}}
    </div>
  `)}function nt(e){return h(u`
    <div class="clipboard-view">
      <div class="clipboard-header">
        <span>Copied Bubbles — Tap to Paste or ⚡ Reply</span>
        <button class="back-link" @click=${e.onClose}>Close ✕</button>
      </div>
      ${()=>_("clipboard-list",e.history.value.map(t=>u`
          <div class="clipboard-item-row">
            <div class="clipboard-item" @click=${()=>e.onSelectClip(t)}>
              ${t}
            </div>
            <button class="clip-analyze-btn" @click=${()=>e.onAnalyzeClip(t)}>
              ⚡ Reply
            </button>
          </div>
        `))}
    </div>
  `)}function ot(e){return h(u`
    <div class="roast-view">
      <div class="roast-badge">
        <span>Score: ${()=>e.roast.value?`${e.roast.value.score}/10 — ${e.roast.value.verdict}`:"Analyzing..."}</span>
        <button class="back-link" @click=${e.onClose}>Back to typing ✕</button>
      </div>
      <p class="roast-feedback">"${()=>e.roast.value?e.roast.value.feedback:""}"</p>
      <div class="roast-upgrade" @click=${()=>{e.roast.value&&e.onApplyUpgrade(e.roast.value.improved)}}>
        <span class="upgrade-tag">1-Tap Upgrade:</span>
        <span class="upgrade-line">${()=>e.roast.value?e.roast.value.improved:""}</span>
      </div>
    </div>
  `)}function at(e){return h(u`
    <div class="nextmove-view">
      <div class="nextmove-header">
        <div class="nextmove-meta">
          <span class="source-chip">
            ${()=>e.resolution.value?ze(e.resolution.value.context):"⚡ Next Move"}
          </span>
          <span class="partner-quote">
            "${()=>{var r;const t=((r=e.resolution.value)==null?void 0:r.context.partnerText)??"";return t.length>44?`${t.slice(0,44).trim()}…`:t}}"
          </span>
        </div>
        <div class="nextmove-actions">
          <button class="back-link" @click=${e.onSwitchToStealth}>Edit</button>
          <button class="back-link" @click=${e.onClose}>Close ✕</button>
        </div>
      </div>

      ${()=>{const t=e.resolution.value;return!t||t.suggestions.length===0?h(u`
            <div class="roast-feedback">Tap "Tell Rizz" or "Scan Screen" to load chat context.</div>
          `):_("nextmove-cards",t.suggestions.map(r=>u`
            <div class="vibe-card" @click=${()=>e.onSelectReply(r.line)}>
              <span class="vibe-tag vibe-${r.vibe.toLowerCase()}">${r.vibe}</span>
              <span class="vibe-line">${r.line}</span>
            </div>
          `))}}
    </div>
  `)}const oe=new Je,$=new Ge,m=S("qwerty"),P=S(""),D=S(void 0),T=S(null),B=S(null),w=S(!1),N=S(""),I=S(null),O=S(!1),me=S(null),G=S(["What is your biggest red flag?","Are we still on for coffee this weekend?"]),st=ue(()=>{const e=w.value?N.value:P.value;if(!e)return w.value?["asked","red","weekend"]:["how","are","you"];const t=e.trim().split(/\s+/),r=t[t.length-1];if(e.endsWith(" "))return oe.predictNextWord(r,3);{const n=oe.completePrefix(r,3);return n.length>0?n:[r]}});Z.registerNativeCallback("appContextChanged",e=>{e!=null&&e.packageName&&(D.value=e.packageName)});Z.registerNativeCallback("screenshotDetected",e=>{e!=null&&e.uri&&(T.value={id:`screenshot-${e.timestamp??Date.now()}`,source:"screenshot",partnerText:"Screenshot captured",uri:e.uri,appPackage:e.appPackage??D.value,timestamp:Date.now()},C("heavy"))});Z.registerNativeCallback("contextDetected",e=>{if(!(e!=null&&e.text)||!(e!=null&&e.source))return;const t=$.ingestRawContext({source:e.source,text:e.text,senderName:e.senderName,appPackage:e.appPackage??D.value,timestamp:e.timestamp});t&&(T.value=t,C("click"))});Z.registerNativeCallback("clipboardAdded",e=>{if(e!=null&&e.text){const t=String(e.text).trim();if(!t)return;G.value=[t,...G.value.filter(n=>n!==t).slice(0,9)];const r=$.ingestRawContext({source:"clipboard",text:t,appPackage:D.value});r&&(T.value=r)}});const E=Me();if(E.status==="ok"&&E.text&&E.source){const e=$.ingestRawContext({source:E.source,text:E.text,senderName:E.senderName,appPackage:E.appPackage,timestamp:E.timestamp});e&&(T.value=e)}function it(e){if(C("heavy"),e.source==="screenshot"&&e.uri){const t=Oe(e.uri),r=$.ingestScreenBlocks(t.blocks,"screenshot",{appPackage:t.appPackage??e.appPackage,uri:e.uri});if(!r){T.value=null,j("Screenshot looked blank/protected — type what they said:");return}B.value=$.resolveSuggestions(r),T.value=null,w.value=!1,m.value="nextmove";return}B.value=$.resolveSuggestions(e),T.value=null,w.value=!1,m.value="nextmove"}function ct(){C("click");const e=De();if(e.status==="ok"&&e.blocks.length>0){const t=$.ingestScreenBlocks(e.blocks,"accessibility",{appPackage:e.appPackage??D.value});if(t){B.value=$.resolveSuggestions(t),w.value=!1,m.value="nextmove";return}}if(e.status==="not_enabled"){O.value=!0,j("Scanner off — type what they said, or tap Enable Scanner ⚙");return}O.value=!1,j("Screen protected (FLAG_SECURE) — type a quick summary here:")}function j(e){I.value=e??null,w.value=!0,m.value="qwerty"}function lt(){C("click"),w.value?(w.value=!1,I.value=null,O.value=!1):(O.value=!1,j())}function ae(){C("heavy");const e=N.value.trim(),t=$.ingestRawContext({source:"manual",text:e||"start playful conversation",appPackage:D.value});t&&(B.value=$.resolveSuggestions(t),w.value=!1,I.value=null,O.value=!1,m.value="nextmove")}function ut(e){C("heavy"),$.recordCommittedReply(e),K(e),P.value=e,N.value="",m.value="qwerty"}function dt(e){const t=$.ingestRawContext({source:"manual",text:e,appPackage:D.value});t&&(t.source="clipboard",B.value=$.resolveSuggestions(t),m.value="nextmove")}function se(e){if(C("light"),w.value){N.value+=e;return}P.value+=e,K(e)}function ft(){if(C("light"),w.value){N.value.length>0&&(N.value=N.value.slice(0,-1));return}P.value.length>0&&(P.value=P.value.slice(0,-1)),Y()}function mt(e){if(C("click"),w.value){const n=N.value,o=n.trim().split(/\s+/),a=n.endsWith(" ")?n:o.length>1?o.slice(0,-1).join(" ")+" ":"";N.value=`${a}${e} `;return}const t=P.value,r=t.trim().split(/\s+/);if(!t.endsWith(" ")&&r.length>0){const n=r[r.length-1];for(let o=0;o<n.length;o++)Y()}K(e+" "),P.value=(t.endsWith(" ")?t:r.length>1?r.slice(0,-1).join(" ")+" ":"")+e+" "}function pt(){C("heavy"),me.value=Ye(P.value),m.value="roast"}function ht(e){C("click");for(let t=0;t<P.value.length;t++)Y();$.recordCommittedReply(e),K(e),P.value=e,m.value="qwerty"}function yt(){return u`
    <div class="rizz-app">
      ${Xe({activeContext:T,stealthMode:w,onOpenContextReplies:()=>{T.value&&it(T.value)},onScanScreen:ct,onToggleStealth:lt,onToggleRoast:()=>{m.value==="roast"?m.value="qwerty":pt()},onToggleClipboard:()=>m.value=m.value==="clipboard"?"qwerty":"clipboard",onToggleEmojis:()=>m.value=m.value==="emojis"?"qwerty":"emojis",onVoiceInput:()=>{C("click"),Fe()},onSwitchKeyboard:()=>{C("click"),Ie()}})}

      ${()=>w.value?Qe({buffer:N,hint:I,showEnableScanner:O,onGenerate:ae,onEnableScanner:()=>Le("accessibility"),onCancel:()=>{w.value=!1,I.value=null,O.value=!1}}):""}

      ${et({suggestions:st,onSelectSuggestion:mt})}

      ${()=>{const e=m.value;return e==="nextmove"?at({resolution:B,onSelectReply:ut,onSwitchToStealth:()=>{var t;N.value=((t=B.value)==null?void 0:t.context.partnerText)??"",j()},onClose:()=>m.value="qwerty"}):e==="emojis"?rt({onSelectEmoji:se,onClose:()=>m.value="qwerty"}):e==="clipboard"?nt({history:G,onSelectClip:t=>{$.recordCommittedReply(t),K(t),m.value="qwerty"},onAnalyzeClip:t=>{C("heavy"),dt(t)},onClose:()=>m.value="qwerty"}):e==="roast"?ot({roast:me,onApplyUpgrade:ht,onClose:()=>m.value="qwerty"}):tt({stealthMode:w,onKeyPress:se,onBackspace:ft,onSend:()=>{w.value?ae():(C("heavy"),Be())},onOpenEmojis:()=>m.value="emojis"})}}
    </div>
  `}const ie=document.getElementById("app");if(ie){const{fragment:e}=J(yt());ie.appendChild(e)}
