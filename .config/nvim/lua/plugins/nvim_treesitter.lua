-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-08-07 05:05:34 CEST
-- Path:   ~/.config/nvim/lua/plugins/nvim_treesitter.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

-- vim:fenc=utf-8:tw=79:nu:ai:si:et:ts=2:sw=2:ft=lua

local ts = require("nvim-treesitter")

ts.setup()

local ensure_installed = {
  "c",
  "lua",
  "vim",
  "vimdoc",
  "query",
}

ts.install(ensure_installed)

vim.api.nvim_create_autocmd("FileType", {
  callback = function(args)
    local lang = vim.treesitter.language.get_lang(vim.bo[args.buf].filetype)
    if not lang then
      return
    end

    if lang == "c" or lang == "rust" then
      return
    end

    local ok, stats = pcall(
      vim.loop.fs_stat,
      vim.api.nvim_buf_get_name(args.buf)
    )

    if ok and stats and stats.size > 100 * 1024 then
      return
    end

    pcall(vim.treesitter.start, args.buf)

    vim.bo[args.buf].indentexpr =
      "v:lua.require'nvim-treesitter'.indentexpr()"
  end,
})
