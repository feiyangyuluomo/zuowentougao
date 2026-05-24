// ============================================================================
// 媒体库页面 - 展示所有征稿方（杂志、报纸、公众号等）
// 用于SEO和用户浏览征稿方详情
// ============================================================================

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MOCK_PUBLISHERS } from "@/lib/mock/publishers";
import type { Publisher, PublisherType } from "@/types";
import { BookOpen, Mail, Globe, Search } from "lucide-react";
import Link from "next/link";

// 征稿方类型标签
const PUBLISHER_TYPE_LABELS: Record<PublisherType, string> = {
  newspaper: "报纸",
  magazine: "杂志",
  official_account: "公众号",
  organization: "机构",
  school: "学校",
  other: "其他",
};

interface MediaLibraryPageProps {
  searchParams?: { type?: string };
}

export default function MediaLibraryPage({ searchParams }: MediaLibraryPageProps) {
  const typeFilter = searchParams?.type;

  // 根据类型筛选
  const filteredPublishers = typeFilter
    ? MOCK_PUBLISHERS.filter((p) => p.publisherType === typeFilter)
    : MOCK_PUBLISHERS;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">媒体库</h1>
        <p className="text-gray-600">
          浏览所有征稿方，包括杂志、报纸、公众号等，了解各平台的投稿要求和风格
        </p>
      </div>

      {/* 筛选标签 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link href="/media-library">
          <Badge variant={!typeFilter ? "default" : "outline"} className="cursor-pointer">
            全部
          </Badge>
        </Link>
        {Object.entries(PUBLISHER_TYPE_LABELS).map(([type, label]) => (
          <Link key={type} href={`/media-library?type=${type}`}>
            <Badge
              variant={typeFilter === type ? "default" : "outline"}
              className="cursor-pointer"
            >
              {label}
            </Badge>
          </Link>
        ))}
      </div>

      {/* 搜索框 */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input type="text" placeholder="搜索媒体名称..." className="pl-10" />
      </div>

      {/* 媒体列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPublishers.map((publisher) => (
          <Link
            key={publisher.id}
            href={`/media-library/publishers/${publisher.id}`}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {/* Logo占位 */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {publisher.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {PUBLISHER_TYPE_LABELS[publisher.publisherType]}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {publisher.description || "暂无描述"}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                      {publisher.website && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          官网
                        </span>
                      )}
                      {publisher.contactInfo && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          投稿邮箱
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* 空状态 */}
      {filteredPublishers.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">暂无相关媒体</p>
        </div>
      )}
    </div>
  );
}