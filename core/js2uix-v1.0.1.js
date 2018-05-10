/** ------------------------------------------------------------------------------------- /
 * ModuleName  : zui-dom-control(js2uix-zui)
 * GitHub      : https://github.com/js2uix/js2uix-zui
 * Developer   : YJH-js2uix
 * Email       : deshineplus@icloud.com
 * language    : Javascript(ES5)
 * StartDate   : 2018.02.01
 * BuildDate   : 2018.05.10
 * Copyright   : YJH-js2uix
 * License     : Released under the MIT license
 * -------------------------------------------------------------------------------------- /
 * Information : Create Dom Control Module (html 의 dom 을 컨트롤 할 수 있는 모듈을 제작)
 *               단계적으로 아래와 같은 기능을 개발한다.
 *               1. ES5 를 이용한 Dom Select 및 Control 기능 구현.
 *               2. 간단한 Dom Select/Control 을 통해 기능 확장.
 *               3. 기본 기능 완료 후 javascript component 기능 추가.
 * -------------------------------------------------------------------------------------- */
(function( global, factory ){
    "use strict";
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory( global, true );
        if( !global.document ){
            module.exports = function(win) {
                if ( !win.document ) { throw new Error( "js2uix-zui is not support this browser!" ); }
                return factory(win);
            }
        }
    } else {
        factory( global );
    }
})( typeof window !== "undefined" ? window : this, function( window, noGlobal ){
    'use strict';
    var zui,
        ModuleName = 'js2uix',
        ModuleVersion = 'v1.0.1',
        D3ClassName = 'js2uix-d3',
        JS2UIX_DATA_KEY = 'js2uix-d3-chart';
    var DOC = window.document,
        SetProtoType = Object.setPrototypeOf,
        GetProtoType = Object.getPrototypeOf;
    var js2uixConstModule = function(){
        this.module = {};
        this.setModule = function(name, data){
            this.module[name] = data;
        };
        this.getModule = function(name){
            setTimeout(function(){
                delete this.module[name];
            }.bind(this), 1000);
            return this.module[name];
        };
        return {
            setModule : this.setModule.bind(this),
            getModule : this.getModule.bind(this)
        }
    };
    var js2uixNewArrayNode = function (arg){
        var i, j;
        var item = [];
        for ( i = 0; i < arg.length; i++ ){
            if( arg[i].name === ModuleName ){
                for( j = 0; j < arg[i].length; j++ ){
                    item.push(arg[i][j]);
                }
            } else if ( arg[i].nodeType ){
                item.push(arg[i])
            } else if ( typeof arg[i] === 'string' ){
                var isString = arg[i];
                var checkContent =  js2uixCheckValidation(isString);
                if( checkContent.tagType && checkContent.tagType.length > 0 ){
                    isString = zui(isString)[0];
                } else {
                    isString = DOC.createTextNode(isString);
                }
                item.push(isString);
            }
        }
        return item;
    };
    var js2uixCheckValidation = function (select){
        var isEmptyString = select.replace(/\s/gi, "");
        var isIdOrClassType = isEmptyString.match(/^#|^\./gi);
        var isTagStringType = select.match(/(<([^>]+)>)/gi);
        var isSpStringType = select.match(/[`~!@#$%^&*|\\\'\";:\/?]/gi);
        if( isIdOrClassType && isSpStringType ){
            var selectArray = select.split(' ');
            for( var i = 0; i < selectArray.length; i++ ){
                var reCheck = selectArray[i].match(/[`~!@#$%^&*|\\\'\";:\/?]/gi);
                if(!reCheck || reCheck.length > 1){ isIdOrClassType = null; }
            }
        }
        return {
            full : isEmptyString,
            idClass : isIdOrClassType,
            tagType : isTagStringType,
            spType : isSpStringType
        }
    };
    var js2uixUniqueId = function(){
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        var randomString = '';
        for (var i=0; i<string_length; i++) {
            var num = Math.floor(Math.random() * chars.length);
            randomString += chars.substring(num,num+1);
        }
        var dateString = String(Date.now()).substring(0,4);
        return dateString+randomString;
    };
    /** --------------------------------------------------------------- */
    /** zui-control create object ( zui control 을 정의한다 )
     * TODO : 가장 기본적인 기능을 먼저 활성화 하며, 추후 ui 기능을 확장한다.
     * info : NodeList 객체를 새롭게 해석하여 module 화 한다.
     *       새로운 Node 객체를 만들고 기능을 확장/상속 시킨다.
     * */
    /** --------------------------------------------------------------- */
    /** TODO : extend prototype, 상속을 구현한다.
     * Object.setPrototypeOf 기본 사용 / 불가능 : __proto__ 를 이용하여 상속.
     * */
    zui = function (select){return new zui.fx.init(select);};
    zui.fx = zui.prototype = {
        zui : ModuleVersion,
        constructor : zui,
        query : function ( select, result ){
            var argArray = Array.prototype.slice.call(arguments);
            var newNode = zui.extend([], argArray.shift());
            newNode.name = ModuleName;
            if ( SetProtoType ){
                newNode = SetProtoType( newNode, GetProtoType( result ) );
            } else {
                newNode.__proto__ = GetProtoType( result );
            }
            for (var i=0; i < newNode.length; i++ ){
                if ( !newNode[i][ModuleName] ){
                    newNode[i][ModuleName] = { events : {}, data : {} };
                }
            }
            return newNode;
        }
    };
    zui.fx.init = function (select){
        if ( !select ) { return this; }
        /** TODO : Dom Query
         * ES5 를 이용한 Dom Query Select 를 구현한다.
         * 예외처리를 통해 Error 상황에 대응한다.
         * */
        if ( typeof select === 'string' ){
            // TODO : id or class 타입의 string - 보완 필요
            var tagName;
            var virtualDom;
            var isType = js2uixCheckValidation(select);
            var isString = isType.full;
            var isIdOrClassType = isType.idClass;
            var isTagStringType = isType.tagType;
            var isSpecialType = isType.spType;
            if ( isString ){
                if ( isString.length > 1 && (isIdOrClassType && isIdOrClassType.length > 0) ){
                    select = DOC.querySelectorAll( select );
                } else if ( !isIdOrClassType && (isTagStringType && isTagStringType.length > 0) ){
                    tagName = isTagStringType[0].replace(/^<(.+?)>/g, function(match, key) { return key; });
                    if( isTagStringType.length === 1 && tagName.indexOf('input') < 0 ){
                        select = [DOC.createElement( tagName )];
                    } else {
                        virtualDom = DOC.createElement( ModuleName );
                        virtualDom.innerHTML = select;
                        select = [virtualDom.firstChild];
                    }
                } else if ( !isIdOrClassType && !isSpecialType && !isTagStringType ){
                    select = DOC.querySelectorAll( select );
                } else if ( !isIdOrClassType && isString.length > 1 && (isSpecialType.indexOf('.') !== -1 || isSpecialType.indexOf('#') !== -1) ){
                    select = DOC.querySelectorAll( select );
                } else {
                    select = [DOC.createTextNode( select )];
                }
            }
        } else {
            if ( select.nodeType ){
                select = [select];
            } else if ( select['name'] && select['name'] === ModuleName ){
                return select;
            } else if ( typeof select === 'function' ){
                return zui.loaded( this, select );
            } else if ( select === window ){
                select = [window];
            }
        }
        return zui.fx.query( select, this );
    };
    zui.fx.init.prototype = zui.fx;
    zui.extend = zui.fx.extend = function (){
        var arg = arguments;
        var target = arg[0] || {};
        var object;
        var length = arg.length;
        var i = 1;
        target = ( typeof target !== 'object' && typeof target !== 'function')?{}:target;
        if ( i === length ) {
            target = this;
            i--;
        }
        for (; i < length; i++) {
            object = arg[i];
            if( !object ){
                continue;
            }
            for ( var key in object ) {
                if ( object.hasOwnProperty(key) ){
                    target[key] = object[key];
                }
            }
        }
        return target;
    };
    zui.extend({
        typeIs : function ( object ){
            var result;
            if ( object === null ) {
                result = object + "";
            } else {
                if ( typeof object === 'object' || typeof object === 'function' ){
                    if( Array.isArray(object) ){
                        result = 'array';
                    } else if ( typeof object === 'function' ){
                        result = 'function';
                    } else {
                        result = 'object';
                    }
                } else {
                    result = typeof object;
                }
            }
            return result;
        },
        isArray : function ( object ){
            var typeIs = zui.typeIs( object );
            var lengthIs = !!object && 'length' in object && object.length;
            if( object != null && object === object.window || typeIs === 'function' ){ return false; }
            return !!(typeIs === 'array' || lengthIs === 0 || typeIs === 'number' && lengthIs > 0 && ( lengthIs - 1 ) in object);
        },
        isFunction : function ( object ){
            return typeof object === 'function';
        },
        isString : function ( string ){
            return typeof string === 'string';
        },
        isNumber : function ( number ){
            return typeof number === 'number';
        }
    });
    /** --------------------------------------------------------------- */
    /** TODO : 추가적인 기능을 확장한다
     * 추가기능은 단계적으로 control 에 필요한 기능을 추가한다.
     * */
    /** --------------------------------------------------------------- */
    /** js2uix-control-attribute method */
    zui.extend({
        /** control attribute[id] name */
        addId : function ( item, name ){
            if( item && name && typeof name === 'string' ){
                item.id = name;
            }
        },
        removeId : function ( item, name ){
            if ( item && name && typeof name === 'string' ){
                item.id = '';
            }
        },
        hasId : function ( item, name ){
            var result = false;
            if( item && name && typeof name === 'string' ){
                if( item.id === name ){
                    result = true;
                }
            }
            return result;
        },
        /** control attribute[class] name */
        addClass : function ( item, name ){
            if( item && name && typeof name === 'string' ){
                name = name.split(' ');
                if( name.length > 0 ){
                    for (var i=0; i<name.length; i++ ){
                        if ( item.classList ){
                            item.classList.add( name[i] );
                        } else {
                            item.className += ' '+name;
                        }
                    }
                }
            }
        },
        removeClass : function ( item, name ){
            if( item && name && typeof name === 'string' ){
                if (item.classList){
                    item.classList.remove(name);
                } else {
                    item.className = item.className.replace(new RegExp('(^|\\b)' + name.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                }
            }
        },
        hasClass : function ( item, name ){
            var result = false;
            if( item && name && typeof name === 'string' ){
                if ( item.classList ){
                    result = item.classList.contains(name);
                } else {
                    result = new RegExp('(^| )' + name + '( |$)', 'gi').test(item.className);
                }
            }
            return result;
        },
        /** control attribute[*] name */
        addAttr : function ( item, name, value ){
            if( item && name && value && typeof name === 'string' && typeof value === 'string' ){
                item.setAttribute(name, value);
            } else if( typeof name === 'object'){
                for ( var key in name ){
                    item.setAttribute(key, name[key]);
                }
            }
        },
        removeAttr : function ( item, name ){
            if( item && name && typeof name === 'string' ){
                item.removeAttribute(name);
            }
        },
        getAttr : function ( item, name ){
            if( item ){
                if ( name && typeof name === 'string' ){
                    return item.getAttribute(name) || undefined;
                } else if ( !name ) {
                    return item.attributes;
                }
            }
        }
    });
    zui.fx.extend({
        /** control attribute[id] name */
        addId : function ( name ){
            zui.addId( this[0], name );
            return this;
        },
        removeId : function ( name ){
            zui.removeId( this[0], name );
            return this;
        },
        hasId : function ( name ){
            return zui.hasId( this[0], name );
        },
        /** control attribute[class] name */
        addClass : function ( name ){
            for( var i=0; i < this.length; i++ ){
                zui.addClass( this[i], name );
            }
            return this;
        },
        removeClass : function ( name ){
            for( var i=0; i < this.length; i++ ){
                zui.removeId( this[i], name );
            }
            return this;
        },
        hasClass : function ( name ){
            return zui.hasClass( this[0], name );
        },
        /** control attribute[*] name */
        addAttr : function ( name, value ){
            for ( var i=0; i < this.length; i++ ){
                zui.addAttr(this[i], name, value);
            }
            return this;
        },
        removeAttr : function ( name ){
            for ( var i=0; i < this.length; i++ ){
                zui.removeAttr(this[i], name);
            }
            return this;
        },
        getAttr : function ( name ){
            if( this.length === 0 ){ return undefined; }
            return zui.getAttr(this[0], name);
        }
    });
    /** --------------------------------------------------------------- */
    /** js2uix-control-basic method */
    zui.extend({
        loop : function ( item, callback ){
            var length, i = 0;
            if ( zui.isArray( item ) ) {
                length = item.length;
                for (; i < length; i++ ) {
                    if ( callback.call( item[i], i, item[i] ) === false ) {
                        break;
                    }
                }
            } else {
                for ( i in item ) {
                    if ( callback.call( item[i], i, item[i] ) === false ) {
                        break;
                    }
                }
            }
            return item;
        },
        map : function( obj, callback ){
            var length, i = 0, newObject = !zui.isArray(obj)?{}:[];
            zui.extend(newObject, obj, true);
            if ( zui.isArray( obj ) ) {
                length = obj.length;
                for (; i < length; i++ ) {
                    if( typeof callback(i, obj[i]) !== 'undefined'  ){
                        newObject[i] = callback(i, obj[i]);
                    }
                }
            } else {
                for ( i in obj ) {
                    if( typeof callback(i, obj[i]) !== 'undefined' ){
                        newObject[i] = callback(i, obj[i]);
                    }
                }
            }
            return newObject;
        },
        loaded : function ( item, callback ){
            var allowDom = ['document','window','html','body'];
            if( typeof item === "object" && ( item.hasOwnProperty('name') && item.name === ModuleName && allowDom.indexOf(item[0].nodeName.toLowerCase()) === -1 ) ){
                item = item[item.length-1];
                callback = callback.bind(item);
            }
            if (DOC.attachEvent ? DOC.readyState === "complete" : DOC.readyState !== "loading"){
                callback();
            } else {
                DOC.addEventListener('DOMContentLoaded', callback);
            }
            return zui(item);
        },
        createDom : function(){
            var dom;
            var zuiDom;
            var arg = arguments;
            var tagType = arg[0];
            var options = arg[1];
            var zuiObject = arg[2];
            if( tagType && typeof tagType === 'string' ){
                dom = DOC.createElement(tagType);
                zuiDom = zui(dom);
                if( options && typeof options === 'object' ){
                    for( var name in options ){
                        var item = options[name];
                        if ( name === 'className' ){
                            zui.addClass(dom, item);
                        }
                        if ( name === 'idName' ){
                            zui.addId(dom, item);
                        }
                        if ( name === 'attributes' && typeof item === 'object' ){
                            for ( var attr in item ){
                                zui.addAttr(dom, attr, item[attr]);
                            }
                        }
                        if ( name === 'styles' && typeof item === 'object' ){
                            zuiDom.css(item);
                        }
                        if ( name === 'content' ){
                            zuiDom.html(item);
                        }
                    }
                }
            }
            return (typeof Boolean(zuiObject) && zuiObject)?zui(dom):dom;
        },
        uiComponent : new js2uixConstModule()
    });
    zui.fx.extend({
        /** control basic method - utility */
        loop : function ( callback ){
            return zui.loop( this, callback );
        },
        loaded : function ( callback ){
            if ( callback && typeof callback === 'function' ){
                zui.loaded( this, callback );
            }
        },
        /** control basic query - dom select */
        find : function ( name ){
            var result = [];
            if( name && typeof name === 'string' ){
                result = this[0].querySelectorAll(name);
            }
            return zui(result);
        },
        parent : function ( name ){
            var result = [];
            if( name && typeof name === 'string' ){
                var parent;
                var parents = this[0].parentNode.parentNode;
                if( parents ){
                    parent = parents.querySelectorAll(name);
                    for ( var i=0; i < parent.length; i++ ){
                        if( this[0].parentNode === parent[i] ){
                            result.push(parent[i]);
                        }
                    }
                }
            } else {
                result = this[0].parentNode;
            }
            return zui(result);
        },
        parents : function ( name ){
            var result = [];
            if( name && typeof name === 'string'){
                var parent = this[0].parentNode;
                var isIdOrClassType = name.match(/^#|^\./gi);
                if( isIdOrClassType ){
                    while ( parent && parent.nodeName.toLowerCase() !== 'html' ){
                        var findName = name.substr(1, name.length);
                        if( zui.hasClass(parent, findName) || zui.hasId(parent, findName) ){
                            result = parent;
                            break;
                        } else {
                            parent = parent.parentNode;
                        }
                    }
                }
            }
            return zui(result);
        },
        hasParents : function ( name ){
            var result = false;
            if( name && typeof name === 'string'){
                var parent = this[0].parentNode;
                var isIdOrClassType = name.match(/^#|^\./gi);
                if( isIdOrClassType ){
                    while ( parent && parent.nodeName.toLowerCase() !== 'html' ){
                        var findName = name.substr(1, name.length);
                        if( zui.hasClass(parent, findName) || zui.hasId(parent, findName) ){
                            result = true;
                            break;
                        } else {
                            parent = parent.parentNode;
                        }
                    }
                }
            }
            return result;
        },
        children : function ( name ){
            var i;
            var result = [];
            var children = this[0].children;
            if( name && typeof name === 'string' ){
                var findName = name.substr(1, name.length);
                for (i = 0; i < children.length; i++ ){
                    if( zui.hasClass(children[i], findName) || zui.hasId(children[i], findName) ){
                        result.push(children[i]);
                    }
                }
            } else if ( !name ) {
                for (i = 0; i < children.length; i++ ){
                    result.push(children[i]);
                }
            }
            return zui(result);
        },
        hasChild : function ( name ){
            return this.find(name).length > 0 && name && typeof name === 'string';
        },
        nextNode : function (){
            return this[0].nextElementSibling?zui(this[0].nextElementSibling):undefined;
        },
        prevNode : function (){
            return this[0].previousElementSibling?zui(this[0].previousElementSibling):undefined;
        },
        firstNode : function (){
            return (this.length < 2)?this:zui(this[0]);
        },
        lastINode : function (){
            return (this.length < 2)?this:zui(this[this.length-1]);
        },
        /** control basic method - dom change */
        append : function (){
            var arg = arguments;
            if( arg.length > 0 ){
                var i;
                var item = js2uixNewArrayNode(arg);
                for ( i = 0; i < item.length; i++ ){
                    this[0].appendChild(item[i]);
                }
            }
            return this;
        },
        prepend : function (){
            var arg = arguments;
            if( arg.length > 0 ){
                var i;
                var firstChild;
                var item = js2uixNewArrayNode(arg);
                for ( i = 0; i < item.length; i++ ){
                    firstChild = this[0].firstChild;
                    if( firstChild ){
                        this[0].insertBefore(item[i], firstChild);
                    } else {
                        this[0].appendChild(item[i]);
                    }
                }
            }
            return this;
        },
        after : function (){
            var arg = arguments;
            if( arg.length > 0 ){
                var i;
                var parent = this[0].parentNode;
                var item = js2uixNewArrayNode(arg);
                var sibling =this[0].nextSibling;
                for ( i = 0; i < item.length; i++ ){
                    if( sibling ){
                        parent.insertBefore(item[i], sibling);
                    } else {
                        parent.appendChild(item[i]);
                    }
                    sibling = (sibling)?sibling.nextSibling:null;
                }
            }
            return this;
        },
        before : function (){
            var arg = arguments;
            if( arg.length > 0 ){
                var i;
                var parent = this[0].parentNode;
                var item = js2uixNewArrayNode(arg);
                for ( i = 0; i < item.length; i++ ){
                    parent.insertBefore(item[i], this[0]);
                }
            }
            return this;
        },
        html : function ( value ){
            for( var i = 0; i < this.length; i++ ){ this[i].innerHTML = ''; }
            if( value ){
                this.append( value );
            }
            return this;
        },
        empty : function (){
            this.html();
        },
        replace : function ( item ){
            var result = this;
            var target = this[0];
            var parent = target.parentNode;
            if( item && ( typeof item === 'string' || typeof item === 'object') ){
                if ( typeof item === 'string' ){
                    var stringType = js2uixCheckValidation(item);
                    if( stringType.idClass || stringType.spType || stringType.tagType ){
                        result = zui(item);
                    } else {
                        result = zui(DOC.createTextNode(item));
                    }
                } else {
                    if ( item.name && item.name === ModuleName ){
                        result = item;
                    } else if ( item.nodeName ){
                        result = zui[item];
                    }
                }
                zui(target).after(result);
                parent.removeChild(target);
            }
            return result;
        },
        remove : function (){
            for ( var i = this.length-1; i >= 0; i-- ){
                var current = this[i];
                if( current ){
                    var parent = this[i].parentNode;
                    if( parent ){
                        parent.removeChild( current );
                    }
                }
            }
        }
    });
    /** --------------------------------------------------------------- */
    /** js2uix-control-style method */
    var js2uixDomStyleParse = function (name, value){
        var i;
        var type;
        var styleObject;
        var styleName = "";
        var strArray = (name.replace(/^-/gi,"")).split("-");
        for(i = 0; i<strArray.length; i++){
            if( i === 0 ){
                styleName += strArray[i];
            } else {
                styleName += strArray[i].charAt(0).toUpperCase() + strArray[i].slice(1)
            }
        }
        if( styleName !== "zIndex" && styleName !== "opacity" && !isNaN(parseInt(value)) ){
            type = (typeof value === 'string' && value.indexOf('%') !== -1)?'%':'px';
            value = parseInt(value)+type;
        }
        styleObject = [styleName,value];
        try {
            return styleObject;
        } finally {
            styleObject = null;
            styleName = null;
            strArray = null;
        }
    };
    var js2uixDomStyleApply = function (item, name, value){
        if( value === 0 || typeof value === 'number' ){
            item.css(name, value);
            return this;
        } else if ( !value || value === null ){
            return item.css(name);
        }
    };
    zui.fx.extend({
        css : function (){
            var arg = arguments;
            var length = arg.length;
            if( arg && length > 0 && length <= 2 ){
                var styleObject = [];
                if ( length === 1 && typeof arg[0] === 'string' ){
                    if ( this[0] !== DOC && this[0] !== window  ){
                        var getValue = window.getComputedStyle(this[0] ,null).getPropertyValue(arg[0]) || this[0].style[arg[0]];
                        return isNaN(parseInt(getValue))?getValue:parseInt(getValue);
                    }
                } else if ( length === 1 && typeof arg[0] === 'object' ){
                    for ( var name in arg[0] ){
                        styleObject.push( js2uixDomStyleParse(name, arg[0][name]) );
                    }
                } else if ( length === 2 && typeof arg[0] === 'string' && (typeof arg[1] === "string" || typeof arg[1] === "number") ){
                    styleObject.push( js2uixDomStyleParse(arg[0], arg[1]) );
                }
                for( var i = 0; i < this.length; i++ ){
                    for( var j = 0; j <styleObject.length; j++ ){
                        this[i].style[styleObject[j][0]] = styleObject[j][1];
                    }
                }
            }
            return this;
        },
        top : function (value){
            return js2uixDomStyleApply(this, 'top', value);
        },
        left : function (value){
            return js2uixDomStyleApply(this, 'left', value);
        },
        width : function (value){
            return js2uixDomStyleApply(this, 'width', value);
        },
        height : function (value){
            return js2uixDomStyleApply(this, 'height', value);
        },
        offset : function () {
            if ( !this[0] ) {return;}
            var rectInfo = this[0].getBoundingClientRect();
            var result = {
                x : rectInfo.x,
                y : rectInfo.y,
                top : rectInfo.top,
                bottom : rectInfo.bottom,
                left : rectInfo.left,
                right : rectInfo.right,
                width : rectInfo.width,
                height : rectInfo.height,
                paddingL : this.css('padding-left'),
                paddingR : this.css('padding-right'),
                paddingT : this.css('padding-top'),
                paddingB : this.css('padding-bottom')
            };
            return (!this[0].getClientRects().length)?undefined:result;
        }
    });
    /** --------------------------------------------------------------- */
    /** js2uix-control-event method */
    var js2uixFxAddEventHandler = function (item, param){
        var eventNameArray = param[0].split('.');
        var eventKeyName = eventNameArray[1];
        zui.loop(item, function(){
            var eventName = eventNameArray[0];
            if ( !this[ModuleName]['events'][eventName] ) {
                this[ModuleName]['events'][eventName] = [];
            }
            this.addEventListener(eventNameArray[0], param[param.length-1], false);
            this[ModuleName]['events'][eventName].push({
                eventName : eventName,
                eventKey : eventKeyName || null,
                handler : param[param.length-1]
            });
        });
    };
    var js2uixFxRemoveEventHandler = function (item, param){
        /** document node event remove */
        zui.loop(item, function(){
            var key;
            var i;
            var eventData = this[ModuleName]['events'];
            if( !param ){
                for ( key in eventData ){
                    for ( i = 0; i < eventData[key].length; i++ ){
                        this.removeEventListener(key, eventData[key][i]['handler']);
                        eventData[key][i]['removed'] = true;
                    }
                }
            } else {
                var crtEvent;
                var length = param.length;
                var first = param[0];
                var last = param[param.length-1];
                var eventNameArray = param[0].split('.');
                var eventName = eventNameArray[0];
                var eventKeyName = eventNameArray[1] || null;
                if ( length === 1 && typeof first === 'string' ){
                    for( i = 0; i < eventData[eventName].length; i++ ){
                        crtEvent = eventData[eventName][i];
                        if( crtEvent.eventKey === eventKeyName ){
                            this.removeEventListener(eventName, eventData[eventName][i]['handler']);
                            eventData[eventName][i]['removed'] = true;
                        }
                    }
                } else if ( length === 2 && typeof first === 'string' && (typeof last === 'function' || typeof last === 'object') ){
                    for( i = 0; i < eventData[eventName].length; i++ ){
                        crtEvent = eventData[eventName][i];
                        if( crtEvent.eventKey === eventKeyName && last === eventData[eventName][i]['handler'] ){
                            this.removeEventListener(eventName, eventData[eventName][i]['handler']);
                            eventData[eventName][i]['removed'] = true;
                        }
                    }
                }
            }
        });
        /** module node event remove */
        zui.loop(item, function(){
            var key;
            var i;
            var eventData = this[ModuleName]['events'];
            for (key in eventData) {
                for (i = eventData[key].length-1; i >= 0; i--) {
                    if( eventData[key][i]['removed'] ){
                        eventData[key].splice(i,1);
                    }
                }
            }
        });
    };
    zui.fx.extend({
        addEvent : function (){
            var arg = arguments;
            var length = arg.length;
            if ( length > 0 ){
                var firstType = typeof arg[0];
                var lastType = typeof arg[arg.length-1];
                if ( firstType === 'object' ){
                    for ( var name in arg[0] ){
                        js2uixFxAddEventHandler(this, [name, arg[0][name]]);
                    }
                } else {
                    if( firstType === 'string' && (lastType === 'function' || lastType === 'object') ){
                        if( length === 2 ){
                            js2uixFxAddEventHandler(this, arg);
                        } else if ( length === 3 ){
                            /** TODO : 개발 예정
                             * MutationObserver or Observe 를 사용해야 하지만
                             * DOM3 이기 때문에 개발 여부는 나중에 결정.
                             * 이벤트 개발은 직접적으로 생성된 DOM에 대한 이벤트 Bind 를 최종 목표로 한다.
                             * */
                        }
                    }
                }
            }
        },
        removeEvent : function (){
            var arg = arguments;
            var length = arg.length;
            if( length < 1 ){
                js2uixFxRemoveEventHandler(this);
            } else {
                js2uixFxRemoveEventHandler(this, arg);
            }
        }
    });
    /** --------------------------------------------------------------- */
    /** js2uix-ajax method
     * TODO : xhr 을 이용한 ajax 통신 구현
     * */
    var js2uixAjax = function(form, option){
        this._target = form;
        this._onceMemory = {
            success : null,
            error : false
        };
        this._init(this._target, option);
    };
    js2uixAjax.prototype = {
        _xhr : function() {
            try {
                return new window.XMLHttpRequest();
            } catch ( e ) {
                /** error */
                throw error;
            }
        },
        _setDataType : function(option){
            var checkUrl = option['url'].split(".");
            var matchType = /xml|html|json|js|jsp|asp|php|txt/gi;
            var type = checkUrl[checkUrl.length-1];
            var result = type.match(matchType);
            if ( !result[0] ){
                return 'text';
            }
            if ( result[0] && result[0] !== option.dataType ){
                if( result[0] === 'js' ){result[0] = 'script';}
                return result[0];
            }
            return undefined;
        },
        _getOptionObject : function(form, option){
            var opts_obj = {
                url   : document.location.href,
                method  : 'POST',
                data  : null,
                async : true,
                cache : true,
                success : null,
                error : null,
                upload : false,
                jsonParse : true,
                dataType : 'json',
                contentType: "application/x-www-form-urlencoded; charset=UTF-8"
            };
            opts_obj = zui.extend(opts_obj, option);
            opts_obj.dataType = this._setDataType( option ) || opts_obj.dataType;
            if( form ){
                opts_obj.type = 'POST';
                opts_obj.upload = true;
                opts_obj.url = opts_obj.url+'?upload'
            }
            if( option.cache === false ){
                var querySplit = '?';
                if( option.url.indexOf("?") !== -1 ){querySplit = '&';}
                option.url = option.url+querySplit+"cache"+Date.now();
            }
            return opts_obj;
        },
        _getQueryString : function(data){
            var result =[];
            if( typeof data === 'object' ){
                zui.loop(data, function(key, value){
                    result.push(key+"="+value)
                });
            }
            return result.join("&");
        },
        _setUploadHandler : function(request, option){
            request.upload.addEventListener('progress', function(event) {
                var percent = 0;
                var position = event.loaded || event.position;
                var total = event.total;
                if (event.lengthComputable) {
                    percent = Math.ceil(position / total * 100);
                }
                if( option.progress && typeof option.progress == "function" ){
                    option.progress(percent);
                }
            }, false);
        },
        _setJsonParseData : function(option, value){
            var returnValue = value;
            var dataType = option.dataType;
            if( dataType === 'script' ){
                var script = document.createElement("script");
                script.type = 'text/javascript';
                script.text = returnValue;
                document.head.appendChild(script).parentNode.removeChild(script);
                returnValue = script.text;
            } else if ( dataType === 'xml' ||  dataType === 'html' ){
                var parser = new DOMParser();
                returnValue = parser.parseFromString( returnValue,"text/"+dataType );
            } else if ( dataType === 'text' || dataType === 'txt' ){
                return returnValue;
            } else {
                returnValue = option.jsonParse ? JSON.parse(returnValue) || returnValue : returnValue
            }
            return returnValue;
        },
        _loadAjaxRequest : function(option, dataQuery){
            var _module = this;
            var request = this._xhr();

            /** ajax request set */
            request.open( option.method, option.url, option.async);

            /** ajax content type set */
            if( option.data && !option.upload){
                request.setRequestHeader("Content-type", option.contentType);
            }

            /** ajax uploadMode type set */
            if ( request.upload && option.upload ) {
                this._setUploadHandler(request, option);
            }

            /** ajax onLoad set */
            request.onload = function(evt) {
                if ( (request.status >= 200 && request.status < 400) && request.readyState == 4 ) {
                    var returnValue = request.responseText;
                    if( option.success && typeof option.success === "function" ){
                        returnValue = _module._setJsonParseData(option, returnValue);
                        option.success(returnValue, request.responseText, request);
                        _module._onceMemory.error = false;
                        _module._onceMemory.success = {
                            value : returnValue,
                            responseText : request.responseText,
                            request : request
                        };
                    }
                } else {
                    if( option.error && typeof option.success == "function" ){
                        option.error();
                        _module._onceMemory.error = true;
                        _module._onceMemory.success = null;
                    }
                }
            };

            /** ajax onError set */
            request.onerror = function() {
                if( option.error && typeof option.success == "function" ){
                    option.error();
                    _module._onceMemory.error = true;
                    _module._onceMemory.success = null;
                }
            };

            /** ajax send set */
            request.send(dataQuery);
        },
        _setAjaxData : function(form, option){
            var dataQuery; option = this._getOptionObject(form, option);
            if( form ){
                var inputFile = form[0].querySelectorAll('input[type=file]');
                var etcForms = form.find("*").not('input[type=file]');
                var appendNum = 0;
                form.attr("enctype", "multipart/form-data");
                dataQuery = new FormData();
                zui.loop(inputFile, function(){
                    var files = this.files;
                    zui.loop(files, function(key, value) {
                        dataQuery.append(key, value);
                        appendNum++;
                    });
                });
                zui.loop(etcForms, function(){
                    dataQuery.append(this.name, this.value);
                    appendNum++;
                });
                if( appendNum === 0 ){ return false; }
            }
            if( !form ){
                dataQuery = this._getQueryString(option.data);
            }
            this._loadAjaxRequest(option, dataQuery);
        },
        _init : function(form, option){
            if( form && (!form[0] || form[0].nodeName.toLowerCase() !== 'form') ){
                return false;
            }
            this._setAjaxData(form, option);
        },
        done : function(fnc){
            if( typeof fnc === 'function' && !this._onceMemory.error ){
                var callback = this._onceMemory.success;
                try {
                    fnc(callback.value, callback.responseText, callback.request);
                } finally {
                    callback = null;
                    this._onceMemory.success = null;
                }
            }
        },
        fail : function(fnc){
            if( typeof fnc === 'function' && this._onceMemory.success.length === 0 ){
                try {
                    fnc();
                } finally {
                    this._onceMemory.error = false;
                }
            }
        }
    };
    js2uixAjax.prototype.constructor = js2uixAjax;
    /** --------------------------------------------------------------- */
    /** js2uix-component method */
    var js2uixRouter = function(){
        this.location = null;
        this.hash = null;
        this.router = {};
        this.setRouter = function(){
            var arg = arguments;
            var url = (arg.length > 1)?arg[0]:null;
            var data = (arg.length > 1)?arg[1]:null;
            if( arg.length === 1 ){
                url = '/all';
                data = arg[0];
            }
            if( url ){
                if( url.indexOf('/') === 0 ){
                    var parseUrl = url.substr(1, url.length-1);
                    var routerName = (!parseUrl)?'index':parseUrl;
                    this.router[routerName] = data;
                }
            }
        };
        this.getHash = function(){
            var location = this.location = window.location;
            var searchPage = location.hash;
            var hashName = 'index';
            if( searchPage ){
                if( searchPage.indexOf('#') === 0 ){
                    hashName = searchPage.substr(2,searchPage.length-1);
                }
            }
            this.hash = hashName;
            return hashName;
        };
        this.checkRouter = function(){
            var urlString = this.getHash();
            var result = {
                location : this.location,
                urlString : this.hash
            };
            if( typeof this.router['all'] === 'function' ){
                this.router['all'](result);
            }
            if( typeof this.router[urlString] === 'function' ){
                this.router[urlString](result);
            }
        };
        this.setControl = function(){
            window.addEventListener('load', this.checkRouter.bind(this));
            window.addEventListener('hashchange', this.checkRouter.bind(this));
        };
        this.init = function(){
            this.getHash();
            this.setControl();
        };
        this.init();
        return {
            on : this.setRouter.bind(this)
        }
    };
    var js2uixComponent = function (obj){
        this.state = {};
        this.props = {};
        this.domState = {
            parent : null,
            render : null,
            virtual : null,
            isMount : false,
            uniqueId : Date.now()
        };
        if ( obj.super ){
            obj.super.call(this);
        }
        Object.defineProperty(this, 'state', {writable : false});
    };
    js2uixComponent.prototype = {
        setState : function (state, value){
            if (state && typeof state === 'object' && !Array.isArray(state)){
                zui.loop(state, function(name, value){
                    this.state[name] = value;
                }.bind(this));
            } else if (state && value && typeof state === 'string'){
                this.state[state] = value;
            }
            this.setUpdateState();
        },
        setUpdateState : function (){
            /** TODO : 추가적인 개발 필요 */
            this.setRender();
            if (typeof this.onStateWillChange === 'function' ){
                this.onStateWillChange();
            }
        },
        setProps : function (props){
            if (props && typeof props === 'object' && !Array.isArray(props)){
                zui.loop(props, function(name, value){
                    this.props[name] = value;
                }.bind(this));
            }
            if (typeof this.onPropsWillChange === 'function'){
                this.onPropsWillChange();
            }
        },
        setPropsState : function (props){
            this.setProps(props);
            return this.setRender(props);
        },
        setRender : function (){
            if (this.render && typeof this.render === 'function' ){
                var renderDom = zui(this.render());
                this.setForceUpdate(renderDom);
                if (renderDom && this.domState.virtual){
                    return {
                        $$Dom : this.domState.virtual,
                        props : this.setPropsState.bind(this),
                        setRenderState : this.setRenderState.bind(this)
                    }
                }
            }
        },
        setRenderState : function (param){
            zui.loop(param, function(name, value){
                this.domState[name] = value;
            }.bind(this));
        },
        /** TODO : component 기능 임시 모듈 */
        setForceUpdate : function (isRenderObject){
            if (this.render && typeof this.render === 'function'){
                if (isRenderObject && isRenderObject[0]){
                    isRenderObject[0][ModuleName]['componentId'] = ModuleName+this.domState.uniqueId;
                    this.domState.virtual = isRenderObject[0];
                    if (!this.domState.render){ this.domState.render = isRenderObject[0]; }
                    if (this.domState.isMount){
                        var current = this.domState.render;
                        var virtual = this.domState.virtual;
                        var removeNode = function (parent, targetNode){
                            if (targetNode){
                                parent.removeChild(targetNode);
                            }
                        };
                        var insertBeforeNode = function (parent, newNode, beforeNode){
                            parent.insertBefore(newNode, beforeNode);
                        };
                        var insertRemoveNode = function (parent, maxChild, minChild, addNodeType){
                            var findWillRemoveNode = [];
                            zui.loop(maxChild, function(num){
                                var copy;
                                var targetNode = minChild[num];
                                if (!targetNode){
                                    if (addNodeType){
                                        copy = this.cloneNode(true);
                                        this.parentNode.insertBefore(copy, this);
                                        insertBeforeNode(parent, this, targetNode);
                                    } else {
                                        findWillRemoveNode.push(this);
                                    }
                                } else {
                                    var vName = this.nodeName;
                                    var vType = this.nodeType;
                                    var rName = targetNode.nodeName;
                                    var rType = targetNode.nodeType;
                                    if (rName !== vName || rType !== vType){
                                        if (addNodeType){
                                            copy = this.cloneNode(true);
                                            this.parentNode.insertBefore(copy, this);
                                            insertBeforeNode(parent, this, targetNode);
                                        } else {
                                            findWillRemoveNode.push(this);
                                        }
                                    }
                                }
                            });
                            if (findWillRemoveNode.length > 0){
                                zui.loop(findWillRemoveNode, function(){
                                    removeNode(this.parentNode, this);
                                });
                            }
                        };
                        var checkNode = function (real, virtual){
                            if (real.nodeType === 1 && virtual.nodeType === 1){
                                var rNodeName = real.nodeName.toLowerCase();
                                var vNodeName = virtual.nodeName.toLowerCase();
                                var rChild = real.childNodes;
                                var vChild = virtual.childNodes;
                                var vAttr = virtual.attributes;
                                for ( var i = 0; i < vAttr.length; i++ ){
                                    real.setAttribute(vAttr[i]['name'], vAttr[i]['value']);
                                }
                                if (
                                    (rNodeName === 'input' && vNodeName === 'input') ||
                                    (rNodeName === 'textarea' && vNodeName === 'textarea') ||
                                    (rNodeName === 'select' && vNodeName === 'select')
                                ){
                                    if (real.value !== virtual.value){
                                        real.value = virtual.value;
                                    }
                                    if (real.type === 'password' || rNodeName === 'textarea' ){
                                        real.removeAttribute('value');
                                    }
                                }
                                if( rChild && vChild ){
                                    if (vChild.length !== rChild.length ){
                                        if (vChild.length > rChild.length){
                                            insertRemoveNode(real, vChild, rChild, true);
                                        } else {
                                            insertRemoveNode(real, rChild, vChild, false);
                                        }
                                        checkNode(real, virtual);
                                        return false;
                                    }
                                    for ( var j = 0; j < vChild.length; j++ ){
                                        var isComponent = vChild[j][ModuleName];
                                        if (!isComponent || isComponent === '' || !isComponent['componentId'] ){
                                            checkNode(rChild[j], vChild[j]);
                                        }
                                    }
                                }
                            } else if (real.nodeType === 3 && virtual.nodeType === 3){
                                if (real.textContent !== virtual.textContent){
                                    real.textContent = virtual.textContent;
                                }
                            }
                        };
                        checkNode(current, virtual);
                    }
                }
            }
        }
    };
    /** --------------------------------------------------------------- */
    zui.extend({
        Ajax : function(opt){
            return new js2uixAjax(null, opt);
        },
        AjaxDownLoad : function(link, name, type){
            var arg = arguments[0];
            var timer = arg[arg.length-1];
            var start = 0;
            var object = null;
            if( typeof link === 'object' || Array.isArray(link) ){
                if( timer && typeof timer === 'number' ){
                    object = link;
                    downloadFnc(object[start].link, object[start].name, object[start].type, timer);
                } else {
                    zui.loop(link, function(num, value){
                        if( value && value.link && value.name && value.type ){
                            downloadFnc(value.link, value.name, value.type, false);
                        }
                    });
                }
            } else {
                downloadFnc(link, name, type, false);
            }
            function downloadFnc(link, name, type, timer){
                var downClick = document.createElement('a');
                downClick.href = link+name+"."+type;
                downClick.download = name+"."+type;
                document.body.appendChild(downClick);
                downClick.click();
                document.body.removeChild(downClick);
                start++;
                if( timer && start < object.length ){
                    setTimeout(function(){
                        downloadFnc(object[start].link, object[start].name, object[start].type, timer);
                    }, timer);
                }
            }
        },
        Component : function(obj){
            var prop;
            var component = function(obj){
                js2uixComponent.call(this, obj);
                return this['setRender'].call(this);
            };
            component.prototype = Object.create(js2uixComponent.prototype);
            component.prototype.constructor = component;
            for ( prop in obj ){
                if ( obj.hasOwnProperty(prop) ){
                    if ( prop !== 'super' ){
                        component.prototype[prop] = obj[prop];
                    }
                }
            }
            return new component(obj);
        },
        Export : function(name, data){
            zui.uiComponent.setModule(name, data);
        },
        Import : function(name){
            return zui.uiComponent.getModule(name);
        },
        Render : function(){
            var arg = arguments;
            if( arg && arg.length > 1){
                var parent = zui(arg[arg.length-1])[0];
                for(var i=0; i<arg.length-1; i++){
                    var object = arg[i];
                    var dom = object.$$Dom;
                    if( dom && parent){
                        zui(parent).append(dom);
                        object.setRenderState({
                            parent : parent,
                            render : dom,
                            isMount : true
                        });
                    }
                }
            }
        },
        Router : function(){
            return new js2uixRouter();
        }
    });
    zui.fx.extend({
        AjaxFrom : function(opt){
            return new js2uixAjax(this, opt);
        }
    });
    /** --------------------------------------------------------------- */
    /** js2uix-d3-control method
     * TODO : D3.js를 이용한 그래프 모듈 제작 중.
     * */
    var js2uixD3Style = function(target, props){
        target.append('<style class="js2uixD3">\n' +
            props.svgId+' .js2uix_g .grid_x,\n' +
            props.svgId+' .js2uix_g .grid_y{opacity : '+props.opacity+'}\n' +
            props.svgId+' .js2uix_g .grid_x path,\n' +
            props.svgId+' .js2uix_g .grid_y path{stroke-width:0}\n' +
            props.svgId+' .js2uix_g .grid_x .tick line,\n' +
            props.svgId+' .js2uix_g .grid_y .tick line{stroke-dasharray:'+props.dashArray+'}\n' +
            '</style>');
    };
    var js2uixD3Module = function(element, props){
        this.d3 = {};
        this.nodes = {};
        this.target = element;
        this.props = {
            chartType : "",
            nameAxisX : "",
            typeAxisX : "string",
            timeAxisX : ["week",1],
            timeFormat : "%Y-%m-%d",
            tickAxisY : 10,
            tickGridY : 10,
            tickGridOpacity : 0.2,
            tickGridDashNum : 2,
            rotateAxisX : 0,
            posXAxisX : 10,
            posYAxisX : 10,
            fontSizeX : 11,
            fontSizeY : 11,
            fontSizeTitle : 12,
            nameAxisY : "",
            typeAxisY : "number",
            title : "",
            titleBox : true,
            lineCurve : true,
            colorful : true,
            colorAlpha : 1,
            circleThickNum: 0.5,
            layoutW : 0,
            layoutH : 0,
            duration : 200,
            gridLine : true,
            groupInfoBox : true,
            shadeColor : ''
        };
        this.state = {
            autoMode    : false,
            clear       : false,
            colorArray  : ["#add5d7", "#47acb1", "#ffe8af", "#ffcd33", "#f9aa7b", "#f26522", "#7fb6ff", "#7876ff", "#a5a8aa", "#676766"],
            dataLength  : 0,
            idName      : "",
            max_width   : 1740,
            min_width   : 300,
            min_height  : 200,
            resize      : false,
            uniqueId    : '',
            uniqueName  : '',
            update      : false
        };
        this.axis = null;
        this.init(props);
        return {
            name : JS2UIX_DATA_KEY,
            setData : this.setData.bind(this)
        }
    };
    js2uixD3Module.prototype = {
        uiChartClass : D3ClassName,
        /** Create js2uix D3 Chart Info */
        renderChartDefaultSetting : function(elm){
            if( elm.length > 0 ){
                this.state.uniqueId = js2uixUniqueId();
                this.state.uniqueName = 'js2uix'+this.state.uniqueId;
                elm.addClass(this.uiChartClass);
                if(!elm[0].id){elm.addId(ModuleName+this.state.uniqueId);}
                this.state.idName = elm.getAttr('id');
            }
        },
        setUserShadeColorSetting : function(color){
            if( color ){
                var hex = color.replace('#','');
                var r = parseInt(hex.substring(0,2), 16);
                var g = parseInt(hex.substring(2,4), 16);
                var b = parseInt(hex.substring(4,6), 16);
                var max = Math.max(r, Math.max(g,b));
                var step = 255/(max*10);
                var colorArray = [];
                var rgb2hex = function(rgb){
                    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
                    return (rgb && rgb.length === 4) ? "#" +
                    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
                };
                for( var i=2; i<12; i++ ){
                    colorArray.push(rgb2hex('rgb('+parseInt(r*step*i)+','+parseInt(g*step*i)+','+parseInt(b*step*i)+',1)'))
                }
                if( colorArray.length > 0 ){
                    this.state.colorArray = colorArray;
                }
            }
        },
        setCommonChartInfoString : function(type){
            var string = "Max";
            var fontSize = this.props.fontSizeTitle;
            if( !this.props.titleBox ){ return; }
            if( typeof fontSize !== "number" ){ fontSize = 12;}
            if( this.axis.axis_string ){ string = this.axis.axis_string; }
            if( type === "basic"){
                this.nodes.title_g.attr("transform", "rotate(-0)")
                    .attr("dx", "0em")
                    .attr("y", -20)
                    .attr("dy", "0.7em")
                    .attr("text-anchor", "start")
                    .attr("fill", "#000")
                    .attr("style", "font-size:"+fontSize+"px")
                    .text(string);
            }else{
                this.nodes.title_g.attr("transform", "rotate(-0)")
                    .attr("y", -5)
                    .attr("dy", "0.71em")
                    .attr("text-anchor", "middle")
                    .attr("fill", "#000")
                    .attr("style", "font-size:"+fontSize+"px")
                    .text(string);
            }
        },
        setCommonChartAxisYNode : function(){
            var fontSize = this.props.fontSizeY;
            if( typeof fontSize !== "number" ){ fontSize = 11;}
            if( !this.state.update ){
                this.nodes.axisY_g.call( window.d3.axisLeft(this.d3.y).ticks(this.axis.tickAxisY)).attr("style", "font-size:"+fontSize+"px");
            } else {
                this.nodes.axisY_g.call( window.d3.axisLeft(this.d3.y).ticks(this.axis.tickAxisY));
            }
        },
        setCommonChartAxisXNode : function(){
            var positionX = 10, positionY = 20, rotateAngle = 0, fontSize = this.props.fontSizeX,
                axisX = this.nodes.axisX_g.attr("transform", "translate(0," + this.d3.height + ")").selectAll("text").style("text-anchor", "middle");
            if( typeof this.axis.posXAxisX === "number" && (typeof this.axis.posXAxisX !== "undefined" || this.axis.posXAxisX !== null) ){
                positionX =  this.axis.posXAxisX;
                axisX.attr("dx",  positionX+"px")
            }
            if( typeof this.axis.posYAxisX === "number" && (typeof this.axis.posYAxisX !== "undefined" || this.axis.posYAxisX !== null) ){
                positionY = this.axis.posYAxisX;
                axisX.attr("dy", positionY+"px")
            }
            if( typeof this.axis.rotateAxisX === "number" && (typeof this.axis.rotateAxisX !== "undefined" || this.axis.rotateAxisX !== null) ){
                rotateAngle = this.axis.rotateAxisX;
                axisX.attr("transform", "rotate(-"+rotateAngle+")")
            }
            if( typeof fontSize !== "number" ){ fontSize = 11;}
            this.nodes.axisX_g.attr("style", "font-size:"+fontSize+"px");
        },
        setCommonChartAxisXYGrid : function(){
            if( !this.props.gridLine ){ return; }
            if( !this.state.update ){
                this.nodes.gridX_g.call(window.d3.axisBottom(this.d3.x).tickSize(-this.d3.height, 0, 0).tickFormat(""));
            }
            this.nodes.gridY_g.call(window.d3.axisLeft(this.d3.y).ticks(this.axis.tickGridY).tickSize(-this.d3.width, 0, 0).tickFormat(""));
        },
        setCommonCompareInfo : function(svg, keys, color){
            if( !this.props.groupInfoBox ){ return false; }
            var legend = svg.g.append("g")
                .attr("font-family", "sans-serif")
                .attr("text-anchor", "end")
                .selectAll("g").data(keys)
                .enter().append("g")
                .attr("transform", function(d, i) {
                    return "translate(0," + ((i * 20)-30) + ")";
                });
            try {
                legend.append("rect")
                    .attr("x", svg.width - 0)
                    .attr("width", 19)
                    .attr("height", 19)
                    .attr("fill", function(d){
                        return color(d);
                    });
                legend.append("text").attr("style", "font-size:12px")
                    .attr("x", svg.width-5)
                    .attr("y", 9.5)
                    .attr("dy", "0.32em")
                    .text(function(d) { return d; });
                legend.exit().remove();
            } finally {
                svg = null;
                keys = null;
            }
        },
        /** Crate js2uix D3 Chart Type */
        js2uixSingleAreaType : function(param){
            var keyX = "axisX";
            var keyY = "axisY";
            var parseData = param.map( function( dt ) {return {axisX : dt[this.axis.axisX], axisY : dt[this.axis.axisY]}}.bind(this));
            var minMaxX = window.d3.extent(parseData.map(function(dt) {return dt[keyX];}), function(dt) {return new Date(dt);});
            var minMaxY = window.d3.extent(parseData.map(function(dt) {return dt[keyY];}), function(dt) {return parseInt(dt);});
            try {
                if( !this.state.d3_area ){ this.state.d3_area = d3.area(); }
                if( this.props.lineCurve ){ this.state.d3_area.curve(window.d3.curveBasis); }
                if( this.axis.typeAxisX === "date" ){
                    this.d3.x = window.d3.scaleTime().domain([new Date(minMaxX[0]), new Date(minMaxX[1])]).rangeRound([0, this.d3.width]);
                    this.state.d3_area.x(function(dt) {return this.d3.x(new Date(dt[keyX]));}.bind(this));
                }else{
                    this.d3.x = window.d3.scaleBand().domain(parseData.map(function(dt) {return dt[keyX];})).rangeRound([0, this.d3.width]);
                    this.state.d3_area.x(function(dt) {return this.d3.x(dt[keyX])+(this.d3.x.bandwidth()*0.5);}.bind(this));
                }
                this.d3.y = window.d3.scaleLinear().domain([0, minMaxY[1]]).rangeRound([this.d3.height, 0]);
                this.state.d3_area.y(function(dt) {return this.d3.y(dt[keyY]);}.bind(this));
                this.state.d3_area.y1(function(dt) {return this.d3.y(dt[keyY]);}.bind(this));
                this.state.d3_area.y0(this.d3.y(0));
                if( !this.state.update ){
                    var color = window.d3.scaleOrdinal().range(this.state.colorArray);
                    var timeFormat = window.d3.timeFormat(this.axis.timeFormat);
                    this.nodes.gridX_g = this.d3.g.append("g").attr("class", "grid_x").attr("transform", "translate(0," + this.d3.height + ")").attr('opacity', this.props.tickGridOpacity);
                    this.nodes.gridY_g = this.d3.g.append("g").attr("class", "grid_y").attr('opacity', this.props.tickGridOpacity);
                    this.nodes.pathArea = this.d3.g.append("path").attr("class", "area").style("fill", color).attr('fill-opacity', this.props.colorAlpha);
                    this.nodes.axisX_g = this.d3.g.append("g").attr("class", "axis axis--x");
                    this.nodes.axisY_g = this.d3.g.append("g").attr("class", "axis axis--y");
                    this.nodes.title_g = this.d3.g.append("g").attr("class", "title").append("text");
                    (this.axis.typeAxisX === "date")?this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x).ticks( window.d3[this.axis.timeAxisX[0]].every(this.axis.timeAxisX[1])).tickFormat(function(dt){return timeFormat(dt)})):this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x));
                    this.setCommonChartInfoString("basic");
                    this.setCommonChartAxisXNode();
                }
                this.nodes.pathArea.datum(parseData).transition().duration(this.props.duration).attr('d', this.state.d3_area);
                this.nodes.pathArea.exit().remove();
                /** common axis type */
                this.setCommonChartAxisYNode();
                this.setCommonChartAxisXYGrid();
            } finally {
                param = null;
                parseData = null;
            }
        },
        js2uixCompareAreaType : function(param){
            var self = this;
            var keyX = "axisX";
            var keyY = "axisY";
            var maxAxisY = 0;
            var compareKey = [];
            var firstObject = param[Object.keys(param)[0]];
            var axisXArr = firstObject.map(function(dt) { return dt[this.axis.axisX]; }.bind(this));
            var minMaxX = window.d3.extent(axisXArr, function(dt) {return new Date(dt); });
            var parseData = param;
            try {
                if( !this.state.d3_area ){
                    this.state.d3_area = window.d3.area();
                }
                if( !this.state.d3_line ){
                    this.state.d3_line = window.d3.line();
                }
                if( this.props.lineCurve ){
                    this.state.d3_area.curve(window.d3.curveBasis);
                    this.state.d3_line.curve(window.d3.curveBasis);
                }
                if( !Array.isArray(param) ){
                    parseData = [];
                    zui.loop(param, function(key, val){
                        var self = this;
                        parseData.push(val.map( function( dt ) {
                            return {
                                axisX : dt[self.axis.axisX],
                                axisY : dt[self.axis.axisY]
                            };
                        }));
                    }.bind(this));
                }
                zui.loop(param, function(key, value){
                    var self = this;
                    var max = window.d3.max(value, function(dt){
                        return (dt[self.axis.axisY]);
                    });
                    if( maxAxisY < max ){ maxAxisY = max + (max*0.2); }
                    compareKey.push(key);
                }.bind(this));
                if( this.axis.typeAxisX === "date" ){
                    this.d3.x = window.d3.scaleTime().domain([new Date(minMaxX[0]), new Date(minMaxX[1])]).rangeRound([0, this.d3.width]);
                    this.state.d3_area.x(function(dt) { return this.d3.x(new Date(dt[keyX])); }.bind(this));
                    this.state.d3_line.x(function(dt) { return this.d3.x(new Date(dt[keyX])); }.bind(this));
                }else{
                    this.d3.x = window.d3.scaleBand().domain(axisXArr).rangeRound([0, this.d3.width]);
                    this.state.d3_area.x(function(dt) { return this.d3.x(dt[keyX])+(this.d3.x.bandwidth()*0.5);}.bind(this));
                    this.state.d3_line.x(function(dt) { return this.d3.x(dt[keyX])+(this.d3.x.bandwidth()*0.5);}.bind(this));
                }
                this.state.d3_area.y(function(dt) {return this.d3.y(dt[keyY]);}.bind(this));
                this.state.d3_line.y(function(dt) {return this.d3.y(dt[keyY]);}.bind(this));
                this.d3.y = window.d3.scaleLinear().domain([0, maxAxisY]).rangeRound([this.d3.height, 0]);
                this.state.d3_area.y1(function(dt) {return this.d3.y(dt[keyY]);}.bind(this));
                this.state.d3_area.y0(this.d3.y(0));
                if( !this.state.update ){
                    var color = window.d3.scaleOrdinal().range(this.state.colorArray);
                    var timeFormat = window.d3.timeFormat(this.axis.timeFormat);
                    this.nodes.gridX_g = this.d3.g.append("g").attr("class", "grid_x").attr("transform", "translate(0," + this.d3.height + ")").attr('opacity', this.props.tickGridOpacity);
                    this.nodes.gridY_g = this.d3.g.append("g").attr("class", "grid_y").attr('opacity', this.props.tickGridOpacity);
                    this.d3.g.append("g").attr("class", "pathBox").selectAll('path').data(parseData, function(dt, dn){
                        window.d3.select(this).append('path').attr("class", "area").attr('fill-opacity', self.props.colorAlpha).attr("fill", function(){return color(compareKey[dn])});
                        window.d3.select(this).append('path').attr("class", "line").attr("stroke-width", "1.5").attr("fill", "none").attr("stroke", function(){return color(compareKey[dn])});
                    });
                    this.nodes.axisX_g = this.d3.g.append("g").attr("class", "axis axis--x");
                    this.nodes.axisY_g = this.d3.g.append("g").attr("class", "axis axis--y");
                    this.nodes.title_g = this.d3.g.append("g").attr("class", "title").append("text");
                    this.nodes.pathNode = this.d3.g.select("g.pathBox").selectAll('path.area').data(parseData);
                    this.nodes.lineNode = this.d3.g.select("g.pathBox").selectAll('path.line').data(parseData);
                    (this.axis.typeAxisX === "date")?this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x).ticks( window.d3[this.axis.timeAxisX[0]].every(this.axis.timeAxisX[1])).tickFormat(function(dt){return timeFormat(dt)})):this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x));
                    this.setCommonCompareInfo(this.d3, compareKey, color);
                    this.setCommonChartInfoString("basic");
                    this.setCommonChartAxisXNode();
                } else {
                    this.nodes.pathNode = this.nodes.pathNode.data(parseData);
                    this.nodes.lineNode = this.nodes.lineNode.data(parseData);
                }
                this.nodes.pathNode.transition().duration(this.props.duration).attr('d', this.state.d3_area);
                this.nodes.lineNode.transition().duration(this.props.duration).attr('d', this.state.d3_line);
                this.nodes.pathNode.exit().remove();
                this.nodes.lineNode.exit().remove();
                /** common axis type */
                this.setCommonChartAxisYNode();
                this.setCommonChartAxisXYGrid();
            } finally {
                param = null;
                parseData = null;
            }
        },
        js2uixSingleLineType : function (param){
            var keyX = "axisX";
            var keyY = "axisY";
            var parseData = param.map( function( dt ) {return {axisX : dt[this.axis.axisX], axisY : dt[this.axis.axisY]};}.bind(this));
            var minMaxX = window.d3.extent(parseData.map(function(dt) {return dt[keyX];}), function(dt) {return new Date(dt);});
            var minMaxY = window.d3.extent(parseData.map(function(dt) {return dt[keyY];}), function(dt) {return parseInt(dt);});
            try{
                if( !this.state.d3_line ){
                    this.state.d3_line = window.d3.line();
                }
                if( this.props.lineCurve ){
                    this.state.d3_line.curve(window.d3.curveBasis);
                }
                if( this.axis.typeAxisX === "date" ){
                    this.d3.x = window.d3.scaleTime().domain([new Date(minMaxX[0]), new Date(minMaxX[1])]).rangeRound([0, this.d3.width]);
                    this.state.d3_line.x(function(dt) {
                        return this.d3.x(new Date(dt[keyX]));
                    }.bind(this));
                }else{
                    this.d3.x = window.d3.scaleBand().domain(parseData.map(function(dt) { return dt[keyX]; })).rangeRound([0, this.d3.width]);
                    this.state.d3_line.x(function(dt) { return this.d3.x(dt[keyX])+(this.d3.x.bandwidth()*0.5);}.bind(this));
                }
                this.d3.y = window.d3.scaleLinear().domain([0, minMaxY[1]]).rangeRound([this.d3.height, 0]);
                this.state.d3_line.y(function(dt) {return this.d3.y(dt[keyY]);}.bind(this));
                if( !this.state.update ){
                    var color = window.d3.scaleOrdinal().range(this.state.colorArray);
                    var timeFormat = window.d3.timeFormat(this.axis.timeFormat);
                    this.nodes.gridX_g = this.d3.g.append("g").attr("class", "grid_x").attr("transform", "translate(0," + this.d3.height + ")").attr('opacity', this.props.tickGridOpacity);
                    this.nodes.gridY_g = this.d3.g.append("g").attr("class", "grid_y").attr('opacity', this.props.tickGridOpacity);
                    this.nodes.axisX_g = this.d3.g.append("g").attr("class", "axis axis--x");
                    this.nodes.axisY_g = this.d3.g.append("g").attr("class", "axis axis--y");
                    this.nodes.title_g = this.d3.g.append("g").attr("class", "title").append("text");
                    this.nodes.pathArea = this.d3.g.append("path").attr("class", "line").attr("stroke", color).attr("stroke-width", "1.5").attr("fill", "none");
                    (this.axis.typeAxisX === "date")?this.nodes.axisX_g.call(window.d3.axisBottom(this.d3.x).ticks( window.d3[this.axis.timeAxisX[0]].every(this.axis.timeAxisX[1])).tickFormat(function(dt){return timeFormat(dt)})):this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x));
                    this.setCommonChartInfoString("basic");
                    this.setCommonChartAxisXNode();
                }
                this.nodes.pathArea.datum(parseData).transition().duration(this.props.duration).attr('d', this.state.d3_line);
                this.nodes.pathArea.exit().remove();
                /** common axis type */
                this.setCommonChartAxisYNode();
                this.setCommonChartAxisXYGrid();
            } finally {
                param = null;
                parseData = null;
            }
        },
        js2uixCompareLineType : function (param){
            var keyX = "axisX";
            var keyY = "axisY";
            var maxAxisY = 0;
            var firstObject = param[Object.keys(param)[0]];
            var axisXArr = firstObject.map(function(dt){return dt[this.axis.axisX];}.bind(this));
            var minMaxX = window.d3.extent(axisXArr, function(dt){return new Date(dt);});
            var pathArea, compareKey = [];
            var parseData = param;
            try {
                if( !this.state.d3_line ){this.state.d3_line = window.d3.line();}
                if( this.props.lineCurve ){this.state.d3_line.curve(window.d3.curveBasis);}
                if( !Array.isArray(param) ){
                    parseData = [];
                    zui.loop(param, function(key, val){
                        var self = this;
                        parseData.push(val.map( function( dt ) {
                            return {
                                axisX : dt[self.axis.axisX],
                                axisY : dt[self.axis.axisY]
                            };
                        }));
                    }.bind(this));
                }
                zui.loop(param, function(key, value){
                    var self = this;
                    var max = window.d3.max(value, function(dt){
                        return (dt[self.axis.axisY]);
                    });
                    if( maxAxisY < max ){maxAxisY = max + (max*0.2);}
                    compareKey.push(key);
                }.bind(this));
                if( this.axis.typeAxisX === "date" ){
                    this.d3.x = window.d3.scaleTime().domain([new Date(minMaxX[0]), new Date(minMaxX[1])]).rangeRound([0, this.d3.width]);
                    this.state.d3_line.x(function(dt) {
                        return this.d3.x(new Date(dt[keyX]));
                    }.bind(this));
                }else{
                    this.d3.x = window.d3.scaleBand().domain(axisXArr).rangeRound([0, this.d3.width]);
                    this.state.d3_line.x(function(dt) {
                        return this.d3.x(dt[keyX])+(this.d3.x.bandwidth()*0.5);
                    }.bind(this));
                }
                this.d3.y = window.d3.scaleLinear().domain([0, maxAxisY]).rangeRound([this.d3.height, 0]);
                this.state.d3_line.y(function(dt) {
                    return this.d3.y(dt[keyY]);
                }.bind(this));
                if( !this.state.update ){
                    var timeFormat = window.d3.timeFormat(this.axis.timeFormat);
                    var color = window.d3.scaleOrdinal().range(this.state.colorArray);
                    this.nodes.gridX_g = this.d3.g.append("g").attr("class", "grid_x").attr("transform", "translate(0," + this.d3.height + ")").attr('opacity', this.props.tickGridOpacity);
                    this.nodes.gridY_g = this.d3.g.append("g").attr("class", "grid_y").attr('opacity', this.props.tickGridOpacity);
                    this.nodes.axisX_g = this.d3.g.append("g").attr("class", "axis axis--x");
                    this.nodes.axisY_g = this.d3.g.append("g").attr("class", "axis axis--y");
                    this.nodes.title_g = this.d3.g.append("g").attr("class", "title").append("text");
                    pathArea = this.d3.g.append("g").attr("class", "pathBox").selectAll('path').data(parseData).enter().append('path');
                    pathArea.attr("class", "line").attr("stroke", function(dt, dn){return color(compareKey[dn])}).attr("stroke-width", "1.5").attr("fill", "none");
                    this.nodes.pathNode = this.d3.g.select("g.pathBox").selectAll('path.line');
                    (this.axis.typeAxisX === "date")?this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x).ticks( window.d3[this.axis.timeAxisX[0]].every(this.axis.timeAxisX[1])).tickFormat(function(dt){return timeFormat(dt)})):this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x));
                    this.setCommonCompareInfo(this.d3, compareKey, color);
                    this.setCommonChartInfoString("basic");
                    this.setCommonChartAxisXNode();
                } else {
                    pathArea = this.nodes.pathNode.data(parseData);
                }
                pathArea.transition().duration(this.props.duration).attr('d', this.state.d3_line);
                pathArea.exit().remove();
                /** common axis type */
                this.setCommonChartAxisYNode();
                this.setCommonChartAxisXYGrid();
            } finally {
                param = null;
                parseData = null;
                pathArea = null;
                compareKey = null;
            }
        },
        js2uixSingleBarType : function (param){
            var self = this;
            var keyX = "axisX";
            var keyY = "axisY";
            var currentData = param.map( function( dt ) {return {axisX : dt[this.axis.axisX], axisY : dt[this.axis.axisY]};}.bind(this));
            var axisYArr = currentData.map(function(dt) {return dt[keyY];});
            var minMaxY = window.d3.extent(axisYArr, function(dt) {return parseInt(dt);});
            var rectNode;
            try {
                this.d3.x = window.d3.scaleBand().padding(0.1).domain(currentData.map(function(dt) {return dt[keyX];})).rangeRound([0, this.d3.width]);
                this.d3.y = window.d3.scaleLinear().domain([0, minMaxY[1]]).rangeRound([this.d3.height, 0]);
                if( !this.state.update ){
                    var color = window.d3.scaleOrdinal().range(this.state.colorArray);
                    var timeFormat = window.d3.timeFormat(this.axis.timeFormat);
                    this.nodes.gridX_g = this.d3.g.append("g").attr("class", "grid_x").attr("transform", "translate(0," + this.d3.height + ")").attr('opacity', this.props.tickGridOpacity);
                    this.nodes.gridY_g = this.d3.g.append("g").attr("class", "grid_y").attr('opacity', this.props.tickGridOpacity);
                    this.nodes.axisX_g =  this.d3.g.append("g").attr("class", "axis axis--x");
                    this.nodes.axisY_g =  this.d3.g.append("g").attr("class", "axis axis--y");
                    this.nodes.title_g =  this.d3.g.append("g").attr("class", "title").append("text");
                    this.nodes.pathArea =  this.d3.g.append("g").attr("class", "graphBox");
                    rectNode = this.nodes.pathArea.selectAll("g").data(currentData, function(dt) {return dt[keyX];})
                        .enter()
                        .append("rect")
                        .attr("class", "ui-chart-bar")
                        .attr("width", this.d3.x.bandwidth())
                        .attr("x", function(dt){ return this.d3.x(dt[keyX]); }.bind(this))
                        .attr("fill", function(dt){return color(dt[keyX]);})
                        .attr('fill-opacity', this.props.colorAlpha)
                        .attr("data-name", function(dt) {return dt[keyX];})
                        .attr("data-value", function(dt) {return dt[keyY];});
                    this.nodes.rectNode = this.d3.g.select('g.graphBox').selectAll("rect.ui-chart-bar");
                    (this.axis.typeAxisX === "date")?this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x).tickFormat(function(dt){ return timeFormat(new Date(dt)); })):this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x));
                    this.setCommonChartInfoString("basic");
                    this.setCommonChartAxisXNode();
                } else {
                    rectNode = this.nodes.rectNode.data(currentData, function(dt) {return dt[keyX];});
                }
                rectNode.attr("height", function() {return (self.state.update)?window.d3.select(this)
                    .attr("height"):self.d3.height-self.d3.y(0);})
                    .attr("y", function() {return (self.state.update)?window.d3.select(this).attr("y"):self.d3.y(0);})
                    .transition()
                    .duration(this.props.duration).ease(window.d3.easeLinear)
                    .attr("y", function(dt) {return self.d3.y(dt[keyY]);})
                    .attr("height", function(dt) {return self.d3.height - self.d3.y(dt[keyY]);});
                rectNode.exit().remove();
                /** common axis type */
                this.setCommonChartAxisYNode();
                this.setCommonChartAxisXYGrid();
            } finally {
                param = null;
                rectNode = null;
            }
        },
        js2uixCompareBarType : function (param){
            var self = this;
            var axisXArr = param[Object.keys(param)[0]].map(function(dt) {return dt[this.axis.axisX];}.bind(this));
            var maxAxisY = 0, boxIdx = 0;
            var compareKey = [], boxValueArray = [], rectNode;
            var key = function(dt) {
                var self = this;
                var rt_data = window.d3.values(param).map(function(dv){
                    var val =  dv.map(function(dv2){if( dv2[self.axis.axisX] == dt ){return dv2[self.axis.axisY];}});
                    return window.d3.max(val, function(dv){return dv;});
                });
                boxValueArray.push(rt_data);
                return rt_data;
            }.bind(this);
            try {
                zui.loop(param, function(key, value){
                    var self = this;
                    var max = window.d3.max(value, function(dt){return (dt[self.axis.axisY]);});
                    if( maxAxisY < max ){maxAxisY = max;}
                    compareKey.push(key);
                }.bind(this));
                this.d3.x = window.d3.scaleBand().domain(axisXArr).rangeRound([0, this.d3.width]).padding(0.1);
                this.d3.x1 = window.d3.scaleBand().padding(0.05).domain(window.d3.entries(param).map(function(dt) {return dt.key;})).rangeRound([0, this.d3.x.bandwidth()]);
                this.d3.y = window.d3.scaleLinear().domain([0, maxAxisY]).rangeRound([this.d3.height, 0]);
                if( !this.state.update ){
                    var color = window.d3.scaleOrdinal().range(this.state.colorArray);
                    var timeFormat = window.d3.timeFormat(this.axis.timeFormat);
                    this.nodes.gridX_g = this.d3.g.append("g").attr("class", "grid_x").attr("transform", "translate(0," + this.d3.height + ")").attr('opacity', this.props.tickGridOpacity);
                    this.nodes.gridY_g = this.d3.g.append("g").attr("class", "grid_y").attr('opacity', this.props.tickGridOpacity);
                    this.nodes.axisX_g = this.d3.g.append("g").attr("class", "axis axis--x");
                    this.nodes.axisY_g = this.d3.g.append("g").attr("class", "axis axis--y");
                    this.nodes.title_g = this.d3.g.append("g").attr("class", "title").append("text");
                    rectNode = this.d3.g.append("g").attr("class", "path").selectAll("g").data(axisXArr, key).enter().append("g")
                        .attr("class", "ui-chart-group")
                        .attr("width", this.d3.x.bandwidth() )
                        .attr("transform", function(dt) {return "translate(" + self.d3.x(dt) + ",0)";})
                        .attr("data-left", function(dt) {return self.d3.x(dt);})
                        .selectAll("rect").data(window.d3.keys(param))
                        .enter().append("rect")
                        .attr("class", "ui-chart-bar")
                        .attr("width", function (){ return self.d3.x1.bandwidth(); })
                        .attr("x", function(dt) {return self.d3.x1(dt);})
                        .attr("fill", function(d) {return color(d);})
                        .attr('fill-opacity', this.props.colorAlpha);
                    this.setCommonCompareInfo(this.d3, compareKey, color);
                    this.nodes.rectNode = this.d3.g.select("g.path").selectAll("g");
                    this.axis.typeAxisX === "date"?this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x).ticks( window.d3[this.axis.timeAxisX[0]].every(this.axis.timeAxisX[1])).tickFormat(function(dt){return timeFormat(dt)})):this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x));
                    this.setCommonChartInfoString("basic");
                    this.setCommonChartAxisXNode();
                } else {
                    rectNode = this.nodes.rectNode.data(axisXArr, key).selectAll("rect.ui-chart-bar").data(window.d3.keys(param));
                }
                rectNode.attr("data-height", function(dt, dv){ if(dv === 0 ){ boxIdx++; } return self.d3.height - self.d3.y(boxValueArray[boxIdx-1][dv]); })
                    .attr("data-name", function(dt) { boxIdx = 0; return dt; })
                    .attr("data-value", function(dt, dv) { if(dv === 0 ){ boxIdx++; } return boxValueArray[boxIdx-1][dv]; })
                    .attr("y", function(){ return (self.state.update)?window.d3.select(this).attr("y"):self.d3.y(0); })
                    .attr("height", function(){return (self.state.update)?window.d3.select(this).attr("height"):self.d3.height-self.d3.y(0);});
                boxIdx = 0;
                rectNode.transition().duration(this.props.duration).ease(window.d3.easeLinear)
                    .attr("y", function(){ return self.d3.height-window.d3.select(this).attr("data-height"); })
                    .attr("height", function(dt, dv) { if(dv === 0 ){ boxIdx++; } return self.d3.height - self.d3.y(boxValueArray[boxIdx-1][dv]); });
                rectNode.exit().remove();
                /** common axis type */
                this.setCommonChartAxisYNode();
                this.setCommonChartAxisXYGrid();
            } finally {
                param = null;
                compareKey = null;
                boxValueArray = null;
                rectNode = null;
            }
        },
        js2uixCircleType : function (param){
            var self = this;
            var sliceNode, circleText, polyLine, legendNode;
            try {
                if( !this.state.update ){
                    var color = window.d3.scaleOrdinal().range(this.state.colorArray);
                    var chartSizeW = this.target[0].clientWidth;
                    var chartSizeH = this.target[0].clientHeight;
                    this.d3.width = chartSizeW;
                    this.d3.height = chartSizeH;
                    this.state.radius = Math.min(chartSizeW, chartSizeH)/2-30;
                    this.state.arc1 = window.d3.arc().outerRadius(this.state.radius*0.9).innerRadius(this.state.radius*(1-this.props.circleThickNum));
                    this.state.outerArc = window.d3.arc().innerRadius(this.state.radius).outerRadius(this.state.radius*0.9);
                    this.state.pie = window.d3.pie().sort(null).value( function(d) { return d[self.axis.axisY]; });
                    this.state.axisXFnc = function(d){ return d.data[self.axis.axisX]; };
                    this.state.midAngle = function(d){ return d.startAngle + (d.endAngle - d.startAngle)/2; };
                    this.d3.g = this.d3.g.attr("transform", "translate(" + chartSizeW/2 + "," + chartSizeH/2 + ")");
                    this.d3.g.append("g").attr("class", "labels");
                    this.d3.g.append("g").attr("class", "lines");
                    this.nodes.title_g = this.d3.g.append("g").attr("class", "titleBox").append("text");

                    /** TODO : 노드 정의 */
                    sliceNode = this.d3.g.append("g").attr("class", "slices ui-"+this.state.uniqueId).selectAll("path.slice").data(this.state.pie(param), this.state.axisXFnc).enter().insert("path").style("fill", function(d) { return color(d.data[self.axis.axisX]); }).attr("class", "slice").attr('fill-opacity', this.props.colorAlpha);
                    circleText = this.d3.g.select(".labels").selectAll("text")
                        .data(this.state.pie(param), this.state.axisXFnc).enter()
                        .append("text").attr("style", "font-size:12px").attr("dy", ".35em").attr("opacity", 1);
                    polyLine = this.d3.g.select(".lines").selectAll("polyline")
                        .data(this.state.pie(param), this.state.axisXFnc).enter()
                        .append("polyline").attr("opacity", 0.3).attr("stroke", 'black').attr("stroke-width", '1px').attr("fill", 'none').attr("stroke-opacity", 1);
                    if( this.props.groupInfoBox ){
                        legendNode = this.d3.g.append("g").attr("class", "infoBox").attr("text-anchor", "end").selectAll("g").data(param.map(function(dt){ return d3.values(dt)[0]; })).enter().append("g").attr("transform", function(d, i) { return "translate(0," + ((i * 20)) + ")"; });
                        legendNode.append("rect").attr("x", -this.d3.width*0.5+10).attr("y", -this.d3.height*0.5+10).attr("width", 19).attr("height", 19).attr("fill", color);
                        legendNode.append("text").attr("style", "font-size:12px").attr("text-anchor", "start").attr("x", -this.d3.width*0.5+35).attr("y", -this.d3.height*0.5+20).attr("dy", "0.32em").text(function(d) {return d;});
                        legendNode.exit().remove();
                    }

                    /** DOM select */
                    this.nodes.slice = this.d3.g.selectAll("path.slice");
                    this.nodes.circleText = this.d3.g.select(".labels").selectAll("text");
                    this.nodes.polyLine = this.d3.g.select(".lines").selectAll("polyline");
                    this.setCommonChartInfoString("circle");
                } else {
                    sliceNode = this.nodes.slice.data(this.state.pie(param), this.state.axisXFnc);
                    circleText = this.nodes.circleText.data(this.state.pie(param), this.state.axisXFnc);
                    polyLine = this.nodes.polyLine.data(this.state.pie(param), this.state.axisXFnc);
                }

                sliceNode.transition()
                    .duration(this.props.duration)
                    .attrTween("d", function(d) {
                        this._current = this._current || d;
                        var interpolate = window.d3.interpolate(this._current, d);
                        if( !self.state.update ){ interpolate = window.d3.interpolate({ startAngle: 0, endAngle: 0 }, this._current); }
                        this._current = interpolate(0);
                        return function(t) {
                            return self.state.arc1(interpolate(t));
                        };
                    });
                sliceNode.exit().remove();

                circleText.text(function(d){ return d.data[self.axis.axisY]; })
                    .transition().duration(this.props.duration)
                    .attrTween("transform", function(d) {
                        this._current = this._current || d;
                        var interpolate = window.d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            var d2 = interpolate(t);
                            var pos = self.state.outerArc.centroid(d2);
                            pos[0] = self.state.radius * (self.state.midAngle(d2) < Math.PI ? 1 : -1);
                            return "translate("+ pos +")";
                        };
                    })
                    .styleTween("text-anchor", function(d){
                        this._current = this._current || d;
                        var interpolate = window.d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {return self.state.midAngle(interpolate(t)) < Math.PI ? "start":"end";};
                    });
                circleText.exit().remove();

                polyLine.transition()
                    .duration(this.props.duration)
                    .attrTween("points", function(d){
                        this._current = this._current || d;
                        var interpolate = window.d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            var d2 = interpolate(t);
                            var pos = self.state.outerArc.centroid(d2);
                            pos[0] = self.state.radius * 0.95 * (self.state.midAngle(d2) < Math.PI ? 1: -1);
                            return [self.state.arc1.centroid(d2), self.state.outerArc.centroid(d2), pos];
                        };
                    });
                polyLine.exit().remove();
            } finally {
                param = null;
                sliceNode = null;
                circleText = null;
                polyLine = null;
                legendNode = null;
            }
        },
        /** Create Default Setting */
        setSwitchChartDomType : function (param){
            switch(this.props.chartType){
                case "line-s" : this.js2uixSingleLineType(param); break;
                case "line-c" : this.js2uixCompareLineType(param); break;
                case "area-s" : this.js2uixSingleAreaType(param); break;
                case "area-c" : this.js2uixCompareAreaType(param); break;
                case "bar-s"  : this.js2uixSingleBarType(param); break;
                case "bar-c"  : this.js2uixCompareBarType(param); break;
                case "circle" : this.js2uixCircleType(param); break;
                default : alert("Chart type is incorrect."); break;
            }
        },
        setCreateChartOption : function (){
            var objAxisInfo = {};
            var objLayoutInfo = {};
            try{
                if( !this.props.colorful ){
                    this.state.colorArray = [this.state.colorArray[0]];
                }
                if( this.props.colorArray ){
                    this.state.colorArray = this.props.colorArray;
                }
                if( this.props.shadeColor ){
                    this.setUserShadeColorSetting(this.props.shadeColor);
                }
                if( typeof this.props.timeAxisX[0] !== "string" || typeof this.props.timeAxisX[1] !== "number" ){
                    alert("The value of the timeAxisX is not correct.");
                    return false;
                }
                if(typeof this.props.circleThickNum === 'number'){
                    if( this.props.circleThickNum > 1 ){
                        this.props.circleThickNum = 1;
                    } else if( this.props.circleThickNum <= 0 ){
                        this.props.circleThickNum = 0.15;
                    }
                } else {
                    this.props.circleThickNum = 0.5;
                }
                this.props.timeAxisX = this.props.timeAxisX.map(function(dt) {
                    var srtArray = "";
                    switch( dt ){
                        case "day"   : srtArray = "timeDay"; break;
                        case "week"  : srtArray = "timeWeek"; break;
                        case "month" : srtArray = "timeMonth"; break;
                        case "year"  : srtArray = "timeYear"; break;
                        default      : srtArray = dt; break;
                    }
                    return srtArray;
                });
            } finally {
                objAxisInfo = null;
                objLayoutInfo = null;
            }
        },
        setCreateChartD3Target : function (chart){
            var state = this.state;
            var opts = this.props;
            var str_chartId = chart[0].id;
            var parentWrap = chart.parent().offset();
            var num_chartSizeW = (parentWrap.width)-(parentWrap.paddingL+parentWrap.paddingR);
            var num_chartSizeH = (parentWrap.height)-(parentWrap.paddingT+parentWrap.paddingB);
            var axis = this.axis = {
                axisX       : opts.nameAxisX,
                axisY       : opts.nameAxisY,
                typeAxisX   : opts.typeAxisX,
                typeAxisY   : opts.typeAxisY,
                timeAxisX   : opts.timeAxisX,
                timeFormat  : opts.timeFormat,
                tickAxisY   : opts.tickAxisY,
                tickGridY   : opts.tickGridY,
                rotateAxisX : opts.rotateAxisX,
                posXAxisX   : opts.posXAxisX,
                posYAxisX   : opts.posYAxisX,
                axis_string : opts.title
            };
            var layout = {width  : opts.layoutW, height : opts.layoutH};
            try {
                if( layout.width ){
                    num_chartSizeW = parseInt(layout.width);
                    chart.width(num_chartSizeW);
                }
                if( layout.height ){
                    num_chartSizeH = parseInt(layout.height);
                    chart.height(num_chartSizeH);
                }
                if( num_chartSizeW > state.max_width ){num_chartSizeW = state.max_width;}
                if( num_chartSizeW < state.min_width ){num_chartSizeW = state.min_width;}
                if( num_chartSizeH < state.min_height){num_chartSizeH = state.min_height;}
                if( !this.d3.svg ){
                    this.d3 = {
                        svg   : null,
                        g     : null,
                        x     : null,
                        y     : null,
                        width : 0,
                        height: 0,
                        margin: {},
                        line  : null,
                        tip   : null,
                        type  : this.props.chartType,
                        axisX : "",
                        axisY : "",
                        title : ""
                    };
                    this.d3.svg = window.d3.select("#"+str_chartId).append("svg:svg").attr('id', this.state.uniqueName).attr("width", num_chartSizeW).attr("height", num_chartSizeH);
                    this.d3.margin = {top: 40, right: 30, bottom: 30, left: 30};
                    this.d3.width = num_chartSizeW - this.d3.margin.left - this.d3.margin.right;
                    this.d3.height = num_chartSizeH - this.d3.margin.top - this.d3.margin.bottom;
                    this.d3.g = this.d3.svg.append("g").attr("class", "js2uix_g").attr("transform", "translate(" + this.d3.margin.left + "," + this.d3.margin.top + ")");
                    this.d3.axisX = axis.axisX;
                    this.d3.axisY = axis.axisY;
                    this.d3.title = axis.axis_string;
                }
            } finally {
                axis = null;
            }
        },
        setCreateStyleOption : function(elm){
            js2uixD3Style(elm, {
                svgId : '#'+this.state.uniqueName,
                opacity : this.props.tickGridOpacity,
                dashArray :  this.props.tickGridDashNum
            });
        },
        render : function(elm){
            this.renderChartDefaultSetting(elm);
            this.setCreateStyleOption(elm);
            this.setCreateChartOption(elm);
            this.setCreateChartD3Target(elm);
        },
        init : function(props){
            if(typeof props === 'object' ){
                zui.extend(this.props, props);
                this.render(this.target);
            }
        },
        setData : function(data){
            this.setSwitchChartDomType(data);
            if( !this.state.update ){
                this.state.update = true;
                this.state.dataLength = data.length;
            }
        }
    };
    js2uixD3Module.prototype.constructor = js2uixD3Module;
    zui.extend({
        D3Control : function(target, config){
            if( !window.d3 ){
                alert('please check! d3.js api');
                return;
            }
            if( target && typeof target === 'string' ){
                target = zui(target);
                if( target.length > 0 ){
                    target = ( target.length > 1 )?zui(target[0]):target;
                    if( target.name !== ModuleName ){ return; }
                    return new js2uixD3Module(target, config);
                }
            }
        }
    });
    /** --------------------------------------------------------------- */
    /** ZUI Set Define For Module */
    if ( typeof define === "function" && define.amd ) {
        define( "zui", [], function() {
            return zui;
        });
    }
    if ( !noGlobal ) {window.zui = zui;}
    return zui;
});