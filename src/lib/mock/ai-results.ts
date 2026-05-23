// ============================================================================
// Mock AI 推荐结果数据
// ============================================================================

import type { AIRecommendResult, AIRewriteResult, AIAnalysisOutput } from "@/types";

// AI 推荐活动结果
export const MOCK_AI_RECOMMEND_RESULTS: AIRecommendResult[] = [
  {
    activityId: "act-001",
    matchScore: 95,
    matchReasons: [
      "作文主题「成长的烦恼」与活动主题「童心向未来」高度契合",
      "作文风格为记叙文，符合活动要求的文体",
      "字数约600字，适合5-6年级组要求",
    ],
    risks: [
      "该活动竞争激烈，建议同时准备备选活动",
      "注意邮件主题格式必须严格按要求填写",
    ],
    advice: "建议优先投递此活动，获奖机会较大。请确保邮件主题格式为：学校+年级+姓名+作文标题。",
    isSelfSubmissionRecommended: true,
    isAgentSubmissionRecommended: false,
  },
  {
    activityId: "act-003",
    matchScore: 78,
    matchReasons: [
      "作文体现了创新精神，符合活动主题",
      "字数和文体符合初中组要求",
    ],
    risks: [
      "该活动截止时间为8月31日，时间较充裕",
      "需要支付评审费200元",
    ],
    advice: "可作为备选活动，如果初赛通过需缴纳决赛评审费。",
    isSelfSubmissionRecommended: true,
    isAgentSubmissionRecommended: false,
  },
  {
    activityId: "act-004",
    matchScore: 65,
    matchReasons: [
      "作文主题适合日常感悟类征集",
      "该活动为长期征集，投稿时间灵活",
    ],
    risks: [],
    advice: "可作为日常练手投递，门槛较低。",
    isSelfSubmissionRecommended: true,
    isAgentSubmissionRecommended: false,
  },
];

// AI 改稿结果
export const MOCK_AI_REWRITE_RESULT: AIRewriteResult = {
  originalContent: `今天是我的生日，妈妈给我买了一个大蛋糕。\n\n蛋糕上有草莓和蓝莓，非常漂亮。我邀请了好朋友小红和小明一起来家里玩。我们一起唱了生日歌，我许了一个愿望，然后吹灭了蜡烛。\n\n我们吃了蛋糕，还玩了游戏。今天是我最开心的一天！`,
  revisedContent: `清晨，阳光透过窗帘洒进房间，我兴奋得几乎睡不着——今天是我的生日！\n\n妈妈精心准备了一个双层蛋糕，草莓和蓝莓点缀其间，宛如一件艺术品。桌上还放着五颜六色的气球和精心折叠的千纸鹤，房间里弥漫着欢乐的气息。\n\n我邀请了最要好的朋友小红和小明来家里庆祝。当他们带着精心挑选的礼物出现在门口时，我的心像小鸟一样快乐地飞翔。我们一起唱起了生日歌，那旋律温暖而美好。闭上眼睛，我默默许下了一个愿望——希望我们友谊长存。然后，我深深吸了一口气，用力吹灭了跳动的烛火。\n\n香甜的蛋糕、欢快的笑声、纯真的友谊……这份简单的幸福，我会永远珍藏在记忆深处。`,
  suggestions: [
    "开头用环境描写代替直接陈述，增强画面感",
    "增加细节描写，如气球、千纸鹤等，让场景更生动",
    "用比喻和感受描写替代简单陈述，使文章更优美",
    "结尾点题，升华友谊的主题",
  ],
  summary: "通过对场景的细腻描写和情感的深化，将一篇简单的记叙文升华为充满温情的抒情散文。保留了原文的真实情感，同时增强了文学性和可读性。",
  modelName: "deepseek-chat",
};

// AI 分析输出
export const MOCK_AI_ANALYSIS_RESULT: AIAnalysisOutput = {
  grade: "5",
  genre: "narrative",
  theme: ["成长", "友谊", "幸福"],
  writingType: "记叙文",
  qualityScore: 78,
  suggestions: [
    "叙事流畅，结构清晰",
    "情感真挚，但表达略显平淡",
    "可增加更多细节描写和心理活动",
    "结尾可以升华一下主题",
  ],
  suitableActivities: ["主题征文", "作文大赛", "日常征集"],
};

// 获取推荐结果
export function getMockAIRecommendResults(essayId?: string): AIRecommendResult[] {
  // TODO: 实际根据作文ID返回不同的推荐
  return MOCK_AI_RECOMMEND_RESULTS;
}

// 获取改稿结果
export function getMockAIRewriteResult(essayId?: string): AIRewriteResult {
  // TODO: 实际根据作文ID返回不同的结果
  return MOCK_AI_REWRITE_RESULT;
}

// 获取分析结果
export function getMockAIAnalysisResult(content?: string): AIAnalysisOutput {
  // TODO: 实际根据作文内容返回不同的分析
  return MOCK_AI_ANALYSIS_RESULT;
}