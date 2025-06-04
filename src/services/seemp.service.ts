import { ShipRepository } from '../repositories/ships/ships.repository';
import { AnnualCIIRepository } from '../repositories/cii/annualcii.repository';
import { DailyCIIRepository } from '../repositories/cii/dailycii.repository';
import {
  calculateAirLubrication,
  calculateResistanceReduceDevice,
  calculateHullCoating,
  calculatePowerSystemMachinery,
  calculatePropEffDevice,
  calculateWasteHeatRecovery,
} from '../utils/seemp/first-formula';
import {
  calculateLNGFuel,
  calculateBioFuel,
} from '../utils/seemp/second-formula';
import {
  calculateSolarPower,
  calculateColdIroning,
  calculateWindPower,
  calculateFuelCells,
} from '../utils/seemp/third-formula';

export class SEEMPService {
  private shipRepository: ShipRepository;
  private annualCiiRepository: AnnualCIIRepository;
  private dailyCiiRepository: DailyCIIRepository;

  constructor() {
    this.shipRepository = new ShipRepository();
    this.annualCiiRepository = new AnnualCIIRepository();
    this.dailyCiiRepository = new DailyCIIRepository();
  }

  // Correctly use 'this' to call the method
  async calculateSemp(mmsi: string) {
    const anualCii = await this.annualCiiRepository.getByMmsi(mmsi);
    const thisYearCii = await this.dailyCiiRepository.getLatestByMmsi(mmsi);
    const vesselData = await this.shipRepository.getByMMSI(mmsi);

    if (!vesselData) {
      throw new Error('Vessel data not found');
    }

    if (!anualCii) {
      throw new Error('Annual CII data not found');
    }
    if (!thisYearCii) {
      throw new Error('This year CII data not found');
    }
    if (!thisYearCii.cii || thisYearCii.cii.length === 0) {
      throw new Error('CII data for this year is not available');
    }

    const voyagePerYear = vesselData.generalData.annualVoyagePercentage ?? 0;
    const ciiRequired = thisYearCii?.cii[0].cii.ciiRequired ?? 0;
    const ciiAttained = anualCii?.cii[0].cii.ciiAttained ?? 0;

    const airLubrication = calculateAirLubrication(
      voyagePerYear,
      ciiRequired,
      ciiAttained,
      vesselData,
    );
    const resistanceReduction = calculateResistanceReduceDevice(
      voyagePerYear,
      ciiRequired,
      ciiAttained,
      vesselData,
    );
    const hullCoating = calculateHullCoating(
      voyagePerYear,
      ciiRequired,
      ciiAttained,
      vesselData,
    );
    const powerSystemMachinery = calculatePowerSystemMachinery(
      voyagePerYear,
      ciiRequired,
      ciiAttained,
      vesselData,
    );
    const propEffDevice = calculatePropEffDevice(
      voyagePerYear,
      ciiRequired,
      ciiAttained,
      vesselData,
    );
    const wasteHeatRecovery = calculateWasteHeatRecovery(
      voyagePerYear,
      ciiRequired,
      ciiAttained,
      vesselData,
    );

    const lngFuel = await calculateLNGFuel(ciiRequired, anualCii, vesselData);
    const bioFuel = await calculateBioFuel(ciiRequired, anualCii, vesselData);

    const solarPower = await calculateSolarPower(
      ciiRequired,
      anualCii,
      vesselData,
    );
    const windPower = await calculateWindPower(
      ciiRequired,
      anualCii,
      vesselData,
    );
    const coldIroning = await calculateColdIroning(
      ciiRequired,
      anualCii,
      vesselData,
      voyagePerYear,
    );
    const fuelCells = await calculateFuelCells(
      ciiRequired,
      anualCii,
      vesselData,
    );

    const results = [
      {
        name: 'Modified and install hull air cavity lubrication system on ship',
        ...airLubrication,
      },
      {
        name: 'Modified and install resistance reduction devices on ship',
        ...resistanceReduction,
      },
      { name: 'Hull coating maintenance on the hull surface', ...hullCoating },
      {
        name: 'Variable speed electric power generation',
        ...powerSystemMachinery,
      },
      { name: 'Install propulsion efficiency devices', ...propEffDevice },
      {
        name: 'Utilize waste heat recovery from machinery devices on ship',
        ...wasteHeatRecovery,
      },
      { name: 'Using LNG for main engine and auxiliary engine', ...lngFuel },
      {
        name: 'Using biofuels for main engine and auxiliary engine',
        ...bioFuel,
      },
      {
        name: 'Using solar panel energy source for supply electricity demand on ship',
        ...solarPower,
      },
      {
        name: 'Using wind power energy source for supply electricity demand on ship',
        ...windPower,
      },
      {
        name: 'Using cold ironing energy source for supply electricity demand on ship',
        ...coldIroning,
      },
      {
        name: 'Using fuel cells energy source for supply electricity demand on ship',
        ...fuelCells,
      },
    ];

    const filteredResults = results.filter((item) =>
      ['A', 'B', 'C'].includes(item.ciiGradeAfter),
    );

    const sortedResults = filteredResults.sort((a, b) => a.cost - b.cost);
    return sortedResults;
  }

  async calculateSEEMPbyMMSI(mmsi: string) {
    const seemp = await this.calculateSemp(mmsi);
    const annualCII = await this.annualCiiRepository.getByMMSIAndYear(
      mmsi,
      new Date().getFullYear() - 1,
    );

    const updatedSemp = seemp.map((item) => ({
      recommendation: item.name,
      cost: item.costDisplay,
      ciiRatingAfter: Number(item.ciiRatingAfter.toFixed(8)),
      ciiGradeAfter: item.ciiGradeAfter,
      ciiRatingBefore: annualCII?.cii[0].cii.ciiRating,
      ciiGradeBefore: annualCII?.cii[0].cii.ciiGrade,
    }));

    return updatedSemp;
  }
}
