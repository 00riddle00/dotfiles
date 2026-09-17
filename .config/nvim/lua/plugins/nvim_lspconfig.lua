-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-18 01:18:24 CEST
-- Path:   ~/.config/nvim/lua/plugins/nvim_lspconfig.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

return {
  "neovim/nvim-lspconfig",
  config = function()
    -- Initialize default Neovim LSP capabilities.
    local capabilities = vim.lsp.protocol.make_client_capabilities()
    capabilities.general = capabilities.general or {}

    -- Define all servers and their configs.
    --
    -- Possible future LSP candidates:
    -- * C / C++
    -- * CMake
    -- * CSS
    -- * HTML
    -- * Java
    -- * Perl
    -- * SQL
    local servers = {
      basedpyright = {
        capabilities = capabilities,
        settings = {
          basedpyright = {
            -- Use Ruff for import organization instead of BasedPyright.
            disableOrganizeImports = true,

            analysis = {
              -- Ruff handles linting and import-related diagnostics/code
              -- actions.
              -- BasedPyright handles static type analysis and Python language
              -- intelligence.
              diagnosticMode = "openFilesOnly",
              typeCheckingMode = "standard",

              -- Temporarily suppress BasedPyright diagnostics while reviewing
              -- unfamiliar code.
              -- Remove this to re-enable BasedPyright's type-analysis
              -- diagnostics.
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

      ts_ls = {
        capabilities = capabilities,
      },

      eslint = {
        capabilities = capabilities,

        -- nvim-lspconfig normally starts ESLint only when it finds an ESLint
        -- config file. Since the configuration is supplied below directly by
        -- Neovim, use the Git root or the current file's directory instead.
        root_dir = function(bufnr, on_dir)
          local root = vim.fs.root(bufnr, { ".git" })
            or vim.fs.dirname(vim.api.nvim_buf_get_name(bufnr))

          on_dir(root)
        end,

        settings = {
          -- Arch installs globally packaged Node modules here. Tell the ESLint
          -- language server where to find the system-wide ESLint library.
          nodePath = "/usr/lib/node_modules",

          options = {
            -- This disables project-local ESLint configuration lookup, so the
            -- settings below override project eslint.config.* / .eslintrc*
            -- files. If needed, this setup can instead be extended to respect
            -- project-local config when present and fall back to these
            -- Neovim-defined rules otherwise.
            overrideConfigFile = true,

            overrideConfig = {
              rules = {
                ["no-constant-condition"] = "error",
                ["no-undef"] = "error",
                ["no-unreachable"] = "error",
                ["no-unused-vars"] = "warn",
              },
            },
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
        filetypes = { "markdown" },
      },

      bashls = {
        capabilities = capabilities,
      },

      lua_ls = {
        capabilities = capabilities,
        settings = {
          Lua = {
            runtime = { version = "LuaJIT" },
            telemetry = { enable = false },
          },
        },
      },

      dockerls = {
        capabilities = capabilities,
      },

      jsonls = {
        capabilities = capabilities,
      },

      texlab = {
        capabilities = capabilities,
      },

      r_language_server = {
        capabilities = capabilities,
      },

      tombi = {
        capabilities = capabilities,
      },

      lemminx = {
        capabilities = capabilities,
        filetypes = { "xml" },
      },

      yamlls = {
        capabilities = capabilities,
        filetypes = { "yaml" },
      },

      --[[ Enable if needed
      harper_ls = {
        capabilities = capabilities,
        settings = {
          ["harper-ls"] = {
            linters = {
              SpellCheck = false,
            },
          },
        },
      },
      --]]
    }

    -- Apply server definitions.
    for name, cfg in pairs(servers) do
      vim.lsp.config(name, cfg)
    end

    -- Crucial: enable the configured servers so they can attach.
    vim.lsp.enable(vim.tbl_keys(servers))
  end,
}
