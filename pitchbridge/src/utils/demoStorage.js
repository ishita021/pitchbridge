'use strict'

const DEMO_SAVED_KEY = 'pb_demo_saved'
const DEMO_VIEWED_KEY = 'pb_demo_viewed'

function readIds(key) {
  if (typeof window === 'undefined') return []
  try {
    const value = localStorage.getItem(key)
    if (!value) return []
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : []
  } catch {
    return []
  }
}

function writeIds(key, ids) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(ids))
}

export function getDemoSavedIds() {
  return readIds(DEMO_SAVED_KEY)
}

export function getDemoViewedIds() {
  return readIds(DEMO_VIEWED_KEY)
}

export function toggleDemoSavedId(id) {
  const key = String(id)
  const ids = readIds(DEMO_SAVED_KEY)
  const exists = ids.includes(key)
  const next = exists ? ids.filter((item) => item !== key) : [...ids, key]
  writeIds(DEMO_SAVED_KEY, next)
  return !exists
}

export function addDemoViewedId(id) {
  const key = String(id)
  const ids = readIds(DEMO_VIEWED_KEY)
  const next = [key, ...ids.filter((item) => item !== key)].slice(0, 20)
  writeIds(DEMO_VIEWED_KEY, next)
  return next
}
