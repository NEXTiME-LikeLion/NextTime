import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signOut } from "aws-amplify/auth";
import { useToast } from "../../contexts/ToastContext";
import { registerUser } from "../../api/registerUser";
import Toast from "../../components/Toast/Toast";
import * as S from "./Login.styles";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { toast, showToast } = useToast();

  const doSignIn = async () => {
    await signIn({ username: email, password });
    const userData = await registerUser();

    showToast("로그인 완료!");
    if (!userData.onboardingCompleted) {
      navigate("/onboarding");
    } else {
      navigate("/main");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await doSignIn();
    } catch (error) {
      if (error.name === "UserAlreadyAuthenticatedException") {
        try {
          await signOut();
          await doSignIn();
        } catch {
          setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
      } else {
        setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    }
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

      {errorMessage && <S.ErrorText>{errorMessage}</S.ErrorText>}

      <S.SubmitButton type="submit">로그인하기</S.SubmitButton>

      <S.BottomText>
        아직 계정이 없으신가요?
        <S.StyledLink to="/signup">회원가입 하기</S.StyledLink>
      </S.BottomText>

      {toast && <Toast message={toast.message} />}
    </S.FormContainer>
  );
};

export default Login;
