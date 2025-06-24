import { Link } from "react-router-dom";
import { ViteCardGame } from "../components/ViteCardGame";

export default function Game() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="p-4">
        <Link 
          to="/" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          ← 返回首页
        </Link>
      </div>
      <ViteCardGame />
    </div>
  );
} 