var Ie=Object.defineProperty;var je=(e,t,n)=>t in e?Ie(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var A=(e,t,n)=>je(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();let ie=null;const te=new Set;let U=!1;function Ne(){return ie}function ne(e){const t=ie;return ie=e,t}function Ae(e){e.isStale=!0,U?te.add(e):e.execute()}function We(e){const t=U;U=!0;try{return e()}finally{U=t,U||Fe()}}function Fe(){for(;te.size>0;){const e=Array.from(te);te.clear();for(const t of e)t.isStale&&t.execute()}}class qe{constructor(t){A(this,"_value");A(this,"_subscribers",new Set);this._value=t}get value(){const t=Ne();return t&&(this._subscribers.add(t),t.dependencies.add(this)),this._value}set value(t){Object.is(this._value,t)||(this._value=t,this.notify())}peek(){return this._value}notify(){const t=Array.from(this._subscribers);for(const n of t)Ae(n)}_unsubscribe(t){this._subscribers.delete(t)}}function C(e){return new qe(e)}class He{constructor(t){A(this,"_value");A(this,"_node");A(this,"_subscribers",new Set);A(this,"_isDirty",!0);A(this,"_fn");this._fn=t,this._node={dependencies:new Set,isStale:!0,execute:()=>{if(!this._isDirty){this._isDirty=!0;const n=Array.from(this._subscribers);for(const o of n)Ae(o)}}}}get value(){this._isDirty&&this._recompute();const t=Ne();return t&&(this._subscribers.add(t),t.dependencies.add(this)),this._value}peek(){return this._isDirty&&this._recompute(),this._value}_unsubscribe(t){this._subscribers.delete(t)}_recompute(){for(const n of this._node.dependencies)n._unsubscribe(this._node);this._node.dependencies.clear();const t=ne(this._node);try{this._value=this._fn(),this._isDirty=!1,this._node.isStale=!1}finally{ne(t)}}}function Me(e){return new He(e)}let Ke=null;function Ve(){return Ke}function se(e){let t;const n={dependencies:new Set,isStale:!1,execute:()=>{for(const i of n.dependencies)i._unsubscribe(n);if(n.dependencies.clear(),typeof t=="function")try{t()}catch(i){console.error("[Nova Signal Effect Cleanup Error]:",i)}const a=ne(n);try{t=e()}finally{ne(a),n.isStale=!1}}};n.execute();const o=()=>{for(const a of n.dependencies)a._unsubscribe(n);n.dependencies.clear(),typeof t=="function"&&t()},r=Ve();return r&&r.addCleanup(o),o}function Ee(){return typeof window<"u"&&"Part"in window&&"ChildNodePart"in window&&typeof window.getParts=="function"}class me{constructor(t){A(this,"parentNode");A(this,"previousSibling");A(this,"nextSibling");A(this,"value");A(this,"_currentNode");const n=t.parentNode;if(!n)throw new Error("[Zuari DOM Parts]: Placeholder node must have a parent container.");this.parentNode=n,this.previousSibling=t.previousSibling,this.nextSibling=t.nextSibling;const o=document.createTextNode("");n.replaceChild(o,t),this._currentNode=o}setValue(t){if(this.value=t,t instanceof DocumentFragment){const n=document.createTextNode("");this.parentNode.replaceChild(n,this._currentNode),this.parentNode.insertBefore(t,n),this._currentNode=n;return}if(t instanceof Node){this._currentNode!==t&&(this.parentNode.replaceChild(t,this._currentNode),this._currentNode=t);return}if(this._currentNode instanceof Text)this._currentNode.data=String(t??"");else{const n=document.createTextNode(String(t??""));this.parentNode.replaceChild(n,this._currentNode),this._currentNode=n}}disconnect(){}}class pe{constructor(t,n){A(this,"element");A(this,"attributeName");A(this,"value");this.element=t,this.attributeName=n}setValue(t){this.value=t,t===!1||t===null||t===void 0?this.element.removeAttribute(this.attributeName):this.element.setAttribute(this.attributeName,String(t))}disconnect(){this.element.removeAttribute(this.attributeName)}}function Ze(e){if(Ee())try{const t=window.ChildNodePart;return new t(e)}catch{return new me(e)}return new me(e)}function Ue(e,t){if(Ee())try{const n=window.AttributePart;return new n(e,t)}catch{return new pe(e,t)}return new pe(e,t)}function Ge(e,t,n,o){const r=Je(e,`<!--zuari-hole-${t}-->`);if(r){const y=Ze(r);if(ye(n)){const c=se(()=>y.setValue(ge(n)));o.push(()=>{var h;c(),(h=y.disconnect)==null||h.call(y)})}else y.setValue(n);return}const a=`data-zuari-attr-${t}`,i=Xe(e,a);if(!i)return;const{element:l,attrName:u}=i;if(u.startsWith("@")||u.startsWith("on")){const y=(u.startsWith("@")?u.slice(1):u.slice(2)).toLowerCase();if(l.removeAttribute(u),typeof n!="function")return;const c=n;l.addEventListener(y,c),o.push(()=>l.removeEventListener(y,c));return}const m=Ue(l,u);if(ye(n)){const y=se(()=>m.setValue(ge(n)));o.push(()=>{var c;y(),(c=m.disconnect)==null||c.call(m)})}else m.setValue(n)}function ye(e){return typeof e=="object"&&e!==null&&"value"in e||typeof e=="function"}function ge(e){return typeof e=="object"&&e!==null&&"value"in e?e.value:typeof e=="function"?e():e}function Je(e,t){const n=document.createNodeIterator(e,NodeFilter.SHOW_COMMENT);let o=n.nextNode();for(;o;){if(`<!--${o.data}-->`===t)return o;o=n.nextNode()}return null}function Xe(e,t){const n=document.createNodeIterator(e,NodeFilter.SHOW_ELEMENT);let o=n.nextNode();for(;o;){for(const r of Array.from(o.attributes))if(r.value.includes(t))return{element:o,attrName:r.name};o=n.nextNode()}return null}const ve=new Map,Ye="<!--zuari-hole-",Qe="-->",et="data-zuari-attr-";function d(e,...t){return{strings:e,values:t}}function ce(e,t){const{strings:n,values:o}=e,r=n.join("<!--?-->");let a=ve.get(r);a||(a=document.createElement("template"),a.innerHTML=n.reduce((m,y,c)=>{if(c>=o.length)return m+y;const s=/=["']?[^"'>]*$/.test(y)?`"${et}${c}"`:`${Ye}${c}${Qe}`;return m+y+s},""),ve.set(r,a));const i=a.content.cloneNode(!0),l=Array.from(i.childNodes),u=[];return o.forEach((m,y)=>Ge(i,y,m,u)),{fragment:i,destroy(){u.forEach(m=>m()),l.forEach(m=>{var y;return(y=m.parentNode)==null?void 0:y.removeChild(m)})}}}const tt={primary:"#006A6A",onPrimary:"#FFFFFF",primaryContainer:"#6FF7F6",onPrimaryContainer:"#002020",secondary:"#4A6363",onSecondary:"#FFFFFF",background:"#FAFDFD",onBackground:"#191C1C",surface:"#FAFDFD",onSurface:"#191C1C",surfaceVariant:"#DAE5E4",outline:"#6F7979"},nt={primary:"#4CDADA",onPrimary:"#003737",primaryContainer:"#004F4F",onPrimaryContainer:"#6FF7F6",secondary:"#B1CCCC",onSecondary:"#1C3534",background:"#191C1C",onBackground:"#E1E3E3",surface:"#191C1C",onSurface:"#E1E3E3",surfaceVariant:"#3F4948",outline:"#899392"};function ot(e=!1){const t=C(e),n=C(e?{...nt}:{...tt}),o=Me(()=>!!(typeof navigator<"u"&&/android/i.test(navigator.userAgent)||typeof window<"u"&&window.Android)),r=new Map;typeof window<"u"&&(window.__zuariKotlinDispatcher=(c,h)=>{const s=r.get(c);if(s)try{const p=JSON.parse(h);s(p)}catch{s(h)}});function a(c,...h){return new Promise((s,p)=>{if(typeof window<"u"&&window.Android){const N=window.Android;if(typeof N[c]=="function")try{const w=N[c](...h);try{s(JSON.parse(w))}catch{s(w)}return}catch(w){p(w);return}}s({success:!0,mock:!0,function:c,args:h})})}function i(c,h){return r.set(c,h),()=>{r.delete(c)}}function l(c){We(()=>{n.value={...n.value,...c}})}function u(c){const h=(c==null?void 0:c.packageName)??"com.zuari.ui.theme",s=(c==null?void 0:c.themeName)??"ZuariTheme",p={...n.value,...(c==null?void 0:c.colors)??{}};return`package ${h}

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Native Material 3 Dynamic Colors generated by Zuari (@zuari/kotlin)
val ZuariPrimary = Color(android.graphics.Color.parseColor("${p.primary}"))
val ZuariOnPrimary = Color(android.graphics.Color.parseColor("${p.onPrimary}"))
val ZuariPrimaryContainer = Color(android.graphics.Color.parseColor("${p.primaryContainer}"))
val ZuariOnPrimaryContainer = Color(android.graphics.Color.parseColor("${p.onPrimaryContainer}"))
val ZuariSecondary = Color(android.graphics.Color.parseColor("${p.secondary}"))
val ZuariOnSecondary = Color(android.graphics.Color.parseColor("${p.onSecondary}"))
val ZuariBackground = Color(android.graphics.Color.parseColor("${p.background}"))
val ZuariOnBackground = Color(android.graphics.Color.parseColor("${p.onBackground}"))
val ZuariSurface = Color(android.graphics.Color.parseColor("${p.surface}"))
val ZuariOnSurface = Color(android.graphics.Color.parseColor("${p.onSurface}"))
val ZuariSurfaceVariant = Color(android.graphics.Color.parseColor("${p.surfaceVariant}"))
val ZuariOutline = Color(android.graphics.Color.parseColor("${p.outline}"))

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
`}function m(c){const h=(c==null?void 0:c.themeName)??"Theme.Zuari.Native",s={...n.value,...(c==null?void 0:c.colors)??{}};return`<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by @zuari/kotlin Native Android Bridge -->
<resources>
    <style name="${h}" parent="Theme.Material3.DayNight.NoActionBar">
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
`}function y(c){const h=c??(typeof document<"u"?document.documentElement:null);return h?se(()=>{const s=n.value;h.style.setProperty("--md-sys-color-primary",s.primary),h.style.setProperty("--md-sys-color-on-primary",s.onPrimary),h.style.setProperty("--md-sys-color-primary-container",s.primaryContainer),h.style.setProperty("--md-sys-color-on-primary-container",s.onPrimaryContainer),h.style.setProperty("--md-sys-color-secondary",s.secondary),h.style.setProperty("--md-sys-color-on-secondary",s.onSecondary),h.style.setProperty("--md-sys-color-background",s.background),h.style.setProperty("--md-sys-color-on-background",s.onBackground),h.style.setProperty("--md-sys-color-surface",s.surface),h.style.setProperty("--md-sys-color-on-surface",s.onSurface),h.style.setProperty("--md-sys-color-surface-variant",s.surfaceVariant),h.style.setProperty("--md-sys-color-outline",s.outline)}):()=>{}}return{isAndroid:o,dynamicColors:n,isDarkTheme:t,callNativeFunction:a,registerNativeCallback:i,generateComposeThemeCode:u,generateXmlThemeCode:m,ingestDynamicPalette:l,applyToCssVariables:y}}const re=ot(!0);function R(){return typeof window<"u"&&window.Android?window.Android:null}function K(e){const t=R();t?t.commitText(e):console.log("[Dev Mock Commit]:",e)}function X(){const e=R();e?e.deleteBackward():console.log("[Dev Mock Delete]")}function rt(){const e=R();e?e.sendEnter():console.log("[Dev Mock Enter]")}function b(e="click"){const t=R();t&&typeof t.triggerHaptic=="function"&&t.triggerHaptic(e)}function at(e){const t=R();if(t&&typeof t.requestScreenshotAnalysis=="function")try{const n=t.requestScreenshotAnalysis(e);return JSON.parse(n)}catch{return{status:"error",blocks:[]}}return{status:"ok",blocks:[{text:"Are you free for drinks this weekend?",x:48,y:420,width:320,screenWidth:1080}]}}function _e(){const e=R();if(e&&typeof e.requestScreenScan=="function")try{const t=e.requestScreenScan();return JSON.parse(t)}catch{return{status:"error",blocks:[]}}return{status:"ok",appPackage:"com.snapchat.android",blocks:[{text:"What is your biggest red flag?",x:52,y:460,width:300,screenWidth:1080}]}}function it(){const e=R();if(e&&typeof e.getActiveContext=="function")try{return JSON.parse(e.getActiveContext())}catch{return{status:"none"}}return{status:"none"}}function Re(e){const t=R();t&&typeof t.openSystemSetting=="function"?t.openSystemSetting(e):console.log("[Dev Mock Open Setting]:",e)}function st(){const e=R();e&&typeof e.startVoiceTyping=="function"?e.startVoiceTyping():console.log("[Dev Mock Voice Typing]")}function lt(){const e=R();e&&typeof e.showInputMethodPicker=="function"?e.showInputMethodPicker():console.log("[Dev Mock IME Picker]")}function ct(e){const t=R();t&&typeof t.moveCursor=="function"&&t.moveCursor(e)}function ut(e){const t=R();t&&typeof t.performEditAction=="function"&&t.performEditAction(e)}function dt(e){const t=R();t&&typeof t.sendDpad=="function"&&t.sendDpad(e)}function be(e,t){return`You are an elite wingman who excels at playful, concise, charismatic banter.
Your task: Suggest 3 distinct next moves for a dating app conversation.
Strict rules:
1. MAX 12 words per line.
2. NO cheesy cliché compliments like "Hey cutie" or "You must be tired from running through my mind".
3. Use witty banter, slight teasing, or confident playful framing.
4. Output MUST be valid JSON array with keys: "vibe" (Smooth | Tease | Bold) and "line" (string).

Partner said: "${e}"
${t?`Context I said previously: "${t}"`:""}

Respond ONLY with the JSON array:`}function ht(e){return`You are a charisma coach. Rewrite this bland text message into 3 sharper, confident, flirty versions.
Max 12 words each.
Bland text: "${e}"

Output ONLY a JSON array with objects: [{"vibe": "Smooth", "line": "..."}, {"vibe": "Tease", "line": "..."}, {"vibe": "Bold", "line": "..."}]`}const we={"com.snapchat.android":"Snapchat","org.telegram.messenger":"Telegram","org.thoughtcrime.securesms":"Signal","co.hinge.app":"Hinge","com.bumble.app":"Bumble","com.tinder":"Tinder","com.instagram.android":"Instagram","com.whatsapp":"WhatsApp","web.whatsapp.com":"WhatsApp Web","instagram.com":"Instagram DM","web.telegram.org":"Telegram Web","tinder.com":"Tinder Web","bumble.com":"Bumble Web","discord.com":"Discord","x.com":"X DM"};function Be(e){if(!e)return;const t=e.replace(/^www\./i,"");if(we[t])return we[t];const n=t.split("."),o=n[n.length-1];if(!o||["android","app","messenger","com","org","io"].includes(o)){const r=n[n.length-2];return r?r.charAt(0).toUpperCase()+r.slice(1):void 0}return o.charAt(0).toUpperCase()+o.slice(1)}function ft(e){const t=Be(e.appPackage);switch(e.source){case"screenshot":return"📸 Screenshot";case"notification":return t?`🔔 ${t} Msg`:"🔔 Incoming Msg";case"clipboard":return"📋 Copied Bubble";case"accessibility":return t?`👁️ ${t} Scan`:"👁️ Screen Scan";case"selection":return"✨ Selected Text";case"dom":return t?`🌐 ${t} Chat`:"🌐 Web Chat";case"manual":return"💬 Stealth Context"}}function mt(e){const t=e.partnerText.length>26?`${e.partnerText.slice(0,26).trim()}…`:e.partnerText;switch(e.source){case"screenshot":return"📸 Screenshot Detected: Analyze Next Move";case"notification":{const n=Be(e.appPackage);return n?`🔔 ${n}: "${t}" — Reply`:`🔔 New Msg: "${t}" — Reply`}case"clipboard":return`📋 Copied: "${t}" — Reply`;case"accessibility":case"dom":return`👁️ Scanned: "${t}" — Reply`;case"selection":return`✨ Selected: "${t}" — Reply`;case"manual":return"💬 Context Ready — View Replies"}}class pt{constructor(){this.recentSelfCommits=new Set}recordSelfCommit(t){const n=this.normalize(t);if(n&&(this.recentSelfCommits.add(n),this.recentSelfCommits.size>25)){const o=this.recentSelfCommits.values().next().value;o&&this.recentSelfCommits.delete(o)}}isIgnored(t,n){const o=t.trim();if(!o)return!0;if(n==="manual"||n==="selection")return!1;const r=this.normalize(o);return!!(this.recentSelfCommits.has(r)||/^https?:\/\/\S+$/i.test(o)||/^\d{4,8}$/.test(o))}normalize(t){return t.toLowerCase().replace(/\s+/g," ").trim()}}function yt(e){const t={rawBlocks:e.map(o=>o.text)};if(e.length===0)return t;const n=e.filter(o=>{const r=o.y<120,a=o.y>o.screenWidth*1.8;return!r&&!a});n.sort((o,r)=>o.y-r.y);for(let o=n.length-1;o>=0;o--){const r=n[o],a=r.x+r.width/2>r.screenWidth/2;if(!a&&!t.senderText?t.senderText=r.text:a&&!t.myLastText&&(t.myLastText=r.text),t.senderText&&t.myLastText)break}return t}const gt=[{id:"op-1",category:"opener",vibe:"playful",triggerKeywords:["travel","hiking","nature"],template:"Are you as adventurous as your profile says, or do you also get lost in grocery stores?"},{id:"op-2",category:"opener",vibe:"smooth",triggerKeywords:["smile","eyes","cute"],template:"I was going to wait two days to message you, but patience was never my strong suit."},{id:"op-3",category:"opener",vibe:"witty",triggerKeywords:["food","coffee","cooking"],template:"Important question: what is your most controversial culinary opinion?"},{id:"bt-1",category:"banter",vibe:"playful",triggerKeywords:["trouble","sarcasm","bad"],template:"Are you always this much trouble or did I catch you on a good day?"},{id:"bt-2",category:"banter",vibe:"witty",triggerKeywords:["challenge","bet","win"],template:"Careful, high expectations are my only weakness."},{id:"bt-3",category:"banter",vibe:"bold",triggerKeywords:["rules","late","fast"],template:"I would say you are five minutes away from being my favorite person."},{id:"wp-1",category:"wordplay",vibe:"witty",triggerKeywords:["smart","books","study","work"],template:"Are you an overdue library book? Because you have fine written all over you."},{id:"wp-2",category:"wordplay",vibe:"smooth",triggerKeywords:["music","song","playlist"],template:"If our conversation was a playlist, I would have it on repeat."},{id:"cl-1",category:"closer",vibe:"bold",triggerKeywords:["drinks","date","weekend","meet","free","tonight"],template:"Drinks this Thursday. You pick the spot, I will bring the conversation."},{id:"cl-2",category:"closer",vibe:"smooth",triggerKeywords:["coffee","tea","afternoon","sunday","morning"],template:"Let us see if you are as fun in person. Coffee tomorrow?"},{id:"rf-1",category:"banter",vibe:"playful",triggerKeywords:["red flag","toxic","flaw","worst"],template:"My biggest red flag is thinking I can win every staring contest."},{id:"sn-1",category:"banter",vibe:"bold",triggerKeywords:["snap","streak","vanish","secret","disappear"],template:"Disappearing messages just mean we have to make every line count."},{id:"wy-1",category:"banter",vibe:"witty",triggerKeywords:["wyd","doing","bored","up to","plans"],template:"Plotting my next move, and you just walked right into it."},{id:"pt-1",category:"opener",vibe:"playful",triggerKeywords:["dog","puppy","cat","pet","gym","workout"],template:"Be honest: am I competing with your pet for attention, or do I stand a chance?"}];function vt(e,t=3){const n=e.toLowerCase();if(!n.trim())return[];const o=gt.map(r=>{let a=0;for(const i of r.triggerKeywords)n.includes(i)&&(a+=2);return{entry:r,score:a}}).filter(r=>r.score>0);return o.sort((r,a)=>a.score-r.score),o.slice(0,t).map(r=>r.entry)}function bt(e){const t=new Set(["the","and","for","are","you","that","this","with","have","what","when","where","why","how","just","like","really","very","about","from","they","them","your","mine","been","were","was","will","would","could","should","going","doing","want","need","know","think","today","tonight","tomorrow","lol","haha","lmao","yeah","yep","nope","okay","hey","hii","hello"]),n=e.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(o=>o.length>=4&&!t.has(o));return n.length>0?n[n.length-1]:null}class Oe{generateOfflineSuggestions(t,n){const o=t.trim(),r=o.toLowerCase(),a=vt(o,3),i={};for(const w of a)w.vibe==="smooth"&&!i.Smooth?i.Smooth=w.template:(w.vibe==="playful"||w.vibe==="witty")&&!i.Tease?i.Tease=w.template:w.vibe==="bold"&&!i.Bold&&(i.Bold=w.template);for(const w of a)!i.Smooth&&w.template!==i.Tease&&w.template!==i.Bold?i.Smooth=w.template:!i.Tease&&w.template!==i.Smooth&&w.template!==i.Bold?i.Tease=w.template:!i.Bold&&w.template!==i.Smooth&&w.template!==i.Tease&&(i.Bold=w.template);const l=bt(o),u=o.includes("?")||/^(what|why|how|where|when|who|are|do|did|would|can|wanna)\b/i.test(o),m=o.length>0&&o.split(/\s+/).length<=2&&!u,y=/^(hey|hi|hello|yo|sup|heyy+|hii+|gm|good morning)\b/i.test(r),c=/\b(sorry|my bad|apologize|late|missed)\b/i.test(r),h=/\b(cute|hot|pretty|handsome|smart|funny|sweet|love your|like your)\b/i.test(r);let s,p,N;return y?(s="Was literally just thinking about texting you—great timing.",p="Look who finally decided to grace my notifications.",N="Hey—skipping the small talk, how is your week looking?"):c?(s="All good, life happens. Just glad you are here now.",p="You owe me a coffee for the suspense, then we are even.",N="Apology accepted—make it up to me this weekend?"):h?(s="Careful, keep talking like that and I might actually blush.",p="Flattery will get you everywhere—what else you got?",N="Say that again in person over drinks."):u&&l?(s=`Honestly, ${l} is a whole story—I will tell you the good part.`,p=`Depends—are you asking about ${l} out of curiosity or research?`,N=`Better ${l} story in person. Are you free Thursday?`):u?(s="Careful, the honest answer might make you like me more.",p="I plead the fifth—unless you are buying the first round.",N="Better story in person. When are we hanging out?"):m?(s="A person of few words—good thing I speak fluent mystery.",p="Do not hurt your thumbs typing a whole novel over there.",N="Tell me what you are actually up to right now."):l?(s=`Okay, ${l} actually sounds like my kind of vibe.`,p=`Wait, you cannot just drop "${l}" and not elaborate.`,N=`We definitely need to talk more about ${l}—coffee this week?`):r.includes("haha")||r.includes("lol")||r.includes("lmao")?(s="Making you laugh this early is dangerous for both of us.",p="Glad I could entertain you—my rates go up after midnight.",N="Wait until you hear my actual voice—call later?"):(s="I was going to play it cool, but you made that impossible.",p="Are you always this much trouble or is today special?",N="Skip the small talk: what is your go-to spot for drinks?"),[{vibe:"Smooth",line:i.Smooth??s},{vibe:"Tease",line:i.Tease??p},{vibe:"Bold",line:i.Bold??N}]}async generateOnlineSuggestions(t,n){var i,l,u;const o=this.generateOfflineSuggestions(t,n);if(typeof fetch!="function")return o;const r=new AbortController,a=setTimeout(()=>r.abort(),4e3);try{const m=`${be(t,n)}
Return ONLY a JSON array of 3 objects: [{"vibe":"Smooth","line":"..."},{"vibe":"Tease","line":"..."},{"vibe":"Bold","line":"..."}]`,y=await fetch("https://text.pollinations.ai/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:"You are a concise, witty dating/chat assistant. Reply ONLY with valid JSON."},{role:"user",content:m}],model:"openai"}),signal:r.signal});if(clearTimeout(a),!y.ok)return o;const h=(await y.text()).match(/\[[\s\S]*\]/);if(!h)return o;const s=JSON.parse(h[0]);return!Array.isArray(s)||s.length<3?o:[{vibe:"Smooth",line:String(((i=s[0])==null?void 0:i.line)||o[0].line)},{vibe:"Tease",line:String(((l=s[1])==null?void 0:l.line)||o[1].line)},{vibe:"Bold",line:String(((u=s[2])==null?void 0:u.line)||o[2].line)}]}catch{return clearTimeout(a),o}}getPromptForChat(t,n){return be(t,n)}getPromptForRewrite(t){return ht(t)}}class wt{constructor(){this.engine=new Oe,this.filter=new pt,this.lastProcessedSignature=""}recordCommittedReply(t){this.filter.recordSelfCommit(t)}isIgnoredNoiseOrSelf(t,n){return this.filter.isIgnored(t,n)}ingestRawContext(t){var a,i;const n=t.text.replace(/\s+/g," ").trim();if(this.filter.isIgnored(n,t.source))return null;const o=`${t.source}:${t.appPackage??""}:${this.filter.normalize(n)}`;if(t.source!=="manual"&&t.source!=="selection"&&o===this.lastProcessedSignature)return null;this.lastProcessedSignature=o;const r=t.timestamp??Date.now();return{id:`${t.source}-${r}`,source:t.source,partnerText:n,myLastText:((a=t.myLastText)==null?void 0:a.trim())||void 0,senderName:((i=t.senderName)==null?void 0:i.trim())||void 0,appPackage:t.appPackage,uri:t.uri,timestamp:r}}ingestScreenBlocks(t,n,o){var i;if(!t||t.length===0)return null;const r=yt(t),a=r.senderText??r.rawBlocks.find(l=>!this.filter.isIgnored(l,n));return a?{id:`${n}-${(o==null?void 0:o.timestamp)??Date.now()}`,source:n,partnerText:a.trim(),myLastText:(i=r.myLastText)==null?void 0:i.trim(),appPackage:o==null?void 0:o.appPackage,uri:o==null?void 0:o.uri,timestamp:(o==null?void 0:o.timestamp)??Date.now()}:null}resolveSuggestions(t){const n=this.engine.generateOfflineSuggestions(t.partnerText,t.myLastText);return{context:t,suggestions:n}}}const ke={i:"I",im:"I'm",ive:"I've",ill:"I'll",id:"I'd",dont:"don't",cant:"can't",wont:"won't",didnt:"didn't",doesnt:"doesn't",isnt:"isn't",arent:"aren't",wasnt:"wasn't",werent:"weren't",havent:"haven't",hasnt:"hasn't",hadnt:"hadn't",wouldnt:"wouldn't",couldnt:"couldn't",shouldnt:"shouldn't",youre:"you're",youve:"you've",youll:"you'll",theyre:"they're",thats:"that's",whats:"what's",heres:"here's",theres:"there's",wheres:"where's",lets:"let's",teh:"the",hte:"the",adn:"and",nad:"and",taht:"that",waht:"what",whta:"what",hwat:"what",wiht:"with",wtih:"with",jsut:"just",jstu:"just",liek:"like",lke:"like",realy:"really",relly:"really",definately:"definitely",definetly:"definitely",seperate:"separate",recieve:"receive",occured:"occurred",untill:"until",tommorow:"tomorrow",tomorow:"tomorrow",tonite:"tonight",becuase:"because",beacuse:"because",freind:"friend",frend:"friend",prolly:"probably",probly:"probably",thx:"thanks",ty:"thank you",pls:"please",plz:"please",sry:"sorry",srry:"sorry",msg:"message",bday:"birthday",wknd:"weekend",tmrw:"tomorrow"};class kt{constructor(){this.root={children:new Map,isWord:!1,frequency:0},this.bigrams=new Map,this.dictionaryWords=new Set,this.personalWords=new Set,this.seedCommonVocabulary()}insert(t,n=1){let o=this.root;const r=t.toLowerCase();for(const a of r)o.children.has(a)||o.children.set(a,{children:new Map,isWord:!1,frequency:0}),o=o.children.get(a);o.isWord=!0,o.frequency+=n,this.dictionaryWords.add(r)}learnWord(t){const n=t.trim().replace(/[^a-zA-Z']/g,"");n.length<2||(this.insert(n,25),this.personalWords.add(n.toLowerCase()))}getPersonalDictionary(){return Array.from(this.personalWords).sort()}hasWord(t){return this.dictionaryWords.has(t.toLowerCase())}autocorrect(t){const n=t.trim();if(!n||n.length<1)return null;const o=n.toLowerCase();if(ke[o]){const i=ke[o];return n[0]===n[0].toUpperCase()&&i[0]!==i[0].toUpperCase()?i[0].toUpperCase()+i.slice(1):i}if(this.dictionaryWords.has(o)||o.length<3)return null;let r=null,a=0;for(const i of this.dictionaryWords)if(!(Math.abs(i.length-o.length)>1)&&this.levenshtein(o,i)===1){const l=this.getWordFrequency(i);l>a&&(a=l,r=i)}return r?n[0]===n[0].toUpperCase()?r[0].toUpperCase()+r.slice(1):r:null}getWordFrequency(t){let n=this.root;for(const o of t.toLowerCase()){const r=n.children.get(o);if(!r)return 0;n=r}return n.isWord?n.frequency:0}levenshtein(t,n){const o=t.length,r=n.length,a=Array.from({length:r+1},(i,l)=>l);for(let i=1;i<=o;i++){let l=a[0];a[0]=i;for(let u=1;u<=r;u++){const m=a[u];t[i-1]===n[u-1]?a[u]=l:a[u]=1+Math.min(l,a[u],a[u-1]),l=m}}return a[r]}addBigram(t,n){const o=t.toLowerCase(),r=n.toLowerCase();let a=this.bigrams.get(o);a||(a=[],this.bigrams.set(o,a));const i=a.find(l=>l.word===r);i?i.count++:a.push({word:r,count:1}),a.sort((l,u)=>u.count-l.count)}completePrefix(t,n=3){if(!t)return[];let o=this.root;const r=t.toLowerCase();for(const i of r){if(!o.children.has(i))return[];o=o.children.get(i)}const a=[];return this.collectWords(o,r,a),a.sort((i,l)=>l.frequency-i.frequency),a.slice(0,n).map(i=>i.word)}predictNextWord(t,n=3){if(!t)return["the","you","I"];const o=t.toLowerCase(),r=this.bigrams.get(o);return r&&r.length>0?r.slice(0,n).map(a=>a.word):["and","to","you"]}collectWords(t,n,o){t.isWord&&o.push({word:n,frequency:t.frequency});for(const[r,a]of t.children.entries())this.collectWords(a,n+r,o)}seedCommonVocabulary(){const t=[["the",200],["be",180],["to",180],["of",175],["and",175],["a",170],["in",165],["that",160],["have",155],["it",155],["for",150],["not",145],["on",145],["with",140],["he",135],["as",135],["you",190],["do",130],["at",130],["this",130],["but",125],["his",120],["by",120],["from",120],["they",120],["we",125],["say",115],["her",115],["she",115],["or",115],["an",115],["will",120],["my",130],["one",115],["all",115],["would",115],["there",115],["their",110],["what",140],["so",125],["up",110],["out",110],["if",115],["about",120],["who",110],["get",115],["which",105],["go",115],["me",125],["when",120],["make",110],["can",125],["like",130],["time",115],["no",115],["just",125],["him",105],["know",120],["take",105],["people",100],["into",100],["year",95],["your",130],["good",125],["some",105],["could",105],["them",105],["see",115],["other",100],["than",100],["then",105],["now",115],["look",105],["only",105],["come",105],["its",100],["over",100],["think",110],["also",100],["back",105],["after",100],["use",100],["two",95],["how",135],["our",105],["work",105],["first",100],["well",110],["way",105],["even",100],["new",100],["want",115],["because",105],["any",100],["these",95],["give",95],["day",105],["most",95],["us",100],["are",150],["was",130],["were",110],["been",105],["has",110],["had",110],["free",110],["tonight",105],["tomorrow",100],["weekend",110],["coffee",95],["drinks",95],["dinner",95],["lunch",90],["plans",95],["sounds",105],["love",120],["talking",90],["where",115],["why",110],["going",115],["great",115],["amazing",95],["awesome",95],["cool",100],["nice",105],["sorry",100],["thanks",105],["please",105],["maybe",95],["definitely",90],["probably",90],["actually",95],["really",115],["very",110],["morning",95],["night",105],["today",105],["soon",95],["later",95],["ready",90],["busy",90],["happy",95],["excited",90],["miss",95],["wait",95],["meet",95]];for(const[o,r]of t)this.insert(o,r);const n=[["how","are"],["how","is"],["how","was"],["are","you"],["are","we"],["are","they"],["you","free"],["you","doing"],["you","up"],["what","are"],["what","is"],["what","do"],["want","to"],["going","to"],["have","to"],["good","morning"],["good","night"],["good","idea"],["sounds","good"],["sounds","great"],["sounds","fun"],["see","you"],["talk","to"],["let","me"],["on","my"],["my","way"],["this","weekend"]];for(const[o,r]of n)this.addBigram(o,r)}}function Ct(e){const t=e.trim(),n=t.toLowerCase();return t?/^(hey|hi|hello|sup|yo|wyd|what'?s up)$/i.test(t)?{score:2,verdict:"Dry",feedback:"Low effort opener. High ghosting probability (~90%).",improved:"Important question: what is your most controversial food opinion?"}:n.includes("how are you")||n.includes("how was your day")?{score:4,verdict:"Safe",feedback:"Polite but sounds like an HR interview.",improved:"Tell me your day was more exciting than grocery shopping."}:n.includes("cutie")||n.includes("beautiful")||n.includes("gorgeous")?{score:5,verdict:"Safe",feedback:"Compliment is sweet, but every other match says the exact same thing.",improved:"I was going to play it cool, but you made that impossible."}:n.includes("trouble")||n.includes("bet")||n.includes("drinks")||n.includes("coffee")?{score:9,verdict:"Smooth",feedback:"High energy, playful intrigue. Ready to send.",improved:t}:{score:7,verdict:"Smooth",feedback:"Solid message. Could use 10% more cheekiness.",improved:`${t} — unless you scare easily.`}:{score:1,verdict:"Dry",feedback:"Empty canvas. Drop something bold.",improved:"Are we breaking records or rules tonight?"}}const Z=[{name:"Smileys & Rizz",icon:"😏",emojis:["😏","😉","😎","😜","😝","😛","🥳","🤩","😍","🥰","😘","😗","😙","😚","🤗","🤭","🤫","🫠","🫡","🤔","🤨","😐","😑","😶","🙄","😬","😌","😔","😪","😴","😂","🤣","😭","😅","😆","😁","😄","😃","😀","🙂","😈","👿","🫦","💅","👀","✨","🔥","💀","🤡","🥺"]},{name:"Love & Hearts",icon:"❤️",emojis:["❤️","❤️‍🔥","❤️‍🩹","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💖","💗","💓","💞","💕","💘","💝","💟","❣️","💔","💋","💌","💍","💎","🌹","🥀","💐","🌷","🌸","🥂","🍾","🍫","🍓","🍒","🫶","🫰","💑","👩‍❤️‍👨","💏"]},{name:"Gestures & Reactions",icon:"✌️",emojis:["👍","👎","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","☝️","✋","🤚","🖐️","🖖","👋","🤝","🙏","👏","🙌","👐","🤲","✊","👊","🤛","🤜","💪","🦾","🫶","🤦‍♂️","🤦‍♀️","🤷‍♂️","🤷‍♀️","💯","🎯"]},{name:"People & Vibes",icon:"🕺",emojis:["🕺","💃","👯","🧘","🏄","🚴","🏋️","🤸","🥷","🕵️","👑","🎩","🕶️","👓","🧣","👗","👔","👟","👠","👜","🧠","🫀","👁️","👅","👄","👂","👃","🫂","🗣️","👤"]},{name:"Food & Dates",icon:"☕",emojis:["☕","🍵","🧋","🥤","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🍾","🍕","🍔","🍟","🌭","🌮","🌯","🍣","🍜","🍝","🍛","🍱","🥟","🍤","🍦","🍨","🍩","🍪","🎂","🍰","🧁","🍫","🍿","🥐","🥯","🥞","🧇","🥓","🍳"]},{name:"Activities & Travel",icon:"✈️",emojis:["✈️","🚗","🏎️","🚕","🚌","🚆","🚀","🛸","⛵","🏖️","🏝️","🏔️","🏕️","🌅","🌄","🌃","🌆","🎡","🎢","🎬","🎤","🎧","🎼","🎹","🎸","🥁","🎮","🕹️","🎲","♟️","🎳","🎯","⚽","🏀","🏈","⚾","🎾","🏐","🏆","🥇"]},{name:"Symbols & Tech",icon:"⚡",emojis:["⚡","⭐","🌟","💫","✨","💥","💢","💦","💨","💤","💬","💭","🗯️","🔔","🔕","🔒","🔓","🔑","📱","💻","⌨️","📷","📸","🎥","📺","📻","⏰","⏳","💡","🔋","✅","❌","❓","❗","‼️","⁉️","⚠️","🚫","♻️","♾️"]}];function v(e){const{fragment:t}=ce(e);if(t.childElementCount===1&&t.firstElementChild)return t.firstElementChild;const n=document.createElement("div");return n.style.display="contents",n.appendChild(t),n}function I(e,t){const n=document.createElement("div");n.className=e;for(const o of t){const{fragment:r}=ce(o);n.appendChild(r)}return n}function B(e,t=18){return d`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d=${e}/></svg>`}const O={mic:()=>B("M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8"),scan:()=>B("M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"),chat:()=>B("M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"),flame:()=>B("M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"),clipboard:()=>B("M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6v4H9z"),emoji:()=>B("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01"),edit:()=>B("M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"),help:()=>B("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01"),theme:()=>B("M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"),oneHanded:()=>B("M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2 M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2 M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8 M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"),numbers:()=>B("M4 9h16 M4 15h16 M10 3L8 21 M16 3l-2 18"),globe:()=>B("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z")};function St(e){return v(d`
    <div class="action-bar">
      ${()=>e.activeContext.value?v(d`
            <button class="action-pill highlight" @click=${e.onOpenContextReplies}>
              ${mt(e.activeContext.value)}
            </button>
          `):""}
      <button class="action-pill" @click=${e.onVoiceInput} title="Google Voice Typing">
        ${O.mic()}
      </button>
      <button class="action-pill" @click=${e.onScanScreen} title="Scan Screen">
        ${O.scan()}
      </button>
      <button
        class=${()=>e.stealthMode.value?"action-pill active-mode":"action-pill"}
        @click=${e.onToggleStealth}
        title="Tell Rizz">
        ${O.chat()}
      </button>
      <button class="action-pill" @click=${e.onToggleRoast} title="Roast Draft">
        ${O.flame()}
      </button>
      <button class="action-pill" @click=${e.onToggleClipboard} title="Clipboard">
        ${O.clipboard()}
      </button>
      <button class="action-pill" @click=${e.onToggleEmojis} title="Emojis">
        ${O.emoji()}
      </button>
      <button class="action-pill" @click=${e.onToggleTextEdit} title="Text Editing">
        ${O.edit()}
      </button>
      <button class="action-pill" @click=${e.onToggleHelp} title="Help & Gestures">
        ${O.help()}
      </button>
      <button class="action-pill" @click=${e.onCycleTheme} title="Switch Theme">
        ${O.theme()}
      </button>
      <button class="action-pill" @click=${e.onToggleOneHanded} title="One-Handed Mode">
        ${O.oneHanded()}
      </button>
      <button class="action-pill" @click=${e.onToggleNumberRow} title="Number Row">
        ${O.numbers()}
      </button>
      <button class="action-pill" @click=${e.onSwitchKeyboard} title="Switch Keyboard">
        ${O.globe()}
      </button>
    </div>
  `)}function $t(e){return v(d`
    <div class="stealth-bar">
      <div class="stealth-top">
        <span class="stealth-badge">🛡️ STEALTH MODE · Hidden from chat</span>
        <div class="stealth-actions">
          ${()=>e.showEnableScanner.value?v(d`
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
  `)}function xt(e){return v(d`
    <div class="suggestions-shell">
      ${()=>I("suggestions-panel",e.suggestions.value.map(t=>d`
          <div class="suggestion-card" @click=${()=>e.onSelectSuggestion(t)}>
            <span class="suggestion-text">${t}</span>
          </div>
        `))}
    </div>
  `)}const Tt={q:"1",w:"2",e:"3",r:"4",t:"5",y:"6",u:"7",i:"8",o:"9",p:"0",a:"@",s:"#",d:"$",f:"%",g:"&",h:"-",j:"+",k:"(",l:")",z:"*",x:'"',c:"'",v:":",b:";",n:"!",m:"?"};function Pt(e){const t=C("off"),n=C("alpha"),o=["q","w","e","r","t","y","u","i","o","p"],r=["a","s","d","f","g","h","j","k","l"],a=["z","x","c","v","b","n","m"],i=["1","2","3","4","5","6","7","8","9","0"],l=["@","#","$","_","&","-","+","(",")","/"],u=["*",'"',"'",":",";","!","?"],m=["~","`","|","•","√","π","÷","×","§","Δ"],y=["£","€","¥","^","°","=","{","}","\\","©"],c=["%","®","™","✓","[","]","<",">"],h=k=>{const x=t.value!=="off"?k.toUpperCase():k;e.onKeyPress(x),t.value==="once"&&(t.value="off")},s=()=>{t.value==="off"?t.value="once":t.value==="once"?t.value="caps":t.value="off"},p=(k,E)=>{const x=E?k.toUpperCase():k,S=Tt[k]??"";let f=null,$=!1;const Y=()=>{$=!1,S&&(f=setTimeout(()=>{$=!0,e.onKeyPress(S)},380))},W=()=>{f&&(clearTimeout(f),f=null)};return d`
      <button
        class="key-btn"
        @pointerdown=${Y}
        @pointerup=${W}
        @pointerleave=${W}
        @pointercancel=${W}
        @click=${()=>{f&&(clearTimeout(f),f=null),$||h(k),$=!1}}>
        ${x}
      </button>
    `},N=()=>{let k=null,E=null,x=!1,S=0;const f=()=>{k&&(clearTimeout(k),k=null),E&&(clearInterval(E),E=null)};return d`
      <button
        class="key-btn special"
        @pointerdown=${V=>{S=V.clientX,x=!1,f(),k=setTimeout(()=>{x=!0,e.onBackspace(),E=setInterval(()=>{e.onBackspace()},55)},350)}}
        @pointermove=${V=>{var D;S-V.clientX>=28&&!x&&(x=!0,f(),(D=e.onDeleteWord)==null||D.call(e))}}
        @pointerup=${f}
        @pointerleave=${f}
        @pointercancel=${f}
        @click=${()=>{f(),x||e.onBackspace(),x=!1}}>
        ⌫
      </button>
    `},w=()=>{let k=0,E=0,x=0,S=!1,f=!1;const $=D=>{k=D.clientX,E=D.clientY,x=D.clientX,S=!1,f=!0},Y=D=>{var he;if(!f)return;if(E-D.clientY>=28&&!S){S=!0,f=!1,(he=e.onSwipeUpSpace)==null||he.call(e);return}if(!e.onMoveCursor)return;const de=D.clientX-x;if(Math.abs(D.clientX-k)>10&&(S=!0),Math.abs(de)>=18){const fe=Math.trunc(de/18);e.onMoveCursor(fe),x+=fe*18}},W=()=>{f=!1};return d`
      <button
        class="key-btn space"
        @pointerdown=${$}
        @pointermove=${Y}
        @pointerup=${W}
        @pointercancel=${W}
        @click=${()=>{S||e.onKeyPress(" "),S=!1}}>
        ${()=>e.stealthMode.value?"stealth space":"space"}
      </button>
    `},Le=()=>{const k=t.value!=="off",E=t.value==="caps"?"⇪":t.value==="once"?"⬆":"⇧",x=t.value==="off"?"key-btn special":"key-btn special active-shift",S=document.createElement("div");S.className="keyboard-row",S.appendChild(v(d`<button class=${x} @click=${s}>${E}</button>`));for(const f of a)S.appendChild(v(p(f,k)));return S.appendChild(v(N())),v(d`
      <div class="keyboard-grid">
        ${()=>{var f;return(f=e.showNumberRow)!=null&&f.value?I("keyboard-row",i.map($=>d`<button class="key-btn" @click=${()=>e.onKeyPress($)}>${$}</button>`)):""}}
        ${I("keyboard-row",o.map(f=>p(f,k)))}
        ${I("keyboard-row",r.map(f=>p(f,k)))}
        ${S}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>n.value="numbers"}>123</button>
          <button class="key-btn special" @click=${e.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${()=>e.onKeyPress(",")}>,</button>
          ${w()}
          <button class="key-btn special" @click=${()=>e.onKeyPress(".")}>.</button>
          <button class="key-btn send" @click=${e.onSend}>
            ${()=>e.stealthMode.value?"Ask ⚡":"Send"}
          </button>
        </div>
      </div>
    `)},ue=k=>{const E=k?m:i,x=k?y:l,S=k?c:u,f=document.createElement("div");f.className="keyboard-row",f.appendChild(v(d`
        <button
          class="key-btn special"
          @click=${()=>n.value=k?"numbers":"symbols"}>
          ${k?"123":"=\\<"}
        </button>
      `));for(const $ of S)f.appendChild(v(d`<button class="key-btn" @click=${()=>e.onKeyPress($)}>${$}</button>`));return f.appendChild(v(N())),v(d`
      <div class="keyboard-grid">
        ${I("keyboard-row",E.map($=>d`<button class="key-btn" @click=${()=>e.onKeyPress($)}>${$}</button>`))}
        ${I("keyboard-row",x.map($=>d`<button class="key-btn" @click=${()=>e.onKeyPress($)}>${$}</button>`))}
        ${f}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>n.value="alpha"}>ABC</button>
          <button class="key-btn special" @click=${e.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${()=>e.onKeyPress(",")}>,</button>
          ${w()}
          <button class="key-btn special" @click=${()=>e.onKeyPress(".")}>.</button>
          <button class="key-btn send" @click=${e.onSend}>
            ${()=>e.stealthMode.value?"Ask ⚡":"Send"}
          </button>
        </div>
      </div>
    `)};return v(d`
    <div class="keyboard-grid-wrapper">
      ${()=>n.value==="numbers"?ue(!1):n.value==="symbols"?ue(!0):Le()}
    </div>
  `)}const ze="rizzboard_recent_emojis";function le(){try{const e=localStorage.getItem(ze);if(!e)return["😏","🔥","❤️","😂","✨","👀","💯","🥂"];const t=JSON.parse(e);return Array.isArray(t)&&t.length>0?t:["😏","🔥","❤️","😂"]}catch{return["😏","🔥","❤️","😂"]}}function Nt(e){try{const t=le().filter(o=>o!==e),n=[e,...t].slice(0,16);localStorage.setItem(ze,JSON.stringify(n))}catch{}}function At(e){const t=C(0),n=C(""),o=C(le()),r=i=>{Nt(i),o.value=le(),e.onSelectEmoji(i)},a=document.createElement("div");return a.className="emoji-tabs",a.appendChild(v(d`
      <button
        class=${()=>t.value===0?"emoji-tab active":"emoji-tab"}
        @click=${()=>{n.value="",t.value=0}}>
        🕒
      </button>
    `)),Z.forEach((i,l)=>{const u=l+1;a.appendChild(v(d`
        <button
          class=${()=>u===t.value?"emoji-tab active":"emoji-tab"}
          @click=${()=>{n.value="",t.value=u}}>
          ${i.icon}
        </button>
      `))}),a.appendChild(v(d`<button class="emoji-tab back-key" @click=${e.onClose}>ABC</button>`)),v(d`
    <div class="emoji-view">
      <div class="emoji-search-bar" style="padding: 4px 8px;">
        <input
          type="text"
          class="stealth-input"
          placeholder="Search emojis (e.g. love, food, fire, gesture)..."
          .value=${()=>n.value}
          @input=${i=>{n.value=i.target.value}}
          style="width: 100%; padding: 6px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.25); color: inherit; font-size: 13px;"
        />
      </div>
      ${a}
      ${()=>{const i=n.value.trim().toLowerCase();let l;if(i){const u=Z.filter(m=>m.name.toLowerCase().includes(i));l=u.length>0?u.flatMap(m=>m.emojis):Z.flatMap(m=>m.emojis)}else t.value===0?l=o.value:l=(Z[t.value-1]??Z[0]).emojis;return I("emoji-grid",l.map(u=>d`
            <button class="emoji-btn" @click=${()=>r(u)}>${u}</button>
          `))}}
    </div>
  `)}function Mt(e){const t=C([]),n=o=>{t.value.includes(o)?t.value=t.value.filter(r=>r!==o):t.value=[o,...t.value]};return v(d`
    <div class="clipboard-view">
      <div class="clipboard-header">
        <span>Clipboard — Tap to Paste or ⚡ Reply</span>
        <div style="display:flex; gap:8px; align-items:center;">
          ${e.onClearAll?v(d`<button class="back-link" @click=${e.onClearAll}>Clear</button>`):""}
          <button class="back-link" @click=${e.onClose}>Close ✕</button>
        </div>
      </div>
      ${()=>{const o=t.value,r=[...e.history.value.filter(a=>o.includes(a)),...e.history.value.filter(a=>!o.includes(a))];return r.length===0?v(d`
            <div style="padding: 20px; text-align: center; opacity: 0.6; font-size: 13px;">
              Clipboard is empty. Copy any message to see it here.
            </div>
          `):I("clipboard-list",r.map(a=>{const i=o.includes(a);return d`
              <div class="clipboard-item-row">
                <div class="clipboard-item" @click=${()=>e.onSelectClip(a)}>
                  ${i?"📌 ":""}${a}
                </div>
                <button
                  class="clip-analyze-btn"
                  @click=${()=>n(a)}
                  title=${i?"Unpin":"Pin"}>
                  ${i?"📌":"📍"}
                </button>
                <button class="clip-analyze-btn" @click=${()=>e.onAnalyzeClip(a)}>
                  ⚡
                </button>
                ${e.onDeleteClip?v(d`
                      <button
                        class="clip-analyze-btn"
                        @click=${()=>e.onDeleteClip(a)}
                        title="Delete">
                        ✕
                      </button>
                    `):""}
              </div>
            `}))}}
    </div>
  `)}function Et(e){return v(d`
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
  `)}function _t(e){return v(d`
    <div class="nextmove-view">
      <div class="nextmove-header">
        <div class="nextmove-meta">
          <span class="source-chip">
            ${()=>e.resolution.value?ft(e.resolution.value.context):"⚡ Next Move"}
          </span>
          <span class="partner-quote">
            "${()=>{var n;const t=((n=e.resolution.value)==null?void 0:n.context.partnerText)??"";return t.length>44?`${t.slice(0,44).trim()}…`:t}}"
          </span>
        </div>
        <div class="nextmove-actions">
          <button class="back-link" @click=${e.onSwitchToStealth}>Edit</button>
          <button class="back-link" @click=${e.onClose}>Close ✕</button>
        </div>
      </div>

      ${()=>{const t=e.resolution.value;return!t||t.suggestions.length===0?v(d`
            <div class="roast-feedback">Tap "Tell Rizz" or "Scan Screen" to load chat context.</div>
          `):I("nextmove-cards",t.suggestions.map(n=>d`
            <div class="vibe-card" @click=${()=>e.onSelectReply(n.line)}>
              <span class="vibe-tag vibe-${n.vibe.toLowerCase()}">${n.vibe}</span>
              <span class="vibe-line">${n.line}</span>
            </div>
          `))}}
    </div>
  `)}function Rt(e){const t=o=>{b("click"),ut(o)},n=o=>{b("light"),dt(o)};return v(d`
    <div class="clipboard-view" style="padding: 8px;">
      <div class="clipboard-header">
        <span>Text Editing & Cursor Pad</span>
        <button class="back-link" @click=${e.onClose}>ABC ✕</button>
      </div>
      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px; margin-bottom:8px;">
        <button class="key-btn special" @click=${()=>t("selectAll")}>Select All</button>
        <button class="key-btn special" @click=${()=>t("copy")}>Copy</button>
        <button class="key-btn special" @click=${()=>t("cut")}>Cut</button>
        <button class="key-btn special" @click=${()=>t("paste")}>Paste</button>
      </div>
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:6px; max-width: 240px; margin: 0 auto;">
        <div></div>
        <button class="key-btn" @click=${()=>n("up")}>▲</button>
        <button class="key-btn special" @click=${e.onBackspace}>⌫</button>
        <button class="key-btn" @click=${()=>n("left")}>◀</button>
        <button class="key-btn" @click=${()=>n("down")}>▼</button>
        <button class="key-btn" @click=${()=>n("right")}>▶</button>
      </div>
    </div>
  `)}const Bt=[{icon:"✨",title:"Auto Chat Replies",desc:"Opens automatically when a chat is detected, or swipe up on Spacebar."},{icon:"🔢",title:"Long-Press Numbers & Symbols",desc:`Hold q–p for 1–0, or hold a–m for @ # $ % & - + ( ) * " ' : ; ! ?`},{icon:"⌫",title:"Swipe Left / Hold Backspace",desc:"Hold ⌫ to repeat-delete, or swipe left on ⌫ to delete a whole word."},{icon:"↔️",title:"Spacebar Cursor Scrub",desc:"Slide your finger left or right on Spacebar to move the cursor."},{icon:"🎙️",title:"Google Voice Typing",desc:"Tap Mic in the top bar for instant voice dictation."},{icon:"✂️",title:"Text Editing & D-Pad",desc:"Tap ✂️ for Select All, Copy, Cut, Paste, and arrow keys."},{icon:"📋",title:"Clipboard & Emoji Search",desc:"Pin/delete clips in 📋, or search 250+ emojis in 😏."}];function Ot(e){return v(d`
    <div class="help-view" style="padding: 8px; max-height: 220px; overflow-y: auto;">
      <div class="clipboard-header" style="margin-bottom: 6px;">
        <span>RizzBoard Gestures & Guide</span>
        <div style="display:flex; gap:8px;">
          <button class="back-link" @click=${()=>Re("setup")}>⚙ Setup</button>
          <button class="back-link" @click=${e.onClose}>ABC ✕</button>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${Bt.map(t=>d`
          <div class="help-card">
            <span style="font-size: 16px; min-width: 24px; text-align: center;">${t.icon}</span>
            <div>
              <div style="font-weight: 600; font-size: 12px;">${t.title}</div>
              <div style="opacity: 0.72; font-size: 11px;">${t.desc}</div>
            </div>
          </div>
        `)}
      </div>
    </div>
  `)}const oe=new kt,M=new wt,g=C("qwerty"),P=C(""),Q=C((()=>{try{const e=localStorage.getItem("rizzboard_theme");if(e==="amoled"||e==="light"||e==="slate")return e}catch{}return"slate"})()),ee=C((()=>{try{const e=localStorage.getItem("rizzboard_one_handed");if(e==="right"||e==="left"||e==="off")return e}catch{}return"off"})()),ae=C((()=>{try{return localStorage.getItem("rizzboard_number_row")==="true"}catch{}return!1})()),q=C(void 0),_=C(null),L=C(null),T=C(!1),z=C(""),G=C(null),F=C(!1),De=C(null),H=C(["What is your biggest red flag?","Are we still on for coffee this weekend?"]),zt=Me(()=>{const e=T.value?z.value:P.value;if(!e)return T.value?["asked","red","weekend"]:["how","are","you"];const t=e.trim().split(/\s+/),n=t[t.length-1];if(e.endsWith(" "))return oe.predictNextWord(n,3);{const o=oe.completePrefix(n,3);return o.length>0?o:[n]}});re.registerNativeCallback("appContextChanged",e=>{if(e!=null&&e.packageName){q.value=e.packageName;try{const t=_e();if(t.status==="ok"&&t.blocks.length>0){const n=M.ingestScreenBlocks(t.blocks,"accessibility",{appPackage:t.appPackage??e.packageName});n&&(_.value=n)}}catch{}}});re.registerNativeCallback("screenshotDetected",e=>{e!=null&&e.uri&&(_.value={id:`screenshot-${e.timestamp??Date.now()}`,source:"screenshot",partnerText:"Screenshot captured",uri:e.uri,appPackage:e.appPackage??q.value,timestamp:Date.now()},b("heavy"))});re.registerNativeCallback("contextDetected",e=>{if(!(e!=null&&e.text)||!(e!=null&&e.source))return;const t=M.ingestRawContext({source:e.source,text:e.text,senderName:e.senderName,appPackage:e.appPackage??q.value,timestamp:e.timestamp});t&&(_.value=t,b("click"))});re.registerNativeCallback("clipboardAdded",e=>{if(e!=null&&e.text){const t=String(e.text).trim();if(!t)return;H.value=[t,...H.value.filter(o=>o!==t).slice(0,9)];const n=M.ingestRawContext({source:"clipboard",text:t,appPackage:q.value});n&&(_.value=n)}});const j=it();if(j.status==="ok"&&j.text&&j.source){const e=M.ingestRawContext({source:j.source,text:j.text,senderName:j.senderName,appPackage:j.appPackage,timestamp:j.timestamp});e&&(_.value=e)}function Ce(e){if(b("heavy"),e.source==="screenshot"&&e.uri){const n=at(e.uri),o=M.ingestScreenBlocks(n.blocks,"screenshot",{appPackage:n.appPackage??e.appPackage,uri:e.uri});if(!o){_.value=null,J("Screenshot looked blank/protected — type what they said:");return}L.value=M.resolveSuggestions(o),_.value=null,T.value=!1,g.value="nextmove";return}L.value=M.resolveSuggestions(e),_.value=null,T.value=!1,g.value="nextmove",new Oe().generateOnlineSuggestions(e.partnerText).then(n=>{var o;((o=L.value)==null?void 0:o.context.id)===e.id&&n.length>=3&&(L.value={...L.value,suggestions:n})}).catch(()=>{})}function Se(){b("click");const e=_e();if(e.status==="ok"&&e.blocks.length>0){const t=M.ingestScreenBlocks(e.blocks,"accessibility",{appPackage:e.appPackage??q.value});if(t){L.value=M.resolveSuggestions(t),T.value=!1,g.value="nextmove";return}}if(e.status==="not_enabled"){F.value=!0,J("Scanner off — type what they said, or tap Enable Scanner ⚙");return}F.value=!1,J("Screen protected (FLAG_SECURE) — type a quick summary here:")}function J(e){G.value=e??null,T.value=!0,g.value="qwerty"}function Dt(){b("click"),T.value?(T.value=!1,G.value=null,F.value=!1):(F.value=!1,J())}function $e(){b("heavy");const e=z.value.trim(),t=M.ingestRawContext({source:"manual",text:e||"start playful conversation",appPackage:q.value});t&&(L.value=M.resolveSuggestions(t),T.value=!1,G.value=null,F.value=!1,g.value="nextmove")}function Lt(e){b("heavy"),M.recordCommittedReply(e),K(e),P.value=e,z.value="",g.value="qwerty"}function It(e){const t=M.ingestRawContext({source:"manual",text:e,appPackage:q.value});t&&(t.source="clipboard",L.value=M.resolveSuggestions(t),g.value="nextmove")}function xe(e){if(b("light"),T.value){z.value+=e;return}if(e===" "||e==="."||e===","||e==="!"||e==="?"){const t=P.value.match(/([a-zA-Z']+)$/);if(t){const n=t[1],o=oe.autocorrect(n);if(o&&o!==n){for(let r=0;r<n.length;r++)X();P.value=P.value.slice(0,-n.length)+o+e,K(o+e);return}else oe.learnWord(n)}}P.value+=e,K(e)}function Te(){if(b("light"),T.value){z.value.length>0&&(z.value=z.value.slice(0,-1));return}P.value.length>0&&(P.value=P.value.slice(0,-1)),X()}function jt(e){if(b("click"),T.value){const o=z.value,r=o.trim().split(/\s+/),a=o.endsWith(" ")?o:r.length>1?r.slice(0,-1).join(" ")+" ":"";z.value=`${a}${e} `;return}const t=P.value,n=t.trim().split(/\s+/);if(!t.endsWith(" ")&&n.length>0){const o=n[n.length-1];for(let r=0;r<o.length;r++)X()}K(e+" "),P.value=(t.endsWith(" ")?t:n.length>1?n.slice(0,-1).join(" ")+" ":"")+e+" "}function Wt(){b("heavy"),De.value=Ct(P.value),g.value="roast"}function Ft(e){b("click");for(let t=0;t<P.value.length;t++)X();M.recordCommittedReply(e),K(e),P.value=e,g.value="qwerty"}function qt(){return d`
    <div class="rizz-app" data-theme=${()=>Q.value} data-one-handed=${()=>ee.value}>
      ${St({activeContext:_,stealthMode:T,onOpenContextReplies:()=>{_.value&&Ce(_.value)},onScanScreen:Se,onToggleStealth:Dt,onToggleRoast:()=>{g.value==="roast"?g.value="qwerty":Wt()},onToggleClipboard:()=>g.value=g.value==="clipboard"?"qwerty":"clipboard",onToggleEmojis:()=>g.value=g.value==="emojis"?"qwerty":"emojis",onVoiceInput:()=>{b("click"),st()},onSwitchKeyboard:()=>{b("click"),lt()},onToggleTextEdit:()=>g.value=g.value==="textedit"?"qwerty":"textedit",onToggleHelp:()=>g.value=g.value==="help"?"qwerty":"help",onCycleTheme:()=>{b("click");const e=Q.value==="slate"?"amoled":Q.value==="amoled"?"light":"slate";Q.value=e;try{localStorage.setItem("rizzboard_theme",e)}catch{}},onToggleOneHanded:()=>{b("click");const e=ee.value==="off"?"right":ee.value==="right"?"left":"off";ee.value=e;try{localStorage.setItem("rizzboard_one_handed",e)}catch{}},onToggleNumberRow:()=>{b("click");const e=!ae.value;ae.value=e;try{localStorage.setItem("rizzboard_number_row",String(e))}catch{}}})}

      ${()=>T.value?$t({buffer:z,hint:G,showEnableScanner:F,onGenerate:$e,onEnableScanner:()=>Re("accessibility"),onCancel:()=>{T.value=!1,G.value=null,F.value=!1}}):""}

      ${xt({suggestions:zt,onSelectSuggestion:jt})}

      ${()=>{const e=g.value;return e==="nextmove"?_t({resolution:L,onSelectReply:Lt,onSwitchToStealth:()=>{var t;z.value=((t=L.value)==null?void 0:t.context.partnerText)??"",J()},onClose:()=>g.value="qwerty"}):e==="emojis"?At({onSelectEmoji:xe,onClose:()=>g.value="qwerty"}):e==="clipboard"?Mt({history:H,onSelectClip:t=>{M.recordCommittedReply(t),K(t),g.value="qwerty"},onAnalyzeClip:t=>{b("heavy"),It(t)},onDeleteClip:t=>{b("light"),H.value=H.value.filter(n=>n!==t)},onClearAll:()=>{b("click"),H.value=[]},onClose:()=>g.value="qwerty"}):e==="roast"?Et({roast:De,onApplyUpgrade:Ft,onClose:()=>g.value="qwerty"}):e==="textedit"?Rt({onBackspace:Te,onClose:()=>g.value="qwerty"}):e==="help"?Ot({onClose:()=>g.value="qwerty"}):Pt({stealthMode:T,showNumberRow:ae,onKeyPress:xe,onBackspace:Te,onSend:()=>{T.value?$e():(b("heavy"),rt())},onOpenEmojis:()=>g.value="emojis",onMoveCursor:t=>{b("light"),ct(t)},onDeleteWord:()=>{b("heavy");const t=P.value.match(/(\S+\s*)$/),n=t?t[1].length:1;P.value=P.value.slice(0,-n);for(let o=0;o<n;o++)X()},onSwipeUpSpace:()=>{b("click"),_.value?Ce(_.value):Se()}})}}
    </div>
  `}const Pe=document.getElementById("app");if(Pe){const{fragment:e}=ce(qt());Pe.appendChild(e)}
