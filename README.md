js2uix
===
js2uix 는 Dom Control 기능과 Component 제작 기능을 결합한 새로운 Javascript Module 이다.
기존의 Dom Control 기능을 Simple 하게 구현하였으며, 추가적으로 Component 제작이 가능하다.

## js2uix (js2uix-dom-control)
<pre>
 * Name        : js2uix
 * Version     : 1.0.0
 * Developer   : JH.Yu
 * Email       : deshineplus@icloud.com
 * Language    : Javascript(ES5)
 * Copyright   : 2018 JH.Yu (js2uix)
 * GitHub      : https://github.com/js2uix/js2uix
 * License     : https://github.com/js2uix/js2uix/blob/master/LICENSE
 
 * Create Dom Control Module (html 의 dom control, component, ui 제작 툴)
 1. js2uix()
 2. js2uix.Component()
 3. js2uix.UI
</pre>


## 1. 특징
### 1. js2uix('selector') : 기본 셀렉터
**js2uix(param) : 파라미터의 값은 'string', 'object', 'function'**
<pre>code ex :<code>
js2uix('div') : div 태그 전체를 select 한다.
js2uix('.class') : class 명을 가진 Node 를 select 한다.
js2uix('#id') : id 명을 가진 Npde 를 select 한다.
js2uix('&lt;div&gt;&lt;/div&gt;') : 새로운 div 태그를 생성한다.
js2uix(callback) : callback function 일 경우 html load 완료 후 callback 을 실행할 수 있다.
</code></pre>

### 2. js2uix('selector).method().method() : 메소드 체이닝
**js2uix selector 는 기본적으로 내장 기능을 메소드 체이닝을 통해 사용할 수 있다.**
<pre>code ex :<code>
js2uix('div').addClass('test1').removeClass('test1')
</code></pre>

### 3. js2uix.Component() : component 객체를 생성
**js2uix 모듈을 통해 독립된 Component 객체를 생성할 수 있다.**

**기능별 Component 객체를 생성/관리할 수 있으며 각각의 객체를 조합해 화면 렌더링을 할 수 있다.**
<pre>code ex :<code>
[Content.js]
    var Content = js2uix.Component({
        super : function(){
            this.state = {
                name : 'js2uix'
            }
        },
        onClick : function(){
            this.setState({
                name : 'js2uix-component'
            })
        },
        render : function(){
            var onClick = this.onClick.bind(this);
            var test = js2uix(
                '&lt;section class="content"&gt;' +
                '&lt;div class="text '+this.state.name+'"&gt;'+this.props.content+'!&lt;/div&gt;' +
                '&lt;/section&gt;'
            );
            test.addEvent('click', onClick);
            return (test);
        }
    });
    js2uix.Export('Content', Content);
</code></pre>
<pre>code ex :<code>
[index.js]
    var content = js2uix.Import('Content');
    js2uix.Render(test.props({'content' : 'js2uix'}), '#root');
</code></pre>


## 2. 기능 (Dom Control)

**addClass : 선택된 Dom 의 class name 설정.**
<pre>code ex :<code>
js2uix('div').addClass('test');
js2uix('div').addClass('test1 test2 test3');
</code></pre>

**addEvent : 선택된 Dom 에 event 설정**
<pre>code ex :<code>
js2uix('div#test').addEvent('click', function(){ ... });
js2uix('div#test').addEvent({
    'click' : function(){...},
    'mouseover' : function(){...}
});
</code></pre>

**addId : 선택된 Dom 의 id name 설정.**
<pre>code ex :<code>
js2uix('div').addId('test');
</code></pre>

**after : 선택된 Dom 다음에 Dom 삽입.**
<pre>사용 예:<code>
js2uix('div').after(js2uix('.test1'));
js2uix('div').after('&lt;div&gt;test&lt;/div&gt;');
js2uix('div').after('test');
</code></pre>

**append : 선택된 Dom 안의 마지막에 Dom 삽입.**
<pre>code ex :<code>
js2uix('div').append(js2uix('.test1'));
js2uix('div').append('&lt;div&gt;test&lt;/div&gt;');
</code></pre>

**before : 선택된 Dom 이전에 Dom 삽입.**
<pre>code ex :<code>
js2uix('div').before(js2uix('.test1'));
js2uix('div').before('&lt;div&gt;test&lt;/div&gt;');
js2uix('div').before('test');
</code></pre>

**children : 선택된 Dom 안의 자식 Dom 확인.**
<pre>code ex :<code>
js2uix('div').children();
js2uix('div').children('.child');
</code></pre>

**createDom : 새로운 Dom 생성.**
<pre>code ex :<code>
var newNode = js2uix.createDom('div', {
    className : 'test',
    idName : 'ids',
    attributes : {
        'data-id' : 'test11',
        'data-name' : 'testName'
    },
    styles : {
        'width' : 100,
        'height' : 200,
        'backgroundColor' : 'red'
    },
    content : 'hello world'
});
console.log( newNode ); //div node
</code></pre>

**css : 선택된 Dom 의 style 설정**
<pre>code ex :<code>
js2uix('div').css('color', 'red');
js2uix('div').css({
    'color' : 'red',
    'z-index' : 1
});
</code></pre>

**extend : object 를 병합/상속**
<pre>code ex :<code>
var object1 = {test1:1, test2:2}
var object2 = {test1:1, test2:2}
js2uix.extend({}, object1);
js2uix.extend(object1, object2);
</code></pre>

**find : 선택된 Dom 안에서 특정 Dom 찾기**
<pre>code ex :<code>
js2uix('div').find('.test1');
js2uix('div.name').find('div');
</code></pre>

