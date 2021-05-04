import { Request, Response } from "express";

export interface myContext {
  req: Request;
  res: Response;
  payload: { userId: string };
}
