(function() {
  var helpers, settings;

  helpers = require('./spec-helper');

  settings = require('../lib/settings');

  describe("Operators", function() {
    var editor, editorElement, keydown, normalModeInputKeydown, ref, vimState;
    ref = [], editor = ref[0], editorElement = ref[1], vimState = ref[2];
    beforeEach(function() {
      var vimMode;
      vimMode = atom.packages.loadPackage('vim-mode');
      vimMode.activateResources();
      return helpers.getEditorElement(function(element) {
        editorElement = element;
        editor = editorElement.getModel();
        vimState = editorElement.vimState;
        vimState.activateNormalMode();
        return vimState.resetNormalMode();
      });
    });
    keydown = function(key, options) {
      if (options == null) {
        options = {};
      }
      if (options.element == null) {
        options.element = editorElement;
      }
      return helpers.keydown(key, options);
    };
    normalModeInputKeydown = function(key, opts) {
      if (opts == null) {
        opts = {};
      }
      return editor.normalModeInputView.editorElement.getModel().setText(key);
    };
    describe("cancelling operations", function() {
      it("throws an error when no operation is pending", function() {
        return expect(function() {
          return vimState.pushOperations(new Input(''));
        }).toThrow();
      });
      return it("cancels and cleans up properly", function() {
        keydown('/');
        expect(vimState.isOperatorPending()).toBe(true);
        editor.normalModeInputView.viewModel.cancel();
        expect(vimState.isOperatorPending()).toBe(false);
        return expect(editor.normalModeInputView).toBe(void 0);
      });
    });
    describe("the x keybinding", function() {
      describe("on a line with content", function() {
        describe("without vim-mode.wrapLeftRightMotion", function() {
          beforeEach(function() {
            editor.setText("abc\n012345\n\nxyz");
            return editor.setCursorScreenPosition([1, 4]);
          });
          it("deletes a character", function() {
            keydown('x');
            expect(editor.getText()).toBe('abc\n01235\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
            expect(vimState.getRegister('"').text).toBe('4');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
            expect(vimState.getRegister('"').text).toBe('5');
            keydown('x');
            expect(editor.getText()).toBe('abc\n012\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
            expect(vimState.getRegister('"').text).toBe('3');
            keydown('x');
            expect(editor.getText()).toBe('abc\n01\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
            expect(vimState.getRegister('"').text).toBe('2');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
            expect(vimState.getRegister('"').text).toBe('1');
            keydown('x');
            expect(editor.getText()).toBe('abc\n\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
            return expect(vimState.getRegister('"').text).toBe('0');
          });
          return it("deletes multiple characters with a count", function() {
            keydown('2');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
            expect(vimState.getRegister('"').text).toBe('45');
            editor.setCursorScreenPosition([0, 1]);
            keydown('3');
            keydown('x');
            expect(editor.getText()).toBe('a\n0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
            return expect(vimState.getRegister('"').text).toBe('bc');
          });
        });
        describe("with multiple cursors", function() {
          beforeEach(function() {
            editor.setText("abc\n012345\n\nxyz");
            editor.setCursorScreenPosition([1, 4]);
            return editor.addCursorAtBufferPosition([0, 1]);
          });
          return it("is undone as one operation", function() {
            keydown('x');
            expect(editor.getText()).toBe("ac\n01235\n\nxyz");
            keydown('u');
            return expect(editor.getText()).toBe("abc\n012345\n\nxyz");
          });
        });
        return describe("with vim-mode.wrapLeftRightMotion", function() {
          beforeEach(function() {
            editor.setText("abc\n012345\n\nxyz");
            editor.setCursorScreenPosition([1, 4]);
            return atom.config.set('vim-mode.wrapLeftRightMotion', true);
          });
          it("deletes a character", function() {
            keydown('x');
            expect(editor.getText()).toBe('abc\n01235\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
            expect(vimState.getRegister('"').text).toBe('4');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
            expect(vimState.getRegister('"').text).toBe('5');
            keydown('x');
            expect(editor.getText()).toBe('abc\n012\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
            expect(vimState.getRegister('"').text).toBe('3');
            keydown('x');
            expect(editor.getText()).toBe('abc\n01\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
            expect(vimState.getRegister('"').text).toBe('2');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
            expect(vimState.getRegister('"').text).toBe('1');
            keydown('x');
            expect(editor.getText()).toBe('abc\n\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
            return expect(vimState.getRegister('"').text).toBe('0');
          });
          return it("deletes multiple characters and newlines with a count", function() {
            atom.config.set('vim-mode.wrapLeftRightMotion', true);
            keydown('2');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
            expect(vimState.getRegister('"').text).toBe('45');
            editor.setCursorScreenPosition([0, 1]);
            keydown('3');
            keydown('x');
            expect(editor.getText()).toBe('a0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
            expect(vimState.getRegister('"').text).toBe('bc\n');
            keydown('7');
            keydown('x');
            expect(editor.getText()).toBe('ayz');
            expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
            return expect(vimState.getRegister('"').text).toBe('0123\n\nx');
          });
        });
      });
      return describe("on an empty line", function() {
        beforeEach(function() {
          editor.setText("abc\n012345\n\nxyz");
          return editor.setCursorScreenPosition([2, 0]);
        });
        it("deletes nothing on an empty line when vim-mode.wrapLeftRightMotion is false", function() {
          atom.config.set('vim-mode.wrapLeftRightMotion', false);
          keydown('x');
          expect(editor.getText()).toBe("abc\n012345\n\nxyz");
          return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        });
        return it("deletes an empty line when vim-mode.wrapLeftRightMotion is true", function() {
          atom.config.set('vim-mode.wrapLeftRightMotion', true);
          keydown('x');
          expect(editor.getText()).toBe("abc\n012345\nxyz");
          return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        });
      });
    });
    describe("the X keybinding", function() {
      describe("on a line with content", function() {
        beforeEach(function() {
          editor.setText("ab\n012345");
          return editor.setCursorScreenPosition([1, 2]);
        });
        return it("deletes a character", function() {
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe('ab\n02345');
          expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          expect(vimState.getRegister('"').text).toBe('1');
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe('ab\n2345');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          expect(vimState.getRegister('"').text).toBe('0');
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe('ab\n2345');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          expect(vimState.getRegister('"').text).toBe('0');
          atom.config.set('vim-mode.wrapLeftRightMotion', true);
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe('ab2345');
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          return expect(vimState.getRegister('"').text).toBe('\n');
        });
      });
      return describe("on an empty line", function() {
        beforeEach(function() {
          editor.setText("012345\n\nabcdef");
          return editor.setCursorScreenPosition([1, 0]);
        });
        it("deletes nothing when vim-mode.wrapLeftRightMotion is false", function() {
          atom.config.set('vim-mode.wrapLeftRightMotion', false);
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe("012345\n\nabcdef");
          return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
        });
        return it("deletes the newline when wrapLeftRightMotion is true", function() {
          atom.config.set('vim-mode.wrapLeftRightMotion', true);
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe("012345\nabcdef");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        });
      });
    });
    describe("the s keybinding", function() {
      beforeEach(function() {
        editor.setText('012345');
        return editor.setCursorScreenPosition([0, 1]);
      });
      it("deletes the character to the right and enters insert mode", function() {
        keydown('s');
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        expect(editor.getText()).toBe('02345');
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        return expect(vimState.getRegister('"').text).toBe('1');
      });
      it("is repeatable", function() {
        editor.setCursorScreenPosition([0, 0]);
        keydown('3');
        keydown('s');
        editor.insertText("ab");
        keydown('escape');
        expect(editor.getText()).toBe('ab345');
        editor.setCursorScreenPosition([0, 2]);
        keydown('.');
        return expect(editor.getText()).toBe('abab');
      });
      it("is undoable", function() {
        editor.setCursorScreenPosition([0, 0]);
        keydown('3');
        keydown('s');
        editor.insertText("ab");
        keydown('escape');
        expect(editor.getText()).toBe('ab345');
        keydown('u');
        expect(editor.getText()).toBe('012345');
        return expect(editor.getSelectedText()).toBe('');
      });
      return describe("in visual mode", function() {
        beforeEach(function() {
          keydown('v');
          editor.selectRight();
          return keydown('s');
        });
        return it("deletes the selected characters and enters insert mode", function() {
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          expect(editor.getText()).toBe('0345');
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          return expect(vimState.getRegister('"').text).toBe('12');
        });
      });
    });
    describe("the S keybinding", function() {
      beforeEach(function() {
        editor.setText("12345\nabcde\nABCDE");
        return editor.setCursorScreenPosition([1, 3]);
      });
      it("deletes the entire line and enters insert mode", function() {
        keydown('S', {
          shift: true
        });
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        expect(editor.getText()).toBe("12345\n\nABCDE");
        expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
        expect(vimState.getRegister('"').text).toBe("abcde\n");
        return expect(vimState.getRegister('"').type).toBe('linewise');
      });
      it("is repeatable", function() {
        keydown('S', {
          shift: true
        });
        editor.insertText("abc");
        keydown('escape');
        expect(editor.getText()).toBe("12345\nabc\nABCDE");
        editor.setCursorScreenPosition([2, 3]);
        keydown('.');
        return expect(editor.getText()).toBe("12345\nabc\nabc\n");
      });
      it("is undoable", function() {
        keydown('S', {
          shift: true
        });
        editor.insertText("abc");
        keydown('escape');
        expect(editor.getText()).toBe("12345\nabc\nABCDE");
        keydown('u');
        expect(editor.getText()).toBe("12345\nabcde\nABCDE");
        return expect(editor.getSelectedText()).toBe('');
      });
      it("works when the cursor's goal column is greater than its current column", function() {
        editor.setText("\n12345");
        editor.setCursorBufferPosition([1, 2e308]);
        editor.moveUp();
        keydown("S", {
          shift: true
        });
        return expect(editor.getText()).toBe("\n12345");
      });
      return xit("respects indentation", function() {});
    });
    describe("the d keybinding", function() {
      it("enters operator-pending mode", function() {
        keydown('d');
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(true);
        return expect(editorElement.classList.contains('normal-mode')).toBe(false);
      });
      describe("when followed by a d", function() {
        it("deletes the current line and exits operator-pending mode", function() {
          editor.setText("12345\nabcde\n\nABCDE");
          editor.setCursorScreenPosition([1, 1]);
          keydown('d');
          keydown('d');
          expect(editor.getText()).toBe("12345\n\nABCDE");
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          expect(vimState.getRegister('"').text).toBe("abcde\n");
          expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
          return expect(editorElement.classList.contains('normal-mode')).toBe(true);
        });
        it("deletes the last line", function() {
          editor.setText("12345\nabcde\nABCDE");
          editor.setCursorScreenPosition([2, 1]);
          keydown('d');
          keydown('d');
          expect(editor.getText()).toBe("12345\nabcde\n");
          return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        });
        return it("leaves the cursor on the first nonblank character", function() {
          editor.setText("12345\n  abcde\n");
          editor.setCursorScreenPosition([0, 4]);
          keydown('d');
          keydown('d');
          expect(editor.getText()).toBe("  abcde\n");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
      });
      describe("undo behavior", function() {
        beforeEach(function() {
          editor.setText("12345\nabcde\nABCDE\nQWERT");
          return editor.setCursorScreenPosition([1, 1]);
        });
        it("undoes both lines", function() {
          keydown('d');
          keydown('2');
          keydown('d');
          keydown('u');
          expect(editor.getText()).toBe("12345\nabcde\nABCDE\nQWERT");
          return expect(editor.getSelectedText()).toBe('');
        });
        return describe("with multiple cursors", function() {
          beforeEach(function() {
            editor.setCursorBufferPosition([1, 1]);
            return editor.addCursorAtBufferPosition([0, 0]);
          });
          return it("is undone as one operation", function() {
            keydown('d');
            keydown('l');
            keydown('u');
            expect(editor.getText()).toBe("12345\nabcde\nABCDE\nQWERT");
            return expect(editor.getSelectedText()).toBe('');
          });
        });
      });
      describe("when followed by a w", function() {
        it("deletes the next word until the end of the line and exits operator-pending mode", function() {
          editor.setText("abcd efg\nabc");
          editor.setCursorScreenPosition([0, 5]);
          keydown('d');
          keydown('w');
          expect(editor.getText()).toBe("abcd abc");
          expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
          expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
          return expect(editorElement.classList.contains('normal-mode')).toBe(true);
        });
        return it("deletes to the beginning of the next word", function() {
          editor.setText('abcd efg');
          editor.setCursorScreenPosition([0, 2]);
          keydown('d');
          keydown('w');
          expect(editor.getText()).toBe('abefg');
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          editor.setText('one two three four');
          editor.setCursorScreenPosition([0, 0]);
          keydown('d');
          keydown('3');
          keydown('w');
          expect(editor.getText()).toBe('four');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      describe("when followed by an iw", function() {
        return it("deletes the containing word", function() {
          editor.setText("12345 abcde ABCDE");
          editor.setCursorScreenPosition([0, 9]);
          keydown('d');
          expect(editorElement.classList.contains('operator-pending-mode')).toBe(true);
          keydown('i');
          keydown('w');
          expect(editor.getText()).toBe("12345  ABCDE");
          expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
          expect(vimState.getRegister('"').text).toBe("abcde");
          expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
          return expect(editorElement.classList.contains('normal-mode')).toBe(true);
        });
      });
      describe("when followed by a j", function() {
        var originalText;
        originalText = "12345\nabcde\nABCDE\n";
        beforeEach(function() {
          return editor.setText(originalText);
        });
        describe("on the beginning of the file", function() {
          return it("deletes the next two lines", function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('d');
            keydown('j');
            return expect(editor.getText()).toBe("ABCDE\n");
          });
        });
        describe("on the end of the file", function() {
          return it("deletes nothing", function() {
            editor.setCursorScreenPosition([4, 0]);
            keydown('d');
            keydown('j');
            return expect(editor.getText()).toBe(originalText);
          });
        });
        return describe("on the middle of second line", function() {
          return it("deletes the last two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('d');
            keydown('j');
            return expect(editor.getText()).toBe("12345\n");
          });
        });
      });
      describe("when followed by an k", function() {
        var originalText;
        originalText = "12345\nabcde\nABCDE";
        beforeEach(function() {
          return editor.setText(originalText);
        });
        describe("on the end of the file", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([2, 4]);
            keydown('d');
            keydown('k');
            return expect(editor.getText()).toBe("12345\n");
          });
        });
        describe("on the beginning of the file", function() {
          return xit("deletes nothing", function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('d');
            keydown('k');
            return expect(editor.getText()).toBe(originalText);
          });
        });
        return describe("when on the middle of second line", function() {
          return it("deletes the first two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('d');
            keydown('k');
            return expect(editor.getText()).toBe("ABCDE");
          });
        });
      });
      describe("when followed by a G", function() {
        beforeEach(function() {
          var originalText;
          originalText = "12345\nabcde\nABCDE";
          return editor.setText(originalText);
        });
        describe("on the beginning of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('d');
            keydown('G', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\n");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('d');
            keydown('G', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\n");
          });
        });
      });
      describe("when followed by a goto line G", function() {
        beforeEach(function() {
          var originalText;
          originalText = "12345\nabcde\nABCDE";
          return editor.setText(originalText);
        });
        describe("on the beginning of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('d');
            keydown('2');
            keydown('G', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nABCDE");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('d');
            keydown('2');
            keydown('G', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nABCDE");
          });
        });
      });
      describe("when followed by a t)", function() {
        return describe("with the entire line yanked before", function() {
          beforeEach(function() {
            editor.setText("test (xyz)");
            return editor.setCursorScreenPosition([0, 6]);
          });
          return it("deletes until the closing parenthesis", function() {
            keydown('y');
            keydown('y');
            keydown('d');
            keydown('t');
            normalModeInputKeydown(')');
            expect(editor.getText()).toBe("test ()");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
          });
        });
      });
      return describe("with multiple cursors", function() {
        it("deletes each selection", function() {
          editor.setText("abcd\n1234\nABCD\n");
          editor.setCursorBufferPosition([0, 1]);
          editor.addCursorAtBufferPosition([1, 2]);
          editor.addCursorAtBufferPosition([2, 3]);
          keydown('d');
          keydown('e');
          expect(editor.getText()).toBe("a\n12\nABC");
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 1], [2, 2]]);
        });
        return it("doesn't delete empty selections", function() {
          editor.setText("abcd\nabc\nabd");
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 0]);
          editor.addCursorAtBufferPosition([2, 0]);
          keydown('d');
          keydown('t');
          normalModeInputKeydown('d');
          expect(editor.getText()).toBe("d\nabc\nd");
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 0], [2, 0]]);
        });
      });
    });
    describe("the D keybinding", function() {
      beforeEach(function() {
        editor.getBuffer().setText("012\n");
        editor.setCursorScreenPosition([0, 1]);
        return keydown('D', {
          shift: true
        });
      });
      return it("deletes the contents until the end of the line", function() {
        return expect(editor.getText()).toBe("0\n");
      });
    });
    describe("the c keybinding", function() {
      beforeEach(function() {
        return editor.setText("12345\nabcde\nABCDE");
      });
      describe("when followed by a c", function() {
        describe("with autoindent", function() {
          beforeEach(function() {
            editor.setText("12345\n  abcde\nABCDE");
            editor.setCursorScreenPosition([1, 1]);
            spyOn(editor, 'shouldAutoIndent').andReturn(true);
            spyOn(editor, 'autoIndentBufferRow').andCallFake(function(line) {
              return editor.indent();
            });
            return spyOn(editor.languageMode, 'suggestedIndentForLineAtBufferRow').andCallFake(function() {
              return 1;
            });
          });
          it("deletes the current line and enters insert mode", function() {
            editor.setCursorScreenPosition([1, 1]);
            keydown('c');
            keydown('c');
            expect(editor.getText()).toBe("12345\n  \nABCDE");
            expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
            expect(editorElement.classList.contains('normal-mode')).toBe(false);
            return expect(editorElement.classList.contains('insert-mode')).toBe(true);
          });
          it("is repeatable", function() {
            keydown('c');
            keydown('c');
            editor.insertText("abc");
            keydown('escape');
            expect(editor.getText()).toBe("12345\n  abc\nABCDE");
            editor.setCursorScreenPosition([2, 3]);
            keydown('.');
            return expect(editor.getText()).toBe("12345\n  abc\n  abc\n");
          });
          return it("is undoable", function() {
            keydown('c');
            keydown('c');
            editor.insertText("abc");
            keydown('escape');
            expect(editor.getText()).toBe("12345\n  abc\nABCDE");
            keydown('u');
            expect(editor.getText()).toBe("12345\n  abcde\nABCDE");
            return expect(editor.getSelectedText()).toBe('');
          });
        });
        describe("when the cursor is on the last line", function() {
          return it("deletes the line's content and enters insert mode on the last line", function() {
            editor.setCursorScreenPosition([2, 1]);
            keydown('c');
            keydown('c');
            expect(editor.getText()).toBe("12345\nabcde\n\n");
            expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
            expect(editorElement.classList.contains('normal-mode')).toBe(false);
            return expect(editorElement.classList.contains('insert-mode')).toBe(true);
          });
        });
        return describe("when the cursor is on the only line", function() {
          return it("deletes the line's content and enters insert mode", function() {
            editor.setText("12345");
            editor.setCursorScreenPosition([0, 2]);
            keydown('c');
            keydown('c');
            expect(editor.getText()).toBe("");
            expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
            expect(editorElement.classList.contains('normal-mode')).toBe(false);
            return expect(editorElement.classList.contains('insert-mode')).toBe(true);
          });
        });
      });
      describe("when followed by i w", function() {
        return it("undo's and redo's completely", function() {
          editor.setCursorScreenPosition([1, 1]);
          keydown('c');
          keydown('i');
          keydown('w');
          expect(editor.getText()).toBe("12345\n\nABCDE");
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          editor.setText("12345\nfg\nABCDE");
          keydown('escape');
          expect(editorElement.classList.contains('normal-mode')).toBe(true);
          expect(editor.getText()).toBe("12345\nfg\nABCDE");
          keydown('u');
          expect(editor.getText()).toBe("12345\nabcde\nABCDE");
          keydown('r', {
            ctrl: true
          });
          return expect(editor.getText()).toBe("12345\nfg\nABCDE");
        });
      });
      describe("when followed by a w", function() {
        return it("changes the word", function() {
          editor.setText("word1 word2 word3");
          editor.setCursorBufferPosition([0, "word1 w".length]);
          keydown("c");
          keydown("w");
          keydown("escape");
          return expect(editor.getText()).toBe("word1 w word3");
        });
      });
      describe("when followed by a G", function() {
        beforeEach(function() {
          var originalText;
          originalText = "12345\nabcde\nABCDE";
          return editor.setText(originalText);
        });
        describe("on the beginning of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('c');
            keydown('G', {
              shift: true
            });
            keydown('escape');
            return expect(editor.getText()).toBe("12345\n\n");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('c');
            keydown('G', {
              shift: true
            });
            keydown('escape');
            return expect(editor.getText()).toBe("12345\n\n");
          });
        });
      });
      describe("when followed by a %", function() {
        beforeEach(function() {
          return editor.setText("12345(67)8\nabc(d)e\nA()BCDE");
        });
        describe("before brackets or on the first one", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 1]);
            editor.addCursorAtScreenPosition([1, 1]);
            editor.addCursorAtScreenPosition([2, 1]);
            keydown('c');
            keydown('%');
            return editor.insertText('x');
          });
          it("replaces inclusively until matching bracket", function() {
            expect(editor.getText()).toBe("1x8\naxe\nAxBCDE");
            return expect(vimState.mode).toBe("insert");
          });
          return it("undoes correctly with u", function() {
            keydown('escape');
            expect(vimState.mode).toBe("normal");
            keydown('u');
            return expect(editor.getText()).toBe("12345(67)8\nabc(d)e\nA()BCDE");
          });
        });
        describe("inside brackets or on the ending one", function() {
          return it("replaces inclusively backwards until matching bracket", function() {
            editor.setCursorScreenPosition([0, 6]);
            editor.addCursorAtScreenPosition([1, 5]);
            editor.addCursorAtScreenPosition([2, 2]);
            keydown('c');
            keydown('%');
            editor.insertText('x');
            expect(editor.getText()).toBe("12345x7)8\nabcxe\nAxBCDE");
            return expect(vimState.mode).toBe("insert");
          });
        });
        describe("after or without brackets", function() {
          return it("deletes nothing", function() {
            editor.setText("12345(67)8\nabc(d)e\nABCDE");
            editor.setCursorScreenPosition([0, 9]);
            editor.addCursorAtScreenPosition([2, 2]);
            keydown('c');
            keydown('%');
            expect(editor.getText()).toBe("12345(67)8\nabc(d)e\nABCDE");
            return expect(vimState.mode).toBe("normal");
          });
        });
        return describe("repetition with .", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 1]);
            keydown('c');
            keydown('%');
            editor.insertText('x');
            return keydown('escape');
          });
          it("repeats correctly before a bracket", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('.');
            expect(editor.getText()).toBe("1x8\nxe\nA()BCDE");
            return expect(vimState.mode).toBe("normal");
          });
          it("repeats correctly on the opening bracket", function() {
            editor.setCursorScreenPosition([1, 3]);
            keydown('.');
            expect(editor.getText()).toBe("1x8\nabcxe\nA()BCDE");
            return expect(vimState.mode).toBe("normal");
          });
          it("repeats correctly inside brackets", function() {
            editor.setCursorScreenPosition([1, 4]);
            keydown('.');
            expect(editor.getText()).toBe("1x8\nabcx)e\nA()BCDE");
            return expect(vimState.mode).toBe("normal");
          });
          it("repeats correctly on the closing bracket", function() {
            editor.setCursorScreenPosition([1, 5]);
            keydown('.');
            expect(editor.getText()).toBe("1x8\nabcxe\nA()BCDE");
            return expect(vimState.mode).toBe("normal");
          });
          return it("does nothing when repeated after a bracket", function() {
            editor.setCursorScreenPosition([2, 3]);
            keydown('.');
            expect(editor.getText()).toBe("1x8\nabc(d)e\nA()BCDE");
            return expect(vimState.mode).toBe("normal");
          });
        });
      });
      describe("when followed by a goto line G", function() {
        beforeEach(function() {
          return editor.setText("12345\nabcde\nABCDE");
        });
        describe("on the beginning of the second line", function() {
          return it("deletes all the text on the line", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('c');
            keydown('2');
            keydown('G', {
              shift: true
            });
            keydown('escape');
            return expect(editor.getText()).toBe("12345\n\nABCDE");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes all the text on the line", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('c');
            keydown('2');
            keydown('G', {
              shift: true
            });
            keydown('escape');
            return expect(editor.getText()).toBe("12345\n\nABCDE");
          });
        });
      });
      return describe("in visual mode", function() {
        beforeEach(function() {
          editor.setText("123456789\nabcde\nfghijklmnopq\nuvwxyz");
          return editor.setCursorScreenPosition([1, 1]);
        });
        describe("with characterwise selection on a single line", function() {
          it("repeats with .", function() {
            keydown('v');
            keydown('2');
            keydown('l');
            keydown('c');
            editor.insertText("ab");
            keydown('escape');
            expect(editor.getText()).toBe("123456789\naabe\nfghijklmnopq\nuvwxyz");
            editor.setCursorScreenPosition([0, 1]);
            keydown('.');
            return expect(editor.getText()).toBe("1ab56789\naabe\nfghijklmnopq\nuvwxyz");
          });
          it("repeats shortened with . near the end of the line", function() {
            editor.setCursorScreenPosition([0, 2]);
            keydown('v');
            keydown('4');
            keydown('l');
            keydown('c');
            editor.insertText("ab");
            keydown('escape');
            expect(editor.getText()).toBe("12ab89\nabcde\nfghijklmnopq\nuvwxyz");
            editor.setCursorScreenPosition([1, 3]);
            keydown('.');
            return expect(editor.getText()).toBe("12ab89\nabcab\nfghijklmnopq\nuvwxyz");
          });
          return it("repeats shortened with . near the end of the line regardless of whether motion wrapping is enabled", function() {
            atom.config.set('vim-mode.wrapLeftRightMotion', true);
            editor.setCursorScreenPosition([0, 2]);
            keydown('v');
            keydown('4');
            keydown('l');
            keydown('c');
            editor.insertText("ab");
            keydown('escape');
            expect(editor.getText()).toBe("12ab89\nabcde\nfghijklmnopq\nuvwxyz");
            editor.setCursorScreenPosition([1, 3]);
            keydown('.');
            return expect(editor.getText()).toBe("12ab89\nabcab\nfghijklmnopq\nuvwxyz");
          });
        });
        describe("is repeatable with characterwise selection over multiple lines", function() {
          it("repeats with .", function() {
            keydown('v');
            keydown('j');
            keydown('3');
            keydown('l');
            keydown('c');
            editor.insertText("x");
            keydown('escape');
            expect(editor.getText()).toBe("123456789\naxklmnopq\nuvwxyz");
            editor.setCursorScreenPosition([0, 1]);
            keydown('.');
            return expect(editor.getText()).toBe("1xnopq\nuvwxyz");
          });
          return it("repeats shortened with . near the end of the line", function() {
            keydown('v');
            keydown('j');
            keydown('6');
            keydown('l');
            keydown('c');
            editor.insertText("x");
            keydown('escape');
            expect(editor.getText()).toBe("123456789\naxnopq\nuvwxyz");
            editor.setCursorScreenPosition([0, 1]);
            keydown('.');
            return expect(editor.getText()).toBe("1x\nuvwxyz");
          });
        });
        describe("is repeatable with linewise selection", function() {
          describe("with one line selected", function() {
            return it("repeats with .", function() {
              keydown('V', {
                shift: true
              });
              keydown('c');
              editor.insertText("x");
              keydown('escape');
              expect(editor.getText()).toBe("123456789\nx\nfghijklmnopq\nuvwxyz");
              editor.setCursorScreenPosition([0, 7]);
              keydown('.');
              expect(editor.getText()).toBe("x\nx\nfghijklmnopq\nuvwxyz");
              editor.setCursorScreenPosition([2, 0]);
              keydown('.');
              return expect(editor.getText()).toBe("x\nx\nx\nuvwxyz");
            });
          });
          return describe("with multiple lines selected", function() {
            it("repeats with .", function() {
              keydown('V', {
                shift: true
              });
              keydown('j');
              keydown('c');
              editor.insertText("x");
              keydown('escape');
              expect(editor.getText()).toBe("123456789\nx\nuvwxyz");
              editor.setCursorScreenPosition([0, 7]);
              keydown('.');
              return expect(editor.getText()).toBe("x\nuvwxyz");
            });
            return it("repeats shortened with . near the end of the file", function() {
              keydown('V', {
                shift: true
              });
              keydown('j');
              keydown('c');
              editor.insertText("x");
              keydown('escape');
              expect(editor.getText()).toBe("123456789\nx\nuvwxyz");
              editor.setCursorScreenPosition([1, 7]);
              keydown('.');
              return expect(editor.getText()).toBe("123456789\nx\n");
            });
          });
        });
        return xdescribe("is repeatable with block selection", function() {});
      });
    });
    describe("the C keybinding", function() {
      beforeEach(function() {
        editor.getBuffer().setText("012\n");
        editor.setCursorScreenPosition([0, 1]);
        return keydown('C', {
          shift: true
        });
      });
      return it("deletes the contents until the end of the line and enters insert mode", function() {
        expect(editor.getText()).toBe("0\n");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('normal-mode')).toBe(false);
        return expect(editorElement.classList.contains('insert-mode')).toBe(true);
      });
    });
    describe("the y keybinding", function() {
      beforeEach(function() {
        editor.getBuffer().setText("012 345\nabc\ndefg\n");
        editor.setCursorScreenPosition([0, 4]);
        return vimState.setRegister('"', {
          text: '345'
        });
      });
      describe("when selected lines in visual linewise mode", function() {
        beforeEach(function() {
          keydown('V', {
            shift: true
          });
          keydown('j');
          return keydown('y');
        });
        it("is in linewise motion", function() {
          return expect(vimState.getRegister('"').type).toEqual("linewise");
        });
        it("saves the lines to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe("012 345\nabc\n");
        });
        return it("places the cursor at the beginning of the selection", function() {
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 0]]);
        });
      });
      describe("when followed by a second y ", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('y');
        });
        it("saves the line to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe("012 345\n");
        });
        return it("leaves the cursor at the starting position", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        });
      });
      describe("when useClipboardAsDefaultRegister enabled", function() {
        return it("writes to clipboard", function() {
          atom.config.set('vim-mode.useClipboardAsDefaultRegister', true);
          keydown('y');
          keydown('y');
          return expect(atom.clipboard.read()).toBe('012 345\n');
        });
      });
      describe("when followed with a repeated y", function() {
        beforeEach(function() {
          keydown('y');
          keydown('2');
          return keydown('y');
        });
        it("copies n lines, starting from the current", function() {
          return expect(vimState.getRegister('"').text).toBe("012 345\nabc\n");
        });
        return it("leaves the cursor at the starting position", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        });
      });
      describe("with a register", function() {
        beforeEach(function() {
          keydown('"');
          keydown('a');
          keydown('y');
          return keydown('y');
        });
        it("saves the line to the a register", function() {
          return expect(vimState.getRegister('a').text).toBe("012 345\n");
        });
        return it("appends the line to the A register", function() {
          keydown('"');
          keydown('A', {
            shift: true
          });
          keydown('y');
          keydown('y');
          return expect(vimState.getRegister('a').text).toBe("012 345\n012 345\n");
        });
      });
      describe("with a forward motion", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('e');
        });
        it("saves the selected text to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe('345');
        });
        it("leaves the cursor at the starting position", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        });
        return it("does not yank when motion fails", function() {
          keydown('y');
          keydown('t');
          normalModeInputKeydown('x');
          return expect(vimState.getRegister('"').text).toBe('345');
        });
      });
      describe("with a text object", function() {
        return it("moves the cursor to the beginning of the text object", function() {
          editor.setCursorBufferPosition([0, 5]);
          keydown("y");
          keydown("i");
          keydown("w");
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 4]]);
        });
      });
      describe("with a left motion", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('h');
        });
        it("saves the left letter to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe(" ");
        });
        return it("moves the cursor position to the left", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        });
      });
      describe("with a down motion", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('j');
        });
        it("saves both full lines to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe("012 345\nabc\n");
        });
        return it("leaves the cursor at the starting position", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        });
      });
      describe("with an up motion", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([2, 2]);
          keydown('y');
          return keydown('k');
        });
        it("saves both full lines to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe("abc\ndefg\n");
        });
        return it("puts the cursor on the first line and the original column", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
        });
      });
      describe("when followed by a G", function() {
        beforeEach(function() {
          var originalText;
          originalText = "12345\nabcde\nABCDE";
          return editor.setText(originalText);
        });
        describe("on the beginning of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('y');
            keydown('G', {
              shift: true
            });
            keydown('P', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nabcde\nABCDE\nabcde\nABCDE");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('y');
            keydown('G', {
              shift: true
            });
            keydown('P', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nabcde\nABCDE\nabcde\nABCDE");
          });
        });
      });
      describe("when followed by a goto line G", function() {
        beforeEach(function() {
          var originalText;
          originalText = "12345\nabcde\nABCDE";
          return editor.setText(originalText);
        });
        describe("on the beginning of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('y');
            keydown('2');
            keydown('G', {
              shift: true
            });
            keydown('P', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nabcde\nabcde\nABCDE");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('y');
            keydown('2');
            keydown('G', {
              shift: true
            });
            keydown('P', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nabcde\nabcde\nABCDE");
          });
        });
      });
      describe("with multiple cursors", function() {
        return it("moves each cursor and copies the last selection's text", function() {
          editor.setText("  abcd\n  1234");
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 5]);
          keydown("y");
          keydown("^");
          expect(vimState.getRegister('"').text).toBe('123');
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 2]]);
        });
      });
      return describe("in a long file", function() {
        beforeEach(function() {
          var i, j, text;
          jasmine.attachToDOM(editorElement);
          editorElement.setHeight(400);
          editorElement.style.lineHeight = "10px";
          editorElement.style.font = "16px monospace";
          atom.views.performDocumentPoll();
          text = "";
          for (i = j = 1; j <= 200; i = ++j) {
            text += i + "\n";
          }
          return editor.setText(text);
        });
        describe("yanking many lines forward", function() {
          return it("does not scroll the window", function() {
            var previousScrollTop;
            editor.setCursorBufferPosition([40, 1]);
            previousScrollTop = editorElement.getScrollTop();
            keydown('y');
            keydown('1');
            keydown('6');
            keydown('0');
            keydown('G', {
              shift: true
            });
            expect(editorElement.getScrollTop()).toEqual(previousScrollTop);
            expect(editor.getCursorBufferPosition()).toEqual([40, 1]);
            return expect(vimState.getRegister('"').text.split('\n').length).toBe(121);
          });
        });
        return describe("yanking many lines backwards", function() {
          return it("scrolls the window", function() {
            var previousScrollTop;
            editor.setCursorBufferPosition([140, 1]);
            previousScrollTop = editorElement.getScrollTop();
            keydown('y');
            keydown('6');
            keydown('0');
            keydown('G', {
              shift: true
            });
            expect(editorElement.getScrollTop()).toNotEqual(previousScrollTop);
            expect(editor.getCursorBufferPosition()).toEqual([59, 1]);
            return expect(vimState.getRegister('"').text.split('\n').length).toBe(83);
          });
        });
      });
    });
    describe("the yy keybinding", function() {
      describe("on a single line file", function() {
        beforeEach(function() {
          editor.getBuffer().setText("exclamation!\n");
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("copies the entire line and pastes it correctly", function() {
          keydown('y');
          keydown('y');
          keydown('p');
          expect(vimState.getRegister('"').text).toBe("exclamation!\n");
          return expect(editor.getText()).toBe("exclamation!\nexclamation!\n");
        });
      });
      return describe("on a single line file with no newline", function() {
        beforeEach(function() {
          editor.getBuffer().setText("no newline!");
          return editor.setCursorScreenPosition([0, 0]);
        });
        it("copies the entire line and pastes it correctly", function() {
          keydown('y');
          keydown('y');
          keydown('p');
          expect(vimState.getRegister('"').text).toBe("no newline!\n");
          return expect(editor.getText()).toBe("no newline!\nno newline!");
        });
        return it("copies the entire line and pastes it respecting count and new lines", function() {
          keydown('y');
          keydown('y');
          keydown('2');
          keydown('p');
          expect(vimState.getRegister('"').text).toBe("no newline!\n");
          return expect(editor.getText()).toBe("no newline!\nno newline!\nno newline!");
        });
      });
    });
    describe("the Y keybinding", function() {
      beforeEach(function() {
        editor.getBuffer().setText("012 345\nabc\n");
        return editor.setCursorScreenPosition([0, 4]);
      });
      return it("saves the line to the default register", function() {
        keydown('Y', {
          shift: true
        });
        expect(vimState.getRegister('"').text).toBe("012 345\n");
        return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
      });
    });
    describe("the p keybinding", function() {
      describe("with character contents", function() {
        beforeEach(function() {
          editor.getBuffer().setText("012\n");
          editor.setCursorScreenPosition([0, 0]);
          vimState.setRegister('"', {
            text: '345'
          });
          vimState.setRegister('a', {
            text: 'a'
          });
          return atom.clipboard.write("clip");
        });
        describe("from the default register", function() {
          beforeEach(function() {
            return keydown('p');
          });
          return it("inserts the contents", function() {
            expect(editor.getText()).toBe("034512\n");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
          });
        });
        describe("at the end of a line", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 2]);
            return keydown('p');
          });
          return it("positions cursor correctly", function() {
            expect(editor.getText()).toBe("012345\n");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
          });
        });
        describe("when useClipboardAsDefaultRegister enabled", function() {
          return it("inserts contents from clipboard", function() {
            atom.config.set('vim-mode.useClipboardAsDefaultRegister', true);
            keydown('p');
            return expect(editor.getText()).toBe("0clip12\n");
          });
        });
        describe("from a specified register", function() {
          beforeEach(function() {
            keydown('"');
            keydown('a');
            return keydown('p');
          });
          return it("inserts the contents of the 'a' register", function() {
            expect(editor.getText()).toBe("0a12\n");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          });
        });
        describe("at the end of a line", function() {
          return it("inserts before the current line's newline", function() {
            editor.setText("abcde\none two three");
            editor.setCursorScreenPosition([1, 4]);
            keydown('d');
            keydown('$');
            keydown('k');
            keydown('$');
            keydown('p');
            return expect(editor.getText()).toBe("abcdetwo three\none ");
          });
        });
        return describe("with a selection", function() {
          beforeEach(function() {
            editor.selectRight();
            return keydown('p');
          });
          return it("replaces the current selection", function() {
            expect(editor.getText()).toBe("34512\n");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
      });
      describe("with linewise contents", function() {
        describe("on a single line", function() {
          beforeEach(function() {
            editor.getBuffer().setText("012");
            editor.setCursorScreenPosition([0, 1]);
            return vimState.setRegister('"', {
              text: " 345\n",
              type: 'linewise'
            });
          });
          it("inserts the contents of the default register", function() {
            keydown('p');
            expect(editor.getText()).toBe("012\n 345");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          });
          return it("replaces the current selection", function() {
            editor.selectRight();
            keydown('p');
            expect(editor.getText()).toBe("0 345\n2");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        return describe("on multiple lines", function() {
          beforeEach(function() {
            editor.getBuffer().setText("012\n 345");
            return vimState.setRegister('"', {
              text: " 456\n",
              type: 'linewise'
            });
          });
          it("inserts the contents of the default register at middle line", function() {
            editor.setCursorScreenPosition([0, 1]);
            keydown('p');
            expect(editor.getText()).toBe("012\n 456\n 345");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          });
          return it("inserts the contents of the default register at end of line", function() {
            editor.setCursorScreenPosition([1, 1]);
            keydown('p');
            expect(editor.getText()).toBe("012\n 345\n 456");
            return expect(editor.getCursorScreenPosition()).toEqual([2, 1]);
          });
        });
      });
      describe("with multiple linewise contents", function() {
        beforeEach(function() {
          editor.getBuffer().setText("012\nabc");
          editor.setCursorScreenPosition([1, 0]);
          vimState.setRegister('"', {
            text: " 345\n 678\n",
            type: 'linewise'
          });
          return keydown('p');
        });
        return it("inserts the contents of the default register", function() {
          expect(editor.getText()).toBe("012\nabc\n 345\n 678");
          return expect(editor.getCursorScreenPosition()).toEqual([2, 1]);
        });
      });
      return describe("pasting twice", function() {
        beforeEach(function() {
          editor.setText("12345\nabcde\nABCDE\nQWERT");
          editor.setCursorScreenPosition([1, 1]);
          vimState.setRegister('"', {
            text: '123'
          });
          keydown('2');
          return keydown('p');
        });
        it("inserts the same line twice", function() {
          return expect(editor.getText()).toBe("12345\nab123123cde\nABCDE\nQWERT");
        });
        return describe("when undone", function() {
          beforeEach(function() {
            return keydown('u');
          });
          return it("removes both lines", function() {
            return expect(editor.getText()).toBe("12345\nabcde\nABCDE\nQWERT");
          });
        });
      });
    });
    describe("the P keybinding", function() {
      return describe("with character contents", function() {
        beforeEach(function() {
          editor.getBuffer().setText("012\n");
          editor.setCursorScreenPosition([0, 0]);
          vimState.setRegister('"', {
            text: '345'
          });
          vimState.setRegister('a', {
            text: 'a'
          });
          return keydown('P', {
            shift: true
          });
        });
        return it("inserts the contents of the default register above", function() {
          expect(editor.getText()).toBe("345012\n");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
      });
    });
    describe("the O keybinding", function() {
      beforeEach(function() {
        spyOn(editor, 'shouldAutoIndent').andReturn(true);
        spyOn(editor, 'autoIndentBufferRow').andCallFake(function(line) {
          return editor.indent();
        });
        editor.getBuffer().setText("  abc\n  012\n");
        return editor.setCursorScreenPosition([1, 1]);
      });
      it("switches to insert and adds a newline above the current one", function() {
        keydown('O', {
          shift: true
        });
        expect(editor.getText()).toBe("  abc\n  \n  012\n");
        expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
        return expect(editorElement.classList.contains('insert-mode')).toBe(true);
      });
      it("is repeatable", function() {
        editor.getBuffer().setText("  abc\n  012\n    4spaces\n");
        editor.setCursorScreenPosition([1, 1]);
        keydown('O', {
          shift: true
        });
        editor.insertText("def");
        keydown('escape');
        expect(editor.getText()).toBe("  abc\n  def\n  012\n    4spaces\n");
        editor.setCursorScreenPosition([1, 1]);
        keydown('.');
        expect(editor.getText()).toBe("  abc\n  def\n  def\n  012\n    4spaces\n");
        editor.setCursorScreenPosition([4, 1]);
        keydown('.');
        return expect(editor.getText()).toBe("  abc\n  def\n  def\n  012\n    def\n    4spaces\n");
      });
      return it("is undoable", function() {
        keydown('O', {
          shift: true
        });
        editor.insertText("def");
        keydown('escape');
        expect(editor.getText()).toBe("  abc\n  def\n  012\n");
        keydown('u');
        return expect(editor.getText()).toBe("  abc\n  012\n");
      });
    });
    describe("the o keybinding", function() {
      beforeEach(function() {
        spyOn(editor, 'shouldAutoIndent').andReturn(true);
        spyOn(editor, 'autoIndentBufferRow').andCallFake(function(line) {
          return editor.indent();
        });
        editor.getBuffer().setText("abc\n  012\n");
        return editor.setCursorScreenPosition([1, 2]);
      });
      it("switches to insert and adds a newline above the current one", function() {
        keydown('o');
        expect(editor.getText()).toBe("abc\n  012\n  \n");
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        return expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
      });
      xit("is repeatable", function() {
        editor.getBuffer().setText("  abc\n  012\n    4spaces\n");
        editor.setCursorScreenPosition([1, 1]);
        keydown('o');
        editor.insertText("def");
        keydown('escape');
        expect(editor.getText()).toBe("  abc\n  012\n  def\n    4spaces\n");
        keydown('.');
        expect(editor.getText()).toBe("  abc\n  012\n  def\n  def\n    4spaces\n");
        editor.setCursorScreenPosition([4, 1]);
        keydown('.');
        return expect(editor.getText()).toBe("  abc\n  def\n  def\n  012\n    4spaces\n    def\n");
      });
      return it("is undoable", function() {
        keydown('o');
        editor.insertText("def");
        keydown('escape');
        expect(editor.getText()).toBe("abc\n  012\n  def\n");
        keydown('u');
        return expect(editor.getText()).toBe("abc\n  012\n");
      });
    });
    describe("the a keybinding", function() {
      beforeEach(function() {
        return editor.getBuffer().setText("012\n");
      });
      describe("at the beginning of the line", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([0, 0]);
          return keydown('a');
        });
        return it("switches to insert mode and shifts to the right", function() {
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          return expect(editorElement.classList.contains('insert-mode')).toBe(true);
        });
      });
      return describe("at the end of the line", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([0, 3]);
          return keydown('a');
        });
        return it("doesn't linewrap", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        });
      });
    });
    describe("the A keybinding", function() {
      beforeEach(function() {
        return editor.getBuffer().setText("11\n22\n");
      });
      return describe("at the beginning of a line", function() {
        it("switches to insert mode at the end of the line", function() {
          editor.setCursorScreenPosition([0, 0]);
          keydown('A', {
            shift: true
          });
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
        return it("repeats always as insert at the end of the line", function() {
          editor.setCursorScreenPosition([0, 0]);
          keydown('A', {
            shift: true
          });
          editor.insertText("abc");
          keydown('escape');
          editor.setCursorScreenPosition([1, 0]);
          keydown('.');
          expect(editor.getText()).toBe("11abc\n22abc\n");
          expect(editorElement.classList.contains('insert-mode')).toBe(false);
          return expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
        });
      });
    });
    describe("the I keybinding", function() {
      beforeEach(function() {
        return editor.getBuffer().setText("11\n  22\n");
      });
      return describe("at the end of a line", function() {
        it("switches to insert mode at the beginning of the line", function() {
          editor.setCursorScreenPosition([0, 2]);
          keydown('I', {
            shift: true
          });
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
        it("switches to insert mode after leading whitespace", function() {
          editor.setCursorScreenPosition([1, 4]);
          keydown('I', {
            shift: true
          });
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
        });
        return it("repeats always as insert at the first character of the line", function() {
          editor.setCursorScreenPosition([0, 2]);
          keydown('I', {
            shift: true
          });
          editor.insertText("abc");
          keydown('escape');
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          editor.setCursorScreenPosition([1, 4]);
          keydown('.');
          expect(editor.getText()).toBe("abc11\n  abc22\n");
          expect(editorElement.classList.contains('insert-mode')).toBe(false);
          return expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
        });
      });
    });
    describe("the J keybinding", function() {
      beforeEach(function() {
        editor.getBuffer().setText("012\n    456\n");
        return editor.setCursorScreenPosition([0, 1]);
      });
      describe("without repeating", function() {
        beforeEach(function() {
          return keydown('J', {
            shift: true
          });
        });
        return it("joins the contents of the current line with the one below it", function() {
          return expect(editor.getText()).toBe("012 456\n");
        });
      });
      return describe("with repeating", function() {
        beforeEach(function() {
          editor.setText("12345\nabcde\nABCDE\nQWERT");
          editor.setCursorScreenPosition([1, 1]);
          keydown('2');
          return keydown('J', {
            shift: true
          });
        });
        return describe("undo behavior", function() {
          beforeEach(function() {
            return keydown('u');
          });
          return it("handles repeats", function() {
            return expect(editor.getText()).toBe("12345\nabcde\nABCDE\nQWERT");
          });
        });
      });
    });
    describe("the > keybinding", function() {
      beforeEach(function() {
        return editor.setText("12345\nabcde\nABCDE");
      });
      describe("on the last line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([2, 0]);
        });
        return describe("when followed by a >", function() {
          beforeEach(function() {
            keydown('>');
            return keydown('>');
          });
          return it("indents the current line", function() {
            expect(editor.getText()).toBe("12345\nabcde\n  ABCDE");
            return expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
          });
        });
      });
      describe("on the first line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        describe("when followed by a >", function() {
          beforeEach(function() {
            keydown('>');
            return keydown('>');
          });
          return it("indents the current line", function() {
            expect(editor.getText()).toBe("  12345\nabcde\nABCDE");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        return describe("when followed by a repeating >", function() {
          beforeEach(function() {
            keydown('3');
            keydown('>');
            return keydown('>');
          });
          it("indents multiple lines at once", function() {
            expect(editor.getText()).toBe("  12345\n  abcde\n  ABCDE");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
          return describe("undo behavior", function() {
            beforeEach(function() {
              return keydown('u');
            });
            return it("outdents all three lines", function() {
              return expect(editor.getText()).toBe("12345\nabcde\nABCDE");
            });
          });
        });
      });
      describe("in visual mode linewise", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([0, 0]);
          keydown('v', {
            shift: true
          });
          return keydown('j');
        });
        describe("single indent multiple lines", function() {
          beforeEach(function() {
            return keydown('>');
          });
          it("indents both lines once and exits visual mode", function() {
            expect(editorElement.classList.contains('normal-mode')).toBe(true);
            expect(editor.getText()).toBe("  12345\n  abcde\nABCDE");
            return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 2], [0, 2]]]);
          });
          return it("allows repeating the operation", function() {
            keydown('.');
            return expect(editor.getText()).toBe("    12345\n    abcde\nABCDE");
          });
        });
        return describe("multiple indent multiple lines", function() {
          beforeEach(function() {
            keydown('2');
            return keydown('>');
          });
          return it("indents both lines twice and exits visual mode", function() {
            expect(editorElement.classList.contains('normal-mode')).toBe(true);
            expect(editor.getText()).toBe("    12345\n    abcde\nABCDE");
            return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 4], [0, 4]]]);
          });
        });
      });
      return describe("with multiple selections", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([1, 3]);
          keydown('v');
          keydown('j');
          return editor.addCursorAtScreenPosition([0, 0]);
        });
        return it("indents the lines and keeps the cursors", function() {
          keydown('>');
          expect(editor.getText()).toBe("  12345\n  abcde\n  ABCDE");
          return expect(editor.getCursorScreenPositions()).toEqual([[1, 2], [0, 2]]);
        });
      });
    });
    describe("the < keybinding", function() {
      beforeEach(function() {
        editor.setText("    12345\n    abcde\nABCDE");
        return editor.setCursorScreenPosition([0, 0]);
      });
      describe("when followed by a <", function() {
        beforeEach(function() {
          keydown('<');
          return keydown('<');
        });
        return it("outdents the current line", function() {
          expect(editor.getText()).toBe("  12345\n    abcde\nABCDE");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
      });
      describe("when followed by a repeating <", function() {
        beforeEach(function() {
          keydown('2');
          keydown('<');
          return keydown('<');
        });
        it("outdents multiple lines at once", function() {
          expect(editor.getText()).toBe("  12345\n  abcde\nABCDE");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
        return describe("undo behavior", function() {
          beforeEach(function() {
            return keydown('u');
          });
          return it("indents both lines", function() {
            return expect(editor.getText()).toBe("    12345\n    abcde\nABCDE");
          });
        });
      });
      return describe("in visual mode linewise", function() {
        beforeEach(function() {
          keydown('v', {
            shift: true
          });
          return keydown('j');
        });
        describe("single outdent multiple lines", function() {
          beforeEach(function() {
            return keydown('<');
          });
          it("outdents the current line and exits visual mode", function() {
            expect(editorElement.classList.contains('normal-mode')).toBe(true);
            expect(editor.getText()).toBe("  12345\n  abcde\nABCDE");
            return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 2], [0, 2]]]);
          });
          return it("allows repeating the operation", function() {
            keydown('.');
            return expect(editor.getText()).toBe("12345\nabcde\nABCDE");
          });
        });
        return describe("multiple outdent multiple lines", function() {
          beforeEach(function() {
            keydown('2');
            return keydown('<');
          });
          return it("outdents both lines twice and exits visual mode", function() {
            expect(editorElement.classList.contains('normal-mode')).toBe(true);
            expect(editor.getText()).toBe("12345\nabcde\nABCDE");
            return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 0], [0, 0]]]);
          });
        });
      });
    });
    describe("the = keybinding", function() {
      var oldGrammar;
      oldGrammar = [];
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.packages.activatePackage('language-javascript');
        });
        oldGrammar = editor.getGrammar();
        editor.setText("foo\n  bar\n  baz");
        return editor.setCursorScreenPosition([1, 0]);
      });
      return describe("when used in a scope that supports auto-indent", function() {
        beforeEach(function() {
          var jsGrammar;
          jsGrammar = atom.grammars.grammarForScopeName('source.js');
          return editor.setGrammar(jsGrammar);
        });
        afterEach(function() {
          return editor.setGrammar(oldGrammar);
        });
        describe("when followed by a =", function() {
          beforeEach(function() {
            keydown('=');
            return keydown('=');
          });
          return it("indents the current line", function() {
            return expect(editor.indentationForBufferRow(1)).toBe(0);
          });
        });
        describe("when followed by a G", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('=');
            return keydown('G', {
              shift: true
            });
          });
          return it("uses the default count", function() {
            expect(editor.indentationForBufferRow(1)).toBe(0);
            return expect(editor.indentationForBufferRow(2)).toBe(0);
          });
        });
        return describe("when followed by a repeating =", function() {
          beforeEach(function() {
            keydown('2');
            keydown('=');
            return keydown('=');
          });
          it("autoindents multiple lines at once", function() {
            expect(editor.getText()).toBe("foo\nbar\nbaz");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
          return describe("undo behavior", function() {
            beforeEach(function() {
              return keydown('u');
            });
            return it("indents both lines", function() {
              return expect(editor.getText()).toBe("foo\n  bar\n  baz");
            });
          });
        });
      });
    });
    describe("the . keybinding", function() {
      beforeEach(function() {
        editor.setText("12\n34\n56\n78");
        return editor.setCursorScreenPosition([0, 0]);
      });
      it("repeats the last operation", function() {
        keydown('2');
        keydown('d');
        keydown('d');
        keydown('.');
        return expect(editor.getText()).toBe("");
      });
      return it("composes with motions", function() {
        keydown('d');
        keydown('d');
        keydown('2');
        keydown('.');
        return expect(editor.getText()).toBe("78");
      });
    });
    describe("the r keybinding", function() {
      beforeEach(function() {
        editor.setText("12\n34\n\n");
        editor.setCursorBufferPosition([0, 0]);
        return editor.addCursorAtBufferPosition([1, 0]);
      });
      it("replaces a single character", function() {
        keydown('r');
        normalModeInputKeydown('x');
        return expect(editor.getText()).toBe('x2\nx4\n\n');
      });
      it("does nothing when cancelled", function() {
        keydown('r');
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(true);
        keydown('escape');
        expect(editor.getText()).toBe('12\n34\n\n');
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("replaces a single character with a line break", function() {
        keydown('r');
        atom.commands.dispatch(editor.normalModeInputView.editorElement, 'core:confirm');
        expect(editor.getText()).toBe('\n2\n\n4\n\n');
        return expect(editor.getCursorBufferPositions()).toEqual([[1, 0], [3, 0]]);
      });
      it("composes properly with motions", function() {
        keydown('2');
        keydown('r');
        normalModeInputKeydown('x');
        return expect(editor.getText()).toBe('xx\nxx\n\n');
      });
      it("does nothing on an empty line", function() {
        editor.setCursorBufferPosition([2, 0]);
        keydown('r');
        normalModeInputKeydown('x');
        return expect(editor.getText()).toBe('12\n34\n\n');
      });
      it("does nothing if asked to replace more characters than there are on a line", function() {
        keydown('3');
        keydown('r');
        normalModeInputKeydown('x');
        return expect(editor.getText()).toBe('12\n34\n\n');
      });
      describe("when in visual mode", function() {
        beforeEach(function() {
          keydown('v');
          return keydown('e');
        });
        it("replaces the entire selection with the given character", function() {
          keydown('r');
          normalModeInputKeydown('x');
          return expect(editor.getText()).toBe('xx\nxx\n\n');
        });
        return it("leaves the cursor at the beginning of the selection", function() {
          keydown('r');
          normalModeInputKeydown('x');
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 0]]);
        });
      });
      return describe('with accented characters', function() {
        var buildIMECompositionEvent, buildTextInputEvent;
        buildIMECompositionEvent = function(event, arg) {
          var data, ref1, target;
          ref1 = arg != null ? arg : {}, data = ref1.data, target = ref1.target;
          event = new Event(event);
          event.data = data;
          Object.defineProperty(event, 'target', {
            get: function() {
              return target;
            }
          });
          return event;
        };
        buildTextInputEvent = function(arg) {
          var data, event, target;
          data = arg.data, target = arg.target;
          event = new Event('textInput');
          event.data = data;
          Object.defineProperty(event, 'target', {
            get: function() {
              return target;
            }
          });
          return event;
        };
        return it('works with IME composition', function() {
          var domNode, inputNode, normalModeEditor;
          keydown('r');
          normalModeEditor = editor.normalModeInputView.editorElement;
          jasmine.attachToDOM(normalModeEditor);
          domNode = normalModeEditor.component.domNode;
          inputNode = domNode.querySelector('.hidden-input');
          domNode.dispatchEvent(buildIMECompositionEvent('compositionstart', {
            target: inputNode
          }));
          domNode.dispatchEvent(buildIMECompositionEvent('compositionupdate', {
            data: 's',
            target: inputNode
          }));
          expect(normalModeEditor.getModel().getText()).toEqual('s');
          domNode.dispatchEvent(buildIMECompositionEvent('compositionupdate', {
            data: 'sd',
            target: inputNode
          }));
          expect(normalModeEditor.getModel().getText()).toEqual('sd');
          domNode.dispatchEvent(buildIMECompositionEvent('compositionend', {
            target: inputNode
          }));
          domNode.dispatchEvent(buildTextInputEvent({
            data: '速度',
            target: inputNode
          }));
          return expect(editor.getText()).toBe('速度2\n速度4\n\n');
        });
      });
    });
    describe('the m keybinding', function() {
      beforeEach(function() {
        editor.setText('12\n34\n56\n');
        return editor.setCursorBufferPosition([0, 1]);
      });
      return it('marks a position', function() {
        keydown('m');
        normalModeInputKeydown('a');
        return expect(vimState.getMark('a')).toEqual([0, 1]);
      });
    });
    describe('the ~ keybinding', function() {
      beforeEach(function() {
        editor.setText('aBc\nXyZ');
        editor.setCursorBufferPosition([0, 0]);
        return editor.addCursorAtBufferPosition([1, 0]);
      });
      it('toggles the case and moves right', function() {
        keydown('~');
        expect(editor.getText()).toBe('ABc\nxyZ');
        expect(editor.getCursorScreenPositions()).toEqual([[0, 1], [1, 1]]);
        keydown('~');
        expect(editor.getText()).toBe('Abc\nxYZ');
        expect(editor.getCursorScreenPositions()).toEqual([[0, 2], [1, 2]]);
        keydown('~');
        expect(editor.getText()).toBe('AbC\nxYz');
        return expect(editor.getCursorScreenPositions()).toEqual([[0, 2], [1, 2]]);
      });
      it('takes a count', function() {
        keydown('4');
        keydown('~');
        expect(editor.getText()).toBe('AbC\nxYz');
        return expect(editor.getCursorScreenPositions()).toEqual([[0, 2], [1, 2]]);
      });
      describe("in visual mode", function() {
        return it("toggles the case of the selected text", function() {
          editor.setCursorBufferPosition([0, 0]);
          keydown("V", {
            shift: true
          });
          keydown("~");
          return expect(editor.getText()).toBe('AbC\nXyZ');
        });
      });
      return describe("with g and motion", function() {
        it("toggles the case of text", function() {
          editor.setCursorBufferPosition([0, 0]);
          keydown("g");
          keydown("~");
          keydown("2");
          keydown("l");
          return expect(editor.getText()).toBe('Abc\nXyZ');
        });
        return it("uses default count", function() {
          editor.setCursorBufferPosition([0, 0]);
          keydown("g");
          keydown("~");
          keydown("G", {
            shift: true
          });
          return expect(editor.getText()).toBe('AbC\nxYz');
        });
      });
    });
    describe('the U keybinding', function() {
      beforeEach(function() {
        editor.setText('aBc\nXyZ');
        return editor.setCursorBufferPosition([0, 0]);
      });
      it("makes text uppercase with g and motion", function() {
        keydown("g");
        keydown("U", {
          shift: true
        });
        keydown("l");
        expect(editor.getText()).toBe('ABc\nXyZ');
        keydown("g");
        keydown("U", {
          shift: true
        });
        keydown("e");
        expect(editor.getText()).toBe('ABC\nXyZ');
        editor.setCursorBufferPosition([1, 0]);
        keydown("g");
        keydown("U", {
          shift: true
        });
        keydown("$");
        expect(editor.getText()).toBe('ABC\nXYZ');
        return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
      });
      it("uses default count", function() {
        editor.setCursorBufferPosition([0, 0]);
        keydown("g");
        keydown("U", {
          shift: true
        });
        keydown("G", {
          shift: true
        });
        return expect(editor.getText()).toBe('ABC\nXYZ');
      });
      return it("makes the selected text uppercase in visual mode", function() {
        keydown("V", {
          shift: true
        });
        keydown("U", {
          shift: true
        });
        return expect(editor.getText()).toBe('ABC\nXyZ');
      });
    });
    describe('the u keybinding', function() {
      beforeEach(function() {
        editor.setText('aBc\nXyZ');
        return editor.setCursorBufferPosition([0, 0]);
      });
      it("makes text lowercase with g and motion", function() {
        keydown("g");
        keydown("u");
        keydown("$");
        expect(editor.getText()).toBe('abc\nXyZ');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it("uses default count", function() {
        editor.setCursorBufferPosition([0, 0]);
        keydown("g");
        keydown("u");
        keydown("G", {
          shift: true
        });
        return expect(editor.getText()).toBe('abc\nxyz');
      });
      return it("makes the selected text lowercase in visual mode", function() {
        keydown("V", {
          shift: true
        });
        keydown("u");
        return expect(editor.getText()).toBe('abc\nXyZ');
      });
    });
    describe("the i keybinding", function() {
      beforeEach(function() {
        editor.setText('123\n4567');
        editor.setCursorBufferPosition([0, 0]);
        return editor.addCursorAtBufferPosition([1, 0]);
      });
      it("allows undoing an entire batch of typing", function() {
        keydown('i');
        editor.insertText("abcXX");
        editor.backspace();
        editor.backspace();
        keydown('escape');
        expect(editor.getText()).toBe("abc123\nabc4567");
        keydown('i');
        editor.insertText("d");
        editor.insertText("e");
        editor.insertText("f");
        keydown('escape');
        expect(editor.getText()).toBe("abdefc123\nabdefc4567");
        keydown('u');
        expect(editor.getText()).toBe("abc123\nabc4567");
        keydown('u');
        return expect(editor.getText()).toBe("123\n4567");
      });
      it("allows repeating typing", function() {
        keydown('i');
        editor.insertText("abcXX");
        editor.backspace();
        editor.backspace();
        keydown('escape');
        expect(editor.getText()).toBe("abc123\nabc4567");
        keydown('.');
        expect(editor.getText()).toBe("ababcc123\nababcc4567");
        keydown('.');
        return expect(editor.getText()).toBe("abababccc123\nabababccc4567");
      });
      return describe('with nonlinear input', function() {
        beforeEach(function() {
          editor.setText('');
          return editor.setCursorBufferPosition([0, 0]);
        });
        it('deals with auto-matched brackets', function() {
          keydown('i');
          editor.insertText('()');
          editor.moveLeft();
          editor.insertText('a');
          editor.moveRight();
          editor.insertText('b\n');
          keydown('escape');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          keydown('.');
          expect(editor.getText()).toBe('(a)b\n(a)b\n');
          return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        });
        return it('deals with autocomplete', function() {
          keydown('i');
          editor.insertText('a');
          editor.insertText('d');
          editor.insertText('d');
          editor.setTextInBufferRange([[0, 0], [0, 3]], 'addFoo');
          keydown('escape');
          expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
          expect(editor.getText()).toBe('addFoo');
          keydown('.');
          expect(editor.getText()).toBe('addFoaddFooo');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 10]);
        });
      });
    });
    describe('the a keybinding', function() {
      beforeEach(function() {
        editor.setText('');
        return editor.setCursorBufferPosition([0, 0]);
      });
      it("can be undone in one go", function() {
        keydown('a');
        editor.insertText("abc");
        keydown('escape');
        expect(editor.getText()).toBe("abc");
        keydown('u');
        return expect(editor.getText()).toBe("");
      });
      return it("repeats correctly", function() {
        keydown('a');
        editor.insertText("abc");
        keydown('escape');
        expect(editor.getText()).toBe("abc");
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown('.');
        expect(editor.getText()).toBe("abcabc");
        return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
      });
    });
    describe("the ctrl-a/ctrl-x keybindings", function() {
      beforeEach(function() {
        atom.config.set('vim-mode.numberRegex', settings.config.numberRegex["default"]);
        editor.setText('123\nab45\ncd-67ef\nab-5\na-bcdef');
        editor.setCursorBufferPosition([0, 0]);
        editor.addCursorAtBufferPosition([1, 0]);
        editor.addCursorAtBufferPosition([2, 0]);
        editor.addCursorAtBufferPosition([3, 3]);
        return editor.addCursorAtBufferPosition([4, 0]);
      });
      describe("increasing numbers", function() {
        it("increases the next number", function() {
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('124\nab46\ncd-66ef\nab-4\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("repeats with .", function() {
          keydown('a', {
            ctrl: true
          });
          keydown('.');
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('125\nab47\ncd-65ef\nab-3\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("can have a count", function() {
          keydown('5');
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 2], [4, 0]]);
          expect(editor.getText()).toBe('128\nab50\ncd-62ef\nab0\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("can make a negative number positive, change number of digits", function() {
          keydown('9');
          keydown('9');
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 4], [2, 3], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('222\nab144\ncd32ef\nab94\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("does nothing when cursor is after the number", function() {
          editor.setCursorBufferPosition([2, 5]);
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[2, 5]]);
          expect(editor.getText()).toBe('123\nab45\ncd-67ef\nab-5\na-bcdef');
          return expect(atom.beep).toHaveBeenCalled();
        });
        it("does nothing on an empty line", function() {
          editor.setText('\n');
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 0]);
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 0]]);
          expect(editor.getText()).toBe('\n');
          return expect(atom.beep).toHaveBeenCalled();
        });
        return it("honours the vim-mode:numberRegex setting", function() {
          editor.setText('123\nab45\ncd -67ef\nab-5\na-bcdef');
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 0]);
          editor.addCursorAtBufferPosition([2, 0]);
          editor.addCursorAtBufferPosition([3, 3]);
          editor.addCursorAtBufferPosition([4, 0]);
          atom.config.set('vim-mode.numberRegex', '(?:\\B-)?[0-9]+');
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 5], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('124\nab46\ncd -66ef\nab-6\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
      });
      return describe("decreasing numbers", function() {
        it("decreases the next number", function() {
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('122\nab44\ncd-68ef\nab-6\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("repeats with .", function() {
          keydown('x', {
            ctrl: true
          });
          keydown('.');
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('121\nab43\ncd-69ef\nab-7\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("can have a count", function() {
          keydown('5');
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 4], [4, 0]]);
          expect(editor.getText()).toBe('118\nab40\ncd-72ef\nab-10\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("can make a positive number negative, change number of digits", function() {
          keydown('9');
          keydown('9');
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 1], [1, 4], [2, 5], [3, 5], [4, 0]]);
          expect(editor.getText()).toBe('24\nab-54\ncd-166ef\nab-104\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("does nothing when cursor is after the number", function() {
          editor.setCursorBufferPosition([2, 5]);
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[2, 5]]);
          expect(editor.getText()).toBe('123\nab45\ncd-67ef\nab-5\na-bcdef');
          return expect(atom.beep).toHaveBeenCalled();
        });
        it("does nothing on an empty line", function() {
          editor.setText('\n');
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 0]);
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 0]]);
          expect(editor.getText()).toBe('\n');
          return expect(atom.beep).toHaveBeenCalled();
        });
        return it("honours the vim-mode:numberRegex setting", function() {
          editor.setText('123\nab45\ncd -67ef\nab-5\na-bcdef');
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 0]);
          editor.addCursorAtBufferPosition([2, 0]);
          editor.addCursorAtBufferPosition([3, 3]);
          editor.addCursorAtBufferPosition([4, 0]);
          atom.config.set('vim-mode.numberRegex', '(?:\\B-)?[0-9]+');
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 5], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('122\nab44\ncd -68ef\nab-4\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
      });
    });
    return describe('the R keybinding', function() {
      beforeEach(function() {
        editor.setText('12345\n67890');
        return editor.setCursorBufferPosition([0, 2]);
      });
      it("enters replace mode and replaces characters", function() {
        keydown("R", {
          shift: true
        });
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        expect(editorElement.classList.contains('replace-mode')).toBe(true);
        editor.insertText("ab");
        keydown('escape');
        expect(editor.getText()).toBe("12ab5\n67890");
        expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        expect(editorElement.classList.contains('insert-mode')).toBe(false);
        expect(editorElement.classList.contains('replace-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("continues beyond end of line as insert", function() {
        keydown("R", {
          shift: true
        });
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        expect(editorElement.classList.contains('replace-mode')).toBe(true);
        editor.insertText("abcde");
        keydown('escape');
        return expect(editor.getText()).toBe("12abcde\n67890");
      });
      it("treats backspace as undo", function() {
        editor.insertText("foo");
        keydown("R", {
          shift: true
        });
        editor.insertText("a");
        editor.insertText("b");
        expect(editor.getText()).toBe("12fooab5\n67890");
        keydown('backspace', {
          raw: true
        });
        expect(editor.getText()).toBe("12fooa45\n67890");
        editor.insertText("c");
        expect(editor.getText()).toBe("12fooac5\n67890");
        keydown('backspace', {
          raw: true
        });
        keydown('backspace', {
          raw: true
        });
        expect(editor.getText()).toBe("12foo345\n67890");
        expect(editor.getSelectedText()).toBe("");
        keydown('backspace', {
          raw: true
        });
        expect(editor.getText()).toBe("12foo345\n67890");
        return expect(editor.getSelectedText()).toBe("");
      });
      it("can be repeated", function() {
        keydown("R", {
          shift: true
        });
        editor.insertText("ab");
        keydown('escape');
        editor.setCursorBufferPosition([1, 2]);
        keydown('.');
        expect(editor.getText()).toBe("12ab5\n67ab0");
        expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
        editor.setCursorBufferPosition([0, 4]);
        keydown('.');
        expect(editor.getText()).toBe("12abab\n67ab0");
        return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
      });
      it("can be interrupted by arrow keys and behave as insert for repeat", function() {});
      it("repeats correctly when backspace was used in the text", function() {
        keydown("R", {
          shift: true
        });
        editor.insertText("a");
        keydown('backspace', {
          raw: true
        });
        editor.insertText("b");
        keydown('escape');
        editor.setCursorBufferPosition([1, 2]);
        keydown('.');
        expect(editor.getText()).toBe("12b45\n67b90");
        expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
        editor.setCursorBufferPosition([0, 4]);
        keydown('.');
        expect(editor.getText()).toBe("12b4b\n67b90");
        return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
      });
      return it("doesn't replace a character if newline is entered", function() {
        keydown("R", {
          shift: true
        });
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        expect(editorElement.classList.contains('replace-mode')).toBe(true);
        editor.insertText("\n");
        keydown('escape');
        return expect(editor.getText()).toBe("12\n345\n67890");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvb3BlcmF0b3JzLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGVBQVI7O0VBQ1YsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUjs7RUFFWCxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBO0FBQ3BCLFFBQUE7SUFBQSxNQUFvQyxFQUFwQyxFQUFDLGVBQUQsRUFBUyxzQkFBVCxFQUF3QjtJQUV4QixVQUFBLENBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFkLENBQTBCLFVBQTFCO01BQ1YsT0FBTyxDQUFDLGlCQUFSLENBQUE7YUFFQSxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsU0FBQyxPQUFEO1FBQ3ZCLGFBQUEsR0FBZ0I7UUFDaEIsTUFBQSxHQUFTLGFBQWEsQ0FBQyxRQUFkLENBQUE7UUFDVCxRQUFBLEdBQVcsYUFBYSxDQUFDO1FBQ3pCLFFBQVEsQ0FBQyxrQkFBVCxDQUFBO2VBQ0EsUUFBUSxDQUFDLGVBQVQsQ0FBQTtNQUx1QixDQUF6QjtJQUpTLENBQVg7SUFXQSxPQUFBLEdBQVUsU0FBQyxHQUFELEVBQU0sT0FBTjs7UUFBTSxVQUFROzs7UUFDdEIsT0FBTyxDQUFDLFVBQVc7O2FBQ25CLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEdBQWhCLEVBQXFCLE9BQXJCO0lBRlE7SUFJVixzQkFBQSxHQUF5QixTQUFDLEdBQUQsRUFBTSxJQUFOOztRQUFNLE9BQU87O2FBQ3BDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsUUFBekMsQ0FBQSxDQUFtRCxDQUFDLE9BQXBELENBQTRELEdBQTVEO0lBRHVCO0lBR3pCLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBO01BQ2hDLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBO2VBR2pELE1BQUEsQ0FBTyxTQUFBO2lCQUFHLFFBQVEsQ0FBQyxjQUFULENBQTRCLElBQUEsS0FBQSxDQUFNLEVBQU4sQ0FBNUI7UUFBSCxDQUFQLENBQWlELENBQUMsT0FBbEQsQ0FBQTtNQUhpRCxDQUFuRDthQUtBLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBO1FBRW5DLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxpQkFBVCxDQUFBLENBQVAsQ0FBb0MsQ0FBQyxJQUFyQyxDQUEwQyxJQUExQztRQUNBLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsTUFBckMsQ0FBQTtRQUVBLE1BQUEsQ0FBTyxRQUFRLENBQUMsaUJBQVQsQ0FBQSxDQUFQLENBQW9DLENBQUMsSUFBckMsQ0FBMEMsS0FBMUM7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLG1CQUFkLENBQWtDLENBQUMsSUFBbkMsQ0FBd0MsTUFBeEM7TUFQbUMsQ0FBckM7SUFOZ0MsQ0FBbEM7SUFlQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQTtNQUMzQixRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQTtRQUNqQyxRQUFBLENBQVMsc0NBQVQsRUFBaUQsU0FBQTtVQUMvQyxVQUFBLENBQVcsU0FBQTtZQUNULE1BQU0sQ0FBQyxPQUFQLENBQWUsb0JBQWY7bUJBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7VUFGUyxDQUFYO1VBSUEsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUE7WUFDeEIsT0FBQSxDQUFRLEdBQVI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsbUJBQTlCO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1lBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxHQUE1QztZQUVBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtCQUE5QjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtZQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsR0FBNUM7WUFFQSxPQUFBLENBQVEsR0FBUjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixpQkFBOUI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7WUFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEdBQTVDO1lBRUEsT0FBQSxDQUFRLEdBQVI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZ0JBQTlCO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1lBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxHQUE1QztZQUVBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGVBQTlCO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1lBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxHQUE1QztZQUVBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGNBQTlCO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO21CQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsR0FBNUM7VUE3QndCLENBQTFCO2lCQStCQSxFQUFBLENBQUcsMENBQUgsRUFBK0MsU0FBQTtZQUM3QyxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtCQUE5QjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtZQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsSUFBNUM7WUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZ0JBQTlCO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO21CQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsSUFBNUM7VUFaNkMsQ0FBL0M7UUFwQytDLENBQWpEO1FBa0RBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBO1VBQ2hDLFVBQUEsQ0FBVyxTQUFBO1lBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSxvQkFBZjtZQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO21CQUNBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDO1VBSFMsQ0FBWDtpQkFLQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQTtZQUMvQixPQUFBLENBQVEsR0FBUjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixrQkFBOUI7WUFDQSxPQUFBLENBQVEsR0FBUjttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsb0JBQTlCO1VBSitCLENBQWpDO1FBTmdDLENBQWxDO2VBWUEsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUE7VUFDNUMsVUFBQSxDQUFXLFNBQUE7WUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLG9CQUFmO1lBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7bUJBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixFQUFnRCxJQUFoRDtVQUhTLENBQVg7VUFLQSxFQUFBLENBQUcscUJBQUgsRUFBMEIsU0FBQTtZQUV4QixPQUFBLENBQVEsR0FBUjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQkFBOUI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7WUFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEdBQTVDO1lBRUEsT0FBQSxDQUFRLEdBQVI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsa0JBQTlCO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1lBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxHQUE1QztZQUVBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlCQUE5QjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtZQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsR0FBNUM7WUFFQSxPQUFBLENBQVEsR0FBUjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixnQkFBOUI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7WUFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEdBQTVDO1lBRUEsT0FBQSxDQUFRLEdBQVI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZUFBOUI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7WUFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEdBQTVDO1lBRUEsT0FBQSxDQUFRLEdBQVI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsY0FBOUI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7bUJBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxHQUE1QztVQTlCd0IsQ0FBMUI7aUJBZ0NBLEVBQUEsQ0FBRyx1REFBSCxFQUE0RCxTQUFBO1lBQzFELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsRUFBZ0QsSUFBaEQ7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtCQUE5QjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtZQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsSUFBNUM7WUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsY0FBOUI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7WUFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLE1BQTVDO1lBRUEsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixLQUE5QjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDttQkFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLFdBQTVDO1VBbkIwRCxDQUE1RDtRQXRDNEMsQ0FBOUM7TUEvRGlDLENBQW5DO2FBMEhBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBO1FBQzNCLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSxvQkFBZjtpQkFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtRQUZTLENBQVg7UUFJQSxFQUFBLENBQUcsNkVBQUgsRUFBa0YsU0FBQTtVQUNoRixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLEVBQWdELEtBQWhEO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsb0JBQTlCO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtRQUpnRixDQUFsRjtlQU1BLEVBQUEsQ0FBRyxpRUFBSCxFQUFzRSxTQUFBO1VBQ3BFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsRUFBZ0QsSUFBaEQ7VUFDQSxPQUFBLENBQVEsR0FBUjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixrQkFBOUI7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1FBSm9FLENBQXRFO01BWDJCLENBQTdCO0lBM0gyQixDQUE3QjtJQTRJQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQTtNQUMzQixRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQTtRQUNqQyxVQUFBLENBQVcsU0FBQTtVQUNULE1BQU0sQ0FBQyxPQUFQLENBQWUsWUFBZjtpQkFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtRQUZTLENBQVg7ZUFJQSxFQUFBLENBQUcscUJBQUgsRUFBMEIsU0FBQTtVQUN4QixPQUFBLENBQVEsR0FBUixFQUFhO1lBQUEsS0FBQSxFQUFPLElBQVA7V0FBYjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixXQUE5QjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtVQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsR0FBNUM7VUFFQSxPQUFBLENBQVEsR0FBUixFQUFhO1lBQUEsS0FBQSxFQUFPLElBQVA7V0FBYjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtVQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsR0FBNUM7VUFFQSxPQUFBLENBQVEsR0FBUixFQUFhO1lBQUEsS0FBQSxFQUFPLElBQVA7V0FBYjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtVQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsR0FBNUM7VUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLEVBQWdELElBQWhEO1VBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtZQUFBLEtBQUEsRUFBTyxJQUFQO1dBQWI7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsUUFBOUI7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7aUJBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxJQUE1QztRQXBCd0IsQ0FBMUI7TUFMaUMsQ0FBbkM7YUEyQkEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7UUFDM0IsVUFBQSxDQUFXLFNBQUE7VUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLGtCQUFmO2lCQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1FBRlMsQ0FBWDtRQUlBLEVBQUEsQ0FBRyw0REFBSCxFQUFpRSxTQUFBO1VBQy9ELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsRUFBZ0QsS0FBaEQ7VUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO1lBQUEsS0FBQSxFQUFPLElBQVA7V0FBYjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixrQkFBOUI7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1FBSitELENBQWpFO2VBTUEsRUFBQSxDQUFHLHNEQUFILEVBQTJELFNBQUE7VUFDekQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixFQUFnRCxJQUFoRDtVQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7WUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGdCQUE5QjtpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7UUFKeUQsQ0FBM0Q7TUFYMkIsQ0FBN0I7SUE1QjJCLENBQTdCO0lBNkNBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBO01BQzNCLFVBQUEsQ0FBVyxTQUFBO1FBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSxRQUFmO2VBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7TUFGUyxDQUFYO01BSUEsRUFBQSxDQUFHLDJEQUFILEVBQWdFLFNBQUE7UUFDOUQsT0FBQSxDQUFRLEdBQVI7UUFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0Q7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsT0FBOUI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7ZUFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEdBQTVDO01BTDhELENBQWhFO01BT0EsRUFBQSxDQUFHLGVBQUgsRUFBb0IsU0FBQTtRQUNsQixNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtRQUNBLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsT0FBQSxDQUFRLEdBQVI7UUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFsQjtRQUNBLE9BQUEsQ0FBUSxRQUFSO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLE9BQTlCO1FBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFDQSxPQUFBLENBQVEsR0FBUjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixNQUE5QjtNQVRrQixDQUFwQjtNQVdBLEVBQUEsQ0FBRyxhQUFILEVBQWtCLFNBQUE7UUFDaEIsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFDQSxPQUFBLENBQVEsR0FBUjtRQUNBLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBbEI7UUFDQSxPQUFBLENBQVEsUUFBUjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixPQUE5QjtRQUNBLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFFBQTlCO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FBUCxDQUFnQyxDQUFDLElBQWpDLENBQXNDLEVBQXRDO01BVGdCLENBQWxCO2FBV0EsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUE7UUFDekIsVUFBQSxDQUFXLFNBQUE7VUFDVCxPQUFBLENBQVEsR0FBUjtVQUNBLE1BQU0sQ0FBQyxXQUFQLENBQUE7aUJBQ0EsT0FBQSxDQUFRLEdBQVI7UUFIUyxDQUFYO2VBS0EsRUFBQSxDQUFHLHdEQUFILEVBQTZELFNBQUE7VUFDM0QsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdEO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLE1BQTlCO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO2lCQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsSUFBNUM7UUFKMkQsQ0FBN0Q7TUFOeUIsQ0FBM0I7SUFsQzJCLENBQTdCO0lBOENBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBO01BQzNCLFVBQUEsQ0FBVyxTQUFBO1FBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSxxQkFBZjtlQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO01BRlMsQ0FBWDtNQUlBLEVBQUEsQ0FBRyxnREFBSCxFQUFxRCxTQUFBO1FBQ25ELE9BQUEsQ0FBUSxHQUFSLEVBQWE7VUFBQSxLQUFBLEVBQU8sSUFBUDtTQUFiO1FBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdEO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGdCQUE5QjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtRQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsU0FBNUM7ZUFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLFVBQTVDO01BTm1ELENBQXJEO01BUUEsRUFBQSxDQUFHLGVBQUgsRUFBb0IsU0FBQTtRQUNsQixPQUFBLENBQVEsR0FBUixFQUFhO1VBQUEsS0FBQSxFQUFPLElBQVA7U0FBYjtRQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCO1FBQ0EsT0FBQSxDQUFRLFFBQVI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsbUJBQTlCO1FBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFDQSxPQUFBLENBQVEsR0FBUjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQkFBOUI7TUFQa0IsQ0FBcEI7TUFTQSxFQUFBLENBQUcsYUFBSCxFQUFrQixTQUFBO1FBQ2hCLE9BQUEsQ0FBUSxHQUFSLEVBQWE7VUFBQSxLQUFBLEVBQU8sSUFBUDtTQUFiO1FBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEI7UUFDQSxPQUFBLENBQVEsUUFBUjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQkFBOUI7UUFDQSxPQUFBLENBQVEsR0FBUjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixxQkFBOUI7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLGVBQVAsQ0FBQSxDQUFQLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsRUFBdEM7TUFQZ0IsQ0FBbEI7TUFTQSxFQUFBLENBQUcsd0VBQUgsRUFBNkUsU0FBQTtRQUMzRSxNQUFNLENBQUMsT0FBUCxDQUFlLFNBQWY7UUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksS0FBSixDQUEvQjtRQUNBLE1BQU0sQ0FBQyxNQUFQLENBQUE7UUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO1VBQUEsS0FBQSxFQUFPLElBQVA7U0FBYjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QjtNQUwyRSxDQUE3RTthQVFBLEdBQUEsQ0FBSSxzQkFBSixFQUE0QixTQUFBLEdBQUEsQ0FBNUI7SUF2QzJCLENBQTdCO0lBeUNBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBO01BQzNCLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBO1FBQ2pDLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsdUJBQWpDLENBQVAsQ0FBaUUsQ0FBQyxJQUFsRSxDQUF1RSxJQUF2RTtlQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxLQUE3RDtNQUhpQyxDQUFuQztNQUtBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO1FBQy9CLEVBQUEsQ0FBRywwREFBSCxFQUErRCxTQUFBO1VBQzdELE1BQU0sQ0FBQyxPQUFQLENBQWUsdUJBQWY7VUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtVQUVBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZ0JBQTlCO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1VBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxTQUE1QztVQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLHVCQUFqQyxDQUFQLENBQWlFLENBQUMsSUFBbEUsQ0FBdUUsS0FBdkU7aUJBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdEO1FBWDZELENBQS9EO1FBYUEsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUE7VUFDMUIsTUFBTSxDQUFDLE9BQVAsQ0FBZSxxQkFBZjtVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1VBRUEsT0FBQSxDQUFRLEdBQVI7VUFDQSxPQUFBLENBQVEsR0FBUjtVQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixnQkFBOUI7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1FBUjBCLENBQTVCO2VBVUEsRUFBQSxDQUFHLG1EQUFILEVBQXdELFNBQUE7VUFDdEQsTUFBTSxDQUFDLE9BQVAsQ0FBZSxrQkFBZjtVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1VBRUEsT0FBQSxDQUFRLEdBQVI7VUFDQSxPQUFBLENBQVEsR0FBUjtVQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixXQUE5QjtpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7UUFSc0QsQ0FBeEQ7TUF4QitCLENBQWpDO01Ba0NBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUE7UUFDeEIsVUFBQSxDQUFXLFNBQUE7VUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLDRCQUFmO2lCQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1FBRlMsQ0FBWDtRQUlBLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBO1VBQ3RCLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFDQSxPQUFBLENBQVEsR0FBUjtVQUVBLE9BQUEsQ0FBUSxHQUFSO1VBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDRCQUE5QjtpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLGVBQVAsQ0FBQSxDQUFQLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsRUFBdEM7UUFSc0IsQ0FBeEI7ZUFVQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQTtVQUNoQyxVQUFBLENBQVcsU0FBQTtZQUNULE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO21CQUNBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDO1VBRlMsQ0FBWDtpQkFJQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQTtZQUMvQixPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBRUEsT0FBQSxDQUFRLEdBQVI7WUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsNEJBQTlCO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsZUFBUCxDQUFBLENBQVAsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxFQUF0QztVQVArQixDQUFqQztRQUxnQyxDQUFsQztNQWZ3QixDQUExQjtNQTZCQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQTtRQUMvQixFQUFBLENBQUcsaUZBQUgsRUFBc0YsU0FBQTtVQUNwRixNQUFNLENBQUMsT0FBUCxDQUFlLGVBQWY7VUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtVQUVBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUI7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7VUFFQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyx1QkFBakMsQ0FBUCxDQUFpRSxDQUFDLElBQWxFLENBQXVFLEtBQXZFO2lCQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RDtRQWJvRixDQUF0RjtlQWVBLEVBQUEsQ0FBRywyQ0FBSCxFQUFnRCxTQUFBO1VBQzlDLE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZjtVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1VBRUEsT0FBQSxDQUFRLEdBQVI7VUFDQSxPQUFBLENBQVEsR0FBUjtVQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixPQUE5QjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtVQUVBLE1BQU0sQ0FBQyxPQUFQLENBQWUsb0JBQWY7VUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtVQUVBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFDQSxPQUFBLENBQVEsR0FBUjtVQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixNQUE5QjtpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7UUFsQjhDLENBQWhEO01BaEIrQixDQUFqQztNQW9DQSxRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQTtlQUNqQyxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQTtVQUNoQyxNQUFNLENBQUMsT0FBUCxDQUFlLG1CQUFmO1VBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7VUFFQSxPQUFBLENBQVEsR0FBUjtVQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLHVCQUFqQyxDQUFQLENBQWlFLENBQUMsSUFBbEUsQ0FBdUUsSUFBdkU7VUFDQSxPQUFBLENBQVEsR0FBUjtVQUNBLE9BQUEsQ0FBUSxHQUFSO1VBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGNBQTlCO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1VBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxPQUE1QztVQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLHVCQUFqQyxDQUFQLENBQWlFLENBQUMsSUFBbEUsQ0FBdUUsS0FBdkU7aUJBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdEO1FBYmdDLENBQWxDO01BRGlDLENBQW5DO01BZ0JBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO0FBQy9CLFlBQUE7UUFBQSxZQUFBLEdBQWU7UUFFZixVQUFBLENBQVcsU0FBQTtpQkFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLFlBQWY7UUFEUyxDQUFYO1FBR0EsUUFBQSxDQUFTLDhCQUFULEVBQXlDLFNBQUE7aUJBQ3ZDLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBO1lBQy9CLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBOUI7VUFKK0IsQ0FBakM7UUFEdUMsQ0FBekM7UUFPQSxRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQTtpQkFDakMsRUFBQSxDQUFHLGlCQUFILEVBQXNCLFNBQUE7WUFDcEIsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixZQUE5QjtVQUpvQixDQUF0QjtRQURpQyxDQUFuQztlQU9BLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBO2lCQUN2QyxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQTtZQUMvQixNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCO1VBSitCLENBQWpDO1FBRHVDLENBQXpDO01BcEIrQixDQUFqQztNQTJCQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQTtBQUNoQyxZQUFBO1FBQUEsWUFBQSxHQUFlO1FBRWYsVUFBQSxDQUFXLFNBQUE7aUJBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSxZQUFmO1FBRFMsQ0FBWDtRQUdBLFFBQUEsQ0FBUyx3QkFBVCxFQUFtQyxTQUFBO2lCQUNqQyxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQTtZQUNqQyxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCO1VBSmlDLENBQW5DO1FBRGlDLENBQW5DO1FBT0EsUUFBQSxDQUFTLDhCQUFULEVBQXlDLFNBQUE7aUJBQ3ZDLEdBQUEsQ0FBSSxpQkFBSixFQUF1QixTQUFBO1lBQ3JCLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsWUFBOUI7VUFKcUIsQ0FBdkI7UUFEdUMsQ0FBekM7ZUFPQSxRQUFBLENBQVMsbUNBQVQsRUFBOEMsU0FBQTtpQkFDNUMsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUE7WUFDaEMsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixPQUE5QjtVQUpnQyxDQUFsQztRQUQ0QyxDQUE5QztNQXBCZ0MsQ0FBbEM7TUEyQkEsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUE7UUFDL0IsVUFBQSxDQUFXLFNBQUE7QUFDVCxjQUFBO1VBQUEsWUFBQSxHQUFlO2lCQUNmLE1BQU0sQ0FBQyxPQUFQLENBQWUsWUFBZjtRQUZTLENBQVg7UUFJQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQTtpQkFDOUMsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUE7WUFDakMsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7Y0FBQSxLQUFBLEVBQU8sSUFBUDthQUFiO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QjtVQUppQyxDQUFuQztRQUQ4QyxDQUFoRDtlQU9BLFFBQUEsQ0FBUyxrQ0FBVCxFQUE2QyxTQUFBO2lCQUMzQyxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQTtZQUNqQyxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtjQUFBLEtBQUEsRUFBTyxJQUFQO2FBQWI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCO1VBSmlDLENBQW5DO1FBRDJDLENBQTdDO01BWitCLENBQWpDO01BbUJBLFFBQUEsQ0FBUyxnQ0FBVCxFQUEyQyxTQUFBO1FBQ3pDLFVBQUEsQ0FBVyxTQUFBO0FBQ1QsY0FBQTtVQUFBLFlBQUEsR0FBZTtpQkFDZixNQUFNLENBQUMsT0FBUCxDQUFlLFlBQWY7UUFGUyxDQUFYO1FBSUEsUUFBQSxDQUFTLHFDQUFULEVBQWdELFNBQUE7aUJBQzlDLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBO1lBQ2pDLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7Y0FBQSxLQUFBLEVBQU8sSUFBUDthQUFiO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixjQUE5QjtVQUxpQyxDQUFuQztRQUQ4QyxDQUFoRDtlQVFBLFFBQUEsQ0FBUyxrQ0FBVCxFQUE2QyxTQUFBO2lCQUMzQyxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQTtZQUNqQyxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO2NBQUEsS0FBQSxFQUFPLElBQVA7YUFBYjttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsY0FBOUI7VUFMaUMsQ0FBbkM7UUFEMkMsQ0FBN0M7TUFieUMsQ0FBM0M7TUFxQkEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUE7ZUFDaEMsUUFBQSxDQUFTLG9DQUFULEVBQStDLFNBQUE7VUFDN0MsVUFBQSxDQUFXLFNBQUE7WUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLFlBQWY7bUJBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7VUFGUyxDQUFYO2lCQUlBLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBO1lBQzFDLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0Esc0JBQUEsQ0FBdUIsR0FBdkI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBOUI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1VBUDBDLENBQTVDO1FBTDZDLENBQS9DO01BRGdDLENBQWxDO2FBZUEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUE7UUFDaEMsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUE7VUFDM0IsTUFBTSxDQUFDLE9BQVAsQ0FBZSxvQkFBZjtVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1VBQ0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakM7VUFDQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQztVQUVBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsWUFBOUI7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUNoRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBRGdELEVBRWhELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FGZ0QsRUFHaEQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUhnRCxDQUFsRDtRQVYyQixDQUE3QjtlQWdCQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQTtVQUNwQyxNQUFNLENBQUMsT0FBUCxDQUFlLGdCQUFmO1VBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7VUFDQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQztVQUNBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDO1VBRUEsT0FBQSxDQUFRLEdBQVI7VUFDQSxPQUFBLENBQVEsR0FBUjtVQUNBLHNCQUFBLENBQXVCLEdBQXZCO1VBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFdBQTlCO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsd0JBQVAsQ0FBQSxDQUFQLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsQ0FDaEQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQURnRCxFQUVoRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBRmdELEVBR2hELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FIZ0QsQ0FBbEQ7UUFYb0MsQ0FBdEM7TUFqQmdDLENBQWxDO0lBdE8yQixDQUE3QjtJQXdRQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQTtNQUMzQixVQUFBLENBQVcsU0FBQTtRQUNULE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixPQUEzQjtRQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO2VBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWI7TUFIUyxDQUFYO2FBS0EsRUFBQSxDQUFHLGdEQUFILEVBQXFELFNBQUE7ZUFDbkQsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLEtBQTlCO01BRG1ELENBQXJEO0lBTjJCLENBQTdCO0lBU0EsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7TUFDM0IsVUFBQSxDQUFXLFNBQUE7ZUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLHFCQUFmO01BRFMsQ0FBWDtNQUdBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO1FBQy9CLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBO1VBQzFCLFVBQUEsQ0FBVyxTQUFBO1lBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSx1QkFBZjtZQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1lBQ0EsS0FBQSxDQUFNLE1BQU4sRUFBYyxrQkFBZCxDQUFpQyxDQUFDLFNBQWxDLENBQTRDLElBQTVDO1lBQ0EsS0FBQSxDQUFNLE1BQU4sRUFBYyxxQkFBZCxDQUFvQyxDQUFDLFdBQXJDLENBQWlELFNBQUMsSUFBRDtxQkFDL0MsTUFBTSxDQUFDLE1BQVAsQ0FBQTtZQUQrQyxDQUFqRDttQkFFQSxLQUFBLENBQU0sTUFBTSxDQUFDLFlBQWIsRUFBMkIsbUNBQTNCLENBQStELENBQUMsV0FBaEUsQ0FBNEUsU0FBQTtxQkFBRztZQUFILENBQTVFO1VBTlMsQ0FBWDtVQVFBLEVBQUEsQ0FBRyxpREFBSCxFQUFzRCxTQUFBO1lBQ3BELE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1lBRUEsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixrQkFBOUI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7WUFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsS0FBN0Q7bUJBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdEO1VBVG9ELENBQXREO1VBV0EsRUFBQSxDQUFHLGVBQUgsRUFBb0IsU0FBQTtZQUNsQixPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEI7WUFDQSxPQUFBLENBQVEsUUFBUjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixxQkFBOUI7WUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtZQUNBLE9BQUEsQ0FBUSxHQUFSO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qix1QkFBOUI7VUFSa0IsQ0FBcEI7aUJBVUEsRUFBQSxDQUFHLGFBQUgsRUFBa0IsU0FBQTtZQUNoQixPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEI7WUFDQSxPQUFBLENBQVEsUUFBUjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixxQkFBOUI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qix1QkFBOUI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FBUCxDQUFnQyxDQUFDLElBQWpDLENBQXNDLEVBQXRDO1VBUmdCLENBQWxCO1FBOUIwQixDQUE1QjtRQXdDQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQTtpQkFDOUMsRUFBQSxDQUFHLG9FQUFILEVBQXlFLFNBQUE7WUFDdkUsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFFQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtCQUE5QjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtZQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxLQUE3RDttQkFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0Q7VUFUdUUsQ0FBekU7UUFEOEMsQ0FBaEQ7ZUFZQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQTtpQkFDOUMsRUFBQSxDQUFHLG1EQUFILEVBQXdELFNBQUE7WUFDdEQsTUFBTSxDQUFDLE9BQVAsQ0FBZSxPQUFmO1lBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFFQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLEVBQTlCO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1lBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELEtBQTdEO21CQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RDtVQVZzRCxDQUF4RDtRQUQ4QyxDQUFoRDtNQXJEK0IsQ0FBakM7TUFrRUEsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUE7ZUFDL0IsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUE7VUFDakMsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7VUFFQSxPQUFBLENBQVEsR0FBUjtVQUNBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZ0JBQTlCO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1VBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdEO1VBR0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxrQkFBZjtVQUNBLE9BQUEsQ0FBUSxRQUFSO1VBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdEO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtCQUE5QjtVQUVBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHFCQUE5QjtVQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7WUFBQSxJQUFBLEVBQU0sSUFBTjtXQUFiO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixrQkFBOUI7UUFuQmlDLENBQW5DO01BRCtCLENBQWpDO01Bc0JBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO2VBQy9CLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBO1VBQ3JCLE1BQU0sQ0FBQyxPQUFQLENBQWUsbUJBQWY7VUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksU0FBUyxDQUFDLE1BQWQsQ0FBL0I7VUFFQSxPQUFBLENBQVEsR0FBUjtVQUNBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLFFBQVI7aUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGVBQTlCO1FBUnFCLENBQXZCO01BRCtCLENBQWpDO01BV0EsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUE7UUFDL0IsVUFBQSxDQUFXLFNBQUE7QUFDVCxjQUFBO1VBQUEsWUFBQSxHQUFlO2lCQUNmLE1BQU0sQ0FBQyxPQUFQLENBQWUsWUFBZjtRQUZTLENBQVg7UUFJQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQTtpQkFDOUMsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUE7WUFDakMsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7Y0FBQSxLQUFBLEVBQU8sSUFBUDthQUFiO1lBQ0EsT0FBQSxDQUFRLFFBQVI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFdBQTlCO1VBTGlDLENBQW5DO1FBRDhDLENBQWhEO2VBUUEsUUFBQSxDQUFTLGtDQUFULEVBQTZDLFNBQUE7aUJBQzNDLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBO1lBQ2pDLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO2NBQUEsS0FBQSxFQUFPLElBQVA7YUFBYjtZQUNBLE9BQUEsQ0FBUSxRQUFSO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixXQUE5QjtVQUxpQyxDQUFuQztRQUQyQyxDQUE3QztNQWIrQixDQUFqQztNQXFCQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQTtRQUMvQixVQUFBLENBQVcsU0FBQTtpQkFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLDhCQUFmO1FBRFMsQ0FBWDtRQUdBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBO1VBQzlDLFVBQUEsQ0FBVyxTQUFBO1lBQ1QsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFDQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQztZQUNBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjttQkFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQjtVQU5TLENBQVg7VUFRQSxFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQTtZQUNoRCxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsa0JBQTlCO21CQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsSUFBaEIsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixRQUEzQjtVQUZnRCxDQUFsRDtpQkFJQSxFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQTtZQUM1QixPQUFBLENBQVEsUUFBUjtZQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsSUFBaEIsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixRQUEzQjtZQUNBLE9BQUEsQ0FBUSxHQUFSO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qiw4QkFBOUI7VUFKNEIsQ0FBOUI7UUFiOEMsQ0FBaEQ7UUFtQkEsUUFBQSxDQUFTLHNDQUFULEVBQWlELFNBQUE7aUJBQy9DLEVBQUEsQ0FBRyx1REFBSCxFQUE0RCxTQUFBO1lBQzFELE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1lBQ0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakM7WUFDQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQztZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QiwwQkFBOUI7bUJBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxJQUFoQixDQUFxQixDQUFDLElBQXRCLENBQTJCLFFBQTNCO1VBUjBELENBQTVEO1FBRCtDLENBQWpEO1FBV0EsUUFBQSxDQUFTLDJCQUFULEVBQXNDLFNBQUE7aUJBQ3BDLEVBQUEsQ0FBRyxpQkFBSCxFQUFzQixTQUFBO1lBQ3BCLE1BQU0sQ0FBQyxPQUFQLENBQWUsNEJBQWY7WUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtZQUNBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qiw0QkFBOUI7bUJBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxJQUFoQixDQUFxQixDQUFDLElBQXRCLENBQTJCLFFBQTNCO1VBUG9CLENBQXRCO1FBRG9DLENBQXRDO2VBVUEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUE7VUFDNUIsVUFBQSxDQUFXLFNBQUE7WUFDVCxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQjttQkFDQSxPQUFBLENBQVEsUUFBUjtVQUxTLENBQVg7VUFPQSxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQTtZQUN2QyxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtCQUE5QjttQkFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLElBQWhCLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsUUFBM0I7VUFKdUMsQ0FBekM7VUFNQSxFQUFBLENBQUcsMENBQUgsRUFBK0MsU0FBQTtZQUM3QyxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHFCQUE5QjttQkFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLElBQWhCLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsUUFBM0I7VUFKNkMsQ0FBL0M7VUFNQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQTtZQUN0QyxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHNCQUE5QjttQkFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLElBQWhCLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsUUFBM0I7VUFKc0MsQ0FBeEM7VUFNQSxFQUFBLENBQUcsMENBQUgsRUFBK0MsU0FBQTtZQUM3QyxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHFCQUE5QjttQkFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLElBQWhCLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsUUFBM0I7VUFKNkMsQ0FBL0M7aUJBTUEsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUE7WUFDL0MsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qix1QkFBOUI7bUJBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxJQUFoQixDQUFxQixDQUFDLElBQXRCLENBQTJCLFFBQTNCO1VBSitDLENBQWpEO1FBaEM0QixDQUE5QjtNQTVDK0IsQ0FBakM7TUFrRkEsUUFBQSxDQUFTLGdDQUFULEVBQTJDLFNBQUE7UUFDekMsVUFBQSxDQUFXLFNBQUE7aUJBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSxxQkFBZjtRQURTLENBQVg7UUFHQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQTtpQkFDOUMsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUE7WUFDckMsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtjQUFBLEtBQUEsRUFBTyxJQUFQO2FBQWI7WUFDQSxPQUFBLENBQVEsUUFBUjttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZ0JBQTlCO1VBTnFDLENBQXZDO1FBRDhDLENBQWhEO2VBU0EsUUFBQSxDQUFTLGtDQUFULEVBQTZDLFNBQUE7aUJBQzNDLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBO1lBQ3JDLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7Y0FBQSxLQUFBLEVBQU8sSUFBUDthQUFiO1lBQ0EsT0FBQSxDQUFRLFFBQVI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGdCQUE5QjtVQU5xQyxDQUF2QztRQUQyQyxDQUE3QztNQWJ5QyxDQUEzQzthQXNCQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQTtRQUN6QixVQUFBLENBQVcsU0FBQTtVQUNULE1BQU0sQ0FBQyxPQUFQLENBQWUsd0NBQWY7aUJBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFGUyxDQUFYO1FBSUEsUUFBQSxDQUFTLCtDQUFULEVBQTBELFNBQUE7VUFDeEQsRUFBQSxDQUFHLGdCQUFILEVBQXFCLFNBQUE7WUFDbkIsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFsQjtZQUNBLE9BQUEsQ0FBUSxRQUFSO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHVDQUE5QjtZQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1lBQ0EsT0FBQSxDQUFRLEdBQVI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHNDQUE5QjtVQVhtQixDQUFyQjtVQWFBLEVBQUEsQ0FBRyxtREFBSCxFQUF3RCxTQUFBO1lBQ3RELE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFsQjtZQUNBLE9BQUEsQ0FBUSxRQUFSO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHFDQUE5QjtZQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1lBQ0EsT0FBQSxDQUFRLEdBQVI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHFDQUE5QjtVQVpzRCxDQUF4RDtpQkFjQSxFQUFBLENBQUcsb0dBQUgsRUFBeUcsU0FBQTtZQUN2RyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLEVBQWdELElBQWhEO1lBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQWxCO1lBQ0EsT0FBQSxDQUFRLFFBQVI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIscUNBQTlCO1lBRUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFDQSxPQUFBLENBQVEsR0FBUjttQkFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIscUNBQTlCO1VBZHVHLENBQXpHO1FBNUJ3RCxDQUExRDtRQTRDQSxRQUFBLENBQVMsZ0VBQVQsRUFBMkUsU0FBQTtVQUN6RSxFQUFBLENBQUcsZ0JBQUgsRUFBcUIsU0FBQTtZQUNuQixPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEI7WUFDQSxPQUFBLENBQVEsUUFBUjtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qiw4QkFBOUI7WUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtZQUNBLE9BQUEsQ0FBUSxHQUFSO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixnQkFBOUI7VUFabUIsQ0FBckI7aUJBY0EsRUFBQSxDQUFHLG1EQUFILEVBQXdELFNBQUE7WUFFdEQsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCO1lBQ0EsT0FBQSxDQUFRLFFBQVI7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsMkJBQTlCO1lBRUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFDQSxPQUFBLENBQVEsR0FBUjttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsWUFBOUI7VUFic0QsQ0FBeEQ7UUFmeUUsQ0FBM0U7UUE4QkEsUUFBQSxDQUFTLHVDQUFULEVBQWtELFNBQUE7VUFDaEQsUUFBQSxDQUFTLHdCQUFULEVBQW1DLFNBQUE7bUJBQ2pDLEVBQUEsQ0FBRyxnQkFBSCxFQUFxQixTQUFBO2NBQ25CLE9BQUEsQ0FBUSxHQUFSLEVBQWE7Z0JBQUEsS0FBQSxFQUFPLElBQVA7ZUFBYjtjQUNBLE9BQUEsQ0FBUSxHQUFSO2NBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEI7Y0FDQSxPQUFBLENBQVEsUUFBUjtjQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixvQ0FBOUI7Y0FFQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtjQUNBLE9BQUEsQ0FBUSxHQUFSO2NBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDRCQUE5QjtjQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO2NBQ0EsT0FBQSxDQUFRLEdBQVI7cUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlCQUE5QjtZQWJtQixDQUFyQjtVQURpQyxDQUFuQztpQkFnQkEsUUFBQSxDQUFTLDhCQUFULEVBQXlDLFNBQUE7WUFDdkMsRUFBQSxDQUFHLGdCQUFILEVBQXFCLFNBQUE7Y0FDbkIsT0FBQSxDQUFRLEdBQVIsRUFBYTtnQkFBQSxLQUFBLEVBQU8sSUFBUDtlQUFiO2NBQ0EsT0FBQSxDQUFRLEdBQVI7Y0FDQSxPQUFBLENBQVEsR0FBUjtjQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCO2NBQ0EsT0FBQSxDQUFRLFFBQVI7Y0FDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsc0JBQTlCO2NBRUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7Y0FDQSxPQUFBLENBQVEsR0FBUjtxQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUI7WUFWbUIsQ0FBckI7bUJBWUEsRUFBQSxDQUFHLG1EQUFILEVBQXdELFNBQUE7Y0FDdEQsT0FBQSxDQUFRLEdBQVIsRUFBYTtnQkFBQSxLQUFBLEVBQU8sSUFBUDtlQUFiO2NBQ0EsT0FBQSxDQUFRLEdBQVI7Y0FDQSxPQUFBLENBQVEsR0FBUjtjQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCO2NBQ0EsT0FBQSxDQUFRLFFBQVI7Y0FDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsc0JBQTlCO2NBRUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7Y0FDQSxPQUFBLENBQVEsR0FBUjtxQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZ0JBQTlCO1lBVnNELENBQXhEO1VBYnVDLENBQXpDO1FBakJnRCxDQUFsRDtlQTBDQSxTQUFBLENBQVUsb0NBQVYsRUFBZ0QsU0FBQSxHQUFBLENBQWhEO01Bekh5QixDQUEzQjtJQXBPMkIsQ0FBN0I7SUFnV0EsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7TUFDM0IsVUFBQSxDQUFXLFNBQUE7UUFDVCxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsT0FBM0I7UUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtlQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7VUFBQSxLQUFBLEVBQU8sSUFBUDtTQUFiO01BSFMsQ0FBWDthQUtBLEVBQUEsQ0FBRyx1RUFBSCxFQUE0RSxTQUFBO1FBQzFFLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixLQUE5QjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtRQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxLQUE3RDtlQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RDtNQUowRSxDQUE1RTtJQU4yQixDQUE3QjtJQVlBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBO01BQzNCLFVBQUEsQ0FBVyxTQUFBO1FBQ1QsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQTJCLHNCQUEzQjtRQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO2VBQ0EsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsRUFBMEI7VUFBQSxJQUFBLEVBQU0sS0FBTjtTQUExQjtNQUhTLENBQVg7TUFLQSxRQUFBLENBQVMsNkNBQVQsRUFBd0QsU0FBQTtRQUN0RCxVQUFBLENBQVcsU0FBQTtVQUNULE9BQUEsQ0FBUSxHQUFSLEVBQWE7WUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiO1VBQ0EsT0FBQSxDQUFRLEdBQVI7aUJBQ0EsT0FBQSxDQUFRLEdBQVI7UUFIUyxDQUFYO1FBS0EsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUE7aUJBQzFCLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsT0FBdkMsQ0FBK0MsVUFBL0M7UUFEMEIsQ0FBNUI7UUFHQSxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQTtpQkFDNUMsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxnQkFBNUM7UUFENEMsQ0FBOUM7ZUFHQSxFQUFBLENBQUcscURBQUgsRUFBMEQsU0FBQTtpQkFDeEQsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxDQUFsRDtRQUR3RCxDQUExRDtNQVpzRCxDQUF4RDtNQWVBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBO1FBQ3ZDLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsT0FBQSxDQUFRLEdBQVI7aUJBQ0EsT0FBQSxDQUFRLEdBQVI7UUFGUyxDQUFYO1FBSUEsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUE7aUJBQzNDLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsV0FBNUM7UUFEMkMsQ0FBN0M7ZUFHQSxFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQTtpQkFDL0MsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1FBRCtDLENBQWpEO01BUnVDLENBQXpDO01BV0EsUUFBQSxDQUFTLDRDQUFULEVBQXVELFNBQUE7ZUFDckQsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUE7VUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdDQUFoQixFQUEwRCxJQUExRDtVQUNBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVI7aUJBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLENBQVAsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxXQUFuQztRQUp3QixDQUExQjtNQURxRCxDQUF2RDtNQU9BLFFBQUEsQ0FBUyxpQ0FBVCxFQUE0QyxTQUFBO1FBQzFDLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsT0FBQSxDQUFRLEdBQVI7VUFDQSxPQUFBLENBQVEsR0FBUjtpQkFDQSxPQUFBLENBQVEsR0FBUjtRQUhTLENBQVg7UUFLQSxFQUFBLENBQUcsMkNBQUgsRUFBZ0QsU0FBQTtpQkFDOUMsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxnQkFBNUM7UUFEOEMsQ0FBaEQ7ZUFHQSxFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQTtpQkFDL0MsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1FBRCtDLENBQWpEO01BVDBDLENBQTVDO01BWUEsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUE7UUFDMUIsVUFBQSxDQUFXLFNBQUE7VUFDVCxPQUFBLENBQVEsR0FBUjtVQUNBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVI7aUJBQ0EsT0FBQSxDQUFRLEdBQVI7UUFKUyxDQUFYO1FBTUEsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUE7aUJBQ3JDLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsV0FBNUM7UUFEcUMsQ0FBdkM7ZUFHQSxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQTtVQUN2QyxPQUFBLENBQVEsR0FBUjtVQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7WUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFDQSxPQUFBLENBQVEsR0FBUjtpQkFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLG9CQUE1QztRQUx1QyxDQUF6QztNQVYwQixDQUE1QjtNQWlCQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQTtRQUNoQyxVQUFBLENBQVcsU0FBQTtVQUNULE9BQUEsQ0FBUSxHQUFSO2lCQUNBLE9BQUEsQ0FBUSxHQUFSO1FBRlMsQ0FBWDtRQUlBLEVBQUEsQ0FBRyxpREFBSCxFQUFzRCxTQUFBO2lCQUNwRCxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEtBQTVDO1FBRG9ELENBQXREO1FBR0EsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUE7aUJBQy9DLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtRQUQrQyxDQUFqRDtlQUdBLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBO1VBQ3BDLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFDQSxzQkFBQSxDQUF1QixHQUF2QjtpQkFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEtBQTVDO1FBSm9DLENBQXRDO01BWGdDLENBQWxDO01BaUJBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBO2VBQzdCLEVBQUEsQ0FBRyxzREFBSCxFQUEyRCxTQUFBO1VBQ3pELE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFDQSxPQUFBLENBQVEsR0FBUjtVQUNBLE9BQUEsQ0FBUSxHQUFSO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsd0JBQVAsQ0FBQSxDQUFQLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsQ0FBbEQ7UUFMeUQsQ0FBM0Q7TUFENkIsQ0FBL0I7TUFRQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQTtRQUM3QixVQUFBLENBQVcsU0FBQTtVQUNULE9BQUEsQ0FBUSxHQUFSO2lCQUNBLE9BQUEsQ0FBUSxHQUFSO1FBRlMsQ0FBWDtRQUlBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBO2lCQUNsRCxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEdBQTVDO1FBRGtELENBQXBEO2VBR0EsRUFBQSxDQUFHLHVDQUFILEVBQTRDLFNBQUE7aUJBQzFDLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtRQUQwQyxDQUE1QztNQVI2QixDQUEvQjtNQVdBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBO1FBQzdCLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsT0FBQSxDQUFRLEdBQVI7aUJBQ0EsT0FBQSxDQUFRLEdBQVI7UUFGUyxDQUFYO1FBSUEsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUE7aUJBQ2xELE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsZ0JBQTVDO1FBRGtELENBQXBEO2VBR0EsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUE7aUJBQy9DLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtRQUQrQyxDQUFqRDtNQVI2QixDQUEvQjtNQVdBLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBO1FBQzVCLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7VUFDQSxPQUFBLENBQVEsR0FBUjtpQkFDQSxPQUFBLENBQVEsR0FBUjtRQUhTLENBQVg7UUFLQSxFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQTtpQkFDbEQsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxhQUE1QztRQURrRCxDQUFwRDtlQUdBLEVBQUEsQ0FBRywyREFBSCxFQUFnRSxTQUFBO2lCQUM5RCxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7UUFEOEQsQ0FBaEU7TUFUNEIsQ0FBOUI7TUFZQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQTtRQUMvQixVQUFBLENBQVcsU0FBQTtBQUNULGNBQUE7VUFBQSxZQUFBLEdBQWU7aUJBQ2YsTUFBTSxDQUFDLE9BQVAsQ0FBZSxZQUFmO1FBRlMsQ0FBWDtRQUlBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBO2lCQUM5QyxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQTtZQUNqQyxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtjQUFBLEtBQUEsRUFBTyxJQUFQO2FBQWI7WUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO2NBQUEsS0FBQSxFQUFPLElBQVA7YUFBYjttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsbUNBQTlCO1VBTGlDLENBQW5DO1FBRDhDLENBQWhEO2VBUUEsUUFBQSxDQUFTLGtDQUFULEVBQTZDLFNBQUE7aUJBQzNDLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBO1lBQ2pDLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO2NBQUEsS0FBQSxFQUFPLElBQVA7YUFBYjtZQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7Y0FBQSxLQUFBLEVBQU8sSUFBUDthQUFiO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQ0FBOUI7VUFMaUMsQ0FBbkM7UUFEMkMsQ0FBN0M7TUFiK0IsQ0FBakM7TUFxQkEsUUFBQSxDQUFTLGdDQUFULEVBQTJDLFNBQUE7UUFDekMsVUFBQSxDQUFXLFNBQUE7QUFDVCxjQUFBO1VBQUEsWUFBQSxHQUFlO2lCQUNmLE1BQU0sQ0FBQyxPQUFQLENBQWUsWUFBZjtRQUZTLENBQVg7UUFJQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQTtpQkFDOUMsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUE7WUFDakMsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtjQUFBLEtBQUEsRUFBTyxJQUFQO2FBQWI7WUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO2NBQUEsS0FBQSxFQUFPLElBQVA7YUFBYjttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsNEJBQTlCO1VBTmlDLENBQW5DO1FBRDhDLENBQWhEO2VBU0EsUUFBQSxDQUFTLGtDQUFULEVBQTZDLFNBQUE7aUJBQzNDLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBO1lBQ2pDLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7Y0FBQSxLQUFBLEVBQU8sSUFBUDthQUFiO1lBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtjQUFBLEtBQUEsRUFBTyxJQUFQO2FBQWI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDRCQUE5QjtVQU5pQyxDQUFuQztRQUQyQyxDQUE3QztNQWR5QyxDQUEzQztNQXVCQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQTtlQUNoQyxFQUFBLENBQUcsd0RBQUgsRUFBNkQsU0FBQTtVQUMzRCxNQUFNLENBQUMsT0FBUCxDQUFlLGdCQUFmO1VBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7VUFDQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQztVQUVBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFFQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEtBQTVDO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsd0JBQVAsQ0FBQSxDQUFQLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsQ0FBbEQ7UUFUMkQsQ0FBN0Q7TUFEZ0MsQ0FBbEM7YUFZQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQTtRQUN6QixVQUFBLENBQVcsU0FBQTtBQUNULGNBQUE7VUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixhQUFwQjtVQUNBLGFBQWEsQ0FBQyxTQUFkLENBQXdCLEdBQXhCO1VBQ0EsYUFBYSxDQUFDLEtBQUssQ0FBQyxVQUFwQixHQUFpQztVQUNqQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQXBCLEdBQTJCO1VBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQVgsQ0FBQTtVQUVBLElBQUEsR0FBTztBQUNQLGVBQVMsNEJBQVQ7WUFDRSxJQUFBLElBQVcsQ0FBRCxHQUFHO0FBRGY7aUJBRUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxJQUFmO1FBVlMsQ0FBWDtRQVlBLFFBQUEsQ0FBUyw0QkFBVCxFQUF1QyxTQUFBO2lCQUNyQyxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQTtBQUMvQixnQkFBQTtZQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQS9CO1lBQ0EsaUJBQUEsR0FBb0IsYUFBYSxDQUFDLFlBQWQsQ0FBQTtZQUdwQixPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7Y0FBQSxLQUFBLEVBQU8sSUFBUDthQUFiO1lBRUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxZQUFkLENBQUEsQ0FBUCxDQUFvQyxDQUFDLE9BQXJDLENBQTZDLGlCQUE3QztZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFqRDttQkFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFJLENBQUMsS0FBL0IsQ0FBcUMsSUFBckMsQ0FBMEMsQ0FBQyxNQUFsRCxDQUF5RCxDQUFDLElBQTFELENBQStELEdBQS9EO1VBYitCLENBQWpDO1FBRHFDLENBQXZDO2VBZ0JBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBO2lCQUN2QyxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQTtBQUN2QixnQkFBQTtZQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLEdBQUQsRUFBTSxDQUFOLENBQS9CO1lBQ0EsaUJBQUEsR0FBb0IsYUFBYSxDQUFDLFlBQWQsQ0FBQTtZQUdwQixPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO2NBQUEsS0FBQSxFQUFPLElBQVA7YUFBYjtZQUVBLE1BQUEsQ0FBTyxhQUFhLENBQUMsWUFBZCxDQUFBLENBQVAsQ0FBb0MsQ0FBQyxVQUFyQyxDQUFnRCxpQkFBaEQ7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBakQ7bUJBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBSSxDQUFDLEtBQS9CLENBQXFDLElBQXJDLENBQTBDLENBQUMsTUFBbEQsQ0FBeUQsQ0FBQyxJQUExRCxDQUErRCxFQUEvRDtVQVp1QixDQUF6QjtRQUR1QyxDQUF6QztNQTdCeUIsQ0FBM0I7SUF2TDJCLENBQTdCO0lBbU9BLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBO01BQzVCLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBO1FBQ2hDLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQTJCLGdCQUEzQjtpQkFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtRQUZTLENBQVg7ZUFJQSxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQTtVQUNuRCxPQUFBLENBQVEsR0FBUjtVQUNBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFFQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLGdCQUE1QztpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsOEJBQTlCO1FBTm1ELENBQXJEO01BTGdDLENBQWxDO2FBYUEsUUFBQSxDQUFTLHVDQUFULEVBQWtELFNBQUE7UUFDaEQsVUFBQSxDQUFXLFNBQUE7VUFDVCxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsYUFBM0I7aUJBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFGUyxDQUFYO1FBSUEsRUFBQSxDQUFHLGdEQUFILEVBQXFELFNBQUE7VUFDbkQsT0FBQSxDQUFRLEdBQVI7VUFDQSxPQUFBLENBQVEsR0FBUjtVQUNBLE9BQUEsQ0FBUSxHQUFSO1VBRUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxlQUE1QztpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsMEJBQTlCO1FBTm1ELENBQXJEO2VBUUEsRUFBQSxDQUFHLHFFQUFILEVBQTBFLFNBQUE7VUFDeEUsT0FBQSxDQUFRLEdBQVI7VUFDQSxPQUFBLENBQVEsR0FBUjtVQUNBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFFQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLGVBQTVDO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qix1Q0FBOUI7UUFQd0UsQ0FBMUU7TUFiZ0QsQ0FBbEQ7SUFkNEIsQ0FBOUI7SUFvQ0EsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7TUFDM0IsVUFBQSxDQUFXLFNBQUE7UUFDVCxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsZ0JBQTNCO2VBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7TUFGUyxDQUFYO2FBSUEsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUE7UUFDM0MsT0FBQSxDQUFRLEdBQVIsRUFBYTtVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWI7UUFFQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLFdBQTVDO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO01BSjJDLENBQTdDO0lBTDJCLENBQTdCO0lBV0EsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7TUFDM0IsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUE7UUFDbEMsVUFBQSxDQUFXLFNBQUE7VUFDVCxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsT0FBM0I7VUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtVQUNBLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLEVBQTBCO1lBQUEsSUFBQSxFQUFNLEtBQU47V0FBMUI7VUFDQSxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixFQUEwQjtZQUFBLElBQUEsRUFBTSxHQUFOO1dBQTFCO2lCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBZixDQUFxQixNQUFyQjtRQUxTLENBQVg7UUFPQSxRQUFBLENBQVMsMkJBQVQsRUFBc0MsU0FBQTtVQUNwQyxVQUFBLENBQVcsU0FBQTttQkFBRyxPQUFBLENBQVEsR0FBUjtVQUFILENBQVg7aUJBRUEsRUFBQSxDQUFHLHNCQUFILEVBQTJCLFNBQUE7WUFDekIsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFVBQTlCO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtVQUZ5QixDQUEzQjtRQUhvQyxDQUF0QztRQU9BLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO1VBQy9CLFVBQUEsQ0FBVyxTQUFBO1lBQ1QsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7bUJBQ0EsT0FBQSxDQUFRLEdBQVI7VUFGUyxDQUFYO2lCQUlBLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBO1lBQy9CLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QjttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7VUFGK0IsQ0FBakM7UUFMK0IsQ0FBakM7UUFTQSxRQUFBLENBQVMsNENBQVQsRUFBdUQsU0FBQTtpQkFDckQsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUE7WUFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdDQUFoQixFQUEwRCxJQUExRDtZQUNBLE9BQUEsQ0FBUSxHQUFSO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixXQUE5QjtVQUhvQyxDQUF0QztRQURxRCxDQUF2RDtRQU1BLFFBQUEsQ0FBUywyQkFBVCxFQUFzQyxTQUFBO1VBQ3BDLFVBQUEsQ0FBVyxTQUFBO1lBQ1QsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjttQkFDQSxPQUFBLENBQVEsR0FBUjtVQUhTLENBQVg7aUJBS0EsRUFBQSxDQUFHLDBDQUFILEVBQStDLFNBQUE7WUFDN0MsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFFBQTlCO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtVQUY2QyxDQUEvQztRQU5vQyxDQUF0QztRQVVBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO2lCQUMvQixFQUFBLENBQUcsMkNBQUgsRUFBZ0QsU0FBQTtZQUM5QyxNQUFNLENBQUMsT0FBUCxDQUFlLHNCQUFmO1lBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFFQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUNBLE9BQUEsQ0FBUSxHQUFSO21CQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixzQkFBOUI7VUFWOEMsQ0FBaEQ7UUFEK0IsQ0FBakM7ZUFhQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQTtVQUMzQixVQUFBLENBQVcsU0FBQTtZQUNULE1BQU0sQ0FBQyxXQUFQLENBQUE7bUJBQ0EsT0FBQSxDQUFRLEdBQVI7VUFGUyxDQUFYO2lCQUlBLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBO1lBQ25DLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QjttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7VUFGbUMsQ0FBckM7UUFMMkIsQ0FBN0I7TUFyRGtDLENBQXBDO01BOERBLFFBQUEsQ0FBUyx3QkFBVCxFQUFtQyxTQUFBO1FBQ2pDLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBO1VBQzNCLFVBQUEsQ0FBVyxTQUFBO1lBQ1QsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQTJCLEtBQTNCO1lBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7bUJBQ0EsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsRUFBMEI7Y0FBQSxJQUFBLEVBQU0sUUFBTjtjQUFnQixJQUFBLEVBQU0sVUFBdEI7YUFBMUI7VUFIUyxDQUFYO1VBS0EsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUE7WUFDakQsT0FBQSxDQUFRLEdBQVI7WUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1VBSmlELENBQW5EO2lCQU1BLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBO1lBQ25DLE1BQU0sQ0FBQyxXQUFQLENBQUE7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QjttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7VUFMbUMsQ0FBckM7UUFaMkIsQ0FBN0I7ZUFtQkEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUE7VUFDNUIsVUFBQSxDQUFXLFNBQUE7WUFDVCxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsV0FBM0I7bUJBQ0EsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsRUFBMEI7Y0FBQSxJQUFBLEVBQU0sUUFBTjtjQUFnQixJQUFBLEVBQU0sVUFBdEI7YUFBMUI7VUFGUyxDQUFYO1VBSUEsRUFBQSxDQUFHLDZEQUFILEVBQWtFLFNBQUE7WUFDaEUsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFDQSxPQUFBLENBQVEsR0FBUjtZQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixpQkFBOUI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1VBTGdFLENBQWxFO2lCQU9BLEVBQUEsQ0FBRyw2REFBSCxFQUFrRSxTQUFBO1lBQ2hFLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1lBQ0EsT0FBQSxDQUFRLEdBQVI7WUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsaUJBQTlCO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtVQUxnRSxDQUFsRTtRQVo0QixDQUE5QjtNQXBCaUMsQ0FBbkM7TUF1Q0EsUUFBQSxDQUFTLGlDQUFULEVBQTRDLFNBQUE7UUFDMUMsVUFBQSxDQUFXLFNBQUE7VUFDVCxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsVUFBM0I7VUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtVQUNBLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLEVBQTBCO1lBQUEsSUFBQSxFQUFNLGNBQU47WUFBc0IsSUFBQSxFQUFNLFVBQTVCO1dBQTFCO2lCQUNBLE9BQUEsQ0FBUSxHQUFSO1FBSlMsQ0FBWDtlQU1BLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBO1VBQ2pELE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixzQkFBOUI7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1FBRmlELENBQW5EO01BUDBDLENBQTVDO2FBV0EsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQTtRQUN4QixVQUFBLENBQVcsU0FBQTtVQUNULE1BQU0sQ0FBQyxPQUFQLENBQWUsNEJBQWY7VUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtVQUNBLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLEVBQTBCO1lBQUEsSUFBQSxFQUFNLEtBQU47V0FBMUI7VUFDQSxPQUFBLENBQVEsR0FBUjtpQkFDQSxPQUFBLENBQVEsR0FBUjtRQUxTLENBQVg7UUFPQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQTtpQkFDaEMsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtDQUE5QjtRQURnQyxDQUFsQztlQUdBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUE7VUFDdEIsVUFBQSxDQUFXLFNBQUE7bUJBQ1QsT0FBQSxDQUFRLEdBQVI7VUFEUyxDQUFYO2lCQUdBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBO21CQUN2QixNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsNEJBQTlCO1VBRHVCLENBQXpCO1FBSnNCLENBQXhCO01BWHdCLENBQTFCO0lBakgyQixDQUE3QjtJQW1JQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQTthQUMzQixRQUFBLENBQVMseUJBQVQsRUFBb0MsU0FBQTtRQUNsQyxVQUFBLENBQVcsU0FBQTtVQUNULE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixPQUEzQjtVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1VBQ0EsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsRUFBMEI7WUFBQSxJQUFBLEVBQU0sS0FBTjtXQUExQjtVQUNBLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLEVBQTBCO1lBQUEsSUFBQSxFQUFNLEdBQU47V0FBMUI7aUJBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtZQUFBLEtBQUEsRUFBTyxJQUFQO1dBQWI7UUFMUyxDQUFYO2VBT0EsRUFBQSxDQUFHLG9EQUFILEVBQXlELFNBQUE7VUFDdkQsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFVBQTlCO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtRQUZ1RCxDQUF6RDtNQVJrQyxDQUFwQztJQUQyQixDQUE3QjtJQWFBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBO01BQzNCLFVBQUEsQ0FBVyxTQUFBO1FBQ1QsS0FBQSxDQUFNLE1BQU4sRUFBYyxrQkFBZCxDQUFpQyxDQUFDLFNBQWxDLENBQTRDLElBQTVDO1FBQ0EsS0FBQSxDQUFNLE1BQU4sRUFBYyxxQkFBZCxDQUFvQyxDQUFDLFdBQXJDLENBQWlELFNBQUMsSUFBRDtpQkFDL0MsTUFBTSxDQUFDLE1BQVAsQ0FBQTtRQUQrQyxDQUFqRDtRQUdBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixnQkFBM0I7ZUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtNQU5TLENBQVg7TUFRQSxFQUFBLENBQUcsNkRBQUgsRUFBa0UsU0FBQTtRQUNoRSxPQUFBLENBQVEsR0FBUixFQUFhO1VBQUEsS0FBQSxFQUFPLElBQVA7U0FBYjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixvQkFBOUI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7ZUFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0Q7TUFKZ0UsQ0FBbEU7TUFNQSxFQUFBLENBQUcsZUFBSCxFQUFvQixTQUFBO1FBQ2xCLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQiw2QkFBM0I7UUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtRQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7VUFBQSxLQUFBLEVBQU8sSUFBUDtTQUFiO1FBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEI7UUFDQSxPQUFBLENBQVEsUUFBUjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixvQ0FBOUI7UUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtRQUNBLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDJDQUE5QjtRQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1FBQ0EsT0FBQSxDQUFRLEdBQVI7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsb0RBQTlCO01BWmtCLENBQXBCO2FBY0EsRUFBQSxDQUFHLGFBQUgsRUFBa0IsU0FBQTtRQUNoQixPQUFBLENBQVEsR0FBUixFQUFhO1VBQUEsS0FBQSxFQUFPLElBQVA7U0FBYjtRQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCO1FBQ0EsT0FBQSxDQUFRLFFBQVI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsdUJBQTlCO1FBQ0EsT0FBQSxDQUFRLEdBQVI7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZ0JBQTlCO01BTmdCLENBQWxCO0lBN0IyQixDQUE3QjtJQXFDQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQTtNQUMzQixVQUFBLENBQVcsU0FBQTtRQUNULEtBQUEsQ0FBTSxNQUFOLEVBQWMsa0JBQWQsQ0FBaUMsQ0FBQyxTQUFsQyxDQUE0QyxJQUE1QztRQUNBLEtBQUEsQ0FBTSxNQUFOLEVBQWMscUJBQWQsQ0FBb0MsQ0FBQyxXQUFyQyxDQUFpRCxTQUFDLElBQUQ7aUJBQy9DLE1BQU0sQ0FBQyxNQUFQLENBQUE7UUFEK0MsQ0FBakQ7UUFHQSxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsY0FBM0I7ZUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtNQU5TLENBQVg7TUFRQSxFQUFBLENBQUcsNkRBQUgsRUFBa0UsU0FBQTtRQUNoRSxPQUFBLENBQVEsR0FBUjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixrQkFBOUI7UUFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0Q7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7TUFKZ0UsQ0FBbEU7TUFTQSxHQUFBLENBQUksZUFBSixFQUFxQixTQUFBO1FBQ25CLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQiw2QkFBM0I7UUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtRQUNBLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEI7UUFDQSxPQUFBLENBQVEsUUFBUjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixvQ0FBOUI7UUFDQSxPQUFBLENBQVEsR0FBUjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QiwyQ0FBOUI7UUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtRQUNBLE9BQUEsQ0FBUSxHQUFSO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG9EQUE5QjtNQVhtQixDQUFyQjthQWFBLEVBQUEsQ0FBRyxhQUFILEVBQWtCLFNBQUE7UUFDaEIsT0FBQSxDQUFRLEdBQVI7UUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQjtRQUNBLE9BQUEsQ0FBUSxRQUFSO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHFCQUE5QjtRQUNBLE9BQUEsQ0FBUSxHQUFSO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGNBQTlCO01BTmdCLENBQWxCO0lBL0IyQixDQUE3QjtJQXVDQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQTtNQUMzQixVQUFBLENBQVcsU0FBQTtlQUNULE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixPQUEzQjtNQURTLENBQVg7TUFHQSxRQUFBLENBQVMsOEJBQVQsRUFBeUMsU0FBQTtRQUN2QyxVQUFBLENBQVcsU0FBQTtVQUNULE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO2lCQUNBLE9BQUEsQ0FBUSxHQUFSO1FBRlMsQ0FBWDtlQUlBLEVBQUEsQ0FBRyxpREFBSCxFQUFzRCxTQUFBO1VBQ3BELE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtpQkFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0Q7UUFGb0QsQ0FBdEQ7TUFMdUMsQ0FBekM7YUFTQSxRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQTtRQUNqQyxVQUFBLENBQVcsU0FBQTtVQUNULE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO2lCQUNBLE9BQUEsQ0FBUSxHQUFSO1FBRlMsQ0FBWDtlQUlBLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBO2lCQUNyQixNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7UUFEcUIsQ0FBdkI7TUFMaUMsQ0FBbkM7SUFiMkIsQ0FBN0I7SUFxQkEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7TUFDM0IsVUFBQSxDQUFXLFNBQUE7ZUFDVCxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsVUFBM0I7TUFEUyxDQUFYO2FBR0EsUUFBQSxDQUFTLDRCQUFULEVBQXVDLFNBQUE7UUFDckMsRUFBQSxDQUFHLGdEQUFILEVBQXFELFNBQUE7VUFDbkQsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7VUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO1lBQUEsS0FBQSxFQUFPLElBQVA7V0FBYjtVQUVBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RDtpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7UUFMbUQsQ0FBckQ7ZUFPQSxFQUFBLENBQUcsaURBQUgsRUFBc0QsU0FBQTtVQUNwRCxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtVQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7WUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiO1VBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEI7VUFDQSxPQUFBLENBQVEsUUFBUjtVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZ0JBQTlCO1VBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELEtBQTdEO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtRQVZvRCxDQUF0RDtNQVJxQyxDQUF2QztJQUoyQixDQUE3QjtJQXdCQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQTtNQUMzQixVQUFBLENBQVcsU0FBQTtlQUNULE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixZQUEzQjtNQURTLENBQVg7YUFHQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQTtRQUMvQixFQUFBLENBQUcsc0RBQUgsRUFBMkQsU0FBQTtVQUN6RCxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtVQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7WUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiO1VBRUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdEO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtRQUx5RCxDQUEzRDtRQU9BLEVBQUEsQ0FBRyxrREFBSCxFQUF1RCxTQUFBO1VBQ3JELE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1VBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtZQUFBLEtBQUEsRUFBTyxJQUFQO1dBQWI7VUFFQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0Q7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1FBTHFELENBQXZEO2VBT0EsRUFBQSxDQUFHLDZEQUFILEVBQWtFLFNBQUE7VUFDaEUsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7VUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO1lBQUEsS0FBQSxFQUFPLElBQVA7V0FBYjtVQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCO1VBQ0EsT0FBQSxDQUFRLFFBQVI7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7VUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtVQUNBLE9BQUEsQ0FBUSxHQUFSO1VBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtCQUE5QjtVQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxLQUE3RDtpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7UUFYZ0UsQ0FBbEU7TUFmK0IsQ0FBakM7SUFKMkIsQ0FBN0I7SUFnQ0EsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7TUFDM0IsVUFBQSxDQUFXLFNBQUE7UUFDVCxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsZ0JBQTNCO2VBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7TUFGUyxDQUFYO01BSUEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUE7UUFDNUIsVUFBQSxDQUFXLFNBQUE7aUJBQUcsT0FBQSxDQUFRLEdBQVIsRUFBYTtZQUFBLEtBQUEsRUFBTyxJQUFQO1dBQWI7UUFBSCxDQUFYO2VBRUEsRUFBQSxDQUFHLDhEQUFILEVBQW1FLFNBQUE7aUJBQ2pFLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixXQUE5QjtRQURpRSxDQUFuRTtNQUg0QixDQUE5QjthQU1BLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBO1FBQ3pCLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSw0QkFBZjtVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1VBQ0EsT0FBQSxDQUFRLEdBQVI7aUJBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtZQUFBLEtBQUEsRUFBTyxJQUFQO1dBQWI7UUFKUyxDQUFYO2VBTUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQTtVQUN4QixVQUFBLENBQVcsU0FBQTttQkFBRyxPQUFBLENBQVEsR0FBUjtVQUFILENBQVg7aUJBRUEsRUFBQSxDQUFHLGlCQUFILEVBQXNCLFNBQUE7bUJBQ3BCLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qiw0QkFBOUI7VUFEb0IsQ0FBdEI7UUFId0IsQ0FBMUI7TUFQeUIsQ0FBM0I7SUFYMkIsQ0FBN0I7SUF3QkEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7TUFDM0IsVUFBQSxDQUFXLFNBQUE7ZUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLHFCQUFmO01BRFMsQ0FBWDtNQUdBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBO1FBQzNCLFVBQUEsQ0FBVyxTQUFBO2lCQUNULE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1FBRFMsQ0FBWDtlQUdBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO1VBQy9CLFVBQUEsQ0FBVyxTQUFBO1lBQ1QsT0FBQSxDQUFRLEdBQVI7bUJBQ0EsT0FBQSxDQUFRLEdBQVI7VUFGUyxDQUFYO2lCQUlBLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBO1lBQzdCLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qix1QkFBOUI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1VBRjZCLENBQS9CO1FBTCtCLENBQWpDO01BSjJCLENBQTdCO01BYUEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUE7UUFDNUIsVUFBQSxDQUFXLFNBQUE7aUJBQ1QsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFEUyxDQUFYO1FBR0EsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUE7VUFDL0IsVUFBQSxDQUFXLFNBQUE7WUFDVCxPQUFBLENBQVEsR0FBUjttQkFDQSxPQUFBLENBQVEsR0FBUjtVQUZTLENBQVg7aUJBSUEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUE7WUFDN0IsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHVCQUE5QjttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7VUFGNkIsQ0FBL0I7UUFMK0IsQ0FBakM7ZUFTQSxRQUFBLENBQVMsZ0NBQVQsRUFBMkMsU0FBQTtVQUN6QyxVQUFBLENBQVcsU0FBQTtZQUNULE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7bUJBQ0EsT0FBQSxDQUFRLEdBQVI7VUFIUyxDQUFYO1VBS0EsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUE7WUFDbkMsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDJCQUE5QjttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7VUFGbUMsQ0FBckM7aUJBSUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQTtZQUN4QixVQUFBLENBQVcsU0FBQTtxQkFBRyxPQUFBLENBQVEsR0FBUjtZQUFILENBQVg7bUJBRUEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUE7cUJBQzdCLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixxQkFBOUI7WUFENkIsQ0FBL0I7VUFId0IsQ0FBMUI7UUFWeUMsQ0FBM0M7TUFiNEIsQ0FBOUI7TUE2QkEsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUE7UUFDbEMsVUFBQSxDQUFXLFNBQUE7VUFDVCxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtVQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7WUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiO2lCQUNBLE9BQUEsQ0FBUSxHQUFSO1FBSFMsQ0FBWDtRQUtBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBO1VBQ3ZDLFVBQUEsQ0FBVyxTQUFBO21CQUNULE9BQUEsQ0FBUSxHQUFSO1VBRFMsQ0FBWDtVQUdBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBO1lBQ2xELE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RDtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qix5QkFBOUI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFFLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQUYsQ0FBakQ7VUFIa0QsQ0FBcEQ7aUJBS0EsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUE7WUFDbkMsT0FBQSxDQUFRLEdBQVI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDZCQUE5QjtVQUZtQyxDQUFyQztRQVR1QyxDQUF6QztlQWFBLFFBQUEsQ0FBUyxnQ0FBVCxFQUEyQyxTQUFBO1VBQ3pDLFVBQUEsQ0FBVyxTQUFBO1lBQ1QsT0FBQSxDQUFRLEdBQVI7bUJBQ0EsT0FBQSxDQUFRLEdBQVI7VUFGUyxDQUFYO2lCQUlBLEVBQUEsQ0FBRyxnREFBSCxFQUFxRCxTQUFBO1lBQ25ELE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RDtZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qiw2QkFBOUI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFFLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQUYsQ0FBakQ7VUFIbUQsQ0FBckQ7UUFMeUMsQ0FBM0M7TUFuQmtDLENBQXBDO2FBNkJBLFFBQUEsQ0FBUywwQkFBVCxFQUFxQyxTQUFBO1FBQ25DLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7VUFDQSxPQUFBLENBQVEsR0FBUjtVQUNBLE9BQUEsQ0FBUSxHQUFSO2lCQUNBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDO1FBSlMsQ0FBWDtlQU1BLEVBQUEsQ0FBRyx5Q0FBSCxFQUE4QyxTQUFBO1VBQzVDLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDJCQUE5QjtpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQWxEO1FBSDRDLENBQTlDO01BUG1DLENBQXJDO0lBM0UyQixDQUE3QjtJQXVGQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQTtNQUMzQixVQUFBLENBQVcsU0FBQTtRQUNULE1BQU0sQ0FBQyxPQUFQLENBQWUsNkJBQWY7ZUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtNQUZTLENBQVg7TUFJQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQTtRQUMvQixVQUFBLENBQVcsU0FBQTtVQUNULE9BQUEsQ0FBUSxHQUFSO2lCQUNBLE9BQUEsQ0FBUSxHQUFSO1FBRlMsQ0FBWDtlQUlBLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBO1VBQzlCLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QiwyQkFBOUI7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1FBRjhCLENBQWhDO01BTCtCLENBQWpDO01BU0EsUUFBQSxDQUFTLGdDQUFULEVBQTJDLFNBQUE7UUFDekMsVUFBQSxDQUFXLFNBQUE7VUFDVCxPQUFBLENBQVEsR0FBUjtVQUNBLE9BQUEsQ0FBUSxHQUFSO2lCQUNBLE9BQUEsQ0FBUSxHQUFSO1FBSFMsQ0FBWDtRQUtBLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBO1VBQ3BDLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qix5QkFBOUI7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO1FBRm9DLENBQXRDO2VBSUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQTtVQUN4QixVQUFBLENBQVcsU0FBQTttQkFBRyxPQUFBLENBQVEsR0FBUjtVQUFILENBQVg7aUJBRUEsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUE7bUJBQ3ZCLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qiw2QkFBOUI7VUFEdUIsQ0FBekI7UUFId0IsQ0FBMUI7TUFWeUMsQ0FBM0M7YUFnQkEsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUE7UUFDbEMsVUFBQSxDQUFXLFNBQUE7VUFDVCxPQUFBLENBQVEsR0FBUixFQUFhO1lBQUEsS0FBQSxFQUFPLElBQVA7V0FBYjtpQkFDQSxPQUFBLENBQVEsR0FBUjtRQUZTLENBQVg7UUFJQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQTtVQUN4QyxVQUFBLENBQVcsU0FBQTttQkFDVCxPQUFBLENBQVEsR0FBUjtVQURTLENBQVg7VUFHQSxFQUFBLENBQUcsaURBQUgsRUFBc0QsU0FBQTtZQUNwRCxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0Q7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIseUJBQTlCO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBRSxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUFGLENBQWpEO1VBSG9ELENBQXREO2lCQUtBLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBO1lBQ25DLE9BQUEsQ0FBUSxHQUFSO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixxQkFBOUI7VUFGbUMsQ0FBckM7UUFUd0MsQ0FBMUM7ZUFhQSxRQUFBLENBQVMsaUNBQVQsRUFBNEMsU0FBQTtVQUMxQyxVQUFBLENBQVcsU0FBQTtZQUNULE9BQUEsQ0FBUSxHQUFSO21CQUNBLE9BQUEsQ0FBUSxHQUFSO1VBRlMsQ0FBWDtpQkFJQSxFQUFBLENBQUcsaURBQUgsRUFBc0QsU0FBQTtZQUNwRCxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0Q7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIscUJBQTlCO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBRSxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUFGLENBQWpEO1VBSG9ELENBQXREO1FBTDBDLENBQTVDO01BbEJrQyxDQUFwQztJQTlCMkIsQ0FBN0I7SUEwREEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7QUFDM0IsVUFBQTtNQUFBLFVBQUEsR0FBYTtNQUViLFVBQUEsQ0FBVyxTQUFBO1FBQ1QsZUFBQSxDQUFnQixTQUFBO2lCQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixxQkFBOUI7UUFEYyxDQUFoQjtRQUdBLFVBQUEsR0FBYSxNQUFNLENBQUMsVUFBUCxDQUFBO1FBQ2IsTUFBTSxDQUFDLE9BQVAsQ0FBZSxtQkFBZjtlQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO01BTlMsQ0FBWDthQVFBLFFBQUEsQ0FBUyxnREFBVCxFQUEyRCxTQUFBO1FBQ3pELFVBQUEsQ0FBVyxTQUFBO0FBQ1QsY0FBQTtVQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFkLENBQWtDLFdBQWxDO2lCQUNaLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFNBQWxCO1FBRlMsQ0FBWDtRQUlBLFNBQUEsQ0FBVSxTQUFBO2lCQUNSLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFVBQWxCO1FBRFEsQ0FBVjtRQUdBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO1VBQy9CLFVBQUEsQ0FBVyxTQUFBO1lBQ1QsT0FBQSxDQUFRLEdBQVI7bUJBQ0EsT0FBQSxDQUFRLEdBQVI7VUFGUyxDQUFYO2lCQUlBLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBO21CQUM3QixNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQS9CLENBQVAsQ0FBeUMsQ0FBQyxJQUExQyxDQUErQyxDQUEvQztVQUQ2QixDQUEvQjtRQUwrQixDQUFqQztRQVFBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO1VBQy9CLFVBQUEsQ0FBVyxTQUFBO1lBQ1QsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7WUFDQSxPQUFBLENBQVEsR0FBUjttQkFDQSxPQUFBLENBQVEsR0FBUixFQUFhO2NBQUEsS0FBQSxFQUFPLElBQVA7YUFBYjtVQUhTLENBQVg7aUJBS0EsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUE7WUFDM0IsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUEvQixDQUFQLENBQXlDLENBQUMsSUFBMUMsQ0FBK0MsQ0FBL0M7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUEvQixDQUFQLENBQXlDLENBQUMsSUFBMUMsQ0FBK0MsQ0FBL0M7VUFGMkIsQ0FBN0I7UUFOK0IsQ0FBakM7ZUFVQSxRQUFBLENBQVMsZ0NBQVQsRUFBMkMsU0FBQTtVQUN6QyxVQUFBLENBQVcsU0FBQTtZQUNULE9BQUEsQ0FBUSxHQUFSO1lBQ0EsT0FBQSxDQUFRLEdBQVI7bUJBQ0EsT0FBQSxDQUFRLEdBQVI7VUFIUyxDQUFYO1VBS0EsRUFBQSxDQUFHLG9DQUFILEVBQXlDLFNBQUE7WUFDdkMsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGVBQTlCO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtVQUZ1QyxDQUF6QztpQkFJQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBO1lBQ3hCLFVBQUEsQ0FBVyxTQUFBO3FCQUFHLE9BQUEsQ0FBUSxHQUFSO1lBQUgsQ0FBWDttQkFFQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQTtxQkFDdkIsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG1CQUE5QjtZQUR1QixDQUF6QjtVQUh3QixDQUExQjtRQVZ5QyxDQUEzQztNQTFCeUQsQ0FBM0Q7SUFYMkIsQ0FBN0I7SUFxREEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7TUFDM0IsVUFBQSxDQUFXLFNBQUE7UUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLGdCQUFmO2VBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7TUFGUyxDQUFYO01BSUEsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUE7UUFDL0IsT0FBQSxDQUFRLEdBQVI7UUFDQSxPQUFBLENBQVEsR0FBUjtRQUNBLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsT0FBQSxDQUFRLEdBQVI7ZUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsRUFBOUI7TUFOK0IsQ0FBakM7YUFRQSxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQTtRQUMxQixPQUFBLENBQVEsR0FBUjtRQUNBLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsT0FBQSxDQUFRLEdBQVI7UUFDQSxPQUFBLENBQVEsR0FBUjtlQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixJQUE5QjtNQU4wQixDQUE1QjtJQWIyQixDQUE3QjtJQXFCQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQTtNQUMzQixVQUFBLENBQVcsU0FBQTtRQUNULE1BQU0sQ0FBQyxPQUFQLENBQWUsWUFBZjtRQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO2VBQ0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakM7TUFIUyxDQUFYO01BS0EsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUE7UUFDaEMsT0FBQSxDQUFRLEdBQVI7UUFDQSxzQkFBQSxDQUF1QixHQUF2QjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixZQUE5QjtNQUhnQyxDQUFsQztNQUtBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBO1FBQ2hDLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsdUJBQWpDLENBQVAsQ0FBaUUsQ0FBQyxJQUFsRSxDQUF1RSxJQUF2RTtRQUNBLE9BQUEsQ0FBUSxRQUFSO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFlBQTlCO2VBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdEO01BTGdDLENBQWxDO01BT0EsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUE7UUFDbEQsT0FBQSxDQUFRLEdBQVI7UUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLGFBQWxELEVBQWlFLGNBQWpFO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGNBQTlCO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUFsRDtNQUprRCxDQUFwRDtNQU1BLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBO1FBQ25DLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsT0FBQSxDQUFRLEdBQVI7UUFDQSxzQkFBQSxDQUF1QixHQUF2QjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixZQUE5QjtNQUptQyxDQUFyQztNQU1BLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBO1FBQ2xDLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1FBQ0EsT0FBQSxDQUFRLEdBQVI7UUFDQSxzQkFBQSxDQUF1QixHQUF2QjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixZQUE5QjtNQUprQyxDQUFwQztNQU1BLEVBQUEsQ0FBRywyRUFBSCxFQUFnRixTQUFBO1FBQzlFLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsT0FBQSxDQUFRLEdBQVI7UUFDQSxzQkFBQSxDQUF1QixHQUF2QjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixZQUE5QjtNQUo4RSxDQUFoRjtNQU1BLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBO1FBQzlCLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsT0FBQSxDQUFRLEdBQVI7aUJBQ0EsT0FBQSxDQUFRLEdBQVI7UUFGUyxDQUFYO1FBSUEsRUFBQSxDQUFHLHdEQUFILEVBQTZELFNBQUE7VUFDM0QsT0FBQSxDQUFRLEdBQVI7VUFDQSxzQkFBQSxDQUF1QixHQUF2QjtpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsWUFBOUI7UUFIMkQsQ0FBN0Q7ZUFLQSxFQUFBLENBQUcscURBQUgsRUFBMEQsU0FBQTtVQUN4RCxPQUFBLENBQVEsR0FBUjtVQUNBLHNCQUFBLENBQXVCLEdBQXZCO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsd0JBQVAsQ0FBQSxDQUFQLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsQ0FBbEQ7UUFId0QsQ0FBMUQ7TUFWOEIsQ0FBaEM7YUFlQSxRQUFBLENBQVMsMEJBQVQsRUFBcUMsU0FBQTtBQUNuQyxZQUFBO1FBQUEsd0JBQUEsR0FBMkIsU0FBQyxLQUFELEVBQVEsR0FBUjtBQUN6QixjQUFBOytCQURpQyxNQUFlLElBQWQsa0JBQU07VUFDeEMsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNLEtBQU47VUFDWixLQUFLLENBQUMsSUFBTixHQUFhO1VBQ2IsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsS0FBdEIsRUFBNkIsUUFBN0IsRUFBdUM7WUFBQSxHQUFBLEVBQUssU0FBQTtxQkFBRztZQUFILENBQUw7V0FBdkM7aUJBQ0E7UUFKeUI7UUFNM0IsbUJBQUEsR0FBc0IsU0FBQyxHQUFEO0FBQ3BCLGNBQUE7VUFEc0IsaUJBQU07VUFDNUIsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNLFdBQU47VUFDWixLQUFLLENBQUMsSUFBTixHQUFhO1VBQ2IsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsS0FBdEIsRUFBNkIsUUFBN0IsRUFBdUM7WUFBQSxHQUFBLEVBQUssU0FBQTtxQkFBRztZQUFILENBQUw7V0FBdkM7aUJBQ0E7UUFKb0I7ZUFNdEIsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUE7QUFDL0IsY0FBQTtVQUFBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsZ0JBQUEsR0FBbUIsTUFBTSxDQUFDLG1CQUFtQixDQUFDO1VBQzlDLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQjtVQUNBLE9BQUEsR0FBVSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUM7VUFDckMsU0FBQSxHQUFZLE9BQU8sQ0FBQyxhQUFSLENBQXNCLGVBQXRCO1VBQ1osT0FBTyxDQUFDLGFBQVIsQ0FBc0Isd0JBQUEsQ0FBeUIsa0JBQXpCLEVBQTZDO1lBQUEsTUFBQSxFQUFRLFNBQVI7V0FBN0MsQ0FBdEI7VUFDQSxPQUFPLENBQUMsYUFBUixDQUFzQix3QkFBQSxDQUF5QixtQkFBekIsRUFBOEM7WUFBQSxJQUFBLEVBQU0sR0FBTjtZQUFXLE1BQUEsRUFBUSxTQUFuQjtXQUE5QyxDQUF0QjtVQUNBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxRQUFqQixDQUFBLENBQTJCLENBQUMsT0FBNUIsQ0FBQSxDQUFQLENBQTZDLENBQUMsT0FBOUMsQ0FBc0QsR0FBdEQ7VUFDQSxPQUFPLENBQUMsYUFBUixDQUFzQix3QkFBQSxDQUF5QixtQkFBekIsRUFBOEM7WUFBQSxJQUFBLEVBQU0sSUFBTjtZQUFZLE1BQUEsRUFBUSxTQUFwQjtXQUE5QyxDQUF0QjtVQUNBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxRQUFqQixDQUFBLENBQTJCLENBQUMsT0FBNUIsQ0FBQSxDQUFQLENBQTZDLENBQUMsT0FBOUMsQ0FBc0QsSUFBdEQ7VUFDQSxPQUFPLENBQUMsYUFBUixDQUFzQix3QkFBQSxDQUF5QixnQkFBekIsRUFBMkM7WUFBQSxNQUFBLEVBQVEsU0FBUjtXQUEzQyxDQUF0QjtVQUNBLE9BQU8sQ0FBQyxhQUFSLENBQXNCLG1CQUFBLENBQW9CO1lBQUEsSUFBQSxFQUFNLElBQU47WUFBWSxNQUFBLEVBQVEsU0FBcEI7V0FBcEIsQ0FBdEI7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGNBQTlCO1FBYitCLENBQWpDO01BYm1DLENBQXJDO0lBekQyQixDQUE3QjtJQXFGQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQTtNQUMzQixVQUFBLENBQVcsU0FBQTtRQUNULE1BQU0sQ0FBQyxPQUFQLENBQWUsY0FBZjtlQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO01BRlMsQ0FBWDthQUlBLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBO1FBQ3JCLE9BQUEsQ0FBUSxHQUFSO1FBQ0Esc0JBQUEsQ0FBdUIsR0FBdkI7ZUFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLE9BQVQsQ0FBaUIsR0FBakIsQ0FBUCxDQUE2QixDQUFDLE9BQTlCLENBQXNDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBdEM7TUFIcUIsQ0FBdkI7SUFMMkIsQ0FBN0I7SUFVQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQTtNQUMzQixVQUFBLENBQVcsU0FBQTtRQUNULE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZjtRQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO2VBQ0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakM7TUFIUyxDQUFYO01BS0EsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUE7UUFDckMsT0FBQSxDQUFRLEdBQVI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQWxEO1FBRUEsT0FBQSxDQUFRLEdBQVI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQWxEO1FBRUEsT0FBQSxDQUFRLEdBQVI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUI7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQWxEO01BWHFDLENBQXZDO01BYUEsRUFBQSxDQUFHLGVBQUgsRUFBb0IsU0FBQTtRQUNsQixPQUFBLENBQVEsR0FBUjtRQUNBLE9BQUEsQ0FBUSxHQUFSO1FBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFVBQTlCO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUFsRDtNQUxrQixDQUFwQjtNQU9BLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBO2VBQ3pCLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBO1VBQzFDLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1VBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtZQUFBLEtBQUEsRUFBTyxJQUFQO1dBQWI7VUFDQSxPQUFBLENBQVEsR0FBUjtpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUI7UUFKMEMsQ0FBNUM7TUFEeUIsQ0FBM0I7YUFPQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQTtRQUM1QixFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQTtVQUM3QixNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtVQUNBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFDQSxPQUFBLENBQVEsR0FBUjtVQUNBLE9BQUEsQ0FBUSxHQUFSO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QjtRQU42QixDQUEvQjtlQVFBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBO1VBQ3ZCLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFDQSxPQUFBLENBQVEsR0FBUjtVQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7WUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QjtRQUx1QixDQUF6QjtNQVQ0QixDQUE5QjtJQWpDMkIsQ0FBN0I7SUFpREEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7TUFDM0IsVUFBQSxDQUFXLFNBQUE7UUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLFVBQWY7ZUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtNQUZTLENBQVg7TUFJQSxFQUFBLENBQUcsd0NBQUgsRUFBNkMsU0FBQTtRQUMzQyxPQUFBLENBQVEsR0FBUjtRQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7VUFBQSxLQUFBLEVBQU8sSUFBUDtTQUFiO1FBQ0EsT0FBQSxDQUFRLEdBQVI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUI7UUFFQSxPQUFBLENBQVEsR0FBUjtRQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7VUFBQSxLQUFBLEVBQU8sSUFBUDtTQUFiO1FBQ0EsT0FBQSxDQUFRLEdBQVI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUI7UUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtRQUNBLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWI7UUFDQSxPQUFBLENBQVEsR0FBUjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtNQWhCMkMsQ0FBN0M7TUFrQkEsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUE7UUFDdkIsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFDQSxPQUFBLENBQVEsR0FBUjtRQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7VUFBQSxLQUFBLEVBQU8sSUFBUDtTQUFiO1FBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWI7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUI7TUFMdUIsQ0FBekI7YUFPQSxFQUFBLENBQUcsa0RBQUgsRUFBdUQsU0FBQTtRQUNyRCxPQUFBLENBQVEsR0FBUixFQUFhO1VBQUEsS0FBQSxFQUFPLElBQVA7U0FBYjtRQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7VUFBQSxLQUFBLEVBQU8sSUFBUDtTQUFiO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFVBQTlCO01BSHFELENBQXZEO0lBOUIyQixDQUE3QjtJQW1DQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQTtNQUMzQixVQUFBLENBQVcsU0FBQTtRQUNULE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZjtlQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO01BRlMsQ0FBWDtNQUlBLEVBQUEsQ0FBRyx3Q0FBSCxFQUE2QyxTQUFBO1FBQzNDLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsT0FBQSxDQUFRLEdBQVI7UUFDQSxPQUFBLENBQVEsR0FBUjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtNQUwyQyxDQUE3QztNQU9BLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBO1FBQ3ZCLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1FBQ0EsT0FBQSxDQUFRLEdBQVI7UUFDQSxPQUFBLENBQVEsR0FBUjtRQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7VUFBQSxLQUFBLEVBQU8sSUFBUDtTQUFiO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFVBQTlCO01BTHVCLENBQXpCO2FBT0EsRUFBQSxDQUFHLGtEQUFILEVBQXVELFNBQUE7UUFDckQsT0FBQSxDQUFRLEdBQVIsRUFBYTtVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWI7UUFDQSxPQUFBLENBQVEsR0FBUjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QjtNQUhxRCxDQUF2RDtJQW5CMkIsQ0FBN0I7SUF3QkEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7TUFDM0IsVUFBQSxDQUFXLFNBQUE7UUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLFdBQWY7UUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtlQUNBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDO01BSFMsQ0FBWDtNQUtBLEVBQUEsQ0FBRywwQ0FBSCxFQUErQyxTQUFBO1FBQzdDLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEI7UUFDQSxNQUFNLENBQUMsU0FBUCxDQUFBO1FBQ0EsTUFBTSxDQUFDLFNBQVAsQ0FBQTtRQUNBLE9BQUEsQ0FBUSxRQUFSO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlCQUE5QjtRQUVBLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEI7UUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQjtRQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCO1FBQ0EsT0FBQSxDQUFRLFFBQVI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsdUJBQTlCO1FBRUEsT0FBQSxDQUFRLEdBQVI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsaUJBQTlCO1FBRUEsT0FBQSxDQUFRLEdBQVI7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUI7TUFuQjZDLENBQS9DO01BcUJBLEVBQUEsQ0FBRyx5QkFBSCxFQUE4QixTQUFBO1FBQzVCLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEI7UUFDQSxNQUFNLENBQUMsU0FBUCxDQUFBO1FBQ0EsTUFBTSxDQUFDLFNBQVAsQ0FBQTtRQUNBLE9BQUEsQ0FBUSxRQUFSO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlCQUE5QjtRQUVBLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHVCQUE5QjtRQUVBLE9BQUEsQ0FBUSxHQUFSO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDZCQUE5QjtNQVo0QixDQUE5QjthQWNBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO1FBQy9CLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSxFQUFmO2lCQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1FBRlMsQ0FBWDtRQUlBLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBO1VBQ3JDLE9BQUEsQ0FBUSxHQUFSO1VBR0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBbEI7VUFDQSxNQUFNLENBQUMsUUFBUCxDQUFBO1VBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEI7VUFDQSxNQUFNLENBQUMsU0FBUCxDQUFBO1VBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEI7VUFDQSxPQUFBLENBQVEsUUFBUjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUssQ0FBTCxDQUFqRDtVQUVBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGNBQTlCO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUssQ0FBTCxDQUFqRDtRQWRxQyxDQUF2QztlQWdCQSxFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQTtVQUM1QixPQUFBLENBQVEsR0FBUjtVQUVBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCO1VBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEI7VUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQjtVQUNBLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUE1QixFQUE4QyxRQUE5QztVQUNBLE9BQUEsQ0FBUSxRQUFSO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSyxDQUFMLENBQWpEO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFFBQTlCO1VBRUEsT0FBQSxDQUFRLEdBQVI7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsY0FBOUI7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSyxFQUFMLENBQWpEO1FBYjRCLENBQTlCO01BckIrQixDQUFqQztJQXpDMkIsQ0FBN0I7SUE2RUEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7TUFDM0IsVUFBQSxDQUFXLFNBQUE7UUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLEVBQWY7ZUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtNQUZTLENBQVg7TUFJQSxFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQTtRQUM1QixPQUFBLENBQVEsR0FBUjtRQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCO1FBQ0EsT0FBQSxDQUFRLFFBQVI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsS0FBOUI7UUFDQSxPQUFBLENBQVEsR0FBUjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixFQUE5QjtNQU40QixDQUE5QjthQVFBLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBO1FBQ3RCLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEI7UUFDQSxPQUFBLENBQVEsUUFBUjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixLQUE5QjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtRQUNBLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFFBQTlCO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO01BUnNCLENBQXhCO0lBYjJCLENBQTdCO0lBdUJBLFFBQUEsQ0FBUywrQkFBVCxFQUEwQyxTQUFBO01BQ3hDLFVBQUEsQ0FBVyxTQUFBO1FBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixFQUF3QyxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBQyxPQUFELEVBQW5FO1FBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxtQ0FBZjtRQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1FBQ0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakM7UUFDQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQztRQUNBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDO2VBQ0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakM7TUFQUyxDQUFYO01BU0EsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUE7UUFDN0IsRUFBQSxDQUFHLDJCQUFILEVBQWdDLFNBQUE7VUFDOUIsT0FBQSxDQUFRLEdBQVIsRUFBYTtZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWI7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULEVBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QixFQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBQWxEO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG1DQUE5QjtpQkFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQVosQ0FBaUIsQ0FBQyxHQUFHLENBQUMsZ0JBQXRCLENBQUE7UUFKOEIsQ0FBaEM7UUFNQSxFQUFBLENBQUcsZ0JBQUgsRUFBcUIsU0FBQTtVQUNuQixPQUFBLENBQVEsR0FBUixFQUFhO1lBQUEsSUFBQSxFQUFNLElBQU47V0FBYjtVQUNBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxFQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpCLEVBQXlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekIsRUFBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQyxDQUFsRDtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQ0FBOUI7aUJBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFaLENBQWlCLENBQUMsR0FBRyxDQUFDLGdCQUF0QixDQUFBO1FBTG1CLENBQXJCO1FBT0EsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUE7VUFDckIsT0FBQSxDQUFRLEdBQVI7VUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO1lBQUEsSUFBQSxFQUFNLElBQU47V0FBYjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsd0JBQVAsQ0FBQSxDQUFQLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsRUFBaUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQixFQUF5QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpCLEVBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakMsQ0FBbEQ7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsa0NBQTlCO2lCQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBWixDQUFpQixDQUFDLEdBQUcsQ0FBQyxnQkFBdEIsQ0FBQTtRQUxxQixDQUF2QjtRQU9BLEVBQUEsQ0FBRyw4REFBSCxFQUFtRSxTQUFBO1VBQ2pFLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVI7VUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO1lBQUEsSUFBQSxFQUFNLElBQU47V0FBYjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsd0JBQVAsQ0FBQSxDQUFQLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsRUFBaUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQixFQUF5QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpCLEVBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakMsQ0FBbEQ7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsbUNBQTlCO2lCQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBWixDQUFpQixDQUFDLEdBQUcsQ0FBQyxnQkFBdEIsQ0FBQTtRQU5pRSxDQUFuRTtRQVFBLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBO1VBQ2pELE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1VBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWI7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELENBQWxEO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG1DQUE5QjtpQkFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQVosQ0FBaUIsQ0FBQyxnQkFBbEIsQ0FBQTtRQUxpRCxDQUFuRDtRQU9BLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBO1VBQ2xDLE1BQU0sQ0FBQyxPQUFQLENBQWUsSUFBZjtVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1VBQ0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakM7VUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO1lBQUEsSUFBQSxFQUFNLElBQU47V0FBYjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsd0JBQVAsQ0FBQSxDQUFQLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsQ0FBbEQ7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsSUFBOUI7aUJBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFaLENBQWlCLENBQUMsZ0JBQWxCLENBQUE7UUFQa0MsQ0FBcEM7ZUFTQSxFQUFBLENBQUcsMENBQUgsRUFBK0MsU0FBQTtVQUM3QyxNQUFNLENBQUMsT0FBUCxDQUFlLG9DQUFmO1VBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7VUFDQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQztVQUNBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDO1VBQ0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakM7VUFDQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQztVQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsaUJBQXhDO1VBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWI7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULEVBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QixFQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBQWxEO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG9DQUE5QjtpQkFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQVosQ0FBaUIsQ0FBQyxHQUFHLENBQUMsZ0JBQXRCLENBQUE7UUFYNkMsQ0FBL0M7TUE3QzZCLENBQS9CO2FBMERBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBO1FBQzdCLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBO1VBQzlCLE9BQUEsQ0FBUSxHQUFSLEVBQWE7WUFBQSxJQUFBLEVBQU0sSUFBTjtXQUFiO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxFQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpCLEVBQXlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekIsRUFBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQyxDQUFsRDtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQ0FBOUI7aUJBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFaLENBQWlCLENBQUMsR0FBRyxDQUFDLGdCQUF0QixDQUFBO1FBSjhCLENBQWhDO1FBTUEsRUFBQSxDQUFHLGdCQUFILEVBQXFCLFNBQUE7VUFDbkIsT0FBQSxDQUFRLEdBQVIsRUFBYTtZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWI7VUFDQSxPQUFBLENBQVEsR0FBUjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsd0JBQVAsQ0FBQSxDQUFQLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsRUFBaUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQixFQUF5QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpCLEVBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakMsQ0FBbEQ7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsbUNBQTlCO2lCQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBWixDQUFpQixDQUFDLEdBQUcsQ0FBQyxnQkFBdEIsQ0FBQTtRQUxtQixDQUFyQjtRQU9BLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBO1VBQ3JCLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWI7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULEVBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QixFQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBQWxEO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG9DQUE5QjtpQkFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQVosQ0FBaUIsQ0FBQyxHQUFHLENBQUMsZ0JBQXRCLENBQUE7UUFMcUIsQ0FBdkI7UUFPQSxFQUFBLENBQUcsOERBQUgsRUFBbUUsU0FBQTtVQUNqRSxPQUFBLENBQVEsR0FBUjtVQUNBLE9BQUEsQ0FBUSxHQUFSO1VBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWI7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULEVBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QixFQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBQWxEO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHNDQUE5QjtpQkFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQVosQ0FBaUIsQ0FBQyxHQUFHLENBQUMsZ0JBQXRCLENBQUE7UUFOaUUsQ0FBbkU7UUFRQSxFQUFBLENBQUcsOENBQUgsRUFBbUQsU0FBQTtVQUNqRCxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtVQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7WUFBQSxJQUFBLEVBQU0sSUFBTjtXQUFiO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxDQUFsRDtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQ0FBOUI7aUJBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFaLENBQWlCLENBQUMsZ0JBQWxCLENBQUE7UUFMaUQsQ0FBbkQ7UUFPQSxFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQTtVQUNsQyxNQUFNLENBQUMsT0FBUCxDQUFlLElBQWY7VUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtVQUNBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDO1VBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWI7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQWxEO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLElBQTlCO2lCQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBWixDQUFpQixDQUFDLGdCQUFsQixDQUFBO1FBUGtDLENBQXBDO2VBU0EsRUFBQSxDQUFHLDBDQUFILEVBQStDLFNBQUE7VUFDN0MsTUFBTSxDQUFDLE9BQVAsQ0FBZSxvQ0FBZjtVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1VBQ0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakM7VUFDQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQztVQUNBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDO1VBQ0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakM7VUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLGlCQUF4QztVQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7WUFBQSxJQUFBLEVBQU0sSUFBTjtXQUFiO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxFQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpCLEVBQXlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekIsRUFBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQyxDQUFsRDtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixvQ0FBOUI7aUJBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFaLENBQWlCLENBQUMsR0FBRyxDQUFDLGdCQUF0QixDQUFBO1FBWDZDLENBQS9DO01BN0M2QixDQUEvQjtJQXBFd0MsQ0FBMUM7V0E4SEEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7TUFDM0IsVUFBQSxDQUFXLFNBQUE7UUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLGNBQWY7ZUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtNQUZTLENBQVg7TUFJQSxFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQTtRQUNoRCxPQUFBLENBQVEsR0FBUixFQUFhO1VBQUEsS0FBQSxFQUFPLElBQVA7U0FBYjtRQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RDtRQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGNBQWpDLENBQVAsQ0FBd0QsQ0FBQyxJQUF6RCxDQUE4RCxJQUE5RDtRQUVBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQWxCO1FBQ0EsT0FBQSxDQUFRLFFBQVI7UUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsY0FBOUI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7UUFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsS0FBN0Q7UUFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxjQUFqQyxDQUFQLENBQXdELENBQUMsSUFBekQsQ0FBOEQsS0FBOUQ7ZUFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0Q7TUFaZ0QsQ0FBbEQ7TUFjQSxFQUFBLENBQUcsd0NBQUgsRUFBNkMsU0FBQTtRQUMzQyxPQUFBLENBQVEsR0FBUixFQUFhO1VBQUEsS0FBQSxFQUFPLElBQVA7U0FBYjtRQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RDtRQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGNBQWpDLENBQVAsQ0FBd0QsQ0FBQyxJQUF6RCxDQUE4RCxJQUE5RDtRQUVBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCO1FBQ0EsT0FBQSxDQUFRLFFBQVI7ZUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZ0JBQTlCO01BUjJDLENBQTdDO01BVUEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUE7UUFDN0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEI7UUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO1VBQUEsS0FBQSxFQUFPLElBQVA7U0FBYjtRQUVBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCO1FBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsaUJBQTlCO1FBRUEsT0FBQSxDQUFRLFdBQVIsRUFBcUI7VUFBQSxHQUFBLEVBQUssSUFBTDtTQUFyQjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixpQkFBOUI7UUFFQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQjtRQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixpQkFBOUI7UUFFQSxPQUFBLENBQVEsV0FBUixFQUFxQjtVQUFBLEdBQUEsRUFBSyxJQUFMO1NBQXJCO1FBQ0EsT0FBQSxDQUFRLFdBQVIsRUFBcUI7VUFBQSxHQUFBLEVBQUssSUFBTDtTQUFyQjtRQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixpQkFBOUI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLGVBQVAsQ0FBQSxDQUFQLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsRUFBdEM7UUFFQSxPQUFBLENBQVEsV0FBUixFQUFxQjtVQUFBLEdBQUEsRUFBSyxJQUFMO1NBQXJCO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlCQUE5QjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsZUFBUCxDQUFBLENBQVAsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxFQUF0QztNQXZCNkIsQ0FBL0I7TUF5QkEsRUFBQSxDQUFHLGlCQUFILEVBQXNCLFNBQUE7UUFDcEIsT0FBQSxDQUFRLEdBQVIsRUFBYTtVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWI7UUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFsQjtRQUNBLE9BQUEsQ0FBUSxRQUFSO1FBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFDQSxPQUFBLENBQVEsR0FBUjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixjQUE5QjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtRQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1FBQ0EsT0FBQSxDQUFRLEdBQVI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZUFBOUI7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7TUFab0IsQ0FBdEI7TUFjQSxFQUFBLENBQUcsa0VBQUgsRUFBdUUsU0FBQSxHQUFBLENBQXZFO01BR0EsRUFBQSxDQUFHLHVEQUFILEVBQTRELFNBQUE7UUFDMUQsT0FBQSxDQUFRLEdBQVIsRUFBYTtVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWI7UUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQjtRQUNBLE9BQUEsQ0FBUSxXQUFSLEVBQXFCO1VBQUEsR0FBQSxFQUFLLElBQUw7U0FBckI7UUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQjtRQUNBLE9BQUEsQ0FBUSxRQUFSO1FBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFDQSxPQUFBLENBQVEsR0FBUjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixjQUE5QjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRDtRQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1FBQ0EsT0FBQSxDQUFRLEdBQVI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsY0FBOUI7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQ7TUFkMEQsQ0FBNUQ7YUFnQkEsRUFBQSxDQUFHLG1EQUFILEVBQXdELFNBQUE7UUFDdEQsT0FBQSxDQUFRLEdBQVIsRUFBYTtVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWI7UUFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0Q7UUFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxjQUFqQyxDQUFQLENBQXdELENBQUMsSUFBekQsQ0FBOEQsSUFBOUQ7UUFFQSxNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFsQjtRQUNBLE9BQUEsQ0FBUSxRQUFSO2VBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGdCQUE5QjtNQVJzRCxDQUF4RDtJQXZGMkIsQ0FBN0I7RUE1b0VvQixDQUF0QjtBQUhBIiwic291cmNlc0NvbnRlbnQiOlsiaGVscGVycyA9IHJlcXVpcmUgJy4vc3BlYy1oZWxwZXInXG5zZXR0aW5ncyA9IHJlcXVpcmUgJy4uL2xpYi9zZXR0aW5ncydcblxuZGVzY3JpYmUgXCJPcGVyYXRvcnNcIiwgLT5cbiAgW2VkaXRvciwgZWRpdG9yRWxlbWVudCwgdmltU3RhdGVdID0gW11cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgdmltTW9kZSA9IGF0b20ucGFja2FnZXMubG9hZFBhY2thZ2UoJ3ZpbS1tb2RlJylcbiAgICB2aW1Nb2RlLmFjdGl2YXRlUmVzb3VyY2VzKClcblxuICAgIGhlbHBlcnMuZ2V0RWRpdG9yRWxlbWVudCAoZWxlbWVudCkgLT5cbiAgICAgIGVkaXRvckVsZW1lbnQgPSBlbGVtZW50XG4gICAgICBlZGl0b3IgPSBlZGl0b3JFbGVtZW50LmdldE1vZGVsKClcbiAgICAgIHZpbVN0YXRlID0gZWRpdG9yRWxlbWVudC52aW1TdGF0ZVxuICAgICAgdmltU3RhdGUuYWN0aXZhdGVOb3JtYWxNb2RlKClcbiAgICAgIHZpbVN0YXRlLnJlc2V0Tm9ybWFsTW9kZSgpXG5cbiAga2V5ZG93biA9IChrZXksIG9wdGlvbnM9e30pIC0+XG4gICAgb3B0aW9ucy5lbGVtZW50ID89IGVkaXRvckVsZW1lbnRcbiAgICBoZWxwZXJzLmtleWRvd24oa2V5LCBvcHRpb25zKVxuXG4gIG5vcm1hbE1vZGVJbnB1dEtleWRvd24gPSAoa2V5LCBvcHRzID0ge30pIC0+XG4gICAgZWRpdG9yLm5vcm1hbE1vZGVJbnB1dFZpZXcuZWRpdG9yRWxlbWVudC5nZXRNb2RlbCgpLnNldFRleHQoa2V5KVxuXG4gIGRlc2NyaWJlIFwiY2FuY2VsbGluZyBvcGVyYXRpb25zXCIsIC0+XG4gICAgaXQgXCJ0aHJvd3MgYW4gZXJyb3Igd2hlbiBubyBvcGVyYXRpb24gaXMgcGVuZGluZ1wiLCAtPlxuICAgICAgIyBjYW5jZWwgb3BlcmF0aW9uIHB1c2hlcyBhbiBlbXB0eSBpbnB1dCBvcGVyYXRpb25cbiAgICAgICMgZG9pbmcgdGhpcyB3aXRob3V0IGEgcGVuZGluZyBvcGVyYXRpb24gd291bGQgdGhyb3cgYW4gZXhjZXB0aW9uXG4gICAgICBleHBlY3QoLT4gdmltU3RhdGUucHVzaE9wZXJhdGlvbnMobmV3IElucHV0KCcnKSkpLnRvVGhyb3coKVxuXG4gICAgaXQgXCJjYW5jZWxzIGFuZCBjbGVhbnMgdXAgcHJvcGVybHlcIiwgLT5cbiAgICAgICMgbWFrZSBzdXJlIG5vcm1hbE1vZGVJbnB1dFZpZXcgaXMgY3JlYXRlZFxuICAgICAga2V5ZG93bignLycpXG4gICAgICBleHBlY3QodmltU3RhdGUuaXNPcGVyYXRvclBlbmRpbmcoKSkudG9CZSB0cnVlXG4gICAgICBlZGl0b3Iubm9ybWFsTW9kZUlucHV0Vmlldy52aWV3TW9kZWwuY2FuY2VsKClcblxuICAgICAgZXhwZWN0KHZpbVN0YXRlLmlzT3BlcmF0b3JQZW5kaW5nKCkpLnRvQmUgZmFsc2VcbiAgICAgIGV4cGVjdChlZGl0b3Iubm9ybWFsTW9kZUlucHV0VmlldykudG9CZSB1bmRlZmluZWRcblxuICBkZXNjcmliZSBcInRoZSB4IGtleWJpbmRpbmdcIiwgLT5cbiAgICBkZXNjcmliZSBcIm9uIGEgbGluZSB3aXRoIGNvbnRlbnRcIiwgLT5cbiAgICAgIGRlc2NyaWJlIFwid2l0aG91dCB2aW0tbW9kZS53cmFwTGVmdFJpZ2h0TW90aW9uXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChcImFiY1xcbjAxMjM0NVxcblxcbnh5elwiKVxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMSwgNF0pXG5cbiAgICAgICAgaXQgXCJkZWxldGVzIGEgY2hhcmFjdGVyXCIsIC0+XG4gICAgICAgICAga2V5ZG93bigneCcpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ2FiY1xcbjAxMjM1XFxuXFxueHl6J1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgNF1cbiAgICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSAnNCdcblxuICAgICAgICAgIGtleWRvd24oJ3gnKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdhYmNcXG4wMTIzXFxuXFxueHl6J1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgM11cbiAgICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSAnNSdcblxuICAgICAgICAgIGtleWRvd24oJ3gnKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdhYmNcXG4wMTJcXG5cXG54eXonXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAyXVxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICczJ1xuXG4gICAgICAgICAga2V5ZG93bigneCcpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ2FiY1xcbjAxXFxuXFxueHl6J1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMV1cbiAgICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSAnMidcblxuICAgICAgICAgIGtleWRvd24oJ3gnKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdhYmNcXG4wXFxuXFxueHl6J1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMF1cbiAgICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSAnMSdcblxuICAgICAgICAgIGtleWRvd24oJ3gnKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdhYmNcXG5cXG5cXG54eXonXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICcwJ1xuXG4gICAgICAgIGl0IFwiZGVsZXRlcyBtdWx0aXBsZSBjaGFyYWN0ZXJzIHdpdGggYSBjb3VudFwiLCAtPlxuICAgICAgICAgIGtleWRvd24oJzInKVxuICAgICAgICAgIGtleWRvd24oJ3gnKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdhYmNcXG4wMTIzXFxuXFxueHl6J1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgM11cbiAgICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSAnNDUnXG5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDFdKVxuICAgICAgICAgIGtleWRvd24oJzMnKVxuICAgICAgICAgIGtleWRvd24oJ3gnKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdhXFxuMDEyM1xcblxcbnh5eidcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgJ2JjJ1xuXG4gICAgICBkZXNjcmliZSBcIndpdGggbXVsdGlwbGUgY3Vyc29yc1wiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgZWRpdG9yLnNldFRleHQgXCJhYmNcXG4wMTIzNDVcXG5cXG54eXpcIlxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbiBbMSwgNF1cbiAgICAgICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbiBbMCwgMV1cblxuICAgICAgICBpdCBcImlzIHVuZG9uZSBhcyBvbmUgb3BlcmF0aW9uXCIsIC0+XG4gICAgICAgICAga2V5ZG93bigneCcpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJhY1xcbjAxMjM1XFxuXFxueHl6XCJcbiAgICAgICAgICBrZXlkb3duKCd1JylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcImFiY1xcbjAxMjM0NVxcblxcbnh5elwiXG5cbiAgICAgIGRlc2NyaWJlIFwid2l0aCB2aW0tbW9kZS53cmFwTGVmdFJpZ2h0TW90aW9uXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChcImFiY1xcbjAxMjM0NVxcblxcbnh5elwiKVxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMSwgNF0pXG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KCd2aW0tbW9kZS53cmFwTGVmdFJpZ2h0TW90aW9uJywgdHJ1ZSlcblxuICAgICAgICBpdCBcImRlbGV0ZXMgYSBjaGFyYWN0ZXJcIiwgLT5cbiAgICAgICAgICAjIGNvcHkgb2YgdGhlIGVhcmxpZXIgdGVzdCBiZWNhdXNlIHdyYXBMZWZ0UmlnaHRNb3Rpb24gc2hvdWxkIG5vdCBhZmZlY3QgaXRcbiAgICAgICAgICBrZXlkb3duKCd4JylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnYWJjXFxuMDEyMzVcXG5cXG54eXonXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCA0XVxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICc0J1xuXG4gICAgICAgICAga2V5ZG93bigneCcpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ2FiY1xcbjAxMjNcXG5cXG54eXonXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAzXVxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICc1J1xuXG4gICAgICAgICAga2V5ZG93bigneCcpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ2FiY1xcbjAxMlxcblxcbnh5eidcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDJdXG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgJzMnXG5cbiAgICAgICAgICBrZXlkb3duKCd4JylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnYWJjXFxuMDFcXG5cXG54eXonXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAxXVxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICcyJ1xuXG4gICAgICAgICAga2V5ZG93bigneCcpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ2FiY1xcbjBcXG5cXG54eXonXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICcxJ1xuXG4gICAgICAgICAga2V5ZG93bigneCcpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ2FiY1xcblxcblxcbnh5eidcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgJzAnXG5cbiAgICAgICAgaXQgXCJkZWxldGVzIG11bHRpcGxlIGNoYXJhY3RlcnMgYW5kIG5ld2xpbmVzIHdpdGggYSBjb3VudFwiLCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgndmltLW1vZGUud3JhcExlZnRSaWdodE1vdGlvbicsIHRydWUpXG4gICAgICAgICAga2V5ZG93bignMicpXG4gICAgICAgICAga2V5ZG93bigneCcpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ2FiY1xcbjAxMjNcXG5cXG54eXonXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAzXVxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICc0NSdcblxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMV0pXG4gICAgICAgICAga2V5ZG93bignMycpXG4gICAgICAgICAga2V5ZG93bigneCcpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ2EwMTIzXFxuXFxueHl6J1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMV1cbiAgICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSAnYmNcXG4nXG5cbiAgICAgICAgICBrZXlkb3duKCc3JylcbiAgICAgICAgICBrZXlkb3duKCd4JylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnYXl6J1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMV1cbiAgICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSAnMDEyM1xcblxcbngnXG5cbiAgICBkZXNjcmliZSBcIm9uIGFuIGVtcHR5IGxpbmVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCJhYmNcXG4wMTIzNDVcXG5cXG54eXpcIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsyLCAwXSlcblxuICAgICAgaXQgXCJkZWxldGVzIG5vdGhpbmcgb24gYW4gZW1wdHkgbGluZSB3aGVuIHZpbS1tb2RlLndyYXBMZWZ0UmlnaHRNb3Rpb24gaXMgZmFsc2VcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCd2aW0tbW9kZS53cmFwTGVmdFJpZ2h0TW90aW9uJywgZmFsc2UpXG4gICAgICAgIGtleWRvd24oJ3gnKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcImFiY1xcbjAxMjM0NVxcblxcbnh5elwiXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMiwgMF1cblxuICAgICAgaXQgXCJkZWxldGVzIGFuIGVtcHR5IGxpbmUgd2hlbiB2aW0tbW9kZS53cmFwTGVmdFJpZ2h0TW90aW9uIGlzIHRydWVcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCd2aW0tbW9kZS53cmFwTGVmdFJpZ2h0TW90aW9uJywgdHJ1ZSlcbiAgICAgICAga2V5ZG93bigneCcpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiYWJjXFxuMDEyMzQ1XFxueHl6XCJcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsyLCAwXVxuXG4gIGRlc2NyaWJlIFwidGhlIFgga2V5YmluZGluZ1wiLCAtPlxuICAgIGRlc2NyaWJlIFwib24gYSBsaW5lIHdpdGggY29udGVudFwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBlZGl0b3Iuc2V0VGV4dChcImFiXFxuMDEyMzQ1XCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMSwgMl0pXG5cbiAgICAgIGl0IFwiZGVsZXRlcyBhIGNoYXJhY3RlclwiLCAtPlxuICAgICAgICBrZXlkb3duKCdYJywgc2hpZnQ6IHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdhYlxcbjAyMzQ1J1xuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDFdXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICcxJ1xuXG4gICAgICAgIGtleWRvd24oJ1gnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ2FiXFxuMjM0NSdcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSAnMCdcblxuICAgICAgICBrZXlkb3duKCdYJywgc2hpZnQ6IHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdhYlxcbjIzNDUnXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMF1cbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgJzAnXG5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCd2aW0tbW9kZS53cmFwTGVmdFJpZ2h0TW90aW9uJywgdHJ1ZSlcbiAgICAgICAga2V5ZG93bignWCcsIHNoaWZ0OiB0cnVlKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnYWIyMzQ1J1xuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDJdXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICdcXG4nXG5cbiAgICBkZXNjcmliZSBcIm9uIGFuIGVtcHR5IGxpbmVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCIwMTIzNDVcXG5cXG5hYmNkZWZcIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAwXSlcblxuICAgICAgaXQgXCJkZWxldGVzIG5vdGhpbmcgd2hlbiB2aW0tbW9kZS53cmFwTGVmdFJpZ2h0TW90aW9uIGlzIGZhbHNlXCIsIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgndmltLW1vZGUud3JhcExlZnRSaWdodE1vdGlvbicsIGZhbHNlKVxuICAgICAgICBrZXlkb3duKCdYJywgc2hpZnQ6IHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMDEyMzQ1XFxuXFxuYWJjZGVmXCJcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuXG4gICAgICBpdCBcImRlbGV0ZXMgdGhlIG5ld2xpbmUgd2hlbiB3cmFwTGVmdFJpZ2h0TW90aW9uIGlzIHRydWVcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCd2aW0tbW9kZS53cmFwTGVmdFJpZ2h0TW90aW9uJywgdHJ1ZSlcbiAgICAgICAga2V5ZG93bignWCcsIHNoaWZ0OiB0cnVlKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjAxMjM0NVxcbmFiY2RlZlwiXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNV1cblxuICBkZXNjcmliZSBcInRoZSBzIGtleWJpbmRpbmdcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnMDEyMzQ1JylcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMV0pXG5cbiAgICBpdCBcImRlbGV0ZXMgdGhlIGNoYXJhY3RlciB0byB0aGUgcmlnaHQgYW5kIGVudGVycyBpbnNlcnQgbW9kZVwiLCAtPlxuICAgICAga2V5ZG93bigncycpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2luc2VydC1tb2RlJykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICcwMjM0NSdcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMV1cbiAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICcxJ1xuXG4gICAgaXQgXCJpcyByZXBlYXRhYmxlXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuICAgICAga2V5ZG93bignMycpXG4gICAgICBrZXlkb3duKCdzJylcbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0KFwiYWJcIilcbiAgICAgIGtleWRvd24oJ2VzY2FwZScpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnYWIzNDUnXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDJdKVxuICAgICAga2V5ZG93bignLicpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnYWJhYidcblxuICAgIGl0IFwiaXMgdW5kb2FibGVcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG4gICAgICBrZXlkb3duKCczJylcbiAgICAgIGtleWRvd24oJ3MnKVxuICAgICAgZWRpdG9yLmluc2VydFRleHQoXCJhYlwiKVxuICAgICAga2V5ZG93bignZXNjYXBlJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdhYjM0NSdcbiAgICAgIGtleWRvd24oJ3UnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJzAxMjM0NSdcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpLnRvQmUgJydcblxuICAgIGRlc2NyaWJlIFwiaW4gdmlzdWFsIG1vZGVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAga2V5ZG93bigndicpXG4gICAgICAgIGVkaXRvci5zZWxlY3RSaWdodCgpXG4gICAgICAgIGtleWRvd24oJ3MnKVxuXG4gICAgICBpdCBcImRlbGV0ZXMgdGhlIHNlbGVjdGVkIGNoYXJhY3RlcnMgYW5kIGVudGVycyBpbnNlcnQgbW9kZVwiLCAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2luc2VydC1tb2RlJykpLnRvQmUodHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJzAzNDUnXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMV1cbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgJzEyJ1xuXG4gIGRlc2NyaWJlIFwidGhlIFMga2V5YmluZGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiMTIzNDVcXG5hYmNkZVxcbkFCQ0RFXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDNdKVxuXG4gICAgaXQgXCJkZWxldGVzIHRoZSBlbnRpcmUgbGluZSBhbmQgZW50ZXJzIGluc2VydCBtb2RlXCIsIC0+XG4gICAgICBrZXlkb3duKCdTJywgc2hpZnQ6IHRydWUpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2luc2VydC1tb2RlJykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTIzNDVcXG5cXG5BQkNERVwiXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG4gICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSBcImFiY2RlXFxuXCJcbiAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50eXBlKS50b0JlICdsaW5ld2lzZSdcblxuICAgIGl0IFwiaXMgcmVwZWF0YWJsZVwiLCAtPlxuICAgICAga2V5ZG93bignUycsIHNoaWZ0OiB0cnVlKVxuICAgICAgZWRpdG9yLmluc2VydFRleHQoXCJhYmNcIilcbiAgICAgIGtleWRvd24gJ2VzY2FwZSdcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTIzNDVcXG5hYmNcXG5BQkNERVwiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzIsIDNdKVxuICAgICAga2V5ZG93biAnLidcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTIzNDVcXG5hYmNcXG5hYmNcXG5cIlxuXG4gICAgaXQgXCJpcyB1bmRvYWJsZVwiLCAtPlxuICAgICAga2V5ZG93bignUycsIHNoaWZ0OiB0cnVlKVxuICAgICAgZWRpdG9yLmluc2VydFRleHQoXCJhYmNcIilcbiAgICAgIGtleWRvd24gJ2VzY2FwZSdcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTIzNDVcXG5hYmNcXG5BQkNERVwiXG4gICAgICBrZXlkb3duICd1J1xuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMjM0NVxcbmFiY2RlXFxuQUJDREVcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSkudG9CZSAnJ1xuXG4gICAgaXQgXCJ3b3JrcyB3aGVuIHRoZSBjdXJzb3IncyBnb2FsIGNvbHVtbiBpcyBncmVhdGVyIHRoYW4gaXRzIGN1cnJlbnQgY29sdW1uXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIlxcbjEyMzQ1XCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEsIEluZmluaXR5XSlcbiAgICAgIGVkaXRvci5tb3ZlVXAoKVxuICAgICAga2V5ZG93bihcIlNcIiwgc2hpZnQ6IHRydWUpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShcIlxcbjEyMzQ1XCIpXG5cbiAgICAjIENhbid0IGJlIHRlc3RlZCB3aXRob3V0IHNldHRpbmcgZ3JhbW1hciBvZiB0ZXN0IGJ1ZmZlclxuICAgIHhpdCBcInJlc3BlY3RzIGluZGVudGF0aW9uXCIsIC0+XG5cbiAgZGVzY3JpYmUgXCJ0aGUgZCBrZXliaW5kaW5nXCIsIC0+XG4gICAgaXQgXCJlbnRlcnMgb3BlcmF0b3ItcGVuZGluZyBtb2RlXCIsIC0+XG4gICAgICBrZXlkb3duKCdkJylcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZShmYWxzZSlcblxuICAgIGRlc2NyaWJlIFwid2hlbiBmb2xsb3dlZCBieSBhIGRcIiwgLT5cbiAgICAgIGl0IFwiZGVsZXRlcyB0aGUgY3VycmVudCBsaW5lIGFuZCBleGl0cyBvcGVyYXRvci1wZW5kaW5nIG1vZGVcIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCIxMjM0NVxcbmFiY2RlXFxuXFxuQUJDREVcIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAxXSlcblxuICAgICAgICBrZXlkb3duKCdkJylcbiAgICAgICAga2V5ZG93bignZCcpXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMjM0NVxcblxcbkFCQ0RFXCJcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSBcImFiY2RlXFxuXCJcbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVyYXRvci1wZW5kaW5nLW1vZGUnKSkudG9CZShmYWxzZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICAgIGl0IFwiZGVsZXRlcyB0aGUgbGFzdCBsaW5lXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwiMTIzNDVcXG5hYmNkZVxcbkFCQ0RFXCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMiwgMV0pXG5cbiAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgIGtleWRvd24oJ2QnKVxuXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTIzNDVcXG5hYmNkZVxcblwiXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMiwgMF1cblxuICAgICAgaXQgXCJsZWF2ZXMgdGhlIGN1cnNvciBvbiB0aGUgZmlyc3Qgbm9uYmxhbmsgY2hhcmFjdGVyXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwiMTIzNDVcXG4gIGFiY2RlXFxuXCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgNF0pXG5cbiAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgIGtleWRvd24oJ2QnKVxuXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiICBhYmNkZVxcblwiXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMl1cblxuICAgIGRlc2NyaWJlIFwidW5kbyBiZWhhdmlvclwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBlZGl0b3Iuc2V0VGV4dChcIjEyMzQ1XFxuYWJjZGVcXG5BQkNERVxcblFXRVJUXCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMSwgMV0pXG5cbiAgICAgIGl0IFwidW5kb2VzIGJvdGggbGluZXNcIiwgLT5cbiAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgIGtleWRvd24oJzInKVxuICAgICAgICBrZXlkb3duKCdkJylcblxuICAgICAgICBrZXlkb3duKCd1JylcblxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjEyMzQ1XFxuYWJjZGVcXG5BQkNERVxcblFXRVJUXCJcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSkudG9CZSAnJ1xuXG4gICAgICBkZXNjcmliZSBcIndpdGggbXVsdGlwbGUgY3Vyc29yc1wiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxLCAxXSlcbiAgICAgICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG5cbiAgICAgICAgaXQgXCJpcyB1bmRvbmUgYXMgb25lIG9wZXJhdGlvblwiLCAtPlxuICAgICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICAgIGtleWRvd24oJ2wnKVxuXG4gICAgICAgICAga2V5ZG93bigndScpXG5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjEyMzQ1XFxuYWJjZGVcXG5BQkNERVxcblFXRVJUXCJcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKS50b0JlICcnXG5cbiAgICBkZXNjcmliZSBcIndoZW4gZm9sbG93ZWQgYnkgYSB3XCIsIC0+XG4gICAgICBpdCBcImRlbGV0ZXMgdGhlIG5leHQgd29yZCB1bnRpbCB0aGUgZW5kIG9mIHRoZSBsaW5lIGFuZCBleGl0cyBvcGVyYXRvci1wZW5kaW5nIG1vZGVcIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCJhYmNkIGVmZ1xcbmFiY1wiKVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDVdKVxuXG4gICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICBrZXlkb3duKCd3JylcblxuICAgICAgICAjIEluY29tcGF0aWJpbGl0eSB3aXRoIFZJTS4gSW4gdmltLCBgd2AgYmVoYXZlcyBkaWZmZXJlbnRseSBhcyBhblxuICAgICAgICAjIG9wZXJhdG9yIHRoYW4gYXMgYSBtb3Rpb247IGl0IHN0b3BzIGF0IHRoZSBlbmQgb2YgYSBsaW5lLmV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiYWJjZCBhYmNcIlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcImFiY2QgYWJjXCJcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA1XVxuXG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgICBpdCBcImRlbGV0ZXMgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgbmV4dCB3b3JkXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KCdhYmNkIGVmZycpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMl0pXG5cbiAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgIGtleWRvd24oJ3cnKVxuXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdhYmVmZydcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyXVxuXG4gICAgICAgIGVkaXRvci5zZXRUZXh0KCdvbmUgdHdvIHRocmVlIGZvdXInKVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICBrZXlkb3duKCczJylcbiAgICAgICAga2V5ZG93bigndycpXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ2ZvdXInXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMF1cblxuICAgIGRlc2NyaWJlIFwid2hlbiBmb2xsb3dlZCBieSBhbiBpd1wiLCAtPlxuICAgICAgaXQgXCJkZWxldGVzIHRoZSBjb250YWluaW5nIHdvcmRcIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCIxMjM0NSBhYmNkZSBBQkNERVwiKVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDldKVxuXG4gICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ29wZXJhdG9yLXBlbmRpbmctbW9kZScpKS50b0JlKHRydWUpXG4gICAgICAgIGtleWRvd24oJ2knKVxuICAgICAgICBrZXlkb3duKCd3JylcblxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjEyMzQ1ICBBQkNERVwiXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNl1cbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgXCJhYmNkZVwiXG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGZvbGxvd2VkIGJ5IGEgalwiLCAtPlxuICAgICAgb3JpZ2luYWxUZXh0ID0gXCIxMjM0NVxcbmFiY2RlXFxuQUJDREVcXG5cIlxuXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KG9yaWdpbmFsVGV4dClcblxuICAgICAgZGVzY3JpYmUgXCJvbiB0aGUgYmVnaW5uaW5nIG9mIHRoZSBmaWxlXCIsIC0+XG4gICAgICAgIGl0IFwiZGVsZXRlcyB0aGUgbmV4dCB0d28gbGluZXNcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuICAgICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICAgIGtleWRvd24oJ2onKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKFwiQUJDREVcXG5cIilcblxuICAgICAgZGVzY3JpYmUgXCJvbiB0aGUgZW5kIG9mIHRoZSBmaWxlXCIsIC0+XG4gICAgICAgIGl0IFwiZGVsZXRlcyBub3RoaW5nXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFs0LCAwXSlcbiAgICAgICAgICBrZXlkb3duKCdkJylcbiAgICAgICAgICBrZXlkb3duKCdqJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShvcmlnaW5hbFRleHQpXG5cbiAgICAgIGRlc2NyaWJlIFwib24gdGhlIG1pZGRsZSBvZiBzZWNvbmQgbGluZVwiLCAtPlxuICAgICAgICBpdCBcImRlbGV0ZXMgdGhlIGxhc3QgdHdvIGxpbmVzXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAyXSlcbiAgICAgICAgICBrZXlkb3duKCdkJylcbiAgICAgICAgICBrZXlkb3duKCdqJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShcIjEyMzQ1XFxuXCIpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gZm9sbG93ZWQgYnkgYW4ga1wiLCAtPlxuICAgICAgb3JpZ2luYWxUZXh0ID0gXCIxMjM0NVxcbmFiY2RlXFxuQUJDREVcIlxuXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KG9yaWdpbmFsVGV4dClcblxuICAgICAgZGVzY3JpYmUgXCJvbiB0aGUgZW5kIG9mIHRoZSBmaWxlXCIsIC0+XG4gICAgICAgIGl0IFwiZGVsZXRlcyB0aGUgYm90dG9tIHR3byBsaW5lc1wiLCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMiwgNF0pXG4gICAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgICAga2V5ZG93bignaycpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoXCIxMjM0NVxcblwiKVxuXG4gICAgICBkZXNjcmliZSBcIm9uIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGZpbGVcIiwgLT5cbiAgICAgICAgeGl0IFwiZGVsZXRlcyBub3RoaW5nXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAwXSlcbiAgICAgICAgICBrZXlkb3duKCdkJylcbiAgICAgICAgICBrZXlkb3duKCdrJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShvcmlnaW5hbFRleHQpXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBvbiB0aGUgbWlkZGxlIG9mIHNlY29uZCBsaW5lXCIsIC0+XG4gICAgICAgIGl0IFwiZGVsZXRlcyB0aGUgZmlyc3QgdHdvIGxpbmVzXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAyXSlcbiAgICAgICAgICBrZXlkb3duKCdkJylcbiAgICAgICAgICBrZXlkb3duKCdrJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShcIkFCQ0RFXCIpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gZm9sbG93ZWQgYnkgYSBHXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIG9yaWdpbmFsVGV4dCA9IFwiMTIzNDVcXG5hYmNkZVxcbkFCQ0RFXCJcbiAgICAgICAgZWRpdG9yLnNldFRleHQob3JpZ2luYWxUZXh0KVxuXG4gICAgICBkZXNjcmliZSBcIm9uIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHNlY29uZCBsaW5lXCIsIC0+XG4gICAgICAgIGl0IFwiZGVsZXRlcyB0aGUgYm90dG9tIHR3byBsaW5lc1wiLCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMSwgMF0pXG4gICAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgICAga2V5ZG93bignRycsIHNoaWZ0OiB0cnVlKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKFwiMTIzNDVcXG5cIilcblxuICAgICAgZGVzY3JpYmUgXCJvbiB0aGUgbWlkZGxlIG9mIHRoZSBzZWNvbmQgbGluZVwiLCAtPlxuICAgICAgICBpdCBcImRlbGV0ZXMgdGhlIGJvdHRvbSB0d28gbGluZXNcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDJdKVxuICAgICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICAgIGtleWRvd24oJ0cnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShcIjEyMzQ1XFxuXCIpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gZm9sbG93ZWQgYnkgYSBnb3RvIGxpbmUgR1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBvcmlnaW5hbFRleHQgPSBcIjEyMzQ1XFxuYWJjZGVcXG5BQkNERVwiXG4gICAgICAgIGVkaXRvci5zZXRUZXh0KG9yaWdpbmFsVGV4dClcblxuICAgICAgZGVzY3JpYmUgXCJvbiB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzZWNvbmQgbGluZVwiLCAtPlxuICAgICAgICBpdCBcImRlbGV0ZXMgdGhlIGJvdHRvbSB0d28gbGluZXNcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDBdKVxuICAgICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICAgIGtleWRvd24oJzInKVxuICAgICAgICAgIGtleWRvd24oJ0cnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShcIjEyMzQ1XFxuQUJDREVcIilcblxuICAgICAgZGVzY3JpYmUgXCJvbiB0aGUgbWlkZGxlIG9mIHRoZSBzZWNvbmQgbGluZVwiLCAtPlxuICAgICAgICBpdCBcImRlbGV0ZXMgdGhlIGJvdHRvbSB0d28gbGluZXNcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDJdKVxuICAgICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICAgIGtleWRvd24oJzInKVxuICAgICAgICAgIGtleWRvd24oJ0cnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShcIjEyMzQ1XFxuQUJDREVcIilcblxuICAgIGRlc2NyaWJlIFwid2hlbiBmb2xsb3dlZCBieSBhIHQpXCIsIC0+XG4gICAgICBkZXNjcmliZSBcIndpdGggdGhlIGVudGlyZSBsaW5lIHlhbmtlZCBiZWZvcmVcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRUZXh0KFwidGVzdCAoeHl6KVwiKVxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgNl0pXG5cbiAgICAgICAgaXQgXCJkZWxldGVzIHVudGlsIHRoZSBjbG9zaW5nIHBhcmVudGhlc2lzXCIsIC0+XG4gICAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgICAga2V5ZG93bigndCcpXG4gICAgICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignKScpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoXCJ0ZXN0ICgpXCIpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA2XVxuXG4gICAgZGVzY3JpYmUgXCJ3aXRoIG11bHRpcGxlIGN1cnNvcnNcIiwgLT5cbiAgICAgIGl0IFwiZGVsZXRlcyBlYWNoIHNlbGVjdGlvblwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0VGV4dChcImFiY2RcXG4xMjM0XFxuQUJDRFxcblwiKVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDFdKVxuICAgICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbihbMSwgMl0pXG4gICAgICAgIGVkaXRvci5hZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uKFsyLCAzXSlcblxuICAgICAgICBrZXlkb3duKCdkJylcbiAgICAgICAga2V5ZG93bignZScpXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJhXFxuMTJcXG5BQkNcIlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpKS50b0VxdWFsIFtcbiAgICAgICAgICBbMCwgMF0sXG4gICAgICAgICAgWzEsIDFdLFxuICAgICAgICAgIFsyLCAyXSxcbiAgICAgICAgXVxuXG4gICAgICBpdCBcImRvZXNuJ3QgZGVsZXRlIGVtcHR5IHNlbGVjdGlvbnNcIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCJhYmNkXFxuYWJjXFxuYWJkXCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICAgIGVkaXRvci5hZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uKFsxLCAwXSlcbiAgICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24oWzIsIDBdKVxuXG4gICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICBrZXlkb3duKCd0JylcbiAgICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignZCcpXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJkXFxuYWJjXFxuZFwiXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKCkpLnRvRXF1YWwgW1xuICAgICAgICAgIFswLCAwXSxcbiAgICAgICAgICBbMSwgMF0sXG4gICAgICAgICAgWzIsIDBdLFxuICAgICAgICBdXG5cbiAgZGVzY3JpYmUgXCJ0aGUgRCBrZXliaW5kaW5nXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNldFRleHQoXCIwMTJcXG5cIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMV0pXG4gICAgICBrZXlkb3duKCdEJywgc2hpZnQ6IHRydWUpXG5cbiAgICBpdCBcImRlbGV0ZXMgdGhlIGNvbnRlbnRzIHVudGlsIHRoZSBlbmQgb2YgdGhlIGxpbmVcIiwgLT5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMFxcblwiXG5cbiAgZGVzY3JpYmUgXCJ0aGUgYyBrZXliaW5kaW5nXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCIxMjM0NVxcbmFiY2RlXFxuQUJDREVcIilcblxuICAgIGRlc2NyaWJlIFwid2hlbiBmb2xsb3dlZCBieSBhIGNcIiwgLT5cbiAgICAgIGRlc2NyaWJlIFwid2l0aCBhdXRvaW5kZW50XCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChcIjEyMzQ1XFxuICBhYmNkZVxcbkFCQ0RFXCIpXG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAxXSlcbiAgICAgICAgICBzcHlPbihlZGl0b3IsICdzaG91bGRBdXRvSW5kZW50JykuYW5kUmV0dXJuKHRydWUpXG4gICAgICAgICAgc3B5T24oZWRpdG9yLCAnYXV0b0luZGVudEJ1ZmZlclJvdycpLmFuZENhbGxGYWtlIChsaW5lKSAtPlxuICAgICAgICAgICAgZWRpdG9yLmluZGVudCgpXG4gICAgICAgICAgc3B5T24oZWRpdG9yLmxhbmd1YWdlTW9kZSwgJ3N1Z2dlc3RlZEluZGVudEZvckxpbmVBdEJ1ZmZlclJvdycpLmFuZENhbGxGYWtlIC0+IDFcblxuICAgICAgICBpdCBcImRlbGV0ZXMgdGhlIGN1cnJlbnQgbGluZSBhbmQgZW50ZXJzIGluc2VydCBtb2RlXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAxXSlcblxuICAgICAgICAgIGtleWRvd24oJ2MnKVxuICAgICAgICAgIGtleWRvd24oJ2MnKVxuXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMjM0NVxcbiAgXFxuQUJDREVcIlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMl1cbiAgICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICAgICAgaXQgXCJpcyByZXBlYXRhYmxlXCIsIC0+XG4gICAgICAgICAga2V5ZG93bignYycpXG4gICAgICAgICAga2V5ZG93bignYycpXG4gICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoXCJhYmNcIilcbiAgICAgICAgICBrZXlkb3duICdlc2NhcGUnXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMjM0NVxcbiAgYWJjXFxuQUJDREVcIlxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMiwgM10pXG4gICAgICAgICAga2V5ZG93biAnLidcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjEyMzQ1XFxuICBhYmNcXG4gIGFiY1xcblwiXG5cbiAgICAgICAgaXQgXCJpcyB1bmRvYWJsZVwiLCAtPlxuICAgICAgICAgIGtleWRvd24oJ2MnKVxuICAgICAgICAgIGtleWRvd24oJ2MnKVxuICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KFwiYWJjXCIpXG4gICAgICAgICAga2V5ZG93biAnZXNjYXBlJ1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTIzNDVcXG4gIGFiY1xcbkFCQ0RFXCJcbiAgICAgICAgICBrZXlkb3duICd1J1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTIzNDVcXG4gIGFiY2RlXFxuQUJDREVcIlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpLnRvQmUgJydcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBjdXJzb3IgaXMgb24gdGhlIGxhc3QgbGluZVwiLCAtPlxuICAgICAgICBpdCBcImRlbGV0ZXMgdGhlIGxpbmUncyBjb250ZW50IGFuZCBlbnRlcnMgaW5zZXJ0IG1vZGUgb24gdGhlIGxhc3QgbGluZVwiLCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMiwgMV0pXG5cbiAgICAgICAgICBrZXlkb3duKCdjJylcbiAgICAgICAgICBrZXlkb3duKCdjJylcblxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTIzNDVcXG5hYmNkZVxcblxcblwiXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsyLCAwXVxuICAgICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZShmYWxzZSlcbiAgICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2luc2VydC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBjdXJzb3IgaXMgb24gdGhlIG9ubHkgbGluZVwiLCAtPlxuICAgICAgICBpdCBcImRlbGV0ZXMgdGhlIGxpbmUncyBjb250ZW50IGFuZCBlbnRlcnMgaW5zZXJ0IG1vZGVcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChcIjEyMzQ1XCIpXG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAyXSlcblxuICAgICAgICAgIGtleWRvd24oJ2MnKVxuICAgICAgICAgIGtleWRvd24oJ2MnKVxuXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMF1cbiAgICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gZm9sbG93ZWQgYnkgaSB3XCIsIC0+XG4gICAgICBpdCBcInVuZG8ncyBhbmQgcmVkbydzIGNvbXBsZXRlbHlcIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAxXSlcblxuICAgICAgICBrZXlkb3duKCdjJylcbiAgICAgICAga2V5ZG93bignaScpXG4gICAgICAgIGtleWRvd24oJ3cnKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjEyMzQ1XFxuXFxuQUJDREVcIlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaW5zZXJ0LW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgICAgICMgSnVzdCBjYW5ub3QgZ2V0IFwidHlwaW5nXCIgdG8gd29yayBjb3JyZWN0bHkgaW4gdGVzdC5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCIxMjM0NVxcbmZnXFxuQUJDREVcIilcbiAgICAgICAga2V5ZG93bignZXNjYXBlJylcbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTIzNDVcXG5mZ1xcbkFCQ0RFXCJcblxuICAgICAgICBrZXlkb3duKCd1JylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMjM0NVxcbmFiY2RlXFxuQUJDREVcIlxuICAgICAgICBrZXlkb3duKCdyJywgY3RybDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMjM0NVxcbmZnXFxuQUJDREVcIlxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGZvbGxvd2VkIGJ5IGEgd1wiLCAtPlxuICAgICAgaXQgXCJjaGFuZ2VzIHRoZSB3b3JkXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwid29yZDEgd29yZDIgd29yZDNcIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCBcIndvcmQxIHdcIi5sZW5ndGhdKVxuXG4gICAgICAgIGtleWRvd24oXCJjXCIpXG4gICAgICAgIGtleWRvd24oXCJ3XCIpXG4gICAgICAgIGtleWRvd24oXCJlc2NhcGVcIilcblxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIndvcmQxIHcgd29yZDNcIlxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGZvbGxvd2VkIGJ5IGEgR1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBvcmlnaW5hbFRleHQgPSBcIjEyMzQ1XFxuYWJjZGVcXG5BQkNERVwiXG4gICAgICAgIGVkaXRvci5zZXRUZXh0KG9yaWdpbmFsVGV4dClcblxuICAgICAgZGVzY3JpYmUgXCJvbiB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzZWNvbmQgbGluZVwiLCAtPlxuICAgICAgICBpdCBcImRlbGV0ZXMgdGhlIGJvdHRvbSB0d28gbGluZXNcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDBdKVxuICAgICAgICAgIGtleWRvd24oJ2MnKVxuICAgICAgICAgIGtleWRvd24oJ0cnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgICBrZXlkb3duKCdlc2NhcGUnKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKFwiMTIzNDVcXG5cXG5cIilcblxuICAgICAgZGVzY3JpYmUgXCJvbiB0aGUgbWlkZGxlIG9mIHRoZSBzZWNvbmQgbGluZVwiLCAtPlxuICAgICAgICBpdCBcImRlbGV0ZXMgdGhlIGJvdHRvbSB0d28gbGluZXNcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDJdKVxuICAgICAgICAgIGtleWRvd24oJ2MnKVxuICAgICAgICAgIGtleWRvd24oJ0cnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgICBrZXlkb3duKCdlc2NhcGUnKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKFwiMTIzNDVcXG5cXG5cIilcblxuICAgIGRlc2NyaWJlIFwid2hlbiBmb2xsb3dlZCBieSBhICVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCIxMjM0NSg2Nyk4XFxuYWJjKGQpZVxcbkEoKUJDREVcIilcblxuICAgICAgZGVzY3JpYmUgXCJiZWZvcmUgYnJhY2tldHMgb3Igb24gdGhlIGZpcnN0IG9uZVwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAxXSlcbiAgICAgICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRTY3JlZW5Qb3NpdGlvbihbMSwgMV0pXG4gICAgICAgICAgZWRpdG9yLmFkZEN1cnNvckF0U2NyZWVuUG9zaXRpb24oWzIsIDFdKVxuICAgICAgICAgIGtleWRvd24oJ2MnKVxuICAgICAgICAgIGtleWRvd24oJyUnKVxuICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCd4JylcblxuICAgICAgICBpdCBcInJlcGxhY2VzIGluY2x1c2l2ZWx5IHVudGlsIG1hdGNoaW5nIGJyYWNrZXRcIiwgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShcIjF4OFxcbmF4ZVxcbkF4QkNERVwiKVxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5tb2RlKS50b0JlIFwiaW5zZXJ0XCJcblxuICAgICAgICBpdCBcInVuZG9lcyBjb3JyZWN0bHkgd2l0aCB1XCIsIC0+XG4gICAgICAgICAga2V5ZG93bignZXNjYXBlJylcbiAgICAgICAgICBleHBlY3QodmltU3RhdGUubW9kZSkudG9CZSBcIm5vcm1hbFwiXG4gICAgICAgICAga2V5ZG93biAndSdcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShcIjEyMzQ1KDY3KThcXG5hYmMoZCllXFxuQSgpQkNERVwiKVxuXG4gICAgICBkZXNjcmliZSBcImluc2lkZSBicmFja2V0cyBvciBvbiB0aGUgZW5kaW5nIG9uZVwiLCAtPlxuICAgICAgICBpdCBcInJlcGxhY2VzIGluY2x1c2l2ZWx5IGJhY2t3YXJkcyB1bnRpbCBtYXRjaGluZyBicmFja2V0XCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCA2XSlcbiAgICAgICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRTY3JlZW5Qb3NpdGlvbihbMSwgNV0pXG4gICAgICAgICAgZWRpdG9yLmFkZEN1cnNvckF0U2NyZWVuUG9zaXRpb24oWzIsIDJdKVxuICAgICAgICAgIGtleWRvd24oJ2MnKVxuICAgICAgICAgIGtleWRvd24oJyUnKVxuICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCd4JylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShcIjEyMzQ1eDcpOFxcbmFiY3hlXFxuQXhCQ0RFXCIpXG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLm1vZGUpLnRvQmUgXCJpbnNlcnRcIlxuXG4gICAgICBkZXNjcmliZSBcImFmdGVyIG9yIHdpdGhvdXQgYnJhY2tldHNcIiwgLT5cbiAgICAgICAgaXQgXCJkZWxldGVzIG5vdGhpbmdcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChcIjEyMzQ1KDY3KThcXG5hYmMoZCllXFxuQUJDREVcIilcbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDldKVxuICAgICAgICAgIGVkaXRvci5hZGRDdXJzb3JBdFNjcmVlblBvc2l0aW9uKFsyLCAyXSlcbiAgICAgICAgICBrZXlkb3duKCdjJylcbiAgICAgICAgICBrZXlkb3duKCclJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShcIjEyMzQ1KDY3KThcXG5hYmMoZCllXFxuQUJDREVcIilcbiAgICAgICAgICBleHBlY3QodmltU3RhdGUubW9kZSkudG9CZSBcIm5vcm1hbFwiXG5cbiAgICAgIGRlc2NyaWJlIFwicmVwZXRpdGlvbiB3aXRoIC5cIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMV0pXG4gICAgICAgICAga2V5ZG93bignYycpXG4gICAgICAgICAga2V5ZG93bignJScpXG4gICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ3gnKVxuICAgICAgICAgIGtleWRvd24oJ2VzY2FwZScpXG5cbiAgICAgICAgaXQgXCJyZXBlYXRzIGNvcnJlY3RseSBiZWZvcmUgYSBicmFja2V0XCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAwXSlcbiAgICAgICAgICBrZXlkb3duKCcuJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShcIjF4OFxcbnhlXFxuQSgpQkNERVwiKVxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5tb2RlKS50b0JlIFwibm9ybWFsXCJcblxuICAgICAgICBpdCBcInJlcGVhdHMgY29ycmVjdGx5IG9uIHRoZSBvcGVuaW5nIGJyYWNrZXRcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDNdKVxuICAgICAgICAgIGtleWRvd24oJy4nKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKFwiMXg4XFxuYWJjeGVcXG5BKClCQ0RFXCIpXG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLm1vZGUpLnRvQmUgXCJub3JtYWxcIlxuXG4gICAgICAgIGl0IFwicmVwZWF0cyBjb3JyZWN0bHkgaW5zaWRlIGJyYWNrZXRzXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCA0XSlcbiAgICAgICAgICBrZXlkb3duKCcuJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShcIjF4OFxcbmFiY3gpZVxcbkEoKUJDREVcIilcbiAgICAgICAgICBleHBlY3QodmltU3RhdGUubW9kZSkudG9CZSBcIm5vcm1hbFwiXG5cbiAgICAgICAgaXQgXCJyZXBlYXRzIGNvcnJlY3RseSBvbiB0aGUgY2xvc2luZyBicmFja2V0XCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCA1XSlcbiAgICAgICAgICBrZXlkb3duKCcuJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShcIjF4OFxcbmFiY3hlXFxuQSgpQkNERVwiKVxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5tb2RlKS50b0JlIFwibm9ybWFsXCJcblxuICAgICAgICBpdCBcImRvZXMgbm90aGluZyB3aGVuIHJlcGVhdGVkIGFmdGVyIGEgYnJhY2tldFwiLCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMiwgM10pXG4gICAgICAgICAga2V5ZG93bignLicpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoXCIxeDhcXG5hYmMoZCllXFxuQSgpQkNERVwiKVxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5tb2RlKS50b0JlIFwibm9ybWFsXCJcblxuICAgIGRlc2NyaWJlIFwid2hlbiBmb2xsb3dlZCBieSBhIGdvdG8gbGluZSBHXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0IFwiMTIzNDVcXG5hYmNkZVxcbkFCQ0RFXCJcblxuICAgICAgZGVzY3JpYmUgXCJvbiB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzZWNvbmQgbGluZVwiLCAtPlxuICAgICAgICBpdCBcImRlbGV0ZXMgYWxsIHRoZSB0ZXh0IG9uIHRoZSBsaW5lXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAwXSlcbiAgICAgICAgICBrZXlkb3duKCdjJylcbiAgICAgICAgICBrZXlkb3duKCcyJylcbiAgICAgICAgICBrZXlkb3duKCdHJywgc2hpZnQ6IHRydWUpXG4gICAgICAgICAga2V5ZG93bignZXNjYXBlJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShcIjEyMzQ1XFxuXFxuQUJDREVcIilcblxuICAgICAgZGVzY3JpYmUgXCJvbiB0aGUgbWlkZGxlIG9mIHRoZSBzZWNvbmQgbGluZVwiLCAtPlxuICAgICAgICBpdCBcImRlbGV0ZXMgYWxsIHRoZSB0ZXh0IG9uIHRoZSBsaW5lXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAyXSlcbiAgICAgICAgICBrZXlkb3duKCdjJylcbiAgICAgICAgICBrZXlkb3duKCcyJylcbiAgICAgICAgICBrZXlkb3duKCdHJywgc2hpZnQ6IHRydWUpXG4gICAgICAgICAga2V5ZG93bignZXNjYXBlJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZShcIjEyMzQ1XFxuXFxuQUJDREVcIilcblxuICAgIGRlc2NyaWJlIFwiaW4gdmlzdWFsIG1vZGVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQgXCIxMjM0NTY3ODlcXG5hYmNkZVxcbmZnaGlqa2xtbm9wcVxcbnV2d3h5elwiXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbiBbMSwgMV1cblxuICAgICAgZGVzY3JpYmUgXCJ3aXRoIGNoYXJhY3Rlcndpc2Ugc2VsZWN0aW9uIG9uIGEgc2luZ2xlIGxpbmVcIiwgLT5cbiAgICAgICAgaXQgXCJyZXBlYXRzIHdpdGggLlwiLCAtPlxuICAgICAgICAgIGtleWRvd24gJ3YnXG4gICAgICAgICAga2V5ZG93biAnMidcbiAgICAgICAgICBrZXlkb3duICdsJ1xuICAgICAgICAgIGtleWRvd24gJ2MnXG4gICAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJhYlwiXG4gICAgICAgICAga2V5ZG93biAnZXNjYXBlJ1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTIzNDU2Nzg5XFxuYWFiZVxcbmZnaGlqa2xtbm9wcVxcbnV2d3h5elwiXG5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24gWzAsIDFdXG4gICAgICAgICAga2V5ZG93biAnLidcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjFhYjU2Nzg5XFxuYWFiZVxcbmZnaGlqa2xtbm9wcVxcbnV2d3h5elwiXG5cbiAgICAgICAgaXQgXCJyZXBlYXRzIHNob3J0ZW5lZCB3aXRoIC4gbmVhciB0aGUgZW5kIG9mIHRoZSBsaW5lXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uIFswLCAyXVxuICAgICAgICAgIGtleWRvd24gJ3YnXG4gICAgICAgICAga2V5ZG93biAnNCdcbiAgICAgICAgICBrZXlkb3duICdsJ1xuICAgICAgICAgIGtleWRvd24gJ2MnXG4gICAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJhYlwiXG4gICAgICAgICAga2V5ZG93biAnZXNjYXBlJ1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTJhYjg5XFxuYWJjZGVcXG5mZ2hpamtsbW5vcHFcXG51dnd4eXpcIlxuXG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uIFsxLCAzXVxuICAgICAgICAgIGtleWRvd24gJy4nXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMmFiODlcXG5hYmNhYlxcbmZnaGlqa2xtbm9wcVxcbnV2d3h5elwiXG5cbiAgICAgICAgaXQgXCJyZXBlYXRzIHNob3J0ZW5lZCB3aXRoIC4gbmVhciB0aGUgZW5kIG9mIHRoZSBsaW5lIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciBtb3Rpb24gd3JhcHBpbmcgaXMgZW5hYmxlZFwiLCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgndmltLW1vZGUud3JhcExlZnRSaWdodE1vdGlvbicsIHRydWUpXG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uIFswLCAyXVxuICAgICAgICAgIGtleWRvd24gJ3YnXG4gICAgICAgICAga2V5ZG93biAnNCdcbiAgICAgICAgICBrZXlkb3duICdsJ1xuICAgICAgICAgIGtleWRvd24gJ2MnXG4gICAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJhYlwiXG4gICAgICAgICAga2V5ZG93biAnZXNjYXBlJ1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTJhYjg5XFxuYWJjZGVcXG5mZ2hpamtsbW5vcHFcXG51dnd4eXpcIlxuXG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uIFsxLCAzXVxuICAgICAgICAgIGtleWRvd24gJy4nXG4gICAgICAgICAgIyB0aGlzIGRpZmZlcnMgZnJvbSBWSU0sIHdoaWNoIHdvdWxkIGVhdCB0aGUgXFxuIGJlZm9yZSBmZ2hpai4uLlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTJhYjg5XFxuYWJjYWJcXG5mZ2hpamtsbW5vcHFcXG51dnd4eXpcIlxuXG4gICAgICBkZXNjcmliZSBcImlzIHJlcGVhdGFibGUgd2l0aCBjaGFyYWN0ZXJ3aXNlIHNlbGVjdGlvbiBvdmVyIG11bHRpcGxlIGxpbmVzXCIsIC0+XG4gICAgICAgIGl0IFwicmVwZWF0cyB3aXRoIC5cIiwgLT5cbiAgICAgICAgICBrZXlkb3duICd2J1xuICAgICAgICAgIGtleWRvd24gJ2onXG4gICAgICAgICAga2V5ZG93biAnMydcbiAgICAgICAgICBrZXlkb3duICdsJ1xuICAgICAgICAgIGtleWRvd24gJ2MnXG4gICAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJ4XCJcbiAgICAgICAgICBrZXlkb3duICdlc2NhcGUnXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMjM0NTY3ODlcXG5heGtsbW5vcHFcXG51dnd4eXpcIlxuXG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uIFswLCAxXVxuICAgICAgICAgIGtleWRvd24gJy4nXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxeG5vcHFcXG51dnd4eXpcIlxuXG4gICAgICAgIGl0IFwicmVwZWF0cyBzaG9ydGVuZWQgd2l0aCAuIG5lYXIgdGhlIGVuZCBvZiB0aGUgbGluZVwiLCAtPlxuICAgICAgICAgICMgdGhpcyBiZWhhdmlvdXIgaXMgdW5saWtlIFZJTSwgc2VlICM3MzdcbiAgICAgICAgICBrZXlkb3duICd2J1xuICAgICAgICAgIGtleWRvd24gJ2onXG4gICAgICAgICAga2V5ZG93biAnNidcbiAgICAgICAgICBrZXlkb3duICdsJ1xuICAgICAgICAgIGtleWRvd24gJ2MnXG4gICAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJ4XCJcbiAgICAgICAgICBrZXlkb3duICdlc2NhcGUnXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMjM0NTY3ODlcXG5heG5vcHFcXG51dnd4eXpcIlxuXG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uIFswLCAxXVxuICAgICAgICAgIGtleWRvd24gJy4nXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxeFxcbnV2d3h5elwiXG5cbiAgICAgIGRlc2NyaWJlIFwiaXMgcmVwZWF0YWJsZSB3aXRoIGxpbmV3aXNlIHNlbGVjdGlvblwiLCAtPlxuICAgICAgICBkZXNjcmliZSBcIndpdGggb25lIGxpbmUgc2VsZWN0ZWRcIiwgLT5cbiAgICAgICAgICBpdCBcInJlcGVhdHMgd2l0aCAuXCIsIC0+XG4gICAgICAgICAgICBrZXlkb3duICdWJywgc2hpZnQ6IHRydWVcbiAgICAgICAgICAgIGtleWRvd24gJ2MnXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcInhcIlxuICAgICAgICAgICAga2V5ZG93biAnZXNjYXBlJ1xuICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMjM0NTY3ODlcXG54XFxuZmdoaWprbG1ub3BxXFxudXZ3eHl6XCJcblxuICAgICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uIFswLCA3XVxuICAgICAgICAgICAga2V5ZG93biAnLidcbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwieFxcbnhcXG5mZ2hpamtsbW5vcHFcXG51dnd4eXpcIlxuXG4gICAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24gWzIsIDBdXG4gICAgICAgICAgICBrZXlkb3duICcuJ1xuICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJ4XFxueFxcbnhcXG51dnd4eXpcIlxuXG4gICAgICAgIGRlc2NyaWJlIFwid2l0aCBtdWx0aXBsZSBsaW5lcyBzZWxlY3RlZFwiLCAtPlxuICAgICAgICAgIGl0IFwicmVwZWF0cyB3aXRoIC5cIiwgLT5cbiAgICAgICAgICAgIGtleWRvd24gJ1YnLCBzaGlmdDogdHJ1ZVxuICAgICAgICAgICAga2V5ZG93biAnaidcbiAgICAgICAgICAgIGtleWRvd24gJ2MnXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcInhcIlxuICAgICAgICAgICAga2V5ZG93biAnZXNjYXBlJ1xuICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMjM0NTY3ODlcXG54XFxudXZ3eHl6XCJcblxuICAgICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uIFswLCA3XVxuICAgICAgICAgICAga2V5ZG93biAnLidcbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwieFxcbnV2d3h5elwiXG5cbiAgICAgICAgICBpdCBcInJlcGVhdHMgc2hvcnRlbmVkIHdpdGggLiBuZWFyIHRoZSBlbmQgb2YgdGhlIGZpbGVcIiwgLT5cbiAgICAgICAgICAgIGtleWRvd24gJ1YnLCBzaGlmdDogdHJ1ZVxuICAgICAgICAgICAga2V5ZG93biAnaidcbiAgICAgICAgICAgIGtleWRvd24gJ2MnXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcInhcIlxuICAgICAgICAgICAga2V5ZG93biAnZXNjYXBlJ1xuICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMjM0NTY3ODlcXG54XFxudXZ3eHl6XCJcblxuICAgICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uIFsxLCA3XVxuICAgICAgICAgICAga2V5ZG93biAnLidcbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTIzNDU2Nzg5XFxueFxcblwiXG5cbiAgICAgIHhkZXNjcmliZSBcImlzIHJlcGVhdGFibGUgd2l0aCBibG9jayBzZWxlY3Rpb25cIiwgLT5cbiAgICAgICAgIyB0aGVyZSBpcyBubyBibG9jayBzZWxlY3Rpb24geWV0XG5cbiAgZGVzY3JpYmUgXCJ0aGUgQyBrZXliaW5kaW5nXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNldFRleHQoXCIwMTJcXG5cIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMV0pXG4gICAgICBrZXlkb3duKCdDJywgc2hpZnQ6IHRydWUpXG5cbiAgICBpdCBcImRlbGV0ZXMgdGhlIGNvbnRlbnRzIHVudGlsIHRoZSBlbmQgb2YgdGhlIGxpbmUgYW5kIGVudGVycyBpbnNlcnQgbW9kZVwiLCAtPlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIwXFxuXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMV1cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaW5zZXJ0LW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gIGRlc2NyaWJlIFwidGhlIHkga2V5YmluZGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5zZXRUZXh0KFwiMDEyIDM0NVxcbmFiY1xcbmRlZmdcXG5cIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgNF0pXG4gICAgICB2aW1TdGF0ZS5zZXRSZWdpc3RlcignXCInLCB0ZXh0OiAnMzQ1JylcblxuICAgIGRlc2NyaWJlIFwid2hlbiBzZWxlY3RlZCBsaW5lcyBpbiB2aXN1YWwgbGluZXdpc2UgbW9kZVwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBrZXlkb3duKCdWJywgc2hpZnQ6IHRydWUpXG4gICAgICAgIGtleWRvd24oJ2onKVxuICAgICAgICBrZXlkb3duKCd5JylcblxuICAgICAgaXQgXCJpcyBpbiBsaW5ld2lzZSBtb3Rpb25cIiwgLT5cbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnR5cGUpLnRvRXF1YWwgXCJsaW5ld2lzZVwiXG5cbiAgICAgIGl0IFwic2F2ZXMgdGhlIGxpbmVzIHRvIHRoZSBkZWZhdWx0IHJlZ2lzdGVyXCIsIC0+XG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlIFwiMDEyIDM0NVxcbmFiY1xcblwiXG5cbiAgICAgIGl0IFwicGxhY2VzIHRoZSBjdXJzb3IgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgc2VsZWN0aW9uXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKCkpLnRvRXF1YWwoW1swLCAwXV0pXG5cbiAgICBkZXNjcmliZSBcIndoZW4gZm9sbG93ZWQgYnkgYSBzZWNvbmQgeSBcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgIGtleWRvd24oJ3knKVxuXG4gICAgICBpdCBcInNhdmVzIHRoZSBsaW5lIHRvIHRoZSBkZWZhdWx0IHJlZ2lzdGVyXCIsIC0+XG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlIFwiMDEyIDM0NVxcblwiXG5cbiAgICAgIGl0IFwibGVhdmVzIHRoZSBjdXJzb3IgYXQgdGhlIHN0YXJ0aW5nIHBvc2l0aW9uXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNF1cblxuICAgIGRlc2NyaWJlIFwid2hlbiB1c2VDbGlwYm9hcmRBc0RlZmF1bHRSZWdpc3RlciBlbmFibGVkXCIsIC0+XG4gICAgICBpdCBcIndyaXRlcyB0byBjbGlwYm9hcmRcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0ICd2aW0tbW9kZS51c2VDbGlwYm9hcmRBc0RlZmF1bHRSZWdpc3RlcicsIHRydWVcbiAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgIGtleWRvd24oJ3knKVxuICAgICAgICBleHBlY3QoYXRvbS5jbGlwYm9hcmQucmVhZCgpKS50b0JlICcwMTIgMzQ1XFxuJ1xuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGZvbGxvd2VkIHdpdGggYSByZXBlYXRlZCB5XCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGtleWRvd24oJ3knKVxuICAgICAgICBrZXlkb3duKCcyJylcbiAgICAgICAga2V5ZG93bigneScpXG5cbiAgICAgIGl0IFwiY29waWVzIG4gbGluZXMsIHN0YXJ0aW5nIGZyb20gdGhlIGN1cnJlbnRcIiwgLT5cbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgXCIwMTIgMzQ1XFxuYWJjXFxuXCJcblxuICAgICAgaXQgXCJsZWF2ZXMgdGhlIGN1cnNvciBhdCB0aGUgc3RhcnRpbmcgcG9zaXRpb25cIiwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA0XVxuXG4gICAgZGVzY3JpYmUgXCJ3aXRoIGEgcmVnaXN0ZXJcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAga2V5ZG93bignXCInKVxuICAgICAgICBrZXlkb3duKCdhJylcbiAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgIGtleWRvd24oJ3knKVxuXG4gICAgICBpdCBcInNhdmVzIHRoZSBsaW5lIHRvIHRoZSBhIHJlZ2lzdGVyXCIsIC0+XG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignYScpLnRleHQpLnRvQmUgXCIwMTIgMzQ1XFxuXCJcblxuICAgICAgaXQgXCJhcHBlbmRzIHRoZSBsaW5lIHRvIHRoZSBBIHJlZ2lzdGVyXCIsIC0+XG4gICAgICAgIGtleWRvd24oJ1wiJylcbiAgICAgICAga2V5ZG93bignQScsIHNoaWZ0OiB0cnVlKVxuICAgICAgICBrZXlkb3duKCd5JylcbiAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignYScpLnRleHQpLnRvQmUgXCIwMTIgMzQ1XFxuMDEyIDM0NVxcblwiXG5cbiAgICBkZXNjcmliZSBcIndpdGggYSBmb3J3YXJkIG1vdGlvblwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBrZXlkb3duKCd5JylcbiAgICAgICAga2V5ZG93bignZScpXG5cbiAgICAgIGl0IFwic2F2ZXMgdGhlIHNlbGVjdGVkIHRleHQgdG8gdGhlIGRlZmF1bHQgcmVnaXN0ZXJcIiwgLT5cbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgJzM0NSdcblxuICAgICAgaXQgXCJsZWF2ZXMgdGhlIGN1cnNvciBhdCB0aGUgc3RhcnRpbmcgcG9zaXRpb25cIiwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA0XVxuXG4gICAgICBpdCBcImRvZXMgbm90IHlhbmsgd2hlbiBtb3Rpb24gZmFpbHNcIiwgLT5cbiAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgIGtleWRvd24oJ3QnKVxuICAgICAgICBub3JtYWxNb2RlSW5wdXRLZXlkb3duKCd4JylcbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgJzM0NSdcblxuICAgIGRlc2NyaWJlIFwid2l0aCBhIHRleHQgb2JqZWN0XCIsIC0+XG4gICAgICBpdCBcIm1vdmVzIHRoZSBjdXJzb3IgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgdGV4dCBvYmplY3RcIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCA1XSlcbiAgICAgICAga2V5ZG93bihcInlcIilcbiAgICAgICAga2V5ZG93bihcImlcIilcbiAgICAgICAga2V5ZG93bihcIndcIilcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKSkudG9FcXVhbChbWzAsIDRdXSlcblxuICAgIGRlc2NyaWJlIFwid2l0aCBhIGxlZnQgbW90aW9uXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGtleWRvd24oJ3knKVxuICAgICAgICBrZXlkb3duKCdoJylcblxuICAgICAgaXQgXCJzYXZlcyB0aGUgbGVmdCBsZXR0ZXIgdG8gdGhlIGRlZmF1bHQgcmVnaXN0ZXJcIiwgLT5cbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgXCIgXCJcblxuICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHBvc2l0aW9uIHRvIHRoZSBsZWZ0XCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgM11cblxuICAgIGRlc2NyaWJlIFwid2l0aCBhIGRvd24gbW90aW9uXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGtleWRvd24gJ3knXG4gICAgICAgIGtleWRvd24gJ2onXG5cbiAgICAgIGl0IFwic2F2ZXMgYm90aCBmdWxsIGxpbmVzIHRvIHRoZSBkZWZhdWx0IHJlZ2lzdGVyXCIsIC0+XG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlIFwiMDEyIDM0NVxcbmFiY1xcblwiXG5cbiAgICAgIGl0IFwibGVhdmVzIHRoZSBjdXJzb3IgYXQgdGhlIHN0YXJ0aW5nIHBvc2l0aW9uXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNF1cblxuICAgIGRlc2NyaWJlIFwid2l0aCBhbiB1cCBtb3Rpb25cIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsyLCAyXSlcbiAgICAgICAga2V5ZG93biAneSdcbiAgICAgICAga2V5ZG93biAnaydcblxuICAgICAgaXQgXCJzYXZlcyBib3RoIGZ1bGwgbGluZXMgdG8gdGhlIGRlZmF1bHQgcmVnaXN0ZXJcIiwgLT5cbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgXCJhYmNcXG5kZWZnXFxuXCJcblxuICAgICAgaXQgXCJwdXRzIHRoZSBjdXJzb3Igb24gdGhlIGZpcnN0IGxpbmUgYW5kIHRoZSBvcmlnaW5hbCBjb2x1bW5cIiwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAyXVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGZvbGxvd2VkIGJ5IGEgR1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBvcmlnaW5hbFRleHQgPSBcIjEyMzQ1XFxuYWJjZGVcXG5BQkNERVwiXG4gICAgICAgIGVkaXRvci5zZXRUZXh0KG9yaWdpbmFsVGV4dClcblxuICAgICAgZGVzY3JpYmUgXCJvbiB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzZWNvbmQgbGluZVwiLCAtPlxuICAgICAgICBpdCBcImRlbGV0ZXMgdGhlIGJvdHRvbSB0d28gbGluZXNcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDBdKVxuICAgICAgICAgIGtleWRvd24oJ3knKVxuICAgICAgICAgIGtleWRvd24oJ0cnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgICBrZXlkb3duKCdQJywgc2hpZnQ6IHRydWUpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoXCIxMjM0NVxcbmFiY2RlXFxuQUJDREVcXG5hYmNkZVxcbkFCQ0RFXCIpXG5cbiAgICAgIGRlc2NyaWJlIFwib24gdGhlIG1pZGRsZSBvZiB0aGUgc2Vjb25kIGxpbmVcIiwgLT5cbiAgICAgICAgaXQgXCJkZWxldGVzIHRoZSBib3R0b20gdHdvIGxpbmVzXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAyXSlcbiAgICAgICAgICBrZXlkb3duKCd5JylcbiAgICAgICAgICBrZXlkb3duKCdHJywgc2hpZnQ6IHRydWUpXG4gICAgICAgICAga2V5ZG93bignUCcsIHNoaWZ0OiB0cnVlKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKFwiMTIzNDVcXG5hYmNkZVxcbkFCQ0RFXFxuYWJjZGVcXG5BQkNERVwiKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGZvbGxvd2VkIGJ5IGEgZ290byBsaW5lIEdcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgb3JpZ2luYWxUZXh0ID0gXCIxMjM0NVxcbmFiY2RlXFxuQUJDREVcIlxuICAgICAgICBlZGl0b3Iuc2V0VGV4dChvcmlnaW5hbFRleHQpXG5cbiAgICAgIGRlc2NyaWJlIFwib24gdGhlIGJlZ2lubmluZyBvZiB0aGUgc2Vjb25kIGxpbmVcIiwgLT5cbiAgICAgICAgaXQgXCJkZWxldGVzIHRoZSBib3R0b20gdHdvIGxpbmVzXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAwXSlcbiAgICAgICAgICBrZXlkb3duKCd5JylcbiAgICAgICAgICBrZXlkb3duKCcyJylcbiAgICAgICAgICBrZXlkb3duKCdHJywgc2hpZnQ6IHRydWUpXG4gICAgICAgICAga2V5ZG93bignUCcsIHNoaWZ0OiB0cnVlKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKFwiMTIzNDVcXG5hYmNkZVxcbmFiY2RlXFxuQUJDREVcIilcblxuICAgICAgZGVzY3JpYmUgXCJvbiB0aGUgbWlkZGxlIG9mIHRoZSBzZWNvbmQgbGluZVwiLCAtPlxuICAgICAgICBpdCBcImRlbGV0ZXMgdGhlIGJvdHRvbSB0d28gbGluZXNcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDJdKVxuICAgICAgICAgIGtleWRvd24oJ3knKVxuICAgICAgICAgIGtleWRvd24oJzInKVxuICAgICAgICAgIGtleWRvd24oJ0cnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgICBrZXlkb3duKCdQJywgc2hpZnQ6IHRydWUpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoXCIxMjM0NVxcbmFiY2RlXFxuYWJjZGVcXG5BQkNERVwiKVxuXG4gICAgZGVzY3JpYmUgXCJ3aXRoIG11bHRpcGxlIGN1cnNvcnNcIiwgLT5cbiAgICAgIGl0IFwibW92ZXMgZWFjaCBjdXJzb3IgYW5kIGNvcGllcyB0aGUgbGFzdCBzZWxlY3Rpb24ncyB0ZXh0XCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0IFwiICBhYmNkXFxuICAxMjM0XCJcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcbiAgICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24oWzEsIDVdKVxuXG4gICAgICAgIGtleWRvd24oXCJ5XCIpXG4gICAgICAgIGtleWRvd24oXCJeXCIpXG5cbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgJzEyMydcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKSkudG9FcXVhbCBbWzAsIDBdLCBbMSwgMl1dXG5cbiAgICBkZXNjcmliZSBcImluIGEgbG9uZyBmaWxlXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGphc21pbmUuYXR0YWNoVG9ET00oZWRpdG9yRWxlbWVudClcbiAgICAgICAgZWRpdG9yRWxlbWVudC5zZXRIZWlnaHQoNDAwKVxuICAgICAgICBlZGl0b3JFbGVtZW50LnN0eWxlLmxpbmVIZWlnaHQgPSBcIjEwcHhcIlxuICAgICAgICBlZGl0b3JFbGVtZW50LnN0eWxlLmZvbnQgPSBcIjE2cHggbW9ub3NwYWNlXCJcbiAgICAgICAgYXRvbS52aWV3cy5wZXJmb3JtRG9jdW1lbnRQb2xsKClcblxuICAgICAgICB0ZXh0ID0gXCJcIlxuICAgICAgICBmb3IgaSBpbiBbMS4uMjAwXVxuICAgICAgICAgIHRleHQgKz0gXCIje2l9XFxuXCJcbiAgICAgICAgZWRpdG9yLnNldFRleHQodGV4dClcblxuICAgICAgZGVzY3JpYmUgXCJ5YW5raW5nIG1hbnkgbGluZXMgZm9yd2FyZFwiLCAtPlxuICAgICAgICBpdCBcImRvZXMgbm90IHNjcm9sbCB0aGUgd2luZG93XCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIFs0MCwgMV1cbiAgICAgICAgICBwcmV2aW91c1Njcm9sbFRvcCA9IGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKClcblxuICAgICAgICAgICMgeWFuayBtYW55IGxpbmVzXG4gICAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgICAga2V5ZG93bignMScpXG4gICAgICAgICAga2V5ZG93bignNicpXG4gICAgICAgICAga2V5ZG93bignMCcpXG4gICAgICAgICAga2V5ZG93bignRycsIHNoaWZ0OiB0cnVlKVxuXG4gICAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKCkpLnRvRXF1YWwocHJldmlvdXNTY3JvbGxUb3ApXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFs0MCwgMV1cbiAgICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoKS50b0JlIDEyMVxuXG4gICAgICBkZXNjcmliZSBcInlhbmtpbmcgbWFueSBsaW5lcyBiYWNrd2FyZHNcIiwgLT5cbiAgICAgICAgaXQgXCJzY3JvbGxzIHRoZSB3aW5kb3dcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gWzE0MCwgMV1cbiAgICAgICAgICBwcmV2aW91c1Njcm9sbFRvcCA9IGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKClcblxuICAgICAgICAgICMgeWFuayBtYW55IGxpbmVzXG4gICAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgICAga2V5ZG93bignNicpXG4gICAgICAgICAga2V5ZG93bignMCcpXG4gICAgICAgICAga2V5ZG93bignRycsIHNoaWZ0OiB0cnVlKVxuXG4gICAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKCkpLnRvTm90RXF1YWwgcHJldmlvdXNTY3JvbGxUb3BcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzU5LCAxXVxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0LnNwbGl0KCdcXG4nKS5sZW5ndGgpLnRvQmUgODNcblxuICBkZXNjcmliZSBcInRoZSB5eSBrZXliaW5kaW5nXCIsIC0+XG4gICAgZGVzY3JpYmUgXCJvbiBhIHNpbmdsZSBsaW5lIGZpbGVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNldFRleHQgXCJleGNsYW1hdGlvbiFcXG5cIlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24gWzAsIDBdXG5cbiAgICAgIGl0IFwiY29waWVzIHRoZSBlbnRpcmUgbGluZSBhbmQgcGFzdGVzIGl0IGNvcnJlY3RseVwiLCAtPlxuICAgICAgICBrZXlkb3duKCd5JylcbiAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgIGtleWRvd24oJ3AnKVxuXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlIFwiZXhjbGFtYXRpb24hXFxuXCJcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJleGNsYW1hdGlvbiFcXG5leGNsYW1hdGlvbiFcXG5cIlxuXG4gICAgZGVzY3JpYmUgXCJvbiBhIHNpbmdsZSBsaW5lIGZpbGUgd2l0aCBubyBuZXdsaW5lXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5zZXRUZXh0IFwibm8gbmV3bGluZSFcIlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24gWzAsIDBdXG5cbiAgICAgIGl0IFwiY29waWVzIHRoZSBlbnRpcmUgbGluZSBhbmQgcGFzdGVzIGl0IGNvcnJlY3RseVwiLCAtPlxuICAgICAgICBrZXlkb3duKCd5JylcbiAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgIGtleWRvd24oJ3AnKVxuXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlIFwibm8gbmV3bGluZSFcXG5cIlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIm5vIG5ld2xpbmUhXFxubm8gbmV3bGluZSFcIlxuXG4gICAgICBpdCBcImNvcGllcyB0aGUgZW50aXJlIGxpbmUgYW5kIHBhc3RlcyBpdCByZXNwZWN0aW5nIGNvdW50IGFuZCBuZXcgbGluZXNcIiwgLT5cbiAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgIGtleWRvd24oJ3knKVxuICAgICAgICBrZXlkb3duKCcyJylcbiAgICAgICAga2V5ZG93bigncCcpXG5cbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgXCJubyBuZXdsaW5lIVxcblwiXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwibm8gbmV3bGluZSFcXG5ubyBuZXdsaW5lIVxcbm5vIG5ld2xpbmUhXCJcblxuICBkZXNjcmliZSBcInRoZSBZIGtleWJpbmRpbmdcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuc2V0VGV4dCBcIjAxMiAzNDVcXG5hYmNcXG5cIlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uIFswLCA0XVxuXG4gICAgaXQgXCJzYXZlcyB0aGUgbGluZSB0byB0aGUgZGVmYXVsdCByZWdpc3RlclwiLCAtPlxuICAgICAga2V5ZG93bignWScsIHNoaWZ0OiB0cnVlKVxuXG4gICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSBcIjAxMiAzNDVcXG5cIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA0XVxuXG4gIGRlc2NyaWJlIFwidGhlIHAga2V5YmluZGluZ1wiLCAtPlxuICAgIGRlc2NyaWJlIFwid2l0aCBjaGFyYWN0ZXIgY29udGVudHNcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNldFRleHQgXCIwMTJcXG5cIlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24gWzAsIDBdXG4gICAgICAgIHZpbVN0YXRlLnNldFJlZ2lzdGVyKCdcIicsIHRleHQ6ICczNDUnKVxuICAgICAgICB2aW1TdGF0ZS5zZXRSZWdpc3RlcignYScsIHRleHQ6ICdhJylcbiAgICAgICAgYXRvbS5jbGlwYm9hcmQud3JpdGUgXCJjbGlwXCJcblxuICAgICAgZGVzY3JpYmUgXCJmcm9tIHRoZSBkZWZhdWx0IHJlZ2lzdGVyXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT4ga2V5ZG93bigncCcpXG5cbiAgICAgICAgaXQgXCJpbnNlcnRzIHRoZSBjb250ZW50c1wiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMDM0NTEyXFxuXCJcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDNdXG5cbiAgICAgIGRlc2NyaWJlIFwiYXQgdGhlIGVuZCBvZiBhIGxpbmVcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbiBbMCwgMl1cbiAgICAgICAgICBrZXlkb3duKCdwJylcblxuICAgICAgICBpdCBcInBvc2l0aW9ucyBjdXJzb3IgY29ycmVjdGx5XCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIwMTIzNDVcXG5cIlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNV1cblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHVzZUNsaXBib2FyZEFzRGVmYXVsdFJlZ2lzdGVyIGVuYWJsZWRcIiwgLT5cbiAgICAgICAgaXQgXCJpbnNlcnRzIGNvbnRlbnRzIGZyb20gY2xpcGJvYXJkXCIsIC0+XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0ICd2aW0tbW9kZS51c2VDbGlwYm9hcmRBc0RlZmF1bHRSZWdpc3RlcicsIHRydWVcbiAgICAgICAgICBrZXlkb3duKCdwJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjBjbGlwMTJcXG5cIlxuXG4gICAgICBkZXNjcmliZSBcImZyb20gYSBzcGVjaWZpZWQgcmVnaXN0ZXJcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGtleWRvd24oJ1wiJylcbiAgICAgICAgICBrZXlkb3duKCdhJylcbiAgICAgICAgICBrZXlkb3duKCdwJylcblxuICAgICAgICBpdCBcImluc2VydHMgdGhlIGNvbnRlbnRzIG9mIHRoZSAnYScgcmVnaXN0ZXJcIiwgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjBhMTJcXG5cIlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMV1cblxuICAgICAgZGVzY3JpYmUgXCJhdCB0aGUgZW5kIG9mIGEgbGluZVwiLCAtPlxuICAgICAgICBpdCBcImluc2VydHMgYmVmb3JlIHRoZSBjdXJyZW50IGxpbmUncyBuZXdsaW5lXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldFRleHQoXCJhYmNkZVxcbm9uZSB0d28gdGhyZWVcIilcbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDRdKVxuXG4gICAgICAgICAga2V5ZG93biAnZCdcbiAgICAgICAgICBrZXlkb3duICckJ1xuICAgICAgICAgIGtleWRvd24gJ2snXG4gICAgICAgICAga2V5ZG93biAnJCdcbiAgICAgICAgICBrZXlkb3duICdwJ1xuXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJhYmNkZXR3byB0aHJlZVxcbm9uZSBcIlxuXG4gICAgICBkZXNjcmliZSBcIndpdGggYSBzZWxlY3Rpb25cIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGVkaXRvci5zZWxlY3RSaWdodCgpXG4gICAgICAgICAga2V5ZG93bigncCcpXG5cbiAgICAgICAgaXQgXCJyZXBsYWNlcyB0aGUgY3VycmVudCBzZWxlY3Rpb25cIiwgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjM0NTEyXFxuXCJcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDJdXG5cbiAgICBkZXNjcmliZSBcIndpdGggbGluZXdpc2UgY29udGVudHNcIiwgLT5cbiAgICAgIGRlc2NyaWJlIFwib24gYSBzaW5nbGUgbGluZVwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNldFRleHQoXCIwMTJcIilcbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDFdKVxuICAgICAgICAgIHZpbVN0YXRlLnNldFJlZ2lzdGVyKCdcIicsIHRleHQ6IFwiIDM0NVxcblwiLCB0eXBlOiAnbGluZXdpc2UnKVxuXG4gICAgICAgIGl0IFwiaW5zZXJ0cyB0aGUgY29udGVudHMgb2YgdGhlIGRlZmF1bHQgcmVnaXN0ZXJcIiwgLT5cbiAgICAgICAgICBrZXlkb3duKCdwJylcblxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMDEyXFxuIDM0NVwiXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAxXVxuXG4gICAgICAgIGl0IFwicmVwbGFjZXMgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNlbGVjdFJpZ2h0KClcbiAgICAgICAgICBrZXlkb3duKCdwJylcblxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMCAzNDVcXG4yXCJcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG5cbiAgICAgIGRlc2NyaWJlIFwib24gbXVsdGlwbGUgbGluZXNcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5zZXRUZXh0KFwiMDEyXFxuIDM0NVwiKVxuICAgICAgICAgIHZpbVN0YXRlLnNldFJlZ2lzdGVyKCdcIicsIHRleHQ6IFwiIDQ1NlxcblwiLCB0eXBlOiAnbGluZXdpc2UnKVxuXG4gICAgICAgIGl0IFwiaW5zZXJ0cyB0aGUgY29udGVudHMgb2YgdGhlIGRlZmF1bHQgcmVnaXN0ZXIgYXQgbWlkZGxlIGxpbmVcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDFdKVxuICAgICAgICAgIGtleWRvd24oJ3AnKVxuXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIwMTJcXG4gNDU2XFxuIDM0NVwiXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAxXVxuXG4gICAgICAgIGl0IFwiaW5zZXJ0cyB0aGUgY29udGVudHMgb2YgdGhlIGRlZmF1bHQgcmVnaXN0ZXIgYXQgZW5kIG9mIGxpbmVcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDFdKVxuICAgICAgICAgIGtleWRvd24oJ3AnKVxuXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIwMTJcXG4gMzQ1XFxuIDQ1NlwiXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsyLCAxXVxuXG4gICAgZGVzY3JpYmUgXCJ3aXRoIG11bHRpcGxlIGxpbmV3aXNlIGNvbnRlbnRzXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5zZXRUZXh0KFwiMDEyXFxuYWJjXCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMSwgMF0pXG4gICAgICAgIHZpbVN0YXRlLnNldFJlZ2lzdGVyKCdcIicsIHRleHQ6IFwiIDM0NVxcbiA2NzhcXG5cIiwgdHlwZTogJ2xpbmV3aXNlJylcbiAgICAgICAga2V5ZG93bigncCcpXG5cbiAgICAgIGl0IFwiaW5zZXJ0cyB0aGUgY29udGVudHMgb2YgdGhlIGRlZmF1bHQgcmVnaXN0ZXJcIiwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIwMTJcXG5hYmNcXG4gMzQ1XFxuIDY3OFwiXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMiwgMV1cblxuICAgIGRlc2NyaWJlIFwicGFzdGluZyB0d2ljZVwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBlZGl0b3Iuc2V0VGV4dChcIjEyMzQ1XFxuYWJjZGVcXG5BQkNERVxcblFXRVJUXCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMSwgMV0pXG4gICAgICAgIHZpbVN0YXRlLnNldFJlZ2lzdGVyKCdcIicsIHRleHQ6ICcxMjMnKVxuICAgICAgICBrZXlkb3duKCcyJylcbiAgICAgICAga2V5ZG93bigncCcpXG5cbiAgICAgIGl0IFwiaW5zZXJ0cyB0aGUgc2FtZSBsaW5lIHR3aWNlXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTIzNDVcXG5hYjEyMzEyM2NkZVxcbkFCQ0RFXFxuUVdFUlRcIlxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdW5kb25lXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBrZXlkb3duKCd1JylcblxuICAgICAgICBpdCBcInJlbW92ZXMgYm90aCBsaW5lc1wiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTIzNDVcXG5hYmNkZVxcbkFCQ0RFXFxuUVdFUlRcIlxuXG4gIGRlc2NyaWJlIFwidGhlIFAga2V5YmluZGluZ1wiLCAtPlxuICAgIGRlc2NyaWJlIFwid2l0aCBjaGFyYWN0ZXIgY29udGVudHNcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNldFRleHQoXCIwMTJcXG5cIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAwXSlcbiAgICAgICAgdmltU3RhdGUuc2V0UmVnaXN0ZXIoJ1wiJywgdGV4dDogJzM0NScpXG4gICAgICAgIHZpbVN0YXRlLnNldFJlZ2lzdGVyKCdhJywgdGV4dDogJ2EnKVxuICAgICAgICBrZXlkb3duKCdQJywgc2hpZnQ6IHRydWUpXG5cbiAgICAgIGl0IFwiaW5zZXJ0cyB0aGUgY29udGVudHMgb2YgdGhlIGRlZmF1bHQgcmVnaXN0ZXIgYWJvdmVcIiwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIzNDUwMTJcXG5cIlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDJdXG5cbiAgZGVzY3JpYmUgXCJ0aGUgTyBrZXliaW5kaW5nXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgc3B5T24oZWRpdG9yLCAnc2hvdWxkQXV0b0luZGVudCcpLmFuZFJldHVybih0cnVlKVxuICAgICAgc3B5T24oZWRpdG9yLCAnYXV0b0luZGVudEJ1ZmZlclJvdycpLmFuZENhbGxGYWtlIChsaW5lKSAtPlxuICAgICAgICBlZGl0b3IuaW5kZW50KClcblxuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNldFRleHQoXCIgIGFiY1xcbiAgMDEyXFxuXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDFdKVxuXG4gICAgaXQgXCJzd2l0Y2hlcyB0byBpbnNlcnQgYW5kIGFkZHMgYSBuZXdsaW5lIGFib3ZlIHRoZSBjdXJyZW50IG9uZVwiLCAtPlxuICAgICAga2V5ZG93bignTycsIHNoaWZ0OiB0cnVlKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIgIGFiY1xcbiAgXFxuICAwMTJcXG5cIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAyXVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImlzIHJlcGVhdGFibGVcIiwgLT5cbiAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5zZXRUZXh0KFwiICBhYmNcXG4gIDAxMlxcbiAgICA0c3BhY2VzXFxuXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDFdKVxuICAgICAga2V5ZG93bignTycsIHNoaWZ0OiB0cnVlKVxuICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJkZWZcIlxuICAgICAga2V5ZG93biAnZXNjYXBlJ1xuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIgIGFiY1xcbiAgZGVmXFxuICAwMTJcXG4gICAgNHNwYWNlc1xcblwiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDFdKVxuICAgICAga2V5ZG93biAnLidcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiICBhYmNcXG4gIGRlZlxcbiAgZGVmXFxuICAwMTJcXG4gICAgNHNwYWNlc1xcblwiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzQsIDFdKVxuICAgICAga2V5ZG93biAnLidcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiICBhYmNcXG4gIGRlZlxcbiAgZGVmXFxuICAwMTJcXG4gICAgZGVmXFxuICAgIDRzcGFjZXNcXG5cIlxuXG4gICAgaXQgXCJpcyB1bmRvYWJsZVwiLCAtPlxuICAgICAga2V5ZG93bignTycsIHNoaWZ0OiB0cnVlKVxuICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJkZWZcIlxuICAgICAga2V5ZG93biAnZXNjYXBlJ1xuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIgIGFiY1xcbiAgZGVmXFxuICAwMTJcXG5cIlxuICAgICAga2V5ZG93biAndSdcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiICBhYmNcXG4gIDAxMlxcblwiXG5cbiAgZGVzY3JpYmUgXCJ0aGUgbyBrZXliaW5kaW5nXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgc3B5T24oZWRpdG9yLCAnc2hvdWxkQXV0b0luZGVudCcpLmFuZFJldHVybih0cnVlKVxuICAgICAgc3B5T24oZWRpdG9yLCAnYXV0b0luZGVudEJ1ZmZlclJvdycpLmFuZENhbGxGYWtlIChsaW5lKSAtPlxuICAgICAgICBlZGl0b3IuaW5kZW50KClcblxuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNldFRleHQoXCJhYmNcXG4gIDAxMlxcblwiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAyXSlcblxuICAgIGl0IFwic3dpdGNoZXMgdG8gaW5zZXJ0IGFuZCBhZGRzIGEgbmV3bGluZSBhYm92ZSB0aGUgY3VycmVudCBvbmVcIiwgLT5cbiAgICAgIGtleWRvd24oJ28nKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJhYmNcXG4gIDAxMlxcbiAgXFxuXCJcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaW5zZXJ0LW1vZGUnKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsyLCAyXVxuXG4gICAgIyBUaGlzIHdvcmtzIGluIHByYWN0aWNlLCBidXQgdGhlIGVkaXRvciBkb2Vzbid0IHJlc3BlY3QgdGhlIGluZGVudGF0aW9uXG4gICAgIyBydWxlcyB3aXRob3V0IGEgc3ludGF4IGdyYW1tYXIuIE5lZWQgdG8gc2V0IHRoZSBlZGl0b3IncyBncmFtbWFyXG4gICAgIyB0byBmaXggaXQuXG4gICAgeGl0IFwiaXMgcmVwZWF0YWJsZVwiLCAtPlxuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNldFRleHQoXCIgIGFiY1xcbiAgMDEyXFxuICAgIDRzcGFjZXNcXG5cIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMSwgMV0pXG4gICAgICBrZXlkb3duKCdvJylcbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiZGVmXCJcbiAgICAgIGtleWRvd24gJ2VzY2FwZSdcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiICBhYmNcXG4gIDAxMlxcbiAgZGVmXFxuICAgIDRzcGFjZXNcXG5cIlxuICAgICAga2V5ZG93biAnLidcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiICBhYmNcXG4gIDAxMlxcbiAgZGVmXFxuICBkZWZcXG4gICAgNHNwYWNlc1xcblwiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzQsIDFdKVxuICAgICAga2V5ZG93biAnLidcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiICBhYmNcXG4gIGRlZlxcbiAgZGVmXFxuICAwMTJcXG4gICAgNHNwYWNlc1xcbiAgICBkZWZcXG5cIlxuXG4gICAgaXQgXCJpcyB1bmRvYWJsZVwiLCAtPlxuICAgICAga2V5ZG93bignbycpXG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcImRlZlwiXG4gICAgICBrZXlkb3duICdlc2NhcGUnXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcImFiY1xcbiAgMDEyXFxuICBkZWZcXG5cIlxuICAgICAga2V5ZG93biAndSdcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiYWJjXFxuICAwMTJcXG5cIlxuXG4gIGRlc2NyaWJlIFwidGhlIGEga2V5YmluZGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5zZXRUZXh0KFwiMDEyXFxuXCIpXG5cbiAgICBkZXNjcmliZSBcImF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGxpbmVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAwXSlcbiAgICAgICAga2V5ZG93bignYScpXG5cbiAgICAgIGl0IFwic3dpdGNoZXMgdG8gaW5zZXJ0IG1vZGUgYW5kIHNoaWZ0cyB0byB0aGUgcmlnaHRcIiwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAxXVxuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2luc2VydC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgIGRlc2NyaWJlIFwiYXQgdGhlIGVuZCBvZiB0aGUgbGluZVwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDNdKVxuICAgICAgICBrZXlkb3duKCdhJylcblxuICAgICAgaXQgXCJkb2Vzbid0IGxpbmV3cmFwXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgM11cblxuICBkZXNjcmliZSBcInRoZSBBIGtleWJpbmRpbmdcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuc2V0VGV4dChcIjExXFxuMjJcXG5cIilcblxuICAgIGRlc2NyaWJlIFwiYXQgdGhlIGJlZ2lubmluZyBvZiBhIGxpbmVcIiwgLT5cbiAgICAgIGl0IFwic3dpdGNoZXMgdG8gaW5zZXJ0IG1vZGUgYXQgdGhlIGVuZCBvZiB0aGUgbGluZVwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuICAgICAgICBrZXlkb3duKCdBJywgc2hpZnQ6IHRydWUpXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtbW9kZScpKS50b0JlKHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMl1cblxuICAgICAgaXQgXCJyZXBlYXRzIGFsd2F5cyBhcyBpbnNlcnQgYXQgdGhlIGVuZCBvZiB0aGUgbGluZVwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuICAgICAgICBrZXlkb3duKCdBJywgc2hpZnQ6IHRydWUpXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KFwiYWJjXCIpXG4gICAgICAgIGtleWRvd24gJ2VzY2FwZSdcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAwXSlcbiAgICAgICAga2V5ZG93biAnLidcblxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjExYWJjXFxuMjJhYmNcXG5cIlxuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2luc2VydC1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgNF1cblxuICBkZXNjcmliZSBcInRoZSBJIGtleWJpbmRpbmdcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuc2V0VGV4dChcIjExXFxuICAyMlxcblwiKVxuXG4gICAgZGVzY3JpYmUgXCJhdCB0aGUgZW5kIG9mIGEgbGluZVwiLCAtPlxuICAgICAgaXQgXCJzd2l0Y2hlcyB0byBpbnNlcnQgbW9kZSBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBsaW5lXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMl0pXG4gICAgICAgIGtleWRvd24oJ0knLCBzaGlmdDogdHJ1ZSlcblxuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2luc2VydC1tb2RlJykpLnRvQmUodHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAwXVxuXG4gICAgICBpdCBcInN3aXRjaGVzIHRvIGluc2VydCBtb2RlIGFmdGVyIGxlYWRpbmcgd2hpdGVzcGFjZVwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDRdKVxuICAgICAgICBrZXlkb3duKCdJJywgc2hpZnQ6IHRydWUpXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtbW9kZScpKS50b0JlKHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMl1cblxuICAgICAgaXQgXCJyZXBlYXRzIGFsd2F5cyBhcyBpbnNlcnQgYXQgdGhlIGZpcnN0IGNoYXJhY3RlciBvZiB0aGUgbGluZVwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDJdKVxuICAgICAgICBrZXlkb3duKCdJJywgc2hpZnQ6IHRydWUpXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KFwiYWJjXCIpXG4gICAgICAgIGtleWRvd24gJ2VzY2FwZSdcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyXVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDRdKVxuICAgICAgICBrZXlkb3duICcuJ1xuXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiYWJjMTFcXG4gIGFiYzIyXFxuXCJcbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtbW9kZScpKS50b0JlKGZhbHNlKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDRdXG5cbiAgZGVzY3JpYmUgXCJ0aGUgSiBrZXliaW5kaW5nXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNldFRleHQoXCIwMTJcXG4gICAgNDU2XFxuXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDFdKVxuXG4gICAgZGVzY3JpYmUgXCJ3aXRob3V0IHJlcGVhdGluZ1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBrZXlkb3duKCdKJywgc2hpZnQ6IHRydWUpXG5cbiAgICAgIGl0IFwiam9pbnMgdGhlIGNvbnRlbnRzIG9mIHRoZSBjdXJyZW50IGxpbmUgd2l0aCB0aGUgb25lIGJlbG93IGl0XCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMDEyIDQ1NlxcblwiXG5cbiAgICBkZXNjcmliZSBcIndpdGggcmVwZWF0aW5nXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwiMTIzNDVcXG5hYmNkZVxcbkFCQ0RFXFxuUVdFUlRcIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAxXSlcbiAgICAgICAga2V5ZG93bignMicpXG4gICAgICAgIGtleWRvd24oJ0onLCBzaGlmdDogdHJ1ZSlcblxuICAgICAgZGVzY3JpYmUgXCJ1bmRvIGJlaGF2aW9yXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT4ga2V5ZG93bigndScpXG5cbiAgICAgICAgaXQgXCJoYW5kbGVzIHJlcGVhdHNcIiwgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjEyMzQ1XFxuYWJjZGVcXG5BQkNERVxcblFXRVJUXCJcblxuICBkZXNjcmliZSBcInRoZSA+IGtleWJpbmRpbmdcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIjEyMzQ1XFxuYWJjZGVcXG5BQkNERVwiKVxuXG4gICAgZGVzY3JpYmUgXCJvbiB0aGUgbGFzdCBsaW5lXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMiwgMF0pXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBmb2xsb3dlZCBieSBhID5cIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGtleWRvd24oJz4nKVxuICAgICAgICAgIGtleWRvd24oJz4nKVxuXG4gICAgICAgIGl0IFwiaW5kZW50cyB0aGUgY3VycmVudCBsaW5lXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMjM0NVxcbmFiY2RlXFxuICBBQkNERVwiXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsyLCAyXVxuXG4gICAgZGVzY3JpYmUgXCJvbiB0aGUgZmlyc3QgbGluZVwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gZm9sbG93ZWQgYnkgYSA+XCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBrZXlkb3duKCc+JylcbiAgICAgICAgICBrZXlkb3duKCc+JylcblxuICAgICAgICBpdCBcImluZGVudHMgdGhlIGN1cnJlbnQgbGluZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiICAxMjM0NVxcbmFiY2RlXFxuQUJDREVcIlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMl1cblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIGZvbGxvd2VkIGJ5IGEgcmVwZWF0aW5nID5cIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGtleWRvd24oJzMnKVxuICAgICAgICAgIGtleWRvd24oJz4nKVxuICAgICAgICAgIGtleWRvd24oJz4nKVxuXG4gICAgICAgIGl0IFwiaW5kZW50cyBtdWx0aXBsZSBsaW5lcyBhdCBvbmNlXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIgIDEyMzQ1XFxuICBhYmNkZVxcbiAgQUJDREVcIlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMl1cblxuICAgICAgICBkZXNjcmliZSBcInVuZG8gYmVoYXZpb3JcIiwgLT5cbiAgICAgICAgICBiZWZvcmVFYWNoIC0+IGtleWRvd24oJ3UnKVxuXG4gICAgICAgICAgaXQgXCJvdXRkZW50cyBhbGwgdGhyZWUgbGluZXNcIiwgLT5cbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTIzNDVcXG5hYmNkZVxcbkFCQ0RFXCJcblxuICAgIGRlc2NyaWJlIFwiaW4gdmlzdWFsIG1vZGUgbGluZXdpc2VcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAwXSlcbiAgICAgICAga2V5ZG93bigndicsIHNoaWZ0OiB0cnVlKVxuICAgICAgICBrZXlkb3duKCdqJylcblxuICAgICAgZGVzY3JpYmUgXCJzaW5nbGUgaW5kZW50IG11bHRpcGxlIGxpbmVzXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBrZXlkb3duKCc+JylcblxuICAgICAgICBpdCBcImluZGVudHMgYm90aCBsaW5lcyBvbmNlIGFuZCBleGl0cyB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiICAxMjM0NVxcbiAgYWJjZGVcXG5BQkNERVwiXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpKS50b0VxdWFsIFsgW1swLCAyXSwgWzAsIDJdXSBdXG5cbiAgICAgICAgaXQgXCJhbGxvd3MgcmVwZWF0aW5nIHRoZSBvcGVyYXRpb25cIiwgLT5cbiAgICAgICAgICBrZXlkb3duKCcuJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIiAgICAxMjM0NVxcbiAgICBhYmNkZVxcbkFCQ0RFXCJcblxuICAgICAgZGVzY3JpYmUgXCJtdWx0aXBsZSBpbmRlbnQgbXVsdGlwbGUgbGluZXNcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGtleWRvd24oJzInKVxuICAgICAgICAgIGtleWRvd24oJz4nKVxuXG4gICAgICAgIGl0IFwiaW5kZW50cyBib3RoIGxpbmVzIHR3aWNlIGFuZCBleGl0cyB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiICAgIDEyMzQ1XFxuICAgIGFiY2RlXFxuQUJDREVcIlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKSkudG9FcXVhbCBbIFtbMCwgNF0sIFswLCA0XV0gXVxuXG4gICAgZGVzY3JpYmUgXCJ3aXRoIG11bHRpcGxlIHNlbGVjdGlvbnNcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAzXSlcbiAgICAgICAga2V5ZG93bigndicpXG4gICAgICAgIGtleWRvd24oJ2onKVxuICAgICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG5cbiAgICAgIGl0IFwiaW5kZW50cyB0aGUgbGluZXMgYW5kIGtlZXBzIHRoZSBjdXJzb3JzXCIsIC0+XG4gICAgICAgIGtleWRvd24oJz4nKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIiAgMTIzNDVcXG4gIGFiY2RlXFxuICBBQkNERVwiXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb25zKCkpLnRvRXF1YWwgW1sxLCAyXSwgWzAsIDJdXVxuXG4gIGRlc2NyaWJlIFwidGhlIDwga2V5YmluZGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiICAgIDEyMzQ1XFxuICAgIGFiY2RlXFxuQUJDREVcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG5cbiAgICBkZXNjcmliZSBcIndoZW4gZm9sbG93ZWQgYnkgYSA8XCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGtleWRvd24oJzwnKVxuICAgICAgICBrZXlkb3duKCc8JylcblxuICAgICAgaXQgXCJvdXRkZW50cyB0aGUgY3VycmVudCBsaW5lXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiICAxMjM0NVxcbiAgICBhYmNkZVxcbkFCQ0RFXCJcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyXVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGZvbGxvd2VkIGJ5IGEgcmVwZWF0aW5nIDxcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAga2V5ZG93bignMicpXG4gICAgICAgIGtleWRvd24oJzwnKVxuICAgICAgICBrZXlkb3duKCc8JylcblxuICAgICAgaXQgXCJvdXRkZW50cyBtdWx0aXBsZSBsaW5lcyBhdCBvbmNlXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiICAxMjM0NVxcbiAgYWJjZGVcXG5BQkNERVwiXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMl1cblxuICAgICAgZGVzY3JpYmUgXCJ1bmRvIGJlaGF2aW9yXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT4ga2V5ZG93bigndScpXG5cbiAgICAgICAgaXQgXCJpbmRlbnRzIGJvdGggbGluZXNcIiwgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIiAgICAxMjM0NVxcbiAgICBhYmNkZVxcbkFCQ0RFXCJcblxuICAgIGRlc2NyaWJlIFwiaW4gdmlzdWFsIG1vZGUgbGluZXdpc2VcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAga2V5ZG93bigndicsIHNoaWZ0OiB0cnVlKVxuICAgICAgICBrZXlkb3duKCdqJylcblxuICAgICAgZGVzY3JpYmUgXCJzaW5nbGUgb3V0ZGVudCBtdWx0aXBsZSBsaW5lc1wiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAga2V5ZG93bignPCcpXG5cbiAgICAgICAgaXQgXCJvdXRkZW50cyB0aGUgY3VycmVudCBsaW5lIGFuZCBleGl0cyB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiICAxMjM0NVxcbiAgYWJjZGVcXG5BQkNERVwiXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpKS50b0VxdWFsIFsgW1swLCAyXSwgWzAsIDJdXSBdXG5cbiAgICAgICAgaXQgXCJhbGxvd3MgcmVwZWF0aW5nIHRoZSBvcGVyYXRpb25cIiwgLT5cbiAgICAgICAgICBrZXlkb3duKCcuJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjEyMzQ1XFxuYWJjZGVcXG5BQkNERVwiXG5cbiAgICAgIGRlc2NyaWJlIFwibXVsdGlwbGUgb3V0ZGVudCBtdWx0aXBsZSBsaW5lc1wiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAga2V5ZG93bignMicpXG4gICAgICAgICAga2V5ZG93bignPCcpXG5cbiAgICAgICAgaXQgXCJvdXRkZW50cyBib3RoIGxpbmVzIHR3aWNlIGFuZCBleGl0cyB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTIzNDVcXG5hYmNkZVxcbkFCQ0RFXCJcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKCkpLnRvRXF1YWwgWyBbWzAsIDBdLCBbMCwgMF1dIF1cblxuICBkZXNjcmliZSBcInRoZSA9IGtleWJpbmRpbmdcIiwgLT5cbiAgICBvbGRHcmFtbWFyID0gW11cblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGFuZ3VhZ2UtamF2YXNjcmlwdCcpXG5cbiAgICAgIG9sZEdyYW1tYXIgPSBlZGl0b3IuZ2V0R3JhbW1hcigpXG4gICAgICBlZGl0b3Iuc2V0VGV4dChcImZvb1xcbiAgYmFyXFxuICBiYXpcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMSwgMF0pXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdXNlZCBpbiBhIHNjb3BlIHRoYXQgc3VwcG9ydHMgYXV0by1pbmRlbnRcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAganNHcmFtbWFyID0gYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKCdzb3VyY2UuanMnKVxuICAgICAgICBlZGl0b3Iuc2V0R3JhbW1hcihqc0dyYW1tYXIpXG5cbiAgICAgIGFmdGVyRWFjaCAtPlxuICAgICAgICBlZGl0b3Iuc2V0R3JhbW1hcihvbGRHcmFtbWFyKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gZm9sbG93ZWQgYnkgYSA9XCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBrZXlkb3duKCc9JylcbiAgICAgICAgICBrZXlkb3duKCc9JylcblxuICAgICAgICBpdCBcImluZGVudHMgdGhlIGN1cnJlbnQgbGluZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3coMSkpLnRvQmUgMFxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gZm9sbG93ZWQgYnkgYSBHXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuICAgICAgICAgIGtleWRvd24oJz0nKVxuICAgICAgICAgIGtleWRvd24oJ0cnLCBzaGlmdDogdHJ1ZSlcblxuICAgICAgICBpdCBcInVzZXMgdGhlIGRlZmF1bHQgY291bnRcIiwgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KDEpKS50b0JlIDBcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KDIpKS50b0JlIDBcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIGZvbGxvd2VkIGJ5IGEgcmVwZWF0aW5nID1cIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGtleWRvd24oJzInKVxuICAgICAgICAgIGtleWRvd24oJz0nKVxuICAgICAgICAgIGtleWRvd24oJz0nKVxuXG4gICAgICAgIGl0IFwiYXV0b2luZGVudHMgbXVsdGlwbGUgbGluZXMgYXQgb25jZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiZm9vXFxuYmFyXFxuYmF6XCJcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG5cbiAgICAgICAgZGVzY3JpYmUgXCJ1bmRvIGJlaGF2aW9yXCIsIC0+XG4gICAgICAgICAgYmVmb3JlRWFjaCAtPiBrZXlkb3duKCd1JylcblxuICAgICAgICAgIGl0IFwiaW5kZW50cyBib3RoIGxpbmVzXCIsIC0+XG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcImZvb1xcbiAgYmFyXFxuICBiYXpcIlxuXG4gIGRlc2NyaWJlIFwidGhlIC4ga2V5YmluZGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiMTJcXG4zNFxcbjU2XFxuNzhcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG5cbiAgICBpdCBcInJlcGVhdHMgdGhlIGxhc3Qgb3BlcmF0aW9uXCIsIC0+XG4gICAgICBrZXlkb3duICcyJ1xuICAgICAga2V5ZG93biAnZCdcbiAgICAgIGtleWRvd24gJ2QnXG4gICAgICBrZXlkb3duICcuJ1xuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXG5cbiAgICBpdCBcImNvbXBvc2VzIHdpdGggbW90aW9uc1wiLCAtPlxuICAgICAga2V5ZG93biAnZCdcbiAgICAgIGtleWRvd24gJ2QnXG4gICAgICBrZXlkb3duICcyJ1xuICAgICAga2V5ZG93biAnLidcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCI3OFwiXG5cbiAgZGVzY3JpYmUgXCJ0aGUgciBrZXliaW5kaW5nXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCIxMlxcbjM0XFxuXFxuXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24oWzEsIDBdKVxuXG4gICAgaXQgXCJyZXBsYWNlcyBhIHNpbmdsZSBjaGFyYWN0ZXJcIiwgLT5cbiAgICAgIGtleWRvd24oJ3InKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bigneCcpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAneDJcXG54NFxcblxcbidcblxuICAgIGl0IFwiZG9lcyBub3RoaW5nIHdoZW4gY2FuY2VsbGVkXCIsIC0+XG4gICAgICBrZXlkb3duKCdyJylcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUodHJ1ZSlcbiAgICAgIGtleWRvd24oJ2VzY2FwZScpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnMTJcXG4zNFxcblxcbidcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJyZXBsYWNlcyBhIHNpbmdsZSBjaGFyYWN0ZXIgd2l0aCBhIGxpbmUgYnJlYWtcIiwgLT5cbiAgICAgIGtleWRvd24oJ3InKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3Iubm9ybWFsTW9kZUlucHV0Vmlldy5lZGl0b3JFbGVtZW50LCAnY29yZTpjb25maXJtJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdcXG4yXFxuXFxuNFxcblxcbidcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKCkpLnRvRXF1YWwgW1sxLCAwXSwgWzMsIDBdXVxuXG4gICAgaXQgXCJjb21wb3NlcyBwcm9wZXJseSB3aXRoIG1vdGlvbnNcIiwgLT5cbiAgICAgIGtleWRvd24oJzInKVxuICAgICAga2V5ZG93bigncicpXG4gICAgICBub3JtYWxNb2RlSW5wdXRLZXlkb3duKCd4JylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICd4eFxcbnh4XFxuXFxuJ1xuXG4gICAgaXQgXCJkb2VzIG5vdGhpbmcgb24gYW4gZW1wdHkgbGluZVwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsyLCAwXSlcbiAgICAgIGtleWRvd24oJ3InKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bigneCcpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnMTJcXG4zNFxcblxcbidcblxuICAgIGl0IFwiZG9lcyBub3RoaW5nIGlmIGFza2VkIHRvIHJlcGxhY2UgbW9yZSBjaGFyYWN0ZXJzIHRoYW4gdGhlcmUgYXJlIG9uIGEgbGluZVwiLCAtPlxuICAgICAga2V5ZG93bignMycpXG4gICAgICBrZXlkb3duKCdyJylcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ3gnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJzEyXFxuMzRcXG5cXG4nXG5cbiAgICBkZXNjcmliZSBcIndoZW4gaW4gdmlzdWFsIG1vZGVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAga2V5ZG93bigndicpXG4gICAgICAgIGtleWRvd24oJ2UnKVxuXG4gICAgICBpdCBcInJlcGxhY2VzIHRoZSBlbnRpcmUgc2VsZWN0aW9uIHdpdGggdGhlIGdpdmVuIGNoYXJhY3RlclwiLCAtPlxuICAgICAgICBrZXlkb3duKCdyJylcbiAgICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bigneCcpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICd4eFxcbnh4XFxuXFxuJ1xuXG4gICAgICBpdCBcImxlYXZlcyB0aGUgY3Vyc29yIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHNlbGVjdGlvblwiLCAtPlxuICAgICAgICBrZXlkb3duKCdyJylcbiAgICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bigneCcpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKCkpLnRvRXF1YWwgW1swLCAwXSwgWzEsIDBdXVxuXG4gICAgZGVzY3JpYmUgJ3dpdGggYWNjZW50ZWQgY2hhcmFjdGVycycsIC0+XG4gICAgICBidWlsZElNRUNvbXBvc2l0aW9uRXZlbnQgPSAoZXZlbnQsIHtkYXRhLCB0YXJnZXR9PXt9KSAtPlxuICAgICAgICBldmVudCA9IG5ldyBFdmVudChldmVudClcbiAgICAgICAgZXZlbnQuZGF0YSA9IGRhdGFcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV2ZW50LCAndGFyZ2V0JywgZ2V0OiAtPiB0YXJnZXQpXG4gICAgICAgIGV2ZW50XG5cbiAgICAgIGJ1aWxkVGV4dElucHV0RXZlbnQgPSAoe2RhdGEsIHRhcmdldH0pIC0+XG4gICAgICAgIGV2ZW50ID0gbmV3IEV2ZW50KCd0ZXh0SW5wdXQnKVxuICAgICAgICBldmVudC5kYXRhID0gZGF0YVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXZlbnQsICd0YXJnZXQnLCBnZXQ6IC0+IHRhcmdldClcbiAgICAgICAgZXZlbnRcblxuICAgICAgaXQgJ3dvcmtzIHdpdGggSU1FIGNvbXBvc2l0aW9uJywgLT5cbiAgICAgICAga2V5ZG93bigncicpXG4gICAgICAgIG5vcm1hbE1vZGVFZGl0b3IgPSBlZGl0b3Iubm9ybWFsTW9kZUlucHV0Vmlldy5lZGl0b3JFbGVtZW50XG4gICAgICAgIGphc21pbmUuYXR0YWNoVG9ET00obm9ybWFsTW9kZUVkaXRvcilcbiAgICAgICAgZG9tTm9kZSA9IG5vcm1hbE1vZGVFZGl0b3IuY29tcG9uZW50LmRvbU5vZGVcbiAgICAgICAgaW5wdXROb2RlID0gZG9tTm9kZS5xdWVyeVNlbGVjdG9yKCcuaGlkZGVuLWlucHV0JylcbiAgICAgICAgZG9tTm9kZS5kaXNwYXRjaEV2ZW50KGJ1aWxkSU1FQ29tcG9zaXRpb25FdmVudCgnY29tcG9zaXRpb25zdGFydCcsIHRhcmdldDogaW5wdXROb2RlKSlcbiAgICAgICAgZG9tTm9kZS5kaXNwYXRjaEV2ZW50KGJ1aWxkSU1FQ29tcG9zaXRpb25FdmVudCgnY29tcG9zaXRpb251cGRhdGUnLCBkYXRhOiAncycsIHRhcmdldDogaW5wdXROb2RlKSlcbiAgICAgICAgZXhwZWN0KG5vcm1hbE1vZGVFZGl0b3IuZ2V0TW9kZWwoKS5nZXRUZXh0KCkpLnRvRXF1YWwgJ3MnXG4gICAgICAgIGRvbU5vZGUuZGlzcGF0Y2hFdmVudChidWlsZElNRUNvbXBvc2l0aW9uRXZlbnQoJ2NvbXBvc2l0aW9udXBkYXRlJywgZGF0YTogJ3NkJywgdGFyZ2V0OiBpbnB1dE5vZGUpKVxuICAgICAgICBleHBlY3Qobm9ybWFsTW9kZUVkaXRvci5nZXRNb2RlbCgpLmdldFRleHQoKSkudG9FcXVhbCAnc2QnXG4gICAgICAgIGRvbU5vZGUuZGlzcGF0Y2hFdmVudChidWlsZElNRUNvbXBvc2l0aW9uRXZlbnQoJ2NvbXBvc2l0aW9uZW5kJywgdGFyZ2V0OiBpbnB1dE5vZGUpKVxuICAgICAgICBkb21Ob2RlLmRpc3BhdGNoRXZlbnQoYnVpbGRUZXh0SW5wdXRFdmVudChkYXRhOiAn6YCf5bqmJywgdGFyZ2V0OiBpbnB1dE5vZGUpKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAn6YCf5bqmMlxcbumAn+W6pjRcXG5cXG4nXG5cbiAgZGVzY3JpYmUgJ3RoZSBtIGtleWJpbmRpbmcnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KCcxMlxcbjM0XFxuNTZcXG4nKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAxXSlcblxuICAgIGl0ICdtYXJrcyBhIHBvc2l0aW9uJywgLT5cbiAgICAgIGtleWRvd24oJ20nKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYScpXG4gICAgICBleHBlY3QodmltU3RhdGUuZ2V0TWFyaygnYScpKS50b0VxdWFsIFswLCAxXVxuXG4gIGRlc2NyaWJlICd0aGUgfiBrZXliaW5kaW5nJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnYUJjXFxuWHlaJylcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbihbMSwgMF0pXG5cbiAgICBpdCAndG9nZ2xlcyB0aGUgY2FzZSBhbmQgbW92ZXMgcmlnaHQnLCAtPlxuICAgICAga2V5ZG93bignficpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnQUJjXFxueHlaJ1xuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbnMoKSkudG9FcXVhbCBbWzAsIDFdLCBbMSwgMV1dXG5cbiAgICAgIGtleWRvd24oJ34nKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ0FiY1xcbnhZWidcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb25zKCkpLnRvRXF1YWwgW1swLCAyXSwgWzEsIDJdXVxuXG4gICAgICBrZXlkb3duKCd+JylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdBYkNcXG54WXonXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9ucygpKS50b0VxdWFsIFtbMCwgMl0sIFsxLCAyXV1cblxuICAgIGl0ICd0YWtlcyBhIGNvdW50JywgLT5cbiAgICAgIGtleWRvd24oJzQnKVxuICAgICAga2V5ZG93bignficpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdBYkNcXG54WXonXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9ucygpKS50b0VxdWFsIFtbMCwgMl0sIFsxLCAyXV1cblxuICAgIGRlc2NyaWJlIFwiaW4gdmlzdWFsIG1vZGVcIiwgLT5cbiAgICAgIGl0IFwidG9nZ2xlcyB0aGUgY2FzZSBvZiB0aGUgc2VsZWN0ZWQgdGV4dFwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuICAgICAgICBrZXlkb3duKFwiVlwiLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAga2V5ZG93bihcIn5cIilcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ0FiQ1xcblh5WidcblxuICAgIGRlc2NyaWJlIFwid2l0aCBnIGFuZCBtb3Rpb25cIiwgLT5cbiAgICAgIGl0IFwidG9nZ2xlcyB0aGUgY2FzZSBvZiB0ZXh0XCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICAgIGtleWRvd24oXCJnXCIpXG4gICAgICAgIGtleWRvd24oXCJ+XCIpXG4gICAgICAgIGtleWRvd24oXCIyXCIpXG4gICAgICAgIGtleWRvd24oXCJsXCIpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdBYmNcXG5YeVonXG5cbiAgICAgIGl0IFwidXNlcyBkZWZhdWx0IGNvdW50XCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICAgIGtleWRvd24oXCJnXCIpXG4gICAgICAgIGtleWRvd24oXCJ+XCIpXG4gICAgICAgIGtleWRvd24oXCJHXCIsIHNoaWZ0OiB0cnVlKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnQWJDXFxueFl6J1xuXG4gIGRlc2NyaWJlICd0aGUgVSBrZXliaW5kaW5nJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnYUJjXFxuWHlaJylcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG5cbiAgICBpdCBcIm1ha2VzIHRleHQgdXBwZXJjYXNlIHdpdGggZyBhbmQgbW90aW9uXCIsIC0+XG4gICAgICBrZXlkb3duKFwiZ1wiKVxuICAgICAga2V5ZG93bihcIlVcIiwgc2hpZnQ6IHRydWUpXG4gICAgICBrZXlkb3duKFwibFwiKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ0FCY1xcblh5WidcblxuICAgICAga2V5ZG93bihcImdcIilcbiAgICAgIGtleWRvd24oXCJVXCIsIHNoaWZ0OiB0cnVlKVxuICAgICAga2V5ZG93bihcImVcIilcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdBQkNcXG5YeVonXG5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMSwgMF0pXG4gICAgICBrZXlkb3duKFwiZ1wiKVxuICAgICAga2V5ZG93bihcIlVcIiwgc2hpZnQ6IHRydWUpXG4gICAgICBrZXlkb3duKFwiJFwiKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ0FCQ1xcblhZWidcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMl1cblxuICAgIGl0IFwidXNlcyBkZWZhdWx0IGNvdW50XCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuICAgICAga2V5ZG93bihcImdcIilcbiAgICAgIGtleWRvd24oXCJVXCIsIHNoaWZ0OiB0cnVlKVxuICAgICAga2V5ZG93bihcIkdcIiwgc2hpZnQ6IHRydWUpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnQUJDXFxuWFlaJ1xuXG4gICAgaXQgXCJtYWtlcyB0aGUgc2VsZWN0ZWQgdGV4dCB1cHBlcmNhc2UgaW4gdmlzdWFsIG1vZGVcIiwgLT5cbiAgICAgIGtleWRvd24oXCJWXCIsIHNoaWZ0OiB0cnVlKVxuICAgICAga2V5ZG93bihcIlVcIiwgc2hpZnQ6IHRydWUpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnQUJDXFxuWHlaJ1xuXG4gIGRlc2NyaWJlICd0aGUgdSBrZXliaW5kaW5nJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnYUJjXFxuWHlaJylcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG5cbiAgICBpdCBcIm1ha2VzIHRleHQgbG93ZXJjYXNlIHdpdGggZyBhbmQgbW90aW9uXCIsIC0+XG4gICAgICBrZXlkb3duKFwiZ1wiKVxuICAgICAga2V5ZG93bihcInVcIilcbiAgICAgIGtleWRvd24oXCIkXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnYWJjXFxuWHlaJ1xuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyXVxuXG4gICAgaXQgXCJ1c2VzIGRlZmF1bHQgY291bnRcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICBrZXlkb3duKFwiZ1wiKVxuICAgICAga2V5ZG93bihcInVcIilcbiAgICAgIGtleWRvd24oXCJHXCIsIHNoaWZ0OiB0cnVlKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ2FiY1xcbnh5eidcblxuICAgIGl0IFwibWFrZXMgdGhlIHNlbGVjdGVkIHRleHQgbG93ZXJjYXNlIGluIHZpc3VhbCBtb2RlXCIsIC0+XG4gICAgICBrZXlkb3duKFwiVlwiLCBzaGlmdDogdHJ1ZSlcbiAgICAgIGtleWRvd24oXCJ1XCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnYWJjXFxuWHlaJ1xuXG4gIGRlc2NyaWJlIFwidGhlIGkga2V5YmluZGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KCcxMjNcXG40NTY3JylcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbihbMSwgMF0pXG5cbiAgICBpdCBcImFsbG93cyB1bmRvaW5nIGFuIGVudGlyZSBiYXRjaCBvZiB0eXBpbmdcIiwgLT5cbiAgICAgIGtleWRvd24gJ2knXG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dChcImFiY1hYXCIpXG4gICAgICBlZGl0b3IuYmFja3NwYWNlKClcbiAgICAgIGVkaXRvci5iYWNrc3BhY2UoKVxuICAgICAga2V5ZG93biAnZXNjYXBlJ1xuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJhYmMxMjNcXG5hYmM0NTY3XCJcblxuICAgICAga2V5ZG93biAnaSdcbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiZFwiXG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcImVcIlxuICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJmXCJcbiAgICAgIGtleWRvd24gJ2VzY2FwZSdcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiYWJkZWZjMTIzXFxuYWJkZWZjNDU2N1wiXG5cbiAgICAgIGtleWRvd24gJ3UnXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcImFiYzEyM1xcbmFiYzQ1NjdcIlxuXG4gICAgICBrZXlkb3duICd1J1xuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMjNcXG40NTY3XCJcblxuICAgIGl0IFwiYWxsb3dzIHJlcGVhdGluZyB0eXBpbmdcIiwgLT5cbiAgICAgIGtleWRvd24gJ2knXG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dChcImFiY1hYXCIpXG4gICAgICBlZGl0b3IuYmFja3NwYWNlKClcbiAgICAgIGVkaXRvci5iYWNrc3BhY2UoKVxuICAgICAga2V5ZG93biAnZXNjYXBlJ1xuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJhYmMxMjNcXG5hYmM0NTY3XCJcblxuICAgICAga2V5ZG93biAnLidcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiYWJhYmNjMTIzXFxuYWJhYmNjNDU2N1wiXG5cbiAgICAgIGtleWRvd24gJy4nXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcImFiYWJhYmNjYzEyM1xcbmFiYWJhYmNjYzQ1NjdcIlxuXG4gICAgZGVzY3JpYmUgJ3dpdGggbm9ubGluZWFyIGlucHV0JywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQgJydcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIFswLCAwXVxuXG4gICAgICBpdCAnZGVhbHMgd2l0aCBhdXRvLW1hdGNoZWQgYnJhY2tldHMnLCAtPlxuICAgICAgICBrZXlkb3duICdpJ1xuICAgICAgICAjIHRoaXMgc2VxdWVuY2Ugc2ltdWxhdGVzIHdoYXQgdGhlIGJyYWNrZXQtbWF0Y2hlciBwYWNrYWdlIGRvZXNcbiAgICAgICAgIyB3aGVuIHRoZSB1c2VyIHR5cGVzIChhKWI8ZW50ZXI+XG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0ICcoKSdcbiAgICAgICAgZWRpdG9yLm1vdmVMZWZ0KClcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgJ2EnXG4gICAgICAgIGVkaXRvci5tb3ZlUmlnaHQoKVxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCAnYlxcbidcbiAgICAgICAga2V5ZG93biAnZXNjYXBlJ1xuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsICAwXVxuXG4gICAgICAgIGtleWRvd24gJy4nXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICcoYSliXFxuKGEpYlxcbidcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsyLCAgMF1cblxuICAgICAgaXQgJ2RlYWxzIHdpdGggYXV0b2NvbXBsZXRlJywgLT5cbiAgICAgICAga2V5ZG93biAnaSdcbiAgICAgICAgIyB0aGlzIHNlcXVlbmNlIHNpbXVsYXRlcyBhdXRvY29tcGxldGlvbiBvZiAnYWRkJyB0byAnYWRkRm9vJ1xuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCAnYSdcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgJ2QnXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0ICdkJ1xuICAgICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UgW1swLCAwXSwgWzAsIDNdXSwgJ2FkZEZvbydcbiAgICAgICAga2V5ZG93biAnZXNjYXBlJ1xuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsICA1XVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnYWRkRm9vJ1xuXG4gICAgICAgIGtleWRvd24gJy4nXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdhZGRGb2FkZEZvb28nXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgIDEwXVxuXG4gIGRlc2NyaWJlICd0aGUgYSBrZXliaW5kaW5nJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnJylcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG5cbiAgICBpdCBcImNhbiBiZSB1bmRvbmUgaW4gb25lIGdvXCIsIC0+XG4gICAgICBrZXlkb3duICdhJ1xuICAgICAgZWRpdG9yLmluc2VydFRleHQoXCJhYmNcIilcbiAgICAgIGtleWRvd24gJ2VzY2FwZSdcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiYWJjXCJcbiAgICAgIGtleWRvd24gJ3UnXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXG5cbiAgICBpdCBcInJlcGVhdHMgY29ycmVjdGx5XCIsIC0+XG4gICAgICBrZXlkb3duICdhJ1xuICAgICAgZWRpdG9yLmluc2VydFRleHQoXCJhYmNcIilcbiAgICAgIGtleWRvd24gJ2VzY2FwZSdcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiYWJjXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMl1cbiAgICAgIGtleWRvd24gJy4nXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcImFiY2FiY1wiXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDVdXG5cbiAgZGVzY3JpYmUgXCJ0aGUgY3RybC1hL2N0cmwteCBrZXliaW5kaW5nc1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCAndmltLW1vZGUubnVtYmVyUmVnZXgnLCBzZXR0aW5ncy5jb25maWcubnVtYmVyUmVnZXguZGVmYXVsdFxuICAgICAgZWRpdG9yLnNldFRleHQoJzEyM1xcbmFiNDVcXG5jZC02N2VmXFxuYWItNVxcbmEtYmNkZWYnKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIFswLCAwXVxuICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24gWzEsIDBdXG4gICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbiBbMiwgMF1cbiAgICAgIGVkaXRvci5hZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uIFszLCAzXVxuICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24gWzQsIDBdXG5cbiAgICBkZXNjcmliZSBcImluY3JlYXNpbmcgbnVtYmVyc1wiLCAtPlxuICAgICAgaXQgXCJpbmNyZWFzZXMgdGhlIG5leHQgbnVtYmVyXCIsIC0+XG4gICAgICAgIGtleWRvd24oJ2EnLCBjdHJsOiB0cnVlKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpKS50b0VxdWFsIFtbMCwgMl0sIFsxLCAzXSwgWzIsIDRdLCBbMywgM10sIFs0LCAwXV1cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJzEyNFxcbmFiNDZcXG5jZC02NmVmXFxuYWItNFxcbmEtYmNkZWYnXG4gICAgICAgIGV4cGVjdChhdG9tLmJlZXApLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgaXQgXCJyZXBlYXRzIHdpdGggLlwiLCAtPlxuICAgICAgICBrZXlkb3duICdhJywgY3RybDogdHJ1ZVxuICAgICAgICBrZXlkb3duICcuJ1xuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpKS50b0VxdWFsIFtbMCwgMl0sIFsxLCAzXSwgWzIsIDRdLCBbMywgM10sIFs0LCAwXV1cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJzEyNVxcbmFiNDdcXG5jZC02NWVmXFxuYWItM1xcbmEtYmNkZWYnXG4gICAgICAgIGV4cGVjdChhdG9tLmJlZXApLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgaXQgXCJjYW4gaGF2ZSBhIGNvdW50XCIsIC0+XG4gICAgICAgIGtleWRvd24gJzUnXG4gICAgICAgIGtleWRvd24gJ2EnLCBjdHJsOiB0cnVlXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKCkpLnRvRXF1YWwgW1swLCAyXSwgWzEsIDNdLCBbMiwgNF0sIFszLCAyXSwgWzQsIDBdXVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnMTI4XFxuYWI1MFxcbmNkLTYyZWZcXG5hYjBcXG5hLWJjZGVmJ1xuICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGl0IFwiY2FuIG1ha2UgYSBuZWdhdGl2ZSBudW1iZXIgcG9zaXRpdmUsIGNoYW5nZSBudW1iZXIgb2YgZGlnaXRzXCIsIC0+XG4gICAgICAgIGtleWRvd24gJzknXG4gICAgICAgIGtleWRvd24gJzknXG4gICAgICAgIGtleWRvd24gJ2EnLCBjdHJsOiB0cnVlXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKCkpLnRvRXF1YWwgW1swLCAyXSwgWzEsIDRdLCBbMiwgM10sIFszLCAzXSwgWzQsIDBdXVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnMjIyXFxuYWIxNDRcXG5jZDMyZWZcXG5hYjk0XFxuYS1iY2RlZidcbiAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBpdCBcImRvZXMgbm90aGluZyB3aGVuIGN1cnNvciBpcyBhZnRlciB0aGUgbnVtYmVyXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiBbMiwgNV1cbiAgICAgICAga2V5ZG93biAnYScsIGN0cmw6IHRydWVcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKSkudG9FcXVhbCBbWzIsIDVdXVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnMTIzXFxuYWI0NVxcbmNkLTY3ZWZcXG5hYi01XFxuYS1iY2RlZidcbiAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGl0IFwiZG9lcyBub3RoaW5nIG9uIGFuIGVtcHR5IGxpbmVcIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoJ1xcbicpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiBbMCwgMF1cbiAgICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24gWzEsIDBdXG4gICAgICAgIGtleWRvd24gJ2EnLCBjdHJsOiB0cnVlXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKCkpLnRvRXF1YWwgW1swLCAwXSwgWzEsIDBdXVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnXFxuJ1xuICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgaXQgXCJob25vdXJzIHRoZSB2aW0tbW9kZTpudW1iZXJSZWdleCBzZXR0aW5nXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KCcxMjNcXG5hYjQ1XFxuY2QgLTY3ZWZcXG5hYi01XFxuYS1iY2RlZicpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiBbMCwgMF1cbiAgICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24gWzEsIDBdXG4gICAgICAgIGVkaXRvci5hZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uIFsyLCAwXVxuICAgICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbiBbMywgM11cbiAgICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24gWzQsIDBdXG4gICAgICAgIGF0b20uY29uZmlnLnNldCgndmltLW1vZGUubnVtYmVyUmVnZXgnLCAnKD86XFxcXEItKT9bMC05XSsnKVxuICAgICAgICBrZXlkb3duKCdhJywgY3RybDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKSkudG9FcXVhbCBbWzAsIDJdLCBbMSwgM10sIFsyLCA1XSwgWzMsIDNdLCBbNCwgMF1dXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICcxMjRcXG5hYjQ2XFxuY2QgLTY2ZWZcXG5hYi02XFxuYS1iY2RlZidcbiAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgZGVzY3JpYmUgXCJkZWNyZWFzaW5nIG51bWJlcnNcIiwgLT5cbiAgICAgIGl0IFwiZGVjcmVhc2VzIHRoZSBuZXh0IG51bWJlclwiLCAtPlxuICAgICAgICBrZXlkb3duKCd4JywgY3RybDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKSkudG9FcXVhbCBbWzAsIDJdLCBbMSwgM10sIFsyLCA0XSwgWzMsIDNdLCBbNCwgMF1dXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICcxMjJcXG5hYjQ0XFxuY2QtNjhlZlxcbmFiLTZcXG5hLWJjZGVmJ1xuICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGl0IFwicmVwZWF0cyB3aXRoIC5cIiwgLT5cbiAgICAgICAga2V5ZG93biAneCcsIGN0cmw6IHRydWVcbiAgICAgICAga2V5ZG93biAnLidcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKSkudG9FcXVhbCBbWzAsIDJdLCBbMSwgM10sIFsyLCA0XSwgWzMsIDNdLCBbNCwgMF1dXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICcxMjFcXG5hYjQzXFxuY2QtNjllZlxcbmFiLTdcXG5hLWJjZGVmJ1xuICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGl0IFwiY2FuIGhhdmUgYSBjb3VudFwiLCAtPlxuICAgICAgICBrZXlkb3duICc1J1xuICAgICAgICBrZXlkb3duICd4JywgY3RybDogdHJ1ZVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpKS50b0VxdWFsIFtbMCwgMl0sIFsxLCAzXSwgWzIsIDRdLCBbMywgNF0sIFs0LCAwXV1cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJzExOFxcbmFiNDBcXG5jZC03MmVmXFxuYWItMTBcXG5hLWJjZGVmJ1xuICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGl0IFwiY2FuIG1ha2UgYSBwb3NpdGl2ZSBudW1iZXIgbmVnYXRpdmUsIGNoYW5nZSBudW1iZXIgb2YgZGlnaXRzXCIsIC0+XG4gICAgICAgIGtleWRvd24gJzknXG4gICAgICAgIGtleWRvd24gJzknXG4gICAgICAgIGtleWRvd24gJ3gnLCBjdHJsOiB0cnVlXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKCkpLnRvRXF1YWwgW1swLCAxXSwgWzEsIDRdLCBbMiwgNV0sIFszLCA1XSwgWzQsIDBdXVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnMjRcXG5hYi01NFxcbmNkLTE2NmVmXFxuYWItMTA0XFxuYS1iY2RlZidcbiAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBpdCBcImRvZXMgbm90aGluZyB3aGVuIGN1cnNvciBpcyBhZnRlciB0aGUgbnVtYmVyXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiBbMiwgNV1cbiAgICAgICAga2V5ZG93biAneCcsIGN0cmw6IHRydWVcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKSkudG9FcXVhbCBbWzIsIDVdXVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnMTIzXFxuYWI0NVxcbmNkLTY3ZWZcXG5hYi01XFxuYS1iY2RlZidcbiAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGl0IFwiZG9lcyBub3RoaW5nIG9uIGFuIGVtcHR5IGxpbmVcIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoJ1xcbicpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiBbMCwgMF1cbiAgICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24gWzEsIDBdXG4gICAgICAgIGtleWRvd24gJ3gnLCBjdHJsOiB0cnVlXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKCkpLnRvRXF1YWwgW1swLCAwXSwgWzEsIDBdXVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnXFxuJ1xuICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgaXQgXCJob25vdXJzIHRoZSB2aW0tbW9kZTpudW1iZXJSZWdleCBzZXR0aW5nXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KCcxMjNcXG5hYjQ1XFxuY2QgLTY3ZWZcXG5hYi01XFxuYS1iY2RlZicpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiBbMCwgMF1cbiAgICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24gWzEsIDBdXG4gICAgICAgIGVkaXRvci5hZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uIFsyLCAwXVxuICAgICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbiBbMywgM11cbiAgICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24gWzQsIDBdXG4gICAgICAgIGF0b20uY29uZmlnLnNldCgndmltLW1vZGUubnVtYmVyUmVnZXgnLCAnKD86XFxcXEItKT9bMC05XSsnKVxuICAgICAgICBrZXlkb3duKCd4JywgY3RybDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKSkudG9FcXVhbCBbWzAsIDJdLCBbMSwgM10sIFsyLCA1XSwgWzMsIDNdLCBbNCwgMF1dXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICcxMjJcXG5hYjQ0XFxuY2QgLTY4ZWZcXG5hYi00XFxuYS1iY2RlZidcbiAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gIGRlc2NyaWJlICd0aGUgUiBrZXliaW5kaW5nJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnMTIzNDVcXG42Nzg5MCcpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDJdKVxuXG4gICAgaXQgXCJlbnRlcnMgcmVwbGFjZSBtb2RlIGFuZCByZXBsYWNlcyBjaGFyYWN0ZXJzXCIsIC0+XG4gICAgICBrZXlkb3duIFwiUlwiLCBzaGlmdDogdHJ1ZVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtbW9kZScpKS50b0JlIHRydWVcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncmVwbGFjZS1tb2RlJykpLnRvQmUgdHJ1ZVxuXG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcImFiXCJcbiAgICAgIGtleWRvd24gJ2VzY2FwZSdcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMmFiNVxcbjY3ODkwXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgM11cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaW5zZXJ0LW1vZGUnKSkudG9CZSBmYWxzZVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZXBsYWNlLW1vZGUnKSkudG9CZSBmYWxzZVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlIHRydWVcblxuICAgIGl0IFwiY29udGludWVzIGJleW9uZCBlbmQgb2YgbGluZSBhcyBpbnNlcnRcIiwgLT5cbiAgICAgIGtleWRvd24gXCJSXCIsIHNoaWZ0OiB0cnVlXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2luc2VydC1tb2RlJykpLnRvQmUgdHJ1ZVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZXBsYWNlLW1vZGUnKSkudG9CZSB0cnVlXG5cbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiYWJjZGVcIlxuICAgICAga2V5ZG93biAnZXNjYXBlJ1xuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjEyYWJjZGVcXG42Nzg5MFwiXG5cbiAgICBpdCBcInRyZWF0cyBiYWNrc3BhY2UgYXMgdW5kb1wiLCAtPlxuICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJmb29cIlxuICAgICAga2V5ZG93biBcIlJcIiwgc2hpZnQ6IHRydWVcblxuICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJhXCJcbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiYlwiXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjEyZm9vYWI1XFxuNjc4OTBcIlxuXG4gICAgICBrZXlkb3duICdiYWNrc3BhY2UnLCByYXc6IHRydWVcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTJmb29hNDVcXG42Nzg5MFwiXG5cbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiY1wiXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTJmb29hYzVcXG42Nzg5MFwiXG5cbiAgICAgIGtleWRvd24gJ2JhY2tzcGFjZScsIHJhdzogdHJ1ZVxuICAgICAga2V5ZG93biAnYmFja3NwYWNlJywgcmF3OiB0cnVlXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTJmb28zNDVcXG42Nzg5MFwiXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKS50b0JlIFwiXCJcblxuICAgICAga2V5ZG93biAnYmFja3NwYWNlJywgcmF3OiB0cnVlXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjEyZm9vMzQ1XFxuNjc4OTBcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSkudG9CZSBcIlwiXG5cbiAgICBpdCBcImNhbiBiZSByZXBlYXRlZFwiLCAtPlxuICAgICAga2V5ZG93biBcIlJcIiwgc2hpZnQ6IHRydWVcbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiYWJcIlxuICAgICAga2V5ZG93biAnZXNjYXBlJ1xuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxLCAyXSlcbiAgICAgIGtleWRvd24gJy4nXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjEyYWI1XFxuNjdhYjBcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAzXVxuXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDRdKVxuICAgICAga2V5ZG93biAnLidcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTJhYmFiXFxuNjdhYjBcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA1XVxuXG4gICAgaXQgXCJjYW4gYmUgaW50ZXJydXB0ZWQgYnkgYXJyb3cga2V5cyBhbmQgYmVoYXZlIGFzIGluc2VydCBmb3IgcmVwZWF0XCIsIC0+XG4gICAgICAjIEZJWE1FIGRvbid0IGtub3cgaG93IHRvIHRlc3QgdGhpcyAoYWxzbywgZGVwZW5kcyBvbiBQUiAjNTY4KVxuXG4gICAgaXQgXCJyZXBlYXRzIGNvcnJlY3RseSB3aGVuIGJhY2tzcGFjZSB3YXMgdXNlZCBpbiB0aGUgdGV4dFwiLCAtPlxuICAgICAga2V5ZG93biBcIlJcIiwgc2hpZnQ6IHRydWVcbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiYVwiXG4gICAgICBrZXlkb3duICdiYWNrc3BhY2UnLCByYXc6IHRydWVcbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiYlwiXG4gICAgICBrZXlkb3duICdlc2NhcGUnXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEsIDJdKVxuICAgICAga2V5ZG93biAnLidcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMTJiNDVcXG42N2I5MFwiXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDJdXG5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgNF0pXG4gICAgICBrZXlkb3duICcuJ1xuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMmI0YlxcbjY3YjkwXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNF1cblxuICAgIGl0IFwiZG9lc24ndCByZXBsYWNlIGEgY2hhcmFjdGVyIGlmIG5ld2xpbmUgaXMgZW50ZXJlZFwiLCAtPlxuICAgICAga2V5ZG93biBcIlJcIiwgc2hpZnQ6IHRydWVcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaW5zZXJ0LW1vZGUnKSkudG9CZSB0cnVlXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3JlcGxhY2UtbW9kZScpKS50b0JlIHRydWVcblxuICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJcXG5cIlxuICAgICAga2V5ZG93biAnZXNjYXBlJ1xuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjEyXFxuMzQ1XFxuNjc4OTBcIlxuIl19
