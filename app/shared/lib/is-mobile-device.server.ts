import DeviceDetector from "device-detector-js";
import { type DeviceType } from "device-detector-js/dist/typings/device";

const deviceDetector = new DeviceDetector();

const mobileDeviceTypes: DeviceType[] = [
  "smartphone",
  "wearable",
  "feature phone",
  "portable media player",
  "peripheral",
];

export function isMobileDevice(userAgent: string) {
  const deviceType = deviceDetector.parse(userAgent).device?.type;
  if (deviceType === undefined) {
    return undefined;
  }

  return mobileDeviceTypes.includes(deviceType);
}
