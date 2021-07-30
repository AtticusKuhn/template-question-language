import nearley from "nearley"
import grammar from "./parser"
export const runEmbedded = (code: string): string => {

    console.log("runEmbbeded called")

    // const code = (await fs.readFile(filename)).toString();
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(code)
    return parser.results[0].join("")
}