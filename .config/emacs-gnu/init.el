;------------------------------------------------------------------------------
; Author: 00riddle00 (Tomas Giedraitis)
; Date:   2024-04-07 02:10:25 EEST
; Path:   ~/.config/emacs.gnu/init.el
; URL:    https://github.com/00riddle00/dotfiles
;------------------------------------------------------------------------------

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

; Needs to appear before (require 'evil)
(setq evil-want-C-u-scroll t )
;
(require 'evil)
(setq evil-toggle-key "C-z")
(evil-mode 0)
(define-key evil-normal-state-map (kbd "C-s") 'evil-write)
(define-key evil-normal-state-map (kbd "C-S-s") 'evil-save)
(define-key evil-normal-state-map (kbd "C-h") 'evil-window-left)
(define-key evil-normal-state-map (kbd "C-j") 'evil-window-down)
(define-key evil-normal-state-map (kbd "C-k") 'evil-window-up)
(define-key evil-normal-state-map (kbd "C-l") 'evil-window-right)

(require 'org)
(setq org-directory "~/Dropbox/gtd/org/")
(setq org-agenda-files '("~/Dropbox/gtd/org/agenda.org"))
; Use UTF-8 bullet chars (https://github.com/sabof/org-bullets)
(require 'org-bullets)
(add-hook 'org-mode-hook (lambda () (org-bullets-mode 1)))

(require 'evil-org)
(add-hook 'org-mode-hook 'evil-org-mode)
(evil-org-set-key-theme '(textobjects insert navigation additional shift todo heading))
(require 'evil-org-agenda)
(evil-org-agenda-set-keys)

(require 'undo-tree)
(global-undo-tree-mode)
;; either C-_ or C-/  (`undo-tree-undo')
;; C-?                (`undo-tree-redo')

(require 'openwith)
(openwith-mode t)
(setq openwith-associations '(("\\.mp4\\'" "mpv" (file))))

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
 '(custom-enabled-themes '(deeper-blue))
 '(custom-unlispify-menu-entries nil)
 '(inhibit-startup-screen t)
 '(menu-bar-mode nil)
 '(nil nil t)
  '(package-selected-packages
    '(
       atom-one-dark-theme
       evil
       openwith
       org
       evil-org
       org-bullets
       undo-tree
     ))
 '(scroll-bar-mode nil)
 '(tool-bar-mode nil))
;; -------------------------------------------------------------
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
;; -------------------------------------------------------------
