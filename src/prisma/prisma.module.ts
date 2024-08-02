import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService], //Declara que o PrismaService faz parte do modulo
  exports: [PrismaService], // Quem importa o prisma.module tera acesso a esse recursoss
})
export class PrismaModule {}
