const { runParser } = require("../runParser")
test('{plus 1 1}', () => {
    expect(runParser("{plus 1 1}")).toBe("2");
})
test('{plus 2 1}', () => {
    expect(runParser("{plus 2 1}")).toBe("3");
})
test('abcdef', () => {
    expect(runParser("abcdef")).toBe("abcdef");
})
test(`
{a=1}
{a}
hello
    `, () => {

    expect(runParser(`
{a=1}
{a}
hello
    `)).toBe(`

1
hello
    `);
})
test(`
{a="hello I am string"}
{concatenate a "hi}
hello
`, () => {

    expect(runParser(
        `{a="hello I am string"}
{concatenate a "hi"}
hello`)).toBe(`
hello I am stringhi
hello`);
});
test('{b}', () => {
    expect(runParser("{b}")).toBe("Error: the variable b is not defined ");
})
test('{1+1}', () => {
    expect(runParser("{1+1}")).toBe("2");
})
test('{if true then 1 else 2}', () => {
    expect(runParser("{if true then 1 else 2}")).toBe("1");
})
test('{if false then 1 else 2}', () => {
    expect(runParser("{if false then 1 else 2}")).toBe("2");
})
/*{a=true}
{a}
{if a then 1 else 2}*/
test(`{a=true}
{a}
{if a then 1 else 2}`, () => {
    expect(runParser(`{a=true}
    {a}
    {if a then 1 else 2}`)).toBe(`
    true
    1`);
})