export function startTimer() {
  const start = performance.now();
  return () => Math.round(performance.now() - start);
}
