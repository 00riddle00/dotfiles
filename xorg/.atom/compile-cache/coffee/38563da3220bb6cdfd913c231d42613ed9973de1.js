(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("Motions", function() {
    var editor, editorElement, keydown, normalModeInputKeydown, parentElement, ref, submitNormalModeInputText, vimState;
    ref = [], editor = ref[0], editorElement = ref[1], parentElement = ref[2], vimState = ref[3];
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
      var theEditor;
      if (opts == null) {
        opts = {};
      }
      theEditor = opts.editor || editor;
      return theEditor.normalModeInputView.editorElement.getModel().setText(key);
    };
    submitNormalModeInputText = function(text) {
      var inputEditor;
      inputEditor = editor.normalModeInputView.editorElement;
      inputEditor.getModel().setText(text);
      return atom.commands.dispatch(inputEditor, "core:confirm");
    };
    describe("simple motions", function() {
      beforeEach(function() {
        editor.setText("12345\nabcd\nABCDE");
        return editor.setCursorScreenPosition([1, 1]);
      });
      describe("the h keybinding", function() {
        describe("as a motion", function() {
          it("moves the cursor left, but not to the previous line", function() {
            keydown('h');
            expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
            keydown('h');
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
          return it("moves the cursor to the previous line if wrapLeftRightMotion is true", function() {
            atom.config.set('vim-mode.wrapLeftRightMotion', true);
            keydown('h');
            keydown('h');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
          });
        });
        return describe("as a selection", function() {
          return it("selects the character to the left", function() {
            keydown('y');
            keydown('h');
            expect(vimState.getRegister('"').text).toBe('a');
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
      describe("the j keybinding", function() {
        it("moves the cursor down, but not to the end of the last line", function() {
          keydown('j');
          expect(editor.getCursorScreenPosition()).toEqual([2, 1]);
          keydown('j');
          return expect(editor.getCursorScreenPosition()).toEqual([2, 1]);
        });
        it("moves the cursor to the end of the line, not past it", function() {
          editor.setCursorScreenPosition([0, 4]);
          keydown('j');
          return expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
        });
        it("remembers the position it column it was in after moving to shorter line", function() {
          editor.setCursorScreenPosition([0, 4]);
          keydown('j');
          expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
          keydown('j');
          return expect(editor.getCursorScreenPosition()).toEqual([2, 4]);
        });
        return describe("when visual mode", function() {
          beforeEach(function() {
            keydown('v');
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
          it("moves the cursor down", function() {
            keydown('j');
            return expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
          });
          it("doesn't go over after the last line", function() {
            keydown('j');
            return expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
          });
          return it("selects the text while moving", function() {
            keydown('j');
            return expect(editor.getSelectedText()).toBe("bcd\nAB");
          });
        });
      });
      describe("the k keybinding", function() {
        return it("moves the cursor up, but not to the beginning of the first line", function() {
          keydown('k');
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          keydown('k');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        });
      });
      return describe("the l keybinding", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([1, 2]);
        });
        it("moves the cursor right, but not to the next line", function() {
          keydown('l');
          expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
          keydown('l');
          return expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
        });
        it("moves the cursor to the next line if wrapLeftRightMotion is true", function() {
          atom.config.set('vim-mode.wrapLeftRightMotion', true);
          keydown('l');
          keydown('l');
          return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        });
        return describe("on a blank line", function() {
          return it("doesn't move the cursor", function() {
            editor.setText("\n\n\n");
            editor.setCursorBufferPosition([1, 0]);
            keydown('l');
            return expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          });
        });
      });
    });
    describe("the w keybinding", function() {
      beforeEach(function() {
        return editor.setText("ab cde1+- \n xyz\n\nzip");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        it("moves the cursor to the beginning of the next word", function() {
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([0, 7]);
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([3, 0]);
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([3, 2]);
          keydown('w');
          return expect(editor.getCursorScreenPosition()).toEqual([3, 2]);
        });
        return it("moves the cursor to the end of the word if last word in file", function() {
          editor.setText("abc");
          editor.setCursorScreenPosition([0, 0]);
          keydown('w');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
      });
      return describe("as a selection", function() {
        describe("within a word", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('y');
            return keydown('w');
          });
          return it("selects to the end of the word", function() {
            return expect(vimState.getRegister('"').text).toBe('ab ');
          });
        });
        return describe("between words", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 2]);
            keydown('y');
            return keydown('w');
          });
          return it("selects the whitespace", function() {
            return expect(vimState.getRegister('"').text).toBe(' ');
          });
        });
      });
    });
    describe("the W keybinding", function() {
      beforeEach(function() {
        return editor.setText("cde1+- ab \n xyz\n\nzip");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("moves the cursor to the beginning of the next word", function() {
          keydown('W', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 7]);
          keydown('W', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          keydown('W', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
          keydown('W', {
            shift: true
          });
          return expect(editor.getCursorScreenPosition()).toEqual([3, 0]);
        });
      });
      return describe("as a selection", function() {
        describe("within a word", function() {
          return it("selects to the end of the whole word", function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('y');
            keydown('W', {
              shift: true
            });
            return expect(vimState.getRegister('"').text).toBe('cde1+- ');
          });
        });
        it("continues past blank lines", function() {
          editor.setCursorScreenPosition([2, 0]);
          keydown('d');
          keydown('W', {
            shift: true
          });
          expect(editor.getText()).toBe("cde1+- ab \n xyz\nzip");
          return expect(vimState.getRegister('"').text).toBe('\n');
        });
        return it("doesn't go past the end of the file", function() {
          editor.setCursorScreenPosition([3, 0]);
          keydown('d');
          keydown('W', {
            shift: true
          });
          expect(editor.getText()).toBe("cde1+- ab \n xyz\n\n");
          return expect(vimState.getRegister('"').text).toBe('zip');
        });
      });
    });
    describe("the e keybinding", function() {
      beforeEach(function() {
        return editor.setText("ab cde1+- \n xyz\n\nzip");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("moves the cursor to the end of the current word", function() {
          keydown('e');
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          keydown('e');
          expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
          keydown('e');
          expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
          keydown('e');
          expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
          keydown('e');
          return expect(editor.getCursorScreenPosition()).toEqual([3, 2]);
        });
      });
      return describe("as selection", function() {
        describe("within a word", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('y');
            return keydown('e');
          });
          return it("selects to the end of the current word", function() {
            return expect(vimState.getRegister('"').text).toBe('ab');
          });
        });
        return describe("between words", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 2]);
            keydown('y');
            return keydown('e');
          });
          return it("selects to the end of the next word", function() {
            return expect(vimState.getRegister('"').text).toBe(' cde1');
          });
        });
      });
    });
    describe("the E keybinding", function() {
      beforeEach(function() {
        return editor.setText("ab  cde1+- \n xyz \n\nzip\n");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("moves the cursor to the end of the current word", function() {
          keydown('E', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          keydown('E', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 9]);
          keydown('E', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
          keydown('E', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([3, 2]);
          keydown('E', {
            shift: true
          });
          return expect(editor.getCursorScreenPosition()).toEqual([4, 0]);
        });
      });
      return describe("as selection", function() {
        describe("within a word", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('y');
            return keydown('E', {
              shift: true
            });
          });
          return it("selects to the end of the current word", function() {
            return expect(vimState.getRegister('"').text).toBe('ab');
          });
        });
        describe("between words", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 2]);
            keydown('y');
            return keydown('E', {
              shift: true
            });
          });
          return it("selects to the end of the next word", function() {
            return expect(vimState.getRegister('"').text).toBe('  cde1+-');
          });
        });
        return describe("press more than once", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('v');
            keydown('E', {
              shift: true
            });
            keydown('E', {
              shift: true
            });
            return keydown('y');
          });
          return it("selects to the end of the current word", function() {
            return expect(vimState.getRegister('"').text).toBe('ab  cde1+-');
          });
        });
      });
    });
    describe("the ) keybinding", function() {
      beforeEach(function() {
        editor.setText("This is a sentence. This is a second sentence.\nThis is a third sentence.\n\nThis sentence is past the paragraph boundary.");
        return editor.setCursorBufferPosition([0, 0]);
      });
      describe("as a motion", function() {
        return it("moves the cursor to the beginning of the next sentence", function() {
          keydown(')');
          expect(editor.getCursorBufferPosition()).toEqual([0, 20]);
          keydown(')');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          keydown(')');
          return expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          keydown('y');
          return keydown(')');
        });
        return it('selects to the start of the next sentence', function() {
          return expect(vimState.getRegister('"').text).toBe("This is a sentence. ");
        });
      });
    });
    describe("the ( keybinding", function() {
      beforeEach(function() {
        editor.setText("This first sentence is in its own paragraph.\n\nThis is a sentence. This is a second sentence.\nThis is a third sentence");
        return editor.setCursorBufferPosition([3, 0]);
      });
      describe("as a motion", function() {
        return it("moves the cursor to the beginning of the previous sentence", function() {
          keydown('(');
          expect(editor.getCursorBufferPosition()).toEqual([2, 20]);
          keydown('(');
          expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
          keydown('(');
          return expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('(');
        });
        return it('selects to the end of the previous sentence', function() {
          return expect(vimState.getRegister('"').text).toBe("This is a second sentence.\n");
        });
      });
    });
    describe("the } keybinding", function() {
      beforeEach(function() {
        editor.setText("abcde\n\nfghij\nhijk\n  xyz  \n\nzip\n\n  \nthe end");
        return editor.setCursorScreenPosition([0, 0]);
      });
      describe("as a motion", function() {
        return it("moves the cursor to the end of the paragraph", function() {
          keydown('}');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          keydown('}');
          expect(editor.getCursorScreenPosition()).toEqual([5, 0]);
          keydown('}');
          expect(editor.getCursorScreenPosition()).toEqual([7, 0]);
          keydown('}');
          return expect(editor.getCursorScreenPosition()).toEqual([9, 6]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('}');
        });
        return it('selects to the end of the current paragraph', function() {
          return expect(vimState.getRegister('"').text).toBe("abcde\n");
        });
      });
    });
    describe("the { keybinding", function() {
      beforeEach(function() {
        editor.setText("abcde\n\nfghij\nhijk\n  xyz  \n\nzip\n\n  \nthe end");
        return editor.setCursorScreenPosition([9, 0]);
      });
      describe("as a motion", function() {
        return it("moves the cursor to the beginning of the paragraph", function() {
          keydown('{');
          expect(editor.getCursorScreenPosition()).toEqual([7, 0]);
          keydown('{');
          expect(editor.getCursorScreenPosition()).toEqual([5, 0]);
          keydown('{');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          keydown('{');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([7, 0]);
          keydown('y');
          return keydown('{');
        });
        return it('selects to the beginning of the current paragraph', function() {
          return expect(vimState.getRegister('"').text).toBe("\nzip\n");
        });
      });
    });
    describe("the b keybinding", function() {
      beforeEach(function() {
        return editor.setText(" ab cde1+- \n xyz\n\nzip }\n last");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([4, 1]);
        });
        return it("moves the cursor to the beginning of the previous word", function() {
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([3, 4]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([3, 0]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          keydown('b');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      return describe("as a selection", function() {
        describe("within a word", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 2]);
            keydown('y');
            return keydown('b');
          });
          return it("selects to the beginning of the current word", function() {
            expect(vimState.getRegister('"').text).toBe('a');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          });
        });
        return describe("between words", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 4]);
            keydown('y');
            return keydown('b');
          });
          return it("selects to the beginning of the last word", function() {
            expect(vimState.getRegister('"').text).toBe('ab ');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          });
        });
      });
    });
    describe("the B keybinding", function() {
      beforeEach(function() {
        return editor.setText("cde1+- ab \n\t xyz-123\n\n zip");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([4, 1]);
        });
        return it("moves the cursor to the beginning of the previous word", function() {
          keydown('B', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([3, 1]);
          keydown('B', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
          keydown('B', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
          keydown('B', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 7]);
          keydown('B', {
            shift: true
          });
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      return describe("as a selection", function() {
        it("selects to the beginning of the whole word", function() {
          editor.setCursorScreenPosition([1, 9]);
          keydown('y');
          keydown('B', {
            shift: true
          });
          return expect(vimState.getRegister('"').text).toBe('xyz-12');
        });
        return it("doesn't go past the beginning of the file", function() {
          editor.setCursorScreenPosition([0, 0]);
          vimState.setRegister('"', {
            text: 'abc'
          });
          keydown('y');
          keydown('B', {
            shift: true
          });
          return expect(vimState.getRegister('"').text).toBe('abc');
        });
      });
    });
    describe("the ^ keybinding", function() {
      beforeEach(function() {
        return editor.setText("  abcde");
      });
      describe("from the beginning of the line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('^');
          });
          return it("moves the cursor to the first character of the line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('^');
          });
          return it('selects to the first character of the line', function() {
            expect(editor.getText()).toBe('abcde');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          });
        });
      });
      describe("from the first character of the line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 2]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('^');
          });
          return it("stays put", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('^');
          });
          return it("does nothing", function() {
            expect(editor.getText()).toBe('  abcde');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
      });
      return describe("from the middle of a word", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 4]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('^');
          });
          return it("moves the cursor to the first character of the line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('^');
          });
          return it('selects to the first character of the line', function() {
            expect(editor.getText()).toBe('  cde');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
      });
    });
    describe("the 0 keybinding", function() {
      beforeEach(function() {
        editor.setText("  abcde");
        return editor.setCursorScreenPosition([0, 4]);
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return keydown('0');
        });
        return it("moves the cursor to the first column", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          keydown('d');
          return keydown('0');
        });
        return it('selects to the first column of the line', function() {
          expect(editor.getText()).toBe('cde');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
    });
    describe("the $ keybinding", function() {
      beforeEach(function() {
        editor.setText("  abcde\n\n1234567890");
        return editor.setCursorScreenPosition([0, 4]);
      });
      describe("as a motion from empty line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([1, 0]);
        });
        return it("moves the cursor to the end of the line", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
        });
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return keydown('$');
        });
        it("moves the cursor to the end of the line", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        });
        return it("should remain in the last column when moving down", function() {
          keydown('j');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          keydown('j');
          return expect(editor.getCursorScreenPosition()).toEqual([2, 9]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          keydown('d');
          return keydown('$');
        });
        return it("selects to the beginning of the lines", function() {
          expect(editor.getText()).toBe("  ab\n\n1234567890");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        });
      });
    });
    describe("the 0 keybinding", function() {
      beforeEach(function() {
        editor.setText("  a\n");
        return editor.setCursorScreenPosition([0, 2]);
      });
      return describe("as a motion", function() {
        beforeEach(function() {
          return keydown('0');
        });
        return it("moves the cursor to the beginning of the line", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
    });
    describe("the - keybinding", function() {
      beforeEach(function() {
        return editor.setText("abcdefg\n  abc\n  abc\n");
      });
      describe("from the middle of a line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([1, 3]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('-');
          });
          return it("moves the cursor to the first character of the previous line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('-');
          });
          return it("deletes the current and previous line", function() {
            return expect(editor.getText()).toBe("  abc\n");
          });
        });
      });
      describe("from the first character of a line indented the same as the previous one", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([2, 2]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('-');
          });
          return it("moves to the first character of the previous line (directly above)", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('-');
          });
          return it("selects to the first character of the previous line (directly above)", function() {
            return expect(editor.getText()).toBe("abcdefg\n");
          });
        });
      });
      describe("from the beginning of a line preceded by an indented line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([2, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('-');
          });
          return it("moves the cursor to the first character of the previous line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('-');
          });
          return it("selects to the first character of the previous line", function() {
            return expect(editor.getText()).toBe("abcdefg\n");
          });
        });
      });
      return describe("with a count", function() {
        beforeEach(function() {
          editor.setText("1\n2\n3\n4\n5\n6\n");
          return editor.setCursorScreenPosition([4, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            keydown('3');
            return keydown('-');
          });
          return it("moves the cursor to the first character of that many lines previous", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            keydown('3');
            return keydown('-');
          });
          return it("deletes the current line plus that many previous lines", function() {
            expect(editor.getText()).toBe("1\n6\n");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
    });
    describe("the + keybinding", function() {
      beforeEach(function() {
        return editor.setText("  abc\n  abc\nabcdefg\n");
      });
      describe("from the middle of a line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([1, 3]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('+');
          });
          return it("moves the cursor to the first character of the next line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('+');
          });
          return it("deletes the current and next line", function() {
            return expect(editor.getText()).toBe("  abc\n");
          });
        });
      });
      describe("from the first character of a line indented the same as the next one", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 2]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('+');
          });
          return it("moves to the first character of the next line (directly below)", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('+');
          });
          return it("selects to the first character of the next line (directly below)", function() {
            return expect(editor.getText()).toBe("abcdefg\n");
          });
        });
      });
      describe("from the beginning of a line followed by an indented line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('+');
          });
          return it("moves the cursor to the first character of the next line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('+');
          });
          return it("selects to the first character of the next line", function() {
            expect(editor.getText()).toBe("abcdefg\n");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          });
        });
      });
      return describe("with a count", function() {
        beforeEach(function() {
          editor.setText("1\n2\n3\n4\n5\n6\n");
          return editor.setCursorScreenPosition([1, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            keydown('3');
            return keydown('+');
          });
          return it("moves the cursor to the first character of that many lines following", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([4, 0]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            keydown('3');
            return keydown('+');
          });
          return it("deletes the current line plus that many following lines", function() {
            expect(editor.getText()).toBe("1\n6\n");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
    });
    describe("the _ keybinding", function() {
      beforeEach(function() {
        return editor.setText("  abc\n  abc\nabcdefg\n");
      });
      describe("from the middle of a line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([1, 3]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('_');
          });
          return it("moves the cursor to the first character of the current line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('_');
          });
          return it("deletes the current line", function() {
            expect(editor.getText()).toBe("  abc\nabcdefg\n");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
      return describe("with a count", function() {
        beforeEach(function() {
          editor.setText("1\n2\n3\n4\n5\n6\n");
          return editor.setCursorScreenPosition([1, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            keydown('3');
            return keydown('_');
          });
          return it("moves the cursor to the first character of that many lines following", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([3, 0]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            keydown('3');
            return keydown('_');
          });
          return it("deletes the current line plus that many following lines", function() {
            expect(editor.getText()).toBe("1\n5\n6\n");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
    });
    describe("the enter keybinding", function() {
      var keydownCodeForEnter, startingText;
      keydownCodeForEnter = '\r';
      startingText = "  abc\n  abc\nabcdefg\n";
      return describe("from the middle of a line", function() {
        var startingCursorPosition;
        startingCursorPosition = [1, 3];
        describe("as a motion", function() {
          return it("acts the same as the + keybinding", function() {
            var referenceCursorPosition;
            editor.setText(startingText);
            editor.setCursorScreenPosition(startingCursorPosition);
            keydown('+');
            referenceCursorPosition = editor.getCursorScreenPosition();
            editor.setText(startingText);
            editor.setCursorScreenPosition(startingCursorPosition);
            keydown(keydownCodeForEnter);
            return expect(editor.getCursorScreenPosition()).toEqual(referenceCursorPosition);
          });
        });
        return describe("as a selection", function() {
          return it("acts the same as the + keybinding", function() {
            var referenceCursorPosition, referenceText;
            editor.setText(startingText);
            editor.setCursorScreenPosition(startingCursorPosition);
            keydown('d');
            keydown('+');
            referenceText = editor.getText();
            referenceCursorPosition = editor.getCursorScreenPosition();
            editor.setText(startingText);
            editor.setCursorScreenPosition(startingCursorPosition);
            keydown('d');
            keydown(keydownCodeForEnter);
            expect(editor.getText()).toEqual(referenceText);
            return expect(editor.getCursorScreenPosition()).toEqual(referenceCursorPosition);
          });
        });
      });
    });
    describe("the gg keybinding", function() {
      beforeEach(function() {
        editor.setText(" 1abc\n 2\n3\n");
        return editor.setCursorScreenPosition([0, 2]);
      });
      describe("as a motion", function() {
        describe("in normal mode", function() {
          beforeEach(function() {
            keydown('g');
            return keydown('g');
          });
          return it("moves the cursor to the beginning of the first line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          });
        });
        describe("in linewise visual mode", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([1, 0]);
            vimState.activateVisualMode('linewise');
            keydown('g');
            return keydown('g');
          });
          it("selects to the first line in the file", function() {
            return expect(editor.getSelectedText()).toBe(" 1abc\n 2\n");
          });
          return it("moves the cursor to a specified line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          });
        });
        return describe("in characterwise visual mode", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([1, 1]);
            vimState.activateVisualMode();
            keydown('g');
            return keydown('g');
          });
          it("selects to the first line in the file", function() {
            return expect(editor.getSelectedText()).toBe("1abc\n 2");
          });
          return it("moves the cursor to a specified line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          });
        });
      });
      return describe("as a repeated motion", function() {
        describe("in normal mode", function() {
          beforeEach(function() {
            keydown('2');
            keydown('g');
            return keydown('g');
          });
          return it("moves the cursor to a specified line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        describe("in linewise visual motion", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([2, 0]);
            vimState.activateVisualMode('linewise');
            keydown('2');
            keydown('g');
            return keydown('g');
          });
          it("selects to a specified line", function() {
            return expect(editor.getSelectedText()).toBe(" 2\n3\n");
          });
          return it("moves the cursor to a specified line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        return describe("in characterwise visual motion", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([2, 0]);
            vimState.activateVisualMode();
            keydown('2');
            keydown('g');
            return keydown('g');
          });
          it("selects to a first character of specified line", function() {
            return expect(editor.getSelectedText()).toBe("2\n3");
          });
          return it("moves the cursor to a specified line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          });
        });
      });
    });
    describe("the g_ keybinding", function() {
      beforeEach(function() {
        return editor.setText("1  \n    2  \n 3abc\n ");
      });
      describe("as a motion", function() {
        it("moves the cursor to the last nonblank character", function() {
          editor.setCursorScreenPosition([1, 0]);
          keydown('g');
          keydown('_');
          return expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
        });
        return it("will move the cursor to the beginning of the line if necessary", function() {
          editor.setCursorScreenPosition([0, 2]);
          keydown('g');
          keydown('_');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      describe("as a repeated motion", function() {
        return it("moves the cursor downward and outward", function() {
          editor.setCursorScreenPosition([0, 0]);
          keydown('2');
          keydown('g');
          keydown('_');
          return expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
        });
      });
      return describe("as a selection", function() {
        return it("selects the current line excluding whitespace", function() {
          editor.setCursorScreenPosition([1, 2]);
          vimState.activateVisualMode();
          keydown('2');
          keydown('g');
          keydown('_');
          return expect(editor.getSelectedText()).toEqual("  2  \n 3abc");
        });
      });
    });
    describe("the G keybinding", function() {
      beforeEach(function() {
        editor.setText("1\n    2\n 3abc\n ");
        return editor.setCursorScreenPosition([0, 2]);
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return keydown('G', {
            shift: true
          });
        });
        return it("moves the cursor to the last line after whitespace", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([3, 0]);
        });
      });
      describe("as a repeated motion", function() {
        beforeEach(function() {
          keydown('2');
          return keydown('G', {
            shift: true
          });
        });
        return it("moves the cursor to a specified line", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([1, 0]);
          vimState.activateVisualMode();
          return keydown('G', {
            shift: true
          });
        });
        it("selects to the last line in the file", function() {
          return expect(editor.getSelectedText()).toBe("    2\n 3abc\n ");
        });
        return it("moves the cursor to the last line after whitespace", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([3, 1]);
        });
      });
    });
    describe("the / keybinding", function() {
      var pane;
      pane = null;
      beforeEach(function() {
        pane = {
          activate: jasmine.createSpy("activate")
        };
        spyOn(atom.workspace, 'getActivePane').andReturn(pane);
        editor.setText("abc\ndef\nabc\ndef\n");
        editor.setCursorBufferPosition([0, 0]);
        vimState.globalVimState.searchHistory = [];
        return vimState.globalVimState.currentSearch = {};
      });
      describe("as a motion", function() {
        it("beeps when repeating nonexistent last search", function() {
          keydown('/');
          submitNormalModeInputText('');
          expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
          return expect(atom.beep).toHaveBeenCalled();
        });
        it("moves the cursor to the specified search pattern", function() {
          keydown('/');
          submitNormalModeInputText('def');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          expect(pane.activate).toHaveBeenCalled();
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("loops back around", function() {
          editor.setCursorBufferPosition([3, 0]);
          keydown('/');
          submitNormalModeInputText('def');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("uses a valid regex as a regex", function() {
          keydown('/');
          submitNormalModeInputText('[abc]');
          expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          keydown('n');
          expect(editor.getCursorBufferPosition()).toEqual([0, 2]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("uses an invalid regex as a literal string", function() {
          editor.setText("abc\n[abc]\n");
          keydown('/');
          submitNormalModeInputText('[abc');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          keydown('n');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("uses ? as a literal string", function() {
          editor.setText("abc\n[a?c?\n");
          keydown('/');
          submitNormalModeInputText('?');
          expect(editor.getCursorBufferPosition()).toEqual([1, 2]);
          keydown('n');
          expect(editor.getCursorBufferPosition()).toEqual([1, 4]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it('works with selection in visual mode', function() {
          editor.setText('one two three');
          keydown('v');
          keydown('/');
          submitNormalModeInputText('th');
          expect(editor.getCursorBufferPosition()).toEqual([0, 9]);
          keydown('d');
          expect(editor.getText()).toBe('hree');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it('extends selection when repeating search in visual mode', function() {
          var end, ref1, ref2, start;
          editor.setText('line1\nline2\nline3');
          keydown('v');
          keydown('/');
          submitNormalModeInputText('line');
          ref1 = editor.getSelectedBufferRange(), start = ref1.start, end = ref1.end;
          expect(start.row).toEqual(0);
          expect(end.row).toEqual(1);
          keydown('n');
          ref2 = editor.getSelectedBufferRange(), start = ref2.start, end = ref2.end;
          expect(start.row).toEqual(0);
          expect(end.row).toEqual(2);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        describe("case sensitivity", function() {
          beforeEach(function() {
            editor.setText("\nabc\nABC\n");
            editor.setCursorBufferPosition([0, 0]);
            return keydown('/');
          });
          it("works in case sensitive mode", function() {
            submitNormalModeInputText('ABC');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          it("works in case insensitive mode", function() {
            submitNormalModeInputText('\\cAbC');
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          it("works in case insensitive mode wherever \\c is", function() {
            submitNormalModeInputText('AbC\\c');
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          it("uses case insensitive search if useSmartcaseForSearch is true and searching lowercase", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            submitNormalModeInputText('abc');
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          return it("uses case sensitive search if useSmartcaseForSearch is true and searching uppercase", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            submitNormalModeInputText('ABC');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
        });
        describe("repeating", function() {
          return it("does nothing with no search history", function() {
            editor.setCursorBufferPosition([0, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
            expect(atom.beep).toHaveBeenCalled();
            editor.setCursorBufferPosition([1, 1]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([1, 1]);
            return expect(atom.beep.callCount).toBe(2);
          });
        });
        describe("repeating with search history", function() {
          beforeEach(function() {
            keydown('/');
            return submitNormalModeInputText('def');
          });
          it("repeats previous search with /<enter>", function() {
            keydown('/');
            submitNormalModeInputText('');
            expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          it("repeats previous search with //", function() {
            keydown('/');
            submitNormalModeInputText('/');
            expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          describe("the n keybinding", function() {
            return it("repeats the last search", function() {
              keydown('n');
              expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
              return expect(atom.beep).not.toHaveBeenCalled();
            });
          });
          return describe("the N keybinding", function() {
            return it("repeats the last search backwards", function() {
              editor.setCursorBufferPosition([0, 0]);
              keydown('N', {
                shift: true
              });
              expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
              keydown('N', {
                shift: true
              });
              expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
              return expect(atom.beep).not.toHaveBeenCalled();
            });
          });
        });
        return describe("composing", function() {
          it("composes with operators", function() {
            keydown('d');
            keydown('/');
            submitNormalModeInputText('def');
            expect(editor.getText()).toEqual("def\nabc\ndef\n");
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          return it("repeats correctly with operators", function() {
            keydown('d');
            keydown('/');
            submitNormalModeInputText('def');
            keydown('.');
            expect(editor.getText()).toEqual("def\n");
            return expect(atom.beep).not.toHaveBeenCalled();
          });
        });
      });
      describe("when reversed as ?", function() {
        it("moves the cursor backwards to the specified search pattern", function() {
          keydown('?');
          submitNormalModeInputText('def');
          expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("accepts / as a literal search pattern", function() {
          editor.setText("abc\nd/f\nabc\nd/f\n");
          editor.setCursorBufferPosition([0, 0]);
          keydown('?');
          submitNormalModeInputText('/');
          expect(editor.getCursorBufferPosition()).toEqual([3, 1]);
          keydown('?');
          submitNormalModeInputText('/');
          expect(editor.getCursorBufferPosition()).toEqual([1, 1]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        return describe("repeating", function() {
          beforeEach(function() {
            keydown('?');
            return submitNormalModeInputText('def');
          });
          it("repeats previous search as reversed with ?<enter>", function() {
            keydown('?');
            submitNormalModeInputText('');
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          it("repeats previous search as reversed with ??", function() {
            keydown('?');
            submitNormalModeInputText('?');
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          describe('the n keybinding', function() {
            return it("repeats the last search backwards", function() {
              editor.setCursorBufferPosition([0, 0]);
              keydown('n');
              expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
              return expect(atom.beep).not.toHaveBeenCalled();
            });
          });
          return describe('the N keybinding', function() {
            return it("repeats the last search forwards", function() {
              editor.setCursorBufferPosition([0, 0]);
              keydown('N', {
                shift: true
              });
              expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
              return expect(atom.beep).not.toHaveBeenCalled();
            });
          });
        });
      });
      return describe("using search history", function() {
        var inputEditor;
        inputEditor = null;
        beforeEach(function() {
          keydown('/');
          submitNormalModeInputText('def');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          keydown('/');
          submitNormalModeInputText('abc');
          expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
          return inputEditor = editor.normalModeInputView.editorElement;
        });
        it("allows searching history in the search field", function() {
          keydown('/');
          atom.commands.dispatch(inputEditor, 'core:move-up');
          expect(inputEditor.getModel().getText()).toEqual('abc');
          atom.commands.dispatch(inputEditor, 'core:move-up');
          expect(inputEditor.getModel().getText()).toEqual('def');
          atom.commands.dispatch(inputEditor, 'core:move-up');
          expect(inputEditor.getModel().getText()).toEqual('def');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        return it("resets the search field to empty when scrolling back", function() {
          keydown('/');
          atom.commands.dispatch(inputEditor, 'core:move-up');
          expect(inputEditor.getModel().getText()).toEqual('abc');
          atom.commands.dispatch(inputEditor, 'core:move-up');
          expect(inputEditor.getModel().getText()).toEqual('def');
          atom.commands.dispatch(inputEditor, 'core:move-down');
          expect(inputEditor.getModel().getText()).toEqual('abc');
          atom.commands.dispatch(inputEditor, 'core:move-down');
          expect(inputEditor.getModel().getText()).toEqual('');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
      });
    });
    describe("the * keybinding", function() {
      beforeEach(function() {
        editor.setText("abd\n@def\nabd\ndef\n");
        return editor.setCursorBufferPosition([0, 0]);
      });
      return describe("as a motion", function() {
        it("moves cursor to next occurence of word under cursor", function() {
          keydown("*");
          return expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
        });
        it("repeats with the n key", function() {
          keydown("*");
          expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
          keydown("n");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
        });
        it("doesn't move cursor unless next occurence is the exact word (no partial matches)", function() {
          editor.setText("abc\ndef\nghiabc\njkl\nabcdef");
          editor.setCursorBufferPosition([0, 0]);
          keydown("*");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
        });
        describe("with words that contain 'non-word' characters", function() {
          it("moves cursor to next occurence of word under cursor", function() {
            editor.setText("abc\n@def\nabc\n@def\n");
            editor.setCursorBufferPosition([1, 0]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
          });
          it("doesn't move cursor unless next match has exact word ending", function() {
            editor.setText("abc\n@def\nabc\n@def1\n");
            editor.setCursorBufferPosition([1, 1]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          });
          return it("moves cursor to the start of valid word char", function() {
            editor.setText("abc\ndef\nabc\n@def\n");
            editor.setCursorBufferPosition([1, 0]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 1]);
          });
        });
        describe("when cursor is on non-word char column", function() {
          return it("matches only the non-word char", function() {
            editor.setText("abc\n@def\nabc\n@def\n");
            editor.setCursorBufferPosition([1, 0]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
          });
        });
        describe("when cursor is not on a word", function() {
          return it("does a match with the next word", function() {
            editor.setText("abc\na  @def\n abc\n @def");
            editor.setCursorBufferPosition([1, 1]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 1]);
          });
        });
        return describe("when cursor is at EOF", function() {
          return it("doesn't try to do any match", function() {
            editor.setText("abc\n@def\nabc\n ");
            editor.setCursorBufferPosition([3, 0]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
          });
        });
      });
    });
    describe("the hash keybinding", function() {
      return describe("as a motion", function() {
        it("moves cursor to previous occurence of word under cursor", function() {
          editor.setText("abc\n@def\nabc\ndef\n");
          editor.setCursorBufferPosition([2, 1]);
          keydown("#");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
        });
        it("repeats with n", function() {
          editor.setText("abc\n@def\nabc\ndef\nabc\n");
          editor.setCursorBufferPosition([2, 1]);
          keydown("#");
          expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
          keydown("n");
          expect(editor.getCursorBufferPosition()).toEqual([4, 0]);
          keydown("n");
          return expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
        });
        it("doesn't move cursor unless next occurence is the exact word (no partial matches)", function() {
          editor.setText("abc\ndef\nghiabc\njkl\nabcdef");
          editor.setCursorBufferPosition([0, 0]);
          keydown("#");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
        });
        describe("with words that containt 'non-word' characters", function() {
          it("moves cursor to next occurence of word under cursor", function() {
            editor.setText("abc\n@def\nabc\n@def\n");
            editor.setCursorBufferPosition([3, 0]);
            keydown("#");
            return expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          });
          return it("moves cursor to the start of valid word char", function() {
            editor.setText("abc\n@def\nabc\ndef\n");
            editor.setCursorBufferPosition([3, 0]);
            keydown("#");
            return expect(editor.getCursorBufferPosition()).toEqual([1, 1]);
          });
        });
        return describe("when cursor is on non-word char column", function() {
          return it("matches only the non-word char", function() {
            editor.setText("abc\n@def\nabc\n@def\n");
            editor.setCursorBufferPosition([1, 0]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
          });
        });
      });
    });
    describe("the H keybinding", function() {
      beforeEach(function() {
        editor.setText("1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n");
        editor.setCursorScreenPosition([8, 0]);
        return spyOn(editor.getLastCursor(), 'setScreenPosition');
      });
      it("moves the cursor to the first row if visible", function() {
        spyOn(editorElement, 'getFirstVisibleScreenRow').andReturn(0);
        keydown('H', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([0, 0]);
      });
      it("moves the cursor to the first visible row plus offset", function() {
        spyOn(editorElement, 'getFirstVisibleScreenRow').andReturn(2);
        keydown('H', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([4, 0]);
      });
      return it("respects counts", function() {
        spyOn(editorElement, 'getFirstVisibleScreenRow').andReturn(0);
        keydown('3');
        keydown('H', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([2, 0]);
      });
    });
    describe("the L keybinding", function() {
      beforeEach(function() {
        editor.setText("1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n");
        editor.setCursorScreenPosition([8, 0]);
        return spyOn(editor.getLastCursor(), 'setScreenPosition');
      });
      it("moves the cursor to the first row if visible", function() {
        spyOn(editorElement, 'getLastVisibleScreenRow').andReturn(10);
        keydown('L', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([10, 0]);
      });
      it("moves the cursor to the first visible row plus offset", function() {
        spyOn(editorElement, 'getLastVisibleScreenRow').andReturn(6);
        keydown('L', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([4, 0]);
      });
      return it("respects counts", function() {
        spyOn(editorElement, 'getLastVisibleScreenRow').andReturn(10);
        keydown('3');
        keydown('L', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([8, 0]);
      });
    });
    describe("the M keybinding", function() {
      beforeEach(function() {
        editor.setText("1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n");
        editor.setCursorScreenPosition([8, 0]);
        spyOn(editor.getLastCursor(), 'setScreenPosition');
        spyOn(editorElement, 'getLastVisibleScreenRow').andReturn(10);
        return spyOn(editorElement, 'getFirstVisibleScreenRow').andReturn(0);
      });
      return it("moves the cursor to the first row if visible", function() {
        keydown('M', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([5, 0]);
      });
    });
    describe('the mark keybindings', function() {
      beforeEach(function() {
        editor.setText('  12\n    34\n56\n');
        return editor.setCursorBufferPosition([0, 1]);
      });
      it('moves to the beginning of the line of a mark', function() {
        editor.setCursorBufferPosition([1, 1]);
        keydown('m');
        normalModeInputKeydown('a');
        editor.setCursorBufferPosition([0, 0]);
        keydown('\'');
        normalModeInputKeydown('a');
        return expect(editor.getCursorBufferPosition()).toEqual([1, 4]);
      });
      it('moves literally to a mark', function() {
        editor.setCursorBufferPosition([1, 1]);
        keydown('m');
        normalModeInputKeydown('a');
        editor.setCursorBufferPosition([0, 0]);
        keydown('`');
        normalModeInputKeydown('a');
        return expect(editor.getCursorBufferPosition()).toEqual([1, 1]);
      });
      it('deletes to a mark by line', function() {
        editor.setCursorBufferPosition([1, 5]);
        keydown('m');
        normalModeInputKeydown('a');
        editor.setCursorBufferPosition([0, 0]);
        keydown('d');
        keydown('\'');
        normalModeInputKeydown('a');
        return expect(editor.getText()).toEqual('56\n');
      });
      it('deletes before to a mark literally', function() {
        editor.setCursorBufferPosition([1, 5]);
        keydown('m');
        normalModeInputKeydown('a');
        editor.setCursorBufferPosition([0, 1]);
        keydown('d');
        keydown('`');
        normalModeInputKeydown('a');
        return expect(editor.getText()).toEqual(' 4\n56\n');
      });
      it('deletes after to a mark literally', function() {
        editor.setCursorBufferPosition([1, 5]);
        keydown('m');
        normalModeInputKeydown('a');
        editor.setCursorBufferPosition([2, 1]);
        keydown('d');
        keydown('`');
        normalModeInputKeydown('a');
        return expect(editor.getText()).toEqual('  12\n    36\n');
      });
      return it('moves back to previous', function() {
        editor.setCursorBufferPosition([1, 5]);
        keydown('`');
        normalModeInputKeydown('`');
        editor.setCursorBufferPosition([2, 1]);
        keydown('`');
        normalModeInputKeydown('`');
        return expect(editor.getCursorBufferPosition()).toEqual([1, 5]);
      });
    });
    describe('the f/F keybindings', function() {
      beforeEach(function() {
        editor.setText("abcabcabcabc\n");
        return editor.setCursorScreenPosition([0, 0]);
      });
      it('moves to the first specified character it finds', function() {
        keydown('f');
        normalModeInputKeydown('c');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it('moves backwards to the first specified character it finds', function() {
        editor.setCursorScreenPosition([0, 2]);
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
      });
      it('respects count forward', function() {
        keydown('2');
        keydown('f');
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
      });
      it('respects count backward', function() {
        editor.setCursorScreenPosition([0, 6]);
        keydown('2');
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
      });
      it("doesn't move if the character specified isn't found", function() {
        keydown('f');
        normalModeInputKeydown('d');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        return expect(atom.beep).not.toHaveBeenCalled();
      });
      it("doesn't move if there aren't the specified count of the specified character", function() {
        keydown('1');
        keydown('0');
        keydown('f');
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        keydown('1');
        keydown('1');
        keydown('f');
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        editor.setCursorScreenPosition([0, 6]);
        keydown('1');
        keydown('0');
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        keydown('1');
        keydown('1');
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
      });
      it("composes with d", function() {
        editor.setCursorScreenPosition([0, 3]);
        keydown('d');
        keydown('2');
        keydown('f');
        normalModeInputKeydown('a');
        return expect(editor.getText()).toEqual('abcbc\n');
      });
      it("cancels c when no match found", function() {
        keydown('c');
        keydown('f');
        normalModeInputKeydown('d');
        expect(editor.getText()).toBe("abcabcabcabc\n");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        return expect(vimState.mode).toBe("normal");
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
        beforeEach(function() {
          editor.setText("abcébcabcébc\n");
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it('works with IME composition', function() {
          var domNode, inputNode, normalModeEditor;
          keydown('f');
          normalModeEditor = editor.normalModeInputView.editorElement;
          jasmine.attachToDOM(normalModeEditor);
          domNode = normalModeEditor.component.domNode;
          inputNode = domNode.querySelector('.hidden-input');
          domNode.dispatchEvent(buildIMECompositionEvent('compositionstart', {
            target: inputNode
          }));
          domNode.dispatchEvent(buildIMECompositionEvent('compositionupdate', {
            data: "´",
            target: inputNode
          }));
          expect(normalModeEditor.getModel().getText()).toEqual('´');
          domNode.dispatchEvent(buildIMECompositionEvent('compositionend', {
            data: "é",
            target: inputNode
          }));
          domNode.dispatchEvent(buildTextInputEvent({
            data: 'é',
            target: inputNode
          }));
          return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        });
      });
    });
    describe('the t/T keybindings', function() {
      beforeEach(function() {
        editor.setText("abcabcabcabc\n");
        return editor.setCursorScreenPosition([0, 0]);
      });
      it('moves to the character previous to the first specified character it finds', function() {
        keydown('t');
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown('t');
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it('moves backwards to the character after the first specified character it finds', function() {
        editor.setCursorScreenPosition([0, 2]);
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
      });
      it('respects count forward', function() {
        keydown('2');
        keydown('t');
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
      });
      it('respects count backward', function() {
        editor.setCursorScreenPosition([0, 6]);
        keydown('2');
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
      });
      it("doesn't move if the character specified isn't found", function() {
        keydown('t');
        normalModeInputKeydown('d');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        return expect(atom.beep).not.toHaveBeenCalled();
      });
      it("doesn't move if there aren't the specified count of the specified character", function() {
        keydown('1');
        keydown('0');
        keydown('t');
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        keydown('1');
        keydown('1');
        keydown('t');
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        editor.setCursorScreenPosition([0, 6]);
        keydown('1');
        keydown('0');
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        keydown('1');
        keydown('1');
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
      });
      it("composes with d", function() {
        editor.setCursorScreenPosition([0, 3]);
        keydown('d');
        keydown('2');
        keydown('t');
        normalModeInputKeydown('b');
        return expect(editor.getText()).toBe('abcbcabc\n');
      });
      return it("selects character under cursor even when no movement happens", function() {
        editor.setCursorBufferPosition([0, 0]);
        keydown('d');
        keydown('t');
        normalModeInputKeydown('b');
        return expect(editor.getText()).toBe('bcabcabcabc\n');
      });
    });
    describe('the v keybinding', function() {
      beforeEach(function() {
        editor.setText("01\n002\n0003\n00004\n000005\n");
        return editor.setCursorScreenPosition([1, 1]);
      });
      it("selects down a line", function() {
        keydown('v');
        keydown('j');
        keydown('j');
        expect(editor.getSelectedText()).toBe("02\n0003\n00");
        return expect(editor.getSelectedBufferRange().isSingleLine()).toBeFalsy();
      });
      return it("selects right", function() {
        keydown('v');
        keydown('l');
        expect(editor.getSelectedText()).toBe("02");
        return expect(editor.getSelectedBufferRange().isSingleLine()).toBeTruthy();
      });
    });
    describe('the V keybinding', function() {
      beforeEach(function() {
        editor.setText("01\n002\n0003\n00004\n000005\n");
        return editor.setCursorScreenPosition([1, 1]);
      });
      it("selects down a line", function() {
        keydown('V', {
          shift: true
        });
        expect(editor.getSelectedBufferRange().isSingleLine()).toBeFalsy();
        keydown('j');
        keydown('j');
        expect(editor.getSelectedText()).toBe("002\n0003\n00004\n");
        return expect(editor.getSelectedBufferRange().isSingleLine()).toBeFalsy();
      });
      return it("selects up a line", function() {
        keydown('V', {
          shift: true
        });
        keydown('k');
        return expect(editor.getSelectedText()).toBe("01\n002\n");
      });
    });
    describe('the ; and , keybindings', function() {
      beforeEach(function() {
        editor.setText("abcabcabcabc\n");
        return editor.setCursorScreenPosition([0, 0]);
      });
      it("repeat f in same direction", function() {
        keydown('f');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown(';');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
      });
      it("repeat F in same direction", function() {
        editor.setCursorScreenPosition([0, 10]);
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
        keydown(';');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it("repeat f in opposite direction", function() {
        editor.setCursorScreenPosition([0, 6]);
        keydown('f');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
        keydown(',');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(',');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it("repeat F in opposite direction", function() {
        editor.setCursorScreenPosition([0, 4]);
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown(',');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(',');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
      });
      it("alternate repeat f in same direction and reverse", function() {
        keydown('f');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown(';');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(',');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it("alternate repeat F in same direction and reverse", function() {
        editor.setCursorScreenPosition([0, 10]);
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
        keydown(';');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(',');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
      });
      it("repeat t in same direction", function() {
        keydown('t');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
      });
      it("repeat T in same direction", function() {
        editor.setCursorScreenPosition([0, 10]);
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 9]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
      });
      it("repeat t in opposite direction first, and then reverse", function() {
        editor.setCursorScreenPosition([0, 3]);
        keydown('t');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        keydown(',');
        expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
      });
      it("repeat T in opposite direction first, and then reverse", function() {
        editor.setCursorScreenPosition([0, 4]);
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        keydown(',');
        expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
      });
      it("repeat with count in same direction", function() {
        editor.setCursorScreenPosition([0, 0]);
        keydown('f');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown('2');
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
      });
      it("repeat with count in reverse direction", function() {
        editor.setCursorScreenPosition([0, 6]);
        keydown('f');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
        keydown('2');
        keydown(',');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      return it("shares the most recent find/till command with other editors", function() {
        return helpers.getEditorElement(function(otherEditorElement) {
          var otherEditor;
          otherEditor = otherEditorElement.getModel();
          editor.setText("a baz bar\n");
          editor.setCursorScreenPosition([0, 0]);
          otherEditor.setText("foo bar baz");
          otherEditor.setCursorScreenPosition([0, 0]);
          keydown('f');
          normalModeInputKeydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          expect(otherEditor.getCursorScreenPosition()).toEqual([0, 0]);
          keydown(';', {
            element: otherEditorElement
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          expect(otherEditor.getCursorScreenPosition()).toEqual([0, 4]);
          keydown('t', {
            element: otherEditorElement
          });
          normalModeInputKeydown('r', {
            editor: otherEditor
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          expect(otherEditor.getCursorScreenPosition()).toEqual([0, 5]);
          keydown(';');
          expect(editor.getCursorScreenPosition()).toEqual([0, 7]);
          expect(otherEditor.getCursorScreenPosition()).toEqual([0, 5]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
      });
    });
    describe('the % motion', function() {
      beforeEach(function() {
        editor.setText("( ( ) )--{ text in here; and a function call(with parameters) }\n");
        return editor.setCursorScreenPosition([0, 0]);
      });
      it('matches the correct parenthesis', function() {
        keydown('%');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
      });
      it('matches the correct brace', function() {
        editor.setCursorScreenPosition([0, 9]);
        keydown('%');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 62]);
      });
      it('composes correctly with d', function() {
        editor.setCursorScreenPosition([0, 9]);
        keydown('d');
        keydown('%');
        return expect(editor.getText()).toEqual("( ( ) )--\n");
      });
      it('moves correctly when composed with v going forward', function() {
        keydown('v');
        keydown('h');
        keydown('%');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 7]);
      });
      it('moves correctly when composed with v going backward', function() {
        editor.setCursorScreenPosition([0, 5]);
        keydown('v');
        keydown('%');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
      });
      it('it moves appropriately to find the nearest matching action', function() {
        editor.setCursorScreenPosition([0, 3]);
        keydown('%');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        return expect(editor.getText()).toEqual("( ( ) )--{ text in here; and a function call(with parameters) }\n");
      });
      it('it moves appropriately to find the nearest matching action', function() {
        editor.setCursorScreenPosition([0, 26]);
        keydown('%');
        expect(editor.getCursorScreenPosition()).toEqual([0, 60]);
        return expect(editor.getText()).toEqual("( ( ) )--{ text in here; and a function call(with parameters) }\n");
      });
      it("finds matches across multiple lines", function() {
        editor.setText("...(\n...)");
        editor.setCursorScreenPosition([0, 0]);
        keydown("%");
        return expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
      });
      return it("does not affect search history", function() {
        keydown('/');
        submitNormalModeInputText('func');
        expect(editor.getCursorBufferPosition()).toEqual([0, 31]);
        keydown('%');
        expect(editor.getCursorBufferPosition()).toEqual([0, 60]);
        keydown('n');
        return expect(editor.getCursorBufferPosition()).toEqual([0, 31]);
      });
    });
    return describe("scrolling screen and keeping cursor in the same screen position", function() {
      beforeEach(function() {
        var i, results;
        jasmine.attachToDOM(editorElement);
        editor.setText((function() {
          results = [];
          for (i = 0; i < 100; i++){ results.push(i); }
          return results;
        }).apply(this).join("\n"));
        editorElement.setHeight(20 * 10);
        editorElement.style.lineHeight = "10px";
        atom.views.performDocumentPoll();
        editorElement.setScrollTop(40 * 10);
        return editor.setCursorBufferPosition([42, 0]);
      });
      describe("the ctrl-u keybinding", function() {
        it("moves the screen up by half screen size and keeps cursor onscreen", function() {
          keydown('u', {
            ctrl: true
          });
          expect(editorElement.getScrollTop()).toEqual(300);
          return expect(editor.getCursorBufferPosition()).toEqual([32, 0]);
        });
        it("selects on visual mode", function() {
          editor.setCursorBufferPosition([42, 1]);
          vimState.activateVisualMode();
          keydown('u', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42].join("\n"));
        });
        return it("selects in linewise mode", function() {
          vimState.activateVisualMode('linewise');
          keydown('u', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([33, 34, 35, 36, 37, 38, 39, 40, 41, 42].join("\n").concat("\n"));
        });
      });
      describe("the ctrl-b keybinding", function() {
        it("moves screen up one page", function() {
          keydown('b', {
            ctrl: true
          });
          expect(editorElement.getScrollTop()).toEqual(200);
          return expect(editor.getCursorScreenPosition()).toEqual([22, 0]);
        });
        it("selects on visual mode", function() {
          editor.setCursorBufferPosition([42, 1]);
          vimState.activateVisualMode();
          keydown('b', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42].join("\n"));
        });
        return it("selects in linewise mode", function() {
          vimState.activateVisualMode('linewise');
          keydown('b', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42].join("\n").concat("\n"));
        });
      });
      describe("the ctrl-d keybinding", function() {
        it("moves the screen down by half screen size and keeps cursor onscreen", function() {
          keydown('d', {
            ctrl: true
          });
          expect(editorElement.getScrollTop()).toEqual(500);
          return expect(editor.getCursorBufferPosition()).toEqual([52, 0]);
        });
        it("selects on visual mode", function() {
          editor.setCursorBufferPosition([42, 1]);
          vimState.activateVisualMode();
          keydown('d', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52].join("\n").slice(1, -1));
        });
        return it("selects in linewise mode", function() {
          vimState.activateVisualMode('linewise');
          keydown('d', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53].join("\n").concat("\n"));
        });
      });
      return describe("the ctrl-f keybinding", function() {
        it("moves screen down one page", function() {
          keydown('f', {
            ctrl: true
          });
          expect(editorElement.getScrollTop()).toEqual(600);
          return expect(editor.getCursorScreenPosition()).toEqual([62, 0]);
        });
        it("selects on visual mode", function() {
          editor.setCursorBufferPosition([42, 1]);
          vimState.activateVisualMode();
          keydown('f', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62].join("\n").slice(1, -1));
        });
        return it("selects in linewise mode", function() {
          var i, results;
          vimState.activateVisualMode('linewise');
          keydown('f', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual((function() {
            results = [];
            for (i = 42; i <= 63; i++){ results.push(i); }
            return results;
          }).apply(this).join("\n").concat("\n"));
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvbW90aW9ucy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxlQUFSOztFQUVWLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUE7QUFDbEIsUUFBQTtJQUFBLE1BQW1ELEVBQW5ELEVBQUMsZUFBRCxFQUFTLHNCQUFULEVBQXdCLHNCQUF4QixFQUF1QztJQUV2QyxVQUFBLENBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFkLENBQTBCLFVBQTFCO01BQ1YsT0FBTyxDQUFDLGlCQUFSLENBQUE7YUFFQSxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsU0FBQyxPQUFEO1FBQ3ZCLGFBQUEsR0FBZ0I7UUFDaEIsTUFBQSxHQUFTLGFBQWEsQ0FBQyxRQUFkLENBQUE7UUFDVCxRQUFBLEdBQVcsYUFBYSxDQUFDO1FBQ3pCLFFBQVEsQ0FBQyxrQkFBVCxDQUFBO2VBQ0EsUUFBUSxDQUFDLGVBQVQsQ0FBQTtNQUx1QixDQUF6QjtJQUpTLENBQVg7SUFXQSxPQUFBLEdBQVUsU0FBQyxHQUFELEVBQU0sT0FBTjs7UUFBTSxVQUFROzs7UUFDdEIsT0FBTyxDQUFDLFVBQVc7O2FBQ25CLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEdBQWhCLEVBQXFCLE9BQXJCO0lBRlE7SUFJVixzQkFBQSxHQUF5QixTQUFDLEdBQUQsRUFBTSxJQUFOO0FBQ3ZCLFVBQUE7O1FBRDZCLE9BQU87O01BQ3BDLFNBQUEsR0FBWSxJQUFJLENBQUMsTUFBTCxJQUFlO2FBQzNCLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsUUFBNUMsQ0FBQSxDQUFzRCxDQUFDLE9BQXZELENBQStELEdBQS9EO0lBRnVCO0lBSXpCLHlCQUFBLEdBQTRC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LENBQXlDOzs7O3dCQUFRLENBQUMsSUFBVCxDQUFjLElBQWQsQ0FBbUIsQ0FBQyxNQUFwQixDQUEyQixJQUEzQixDQUF6QztRQUg2QixDQUEvQjtNQVpnQyxDQUFsQztJQWhFMEUsQ0FBNUU7RUE5NkRrQixDQUFwQjtBQUZBIiwic291cmNlc0NvbnRlbnQiOlsiaGVscGVycyA9IHJlcXVpcmUgJy4vc3BlYy1oZWxwZXInXG5cbmRlc2NyaWJlIFwiTW90aW9uc1wiLCAtPlxuICBbZWRpdG9yLCBlZGl0b3JFbGVtZW50LCBwYXJlbnRFbGVtZW50LCB2aW1TdGF0ZV0gPSBbXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICB2aW1Nb2RlID0gYXRvbS5wYWNrYWdlcy5sb2FkUGFja2FnZSgndmltLW1vZGUnKVxuICAgIHZpbU1vZGUuYWN0aXZhdGVSZXNvdXJjZXMoKVxuXG4gICAgaGVscGVycy5nZXRFZGl0b3JFbGVtZW50IChlbGVtZW50KSAtPlxuICAgICAgZWRpdG9yRWxlbWVudCA9IGVsZW1lbnRcbiAgICAgIGVkaXRvciA9IGVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKVxuICAgICAgdmltU3RhdGUgPSBlZGl0b3JFbGVtZW50LnZpbVN0YXRlXG4gICAgICB2aW1TdGF0ZS5hY3RpdmF0ZU5vcm1hbE1vZGUoKVxuICAgICAgdmltU3RhdGUucmVzZXROb3JtYWxNb2RlKClcblxuICBrZXlkb3duID0gKGtleSwgb3B0aW9ucz17fSkgLT5cbiAgICBvcHRpb25zLmVsZW1lbnQgPz0gZWRpdG9yRWxlbWVudFxuICAgIGhlbHBlcnMua2V5ZG93bihrZXksIG9wdGlvbnMpXG5cbiAgbm9ybWFsTW9kZUlucHV0S2V5ZG93biA9IChrZXksIG9wdHMgPSB7fSkgLT5cbiAgICB0aGVFZGl0b3IgPSBvcHRzLmVkaXRvciBvciBlZGl0b3JcbiAgICB0aGVFZGl0b3Iubm9ybWFsTW9kZUlucHV0Vmlldy5lZGl0b3JFbGVtZW50LmdldE1vZGVsKCkuc2V0VGV4dChrZXkpXG5cbiAgc3VibWl0Tm9ybWFsTW9kZUlucHV0VGV4dCA9ICh0ZXh0KSAtPlxuICAgIGlucHV0RWRpdG9yID0gZWRpdG9yLm5vcm1hbE1vZGVJbnB1dFZpZXcuZWRpdG9yRWxlbWVudFxuICAgIGlucHV0RWRpdG9yLmdldE1vZGVsKCkuc2V0VGV4dCh0ZXh0KVxuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goaW5wdXRFZGl0b3IsIFwiY29yZTpjb25maXJtXCIpXG5cbiAgZGVzY3JpYmUgXCJzaW1wbGUgbW90aW9uc1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiMTIzNDVcXG5hYmNkXFxuQUJDREVcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMSwgMV0pXG5cbiAgICBkZXNjcmliZSBcInRoZSBoIGtleWJpbmRpbmdcIiwgLT5cbiAgICAgIGRlc2NyaWJlIFwiYXMgYSBtb3Rpb25cIiwgLT5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIGxlZnQsIGJ1dCBub3QgdG8gdGhlIHByZXZpb3VzIGxpbmVcIiwgLT5cbiAgICAgICAgICBrZXlkb3duKCdoJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG5cbiAgICAgICAgICBrZXlkb3duKCdoJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBwcmV2aW91cyBsaW5lIGlmIHdyYXBMZWZ0UmlnaHRNb3Rpb24gaXMgdHJ1ZVwiLCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgndmltLW1vZGUud3JhcExlZnRSaWdodE1vdGlvbicsIHRydWUpXG4gICAgICAgICAga2V5ZG93bignaCcpXG4gICAgICAgICAga2V5ZG93bignaCcpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA0XVxuXG4gICAgICBkZXNjcmliZSBcImFzIGEgc2VsZWN0aW9uXCIsIC0+XG4gICAgICAgIGl0IFwic2VsZWN0cyB0aGUgY2hhcmFjdGVyIHRvIHRoZSBsZWZ0XCIsIC0+XG4gICAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgICAga2V5ZG93bignaCcpXG5cbiAgICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSAnYSdcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG5cbiAgICBkZXNjcmliZSBcInRoZSBqIGtleWJpbmRpbmdcIiwgLT5cbiAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciBkb3duLCBidXQgbm90IHRvIHRoZSBlbmQgb2YgdGhlIGxhc3QgbGluZVwiLCAtPlxuICAgICAgICBrZXlkb3duKCdqJylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsyLCAxXVxuXG4gICAgICAgIGtleWRvd24oJ2onKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzIsIDFdXG5cbiAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byB0aGUgZW5kIG9mIHRoZSBsaW5lLCBub3QgcGFzdCBpdFwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDRdKVxuXG4gICAgICAgIGtleWRvd24oJ2onKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDNdXG5cbiAgICAgIGl0IFwicmVtZW1iZXJzIHRoZSBwb3NpdGlvbiBpdCBjb2x1bW4gaXQgd2FzIGluIGFmdGVyIG1vdmluZyB0byBzaG9ydGVyIGxpbmVcIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCA0XSlcblxuICAgICAgICBrZXlkb3duKCdqJylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAzXVxuXG4gICAgICAgIGtleWRvd24oJ2onKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzIsIDRdXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAga2V5ZG93bigndicpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAyXVxuXG4gICAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciBkb3duXCIsIC0+XG4gICAgICAgICAga2V5ZG93bignaicpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsyLCAyXVxuXG4gICAgICAgIGl0IFwiZG9lc24ndCBnbyBvdmVyIGFmdGVyIHRoZSBsYXN0IGxpbmVcIiwgLT5cbiAgICAgICAgICBrZXlkb3duKCdqJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzIsIDJdXG5cbiAgICAgICAgaXQgXCJzZWxlY3RzIHRoZSB0ZXh0IHdoaWxlIG1vdmluZ1wiLCAtPlxuICAgICAgICAgIGtleWRvd24oJ2onKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpLnRvQmUgXCJiY2RcXG5BQlwiXG5cbiAgICBkZXNjcmliZSBcInRoZSBrIGtleWJpbmRpbmdcIiwgLT5cbiAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB1cCwgYnV0IG5vdCB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBmaXJzdCBsaW5lXCIsIC0+XG4gICAgICAgIGtleWRvd24oJ2snKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDFdXG5cbiAgICAgICAga2V5ZG93bignaycpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMV1cblxuICAgIGRlc2NyaWJlIFwidGhlIGwga2V5YmluZGluZ1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDJdKVxuXG4gICAgICBpdCBcIm1vdmVzIHRoZSBjdXJzb3IgcmlnaHQsIGJ1dCBub3QgdG8gdGhlIG5leHQgbGluZVwiLCAtPlxuICAgICAgICBrZXlkb3duKCdsJylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAzXVxuXG4gICAgICAgIGtleWRvd24oJ2wnKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDNdXG5cbiAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byB0aGUgbmV4dCBsaW5lIGlmIHdyYXBMZWZ0UmlnaHRNb3Rpb24gaXMgdHJ1ZVwiLCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ3ZpbS1tb2RlLndyYXBMZWZ0UmlnaHRNb3Rpb24nLCB0cnVlKVxuICAgICAgICBrZXlkb3duKCdsJylcbiAgICAgICAga2V5ZG93bignbCcpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMiwgMF1cblxuICAgICAgZGVzY3JpYmUgXCJvbiBhIGJsYW5rIGxpbmVcIiwgLT5cbiAgICAgICAgaXQgXCJkb2Vzbid0IG1vdmUgdGhlIGN1cnNvclwiLCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRUZXh0KFwiXFxuXFxuXFxuXCIpXG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxLCAwXSlcbiAgICAgICAgICBrZXlkb3duKCdsJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG5cbiAgZGVzY3JpYmUgXCJ0aGUgdyBrZXliaW5kaW5nXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPiBlZGl0b3Iuc2V0VGV4dChcImFiIGNkZTErLSBcXG4geHl6XFxuXFxuemlwXCIpXG5cbiAgICBkZXNjcmliZSBcImFzIGEgbW90aW9uXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+IGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG5cbiAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBuZXh0IHdvcmRcIiwgLT5cbiAgICAgICAga2V5ZG93bigndycpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgM11cblxuICAgICAgICBrZXlkb3duKCd3JylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA3XVxuXG4gICAgICAgIGtleWRvd24oJ3cnKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDFdXG5cbiAgICAgICAga2V5ZG93bigndycpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMiwgMF1cblxuICAgICAgICBrZXlkb3duKCd3JylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFszLCAwXVxuXG4gICAgICAgIGtleWRvd24oJ3cnKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzMsIDJdXG5cbiAgICAgICAgIyBXaGVuIHRoZSBjdXJzb3IgZ2V0cyB0byB0aGUgRU9GLCBpdCBzaG91bGQgc3RheSB0aGVyZS5cbiAgICAgICAga2V5ZG93bigndycpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMywgMl1cblxuICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBlbmQgb2YgdGhlIHdvcmQgaWYgbGFzdCB3b3JkIGluIGZpbGVcIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCJhYmNcIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAwXSlcbiAgICAgICAga2V5ZG93bigndycpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbChbMCwgMl0pXG5cbiAgICBkZXNjcmliZSBcImFzIGEgc2VsZWN0aW9uXCIsIC0+XG4gICAgICBkZXNjcmliZSBcIndpdGhpbiBhIHdvcmRcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG4gICAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgICAga2V5ZG93bigndycpXG5cbiAgICAgICAgaXQgXCJzZWxlY3RzIHRvIHRoZSBlbmQgb2YgdGhlIHdvcmRcIiwgLT5cbiAgICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSAnYWIgJ1xuXG4gICAgICBkZXNjcmliZSBcImJldHdlZW4gd29yZHNcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMl0pXG4gICAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgICAga2V5ZG93bigndycpXG5cbiAgICAgICAgaXQgXCJzZWxlY3RzIHRoZSB3aGl0ZXNwYWNlXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgJyAnXG5cbiAgZGVzY3JpYmUgXCJ0aGUgVyBrZXliaW5kaW5nXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPiBlZGl0b3Iuc2V0VGV4dChcImNkZTErLSBhYiBcXG4geHl6XFxuXFxuemlwXCIpXG5cbiAgICBkZXNjcmliZSBcImFzIGEgbW90aW9uXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+IGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG5cbiAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBuZXh0IHdvcmRcIiwgLT5cbiAgICAgICAga2V5ZG93bignVycsIHNoaWZ0OiB0cnVlKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDddXG5cbiAgICAgICAga2V5ZG93bignVycsIHNoaWZ0OiB0cnVlKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDFdXG5cbiAgICAgICAga2V5ZG93bignVycsIHNoaWZ0OiB0cnVlKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzIsIDBdXG5cbiAgICAgICAga2V5ZG93bignVycsIHNoaWZ0OiB0cnVlKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzMsIDBdXG5cbiAgICBkZXNjcmliZSBcImFzIGEgc2VsZWN0aW9uXCIsIC0+XG4gICAgICBkZXNjcmliZSBcIndpdGhpbiBhIHdvcmRcIiwgLT5cbiAgICAgICAgaXQgXCJzZWxlY3RzIHRvIHRoZSBlbmQgb2YgdGhlIHdob2xlIHdvcmRcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuICAgICAgICAgIGtleWRvd24oJ3knKVxuICAgICAgICAgIGtleWRvd24oJ1cnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSAnY2RlMSstICdcblxuICAgICAgaXQgXCJjb250aW51ZXMgcGFzdCBibGFuayBsaW5lc1wiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzIsIDBdKVxuXG4gICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICBrZXlkb3duKCdXJywgc2hpZnQ6IHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiY2RlMSstIGFiIFxcbiB4eXpcXG56aXBcIlxuICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSAnXFxuJ1xuXG4gICAgICBpdCBcImRvZXNuJ3QgZ28gcGFzdCB0aGUgZW5kIG9mIHRoZSBmaWxlXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMywgMF0pXG5cbiAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgIGtleWRvd24oJ1cnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJjZGUxKy0gYWIgXFxuIHh5elxcblxcblwiXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICd6aXAnXG5cbiAgZGVzY3JpYmUgXCJ0aGUgZSBrZXliaW5kaW5nXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPiBlZGl0b3Iuc2V0VGV4dChcImFiIGNkZTErLSBcXG4geHl6XFxuXFxuemlwXCIpXG5cbiAgICBkZXNjcmliZSBcImFzIGEgbW90aW9uXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+IGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG5cbiAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byB0aGUgZW5kIG9mIHRoZSBjdXJyZW50IHdvcmRcIiwgLT5cbiAgICAgICAga2V5ZG93bignZScpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMV1cblxuICAgICAgICBrZXlkb3duKCdlJylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA2XVxuXG4gICAgICAgIGtleWRvd24oJ2UnKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDhdXG5cbiAgICAgICAga2V5ZG93bignZScpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgM11cblxuICAgICAgICBrZXlkb3duKCdlJylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFszLCAyXVxuXG4gICAgZGVzY3JpYmUgXCJhcyBzZWxlY3Rpb25cIiwgLT5cbiAgICAgIGRlc2NyaWJlIFwid2l0aGluIGEgd29yZFwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAwXSlcbiAgICAgICAgICBrZXlkb3duKCd5JylcbiAgICAgICAgICBrZXlkb3duKCdlJylcblxuICAgICAgICBpdCBcInNlbGVjdHMgdG8gdGhlIGVuZCBvZiB0aGUgY3VycmVudCB3b3JkXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgJ2FiJ1xuXG4gICAgICBkZXNjcmliZSBcImJldHdlZW4gd29yZHNcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMl0pXG4gICAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgICAga2V5ZG93bignZScpXG5cbiAgICAgICAgaXQgXCJzZWxlY3RzIHRvIHRoZSBlbmQgb2YgdGhlIG5leHQgd29yZFwiLCAtPlxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICcgY2RlMSdcblxuICBkZXNjcmliZSBcInRoZSBFIGtleWJpbmRpbmdcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+IGVkaXRvci5zZXRUZXh0KFwiYWIgIGNkZTErLSBcXG4geHl6IFxcblxcbnppcFxcblwiKVxuXG4gICAgZGVzY3JpYmUgXCJhcyBhIG1vdGlvblwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBpdCBcIm1vdmVzIHRoZSBjdXJzb3IgdG8gdGhlIGVuZCBvZiB0aGUgY3VycmVudCB3b3JkXCIsIC0+XG4gICAgICAgIGtleWRvd24oJ0UnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAxXVxuXG4gICAgICAgIGtleWRvd24oJ0UnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA5XVxuXG4gICAgICAgIGtleWRvd24oJ0UnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAzXVxuXG4gICAgICAgIGtleWRvd24oJ0UnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFszLCAyXVxuXG4gICAgICAgIGtleWRvd24oJ0UnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFs0LCAwXVxuXG4gICAgZGVzY3JpYmUgXCJhcyBzZWxlY3Rpb25cIiwgLT5cbiAgICAgIGRlc2NyaWJlIFwid2l0aGluIGEgd29yZFwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAwXSlcbiAgICAgICAgICBrZXlkb3duKCd5JylcbiAgICAgICAgICBrZXlkb3duKCdFJywgc2hpZnQ6IHRydWUpXG5cbiAgICAgICAgaXQgXCJzZWxlY3RzIHRvIHRoZSBlbmQgb2YgdGhlIGN1cnJlbnQgd29yZFwiLCAtPlxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICdhYidcblxuICAgICAgZGVzY3JpYmUgXCJiZXR3ZWVuIHdvcmRzXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDJdKVxuICAgICAgICAgIGtleWRvd24oJ3knKVxuICAgICAgICAgIGtleWRvd24oJ0UnLCBzaGlmdDogdHJ1ZSlcblxuICAgICAgICBpdCBcInNlbGVjdHMgdG8gdGhlIGVuZCBvZiB0aGUgbmV4dCB3b3JkXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgJyAgY2RlMSstJ1xuXG4gICAgICBkZXNjcmliZSBcInByZXNzIG1vcmUgdGhhbiBvbmNlXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuICAgICAgICAgIGtleWRvd24oJ3YnKVxuICAgICAgICAgIGtleWRvd24oJ0UnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgICBrZXlkb3duKCdFJywgc2hpZnQ6IHRydWUpXG4gICAgICAgICAga2V5ZG93bigneScpXG5cbiAgICAgICAgaXQgXCJzZWxlY3RzIHRvIHRoZSBlbmQgb2YgdGhlIGN1cnJlbnQgd29yZFwiLCAtPlxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICdhYiAgY2RlMSstJ1xuXG4gIGRlc2NyaWJlIFwidGhlICkga2V5YmluZGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiVGhpcyBpcyBhIHNlbnRlbmNlLiBUaGlzIGlzIGEgc2Vjb25kIHNlbnRlbmNlLlxcblRoaXMgaXMgYSB0aGlyZCBzZW50ZW5jZS5cXG5cXG5UaGlzIHNlbnRlbmNlIGlzIHBhc3QgdGhlIHBhcmFncmFwaCBib3VuZGFyeS5cIlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIFswLCAwXVxuXG4gICAgZGVzY3JpYmUgXCJhcyBhIG1vdGlvblwiLCAtPlxuICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIG5leHQgc2VudGVuY2VcIiwgLT5cbiAgICAgICAga2V5ZG93biAnKSdcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFswLCAyMF1cblxuICAgICAgICBrZXlkb3duICcpJ1xuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG5cbiAgICAgICAga2V5ZG93biAnKSdcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsyLCAwXVxuXG4gICAgZGVzY3JpYmUgXCJhcyBhIHNlbGVjdGlvblwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBrZXlkb3duKCd5JylcbiAgICAgICAga2V5ZG93bignKScpXG5cbiAgICAgIGl0ICdzZWxlY3RzIHRvIHRoZSBzdGFydCBvZiB0aGUgbmV4dCBzZW50ZW5jZScsIC0+XG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlIFwiVGhpcyBpcyBhIHNlbnRlbmNlLiBcIlxuXG4gIGRlc2NyaWJlIFwidGhlICgga2V5YmluZGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiVGhpcyBmaXJzdCBzZW50ZW5jZSBpcyBpbiBpdHMgb3duIHBhcmFncmFwaC5cXG5cXG5UaGlzIGlzIGEgc2VudGVuY2UuIFRoaXMgaXMgYSBzZWNvbmQgc2VudGVuY2UuXFxuVGhpcyBpcyBhIHRoaXJkIHNlbnRlbmNlXCJcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiBbMywgMF1cblxuICAgIGRlc2NyaWJlIFwiYXMgYSBtb3Rpb25cIiwgLT5cbiAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBwcmV2aW91cyBzZW50ZW5jZVwiLCAtPlxuICAgICAgICBrZXlkb3duICcoJ1xuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzIsIDIwXVxuXG4gICAgICAgIGtleWRvd24gJygnXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMiwgMF1cblxuICAgICAgICBrZXlkb3duICcoJ1xuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG5cbiAgICBkZXNjcmliZSBcImFzIGEgc2VsZWN0aW9uXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGtleWRvd24oJ3knKVxuICAgICAgICBrZXlkb3duKCcoJylcblxuICAgICAgaXQgJ3NlbGVjdHMgdG8gdGhlIGVuZCBvZiB0aGUgcHJldmlvdXMgc2VudGVuY2UnLCAtPlxuICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSBcIlRoaXMgaXMgYSBzZWNvbmQgc2VudGVuY2UuXFxuXCJcblxuICBkZXNjcmliZSBcInRoZSB9IGtleWJpbmRpbmdcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcImFiY2RlXFxuXFxuZmdoaWpcXG5oaWprXFxuICB4eXogIFxcblxcbnppcFxcblxcbiAgXFxudGhlIGVuZFwiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAwXSlcblxuICAgIGRlc2NyaWJlIFwiYXMgYSBtb3Rpb25cIiwgLT5cbiAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byB0aGUgZW5kIG9mIHRoZSBwYXJhZ3JhcGhcIiwgLT5cbiAgICAgICAga2V5ZG93bignfScpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMF1cblxuICAgICAgICBrZXlkb3duKCd9JylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFs1LCAwXVxuXG4gICAgICAgIGtleWRvd24oJ30nKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzcsIDBdXG5cbiAgICAgICAga2V5ZG93bignfScpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbOSwgNl1cblxuICAgIGRlc2NyaWJlIFwiYXMgYSBzZWxlY3Rpb25cIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgIGtleWRvd24oJ30nKVxuXG4gICAgICBpdCAnc2VsZWN0cyB0byB0aGUgZW5kIG9mIHRoZSBjdXJyZW50IHBhcmFncmFwaCcsIC0+XG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlIFwiYWJjZGVcXG5cIlxuXG4gIGRlc2NyaWJlIFwidGhlIHsga2V5YmluZGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiYWJjZGVcXG5cXG5mZ2hpalxcbmhpamtcXG4gIHh5eiAgXFxuXFxuemlwXFxuXFxuICBcXG50aGUgZW5kXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzksIDBdKVxuXG4gICAgZGVzY3JpYmUgXCJhcyBhIG1vdGlvblwiLCAtPlxuICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHBhcmFncmFwaFwiLCAtPlxuICAgICAgICBrZXlkb3duKCd7JylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFs3LCAwXVxuXG4gICAgICAgIGtleWRvd24oJ3snKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzUsIDBdXG5cbiAgICAgICAga2V5ZG93bigneycpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMF1cblxuICAgICAgICBrZXlkb3duKCd7JylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAwXVxuXG4gICAgZGVzY3JpYmUgXCJhcyBhIHNlbGVjdGlvblwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzcsIDBdKVxuICAgICAgICBrZXlkb3duKCd5JylcbiAgICAgICAga2V5ZG93bigneycpXG5cbiAgICAgIGl0ICdzZWxlY3RzIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGN1cnJlbnQgcGFyYWdyYXBoJywgLT5cbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgXCJcXG56aXBcXG5cIlxuXG4gIGRlc2NyaWJlIFwidGhlIGIga2V5YmluZGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT4gZWRpdG9yLnNldFRleHQoXCIgYWIgY2RlMSstIFxcbiB4eXpcXG5cXG56aXAgfVxcbiBsYXN0XCIpXG5cbiAgICBkZXNjcmliZSBcImFzIGEgbW90aW9uXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+IGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbNCwgMV0pXG5cbiAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBwcmV2aW91cyB3b3JkXCIsIC0+XG4gICAgICAgIGtleWRvd24oJ2InKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzMsIDRdXG5cbiAgICAgICAga2V5ZG93bignYicpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMywgMF1cblxuICAgICAgICBrZXlkb3duKCdiJylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsyLCAwXVxuXG4gICAgICAgIGtleWRvd24oJ2InKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDFdXG5cbiAgICAgICAga2V5ZG93bignYicpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgOF1cblxuICAgICAgICBrZXlkb3duKCdiJylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA0XVxuXG4gICAgICAgIGtleWRvd24oJ2InKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDFdXG5cbiAgICAgICAgIyBHbyB0byBzdGFydCBvZiB0aGUgZmlsZSwgYWZ0ZXIgbW92aW5nIHBhc3QgdGhlIGZpcnN0IHdvcmRcbiAgICAgICAga2V5ZG93bignYicpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMF1cblxuICAgICAgICAjIFN0YXkgYXQgdGhlIHN0YXJ0IG9mIHRoZSBmaWxlXG4gICAgICAgIGtleWRvd24oJ2InKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG5cbiAgICBkZXNjcmliZSBcImFzIGEgc2VsZWN0aW9uXCIsIC0+XG4gICAgICBkZXNjcmliZSBcIndpdGhpbiBhIHdvcmRcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMl0pXG4gICAgICAgICAga2V5ZG93bigneScpXG4gICAgICAgICAga2V5ZG93bignYicpXG5cbiAgICAgICAgaXQgXCJzZWxlY3RzIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGN1cnJlbnQgd29yZFwiLCAtPlxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICdhJ1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMV1cblxuICAgICAgZGVzY3JpYmUgXCJiZXR3ZWVuIHdvcmRzXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDRdKVxuICAgICAgICAgIGtleWRvd24oJ3knKVxuICAgICAgICAgIGtleWRvd24oJ2InKVxuXG4gICAgICAgIGl0IFwic2VsZWN0cyB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBsYXN0IHdvcmRcIiwgLT5cbiAgICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSAnYWIgJ1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMV1cblxuICBkZXNjcmliZSBcInRoZSBCIGtleWJpbmRpbmdcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+IGVkaXRvci5zZXRUZXh0KFwiY2RlMSstIGFiIFxcblxcdCB4eXotMTIzXFxuXFxuIHppcFwiKVxuXG4gICAgZGVzY3JpYmUgXCJhcyBhIG1vdGlvblwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzQsIDFdKVxuXG4gICAgICBpdCBcIm1vdmVzIHRoZSBjdXJzb3IgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgcHJldmlvdXMgd29yZFwiLCAtPlxuICAgICAgICBrZXlkb3duKCdCJywgc2hpZnQ6IHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMywgMV1cblxuICAgICAgICBrZXlkb3duKCdCJywgc2hpZnQ6IHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMiwgMF1cblxuICAgICAgICBrZXlkb3duKCdCJywgc2hpZnQ6IHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgM11cblxuICAgICAgICBrZXlkb3duKCdCJywgc2hpZnQ6IHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgN11cblxuICAgICAgICBrZXlkb3duKCdCJywgc2hpZnQ6IHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMF1cblxuICAgIGRlc2NyaWJlIFwiYXMgYSBzZWxlY3Rpb25cIiwgLT5cbiAgICAgIGl0IFwic2VsZWN0cyB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSB3aG9sZSB3b3JkXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMSwgOV0pXG4gICAgICAgIGtleWRvd24oJ3knKVxuICAgICAgICBrZXlkb3duKCdCJywgc2hpZnQ6IHRydWUpXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICd4eXotMTInXG5cbiAgICAgIGl0IFwiZG9lc24ndCBnbyBwYXN0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGZpbGVcIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAwXSlcbiAgICAgICAgdmltU3RhdGUuc2V0UmVnaXN0ZXIoJ1wiJywgdGV4dDogJ2FiYycpXG4gICAgICAgIGtleWRvd24oJ3knKVxuICAgICAgICBrZXlkb3duKCdCJywgc2hpZnQ6IHRydWUpXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlICdhYmMnXG5cbiAgZGVzY3JpYmUgXCJ0aGUgXiBrZXliaW5kaW5nXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCIgIGFiY2RlXCIpXG5cbiAgICBkZXNjcmliZSBcImZyb20gdGhlIGJlZ2lubmluZyBvZiB0aGUgbGluZVwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBkZXNjcmliZSBcImFzIGEgbW90aW9uXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT4ga2V5ZG93bignXicpXG5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIGxpbmVcIiwgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDJdXG5cbiAgICAgIGRlc2NyaWJlIFwiYXMgYSBzZWxlY3Rpb25cIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICAgIGtleWRvd24oJ14nKVxuXG4gICAgICAgIGl0ICdzZWxlY3RzIHRvIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIGxpbmUnLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdhYmNkZSdcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG5cbiAgICBkZXNjcmliZSBcImZyb20gdGhlIGZpcnN0IGNoYXJhY3RlciBvZiB0aGUgbGluZVwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDJdKVxuXG4gICAgICBkZXNjcmliZSBcImFzIGEgbW90aW9uXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT4ga2V5ZG93bignXicpXG5cbiAgICAgICAgaXQgXCJzdGF5cyBwdXRcIiwgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDJdXG5cbiAgICAgIGRlc2NyaWJlIFwiYXMgYSBzZWxlY3Rpb25cIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICAgIGtleWRvd24oJ14nKVxuXG4gICAgICAgIGl0IFwiZG9lcyBub3RoaW5nXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJyAgYWJjZGUnXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyXVxuXG4gICAgZGVzY3JpYmUgXCJmcm9tIHRoZSBtaWRkbGUgb2YgYSB3b3JkXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+IGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgNF0pXG5cbiAgICAgIGRlc2NyaWJlIFwiYXMgYSBtb3Rpb25cIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPiBrZXlkb3duKCdeJylcblxuICAgICAgICBpdCBcIm1vdmVzIHRoZSBjdXJzb3IgdG8gdGhlIGZpcnN0IGNoYXJhY3RlciBvZiB0aGUgbGluZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMl1cblxuICAgICAgZGVzY3JpYmUgXCJhcyBhIHNlbGVjdGlvblwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgICAga2V5ZG93bignXicpXG5cbiAgICAgICAgaXQgJ3NlbGVjdHMgdG8gdGhlIGZpcnN0IGNoYXJhY3RlciBvZiB0aGUgbGluZScsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJyAgY2RlJ1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMl1cblxuICBkZXNjcmliZSBcInRoZSAwIGtleWJpbmRpbmdcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIiAgYWJjZGVcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgNF0pXG5cbiAgICBkZXNjcmliZSBcImFzIGEgbW90aW9uXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+IGtleWRvd24oJzAnKVxuXG4gICAgICBpdCBcIm1vdmVzIHRoZSBjdXJzb3IgdG8gdGhlIGZpcnN0IGNvbHVtblwiLCAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG5cbiAgICBkZXNjcmliZSBcImFzIGEgc2VsZWN0aW9uXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICBrZXlkb3duKCcwJylcblxuICAgICAgaXQgJ3NlbGVjdHMgdG8gdGhlIGZpcnN0IGNvbHVtbiBvZiB0aGUgbGluZScsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdjZGUnXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMF1cblxuICBkZXNjcmliZSBcInRoZSAkIGtleWJpbmRpbmdcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIiAgYWJjZGVcXG5cXG4xMjM0NTY3ODkwXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDRdKVxuXG4gICAgZGVzY3JpYmUgXCJhcyBhIG1vdGlvbiBmcm9tIGVtcHR5IGxpbmVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT4gZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAwXSlcblxuICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBlbmQgb2YgdGhlIGxpbmVcIiwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuXG4gICAgZGVzY3JpYmUgXCJhcyBhIG1vdGlvblwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBrZXlkb3duKCckJylcblxuICAgICAgIyBGSVhNRTogU2VlIGF0b20vdmltLW1vZGUjMlxuICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBlbmQgb2YgdGhlIGxpbmVcIiwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA2XVxuXG4gICAgICBpdCBcInNob3VsZCByZW1haW4gaW4gdGhlIGxhc3QgY29sdW1uIHdoZW4gbW92aW5nIGRvd25cIiwgLT5cbiAgICAgICAga2V5ZG93bignaicpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMF1cblxuICAgICAgICBrZXlkb3duKCdqJylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsyLCA5XVxuXG4gICAgZGVzY3JpYmUgXCJhcyBhIHNlbGVjdGlvblwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBrZXlkb3duKCdkJylcbiAgICAgICAga2V5ZG93bignJCcpXG5cbiAgICAgIGl0IFwic2VsZWN0cyB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBsaW5lc1wiLCAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIiAgYWJcXG5cXG4xMjM0NTY3ODkwXCJcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAzXVxuXG4gIGRlc2NyaWJlIFwidGhlIDAga2V5YmluZGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiICBhXFxuXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDJdKVxuXG4gICAgZGVzY3JpYmUgXCJhcyBhIG1vdGlvblwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBrZXlkb3duKCcwJylcblxuICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGxpbmVcIiwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAwXVxuXG4gIGRlc2NyaWJlIFwidGhlIC0ga2V5YmluZGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiYWJjZGVmZ1xcbiAgYWJjXFxuICBhYmNcXG5cIilcblxuICAgIGRlc2NyaWJlIFwiZnJvbSB0aGUgbWlkZGxlIG9mIGEgbGluZVwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDNdKVxuXG4gICAgICBkZXNjcmliZSBcImFzIGEgbW90aW9uXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT4ga2V5ZG93bignLScpXG5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIHByZXZpb3VzIGxpbmVcIiwgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG5cbiAgICAgIGRlc2NyaWJlIFwiYXMgYSBzZWxlY3Rpb25cIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICAgIGtleWRvd24oJy0nKVxuXG4gICAgICAgIGl0IFwiZGVsZXRlcyB0aGUgY3VycmVudCBhbmQgcHJldmlvdXMgbGluZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiICBhYmNcXG5cIlxuICAgICAgICAgICMgY29tbWVudGVkIG91dCBiZWNhdXNlIHRoZSBjb2x1bW4gaXMgd3JvbmcgZHVlIHRvIGEgYnVnIGluIGBrYDsgcmUtZW5hYmxlIHdoZW4gYGtgIGlzIGZpeGVkXG4gICAgICAgICAgI2V4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgM11cblxuICAgIGRlc2NyaWJlIFwiZnJvbSB0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIGEgbGluZSBpbmRlbnRlZCB0aGUgc2FtZSBhcyB0aGUgcHJldmlvdXMgb25lXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+IGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMiwgMl0pXG5cbiAgICAgIGRlc2NyaWJlIFwiYXMgYSBtb3Rpb25cIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPiBrZXlkb3duKCctJylcblxuICAgICAgICBpdCBcIm1vdmVzIHRvIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIHByZXZpb3VzIGxpbmUgKGRpcmVjdGx5IGFib3ZlKVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMl1cblxuICAgICAgZGVzY3JpYmUgXCJhcyBhIHNlbGVjdGlvblwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgICAga2V5ZG93bignLScpXG5cbiAgICAgICAgaXQgXCJzZWxlY3RzIHRvIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIHByZXZpb3VzIGxpbmUgKGRpcmVjdGx5IGFib3ZlKVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiYWJjZGVmZ1xcblwiXG4gICAgICAgICAgIyBjb21tZW50ZWQgb3V0IGJlY2F1c2UgdGhlIGNvbHVtbiBpcyB3cm9uZyBkdWUgdG8gYSBidWcgaW4gYGtgOyByZS1lbmFibGUgd2hlbiBga2AgaXMgZml4ZWRcbiAgICAgICAgICAjZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyXVxuXG4gICAgZGVzY3JpYmUgXCJmcm9tIHRoZSBiZWdpbm5pbmcgb2YgYSBsaW5lIHByZWNlZGVkIGJ5IGFuIGluZGVudGVkIGxpbmVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT4gZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsyLCAwXSlcblxuICAgICAgZGVzY3JpYmUgXCJhcyBhIG1vdGlvblwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+IGtleWRvd24oJy0nKVxuXG4gICAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byB0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIHRoZSBwcmV2aW91cyBsaW5lXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAyXVxuXG4gICAgICBkZXNjcmliZSBcImFzIGEgc2VsZWN0aW9uXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBrZXlkb3duKCdkJylcbiAgICAgICAgICBrZXlkb3duKCctJylcblxuICAgICAgICBpdCBcInNlbGVjdHMgdG8gdGhlIGZpcnN0IGNoYXJhY3RlciBvZiB0aGUgcHJldmlvdXMgbGluZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiYWJjZGVmZ1xcblwiXG4gICAgICAgICAgIyBjb21tZW50ZWQgb3V0IGJlY2F1c2UgdGhlIGNvbHVtbiBpcyB3cm9uZyBkdWUgdG8gYSBidWcgaW4gYGtgOyByZS1lbmFibGUgd2hlbiBga2AgaXMgZml4ZWRcbiAgICAgICAgICAjZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAwXVxuXG4gICAgZGVzY3JpYmUgXCJ3aXRoIGEgY291bnRcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCIxXFxuMlxcbjNcXG40XFxuNVxcbjZcXG5cIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFs0LCAwXSlcblxuICAgICAgZGVzY3JpYmUgXCJhcyBhIG1vdGlvblwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAga2V5ZG93bignMycpXG4gICAgICAgICAga2V5ZG93bignLScpXG5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhhdCBtYW55IGxpbmVzIHByZXZpb3VzXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuXG4gICAgICBkZXNjcmliZSBcImFzIGEgc2VsZWN0aW9uXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBrZXlkb3duKCdkJylcbiAgICAgICAgICBrZXlkb3duKCczJylcbiAgICAgICAgICBrZXlkb3duKCctJylcblxuICAgICAgICBpdCBcImRlbGV0ZXMgdGhlIGN1cnJlbnQgbGluZSBwbHVzIHRoYXQgbWFueSBwcmV2aW91cyBsaW5lc1wiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiMVxcbjZcXG5cIlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMF1cblxuICBkZXNjcmliZSBcInRoZSArIGtleWJpbmRpbmdcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIiAgYWJjXFxuICBhYmNcXG5hYmNkZWZnXFxuXCIpXG5cbiAgICBkZXNjcmliZSBcImZyb20gdGhlIG1pZGRsZSBvZiBhIGxpbmVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT4gZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAzXSlcblxuICAgICAgZGVzY3JpYmUgXCJhcyBhIG1vdGlvblwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+IGtleWRvd24oJysnKVxuXG4gICAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byB0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIHRoZSBuZXh0IGxpbmVcIiwgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzIsIDBdXG5cbiAgICAgIGRlc2NyaWJlIFwiYXMgYSBzZWxlY3Rpb25cIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICAgIGtleWRvd24oJysnKVxuXG4gICAgICAgIGl0IFwiZGVsZXRlcyB0aGUgY3VycmVudCBhbmQgbmV4dCBsaW5lXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIgIGFiY1xcblwiXG4gICAgICAgICAgIyBjb21tZW50ZWQgb3V0IGJlY2F1c2UgdGhlIGNvbHVtbiBpcyB3cm9uZyBkdWUgdG8gYSBidWcgaW4gYGpgOyByZS1lbmFibGUgd2hlbiBgamAgaXMgZml4ZWRcbiAgICAgICAgICAjZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAzXVxuXG4gICAgZGVzY3JpYmUgXCJmcm9tIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgYSBsaW5lIGluZGVudGVkIHRoZSBzYW1lIGFzIHRoZSBuZXh0IG9uZVwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDJdKVxuXG4gICAgICBkZXNjcmliZSBcImFzIGEgbW90aW9uXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT4ga2V5ZG93bignKycpXG5cbiAgICAgICAgaXQgXCJtb3ZlcyB0byB0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIHRoZSBuZXh0IGxpbmUgKGRpcmVjdGx5IGJlbG93KVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMl1cblxuICAgICAgZGVzY3JpYmUgXCJhcyBhIHNlbGVjdGlvblwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgICAga2V5ZG93bignKycpXG5cbiAgICAgICAgaXQgXCJzZWxlY3RzIHRvIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIG5leHQgbGluZSAoZGlyZWN0bHkgYmVsb3cpXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJhYmNkZWZnXFxuXCJcbiAgICAgICAgICAjIGNvbW1lbnRlZCBvdXQgYmVjYXVzZSB0aGUgY29sdW1uIGlzIHdyb25nIGR1ZSB0byBhIGJ1ZyBpbiBgamA7IHJlLWVuYWJsZSB3aGVuIGBqYCBpcyBmaXhlZFxuICAgICAgICAgICNleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDJdXG5cbiAgICBkZXNjcmliZSBcImZyb20gdGhlIGJlZ2lubmluZyBvZiBhIGxpbmUgZm9sbG93ZWQgYnkgYW4gaW5kZW50ZWQgbGluZVwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBkZXNjcmliZSBcImFzIGEgbW90aW9uXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT4ga2V5ZG93bignKycpXG5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIG5leHQgbGluZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMl1cblxuICAgICAgZGVzY3JpYmUgXCJhcyBhIHNlbGVjdGlvblwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgICAga2V5ZG93bignKycpXG5cbiAgICAgICAgaXQgXCJzZWxlY3RzIHRvIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIG5leHQgbGluZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiYWJjZGVmZ1xcblwiXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAwXVxuXG4gICAgZGVzY3JpYmUgXCJ3aXRoIGEgY291bnRcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCIxXFxuMlxcbjNcXG40XFxuNVxcbjZcXG5cIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAwXSlcblxuICAgICAgZGVzY3JpYmUgXCJhcyBhIG1vdGlvblwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAga2V5ZG93bignMycpXG4gICAgICAgICAga2V5ZG93bignKycpXG5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhhdCBtYW55IGxpbmVzIGZvbGxvd2luZ1wiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbNCwgMF1cblxuICAgICAgZGVzY3JpYmUgXCJhcyBhIHNlbGVjdGlvblwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgICAga2V5ZG93bignMycpXG4gICAgICAgICAga2V5ZG93bignKycpXG5cbiAgICAgICAgaXQgXCJkZWxldGVzIHRoZSBjdXJyZW50IGxpbmUgcGx1cyB0aGF0IG1hbnkgZm9sbG93aW5nIGxpbmVzXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxXFxuNlxcblwiXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuXG4gIGRlc2NyaWJlIFwidGhlIF8ga2V5YmluZGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiICBhYmNcXG4gIGFiY1xcbmFiY2RlZmdcXG5cIilcblxuICAgIGRlc2NyaWJlIFwiZnJvbSB0aGUgbWlkZGxlIG9mIGEgbGluZVwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDNdKVxuXG4gICAgICBkZXNjcmliZSBcImFzIGEgbW90aW9uXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT4ga2V5ZG93bignXycpXG5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIGN1cnJlbnQgbGluZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMl1cblxuICAgICAgZGVzY3JpYmUgXCJhcyBhIHNlbGVjdGlvblwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgICAga2V5ZG93bignXycpXG5cbiAgICAgICAgaXQgXCJkZWxldGVzIHRoZSBjdXJyZW50IGxpbmVcIiwgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIiAgYWJjXFxuYWJjZGVmZ1xcblwiXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuXG4gICAgZGVzY3JpYmUgXCJ3aXRoIGEgY291bnRcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCIxXFxuMlxcbjNcXG40XFxuNVxcbjZcXG5cIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAwXSlcblxuICAgICAgZGVzY3JpYmUgXCJhcyBhIG1vdGlvblwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAga2V5ZG93bignMycpXG4gICAgICAgICAga2V5ZG93bignXycpXG5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhhdCBtYW55IGxpbmVzIGZvbGxvd2luZ1wiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMywgMF1cblxuICAgICAgZGVzY3JpYmUgXCJhcyBhIHNlbGVjdGlvblwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgICAga2V5ZG93bignMycpXG4gICAgICAgICAga2V5ZG93bignXycpXG5cbiAgICAgICAgaXQgXCJkZWxldGVzIHRoZSBjdXJyZW50IGxpbmUgcGx1cyB0aGF0IG1hbnkgZm9sbG93aW5nIGxpbmVzXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxXFxuNVxcbjZcXG5cIlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMF1cblxuICBkZXNjcmliZSBcInRoZSBlbnRlciBrZXliaW5kaW5nXCIsIC0+XG4gICAga2V5ZG93bkNvZGVGb3JFbnRlciA9ICdcXHInICMgJ2VudGVyJyBkb2VzIG5vdCB3b3JrXG4gICAgc3RhcnRpbmdUZXh0ID0gXCIgIGFiY1xcbiAgYWJjXFxuYWJjZGVmZ1xcblwiXG5cbiAgICBkZXNjcmliZSBcImZyb20gdGhlIG1pZGRsZSBvZiBhIGxpbmVcIiwgLT5cbiAgICAgIHN0YXJ0aW5nQ3Vyc29yUG9zaXRpb24gPSBbMSwgM11cblxuICAgICAgZGVzY3JpYmUgXCJhcyBhIG1vdGlvblwiLCAtPlxuICAgICAgICBpdCBcImFjdHMgdGhlIHNhbWUgYXMgdGhlICsga2V5YmluZGluZ1wiLCAtPlxuICAgICAgICAgICMgZG8gaXQgd2l0aCArIGFuZCBzYXZlIHRoZSByZXN1bHRzXG4gICAgICAgICAgZWRpdG9yLnNldFRleHQoc3RhcnRpbmdUZXh0KVxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihzdGFydGluZ0N1cnNvclBvc2l0aW9uKVxuICAgICAgICAgIGtleWRvd24oJysnKVxuICAgICAgICAgIHJlZmVyZW5jZUN1cnNvclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKClcbiAgICAgICAgICAjIGRvIGl0IGFnYWluIHdpdGggZW50ZXIgYW5kIGNvbXBhcmUgdGhlIHJlc3VsdHNcbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChzdGFydGluZ1RleHQpXG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKHN0YXJ0aW5nQ3Vyc29yUG9zaXRpb24pXG4gICAgICAgICAga2V5ZG93bihrZXlkb3duQ29kZUZvckVudGVyKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCByZWZlcmVuY2VDdXJzb3JQb3NpdGlvblxuXG4gICAgICBkZXNjcmliZSBcImFzIGEgc2VsZWN0aW9uXCIsIC0+XG4gICAgICAgIGl0IFwiYWN0cyB0aGUgc2FtZSBhcyB0aGUgKyBrZXliaW5kaW5nXCIsIC0+XG4gICAgICAgICAgIyBkbyBpdCB3aXRoICsgYW5kIHNhdmUgdGhlIHJlc3VsdHNcbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChzdGFydGluZ1RleHQpXG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKHN0YXJ0aW5nQ3Vyc29yUG9zaXRpb24pXG4gICAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgICAga2V5ZG93bignKycpXG4gICAgICAgICAgcmVmZXJlbmNlVGV4dCA9IGVkaXRvci5nZXRUZXh0KClcbiAgICAgICAgICByZWZlcmVuY2VDdXJzb3JQb3NpdGlvbiA9IGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpXG4gICAgICAgICAgIyBkbyBpdCBhZ2FpbiB3aXRoIGVudGVyIGFuZCBjb21wYXJlIHRoZSByZXN1bHRzXG4gICAgICAgICAgZWRpdG9yLnNldFRleHQoc3RhcnRpbmdUZXh0KVxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihzdGFydGluZ0N1cnNvclBvc2l0aW9uKVxuICAgICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICAgIGtleWRvd24oa2V5ZG93bkNvZGVGb3JFbnRlcilcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9FcXVhbCByZWZlcmVuY2VUZXh0XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIHJlZmVyZW5jZUN1cnNvclBvc2l0aW9uXG5cbiAgZGVzY3JpYmUgXCJ0aGUgZ2cga2V5YmluZGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiIDFhYmNcXG4gMlxcbjNcXG5cIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMl0pXG5cbiAgICBkZXNjcmliZSBcImFzIGEgbW90aW9uXCIsIC0+XG4gICAgICBkZXNjcmliZSBcImluIG5vcm1hbCBtb2RlXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBrZXlkb3duKCdnJylcbiAgICAgICAgICBrZXlkb3duKCdnJylcblxuICAgICAgICBpdCBcIm1vdmVzIHRoZSBjdXJzb3IgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgZmlyc3QgbGluZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMF1cblxuICAgICAgZGVzY3JpYmUgXCJpbiBsaW5ld2lzZSB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAwXSlcbiAgICAgICAgICB2aW1TdGF0ZS5hY3RpdmF0ZVZpc3VhbE1vZGUoJ2xpbmV3aXNlJylcbiAgICAgICAgICBrZXlkb3duKCdnJylcbiAgICAgICAgICBrZXlkb3duKCdnJylcblxuICAgICAgICBpdCBcInNlbGVjdHMgdG8gdGhlIGZpcnN0IGxpbmUgaW4gdGhlIGZpbGVcIiwgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKS50b0JlIFwiIDFhYmNcXG4gMlxcblwiXG5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIGEgc3BlY2lmaWVkIGxpbmVcIiwgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG5cbiAgICAgIGRlc2NyaWJlIFwiaW4gY2hhcmFjdGVyd2lzZSB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAxXSlcbiAgICAgICAgICB2aW1TdGF0ZS5hY3RpdmF0ZVZpc3VhbE1vZGUoKVxuICAgICAgICAgIGtleWRvd24oJ2cnKVxuICAgICAgICAgIGtleWRvd24oJ2cnKVxuXG4gICAgICAgIGl0IFwic2VsZWN0cyB0byB0aGUgZmlyc3QgbGluZSBpbiB0aGUgZmlsZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpLnRvQmUgXCIxYWJjXFxuIDJcIlxuXG4gICAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byBhIHNwZWNpZmllZCBsaW5lXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAxXVxuXG4gICAgZGVzY3JpYmUgXCJhcyBhIHJlcGVhdGVkIG1vdGlvblwiLCAtPlxuICAgICAgZGVzY3JpYmUgXCJpbiBub3JtYWwgbW9kZVwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAga2V5ZG93bignMicpXG4gICAgICAgICAga2V5ZG93bignZycpXG4gICAgICAgICAga2V5ZG93bignZycpXG5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIGEgc3BlY2lmaWVkIGxpbmVcIiwgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG5cbiAgICAgIGRlc2NyaWJlIFwiaW4gbGluZXdpc2UgdmlzdWFsIG1vdGlvblwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsyLCAwXSlcbiAgICAgICAgICB2aW1TdGF0ZS5hY3RpdmF0ZVZpc3VhbE1vZGUoJ2xpbmV3aXNlJylcbiAgICAgICAgICBrZXlkb3duKCcyJylcbiAgICAgICAgICBrZXlkb3duKCdnJylcbiAgICAgICAgICBrZXlkb3duKCdnJylcblxuICAgICAgICBpdCBcInNlbGVjdHMgdG8gYSBzcGVjaWZpZWQgbGluZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpLnRvQmUgXCIgMlxcbjNcXG5cIlxuXG4gICAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byBhIHNwZWNpZmllZCBsaW5lXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuXG4gICAgICBkZXNjcmliZSBcImluIGNoYXJhY3Rlcndpc2UgdmlzdWFsIG1vdGlvblwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsyLCAwXSlcbiAgICAgICAgICB2aW1TdGF0ZS5hY3RpdmF0ZVZpc3VhbE1vZGUoKVxuICAgICAgICAgIGtleWRvd24oJzInKVxuICAgICAgICAgIGtleWRvd24oJ2cnKVxuICAgICAgICAgIGtleWRvd24oJ2cnKVxuXG4gICAgICAgIGl0IFwic2VsZWN0cyB0byBhIGZpcnN0IGNoYXJhY3RlciBvZiBzcGVjaWZpZWQgbGluZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpLnRvQmUgXCIyXFxuM1wiXG5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIGEgc3BlY2lmaWVkIGxpbmVcIiwgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDFdXG5cbiAgZGVzY3JpYmUgXCJ0aGUgZ18ga2V5YmluZGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiMSAgXFxuICAgIDIgIFxcbiAzYWJjXFxuIFwiKVxuXG4gICAgZGVzY3JpYmUgXCJhcyBhIG1vdGlvblwiLCAtPlxuICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBsYXN0IG5vbmJsYW5rIGNoYXJhY3RlclwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDBdKVxuICAgICAgICBrZXlkb3duKCdnJylcbiAgICAgICAga2V5ZG93bignXycpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgNF1cblxuICAgICAgaXQgXCJ3aWxsIG1vdmUgdGhlIGN1cnNvciB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBsaW5lIGlmIG5lY2Vzc2FyeVwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDJdKVxuICAgICAgICBrZXlkb3duKCdnJylcbiAgICAgICAga2V5ZG93bignXycpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMF1cblxuICAgIGRlc2NyaWJlIFwiYXMgYSByZXBlYXRlZCBtb3Rpb25cIiwgLT5cbiAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciBkb3dud2FyZCBhbmQgb3V0d2FyZFwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuICAgICAgICBrZXlkb3duKCcyJylcbiAgICAgICAga2V5ZG93bignZycpXG4gICAgICAgIGtleWRvd24oJ18nKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDRdXG5cbiAgICBkZXNjcmliZSBcImFzIGEgc2VsZWN0aW9uXCIsIC0+XG4gICAgICBpdCBcInNlbGVjdHMgdGhlIGN1cnJlbnQgbGluZSBleGNsdWRpbmcgd2hpdGVzcGFjZVwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDJdKVxuICAgICAgICB2aW1TdGF0ZS5hY3RpdmF0ZVZpc3VhbE1vZGUoKVxuICAgICAgICBrZXlkb3duKCcyJylcbiAgICAgICAga2V5ZG93bignZycpXG4gICAgICAgIGtleWRvd24oJ18nKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKS50b0VxdWFsIFwiICAyICBcXG4gM2FiY1wiXG5cbiAgZGVzY3JpYmUgXCJ0aGUgRyBrZXliaW5kaW5nXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCIxXFxuICAgIDJcXG4gM2FiY1xcbiBcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMl0pXG5cbiAgICBkZXNjcmliZSBcImFzIGEgbW90aW9uXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+IGtleWRvd24oJ0cnLCBzaGlmdDogdHJ1ZSlcblxuICAgICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBsYXN0IGxpbmUgYWZ0ZXIgd2hpdGVzcGFjZVwiLCAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzMsIDBdXG5cbiAgICBkZXNjcmliZSBcImFzIGEgcmVwZWF0ZWQgbW90aW9uXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGtleWRvd24oJzInKVxuICAgICAgICBrZXlkb3duKCdHJywgc2hpZnQ6IHRydWUpXG5cbiAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byBhIHNwZWNpZmllZCBsaW5lXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgNF1cblxuICAgIGRlc2NyaWJlIFwiYXMgYSBzZWxlY3Rpb25cIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAwXSlcbiAgICAgICAgdmltU3RhdGUuYWN0aXZhdGVWaXN1YWxNb2RlKClcbiAgICAgICAga2V5ZG93bignRycsIHNoaWZ0OiB0cnVlKVxuXG4gICAgICBpdCBcInNlbGVjdHMgdG8gdGhlIGxhc3QgbGluZSBpbiB0aGUgZmlsZVwiLCAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKS50b0JlIFwiICAgIDJcXG4gM2FiY1xcbiBcIlxuXG4gICAgICBpdCBcIm1vdmVzIHRoZSBjdXJzb3IgdG8gdGhlIGxhc3QgbGluZSBhZnRlciB3aGl0ZXNwYWNlXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMywgMV1cblxuICBkZXNjcmliZSBcInRoZSAvIGtleWJpbmRpbmdcIiwgLT5cbiAgICBwYW5lID0gbnVsbFxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgcGFuZSA9IHthY3RpdmF0ZTogamFzbWluZS5jcmVhdGVTcHkoXCJhY3RpdmF0ZVwiKX1cbiAgICAgIHNweU9uKGF0b20ud29ya3NwYWNlLCAnZ2V0QWN0aXZlUGFuZScpLmFuZFJldHVybihwYW5lKVxuXG4gICAgICBlZGl0b3Iuc2V0VGV4dChcImFiY1xcbmRlZlxcbmFiY1xcbmRlZlxcblwiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcblxuICAgICAgIyBjbGVhciBzZWFyY2ggaGlzdG9yeVxuICAgICAgdmltU3RhdGUuZ2xvYmFsVmltU3RhdGUuc2VhcmNoSGlzdG9yeSA9IFtdXG4gICAgICB2aW1TdGF0ZS5nbG9iYWxWaW1TdGF0ZS5jdXJyZW50U2VhcmNoID0ge31cblxuICAgIGRlc2NyaWJlIFwiYXMgYSBtb3Rpb25cIiwgLT5cbiAgICAgIGl0IFwiYmVlcHMgd2hlbiByZXBlYXRpbmcgbm9uZXhpc3RlbnQgbGFzdCBzZWFyY2hcIiwgLT5cbiAgICAgICAga2V5ZG93biAnLydcbiAgICAgICAgc3VibWl0Tm9ybWFsTW9kZUlucHV0VGV4dCAnJ1xuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG4gICAgICAgIGV4cGVjdChhdG9tLmJlZXApLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBpdCBcIm1vdmVzIHRoZSBjdXJzb3IgdG8gdGhlIHNwZWNpZmllZCBzZWFyY2ggcGF0dGVyblwiLCAtPlxuICAgICAgICBrZXlkb3duKCcvJylcblxuICAgICAgICBzdWJtaXROb3JtYWxNb2RlSW5wdXRUZXh0ICdkZWYnXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuICAgICAgICBleHBlY3QocGFuZS5hY3RpdmF0ZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChhdG9tLmJlZXApLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgaXQgXCJsb29wcyBiYWNrIGFyb3VuZFwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzMsIDBdKVxuICAgICAgICBrZXlkb3duKCcvJylcbiAgICAgICAgc3VibWl0Tm9ybWFsTW9kZUlucHV0VGV4dCAnZGVmJ1xuXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMF1cbiAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBpdCBcInVzZXMgYSB2YWxpZCByZWdleCBhcyBhIHJlZ2V4XCIsIC0+XG4gICAgICAgIGtleWRvd24oJy8nKVxuICAgICAgICAjIEN5Y2xlIHRocm91Z2ggdGhlICdhYmMnIG9uIHRoZSBmaXJzdCBsaW5lIHdpdGggYSBjaGFyYWN0ZXIgcGF0dGVyblxuICAgICAgICBzdWJtaXROb3JtYWxNb2RlSW5wdXRUZXh0ICdbYWJjXSdcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFswLCAxXVxuICAgICAgICBrZXlkb3duKCduJylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFswLCAyXVxuICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGl0IFwidXNlcyBhbiBpbnZhbGlkIHJlZ2V4IGFzIGEgbGl0ZXJhbCBzdHJpbmdcIiwgLT5cbiAgICAgICAgIyBHbyBzdHJhaWdodCB0byB0aGUgbGl0ZXJhbCBbYWJjXG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwiYWJjXFxuW2FiY11cXG5cIilcbiAgICAgICAga2V5ZG93bignLycpXG4gICAgICAgIHN1Ym1pdE5vcm1hbE1vZGVJbnB1dFRleHQgJ1thYmMnXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMF1cbiAgICAgICAga2V5ZG93bignbicpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMF1cbiAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBpdCBcInVzZXMgPyBhcyBhIGxpdGVyYWwgc3RyaW5nXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwiYWJjXFxuW2E/Yz9cXG5cIilcbiAgICAgICAga2V5ZG93bignLycpXG4gICAgICAgIHN1Ym1pdE5vcm1hbE1vZGVJbnB1dFRleHQgJz8nXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMl1cbiAgICAgICAga2V5ZG93bignbicpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgNF1cbiAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBpdCAnd29ya3Mgd2l0aCBzZWxlY3Rpb24gaW4gdmlzdWFsIG1vZGUnLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0VGV4dCgnb25lIHR3byB0aHJlZScpXG4gICAgICAgIGtleWRvd24oJ3YnKVxuICAgICAgICBrZXlkb3duKCcvJylcbiAgICAgICAgc3VibWl0Tm9ybWFsTW9kZUlucHV0VGV4dCAndGgnXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgOV1cbiAgICAgICAga2V5ZG93bignZCcpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdocmVlJ1xuICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGl0ICdleHRlbmRzIHNlbGVjdGlvbiB3aGVuIHJlcGVhdGluZyBzZWFyY2ggaW4gdmlzdWFsIG1vZGUnLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0VGV4dCgnbGluZTFcXG5saW5lMlxcbmxpbmUzJylcbiAgICAgICAga2V5ZG93bigndicpXG4gICAgICAgIGtleWRvd24oJy8nKVxuICAgICAgICBzdWJtaXROb3JtYWxNb2RlSW5wdXRUZXh0ICdsaW5lJ1xuICAgICAgICB7c3RhcnQsIGVuZH0gPSBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpXG4gICAgICAgIGV4cGVjdChzdGFydC5yb3cpLnRvRXF1YWwgMFxuICAgICAgICBleHBlY3QoZW5kLnJvdykudG9FcXVhbCAxXG4gICAgICAgIGtleWRvd24oJ24nKVxuICAgICAgICB7c3RhcnQsIGVuZH0gPSBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpXG4gICAgICAgIGV4cGVjdChzdGFydC5yb3cpLnRvRXF1YWwgMFxuICAgICAgICBleHBlY3QoZW5kLnJvdykudG9FcXVhbCAyXG4gICAgICAgIGV4cGVjdChhdG9tLmJlZXApLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgZGVzY3JpYmUgXCJjYXNlIHNlbnNpdGl2aXR5XCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChcIlxcbmFiY1xcbkFCQ1xcblwiKVxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICAgICAga2V5ZG93bignLycpXG5cbiAgICAgICAgaXQgXCJ3b3JrcyBpbiBjYXNlIHNlbnNpdGl2ZSBtb2RlXCIsIC0+XG4gICAgICAgICAgc3VibWl0Tm9ybWFsTW9kZUlucHV0VGV4dCAnQUJDJ1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMiwgMF1cbiAgICAgICAgICBrZXlkb3duKCduJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzIsIDBdXG4gICAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAgIGl0IFwid29ya3MgaW4gY2FzZSBpbnNlbnNpdGl2ZSBtb2RlXCIsIC0+XG4gICAgICAgICAgc3VibWl0Tm9ybWFsTW9kZUlucHV0VGV4dCAnXFxcXGNBYkMnXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuICAgICAgICAgIGtleWRvd24oJ24nKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMiwgMF1cbiAgICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgICAgaXQgXCJ3b3JrcyBpbiBjYXNlIGluc2Vuc2l0aXZlIG1vZGUgd2hlcmV2ZXIgXFxcXGMgaXNcIiwgLT5cbiAgICAgICAgICBzdWJtaXROb3JtYWxNb2RlSW5wdXRUZXh0ICdBYkNcXFxcYydcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG4gICAgICAgICAga2V5ZG93bignbicpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsyLCAwXVxuICAgICAgICAgIGV4cGVjdChhdG9tLmJlZXApLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgICBpdCBcInVzZXMgY2FzZSBpbnNlbnNpdGl2ZSBzZWFyY2ggaWYgdXNlU21hcnRjYXNlRm9yU2VhcmNoIGlzIHRydWUgYW5kIHNlYXJjaGluZyBsb3dlcmNhc2VcIiwgLT5cbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ3ZpbS1tb2RlLnVzZVNtYXJ0Y2FzZUZvclNlYXJjaCcsIHRydWVcbiAgICAgICAgICBzdWJtaXROb3JtYWxNb2RlSW5wdXRUZXh0ICdhYmMnXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuICAgICAgICAgIGtleWRvd24oJ24nKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMiwgMF1cbiAgICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgICAgaXQgXCJ1c2VzIGNhc2Ugc2Vuc2l0aXZlIHNlYXJjaCBpZiB1c2VTbWFydGNhc2VGb3JTZWFyY2ggaXMgdHJ1ZSBhbmQgc2VhcmNoaW5nIHVwcGVyY2FzZVwiLCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCAndmltLW1vZGUudXNlU21hcnRjYXNlRm9yU2VhcmNoJywgdHJ1ZVxuICAgICAgICAgIHN1Ym1pdE5vcm1hbE1vZGVJbnB1dFRleHQgJ0FCQydcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzIsIDBdXG4gICAgICAgICAga2V5ZG93bignbicpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsyLCAwXVxuICAgICAgICAgIGV4cGVjdChhdG9tLmJlZXApLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgZGVzY3JpYmUgXCJyZXBlYXRpbmdcIiwgLT5cbiAgICAgICAgaXQgXCJkb2VzIG5vdGhpbmcgd2l0aCBubyBzZWFyY2ggaGlzdG9yeVwiLCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICAgICAga2V5ZG93bignbicpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFswLCAwXVxuICAgICAgICAgIGV4cGVjdChhdG9tLmJlZXApLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxLCAxXSlcbiAgICAgICAgICBrZXlkb3duKCduJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDFdXG4gICAgICAgICAgZXhwZWN0KGF0b20uYmVlcC5jYWxsQ291bnQpLnRvQmUgMlxuXG4gICAgICBkZXNjcmliZSBcInJlcGVhdGluZyB3aXRoIHNlYXJjaCBoaXN0b3J5XCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBrZXlkb3duKCcvJylcbiAgICAgICAgICBzdWJtaXROb3JtYWxNb2RlSW5wdXRUZXh0ICdkZWYnXG5cbiAgICAgICAgaXQgXCJyZXBlYXRzIHByZXZpb3VzIHNlYXJjaCB3aXRoIC88ZW50ZXI+XCIsIC0+XG4gICAgICAgICAga2V5ZG93bignLycpXG4gICAgICAgICAgc3VibWl0Tm9ybWFsTW9kZUlucHV0VGV4dCgnJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzMsIDBdXG4gICAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAgIGl0IFwicmVwZWF0cyBwcmV2aW91cyBzZWFyY2ggd2l0aCAvL1wiLCAtPlxuICAgICAgICAgIGtleWRvd24oJy8nKVxuICAgICAgICAgIHN1Ym1pdE5vcm1hbE1vZGVJbnB1dFRleHQoJy8nKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMywgMF1cbiAgICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgICAgZGVzY3JpYmUgXCJ0aGUgbiBrZXliaW5kaW5nXCIsIC0+XG4gICAgICAgICAgaXQgXCJyZXBlYXRzIHRoZSBsYXN0IHNlYXJjaFwiLCAtPlxuICAgICAgICAgICAga2V5ZG93bignbicpXG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzMsIDBdXG4gICAgICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgICAgZGVzY3JpYmUgXCJ0aGUgTiBrZXliaW5kaW5nXCIsIC0+XG4gICAgICAgICAgaXQgXCJyZXBlYXRzIHRoZSBsYXN0IHNlYXJjaCBiYWNrd2FyZHNcIiwgLT5cbiAgICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICAgICAgICBrZXlkb3duKCdOJywgc2hpZnQ6IHRydWUpXG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzMsIDBdXG4gICAgICAgICAgICBrZXlkb3duKCdOJywgc2hpZnQ6IHRydWUpXG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG4gICAgICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGRlc2NyaWJlIFwiY29tcG9zaW5nXCIsIC0+XG4gICAgICAgIGl0IFwiY29tcG9zZXMgd2l0aCBvcGVyYXRvcnNcIiwgLT5cbiAgICAgICAgICBrZXlkb3duKCdkJylcbiAgICAgICAgICBrZXlkb3duKCcvJylcbiAgICAgICAgICBzdWJtaXROb3JtYWxNb2RlSW5wdXRUZXh0KCdkZWYnKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsIFwiZGVmXFxuYWJjXFxuZGVmXFxuXCJcbiAgICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgICAgaXQgXCJyZXBlYXRzIGNvcnJlY3RseSB3aXRoIG9wZXJhdG9yc1wiLCAtPlxuICAgICAgICAgIGtleWRvd24oJ2QnKVxuICAgICAgICAgIGtleWRvd24oJy8nKVxuICAgICAgICAgIHN1Ym1pdE5vcm1hbE1vZGVJbnB1dFRleHQoJ2RlZicpXG5cbiAgICAgICAgICBrZXlkb3duKCcuJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9FcXVhbCBcImRlZlxcblwiXG4gICAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHJldmVyc2VkIGFzID9cIiwgLT5cbiAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciBiYWNrd2FyZHMgdG8gdGhlIHNwZWNpZmllZCBzZWFyY2ggcGF0dGVyblwiLCAtPlxuICAgICAgICBrZXlkb3duKCc/JylcbiAgICAgICAgc3VibWl0Tm9ybWFsTW9kZUlucHV0VGV4dCgnZGVmJylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFszLCAwXVxuICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGl0IFwiYWNjZXB0cyAvIGFzIGEgbGl0ZXJhbCBzZWFyY2ggcGF0dGVyblwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0VGV4dChcImFiY1xcbmQvZlxcbmFiY1xcbmQvZlxcblwiKVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuICAgICAgICBrZXlkb3duKCc/JylcbiAgICAgICAgc3VibWl0Tm9ybWFsTW9kZUlucHV0VGV4dCgnLycpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMywgMV1cbiAgICAgICAga2V5ZG93bignPycpXG4gICAgICAgIHN1Ym1pdE5vcm1hbE1vZGVJbnB1dFRleHQoJy8nKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDFdXG4gICAgICAgIGV4cGVjdChhdG9tLmJlZXApLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgZGVzY3JpYmUgXCJyZXBlYXRpbmdcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGtleWRvd24oJz8nKVxuICAgICAgICAgIHN1Ym1pdE5vcm1hbE1vZGVJbnB1dFRleHQoJ2RlZicpXG5cbiAgICAgICAgaXQgXCJyZXBlYXRzIHByZXZpb3VzIHNlYXJjaCBhcyByZXZlcnNlZCB3aXRoID88ZW50ZXI+XCIsIC0+XG4gICAgICAgICAga2V5ZG93bignPycpXG4gICAgICAgICAgc3VibWl0Tm9ybWFsTW9kZUlucHV0VGV4dCgnJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG4gICAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAgIGl0IFwicmVwZWF0cyBwcmV2aW91cyBzZWFyY2ggYXMgcmV2ZXJzZWQgd2l0aCA/P1wiLCAtPlxuICAgICAgICAgIGtleWRvd24oJz8nKVxuICAgICAgICAgIHN1Ym1pdE5vcm1hbE1vZGVJbnB1dFRleHQoJz8nKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMF1cbiAgICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgICAgZGVzY3JpYmUgJ3RoZSBuIGtleWJpbmRpbmcnLCAtPlxuICAgICAgICAgIGl0IFwicmVwZWF0cyB0aGUgbGFzdCBzZWFyY2ggYmFja3dhcmRzXCIsIC0+XG4gICAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuICAgICAgICAgICAga2V5ZG93bignbicpXG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzMsIDBdXG4gICAgICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgICAgZGVzY3JpYmUgJ3RoZSBOIGtleWJpbmRpbmcnLCAtPlxuICAgICAgICAgIGl0IFwicmVwZWF0cyB0aGUgbGFzdCBzZWFyY2ggZm9yd2FyZHNcIiwgLT5cbiAgICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICAgICAgICBrZXlkb3duKCdOJywgc2hpZnQ6IHRydWUpXG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG4gICAgICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBkZXNjcmliZSBcInVzaW5nIHNlYXJjaCBoaXN0b3J5XCIsIC0+XG4gICAgICBpbnB1dEVkaXRvciA9IG51bGxcblxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBrZXlkb3duKCcvJylcbiAgICAgICAgc3VibWl0Tm9ybWFsTW9kZUlucHV0VGV4dCgnZGVmJylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuXG4gICAgICAgIGtleWRvd24oJy8nKVxuICAgICAgICBzdWJtaXROb3JtYWxNb2RlSW5wdXRUZXh0KCdhYmMnKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzIsIDBdXG5cbiAgICAgICAgaW5wdXRFZGl0b3IgPSBlZGl0b3Iubm9ybWFsTW9kZUlucHV0Vmlldy5lZGl0b3JFbGVtZW50XG5cbiAgICAgIGl0IFwiYWxsb3dzIHNlYXJjaGluZyBoaXN0b3J5IGluIHRoZSBzZWFyY2ggZmllbGRcIiwgLT5cbiAgICAgICAga2V5ZG93bignLycpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goaW5wdXRFZGl0b3IsICdjb3JlOm1vdmUtdXAnKVxuICAgICAgICBleHBlY3QoaW5wdXRFZGl0b3IuZ2V0TW9kZWwoKS5nZXRUZXh0KCkpLnRvRXF1YWwoJ2FiYycpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goaW5wdXRFZGl0b3IsICdjb3JlOm1vdmUtdXAnKVxuICAgICAgICBleHBlY3QoaW5wdXRFZGl0b3IuZ2V0TW9kZWwoKS5nZXRUZXh0KCkpLnRvRXF1YWwoJ2RlZicpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goaW5wdXRFZGl0b3IsICdjb3JlOm1vdmUtdXAnKVxuICAgICAgICBleHBlY3QoaW5wdXRFZGl0b3IuZ2V0TW9kZWwoKS5nZXRUZXh0KCkpLnRvRXF1YWwoJ2RlZicpXG4gICAgICAgIGV4cGVjdChhdG9tLmJlZXApLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgaXQgXCJyZXNldHMgdGhlIHNlYXJjaCBmaWVsZCB0byBlbXB0eSB3aGVuIHNjcm9sbGluZyBiYWNrXCIsIC0+XG4gICAgICAgIGtleWRvd24oJy8nKVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGlucHV0RWRpdG9yLCAnY29yZTptb3ZlLXVwJylcbiAgICAgICAgZXhwZWN0KGlucHV0RWRpdG9yLmdldE1vZGVsKCkuZ2V0VGV4dCgpKS50b0VxdWFsKCdhYmMnKVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGlucHV0RWRpdG9yLCAnY29yZTptb3ZlLXVwJylcbiAgICAgICAgZXhwZWN0KGlucHV0RWRpdG9yLmdldE1vZGVsKCkuZ2V0VGV4dCgpKS50b0VxdWFsKCdkZWYnKVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGlucHV0RWRpdG9yLCAnY29yZTptb3ZlLWRvd24nKVxuICAgICAgICBleHBlY3QoaW5wdXRFZGl0b3IuZ2V0TW9kZWwoKS5nZXRUZXh0KCkpLnRvRXF1YWwoJ2FiYycpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goaW5wdXRFZGl0b3IsICdjb3JlOm1vdmUtZG93bicpXG4gICAgICAgIGV4cGVjdChpbnB1dEVkaXRvci5nZXRNb2RlbCgpLmdldFRleHQoKSkudG9FcXVhbCAnJ1xuICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgZGVzY3JpYmUgXCJ0aGUgKiBrZXliaW5kaW5nXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJhYmRcXG5AZGVmXFxuYWJkXFxuZGVmXFxuXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgZGVzY3JpYmUgXCJhcyBhIG1vdGlvblwiLCAtPlxuICAgICAgaXQgXCJtb3ZlcyBjdXJzb3IgdG8gbmV4dCBvY2N1cmVuY2Ugb2Ygd29yZCB1bmRlciBjdXJzb3JcIiwgLT5cbiAgICAgICAga2V5ZG93bihcIipcIilcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsyLCAwXVxuXG4gICAgICBpdCBcInJlcGVhdHMgd2l0aCB0aGUgbiBrZXlcIiwgLT5cbiAgICAgICAga2V5ZG93bihcIipcIilcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsyLCAwXVxuICAgICAgICBrZXlkb3duKFwiblwiKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG5cbiAgICAgIGl0IFwiZG9lc24ndCBtb3ZlIGN1cnNvciB1bmxlc3MgbmV4dCBvY2N1cmVuY2UgaXMgdGhlIGV4YWN0IHdvcmQgKG5vIHBhcnRpYWwgbWF0Y2hlcylcIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCJhYmNcXG5kZWZcXG5naGlhYmNcXG5qa2xcXG5hYmNkZWZcIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcbiAgICAgICAga2V5ZG93bihcIipcIilcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFswLCAwXVxuXG4gICAgICBkZXNjcmliZSBcIndpdGggd29yZHMgdGhhdCBjb250YWluICdub24td29yZCcgY2hhcmFjdGVyc1wiLCAtPlxuICAgICAgICBpdCBcIm1vdmVzIGN1cnNvciB0byBuZXh0IG9jY3VyZW5jZSBvZiB3b3JkIHVuZGVyIGN1cnNvclwiLCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRUZXh0KFwiYWJjXFxuQGRlZlxcbmFiY1xcbkBkZWZcXG5cIilcbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEsIDBdKVxuICAgICAgICAgIGtleWRvd24oXCIqXCIpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFszLCAwXVxuXG4gICAgICAgIGl0IFwiZG9lc24ndCBtb3ZlIGN1cnNvciB1bmxlc3MgbmV4dCBtYXRjaCBoYXMgZXhhY3Qgd29yZCBlbmRpbmdcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChcImFiY1xcbkBkZWZcXG5hYmNcXG5AZGVmMVxcblwiKVxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMSwgMV0pXG4gICAgICAgICAga2V5ZG93bihcIipcIilcbiAgICAgICAgICAjIHRoaXMgaXMgYmVjYXVzZSBvZiB0aGUgZGVmYXVsdCBpc0tleXdvcmQgdmFsdWUgb2YgdmltLW1vZGUgdGhhdCBpbmNsdWRlcyBAXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuXG4gICAgICAgICMgRklYTUU6IFRoaXMgYmVoYXZpb3IgaXMgZGlmZmVyZW50IGZyb20gdGhlIG9uZSBmb3VuZCBpblxuICAgICAgICAjIHZpbS4gVGhpcyBpcyBiZWNhdXNlIHRoZSB3b3JkIGJvdW5kYXJ5IG1hdGNoIGluIEphdmFzY3JpcHRcbiAgICAgICAgIyBpZ25vcmVzIHN0YXJ0aW5nICdub24td29yZCcgY2hhcmFjdGVycy5cbiAgICAgICAgIyBlLmcuXG4gICAgICAgICMgaW4gVmltOiAgICAgICAgL1xcPGRlZlxcPi8udGVzdChcIkBkZWZcIikgPT4gZmFsc2VcbiAgICAgICAgIyBpbiBKYXZhc2NyaXB0OiAvXFxiZGVmXFxiLy50ZXN0KFwiQGRlZlwiKSA9PiB0cnVlXG4gICAgICAgIGl0IFwibW92ZXMgY3Vyc29yIHRvIHRoZSBzdGFydCBvZiB2YWxpZCB3b3JkIGNoYXJcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChcImFiY1xcbmRlZlxcbmFiY1xcbkBkZWZcXG5cIilcbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEsIDBdKVxuICAgICAgICAgIGtleWRvd24oXCIqXCIpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFszLCAxXVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gY3Vyc29yIGlzIG9uIG5vbi13b3JkIGNoYXIgY29sdW1uXCIsIC0+XG4gICAgICAgIGl0IFwibWF0Y2hlcyBvbmx5IHRoZSBub24td29yZCBjaGFyXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldFRleHQoXCJhYmNcXG5AZGVmXFxuYWJjXFxuQGRlZlxcblwiKVxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMSwgMF0pXG4gICAgICAgICAga2V5ZG93bihcIipcIilcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzMsIDBdXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBjdXJzb3IgaXMgbm90IG9uIGEgd29yZFwiLCAtPlxuICAgICAgICBpdCBcImRvZXMgYSBtYXRjaCB3aXRoIHRoZSBuZXh0IHdvcmRcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChcImFiY1xcbmEgIEBkZWZcXG4gYWJjXFxuIEBkZWZcIilcbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEsIDFdKVxuICAgICAgICAgIGtleWRvd24oXCIqXCIpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFszLCAxXVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gY3Vyc29yIGlzIGF0IEVPRlwiLCAtPlxuICAgICAgICBpdCBcImRvZXNuJ3QgdHJ5IHRvIGRvIGFueSBtYXRjaFwiLCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRUZXh0KFwiYWJjXFxuQGRlZlxcbmFiY1xcbiBcIilcbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzMsIDBdKVxuICAgICAgICAgIGtleWRvd24oXCIqXCIpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFszLCAwXVxuXG4gIGRlc2NyaWJlIFwidGhlIGhhc2gga2V5YmluZGluZ1wiLCAtPlxuICAgIGRlc2NyaWJlIFwiYXMgYSBtb3Rpb25cIiwgLT5cbiAgICAgIGl0IFwibW92ZXMgY3Vyc29yIHRvIHByZXZpb3VzIG9jY3VyZW5jZSBvZiB3b3JkIHVuZGVyIGN1cnNvclwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0VGV4dChcImFiY1xcbkBkZWZcXG5hYmNcXG5kZWZcXG5cIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsyLCAxXSlcbiAgICAgICAga2V5ZG93bihcIiNcIilcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFswLCAwXVxuXG4gICAgICBpdCBcInJlcGVhdHMgd2l0aCBuXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwiYWJjXFxuQGRlZlxcbmFiY1xcbmRlZlxcbmFiY1xcblwiKVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzIsIDFdKVxuICAgICAgICBrZXlkb3duKFwiI1wiKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG4gICAgICAgIGtleWRvd24oXCJuXCIpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbNCwgMF1cbiAgICAgICAga2V5ZG93bihcIm5cIilcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsyLCAwXVxuXG4gICAgICBpdCBcImRvZXNuJ3QgbW92ZSBjdXJzb3IgdW5sZXNzIG5leHQgb2NjdXJlbmNlIGlzIHRoZSBleGFjdCB3b3JkIChubyBwYXJ0aWFsIG1hdGNoZXMpXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwiYWJjXFxuZGVmXFxuZ2hpYWJjXFxuamtsXFxuYWJjZGVmXCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICAgIGtleWRvd24oXCIjXCIpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMF1cblxuICAgICAgZGVzY3JpYmUgXCJ3aXRoIHdvcmRzIHRoYXQgY29udGFpbnQgJ25vbi13b3JkJyBjaGFyYWN0ZXJzXCIsIC0+XG4gICAgICAgIGl0IFwibW92ZXMgY3Vyc29yIHRvIG5leHQgb2NjdXJlbmNlIG9mIHdvcmQgdW5kZXIgY3Vyc29yXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldFRleHQoXCJhYmNcXG5AZGVmXFxuYWJjXFxuQGRlZlxcblwiKVxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMywgMF0pXG4gICAgICAgICAga2V5ZG93bihcIiNcIilcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG5cbiAgICAgICAgaXQgXCJtb3ZlcyBjdXJzb3IgdG8gdGhlIHN0YXJ0IG9mIHZhbGlkIHdvcmQgY2hhclwiLCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRUZXh0KFwiYWJjXFxuQGRlZlxcbmFiY1xcbmRlZlxcblwiKVxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMywgMF0pXG4gICAgICAgICAga2V5ZG93bihcIiNcIilcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDFdXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBjdXJzb3IgaXMgb24gbm9uLXdvcmQgY2hhciBjb2x1bW5cIiwgLT5cbiAgICAgICAgaXQgXCJtYXRjaGVzIG9ubHkgdGhlIG5vbi13b3JkIGNoYXJcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChcImFiY1xcbkBkZWZcXG5hYmNcXG5AZGVmXFxuXCIpXG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxLCAwXSlcbiAgICAgICAgICBrZXlkb3duKFwiKlwiKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMywgMF1cblxuICBkZXNjcmliZSBcInRoZSBIIGtleWJpbmRpbmdcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIjFcXG4yXFxuM1xcbjRcXG41XFxuNlxcbjdcXG44XFxuOVxcbjEwXFxuXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzgsIDBdKVxuICAgICAgc3B5T24oZWRpdG9yLmdldExhc3RDdXJzb3IoKSwgJ3NldFNjcmVlblBvc2l0aW9uJylcblxuICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byB0aGUgZmlyc3Qgcm93IGlmIHZpc2libGVcIiwgLT5cbiAgICAgIHNweU9uKGVkaXRvckVsZW1lbnQsICdnZXRGaXJzdFZpc2libGVTY3JlZW5Sb3cnKS5hbmRSZXR1cm4oMClcbiAgICAgIGtleWRvd24oJ0gnLCBzaGlmdDogdHJ1ZSlcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLnNldFNjcmVlblBvc2l0aW9uKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbMCwgMF0pXG5cbiAgICBpdCBcIm1vdmVzIHRoZSBjdXJzb3IgdG8gdGhlIGZpcnN0IHZpc2libGUgcm93IHBsdXMgb2Zmc2V0XCIsIC0+XG4gICAgICBzcHlPbihlZGl0b3JFbGVtZW50LCAnZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93JykuYW5kUmV0dXJuKDIpXG4gICAgICBrZXlkb3duKCdIJywgc2hpZnQ6IHRydWUpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldExhc3RDdXJzb3IoKS5zZXRTY3JlZW5Qb3NpdGlvbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoWzQsIDBdKVxuXG4gICAgaXQgXCJyZXNwZWN0cyBjb3VudHNcIiwgLT5cbiAgICAgIHNweU9uKGVkaXRvckVsZW1lbnQsICdnZXRGaXJzdFZpc2libGVTY3JlZW5Sb3cnKS5hbmRSZXR1cm4oMClcbiAgICAgIGtleWRvd24oJzMnKVxuICAgICAga2V5ZG93bignSCcsIHNoaWZ0OiB0cnVlKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuc2V0U2NyZWVuUG9zaXRpb24pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFsyLCAwXSlcblxuICBkZXNjcmliZSBcInRoZSBMIGtleWJpbmRpbmdcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIjFcXG4yXFxuM1xcbjRcXG41XFxuNlxcbjdcXG44XFxuOVxcbjEwXFxuXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzgsIDBdKVxuICAgICAgc3B5T24oZWRpdG9yLmdldExhc3RDdXJzb3IoKSwgJ3NldFNjcmVlblBvc2l0aW9uJylcblxuICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byB0aGUgZmlyc3Qgcm93IGlmIHZpc2libGVcIiwgLT5cbiAgICAgIHNweU9uKGVkaXRvckVsZW1lbnQsICdnZXRMYXN0VmlzaWJsZVNjcmVlblJvdycpLmFuZFJldHVybigxMClcbiAgICAgIGtleWRvd24oJ0wnLCBzaGlmdDogdHJ1ZSlcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLnNldFNjcmVlblBvc2l0aW9uKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbMTAsIDBdKVxuXG4gICAgaXQgXCJtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBmaXJzdCB2aXNpYmxlIHJvdyBwbHVzIG9mZnNldFwiLCAtPlxuICAgICAgc3B5T24oZWRpdG9yRWxlbWVudCwgJ2dldExhc3RWaXNpYmxlU2NyZWVuUm93JykuYW5kUmV0dXJuKDYpXG4gICAgICBrZXlkb3duKCdMJywgc2hpZnQ6IHRydWUpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldExhc3RDdXJzb3IoKS5zZXRTY3JlZW5Qb3NpdGlvbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoWzQsIDBdKVxuXG4gICAgaXQgXCJyZXNwZWN0cyBjb3VudHNcIiwgLT5cbiAgICAgIHNweU9uKGVkaXRvckVsZW1lbnQsICdnZXRMYXN0VmlzaWJsZVNjcmVlblJvdycpLmFuZFJldHVybigxMClcbiAgICAgIGtleWRvd24oJzMnKVxuICAgICAga2V5ZG93bignTCcsIHNoaWZ0OiB0cnVlKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuc2V0U2NyZWVuUG9zaXRpb24pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFs4LCAwXSlcblxuICBkZXNjcmliZSBcInRoZSBNIGtleWJpbmRpbmdcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIjFcXG4yXFxuM1xcbjRcXG41XFxuNlxcbjdcXG44XFxuOVxcbjEwXFxuXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzgsIDBdKVxuICAgICAgc3B5T24oZWRpdG9yLmdldExhc3RDdXJzb3IoKSwgJ3NldFNjcmVlblBvc2l0aW9uJylcbiAgICAgIHNweU9uKGVkaXRvckVsZW1lbnQsICdnZXRMYXN0VmlzaWJsZVNjcmVlblJvdycpLmFuZFJldHVybigxMClcbiAgICAgIHNweU9uKGVkaXRvckVsZW1lbnQsICdnZXRGaXJzdFZpc2libGVTY3JlZW5Sb3cnKS5hbmRSZXR1cm4oMClcblxuICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byB0aGUgZmlyc3Qgcm93IGlmIHZpc2libGVcIiwgLT5cbiAgICAgIGtleWRvd24oJ00nLCBzaGlmdDogdHJ1ZSlcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLnNldFNjcmVlblBvc2l0aW9uKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbNSwgMF0pXG5cbiAgZGVzY3JpYmUgJ3RoZSBtYXJrIGtleWJpbmRpbmdzJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnICAxMlxcbiAgICAzNFxcbjU2XFxuJylcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMV0pXG5cbiAgICBpdCAnbW92ZXMgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgbGluZSBvZiBhIG1hcmsnLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxLCAxXSlcbiAgICAgIGtleWRvd24oJ20nKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYScpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuICAgICAga2V5ZG93bignXFwnJylcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsxLCA0XVxuXG4gICAgaXQgJ21vdmVzIGxpdGVyYWxseSB0byBhIG1hcmsnLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxLCAxXSlcbiAgICAgIGtleWRvd24oJ20nKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYScpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuICAgICAga2V5ZG93bignYCcpXG4gICAgICBub3JtYWxNb2RlSW5wdXRLZXlkb3duKCdhJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMV1cblxuICAgIGl0ICdkZWxldGVzIHRvIGEgbWFyayBieSBsaW5lJywgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMSwgNV0pXG4gICAgICBrZXlkb3duKCdtJylcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcbiAgICAgIGtleWRvd24oJ2QnKVxuICAgICAga2V5ZG93bignXFwnJylcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwgJzU2XFxuJ1xuXG4gICAgaXQgJ2RlbGV0ZXMgYmVmb3JlIHRvIGEgbWFyayBsaXRlcmFsbHknLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxLCA1XSlcbiAgICAgIGtleWRvd24oJ20nKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYScpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDFdKVxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdgJylcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwgJyA0XFxuNTZcXG4nXG5cbiAgICBpdCAnZGVsZXRlcyBhZnRlciB0byBhIG1hcmsgbGl0ZXJhbGx5JywgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMSwgNV0pXG4gICAgICBrZXlkb3duKCdtJylcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsyLCAxXSlcbiAgICAgIGtleWRvd24oJ2QnKVxuICAgICAga2V5ZG93bignYCcpXG4gICAgICBub3JtYWxNb2RlSW5wdXRLZXlkb3duKCdhJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsICcgIDEyXFxuICAgIDM2XFxuJ1xuXG4gICAgaXQgJ21vdmVzIGJhY2sgdG8gcHJldmlvdXMnLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxLCA1XSlcbiAgICAgIGtleWRvd24oJ2AnKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYCcpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzIsIDFdKVxuICAgICAga2V5ZG93bignYCcpXG4gICAgICBub3JtYWxNb2RlSW5wdXRLZXlkb3duKCdgJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgNV1cblxuICBkZXNjcmliZSAndGhlIGYvRiBrZXliaW5kaW5ncycsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJhYmNhYmNhYmNhYmNcXG5cIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG5cbiAgICBpdCAnbW92ZXMgdG8gdGhlIGZpcnN0IHNwZWNpZmllZCBjaGFyYWN0ZXIgaXQgZmluZHMnLCAtPlxuICAgICAga2V5ZG93bignZicpXG4gICAgICBub3JtYWxNb2RlSW5wdXRLZXlkb3duKCdjJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMl1cblxuICAgIGl0ICdtb3ZlcyBiYWNrd2FyZHMgdG8gdGhlIGZpcnN0IHNwZWNpZmllZCBjaGFyYWN0ZXIgaXQgZmluZHMnLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAyXSlcbiAgICAgIGtleWRvd24oJ0YnLCBzaGlmdDogdHJ1ZSlcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAwXVxuXG4gICAgaXQgJ3Jlc3BlY3RzIGNvdW50IGZvcndhcmQnLCAtPlxuICAgICAga2V5ZG93bignMicpXG4gICAgICBrZXlkb3duKCdmJylcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA2XVxuXG4gICAgaXQgJ3Jlc3BlY3RzIGNvdW50IGJhY2t3YXJkJywgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgNl0pXG4gICAgICBrZXlkb3duKCcyJylcbiAgICAgIGtleWRvd24oJ0YnLCBzaGlmdDogdHJ1ZSlcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAwXVxuXG4gICAgaXQgXCJkb2Vzbid0IG1vdmUgaWYgdGhlIGNoYXJhY3RlciBzcGVjaWZpZWQgaXNuJ3QgZm91bmRcIiwgLT5cbiAgICAgIGtleWRvd24oJ2YnKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignZCcpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG4gICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBpdCBcImRvZXNuJ3QgbW92ZSBpZiB0aGVyZSBhcmVuJ3QgdGhlIHNwZWNpZmllZCBjb3VudCBvZiB0aGUgc3BlY2lmaWVkIGNoYXJhY3RlclwiLCAtPlxuICAgICAga2V5ZG93bignMScpXG4gICAgICBrZXlkb3duKCcwJylcbiAgICAgIGtleWRvd24oJ2YnKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYScpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG4gICAgICAjIGEgYnVnIHdhcyBtYWtpbmcgdGhpcyBiZWhhdmlvdXIgZGVwZW5kIG9uIHRoZSBjb3VudFxuICAgICAga2V5ZG93bignMScpXG4gICAgICBrZXlkb3duKCcxJylcbiAgICAgIGtleWRvd24oJ2YnKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYScpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG4gICAgICAjIGFuZCBiYWNrd2FyZHMgbm93XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDZdKVxuICAgICAga2V5ZG93bignMScpXG4gICAgICBrZXlkb3duKCcwJylcbiAgICAgIGtleWRvd24oJ0YnLCBzaGlmdDogdHJ1ZSlcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA2XVxuICAgICAga2V5ZG93bignMScpXG4gICAgICBrZXlkb3duKCcxJylcbiAgICAgIGtleWRvd24oJ0YnLCBzaGlmdDogdHJ1ZSlcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA2XVxuXG4gICAgaXQgXCJjb21wb3NlcyB3aXRoIGRcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgM10pXG4gICAgICBrZXlkb3duKCdkJylcbiAgICAgIGtleWRvd24oJzInKVxuICAgICAga2V5ZG93bignZicpXG4gICAgICBub3JtYWxNb2RlSW5wdXRLZXlkb3duKCdhJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsICdhYmNiY1xcbidcblxuICAgIGl0IFwiY2FuY2VscyBjIHdoZW4gbm8gbWF0Y2ggZm91bmRcIiwgLT5cbiAgICAgIGtleWRvd24oJ2MnKVxuICAgICAga2V5ZG93bignZicpXG4gICAgICBub3JtYWxNb2RlSW5wdXRLZXlkb3duKCdkJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKFwiYWJjYWJjYWJjYWJjXFxuXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG4gICAgICBleHBlY3QodmltU3RhdGUubW9kZSkudG9CZSBcIm5vcm1hbFwiXG5cbiAgICBkZXNjcmliZSAnd2l0aCBhY2NlbnRlZCBjaGFyYWN0ZXJzJywgLT5cbiAgICAgIGJ1aWxkSU1FQ29tcG9zaXRpb25FdmVudCA9IChldmVudCwge2RhdGEsIHRhcmdldH09e30pIC0+XG4gICAgICAgIGV2ZW50ID0gbmV3IEV2ZW50KGV2ZW50KVxuICAgICAgICBldmVudC5kYXRhID0gZGF0YVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXZlbnQsICd0YXJnZXQnLCBnZXQ6IC0+IHRhcmdldClcbiAgICAgICAgZXZlbnRcblxuICAgICAgYnVpbGRUZXh0SW5wdXRFdmVudCA9ICh7ZGF0YSwgdGFyZ2V0fSkgLT5cbiAgICAgICAgZXZlbnQgPSBuZXcgRXZlbnQoJ3RleHRJbnB1dCcpXG4gICAgICAgIGV2ZW50LmRhdGEgPSBkYXRhXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShldmVudCwgJ3RhcmdldCcsIGdldDogLT4gdGFyZ2V0KVxuICAgICAgICBldmVudFxuXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwiYWJjw6liY2FiY8OpYmNcXG5cIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAwXSlcblxuICAgICAgaXQgJ3dvcmtzIHdpdGggSU1FIGNvbXBvc2l0aW9uJywgLT5cbiAgICAgICAga2V5ZG93bignZicpXG4gICAgICAgIG5vcm1hbE1vZGVFZGl0b3IgPSBlZGl0b3Iubm9ybWFsTW9kZUlucHV0Vmlldy5lZGl0b3JFbGVtZW50XG4gICAgICAgIGphc21pbmUuYXR0YWNoVG9ET00obm9ybWFsTW9kZUVkaXRvcilcbiAgICAgICAgZG9tTm9kZSA9IG5vcm1hbE1vZGVFZGl0b3IuY29tcG9uZW50LmRvbU5vZGVcbiAgICAgICAgaW5wdXROb2RlID0gZG9tTm9kZS5xdWVyeVNlbGVjdG9yKCcuaGlkZGVuLWlucHV0JylcbiAgICAgICAgZG9tTm9kZS5kaXNwYXRjaEV2ZW50KGJ1aWxkSU1FQ29tcG9zaXRpb25FdmVudCgnY29tcG9zaXRpb25zdGFydCcsIHRhcmdldDogaW5wdXROb2RlKSlcbiAgICAgICAgZG9tTm9kZS5kaXNwYXRjaEV2ZW50KGJ1aWxkSU1FQ29tcG9zaXRpb25FdmVudCgnY29tcG9zaXRpb251cGRhdGUnLCBkYXRhOiBcIsK0XCIsIHRhcmdldDogaW5wdXROb2RlKSlcbiAgICAgICAgZXhwZWN0KG5vcm1hbE1vZGVFZGl0b3IuZ2V0TW9kZWwoKS5nZXRUZXh0KCkpLnRvRXF1YWwgJ8K0J1xuICAgICAgICBkb21Ob2RlLmRpc3BhdGNoRXZlbnQoYnVpbGRJTUVDb21wb3NpdGlvbkV2ZW50KCdjb21wb3NpdGlvbmVuZCcsIGRhdGE6IFwiw6lcIiwgdGFyZ2V0OiBpbnB1dE5vZGUpKVxuICAgICAgICBkb21Ob2RlLmRpc3BhdGNoRXZlbnQoYnVpbGRUZXh0SW5wdXRFdmVudChkYXRhOiAnw6knLCB0YXJnZXQ6IGlucHV0Tm9kZSkpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgM11cblxuICBkZXNjcmliZSAndGhlIHQvVCBrZXliaW5kaW5ncycsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJhYmNhYmNhYmNhYmNcXG5cIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG5cbiAgICBpdCAnbW92ZXMgdG8gdGhlIGNoYXJhY3RlciBwcmV2aW91cyB0byB0aGUgZmlyc3Qgc3BlY2lmaWVkIGNoYXJhY3RlciBpdCBmaW5kcycsIC0+XG4gICAgICBrZXlkb3duKCd0JylcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyXVxuICAgICAgIyBvciBzdGF5cyBwdXQgd2hlbiBpdCdzIGFscmVhZHkgdGhlcmVcbiAgICAgIGtleWRvd24oJ3QnKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYScpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDJdXG5cbiAgICBpdCAnbW92ZXMgYmFja3dhcmRzIHRvIHRoZSBjaGFyYWN0ZXIgYWZ0ZXIgdGhlIGZpcnN0IHNwZWNpZmllZCBjaGFyYWN0ZXIgaXQgZmluZHMnLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAyXSlcbiAgICAgIGtleWRvd24oJ1QnLCBzaGlmdDogdHJ1ZSlcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAxXVxuXG4gICAgaXQgJ3Jlc3BlY3RzIGNvdW50IGZvcndhcmQnLCAtPlxuICAgICAga2V5ZG93bignMicpXG4gICAgICBrZXlkb3duKCd0JylcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA1XVxuXG4gICAgaXQgJ3Jlc3BlY3RzIGNvdW50IGJhY2t3YXJkJywgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgNl0pXG4gICAgICBrZXlkb3duKCcyJylcbiAgICAgIGtleWRvd24oJ1QnLCBzaGlmdDogdHJ1ZSlcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAxXVxuXG4gICAgaXQgXCJkb2Vzbid0IG1vdmUgaWYgdGhlIGNoYXJhY3RlciBzcGVjaWZpZWQgaXNuJ3QgZm91bmRcIiwgLT5cbiAgICAgIGtleWRvd24oJ3QnKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignZCcpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG4gICAgICBleHBlY3QoYXRvbS5iZWVwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBpdCBcImRvZXNuJ3QgbW92ZSBpZiB0aGVyZSBhcmVuJ3QgdGhlIHNwZWNpZmllZCBjb3VudCBvZiB0aGUgc3BlY2lmaWVkIGNoYXJhY3RlclwiLCAtPlxuICAgICAga2V5ZG93bignMScpXG4gICAgICBrZXlkb3duKCcwJylcbiAgICAgIGtleWRvd24oJ3QnKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYScpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG4gICAgICAjIGEgYnVnIHdhcyBtYWtpbmcgdGhpcyBiZWhhdmlvdXIgZGVwZW5kIG9uIHRoZSBjb3VudFxuICAgICAga2V5ZG93bignMScpXG4gICAgICBrZXlkb3duKCcxJylcbiAgICAgIGtleWRvd24oJ3QnKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYScpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG4gICAgICAjIGFuZCBiYWNrd2FyZHMgbm93XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDZdKVxuICAgICAga2V5ZG93bignMScpXG4gICAgICBrZXlkb3duKCcwJylcbiAgICAgIGtleWRvd24oJ1QnLCBzaGlmdDogdHJ1ZSlcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA2XVxuICAgICAga2V5ZG93bignMScpXG4gICAgICBrZXlkb3duKCcxJylcbiAgICAgIGtleWRvd24oJ1QnLCBzaGlmdDogdHJ1ZSlcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2EnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA2XVxuXG4gICAgaXQgXCJjb21wb3NlcyB3aXRoIGRcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgM10pXG4gICAgICBrZXlkb3duKCdkJylcbiAgICAgIGtleWRvd24oJzInKVxuICAgICAga2V5ZG93bigndCcpXG4gICAgICBub3JtYWxNb2RlSW5wdXRLZXlkb3duKCdiJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdhYmNiY2FiY1xcbidcblxuICAgIGl0IFwic2VsZWN0cyBjaGFyYWN0ZXIgdW5kZXIgY3Vyc29yIGV2ZW4gd2hlbiBubyBtb3ZlbWVudCBoYXBwZW5zXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCd0JylcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2InKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ2JjYWJjYWJjYWJjXFxuJ1xuXG4gIGRlc2NyaWJlICd0aGUgdiBrZXliaW5kaW5nJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIjAxXFxuMDAyXFxuMDAwM1xcbjAwMDA0XFxuMDAwMDA1XFxuXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDFdKVxuXG4gICAgaXQgXCJzZWxlY3RzIGRvd24gYSBsaW5lXCIsIC0+XG4gICAgICBrZXlkb3duKCd2JylcbiAgICAgIGtleWRvd24oJ2onKVxuICAgICAga2V5ZG93bignaicpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKS50b0JlIFwiMDJcXG4wMDAzXFxuMDBcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKCkuaXNTaW5nbGVMaW5lKCkpLnRvQmVGYWxzeSgpXG5cbiAgICBpdCBcInNlbGVjdHMgcmlnaHRcIiwgLT5cbiAgICAgIGtleWRvd24oJ3YnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKS50b0JlIFwiMDJcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKCkuaXNTaW5nbGVMaW5lKCkpLnRvQmVUcnV0aHkoKVxuXG4gIGRlc2NyaWJlICd0aGUgViBrZXliaW5kaW5nJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIjAxXFxuMDAyXFxuMDAwM1xcbjAwMDA0XFxuMDAwMDA1XFxuXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDFdKVxuXG4gICAgaXQgXCJzZWxlY3RzIGRvd24gYSBsaW5lXCIsIC0+XG4gICAgICBrZXlkb3duKCdWJywgc2hpZnQ6IHRydWUpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKS5pc1NpbmdsZUxpbmUoKSkudG9CZUZhbHN5KClcbiAgICAgIGtleWRvd24oJ2onKVxuICAgICAga2V5ZG93bignaicpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKS50b0JlIFwiMDAyXFxuMDAwM1xcbjAwMDA0XFxuXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpLmlzU2luZ2xlTGluZSgpKS50b0JlRmFsc3koKVxuXG4gICAgaXQgXCJzZWxlY3RzIHVwIGEgbGluZVwiLCAtPlxuICAgICAga2V5ZG93bignVicsIHNoaWZ0OiB0cnVlKVxuICAgICAga2V5ZG93bignaycpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKS50b0JlIFwiMDFcXG4wMDJcXG5cIlxuXG4gIGRlc2NyaWJlICd0aGUgOyBhbmQgLCBrZXliaW5kaW5ncycsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJhYmNhYmNhYmNhYmNcXG5cIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG5cbiAgICBpdCBcInJlcGVhdCBmIGluIHNhbWUgZGlyZWN0aW9uXCIsIC0+XG4gICAgICBrZXlkb3duKCdmJylcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2MnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyXVxuICAgICAga2V5ZG93bignOycpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDVdXG4gICAgICBrZXlkb3duKCc7JylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgOF1cblxuICAgIGl0IFwicmVwZWF0IEYgaW4gc2FtZSBkaXJlY3Rpb25cIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMTBdKVxuICAgICAga2V5ZG93bignRicsIHNoaWZ0OiB0cnVlKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYycpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDhdXG4gICAgICBrZXlkb3duKCc7JylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNV1cbiAgICAgIGtleWRvd24oJzsnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyXVxuXG4gICAgaXQgXCJyZXBlYXQgZiBpbiBvcHBvc2l0ZSBkaXJlY3Rpb25cIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgNl0pXG4gICAgICBrZXlkb3duKCdmJylcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2MnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA4XVxuICAgICAga2V5ZG93bignLCcpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDVdXG4gICAgICBrZXlkb3duKCcsJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMl1cblxuICAgIGl0IFwicmVwZWF0IEYgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDRdKVxuICAgICAga2V5ZG93bignRicsIHNoaWZ0OiB0cnVlKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYycpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDJdXG4gICAgICBrZXlkb3duKCcsJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNV1cbiAgICAgIGtleWRvd24oJywnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA4XVxuXG4gICAgaXQgXCJhbHRlcm5hdGUgcmVwZWF0IGYgaW4gc2FtZSBkaXJlY3Rpb24gYW5kIHJldmVyc2VcIiwgLT5cbiAgICAgIGtleWRvd24oJ2YnKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYycpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDJdXG4gICAgICBrZXlkb3duKCc7JylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNV1cbiAgICAgIGtleWRvd24oJywnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyXVxuXG4gICAgaXQgXCJhbHRlcm5hdGUgcmVwZWF0IEYgaW4gc2FtZSBkaXJlY3Rpb24gYW5kIHJldmVyc2VcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMTBdKVxuICAgICAga2V5ZG93bignRicsIHNoaWZ0OiB0cnVlKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYycpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDhdXG4gICAgICBrZXlkb3duKCc7JylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNV1cbiAgICAgIGtleWRvd24oJywnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA4XVxuXG4gICAgaXQgXCJyZXBlYXQgdCBpbiBzYW1lIGRpcmVjdGlvblwiLCAtPlxuICAgICAga2V5ZG93bigndCcpXG4gICAgICBub3JtYWxNb2RlSW5wdXRLZXlkb3duKCdjJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMV1cbiAgICAgIGtleWRvd24oJzsnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA0XVxuXG4gICAgaXQgXCJyZXBlYXQgVCBpbiBzYW1lIGRpcmVjdGlvblwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAxMF0pXG4gICAgICBrZXlkb3duKCdUJywgc2hpZnQ6IHRydWUpXG4gICAgICBub3JtYWxNb2RlSW5wdXRLZXlkb3duKCdjJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgOV1cbiAgICAgIGtleWRvd24oJzsnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA2XVxuXG4gICAgaXQgXCJyZXBlYXQgdCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24gZmlyc3QsIGFuZCB0aGVuIHJldmVyc2VcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgM10pXG4gICAgICBrZXlkb3duKCd0JylcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ2MnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA0XVxuICAgICAga2V5ZG93bignLCcpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDNdXG4gICAgICBrZXlkb3duKCc7JylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNF1cblxuICAgIGl0IFwicmVwZWF0IFQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uIGZpcnN0LCBhbmQgdGhlbiByZXZlcnNlXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDRdKVxuICAgICAga2V5ZG93bignVCcsIHNoaWZ0OiB0cnVlKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYycpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDNdXG4gICAgICBrZXlkb3duKCcsJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNF1cbiAgICAgIGtleWRvd24oJzsnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAzXVxuXG4gICAgaXQgXCJyZXBlYXQgd2l0aCBjb3VudCBpbiBzYW1lIGRpcmVjdGlvblwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAwXSlcbiAgICAgIGtleWRvd24oJ2YnKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYycpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDJdXG4gICAgICBrZXlkb3duKCcyJylcbiAgICAgIGtleWRvd24oJzsnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA4XVxuXG4gICAgaXQgXCJyZXBlYXQgd2l0aCBjb3VudCBpbiByZXZlcnNlIGRpcmVjdGlvblwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCA2XSlcbiAgICAgIGtleWRvd24oJ2YnKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYycpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDhdXG4gICAgICBrZXlkb3duKCcyJylcbiAgICAgIGtleWRvd24oJywnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyXVxuXG4gICAgaXQgXCJzaGFyZXMgdGhlIG1vc3QgcmVjZW50IGZpbmQvdGlsbCBjb21tYW5kIHdpdGggb3RoZXIgZWRpdG9yc1wiLCAtPlxuICAgICAgaGVscGVycy5nZXRFZGl0b3JFbGVtZW50IChvdGhlckVkaXRvckVsZW1lbnQpIC0+XG4gICAgICAgIG90aGVyRWRpdG9yID0gb3RoZXJFZGl0b3JFbGVtZW50LmdldE1vZGVsKClcblxuICAgICAgICBlZGl0b3Iuc2V0VGV4dChcImEgYmF6IGJhclxcblwiKVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICAgIG90aGVyRWRpdG9yLnNldFRleHQoXCJmb28gYmFyIGJhelwiKVxuICAgICAgICBvdGhlckVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG5cbiAgICAgICAgIyBieSBkZWZhdWx0IGtleURvd24gYW5kIHN1Y2ggZ28gaW4gdGhlIHVzdWFsIGVkaXRvclxuICAgICAgICBrZXlkb3duKCdmJylcbiAgICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bignYicpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMl1cbiAgICAgICAgZXhwZWN0KG90aGVyRWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG5cbiAgICAgICAgIyByZXBsYXkgc2FtZSBmaW5kIGluIHRoZSBvdGhlciBlZGl0b3JcbiAgICAgICAga2V5ZG93bignOycsIGVsZW1lbnQ6IG90aGVyRWRpdG9yRWxlbWVudClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyXVxuICAgICAgICBleHBlY3Qob3RoZXJFZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNF1cblxuICAgICAgICAjIGRvIGEgdGlsbCBpbiB0aGUgb3RoZXIgZWRpdG9yXG4gICAgICAgIGtleWRvd24oJ3QnLCBlbGVtZW50OiBvdGhlckVkaXRvckVsZW1lbnQpXG4gICAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ3InLCBlZGl0b3I6IG90aGVyRWRpdG9yKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDJdXG4gICAgICAgIGV4cGVjdChvdGhlckVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA1XVxuXG4gICAgICAgICMgYW5kIHJlcGxheSBpbiB0aGUgbm9ybWFsIGVkaXRvclxuICAgICAgICBrZXlkb3duKCc7JylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA3XVxuICAgICAgICBleHBlY3Qob3RoZXJFZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNV1cbiAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gIGRlc2NyaWJlICd0aGUgJSBtb3Rpb24nLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiKCAoICkgKS0teyB0ZXh0IGluIGhlcmU7IGFuZCBhIGZ1bmN0aW9uIGNhbGwod2l0aCBwYXJhbWV0ZXJzKSB9XFxuXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgaXQgJ21hdGNoZXMgdGhlIGNvcnJlY3QgcGFyZW50aGVzaXMnLCAtPlxuICAgICAga2V5ZG93bignJScpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDZdXG5cbiAgICBpdCAnbWF0Y2hlcyB0aGUgY29ycmVjdCBicmFjZScsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDldKVxuICAgICAga2V5ZG93bignJScpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDYyXVxuXG4gICAgaXQgJ2NvbXBvc2VzIGNvcnJlY3RseSB3aXRoIGQnLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCA5XSlcbiAgICAgIGtleWRvd24oJ2QnKVxuICAgICAga2V5ZG93bignJScpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9FcXVhbCAgXCIoICggKSApLS1cXG5cIlxuXG4gICAgaXQgJ21vdmVzIGNvcnJlY3RseSB3aGVuIGNvbXBvc2VkIHdpdGggdiBnb2luZyBmb3J3YXJkJywgLT5cbiAgICAgIGtleWRvd24oJ3YnKVxuICAgICAga2V5ZG93bignaCcpXG4gICAgICBrZXlkb3duKCclJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgN11cblxuICAgIGl0ICdtb3ZlcyBjb3JyZWN0bHkgd2hlbiBjb21wb3NlZCB3aXRoIHYgZ29pbmcgYmFja3dhcmQnLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCA1XSlcbiAgICAgIGtleWRvd24oJ3YnKVxuICAgICAga2V5ZG93bignJScpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG5cbiAgICBpdCAnaXQgbW92ZXMgYXBwcm9wcmlhdGVseSB0byBmaW5kIHRoZSBuZWFyZXN0IG1hdGNoaW5nIGFjdGlvbicsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDNdKVxuICAgICAga2V5ZG93bignJScpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDJdXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9FcXVhbCAgXCIoICggKSApLS17IHRleHQgaW4gaGVyZTsgYW5kIGEgZnVuY3Rpb24gY2FsbCh3aXRoIHBhcmFtZXRlcnMpIH1cXG5cIlxuXG4gICAgaXQgJ2l0IG1vdmVzIGFwcHJvcHJpYXRlbHkgdG8gZmluZCB0aGUgbmVhcmVzdCBtYXRjaGluZyBhY3Rpb24nLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAyNl0pXG4gICAgICBrZXlkb3duKCclJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNjBdXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9FcXVhbCAgXCIoICggKSApLS17IHRleHQgaW4gaGVyZTsgYW5kIGEgZnVuY3Rpb24gY2FsbCh3aXRoIHBhcmFtZXRlcnMpIH1cXG5cIlxuXG4gICAgaXQgXCJmaW5kcyBtYXRjaGVzIGFjcm9zcyBtdWx0aXBsZSBsaW5lc1wiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCIuLi4oXFxuLi4uKVwiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAwXSlcbiAgICAgIGtleWRvd24oXCIlXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwoWzEsIDNdKVxuXG4gICAgaXQgXCJkb2VzIG5vdCBhZmZlY3Qgc2VhcmNoIGhpc3RvcnlcIiwgLT5cbiAgICAgIGtleWRvd24oJy8nKVxuICAgICAgc3VibWl0Tm9ybWFsTW9kZUlucHV0VGV4dCAnZnVuYydcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMzFdXG4gICAgICBrZXlkb3duKCclJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNjBdXG4gICAgICBrZXlkb3duKCduJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMzFdXG5cbiAgZGVzY3JpYmUgXCJzY3JvbGxpbmcgc2NyZWVuIGFuZCBrZWVwaW5nIGN1cnNvciBpbiB0aGUgc2FtZSBzY3JlZW4gcG9zaXRpb25cIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKGVkaXRvckVsZW1lbnQpXG5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFswLi4uMTAwXS5qb2luKFwiXFxuXCIpKVxuXG4gICAgICBlZGl0b3JFbGVtZW50LnNldEhlaWdodCgyMCAqIDEwKVxuICAgICAgZWRpdG9yRWxlbWVudC5zdHlsZS5saW5lSGVpZ2h0ID0gXCIxMHB4XCJcbiAgICAgIGF0b20udmlld3MucGVyZm9ybURvY3VtZW50UG9sbCgpXG5cbiAgICAgIGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKDQwICogMTApXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzQyLCAwXSlcblxuICAgIGRlc2NyaWJlIFwidGhlIGN0cmwtdSBrZXliaW5kaW5nXCIsIC0+XG4gICAgICBpdCBcIm1vdmVzIHRoZSBzY3JlZW4gdXAgYnkgaGFsZiBzY3JlZW4gc2l6ZSBhbmQga2VlcHMgY3Vyc29yIG9uc2NyZWVuXCIsIC0+XG4gICAgICAgIGtleWRvd24oJ3UnLCBjdHJsOiB0cnVlKVxuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxUb3AoKSkudG9FcXVhbCAzMDBcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFszMiwgMF1cblxuICAgICAgaXQgXCJzZWxlY3RzIG9uIHZpc3VhbCBtb2RlXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbNDIsIDFdKVxuICAgICAgICB2aW1TdGF0ZS5hY3RpdmF0ZVZpc3VhbE1vZGUoKVxuICAgICAgICBrZXlkb3duKCd1JywgY3RybDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSkudG9FcXVhbCBbMzIuLjQyXS5qb2luKFwiXFxuXCIpXG5cbiAgICAgIGl0IFwic2VsZWN0cyBpbiBsaW5ld2lzZSBtb2RlXCIsIC0+XG4gICAgICAgIHZpbVN0YXRlLmFjdGl2YXRlVmlzdWFsTW9kZSgnbGluZXdpc2UnKVxuICAgICAgICBrZXlkb3duKCd1JywgY3RybDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSkudG9FcXVhbCBbMzMuLjQyXS5qb2luKFwiXFxuXCIpLmNvbmNhdChcIlxcblwiKVxuXG4gICAgZGVzY3JpYmUgXCJ0aGUgY3RybC1iIGtleWJpbmRpbmdcIiwgLT5cbiAgICAgIGl0IFwibW92ZXMgc2NyZWVuIHVwIG9uZSBwYWdlXCIsIC0+XG4gICAgICAgIGtleWRvd24oJ2InLCBjdHJsOiB0cnVlKVxuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxUb3AoKSkudG9FcXVhbCAyMDBcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsyMiwgMF1cblxuICAgICAgaXQgXCJzZWxlY3RzIG9uIHZpc3VhbCBtb2RlXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbNDIsIDFdKVxuICAgICAgICB2aW1TdGF0ZS5hY3RpdmF0ZVZpc3VhbE1vZGUoKVxuICAgICAgICBrZXlkb3duKCdiJywgY3RybDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSkudG9FcXVhbCBbMjIuLjQyXS5qb2luKFwiXFxuXCIpXG5cbiAgICAgIGl0IFwic2VsZWN0cyBpbiBsaW5ld2lzZSBtb2RlXCIsIC0+XG4gICAgICAgIHZpbVN0YXRlLmFjdGl2YXRlVmlzdWFsTW9kZSgnbGluZXdpc2UnKVxuICAgICAgICBrZXlkb3duKCdiJywgY3RybDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSkudG9FcXVhbCBbMjMuLjQyXS5qb2luKFwiXFxuXCIpLmNvbmNhdChcIlxcblwiKVxuXG4gICAgZGVzY3JpYmUgXCJ0aGUgY3RybC1kIGtleWJpbmRpbmdcIiwgLT5cbiAgICAgIGl0IFwibW92ZXMgdGhlIHNjcmVlbiBkb3duIGJ5IGhhbGYgc2NyZWVuIHNpemUgYW5kIGtlZXBzIGN1cnNvciBvbnNjcmVlblwiLCAtPlxuICAgICAgICBrZXlkb3duKCdkJywgY3RybDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKCkpLnRvRXF1YWwgNTAwXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbNTIsIDBdXG5cbiAgICAgIGl0IFwic2VsZWN0cyBvbiB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzQyLCAxXSlcbiAgICAgICAgdmltU3RhdGUuYWN0aXZhdGVWaXN1YWxNb2RlKClcbiAgICAgICAga2V5ZG93bignZCcsIGN0cmw6IHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpLnRvRXF1YWwgWzQyLi41Ml0uam9pbihcIlxcblwiKS5zbGljZSgxLCAtMSlcblxuICAgICAgaXQgXCJzZWxlY3RzIGluIGxpbmV3aXNlIG1vZGVcIiwgLT5cbiAgICAgICAgdmltU3RhdGUuYWN0aXZhdGVWaXN1YWxNb2RlKCdsaW5ld2lzZScpXG4gICAgICAgIGtleWRvd24oJ2QnLCBjdHJsOiB0cnVlKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKS50b0VxdWFsIFs0Mi4uNTNdLmpvaW4oXCJcXG5cIikuY29uY2F0KFwiXFxuXCIpXG5cbiAgICBkZXNjcmliZSBcInRoZSBjdHJsLWYga2V5YmluZGluZ1wiLCAtPlxuICAgICAgaXQgXCJtb3ZlcyBzY3JlZW4gZG93biBvbmUgcGFnZVwiLCAtPlxuICAgICAgICBrZXlkb3duKCdmJywgY3RybDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKCkpLnRvRXF1YWwgNjAwXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbNjIsIDBdXG5cbiAgICAgIGl0IFwic2VsZWN0cyBvbiB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzQyLCAxXSlcbiAgICAgICAgdmltU3RhdGUuYWN0aXZhdGVWaXN1YWxNb2RlKClcbiAgICAgICAga2V5ZG93bignZicsIGN0cmw6IHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpLnRvRXF1YWwgWzQyLi42Ml0uam9pbihcIlxcblwiKS5zbGljZSgxLCAtMSlcblxuICAgICAgaXQgXCJzZWxlY3RzIGluIGxpbmV3aXNlIG1vZGVcIiwgLT5cbiAgICAgICAgdmltU3RhdGUuYWN0aXZhdGVWaXN1YWxNb2RlKCdsaW5ld2lzZScpXG4gICAgICAgIGtleWRvd24oJ2YnLCBjdHJsOiB0cnVlKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKS50b0VxdWFsIFs0Mi4uNjNdLmpvaW4oXCJcXG5cIikuY29uY2F0KFwiXFxuXCIpXG4iXX0=
