// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

// const myLexer = require("./lexer");
const moo = require('moo');
// const runParser = require("./fakeRunParser.js")
const {lexer} = require("./lexer")
const math = require("mathjs")
const parser = new math.parser()
/*

let context = {
    increment: (x)=> x+1,
    concatenate: (a,b)=>a+b,
    plus: (a,b)=>a+b,
    randomInteger: (l, h)=> Math.floor(Math.random()*(l-h)) + l
};*/

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "program$ebnf$1", "symbols": ["thing"]},
    {"name": "program$ebnf$1", "symbols": ["program$ebnf$1", "thing"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "program", "symbols": ["program$ebnf$1"], "postprocess": (d) =>  d[0]},
    {"name": "program", "symbols": [], "postprocess": id},
    {"name": "thing", "symbols": ["comment"]},
    {"name": "thing", "symbols": ["textFormat"]},
    {"name": "thing", "symbols": ["text"], "postprocess": id},
    {"name": "thing", "symbols": [{"literal":"{"}, "statement", {"literal":"}"}], "postprocess": (data)=> data[1]},
    {"name": "thing", "symbols": ["math"]},
    {"name": "thing", "symbols": ["NL"]},
    {"name": "comment", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": (d)=> ""},
    {"name": "textFormat", "symbols": [(lexer.has("textFormat") ? {type: "textFormat"} : textFormat)], "postprocess": d=>"I am textformat"},
    {"name": "math", "symbols": [(lexer.has("math") ? {type: "math"} : math)], "postprocess": d=>{
           console.log("evalling math", d[0].value)
           //console.log("math is", math)
           let resStr="";
             try {
               let res = parser.evaluate(d[0].value);
               grammar.setContext(Object.fromEntries(parser.scope))
               resStr = math.format(res, { precision: 14 });
             }
             catch (err) {
               resStr = err.toString();
             }
           return resStr;
        } },
    {"name": "text", "symbols": [(lexer.has("myText") ? {type: "myText"} : myText)], "postprocess": id},
    {"name": "statement", "symbols": ["var_assign"], "postprocess": id},
    {"name": "statement", "symbols": ["expr"], "postprocess": id},
    {"name": "expr", "symbols": ["value"], "postprocess": id},
    {"name": "function", "symbols": [(lexer.has("myFunction") ? {type: "myFunction"} : myFunction)], "postprocess": 
            (data) => {
                console.log("function recieved", data)
        //return "hello"
                    return {
                    type: "function",
                    parameters: data[0].value.params,
                    body:data[0].value.body,
                    toString: ()=>data[0].value.body,
                }
            }
        },
    {"name": "fun_call", "symbols": [(lexer.has("functionCall") ? {type: "functionCall"} : functionCall)], "postprocess": 
        (data) => {
            console.log("function call called with", data)
            const {functionName, functionParams} = data[0].value
            if(!grammar.lookup(functionName)){
                throw new Error(`cannot find the function named "${functionName}"`)
            }
            //console.log("runParser : ", runParser)
          // console.log("runParser.runStatmentWithContext ; ", runParser.runStatmentWithContext )
            let zippedParams = {}
            for(let i=0; i< grammar.lookup(functionName).parameters.length; i++){
                zippedParams[grammar.lookup(functionName).parameters[i]] = functionParams[i]
            }
            return {
                type:"function_call",
                params: zippedParams,
                toString: ()=>`function call converted to stirng`,
                functionName,
                body: grammar.lookup(functionName).body,
            }
            // return runParser.runStatmentWithContext(context[functionName].body, Object.assign(context,zippedParams))
            // return "funcall"
        }
                },
    {"name": "value", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "value", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": d=> d[1]},
    {"name": "value", "symbols": ["fun_call"], "postprocess": id},
    {"name": "value", "symbols": ["number"], "postprocess": id},
    {"name": "value", "symbols": ["variable"], "postprocess": id},
    {"name": "value", "symbols": ["string"], "postprocess": id},
    {"name": "value", "symbols": ["boolean"], "postprocess": id},
    {"name": "value", "symbols": ["conditional"], "postprocess": id},
    {"name": "value", "symbols": ["loop"], "postprocess": id},
    {"name": "value", "symbols": ["function"], "postprocess": id},
    {"name": "loop", "symbols": ["for_loop"], "postprocess": id},
    {"name": "loop", "symbols": ["iterate_loop"], "postprocess": id},
    {"name": "iterate_loop$subexpression$1", "symbols": ["value"]},
    {"name": "iterate_loop$subexpression$1", "symbols": ["function"]},
    {"name": "iterate_loop", "symbols": [{"literal":"iterate"}, "_", "number", "_", "iterate_loop$subexpression$1"], "postprocess": d=>{
            let iterations = d[2]
            let val = d[4][0]
            console.log("val is", val)
        
            if(val.type && val.type === "function"){
                console.log("is function")
               return [...Array(iterations).keys()].map(iteration=>{
                const {parameters, body} = val
                  return {
                    type:"function_call",
                    toString: ()=>`function call converted to string (from iterate)`,
                    params: {
                        [parameters[0]]: iteration
                    },
                    functionName: "anonymus",
                    body: body,
                }
              })  
            }
            return new Array(iterations).fill(val)
        
        }},
    {"name": "for_loop$subexpression$1", "symbols": ["value"]},
    {"name": "for_loop$subexpression$1", "symbols": ["function"]},
    {"name": "for_loop", "symbols": [{"literal":"for"}, "_", "number", "_", "number", "for_loop$subexpression$1"], "postprocess": id},
    {"name": "conditional", "symbols": [{"literal":"if"}, "_", "value", "_", {"literal":"then"}, "_", "value", "_", {"literal":"else"}, "_", "value"], "postprocess": (d)=>
        d[2] ?
             d[6]
        :
             d[10]
        },
    {"name": "boolean", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess": d=> d[0].toString()==="true"},
    {"name": "boolean", "symbols": ["value", "_", (lexer.has("isEqual") ? {type: "isEqual"} : isEqual), "_", "value"], "postprocess": (d)=> d[0] === d[4]},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": d=>d.join("").substring(1,d.join("").length-1 )},
    {"name": "string", "symbols": [{"literal":"concatenate"}, "_", "value", "_", "value"], "postprocess": (d) => d[2] + d[4]},
    {"name": "float", "symbols": ["int", {"literal":"."}, "int"], "postprocess": function(d) {return parseFloat(d[0] + d[1] + d[2])}},
    {"name": "float", "symbols": ["int"], "postprocess": function(d) {return parseInt(d[0])}},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": function(d) {return d[0].join(""); }},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": d=> Number(d)},
    {"name": "number", "symbols": [{"literal":"plus"}, "_", "value", "_", "value"], "postprocess": (d)=> d[2] + d[4]},
    {"name": "number", "symbols": [{"literal":"times"}, "_", "value", "_", "value"], "postprocess": (d)=> d[2] * d[4]},
    {"name": "number", "symbols": [{"literal":"minus"}, "_", "float", "_", "float"], "postprocess": (d)=> d[2] - d[4]},
    {"name": "number", "symbols": [{"literal":"increment"}, "_", "value"], "postprocess": (d)=> d[2]+1},
    {"name": "number", "symbols": ["value", "_", (lexer.has("plus") ? {type: "plus"} : plus), "_", "value"], "postprocess": function(d) {return d[0]+d[4]; }},
    {"name": "number", "symbols": ["value", "_", (lexer.has("times") ? {type: "times"} : times), "_", "value"], "postprocess": function(d) {return d[0]*d[4]; }},
    {"name": "number", "symbols": [{"literal":"randomInteger"}, "_", "number", "_", "number"], "postprocess": d=> grammar.lookup("randomInteger")(d[2], d[4])},
    {"name": "var_assign", "symbols": [(lexer.has("myVariable") ? {type: "myVariable"} : myVariable), "expr"], "postprocess": 
        
        (data) => {
            console.log("var assign got data:", data) ;
            grammar.assign(data[0].toString().substring(0, data[0].toString().length-1), data[1])
            return ""
        }
                },
    {"name": "identifier", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d)=>d.join("")},
    {"name": "variable", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d)=>{
            //return d[0]
            //console.log(d)
            //console.log(`variable called with "${d.join("")}"`)
            //try{
                if(grammar.lookup(d.join("")) === undefined){
                    // console.log("context is", context )
                    throw new Error(`the variable ${d.join("")} is not defined `)
                }
                //console.log("this is", this)
                //sconsole.log("grammer is", grammar)
                        // console.log("grammer is", grammar)
        
             return grammar.lookup(d.join(""))//context[d.join("")]
            /* }catch{
            #     return d.join("")
            # }*/
        }
            },
    {"name": "NL$subexpression$1", "symbols": [/[\n]/]},
    {"name": "NL", "symbols": ["NL$subexpression$1"], "postprocess": id},
    {"name": "__lb_$ebnf$1$subexpression$1", "symbols": ["_", "NL"]},
    {"name": "__lb_$ebnf$1", "symbols": ["__lb_$ebnf$1$subexpression$1"]},
    {"name": "__lb_$ebnf$1$subexpression$2", "symbols": ["_", "NL"]},
    {"name": "__lb_$ebnf$1", "symbols": ["__lb_$ebnf$1", "__lb_$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__lb_", "symbols": ["__lb_$ebnf$1", "_"], "postprocess": id},
    {"name": "_ml$ebnf$1$subexpression$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "_ml$ebnf$1$subexpression$1", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "_ml$ebnf$1", "symbols": ["_ml$ebnf$1$subexpression$1"]},
    {"name": "_ml$ebnf$1$subexpression$2", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "_ml$ebnf$1$subexpression$2", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "_ml$ebnf$1", "symbols": ["_ml$ebnf$1", "_ml$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_ml", "symbols": ["_ml$ebnf$1"]},
    {"name": "__ml$ebnf$1$subexpression$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "__ml$ebnf$1$subexpression$1", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "__ml$ebnf$1", "symbols": ["__ml$ebnf$1$subexpression$1"]},
    {"name": "__ml$ebnf$1$subexpression$2", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "__ml$ebnf$1$subexpression$2", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "__ml$ebnf$1", "symbols": ["__ml$ebnf$1", "__ml$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__ml", "symbols": ["__ml$ebnf$1"]},
    {"name": "_$ebnf$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "__$ebnf$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
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
