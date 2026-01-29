# GitHub修仙阁 (CodeAscend)

> 观天之道，执码而行

基于 GitHub 用户数据计算「修仙境界」的趣味应用。查看你的 GitHub 战力，登上封神榜！

A fun application that calculates your "Cultivation Realm" based on GitHub profile data. Check your GitHub power level and climb the leaderboard!

## ✨ 功能特色

### 🎯 道行测试
- 输入 GitHub ID，获取你的修仙境界
- 六维属性雷达图（修为/名望/信众/因果/助阵/心魔）
- 灵根 & 体质系统（基于用户ID哈希生成）
- 凡人修仙传风格的境界描述

### ⚔️ 斗法场
- 两位道友六维属性 PK 对决
- 动态战斗动画，逐轮揭晓结果
- 支持从封神榜直接选择用户
- 导出战报图片 / 复制文字分享

### 🔥 渡劫计算器
- 计算到达下一境界所需分数
- 境界进度条可视化
- 突破建议（需要 X 个 Repo 或 X 个 Follower）
- 预估突破时间

### 🏆 封神榜
- 全服战力排行
- 点击查看详情

## 📸 Screenshots

### 主界面 - 道行测试
![主界面截图](./frontend/coi/Snipaste_2026-01-29_21-36-31.png)

### 境界详情
![境界详情](./frontend/coi/image.png)

### 斗法场
![斗法场](./frontend/coi/image%20copy.png)

### 渡劫计算器
![渡劫计算器](./frontend/coi/image%20copy%202.png)

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

## 🌟 境界等级

本应用采用 **45 级详细境界系统**：

| 大境界 | 细分等级 | 分数范围 |
|--------|----------|----------|
| 凡境 | - | 0-9 |
| 炼气期 | 1-9层 | 10-49 |
| 筑基期 | 前期/中期/后期/圆满 | 50-149 |
| 金丹期 | 半步金丹 + 前/中/后/圆满 | 140-399 |
| 元婴期 | 半步元婴 + 前/中/后/圆满 | 380-999 |
| 化神期 | 半步化神 + 前/中/后/圆满 | 950-2499 |
| 炼虚期 | 半步炼虚 + 前/中/后/圆满 | 2400-4999 |
| 合体期 | 半步合体 + 前/中/后/圆满 | 4900-9999 |
| 渡劫期 | 半步渡劫 + 前/中/后/圆满 | 9800-49999 |
| 飞升 | - | 50000+ |

### 灵根系统

| 灵根类型 | 概率 |
|----------|------|
| 天灵根 | 0.1% |
| 变异灵根 | 0.9% |
| 单灵根 | 4% |
| 双灵根 | 10% |
| 三灵根 | 20% |
| 杂灵根 | 35% |
| 废灵根 | 30% |
