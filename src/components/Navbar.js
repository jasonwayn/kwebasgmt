import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";  // ✅ React Router Link 추가

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [notificationsCount, setNotificationsCount] = useState(0);  // 알림 개수 상태 추가

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await axios.get("http://localhost:5000/api/user", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data);

                    // 사용자 ID로 알림 개수 가져오기
                    const notificationsRes = await axios.get(`http://localhost:5000/api/notifications/${res.data.id}`);
                    setNotificationsCount(notificationsRes.data.length);  // 알림 개수 업데이트
                } catch (error) {
                    console.error("사용자 정보 불러오기 실패", error);
                }
            }
        };
        fetchUser();
    }, []);

    return (
        <nav>
            <Link to="/">홈</Link>  {/* ✅ Link 사용 */}

            {user ? (
                <>
                    <span>안녕하세요, {user.username}님</span>
                    {/* ✅ 로그인한 사용자만 "글쓰기" 버튼 보이기 */}
                    <Link to="/write">글쓰기</Link>
                    
                    {/* ✅ 알림 아이콘 추가 (알림 개수 표시) */}
                    <Link to="/notifications">
                        알림 {notificationsCount > 0 ? `(${notificationsCount})` : ""}
                    </Link>

                    <button onClick={() => { localStorage.removeItem("token"); window.location.reload(); }}>
                        로그아웃
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login">로그인</Link>
                    <Link to="/register">회원가입</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
