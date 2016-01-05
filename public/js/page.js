$(document).ready(function(){var e=function(){var e=$("#inputEmail").val(),t=$("#inputPassword").val();if(""===e||""===t)return $("#issue").show().empty().append("Missing data!");var n={username:e,password:t};$.post("/console/login",n,function(e){e.success?window.location="/console/home":$("#issue").show().empty().append(e.msg)})},t=function(){var e=$("#inputUser").val(),t=$("#inputName").val(),n=$("#inputEmail").val(),i=$("#inputPassword").val(),r=$("#inputPasswordConfirm").val();if(""===e||""===n||""===i||""===r||""===t)return $("#issue").show().empty().append("Missing data!");if(i!==r)return void $("#issue").show().empty().append("Passwords do not match!");var s={username:e,name:t,password:i,email:n};$.post("/author/create",s,function(e){var t=$("#issue");e.success?t.removeClass("alert-danger").addClass("alert-success"):t.removeClass("alert-success").addClass("alert-danger"),t.show().empty().append(e.msg)})};$("button#loginBtn").click(e),$("button#signupBtn").click(t)}),$(document).ready(function(){var e=window.location.pathname,t=e.split("/"),n=parseInt(t[2]),i=$("#typeRadioVal").html();"oldmovie"===i?$("#oldmovieRadio").prop("checked",!0):"newmovie"===i&&$("#newmovieRadio").prop("checked",!0),$("#photoForm").hide(),$("#profileImg").click(function(){$("#fileInput").trigger("click")}),$("#fileInput").change(function(){var e=$("#fileInput");if(e[0].files[0]){var t=new FileReader;t.onload=function(e){$("#profileImg").attr("src",e.target.result)},t.readAsDataURL(e[0].files[0])}}),$("button#modalImgUpload").click(function(){$("#issueModal").hide();var e=$("#fileInput"),t=$("#captionInput");return 0===e[0].files.length||""===t.val()?($("#issueModal").show(),$("#issueModal").empty(),void $("#issueModal").append("Please select image and enter caption to <b>Upload</b>!")):void $.post("/article/"+n+"/captions",{caption:t.val()},function(e){e.success&&$("#photoForm").submit()})}),$("button#prevBtn").click(function(){$("#issue").hide();var e,t=$("#textInput").val(),i=$("#headInput").val(),s=$("input[name=typeInput]:checked").val();if("feature"===s?e="Feature":"oldmovie"===s?e="Old Movie":"newmovie"===s&&(e="New Movie"),""===t||""===i)return $("#issue").show(),$("#issue").empty(),void $("#issue").append("Please enter a title and text for the article before you <b>Preview</b>!");$("#previewView").show(),$("#editView").hide(),$("#prevBtn").hide(),$("#editBtn").show(),$("#saveBtn").hide(),$(".posttxt").empty().html(marked(t)),$("#headPrev").empty(),$("#headPrev").append(i),$("#typePrev").empty(),$("#typePrev").append(e);var o={title:i,type:s,text:t};$.post("/article/"+n,o,function(e){e.success&&r()})}),$("button#editBtn").click(function(){$("#issue").hide(),$("#previewView").hide(),$("#editView").show(),$("#prevBtn").show(),$("#editBtn").hide(),$("#saveBtn").show()});$("button#imgUploadBtn").click(function(){$("#issue").hide();var e=$("#textInput").val(),t=$("#headInput").val(),i=$("input[name=typeInput]:checked").val();if(""===e||""===t)return setTimeout(function(){$("#closeModalBtn").trigger("click")},1e3),$("#issue").show(),$("#issue").empty(),void $("#issue").append("Please enter a title and text for the article before you <b>Save</b>!");var s={title:t,type:i,text:e};$.post("/article/"+n,s,function(e){e.success&&r()})});var r=function(){$("#saveAlert").show(),setTimeout(function(){$("#saveAlert").fadeOut()},3e3)};$("button#saveBtn").click(function(){$("#issue").hide();var e=$("#textInput").val(),t=$("#headInput").val(),i=$("#excerptInput").val(),s=$("input[name=typeInput]:checked").val();if(""===e||""===t)return void $("#issue").show().empty().append("Please enter a title and text for the article before you <b>Save</b>!");var o={title:t,type:s,text:e,excerpt:i};$.post("/article/"+n,o,function(e){e.success&&r()})}),$("button#submBtn").click(function(){$("#issue").hide();var e=$("#textInput").val(),t=$("#headInput").val(),i=$("input[name=typeInput]:checked").val();if(""===e||""===t)return $("#issue").show(),$("#issue").empty(),void $("#issue").append("Please enter a title and text for the article before you <b>Submit</b>!");var s={title:t,type:i,text:e};$.post("/article/"+n,s,function(e){e.success&&(r(),$.post("/article/"+n+"/submit",s,function(e){e.success&&(window.location="/console/home")}))})}),$("button#publBtn").click(function(){$("#issue").hide();var e=$("#textInput").val(),t=$("#headInput").val(),i=$("input[name=typeInput]:checked").val();if(""===e||""===t)return $("#issue").show(),$("#issue").empty(),void $("#issue").append("Please enter a title and text for the article before you <b>Publish</b>!");var s={title:t,type:i,text:e};$.post("/article/"+n,s,function(e){e.success&&(r(),$.post("/article/"+n+"/publish",s,function(e){e.success&&(window.location="/")}))})}),$("button#retractBtn").click(function(){$("#issue").hide(),$.post("/article/"+n+"/retract",function(e){e.success&&(window.location="/")})}),$("button.starBtn").click(function(e){var t=$(e.target).closest("button");if(!t.hasClass("btn-primary")){var i=t.val().split(";"),r=parseInt(i[0]),s=i[1],o={image:s,imageIndex:r};$.post("/article/"+n+"/cover",o,function(e){e.success&&($(".starBtn").removeClass("btn-primary"),t.addClass("btn-primary"))})}})}),function(e,t){function n(t){var n=e.URL||e.webkitURL,i=e.Blob,r=e.Worker;if(!(n&&i&&r&&t))return null;var s=new i([t]),o=new r(n.createObjectURL(s));return o}function i(e,t){function n(e){for(var t=[],n=e.clipboardData||{},r=n.items||[],s=0;s<r.length;s++){var o=r[s].getAsFile();if(o){var a=new RegExp("/(.*)").exec(o.type);if(!o.name&&a){var u=a[1];o.name="clipboard"+s+"."+u}t.push(o)}}t.length&&(l(e,t,i),e.preventDefault(),e.stopPropagation())}if(x.enabled){var i=h(h({},x.opts),t);e.addEventListener("paste",n,!1)}}function r(e,t){function n(t){l(t,e.files,r)}function i(e){e.stopPropagation(),e.preventDefault(),l(e,e.dataTransfer.files,r)}if(x.enabled){var r=h(h({},x.opts),t);e.addEventListener("change",n,!1),e.addEventListener("drop",i,!1)}}function s(e,n){function i(e){v=!1}function r(e){v=!0}function s(e){e.dataTransfer.files&&e.dataTransfer.files.length&&(e.stopPropagation(),e.preventDefault())}function o(e){return function(){v||e.apply(this,arguments)}}function a(t){t.stopPropagation(),t.preventDefault(),m&&f(e,m),l(t,t.dataTransfer.files,g)}function u(t){t.stopPropagation(),t.preventDefault(),m&&d(e,m)}function p(t){m&&f(e,m)}function c(t){t.stopPropagation(),t.preventDefault(),m&&d(e,m)}if(x.enabled){var g=h(h({},x.opts),n),m=g.dragClass,v=!1;e.addEventListener("dragenter",o(u),!1),e.addEventListener("dragleave",o(p),!1),e.addEventListener("dragover",o(c),!1),e.addEventListener("drop",o(a),!1),t.body.addEventListener("dragstart",r,!0),t.body.addEventListener("dragend",i,!0),t.body.addEventListener("drop",s,!1)}}function o(e,t){for(var n=0;n<e.length;n++){var i=e[n];i.extra={nameNoExtension:i.name.substring(0,i.name.lastIndexOf(".")),extension:i.name.substring(i.name.lastIndexOf(".")+1),fileID:n,uniqueID:_(),groupID:t,prettySize:g(i.size)}}}function a(e,t,n){for(var i in t)if(e.match(new RegExp(i)))return"readAs"+t[i];return"readAs"+n}function l(e,t,i){function r(){u.ended=new Date,i.on.groupend(u)}function s(){0===--l&&r()}var l=t.length,u={groupID:w(),files:t,started:new Date};if(x.output.push(u),o(t,u.groupID),i.on.groupstart(u),!t.length)return void r();var p,h=y&&v;h&&(p=n($),p.onmessage=function(e){var t=e.data.file,n=e.data.result;t.extra||(t.extra=e.data.extra),t.extra.ended=new Date,i.on["error"===n?"error":"load"]({target:{result:n}},t),s()}),Array.prototype.forEach.call(t,function(t){if(t.extra.started=new Date,i.accept&&!t.type.match(new RegExp(i.accept)))return i.on.skip(t),void s();if(i.on.beforestart(t)===!1)return i.on.skip(t),void s();var n=a(t.type,i.readAsMap,i.readAsDefault);if(p)p.postMessage({file:t,extra:t.extra,readAs:n});else{var r=new m;r.originalEvent=e,k.forEach(function(e){r["on"+e]=function(n){("load"==e||"error"==e)&&(t.extra.ended=new Date),i.on[e](n,t),"loadend"==e&&s()}}),r[n](t)}})}function u(){var e=n(b);e&&(e.onmessage=function(e){v=e.data},e.postMessage({}))}function p(){}function h(e,t){for(var n in t)t[n]&&t[n].constructor&&t[n].constructor===Object?(e[n]=e[n]||{},arguments.callee(e[n],t[n])):e[n]=t[n];return e}function c(e,t){return new RegExp("(?:^|\\s+)"+t+"(?:\\s+|$)").test(e.className)}function d(e,t){c(e,t)||(e.className=e.className?[e.className,t].join(" "):t)}function f(e,t){if(c(e,t)){var n=e.className;e.className=n.replace(new RegExp("(?:^|\\s+)"+t+"(?:\\s+|$)","g")," ").replace(/^\s\s*/,"").replace(/\s\s*$/,"")}}function g(e){var t=["bytes","kb","MB","GB","TB","PB"],n=Math.floor(Math.log(e)/Math.log(1024));return(e/Math.pow(1024,Math.floor(n))).toFixed(2)+" "+t[n]}var m=e.FileReader,v=!1,$="self.addEventListener('message', function(e) { var data=e.data; try { var reader = new FileReaderSync; postMessage({ result: reader[data.readAs](data.file), extra: data.extra, file: data.file})} catch(e){ postMessage({ result:'error', extra:data.extra, file:data.file}); } }, false);",b="onmessage = function(e) { postMessage(!!FileReaderSync); };",k=["loadstart","progress","load","abort","error","loadend"],y=!1,x=e.FileReaderJS={enabled:!1,setupInput:r,setupDrop:s,setupClipboard:i,setSync:function(e){y=e,y&&!v&&u()},getSync:function(){return y&&v},output:[],opts:{dragClass:"drag",accept:!1,readAsDefault:"DataURL",readAsMap:{},on:{loadstart:p,progress:p,load:p,abort:p,error:p,loadend:p,skip:p,groupstart:p,groupend:p,beforestart:p}}};if("undefined"!=typeof jQuery&&(jQuery.fn.fileReaderJS=function(e){return this.each(function(){jQuery(this).is("input")?r(this,e):s(this,e)})},jQuery.fn.fileClipboard=function(e){return this.each(function(){i(this,e)})}),m){var w=function(e){return function(){return e++}}(0),_=function(e){return function(){return e++}}(0);x.enabled=!0}}(this,document),$(document).ready(function(){var e=window.location.pathname;"/console/home"===e||"/features"===e?$("#navbar1").addClass("active"):"/author/profile"===e||"/movies"===e?$("#navbar2").addClass("active"):"/events"===e?$("#navbar3").addClass("active"):(-1!==e.indexOf("draft")||"/about"===e)&&$("#navbar4").addClass("active")}),function(){function e(e){this.tokens=[],this.tokens.links={},this.options=e||u.defaults,this.rules=p.normal,this.options.gfm&&(this.options.tables?this.rules=p.tables:this.rules=p.gfm)}function t(e,t){if(this.options=t||u.defaults,this.links=e,this.rules=h.normal,this.renderer=this.options.renderer||new n,this.renderer.options=this.options,!this.links)throw new Error("Tokens array requires a `links` property.");this.options.gfm?this.options.breaks?this.rules=h.breaks:this.rules=h.gfm:this.options.pedantic&&(this.rules=h.pedantic)}function n(e){this.options=e||{}}function i(e){this.tokens=[],this.token=null,this.options=e||u.defaults,this.options.renderer=this.options.renderer||new n,this.renderer=this.options.renderer,this.renderer.options=this.options}function r(e,t){return e.replace(t?/&/g:/&(?!#?\w+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function s(e){return e.replace(/&([#\w]+);/g,function(e,t){return t=t.toLowerCase(),"colon"===t?":":"#"===t.charAt(0)?"x"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""})}function o(e,t){return e=e.source,t=t||"",function n(i,r){return i?(r=r.source||r,r=r.replace(/(^|[^\[])\^/g,"$1"),e=e.replace(i,r),n):new RegExp(e,t)}}function a(){}function l(e){for(var t,n,i=1;i<arguments.length;i++){t=arguments[i];for(n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e}function u(t,n,s){if(s||"function"==typeof n){s||(s=n,n=null),n=l({},u.defaults,n||{});var o,a,p=n.highlight,h=0;try{o=e.lex(t,n)}catch(c){return s(c)}a=o.length;var d=function(e){if(e)return n.highlight=p,s(e);var t;try{t=i.parse(o,n)}catch(r){e=r}return n.highlight=p,e?s(e):s(null,t)};if(!p||p.length<3)return d();if(delete n.highlight,!a)return d();for(;h<o.length;h++)!function(e){return"code"!==e.type?--a||d():p(e.text,e.lang,function(t,n){return t?d(t):null==n||n===e.text?--a||d():(e.text=n,e.escaped=!0,void(--a||d()))})}(o[h])}else try{return n&&(n=l({},u.defaults,n)),i.parse(e.lex(t,n),n)}catch(c){if(c.message+="\nPlease report this to https://github.com/chjj/marked.",(n||u.defaults).silent)return"<p>An error occured:</p><pre>"+r(c.message+"",!0)+"</pre>";throw c}}var p={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:a,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:a,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:a,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};p.bullet=/(?:[*+-]|\d+\.)/,p.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/,p.item=o(p.item,"gm")(/bull/g,p.bullet)(),p.list=o(p.list)(/bull/g,p.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+p.def.source+")")(),p.blockquote=o(p.blockquote)("def",p.def)(),p._tag="(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b",p.html=o(p.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,p._tag)(),p.paragraph=o(p.paragraph)("hr",p.hr)("heading",p.heading)("lheading",p.lheading)("blockquote",p.blockquote)("tag","<"+p._tag)("def",p.def)(),p.normal=l({},p),p.gfm=l({},p.normal,{fences:/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,paragraph:/^/,heading:/^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/}),p.gfm.paragraph=o(p.paragraph)("(?!","(?!"+p.gfm.fences.source.replace("\\1","\\2")+"|"+p.list.source.replace("\\1","\\3")+"|")(),p.tables=l({},p.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/}),e.rules=p,e.lex=function(t,n){var i=new e(n);return i.lex(t)},e.prototype.lex=function(e){return e=e.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n"),this.token(e,!0)},e.prototype.token=function(e,t,n){for(var i,r,s,o,a,l,u,h,c,e=e.replace(/^ +$/gm,"");e;)if((s=this.rules.newline.exec(e))&&(e=e.substring(s[0].length),s[0].length>1&&this.tokens.push({type:"space"})),s=this.rules.code.exec(e))e=e.substring(s[0].length),s=s[0].replace(/^ {4}/gm,""),this.tokens.push({type:"code",text:this.options.pedantic?s:s.replace(/\n+$/,"")});else if(s=this.rules.fences.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"code",lang:s[2],text:s[3]||""});else if(s=this.rules.heading.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"heading",depth:s[1].length,text:s[2]});else if(t&&(s=this.rules.nptable.exec(e))){for(e=e.substring(s[0].length),l={type:"table",header:s[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:s[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:s[3].replace(/\n$/,"").split("\n")},h=0;h<l.align.length;h++)/^ *-+: *$/.test(l.align[h])?l.align[h]="right":/^ *:-+: *$/.test(l.align[h])?l.align[h]="center":/^ *:-+ *$/.test(l.align[h])?l.align[h]="left":l.align[h]=null;for(h=0;h<l.cells.length;h++)l.cells[h]=l.cells[h].split(/ *\| */);this.tokens.push(l)}else if(s=this.rules.lheading.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"heading",depth:"="===s[2]?1:2,text:s[1]});else if(s=this.rules.hr.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"hr"});else if(s=this.rules.blockquote.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"blockquote_start"}),s=s[0].replace(/^ *> ?/gm,""),this.token(s,t,!0),this.tokens.push({type:"blockquote_end"});else if(s=this.rules.list.exec(e)){for(e=e.substring(s[0].length),o=s[2],this.tokens.push({type:"list_start",ordered:o.length>1}),s=s[0].match(this.rules.item),i=!1,c=s.length,h=0;c>h;h++)l=s[h],u=l.length,l=l.replace(/^ *([*+-]|\d+\.) +/,""),~l.indexOf("\n ")&&(u-=l.length,l=this.options.pedantic?l.replace(/^ {1,4}/gm,""):l.replace(new RegExp("^ {1,"+u+"}","gm"),"")),this.options.smartLists&&h!==c-1&&(a=p.bullet.exec(s[h+1])[0],o===a||o.length>1&&a.length>1||(e=s.slice(h+1).join("\n")+e,h=c-1)),r=i||/\n\n(?!\s*$)/.test(l),h!==c-1&&(i="\n"===l.charAt(l.length-1),r||(r=i)),this.tokens.push({type:r?"loose_item_start":"list_item_start"}),this.token(l,!1,n),this.tokens.push({type:"list_item_end"});this.tokens.push({type:"list_end"})}else if(s=this.rules.html.exec(e))e=e.substring(s[0].length),this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&("pre"===s[1]||"script"===s[1]||"style"===s[1]),text:s[0]});else if(!n&&t&&(s=this.rules.def.exec(e)))e=e.substring(s[0].length),this.tokens.links[s[1].toLowerCase()]={href:s[2],title:s[3]};else if(t&&(s=this.rules.table.exec(e))){for(e=e.substring(s[0].length),l={type:"table",header:s[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:s[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:s[3].replace(/(?: *\| *)?\n$/,"").split("\n")},h=0;h<l.align.length;h++)/^ *-+: *$/.test(l.align[h])?l.align[h]="right":/^ *:-+: *$/.test(l.align[h])?l.align[h]="center":/^ *:-+ *$/.test(l.align[h])?l.align[h]="left":l.align[h]=null;for(h=0;h<l.cells.length;h++)l.cells[h]=l.cells[h].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */);this.tokens.push(l)}else if(t&&(s=this.rules.paragraph.exec(e)))e=e.substring(s[0].length),this.tokens.push({type:"paragraph",text:"\n"===s[1].charAt(s[1].length-1)?s[1].slice(0,-1):s[1]});else if(s=this.rules.text.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"text",text:s[0]});else if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0));return this.tokens};var h={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:a,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:a,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};h._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/,h._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/,h.link=o(h.link)("inside",h._inside)("href",h._href)(),h.reflink=o(h.reflink)("inside",h._inside)(),h.normal=l({},h),h.pedantic=l({},h.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/}),h.gfm=l({},h.normal,{escape:o(h.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:o(h.text)("]|","~]|")("|","|https?://|")()}),h.breaks=l({},h.gfm,{br:o(h.br)("{2,}","*")(),text:o(h.gfm.text)("{2,}","*")()}),t.rules=h,t.output=function(e,n,i){var r=new t(n,i);return r.output(e)},t.prototype.output=function(e){for(var t,n,i,s,o="";e;)if(s=this.rules.escape.exec(e))e=e.substring(s[0].length),o+=s[1];else if(s=this.rules.autolink.exec(e))e=e.substring(s[0].length),"@"===s[2]?(n=":"===s[1].charAt(6)?this.mangle(s[1].substring(7)):this.mangle(s[1]),i=this.mangle("mailto:")+n):(n=r(s[1]),i=n),o+=this.renderer.link(i,null,n);else if(this.inLink||!(s=this.rules.url.exec(e))){if(s=this.rules.tag.exec(e))!this.inLink&&/^<a /i.test(s[0])?this.inLink=!0:this.inLink&&/^<\/a>/i.test(s[0])&&(this.inLink=!1),e=e.substring(s[0].length),o+=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(s[0]):r(s[0]):s[0];else if(s=this.rules.link.exec(e))e=e.substring(s[0].length),this.inLink=!0,o+=this.outputLink(s,{href:s[2],title:s[3]}),this.inLink=!1;else if((s=this.rules.reflink.exec(e))||(s=this.rules.nolink.exec(e))){if(e=e.substring(s[0].length),t=(s[2]||s[1]).replace(/\s+/g," "),t=this.links[t.toLowerCase()],!t||!t.href){o+=s[0].charAt(0),e=s[0].substring(1)+e;continue}this.inLink=!0,o+=this.outputLink(s,t),this.inLink=!1}else if(s=this.rules.strong.exec(e))e=e.substring(s[0].length),o+=this.renderer.strong(this.output(s[2]||s[1]));else if(s=this.rules.em.exec(e))e=e.substring(s[0].length),o+=this.renderer.em(this.output(s[2]||s[1]));else if(s=this.rules.code.exec(e))e=e.substring(s[0].length),o+=this.renderer.codespan(r(s[2],!0));else if(s=this.rules.br.exec(e))e=e.substring(s[0].length),o+=this.renderer.br();else if(s=this.rules.del.exec(e))e=e.substring(s[0].length),o+=this.renderer.del(this.output(s[1]));else if(s=this.rules.text.exec(e))e=e.substring(s[0].length),o+=this.renderer.text(r(this.smartypants(s[0])));else if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0))}else e=e.substring(s[0].length),n=r(s[1]),i=n,o+=this.renderer.link(i,null,n);return o},t.prototype.outputLink=function(e,t){var n=r(t.href),i=t.title?r(t.title):null;return"!"!==e[0].charAt(0)?this.renderer.link(n,i,this.output(e[1])):this.renderer.image(n,i,r(e[1]))},t.prototype.smartypants=function(e){return this.options.smartypants?e.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…"):e},t.prototype.mangle=function(e){if(!this.options.mangle)return e;for(var t,n="",i=e.length,r=0;i>r;r++)t=e.charCodeAt(r),Math.random()>.5&&(t="x"+t.toString(16)),n+="&#"+t+";";return n},n.prototype.code=function(e,t,n){if(this.options.highlight){var i=this.options.highlight(e,t);null!=i&&i!==e&&(n=!0,e=i)}return t?'<pre><code class="'+this.options.langPrefix+r(t,!0)+'">'+(n?e:r(e,!0))+"\n</code></pre>\n":"<pre><code>"+(n?e:r(e,!0))+"\n</code></pre>"},n.prototype.blockquote=function(e){return"<blockquote>\n"+e+"</blockquote>\n"},n.prototype.html=function(e){return e},n.prototype.heading=function(e,t,n){return"<h"+t+' id="'+this.options.headerPrefix+n.toLowerCase().replace(/[^\w]+/g,"-")+'">'+e+"</h"+t+">\n"},n.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"},n.prototype.list=function(e,t){var n=t?"ol":"ul";return"<"+n+">\n"+e+"</"+n+">\n"},n.prototype.listitem=function(e){return"<li>"+e+"</li>\n"},n.prototype.paragraph=function(e){return"<p>"+e+"</p>\n"},n.prototype.table=function(e,t){return"<table>\n<thead>\n"+e+"</thead>\n<tbody>\n"+t+"</tbody>\n</table>\n"},n.prototype.tablerow=function(e){return"<tr>\n"+e+"</tr>\n"},n.prototype.tablecell=function(e,t){var n=t.header?"th":"td",i=t.align?"<"+n+' style="text-align:'+t.align+'">':"<"+n+">";return i+e+"</"+n+">\n"},n.prototype.strong=function(e){return"<strong>"+e+"</strong>"},n.prototype.em=function(e){return"<em>"+e+"</em>"},n.prototype.codespan=function(e){return"<code>"+e+"</code>"},n.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"},n.prototype.del=function(e){return"<del>"+e+"</del>"},n.prototype.link=function(e,t,n){if(this.options.sanitize){try{var i=decodeURIComponent(s(e)).replace(/[^\w:]/g,"").toLowerCase()}catch(r){return""}if(0===i.indexOf("javascript:")||0===i.indexOf("vbscript:"))return""}var o='<a href="'+e+'"';return t&&(o+=' title="'+t+'"'),o+=">"+n+"</a>"},n.prototype.image=function(e,t,n){var i='<img src="'+e+'" alt="'+n+'"';return t&&(i+=' title="'+t+'"'),i+=this.options.xhtml?"/>":">"},n.prototype.text=function(e){return e},i.parse=function(e,t,n){var r=new i(t,n);return r.parse(e)},i.prototype.parse=function(e){this.inline=new t(e.links,this.options,this.renderer),this.tokens=e.reverse();for(var n="";this.next();)n+=this.tok();return n},i.prototype.next=function(){return this.token=this.tokens.pop()},i.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0},i.prototype.parseText=function(){for(var e=this.token.text;"text"===this.peek().type;)e+="\n"+this.next().text;return this.inline.output(e)},i.prototype.tok=function(){switch(this.token.type){case"space":return"";case"hr":return this.renderer.hr();case"heading":return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text);case"code":return this.renderer.code(this.token.text,this.token.lang,this.token.escaped);case"table":var e,t,n,i,r,s="",o="";for(n="",e=0;e<this.token.header.length;e++)i={header:!0,align:this.token.align[e]},n+=this.renderer.tablecell(this.inline.output(this.token.header[e]),{header:!0,align:this.token.align[e]});for(s+=this.renderer.tablerow(n),e=0;e<this.token.cells.length;e++){for(t=this.token.cells[e],n="",r=0;r<t.length;r++)n+=this.renderer.tablecell(this.inline.output(t[r]),{header:!1,align:this.token.align[r]});o+=this.renderer.tablerow(n)}return this.renderer.table(s,o);case"blockquote_start":for(var o="";"blockquote_end"!==this.next().type;)o+=this.tok();return this.renderer.blockquote(o);case"list_start":for(var o="",a=this.token.ordered;"list_end"!==this.next().type;)o+=this.tok();return this.renderer.list(o,a);case"list_item_start":for(var o="";"list_item_end"!==this.next().type;)o+="text"===this.token.type?this.parseText():this.tok();return this.renderer.listitem(o);case"loose_item_start":for(var o="";"list_item_end"!==this.next().type;)o+=this.tok();return this.renderer.listitem(o);case"html":var l=this.token.pre||this.options.pedantic?this.token.text:this.inline.output(this.token.text);return this.renderer.html(l);case"paragraph":return this.renderer.paragraph(this.inline.output(this.token.text));case"text":return this.renderer.paragraph(this.parseText())}},a.exec=a,u.options=u.setOptions=function(e){return l(u.defaults,e),u},u.defaults={gfm:!0,tables:!0,breaks:!1,pedantic:!1,sanitize:!1,sanitizer:null,mangle:!0,smartLists:!1,silent:!1,highlight:null,langPrefix:"lang-",smartypants:!1,headerPrefix:"",renderer:new n,xhtml:!1},u.Parser=i,u.parser=i.parse,u.Renderer=n,u.Lexer=e,u.lexer=e.lex,u.InlineLexer=t,u.inlineLexer=t.output,u.parse=u,"undefined"!=typeof module&&"object"==typeof exports?module.exports=u:"function"==typeof define&&define.amd?define(function(){return u}):this.marked=u}.call(function(){return this||("undefined"!=typeof window?window:global)}()),$(document).ready(function(){$("#photoForm").hide(),$("#updateProfile").hide();var e,t,n;$("button#editBtn").click(function(){$("#editBtn").hide(),$("#pwBtn").hide(),$("#profileName").hide(),$("#profileBio").hide(),$("#inputName").show(),$("#inputEmail").show(),$("#inputBio").show(),$("#updateProfile").show(),e=$("#inputName").val(),t=$("#inputEmail").val(),n=$("#inputBio").val()}),$("button#updateProfile").click(function(){var i=$("#inputName").val(),r=$("#inputEmail").val(),s=$("#inputBio").val();if(""===i||""===s||""===r)return $("#issue").show(),$("#issue").empty(),void $("#issue").append("Please fill out all the fields!");if(i!==e||s!==n||r!==t){$("#profileName").empty(),$("#profileName").append(i),$("#profileBio").empty(),$("#profileBio").append(s);var o={name:i,bio:s,email:r};$.post("/author/profile/description",o)}$("#editBtn").show(),$("#pwBtn").show(),$("#profileName").show(),$("#profileBio").show(),$("#issue").hide(),$("#inputName").hide(),$("#inputEmail").hide(),$("#inputBio").hide(),$("#updateProfile").hide()});var i=function(){$("#saveAlert").show(),setTimeout(function(){$("#saveAlert").fadeOut()},3e3)},r=function(){var e=$("#issueModal");e.hide();var t=$("#oldpw").val(),n=$("#newpw1").val(),r=$("#newpw2").val();if(""!==t&&""!==n&&""!==r){if(n!==r)return void e.show().empty().append("New passwords do not match up!");var s={oldpassword:t,newpassword:n};$.post("/author/password",s,function(t){return t.success?void setTimeout(function(){$("#closeModalBtn").trigger("click"),i()},500):e.show().empty().append(t.msg)})}},s=function(){$("#photoForm").submit()};$("#pwcBtn").click(r),$("#fileInput").change(s)});