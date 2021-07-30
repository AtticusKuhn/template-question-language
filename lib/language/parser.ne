@{%
// const myLexer = require("./lexer");
const moo = require('moo');

 let myLexer = moo.compile({
    // myVariable: /[a-zA-Z]+[^=]/,
    myText: /[^}\n](?![^{]*})/,
    keyWords: /if|then|else|for/,
    boolean:/true|false/,
    // assignVariable:/[a-zA-Z]+=[^=]+/
    isEqual:/==/,
    myFunction:{match:/\([^}]+\)\=\>[^}]+/, value: s => ({
        params: s.match(/\(([^}]+)\)\=\>([^}]+)/)[1].split(","),
        body: s.match(/\(([^}]+)\)\=\>([^}]+)/)[2],
    })} ,
    functionCall: {
        match: /[a-zA-Z][a-zA-Z_0-9]*\(.*\)/,
        value:s=>({
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
    increment: (x)=> x+1,
    concatenate: (a,b)=>a+b,
    plus: (a,b)=>a+b,
    randomInteger: (l, h)=> Math.floor(Math.random()*(l-h)) + l
};

%}

@lexer myLexer

program -> thing:+ {%(d) =>  d[0] %}
thing -> text {%id%} 
    | "{"  statement "}" {%(data)=> data[1]%}
    | NL



text -> %myText {%id%}# {% d=>console.log("in text, d is", d) || d[0].join("") %}
    # -> _ml statements _ml
    #     {%
    #         (data) => {
    #             return data[1];
    #         }
    #     %}

# statements
#     ->  statement (__lb_ statement):*
#         {%
#             (data) => {
#                 const repeated = data[1];
#                 const restStatements = repeated.map(chunks => chunks[1]);
#                 return [data[0], ...restStatements];
#             }
#         %}

statement
    -> var_assign  {% id %}
    | expr {%id%}






expr
    -> value {%id%}
    # |  identifier {% id %}


function -> %myFunction
    {%
        (data) => {
            console.log("function recieved", data)
    //return "hello"
                return {
                type: "function",
                parameters: data[0].value.params,
                body:data[0].value.body,
            }
        }
    %}
    fun_call
    -> %functionCall
        {%
            (data) => {
                const {functionName, functionParams} = data[0].value
                if(!context[functionName]){
                    throw new Error(`cannot find the function named "${functionName}"`)
                }
                return "funcall"
            }
        %}
    
# param_list
#     -> %identifier (__ %identifier):*
#         {%
#             (data) => {
#                 const repeatedPieces = data[1];
#                 const restParams = repeatedPieces.map(piece => piece[1]);
#                 return [data[0], ...restParams];
#             }
#         %}

# lambda_body
#     -> expr
#         {%
#             (data) => {
#                 console.log("lambda body,", data)
#                 return [data[0]];
#             }
#         %}
value 
    -> 
fun_call {%id%}
   | number  {%id%}
    | string {%id%}
    | boolean {%id%}
    | conditional {%id%}
    | for_loop {%id%}
    |function {%id%}

for_loop -> "for" _ number _ number (value|function)


conditional -> "if" _  boolean _  "then" _  value  _ "else" _  value {%(d)=>
d[2] ?
     d[6]
:
     d[10]
%}
    #  | variable {%id%}
boolean
    -> %boolean {%d=> d[0].toString()==="true"%}
    | value _ %isEqual _ value {%(d)=> d[0] === d[4]%}
    | variable {%id%}
# string -> "\"" [^"]:+ "\"" {%d=>d[1].join("")%}
string -> 
    %string {%d=>d.join("").substring(1,d.join("").length-1 )%}
    | "concatenate" _ string _ string {%(d) => d[2] + d[4]%}
    # | value {%id%}
    | variable {%id%}
float ->
      int "." int   {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
	| int           {% function(d) {return parseInt(d[0])} %}

int -> [0-9]:+       {% function(d) {return d[0].join(""); } %}
number 
    -> %number {%d=> Number(d)%}
    | "plus" _  float  _  float {%(d)=> d[2] + d[4] %}
    | "minus" _  float _   float {%(d)=> d[2] - d[4] %}
    | "increment" _ number {%(d)=> d[2]+1%}
    |  number _  %plus _ number {% function(d) {return d[0]+d[4]; } %}
    | variable {% id%}
    | "randomInteger" _ number  _ number {%d=> context.randomInteger(d[2], d[4])%}
    # | value {%id%}

    var_assign -> %myVariable expr
        {%

            (data) => {
                console.log("var assign got data:", data) ;
                context[data[0].toString().substring(0, data[0].toString().length-1)] = data[1]
                return ""
            }
        %}
      identifier -> %identifier {%(d)=>d.join("")%}
  

variable -> %identifier {%(d)=>{
    console.log(d)
    console.log(`variable called with "${d.join("")}"`)
    console.log("context is", context)
    //try{
        if(! context[d.join("")]){
            throw new Error(`the variable ${d.join("")} is not defined `)
        }
     return context[d.join("")]
    /* }catch{
    #     return d.join("")
    # }*/
}
    %}


 NL -> ([\n]) {%id%}
# Mandatory line-break with optional whitespace around it
__lb_ -> (_ NL):+ _ {%id%}

# Optional multi-line whitespace
_ml -> (%WS | %NL):+

# Mandatory multi-line whitespace
__ml -> (%WS | %NL):+

# Optional whitespace    
_ -> %WS:?

# Mandatory whitespace
__ -> %WS:+