import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res:Response): any {
    const rsi =  this.appService.getHello();
    return res.json({
      data:rsi
    })
  }
}
