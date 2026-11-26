/* vim: set ft=javascript tw=80 nu ai et ts=2 sw=2: */
/*
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2026-11-26 19:34:29 EET
# Path:   ~/.config/tridactyl/scripts/group-current-tab.js
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------
*/

// Tell ESLint that this global is provided by Tridactyl at runtime.
/* global browser */

// Create a new tab group containing the current tab.
;(async () => {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  })

  return browser.tabs.group({
    tabIds: tab.id,
  })
})()
