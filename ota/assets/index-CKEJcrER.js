var De=Object.defineProperty;var We=(t,e,n)=>e in t?De(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var A=(t,e,n)=>We(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();let ce=null;const oe=new Set;let Y=!1;function Ne(){return ce}function re(t){const e=ce;return ce=t,e}function _e(t){t.isStale=!0,Y?oe.add(t):t.execute()}function je(t){const e=Y;Y=!0;try{return t()}finally{Y=e,Y||Fe()}}function Fe(){for(;oe.size>0;){const t=Array.from(oe);oe.clear();for(const e of t)e.isStale&&e.execute()}}class He{constructor(e){A(this,"_value");A(this,"_subscribers",new Set);this._value=e}get value(){const e=Ne();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}set value(e){Object.is(this._value,e)||(this._value=e,this.notify())}peek(){return this._value}notify(){const e=Array.from(this._subscribers);for(const n of e)_e(n)}_unsubscribe(e){this._subscribers.delete(e)}}function w(t){return new He(t)}class qe{constructor(e){A(this,"_value");A(this,"_node");A(this,"_subscribers",new Set);A(this,"_isDirty",!0);A(this,"_fn");this._fn=e,this._node={dependencies:new Set,isStale:!0,execute:()=>{if(!this._isDirty){this._isDirty=!0;const n=Array.from(this._subscribers);for(const o of n)_e(o)}}}}get value(){this._isDirty&&this._recompute();const e=Ne();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}peek(){return this._isDirty&&this._recompute(),this._value}_unsubscribe(e){this._subscribers.delete(e)}_recompute(){for(const n of this._node.dependencies)n._unsubscribe(this._node);this._node.dependencies.clear();const e=re(this._node);try{this._value=this._fn(),this._isDirty=!1,this._node.isStale=!1}finally{re(e)}}}function ze(t){return new qe(t)}let Ke=null;function Ve(){return Ke}function ue(t){let e;const n={dependencies:new Set,isStale:!1,execute:()=>{for(const i of n.dependencies)i._unsubscribe(n);if(n.dependencies.clear(),typeof e=="function")try{e()}catch(i){console.error("[Nova Signal Effect Cleanup Error]:",i)}const a=re(n);try{e=t()}finally{re(a),n.isStale=!1}}};n.execute();const o=()=>{for(const a of n.dependencies)a._unsubscribe(n);n.dependencies.clear(),typeof e=="function"&&e()},r=Ve();return r&&r.addCleanup(o),o}function Me(){return typeof window<"u"&&"Part"in window&&"ChildNodePart"in window&&typeof window.getParts=="function"}class fe{constructor(e){A(this,"parentNode");A(this,"previousSibling");A(this,"nextSibling");A(this,"value");A(this,"_currentNode");const n=e.parentNode;if(!n)throw new Error("[Zuari DOM Parts]: Placeholder node must have a parent container.");this.parentNode=n,this.previousSibling=e.previousSibling,this.nextSibling=e.nextSibling;const o=document.createTextNode("");n.replaceChild(o,e),this._currentNode=o}setValue(e){if(this.value=e,e instanceof DocumentFragment){const n=document.createTextNode("");this.parentNode.replaceChild(n,this._currentNode),this.parentNode.insertBefore(e,n),this._currentNode=n;return}if(e instanceof Node){this._currentNode!==e&&(this.parentNode.replaceChild(e,this._currentNode),this._currentNode=e);return}if(this._currentNode instanceof Text)this._currentNode.data=String(e??"");else{const n=document.createTextNode(String(e??""));this.parentNode.replaceChild(n,this._currentNode),this._currentNode=n}}disconnect(){}}class ye{constructor(e,n){A(this,"element");A(this,"attributeName");A(this,"value");this.element=e,this.attributeName=n}setValue(e){this.value=e,e===!1||e===null||e===void 0?this.element.removeAttribute(this.attributeName):this.element.setAttribute(this.attributeName,String(e))}disconnect(){this.element.removeAttribute(this.attributeName)}}function Ze(t){if(Me())try{const e=window.ChildNodePart;return new e(t)}catch{return new fe(t)}return new fe(t)}function Ue(t,e){if(Me())try{const n=window.AttributePart;return new n(t,e)}catch{return new ye(t,e)}return new ye(t,e)}function Ge(t,e,n,o){const r=Je(t,`<!--zuari-hole-${e}-->`);if(r){const g=Ze(r);if(ge(n)){const u=ue(()=>g.setValue(be(n)));o.push(()=>{var m;u(),(m=g.disconnect)==null||m.call(g)})}else g.setValue(n);return}const a=`data-zuari-attr-${e}`,i=Ye(t,a);if(!i)return;const{element:s,attrName:l}=i;if(l.startsWith("@")||l.startsWith("on")){const g=(l.startsWith("@")?l.slice(1):l.slice(2)).toLowerCase();if(s.removeAttribute(l),typeof n!="function")return;const u=n;s.addEventListener(g,u),o.push(()=>s.removeEventListener(g,u));return}const h=Ue(s,l);if(ge(n)){const g=ue(()=>h.setValue(be(n)));o.push(()=>{var u;g(),(u=h.disconnect)==null||u.call(h)})}else h.setValue(n)}function ge(t){return typeof t=="object"&&t!==null&&"value"in t||typeof t=="function"}function be(t){return typeof t=="object"&&t!==null&&"value"in t?t.value:typeof t=="function"?t():t}function Je(t,e){const n=document.createNodeIterator(t,NodeFilter.SHOW_COMMENT);let o=n.nextNode();for(;o;){if(`<!--${o.data}-->`===e)return o;o=n.nextNode()}return null}function Ye(t,e){const n=document.createNodeIterator(t,NodeFilter.SHOW_ELEMENT);let o=n.nextNode();for(;o;){for(const r of Array.from(o.attributes))if(r.value.includes(e))return{element:o,attrName:r.name};o=n.nextNode()}return null}const ve=new Map,Xe="<!--zuari-hole-",Qe="-->",et="data-zuari-attr-";function p(t,...e){return{strings:t,values:e}}function he(t,e){const{strings:n,values:o}=t,r=n.join("<!--?-->");let a=ve.get(r);a||(a=document.createElement("template"),a.innerHTML=n.reduce((h,g,u)=>{if(u>=o.length)return h+g;const c=/=["']?[^"'>]*$/.test(g)?`"${et}${u}"`:`${Xe}${u}${Qe}`;return h+g+c},""),ve.set(r,a));const i=a.content.cloneNode(!0),s=Array.from(i.childNodes),l=[];return o.forEach((h,g)=>Ge(i,g,h,l)),{fragment:i,destroy(){l.forEach(h=>h()),s.forEach(h=>{var g;return(g=h.parentNode)==null?void 0:g.removeChild(h)})}}}function W(){return typeof window<"u"&&window.Android?window.Android:null}function D(t){const e=W();e&&e.commitText(t)}function V(){const t=W();t&&t.deleteBackward()}function tt(){const t=W();t&&t.sendEnter()}function v(t="click"){const e=W();e&&typeof e.triggerHaptic=="function"&&e.triggerHaptic(t)}function nt(){const t=W();t&&typeof t.startVoiceTyping=="function"&&t.startVoiceTyping()}function ot(){const t=W();t&&typeof t.showInputMethodPicker=="function"&&t.showInputMethodPicker()}function rt(t){const e=W();e&&typeof e.moveCursor=="function"&&e.moveCursor(t)}function at(t){const e=W();e&&typeof e.performEditAction=="function"&&e.performEditAction(t)}function it(t){const e=W();e&&typeof e.sendDpad=="function"&&e.sendDpad(t)}const st={primary:"#006A6A",onPrimary:"#FFFFFF",primaryContainer:"#6FF7F6",onPrimaryContainer:"#002020",secondary:"#4A6363",onSecondary:"#FFFFFF",background:"#FAFDFD",onBackground:"#191C1C",surface:"#FAFDFD",onSurface:"#191C1C",surfaceVariant:"#DAE5E4",outline:"#6F7979"},lt={primary:"#4CDADA",onPrimary:"#003737",primaryContainer:"#004F4F",onPrimaryContainer:"#6FF7F6",secondary:"#B1CCCC",onSecondary:"#1C3534",background:"#191C1C",onBackground:"#E1E3E3",surface:"#191C1C",onSurface:"#E1E3E3",surfaceVariant:"#3F4948",outline:"#899392"};function ct(t=!1){const e=w(t),n=w(t?{...lt}:{...st}),o=ze(()=>!!(typeof navigator<"u"&&/android/i.test(navigator.userAgent)||typeof window<"u"&&window.Android)),r=new Map;typeof window<"u"&&(window.__zuariKotlinDispatcher=(u,m)=>{const c=r.get(u);if(c)try{const y=JSON.parse(m);c(y)}catch{c(m)}});function a(u,...m){return new Promise((c,y)=>{if(typeof window<"u"&&window.Android){const x=window.Android;if(typeof x[u]=="function")try{const $=x[u](...m);try{c(JSON.parse($))}catch{c($)}return}catch($){y($);return}}c({success:!0,mock:!0,function:u,args:m})})}function i(u,m){return r.set(u,m),()=>{r.delete(u)}}function s(u){je(()=>{n.value={...n.value,...u}})}function l(u){const m=(u==null?void 0:u.packageName)??"com.zuari.ui.theme",c=(u==null?void 0:u.themeName)??"ZuariTheme",y={...n.value,...(u==null?void 0:u.colors)??{}};return`package ${m}

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
fun ${c}(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = ZuariColorScheme,
        typography = Typography(),
        content = content
    )
}
`}function h(u){const m=(u==null?void 0:u.themeName)??"Theme.Zuari.Native",c={...n.value,...(u==null?void 0:u.colors)??{}};return`<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by @zuari/kotlin Native Android Bridge -->
<resources>
    <style name="${m}" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="colorPrimary">${c.primary}</item>
        <item name="colorOnPrimary">${c.onPrimary}</item>
        <item name="colorPrimaryContainer">${c.primaryContainer}</item>
        <item name="colorOnPrimaryContainer">${c.onPrimaryContainer}</item>
        <item name="colorSecondary">${c.secondary}</item>
        <item name="colorOnSecondary">${c.onSecondary}</item>
        <item name="android:colorBackground">${c.background}</item>
        <item name="colorOnBackground">${c.onBackground}</item>
        <item name="colorSurface">${c.surface}</item>
        <item name="colorOnSurface">${c.onSurface}</item>
        <item name="colorSurfaceVariant">${c.surfaceVariant}</item>
        <item name="colorOutline">${c.outline}</item>
    </style>
</resources>
`}function g(u){const m=u??(typeof document<"u"?document.documentElement:null);return m?ue(()=>{const c=n.value;m.style.setProperty("--md-sys-color-primary",c.primary),m.style.setProperty("--md-sys-color-on-primary",c.onPrimary),m.style.setProperty("--md-sys-color-primary-container",c.primaryContainer),m.style.setProperty("--md-sys-color-on-primary-container",c.onPrimaryContainer),m.style.setProperty("--md-sys-color-secondary",c.secondary),m.style.setProperty("--md-sys-color-on-secondary",c.onSecondary),m.style.setProperty("--md-sys-color-background",c.background),m.style.setProperty("--md-sys-color-on-background",c.onBackground),m.style.setProperty("--md-sys-color-surface",c.surface),m.style.setProperty("--md-sys-color-on-surface",c.onSurface),m.style.setProperty("--md-sys-color-surface-variant",c.surfaceVariant),m.style.setProperty("--md-sys-color-outline",c.outline)}):()=>{}}return{isAndroid:o,dynamicColors:n,isDarkTheme:e,callNativeFunction:a,registerNativeCallback:i,generateComposeThemeCode:l,generateXmlThemeCode:h,ingestDynamicPalette:s,applyToCssVariables:g}}const ae=ct(!0);function ie(){return typeof window<"u"&&window.Android?window.Android:null}function ut(t){const e=ie();if(e&&typeof e.requestScreenshotAnalysis=="function")try{return JSON.parse(e.requestScreenshotAnalysis(t))}catch{return{status:"error",blocks:[]}}return{status:"ok",blocks:[{text:"Are you free for drinks this weekend?",x:48,y:420,width:320,screenWidth:1080}]}}function Oe(){const t=ie();if(t&&typeof t.requestScreenScan=="function")try{return JSON.parse(t.requestScreenScan())}catch{return{status:"error",blocks:[]}}return{status:"ok",appPackage:"com.snapchat.android",blocks:[{text:"What is your biggest red flag?",x:52,y:460,width:300,screenWidth:1080}]}}function dt(){const t=ie();if(t&&typeof t.getActiveContext=="function")try{return JSON.parse(t.getActiveContext())}catch{return{status:"none"}}return{status:"none"}}function Re(t){const e=ie();e&&typeof e.openSystemSetting=="function"&&e.openSystemSetting(t)}function we(t,e){return`You are an elite wingman who excels at playful, concise, charismatic banter.
Your task: Suggest 3 distinct next moves for a dating app conversation.
Strict rules:
1. MAX 12 words per line.
2. NO cheesy cliché compliments like "Hey cutie" or "You must be tired from running through my mind".
3. Use witty banter, slight teasing, or confident playful framing.
4. Output MUST be valid JSON array with keys: "vibe" (Smooth | Tease | Bold) and "line" (string).

Partner said: "${t}"
${e?`Context I said previously: "${e}"`:""}

Respond ONLY with the JSON array:`}function ht(t){return`You are a charisma coach. Rewrite this bland text message into 3 sharper, confident, flirty versions.
Max 12 words each.
Bland text: "${t}"

Output ONLY a JSON array with objects: [{"vibe": "Smooth", "line": "..."}, {"vibe": "Tease", "line": "..."}, {"vibe": "Bold", "line": "..."}]`}const ke={"com.snapchat.android":"Snapchat","org.telegram.messenger":"Telegram","org.thoughtcrime.securesms":"Signal","co.hinge.app":"Hinge","com.bumble.app":"Bumble","com.tinder":"Tinder","com.instagram.android":"Instagram","com.whatsapp":"WhatsApp","web.whatsapp.com":"WhatsApp Web","instagram.com":"Instagram DM","web.telegram.org":"Telegram Web","tinder.com":"Tinder Web","bumble.com":"Bumble Web","discord.com":"Discord","x.com":"X DM"};function Ee(t){if(!t)return;const e=t.replace(/^www\./i,"");if(ke[e])return ke[e];const n=e.split("."),o=n[n.length-1];if(!o||["android","app","messenger","com","org","io"].includes(o)){const r=n[n.length-2];return r?r.charAt(0).toUpperCase()+r.slice(1):void 0}return o.charAt(0).toUpperCase()+o.slice(1)}function pt(t){const e=Ee(t.appPackage);switch(t.source){case"screenshot":return"📸 Screenshot";case"notification":return e?`🔔 ${e} Msg`:"🔔 Incoming Msg";case"clipboard":return"📋 Copied Bubble";case"accessibility":return e?`👁️ ${e} Scan`:"👁️ Screen Scan";case"selection":return"✨ Selected Text";case"dom":return e?`🌐 ${e} Chat`:"🌐 Web Chat";case"manual":return"💬 Stealth Context"}}function mt(t){const e=t.partnerText.length>26?`${t.partnerText.slice(0,26).trim()}…`:t.partnerText;switch(t.source){case"screenshot":return"📸 Screenshot Detected: Analyze Next Move";case"notification":{const n=Ee(t.appPackage);return n?`🔔 ${n}: "${e}" — Reply`:`🔔 New Msg: "${e}" — Reply`}case"clipboard":return`📋 Copied: "${e}" — Reply`;case"accessibility":case"dom":return`👁️ Scanned: "${e}" — Reply`;case"selection":return`✨ Selected: "${e}" — Reply`;case"manual":return"💬 Context Ready — View Replies"}}class ft{constructor(){this.recentSelfCommits=new Set}recordSelfCommit(e){const n=this.normalize(e);if(n&&(this.recentSelfCommits.add(n),this.recentSelfCommits.size>25)){const o=this.recentSelfCommits.values().next().value;o&&this.recentSelfCommits.delete(o)}}isIgnored(e,n){const o=e.trim();if(!o)return!0;if(n==="manual"||n==="selection")return!1;const r=this.normalize(o);return!!(this.recentSelfCommits.has(r)||/^https?:\/\/\S+$/i.test(o)||/^\d{4,8}$/.test(o))}normalize(e){return e.toLowerCase().replace(/\s+/g," ").trim()}}function yt(t){const e={rawBlocks:t.map(o=>o.text)};if(t.length===0)return e;const n=t.filter(o=>{const r=o.y<120,a=o.y>o.screenWidth*1.8;return!r&&!a});n.sort((o,r)=>o.y-r.y);for(let o=n.length-1;o>=0;o--){const r=n[o],a=r.x+r.width/2>r.screenWidth/2;if(!a&&!e.senderText?e.senderText=r.text:a&&!e.myLastText&&(e.myLastText=r.text),e.senderText&&e.myLastText)break}return e}const gt=[{id:"op-1",category:"opener",vibe:"playful",triggerKeywords:["travel","hiking","nature"],template:"Are you as adventurous as your profile says, or do you also get lost in grocery stores?"},{id:"op-2",category:"opener",vibe:"smooth",triggerKeywords:["smile","eyes","cute"],template:"I was going to wait two days to message you, but patience was never my strong suit."},{id:"op-3",category:"opener",vibe:"witty",triggerKeywords:["food","coffee","cooking"],template:"Important question: what is your most controversial culinary opinion?"},{id:"bt-1",category:"banter",vibe:"playful",triggerKeywords:["trouble","sarcasm","bad"],template:"Are you always this much trouble or did I catch you on a good day?"},{id:"bt-2",category:"banter",vibe:"witty",triggerKeywords:["challenge","bet","win"],template:"Careful, high expectations are my only weakness."},{id:"bt-3",category:"banter",vibe:"bold",triggerKeywords:["rules","late","fast"],template:"I would say you are five minutes away from being my favorite person."},{id:"wp-1",category:"wordplay",vibe:"witty",triggerKeywords:["smart","books","study","work"],template:"Are you an overdue library book? Because you have fine written all over you."},{id:"wp-2",category:"wordplay",vibe:"smooth",triggerKeywords:["music","song","playlist"],template:"If our conversation was a playlist, I would have it on repeat."},{id:"cl-1",category:"closer",vibe:"bold",triggerKeywords:["drinks","date","weekend","meet","free","tonight"],template:"Drinks this Thursday. You pick the spot, I will bring the conversation."},{id:"cl-2",category:"closer",vibe:"smooth",triggerKeywords:["coffee","tea","afternoon","sunday","morning"],template:"Let us see if you are as fun in person. Coffee tomorrow?"},{id:"rf-1",category:"banter",vibe:"playful",triggerKeywords:["red flag","toxic","flaw","worst"],template:"My biggest red flag is thinking I can win every staring contest."},{id:"sn-1",category:"banter",vibe:"bold",triggerKeywords:["snap","streak","vanish","secret","disappear"],template:"Disappearing messages just mean we have to make every line count."},{id:"wy-1",category:"banter",vibe:"witty",triggerKeywords:["wyd","doing","bored","up to","plans"],template:"Plotting my next move, and you just walked right into it."},{id:"pt-1",category:"opener",vibe:"playful",triggerKeywords:["dog","puppy","cat","pet","gym","workout"],template:"Be honest: am I competing with your pet for attention, or do I stand a chance?"}];function bt(t,e=3){const n=t.toLowerCase();if(!n.trim())return[];const o=gt.map(r=>{let a=0;for(const i of r.triggerKeywords)n.includes(i)&&(a+=2);return{entry:r,score:a}}).filter(r=>r.score>0);return o.sort((r,a)=>a.score-r.score),o.slice(0,e).map(r=>r.entry)}function vt(t){const e=new Set(["the","and","for","are","you","that","this","with","have","what","when","where","why","how","just","like","really","very","about","from","they","them","your","mine","been","were","was","will","would","could","should","going","doing","want","need","know","think","today","tonight","tomorrow","lol","haha","lmao","yeah","yep","nope","okay","hey","hii","hello"]),n=t.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(o=>o.length>=4&&!e.has(o));return n.length>0?n[n.length-1]:null}class Be{generateOfflineSuggestions(e,n){const o=e.trim(),r=o.toLowerCase(),a=bt(o,3),i={};for(const S of a)S.vibe==="smooth"&&!i.Smooth?i.Smooth=S.template:(S.vibe==="playful"||S.vibe==="witty")&&!i.Tease?i.Tease=S.template:S.vibe==="bold"&&!i.Bold&&(i.Bold=S.template);for(const S of a)!i.Smooth&&S.template!==i.Tease&&S.template!==i.Bold?i.Smooth=S.template:!i.Tease&&S.template!==i.Smooth&&S.template!==i.Bold?i.Tease=S.template:!i.Bold&&S.template!==i.Smooth&&S.template!==i.Tease&&(i.Bold=S.template);const s=vt(o),l=o.includes("?")||/^(what|why|how|where|when|who|are|do|did|would|can|wanna)\b/i.test(o),h=o.length>0&&o.split(/\s+/).length<=2&&!l,g=/^(hey|hi|hello|yo|sup|heyy+|hii+|gm|good morning)\b/i.test(r),u=/\b(sorry|my bad|apologize|late|missed)\b/i.test(r),m=/\b(cute|hot|pretty|handsome|smart|funny|sweet|love your|like your)\b/i.test(r),c=/\b(koso|kashi|kitem|khuim|mhaka|borem|barem|vhoi|naka|zala|mog)\b/i.test(r);let y,x,$;return c?(y="Borem asa! Tum koso asa?",x="Arey, itlem busy asa ki mhaka visarlo?",$="Choll, coffee-k vetam—kedna free asa?"):g?(y="Was literally just thinking about texting you—great timing.",x="Look who finally decided to grace my notifications.",$="Hey—skipping the small talk, how is your week looking?"):u?(y="All good, life happens. Just glad you are here now.",x="You owe me a coffee for the suspense, then we are even.",$="Apology accepted—make it up to me this weekend?"):m?(y="Careful, keep talking like that and I might actually blush.",x="Flattery will get you everywhere—what else you got?",$="Say that again in person over drinks."):l&&s?(y=`Honestly, ${s} is a whole story—I will tell you the good part.`,x=`Depends—are you asking about ${s} out of curiosity or research?`,$=`Better ${s} story in person. Are you free Thursday?`):l?(y="Careful, the honest answer might make you like me more.",x="I plead the fifth—unless you are buying the first round.",$="Better story in person. When are we hanging out?"):h?(y="A person of few words—good thing I speak fluent mystery.",x="Do not hurt your thumbs typing a whole novel over there.",$="Tell me what you are actually up to right now."):s?(y=`Okay, ${s} actually sounds like my kind of vibe.`,x=`Wait, you cannot just drop "${s}" and not elaborate.`,$=`We definitely need to talk more about ${s}—coffee this week?`):r.includes("haha")||r.includes("lol")||r.includes("lmao")?(y="Making you laugh this early is dangerous for both of us.",x="Glad I could entertain you—my rates go up after midnight.",$="Wait until you hear my actual voice—call later?"):(y="I was going to play it cool, but you made that impossible.",x="Are you always this much trouble or is today special?",$="Skip the small talk: what is your go-to spot for drinks?"),[{vibe:"Smooth",line:i.Smooth??y},{vibe:"Tease",line:i.Tease??x},{vibe:"Bold",line:i.Bold??$}]}async generateOnlineSuggestions(e,n){var i,s,l;const o=this.generateOfflineSuggestions(e,n);if(typeof fetch!="function")return o;const r=new AbortController,a=setTimeout(()=>r.abort(),4e3);try{const h=`${we(e,n)}
Return ONLY a JSON array of 3 objects: [{"vibe":"Smooth","line":"..."},{"vibe":"Tease","line":"..."},{"vibe":"Bold","line":"..."}]`,g=await fetch("https://text.pollinations.ai/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:"You are a concise, witty dating/chat assistant. Reply ONLY with valid JSON."},{role:"user",content:h}],model:"openai"}),signal:r.signal});if(clearTimeout(a),!g.ok)return o;const m=(await g.text()).match(/\[[\s\S]*\]/);if(!m)return o;const c=JSON.parse(m[0]);return!Array.isArray(c)||c.length<3?o:[{vibe:"Smooth",line:String(((i=c[0])==null?void 0:i.line)||o[0].line)},{vibe:"Tease",line:String(((s=c[1])==null?void 0:s.line)||o[1].line)},{vibe:"Bold",line:String(((l=c[2])==null?void 0:l.line)||o[2].line)}]}catch{return clearTimeout(a),o}}getPromptForChat(e,n){return we(e,n)}getPromptForRewrite(e){return ht(e)}}class wt{constructor(){this.engine=new Be,this.filter=new ft,this.lastProcessedSignature=""}recordCommittedReply(e){this.filter.recordSelfCommit(e)}isIgnoredNoiseOrSelf(e,n){return this.filter.isIgnored(e,n)}ingestRawContext(e){var a,i;const n=e.text.replace(/\s+/g," ").trim();if(this.filter.isIgnored(n,e.source))return null;const o=`${e.source}:${e.appPackage??""}:${this.filter.normalize(n)}`;if(e.source!=="manual"&&e.source!=="selection"&&o===this.lastProcessedSignature)return null;this.lastProcessedSignature=o;const r=e.timestamp??Date.now();return{id:`${e.source}-${r}`,source:e.source,partnerText:n,myLastText:((a=e.myLastText)==null?void 0:a.trim())||void 0,senderName:((i=e.senderName)==null?void 0:i.trim())||void 0,appPackage:e.appPackage,uri:e.uri,timestamp:r}}ingestScreenBlocks(e,n,o){var i;if(!e||e.length===0)return null;const r=yt(e),a=r.senderText??r.rawBlocks.find(s=>!this.filter.isIgnored(s,n));return a?{id:`${n}-${(o==null?void 0:o.timestamp)??Date.now()}`,source:n,partnerText:a.trim(),myLastText:(i=r.myLastText)==null?void 0:i.trim(),appPackage:o==null?void 0:o.appPackage,uri:o==null?void 0:o.uri,timestamp:(o==null?void 0:o.timestamp)??Date.now()}:null}resolveSuggestions(e){const n=this.engine.generateOfflineSuggestions(e.partnerText,e.myLastText);return{context:e,suggestions:n}}}const Ce={i:"I",im:"I'm",ive:"I've",ill:"I'll",id:"I'd",dont:"don't",cant:"can't",wont:"won't",didnt:"didn't",doesnt:"doesn't",isnt:"isn't",arent:"aren't",wasnt:"wasn't",werent:"weren't",havent:"haven't",hasnt:"hasn't",hadnt:"hadn't",wouldnt:"wouldn't",couldnt:"couldn't",shouldnt:"shouldn't",youre:"you're",youve:"you've",youll:"you'll",theyre:"they're",thats:"that's",whats:"what's",heres:"here's",theres:"there's",wheres:"where's",lets:"let's",teh:"the",hte:"the",adn:"and",nad:"and",taht:"that",waht:"what",whta:"what",hwat:"what",wiht:"with",wtih:"with",jsut:"just",jstu:"just",liek:"like",lke:"like",realy:"really",relly:"really",definately:"definitely",definetly:"definitely",seperate:"separate",recieve:"receive",occured:"occurred",untill:"until",tommorow:"tomorrow",tomorow:"tomorrow",tonite:"tonight",becuase:"because",beacuse:"because",freind:"friend",frend:"friend",prolly:"probably",probly:"probably",thx:"thanks",ty:"thank you",pls:"please",plz:"please",sry:"sorry",srry:"sorry",msg:"message",bday:"birthday",wknd:"weekend",tmrw:"tomorrow",alot:"a lot",wierd:"weird",beleive:"believe",acheive:"achieve",adress:"address",busines:"business",comming:"coming",happend:"happened",neccessary:"necessary",posible:"possible",recomend:"recommend",succesful:"successful",suprise:"surprise",thier:"their",truely:"truly"};class kt{constructor(){this.root={children:new Map,isWord:!1,frequency:0},this.bigrams=new Map,this.dictionaryWords=new Set,this.personalWords=new Set,this.seedCommonVocabulary(),this.loadPersonalDictionary()}loadPersonalDictionary(){try{if(typeof localStorage>"u")return;const e=localStorage.getItem("rizzboard_personal_dict");if(!e)return;const n=JSON.parse(e);if(Array.isArray(n))for(const o of n)this.insert(o,30),this.personalWords.add(o.toLowerCase())}catch{}}savePersonalDictionary(){try{if(typeof localStorage>"u")return;localStorage.setItem("rizzboard_personal_dict",JSON.stringify(Array.from(this.personalWords)))}catch{}}insert(e,n=1){let o=this.root;const r=e.toLowerCase();for(const a of r)o.children.has(a)||o.children.set(a,{children:new Map,isWord:!1,frequency:0}),o=o.children.get(a);o.isWord=!0,o.frequency+=n,this.dictionaryWords.add(r)}learnWord(e){const n=e.trim().replace(/[^a-zA-Z']/g,"");n.length<2||(this.insert(n,25),this.personalWords.add(n.toLowerCase()),this.savePersonalDictionary())}getPersonalDictionary(){return Array.from(this.personalWords).sort()}hasWord(e){return this.dictionaryWords.has(e.toLowerCase())}expandSnippet(e){const n=e.trim().toLowerCase();try{if(typeof localStorage<"u"){const r=localStorage.getItem("rizzboard_custom_snippets");if(r){const a=JSON.parse(r);if(a[n])return a[n]}}}catch{}return{omw:"On my way!",brb:"Be right back",gm:"Good morning!",gn:"Good night!",idk:"I don't know",tbh:"To be honest"}[n]??null}matchSwipePath(e,n=3){const o=e.toLowerCase().replace(/[^a-z]/g,"");if(o.length<2)return[];const r=o[0],a=o[o.length-1],i=[];for(const s of this.dictionaryWords){if(s.length<2||s[0]!==r||s[s.length-1]!==a)continue;let l=0;for(let h=0;h<o.length&&l<s.length;h++)o[h]===s[l]&&l++;l===s.length&&i.push({word:s,freq:this.getWordFrequency(s)})}return i.sort((s,l)=>l.freq-s.freq),i.slice(0,n).map(s=>s.word)}autocorrect(e){const n=e.trim();if(!n||n.length<1)return null;const o=n.toLowerCase();if(Ce[o]){const l=Ce[o];return n[0]===n[0].toUpperCase()&&l[0]!==l[0].toUpperCase()?l[0].toUpperCase()+l.slice(1):l}if(this.dictionaryWords.has(o)||o.length<3)return null;let r=null,a=3,i=0;const s=o.length>=5?2:1;for(const l of this.dictionaryWords){if(Math.abs(l.length-o.length)>s)continue;const h=this.levenshtein(o,l);if(h<=s){const g=this.getWordFrequency(l);(h<a||h===a&&g>i)&&(a=h,i=g,r=l)}}return r?n[0]===n[0].toUpperCase()?r[0].toUpperCase()+r.slice(1):r:null}getWordFrequency(e){let n=this.root;for(const o of e.toLowerCase()){const r=n.children.get(o);if(!r)return 0;n=r}return n.isWord?n.frequency:0}levenshtein(e,n){const o=e.length,r=n.length,a=Array.from({length:r+1},(i,s)=>s);for(let i=1;i<=o;i++){let s=a[0];a[0]=i;for(let l=1;l<=r;l++){const h=a[l];e[i-1]===n[l-1]?a[l]=s:a[l]=1+Math.min(s,a[l],a[l-1]),s=h}}return a[r]}addBigram(e,n){const o=e.toLowerCase(),r=n.toLowerCase();let a=this.bigrams.get(o);a||(a=[],this.bigrams.set(o,a));const i=a.find(s=>s.word===r);i?i.count++:a.push({word:r,count:1}),a.sort((s,l)=>l.count-s.count)}completePrefix(e,n=3){if(!e)return[];let o=this.root;const r=e.toLowerCase();for(const i of r){if(!o.children.has(i))return[];o=o.children.get(i)}const a=[];return this.collectWords(o,r,a),a.sort((i,s)=>s.frequency-i.frequency),a.slice(0,n).map(i=>i.word)}predictNextWord(e,n=3){if(!e)return["the","you","I"];const o=e.toLowerCase(),r=this.bigrams.get(o);return r&&r.length>0?r.slice(0,n).map(a=>a.word):["and","to","you"]}collectWords(e,n,o){e.isWord&&o.push({word:n,frequency:e.frequency});for(const[r,a]of e.children.entries())this.collectWords(a,n+r,o)}seedCommonVocabulary(){const e=[["the",200],["be",180],["to",180],["of",175],["and",175],["a",170],["in",165],["that",160],["have",155],["it",155],["for",150],["not",145],["on",145],["with",140],["he",135],["as",135],["you",190],["do",130],["at",130],["this",130],["but",125],["his",120],["by",120],["from",120],["they",120],["we",125],["say",115],["her",115],["she",115],["or",115],["an",115],["will",120],["my",130],["one",115],["all",115],["would",115],["there",115],["their",110],["what",140],["so",125],["up",110],["out",110],["if",115],["about",120],["who",110],["get",115],["which",105],["go",115],["me",125],["when",120],["make",110],["can",125],["like",130],["time",115],["no",115],["just",125],["him",105],["know",120],["take",105],["people",100],["into",100],["year",95],["your",130],["good",125],["some",105],["could",105],["them",105],["see",115],["other",100],["than",100],["then",105],["now",115],["look",105],["only",105],["come",105],["its",100],["over",100],["think",110],["also",100],["back",105],["after",100],["use",100],["two",95],["how",135],["our",105],["work",105],["first",100],["well",110],["way",105],["even",100],["new",100],["want",115],["because",105],["any",100],["these",95],["give",95],["day",105],["most",95],["us",100],["are",150],["was",130],["were",110],["been",105],["has",110],["had",110],["free",110],["tonight",105],["tomorrow",100],["weekend",110],["coffee",95],["drinks",95],["dinner",95],["lunch",90],["plans",95],["sounds",105],["love",120],["talking",90],["where",115],["why",110],["going",115],["great",115],["amazing",95],["awesome",95],["cool",100],["nice",105],["sorry",100],["thanks",105],["please",105],["maybe",95],["definitely",90],["probably",90],["actually",95],["really",115],["very",110],["morning",95],["night",105],["today",105],["soon",95],["later",95],["ready",90],["busy",90],["happy",95],["excited",90],["miss",95],["wait",95],["meet",95]];for(const[r,a]of e)this.insert(r,a);const n=[["how","are"],["how","is"],["how","was"],["are","you"],["are","we"],["are","they"],["you","free"],["you","doing"],["you","up"],["what","are"],["what","is"],["what","do"],["want","to"],["going","to"],["have","to"],["good","morning"],["good","night"],["good","idea"],["sounds","good"],["sounds","great"],["sounds","fun"],["see","you"],["talk","to"],["let","me"],["on","my"],["my","way"],["this","weekend"],["koso","asa"],["kashi","asa"],["borem","asa"],["barem","asa"],["kitem","zala"],["kitem","karta"],["khuim","veta"],["mhaka","zai"],["dev","borem"],["borem","korum"],["mog","karta"]];for(const[r,a]of n)this.addBigram(r,a);const o=[["koso",95],["kashi",95],["asa",110],["asai",80],["borem",95],["barem",90],["dev",85],["korum",80],["tum",100],["tuzo",85],["tujem",85],["mhaka",95],["mhajo",85],["amcho",80],["kitem",95],["khuim",90],["kedna",85],["kityak",85],["vhoi",90],["naka",90],["zala",90],["zale",85],["jata",85],["yetam",85],["vetam",85],["karta",90],["veta",85],["zai",95],["mog",95],["moga",90],["ghar",85],["ghara",85],["varan",80],["bhat",80],["xitt",80],["kodi",80],["nuste",80],["khabar",85],["kobar",80],["ulo",80],["polle",85],["rav",85]];for(const[r,a]of o)this.insert(r,a)}}function Ct(t){const e=t.trim(),n=e.toLowerCase();return e?/^(hey|hi|hello|sup|yo|wyd|what'?s up)$/i.test(e)?{score:2,verdict:"Dry",feedback:"Low effort opener. High ghosting probability (~90%).",improved:"Important question: what is your most controversial food opinion?"}:n.includes("how are you")||n.includes("how was your day")?{score:4,verdict:"Safe",feedback:"Polite but sounds like an HR interview.",improved:"Tell me your day was more exciting than grocery shopping."}:n.includes("cutie")||n.includes("beautiful")||n.includes("gorgeous")?{score:5,verdict:"Safe",feedback:"Compliment is sweet, but every other match says the exact same thing.",improved:"I was going to play it cool, but you made that impossible."}:n.includes("trouble")||n.includes("bet")||n.includes("drinks")||n.includes("coffee")?{score:9,verdict:"Smooth",feedback:"High energy, playful intrigue. Ready to send.",improved:e}:{score:7,verdict:"Smooth",feedback:"Solid message. Could use 10% more cheekiness.",improved:`${e} — unless you scare easily.`}:{score:1,verdict:"Dry",feedback:"Empty canvas. Drop something bold.",improved:"Are we breaking records or rules tonight?"}}const Z=[{name:"Smileys & Rizz",icon:"😏",emojis:["😏","😉","😎","😜","😝","😛","🥳","🤩","😍","🥰","😘","😗","😙","😚","🤗","🤭","🤫","🫠","🫡","🤔","🤨","😐","😑","😶","🙄","😬","😌","😔","😪","😴","😂","🤣","😭","😅","😆","😁","😄","😃","😀","🙂","😈","👿","🫦","💅","👀","✨","🔥","💀","🤡","🥺"]},{name:"Love & Hearts",icon:"❤️",emojis:["❤️","❤️‍🔥","❤️‍🩹","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💖","💗","💓","💞","💕","💘","💝","💟","❣️","💔","💋","💌","💍","💎","🌹","🥀","💐","🌷","🌸","🥂","🍾","🍫","🍓","🍒","🫶","🫰","💑","👩‍❤️‍👨","💏"]},{name:"Gestures & Reactions",icon:"✌️",emojis:["👍","👎","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","☝️","✋","🤚","🖐️","🖖","👋","🤝","🙏","👏","🙌","👐","🤲","✊","👊","🤛","🤜","💪","🦾","🫶","🤦‍♂️","🤦‍♀️","🤷‍♂️","🤷‍♀️","💯","🎯"]},{name:"People & Vibes",icon:"🕺",emojis:["🕺","💃","👯","🧘","🏄","🚴","🏋️","🤸","🥷","🕵️","👑","🎩","🕶️","👓","🧣","👗","👔","👟","👠","👜","🧠","🫀","👁️","👅","👄","👂","👃","🫂","🗣️","👤"]},{name:"Food & Dates",icon:"☕",emojis:["☕","🍵","🧋","🥤","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🍾","🍕","🍔","🍟","🌭","🌮","🌯","🍣","🍜","🍝","🍛","🍱","🥟","🍤","🍦","🍨","🍩","🍪","🎂","🍰","🧁","🍫","🍿","🥐","🥯","🥞","🧇","🥓","🍳"]},{name:"Activities & Travel",icon:"✈️",emojis:["✈️","🚗","🏎️","🚕","🚌","🚆","🚀","🛸","⛵","🏖️","🏝️","🏔️","🏕️","🌅","🌄","🌃","🌆","🎡","🎢","🎬","🎤","🎧","🎼","🎹","🎸","🥁","🎮","🕹️","🎲","♟️","🎳","🎯","⚽","🏀","🏈","⚾","🎾","🏐","🏆","🥇"]},{name:"Symbols & Tech",icon:"⚡",emojis:["⚡","⭐","🌟","💫","✨","💥","💢","💦","💨","💤","💬","💭","🗯️","🔔","🔕","🔒","🔓","🔑","📱","💻","⌨️","📷","📸","🎥","📺","📻","⏰","⏳","💡","🔋","✅","❌","❓","❗","‼️","⁉️","⚠️","🚫","♻️","♾️"]}];function d(t){const{fragment:e}=he(t);if(e.childElementCount===1&&e.firstElementChild)return e.firstElementChild;const n=document.createElement("div");return n.style.display="contents",n.appendChild(e),n}function I(t,e){const n=document.createElement("div");n.className=t;for(const o of e){const{fragment:r}=he(o);n.appendChild(r)}return n}function M(t,e=18){return p`<svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d=${t}/></svg>`}const z={mic:()=>M("M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8"),scan:()=>M("M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"),chat:()=>M("M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"),flame:()=>M("M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"),clipboard:()=>M("M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6v4H9z"),emoji:()=>M("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01"),edit:()=>M("M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"),help:()=>M("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01"),theme:()=>M("M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"),oneHanded:()=>M("M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2 M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2 M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8 M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"),numbers:()=>M("M4 9h16 M4 15h16 M10 3L8 21 M16 3l-2 18"),globe:()=>M("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"),talks:()=>M("M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"),height:()=>M("M12 3v18 M8 7l4-4 4 4 M8 17l4 4 4-4")};function St(t){return d(p`
    <div class="action-bar">
      ${()=>t.activeContext.value?d(p`
            <button class="action-pill highlight" @click=${t.onOpenContextReplies}>
              ${mt(t.activeContext.value)}
            </button>
          `):""}
      <button class="action-pill" @click=${t.onVoiceInput} title="Google Voice Typing">
        ${d(z.mic())}
      </button>
      <button class="action-pill" @click=${t.onScanScreen} title="Scan Screen">
        ${d(z.scan())}
      </button>
      <button
        class=${()=>t.stealthMode.value?"action-pill active-mode":"action-pill"}
        @click=${t.onToggleStealth}
        title="Tell Rizz">
        ${d(z.chat())}
      </button>
      <button class="action-pill" @click=${t.onToggleRoast} title="Roast Draft">
        ${d(z.flame())}
      </button>
      <button class="action-pill" @click=${t.onToggleClipboard} title="Clipboard">
        ${d(z.clipboard())}
      </button>
      <button class="action-pill" @click=${t.onToggleEmojis} title="Emojis">
        ${d(z.emoji())}
      </button>
      <button class="action-pill" @click=${t.onToggleTalks} title="Rizz Talks">
        ${d(z.talks())}
      </button>
      <button class="action-pill" @click=${t.onToggleHelp} title="Quick Settings">
        ${d(z.help())}
      </button>
      <button class="action-pill" @click=${t.onSwitchKeyboard} title="Switch Keyboard">
        ${d(z.globe())}
      </button>
    </div>
  `)}function $t(t){return d(p`
    <div class="stealth-bar">
      <div class="stealth-top">
        <span class="stealth-badge">🛡️ STEALTH MODE · Hidden from chat</span>
        <div class="stealth-actions">
          ${()=>t.showEnableScanner.value?d(p`
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
  `)}function xt(t){return d(p`
    <div class="suggestions-shell">
      ${()=>I("suggestions-panel",t.suggestions.value.map(e=>p`
          <div class="suggestion-card" @click=${()=>t.onSelectSuggestion(e)}>
            <span class="suggestion-text">${e}</span>
          </div>
        `))}
    </div>
  `)}const Tt={q:"1",w:"2",e:"3",r:"4",t:"5",y:"6",u:"7",i:"8",o:"9",p:"0",a:"@",s:"#",d:"$",f:"%",g:"&",h:"-",j:"+",k:"(",l:")",z:"*",x:'"',c:"'",v:":",b:";",n:"!",m:"?"};function Pt(t){const e=w("off"),n=w("alpha"),o=ALPHA_ROW_1,r=ALPHA_ROW_2,a=ALPHA_ROW_3,i=NUM_ROW_1,s=NUM_ROW_2,l=NUM_ROW_3,h=SYM_ROW_1,g=SYM_ROW_2,u=SYM_ROW_3,m=k=>{const _=e.value!=="off"?k.toUpperCase():k;t.onKeyPress(_),e.value==="once"&&(e.value="off")},c=()=>{e.value==="off"?e.value="once":e.value==="once"?e.value="caps":e.value="off"},y=(k,E)=>{const _=E?k.toUpperCase():k,O=Tt[k]??"";let b=null,T=!1;const pe=()=>{T=!1,O&&(b=setTimeout(()=>{T=!0,t.onKeyPress(O)},380))},ee=()=>{b&&(clearTimeout(b),b=null)};return p`
      <button
        class="key-btn"
        data-key=${_}
        @pointerdown=${pe}
        @pointerup=${ee}
        @pointerleave=${ee}
        @pointercancel=${ee}
        @click=${()=>{b&&(clearTimeout(b),b=null),T||m(k),T=!1}}>
        ${_}
      </button>
    `},x=()=>{let k=null,E=null,_=!1,O=0;const b=()=>{k&&(clearTimeout(k),k=null),E&&(clearInterval(E),E=null)};return p`
      <button
        class="key-btn special"
        @pointerdown=${te=>{O=te.clientX,_=!1,b(),k=setTimeout(()=>{_=!0,t.onBackspace(),E=setInterval(()=>{t.onBackspace()},55)},350)}}
        @pointermove=${te=>{var me;O-te.clientX>=28&&!_&&(_=!0,b(),(me=t.onDeleteWord)==null||me.call(t))}}
        @pointerup=${b}
        @pointerleave=${b}
        @pointercancel=${b}
        @click=${()=>{b(),_||t.onBackspace(),_=!1}}>
        ⌫
      </button>
    `},$=()=>{const k=e.value!=="off",E=e.value==="caps"?"⇪":e.value==="once"?"⬆":"⇧",_=e.value==="off"?"key-btn special":"key-btn special active-shift",O=document.createElement("div");O.className="keyboard-row",O.appendChild(d(p`<button class=${_} @click=${c}>${E}</button>`));for(const b of a)O.appendChild(d(y(b,k)));return O.appendChild(d(x())),d(p`
      <div class="keyboard-grid">
        ${()=>{var b;return(b=t.showNumberRow)!=null&&b.value?I("keyboard-row",i.map(T=>p`<button class="key-btn" @click=${()=>t.onKeyPress(T)}>${T}</button>`)):""}}
        ${I("keyboard-row",o.map(b=>y(b,k)))}
        ${I("keyboard-row",r.map(b=>y(b,k)))}
        ${O}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>n.value="numbers"}>123</button>
          <button class="key-btn special" @click=${t.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${()=>t.onKeyPress(",")}>,</button>
          <button class="key-btn space" @click=${()=>t.onKeyPress(" ")}>
            ${()=>t.stealthMode.value?"stealth space":"space"}
          </button>
          <button class="key-btn special" @click=${()=>t.onKeyPress(".")}>.</button>
          <button class="key-btn send" @click=${t.onSend}>
            ${()=>t.stealthMode.value?"Ask ⚡":"Send"}
          </button>
        </div>
      </div>
    `)},S=k=>{const E=k?h:i,_=k?g:s,O=k?u:l,b=document.createElement("div");b.className="keyboard-row",b.appendChild(d(p`
        <button
          class="key-btn special"
          @click=${()=>n.value=k?"numbers":"symbols"}>
          ${k?"123":"=\\<"}
        </button>
      `));for(const T of O)b.appendChild(d(p`<button class="key-btn" @click=${()=>t.onKeyPress(T)}>${T}</button>`));return b.appendChild(d(x())),d(p`
      <div class="keyboard-grid">
        ${I("keyboard-row",E.map(T=>p`<button class="key-btn" @click=${()=>t.onKeyPress(T)}>${T}</button>`))}
        ${I("keyboard-row",_.map(T=>p`<button class="key-btn" @click=${()=>t.onKeyPress(T)}>${T}</button>`))}
        ${b}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>n.value="alpha"}>ABC</button>
          <button class="key-btn special" @click=${t.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${()=>t.onKeyPress(",")}>,</button>
          <button class="key-btn space" @click=${()=>t.onKeyPress(" ")}>
            ${()=>t.stealthMode.value?"stealth space":"space"}
          </button>
          <button class="key-btn special" @click=${()=>t.onKeyPress(".")}>.</button>
          <button class="key-btn send" @click=${t.onSend}>
            ${()=>t.stealthMode.value?"Ask ⚡":"Send"}
          </button>
        </div>
      </div>
    `)};return d(p`
    <div class="keyboard-grid-wrapper">
      ${()=>n.value==="numbers"?S(!1):n.value==="symbols"?S(!0):$()}
    </div>
  `)}const Ie="rizzboard_recent_emojis";function de(){try{const t=localStorage.getItem(Ie);if(!t)return["😏","🔥","❤️","😂","✨","👀","💯","🥂"];const e=JSON.parse(t);return Array.isArray(e)&&e.length>0?e:["😏","🔥","❤️","😂"]}catch{return["😏","🔥","❤️","😂"]}}function At(t){try{const e=de().filter(o=>o!==t),n=[t,...e].slice(0,16);localStorage.setItem(Ie,JSON.stringify(n))}catch{}}function Nt(t){const e=w(0),n=w(""),o=w(de()),r=i=>{At(i),o.value=de(),t.onSelectEmoji(i)},a=document.createElement("div");return a.className="emoji-tabs",a.appendChild(d(p`
      <button
        class=${()=>e.value===0?"emoji-tab active":"emoji-tab"}
        @click=${()=>{n.value="",e.value=0}}>
        🕒
      </button>
    `)),Z.forEach((i,s)=>{const l=s+1;a.appendChild(d(p`
        <button
          class=${()=>l===e.value?"emoji-tab active":"emoji-tab"}
          @click=${()=>{n.value="",e.value=l}}>
          ${i.icon}
        </button>
      `))}),a.appendChild(d(p`<button class="emoji-tab back-key" @click=${t.onClose}>ABC</button>`)),d(p`
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
      ${()=>{const i=n.value.trim().toLowerCase();let s;if(i){const l=Z.filter(h=>h.name.toLowerCase().includes(i));s=l.length>0?l.flatMap(h=>h.emojis):Z.flatMap(h=>h.emojis)}else e.value===0?s=o.value:s=(Z[e.value-1]??Z[0]).emojis;return I("emoji-grid",s.map(l=>p`
            <button class="emoji-btn" @click=${()=>r(l)}>${l}</button>
          `))}}
    </div>
  `)}function _t(t){const e=w([]),n=o=>{e.value.includes(o)?e.value=e.value.filter(r=>r!==o):e.value=[o,...e.value]};return d(p`
    <div class="clipboard-view">
      <div class="clipboard-header">
        <span>Clipboard — Tap to Paste or ⚡ Reply</span>
        <div style="display:flex; gap:8px; align-items:center;">
          ${t.onClearAll?d(p`<button class="back-link" @click=${t.onClearAll}>Clear</button>`):""}
          <button class="back-link" @click=${t.onClose}>Close ✕</button>
        </div>
      </div>
      ${()=>{const o=e.value,r=[...t.history.value.filter(a=>o.includes(a)),...t.history.value.filter(a=>!o.includes(a))];return r.length===0?d(p`
            <div style="padding: 20px; text-align: center; opacity: 0.6; font-size: 13px;">
              Clipboard is empty. Copy any message to see it here.
            </div>
          `):I("clipboard-list",r.map(a=>{const i=o.includes(a);return p`
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
                ${t.onDeleteClip?d(p`
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
  `)}function zt(t){return d(p`
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
  `)}function Mt(t){return d(p`
    <div class="nextmove-view">
      <div class="nextmove-header">
        <div class="nextmove-meta">
          <span class="source-chip">
            ${()=>t.resolution.value?pt(t.resolution.value.context):"⚡ Next Move"}
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

      ${()=>{const e=t.resolution.value;return!e||e.suggestions.length===0?d(p`
            <div class="roast-feedback">Tap "Tell Rizz" or "Scan Screen" to load chat context.</div>
          `):I("nextmove-cards",e.suggestions.map(n=>p`
            <div class="vibe-card" @click=${()=>t.onSelectReply(n.line)}>
              <span class="vibe-tag vibe-${n.vibe.toLowerCase()}">${n.vibe}</span>
              <span class="vibe-line">${n.line}</span>
            </div>
          `))}}
    </div>
  `)}function Ot(t){const e=o=>{v("click"),at(o)},n=o=>{v("light"),it(o)};return d(p`
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
  `)}const Rt=[{icon:"✨",title:"Auto Chat Replies",desc:"Opens automatically when a chat is detected, or swipe up on Spacebar."},{icon:"🔢",title:"Long-Press Numbers & Symbols",desc:`Hold q–p for 1–0, or hold a–m for @ # $ % & - + ( ) * " ' : ; ! ?`},{icon:"⌫",title:"Swipe Left / Hold Backspace",desc:"Hold ⌫ to repeat-delete, or swipe left on ⌫ to delete a whole word."},{icon:"↔️",title:"Spacebar Cursor Scrub",desc:"Slide your finger left or right on Spacebar to move the cursor."},{icon:"🎙️",title:"Google Voice Typing",desc:"Tap Mic in the top bar for instant voice dictation."},{icon:"✂️",title:"Text Editing & D-Pad",desc:"Tap ✂️ for Select All, Copy, Cut, Paste, and arrow keys."},{icon:"📋",title:"Clipboard & Emoji Search",desc:"Pin/delete clips in 📋, or search 250+ emojis in 😏."}];function Et(t){return d(p`
    <div class="help-view" style="padding: 8px; max-height: 220px; overflow-y: auto;">
      <div class="clipboard-header" style="margin-bottom: 6px;">
        <span>RizzBoard Gestures & Guide</span>
        <div style="display:flex; gap:8px;">
          <button class="back-link" @click=${()=>Re("setup")}>⚙ Setup</button>
          <button class="back-link" @click=${t.onClose}>ABC ✕</button>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${Rt.map(e=>p`
          <div class="help-card">
            <span style="font-size: 16px; min-width: 24px; text-align: center;">${e.icon}</span>
            <div>
              <div style="font-weight: 600; font-size: 12px;">${e.title}</div>
              <div style="opacity: 0.72; font-size: 11px;">${e.desc}</div>
            </div>
          </div>
        `)}
      </div>
    </div>
  `)}const le=[{name:"Icebreakers",lines:["Two truths and a lie—you go first.","What is the most spontaneous thing you have done this year?","Unpopular opinion: what food is wildly overrated?"]},{name:"Flirty",lines:["I was going to play it cool, but you made that impossible.","Careful, keep talking like that and I might actually like you.","Are you always this much trouble or is today special?"]},{name:"Date Pivots",lines:["This is fun, but I am way better in person. Coffee this week?","Skip the small talk—what is your go-to spot for drinks?","Are you free Thursday evening? I know a great place."]},{name:"Recovery",lines:["You are a person of few words—good thing I speak fluent mystery.","I will take that as a yes. What are you up to this weekend?","Do not hurt your thumbs typing a whole novel over there."]},{name:"Deals",lines:["Quick check-in—are we still aligned to kick this off this week?","Totally fair—let us look at the ROI: this pays for itself in week one.","If everything looks good, I can send the agreement over today—shall we lock it in?"]}];function Bt(t){const e=w(0);return d(p`
    <div class="clipboard-view" style="padding: 8px;">
      <div class="clipboard-header">
        <span>Rizz Talks — Tap to Insert</span>
        <button class="back-link" @click=${t.onClose}>ABC ✕</button>
      </div>
      <div class="emoji-tabs" style="margin-bottom: 6px;">
        ${le.map((n,o)=>p`
          <button
            class=${()=>o===e.value?"emoji-tab active":"emoji-tab"}
            style="font-size: 11px; padding: 4px 8px;"
            @click=${()=>e.value=o}>
            ${n.name}
          </button>
        `)}
      </div>
      ${()=>{const n=le[e.value]??le[0];return I("clipboard-list",n.lines.map(o=>p`
            <div class="clipboard-item-row">
              <div class="clipboard-item" @click=${()=>t.onSelectLine(o)}>
                ${o}
              </div>
            </div>
          `))}}
    </div>
  `)}function It(t){return d(p`
    <div class="clipboard-view" style="padding: 8px;">
      <div class="clipboard-header" style="margin-bottom: 8px;">
        <span>Quick Settings</span>
        <button class="back-link" @click=${t.onClose}>ABC ✕</button>
      </div>
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px;">
        <button class="key-btn special" style="height:52px; flex-direction:column; gap:2px; font-size:11px;" @click=${t.onCycleTheme}>
          ${d(z.theme())}
          <span>${()=>t.theme.value}</span>
        </button>
        <button class="key-btn special" style="height:52px; flex-direction:column; gap:2px; font-size:11px;" @click=${t.onToggleOneHanded}>
          ${d(z.oneHanded())}
          <span>${()=>t.oneHanded.value}</span>
        </button>
        <button class="key-btn special" style="height:52px; flex-direction:column; gap:2px; font-size:11px;" @click=${t.onCycleHeight}>
          ${d(z.height())}
          <span>${()=>t.height.value}</span>
        </button>
        <button class="key-btn special" style="height:52px; flex-direction:column; gap:2px; font-size:11px;" @click=${t.onToggleNumberRow}>
          ${d(z.numbers())}
          <span>${()=>t.numberRow.value?"1-0: ON":"1-0: OFF"}</span>
        </button>
        <button class="key-btn special" style="height:52px; flex-direction:column; gap:2px; font-size:11px;" @click=${t.onOpenTextEdit}>
          ${d(z.edit())}
          <span>Text Edit</span>
        </button>
        <button class="key-btn special" style="height:52px; flex-direction:column; gap:2px; font-size:11px;" @click=${t.onOpenHelp}>
          ${d(z.help())}
          <span>Guide</span>
        </button>
      </div>
    </div>
  `)}function se(t,e,n){try{const o=localStorage.getItem(t);if(o&&e.includes(o))return o}catch{}return n}const K=new kt,f=w("qwerty"),C=w(""),U=w(se("rizzboard_theme",["slate","amoled","light"],"slate")),G=w(se("rizzboard_one_handed",["off","right","left"],"off")),ne=w(se("rizzboard_number_row",["true","false"],"false")==="true"),J=w(se("rizzboard_height",["normal","compact","tall"],"normal")),Lt=w(!1),H=w(void 0),R=w(null),L=w(null),P=w(!1),B=w(""),X=w(null),F=w(!1),Le=w(null),q=w(["What is your biggest red flag?","Are we still on for coffee this weekend?"]),Dt=ze(()=>{const t=P.value?B.value:C.value;if(!t)return P.value?["asked","red","weekend"]:["how","are","you"];const e=t.trim().split(/\s+/),n=e[e.length-1];if(t.endsWith(" "))return K.predictNextWord(n,3);const o=K.completePrefix(n,3);return o.length>0?o:[n]}),N=new wt;ae.registerNativeCallback("appContextChanged",t=>{if(t!=null&&t.packageName){H.value=t.packageName;try{const e=Oe();if(e.status==="ok"&&e.blocks.length>0){const n=N.ingestScreenBlocks(e.blocks,"accessibility",{appPackage:e.appPackage??t.packageName});n&&(R.value=n)}}catch{}}});ae.registerNativeCallback("screenshotDetected",t=>{t!=null&&t.uri&&(R.value={id:`screenshot-${t.timestamp??Date.now()}`,source:"screenshot",partnerText:"Screenshot captured",uri:t.uri,appPackage:t.appPackage??H.value,timestamp:Date.now()},v("heavy"))});ae.registerNativeCallback("contextDetected",t=>{if(!(t!=null&&t.text)||!(t!=null&&t.source))return;const e=N.ingestRawContext({source:t.source,text:t.text,senderName:t.senderName,appPackage:t.appPackage??H.value,timestamp:t.timestamp});e&&(R.value=e,v("click"))});ae.registerNativeCallback("clipboardAdded",t=>{if(t!=null&&t.text){const e=String(t.text).trim();if(!e)return;q.value=[e,...q.value.filter(o=>o!==e).slice(0,9)];const n=N.ingestRawContext({source:"clipboard",text:e,appPackage:H.value});n&&(R.value=n)}});const j=dt();if(j.status==="ok"&&j.text&&j.source){const t=N.ingestRawContext({source:j.source,text:j.text,senderName:j.senderName,appPackage:j.appPackage,timestamp:j.timestamp});t&&(R.value=t)}function Se(t){if(v("heavy"),t.source==="screenshot"&&t.uri){const n=ut(t.uri),o=N.ingestScreenBlocks(n.blocks,"screenshot",{appPackage:n.appPackage??t.appPackage,uri:t.uri});if(!o){R.value=null,Q("Screenshot looked blank/protected — type what they said:");return}L.value=N.resolveSuggestions(o),R.value=null,P.value=!1,f.value="nextmove";return}L.value=N.resolveSuggestions(t),R.value=null,P.value=!1,f.value="nextmove",new Be().generateOnlineSuggestions(t.partnerText).then(n=>{var o;((o=L.value)==null?void 0:o.context.id)===t.id&&n.length>=3&&(L.value={...L.value,suggestions:n})}).catch(()=>{})}function $e(){v("click");const t=Oe();if(t.status==="ok"&&t.blocks.length>0){const e=N.ingestScreenBlocks(t.blocks,"accessibility",{appPackage:t.appPackage??H.value});if(e){L.value=N.resolveSuggestions(e),P.value=!1,f.value="nextmove";return}}if(t.status==="not_enabled"){F.value=!0,Q("Scanner off — type what they said, or tap Enable Scanner ⚙");return}F.value=!1,Q("Screen protected (FLAG_SECURE) — type a quick summary here:")}function Q(t){X.value=t??null,P.value=!0,f.value="qwerty"}function Wt(){v("click"),P.value?(P.value=!1,X.value=null,F.value=!1):(F.value=!1,Q())}function xe(){v("heavy");const t=B.value.trim(),e=N.ingestRawContext({source:"manual",text:t||"start playful conversation",appPackage:H.value});e&&(L.value=N.resolveSuggestions(e),P.value=!1,X.value=null,F.value=!1,f.value="nextmove")}function jt(t){v("heavy"),N.recordCommittedReply(t),D(t),C.value=t,B.value="",f.value="qwerty"}function Ft(t){const e=N.ingestRawContext({source:"manual",text:t,appPackage:H.value});e&&(e.source="clipboard",L.value=N.resolveSuggestions(e),f.value="nextmove")}function Te(t){if(v("light"),P.value){B.value+=t;return}if(t===" "&&/[a-zA-Z0-9]$/.test(C.value.slice(0,-1))&&C.value.endsWith(" ")){V(),C.value=C.value.slice(0,-1)+". ",D(". ");return}if(t===" "||t==="."||t===","||t==="!"||t==="?"){const e=C.value.match(/([a-zA-Z']+)$/);if(e){const n=e[1],r=K.expandSnippet(n)??K.autocorrect(n);if(r&&r!==n){for(let a=0;a<n.length;a++)V();C.value=C.value.slice(0,-n.length)+r+t,D(r+t);return}else Lt.value||K.learnWord(n)}}C.value+=t,D(t)}function Pe(){if(v("light"),P.value){B.value.length>0&&(B.value=B.value.slice(0,-1));return}C.value.length>0&&(C.value=C.value.slice(0,-1)),V()}function Ht(t){if(v("click"),P.value){const o=B.value,r=o.trim().split(/\s+/),a=o.endsWith(" ")?o:r.length>1?r.slice(0,-1).join(" ")+" ":"";B.value=`${a}${t} `;return}const e=C.value,n=e.trim().split(/\s+/);if(!e.endsWith(" ")&&n.length>0){const o=n[n.length-1];for(let r=0;r<o.length;r++)V()}D(t+" "),C.value=(e.endsWith(" ")?e:n.length>1?n.slice(0,-1).join(" ")+" ":"")+t+" "}function qt(){v("heavy"),Le.value=Ct(C.value),f.value="roast"}function Kt(t){v("click");for(let e=0;e<C.value.length;e++)V();N.recordCommittedReply(t),D(t),C.value=t,f.value="qwerty"}function Vt(){return p`
    <div class="rizz-app" data-theme=${()=>U.value} data-one-handed=${()=>G.value} data-height=${()=>J.value}>
      ${St({activeContext:R,stealthMode:P,onOpenContextReplies:()=>{R.value&&Se(R.value)},onScanScreen:$e,onToggleStealth:Wt,onToggleRoast:()=>{f.value==="roast"?f.value="qwerty":qt()},onToggleClipboard:()=>f.value=f.value==="clipboard"?"qwerty":"clipboard",onToggleEmojis:()=>f.value=f.value==="emojis"?"qwerty":"emojis",onVoiceInput:()=>{v("click"),nt()},onSwitchKeyboard:()=>{v("click"),ot()},onToggleHelp:()=>f.value=f.value==="settings"?"qwerty":"settings",onToggleTalks:()=>f.value=f.value==="talks"?"qwerty":"talks"})}

      ${()=>P.value?$t({buffer:B,hint:X,showEnableScanner:F,onGenerate:xe,onEnableScanner:()=>Re("accessibility"),onCancel:()=>{P.value=!1,X.value=null,F.value=!1}}):""}

      ${xt({suggestions:Dt,onSelectSuggestion:Ht})}

      ${()=>{const t=f.value;return t==="nextmove"?Mt({resolution:L,onSelectReply:jt,onSwitchToStealth:()=>{var e;B.value=((e=L.value)==null?void 0:e.context.partnerText)??"",Q()},onClose:()=>f.value="qwerty"}):t==="emojis"?Nt({onSelectEmoji:Te,onClose:()=>f.value="qwerty"}):t==="clipboard"?_t({history:q,onSelectClip:e=>{N.recordCommittedReply(e),D(e),f.value="qwerty"},onAnalyzeClip:e=>{v("heavy"),Ft(e)},onDeleteClip:e=>{v("light"),q.value=q.value.filter(n=>n!==e)},onClearAll:()=>{v("click"),q.value=[]},onClose:()=>f.value="qwerty"}):t==="roast"?zt({roast:Le,onApplyUpgrade:Kt,onClose:()=>f.value="qwerty"}):t==="textedit"?Ot({onBackspace:Pe,onClose:()=>f.value="qwerty"}):t==="help"?Et({onClose:()=>f.value="qwerty"}):t==="talks"?Bt({onSelectLine:e=>{v("heavy"),D(e),f.value="qwerty"},onClose:()=>f.value="qwerty"}):t==="settings"?It({theme:U,oneHanded:G,height:J,numberRow:ne,onCycleTheme:()=>{v("click");const e=U.value==="slate"?"amoled":U.value==="amoled"?"light":"slate";U.value=e;try{localStorage.setItem("rizzboard_theme",e)}catch{}},onToggleOneHanded:()=>{v("click");const e=G.value==="off"?"right":G.value==="right"?"left":"off";G.value=e;try{localStorage.setItem("rizzboard_one_handed",e)}catch{}},onCycleHeight:()=>{v("click");const e=J.value==="normal"?"compact":J.value==="compact"?"tall":"normal";J.value=e;try{localStorage.setItem("rizzboard_height",e)}catch{}},onToggleNumberRow:()=>{v("click");const e=!ne.value;ne.value=e;try{localStorage.setItem("rizzboard_number_row",String(e))}catch{}},onOpenTextEdit:()=>f.value="textedit",onOpenHelp:()=>f.value="help",onClose:()=>f.value="qwerty"}):Pt({stealthMode:P,showNumberRow:ne,onKeyPress:Te,onBackspace:Pe,onSend:()=>{P.value?xe():(v("heavy"),tt())},onOpenEmojis:()=>f.value="emojis",onMoveCursor:e=>{v("light"),rt(e)},onDeleteWord:()=>{v("heavy");const e=C.value.match(/(\S+\s*)$/),n=e?e[1].length:1;C.value=C.value.slice(0,-n);for(let o=0;o<n;o++)V()},onSwipeUpSpace:()=>{v("click"),R.value?Se(R.value):$e()},onSwipeWord:e=>{const n=K.matchSwipePath(e,1);if(n.length>0){const o=n[0]+" ";C.value+=o,D(o),v("click")}}})}}
    </div>
  `}const Ae=document.getElementById("app");if(Ae){const{fragment:t}=he(Vt());Ae.appendChild(t)}
