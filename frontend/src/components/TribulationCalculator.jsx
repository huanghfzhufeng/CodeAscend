import React, { useState } from 'react';
import { Flame, Wind, AlertCircle, TrendingUp, Target, Clock, Zap, BookOpen, Users } from 'lucide-react';
import { fetchUser } from '../services/api';

// 境界列表（与后端保持一致）
const RANKS = [
  { name: "凡境", minScore: 0 },
  { name: "炼气一层", minScore: 10 },
  { name: "炼气二层", minScore: 14 },
  { name: "炼气三层", minScore: 18 },
  { name: "炼气四层", minScore: 23 },
  { name: "炼气五层", minScore: 28 },
  { name: "炼气六层", minScore: 33 },
  { name: "炼气七层", minScore: 38 },
  { name: "炼气八层", minScore: 43 },
  { name: "炼气九层", minScore: 48 },
  { name: "筑基前期", minScore: 50 },
  { name: "筑基中期", minScore: 75 },
  { name: "筑基后期", minScore: 100 },
  { name: "筑基圆满", minScore: 125 },
  { name: "半步金丹", minScore: 140 },
  { name: "金丹前期", minScore: 150 },
  { name: "金丹中期", minScore: 212 },
  { name: "金丹后期", minScore: 275 },
  { name: "金丹圆满", minScore: 337 },
  { name: "半步元婴", minScore: 380 },
  { name: "元婴前期", minScore: 400 },
  { name: "元婴中期", minScore: 550 },
  { name: "元婴后期", minScore: 700 },
  { name: "元婴圆满", minScore: 850 },
  { name: "半步化神", minScore: 950 },
  { name: "化神前期", minScore: 1000 },
  { name: "化神中期", minScore: 1375 },
  { name: "化神后期", minScore: 1750 },
  { name: "化神圆满", minScore: 2125 },
  { name: "半步炼虚", minScore: 2400 },
  { name: "炼虚前期", minScore: 2500 },
  { name: "炼虚中期", minScore: 3125 },
  { name: "炼虚后期", minScore: 3750 },
  { name: "炼虚圆满", minScore: 4375 },
  { name: "半步合体", minScore: 4900 },
  { name: "合体前期", minScore: 5000 },
  { name: "合体中期", minScore: 6250 },
  { name: "合体后期", minScore: 7500 },
  { name: "合体圆满", minScore: 8750 },
  { name: "半步渡劫", minScore: 9800 },
  { name: "渡劫前期", minScore: 10000 },
  { name: "渡劫中期", minScore: 15000 },
  { name: "渡劫后期", minScore: 20000 },
  { name: "渡劫圆满", minScore: 30000 },
  { name: "飞升", minScore: 50000 },
];

