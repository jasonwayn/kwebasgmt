import React, { useEffect, useState } from "react";
import axios from "axios";

const SavedPosts = ({ userId }) => {
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/api/saved_posts/${userId}`)
        .then(res => {
          setSavedPosts(res.data);
        })
        .catch(err => console.error("❌ 저장된 게시물 불러오기 실패:", err));
    }
  }, [userId]);

  return (
    <div>
      <h2>저장된 게시물</h2>
      {savedPosts.length === 0 ? (
        <p>저장된 게시물이 없습니다.</p>
      ) : (
        savedPosts.map((post) => (
          <div key={post.id} className="border p-3 mb-3">
            <h5>{post.title}</h5>
            <p>{post.content}</p>
            {post.image_url && <img src={`http://localhost:5000${post.image_url}`} alt="Post" width="200" />}
          </div>
        ))
      )}
    </div>
  );
};

export default SavedPosts;
