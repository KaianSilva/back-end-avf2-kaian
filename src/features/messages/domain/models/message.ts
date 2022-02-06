import { UserEntity } from "../../../../core/infra/data/database/entities/UserEntity";

export interface Message {
    uid: string;
    user: UserEntity;
    title: string;
    description: string;
  }
  