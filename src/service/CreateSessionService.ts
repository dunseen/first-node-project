import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { getRepository } from "typeorm";
import User from "../models/User";

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class CreateSessionService  {
  public async execute({email, password}: Request): Promise<Response>{
    const usersRepository =  getRepository(User);

    const user = await usersRepository.findOne({
      where: { email }
    });

    if(!user){
      throw Error('Incorrect email/password combination.');
    }

    const passwordMatched = await compare(password, user.password);

    if(!passwordMatched){
      throw Error('Incorrect email/password combination.');
    }

    const token =  sign({},'47da3c3cd3c6edf62f7890423ad2898c',{
      subject: user.id,
      expiresIn: '1d',
    });

    return {
      user,
      token
    }

  }

}

export default CreateSessionService;
