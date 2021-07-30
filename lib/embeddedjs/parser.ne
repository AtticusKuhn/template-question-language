@{%
const moo = require('moo');
 let myLexer = moo.compile({
   statement: {
       match: /\{[^\}]*\}/,
       value:s=>s.substring(1, s.length-1)
   },
    myText: {match: /.|\n+/, lineBreaks: true},

});

%}

@lexer myLexer

program -> thing:+ {%(d) =>  d[0] %}
thing -> text {%id%} 
    | statement {%id%}
    | NL



text -> %myText {%id%}#


statement  -> %statement {%d=>{
    console.log("evalling statement")
    try{
        return eval(d[0].value)
    }catch(e){
        return e.toString()
    }
}
%}
 NL -> ([\n]) {%id%}

