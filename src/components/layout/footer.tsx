import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* 平台介绍 */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-semibold text-white">作</span>
              </div>
              <span className="font-semibold text-gray-900">作文投稿平台</span>
            </div>
            <p className="text-sm text-gray-500">
              专业的中小学生作文投稿服务平台，帮助学生找到适合的投稿渠道，实现文学梦想。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/activities" className="text-sm text-gray-500 hover:text-primary">
                  活动库
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="text-sm text-gray-500 hover:text-primary">
                  AI投稿助手
                </Link>
              </li>
              <li>
                <Link href="/essays" className="text-sm text-gray-500 hover:text-primary">
                  我的作文
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-sm text-gray-500 hover:text-primary">
                  会员中心
                </Link>
              </li>
            </ul>
          </div>

          {/* 投稿服务 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">投稿服务</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/self-submissions" className="text-sm text-gray-500 hover:text-primary">
                  自主投稿
                </Link>
              </li>
              <li>
                <Link href="/agent-submissions" className="text-sm text-gray-500 hover:text-primary">
                  平台代投
                </Link>
              </li>
              <li>
                <Link href="/workspace/growth-records" className="text-sm text-gray-500 hover:text-primary">
                  成长档案
                </Link>
              </li>
            </ul>
          </div>

          {/* 帮助与支持 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">帮助与支持</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-gray-500 hover:text-primary">
                  帮助中心
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-500 hover:text-primary">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-primary">
                  联系我们
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-primary">
                  隐私政策
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-gray-500 text-center">
            © 2024 作文投稿平台 版权所有 | ICP备案号：京ICP备XXXXXXXX号
          </p>
        </div>
      </div>
    </footer>
  );
}