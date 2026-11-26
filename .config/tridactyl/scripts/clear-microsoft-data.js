/* vim: set ft=javascript tw=80 nu ai et ts=2 sw=2: */
/*
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2026-11-26 19:34:23 EET
# Path:   ~/.config/tridactyl/scripts/clear-microsoft-data.js
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------
*/

// Tell ESLint that this global is provided by Tridactyl at runtime.
/* global browser */

// Clear Microsoft cookies and site data for the specified domains and
// their subdomains discovered from existing cookies.
;(async () => {
  const domains = [
    "cloud.microsoft",
    "microsoftonline.com",
    "office.com",
    "static.microsoft",
  ]

  const cookies = await browser.cookies.getAll({})

  // Discover matching subdomains, stripping leading dots from cookie domains.
  const hosts = cookies
    .map((cookie) => cookie.domain.replace(/^\./, ""))
    .filter((host) =>
      domains.some((domain) => host === domain || host.endsWith(`.${domain}`)),
    )

  // Include the base domains and remove duplicate hostnames.
  const hostnames = [...new Set([...domains, ...hosts])]

  return browser.browsingData.remove(
    { hostnames },
    {
      cookies: true,
      localStorage: true,
      indexedDB: true,
      serviceWorkers: true,
    },
  )
})()
