// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo');
 let myLexer = moo.compile({
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
    {"name": "thing", "symbols": ["statement"], "postprocess": id},
    {"name": "thing", "symbols": ["NL"]},
    {"name": "text", "symbols": [(myLexer.has("myText") ? {type: "myText"} : myText)], "postprocess": id},
    {"name": "statement", "symbols": [(myLexer.has("statement") ? {type: "statement"} : statement)], "postprocess": d=>{
            console.log("evalling statement")
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
