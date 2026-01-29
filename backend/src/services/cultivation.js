/**
 * 境界常量定义 - 详细版
 * 炼气: 1-9层
 * 筑基及以上: 前期、中期、后期、圆满
 * 大境界间: 半步XX作为过渡
 */
export const RANKS = [
  // 凡境
  { name: "凡境", period: "凡境", color: "#78716c", minScore: 0, desc: "", summary: "" },
  
  // 炼气期 (10-49) - 九层
  { name: "炼气一层", period: "炼气期", color: "#a8a29e", minScore: 10, desc: "", summary: "" },
  { name: "炼气二层", period: "炼气期", color: "#a8a29e", minScore: 14, desc: "", summary: "" },
  { name: "炼气三层", period: "炼气期", color: "#a8a29e", minScore: 18, desc: "", summary: "" },
  { name: "炼气四层", period: "炼气期", color: "#a8a29e", minScore: 23, desc: "", summary: "" },
  { name: "炼气五层", period: "炼气期", color: "#a8a29e", minScore: 28, desc: "", summary: "" },
  { name: "炼气六层", period: "炼气期", color: "#a8a29e", minScore: 33, desc: "", summary: "" },
  { name: "炼气七层", period: "炼气期", color: "#a8a29e", minScore: 38, desc: "", summary: "" },
  { name: "炼气八层", period: "炼气期", color: "#a8a29e", minScore: 43, desc: "", summary: "" },
  { name: "炼气九层", period: "炼气期", color: "#a8a29e", minScore: 48, desc: "", summary: "" },
  
  // 筑基期 (50-149)
  { name: "筑基前期", period: "筑基期", color: "#22c55e", minScore: 50, desc: "", summary: "" },
  { name: "筑基中期", period: "筑基期", color: "#22c55e", minScore: 75, desc: "", summary: "" },
  { name: "筑基后期", period: "筑基期", color: "#22c55e", minScore: 100, desc: "", summary: "" },
  { name: "筑基圆满", period: "筑基期", color: "#22c55e", minScore: 125, desc: "", summary: "" },
  
  // 金丹期 (150-399)
  { name: "半步金丹", period: "金丹期", color: "#3b82f6", minScore: 140, desc: "", summary: "" },
  { name: "金丹前期", period: "金丹期", color: "#3b82f6", minScore: 150, desc: "", summary: "" },
  { name: "金丹中期", period: "金丹期", color: "#3b82f6", minScore: 212, desc: "", summary: "" },
  { name: "金丹后期", period: "金丹期", color: "#3b82f6", minScore: 275, desc: "", summary: "" },
  { name: "金丹圆满", period: "金丹期", color: "#3b82f6", minScore: 337, desc: "", summary: "" },
  
  // 元婴期 (400-999)
  { name: "半步元婴", period: "元婴期", color: "#a855f7", minScore: 380, desc: "", summary: "" },
  { name: "元婴前期", period: "元婴期", color: "#a855f7", minScore: 400, desc: "", summary: "" },
  { name: "元婴中期", period: "元婴期", color: "#a855f7", minScore: 550, desc: "", summary: "" },
  { name: "元婴后期", period: "元婴期", color: "#a855f7", minScore: 700, desc: "", summary: "" },
  { name: "元婴圆满", period: "元婴期", color: "#a855f7", minScore: 850, desc: "", summary: "" },
  
  // 化神期 (1000-2499)
  { name: "半步化神", period: "化神期", color: "#eab308", minScore: 950, desc: "", summary: "" },
  { name: "化神前期", period: "化神期", color: "#eab308", minScore: 1000, desc: "", summary: "" },
  { name: "化神中期", period: "化神期", color: "#eab308", minScore: 1375, desc: "", summary: "" },
  { name: "化神后期", period: "化神期", color: "#eab308", minScore: 1750, desc: "", summary: "" },
  { name: "化神圆满", period: "化神期", color: "#eab308", minScore: 2125, desc: "", summary: "" },
  
  // 炼虚期 (2500-4999)
  { name: "半步炼虚", period: "炼虚期", color: "#f97316", minScore: 2400, desc: "", summary: "" },
  { name: "炼虚前期", period: "炼虚期", color: "#f97316", minScore: 2500, desc: "", summary: "" },
  { name: "炼虚中期", period: "炼虚期", color: "#f97316", minScore: 3125, desc: "", summary: "" },
  { name: "炼虚后期", period: "炼虚期", color: "#f97316", minScore: 3750, desc: "", summary: "" },
  { name: "炼虚圆满", period: "炼虚期", color: "#f97316", minScore: 4375, desc: "", summary: "" },
  
  // 合体期 (5000-9999)
  { name: "半步合体", period: "合体期", color: "#ef4444", minScore: 4900, desc: "", summary: "" },
  { name: "合体前期", period: "合体期", color: "#ef4444", minScore: 5000, desc: "", summary: "" },
  { name: "合体中期", period: "合体期", color: "#ef4444", minScore: 6250, desc: "", summary: "" },
  { name: "合体后期", period: "合体期", color: "#ef4444", minScore: 7500, desc: "", summary: "" },
  { name: "合体圆满", period: "合体期", color: "#ef4444", minScore: 8750, desc: "", summary: "" },
  
  // 渡劫期 (10000+)
  { name: "半步渡劫", period: "渡劫期", color: "#000000", minScore: 9800, desc: "", summary: "" },
  { name: "渡劫前期", period: "渡劫期", color: "#000000", minScore: 10000, desc: "", summary: "" },
  { name: "渡劫中期", period: "渡劫期", color: "#000000", minScore: 15000, desc: "", summary: "" },
  { name: "渡劫后期", period: "渡劫期", color: "#000000", minScore: 20000, desc: "", summary: "" },
  { name: "渡劫圆满", period: "渡劫期", color: "#000000", minScore: 30000, desc: "", summary: "" },
  
  // 飞升
  { name: "飞升", period: "飞升", color: "#ffd700", minScore: 50000, desc: "", summary: "" },
];

