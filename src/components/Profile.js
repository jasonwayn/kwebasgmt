import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
    const { id } = useParams(); // ✅ URL에서 user ID 가져오기
    const [profile, setProfile] = useState({ username: "", email: "", bio: "", profile_image: "" });
    const [newBio, setNewBio] = useState("");
    const [newProfileImage, setNewProfileImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // ✅ 수정 모드 추가

    // ✅ 로그인한 사용자 정보 가져오기
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const loggedInUserId = storedUser?.id;

    useEffect(() => {
        axios.get(`http://localhost:5000/api/profile/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => setProfile(res.data))
        .catch(err => console.error("❌ 프로필 불러오기 실패:", err));
    }, [id]);

    const handleUpdateProfile = async () => {
        try {
            const formData = new FormData();
            formData.append("bio", newBio || profile.bio);
            if (newProfileImage) formData.append("profile_image", newProfileImage);

            await axios.put("http://localhost:5000/api/profile", formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            alert("✅ 프로필이 저장되었습니다!");
            window.location.reload();  // ✅ UI 반영을 위해 새로고침
        } catch (error) {
            console.error("❌ 프로필 저장 실패:", error);
            alert("프로필 저장에 실패했습니다.");
        }
    };

    return (
        <div>
            <h2>프로필</h2>
            <p>이름: {profile.username}</p>
            <p>이메일: {profile.email}</p>
            <p>소개: {profile.bio}</p>
            {profile.profile_image && <img src={`http://localhost:5000${profile.profile_image}`} alt="프로필" width="100" />}

            {/* ✅ 로그인한 사용자만 자신의 프로필 수정 가능 */}
            {parseInt(loggedInUserId) === parseInt(id) && (
                <>
                    <input type="text" placeholder="새로운 소개 입력" onChange={(e) => setNewBio(e.target.value)} />
                    <input type="file" onChange={(e) => setNewProfileImage(e.target.files[0])} />
                    <button onClick={handleUpdateProfile}>프로필 저장</button>
                </>
            )}
        </div>
    );
};

export default Profile;
