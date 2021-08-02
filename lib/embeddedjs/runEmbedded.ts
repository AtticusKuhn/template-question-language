import nearley from "nearley"
import grammar from "./parser"
import { parser } from "mathjs"
export const runEmbedded = (code: string): string => {

    console.log("runEmbbeded called")

    // const code = (await fs.readFile(filename)).toString();
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(code)
    return parser.results[0].join("")
}
function evalMath(expr: string) {
    // expr = trim(expr);

    // if (expr == 'clear') {
    //     clear();
    //     return;
    // }

    if (expr) {
        // history.push(expr);
        // historyIndex = history.length;

        var res, resStr, info;
        try {
            res = parser.evaluate(expr);
            resStr = math.format(res, { precision: 14 });
            var unRoundedStr = math.format(res);
            if (unRoundedStr.length - resStr.length > 4) {
                // info = [
                //     createDiv('This result contains a round-off error which is hidden from the output. The unrounded result is:'),
                //     createDiv(unRoundedStr),
                //     createA('read more...', 'docs/datatypes/numbers.html#roundoff-errors', '_blank')
                // ];
            }
        }
        catch (err) {
            resStr = err.toString();
        }
        return resStr
    }
}