/* vim: set ft=javascript tw=80 nu ai et ts=2 sw=2: */
/*
#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2026-09-14 00:27:13 CEST
# Path:   ~/.config/tridactyl/bookmark-tabs.js
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------
*/

// Tell ESLint that these globals are provided by Tridactyl at runtime.
/* global browser, JS_ARGS */

// Bookmark all tabs in the current window into a new folder at a fixed
// position inside the Bookmarks Toolbar.
;(async () => {
  // 1-based position in the Bookmarks Toolbar.
  // Change ONLY this number if you want a different insertion position.
  const TOOLBAR_POSITION = 3

  const args = JS_ARGS[0] === "" ? JS_ARGS.slice(1) : JS_ARGS
  const title = args.join(" ").trim()

  if (!title) {
    throw new Error("Usage: bookmarktabs <folder-name>")
  }

  const toolbarId = "toolbar_____"
  const toolbarItems = await browser.bookmarks.getChildren(toolbarId)

  if (TOOLBAR_POSITION > toolbarItems.length + 1) {
    throw new Error(
      `Toolbar position must be between 1 and ${toolbarItems.length + 1}`,
    )
  }

  const tabs = await browser.tabs.query({
    currentWindow: true,
  })

  tabs.sort((a, b) => a.index - b.index)

  const folder = await browser.bookmarks.create({
    parentId: toolbarId,
    index: TOOLBAR_POSITION - 1,
    title,
  })

  for (const tab of tabs) {
    if (!tab.url) {
      continue
    }

    await browser.bookmarks.create({
      parentId: folder.id,
      title: tab.title || tab.url,
      url: tab.url,
    })
  }

  return folder
})()
