import { useState, useEffect, useMemo } from "react";

export function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  // ✅ мемоизируем объект, чтобы React Query не видел новые ссылки
  return useMemo(() => debounced, [debounced]);
}
