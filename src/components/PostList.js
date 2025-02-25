import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentList from "./CommentList";

const PostList = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  // ✅ `userId`가 `undefined`일 경우 `localStorage`에서 가져오기
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = userId || storedUser?.id;

  useEffect(() => {
    axios.get("http://localhost:5000/api/posts")
      .then((res) => {
        setPosts(res.data);
      })
      .catch((error) => {
        console.error("❌ 게시물 불러오기 실패:", error);
      });
  }, []);

  return (
    <div>
      <h2>게시물 목록</h2>
      {posts.map((post) => (
        <div key={post.id} className="border p-3 mb-3">
          <h5>{post.title}</h5>
          <p>{post.content}</p>
          {post.image_url && <img src={`http://localhost:5000${post.image_url}`} alt="Post" width="200" />}

          {/* ✅ 댓글 기능 추가 */}
          <CommentList postId={post.id} userId={loggedInUserId} />
        </div>
      ))}
    </div>
  );
};

export default PostList;
