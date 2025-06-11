-- vim:fenc=utf-8:tw=79:nu:ai:si:et:ts=2:sw=2:ft=lua
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2025-05-05 03:29:01 EEST
-- Path:   ~/.config/nvim/lua/plugins/nvim-lspconfig.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

local capabilities = vim.lsp.protocol.make_client_capabilities()
capabilities.general.positionEncodings = { "utf-16" }

-- Use Ruff exclusively for linting, formatting, and organizing imports, hence
-- disable those capabilities for Pyright:
require("lspconfig").pyright.setup {
  capabilities = capabilities,
  settings = {
    pyright = {
      -- Using Ruff's import organizer
      disableOrganizeImports = true,
    },
    python = {
      analysis = {
        -- Ignore all files for analysis to exclusively use Ruff for linting
        ignore = { "*" },
      },
    },
  },
}

require("lspconfig").ruff.setup({
  capabilities = capabilities,
  init_options = {
    settings = {
      args = { "--fix", "--line-length", "88" },
      organizeImports = true,
    },
  },
})

require("lspconfig").rust_analyzer.setup {
  capabilities = capabilities,
  settings = {
    ['rust-analyzer'] = {
      check = {
        command = "clippy";
      },
      diagnostics = {
        enable = true;
      }
    }
  }
}

require("lspconfig").marksman.setup{}

--[[
require("cmp").setup({
  snippet = {
    expand = function(args)
         vim.fn["vsnip#anonymous"](args.body)
    end,
  },
  sources =  {
    { name = 'nvim_lsp' },
    { name = 'vsnip' },
    { name = 'path' },
    { name = 'buffer' },
  },
})
--]]

require ("lspconfig").bashls.setup({})

require("lspconfig").lua_ls.setup {
  capabilities = capabilities,
  settings = {
    Lua = {
      runtime = {
        version = "LuaJIT", -- Use LuaJIT for Neovim
      },
      diagnostics = {
        globals = { "vim" }, -- Recognize 'vim' as a global variable
      },
      workspace = {
        library = vim.api.nvim_get_runtime_file("", true), -- Include Neovim runtime files
        checkThirdParty = false, -- Disable third-party checks
      },
      telemetry = {
        enable = false, -- Disable telemetry
      },
    },
  },
}

require('lspconfig').harper_ls.setup {
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
        CorrectNumberSuffix = true
      },
      codeActions = {
        ForceStable = false
      },
      markdown = {
        IgnoreLinkTitle = false
      },
      diagnosticSeverity = "hint",
      isolateEnglish = false,
      dialect = "American",
      maxFileLength = 120000
    }
  }
}
