;;; $DOOMDIR/config.el -*- lexical-binding: t; -*-
;------------------------------------------------------------------------------
; Author: 00riddle00 (Tomas Giedraitis)
; Date:   2024-07-16 15:40:55 EEST
; Path:   ~/.config/doom/config.el
; URL:    https://github.com/00riddle00/dotfiles
;------------------------------------------------------------------------------

;; Place your private configuration here! Remember, you do not need to run 'doom
;; sync' after modifying this file!


;; Some functionality uses this to identify you, e.g. GPG configuration, email
;; clients, file templates and snippets. It is optional.
(setq user-full-name "Tomas Giedraitis"
      user-mail-address "tomasgiedraitis@gmail.com")

;; Doom exposes five (optional) variables for controlling fonts in Doom:
;;
;; - `doom-font' -- the primary font to use
;; - `doom-variable-pitch-font' -- a non-monospace font (where applicable)
;; - `doom-big-font' -- used for `doom-big-font-mode'; use this for
;;   presentations or streaming.
;; - `doom-unicode-font' -- for unicode glyphs
;; - `doom-serif-font' -- for the `fixed-pitch-serif' face
;;
;; See 'C-h v doom-font' for documentation and more examples of what they
;; accept. For example:
;;
;;(setq doom-font (font-spec :family "Fira Code" :size 12 :weight 'semi-light)
;;      doom-variable-pitch-font (font-spec :family "Fira Sans" :size 13))
;;
;; If you or Emacs can't find your font, use 'M-x describe-font' to look them
;; up, `M-x eval-region' to execute elisp code, and 'M-x doom/reload-font' to
;; refresh your font settings. If Emacs still can't find your font, it likely
;; wasn't installed correctly. Font issues are rarely Doom issues!

;; There are two ways to load a theme. Both assume the theme is installed and
;; available. You can either set `doom-theme' or manually load a theme with the
;; `load-theme' function.
;; The default theme:
;;(setq doom-theme 'doom-one)
;; Custom:
(setq doom-theme 'atom-one-dark)

;; This determines the style of line numbers in effect. If set to `nil', line
;; numbers are disabled. For relative line numbers, set this to `relative'.
(setq display-line-numbers-type 'relative)


;; Whenever you reconfigure a package, make sure to wrap your config in an
;; `after!' block, otherwise Doom's defaults may override your settings. E.g.
;;
;;   (after! PACKAGE
;;     (setq x y))
;;
;; The exceptions to this rule:
;;
;;   - Setting file/directory variables (like `org-directory')
;;   - Setting variables which explicitly tell you to set them before their
;;     package is loaded (see 'C-h v VARIABLE' to look up their documentation).
;;   - Setting doom variables (which start with 'doom-' or '+').
;;
;; Here are some additional functions/macros that will help you configure Doom.
;;
;; - `load!' for loading external *.el files relative to this one
;; - `use-package!' for configuring packages
;; - `after!' for running code after a package has loaded
;; - `add-load-path!' for adding directories to the `load-path', relative to
;;   this file. Emacs searches the `load-path' when you load packages with
;;   `require' or `use-package'.
;; - `map!' for binding new keys
;;
;; To get information about any of these functions/macros, move the cursor over
;; the highlighted symbol at press 'K' (non-evil users must press 'C-c c k').
;; This will open documentation for it, including demos of how they are used.
;; Alternatively, use `C-h o' to look up a symbol (functions, variables, faces,
;; etc).
;;
;; You can also try 'gd' (or 'C-c c d') to jump to their definition and see how
;; they are implemented.

(after! org
  (setq org-directory      "$NOTES/org/")
  (setq org-agenda-files '("$NOTES/org/agenda.org"))
  ; Use UTF-8 bullet chars (https://github.com/sabof/org-bullets)
  (require 'org-bullets)
  (add-hook 'org-mode-hook (lambda () (org-bullets-mode 1)))
)

(global-set-key (kbd "C-s")   'save-buffer)
(global-set-key (kbd "C-S-s") 'save-buffer)

(require 'openwith)
(openwith-mode t)
(setq openwith-associations '(("\\.mp4\\'" "mpv" (file))))

(map!
 ( :after evil
   :en    "C-h" #'evil-window-left
   :en    "C-j" #'evil-window-down
   :en    "C-k" #'evil-window-up
   :en    "C-l" #'evil-window-right)
 )

(map! :after evil-org
      :map   evil-org-mode-map
      :n     "C-j" #'evil-window-down
      :n     "C-k" #'evil-window-up)

(map! :map general-override-mode-map
      :n   "C-j" #'evil-window-down
      :n   "C-k" #'evil-window-up)
