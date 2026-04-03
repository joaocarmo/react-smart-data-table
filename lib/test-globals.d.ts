interface FetchMock {
  (...args: Parameters<typeof fetch>): ReturnType<typeof fetch>
  mockResponseOnce(body: string, init?: ResponseInit): void
  mock: { calls: unknown[][] }
}

declare const fetchMock: FetchMock
