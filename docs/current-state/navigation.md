# 当前导航结构

## 顶部导航 (Header)

### Logo区域
- Logo + "作文投稿平台"
- 点击跳转首页 `/`

### 主导航菜单 (MAIN_MENU)
| 菜单项 | 路由 | 说明 |
|--------|------|------|
| 首页 | `/` | 平台首页 |
| 活动库 | `/activities` | 征稿活动列表 |
| 媒体库 | `/media-library` | 征稿方展示 |
| AI投稿助手 | `/ai-assistant` | AI分析推荐 |
| 作文批改 | `/essay-revision` | 作文批改服务 |
| 会员服务 | `/membership` | 会员权益 |

### 申请平台代投 CTA 按钮
- 路由：`/agent-submissions/new`
- 样式：outline按钮，border-primary

### 用户头像菜单
根据登录状态显示不同内容：

#### 未登录状态
- 登录按钮 → `/login`
- 注册按钮 → `/register`

#### 已登录状态
- 用户头像（显示VIP标识如果开通会员）
- 下拉菜单包含：
  - 用户昵称
  - 会员状态提示
  - 我的工作台（根据身份显示不同菜单）
  - 身份切换 → `/identity-switch`
  - 退出登录

---

## 头像下拉菜单 - 工作台子菜单

根据身份类型，显示不同菜单：

### parent (家长)
| 菜单项 | 路由 |
|--------|------|
| 工作台首页 | `/workspace` |
| 我的孩子 | `/workspace/students` |
| 作文管理 | `/workspace/essays` |
| 投稿记录 | `/workspace/submissions` |
| 成长档案 | `/workspace/growth-records` |
| 我的订单 | `/workspace/orders` |

### teacher (个人老师)
| 菜单项 | 路由 |
|--------|------|
| 工作台首页 | `/workspace` |
| 班级管理 | `/workspace/classes` |
| 学生管理 | `/workspace/students` |
| 作文管理 | `/workspace/essays` |
| 投稿记录 | `/workspace/submissions` |
| 成长档案 | `/workspace/growth-records` |
| 批量上传 | `/workspace/essays/batch` |
| 数据统计 | `/workspace/statistics` |
| 我的订单 | `/workspace/orders` |

### organization_teacher (机构老师)
| 菜单项 | 路由 |
|--------|------|
| 工作台首页 | `/workspace` |
| 班级管理 | `/workspace/classes` |
| 授权学生 | `/workspace/students` |
| 作文管理 | `/workspace/essays` |
| 投稿记录 | `/workspace/submissions` |
| 成长档案 | `/workspace/growth-records` |
| 批量上传 | `/workspace/essays/batch` |
| 数据统计 | `/workspace/statistics` |

### organization_admin (机构管理员)
| 菜单项 | 路由 |
|--------|------|
| 工作台首页 | `/workspace` |
| 班级管理 | `/workspace/classes` |
| 学生管理 | `/workspace/students` |
| 老师管理 | `/workspace/teachers` |
| 作文管理 | `/workspace/essays` |
| 投稿记录 | `/workspace/submissions` |
| 成长档案 | `/workspace/growth-records` |
| 批量上传 | `/workspace/essays/batch` |
| 数据统计 | `/workspace/statistics` |
| 机构订单 | `/workspace/organization-orders` |

### operator / admin (运营/管理员)
| 菜单项 | 路由 |
|--------|------|
| 工作台首页 | `/workspace` |
| 平台代投任务池 | `/admin/agent-submissions` |
| 成长档案 | `/workspace/growth-records` |

---

## Workspace 侧边栏 (WorkspaceLayout)

工作台布局使用独立侧边栏，区别于顶部导航。

### 侧边栏菜单 (WORKSPACE_MENU)
与头像下拉菜单结构一致，包含：

| 菜单项 | 可见角色 | 路由 |
|--------|----------|------|
| 工作台首页 | 全部 | `/workspace` |
| 班级管理 | teacher, organization_admin, organization_teacher | `/workspace/classes` |
| 学生管理 | teacher, organization_admin, organization_teacher | `/workspace/students` |
| 我的孩子 | parent | `/workspace/students` |
| 老师管理 | organization_admin | `/workspace/teachers` |
| 作文管理 | parent, teacher, organization_admin, organization_teacher | `/workspace/essays` |
| 投稿记录 | parent, teacher, organization_admin, organization_teacher | `/workspace/submissions` |
| 成长档案 | 全部 | `/workspace/growth-records` |
| 批量上传 | teacher, organization_admin, organization_teacher | `/workspace/essays/batch` |
| 数据统计 | teacher, organization_admin, organization_teacher | `/workspace/statistics` |
| 我的订单 | parent, teacher | `/workspace/orders` |
| 机构订单 | organization_admin | `/workspace/organization-orders` |

### 侧边栏头部
- Logo + "我的工作台"
- 右上角显示当前身份类型标签

---

## 身份标签显示
| identityType | 显示名称 |
|--------------|----------|
| parent | 家长 |
| teacher | 个人老师 |
| organization_admin | 机构管理员 |
| organization_teacher | 机构老师 |
| operator | 运营人员 |
| admin | 管理员 |
