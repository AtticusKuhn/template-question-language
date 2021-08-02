const moo = require('moo');

const rules = {
    // myVariable: /[a-zA-Z]+[^=]/,
    myText: { match: /[^}](?![^{]*})/, lineBreaks: true },
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
    times: /\*/,
    lparen: /\(/,
    rparen: /\)/,
    lbrace: /\{/,
    rbrace: /\}/,
    identifier: /[a-zA-Z][a-zA-Z_0-9]*/,
    fatarrow: /=>/,
    assign: /\=/,
    NL: { match: /\n/, lineBreaks: true },
}
export let lexer = moo.compile(rules);
let prismRules = Object.keys(rules).map(function (key, index) {
    rules[key] = {
        pattern: rules[key].match || rules[key]
    };
});
export let bruhRules = rules;
export const prismStyles = Object.keys(bruhRules).map((key, index) => {
    return `.${key} {
        color: hsl(${Math.floor(index * (360 / Object.keys(bruhRules).length))}, 90%, 80%);
    }`
}).join("\n")

console.log("prismStyles", prismStyles)
module.exports = { lexer, bruhRules, prismStyles };


