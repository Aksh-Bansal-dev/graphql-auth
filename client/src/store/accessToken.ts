import jwt_decode, { JwtPayload } from "jwt-decode";

let at = "";

export const setAccessToken = (s: string) => {
  at = s;
};
// @ts-ignore
export const getAccessToken = (): string => {
  const token = at;

  const { exp } = token ? jwt_decode<JwtPayload>(token) : { exp: null };

  if (exp && Date.now() >= exp * 1000) {
    fetch("http://localhost:5000/refresh_token", {
      method: "POST",
      credentials: "include",
    }).then(async (res) => {
      const data = await res.json();
      setAccessToken(data.accessToken);
      // console.log(data);
      return at;
    });
  } else {
    // console.log("bad");
    return at;
  }
};
