/* vim: set ft=javascript tw=80 nu ai et ts=2 sw=2: */
/*
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2026-11-26 19:52:09 EET
# Path:   ~/.config/tridactyl/scripts/clear-microsoft-data.js
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------
*/

// Tell ESLint that this global is provided by Tridactyl at runtime.
/* global browser */

// Work around a recurring Outlook authentication issue where signing in
// immediately triggers a sign-out, followed by a message instructing the
// user to close the browser tab.
//
// Manually clearing Microsoft cookies and site data through Firefox settings
// has been the only reliable workaround observed so far.
//
// Attempt to automate this cleanup for the specified Microsoft domains and
// their subdomains discovered from existing cookies.
//
// Related issue: https://bugzilla.mozilla.org/show_bug.cgi?id=1995747
;(async () => {
  const domains = [
    "cloud.microsoft",
    "live.com",
    "microsoft.com",
    "microsoft365.com",
    "microsoftonline.com",
    "office.com",
    "office365.com",
    "outlook.com",
    "static.microsoft",
  ]

  // Retrieve both partitioned and unpartitioned cookies.
  const cookies = await browser.cookies.getAll({
    partitionKey: {},
  })

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
