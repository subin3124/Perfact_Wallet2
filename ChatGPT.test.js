const gpt = require("./ChatGPT");
test("chatgpt api", async () => {
    expect(await gpt("COX CK01 TKL 기계식 텐키리스 게이밍 키보드 (적축)")).toBe("");
});
test("test always true", () => {
   expect("1").toBe("1");
});