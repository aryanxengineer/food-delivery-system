import { UserRepository } from "../repository/user.repository.js";
import { Role } from "../types/auth.types.js";
import { BadRequestError } from "../utils/errors.js";
import { GoogleService } from "./google.service.js";
import { TokenService } from "./token.service.js";

export class AuthService {
  constructor(
    private tokenService: TokenService,
    private googleService: GoogleService,
    private userRepository: UserRepository,
  ) {}

  //   Login service
  login = async (code: string) => {
    const userData = await this.googleService.authorizeUser(code);
    if (!userData) {
      throw new BadRequestError("Invalid google credentials.");
    }

    let user = await this.userRepository.findByEmail(userData.email);
    user = user ?? (await this.userRepository.create(userData));

    if(!user) {
      throw new BadRequestError("Invalid user credentials");
    }

    const accessToken = this.tokenService.getAccessToken(user);

    return {
      user,
      token: accessToken,
    };
  };

  //   Add role service
  addRole = async (id: string, role: Role) => {
    const user = await this.userRepository.findByIdAndUpdate(id, role);
    if(!user) {
      throw new BadRequestError("Invalid role credentials.")
    }

    const accessToken = this.tokenService.getAccessToken(user);

    return {
      user,
      token: accessToken
    }

  };
}
