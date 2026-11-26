/* vim: set ft=javascript tw=80 nu ai et ts=2 sw=2: */
/*
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2026-11-26 19:34:31 EET
# Path:   ~/.config/tridactyl/scripts/ungroup-current-group.js
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------
*/

// Tell ESLint that this global is provided by Tridactyl at runtime.
/* global browser */

// Ungroup all tabs belonging to the current tab's group.
;(async () => {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  })

  // A group ID of -1 indicates that the tab is not in a group.
  if (tab.groupId === -1) {
    return
  }

  const tabs = await browser.tabs.query({
    currentWindow: true,
    groupId: tab.groupId,
  })

  return browser.tabs.ungroup(tabs.map((tab) => tab.id))
})()
