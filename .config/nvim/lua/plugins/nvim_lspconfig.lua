-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-03 18:44:51 CEST
-- Path:   ~/.config/nvim/lua/plugins/nvim_lspconfig.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

-- Initialize default Neovim LSP capabilities
local capabilities = vim.lsp.protocol.make_client_capabilities()
capabilities.general = capabilities.general or {}

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
          -- Ruff handles linting and import-related diagnostics/code actions.
          -- Pyright handles static type analysis and Python language intelligence.
          diagnosticMode = "openFilesOnly",
          typeCheckingMode = "standard",

          -- Temporarily suppress Pyright diagnostics while reviewing unfamiliar code.
          -- Remove this to re-enable Pyright's type-analysis diagnostics.
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
