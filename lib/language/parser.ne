@{%
// const myLexer = require("./lexer");
const moo = require('moo');

 let myLexer = moo.compile({
    // myVariable: /[a-zA-Z]+[^=]/,
    myText: /[^}\n](?![^{]*})/,
    keyWords: /if|then|else/,
    boolean:/true|false/,
    // assignVariable:/[a-zA-Z]+=[^=]+/
        isEqual:/==/,

    myVariable: /[a-zA-Z]+(?!=)=(?!=)/, ///[a-zA-Z]+(?!.*=)/,
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
let context = {
    increment: (x)=> x+1,
    concatenate: (a,b)=>a+b,
    plus: (a,b)=>a+b,
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

identifier -> %identifier {%(d)=>d.join("")%}

var_assign -> identifier %assign expr
        {%
            (data) => {
                context[data[0]] = data[2]
                return ""
            }
        %}
        




expr
    -> value {%id%}
    # |  identifier {% id %}


value 
    -> number  {%id%}
    | string {%id%}
    | boolean {%id%}
    | conditional {%id%}


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
    # | value {%id%}

variable -> %myVariable {%(d)=>{
    console.log(d)
    console.log(`variable called with "${d.join("")}"`)
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