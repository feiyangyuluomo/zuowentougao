// ============================================================================
// 数据库种子数据
// 用于填充 PostgreSQL 数据库的初始数据
//
// 使用方法：
// 1. 先确保 DATABASE_URL 有效
// 2. 运行 npm run db:push 同步 schema
// 3. 运行 npm run db:seed 填充数据
// ============================================================================

import { PrismaClient, IdentityType, EntitlementType, MembershipType, MembershipStatus, PaymentStatus, EssayStatus, EssayVersionType, SelfSubmissionStatus, ActivityStatus, AuditStatus, PublisherType, SubmissionMethod, AgentFrontendStatus, AgentBackendStatus, PriorityLevel, ScreenshotType, StudentStatus, ClassStatus } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================================
// 辅助函数
// ============================================================================

async function upsertUser(params: {
  id: string;
  nickname: string;
  phone: string;
  avatar?: string;
  status?: string;
}) {
  return prisma.user.upsert({
    where: { id: params.id },
    update: {},
    create: {
      id: params.id,
      nickname: params.nickname,
      phone: params.phone,
      avatar: params.avatar,
      status: params.status || "active",
    },
  });
}

async function upsertOrganization(params: {
  id: string;
  name: string;
  description?: string;
  studentLimit?: number;
  teacherLimit?: number;
}) {
  return prisma.organization.upsert({
    where: { id: params.id },
    update: {},
    create: {
      id: params.id,
      name: params.name,
      description: params.description,
      studentLimit: params.studentLimit,
      teacherLimit: params.teacherLimit,
      status: "active",
    },
  });
}

async function upsertIdentity(params: {
  id: string;
  userId: string;
  identityType: IdentityType;
  organizationId?: string;
}) {
  return prisma.userIdentity.upsert({
    where: { id: params.id },
    update: {},
    create: {
      id: params.id,
      userId: params.userId,
      identityType: params.identityType,
      organizationId: params.organizationId,
      status: "active",
    },
  });
}

async function upsertClass(params: {
  id: string;
  organizationId?: string;
  teacherIdentityId?: string;
  className: string;
  grade?: string;
}) {
  return prisma.class.upsert({
    where: { id: params.id },
    update: {},
    create: {
      id: params.id,
      organizationId: params.organizationId,
      teacherIdentityId: params.teacherIdentityId,
      className: params.className,
      grade: params.grade,
      status: ClassStatus.active,
    },
  });
}

async function upsertStudent(params: {
  id: string;
  ownerIdentityId: string;
  organizationId?: string;
  classId?: string;
  studentName: string;
  school?: string;
  grade?: string;
  gender?: string;
  phone?: string;
  parentPhone?: string;
  guideTeacher?: string;
  address?: string;
}) {
  return prisma.student.upsert({
    where: { id: params.id },
    update: {},
    create: {
      id: params.id,
      ownerIdentityId: params.ownerIdentityId,
      organizationId: params.organizationId,
      classId: params.classId,
      studentName: params.studentName,
      school: params.school,
      grade: params.grade,
      gender: params.gender,
      phone: params.phone,
      parentPhone: params.parentPhone,
      guideTeacher: params.guideTeacher,
      address: params.address,
      status: StudentStatus.active,
    },
  });
}

async function upsertPublisher(params: {
  id: string;
  name: string;
  description?: string;
  publisherType: PublisherType;
  website?: string;
  contactInfo?: string;
}) {
  return prisma.publisher.upsert({
    where: { id: params.id },
    update: {},
    create: {
      id: params.id,
      name: params.name,
      description: params.description,
      publisherType: params.publisherType,
      website: params.website,
      contactInfo: params.contactInfo,
    },
  });
}

