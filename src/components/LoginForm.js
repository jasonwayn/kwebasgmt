import React, { useState } from "react";
import axios from "axios";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleChange = (e) => {
        if (e.target.name === "email") setEmail(e.target.value);
        if (e.target.name === "password") setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/login", { email, password });

            // ✅ JWT 토큰 저장
            localStorage.setItem("token", res.data.token);
            // ✅ 사용자 정보 저장
            localStorage.setItem("user", JSON.stringify(res.data.user));

            alert("✅ 로그인 성공!");

            // ✅ 로그인 후 새로고침 (이전 방식)
            window.location.reload();
        } catch (error) {
            alert("❌ 로그인 실패");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="이메일" value={email} onChange={handleChange} />
            <input type="password" name="password" placeholder="비밀번호" value={password} onChange={handleChange} />
            <button type="submit">로그인</button>
        </form>
    );
};

export default LoginForm;
