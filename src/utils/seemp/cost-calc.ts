import {  assignGradeBasedOnDdVectorNew } from "../cii/cii-calculation";
import { calculateCIIRequired } from "../cii/cii-calculation";
import { IShipType } from "../../models/ships/Type";

export const calculatedYear = async (shipType: IShipType, capacity: number, ciiRating: number, higestZValueYear : number): Promise<number> => {
    const currentYear = new Date().getFullYear();
    const ciiRequiredInCurrentYear = await calculateCIIRequired(shipType, capacity);
    const ciiAttained = ciiRating * ciiRequiredInCurrentYear;


    for (let year = currentYear; year <= higestZValueYear; year++) {
        const ciiRequired = await calculateCIIRequired(
            shipType, 
            capacity,
            year
        );
        const ciiGrade = assignGradeBasedOnDdVectorNew(
            shipType.d,
            ciiAttained,
            ciiRequired
        )  
        if (ciiGrade === 'D' || ciiGrade === 'E') {
            return year - currentYear -1 ; 

        }
    }
    return higestZValueYear - currentYear; 
}


export const calculateCostPerYear = async(
    shipType: IShipType,
    capacity: number,
    ciiRating: number,
    highestYearZValue: number,
    totalCost: number
): Promise<number> => {

    const year = await calculatedYear(shipType, capacity, ciiRating, highestYearZValue);
    if (year <= 1) {
        return totalCost; 
    }
    const costPerYear = totalCost / year;
    return costPerYear;
}
