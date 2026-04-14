import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export const dynamic = "force-dynamic";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        {/* Calendar visual */}
        <div className="relative mx-auto w-32 h-40 mb-8">
          <div className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-gray-100">
            {/* Binding holes */}
            <div className="flex justify-center gap-5 pt-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-gray-100 border-2 border-gray-200" />
              ))}
            </div>
            {/* Page content */}
            <div className="flex flex-col items-center justify-center h-24 px-3">
              <div className="text-4xl font-black text-gray-800">今</div>
              <div className="text-xs text-gray-400 mt-1">每天一頁，慢慢翻閱</div>
            </div>
            {/* Perforated line */}
            <div className="mx-4 border-t-2 border-dashed border-gray-100" />
            <div className="text-center py-2 text-lg">✨</div>
          </div>
          {/* Shadow pages */}
          <div className="absolute -bottom-2 left-2 right-2 h-3 bg-gray-100 rounded-b-xl -z-10" />
          <div className="absolute -bottom-4 left-4 right-4 h-3 bg-gray-50 rounded-b-xl -z-20" />
        </div>

        <h1 className="text-3xl font-black text-gray-800 mb-2">手撕日曆</h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-xs mx-auto">
          每天一句話，為你量身打造
          <br />
          根據你的 MBTI，給你最適合的心理反饋
        </p>
      </div>

      <GoogleSignInButton />

      <p className="text-gray-400 text-xs mt-8 text-center">
        登入即表示你同意我們儲存你的個人資料
        <br />
        用於客製化日曆內容
      </p>
    </div>
  );
}
