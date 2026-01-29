/**
 * 使用 DeepSeek API 生成境界描述
 * 
 * 用法: DEEPSEEK_API_KEY=sk-xxx node scripts/generate-descriptions.js
 */

import { writeFileSync, existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// 所有境界名称
const REALMS = [
  "凡人",
  "炼气一层", "炼气二层", "炼气三层", "炼气四层", "炼气五层",
  "炼气六层", "炼气七层", "炼气八层", "炼气九层",
  "筑基前期", "筑基中期", "筑基后期", "筑基圆满", "半步金丹",
  "金丹前期", "金丹中期", "金丹后期", "金丹圆满", "半步元婴",
  "元婴前期", "元婴中期", "元婴后期", "元婴圆满", "半步化神",
  "化神前期", "化神中期", "化神后期", "化神圆满", "半步炼虚",
  "炼虚前期", "炼虚中期", "炼虚后期", "炼虚圆满", "半步合体",
  "合体前期", "合体中期", "合体后期", "合体圆满", "半步渡劫",
  "渡劫前期", "渡劫中期", "渡劫后期", "渡劫圆满", "飞升"
];

async function generateDescription(realmName, apiKey) {
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
          content: `你是一个精通《凡人修仙传》的修仙文化专家，要为GitHub修仙应用写境界描述。

要求：
1. 10-18个字，语言精炼有力
2. 融合程序员梦话（996、秃头、上线、运维、PR、code review、上生产等）
3. 参考凡人修仙传经典梧：
   - “我辈修仙，本就逆天而行”
   - “不怕路远，就怕无路”
   - “修仙之道，在于坚持”
   - 韩立的谨慎、务实、低调风格
4. 可以用谐音、双关、抖机灵
5. 避免重复使用commit、bug、merge这些词

示例风格：
- "代码三千，只取一行"
- "996福报，修为加倍"
- "上线即飞升，回滚即轮回"
- "三年OA，五年架构"`
        },
        {
          role: 'user',
          content: `为「${realmName}」写一句有趣的境界描述。只输出描述本身，不要引号。`
        }
      ],
      temperature: 1.0,
      max_tokens: 60
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim().replace(/^["「]|["」]$/g, '');
}

async function main() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error('请设置环境变量 DEEPSEEK_API_KEY');
    console.error('用法: DEEPSEEK_API_KEY=sk-xxx node scripts/generate-descriptions.js');
    process.exit(1);
  }

  const outputPath = join(__dirname, '../src/data/realm-descriptions.json');
  
  // 如果文件已存在，加载现有数据
  let descriptions = {};
  if (existsSync(outputPath)) {
    descriptions = JSON.parse(readFileSync(outputPath, 'utf-8'));
    console.log(`已加载 ${Object.keys(descriptions).length} 个现有描述`);
  }

  console.log(`开始生成 ${REALMS.length} 个境界描述...\n`);

  for (const realm of REALMS) {
    // 跳过已有描述的境界
    if (descriptions[realm]) {
      console.log(`✓ ${realm}: ${descriptions[realm]} (已存在)`);
      continue;
    }

    try {
      const desc = await generateDescription(realm, apiKey);
      descriptions[realm] = desc;
      console.log(`✓ ${realm}: ${desc}`);
      
      // 每次生成后保存，防止中断丢失
      writeFileSync(outputPath, JSON.stringify(descriptions, null, 2), 'utf-8');
      
      // 避免 API 限流
      await new Promise(r => setTimeout(r, 500));
    } catch (error) {
      console.error(`✗ ${realm}: ${error.message}`);
    }
  }

  console.log(`\n完成！描述已保存到 ${outputPath}`);
}

main();
