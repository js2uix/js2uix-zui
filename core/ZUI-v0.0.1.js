/** ------------------------------------------------------------------------------------- /
 * ModuleName  : ZUI-Control(js2uix-zui)
 * Developer   : YJH-js2uix(clayrj2004@daum.net)
 * DevLanguage : Javascript(ES5)
 * BuildStart  : 2018.01.01
 * Information : Create Dom Control Module (html 의 dom 을 컨트롤 할 수 있는 모듈을 제작)
 *               단계적으로 아래와 같은 기능을 개발한다.
 *               1. ES5 를 이용한 Dom Select 및 Control 기능 구현.
 *               2. 간단한 Dom Select/Control 을 통해 기능 확장.
 *               3. 기본 기능 완료 후 javascript component 기능 추가.
 * -------------------------------------------------------------------------------------- */

(function(window, module){
    'use strict';
    var zui,
        ModuleName = 'js2uix',
        ModuleVersion = 'v0.0.1';
    var DOC = window.document,
        SetProtoType = Object.setPrototypeOf,
        GetProtoType = Object.getPrototypeOf;
    if ( window.zui ){ window.zui = null; }
    /** --------------------------------------------------------------- */
    /** zui-control create object ( zui control 을 정의한다 )
     * TODO : 가장 기본적인 기능을 먼저 활성화 하며, 추후 ui 기능을 확장한다.
     * info : NodeList 객체를 새롭게 해석하여 module 화 한다.
     *       새로운 Node 객체를 만들고 기능을 확장/상속 시킨다.
     * */
    /** --------------------------------------------------------------- */
    zui = function (select){
        return new zui.fx.init(select);
    };
    zui.fx = zui.prototype = {
        zui : ModuleVersion,
        constructor : zui,
        loop : function ( callback ){
            return zui.loop( this, callback );
        },
        /** TODO : extend prototype, 상속을 구현한다.
         * Object.setPrototypeOf 기본 사용 / 불가능 : __proto__ 를 이용하여 상속.
         * */
        query : function ( select, result ){
            var argArray = Array.prototype.slice.call(arguments);
            var i = 0;
            var newNode = zui.extend([], argArray.shift());
            newNode.name = ModuleName;
            if ( SetProtoType ){
                newNode = SetProtoType( newNode, GetProtoType( result ) );
            } else {
                newNode.__proto__ = GetProtoType( result );
            }
            for (; i < newNode.length; i++ ){
                if ( !newNode[i][ModuleName] ){
                    newNode[i][ModuleName] = { events : {}, data : {} };
                }
            }
            return newNode;
        },
        loaded : function ( callback ) {
            if ( callback && typeof callback === 'function' ){
                zui.loaded( this, callback );
            }
        }
    };
    zui.fx.init = function (select){
        if ( !select ) { return this; }
        /** TODO : Dom Query
         * ES5 를 이용한 Dom Query Select 를 구현한다.
         * 예외처리를 통해 Error 상황에 대응한다.
         * */
        if ( typeof select === 'string' ){
            var tagName;
            var isEmptyString = select.replace(/\s/gi, "");
            var isIdOrClassType = isEmptyString.match(/^#|^\./gi);
            var isTagStringType = select.match(/(<([^>]+)>)/gi);
            var isSpStringType = select.match(/[`~!@#$%^&*|\\\'\";:\/?]/gi);
            /** step.1 : type check */
            if ( isEmptyString && isEmptyString.length > 0 ){
                if ( isIdOrClassType && isIdOrClassType.length > 0 ){
                    /** TODO : id or class 타입의 string - 보완 필요 */
                    select = DOC.querySelectorAll( select );
                } else {
                    if ( isTagStringType && isTagStringType.length > 0 ){
                        tagName = isTagStringType[0].replace(/^<(.+?)>/g, function(match, key) { return key; });
                        if( isTagStringType.length === 1 ){
                            select = [DOC.createElement( tagName )];
                        } else {
                            var virtualDom = DOC.createElement( ModuleName );
                            virtualDom.innerHTML = select;
                            select = [virtualDom.firstChild];
                        }
                    } else {
                        /** TODO : 특수한 경우 예외처리. */
                        select = ( !isSpStringType )?DOC.querySelectorAll( select ):[];
                    }
                }
            }
        } else {
            if ( select.nodeType ){
                select = [select];
            } else if ( select['name'] && select['name'] === ModuleName ){
                return select;
            } else if ( typeof select === 'function' ){
                return zui.loaded( select, this );
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
        },
    });
    window.zui = zui;
}(window, function(){
    /** TODO : 개발 완료후 모듈화 진행을 위해 비움 */
}));