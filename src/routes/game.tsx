import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function Game() {
  const navigate = useNavigate();

  useEffect(() => {
    // 自动重定向到主要的L-Zore游戏页面
    navigate('/phaser-lzore');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-white text-lg mb-4">正在跳转到L-Zore神煞卡牌游戏...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
      </div>
    </div>
  );
} 