async function upsertActivity(params: {
  id: string;
  publisherId: string;
  title: string;
  gradeScope: string[];
  genre?: string[];
  submissionEmail?: string;
  submissionMethod?: SubmissionMethod;
  submissionFormat?: string;
  emailSubjectFormat?: string;
  deadline?: Date;
  isLongTerm?: boolean;
  hasPayment?: boolean;
  hasBonus?: boolean;
  hasCertificate?: boolean;
  hasSampleIssue?: boolean;
  activityStatus?: ActivityStatus;
  auditStatus?: AuditStatus;
  publicSummary?: string;
  originalDetail?: string;
}) {
  return prisma.activity.upsert({
    where: { id: params.id },
    update: {},
    create: {
      id: params.id,
      publisherId: params.publisherId,
      title: params.title,
      gradeScope: params.gradeScope,
      genre: params.genre || [],
      submissionEmail: params.submissionEmail,
      submissionMethod: params.submissionMethod,
      submissionFormat: params.submissionFormat,
      emailSubjectFormat: params.emailSubjectFormat,
      deadline: params.deadline,
      isLongTerm: params.isLongTerm || false,
      hasPayment: params.hasPayment || false,
      hasBonus: params.hasBonus || false,
      hasCertificate: params.hasCertificate || false,
      hasSampleIssue: params.hasSampleIssue || false,
      activityStatus: params.activityStatus || ActivityStatus.recruiting,
      auditStatus: params.auditStatus || AuditStatus.approved,
      publicSummary: params.publicSummary || "",
      originalDetail: params.originalDetail,
    },
  });
}

async function upsertEssay(params: {
  id: string;
  studentId: string;
  ownerIdentityId: string;
  title: string;
  content: string;
  wordCount: number;
  genre?: string;
}) {
  return prisma.essay.upsert({
    where: { id: params.id },
    update: {},
    create: {
      id: params.id,
      studentId: params.studentId,
      ownerIdentityId: params.ownerIdentityId,
      title: params.title,
      content: params.content,
      wordCount: params.wordCount,
      genre: params.genre,
      status: EssayStatus.draft,
      themeTags: [],
    },
  });
}

async function upsertEssayVersion(params: {
  id: string;
  essayId: string;
  versionType: EssayVersionType;
  content: string;
  summary?: string;
  createdByIdentityId?: string;
  modelName?: string;
}) {
  return prisma.essayVersion.upsert({
    where: { id: params.id },
    update: {},
    create: {
      id: params.id,
      essayId: params.essayId,
      versionType: params.versionType,
      content: params.content,
      summary: params.summary,
      createdByIdentityId: params.createdByIdentityId,
      modelName: params.modelName,
    },
  });
}

async function upsertEntitlement(params: {
  id: string;
  identityId: string;
  entitlementType: EntitlementType;
  gradeScope: string[];
  aiQuota?: number;
  expiredAt: Date;
}) {
  return prisma.entitlement.upsert({
    where: { id: params.id },
    update: {},
    create: {
      id: params.id,
      identityId: params.identityId,
      entitlementType: params.entitlementType,
      gradeScope: params.gradeScope,
      aiQuota: params.aiQuota,
      expiredAt: params.expiredAt,
    },
  });
}

async function upsertMembership(params: {
  id: string;
  identityId: string;
  memberType: MembershipType;
  gradeScope: string[];
  validFrom: Date;
  validTo: Date;
  isLifetime?: boolean;
  status?: MembershipStatus;
}) {
  return prisma.membership.upsert({
    where: { id: params.id },
    update: {},
    create: {
      id: params.id,
      identityId: params.identityId,
      memberType: params.memberType,
      gradeScope: params.gradeScope,
      validFrom: params.validFrom,
      validTo: params.validTo,
      isLifetime: params.isLifetime || false,
      status: params.status || MembershipStatus.active,
    },
  });
}

