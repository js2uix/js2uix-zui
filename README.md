js2uix - zui
===
**zui-dom-control (js2uix-zui)**
<pre>
- ModuleName  : ZUI-Control(js2uix-zui)
- Developer   : YJH-js2uix
- DevLanguage : Javascript(ES5)
- BuildStart  : 2018.01.01
- Create Dom Control Module (html 의 dom 을 컨트롤 할 수 있는 모듈을 제작) 단계적으로 아래와 같은 기능을 개발한다.
 1. ES5 를 이용한 Dom Select 및 Control 기능 구현.
 2. 간단한 Dom Select/Control 을 통해 기능 확장.
 3. 기본 기능 완료 후 javascript component 기능 추가.
</pre>


## 1. 기본사용
### 1. zui('selector') : 기본 셀렉터
zui(param) : 파라미터의 값은 'string', 'object', 'function'
<pre>code ex :<code>
zui('div') : div 태그 전체를 select 한다.
zui('.class') : class 명을 가진 Node 를 select 한다.
zui('#id') : id 명을 가진 Npde 를 select 한다.
zui('&lt;div&gt;&lt;/div&gt;') : 새로운 div 태그를 생성한다.
zui(callback) : callback function 일 경우 html load 완료 후 callback 을 실행할 수 있다.
</code></pre>
### 2. zui('selector).method().method() : 메소드 체이닝
zui selector 는 기본적으로 내장 기능을 메소드 체이닝을 통해 사용할 수 있다.
<pre>code ex :<code>
zui('div').addClass('test1').removeClass('test1')
</code></pre>

## 2. 기능

**1. addAttr : 선택된 Dom 의 attribute 설정.**
<pre>code ex :<code>
zui(select).addAttr('data-name', test);
zui(select).addAttr({
    'data-name' : test,
    'data-value' : 100
});
</code></pre>

**2. addAttr : 선택된 Dom 의 class name 설정.**
<pre>code ex :<code>
zui('div').addClass('test');
zui('div').addClass('test1 test2 test3');
</code></pre>

**3. addId : 선택된 Dom 의 id name 설정.**
<pre>code ex :<code>
zui('div').addId('test');
</code></pre>

**4. after : 선택된 Dom 다음에 Dom 삽입.**
<pre>사용 예:<code>
zui('div').after(zui('.test1'));
zui('div').after('&lt;div&gt;test&lt;/div&gt;');
zui('div').after('test');
</code></pre>

**5. append : 선택된 Dom 안의 마지막에 Dom 삽입.**
<pre>code ex :<code>
zui('div').append(zui('.test1'));
zui('div').append('&lt;div&gt;test&lt;/div&gt;');
</code></pre>

**6. before : 선택된 Dom 이전에 Dom 삽입.**
<pre>code ex :<code>
zui('div').before(zui('.test1'));
zui('div').before('&lt;div&gt;test&lt;/div&gt;');
zui('div').before('test');
</code></pre>

**7. append : 선택된 Dom 안의 자식 Dom 확인.**
<pre>code ex :<code>
zui('div').children();
zui('div').children('.child');
</code></pre>

**8. css : 선택된 Dom 의 style 설정**
<pre>code ex :<code>
zui('div').css('color', 'red');
zui('div').css({
    'color' : 'red',
    'z-index' : 1
});
</code></pre>

**9. extend : object 를 병합/상속**
<pre>code ex :<code>
var object1 = {test1:1, test2:2}
var object2 = {test1:1, test2:2}
zui.extend({}, object1);
zui.extend(object1, object2);
</code></pre>

**10. find : 선택된 Dom 안에서 특정 Dom 찾기**
<pre>code ex :<code>
zui('div').find('.test1');
zui('div.name').find('div');
</code></pre>

**11. firstNode : 선택된 Dom 에서 첫번째 Dom 선택**
<pre>code ex :<code>
var first = zui('div').firstNode();
</code></pre>

**12. getAttr : 선택된 Dom 의 attribute 확인**
<pre>code ex :<code>
zui('div').getAttr('data-name');
zui('div').getAttr();
</code></pre>

**13. hasChild : 선택된 Dom 이 특정 자식을 가지고 있는지 확인**
<pre>code ex :<code>
zui('div').hasChild( '.test1' );
</code></pre>

