interface ApiCallLog {
  method: string;
  url: string;
  data?: any;
  timestamp?: number;
}

export const logApiCall = (config: ApiCallLog) => {
  if (__DEV__) {
    const { method, url, data } = config;
    console.log(`[API] ${method?.toUpperCase()} ${url}`, data ? { data } : '');
  }
};