async function upsertOrder(params: {
  id: string;
  identityId: string;
  organizationId?: string;
  orderType: "membership" | "ai_rewrite" | "agent_submission" | "manual_review" | "organization_package";
  orderTitle: string;
  amount: number;
  paymentStatus: PaymentStatus;
  paidAt?: Date;
  expiredAt?: Date;
  relatedStudentName?: string;
  relatedEssayTitle?: string;
  remarks?: string;
}) {
  return prisma.order.upsert({
    where: { id: params.id },
    update: {},
    create: {
      id: params.id,
      identityId: params.identityId,
      organizationId: params.organizationId,
      orderType: params.orderType,
      orderTitle: params.orderTitle,
      amount: params.amount,
      paymentStatus: params.paymentStatus,
      paidAt: params.paidAt,
      expiredAt: params.expiredAt,
      relatedStudentName: params.relatedStudentName,
      relatedEssayTitle: params.relatedEssayTitle,
      remarks: params.remarks,
    },
  });
}

async function upsertSelfSubmission(params: {
  id: string;
  essayId: string;
  activityId: string;
  identityId: string;
  studentId: string;
  submissionEmail?: string;
  submissionMethod?: SubmissionMethod;
  submissionStatus?: SelfSubmissionStatus;
  userSubmissionTime?: Date;
  userNote?: string;
}) {
  return prisma.selfSubmission.upsert({
    where: { id: params.id },
    update: {},
    create: {
      id: params.id,
      essayId: params.essayId,
      activityId: params.activityId,
      identityId: params.identityId,
      studentId: params.studentId,
      submissionEmail: params.submissionEmail,
      submissionMethod: params.submissionMethod,
      submissionStatus: params.submissionStatus || SelfSubmissionStatus.user_submitted,
      userSubmissionTime: params.userSubmissionTime,
      userNote: params.userNote,
    },
  });
}

async function upsertAgentSubmissionTask(params: {
  id: string;
  essayId: string;
  activityId: string;
  identityId: string;
  studentId: string;
  frontendStatus?: AgentFrontendStatus;
  backendStatus?: AgentBackendStatus;
  priorityLevel?: PriorityLevel;
  orderId?: string;
  operatorIdentityId?: string;
  submissionTime?: Date;
  riskConfirmed?: boolean;
}) {
  return prisma.agentSubmissionTask.upsert({
    where: { id: params.id },
    update: {},
    create: {
      id: params.id,
      essayId: params.essayId,
      activityId: params.activityId,
      identityId: params.identityId,
      studentId: params.studentId,
      frontendStatus: params.frontendStatus || AgentFrontendStatus.submitted,
      backendStatus: params.backendStatus || AgentBackendStatus.submitted,
      priorityLevel: params.priorityLevel || PriorityLevel.medium,
      orderId: params.orderId,
      operatorIdentityId: params.operatorIdentityId,
      submissionTime: params.submissionTime,
      riskConfirmed: params.riskConfirmed || true,
    },
  });
}

// ============================================================================
// 种子数据函数
// ============================================================================

async function seedUsers() {
  console.log("📝 创建用户...");
  await upsertUser({ id: "user-parent-001", nickname: "付费家长小明", phone: "13800138001" });
  await upsertUser({ id: "user-operator-001", nickname: "运营小王", phone: "13800138002" });
  await upsertUser({ id: "user-teacher-001", nickname: "张老师", phone: "13800138003" });
  await upsertUser({ id: "user-org-admin-001", nickname: "李管理员", phone: "13800138004" });
  await upsertUser({ id: "user-org-teacher-001", nickname: "王老师", phone: "13800138005" });
  console.log("✅ 5 个用户创建完成");
}

async function seedOrganizations() {
  console.log("📝 创建机构...");
  await upsertOrganization({
    id: "org-001",
    name: "上海创意文学社",
    description: "专注于青少年创意写作培养的文学社团",
    studentLimit: 100,
    teacherLimit: 10,
  });
  console.log("✅ 1 个机构创建完成");
}

