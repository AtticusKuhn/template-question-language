const moo = require('moo');

export let lexer = moo.compile({
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
    variable: /[a-zA-Z]+(?!\=)/,
    NL: { match: /\n/, lineBreaks: true },
});

module.exports = lexer;


