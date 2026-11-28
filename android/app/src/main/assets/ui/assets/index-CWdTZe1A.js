var Ne=Object.defineProperty;var Ae=(t,e,n)=>e in t?Ne(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var N=(t,e,n)=>Ae(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();let ee=null;const J=new Set;let K=!1;function ve(){return ee}function G(t){const e=ee;return ee=t,e}function we(t){t.isStale=!0,K?J.add(t):t.execute()}function Ee(t){const e=K;K=!0;try{return t()}finally{K=e,K||Be()}}function Be(){for(;J.size>0;){const t=Array.from(J);J.clear();for(const e of t)e.isStale&&e.execute()}}class Re{constructor(e){N(this,"_value");N(this,"_subscribers",new Set);this._value=e}get value(){const e=ve();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}set value(e){Object.is(this._value,e)||(this._value=e,this.notify())}peek(){return this._value}notify(){const e=Array.from(this._subscribers);for(const n of e)we(n)}_unsubscribe(e){this._subscribers.delete(e)}}function S(t){return new Re(t)}class Oe{constructor(e){N(this,"_value");N(this,"_node");N(this,"_subscribers",new Set);N(this,"_isDirty",!0);N(this,"_fn");this._fn=e,this._node={dependencies:new Set,isStale:!0,execute:()=>{if(!this._isDirty){this._isDirty=!0;const n=Array.from(this._subscribers);for(const o of n)we(o)}}}}get value(){this._isDirty&&this._recompute();const e=ve();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}peek(){return this._isDirty&&this._recompute(),this._value}_unsubscribe(e){this._subscribers.delete(e)}_recompute(){for(const n of this._node.dependencies)n._unsubscribe(this._node);this._node.dependencies.clear();const e=G(this._node);try{this._value=this._fn(),this._isDirty=!1,this._node.isStale=!1}finally{G(e)}}}function ke(t){return new Oe(t)}let _e=null;function De(){return _e}function te(t){let e;const n={dependencies:new Set,isStale:!1,execute:()=>{for(const i of n.dependencies)i._unsubscribe(n);if(n.dependencies.clear(),typeof e=="function")try{e()}catch(i){console.error("[Nova Signal Effect Cleanup Error]:",i)}const a=G(n);try{e=t()}finally{G(a),n.isStale=!1}}};n.execute();const o=()=>{for(const a of n.dependencies)a._unsubscribe(n);n.dependencies.clear(),typeof e=="function"&&e()},r=De();return r&&r.addCleanup(o),o}function Ce(){return typeof window<"u"&&"Part"in window&&"ChildNodePart"in window&&typeof window.getParts=="function"}class se{constructor(e){N(this,"parentNode");N(this,"previousSibling");N(this,"nextSibling");N(this,"value");N(this,"_currentNode");const n=e.parentNode;if(!n)throw new Error("[Zuari DOM Parts]: Placeholder node must have a parent container.");this.parentNode=n,this.previousSibling=e.previousSibling,this.nextSibling=e.nextSibling;const o=document.createTextNode("");n.replaceChild(o,e),this._currentNode=o}setValue(e){if(this.value=e,e instanceof DocumentFragment){const n=document.createTextNode("");this.parentNode.replaceChild(n,this._currentNode),this.parentNode.insertBefore(e,n),this._currentNode=n;return}if(e instanceof Node){this._currentNode!==e&&(this.parentNode.replaceChild(e,this._currentNode),this._currentNode=e);return}if(this._currentNode instanceof Text)this._currentNode.data=String(e??"");else{const n=document.createTextNode(String(e??""));this.parentNode.replaceChild(n,this._currentNode),this._currentNode=n}}disconnect(){}}class ce{constructor(e,n){N(this,"element");N(this,"attributeName");N(this,"value");this.element=e,this.attributeName=n}setValue(e){this.value=e,e===!1||e===null||e===void 0?this.element.removeAttribute(this.attributeName):this.element.setAttribute(this.attributeName,String(e))}disconnect(){this.element.removeAttribute(this.attributeName)}}function Me(t){if(Ce())try{const e=window.ChildNodePart;return new e(t)}catch{return new se(t)}return new se(t)}function Le(t,e){if(Ce())try{const n=window.AttributePart;return new n(t,e)}catch{return new ce(t,e)}return new ce(t,e)}function je(t,e,n,o){const r=Ie(t,`<!--zuari-hole-${e}-->`);if(r){const p=Me(r);if(le(n)){const l=te(()=>p.setValue(ue(n)));o.push(()=>{var d;l(),(d=p.disconnect)==null||d.call(p)})}else p.setValue(n);return}const a=`data-zuari-attr-${e}`,i=We(t,a);if(!i)return;const{element:c,attrName:u}=i;if(u.startsWith("@")||u.startsWith("on")){const p=(u.startsWith("@")?u.slice(1):u.slice(2)).toLowerCase();if(c.removeAttribute(u),typeof n!="function")return;const l=n;c.addEventListener(p,l),o.push(()=>c.removeEventListener(p,l));return}const h=Le(c,u);if(le(n)){const p=te(()=>h.setValue(ue(n)));o.push(()=>{var l;p(),(l=h.disconnect)==null||l.call(h)})}else h.setValue(n)}function le(t){return typeof t=="object"&&t!==null&&"value"in t||typeof t=="function"}function ue(t){return typeof t=="object"&&t!==null&&"value"in t?t.value:typeof t=="function"?t():t}function Ie(t,e){const n=document.createNodeIterator(t,NodeFilter.SHOW_COMMENT);let o=n.nextNode();for(;o;){if(`<!--${o.data}-->`===e)return o;o=n.nextNode()}return null}function We(t,e){const n=document.createNodeIterator(t,NodeFilter.SHOW_ELEMENT);let o=n.nextNode();for(;o;){for(const r of Array.from(o.attributes))if(r.value.includes(e))return{element:o,attrName:r.name};o=n.nextNode()}return null}const de=new Map,Fe="<!--zuari-hole-",ze="-->",qe="data-zuari-attr-";function f(t,...e){return{strings:t,values:e}}function oe(t,e){const{strings:n,values:o}=t,r=n.join("<!--?-->");let a=de.get(r);a||(a=document.createElement("template"),a.innerHTML=n.reduce((h,p,l)=>{if(l>=o.length)return h+p;const s=/=["']?[^"'>]*$/.test(p)?`"${qe}${l}"`:`${Fe}${l}${ze}`;return h+p+s},""),de.set(r,a));const i=a.content.cloneNode(!0),c=Array.from(i.childNodes),u=[];return o.forEach((h,p)=>je(i,p,h,u)),{fragment:i,destroy(){u.forEach(h=>h()),c.forEach(h=>{var p;return(p=h.parentNode)==null?void 0:p.removeChild(h)})}}}const Ke={primary:"#006A6A",onPrimary:"#FFFFFF",primaryContainer:"#6FF7F6",onPrimaryContainer:"#002020",secondary:"#4A6363",onSecondary:"#FFFFFF",background:"#FAFDFD",onBackground:"#191C1C",surface:"#FAFDFD",onSurface:"#191C1C",surfaceVariant:"#DAE5E4",outline:"#6F7979"},Ze={primary:"#4CDADA",onPrimary:"#003737",primaryContainer:"#004F4F",onPrimaryContainer:"#6FF7F6",secondary:"#B1CCCC",onSecondary:"#1C3534",background:"#191C1C",onBackground:"#E1E3E3",surface:"#191C1C",onSurface:"#E1E3E3",surfaceVariant:"#3F4948",outline:"#899392"};function Ve(t=!1){const e=S(t),n=S(t?{...Ze}:{...Ke}),o=ke(()=>!!(typeof navigator<"u"&&/android/i.test(navigator.userAgent)||typeof window<"u"&&window.Android)),r=new Map;typeof window<"u"&&(window.__zuariKotlinDispatcher=(l,d)=>{const s=r.get(l);if(s)try{const m=JSON.parse(d);s(m)}catch{s(d)}});function a(l,...d){return new Promise((s,m)=>{if(typeof window<"u"&&window.Android){const P=window.Android;if(typeof P[l]=="function")try{const g=P[l](...d);try{s(JSON.parse(g))}catch{s(g)}return}catch(g){m(g);return}}s({success:!0,mock:!0,function:l,args:d})})}function i(l,d){return r.set(l,d),()=>{r.delete(l)}}function c(l){Ee(()=>{n.value={...n.value,...l}})}function u(l){const d=(l==null?void 0:l.packageName)??"com.zuari.ui.theme",s=(l==null?void 0:l.themeName)??"ZuariTheme",m={...n.value,...(l==null?void 0:l.colors)??{}};return`package ${d}

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
`}function h(l){const d=(l==null?void 0:l.themeName)??"Theme.Zuari.Native",s={...n.value,...(l==null?void 0:l.colors)??{}};return`<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by @zuari/kotlin Native Android Bridge -->
<resources>
    <style name="${d}" parent="Theme.Material3.DayNight.NoActionBar">
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
`}function p(l){const d=l??(typeof document<"u"?document.documentElement:null);return d?te(()=>{const s=n.value;d.style.setProperty("--md-sys-color-primary",s.primary),d.style.setProperty("--md-sys-color-on-primary",s.onPrimary),d.style.setProperty("--md-sys-color-primary-container",s.primaryContainer),d.style.setProperty("--md-sys-color-on-primary-container",s.onPrimaryContainer),d.style.setProperty("--md-sys-color-secondary",s.secondary),d.style.setProperty("--md-sys-color-on-secondary",s.onSecondary),d.style.setProperty("--md-sys-color-background",s.background),d.style.setProperty("--md-sys-color-on-background",s.onBackground),d.style.setProperty("--md-sys-color-surface",s.surface),d.style.setProperty("--md-sys-color-on-surface",s.onSurface),d.style.setProperty("--md-sys-color-surface-variant",s.surfaceVariant),d.style.setProperty("--md-sys-color-outline",s.outline)}):()=>{}}return{isAndroid:o,dynamicColors:n,isDarkTheme:e,callNativeFunction:a,registerNativeCallback:i,generateComposeThemeCode:u,generateXmlThemeCode:h,ingestDynamicPalette:c,applyToCssVariables:p}}const Y=Ve(!0);function R(){return typeof window<"u"&&window.Android?window.Android:null}function z(t){const e=R();e?e.commitText(t):console.log("[Dev Mock Commit]:",t)}function Q(){const t=R();t?t.deleteBackward():console.log("[Dev Mock Delete]")}function He(){const t=R();t?t.sendEnter():console.log("[Dev Mock Enter]")}function k(t="click"){const e=R();e&&typeof e.triggerHaptic=="function"&&e.triggerHaptic(t)}function Ue(t){const e=R();if(e&&typeof e.requestScreenshotAnalysis=="function")try{const n=e.requestScreenshotAnalysis(t);return JSON.parse(n)}catch{return{status:"error",blocks:[]}}return{status:"ok",blocks:[{text:"Are you free for drinks this weekend?",x:48,y:420,width:320,screenWidth:1080}]}}function Se(){const t=R();if(t&&typeof t.requestScreenScan=="function")try{const e=t.requestScreenScan();return JSON.parse(e)}catch{return{status:"error",blocks:[]}}return{status:"ok",appPackage:"com.snapchat.android",blocks:[{text:"What is your biggest red flag?",x:52,y:460,width:300,screenWidth:1080}]}}function Je(){const t=R();if(t&&typeof t.getActiveContext=="function")try{return JSON.parse(t.getActiveContext())}catch{return{status:"none"}}return{status:"none"}}function Ge(t){const e=R();e&&typeof e.openSystemSetting=="function"?e.openSystemSetting(t):console.log("[Dev Mock Open Setting]:",t)}function Xe(){const t=R();t&&typeof t.startVoiceTyping=="function"?t.startVoiceTyping():console.log("[Dev Mock Voice Typing]")}function Ye(){const t=R();t&&typeof t.showInputMethodPicker=="function"?t.showInputMethodPicker():console.log("[Dev Mock IME Picker]")}function Qe(t){const e=R();e&&typeof e.moveCursor=="function"&&e.moveCursor(t)}function et(t){const e=R();e&&typeof e.performEditAction=="function"&&e.performEditAction(t)}function tt(t){const e=R();e&&typeof e.sendDpad=="function"&&e.sendDpad(t)}function fe(t,e){return`You are an elite wingman who excels at playful, concise, charismatic banter.
Your task: Suggest 3 distinct next moves for a dating app conversation.
Strict rules:
1. MAX 12 words per line.
2. NO cheesy cliché compliments like "Hey cutie" or "You must be tired from running through my mind".
3. Use witty banter, slight teasing, or confident playful framing.
4. Output MUST be valid JSON array with keys: "vibe" (Smooth | Tease | Bold) and "line" (string).

Partner said: "${t}"
${e?`Context I said previously: "${e}"`:""}

Respond ONLY with the JSON array:`}function nt(t){return`You are a charisma coach. Rewrite this bland text message into 3 sharper, confident, flirty versions.
Max 12 words each.
Bland text: "${t}"

Output ONLY a JSON array with objects: [{"vibe": "Smooth", "line": "..."}, {"vibe": "Tease", "line": "..."}, {"vibe": "Bold", "line": "..."}]`}const he={"com.snapchat.android":"Snapchat","org.telegram.messenger":"Telegram","org.thoughtcrime.securesms":"Signal","co.hinge.app":"Hinge","com.bumble.app":"Bumble","com.tinder":"Tinder","com.instagram.android":"Instagram","com.whatsapp":"WhatsApp","web.whatsapp.com":"WhatsApp Web","instagram.com":"Instagram DM","web.telegram.org":"Telegram Web","tinder.com":"Tinder Web","bumble.com":"Bumble Web","discord.com":"Discord","x.com":"X DM"};function $e(t){if(!t)return;const e=t.replace(/^www\./i,"");if(he[e])return he[e];const n=e.split("."),o=n[n.length-1];if(!o||["android","app","messenger","com","org","io"].includes(o)){const r=n[n.length-2];return r?r.charAt(0).toUpperCase()+r.slice(1):void 0}return o.charAt(0).toUpperCase()+o.slice(1)}function ot(t){const e=$e(t.appPackage);switch(t.source){case"screenshot":return"📸 Screenshot";case"notification":return e?`🔔 ${e} Msg`:"🔔 Incoming Msg";case"clipboard":return"📋 Copied Bubble";case"accessibility":return e?`👁️ ${e} Scan`:"👁️ Screen Scan";case"selection":return"✨ Selected Text";case"dom":return e?`🌐 ${e} Chat`:"🌐 Web Chat";case"manual":return"💬 Stealth Context"}}function rt(t){const e=t.partnerText.length>26?`${t.partnerText.slice(0,26).trim()}…`:t.partnerText;switch(t.source){case"screenshot":return"📸 Screenshot Detected: Analyze Next Move";case"notification":{const n=$e(t.appPackage);return n?`🔔 ${n}: "${e}" — Reply`:`🔔 New Msg: "${e}" — Reply`}case"clipboard":return`📋 Copied: "${e}" — Reply`;case"accessibility":case"dom":return`👁️ Scanned: "${e}" — Reply`;case"selection":return`✨ Selected: "${e}" — Reply`;case"manual":return"💬 Context Ready — View Replies"}}class at{constructor(){this.recentSelfCommits=new Set}recordSelfCommit(e){const n=this.normalize(e);if(n&&(this.recentSelfCommits.add(n),this.recentSelfCommits.size>25)){const o=this.recentSelfCommits.values().next().value;o&&this.recentSelfCommits.delete(o)}}isIgnored(e,n){const o=e.trim();if(!o)return!0;if(n==="manual"||n==="selection")return!1;const r=this.normalize(o);return!!(this.recentSelfCommits.has(r)||/^https?:\/\/\S+$/i.test(o)||/^\d{4,8}$/.test(o))}normalize(e){return e.toLowerCase().replace(/\s+/g," ").trim()}}function it(t){const e={rawBlocks:t.map(o=>o.text)};if(t.length===0)return e;const n=t.filter(o=>{const r=o.y<120,a=o.y>o.screenWidth*1.8;return!r&&!a});n.sort((o,r)=>o.y-r.y);for(let o=n.length-1;o>=0;o--){const r=n[o],a=r.x+r.width/2>r.screenWidth/2;if(!a&&!e.senderText?e.senderText=r.text:a&&!e.myLastText&&(e.myLastText=r.text),e.senderText&&e.myLastText)break}return e}const st=[{id:"op-1",category:"opener",vibe:"playful",triggerKeywords:["travel","hiking","nature"],template:"Are you as adventurous as your profile says, or do you also get lost in grocery stores?"},{id:"op-2",category:"opener",vibe:"smooth",triggerKeywords:["smile","eyes","cute"],template:"I was going to wait two days to message you, but patience was never my strong suit."},{id:"op-3",category:"opener",vibe:"witty",triggerKeywords:["food","coffee","cooking"],template:"Important question: what is your most controversial culinary opinion?"},{id:"bt-1",category:"banter",vibe:"playful",triggerKeywords:["trouble","sarcasm","bad"],template:"Are you always this much trouble or did I catch you on a good day?"},{id:"bt-2",category:"banter",vibe:"witty",triggerKeywords:["challenge","bet","win"],template:"Careful, high expectations are my only weakness."},{id:"bt-3",category:"banter",vibe:"bold",triggerKeywords:["rules","late","fast"],template:"I would say you are five minutes away from being my favorite person."},{id:"wp-1",category:"wordplay",vibe:"witty",triggerKeywords:["smart","books","study","work"],template:"Are you an overdue library book? Because you have fine written all over you."},{id:"wp-2",category:"wordplay",vibe:"smooth",triggerKeywords:["music","song","playlist"],template:"If our conversation was a playlist, I would have it on repeat."},{id:"cl-1",category:"closer",vibe:"bold",triggerKeywords:["drinks","date","weekend","meet","free","tonight"],template:"Drinks this Thursday. You pick the spot, I will bring the conversation."},{id:"cl-2",category:"closer",vibe:"smooth",triggerKeywords:["coffee","tea","afternoon","sunday","morning"],template:"Let us see if you are as fun in person. Coffee tomorrow?"},{id:"rf-1",category:"banter",vibe:"playful",triggerKeywords:["red flag","toxic","flaw","worst"],template:"My biggest red flag is thinking I can win every staring contest."},{id:"sn-1",category:"banter",vibe:"bold",triggerKeywords:["snap","streak","vanish","secret","disappear"],template:"Disappearing messages just mean we have to make every line count."},{id:"wy-1",category:"banter",vibe:"witty",triggerKeywords:["wyd","doing","bored","up to","plans"],template:"Plotting my next move, and you just walked right into it."},{id:"pt-1",category:"opener",vibe:"playful",triggerKeywords:["dog","puppy","cat","pet","gym","workout"],template:"Be honest: am I competing with your pet for attention, or do I stand a chance?"}];function ct(t,e=3){const n=t.toLowerCase();if(!n.trim())return[];const o=st.map(r=>{let a=0;for(const i of r.triggerKeywords)n.includes(i)&&(a+=2);return{entry:r,score:a}}).filter(r=>r.score>0);return o.sort((r,a)=>a.score-r.score),o.slice(0,e).map(r=>r.entry)}function lt(t){const e=new Set(["the","and","for","are","you","that","this","with","have","what","when","where","why","how","just","like","really","very","about","from","they","them","your","mine","been","were","was","will","would","could","should","going","doing","want","need","know","think","today","tonight","tomorrow","lol","haha","lmao","yeah","yep","nope","okay","hey","hii","hello"]),n=t.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(o=>o.length>=4&&!e.has(o));return n.length>0?n[n.length-1]:null}class ut{generateOfflineSuggestions(e,n){const o=e.trim(),r=o.toLowerCase(),a=ct(o,3),i={};for(const g of a)g.vibe==="smooth"&&!i.Smooth?i.Smooth=g.template:(g.vibe==="playful"||g.vibe==="witty")&&!i.Tease?i.Tease=g.template:g.vibe==="bold"&&!i.Bold&&(i.Bold=g.template);for(const g of a)!i.Smooth&&g.template!==i.Tease&&g.template!==i.Bold?i.Smooth=g.template:!i.Tease&&g.template!==i.Smooth&&g.template!==i.Bold?i.Tease=g.template:!i.Bold&&g.template!==i.Smooth&&g.template!==i.Tease&&(i.Bold=g.template);const c=lt(o),u=o.includes("?")||/^(what|why|how|where|when|who|are|do|did|would|can|wanna)\b/i.test(o),h=o.length>0&&o.split(/\s+/).length<=2&&!u,p=/^(hey|hi|hello|yo|sup|heyy+|hii+|gm|good morning)\b/i.test(r),l=/\b(sorry|my bad|apologize|late|missed)\b/i.test(r),d=/\b(cute|hot|pretty|handsome|smart|funny|sweet|love your|like your)\b/i.test(r);let s,m,P;return p?(s="Was literally just thinking about texting you—great timing.",m="Look who finally decided to grace my notifications.",P="Hey—skipping the small talk, how is your week looking?"):l?(s="All good, life happens. Just glad you are here now.",m="You owe me a coffee for the suspense, then we are even.",P="Apology accepted—make it up to me this weekend?"):d?(s="Careful, keep talking like that and I might actually blush.",m="Flattery will get you everywhere—what else you got?",P="Say that again in person over drinks."):u&&c?(s=`Honestly, ${c} is a whole story—I will tell you the good part.`,m=`Depends—are you asking about ${c} out of curiosity or research?`,P=`Better ${c} story in person. Are you free Thursday?`):u?(s="Careful, the honest answer might make you like me more.",m="I plead the fifth—unless you are buying the first round.",P="Better story in person. When are we hanging out?"):h?(s="A person of few words—good thing I speak fluent mystery.",m="Do not hurt your thumbs typing a whole novel over there.",P="Tell me what you are actually up to right now."):c?(s=`Okay, ${c} actually sounds like my kind of vibe.`,m=`Wait, you cannot just drop "${c}" and not elaborate.`,P=`We definitely need to talk more about ${c}—coffee this week?`):r.includes("haha")||r.includes("lol")||r.includes("lmao")?(s="Making you laugh this early is dangerous for both of us.",m="Glad I could entertain you—my rates go up after midnight.",P="Wait until you hear my actual voice—call later?"):(s="I was going to play it cool, but you made that impossible.",m="Are you always this much trouble or is today special?",P="Skip the small talk: what is your go-to spot for drinks?"),[{vibe:"Smooth",line:i.Smooth??s},{vibe:"Tease",line:i.Tease??m},{vibe:"Bold",line:i.Bold??P}]}async generateOnlineSuggestions(e,n){var i,c,u;const o=this.generateOfflineSuggestions(e,n);if(typeof fetch!="function")return o;const r=new AbortController,a=setTimeout(()=>r.abort(),4e3);try{const h=`${fe(e,n)}
Return ONLY a JSON array of 3 objects: [{"vibe":"Smooth","line":"..."},{"vibe":"Tease","line":"..."},{"vibe":"Bold","line":"..."}]`,p=await fetch("https://text.pollinations.ai/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:"You are a concise, witty dating/chat assistant. Reply ONLY with valid JSON."},{role:"user",content:h}],model:"openai"}),signal:r.signal});if(clearTimeout(a),!p.ok)return o;const d=(await p.text()).match(/\[[\s\S]*\]/);if(!d)return o;const s=JSON.parse(d[0]);return!Array.isArray(s)||s.length<3?o:[{vibe:"Smooth",line:String(((i=s[0])==null?void 0:i.line)||o[0].line)},{vibe:"Tease",line:String(((c=s[1])==null?void 0:c.line)||o[1].line)},{vibe:"Bold",line:String(((u=s[2])==null?void 0:u.line)||o[2].line)}]}catch{return clearTimeout(a),o}}getPromptForChat(e,n){return fe(e,n)}getPromptForRewrite(e){return nt(e)}}class dt{constructor(){this.engine=new ut,this.filter=new at,this.lastProcessedSignature=""}recordCommittedReply(e){this.filter.recordSelfCommit(e)}isIgnoredNoiseOrSelf(e,n){return this.filter.isIgnored(e,n)}ingestRawContext(e){var a,i;const n=e.text.replace(/\s+/g," ").trim();if(this.filter.isIgnored(n,e.source))return null;const o=`${e.source}:${e.appPackage??""}:${this.filter.normalize(n)}`;if(e.source!=="manual"&&e.source!=="selection"&&o===this.lastProcessedSignature)return null;this.lastProcessedSignature=o;const r=e.timestamp??Date.now();return{id:`${e.source}-${r}`,source:e.source,partnerText:n,myLastText:((a=e.myLastText)==null?void 0:a.trim())||void 0,senderName:((i=e.senderName)==null?void 0:i.trim())||void 0,appPackage:e.appPackage,uri:e.uri,timestamp:r}}ingestScreenBlocks(e,n,o){var i;if(!e||e.length===0)return null;const r=it(e),a=r.senderText??r.rawBlocks.find(c=>!this.filter.isIgnored(c,n));return a?{id:`${n}-${(o==null?void 0:o.timestamp)??Date.now()}`,source:n,partnerText:a.trim(),myLastText:(i=r.myLastText)==null?void 0:i.trim(),appPackage:o==null?void 0:o.appPackage,uri:o==null?void 0:o.uri,timestamp:(o==null?void 0:o.timestamp)??Date.now()}:null}resolveSuggestions(e){const n=this.engine.generateOfflineSuggestions(e.partnerText,e.myLastText);return{context:e,suggestions:n}}}const me={i:"I",im:"I'm",ive:"I've",ill:"I'll",id:"I'd",dont:"don't",cant:"can't",wont:"won't",didnt:"didn't",doesnt:"doesn't",isnt:"isn't",arent:"aren't",wasnt:"wasn't",werent:"weren't",havent:"haven't",hasnt:"hasn't",hadnt:"hadn't",wouldnt:"wouldn't",couldnt:"couldn't",shouldnt:"shouldn't",youre:"you're",youve:"you've",youll:"you'll",theyre:"they're",thats:"that's",whats:"what's",heres:"here's",theres:"there's",wheres:"where's",lets:"let's",teh:"the",hte:"the",adn:"and",nad:"and",taht:"that",waht:"what",whta:"what",hwat:"what",wiht:"with",wtih:"with",jsut:"just",jstu:"just",liek:"like",lke:"like",realy:"really",relly:"really",definately:"definitely",definetly:"definitely",seperate:"separate",recieve:"receive",occured:"occurred",untill:"until",tommorow:"tomorrow",tomorow:"tomorrow",tonite:"tonight",becuase:"because",beacuse:"because",freind:"friend",frend:"friend",prolly:"probably",probly:"probably",thx:"thanks",ty:"thank you",pls:"please",plz:"please",sry:"sorry",srry:"sorry",msg:"message",bday:"birthday",wknd:"weekend",tmrw:"tomorrow"};class ft{constructor(){this.root={children:new Map,isWord:!1,frequency:0},this.bigrams=new Map,this.dictionaryWords=new Set,this.personalWords=new Set,this.seedCommonVocabulary()}insert(e,n=1){let o=this.root;const r=e.toLowerCase();for(const a of r)o.children.has(a)||o.children.set(a,{children:new Map,isWord:!1,frequency:0}),o=o.children.get(a);o.isWord=!0,o.frequency+=n,this.dictionaryWords.add(r)}learnWord(e){const n=e.trim().replace(/[^a-zA-Z']/g,"");n.length<2||(this.insert(n,25),this.personalWords.add(n.toLowerCase()))}getPersonalDictionary(){return Array.from(this.personalWords).sort()}hasWord(e){return this.dictionaryWords.has(e.toLowerCase())}autocorrect(e){const n=e.trim();if(!n||n.length<1)return null;const o=n.toLowerCase();if(me[o]){const i=me[o];return n[0]===n[0].toUpperCase()&&i[0]!==i[0].toUpperCase()?i[0].toUpperCase()+i.slice(1):i}if(this.dictionaryWords.has(o)||o.length<3)return null;let r=null,a=0;for(const i of this.dictionaryWords)if(!(Math.abs(i.length-o.length)>1)&&this.levenshtein(o,i)===1){const c=this.getWordFrequency(i);c>a&&(a=c,r=i)}return r?n[0]===n[0].toUpperCase()?r[0].toUpperCase()+r.slice(1):r:null}getWordFrequency(e){let n=this.root;for(const o of e.toLowerCase()){const r=n.children.get(o);if(!r)return 0;n=r}return n.isWord?n.frequency:0}levenshtein(e,n){const o=e.length,r=n.length,a=Array.from({length:r+1},(i,c)=>c);for(let i=1;i<=o;i++){let c=a[0];a[0]=i;for(let u=1;u<=r;u++){const h=a[u];e[i-1]===n[u-1]?a[u]=c:a[u]=1+Math.min(c,a[u],a[u-1]),c=h}}return a[r]}addBigram(e,n){const o=e.toLowerCase(),r=n.toLowerCase();let a=this.bigrams.get(o);a||(a=[],this.bigrams.set(o,a));const i=a.find(c=>c.word===r);i?i.count++:a.push({word:r,count:1}),a.sort((c,u)=>u.count-c.count)}completePrefix(e,n=3){if(!e)return[];let o=this.root;const r=e.toLowerCase();for(const i of r){if(!o.children.has(i))return[];o=o.children.get(i)}const a=[];return this.collectWords(o,r,a),a.sort((i,c)=>c.frequency-i.frequency),a.slice(0,n).map(i=>i.word)}predictNextWord(e,n=3){if(!e)return["the","you","I"];const o=e.toLowerCase(),r=this.bigrams.get(o);return r&&r.length>0?r.slice(0,n).map(a=>a.word):["and","to","you"]}collectWords(e,n,o){e.isWord&&o.push({word:n,frequency:e.frequency});for(const[r,a]of e.children.entries())this.collectWords(a,n+r,o)}seedCommonVocabulary(){const e=[["the",200],["be",180],["to",180],["of",175],["and",175],["a",170],["in",165],["that",160],["have",155],["it",155],["for",150],["not",145],["on",145],["with",140],["he",135],["as",135],["you",190],["do",130],["at",130],["this",130],["but",125],["his",120],["by",120],["from",120],["they",120],["we",125],["say",115],["her",115],["she",115],["or",115],["an",115],["will",120],["my",130],["one",115],["all",115],["would",115],["there",115],["their",110],["what",140],["so",125],["up",110],["out",110],["if",115],["about",120],["who",110],["get",115],["which",105],["go",115],["me",125],["when",120],["make",110],["can",125],["like",130],["time",115],["no",115],["just",125],["him",105],["know",120],["take",105],["people",100],["into",100],["year",95],["your",130],["good",125],["some",105],["could",105],["them",105],["see",115],["other",100],["than",100],["then",105],["now",115],["look",105],["only",105],["come",105],["its",100],["over",100],["think",110],["also",100],["back",105],["after",100],["use",100],["two",95],["how",135],["our",105],["work",105],["first",100],["well",110],["way",105],["even",100],["new",100],["want",115],["because",105],["any",100],["these",95],["give",95],["day",105],["most",95],["us",100],["are",150],["was",130],["were",110],["been",105],["has",110],["had",110],["free",110],["tonight",105],["tomorrow",100],["weekend",110],["coffee",95],["drinks",95],["dinner",95],["lunch",90],["plans",95],["sounds",105],["love",120],["talking",90],["where",115],["why",110],["going",115],["great",115],["amazing",95],["awesome",95],["cool",100],["nice",105],["sorry",100],["thanks",105],["please",105],["maybe",95],["definitely",90],["probably",90],["actually",95],["really",115],["very",110],["morning",95],["night",105],["today",105],["soon",95],["later",95],["ready",90],["busy",90],["happy",95],["excited",90],["miss",95],["wait",95],["meet",95]];for(const[o,r]of e)this.insert(o,r);const n=[["how","are"],["how","is"],["how","was"],["are","you"],["are","we"],["are","they"],["you","free"],["you","doing"],["you","up"],["what","are"],["what","is"],["what","do"],["want","to"],["going","to"],["have","to"],["good","morning"],["good","night"],["good","idea"],["sounds","good"],["sounds","great"],["sounds","fun"],["see","you"],["talk","to"],["let","me"],["on","my"],["my","way"],["this","weekend"]];for(const[o,r]of n)this.addBigram(o,r)}}function ht(t){const e=t.trim(),n=e.toLowerCase();return e?/^(hey|hi|hello|sup|yo|wyd|what'?s up)$/i.test(e)?{score:2,verdict:"Dry",feedback:"Low effort opener. High ghosting probability (~90%).",improved:"Important question: what is your most controversial food opinion?"}:n.includes("how are you")||n.includes("how was your day")?{score:4,verdict:"Safe",feedback:"Polite but sounds like an HR interview.",improved:"Tell me your day was more exciting than grocery shopping."}:n.includes("cutie")||n.includes("beautiful")||n.includes("gorgeous")?{score:5,verdict:"Safe",feedback:"Compliment is sweet, but every other match says the exact same thing.",improved:"I was going to play it cool, but you made that impossible."}:n.includes("trouble")||n.includes("bet")||n.includes("drinks")||n.includes("coffee")?{score:9,verdict:"Smooth",feedback:"High energy, playful intrigue. Ready to send.",improved:e}:{score:7,verdict:"Smooth",feedback:"Solid message. Could use 10% more cheekiness.",improved:`${e} — unless you scare easily.`}:{score:1,verdict:"Dry",feedback:"Empty canvas. Drop something bold.",improved:"Are we breaking records or rules tonight?"}}const q=[{name:"Smileys & Rizz",icon:"😏",emojis:["😏","😉","😎","😜","😝","😛","🥳","🤩","😍","🥰","😘","😗","😙","😚","🤗","🤭","🤫","🫠","🫡","🤔","🤨","😐","😑","😶","🙄","😬","😌","😔","😪","😴","😂","🤣","😭","😅","😆","😁","😄","😃","😀","🙂","😈","👿","🫦","💅","👀","✨","🔥","💀","🤡","🥺"]},{name:"Love & Hearts",icon:"❤️",emojis:["❤️","❤️‍🔥","❤️‍🩹","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💖","💗","💓","💞","💕","💘","💝","💟","❣️","💔","💋","💌","💍","💎","🌹","🥀","💐","🌷","🌸","🥂","🍾","🍫","🍓","🍒","🫶","🫰","💑","👩‍❤️‍👨","💏"]},{name:"Gestures & Reactions",icon:"✌️",emojis:["👍","👎","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","☝️","✋","🤚","🖐️","🖖","👋","🤝","🙏","👏","🙌","👐","🤲","✊","👊","🤛","🤜","💪","🦾","🫶","🤦‍♂️","🤦‍♀️","🤷‍♂️","🤷‍♀️","💯","🎯"]},{name:"People & Vibes",icon:"🕺",emojis:["🕺","💃","👯","🧘","🏄","🚴","🏋️","🤸","🥷","🕵️","👑","🎩","🕶️","👓","🧣","👗","👔","👟","👠","👜","🧠","🫀","👁️","👅","👄","👂","👃","🫂","🗣️","👤"]},{name:"Food & Dates",icon:"☕",emojis:["☕","🍵","🧋","🥤","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🍾","🍕","🍔","🍟","🌭","🌮","🌯","🍣","🍜","🍝","🍛","🍱","🥟","🍤","🍦","🍨","🍩","🍪","🎂","🍰","🧁","🍫","🍿","🥐","🥯","🥞","🧇","🥓","🍳"]},{name:"Activities & Travel",icon:"✈️",emojis:["✈️","🚗","🏎️","🚕","🚌","🚆","🚀","🛸","⛵","🏖️","🏝️","🏔️","🏕️","🌅","🌄","🌃","🌆","🎡","🎢","🎬","🎤","🎧","🎼","🎹","🎸","🥁","🎮","🕹️","🎲","♟️","🎳","🎯","⚽","🏀","🏈","⚾","🎾","🏐","🏆","🥇"]},{name:"Symbols & Tech",icon:"⚡",emojis:["⚡","⭐","🌟","💫","✨","💥","💢","💦","💨","💤","💬","💭","🗯️","🔔","🔕","🔒","🔓","🔑","📱","💻","⌨️","📷","📸","🎥","📺","📻","⏰","⏳","💡","🔋","✅","❌","❓","❗","‼️","⁉️","⚠️","🚫","♻️","♾️"]}];function y(t){const{fragment:e}=oe(t);if(e.childElementCount===1&&e.firstElementChild)return e.firstElementChild;const n=document.createElement("div");return n.style.display="contents",n.appendChild(e),n}function M(t,e){const n=document.createElement("div");n.className=t;for(const o of e){const{fragment:r}=oe(o);n.appendChild(r)}return n}function mt(t){return y(f`
    <div class="action-bar">
      ${()=>t.activeContext.value?y(f`
            <button class="action-pill highlight" @click=${t.onOpenContextReplies}>
              ${rt(t.activeContext.value)}
            </button>
          `):""}
      <button class="action-pill" @click=${t.onVoiceInput} title="Google Voice Typing">
        🎙️ Mic
      </button>
      <button class="action-pill" @click=${t.onScanScreen}>
        👁️ Scan
      </button>
      <button
        class=${()=>t.stealthMode.value?"action-pill active-mode":"action-pill"}
        @click=${t.onToggleStealth}>
        💬 Tell Rizz
      </button>
      <button class="action-pill" @click=${t.onToggleRoast}>
        🔥 Roast
      </button>
      <button class="action-pill" @click=${t.onToggleClipboard}>
        📋 Clipboard
      </button>
      <button class="action-pill" @click=${t.onToggleEmojis}>
        😏 Emojis
      </button>
      <button class="action-pill" @click=${t.onToggleTextEdit} title="Text Editing">
        ✂️
      </button>
      <button class="action-pill" @click=${t.onSwitchKeyboard} title="Switch Keyboard">
        🌐
      </button>
    </div>
  `)}function pt(t){return y(f`
    <div class="stealth-bar">
      <div class="stealth-top">
        <span class="stealth-badge">🛡️ STEALTH MODE · Hidden from chat</span>
        <div class="stealth-actions">
          ${()=>t.showEnableScanner.value?y(f`
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
  `)}function yt(t){return y(f`
    <div class="suggestions-shell">
      ${()=>M("suggestions-panel",t.suggestions.value.map(e=>f`
          <div class="suggestion-card" @click=${()=>t.onSelectSuggestion(e)}>
            <span class="suggestion-text">${e}</span>
          </div>
        `))}
    </div>
  `)}const gt={q:"1",w:"2",e:"3",r:"4",t:"5",y:"6",u:"7",i:"8",o:"9",p:"0",a:"@",s:"#",d:"$",f:"%",g:"&",h:"-",j:"+",k:"(",l:")",z:"*",x:'"',c:"'",v:":",b:";",n:"!",m:"?"};function bt(t){const e=S("off"),n=S("alpha"),o=["q","w","e","r","t","y","u","i","o","p"],r=["a","s","d","f","g","h","j","k","l"],a=["z","x","c","v","b","n","m"],i=["1","2","3","4","5","6","7","8","9","0"],c=["@","#","$","_","&","-","+","(",")","/"],u=["*",'"',"'",":",";","!","?"],h=["~","`","|","•","√","π","÷","×","§","Δ"],p=["£","€","¥","^","°","=","{","}","\\","©"],l=["%","®","™","✓","[","]","<",">"],d=b=>{const $=e.value!=="off"?b.toUpperCase():b;t.onKeyPress($),e.value==="once"&&(e.value="off")},s=()=>{e.value==="off"?e.value="once":e.value==="once"?e.value="caps":e.value="off"},m=(b,E)=>{const $=E?b.toUpperCase():b,C=gt[b]??"";let w=null,T=!1;const H=()=>{T=!1,C&&(w=setTimeout(()=>{T=!0,t.onKeyPress(C)},380))},U=()=>{w&&(clearTimeout(w),w=null)};return f`
      <button
        class="key-btn"
        @pointerdown=${H}
        @pointerup=${U}
        @pointerleave=${U}
        @pointercancel=${U}
        @click=${()=>{w&&(clearTimeout(w),w=null),T||d(b),T=!1}}>
        ${$}
      </button>
    `},P=()=>{let b=null,E=null,$=!1;const C=()=>{b&&(clearTimeout(b),b=null),E&&(clearInterval(E),E=null)};return f`
      <button
        class="key-btn special"
        @pointerdown=${()=>{$=!1,C(),b=setTimeout(()=>{$=!0,t.onBackspace(),E=setInterval(()=>{t.onBackspace()},55)},350)}}
        @pointerup=${C}
        @pointerleave=${C}
        @pointercancel=${C}
        @click=${()=>{C(),$||t.onBackspace(),$=!1}}>
        ⌫
      </button>
    `},g=()=>{let b=0,E=0,$=!1,C=!1;const w=W=>{b=W.clientX,E=W.clientX,$=!1,C=!0},T=W=>{if(!C||!t.onMoveCursor)return;const ae=W.clientX-E;if(Math.abs(W.clientX-b)>10&&($=!0),Math.abs(ae)>=18){const ie=Math.trunc(ae/18);t.onMoveCursor(ie),E+=ie*18}},H=()=>{C=!1};return f`
      <button
        class="key-btn space"
        @pointerdown=${w}
        @pointermove=${T}
        @pointerup=${H}
        @pointercancel=${H}
        @click=${()=>{$||t.onKeyPress(" "),$=!1}}>
        ${()=>t.stealthMode.value?"stealth space":"space"}
      </button>
    `},Te=()=>{const b=e.value!=="off",E=e.value==="caps"?"⇪":e.value==="once"?"⬆":"⇧",$=e.value==="off"?"key-btn special":"key-btn special active-shift",C=document.createElement("div");C.className="keyboard-row",C.appendChild(y(f`<button class=${$} @click=${s}>${E}</button>`));for(const w of a)C.appendChild(y(m(w,b)));return C.appendChild(y(P())),y(f`
      <div class="keyboard-grid">
        ${M("keyboard-row",o.map(w=>m(w,b)))}
        ${M("keyboard-row",r.map(w=>m(w,b)))}
        ${C}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>n.value="numbers"}>123</button>
          <button class="key-btn special" @click=${t.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${()=>t.onKeyPress(",")}>,</button>
          ${y(g())}
          <button class="key-btn special" @click=${()=>t.onKeyPress(".")}>.</button>
          <button class="key-btn send" @click=${t.onSend}>
            ${()=>t.stealthMode.value?"Ask ⚡":"Send"}
          </button>
        </div>
      </div>
    `)},re=b=>{const E=b?h:i,$=b?p:c,C=b?l:u,w=document.createElement("div");w.className="keyboard-row",w.appendChild(y(f`
        <button
          class="key-btn special"
          @click=${()=>n.value=b?"numbers":"symbols"}>
          ${b?"123":"=\\<"}
        </button>
      `));for(const T of C)w.appendChild(y(f`<button class="key-btn" @click=${()=>t.onKeyPress(T)}>${T}</button>`));return w.appendChild(y(P())),y(f`
      <div class="keyboard-grid">
        ${M("keyboard-row",E.map(T=>f`<button class="key-btn" @click=${()=>t.onKeyPress(T)}>${T}</button>`))}
        ${M("keyboard-row",$.map(T=>f`<button class="key-btn" @click=${()=>t.onKeyPress(T)}>${T}</button>`))}
        ${w}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>n.value="alpha"}>ABC</button>
          <button class="key-btn special" @click=${t.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${()=>t.onKeyPress(",")}>,</button>
          ${y(g())}
          <button class="key-btn special" @click=${()=>t.onKeyPress(".")}>.</button>
          <button class="key-btn send" @click=${t.onSend}>
            ${()=>t.stealthMode.value?"Ask ⚡":"Send"}
          </button>
        </div>
      </div>
    `)};return y(f`
    <div class="keyboard-grid-wrapper">
      ${()=>n.value==="numbers"?re(!1):n.value==="symbols"?re(!0):Te()}
    </div>
  `)}const xe="rizzboard_recent_emojis";function ne(){try{const t=localStorage.getItem(xe);if(!t)return["😏","🔥","❤️","😂","✨","👀","💯","🥂"];const e=JSON.parse(t);return Array.isArray(e)&&e.length>0?e:["😏","🔥","❤️","😂"]}catch{return["😏","🔥","❤️","😂"]}}function vt(t){try{const e=ne().filter(o=>o!==t),n=[t,...e].slice(0,16);localStorage.setItem(xe,JSON.stringify(n))}catch{}}function wt(t){const e=S(0),n=S(""),o=S(ne()),r=i=>{vt(i),o.value=ne(),t.onSelectEmoji(i)},a=document.createElement("div");return a.className="emoji-tabs",a.appendChild(y(f`
      <button
        class=${()=>e.value===0?"emoji-tab active":"emoji-tab"}
        @click=${()=>{n.value="",e.value=0}}>
        🕒
      </button>
    `)),q.forEach((i,c)=>{const u=c+1;a.appendChild(y(f`
        <button
          class=${()=>u===e.value?"emoji-tab active":"emoji-tab"}
          @click=${()=>{n.value="",e.value=u}}>
          ${i.icon}
        </button>
      `))}),a.appendChild(y(f`<button class="emoji-tab back-key" @click=${t.onClose}>ABC</button>`)),y(f`
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
      ${()=>{const i=n.value.trim().toLowerCase();let c;if(i){const u=q.filter(h=>h.name.toLowerCase().includes(i));c=u.length>0?u.flatMap(h=>h.emojis):q.flatMap(h=>h.emojis)}else e.value===0?c=o.value:c=(q[e.value-1]??q[0]).emojis;return M("emoji-grid",c.map(u=>f`
            <button class="emoji-btn" @click=${()=>r(u)}>${u}</button>
          `))}}
    </div>
  `)}function kt(t){const e=S([]),n=o=>{e.value.includes(o)?e.value=e.value.filter(r=>r!==o):e.value=[o,...e.value]};return y(f`
    <div class="clipboard-view">
      <div class="clipboard-header">
        <span>Clipboard — Tap to Paste or ⚡ Reply</span>
        <div style="display:flex; gap:8px; align-items:center;">
          ${t.onClearAll?y(f`<button class="back-link" @click=${t.onClearAll}>Clear</button>`):""}
          <button class="back-link" @click=${t.onClose}>Close ✕</button>
        </div>
      </div>
      ${()=>{const o=e.value,r=[...t.history.value.filter(a=>o.includes(a)),...t.history.value.filter(a=>!o.includes(a))];return r.length===0?y(f`
            <div style="padding: 20px; text-align: center; opacity: 0.6; font-size: 13px;">
              Clipboard is empty. Copy any message to see it here.
            </div>
          `):M("clipboard-list",r.map(a=>{const i=o.includes(a);return f`
              <div class="clipboard-item-row">
                <div class="clipboard-item" @click=${()=>t.onSelectClip(a)}>
                  ${i?"📌 ":""}${a}
                </div>
                <button
                  class="clip-analyze-btn"
                  @click=${()=>n(a)}
                  title=${i?"Unpin":"Pin"}>
                  ${i?"📌":"📍"}
                </button>
                <button class="clip-analyze-btn" @click=${()=>t.onAnalyzeClip(a)}>
                  ⚡
                </button>
                ${t.onDeleteClip?y(f`
                      <button
                        class="clip-analyze-btn"
                        @click=${()=>t.onDeleteClip(a)}
                        title="Delete">
                        ✕
                      </button>
                    `):""}
              </div>
            `}))}}
    </div>
  `)}function Ct(t){return y(f`
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
  `)}function St(t){return y(f`
    <div class="nextmove-view">
      <div class="nextmove-header">
        <div class="nextmove-meta">
          <span class="source-chip">
            ${()=>t.resolution.value?ot(t.resolution.value.context):"⚡ Next Move"}
          </span>
          <span class="partner-quote">
            "${()=>{var n;const e=((n=t.resolution.value)==null?void 0:n.context.partnerText)??"";return e.length>44?`${e.slice(0,44).trim()}…`:e}}"
          </span>
        </div>
        <div class="nextmove-actions">
          <button class="back-link" @click=${t.onSwitchToStealth}>Edit</button>
          <button class="back-link" @click=${t.onClose}>Close ✕</button>
        </div>
      </div>

      ${()=>{const e=t.resolution.value;return!e||e.suggestions.length===0?y(f`
            <div class="roast-feedback">Tap "Tell Rizz" or "Scan Screen" to load chat context.</div>
          `):M("nextmove-cards",e.suggestions.map(n=>f`
            <div class="vibe-card" @click=${()=>t.onSelectReply(n.line)}>
              <span class="vibe-tag vibe-${n.vibe.toLowerCase()}">${n.vibe}</span>
              <span class="vibe-line">${n.line}</span>
            </div>
          `))}}
    </div>
  `)}function $t(t){const e=o=>{k("click"),et(o)},n=o=>{k("light"),tt(o)};return y(f`
    <div class="clipboard-view" style="padding: 8px;">
      <div class="clipboard-header">
        <span>Text Editing & Cursor Pad</span>
        <button class="back-link" @click=${t.onClose}>ABC ✕</button>
      </div>
      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px; margin-bottom:8px;">
        <button class="key-btn special" @click=${()=>e("selectAll")}>Select All</button>
        <button class="key-btn special" @click=${()=>e("copy")}>Copy</button>
        <button class="key-btn special" @click=${()=>e("cut")}>Cut</button>
        <button class="key-btn special" @click=${()=>e("paste")}>Paste</button>
      </div>
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:6px; max-width: 240px; margin: 0 auto;">
        <div></div>
        <button class="key-btn" @click=${()=>n("up")}>▲</button>
        <button class="key-btn special" @click=${t.onBackspace}>⌫</button>
        <button class="key-btn" @click=${()=>n("left")}>◀</button>
        <button class="key-btn" @click=${()=>n("down")}>▼</button>
        <button class="key-btn" @click=${()=>n("right")}>▶</button>
      </div>
    </div>
  `)}const X=new ft,A=new dt,v=S("qwerty"),B=S(""),I=S(void 0),O=S(null),L=S(null),x=S(!1),_=S(""),Z=S(null),j=S(!1),Pe=S(null),F=S(["What is your biggest red flag?","Are we still on for coffee this weekend?"]),xt=ke(()=>{const t=x.value?_.value:B.value;if(!t)return x.value?["asked","red","weekend"]:["how","are","you"];const e=t.trim().split(/\s+/),n=e[e.length-1];if(t.endsWith(" "))return X.predictNextWord(n,3);{const o=X.completePrefix(n,3);return o.length>0?o:[n]}});Y.registerNativeCallback("appContextChanged",t=>{if(t!=null&&t.packageName){I.value=t.packageName;try{const e=Se();if(e.status==="ok"&&e.blocks.length>0){const n=A.ingestScreenBlocks(e.blocks,"accessibility",{appPackage:e.appPackage??t.packageName});n&&(O.value=n)}}catch{}}});Y.registerNativeCallback("screenshotDetected",t=>{t!=null&&t.uri&&(O.value={id:`screenshot-${t.timestamp??Date.now()}`,source:"screenshot",partnerText:"Screenshot captured",uri:t.uri,appPackage:t.appPackage??I.value,timestamp:Date.now()},k("heavy"))});Y.registerNativeCallback("contextDetected",t=>{if(!(t!=null&&t.text)||!(t!=null&&t.source))return;const e=A.ingestRawContext({source:t.source,text:t.text,senderName:t.senderName,appPackage:t.appPackage??I.value,timestamp:t.timestamp});e&&(O.value=e,k("click"))});Y.registerNativeCallback("clipboardAdded",t=>{if(t!=null&&t.text){const e=String(t.text).trim();if(!e)return;F.value=[e,...F.value.filter(o=>o!==e).slice(0,9)];const n=A.ingestRawContext({source:"clipboard",text:e,appPackage:I.value});n&&(O.value=n)}});const D=Je();if(D.status==="ok"&&D.text&&D.source){const t=A.ingestRawContext({source:D.source,text:D.text,senderName:D.senderName,appPackage:D.appPackage,timestamp:D.timestamp});t&&(O.value=t)}function Pt(t){if(k("heavy"),t.source==="screenshot"&&t.uri){const e=Ue(t.uri),n=A.ingestScreenBlocks(e.blocks,"screenshot",{appPackage:e.appPackage??t.appPackage,uri:t.uri});if(!n){O.value=null,V("Screenshot looked blank/protected — type what they said:");return}L.value=A.resolveSuggestions(n),O.value=null,x.value=!1,v.value="nextmove";return}L.value=A.resolveSuggestions(t),O.value=null,x.value=!1,v.value="nextmove"}function Tt(){k("click");const t=Se();if(t.status==="ok"&&t.blocks.length>0){const e=A.ingestScreenBlocks(t.blocks,"accessibility",{appPackage:t.appPackage??I.value});if(e){L.value=A.resolveSuggestions(e),x.value=!1,v.value="nextmove";return}}if(t.status==="not_enabled"){j.value=!0,V("Scanner off — type what they said, or tap Enable Scanner ⚙");return}j.value=!1,V("Screen protected (FLAG_SECURE) — type a quick summary here:")}function V(t){Z.value=t??null,x.value=!0,v.value="qwerty"}function Nt(){k("click"),x.value?(x.value=!1,Z.value=null,j.value=!1):(j.value=!1,V())}function pe(){k("heavy");const t=_.value.trim(),e=A.ingestRawContext({source:"manual",text:t||"start playful conversation",appPackage:I.value});e&&(L.value=A.resolveSuggestions(e),x.value=!1,Z.value=null,j.value=!1,v.value="nextmove")}function At(t){k("heavy"),A.recordCommittedReply(t),z(t),B.value=t,_.value="",v.value="qwerty"}function Et(t){const e=A.ingestRawContext({source:"manual",text:t,appPackage:I.value});e&&(e.source="clipboard",L.value=A.resolveSuggestions(e),v.value="nextmove")}function ye(t){if(k("light"),x.value){_.value+=t;return}if(t===" "||t==="."||t===","||t==="!"||t==="?"){const e=B.value.match(/([a-zA-Z']+)$/);if(e){const n=e[1],o=X.autocorrect(n);if(o&&o!==n){for(let r=0;r<n.length;r++)Q();B.value=B.value.slice(0,-n.length)+o+t,z(o+t);return}else X.learnWord(n)}}B.value+=t,z(t)}function ge(){if(k("light"),x.value){_.value.length>0&&(_.value=_.value.slice(0,-1));return}B.value.length>0&&(B.value=B.value.slice(0,-1)),Q()}function Bt(t){if(k("click"),x.value){const o=_.value,r=o.trim().split(/\s+/),a=o.endsWith(" ")?o:r.length>1?r.slice(0,-1).join(" ")+" ":"";_.value=`${a}${t} `;return}const e=B.value,n=e.trim().split(/\s+/);if(!e.endsWith(" ")&&n.length>0){const o=n[n.length-1];for(let r=0;r<o.length;r++)Q()}z(t+" "),B.value=(e.endsWith(" ")?e:n.length>1?n.slice(0,-1).join(" ")+" ":"")+t+" "}function Rt(){k("heavy"),Pe.value=ht(B.value),v.value="roast"}function Ot(t){k("click");for(let e=0;e<B.value.length;e++)Q();A.recordCommittedReply(t),z(t),B.value=t,v.value="qwerty"}function _t(){return f`
    <div class="rizz-app">
      ${mt({activeContext:O,stealthMode:x,onOpenContextReplies:()=>{O.value&&Pt(O.value)},onScanScreen:Tt,onToggleStealth:Nt,onToggleRoast:()=>{v.value==="roast"?v.value="qwerty":Rt()},onToggleClipboard:()=>v.value=v.value==="clipboard"?"qwerty":"clipboard",onToggleEmojis:()=>v.value=v.value==="emojis"?"qwerty":"emojis",onVoiceInput:()=>{k("click"),Xe()},onSwitchKeyboard:()=>{k("click"),Ye()},onToggleTextEdit:()=>v.value=v.value==="textedit"?"qwerty":"textedit"})}

      ${()=>x.value?pt({buffer:_,hint:Z,showEnableScanner:j,onGenerate:pe,onEnableScanner:()=>Ge("accessibility"),onCancel:()=>{x.value=!1,Z.value=null,j.value=!1}}):""}

      ${yt({suggestions:xt,onSelectSuggestion:Bt})}

      ${()=>{const t=v.value;return t==="nextmove"?St({resolution:L,onSelectReply:At,onSwitchToStealth:()=>{var e;_.value=((e=L.value)==null?void 0:e.context.partnerText)??"",V()},onClose:()=>v.value="qwerty"}):t==="emojis"?wt({onSelectEmoji:ye,onClose:()=>v.value="qwerty"}):t==="clipboard"?kt({history:F,onSelectClip:e=>{A.recordCommittedReply(e),z(e),v.value="qwerty"},onAnalyzeClip:e=>{k("heavy"),Et(e)},onDeleteClip:e=>{k("light"),F.value=F.value.filter(n=>n!==e)},onClearAll:()=>{k("click"),F.value=[]},onClose:()=>v.value="qwerty"}):t==="roast"?Ct({roast:Pe,onApplyUpgrade:Ot,onClose:()=>v.value="qwerty"}):t==="textedit"?$t({onBackspace:ge,onClose:()=>v.value="qwerty"}):bt({stealthMode:x,onKeyPress:ye,onBackspace:ge,onSend:()=>{x.value?pe():(k("heavy"),He())},onOpenEmojis:()=>v.value="emojis",onMoveCursor:e=>{k("light"),Qe(e)}})}}
    </div>
  `}const be=document.getElementById("app");if(be){const{fragment:t}=oe(_t());be.appendChild(t)}
