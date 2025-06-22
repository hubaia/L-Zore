import { Link } from "react-router";
import { Welcome } from "../welcome/welcome";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <Welcome />
      <div className="flex justify-center mt-8">
        <Link 
          to="/game" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 text-xl"
        >
          🎮 开始游戏
        </Link>
      </div>
    </div>
  );
}
