export function trackEvent(eventType, payload) {
  if (!window.adgeistAdvertiser) {
    console.warn('[adgeist] SDK not loaded, skipped', eventType, payload)
    return
  }
  window.adgeistAdvertiser
    .trackConversionEvent(eventType, payload)
    .then((recorded) => console.info('[adgeist]', eventType, payload, recorded ? 'recorded' : 'rejected'))
}

export function identifyUser(details) {
  if (!window.adgeistAdvertiser) return
  window.adgeistAdvertiser.setUserDetails(details)
}
