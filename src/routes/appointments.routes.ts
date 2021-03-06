/* eslint-disable max-len */
import { Router } from 'express';
import {
  startOfHour, parseISO,
} from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentsRepository.all();

  return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parseDate = startOfHour(parseISO(date));

  const findAppointmentsInSameDate = appointmentsRepository.findByDate(parseDate);
  if (findAppointmentsInSameDate) {
    return response.status(400).json({ message: 'This appointment is already booked' });
  }

  const appointment = appointmentsRepository.create({ provider, date: parseDate });

  response.json(appointment);
});

export default appointmentsRouter;
