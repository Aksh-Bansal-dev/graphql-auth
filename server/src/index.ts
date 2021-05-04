import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./UserResolver";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { getAccessToken, sendRefreshToken } from "./tokenstuff";
import cors from "cors";

require("dotenv").config({ path: __dirname + "/.env" });

(async () => {
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.get("/", (_req, res) => {
    res.send("Congrats! You found the Easter egg.");
  });

  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jwtCookie;
    if (!token) {
      console.log("token not found");
      res.send({ ok: false, accessToken: "" });
    }
    let payload: any = null;
    try {
      payload = verify(token, process.env.JWT_REFRESH_SECRET!);

      if (!payload) {
        console.log("payload not found");
        res.send({ ok: false, accessToken: "" });
      }

      const user = await User.findOne({ id: payload.userId });

      if (!user) {
        console.log("user not found");
        res.send({ ok: false, accessToken: "" });
      }

      const jwt = getAccessToken(user!);

      if (user?.tokenVersion !== payload.tokenVersion) {
        console.log("invalid token version");
        res.send({ ok: false, accessToken: "" });
      }

      sendRefreshToken(res, user!);

      res.send({ ok: true, accessToken: jwt });
    } catch (err) {
      console.log("errrrr \n");
      console.log(err);
      res.send({ ok: false, accessToken: "" });
    }
  });

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(5000, () => {
    console.log("Server starting at 5000...");
  });
})();

// import {createConnection} from "typeorm";
// import {User} from "./entity/User";

// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
