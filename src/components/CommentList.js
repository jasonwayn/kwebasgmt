import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentForm from "./CommentForm";

const CommentList = ({ postId, userId }) => {
    console.log("🟢 CommentList - postId:", postId);
    console.log("🟢 CommentList - userId:", userId);  

    const [comments, setComments] = useState([]);

    // ✅ `userId`가 `undefined`면 `localStorage`에서 가져오기
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const loggedInUserId = userId || storedUser?.id;

    const fetchComments = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/comments/${postId}`);
            setComments(res.data);
        } catch (error) {
            console.error("❌ 댓글 불러오기 실패", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <div className="mt-3">
            <h4>댓글</h4>
            <CommentForm postId={postId} userId={loggedInUserId} onCommentAdded={fetchComments} />
            {comments.length === 0 ? <p>아직 댓글이 없습니다.</p> : (
                comments.map((comment) => (
                    <div key={comment.id} className="border p-2 mb-2">
                        <strong>{comment.username}</strong>: {comment.content}
                    </div>
                ))
            )}
        </div>
    );
};

export default CommentList;
