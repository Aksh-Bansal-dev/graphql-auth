import { sign } from "jsonwebtoken";
import { User } from "./entity/User";
import { Response } from "express";

export const getAccessToken = (user: User) => {
  return sign({ userId: user!.id }, process.env.JWT_SECRET!, {
    expiresIn: "2m",
  });
};

export const sendRefreshToken = (res: Response, user?: User) => {
  if (!user) {
    res.cookie("jwtCookie", "logout");
    return;
  }
  res.cookie(
    "jwtCookie",
    sign(
      { userId: user.id, tokenVersion: user.tokenVersion },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: "10m",
      }
    ),
    {
      httpOnly: true,
      path: "/refresh_token",
    }
  );
};
