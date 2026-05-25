"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores";
import { getOrders, ORDER_TYPE_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/api/order-api";
import { formatAmount } from "@/lib/api/order-api";
import type { Order } from "@/lib/api/order-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText, Receipt } from "lucide-react";
import Link from "next/link";
import { ORDER_PAGE_VIEW, trackEvent } from "@/lib/analytics";

type PaymentStatus = "pending" | "paid" | "refunded" | "cancelled";

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  refunded: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

function OrderCard({ order }: { order: Order }) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{order.orderTitle}</CardTitle>
          <Badge className={PAYMENT_STATUS_COLORS[order.paymentStatus as PaymentStatus]}>
            {PAYMENT_STATUS_LABELS[order.paymentStatus]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Receipt className="h-4 w-4" />
          <span>订单号：{order.id}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>下单时间：{new Date(order.createdAt).toLocaleDateString("zh-CN")}</span>
        </div>
        {order.paidAt && (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>支付时间：{new Date(order.paidAt).toLocaleDateString("zh-CN")}</span>
          </div>
        )}
        {order.relatedStudentName && (
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4" />
            <span>关联学生：{order.relatedStudentName}</span>
          </div>
        )}
        {order.relatedEssayTitle && (
          <div className="flex items-center gap-2 text-gray-600">
            <FileText className="h-4 w-4" />
            <span>关联作文：{order.relatedEssayTitle}</span>
          </div>
        )}
        {order.expiredAt && (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>到期时间：{new Date(order.expiredAt).toLocaleDateString("zh-CN")}</span>
          </div>
        )}
        {order.remarks && (
          <div className="text-gray-500 text-xs mt-2">{order.remarks}</div>
        )}
        <div className="pt-2 border-t mt-3">
          <span className="text-lg font-semibold text-primary">
            {formatAmount(order.amount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OrdersPage() {
  const { currentIdentity } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  if (!currentIdentity) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">请先选择身份</p>
      </div>
    );
  }

  // 家长和个人老师可以访问
  if (!["parent", "teacher"].includes(currentIdentity.identityType)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p>您没有权限访问此页面</p>
        <Link href="/workspace" className="mt-4 text-primary hover:underline">
          返回工作台
        </Link>
      </div>
    );
  }

  // 加载订单数据
  useEffect(() => {
    if (!currentIdentity) return;

    const identityId = currentIdentity.id;

    async function loadOrders() {
      setLoading(true);
      try {
        const data = await getOrders(identityId);
        setOrders(data);
      } catch (error) {
        console.error("加载订单失败:", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();

    // 页面浏览埋点
    trackEvent(ORDER_PAGE_VIEW, {
      orderPageType: "personal",
      identityType: currentIdentity.identityType,
    });
  }, []);

  // 计算总计
  const totalAmount = orders.reduce((sum, o) => sum + o.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">我的订单</h1>
        <p className="text-gray-500 mt-1">查看您的所有订单记录</p>
      </div>

      {/* 订单统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">订单总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <span className="text-2xl font-semibold">{orders.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">消费总额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-primary">
                {formatAmount(totalAmount)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Receipt className="h-12 w-12 mb-4 text-gray-300" />
            <p>暂无订单记录</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* 订单类型说明 */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700">订单类型说明</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(ORDER_TYPE_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}