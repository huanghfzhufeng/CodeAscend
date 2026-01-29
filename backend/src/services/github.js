/**
 * 从 GitHub API 获取用户数据
 */
export async function fetchGithubUser(username) {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Xiuxian-App'
  };

  // 如果配置了 GitHub Token，添加到请求头
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`https://api.github.com/users/${username}`, { headers });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('查无此人，该道友尚未在GitHub开宗立派。');
    }
    if (response.status === 403) {
      throw new Error('天机已泄露太多（API限流），请稍后再试。');
    }
    throw new Error('天道紊乱，无法连接。');
  }

  return response.json();
}

/**
 * 将 GitHub API 响应转换为数据库格式
 */
export function transformGithubData(data) {
  return {
    githubId: data.id,
    login: data.login,
    name: data.name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    publicRepos: data.public_repos || 0,
    publicGists: data.public_gists || 0,
    followers: data.followers || 0,
    following: data.following || 0,
    createdAt: new Date(data.created_at),
  };
}
