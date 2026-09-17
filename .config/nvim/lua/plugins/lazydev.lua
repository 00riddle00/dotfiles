-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
--------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-18 01:16:34 CEST
-- Path:   ~/.config/nvim/lua/plugins/lazydev.lua
-- URL:    https://github.com/00riddle00/dotfiles
--------------------------------------------------------------------------------

---@type LazyPluginSpec
return {
  "folke/lazydev.nvim",
  ft = "lua",
  opts = {
    library = {
      -- Always expose lazy.nvim's type annotations to lua_ls, so plugin spec
      -- fields such as `cond`, `dependencies`, `event`, etc. autocomplete.
      "lazy.nvim",
    },
  },
}
