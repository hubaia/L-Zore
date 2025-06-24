import dva from 'dva';
import createLoading from 'dva-loading';
import { createBrowserHistory } from 'history';

// 创建 DVA 应用
const app = dva({
  history: createBrowserHistory(),
  onError(e) {
    console.error('DVA Error:', e);
  },
});

// 添加 loading 插件
app.use(createLoading());

// 注册模型
import userModel from './models/user';
import gameModel from './models/game';

app.model(userModel);
app.model(gameModel);

export default app; 