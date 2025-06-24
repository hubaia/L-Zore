export default {
  namespace: 'user',
  
  state: {
    currentUser: null,
    isLoggedIn: false,
  },
  
  effects: {
    *login({ payload }, { call, put }) {
      try {
        // 模拟 API 调用
        const response = yield call(fetchUser, payload);
        yield put({ type: 'loginSuccess', payload: response });
      } catch (error) {
        yield put({ type: 'loginError', payload: error.message });
      }
    },
    
    *logout(_, { put }) {
      yield put({ type: 'logoutSuccess' });
    },
  },
  
  reducers: {
    loginSuccess(state, { payload }) {
      return {
        ...state,
        currentUser: payload,
        isLoggedIn: true,
      };
    },
    
    loginError(state, { payload }) {
      return {
        ...state,
        error: payload,
      };
    },
    
    logoutSuccess(state) {
      return {
        ...state,
        currentUser: null,
        isLoggedIn: false,
      };
    },
  },
};

// 模拟 API 函数
function fetchUser(credentials) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        username: credentials.username,
        email: `${credentials.username}@example.com`,
      });
    }, 1000);
  });
} 