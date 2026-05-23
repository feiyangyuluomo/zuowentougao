// ============================================================================
// 活动Mock数据
// ============================================================================

import type { Activity } from "@/types";

// TODO: Replace with real API data

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "act-001",
    publisherId: "pub-001",
    publisher: {
      id: "pub-001",
      name: "少年文艺杂志",
      publisherType: "magazine",
      logo: "/images/publishers/youth-literature.png",
      description: "知名青少年文学刊物",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    title: "2024年\"童心向未来\"主题作文征集",
    activityType: "主题征文",
    gradeScope: ["3", "4", "5", "6"],
    genre: ["narrative", "prose"],
    themeTags: ["成长", "梦想", "未来"],
    submissionEmail: "tongxincjb@163.com",
    submissionMethod: "email",
    submissionFormat:
      "邮件主题：学校+年级+姓名+作文标题，正文粘贴作文内容，附件Word文档",
    emailSubjectFormat: "{{学校}}+{{年级}}+{{姓名}}+{{作文标题}}",
    deadline: new Date("2026-08-30"),
    isLongTerm: false,
    hasPayment: true,
    hasBonus: false,
    hasCertificate: true,
    hasSampleIssue: true,
    hasTeacherGuide: true,
    hasOrgAward: true,
    supportSelfSubmission: true,
    supportAgentSubmission: true,
    activityStatus: "recruiting",
    auditStatus: "approved",
    sourceUrl: "https://www.shaoerwenyi.com",
    originalDetail:
      "一、征文主题：童心向未来\n二、征集对象：3-6年级小学生\n三、内容要求：围绕\"成长\"和\"梦想\"主题，内容真实感人，体现少年儿童的纯真心灵...\n四、字数要求：小学3-4年级不少于400字，5-6年级不少于600字",
    publicSummary:
      "《少年文艺》杂志社主办的年度主题作文征集活动，围绕\"成长\"和\"梦想\"主题，适合3-6年级学生参与。",
    paidDetail:
      "获奖作品将在《少年文艺》 Magazine 发表，优稿优酬。\n投稿邮箱：tongxincjb@163.com",
    coverImage: "/images/activities/act-001-cover.jpg",
    views: 12580,
    submissions: 3280,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-05-01"),
  },
  {
    id: "act-002",
    publisherId: "pub-002",
    publisher: {
      id: "pub-002",
      name: "小学生拼音报社",
      publisherType: "newspaper",
      logo: "/images/publishers/pinyin-daily.png",
      description: "专业小学生拼音学习报纸",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    title: "第十届\"春之声\"作文大赛",
    activityType: "作文大赛",
    gradeScope: ["1", "2", "3", "4", "5", "6"],
    genre: ["narrative", "speech"],
    themeTags: ["春天", "自然", "环保"],
    submissionEmail: "zuowen@pinyinbao.com",
    submissionMethod: "email",
    submissionFormat:
      "邮件主题：年级+姓名+学校+作文标题，附件发送Word文档",
    emailSubjectFormat: "{{年级}}+{{姓名}}+{{学校}}+{{作文标题}}",
    deadline: new Date("2026-06-25"),
    isLongTerm: false,
    hasPayment: false,
    hasBonus: true,
    hasCertificate: true,
    hasSampleIssue: false,
    hasTeacherGuide: false,
    hasOrgAward: true,
    supportSelfSubmission: true,
    supportAgentSubmission: true,
    activityStatus: "closing_soon",
    auditStatus: "approved",
    sourceUrl: "https://www.pinyinbao.com",
    originalDetail:
      "一、大赛主题：\"春之声\"\n二、围绕春天、自然、环保主题写作\n三、分低年级组（1-3年级）和高年级组（4-6年级）\n四、低年级组字数不限，高年级组不少于500字",
    publicSummary:
      "小学生拼音报社主办的年度作文大赛，围绕\"春天\"主题，分低年级和高年级组，获奖者获得奖金和证书。",
    paidDetail: "一等奖500元，二等奖300元，三等奖100元，颁发荣誉证书。",
    coverImage: "/images/activities/act-002-cover.jpg",
    views: 8920,
    submissions: 2156,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "act-003",
    publisherId: "pub-003",
    publisher: {
      id: "pub-003",
      name: "创新作文杂志",
      publisherType: "magazine",
      logo: "/images/publishers/innovation-writing.png",
      description: "专注中小学生创新写作",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    title: "2024年度\"创新杯\"校园文学征集",
    activityType: "文学征集",
    gradeScope: ["5", "6", "7", "8", "9"],
    genre: ["narrative", "argumentative", "prose"],
    themeTags: ["创新", "校园", "科技"],
    submissionEmail: "chuangxinbei@tougui.com",
    submissionMethod: "email",
    submissionFormat: "Word文档附件发送，邮件正文附简短自我介绍",
    emailSubjectFormat: "创新杯+组别+姓名+学校",
    deadline: new Date("2026-09-30"),
    isLongTerm: false,
    hasPayment: true,
    hasBonus: true,
    hasCertificate: true,
    hasSampleIssue: true,
    hasTeacherGuide: true,
    hasOrgAward: true,
    supportSelfSubmission: true,
    supportAgentSubmission: true,
    activityStatus: "recruiting",
    auditStatus: "approved",
    sourceUrl: "https://www.chuangxinbei.com",
    originalDetail:
      "一、征集对象：5-9年级学生\n二、主题要求：体现创新精神，描写校园生活或科技想象\n三、文体不限，散文、议论文、记叙文均可\n四、字数要求：不少于800字",
    publicSummary:
      "创新作文杂志社主办的年度文学征集活动，鼓励创新写作，设置高额奖金和发表机会。",
    paidDetail:
      "特等奖3000元，一等奖1000元，二等奖500元。\n优秀作品在《创新作文》杂志发表。",
    coverImage: "/images/activities/act-003-cover.jpg",
    views: 15230,
    submissions: 4521,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-05-10"),
  },
  {
    id: "act-004",
    publisherId: "pub-004",
    publisher: {
      id: "pub-004",
      name: "作文帮公众号",
      publisherType: "official_account",
      logo: "/images/publishers/zuowenbang.png",
      description: "专业作文投稿平台",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    title: "每周好稿精选征集",
    activityType: "日常征集",
    gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    genre: ["narrative", "prose", "poetry"],
    themeTags: ["日常", "感悟"],
    submissionEmail: "haogao@zuowenbang.com",
    submissionMethod: "email",
    submissionFormat: "邮件主题：姓名+年级+作文标题，正文粘贴正文",
    emailSubjectFormat: "{{姓名}}+{{年级}}+{{作文标题}}",
    deadline: undefined,
    isLongTerm: true,
    hasPayment: false,
    hasBonus: false,
    hasCertificate: false,
    hasSampleIssue: false,
    hasTeacherGuide: false,
    hasOrgAward: false,
    supportSelfSubmission: true,
    supportAgentSubmission: true,
    activityStatus: "long_term",
    auditStatus: "approved",
    sourceUrl: "https://mp.weixin.qq.com/zuowenbang",
    originalDetail:
      "一、长期征集优秀作文\n二、主题不限，记录生活感悟即可\n三、可多次投稿\n四、每周精选3-5篇优秀稿件在公众号展示",
    publicSummary:
      "作文帮公众号长期征集原创优秀作文，每周精选优秀作品在公众号展示推广。",
    paidDetail: "被选中作品将在作文帮公众号展示，优秀作者有机会获得精美礼品。",
    coverImage: "/images/activities/act-004-cover.jpg",
    views: 23450,
    submissions: 8920,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-05-01"),
  },
  {
    id: "act-005",
    publisherId: "pub-005",
    publisher: {
      id: "pub-005",
      name: "童话大王杂志",
      publisherType: "magazine",
      logo: "/images/publishers/fairytale-king.png",
      description: "经典儿童文学刊物",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    title: "2024\"童话大王\"想象力作文征集",
    activityType: "想象作文",
    gradeScope: ["1", "2", "3", "4"],
    genre: ["narrative", "prose"],
    themeTags: ["童话", "想象", "创意"],
    submissionEmail: "tonghua@fairytaleking.com",
    submissionMethod: "email",
    submissionFormat:
      "邮件主题：姓名+年级+作文标题，Word附件，正文附简短创意说明",
    emailSubjectFormat: "{{姓名}}+{{年级}}+{{作文标题}}",
    deadline: new Date("2026-07-31"),
    isLongTerm: false,
    hasPayment: true,
    hasBonus: false,
    hasCertificate: true,
    hasSampleIssue: true,
    hasTeacherGuide: false,
    hasOrgAward: true,
    supportSelfSubmission: true,
    supportAgentSubmission: true,
    activityStatus: "recruiting",
    auditStatus: "approved",
    sourceUrl: "https://www.fairytaleking.com",
    originalDetail:
      "一、征集对象：1-4年级小学生\n二、主题：发挥想象力，创作童话故事\n三、鼓励原创童话，抵制抄袭\n四、字数：1-2年级100字以上，3-4年级300字以上",
    publicSummary:
      "《童话大王》杂志想象力作文征集，鼓励低年级学生发挥想象力创作童话故事，获奖作品有机会发表。",
    paidDetail:
      "入选作品在《童话大王》发表，优稿优酬，赠送样刊。\n优秀作者可成为\"童话大王\"小作家会员。",
    coverImage: "/images/activities/act-005-cover.jpg",
    views: 6780,
    submissions: 1890,
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-05-01"),
  },
  {
    id: "act-006",
    publisherId: "pub-006",
    publisher: {
      id: "pub-006",
      name: "中学生报",
      publisherType: "newspaper",
      logo: "/images/publishers/middle-school-daily.png",
      description: "专业中学生报刊",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    title: "2024\"青春印记\"校园随笔征集",
    activityType: "校园随笔",
    gradeScope: ["7", "8", "9", "10", "11", "12"],
    genre: ["prose", "argumentative"],
    themeTags: ["校园", "青春", "成长", "友情"],
    submissionEmail: "qingchun@zhongxue.com",
    submissionMethod: "email",
    submissionFormat: "邮件主题：组别+学校+姓名+文章标题",
    emailSubjectFormat: "{{组别}}+{{学校}}+{{姓名}}+{{文章标题}}",
    deadline: new Date("2026-10-15"),
    isLongTerm: false,
    hasPayment: false,
    hasBonus: false,
    hasCertificate: true,
    hasSampleIssue: true,
    hasTeacherGuide: true,
    hasOrgAward: false,
    supportSelfSubmission: true,
    supportAgentSubmission: true,
    activityStatus: "recruiting",
    auditStatus: "approved",
    sourceUrl: "https://www.zhongxue.com",
    originalDetail:
      "一、征集对象：初中、高中学生\n二、主题：校园生活、青春感悟\n三、内容真实，情感真挚\n四、初中组字数500-800字，高中组800-1200字",
    publicSummary:
      "《中学生报》校园随笔征集，邀请中学生记录青春校园生活，优秀作品在报纸刊登。",
    paidDetail:
      "刊登作品赠送当日报纸5份，颁发《中学生报》特约小作者证书。\n优秀作者可申请成为报社学生记者。",
    coverImage: "/images/activities/act-006-cover.jpg",
    views: 9870,
    submissions: 2340,
    createdAt: new Date("2024-05-01"),
    updatedAt: new Date("2024-05-15"),
  },
  {
    id: "act-007",
    publisherId: "pub-007",
    publisher: {
      id: "pub-007",
      name: "少年作家杂志",
      publisherType: "magazine",
      logo: "/images/publishers/young-writer.png",
      description: "培养少年作家的摇篮",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    title: "第二十届\"少年作家杯\"全国作文竞赛",
    activityType: "作文竞赛",
    gradeScope: ["3", "4", "5", "6", "7", "8", "9"],
    genre: ["narrative", "argumentative", "prose"],
    themeTags: ["文化", "传承", "创新"],
    submissionEmail: "snzj@shaoerzuojia.com",
    submissionMethod: "email",
    submissionFormat:
      "在线投稿或邮件投稿，邮件主题：组别+姓名+学校+联系方式",
    emailSubjectFormat: "{{组别}}+{{姓名}}+{{学校}}+{{联系方式}}",
    deadline: new Date("2026-10-31"),
    isLongTerm: false,
    hasPayment: true,
    hasBonus: true,
    hasCertificate: true,
    hasSampleIssue: true,
    hasTeacherGuide: true,
    hasOrgAward: true,
    supportSelfSubmission: true,
    supportAgentSubmission: true,
    activityStatus: "recruiting",
    auditStatus: "approved",
    sourceUrl: "https://www.shaoerzuojia.com",
    originalDetail:
      "一、参赛对象：3-9年级学生\n二、分小学组、初中组进行\n三、主题：文化传承与创新\n四、评审团由知名作家、教育专家组成\n五、初赛投稿，决赛现场作文",
    publicSummary:
      "第二十届\"少年作家杯\"全国作文竞赛，由《少年作家》杂志社主办，邀请全国中小学生参与。",
    paidDetail:
      "初赛免费，决赛评审费200元。\n特等奖5000元，一等奖2000元，二等奖800元，三等奖300元。\n获奖作品刊登在《少年作家》杂志。",
    coverImage: "/images/activities/act-007-cover.jpg",
    views: 34560,
    submissions: 12890,
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-06-10"),
  },
  {
    id: "act-008",
    publisherId: "pub-008",
    publisher: {
      id: "pub-008",
      name: "作文周刊",
      publisherType: "magazine",
      logo: "/images/publishers/zuowen-weekly.png",
      description: "专业作文指导周刊",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    title: "2024\"我与自然\"主题散文征集",
    activityType: "散文征集",
    gradeScope: ["4", "5", "6", "7", "8"],
    genre: ["prose"],
    themeTags: ["自然", "环保", "观察"],
    submissionEmail: "woyuziran@zuowenzhoukan.com",
    submissionMethod: "email",
    submissionFormat: "邮件主题：年级+姓名+作文标题，正文附作文和作者介绍",
    emailSubjectFormat: "{{年级}}+{{姓名}}+{{作文标题}}",
    deadline: new Date("2026-06-15"),
    isLongTerm: false,
    hasPayment: true,
    hasBonus: false,
    hasCertificate: true,
    hasSampleIssue: true,
    hasTeacherGuide: true,
    hasOrgAward: false,
    supportSelfSubmission: true,
    supportAgentSubmission: true,
    activityStatus: "recruiting",
    auditStatus: "approved",
    sourceUrl: "https://www.zuowenzhoukan.com",
    originalDetail:
      "一、主题：\"我与自然\"，描写自然风光、动植物、与自然的互动等\n二、文体：散文\n三、字数：小学4-6年级500-800字，初中组800-1200字\n四、作品需原创，展现真情实感",
    publicSummary:
      "《作文周刊》\"我与自然\"主题散文征集，邀请学生用散文形式记录与自然的故事。",
    paidDetail:
      "入选作品在《作文周刊》发表，优稿优酬。\n赠送全年《作文周刊》，颁发荣誉证书。",
    coverImage: "/images/activities/act-008-cover.jpg",
    views: 7890,
    submissions: 2130,
    createdAt: new Date("2024-04-15"),
    updatedAt: new Date("2024-05-01"),
  },
];

// 获取活动列表（简化版）
export function getMockActivityList() {
  return MOCK_ACTIVITIES.map((activity) => ({
    id: activity.id,
    title: activity.title,
    publisherName: activity.publisher?.name || "",
    gradeScope: activity.gradeScope,
    hasPayment: activity.hasPayment,
    hasCertificate: activity.hasCertificate,
    deadline: activity.deadline,
    isLongTerm: activity.isLongTerm,
    activityStatus: activity.activityStatus,
    publicSummary: activity.publicSummary,
    coverImage: activity.coverImage,
  }));
}

// 根据ID获取活动详情
export function getMockActivityById(id: string) {
  return MOCK_ACTIVITIES.find((a) => a.id === id) || null;
}

// 筛选活动
export function filterMockActivities(filters: {
  gradeScope?: string[];
  genre?: string[];
  activityStatus?: string;
  keyword?: string;
  hasPayment?: boolean;
  hasCertificate?: boolean;
  hasSampleIssue?: boolean;
  hasBonus?: boolean;
  hasTeacherGuide?: boolean;
  hasOrgAward?: boolean;
}) {
  return MOCK_ACTIVITIES.filter((activity) => {
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      if (
        !activity.title.toLowerCase().includes(keyword) &&
        !activity.publicSummary?.toLowerCase().includes(keyword)
      ) {
        return false;
      }
    }

    if (filters.gradeScope?.length) {
      if (!activity.gradeScope.some((g) => filters.gradeScope?.includes(g))) {
        return false;
      }
    }

    if (filters.genre?.length) {
      if (!activity.genre?.some((g) => filters.genre?.includes(g))) {
        return false;
      }
    }

    if (filters.activityStatus) {
      if (activity.activityStatus !== filters.activityStatus) {
        return false;
      }
    }

    if (filters.hasPayment && !activity.hasPayment) {
      return false;
    }

    if (filters.hasCertificate && !activity.hasCertificate) {
      return false;
    }

    if (filters.hasSampleIssue && !activity.hasSampleIssue) {
      return false;
    }

    if (filters.hasBonus && !activity.hasBonus) {
      return false;
    }

    if (filters.hasTeacherGuide && !activity.hasTeacherGuide) {
      return false;
    }

    if (filters.hasOrgAward && !activity.hasOrgAward) {
      return false;
    }

    return true;
  });
}