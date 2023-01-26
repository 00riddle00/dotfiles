;; -------------------------------------------------------------
;; keybindings
;; -------------------------------------------------------------

;; move point (cursor) from window to window with Shift and arrow keys
(windmove-default-keybindings)

(global-set-key (kbd "C-h") 'delete-backward-char)

(global-set-key (kbd "C-z") 'evil-mode)

;; Enable the disabled commands in all future editing sessions.
;; These commands were disabled since they can sometimes be found confusing.
;;
;; Uppcase the region (C-x C-u).
(put 'upcase-region 'disabled nil)
;; Downcase the region (C-X C-l).
(put 'downcase-region 'disabled nil)

;; -------------------------------------------------------------
;; settings
;; -------------------------------------------------------------

;; Some functionality uses this to identify you, e.g. GPG configuration,
;; email clients, file templates and snippets. It is optional.
(setq user-full-name "Tomas Giedraitis"
      user-mail-address "tomasgiedraitis@gmail.com")

;; apropos commands try to guess the relevance of each result, and
;; display the most relevant ones first, instead of lex. ordering.
(setq apropos-sort-by-scores t)

;; font height
(set-face-attribute 'default nil :height 80)

;; Disable fringes
(set-fringe-mode 0)

;; Use line numbers
(global-display-line-numbers-mode)

;; Use relative line numbers
(setq display-line-numbers-type 'relative)

;; -------------------------------------------------------------
;; packages and their settings
;; -------------------------------------------------------------

(require 'package)
(setq package-archives '(("gnu" . "https://elpa.gnu.org/packages/")
                         ("melpa" . "https://melpa.org/packages/")))
(add-to-list 'package-archives '("org" . "http://orgmode.org/elpa/") t)
(package-initialize)

(require 'evil)
(evil-mode 1)
(setq evil-want-C-u-scroll t )

(require 'linum-relative)
(linum-relative-global-mode)

(require 'org)

(setq org-directory "~/Dropbox/gtd/org/")
(setq org-agenda-files '("~/Dropbox/gtd/org/agenda.org"))
; Use UTF-8 bullet chars (https://github.com/sabof/org-bullets)
(require 'org-bullets)
(add-hook 'org-mode-hook (lambda () (org-bullets-mode 1)))

(require 'undo-tree)
(global-undo-tree-mode)
;; either C-_ or C-/  (`undo-tree-undo')
;; C-?                (`undo-tree-redo')

;; -------------------------------------------------------------
(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(ansi-color-faces-vector
   [default default default italic underline success warning error])
 '(ansi-color-names-vector
   ["black" "#d55e00" "#009e73" "#f8ec59" "#0072b2" "#cc79a7" "#56b4e9" "white"])
 '(custom-enabled-themes '(atom-one-dark))
 '(custom-safe-themes
   '("171d1ae90e46978eb9c342be6658d937a83aaa45997b1d7af7657546cae5985b" default))
 '(custom-unlispify-menu-entries nil)
 '(inhibit-startup-screen t)
 '(menu-bar-mode nil)
 '(nil nil t)
 '(scroll-bar-mode nil)
 '(tool-bar-mode nil))
 '(package-selected-packages
   '(atom-one-dark-theme
      evil
      linum-relative
      org-bullets
      undo-tree))
;; -------------------------------------------------------------
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
;; -------------------------------------------------------------
