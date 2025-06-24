import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import app from './dva';
import Home from './routes/home';
import Game from './routes/game';
import './app.css';

const container = document.getElementById('root');
const root = createRoot(container);

function App() {
  return (
    <Provider store={app._store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

// 注册路由
app.router(({ history }) => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={App} />
        {/* 添加更多路由 */}
      </Switch>
    </Router>
  );
});

// 启动 DVA 应用
app.start();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 