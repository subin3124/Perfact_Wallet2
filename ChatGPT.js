


async function requestGPT(text) {
    const OpenAI = require('openai');
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": "모든 질문에 명확한 대답을 하며 물품의 종류에 대해 음식, 문구, 여가,  술, 생활용품, 가전, 책, 기타로 분류하고 설명은 하지 않는 분석가"
            },
            {
                "role": "user",
                "content": "연필"
            },
            {
                "role": "assistant",
                "content": "문구"
            },
            {
                "role": "user",
                "content": "신라면 볶음면"
            },
            {
                "role": "assistant",
                "content": "음식"
            },
            {
                "role": "user",
                "content": "A4 용지"
            },
            {
                "role": "assistant",
                "content": "문구"
            },
            {
                "role": "user",
                "content": "참이슬"
            },
            {
                "role": "assistant",
                "content": "술"
            },
            {
                "role": "user",
                "content": "진로"
            },
            {
                "role": "assistant",
                "content": "술"
            },
            {
                "role": "user",
                "content": "삼성 갤럭시 S20 Ultra"
            },
            {
                "role": "assistant",
                "content": "가전"
            },
            {
                "role": "user",
                "content": "범죄도시 2 (SUITE CINEMA)"
            },
            {
                "role": "assistant",
                "content": "영화"
            },
            {
                "role": "user",
                "content": "바람과 함께 사라지다"
            },
            {
                "role": "assistant",
                "content": "영화"
            },
            {
                "role": "user",
                "content": "포카리스웨트"
            },
            {
                "role": "assistant",
                "content": "음식"
            },
            {
                "role": "user",
                "content": "코카콜라"
            },
            {
                "role": "assistant",
                "content": "음식"
            },
            {
                "role": "user",
                "content": "불닭볶음면"
            },
            {
                "role": "assistant",
                "content": "음식"
            },
            {
                "role": "user",
                "content": text
            }
        ],
        temperature: 1,
        max_tokens: 10,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    return response.choices[0].message.content;
}
module.exports = requestGPT;