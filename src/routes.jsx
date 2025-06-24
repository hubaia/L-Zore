// 简化的路由配置，与 DVA 路由兼容
export const routes = [
  {
    path: "/",
    component: "routes/home.tsx",
  },
  {
    path: "/game", 
    component: "routes/game.tsx",
  },
  {
    path: "/phaser-lzore",
    component: "routes/phaser-lzore.tsx",
  },
];

export default routes;
