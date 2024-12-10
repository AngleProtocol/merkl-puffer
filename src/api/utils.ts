import chalk from "chalk";

function logStatus(status: number) {
  if (status === 200) return chalk.green(`[${status}]`);
  if (status < 500) return chalk.yellow(`[${status}]`);
  return chalk.red(`[${status}]`);
}

function logPerformance(ms: number) {
  if (ms < 100) return chalk.green(`[${Math.round(ms)}ms]`);
  if (ms < 500) return chalk.yellow(`[${Math.round(ms)}ms]`);
  return chalk.red(`[${Math.round(ms)}ms]`);
}

function logSize(bytes: number) {
  const kb = Math.round(bytes / 1000);

  return `[${kb}kb]`;
}

export async function fetchWithLogs<R, T extends { data: R; status: number; response: Response }>(
  call: () => Promise<T>,
) {
  const start = performance.now();
  const response = await call();
  const end = performance.now() - start;

  process.env.NODE_ENV === "development" &&
    console.info(
      `${logStatus(response.status)}${logPerformance(end)}${logSize(
        +(response.response.headers.get("content-length") ?? 0),
      )}: ${response.response.url}`,
    );

  return response;
}
