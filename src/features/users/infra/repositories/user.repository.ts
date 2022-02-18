import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { UserEntity } from "../../../../core/infra/data/database/entities/UserEntity";
import { User } from "../../domain/models/user";

interface UserParams {
  name: string;
  pass: string;
  /* messages: MessageEntity[] */
  
}

export class UserRepository {
 /*  static verifyUserByUid(user: any) {
      throw new Error("Method not implemented.");
  } */
  async getUserByLogin(name: string): Promise<User | undefined> {
    const user = await UserEntity.findOne({
      where: { name: name },
    });
    if (!user) return undefined;

    return {
      uid: user.uid,
       pass: user.pass, 
      name: user.name,
      
    };
  }

  async verifyUserAlreadExistsByName(name: string): Promise<boolean> {
    // procura o usuário pelo nome na base de dados
    const user = await UserEntity.findOne({
      where: { name: name },
    });

    if (!user) return false;

    return true;
  }

  async verifyUserByUid(uid: string): Promise<string | undefined> {
    // procura o usuário pelo nome na base de dados
    const user = await UserEntity.findOne({
      where: { uid: uid },
    });

    if (!user) return undefined;

    return  user.uid
    
  }


  @Transaction()
  async createUser(
    userParams: UserParams,
    @TransactionManager() transaction?: EntityManager
  ): Promise<User> {
    transaction = transaction as EntityManager;
    // transaction?.clear(UserEntity);
    // UserEntity.clear();


    // cria o user e salva no banco
    const user = transaction.create(UserEntity, {
      name: userParams.name,      
      pass: userParams.pass,
      
    });

    await transaction.save(user);

    return {
      uid: user.uid,
      name: user.name,
      pass: user.pass,
      
      
    };
  }
}
