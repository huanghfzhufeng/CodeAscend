import React, { useState, useEffect, useMemo } from 'react';
import { Search, Scroll, Wind, Sword, Zap, BookOpen, AlertCircle, Trophy, Crown, ExternalLink } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { fetchUser, fetchLeaderboard } from './services/api';

export default function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cultivation, setCultivation] = useState(null);
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  // 墨点背景
  const inkSpots = useMemo(() => Array.from({ length: 5 }).map(() => ({
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
    scale: Math.random() * 0.5 + 0.8,
    rotation: Math.random() * 360,
  })), []);

  // 加载排行榜
  useEffect(() => {
    fetchLeaderboard(20)
      .then(setLeaderboard)
      .catch(console.error);
  }, []);

  const handleSearch = async (targetUser = username) => {
    if (!targetUser.trim()) return;
    
    setLoading(true);
    setError(null);
    setAnimate(false);

    try {
      const result = await fetchUser(targetUser);
      
      setTimeout(() => {
        setUserData(result.user);
        setCultivation(result.cultivation);
        setAnimate(true);
        setLoading(false);
        
        // 刷新排行榜
        fetchLeaderboard(20)
          .then(setLeaderboard)
          .catch(console.error);
      }, 300);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleLeaderboardClick = (user) => {
    setUsername(user.login);
    handleSearch(user.login);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 自定义 Tick 组件
   */
  const CustomTick = ({ payload, x, y, textAnchor }) => {
    if (!cultivation) return null;
    const data = cultivation.radarData.find(d => d.subject === payload.value);
    const value = data ? data.value : 0;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={-5} textAnchor={textAnchor} fill="#44403c" fontSize={14} fontFamily="serif" fontWeight="bold">
          {payload.value}
        </text>
        <text x={0} y={0} dy={12} textAnchor={textAnchor} fill="#15803d" fontSize={13} fontFamily="monospace" fontWeight="bold">
          {value}
        </text>
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f0e8] font-sans text-gray-800 overflow-x-hidden selection:bg-stone-300 pb-20">
      {/* 顶部导航 - 固定在顶部 */}
      <nav className="p-4 flex justify-between items-center border-b border-stone-300 bg-[#e8e8df] fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <Scroll className="w-6 h-6 text-stone-700" />
          <span className="font-bold text-xl tracking-widest text-stone-800">GitHub修仙阁</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-stone-500 hidden md:block">观天之道，执码而行</span>
          <a href="https://github.com/huanghfzhufeng/CodeAscend" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-stone-800 transition-colors" title="GitHub">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
        </div>
      </nav>

      {/* 搜索区域 */}
      <div className="pt-[72px] pb-6">
        <div className="flex flex-col items-center gap-4 max-w-5xl mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-stone-800 tracking-widest text-center" style={{ fontFamily: 'serif' }}>
            测测你的道行
          </h1>
          
          <div className="relative w-full max-w-md group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入 GitHub ID (例如: torvalds)"
              className="w-full px-6 py-3 bg-[#fdfdfb] border-2 border-stone-400 rounded-full text-base outline-none focus:border-stone-800 transition-all shadow-lg placeholder:text-stone-400 text-stone-800"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-5 bg-stone-800 text-[#f0f0e8] rounded-full hover:bg-stone-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Wind className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
              <span className="hidden sm:inline text-sm">探查</span>
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-700 bg-red-100 px-4 py-2 rounded-lg border border-red-200 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 relative">
        {/* 背景装饰 */}
        {inkSpots.map((spot, i) => (
          <div
            key={i}
            className="absolute opacity-5 pointer-events-none select-none blur-xl rounded-full bg-black"
            style={{
              top: spot.top,
              left: spot.left,
              width: '150px',
              height: '150px',
              transform: `scale(${spot.scale}) rotate(${spot.rotation}deg)`,
            }}
          />
        ))}

        {/* 主结果卡片 */}
        {userData && cultivation && (
          <div className={`transition-all duration-1000 transform mb-16 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
<div className="bg-[#fdfdfb] rounded-sm overflow-hidden border border-stone-300 relative">
              <div className="absolute inset-0 opacity-10 pointer-events-none" 
                   style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
              </div>

              {/* 头部信息 */}
              <div className="p-8 pb-0 flex flex-col md:flex-row items-center gap-8 md:gap-12 z-10 relative">
                <div className="relative group shrink-0">
                  <div className="absolute inset-0 bg-stone-800 rounded-full blur group-hover:blur-md transition-all duration-500 opacity-30"></div>
                  <img src={userData.avatar_url} alt="Avatar" className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-stone-200 shadow-inner relative z-10 object-cover bg-stone-200" />
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-stone-800 text-[#f0f0e8] text-xs px-3 py-1 rounded-full shadow-lg border border-[#f0f0e8] z-20 whitespace-nowrap">
                    ID: {userData.id}
                  </div>
                </div>

                <div className="text-center md:text-left flex-1 min-w-0 pt-4 md:pt-0">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-3 mb-3">
                    <h2 className="text-4xl font-bold text-stone-900 leading-none truncate max-w-full" style={{ fontFamily: 'serif' }}>{userData.name || userData.login}</h2>
                    <a 
                      href={`https://github.com/${userData.login}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-stone-500 text-sm italic mb-1 hover:text-stone-800 transition-colors flex items-center gap-1"
                    >
                      @{userData.login}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-stone-600 mb-5">
                     <Sword className="w-4 h-4" />
                     <span>修道年限: {cultivation.yearsActive} 年</span>
                  </div>
                  <p className="text-stone-500 text-sm italic border-l-2 border-stone-300 pl-3 leading-relaxed break-words">
                    "{userData.bio || '此人行事低调，未留只言片语。'}"
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center shrink-0 ml-4">
                   {(() => {
                     // 拆分境界名称: "金丹中期" -> ["金丹", "中期"]
                     const name = cultivation.rank.name;
                     let main = name, sub = '';
                     if (name.startsWith('半步')) {
                       main = '半步'; sub = name.slice(2);
                     } else if (name.match(/^(炼气)(.+层)$/)) {
                       main = '炼气'; sub = name.slice(2);
                     } else if (name.match(/^(.{2})(前期|中期|后期|圆满)$/)) {
                       main = name.slice(0, 2); sub = name.slice(2);
                     }
                     return (
                       <>
                         <div className="text-5xl md:text-6xl font-bold text-stone-800 opacity-90 select-none" style={{ fontFamily: 'serif', writingMode: 'vertical-rl', textOrientation: 'upright' }}>{main}</div>
                         {sub && <div className="text-2xl md:text-3xl font-bold text-stone-600 mt-2 select-none" style={{ fontFamily: 'serif', writingMode: 'vertical-rl', textOrientation: 'upright' }}>{sub}</div>}
                       </>
                     );
                   })()}
                   <div className="mt-3 text-xs text-white bg-stone-800 px-3 py-1 rounded-sm shadow-sm">境界评定</div>
                </div>
              </div>

              {/* 数据可视化区域 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 items-start relative z-10 mt-4">
                <div className="space-y-4">
                  {/* 雷达图 */}
                  <div className="h-[280px] w-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="65%" data={cultivation.radarData}>
                        <PolarGrid stroke="#a8a29e" />
                        <PolarAngleAxis dataKey="subject" tick={<CustomTick />} />
                        <Radar name="修仙属性" dataKey="A" stroke="#57534e" strokeWidth={2} fill="#78716c" fillOpacity={0.6} />
                        <Tooltip contentStyle={{ backgroundColor: '#fdfdfb', borderColor: '#d6d3d1' }} formatter={(value, name, props) => [props.payload.value, name]} />
                      </RadarChart>
                    </ResponsiveContainer>
                    {cultivation.rank.summary && (
                      <div className="absolute -top-2 right-0 md:-right-4 transform rotate-6 z-0 opacity-80">
                        <div className="bg-stone-900 text-[#f0f0e8] px-3 py-1 font-bold text-sm skew-x-[-10deg] shadow-lg whitespace-nowrap" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)' }}>{cultivation.rank.summary}</div>
                      </div>
                    )}
                  </div>
                  
                  {/* 打坐修练模块 - 固定大小 */}
                  {cultivation.traits && (
                    <div className="h-[120px] bg-gradient-to-b from-[#f5f5f0] to-[#e8e8df] rounded border border-stone-300 flex items-center justify-center gap-6 px-4">
                      {/* 灵根 */}
                      <div className="text-center">
                        <div className="text-xs text-stone-500 mb-1">灵根</div>
                        <div className="text-lg font-bold" style={{ color: cultivation.traits.lingGen.color }}>
                          {cultivation.traits.lingGen.type}
                        </div>
                        <div className="text-xs mt-1 px-2 py-0.5 rounded" style={{ backgroundColor: cultivation.traits.lingGen.color + '20', color: cultivation.traits.lingGen.color }}>
                          {cultivation.traits.lingGen.quality}
                        </div>
                      </div>
                      
                      {/* 打坐修仙者 SVG */}
                      <div className="w-16 h-16 flex items-center justify-center opacity-60">
                        <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
                          <circle cx="50" cy="25" r="12" className="text-stone-600"/>
                          <path d="M50 40 C30 45 25 60 25 75 L35 75 L40 55 L50 60 L60 55 L65 75 L75 75 C75 60 70 45 50 40" className="text-stone-600"/>
                          <ellipse cx="50" cy="85" rx="30" ry="8" className="text-stone-400" opacity="0.3"/>
                        </svg>
                      </div>
                      
                      {/* 体质 */}
                      <div className="text-center">
                        <div className="text-xs text-stone-500 mb-1">体质</div>
                        <div className="text-lg font-bold" style={{ color: cultivation.traits.tiZhi.color }}>
                          {cultivation.traits.tiZhi.type}
                        </div>
                        <div className="text-xs mt-1 px-2 py-0.5 rounded" style={{ backgroundColor: cultivation.traits.tiZhi.color + '20', color: cultivation.traits.tiZhi.color }}>
                          {cultivation.traits.tiZhi.quality}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-8 mt-4">
                  <div>
                    <h3 className="text-xl font-bold border-b-2 border-stone-800 inline-block mb-4 pb-1 font-serif">天机阁评语</h3>
                    <p className="text-stone-700 leading-relaxed font-serif text-lg">{cultivation.rank.desc}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
<div className="bg-[#f5f5f0] p-4 rounded border border-stone-200">
                      <div className="text-xs text-stone-500 mb-2 flex items-center gap-1"><BookOpen className="w-3 h-3" /> 功法 (Repos)</div>
                      <div className="text-2xl font-bold text-stone-800">{userData.public_repos} <span className="text-sm font-normal text-stone-500">部</span></div>
                    </div>
                    <div className="bg-[#f5f5f0] p-4 rounded border border-stone-200">
                      <div className="text-xs text-stone-500 mb-2 flex items-center gap-1"><Zap className="w-3 h-3" /> 信徒 (Followers)</div>
                      <div className="text-2xl font-bold text-stone-800">{userData.followers} <span className="text-sm font-normal text-stone-500">人</span></div>
                    </div>
                    <div className="bg-[#f5f5f0] p-4 rounded border border-stone-200">
                      <div className="text-xs text-stone-500 mb-2 flex items-center gap-1"><Wind className="w-3 h-3" /> 道侣 (Following)</div>
                      <div className="text-2xl font-bold text-stone-800">{userData.following} <span className="text-sm font-normal text-stone-500">人</span></div>
                    </div>
                     <div className="bg-[#f5f5f0] p-4 rounded border border-stone-200">
                      <div className="text-xs text-stone-500 mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> 心魔值</div>
                      <div className={`text-2xl font-bold ${cultivation.radarData[3].A > 50 ? 'text-red-600' : 'text-green-700'}`}>
                        {cultivation.radarData[3].A} <span className="text-sm font-normal text-stone-400">/ 100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 封神榜区域 */}
        {leaderboard.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <h2 className="text-3xl font-bold text-stone-800 font-serif">封神榜 · 仙友录</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leaderboard.map((item, index) => (
                <div 
                  key={item.user.id}
                  onClick={() => handleLeaderboardClick(item.user)}
                  className={`bg-[#fdfdfb] p-4 rounded border border-stone-300 hover:border-stone-500 transition-all cursor-pointer relative overflow-hidden group ${userData && userData.id === item.user.id ? 'ring-2 ring-stone-800' : ''}`}
                >
                  {/* 排名标识 */}
                  <div className="absolute top-0 right-0 p-2">
                    {index === 0 && <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />}
                    {index === 1 && <Crown className="w-6 h-6 text-stone-400 fill-stone-400" />}
                    {index === 2 && <Crown className="w-6 h-6 text-orange-400 fill-orange-400" />}
                    {index > 2 && <span className="text-2xl font-bold text-stone-200 font-serif italic">#{index + 1}</span>}
                  </div>

                  <div className="flex items-center gap-4">
                    <img src={item.user.avatar_url} alt="avatar" className="w-16 h-16 rounded-full border-2 border-stone-200 bg-stone-200 object-cover" />
                    <div>
                      <div className="font-bold text-stone-800 text-lg truncate w-32">{item.user.name || item.user.login}</div>
                      <div className="text-xs text-stone-500 mb-1">@{item.user.login}</div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-stone-800 text-[#f0f0e8] text-xs rounded-sm">
                          {item.stats.rank.name}
                        </span>
                        <span className="text-xs text-stone-400">
                          战力 {Math.floor(item.stats.totalScore)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 悬停时的提示 */}
                  <div className="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-xs bg-white px-2 py-1 rounded shadow text-stone-800 font-bold">查看详情</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
