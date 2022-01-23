import { UserRepository } from "../../infra/repositories/user.repository";
import { User } from "../models/user";
import bcrypt from "bcrypt";

interface UserParams {
  name: string;
  
  pass: string;
}
/**
 * Este arquivo
 */
export class CreateUser {
  // injeção de dependência
  repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async execute(params: UserParams): Promise<User> {
    /**
     * Executa a lógica de negócio/aplicação para criar
     * a conta do usuário através na base de dados através
     * dos repositórios
     */

    // verificar se usuário já existe pelo e-mail
    const userExistsByEmail =
      await this.repository.verifyUserAlreadExistsByName(params.name);

    if (userExistsByEmail) {
      throw new Error("User already exists with this name");
    }

    /* // verificar se usuário já existe pelo documento
    const userExistsByDocument =
      await this.repository.verifyUserAlreadyExistsByDocument(params.document);

    if (userExistsByDocument) {
      throw new Error("User already exists with this document");
    }

    // verificar segurança da senha (> 6 caracteres, e ter um @)
    if (params.password.length < 6 || !params.password.includes("@")) {
      throw new Error("Weak password, lenght < 6 or not include @");
    } */

    // gera a hash da senha
    const hashPassword = await bcrypt.hash(
      params.pass,
      Number(process.env.PASSWORD_CRYPT_SALT)
    );

    // salvar usuário na base de dados
    const userCreated = await this.repository.createUser({
      name: params.name,      
      pass: hashPassword,
    });

    return userCreated;
  }
}
