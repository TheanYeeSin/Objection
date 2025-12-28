import { Accelerometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";

const DEBOUNCE_TIME = 1000;
const ACCELEROMETER_UPDATE_INTERVAL = 50;

/**
 *
 * @param sensitivity The sensitivity set by the user
 * @param onSlam The function to call when a slam is detected
 * @returns `magnitude`, `highest`, `isListening`, `start`, `stop`
 */
export function useAccelerometerListener(
  sensitivity: number,
  onSlam: () => void,
) {
  // ==============================
  // STATES & REFS
  // ==============================
  const [magnitude, setMagnitude] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const highestRef = useRef(0);
  const sub = useRef<{ remove: () => void } | null>(null);
  const lastSlamTime = useRef(0);

  // ==============================
  // ACCELEROMETER LISTENER
  // ==============================
  const start = () => {
    Accelerometer.setUpdateInterval(ACCELEROMETER_UPDATE_INTERVAL);
    sub.current = Accelerometer.addListener(({ x, y, z }) => {
      const gMag = Math.sqrt(x * x + y * y + z * z);
      const linearAccel = Math.abs(gMag - 1) * 9.81;
      const formattedAccel = Number(linearAccel.toFixed(2));
      setMagnitude(formattedAccel);

      if (linearAccel > highestRef.current) highestRef.current = linearAccel;

      const now = Date.now();
      if (
        linearAccel > sensitivity &&
        now - lastSlamTime.current > DEBOUNCE_TIME
      ) {
        lastSlamTime.current = now;
        onSlam();
      }
    });

    setIsListening(true);
  };

  const stop = () => {
    sub.current && sub.current.remove();
    sub.current = null;
    setIsListening(false);
  };

  useEffect(() => {
    return () => stop();
  }, []);

  // ==============================
  // RETURNS
  // ==============================
  return { magnitude, highest: highestRef.current, start, stop, isListening };
}
