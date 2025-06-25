import { Link } from "react-router-dom";
import { Welcome } from "../welcome/welcome";
// import UserProfile from "../components/UserProfile";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden flex items-center justify-center">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-60 right-32 w-32 h-32 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-32 left-32 w-36 h-36 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-60 right-60 w-44 h-44 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-3000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10 max-w-6xl">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="mb-4">
            {/* <UserProfile /> */}
          </div>
          
          <Welcome />
          
          {/* 游戏选择区域 */}
          <div className="flex flex-col items-center space-y-6 w-full max-w-5xl">
            <div className="text-center mb-4">
              <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                🎮 游戏大厅
              </h2>
              <p className="text-purple-200 text-lg">
                精心打造的游戏体验，带您进入奇幻世界
              </p>
            </div>
            
            {/* 主推游戏 - L-Zore */}
            <div className="w-full max-w-3xl">
              <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm border border-purple-400/40 rounded-3xl p-6 mb-6 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-cyan-500/5 rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <span className="text-2xl">🌟</span>
                      <h3 className="text-2xl font-bold text-white">主推游戏</h3>
                      <span className="text-2xl">🌟</span>
                    </div>
                    <p className="text-purple-100 text-base">
                      体验最新的神煞卡牌战斗系统，感受传统与现代的完美融合
                    </p>
                  </div>
                  <Link 
                    to="/phaser-lzore" 
                    className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300 text-center text-xl relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-3xl">🎴</span>
                        <span>L-Zore 神煞卡牌战斗系统</span>
                      </div>
                      <div className="text-base opacity-90 font-medium">
                        传统命理学 × 现代游戏技术
                      </div>
                      <div className="flex justify-center gap-3 mt-3">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Phaser 3</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">WebGL</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">高性能</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* 其他游戏 */}
            <div className="w-full max-w-3xl">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white mb-2">🎯 更多游戏</h3>
                <p className="text-purple-200 text-sm">探索更多精彩的游戏世界</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Link 
                  to="/game" 
                  className="bg-gradient-to-br from-blue-600/80 to-cyan-600/80 hover:from-blue-700 hover:to-cyan-700 backdrop-blur-sm border border-blue-400/40 text-white font-bold py-6 px-4 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 text-center group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl block mb-3">🃏</span>
                      <div className="text-lg font-bold mb-2">21点游戏</div>
                      <div className="text-blue-100 text-sm mb-3">经典纸牌游戏</div>
                      <div className="flex justify-center gap-2">
                        <span className="bg-white/20 px-2 py-1 rounded text-xs">经典</span>
                        <span className="bg-white/20 px-2 py-1 rounded text-xs">简单</span>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link 
                  to="/pixel-game" 
                  className="bg-gradient-to-br from-green-600/80 to-emerald-600/80 hover:from-green-700 hover:to-emerald-700 backdrop-blur-sm border border-green-400/40 text-white font-bold py-6 px-4 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 text-center group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl block mb-3">🕹️</span>
                      <div className="text-lg font-bold mb-2">像素风游戏</div>
                      <div className="text-green-100 text-sm mb-3">复古像素风格</div>
                      <div className="flex justify-center gap-2">
                        <span className="bg-white/20 px-2 py-1 rounded text-xs">复古</span>
                        <span className="bg-white/20 px-2 py-1 rounded text-xs">趣味</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* 特性展示 */}
            <div className="w-full max-w-4xl mt-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">⚡ 技术特性</h3>
                <p className="text-purple-200 text-sm">先进技术驱动的游戏体验</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
                  <div className="text-white font-bold text-lg mb-2">高性能引擎</div>
                  <div className="text-white/80 text-xs mb-3">Phaser 3 + WebGL硬件加速</div>
                  <div className="flex justify-center gap-1">
                    <span className="bg-purple-500/30 px-2 py-1 rounded text-xs text-purple-200">WebGL</span>
                    <span className="bg-purple-500/30 px-2 py-1 rounded text-xs text-purple-200">60FPS</span>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎨</div>
                  <div className="text-white font-bold text-lg mb-2">精美画面</div>
                  <div className="text-white/80 text-xs mb-3">粒子特效 + 流畅动画</div>
                  <div className="flex justify-center gap-1">
                    <span className="bg-blue-500/30 px-2 py-1 rounded text-xs text-blue-200">粒子</span>
                    <span className="bg-blue-500/30 px-2 py-1 rounded text-xs text-blue-200">动画</span>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📱</div>
                  <div className="text-white font-bold text-lg mb-2">跨平台支持</div>
                  <div className="text-white/80 text-xs mb-3">PC + 移动端完美适配</div>
                  <div className="flex justify-center gap-1">
                    <span className="bg-green-500/30 px-2 py-1 rounded text-xs text-green-200">响应式</span>
                    <span className="bg-green-500/30 px-2 py-1 rounded text-xs text-green-200">触控</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 页脚信息 */}
            <div className="w-full max-w-4xl mt-12">
              <div className="text-center py-6 border-t border-white/10">
                <div className="text-white/60 text-xs mb-3">
                  <p className="mb-1">
                    🌟 L-Zore 神煞卡牌战斗系统 - 传统与现代的完美融合
                  </p>
                  <p>
                    Powered by Phaser 3 & React | 
                    <span className="mx-1">🚀</span>
                    高性能游戏引擎 | 
                    <span className="mx-1">✨</span>
                    现代化UI框架
                  </p>
                </div>
                <div className="flex justify-center gap-4 text-white/40 text-xs">
                  <span>© 2024 L-Zore Project</span>
                  <span>•</span>
                  <span>Made with ❤️</span>
                  <span>•</span>
                  <span>Version 1.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
