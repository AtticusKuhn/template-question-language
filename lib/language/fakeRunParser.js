const nearley = require("nearley")
const grammar = require("./fakeParser.js")

function parse(code) {
    // console.trace("runparser.js  called")
    // const code = (await fs.readFile(filename)).toString();
    console.log("before parser is fed (fakseparser.js)")
    try {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        parser.feed(code);

        console.log("after parser is fed (fakseparser.js)")
        console.log("in fakeparser.js, parser is", parser)
        // console.log("in runParser.js, the parsers is being fed", code)
        // console.log("parser:")
        // console.log(parser)
        if (parser.results.length > 1) {
            console.error("Error: ambigous grammar detected \n\n" + parser.results[0].join(""));
            // throw new Error("Error: ambigous grammar detected")
            return parser.results[0].join("")
            // for (let i = 0; i < parser.results.length; i++) {
            //     const ast = parser.results[i];
            //     return ast
            // }
        } else if (parser.results.length == 1) {
            const ast = parser.results[0].join("");
            // const outputFilename = filename.replace(".small", ".ast");
            // await fs.writeFile(outputFilename, JSON.stringify(ast, null, "  "));
            // console.log(`Wrote ${outputFilename}.`);
            return ast
        } else {
            console.log("Error: no parse found.");
            console.log("in parser.js no parse found and parser is", parser, "at the time that no parser was found the coed was", code)
            throw new Error(`no parse found for code ${code} (from runParser.js line 28)`)
            return "Error: no parse found."
        }
    } catch (e) {
        console.log(e.stack)
        console.log(e.trace)
        return e.stack + ""
    }
}
export const runParser = (parserInput, context = {}) => {
    // console.log()
    // try {
    const test =
        `${Object.keys(context).map(key => `{${key}=${context[key]}}`).join("\n")}
${parserInput}`
    console.log("test", test)
    const parsing = parse(test)
    console.log("after parsing in parser.js")
    console.log("parsing:")
    console.log(parsing)
    // const evalled = evalStatments(parsing)
    // console.log("evalled:")
    // console.log(evalled)
    return parsing
    // } catch (e) {
    //     return e.toString();
    // }
}

export function runStatmentWithContext(statement, context = { bruh: 10 }) {
    console.log("in runparser.js, runStatmentWithContext was called with ", statement)
    return runParser(`{${statement}}`, context).trim()
}
module.exports = { runStatmentWithContext, runParser }