// ============================================================================
// 作文Mock数据
// ============================================================================

import type { Essay, EssayVersion } from "@/types";

// TODO: Replace with real API data

export const MOCK_ESSAYS: Essay[] = [
  {
    id: "ess-001",
    studentId: "stu-001",
    ownerIdentityId: "id-001",
    title: "我的植物朋友",
    content: `我有一个特殊的植物朋友，它是一盆绿萝，是我生日时妈妈送给我的。

这盆绿萝长得很茂盛，叶子绿油油的，像一个个小爱心。它的茎很长，可以顺着花盆边沿垂下来，像一条绿色的瀑布。

每天放学回家，我都会第一时间去看它。我会给它浇水，有时候还会和它聊天。虽然它不会说话，但我觉得它能听懂我的话，因为我每次和它说话的时候，它的叶子都会轻轻晃动，像是在回应我。

绿萝的生命力很强。有一次我忘了给它浇水，整整一个星期，它都没有死，只是叶子有点发黄。后来我给它浇了水，没过几天，它又恢复了绿油油的样子。

我的植物朋友——绿萝，它教会了我什么是坚持，什么是坚强。我一定会好好照顾它，让它陪伴我一起成长。`,
    wordCount: 356,
    genre: "narrative",
    themeTags: ["植物", "朋友", "成长"],
    status: "published",
    coverImage: undefined,
    latestVersionId: "ver-ess-001-002",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "ess-002",
    studentId: "stu-001",
    ownerIdentityId: "id-001",
    title: "春天的小区",
    content: `春天来了，我居住的小区变得可美了！

小区的花园里，花儿都开了。有红的桃花，有白的梨花，还有黄的迎春花。它们争奇斗艳，漂亮极了！蜜蜂和蝴蝶在花丛中飞舞，好像在捉迷藏。

小区的柳树也发芽了，嫩绿的柳叶在风中飘荡，像一个个绿色的小辫子。小河里的冰都化了，水哗哗地流着，偶尔还能看到小鱼在水里游来游去。

小区里的人也多了起来。爷爷奶奶在亭子里聊天，小朋友们在草地上玩耍，有的在放风筝，有的在踢球，还有的在捉蝴蝶。

我爱春天的小区，春天的小区真美啊！`,
    wordCount: 268,
    genre: "narrative",
    themeTags: ["春天", "景色", "小区"],
    status: "published",
    coverImage: undefined,
    latestVersionId: "ver-ess-002-001",
    createdAt: new Date("2024-03-18"),
    updatedAt: new Date("2024-03-18"),
  },
  {
    id: "ess-003",
    studentId: "stu-003",
    ownerIdentityId: "id-002",
    title: "记一次有趣的科学实验",
    content: `今天，我在学校做了一个有趣的小实验——摩擦起电。

实验很简单，只需要一把塑料尺子和一些碎纸屑。首先，我拿起塑料尺子在头发上不停地摩擦，大约摩擦了二十几下。然后，我小心翼翼地把摩擦过的尺子靠近纸屑。

哇！奇迹发生了！那些碎纸屑像被施了魔法一样，纷纷跳起来粘在尺子上，有的像小跳舞演员一样转圈圈，有的像小降落伞一样飘落，还有的直接吸在尺子上不肯下来。

老师告诉我们，这是因为摩擦产生了静电，塑料尺子带上电荷，就能吸引轻小的纸屑了。

这个实验太有趣了！我回家后还要试试用其他东西，看看还能不能产生静电。

科学真神奇啊！`,
    wordCount: 320,
    genre: "narrative",
    themeTags: ["科学", "实验", "发现"],
    status: "published",
    coverImage: undefined,
    latestVersionId: "ver-ess-003-002",
    createdAt: new Date("2024-04-10"),
    updatedAt: new Date("2024-04-12"),
  },
  {
    id: "ess-004",
    studentId: "stu-005",
    ownerIdentityId: "id-001",
    title: "我最喜欢的一个人",
    content: `在我心中，我最喜欢的人是我的奶奶。

奶奶今年六十多岁了，头发花白，脸上布满了皱纹，但她的眼睛总是亮晶晶的，充满了慈爱。

奶奶非常疼我。每次我去奶奶家，她都会准备一大桌子我最爱吃的菜。红烧肉、糖醋排骨、清蒸鱼……每次我都吃得肚子圆滚滚的。

奶奶还很勤劳。每天早上，她总是第一个起床，打扫院子，浇花，然后给我们做早餐。她从来不喊累，总是笑眯眯的。

奶奶还教会我很多东西。她教我包饺子，教我做家务，还教我很多人生的道理。她说：“做人要诚实，要善良，要勤奋。”我一直记在心里。

这就是我最喜欢的奶奶。我希望奶奶身体健康，长命百岁，等我长大了，我要好好孝顺她。`,
    wordCount: 368,
    genre: "narrative",
    themeTags: ["亲情", "奶奶", "家人"],
    status: "draft",
    coverImage: undefined,
    latestVersionId: "ver-ess-004-001",
    createdAt: new Date("2024-04-20"),
    updatedAt: new Date("2024-04-20"),
  },
  {
    id: "ess-005",
    studentId: "stu-002",
    ownerIdentityId: "id-001",
    title: "看图写话：小熊学游泳",
    content: `夏天到了，小熊哈利想学游泳。

第一天，熊妈妈带哈利来到游泳池边。哈利看着那一池蓝蓝的水，心里有点害怕。它想：水会不会很深？会不会淹着我？

熊妈妈看出了哈利的担心，温柔地说：“别怕，妈妈会保护你的。”说完，就把哈利抱进了水里。

一开始，哈利很紧张，双手紧紧搂着熊妈妈的脖子，脚也不会蹬水。但是慢慢地，哈利发现水是温的，而且有妈妈的拥抱，它就不那么害怕了。

第二天，哈利敢自己下水了。它学着妈妈的样子，手脚乱蹬，虽然姿势不太好看，但是它不怕水了。

第三天，小熊哈利终于学会了游泳，它开心极了！

这个故事告诉我们：不管做什么事，都要勇敢尝试，不要害怕困难。`,
    wordCount: 286,
    genre: "narrative",
    themeTags: ["动物", "勇敢", "学习"],
    status: "published",
    coverImage: undefined,
    latestVersionId: "ver-ess-005-001",
    createdAt: new Date("2024-04-25"),
    updatedAt: new Date("2024-04-25"),
  },
];

