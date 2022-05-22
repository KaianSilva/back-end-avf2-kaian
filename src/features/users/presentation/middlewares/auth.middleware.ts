import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import authConfig from "../../../../core/infra/config/auth.config";

export default async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não informado" });
  }

  // Bearer 2sdf1as32df1as35d4f
  const [, token] = authHeader.split(" ");

  try {
    const payload = jwt.verify(token, authConfig.secret as string);

    req.name = (payload as any).name;

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
