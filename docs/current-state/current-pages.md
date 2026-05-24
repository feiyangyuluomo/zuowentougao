# 当前页面清单

## 前台页面 (`/(main)`)

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 平台入口页 |
| 登录 | `/login` | 用户登录 |
| 注册 | `/register` | 用户注册 |
| 活动库 | `/activities` | 征稿活动列表 |
| 活动详情 | `/activities/[id]` | 单个活动详情 |
| AI投稿助手 | `/ai-assistant` | AI分析推荐活动 |
| 作文批改 | `/essays` | 用户作文管理 |
| 自主投稿记录 | `/self-submissions` | 用户自主投稿记录 |
| 新建自主投稿 | `/self-submissions/new` | 创建新的自主投稿 |
| 平台代投记录 | `/agent-submissions` | 代投状态查看 |
| 新建平台代投 | `/agent-submissions/new` | 申请平台代投 |
| 平台代投详情 | `/agent-submissions/[id]` | 查看代投任务详情 |
| 成长档案 | `/growth-records` | 用户/学生成长记录 |
| 会员服务 | `/membership` | 会员权益介绍 |
| 媒体库 | `/media-library` | 征稿方展示列表 |
| 媒体库征稿方详情 | `/media-library/publishers/[id]` | 单个征稿方详情 |
| 我的孩子/学生管理 | `/students` | 学生列表 |

## 工作台页面 (`/workspace`)

| 页面 | 路由 | 可见角色 |
|------|------|----------|
| 工作台首页 | `/workspace` | 全部身份 |
| 班级管理 | `/workspace/classes` | organization_admin, organization_teacher |
| 班级详情 | `/workspace/classes/[id]` | organization_admin, organization_teacher |
| 学生管理 | `/workspace/students` | parent(我的孩子), teacher, organization_admin, organization_teacher |
| 学生详情 | `/workspace/students/[id]` | 根据归属校验 |
| 老师管理 | `/workspace/teachers` | organization_admin |
| 老师详情 | `/workspace/teachers/[id]` | organization_admin |
| 作文管理 | `/workspace/essays` | parent, teacher, organization_admin, organization_teacher |
| 批量上传作文 | `/workspace/essays/batch` | teacher, organization_admin, organization_teacher |
| 投稿记录 | `/workspace/submissions` | parent, teacher, organization_admin, organization_teacher |
| 批量上传投稿 | `/workspace/submissions/batch` | teacher, organization_admin, organization_teacher |
| 成长档案 | `/workspace/growth-records` | 全部身份 |
| 数据统计 | `/workspace/statistics` | teacher, organization_admin, organization_teacher |
| 我的订单 | `/workspace/orders` | parent, teacher |
| 机构订单 | `/workspace/organization-orders` | organization_admin |

## 管理后台 (`/admin`)

| 页面 | 路由 | 说明 |
|------|------|------|
| 平台代投任务池 | `/admin/agent-submissions` | 运营查看所有代投任务 |

## 编辑工作台 (`/editor`)

当前未发现具体页面实现。

## 页面组件结构

### 前台布局 `(main)/layout.tsx`

```
Header (顶部导航)
  └── Logo + 平台名称
  └── MAIN_MENU (主导航)
  └── CTA按钮 (申请平台代投)
  └── 用户头像菜单
└── {children}
└── Footer (页脚)
```

### 工作台布局 `workspace/layout.tsx`

```
Sidebar (侧边栏)
  └── Logo + 我的工作台
  └── 身份标签
  └── WORKSPACE_MENU (工作台菜单)
└── Main Content
```

## 页面状态处理模式

### 1. 身份校验 + 空状态

```typescript
export default function SomePage() {
  const { currentIdentity } = useAuthStore();

  if (!canAccessWorkspace(currentIdentity)) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            您没有权限访问此页面
          </div>
        </CardContent>
      </Card>
    );
  }

  // 正常页面内容
  return ( ... );
}
```

### 2. 列表页空状态

```typescript
if (items.length === 0) {
  return (
    <EmptyState
      variant="no-data"
      title="暂无xxx"
      description="还没有任何xxx记录"
      action={{ label: "新建", onClick: () => {} }}
    />
  );
}
```

### 3. 加载状态

使用 `Suspense` + `loading.tsx` 配合实现路由级别加载状态。

## 路由组结构

```
src/app/
├── (main)/                    # 前台页面（游客/用户）
│   ├── layout.tsx             # 前台布局（Header + Footer）
│   ├── activities/
│   ├── ai-assistant/
│   ├── essays/
│   ├── self-submissions/
│   ├── agent-submissions/
│   ├── growth-records/
│   ├── media-library/
│   └── membership/
├── workspace/                 # 工作台（需要登录身份）
│   ├── layout.tsx             # 工作台布局（侧边栏）
│   ├── page.tsx               # 工作台首页
│   ├── classes/
│   ├── students/
│   ├── teachers/
│   ├── essays/
│   ├── submissions/
│   ├── growth-records/
│   ├── statistics/
│   ├── orders/
│   └── organization-orders/
├── admin/                     # 管理后台
│   └── agent-submissions/
└── editor/                    # 编辑工作台（预留）
```