"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/common";
import { getMockActivityList, filterMockActivities } from "@/lib/mock";
import { ACTIVITY_STATUS } from "@/constants";
import { GRADE_LABELS } from "@/constants";
import { GRADE_OPTIONS } from "@/constants";
import {
  Search,
  Filter,
  Calendar,
  Award,
  Mail,
  Bookmark,
  Share2,
} from "lucide-react";
import Link from "next/link";

// TODO: Replace with actual filters from URL params

export default function ActivitiesPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const activities = getMockActivityList();

  const filteredActivities = filterMockActivities({
    keyword: searchKeyword,
    gradeScope: selectedGrades.length > 0 ? selectedGrades : undefined,
    activityStatus: selectedStatuses.length > 0 ? selectedStatuses[0] as any : undefined,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">活动库</h1>
          <p className="text-gray-600 mt-1">
            浏览各类作文征稿活动，找到适合的投稿渠道
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索活动名称或关键词..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          筛选条件
          {(selectedGrades.length > 0 || selectedStatuses.length > 0) && (
            <Badge variant="secondary" className="ml-1">
              {selectedGrades.length + selectedStatuses.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Grade Filter */}
              <div>
                <Label className="mb-3 block">年级</Label>
                <div className="space-y-2">
                  {GRADE_OPTIONS.slice(0, 6).map((grade) => (
                    <div key={grade.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`grade-${grade.value}`}
                        checked={selectedGrades.includes(grade.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedGrades([...selectedGrades, grade.value]);
                          } else {
                            setSelectedGrades(
                              selectedGrades.filter((g) => g !== grade.value)
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={`grade-${grade.value}`}
                        className="cursor-pointer"
                      >
                        {grade.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <Label className="mb-3 block">活动状态</Label>
                <div className="space-y-2">
                  {Object.entries(ACTIVITY_STATUS).map(([key, { label }]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        id={`status-${key}`}
                        checked={selectedStatuses.includes(key)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedStatuses([...selectedStatuses, key]);
                          } else {
                            setSelectedStatuses(
                              selectedStatuses.filter((s) => s !== key)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={`status-${key}`} className="cursor-pointer">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <Label className="mb-3 block">快速筛选</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedGrades(["1", "2", "3", "4", "5", "6"])
                    }
                  >
                    小学
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedGrades(["7", "8", "9", "10", "11", "12"])
                    }
                  >
                    中学
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStatuses(["recruiting"])}
                  >
                    征稿中
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStatuses(["closing_soon"])}
                  >
                    即将截止
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setSelectedGrades([]);
                    setSelectedStatuses([]);
                  }}
                >
                  清除筛选
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">全部活动</TabsTrigger>
          <TabsTrigger value="recruiting">征稿中</TabsTrigger>
          <TabsTrigger value="closing_soon">即将截止</TabsTrigger>
          <TabsTrigger value="long_term">长期征稿</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Activity List */}
      {filteredActivities.length === 0 ? (
        <EmptyState
          variant="no-results"
          action={{
            label: "清除筛选",
            onClick: () => {
              setSearchKeyword("");
              setSelectedGrades([]);
              setSelectedStatuses([]);
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <Link
              key={activity.id}
              href={`/activities/${activity.id}`}
              className="block"
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      variant={
                        activity.activityStatus === "recruiting"
                          ? "success"
                          : activity.activityStatus === "closing_soon"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {ACTIVITY_STATUS[activity.activityStatus as keyof typeof ACTIVITY_STATUS]?.label ||
                        activity.activityStatus}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 mt-2">
                    {activity.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">
                    {activity.publicSummary}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activity.gradeScope.map((grade) => (
                      <Badge key={grade} variant="outline">
                        {GRADE_LABELS[grade] || grade}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {activity.hasPayment && (
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        有稿费
                      </span>
                    )}
                    {activity.hasCertificate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        有证书
                      </span>
                    )}
                    {activity.deadline && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {new Date(activity.deadline).toLocaleDateString("zh-CN")}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}