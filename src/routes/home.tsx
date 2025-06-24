import { Link } from "react-router-dom";
import { Welcome } from "../welcome/welcome";
// import UserProfile from "../components/UserProfile";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          {/* <UserProfile /> */}
        </div>
        <Welcome />
        <div className="flex flex-col items-center space-y-4 mt-8">
          <Link 
            to="/game" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 text-xl"
          >
            🎮 开始21点游戏
          </Link>
          
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-xl shadow-2xl border border-purple-500">
            <h3 className="text-white text-xl font-bold mb-4 text-center">🌟 L-Zore 神煞卡牌战斗系统</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/" 
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 text-center"
              >
                📱 原版 (HTML5)
              </Link>
              <Link 
                to="/phaser-lzore" 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 text-center relative"
              >
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">🚀 NEW</span>
                ⚡ Phaser 3 优化版
              </Link>
            </div>
            <p className="text-purple-200 text-sm mt-3 text-center">
              体验传统中华神煞文化与现代游戏技术的完美融合
            </p>
          </div>
          
          <Link 
            to="/pixel-game" 
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 text-lg"
          >
            🕹️ 像素风游戏演示
          </Link>
        </div>
      </div>
    </div>
  );
}
