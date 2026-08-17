import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import Toast from "../../components/Toast/Toast";
import * as S from "./Signup.styles";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const { toast, showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    console.log("회원가입 시도:", { email, password });
    showToast("회원가입 완료!");
  };

  return (
    <S.FormContainer onSubmit={handleSubmit}>
      <S.Title>회원가입</S.Title>

      <S.InputGroup>
        <S.FieldWrapper>
          <S.Label>이메일</S.Label>
          <S.Input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </S.FieldWrapper>
        <S.FieldWrapper>
          <S.Label>비밀번호</S.Label>
          <S.Input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </S.FieldWrapper>
        <S.FieldWrapper>
          <S.Label>비밀번호 확인</S.Label>
          <S.Input
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            required
          />
        </S.FieldWrapper>
      </S.InputGroup>

      <S.SubmitButton type="submit">회원가입 하기</S.SubmitButton>

      <S.BottomText>
        이미 계정이 있나요?
        <S.StyledLink to="/login">로그인 하기</S.StyledLink>
      </S.BottomText>
      {toast && <Toast message={toast.message} />}
    </S.FormContainer>
  );
};

export default Signup;
