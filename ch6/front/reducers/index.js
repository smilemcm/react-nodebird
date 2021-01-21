import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import user from './user';
import post from './post';

// (이전상태, 액션) => 다음상태
//  우리가 원하는 형식은 index, user, post 이렇게 3개가 와야 되는데, 그렇지 않아서 아래와 같이 변경을 해주고 있음.
// user와 post를 하나로 묶어서 보내주고 있음.
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;

    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
