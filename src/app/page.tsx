"use client";

import { useEffect } from "react";
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
  Wrench,
  Trophy,
  LayoutDashboard,
} from "lucide-react";
import { PAGE_VIEW, AGENT_SUBMISSION_CTA_CLICK, MEMBERSHIP_CTA_CLICK } from "@/lib/analytics";
import { trackEvent } from "@/lib/analytics";

// Material Symbols icon components
const MaterialIcon = ({ name, className = "text-xl" }: { name: string; className?: string }) => {
  return (
    <span className={`material-symbols-outlined ${className}`}>
      {name}
    </span>
  );
};

export default function HomePage() {
  const { isAuthenticated, isMember } = useAuthStore();

  // 页面浏览埋点
  useEffect(() => {
    trackEvent(PAGE_VIEW, { pagePath: "/" });
  }, []);

  return (
    <div className="flex flex-col">
      {/* Navigation - glass effect */}
      <nav className="sticky top-0 z-50 glass-nav bg-surface/80 backdrop-blur-md border-b border-outline-variant/30">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold text-primary">作文投稿平台</span>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-primary border-b-2 border-primary pb-1">首页</Link>
              <Link href="/activities" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">活动库</Link>
              <Link href="/media-library" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">媒体库</Link>
              <Link href="/ai-assistant" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">AI投稿助手</Link>
              <Link href="/essay-revision" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">作文批改</Link>
              <Link href="/membership" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">会员服务</Link>
              <Link href="/agent-submissions/new" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">申请平台代投</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">登录</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary-container text-on-primary-container hover:bg-primary-container/90">注册</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - with gradient blur effects */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-surface-container-low to-surface">
        {/* Background blur decorations */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary blur-[120px] rounded-full -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tertiary blur-[100px] rounded-full -ml-20 -mb-20" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="h-5 w-5" />
            AI驱动的智能投稿平台
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-[64px] font-bold mb-6 leading-tight font-headline">
            让作文投稿
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent ml-2">更简单</span>
          </h1>

          <p className="text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto mb-12">
            找不到合适的投稿渠道？AI智能分析作文，推荐最适合的活动。
            自主投稿还是平台代投，轻松完成投稿全流程。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/activities">
              <Button size="lg" className="gap-2 bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform px-8 py-4">
                <BookOpen className="h-5 w-5" />
                浏览活动库
              </Button>
            </Link>
            <Link href={isAuthenticated() ? "/ai-assistant" : "/login"}>
              <Button size="lg" variant="outline" className="gap-2 px-8 py-4 bg-surface-container-highest hover:bg-surface-container transition-colors">
                <Sparkles className="h-5 w-5" />
                AI 投稿助手
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">一站式作文投稿服务</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            从发现活动到完成投稿，全流程支持。还有AI智能改稿，让您的作文更具竞争力
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 活动库 */}
          <Card className="bento-card p-6 bg-surface-container-lowest border border-outline-variant/30 group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <CardHeader className="p-0 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <BookOpen className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardTitle className="text-xl mb-3">活动库</CardTitle>
            <CardDescription className="mb-6">
              收录全国各类作文征稿活动，支持年级、主题、稿费等条件筛选
            </CardDescription>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-surface-container">征稿中</Badge>
              <Badge variant="secondary" className="bg-surface-container">即将截止</Badge>
              <Badge variant="secondary" className="bg-surface-container">长期征稿</Badge>
            </div>
            <Link href="/activities" className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
              浏览活动 <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>

          {/* AI投稿助手 - Highlight */}
          <Card className="bento-card p-6 bg-surface-container-lowest border border-outline-variant/30 group hover:-translate-y-1 hover:shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
            {!isMember() && (
              <div className="absolute top-4 right-4 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">
                会员专享
              </div>
            )}
            <CardHeader className="p-0 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Sparkles className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardTitle className="text-xl mb-3">AI 投稿助手</CardTitle>
            <CardDescription className="mb-6">
              上传作文，AI智能分析并推荐最适合的投稿活动，提供改稿建议
            </CardDescription>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-surface-container">AI改稿</Badge>
              <Badge variant="secondary" className="bg-surface-container">活动推荐</Badge>
              <Badge variant="secondary" className="bg-surface-container">投稿建议</Badge>
            </div>
            <Link href={isAuthenticated() ? "/ai-assistant" : "/login"} className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
              立即体验 <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>

          {/* 自主投稿 */}
          <Card className="bento-card p-6 bg-surface-container-lowest border border-outline-variant/30 group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <CardHeader className="p-0 mb-6">
              <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-white transition-colors">
                <Send className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardTitle className="text-xl mb-3">自主投稿</CardTitle>
            <CardDescription className="mb-6">
              查看完整投稿方式，获取邮箱和格式要求，自行完成投稿
            </CardDescription>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-surface-container">免费</Badge>
              <Badge variant="secondary" className="bg-surface-container">自主操作</Badge>
              <Badge variant="secondary" className="bg-surface-container">记录管理</Badge>
            </div>
            <Link href={isAuthenticated() ? "/self-submissions" : "/login"} className="inline-flex items-center gap-2 text-tertiary text-sm font-medium group-hover:translate-x-1 transition-transform">
              查看记录 <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>

          {/* 平台代投 */}
          <Card className="bento-card p-6 bg-surface-container-lowest border border-outline-variant/30 group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <CardHeader className="p-0 mb-6">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Wrench className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardTitle className="text-xl mb-3">平台代投</CardTitle>
            <CardDescription className="mb-6">
              付费增值服务，平台运营人员人工代投，全程跟踪状态
            </CardDescription>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-surface-container">人工服务</Badge>
              <Badge variant="secondary" className="bg-surface-container">进度跟踪</Badge>
              <Badge variant="secondary" className="bg-surface-container">截图凭证</Badge>
            </div>
            <Link
              href={isAuthenticated() ? "/agent-submissions" : "/login"}
              className="inline-flex items-center gap-2 text-orange-500 text-sm font-medium group-hover:translate-x-1 transition-transform"
              onClick={() => trackEvent(AGENT_SUBMISSION_CTA_CLICK, { sourcePage: "homepage_platform_card" })}
            >
              申请代投 <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>

          {/* 我的作文 */}
          <Card className="bento-card p-6 bg-surface-container-lowest border border-outline-variant/30 group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <CardHeader className="p-0 mb-6">
              <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                <FileText className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardTitle className="text-xl mb-3">我的作文</CardTitle>
            <CardDescription className="mb-6">
              管理和改稿您的作文，保存多个版本，追踪投稿历史
            </CardDescription>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-surface-container">版本管理</Badge>
              <Badge variant="secondary" className="bg-surface-container">AI改稿</Badge>
              <Badge variant="secondary" className="bg-surface-container">历史记录</Badge>
            </div>
            <Link href={isAuthenticated() ? "/essays" : "/login"} className="inline-flex items-center gap-2 text-pink-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
              管理作文 <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>

          {/* 成长档案 */}
          <Card className="bento-card p-6 bg-surface-container-lowest border border-outline-variant/30 group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <CardHeader className="p-0 mb-6">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <Trophy className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardTitle className="text-xl mb-3">成长档案</CardTitle>
            <CardDescription className="mb-6">
              记录投稿历程，沉淀发表成果，陪伴学生写作成长
            </CardDescription>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-surface-container">发表记录</Badge>
              <Badge variant="secondary" className="bg-surface-container">获奖记录</Badge>
              <Badge variant="secondary" className="bg-surface-container">时间线</Badge>
            </div>
            <Link href={isAuthenticated() ? "/workspace/growth-records" : "/login"} className="inline-flex items-center gap-2 text-green-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
              查看档案 <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="flex flex-col gap-2">
              <span className="text-5xl md:text-6xl font-bold">5000+</span>
              <span className="text-white/70">收录活动</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-5xl md:text-6xl font-bold">10000+</span>
              <span className="text-white/70">成功投稿</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-5xl md:text-6xl font-bold">50000+</span>
              <span className="text-white/70">服务用户</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-5xl md:text-6xl font-bold">98%</span>
              <span className="text-white/70">用户满意度</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">如何使用平台</h2>
          <p className="text-on-surface-variant">简单四步，完成作文投稿</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-outline-variant/30 -z-10" />

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-2xl mb-6 ring-8 ring-white shadow-lg">1</div>
            <h4 className="font-semibold mb-2">上传作文</h4>
            <p className="text-sm text-on-surface-variant">注册账号，上传您的作文作品</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-2xl mb-6 ring-8 ring-white shadow-lg">2</div>
            <h4 className="font-semibold mb-2">AI分析</h4>
            <p className="text-sm text-on-surface-variant">AI智能分析作文内容和特点</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-2xl mb-6 ring-8 ring-white shadow-lg">3</div>
            <h4 className="font-semibold mb-2">推荐活动</h4>
            <p className="text-sm text-on-surface-variant">获取个性化活动推荐和投稿建议</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-2xl mb-6 ring-8 ring-white shadow-lg">4</div>
            <h4 className="font-semibold mb-2">完成投稿</h4>
            <p className="text-sm text-on-surface-variant">自主投稿或申请平台代投</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl bg-surface-container-high p-12 text-center shadow-xl shadow-primary/5 border border-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">开始您的投稿之旅</h2>
            <p className="text-on-surface-variant mb-10">立即注册，开通会员，解锁完整投稿功能。</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.05] transition-transform px-10 py-4">
                  立即注册
                </Button>
              </Link>
              <Link href="/membership">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10 py-4 bg-white border border-outline-variant/30 hover:bg-surface-container transition-colors"
                  onClick={() => trackEvent(MEMBERSHIP_CTA_CLICK, { sourcePage: "homepage_cta" })}
                >
                  <Star className="h-4 w-4 mr-2" />
                  了解会员权益
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low py-16 border-t border-outline-variant/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <span className="text-xl font-bold mb-6 block">作文投稿平台</span>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                专业的中小学生作文投稿服务平台，帮助学生找到适合的投稿渠道，实现文学梦想。
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-6">快速链接</h5>
              <ul className="space-y-4">
                <li><Link href="/activities" className="text-sm text-on-surface-variant hover:text-primary transition-colors">活动库</Link></li>
                <li><Link href="/ai-assistant" className="text-sm text-on-surface-variant hover:text-primary transition-colors">AI投稿助手</Link></li>
                <li><Link href="/essays" className="text-sm text-on-surface-variant hover:text-primary transition-colors">我的作文</Link></li>
                <li><Link href="/membership" className="text-sm text-on-surface-variant hover:text-primary transition-colors">会员中心</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-6">投稿服务</h5>
              <ul className="space-y-4">
                <li><Link href="/self-submissions" className="text-sm text-on-surface-variant hover:text-primary transition-colors">自主投稿</Link></li>
                <li><Link href="/agent-submissions" className="text-sm text-on-surface-variant hover:text-primary transition-colors">平台代投</Link></li>
                <li><Link href="/workspace/growth-records" className="text-sm text-on-surface-variant hover:text-primary transition-colors">成长档案</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-6">帮助与支持</h5>
              <ul className="space-y-4">
                <li><Link href="/help" className="text-sm text-on-surface-variant hover:text-primary transition-colors">帮助中心</Link></li>
                <li><Link href="/about" className="text-sm text-on-surface-variant hover:text-primary transition-colors">关于我们</Link></li>
                <li><Link href="/contact" className="text-sm text-on-surface-variant hover:text-primary transition-colors">联系我们</Link></li>
                <li><Link href="/privacy" className="text-sm text-on-surface-variant hover:text-primary transition-colors">隐私政策</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-on-surface-variant">© 2024 中小学生作文投稿平台 版权所有. 浙ICP备88888888号</p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-sm text-on-surface-variant hover:text-primary">使用协议</Link>
              <Link href="/guide" className="text-sm text-on-surface-variant hover:text-primary">投稿指南</Link>
              <Link href="/careers" className="text-sm text-on-surface-variant hover:text-primary">加入我们</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Assistant Floating Button */}
      <div className="fixed bottom-8 right-8 z-[60]">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary to-blue-400 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
          <Link
            href={isAuthenticated() ? "/ai-assistant" : "/login"}
            className="relative w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          >
            <Sparkles className="text-2xl" />
          </Link>
          <div className="absolute bottom-full right-0 mb-4 w-64 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <p className="text-sm font-medium text-primary mb-1">AI 投稿助手</p>
            <p className="text-xs text-on-surface-variant">有什么我可以帮您的吗？我可以为您改稿或推荐合适的刊物。</p>
          </div>
        </div>
      </div>
    </div>
  );
}