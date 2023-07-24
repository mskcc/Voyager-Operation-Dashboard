import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import LockIcon from "@mui/icons-material/Lock";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/*const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  progressSpinner: {
    width: "1.5rem !important",
    height: "1.5rem !important",
  },
  registrationText: {
    textAlign: "center",
  },
}));
*/
export default function LoginPage(props) {
  //const classes = useStyles();
  //const { loginRoute, registerRoute, formKey } = props;
  //const csrfToken = document
  //  .querySelector("meta[name='csrf-token']")
  //  .getAttribute("content");
  //axios.defaults.headers.post["X-CSRF-Token"] = csrfToken;
  //const redirectToRegistration = () => {
  //  window.location.replace(registerRoute);
  //};
  const { redirectRoute } = props;
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            m: 1,
            backgroundColor: (theme) => theme.palette.secondary.main,
          }}
        >
          <LockIcon></LockIcon>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          enableReinitialize={false}
          validationSchema={Yup.object().shape({
            username: Yup.string().required("Username is required"),
            password: Yup.string().required("Password is required"),
          })}
          onSubmit={({ username, password }, { setErrors, setSubmitting }) => {
            axios
              .post("http://voyager:5007/api-token-auth/", {
                username: username,
                password: password,
              })
              .then((response) => {
                localStorage.setItem("Beagle_access", response.data.access);
                localStorage.setItem("Beagle_refresh", response.data.refresh);
                localStorage.setItem("Beagle_username", username);
                navigate(redirectRoute, { replace: true });
                //console.log(response);
                //window.location.replace(response.request.responseURL);
              })
              .catch((err) => {
                if (err.response) {
                  let data = err.response.data;
                  let status = err.response.status;
                  if (status == 400 || status == 500) {
                    setErrors({ password: data });
                  } else if (status == 401) {
                    setErrors({ password: data.detail });
                  } else {
                    console.log("Unexpected error in login: ");
                    console.log("status: " + status);
                    console.log("data: " + data);
                  }
                } else {
                  setErrors({
                    password:
                      "Unfortunately, it looks like our webserver is down. We should have it back up shortly.",
                  });
                  console.log("Unexpected error in login: ");
                  console.error(err);
                }
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              onSubmit={handleSubmit}
              sx={{
                width: "100%",
                mt: 1,
              }}
            >
              <TextField
                margin="normal"
                fullWidth
                variant="outlined"
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                onChange={handleChange}
                values={values.username}
                error={errors.username && touched.username}
                helperText={
                  errors.username && touched.username ? errors.username : null
                }
                autoFocus
              />
              <TextField
                margin="normal"
                fullWidth
                variant="outlined"
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="password"
                onChange={handleChange}
                values={values.password}
                error={errors.password && touched.password}
                helperText={
                  errors.password && touched.password ? errors.password : null
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                endIcon={isSubmitting ? <CircularProgress /> : null}
                sx={{
                  m: (theme) => theme.spacing(3, 0, 2),
                }}
              >
                Sign In
              </Button>
              {/*<Typography>
                Don&apos;t have an account?&nbsp;
                <Link href="#" onClick={redirectToRegistration}>
                Register here!
                </Link>
                </Typography>*/}
            </form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
