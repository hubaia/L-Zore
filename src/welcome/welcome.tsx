export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-6 pb-6">
      <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
        <header className="flex flex-col items-center gap-4">
          <div className="max-w-[700px] w-full p-6 text-center">
            <div className="relative bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-indigo-900/90 rounded-3xl p-8 shadow-2xl border border-purple-400/40 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-3xl"></div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-3 py-1 rounded-full font-bold animate-pulse">
                🚀 NEW
              </div>
              <div className="relative z-10">
                <h1 className="text-6xl font-bold gradient-text mb-4 drop-shadow-lg">
                  L-Zore
                </h1>
                <p className="text-2xl text-purple-100 font-medium mb-3 drop-shadow-md">
                  神煞卡牌战斗系统
                </p>
                <p className="text-purple-200 text-lg mb-6 drop-shadow-sm">
                  融合传统命理学与赛博朋克的创新卡牌游戏
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform hover:scale-105 transition-transform">
                    ✨ 神煞系统
                  </span>
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform hover:scale-105 transition-transform">
                    🎮 实时对战
                  </span>
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform hover:scale-105 transition-transform">
                    🚀 高性能
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="max-w-[600px] w-full space-y-6 px-4">
          <div className="rounded-2xl border border-purple-300/30 bg-gradient-to-r from-white/10 to-purple-100/10 backdrop-blur-sm p-6 space-y-5 shadow-xl">
            <div className="text-center">
              <p className="leading-6 text-purple-100 font-semibold text-xl mb-1">
                🎯 选择您的游戏体验
              </p>
              <p className="text-purple-200 text-sm opacity-80">
                多种游戏模式，满足不同玩家需求
              </p>
            </div>
            <div className="grid gap-4">
              <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl p-5 border border-purple-300/40 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎴</div>
                  <div>
                    <h3 className="text-purple-100 font-bold mb-2 text-lg">神煞卡牌系统</h3>
                    <p className="text-purple-200 text-sm leading-relaxed">
                      体验传统中华神煞文化与现代游戏技术的完美融合，享受策略深度与视觉盛宴
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-xl p-5 border border-blue-300/40 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🕹️</div>
                  <div>
                    <h3 className="text-blue-100 font-bold mb-2 text-lg">多样化游戏</h3>
                    <p className="text-blue-200 text-sm leading-relaxed">
                      包含21点纸牌、像素风格等多种游戏模式，从经典到创新的全方位体验
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
