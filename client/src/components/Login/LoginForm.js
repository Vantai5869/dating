import { yupResolver } from "@hookform/resolvers/yup";
import { Login } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import LoginImage from "../../assets/images/LoginImage.jpg";
import { InputField } from "../../common/FormFields/InputFields";
import { PasswordField } from "../../common/FormFields/PasswordField";

export default function LoginForm({ initialValues, onSubmit }) {
  const schema = yup.object().shape({
    email: yup.string().required("Vui lòng nhập email của bạn"),
    password: yup
      .string()
      .required("Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu phải chứa ít nhất 6 ký tự"),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = (formValues) => {
    if (!onSubmit) return;

    onSubmit(formValues);
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center">
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexFlow: "row-reverse nowrap",
          alignItems: "center",
          border: 1,
          borderColor: (theme) => theme.palette.divider,
          boxShadow: 1,
          padding: "30px",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          padding={1}
        >
          <Typography variant="h4" align="center" mb={2} fontWeight={500}>
            Login
          </Typography>

          <InputField control={control} name="email" label="Email" />
          <PasswordField control={control} name="password" label="Mật khẩu" />

          <Button
            variant="contained"
            type="submit"
            sx={{ mt: 2 }}
            fullWidth
            startIcon={<Login />}
          >
            Đăng nhập
          </Button>
        </Box>
        <Box mr={4}>
          <img src={LoginImage} alt="login" />
        </Box>
      </Container>
    </Box>
  );
}