async function seedIdentities() {
  console.log("📝 创建身份...");
  await upsertIdentity({ id: "id-parent-001", userId: "user-parent-001", identityType: IdentityType.parent });
  await upsertIdentity({ id: "id-operator-001", userId: "user-operator-001", identityType: IdentityType.operator });
  await upsertIdentity({ id: "id-teacher-001", userId: "user-teacher-001", identityType: IdentityType.teacher });
  await upsertIdentity({ id: "id-org-admin-001", userId: "user-org-admin-001", identityType: IdentityType.organization_admin, organizationId: "org-001" });
  await upsertIdentity({ id: "id-org-teacher-001", userId: "user-org-teacher-001", identityType: IdentityType.organization_teacher, organizationId: "org-001" });
  console.log("✅ 5 个身份创建完成");
}

async function seedClasses() {
  console.log("📝 创建班级...");
  await upsertClass({
    id: "cls-self-001",
    teacherIdentityId: "id-teacher-001",
    className: "张小明作文班",
    grade: "4",
  });
  await upsertClass({
    id: "cls-001",
    organizationId: "org-001",
    teacherIdentityId: "id-org-teacher-001",
    className: "文学创作初级班",
    grade: "3-4",
  });
  console.log("✅ 2 个班级创建完成");
}

async function seedStudents() {
  console.log("📝 创建学生...");
  await upsertStudent({
    id: "student-parent-001",
    ownerIdentityId: "id-parent-001",
    studentName: "小明",
    school: "上海第一小学",
    grade: "4",
    gender: "male",
    parentPhone: "13800138001",
  });
  await upsertStudent({
    id: "student-teacher-001",
    ownerIdentityId: "id-teacher-001",
    studentName: "小红",
    school: "北京第二小学",
    grade: "5",
    gender: "female",
    parentPhone: "13900139001",
  });
  await upsertStudent({
    id: "student-org-001",
    ownerIdentityId: "id-org-teacher-001",
    organizationId: "org-001",
    classId: "cls-001",
    studentName: "小华",
    school: "上海创意文学社附小",
    grade: "3",
    gender: "male",
    parentPhone: "13700137001",
  });
  console.log("✅ 3 个学生创建完成");
}

async function seedPublishers() {
  console.log("📝 创建征稿方...");
  await upsertPublisher({
    id: "pub-001",
    name: "少年文学院",
    description: "专业青少年文学杂志",
    publisherType: PublisherType.magazine,
    website: "https://example.com",
    contactInfo: "editor@example.com",
  });
  await upsertPublisher({
    id: "pub-002",
    name: "创新作文组委会",
    description: "全国中小学作文大赛组委会",
    publisherType: PublisherType.organization,
    website: "https://example.com/chuangxin",
    contactInfo: "contest@example.com",
  });
  console.log("✅ 2 个征稿方创建完成");
}

async function seedActivities() {
  console.log("📝 创建活动...");
  await upsertActivity({
    id: "activity-001",
    publisherId: "pub-001",
    title: "《少年文学院》夏季刊征稿",
    gradeScope: ["3-4年级", "5-6年级"],
    genre: ["记叙文", "散文"],
    submissionEmail: "tougao@youthwriting.com",
    submissionMethod: SubmissionMethod.email,
    submissionFormat: "word文档，邮件主题：学校-年级-姓名-文章标题",
    deadline: new Date("2026-08-31"),
    isLongTerm: false,
    hasPayment: true,
    hasCertificate: true,
    hasSampleIssue: true,
    activityStatus: ActivityStatus.recruiting,
    auditStatus: AuditStatus.approved,
    publicSummary: "《少年文学院》夏季刊正在征稿，欢迎全国各地中小学生投稿！",
  });
  await upsertActivity({
    id: "activity-002",
    publisherId: "pub-002",
    title: "第十届全国创新作文大赛",
    gradeScope: ["1-2年级", "3-4年级", "5-6年级", "初中", "高中"],
    genre: ["记叙文", "议论文"],
    submissionMethod: SubmissionMethod.website,
    submissionFormat: "官网在线提交",
    deadline: new Date("2026-06-30"),
    isLongTerm: false,
    hasPayment: false,
    hasCertificate: true,
    hasBonus: true,
    activityStatus: ActivityStatus.closing_soon,
    auditStatus: AuditStatus.approved,
    publicSummary: "全国创新作文大赛，获奖者有机会获得奖金和证书",
  });
  await upsertActivity({
    id: "activity-003",
    publisherId: "pub-001",
    title: "《少年文学院》长期征稿",
    gradeScope: ["1-2年级", "3-4年级", "5-6年级"],
    genre: ["记叙文", "诗歌", "书信"],
    submissionEmail: "tougao@youthwriting.com",
    submissionMethod: SubmissionMethod.email,
    isLongTerm: true,
    hasPayment: true,
    hasCertificate: true,
    activityStatus: ActivityStatus.long_term,
    auditStatus: AuditStatus.approved,
    publicSummary: "《少年文学院》长期征稿，随时欢迎投稿",
  });
  console.log("✅ 3 个活动创建完成");
}

