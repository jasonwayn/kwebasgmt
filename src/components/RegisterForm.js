import React, { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
    const [form, setForm] = useState({ username: "", email: "", password: "", bio: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/register", form);
            alert(res.data.message);

            // 회원가입 성공 후, 로그인 API 자동 호출
            const loginRes = await axios.post("http://localhost:5000/api/login", {
                email: form.email,
                password: form.password
            });

            // 로그인 성공 시, JWT 토큰 저장
            localStorage.setItem("token", loginRes.data.token);
            alert("로그인 성공!");
            window.location.reload(); // 새로고침하여 로그인 상태 반영
        } catch (error) {
            alert("회원가입 또는 로그인 실패");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="아이디" onChange={handleChange} />
            <input type="email" name="email" placeholder="이메일" onChange={handleChange} />
            <input type="password" name="password" placeholder="비밀번호" onChange={handleChange} />
            <button type="submit">회원가입</button>
        </form>
    );
};

export default RegisterForm;
