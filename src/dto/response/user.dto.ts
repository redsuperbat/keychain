export class UserDTO {
  id: number;
  email: string;

  public static fromJson(json: any) {
    const userDTO = new UserDTO();
    userDTO.id = json.id;
    userDTO.email = json.email;
    return userDTO;
  }
}
