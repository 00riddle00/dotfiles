# kudos to Jason Ryan (https://jasonwryan.com)

## This is here so configs done via the GUI are still loaded.
## Remove it to not load settings done via the GUI.
config.load_autoconfig(False)

# general settings
c.url.default_page = 'file:///home/riddle/.local/share/dotshare/qutebrowser-homepage/index.html'
c.url.start_pages = 'file:///home/riddle/.local/share/dotshare/qutebrowser-homepage/index.html'
c.editor.command = ["urxvt", "-name", "dropdown_vim", "-e", "vim", "-f", "{}"]
c.new_instance_open_target = "tab-bg"
c.prompt.filebrowser = False
c.completion.height = "30%"
c.completion.web_history.max_items = 1000
c.input.partial_timeout = 2000
c.tabs.show = 'multiple'
c.tabs.background = True
c.tabs.favicons.show = "never"
c.tabs.title.format = "{audio}{current_title}"
c.tabs.new_position.related = "last"
c.downloads.location.directory = '/home/riddle/Downloads'
c.content.geolocation = False
c.content.cache.size = 52428800
c.content.webgl = False
c.content.notifications.enabled = False
c.hints.border = "1px solid #CCCCCC"
c.hints.mode = "number"
c.hints.chars = "123456789"
c.hints.min_chars = 1
c.keyhint.blacklist = ["*"]
## c.statusbar.hide = True

# searches
c.url.searchengines['d'] = 'https://duckduckgo.com/?q={}'
c.url.searchengines['qw'] = 'https://www.qwant.com/?q={}'
c.url.searchengines['g'] = 'https://www.google.com/search?hl=en&q={}'
c.url.searchengines['w'] = 'https://en.wikipedia.org/?search={}'
c.url.searchengines['yt'] = 'https://youtube.com/results?search_query={}'
c.url.searchengines['gh'] = 'https://github.com/search?q={}&type=Code'
c.url.searchengines['rd'] = 'https://reddit.com/r/{}'
c.url.searchengines['aw'] = 'https://wiki.archlinux.org/?search={}'
c.url.searchengines['ap'] = 'https://www.archlinux.org/packages/?sort=&q={}'
c.url.searchengines['DEFAULT'] = c.url.searchengines['d']

# aliases
c.aliases['gh'] = 'open -t https://github.com/00riddle00'
c.aliases['gl'] = 'open -t https://gitlab.com/00riddle00'

# colors
c.colors.completion.fg = "#899CA1"
c.colors.completion.category.fg = "#F2F2F2"
c.colors.completion.category.bg = "#555555"
c.colors.completion.item.selected.fg = "white"
c.colors.completion.item.selected.match.fg = "#0080FF"
c.colors.completion.item.selected.bg = "#333333"
c.colors.completion.item.selected.border.top = "#333333"
c.colors.completion.item.selected.border.bottom = "#333333"
c.colors.completion.match.fg = "#66FFFF"
c.colors.statusbar.normal.fg = "#899CA1"
c.colors.statusbar.normal.bg = "#222222"
c.colors.statusbar.insert.fg = "#899CA1"
c.colors.statusbar.insert.bg = "#222222"
c.colors.statusbar.command.bg = "#555555"
c.colors.statusbar.command.fg = "#F0F0F0"
c.colors.statusbar.caret.bg = "#5E468C"
c.colors.statusbar.caret.selection.fg = "white"
c.colors.statusbar.progress.bg = "#333333"
c.colors.statusbar.passthrough.bg = "#4779B3"
c.colors.statusbar.url.fg = c.colors.statusbar.normal.fg
c.colors.statusbar.url.success.http.fg = "#899CA1"
c.colors.statusbar.url.success.https.fg = "#53A6A6"
c.colors.statusbar.url.error.fg = "#8A2F58"
c.colors.statusbar.url.warn.fg = "#914E89"
c.colors.statusbar.url.hover.fg = "#2B7694"
c.colors.tabs.bar.bg = "#222222"
c.colors.tabs.even.fg = "#899CA1"
c.colors.tabs.even.bg = "#222222"
c.colors.tabs.odd.fg = "#899CA1"
c.colors.tabs.odd.bg = "#222222"
c.colors.tabs.selected.even.fg = "white"
c.colors.tabs.selected.even.bg = "#222222"
c.colors.tabs.selected.odd.fg = "white"
c.colors.tabs.selected.odd.bg = "#222222"
c.colors.tabs.indicator.start = "#222222"
c.colors.tabs.indicator.stop = "#222222"
c.colors.tabs.indicator.error = "#8A2F58"
c.colors.hints.bg = "#CCCCCC"
c.colors.hints.match.fg = "#000"
c.colors.downloads.start.fg = "black"
c.colors.downloads.start.bg = "#BFBFBF"
c.colors.downloads.stop.fg = "black"
c.colors.downloads.stop.bg = "#F0F0F0"
c.colors.keyhint.fg = "#FFFFFF"
c.colors.keyhint.suffix.fg = "#FFFF00"
c.colors.keyhint.bg = "rgba(0, 0, 0, 80%)"
c.colors.messages.error.bg = "#8A2F58"
c.colors.messages.error.border = "#8A2F58"
c.colors.messages.warning.bg = "#BF85CC"
c.colors.messages.warning.border = c.colors.messages.warning.bg
c.colors.messages.info.bg = "#333333"
c.colors.prompts.fg = "#333333"
c.colors.prompts.bg = "#DDDDDD"
c.colors.prompts.selected.bg = "#4779B3"

