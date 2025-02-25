import React, { useState } from "react";
import axios from "axios";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  // ✅ localStorage에서 로그인한 사용자 ID 가져오기
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;  // ✅ 로그인한 사용자의 ID 가져오기

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      alert("로그인이 필요합니다!");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);  // ✅ 현재 로그인한 사용자의 ID
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ 게시물 작성 완료!");
      setTitle("");
      setContent("");
      setImage(null);
    } catch (error) {
      console.error("❌ 게시물 저장 실패", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">
      <h2>게시물 작성</h2>
      <input type="text" className="form-control mb-2" placeholder="제목 입력"
        value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea className="form-control mb-2" placeholder="내용 입력"
        value={content} onChange={(e) => setContent(e.target.value)} required />
      <input type="file" className="form-control mb-2" onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit" className="btn btn-primary">게시하기</button>
    </form>
  );
};

export default PostForm;
