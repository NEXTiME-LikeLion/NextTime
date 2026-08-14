import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import Toast from "../../components/Toast/Toast";
import * as S from "./Login.styles";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast, showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("로그인 시도:", { email, password });
    showToast("로그인 완료!");
  };

  return (
    <S.FormContainer onSubmit={handleSubmit}>
      <S.Title>로그인</S.Title>

      <S.InputGroup>
        <S.Input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <S.Input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </S.InputGroup>

      <S.SubmitButton type="submit">로그인하기</S.SubmitButton>

      <S.BottomText>
        아직 계정이 없으신가요?
        <S.StyledLink to="/signup">회원가입 하기</S.StyledLink>
      </S.BottomText>

      {toast && <Toast message={toast.message} marginTop={130} />}
    </S.FormContainer>
  );
};

export default Login;
