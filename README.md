ZUI
===
ZUI-Control (js2uix-zui)
- ModuleName  : ZUI-Control(js2uix-zui)
- Developer   : YJH-js2uix
- DevLanguage : Javascript(ES5)
- BuildStart  : 2018.01.01
- Create Dom Control Module (html 의 dom 을 컨트롤 할 수 있는 모듈을 제작) 단계적으로 아래와 같은 기능을 개발한다.
 1. ES5 를 이용한 Dom Select 및 Control 기능 구현.
 2. 간단한 Dom Select/Control 을 통해 기능 확장.
 3. 기본 기능 완료 후 javascript component 기능 추가.


## 1. 기본사용
### 1. zui('selector') : 기본 셀렉터
- zui(param) : 파라미터의 값은 'string', 'object', 'function'
<pre><code>
- ex) zui('div') : div 태그 전체를 select 한다.
- ex) zui('.class') : class 명을 가진 Node 를 select 한다.
- ex) zui('#id') : id 명을 가진 Npde 를 select 한다.
- ex) zui('&lt;div&gt;&lt;/div&gt;') : 새로운 div 태그를 생성한다.
- ex) zui(callback) : callback function 일 경우 html load 완료 후 callback 을 실행할 수 있다.
</code></pre>
### 2. zui('selector).method().method() : 메소드 체이닝
- zui selector 는 기본적으로 내장 기능을 메소드 체이닝을 통해 사용할 수 있다.
<pre><code>
- ex) zui('div').addClass('test1').removeClass('test1')
</code></pre>

## 2. 기능

1. addAttr : 선택된 Dom 의 attribute 설정.
<pre><code>
zui(select).addAttr( 'data-name', test );
zui(select).addAttr({
    'data-name' : test,
    'data-value' : 100
});
</code></pre>

2. addAttr : 선택된 Dom 의 class name 설정.
<pre><code>
zui('div').addClass( 'test' );
zui('div').addClass( 'test1 test2 test3' );
</code></pre>

3. addId : 선택된 Dom 의 id name 설정.
<pre><code>
zui('div').addId( 'test' );
</code></pre>

4. after : 선택된 Dom 다음에 Dom 삽입.
<pre><code>
zui('div').after( zui('.test1') );
zui('div').after( '&lt;div&gt;test&lt;/div&gt;' );
zui('div').after( 'test' );
</code></pre>

5. append : 선택된 Dom 안의 마지막에 Dom 삽입.
<pre><code>
zui('div').append( zui('.test1') );
zui('div').append( '&lt;div&gt;test&lt;/div&gt;' );
</code></pre>

6. before : 선택된 Dom 이전에 Dom 삽입.
<pre><code>
zui('div').before( zui('.test1') );
zui('div').before( '&lt;div&gt;test&lt;/div&gt;' );
zui('div').before( 'test' );
</code></pre>

7. append : 선택된 Dom 안의 자식 Dom 확인.
<pre><code>
zui('div').children( );
zui('div').children( '.child' );
</code></pre>

8. css : 선택된 Dom 의 style 설정
<pre><code>
zui('div').css( 'color', 'red' );
zui('div').css({
    'color' : 'red',
    'z-index' : 1
});
</code></pre>