**firstNode : 선택된 Dom 에서 첫번째 Dom 선택**
<pre>code ex :<code>
var first = js2uix('div').firstNode();
</code></pre>

**getAttr : 선택된 Dom 의 attribute 확인**
<pre>code ex :<code>
js2uix('div').getAttr('data-name');
js2uix('div').getAttr();
</code></pre>

**hasChild : 선택된 Dom 이 특정 자식을 가지고 있는지 확인**
<pre>code ex :<code>
js2uix('div').hasChild( '.test1' );
</code></pre>

**hasClass : 선택된 Dom 이 특정 class 이름을 가지고 있는지 확인**
<pre>code ex :<code>
js2uix('div').hasClass( 'test1' );
</code></pre>

**hasId : 선택된 Dom 이 특정 id 이름을 가지고 있는지 확인**
<pre>code ex :<code>
js2uix('div').hasId( 'test1' );
</code></pre>

**hasParents : 선택된 Dom 의 부모중에 특정 이름을 가진 부모 확인**
<pre>code ex :<code>
js2uix('div').hasParents( '.parent' );
</code></pre>

**height : 선택된 Dom 의 height 값 설정 및 확인**
<pre>code ex :<code>
js2uix('div').height( 200 );
var height = js2uix('div').height();
console.log(height) //200
</code></pre>

**lastINode : 선택된 Dom 중에 마지막 Dom 선택**
<pre>code ex :<code>
var last = js2uix('div').lastINode();
</code></pre>

**left : 선택된 Dom 의 left 값 설정 및 확인**
<pre>code ex :<code>
js2uix('div').left( 200 );
var height = js2uix('div').left();
console.log(left) //200
</code></pre>

**loaded : html 이 전부 load 된 이후 실행**
<pre>code ex :<code>
js2uix.loaded(function(){
    console.log('load complete');
});
js2uix(function(){
    console.log('load complete');
});
</code></pre>

**loop : 선택된 Dom 또는 특정 Object 의 반복문 적용**
<pre>code ex :<code>
js2uix('div').loop(function(num, node){
    console.log(num, node);
});

var doms = js2uix('div');
js2uix.loop(doms, function(num, node){
    console.log(num, node);
});

var array = [1,2,3,4];
js2uix.loop(array, function(num, value){
    console.log(num, value);
})
</code></pre>

**nextNode : 선택된 Dom 의 다음 선택**
<pre>code ex :<code>
var next = js2uix('div.test').nextNode();
console.log(next);
</code></pre>

**offset : 선택된 Dom 의 offset 확인**
<pre>code ex :<code>
var offset = js2uix('div.test').offset();
console.log(offset);
</code></pre>

**parent : 선택된 Dom 의 바로 위 parent 확인**
<pre>code ex :<code>
var parent1 = js2uix('div.test').parent();
var parent2 = js2uix('div.test').parent('.parent');
console.log(parent1);
console.log(parent2);
</code></pre>

**parents : 선택된 Dom 부모중 특정 parent 확인**
<pre>code ex :<code>
var parent = js2uix('div.test').parents('.parent');
console.log(parent);
</code></pre>

**prepend : 선택된 Dom 안의 처음에 Dom 삽입**
<pre>code ex :<code>
js2uix('div.target').prepend(js2uix('div.test'));
js2uix('div.target').prepend('&lt;div&gt;test&lt;/div&gt;');
</code></pre>

**prevNode : 선택된 Dom 의 이전 선택**
<pre>code ex :<code>
var prev = js2uix('div.test').prevNode();
console.log(prev);
</code></pre>

**remove : 선택된 Dom 을 삭제**
<pre>code ex :<code>
js2uix('div.test').remove();
</code></pre>

**removeAttr : 선택된 Dom 의 특정 attribute 값 삭제**
<pre>code ex :<code>
js2uix('div.test').removeAttr('data-id');
</code></pre>

**removeClass : 선택된 Dom 의 특정 class 값 삭제**
<pre>code ex :<code>
js2uix('div.test').removeClass('test');
</code></pre>

**removeEvent : 선택된 Dom 의 event 제거**
<pre>code ex :<code>
var addEventHandler = function(){...};
js2uix('div#test').removeEvent();
js2uix('div#test').removeEvent('click');
js2uix('div#test').removeEvent('click.eventName');
js2uix('div#test').removeEvent('click', addEventHandler);
</code></pre>

**removeId : 선택된 Dom 의 특정 id 값 삭제**
<pre>code ex :<code>
js2uix('div#test').removeId('test');
</code></pre>

**replace : 선택된 Dom 을 특정 Dom 또는 생성된 Dom 으로 교체**
<pre>code ex :<code>
js2uix('div#test').replace(js2uix('div.new'));
</code></pre>

**setAttr : 선택된 Dom 의 attribute 설정.**
<pre>code ex :<code>
js2uix(select).addAttr('data-name', test);
js2uix(select).addAttr({
    'data-name' : test,
    'data-value' : 100
});
</code></pre>

**text : 선택된 Dom 의 text 설정 및 확인**
<pre>code ex :<code>
js2uix('div#test').text('test');
var textValue = js2uix('div#test').text();
console.log(textValue) 
</code></pre>

**top : 선택된 Dom 의 top 설정 및 확인**
<pre>code ex :<code>
var top = js2uix('div#test').top();
console.log(top);
js2uix('div#test').top(200);
</code></pre>

**width : 선택된 Dom 의 width 설정 및 확인**
<pre>code ex :<code>
var width = js2uix('div#test').width();
console.log(width);
js2uix('div#test').width(200);
</code></pre>


