import { useSyncExternalStore } from 'react';
import { PHONE_QUERY } from './dayView';

const subscribe = (listener: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const query = window.matchMedia(PHONE_QUERY);
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
};
const isPhone = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(PHONE_QUERY).matches;

/** True on a phone (under 700 px wide or under 500 px high), following turns and resizes. */
export function usePhoneLayout(): boolean {
  return useSyncExternalStore(subscribe, isPhone, () => false);
}
