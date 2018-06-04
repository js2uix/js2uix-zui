/**
 * Name        : js2uix
 * Version     : 1.0.2
 * Developer   : JH.Yu
 * Email       : deshineplus@icloud.com
 * Language    : Javascript(ES5)
 * Copyright   : 2018 JH.Yu (js2uix)
 * GitHub      : https://github.com/js2uix/js2uix
 * License     : https://github.com/js2uix/js2uix/blob/master/LICENSE
 * build       : gulp.js
 * npm-install : npm install js2uix
 */
(function( global, factory ){
    "use strict";
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory( global, true );
        if( !global.document ){
            module.exports = function(win) {
                if ( !win.document ) { throw new Error( "js2uix is not support this browser!" ); }
                return factory(win);
            }
        }
    } else {
        factory( global );
    }
})( typeof window !== "undefined" ? window : this, function( window, noGlobal ){
    'use strict';
    var js2uix,
        ModuleName = 'js2uix',
        ModuleVersion = 'v1.0.0';
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
        var i, j, k;
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
                    isString = js2uix(isString);
                    for(k=0; k < isString.length; k++ ){
                        item.push(isString[k]);
                    }
                } else {
                    isString = DOC.createTextNode(isString);
                    item.push(isString);
                }
            } else if (typeof arg[i] === 'number' ){
                isString = DOC.createTextNode(String(arg[i]));
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
    var js2uixDomObserver = (function(){
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;
        return function(obj, callback){
            if( MutationObserver ){
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {callback(mutation);});
                });
                observer.observe( obj, {
                    childList : true,
                    subtree : true,
                    attributes : true,
                    attributeOldValue : true,
                    characterData : true,
                    characterDataOldValue : true
                });
            }
            else if( eventListenerSupported ){
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        };
    }());
    var js2uixChangeDateType = function(value){
        value = String(value);
        var isHaveTime = value.split(' ');
        var dateParser = function(val){
            var result = [];
            val = val.replace(/[^(가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9)]/gi, '');
            result[0] = parseInt(val.substr(0,4));
            result[1] = parseInt(val.substr(4,2))-1;
            result[2] = parseInt(val.substr(6,2));
            return result;
        };
        var timeParser = function(val){
            var result = [];
            val = val.replace(/[^(가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9)]/gi, '');
            result[0] = parseInt(val.substr(0,2));
            result[1] = parseInt(val.substr(2,2));
            result[2] = parseInt(val.substr(4,2));
            return result;
        };
        if( value.indexOf('-') !== -1 ){
            var isDateArray = value.split('-');
            if( isDateArray.length < 3 ){
                var currentYear = new Date();
                if( isDateArray[0].length === 2 ){
                    return new Date(currentYear.getFullYear()+'-'+value)
                } else if( isDateArray[0].length === 4 ) {
                    return new Date(value+'-01');
                }
            } else {
                return new Date(value)
            }
        } else {
            var result = [];
            if( isHaveTime.length === 2){
                result = dateParser(isHaveTime[0]).concat(timeParser(isHaveTime[1]));
            } else {
                result = dateParser(value).concat(timeParser('000001'));
            }
            return new Date(result[0],result[1],result[2],result[3],result[4],result[5]);
        }
    };

    js2uix = function (select){return new js2uix.fx.init(select);};
    js2uix.fx = js2uix.prototype = {
        js2uix : ModuleVersion,
        constructor : js2uix,
        query : function ( select, result ){
            var argArray = Array.prototype.slice.call(arguments);
            var newNode = js2uix.extend([], argArray.shift());
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
    js2uix.fx.init = function (select){
        if ( !select ) { return this; }
        if ( typeof select === 'string' ){
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
                        select = [virtualDom];
                        if( select[0].nodeName.toLowerCase() === ModuleName){
                            select = select[0].childNodes;
                        }
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
                return js2uix.loaded( this, select );
            } else if ( select === window ){
                select = [window];
            }
        }
        return js2uix.fx.query( select, this );
    };
    js2uix.fx.init.prototype = js2uix.fx;
    js2uix.extend = js2uix.fx.extend = function (){
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
    js2uix.extend({
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
            var typeIs = js2uix.typeIs( object );
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
        },
        replaceAll   : function( strTemp, strValue1, strValue2 ){
            while(1){
                if( strTemp.indexOf(strValue1) != -1 ){
                    strTemp = strTemp.replace(strValue1, strValue2);
                } else {
                    break;
                }
            }
            return strTemp;
        },
        codeToString : function( string ){
            if( string ){
                return decodeURI(this.replaceAll(string, "\\", "%"));
            }
        },
        stringToCode : function( string ){
            if( string ){
                return encodeURI(this.replaceAll(string, "\\", "%"));
            }
        }
    });
    js2uix.extend({
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
        setAttr : function ( item, name, value ){
            if( item ){
                if( typeof name === 'object' ){
                    for ( var key in name ){
                        this.setAttr(item, key, name[key])
                    }
                } else if ( typeof name === 'string'){
                    if( !value ){ value = ''; }
                    if( typeof value === 'number' ){
                        value = String(value);
                    }
                    item.setAttribute(name, value);
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
    js2uix.fx.extend({
        addId : function ( name ){
            js2uix.addId( this[0], name );
            return this;
        },
        removeId : function ( name ){
            js2uix.removeId( this[0], name );
            return this;
        },
        hasId : function ( name ){
            return js2uix.hasId( this[0], name );
        },
        addClass : function ( name ){
            for( var i=0; i < this.length; i++ ){
                js2uix.addClass( this[i], name );
            }
            return this;
        },
        removeClass : function ( name ){
            for( var i=0; i < this.length; i++ ){
                js2uix.removeClass( this[i], name );
            }
            return this;
        },
        hasClass : function ( name ){
            return js2uix.hasClass( this[0], name );
        },
        setAttr : function ( name, value ){
            for ( var i=0; i < this.length; i++ ){
                js2uix.setAttr(this[i], name, value);
            }
            return this;
        },
        removeAttr : function ( name ){
            for ( var i=0; i < this.length; i++ ){
                js2uix.removeAttr(this[i], name);
            }
            return this;
        },
        getAttr : function ( name ){
            if( this.length === 0 ){ return undefined; }
            return js2uix.getAttr(this[0], name);
        },
        index : function(){
            if( this.length > 0 ){
                var child = this[0].parentNode.children;
                for(var i=0; i < child.length; i++){
                    if( this[0] === child[i] ){
                        return i;
                    }
                }
            }
            return undefined;
        }
    });

    js2uix.extend({
        loop : function ( item, callback ){
            var length, i = 0;
            if ( js2uix.isArray( item ) ) {
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
            var length, i = 0, newObject = !js2uix.isArray(obj)?{}:[];
            js2uix.extend(newObject, obj, true);
            if ( js2uix.isArray( obj ) ) {
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
            return js2uix(item);
        },
        createDom : function(){
            var dom;
            var js2uixDom;
            var arg = arguments;
            var tagType = arg[0];
            var options = arg[1];
            var js2uixObject = arg[2];
            if( tagType && typeof tagType === 'string' ){
                dom = DOC.createElement(tagType);
                js2uixDom = js2uix(dom);
                if( options && typeof options === 'object' ){
                    for( var name in options ){
                        var item = options[name];
                        if ( name === 'className' ){
                            js2uix.addClass(dom, item);
                        }
                        if ( name === 'idName' ){
                            js2uix.addId(dom, item);
                        }
                        if ( name === 'attributes' && typeof item === 'object' ){
                            for ( var attr in item ){
                                js2uix.setAttr(dom, attr, item[attr]);
                            }
                        }
                        if ( name === 'styles' && typeof item === 'object' ){
                            js2uixDom.css(item);
                        }
                        if ( name === 'content' ){
                            js2uixDom.html(item);
                        }
                    }
                }
            }
            return (typeof Boolean(js2uixObject) && js2uixObject)?js2uix(dom):dom;
        },
        uiComponent : new js2uixConstModule()
    });
    js2uix.fx.extend({
        loop : function ( callback ){
            return js2uix.loop( this, callback );
        },
        loaded : function ( callback ){
            if ( callback && typeof callback === 'function' ){
                js2uix.loaded( this, callback );
            }
        },
        find : function ( name ){
            var result = [];
            if( name ){
                if( typeof name === 'string' ){
                    result = this[0].querySelectorAll(name);
                } else if ( typeof name === 'object' && name.name === ModuleName ){
                    js2uix.loop(this, function(){
                        var allChild = this.querySelectorAll("*");
                        for(var i=0; i<allChild.length; i++){
                            var findChild = allChild[i];
                            js2uix.loop(name, function(){
                                if( this === findChild ){result.push(this);}
                            });
                        }
                    });
                }
            }
            return js2uix(result);
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
            return js2uix(result);
        },
        parents : function ( name ){
            var result = [];
            if( name && typeof name === 'string'){
                var parent = this[0].parentNode;
                var isIdOrClassType = name.match(/^#|^\./gi);
                if( isIdOrClassType ){
                    while ( parent && parent.nodeName.toLowerCase() !== 'html' ){
                        var findName = name.substr(1, name.length);
                        if( js2uix.hasClass(parent, findName) || js2uix.hasId(parent, findName) ){
                            result = parent;
                            break;
                        } else {
                            parent = parent.parentNode;
                        }
                    }
                } else {
                    while ( parent && parent.nodeName.toLowerCase() !== 'html' ){
                        if( parent.nodeName.toLowerCase() === name ){
                            result = parent;
                            break;
                        } else {
                            parent = parent.parentNode;
                        }
                    }
                }
            }
            return js2uix(result);
        },
        hasParents : function ( name ){
            var result = false;
            if( name && typeof name === 'string'){
                var parent = this[0].parentNode;
                var isIdOrClassType = name.match(/^#|^\./gi);
                if( isIdOrClassType ){
                    while ( parent && parent.nodeName.toLowerCase() !== 'html' ){
                        var findName = name.substr(1, name.length);
                        if( js2uix.hasClass(parent, findName) || js2uix.hasId(parent, findName) ){
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
                    if( js2uix.hasClass(children[i], findName) || js2uix.hasId(children[i], findName) ){
                        result.push(children[i]);
                    }
                }
            } else if ( !name ) {
                for (i = 0; i < children.length; i++ ){
                    result.push(children[i]);
                }
            }
            return js2uix(result);
        },
        hasChild : function ( name ){
            return this.find(name).length > 0 && name && typeof name === 'string';
        },
        nextNode : function (){
            return (this.length > 0 && this[0].nextElementSibling)?js2uix(this[0].nextElementSibling):this;
        },
        prevNode : function (){
            return (this.length > 0 && this[0].previousElementSibling)?js2uix(this[0].previousElementSibling):this;
        },
        firstNode : function (){
            return (this.length < 2)?this:js2uix(this[0]);
        },
        lastINode : function (){
            return (this.length < 2)?this:js2uix(this[this.length-1]);
        },
        siblingNodes : function(){
            if( this.length > 0 ){
                var target = this[0];
                var allSiblings = target.parentNode.childNodes;
                var findSiblingNode = [];
                for( var i=0; i<allSiblings.length; i++ ){
                    if( target !== allSiblings[i] ){
                        findSiblingNode.push(allSiblings[i]);
                    }
                }
                try {
                    return js2uix(findSiblingNode);
                } finally {
                    allSiblings = null;
                    findSiblingNode = null;
                }
            }
        },
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
            if( this.length > 0 ){
                for( var i = 0; i < this.length; i++ ){
                    this[i].innerHTML = '';
                }
                if( value ){
                    this.append( value );
                }
            }
            return this;
        },
        text : function ( value ){
            if( this.length > 0 ){
                if( !value && value !== '' ){
                    return this[0].innerText;
                } else if( typeof value === 'string' || typeof value === 'number'  || value === '' ) {
                    for( var i = 0; i < this.length; i++ ){ this[i].innerText = value; }
                }
            }
            return this;
        },
        value : function( value ){
            if( !value ){
                return this[0].value;
            } else {
                if( typeof value !== 'object' || typeof value !== 'function' ){
                    for(var i=0; i<this.length; i++){
                        this[i].value = value;
                    }
                }
                return this;
            }
        },
        empty : function (){
            return this.html();
        },
        replace : function ( item ){
            var result = this;
            var target = this[0];
            var parent = target.parentNode;
            if( item && ( typeof item === 'string' || typeof item === 'object') ){
                if ( typeof item === 'string' ){
                    var stringType = js2uixCheckValidation(item);
                    if( stringType.idClass || stringType.spType || stringType.tagType ){
                        result = js2uix(item);
                    } else {
                        result = js2uix(DOC.createTextNode(item));
                    }
                } else {
                    if ( item.name && item.name === ModuleName ){
                        result = item;
                    } else if ( item.nodeName ){
                        result = js2uix[item];
                    }
                }
                js2uix(target).after(result);
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
        },
        clone : function(deep){
            var findElement = [];
            try {
                js2uix.loop(this, function(){ findElement.push( this.cloneNode(deep||true) ); });
                return js2uix(findElement);
            } finally {
                findElement = null;
            }
        }
    });

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
    js2uix.fx.extend({
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
            if( this ){return js2uixDomStyleApply(this, 'width', value);}
        },
        height : function (value){
            if( this ){return js2uixDomStyleApply(this, 'height', value);}
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
        },
        fadeIn : function(speed, fnc){
            js2uix.loop(this, function(){
                var elm = this;
                elm.style.display = "block";
                elm.style.opacity = 0;
                var last = +new Date();
                (function tick() {
                    elm.style.opacity = +elm.style.opacity+((new Date()-last)/(speed||300));
                    last = +new Date();
                    if (+elm.style.opacity < 1) {
                        if( window.requestAnimationFrame ){
                            requestAnimationFrame(tick);
                        } else {
                            setTimeout(tick, 16);
                        }
                    }
                    if( +elm.style.opacity > 1.0 ){
                        elm.style.opacity = 1.0;
                        if(typeof fnc === "function" ){ fnc(); }
                    }
                }());
            });
            return this;
        },
        fadeOut : function(speed, fnc){
            js2uix.loop(this, function(){
                var elm = this;
                var last = +new Date();
                elm.style.opacity = 1;
                (function tick() {
                    elm.style.opacity = +elm.style.opacity - ((new Date()-last)/(speed||500));
                    last = +new Date();
                    if (+elm.style.opacity > 0) {
                        if( window.requestAnimationFrame ){
                            requestAnimationFrame(tick);
                        } else {
                            setTimeout(tick, 16);
                        }
                    }
                    if( +elm.style.opacity < 0.1 ){
                        elm.style.display = "none";
                        elm.style.opacity = 0;
                        if(typeof fnc === "function" ){ fnc(); }
                    }
                }());
            });
            return this;
        },
        show : function(){
            if(this && this.length > 0 ){
                for(var i=0; i<this.length; i++){
                    var result = window.getComputedStyle(this[i],null).getPropertyValue("display");
                    if( result === '' || result !== 'inline-block'){result = 'block';}
                    this[i].style.display = result;
                }
            }
            return this;
        },
        hide : function(){
            if(this && this.length > 0 ){
                for(var i=0; i<this.length; i++){
                    this[i].style.display = 'none';
                }
            }
            return this;
        }
    });

    var js2uixFxAddEventHandler = function (item, param){
        var eventNameArray = param[0].split('.');
        var eventKeyName = eventNameArray[1];
        js2uix.loop(item, function(){
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
    var js2uixFxAddEventObserverHandler = function(item, param){
        var eventName = param[0];
        var findName = param[1];
        var handler = param[2];
        if( eventName && findName && handler){
            js2uix.loop(item, function(){
                var parent = js2uix(this);
                var find = parent.find(findName);
                find.removeEvent(eventName, handler);
                if( find.length > 0 ){ js2uixFxAddEventHandler(find, param); }
                js2uixDomObserver(this, function(change){
                    if( change.type === "childList" || change.type === "attributes" ) {
                        if( change.addedNodes.length > 0 || change.removedNodes.length > 0 ){
                            for(var i=0; i<change.addedNodes.length; i++){
                                var addNode = change.addedNodes[i];
                                if( addNode.nodeType === 1 ){
                                    js2uixFxAddEventObserverHandler(item, param);
                                }
                            }
                        }
                    }
                });
            });
        }
    };
    var js2uixFxRemoveEventHandler = function (item, param){
        js2uix.loop(item, function(){
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
                    if( eventName === 'all' || eventKeyName === 'js2uix_only' ){
                        for( var eventKey in eventData ){
                            for( i = 0; i < eventData[eventKey].length; i++ ){
                                crtEvent = eventData[eventKey][i];
                                this.removeEventListener(eventKey, crtEvent['handler']);
                                crtEvent['removed'] = true;
                            }
                        }
                    } else {
                        if( eventData[eventName] ){
                            for( i = 0; i < eventData[eventName].length; i++ ){
                                crtEvent = eventData[eventName][i];
                                if( crtEvent.eventKey === eventKeyName ){
                                    this.removeEventListener(eventName, eventData[eventName][i]['handler']);
                                    eventData[eventName][i]['removed'] = true;
                                }
                            }
                        }
                    }
                } else if ( length === 2 && typeof first === 'string' && (typeof last === 'function' || typeof last === 'object') ){
                    if( eventData[eventName] ){
                        for( i = 0; i < eventData[eventName].length; i++ ){
                            crtEvent = eventData[eventName][i];
                            if( crtEvent.eventKey === eventKeyName && last === eventData[eventName][i]['handler'] ){
                                this.removeEventListener(eventName, eventData[eventName][i]['handler']);
                                eventData[eventName][i]['removed'] = true;
                            }
                        }
                    }
                }
            }
        });
        js2uix.loop(item, function(){
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
    js2uix.fx.extend({
        addEvent : function (){
            var arg = arguments;
            var length = arg.length;
            if ( length > 0 ){
                var firstType = typeof arg[0];
                var lastType = typeof arg[arg.length-1];
                if ( firstType === 'object' ){
                    for ( var name in arg[0] ){
                        if( arg.length === 1 ){
                            js2uixFxAddEventHandler(this, [name, arg[0][name]]);
                        }else if( arg.length === 2 && typeof lastType === 'string' ){
                            js2uixFxAddEventObserverHandler(this, [name, arg[1], arg[0][name]]);
                        }
                    }
                } else {
                    if( firstType === 'string' && (lastType === 'function' || lastType === 'object') ){
                        if( length === 2 ){
                            js2uixFxAddEventHandler(this, arg);
                        } else if ( length === 3 ){
                            js2uixFxAddEventObserverHandler(this, arg);
                        }
                    }
                }
            }
            return this;
        },
        removeEvent : function (){
            var arg = arguments;
            var length = arg.length;
            if( length < 1 ){
                js2uixFxRemoveEventHandler(this);
            } else {
                js2uixFxRemoveEventHandler(this, arg);
            }
            return this;
        }
    });

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
            opts_obj = js2uix.extend(opts_obj, option);
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
                js2uix.loop(data, function(key, value){
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

            request.open( option.method, option.url, option.async);

            if( option.data && !option.upload){
                request.setRequestHeader("Content-type", option.contentType);
            }

            if ( request.upload && option.upload ) {
                this._setUploadHandler(request, option);
            }

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

            request.onerror = function() {
                if( option.error && typeof option.success == "function" ){
                    option.error();
                    _module._onceMemory.error = true;
                    _module._onceMemory.success = null;
                }
            };

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
                js2uix.loop(inputFile, function(){
                    var files = this.files;
                    js2uix.loop(files, function(key, value) {
                        dataQuery.append(key, value);
                        appendNum++;
                    });
                });
                js2uix.loop(etcForms, function(){
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
                js2uix.loop(state, function(name, value){
                    this.state[name] = value;
                }.bind(this));
            } else if (state && value && typeof state === 'string'){
                this.state[state] = value;
            }
            this.setUpdateState();
        },
        setUpdateState : function (){
            this.setRender();
            if (typeof this.onStateWillChange === 'function' ){
                this.onStateWillChange();
            }
        },
        setProps : function (props){
            if (props && typeof props === 'object' && !Array.isArray(props)){
                js2uix.loop(props, function(name, value){
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
                var renderDom = js2uix(this.render());
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
            js2uix.loop(param, function(name, value){
                this.domState[name] = value;
            }.bind(this));
        },
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
                            js2uix.loop(maxChild, function(num){
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
                                js2uix.loop(findWillRemoveNode, function(){
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
    js2uix.extend({
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
                    js2uix.loop(link, function(num, value){
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
            js2uix.uiComponent.setModule(name, data);
        },
        Import : function(name){
            return js2uix.uiComponent.getModule(name);
        },
        Render : function(){
            var arg = arguments;
            if( arg && arg.length > 1){
                var parent = js2uix(arg[arg.length-1])[0];
                for(var i=0; i<arg.length-1; i++){
                    var object = arg[i];
                    var dom = object.$$Dom;
                    if( dom && parent){
                        js2uix(parent).append(dom);
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
    js2uix.fx.extend({
        AjaxFrom : function(opt){
            return new js2uixAjax(this, opt);
        }
    });

    var ROOT = js2uix('html');
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
    var js2uixToolChart = function(element, props){
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
            shadeColor : '',
            topPos: 40,
            rightPos: 30,
            bottomPos: 30,
            leftPos: 30
        };
        this.state = {
            autoMode    : false,
            clear       : false,
            colorArray  : ["#add5d7", "#47acb1", "#ffe8af", "#ffcd33", "#f9aa7b", "#f26522", "#7fb6ff", "#7876ff", "#a5a8aa", "#676766"],
            dataLength  : 0,
            idName      : "",
            max_width   : 1740,
            min_width   : 200,
            min_height  : 100,
            resize      : false,
            uniqueId    : '',
            uniqueName  : '',
            update      : false
        };
        this.axis = null;
        this.init(props);
        return {
            name : 'js2uix-d3-chart',
            setData : this.setData.bind(this)
        }
    };
    js2uixToolChart.prototype = {
        uiChartClass : 'js2uix-chart',
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
                    return "translate(0," + ((i * 20)-20) + ")";
                });
            try {
                legend.append("rect")
                    .attr("x", svg.width - 15)
                    .attr("width", 15)
                    .attr("height", 15)
                    .attr("fill", function(d){
                        return color(d);
                    });
                legend.append("text").attr("style", "font-size:12px")
                    .attr("x", svg.width-20)
                    .attr("y", 8)
                    .attr("dy", "0.22em")
                    .text(function(d) { return d; });
                legend.exit().remove();
            } finally {
                svg = null;
                keys = null;
            }
        },
        js2uixSingleAreaType : function(param){
            var keyX = "axisX";
            var keyY = "axisY";
            var parseData = param.map( function( dt ) {return {axisX : dt[this.axis.axisX], axisY : dt[this.axis.axisY]}}.bind(this));
            var minMaxX = window.d3.extent(parseData.map(function(dt) {return dt[keyX];}), function(dt) {return js2uixChangeDateType(dt); });
            var minMaxY = window.d3.extent(parseData.map(function(dt) {return dt[keyY];}), function(dt) {return parseInt(dt);});
            try {
                if( !this.state.d3_area ){ this.state.d3_area = d3.area(); }
                if( this.props.lineCurve ){ this.state.d3_area.curve(window.d3.curveBasis); }
                if( this.axis.typeAxisX === "date" ){
                    this.d3.x = window.d3.scaleTime().domain([minMaxX[0], minMaxX[1]]).rangeRound([0, this.d3.width]);
                    this.state.d3_area.x(function(dt) { return this.d3.x(js2uixChangeDateType(dt[keyX])); }.bind(this));
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
                    (this.axis.typeAxisX === "date")
                        ?this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x).ticks( window.d3[this.axis.timeAxisX[0]].every(this.axis.timeAxisX[1])).tickFormat(function(dt){return timeFormat(dt)}))
                        :this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x));
                    this.setCommonChartInfoString("basic");
                    this.setCommonChartAxisXNode();
                }
                this.nodes.pathArea.datum(parseData).transition().duration(this.props.duration).attr('d', this.state.d3_area);
                this.nodes.pathArea.exit().remove();
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
            var minMaxX = window.d3.extent(axisXArr, function(dt) {return js2uixChangeDateType(dt); });
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
                    js2uix.loop(param, function(key, val){
                        var self = this;
                        parseData.push(val.map( function( dt ) {return {axisX : dt[self.axis.axisX], axisY : dt[self.axis.axisY]};}));
                    }.bind(this));
                }
                js2uix.loop(param, function(key, value){
                    var self = this;
                    var max = window.d3.max(value, function(dt){
                        return (dt[self.axis.axisY]);
                    });
                    if( maxAxisY < max ){ maxAxisY = max + (max*0.2); }
                    compareKey.push(key);
                }.bind(this));
                if( this.axis.typeAxisX === "date" ){
                    this.d3.x = window.d3.scaleTime().domain([minMaxX[0], minMaxX[1]]).rangeRound([0, this.d3.width]);
                    this.state.d3_area.x(function(dt) {
                        return this.d3.x(js2uixChangeDateType(dt[keyX]));
                    }.bind(this));
                    this.state.d3_line.x(function(dt) {
                        return this.d3.x(js2uixChangeDateType(dt[keyX]));
                    }.bind(this));
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
                    (this.axis.typeAxisX === "date")
                        ?this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x).ticks( window.d3[this.axis.timeAxisX[0]].every(this.axis.timeAxisX[1])).tickFormat(function(dt){return timeFormat(dt)}))
                        :this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x));
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
            var minMaxX = window.d3.extent(parseData.map(function(dt) {return dt[keyX];}), function(dt) {return js2uixChangeDateType(dt);});
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
                    this.state.d3_line.x(function(dt) {return this.d3.x(js2uixChangeDateType(dt[keyX]));}.bind(this));
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
                    (this.axis.typeAxisX === "date")
                        ?this.nodes.axisX_g.call(window.d3.axisBottom(this.d3.x).ticks( window.d3[this.axis.timeAxisX[0]].every(this.axis.timeAxisX[1])).tickFormat(function(dt){return timeFormat(dt)}))
                        :this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x));
                    this.setCommonChartInfoString("basic");
                    this.setCommonChartAxisXNode();
                }
                this.nodes.pathArea.datum(parseData).transition().duration(this.props.duration).attr('d', this.state.d3_line);
                this.nodes.pathArea.exit().remove();
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
            var minMaxX = window.d3.extent(axisXArr, function(dt){return js2uixChangeDateType(dt);});
            var pathArea, compareKey = [];
            var parseData = param;
            try {
                if( !this.state.d3_line ){this.state.d3_line = window.d3.line();}
                if( this.props.lineCurve ){this.state.d3_line.curve(window.d3.curveBasis);}
                if( !Array.isArray(param) ){
                    parseData = [];
                    js2uix.loop(param, function(key, val){
                        var self = this;
                        parseData.push(val.map( function( dt ) {return {axisX : dt[self.axis.axisX], axisY : dt[self.axis.axisY]};}));
                    }.bind(this));
                }
                js2uix.loop(param, function(key, value){
                    var self = this;
                    var max = window.d3.max(value, function(dt){
                        return (dt[self.axis.axisY]);
                    });
                    if( maxAxisY < max ){maxAxisY = max + (max*0.2);}
                    compareKey.push(key);
                }.bind(this));
                if( this.axis.typeAxisX === "date" ){
                    this.d3.x = window.d3.scaleTime().domain([new Date(minMaxX[0]), new Date(minMaxX[1])]).rangeRound([0, this.d3.width]);
                    this.state.d3_line.x(function(dt) {return this.d3.x(js2uixChangeDateType(dt[keyX]));}.bind(this));
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
                    (this.axis.typeAxisX === "date")
                        ?this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x).ticks( window.d3[this.axis.timeAxisX[0]].every(this.axis.timeAxisX[1])).tickFormat(function(dt){return timeFormat(dt)}))
                        :this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x));
                    this.setCommonCompareInfo(this.d3, compareKey, color);
                    this.setCommonChartInfoString("basic");
                    this.setCommonChartAxisXNode();
                } else {
                    pathArea = this.nodes.pathNode.data(parseData);
                }
                pathArea.transition().duration(this.props.duration).attr('d', this.state.d3_line);
                pathArea.exit().remove();
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
            var minMaxX = window.d3.extent(currentData.map(function(dt) {return dt[keyX];}), function(dt) {return js2uixChangeDateType(dt);});
            var minMaxY = window.d3.extent(axisYArr, function(dt) {return parseInt(dt);});
            var rectNode;
            try {
                if( this.axis.typeAxisX === "date" ){this.d3.x2 = window.d3.scaleTime().domain([new Date(minMaxX[0]), new Date(minMaxX[1])]).rangeRound([0, this.d3.width]);}
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
                    rectNode = this.nodes.pathArea.selectAll("g").data(currentData, function(dt) {return dt[keyX];}).enter()
                        .append("rect")
                        .attr("class", "ui-chart-bar")
                        .attr("width", this.d3.x.bandwidth())
                        .attr("x", function(dt){ return this.d3.x(dt[keyX]); }.bind(this))
                        .attr("fill", function(dt){return color(dt[keyX]);})
                        .attr('fill-opacity', this.props.colorAlpha)
                        .attr("data-name", function(dt) {return dt[keyX];})
                        .attr("data-value", function(dt) {return dt[keyY];});
                    this.nodes.rectNode = this.d3.g.select('g.graphBox').selectAll("rect.ui-chart-bar");
                    this.axis.typeAxisX === "date"
                        ?this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x2).ticks( window.d3[this.axis.timeAxisX[0]].every(this.axis.timeAxisX[1])).tickFormat(function(dt){return timeFormat(dt);}))
                        :this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x));
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
                js2uix.loop(param, function(key, value){
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
                    this.axis.typeAxisX === "date"
                        ?this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x).ticks( window.d3[this.axis.timeAxisX[0]].every(this.axis.timeAxisX[1])).tickFormat(function(dt){return timeFormat(js2uixChangeDateType(dt));}) )
                        :this.nodes.axisX_g.call( window.d3.axisBottom(this.d3.x));
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
                    this.state.radius = Math.min(chartSizeW, chartSizeH)/2-15;
                    this.state.arc1 = window.d3.arc().outerRadius(this.state.radius*0.9).innerRadius(this.state.radius*(1-this.props.circleThickNum));
                    this.state.outerArc = window.d3.arc().innerRadius(this.state.radius).outerRadius(this.state.radius*0.9);
                    this.state.pie = window.d3.pie().sort(null).value( function(d) { return d[self.axis.axisY]; });
                    this.state.axisXFnc = function(d){ return d.data[self.axis.axisX]; };
                    this.state.midAngle = function(d){ return d.startAngle + (d.endAngle - d.startAngle)/2; };
                    this.d3.g = this.d3.g.attr("transform", "translate(" + chartSizeW/2 + "," + chartSizeH/2 + ")");
                    this.d3.g.append("g").attr("class", "labels");
                    this.d3.g.append("g").attr("class", "lines");
                    this.nodes.title_g = this.d3.g.append("g").attr("class", "titleBox").append("text");

                    sliceNode = this.d3.g.append("g").attr("class", "slices ui-"+this.state.uniqueId).selectAll("path.slice").data(this.state.pie(param), this.state.axisXFnc).enter().insert("path").style("fill", function(d) { return color(d.data[self.axis.axisX]); }).attr("class", "slice").attr('fill-opacity', this.props.colorAlpha);
                    circleText = this.d3.g.select(".labels").selectAll("text")
                        .data(this.state.pie(param), this.state.axisXFnc).enter()
                        .append("text").attr("style", "font-size:12px").attr("dy", ".35em").attr("opacity", 1);
                    polyLine = this.d3.g.select(".lines").selectAll("polyline")
                        .data(this.state.pie(param), this.state.axisXFnc).enter()
                        .append("polyline").attr("opacity", 0.3).attr("stroke", 'black').attr("stroke-width", '1px').attr("fill", 'none').attr("stroke-opacity", 1);

                    if( this.props.groupInfoBox ){
                        legendNode = this.d3.g.append("g").attr("class", "infoBox").attr("text-anchor", "end").selectAll("g").data(param.map(function(dt){ return d3.values(dt)[0]; })).enter().append("g").attr("transform", function(d, i) { return "translate(0," + ((i * 20)) + ")"; });
                        legendNode.append("rect").attr("x", -this.d3.width*0.5+10).attr("y", -this.d3.height*0.5+30).attr("width", 15).attr("height", 15).attr("fill", color);
                        legendNode.append("text").attr("style", "font-size:12px").attr("text-anchor", "start").attr("x", -this.d3.width*0.5+35).attr("y", -this.d3.height*0.5+38).attr("dy", "0.32em").text(function(d) {return d;});
                        legendNode.exit().remove();
                    }

                    this.nodes.slice = this.d3.g.selectAll("path.slice");
                    this.nodes.circleText = this.d3.g.select(".labels").selectAll("text");
                    this.nodes.polyLine = this.d3.g.select(".lines").selectAll("polyline");
                    this.setCommonChartInfoString("circle");
                } else {
                    sliceNode = this.nodes.slice.data(this.state.pie(param), this.state.axisXFnc);
                    circleText = this.nodes.circleText.data(this.state.pie(param), this.state.axisXFnc);
                    polyLine = this.nodes.polyLine.data(this.state.pie(param), this.state.axisXFnc);
                }
                sliceNode.transition().duration(this.props.duration).attrTween("d", function(d) {
                        this._current = this._current || d;
                        var interpolate = window.d3.interpolate(this._current, d);
                        if( !self.state.update ){ interpolate = window.d3.interpolate({ startAngle: 0, endAngle: 0 }, this._current); }
                        this._current = interpolate(0);
                        return function(t) {
                            return self.state.arc1(interpolate(t));
                        };
                    });
                sliceNode.exit().remove();
                circleText.text(function(d){ return d.data[self.axis.axisY]; }).transition().duration(this.props.duration).attrTween("transform", function(d) {
                        this._current = this._current || d;
                        var interpolate = window.d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            var d2 = interpolate(t);
                            var pos = self.state.outerArc.centroid(d2);
                            pos[0] = self.state.radius * (self.state.midAngle(d2) < Math.PI ? 1 : -1);
                            return "translate("+ pos +")";
                        };
                    }).styleTween("text-anchor", function(d){
                        this._current = this._current || d;
                        var interpolate = window.d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {return self.state.midAngle(interpolate(t)) < Math.PI ? "start":"end";};
                    });
                circleText.exit().remove();
                polyLine.transition().duration(this.props.duration)
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
            var num_chartSizeW;
            var num_chartSizeH;
            if( !parentWrap ){
                num_chartSizeW = '100%';
                num_chartSizeH = '100%';
            } else {
                num_chartSizeW = (parentWrap.width)-(parentWrap.paddingL+parentWrap.paddingR);
                num_chartSizeH = (parentWrap.height)-(parentWrap.paddingT+parentWrap.paddingB);
            }
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
                    this.d3.margin = {
                        top : this.props.topPos,
                        right : this.props.rightPos,
                        bottom : this.props.bottomPos,
                        left : this.props.leftPos
                    };
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
                js2uix.extend(this.props, props);
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
    js2uixToolChart.prototype.constructor = js2uixToolChart;

    var js2xixElementResult = function(target){
        if( target ){
            if( typeof target === 'string' ){
                return js2uix(js2uix(target)[0]);
            } else if ( target.name && target.name === ModuleName ){
                return target;
            } else if ( target.nodeName ){
                return js2uix(target);
            }
        }
    };
    var js2uixToolGrid = function(element){
        this.element = element;
        this.idName ='';
        this.props = {
            fieldTitle : null,
            fieldName : null,
            gridFixWidth : null,
            gridFixHeight : null,
            gridMinWidth : null,
            gridMaxWidth : null,
            listCountNum : [10,20,30],
            fieldWidth : null,
            appendLayoutStyle : true,
            availableMini : false,
            bodyTextAlign : 'center',
            disableSelection : false,
            optionCheckBox : false,
            optionNumbering : false,
            onChangeStateEvent : null,
            onCustomizedField : null,
            onCustomizedEvent : null
        };
        this.state = {
            totalCountNum : 0,
            totalPageNum : 1,
            currentPageNum : 1,
            listCountNum : 10,
            displayItemNum : 0,
            orderInfo : {},
            gridWidth : 0,
            gridAdjustGap : 0,
            gridCalcWidth : 0,
            girdCalcUlWidth : 0,
            contentHead : null,
            contentBody : null,
            contentBodyList : null,
            contentFoot : null,
            listSelect : null,
            totalItem : null,
            displayItem : null,
            totalPage : null,
            currentPage : null,
            loadBox : null,
            optionCheckbox : null,
            isControl : true
        };
        this.gridData = null;
        return {
            name : this.js2uixName,
            init : this.init.bind(this),
            setData : this.setData.bind(this)
        }
    };
    js2uixToolGrid.prototype = {
        js2uixName : "js2uix-grid",
        setLoadEffectStyle : function(bool){
            if( bool ){
                this.state.isControl = false;
                this.state.loadBox[0].style.display = 'block';
                this.state.loadBox[0].style.opacity = 1;
            } else {
                this.state.loadBox.fadeOut(450, function(){
                    this.state.isControl = true;
                }.bind(this));
            }
        },
        setDefaultRender : function(){
            if( this.element.length === 1 ){
                this.element.addClass(this.js2uixName);
                if( this.props.disableSelection ){
                    this.element.addClass('disableSelection');
                }
                if( this.props.gridFixWidth && typeof this.props.gridFixWidth === 'number' ){
                    this.element.css('width', this.props.gridFixWidth)
                }
                if( this.props.gridMinWidth && typeof this.props.gridMinWidth === 'number' ){
                    this.element.css('min-width', this.props.gridMinWidth)
                }
                if( this.props.gridMaxWidth && typeof this.props.gridMaxWidth === 'number' ){
                    this.element.css('max-width', this.props.gridMaxWidth)
                }
                if( this.props.gridFixHeight && typeof this.props.gridFixHeight === 'number' ){
                    this.element.css('height', this.props.gridFixHeight)
                }
                if( this.props.availableMini ){
                    this.element.addClass('availableMini');
                }
                return true;
            }
        },
        setAppendElement : function(element){
            this.element.append(element);
        },
        setCreateCssStyle : function(){
            if( this.props.appendLayoutStyle ){
                if( this.props.fieldWidth && Array.isArray(this.props.fieldWidth) ){
                    var oldStyle = js2uix('style[data-target='+this.idName+']');
                    var widthStyle = '<style data-target="'+this.idName+'">\n';
                    for(var i=0; i<this.props.fieldWidth.length; i++){
                        var idx = i+1;
                        var fieldWidth = this.props.fieldWidth[i];
                        if(typeof fieldWidth === 'string' && fieldWidth === 'auto' ){
                            fieldWidth = (this.state.girdCalcUlWidth-this.state.gridCalcWidth)+'px';
                            fieldWidth = 'calc(100% - '+this.state.gridCalcWidth+'px)';
                        } else {
                            fieldWidth = fieldWidth+'px';
                        }
                        widthStyle += '#'+this.idName+'.js2uix-grid ul.js2uix-head-row li:nth-child('+(idx)+'),\n';
                        widthStyle += '#'+this.idName+'.js2uix-grid ul.js2uix-body-row li:nth-child('+(idx)+'){width:'+fieldWidth+'}\n';
                    }
                    widthStyle += '</style>';
                    if( oldStyle.length > 0 ){ oldStyle.remove(); }
                    this.element.before(widthStyle)
                }
            }
        },
        setGridFieldStyle : function(type){
            if( !this.props.appendLayoutStyle ){
                if( this.props.fieldWidth && Array.isArray(this.props.fieldWidth) ){
                    var module = this;
                    var target = this.state.contentHead;
                    if( type === 'body' ){ target = this.state.contentBody; }
                    target = target.find('ul');
                    if( !this.state.girdCalcUlWidth ){ this.state.girdCalcUlWidth = target.width(); }
                    js2uix.loop(target, function(){
                        var thisItems = this.children;
                        for( var i=0; i<thisItems.length; i++){
                            var fieldWidth = module.props.fieldWidth[i];
                            if(typeof fieldWidth === 'string' && fieldWidth === 'auto' ){
                                fieldWidth = (module.state.girdCalcUlWidth-module.state.gridCalcWidth)+'px';
                            } else {
                                fieldWidth = fieldWidth+'px';
                            }
                            thisItems[i].style.width = fieldWidth;
                        }
                    });
                }
            }
        },
        setAdjustStyleLayout : function(){
            this.state.gridAdjustGap = this.state.contentBody.width() - this.state.contentBodyList.width();
            this.state.contentHead[0].children[0].style.paddingRight = this.state.gridAdjustGap+'px';
            if( this.state.contentBodyList ){
                this.state.contentBodyList.setAttr('data-overflow','false');
                if( this.state.contentBodyList.height() - this.state.contentBody.height() >= 0 ){
                    this.state.contentBodyList.setAttr('data-overflow','true');
                }
            }
        },
        setDefaultOptionState : function(){
            if( this.state.optionCheckbox ){
                this.state.optionCheckbox[0].firstChild.checked = false;
            }
        },
        setGridDefaultState : function(){
            var calcWidth = 0;
            this.idName = ( !this.element[0].id )?this.idName = ModuleName+'Grid'+js2uixUniqueId():this.element[0].id;
            if( this.props.fieldWidth ){
                if( this.props.optionCheckBox ){
                    this.props.fieldWidth.unshift(35)
                }
                if( this.props.optionNumbering ){
                    this.props.fieldWidth.unshift(40)
                }
                for(var i=0; i<this.props.fieldWidth.length; i++){
                    if(typeof this.props.fieldWidth[i] === 'number' ){
                        calcWidth = calcWidth+this.props.fieldWidth[i];
                    }
                }
                this.state.gridCalcWidth = calcWidth;
                this.state.gridWidth = this.state.contentHead.width();
            }
        },
        setGridRenderState : function(param){
            this.state.totalCountNum = parseInt(param.totalCount);
            this.state.currentPageNum = parseInt(param.pageCount);
            this.state.listCountNum = parseInt(param.listCount || this.state.listCountNum);
            this.state.displayItemNum = (this.state.currentPageNum === 0)?parseInt(param.data.length):((this.state.currentPageNum-1)*this.state.listCountNum)+parseInt(param.data.length);
            this.state.totalPageNum = parseInt(this.state.totalCountNum/this.state.listCountNum);
            if( this.state.totalPageNum < 1 ){ this.state.totalPageNum = 1; }
            if( this.state.totalPageNum < this.state.totalCountNum/this.state.listCountNum ){ this.state.totalPageNum = this.state.totalPageNum+1; }
            if( this.state.listSelect[0].value !== this.state.listCountNum ){this.state.listSelect[0].value = this.state.listCountNum;}
            this.gridData = param.data;
        },
        setGridFootState : function(param){
            this.state.totalItem[0].innerText = this.state.totalCountNum;
            this.state.displayItem[0].innerText = this.state.displayItemNum;
            this.state.totalPage[0].innerText = this.state.totalPageNum;
            this.state.currentPage[0].value = this.state.currentPageNum;
        },
        setGridHeadElement : function(){
            if( this.props.fieldTitle && this.props.fieldName ){
                var headContentUl = js2uix.createDom('ul', {className : 'js2uix-grid-head-wrap js2uix-head-row'}, true);
                for(var i=0; i<this.props.fieldTitle.length; i++){
                    headContentUl.append('<li class="field" data-order="NORMAL" data-name="'+this.props.fieldName[i]+'">'+this.props.fieldTitle[i]+'</li>');
                }
                if( this.props.optionCheckBox ){
                    this.state.optionCheckbox = js2uix.createDom('li', {
                        content : '<input type="checkbox" name="optionCheckBox" />'
                    }, true);
                    this.state.optionCheckbox.setAttr('data-option', 'checkbox');
                    headContentUl.prepend(this.state.optionCheckbox);
                }
                if( this.props.optionNumbering ){
                    headContentUl.prepend('<li data-option="numbering">&nbsp;</li>');
                }
                this.state.contentHead = js2uix.createDom('div', {
                    className : 'js2uix-grid-head',
                    content : headContentUl
                }, true);
                this.setAppendElement(this.state.contentHead);
                this.setGridHeadControl(this.state.contentHead);
            }
        },
        setGridBodyElement : function(){
            this.state.contentBodyList = js2uix.createDom('div', {
                className : 'js2uix-grid-body-list'
            }, true);
            this.state.contentBody = js2uix.createDom('div', {
                className : 'js2uix-grid-body',
                content : js2uix.createDom('div', {
                    className : 'js2uix-grid-body-wrap',
                    content : this.state.contentBodyList
                })
            }, true);
            this.setAppendElement(this.state.contentBody);
        },
        setGridFootElement : function(){
            this.state.contentFoot = js2uix.createDom('div', {className : 'js2uix-grid-foot'}, true);
            var totalList = js2uix.createDom('div', {
                className : 'js2uix-grid-list',
                content : '<select class="list"></select>'
            }, true);
            var totalNode = js2uix.createDom('div', {
                className : 'js2uix-grid-total',
                content : '<ul>' +
                '<li>Displaying&nbsp;</li>' +
                '<li class="current">1</li>' +
                '<li>&nbsp;of&nbsp;</li>' +
                '<li class="total">1</li>' +
                '<li>&nbsp;items</li>' +
                '</ul>'
            });
            var totalPage = js2uix.createDom('div', {
                className : 'js2uix-grid-page',
                content : '<ul>' +
                '<li class="first"></li>' +
                '<li class="prev"></li>' +
                '<li class="page">' +
                '<span>Page</span>' +
                '<span class="current">' +
                '<input type="text" name="crtPage" class="crtPage">' +
                '</span>' +
                '<span>of</span>' +
                '<span class="total">1</span>' +
                '</li>' +
                '<li class="next"></li>' +
                '<li class="last"></li>' +
                '<li class="reload"></li>' +
                '</ul>'
            });
            if( Array.isArray(this.props.listCountNum) && this.props.listCountNum.length > 0 ){
                for(var i = 0; i<this.props.listCountNum.length; i++){
                    var selected = '';
                    if(i === 0){
                        this.state.listCountNum = this.props.listCountNum[i];
                        selected = 'selected';
                    }
                    totalList.find('select').append('<option '+selected+' value="'+this.props.listCountNum[i]+'">'+this.props.listCountNum[i]+'</option>');

                }
            }
            this.state.contentFoot.append(totalList, totalPage, totalNode);
            this.state.listSelect  = this.state.contentFoot.find('select');
            this.state.totalItem  = this.state.contentFoot.find('.js2uix-grid-total .total');
            this.state.displayItem  = this.state.contentFoot.find('.js2uix-grid-total .current');
            this.state.totalPage  = this.state.contentFoot.find('.js2uix-grid-page .total');
            this.state.currentPage  = this.state.contentFoot.find('.js2uix-grid-page .current input');
            this.setAppendElement(this.state.contentFoot);
            this.setGridFootControl(this.state.contentFoot);
        },
        setGridLoadElement : function(){
            this.state.loadBox = js2uix.createDom('div', {
                className : 'js2uix-grid-load',
                content : '<div class="innerBox">processing.. please wait!</div>'
            }, true);
            this.state.contentBody.append(this.state.loadBox);
        },
        setGridBodyItemElement : function(param){
            var bodyUl = '';
            if( param.data && param.data.length > 0 && this.props.fieldName.length > 0){
                for(var i=0; i<param.data.length; i++){
                    if( i <= this.state.listCountNum ){
                        bodyUl += '<ul class="js2uix-body-row">';
                        if( this.props.optionNumbering ){bodyUl += '<li data-option="numbering">'+(i+1)+'</li>';}
                        if( this.props.optionCheckBox ){bodyUl += '<li data-option="checkbox"><input type="checkbox" name="optionCheckBox" /></li>';}
                        for(var j=0; j<this.props.fieldName.length; j++){
                            var isEmpty = '';
                            var key = this.props.fieldName[j];
                            var fieldValue = param.data[i][key];
                            if( !fieldValue ){
                                fieldValue = '';
                                isEmpty = 'data-empty="true"';
                                if( i === 0 ){this.state.contentHead.find('li[data-name="'+key+'"]').removeEvent('all');}
                            }
                            bodyUl += '<li data-name="'+key+'" '+isEmpty+' style="text-align:'+this.props.bodyTextAlign+'">'+fieldValue+'</li>';
                        }
                        bodyUl +='</ul>';
                    }
                }
            } else {
                bodyUl = '<ul class="js2uix-body-row"><li class="noGridData">No Data</li></ul>';
            }
            this.setGridBodyControl(true);
            this.state.contentBodyList[0].parentNode.scrollTop = 0;
            this.state.contentBodyList[0].innerHTML = bodyUl;
            this.onCustomizedField();
            this.setGridBodyControl(false);
            this.setAdjustStyleLayout();
        },
        setGridDefaultElement : function(){
            this.setGridBodyControl(true);
            this.element[0].innerHTML = '';
        },
        setGridHeadControl : function(target){
            var module = this;
            target.find('li.field').addEvent('click.js2uix-grid', function(){
                if( module.state.isControl ){
                    var item = js2uix(this);
                    var dataOrder = item.getAttr('data-order');
                    var dataName = item.getAttr('data-name');
                    if( dataOrder === 'NORMAL' ){
                        item.setAttr('data-order', 'ASC');
                        module.state.orderInfo[dataName] = 'ASC';
                    } else if( dataOrder === 'ASC' ){
                        item.setAttr('data-order', 'DESC');
                        module.state.orderInfo[dataName] = 'DESC';
                    } else if( dataOrder === 'DESC' ){
                        item.setAttr('data-order', 'NORMAL');
                        delete module.state.orderInfo[dataName]
                    }
                    module.state.currentPageNum = 1;
                    module.onChangeStateEvent();
                }
            });
            target.find('li[data-option="checkbox"] input[type=checkbox]').addEvent('change.js2uix-grid', function(){
                if( module.state.isControl ){
                    var bodyItem = module.state.contentBodyList.find('input[name=optionCheckBox]');
                    js2uix.loop(bodyItem, function(num, elm){elm.checked = this.checked;}.bind(this));
                }
            });
        },
        setGridBodyControl : function(reset){
            if( reset ){
                if( this.state.contentBody ){
                    this.state.contentBody.find('.js2uix-grid-body-list *').removeEvent('all');
                }
            } else {
                this.onCustomizedEvent();
            }
        },
        setGridFootControl : function(target){
            var module = this;
            target.find('.first').addEvent('click.js2uix-grid', function(){
                if( module.state.currentPageNum !== 1 && module.state.isControl ){
                    module.state.currentPageNum = 1;
                    module.onChangeStateEvent();
                }
                return false;
            });
            target.find('.prev').addEvent('click.js2uix-grid', function(){
                if( module.state.currentPageNum !== 1  && module.state.isControl ){
                    module.state.currentPageNum = (module.state.currentPageNum-1 !== 0 )?module.state.currentPageNum-1:1;
                    module.onChangeStateEvent();
                }
                return false;
            });
            target.find('.next').addEvent('click.js2uix-grid', function(){
                if( (module.state.currentPageNum < module.state.totalPageNum) && module.state.isControl ){
                    module.state.currentPageNum = (module.state.currentPageNum+1 <= module.state.totalPageNum )?module.state.currentPageNum+1:module.state.totalPageNum;
                    module.onChangeStateEvent();
                }
                return false;
            });
            target.find('.last').addEvent('click.js2uix-grid', function(){
                if( (module.state.currentPageNum < module.state.totalPageNum) && module.state.isControl ){
                    module.state.currentPageNum = module.state.totalPageNum;
                    module.onChangeStateEvent();
                }
                return false;
            });
            target.find('.reload').addEvent('click.js2uix-grid', function(){
                if( module.state.isControl ){
                    module.onChangeStateEvent();
                }
                return false;
            });
            target.find('.crtPage').addEvent('keyup.js2uix-grid', function(e){
                var thisValue = this.value;
                thisValue = thisValue.replace(/[^0-9]/gi,"");
                if( thisValue === '' ){
                    module.state.currentPage[0].value = ''
                } else {
                    thisValue = parseInt(thisValue);
                    if( thisValue < 1 ){thisValue = 1;}
                    if( thisValue > module.state.totalPageNum ){thisValue = module.state.totalPageNum;}
                    module.state.currentPage[0].value = thisValue;
                }
                if( e.keyCode === 13 ){
                    module.state.currentPageNum = thisValue;
                    module.onChangeStateEvent();
                }
                return false;
            });
            target.find('select').addEvent('change.js2uix-grid', function(e){
                if( module.state.isControl ){
                    module.state.currentPageNum = 1;
                    module.state.listCountNum = this.value;
                    module.onChangeStateEvent();
                }
                return false;
            });
        },
        setGridCreateElement : function(){
            this.setGridDefaultElement();
            this.setGridHeadElement();
            this.setGridBodyElement();
            this.setGridFootElement();
            this.setGridLoadElement();
        },
        onChangeStateEvent : function(){
            if( typeof this.props.onChangeStateEvent && typeof this.props.onChangeStateEvent === 'function' ){
                this.setLoadEffectStyle(true);
                this.setDefaultOptionState();
                this.props.onChangeStateEvent({
                    searchOrder : this.state.orderInfo,
                    searchPageNum : this.state.currentPageNum,
                    searchItemListNum : this.state.listCountNum
                });
            }
        },
        onCustomizedField : function(){
            if( this.props.onCustomizedField && typeof this.props.onCustomizedField === 'function' ){
                var module = this;
                this.state.contentBodyList.find('ul').loop(function(num){ module.props.onCustomizedField(js2uix(this), module.gridData[num]); });
                module.gridData = null;
            }
        },
        onCustomizedEvent : function(){
            if(  this.props.onCustomizedEvent && typeof this.props.onCustomizedEvent === 'function' ){
                this.props.onCustomizedEvent(this.state.contentBodyList);
            }
        },
        setData : function(param){
            if( param && typeof param === 'object' ){
                this.setGridRenderState(param);
                this.setGridFootState(param);
                this.setGridBodyItemElement(param);
                this.setGridFieldStyle('body');
                this.setLoadEffectStyle(false);
            }
        },
        init : function(props){
            if( props && typeof props === 'object' ){
                js2uix.extend(this.props, props);
                if( this.setDefaultRender() ){
                    this.setGridCreateElement();
                    this.setGridDefaultState();
                    this.setCreateCssStyle();
                    this.setGridFieldStyle('head');
                }
            }
        }
    };
    js2uixToolGrid.prototype.constructor = js2uixToolGrid;

    var js2uixToolCombo = function(element, props){
        this.element = element;
        this.props = {
            comboFixWidth : null,
            defaultTitle : null,
            searchCombo : false,
            inputPlaceholder : '',
            onChangeEvent : null,
            onSearchEvent : null
        };
        this.state = {
            comboBoxNode : null,
            optionNode : null,
            searchOptionNode : null,
            selectedNode : null,
            titleNode : null,
            defaultTitleNode : null,
            arrowNode : null,
            width : 0,
            height : 0,
            value : null,
            change : false
        };
        this.init(props);
        return {
            name : this.js2uixName,
            getValue : this.getValue.bind(this),
            setValue : this.setValue.bind(this),
            setOption : this.setOption.bind(this)
        }
    };
    js2uixToolCombo.prototype = {
        js2uixName : "js2uix-combo",
        setComboBoxElementLayout : function(){
            var width = this.state.width = this.props.comboFixWidth || this.element.width();
            var height = this.state.height = this.state.comboBoxNode.height();
            var designWidth = ( this.props.comboFixWidth === 'parent' || typeof this.props.comboFixWidth !== 'number' )?'100%':width+height;
            this.element.css({'width' : width, 'height' : height});
            this.state.comboBoxNode.css({'width' : width, 'height' : height});
            this.state.titleNode.css('padding-right', 25);
            this.state.arrowNode.css({'width' : 25, 'height' : height});
            if( this.props.searchCombo ){
                this.state.comboBoxNode.addClass('js2uix-search');
                this.state.titleNode.css({'width' : width, 'height' : height});
                this.state.searchOptionNode.css({'width' : width, 'top' : height-1});
                this.element[0].style.display = 'none';
            }
        },
        createComboBoxDefaultOption : function(){
            var options = this.element.find('option');
            if( this.props.defaultTitle || options.length === 0 ){
                this.state.defaultTitleNode = js2uix.createDom('option', { 'content' : this.props.defaultTitle || 'No data'});
                this.state.defaultTitleNode.value = 'none';
                this.state.defaultTitleNode.disabled = true;
                this.state.defaultTitleNode.setAttribute('selected', true);
                this.element.prepend(this.state.defaultTitleNode);
            }
            try {
                return this.element.find('option');
            } finally {
                options = null;
            }
        },
        createComboBoxOptionNode : function(){
            var optionNode = this.state.optionNode;
            if( this.props.searchCombo ){
                var ulNode = js2uix.createDom('ul',{'className':'js2uix-option-wrap'}, true);
                if( optionNode.length > 0 ){
                    for(var i=0; i<optionNode.length; i++){
                        var crt = optionNode[i];
                        var title = crt.innerText;
                        var attr = '';
                        for(var j=0; j<crt.attributes.length; j++){
                            var data = crt.attributes[j];
                            var dataName = data.name;
                            var dataValue = data.value || '';
                            if( dataName === 'disabled' ){ dataValue = 'true'; }
                            if( dataName.indexOf('data-') !== -1 ){
                                attr += ' '+dataName+'="'+dataValue+'"';
                            } else {
                                attr += ' data-'+dataName+'="'+dataValue+'"';
                            }
                        }
                        ulNode.append('<li'+attr+'>'+title+'</li>');
                    }
                } else {
                    ulNode.append('<li>No data</li>');
                }
                this.setComboBoxSearchControl(true);
                this.state.searchOptionNode.html(ulNode);
            }
        },
        createComboBoxLayout : function(){
            this.state.comboBoxNode = js2uix.createDom('div', {'className' : this.js2uixName}, true);
            this.state.arrowNode = js2uix.createDom('span', {'className' : 'arrow'}, true);
            this.state.optionNode = this.createComboBoxDefaultOption();
            if( !this.props.searchCombo ){
                this.state.titleNode = js2uix.createDom('label', {'className' : 'title'}, true);
                this.state.comboBoxNode.append(this.state.titleNode, this.state.arrowNode);
            } else {
                this.state.searchOptionNode = js2uix.createDom('div', {'className' : 'js2uix-option'}, true);
                this.createComboBoxOptionNode();
                this.state.titleNode = js2uix.createDom('input', {'className' : 'search'}, true);
                this.state.comboBoxNode.append(this.state.titleNode, this.state.arrowNode, this.state.searchOptionNode);
            }
            this.element.before(this.state.comboBoxNode);
            this.state.comboBoxNode.append(this.element);
        },
        setComboBoxOptionState : function(change){
            var value = this.element[0].value;
            var title = '';
            if( this.state.optionNode.length > 0){
                for(var i=0; i<this.state.optionNode.length; i++ ){
                    if( this.state.optionNode[i].selected === true ){
                        this.selectedNode = this.state.optionNode[i];
                        title = this.state.optionNode[i].innerText;
                    }
                }
            }
            if( this.state.defaultTitleNode && !this.state.change && change){
                this.state.defaultTitleNode.removeAttribute('selected');
                this.state.change = true;
            }
            if( !this.props.searchCombo ){
                this.state.titleNode[0].innerText = title;
            } else {
                this.state.titleNode[0].placeholder = this.props.inputPlaceholder;
                if( change ){ this.state.titleNode[0].value = title; }
            }
            this.state.value = value || '';
        },
        setScrollActiveItem : function(comboSelect, activeItem){
            var comboSelectRect = comboSelect[0].getBoundingClientRect(),
                itemRect = activeItem[0].getBoundingClientRect(),
                itemIndex = activeItem.index()+1,
                comboBoxHeight = comboSelectRect.height,
                itemHeight = itemRect.height,
                scroll = comboSelect[0].scrollTop || 0;
            if( itemIndex*itemHeight < scroll+itemHeight ){
                comboSelect[0].scrollTop = scroll+((itemIndex*itemHeight)-(scroll+itemHeight));
            }
            if( itemIndex*itemHeight > comboBoxHeight+scroll ){
                comboSelect[0].scrollTop = scroll+((itemIndex*itemHeight)-(comboBoxHeight+scroll));
            }
        },
        setComboBoxDefaultControl : function(){
            var module = this;
            if( this.props.searchCombo ){
                this.state.titleNode.addEvent('keyup.'+this.js2uixName, function(e){
                    if( (e.keyCode < 37 || e.keyCode > 40) && e.keyCode !== 13 ){
                        module.onSearchCallBack(this, this.value);
                    }
                });
                this.state.titleNode.addEvent('keydown.'+this.js2uixName, function(e){
                    var thisKeyCode = e.keyCode;
                    if( thisKeyCode === 38 || thisKeyCode === 40 || thisKeyCode === 13){
                        var checkItem = module.state.searchOptionNode.find("li");
                        var checkActiveItem = module.state.searchOptionNode.find("li.on");
                        var prevItem = checkActiveItem.prevNode();
                        var nextItem = checkActiveItem.nextNode();
                        var activeItem;
                        if( checkActiveItem.length === 0 ){
                            if( thisKeyCode === 40 ){
                                activeItem = js2uix(checkItem[0]);
                                activeItem.addClass("on");
                            }
                        } else {
                            if( thisKeyCode === 13 ){
                                var itemValue = checkActiveItem[0].getAttribute('data-value') || '';
                                if( module.state.value !== itemValue ){
                                    module.setValue(itemValue);
                                    module.state.searchOptionNode[0].style.display = 'none';
                                    module.onChangeCallBack();
                                }
                            } else {
                                if( thisKeyCode === 38 ){
                                    if( prevItem.length === 1 ){
                                        activeItem = prevItem;
                                    }
                                }
                                if( thisKeyCode === 40 ){
                                    if( nextItem.length === 1 ){
                                        activeItem = nextItem;
                                    }
                                }
                                if( activeItem ){
                                    activeItem.addClass("on").siblingNodes().removeClass("on");
                                    module.setScrollActiveItem(module.state.searchOptionNode, activeItem);
                                }
                            }
                        }
                    }
                });
                this.state.titleNode.addEvent('mousedown.'+this.js2uixName, function(e){
                    module.state.searchOptionNode[0].style.display = 'block';
                    e.stopPropagation();
                });
                this.state.arrowNode.addEvent('mousedown.'+this.js2uixName, function(e){
                    module.state.searchOptionNode[0].style.display = (module.state.searchOptionNode[0].style.display !== 'block')?'block':'none';
                    e.stopPropagation();
                });
                this.state.searchOptionNode.addEvent('mousedown.'+this.js2uixName, function(e){
                    e.stopPropagation();
                });
                js2uix('body').addEvent('mousedown.'+this.js2uixName, function(){
                    module.state.searchOptionNode[0].style.display = 'none';
                });
            } else {
                this.element.addEvent('change.'+this.js2uixName, function(){
                    module.setComboBoxOptionState(true);
                    module.onChangeCallBack();
                });
            }
        },
        setComboBoxSearchControl : function(remove){
            if(this.state.searchOptionNode){
                var findItems = this.state.searchOptionNode.find('li');
                if( remove ){
                    findItems.removeEvent('all');
                } else {
                    var module = this;
                    findItems.addEvent('mouseup.'+this.js2uixName, function(e){
                        if( this && !this.hasAttribute('data-disabled') ){
                            if( module.element[0].value !== this.getAttribute('data-value') ){
                                module.element[0].value = this.getAttribute('data-value') || '';
                                module.setComboBoxOptionState(true);
                                module.onChangeCallBack();
                            }
                        }
                        js2uix(this).addClass('on').siblingNodes().removeClass('on');
                        module.state.searchOptionNode[0].style.display = 'none';
                        e.stopPropagation();
                    });
                }
            }
        },
        setOption : function(param){
            if( param && Array.isArray(param) ){
                var i;
                var name;
                var option = '';
                for(i=0; i<param.length; i++){
                    var disabled = '';
                    var dataAttr = '';
                    var dataAttrObj = param[i]['dataAttr'];
                    for(name in dataAttrObj ){ dataAttr += ' data-'+name+'="'+dataAttrObj[name]+'"'; }
                    if( (param[i]['disabled']) === true || (param[i]['disabled']) === 'true' ){ disabled = 'disabled'; }
                    option += '<option value="'+param[i]["value"]+'"'+dataAttr+' '+disabled+'>'+param[i]["title"]+'</option>'
                }
                this.element.removeAttr('style').html(option);
                this.state.optionNode = this.createComboBoxDefaultOption();
                this.createComboBoxOptionNode();
                this.setComboBoxElementLayout();
                this.setComboBoxOptionState();
                this.setComboBoxSearchControl(false);
            }
        },
        setValue : function(value){
            this.element[0].value = this.state.value = value;
            this.setComboBoxOptionState(true);
        },
        getValue : function(){
            return this.state.value;
        },
        onChangeCallBack : function(){
            if(this.props.onChangeEvent && typeof this.props.onChangeEvent === 'function' ){
                var callBackData = {};
                for(var i=0; i<this.selectedNode.attributes.length; i++){
                    var data = this.selectedNode.attributes[i];
                    callBackData[data.name.replace('data-','')] = data.value;
                }
                callBackData['title'] = this.selectedNode.innerText;
                this.props.onChangeEvent(callBackData);
            }
        },
        onSearchCallBack : function(input, value){
            if(this.props.onSearchEvent && typeof this.props.onSearchEvent === 'function' ){
                this.props.onSearchEvent(input, value);
            }
        },
        init : function(props){
            if(typeof props === 'object' ){ js2uix.extend(this.props, props); }
            this.createComboBoxLayout();
            this.setComboBoxElementLayout();
            this.setComboBoxOptionState();
            this.setComboBoxDefaultControl();
        }
    };
    js2uixToolCombo.prototype.constructor = js2uixToolCombo;

    var js2uixUICommon = {
        setLimitPosition : function(parent, target){
            var opt = this.state;
            if( target ){
                var targetBorderLW = parseInt(target.css("border-left-width")) || 0;
                var targetBorderRW = parseInt(target.css("border-right-width")) || 0;
                var targetBorderTW = parseInt(target.css("border-top-width")) || 0;
                var targetBorderBW = parseInt(target.css("border-bottom-width")) || 0;
                opt.targetRect = target[0].getBoundingClientRect();
                opt.targetRect.borderLeft = targetBorderLW;
                opt.targetRect.borderRight = targetBorderRW;
                opt.targetRect.borderTop = targetBorderTW;
                opt.targetRect.borderBottom = targetBorderBW;
            }
            if( parent ){
                var parentBorderLW = parseInt(parent.css("border-left-width")) || 0;
                var parentBorderRW = parseInt(parent.css("border-right-width")) || 0;
                var parentBorderTW = parseInt(parent.css("border-top-width")) || 0;
                var parentBorderBW = parseInt(parent.css("border-bottom-width")) || 0;
                var paddingLeft = parseInt(parent.css("padding-left")) || 0;
                var paddingRight = parseInt(parent.css("padding-right")) || 0;
                var paddingTop = parseInt(parent.css("padding-top")) || 0;
                var paddingBot = parseInt(parent.css("padding-bottom")) || 0;
                opt.parent = parent[0];
                opt.parentRect = parent[0].getBoundingClientRect();
                opt.parentRect.borderLeft = parentBorderLW;
                opt.parentRect.borderRight = parentBorderRW;
                opt.parentRect.borderTop = parentBorderTW;
                opt.parentRect.borderBottom = parentBorderBW;
                opt.parentRect.paddingLeft = paddingLeft;
                opt.parentRect.paddingRight = paddingRight;
                opt.parentRect.paddingTop = paddingTop;
                opt.parentRect.paddingBottom = paddingBot;
                opt.limitX = opt.parentRect.left - opt.targetRect.left + opt.parentRect.borderLeft + opt.parentRect.paddingLeft;
                opt.limitY = opt.parentRect.top - opt.targetRect.top + opt.parentRect.borderBottom + opt.parentRect.paddingTop;
                opt.maxX = opt.parentRect.right - opt.targetRect.right - opt.parentRect.borderRight - opt.parentRect.paddingRight;
                opt.maxY = opt.parentRect.bottom - opt.targetRect.bottom - opt.parentRect.borderBottom - opt.parentRect.paddingBottom;
            }else{
                opt.limitX = -99999;
                opt.limitY = -99999;
                opt.maxX = 99999;
                opt.maxY = 99999;
            }
        },
        setLimitedAreaForUserCommand : function( parent, target, nodeX, nodeY ){
            this.state.targetX = parseInt(nodeX) || 0;
            this.state.targetY = parseInt(nodeY) || 0;
            this.setLimitPosition(parent, target);
        },
        getClickMousePositionXY : function(event){
            event = (!event)?window.event:event;
            return {
                pageX : event.pageX,
                pageY : event.pageY
            }
        }
    };
    var js2uixToolDrag = function(element, props){
        this.element = element;
        this.props = {
            addClass    : null,
            handle      : null,
            cancel      : null,
            cursor      : null,
            containment : null,
            dropTarget  : null,
            create      : null,
            start       : null,
            drag        : null,
            stop        : null,
            drop        : null,
            userSelect  : false,
            smoothDrag  : false,
            zIndex      : 9
        };
        this.state = {
            targetX    : 0,
            targetY    : 0,
            targetRect : null,
            parent     : null,
            parentRect : null,
            limitX     : 0,
            maxX       : 0,
            limitY     : 0,
            maxY       : 0,
            isDown     : false,
            mouseX     : 0,
            mouseY     : 0,
            isDrag     : false,
            isMove     : false,
            isCancel   : false,
            isHandle   : false,
            enable     : true,
            disable    : false,
            destroy    : false,
            dataId     : null
        };
        this.init(props);
        return {
            name : this.js2uixName,
            enable  : this.enable.bind(this),
            destroy : this.destroy.bind(this),
            disable : this.disable.bind(this)
        }
    };
    js2uixToolDrag.prototype = {
        uiBodyNode : null,
        js2uixName : 'js2uix-draggable',
        uiDragHandleClass : 'js2uix-drag-handle',
        uiDragCancelClass : 'js2uix-drag-cancel',
        uiDragFxClass : 'js2uix-drag-fx',
        setDefaultState : function( target ){
            var handler = target.find(this.props.handle);
            var position = target.css("position");
            this.uiBodyNode = (!this.uiBodyNode)?js2uix('body'):this.uiBodyNode;
            if ( this.props.addClass ) { target.addClass(this.props.addClass); }
            if ( this.props.smoothDrag ) { target.addClass(this.uiDragFxClass); }
            if ( !this.props.userSelect ) { target.setAttr("data-selectable", false); }
            if ( position === "static" || position === "relative" ) { position = "absolute"; }
            else if ( position === "fixed" ) { position = "fixed"; }
            if( handler.length > 0 ){ if(this.props.cursor && this.props.cursor !== ""){ handler.css("cursor", this.props.cursor); } }
            if( this.props.zIndex && typeof this.props.zIndex === "number" ){ target.css("z-index", parseInt(this.props.zIndex)); }
            target.addClass(this.js2uixName).removeAttr("data-disable").css("position" , position);
        },
        setRemoveDragNodeConstruct : function( target ){
            var dragHandle = target.find(".js2uix-drag-handle");
            var dragCancel = target.find(".js2uix-drag-cancel");
            ROOT.removeEvent('mousemove.js2uix-'+this.state.dataId);
            ROOT.removeEvent('mouseup.js2uix-'+this.state.dataId);
            dragHandle.removeEvent('mousedown.js2uix-drag-handle');
            dragHandle.removeEvent('mouseup.js2uix-drag-handle');
            dragCancel.removeEvent('mousedown.js2uix-drag-cancel');
            dragCancel.removeEvent('mouseup.js2uix-drag-cancel');
            target.removeEvent('mousedown.js2uix-drag-control');
            target.removeEvent('mouseup.js2uix-drag-control');
            target.removeClass("js2uix-draggable")
                .removeAttr("data-selectable")
                .removeAttr("data-disable")
                .find(".js2uix-drag-handle")
                .removeClass("js2uix-drag-handle");
            target.find(".js2uix-drag-cancel").removeClass("js2uix-drag-cancel");
            target.css({'position' : '', 'left' : '', 'top' : '', 'cursor' : '', 'zIndex' : ''});
            dragHandle.css("cursor" , "");
            target.remove();
        },
        setMouseMoveLimitAreaCheck : function( mouseX, mouseY ){
            var state = this.state;
            if( mouseX <= state.limitX  ){ mouseX = state.limitX ; }
            if( mouseX >= state.maxX ){ mouseX = state.maxX ; }
            if( mouseY <= state.limitY  ){ mouseY = state.limitY ; }
            if( mouseY >= state.maxY ){ mouseY = state.maxY ; }
            return { mouseX : mouseX, mouseY : mouseY }
        },
        setMouseDownDragEventHandler : function(){
            this.state.isHandle = true;
        },
        setMouseUpDragEventHandler : function(){
            this.state.isHandle = false;
        },
        setMouseDownCancelEventHandler : function(){
            this.state.isCancel = true;
        },
        setMouseUpCancelEventHandler : function(){
            this.state.isCancel = false;
        },
        setMouseDownNodeEventHandler : function( event ){
            if( event.target.classList[0] === 'js2uix-resize-handle' ){return;}
            var nodeX, nodeY;
            var disableBool = this.element.getAttr("data-disable");
            var parent = this.element.parent();
            this.uiBodyNode.addClass("disableSelection");
            this.state.isDrag = true;
            this.state.mouseX = event.pageX;
            this.state.mouseY = event.pageY ;
            if( !disableBool || disableBool === "false" || typeof disableBool === "undefined" ){this.state.isDrag = true;}
            if( !this.props.handle ){ this.state.isHandle = true; }
            if( this.state.destroy || this.state.disable || disableBool === "true" || !this.state.isHandle ){this.state.isDrag = false;}
            if( this.state.isDrag ){
                if( this.props.containment !== "parent" && this.props.containment !== "" && this.props.containment ){
                    parent = this.element.parents(this.props.containment);
                    if( typeof parent === "undefined" ){parent = this.uiBodyNode;}
                }else if( this.props.containment === "parent" ){
                    parent = this.element.parent();
                }else{
                    parent = null;
                }
                nodeX = this.element.css("left");
                nodeY = this.element.css("top");
                if( nodeX === "auto" ){nodeX = parseInt(this.element[0].offsetLeft);}
                if( nodeY === "auto" ){nodeY = parseInt(this.element[0].offsetTop);}
                this.setLimitedAreaForUserCommand(parent, this.element, nodeX, nodeY);
                this.setCallBackStart({
                    target  : this.element[0],
                    width   : this.element.width(),
                    height  : this.element.height(),
                    positionX : parseInt(this.element.css("left")),
                    positionY : parseInt(this.element.css("top"))
                });
                if( !this.state.isCancel ){ this.setDragWindowControl(); }
            }
        },
        setMouseUpNodeEventHandler : function(){
            if( this.state.isMove && this.state.enable ){
                if( this.props.dropTarget ){
                    var drop = this.uiBodyNode.find(this.props.dropTarget);
                    if( drop && drop.length > 0 ){
                        this.setMouseUpDropEventHandler(this.element, drop)
                    }
                }
                this.setCallBackStop({
                    target  : this.element[0],
                    width   : this.element.width(),
                    height  : this.element.height(),
                    positionX : parseInt(this.element.css("left")),
                    positionY : parseInt(this.element.css("top"))
                });
            }
            this.state.isDrag = false;
            this.state.isMove = false;
            this.state.isHandle = false;
        },
        setMouseMoveWindowEventHandler : function(event){
            var mouseX, mouseY, calcXY, targetX, targetY;
            if(this.state.isDrag && this.state.isHandle && !this.state.isCancel){
                mouseX = event.pageX - this.state.mouseX;
                mouseY = event.pageY - this.state.mouseY;
                calcXY = this.setMouseMoveLimitAreaCheck(mouseX, mouseY);
                targetX = this.state.targetX + calcXY.mouseX;
                targetY = this.state.targetY + calcXY.mouseY;
                this.state.isMove = true;
                this.element[0].style.left = targetX + "px";
                this.element[0].style.top = targetY + "px";
                this.setCallBackDrag({
                    target  : this.element[0],
                    width   : this.element.width(),
                    height  : this.element.height(),
                    positionX : parseInt(this.element.css("left")),
                    positionY : parseInt(this.element.css("top"))
                });
            }
        },
        setMouseUpWindowEventHandler : function(){
            if( this.state.isDrag ){
                this.setCallBackStop({
                    target  : this.element[0],
                    width   : this.element.width(),
                    height  : this.element.height(),
                    positionX : parseInt(this.element.css("left")),
                    positionY : parseInt(this.element.css("top"))
                });
            }
            this.state.isCancel = false;
            this.state.isDrag = false;
            this.state.isMove = false;
            this.state.isHandle = false;
            ROOT.removeEvent('mousemove.js2uix-'+this.state.dataId);
            ROOT.removeEvent('mouseup.js2uix-'+this.state.dataId);
            this.uiBodyNode.removeClass("disableSelection");
        },
        setMouseUpDropEventHandler : function( target, dropTarget ){
            var obj_targetRect = target[0].getBoundingClientRect();
            var obj_dropInfo = [];
            js2uix.loop(dropTarget, function(){
                var dropRect = this.getBoundingClientRect();
                var DropSuccess = ((obj_targetRect.right > dropRect.left) && (obj_targetRect.left < dropRect.right)) && ((obj_targetRect.bottom > dropRect.top) && (obj_targetRect.top < dropRect.bottom));
                obj_dropInfo.push({ dropSuccess : DropSuccess, dropTarget : this });
            });
            this.setCallBackDrop({
                dragTarget  : target[0],
                dropTarget  : obj_dropInfo
            });
        },
        setDragHandleControl : function(){
            if(this.props.handle && this.props.handle !== ""){
                var userHandle = this.element.find(this.props.handle).addClass(this.uiDragHandleClass);
                if( userHandle.length > 0 ){
                    userHandle.addEvent({
                        'mousedown.js2uix-drag-handle' : this.setMouseDownDragEventHandler.bind(this),
                        'mouseup.js2uix-drag-handle' : this.setMouseUpDragEventHandler.bind(this)
                    });
                }
            }else{
                this.state.isHandle = true;
            }
        },
        setDragCancelControl : function(){
            if( this.props.cancel && this.props.cancel !== ""){
                var cancel = this.element.find(this.props.cancel).addClass(this.uiDragCancelClass);
                if( cancel.length > 0 ){
                    cancel.addEvent({
                        'mousedown.js2uix-drag-cancel' : this.setMouseDownCancelEventHandler.bind(this),
                        'mouseup.js2uix-drag-cancel' : this.setMouseUpCancelEventHandler.bind(this)
                    });
                }
            }else{
                this.state.isCancel = false;
                cancel = null;
            }
        },
        setDragNodeControl : function(){
            this.element.addEvent({
                'mousedown.js2uix-drag-control' : this.setMouseDownNodeEventHandler.bind(this),
                'mouseup.js2uix-drag-control' : this.setMouseUpNodeEventHandler.bind(this)
            });
        },
        setDragWindowControl : function(){
            ROOT.addEvent('mousemove.js2uix-'+this.state.dataId, this.setMouseMoveWindowEventHandler.bind(this));
            ROOT.addEvent('mouseup.js2uix-'+this.state.dataId, this.setMouseUpWindowEventHandler.bind(this));
        },
        setCallBackCreate: function(){
            if( typeof this.props.create === 'function' ){
                this.props.create({
                    target  : this.element[0],
                    width   : this.element.width(),
                    height  : this.element.height(),
                    positionX : parseInt(this.element.css("left")),
                    positionY : parseInt(this.element.css("top"))
                });
            }
        },
        setCallBackStart : function( data ){
            if( typeof this.props.start === 'function' ){this.props.start(data);}
        },
        setCallBackDrag : function( data ){
            if( typeof this.props.drag === 'function' ){this.props.drag(data);}
        },
        setCallBackStop : function( data ){
            if( typeof this.props.stop === 'function' ){this.props.stop(data);}
        },
        setCallBackDrop : function( data ){
            if( typeof this.props.drop === 'function' ){this.props.drop(data);}
        },
        enable  : function(){
            this.state.enable = true;
            this.state.destroy = false;
            this.state.disable = false;
            this.element.removeAttr("data-disable");
        },
        destroy : function(){
            this.state.enable = false;
            this.state.disable = true;
            this.state.destroy = true;
            this.setRemoveDragNodeConstruct(this.element);
        },
        disable : function(){
            this.state.enable = false;
            this.state.destroy = false;
            this.state.disable = true;
            this.element.attr("data-disable", true);
        },
        init : function(props){
            if( typeof props === 'object' ){ js2uix.extend(this.props, props); }
            if( this.element ){
                this.state.dataId = js2uixUniqueId();
                this.setDefaultState(this.element);
                this.setDragHandleControl();
                this.setDragCancelControl();
                this.setDragNodeControl();
                this.setCallBackCreate();
            }
        }
    };
    js2uix.extend(js2uixToolDrag.prototype, js2uixUICommon);
    js2uixToolDrag.prototype.constructor = js2uixToolDrag;

    var js2uixToolResize = function(element, props){
        this.element = element;
        this.props = {
            addClass : null,
            create : null,
            containment : null,
            handle : 'e,s,w,se,sw',
            minWidth : 50,
            minHeight : 50,
            start : null,
            stop : null,
            resize : null,
            userSelect : false
        };
        this.state = {
            dragNode : null,
            resizeNodePos: "relative",
            target : null,
            targetX : 0,
            targetY : 0,
            targetRect : null,
            parent : null,
            parentRect : null,
            isHandle : false,
            isCancel : false,
            isResize : false,
            isDrag : false,
            isMove : false,
            strHandle : "js2uix-resize-se",
            limitX : 0,
            maxX : 0,
            limitY : 0,
            maxY : 0,
            mouseX : 0,
            mouseY : 0,
            enable : true,
            disable : false,
            destroy : false,
            dataId : null
        };
        this.init(props);
        return {
            name : this.js2uixName,
            enable  : this.enable.bind(this),
            destroy : this.destroy.bind(this),
            disable : this.disable.bind(this)
        }
    };
    js2uixToolResize.prototype = {
        uiBodyNode : null,
        js2uixName : 'js2uix-resizable',
        setDefaultState : function(){
            this.uiBodyNode = (!this.uiBodyNode)?js2uix('body'):this.uiBodyNode;
            if( this.element.css("position") === "static" ){this.element.css("position", "relative" );}
            if( this.props.addClass ){this.element.addClass(this.props.addClass);}
            if( !this.props.userSelect ){this.element.setAttr("data-selectable", false);}
            this.element.addClass(this.js2uixName).removeAttr("data-disable");
        },
        setDefaultHtml : function(target){
            var str_handle = this.props.handle.split(",");
            var allowHandle = ["n","e","s","w","ne","se","sw","nw"];
            if( !target ){ return false; }
            if( str_handle ){
                js2uix.loop(str_handle, function(n, v){
                    var str_v = v.trim();
                    if( allowHandle.indexOf(str_v) !== -1 ){
                        var num_zIndex = 90;
                        if( str_v.length > 1){num_zIndex = 91;}
                        target.append(js2uix.createDom('div', {
                            'className' : "js2uix-resize-handle js2uix-resize-"+str_v,
                            'styles' : {"z-index:" : num_zIndex}
                        }));
                    }
                });
            }
        },
        setRemoveResizeNodeConstruct : function(){
            var resizeHandle = this.element.find(".js2uix-resize-handle");
            this.element.removeClass("js2uix-resizable").removeAttr("data-selectable");
            this.element.css({'left':'', 'top':'', 'width':'', 'height':''});
            resizeHandle.removeEvent("mousedown.js2uix-resize-handle");
            resizeHandle.removeEvent("mouseup.js2uix-resize-handle");
            ROOT.removeEvent('mousemove.js2uix-'+this.state.dataId);
            ROOT.removeEvent('mouseup.js2uix-'+this.state.dataId);
            resizeHandle.remove();
            this.element.remove();
        },
        getResizeLimitMaxPosition : function(x, y, type){
            var state = this.state;
            if( type === "w" || type === "n") {
                if (x <= state.limitX){ x = state.limitX; }
                if (y <= state.limitY){ y = state.limitY; }
            }
            if( type === "e" || type === "s"){
                if( x >= state.maxX  ){ x = state.maxX; }
                if( y >= state.maxY  ){ y = state.maxY; }
            }
            return {
                mouseX : x,
                mouseY : y
            }
        },
        getCalcResizeUpEventHandler : function( item, x, y, limit ){
            var calcXY = this.getResizeLimitMaxPosition(x, y, "n");
            var moveY = calcXY.mouseY;
            if( moveY >= limit ){ moveY = limit; }
            item.style.top = this.state.targetY + moveY+"px";
            item.style.height = this.state.targetRect.height - moveY+"px";
        },
        getCalcResizeDownEventHandler : function( item, x, y, limit ){
            var calcXY = this.getResizeLimitMaxPosition(x, y, "s");
            var moveY = calcXY.mouseY;
            if( moveY <= -limit ){ moveY = -limit; }
            item.style.height = this.state.targetRect.height + moveY+"px";
        },
        getCalcResizeRightEventHandler : function( item, x, y, limit ){
            var calcXY = this.getResizeLimitMaxPosition(x, y, "e");
            var moveX = calcXY.mouseX;
            if( moveX <= -limit ){ moveX = -limit; }
            item.style.width = this.state.targetRect.width + moveX+"px";
        },
        getCalcResizeLeftEventHandler : function( item, x, y, limit ){
            var calcXY = this.getResizeLimitMaxPosition(x, y, "w");
            var moveX = calcXY.mouseX;
            if( moveX >= limit ){ moveX = limit; }
            item.style.left = (this.state.targetX+moveX)+"px";
            item.style.width = (this.state.targetRect.width-moveX)+"px";
        },
        setMouseDownResizeEventHandler : function( event ){
            var handle = event.target;
            var parent = this.element.parent();
            var nodeX, nodeY, disableBool;
            this.uiBodyNode.addClass("disableSelection");
            this.state.mouseX = event.pageX;
            this.state.mouseY = event.pageY;
            this.state.strHandle = handle.classList[1];
            this.state.isResize = true;
            this.state.isDrag = true;
            disableBool = this.element.getAttr("data-disable");
            if( this.state.destroy || this.state.disable || disableBool === "true" ){
                this.state.isResize = false;
                this.state.isDrag = false;
            }
            if( !disableBool || disableBool === "false" || typeof disableBool === "undefined" ){
                this.state.isResize = true;
                this.state.isDrag = true;
            }
            if(this.state.isDrag){
                if( this.props.containment !== "parent" && this.props.containment !== "" && this.props.containment ){
                    parent = this.element.parents(this.props.containment);
                    if( typeof parent === "undefined" ){ parent = body; }
                }else if( this.props.containment === "parent" ){
                    parent = this.element.parent();
                }else{
                    parent = null;
                }
                nodeX = this.element.css("left");
                nodeY = this.element.css("top");
                if( nodeX === "auto" ){ nodeX = parseInt(this.element[0].offsetLeft); }
                if( nodeY === "auto" ){ nodeY = parseInt(this.element[0].offsetTop); }
                this.setLimitedAreaForUserCommand(parent, this.element, nodeX, nodeY);
                this.setCallBackStart({
                    target  : this.element[0],
                    width   : this.element.width(),
                    height  : this.element.height(),
                    positionX : parseInt(this.element.css("left")),
                    positionY : parseInt(this.element.css("top"))
                });
                this.setDragWindowControl();
            }
        },
        setMouseUpResizeEventHandler : function(){
            if( this.state.isResize && this.state.enable ){
                this.setCallBackStop({
                    target  : this.element[0],
                    width   : this.element.width(),
                    height  : this.element.height(),
                    positionX : parseInt(this.element.css("left")),
                    positionY : parseInt(this.element.css("top"))
                });
                this.state.isDrag = false;
                this.state.isResize = false;
            }
        },
        setMouseMoveWindowEventHandler : function( event ){
            var item =  this.element[0];
            if(this.state.isDrag && this.state.isResize && !this.state.isCancel){
                this.state.isMove = true;
                var targetRect = this.state.targetRect;
                var mouseX = event.pageX - this.state.mouseX;
                var mouseY = event.pageY - this.state.mouseY;
                var limitWidth = targetRect.width-(this.props.minWidth||50);
                var limitHeight = targetRect.height-(this.props.minHeight||50);
                if( this.state.strHandle === "js2uix-resize-e" ){
                    this.getCalcResizeRightEventHandler(item, mouseX, mouseY, limitWidth);
                }
                if( this.state.strHandle === "js2uix-resize-w" ){
                    this.getCalcResizeLeftEventHandler(item, mouseX, mouseY, limitWidth);
                }
                if( this.state.strHandle === "js2uix-resize-s" ){
                    this.getCalcResizeDownEventHandler(item, mouseX, mouseY, limitHeight);
                }
                if( this.state.strHandle === "js2uix-resize-n" ){
                    this.getCalcResizeUpEventHandler(item, mouseX, mouseY, limitHeight);
                }
                if( this.state.strHandle === "js2uix-resize-se" ){
                    this.getCalcResizeDownEventHandler(item, mouseX, mouseY, limitHeight);
                    this.getCalcResizeRightEventHandler(item, mouseX, mouseY, limitWidth);
                }
                if( this.state.strHandle === "js2uix-resize-ne" ){
                    this.getCalcResizeUpEventHandler(item, mouseX, mouseY, limitHeight);
                    this.getCalcResizeRightEventHandler(item, mouseX, mouseY, limitWidth);
                }
                if( this.state.strHandle === "js2uix-resize-nw" ){
                    this.getCalcResizeUpEventHandler(item, mouseX, mouseY, limitHeight);
                    this.getCalcResizeLeftEventHandler(item, mouseX, mouseY, limitWidth);
                }
                if( this.state.strHandle === "js2uix-resize-sw" ){
                    this.getCalcResizeDownEventHandler(item, mouseX, mouseY, limitHeight);
                    this.getCalcResizeLeftEventHandler(item, mouseX, mouseY, limitWidth);
                }
                this.setCallBackResize({
                    target  : this.element[0],
                    width   : this.element.width(),
                    height  : this.element.height(),
                    positionX : parseInt(this.element.css("left")),
                    positionY : parseInt(this.element.css("top"))
                });
            }
        },
        setMouseUpWindowEventHandler : function(){
            if( this.state.isResize ){
                this.setCallBackStop({
                    target  : this.element[0],
                    width   : this.element.width(),
                    height  : this.element.height(),
                    positionX : parseInt(this.element.css("left")),
                    positionY : parseInt(this.element.css("top"))
                });
            }
            this.state.isResize = false;
            this.state.isDrag = false;
            ROOT.removeEvent('mousemove.js2uix-'+this.state.dataId);
            ROOT.removeEvent('mouseup.js2uix-'+this.state.dataId);
            this.uiBodyNode.removeClass("disableSelection");
        },
        setResizeHandleControl : function(){
            this.element.find(".js2uix-resize-handle").addEvent({
                "mousedown.js2uix-resize-handle" : this.setMouseDownResizeEventHandler.bind(this),
                "mouseup.js2uix-resize-handle" : this.setMouseUpResizeEventHandler.bind(this)
            })
        },
        setDragWindowControl : function(){
            ROOT.addEvent('mousemove.js2uix-'+this.state.dataId, this.setMouseMoveWindowEventHandler.bind(this));
            ROOT.addEvent('mouseup.js2uix-'+this.state.dataId, this.setMouseUpWindowEventHandler.bind(this));
        },
        setCallBackCreate: function(){
            if( typeof this.props.create === 'function' ){
                this.props.create({
                    target  : this.element[0],
                    width   : this.element.width(),
                    height  : this.element.height(),
                    positionX : parseInt(this.element.css("left")),
                    positionY : parseInt(this.element.css("top"))
                });
            }
        },
        setCallBackStart : function( data ){
            if( typeof this.props.start === 'function' ){this.props.start(data);}
        },
        setCallBackResize : function( data ){
            if( typeof this.props.resize === 'function' ){ this.props.resize(data); }
        },
        setCallBackStop : function( data ){
            if( typeof this.props.stop === 'function' ){this.props.stop(data);}
        },
        enable : function(){
            this.state.enable = true;
            this.state.destroy = false;
            this.state.disable = false;
            this.element.removeAttr("data-disable");
        },
        destroy : function(){
            this.state.enable = false;
            this.state.disable = true;
            this.state.destroy = true;
            this.setRemoveResizeNodeConstruct();
        },
        disable : function(){
            this.state.enable = false;
            this.state.destroy = false;
            this.state.disable = true;
            this.element.attr("data-disable", true);
        },
        init : function(props){
            if( typeof props === 'object' ){js2uix.extend(this.props, props);}
            if( this.element ){
                this.state.dataId = js2uixUniqueId();
                this.setDefaultState();
                this.setDefaultHtml(this.element);
                this.setResizeHandleControl();
                this.setCallBackCreate();
            }
        }
    };
    js2uix.extend(js2uixToolResize.prototype, js2uixUICommon);
    js2uixToolResize.prototype.constructor = js2uixToolResize;

    var js2uixToolSortable = function(element, props){
        this.element = element;
        this.props = {
            axis              : false,
            addClass          : null,
            handle            : null,
            cancel            : null,
            connectWith       : null,
            cursor            : null,
            dropTarget        : null,
            create            : null,
            start             : null,
            sort              : null,
            stop              : null,
            revert            : false,
            scroll            : false,
            scrollSensitivity : 5,
            scrollSpeed       : 5,
            zIndex            : 0
        };
        this.state = {
            sortArea        : null,
            sortItem        : null,
            connectNode     : null,
            placeholder     : null,
            sortItemsFloat  : false,
            targetX         : 0,
            targetY         : 0,
            targetRect      : null,
            parent          : null,
            parentRect      : null,
            limitX          : 0,
            maxX            : 0,
            limitY          : 0,
            maxY            : 0,
            mouseX          : 0,
            mouseY          : 0,
            isDown          : false,
            isSort          : false,
            isMove          : false,
            isCancel        : false,
            isHandle        : false,
            enable          : true,
            disable         : false,
            destroy         : false,
            dataId          : null
        };
        this.init(props);
        return {
            enable  : this.enable.bind(this),
            destroy : this.destroy.bind(this),
            disable : this.destroy.bind(this)
        }
    };
    js2uixToolSortable.prototype = {
        uiBodyNode : null,
        setDefaultSortItem : function(sortItem){
            var module = this;
            var strFloat = sortItem.css("float");
            if( strFloat === "left" || strFloat === "right" ){ this.state.sortItemsFloat = true; }
            sortItem.addClass('js2uix-sortItem');
            js2uix.loop(sortItem, function(){
                var sortItem = js2uix(this);
                var posString = sortItem.css("position");
                if( posString !== "static" && posString !== "relative" ){
                    sortItem.css("position", "relative");
                }
                if( module.props.handle ){
                    var handler = sortItem.find(module.props.handle);
                    if( handler.length > 0 ){
                        if(module.props.cursor && module.props.cursor !== ""){
                            handler.css("cursor", module.props.cursor);
                        }
                    }
                }
                if( module.props.zIndex && typeof module.props.zIndex === "number" ){
                    sortItem.css("z-index", parseInt(module.props.zIndex));
                }
            });
        },
        setDefaultState : function(item){
            var sortItem = item.children();
            var strParentPos = item.css("position");
            this.uiBodyNode = (!this.uiBodyNode)?js2uix('body'):this.uiBodyNode;
            item.addClass('js2uix-sortable').removeAttr("data-disable");
            if( this.props.addClass ){ item.addClass(this.props.addClass); }
            if( !this.props.userSelect ){ item.setAttr("data-selectable", 'false'); }
            if( strParentPos === "static"){item.css("position", "relative");}
            this.setDefaultSortItem(sortItem);
        },
        setMouseDownEventHandler : function(event){
            this.state.sortItem = js2uix(js2uix(event.target).parents('.js2uix-sortItem')[0]);
            this.state.isHandle = true;
        },
        setMouseUpEventHandler : function(){
            this.state.isHandle = false;
        },
        setSortHandleControl : function(item, addEvent){
            var sortItems = item || this.element.find('.js2uix-sortItem');
            if(this.props.handle && this.props.handle !== ""){
                var userHandle = sortItems.find(this.props.handle);
                if( userHandle.length > 0 ){
                    if( addEvent ){
                        userHandle.addClass('js2uix-sort-handle');
                        userHandle.addEvent({
                            "mousedown.js2uix-sort-handle" : this.setMouseDownEventHandler.bind(this),
                            "mouseup.js2uix-sort-handle" : this.setMouseUpEventHandler.bind(this)
                        });
                    } else {
                        sortItems.removeEvent('mousedown.js2uix-sort-handle');
                        sortItems.removeEvent('mouseup.js2uix-sort-handle');
                    }
                }
            }else{
                this.state.isHandle = true;
            }
        },
        setCancelMouseDownEventHandler : function(){
            this.state.isCancel = true;
        },
        setCancelMouseUpEventHandler : function(){
            this.state.isCancel = false;
        },
        setSortCancelControl : function(item, addEvent){
            if( this.props.cancel && this.props.cancel !== ""){
                var sortItems = item || this.element.find('.js2uix-sortItem');
                var cancel = sortItems.find(this.props.cancel);
                if( cancel.length > 0 ){
                    if( addEvent ){
                        cancel.addClass('js2uix-sort-cancel');
                        cancel.addEvent({
                            "mousedown.js2uix-sort-cancel" : this.setCancelMouseDownEventHandler.bind(this),
                            "mouseup.js2uix-sort-cancel" : this.setCancelMouseUpEventHandler.bind(this)
                        });
                    } else {
                        cancel.removeEvent("mousedown.js2uix-sort-cancel");
                        cancel.removeEvent("mouseup.js2uix-sort-cancel");
                    }
                }
            }else{
                this.state.isCancel = false;
            }
        },
        setSortItemMouseDownHandler : function(event){
            var nodeX, nodeY;
            var target = this.state.sortItem = js2uix(event.target);
            if( !target.hasClass('js2uix-sortItem') ){ target = this.state.sortItem = target.parents('.js2uix-sortItem'); }
            var parent = this.state.sortArea = js2uix(target.parents('.js2uix-sortable')[0]);
            var disableBool = parent.getAttr("data-disable");
            if( !this.state.placeholder ){ this.state.placeholder = target.clone(false).empty().removeAttr("class").addClass('js2uix-placeholder'); }
            this.state.isSort = true;
            var scrollParent = this.state.sortArea[0].parentNode;
            this.state.mouseX = event.pageX + (scrollParent.scrollLeft || 0);
            this.state.mouseY = event.pageY + (scrollParent.scrollTop || 0);
            this.uiBodyNode.addClass("disableSelection");
            if( this.state.destroy || this.state.disable || disableBool === "true" ){ this.state.isSort = false; }
            if( !disableBool || disableBool === "false" || typeof disableBool === "undefined" ){ this.state.isSort = true; }
            if(this.state.isSort && this.state.enable ){
                this.state.targetRect = target[0].getBoundingClientRect();
                this.state.parentRect = parent[0].getBoundingClientRect();
                this.state.placeholder.css({
                    'width' : this.state.targetRect.width,
                    'height' : this.state.targetRect.height
                });
                target.css({
                    "position" : "absolute",
                    "width"    : this.state.targetRect.width,
                    "height"   : this.state.targetRect.height,
                    "left"     : this.state.targetRect.left - this.state.parentRect.left,
                    "top"      : this.state.targetRect.top - this.state.parentRect.top,
                    "z-index"  : 1000
                }).after(this.state.placeholder);
                nodeX = target.css("left");
                nodeY = target.css("top");
                if( nodeX === "auto" ){ nodeX = parseInt(target[0].offsetLeft); }
                if( nodeY === "auto" ){ nodeY = parseInt(target[0].offsetTop); }
                this.setLimitedAreaForUserCommand(parent, target, nodeX, nodeY);
                if( !this.state.isCancel ){ this.setSortWindowControl(true); }
                 this.setCallBackStart({
                     sortArea  : this.state.sortArea[0],
                     sortItem  : this.state.sortItem[0],
                     index     : target.index(),
                     prevNode  : target.prevNode()[0],
                     nextNode  : target.nextNode()[0]
                 });
            }
        },
        setSortItemMouseUpHandler : function(){
            this.state.isCancel = false;
        },
        setSortItemControlEvent : function(item, addEvent){
            var sortItems = item || this.element.find('.js2uix-sortItem');
            if( sortItems.length > 0 ){
                if( addEvent ){
                    sortItems.addEvent("mousedown.js2uix-sort-move", this.setSortItemMouseDownHandler.bind(this) );
                    sortItems.addEvent("mouseup.js2uix-sort-move", this.setSortItemMouseUpHandler.bind(this) );
                } else {
                    sortItems.removeEvent("mousedown.js2uix-sort-move");
                    sortItems.removeEvent("mouseup.js2uix-sort-move");
                }
            }
        },
        checkMouseMoveLimitAreaCheck : function(mouseX, mouseY){
            if( this.props.axis && this.props.axis === "y" ){
                if( mouseX <= this.state.limitX  ){mouseX = this.state.limitX ;}
                if( mouseX >= this.state.maxX ){mouseX = this.state.maxX ;}
            }
            if( this.props.axis && this.props.axis === "x" ){
                if( mouseY <= this.state.limitY  ){mouseY = this.state.limitY ;}
                if( mouseY >= this.state.maxY ){mouseY = this.state.maxY ;}
            }
            return {
                mouseX : mouseX,
                mouseY : mouseY
            }
        },
        sortConnectWidthHandler : function(elm){
            var connectNode;
            var targetRect;
            var parentNode = null;
            try {
                if( this.props.connectWith ){
                    connectNode = js2uix(this.props.connectWith);
                    if( connectNode.length > 0 ){
                        targetRect = elm[0].getBoundingClientRect();
                        js2uix.loop(connectNode, function(){
                            var target = js2uix(this);
                            if( !target.hasClass("js2uix-sortable") ){ target = target.find(".js2uix-sortable") }
                            if( target.length !== 0 ){
                                var dropRect = this.getBoundingClientRect();
                                if( ((targetRect.right > dropRect.left+(targetRect.width*0.5) ) && (targetRect.left< dropRect.right-(targetRect.width*0.5) )) &&  ((targetRect.bottom > dropRect.top) && (targetRect.top < dropRect.bottom))  ){
                                    parentNode = this;
                                }
                            }
                        });
                    }
                }
                return parentNode;
            } finally {
                connectNode = null;
                targetRect = null;
                parentNode = null;
            }
        },
        sortPlaceHolderHandler : function(elm){
            var state = this.state;
            var childItem = state.sortArea.find('.js2uix-sortItem');
            var placeHolder = state.placeholder;
            var obj_itemRect = elm[0].getBoundingClientRect();

            if( childItem.length > 0 ){
                js2uix.loop(childItem, function(){
                    var item = js2uix(this);
                    var itemsRect = this.getBoundingClientRect();
                    if( obj_itemRect.top > itemsRect.top && obj_itemRect.top < itemsRect.bottom ){
                        if( state.sortItemsFloat ){
                            if( obj_itemRect.left > itemsRect.left && obj_itemRect.left < itemsRect.right ){
                                item.after(placeHolder);
                            }
                            if( obj_itemRect.right > itemsRect.left &&  obj_itemRect.right < itemsRect.right){
                                item.before(placeHolder);
                            }
                        }else{
                            item.after(placeHolder);
                        }
                    }
                    if( obj_itemRect.bottom > itemsRect.top &&  obj_itemRect.bottom < itemsRect.bottom){
                        if( state.sortItemsFloat ){
                            if( obj_itemRect.left > itemsRect.left && obj_itemRect.left < itemsRect.right ){
                                item.after(placeHolder);
                            }
                            if( obj_itemRect.right > itemsRect.left &&  obj_itemRect.right < itemsRect.right){
                                item.before(placeHolder);
                            }
                        }else{
                            item.before(placeHolder);
                        }
                    }
                });
            }else{
                state.sortArea.append(placeHolder)
            }
        },
        setWindowMouseMoveHandler : function(evt){
            var mouseX, mouseY, calcXY, targetX, targetY, scrollParent, checkConnectParent;
            if( this.state.isSort && this.state.isHandle && !this.state.isCancel ){
                mouseX = evt.pageX - this.state.mouseX;
                mouseY = evt.pageY - this.state.mouseY;
                calcXY = this.checkMouseMoveLimitAreaCheck(mouseX, mouseY);
                scrollParent = this.state.sortArea[0].parentNode;
                targetX = this.state.targetX + calcXY.mouseX;
                targetY = this.state.targetY + calcXY.mouseY;
                checkConnectParent = this.sortConnectWidthHandler(this.state.sortItem);
                this.state.isMove = !!(mouseX !== 0 && mouseY !== 0);
                if( checkConnectParent ){
                    this.state.sortArea = js2uix(checkConnectParent);
                }
                if( this.props.scroll ){
                    if ( !this.props.axis || this.props.axis !== "x" ) {
                        if ( scrollParent.offsetHeight-targetY < this.props.scrollSensitivity ) {
                            scrollParent.scrollTop  = scrollParent.scrollTop + this.props.scrollSpeed;
                        } else if ( targetY < this.props.scrollSensitivity ) {
                            scrollParent.scrollTop  = scrollParent.scrollTop - this.props.scrollSpeed;
                        }
                        targetY = targetY + scrollParent.scrollTop;
                    }
                    if ( !this.props.axis || this.props.axis !== "y" ) {
                        if ( scrollParent.offsetLeft-targetX < this.props.scrollSensitivity ) {
                            scrollParent.scrollLeft  = scrollParent.scrollLeft + this.props.scrollSpeed;
                        } else if ( targetX < this.props.scrollSensitivity ) {
                            scrollParent.scrollLeft  = scrollParent.scrollLeft - this.props.scrollSpeed;
                        }
                        targetX = targetX + scrollParent.scrollLeft;
                    }
                }
                this.state.sortItem[0].style.left = targetX+"px";
                this.state.sortItem[0].style.top = targetY+"px";
                this.sortPlaceHolderHandler( this.state.sortItem );
                this.setCallBackSort({
                    sortArea  : this.state.sortArea[0],
                    sortItem  : this.state.sortItem[0],
                    index     : this.state.sortItem.index(),
                    prevNode  : this.state.sortItem.prevNode()[0],
                    nextNode  : this.state.sortItem.nextNode()[0]
                });
            }
        },
        setWindowMouseUpHandler : function(){
            var item = this.state.sortItem;
            var placeHolder, prevNode, nextNode;
            if( this.state.isSort && this.state.enable ){
                placeHolder = js2uix(this.state.placeholder);
                prevNode = placeHolder.prevNode();
                nextNode = placeHolder.nextNode();
                if( this.state.isMove ) {if (this.state.sortArea.find(item).length < 1) { this.state.sortArea.append(item); }}
                if( prevNode.length > 0 ){ prevNode.after(item.removeAttr("style")); }
                else{ nextNode.before(item.removeAttr("style")); }
                placeHolder.remove();
                var sortTarget = js2uix('.js2uix-sortable');
                sortTarget.find('.js2uix-placeholder').remove();
                sortTarget.find('.js2uix-sortItem').removeAttr("style");
                this.state.placeholder = null;
                this.state.isCancel = false;
                this.state.isSort = false;
                this.state.isMove = false;
                this.setSortWindowControl(false);
                this.setCallBackStop({
                    sortArea : this.state.sortArea[0],
                    sortItem : this.state.sortItem[0],
                    index    : item.index(),
                    prevNode : item.prevNode()[0],
                    nextNode : item.nextNode()[0]
                });
            }
        },
        setSortWindowControl : function(addEvent){
            if( addEvent ){
                ROOT.addEvent('mousemove.js2uix-'+this.state.dataId, this.setWindowMouseMoveHandler.bind(this) );
                ROOT.addEvent('mouseup.js2uix-'+this.state.dataId, this.setWindowMouseUpHandler.bind(this) );
            } else {
                ROOT.removeEvent('mousemove.js2uix-'+this.state.dataId);
                ROOT.removeEvent('mouseup.js2uix-'+this.state.dataId);
            }
        },
        setNewItemCreateSort : function(item){
            this.setDefaultSortItem(item);
            this.setSortHandleControl(item, true);
            this.setSortCancelControl(item, true);
            this.setSortItemControlEvent(item, true);
        },
        setOldItemRemoveSort : function(item){
            this.setSortHandleControl(item, false);
            this.setSortCancelControl(item, false);
            this.setSortItemControlEvent(item, false);
        },
        setRemoveSortNodeConstruct : function(item){
            var sortHandle = item.find('.js2uix-sort-handle');
            var sortCancel = item.find('.js2uix-sort-cancel');
            var sortItems = item.find('.js2uix-sortItem');
            try{
                item[0].style.position = "";
                item[0].style.cursor = "";
                item[0].style.zIndex = "";
                item.removeClass('js2uix-sortable').removeAttr("data-selectable");
                sortHandle[0].style.cursor = "";
                sortItems.removeAttr("style");
                sortHandle.removeClass('js2uix-sort-handle').removeEvent("mousedown.js2uix-sort").removeEvent("mouseup.js2uix-drag");
                sortCancel.removeClass('js2uix-sort-cancel').removeEvent("mousedown.js2uix-sort").removeEvent("mouseup.js2uix-sort");
                sortItems.removeClass('js2uix-sortItem').removeEvent("mousedown.js2uix-sort").removeEvent("mouseup.js2uix-sort");
                ROOT.removeEvent('mousemove.js2uix-'+this.state.dataId);
                ROOT.removeEvent('mouseup.js2uix-'+this.state.dataId);
            } finally {
                sortHandle = null;
                sortCancel = null;
                sortItems = null;
            }
        },
        setCallBackCreate: function(item){
            if( typeof this.props.create === 'function' ){
                this.props.create({
                    target    : item[0],
                    width     : item.width(),
                    height    : item.height(),
                    positionX : parseInt(item.css('left')),
                    positionY : parseInt(item.css('top'))
                });
            }
        },
        setCallBackStart : function(data){
            if( typeof this.props.start === 'function' ){
                this.props.start(data);
            }
        },
        setCallBackSort : function(data){
            if( typeof this.props.sort === 'function' ){
                this.props.sort(data);
            }
        },
        setCallBackStop : function(data){
            if( typeof this.props.stop === 'function' ){
                this.props.stop(data);
            }
        },
        setObserveChild : function(){
            js2uixDomObserver(this.element[0], function(change){
                if( change.type === "childList" && (change.addedNodes.length > 0 || change.removedNodes.length > 0) ){
                    for(var i=0; i<change.addedNodes.length; i++){
                        var addNode = change.addedNodes[i];
                        if( addNode && !js2uix.hasClass(addNode, 'js2uix-placeholder') ){
                            if( addNode.nodeType === 1 ){
                                if( !addNode[ModuleName] || !js2uix.hasClass(addNode, 'js2uix-sortItem') ){
                                    this.setNewItemCreateSort(js2uix(addNode));
                                }
                            }
                        }
                    }
                    for(var j=0; j<change.removedNodes.length; j++){
                        var removeNode = change.removedNodes[j];
                        if( removeNode && !js2uix.hasClass(removeNode, 'js2uix-placeholder') ){
                            if( removeNode.nodeType === 1 ){
                                if( js2uix.hasClass(removeNode, 'js2uix-sortItem') ){
                                }
                            }
                        }
                    }
                }
            }.bind(this));
        },
        enable  : function(){
            this.state.enable = true;
            this.state.destroy = false;
            this.state.disable = false;
            this.element.removeAttr("data-disable");
        },
        destroy : function(){
            this.state.enable = false;
            this.state.disable = true;
            this.state.destroy = true;
            this.setRemoveSortNodeConstruct(this.element);
        },
        disable : function(){
            this.state.enable = false;
            this.state.destroy = false;
            this.state.disable = true;
            this.element.setAttr("data-disable", true);
        },
        init : function(props){
            js2uix.extend(this.props, props);
            this.state.dataId = js2uixUniqueId();
            this.setDefaultState(this.element);
            this.setSortHandleControl(null, true);
            this.setSortItemControlEvent(null, true);
            this.setSortCancelControl(null, true);
            this.setObserveChild();
            this.setCallBackCreate(this.element);
        }
    };
    js2uix.extend(js2uixToolSortable.prototype, js2uixUICommon);
    js2uixToolSortable.prototype.constructor = js2uixToolSortable;

    var js2uixToolTree = function(element, props){
        this.element = element;
        this.props = {
            mainTitleName : 'title',
            childDataName : 'data',
            onClickEvent : null
        };
        this.state = {
            treeNode : null
        };
        this.init(props);
        return {
            name : this.js2uixName,
            setData : this.setData.bind(this)
        }
    };
    js2uixToolTree.prototype = {
        js2uixName : 'js2uix-tree',
        js2uixTreeContent : 'js2uix-tree-content',
        setTreeElementStyle : function(){
            this.element.addClass(this.js2uixName);
            this.element.css({'overflow' : 'hidden', 'overflow-y' : 'auto'});
        },
        setTreeElementNode : function(){
            this.state.treeNode = js2uix.createDom('div', {'className':this.js2uixTreeContent}, true);
            this.element.html( this.state.treeNode);
        },
        setCreateTreeItemForData : function(param){
            var module = this;
            var title = this.props.mainTitleName;
            var data = this.props.childDataName;
            var createNode = function(param, parent){
                var parentNode = parent || js2uix.createDom('ul', {'className':'js2uix-tree-group'}, true);
                js2uix.loop(param, function(num, obj){
                    var liNode = js2uix.createDom('li', {'className':'js2uix-tree-item'}, true);
                    var titleNode = js2uix.createDom('span', {'className':'js2uix-tree-title', 'content' : '<em class="js2uix-tree-icon"></em>'+'<span class="js2uix-tree-text">'+obj[title]+'</span>'},true);
                    liNode.append(titleNode.setAttr('data-child', 'false')).setAttr('data-open', 'false');
                    js2uix.loop(obj, function(key, val){liNode.setAttr('data-'+key, val);});
                    module.setDefaultControl(titleNode, true);
                    if( obj[data] && obj[data].length > 0 ){
                        var dataNode = js2uix.createDom('span', {'className':'js2uix-tree-child', 'attributes' : {'data-view':'none'}}, true);
                        var ulData = js2uix.createDom('ul', {'className':'js2uix-tree-group'}, true);
                        titleNode.setAttr('data-child', 'true');
                        dataNode.append(createNode(obj[data], ulData));
                        liNode.append(dataNode);
                    }
                    parentNode.append(liNode)
                });
                return parentNode;
            };
            this.state.treeNode.html(createNode(param));
        },
        setItemClickEventHandler : function(item){
            var child = item.parentNode.children[1];
            if( child ){
                if( child.style.display !== 'block' ){
                    child.style.display = 'block';
                    child.setAttribute('data-view', 'block');
                    item.parentNode.setAttribute('data-open', 'true');
                } else {
                    child.style.display = 'none';
                    child.setAttribute('data-view', 'none');
                    item.parentNode.setAttribute('data-open', 'false');
                    js2uix(child).find('.js2uix-tree-item').loop(function(){
                        this.setAttribute('data-open', 'false');
                    });
                    js2uix(child).find('.js2uix-tree-child').loop(function(){
                        this.style.display = 'none';
                        this.setAttribute('data-view', 'none');
                    });
                }
            }
        },
        setDefaultControl : function(target, bind){
            if( bind ){
                var module = this;
                target.find('.js2uix-tree-text').addEvent('click.js2uix-tree-control', function(){
                    if( module.props.onClickEvent && typeof module.props.onClickEvent === 'function' ){
                        var item = this.parentNode.parentNode;
                        var callBackData = {};
                        for(var i=0; i<item.attributes.length; i++){
                            var data = item.attributes[i];
                            var name = data.name;
                            if( name !== 'class' && name !== 'id'  && name !== 'data-open'){
                                callBackData[name.replace('data-','')] = data.value;
                            }
                        }
                        module.props.onClickEvent(callBackData, item);
                    }
                });
                target.find('.js2uix-tree-icon').addEvent('click.js2uix-tree-control', function(){
                    module.setItemClickEventHandler(this.parentNode);
                });
            } else {
                this.element.find('.js2uix-tree-title').removeEvent('all');
            }
        },
        setData : function(param){
            if( Array.isArray(param) ){
                this.setDefaultControl(null, false);
                this.setCreateTreeItemForData(param);
            }
        },
        init : function(props){
            if( typeof props === 'object' ){
                js2uix.extend(this.props, props);
                this.setTreeElementNode();
                this.setTreeElementStyle();
                this.setDefaultControl(null, false);
            }
        }
    };
    js2uixToolTree.prototype.constructor = js2uixToolTree;

    var js2uixCalendar;
    var js2uixCalendarCommon = {getDateCheckUserObject : function(y, m, d){
            var date = new Date();
            if( y && m && d ){ date = new Date(y, m-1, d); } else if( y && m && !d ){ date = new Date(y, m-1); } else if( y && !m && !d ){ if(y === "number" ){ date = new Date(y); } else if( y === "string" ){ date = new Date(y); } }
            var weekStrArray = ["SU","MO","TU","WE","TH","FR","SA"];
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            var weekNumber = date.getDay();
            var weekString = weekStrArray[weekNumber];
            var firstDay = new Date(year, month-1, 1);
            var lastDay = new Date(year, month, 0);
            var prevSearchYear = year;
            var prevSearchMonth = month-1;
            var nextSearchYear = year;
            var nextSearchMonth = month+1;
            var nextFirstDay;
            var prevLastDay;
            try {
                if( month === 1 ){
                    prevSearchYear = year-1;
                    prevSearchMonth = 12;
                }
                if( month === 12 ){
                    nextSearchYear = year+1;
                    nextSearchMonth = 1;
                }
                nextFirstDay = new Date(nextSearchYear, nextSearchMonth-1, 1);
                prevLastDay = new Date(prevSearchYear, prevSearchMonth, 0);
                return {
                    current_year            : year,
                    current_month           : month,
                    current_day             : day,
                    current_weekString      : weekString,
                    current_weekNumber      : weekNumber,
                    current_firstDay        : firstDay.getDate(),
                    current_firstWeekNumber : firstDay.getDay(),
                    current_lastDay         : lastDay.getDate(),
                    current_lastWeekNumber  : lastDay.getDay(),
                    next_year               : nextSearchYear,
                    next_month              : nextSearchMonth,
                    next_firstDay           : nextFirstDay.getDate(),
                    next_firstWeekNumber    : nextFirstDay.getDay(),
                    prev_year               : prevSearchYear,
                    prev_month              : prevSearchMonth,
                    prev_lastDay            : prevLastDay.getDate(),
                    prev_lastWeekNumber     : prevLastDay.getDay()
                }
            } finally {
                date = null;
                weekStrArray = null;
                year = null;
                month = null;
                day = null;
                weekNumber = null;
                weekString = null;
                firstDay = null;
                lastDay = null;
                prevSearchYear = null;
                prevSearchMonth = null;
                nextSearchYear = null;
                nextSearchMonth = null;
                nextFirstDay = null;
                prevLastDay = null;
            }
        }};
    var js2uixCheckScroll = function(target) {
        var rootElem = target;
        var overflowStyle;
        if (typeof rootElem.currentStyle !== 'undefined'){
            overflowStyle = rootElem.currentStyle.overflow;
        }
        overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow;
        var overflowYStyle;
        if (typeof rootElem.currentStyle !== 'undefined'){
            overflowYStyle = rootElem.currentStyle.overflowY;
        }
        overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY;
        var contentOverflows = rootElem.scrollHeight > rootElem.clientHeight;
        var overflowShown    = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle)
        var alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll';
        return (contentOverflows && overflowShown) || (alwaysShowScroll)
    };
    var js2uixToolCalendar = function(){
        this.dom = {};
        this.props = {
            languageKor : {
                weekArray   : ["%EC%9D%BC","%EC%9B%94","%ED%99%94","%EC%88%98","%EB%AA%A9","%EA%B8%88","%ED%86%A0"],
                monthArray  : [1,2,3,4,5,6,7,8,9,10,11,12],
                yearString  : "%EB%85%84",
                monthString : "%EC%9B%94"
            },
            languageEng : {
                weekArray   : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
                monthArray  : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
                yearString  : null,
                monthString : null
            }
        };
        this.state = {
            active : false,
            target : null,
            dateFormat : "yyyy-mm-dd",
            dateRange : null,
            language : "eng",
            onChangeDate : null,
            setDate : null,
            untilToday : false,
            zIndex : 99999
        };
        this.init();
        return {
            name : this.js2uixName,
            setCalendar : this.setCalendar.bind(this)
        }
    };
    js2uixToolCalendar.prototype = {
        js2uixName : 'js2uix-calendar',
        setCalendarStateChange : function(){
            if( this.state.language === 'eng' ){
                this.dom.headEng[0].style.display = this.dom.contentEng[0].style.display = 'block';
                this.dom.headKor[0].style.display = this.dom.contentKor[0].style.display = 'none';
            } else {
                this.dom.headEng[0].style.display = this.dom.contentEng[0].style.display = 'none';
                this.dom.headKor[0].style.display = this.dom.contentKor[0].style.display = 'block';
            }
        },
        setCalendarLayoutChange : function(target){
            if( target ){
                var layout = target.getBoundingClientRect();
                var scrollTop = parseInt(ROOT[0].scrollTop);
                var scrollLeft = parseInt(ROOT[0].scrollLeft);
                var calendarTop = (layout.top+scrollTop)+layout.height+3;
                var calendarLeft = (layout.left+scrollLeft)+(layout.width*0.5)-(this.dom.js2uixCalendar.width()*0.5);
                if( layout.left <= 0 ){ calendarLeft = layout.left; }
                try {
                    this.state.active = true;
                    this.dom.monthBox[0].style.display = 'none';
                    this.dom.js2uixCalendar[0].style.display = 'none';
                    this.dom.js2uixCalendar.css({"top"  : calendarTop, "left" : calendarLeft, 'display':'block'})
                } finally {
                    layout = null;
                    scrollTop = null;
                    scrollLeft = null;
                    calendarTop = null;
                    calendarLeft = null;
                }
            } else {
                this.dom.js2uixCalendar.css({"top"  : -99999, "left" : -99999, 'display':'none'})
            }
        },
        setCreateHeaderMiddleWrap : function(){
            var controlWrap =  js2uix.createDom('div', {
                'className': 'js2uix-date-wrap'
            }, true);
            this.dom.headEng = js2uix.createDom('div', {
                'className': 'js2uix-date-eng',
                'content': '<div class="js2uix-month-string"><span></span></div><div class="js2uix-year-string"><span></span></div>'
            }, true);
            this.dom.headKor = js2uix.createDom('div', {
                'className': 'js2uix-date-kor',
                'content': '<div class="js2uix-year-string"><span></span></div>' +
                '<div class="js2uix-date-common js2uix-date-month"><span>'+(js2uix.codeToString(this.props.languageKor.yearString))+'</span></div>' +
                '<div class="js2uix-month-string"><span></span></div>' +
                '<div class="js2uix-date-common js2uix-date-day"><span>'+(js2uix.codeToString(this.props.languageKor.monthString))+'</span></div>'
            },true );
            return controlWrap.append(this.dom.headEng, this.dom.headKor);
        },
        setCreateContentTable : function(){
            var tableNode = js2uix.createDom('div', {'className' : 'js2uix-calendar-table'}, true);
            this.dom.contentHead = js2uix.createDom('div', {'className' : 'js2uix-table-head'}, true);
            this.dom.contentBody = js2uix.createDom('div', {'className' : 'js2uix-table-body'}, true);
            this.dom.contentEng = js2uix.createDom('ul', {'className':'js2uix-head-eng'}, true);
            this.dom.contentKor = js2uix.createDom('ul', {'className':'js2uix-head-kor'}, true);
            js2uix.loop(this.props.languageEng.weekArray, function(key, value){this.dom.contentEng.append('<li><span>'+value+'</span></li>');}.bind(this));
            js2uix.loop(this.props.languageKor.weekArray, function(key, value){this.dom.contentKor.append('<li><span>'+js2uix.codeToString(value)+'</span></li>');}.bind(this));
            this.dom.contentHead.append(this.dom.contentEng, this.dom.contentKor);
            tableNode.append(this.dom.contentHead, this.dom.contentBody);
            try {
                return tableNode
            } finally {
                tableNode = null;
            }
        },
        setCreateMonthBoxNode : function(){
            var index = 1;
            var result = js2uix.createDom('div', {'className':'js2uix-calendar-select'}, true);
            var yearBox = js2uix.createDom('div', {
                'className':'js2uix-select-year',
                'content' : '<div class="js2uix-select-prev"><span></span></div>' +
                '<div class="js2uix-select-input"><input type="text" min="1000" max="9999" maxlength="4" /></div>' +
                '<div class="js2uix-select-next"><span></span></div>'
            });
            var monthBox = js2uix.createDom('div', {'className':'js2uix-select-month', 'content' : '<table><tbody><tr></tr><tr></tr><tr></tr></tbody></table>'});
            var tableNode = monthBox.firstChild.firstChild;
            try {
                result.append(yearBox, monthBox);
                js2uix.loop((this.state.language === "kor")?this.props.languageKor.monthArray:this.props.languageEng.monthArray, function(num, value){
                    tableNode.children[index-1].innerHTML += '<td data-month="'+(num+1)+'">'+value+'</td>';
                    if((num+1)%4 === 0){index++;}
                });
                return result;
            } finally {
                result = null;
                yearBox = null;
                monthBox = null;
                tableNode = null;
            }
        },
        setCreateDefaultElement : function(){
            this.dom.js2uixCalendar = js2uix.createDom('div', {'className' : this.js2uixName, 'idName' : this.js2uixName, 'attributes' : {'data-language':this.props.language}}, true);
            this.dom.header = js2uix.createDom('div', {'className':'js2uix-calendar-header'}, true);
            this.dom.headerLeft = js2uix.createDom('div', {'className':'js2uix-control-left', 'content' : '<span class="js2uix-year-prev"></span><span class="js2uix-month-prev"></span>'});
            this.dom.headerMiddle = js2uix.createDom('div', {'className': 'js2uix-control-mid', 'content' : this.setCreateHeaderMiddleWrap()}, true);
            this.dom.headerRight = js2uix.createDom('div', {'className':'js2uix-control-right', 'content' : '<span class="js2uix-month-next"></span><span class="js2uix-year-next"></span>'});
            this.dom.header.append(this.dom.headerLeft, this.dom.headerMiddle, this.dom.headerRight);
            this.dom.content = js2uix.createDom('div', {'className':'js2uix-calendar-body'}, true);
            this.dom.content.append(this.setCreateContentTable());
            this.dom.monthBox = js2uix.createDom('div', {'className':'js2uix-calendar-hidden'}, true);
            this.dom.monthBox.append(this.setCreateMonthBoxNode());
            this.dom.arrow = js2uix.createDom('span', {'className':'js2uix-calendar-arrow'}, true);
            this.dom.js2uixCalendar.append(this.dom.header, this.dom.content, this.dom.monthBox, this.dom.arrow);
            js2uix('body').append(this.dom.js2uixCalendar);
        },
        setParseMinMaxDateFormat : function(){
            var minDate = null;
            var maxDate = null;
            if( this.state.dateRange && Array.isArray(this.state.dateRange) && this.state.dateRange.length > 0 ){
                var rangeMin = (this.state.dateRange[0])?(this.state.dateRange[0]).replace(/[^0-9]/gi, ''):null;
                var rangeMax = (this.state.dateRange[1])?this.state.dateRange[1].replace(/[^0-9]/gi, ''):null;
                if( (rangeMin && rangeMin.length === 8) || (rangeMax && rangeMax.length === 8) ){
                    if( rangeMin ){minDate = {year : parseInt(rangeMin.substr(0,4)), month : parseInt(rangeMin.substr(4,2)), day : parseInt(rangeMin.substr(6,2))};}
                    if( rangeMax ){maxDate = {year : parseInt(rangeMax.substr(0,4)), month : parseInt(rangeMax.substr(4,2)), day : parseInt(rangeMax.substr(6,2))};}
                }
            }
            return {
                min : minDate,
                max : maxDate
            }
        },
        setCalendarDateCalculation : function(target, param){
            if( !target ){ return false; }
            var year = this.dom.header.find('.js2uix-year-string span');
            var month = this.dom.header.find('.js2uix-month-string span');
            var newObject = [];
            var current = false;
            var nowDate = new Date();
            var nowYear = nowDate.getFullYear();
            var nowMonth = nowDate.getMonth()+1;
            var nowDay = nowDate.getDate();
            var totalDayNumberLoop = Math.ceil((param.current_firstWeekNumber+param.current_lastDay)/7);
            var insertStartDay= parseInt(param.prev_lastDay-param.prev_lastWeekNumber);
            var minMax = this.setParseMinMaxDateFormat();
            if( param.prev_lastWeekNumber >= 6 ){insertStartDay = 1;}
            this.state.selectYear = parseInt(target.getAttribute('data-year'));
            this.state.selectMonth = parseInt(target.getAttribute('data-month'));
            this.state.selectDay = parseInt(target.getAttribute('data-day'));
            for(var i=1; i<=totalDayNumberLoop; i++){
                var trNode = js2uix.createDom('ul',{},true);
                for(var j=1; j<=7; j++){
                    if( i <= 2 && insertStartDay > param.prev_lastDay ){
                        insertStartDay = 1;
                        current = true;
                    }
                    if( i === totalDayNumberLoop && insertStartDay > param.current_lastDay ){
                        insertStartDay = 1;
                        current = false;
                    }
                    var tdNode = js2uix.createDom('li', {
                        'attributes' : {
                            "data-day"   :insertStartDay,
                            "data-month" :param.current_month,
                            "data-year"  :param.current_year
                        }, 'content' : '<span>'+insertStartDay+'</span>'
                    }, true);
                    if( i === 1 && j <= param.current_firstWeekNumber ){
                        tdNode.addClass("js2uix-calendar-prev").setAttr({"data-year"  : param.prev_year, "data-month" : param.prev_month});
                    } else if( (i === totalDayNumberLoop) && (j > param.current_lastWeekNumber+1) ){
                        tdNode.addClass("js2uix-calendar-next").setAttr({"data-year"  : param.next_year, "data-month" : param.next_month});
                    } else {
                        if( insertStartDay === nowDay && current && nowYear === param.current_year && nowMonth === param.current_month ){ tdNode.addClass("js2uix-calendar-today"); }
                        if( this.state.selectDay === insertStartDay && this.state.selectYear === param.current_year && this.state.selectMonth === param.current_month ){ tdNode.addClass("js2uix-calendar-select"); }
                    }
                    if( this.state.dateRange ){
                        if( param.current_year < minMax.min.year || param.current_year > minMax.max.year){
                            tdNode.addClass("js2uix-date-disabled");
                        } else {
                            if( param.current_year === minMax.min.year && param.current_month < minMax.min.month ){
                                tdNode.addClass("js2uix-date-disabled");
                            }
                            if( param.current_year === minMax.min.year && param.current_month === minMax.min.month && insertStartDay < minMax.min.day ){
                                tdNode.addClass("js2uix-date-disabled");
                            }
                            if( param.current_year === minMax.max.year && param.current_month > minMax.max.month ){
                                tdNode.addClass("js2uix-date-disabled");
                            }
                            if( param.current_year === minMax.max.year && param.current_month === minMax.max.month && insertStartDay > minMax.max.day  ){
                                tdNode.addClass("js2uix-date-disabled");
                            }
                        }
                    }
                    if( this.state.untilToday ){
                        if( (nowYear < param.current_year) || ((nowYear === param.current_year) && ((nowMonth < param.current_month) || (nowMonth === param.current_month && ((insertStartDay > nowDay) || (i === totalDayNumberLoop && j > param.current_lastWeekNumber+1))))) ){
                            tdNode.addClass("js2uix-date-disabled");
                        }
                    }
                    trNode.append(tdNode);
                    insertStartDay++;
                }
                newObject.push(trNode[0]);
            }
            try {
                year.text(param.current_year);
                if( this.state.language === "eng" ){ month.text(this.props.languageEng.monthArray[param.current_month-1]); }
                else{ month.text(param.current_month); }
                this.dom.monthBox.find(".js2uix-select-year input")[0].value = param.current_year;
                this.dom.monthBox.find(".js2uix-select-month td").removeClass("on");
                this.dom.monthBox.find(".js2uix-select-month td[data-month='"+param.current_month+"']").addClass("on");
                this.dom.js2uixCalendar.setAttr({"data-year" : param.current_year, "data-month" : param.current_month });
                this.setAddEventDateItem(false);
                this.dom.contentBody.html(js2uix(newObject));
                this.setAddEventDateItem(true);
            } finally {
                year = null;
                month = null;
                newObject = null;
                current = null;
                nowDate = null;
                nowYear = null;
                nowMonth = null;
                nowDay = null;
                totalDayNumberLoop = null;
                insertStartDay = null;
                minMax = null;
            }
        },
        setCalendar : function(target, props, state){
            js2uix.extend(this.state, props);
            this.state.target = target;
            this.setCalendarStateChange();
            this.setCalendarDateCalculation(target, this.getDateCheckUserObject(state.year, state.month, state.day));
            this.setCalendarLayoutChange(target);
        },
        getSwitchDateNumber : function(type, select){
            var year = parseInt(this.dom.js2uixCalendar.getAttr("data-year"));
            var month = parseInt(this.dom.js2uixCalendar.getAttr("data-month"));
            switch(type){
                case "nextMonth" :
                    month++;
                    if( month > 12 ){
                        year = year+1;
                        if( year >= 9999 ){
                            year = 9999;
                        }
                        month = 1;
                    }
                    break;
                case "nextYear"  :
                    year++;
                    if( year >= 9999 ){
                        year = 9999;
                    }
                    break;
                case "prevMonth" :
                    month--;
                    if( month < 1 ){
                        year = year-1;
                        if( year <= 1000 ){
                            year = 1000
                        }
                        month = 12;
                    }
                    break;
                case "prevYear"  :
                    year--;
                    if( year <= 1000 ){
                        year = 1000
                    }
                    break;
                case "selectDate" :
                    year = select.select_input;
                    month = select.select_number;
                    break;
            }
            return {
                year : year,
                month : month
            };
        },
        setChangeDateHandler : function(item){
            this.state.selectYear = item.getAttr('data-year');
            this.state.selectMonth = item.getAttr('data-month');
            this.state.selectDay = item.getAttr('data-day');
        },
        setCommonEventHandler : function(){
            if(this.state.active){
                this.state.active = false;
                this.setCalendarLayoutChange(false);
                js2uix('.js2uix-calendar-target').removeClass('js2uix-calendar-target');
            }
        },
        setCommonControlHandler : function(type, select){
            var target = this.state.target;
            if( target ){
                var result = this.getSwitchDateNumber(type, select);
                var param = this.getDateCheckUserObject(result.year, result.month);
                this.setCalendarDateCalculation(target, param);
            }
        },
        setAddEventDateItem : function(type){
            if(!type){
                this.dom.contentBody.find('li').removeEvent('all');
            } else {
                var module = this;
                this.dom.contentBody.find('li:not(.js2uix-date-disabled)').addEvent('click.js2uix-calendar-item', function(){
                    module.setChangeDateHandler(js2uix(this));
                    module.onChangeDate();
                    module.setCommonEventHandler();
                });
            }
        },
        setAddEventWindowControl : function(){
            var module = this;
            var all = document.querySelectorAll('body, body *');
            try {
                ROOT.addEvent('mousedown.js2uix-calendar', function(){
                    module.setCommonEventHandler();
                });
                window.addEventListener("scroll", function(){
                    module.setCommonEventHandler();
                });
                window.addEventListener("resize", function(){
                    module.setCommonEventHandler();
                });
                for(var i=0; i<all.length; i++){
                    if( js2uixCheckScroll(all[i]) ){
                        all[i].addEventListener("scroll", function(){
                            module.setCommonEventHandler();
                        });
                    }
                }
            } finally {
                all = null;
            }
        },
        setAddEventCalendar : function(){
            var module = this;
            var num_inputVal = js2uix(".js2uix-select-input input");
            this.dom.js2uixCalendar.addEvent('mousedown.js2uix-calendar', function(e){
                e.stopPropagation();
            });
            js2uix(".js2uix-month-next").addEvent("click.js2uix-calendar", function(){
                module.setCommonControlHandler("nextMonth");
            });
            js2uix(".js2uix-year-next").addEvent("click.js2uix-calendar", function(){
                module.setCommonControlHandler("nextYear");
            });
            js2uix(".js2uix-month-prev").addEvent("click.js2uix-calendar", function(){
                module.setCommonControlHandler("prevMonth");
            });
            js2uix(".js2uix-year-prev").addEvent("click.js2uix-calendar", function(){
                module.setCommonControlHandler("prevYear");
            });
            js2uix(".js2uix-control-mid").addEvent("click", ".js2uix-date-wrap", function(){
                module.dom.monthBox[0].style.display = 'block';
            });
            this.dom.monthBox.find('.js2uix-select-prev').addEvent("click.js2uix-calendar", function(){
                num_inputVal[0].value = parseInt(num_inputVal[0].value)-1;
            });
            this.dom.monthBox.find('.js2uix-select-next').addEvent("click.js2uix-calendar", function(){
                num_inputVal[0].value = parseInt(num_inputVal[0].value)+1;
            });
            this.dom.monthBox.addEvent("click.js2uix-calendar", "td", function(){
                module.setCommonControlHandler("selectDate",  {
                    select_input  : parseInt( module.dom.monthBox.find("input")[0].value ),
                    select_number : parseInt( js2uix(this).getAttr("data-month") )
                });
                module.dom.monthBox[0].style.display = 'none'
            });
            this.dom.monthBox.find('input').addEvent("keyup.js2uix-calendar", function(){
                this.value = this.value.replace(/[^0-9]/g,'');
            });
        },
        init : function(){
            this.setCreateDefaultElement();
            this.setAddEventWindowControl();
            this.setAddEventCalendar();
        },
        onChangeDateParse : function(state){
            var year = state.selectYear;
            var month = state.selectMonth;
            var day = state.selectDay;
            var monthStr = '0'+month;
            var dayStr = '0'+day;
            monthStr = monthStr.substr(monthStr.length-2, 2);
            dayStr = dayStr.substr(dayStr.length-2, 2);
            return {
                date : year+'-'+monthStr+'-'+dayStr,
                year : year,
                month : month,
                day : day
            };
        },
        onChangeDate : function(){
            var newDate = this.onChangeDateParse(this.state);
            js2uix(this.state.target).setAttr({'data-year' : newDate.year, 'data-month' : newDate.month, 'data-day' : newDate.day}).value(newDate.date);
            if( this.state.onChangeDate && typeof this.state.onChangeDate === 'function' ){
                this.state.onChangeDate(newDate, this.state.target);
            }
        }
    };
    js2uix.extend(js2uixToolCalendar.prototype, js2uixCalendarCommon);
    js2uixToolCalendar.prototype.constructor = js2uixToolCalendar;

    var js2uixToolCalendarInput = function(element, props){
        this.element = element;
        this.props = {
            dateFormat : "yyyy-mm-dd",
            dateRange : null,
            language : "eng",
            onChangeDate : null,
            setDate : null,
            untilToday : false,
            zIndex : 99999
        };
        this.state = {
            year : null,
            month : null,
            day : null
        };
        this.init(props);
        return {
            name : this.js2uixName,
            setDate : this.setCalendarDate.bind(this)
        }
    };
    js2uixToolCalendarInput.prototype = {
        js2uixName : 'js2uix-calendar',
        setDefaultStateFormCalendar : function(){
            this.element.addClass("js2uix-calendar-input");
        },
        getChangeDateTypeUserDate : function(f_year, f_month, f_day){
            return this.props.dateFormat.replace(/(yyyy|yy|MM|dd)/gi, function(str) {
                switch(str){
                    case "yyyy" : return f_year; break;
                    case "yy"   : return f_year.toString().substring(2); break;
                    case "mm"   : if( f_month < 10 ){ f_month = "0"+f_month; } return f_month; break;
                    case "dd"   : if( f_day < 10 ){ f_day = "0"+f_day; } return f_day; break;
                    default     : return str; break;
                }
            });
        },
        setCalendarInputAttrDate : function(target, dataArray){
            target.setAttr({
                "data-year"  : dataArray.current_year,
                "data-month" : dataArray.current_month,
                "data-day"   : dataArray.current_day
            });
        },
        setCalendarInputStateDate : function(item){
            this.state.year = item.getAttr('data-year');
            this.state.month = item.getAttr('data-month');
            this.state.day = item.getAttr('data-day');
        },
        setInputNodeDefaultEvent : function(){
            var module = this;
            this.element.removeEvent("mouseup.js2uix-calendar-input");
            this.element.addEvent("mouseup.js2uix-calendar-input", function(e){
                var item = js2uix(this);
                if( !item.hasClass('js2uix-calendar-target') ){
                    module.setCalendarInputStateDate(item);
                    js2uix(".js2uix-calendar-target").removeClass("js2uix-calendar-target");
                    js2uix(this).addClass("js2uix-calendar-target");
                    js2uixCalendar.setCalendar(this, module.props, module.state);
                }
                e.stopPropagation();
            });
            this.element.addEvent("mousedown.js2uix-calendar-input", function(e){
                e.stopPropagation();
            });
        },
        setCalendarDefaultInputDate : function(userDate){
            var target = this.element;
            var date = (userDate)?new Date(userDate):new Date();
            var year = this.state.year = date.getFullYear();
            var month = this.state.month = date.getMonth()+1;
            var day = this.state.day = date.getDate();
            var dateArray = this.getDateCheckUserObject(year, month, day);
            var switchStartDate = this.getChangeDateTypeUserDate(year, month, day);
            try {
                this.setCalendarInputAttrDate(target, dateArray);
                target[0].value = switchStartDate;
            } finally {
                target = null;
                date = null;
                year = null;
                month = null;
                day = null;
                dateArray = null;
                switchStartDate = null;
            }
        },
        setCalendarLastDateCheck : function(type, number){
            var today = new Date();
            switch (type){
                case 'day'  : today.setDate(today.getDate() + number); break;
                case 'week' : today.setDate(today.getDate() + (number*7)); break;
                case 'month': today.setMonth(today.getMonth() + number); break;
                case 'year' : today.setMonth(today.getMonth() + (number*12)); break;
            }
            var year = today.getFullYear();
            var month = ('0'+(today.getMonth()+1));
            var date = ('0'+(today.getDate()));
            month = month.substr(month.length-2, 2);
            date = date.substr(date.length-2, 2);
            return {
                lastDateValue : today,
                lastDateString : year+'-'+month+'-'+date
            }
        },
        setCalendarDate : function(){
            var arg = arguments;
            var typeRange = ['day','week','month','year'];
            if( !arg[0] || (arg.length === 1 && arg[0] === 0) ){
                this.setCalendarDefaultInputDate();
            } else if( arg.length === 1 && (typeof arg[0] === 'string' && arg[0].indexOf('-') !== -1) ){
                this.setCalendarDefaultInputDate(arg[0]);
            } else if(  arg.length === 2 && ((typeof arg[0] === 'string' && typeRange.indexOf(arg[0]) !== -1 ) && (arg[1] && typeof arg[1] === 'number')) ){
                this.setCalendarDefaultInputDate(this.setCalendarLastDateCheck(arg[0], arg[1]).lastDateString);
            }
        },
        init : function(props){
            if( this.element[0].nodeName.toLowerCase() !== "input" ){ return; }
            if( props && typeof props === 'object' ){ js2uix.extend(this.props, props); }
            if( !js2uixCalendar) { js2uixCalendar = new js2uixToolCalendar(); }
            var propsDate = this.props.setDate;
            this.setDefaultStateFormCalendar();
            this.setInputNodeDefaultEvent();
            if( propsDate ){
                if( typeof propsDate === 'string' ){
                    this.setCalendarDate(propsDate);
                } else if ( Array.isArray(propsDate) && propsDate.length === 2 ){
                    this.setCalendarDate(propsDate[0], propsDate[1]);
                }
            } else {
                this.setCalendarDate();
            }
        }
    };
    js2uix.extend(js2uixToolCalendarInput.prototype, js2uixCalendarCommon);
    js2uixToolCalendarInput.prototype.constructor = js2uixToolCalendarInput;
    js2uix.extend({
        Calendar : function(target, props){
            var element = js2xixElementResult(target);
            if( element && element.length > 0 ){ return new js2uixToolCalendarInput(element, props); }
        },
        Chart : function(target, props){
            if( !window.d3 ){ alert('please check! d3.js api'); return; }
            var element = js2xixElementResult(target);
            if( element && element.length > 0 ){ return new js2uixToolChart(element, props); }
        },
        ComboBox : function(target, props){
            var element = js2xixElementResult(target);
            if( element && element.length > 0 ){ return new js2uixToolCombo(element, props); }
        },
        Draggable : function(target, props){
            var element = js2xixElementResult(target);
            if( element && element.length > 0 ){return new js2uixToolDrag(element, props);}
        },
        GridBox : function(target){
            var element = js2xixElementResult(target);
            if( element && element.length > 0 ){return new js2uixToolGrid(element);}
        },
        Resizable : function(target, props){
            var element = js2xixElementResult(target);
            if( element && element.length > 0 ){return new js2uixToolResize(element, props);}
        },
        Sortable : function(target, props){
            var element = js2xixElementResult(target);
            if( element && element.length > 0 ){return new js2uixToolSortable(element, props);}
        },
        Tree : function(target, props){
            var element = js2xixElementResult(target);
            if( element && element.length > 0 ){return new js2uixToolTree(element, props);}
        }
    });

    if ( typeof define === "function" && define.amd ) {define( ModuleName, [], function() {return js2uix;});}
    if ( !noGlobal ) { window.js2uix = js2uix; }
    return js2uix;
});