var Ie=Object.defineProperty;var De=(e,t,o)=>t in e?Ie(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o;var P=(e,t,o)=>De(e,typeof t!="symbol"?t+"":t,o);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function o(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=o(r);fetch(r.href,a)}})();let ie=null;const ee=new Set;let K=!1;function Pe(){return ie}function te(e){const t=ie;return ie=e,t}function Ae(e){e.isStale=!0,K?ee.add(e):e.execute()}function Le(e){const t=K;K=!0;try{return e()}finally{K=t,K||We()}}function We(){for(;ee.size>0;){const e=Array.from(ee);ee.clear();for(const t of e)t.isStale&&t.execute()}}class je{constructor(t){P(this,"_value");P(this,"_subscribers",new Set);this._value=t}get value(){const t=Pe();return t&&(this._subscribers.add(t),t.dependencies.add(this)),this._value}set value(t){Object.is(this._value,t)||(this._value=t,this.notify())}peek(){return this._value}notify(){const t=Array.from(this._subscribers);for(const o of t)Ae(o)}_unsubscribe(t){this._subscribers.delete(t)}}function k(e){return new je(e)}class Fe{constructor(t){P(this,"_value");P(this,"_node");P(this,"_subscribers",new Set);P(this,"_isDirty",!0);P(this,"_fn");this._fn=t,this._node={dependencies:new Set,isStale:!0,execute:()=>{if(!this._isDirty){this._isDirty=!0;const o=Array.from(this._subscribers);for(const n of o)Ae(n)}}}}get value(){this._isDirty&&this._recompute();const t=Pe();return t&&(this._subscribers.add(t),t.dependencies.add(this)),this._value}peek(){return this._isDirty&&this._recompute(),this._value}_unsubscribe(t){this._subscribers.delete(t)}_recompute(){for(const o of this._node.dependencies)o._unsubscribe(this._node);this._node.dependencies.clear();const t=te(this._node);try{this._value=this._fn(),this._isDirty=!1,this._node.isStale=!1}finally{te(t)}}}function Ne(e){return new Fe(e)}let He=null;function qe(){return He}function se(e){let t;const o={dependencies:new Set,isStale:!1,execute:()=>{for(const i of o.dependencies)i._unsubscribe(o);if(o.dependencies.clear(),typeof t=="function")try{t()}catch(i){console.error("[Nova Signal Effect Cleanup Error]:",i)}const a=te(o);try{t=e()}finally{te(a),o.isStale=!1}}};o.execute();const n=()=>{for(const a of o.dependencies)a._unsubscribe(o);o.dependencies.clear(),typeof t=="function"&&t()},r=qe();return r&&r.addCleanup(n),n}function Me(){return typeof window<"u"&&"Part"in window&&"ChildNodePart"in window&&typeof window.getParts=="function"}class me{constructor(t){P(this,"parentNode");P(this,"previousSibling");P(this,"nextSibling");P(this,"value");P(this,"_currentNode");const o=t.parentNode;if(!o)throw new Error("[Zuari DOM Parts]: Placeholder node must have a parent container.");this.parentNode=o,this.previousSibling=t.previousSibling,this.nextSibling=t.nextSibling;const n=document.createTextNode("");o.replaceChild(n,t),this._currentNode=n}setValue(t){if(this.value=t,t instanceof DocumentFragment){const o=document.createTextNode("");this.parentNode.replaceChild(o,this._currentNode),this.parentNode.insertBefore(t,o),this._currentNode=o;return}if(t instanceof Node){this._currentNode!==t&&(this.parentNode.replaceChild(t,this._currentNode),this._currentNode=t);return}if(this._currentNode instanceof Text)this._currentNode.data=String(t??"");else{const o=document.createTextNode(String(t??""));this.parentNode.replaceChild(o,this._currentNode),this._currentNode=o}}disconnect(){}}class pe{constructor(t,o){P(this,"element");P(this,"attributeName");P(this,"value");this.element=t,this.attributeName=o}setValue(t){this.value=t,t===!1||t===null||t===void 0?this.element.removeAttribute(this.attributeName):this.element.setAttribute(this.attributeName,String(t))}disconnect(){this.element.removeAttribute(this.attributeName)}}function Ke(e){if(Me())try{const t=window.ChildNodePart;return new t(e)}catch{return new me(e)}return new me(e)}function Ve(e,t){if(Me())try{const o=window.AttributePart;return new o(e,t)}catch{return new pe(e,t)}return new pe(e,t)}function Ze(e,t,o,n){const r=Ue(e,`<!--zuari-hole-${t}-->`);if(r){const v=Ke(r);if(fe(o)){const c=se(()=>v.setValue(ye(o)));n.push(()=>{var m;c(),(m=v.disconnect)==null||m.call(v)})}else v.setValue(o);return}const a=`data-zuari-attr-${t}`,i=Ge(e,a);if(!i)return;const{element:l,attrName:u}=i;if(u.startsWith("@")||u.startsWith("on")){const v=(u.startsWith("@")?u.slice(1):u.slice(2)).toLowerCase();if(l.removeAttribute(u),typeof o!="function")return;const c=o;l.addEventListener(v,c),n.push(()=>l.removeEventListener(v,c));return}const f=Ve(l,u);if(fe(o)){const v=se(()=>f.setValue(ye(o)));n.push(()=>{var c;v(),(c=f.disconnect)==null||c.call(f)})}else f.setValue(o)}function fe(e){return typeof e=="object"&&e!==null&&"value"in e||typeof e=="function"}function ye(e){return typeof e=="object"&&e!==null&&"value"in e?e.value:typeof e=="function"?e():e}function Ue(e,t){const o=document.createNodeIterator(e,NodeFilter.SHOW_COMMENT);let n=o.nextNode();for(;n;){if(`<!--${n.data}-->`===t)return n;n=o.nextNode()}return null}function Ge(e,t){const o=document.createNodeIterator(e,NodeFilter.SHOW_ELEMENT);let n=o.nextNode();for(;n;){for(const r of Array.from(n.attributes))if(r.value.includes(t))return{element:n,attrName:r.name};n=o.nextNode()}return null}const ge=new Map,Ye="<!--zuari-hole-",Je="-->",Xe="data-zuari-attr-";function h(e,...t){return{strings:e,values:t}}function ce(e,t){const{strings:o,values:n}=e,r=o.join("<!--?-->");let a=ge.get(r);a||(a=document.createElement("template"),a.innerHTML=o.reduce((f,v,c)=>{if(c>=n.length)return f+v;const s=/=["']?[^"'>]*$/.test(v)?`"${Xe}${c}"`:`${Ye}${c}${Je}`;return f+v+s},""),ge.set(r,a));const i=a.content.cloneNode(!0),l=Array.from(i.childNodes),u=[];return n.forEach((f,v)=>Ze(i,v,f,u)),{fragment:i,destroy(){u.forEach(f=>f()),l.forEach(f=>{var v;return(v=f.parentNode)==null?void 0:v.removeChild(f)})}}}const Qe={primary:"#006A6A",onPrimary:"#FFFFFF",primaryContainer:"#6FF7F6",onPrimaryContainer:"#002020",secondary:"#4A6363",onSecondary:"#FFFFFF",background:"#FAFDFD",onBackground:"#191C1C",surface:"#FAFDFD",onSurface:"#191C1C",surfaceVariant:"#DAE5E4",outline:"#6F7979"},et={primary:"#4CDADA",onPrimary:"#003737",primaryContainer:"#004F4F",onPrimaryContainer:"#6FF7F6",secondary:"#B1CCCC",onSecondary:"#1C3534",background:"#191C1C",onBackground:"#E1E3E3",surface:"#191C1C",onSurface:"#E1E3E3",surfaceVariant:"#3F4948",outline:"#899392"};function tt(e=!1){const t=k(e),o=k(e?{...et}:{...Qe}),n=Ne(()=>!!(typeof navigator<"u"&&/android/i.test(navigator.userAgent)||typeof window<"u"&&window.Android)),r=new Map;typeof window<"u"&&(window.__zuariKotlinDispatcher=(c,m)=>{const s=r.get(c);if(s)try{const y=JSON.parse(m);s(y)}catch{s(m)}});function a(c,...m){return new Promise((s,y)=>{if(typeof window<"u"&&window.Android){const T=window.Android;if(typeof T[c]=="function")try{const w=T[c](...m);try{s(JSON.parse(w))}catch{s(w)}return}catch(w){y(w);return}}s({success:!0,mock:!0,function:c,args:m})})}function i(c,m){return r.set(c,m),()=>{r.delete(c)}}function l(c){Le(()=>{o.value={...o.value,...c}})}function u(c){const m=(c==null?void 0:c.packageName)??"com.zuari.ui.theme",s=(c==null?void 0:c.themeName)??"ZuariTheme",y={...o.value,...(c==null?void 0:c.colors)??{}};return`package ${m}

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
`}function f(c){const m=(c==null?void 0:c.themeName)??"Theme.Zuari.Native",s={...o.value,...(c==null?void 0:c.colors)??{}};return`<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by @zuari/kotlin Native Android Bridge -->
<resources>
    <style name="${m}" parent="Theme.Material3.DayNight.NoActionBar">
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
`}function v(c){const m=c??(typeof document<"u"?document.documentElement:null);return m?se(()=>{const s=o.value;m.style.setProperty("--md-sys-color-primary",s.primary),m.style.setProperty("--md-sys-color-on-primary",s.onPrimary),m.style.setProperty("--md-sys-color-primary-container",s.primaryContainer),m.style.setProperty("--md-sys-color-on-primary-container",s.onPrimaryContainer),m.style.setProperty("--md-sys-color-secondary",s.secondary),m.style.setProperty("--md-sys-color-on-secondary",s.onSecondary),m.style.setProperty("--md-sys-color-background",s.background),m.style.setProperty("--md-sys-color-on-background",s.onBackground),m.style.setProperty("--md-sys-color-surface",s.surface),m.style.setProperty("--md-sys-color-on-surface",s.onSurface),m.style.setProperty("--md-sys-color-surface-variant",s.surfaceVariant),m.style.setProperty("--md-sys-color-outline",s.outline)}):()=>{}}return{isAndroid:n,dynamicColors:o,isDarkTheme:t,callNativeFunction:a,registerNativeCallback:i,generateComposeThemeCode:u,generateXmlThemeCode:f,ingestDynamicPalette:l,applyToCssVariables:v}}const ne=tt(!0);function O(){return typeof window<"u"&&window.Android?window.Android:null}function W(e){const t=O();t?t.commitText(e):console.log("[Dev Mock Commit]:",e)}function U(){const e=O();e?e.deleteBackward():console.log("[Dev Mock Delete]")}function ot(){const e=O();e?e.sendEnter():console.log("[Dev Mock Enter]")}function b(e="click"){const t=O();t&&typeof t.triggerHaptic=="function"&&t.triggerHaptic(e)}function nt(e){const t=O();if(t&&typeof t.requestScreenshotAnalysis=="function")try{const o=t.requestScreenshotAnalysis(e);return JSON.parse(o)}catch{return{status:"error",blocks:[]}}return{status:"ok",blocks:[{text:"Are you free for drinks this weekend?",x:48,y:420,width:320,screenWidth:1080}]}}function _e(){const e=O();if(e&&typeof e.requestScreenScan=="function")try{const t=e.requestScreenScan();return JSON.parse(t)}catch{return{status:"error",blocks:[]}}return{status:"ok",appPackage:"com.snapchat.android",blocks:[{text:"What is your biggest red flag?",x:52,y:460,width:300,screenWidth:1080}]}}function rt(){const e=O();if(e&&typeof e.getActiveContext=="function")try{return JSON.parse(e.getActiveContext())}catch{return{status:"none"}}return{status:"none"}}function Ee(e){const t=O();t&&typeof t.openSystemSetting=="function"?t.openSystemSetting(e):console.log("[Dev Mock Open Setting]:",e)}function at(){const e=O();e&&typeof e.startVoiceTyping=="function"?e.startVoiceTyping():console.log("[Dev Mock Voice Typing]")}function it(){const e=O();e&&typeof e.showInputMethodPicker=="function"?e.showInputMethodPicker():console.log("[Dev Mock IME Picker]")}function st(e){const t=O();t&&typeof t.moveCursor=="function"&&t.moveCursor(e)}function lt(e){const t=O();t&&typeof t.performEditAction=="function"&&t.performEditAction(e)}function ct(e){const t=O();t&&typeof t.sendDpad=="function"&&t.sendDpad(e)}function ve(e,t){return`You are an elite wingman who excels at playful, concise, charismatic banter.
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

Output ONLY a JSON array with objects: [{"vibe": "Smooth", "line": "..."}, {"vibe": "Tease", "line": "..."}, {"vibe": "Bold", "line": "..."}]`}const be={"com.snapchat.android":"Snapchat","org.telegram.messenger":"Telegram","org.thoughtcrime.securesms":"Signal","co.hinge.app":"Hinge","com.bumble.app":"Bumble","com.tinder":"Tinder","com.instagram.android":"Instagram","com.whatsapp":"WhatsApp","web.whatsapp.com":"WhatsApp Web","instagram.com":"Instagram DM","web.telegram.org":"Telegram Web","tinder.com":"Tinder Web","bumble.com":"Bumble Web","discord.com":"Discord","x.com":"X DM"};function Re(e){if(!e)return;const t=e.replace(/^www\./i,"");if(be[t])return be[t];const o=t.split("."),n=o[o.length-1];if(!n||["android","app","messenger","com","org","io"].includes(n)){const r=o[o.length-2];return r?r.charAt(0).toUpperCase()+r.slice(1):void 0}return n.charAt(0).toUpperCase()+n.slice(1)}function dt(e){const t=Re(e.appPackage);switch(e.source){case"screenshot":return"📸 Screenshot";case"notification":return t?`🔔 ${t} Msg`:"🔔 Incoming Msg";case"clipboard":return"📋 Copied Bubble";case"accessibility":return t?`👁️ ${t} Scan`:"👁️ Screen Scan";case"selection":return"✨ Selected Text";case"dom":return t?`🌐 ${t} Chat`:"🌐 Web Chat";case"manual":return"💬 Stealth Context"}}function ht(e){const t=e.partnerText.length>26?`${e.partnerText.slice(0,26).trim()}…`:e.partnerText;switch(e.source){case"screenshot":return"📸 Screenshot Detected: Analyze Next Move";case"notification":{const o=Re(e.appPackage);return o?`🔔 ${o}: "${t}" — Reply`:`🔔 New Msg: "${t}" — Reply`}case"clipboard":return`📋 Copied: "${t}" — Reply`;case"accessibility":case"dom":return`👁️ Scanned: "${t}" — Reply`;case"selection":return`✨ Selected: "${t}" — Reply`;case"manual":return"💬 Context Ready — View Replies"}}class mt{constructor(){this.recentSelfCommits=new Set}recordSelfCommit(t){const o=this.normalize(t);if(o&&(this.recentSelfCommits.add(o),this.recentSelfCommits.size>25)){const n=this.recentSelfCommits.values().next().value;n&&this.recentSelfCommits.delete(n)}}isIgnored(t,o){const n=t.trim();if(!n)return!0;if(o==="manual"||o==="selection")return!1;const r=this.normalize(n);return!!(this.recentSelfCommits.has(r)||/^https?:\/\/\S+$/i.test(n)||/^\d{4,8}$/.test(n))}normalize(t){return t.toLowerCase().replace(/\s+/g," ").trim()}}function pt(e){const t={rawBlocks:e.map(n=>n.text)};if(e.length===0)return t;const o=e.filter(n=>{const r=n.y<120,a=n.y>n.screenWidth*1.8;return!r&&!a});o.sort((n,r)=>n.y-r.y);for(let n=o.length-1;n>=0;n--){const r=o[n],a=r.x+r.width/2>r.screenWidth/2;if(!a&&!t.senderText?t.senderText=r.text:a&&!t.myLastText&&(t.myLastText=r.text),t.senderText&&t.myLastText)break}return t}const ft=[{id:"op-1",category:"opener",vibe:"playful",triggerKeywords:["travel","hiking","nature"],template:"Are you as adventurous as your profile says, or do you also get lost in grocery stores?"},{id:"op-2",category:"opener",vibe:"smooth",triggerKeywords:["smile","eyes","cute"],template:"I was going to wait two days to message you, but patience was never my strong suit."},{id:"op-3",category:"opener",vibe:"witty",triggerKeywords:["food","coffee","cooking"],template:"Important question: what is your most controversial culinary opinion?"},{id:"bt-1",category:"banter",vibe:"playful",triggerKeywords:["trouble","sarcasm","bad"],template:"Are you always this much trouble or did I catch you on a good day?"},{id:"bt-2",category:"banter",vibe:"witty",triggerKeywords:["challenge","bet","win"],template:"Careful, high expectations are my only weakness."},{id:"bt-3",category:"banter",vibe:"bold",triggerKeywords:["rules","late","fast"],template:"I would say you are five minutes away from being my favorite person."},{id:"wp-1",category:"wordplay",vibe:"witty",triggerKeywords:["smart","books","study","work"],template:"Are you an overdue library book? Because you have fine written all over you."},{id:"wp-2",category:"wordplay",vibe:"smooth",triggerKeywords:["music","song","playlist"],template:"If our conversation was a playlist, I would have it on repeat."},{id:"cl-1",category:"closer",vibe:"bold",triggerKeywords:["drinks","date","weekend","meet","free","tonight"],template:"Drinks this Thursday. You pick the spot, I will bring the conversation."},{id:"cl-2",category:"closer",vibe:"smooth",triggerKeywords:["coffee","tea","afternoon","sunday","morning"],template:"Let us see if you are as fun in person. Coffee tomorrow?"},{id:"rf-1",category:"banter",vibe:"playful",triggerKeywords:["red flag","toxic","flaw","worst"],template:"My biggest red flag is thinking I can win every staring contest."},{id:"sn-1",category:"banter",vibe:"bold",triggerKeywords:["snap","streak","vanish","secret","disappear"],template:"Disappearing messages just mean we have to make every line count."},{id:"wy-1",category:"banter",vibe:"witty",triggerKeywords:["wyd","doing","bored","up to","plans"],template:"Plotting my next move, and you just walked right into it."},{id:"pt-1",category:"opener",vibe:"playful",triggerKeywords:["dog","puppy","cat","pet","gym","workout"],template:"Be honest: am I competing with your pet for attention, or do I stand a chance?"}];function yt(e,t=3){const o=e.toLowerCase();if(!o.trim())return[];const n=ft.map(r=>{let a=0;for(const i of r.triggerKeywords)o.includes(i)&&(a+=2);return{entry:r,score:a}}).filter(r=>r.score>0);return n.sort((r,a)=>a.score-r.score),n.slice(0,t).map(r=>r.entry)}function gt(e){const t=new Set(["the","and","for","are","you","that","this","with","have","what","when","where","why","how","just","like","really","very","about","from","they","them","your","mine","been","were","was","will","would","could","should","going","doing","want","need","know","think","today","tonight","tomorrow","lol","haha","lmao","yeah","yep","nope","okay","hey","hii","hello"]),o=e.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(n=>n.length>=4&&!t.has(n));return o.length>0?o[o.length-1]:null}class Oe{generateOfflineSuggestions(t,o){const n=t.trim(),r=n.toLowerCase(),a=yt(n,3),i={};for(const w of a)w.vibe==="smooth"&&!i.Smooth?i.Smooth=w.template:(w.vibe==="playful"||w.vibe==="witty")&&!i.Tease?i.Tease=w.template:w.vibe==="bold"&&!i.Bold&&(i.Bold=w.template);for(const w of a)!i.Smooth&&w.template!==i.Tease&&w.template!==i.Bold?i.Smooth=w.template:!i.Tease&&w.template!==i.Smooth&&w.template!==i.Bold?i.Tease=w.template:!i.Bold&&w.template!==i.Smooth&&w.template!==i.Tease&&(i.Bold=w.template);const l=gt(n),u=n.includes("?")||/^(what|why|how|where|when|who|are|do|did|would|can|wanna)\b/i.test(n),f=n.length>0&&n.split(/\s+/).length<=2&&!u,v=/^(hey|hi|hello|yo|sup|heyy+|hii+|gm|good morning)\b/i.test(r),c=/\b(sorry|my bad|apologize|late|missed)\b/i.test(r),m=/\b(cute|hot|pretty|handsome|smart|funny|sweet|love your|like your)\b/i.test(r);let s,y,T;return v?(s="Was literally just thinking about texting you—great timing.",y="Look who finally decided to grace my notifications.",T="Hey—skipping the small talk, how is your week looking?"):c?(s="All good, life happens. Just glad you are here now.",y="You owe me a coffee for the suspense, then we are even.",T="Apology accepted—make it up to me this weekend?"):m?(s="Careful, keep talking like that and I might actually blush.",y="Flattery will get you everywhere—what else you got?",T="Say that again in person over drinks."):u&&l?(s=`Honestly, ${l} is a whole story—I will tell you the good part.`,y=`Depends—are you asking about ${l} out of curiosity or research?`,T=`Better ${l} story in person. Are you free Thursday?`):u?(s="Careful, the honest answer might make you like me more.",y="I plead the fifth—unless you are buying the first round.",T="Better story in person. When are we hanging out?"):f?(s="A person of few words—good thing I speak fluent mystery.",y="Do not hurt your thumbs typing a whole novel over there.",T="Tell me what you are actually up to right now."):l?(s=`Okay, ${l} actually sounds like my kind of vibe.`,y=`Wait, you cannot just drop "${l}" and not elaborate.`,T=`We definitely need to talk more about ${l}—coffee this week?`):r.includes("haha")||r.includes("lol")||r.includes("lmao")?(s="Making you laugh this early is dangerous for both of us.",y="Glad I could entertain you—my rates go up after midnight.",T="Wait until you hear my actual voice—call later?"):(s="I was going to play it cool, but you made that impossible.",y="Are you always this much trouble or is today special?",T="Skip the small talk: what is your go-to spot for drinks?"),[{vibe:"Smooth",line:i.Smooth??s},{vibe:"Tease",line:i.Tease??y},{vibe:"Bold",line:i.Bold??T}]}async generateOnlineSuggestions(t,o){var i,l,u;const n=this.generateOfflineSuggestions(t,o);if(typeof fetch!="function")return n;const r=new AbortController,a=setTimeout(()=>r.abort(),4e3);try{const f=`${ve(t,o)}
Return ONLY a JSON array of 3 objects: [{"vibe":"Smooth","line":"..."},{"vibe":"Tease","line":"..."},{"vibe":"Bold","line":"..."}]`,v=await fetch("https://text.pollinations.ai/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:"You are a concise, witty dating/chat assistant. Reply ONLY with valid JSON."},{role:"user",content:f}],model:"openai"}),signal:r.signal});if(clearTimeout(a),!v.ok)return n;const m=(await v.text()).match(/\[[\s\S]*\]/);if(!m)return n;const s=JSON.parse(m[0]);return!Array.isArray(s)||s.length<3?n:[{vibe:"Smooth",line:String(((i=s[0])==null?void 0:i.line)||n[0].line)},{vibe:"Tease",line:String(((l=s[1])==null?void 0:l.line)||n[1].line)},{vibe:"Bold",line:String(((u=s[2])==null?void 0:u.line)||n[2].line)}]}catch{return clearTimeout(a),n}}getPromptForChat(t,o){return ve(t,o)}getPromptForRewrite(t){return ut(t)}}class vt{constructor(){this.engine=new Oe,this.filter=new mt,this.lastProcessedSignature=""}recordCommittedReply(t){this.filter.recordSelfCommit(t)}isIgnoredNoiseOrSelf(t,o){return this.filter.isIgnored(t,o)}ingestRawContext(t){var a,i;const o=t.text.replace(/\s+/g," ").trim();if(this.filter.isIgnored(o,t.source))return null;const n=`${t.source}:${t.appPackage??""}:${this.filter.normalize(o)}`;if(t.source!=="manual"&&t.source!=="selection"&&n===this.lastProcessedSignature)return null;this.lastProcessedSignature=n;const r=t.timestamp??Date.now();return{id:`${t.source}-${r}`,source:t.source,partnerText:o,myLastText:((a=t.myLastText)==null?void 0:a.trim())||void 0,senderName:((i=t.senderName)==null?void 0:i.trim())||void 0,appPackage:t.appPackage,uri:t.uri,timestamp:r}}ingestScreenBlocks(t,o,n){var i;if(!t||t.length===0)return null;const r=pt(t),a=r.senderText??r.rawBlocks.find(l=>!this.filter.isIgnored(l,o));return a?{id:`${o}-${(n==null?void 0:n.timestamp)??Date.now()}`,source:o,partnerText:a.trim(),myLastText:(i=r.myLastText)==null?void 0:i.trim(),appPackage:n==null?void 0:n.appPackage,uri:n==null?void 0:n.uri,timestamp:(n==null?void 0:n.timestamp)??Date.now()}:null}resolveSuggestions(t){const o=this.engine.generateOfflineSuggestions(t.partnerText,t.myLastText);return{context:t,suggestions:o}}}const we={i:"I",im:"I'm",ive:"I've",ill:"I'll",id:"I'd",dont:"don't",cant:"can't",wont:"won't",didnt:"didn't",doesnt:"doesn't",isnt:"isn't",arent:"aren't",wasnt:"wasn't",werent:"weren't",havent:"haven't",hasnt:"hasn't",hadnt:"hadn't",wouldnt:"wouldn't",couldnt:"couldn't",shouldnt:"shouldn't",youre:"you're",youve:"you've",youll:"you'll",theyre:"they're",thats:"that's",whats:"what's",heres:"here's",theres:"there's",wheres:"where's",lets:"let's",teh:"the",hte:"the",adn:"and",nad:"and",taht:"that",waht:"what",whta:"what",hwat:"what",wiht:"with",wtih:"with",jsut:"just",jstu:"just",liek:"like",lke:"like",realy:"really",relly:"really",definately:"definitely",definetly:"definitely",seperate:"separate",recieve:"receive",occured:"occurred",untill:"until",tommorow:"tomorrow",tomorow:"tomorrow",tonite:"tonight",becuase:"because",beacuse:"because",freind:"friend",frend:"friend",prolly:"probably",probly:"probably",thx:"thanks",ty:"thank you",pls:"please",plz:"please",sry:"sorry",srry:"sorry",msg:"message",bday:"birthday",wknd:"weekend",tmrw:"tomorrow"};class bt{constructor(){this.root={children:new Map,isWord:!1,frequency:0},this.bigrams=new Map,this.dictionaryWords=new Set,this.personalWords=new Set,this.seedCommonVocabulary()}insert(t,o=1){let n=this.root;const r=t.toLowerCase();for(const a of r)n.children.has(a)||n.children.set(a,{children:new Map,isWord:!1,frequency:0}),n=n.children.get(a);n.isWord=!0,n.frequency+=o,this.dictionaryWords.add(r)}learnWord(t){const o=t.trim().replace(/[^a-zA-Z']/g,"");o.length<2||(this.insert(o,25),this.personalWords.add(o.toLowerCase()))}getPersonalDictionary(){return Array.from(this.personalWords).sort()}hasWord(t){return this.dictionaryWords.has(t.toLowerCase())}autocorrect(t){const o=t.trim();if(!o||o.length<1)return null;const n=o.toLowerCase();if(we[n]){const i=we[n];return o[0]===o[0].toUpperCase()&&i[0]!==i[0].toUpperCase()?i[0].toUpperCase()+i.slice(1):i}if(this.dictionaryWords.has(n)||n.length<3)return null;let r=null,a=0;for(const i of this.dictionaryWords)if(!(Math.abs(i.length-n.length)>1)&&this.levenshtein(n,i)===1){const l=this.getWordFrequency(i);l>a&&(a=l,r=i)}return r?o[0]===o[0].toUpperCase()?r[0].toUpperCase()+r.slice(1):r:null}getWordFrequency(t){let o=this.root;for(const n of t.toLowerCase()){const r=o.children.get(n);if(!r)return 0;o=r}return o.isWord?o.frequency:0}levenshtein(t,o){const n=t.length,r=o.length,a=Array.from({length:r+1},(i,l)=>l);for(let i=1;i<=n;i++){let l=a[0];a[0]=i;for(let u=1;u<=r;u++){const f=a[u];t[i-1]===o[u-1]?a[u]=l:a[u]=1+Math.min(l,a[u],a[u-1]),l=f}}return a[r]}addBigram(t,o){const n=t.toLowerCase(),r=o.toLowerCase();let a=this.bigrams.get(n);a||(a=[],this.bigrams.set(n,a));const i=a.find(l=>l.word===r);i?i.count++:a.push({word:r,count:1}),a.sort((l,u)=>u.count-l.count)}completePrefix(t,o=3){if(!t)return[];let n=this.root;const r=t.toLowerCase();for(const i of r){if(!n.children.has(i))return[];n=n.children.get(i)}const a=[];return this.collectWords(n,r,a),a.sort((i,l)=>l.frequency-i.frequency),a.slice(0,o).map(i=>i.word)}predictNextWord(t,o=3){if(!t)return["the","you","I"];const n=t.toLowerCase(),r=this.bigrams.get(n);return r&&r.length>0?r.slice(0,o).map(a=>a.word):["and","to","you"]}collectWords(t,o,n){t.isWord&&n.push({word:o,frequency:t.frequency});for(const[r,a]of t.children.entries())this.collectWords(a,o+r,n)}seedCommonVocabulary(){const t=[["the",200],["be",180],["to",180],["of",175],["and",175],["a",170],["in",165],["that",160],["have",155],["it",155],["for",150],["not",145],["on",145],["with",140],["he",135],["as",135],["you",190],["do",130],["at",130],["this",130],["but",125],["his",120],["by",120],["from",120],["they",120],["we",125],["say",115],["her",115],["she",115],["or",115],["an",115],["will",120],["my",130],["one",115],["all",115],["would",115],["there",115],["their",110],["what",140],["so",125],["up",110],["out",110],["if",115],["about",120],["who",110],["get",115],["which",105],["go",115],["me",125],["when",120],["make",110],["can",125],["like",130],["time",115],["no",115],["just",125],["him",105],["know",120],["take",105],["people",100],["into",100],["year",95],["your",130],["good",125],["some",105],["could",105],["them",105],["see",115],["other",100],["than",100],["then",105],["now",115],["look",105],["only",105],["come",105],["its",100],["over",100],["think",110],["also",100],["back",105],["after",100],["use",100],["two",95],["how",135],["our",105],["work",105],["first",100],["well",110],["way",105],["even",100],["new",100],["want",115],["because",105],["any",100],["these",95],["give",95],["day",105],["most",95],["us",100],["are",150],["was",130],["were",110],["been",105],["has",110],["had",110],["free",110],["tonight",105],["tomorrow",100],["weekend",110],["coffee",95],["drinks",95],["dinner",95],["lunch",90],["plans",95],["sounds",105],["love",120],["talking",90],["where",115],["why",110],["going",115],["great",115],["amazing",95],["awesome",95],["cool",100],["nice",105],["sorry",100],["thanks",105],["please",105],["maybe",95],["definitely",90],["probably",90],["actually",95],["really",115],["very",110],["morning",95],["night",105],["today",105],["soon",95],["later",95],["ready",90],["busy",90],["happy",95],["excited",90],["miss",95],["wait",95],["meet",95]];for(const[n,r]of t)this.insert(n,r);const o=[["how","are"],["how","is"],["how","was"],["are","you"],["are","we"],["are","they"],["you","free"],["you","doing"],["you","up"],["what","are"],["what","is"],["what","do"],["want","to"],["going","to"],["have","to"],["good","morning"],["good","night"],["good","idea"],["sounds","good"],["sounds","great"],["sounds","fun"],["see","you"],["talk","to"],["let","me"],["on","my"],["my","way"],["this","weekend"]];for(const[n,r]of o)this.addBigram(n,r)}}function wt(e){const t=e.trim(),o=t.toLowerCase();return t?/^(hey|hi|hello|sup|yo|wyd|what'?s up)$/i.test(t)?{score:2,verdict:"Dry",feedback:"Low effort opener. High ghosting probability (~90%).",improved:"Important question: what is your most controversial food opinion?"}:o.includes("how are you")||o.includes("how was your day")?{score:4,verdict:"Safe",feedback:"Polite but sounds like an HR interview.",improved:"Tell me your day was more exciting than grocery shopping."}:o.includes("cutie")||o.includes("beautiful")||o.includes("gorgeous")?{score:5,verdict:"Safe",feedback:"Compliment is sweet, but every other match says the exact same thing.",improved:"I was going to play it cool, but you made that impossible."}:o.includes("trouble")||o.includes("bet")||o.includes("drinks")||o.includes("coffee")?{score:9,verdict:"Smooth",feedback:"High energy, playful intrigue. Ready to send.",improved:t}:{score:7,verdict:"Smooth",feedback:"Solid message. Could use 10% more cheekiness.",improved:`${t} — unless you scare easily.`}:{score:1,verdict:"Dry",feedback:"Empty canvas. Drop something bold.",improved:"Are we breaking records or rules tonight?"}}const q=[{name:"Smileys & Rizz",icon:"😏",emojis:["😏","😉","😎","😜","😝","😛","🥳","🤩","😍","🥰","😘","😗","😙","😚","🤗","🤭","🤫","🫠","🫡","🤔","🤨","😐","😑","😶","🙄","😬","😌","😔","😪","😴","😂","🤣","😭","😅","😆","😁","😄","😃","😀","🙂","😈","👿","🫦","💅","👀","✨","🔥","💀","🤡","🥺"]},{name:"Love & Hearts",icon:"❤️",emojis:["❤️","❤️‍🔥","❤️‍🩹","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💖","💗","💓","💞","💕","💘","💝","💟","❣️","💔","💋","💌","💍","💎","🌹","🥀","💐","🌷","🌸","🥂","🍾","🍫","🍓","🍒","🫶","🫰","💑","👩‍❤️‍👨","💏"]},{name:"Gestures & Reactions",icon:"✌️",emojis:["👍","👎","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","☝️","✋","🤚","🖐️","🖖","👋","🤝","🙏","👏","🙌","👐","🤲","✊","👊","🤛","🤜","💪","🦾","🫶","🤦‍♂️","🤦‍♀️","🤷‍♂️","🤷‍♀️","💯","🎯"]},{name:"People & Vibes",icon:"🕺",emojis:["🕺","💃","👯","🧘","🏄","🚴","🏋️","🤸","🥷","🕵️","👑","🎩","🕶️","👓","🧣","👗","👔","👟","👠","👜","🧠","🫀","👁️","👅","👄","👂","👃","🫂","🗣️","👤"]},{name:"Food & Dates",icon:"☕",emojis:["☕","🍵","🧋","🥤","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🍾","🍕","🍔","🍟","🌭","🌮","🌯","🍣","🍜","🍝","🍛","🍱","🥟","🍤","🍦","🍨","🍩","🍪","🎂","🍰","🧁","🍫","🍿","🥐","🥯","🥞","🧇","🥓","🍳"]},{name:"Activities & Travel",icon:"✈️",emojis:["✈️","🚗","🏎️","🚕","🚌","🚆","🚀","🛸","⛵","🏖️","🏝️","🏔️","🏕️","🌅","🌄","🌃","🌆","🎡","🎢","🎬","🎤","🎧","🎼","🎹","🎸","🥁","🎮","🕹️","🎲","♟️","🎳","🎯","⚽","🏀","🏈","⚾","🎾","🏐","🏆","🥇"]},{name:"Symbols & Tech",icon:"⚡",emojis:["⚡","⭐","🌟","💫","✨","💥","💢","💦","💨","💤","💬","💭","🗯️","🔔","🔕","🔒","🔓","🔑","📱","💻","⌨️","📷","📸","🎥","📺","📻","⏰","⏳","💡","🔋","✅","❌","❓","❗","‼️","⁉️","⚠️","🚫","♻️","♾️"]}];function d(e){const{fragment:t}=ce(e);if(t.childElementCount===1&&t.firstElementChild)return t.firstElementChild;const o=document.createElement("div");return o.style.display="contents",o.appendChild(t),o}function I(e,t){const o=document.createElement("div");o.className=e;for(const n of t){const{fragment:r}=ce(n);o.appendChild(r)}return o}function M(e,t=18){return h`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d=${e}/></svg>`}const _={mic:()=>M("M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8"),scan:()=>M("M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"),chat:()=>M("M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"),flame:()=>M("M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"),clipboard:()=>M("M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6v4H9z"),emoji:()=>M("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01"),edit:()=>M("M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"),help:()=>M("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01"),theme:()=>M("M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"),oneHanded:()=>M("M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2 M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2 M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8 M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"),numbers:()=>M("M4 9h16 M4 15h16 M10 3L8 21 M16 3l-2 18"),globe:()=>M("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"),talks:()=>M("M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"),height:()=>M("M12 3v18 M8 7l4-4 4 4 M8 17l4 4 4-4")};function kt(e){return d(h`
    <div class="action-bar">
      ${()=>e.activeContext.value?d(h`
            <button class="action-pill highlight" @click=${e.onOpenContextReplies}>
              ${ht(e.activeContext.value)}
            </button>
          `):""}
      <button class="action-pill" @click=${e.onVoiceInput} title="Google Voice Typing">
        ${d(_.mic())}
      </button>
      <button class="action-pill" @click=${e.onScanScreen} title="Scan Screen">
        ${d(_.scan())}
      </button>
      <button
        class=${()=>e.stealthMode.value?"action-pill active-mode":"action-pill"}
        @click=${e.onToggleStealth}
        title="Tell Rizz">
        ${d(_.chat())}
      </button>
      <button class="action-pill" @click=${e.onToggleRoast} title="Roast Draft">
        ${d(_.flame())}
      </button>
      <button class="action-pill" @click=${e.onToggleClipboard} title="Clipboard">
        ${d(_.clipboard())}
      </button>
      <button class="action-pill" @click=${e.onToggleEmojis} title="Emojis">
        ${d(_.emoji())}
      </button>
      <button class="action-pill" @click=${e.onToggleTextEdit} title="Text Editing">
        ${d(_.edit())}
      </button>
      <button class="action-pill" @click=${e.onToggleHelp} title="Help & Gestures">
        ${d(_.help())}
      </button>
      <button class="action-pill" @click=${e.onCycleTheme} title="Switch Theme">
        ${d(_.theme())}
      </button>
      <button class="action-pill" @click=${e.onToggleOneHanded} title="One-Handed Mode">
        ${d(_.oneHanded())}
      </button>
      <button class="action-pill" @click=${e.onToggleNumberRow} title="Number Row">
        ${d(_.numbers())}
      </button>
      <button class="action-pill" @click=${e.onToggleTalks} title="Rizz Talks">
        ${d(_.talks())}
      </button>
      <button class="action-pill" @click=${e.onCycleHeight} title="Keyboard Height">
        ${d(_.height())}
      </button>
      <button class="action-pill" @click=${e.onSwitchKeyboard} title="Switch Keyboard">
        ${d(_.globe())}
      </button>
    </div>
  `)}function Ct(e){return d(h`
    <div class="stealth-bar">
      <div class="stealth-top">
        <span class="stealth-badge">🛡️ STEALTH MODE · Hidden from chat</span>
        <div class="stealth-actions">
          ${()=>e.showEnableScanner.value?d(h`
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
  `)}function St(e){return d(h`
    <div class="suggestions-shell">
      ${()=>I("suggestions-panel",e.suggestions.value.map(t=>h`
          <div class="suggestion-card" @click=${()=>e.onSelectSuggestion(t)}>
            <span class="suggestion-text">${t}</span>
          </div>
        `))}
    </div>
  `)}const $t={q:"1",w:"2",e:"3",r:"4",t:"5",y:"6",u:"7",i:"8",o:"9",p:"0",a:"@",s:"#",d:"$",f:"%",g:"&",h:"-",j:"+",k:"(",l:")",z:"*",x:'"',c:"'",v:":",b:";",n:"!",m:"?"};function xt(e){const t=k("off"),o=k("alpha"),n=ALPHA_ROW_1,r=ALPHA_ROW_2,a=ALPHA_ROW_3,i=NUM_ROW_1,l=NUM_ROW_2,u=NUM_ROW_3,f=SYM_ROW_1,v=SYM_ROW_2,c=SYM_ROW_3,m=C=>{const N=t.value!=="off"?C.toUpperCase():C;e.onKeyPress(N),t.value==="once"&&(t.value="off")},s=()=>{t.value==="off"?t.value="once":t.value==="once"?t.value="caps":t.value="off"},y=(C,z)=>{const N=z?C.toUpperCase():C,E=$t[C]??"";let g=null,S=!1;const de=()=>{S=!1,E&&(g=setTimeout(()=>{S=!0,e.onKeyPress(E)},380))},G=()=>{g&&(clearTimeout(g),g=null)};return h`
      <button
        class="key-btn"
        @pointerdown=${de}
        @pointerup=${G}
        @pointerleave=${G}
        @pointercancel=${G}
        @click=${()=>{g&&(clearTimeout(g),g=null),S||m(C),S=!1}}>
        ${N}
      </button>
    `},T=()=>{let C=null,z=null,N=!1,E=0;const g=()=>{C&&(clearTimeout(C),C=null),z&&(clearInterval(z),z=null)};return h`
      <button
        class="key-btn special"
        @pointerdown=${Y=>{E=Y.clientX,N=!1,g(),C=setTimeout(()=>{N=!0,e.onBackspace(),z=setInterval(()=>{e.onBackspace()},55)},350)}}
        @pointermove=${Y=>{var he;E-Y.clientX>=28&&!N&&(N=!0,g(),(he=e.onDeleteWord)==null||he.call(e))}}
        @pointerup=${g}
        @pointerleave=${g}
        @pointercancel=${g}
        @click=${()=>{g(),N||e.onBackspace(),N=!1}}>
        ⌫
      </button>
    `},w=()=>{const C=t.value!=="off",z=t.value==="caps"?"⇪":t.value==="once"?"⬆":"⇧",N=t.value==="off"?"key-btn special":"key-btn special active-shift",E=document.createElement("div");E.className="keyboard-row",E.appendChild(d(h`<button class=${N} @click=${s}>${z}</button>`));for(const g of a)E.appendChild(d(y(g,C)));return E.appendChild(d(T())),d(h`
      <div class="keyboard-grid">
        ${()=>{var g;return(g=e.showNumberRow)!=null&&g.value?I("keyboard-row",i.map(S=>h`<button class="key-btn" @click=${()=>e.onKeyPress(S)}>${S}</button>`)):""}}
        ${I("keyboard-row",n.map(g=>y(g,C)))}
        ${I("keyboard-row",r.map(g=>y(g,C)))}
        ${E}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>o.value="numbers"}>123</button>
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
    `)},ue=C=>{const z=C?f:i,N=C?v:l,E=C?c:u,g=document.createElement("div");g.className="keyboard-row",g.appendChild(d(h`
        <button
          class="key-btn special"
          @click=${()=>o.value=C?"numbers":"symbols"}>
          ${C?"123":"=\\<"}
        </button>
      `));for(const S of E)g.appendChild(d(h`<button class="key-btn" @click=${()=>e.onKeyPress(S)}>${S}</button>`));return g.appendChild(d(T())),d(h`
      <div class="keyboard-grid">
        ${I("keyboard-row",z.map(S=>h`<button class="key-btn" @click=${()=>e.onKeyPress(S)}>${S}</button>`))}
        ${I("keyboard-row",N.map(S=>h`<button class="key-btn" @click=${()=>e.onKeyPress(S)}>${S}</button>`))}
        ${g}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>o.value="alpha"}>ABC</button>
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
    `)};return d(h`
    <div class="keyboard-grid-wrapper">
      ${()=>o.value==="numbers"?ue(!1):o.value==="symbols"?ue(!0):w()}
    </div>
  `)}const ze="rizzboard_recent_emojis";function le(){try{const e=localStorage.getItem(ze);if(!e)return["😏","🔥","❤️","😂","✨","👀","💯","🥂"];const t=JSON.parse(e);return Array.isArray(t)&&t.length>0?t:["😏","🔥","❤️","😂"]}catch{return["😏","🔥","❤️","😂"]}}function Tt(e){try{const t=le().filter(n=>n!==e),o=[e,...t].slice(0,16);localStorage.setItem(ze,JSON.stringify(o))}catch{}}function Pt(e){const t=k(0),o=k(""),n=k(le()),r=i=>{Tt(i),n.value=le(),e.onSelectEmoji(i)},a=document.createElement("div");return a.className="emoji-tabs",a.appendChild(d(h`
      <button
        class=${()=>t.value===0?"emoji-tab active":"emoji-tab"}
        @click=${()=>{o.value="",t.value=0}}>
        🕒
      </button>
    `)),q.forEach((i,l)=>{const u=l+1;a.appendChild(d(h`
        <button
          class=${()=>u===t.value?"emoji-tab active":"emoji-tab"}
          @click=${()=>{o.value="",t.value=u}}>
          ${i.icon}
        </button>
      `))}),a.appendChild(d(h`<button class="emoji-tab back-key" @click=${e.onClose}>ABC</button>`)),d(h`
    <div class="emoji-view">
      <div class="emoji-search-bar" style="padding: 4px 8px;">
        <input
          type="text"
          class="stealth-input"
          placeholder="Search emojis (e.g. love, food, fire, gesture)..."
          .value=${()=>o.value}
          @input=${i=>{o.value=i.target.value}}
          style="width: 100%; padding: 6px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.25); color: inherit; font-size: 13px;"
        />
      </div>
      ${a}
      ${()=>{const i=o.value.trim().toLowerCase();let l;if(i){const u=q.filter(f=>f.name.toLowerCase().includes(i));l=u.length>0?u.flatMap(f=>f.emojis):q.flatMap(f=>f.emojis)}else t.value===0?l=n.value:l=(q[t.value-1]??q[0]).emojis;return I("emoji-grid",l.map(u=>h`
            <button class="emoji-btn" @click=${()=>r(u)}>${u}</button>
          `))}}
    </div>
  `)}function At(e){const t=k([]),o=n=>{t.value.includes(n)?t.value=t.value.filter(r=>r!==n):t.value=[n,...t.value]};return d(h`
    <div class="clipboard-view">
      <div class="clipboard-header">
        <span>Clipboard — Tap to Paste or ⚡ Reply</span>
        <div style="display:flex; gap:8px; align-items:center;">
          ${e.onClearAll?d(h`<button class="back-link" @click=${e.onClearAll}>Clear</button>`):""}
          <button class="back-link" @click=${e.onClose}>Close ✕</button>
        </div>
      </div>
      ${()=>{const n=t.value,r=[...e.history.value.filter(a=>n.includes(a)),...e.history.value.filter(a=>!n.includes(a))];return r.length===0?d(h`
            <div style="padding: 20px; text-align: center; opacity: 0.6; font-size: 13px;">
              Clipboard is empty. Copy any message to see it here.
            </div>
          `):I("clipboard-list",r.map(a=>{const i=n.includes(a);return h`
              <div class="clipboard-item-row">
                <div class="clipboard-item" @click=${()=>e.onSelectClip(a)}>
                  ${i?"📌 ":""}${a}
                </div>
                <button
                  class="clip-analyze-btn"
                  @click=${()=>o(a)}
                  title=${i?"Unpin":"Pin"}>
                  ${i?"📌":"📍"}
                </button>
                <button class="clip-analyze-btn" @click=${()=>e.onAnalyzeClip(a)}>
                  ⚡
                </button>
                ${e.onDeleteClip?d(h`
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
  `)}function Nt(e){return d(h`
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
  `)}function Mt(e){return d(h`
    <div class="nextmove-view">
      <div class="nextmove-header">
        <div class="nextmove-meta">
          <span class="source-chip">
            ${()=>e.resolution.value?dt(e.resolution.value.context):"⚡ Next Move"}
          </span>
          <span class="partner-quote">
            "${()=>{var o;const t=((o=e.resolution.value)==null?void 0:o.context.partnerText)??"";return t.length>44?`${t.slice(0,44).trim()}…`:t}}"
          </span>
        </div>
        <div class="nextmove-actions">
          <button class="back-link" @click=${e.onSwitchToStealth}>Edit</button>
          <button class="back-link" @click=${e.onClose}>Close ✕</button>
        </div>
      </div>

      ${()=>{const t=e.resolution.value;return!t||t.suggestions.length===0?d(h`
            <div class="roast-feedback">Tap "Tell Rizz" or "Scan Screen" to load chat context.</div>
          `):I("nextmove-cards",t.suggestions.map(o=>h`
            <div class="vibe-card" @click=${()=>e.onSelectReply(o.line)}>
              <span class="vibe-tag vibe-${o.vibe.toLowerCase()}">${o.vibe}</span>
              <span class="vibe-line">${o.line}</span>
            </div>
          `))}}
    </div>
  `)}function _t(e){const t=n=>{b("click"),lt(n)},o=n=>{b("light"),ct(n)};return d(h`
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
        <button class="key-btn" @click=${()=>o("up")}>▲</button>
        <button class="key-btn special" @click=${e.onBackspace}>⌫</button>
        <button class="key-btn" @click=${()=>o("left")}>◀</button>
        <button class="key-btn" @click=${()=>o("down")}>▼</button>
        <button class="key-btn" @click=${()=>o("right")}>▶</button>
      </div>
    </div>
  `)}const Et=[{icon:"✨",title:"Auto Chat Replies",desc:"Opens automatically when a chat is detected, or swipe up on Spacebar."},{icon:"🔢",title:"Long-Press Numbers & Symbols",desc:`Hold q–p for 1–0, or hold a–m for @ # $ % & - + ( ) * " ' : ; ! ?`},{icon:"⌫",title:"Swipe Left / Hold Backspace",desc:"Hold ⌫ to repeat-delete, or swipe left on ⌫ to delete a whole word."},{icon:"↔️",title:"Spacebar Cursor Scrub",desc:"Slide your finger left or right on Spacebar to move the cursor."},{icon:"🎙️",title:"Google Voice Typing",desc:"Tap Mic in the top bar for instant voice dictation."},{icon:"✂️",title:"Text Editing & D-Pad",desc:"Tap ✂️ for Select All, Copy, Cut, Paste, and arrow keys."},{icon:"📋",title:"Clipboard & Emoji Search",desc:"Pin/delete clips in 📋, or search 250+ emojis in 😏."}];function Rt(e){return d(h`
    <div class="help-view" style="padding: 8px; max-height: 220px; overflow-y: auto;">
      <div class="clipboard-header" style="margin-bottom: 6px;">
        <span>RizzBoard Gestures & Guide</span>
        <div style="display:flex; gap:8px;">
          <button class="back-link" @click=${()=>Ee("setup")}>⚙ Setup</button>
          <button class="back-link" @click=${e.onClose}>ABC ✕</button>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${Et.map(t=>h`
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
  `)}const re=[{name:"Icebreakers",lines:["Two truths and a lie—you go first.","What is the most spontaneous thing you have done this year?","Unpopular opinion: what food is wildly overrated?"]},{name:"Flirty",lines:["I was going to play it cool, but you made that impossible.","Careful, keep talking like that and I might actually like you.","Are you always this much trouble or is today special?"]},{name:"Date Pivots",lines:["This is fun, but I am way better in person. Coffee this week?","Skip the small talk—what is your go-to spot for drinks?","Are you free Thursday evening? I know a great place."]},{name:"Recovery",lines:["You are a person of few words—good thing I speak fluent mystery.","I will take that as a yes. What are you up to this weekend?","Do not hurt your thumbs typing a whole novel over there."]}];function Ot(e){const t=k(0);return d(h`
    <div class="clipboard-view" style="padding: 8px;">
      <div class="clipboard-header">
        <span>Rizz Talks — Tap to Insert</span>
        <button class="back-link" @click=${e.onClose}>ABC ✕</button>
      </div>
      <div class="emoji-tabs" style="margin-bottom: 6px;">
        ${re.map((o,n)=>h`
          <button
            class=${()=>n===t.value?"emoji-tab active":"emoji-tab"}
            style="font-size: 11px; padding: 4px 8px;"
            @click=${()=>t.value=n}>
            ${o.name}
          </button>
        `)}
      </div>
      ${()=>{const o=re[t.value]??re[0];return I("clipboard-list",o.lines.map(n=>h`
            <div class="clipboard-item-row">
              <div class="clipboard-item" @click=${()=>e.onSelectLine(n)}>
                ${n}
              </div>
            </div>
          `))}}
    </div>
  `)}const oe=new bt,A=new vt,p=k("qwerty"),x=k(""),J=k((()=>{try{const e=localStorage.getItem("rizzboard_theme");if(e==="amoled"||e==="light"||e==="slate")return e}catch{}return"slate"})()),X=k((()=>{try{const e=localStorage.getItem("rizzboard_one_handed");if(e==="right"||e==="left"||e==="off")return e}catch{}return"off"})()),ae=k((()=>{try{return localStorage.getItem("rizzboard_number_row")==="true"}catch{}return!1})()),Q=k((()=>{try{const e=localStorage.getItem("rizzboard_height");if(e==="compact"||e==="tall"||e==="normal")return e}catch{}return"normal"})()),F=k(void 0),R=k(null),D=k(null),$=k(!1),B=k(""),V=k(null),j=k(!1),Be=k(null),H=k(["What is your biggest red flag?","Are we still on for coffee this weekend?"]),zt=Ne(()=>{const e=$.value?B.value:x.value;if(!e)return $.value?["asked","red","weekend"]:["how","are","you"];const t=e.trim().split(/\s+/),o=t[t.length-1];if(e.endsWith(" "))return oe.predictNextWord(o,3);{const n=oe.completePrefix(o,3);return n.length>0?n:[o]}});ne.registerNativeCallback("appContextChanged",e=>{if(e!=null&&e.packageName){F.value=e.packageName;try{const t=_e();if(t.status==="ok"&&t.blocks.length>0){const o=A.ingestScreenBlocks(t.blocks,"accessibility",{appPackage:t.appPackage??e.packageName});o&&(R.value=o)}}catch{}}});ne.registerNativeCallback("screenshotDetected",e=>{e!=null&&e.uri&&(R.value={id:`screenshot-${e.timestamp??Date.now()}`,source:"screenshot",partnerText:"Screenshot captured",uri:e.uri,appPackage:e.appPackage??F.value,timestamp:Date.now()},b("heavy"))});ne.registerNativeCallback("contextDetected",e=>{if(!(e!=null&&e.text)||!(e!=null&&e.source))return;const t=A.ingestRawContext({source:e.source,text:e.text,senderName:e.senderName,appPackage:e.appPackage??F.value,timestamp:e.timestamp});t&&(R.value=t,b("click"))});ne.registerNativeCallback("clipboardAdded",e=>{if(e!=null&&e.text){const t=String(e.text).trim();if(!t)return;H.value=[t,...H.value.filter(n=>n!==t).slice(0,9)];const o=A.ingestRawContext({source:"clipboard",text:t,appPackage:F.value});o&&(R.value=o)}});const L=rt();if(L.status==="ok"&&L.text&&L.source){const e=A.ingestRawContext({source:L.source,text:L.text,senderName:L.senderName,appPackage:L.appPackage,timestamp:L.timestamp});e&&(R.value=e)}function ke(e){if(b("heavy"),e.source==="screenshot"&&e.uri){const o=nt(e.uri),n=A.ingestScreenBlocks(o.blocks,"screenshot",{appPackage:o.appPackage??e.appPackage,uri:e.uri});if(!n){R.value=null,Z("Screenshot looked blank/protected — type what they said:");return}D.value=A.resolveSuggestions(n),R.value=null,$.value=!1,p.value="nextmove";return}D.value=A.resolveSuggestions(e),R.value=null,$.value=!1,p.value="nextmove",new Oe().generateOnlineSuggestions(e.partnerText).then(o=>{var n;((n=D.value)==null?void 0:n.context.id)===e.id&&o.length>=3&&(D.value={...D.value,suggestions:o})}).catch(()=>{})}function Ce(){b("click");const e=_e();if(e.status==="ok"&&e.blocks.length>0){const t=A.ingestScreenBlocks(e.blocks,"accessibility",{appPackage:e.appPackage??F.value});if(t){D.value=A.resolveSuggestions(t),$.value=!1,p.value="nextmove";return}}if(e.status==="not_enabled"){j.value=!0,Z("Scanner off — type what they said, or tap Enable Scanner ⚙");return}j.value=!1,Z("Screen protected (FLAG_SECURE) — type a quick summary here:")}function Z(e){V.value=e??null,$.value=!0,p.value="qwerty"}function Bt(){b("click"),$.value?($.value=!1,V.value=null,j.value=!1):(j.value=!1,Z())}function Se(){b("heavy");const e=B.value.trim(),t=A.ingestRawContext({source:"manual",text:e||"start playful conversation",appPackage:F.value});t&&(D.value=A.resolveSuggestions(t),$.value=!1,V.value=null,j.value=!1,p.value="nextmove")}function It(e){b("heavy"),A.recordCommittedReply(e),W(e),x.value=e,B.value="",p.value="qwerty"}function Dt(e){const t=A.ingestRawContext({source:"manual",text:e,appPackage:F.value});t&&(t.source="clipboard",D.value=A.resolveSuggestions(t),p.value="nextmove")}function $e(e){if(b("light"),$.value){B.value+=e;return}if(e===" "||e==="."||e===","||e==="!"||e==="?"){const t=x.value.match(/([a-zA-Z']+)$/);if(t){const o=t[1],n=oe.autocorrect(o);if(n&&n!==o){for(let r=0;r<o.length;r++)U();x.value=x.value.slice(0,-o.length)+n+e,W(n+e);return}else oe.learnWord(o)}}x.value+=e,W(e)}function xe(){if(b("light"),$.value){B.value.length>0&&(B.value=B.value.slice(0,-1));return}x.value.length>0&&(x.value=x.value.slice(0,-1)),U()}function Lt(e){if(b("click"),$.value){const n=B.value,r=n.trim().split(/\s+/),a=n.endsWith(" ")?n:r.length>1?r.slice(0,-1).join(" ")+" ":"";B.value=`${a}${e} `;return}const t=x.value,o=t.trim().split(/\s+/);if(!t.endsWith(" ")&&o.length>0){const n=o[o.length-1];for(let r=0;r<n.length;r++)U()}W(e+" "),x.value=(t.endsWith(" ")?t:o.length>1?o.slice(0,-1).join(" ")+" ":"")+e+" "}function Wt(){b("heavy"),Be.value=wt(x.value),p.value="roast"}function jt(e){b("click");for(let t=0;t<x.value.length;t++)U();A.recordCommittedReply(e),W(e),x.value=e,p.value="qwerty"}function Ft(){return h`
    <div class="rizz-app" data-theme=${()=>J.value} data-one-handed=${()=>X.value} data-height=${()=>Q.value}>
      ${kt({activeContext:R,stealthMode:$,onOpenContextReplies:()=>{R.value&&ke(R.value)},onScanScreen:Ce,onToggleStealth:Bt,onToggleRoast:()=>{p.value==="roast"?p.value="qwerty":Wt()},onToggleClipboard:()=>p.value=p.value==="clipboard"?"qwerty":"clipboard",onToggleEmojis:()=>p.value=p.value==="emojis"?"qwerty":"emojis",onVoiceInput:()=>{b("click"),at()},onSwitchKeyboard:()=>{b("click"),it()},onToggleTextEdit:()=>p.value=p.value==="textedit"?"qwerty":"textedit",onToggleHelp:()=>p.value=p.value==="help"?"qwerty":"help",onCycleTheme:()=>{b("click");const e=J.value==="slate"?"amoled":J.value==="amoled"?"light":"slate";J.value=e;try{localStorage.setItem("rizzboard_theme",e)}catch{}},onToggleOneHanded:()=>{b("click");const e=X.value==="off"?"right":X.value==="right"?"left":"off";X.value=e;try{localStorage.setItem("rizzboard_one_handed",e)}catch{}},onToggleNumberRow:()=>{b("click");const e=!ae.value;ae.value=e;try{localStorage.setItem("rizzboard_number_row",String(e))}catch{}},onToggleTalks:()=>p.value=p.value==="talks"?"qwerty":"talks",onCycleHeight:()=>{b("click");const e=Q.value==="normal"?"compact":Q.value==="compact"?"tall":"normal";Q.value=e;try{localStorage.setItem("rizzboard_height",e)}catch{}}})}

      ${()=>$.value?Ct({buffer:B,hint:V,showEnableScanner:j,onGenerate:Se,onEnableScanner:()=>Ee("accessibility"),onCancel:()=>{$.value=!1,V.value=null,j.value=!1}}):""}

      ${St({suggestions:zt,onSelectSuggestion:Lt})}

      ${()=>{const e=p.value;return e==="nextmove"?Mt({resolution:D,onSelectReply:It,onSwitchToStealth:()=>{var t;B.value=((t=D.value)==null?void 0:t.context.partnerText)??"",Z()},onClose:()=>p.value="qwerty"}):e==="emojis"?Pt({onSelectEmoji:$e,onClose:()=>p.value="qwerty"}):e==="clipboard"?At({history:H,onSelectClip:t=>{A.recordCommittedReply(t),W(t),p.value="qwerty"},onAnalyzeClip:t=>{b("heavy"),Dt(t)},onDeleteClip:t=>{b("light"),H.value=H.value.filter(o=>o!==t)},onClearAll:()=>{b("click"),H.value=[]},onClose:()=>p.value="qwerty"}):e==="roast"?Nt({roast:Be,onApplyUpgrade:jt,onClose:()=>p.value="qwerty"}):e==="textedit"?_t({onBackspace:xe,onClose:()=>p.value="qwerty"}):e==="help"?Rt({onClose:()=>p.value="qwerty"}):e==="talks"?Ot({onSelectLine:t=>{b("heavy"),W(t),p.value="qwerty"},onClose:()=>p.value="qwerty"}):xt({stealthMode:$,showNumberRow:ae,onKeyPress:$e,onBackspace:xe,onSend:()=>{$.value?Se():(b("heavy"),ot())},onOpenEmojis:()=>p.value="emojis",onMoveCursor:t=>{b("light"),st(t)},onDeleteWord:()=>{b("heavy");const t=x.value.match(/(\S+\s*)$/),o=t?t[1].length:1;x.value=x.value.slice(0,-o);for(let n=0;n<o;n++)U()},onSwipeUpSpace:()=>{b("click"),R.value?ke(R.value):Ce()}})}}
    </div>
  `}const Te=document.getElementById("app");if(Te){const{fragment:e}=ce(Ft());Te.appendChild(e)}