// 从静态文件加载描述（支持嵌套结构）
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const descPath = join(__dirname, '../data/realm-descriptions.json');

/**
 * 从嵌套JSON结构中提取所有境界描述和summary
 */
function extractDescriptions(data) {
  const descriptions = {};
  const summaries = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      descriptions[key] = value;
    } else if (typeof value === 'object') {
      // 凡境/飞升 格式: { title, description }
      if (value.title && value.description) {
        descriptions[key] = value.description;
        summaries[key] = value.title; // title 作为 summary
      }
      // 炼气期/筑基期等 格式: { summary, levels: {...} }
      if (value.summary) {
        summaries[key] = value.summary;
      }
      if (value.levels) {
        for (const [levelName, levelDesc] of Object.entries(value.levels)) {
          descriptions[levelName] = levelDesc;
        }
      }
    }
  }
  
  return { descriptions, summaries };
}

if (existsSync(descPath)) {
  try {
    const rawData = JSON.parse(readFileSync(descPath, 'utf-8'));
    const { descriptions, summaries } = extractDescriptions(rawData);
    
    RANKS.forEach(rank => {
      if (descriptions[rank.name]) {
        rank.desc = descriptions[rank.name];
      }
      // 加载大境界的 summary
      if (summaries[rank.period]) {
        rank.summary = summaries[rank.period];
      }
    });
  } catch (e) {
    console.warn('Failed to load realm descriptions:', e.message);
  }
}

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

  // 生成灵根和体质 (基于 ID 哈希，结果稳定)
  const hash = (id * 2654435761) >>> 0; // 简单哈希
  const { lingGen, tiZhi } = generateTraits(hash, repos, followers);

  return {
    radarData,
    rank: currentRank,
    yearsActive,
    totalScore,
    raw: { cultivationRaw, reputationRaw },
    traits: { lingGen, tiZhi }
  };
}

/**
 * 生成灵根和体质
 */
function generateTraits(hash, repos, followers) {
  // 灵根类型
  const elements = ['金', '木', '水', '火', '土'];
  const rareElements = ['雷', '冰', '风', '暗', '光'];
  
  const lingGenRoll = hash % 1000;
  let lingGen;
  
  if (lingGenRoll < 1) { // 0.1% 天灵根
    lingGen = { type: '混沌灵根', quality: '天灵根', color: '#b45309', rare: true };
  } else if (lingGenRoll < 10) { // 0.9% 变异灵根
    const el = rareElements[hash % rareElements.length];
    lingGen = { type: `${el}灵根`, quality: '变异灵根', color: '#a855f7', rare: true };
  } else if (lingGenRoll < 50) { // 4% 单灵根
    const el = elements[hash % elements.length];
    lingGen = { type: `${el}灵根·纯`, quality: '单灵根', color: '#3b82f6', rare: false };
  } else if (lingGenRoll < 150) { // 10% 双灵根
    const el1 = elements[hash % elements.length];
    const el2 = elements[(hash >> 4) % elements.length];
    lingGen = { type: `${el1}${el2}双灵根`, quality: '双灵根', color: '#22c55e', rare: false };
  } else if (lingGenRoll < 350) { // 20% 三灵根
    lingGen = { type: '三灵根', quality: '三灵根', color: '#a8a29e', rare: false };
  } else if (lingGenRoll < 700) { // 35% 杂灵根
    lingGen = { type: '五行杂糟', quality: '杂灵根', color: '#78716c', rare: false };
  } else { // 30% 废灵根
    lingGen = { type: '灵根废绝', quality: '废灵根', color: '#57534e', rare: false };
  }

  // 体质
  const tiZhiRoll = (hash >> 8) % 1000;
  let tiZhi;
  
  if (tiZhiRoll < 10) { // 1% 神话体质
    const mythic = ['先天道体', '混沌之体', '万法之身'];
    tiZhi = { type: mythic[hash % mythic.length], quality: '神话', color: '#b45309' };
  } else if (tiZhiRoll < 50) { // 4% 传说体质
    const legend = ['太阴之体', '纯阳之体', '九阳之体', '天妥之体'];
    tiZhi = { type: legend[hash % legend.length], quality: '传说', color: '#a855f7' };
  } else if (tiZhiRoll < 200) { // 15% 稀有体质
    const rare = ['火灵之体', '木灵之体', '金灵之体', '水灵之体'];
    tiZhi = { type: rare[hash % rare.length], quality: '稀有', color: '#3b82f6' };
  } else if (tiZhiRoll < 500) { // 30% 普通体质
    const common = ['微弱灵体', '凡人之躯', '铁骨之躯'];
    tiZhi = { type: common[hash % common.length], quality: '普通', color: '#a8a29e' };
  } else { // 50% 凡躯
    tiZhi = { type: '资质平庸', quality: '凡躯', color: '#78716c' };
  }

  return { lingGen, tiZhi };
}
