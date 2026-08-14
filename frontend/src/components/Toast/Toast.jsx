import { ToastWrapper, Icon } from "./Toast.styles";

const Toast = ({ message, marginTop = 29 }) => {
  return (
    <ToastWrapper $marginTop={marginTop}>
      <Icon>✅</Icon>
      {message}
    </ToastWrapper>
  );
};

export default Toast;
