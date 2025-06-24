export default {
  namespace: 'game',
  
  state: {
    score: 0,
    wins: 0,
    losses: 0,
    currentGame: null,
    gameHistory: [],
  },
  
  effects: {
    *updateScore({ payload }, { put, select }) {
      const { game } = yield select();
      const newScore = game.score + payload;
      
      yield put({ type: 'setScore', payload: newScore });
      
      if (payload !== 0) {
        yield put({ 
          type: 'addToHistory', 
          payload: { 
            type: payload > 0 ? 'win' : 'loss',
            score: payload,
            timestamp: Date.now(),
          } 
        });
      }
    },
    
    *recordGameResult({ payload }, { put }) {
      const { result, score } = payload;
      
      if (result === 'win') {
        yield put({ type: 'incrementWins' });
      } else if (result === 'loss') {
        yield put({ type: 'incrementLosses' });
      }
      
      yield put({ type: 'updateScore', payload: score });
    },
  },
  
  reducers: {
    setScore(state, { payload }) {
      return { ...state, score: payload };
    },
    
    incrementWins(state) {
      return { ...state, wins: state.wins + 1 };
    },
    
    incrementLosses(state) {
      return { ...state, losses: state.losses + 1 };
    },
    
    setCurrentGame(state, { payload }) {
      return { ...state, currentGame: payload };
    },
    
    addToHistory(state, { payload }) {
      return {
        ...state,
        gameHistory: [...state.gameHistory, payload],
      };
    },
    
    resetGame(state) {
      return {
        ...state,
        score: 0,
        wins: 0,
        losses: 0,
        gameHistory: [],
      };
    },
  },
}; 