async function seedEssays() {
  console.log("📝 创建作文...");
  await upsertEssay({
    id: "essay-001",
    studentId: "student-parent-001",
    ownerIdentityId: "id-parent-001",
    title: "春天的校园",
    content: "春天来了，校园里的花都开了。粉红的桃花，雪白的梨花，还有金黄的迎春花，把校园装点得五彩缤纷。",
    wordCount: 58,
    genre: "narrative",
  });
  await upsertEssay({
    id: "essay-002",
    studentId: "student-teacher-001",
    ownerIdentityId: "id-teacher-001",
    title: "我的妈妈",
    content: "我的妈妈有一双勤劳的手，每天早出晚归，照顾我和爸爸。妈妈喜欢吃苹果，我也喜欢吃苹果。",
    wordCount: 52,
    genre: "narrative",
  });
  await upsertEssay({
    id: "essay-003",
    studentId: "student-org-001",
    ownerIdentityId: "id-org-teacher-001",
    title: "夏夜的星空",
    content: "夏天的夜晚，我坐在院子里仰望星空。满天的星星像无数颗钻石，闪闪发光。",
    wordCount: 42,
    genre: "prose",
  });
  console.log("✅ 3 篇作文创建完成");
}

async function seedEssayVersions() {
  console.log("📝 创建作文版本...");
  await upsertEssayVersion({
    id: "version-001",
    essayId: "essay-001",
    versionType: EssayVersionType.original,
    content: "春天来了，校园里的花都开了。粉红的桃花，雪白的梨花，还有金黄的迎春花，把校园装点得五彩缤纷。",
    summary: "原稿",
  });
  await upsertEssayVersion({
    id: "version-002",
    essayId: "essay-002",
    versionType: EssayVersionType.original,
    content: "我的妈妈有一双勤劳的手，每天早出晚归，照顾我和爸爸。妈妈喜欢吃苹果，我也喜欢吃苹果。",
    summary: "原稿",
  });
  await upsertEssayVersion({
    id: "version-003",
    essayId: "essay-003",
    versionType: EssayVersionType.original,
    content: "夏天的夜晚，我坐在院子里仰望星空。满天的星星像无数颗钻石，闪闪发光。",
    summary: "原稿",
  });
  console.log("✅ 3 个作文版本创建完成");
}

