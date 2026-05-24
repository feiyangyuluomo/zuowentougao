"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldX } from "lucide-react";

interface AccessDeniedProps {
  message?: string;
  redirectTo?: string;
}

export function AccessDenied({
  message = "您没有权限访问此页面",
  redirectTo = "/workspace",
}: AccessDeniedProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <ShieldX className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">访问被拒绝</h2>
              <p className="mt-2 text-sm text-gray-500">{message}</p>
            </div>
            <div className="flex justify-center gap-4">
              <Link href={redirectTo}>
                <Button variant="outline">返回工作台</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost">返回首页</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}