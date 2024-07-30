-- vim:fenc=utf-8:tw=79:nu:ai:si:et:ts=2:sw=2:ft=lua
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2024-07-30 16:11:10 EEST
-- Path:   ~/.config/nvim/lua/plugins/nvim-treesitter.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

require("nvim-treesitter.configs").setup {
  -- A list of parser names, or "all" (the five listed parsers should always be
  -- installed)
  ensure_installed = { "c", "lua", "vim", "vimdoc", "query" },

  -- Install parsers synchronously (only applied to `ensure_installed`)
  sync_install = false,

  -- Automatically install missing parsers when entering buffer
  -- Recommendation: set it to false if `tree-sitter` CLI is not installed
  -- locally
  auto_install = true,

  -- List of parsers to ignore installing (for "all")
  ignore_install = { "javascript" },

  ---- If there is a need to change the installation directory of the parsers
  ---  (see -> Advanced Setup)
  -- parser_install_dir = "/some/path/to/store/parsers", -- Remember to run
  -- vim.opt.runtimepath:append("/some/path/to/store/parsers")!

  highlight = {
    enable = true,

    -- NOTE: These are the names of the parsers and not the filetype (for
    -- example, if there is a preference to disable the highlighting for the
    -- `tex` filetype, `latex` needs to be included in this list as this is the
    -- name of the parser).
    -- List of languages that will be disabled
    disable = { "c", "rust" },
    -- Or use a function for more flexibility, e.g. to disable slow treesitter
    -- highlight for large files.
    disable = function(lang, buf)
        local max_filesize = 100 * 1024 -- 100 KB
        local ok, stats = pcall(vim.loop.fs_stat, vim.api.nvim_buf_get_name(buf))
        if ok and stats and stats.size > max_filesize then
            return true
        end
    end,

    -- Setting this to true will run `:h syntax` and tree-sitter at the same
    -- time.
    -- Set this to `true` if there is a dependence on 'syntax' being enabled
    -- (like for indentation).
    -- Using this option may slow down the editor, and some duplicate
    -- highlights may appear.
    -- Instead of true it can also be a list of languages
    additional_vim_regex_highlighting = false,
  },
}
