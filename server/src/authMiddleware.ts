import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { myContext } from "./myContext";

const authMiddleware: MiddlewareFn<myContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  //   console.log(authorization);
  if (!authorization) {
    throw new Error("Please authenticate yourself before coming here");
  }
  try {
    const token = authorization.split(" ")[1];
    console.log(token);
    const payload = verify(token, process.env.JWT_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new Error("Please authenticate yourself before coming here");
  }
  return next();
};

export default authMiddleware;