async function seedEntitlements() {
  console.log("📝 创建权益...");
  const gradeScope = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const expiredAt = new Date("2026-12-31");

  // 家长权益
  await upsertEntitlement({ id: "ent-parent-001", identityId: "id-parent-001", entitlementType: EntitlementType.view_activity_detail, gradeScope, expiredAt });
  await upsertEntitlement({ id: "ent-parent-002", identityId: "id-parent-001", entitlementType: EntitlementType.view_submission_email, gradeScope, expiredAt });
  await upsertEntitlement({ id: "ent-parent-003", identityId: "id-parent-001", entitlementType: EntitlementType.ai_rewrite, gradeScope, aiQuota: 10, expiredAt });
  await upsertEntitlement({ id: "ent-parent-004", identityId: "id-parent-001", entitlementType: EntitlementType.ai_recommend, gradeScope, aiQuota: 20, expiredAt });

  // 老师权益
  await upsertEntitlement({ id: "ent-teacher-001", identityId: "id-teacher-001", entitlementType: EntitlementType.view_activity_detail, gradeScope, expiredAt });
  await upsertEntitlement({ id: "ent-teacher-002", identityId: "id-teacher-001", entitlementType: EntitlementType.view_submission_email, gradeScope, expiredAt });
  await upsertEntitlement({ id: "ent-teacher-003", identityId: "id-teacher-001", entitlementType: EntitlementType.ai_rewrite, gradeScope, aiQuota: 50, expiredAt });
  await upsertEntitlement({ id: "ent-teacher-004", identityId: "id-teacher-001", entitlementType: EntitlementType.ai_recommend, gradeScope, aiQuota: 100, expiredAt });

  // 机构管理员权益
  await upsertEntitlement({ id: "ent-org-admin-001", identityId: "id-org-admin-001", entitlementType: EntitlementType.view_activity_detail, gradeScope, expiredAt });
  await upsertEntitlement({ id: "ent-org-admin-002", identityId: "id-org-admin-001", entitlementType: EntitlementType.view_submission_email, gradeScope, expiredAt });
  await upsertEntitlement({ id: "ent-org-admin-003", identityId: "id-org-admin-001", entitlementType: EntitlementType.ai_rewrite, gradeScope, aiQuota: 200, expiredAt });
  await upsertEntitlement({ id: "ent-org-admin-004", identityId: "id-org-admin-001", entitlementType: EntitlementType.ai_recommend, gradeScope, aiQuota: 500, expiredAt });

  // 机构老师权益
  await upsertEntitlement({ id: "ent-org-teacher-001", identityId: "id-org-teacher-001", entitlementType: EntitlementType.view_activity_detail, gradeScope, expiredAt });
  await upsertEntitlement({ id: "ent-org-teacher-002", identityId: "id-org-teacher-001", entitlementType: EntitlementType.view_submission_email, gradeScope, expiredAt });
  await upsertEntitlement({ id: "ent-org-teacher-003", identityId: "id-org-teacher-001", entitlementType: EntitlementType.ai_rewrite, gradeScope, aiQuota: 50, expiredAt });
  await upsertEntitlement({ id: "ent-org-teacher-004", identityId: "id-org-teacher-001", entitlementType: EntitlementType.ai_recommend, gradeScope, aiQuota: 100, expiredAt });

  console.log("✅ 16 个权益创建完成");
}

async function seedMemberships() {
  console.log("📝 创建会员...");
  const gradeScope = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const validFrom = new Date("2025-01-01");
  const validTo = new Date("2026-12-31");

  await upsertMembership({
    id: "mem-parent-001",
    identityId: "id-parent-001",
    memberType: MembershipType.yearly,
    gradeScope,
    validFrom,
    validTo,
  });
  await upsertMembership({
    id: "mem-teacher-001",
    identityId: "id-teacher-001",
    memberType: MembershipType.yearly,
    gradeScope,
    validFrom,
    validTo,
  });
  await upsertMembership({
    id: "mem-org-admin-001",
    identityId: "id-org-admin-001",
    memberType: MembershipType.yearly,
    gradeScope,
    validFrom,
    validTo,
  });
  await upsertMembership({
    id: "mem-org-teacher-001",
    identityId: "id-org-teacher-001",
    memberType: MembershipType.yearly,
    gradeScope,
    validFrom,
    validTo,
  });
  console.log("✅ 4 个会员创建完成");
}

