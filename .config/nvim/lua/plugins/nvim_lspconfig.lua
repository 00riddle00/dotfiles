-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-08-07 05:05:29 CEST
-- Path:   ~/.config/nvim/lua/plugins/nvim_lspconfig.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

-- Initialize default Neovim LSP capabilities
local capabilities = vim.lsp.protocol.make_client_capabilities()
capabilities.general = capabilities.general or {}

-- LSP was originally created by Microsoft for VS Code, which natively counts characters in UTF-16.
-- Force UTF-16 to prevent column offset bugs when using multi-byte characters (like emojis or accents).
capabilities.general.positionEncodings = { "utf-16" }

-- Define all servers & their configs
local servers = {
  pyright = {
    capabilities = capabilities,
    settings = {
      pyright = {
        -- Use Ruff for import organization instead of Pyright
        disableOrganizeImports = true,
      },
      python = {
        analysis = {
          -- Let Ruff handle lint-like diagnostics.
          -- Pyright still provides hover / go-to / rename / type intelligence.
          ignore = { "*" },
        },
      },
    },
  },

  ruff = {
    capabilities = capabilities,
    init_options = {
      settings = {
        organizeImports = true,
      },
    },
  },

  rust_analyzer = {
    capabilities = capabilities,
    settings = {
      ["rust-analyzer"] = {
        check = { command = "clippy" },
        diagnostics = { enable = true },
      },
    },
  },

  marksman = {
    capabilities = capabilities,
  },

  bashls = {
    capabilities = capabilities,
  },

  lua_ls = {
    capabilities = capabilities,
    settings = {
      Lua = {
        runtime = { version = "LuaJIT" },
        diagnostics = { globals = { "vim" } },
        workspace = {
          library = vim.api.nvim_get_runtime_file("", true),
          checkThirdParty = false,
        },
        telemetry = { enable = false },
      },
    },
  },

  --[[ Example: enable later if you need it
  harper_ls = {
    capabilities = capabilities,
    settings = {
      ["harper-ls"] = {
        userDictPath = "${XDG_CONFIG_HOME}/harper-ls/riddle-dict.txt",
        fileDictPath = "",
        linters = {
          SpellCheck = true,
          SpelledNumbers = false,
          AnA = true,
          SentenceCapitalization = true,
          UnclosedQuotes = true,
          WrongQuotes = false,
          LongSentences = true,
          RepeatedWords = true,
          Spaces = true,
          Matcher = true,
          CorrectNumberSuffix = true,
        },
        codeActions = { ForceStable = false },
        markdown = { IgnoreLinkTitle = false },
        diagnosticSeverity = "hint",
        isolateEnglish = false,
        dialect = "American",
        maxFileLength = 120000,
      },
    },
  },
  --]]
}

-- Apply definitions
for name, cfg in pairs(servers) do
  vim.lsp.config(name, cfg)
end

-- Crucial: enable them so they actually attach
vim.lsp.enable(vim.tbl_keys(servers))

--[[ nvim-cmp example (kept commented, as in your original)
require("cmp")({
  snippet = {
    expand = function(args)
      vim.fn["vsnip#anonymous"](args.body)
    end,
  },
  sources = {
    { name = "nvim_lsp" },
    { name = "vsnip" },
    { name = "path" },
    { name = "buffer" },
  },
})
--]]
