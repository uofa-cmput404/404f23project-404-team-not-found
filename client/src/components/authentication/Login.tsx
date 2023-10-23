import React, { FormEvent, useState } from "react";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { storeToken } from "../../utils/localStorageUtils";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const requestUrl = "http://127.0.0.1:8000/socialdistribution/login/";

    const form = new FormData();
    form.append("username", formData.username);
    form.append("password", formData.password);

    axios
      .post(requestUrl, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response: any) => {
        storeToken(response.data.token);

        toast.success("You are now logged in");

        navigate("/home-page");
      })
      .catch((error) => {
        toast.error("Wrong password or user does not exist");
      });
    return;
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h3">Welcome</Typography>
        <Typography variant="subtitle1">
          Don't have an account with us? <Link href="/sign-up">Sign Up</Link>
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "black" }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
