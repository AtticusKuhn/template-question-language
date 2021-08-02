// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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

var grammar = {
    Lexer: myLexer,
    ParserRules: [
    {"name": "program$ebnf$1", "symbols": ["thing"]},
    {"name": "program$ebnf$1", "symbols": ["program$ebnf$1", "thing"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "program", "symbols": ["program$ebnf$1"], "postprocess": (d) =>  d[0]},
    {"name": "thing", "symbols": ["text"], "postprocess": id},
    {"name": "thing", "symbols": ["math"], "postprocess": id},
    {"name": "thing", "symbols": ["statement"], "postprocess": id},
    {"name": "thing", "symbols": ["NL"]},
    {"name": "math", "symbols": [(myLexer.has("math") ? {type: "math"} : math)], "postprocess": d=>{
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
        } },
    {"name": "text", "symbols": [(myLexer.has("myText") ? {type: "myText"} : myText)], "postprocess": id},
    {"name": "statement", "symbols": [(myLexer.has("statement") ? {type: "statement"} : statement)], "postprocess": d=>{
            console.log("evalling statement", d[0].value)
            try{
                return eval(d[0].value)
            }catch(e){
                return e.toString()
            }
        }
        },
    {"name": "NL$subexpression$1", "symbols": [/[\n]/]},
    {"name": "NL", "symbols": ["NL$subexpression$1"], "postprocess": id}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
