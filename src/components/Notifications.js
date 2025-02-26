import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:5000/api/notifications/${userId}`)
                .then(res => {
                    setNotifications(res.data);
                })
                .catch(err => console.error("❌ 알림 불러오기 실패:", err));
        }
    }, [userId]);

    const handleNotificationClick = (notificationId) => {
        // 알림 클릭 시 읽음 처리
        axios.put(`http://localhost:5000/api/notifications/${notificationId}`)
            .then((res) => {
                alert("알림을 읽음으로 처리했습니다.");
                // 알림 상태 업데이트 후 필터링하여 UI에서 제거
                setNotifications(notifications.filter((notification) => notification.id !== notificationId));
            })
            .catch((err) => console.error("❌ 알림 처리 실패:", err));
    };

    const renderNotificationMessage = (notification) => {
        if (notification.type === "like") {
            return <strong>{notification.message}</strong>;
        } else if (notification.type === "comment") {
            return <em>{notification.message}</em>;
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
                        className={`alert alert-${notification.type === "like" ? "success" : "info"}`}
                        onClick={() => handleNotificationClick(notification.id)}
                    >
                        {renderNotificationMessage(notification)}
                    </div>
                ))
            )}
        </div>
    );
};

export default Notifications;
