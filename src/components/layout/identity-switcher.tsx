"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { User, Users, Briefcase, ChevronDown, Check } from "lucide-react";

// TODO: Replace with actual auth store
const mockIdentities: Array<{
  id: string;
  identityType: "parent" | "teacher" | "organization_admin";
  name: string;
  studentCount?: number;
}> = [
  {
    id: "id-001",
    identityType: "parent",
    name: "家长身份",
    studentCount: 2,
  },
  {
    id: "id-002",
    identityType: "teacher",
    name: "老师身份",
    studentCount: 15,
  },
  {
    id: "id-003",
    identityType: "organization_admin",
    name: "机构管理员",
    studentCount: 0,
  },
];

const mockCurrentIdentity = mockIdentities[0];

interface IdentitySwitcherProps {
  className?: string;
}

export function IdentitySwitcher({ className }: IdentitySwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIdentity, setCurrentIdentity] = useState(mockCurrentIdentity);

  const identityIcons = {
    parent: User,
    teacher: Users,
    organization_admin: Briefcase,
    organization_teacher: Users,
    editor: User,
    operator: User,
    admin: User,
  };

  const IdentityIcon = identityIcons[currentIdentity.identityType] || User;

  const handleSwitch = (identity: (typeof mockIdentities)[0]) => {
    setCurrentIdentity(identity);
    setIsOpen(false);
    // TODO: Call auth store to switch identity
  };

  return (
    <>
      <Button
        variant="outline"
        className={cn("flex items-center gap-2", className)}
        onClick={() => setIsOpen(true)}
      >
        <IdentityIcon className="h-4 w-4" />
        <span className="hidden sm:inline">{currentIdentity.name}</span>
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {currentIdentity.studentCount}学生
        </Badge>
        <ChevronDown className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>切换身份</DialogTitle>
            <DialogDescription>
              选择要使用的身份，不同身份拥有不同的功能权限
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {mockIdentities.map((identity) => {
              const Icon = identityIcons[identity.identityType] || User;
              const isSelected = identity.id === currentIdentity.id;

              return (
                <button
                  key={identity.id}
                  onClick={() => handleSwitch(identity)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      isSelected ? "bg-primary text-white" : "bg-gray-100"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{identity.name}</div>
                    <div className="text-sm text-gray-500">
                      {identity.identityType === "parent" && "管理自己的孩子"}
                      {identity.identityType === "teacher" && `管理 ${identity.studentCount} 名学生`}
                      {identity.identityType === "organization_admin" && "机构管理员"}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </button>
              );
            })}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" asChild>
              <Link href="/identity-switch">管理更多身份</Link>
            </Button>
            <Button asChild>
              <Link href="/workspace">进入工作台</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}