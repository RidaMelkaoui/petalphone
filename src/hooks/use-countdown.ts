import { useEffect, useMemo, useState } from 'react';

import type { Pace } from '@/types/game';

export function secondsForTurn(pace: Pace, turn: 'draw' | 'guess') {
  if (pace === 'cozy') return null;
  if (pace === 'classic') return turn === 'draw' ? 60 : 30;
  return turn === 'draw' ? 30 : 15;
}

export function useCountdown(pace: Pace, turn: 'draw' | 'guess') {
  const total = useMemo(() => secondsForTurn(pace, turn), [pace, turn]);
  const [seconds, setSeconds] = useState(total);

  useEffect(() => {
    if (total === null) return;
    const timer = setInterval(() => {
      setSeconds((current) => (current === null ? null : Math.max(0, current - 1)));
    }, 1000);
    return () => clearInterval(timer);
  }, [total]);

  return {
    seconds,
    expired: seconds === 0,
    label: seconds === null ? 'Cozy · no timer' : `0:${String(seconds).padStart(2, '0')}`,
  };
}
