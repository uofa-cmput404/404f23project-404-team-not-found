import React, { FormEvent, useState } from "react";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import axios from "axios";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.repeatPassword) {
      toast.error("Repeat password does not match!");
      return;
    }

    const requestUrl = "http://127.0.0.1:8000/socialdistribution/signup/";

    console.log(formData);

    // check for missing fields
    if (
      formData.displayName === "" ||
      formData.username === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.repeatPassword === ""
    ) {
      toast.warning("Please fill all the missing fields!");
      return;
    }

    const form = new FormData();
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("displayName", formData.displayName);

    axios
      .post(requestUrl, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response: any) => {
        toast.success("You have succesfully signed up");
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
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
        <Typography variant="h3">Create an account</Typography>
        <Typography variant="subtitle1">
          Already have an account? <Link href="/login">Log In</Link>
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="displayName"
            label="Enter your name"
            name="name"
            autoFocus
            onChange={(e) => {
              setFormData({ ...formData, displayName: e.target.value });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Enter your username"
            name="username"
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Enter your email"
            name="email"
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Create password"
            type="password"
            id="password"
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="repeatPassword"
            label="Confirm password"
            type="password"
            id="repeatPassword"
            onChange={(e) => {
              setFormData({ ...formData, repeatPassword: e.target.value });
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "black" }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
