/* eslint-disable max-len */
import { Router } from 'express';
import CreateSessionService from '../service/CreateSessionService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const createSession = new CreateSessionService();

  const { user, token } = await createSession.execute({ email, password });

  // @ts-expect-error
  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
