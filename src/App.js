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

          {/* ✅ `userId`를 `PostList`에 전달 */}
          <Route path="/" element={<PostList userId={currentUser?.id} />} />

          {/* ✅ 로그인 & 회원가입 페이지 유지 */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* ✅ 프로필 페이지 유지 */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />

          {/* ✅ 글쓰기 기능 추가 */}
          <Route path="/write" element={<PostForm />} />
          {/* ✅ 특정 게시물의 댓글 보기 */}
          <Route path="/comments/:postId" element={<CommentList />} />

          {/* ✅ 특정 게시물에 댓글 작성 */}
          <Route path="/comment/write/:postId" element={<CommentForm />} />  

          {/* ✅ 알람 */}
          <Route path="/notifications" element={<Notifications />} />

          
        </Routes>
      </div>
    </Router>
  );
};

export default App;
