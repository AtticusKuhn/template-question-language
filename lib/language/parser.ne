@{%
// const myLexer = require("./lexer");
const moo = require('moo');
const runParser = require("./fakeRunParser.js")
const {lexer} = require("./lexer")
/*

let context = {
    increment: (x)=> x+1,
    concatenate: (a,b)=>a+b,
    plus: (a,b)=>a+b,
    randomInteger: (l, h)=> Math.floor(Math.random()*(l-h)) + l
};*/

%}

@lexer lexer

program -> thing:+ {%(d) =>  d[0] %}
    | null {%id%}
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
                toString: ()=>data[0].value.body,
            }
        }
    %}
    fun_call
    -> %functionCall
        {%
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
                    functionName,
                    body: grammar.lookup(functionName).body,
                }
                // return runParser.runStatmentWithContext(context[functionName].body, Object.assign(context,zippedParams))
                // return "funcall"
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
#                 return [data[0]];
#             }
#         %}
value 
    -> 
   %lparen value %rparen {%d=> d[1]%}
    |fun_call {%id%}
   | number  {%id%}
   | variable {%id%}
    | string {%id%}
    | boolean {%id%}
    | conditional {%id%}
    | for_loop {%id%}
    |function {%id%}

for_loop -> "for" _ number _ number (value|function) {%id%}


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
   # | variable {%id%}
# string -> "\"" [^"]:+ "\"" {%d=>d[1].join("")%}
string -> 
    %string {%d=>d.join("").substring(1,d.join("").length-1 )%}
    | "concatenate" _ value _ value {%(d) => d[2] + d[4]%}
    # | value {%id%}
   # | variable {%id%}
float ->
      int "." int   {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
	| int           {% function(d) {return parseInt(d[0])} %}

int -> [0-9]:+       {% function(d) {return d[0].join(""); } %}
number 
    -> %number {%d=> Number(d)%}
    | "plus" _  float  _  float {%(d)=> d[2] + d[4] %}
    | "minus" _  float _   float {%(d)=> d[2] - d[4] %}
    | "increment" _ value {%(d)=> d[2]+1%}
    |  value _  %plus _ value {% function(d) {return d[0]+d[4]; } %}
     |  value _  %times _ value {% function(d) {return d[0]*d[4]; } %}

   # | variable {% id%}
    | "randomInteger" _ number  _ number {%d=> grammar.lookup("randomInteger")(d[2], d[4])%}
    # | value {%id%}

    var_assign -> %myVariable expr
        {%

            (data) => {
                // console.log("var assign got data:", data) ;
                grammar.assign(data[0].toString().substring(0, data[0].toString().length-1), data[1])
                return ""
            }
        %}
      identifier -> %identifier {%(d)=>d.join("")%}
  

variable -> %identifier {%(d)=>{
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