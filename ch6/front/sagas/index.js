import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import postSaga from './post';
import userSaga from './user';


// 쿠키가 3060과 3065와 같이 호환이 될려고 하면은 아래 옵션을 해주어야 됨.
// 다시한번 정리하면은 front(3060)쪽에서도 credentials를 설정해 줘야 되고
// back(3065)에서도 credentials를 설정해 줘야 된다.
axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([
    fork(postSaga),
    fork(userSaga),
  ]);
}
