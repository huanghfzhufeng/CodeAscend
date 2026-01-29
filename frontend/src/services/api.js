const API_BASE = '/api';

/**
 * 查询用户修仙数据
 */
export async function fetchUser(username) {
  const response = await fetch(`${API_BASE}/users/${username}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || '查询失败');
  }
  
  return data.data;
}

/**
 * 获取封神榜
 */
export async function fetchLeaderboard(limit = 50) {
  const response = await fetch(`${API_BASE}/leaderboard?limit=${limit}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || '获取排行榜失败');
  }
  
  return data.data;
}

/**
 * 获取搜索历史
 */
export async function fetchHistory(limit = 20) {
  const response = await fetch(`${API_BASE}/leaderboard/history?limit=${limit}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || '获取历史记录失败');
  }
  
  return data.data;
}

/**
 * 获取统计数据
 */
export async function fetchStats() {
  const response = await fetch(`${API_BASE}/leaderboard/stats`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || '获取统计数据失败');
  }
  
  return data.data;
}
