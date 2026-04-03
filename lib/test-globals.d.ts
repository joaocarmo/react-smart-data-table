export interface FetchMock {
  (...args: Parameters<typeof fetch>): ReturnType<typeof fetch>
  mockResponseOnce(body: string, init?: ResponseInit): void
  mock: { calls: unknown[][] }
}

declare global {
  const fetchMock: FetchMock
}
