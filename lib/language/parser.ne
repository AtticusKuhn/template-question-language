@{%
const myLexer = require("./lexer");
%}

@lexer myLexer

program -> thing:+ {%(d) =>  d[0] %}
thing -> text {%id%} 
    | "{"  statements "}" {%(data)=> data[1]%}



text -> [a-zA-Z\n]:+   {% (d) =>  d[0].join("") %}
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
statements
    ->  statement (__lb_ statement):*
        {%
            (data) => {
                const repeated = data[1];
                const restStatements = repeated.map(chunks => chunks[1]);
                return [data[0], ...restStatements];
            }
        %}

statement
    -> var_assign  {% id %}
    | expr {%id%}

identifier -> [a-zA-Z]:* {%(d)=>d.join("")%}
var_assign -> identifier _ "=" _ expr
        {%
            (data) => {
                return  {
                    type:"var_assign",
                    value:`globals.${data[0]} = ${data[4]}`,
                }
            }
        %}




expr
    -> value {%id%}
    |  identifier {% id %}


value 
    -> number  {%id%}
number 
    -> %number {%(d) => Number(d[0])%}
    | float {%id%}
    | number _ "+" _ number {%(d)=> d[0] + d[4]%}
    | "increment" _ number {%(d)=> d[2]+1%}



 NL -> ([\n]) {%id%}
# Mandatory line-break with optional whitespace around it
__lb_ -> (_ NL):+ _ {%id%}

# Optional multi-line whitespace
_ml -> (%WS | %NL):*

# Mandatory multi-line whitespace
__ml -> (%WS | %NL):+

# Optional whitespace    
_ -> %WS:*

# Mandatory whitespace
__ -> %WS:+