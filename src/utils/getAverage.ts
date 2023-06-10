import { DataRowInterface } from "src/interfaces/dataRow.interface";

export function getAverage(records: DataRowInterface[]) {
    const currentPeriodTempRecordsByYear = records.reduce((acc, curr) => {
        const year = curr.year;
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(curr);
        return acc;
      }, {});
  
      // an object containing the temp averages per year from currentPeriodTempRecordsByYear
      const currentPeriodTempAveragesByYear: Record<number, number> = Object.keys(currentPeriodTempRecordsByYear).reduce((acc, curr) => {
        const year = curr;
        const temps = currentPeriodTempRecordsByYear[curr].map((record) => record.temp);
        const average = temps.reduce((acc, curr) => acc + curr, 0) / temps.length;
        acc[year] = average;
        return acc;
      }, {}); 
  
      const tempSum = Object.values(currentPeriodTempAveragesByYear).reduce((acc, curr) => acc + curr, 0) 

      if(tempSum === 0) return 0;
      const result = tempSum / Object.values(currentPeriodTempAveragesByYear).length;
      return Math.round((result + Number.EPSILON) * 100) / 100;
      
     

}