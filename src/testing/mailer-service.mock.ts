import { MailerService } from '@nestjs-modules/mailer/dist';

//To create a mock to the constructor dependency mailer from auth.service.

export const mailerServiceMock = {
  provide: MailerService,
  useValue: {
    sendMail: jest.fn(),
  },
};
