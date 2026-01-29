/**
 * DeepSeek API 服务
 * 使用 OpenAI 兼容格式
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

/**
 * 调用 DeepSeek API 生成文本
 */
export async function generateText(prompt, apiKey) {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个修仙小说作家，擅长用简洁有趣的语言描述修仙境界。每个描述应该：1. 不超过20个字 2. 融合程序员/GitHub元素 3. 富有修仙小说风格 4. 有趣且富有画面感'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 100
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

/**
 * 为境界生成描述
 */
export async function generateRealmDescription(realmName, apiKey) {
  const prompt = `为修仙境界「${realmName}」生成一个简短描述（不超过15个字），要融合程序员/代码/GitHub元素。只输出描述本身，不要加引号或其他内容。`;
  return generateText(prompt, apiKey);
}
