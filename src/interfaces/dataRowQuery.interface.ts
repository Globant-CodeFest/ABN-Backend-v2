import { DataRowInterface } from "./dataRow.interface";

export interface DataRowQueryInterface extends Partial<DataRowInterface>{
    year_To?: number;
    year_From?: number;
    month?: string;
}

// class that implements <Partial<DataRowInterface>> interface
export class DataRowQueryDTO implements Partial<DataRowInterface>{
    year_To?: number;
    year_From?: number;
    month?: string;
    id?: string;
    country?: string;
    station?: string;
    latitude?: number;
    longitude?: number;
    elevation?: number;
    year?: number;
    temp?: number;
}