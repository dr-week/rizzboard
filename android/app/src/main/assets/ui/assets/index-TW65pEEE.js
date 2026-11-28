var Oe=Object.defineProperty;var _e=(t,e,n)=>e in t?Oe(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var N=(t,e,n)=>_e(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();let te=null;const X=new Set;let Z=!1;function Se(){return te}function Y(t){const e=te;return te=t,e}function $e(t){t.isStale=!0,Z?X.add(t):t.execute()}function De(t){const e=Z;Z=!0;try{return t()}finally{Z=e,Z||Me()}}function Me(){for(;X.size>0;){const t=Array.from(X);X.clear();for(const e of t)e.isStale&&e.execute()}}class Le{constructor(e){N(this,"_value");N(this,"_subscribers",new Set);this._value=e}get value(){const e=Se();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}set value(e){Object.is(this._value,e)||(this._value=e,this.notify())}peek(){return this._value}notify(){const e=Array.from(this._subscribers);for(const n of e)$e(n)}_unsubscribe(e){this._subscribers.delete(e)}}function S(t){return new Le(t)}class je{constructor(e){N(this,"_value");N(this,"_node");N(this,"_subscribers",new Set);N(this,"_isDirty",!0);N(this,"_fn");this._fn=e,this._node={dependencies:new Set,isStale:!0,execute:()=>{if(!this._isDirty){this._isDirty=!0;const n=Array.from(this._subscribers);for(const o of n)$e(o)}}}}get value(){this._isDirty&&this._recompute();const e=Se();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}peek(){return this._isDirty&&this._recompute(),this._value}_unsubscribe(e){this._subscribers.delete(e)}_recompute(){for(const n of this._node.dependencies)n._unsubscribe(this._node);this._node.dependencies.clear();const e=Y(this._node);try{this._value=this._fn(),this._isDirty=!1,this._node.isStale=!1}finally{Y(e)}}}function xe(t){return new je(t)}let Ie=null;function We(){return Ie}function ne(t){let e;const n={dependencies:new Set,isStale:!1,execute:()=>{for(const i of n.dependencies)i._unsubscribe(n);if(n.dependencies.clear(),typeof e=="function")try{e()}catch(i){console.error("[Nova Signal Effect Cleanup Error]:",i)}const a=Y(n);try{e=t()}finally{Y(a),n.isStale=!1}}};n.execute();const o=()=>{for(const a of n.dependencies)a._unsubscribe(n);n.dependencies.clear(),typeof e=="function"&&e()},r=We();return r&&r.addCleanup(o),o}function Pe(){return typeof window<"u"&&"Part"in window&&"ChildNodePart"in window&&typeof window.getParts=="function"}class ce{constructor(e){N(this,"parentNode");N(this,"previousSibling");N(this,"nextSibling");N(this,"value");N(this,"_currentNode");const n=e.parentNode;if(!n)throw new Error("[Zuari DOM Parts]: Placeholder node must have a parent container.");this.parentNode=n,this.previousSibling=e.previousSibling,this.nextSibling=e.nextSibling;const o=document.createTextNode("");n.replaceChild(o,e),this._currentNode=o}setValue(e){if(this.value=e,e instanceof DocumentFragment){const n=document.createTextNode("");this.parentNode.replaceChild(n,this._currentNode),this.parentNode.insertBefore(e,n),this._currentNode=n;return}if(e instanceof Node){this._currentNode!==e&&(this.parentNode.replaceChild(e,this._currentNode),this._currentNode=e);return}if(this._currentNode instanceof Text)this._currentNode.data=String(e??"");else{const n=document.createTextNode(String(e??""));this.parentNode.replaceChild(n,this._currentNode),this._currentNode=n}}disconnect(){}}class ue{constructor(e,n){N(this,"element");N(this,"attributeName");N(this,"value");this.element=e,this.attributeName=n}setValue(e){this.value=e,e===!1||e===null||e===void 0?this.element.removeAttribute(this.attributeName):this.element.setAttribute(this.attributeName,String(e))}disconnect(){this.element.removeAttribute(this.attributeName)}}function Fe(t){if(Pe())try{const e=window.ChildNodePart;return new e(t)}catch{return new ce(t)}return new ce(t)}function ze(t,e){if(Pe())try{const n=window.AttributePart;return new n(t,e)}catch{return new ue(t,e)}return new ue(t,e)}function qe(t,e,n,o){const r=Ke(t,`<!--zuari-hole-${e}-->`);if(r){const g=Fe(r);if(de(n)){const c=ne(()=>g.setValue(fe(n)));o.push(()=>{var d;c(),(d=g.disconnect)==null||d.call(g)})}else g.setValue(n);return}const a=`data-zuari-attr-${e}`,i=He(t,a);if(!i)return;const{element:l,attrName:u}=i;if(u.startsWith("@")||u.startsWith("on")){const g=(u.startsWith("@")?u.slice(1):u.slice(2)).toLowerCase();if(l.removeAttribute(u),typeof n!="function")return;const c=n;l.addEventListener(g,c),o.push(()=>l.removeEventListener(g,c));return}const p=ze(l,u);if(de(n)){const g=ne(()=>p.setValue(fe(n)));o.push(()=>{var c;g(),(c=p.disconnect)==null||c.call(p)})}else p.setValue(n)}function de(t){return typeof t=="object"&&t!==null&&"value"in t||typeof t=="function"}function fe(t){return typeof t=="object"&&t!==null&&"value"in t?t.value:typeof t=="function"?t():t}function Ke(t,e){const n=document.createNodeIterator(t,NodeFilter.SHOW_COMMENT);let o=n.nextNode();for(;o;){if(`<!--${o.data}-->`===e)return o;o=n.nextNode()}return null}function He(t,e){const n=document.createNodeIterator(t,NodeFilter.SHOW_ELEMENT);let o=n.nextNode();for(;o;){for(const r of Array.from(o.attributes))if(r.value.includes(e))return{element:o,attrName:r.name};o=n.nextNode()}return null}const pe=new Map,Ze="<!--zuari-hole-",Ve="-->",Ue="data-zuari-attr-";function f(t,...e){return{strings:t,values:e}}function re(t,e){const{strings:n,values:o}=t,r=n.join("<!--?-->");let a=pe.get(r);a||(a=document.createElement("template"),a.innerHTML=n.reduce((p,g,c)=>{if(c>=o.length)return p+g;const s=/=["']?[^"'>]*$/.test(g)?`"${Ue}${c}"`:`${Ze}${c}${Ve}`;return p+g+s},""),pe.set(r,a));const i=a.content.cloneNode(!0),l=Array.from(i.childNodes),u=[];return o.forEach((p,g)=>qe(i,g,p,u)),{fragment:i,destroy(){u.forEach(p=>p()),l.forEach(p=>{var g;return(g=p.parentNode)==null?void 0:g.removeChild(p)})}}}const Ge={primary:"#006A6A",onPrimary:"#FFFFFF",primaryContainer:"#6FF7F6",onPrimaryContainer:"#002020",secondary:"#4A6363",onSecondary:"#FFFFFF",background:"#FAFDFD",onBackground:"#191C1C",surface:"#FAFDFD",onSurface:"#191C1C",surfaceVariant:"#DAE5E4",outline:"#6F7979"},Je={primary:"#4CDADA",onPrimary:"#003737",primaryContainer:"#004F4F",onPrimaryContainer:"#6FF7F6",secondary:"#B1CCCC",onSecondary:"#1C3534",background:"#191C1C",onBackground:"#E1E3E3",surface:"#191C1C",onSurface:"#E1E3E3",surfaceVariant:"#3F4948",outline:"#899392"};function Xe(t=!1){const e=S(t),n=S(t?{...Je}:{...Ge}),o=xe(()=>!!(typeof navigator<"u"&&/android/i.test(navigator.userAgent)||typeof window<"u"&&window.Android)),r=new Map;typeof window<"u"&&(window.__zuariKotlinDispatcher=(c,d)=>{const s=r.get(c);if(s)try{const h=JSON.parse(d);s(h)}catch{s(d)}});function a(c,...d){return new Promise((s,h)=>{if(typeof window<"u"&&window.Android){const T=window.Android;if(typeof T[c]=="function")try{const b=T[c](...d);try{s(JSON.parse(b))}catch{s(b)}return}catch(b){h(b);return}}s({success:!0,mock:!0,function:c,args:d})})}function i(c,d){return r.set(c,d),()=>{r.delete(c)}}function l(c){De(()=>{n.value={...n.value,...c}})}function u(c){const d=(c==null?void 0:c.packageName)??"com.zuari.ui.theme",s=(c==null?void 0:c.themeName)??"ZuariTheme",h={...n.value,...(c==null?void 0:c.colors)??{}};return`package ${d}

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Native Material 3 Dynamic Colors generated by Zuari (@zuari/kotlin)
val ZuariPrimary = Color(android.graphics.Color.parseColor("${h.primary}"))
val ZuariOnPrimary = Color(android.graphics.Color.parseColor("${h.onPrimary}"))
val ZuariPrimaryContainer = Color(android.graphics.Color.parseColor("${h.primaryContainer}"))
val ZuariOnPrimaryContainer = Color(android.graphics.Color.parseColor("${h.onPrimaryContainer}"))
val ZuariSecondary = Color(android.graphics.Color.parseColor("${h.secondary}"))
val ZuariOnSecondary = Color(android.graphics.Color.parseColor("${h.onSecondary}"))
val ZuariBackground = Color(android.graphics.Color.parseColor("${h.background}"))
val ZuariOnBackground = Color(android.graphics.Color.parseColor("${h.onBackground}"))
val ZuariSurface = Color(android.graphics.Color.parseColor("${h.surface}"))
val ZuariOnSurface = Color(android.graphics.Color.parseColor("${h.onSurface}"))
val ZuariSurfaceVariant = Color(android.graphics.Color.parseColor("${h.surfaceVariant}"))
val ZuariOutline = Color(android.graphics.Color.parseColor("${h.outline}"))

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
`}function p(c){const d=(c==null?void 0:c.themeName)??"Theme.Zuari.Native",s={...n.value,...(c==null?void 0:c.colors)??{}};return`<?xml version="1.0" encoding="utf-8"?>
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
`}function g(c){const d=c??(typeof document<"u"?document.documentElement:null);return d?ne(()=>{const s=n.value;d.style.setProperty("--md-sys-color-primary",s.primary),d.style.setProperty("--md-sys-color-on-primary",s.onPrimary),d.style.setProperty("--md-sys-color-primary-container",s.primaryContainer),d.style.setProperty("--md-sys-color-on-primary-container",s.onPrimaryContainer),d.style.setProperty("--md-sys-color-secondary",s.secondary),d.style.setProperty("--md-sys-color-on-secondary",s.onSecondary),d.style.setProperty("--md-sys-color-background",s.background),d.style.setProperty("--md-sys-color-on-background",s.onBackground),d.style.setProperty("--md-sys-color-surface",s.surface),d.style.setProperty("--md-sys-color-on-surface",s.onSurface),d.style.setProperty("--md-sys-color-surface-variant",s.surfaceVariant),d.style.setProperty("--md-sys-color-outline",s.outline)}):()=>{}}return{isAndroid:o,dynamicColors:n,isDarkTheme:e,callNativeFunction:a,registerNativeCallback:i,generateComposeThemeCode:u,generateXmlThemeCode:p,ingestDynamicPalette:l,applyToCssVariables:g}}const ee=Xe(!0);function O(){return typeof window<"u"&&window.Android?window.Android:null}function q(t){const e=O();e?e.commitText(t):console.log("[Dev Mock Commit]:",t)}function G(){const t=O();t?t.deleteBackward():console.log("[Dev Mock Delete]")}function Ye(){const t=O();t?t.sendEnter():console.log("[Dev Mock Enter]")}function k(t="click"){const e=O();e&&typeof e.triggerHaptic=="function"&&e.triggerHaptic(t)}function Qe(t){const e=O();if(e&&typeof e.requestScreenshotAnalysis=="function")try{const n=e.requestScreenshotAnalysis(t);return JSON.parse(n)}catch{return{status:"error",blocks:[]}}return{status:"ok",blocks:[{text:"Are you free for drinks this weekend?",x:48,y:420,width:320,screenWidth:1080}]}}function Te(){const t=O();if(t&&typeof t.requestScreenScan=="function")try{const e=t.requestScreenScan();return JSON.parse(e)}catch{return{status:"error",blocks:[]}}return{status:"ok",appPackage:"com.snapchat.android",blocks:[{text:"What is your biggest red flag?",x:52,y:460,width:300,screenWidth:1080}]}}function et(){const t=O();if(t&&typeof t.getActiveContext=="function")try{return JSON.parse(t.getActiveContext())}catch{return{status:"none"}}return{status:"none"}}function Ae(t){const e=O();e&&typeof e.openSystemSetting=="function"?e.openSystemSetting(t):console.log("[Dev Mock Open Setting]:",t)}function tt(){const t=O();t&&typeof t.startVoiceTyping=="function"?t.startVoiceTyping():console.log("[Dev Mock Voice Typing]")}function nt(){const t=O();t&&typeof t.showInputMethodPicker=="function"?t.showInputMethodPicker():console.log("[Dev Mock IME Picker]")}function ot(t){const e=O();e&&typeof e.moveCursor=="function"&&e.moveCursor(t)}function rt(t){const e=O();e&&typeof e.performEditAction=="function"&&e.performEditAction(t)}function at(t){const e=O();e&&typeof e.sendDpad=="function"&&e.sendDpad(t)}function he(t,e){return`You are an elite wingman who excels at playful, concise, charismatic banter.
Your task: Suggest 3 distinct next moves for a dating app conversation.
Strict rules:
1. MAX 12 words per line.
2. NO cheesy cliché compliments like "Hey cutie" or "You must be tired from running through my mind".
3. Use witty banter, slight teasing, or confident playful framing.
4. Output MUST be valid JSON array with keys: "vibe" (Smooth | Tease | Bold) and "line" (string).

Partner said: "${t}"
${e?`Context I said previously: "${e}"`:""}

Respond ONLY with the JSON array:`}function it(t){return`You are a charisma coach. Rewrite this bland text message into 3 sharper, confident, flirty versions.
Max 12 words each.
Bland text: "${t}"

Output ONLY a JSON array with objects: [{"vibe": "Smooth", "line": "..."}, {"vibe": "Tease", "line": "..."}, {"vibe": "Bold", "line": "..."}]`}const me={"com.snapchat.android":"Snapchat","org.telegram.messenger":"Telegram","org.thoughtcrime.securesms":"Signal","co.hinge.app":"Hinge","com.bumble.app":"Bumble","com.tinder":"Tinder","com.instagram.android":"Instagram","com.whatsapp":"WhatsApp","web.whatsapp.com":"WhatsApp Web","instagram.com":"Instagram DM","web.telegram.org":"Telegram Web","tinder.com":"Tinder Web","bumble.com":"Bumble Web","discord.com":"Discord","x.com":"X DM"};function Ne(t){if(!t)return;const e=t.replace(/^www\./i,"");if(me[e])return me[e];const n=e.split("."),o=n[n.length-1];if(!o||["android","app","messenger","com","org","io"].includes(o)){const r=n[n.length-2];return r?r.charAt(0).toUpperCase()+r.slice(1):void 0}return o.charAt(0).toUpperCase()+o.slice(1)}function st(t){const e=Ne(t.appPackage);switch(t.source){case"screenshot":return"📸 Screenshot";case"notification":return e?`🔔 ${e} Msg`:"🔔 Incoming Msg";case"clipboard":return"📋 Copied Bubble";case"accessibility":return e?`👁️ ${e} Scan`:"👁️ Screen Scan";case"selection":return"✨ Selected Text";case"dom":return e?`🌐 ${e} Chat`:"🌐 Web Chat";case"manual":return"💬 Stealth Context"}}function lt(t){const e=t.partnerText.length>26?`${t.partnerText.slice(0,26).trim()}…`:t.partnerText;switch(t.source){case"screenshot":return"📸 Screenshot Detected: Analyze Next Move";case"notification":{const n=Ne(t.appPackage);return n?`🔔 ${n}: "${e}" — Reply`:`🔔 New Msg: "${e}" — Reply`}case"clipboard":return`📋 Copied: "${e}" — Reply`;case"accessibility":case"dom":return`👁️ Scanned: "${e}" — Reply`;case"selection":return`✨ Selected: "${e}" — Reply`;case"manual":return"💬 Context Ready — View Replies"}}class ct{constructor(){this.recentSelfCommits=new Set}recordSelfCommit(e){const n=this.normalize(e);if(n&&(this.recentSelfCommits.add(n),this.recentSelfCommits.size>25)){const o=this.recentSelfCommits.values().next().value;o&&this.recentSelfCommits.delete(o)}}isIgnored(e,n){const o=e.trim();if(!o)return!0;if(n==="manual"||n==="selection")return!1;const r=this.normalize(o);return!!(this.recentSelfCommits.has(r)||/^https?:\/\/\S+$/i.test(o)||/^\d{4,8}$/.test(o))}normalize(e){return e.toLowerCase().replace(/\s+/g," ").trim()}}function ut(t){const e={rawBlocks:t.map(o=>o.text)};if(t.length===0)return e;const n=t.filter(o=>{const r=o.y<120,a=o.y>o.screenWidth*1.8;return!r&&!a});n.sort((o,r)=>o.y-r.y);for(let o=n.length-1;o>=0;o--){const r=n[o],a=r.x+r.width/2>r.screenWidth/2;if(!a&&!e.senderText?e.senderText=r.text:a&&!e.myLastText&&(e.myLastText=r.text),e.senderText&&e.myLastText)break}return e}const dt=[{id:"op-1",category:"opener",vibe:"playful",triggerKeywords:["travel","hiking","nature"],template:"Are you as adventurous as your profile says, or do you also get lost in grocery stores?"},{id:"op-2",category:"opener",vibe:"smooth",triggerKeywords:["smile","eyes","cute"],template:"I was going to wait two days to message you, but patience was never my strong suit."},{id:"op-3",category:"opener",vibe:"witty",triggerKeywords:["food","coffee","cooking"],template:"Important question: what is your most controversial culinary opinion?"},{id:"bt-1",category:"banter",vibe:"playful",triggerKeywords:["trouble","sarcasm","bad"],template:"Are you always this much trouble or did I catch you on a good day?"},{id:"bt-2",category:"banter",vibe:"witty",triggerKeywords:["challenge","bet","win"],template:"Careful, high expectations are my only weakness."},{id:"bt-3",category:"banter",vibe:"bold",triggerKeywords:["rules","late","fast"],template:"I would say you are five minutes away from being my favorite person."},{id:"wp-1",category:"wordplay",vibe:"witty",triggerKeywords:["smart","books","study","work"],template:"Are you an overdue library book? Because you have fine written all over you."},{id:"wp-2",category:"wordplay",vibe:"smooth",triggerKeywords:["music","song","playlist"],template:"If our conversation was a playlist, I would have it on repeat."},{id:"cl-1",category:"closer",vibe:"bold",triggerKeywords:["drinks","date","weekend","meet","free","tonight"],template:"Drinks this Thursday. You pick the spot, I will bring the conversation."},{id:"cl-2",category:"closer",vibe:"smooth",triggerKeywords:["coffee","tea","afternoon","sunday","morning"],template:"Let us see if you are as fun in person. Coffee tomorrow?"},{id:"rf-1",category:"banter",vibe:"playful",triggerKeywords:["red flag","toxic","flaw","worst"],template:"My biggest red flag is thinking I can win every staring contest."},{id:"sn-1",category:"banter",vibe:"bold",triggerKeywords:["snap","streak","vanish","secret","disappear"],template:"Disappearing messages just mean we have to make every line count."},{id:"wy-1",category:"banter",vibe:"witty",triggerKeywords:["wyd","doing","bored","up to","plans"],template:"Plotting my next move, and you just walked right into it."},{id:"pt-1",category:"opener",vibe:"playful",triggerKeywords:["dog","puppy","cat","pet","gym","workout"],template:"Be honest: am I competing with your pet for attention, or do I stand a chance?"}];function ft(t,e=3){const n=t.toLowerCase();if(!n.trim())return[];const o=dt.map(r=>{let a=0;for(const i of r.triggerKeywords)n.includes(i)&&(a+=2);return{entry:r,score:a}}).filter(r=>r.score>0);return o.sort((r,a)=>a.score-r.score),o.slice(0,e).map(r=>r.entry)}function pt(t){const e=new Set(["the","and","for","are","you","that","this","with","have","what","when","where","why","how","just","like","really","very","about","from","they","them","your","mine","been","were","was","will","would","could","should","going","doing","want","need","know","think","today","tonight","tomorrow","lol","haha","lmao","yeah","yep","nope","okay","hey","hii","hello"]),n=t.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(o=>o.length>=4&&!e.has(o));return n.length>0?n[n.length-1]:null}class ht{generateOfflineSuggestions(e,n){const o=e.trim(),r=o.toLowerCase(),a=ft(o,3),i={};for(const b of a)b.vibe==="smooth"&&!i.Smooth?i.Smooth=b.template:(b.vibe==="playful"||b.vibe==="witty")&&!i.Tease?i.Tease=b.template:b.vibe==="bold"&&!i.Bold&&(i.Bold=b.template);for(const b of a)!i.Smooth&&b.template!==i.Tease&&b.template!==i.Bold?i.Smooth=b.template:!i.Tease&&b.template!==i.Smooth&&b.template!==i.Bold?i.Tease=b.template:!i.Bold&&b.template!==i.Smooth&&b.template!==i.Tease&&(i.Bold=b.template);const l=pt(o),u=o.includes("?")||/^(what|why|how|where|when|who|are|do|did|would|can|wanna)\b/i.test(o),p=o.length>0&&o.split(/\s+/).length<=2&&!u,g=/^(hey|hi|hello|yo|sup|heyy+|hii+|gm|good morning)\b/i.test(r),c=/\b(sorry|my bad|apologize|late|missed)\b/i.test(r),d=/\b(cute|hot|pretty|handsome|smart|funny|sweet|love your|like your)\b/i.test(r);let s,h,T;return g?(s="Was literally just thinking about texting you—great timing.",h="Look who finally decided to grace my notifications.",T="Hey—skipping the small talk, how is your week looking?"):c?(s="All good, life happens. Just glad you are here now.",h="You owe me a coffee for the suspense, then we are even.",T="Apology accepted—make it up to me this weekend?"):d?(s="Careful, keep talking like that and I might actually blush.",h="Flattery will get you everywhere—what else you got?",T="Say that again in person over drinks."):u&&l?(s=`Honestly, ${l} is a whole story—I will tell you the good part.`,h=`Depends—are you asking about ${l} out of curiosity or research?`,T=`Better ${l} story in person. Are you free Thursday?`):u?(s="Careful, the honest answer might make you like me more.",h="I plead the fifth—unless you are buying the first round.",T="Better story in person. When are we hanging out?"):p?(s="A person of few words—good thing I speak fluent mystery.",h="Do not hurt your thumbs typing a whole novel over there.",T="Tell me what you are actually up to right now."):l?(s=`Okay, ${l} actually sounds like my kind of vibe.`,h=`Wait, you cannot just drop "${l}" and not elaborate.`,T=`We definitely need to talk more about ${l}—coffee this week?`):r.includes("haha")||r.includes("lol")||r.includes("lmao")?(s="Making you laugh this early is dangerous for both of us.",h="Glad I could entertain you—my rates go up after midnight.",T="Wait until you hear my actual voice—call later?"):(s="I was going to play it cool, but you made that impossible.",h="Are you always this much trouble or is today special?",T="Skip the small talk: what is your go-to spot for drinks?"),[{vibe:"Smooth",line:i.Smooth??s},{vibe:"Tease",line:i.Tease??h},{vibe:"Bold",line:i.Bold??T}]}async generateOnlineSuggestions(e,n){var i,l,u;const o=this.generateOfflineSuggestions(e,n);if(typeof fetch!="function")return o;const r=new AbortController,a=setTimeout(()=>r.abort(),4e3);try{const p=`${he(e,n)}
Return ONLY a JSON array of 3 objects: [{"vibe":"Smooth","line":"..."},{"vibe":"Tease","line":"..."},{"vibe":"Bold","line":"..."}]`,g=await fetch("https://text.pollinations.ai/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:"You are a concise, witty dating/chat assistant. Reply ONLY with valid JSON."},{role:"user",content:p}],model:"openai"}),signal:r.signal});if(clearTimeout(a),!g.ok)return o;const d=(await g.text()).match(/\[[\s\S]*\]/);if(!d)return o;const s=JSON.parse(d[0]);return!Array.isArray(s)||s.length<3?o:[{vibe:"Smooth",line:String(((i=s[0])==null?void 0:i.line)||o[0].line)},{vibe:"Tease",line:String(((l=s[1])==null?void 0:l.line)||o[1].line)},{vibe:"Bold",line:String(((u=s[2])==null?void 0:u.line)||o[2].line)}]}catch{return clearTimeout(a),o}}getPromptForChat(e,n){return he(e,n)}getPromptForRewrite(e){return it(e)}}class mt{constructor(){this.engine=new ht,this.filter=new ct,this.lastProcessedSignature=""}recordCommittedReply(e){this.filter.recordSelfCommit(e)}isIgnoredNoiseOrSelf(e,n){return this.filter.isIgnored(e,n)}ingestRawContext(e){var a,i;const n=e.text.replace(/\s+/g," ").trim();if(this.filter.isIgnored(n,e.source))return null;const o=`${e.source}:${e.appPackage??""}:${this.filter.normalize(n)}`;if(e.source!=="manual"&&e.source!=="selection"&&o===this.lastProcessedSignature)return null;this.lastProcessedSignature=o;const r=e.timestamp??Date.now();return{id:`${e.source}-${r}`,source:e.source,partnerText:n,myLastText:((a=e.myLastText)==null?void 0:a.trim())||void 0,senderName:((i=e.senderName)==null?void 0:i.trim())||void 0,appPackage:e.appPackage,uri:e.uri,timestamp:r}}ingestScreenBlocks(e,n,o){var i;if(!e||e.length===0)return null;const r=ut(e),a=r.senderText??r.rawBlocks.find(l=>!this.filter.isIgnored(l,n));return a?{id:`${n}-${(o==null?void 0:o.timestamp)??Date.now()}`,source:n,partnerText:a.trim(),myLastText:(i=r.myLastText)==null?void 0:i.trim(),appPackage:o==null?void 0:o.appPackage,uri:o==null?void 0:o.uri,timestamp:(o==null?void 0:o.timestamp)??Date.now()}:null}resolveSuggestions(e){const n=this.engine.generateOfflineSuggestions(e.partnerText,e.myLastText);return{context:e,suggestions:n}}}const ye={i:"I",im:"I'm",ive:"I've",ill:"I'll",id:"I'd",dont:"don't",cant:"can't",wont:"won't",didnt:"didn't",doesnt:"doesn't",isnt:"isn't",arent:"aren't",wasnt:"wasn't",werent:"weren't",havent:"haven't",hasnt:"hasn't",hadnt:"hadn't",wouldnt:"wouldn't",couldnt:"couldn't",shouldnt:"shouldn't",youre:"you're",youve:"you've",youll:"you'll",theyre:"they're",thats:"that's",whats:"what's",heres:"here's",theres:"there's",wheres:"where's",lets:"let's",teh:"the",hte:"the",adn:"and",nad:"and",taht:"that",waht:"what",whta:"what",hwat:"what",wiht:"with",wtih:"with",jsut:"just",jstu:"just",liek:"like",lke:"like",realy:"really",relly:"really",definately:"definitely",definetly:"definitely",seperate:"separate",recieve:"receive",occured:"occurred",untill:"until",tommorow:"tomorrow",tomorow:"tomorrow",tonite:"tonight",becuase:"because",beacuse:"because",freind:"friend",frend:"friend",prolly:"probably",probly:"probably",thx:"thanks",ty:"thank you",pls:"please",plz:"please",sry:"sorry",srry:"sorry",msg:"message",bday:"birthday",wknd:"weekend",tmrw:"tomorrow"};class yt{constructor(){this.root={children:new Map,isWord:!1,frequency:0},this.bigrams=new Map,this.dictionaryWords=new Set,this.personalWords=new Set,this.seedCommonVocabulary()}insert(e,n=1){let o=this.root;const r=e.toLowerCase();for(const a of r)o.children.has(a)||o.children.set(a,{children:new Map,isWord:!1,frequency:0}),o=o.children.get(a);o.isWord=!0,o.frequency+=n,this.dictionaryWords.add(r)}learnWord(e){const n=e.trim().replace(/[^a-zA-Z']/g,"");n.length<2||(this.insert(n,25),this.personalWords.add(n.toLowerCase()))}getPersonalDictionary(){return Array.from(this.personalWords).sort()}hasWord(e){return this.dictionaryWords.has(e.toLowerCase())}autocorrect(e){const n=e.trim();if(!n||n.length<1)return null;const o=n.toLowerCase();if(ye[o]){const i=ye[o];return n[0]===n[0].toUpperCase()&&i[0]!==i[0].toUpperCase()?i[0].toUpperCase()+i.slice(1):i}if(this.dictionaryWords.has(o)||o.length<3)return null;let r=null,a=0;for(const i of this.dictionaryWords)if(!(Math.abs(i.length-o.length)>1)&&this.levenshtein(o,i)===1){const l=this.getWordFrequency(i);l>a&&(a=l,r=i)}return r?n[0]===n[0].toUpperCase()?r[0].toUpperCase()+r.slice(1):r:null}getWordFrequency(e){let n=this.root;for(const o of e.toLowerCase()){const r=n.children.get(o);if(!r)return 0;n=r}return n.isWord?n.frequency:0}levenshtein(e,n){const o=e.length,r=n.length,a=Array.from({length:r+1},(i,l)=>l);for(let i=1;i<=o;i++){let l=a[0];a[0]=i;for(let u=1;u<=r;u++){const p=a[u];e[i-1]===n[u-1]?a[u]=l:a[u]=1+Math.min(l,a[u],a[u-1]),l=p}}return a[r]}addBigram(e,n){const o=e.toLowerCase(),r=n.toLowerCase();let a=this.bigrams.get(o);a||(a=[],this.bigrams.set(o,a));const i=a.find(l=>l.word===r);i?i.count++:a.push({word:r,count:1}),a.sort((l,u)=>u.count-l.count)}completePrefix(e,n=3){if(!e)return[];let o=this.root;const r=e.toLowerCase();for(const i of r){if(!o.children.has(i))return[];o=o.children.get(i)}const a=[];return this.collectWords(o,r,a),a.sort((i,l)=>l.frequency-i.frequency),a.slice(0,n).map(i=>i.word)}predictNextWord(e,n=3){if(!e)return["the","you","I"];const o=e.toLowerCase(),r=this.bigrams.get(o);return r&&r.length>0?r.slice(0,n).map(a=>a.word):["and","to","you"]}collectWords(e,n,o){e.isWord&&o.push({word:n,frequency:e.frequency});for(const[r,a]of e.children.entries())this.collectWords(a,n+r,o)}seedCommonVocabulary(){const e=[["the",200],["be",180],["to",180],["of",175],["and",175],["a",170],["in",165],["that",160],["have",155],["it",155],["for",150],["not",145],["on",145],["with",140],["he",135],["as",135],["you",190],["do",130],["at",130],["this",130],["but",125],["his",120],["by",120],["from",120],["they",120],["we",125],["say",115],["her",115],["she",115],["or",115],["an",115],["will",120],["my",130],["one",115],["all",115],["would",115],["there",115],["their",110],["what",140],["so",125],["up",110],["out",110],["if",115],["about",120],["who",110],["get",115],["which",105],["go",115],["me",125],["when",120],["make",110],["can",125],["like",130],["time",115],["no",115],["just",125],["him",105],["know",120],["take",105],["people",100],["into",100],["year",95],["your",130],["good",125],["some",105],["could",105],["them",105],["see",115],["other",100],["than",100],["then",105],["now",115],["look",105],["only",105],["come",105],["its",100],["over",100],["think",110],["also",100],["back",105],["after",100],["use",100],["two",95],["how",135],["our",105],["work",105],["first",100],["well",110],["way",105],["even",100],["new",100],["want",115],["because",105],["any",100],["these",95],["give",95],["day",105],["most",95],["us",100],["are",150],["was",130],["were",110],["been",105],["has",110],["had",110],["free",110],["tonight",105],["tomorrow",100],["weekend",110],["coffee",95],["drinks",95],["dinner",95],["lunch",90],["plans",95],["sounds",105],["love",120],["talking",90],["where",115],["why",110],["going",115],["great",115],["amazing",95],["awesome",95],["cool",100],["nice",105],["sorry",100],["thanks",105],["please",105],["maybe",95],["definitely",90],["probably",90],["actually",95],["really",115],["very",110],["morning",95],["night",105],["today",105],["soon",95],["later",95],["ready",90],["busy",90],["happy",95],["excited",90],["miss",95],["wait",95],["meet",95]];for(const[o,r]of e)this.insert(o,r);const n=[["how","are"],["how","is"],["how","was"],["are","you"],["are","we"],["are","they"],["you","free"],["you","doing"],["you","up"],["what","are"],["what","is"],["what","do"],["want","to"],["going","to"],["have","to"],["good","morning"],["good","night"],["good","idea"],["sounds","good"],["sounds","great"],["sounds","fun"],["see","you"],["talk","to"],["let","me"],["on","my"],["my","way"],["this","weekend"]];for(const[o,r]of n)this.addBigram(o,r)}}function gt(t){const e=t.trim(),n=e.toLowerCase();return e?/^(hey|hi|hello|sup|yo|wyd|what'?s up)$/i.test(e)?{score:2,verdict:"Dry",feedback:"Low effort opener. High ghosting probability (~90%).",improved:"Important question: what is your most controversial food opinion?"}:n.includes("how are you")||n.includes("how was your day")?{score:4,verdict:"Safe",feedback:"Polite but sounds like an HR interview.",improved:"Tell me your day was more exciting than grocery shopping."}:n.includes("cutie")||n.includes("beautiful")||n.includes("gorgeous")?{score:5,verdict:"Safe",feedback:"Compliment is sweet, but every other match says the exact same thing.",improved:"I was going to play it cool, but you made that impossible."}:n.includes("trouble")||n.includes("bet")||n.includes("drinks")||n.includes("coffee")?{score:9,verdict:"Smooth",feedback:"High energy, playful intrigue. Ready to send.",improved:e}:{score:7,verdict:"Smooth",feedback:"Solid message. Could use 10% more cheekiness.",improved:`${e} — unless you scare easily.`}:{score:1,verdict:"Dry",feedback:"Empty canvas. Drop something bold.",improved:"Are we breaking records or rules tonight?"}}const H=[{name:"Smileys & Rizz",icon:"😏",emojis:["😏","😉","😎","😜","😝","😛","🥳","🤩","😍","🥰","😘","😗","😙","😚","🤗","🤭","🤫","🫠","🫡","🤔","🤨","😐","😑","😶","🙄","😬","😌","😔","😪","😴","😂","🤣","😭","😅","😆","😁","😄","😃","😀","🙂","😈","👿","🫦","💅","👀","✨","🔥","💀","🤡","🥺"]},{name:"Love & Hearts",icon:"❤️",emojis:["❤️","❤️‍🔥","❤️‍🩹","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💖","💗","💓","💞","💕","💘","💝","💟","❣️","💔","💋","💌","💍","💎","🌹","🥀","💐","🌷","🌸","🥂","🍾","🍫","🍓","🍒","🫶","🫰","💑","👩‍❤️‍👨","💏"]},{name:"Gestures & Reactions",icon:"✌️",emojis:["👍","👎","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","☝️","✋","🤚","🖐️","🖖","👋","🤝","🙏","👏","🙌","👐","🤲","✊","👊","🤛","🤜","💪","🦾","🫶","🤦‍♂️","🤦‍♀️","🤷‍♂️","🤷‍♀️","💯","🎯"]},{name:"People & Vibes",icon:"🕺",emojis:["🕺","💃","👯","🧘","🏄","🚴","🏋️","🤸","🥷","🕵️","👑","🎩","🕶️","👓","🧣","👗","👔","👟","👠","👜","🧠","🫀","👁️","👅","👄","👂","👃","🫂","🗣️","👤"]},{name:"Food & Dates",icon:"☕",emojis:["☕","🍵","🧋","🥤","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🍾","🍕","🍔","🍟","🌭","🌮","🌯","🍣","🍜","🍝","🍛","🍱","🥟","🍤","🍦","🍨","🍩","🍪","🎂","🍰","🧁","🍫","🍿","🥐","🥯","🥞","🧇","🥓","🍳"]},{name:"Activities & Travel",icon:"✈️",emojis:["✈️","🚗","🏎️","🚕","🚌","🚆","🚀","🛸","⛵","🏖️","🏝️","🏔️","🏕️","🌅","🌄","🌃","🌆","🎡","🎢","🎬","🎤","🎧","🎼","🎹","🎸","🥁","🎮","🕹️","🎲","♟️","🎳","🎯","⚽","🏀","🏈","⚾","🎾","🏐","🏆","🥇"]},{name:"Symbols & Tech",icon:"⚡",emojis:["⚡","⭐","🌟","💫","✨","💥","💢","💦","💨","💤","💬","💭","🗯️","🔔","🔕","🔒","🔓","🔑","📱","💻","⌨️","📷","📸","🎥","📺","📻","⏰","⏳","💡","🔋","✅","❌","❓","❗","‼️","⁉️","⚠️","🚫","♻️","♾️"]}];function y(t){const{fragment:e}=re(t);if(e.childElementCount===1&&e.firstElementChild)return e.firstElementChild;const n=document.createElement("div");return n.style.display="contents",n.appendChild(e),n}function L(t,e){const n=document.createElement("div");n.className=t;for(const o of e){const{fragment:r}=re(o);n.appendChild(r)}return n}function vt(t){return y(f`
    <div class="action-bar">
      ${()=>t.activeContext.value?y(f`
            <button class="action-pill highlight" @click=${t.onOpenContextReplies}>
              ${lt(t.activeContext.value)}
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
      <button class="action-pill" @click=${t.onToggleHelp} title="Help & Gestures">
        ❓
      </button>
      <button class="action-pill" @click=${t.onSwitchKeyboard} title="Switch Keyboard">
        🌐
      </button>
    </div>
  `)}function bt(t){return y(f`
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
  `)}function wt(t){return y(f`
    <div class="suggestions-shell">
      ${()=>L("suggestions-panel",t.suggestions.value.map(e=>f`
          <div class="suggestion-card" @click=${()=>t.onSelectSuggestion(e)}>
            <span class="suggestion-text">${e}</span>
          </div>
        `))}
    </div>
  `)}const kt={q:"1",w:"2",e:"3",r:"4",t:"5",y:"6",u:"7",i:"8",o:"9",p:"0",a:"@",s:"#",d:"$",f:"%",g:"&",h:"-",j:"+",k:"(",l:")",z:"*",x:'"',c:"'",v:":",b:";",n:"!",m:"?"};function Ct(t){const e=S("off"),n=S("alpha"),o=["q","w","e","r","t","y","u","i","o","p"],r=["a","s","d","f","g","h","j","k","l"],a=["z","x","c","v","b","n","m"],i=["1","2","3","4","5","6","7","8","9","0"],l=["@","#","$","_","&","-","+","(",")","/"],u=["*",'"',"'",":",";","!","?"],p=["~","`","|","•","√","π","÷","×","§","Δ"],g=["£","€","¥","^","°","=","{","}","\\","©"],c=["%","®","™","✓","[","]","<",">"],d=w=>{const $=e.value!=="off"?w.toUpperCase():w;t.onKeyPress($),e.value==="once"&&(e.value="off")},s=()=>{e.value==="off"?e.value="once":e.value==="once"?e.value="caps":e.value="off"},h=(w,B)=>{const $=B?w.toUpperCase():w,C=kt[w]??"";let m=null,A=!1;const J=()=>{A=!1,C&&(m=setTimeout(()=>{A=!0,t.onKeyPress(C)},380))},j=()=>{m&&(clearTimeout(m),m=null)};return f`
      <button
        class="key-btn"
        @pointerdown=${J}
        @pointerup=${j}
        @pointerleave=${j}
        @pointercancel=${j}
        @click=${()=>{m&&(clearTimeout(m),m=null),A||d(w),A=!1}}>
        ${$}
      </button>
    `},T=()=>{let w=null,B=null,$=!1,C=0;const m=()=>{w&&(clearTimeout(w),w=null),B&&(clearInterval(B),B=null)};return f`
      <button
        class="key-btn special"
        @pointerdown=${K=>{C=K.clientX,$=!1,m(),w=setTimeout(()=>{$=!0,t.onBackspace(),B=setInterval(()=>{t.onBackspace()},55)},350)}}
        @pointermove=${K=>{var D;C-K.clientX>=28&&!$&&($=!0,m(),(D=t.onDeleteWord)==null||D.call(t))}}
        @pointerup=${m}
        @pointerleave=${m}
        @pointercancel=${m}
        @click=${()=>{m(),$||t.onBackspace(),$=!1}}>
        ⌫
      </button>
    `},b=()=>{let w=0,B=0,$=0,C=!1,m=!1;const A=D=>{w=D.clientX,B=D.clientY,$=D.clientX,C=!1,m=!0},J=D=>{var se;if(!m)return;if(B-D.clientY>=28&&!C){C=!0,m=!1,(se=t.onSwipeUpSpace)==null||se.call(t);return}if(!t.onMoveCursor)return;const ie=D.clientX-$;if(Math.abs(D.clientX-w)>10&&(C=!0),Math.abs(ie)>=18){const le=Math.trunc(ie/18);t.onMoveCursor(le),$+=le*18}},j=()=>{m=!1};return f`
      <button
        class="key-btn space"
        @pointerdown=${A}
        @pointermove=${J}
        @pointerup=${j}
        @pointercancel=${j}
        @click=${()=>{C||t.onKeyPress(" "),C=!1}}>
        ${()=>t.stealthMode.value?"stealth space":"space"}
      </button>
    `},Re=()=>{const w=e.value!=="off",B=e.value==="caps"?"⇪":e.value==="once"?"⬆":"⇧",$=e.value==="off"?"key-btn special":"key-btn special active-shift",C=document.createElement("div");C.className="keyboard-row",C.appendChild(y(f`<button class=${$} @click=${s}>${B}</button>`));for(const m of a)C.appendChild(y(h(m,w)));return C.appendChild(y(T())),y(f`
      <div class="keyboard-grid">
        ${L("keyboard-row",o.map(m=>h(m,w)))}
        ${L("keyboard-row",r.map(m=>h(m,w)))}
        ${C}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>n.value="numbers"}>123</button>
          <button class="key-btn special" @click=${t.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${()=>t.onKeyPress(",")}>,</button>
          ${y(b())}
          <button class="key-btn special" @click=${()=>t.onKeyPress(".")}>.</button>
          <button class="key-btn send" @click=${t.onSend}>
            ${()=>t.stealthMode.value?"Ask ⚡":"Send"}
          </button>
        </div>
      </div>
    `)},ae=w=>{const B=w?p:i,$=w?g:l,C=w?c:u,m=document.createElement("div");m.className="keyboard-row",m.appendChild(y(f`
        <button
          class="key-btn special"
          @click=${()=>n.value=w?"numbers":"symbols"}>
          ${w?"123":"=\\<"}
        </button>
      `));for(const A of C)m.appendChild(y(f`<button class="key-btn" @click=${()=>t.onKeyPress(A)}>${A}</button>`));return m.appendChild(y(T())),y(f`
      <div class="keyboard-grid">
        ${L("keyboard-row",B.map(A=>f`<button class="key-btn" @click=${()=>t.onKeyPress(A)}>${A}</button>`))}
        ${L("keyboard-row",$.map(A=>f`<button class="key-btn" @click=${()=>t.onKeyPress(A)}>${A}</button>`))}
        ${m}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>n.value="alpha"}>ABC</button>
          <button class="key-btn special" @click=${t.onOpenEmojis}>😏</button>
          <button class="key-btn special" @click=${()=>t.onKeyPress(",")}>,</button>
          ${y(b())}
          <button class="key-btn special" @click=${()=>t.onKeyPress(".")}>.</button>
          <button class="key-btn send" @click=${t.onSend}>
            ${()=>t.stealthMode.value?"Ask ⚡":"Send"}
          </button>
        </div>
      </div>
    `)};return y(f`
    <div class="keyboard-grid-wrapper">
      ${()=>n.value==="numbers"?ae(!1):n.value==="symbols"?ae(!0):Re()}
    </div>
  `)}const Ee="rizzboard_recent_emojis";function oe(){try{const t=localStorage.getItem(Ee);if(!t)return["😏","🔥","❤️","😂","✨","👀","💯","🥂"];const e=JSON.parse(t);return Array.isArray(e)&&e.length>0?e:["😏","🔥","❤️","😂"]}catch{return["😏","🔥","❤️","😂"]}}function St(t){try{const e=oe().filter(o=>o!==t),n=[t,...e].slice(0,16);localStorage.setItem(Ee,JSON.stringify(n))}catch{}}function $t(t){const e=S(0),n=S(""),o=S(oe()),r=i=>{St(i),o.value=oe(),t.onSelectEmoji(i)},a=document.createElement("div");return a.className="emoji-tabs",a.appendChild(y(f`
      <button
        class=${()=>e.value===0?"emoji-tab active":"emoji-tab"}
        @click=${()=>{n.value="",e.value=0}}>
        🕒
      </button>
    `)),H.forEach((i,l)=>{const u=l+1;a.appendChild(y(f`
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
      ${()=>{const i=n.value.trim().toLowerCase();let l;if(i){const u=H.filter(p=>p.name.toLowerCase().includes(i));l=u.length>0?u.flatMap(p=>p.emojis):H.flatMap(p=>p.emojis)}else e.value===0?l=o.value:l=(H[e.value-1]??H[0]).emojis;return L("emoji-grid",l.map(u=>f`
            <button class="emoji-btn" @click=${()=>r(u)}>${u}</button>
          `))}}
    </div>
  `)}function xt(t){const e=S([]),n=o=>{e.value.includes(o)?e.value=e.value.filter(r=>r!==o):e.value=[o,...e.value]};return y(f`
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
          `):L("clipboard-list",r.map(a=>{const i=o.includes(a);return f`
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
  `)}function Pt(t){return y(f`
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
  `)}function Tt(t){return y(f`
    <div class="nextmove-view">
      <div class="nextmove-header">
        <div class="nextmove-meta">
          <span class="source-chip">
            ${()=>t.resolution.value?st(t.resolution.value.context):"⚡ Next Move"}
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
          `):L("nextmove-cards",e.suggestions.map(n=>f`
            <div class="vibe-card" @click=${()=>t.onSelectReply(n.line)}>
              <span class="vibe-tag vibe-${n.vibe.toLowerCase()}">${n.vibe}</span>
              <span class="vibe-line">${n.line}</span>
            </div>
          `))}}
    </div>
  `)}function At(t){const e=o=>{k("click"),rt(o)},n=o=>{k("light"),at(o)};return y(f`
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
  `)}const Nt=[{icon:"✨",title:"Auto Chat Replies",desc:"Opens automatically when a chat is detected, or swipe up on Spacebar."},{icon:"🔢",title:"Long-Press Numbers & Symbols",desc:`Hold q–p for 1–0, or hold a–m for @ # $ % & - + ( ) * " ' : ; ! ?`},{icon:"⌫",title:"Swipe Left / Hold Backspace",desc:"Hold ⌫ to repeat-delete, or swipe left on ⌫ to delete a whole word."},{icon:"↔️",title:"Spacebar Cursor Scrub",desc:"Slide your finger left or right on Spacebar to move the cursor."},{icon:"🎙️",title:"Google Voice Typing",desc:"Tap Mic in the top bar for instant voice dictation."},{icon:"✂️",title:"Text Editing & D-Pad",desc:"Tap ✂️ for Select All, Copy, Cut, Paste, and arrow keys."},{icon:"📋",title:"Clipboard & Emoji Search",desc:"Pin/delete clips in 📋, or search 250+ emojis in 😏."}];function Et(t){return y(f`
    <div class="help-view" style="padding: 8px; max-height: 220px; overflow-y: auto;">
      <div class="clipboard-header" style="margin-bottom: 6px;">
        <span>RizzBoard Gestures & Guide</span>
        <div style="display:flex; gap:8px;">
          <button class="back-link" @click=${()=>Ae("setup")}>⚙ Setup</button>
          <button class="back-link" @click=${t.onClose}>ABC ✕</button>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${Nt.map(e=>f`
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
  `)}const Q=new yt,E=new mt,v=S("qwerty"),P=S(""),F=S(void 0),R=S(null),I=S(null),x=S(!1),_=S(""),V=S(null),W=S(!1),Be=S(null),z=S(["What is your biggest red flag?","Are we still on for coffee this weekend?"]),Bt=xe(()=>{const t=x.value?_.value:P.value;if(!t)return x.value?["asked","red","weekend"]:["how","are","you"];const e=t.trim().split(/\s+/),n=e[e.length-1];if(t.endsWith(" "))return Q.predictNextWord(n,3);{const o=Q.completePrefix(n,3);return o.length>0?o:[n]}});ee.registerNativeCallback("appContextChanged",t=>{if(t!=null&&t.packageName){F.value=t.packageName;try{const e=Te();if(e.status==="ok"&&e.blocks.length>0){const n=E.ingestScreenBlocks(e.blocks,"accessibility",{appPackage:e.appPackage??t.packageName});n&&(R.value=n)}}catch{}}});ee.registerNativeCallback("screenshotDetected",t=>{t!=null&&t.uri&&(R.value={id:`screenshot-${t.timestamp??Date.now()}`,source:"screenshot",partnerText:"Screenshot captured",uri:t.uri,appPackage:t.appPackage??F.value,timestamp:Date.now()},k("heavy"))});ee.registerNativeCallback("contextDetected",t=>{if(!(t!=null&&t.text)||!(t!=null&&t.source))return;const e=E.ingestRawContext({source:t.source,text:t.text,senderName:t.senderName,appPackage:t.appPackage??F.value,timestamp:t.timestamp});e&&(R.value=e,k("click"))});ee.registerNativeCallback("clipboardAdded",t=>{if(t!=null&&t.text){const e=String(t.text).trim();if(!e)return;z.value=[e,...z.value.filter(o=>o!==e).slice(0,9)];const n=E.ingestRawContext({source:"clipboard",text:e,appPackage:F.value});n&&(R.value=n)}});const M=et();if(M.status==="ok"&&M.text&&M.source){const t=E.ingestRawContext({source:M.source,text:M.text,senderName:M.senderName,appPackage:M.appPackage,timestamp:M.timestamp});t&&(R.value=t)}function ge(t){if(k("heavy"),t.source==="screenshot"&&t.uri){const e=Qe(t.uri),n=E.ingestScreenBlocks(e.blocks,"screenshot",{appPackage:e.appPackage??t.appPackage,uri:t.uri});if(!n){R.value=null,U("Screenshot looked blank/protected — type what they said:");return}I.value=E.resolveSuggestions(n),R.value=null,x.value=!1,v.value="nextmove";return}I.value=E.resolveSuggestions(t),R.value=null,x.value=!1,v.value="nextmove"}function ve(){k("click");const t=Te();if(t.status==="ok"&&t.blocks.length>0){const e=E.ingestScreenBlocks(t.blocks,"accessibility",{appPackage:t.appPackage??F.value});if(e){I.value=E.resolveSuggestions(e),x.value=!1,v.value="nextmove";return}}if(t.status==="not_enabled"){W.value=!0,U("Scanner off — type what they said, or tap Enable Scanner ⚙");return}W.value=!1,U("Screen protected (FLAG_SECURE) — type a quick summary here:")}function U(t){V.value=t??null,x.value=!0,v.value="qwerty"}function Rt(){k("click"),x.value?(x.value=!1,V.value=null,W.value=!1):(W.value=!1,U())}function be(){k("heavy");const t=_.value.trim(),e=E.ingestRawContext({source:"manual",text:t||"start playful conversation",appPackage:F.value});e&&(I.value=E.resolveSuggestions(e),x.value=!1,V.value=null,W.value=!1,v.value="nextmove")}function Ot(t){k("heavy"),E.recordCommittedReply(t),q(t),P.value=t,_.value="",v.value="qwerty"}function _t(t){const e=E.ingestRawContext({source:"manual",text:t,appPackage:F.value});e&&(e.source="clipboard",I.value=E.resolveSuggestions(e),v.value="nextmove")}function we(t){if(k("light"),x.value){_.value+=t;return}if(t===" "||t==="."||t===","||t==="!"||t==="?"){const e=P.value.match(/([a-zA-Z']+)$/);if(e){const n=e[1],o=Q.autocorrect(n);if(o&&o!==n){for(let r=0;r<n.length;r++)G();P.value=P.value.slice(0,-n.length)+o+t,q(o+t);return}else Q.learnWord(n)}}P.value+=t,q(t)}function ke(){if(k("light"),x.value){_.value.length>0&&(_.value=_.value.slice(0,-1));return}P.value.length>0&&(P.value=P.value.slice(0,-1)),G()}function Dt(t){if(k("click"),x.value){const o=_.value,r=o.trim().split(/\s+/),a=o.endsWith(" ")?o:r.length>1?r.slice(0,-1).join(" ")+" ":"";_.value=`${a}${t} `;return}const e=P.value,n=e.trim().split(/\s+/);if(!e.endsWith(" ")&&n.length>0){const o=n[n.length-1];for(let r=0;r<o.length;r++)G()}q(t+" "),P.value=(e.endsWith(" ")?e:n.length>1?n.slice(0,-1).join(" ")+" ":"")+t+" "}function Mt(){k("heavy"),Be.value=gt(P.value),v.value="roast"}function Lt(t){k("click");for(let e=0;e<P.value.length;e++)G();E.recordCommittedReply(t),q(t),P.value=t,v.value="qwerty"}function jt(){return f`
    <div class="rizz-app">
      ${vt({activeContext:R,stealthMode:x,onOpenContextReplies:()=>{R.value&&ge(R.value)},onScanScreen:ve,onToggleStealth:Rt,onToggleRoast:()=>{v.value==="roast"?v.value="qwerty":Mt()},onToggleClipboard:()=>v.value=v.value==="clipboard"?"qwerty":"clipboard",onToggleEmojis:()=>v.value=v.value==="emojis"?"qwerty":"emojis",onVoiceInput:()=>{k("click"),tt()},onSwitchKeyboard:()=>{k("click"),nt()},onToggleTextEdit:()=>v.value=v.value==="textedit"?"qwerty":"textedit",onToggleHelp:()=>v.value=v.value==="help"?"qwerty":"help"})}

      ${()=>x.value?bt({buffer:_,hint:V,showEnableScanner:W,onGenerate:be,onEnableScanner:()=>Ae("accessibility"),onCancel:()=>{x.value=!1,V.value=null,W.value=!1}}):""}

      ${wt({suggestions:Bt,onSelectSuggestion:Dt})}

      ${()=>{const t=v.value;return t==="nextmove"?Tt({resolution:I,onSelectReply:Ot,onSwitchToStealth:()=>{var e;_.value=((e=I.value)==null?void 0:e.context.partnerText)??"",U()},onClose:()=>v.value="qwerty"}):t==="emojis"?$t({onSelectEmoji:we,onClose:()=>v.value="qwerty"}):t==="clipboard"?xt({history:z,onSelectClip:e=>{E.recordCommittedReply(e),q(e),v.value="qwerty"},onAnalyzeClip:e=>{k("heavy"),_t(e)},onDeleteClip:e=>{k("light"),z.value=z.value.filter(n=>n!==e)},onClearAll:()=>{k("click"),z.value=[]},onClose:()=>v.value="qwerty"}):t==="roast"?Pt({roast:Be,onApplyUpgrade:Lt,onClose:()=>v.value="qwerty"}):t==="textedit"?At({onBackspace:ke,onClose:()=>v.value="qwerty"}):t==="help"?Et({onClose:()=>v.value="qwerty"}):Ct({stealthMode:x,onKeyPress:we,onBackspace:ke,onSend:()=>{x.value?be():(k("heavy"),Ye())},onOpenEmojis:()=>v.value="emojis",onMoveCursor:e=>{k("light"),ot(e)},onDeleteWord:()=>{k("heavy");const e=P.value.match(/(\S+\s*)$/),n=e?e[1].length:1;P.value=P.value.slice(0,-n);for(let o=0;o<n;o++)G()},onSwipeUpSpace:()=>{k("click"),R.value?ge(R.value):ve()}})}}
    </div>
  `}const Ce=document.getElementById("app");if(Ce){const{fragment:t}=re(jt());Ce.appendChild(t)}
