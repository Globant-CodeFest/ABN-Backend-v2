import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { DataRowQueryInterface, DataRowQueryDTO } from './interfaces/dataRowQuery.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/csv')
  getCSVData(){ 
    return this.appService.getCSVData();
  }

  @Get('/search')
  getData(@Query (new ValidationPipe({
    forbidNonWhitelisted: true, 
  })) query: DataRowQueryDTO){
    return this.appService.searchData(query);
  }

  @Get('/stations')
  getStations(){
    return this.appService.getStations();
  }  
}
