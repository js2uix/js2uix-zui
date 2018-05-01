



var dom = zui('.tttt').addClass('use').css({
    position : 'absolute',
    top: 20,
    left: 20,
    backgroundColor : 'red',
    width : 200,
    height : 200
});




setTimeout(function(){
    dom.left(50)
},3000)