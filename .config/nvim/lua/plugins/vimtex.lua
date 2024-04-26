-- Setting vimtex view method using a generic interface
vim.g.vimtex_view_general_viewer = "zathura"

-- Setting vimtex compiler engines
vim.g.vimtex_compiler_latexmk_engines = {
  ["_"] = "-xelatex",
}

-- Setting vimtex quickfix ignore filters
vim.g.vimtex_quickfix_ignore_filters = {
  "Underfull",
  "Overfull",
}
