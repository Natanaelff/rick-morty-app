import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * useState whose value is persisted in AsyncStorage under `key`.
 * Loads the stored value on mount and writes back on every change.
 * The setter has the same signature as useState's (value or updater).
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const hasLoaded = useRef(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key)
      .then((stored) => {
        if (active && stored != null) {
          try {
            setValue(JSON.parse(stored) as T);
          } catch {
            // Ignore corrupted value and keep the initial.
          }
        }
      })
      .finally(() => {
        hasLoaded.current = true;
      });
    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => {
    // Avoid overwriting storage with the initial value before the load runs.
    if (hasLoaded.current) {
      AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
    }
  }, [key, value]);

  return [value, setValue];
}

export default usePersistedState;
