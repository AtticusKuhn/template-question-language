const moo = require('moo');

const rules = {
    // myVariable: /[a-zA-Z]+[^=]/,
    textFormat: { match: /^\#.+$/, value: s => s.match(/^\#(.+)$/)[1] },
    comment: /\/\/.+$/,

    myText: { match: /[^}\n](?![^{]*})/ },
    math: {
        match: /\{\#[^\}]*\#\}/,
        value: s => s.substring(2, s.length - 2)
    },
    keyWords: /if|then|else|for|iterate/,
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
        pattern: rules[key].match || rules[key],
        greedy: true,
    };
});
export let bruhRules = rules;
export const prismStyles = Object.keys(bruhRules).map((key, index) => {
    return `.${key} {
        color: black;
        background-color: hsl(${Math.floor(index * (360 / (Object.keys(bruhRules).length - 1)))}, 100%, 80%);
        border: 1px solid red;
    }`
}).join("\n")

module.exports = { lexer, bruhRules, prismStyles };


