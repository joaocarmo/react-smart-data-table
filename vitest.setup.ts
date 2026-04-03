import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import type { FetchMock } from './lib/test-globals'

const createFetchMock = (): FetchMock => {
  const fn = vi.fn()

  return Object.assign(fn, {
    mockResponseOnce(body: string, init?: ResponseInit) {
      fn.mockImplementationOnce(() => Promise.resolve(new Response(body, init)))
    },
  }) as unknown as FetchMock
}

const fetchMock = createFetchMock()

vi.stubGlobal('fetch', fetchMock)
vi.stubGlobal('fetchMock', fetchMock)
