// const fuelMultipliers = {
//     0: { ME: 1, AE: 1 },
//     1: { ME: 0, AE: 0.5 },
//     2: { ME: 1, AE: 1 },
//     3: { ME: 0.5, AE: 1 },
//     4: { ME: 0.5, AE: 1 },
//     5: { ME: 0, AE: 1 },
//     6: { ME: 1, AE: 1 },
//     7: { ME: 0.5, AE: 1 },
//     8: { ME: 1, AE: 1 },
//     9: { ME: 1, AE: 1 },
//     10: { ME: 1, AE: 1 },
//     11: { ME: 1, AE: 1 },
//     12: { ME: 1, AE: 1 },
//     13: { ME: 1, AE: 1 },
//     14: { ME: 0, AE: 0 },
//     15: { ME: 1, AE: 1 },
//   };

//   const getFuelByNavStatus = (navstatus, fuelMe, fuelAe) => {
//     const multipliers = fuelMultipliers[navstatus];
//     if (!multipliers) return { totalME: 0, totalAE: 0 };
//     return {
//       totalME: fuelMe * multipliers.ME,
//       totalAE: fuelAe * multipliers.AE,
//     };
//   };
//   const calculateTotalFuelTon = (totalFuelEstimate, fuelType) => {
//     return (totalFuelEstimate * fuelType.fuelDensity) / 1000;
//   };

//   export const firstFormulaFuel = async (
//     navstatus : number,
//     fuelType,
//     speedKnot,
//     timeDifferenceMinutes,
//   ) => {
//     let fuelEstimateME;
//     let fuelEstimateAE;

//     const conditionFormulas = formulas[condition];

//     if (conditionFormulas) {
//       fuelEstimateME = eval(conditionFormulas.me_formula);
//       fuelEstimateAE = eval(conditionFormulas.ae_formula);

//       fuelEstimateME = Math.max(fuelEstimateME, 0.5);
//       fuelEstimateAE = Math.max(fuelEstimateAE, 0.5);
//     } else {
//       console.error("Condition not found in formulas:", condition);
//       return {
//         error: "Invalid condition provided",
//       };
//     }

//     const fuelData = getFuelByNavStatus(
//       navstatus,
//       fuelEstimateME,
//       fuelEstimateAE
//     );

//     const totalFuelEstimate =
//       (fuelData.totalME + fuelData.totalAE) * timeDifferenceMinutes;

//     return {
//       fuelEstimateAE: fuelData.totalAE,
//       fuelEstimateME: fuelData.totalME,
//       fuelConsumptionMeMetricTon: calculateTotalFuelTon(
//         fuelData.totalME,
//         fuelType
//       ),
//       fuelConsumptionAeMetricTon: calculateTotalFuelTon(
//         fuelData.totalAE,
//         fuelType
//       ),
//       totalFuelEstimate,
//       estimatedFuelTon: calculateTotalFuelTon(totalFuelEstimate, fuelType),
//     };
//   };
