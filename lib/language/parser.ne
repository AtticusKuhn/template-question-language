@{%
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
    myVariable: /[a-zA-Z]+/,
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
float ->
      int "." int   {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
	| int           {% function(d) {return parseInt(d[0])} %}

int -> [0-9]:+        {% function(d) {return d[0].join(""); } %}
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

var_assign -> identifier "=" expr
        {%
            (data) => {
                context[data[0]] = data[2]
                return ""
            }
        %}
variable -> [a-zA-Z]:+ {%(d)=>{
    console.log("variable called")
    try{
     return context[d.join("")]
    }catch{
        return d.join("")
    }
}
    %}



expr
    -> value {%id%}
    # |  identifier {% id %}


value 
    -> number  {%id%}
    | string {%id%}
    | variable {%id%}

# string -> "\"" [^"]:+ "\"" {%d=>d[1].join("")%}
string -> %string {%d=>d.join("")%}

number 
    -> float {%id%}
    | "plus" _  float  float {%(d)=> d[2] + d[3] %}
    | "minus" _  float  float {%(d)=> d[2] - d[3] %}
    | "increment" _ number {%(d)=> d[2]+1%}
    # | variable {% id%}



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