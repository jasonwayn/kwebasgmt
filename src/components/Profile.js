import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
    const { id } = useParams(); // URL에서 user ID 가져오기
    const [profile, setProfile] = useState({ username: "", email: "", bio: "", profile_image: "" });
    const [newBio, setNewBio] = useState("");
    const [newProfileImage, setNewProfileImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isFriend, setIsFriend] = useState(false); // 서로이웃 여부 상태
    const [requestSent, setRequestSent] = useState(false); // 요청 보냈는지 여부 상태

    // 로그인한 사용자 정보 가져오기
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const loggedInUserId = storedUser?.id;

    useEffect(() => {
        // 프로필 정보 가져오기
        axios.get(`http://localhost:5000/api/profile/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => setProfile(res.data))
        .catch(err => console.error("❌ 프로필 불러오기 실패:", err));

        // 서로이웃 상태 확인 API
        if (loggedInUserId) {
            axios.get(`http://localhost:5000/api/friendship/status/${loggedInUserId}/${id}`)
                .then(res => {
                    setIsFriend(res.data.isFriend);
                    setRequestSent(res.data.requestSent);
                })
                .catch(err => console.error("❌ 서로이웃 상태 확인 실패:", err));
        }
    }, [id, loggedInUserId]);

    // 프로필 수정 처리
    const handleUpdateProfile = async () => {
        try {
            const formData = new FormData();
            formData.append("bio", newBio || profile.bio);
            if (newProfileImage) formData.append("profile_image", newProfileImage);

            await axios.put("http://localhost:5000/api/profile", formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            alert("✅ 프로필이 저장되었습니다!");
            window.location.reload();  // UI 반영을 위해 새로고침
        } catch (error) {
            console.error("❌ 프로필 저장 실패:", error);
            alert("프로필 저장에 실패했습니다.");
        }
    };

    // 서로이웃 요청 보내기
    const sendFriendRequest = () => {
        axios.post("http://localhost:5000/api/friend_request", {
            sender_id: loggedInUserId,
            receiver_id: id
        })
        .then(() => {
            alert("서로이웃 요청이 전송되었습니다!");
            setRequestSent(true);
        })
        .catch(err => console.error("❌ 서로이웃 요청 실패:", err));
    };

    // 서로이웃 해제
    const removeFriend = () => {
        axios.delete(`http://localhost:5000/api/friendship/remove/${loggedInUserId}/${id}`)
        .then(() => {
            alert("서로이웃이 해제되었습니다.");
            setIsFriend(false);
        })
        .catch(err => console.error("❌ 서로이웃 해제 실패:", err));
    };

    return (
        <div>
            <h2>프로필</h2>
            <p>이름: {profile.username}</p>
            <p>이메일: {profile.email}</p>
            <p>소개: {profile.bio}</p>
            {profile.profile_image && <img src={`http://localhost:5000${profile.profile_image}`} alt="프로필" width="100" />}

            {/* 로그인한 사용자만 자신의 프로필 수정 가능 */}
            {parseInt(loggedInUserId) === parseInt(id) && (
                <>
                    <input type="text" placeholder="새로운 소개 입력" onChange={(e) => setNewBio(e.target.value)} />
                    <input type="file" onChange={(e) => setNewProfileImage(e.target.files[0])} />
                    <button onClick={handleUpdateProfile}>프로필 저장</button>
                </>
            )}

            {/* 서로이웃 요청 버튼 추가 */}
            {parseInt(loggedInUserId) !== parseInt(id) && (
                isFriend ? (
                    <button onClick={removeFriend}>🚫 서로이웃 해제</button>
                ) : requestSent ? (
                    <button disabled>⏳ 요청 대기 중...</button>
                ) : (
                    <button onClick={sendFriendRequest}>🤝 서로이웃 요청</button>
                )
            )}
        </div>
    );
};

export default Profile;
