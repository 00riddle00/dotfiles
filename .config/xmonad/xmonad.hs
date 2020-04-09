--  __  __                                _ 
--  \ \/ /_ __ ___   ___  _ __   __ _  __| |
--   \  /| '_ ` _ \ / _ \| '_ \ / _` |/ _` |
--   /  \| | | | | | (_) | | | | (_| | (_| |
--  /_/\_\_| |_| |_|\___/|_| |_|\__,_|\__,_|
--  
--riddle00
--https://www.github.com/00riddle00/
                                        
------------------------------------------------------------------------
---IMPORTS
------------------------------------------------------------------------
    -- Base
import XMonad
import XMonad.Config.Desktop
import System.Exit (exitSuccess)

    -- Utilities
import XMonad.Util.EZConfig(additionalKeysP)

    -- Actions
import XMonad.Actions.CopyWindow (kill1)

------------------------------------------------------------------------
---CONFIG
------------------------------------------------------------------------
myModMask       = mod4Mask  
myTerminal      = "urxvt"
myBorderWidth   = 2
myColorArchBlue = "#1793d1"
myColorBarBg    = "#002b36"

main = do
  xmonad $ defaultConfig
    { terminal    = myTerminal
    , modMask     = myModMask
    , borderWidth = myBorderWidth
    , normalBorderColor  = myColorBarBg
    , focusedBorderColor = myColorArchBlue
    } `additionalKeysP`         myKeys 

------------------------------------------------------------------------
---KEYBINDINGS
------------------------------------------------------------------------

myKeys =
    -- Xmonad
        [ ("M-<F11>", spawn "xmonad --recompile")      -- Recompiles xmonad
        , ("M-<F12>", spawn "xmonad --restart")        -- Restarts xmonad
        , ("M-S-q", io exitSuccess)                    -- Quits xmonad

    -- Windows
        , ("M1-<Escape>", kill1)                           -- Kill the currently focused client

    -- Open Terminal
        , ("M-<Return>", spawn myTerminal)

    --- Dmenu Scripts 
        , ("<Insert>", spawn "dmenu_run -p 'run:'")

    --- My Applications 
        , ("<F9>", spawn "brave")
        , ("M-i", spawn (myTerminal ++ " -e htop"))
        ]
