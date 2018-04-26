# ZUI
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
### 1. zui('selector');
- zui(param) : 파라미터의 값은 'string', 'object', 'function'
- ex) zui('div') : div 태그 전체를 select 한다.
- ex) zui('.class') : class 명을 가진 Node 를 select 한다.
- ex) zui('#id') : id 명을 가진 Npde 를 select 한다.
- ex) zui('<div></div>') : 새로운 div 태그를 생성한다.
- ex) zui(callback) : callback function 일 경우 html load 완료 후 callback 을 실행할 수 있다.
