import { Injectable } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { DataRowQueryInterface } from './interfaces/dataRowQuery.interface';
import { getAverage } from './utils/getAverage';

@Injectable()
export class AppService {

  constructor(private readonly repositoryService: RepositoryService) {}

  async getCSVData() {
    const data = await this.repositoryService.getCSVData({});
    // return the last 20 items in data
    return data.slice(-20);
  }

  async searchData(query: DataRowQueryInterface) {
    const { year_From, year_To } = query;
    if (year_From > year_To) throw new Error('year_From must be less than year_To')

    const data = await this.repositoryService.getCSVData(query);
    const currentPeriodRecords = [];
    const previousPeriodRecords = [];
    const periodYears = year_To - year_From;

    data.forEach((record) => {
      if(year_From === year_To) {
        if(record.year === year_From) currentPeriodRecords.push(record);
        if(record.year === year_From - 1) previousPeriodRecords.push(record);
      } else {
        if(record.year >= year_From && record.year <= year_To) currentPeriodRecords.push(record);
        if(record.year >= year_From - periodYears && record.year <= year_To - periodYears) previousPeriodRecords.push(record);
      }
    });

    const currentPeriodAverage = getAverage(currentPeriodRecords);
    const previousPeriodAverage = getAverage(previousPeriodRecords);

    return { 
      stations: currentPeriodRecords,
      aggregated: {
        currentPeriodAverage,
        difference: Math.round((currentPeriodAverage - previousPeriodAverage + Number.EPSILON) * 100) / 100,
      }
     }
    
  }

  async getStations() {
    return this.repositoryService.getStations();
  }
}