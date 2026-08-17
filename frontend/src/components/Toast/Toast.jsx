// src/components/Toast/Toast.jsx
import { ToastWrapper, Icon } from "./Toast.styles";

const Toast = ({ message, placement = "default" }) => {
  return (
    <ToastWrapper $placement={placement}>
      <Icon>✅</Icon>
      {message}
    </ToastWrapper>
  );
};

export default Toast;
