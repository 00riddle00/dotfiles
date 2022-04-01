;; -------------------------------------------------------------
;; keybindings
;; -------------------------------------------------------------

;; move point from window to window with Shift and arrow keys
(windmove-default-keybindings)

;; map C-h to backspace
(define-key key-translation-map [?\C-h] [?\C-?])

;; -------------------------------------------------------------
;; settings
;; -------------------------------------------------------------

;; apropos commands try to guess the relevance of each result, and 
;; display the most relevant ones first, instead of lex. ordering.
(setq apropos-sort-by-scores t)

;; font height
(set-face-attribute 'default nil :height 80)

;; M-x display-line-numbers-mode to toggle
(global-display-line-numbers-mode) 

;; -------------------------------------------------------------
;; packages and their settings
;; -------------------------------------------------------------

(require 'package)
(setq package-archives '(("gnu" . "https://elpa.gnu.org/packages/")
                         ("melpa" . "https://melpa.org/packages/")))
(add-to-list 'package-archives '("org" . "http://orgmode.org/elpa/") t)
(package-initialize)

(require 'evil)
(evil-mode 0)
(global-set-key (kbd "C-z") 'evil-local-mode)
(setq evil-want-C-u-scroll t )

;; M-x linum-relative-mode to toggle
(require 'linum-relative)

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
 '(custom-enabled-themes '(deeper-blue))
 '(custom-unlispify-menu-entries nil)
 '(inhibit-startup-screen t)
 '(menu-bar-mode nil)
 '(nil nil t)
 '(package-selected-packages '(undo-tree linum-relative evil))
 '(scroll-bar-mode nil)
 '(tool-bar-mode nil))

;; -------------------------------------------------------------
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
;; ----------------------------------------------------
(put 'upcase-region 'disabled nil)
(put 'downcase-region 'disabled nil)
