-- vim: set ft=lua tw=79 nu ai et ts=2 sw=2:
-------------------------------------------------------------------------------
-- Author: 00riddle00 (Tomas Giedraitis)
-- Date:   2026-08-23 19:46:21 EEST
-- Path:   ~/.config/yazi/init.lua
-- URL:    https://github.com/00riddle00/dotfiles
-------------------------------------------------------------------------------

function Linemode:size_and_mtime()
  local timestamp = math.floor(self._file.cha.mtime or 0)
  local time

  if timestamp == 0 then
    time = ""
  elseif os.date("%Y", timestamp) == os.date("%Y") then
    time = os.date("%b %d %H:%M", timestamp)
  else
    time = os.date("%b %d  %Y", timestamp)
  end

  local size = self._file:size()

  return string.format("%s %s", size and ya.readable_size(size) or "-", time)
end
