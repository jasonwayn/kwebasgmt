import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Profile from "./components/Profile";
import PostForm from "./components/PostForm";  
import PostList from "./components/PostList";  
import CommentList from "./components/CommentList";  
import CommentForm from "./components/CommentForm";  
import Notifications from "./components/Notifications";
import SavedPosts from "./components/SavedPosts";  

const App = () => {

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(storedUser);
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="container mt-5">
        <Routes>

          {/* 홈: 게시물 목록 */}
          <Route path="/" element={<PostList userId={currentUser?.id} />} />

          {/* 로그인 & 회원가입 */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* 프로필 */}
          <Route path="/profile/:id?" element={<Profile />} />

          {/* 글쓰기 */}
          <Route path="/write" element={<PostForm />} />

          {/* 댓글 목록 */}
          <Route path="/comments/:postId" element={<CommentList />} />

          {/* 댓글 작성 */}
          <Route path="/comment/write/:postId" element={<CommentForm />} />

          {/* 알림 페이지 */}
          <Route path="/notifications" element={<Notifications />} />

          {/* 저장된 게시물 보기 */}
          <Route path="/saved" element={<SavedPosts userId={currentUser?.id} />} />  {/* 저장된 게시물 탭 */}

        </Routes>
      </div>
    </Router>
  );
};

export default App;
