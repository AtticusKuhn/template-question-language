// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
    function id(x) { return x[0]; }

    // const myLexer = require("./lexer");
    const moo = require('moo');
    // const runParser = require("")
    let myLexer = moo.compile({
        // myVariable: /[a-zA-Z]+[^=]/,
        myText: /[^}\n](?![^{]*})/,
        keyWords: /if|then|else|for/,
        boolean: /true|false/,
        // assignVariable:/[a-zA-Z]+=[^=]+/
        isEqual: /==/,
        myFunction: {
            match: /\([^}]+\)\=\>[^}]+/, value: s => ({
                params: s.match(/\(([^}]+)\)\=\>([^}]+)/)[1].split(","),
                body: s.match(/\(([^}]+)\)\=\>([^}]+)/)[2],
            })
        },
        functionCall: {
            match: /[a-zA-Z][a-zA-Z_0-9]*\(.*\)/,
            value: s => ({
                functionName: s.match(/([a-zA-Z][a-zA-Z_0-9]*)\((.*)\)/)[1],
                functionParams: s.match(/([a-zA-Z][a-zA-Z_0-9]*)\((.*)\)/)[2].split(",")
            })
        },
        myVariable: /[a-zA-Z]+=(?!=)/, ///[a-zA-Z]+(?!.*=)/,
        WS: /[ \t]+/,
        comment: /\/\/.*?$/,
        // number: /0|[1-9][0-9]*/,
        number: /[0-9]+/,
        string: /"(?:\\["\\]|[^\n"\\])*"/,
        plus: /\+/,
        lparen: '(',
        rparen: ')',
        lbrace: '{',
        rbrace: '}',
        identifier: /[a-zA-Z][a-zA-Z_0-9]*/,
        fatarrow: '=>',
        assign: '=',
        NL: { match: /\n/, lineBreaks: true },
    });

    let context = {
        increment: (x) => x + 1,
        concatenate: (a, b) => a + b,
        plus: (a, b) => a + b,
        randomInteger: (l, h) => Math.floor(Math.random() * (l - h)) + l
    };

    var grammar = {
        Lexer: myLexer,
        ParserRules: [
            { "name": "program$ebnf$1", "symbols": ["thing"] },
            { "name": "program$ebnf$1", "symbols": ["program$ebnf$1", "thing"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "program", "symbols": ["program$ebnf$1"], "postprocess": (d) => d[0] },
            { "name": "thing", "symbols": ["text"], "postprocess": id },
            { "name": "thing", "symbols": [{ "literal": "{" }, "statement", { "literal": "}" }], "postprocess": (data) => data[1] },
            { "name": "thing", "symbols": ["NL"] },
            { "name": "text", "symbols": [(myLexer.has("myText") ? { type: "myText" } : myText)], "postprocess": id },
            { "name": "statement", "symbols": ["var_assign"], "postprocess": id },
            { "name": "statement", "symbols": ["expr"], "postprocess": id },
            { "name": "expr", "symbols": ["value"], "postprocess": id },
            {
                "name": "function", "symbols": [(myLexer.has("myFunction") ? { type: "myFunction" } : myFunction)], "postprocess":
                    (data) => {
                        console.log("function recieved", data)
                        //return "hello"
                        return {
                            type: "function",
                            parameters: data[0].value.params,
                            body: data[0].value.body,
                        }
                    }
            },
            {
                "name": "fun_call", "symbols": [(myLexer.has("functionCall") ? { type: "functionCall" } : functionCall)], "postprocess":
                    (data) => {
                        console.log("function call called with", data)
                        const { functionName, functionParams } = data[0].value
                        if (!context[functionName]) {
                            throw new Error(`cannot find the function named "${functionName}"`)
                        }
                        //console.log("runParser : ", runParser)
                        // console.log("runParser.runStatmentWithContext ; ", runParser.runStatmentWithContext )
                        let zippedParams = {}
                        for (let i = 0; i < context[functionName].parameters.length; i++) {
                            zippedParams[context[functionName].parameters[i]] = functionParams[i]
                        }
                        return runParser.runStatmentWithContext(context[functionName].body, zippedParams)
                        // return "funcall"
                    }
            },
            { "name": "value", "symbols": ["fun_call"], "postprocess": id },
            { "name": "value", "symbols": ["number"], "postprocess": id },
            { "name": "value", "symbols": ["string"], "postprocess": id },
            { "name": "value", "symbols": ["boolean"], "postprocess": id },
            { "name": "value", "symbols": ["conditional"], "postprocess": id },
            { "name": "value", "symbols": ["for_loop"], "postprocess": id },
            { "name": "value", "symbols": ["function"], "postprocess": id },
            { "name": "for_loop$subexpression$1", "symbols": ["value"] },
            { "name": "for_loop$subexpression$1", "symbols": ["function"] },
            { "name": "for_loop", "symbols": [{ "literal": "for" }, "_", "number", "_", "number", "for_loop$subexpression$1"] },
            {
                "name": "conditional", "symbols": [{ "literal": "if" }, "_", "boolean", "_", { "literal": "then" }, "_", "value", "_", { "literal": "else" }, "_", "value"], "postprocess": (d) =>
                    d[2] ?
                        d[6]
                        :
                        d[10]
            },
            { "name": "boolean", "symbols": [(myLexer.has("boolean") ? { type: "boolean" } : boolean)], "postprocess": d => d[0].toString() === "true" },
            { "name": "boolean", "symbols": ["value", "_", (myLexer.has("isEqual") ? { type: "isEqual" } : isEqual), "_", "value"], "postprocess": (d) => d[0] === d[4] },
            { "name": "boolean", "symbols": ["variable"], "postprocess": id },
            { "name": "string", "symbols": [(myLexer.has("string") ? { type: "string" } : string)], "postprocess": d => d.join("").substring(1, d.join("").length - 1) },
            { "name": "string", "symbols": [{ "literal": "concatenate" }, "_", "string", "_", "string"], "postprocess": (d) => d[2] + d[4] },
            { "name": "string", "symbols": ["variable"], "postprocess": id },
            { "name": "float", "symbols": ["int", { "literal": "." }, "int"], "postprocess": function (d) { return parseFloat(d[0] + d[1] + d[2]) } },
            { "name": "float", "symbols": ["int"], "postprocess": function (d) { return parseInt(d[0]) } },
            { "name": "int$ebnf$1", "symbols": [/[0-9]/] },
            { "name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "int", "symbols": ["int$ebnf$1"], "postprocess": function (d) { return d[0].join(""); } },
            { "name": "number", "symbols": [(myLexer.has("number") ? { type: "number" } : number)], "postprocess": d => Number(d) },
            { "name": "number", "symbols": [{ "literal": "plus" }, "_", "float", "_", "float"], "postprocess": (d) => d[2] + d[4] },
            { "name": "number", "symbols": [{ "literal": "minus" }, "_", "float", "_", "float"], "postprocess": (d) => d[2] - d[4] },
            { "name": "number", "symbols": [{ "literal": "increment" }, "_", "number"], "postprocess": (d) => d[2] + 1 },
            { "name": "number", "symbols": ["number", "_", (myLexer.has("plus") ? { type: "plus" } : plus), "_", "number"], "postprocess": function (d) { return d[0] + d[4]; } },
            { "name": "number", "symbols": ["variable"], "postprocess": id },
            { "name": "number", "symbols": [{ "literal": "randomInteger" }, "_", "number", "_", "number"], "postprocess": d => context.randomInteger(d[2], d[4]) },
            {
                "name": "var_assign", "symbols": [(myLexer.has("myVariable") ? { type: "myVariable" } : myVariable), "expr"], "postprocess":

                    (data) => {
                        // console.log("var assign got data:", data) ;
                        context[data[0].toString().substring(0, data[0].toString().length - 1)] = data[1]
                        return ""
                    }
            },
            { "name": "identifier", "symbols": [(myLexer.has("identifier") ? { type: "identifier" } : identifier)], "postprocess": (d) => d.join("") },
            {
                "name": "variable", "symbols": [(myLexer.has("identifier") ? { type: "identifier" } : identifier)], "postprocess": (d) => {
                    /*console.log(d)
                    console.log(`variable called with "${d.join("")}"`)
                    console.log("context is", context)*/
                    //try{
                    if (!context[d.join("")]) {
                        throw new Error(`the variable ${d.join("")} is not defined `)
                    }
                    return context[d.join("")]
                    /* }catch{
                    #     return d.join("")
                    # }*/
                }
            },
            { "name": "NL$subexpression$1", "symbols": [/[\n]/] },
            { "name": "NL", "symbols": ["NL$subexpression$1"], "postprocess": id },
            { "name": "__lb_$ebnf$1$subexpression$1", "symbols": ["_", "NL"] },
            { "name": "__lb_$ebnf$1", "symbols": ["__lb_$ebnf$1$subexpression$1"] },
            { "name": "__lb_$ebnf$1$subexpression$2", "symbols": ["_", "NL"] },
            { "name": "__lb_$ebnf$1", "symbols": ["__lb_$ebnf$1", "__lb_$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "__lb_", "symbols": ["__lb_$ebnf$1", "_"], "postprocess": id },
            { "name": "_ml$ebnf$1$subexpression$1", "symbols": [(myLexer.has("WS") ? { type: "WS" } : WS)] },
            { "name": "_ml$ebnf$1$subexpression$1", "symbols": [(myLexer.has("NL") ? { type: "NL" } : NL)] },
            { "name": "_ml$ebnf$1", "symbols": ["_ml$ebnf$1$subexpression$1"] },
            { "name": "_ml$ebnf$1$subexpression$2", "symbols": [(myLexer.has("WS") ? { type: "WS" } : WS)] },
            { "name": "_ml$ebnf$1$subexpression$2", "symbols": [(myLexer.has("NL") ? { type: "NL" } : NL)] },
            { "name": "_ml$ebnf$1", "symbols": ["_ml$ebnf$1", "_ml$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "_ml", "symbols": ["_ml$ebnf$1"] },
            { "name": "__ml$ebnf$1$subexpression$1", "symbols": [(myLexer.has("WS") ? { type: "WS" } : WS)] },
            { "name": "__ml$ebnf$1$subexpression$1", "symbols": [(myLexer.has("NL") ? { type: "NL" } : NL)] },
            { "name": "__ml$ebnf$1", "symbols": ["__ml$ebnf$1$subexpression$1"] },
            { "name": "__ml$ebnf$1$subexpression$2", "symbols": [(myLexer.has("WS") ? { type: "WS" } : WS)] },
            { "name": "__ml$ebnf$1$subexpression$2", "symbols": [(myLexer.has("NL") ? { type: "NL" } : NL)] },
            { "name": "__ml$ebnf$1", "symbols": ["__ml$ebnf$1", "__ml$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "__ml", "symbols": ["__ml$ebnf$1"] },
            { "name": "_$ebnf$1", "symbols": [(myLexer.has("WS") ? { type: "WS" } : WS)], "postprocess": id },
            { "name": "_$ebnf$1", "symbols": [], "postprocess": function (d) { return null; } },
            { "name": "_", "symbols": ["_$ebnf$1"] },
            { "name": "__$ebnf$1", "symbols": [(myLexer.has("WS") ? { type: "WS" } : WS)] },
            { "name": "__$ebnf$1", "symbols": ["__$ebnf$1", (myLexer.has("WS") ? { type: "WS" } : WS)], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "__", "symbols": ["__$ebnf$1"] }
        ]
        , ParserStart: "program"
    }
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = grammar;
    } else {
        window.grammar = grammar;
    }
})();
