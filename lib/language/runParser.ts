import nearley from "nearley"
import grammar from "./parser"

function parse(code: string) {
    // const code = (await fs.readFile(filename)).toString();
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(code);
    if (parser.results.length > 1) {
        console.log("Error: ambigous grammar detected");
        return parser.results[0]
        // for (let i = 0; i < parser.results.length; i++) {
        //     const ast = parser.results[i];
        //     return ast
        // }
    } else if (parser.results.length == 1) {
        const ast = parser.results[0];
        // const outputFilename = filename.replace(".small", ".ast");
        // await fs.writeFile(outputFilename, JSON.stringify(ast, null, "  "));
        // console.log(`Wrote ${outputFilename}.`);
        return ast
    } else {
        console.log("Error: no parse found.");
        return null
    }
}
export const runParser = (parserInput: string): string => {
    console.log()
    try {
        const parsing = parse(parserInput)
        console.log("parsing:")
        console.log(parsing)
        const evalled = evalStatments(parsing)
        console.log("evalled:")
        console.log(evalled)
        return JSON.stringify(evalled)
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
    const [result, newContext] = new Function("g", `
    let globals = g
    let res= eval("${jsString}")
    return [ res, globals] }
    `)(context);
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
        console.log("parsedStatment:")
        console.log(parsedStatment)
        if (parsedStatment?.type === "var_assign") {
            const evalResult = evalWithContext(statement.value, context)
            context = evalResult.newContext
            lines.push(evalResult.result)
        } else {
            lines.push(statement);
        }
    }
    return lines.join("\n");
}

function generateJsForStatementOrExpr(node) {
    if (node.type === "var_assign") {
        const varName = node.var_name.value;
        const jsExpr = generateJsForStatementOrExpr(node.value);
        const js = `var ${varName} = ${jsExpr};`;
        return js;
    } else if (node.type === "fun_call") {
        let funName = node.fun_name.value;
        if (funName === "if") {
            funName = "$if";
        }
        const argList = node.arguments.map((arg) => {
            return generateJsForStatementOrExpr(arg);
        }).join(", ");
        return `${funName}(${argList})`;
    } else if (node.type === "string") {
        return node.value;
    } else if (node.type === "number") {
        return node.value;
    } else if (node.type === "identifier") {
        return node.value;
    } else if (node.type === "lambda") {
        const paramList = node.parameters
            .map(param => param.value)
            .join(", ");
        const jsBody = node.body.map((arg, i) => {
            const jsCode = generateJsForStatementOrExpr(arg);
            if (i === node.body.length - 1) {
                return "return " + jsCode;
            } else {
                return jsCode;
            }
        }).join(";\n");
        return `function (${paramList}) {\n${indent(jsBody)}\n}`;
    } else if (node.type === "comment") {
        return "";
    } else {
        throw new Error(`Unhandled AST node type ${node.type}: ${JSON.stringify(node)}`);
    }
}

function indent(string) {
    return string.split("\n").map(line => "    " + line).join("\n");
}