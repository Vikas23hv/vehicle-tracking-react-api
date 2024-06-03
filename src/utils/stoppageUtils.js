import { differenceInMinutes } from 'date-fns';

export const identifyStoppages = (gpsData, threshold) => {
  let stoppages = [];
  let start = null;

  for (let i = 1; i < gpsData.length; i++) {
    const isStationary = gpsData[i].speed < 1;

    if (isStationary) {
      if (!start) start = i - 1;
      if (i === gpsData.length - 1 || gpsData[i + 1].speed !== 0) {
        const duration = differenceInMinutes(new Date(gpsData[i].eventGeneratedTime), new Date(gpsData[start].eventGeneratedTime));
        if (duration >= threshold) {
          stoppages.push({
            latitude: gpsData[i].latitude,
            longitude: gpsData[i].longitude,
            reachTime: new Date(gpsData[start].eventGeneratedTime).toLocaleString(),
            endTime: new Date(gpsData[i].eventGeneratedTime).toLocaleString(),
            duration,
          });
        }
        start = null;
      }
    }
  }

  return stoppages;
};