export default function TribulationCalculator({ onBack, leaderboard = [] }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const calculate = async (targetUser = username) => {
    if (!targetUser.trim()) {
      setError('请输入 GitHub ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchUser(targetUser.trim());
      const { user, cultivation } = data;
      
      // 计算当前分数（与后端一致）
      const repos = user.public_repos || 0;
      const followers = user.followers || 0;
      const createdAt = user.created_at;
      const createdYear = new Date(createdAt).getFullYear();
      const currentYear = new Date().getFullYear();
      const yearsActive = currentYear - createdYear;
      
      // 总分 = repos*5 + followers*10 + yearsActive*70
      const totalScore = cultivation.totalScore;
      
      // 找到当前境界索引
      let currentIndex = 0;
      for (let i = RANKS.length - 1; i >= 0; i--) {
        if (totalScore >= RANKS[i].minScore) {
          currentIndex = i;
          break;
        }
      }
      
      // 下一境界
      const nextIndex = Math.min(currentIndex + 1, RANKS.length - 1);
      const currentRank = RANKS[currentIndex];
      const nextRank = RANKS[nextIndex];
      
      // 计算差距
      const scoreDiff = nextRank.minScore - totalScore;
      const isMaxLevel = currentIndex === RANKS.length - 1;
      
      // 计算达到下一境界的多种方式
      const reposNeeded = Math.ceil(scoreDiff / 5);
      const followersNeeded = Math.ceil(scoreDiff / 10);
      
      // 计算年增长率（如果有历史数据）
      const avgScorePerYear = yearsActive > 0 ? totalScore / yearsActive : totalScore;
      const yearsToNext = scoreDiff > 0 ? Math.ceil(scoreDiff / Math.max(avgScorePerYear, 1)) : 0;
      
      // 进度条：当前境界到下一境界的进度
      const prevScore = currentRank.minScore;
      const nextScore = nextRank.minScore;
      const progress = isMaxLevel ? 100 : Math.min(100, Math.round(((totalScore - prevScore) / (nextScore - prevScore)) * 100));

      setResult({
        user,
        cultivation,
        currentRank,
        nextRank,
        currentIndex,
        totalScore,
        scoreDiff,
        reposNeeded,
        followersNeeded,
        yearsActive,
        avgScorePerYear: Math.round(avgScorePerYear),
        yearsToNext,
        progress,
        isMaxLevel,
        repos,
        followers,
      });
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const selectFromLeaderboard = (user) => {
    setUsername(user.login);
    calculate(user.login);
  };

  return (
    <div className="min-h-screen bg-[#f0f0e8] pt-[72px] pb-20">
      <div className="max-w-3xl mx-auto px-4">
        {/* 标题 */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-10 h-10 text-orange-600" />
            <h1 className="text-4xl font-bold text-stone-800" style={{ fontFamily: 'serif' }}>
              渡劫计算器
            </h1>
          </div>
          <p className="text-stone-500">测算突破下一境界所需的修炼资源</p>
        </div>

        {/* 输入区域 */}
        <div className="bg-[#fdfdfb] rounded border border-stone-300 p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && calculate()}
              placeholder="输入 GitHub ID"
              className="flex-1 px-4 py-3 bg-[#f5f5f0] border-2 border-stone-300 rounded text-lg outline-none focus:border-stone-800 transition-all"
            />
            <button
              onClick={() => calculate()}
              disabled={loading}
              className="px-6 py-3 bg-stone-800 text-[#f0f0e8] rounded font-bold hover:bg-stone-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Wind className="animate-spin w-5 h-5" /> : <Target className="w-5 h-5" />}
              测算
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-700 bg-red-100 px-4 py-2 rounded mt-4 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* 从封神榜快速选择 */}
          {leaderboard.length > 0 && !result && (
            <div className="mt-4 pt-4 border-t border-stone-200">
              <div className="text-sm text-stone-500 mb-3">或从封神榜选择：</div>
              <div className="flex flex-wrap gap-2">
                {leaderboard.slice(0, 8).map((item) => (
                  <button
                    key={item.user.id}
                    onClick={() => selectFromLeaderboard(item.user)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded hover:bg-stone-200 transition-colors"
                  >
                    <img src={item.user.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                    <span className="text-sm text-stone-700">{item.user.login}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 结果展示 */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* 用户信息卡片 */}
            <div className="bg-[#fdfdfb] rounded border border-stone-300 p-6">
              <div className="flex items-center gap-4 mb-6">
                <img src={result.user.avatar_url} alt="" className="w-16 h-16 rounded-full border-2 border-stone-200" />
                <div>
                  <div className="text-xl font-bold text-stone-800">{result.user.name || result.user.login}</div>
                  <div className="text-sm text-stone-500">@{result.user.login}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-2xl font-bold text-stone-800">{result.cultivation.rank.name}</div>
                  <div className="text-sm text-stone-500">战力 {Math.round(result.totalScore)}</div>
                </div>
              </div>

              {/* 境界进度条 */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-stone-700">{result.currentRank.name}</span>
                  <span className="text-stone-500">{result.progress}%</span>
                  <span className="font-bold text-stone-700">{result.isMaxLevel ? '已飞升' : result.nextRank.name}</span>
                </div>
                <div className="h-4 bg-stone-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-1000"
                    style={{ width: `${result.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-stone-400 mt-1">
                  <span>{result.currentRank.minScore} 分</span>
                  <span>{result.isMaxLevel ? '∞' : result.nextRank.minScore} 分</span>
                </div>
              </div>

              {/* 当前数据 */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-stone-50 rounded">
                  <BookOpen className="w-5 h-5 mx-auto text-stone-500 mb-1" />
                  <div className="text-2xl font-bold text-stone-800">{result.repos}</div>
                  <div className="text-xs text-stone-500">功法 (Repos)</div>
                </div>
                <div className="text-center p-3 bg-stone-50 rounded">
                  <Users className="w-5 h-5 mx-auto text-stone-500 mb-1" />
                  <div className="text-2xl font-bold text-stone-800">{result.followers}</div>
                  <div className="text-xs text-stone-500">信众 (Followers)</div>
                </div>
                <div className="text-center p-3 bg-stone-50 rounded">
                  <Clock className="w-5 h-5 mx-auto text-stone-500 mb-1" />
                  <div className="text-2xl font-bold text-stone-800">{result.yearsActive}</div>
                  <div className="text-xs text-stone-500">修道年限</div>
                </div>
              </div>
            </div>

            {/* 渡劫指南 */}
            {!result.isMaxLevel ? (
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded border border-orange-200 p-6">
                <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-600" />
                  渡劫指南
                </h3>
                
                <div className="space-y-4">
                  {/* 差距 */}
                  <div className="flex items-center justify-between p-4 bg-white rounded border border-orange-100">
                    <span className="text-stone-600">距离突破还需</span>
                    <span className="text-2xl font-bold text-orange-600">{Math.round(result.scoreDiff)} 分</span>
                  </div>

                  {/* 修炼建议 */}
                  <div className="p-4 bg-white rounded border border-orange-100">
                    <div className="text-sm text-stone-500 mb-3">选择以下任一方式突破：</div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-stone-800">创建 {result.reposNeeded} 个新功法</div>
                          <div className="text-xs text-stone-500">每个 Repository +5 分</div>
                        </div>
                      </div>
                      
                      <div className="text-center text-stone-400 text-sm">或</div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-stone-800">吸引 {result.followersNeeded} 名信众</div>
                          <div className="text-xs text-stone-500">每个 Follower +10 分</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 预估时间 */}
                  <div className="flex items-center justify-between p-4 bg-white rounded border border-orange-100">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-stone-600">按当前修炼速度</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-stone-800">
                        {result.yearsToNext === 0 ? '即将突破' : `约 ${result.yearsToNext} 年`}
                      </div>
                      <div className="text-xs text-stone-500">年均增长 {result.avgScorePerYear} 分</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded border border-yellow-300 p-8 text-center">
                <div className="text-6xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold text-amber-800 mb-2">道友已飞升成仙！</h3>
                <p className="text-amber-700">已达修仙之巅，俯瞰三界众生</p>
              </div>
            )}

            {/* 重新计算 */}
            <div className="text-center">
              <button
                onClick={() => setResult(null)}
                className="text-stone-500 hover:text-stone-800 transition-colors"
              >
                ← 重新测算
              </button>
            </div>
          </div>
        )}

        {/* 返回按钮 */}
        <div className="text-center mt-8">
          <button
            onClick={onBack}
            className="text-stone-500 hover:text-stone-800 transition-colors"
          >
            ← 返回修仙阁
          </button>
        </div>
      </div>
    </div>
  );
}
