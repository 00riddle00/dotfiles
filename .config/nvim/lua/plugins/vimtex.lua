-- Setting vimtex view method
vim.g.vimtex_view_method = "zathura"

-- Setting vimtex compiler engines
vim.g.vimtex_compiler_latexmk_engines = {
  ["_"] = "-xelatex",
}

-- Setting vimtex quickfix ignore filters
vim.g.vimtex_quickfix_ignore_filters = {
  "Underfull",
  "Overfull",
}
