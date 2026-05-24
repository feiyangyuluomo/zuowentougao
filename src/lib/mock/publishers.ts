// ============================================================================
// 征稿方Mock数据
// ============================================================================

import type { Publisher } from "@/types";

export const MOCK_PUBLISHERS: Publisher[] = [
  {
    id: "pub-001",
    name: "少年文艺杂志",
    publisherType: "magazine",
    description: "知名青少年文学刊物，创刊50余年，致力于为广大少年儿童提供优质的文学阅读内容。",
    logo: "/images/publishers/youth-literature.png",
    website: "https://www.shaoerwenyi.com",
    contactInfo: "tongxincjb@163.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "pub-002",
    name: "小学生拼音报社",
    publisherType: "newspaper",
    description: "专业小学生拼音学习报纸，帮助学生掌握拼音知识，培养阅读习惯。",
    logo: "/images/publishers/pinyin-daily.png",
    website: "https://www.pinyinbao.com",
    contactInfo: "zuowen@pinyinbao.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "pub-003",
    name: "作文周刊",
    publisherType: "newspaper",
    description: "专注于中小学生作文的报纸，每周发布优秀作文和写作技巧。",
    logo: "/images/publishers/zuowen-weekly.png",
    website: "https://www.zuowenzhoukan.com",
    contactInfo: "bianji@zuowenzhoukan.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "pub-004",
    name: "童趣阅读",
    publisherType: "official_account",
    description: "专注于儿童阅读推广的微信公众号，定期推荐适合中小学生的优秀作文。",
    logo: "/images/publishers/tongqu-reading.png",
    website: "https://mp.weixin.qq.com",
    contactInfo: "tongqureading@163.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "pub-005",
    name: "少年作家杂志",
    publisherType: "magazine",
    description: "培养少年写作兴趣的文学杂志，鼓励原创，展示少年儿童的写作才华。",
    logo: "/images/publishers/young-writer.png",
    website: "https://www.shaonianzuojia.com",
    contactInfo: "tougao@shaonianzuojia.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "pub-006",
    name: "创新作文杂志",
    publisherType: "magazine",
    description: "鼓励创新思维的作文杂志，注重培养学生的想象力和表达能力。",
    logo: "/images/publishers/innovation-writing.png",
    website: "https://www.chuangxin-zuowen.com",
    contactInfo: "chuangxin@zuowen.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

/**
 * 根据ID获取征稿方
 */
export function getMockPublisherById(id: string): Publisher | null {
  return MOCK_PUBLISHERS.find((p) => p.id === id) || null;
}

/**
 * 获取所有征稿方
 */
export function getMockPublisherList(): Publisher[] {
  return MOCK_PUBLISHERS;
}