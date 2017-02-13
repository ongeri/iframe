!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){"use strict";var c={},d="visa",e="master-card",f="CVV",g=[d,e];c[d]={common:"Visa",type:d,prefixPattern:/^4$/,exactPattern:/^4\d*$/,gaps:[4,8,12],lengths:[16,18,19],code:{name:f,size:3}},c[e]={common:"MasterCard",type:e,prefixPattern:/^(5|5[1-5]|2|22|222|222[1-9]|2[3-6]|27[0-1]|2720)$/,exactPattern:/^(5[1-5]|222[1-9]|2[3-6]|27[0-1]|2720)\d*$/,gaps:[4,8,12],lengths:[16],code:{name:f,size:3}};var h=function(a){var b,c,d;return a?(b=a.exactPattern.source,c=a.prefixPattern.source,d=JSON.parse(JSON.stringify(a)),d.exactPattern=b,d.prefixPattern=c,d):null},i=function(a){var b,d,e,f=[],i=[];if(!("string"==typeof a||a instanceof String))return[];for(e=0;e<g.length;e++)b=g[e],d=c[b],0!==a.length?(d.exactPattern.test(a)?i.push(h(d)):d.prefixPattern.test(a)&&f.push(h(d)),i.length):f.push(h(d));return i.length?i:f};b.exports=i},{}],2:[function(a,b){"use strict";b.exports={cvv:a("./src/cvv.js"),pan:a("./src/pan.js"),pin:a("./src/pin.js"),exp:a("./src/exp.js")}},{"./src/cvv.js":3,"./src/exp.js":4,"./src/pan.js":6,"./src/pin.js":7}],3:[function(a,b){"use strict";var c=3,d=function(a,b){return{isValid:a,isPotentiallyValid:b}},e=function(a,b){for(var c=0;c<b.length;c++)if(b[c]===a)return!0;return!1},f=function(a,b){return b=b||c,b=b instanceof Array?b:[b],"string"!=typeof a?d(!1,!1):/^\d*$/.test(a)?e(a.length,b)?d(!0,!0):a.length<Math.min.apply(null,b)?d(!1,!0):a.length>Math.max.apply(null,b)?d(!1,!1):d(!0,!0):d(!1,!1)};b.exports=f},{}],4:[function(a,b){"use strict";var c=function(a,b){return{isPotentiallyValid:a,isValid:b}},d=function(a){if("string"!=typeof a)return c(!1,!1);if(0==a.length)return c(!0,!1);if("0"!=a.charAt(0)&&"1"!=a.charAt(0))return c(!1,!1);if(a.length<=2)return/^\d*$/.test(a)?c(!0,!1):c(!1,!1);var b=a.substring(0,2),d=a.substring(3);if("/"!==a.charAt(2))return c(!1,!1);if(b.length>0&&!/^\d*$/.test(b))return c(!1,!1);if(d.length>0&&!/^\d*$/.test(d))return c(!1,!1);if(d.length<2)return c(!0,!1);if(d.length>2)return c(!1,!1);var e=new Date,f=e.getMonth()+1,g=e.getYear();return f=1==f.length?"0"+f:f,g%=100,g>d?c(!1,!1):d>g?c(!0,!0):parseInt(b)>=1&&parseInt(b)<=12&&parseInt(b)>=parseInt(f)?c(!0,!0):c(!1,!1)};b.exports=d},{}],5:[function(a,b){"use strict";function c(a){for(var b,c=0,d=!1,e=a.length-1;e>=0;)b=parseInt(a.charAt(e),10),d&&(b*=2,b>9&&(b=b%10+1)),d=!d,c+=b,e--;return c%10===0}b.exports=c},{}],6:[function(a,b){"use strict";var c=a("../../card-type"),d=a("./luhn-10.js"),e=function(a,b,c){return{card:a,isPotentiallyValid:b,isValid:c}},f=function(a){var b,f,g,h,i,j;if("number"==typeof a&&(a=String(a)),"string"!=typeof a)return e(null,!1,!1);if(a=a.replace(/\-|\s/g,""),!/^\d*$/.test(a))return e(null,!1,!1);if(b=c(a),0===b.length)return e(null,!1,!1);if(1!==b.length)return e(null,!0,!1);for(f=b[0],g=d(a),console.log("luhn check: "+g),i=Math.max.apply(null,f.lengths),console.log("maxLength is: "+i+"----"+(a.length<i)),h=0;h<f.lengths.length;h++)if(f.lengths[h]===a.length)return j=a.length!==i||g,e(f,j,g);return e(f,a.length<i,!1)};b.exports=f},{"../../card-type":1,"./luhn-10.js":5}],7:[function(a,b){"use strict";var c=function(a,b){return{isPotentiallyValid:a,isValid:b}},d=function(a){return"number"==typeof a&&(a=String(number)),"string"!=typeof a?c(!1,!1):(a=a.replace(/\s/g,""),/^\d*$/.test(a)?a.length<4?c(!0,!1):c(!0,!0):c(!1,!1))};b.exports=d},{}],8:[function(a,b){"use strict";function c(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}b.exports=c({READY:"READY",FRAME_SET:"FRAME_SET",INPUT_EVENT:"INPUT_EVENT",PAY_REQUEST:"PAY_REQUEST"},"INPUT_EVENT","INPUT_EVENT")},{}],9:[function(a,b){"use strict";var c=function(a,b){var c;return void 0!==a&&void 0===b?!1:a.length!==b.length?!1:(c=a.reduce(function(a,b){return a[b.type]=!0,a},{}),b.every(function(a){return c.hasOwnProperty(a.type)}))};b.exports=c},{}],10:[function(a,b){"use strict";function c(a){var b;this.type=a.type,this.model=a.model,this.element=this.buildElement(),this.MAX_SIZE&&this.element.setAttribute("maxlength",this.MAX_SIZE),b=this.getConfiguration().formatInput!==!1&&this.element instanceof HTMLInputElement,console.log("shouldFormat "+b),this.formatter=e({shouldFormat:!1,element:this.element,pattern:" "}),this.addDOMEventListeners(),this.addModelEventListeners(),this.addBusEventListeners(),this.render()}var d=a("framebus"),e=a("../../libs/create-restricted-input.js"),f=a("../../libs/constants"),g=a("../../libs/is-ie9.js"),h=a("../../libs/class-toggle.js"),i=f.events,j=13;c.prototype.buildElement=function(){var a=this.type,b=this.getConfiguration().type||"tel";"pin"===a&&(b="password");var c=document.createElement("input"),d=this.getConfiguration().placeholder,e=f.formMap[a],g=e.name,h={type:b,autocomplete:"off",autocorrect:"off",autocapitalize:"none",spellcheck:"false","class":a,"data-isw-name":a,name:g,id:g};return d&&(h.placeholder=d),Object.keys(h).forEach(function(a){c.setAttribute(a,h[a])}),c},c.prototype.getConfiguration=function(){return this.model.conf.fields[this.type]},c.prototype.addDOMEventListeners=function(){this._addDOMFocusListeners(),this._addDOMInputListeners(),this._addDOMKeypressListeners()},c.prototype._addDOMFocusListeners=function(){var a=this.element;"onfocusin"in document?document.documentElement.addEventListener("focusin",function(b){b.fromElement!==a&&(b.relatedTarget||a.focus())},!1):document.addEventListener("focus",function(){a.focus()},!1),a.addEventListener("touchstart",function(){a.select()}),a.addEventListener("focus",function(){this.updateModel("isFocused",!0)}.bind(this),!1),a.addEventListener("blur",function(){this.updateModel("isFocused",!1)}.bind(this),!1)},c.prototype._addDOMKeypressListeners=function(){this.element.addEventListener("keypress",function(a){a.keyCode===j&&this.model.emitEvent(this.type,"inputSubmitRequest")}.bind(this),!1)};var k=function(a,b){if(a.length>0){var c=a.charAt(a.length-1);return"exp"===b?3===a.length&&"/"===c||!isNaN(c):!isNaN(c)}return!0};c.prototype._addDOMInputListeners=function(){this.element.addEventListener(this._getDOMChangeEvent(),function(){var a=this.getUnformattedValue();return k(a,this.type)?("exp"===this.type&&a&&a.length>0&&(this.hasSlash?2==a.length&&(a=a.substring(0,1),this.hasSlash=!1):(this.hasSlash=!0,a="0"===a.charAt(0)||"1"===a.charAt(0)?a:"0"+a,a.length>1?a=a.substring(0,2)+"/"+a.substring(2,a.length):this.hasSlash=!1),this.formatter.setValue(a)),void this.updateModel("value",a)):(a=a.substring(0,a.length-1),void this.formatter.setValue(a))}.bind(this),!1)},c.prototype._getDOMChangeEvent=function(){return g()?"keyup":"input"},c.prototype.updateModel=function(a,b){this.model.set(this.type+"."+a,b)},c.prototype.getUnformattedValue=function(){return this.formatter.getUnformattedValue()},c.prototype.addModelEventListeners=function(){this.modelOnChange("isValid",this.render),this.modelOnChange("isPotentiallyValid",this.render)},c.prototype.modelOnChange=function(a,b){var c="change:"+this.type,d=this;this.model.on(c+"."+a,function(){b.apply(d,arguments)})},c.prototype.render=function(){var a=this.model.get(this.type),b=a.isValid,c=a.isPotentiallyValid;h.toggle(this.element,"valid",b),h.toggle(this.element,"invalid",!c),this.maxLength&&this.element.setAttribute("maxlength",this.maxLength)},c.prototype.addBusEventListeners=function(){d.on(i.TRIGGER_INPUT_FOCUS,function(a){a===this.type&&this.element.focus()}.bind(this)),d.on(i.SET_PLACEHOLDER,this.setPlaceholder.bind(this)),d.on(i.ADD_CLASS,function(a,b){a===this.type&&toggle.add(this.element,b)}.bind(this)),d.on(i.REMOVE_CLASS,function(a,b){a===this.type&&toggle.remove(this.element,b)}.bind(this)),d.on(i.CLEAR_FIELD,function(a){a===this.type&&(this.element.value="",this.updateModel("value",""))}.bind(this))},c.prototype.setPlaceholder=function(a,b){a===this.type&&this.element.setAttribute("placeholder",b)},b.exports={BaseInput:c}},{"../../libs/class-toggle.js":25,"../../libs/constants":26,"../../libs/create-restricted-input.js":27,"../../libs/is-ie9.js":29,framebus:40}],11:[function(a,b){"use strict";var c=a("./base-input.js").BaseInput,d=3,e=function(){this.MAX_SIZE=d,c.apply(this,arguments)};e.prototype=Object.create(c.prototype),e.constructor=e,b.exports={CVVINPUT:e}},{"./base-input.js":10}],12:[function(a,b){"use strict";var c=a("./base-input.js").BaseInput,d=5,e=function(){this.MAX_SIZE=d,this.hasSlash=!1,c.apply(this,arguments)};e.prototype=Object.create(c.prototype),e.constructor=e,b.exports={EXP:e}},{"./base-input.js":10}],13:[function(a,b){"use strict";var c=(a("./label.js"),a("./input-components.js")),d=a("../../libs/constants"),e=function(a){var b=a.type;this.element=document.createDocumentFragment();var e=(d.formMap[b],new c[b]({model:a.model,type:b}));this.element.appendChild(e.element)};b.exports={FieldComponent:e}},{"../../libs/constants":26,"./input-components.js":14,"./label.js":15}],14:[function(a,b){"use strict";b.exports={cvv:a("./cvv.js").CVVINPUT,pan:a("./pan.js").PAN,pin:a("./pin.js").PIN,exp:a("./exp.js").EXP}},{"./cvv.js":11,"./exp.js":12,"./pan.js":16,"./pin.js":17}],15:[function(a,b){"use strict";var c=function(a){this.element=document.createElement("label"),this.element.setAttribute("for",a.name),this.element.innerHTML=a.label,console.log("what i passed "+a.name+" "+a.label)};b.exports=c},{}],16:[function(a,b){"use strict";var c=a("./base-input.js").BaseInput,d=16,e=function(){this.MAX_SIZE=d,c.apply(this,arguments),this.model.on("change:possibleCardTypes",function(){}.bind(this))};e.prototype=Object.create(c.prototype),e.constructor=e,b.exports={PAN:e}},{"./base-input.js":10}],17:[function(a,b){"use strict";var c=a("./base-input.js").BaseInput,d=4,e=function(){this.MAX_SIZE=d,c.apply(this,arguments)};e.prototype=Object.create(c.prototype),e.constructor=e,b.exports={PIN:e}},{"./base-input.js":10}],18:[function(a,b){"use strict";b.exports={getFrameName:function(){return window.name.replace("isw-hosted-field-","")}}},{}],19:[function(a,b){"use strict";var c=a("framebus"),d=a("./models/credit-card-form.js").CreditCardForm,e=a("./pack-iframes.js"),f=a("./get-frame-name.js"),g=a("./components/field-component.js").FieldComponent,h=a("../hosted-fields/events.js"),i=a("../request"),j=a("inject-stylesheet").injectWithBlacklist,k=function(){c.emit(h.FRAME_SET,{},l)},l=function(a){console.log("---> building started>>>");var b=a.client,f=new d(a),g=e.packIframes(window.parent);g.forEach(function(a){a.interswitch.hostedFields.initialize(f)}),c.on(h.PAY_REQUEST,function(a,c){var d=m(b,f);d(a,c)})},m=function(a,b){return function(c,d){var e=b.isEmpty(),f=b.getInvalidFormField(),g=0===f.length?!0:!1;if(console.log("isempty - isValid "+e+" "+g),e){var h={error:"All the fields are empty"};return void d(h)}if(!g){var h={error:"Some fields are Invalid",detail:{data:f}};return console.log("error from source "+JSON.stringify(h)),void d(h)}var j=b.getCardData();c=c||{},console.log("credit card details is "+JSON.stringify(a)),console.log(a),console.log(j),i({method:"POST",data:{creditCardDetails:j},url:"http://localhost:3000/api/v1/payment/hosted"},function(a,b){if(a){console.log("error paying "+a);var c={error:a};return void d(c)}console.log("response from server "+b.message),d(b)})}},n=function(a){var b,c=["background","display"];j(a.conf.styles,c),b=new g({model:a,type:f.getFrameName()}),document.body.appendChild(b.element)};b.exports={create:k,initialize:n}},{"../hosted-fields/events.js":8,"../request":35,"./components/field-component.js":13,"./get-frame-name.js":18,"./models/credit-card-form.js":22,"./pack-iframes.js":24,framebus:40,"inject-stylesheet":41}],20:[function(a){"use strict";var b=a("./hosted-internal-fields.js");window.interswitch={hostedFields:b}},{"./hosted-internal-fields.js":19}],21:[function(a,b){"use strict";var c={pan:{value:"",isEmpty:!0,isFocused:!1,isValid:!1,isPotentiallyValid:!0},cvv:{value:"",isEmpty:!0,isFocused:!1,isValid:!1,isPotentiallyValid:!0},exp:{value:"",isEmpty:!0,isFocused:!1,isValid:!1,isPotentiallyValid:!0},pin:{value:"",isEmpty:!0,isFocused:!1,isValid:!1,isPotentiallyValid:!0}};b.exports=c},{}],22:[function(a,b){"use strict";function c(a,b){return function(){var c=a.get(b+".value");a.set(b+".isEmpty",""===c),a._validateField(b)}}function d(a,b){return function(c){a._fieldKeys.forEach(function(c){c!==b&&a.set(c+".isFocused",!1)}),a.emitEvent(b,c?j.FOCUS:j.BLUR)}}function e(a,b){return function(){a.emitEvent(b,j.CARD_TYPE_CHANGE)}}function f(a,b){return function(){var c=a.get(b+".isEmpty")?j.EMPTY:j.NOT_EMPTY;a.emitEvent(b,c)}}function g(a,b){return function(){a.emitEvent(b,j.VALIDITY_CHANGE)}}var h=a("./evented-model"),i=a("../../libs/constants.js"),j=i.externalEvents,k=a("framebus"),l=a("../../card-validator"),m=a("./card-default.js"),n=a("../../card-type"),o=a("../compare-card-type.js"),p=a("../../hosted-fields/events.js"),q=function(a){this._fieldKeys=Object.keys(a.fields).filter(function(){return!0}),console.log("Keys for fields "+JSON.stringify(this._fieldKeys)+">>>"),h.apply(this,arguments),this.initialize(m),this.conf=a,this._fieldKeys.forEach(function(a){var b=g(this,a);this.on("change:"+a+".value",c(this,a)),this.on("change:"+a+".isFocused",d(this,a)),this.on("change:"+a+".isValid",b),this.on("change:"+a+".isPotentiallyValid",b),this.on("change:"+a+".isEmpty",f(this,a))}.bind(this)),this.on("change:pan.value",this._onNumberChange),this.on("change:possibleCardTypes",function(){this._validateField("cvv")}.bind(this)),this.on("change:possibleCardTypes",e(this,"pan"))};q.prototype=Object.create(h.prototype),q.prototype.constructor=q,q.prototype.emitEvent=function(a,b){var c,d=this.get("possibleCardTypes"),e=this._fieldKeys.reduce(function(a,b){var c=this.get(b);return c&&(a[b]={isEmpty:c.isEmpty,isValid:c.isValid,isPotentiallyValid:c.isPotentiallyValid,isFocused:c.isFocused}),a}.bind(this),{});d&&(c=d.map(function(a){return{common:a.common,type:a.type,code:a.code}})),console.log("before emitting INPUT_EVENT "+JSON.stringify(e)),k.emit(p.INPUT_EVENT,{merchantPayload:{cards:c,emittedBy:a,fields:e},type:b})},q.prototype._onNumberChange=function(a){var b=n(a.replace(/[-\s]/g,"")),c=this.get("possibleCardTypes");o(b,c)||this.set("possibleCardTypes",b)},q.prototype._validateField=function(a){console.log("Validating fieldKey "+a);var b,c=this.get(a+".value"),d=l[a];"cvv"===a?(console.log("on validating cvv "),b=this._validateCvv(c),console.log(b)):b=d(c),console.log("The validation resule::::::"+JSON.stringify(b)),this.set(a+".isValid",b.isValid),this.set(a+".isPotentiallyValid",b.isPotentiallyValid)},q.prototype._validateCvv=function(a){return console.log("validating cvv"),l.cvv(a,3)},q.prototype.getCardData=function(){var a,b={},c=[];return console.log("keys are "+JSON.stringify(this._fieldKeys)),-1!==this._fieldKeys.indexOf("pan")&&c.push("pan"),-1!==this._fieldKeys.indexOf("cvv")&&c.push("cvv"),-1!==this._fieldKeys.indexOf("postalCode")&&c.push("postalCode"),-1!==this._fieldKeys.indexOf("exp")&&c.push("exp"),-1!==this._fieldKeys.indexOf("pin")&&c.push("pin"),-1!==this._fieldKeys.indexOf("expirationDate")&&console.log(a),c.reduce(function(a,b){return a[b]=this.get(b+".value"),a}.bind(this),b),b},q.prototype.isEmpty=function(){var a=0;return this._fieldKeys.forEach(function(b){b&&0===this.get(b).value.length&&(a+=1)}.bind(this)),a===this._fieldKeys.length},q.prototype.getInvalidFormField=function(){return this._fieldKeys.filter(function(a){return!this.get(a).isValid}.bind(this))},b.exports={CreditCardForm:q}},{"../../card-type":1,"../../card-validator":2,"../../hosted-fields/events.js":8,"../../libs/constants.js":26,"../compare-card-type.js":9,"./card-default.js":21,"./evented-model":23,framebus:40}],23:[function(a,b){"use strict";function c(){this._attributes=this.resetAttributes(),this._listeners={}}var d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},e=Array.prototype.slice;c.prototype.initialize=function(a){if(a){var b=this._attributes;console.log("undefined"==typeof a?"undefined":d(a));for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c])}},c.prototype.get=function(a){var b,c,d,e=this._attributes;if(null==a)return e;for(d=a.split("."),b=0;b<d.length;b++){if(c=d[b],!e.hasOwnProperty(c))return void 0;e=e[c]}return e},c.prototype.set=function(a,b){console.log("Setting "+a+" "+b);var c,d,e,f=this._attributes;for(e=a.split("."),c=0;c<e.length-1;c++)d=e[c],f.hasOwnProperty(d)||(f[d]={}),f=f[d];if(d=e[c],f[d]!==b)for(f[d]=b,c=1;c<=e.length;c++)d=e.slice(0,c).join("."),console.log("change:"+d+"----"+JSON.stringify(this.get(d))),this.emit("change:"+d,this.get(d))},c.prototype.on=function(a,b){var c=this._listeners[a];c?this._listeners[a].push(b):this._listeners[a]=[b]},c.prototype.emit=function(a){var b,c=this,d=arguments,f=this._listeners[a];if(f)for(b=0;b<f.length;b++)f[b].apply(c,e.call(d,1))},c.prototype.resetAttributes=function(){return{}},b.exports=c},{}],24:[function(a,b){"use strict";var c=function(a){var b,c,d=[];for(console.log(document.referrer),console.log(a.frames[0].location.href+"----"+a.frames[1].location.href),b=0;b<a.frames.length;b++){c=a.frames[b];try{d.push(c)}catch(e){console.log("exception "+e)}}return d};b.exports={packIframes:c}},{}],25:[function(a,b){"use strict";var c=function(a){return a?a.className.trim().split(/\s+/):[]},d=function(a){var b=Array.prototype.slice.call(arguments,1);console.log("add class "+JSON.stringify(c(a)));var d=c(a).filter(function(a){return-1===b.indexOf(a)}).concat(b).join(" ");console.log("add class "+JSON.stringify(c(a))),a.className=d},e=function(a){var b=Array.prototype.slice.call(arguments,1);console.log("remove class "+JSON.stringify(c(a)));var d=c(a).filter(function(a){return console.log("comparing "+b+"-and-"+a+" "+b.indexOf(a)),-1===b.indexOf(a)}).join(" ");console.log("remove class "+JSON.stringify(c(a))),a.className=d},f=function(a,b,c){console.log("toggle "+b+" "+c),c?d(a,b):e(a,b)};b.exports={add:d,remove:e,toggle:f}},{}],26:[function(a,b){"use strict";var c={externalEvents:{FOCUS:"focus",BLUR:"blur",EMPTY:"empty",NOT_EMPTY:"notEmpty",VALIDITY_CHANGE:"validityChange",CARD_TYPE_CHANGE:"cardTypeChange"},externalClasses:{FOCUSED:"isw-hosted-field-focused",INVALID:"isw-hosted-field-invalid",VALID:"isw-hosted-field-valid"},events:{TRIGGER_INPUT_FOCUS:"TRIGGER_INPUT_FOCUS",SET_PLACEHOLDER:"SET_PLACEHOLDER",ADD_CLASS:"ADD_CLASS",REMOVE_CLASS:"REMOVE_CLASS",CLEAR_FIELD:"CLEAR_FIELD"},DEFAULTIFRAMESTYLE:{border:"none",width:"100%",height:"100%","float":"left"},formMap:{pan:{name:"Pan",label:"PAN"},cvv:{name:"cvv",label:"CVV"},pin:{name:"pin",label:"PIN"},exp:{name:"expiration",label:"Expiration Date"},expMonth:{name:"expirationMonth",label:"Expiration Month"},expYear:{name:"expirationYear",label:"Expiration Year"}}};b.exports=c},{}],27:[function(a,b){"use strict";var c=a("./fake-restricted-input");b.exports=function(a){a.shouldFormat;return new c(a)}},{"./fake-restricted-input":28}],28:[function(a,b){"use strict";function c(a){this.inputElement=a.element}c.prototype.getUnformattedValue=function(){return this.inputElement.value},c.prototype.setValue=function(a){this.inputElement.value=a},c.prototype.setPattern=function(){},b.exports=c},{}],29:[function(a,b){"use strict";b.exports=function(a){return a=a||navigator.userAgent,-1!==a.indexOf("MSIE 9")}},{}],30:[function(a,b){"use strict";b.exports=function(a){var b=!1;return function(){b||(b=!0,a.apply(null,arguments))}}},{}],31:[function(a,b){"use strict";var c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},d=function(a,b){return a=a||"",null!=b&&"object"===("undefined"==typeof b?"undefined":c(b))&&g(b)&&(a+=-1===a.indexOf("?")?"?":"",a+=-1!==a.indexOf("=")?"&":"",a+=e(b)),a},e=function h(a,b){var d,e,g,i=[];for(g in a)a.hasOwnProperty(g)&&(e=a[g],d=b?f(a)?b+"[]":b+"["+g+"]":g,i.push("object"===("undefined"==typeof e?"undefined":c(e))?h(e,d):encodeURIComponent(d)+"="+encodeURIComponent(e)));return console.log("final query "+i.join("&")),i.join("&")},f=function(a){return a&&"object"===("undefined"==typeof a?"undefined":c(a))&&"number"==typeof a.length&&"[object Array]"===Object.prototype.toString.call(a)||!1},g=function(a){var b;for(b in a)if(a.hasOwnProperty(b))return!0;return!1};b.exports={querify:d,stringify:e}},{}],32:[function(a,b){"use strict";function c(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=16*Math.random()|0,c="x"===a?b:3&b|8;return c.toString(16)})}b.exports=c},{}],33:[function(a,b){(function(c){"use strict";var d=a("../libs/query-string.js"),e=c.XMLHttpRequest&&"withCredentials"in new c.XMLHttpRequest,f=a("./parse-body.js"),g=a("./prep-body.js"),h=function(){return e?new XMLHttpRequest:new XDomainRequest},i=function(a,b){console.log("XHR enabled ? "+e);var c,i,j=a.method,k=a.url,l=a.data,m=a.timeout,n=a.headers||{},o=h(),p=b;console.log("Request method: "+j),console.log("url is: "+k),"GET"===j&&(k=d.querify(k,l),l=null),e?o.onreadystatechange=function(){o.readyState===XMLHttpRequest.DONE&&(c=o.status,i=f(o.responseText),c>=400||200>c?(console.log("an error occured in http request "+c),p(i||"error",null,c||500)):(console.log(" a good response came back"),p(null,i,c)))}:(o.onload=function(){p(null,f(o.responseText),o.status)},o.onerror=function(){p("error",null,500)},o.onprogress=function(){},o.ontimeout=function(){p("timeout",null,-1)}),o.open(j,k,!0),o.timeout=m,e&&(o.setRequestHeader("Content-Type","application/json"),Object.keys(n).forEach(function(a){o.setRequestHeader(a,n[a])}));try{o.send(g(j,l))}catch(q){}};b.exports={request:i,queryString:d}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../libs/query-string.js":31,"./parse-body.js":38,"./prep-body.js":39}],34:[function(a,b){(function(a){"use strict";b.exports=function(){return a.navigator.userAgent}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],35:[function(a,b){(function(c){"use strict";var d,e=a("../libs/once.js"),f=a("./is-http.js"),g=a("./get-user-agent.js"),h=a("./ajax-driver.js"),i=a("./jsonp-driver.js"),j=function(){return null==d&&(console.log(c.navigator.userAgent),d=!(f()&&/MSIE\s(8|9)/.test(g()))),d};b.exports=function(a,b){b=e(b),a.method=(a.method||"GET").toUpperCase(),a.timeout=null==a.timeout?6e4:a.timeout,a.data=a.data||{},j()?(console.log("normal browser or IE"),h.request(a,b)):(console.log("use jsonp"),i.request(a,b))}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../libs/once.js":30,"./ajax-driver.js":33,"./get-user-agent.js":34,"./is-http.js":36,"./jsonp-driver.js":37}],36:[function(a,b){(function(a){"use strict";b.exports=function(){return"http:"===a.location.protocol}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],37:[function(a,b){(function(c){"use strict";var d,e=a("../libs/query-string.js"),f=a("../libs/uuid.js"),g={},h=function(a,b){var c,g="callback_json_"+f().replace(/-/g,""),h=a.url,l=a.data,m=a.method,n=a.timeout;h=e.querify(h,l),console.log("url after firs call "+h),h=e.querify(h,{_method:m,callback:g}),console.log("url for jsonp is "+h),c=i(h,g),console.log("script tag created "+JSON.stringify(c)),j(c,b,g),k(n,g),d||(d=document.getElementsByTagName("head")[0]),console.log("the head element "+JSON.stringify(d)+" "+JSON.stringify(d.childNodes)),d.appendChild(c)},i=function(a,b){var d=document.createElement("script"),e=!1;return d.src=a,d.async=!0,d.type="text/javascript",d.onerror=function(){c[b]({message:"error",status:500})},d.onload=d.onreadstatechange=function(){e||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState||(e=!0,d.onload=d.onreadstatechange=null)},d},j=function(a,b,d){c[d]=function(c){var e=c.status||500,f=null,h=null;console.log("response is back "+e),delete c.status,e>=400||200>e?f=c:h=c,l(d),m(a),clearTimeout(g[d]),b(f,h,e)}},k=function(a,b){g[b]=setTimeout(function(){console.log("times out"),g[b]=null,c[b]({error:"timeout",status:-1}),c[b]=function(){l(b)}},a)},l=function(a){try{delete c[a]}catch(b){c[a]=null}},m=function(a){a&&a.parentNode&&a.parentNode.removeChild(a)};b.exports={request:h}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../libs/query-string.js":31,"../libs/uuid.js":32}],38:[function(a,b){"use strict";b.exports=function(a){try{a=JSON.parse(a)}catch(b){}return a}},{}],39:[function(a,b){"use strict";b.exports=function(a,b){if("string"!=typeof a)throw new Error("method must be a string");return"get"!==a.toLowerCase()&&null!=b&&(b="string"==typeof b?b:JSON.stringify(b)),b}},{}],40:[function(a,b,c){(function(a){"use strict";!function(d,e){"object"==typeof c&&"undefined"!=typeof b?b.exports=e("undefined"==typeof a?d:a):"function"==typeof define&&define.amd?define([],function(){return e(d)}):d.framebus=e(d)}(this,function(a){function b(a){return null==a?!1:null==a.Window?!1:a.constructor!==a.Window?!1:(v.push(a),!0)}function c(a){var b,c={};for(b in u)u.hasOwnProperty(b)&&(c[b]=u[b]);return c._origin=a||"*",c}function d(a){var b,c,d=g(this);return h(a)?!1:h(d)?!1:(c=Array.prototype.slice.call(arguments,1),b=i(a,c,d),b===!1?!1:(p(t.top,b,d),!0))}function e(a,b){var c=g(this);return s(a,b,c)?!1:(w[c]=w[c]||{},w[c][a]=w[c][a]||[],w[c][a].push(b),!0)}function f(a,b){var c,d,e=g(this);if(s(a,b,e))return!1;if(d=w[e]&&w[e][a],!d)return!1;for(c=0;c<d.length;c++)if(d[c]===b)return d.splice(c,1),!0;return!1}function g(a){return a&&a._origin||"*"}function h(a){return"string"!=typeof a}function i(a,b,c){var d=!1,e={event:a,origin:c},f=b[b.length-1];"function"==typeof f&&(e.reply=r(f,c),b=b.slice(0,-1)),e.args=b;try{d=x+JSON.stringify(e)}catch(g){throw new Error("Could not stringify event: "+g.message)}return d}function j(a){var b,c,d,e;if(a.data.slice(0,x.length)!==x)return!1;try{b=JSON.parse(a.data.slice(x.length))}catch(f){return!1}return null!=b.reply&&(c=a.origin,d=a.source,e=b.reply,b.reply=function(a){var b=i(e,[a],c);return b===!1?!1:void d.postMessage(b,c)},b.args.push(b.reply)),b}function k(b){t||(t=b||a,t.addEventListener?t.addEventListener("message",m,!1):t.attachEvent?t.attachEvent("onmessage",m):null===t.onmessage?t.onmessage=m:t=null)}function l(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=16*Math.random()|0,c="x"===a?b:3&b|8;return c.toString(16)})}function m(a){var b;h(a.data)||(b=j(a),b&&(n("*",b.event,b.args,a),n(a.origin,b.event,b.args,a),q(a.data,b.origin,a.source)))}function n(a,b,c,d){var e;if(w[a]&&w[a][b])for(e=0;e<w[a][b].length;e++)w[a][b][e].apply(d,c)}function o(a){return a.top!==a?!1:null==a.opener?!1:a.opener===a?!1:a.opener.closed===!0?!1:!0}function p(a,b,c){var d;try{for(a.postMessage(b,c),o(a)&&p(a.opener.top,b,c),d=0;d<a.frames.length;d++)p(a.frames[d],b,c)}catch(e){}}function q(a,b,c){var d,e;for(d=v.length-1;d>=0;d--)e=v[d],e.closed===!0?v=v.slice(d,1):c!==e&&p(e.top,a,b)}function r(a,b){function c(e,f){a(e,f),u.target(b).unsubscribe(d,c)}var d=l();return u.target(b).subscribe(d,c),d}function s(a,b,c){return h(a)?!0:"function"!=typeof b?!0:h(c)?!0:!1}var t,u,v=[],w={},x="/*framebus*/";return k(),u={target:c,include:b,publish:d,pub:d,trigger:d,emit:d,subscribe:e,sub:e,on:e,unsubscribe:f,unsub:f,off:f}})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],41:[function(a,b){"use strict";var c=a("./lib/inject-stylesheet");b.exports={injectWithWhitelist:function(a,b){return c(a,b,!0)},injectWithBlacklist:function(a,b){return c(a,b,!1)}}},{"./lib/inject-stylesheet":44}],42:[function(a,b){"use strict";b.exports=function(a,b,c){function d(c){-1!==b.indexOf(c)&&(f[c]=a[c])}function e(c){-1===b.indexOf(c)&&(f[c]=a[c])}var f={};return Object.keys(a).forEach(c?d:e),f}},{}],43:[function(a,b){"use strict";function c(a){return String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function d(a){var b={};return a=a||{},Object.keys(a).forEach(function(d){var f=a[d],g=e.some(function(a){return a.test(f)});g||(b[d]=c(a[d]))}),b}var e=[/;/,/@import/i,/expression/i,/url/i,/javascript/i];b.exports=d},{}],44:[function(a,b){"use strict";function c(a){return/^@media\s+/i.test(a)}function d(a,b,e){var g,i,j=a+"{";return b=b||{},c(a)?Object.keys(b).forEach(function(a){f(a)&&(j+=d(a,b[a],e))}):(g=e(b),i=h(g),Object.keys(i).forEach(function(a){j+=a+":"+i[a]+";"})),j+="}"}function e(a,b,c){function e(a){return g(a,b,c)}var h,i=0,j=document.createElement("style");return document.querySelector("head").appendChild(j),h=j.sheet||j.styleSheet,a=a||{},b=b||[],Object.keys(a).forEach(function(b){var c;if(f(b)){c=d(b,a[b],e);try{h.insertRule?h.insertRule(c,i):h.addRule(b,c.replace(/^[^{]+/,"").replace(/{|}/g,""),i),i++}catch(g){if(!g instanceof SyntaxError)throw g}}}),j}var f=a("./validate-selector"),g=a("./filter-style-keys"),h=a("./filter-style-values");b.exports=e},{"./filter-style-keys":42,"./filter-style-values":43,"./validate-selector":45}],45:[function(a,b){"use strict";function c(a){return 0===a.trim().length?!1:/supports/i.test(a)?!1:/import/i.test(a)?!1:/\{|\}/.test(a)?!1:/</.test(a)?!1:!0}b.exports=c},{}]},{},[20]);