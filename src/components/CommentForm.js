import React, { useState } from "react";
import axios from "axios";

const CommentForm = ({ postId, userId, onCommentAdded }) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);  // ✅ 요청 중 버튼 비활성화

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
    
        console.log("🟢 postId:", postId);
        console.log("🟢 userId:", userId);
        console.log("🟢 content:", content);

        setLoading(true);  // ✅ 요청 시작 시 버튼 비활성화

        try {
            console.log("🟢 댓글 작성 요청:", { post_id: postId, user_id: userId, content });  // ✅ 요청 데이터 로그 확인

            const res = await axios.post("http://localhost:5000/api/comments", {
                post_id: postId,
                user_id: userId,
                content
            });

            console.log("✅ 댓글 작성 성공:", res.data);  // ✅ 성공 로그
            setContent("");  // ✅ 입력 필드 초기화
            onCommentAdded();  // ✅ 댓글 목록 즉시 새로고침
        } catch (error) {
            console.error("❌ 댓글 저장 실패", error.response?.data || error.message);  // ✅ 오류 로그
            alert("댓글 작성에 실패했습니다.");
        } finally {
            setLoading(false);  // ✅ 요청 완료 후 버튼 다시 활성화
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3">
            <textarea
                className="form-control"
                placeholder="댓글을 입력하세요..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <button className="btn btn-primary mt-2" type="submit" disabled={loading}>
                {loading ? "작성 중..." : "댓글 작성"}
            </button>
        </form>
    );
};

export default CommentForm;
