type ShipData = {
  sog: number; 
  cog: number; 
  hdg: number; 
};

export const predictedNavStatus = (current: ShipData, old: ShipData, minDistance: number): number => {
    if (!old) {
        return 1; 
    }
    const avgSOG = Math.abs(old.sog + current.sog)/2;
    const headingAndCOGDiffOld = Math.abs(old.cog - old.hdg);
    const headingAndCOGDiffCurrent = Math.abs(current.cog - current.hdg);
    const avgHeadingAndCOGDiff = Math.abs(headingAndCOGDiffOld + headingAndCOGDiffCurrent)/2;
    
    if (avgSOG < 0.4 && (avgHeadingAndCOGDiff < 10 || current.hdg == 511) && minDistance > 210) {
        console.log("AVG SOG: ", avgSOG, "AVG HDG/COG DIFF: ", avgHeadingAndCOGDiff);
        return 1;
    }
    return 0;
}
