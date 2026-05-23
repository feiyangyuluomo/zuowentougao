"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common";
import { getMockEssayList } from "@/lib/mock";
import { ESSAY_STATUS } from "@/constants";
import {
  FileText,
  Plus,
  Sparkles,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";

// TODO: Replace with actual auth and data

export default function EssaysPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const essays = getMockEssayList();

  const filteredEssays = essays.filter((essay) =>
    essay.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">我的作文</h1>
          <p className="text-gray-600 mt-1">
            管理您的作文作品，支持AI改稿和版本管理
          </p>
        </div>
        <Link href="/essays/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            上传作文
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索作文标题..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">全部作文</TabsTrigger>
          <TabsTrigger value="published">已发布</TabsTrigger>
          <TabsTrigger value="draft">草稿</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Essay List */}
      {filteredEssays.length === 0 ? (
        <EmptyState
          variant="no-essays"
          className="mt-8"
          action={{
            label: "上传第一篇作文",
            onClick: () => {},
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredEssays.map((essay) => (
            <Card key={essay.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge
                    variant={essay.status === "published" ? "success" : "secondary"}
                  >
                    {ESSAY_STATUS[essay.status]?.label || essay.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="line-clamp-2 mt-2">
                  <Link href={`/essays/${essay.id}`}>{essay.title}</Link>
                </CardTitle>
                <CardDescription>
                  {essay.wordCount}字 | {essay.genre}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {essay.themeTags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>更新于 {new Date(essay.updatedAt).toLocaleDateString("zh-CN")}</span>
                  <span>|</span>
                  <span>{essay.submissionCount}次投稿</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI改稿
                  </Button>
                  <Link href={`/essays/${essay.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <Edit className="h-3 w-3" />
                      查看
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}