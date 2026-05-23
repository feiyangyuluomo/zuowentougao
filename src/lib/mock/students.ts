// ============================================================================
// 学生Mock数据
// ============================================================================

import type { Student } from "@/types";

// TODO: Replace with real API data

export const MOCK_STUDENTS: Student[] = [
  {
    id: "stu-001",
    ownerIdentityId: "id-001",
    organizationId: undefined,
    classId: undefined,
    studentName: "张小明",
    school: "北京师范大学附属实验小学",
    grade: "4",
    gender: "male",
    avatar: "/images/students/stu-001.jpg",
    phone: undefined,
    parentPhone: "13800138001",
    guideTeacher: "李老师",
    address: "北京市西城区新街口外大街12号",
    birthday: new Date("2015-06-15"),
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "stu-002",
    ownerIdentityId: "id-001",
    organizationId: undefined,
    classId: undefined,
    studentName: "李小雨",
    school: "北京师范大学附属实验小学",
    grade: "2",
    gender: "female",
    avatar: "/images/students/stu-002.jpg",
    phone: undefined,
    parentPhone: "13800138002",
    guideTeacher: "王老师",
    address: "北京市西城区新街口外大街12号",
    birthday: new Date("2017-03-20"),
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "stu-003",
    ownerIdentityId: "id-002",
    organizationId: "org-001",
    classId: "cls-001",
    studentName: "王晨曦",
    school: "上海市第一中心小学",
    grade: "5",
    gender: "female",
    avatar: "/images/students/stu-003.jpg",
    phone: undefined,
    parentPhone: "13900139003",
    guideTeacher: "张老师",
    address: "上海市黄浦区南京东路100号",
    birthday: new Date("2014-09-10"),
    status: "active",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "stu-004",
    ownerIdentityId: "id-002",
    organizationId: "org-001",
    classId: "cls-001",
    studentName: "陈浩然",
    school: "上海市第一中心小学",
    grade: "5",
    gender: "male",
    avatar: undefined,
    phone: undefined,
    parentPhone: "13900139004",
    guideTeacher: "张老师",
    address: "上海市黄浦区南京东路100号",
    birthday: new Date("2014-11-05"),
    status: "active",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "stu-005",
    ownerIdentityId: "id-001",
    organizationId: undefined,
    classId: undefined,
    studentName: "刘思琪",
    school: "广州市华南师范大学附属小学",
    grade: "6",
    gender: "female",
    avatar: "/images/students/stu-005.jpg",
    phone: undefined,
    parentPhone: "13600136005",
    guideTeacher: "陈老师",
    address: "广州市天河区中山大道55号",
    birthday: new Date("2013-07-22"),
    status: "active",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
];

// 获取学生列表
export function getMockStudentList() {
  return MOCK_STUDENTS.map((student) => ({
    id: student.id,
    studentName: student.studentName,
    school: student.school,
    grade: student.grade,
    gender: student.gender,
    avatar: student.avatar,
    essayCount: 0, // TODO: 从 essays 获取
    submissionCount: 0,
    publishedCount: 0,
  }));
}

// 根据ID获取学生详情
export function getMockStudentById(id: string) {
  return MOCK_STUDENTS.find((s) => s.id === id) || null;
}

// 获取某个身份下的学生列表
export function getMockStudentsByOwner(ownerIdentityId: string) {
  return MOCK_STUDENTS.filter((s) => s.ownerIdentityId === ownerIdentityId);
}