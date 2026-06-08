import { describe, it, expect, vi, beforeEach } from "vitest"
import { api } from "@/lib/api"

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
  localStorage.clear()
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

  it("attaches auth token from localStorage", async () => {
    localStorage.setItem("authToken", "test-token")
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
    localStorage.setItem("authToken", "bad-token")
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: "Unauthorized" }),
    })
    const unauthSpy = vi.fn()
    window.addEventListener("auth:unauthorized", unauthSpy)
    await expect(api.get("/test", { retries: 0 })).rejects.toMatchObject({ status: 401 })
    expect(localStorage.getItem("authToken")).toBeNull()
    expect(unauthSpy).toHaveBeenCalled()
  })

  it("sends POST with JSON body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    })
    const body = { name: "Test" }
    await api.post("/test", body)
    const call = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(call[1].method).toBe("POST")
    expect(call[1].body).toBe(JSON.stringify(body))
  })

  it("handles timeout", async () => {
    vi.useFakeTimers()
    mockFetch.mockImplementationOnce(
      () => new Promise((_, reject) => {
        setTimeout(() => reject(new DOMException("Aborted", "AbortError")), 100)
      }),
    )
    const promise = api.get("/test", { timeout: 50, retries: 0 })
    vi.advanceTimersByTime(100)
    await expect(promise).rejects.toMatchObject({ status: 408 })
    vi.useRealTimers()
  })

  it("retries with backoff delay", async () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    mockFetch.mockRejectedValue(new Error("Network error"))
    const promise = api.get("/test", { retries: 2 }).catch(spy)
    await vi.advanceTimersByTimeAsync(1000) // first retry delay
    await vi.advanceTimersByTimeAsync(2000) // second retry delay
    await vi.runAllTimersAsync()
    expect(spy).toHaveBeenCalled()
    expect(mockFetch).toHaveBeenCalledTimes(3)
    vi.useRealTimers()
  })
})
