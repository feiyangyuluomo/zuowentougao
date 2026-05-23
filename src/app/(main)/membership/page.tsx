"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common";
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
} from "lucide-react";
import Link from "next/link";

// TODO: Replace with actual auth and membership data

const membershipPlans = [
  {
    id: "yearly",
    name: "年费会员",
    price: 99.9,
    originalPrice: 199,
    duration: "1年",
    features: [
      "查看所有活动完整详情",
      "查看投稿邮箱和投稿方式",
      "使用AI推荐活动功能",
      "使用AI改稿（每月10次）",
      "记录自主投稿",
      "申请平台代投服务",
      "成长档案管理",
    ],
    isPopular: true,
  },
  {
    id: "lifetime",
    name: "终身会员",
    price: 259,
    originalPrice: 499,
    duration: "永久有效",
    features: [
      "年费会员全部权益",
      "永久有效无需续费",
      "AI改稿无限次使用",
      "优先客服支持",
      "专属成长顾问服务",
      "定期精品活动推荐",
    ],
    isPopular: false,
  },
];

const benefits = [
  {
    icon: BookOpen,
    title: "活动库",
    description: "查看所有征稿活动完整详情",
  },
  {
    icon: FileText,
    title: "投稿方式",
    description: "获取准确的投稿邮箱和格式要求",
  },
  {
    icon: Sparkles,
    title: "AI推荐",
    description: "智能分析作文推荐最适合的活动",
  },
  {
    icon: Send,
    title: "投稿记录",
    description: "管理您的自主投稿记录",
  },
];

export default function MembershipPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          开通会员服务
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          开通会员，解锁完整活动详情、投稿方式、AI智能推荐等功能，让投稿更简单
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {benefits.map((benefit, index) => (
          <Card key={index}>
            <CardContent className="pt-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Membership Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        {membershipPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.isPopular ? "border-primary border-2" : ""
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary">
                  <Star className="h-3 w-3 mr-1" />
                  最受欢迎
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.duration}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">
                  ¥{plan.price}
                </span>
                <span className="text-gray-500 line-through ml-2">
                  ¥{plan.originalPrice}
                </span>
              </div>
              <ul className="space-y-3 text-left mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full gap-2 ${
                  plan.isPopular
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                立即开通
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          常见问题
        </h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                年费会员和终身会员有什么区别？
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                年费会员需要在每年续费才能继续使用服务，终身会员一次购买永久有效。
                终身会员还享有AI改稿无限次使用和优先客服支持等额外权益。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                AI改稿次数用完了怎么办？
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                年费会员每月有10次AI改稿次数，终身会员享有无限次使用。
                次数每月重置，不可累积。如需更多次数，可升级为终身会员。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                会员费用可以退款吗？
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                会员费用在购买后7天内如未使用服务，可申请全额退款。
                超过7天或已使用服务，按剩余有效期折算退款。
                如遇特殊情况，可联系客服处理。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}