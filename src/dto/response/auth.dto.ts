import type { UserDTO } from './user.dto.js';

export type AuthDTO = {
  token: string;
  refreshToken: string;
  user: UserDTO;
};
