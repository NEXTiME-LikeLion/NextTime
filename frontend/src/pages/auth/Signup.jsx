import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, resendSignUpCode, confirmSignUp } from "aws-amplify/auth";
import * as S from "./Signup.styles";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("form"); // "form" | "verify"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== passwordCheck) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });
      setStep("verify");
    } catch (error) {
      if (error.name === "UsernameExistsException") {
        // 이미 가입 시도한 이메일 → 인증 코드 재전송 시도
        try {
          await resendSignUpCode({ username: email });
          setStep("verify"); // 인증 코드 입력 화면으로 이동
        } catch (resendError) {
          setErrorMessage("이미 가입 완료된 이메일이에요. 로그인해주세요.");
        }
      } else if (error.name === "InvalidPasswordException") {
        setErrorMessage("비밀번호는 8자 이상, 영문/숫자를 포함해야 해요.");
      } else {
        setErrorMessage("회원가입에 실패했습니다.");
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      navigate("/login");
    } catch (error) {
      setErrorMessage("인증 코드가 올바르지 않습니다.");
    }
  };

  if (step === "verify") {
    return (
      <S.FormContainer onSubmit={handleVerify}>
        <S.Title>이메일 인증</S.Title>
        <S.BottomText>{email}로 전송된 인증 코드를 입력해주세요.</S.BottomText>

        <S.InputGroup>
          <S.Input
            type="text"
            placeholder="인증 코드 6자리"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </S.InputGroup>

        {errorMessage && <S.ErrorText>{errorMessage}</S.ErrorText>}
        <S.VerifySpacer />

        <S.SubmitButton type="submit">인증하기</S.SubmitButton>
      </S.FormContainer>
    );
  }

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <S.HelperText>
            8자 이상, 대문자·소문자·숫자·특수문자를 포함해주세요
          </S.HelperText>
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

      {errorMessage && <S.ErrorText>{errorMessage}</S.ErrorText>}

      <S.SubmitButton type="submit">회원가입 하기</S.SubmitButton>

      <S.BottomText>
        이미 계정이 있나요?
        <S.StyledLink to="/login">로그인 하기</S.StyledLink>
      </S.BottomText>
    </S.FormContainer>
  );
};

export default Signup;
