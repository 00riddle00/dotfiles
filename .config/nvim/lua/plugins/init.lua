-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
--------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-09-02 23:21:23 CEST
-- Path:   ~/.config/nvim/lua/plugins/init.lua
-- URL:    https://github.com/00riddle00/dotfiles
--------------------------------------------------------------------------------

return {
  ------------------------------------------------------------------------------
  -- UI / Appearance
  ------------------------------------------------------------------------------

  {
    "folke/tokyonight.nvim",
    priority = 1000,
    lazy = false,
    config = function()
      vim.cmd([[colorscheme tokyonight]])
    end,
  },

  {
    "folke/snacks.nvim",
    priority = 1000,
    lazy = false,
    opts = {
      notifier = { enabled = true },
      quickfile = { enabled = true },
      words = { enabled = true },
    },
  },

  {
    "lukas-reineke/indent-blankline.nvim",
    main = "ibl",
    config = function()
      require("plugins.ibl")
    end,
  },

  {
    "HiPhish/rainbow-delimiters.nvim",
    config = function()
      require("plugins.rainbow_delimiters")
    end,
  },

  {
    "xiyaowong/virtcolumn.nvim",
    config = function()
      require("plugins.virtcolumn")
    end,
  },

  ------------------------------------------------------------------------------
  -- Navigation / Files / Symbols
  ------------------------------------------------------------------------------

  {
    "nvim-neo-tree/neo-tree.nvim",
    branch = "v3.x",
    dependencies = {
      "nvim-lua/plenary.nvim",
      "MunifTanjim/nui.nvim",
      "nvim-tree/nvim-web-devicons", -- optional, but recommended
    },
    lazy = false, -- neo-tree will lazily load itself
  },

  {
    "stevearc/aerial.nvim",
    opts = {
      layout = {
        max_width = { 40, 0.3 },
        min_width = 20,
      },
      show_guides = true,
      filter_kind = false, -- show everything
      -- filter_kind = {
      --   "Class",
      --   "Constructor",
      --   "Enum",
      --   "Function",
      --   "Interface",
      --   "Module",
      --   "Method",
      --   "Struct",
      --   "Variable",
      --   "Field",
      --   "Property",
      --   "Constant",
      -- },
    },
    dependencies = {
      "nvim-treesitter/nvim-treesitter",
      "nvim-tree/nvim-web-devicons",
    },
  },

  { "mbbill/undotree" },

  ------------------------------------------------------------------------------
  -- Search / Picker
  ------------------------------------------------------------------------------

  {
    "nvim-telescope/telescope.nvim",
    dependencies = {
      "nvim-lua/plenary.nvim",
      "nvim-telescope/telescope-ui-select.nvim",
    },
    config = function()
      require("plugins._telescope")
    end,
  },

  { "nvim-telescope/telescope-fzf-native.nvim", build = "make" },

  ------------------------------------------------------------------------------
  -- LSP / Syntax / Formatting
  ------------------------------------------------------------------------------

  {
    "neovim/nvim-lspconfig",
    config = function()
      require("plugins.nvim_lspconfig")
    end,
  },

  {
    "nvim-treesitter/nvim-treesitter",
    lazy = false,
    build = ":TSUpdate",
    config = function()
      require("plugins.nvim_treesitter")
    end,
  },

  {
    "stevearc/conform.nvim",
    config = function()
      require("conform").setup({
        formatters_by_ft = {
          python = { "ruff_format" },
          -- python = { "black" },
          lua = { "stylua" },
        },
        -- formatters = {
        --   black = {
        --     prepend_args = {
        --       "--line-length", "88",
        --       "--preview",
        --       "--enable-unstable-feature=string_processing",
        --     },
        --   },
        -- },
      })
    end,
  },

  { "smjonas/inc-rename.nvim", config = true },

  ------------------------------------------------------------------------------
  -- Editing
  ------------------------------------------------------------------------------

  {
    "zbirenbaum/copilot.lua",
    cmd = "Copilot",
    event = "InsertEnter",
    config = function()
      require("plugins.copilot_config")
    end,
  },

  { "windwp/nvim-autopairs", event = "InsertEnter", config = true },

  { "kylechui/nvim-surround", config = true },

  { "junegunn/vim-easy-align" },

  {
    "houtsnip/vim-emacscommandline",
    config = function()
      require("plugins.vim_emacscommandline")
    end,
  },

  {
    "m4xshen/hardtime.nvim",
    enabled = false,
    dependencies = { "MunifTanjim/nui.nvim" },
    opts = {},
  },

  ------------------------------------------------------------------------------
  -- Git
  ------------------------------------------------------------------------------

  {
    "lewis6991/gitsigns.nvim",
    config = function()
      require("plugins.gitsigns")
    end,
  },

  { "tpope/vim-fugitive" },

  {
    "sindrets/diffview.nvim",
    opts = {},
    config = function()
      require("diffview").setup({
        hooks = {
          diff_buf_read = function()
            vim.cmd("norm! gg]ckzt") -- Set cursor on the first hunk
          end,
          diff_buf_win_enter = function()
            vim.opt_local.foldlevel = 99
          end,
        },
      })
    end,
  },

  --[[
  -- Left here for testing it
  {
    "kdheepak/lazygit.nvim",
    lazy = true,
    cmd = {
      "LazyGit",
      "LazyGitConfig",
      "LazyGitCurrentFile",
      "LazyGitFilter",
      "LazyGitFilterCurrentFile",
    },
    dependencies = {
      "nvim-lua/plenary.nvim",
    },
  },
  --]]

  --[[
  -- Left here for testing it
  {
    "NeogitOrg/neogit",
    dependencies = {
      "nvim-lua/plenary.nvim",         -- required
      "sindrets/diffview.nvim",        -- optional - Diff integration
      "nvim-telescope/telescope.nvim", -- optional
      -- "ibhagwan/fzf-lua",           -- optional
      -- "echasnovski/mini.pick",      -- optional
    },
  },
  --]]

  ------------------------------------------------------------------------------
  -- Markdown / LaTeX / Structured Text
  ------------------------------------------------------------------------------

  -- Run the :Mtm command to toggle markdown table mode.
  {
    "Kicamon/markdown-table-mode.nvim",
    config = function()
      require("markdown-table-mode").setup({
        filetype = {
          "*.md",
          "*.sql",
        },
        options = {
          insert = true, -- when typing "|"
          insert_leave = true, -- when leaving insert
          pad_separator_line = true, -- add space in separator line
          alig_style = "default", -- default, left, center, right
        },
      })
    end,
  },

  -- Install with yarn or npm.
  {
    "iamcco/markdown-preview.nvim",
    cmd = { "MarkdownPreviewToggle", "MarkdownPreview", "MarkdownPreviewStop" },
    build = "cd app && yarn install",
    init = function()
      vim.g.mkdp_filetypes = { "markdown" }
    end,
    ft = { "markdown" },
  },

  {
    "lervag/vimtex",
    config = function()
      require("plugins.vimtex")
    end,
  },

  {
    "cameron-wags/rainbow_csv.nvim",
    config = function()
      require("plugins.rainbow_csv")
    end,
  },

  ------------------------------------------------------------------------------
  -- Terminal / External Integration
  ------------------------------------------------------------------------------

  { "akinsho/toggleterm.nvim", version = "*", config = true },

  { "christoomey/vim-tmux-navigator" },

  { "tridactyl/vim-tridactyl" },

  -- { "wakatime/vim-wakatime" },
}
