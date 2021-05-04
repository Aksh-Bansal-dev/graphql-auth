import { getAccessToken, setAccessToken } from "../store/accessToken";
import jwt_decode, { JwtPayload } from "jwt-decode";

const checker = () => {
  const token = getAccessToken();

  const { exp } = token ? jwt_decode<JwtPayload>(token) : { exp: null };

  if (exp && Date.now() >= exp * 1000) {
    console.log("expired");
    fetch("http://localhost:5000/refresh_token", {
      method: "POST",
      credentials: "include",
    }).then(async (res) => {
      const data = await res.json();
      setAccessToken(data.accessToken);

      console.log(data);
    });
  }
};

export default checker;
