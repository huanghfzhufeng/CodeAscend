import React, { useState, useRef } from 'react';
import { Swords, Wind, AlertCircle, Share2, Trophy, Download, Users } from 'lucide-react';
import { fetchUser } from '../services/api';
import html2canvas from 'html2canvas';

const ATTRIBUTES = [
  { key: 'xiuwei', name: '修为', index: 0 },
  { key: 'mingwang', name: '名望', index: 1 },
  { key: 'xinzhong', name: '信众', index: 2 },
  { key: 'yinguo', name: '因果', index: 3 },
  { key: 'zhuzhen', name: '助阵', index: 4 },
  { key: 'xinmo', name: '心魔', index: 5, reverse: true }, // 心魔越低越好
];

export default function BattleArena({ onBack, leaderboard = [] }) {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [battlePhase, setBattlePhase] = useState(0); // 0: 未开始, 1-6: 各属性对决, 7: 结果
  const [currentRound, setCurrentRound] = useState(0);
  const [selectingFor, setSelectingFor] = useState(null); // 'player1' | 'player2' | null
  const battleCardRef = useRef(null);

  const startBattle = async () => {
    if (!player1.trim() || !player2.trim()) {
      setError('请输入两位道友的 GitHub ID');
      return;
    }
    if (player1.trim().toLowerCase() === player2.trim().toLowerCase()) {
      setError('不可与自己斗法！');
      return;
    }

    setLoading(true);
    setError(null);
    setBattleResult(null);
    setBattlePhase(0);
    setCurrentRound(0);

    try {
      const [result1, result2] = await Promise.all([
        fetchUser(player1.trim()),
        fetchUser(player2.trim())
      ]);

      const battle = {
        player1: { user: result1.user, cultivation: result1.cultivation },
        player2: { user: result2.user, cultivation: result2.cultivation },
        rounds: [],
        winner: null,
        score: { p1: 0, p2: 0 }
      };

      // 计算每轮对决
      ATTRIBUTES.forEach((attr) => {
        const v1 = result1.cultivation.radarData[attr.index].A;
        const v2 = result2.cultivation.radarData[attr.index].A;
        
        let winner;
        if (attr.reverse) {
          // 心魔：值越低越好
          winner = v1 < v2 ? 1 : v1 > v2 ? 2 : 0;
        } else {
          winner = v1 > v2 ? 1 : v1 < v2 ? 2 : 0;
        }
        
        if (winner === 1) battle.score.p1++;
        if (winner === 2) battle.score.p2++;
        
        battle.rounds.push({
          attr: attr.name,
          v1,
          v2,
          winner,
          reverse: attr.reverse
        });
      });

      // 判定最终胜负
      if (battle.score.p1 > battle.score.p2) {
        battle.winner = 1;
      } else if (battle.score.p2 > battle.score.p1) {
        battle.winner = 2;
      } else {
        // 平局时比较总分
        const total1 = result1.cultivation.totalScore;
        const total2 = result2.cultivation.totalScore;
        battle.winner = total1 > total2 ? 1 : total1 < total2 ? 2 : 0;
      }

      setBattleResult(battle);
      setLoading(false);

      // 开始动画
      startBattleAnimation();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const startBattleAnimation = () => {
    setBattlePhase(1);
    let round = 0;
    
    const timer = setInterval(() => {
      round++;
      setCurrentRound(round);
      
      if (round >= 6) {
        clearInterval(timer);
        setTimeout(() => {
          setBattlePhase(7);
        }, 800);
      }
    }, 600);
  };

  const selectFromLeaderboard = (user) => {
    if (selectingFor === 'player1') {
      setPlayer1(user.login);
    } else if (selectingFor === 'player2') {
      setPlayer2(user.login);
    }
    setSelectingFor(null);
  };

  const shareBattle = () => {
    if (!battleResult) return;
    
    const p1Name = battleResult.player1.user.name || battleResult.player1.user.login;
    const p2Name = battleResult.player2.user.name || battleResult.player2.user.login;
    const winnerName = battleResult.winner === 1 ? p1Name : battleResult.winner === 2 ? p2Name : '平手';
    
    const text = `⚔️ GitHub修仙阁 · 斗法场\n\n${p1Name}（${battleResult.player1.cultivation.rank.name}）\n  VS\n${p2Name}（${battleResult.player2.cultivation.rank.name}）\n\n🏆 ${battleResult.winner === 0 ? '势均力敌，不分胜负！' : `${winnerName} 胜出！`}\n\n比分：${battleResult.score.p1} : ${battleResult.score.p2}\n\n来试试你的道行 👉 https://github.com/huanghfzhufeng/CodeAscend`;
    
    navigator.clipboard.writeText(text).then(() => {
      alert('战报已复制到剪贴板！');
    });
  };

  const exportImage = async () => {
    if (!battleCardRef.current) return;
    
    try {
      const canvas = await html2canvas(battleCardRef.current, {
        backgroundColor: '#f0f0e8',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      const link = document.createElement('a');
      link.download = `斗法-${battleResult.player1.user.login}-vs-${battleResult.player2.user.login}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('导出失败，请重试');
    }
  };

  const resetBattle = () => {
    setBattleResult(null);
    setBattlePhase(0);
    setCurrentRound(0);
  };

  return (
    <div className="min-h-screen bg-[#f0f0e8] pt-[72px] pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* 标题 */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Swords className="w-10 h-10 text-stone-700" />
            <h1 className="text-4xl font-bold text-stone-800" style={{ fontFamily: 'serif' }}>
              斗法场
            </h1>
          </div>
          <p className="text-stone-500">以代码论道，凭修为定胜负</p>
        </div>

        {/* 输入区域 */}
        {!battleResult && (
          <div className="bg-[#fdfdfb] rounded border border-stone-300 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              {/* 玩家1 */}
              <div className="flex-1 w-full">
                <label className="block text-sm text-stone-500 mb-2 text-center">道友甲</label>
                <div className="relative">
                  <input
                    type="text"
                    value={player1}
                    onChange={(e) => setPlayer1(e.target.value)}
                    placeholder="GitHub ID"
                    className="w-full px-4 py-3 bg-[#f5f5f0] border-2 border-stone-300 rounded text-center text-lg outline-none focus:border-stone-800 transition-all"
                  />
                  {leaderboard.length > 0 && (
                    <button
                      onClick={() => setSelectingFor(selectingFor === 'player1' ? null : 'player1')}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded transition-colors ${
                        selectingFor === 'player1' ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                      }`}
                      title="从封神榜选择"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* VS */}
              <div className="text-3xl font-bold text-stone-400 my-2 md:my-0">VS</div>

              {/* 玩家2 */}
              <div className="flex-1 w-full">
                <label className="block text-sm text-stone-500 mb-2 text-center">道友乙</label>
                <div className="relative">
                  <input
                    type="text"
                    value={player2}
                    onChange={(e) => setPlayer2(e.target.value)}
                    placeholder="GitHub ID"
                    className="w-full px-4 py-3 bg-[#f5f5f0] border-2 border-stone-300 rounded text-center text-lg outline-none focus:border-stone-800 transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && startBattle()}
                  />
                  {leaderboard.length > 0 && (
                    <button
                      onClick={() => setSelectingFor(selectingFor === 'player2' ? null : 'player2')}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded transition-colors ${
                        selectingFor === 'player2' ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                      }`}
                      title="从封神榜选择"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 封神榜选择列表 */}
            {selectingFor && leaderboard.length > 0 && (
              <div className="mt-4 p-4 bg-stone-100 rounded border border-stone-200">
                <div className="text-sm text-stone-500 mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  点击选择{selectingFor === 'player1' ? '道友甲' : '道友乙'}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {leaderboard.map((item) => (
                    <button
                      key={item.user.id}
                      onClick={() => selectFromLeaderboard(item.user)}
                      className="flex items-center gap-2 p-2 bg-white rounded border border-stone-200 hover:border-stone-500 hover:bg-stone-50 transition-all text-left"
                    >
                      <img src={item.user.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-stone-800 truncate">{item.user.login}</div>
                        <div className="text-xs text-stone-500">{item.stats.rank.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center gap-2 text-red-700 bg-red-100 px-4 py-2 rounded mt-4 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              onClick={startBattle}
              disabled={loading}
              className="w-full mt-6 py-4 bg-stone-800 text-[#f0f0e8] rounded font-bold text-lg hover:bg-stone-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Wind className="animate-spin w-5 h-5" />
                  神识探查中...
                </>
              ) : (
                <>
                  <Swords className="w-5 h-5" />
                  开始斗法
                </>
              )}
            </button>
          </div>
        )}

        {/* 战斗结果 */}
        {battleResult && (
          <div ref={battleCardRef} className="bg-[#fdfdfb] rounded border border-stone-300 overflow-hidden">
            {/* 头部：双方信息 */}
            <div className="flex items-stretch border-b border-stone-200">
              {/* 玩家1 */}
              <div className={`flex-1 p-6 text-center ${battlePhase === 7 && battleResult.winner === 1 ? 'bg-amber-50' : ''}`}>
                <img 
                  src={battleResult.player1.user.avatar_url} 
                  alt="avatar" 
                  className="w-20 h-20 rounded-full border-4 border-stone-200 mx-auto mb-3"
                />
                <div className="font-bold text-xl text-stone-800 truncate">
                  {battleResult.player1.user.name || battleResult.player1.user.login}
                </div>
                <div className="text-sm text-stone-500 mb-2">@{battleResult.player1.user.login}</div>
                <div className="inline-block px-3 py-1 bg-stone-800 text-[#f0f0e8] text-sm rounded">
                  {battleResult.player1.cultivation.rank.name}
                </div>
                {battlePhase === 7 && battleResult.winner === 1 && (
                  <div className="mt-3 flex items-center justify-center gap-1 text-amber-600 font-bold">
                    <Trophy className="w-5 h-5" />
                    胜
                  </div>
                )}
              </div>

              {/* 中间比分 */}
              <div className="flex flex-col items-center justify-center px-6 bg-stone-100">
                <div className="text-4xl font-bold text-stone-800">
                  {battlePhase >= 7 ? battleResult.score.p1 : currentRound > 0 ? 
                    battleResult.rounds.slice(0, currentRound).filter(r => r.winner === 1).length : 0}
                  <span className="text-stone-400 mx-2">:</span>
                  {battlePhase >= 7 ? battleResult.score.p2 : currentRound > 0 ?
                    battleResult.rounds.slice(0, currentRound).filter(r => r.winner === 2).length : 0}
                </div>
                {battlePhase < 7 && battlePhase > 0 && (
                  <div className="text-sm text-stone-500 mt-2 animate-pulse">对决中...</div>
                )}
              </div>

              {/* 玩家2 */}
              <div className={`flex-1 p-6 text-center ${battlePhase === 7 && battleResult.winner === 2 ? 'bg-amber-50' : ''}`}>
                <img 
                  src={battleResult.player2.user.avatar_url} 
                  alt="avatar" 
                  className="w-20 h-20 rounded-full border-4 border-stone-200 mx-auto mb-3"
                />
                <div className="font-bold text-xl text-stone-800 truncate">
                  {battleResult.player2.user.name || battleResult.player2.user.login}
                </div>
                <div className="text-sm text-stone-500 mb-2">@{battleResult.player2.user.login}</div>
                <div className="inline-block px-3 py-1 bg-stone-800 text-[#f0f0e8] text-sm rounded">
                  {battleResult.player2.cultivation.rank.name}
                </div>
                {battlePhase === 7 && battleResult.winner === 2 && (
                  <div className="mt-3 flex items-center justify-center gap-1 text-amber-600 font-bold">
                    <Trophy className="w-5 h-5" />
                    胜
                  </div>
                )}
              </div>
            </div>

            {/* 各属性对决 */}
            <div className="p-6">
              <div className="space-y-3">
                {battleResult.rounds.map((round, index) => {
                  const isActive = currentRound > index;
                  const isCurrentRound = currentRound === index + 1 && battlePhase < 7;
                  
                  return (
                    <div 
                      key={index}
                      className={`flex items-center gap-4 p-3 rounded transition-all duration-300 ${
                        isCurrentRound ? 'bg-amber-100 scale-105' : 
                        isActive ? 'bg-stone-50' : 'bg-stone-50 opacity-30'
                      }`}
                    >
                      {/* 玩家1数值 */}
                      <div className={`flex-1 text-right font-bold text-xl ${
                        isActive && round.winner === 1 ? 'text-green-600' : 
                        isActive && round.winner === 2 ? 'text-red-500' : 'text-stone-800'
                      }`}>
                        {isActive ? round.v1 : '?'}
                        {isActive && round.winner === 1 && <span className="ml-2 text-green-500">✓</span>}
                      </div>

                      {/* 属性名 */}
                      <div className={`w-20 text-center py-2 rounded font-bold ${
                        isCurrentRound ? 'bg-amber-500 text-white animate-pulse' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {round.attr}
                        {round.reverse && <span className="text-xs block">↓越低越好</span>}
                      </div>

                      {/* 玩家2数值 */}
                      <div className={`flex-1 text-left font-bold text-xl ${
                        isActive && round.winner === 2 ? 'text-green-600' : 
                        isActive && round.winner === 1 ? 'text-red-500' : 'text-stone-800'
                      }`}>
                        {isActive && round.winner === 2 && <span className="mr-2 text-green-500">✓</span>}
                        {isActive ? round.v2 : '?'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 最终结果 */}
              {battlePhase === 7 && (
                <div className="mt-8 text-center animate-fade-in">
                  <div className="text-3xl font-bold mb-4" style={{ fontFamily: 'serif' }}>
                    {battleResult.winner === 0 ? (
                      <span className="text-stone-600">⚖️ 势均力敌，不分胜负</span>
                    ) : battleResult.winner === 1 ? (
                      <span className="text-amber-600">
                        🏆 {battleResult.player1.user.name || battleResult.player1.user.login} 胜出！
                      </span>
                    ) : (
                      <span className="text-amber-600">
                        🏆 {battleResult.player2.user.name || battleResult.player2.user.login} 胜出！
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={exportImage}
                      className="px-5 py-3 bg-amber-600 text-white rounded font-bold hover:bg-amber-700 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      保存图片
                    </button>
                    <button
                      onClick={shareBattle}
                      className="px-5 py-3 bg-stone-800 text-[#f0f0e8] rounded font-bold hover:bg-stone-700 transition-colors flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      复制文字
                    </button>
                    <button
                      onClick={resetBattle}
                      className="px-5 py-3 bg-stone-200 text-stone-800 rounded font-bold hover:bg-stone-300 transition-colors flex items-center gap-2"
                    >
                      <Swords className="w-4 h-4" />
                      再来一局
                    </button>
                  </div>
                </div>
              )}
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
