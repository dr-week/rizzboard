var xe=Object.defineProperty;var Pe=(t,e,r)=>e in t?xe(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var T=(t,e,r)=>Pe(t,typeof e!="symbol"?e+"":e,r);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}})();let Q=null;const H=new Set;let z=!1;function ge(){return Q}function U(t){const e=Q;return Q=t,e}function ve(t){t.isStale=!0,z?H.add(t):t.execute()}function Te(t){const e=z;z=!0;try{return t()}finally{z=e,z||Ne()}}function Ne(){for(;H.size>0;){const t=Array.from(H);H.clear();for(const e of t)e.isStale&&e.execute()}}class Ae{constructor(e){T(this,"_value");T(this,"_subscribers",new Set);this._value=e}get value(){const e=ge();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}set value(e){Object.is(this._value,e)||(this._value=e,this.notify())}peek(){return this._value}notify(){const e=Array.from(this._subscribers);for(const r of e)ve(r)}_unsubscribe(e){this._subscribers.delete(e)}}function A(t){return new Ae(t)}class Ee{constructor(e){T(this,"_value");T(this,"_node");T(this,"_subscribers",new Set);T(this,"_isDirty",!0);T(this,"_fn");this._fn=e,this._node={dependencies:new Set,isStale:!0,execute:()=>{if(!this._isDirty){this._isDirty=!0;const r=Array.from(this._subscribers);for(const n of r)ve(n)}}}}get value(){this._isDirty&&this._recompute();const e=ge();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}peek(){return this._isDirty&&this._recompute(),this._value}_unsubscribe(e){this._subscribers.delete(e)}_recompute(){for(const r of this._node.dependencies)r._unsubscribe(this._node);this._node.dependencies.clear();const e=U(this._node);try{this._value=this._fn(),this._isDirty=!1,this._node.isStale=!1}finally{U(e)}}}function be(t){return new Ee(t)}let Be=null;function Re(){return Be}function ee(t){let e;const r={dependencies:new Set,isStale:!1,execute:()=>{for(const i of r.dependencies)i._unsubscribe(r);if(r.dependencies.clear(),typeof e=="function")try{e()}catch(i){console.error("[Nova Signal Effect Cleanup Error]:",i)}const a=U(r);try{e=t()}finally{U(a),r.isStale=!1}}};r.execute();const n=()=>{for(const a of r.dependencies)a._unsubscribe(r);r.dependencies.clear(),typeof e=="function"&&e()},o=Re();return o&&o.addCleanup(n),n}function we(){return typeof window<"u"&&"Part"in window&&"ChildNodePart"in window&&typeof window.getParts=="function"}class ie{constructor(e){T(this,"parentNode");T(this,"previousSibling");T(this,"nextSibling");T(this,"value");T(this,"_currentNode");const r=e.parentNode;if(!r)throw new Error("[Zuari DOM Parts]: Placeholder node must have a parent container.");this.parentNode=r,this.previousSibling=e.previousSibling,this.nextSibling=e.nextSibling;const n=document.createTextNode("");r.replaceChild(n,e),this._currentNode=n}setValue(e){if(this.value=e,e instanceof DocumentFragment){const r=document.createTextNode("");this.parentNode.replaceChild(r,this._currentNode),this.parentNode.insertBefore(e,r),this._currentNode=r;return}if(e instanceof Node){this._currentNode!==e&&(this.parentNode.replaceChild(e,this._currentNode),this._currentNode=e);return}if(this._currentNode instanceof Text)this._currentNode.data=String(e??"");else{const r=document.createTextNode(String(e??""));this.parentNode.replaceChild(r,this._currentNode),this._currentNode=r}}disconnect(){}}class se{constructor(e,r){T(this,"element");T(this,"attributeName");T(this,"value");this.element=e,this.attributeName=r}setValue(e){this.value=e,e===!1||e===null||e===void 0?this.element.removeAttribute(this.attributeName):this.element.setAttribute(this.attributeName,String(e))}disconnect(){this.element.removeAttribute(this.attributeName)}}function Oe(t){if(we())try{const e=window.ChildNodePart;return new e(t)}catch{return new ie(t)}return new ie(t)}function _e(t,e){if(we())try{const r=window.AttributePart;return new r(t,e)}catch{return new se(t,e)}return new se(t,e)}function Me(t,e,r,n){const o=De(t,`<!--zuari-hole-${e}-->`);if(o){const h=Oe(o);if(ce(r)){const c=ee(()=>h.setValue(le(r)));n.push(()=>{var u;c(),(u=h.disconnect)==null||u.call(h)})}else h.setValue(r);return}const a=`data-zuari-attr-${e}`,i=Le(t,a);if(!i)return;const{element:l,attrName:d}=i;if(d.startsWith("@")||d.startsWith("on")){const h=(d.startsWith("@")?d.slice(1):d.slice(2)).toLowerCase();if(l.removeAttribute(d),typeof r!="function")return;const c=r;l.addEventListener(h,c),n.push(()=>l.removeEventListener(h,c));return}const p=_e(l,d);if(ce(r)){const h=ee(()=>p.setValue(le(r)));n.push(()=>{var c;h(),(c=p.disconnect)==null||c.call(p)})}else p.setValue(r)}function ce(t){return typeof t=="object"&&t!==null&&"value"in t||typeof t=="function"}function le(t){return typeof t=="object"&&t!==null&&"value"in t?t.value:typeof t=="function"?t():t}function De(t,e){const r=document.createNodeIterator(t,NodeFilter.SHOW_COMMENT);let n=r.nextNode();for(;n;){if(`<!--${n.data}-->`===e)return n;n=r.nextNode()}return null}function Le(t,e){const r=document.createNodeIterator(t,NodeFilter.SHOW_ELEMENT);let n=r.nextNode();for(;n;){for(const o of Array.from(n.attributes))if(o.value.includes(e))return{element:n,attrName:o.name};n=r.nextNode()}return null}const ue=new Map,Ie="<!--zuari-hole-",We="-->",Fe="data-zuari-attr-";function m(t,...e){return{strings:t,values:e}}function re(t,e){const{strings:r,values:n}=t,o=r.join("<!--?-->");let a=ue.get(o);a||(a=document.createElement("template"),a.innerHTML=r.reduce((p,h,c)=>{if(c>=n.length)return p+h;const s=/=["']?[^"'>]*$/.test(h)?`"${Fe}${c}"`:`${Ie}${c}${We}`;return p+h+s},""),ue.set(o,a));const i=a.content.cloneNode(!0),l=Array.from(i.childNodes),d=[];return n.forEach((p,h)=>Me(i,h,p,d)),{fragment:i,destroy(){d.forEach(p=>p()),l.forEach(p=>{var h;return(h=p.parentNode)==null?void 0:h.removeChild(p)})}}}const je={primary:"#006A6A",onPrimary:"#FFFFFF",primaryContainer:"#6FF7F6",onPrimaryContainer:"#002020",secondary:"#4A6363",onSecondary:"#FFFFFF",background:"#FAFDFD",onBackground:"#191C1C",surface:"#FAFDFD",onSurface:"#191C1C",surfaceVariant:"#DAE5E4",outline:"#6F7979"},ze={primary:"#4CDADA",onPrimary:"#003737",primaryContainer:"#004F4F",onPrimaryContainer:"#6FF7F6",secondary:"#B1CCCC",onSecondary:"#1C3534",background:"#191C1C",onBackground:"#E1E3E3",surface:"#191C1C",onSurface:"#E1E3E3",surfaceVariant:"#3F4948",outline:"#899392"};function qe(t=!1){const e=A(t),r=A(t?{...ze}:{...je}),n=be(()=>!!(typeof navigator<"u"&&/android/i.test(navigator.userAgent)||typeof window<"u"&&window.Android)),o=new Map;typeof window<"u"&&(window.__zuariKotlinDispatcher=(c,u)=>{const s=o.get(c);if(s)try{const f=JSON.parse(u);s(f)}catch{s(u)}});function a(c,...u){return new Promise((s,f)=>{if(typeof window<"u"&&window.Android){const x=window.Android;if(typeof x[c]=="function")try{const y=x[c](...u);try{s(JSON.parse(y))}catch{s(y)}return}catch(y){f(y);return}}s({success:!0,mock:!0,function:c,args:u})})}function i(c,u){return o.set(c,u),()=>{o.delete(c)}}function l(c){Te(()=>{r.value={...r.value,...c}})}function d(c){const u=(c==null?void 0:c.packageName)??"com.zuari.ui.theme",s=(c==null?void 0:c.themeName)??"ZuariTheme",f={...r.value,...(c==null?void 0:c.colors)??{}};return`package ${u}

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Native Material 3 Dynamic Colors generated by Zuari (@zuari/kotlin)
val ZuariPrimary = Color(android.graphics.Color.parseColor("${f.primary}"))
val ZuariOnPrimary = Color(android.graphics.Color.parseColor("${f.onPrimary}"))
val ZuariPrimaryContainer = Color(android.graphics.Color.parseColor("${f.primaryContainer}"))
val ZuariOnPrimaryContainer = Color(android.graphics.Color.parseColor("${f.onPrimaryContainer}"))
val ZuariSecondary = Color(android.graphics.Color.parseColor("${f.secondary}"))
val ZuariOnSecondary = Color(android.graphics.Color.parseColor("${f.onSecondary}"))
val ZuariBackground = Color(android.graphics.Color.parseColor("${f.background}"))
val ZuariOnBackground = Color(android.graphics.Color.parseColor("${f.onBackground}"))
val ZuariSurface = Color(android.graphics.Color.parseColor("${f.surface}"))
val ZuariOnSurface = Color(android.graphics.Color.parseColor("${f.onSurface}"))
val ZuariSurfaceVariant = Color(android.graphics.Color.parseColor("${f.surfaceVariant}"))
val ZuariOutline = Color(android.graphics.Color.parseColor("${f.outline}"))

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
`}function p(c){const u=(c==null?void 0:c.themeName)??"Theme.Zuari.Native",s={...r.value,...(c==null?void 0:c.colors)??{}};return`<?xml version="1.0" encoding="utf-8"?>
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
`}function h(c){const u=c??(typeof document<"u"?document.documentElement:null);return u?ee(()=>{const s=r.value;u.style.setProperty("--md-sys-color-primary",s.primary),u.style.setProperty("--md-sys-color-on-primary",s.onPrimary),u.style.setProperty("--md-sys-color-primary-container",s.primaryContainer),u.style.setProperty("--md-sys-color-on-primary-container",s.onPrimaryContainer),u.style.setProperty("--md-sys-color-secondary",s.secondary),u.style.setProperty("--md-sys-color-on-secondary",s.onSecondary),u.style.setProperty("--md-sys-color-background",s.background),u.style.setProperty("--md-sys-color-on-background",s.onBackground),u.style.setProperty("--md-sys-color-surface",s.surface),u.style.setProperty("--md-sys-color-on-surface",s.onSurface),u.style.setProperty("--md-sys-color-surface-variant",s.surfaceVariant),u.style.setProperty("--md-sys-color-outline",s.outline)}):()=>{}}return{isAndroid:n,dynamicColors:r,isDarkTheme:e,callNativeFunction:a,registerNativeCallback:i,generateComposeThemeCode:d,generateXmlThemeCode:p,ingestDynamicPalette:l,applyToCssVariables:h}}const G=qe(!0);function _(){return typeof window<"u"&&window.Android?window.Android:null}function j(t){const e=_();e?e.commitText(t):console.log("[Dev Mock Commit]:",t)}function X(){const t=_();t?t.deleteBackward():console.log("[Dev Mock Delete]")}function Ke(){const t=_();t?t.sendEnter():console.log("[Dev Mock Enter]")}function S(t="click"){const e=_();e&&typeof e.triggerHaptic=="function"&&e.triggerHaptic(t)}function Ze(t){const e=_();if(e&&typeof e.requestScreenshotAnalysis=="function")try{const r=e.requestScreenshotAnalysis(t);return JSON.parse(r)}catch{return{status:"error",blocks:[]}}return{status:"ok",blocks:[{text:"Are you free for drinks this weekend?",x:48,y:420,width:320,screenWidth:1080}]}}function ke(){const t=_();if(t&&typeof t.requestScreenScan=="function")try{const e=t.requestScreenScan();return JSON.parse(e)}catch{return{status:"error",blocks:[]}}return{status:"ok",appPackage:"com.snapchat.android",blocks:[{text:"What is your biggest red flag?",x:52,y:460,width:300,screenWidth:1080}]}}function Ve(){const t=_();if(t&&typeof t.getActiveContext=="function")try{return JSON.parse(t.getActiveContext())}catch{return{status:"none"}}return{status:"none"}}function He(t){const e=_();e&&typeof e.openSystemSetting=="function"?e.openSystemSetting(t):console.log("[Dev Mock Open Setting]:",t)}function Ue(){const t=_();t&&typeof t.startVoiceTyping=="function"?t.startVoiceTyping():console.log("[Dev Mock Voice Typing]")}function Je(){const t=_();t&&typeof t.showInputMethodPicker=="function"?t.showInputMethodPicker():console.log("[Dev Mock IME Picker]")}function Ge(t){const e=_();e&&typeof e.moveCursor=="function"&&e.moveCursor(t)}function de(t,e){return`You are an elite wingman who excels at playful, concise, charismatic banter.
Your task: Suggest 3 distinct next moves for a dating app conversation.
Strict rules:
1. MAX 12 words per line.
2. NO cheesy cliché compliments like "Hey cutie" or "You must be tired from running through my mind".
3. Use witty banter, slight teasing, or confident playful framing.
4. Output MUST be valid JSON array with keys: "vibe" (Smooth | Tease | Bold) and "line" (string).

Partner said: "${t}"
${e?`Context I said previously: "${e}"`:""}

Respond ONLY with the JSON array:`}function Xe(t){return`You are a charisma coach. Rewrite this bland text message into 3 sharper, confident, flirty versions.
Max 12 words each.
Bland text: "${t}"

Output ONLY a JSON array with objects: [{"vibe": "Smooth", "line": "..."}, {"vibe": "Tease", "line": "..."}, {"vibe": "Bold", "line": "..."}]`}const fe={"com.snapchat.android":"Snapchat","org.telegram.messenger":"Telegram","org.thoughtcrime.securesms":"Signal","co.hinge.app":"Hinge","com.bumble.app":"Bumble","com.tinder":"Tinder","com.instagram.android":"Instagram","com.whatsapp":"WhatsApp","web.whatsapp.com":"WhatsApp Web","instagram.com":"Instagram DM","web.telegram.org":"Telegram Web","tinder.com":"Tinder Web","bumble.com":"Bumble Web","discord.com":"Discord","x.com":"X DM"};function Ce(t){if(!t)return;const e=t.replace(/^www\./i,"");if(fe[e])return fe[e];const r=e.split("."),n=r[r.length-1];if(!n||["android","app","messenger","com","org","io"].includes(n)){const o=r[r.length-2];return o?o.charAt(0).toUpperCase()+o.slice(1):void 0}return n.charAt(0).toUpperCase()+n.slice(1)}function Ye(t){const e=Ce(t.appPackage);switch(t.source){case"screenshot":return"📸 Screenshot";case"notification":return e?`🔔 ${e} Msg`:"🔔 Incoming Msg";case"clipboard":return"📋 Copied Bubble";case"accessibility":return e?`👁️ ${e} Scan`:"👁️ Screen Scan";case"selection":return"✨ Selected Text";case"dom":return e?`🌐 ${e} Chat`:"🌐 Web Chat";case"manual":return"💬 Stealth Context"}}function Qe(t){const e=t.partnerText.length>26?`${t.partnerText.slice(0,26).trim()}…`:t.partnerText;switch(t.source){case"screenshot":return"📸 Screenshot Detected: Analyze Next Move";case"notification":{const r=Ce(t.appPackage);return r?`🔔 ${r}: "${e}" — Reply`:`🔔 New Msg: "${e}" — Reply`}case"clipboard":return`📋 Copied: "${e}" — Reply`;case"accessibility":case"dom":return`👁️ Scanned: "${e}" — Reply`;case"selection":return`✨ Selected: "${e}" — Reply`;case"manual":return"💬 Context Ready — View Replies"}}class et{constructor(){this.recentSelfCommits=new Set}recordSelfCommit(e){const r=this.normalize(e);if(r&&(this.recentSelfCommits.add(r),this.recentSelfCommits.size>25)){const n=this.recentSelfCommits.values().next().value;n&&this.recentSelfCommits.delete(n)}}isIgnored(e,r){const n=e.trim();if(!n)return!0;if(r==="manual"||r==="selection")return!1;const o=this.normalize(n);return!!(this.recentSelfCommits.has(o)||/^https?:\/\/\S+$/i.test(n)||/^\d{4,8}$/.test(n))}normalize(e){return e.toLowerCase().replace(/\s+/g," ").trim()}}function tt(t){const e={rawBlocks:t.map(n=>n.text)};if(t.length===0)return e;const r=t.filter(n=>{const o=n.y<120,a=n.y>n.screenWidth*1.8;return!o&&!a});r.sort((n,o)=>n.y-o.y);for(let n=r.length-1;n>=0;n--){const o=r[n],a=o.x+o.width/2>o.screenWidth/2;if(!a&&!e.senderText?e.senderText=o.text:a&&!e.myLastText&&(e.myLastText=o.text),e.senderText&&e.myLastText)break}return e}const rt=[{id:"op-1",category:"opener",vibe:"playful",triggerKeywords:["travel","hiking","nature"],template:"Are you as adventurous as your profile says, or do you also get lost in grocery stores?"},{id:"op-2",category:"opener",vibe:"smooth",triggerKeywords:["smile","eyes","cute"],template:"I was going to wait two days to message you, but patience was never my strong suit."},{id:"op-3",category:"opener",vibe:"witty",triggerKeywords:["food","coffee","cooking"],template:"Important question: what is your most controversial culinary opinion?"},{id:"bt-1",category:"banter",vibe:"playful",triggerKeywords:["trouble","sarcasm","bad"],template:"Are you always this much trouble or did I catch you on a good day?"},{id:"bt-2",category:"banter",vibe:"witty",triggerKeywords:["challenge","bet","win"],template:"Careful, high expectations are my only weakness."},{id:"bt-3",category:"banter",vibe:"bold",triggerKeywords:["rules","late","fast"],template:"I would say you are five minutes away from being my favorite person."},{id:"wp-1",category:"wordplay",vibe:"witty",triggerKeywords:["smart","books","study","work"],template:"Are you an overdue library book? Because you have fine written all over you."},{id:"wp-2",category:"wordplay",vibe:"smooth",triggerKeywords:["music","song","playlist"],template:"If our conversation was a playlist, I would have it on repeat."},{id:"cl-1",category:"closer",vibe:"bold",triggerKeywords:["drinks","date","weekend","meet","free","tonight"],template:"Drinks this Thursday. You pick the spot, I will bring the conversation."},{id:"cl-2",category:"closer",vibe:"smooth",triggerKeywords:["coffee","tea","afternoon","sunday","morning"],template:"Let us see if you are as fun in person. Coffee tomorrow?"},{id:"rf-1",category:"banter",vibe:"playful",triggerKeywords:["red flag","toxic","flaw","worst"],template:"My biggest red flag is thinking I can win every staring contest."},{id:"sn-1",category:"banter",vibe:"bold",triggerKeywords:["snap","streak","vanish","secret","disappear"],template:"Disappearing messages just mean we have to make every line count."},{id:"wy-1",category:"banter",vibe:"witty",triggerKeywords:["wyd","doing","bored","up to","plans"],template:"Plotting my next move, and you just walked right into it."},{id:"pt-1",category:"opener",vibe:"playful",triggerKeywords:["dog","puppy","cat","pet","gym","workout"],template:"Be honest: am I competing with your pet for attention, or do I stand a chance?"}];function nt(t,e=3){const r=t.toLowerCase();if(!r.trim())return[];const n=rt.map(o=>{let a=0;for(const i of o.triggerKeywords)r.includes(i)&&(a+=2);return{entry:o,score:a}}).filter(o=>o.score>0);return n.sort((o,a)=>a.score-o.score),n.slice(0,e).map(o=>o.entry)}function ot(t){const e=new Set(["the","and","for","are","you","that","this","with","have","what","when","where","why","how","just","like","really","very","about","from","they","them","your","mine","been","were","was","will","would","could","should","going","doing","want","need","know","think","today","tonight","tomorrow","lol","haha","lmao","yeah","yep","nope","okay","hey","hii","hello"]),r=t.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(n=>n.length>=4&&!e.has(n));return r.length>0?r[r.length-1]:null}class at{generateOfflineSuggestions(e,r){const n=e.trim(),o=n.toLowerCase(),a=nt(n,3),i={};for(const y of a)y.vibe==="smooth"&&!i.Smooth?i.Smooth=y.template:(y.vibe==="playful"||y.vibe==="witty")&&!i.Tease?i.Tease=y.template:y.vibe==="bold"&&!i.Bold&&(i.Bold=y.template);for(const y of a)!i.Smooth&&y.template!==i.Tease&&y.template!==i.Bold?i.Smooth=y.template:!i.Tease&&y.template!==i.Smooth&&y.template!==i.Bold?i.Tease=y.template:!i.Bold&&y.template!==i.Smooth&&y.template!==i.Tease&&(i.Bold=y.template);const l=ot(n),d=n.includes("?")||/^(what|why|how|where|when|who|are|do|did|would|can|wanna)\b/i.test(n),p=n.length>0&&n.split(/\s+/).length<=2&&!d,h=/^(hey|hi|hello|yo|sup|heyy+|hii+|gm|good morning)\b/i.test(o),c=/\b(sorry|my bad|apologize|late|missed)\b/i.test(o),u=/\b(cute|hot|pretty|handsome|smart|funny|sweet|love your|like your)\b/i.test(o);let s,f,x;return h?(s="Was literally just thinking about texting you—great timing.",f="Look who finally decided to grace my notifications.",x="Hey—skipping the small talk, how is your week looking?"):c?(s="All good, life happens. Just glad you are here now.",f="You owe me a coffee for the suspense, then we are even.",x="Apology accepted—make it up to me this weekend?"):u?(s="Careful, keep talking like that and I might actually blush.",f="Flattery will get you everywhere—what else you got?",x="Say that again in person over drinks."):d&&l?(s=`Honestly, ${l} is a whole story—I will tell you the good part.`,f=`Depends—are you asking about ${l} out of curiosity or research?`,x=`Better ${l} story in person. Are you free Thursday?`):d?(s="Careful, the honest answer might make you like me more.",f="I plead the fifth—unless you are buying the first round.",x="Better story in person. When are we hanging out?"):p?(s="A person of few words—good thing I speak fluent mystery.",f="Do not hurt your thumbs typing a whole novel over there.",x="Tell me what you are actually up to right now."):l?(s=`Okay, ${l} actually sounds like my kind of vibe.`,f=`Wait, you cannot just drop "${l}" and not elaborate.`,x=`We definitely need to talk more about ${l}—coffee this week?`):o.includes("haha")||o.includes("lol")||o.includes("lmao")?(s="Making you laugh this early is dangerous for both of us.",f="Glad I could entertain you—my rates go up after midnight.",x="Wait until you hear my actual voice—call later?"):(s="I was going to play it cool, but you made that impossible.",f="Are you always this much trouble or is today special?",x="Skip the small talk: what is your go-to spot for drinks?"),[{vibe:"Smooth",line:i.Smooth??s},{vibe:"Tease",line:i.Tease??f},{vibe:"Bold",line:i.Bold??x}]}async generateOnlineSuggestions(e,r){var i,l,d;const n=this.generateOfflineSuggestions(e,r);if(typeof fetch!="function")return n;const o=new AbortController,a=setTimeout(()=>o.abort(),4e3);try{const p=`${de(e,r)}
Return ONLY a JSON array of 3 objects: [{"vibe":"Smooth","line":"..."},{"vibe":"Tease","line":"..."},{"vibe":"Bold","line":"..."}]`,h=await fetch("https://text.pollinations.ai/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:"You are a concise, witty dating/chat assistant. Reply ONLY with valid JSON."},{role:"user",content:p}],model:"openai"}),signal:o.signal});if(clearTimeout(a),!h.ok)return n;const u=(await h.text()).match(/\[[\s\S]*\]/);if(!u)return n;const s=JSON.parse(u[0]);return!Array.isArray(s)||s.length<3?n:[{vibe:"Smooth",line:String(((i=s[0])==null?void 0:i.line)||n[0].line)},{vibe:"Tease",line:String(((l=s[1])==null?void 0:l.line)||n[1].line)},{vibe:"Bold",line:String(((d=s[2])==null?void 0:d.line)||n[2].line)}]}catch{return clearTimeout(a),n}}getPromptForChat(e,r){return de(e,r)}getPromptForRewrite(e){return Xe(e)}}class it{constructor(){this.engine=new at,this.filter=new et,this.lastProcessedSignature=""}recordCommittedReply(e){this.filter.recordSelfCommit(e)}isIgnoredNoiseOrSelf(e,r){return this.filter.isIgnored(e,r)}ingestRawContext(e){var a,i;const r=e.text.replace(/\s+/g," ").trim();if(this.filter.isIgnored(r,e.source))return null;const n=`${e.source}:${e.appPackage??""}:${this.filter.normalize(r)}`;if(e.source!=="manual"&&e.source!=="selection"&&n===this.lastProcessedSignature)return null;this.lastProcessedSignature=n;const o=e.timestamp??Date.now();return{id:`${e.source}-${o}`,source:e.source,partnerText:r,myLastText:((a=e.myLastText)==null?void 0:a.trim())||void 0,senderName:((i=e.senderName)==null?void 0:i.trim())||void 0,appPackage:e.appPackage,uri:e.uri,timestamp:o}}ingestScreenBlocks(e,r,n){var i;if(!e||e.length===0)return null;const o=tt(e),a=o.senderText??o.rawBlocks.find(l=>!this.filter.isIgnored(l,r));return a?{id:`${r}-${(n==null?void 0:n.timestamp)??Date.now()}`,source:r,partnerText:a.trim(),myLastText:(i=o.myLastText)==null?void 0:i.trim(),appPackage:n==null?void 0:n.appPackage,uri:n==null?void 0:n.uri,timestamp:(n==null?void 0:n.timestamp)??Date.now()}:null}resolveSuggestions(e){const r=this.engine.generateOfflineSuggestions(e.partnerText,e.myLastText);return{context:e,suggestions:r}}}const he={i:"I",im:"I'm",ive:"I've",ill:"I'll",id:"I'd",dont:"don't",cant:"can't",wont:"won't",didnt:"didn't",doesnt:"doesn't",isnt:"isn't",arent:"aren't",wasnt:"wasn't",werent:"weren't",havent:"haven't",hasnt:"hasn't",hadnt:"hadn't",wouldnt:"wouldn't",couldnt:"couldn't",shouldnt:"shouldn't",youre:"you're",youve:"you've",youll:"you'll",theyre:"they're",thats:"that's",whats:"what's",heres:"here's",theres:"there's",wheres:"where's",lets:"let's",teh:"the",hte:"the",adn:"and",nad:"and",taht:"that",waht:"what",whta:"what",hwat:"what",wiht:"with",wtih:"with",jsut:"just",jstu:"just",liek:"like",lke:"like",realy:"really",relly:"really",definately:"definitely",definetly:"definitely",seperate:"separate",recieve:"receive",occured:"occurred",untill:"until",tommorow:"tomorrow",tomorow:"tomorrow",tonite:"tonight",becuase:"because",beacuse:"because",freind:"friend",frend:"friend",prolly:"probably",probly:"probably",thx:"thanks",ty:"thank you",pls:"please",plz:"please",sry:"sorry",srry:"sorry",msg:"message",bday:"birthday",wknd:"weekend",tmrw:"tomorrow"};class st{constructor(){this.root={children:new Map,isWord:!1,frequency:0},this.bigrams=new Map,this.dictionaryWords=new Set,this.personalWords=new Set,this.seedCommonVocabulary()}insert(e,r=1){let n=this.root;const o=e.toLowerCase();for(const a of o)n.children.has(a)||n.children.set(a,{children:new Map,isWord:!1,frequency:0}),n=n.children.get(a);n.isWord=!0,n.frequency+=r,this.dictionaryWords.add(o)}learnWord(e){const r=e.trim().replace(/[^a-zA-Z']/g,"");r.length<2||(this.insert(r,25),this.personalWords.add(r.toLowerCase()))}getPersonalDictionary(){return Array.from(this.personalWords).sort()}hasWord(e){return this.dictionaryWords.has(e.toLowerCase())}autocorrect(e){const r=e.trim();if(!r||r.length<1)return null;const n=r.toLowerCase();if(he[n]){const i=he[n];return r[0]===r[0].toUpperCase()&&i[0]!==i[0].toUpperCase()?i[0].toUpperCase()+i.slice(1):i}if(this.dictionaryWords.has(n)||n.length<3)return null;let o=null,a=0;for(const i of this.dictionaryWords)if(!(Math.abs(i.length-n.length)>1)&&this.levenshtein(n,i)===1){const l=this.getWordFrequency(i);l>a&&(a=l,o=i)}return o?r[0]===r[0].toUpperCase()?o[0].toUpperCase()+o.slice(1):o:null}getWordFrequency(e){let r=this.root;for(const n of e.toLowerCase()){const o=r.children.get(n);if(!o)return 0;r=o}return r.isWord?r.frequency:0}levenshtein(e,r){const n=e.length,o=r.length,a=Array.from({length:o+1},(i,l)=>l);for(let i=1;i<=n;i++){let l=a[0];a[0]=i;for(let d=1;d<=o;d++){const p=a[d];e[i-1]===r[d-1]?a[d]=l:a[d]=1+Math.min(l,a[d],a[d-1]),l=p}}return a[o]}addBigram(e,r){const n=e.toLowerCase(),o=r.toLowerCase();let a=this.bigrams.get(n);a||(a=[],this.bigrams.set(n,a));const i=a.find(l=>l.word===o);i?i.count++:a.push({word:o,count:1}),a.sort((l,d)=>d.count-l.count)}completePrefix(e,r=3){if(!e)return[];let n=this.root;const o=e.toLowerCase();for(const i of o){if(!n.children.has(i))return[];n=n.children.get(i)}const a=[];return this.collectWords(n,o,a),a.sort((i,l)=>l.frequency-i.frequency),a.slice(0,r).map(i=>i.word)}predictNextWord(e,r=3){if(!e)return["the","you","I"];const n=e.toLowerCase(),o=this.bigrams.get(n);return o&&o.length>0?o.slice(0,r).map(a=>a.word):["and","to","you"]}collectWords(e,r,n){e.isWord&&n.push({word:r,frequency:e.frequency});for(const[o,a]of e.children.entries())this.collectWords(a,r+o,n)}seedCommonVocabulary(){const e=[["the",200],["be",180],["to",180],["of",175],["and",175],["a",170],["in",165],["that",160],["have",155],["it",155],["for",150],["not",145],["on",145],["with",140],["he",135],["as",135],["you",190],["do",130],["at",130],["this",130],["but",125],["his",120],["by",120],["from",120],["they",120],["we",125],["say",115],["her",115],["she",115],["or",115],["an",115],["will",120],["my",130],["one",115],["all",115],["would",115],["there",115],["their",110],["what",140],["so",125],["up",110],["out",110],["if",115],["about",120],["who",110],["get",115],["which",105],["go",115],["me",125],["when",120],["make",110],["can",125],["like",130],["time",115],["no",115],["just",125],["him",105],["know",120],["take",105],["people",100],["into",100],["year",95],["your",130],["good",125],["some",105],["could",105],["them",105],["see",115],["other",100],["than",100],["then",105],["now",115],["look",105],["only",105],["come",105],["its",100],["over",100],["think",110],["also",100],["back",105],["after",100],["use",100],["two",95],["how",135],["our",105],["work",105],["first",100],["well",110],["way",105],["even",100],["new",100],["want",115],["because",105],["any",100],["these",95],["give",95],["day",105],["most",95],["us",100],["are",150],["was",130],["were",110],["been",105],["has",110],["had",110],["free",110],["tonight",105],["tomorrow",100],["weekend",110],["coffee",95],["drinks",95],["dinner",95],["lunch",90],["plans",95],["sounds",105],["love",120],["talking",90],["where",115],["why",110],["going",115],["great",115],["amazing",95],["awesome",95],["cool",100],["nice",105],["sorry",100],["thanks",105],["please",105],["maybe",95],["definitely",90],["probably",90],["actually",95],["really",115],["very",110],["morning",95],["night",105],["today",105],["soon",95],["later",95],["ready",90],["busy",90],["happy",95],["excited",90],["miss",95],["wait",95],["meet",95]];for(const[n,o]of e)this.insert(n,o);const r=[["how","are"],["how","is"],["how","was"],["are","you"],["are","we"],["are","they"],["you","free"],["you","doing"],["you","up"],["what","are"],["what","is"],["what","do"],["want","to"],["going","to"],["have","to"],["good","morning"],["good","night"],["good","idea"],["sounds","good"],["sounds","great"],["sounds","fun"],["see","you"],["talk","to"],["let","me"],["on","my"],["my","way"],["this","weekend"]];for(const[n,o]of r)this.addBigram(n,o)}}function ct(t){const e=t.trim(),r=e.toLowerCase();return e?/^(hey|hi|hello|sup|yo|wyd|what'?s up)$/i.test(e)?{score:2,verdict:"Dry",feedback:"Low effort opener. High ghosting probability (~90%).",improved:"Important question: what is your most controversial food opinion?"}:r.includes("how are you")||r.includes("how was your day")?{score:4,verdict:"Safe",feedback:"Polite but sounds like an HR interview.",improved:"Tell me your day was more exciting than grocery shopping."}:r.includes("cutie")||r.includes("beautiful")||r.includes("gorgeous")?{score:5,verdict:"Safe",feedback:"Compliment is sweet, but every other match says the exact same thing.",improved:"I was going to play it cool, but you made that impossible."}:r.includes("trouble")||r.includes("bet")||r.includes("drinks")||r.includes("coffee")?{score:9,verdict:"Smooth",feedback:"High energy, playful intrigue. Ready to send.",improved:e}:{score:7,verdict:"Smooth",feedback:"Solid message. Could use 10% more cheekiness.",improved:`${e} — unless you scare easily.`}:{score:1,verdict:"Dry",feedback:"Empty canvas. Drop something bold.",improved:"Are we breaking records or rules tonight?"}}const Y=[{name:"Smileys & Rizz",icon:"😏",emojis:["😏","😉","😎","😜","😝","😛","🥳","🤩","😍","🥰","😘","😗","😙","😚","🤗","🤭","🤫","🫠","🫡","🤔","🤨","😐","😑","😶","🙄","😬","😌","😔","😪","😴","😂","🤣","😭","😅","😆","😁","😄","😃","😀","🙂","😈","👿","🫦","💅","👀","✨","🔥","💀","🤡","🥺"]},{name:"Love & Hearts",icon:"❤️",emojis:["❤️","❤️‍🔥","❤️‍🩹","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💖","💗","💓","💞","💕","💘","💝","💟","❣️","💔","💋","💌","💍","💎","🌹","🥀","💐","🌷","🌸","🥂","🍾","🍫","🍓","🍒","🫶","🫰","💑","👩‍❤️‍👨","💏"]},{name:"Gestures & Reactions",icon:"✌️",emojis:["👍","👎","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","☝️","✋","🤚","🖐️","🖖","👋","🤝","🙏","👏","🙌","👐","🤲","✊","👊","🤛","🤜","💪","🦾","🫶","🤦‍♂️","🤦‍♀️","🤷‍♂️","🤷‍♀️","💯","🎯"]},{name:"People & Vibes",icon:"🕺",emojis:["🕺","💃","👯","🧘","🏄","🚴","🏋️","🤸","🥷","🕵️","👑","🎩","🕶️","👓","🧣","👗","👔","👟","👠","👜","🧠","🫀","👁️","👅","👄","👂","👃","🫂","🗣️","👤"]},{name:"Food & Dates",icon:"☕",emojis:["☕","🍵","🧋","🥤","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🍾","🍕","🍔","🍟","🌭","🌮","🌯","🍣","🍜","🍝","🍛","🍱","🥟","🍤","🍦","🍨","🍩","🍪","🎂","🍰","🧁","🍫","🍿","🥐","🥯","🥞","🧇","🥓","🍳"]},{name:"Activities & Travel",icon:"✈️",emojis:["✈️","🚗","🏎️","🚕","🚌","🚆","🚀","🛸","⛵","🏖️","🏝️","🏔️","🏕️","🌅","🌄","🌃","🌆","🎡","🎢","🎬","🎤","🎧","🎼","🎹","🎸","🥁","🎮","🕹️","🎲","♟️","🎳","🎯","⚽","🏀","🏈","⚾","🎾","🏐","🏆","🥇"]},{name:"Symbols & Tech",icon:"⚡",emojis:["⚡","⭐","🌟","💫","✨","💥","💢","💦","💨","💤","💬","💭","🗯️","🔔","🔕","🔒","🔓","🔑","📱","💻","⌨️","📷","📸","🎥","📺","📻","⏰","⏳","💡","🔋","✅","❌","❓","❗","‼️","⁉️","⚠️","🚫","♻️","♾️"]}];function v(t){const{fragment:e}=re(t);if(e.childElementCount===1&&e.firstElementChild)return e.firstElementChild;const r=document.createElement("div");return r.style.display="contents",r.appendChild(e),r}function D(t,e){const r=document.createElement("div");r.className=t;for(const n of e){const{fragment:o}=re(n);r.appendChild(o)}return r}function lt(t){return v(m`
    <div class="action-bar">
      ${()=>t.activeContext.value?v(m`
            <button class="action-pill highlight" @click=${t.onOpenContextReplies}>
              ${Qe(t.activeContext.value)}
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
      <button class="action-pill" @click=${t.onSwitchKeyboard} title="Switch Keyboard">
        🌐
      </button>
    </div>
  `)}function ut(t){return v(m`
    <div class="stealth-bar">
      <div class="stealth-top">
        <span class="stealth-badge">🛡️ STEALTH MODE · Hidden from chat</span>
        <div class="stealth-actions">
          ${()=>t.showEnableScanner.value?v(m`
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
  `)}function dt(t){return v(m`
    <div class="suggestions-shell">
      ${()=>D("suggestions-panel",t.suggestions.value.map(e=>m`
          <div class="suggestion-card" @click=${()=>t.onSelectSuggestion(e)}>
            <span class="suggestion-text">${e}</span>
          </div>
        `))}
    </div>
  `)}const ft={q:"1",w:"2",e:"3",r:"4",t:"5",y:"6",u:"7",i:"8",o:"9",p:"0",a:"@",s:"#",d:"$",f:"%",g:"&",h:"-",j:"+",k:"(",l:")",z:"*",x:'"',c:"'",v:":",b:";",n:"!",m:"?"};function ht(t){const e=A("off"),r=A("alpha"),n=["q","w","e","r","t","y","u","i","o","p"],o=["a","s","d","f","g","h","j","k","l"],a=["z","x","c","v","b","n","m"],i=["1","2","3","4","5","6","7","8","9","0"],l=["@","#","$","_","&","-","+","(",")","/"],d=["*",'"',"'",":",";","!","?"],p=["~","`","|","•","√","π","÷","×","§","Δ"],h=["£","€","¥","^","°","=","{","}","\\","©"],c=["%","®","™","✓","[","]","<",">"],u=g=>{const C=e.value!=="off"?g.toUpperCase():g;t.onKeyPress(C),e.value==="once"&&(e.value="off")},s=()=>{e.value==="off"?e.value="once":e.value==="once"?e.value="caps":e.value="off"},f=(g,E)=>{const C=E?g.toUpperCase():g,k=ft[g]??"";let b=null,P=!1;const Z=()=>{P=!1,k&&(b=setTimeout(()=>{P=!0,t.onKeyPress(k)},380))},V=()=>{b&&(clearTimeout(b),b=null)};return m`
      <button
        class="key-btn"
        @pointerdown=${Z}
        @pointerup=${V}
        @pointerleave=${V}
        @pointercancel=${V}
        @click=${()=>{b&&(clearTimeout(b),b=null),P||u(g),P=!1}}>
        ${C}
      </button>
    `},x=()=>{let g=null,E=null,C=!1;const k=()=>{g&&(clearTimeout(g),g=null),E&&(clearInterval(E),E=null)};return m`
      <button
        class="key-btn special"
        @pointerdown=${()=>{C=!1,k(),g=setTimeout(()=>{C=!0,t.onBackspace(),E=setInterval(()=>{t.onBackspace()},55)},350)}}
        @pointerup=${k}
        @pointerleave=${k}
        @pointercancel=${k}
        @click=${()=>{k(),C||t.onBackspace(),C=!1}}>
        ⌫
      </button>
    `},y=()=>{let g=0,E=0,C=!1,k=!1;const b=F=>{g=F.clientX,E=F.clientX,C=!1,k=!0},P=F=>{if(!k||!t.onMoveCursor)return;const oe=F.clientX-E;if(Math.abs(F.clientX-g)>10&&(C=!0),Math.abs(oe)>=18){const ae=Math.trunc(oe/18);t.onMoveCursor(ae),E+=ae*18}},Z=()=>{k=!1};return m`
      <button
        class="key-btn space"
        @pointerdown=${b}
        @pointermove=${P}
        @pointerup=${Z}
        @pointercancel=${Z}
        @click=${()=>{C||t.onKeyPress(" "),C=!1}}>
        ${()=>t.stealthMode.value?"stealth space":"space"}
      </button>
    `},$e=()=>{const g=e.value!=="off",E=e.value==="caps"?"⇪":e.value==="once"?"⬆":"⇧",C=e.value==="off"?"key-btn special":"key-btn special active-shift",k=document.createElement("div");k.className="keyboard-row",k.appendChild(v(m`<button class=${C} @click=${s}>${E}</button>`));for(const b of a)k.appendChild(v(f(b,g)));return k.appendChild(v(x())),v(m`
      <div class="keyboard-grid">
        ${D("keyboard-row",n.map(b=>f(b,g)))}
        ${D("keyboard-row",o.map(b=>f(b,g)))}
        ${k}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>r.value="numbers"}>123</button>
          <button class="key-btn special" @click=${t.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${()=>t.onKeyPress(",")}>,</button>
          ${v(y())}
          <button class="key-btn special" @click=${()=>t.onKeyPress(".")}>.</button>
          <button class="key-btn send" @click=${t.onSend}>
            ${()=>t.stealthMode.value?"Ask ⚡":"Send"}
          </button>
        </div>
      </div>
    `)},ne=g=>{const E=g?p:i,C=g?h:l,k=g?c:d,b=document.createElement("div");b.className="keyboard-row",b.appendChild(v(m`
        <button
          class="key-btn special"
          @click=${()=>r.value=g?"numbers":"symbols"}>
          ${g?"123":"=\\<"}
        </button>
      `));for(const P of k)b.appendChild(v(m`<button class="key-btn" @click=${()=>t.onKeyPress(P)}>${P}</button>`));return b.appendChild(v(x())),v(m`
      <div class="keyboard-grid">
        ${D("keyboard-row",E.map(P=>m`<button class="key-btn" @click=${()=>t.onKeyPress(P)}>${P}</button>`))}
        ${D("keyboard-row",C.map(P=>m`<button class="key-btn" @click=${()=>t.onKeyPress(P)}>${P}</button>`))}
        ${b}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>r.value="alpha"}>ABC</button>
          <button class="key-btn special" @click=${t.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${()=>t.onKeyPress(",")}>,</button>
          ${v(y())}
          <button class="key-btn special" @click=${()=>t.onKeyPress(".")}>.</button>
          <button class="key-btn send" @click=${t.onSend}>
            ${()=>t.stealthMode.value?"Ask ⚡":"Send"}
          </button>
        </div>
      </div>
    `)};return v(m`
    <div class="keyboard-grid-wrapper">
      ${()=>r.value==="numbers"?ne(!1):r.value==="symbols"?ne(!0):$e()}
    </div>
  `)}function mt(t){const e=A(0),r=document.createElement("div");return r.className="emoji-tabs",Y.forEach((n,o)=>{r.appendChild(v(m`
        <button
          class=${()=>o===e.value?"emoji-tab active":"emoji-tab"}
          @click=${()=>e.value=o}>
          ${n.icon}
        </button>
      `))}),r.appendChild(v(m`<button class="emoji-tab back-key" @click=${t.onClose}>ABC</button>`)),v(m`
    <div class="emoji-view">
      ${r}
      ${()=>{const n=Y[e.value]??Y[0];return D("emoji-grid",n.emojis.map(o=>m`
            <button class="emoji-btn" @click=${()=>t.onSelectEmoji(o)}>${o}</button>
          `))}}
    </div>
  `)}function pt(t){return v(m`
    <div class="clipboard-view">
      <div class="clipboard-header">
        <span>Copied Bubbles — Tap to Paste or ⚡ Reply</span>
        <button class="back-link" @click=${t.onClose}>Close ✕</button>
      </div>
      ${()=>D("clipboard-list",t.history.value.map(e=>m`
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
  `)}function yt(t){return v(m`
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
  `)}function gt(t){return v(m`
    <div class="nextmove-view">
      <div class="nextmove-header">
        <div class="nextmove-meta">
          <span class="source-chip">
            ${()=>t.resolution.value?Ye(t.resolution.value.context):"⚡ Next Move"}
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

      ${()=>{const e=t.resolution.value;return!e||e.suggestions.length===0?v(m`
            <div class="roast-feedback">Tap "Tell Rizz" or "Scan Screen" to load chat context.</div>
          `):D("nextmove-cards",e.suggestions.map(r=>m`
            <div class="vibe-card" @click=${()=>t.onSelectReply(r.line)}>
              <span class="vibe-tag vibe-${r.vibe.toLowerCase()}">${r.vibe}</span>
              <span class="vibe-line">${r.line}</span>
            </div>
          `))}}
    </div>
  `)}const J=new st,N=new it,w=A("qwerty"),B=A(""),W=A(void 0),R=A(null),L=A(null),$=A(!1),O=A(""),q=A(null),I=A(!1),Se=A(null),te=A(["What is your biggest red flag?","Are we still on for coffee this weekend?"]),vt=be(()=>{const t=$.value?O.value:B.value;if(!t)return $.value?["asked","red","weekend"]:["how","are","you"];const e=t.trim().split(/\s+/),r=e[e.length-1];if(t.endsWith(" "))return J.predictNextWord(r,3);{const n=J.completePrefix(r,3);return n.length>0?n:[r]}});G.registerNativeCallback("appContextChanged",t=>{if(t!=null&&t.packageName){W.value=t.packageName;try{const e=ke();if(e.status==="ok"&&e.blocks.length>0){const r=N.ingestScreenBlocks(e.blocks,"accessibility",{appPackage:e.appPackage??t.packageName});r&&(R.value=r)}}catch{}}});G.registerNativeCallback("screenshotDetected",t=>{t!=null&&t.uri&&(R.value={id:`screenshot-${t.timestamp??Date.now()}`,source:"screenshot",partnerText:"Screenshot captured",uri:t.uri,appPackage:t.appPackage??W.value,timestamp:Date.now()},S("heavy"))});G.registerNativeCallback("contextDetected",t=>{if(!(t!=null&&t.text)||!(t!=null&&t.source))return;const e=N.ingestRawContext({source:t.source,text:t.text,senderName:t.senderName,appPackage:t.appPackage??W.value,timestamp:t.timestamp});e&&(R.value=e,S("click"))});G.registerNativeCallback("clipboardAdded",t=>{if(t!=null&&t.text){const e=String(t.text).trim();if(!e)return;te.value=[e,...te.value.filter(n=>n!==e).slice(0,9)];const r=N.ingestRawContext({source:"clipboard",text:e,appPackage:W.value});r&&(R.value=r)}});const M=Ve();if(M.status==="ok"&&M.text&&M.source){const t=N.ingestRawContext({source:M.source,text:M.text,senderName:M.senderName,appPackage:M.appPackage,timestamp:M.timestamp});t&&(R.value=t)}function bt(t){if(S("heavy"),t.source==="screenshot"&&t.uri){const e=Ze(t.uri),r=N.ingestScreenBlocks(e.blocks,"screenshot",{appPackage:e.appPackage??t.appPackage,uri:t.uri});if(!r){R.value=null,K("Screenshot looked blank/protected — type what they said:");return}L.value=N.resolveSuggestions(r),R.value=null,$.value=!1,w.value="nextmove";return}L.value=N.resolveSuggestions(t),R.value=null,$.value=!1,w.value="nextmove"}function wt(){S("click");const t=ke();if(t.status==="ok"&&t.blocks.length>0){const e=N.ingestScreenBlocks(t.blocks,"accessibility",{appPackage:t.appPackage??W.value});if(e){L.value=N.resolveSuggestions(e),$.value=!1,w.value="nextmove";return}}if(t.status==="not_enabled"){I.value=!0,K("Scanner off — type what they said, or tap Enable Scanner ⚙");return}I.value=!1,K("Screen protected (FLAG_SECURE) — type a quick summary here:")}function K(t){q.value=t??null,$.value=!0,w.value="qwerty"}function kt(){S("click"),$.value?($.value=!1,q.value=null,I.value=!1):(I.value=!1,K())}function me(){S("heavy");const t=O.value.trim(),e=N.ingestRawContext({source:"manual",text:t||"start playful conversation",appPackage:W.value});e&&(L.value=N.resolveSuggestions(e),$.value=!1,q.value=null,I.value=!1,w.value="nextmove")}function Ct(t){S("heavy"),N.recordCommittedReply(t),j(t),B.value=t,O.value="",w.value="qwerty"}function St(t){const e=N.ingestRawContext({source:"manual",text:t,appPackage:W.value});e&&(e.source="clipboard",L.value=N.resolveSuggestions(e),w.value="nextmove")}function pe(t){if(S("light"),$.value){O.value+=t;return}if(t===" "||t==="."||t===","||t==="!"||t==="?"){const e=B.value.match(/([a-zA-Z']+)$/);if(e){const r=e[1],n=J.autocorrect(r);if(n&&n!==r){for(let o=0;o<r.length;o++)X();B.value=B.value.slice(0,-r.length)+n+t,j(n+t);return}else J.learnWord(r)}}B.value+=t,j(t)}function $t(){if(S("light"),$.value){O.value.length>0&&(O.value=O.value.slice(0,-1));return}B.value.length>0&&(B.value=B.value.slice(0,-1)),X()}function xt(t){if(S("click"),$.value){const n=O.value,o=n.trim().split(/\s+/),a=n.endsWith(" ")?n:o.length>1?o.slice(0,-1).join(" ")+" ":"";O.value=`${a}${t} `;return}const e=B.value,r=e.trim().split(/\s+/);if(!e.endsWith(" ")&&r.length>0){const n=r[r.length-1];for(let o=0;o<n.length;o++)X()}j(t+" "),B.value=(e.endsWith(" ")?e:r.length>1?r.slice(0,-1).join(" ")+" ":"")+t+" "}function Pt(){S("heavy"),Se.value=ct(B.value),w.value="roast"}function Tt(t){S("click");for(let e=0;e<B.value.length;e++)X();N.recordCommittedReply(t),j(t),B.value=t,w.value="qwerty"}function Nt(){return m`
    <div class="rizz-app">
      ${lt({activeContext:R,stealthMode:$,onOpenContextReplies:()=>{R.value&&bt(R.value)},onScanScreen:wt,onToggleStealth:kt,onToggleRoast:()=>{w.value==="roast"?w.value="qwerty":Pt()},onToggleClipboard:()=>w.value=w.value==="clipboard"?"qwerty":"clipboard",onToggleEmojis:()=>w.value=w.value==="emojis"?"qwerty":"emojis",onVoiceInput:()=>{S("click"),Ue()},onSwitchKeyboard:()=>{S("click"),Je()}})}

      ${()=>$.value?ut({buffer:O,hint:q,showEnableScanner:I,onGenerate:me,onEnableScanner:()=>He("accessibility"),onCancel:()=>{$.value=!1,q.value=null,I.value=!1}}):""}

      ${dt({suggestions:vt,onSelectSuggestion:xt})}

      ${()=>{const t=w.value;return t==="nextmove"?gt({resolution:L,onSelectReply:Ct,onSwitchToStealth:()=>{var e;O.value=((e=L.value)==null?void 0:e.context.partnerText)??"",K()},onClose:()=>w.value="qwerty"}):t==="emojis"?mt({onSelectEmoji:pe,onClose:()=>w.value="qwerty"}):t==="clipboard"?pt({history:te,onSelectClip:e=>{N.recordCommittedReply(e),j(e),w.value="qwerty"},onAnalyzeClip:e=>{S("heavy"),St(e)},onClose:()=>w.value="qwerty"}):t==="roast"?yt({roast:Se,onApplyUpgrade:Tt,onClose:()=>w.value="qwerty"}):ht({stealthMode:$,onKeyPress:pe,onBackspace:$t,onSend:()=>{$.value?me():(S("heavy"),Ke())},onOpenEmojis:()=>w.value="emojis",onMoveCursor:e=>{S("light"),Ge(e)}})}}
    </div>
  `}const ye=document.getElementById("app");if(ye){const{fragment:t}=re(Nt());ye.appendChild(t)}
