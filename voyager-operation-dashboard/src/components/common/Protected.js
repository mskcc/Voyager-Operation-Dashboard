import { useLocation } from "react-router-dom";
import LoginPage from "../../pages/login/Login";

export default function Protected(props) {
  const { children } = props;

  const access_token = localStorage.getItem("Beagle_access");
  const current_route = useLocation();

  if (access_token === null) {
    return <LoginPage redirectRoute={current_route} />;
  } else {
    return children;
  }
}
