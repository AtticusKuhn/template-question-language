import nearley from "nearley"
import grammar from "./parser"



let context = {
    increment: (x) => x + 1,
    concatenate: (a, b) => a + b,
    plus: (a, b) => a + b,
    randomInteger: (l, h) => Math.floor(Math.random() * (l - h)) + l
};

// grammar.

function parse(code: string, grammar: any): string {
    // const code = (await fs.readFile(filename)).toString();
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(code);
    // console.log("parser:")
    // console.log(parser)
    if (parser.results.length === 0) {
        throw new Error("no parser found for input")
    }
    if (parser.results.length > 1) {
        console.error("Error: ambigous grammar detected \n\n" + parser.results[0].join(""));
        console.log(parser.results)
        throw new Error("Error: ambigous grammar detected")
        // for (let i = 0; i < parser.results.length; i++) {
        //     const ast = parser.results[i];
        //     return ast
        // }
    }
    //  if (parser.results.length == 1) {

    const ast = parser.results[0]
    for (let i = 0; i < ast.length; i++) {
        // console.log("token:", token)
        if (ast[i].type === "function_call") {
            console.log("function call")
            ast[i] = runParser(`{${ast[i].body}}`, ast[i].params)
        }
    }
    // const outputFilename = filename.replace(".small", ".ast");
    // await fs.writeFile(outputFilename, JSON.stringify(ast, null, "  "));
    // console.log(`Wrote ${outputFilename}.`);
    return ast.join("");
    // } else {
    //     console.log("Error: no parse found.");
    //     console.log("when no parse was found, parser was", parser)
    //     throw new Error("no parse found")
    //     return "Error: no parse found."
    // }
}
export const runParser = (parserInput: string, newContext: Context = {}): string => {
    // console.log()
    try {
        //         const test =
        //             `${Object.keys(context).map(key => `{${key}=${context[key]}}`).join("\n")}
        // ${parserInput}`
        //         console.log("test", test)

        Object.assign(context, newContext)
        grammar.lookup = (name) => { return context[name]; }
        grammar.assign = (name, value) => { return context[name] = value; }

        const parsing = parse(parserInput, grammar)
        // console.log("parsing:")
        // console.log(parsing)
        // const evalled = evalStatments(parsing)
        // console.log("evalled:")
        // console.log(evalled)
        return parsing.trim()
    } catch (e) {
        return e.stack + ""
    }
}
export type Context = {
    [name: string]: any;
}

export function runStatmentWithContext(statement: string, context: Context = { bruh: 10 }) {
    return runParser(`{${statement}}`, context).trim()
}