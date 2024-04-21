vim.g.ctrlp_working_path_mode = "0"

if vim.fn.executable("ag") == 1 then
  -- Use The Silver Searcher https://github.com/ggreer/the_silver_searcher
  vim.opt.grepprg = "ag --nogroup --nocolor"

  -- Use ag in CtrlP for listing files. Lightning fast, respects .gitignore
  -- and .ignore. Ignores hidden files by default.
  vim.g.ctrlp_user_command = "ag --ignore-dir={.svn,venv,build,saved,__pycache__} %s -l --nocolor -f -g ''"
else
  -- If "ag" is not available, make CtrlP respect .gitignore (using git ls-files).
  vim.g.ctrlp_user_command = {".git", "cd %s && git ls-files . -co --exclude-standard", "find %s -type f"}
end
