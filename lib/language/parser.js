// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

// const myLexer = require("./lexer");
const moo = require('moo');

 let myLexer = moo.compile({

     myText: /[^}\n](?![^{]*})/,
    WS: /[ \t]+/,
    comment: /\/\/.*?$/,
    // number: /0|[1-9][0-9]*/,
    number: /[0-9]+/,
    string: /"(?:\\["\\]|[^\n"\\])*"/,
    lparen: '(',
    rparen: ')',
    lbrace: '{',
    rbrace: '}',
    identifier: /[a-zA-Z][a-zA-Z_0-9]*/,
    fatarrow: '=>',
    assign: '=',
    myVariable: /[a-zA-Z][^=]/,
    NL: { match: /\n/, lineBreaks: true },
});

const evalWithContext = (jsString, context)=> {
    const code = `
    let globals = g
    let res= eval('${jsString}')
    return [ res, globals]
    `
    // console.log("evalling code:")
    // console.log(code)
    const [result, newContext] = new Function("g", code)(context);
    return { result, newContext }
};
let context = {};

var grammar = {
    Lexer: myLexer,
    ParserRules: [
    {"name": "program$ebnf$1", "symbols": ["thing"]},
    {"name": "program$ebnf$1", "symbols": ["program$ebnf$1", "thing"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "program", "symbols": ["program$ebnf$1"], "postprocess": (d) =>  d[0]},
    {"name": "thing", "symbols": ["text"], "postprocess": id},
    {"name": "thing", "symbols": [{"literal":"{"}, "statement", {"literal":"}"}], "postprocess": (data)=> data[1]},
    {"name": "thing", "symbols": ["NL"]},
    {"name": "text", "symbols": [(myLexer.has("myText") ? {type: "myText"} : myText)], "postprocess": id},
    {"name": "float", "symbols": ["int", {"literal":"."}, "int"], "postprocess": function(d) {return parseFloat(d[0] + d[1] + d[2])}},
    {"name": "float", "symbols": ["int"], "postprocess": function(d) {return parseInt(d[0])}},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": function(d) {return d[0].join(""); }},
    {"name": "statement", "symbols": ["var_assign"], "postprocess": id},
    {"name": "statement", "symbols": ["expr"], "postprocess": id},
    {"name": "identifier", "symbols": [(myLexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d)=>console.log("identifier called") || d.join("")},
    {"name": "variable", "symbols": [(myLexer.has("myVariable") ? {type: "myVariable"} : myVariable)], "postprocess": (d)=>{
            console.log("variable called")
            try{
            const res= evalWithContext(`globals.${d.join("")}`, context)
            return res.result
            }catch{
                return d.join("")
            }
        }
            },
    {"name": "var_assign", "symbols": ["identifier", {"literal":"="}, "expr"], "postprocess": 
        (data) => {
            // console.log("data", data)
            const res= evalWithContext(`globals.${data[0]} = ${data[2]}`, context)
            context = res.newContext
            return  {
                type:"var_assign",
                value:`globals.${data[0]} = ${data[2]}`,
            }
        }
                },
    {"name": "expr", "symbols": ["value"], "postprocess": id},
    {"name": "expr", "symbols": ["identifier"], "postprocess": id},
    {"name": "value", "symbols": ["number"], "postprocess": id},
    {"name": "value", "symbols": ["string"], "postprocess": id},
    {"name": "value", "symbols": ["varaible"], "postprocess": id},
    {"name": "string", "symbols": [(myLexer.has("string") ? {type: "string"} : string)], "postprocess": d=>d.join("")},
    {"name": "number", "symbols": ["float"], "postprocess": id},
    {"name": "number", "symbols": [{"literal":"plus"}, "_", "float", "float"], "postprocess": (d)=> d[2] + d[3]},
    {"name": "number", "symbols": [{"literal":"minus"}, "_", "float", "float"], "postprocess": (d)=> d[2] - d[3]},
    {"name": "number", "symbols": [{"literal":"increment"}, "_", "number"], "postprocess": (d)=> d[2]+1},
    {"name": "number", "symbols": ["variable"], "postprocess": d=>{
            /* console.log("varaible number checking is", d)
            # if(isNaN(d[0]) && d[0] !== undefined){
            #     throw new Error("variable is not a number")
            # }*/
            return d[0]
        }},
    {"name": "NL$subexpression$1", "symbols": [/[\n]/]},
    {"name": "NL", "symbols": ["NL$subexpression$1"], "postprocess": id},
    {"name": "__lb_$ebnf$1$subexpression$1", "symbols": ["_", "NL"]},
    {"name": "__lb_$ebnf$1", "symbols": ["__lb_$ebnf$1$subexpression$1"]},
    {"name": "__lb_$ebnf$1$subexpression$2", "symbols": ["_", "NL"]},
    {"name": "__lb_$ebnf$1", "symbols": ["__lb_$ebnf$1", "__lb_$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__lb_", "symbols": ["__lb_$ebnf$1", "_"], "postprocess": id},
    {"name": "_ml$ebnf$1$subexpression$1", "symbols": [(myLexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "_ml$ebnf$1$subexpression$1", "symbols": [(myLexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "_ml$ebnf$1", "symbols": ["_ml$ebnf$1$subexpression$1"]},
    {"name": "_ml$ebnf$1$subexpression$2", "symbols": [(myLexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "_ml$ebnf$1$subexpression$2", "symbols": [(myLexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "_ml$ebnf$1", "symbols": ["_ml$ebnf$1", "_ml$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_ml", "symbols": ["_ml$ebnf$1"]},
    {"name": "__ml$ebnf$1$subexpression$1", "symbols": [(myLexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "__ml$ebnf$1$subexpression$1", "symbols": [(myLexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "__ml$ebnf$1", "symbols": ["__ml$ebnf$1$subexpression$1"]},
    {"name": "__ml$ebnf$1$subexpression$2", "symbols": [(myLexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "__ml$ebnf$1$subexpression$2", "symbols": [(myLexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "__ml$ebnf$1", "symbols": ["__ml$ebnf$1", "__ml$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__ml", "symbols": ["__ml$ebnf$1"]},
    {"name": "_$ebnf$1", "symbols": [(myLexer.has("WS") ? {type: "WS"} : WS)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "__$ebnf$1", "symbols": [(myLexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (myLexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
