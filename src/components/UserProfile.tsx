import React, { useState } from 'react';
import { connect } from 'react-redux';

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
  error?: string;
}

interface UserProfileProps {
  user: UserState;
  loading: boolean;
  dispatch: any;
}

function UserProfile({ user, loading, dispatch }: UserProfileProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      dispatch({
        type: 'user/login',
        payload: { username, password }
      });
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'user/logout' });
  };

  if (loading) {
    return (
      <div className="p-4 bg-blue-100 rounded-lg">
        <p className="text-blue-600">登录中...</p>
      </div>
    );
  }

  if (user.isLoggedIn && user.currentUser) {
    return (
      <div className="p-4 bg-green-100 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800">
          欢迎, {user.currentUser.username}!
        </h3>
        <p className="text-green-600">{user.currentUser.email}</p>
        <button
          onClick={handleLogout}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          退出登录
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">用户登录</h3>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          登录
        </button>
      </div>
      {user.error && (
        <p className="mt-2 text-red-600">{user.error}</p>
      )}
    </div>
  );
}

export default connect((state: any) => ({
  user: state.user,
  loading: state.loading.models.user,
}))(UserProfile); 