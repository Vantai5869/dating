import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Path } from "../../constants/path";
import { login } from "./authSlice";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  const dispatch = useDispatch();
  const history = useHistory();

  const initialValues = {
    email: "",
    password: "",
  };

  const handleLogin = async (formValues) => {
    try {
      const user = await dispatch(login(formValues)).unwrap();
      if (user.role === "user") {
        toast.error("Tên đăng nhập hoặc mật khẩu không chính xác");
      } else {
        history.push(Path.HOME_PAGE);
      }
    } catch (error) {
      toast.error("Tên đăng nhập hoặc mật khẩu không chính xác");
    }
  };

  return <LoginForm initialValues={initialValues} onSubmit={handleLogin} />;
}
