/**
 * 境界常量定义
 */
export const RANKS = [
  { name: "凡人", color: "#78716c", minScore: 0, desc: "初涉江湖，代码未成行。" },
  { name: "炼气", color: "#a8a29e", minScore: 10, desc: "引气入体，Hello World。" },
  { name: "筑基", color: "#22c55e", minScore: 50, desc: "道基初成，逻辑自洽。" },
  { name: "金丹", color: "#3b82f6", minScore: 150, desc: "金丹大成，架构初现。" },
  { name: "元婴", color: "#a855f7", minScore: 400, desc: "元神出窍，全栈皆通。" },
  { name: "化神", color: "#eab308", minScore: 1000, desc: "神念通达，开源领袖。" },
  { name: "炼虚", color: "#f97316", minScore: 2500, desc: "虚空造物，框架之主。" },
  { name: "合体", color: "#ef4444", minScore: 5000, desc: "身化万千，万星敬仰。" },
  { name: "渡劫", color: "#000000", minScore: 10000, desc: "天雷淬体，飞升在即。" },
];

/**
 * 核心修仙算法
 */
export function calculateCultivation(userData) {
  if (!userData) return null;

  const repos = userData.publicRepos || userData.public_repos || 0;
  const followers = userData.followers || 0;
  const following = userData.following || 0;
  const createdAt = userData.createdAt || userData.created_at;
  const createdYear = new Date(createdAt).getFullYear();
  const currentYear = new Date().getFullYear();
  const yearsActive = currentYear - createdYear;
  const id = userData.githubId || userData.id;
  const publicGists = userData.publicGists || userData.public_gists || 0;
  const bio = userData.bio;

  // 1. 修为 (Cultivation)
  const cultivationRaw = (repos * 5) + (yearsActive * 20);
  
  // 2. 名望 (Reputation)
  const reputationRaw = followers * 10;

  // 3. 信众 (Believers)
  const believersRaw = followers;

  // 4. 助阵 (Allies)
  const alliesRaw = following;

  // 5. 因果 (Karma)
  const karmaRaw = (id % 100) + (publicGists * 5);

  // 6. 心魔 (Inner Demon)
  let demonScore = 10; 
  if (!bio) demonScore += 30;
  if (following > 0 && followers / following < 0.1) demonScore += 40;
  if (repos > 100 && followers < 10) demonScore += 20;

  // 归一化
  const normalize = (val, max = 1000) => Math.min(Math.round((Math.log10(val + 1) / Math.log10(max)) * 100), 100);

  const radarData = [
    { subject: '修为', A: normalize(cultivationRaw, 500), value: cultivationRaw, fullMark: 100 },
    { subject: '名望', A: normalize(reputationRaw, 2000), value: reputationRaw, fullMark: 100 },
    { subject: '因果', A: Math.min(karmaRaw, 100), value: karmaRaw, fullMark: 100 },
    { subject: '心魔', A: demonScore, value: demonScore, fullMark: 100 }, 
    { subject: '助阵', A: normalize(alliesRaw, 200), value: alliesRaw, fullMark: 100 },
    { subject: '信众', A: normalize(believersRaw, 500), value: believersRaw, fullMark: 100 },
  ];

  // 总评分
  const totalScore = cultivationRaw + reputationRaw + (yearsActive * 50);
  
  // 判定境界
  let currentRank = RANKS[0];
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalScore >= RANKS[i].minScore) {
      currentRank = RANKS[i];
      break;
    }
  }

  return {
    radarData,
    rank: currentRank,
    yearsActive,
    totalScore,
    raw: { cultivationRaw, reputationRaw }
  };
}
