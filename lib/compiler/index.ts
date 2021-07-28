type Context = {
    [name: string]: (...arguents: any) => any
}
type Error = {
    errName: string;
    errBody: string
};
type Warning = string;

export type CompileResult = {
    result: string | Error;
    warnings?: Warning[]
}
function hasError(result: CompileResult): result is { result: Error, warnings: Warning[] } {
    return (<{ result: Error, warnings: Warning[] }>result).result.errName !== undefined;
}
type evalStep = { newContext: Context, result: CompileResult }

const validateExpression = (expression: string): boolean => {
    if (expression.startsWith())
}

const validateStatement = (statement: string) => {
    const allowedFunctions = Object.keys(globalContext).join("|")

}


const evalWithContext = (jsString: string, context: Context): evalStep => {
    const [result, newContext] = new Function("globals", `
    with (globals) { return [eval("${jsString}"), globals] }
    
    `)(context);
    return { result, newContext }
}

const globalContext = {
    "add": (x: number) => x + 1
}

export const compile = (source: string): CompileResult => {
    return extractAndEvalSections(source, globalContext)
}
const evalSection = (section: string, context: Context): evalStep => {
    const compiled = compileSection(section)
    if (!hasError(compiled)) {
        return evalWithContext(compiled.result, context)
    } else {
        return { newContext: context, result: compiled }
    }
}

const compileSection = (section: string): CompileResult => {
    const escapeQuotes = section.replace(/"/g, '\\"');
    const splitByStatements = escapeQuotes.split(/(;|\n)/gm)
    if (!splitByStatements.every(statement => /(var\s|set\s)?[A-Za-z_]+=.*/.test(statement))) {
        return {
            result: {
                errName: "invalid statement",
                errBody: "bruh"
            }
        }
    }
    const withContext = splitByStatements.map(statement => statement.replace(/(var\s|set\s)(?=[A-Za-z_]+\=.*)/m, "")
        .replace(/(?=(var\s|set\s)?)([A-Za-z_]+)(?=\=.*)/m, "globals.$2"));
    const joined = withContext.join(";")
    return {
        result: joined,
        warnings: [],
    }
}
const extractAndEvalSections = (source: string, context: Context): CompileResult => {
    const sectionRegex = /\{[^\}]*?}/m
    const match = source.match(sectionRegex)
    if (!match || match.length < 1) return { result: source, warnings: [] }
    const firstMatch = match[0]
    const compiled = evalSection(firstMatch, context)
    console.log("evalSection returned", compiled)
    const remainingPart = source.replace(sectionRegex, compiled.result)
    console.log("remaining part is", remainingPart)
    return extractAndEvalSections(remainingPart, compiled.newContext)
}