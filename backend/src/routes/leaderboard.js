import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { calculateCultivation } from '../services/cultivation.js';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/leaderboard
 * 获取封神榜排行
 */
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    // 获取所有用户，按最高分排序
    const users = await prisma.githubUser.findMany({
      include: {
        cultivationRecords: {
          orderBy: { totalScore: 'desc' },
          take: 1
        }
      }
    });

    // 计算并排序
    const leaderboard = users
      .map(user => {
        const cultivation = calculateCultivation(user);
        return {
          user: {
            id: user.githubId,
            login: user.login,
            name: user.name,
            avatar_url: user.avatarUrl,
          },
          stats: {
            totalScore: cultivation.totalScore,
            rank: cultivation.rank,
            yearsActive: cultivation.yearsActive
          }
        };
      })
      .sort((a, b) => b.stats.totalScore - a.stats.totalScore)
      .slice(0, limit);

    res.json({
      success: true,
      data: leaderboard,
      total: users.length
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: '获取封神榜失败'
    });
  }
});

/**
 * GET /api/history
 * 获取最近搜索记录
 */
router.get('/history', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);

    const history = await prisma.searchHistory.findMany({
      orderBy: { searchedAt: 'desc' },
      take: limit,
      include: {
        githubUser: {
          select: {
            githubId: true,
            login: true,
            name: true,
            avatarUrl: true,
          }
        }
      }
    });

    // 去重（同一用户只显示最近一次）
    const seen = new Set();
    const uniqueHistory = history.filter(item => {
      if (seen.has(item.githubUser.githubId)) return false;
      seen.add(item.githubUser.githubId);
      return true;
    });

    const result = uniqueHistory.map(item => ({
      user: {
        id: item.githubUser.githubId,
        login: item.githubUser.login,
        name: item.githubUser.name,
        avatar_url: item.githubUser.avatarUrl,
      },
      searchedAt: item.searchedAt
    }));

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      error: '获取历史记录失败'
    });
  }
});

/**
 * GET /api/stats
 * 获取统计数据
 */
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalSearches, rankStats] = await Promise.all([
      prisma.githubUser.count(),
      prisma.searchHistory.count(),
      prisma.cultivationRecord.groupBy({
        by: ['rankName'],
        _count: { rankName: true }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSearches,
        rankDistribution: rankStats.map(r => ({
          rank: r.rankName,
          count: r._count.rankName
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: '获取统计数据失败'
    });
  }
});

export default router;
