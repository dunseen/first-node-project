/* eslint-disable max-len */
import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../../config/upload';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import CreateUserService from '../../modules/users/services/CreateUserService';
import UpdateUserAvatarService from '../../modules/users/services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  // @ts-expect-error
  delete user.password;

  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const {
      user: { id },
      file: { filename },
    } = request;

    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      user_id: id,
      avatarFileName: filename,
    });

    // @ts-expect-error
    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;