**14. hasClass : 선택된 Dom 이 특정 class 이름을 가지고 있는지 확인**
<pre>code ex :<code>
zui('div').hasClass( 'test1' );
</code></pre>

**15. hasId : 선택된 Dom 이 특정 id 이름을 가지고 있는지 확인**
<pre>code ex :<code>
zui('div').hasId( 'test1' );
</code></pre>

**16. hasParents : 선택된 Dom 의 부모중에 특정 이름을 가진 부모 확인**
<pre>code ex :<code>
zui('div').hasParents( '.parent' );
</code></pre>

**17. height : 선택된 Dom 의 height 값 설정 및 확인**
<pre>code ex :<code>
zui('div').height( 200 );
var height = zui('div').height();
console.log(height) //200
</code></pre>

**18. lastINode : 선택된 Dom 중에 마지막 Dom 선택**
<pre>code ex :<code>
var last = zui('div').lastINode();
</code></pre>

**19. left : 선택된 Dom 의 left 값 설정 및 확인**
<pre>code ex :<code>
zui('div').left( 200 );
var height = zui('div').left();
console.log(left) //200
</code></pre>

**20. loaded : html 이 전부 load 된 이후 실행**
<pre>code ex :<code>
zui.loaded(function(){
    console.log('load complete');
});
zui(function(){
    console.log('load complete');
});
</code></pre>

**21. loop : 선택된 Dom 또는 특정 Object 의 반복문 적용**
<pre>code ex :<code>
zui('div').loop(function(num, node){
    console.log(num, node);
});

var doms = zui('div');
zui.loop(doms, function(num, node){
    console.log(num, node);
});

var array = [1,2,3,4];
zui.loop(array, function(num, value){
    console.log(num, value);
})
</code></pre>

**22. nextNode : 선택된 Dom 의 다음 선택**
<pre>code ex :<code>
var next = zui('div.test').nextNode();
console.log(next);
</code></pre>

**23. offset : 선택된 Dom 의 offset 확인**
<pre>code ex :<code>
var offset = zui('div.test').offset();
console.log(offset);
</code></pre>

**24. parent : 선택된 Dom 의 바로 위 parent 확인**
<pre>code ex :<code>
var parent1 = zui('div.test').parent();
var parent2 = zui('div.test').parent('.parent');
console.log(parent1);
console.log(parent2);
</code></pre>

**25. parents : 선택된 Dom 부모중 특정 parent 확인**
<pre>code ex :<code>
var parent = zui('div.test').parents('.parent');
console.log(parent);
</code></pre>

**26. prepend : 선택된 Dom 안의 처음에 Dom 삽입**
<pre>code ex :<code>
zui('div.target').prepend(zui('div.test'));
zui('div.target').prepend('&lt;div&gt;test&lt;/div&gt;');
</code></pre>

**27. prevNode : 선택된 Dom 의 이전 선택**
<pre>code ex :<code>
var prev = zui('div.test').prevNode();
console.log(prev);
</code></pre>

**28. remove : 선택된 Dom 을 삭제**
<pre>code ex :<code>
zui('div.test').remove();
</code></pre>

**29. removeAttr : 선택된 Dom 의 특정 attribute 값 삭제**
<pre>code ex :<code>
zui('div.test').removeAttr('data-id');
</code></pre>

**30. removeClass : 선택된 Dom 의 특정 class 값 삭제**
<pre>code ex :<code>
zui('div.test').removeClass('test');
</code></pre>

**31. removeId : 선택된 Dom 의 특정 id 값 삭제**
<pre>code ex :<code>
zui('div#test').removeId('test');
</code></pre>

**32. replace : 선택된 Dom 을 특정 Dom 또는 생성된 Dom 으로 교체**
<pre>code ex :<code>
zui('div#test').replace(zui('div.new'));
</code></pre>

**33. top : 선택된 Dom 의 top 설정 및 확인**
<pre>code ex :<code>
var top = zui('div#test').top();
console.log(top);
zui('div#test').top(200);
</code></pre>

**34. width : 선택된 Dom 의 width 설정 및 확인**
<pre>code ex :<code>
var width = zui('div#test').width();
console.log(width);
zui('div#test').width(200);
</code></pre>
