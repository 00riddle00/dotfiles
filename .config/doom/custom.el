;#------------------------------------------------------------------------------
;# Author: 00riddle00 (Tomas Giedraitis)
;# Date:   2024-04-06 01:33:04 EEST
;# Path:   ~/.config/doom/custom.el
;# URL:    https://github.com/00riddle00/dotfiles
;#------------------------------------------------------------------------------

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(custom-safe-themes
   '("02f57ef0a20b7f61adce51445b68b2a7e832648ce2e7efb19d217b6454c1b644" "0c860c4fe9df8cff6484c54d2ae263f19d935e4ff57019999edbda9c7eda50b8" default)))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 ;;
 ;; Make the current horizontal line (on which the cursor currently is) invisible.
 '(hl-line ((t (face-attribute 'default :background)))))

;; Enable the disabled commands in all future editing sessions.
;; These commands were disabled since they can sometimes be found confusing.
;;
;; Uppcase the region (C-x C-u).
(put 'upcase-region 'disabled nil)
;; Downcase the region (C-X C-l).
(put 'downcase-region 'disabled nil)