async function seedOrders() {
  console.log("📝 创建订单...");
  const paidAt = new Date("2025-01-15");

  // 家长订单
  await upsertOrder({
    id: "order-001",
    identityId: "id-parent-001",
    orderType: "membership",
    orderTitle: "年费会员",
    amount: 29900,
    paymentStatus: PaymentStatus.paid,
    paidAt,
    expiredAt: new Date("2026-01-15"),
    remarks: "年费会员权益",
  });
  await upsertOrder({
    id: "order-002",
    identityId: "id-parent-001",
    orderType: "ai_rewrite",
    orderTitle: "AI作文批改 × 5次",
    amount: 2500,
    paymentStatus: PaymentStatus.paid,
    paidAt: new Date("2025-03-10"),
    relatedStudentName: "小明",
  });
  await upsertOrder({
    id: "order-003",
    identityId: "id-parent-001",
    orderType: "agent_submission",
    orderTitle: "平台代投服务 × 3篇",
    amount: 15000,
    paymentStatus: PaymentStatus.paid,
    paidAt: new Date("2025-04-20"),
    relatedStudentName: "小明",
    relatedEssayTitle: "春天的校园",
  });

  // 老师订单
  await upsertOrder({
    id: "order-005",
    identityId: "id-teacher-001",
    orderType: "membership",
    orderTitle: "年费会员（老师）",
    amount: 19900,
    paymentStatus: PaymentStatus.paid,
    paidAt: new Date("2025-01-10"),
    expiredAt: new Date("2026-01-10"),
    remarks: "老师年费会员权益",
  });
  await upsertOrder({
    id: "order-006",
    identityId: "id-teacher-001",
    orderType: "ai_rewrite",
    orderTitle: "AI作文批改 × 20次套餐",
    amount: 8000,
    paymentStatus: PaymentStatus.paid,
    paidAt: new Date("2025-02-15"),
    relatedStudentName: "学生A",
  });
  console.log("✅ 5 个订单创建完成");
}

async function seedSelfSubmissions() {
  console.log("📝 创建自主投稿记录...");
  await upsertSelfSubmission({
    id: "self-sub-001",
    essayId: "essay-001",
    activityId: "activity-001",
    identityId: "id-parent-001",
    studentId: "student-parent-001",
    submissionEmail: "xiaoming@email.com",
    submissionMethod: SubmissionMethod.email,
    submissionStatus: SelfSubmissionStatus.waiting_reply,
    userSubmissionTime: new Date("2025-05-01"),
    userNote: "已按格式要求发送邮件",
  });
  await upsertSelfSubmission({
    id: "self-sub-002",
    essayId: "essay-002",
    activityId: "activity-002",
    identityId: "id-teacher-001",
    studentId: "student-teacher-001",
    submissionMethod: SubmissionMethod.website,
    submissionStatus: SelfSubmissionStatus.shortlisted,
    userSubmissionTime: new Date("2025-05-15"),
    userNote: "官网在线提交",
  });
  console.log("✅ 2 个自主投稿创建完成");
}

async function seedAgentSubmissions() {
  console.log("📝 创建平台代投任务...");
  await upsertAgentSubmissionTask({
    id: "agent-task-001",
    essayId: "essay-001",
    activityId: "activity-003",
    identityId: "id-parent-001",
    studentId: "student-parent-001",
    orderId: "order-003",
    frontendStatus: AgentFrontendStatus.published,
    backendStatus: AgentBackendStatus.published,
    priorityLevel: PriorityLevel.high,
    submissionTime: new Date("2025-05-25"),
    riskConfirmed: true,
  });
  console.log("✅ 1 个代投任务创建完成");
}

// ============================================================================
// 主函数
// ============================================================================

async function main() {
  console.log("\n🌱 开始填充数据库种子数据...\n");

  try {
    await seedUsers();
    await seedOrganizations();
    await seedIdentities();
    await seedClasses();
    await seedStudents();
    await seedPublishers();
    await seedActivities();
    await seedEssays();
    await seedEssayVersions();
    await seedEntitlements();
    await seedMemberships();
    await seedOrders();
    await seedSelfSubmissions();
    await seedAgentSubmissions();

    console.log("\n✅ 数据库种子数据填充完成！\n");
  } catch (error) {
    console.error("❌ 种子数据填充失败:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();