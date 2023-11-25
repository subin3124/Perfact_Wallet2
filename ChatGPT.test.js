/*const gpt = require("./ChatGPT");
test("chatgpt api", async () => {
    expect(await gpt("연필")).toBe("문구");
});*/
test("test not env", () => {
   expect("1").toBe("1");
});