// 作文版本
export const MOCK_ESSAY_VERSIONS: EssayVersion[] = [
  {
    id: "ver-ess-001-001",
    essayId: "ess-001",
    versionType: "original",
    content: MOCK_ESSAYS[0].content,
    summary: "原创作文",
    createdByIdentityId: "id-001",
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "ver-ess-001-002",
    essayId: "ess-001",
    versionType: "ai_rewrite",
    content: `我有一个特殊的植物朋友，它是一盆绿萝，是我生日时妈妈送给我的。

这盆绿萝长得很茂盛，叶子绿油油的，像一个个小爱心，又像一滴滴翠绿的翡翠。它的茎又细又长，顺着花盆边沿垂下来，仿佛一道倾泻而下的绿色瀑布，为我的房间增添了几分生机。

每天放学回家，我都会第一时间去看望它。我轻轻地为它浇水，水珠在叶片上滚动，在阳光下闪闪发光，像一颗颗晶莹的珍珠。有时候，我还会轻声地和它聊天。虽然它不会说话，不能回应我的话语，但我总觉得它能感受到我的心意——每次我和它说话时，它的叶子都会轻轻晃动，像是在点头，像是在对我微笑，仿佛在说："小主人，我听到了。"

绿萝的生命力非常顽强。有一次，我因为学习忙碌，忘了给它浇水，整整一个星期，它都没有得到水分的滋养。当我想起它时，它的叶子已经有些发黄了，我心疼极了，心想它会不会枯萎死去。可是后来，我为它浇了水，给它充足的阳光，没过几天，它又恢复了往日生机勃勃的模样——叶子重新变得绿油油的，充满了生命的活力。

我的植物朋友——绿萝，虽然不会说话，不会走路，但它用那顽强的生命力教会了我什么是坚持，什么是坚强。我也一定会好好照顾它，让它陪伴我一起成长，见证我的每一天进步。

（AI改稿，在保持原文真情实感的基础上，适当增加了修辞手法的运用，使文章更加生动。）`,
    summary:
      "AI改稿建议：增加了修辞手法运用，使文章更加生动，同时保持了原文的真情实感。",
    createdByIdentityId: "id-001",
    modelName: "deepseek-chat",
    createdAt: new Date("2024-03-20"),
  },
  {
    id: "ver-ess-003-001",
    essayId: "ess-003",
    versionType: "original",
    content: MOCK_ESSAYS[2].content,
    summary: "原创作文",
    createdByIdentityId: "id-002",
    createdAt: new Date("2024-04-10"),
  },
  {
    id: "ver-ess-003-002",
    essayId: "ess-003",
    versionType: "ai_rewrite",
    content: `今天，我在学校做了一个有趣的小实验——摩擦起电。

实验材料很简单：一把普通的塑料尺子，一些细碎的纸屑。实验过程也很有趣：首先，我拿起塑料尺子，在我的头发上不停地摩擦，大概摩擦了二十几下，我的头发都快被磨得竖起来了。然后，我小心翼翼地把摩擦过的尺子靠近那些碎纸屑。

哇！奇迹发生了！那些原本静静躺在桌上的碎纸屑，像被施了魔法一样，纷纷跳跃起来，紧紧地粘在了尺子上。有的像小小的跳舞演员，在尺子周围转圈圈，舞姿轻盈；有的像小小的降落伞，在空中慢慢飘落，优雅极了；还有的仿佛找到了归宿，直接吸附在尺子上，不肯下来。

老师告诉我们，这是因为摩擦产生了静电。当塑料尺子在头发上摩擦时，尺子上带了电荷，这些电荷能吸引轻小的纸屑，这就是神奇的"摩擦起电"现象。

这个实验太有趣了！回家后，我还要找找看，生活中还有哪些东西可以产生静电呢？用气球能不能也做这个实验？

科学的世界真是奇妙无穷啊！我要好好学习，去探索更多科学的奥秘。`,
    summary:
      "AI改稿建议：丰富了实验细节的描写，增加了对实验现象的想象，使文章更加生动有趣。",
    createdByIdentityId: "id-002",
    modelName: "deepseek-chat",
    createdAt: new Date("2024-04-12"),
  },
];

// 获取作文列表
export function getMockEssayList() {
  return MOCK_ESSAYS.map((essay) => ({
    id: essay.id,
    title: essay.title,
    wordCount: essay.wordCount,
    genre: essay.genre,
    themeTags: essay.themeTags,
    status: essay.status,
    updatedAt: essay.updatedAt,
    latestVersionType: MOCK_ESSAY_VERSIONS.find(
      (v) => v.id === essay.latestVersionId
    )?.versionType,
    submissionCount: 0,
  }));
}

// 根据ID获取作文详情
export function getMockEssayById(id: string) {
  return MOCK_ESSAYS.find((e) => e.id === id) || null;
}

// 获取某个学生的作文列表
export function getMockEssaysByStudentId(studentId: string) {
  return MOCK_ESSAYS.filter((e) => e.studentId === studentId).map((essay) => ({
    id: essay.id,
    title: essay.title,
    wordCount: essay.wordCount,
    genre: essay.genre,
    status: essay.status,
    updatedAt: essay.updatedAt,
    submissionCount: 0,
  }));
}

// 获取作文的所有版本
export function getMockEssayVersions(essayId: string) {
  return MOCK_ESSAY_VERSIONS.filter((v) => v.essayId === essayId);
}