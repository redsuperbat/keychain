import { RequestHandler } from 'express'
import { Database } from '../database'
import { BadRequest } from '../error/bad-request'
import { UserDTO } from '../dto/response/user.dto'

export class UsersController {
  public static delete: RequestHandler = async ({ params: { id } }, res) => {
    const user = await Database.userRepository.findOne(id, {
      relations: ['refreshTokens'],
    })

    // Throw error if user is not found
    if (!user) throw new BadRequest('Entity not found')

    await Database.refreshTokenRepository.remove(user.refreshTokens)
    await Database.userRepository.remove(user)

    // Create userDTO
    const userDTO = new UserDTO()
    userDTO.email = user.email
    userDTO.id = user.id

    res.json(userDTO)
  }

  public static get_all: RequestHandler = async (req, res) => {
    const users = await Database.userRepository.find({
      relations: ['refreshTokens'],
    })

    const userDtos = users.map((u) => UserDTO.fromJson(u))

    res.json(userDtos)
  }

  //  public delete_all: RequestHandler = (req, res) => {
  //    Database.userRepository.remove
  //   //  User.deleteMany({})
  //      .exec()
  //      .then((result) => res.json(result))
  //      .catch((error) => res.status(500).json({ error }));
  //  };

  // public edit: RequestHandler = (req: IUserDataRequest, res) => {
  //   const id = req.userData.userId;
  //   User.updateOne({ _id: mongoose.Types.ObjectId(id) }, { $set: req.body })
  //     .exec()
  //     .then((result) => res.json(result))
  //     .catch((error) => res.status(500).json({ error }));
  // };
}
