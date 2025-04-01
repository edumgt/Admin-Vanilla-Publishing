import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => <h1>로그인 하세요!!</h1>;

// 로그인 여부 확인
const isLoggedIn = !!localStorage.getItem('token');

if (!isLoggedIn) {
  // 로그인하지 않은 경우 login.html로 이동
  location.href = 'login.html';
} else {
  // 로그인된 경우 favorite-1st 경로 확인
  const favoritePath = localStorage.getItem('favorite-1st');

  if (favoritePath) {
    // favorite-1st 값이 있으면 해당 경로로 이동
    location.href = favoritePath.url;
  } else {
    // 없으면 기본 경로로 이동
    location.href = 'system.html';
  }
}
