"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import {
  CreditCard,
  Sparkles,
  Star,
  Zap,
  Award,
  BookOpen,
  FileText,
  Send,
  Clock,
  Users,
  Building2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MEMBERSHIP_PAGE_VIEW, MEMBERSHIP_CTA_CLICK, trackEvent } from "@/lib/analytics";

// ============================================================================
// 会员服务定价页面
// ============================================================================

// 小学收费明细数据
const PRIMARY_FEE_TABLE = [
  { range: "300字及以下", fee: 50 },
  { range: "400字", fee: 60 },
  { range: "500字", fee: 70 },
  { range: "600字", fee: 80 },
  { range: "700字", fee: 90 },
  { range: "800字", fee: 100 },
  { range: "900字", fee: 110 },
  { range: "1000字", fee: 120 },
  { range: "1100字", fee: 130 },
];

// 中学收费明细数据
const MIDDLE_FEE_TABLE = [
  { range: "500字及以下", fee: 80 },
  { range: "600字", fee: 90 },
  { range: "700字", fee: 100 },
  { range: "800字", fee: 110 },
  { range: "900字", fee: 120 },
  { range: "1000字", fee: 130 },
  { range: "1100字", fee: 140 },
  { range: "1200字", fee: 150 },
  { range: "1300字", fee: 160 },
  { range: "1400字", fee: 170 },
  { range: "1500字", fee: 180 },
];

function FeeTable({ table, level }: { table: { range: string; fee: number }[]; level: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayItems = isExpanded ? table : table.slice(0, 5);

  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="text-left py-2">字数范围</th>
            <th className="text-right py-2">费用</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.map((item, idx) => (
            <tr key={idx} className="border-b last:border-0">
              <td className="py-2 text-gray-600">{item.range}</td>
              <td className="py-2 text-right font-medium">¥{item.fee}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {table.length > 5 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm text-primary hover:underline flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" /> 收起
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" /> 查看更多
            </>
          )}
        </button>
      )}
      <p className="text-xs text-gray-500 mt-2 text-center">更多字数依次类推</p>
    </div>
  );
}

