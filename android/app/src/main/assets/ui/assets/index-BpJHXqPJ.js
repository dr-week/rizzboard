var Ie=Object.defineProperty;var Le=(e,t,n)=>t in e?Ie(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var A=(e,t,n)=>Le(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();let re=null;const Q=new Set;let Z=!1;function Te(){return re}function ee(e){const t=re;return re=e,t}function Pe(e){e.isStale=!0,Z?Q.add(e):e.execute()}function ze(e){const t=Z;Z=!0;try{return e()}finally{Z=t,Z||je()}}function je(){for(;Q.size>0;){const e=Array.from(Q);Q.clear();for(const t of e)t.isStale&&t.execute()}}class We{constructor(t){A(this,"_value");A(this,"_subscribers",new Set);this._value=t}get value(){const t=Te();return t&&(this._subscribers.add(t),t.dependencies.add(this)),this._value}set value(t){Object.is(this._value,t)||(this._value=t,this.notify())}peek(){return this._value}notify(){const t=Array.from(this._subscribers);for(const n of t)Pe(n)}_unsubscribe(t){this._subscribers.delete(t)}}function C(e){return new We(e)}class Fe{constructor(t){A(this,"_value");A(this,"_node");A(this,"_subscribers",new Set);A(this,"_isDirty",!0);A(this,"_fn");this._fn=t,this._node={dependencies:new Set,isStale:!0,execute:()=>{if(!this._isDirty){this._isDirty=!0;const n=Array.from(this._subscribers);for(const o of n)Pe(o)}}}}get value(){this._isDirty&&this._recompute();const t=Te();return t&&(this._subscribers.add(t),t.dependencies.add(this)),this._value}peek(){return this._isDirty&&this._recompute(),this._value}_unsubscribe(t){this._subscribers.delete(t)}_recompute(){for(const n of this._node.dependencies)n._unsubscribe(this._node);this._node.dependencies.clear();const t=ee(this._node);try{this._value=this._fn(),this._isDirty=!1,this._node.isStale=!1}finally{ee(t)}}}function Ne(e){return new Fe(e)}let qe=null;function Ke(){return qe}function ae(e){let t;const n={dependencies:new Set,isStale:!1,execute:()=>{for(const i of n.dependencies)i._unsubscribe(n);if(n.dependencies.clear(),typeof t=="function")try{t()}catch(i){console.error("[Nova Signal Effect Cleanup Error]:",i)}const a=ee(n);try{t=e()}finally{ee(a),n.isStale=!1}}};n.execute();const o=()=>{for(const a of n.dependencies)a._unsubscribe(n);n.dependencies.clear(),typeof t=="function"&&t()},r=Ke();return r&&r.addCleanup(o),o}function Ae(){return typeof window<"u"&&"Part"in window&&"ChildNodePart"in window&&typeof window.getParts=="function"}class fe{constructor(t){A(this,"parentNode");A(this,"previousSibling");A(this,"nextSibling");A(this,"value");A(this,"_currentNode");const n=t.parentNode;if(!n)throw new Error("[Zuari DOM Parts]: Placeholder node must have a parent container.");this.parentNode=n,this.previousSibling=t.previousSibling,this.nextSibling=t.nextSibling;const o=document.createTextNode("");n.replaceChild(o,t),this._currentNode=o}setValue(t){if(this.value=t,t instanceof DocumentFragment){const n=document.createTextNode("");this.parentNode.replaceChild(n,this._currentNode),this.parentNode.insertBefore(t,n),this._currentNode=n;return}if(t instanceof Node){this._currentNode!==t&&(this.parentNode.replaceChild(t,this._currentNode),this._currentNode=t);return}if(this._currentNode instanceof Text)this._currentNode.data=String(t??"");else{const n=document.createTextNode(String(t??""));this.parentNode.replaceChild(n,this._currentNode),this._currentNode=n}}disconnect(){}}class he{constructor(t,n){A(this,"element");A(this,"attributeName");A(this,"value");this.element=t,this.attributeName=n}setValue(t){this.value=t,t===!1||t===null||t===void 0?this.element.removeAttribute(this.attributeName):this.element.setAttribute(this.attributeName,String(t))}disconnect(){this.element.removeAttribute(this.attributeName)}}function He(e){if(Ae())try{const t=window.ChildNodePart;return new t(e)}catch{return new fe(e)}return new fe(e)}function Ze(e,t){if(Ae())try{const n=window.AttributePart;return new n(e,t)}catch{return new he(e,t)}return new he(e,t)}function Ve(e,t,n,o){const r=Ue(e,`<!--zuari-hole-${t}-->`);if(r){const g=He(r);if(me(n)){const c=ae(()=>g.setValue(pe(n)));o.push(()=>{var d;c(),(d=g.disconnect)==null||d.call(g)})}else g.setValue(n);return}const a=`data-zuari-attr-${t}`,i=Ge(e,a);if(!i)return;const{element:l,attrName:u}=i;if(u.startsWith("@")||u.startsWith("on")){const g=(u.startsWith("@")?u.slice(1):u.slice(2)).toLowerCase();if(l.removeAttribute(u),typeof n!="function")return;const c=n;l.addEventListener(g,c),o.push(()=>l.removeEventListener(g,c));return}const m=Ze(l,u);if(me(n)){const g=ae(()=>m.setValue(pe(n)));o.push(()=>{var c;g(),(c=m.disconnect)==null||c.call(m)})}else m.setValue(n)}function me(e){return typeof e=="object"&&e!==null&&"value"in e||typeof e=="function"}function pe(e){return typeof e=="object"&&e!==null&&"value"in e?e.value:typeof e=="function"?e():e}function Ue(e,t){const n=document.createNodeIterator(e,NodeFilter.SHOW_COMMENT);let o=n.nextNode();for(;o;){if(`<!--${o.data}-->`===t)return o;o=n.nextNode()}return null}function Ge(e,t){const n=document.createNodeIterator(e,NodeFilter.SHOW_ELEMENT);let o=n.nextNode();for(;o;){for(const r of Array.from(o.attributes))if(r.value.includes(t))return{element:o,attrName:r.name};o=n.nextNode()}return null}const ye=new Map,Je="<!--zuari-hole-",Xe="-->",Ye="data-zuari-attr-";function f(e,...t){return{strings:e,values:t}}function se(e,t){const{strings:n,values:o}=e,r=n.join("<!--?-->");let a=ye.get(r);a||(a=document.createElement("template"),a.innerHTML=n.reduce((m,g,c)=>{if(c>=o.length)return m+g;const s=/=["']?[^"'>]*$/.test(g)?`"${Ye}${c}"`:`${Je}${c}${Xe}`;return m+g+s},""),ye.set(r,a));const i=a.content.cloneNode(!0),l=Array.from(i.childNodes),u=[];return o.forEach((m,g)=>Ve(i,g,m,u)),{fragment:i,destroy(){u.forEach(m=>m()),l.forEach(m=>{var g;return(g=m.parentNode)==null?void 0:g.removeChild(m)})}}}const Qe={primary:"#006A6A",onPrimary:"#FFFFFF",primaryContainer:"#6FF7F6",onPrimaryContainer:"#002020",secondary:"#4A6363",onSecondary:"#FFFFFF",background:"#FAFDFD",onBackground:"#191C1C",surface:"#FAFDFD",onSurface:"#191C1C",surfaceVariant:"#DAE5E4",outline:"#6F7979"},et={primary:"#4CDADA",onPrimary:"#003737",primaryContainer:"#004F4F",onPrimaryContainer:"#6FF7F6",secondary:"#B1CCCC",onSecondary:"#1C3534",background:"#191C1C",onBackground:"#E1E3E3",surface:"#191C1C",onSurface:"#E1E3E3",surfaceVariant:"#3F4948",outline:"#899392"};function tt(e=!1){const t=C(e),n=C(e?{...et}:{...Qe}),o=Ne(()=>!!(typeof navigator<"u"&&/android/i.test(navigator.userAgent)||typeof window<"u"&&window.Android)),r=new Map;typeof window<"u"&&(window.__zuariKotlinDispatcher=(c,d)=>{const s=r.get(c);if(s)try{const p=JSON.parse(d);s(p)}catch{s(d)}});function a(c,...d){return new Promise((s,p)=>{if(typeof window<"u"&&window.Android){const N=window.Android;if(typeof N[c]=="function")try{const w=N[c](...d);try{s(JSON.parse(w))}catch{s(w)}return}catch(w){p(w);return}}s({success:!0,mock:!0,function:c,args:d})})}function i(c,d){return r.set(c,d),()=>{r.delete(c)}}function l(c){ze(()=>{n.value={...n.value,...c}})}function u(c){const d=(c==null?void 0:c.packageName)??"com.zuari.ui.theme",s=(c==null?void 0:c.themeName)??"ZuariTheme",p={...n.value,...(c==null?void 0:c.colors)??{}};return`package ${d}

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
`}function m(c){const d=(c==null?void 0:c.themeName)??"Theme.Zuari.Native",s={...n.value,...(c==null?void 0:c.colors)??{}};return`<?xml version="1.0" encoding="utf-8"?>
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
`}function g(c){const d=c??(typeof document<"u"?document.documentElement:null);return d?ae(()=>{const s=n.value;d.style.setProperty("--md-sys-color-primary",s.primary),d.style.setProperty("--md-sys-color-on-primary",s.onPrimary),d.style.setProperty("--md-sys-color-primary-container",s.primaryContainer),d.style.setProperty("--md-sys-color-on-primary-container",s.onPrimaryContainer),d.style.setProperty("--md-sys-color-secondary",s.secondary),d.style.setProperty("--md-sys-color-on-secondary",s.onSecondary),d.style.setProperty("--md-sys-color-background",s.background),d.style.setProperty("--md-sys-color-on-background",s.onBackground),d.style.setProperty("--md-sys-color-surface",s.surface),d.style.setProperty("--md-sys-color-on-surface",s.onSurface),d.style.setProperty("--md-sys-color-surface-variant",s.surfaceVariant),d.style.setProperty("--md-sys-color-outline",s.outline)}):()=>{}}return{isAndroid:o,dynamicColors:n,isDarkTheme:t,callNativeFunction:a,registerNativeCallback:i,generateComposeThemeCode:u,generateXmlThemeCode:m,ingestDynamicPalette:l,applyToCssVariables:g}}const ne=tt(!0);function O(){return typeof window<"u"&&window.Android?window.Android:null}function q(e){const t=O();t?t.commitText(e):console.log("[Dev Mock Commit]:",e)}function G(){const e=O();e?e.deleteBackward():console.log("[Dev Mock Delete]")}function nt(){const e=O();e?e.sendEnter():console.log("[Dev Mock Enter]")}function v(e="click"){const t=O();t&&typeof t.triggerHaptic=="function"&&t.triggerHaptic(e)}function ot(e){const t=O();if(t&&typeof t.requestScreenshotAnalysis=="function")try{const n=t.requestScreenshotAnalysis(e);return JSON.parse(n)}catch{return{status:"error",blocks:[]}}return{status:"ok",blocks:[{text:"Are you free for drinks this weekend?",x:48,y:420,width:320,screenWidth:1080}]}}function Ee(){const e=O();if(e&&typeof e.requestScreenScan=="function")try{const t=e.requestScreenScan();return JSON.parse(t)}catch{return{status:"error",blocks:[]}}return{status:"ok",appPackage:"com.snapchat.android",blocks:[{text:"What is your biggest red flag?",x:52,y:460,width:300,screenWidth:1080}]}}function rt(){const e=O();if(e&&typeof e.getActiveContext=="function")try{return JSON.parse(e.getActiveContext())}catch{return{status:"none"}}return{status:"none"}}function _e(e){const t=O();t&&typeof t.openSystemSetting=="function"?t.openSystemSetting(e):console.log("[Dev Mock Open Setting]:",e)}function at(){const e=O();e&&typeof e.startVoiceTyping=="function"?e.startVoiceTyping():console.log("[Dev Mock Voice Typing]")}function it(){const e=O();e&&typeof e.showInputMethodPicker=="function"?e.showInputMethodPicker():console.log("[Dev Mock IME Picker]")}function st(e){const t=O();t&&typeof t.moveCursor=="function"&&t.moveCursor(e)}function lt(e){const t=O();t&&typeof t.performEditAction=="function"&&t.performEditAction(e)}function ct(e){const t=O();t&&typeof t.sendDpad=="function"&&t.sendDpad(e)}function ge(e,t){return`You are an elite wingman who excels at playful, concise, charismatic banter.
Your task: Suggest 3 distinct next moves for a dating app conversation.
Strict rules:
1. MAX 12 words per line.
2. NO cheesy cliché compliments like "Hey cutie" or "You must be tired from running through my mind".
3. Use witty banter, slight teasing, or confident playful framing.
4. Output MUST be valid JSON array with keys: "vibe" (Smooth | Tease | Bold) and "line" (string).

Partner said: "${e}"
${t?`Context I said previously: "${t}"`:""}

Respond ONLY with the JSON array:`}function ut(e){return`You are a charisma coach. Rewrite this bland text message into 3 sharper, confident, flirty versions.
Max 12 words each.
Bland text: "${e}"

Output ONLY a JSON array with objects: [{"vibe": "Smooth", "line": "..."}, {"vibe": "Tease", "line": "..."}, {"vibe": "Bold", "line": "..."}]`}const be={"com.snapchat.android":"Snapchat","org.telegram.messenger":"Telegram","org.thoughtcrime.securesms":"Signal","co.hinge.app":"Hinge","com.bumble.app":"Bumble","com.tinder":"Tinder","com.instagram.android":"Instagram","com.whatsapp":"WhatsApp","web.whatsapp.com":"WhatsApp Web","instagram.com":"Instagram DM","web.telegram.org":"Telegram Web","tinder.com":"Tinder Web","bumble.com":"Bumble Web","discord.com":"Discord","x.com":"X DM"};function Re(e){if(!e)return;const t=e.replace(/^www\./i,"");if(be[t])return be[t];const n=t.split("."),o=n[n.length-1];if(!o||["android","app","messenger","com","org","io"].includes(o)){const r=n[n.length-2];return r?r.charAt(0).toUpperCase()+r.slice(1):void 0}return o.charAt(0).toUpperCase()+o.slice(1)}function dt(e){const t=Re(e.appPackage);switch(e.source){case"screenshot":return"📸 Screenshot";case"notification":return t?`🔔 ${t} Msg`:"🔔 Incoming Msg";case"clipboard":return"📋 Copied Bubble";case"accessibility":return t?`👁️ ${t} Scan`:"👁️ Screen Scan";case"selection":return"✨ Selected Text";case"dom":return t?`🌐 ${t} Chat`:"🌐 Web Chat";case"manual":return"💬 Stealth Context"}}function ft(e){const t=e.partnerText.length>26?`${e.partnerText.slice(0,26).trim()}…`:e.partnerText;switch(e.source){case"screenshot":return"📸 Screenshot Detected: Analyze Next Move";case"notification":{const n=Re(e.appPackage);return n?`🔔 ${n}: "${t}" — Reply`:`🔔 New Msg: "${t}" — Reply`}case"clipboard":return`📋 Copied: "${t}" — Reply`;case"accessibility":case"dom":return`👁️ Scanned: "${t}" — Reply`;case"selection":return`✨ Selected: "${t}" — Reply`;case"manual":return"💬 Context Ready — View Replies"}}class ht{constructor(){this.recentSelfCommits=new Set}recordSelfCommit(t){const n=this.normalize(t);if(n&&(this.recentSelfCommits.add(n),this.recentSelfCommits.size>25)){const o=this.recentSelfCommits.values().next().value;o&&this.recentSelfCommits.delete(o)}}isIgnored(t,n){const o=t.trim();if(!o)return!0;if(n==="manual"||n==="selection")return!1;const r=this.normalize(o);return!!(this.recentSelfCommits.has(r)||/^https?:\/\/\S+$/i.test(o)||/^\d{4,8}$/.test(o))}normalize(t){return t.toLowerCase().replace(/\s+/g," ").trim()}}function mt(e){const t={rawBlocks:e.map(o=>o.text)};if(e.length===0)return t;const n=e.filter(o=>{const r=o.y<120,a=o.y>o.screenWidth*1.8;return!r&&!a});n.sort((o,r)=>o.y-r.y);for(let o=n.length-1;o>=0;o--){const r=n[o],a=r.x+r.width/2>r.screenWidth/2;if(!a&&!t.senderText?t.senderText=r.text:a&&!t.myLastText&&(t.myLastText=r.text),t.senderText&&t.myLastText)break}return t}const pt=[{id:"op-1",category:"opener",vibe:"playful",triggerKeywords:["travel","hiking","nature"],template:"Are you as adventurous as your profile says, or do you also get lost in grocery stores?"},{id:"op-2",category:"opener",vibe:"smooth",triggerKeywords:["smile","eyes","cute"],template:"I was going to wait two days to message you, but patience was never my strong suit."},{id:"op-3",category:"opener",vibe:"witty",triggerKeywords:["food","coffee","cooking"],template:"Important question: what is your most controversial culinary opinion?"},{id:"bt-1",category:"banter",vibe:"playful",triggerKeywords:["trouble","sarcasm","bad"],template:"Are you always this much trouble or did I catch you on a good day?"},{id:"bt-2",category:"banter",vibe:"witty",triggerKeywords:["challenge","bet","win"],template:"Careful, high expectations are my only weakness."},{id:"bt-3",category:"banter",vibe:"bold",triggerKeywords:["rules","late","fast"],template:"I would say you are five minutes away from being my favorite person."},{id:"wp-1",category:"wordplay",vibe:"witty",triggerKeywords:["smart","books","study","work"],template:"Are you an overdue library book? Because you have fine written all over you."},{id:"wp-2",category:"wordplay",vibe:"smooth",triggerKeywords:["music","song","playlist"],template:"If our conversation was a playlist, I would have it on repeat."},{id:"cl-1",category:"closer",vibe:"bold",triggerKeywords:["drinks","date","weekend","meet","free","tonight"],template:"Drinks this Thursday. You pick the spot, I will bring the conversation."},{id:"cl-2",category:"closer",vibe:"smooth",triggerKeywords:["coffee","tea","afternoon","sunday","morning"],template:"Let us see if you are as fun in person. Coffee tomorrow?"},{id:"rf-1",category:"banter",vibe:"playful",triggerKeywords:["red flag","toxic","flaw","worst"],template:"My biggest red flag is thinking I can win every staring contest."},{id:"sn-1",category:"banter",vibe:"bold",triggerKeywords:["snap","streak","vanish","secret","disappear"],template:"Disappearing messages just mean we have to make every line count."},{id:"wy-1",category:"banter",vibe:"witty",triggerKeywords:["wyd","doing","bored","up to","plans"],template:"Plotting my next move, and you just walked right into it."},{id:"pt-1",category:"opener",vibe:"playful",triggerKeywords:["dog","puppy","cat","pet","gym","workout"],template:"Be honest: am I competing with your pet for attention, or do I stand a chance?"}];function yt(e,t=3){const n=e.toLowerCase();if(!n.trim())return[];const o=pt.map(r=>{let a=0;for(const i of r.triggerKeywords)n.includes(i)&&(a+=2);return{entry:r,score:a}}).filter(r=>r.score>0);return o.sort((r,a)=>a.score-r.score),o.slice(0,t).map(r=>r.entry)}function gt(e){const t=new Set(["the","and","for","are","you","that","this","with","have","what","when","where","why","how","just","like","really","very","about","from","they","them","your","mine","been","were","was","will","would","could","should","going","doing","want","need","know","think","today","tonight","tomorrow","lol","haha","lmao","yeah","yep","nope","okay","hey","hii","hello"]),n=e.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(o=>o.length>=4&&!t.has(o));return n.length>0?n[n.length-1]:null}class Oe{generateOfflineSuggestions(t,n){const o=t.trim(),r=o.toLowerCase(),a=yt(o,3),i={};for(const w of a)w.vibe==="smooth"&&!i.Smooth?i.Smooth=w.template:(w.vibe==="playful"||w.vibe==="witty")&&!i.Tease?i.Tease=w.template:w.vibe==="bold"&&!i.Bold&&(i.Bold=w.template);for(const w of a)!i.Smooth&&w.template!==i.Tease&&w.template!==i.Bold?i.Smooth=w.template:!i.Tease&&w.template!==i.Smooth&&w.template!==i.Bold?i.Tease=w.template:!i.Bold&&w.template!==i.Smooth&&w.template!==i.Tease&&(i.Bold=w.template);const l=gt(o),u=o.includes("?")||/^(what|why|how|where|when|who|are|do|did|would|can|wanna)\b/i.test(o),m=o.length>0&&o.split(/\s+/).length<=2&&!u,g=/^(hey|hi|hello|yo|sup|heyy+|hii+|gm|good morning)\b/i.test(r),c=/\b(sorry|my bad|apologize|late|missed)\b/i.test(r),d=/\b(cute|hot|pretty|handsome|smart|funny|sweet|love your|like your)\b/i.test(r);let s,p,N;return g?(s="Was literally just thinking about texting you—great timing.",p="Look who finally decided to grace my notifications.",N="Hey—skipping the small talk, how is your week looking?"):c?(s="All good, life happens. Just glad you are here now.",p="You owe me a coffee for the suspense, then we are even.",N="Apology accepted—make it up to me this weekend?"):d?(s="Careful, keep talking like that and I might actually blush.",p="Flattery will get you everywhere—what else you got?",N="Say that again in person over drinks."):u&&l?(s=`Honestly, ${l} is a whole story—I will tell you the good part.`,p=`Depends—are you asking about ${l} out of curiosity or research?`,N=`Better ${l} story in person. Are you free Thursday?`):u?(s="Careful, the honest answer might make you like me more.",p="I plead the fifth—unless you are buying the first round.",N="Better story in person. When are we hanging out?"):m?(s="A person of few words—good thing I speak fluent mystery.",p="Do not hurt your thumbs typing a whole novel over there.",N="Tell me what you are actually up to right now."):l?(s=`Okay, ${l} actually sounds like my kind of vibe.`,p=`Wait, you cannot just drop "${l}" and not elaborate.`,N=`We definitely need to talk more about ${l}—coffee this week?`):r.includes("haha")||r.includes("lol")||r.includes("lmao")?(s="Making you laugh this early is dangerous for both of us.",p="Glad I could entertain you—my rates go up after midnight.",N="Wait until you hear my actual voice—call later?"):(s="I was going to play it cool, but you made that impossible.",p="Are you always this much trouble or is today special?",N="Skip the small talk: what is your go-to spot for drinks?"),[{vibe:"Smooth",line:i.Smooth??s},{vibe:"Tease",line:i.Tease??p},{vibe:"Bold",line:i.Bold??N}]}async generateOnlineSuggestions(t,n){var i,l,u;const o=this.generateOfflineSuggestions(t,n);if(typeof fetch!="function")return o;const r=new AbortController,a=setTimeout(()=>r.abort(),4e3);try{const m=`${ge(t,n)}
Return ONLY a JSON array of 3 objects: [{"vibe":"Smooth","line":"..."},{"vibe":"Tease","line":"..."},{"vibe":"Bold","line":"..."}]`,g=await fetch("https://text.pollinations.ai/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:"You are a concise, witty dating/chat assistant. Reply ONLY with valid JSON."},{role:"user",content:m}],model:"openai"}),signal:r.signal});if(clearTimeout(a),!g.ok)return o;const d=(await g.text()).match(/\[[\s\S]*\]/);if(!d)return o;const s=JSON.parse(d[0]);return!Array.isArray(s)||s.length<3?o:[{vibe:"Smooth",line:String(((i=s[0])==null?void 0:i.line)||o[0].line)},{vibe:"Tease",line:String(((l=s[1])==null?void 0:l.line)||o[1].line)},{vibe:"Bold",line:String(((u=s[2])==null?void 0:u.line)||o[2].line)}]}catch{return clearTimeout(a),o}}getPromptForChat(t,n){return ge(t,n)}getPromptForRewrite(t){return ut(t)}}class bt{constructor(){this.engine=new Oe,this.filter=new ht,this.lastProcessedSignature=""}recordCommittedReply(t){this.filter.recordSelfCommit(t)}isIgnoredNoiseOrSelf(t,n){return this.filter.isIgnored(t,n)}ingestRawContext(t){var a,i;const n=t.text.replace(/\s+/g," ").trim();if(this.filter.isIgnored(n,t.source))return null;const o=`${t.source}:${t.appPackage??""}:${this.filter.normalize(n)}`;if(t.source!=="manual"&&t.source!=="selection"&&o===this.lastProcessedSignature)return null;this.lastProcessedSignature=o;const r=t.timestamp??Date.now();return{id:`${t.source}-${r}`,source:t.source,partnerText:n,myLastText:((a=t.myLastText)==null?void 0:a.trim())||void 0,senderName:((i=t.senderName)==null?void 0:i.trim())||void 0,appPackage:t.appPackage,uri:t.uri,timestamp:r}}ingestScreenBlocks(t,n,o){var i;if(!t||t.length===0)return null;const r=mt(t),a=r.senderText??r.rawBlocks.find(l=>!this.filter.isIgnored(l,n));return a?{id:`${n}-${(o==null?void 0:o.timestamp)??Date.now()}`,source:n,partnerText:a.trim(),myLastText:(i=r.myLastText)==null?void 0:i.trim(),appPackage:o==null?void 0:o.appPackage,uri:o==null?void 0:o.uri,timestamp:(o==null?void 0:o.timestamp)??Date.now()}:null}resolveSuggestions(t){const n=this.engine.generateOfflineSuggestions(t.partnerText,t.myLastText);return{context:t,suggestions:n}}}const ve={i:"I",im:"I'm",ive:"I've",ill:"I'll",id:"I'd",dont:"don't",cant:"can't",wont:"won't",didnt:"didn't",doesnt:"doesn't",isnt:"isn't",arent:"aren't",wasnt:"wasn't",werent:"weren't",havent:"haven't",hasnt:"hasn't",hadnt:"hadn't",wouldnt:"wouldn't",couldnt:"couldn't",shouldnt:"shouldn't",youre:"you're",youve:"you've",youll:"you'll",theyre:"they're",thats:"that's",whats:"what's",heres:"here's",theres:"there's",wheres:"where's",lets:"let's",teh:"the",hte:"the",adn:"and",nad:"and",taht:"that",waht:"what",whta:"what",hwat:"what",wiht:"with",wtih:"with",jsut:"just",jstu:"just",liek:"like",lke:"like",realy:"really",relly:"really",definately:"definitely",definetly:"definitely",seperate:"separate",recieve:"receive",occured:"occurred",untill:"until",tommorow:"tomorrow",tomorow:"tomorrow",tonite:"tonight",becuase:"because",beacuse:"because",freind:"friend",frend:"friend",prolly:"probably",probly:"probably",thx:"thanks",ty:"thank you",pls:"please",plz:"please",sry:"sorry",srry:"sorry",msg:"message",bday:"birthday",wknd:"weekend",tmrw:"tomorrow"};class vt{constructor(){this.root={children:new Map,isWord:!1,frequency:0},this.bigrams=new Map,this.dictionaryWords=new Set,this.personalWords=new Set,this.seedCommonVocabulary()}insert(t,n=1){let o=this.root;const r=t.toLowerCase();for(const a of r)o.children.has(a)||o.children.set(a,{children:new Map,isWord:!1,frequency:0}),o=o.children.get(a);o.isWord=!0,o.frequency+=n,this.dictionaryWords.add(r)}learnWord(t){const n=t.trim().replace(/[^a-zA-Z']/g,"");n.length<2||(this.insert(n,25),this.personalWords.add(n.toLowerCase()))}getPersonalDictionary(){return Array.from(this.personalWords).sort()}hasWord(t){return this.dictionaryWords.has(t.toLowerCase())}autocorrect(t){const n=t.trim();if(!n||n.length<1)return null;const o=n.toLowerCase();if(ve[o]){const i=ve[o];return n[0]===n[0].toUpperCase()&&i[0]!==i[0].toUpperCase()?i[0].toUpperCase()+i.slice(1):i}if(this.dictionaryWords.has(o)||o.length<3)return null;let r=null,a=0;for(const i of this.dictionaryWords)if(!(Math.abs(i.length-o.length)>1)&&this.levenshtein(o,i)===1){const l=this.getWordFrequency(i);l>a&&(a=l,r=i)}return r?n[0]===n[0].toUpperCase()?r[0].toUpperCase()+r.slice(1):r:null}getWordFrequency(t){let n=this.root;for(const o of t.toLowerCase()){const r=n.children.get(o);if(!r)return 0;n=r}return n.isWord?n.frequency:0}levenshtein(t,n){const o=t.length,r=n.length,a=Array.from({length:r+1},(i,l)=>l);for(let i=1;i<=o;i++){let l=a[0];a[0]=i;for(let u=1;u<=r;u++){const m=a[u];t[i-1]===n[u-1]?a[u]=l:a[u]=1+Math.min(l,a[u],a[u-1]),l=m}}return a[r]}addBigram(t,n){const o=t.toLowerCase(),r=n.toLowerCase();let a=this.bigrams.get(o);a||(a=[],this.bigrams.set(o,a));const i=a.find(l=>l.word===r);i?i.count++:a.push({word:r,count:1}),a.sort((l,u)=>u.count-l.count)}completePrefix(t,n=3){if(!t)return[];let o=this.root;const r=t.toLowerCase();for(const i of r){if(!o.children.has(i))return[];o=o.children.get(i)}const a=[];return this.collectWords(o,r,a),a.sort((i,l)=>l.frequency-i.frequency),a.slice(0,n).map(i=>i.word)}predictNextWord(t,n=3){if(!t)return["the","you","I"];const o=t.toLowerCase(),r=this.bigrams.get(o);return r&&r.length>0?r.slice(0,n).map(a=>a.word):["and","to","you"]}collectWords(t,n,o){t.isWord&&o.push({word:n,frequency:t.frequency});for(const[r,a]of t.children.entries())this.collectWords(a,n+r,o)}seedCommonVocabulary(){const t=[["the",200],["be",180],["to",180],["of",175],["and",175],["a",170],["in",165],["that",160],["have",155],["it",155],["for",150],["not",145],["on",145],["with",140],["he",135],["as",135],["you",190],["do",130],["at",130],["this",130],["but",125],["his",120],["by",120],["from",120],["they",120],["we",125],["say",115],["her",115],["she",115],["or",115],["an",115],["will",120],["my",130],["one",115],["all",115],["would",115],["there",115],["their",110],["what",140],["so",125],["up",110],["out",110],["if",115],["about",120],["who",110],["get",115],["which",105],["go",115],["me",125],["when",120],["make",110],["can",125],["like",130],["time",115],["no",115],["just",125],["him",105],["know",120],["take",105],["people",100],["into",100],["year",95],["your",130],["good",125],["some",105],["could",105],["them",105],["see",115],["other",100],["than",100],["then",105],["now",115],["look",105],["only",105],["come",105],["its",100],["over",100],["think",110],["also",100],["back",105],["after",100],["use",100],["two",95],["how",135],["our",105],["work",105],["first",100],["well",110],["way",105],["even",100],["new",100],["want",115],["because",105],["any",100],["these",95],["give",95],["day",105],["most",95],["us",100],["are",150],["was",130],["were",110],["been",105],["has",110],["had",110],["free",110],["tonight",105],["tomorrow",100],["weekend",110],["coffee",95],["drinks",95],["dinner",95],["lunch",90],["plans",95],["sounds",105],["love",120],["talking",90],["where",115],["why",110],["going",115],["great",115],["amazing",95],["awesome",95],["cool",100],["nice",105],["sorry",100],["thanks",105],["please",105],["maybe",95],["definitely",90],["probably",90],["actually",95],["really",115],["very",110],["morning",95],["night",105],["today",105],["soon",95],["later",95],["ready",90],["busy",90],["happy",95],["excited",90],["miss",95],["wait",95],["meet",95]];for(const[o,r]of t)this.insert(o,r);const n=[["how","are"],["how","is"],["how","was"],["are","you"],["are","we"],["are","they"],["you","free"],["you","doing"],["you","up"],["what","are"],["what","is"],["what","do"],["want","to"],["going","to"],["have","to"],["good","morning"],["good","night"],["good","idea"],["sounds","good"],["sounds","great"],["sounds","fun"],["see","you"],["talk","to"],["let","me"],["on","my"],["my","way"],["this","weekend"]];for(const[o,r]of n)this.addBigram(o,r)}}function wt(e){const t=e.trim(),n=t.toLowerCase();return t?/^(hey|hi|hello|sup|yo|wyd|what'?s up)$/i.test(t)?{score:2,verdict:"Dry",feedback:"Low effort opener. High ghosting probability (~90%).",improved:"Important question: what is your most controversial food opinion?"}:n.includes("how are you")||n.includes("how was your day")?{score:4,verdict:"Safe",feedback:"Polite but sounds like an HR interview.",improved:"Tell me your day was more exciting than grocery shopping."}:n.includes("cutie")||n.includes("beautiful")||n.includes("gorgeous")?{score:5,verdict:"Safe",feedback:"Compliment is sweet, but every other match says the exact same thing.",improved:"I was going to play it cool, but you made that impossible."}:n.includes("trouble")||n.includes("bet")||n.includes("drinks")||n.includes("coffee")?{score:9,verdict:"Smooth",feedback:"High energy, playful intrigue. Ready to send.",improved:t}:{score:7,verdict:"Smooth",feedback:"Solid message. Could use 10% more cheekiness.",improved:`${t} — unless you scare easily.`}:{score:1,verdict:"Dry",feedback:"Empty canvas. Drop something bold.",improved:"Are we breaking records or rules tonight?"}}const H=[{name:"Smileys & Rizz",icon:"😏",emojis:["😏","😉","😎","😜","😝","😛","🥳","🤩","😍","🥰","😘","😗","😙","😚","🤗","🤭","🤫","🫠","🫡","🤔","🤨","😐","😑","😶","🙄","😬","😌","😔","😪","😴","😂","🤣","😭","😅","😆","😁","😄","😃","😀","🙂","😈","👿","🫦","💅","👀","✨","🔥","💀","🤡","🥺"]},{name:"Love & Hearts",icon:"❤️",emojis:["❤️","❤️‍🔥","❤️‍🩹","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💖","💗","💓","💞","💕","💘","💝","💟","❣️","💔","💋","💌","💍","💎","🌹","🥀","💐","🌷","🌸","🥂","🍾","🍫","🍓","🍒","🫶","🫰","💑","👩‍❤️‍👨","💏"]},{name:"Gestures & Reactions",icon:"✌️",emojis:["👍","👎","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","☝️","✋","🤚","🖐️","🖖","👋","🤝","🙏","👏","🙌","👐","🤲","✊","👊","🤛","🤜","💪","🦾","🫶","🤦‍♂️","🤦‍♀️","🤷‍♂️","🤷‍♀️","💯","🎯"]},{name:"People & Vibes",icon:"🕺",emojis:["🕺","💃","👯","🧘","🏄","🚴","🏋️","🤸","🥷","🕵️","👑","🎩","🕶️","👓","🧣","👗","👔","👟","👠","👜","🧠","🫀","👁️","👅","👄","👂","👃","🫂","🗣️","👤"]},{name:"Food & Dates",icon:"☕",emojis:["☕","🍵","🧋","🥤","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🍾","🍕","🍔","🍟","🌭","🌮","🌯","🍣","🍜","🍝","🍛","🍱","🥟","🍤","🍦","🍨","🍩","🍪","🎂","🍰","🧁","🍫","🍿","🥐","🥯","🥞","🧇","🥓","🍳"]},{name:"Activities & Travel",icon:"✈️",emojis:["✈️","🚗","🏎️","🚕","🚌","🚆","🚀","🛸","⛵","🏖️","🏝️","🏔️","🏕️","🌅","🌄","🌃","🌆","🎡","🎢","🎬","🎤","🎧","🎼","🎹","🎸","🥁","🎮","🕹️","🎲","♟️","🎳","🎯","⚽","🏀","🏈","⚾","🎾","🏐","🏆","🥇"]},{name:"Symbols & Tech",icon:"⚡",emojis:["⚡","⭐","🌟","💫","✨","💥","💢","💦","💨","💤","💬","💭","🗯️","🔔","🔕","🔒","🔓","🔑","📱","💻","⌨️","📷","📸","🎥","📺","📻","⏰","⏳","💡","🔋","✅","❌","❓","❗","‼️","⁉️","⚠️","🚫","♻️","♾️"]}];function y(e){const{fragment:t}=se(e);if(t.childElementCount===1&&t.firstElementChild)return t.firstElementChild;const n=document.createElement("div");return n.style.display="contents",n.appendChild(t),n}function I(e,t){const n=document.createElement("div");n.className=e;for(const o of t){const{fragment:r}=se(o);n.appendChild(r)}return n}function kt(e){return y(f`
    <div class="action-bar">
      ${()=>e.activeContext.value?y(f`
            <button class="action-pill highlight" @click=${e.onOpenContextReplies}>
              ${ft(e.activeContext.value)}
            </button>
          `):""}
      <button class="action-pill" @click=${e.onVoiceInput} title="Google Voice Typing">
        🎙️
      </button>
      <button class="action-pill" @click=${e.onScanScreen} title="Scan Screen">
        👁️
      </button>
      <button
        class=${()=>e.stealthMode.value?"action-pill active-mode":"action-pill"}
        @click=${e.onToggleStealth}
        title="Tell Rizz">
        💬
      </button>
      <button class="action-pill" @click=${e.onToggleRoast} title="Roast Draft">
        🔥
      </button>
      <button class="action-pill" @click=${e.onToggleClipboard} title="Clipboard">
        📋
      </button>
      <button class="action-pill" @click=${e.onToggleEmojis} title="Emojis">
        😏
      </button>
      <button class="action-pill" @click=${e.onToggleTextEdit} title="Text Editing">
        ✂️
      </button>
      <button class="action-pill" @click=${e.onToggleHelp} title="Help & Gestures">
        ❓
      </button>
      <button class="action-pill" @click=${e.onCycleTheme} title="Switch Theme">
        🎨
      </button>
      <button class="action-pill" @click=${e.onToggleOneHanded} title="One-Handed Mode">
        🤚
      </button>
      <button class="action-pill" @click=${e.onToggleNumberRow} title="Number Row">
        🔢
      </button>
      <button class="action-pill" @click=${e.onSwitchKeyboard} title="Switch Keyboard">
        🌐
      </button>
    </div>
  `)}function Ct(e){return y(f`
    <div class="stealth-bar">
      <div class="stealth-top">
        <span class="stealth-badge">🛡️ STEALTH MODE · Hidden from chat</span>
        <div class="stealth-actions">
          ${()=>e.showEnableScanner.value?y(f`
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
  `)}function St(e){return y(f`
    <div class="suggestions-shell">
      ${()=>I("suggestions-panel",e.suggestions.value.map(t=>f`
          <div class="suggestion-card" @click=${()=>e.onSelectSuggestion(t)}>
            <span class="suggestion-text">${t}</span>
          </div>
        `))}
    </div>
  `)}const $t={q:"1",w:"2",e:"3",r:"4",t:"5",y:"6",u:"7",i:"8",o:"9",p:"0",a:"@",s:"#",d:"$",f:"%",g:"&",h:"-",j:"+",k:"(",l:")",z:"*",x:'"',c:"'",v:":",b:";",n:"!",m:"?"};function xt(e){const t=C("off"),n=C("alpha"),o=["q","w","e","r","t","y","u","i","o","p"],r=["a","s","d","f","g","h","j","k","l"],a=["z","x","c","v","b","n","m"],i=["1","2","3","4","5","6","7","8","9","0"],l=["@","#","$","_","&","-","+","(",")","/"],u=["*",'"',"'",":",";","!","?"],m=["~","`","|","•","√","π","÷","×","§","Δ"],g=["£","€","¥","^","°","=","{","}","\\","©"],c=["%","®","™","✓","[","]","<",">"],d=k=>{const x=t.value!=="off"?k.toUpperCase():k;e.onKeyPress(x),t.value==="once"&&(t.value="off")},s=()=>{t.value==="off"?t.value="once":t.value==="once"?t.value="caps":t.value="off"},p=(k,_)=>{const x=_?k.toUpperCase():k,S=$t[k]??"";let h=null,$=!1;const J=()=>{$=!1,S&&(h=setTimeout(()=>{$=!0,e.onKeyPress(S)},380))},z=()=>{h&&(clearTimeout(h),h=null)};return f`
      <button
        class="key-btn"
        @pointerdown=${J}
        @pointerup=${z}
        @pointerleave=${z}
        @pointercancel=${z}
        @click=${()=>{h&&(clearTimeout(h),h=null),$||d(k),$=!1}}>
        ${x}
      </button>
    `},N=()=>{let k=null,_=null,x=!1,S=0;const h=()=>{k&&(clearTimeout(k),k=null),_&&(clearInterval(_),_=null)};return f`
      <button
        class="key-btn special"
        @pointerdown=${K=>{S=K.clientX,x=!1,h(),k=setTimeout(()=>{x=!0,e.onBackspace(),_=setInterval(()=>{e.onBackspace()},55)},350)}}
        @pointermove=${K=>{var D;S-K.clientX>=28&&!x&&(x=!0,h(),(D=e.onDeleteWord)==null||D.call(e))}}
        @pointerup=${h}
        @pointerleave=${h}
        @pointercancel=${h}
        @click=${()=>{h(),x||e.onBackspace(),x=!1}}>
        ⌫
      </button>
    `},w=()=>{let k=0,_=0,x=0,S=!1,h=!1;const $=D=>{k=D.clientX,_=D.clientY,x=D.clientX,S=!1,h=!0},J=D=>{var ue;if(!h)return;if(_-D.clientY>=28&&!S){S=!0,h=!1,(ue=e.onSwipeUpSpace)==null||ue.call(e);return}if(!e.onMoveCursor)return;const ce=D.clientX-x;if(Math.abs(D.clientX-k)>10&&(S=!0),Math.abs(ce)>=18){const de=Math.trunc(ce/18);e.onMoveCursor(de),x+=de*18}},z=()=>{h=!1};return f`
      <button
        class="key-btn space"
        @pointerdown=${$}
        @pointermove=${J}
        @pointerup=${z}
        @pointercancel=${z}
        @click=${()=>{S||e.onKeyPress(" "),S=!1}}>
        ${()=>e.stealthMode.value?"stealth space":"space"}
      </button>
    `},Me=()=>{const k=t.value!=="off",_=t.value==="caps"?"⇪":t.value==="once"?"⬆":"⇧",x=t.value==="off"?"key-btn special":"key-btn special active-shift",S=document.createElement("div");S.className="keyboard-row",S.appendChild(y(f`<button class=${x} @click=${s}>${_}</button>`));for(const h of a)S.appendChild(y(p(h,k)));return S.appendChild(y(N())),y(f`
      <div class="keyboard-grid">
        ${()=>{var h;return(h=e.showNumberRow)!=null&&h.value?I("keyboard-row",i.map($=>f`<button class="key-btn" @click=${()=>e.onKeyPress($)}>${$}</button>`)):""}}
        ${I("keyboard-row",o.map(h=>p(h,k)))}
        ${I("keyboard-row",r.map(h=>p(h,k)))}
        ${S}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>n.value="numbers"}>123</button>
          <button class="key-btn special" @click=${e.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${()=>e.onKeyPress(",")}>,</button>
          ${y(w())}
          <button class="key-btn special" @click=${()=>e.onKeyPress(".")}>.</button>
          <button class="key-btn send" @click=${e.onSend}>
            ${()=>e.stealthMode.value?"Ask ⚡":"Send"}
          </button>
        </div>
      </div>
    `)},le=k=>{const _=k?m:i,x=k?g:l,S=k?c:u,h=document.createElement("div");h.className="keyboard-row",h.appendChild(y(f`
        <button
          class="key-btn special"
          @click=${()=>n.value=k?"numbers":"symbols"}>
          ${k?"123":"=\\<"}
        </button>
      `));for(const $ of S)h.appendChild(y(f`<button class="key-btn" @click=${()=>e.onKeyPress($)}>${$}</button>`));return h.appendChild(y(N())),y(f`
      <div class="keyboard-grid">
        ${I("keyboard-row",_.map($=>f`<button class="key-btn" @click=${()=>e.onKeyPress($)}>${$}</button>`))}
        ${I("keyboard-row",x.map($=>f`<button class="key-btn" @click=${()=>e.onKeyPress($)}>${$}</button>`))}
        ${h}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>n.value="alpha"}>ABC</button>
          <button class="key-btn special" @click=${e.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${()=>e.onKeyPress(",")}>,</button>
          ${y(w())}
          <button class="key-btn special" @click=${()=>e.onKeyPress(".")}>.</button>
          <button class="key-btn send" @click=${e.onSend}>
            ${()=>e.stealthMode.value?"Ask ⚡":"Send"}
          </button>
        </div>
      </div>
    `)};return y(f`
    <div class="keyboard-grid-wrapper">
      ${()=>n.value==="numbers"?le(!1):n.value==="symbols"?le(!0):Me()}
    </div>
  `)}const Be="rizzboard_recent_emojis";function ie(){try{const e=localStorage.getItem(Be);if(!e)return["😏","🔥","❤️","😂","✨","👀","💯","🥂"];const t=JSON.parse(e);return Array.isArray(t)&&t.length>0?t:["😏","🔥","❤️","😂"]}catch{return["😏","🔥","❤️","😂"]}}function Tt(e){try{const t=ie().filter(o=>o!==e),n=[e,...t].slice(0,16);localStorage.setItem(Be,JSON.stringify(n))}catch{}}function Pt(e){const t=C(0),n=C(""),o=C(ie()),r=i=>{Tt(i),o.value=ie(),e.onSelectEmoji(i)},a=document.createElement("div");return a.className="emoji-tabs",a.appendChild(y(f`
      <button
        class=${()=>t.value===0?"emoji-tab active":"emoji-tab"}
        @click=${()=>{n.value="",t.value=0}}>
        🕒
      </button>
    `)),H.forEach((i,l)=>{const u=l+1;a.appendChild(y(f`
        <button
          class=${()=>u===t.value?"emoji-tab active":"emoji-tab"}
          @click=${()=>{n.value="",t.value=u}}>
          ${i.icon}
        </button>
      `))}),a.appendChild(y(f`<button class="emoji-tab back-key" @click=${e.onClose}>ABC</button>`)),y(f`
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
      ${()=>{const i=n.value.trim().toLowerCase();let l;if(i){const u=H.filter(m=>m.name.toLowerCase().includes(i));l=u.length>0?u.flatMap(m=>m.emojis):H.flatMap(m=>m.emojis)}else t.value===0?l=o.value:l=(H[t.value-1]??H[0]).emojis;return I("emoji-grid",l.map(u=>f`
            <button class="emoji-btn" @click=${()=>r(u)}>${u}</button>
          `))}}
    </div>
  `)}function Nt(e){const t=C([]),n=o=>{t.value.includes(o)?t.value=t.value.filter(r=>r!==o):t.value=[o,...t.value]};return y(f`
    <div class="clipboard-view">
      <div class="clipboard-header">
        <span>Clipboard — Tap to Paste or ⚡ Reply</span>
        <div style="display:flex; gap:8px; align-items:center;">
          ${e.onClearAll?y(f`<button class="back-link" @click=${e.onClearAll}>Clear</button>`):""}
          <button class="back-link" @click=${e.onClose}>Close ✕</button>
        </div>
      </div>
      ${()=>{const o=t.value,r=[...e.history.value.filter(a=>o.includes(a)),...e.history.value.filter(a=>!o.includes(a))];return r.length===0?y(f`
            <div style="padding: 20px; text-align: center; opacity: 0.6; font-size: 13px;">
              Clipboard is empty. Copy any message to see it here.
            </div>
          `):I("clipboard-list",r.map(a=>{const i=o.includes(a);return f`
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
                ${e.onDeleteClip?y(f`
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
  `)}function At(e){return y(f`
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
  `)}function Et(e){return y(f`
    <div class="nextmove-view">
      <div class="nextmove-header">
        <div class="nextmove-meta">
          <span class="source-chip">
            ${()=>e.resolution.value?dt(e.resolution.value.context):"⚡ Next Move"}
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

      ${()=>{const t=e.resolution.value;return!t||t.suggestions.length===0?y(f`
            <div class="roast-feedback">Tap "Tell Rizz" or "Scan Screen" to load chat context.</div>
          `):I("nextmove-cards",t.suggestions.map(n=>f`
            <div class="vibe-card" @click=${()=>e.onSelectReply(n.line)}>
              <span class="vibe-tag vibe-${n.vibe.toLowerCase()}">${n.vibe}</span>
              <span class="vibe-line">${n.line}</span>
            </div>
          `))}}
    </div>
  `)}function _t(e){const t=o=>{v("click"),lt(o)},n=o=>{v("light"),ct(o)};return y(f`
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
  `)}const Rt=[{icon:"✨",title:"Auto Chat Replies",desc:"Opens automatically when a chat is detected, or swipe up on Spacebar."},{icon:"🔢",title:"Long-Press Numbers & Symbols",desc:`Hold q–p for 1–0, or hold a–m for @ # $ % & - + ( ) * " ' : ; ! ?`},{icon:"⌫",title:"Swipe Left / Hold Backspace",desc:"Hold ⌫ to repeat-delete, or swipe left on ⌫ to delete a whole word."},{icon:"↔️",title:"Spacebar Cursor Scrub",desc:"Slide your finger left or right on Spacebar to move the cursor."},{icon:"🎙️",title:"Google Voice Typing",desc:"Tap Mic in the top bar for instant voice dictation."},{icon:"✂️",title:"Text Editing & D-Pad",desc:"Tap ✂️ for Select All, Copy, Cut, Paste, and arrow keys."},{icon:"📋",title:"Clipboard & Emoji Search",desc:"Pin/delete clips in 📋, or search 250+ emojis in 😏."}];function Ot(e){return y(f`
    <div class="help-view" style="padding: 8px; max-height: 220px; overflow-y: auto;">
      <div class="clipboard-header" style="margin-bottom: 6px;">
        <span>RizzBoard Gestures & Guide</span>
        <div style="display:flex; gap:8px;">
          <button class="back-link" @click=${()=>_e("setup")}>⚙ Setup</button>
          <button class="back-link" @click=${e.onClose}>ABC ✕</button>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${Rt.map(t=>f`
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
  `)}const te=new vt,E=new bt,b=C("qwerty"),P=C(""),X=C((()=>{try{const e=localStorage.getItem("rizzboard_theme");if(e==="amoled"||e==="light"||e==="slate")return e}catch{}return"slate"})()),Y=C((()=>{try{const e=localStorage.getItem("rizzboard_one_handed");if(e==="right"||e==="left"||e==="off")return e}catch{}return"off"})()),oe=C((()=>{try{return localStorage.getItem("rizzboard_number_row")==="true"}catch{}return!1})()),W=C(void 0),R=C(null),M=C(null),T=C(!1),B=C(""),V=C(null),j=C(!1),De=C(null),F=C(["What is your biggest red flag?","Are we still on for coffee this weekend?"]),Bt=Ne(()=>{const e=T.value?B.value:P.value;if(!e)return T.value?["asked","red","weekend"]:["how","are","you"];const t=e.trim().split(/\s+/),n=t[t.length-1];if(e.endsWith(" "))return te.predictNextWord(n,3);{const o=te.completePrefix(n,3);return o.length>0?o:[n]}});ne.registerNativeCallback("appContextChanged",e=>{if(e!=null&&e.packageName){W.value=e.packageName;try{const t=Ee();if(t.status==="ok"&&t.blocks.length>0){const n=E.ingestScreenBlocks(t.blocks,"accessibility",{appPackage:t.appPackage??e.packageName});n&&(R.value=n)}}catch{}}});ne.registerNativeCallback("screenshotDetected",e=>{e!=null&&e.uri&&(R.value={id:`screenshot-${e.timestamp??Date.now()}`,source:"screenshot",partnerText:"Screenshot captured",uri:e.uri,appPackage:e.appPackage??W.value,timestamp:Date.now()},v("heavy"))});ne.registerNativeCallback("contextDetected",e=>{if(!(e!=null&&e.text)||!(e!=null&&e.source))return;const t=E.ingestRawContext({source:e.source,text:e.text,senderName:e.senderName,appPackage:e.appPackage??W.value,timestamp:e.timestamp});t&&(R.value=t,v("click"))});ne.registerNativeCallback("clipboardAdded",e=>{if(e!=null&&e.text){const t=String(e.text).trim();if(!t)return;F.value=[t,...F.value.filter(o=>o!==t).slice(0,9)];const n=E.ingestRawContext({source:"clipboard",text:t,appPackage:W.value});n&&(R.value=n)}});const L=rt();if(L.status==="ok"&&L.text&&L.source){const e=E.ingestRawContext({source:L.source,text:L.text,senderName:L.senderName,appPackage:L.appPackage,timestamp:L.timestamp});e&&(R.value=e)}function we(e){if(v("heavy"),e.source==="screenshot"&&e.uri){const n=ot(e.uri),o=E.ingestScreenBlocks(n.blocks,"screenshot",{appPackage:n.appPackage??e.appPackage,uri:e.uri});if(!o){R.value=null,U("Screenshot looked blank/protected — type what they said:");return}M.value=E.resolveSuggestions(o),R.value=null,T.value=!1,b.value="nextmove";return}M.value=E.resolveSuggestions(e),R.value=null,T.value=!1,b.value="nextmove",new Oe().generateOnlineSuggestions(e.partnerText).then(n=>{var o;((o=M.value)==null?void 0:o.context.id)===e.id&&n.length>=3&&(M.value={...M.value,suggestions:n})}).catch(()=>{})}function ke(){v("click");const e=Ee();if(e.status==="ok"&&e.blocks.length>0){const t=E.ingestScreenBlocks(e.blocks,"accessibility",{appPackage:e.appPackage??W.value});if(t){M.value=E.resolveSuggestions(t),T.value=!1,b.value="nextmove";return}}if(e.status==="not_enabled"){j.value=!0,U("Scanner off — type what they said, or tap Enable Scanner ⚙");return}j.value=!1,U("Screen protected (FLAG_SECURE) — type a quick summary here:")}function U(e){V.value=e??null,T.value=!0,b.value="qwerty"}function Dt(){v("click"),T.value?(T.value=!1,V.value=null,j.value=!1):(j.value=!1,U())}function Ce(){v("heavy");const e=B.value.trim(),t=E.ingestRawContext({source:"manual",text:e||"start playful conversation",appPackage:W.value});t&&(M.value=E.resolveSuggestions(t),T.value=!1,V.value=null,j.value=!1,b.value="nextmove")}function Mt(e){v("heavy"),E.recordCommittedReply(e),q(e),P.value=e,B.value="",b.value="qwerty"}function It(e){const t=E.ingestRawContext({source:"manual",text:e,appPackage:W.value});t&&(t.source="clipboard",M.value=E.resolveSuggestions(t),b.value="nextmove")}function Se(e){if(v("light"),T.value){B.value+=e;return}if(e===" "||e==="."||e===","||e==="!"||e==="?"){const t=P.value.match(/([a-zA-Z']+)$/);if(t){const n=t[1],o=te.autocorrect(n);if(o&&o!==n){for(let r=0;r<n.length;r++)G();P.value=P.value.slice(0,-n.length)+o+e,q(o+e);return}else te.learnWord(n)}}P.value+=e,q(e)}function $e(){if(v("light"),T.value){B.value.length>0&&(B.value=B.value.slice(0,-1));return}P.value.length>0&&(P.value=P.value.slice(0,-1)),G()}function Lt(e){if(v("click"),T.value){const o=B.value,r=o.trim().split(/\s+/),a=o.endsWith(" ")?o:r.length>1?r.slice(0,-1).join(" ")+" ":"";B.value=`${a}${e} `;return}const t=P.value,n=t.trim().split(/\s+/);if(!t.endsWith(" ")&&n.length>0){const o=n[n.length-1];for(let r=0;r<o.length;r++)G()}q(e+" "),P.value=(t.endsWith(" ")?t:n.length>1?n.slice(0,-1).join(" ")+" ":"")+e+" "}function zt(){v("heavy"),De.value=wt(P.value),b.value="roast"}function jt(e){v("click");for(let t=0;t<P.value.length;t++)G();E.recordCommittedReply(e),q(e),P.value=e,b.value="qwerty"}function Wt(){return f`
    <div class="rizz-app" data-theme=${()=>X.value} data-one-handed=${()=>Y.value}>
      ${kt({activeContext:R,stealthMode:T,onOpenContextReplies:()=>{R.value&&we(R.value)},onScanScreen:ke,onToggleStealth:Dt,onToggleRoast:()=>{b.value==="roast"?b.value="qwerty":zt()},onToggleClipboard:()=>b.value=b.value==="clipboard"?"qwerty":"clipboard",onToggleEmojis:()=>b.value=b.value==="emojis"?"qwerty":"emojis",onVoiceInput:()=>{v("click"),at()},onSwitchKeyboard:()=>{v("click"),it()},onToggleTextEdit:()=>b.value=b.value==="textedit"?"qwerty":"textedit",onToggleHelp:()=>b.value=b.value==="help"?"qwerty":"help",onCycleTheme:()=>{v("click");const e=X.value==="slate"?"amoled":X.value==="amoled"?"light":"slate";X.value=e;try{localStorage.setItem("rizzboard_theme",e)}catch{}},onToggleOneHanded:()=>{v("click");const e=Y.value==="off"?"right":Y.value==="right"?"left":"off";Y.value=e;try{localStorage.setItem("rizzboard_one_handed",e)}catch{}},onToggleNumberRow:()=>{v("click");const e=!oe.value;oe.value=e;try{localStorage.setItem("rizzboard_number_row",String(e))}catch{}}})}

      ${()=>T.value?Ct({buffer:B,hint:V,showEnableScanner:j,onGenerate:Ce,onEnableScanner:()=>_e("accessibility"),onCancel:()=>{T.value=!1,V.value=null,j.value=!1}}):""}

      ${St({suggestions:Bt,onSelectSuggestion:Lt})}

      ${()=>{const e=b.value;return e==="nextmove"?Et({resolution:M,onSelectReply:Mt,onSwitchToStealth:()=>{var t;B.value=((t=M.value)==null?void 0:t.context.partnerText)??"",U()},onClose:()=>b.value="qwerty"}):e==="emojis"?Pt({onSelectEmoji:Se,onClose:()=>b.value="qwerty"}):e==="clipboard"?Nt({history:F,onSelectClip:t=>{E.recordCommittedReply(t),q(t),b.value="qwerty"},onAnalyzeClip:t=>{v("heavy"),It(t)},onDeleteClip:t=>{v("light"),F.value=F.value.filter(n=>n!==t)},onClearAll:()=>{v("click"),F.value=[]},onClose:()=>b.value="qwerty"}):e==="roast"?At({roast:De,onApplyUpgrade:jt,onClose:()=>b.value="qwerty"}):e==="textedit"?_t({onBackspace:$e,onClose:()=>b.value="qwerty"}):e==="help"?Ot({onClose:()=>b.value="qwerty"}):xt({stealthMode:T,showNumberRow:oe,onKeyPress:Se,onBackspace:$e,onSend:()=>{T.value?Ce():(v("heavy"),nt())},onOpenEmojis:()=>b.value="emojis",onMoveCursor:t=>{v("light"),st(t)},onDeleteWord:()=>{v("heavy");const t=P.value.match(/(\S+\s*)$/),n=t?t[1].length:1;P.value=P.value.slice(0,-n);for(let o=0;o<n;o++)G()},onSwipeUpSpace:()=>{v("click"),R.value?we(R.value):ke()}})}}
    </div>
  `}const xe=document.getElementById("app");if(xe){const{fragment:e}=se(Wt());xe.appendChild(e)}
