import { UserRepository } from "../../infra/repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import authConfig from "../../../../core/infra/config/auth.config";

interface Credentials {
  name: string;
  pass: string;
}

export class Login {
  repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async execute(credentials: Credentials): Promise<User> {
    /// consultar se existe o usuário na base dados
    const user = await this.repository.getUserByLogin(credentials.name);
    // verificar se o usuário de fato existe
    if (!user) throw new Error("User not valid");

    /// verificar se usuário está ativo
   /*  if (!user.enable) throw new Error("User not enable"); */

    /// validar senhas
    const passwordMatch = await bcrypt.compare(
      credentials.pass,
      user.pass as string
    );

    if (!passwordMatch) throw new Error("Login or password not valid");

    const { pass, ...userWithoutPass } = user;
    // return Object.assign({}, user, {password: undefined}); // mesma coisa do que fazer a linha de cima

    

    // Gero o token
    const payload = {
      name: user.name,
      pass: user.pass,
    };

    console.log(authConfig);
    const token = jwt.sign(payload, authConfig.secret as string, {
      expiresIn: authConfig.expiresIn,
    });
       
    
    console.log(token);
    /* return userWithoutPass; */
    return {
      ...userWithoutPass,
      token
    }
  }
}
