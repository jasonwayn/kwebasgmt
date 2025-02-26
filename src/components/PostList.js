import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentList from "./CommentList";  // 댓글 기능

const PostList = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  // `userId`가 `undefined`일 경우 `localStorage`에서 가져오기
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = userId || storedUser?.id;

  useEffect(() => {
    // 게시물 목록 불러오기
    axios.get("http://localhost:5000/api/posts")
      .then(async (res) => {
        const postData = res.data;

        // 각 게시물의 좋아요 개수 불러오기
        const updatedPosts = await Promise.all(
          postData.map(async (post) => {
            const likeRes = await axios.get(`http://localhost:5000/api/likes/count/${post.id}`);
            return { ...post, like_count: likeRes.data.like_count || 0 };
          })
        );

        setPosts(updatedPosts);
      })
      .catch((error) => {
        console.error("❌ 게시물 불러오기 실패:", error);
      });
  }, []);

  // 좋아요 버튼 클릭 핸들러
  const handleLike = async (postId) => {
    if (!loggedInUserId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/likes", { post_id: postId, user_id: loggedInUserId });

      // 좋아요 개수 업데이트 (API 재요청)
      const likeRes = await axios.get(`http://localhost:5000/api/likes/count/${postId}`);

      // 해당 게시물의 좋아요 개수만 업데이트
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, like_count: likeRes.data.like_count } : post
        )
      );

      alert("✅ 좋아요를 눌렀습니다!");
    } catch (error) {
      console.error("❌ 좋아요 요청 실패:", error.response?.data || error.message);
    }
  };

  // 게시물 저장 핸들러
  const handleSavePost = async (postId) => {
    if (!loggedInUserId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/saved_posts", { post_id: postId, user_id: loggedInUserId });
      alert("✅ 게시물이 저장되었습니다!");
    } catch (error) {
      console.error("❌ 게시물 저장 실패:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>게시물 목록</h2>
      {posts.map((post) => (
        <div key={post.id} className="border p-3 mb-3">
          <h5>{post.title}</h5>
          <p>{post.content}</p>
          {post.image_url && <img src={`http://localhost:5000${post.image_url}`} alt="Post" width="200" />}
          
          {/* 좋아요 버튼 및 개수 표시 */}
          <div>
            <button onClick={() => handleLike(post.id)}>
              ❤️ 좋아요 ({post.like_count})
            </button>
          </div>

          {/* 게시물 저장 버튼 추가 */}
          <div>
            <button onClick={() => handleSavePost(post.id)}>
              💾 저장
            </button>
          </div>

          {/* 댓글 기능 추가 */}
          <CommentList postId={post.id} userId={loggedInUserId} />
        </div>
      ))}
    </div>
  );
};

export default PostList;
