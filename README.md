# CodeAscend

> Rise Through Code, Ascend Your Realm

基于 GitHub 用户数据计算「修仙境界」的趣味应用。查看你的 GitHub 战力，登上封神榜！

A fun application that calculates your "Cultivation Realm" based on GitHub profile data. Check your GitHub power level and climb the leaderboard!

## Screenshots

### Main - Realm Test
![主界面截图](./frontend/coi/Snipaste_2026-01-29_21-36-31.png)

### Leaderboard
![封神榜截图](./frontend/coi/Snipaste_2026-01-29_21-36-44.png)

## 技术栈

- **前端**: React + Vite + TailwindCSS + Recharts
- **后端**: Node.js + Express + Prisma
- **数据库**: PostgreSQL

## 快速开始

### 方式一：本地开发

#### 1. 启动数据库
确保本地已安装 PostgreSQL，创建数据库：
```sql
CREATE DATABASE github_xiuxian;
```

#### 2. 启动后端
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

#### 3. 启动前端
```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:5173

### 方式二：Docker 部署

```bash
# 一键启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

访问 http://localhost

## 环境变量

### 后端 (.env)
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/github_xiuxian"
PORT=3001
GITHUB_TOKEN=""  # 可选，用于提高 API 限制
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/users/:username | 查询用户修仙数据 |
| GET | /api/leaderboard | 获取封神榜排行 |
| GET | /api/leaderboard/history | 获取搜索历史 |
| GET | /api/leaderboard/stats | 获取统计数据 |

## 境界等级

| 境界 | 最低评分 | 描述 |
|------|----------|------|
| 凡人 | 0 | 初涉江湖，代码未成行 |
| 炼气 | 10 | 引气入体，Hello World |
| 筑基 | 50 | 道基初成，逻辑自洽 |
| 金丹 | 150 | 金丹大成，架构初现 |
| 元婴 | 400 | 元神出窍，全栈皆通 |
| 化神 | 1000 | 神念通达，开源领袖 |
| 炼虚 | 2500 | 虚空造物，框架之主 |
| 合体 | 5000 | 身化万千，万星敬仰 |
| 渡劫 | 10000 | 天雷淬体，飞升在即 |