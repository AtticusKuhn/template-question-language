@{%
const moo = require('moo');
const math = require("mathjs")
const parser = new math.parser()
 let myLexer = moo.compile({
    math: {
       match: /\{\#[^\}]*\#\}/,
       value:s=>s.substring(2, s.length-2)
   },
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
    |math {%id%}
    | statement {%id%}
    | NL



math -> %math {%d=>{
    console.log("evalling math", d[0].value)
    //console.log("math is", math)
    let resStr="";
      try {
        let res = parser.evaluate(d[0].value);
        resStr = math.format(res, { precision: 14 });
      }
      catch (err) {
        resStr = err.toString();
      }
    return resStr;
 } %}

text -> %myText {%id%}#



statement  -> %statement {%d=>{
    console.log("evalling statement", d[0].value)
    try{
        return eval(d[0].value)
    }catch(e){
        return e.toString()
    }
}
%}
 NL -> ([\n]) {%id%}

