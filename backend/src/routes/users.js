import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { fetchGithubUser, transformGithubData } from '../services/github.js';
import { calculateCultivation } from '../services/cultivation.js';

const router = Router();
const prisma = new PrismaClient();

// 缓存过期时间 (1小时)
const CACHE_TTL = 60 * 60 * 1000;

/**
 * GET /api/users/:username
 * 查询用户修仙数据
 */
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';

    // 1. 先查缓存
    let user = await prisma.githubUser.findFirst({
      where: { login: { equals: username, mode: 'insensitive' } }
    });

    const now = new Date();
    const needRefresh = !user || (now.getTime() - user.fetchedAt.getTime() > CACHE_TTL);

    // 2. 缓存不存在或过期，从 GitHub 获取
    if (needRefresh) {
      const githubData = await fetchGithubUser(username);
      const transformed = transformGithubData(githubData);

      if (user) {
        // 更新现有记录
        user = await prisma.githubUser.update({
          where: { id: user.id },
          data: { ...transformed, fetchedAt: now }
        });
      } else {
        // 创建新记录
        user = await prisma.githubUser.create({
          data: { ...transformed, fetchedAt: now }
        });
      }
    }

    // 3. 计算修仙数据
    const cultivation = calculateCultivation(user);

    // 4. 保存修仙记录
    await prisma.cultivationRecord.create({
      data: {
        githubUserId: user.id,
        totalScore: cultivation.totalScore,
        rankName: cultivation.rank.name,
        cultivationRaw: cultivation.raw.cultivationRaw,
        reputationRaw: cultivation.raw.reputationRaw,
        yearsActive: cultivation.yearsActive,
      }
    });

    // 5. 记录搜索历史
    await prisma.searchHistory.create({
      data: {
        githubUserId: user.id,
        ipAddress: clientIp.substring(0, 50)
      }
    });

    // 6. 返回数据
    res.json({
      success: true,
      data: {
        user: {
          id: user.githubId,
          login: user.login,
          name: user.name,
          avatar_url: user.avatarUrl,
          bio: user.bio,
          public_repos: user.publicRepos,
          public_gists: user.publicGists,
          followers: user.followers,
          following: user.following,
          created_at: user.createdAt,
        },
        cultivation
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(error.message.includes('查无此人') ? 404 : 500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