export default function MembershipPage() {
  const router = useRouter();

  // 页面浏览埋点
  useEffect(() => {
    trackEvent(MEMBERSHIP_PAGE_VIEW, { pagePath: "/membership" });
  }, []);

  const handleOrder = (type: string, plan?: string) => {
    // 会员 CTA 点击埋点
    trackEvent(MEMBERSHIP_CTA_CLICK, {
      sourcePage: "/membership",
      membershipType: type,
      planType: plan,
    });
    router.push(`/order?type=${type}&plan=${plan || ""}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          会员服务
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          专业的作文投稿服务平台，助力学生成长 发表
        </p>
      </div>

      <Tabs defaultValue="activity" className="max-w-6xl mx-auto">
        <TabsList className="grid grid-cols-4 w-full mb-8">
          <TabsTrigger value="activity">活动库权限</TabsTrigger>
          <TabsTrigger value="submission">作文代投</TabsTrigger>
          <TabsTrigger value="revision">作文批改</TabsTrigger>
          <TabsTrigger value="vip">超级VIP</TabsTrigger>
        </TabsList>

        {/* 一、查看活动库及媒体库权限 */}
        <TabsContent value="activity" className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">查看活动库及媒体库权限</h2>
            <p className="text-gray-600">解锁完整活动详情、投稿方式、媒体库等内容</p>
          </div>

          {/* 个人版 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-primary">
              <CardHeader className="text-center pb-2">
                <Badge className="mb-2">个人版</Badge>
                <CardTitle className="text-xl">适合家长和个体老师</CardTitle>
                <CardDescription>基础会员服务</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold text-primary">¥99.9</span>
                      <span className="text-gray-500">/1个年级/年</span>
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      原价 ¥599.4/年
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-lg font-bold text-green-600">¥259</span>
                    <span className="text-gray-500">/1个年级/终身</span>
                  </div>
                  <div className="text-xs text-gray-400 line-through">
                    原价 ¥1999/终身
                  </div>
                </div>
                <ul className="text-left space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    不限次数查询活动库
                  </li>
                  <li className="flex- items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    查看投稿邮箱和投稿方式
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    1个年级权限
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    有效期内不限次数使用
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    年费1年，终身版永久有效
                  </li>
                </ul>
                <div className="space-y-2">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => handleOrder("membership", "personal-yearly")}
                  >
                    年费 ¥99.9/1个年级
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOrder("membership", "personal-lifetime")}
                  >
                    终身 ¥259/1个年级
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 机构版 */}
            <Card className="border-2 border-orange-500">
              <CardHeader className="text-center pb-2">
                <Badge className="mb-2 bg-orange-500">机构版</Badge>
                <CardTitle className="text-xl">适合培训机构和中小学</CardTitle>
                <CardDescription>机构团队使用</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <div className="text-lg font-bold text-orange-600">
                    不限查询次数
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    初始默认3个账号
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    （1个机构管理员+2个机构老师）
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                  <h4 className="font-medium mb-2">版本及价格</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>小学版（含1-6年级）</span>
                      <span className="font-medium">¥199元/年</span>
                    </div>
                    <div className="text-xs text-gray-500 line-through">
                      原价 ¥599.4元/年
                    </div>
                    <div className="flex justify-between mt-3">
                      <span>中学版（含初一到高三）</span>
                      <span className="font-medium">¥100元/年</span>
                    </div>
                    <div className="text-xs text-gray-500 line-through">
                      原价 ¥599.4元/年
                    </div>
                    <div className="flex justify-between mt-3">
                      <span>中小学版（一年级到高三）</span>
                      <span className="font-medium">¥299元/年</span>
                    </div>
                    <div className="text-xs text-gray-500 line-through">
                      原价 ¥1198.8元/年
                    </div>
                  </div>
                </div>
                <ul className="text-left space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    不限查询次数
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    初始3个账号
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    增加账号：50元/账号/年
                  </li>
                </ul>
                <div className="space-y-2">
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => handleOrder("membership", "org-primary")}
                  >
                    小学版 ¥199/年
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOrder("membership", "org-middle")}
                  >
                    中学版 ¥100/年
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOrder("membership", "org-full")}
                  >
                    中小学版 ¥299/年
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 二、作文代投 */}
        <TabsContent value="submission" className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">作文代投服务</h2>
            <p className="text-gray-600">专业团队协助投稿，省时省力</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 自主投稿 */}
            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg">自主投稿</CardTitle>
                <CardDescription>用户自己操作</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-green-600">免费</span>
                </div>
                <ul className="text-left space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    使用个人邮箱投稿
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    自己掌控投稿进度
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    锻炼孩子独立性
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  了解详情
                </Button>
              </CardContent>
            </Card>

            {/* 平台代投 */}
            <Card className="border-2 border-primary">
              <CardHeader className="text-center pb-2">
                <Badge className="mb-2 bg-primary">推荐</Badge>
                <CardTitle className="text-lg">平台代投</CardTitle>
                <CardDescription>单次服务</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">¥9.9</span>
                  <span className="text-gray-500">/次/篇</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  一次多篇 = 9.9元 × 篇数
                </p>
                <ul className="text-left space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    专业团队协助投稿
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    节省时间和精力
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    提升投稿成功率
                  </li>
                </ul>
                <Link href="/agent-submissions/new">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    申请代投
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 包年服务 */}
            <Card className="border-2 border-orange-500">
              <CardHeader className="text-center pb-2">
                <Badge className="mb-2 bg-orange-500">包年</Badge>
                <CardTitle className="text-lg">个人包年代投</CardTitle>
                <CardDescription>单个孩子不限次数</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-orange-600">¥199</span>
                  <span className="text-gray-500">/年/孩子</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  多个孩子 = 199元 × 孩子人数
                </p>
                <ul className="text-left space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    单个孩子全年不限次数
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    适合经常投稿的孩子
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    更划算的选择
                  </li>
                </ul>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  开通包年
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 机构版代投 */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                机构版代投服务
              </CardTitle>
              <CardDescription>适合培训机构和学校</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                可提供100篇作文等大批量代投服务，如有需要请私聊。
              </p>
              <Button variant="outline">私聊咨询</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 三、作文批改 */}
        <TabsContent value="revision" className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">作文批改服务</h2>
            <p className="text-gray-600">专业老师深度批改，助力写作提升</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 小学收费报价单 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">小学收费报价单</CardTitle>
                <CardDescription>适合1-6年级学生</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>收费规则：</strong>300字以内50元，每增加100字增加10元
                  </p>
                </div>
                <FeeTable table={PRIMARY_FEE_TABLE} level="小学" />
                <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
                  <p className="font-medium text-gray-700 mb-1">加急服务说明：</p>
                  <p>• 加急24小时：基础费用 × 1.5</p>
                  <p>• 加急12小时：基础费用 × 2</p>
                </div>
              </CardContent>
            </Card>

            {/* 中学收费报价单 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">中学收费报价单</CardTitle>
                <CardDescription>适合初一至高三学生</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>收费规则：</strong>500字以内80元，每增加100字增加10元
                  </p>
                </div>
                <FeeTable table={MIDDLE_FEE_TABLE} level="中学" />
                <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
                  <p className="font-medium text-gray-700 mb-1">加急服务说明：</p>
                  <p>• 加急24小时：基础费用 × 1.5</p>
                  <p>• 加急12小时：基础费用 × 2</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 说明事项 */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">特别说明</h4>
                  <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                    <li>• 如同时修改2篇作文，每篇作文单独报价</li>
                    <li>• AI批改建议仅用于日常练习，不建议投递AI批改稿件</li>
                    <li>• 人工精批由专业老师进行深度批改</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/essay-revision">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                立即申请批改
              </Button>
            </Link>
          </div>
        </TabsContent>

        {/* 四、超级VIP服务 */}
        <TabsContent value="vip" className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">超级VIP服务</h2>
            <p className="text-gray-600">学生成长发表计划（为保障双方权益，以下合作均签署服务合同）</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 一档 */}
            <Card className="border-2 border-primary">
              <CardHeader className="text-center">
                <Badge className="mb-2 bg-primary">一档</Badge>
                <CardTitle className="text-lg">成长发表计划</CardTitle>
                <CardDescription>简历成果提升版</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">服务时长：2年</p>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-primary">小学1.5万 / 中学2万</span>
                    <span className="text-gray-500">/人</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                  <h4 className="font-medium mb-2">服务权益：</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 市级/省级/全国级正规杂志/征文大赛辅导至少共投中10篇</li>
                    <li>• 未完成按小学1500元/篇、中学2000元/篇退款</li>
                    <li>• 精修20篇作文</li>
                    <li>• 不限量作文代投</li>
                    <li>• 定制专属每月作文投稿方案</li>
                  </ul>
                </div>
                <div className="text-xs text-gray-500 p-3 bg-yellow-50 rounded">
                  <p className="font-medium text-yellow-800 mb-1">家长配合事项：</p>
                  <p>合作开始后的20月内至少提供20篇作文</p>
                </div>
              </CardContent>
            </Card>

            {/* 二档 */}
            <Card className="border-2 border-purple-500">
              <CardHeader className="text-center">
                <Badge className="mb-2 bg-purple-500">二档</Badge>
                <CardTitle className="text-lg">个人作品出版计划</CardTitle>
                <CardDescription>出版个人作品书籍</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">服务时长：2年</p>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-purple-600">8万</span>
                    <span className="text-gray-500">/人</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                  <h4 className="font-medium mb-2">服务权益：</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 辅导孩子完成一本个人书籍出版</li>
                    <li>• 含版号、策划、校对、出版</li>
                    <li>• 200本样书全流程服务</li>
                  </ul>
                </div>
                <div className="text-xs text-gray-500 p-3 bg-yellow-50 rounded">
                  <p className="font-medium text-yellow-800 mb-1">家长配合事项：</p>
                  <p>整理孩子文稿并配合编辑内容修改及更新要求</p>
                </div>
              </CardContent>
            </Card>

            {/* 三档 */}
            <Card className="border-2 border-orange-500">
              <CardHeader className="text-center">
                <Badge className="mb-2 bg-orange-500">三档</Badge>
                <CardTitle className="text-lg">小作家成长计划</CardTitle>
                <CardDescription>打造小作家个人IP</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">服务时长：3年</p>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-orange-600">小学10万起 / 中学11万起</span>
                    <span className="text-gray-500">/人</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                  <h4 className="font-medium mb-2">服务权益：</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 市级/省级/全国级正规杂志/征文活动辅导至少共投中20篇</li>
                    <li>• 未完成按小学1500元/篇、中学2000元/篇退款</li>
                    <li>• 精修40篇作文</li>
                    <li>• 定制专属每月作文投稿方案，不限量代投</li>
                    <li>• 辅导完成一本个人书籍出版（含200本样书）</li>
                  </ul>
                </div>
                <div className="text-xs text-gray-500 p-3 bg-yellow-50 rounded">
                  <p className="font-medium text-yellow-800 mb-1">家长配合事项：</p>
                  <p>合作期内前30月至少提供40篇作文，每年不少于15篇</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 说明 */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">说明</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    以上三档服务报价将不定期调整，请以最新版报价为准。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              咨询超级VIP服务
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}