#------------------------------------------------------------------------------
# Author: 00riddle00 (Tomas Giedraitis)
# Date:   2024-07-30 16:11:21 EEST
# Path:   ~/.config/ranger/commands.py
# URL:    https://github.com/00riddle00/dotfiles
#------------------------------------------------------------------------------

from __future__ import (absolute_import, division, print_function)

# Any needed python module can be imported.
import os

# ranger.api.commands are always needed to be imported here to get the
# Command class:
from ranger.api.commands import Command
from ranger.core.loader import CommandLoader

# https://github.com/ranger/ranger/wiki/Integrating-File-Search-with-fzf
# Now, simply bind this function to a key, by adding this to
# ~/.config/ranger/rc.conf: map <C-f> fzf_select
class fzf_select(Command):
    """
    :fzf_select
    Find a file using fzf.
    With a prefix argument select only directories.
    See: https://github.com/junegunn/fzf
    """

    def execute(self):
        import subprocess

        if self.quantifier:
            # match only directories
            command = r"find -L . \( -path '*/\.*' -o -fstype 'dev' -o -fstype 'proc' \) -prune \
            -o -type d -print 2> /dev/null | sed 1d | cut -b3- | fzf +m"
        else:
            # match files and directories
            command = r"find -L . \( -path '*/\.*' -o -fstype 'dev' -o -fstype 'proc' \) -prune \
            -o -print 2> /dev/null | sed 1d | cut -b3- | fzf +m"
        fzf = self.fm.execute_command(command, stdout=subprocess.PIPE)
        stdout, stderr = fzf.communicate()
        if fzf.returncode == 0:
            fzf_file = os.path.abspath(stdout.decode("utf-8").rstrip("\n"))
            if os.path.isdir(fzf_file):
                self.fm.cd(fzf_file)
            else:
                self.fm.select_file(fzf_file)


class fzf_locate(Command):
    """
    :fzf_locate
    Find a file using fzf.
    With a prefix argument select only directories.
    See: https://github.com/junegunn/fzf
    """

    def execute(self):
        import subprocess

        if self.quantifier:
            command = "locate home media | fzf -e -i"
        else:
            command = "locate home media | fzf -e -i"
        fzf = self.fm.execute_command(command, stdout=subprocess.PIPE)
        stdout, stderr = fzf.communicate()
        if fzf.returncode == 0:
            fzf_file = os.path.abspath(stdout.decode("utf-8").rstrip("\n"))
            if os.path.isdir(fzf_file):
                self.fm.cd(fzf_file)
            else:
                self.fm.select_file(fzf_file)


class fzf_bring(Command):
    """
    :fzf_bring
    Find a file using fzf and bring it to the current directory.
    See: https://github.com/junegunn/fzf
    """

    def execute(self):
        import shutil
        import subprocess

        if self.quantifier:
            # match only directories
            command = r"find -L . \( -path '*/\.*' -o -fstype 'dev' -o -fstype 'proc' \) -prune \
            -o -type d -print 2> /dev/null | sed 1d | cut -b3- | fzf +m"
        else:
            # match files and directories
            command = r"find -L . \( -path '*/\.*' -o -fstype 'dev' -o -fstype 'proc' \) -prune \
            -o -print 2> /dev/null | sed 1d | cut -b3- | fzf +m"
        fzf = self.fm.execute_command(command, stdout=subprocess.PIPE)
        stdout, stderr = fzf.communicate()
        if fzf.returncode == 0:
            fzf_file = os.path.abspath(stdout.decode("utf-8").rstrip("\n"))
            shutil.move(fzf_file, self.fm.thisdir.path)


class compress(Command):
    def execute(self):
        """Compress marked files to current directory"""
        cwd = self.fm.thisdir
        marked_files = cwd.get_selection()

        if not marked_files:
            return

        def refresh(_):
            cwd = self.fm.get_directory(original_path)
            cwd.load_content()

        original_path = cwd.path
        parts = self.line.split()
        au_flags = parts[1:]

        descr = "compressing files in: " + os.path.basename(parts[1])
        obj = CommandLoader(
            args=["apack"]
            + au_flags
            + [os.path.relpath(f.path, cwd.path) for f in marked_files],
            descr=descr,
        )

        obj.signal_bind("after", refresh)
        self.fm.loader.add(obj)

    def tab(self):
        """Complete with current folder name"""

        extension = [".zip", ".tar.gz", ".rar", ".7z"]
        return [
            "compress " + os.path.basename(self.fm.thisdir.path) + ext
            for ext in extension
        ]


class extracthere(Command):
    def execute(self):
        """Extract copied files to current directory"""
        copied_files = tuple(self.fm.copy_buffer)

        if not copied_files:
            return

        def refresh(_):
            cwd = self.fm.get_directory(original_path)
            cwd.load_content()

        one_file = copied_files[0]
        cwd = self.fm.thisdir
        original_path = cwd.path
        au_flags = ["-X", cwd.path]
        au_flags += self.line.split()[1:]
        au_flags += ["-e"]

        self.fm.copy_buffer.clear()
        self.fm.cut_buffer = False
        if len(copied_files) == 1:
            descr = "extracting: " + os.path.basename(one_file.path)
        else:
            descr = "extracting files from: " + os.path.basename(one_file.dirname)
        obj = CommandLoader(
            args=["aunpack"] + au_flags + [f.path for f in copied_files], descr=descr
        )

        obj.signal_bind("after", refresh)
        self.fm.loader.add(obj)


class trash(Command):
    """:trash

    Lists the trash directory ~/.Trash
    """

    def execute(self):
        self.fm.execute_console(
            "shell -w echo \
                                '------------------------------------'  \
                                && gio list trash:// && echo  \
                                '------------------------------------'"
        )


class h(Command):
    """:h

    show help
    """

    def execute(self):
        self.fm.execute_console("help")
