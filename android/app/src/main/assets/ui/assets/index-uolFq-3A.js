var ge=Object.defineProperty;var be=(t,e,r)=>e in t?ge(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var C=(t,e,r)=>be(t,typeof e!="symbol"?e+"":e,r);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(n){if(n.ep)return;n.ep=!0;const a=r(n);fetch(n.href,a)}})();let J=null;const q=new Set;let F=!1;function ue(){return J}function K(t){const e=J;return J=t,e}function de(t){t.isStale=!0,F?q.add(t):t.execute()}function ve(t){const e=F;F=!0;try{return t()}finally{F=e,F||we()}}function we(){for(;q.size>0;){const t=Array.from(q);q.clear();for(const e of t)e.isStale&&e.execute()}}class ke{constructor(e){C(this,"_value");C(this,"_subscribers",new Set);this._value=e}get value(){const e=ue();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}set value(e){Object.is(this._value,e)||(this._value=e,this.notify())}peek(){return this._value}notify(){const e=Array.from(this._subscribers);for(const r of e)de(r)}_unsubscribe(e){this._subscribers.delete(e)}}function x(t){return new ke(t)}class Ce{constructor(e){C(this,"_value");C(this,"_node");C(this,"_subscribers",new Set);C(this,"_isDirty",!0);C(this,"_fn");this._fn=e,this._node={dependencies:new Set,isStale:!0,execute:()=>{if(!this._isDirty){this._isDirty=!0;const r=Array.from(this._subscribers);for(const o of r)de(o)}}}}get value(){this._isDirty&&this._recompute();const e=ue();return e&&(this._subscribers.add(e),e.dependencies.add(this)),this._value}peek(){return this._isDirty&&this._recompute(),this._value}_unsubscribe(e){this._subscribers.delete(e)}_recompute(){for(const r of this._node.dependencies)r._unsubscribe(this._node);this._node.dependencies.clear();const e=K(this._node);try{this._value=this._fn(),this._isDirty=!1,this._node.isStale=!1}finally{K(e)}}}function he(t){return new Ce(t)}let Se=null;function $e(){return Se}function G(t){let e;const r={dependencies:new Set,isStale:!1,execute:()=>{for(const s of r.dependencies)s._unsubscribe(r);if(r.dependencies.clear(),typeof e=="function")try{e()}catch(s){console.error("[Nova Signal Effect Cleanup Error]:",s)}const a=K(r);try{e=t()}finally{K(a),r.isStale=!1}}};r.execute();const o=()=>{for(const a of r.dependencies)a._unsubscribe(r);r.dependencies.clear(),typeof e=="function"&&e()},n=$e();return n&&n.addCleanup(o),o}function me(){return typeof window<"u"&&"Part"in window&&"ChildNodePart"in window&&typeof window.getParts=="function"}class Q{constructor(e){C(this,"parentNode");C(this,"previousSibling");C(this,"nextSibling");C(this,"value");C(this,"_currentNode");const r=e.parentNode;if(!r)throw new Error("[Zuari DOM Parts]: Placeholder node must have a parent container.");this.parentNode=r,this.previousSibling=e.previousSibling,this.nextSibling=e.nextSibling;const o=document.createTextNode("");r.replaceChild(o,e),this._currentNode=o}setValue(e){if(this.value=e,e instanceof DocumentFragment){const r=document.createTextNode("");this.parentNode.replaceChild(r,this._currentNode),this.parentNode.insertBefore(e,r),this._currentNode=r;return}if(e instanceof Node){this._currentNode!==e&&(this.parentNode.replaceChild(e,this._currentNode),this._currentNode=e);return}if(this._currentNode instanceof Text)this._currentNode.data=String(e??"");else{const r=document.createTextNode(String(e??""));this.parentNode.replaceChild(r,this._currentNode),this._currentNode=r}}disconnect(){}}class ee{constructor(e,r){C(this,"element");C(this,"attributeName");C(this,"value");this.element=e,this.attributeName=r}setValue(e){this.value=e,e===!1||e===null||e===void 0?this.element.removeAttribute(this.attributeName):this.element.setAttribute(this.attributeName,String(e))}disconnect(){this.element.removeAttribute(this.attributeName)}}function xe(t){if(me())try{const e=window.ChildNodePart;return new e(t)}catch{return new Q(t)}return new Q(t)}function Pe(t,e){if(me())try{const r=window.AttributePart;return new r(t,e)}catch{return new ee(t,e)}return new ee(t,e)}function Te(t,e,r,o){const n=Ne(t,`<!--zuari-hole-${e}-->`);if(n){const p=xe(n);if(te(r)){const c=G(()=>p.setValue(re(r)));o.push(()=>{var u;c(),(u=p.disconnect)==null||u.call(p)})}else p.setValue(r);return}const a=`data-zuari-attr-${e}`,s=Ae(t,a);if(!s)return;const{element:l,attrName:h}=s;if(h.startsWith("@")||h.startsWith("on")){const p=(h.startsWith("@")?h.slice(1):h.slice(2)).toLowerCase();if(l.removeAttribute(h),typeof r!="function")return;const c=r;l.addEventListener(p,c),o.push(()=>l.removeEventListener(p,c));return}const y=Pe(l,h);if(te(r)){const p=G(()=>y.setValue(re(r)));o.push(()=>{var c;p(),(c=y.disconnect)==null||c.call(y)})}else y.setValue(r)}function te(t){return typeof t=="object"&&t!==null&&"value"in t||typeof t=="function"}function re(t){return typeof t=="object"&&t!==null&&"value"in t?t.value:typeof t=="function"?t():t}function Ne(t,e){const r=document.createNodeIterator(t,NodeFilter.SHOW_COMMENT);let o=r.nextNode();for(;o;){if(`<!--${o.data}-->`===e)return o;o=r.nextNode()}return null}function Ae(t,e){const r=document.createNodeIterator(t,NodeFilter.SHOW_ELEMENT);let o=r.nextNode();for(;o;){for(const n of Array.from(o.attributes))if(n.value.includes(e))return{element:o,attrName:n.name};o=r.nextNode()}return null}const oe=new Map,Ee="<!--zuari-hole-",Oe="-->",Re="data-zuari-attr-";function m(t,...e){return{strings:t,values:e}}function X(t,e){const{strings:r,values:o}=t,n=r.join("<!--?-->");let a=oe.get(n);a||(a=document.createElement("template"),a.innerHTML=r.reduce((y,p,c)=>{if(c>=o.length)return y+p;const i=/=["']?[^"'>]*$/.test(p)?`"${Re}${c}"`:`${Ee}${c}${Oe}`;return y+p+i},""),oe.set(n,a));const s=a.content.cloneNode(!0),l=Array.from(s.childNodes),h=[];return o.forEach((y,p)=>Te(s,p,y,h)),{fragment:s,destroy(){h.forEach(y=>y()),l.forEach(y=>{var p;return(p=y.parentNode)==null?void 0:p.removeChild(y)})}}}const Be={primary:"#006A6A",onPrimary:"#FFFFFF",primaryContainer:"#6FF7F6",onPrimaryContainer:"#002020",secondary:"#4A6363",onSecondary:"#FFFFFF",background:"#FAFDFD",onBackground:"#191C1C",surface:"#FAFDFD",onSurface:"#191C1C",surfaceVariant:"#DAE5E4",outline:"#6F7979"},_e={primary:"#4CDADA",onPrimary:"#003737",primaryContainer:"#004F4F",onPrimaryContainer:"#6FF7F6",secondary:"#B1CCCC",onSecondary:"#1C3534",background:"#191C1C",onBackground:"#E1E3E3",surface:"#191C1C",onSurface:"#E1E3E3",surfaceVariant:"#3F4948",outline:"#899392"};function Le(t=!1){const e=x(t),r=x(t?{..._e}:{...Be}),o=he(()=>!!(typeof navigator<"u"&&/android/i.test(navigator.userAgent)||typeof window<"u"&&window.Android)),n=new Map;typeof window<"u"&&(window.__zuariKotlinDispatcher=(c,u)=>{const i=n.get(c);if(i)try{const f=JSON.parse(u);i(f)}catch{i(u)}});function a(c,...u){return new Promise((i,f)=>{if(typeof window<"u"&&window.Android){const k=window.Android;if(typeof k[c]=="function")try{const d=k[c](...u);try{i(JSON.parse(d))}catch{i(d)}return}catch(d){f(d);return}}i({success:!0,mock:!0,function:c,args:u})})}function s(c,u){return n.set(c,u),()=>{n.delete(c)}}function l(c){ve(()=>{r.value={...r.value,...c}})}function h(c){const u=(c==null?void 0:c.packageName)??"com.zuari.ui.theme",i=(c==null?void 0:c.themeName)??"ZuariTheme",f={...r.value,...(c==null?void 0:c.colors)??{}};return`package ${u}

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
fun ${i}(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = ZuariColorScheme,
        typography = Typography(),
        content = content
    )
}
`}function y(c){const u=(c==null?void 0:c.themeName)??"Theme.Zuari.Native",i={...r.value,...(c==null?void 0:c.colors)??{}};return`<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by @zuari/kotlin Native Android Bridge -->
<resources>
    <style name="${u}" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="colorPrimary">${i.primary}</item>
        <item name="colorOnPrimary">${i.onPrimary}</item>
        <item name="colorPrimaryContainer">${i.primaryContainer}</item>
        <item name="colorOnPrimaryContainer">${i.onPrimaryContainer}</item>
        <item name="colorSecondary">${i.secondary}</item>
        <item name="colorOnSecondary">${i.onSecondary}</item>
        <item name="android:colorBackground">${i.background}</item>
        <item name="colorOnBackground">${i.onBackground}</item>
        <item name="colorSurface">${i.surface}</item>
        <item name="colorOnSurface">${i.onSurface}</item>
        <item name="colorSurfaceVariant">${i.surfaceVariant}</item>
        <item name="colorOutline">${i.outline}</item>
    </style>
</resources>
`}function p(c){const u=c??(typeof document<"u"?document.documentElement:null);return u?G(()=>{const i=r.value;u.style.setProperty("--md-sys-color-primary",i.primary),u.style.setProperty("--md-sys-color-on-primary",i.onPrimary),u.style.setProperty("--md-sys-color-primary-container",i.primaryContainer),u.style.setProperty("--md-sys-color-on-primary-container",i.onPrimaryContainer),u.style.setProperty("--md-sys-color-secondary",i.secondary),u.style.setProperty("--md-sys-color-on-secondary",i.onSecondary),u.style.setProperty("--md-sys-color-background",i.background),u.style.setProperty("--md-sys-color-on-background",i.onBackground),u.style.setProperty("--md-sys-color-surface",i.surface),u.style.setProperty("--md-sys-color-on-surface",i.onSurface),u.style.setProperty("--md-sys-color-surface-variant",i.surfaceVariant),u.style.setProperty("--md-sys-color-outline",i.outline)}):()=>{}}return{isAndroid:o,dynamicColors:r,isDarkTheme:e,callNativeFunction:a,registerNativeCallback:s,generateComposeThemeCode:h,generateXmlThemeCode:y,ingestDynamicPalette:l,applyToCssVariables:p}}const V=Le(!0);function E(){return typeof window<"u"&&window.Android?window.Android:null}function D(t){const e=E();e?e.commitText(t):console.log("[Dev Mock Commit]:",t)}function U(){const t=E();t?t.deleteBackward():console.log("[Dev Mock Delete]")}function Me(){const t=E();t?t.sendEnter():console.log("[Dev Mock Enter]")}function S(t="click"){const e=E();e&&typeof e.triggerHaptic=="function"&&e.triggerHaptic(t)}function De(t){const e=E();if(e&&typeof e.requestScreenshotAnalysis=="function")try{const r=e.requestScreenshotAnalysis(t);return JSON.parse(r)}catch{return{status:"error",blocks:[]}}return{status:"ok",blocks:[{text:"Are you free for drinks this weekend?",x:48,y:420,width:320,screenWidth:1080}]}}function fe(){const t=E();if(t&&typeof t.requestScreenScan=="function")try{const e=t.requestScreenScan();return JSON.parse(e)}catch{return{status:"error",blocks:[]}}return{status:"ok",appPackage:"com.snapchat.android",blocks:[{text:"What is your biggest red flag?",x:52,y:460,width:300,screenWidth:1080}]}}function We(){const t=E();if(t&&typeof t.getActiveContext=="function")try{return JSON.parse(t.getActiveContext())}catch{return{status:"none"}}return{status:"none"}}function Fe(t){const e=E();e&&typeof e.openSystemSetting=="function"?e.openSystemSetting(t):console.log("[Dev Mock Open Setting]:",t)}function Ie(){const t=E();t&&typeof t.startVoiceTyping=="function"?t.startVoiceTyping():console.log("[Dev Mock Voice Typing]")}function je(){const t=E();t&&typeof t.showInputMethodPicker=="function"?t.showInputMethodPicker():console.log("[Dev Mock IME Picker]")}function ne(t,e){return`You are an elite wingman who excels at playful, concise, charismatic banter.
Your task: Suggest 3 distinct next moves for a dating app conversation.
Strict rules:
1. MAX 12 words per line.
2. NO cheesy cliché compliments like "Hey cutie" or "You must be tired from running through my mind".
3. Use witty banter, slight teasing, or confident playful framing.
4. Output MUST be valid JSON array with keys: "vibe" (Smooth | Tease | Bold) and "line" (string).

Partner said: "${t}"
${e?`Context I said previously: "${e}"`:""}

Respond ONLY with the JSON array:`}function ze(t){return`You are a charisma coach. Rewrite this bland text message into 3 sharper, confident, flirty versions.
Max 12 words each.
Bland text: "${t}"

Output ONLY a JSON array with objects: [{"vibe": "Smooth", "line": "..."}, {"vibe": "Tease", "line": "..."}, {"vibe": "Bold", "line": "..."}]`}const ae={"com.snapchat.android":"Snapchat","org.telegram.messenger":"Telegram","org.thoughtcrime.securesms":"Signal","co.hinge.app":"Hinge","com.bumble.app":"Bumble","com.tinder":"Tinder","com.instagram.android":"Instagram","com.whatsapp":"WhatsApp","web.whatsapp.com":"WhatsApp Web","instagram.com":"Instagram DM","web.telegram.org":"Telegram Web","tinder.com":"Tinder Web","bumble.com":"Bumble Web","discord.com":"Discord","x.com":"X DM"};function pe(t){if(!t)return;const e=t.replace(/^www\./i,"");if(ae[e])return ae[e];const r=e.split("."),o=r[r.length-1];if(!o||["android","app","messenger","com","org","io"].includes(o)){const n=r[r.length-2];return n?n.charAt(0).toUpperCase()+n.slice(1):void 0}return o.charAt(0).toUpperCase()+o.slice(1)}function qe(t){const e=pe(t.appPackage);switch(t.source){case"screenshot":return"📸 Screenshot";case"notification":return e?`🔔 ${e} Msg`:"🔔 Incoming Msg";case"clipboard":return"📋 Copied Bubble";case"accessibility":return e?`👁️ ${e} Scan`:"👁️ Screen Scan";case"selection":return"✨ Selected Text";case"dom":return e?`🌐 ${e} Chat`:"🌐 Web Chat";case"manual":return"💬 Stealth Context"}}function Ke(t){const e=t.partnerText.length>26?`${t.partnerText.slice(0,26).trim()}…`:t.partnerText;switch(t.source){case"screenshot":return"📸 Screenshot Detected: Analyze Next Move";case"notification":{const r=pe(t.appPackage);return r?`🔔 ${r}: "${e}" — Reply`:`🔔 New Msg: "${e}" — Reply`}case"clipboard":return`📋 Copied: "${e}" — Reply`;case"accessibility":case"dom":return`👁️ Scanned: "${e}" — Reply`;case"selection":return`✨ Selected: "${e}" — Reply`;case"manual":return"💬 Context Ready — View Replies"}}class Ze{constructor(){this.recentSelfCommits=new Set}recordSelfCommit(e){const r=this.normalize(e);if(r&&(this.recentSelfCommits.add(r),this.recentSelfCommits.size>25)){const o=this.recentSelfCommits.values().next().value;o&&this.recentSelfCommits.delete(o)}}isIgnored(e,r){const o=e.trim();if(!o)return!0;if(r==="manual"||r==="selection")return!1;const n=this.normalize(o);return!!(this.recentSelfCommits.has(n)||/^https?:\/\/\S+$/i.test(o)||/^\d{4,8}$/.test(o))}normalize(e){return e.toLowerCase().replace(/\s+/g," ").trim()}}function Ve(t){const e={rawBlocks:t.map(o=>o.text)};if(t.length===0)return e;const r=t.filter(o=>{const n=o.y<120,a=o.y>o.screenWidth*1.8;return!n&&!a});r.sort((o,n)=>o.y-n.y);for(let o=r.length-1;o>=0;o--){const n=r[o],a=n.x+n.width/2>n.screenWidth/2;if(!a&&!e.senderText?e.senderText=n.text:a&&!e.myLastText&&(e.myLastText=n.text),e.senderText&&e.myLastText)break}return e}const Ue=[{id:"op-1",category:"opener",vibe:"playful",triggerKeywords:["travel","hiking","nature"],template:"Are you as adventurous as your profile says, or do you also get lost in grocery stores?"},{id:"op-2",category:"opener",vibe:"smooth",triggerKeywords:["smile","eyes","cute"],template:"I was going to wait two days to message you, but patience was never my strong suit."},{id:"op-3",category:"opener",vibe:"witty",triggerKeywords:["food","coffee","cooking"],template:"Important question: what is your most controversial culinary opinion?"},{id:"bt-1",category:"banter",vibe:"playful",triggerKeywords:["trouble","sarcasm","bad"],template:"Are you always this much trouble or did I catch you on a good day?"},{id:"bt-2",category:"banter",vibe:"witty",triggerKeywords:["challenge","bet","win"],template:"Careful, high expectations are my only weakness."},{id:"bt-3",category:"banter",vibe:"bold",triggerKeywords:["rules","late","fast"],template:"I would say you are five minutes away from being my favorite person."},{id:"wp-1",category:"wordplay",vibe:"witty",triggerKeywords:["smart","books","study","work"],template:"Are you an overdue library book? Because you have fine written all over you."},{id:"wp-2",category:"wordplay",vibe:"smooth",triggerKeywords:["music","song","playlist"],template:"If our conversation was a playlist, I would have it on repeat."},{id:"cl-1",category:"closer",vibe:"bold",triggerKeywords:["drinks","date","weekend","meet","free","tonight"],template:"Drinks this Thursday. You pick the spot, I will bring the conversation."},{id:"cl-2",category:"closer",vibe:"smooth",triggerKeywords:["coffee","tea","afternoon","sunday","morning"],template:"Let us see if you are as fun in person. Coffee tomorrow?"},{id:"rf-1",category:"banter",vibe:"playful",triggerKeywords:["red flag","toxic","flaw","worst"],template:"My biggest red flag is thinking I can win every staring contest."},{id:"sn-1",category:"banter",vibe:"bold",triggerKeywords:["snap","streak","vanish","secret","disappear"],template:"Disappearing messages just mean we have to make every line count."},{id:"wy-1",category:"banter",vibe:"witty",triggerKeywords:["wyd","doing","bored","up to","plans"],template:"Plotting my next move, and you just walked right into it."},{id:"pt-1",category:"opener",vibe:"playful",triggerKeywords:["dog","puppy","cat","pet","gym","workout"],template:"Be honest: am I competing with your pet for attention, or do I stand a chance?"}];function He(t,e=3){const r=t.toLowerCase();if(!r.trim())return[];const o=Ue.map(n=>{let a=0;for(const s of n.triggerKeywords)r.includes(s)&&(a+=2);return{entry:n,score:a}}).filter(n=>n.score>0);return o.sort((n,a)=>a.score-n.score),o.slice(0,e).map(n=>n.entry)}function Je(t){const e=new Set(["the","and","for","are","you","that","this","with","have","what","when","where","why","how","just","like","really","very","about","from","they","them","your","mine","been","were","was","will","would","could","should","going","doing","want","need","know","think","today","tonight","tomorrow","lol","haha","lmao","yeah","yep","nope","okay","hey","hii","hello"]),r=t.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(o=>o.length>=4&&!e.has(o));return r.length>0?r[r.length-1]:null}class Ge{generateOfflineSuggestions(e,r){const o=e.trim(),n=o.toLowerCase(),a=He(o,3),s={};for(const d of a)d.vibe==="smooth"&&!s.Smooth?s.Smooth=d.template:(d.vibe==="playful"||d.vibe==="witty")&&!s.Tease?s.Tease=d.template:d.vibe==="bold"&&!s.Bold&&(s.Bold=d.template);for(const d of a)!s.Smooth&&d.template!==s.Tease&&d.template!==s.Bold?s.Smooth=d.template:!s.Tease&&d.template!==s.Smooth&&d.template!==s.Bold?s.Tease=d.template:!s.Bold&&d.template!==s.Smooth&&d.template!==s.Tease&&(s.Bold=d.template);const l=Je(o),h=o.includes("?")||/^(what|why|how|where|when|who|are|do|did|would|can|wanna)\b/i.test(o),y=o.length>0&&o.split(/\s+/).length<=2&&!h,p=/^(hey|hi|hello|yo|sup|heyy+|hii+|gm|good morning)\b/i.test(n),c=/\b(sorry|my bad|apologize|late|missed)\b/i.test(n),u=/\b(cute|hot|pretty|handsome|smart|funny|sweet|love your|like your)\b/i.test(n);let i,f,k;return p?(i="Was literally just thinking about texting you—great timing.",f="Look who finally decided to grace my notifications.",k="Hey—skipping the small talk, how is your week looking?"):c?(i="All good, life happens. Just glad you are here now.",f="You owe me a coffee for the suspense, then we are even.",k="Apology accepted—make it up to me this weekend?"):u?(i="Careful, keep talking like that and I might actually blush.",f="Flattery will get you everywhere—what else you got?",k="Say that again in person over drinks."):h&&l?(i=`Honestly, ${l} is a whole story—I will tell you the good part.`,f=`Depends—are you asking about ${l} out of curiosity or research?`,k=`Better ${l} story in person. Are you free Thursday?`):h?(i="Careful, the honest answer might make you like me more.",f="I plead the fifth—unless you are buying the first round.",k="Better story in person. When are we hanging out?"):y?(i="A person of few words—good thing I speak fluent mystery.",f="Do not hurt your thumbs typing a whole novel over there.",k="Tell me what you are actually up to right now."):l?(i=`Okay, ${l} actually sounds like my kind of vibe.`,f=`Wait, you cannot just drop "${l}" and not elaborate.`,k=`We definitely need to talk more about ${l}—coffee this week?`):n.includes("haha")||n.includes("lol")||n.includes("lmao")?(i="Making you laugh this early is dangerous for both of us.",f="Glad I could entertain you—my rates go up after midnight.",k="Wait until you hear my actual voice—call later?"):(i="I was going to play it cool, but you made that impossible.",f="Are you always this much trouble or is today special?",k="Skip the small talk: what is your go-to spot for drinks?"),[{vibe:"Smooth",line:s.Smooth??i},{vibe:"Tease",line:s.Tease??f},{vibe:"Bold",line:s.Bold??k}]}async generateOnlineSuggestions(e,r){var s,l,h;const o=this.generateOfflineSuggestions(e,r);if(typeof fetch!="function")return o;const n=new AbortController,a=setTimeout(()=>n.abort(),4e3);try{const y=`${ne(e,r)}
Return ONLY a JSON array of 3 objects: [{"vibe":"Smooth","line":"..."},{"vibe":"Tease","line":"..."},{"vibe":"Bold","line":"..."}]`,p=await fetch("https://text.pollinations.ai/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:"You are a concise, witty dating/chat assistant. Reply ONLY with valid JSON."},{role:"user",content:y}],model:"openai"}),signal:n.signal});if(clearTimeout(a),!p.ok)return o;const u=(await p.text()).match(/\[[\s\S]*\]/);if(!u)return o;const i=JSON.parse(u[0]);return!Array.isArray(i)||i.length<3?o:[{vibe:"Smooth",line:String(((s=i[0])==null?void 0:s.line)||o[0].line)},{vibe:"Tease",line:String(((l=i[1])==null?void 0:l.line)||o[1].line)},{vibe:"Bold",line:String(((h=i[2])==null?void 0:h.line)||o[2].line)}]}catch{return clearTimeout(a),o}}getPromptForChat(e,r){return ne(e,r)}getPromptForRewrite(e){return ze(e)}}class Ye{constructor(){this.engine=new Ge,this.filter=new Ze,this.lastProcessedSignature=""}recordCommittedReply(e){this.filter.recordSelfCommit(e)}isIgnoredNoiseOrSelf(e,r){return this.filter.isIgnored(e,r)}ingestRawContext(e){var a,s;const r=e.text.replace(/\s+/g," ").trim();if(this.filter.isIgnored(r,e.source))return null;const o=`${e.source}:${e.appPackage??""}:${this.filter.normalize(r)}`;if(e.source!=="manual"&&e.source!=="selection"&&o===this.lastProcessedSignature)return null;this.lastProcessedSignature=o;const n=e.timestamp??Date.now();return{id:`${e.source}-${n}`,source:e.source,partnerText:r,myLastText:((a=e.myLastText)==null?void 0:a.trim())||void 0,senderName:((s=e.senderName)==null?void 0:s.trim())||void 0,appPackage:e.appPackage,uri:e.uri,timestamp:n}}ingestScreenBlocks(e,r,o){var s;if(!e||e.length===0)return null;const n=Ve(e),a=n.senderText??n.rawBlocks.find(l=>!this.filter.isIgnored(l,r));return a?{id:`${r}-${(o==null?void 0:o.timestamp)??Date.now()}`,source:r,partnerText:a.trim(),myLastText:(s=n.myLastText)==null?void 0:s.trim(),appPackage:o==null?void 0:o.appPackage,uri:o==null?void 0:o.uri,timestamp:(o==null?void 0:o.timestamp)??Date.now()}:null}resolveSuggestions(e){const r=this.engine.generateOfflineSuggestions(e.partnerText,e.myLastText);return{context:e,suggestions:r}}}const se={i:"I",im:"I'm",ive:"I've",ill:"I'll",id:"I'd",dont:"don't",cant:"can't",wont:"won't",didnt:"didn't",doesnt:"doesn't",isnt:"isn't",arent:"aren't",wasnt:"wasn't",werent:"weren't",havent:"haven't",hasnt:"hasn't",hadnt:"hadn't",wouldnt:"wouldn't",couldnt:"couldn't",shouldnt:"shouldn't",youre:"you're",youve:"you've",youll:"you'll",theyre:"they're",thats:"that's",whats:"what's",heres:"here's",theres:"there's",wheres:"where's",lets:"let's",teh:"the",hte:"the",adn:"and",nad:"and",taht:"that",waht:"what",whta:"what",hwat:"what",wiht:"with",wtih:"with",jsut:"just",jstu:"just",liek:"like",lke:"like",realy:"really",relly:"really",definately:"definitely",definetly:"definitely",seperate:"separate",recieve:"receive",occured:"occurred",untill:"until",tommorow:"tomorrow",tomorow:"tomorrow",tonite:"tonight",becuase:"because",beacuse:"because",freind:"friend",frend:"friend",prolly:"probably",probly:"probably",thx:"thanks",ty:"thank you",pls:"please",plz:"please",sry:"sorry",srry:"sorry",msg:"message",bday:"birthday",wknd:"weekend",tmrw:"tomorrow"};class Xe{constructor(){this.root={children:new Map,isWord:!1,frequency:0},this.bigrams=new Map,this.dictionaryWords=new Set,this.personalWords=new Set,this.seedCommonVocabulary()}insert(e,r=1){let o=this.root;const n=e.toLowerCase();for(const a of n)o.children.has(a)||o.children.set(a,{children:new Map,isWord:!1,frequency:0}),o=o.children.get(a);o.isWord=!0,o.frequency+=r,this.dictionaryWords.add(n)}learnWord(e){const r=e.trim().replace(/[^a-zA-Z']/g,"");r.length<2||(this.insert(r,25),this.personalWords.add(r.toLowerCase()))}getPersonalDictionary(){return Array.from(this.personalWords).sort()}hasWord(e){return this.dictionaryWords.has(e.toLowerCase())}autocorrect(e){const r=e.trim();if(!r||r.length<1)return null;const o=r.toLowerCase();if(se[o]){const s=se[o];return r[0]===r[0].toUpperCase()&&s[0]!==s[0].toUpperCase()?s[0].toUpperCase()+s.slice(1):s}if(this.dictionaryWords.has(o)||o.length<3)return null;let n=null,a=0;for(const s of this.dictionaryWords)if(!(Math.abs(s.length-o.length)>1)&&this.levenshtein(o,s)===1){const l=this.getWordFrequency(s);l>a&&(a=l,n=s)}return n?r[0]===r[0].toUpperCase()?n[0].toUpperCase()+n.slice(1):n:null}getWordFrequency(e){let r=this.root;for(const o of e.toLowerCase()){const n=r.children.get(o);if(!n)return 0;r=n}return r.isWord?r.frequency:0}levenshtein(e,r){const o=e.length,n=r.length,a=Array.from({length:n+1},(s,l)=>l);for(let s=1;s<=o;s++){let l=a[0];a[0]=s;for(let h=1;h<=n;h++){const y=a[h];e[s-1]===r[h-1]?a[h]=l:a[h]=1+Math.min(l,a[h],a[h-1]),l=y}}return a[n]}addBigram(e,r){const o=e.toLowerCase(),n=r.toLowerCase();let a=this.bigrams.get(o);a||(a=[],this.bigrams.set(o,a));const s=a.find(l=>l.word===n);s?s.count++:a.push({word:n,count:1}),a.sort((l,h)=>h.count-l.count)}completePrefix(e,r=3){if(!e)return[];let o=this.root;const n=e.toLowerCase();for(const s of n){if(!o.children.has(s))return[];o=o.children.get(s)}const a=[];return this.collectWords(o,n,a),a.sort((s,l)=>l.frequency-s.frequency),a.slice(0,r).map(s=>s.word)}predictNextWord(e,r=3){if(!e)return["the","you","I"];const o=e.toLowerCase(),n=this.bigrams.get(o);return n&&n.length>0?n.slice(0,r).map(a=>a.word):["and","to","you"]}collectWords(e,r,o){e.isWord&&o.push({word:r,frequency:e.frequency});for(const[n,a]of e.children.entries())this.collectWords(a,r+n,o)}seedCommonVocabulary(){const e=[["the",200],["be",180],["to",180],["of",175],["and",175],["a",170],["in",165],["that",160],["have",155],["it",155],["for",150],["not",145],["on",145],["with",140],["he",135],["as",135],["you",190],["do",130],["at",130],["this",130],["but",125],["his",120],["by",120],["from",120],["they",120],["we",125],["say",115],["her",115],["she",115],["or",115],["an",115],["will",120],["my",130],["one",115],["all",115],["would",115],["there",115],["their",110],["what",140],["so",125],["up",110],["out",110],["if",115],["about",120],["who",110],["get",115],["which",105],["go",115],["me",125],["when",120],["make",110],["can",125],["like",130],["time",115],["no",115],["just",125],["him",105],["know",120],["take",105],["people",100],["into",100],["year",95],["your",130],["good",125],["some",105],["could",105],["them",105],["see",115],["other",100],["than",100],["then",105],["now",115],["look",105],["only",105],["come",105],["its",100],["over",100],["think",110],["also",100],["back",105],["after",100],["use",100],["two",95],["how",135],["our",105],["work",105],["first",100],["well",110],["way",105],["even",100],["new",100],["want",115],["because",105],["any",100],["these",95],["give",95],["day",105],["most",95],["us",100],["are",150],["was",130],["were",110],["been",105],["has",110],["had",110],["free",110],["tonight",105],["tomorrow",100],["weekend",110],["coffee",95],["drinks",95],["dinner",95],["lunch",90],["plans",95],["sounds",105],["love",120],["talking",90],["where",115],["why",110],["going",115],["great",115],["amazing",95],["awesome",95],["cool",100],["nice",105],["sorry",100],["thanks",105],["please",105],["maybe",95],["definitely",90],["probably",90],["actually",95],["really",115],["very",110],["morning",95],["night",105],["today",105],["soon",95],["later",95],["ready",90],["busy",90],["happy",95],["excited",90],["miss",95],["wait",95],["meet",95]];for(const[o,n]of e)this.insert(o,n);const r=[["how","are"],["how","is"],["how","was"],["are","you"],["are","we"],["are","they"],["you","free"],["you","doing"],["you","up"],["what","are"],["what","is"],["what","do"],["want","to"],["going","to"],["have","to"],["good","morning"],["good","night"],["good","idea"],["sounds","good"],["sounds","great"],["sounds","fun"],["see","you"],["talk","to"],["let","me"],["on","my"],["my","way"],["this","weekend"]];for(const[o,n]of r)this.addBigram(o,n)}}function Qe(t){const e=t.trim(),r=e.toLowerCase();return e?/^(hey|hi|hello|sup|yo|wyd|what'?s up)$/i.test(e)?{score:2,verdict:"Dry",feedback:"Low effort opener. High ghosting probability (~90%).",improved:"Important question: what is your most controversial food opinion?"}:r.includes("how are you")||r.includes("how was your day")?{score:4,verdict:"Safe",feedback:"Polite but sounds like an HR interview.",improved:"Tell me your day was more exciting than grocery shopping."}:r.includes("cutie")||r.includes("beautiful")||r.includes("gorgeous")?{score:5,verdict:"Safe",feedback:"Compliment is sweet, but every other match says the exact same thing.",improved:"I was going to play it cool, but you made that impossible."}:r.includes("trouble")||r.includes("bet")||r.includes("drinks")||r.includes("coffee")?{score:9,verdict:"Smooth",feedback:"High energy, playful intrigue. Ready to send.",improved:e}:{score:7,verdict:"Smooth",feedback:"Solid message. Could use 10% more cheekiness.",improved:`${e} — unless you scare easily.`}:{score:1,verdict:"Dry",feedback:"Empty canvas. Drop something bold.",improved:"Are we breaking records or rules tonight?"}}const H=[{name:"Smileys & Rizz",icon:"😏",emojis:["😏","😉","😎","😜","😝","😛","🥳","🤩","😍","🥰","😘","😗","😙","😚","🤗","🤭","🤫","🫠","🫡","🤔","🤨","😐","😑","😶","🙄","😬","😌","😔","😪","😴","😂","🤣","😭","😅","😆","😁","😄","😃","😀","🙂","😈","👿","🫦","💅","👀","✨","🔥","💀","🤡","🥺"]},{name:"Love & Hearts",icon:"❤️",emojis:["❤️","❤️‍🔥","❤️‍🩹","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💖","💗","💓","💞","💕","💘","💝","💟","❣️","💔","💋","💌","💍","💎","🌹","🥀","💐","🌷","🌸","🥂","🍾","🍫","🍓","🍒","🫶","🫰","💑","👩‍❤️‍👨","💏"]},{name:"Gestures & Reactions",icon:"✌️",emojis:["👍","👎","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","☝️","✋","🤚","🖐️","🖖","👋","🤝","🙏","👏","🙌","👐","🤲","✊","👊","🤛","🤜","💪","🦾","🫶","🤦‍♂️","🤦‍♀️","🤷‍♂️","🤷‍♀️","💯","🎯"]},{name:"People & Vibes",icon:"🕺",emojis:["🕺","💃","👯","🧘","🏄","🚴","🏋️","🤸","🥷","🕵️","👑","🎩","🕶️","👓","🧣","👗","👔","👟","👠","👜","🧠","🫀","👁️","👅","👄","👂","👃","🫂","🗣️","👤"]},{name:"Food & Dates",icon:"☕",emojis:["☕","🍵","🧋","🥤","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🍾","🍕","🍔","🍟","🌭","🌮","🌯","🍣","🍜","🍝","🍛","🍱","🥟","🍤","🍦","🍨","🍩","🍪","🎂","🍰","🧁","🍫","🍿","🥐","🥯","🥞","🧇","🥓","🍳"]},{name:"Activities & Travel",icon:"✈️",emojis:["✈️","🚗","🏎️","🚕","🚌","🚆","🚀","🛸","⛵","🏖️","🏝️","🏔️","🏕️","🌅","🌄","🌃","🌆","🎡","🎢","🎬","🎤","🎧","🎼","🎹","🎸","🥁","🎮","🕹️","🎲","♟️","🎳","🎯","⚽","🏀","🏈","⚾","🎾","🏐","🏆","🥇"]},{name:"Symbols & Tech",icon:"⚡",emojis:["⚡","⭐","🌟","💫","✨","💥","💢","💦","💨","💤","💬","💭","🗯️","🔔","🔕","🔒","🔓","🔑","📱","💻","⌨️","📷","📸","🎥","📺","📻","⏰","⏳","💡","🔋","✅","❌","❓","❗","‼️","⁉️","⚠️","🚫","♻️","♾️"]}];function b(t){const{fragment:e}=X(t);if(e.childElementCount===1&&e.firstElementChild)return e.firstElementChild;const r=document.createElement("div");return r.style.display="contents",r.appendChild(e),r}function R(t,e){const r=document.createElement("div");r.className=t;for(const o of e){const{fragment:n}=X(o);r.appendChild(n)}return r}function et(t){return b(m`
    <div class="action-bar">
      ${()=>t.activeContext.value?b(m`
            <button class="action-pill highlight" @click=${t.onOpenContextReplies}>
              ${Ke(t.activeContext.value)}
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
  `)}function tt(t){return b(m`
    <div class="stealth-bar">
      <div class="stealth-top">
        <span class="stealth-badge">🛡️ STEALTH MODE · Hidden from chat</span>
        <div class="stealth-actions">
          ${()=>t.showEnableScanner.value?b(m`
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
  `)}function rt(t){return b(m`
    <div class="suggestions-shell">
      ${()=>R("suggestions-panel",t.suggestions.value.map(e=>m`
          <div class="suggestion-card" @click=${()=>t.onSelectSuggestion(e)}>
            <span class="suggestion-text">${e}</span>
          </div>
        `))}
    </div>
  `)}function ot(t){const e=x("off"),r=x("alpha"),o=["q","w","e","r","t","y","u","i","o","p"],n=["a","s","d","f","g","h","j","k","l"],a=["z","x","c","v","b","n","m"],s=["1","2","3","4","5","6","7","8","9","0"],l=["@","#","$","_","&","-","+","(",")","/"],h=["*",'"',"'",":",";","!","?"],y=["~","`","|","•","√","π","÷","×","§","Δ"],p=["£","€","¥","^","°","=","{","}","\\","©"],c=["%","®","™","✓","[","]","<",">"],u=d=>{const W=e.value!=="off"?d.toUpperCase():d;t.onKeyPress(W),e.value==="once"&&(e.value="off")},i=()=>{e.value==="off"?e.value="once":e.value==="once"?e.value="caps":e.value="off"},f=()=>{const d=e.value!=="off",z=e.value==="caps"?"⇪":e.value==="once"?"⬆":"⇧",W=e.value==="off"?"key-btn special":"key-btn special active-shift",B=document.createElement("div");B.className="keyboard-row",B.appendChild(b(m`<button class=${W} @click=${i}>${z}</button>`));for(const v of a){const P=d?v.toUpperCase():v;B.appendChild(b(m`<button class="key-btn" @click=${()=>u(v)}>${P}</button>`))}return B.appendChild(b(m`<button class="key-btn special" @click=${t.onBackspace}>⌫</button>`)),b(m`
      <div class="keyboard-grid">
        ${R("keyboard-row",o.map(v=>{const P=d?v.toUpperCase():v;return m`<button class="key-btn" @click=${()=>u(v)}>${P}</button>`}))}
        ${R("keyboard-row",n.map(v=>{const P=d?v.toUpperCase():v;return m`<button class="key-btn" @click=${()=>u(v)}>${P}</button>`}))}
        ${B}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>r.value="numbers"}>123</button>
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
    `)},k=d=>{const z=d?y:s,W=d?p:l,B=d?c:h,v=document.createElement("div");v.className="keyboard-row",v.appendChild(b(m`
        <button
          class="key-btn special"
          @click=${()=>r.value=d?"numbers":"symbols"}>
          ${d?"123":"=\\<"}
        </button>
      `));for(const P of B)v.appendChild(b(m`<button class="key-btn" @click=${()=>t.onKeyPress(P)}>${P}</button>`));return v.appendChild(b(m`<button class="key-btn special" @click=${t.onBackspace}>⌫</button>`)),b(m`
      <div class="keyboard-grid">
        ${R("keyboard-row",z.map(P=>m`<button class="key-btn" @click=${()=>t.onKeyPress(P)}>${P}</button>`))}
        ${R("keyboard-row",W.map(P=>m`<button class="key-btn" @click=${()=>t.onKeyPress(P)}>${P}</button>`))}
        ${v}
        <div class="keyboard-row">
          <button class="key-btn special" @click=${()=>r.value="alpha"}>ABC</button>
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
    `)};return b(m`
    <div class="keyboard-grid-wrapper">
      ${()=>r.value==="numbers"?k(!1):r.value==="symbols"?k(!0):f()}
    </div>
  `)}function nt(t){const e=x(0),r=document.createElement("div");return r.className="emoji-tabs",H.forEach((o,n)=>{r.appendChild(b(m`
        <button
          class=${()=>n===e.value?"emoji-tab active":"emoji-tab"}
          @click=${()=>e.value=n}>
          ${o.icon}
        </button>
      `))}),r.appendChild(b(m`<button class="emoji-tab back-key" @click=${t.onClose}>ABC</button>`)),b(m`
    <div class="emoji-view">
      ${r}
      ${()=>{const o=H[e.value]??H[0];return R("emoji-grid",o.emojis.map(n=>m`
            <button class="emoji-btn" @click=${()=>t.onSelectEmoji(n)}>${n}</button>
          `))}}
    </div>
  `)}function at(t){return b(m`
    <div class="clipboard-view">
      <div class="clipboard-header">
        <span>Copied Bubbles — Tap to Paste or ⚡ Reply</span>
        <button class="back-link" @click=${t.onClose}>Close ✕</button>
      </div>
      ${()=>R("clipboard-list",t.history.value.map(e=>m`
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
  `)}function st(t){return b(m`
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
  `)}function it(t){return b(m`
    <div class="nextmove-view">
      <div class="nextmove-header">
        <div class="nextmove-meta">
          <span class="source-chip">
            ${()=>t.resolution.value?qe(t.resolution.value.context):"⚡ Next Move"}
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

      ${()=>{const e=t.resolution.value;return!e||e.suggestions.length===0?b(m`
            <div class="roast-feedback">Tap "Tell Rizz" or "Scan Screen" to load chat context.</div>
          `):R("nextmove-cards",e.suggestions.map(r=>m`
            <div class="vibe-card" @click=${()=>t.onSelectReply(r.line)}>
              <span class="vibe-tag vibe-${r.vibe.toLowerCase()}">${r.vibe}</span>
              <span class="vibe-line">${r.line}</span>
            </div>
          `))}}
    </div>
  `)}const Z=new Xe,$=new Ye,g=x("qwerty"),T=x(""),M=x(void 0),N=x(null),_=x(null),w=x(!1),A=x(""),I=x(null),L=x(!1),ye=x(null),Y=x(["What is your biggest red flag?","Are we still on for coffee this weekend?"]),ct=he(()=>{const t=w.value?A.value:T.value;if(!t)return w.value?["asked","red","weekend"]:["how","are","you"];const e=t.trim().split(/\s+/),r=e[e.length-1];if(t.endsWith(" "))return Z.predictNextWord(r,3);{const o=Z.completePrefix(r,3);return o.length>0?o:[r]}});V.registerNativeCallback("appContextChanged",t=>{if(t!=null&&t.packageName){M.value=t.packageName;try{const e=fe();if(e.status==="ok"&&e.blocks.length>0){const r=$.ingestScreenBlocks(e.blocks,"accessibility",{appPackage:e.appPackage??t.packageName});r&&(N.value=r)}}catch{}}});V.registerNativeCallback("screenshotDetected",t=>{t!=null&&t.uri&&(N.value={id:`screenshot-${t.timestamp??Date.now()}`,source:"screenshot",partnerText:"Screenshot captured",uri:t.uri,appPackage:t.appPackage??M.value,timestamp:Date.now()},S("heavy"))});V.registerNativeCallback("contextDetected",t=>{if(!(t!=null&&t.text)||!(t!=null&&t.source))return;const e=$.ingestRawContext({source:t.source,text:t.text,senderName:t.senderName,appPackage:t.appPackage??M.value,timestamp:t.timestamp});e&&(N.value=e,S("click"))});V.registerNativeCallback("clipboardAdded",t=>{if(t!=null&&t.text){const e=String(t.text).trim();if(!e)return;Y.value=[e,...Y.value.filter(o=>o!==e).slice(0,9)];const r=$.ingestRawContext({source:"clipboard",text:e,appPackage:M.value});r&&(N.value=r)}});const O=We();if(O.status==="ok"&&O.text&&O.source){const t=$.ingestRawContext({source:O.source,text:O.text,senderName:O.senderName,appPackage:O.appPackage,timestamp:O.timestamp});t&&(N.value=t)}function lt(t){if(S("heavy"),t.source==="screenshot"&&t.uri){const e=De(t.uri),r=$.ingestScreenBlocks(e.blocks,"screenshot",{appPackage:e.appPackage??t.appPackage,uri:t.uri});if(!r){N.value=null,j("Screenshot looked blank/protected — type what they said:");return}_.value=$.resolveSuggestions(r),N.value=null,w.value=!1,g.value="nextmove";return}_.value=$.resolveSuggestions(t),N.value=null,w.value=!1,g.value="nextmove"}function ut(){S("click");const t=fe();if(t.status==="ok"&&t.blocks.length>0){const e=$.ingestScreenBlocks(t.blocks,"accessibility",{appPackage:t.appPackage??M.value});if(e){_.value=$.resolveSuggestions(e),w.value=!1,g.value="nextmove";return}}if(t.status==="not_enabled"){L.value=!0,j("Scanner off — type what they said, or tap Enable Scanner ⚙");return}L.value=!1,j("Screen protected (FLAG_SECURE) — type a quick summary here:")}function j(t){I.value=t??null,w.value=!0,g.value="qwerty"}function dt(){S("click"),w.value?(w.value=!1,I.value=null,L.value=!1):(L.value=!1,j())}function ie(){S("heavy");const t=A.value.trim(),e=$.ingestRawContext({source:"manual",text:t||"start playful conversation",appPackage:M.value});e&&(_.value=$.resolveSuggestions(e),w.value=!1,I.value=null,L.value=!1,g.value="nextmove")}function ht(t){S("heavy"),$.recordCommittedReply(t),D(t),T.value=t,A.value="",g.value="qwerty"}function mt(t){const e=$.ingestRawContext({source:"manual",text:t,appPackage:M.value});e&&(e.source="clipboard",_.value=$.resolveSuggestions(e),g.value="nextmove")}function ce(t){if(S("light"),w.value){A.value+=t;return}if(t===" "||t==="."||t===","||t==="!"||t==="?"){const e=T.value.match(/([a-zA-Z']+)$/);if(e){const r=e[1],o=Z.autocorrect(r);if(o&&o!==r){for(let n=0;n<r.length;n++)U();T.value=T.value.slice(0,-r.length)+o+t,D(o+t);return}else Z.learnWord(r)}}T.value+=t,D(t)}function ft(){if(S("light"),w.value){A.value.length>0&&(A.value=A.value.slice(0,-1));return}T.value.length>0&&(T.value=T.value.slice(0,-1)),U()}function pt(t){if(S("click"),w.value){const o=A.value,n=o.trim().split(/\s+/),a=o.endsWith(" ")?o:n.length>1?n.slice(0,-1).join(" ")+" ":"";A.value=`${a}${t} `;return}const e=T.value,r=e.trim().split(/\s+/);if(!e.endsWith(" ")&&r.length>0){const o=r[r.length-1];for(let n=0;n<o.length;n++)U()}D(t+" "),T.value=(e.endsWith(" ")?e:r.length>1?r.slice(0,-1).join(" ")+" ":"")+t+" "}function yt(){S("heavy"),ye.value=Qe(T.value),g.value="roast"}function gt(t){S("click");for(let e=0;e<T.value.length;e++)U();$.recordCommittedReply(t),D(t),T.value=t,g.value="qwerty"}function bt(){return m`
    <div class="rizz-app">
      ${et({activeContext:N,stealthMode:w,onOpenContextReplies:()=>{N.value&&lt(N.value)},onScanScreen:ut,onToggleStealth:dt,onToggleRoast:()=>{g.value==="roast"?g.value="qwerty":yt()},onToggleClipboard:()=>g.value=g.value==="clipboard"?"qwerty":"clipboard",onToggleEmojis:()=>g.value=g.value==="emojis"?"qwerty":"emojis",onVoiceInput:()=>{S("click"),Ie()},onSwitchKeyboard:()=>{S("click"),je()}})}

      ${()=>w.value?tt({buffer:A,hint:I,showEnableScanner:L,onGenerate:ie,onEnableScanner:()=>Fe("accessibility"),onCancel:()=>{w.value=!1,I.value=null,L.value=!1}}):""}

      ${rt({suggestions:ct,onSelectSuggestion:pt})}

      ${()=>{const t=g.value;return t==="nextmove"?it({resolution:_,onSelectReply:ht,onSwitchToStealth:()=>{var e;A.value=((e=_.value)==null?void 0:e.context.partnerText)??"",j()},onClose:()=>g.value="qwerty"}):t==="emojis"?nt({onSelectEmoji:ce,onClose:()=>g.value="qwerty"}):t==="clipboard"?at({history:Y,onSelectClip:e=>{$.recordCommittedReply(e),D(e),g.value="qwerty"},onAnalyzeClip:e=>{S("heavy"),mt(e)},onClose:()=>g.value="qwerty"}):t==="roast"?st({roast:ye,onApplyUpgrade:gt,onClose:()=>g.value="qwerty"}):ot({stealthMode:w,onKeyPress:ce,onBackspace:ft,onSend:()=>{w.value?ie():(S("heavy"),Me())},onOpenEmojis:()=>g.value="emojis"})}}
    </div>
  `}const le=document.getElementById("app");if(le){const{fragment:t}=X(bt());le.appendChild(t)}
