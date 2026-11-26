/* vim: set ft=javascript tw=80 nu ai et ts=2 sw=2: */
/*
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2026-11-26 19:34:27 EET
# Path:   ~/.config/tridactyl/scripts/group-all-tabs.js
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------
*/

// Tell ESLint that this global is provided by Tridactyl at runtime.
/* global browser */

// Group all unpinned tabs in the current window into a single group.
;(async () => {
  const tabs = await browser.tabs.query({
    currentWindow: true,
    pinned: false,
  })

  if (!tabs.length) {
    return
  }

  return browser.tabs.group({
    tabIds: tabs.map((tab) => tab.id),
  })
})()