# fonts
## c.fonts.tabs = "9pt Noto Sans Mono"
c.fonts.statusbar = "9pt Noto Sans Mono"
c.fonts.downloads = c.fonts.statusbar
c.fonts.prompts = c.fonts.statusbar
c.fonts.hints = "13px Noto Sans Mono"
c.fonts.messages.info = "8pt Noto Sans Mono"
c.fonts.keyhint = c.fonts.messages.info
c.fonts.messages.warning = c.fonts.messages.info
c.fonts.messages.error = c.fonts.messages.info
c.fonts.completion.entry = c.fonts.statusbar
c.fonts.completion.category = c.fonts.statusbar

# keybinds
config.unbind('b', mode='normal')
config.unbind('m', mode='normal')
config.unbind('D', mode='normal')
config.unbind('<Ctrl-B>', mode='normal')
config.bind('d', 'scroll-page 0 0.5')
config.bind('u', 'scroll-page 0 -0.5')
config.bind('j', 'scroll down ;; scroll down')
config.bind('k', 'scroll up ;; scroll up')
config.bind('<Ctrl-r>', 'restart', mode='normal')
config.bind('<Ctrl-q>', ':tab-prev', mode='normal')
config.bind('<Ctrl-w>', ':tab-next', mode='normal')
config.bind('<Ctrl-e>', ':tab-close', mode='normal')
config.bind('x', ':tab-close', mode='normal')
config.bind('X', 'undo')
config.bind('>', 'tab-move +', mode='normal')
config.bind('<', 'tab-move -', mode='normal')
config.bind('b', 'back', mode='normal')
config.bind('m', 'forward', mode='normal')
config.bind('t', 'set-cmd-text -s :open -t', mode='normal')
config.bind('W', ':tab-give', mode='normal')
config.bind('<Ctrl-m>', 'set-cmd-text -s :quickmark-save', mode='normal')
config.bind('<Shift-m>', 'set-cmd-text -s :quickmark-save', mode='normal')
config.bind('<Escape>', 'leave-mode', mode='passthrough')
config.bind('gi', 'enter-mode insert ;; jseval --quiet var inputs = document.getElementsByTagName("input"); for(var i = 0; i < inputs.length; i++) { var hidden = false; for(var j = 0; j < inputs[i].attributes.length; j++) { hidden = hidden || inputs[i].attributes[j].value.includes("hidden"); }; if(!hidden) { inputs[i].focus(); break; } }')
config.bind('sd', 'set -p -t -u {url} content.javascript.enabled false')
config.bind('se', 'set -p -t -u {url} content.javascript.enabled true')
config.bind(';m', 'hint links spawn mpv {hint-url}')
config.bind('e', ':open-editor')
config.bind('xb', ':config-cycle statusbar.hide')

# shortcut keybinds
config.bind(',mp', ':open https://maps.google.com')
config.bind(',rd', ':open https://reddit.com')
config.bind(',yt', ':open https://youtube.com')
