// ============================================================================
// 活动筛选器组件
// ============================================================================

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { GRADE_OPTIONS, GRADE_GROUPS } from "@/constants";
import { Filter, X, Search } from "lucide-react";

interface ActivityFilterProps {
  onFilterChange: (filters: {
    keyword?: string;
    gradeScope?: string[];
    genre?: string[];
    activityStatus?: string;
  }) => void;
}

const GENRE_OPTIONS = [
  { label: "记叙文", value: "narrative" },
  { label: "议论文", value: "argumentative" },
  { label: "散文", value: "prose" },
  { label: "诗歌", value: "poetry" },
  { label: "书信", value: "letter" },
  { label: "演讲稿", value: "speech" },
];

const STATUS_OPTIONS = [
  { label: "征稿中", value: "recruiting" },
  { label: "即将截止", value: "closing_soon" },
  { label: "长期征稿", value: "long_term" },
  { label: "已截止", value: "closed" },
];

export function ActivityFilter({ onFilterChange }: ActivityFilterProps) {
  const [keyword, setKeyword] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    onFilterChange({
      keyword: value || undefined,
      gradeScope: selectedGrades.length > 0 ? selectedGrades : undefined,
      genre: selectedGenres.length > 0 ? selectedGenres : undefined,
      activityStatus: selectedStatuses.length > 0 ? selectedStatuses[0] : undefined,
    });
  };

  const handleGradeChange = (grade: string, checked: boolean) => {
    const newGrades = checked
      ? [...selectedGrades, grade]
      : selectedGrades.filter((g) => g !== grade);
    setSelectedGrades(newGrades);
    onFilterChange({
      keyword: keyword || undefined,
      gradeScope: newGrades.length > 0 ? newGrades : undefined,
      genre: selectedGenres.length > 0 ? selectedGenres : undefined,
      activityStatus: selectedStatuses.length > 0 ? selectedStatuses[0] : undefined,
    });
  };

  const handleGenreChange = (genre: string, checked: boolean) => {
    const newGenres = checked
      ? [...selectedGenres, genre]
      : selectedGenres.filter((g) => g !== genre);
    setSelectedGenres(newGenres);
    onFilterChange({
      keyword: keyword || undefined,
      gradeScope: selectedGrades.length > 0 ? selectedGrades : undefined,
      genre: newGenres.length > 0 ? newGenres : undefined,
      activityStatus: selectedStatuses.length > 0 ? selectedStatuses[0] : undefined,
    });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked
      ? [...selectedStatuses, status]
      : selectedStatuses.filter((s) => s !== status);
    setSelectedStatuses(newStatuses);
    onFilterChange({
      keyword: keyword || undefined,
      gradeScope: selectedGrades.length > 0 ? selectedGrades : undefined,
      genre: selectedGenres.length > 0 ? selectedGenres : undefined,
      activityStatus: newStatuses.length > 0 ? newStatuses[0] : undefined,
    });
  };

  const clearAllFilters = () => {
    setKeyword("");
    setSelectedGrades([]);
    setSelectedGenres([]);
    setSelectedStatuses([]);
    onFilterChange({});
  };

  const hasActiveFilters = keyword || selectedGrades.length > 0 || selectedGenres.length > 0 || selectedStatuses.length > 0;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="搜索活动名称或关键词..."
          value={keyword}
          onChange={(e) => handleKeywordChange(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Grade Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-1" />
              年级
              {selectedGrades.length > 0 && (
                <Badge variant="default" className="ml-2 h-5 w-5 p-0 justify-center">
                  {selectedGrades.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>选择年级</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {GRADE_OPTIONS.map((grade) => (
              <DropdownMenuCheckboxItem
                key={grade.value}
                checked={selectedGrades.includes(grade.value)}
                onCheckedChange={(checked) => handleGradeChange(grade.value, checked)}
              >
                {grade.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Genre Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-1" />
              文体
              {selectedGenres.length > 0 && (
                <Badge variant="default" className="ml-2 h-5 w-5 p-0 justify-center">
                  {selectedGenres.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>选择文体</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {GENRE_OPTIONS.map((genre) => (
              <DropdownMenuCheckboxItem
                key={genre.value}
                checked={selectedGenres.includes(genre.value)}
                onCheckedChange={(checked) => handleGenreChange(genre.value, checked)}
              >
                {genre.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-1" />
              状态
              {selectedStatuses.length > 0 && (
                <Badge variant="default" className="ml-2 h-5 w-5 p-0 justify-center">
                  {selectedStatuses.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>选择状态</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STATUS_OPTIONS.map((status) => (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={selectedStatuses.includes(status.value)}
                onCheckedChange={(checked) => handleStatusChange(status.value, checked)}
              >
                {status.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-gray-500"
            onClick={clearAllFilters}
          >
            <X className="h-4 w-4 mr-1" />
            清除筛选
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedGrades.map((grade) => {
            const gradeLabel = GRADE_OPTIONS.find((g) => g.value === grade)?.label || grade;
            return (
              <Badge key={grade} variant="secondary" className="gap-1">
                {gradeLabel}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleGradeChange(grade, false)}
                />
              </Badge>
            );
          })}
          {selectedGenres.map((genre) => {
            const genreLabel = GENRE_OPTIONS.find((g) => g.value === genre)?.label || genre;
            return (
              <Badge key={genre} variant="secondary" className="gap-1">
                {genreLabel}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleGenreChange(genre, false)}
                />
              </Badge>
            );
          })}
          {selectedStatuses.map((status) => {
            const statusLabel = STATUS_OPTIONS.find((s) => s.value === status)?.label || status;
            return (
              <Badge key={status} variant="secondary" className="gap-1">
                {statusLabel}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleStatusChange(status, false)}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}