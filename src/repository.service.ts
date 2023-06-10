// Nestjs service with a get method that will read and parse a csv file

import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import { join } from 'path';
import { DataRowInterface } from './interfaces/dataRow.interface';
import { DataRowQueryInterface } from './interfaces/dataRowQuery.interface';

const Argentina = join(__dirname, '../dataFiles/Argentina.csv');
const Germany = join(__dirname, '../dataFiles/Germany.csv');
const Sudan = join(__dirname, '../dataFiles/Sudan.csv');

const stations = join(__dirname, '../dataFiles/stations.csv');

@Injectable()
export class RepositoryService {
  // method that reads a csv file as a stream and returns a json object using csvparser
  async getCSVData(query: DataRowQueryInterface): Promise<DataRowInterface[]> {
    return new Promise((resolve, reject) => {
      let countryData;
      if (query.country == 'Argentina') {
        countryData = Argentina;
      } else if(query.country == 'Germany'){
        countryData = Germany;
      } else if(query.country == "Sudan"){
        countryData = Sudan;
      }
      const results: DataRowInterface[] = [];
      createReadStream(countryData)
        .pipe(csv({ mapHeaders: ({ header }) => header.toLowerCase() }))
        .on('data', (data) => {
          const { year_To, year_From, ...rest } = query;
          if (rest.month === 'all') delete rest.month;
          // if data matches the query, return nothing
          if (
            Object.keys(rest).length &&
            !Object.keys(rest).every((key) => {
              return data[key] === rest[key];
            })
          ) {
            return;
          }

          results.push(data);
        })
        .on('end', () => {
          //for each item in results, get all from the same year, month, station, and country and calculate the average temp, then return the new array with the average temp
          const resultsByYearMonthStationCountry = results.reduce(
            (acc, curr) => {
              const year = curr.year;
              const month = curr.month;
              const station = curr.station;
              const country = curr.country;

              if (!acc[year]) {
                acc[year] = {};
              }
              if (!acc[year][month]) {
                acc[year][month] = {};
              }
              if (!acc[year][month][station]) {
                acc[year][month][station] = {};
              }
              if (!acc[year][month][station][country]) {
                acc[year][month][station][country] = [];
              }

              acc[year][month][station][country].push(curr);
              return acc;
            },
            {},
          );

          const resultsWithAverageTemp: DataRowInterface[] = [];
          for (const year in resultsByYearMonthStationCountry) {
            for (const month in resultsByYearMonthStationCountry[year]) {
              for (const station in resultsByYearMonthStationCountry[year][
                month
              ]) {
                for (const country in resultsByYearMonthStationCountry[year][
                  month
                ][station]) {
                  const data =
                    resultsByYearMonthStationCountry[year][month][station][
                      country
                    ];
                  const averageTemp =
                    data.reduce((acc, curr) => {
                      return acc + parseFloat(curr.temp);
                    }, 0) / data.length;
                  resultsWithAverageTemp.push({
                    ...data[0],
                    temp:
                      Math.round((averageTemp + Number.EPSILON) * 100) / 100,
                  });
                }
              }
            }
          }

          resolve(resultsWithAverageTemp);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  //method that returns all unique stations from a csv file
  async getStations() {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      createReadStream(stations)
        .pipe(csv({ mapHeaders: ({ header }) => header.toLowerCase() }))
        .on('data', (data) => results.push(data))
        .on('end', () => {
          const resultsByStation = results.reduce((acc, curr) => {
            const station = curr.station;

            if (!acc[station]) {
              acc[station] = [];
            }
            acc[station].push(curr);
            return acc;
          }, {});

          const uniqueStations: DataRowInterface[] = [];
          for (const station in resultsByStation) {
            const stationData = resultsByStation[station];
            uniqueStations.push({
              ...stationData[0],
            });
          }

          resolve(uniqueStations);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
