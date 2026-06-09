import { describe, it, expect, vi, beforeEach } from "vitest"
import { api } from "@/lib/api"
import { setToken, clearToken } from "@/lib/token"

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
  sessionStorage.clear()
  clearToken()
})

describe("ApiClient", () => {
  it("sends GET request", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: "ok" }),
    })
    const result = await api.get<{ data: string }>("/test")
    expect(result.data).toBe("ok")
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it("attaches auth token", async () => {
    setToken("test-token")
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    })
    await api.get("/test")
    const call = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(call[1].headers).toMatchObject({
      Authorization: "Bearer test-token",
    })
  })

  it("retries and fails after exhausting retries", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"))
    await expect(api.get("/test", { retries: 0 })).rejects.toThrow("Network error")
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it("clears token on 401", async () => {
    setToken("bad-token")
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: "Unauthorized" }),
    })
    const unauthSpy = vi.fn()
    window.addEventListener("auth:unauthorized", unauthSpy)
    await expect(api.get("/test", { retries: 0 })).rejects.toMatchObject({ status: 401 })
    expect(clearToken()).toBeUndefined()
    expect(unauthSpy).toHaveBeenCalled()
  })

  it("sends POST with JSON body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    })
    const result = await api.post<{ id: number }>("/test", { name: "test" })
    expect(result.id).toBe(1)
    const call = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(call[1].method).toBe("POST")
    expect(call[1].body).toBe(JSON.stringify({ name: "test" }))
  })
})
