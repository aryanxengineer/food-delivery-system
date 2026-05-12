import User, { IUser } from "../models/user.model.js";
import { Role } from "../types/auth.types.js";

export class UserRepository {
  constructor() {}

  findById = async (id: string): Promise<IUser | null> => {
    return User.findById(id);
  };

  findByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({ email });
  };

  create = async (userData: {
    name: string;
    email: string;
    picture: string;
  }): Promise<IUser | null> => {
    return User.create({
      name: userData.name,
      email: userData.email,
      image: userData.picture,
    });
  };

  findByIdAndUpdate = (id: string, role: Role): Promise<IUser | null> => {
    return User.findByIdAndUpdate(id, { role }, { new: true });
  };
}
