import nearley from "nearley"
import grammar from "./parser"

function parse(code: string): string {
    // const code = (await fs.readFile(filename)).toString();
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(code);
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

        throw new Error("no parse fpiund")
        return "Error: no parse found."
    }
}
export const runParser = (parserInput: string): string => {
    // console.log()
    try {
        const parsing = parse(parserInput)
        console.log("parsing:")
        console.log(parsing)
        // const evalled = evalStatments(parsing)
        // console.log("evalled:")
        // console.log(evalled)
        return parsing
    } catch (e) {
        return e.toString();
    }
}
type Context = {
    [name: string]: any;
}
const evalWithContext = (jsString: string, context: Context): {
    newContext: Context;
    result: any
} => {
    const code = `
    let globals = g
    let res= eval('${jsString}')
    return [ res, globals]
    `
    console.log("evalling code:")
    console.log(code)
    const [result, newContext] = new Function("g", code)(context);
    return { result, newContext }
}
function evalStatments(statements: any[]) {
    console.log("evalStatments recieved: ")
    console.log(statements)
    const lines = [];
    let context = {}
    for (let statement of statements) {
        console.log("statement:")
        console.log(statement)
        try {
            if (Array.isArray(statement))
                statement = statement[0]
        } catch { }
        if (statement?.type === "var_assign" || statement?.type === "execute_js") {
            const evalResult = evalWithContext(statement.value, context)
            context = evalResult.newContext
            lines.push(evalResult.result)
        } else {
            lines.push(statement);
        }
    }
    return lines.join("\n");
}
