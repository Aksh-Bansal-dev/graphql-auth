import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
} from "type-graphql";
import { User } from "./entity/User";
import { compare, hash } from "bcryptjs";
import { myContext } from "./myContext";
import authMiddleware from "./authMiddleware";
import { getAccessToken, sendRefreshToken } from "./tokenstuff";
import { getConnection } from "typeorm";

@ObjectType()
class LoginReturnType {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "Hello world from user resolver";
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => String)
  @UseMiddleware(authMiddleware)
  profile(@Ctx() { payload }: myContext) {
    return `Agent ${payload.userId} You are authenticated`;
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokenForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }

  // LOGOUT
  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: myContext) {
    sendRefreshToken(res);
    return true;
  }

  @Mutation(() => LoginReturnType)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: myContext
  ): Promise<LoginReturnType> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("You made this error! Couldn't find the user");
    }
    const isValid = await compare(password, user.password);

    if (!isValid) {
      throw new Error("You made this error! Wrong password");
    }
    // Login successful, give this person a token
    // @ts-ignore
    const jwt = getAccessToken(user);

    sendRefreshToken(ctx.res, user);

    return {
      accessToken: jwt,
    };
  }

  // Register user
  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    // Check if email already exist
    const user = await User.findOne({ where: { email } });
    if (user) {
      throw new Error("Thatt user alrady exists");
    }

    const hashedPassword = await hash(password, 12);
    try {
      await User.insert({
        email,
        password: hashedPassword,
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // Delete user
  @Mutation(() => Boolean)
  async deleteUser(@Arg("id") id: number) {
    const user = await User.find({ where: { id: id } });

    if (!user || user.length === 0) {
      throw new Error("Cant find that userrrrrrrrrrrrrrrr");
    }

    await User.delete(id);

    return true;
  }
}
