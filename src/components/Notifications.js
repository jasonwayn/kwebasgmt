import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) return;

        axios.get(`http://localhost:5000/api/notifications/${userId}`)
            .then(res => setNotifications(res.data))
            .catch(err => console.error("❌ 알림 불러오기 실패:", err));
    }, [userId]);

    // ✅ 알림 읽음 처리 및 제거 함수
    const handleNotificationClick = (notificationId, type, senderId) => {
        axios.put(`http://localhost:5000/api/notifications/${notificationId}`)
            .then(() => {
                // UI에서 알림 제거
                setNotifications(prev => prev.filter(n => n.id !== notificationId));

                // 서로이웃 요청이면 프로필 페이지로 이동
                if (type === "friend_request") {
                    navigate(`/profile/${senderId}`);
                }
            })
            .catch(err => console.error("❌ 알림 처리 실패:", err));
    };

    // ✅ 서로이웃 요청 승인/거절 처리 함수
    const handleFriendRequestAction = (notificationId, requestId, senderId, action) => {
        if (!requestId) {
            console.error("❌ requestId가 없음, 승인/거절 불가능");
            return;
        }

        const apiEndpoint = action === "accept"
            ? "http://localhost:5000/api/friend_request/accept"
            : "http://localhost:5000/api/friend_request/reject";

        axios.put(apiEndpoint, { request_id: requestId, sender_id: senderId, receiver_id: userId })
            .then(() => {
                alert(`서로이웃 요청이 ${action === "accept" ? "승인" : "거절"}되었습니다.`);
                setNotifications(prev => prev.filter(n => n.id !== notificationId));
            })
            .catch(err => console.error(`❌ 서로이웃 요청 ${action === "accept" ? "승인" : "거절"} 실패:`, err));
    };

    // ✅ 알림 내용 렌더링 함수
    const renderNotificationMessage = (notification) => {
        if (notification.type === "friend_request") {
            return (
                <div>
                    <strong>{notification.sender_name}님이 서로이웃 요청을 보냈습니다.</strong>
                    {notification.request_id ? (
                        <div>
                            <button onClick={() => handleFriendRequestAction(notification.id, notification.request_id, notification.sender_id, "accept")}>
                                ✅ 승인
                            </button>
                            <button onClick={() => handleFriendRequestAction(notification.id, notification.request_id, notification.sender_id, "reject")}>
                                ❌ 거절
                            </button>
                        </div>
                    ) : (
                        <p>⚠️ 요청 ID를 찾을 수 없습니다.</p>
                    )}
                </div>
            );
        } else {
            return <span>{notification.message}</span>;
        }
    };

    return (
        <div>
            <h2>알림</h2>
            {notifications.length === 0 ? (
                <p>새로운 알림이 없습니다.</p>
            ) : (
                notifications.map((notification) => (
                    <div 
                        key={notification.id} 
                        className={`alert alert-${notification.type === "like" ? "success" : notification.type === "friend_request" ? "warning" : "info"}`}
                        onClick={() => handleNotificationClick(notification.id, notification.type, notification.sender_id)} // ✅ 클릭 이벤트 추가
                        style={{ cursor: "pointer", padding: "10px", border: "1px solid #ddd", marginBottom: "10px", borderRadius: "5px" }} // ✅ 클릭 가능 스타일 추가
                    >
                        {renderNotificationMessage(notification)}
                    </div>
                ))
            )}
        </div>
    );
};

export default Notifications;
