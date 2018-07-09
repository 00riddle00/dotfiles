(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(ansi-color-faces-vector
   [default default default italic underline success warning error])
 '(ansi-color-names-vector
   ["black" "#d55e00" "#009e73" "#f8ec59" "#0072b2" "#cc79a7" "#56b4e9" "white"])
 '(custom-enabled-themes (quote (deeper-blue)))
 '(custom-unlispify-menu-entries nil)
 '(inhibit-startup-screen t)
 '(nil nil t)
 '(package-selected-packages (quote (linum-relative evil)))
 '(scroll-bar-mode -1)
 '(tool-bar-mode nil))
  (setq evil-want-C-u-scroll t )
  ;(setq linum-relative-current-symbol "")
  (require 'package)
  (add-to-list 'package-archives '("melpa" . "http://melpa.org/packages/"))
  (package-initialize)
  (require 'evil)
  ;(require 'linum-relative)
  (evil-mode 1)
  (setq package-archives
  '(("gnu" . "http://elpa.gnu.org/packages/")
  ("marmalade" . "http://marmalade-repo.org/packages/")
  ("melpa" . "http://melpa.milkbox.net/packages/")))
  (setq apropos-sort-by-scores t)
  (set-face-attribute 'default nil :height 80)
  
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
