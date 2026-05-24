"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  BookOpen,
  Send,
  FileText,
  Award,
  TrendingUp,
  ArrowRight,
  Star,
  Lock,
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, isMember } = useAuthStore();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">AI驱动的智能投稿平台</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              让作文投稿
              <span className="text-primary">更简单</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
              找不到合适的投稿渠道？AI智能分析作文，推荐最适合的活动。
              自主投稿还是平台代投，轻松完成投稿全流程。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/activities">
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                  <BookOpen className="h-5 w-5" />
                  浏览活动库
                </Button>
              </Link>
              <Link href={isAuthenticated() ? "/ai-assistant" : "/login"}>
                <Button size="lg" variant="outline" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI投稿助手
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              一站式作文投稿服务
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              从发现活动到完成投稿，全流程支持。还有AI智能改稿，让您的作文更具竞争力
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 活动库 */}
            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>活动库</CardTitle>
                <CardDescription>
                  收录全国各类作文征稿活动，支持年级、主题、稿费等条件筛选
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">征稿中</Badge>
                  <Badge variant="secondary">即将截止</Badge>
                  <Badge variant="secondary">长期征稿</Badge>
                </div>
                <Link href="/activities" className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  浏览活动 <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* AI投稿助手 */}
            <Card className="border-2 hover:border-primary/30 transition-colors relative">
              {!isMember() && (
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Lock className="h-3 w-3 mr-1" />
                    会员专享
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>AI投稿助手</CardTitle>
                <CardDescription>
                  上传作文，AI智能分析并推荐最适合的投稿活动，提供改稿建议
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">AI改稿</Badge>
                  <Badge variant="secondary">活动推荐</Badge>
                  <Badge variant="secondary">投稿建议</Badge>
                </div>
                <Link href={isAuthenticated() ? "/ai-assistant" : "/login"} className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  立即体验 <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* 自主投稿 */}
            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 mb-4">
                  <Send className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>自主投稿</CardTitle>
                <CardDescription>
                  查看完整投稿方式，获取邮箱和格式要求，自行完成投稿
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">免费</Badge>
                  <Badge variant="secondary">自主操作</Badge>
                  <Badge variant="secondary">记录管理</Badge>
                </div>
                <Link href={isAuthenticated() ? "/self-submissions" : "/login"} className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  查看记录 <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* 平台代投 */}
            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>平台代投</CardTitle>
                <CardDescription>
                  付费增值服务，平台运营人员人工代投，全程跟踪状态
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">人工服务</Badge>
                  <Badge variant="secondary">进度跟踪</Badge>
                  <Badge variant="secondary">截图凭证</Badge>
                </div>
                <Link href={isAuthenticated() ? "/agent-submissions" : "/login"} className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  申请代投 <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* 我的作文 */}
            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 mb-4">
                  <FileText className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>我的作文</CardTitle>
                <CardDescription>
                  管理和改稿您的作文，保存多个版本，追踪投稿历史
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">版本管理</Badge>
                  <Badge variant="secondary">AI改稿</Badge>
                  <Badge variant="secondary">历史记录</Badge>
                </div>
                <Link href={isAuthenticated() ? "/essays" : "/login"} className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  管理作文 <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* 成长档案 */}
            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 mb-4">
                  <Award className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle>成长档案</CardTitle>
                <CardDescription>
                  记录投稿历程，沉淀发表成果，陪伴学生写作成长
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">发表记录</Badge>
                  <Badge variant="secondary">获奖记录</Badge>
                  <Badge variant="secondary">时间线</Badge>
                </div>
                <Link href={isAuthenticated() ? "/workspace/growth-records" : "/login"} className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  查看档案 <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
              <div className="text-primary-foreground/80">收录活动</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10000+</div>
              <div className="text-primary-foreground/80">成功投稿</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50000+</div>
              <div className="text-primary-foreground/80">服务用户</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-primary-foreground/80">用户满意度</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              如何使用平台
            </h2>
            <p className="text-gray-600">简单四步，完成作文投稿</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-2xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">上传作文</h3>
              <p className="text-sm text-gray-600">注册账号，上传您的作文作品</p>
            </div>

            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold text-2xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI分析</h3>
              <p className="text-sm text-gray-600">AI智能分析作文内容和特点</p>
            </div>

            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-2xl mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">推荐活动</h3>
              <p className="text-sm text-gray-600">获取个性化活动推荐和投稿建议</p>
            </div>

            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-2xl mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">完成投稿</h3>
              <p className="text-sm text-gray-600">自主投稿或申请平台代投</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            开始您的投稿之旅
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            立即注册，免费浏览活动库。开通会员，解锁完整投稿功能。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated() ? (
              <>
                <Link href="/activities">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    浏览活动
                  </Button>
                </Link>
                <Link href="/ai-assistant">
                  <Button size="lg" variant="outline">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI投稿助手
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    立即注册
                  </Button>
                </Link>
                <Link href="/membership">
                  <Button size="lg" variant="outline">
                    <Star className="h-4 w-4 mr-2" />
                    了解会员权益
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}