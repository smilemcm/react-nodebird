import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';

import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';


//Home은 front와  브라우저에서 실행이 된다는게 무슨 말이지?
const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    function onScroll() {
      if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
};

// 아래 부분이 서버 사이드 랜더링 부분인데, home보다 먼저 실행이 되어야 된다.
// 여기서 실행된 결과를 HYDRATE 액션 형식으로 보내주게 되는데, recuders/index.js를 참조해주세요.
// 여기는 front서버에서 실행이 되는것이다.
// context.req는 아마도 브라우저가 back서버로 정보를 요청할때, front를 경유해서 전송을 하다보니, front에서 context.req정보가 있나보다.
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');
  console.log(context.req.headers);

  // context는 front에서 주는 정보인가?
  // context.req에 쿠키 정보가 있다.
  const cookie = context.req ? context.req.headers.cookie : '';
  //기본적으로 쿠키는 브라우저에서 주는것이지...아래 코드처럼 서버사이드 렌더링 일때만 아래 코드 처럼 넣어야 된다.
  // 하여튼..이부분 잘 이해를 못했음.
  axios.defaults.headers.Cookie = '';
  // 여기에 header에 쿠키정보를 넣어주고 있다.
  // 그러면 node에서 이 쿠기 정보를 확인이 가능하다.
  // 서버 context가 있고 cookie가 있을때만 쿠키를 실행한다고 하는데,
  // context가 어디에서 오는것일가?
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch(END);
  console.log('getServerSideProps end');
  await context.store.sagaTask.toPromise();
});

export default Home;
