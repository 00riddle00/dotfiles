(function() {
  var StatusBarManager, VimState, _, helpers;

  _ = require('underscore-plus');

  helpers = require('./spec-helper');

  VimState = require('../lib/vim-state');

  StatusBarManager = require('../lib/status-bar-manager');

  describe("VimState", function() {
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
    describe("initialization", function() {
      it("puts the editor in normal-mode initially by default", function() {
        expect(editorElement.classList.contains('vim-mode')).toBe(true);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("puts the editor in insert-mode if startInInsertMode is true", function() {
        atom.config.set('vim-mode.startInInsertMode', true);
        editor.vimState = new VimState(editorElement, new StatusBarManager);
        return expect(editorElement.classList.contains('insert-mode')).toBe(true);
      });
    });
    describe("::destroy", function() {
      it("re-enables text input on the editor", function() {
        expect(editorElement.component.isInputEnabled()).toBeFalsy();
        vimState.destroy();
        return expect(editorElement.component.isInputEnabled()).toBeTruthy();
      });
      it("removes the mode classes from the editor", function() {
        expect(editorElement.classList.contains("normal-mode")).toBeTruthy();
        vimState.destroy();
        return expect(editorElement.classList.contains("normal-mode")).toBeFalsy();
      });
      return it("is a noop when the editor is already destroyed", function() {
        editorElement.getModel().destroy();
        return vimState.destroy();
      });
    });
    describe("normal-mode", function() {
      describe("when entering an insertable character", function() {
        beforeEach(function() {
          return keydown('\\');
        });
        return it("stops propagation", function() {
          return expect(editor.getText()).toEqual('');
        });
      });
      describe("when entering an operator", function() {
        beforeEach(function() {
          return keydown('d');
        });
        describe("with an operator that can't be composed", function() {
          beforeEach(function() {
            return keydown('x');
          });
          return it("clears the operator stack", function() {
            return expect(vimState.opStack.length).toBe(0);
          });
        });
        describe("the escape keybinding", function() {
          beforeEach(function() {
            return keydown('escape');
          });
          return it("clears the operator stack", function() {
            return expect(vimState.opStack.length).toBe(0);
          });
        });
        return describe("the ctrl-c keybinding", function() {
          beforeEach(function() {
            return keydown('c', {
              ctrl: true
            });
          });
          return it("clears the operator stack", function() {
            return expect(vimState.opStack.length).toBe(0);
          });
        });
      });
      describe("the escape keybinding", function() {
        return it("clears any extra cursors", function() {
          editor.setText("one-two-three");
          editor.addCursorAtBufferPosition([0, 3]);
          expect(editor.getCursors().length).toBe(2);
          keydown('escape');
          return expect(editor.getCursors().length).toBe(1);
        });
      });
      describe("the v keybinding", function() {
        beforeEach(function() {
          editor.setText("012345\nabcdef");
          editor.setCursorScreenPosition([0, 0]);
          return keydown('v');
        });
        it("puts the editor into visual characterwise mode", function() {
          expect(editorElement.classList.contains('visual-mode')).toBe(true);
          expect(vimState.submode).toEqual('characterwise');
          return expect(editorElement.classList.contains('normal-mode')).toBe(false);
        });
        return it("selects the current character", function() {
          return expect(editor.getLastSelection().getText()).toEqual('0');
        });
      });
      describe("the V keybinding", function() {
        beforeEach(function() {
          editor.setText("012345\nabcdef");
          editor.setCursorScreenPosition([0, 0]);
          return keydown('V', {
            shift: true
          });
        });
        it("puts the editor into visual linewise mode", function() {
          expect(editorElement.classList.contains('visual-mode')).toBe(true);
          expect(vimState.submode).toEqual('linewise');
          return expect(editorElement.classList.contains('normal-mode')).toBe(false);
        });
        return it("selects the current line", function() {
          return expect(editor.getLastSelection().getText()).toEqual('012345\n');
        });
      });
      describe("the ctrl-v keybinding", function() {
        beforeEach(function() {
          editor.setText("012345\nabcdef");
          editor.setCursorScreenPosition([0, 0]);
          return keydown('v', {
            ctrl: true
          });
        });
        return it("puts the editor into visual blockwise mode", function() {
          expect(editorElement.classList.contains('visual-mode')).toBe(true);
          expect(vimState.submode).toEqual('blockwise');
          return expect(editorElement.classList.contains('normal-mode')).toBe(false);
        });
      });
      describe("selecting text", function() {
        beforeEach(function() {
          editor.setText("abc def");
          return editor.setCursorScreenPosition([0, 0]);
        });
        it("puts the editor into visual mode", function() {
          expect(vimState.mode).toEqual('normal');
          atom.commands.dispatch(editorElement, "core:select-right");
          expect(vimState.mode).toEqual('visual');
          expect(vimState.submode).toEqual('characterwise');
          return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 0], [0, 1]]]);
        });
        it("handles the editor being destroyed shortly after selecting text", function() {
          editor.setSelectedBufferRanges([[[0, 0], [0, 3]]]);
          editor.destroy();
          vimState.destroy();
          return advanceClock(100);
        });
        return it("handles native selection such as core:select-all", function() {
          atom.commands.dispatch(editorElement, "core:select-all");
          return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 0], [0, 7]]]);
        });
      });
      describe("the i keybinding", function() {
        beforeEach(function() {
          return keydown('i');
        });
        return it("puts the editor into insert mode", function() {
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          return expect(editorElement.classList.contains('normal-mode')).toBe(false);
        });
      });
      describe("the R keybinding", function() {
        beforeEach(function() {
          return keydown('R', {
            shift: true
          });
        });
        return it("puts the editor into replace mode", function() {
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          expect(editorElement.classList.contains('replace-mode')).toBe(true);
          return expect(editorElement.classList.contains('normal-mode')).toBe(false);
        });
      });
      describe("with content", function() {
        beforeEach(function() {
          editor.setText("012345\n\nabcdef");
          return editor.setCursorScreenPosition([0, 0]);
        });
        describe("on a line with content", function() {
          return it("does not allow atom commands to place the cursor on the \\n character", function() {
            atom.commands.dispatch(editorElement, "editor:move-to-end-of-line");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
          });
        });
        return describe("on an empty line", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([1, 0]);
            return atom.commands.dispatch(editorElement, "editor:move-to-end-of-line");
          });
          return it("allows the cursor to be placed on the \\n character", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
      return describe('with character-input operations', function() {
        beforeEach(function() {
          return editor.setText('012345\nabcdef');
        });
        return it('properly clears the opStack', function() {
          keydown('d');
          keydown('r');
          expect(vimState.mode).toBe('normal');
          expect(vimState.opStack.length).toBe(0);
          atom.commands.dispatch(editor.normalModeInputView.editorElement, "core:cancel");
          keydown('d');
          return expect(editor.getText()).toBe('012345\nabcdef');
        });
      });
    });
    describe("insert-mode", function() {
      beforeEach(function() {
        return keydown('i');
      });
      describe("with content", function() {
        beforeEach(function() {
          return editor.setText("012345\n\nabcdef");
        });
        describe("when cursor is in the middle of the line", function() {
          beforeEach(function() {
            return editor.setCursorScreenPosition([0, 3]);
          });
          return it("moves the cursor to the left when exiting insert mode", function() {
            keydown('escape');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        describe("when cursor is at the beginning of line", function() {
          beforeEach(function() {
            return editor.setCursorScreenPosition([1, 0]);
          });
          return it("leaves the cursor at the beginning of line", function() {
            keydown('escape');
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        return describe("on a line with content", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            return atom.commands.dispatch(editorElement, "editor:move-to-end-of-line");
          });
          return it("allows the cursor to be placed on the \\n character", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
          });
        });
      });
      it("puts the editor into normal mode when <escape> is pressed", function() {
        keydown('escape');
        expect(editorElement.classList.contains('normal-mode')).toBe(true);
        expect(editorElement.classList.contains('insert-mode')).toBe(false);
        return expect(editorElement.classList.contains('visual-mode')).toBe(false);
      });
      return it("puts the editor into normal mode when <ctrl-c> is pressed", function() {
        helpers.mockPlatform(editorElement, 'platform-darwin');
        keydown('c', {
          ctrl: true
        });
        helpers.unmockPlatform(editorElement);
        expect(editorElement.classList.contains('normal-mode')).toBe(true);
        expect(editorElement.classList.contains('insert-mode')).toBe(false);
        return expect(editorElement.classList.contains('visual-mode')).toBe(false);
      });
    });
    describe("replace-mode", function() {
      describe("with content", function() {
        beforeEach(function() {
          return editor.setText("012345\n\nabcdef");
        });
        describe("when cursor is in the middle of the line", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 3]);
            return keydown('R', {
              shift: true
            });
          });
          return it("moves the cursor to the left when exiting replace mode", function() {
            keydown('escape');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        describe("when cursor is at the beginning of line", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([1, 0]);
            return keydown('R', {
              shift: true
            });
          });
          return it("leaves the cursor at the beginning of line", function() {
            keydown('escape');
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        return describe("on a line with content", function() {
          beforeEach(function() {
            keydown('R', {
              shift: true
            });
            editor.setCursorScreenPosition([0, 0]);
            return atom.commands.dispatch(editorElement, "editor:move-to-end-of-line");
          });
          return it("allows the cursor to be placed on the \\n character", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
          });
        });
      });
      it("puts the editor into normal mode when <escape> is pressed", function() {
        keydown('R', {
          shift: true
        });
        keydown('escape');
        expect(editorElement.classList.contains('normal-mode')).toBe(true);
        expect(editorElement.classList.contains('insert-mode')).toBe(false);
        expect(editorElement.classList.contains('replace-mode')).toBe(false);
        return expect(editorElement.classList.contains('visual-mode')).toBe(false);
      });
      return it("puts the editor into normal mode when <ctrl-c> is pressed", function() {
        keydown('R', {
          shift: true
        });
        helpers.mockPlatform(editorElement, 'platform-darwin');
        keydown('c', {
          ctrl: true
        });
        helpers.unmockPlatform(editorElement);
        expect(editorElement.classList.contains('normal-mode')).toBe(true);
        expect(editorElement.classList.contains('insert-mode')).toBe(false);
        expect(editorElement.classList.contains('replace-mode')).toBe(false);
        return expect(editorElement.classList.contains('visual-mode')).toBe(false);
      });
    });
    describe("visual-mode", function() {
      beforeEach(function() {
        editor.setText("one two three");
        editor.setCursorBufferPosition([0, 4]);
        return keydown('v');
      });
      it("selects the character under the cursor", function() {
        expect(editor.getSelectedBufferRanges()).toEqual([[[0, 4], [0, 5]]]);
        return expect(editor.getSelectedText()).toBe("t");
      });
      it("puts the editor into normal mode when <escape> is pressed", function() {
        keydown('escape');
        expect(editor.getCursorBufferPositions()).toEqual([[0, 4]]);
        expect(editorElement.classList.contains('normal-mode')).toBe(true);
        return expect(editorElement.classList.contains('visual-mode')).toBe(false);
      });
      it("puts the editor into normal mode when <escape> is pressed on selection is reversed", function() {
        expect(editor.getSelectedText()).toBe("t");
        keydown("h");
        keydown("h");
        expect(editor.getSelectedText()).toBe("e t");
        expect(editor.getLastSelection().isReversed()).toBe(true);
        keydown('escape');
        expect(editorElement.classList.contains('normal-mode')).toBe(true);
        return expect(editor.getCursorBufferPositions()).toEqual([[0, 2]]);
      });
      describe("motions", function() {
        it("transforms the selection", function() {
          keydown('w');
          return expect(editor.getLastSelection().getText()).toEqual('two t');
        });
        return it("always leaves the initially selected character selected", function() {
          keydown("h");
          expect(editor.getSelectedText()).toBe(" t");
          keydown("l");
          expect(editor.getSelectedText()).toBe("t");
          keydown("l");
          return expect(editor.getSelectedText()).toBe("tw");
        });
      });
      describe("operators", function() {
        beforeEach(function() {
          editor.setText("012345\n\nabcdef");
          editor.setCursorScreenPosition([0, 0]);
          editor.selectLinesContainingCursors();
          return keydown('d');
        });
        return it("operate on the current selection", function() {
          return expect(editor.getText()).toEqual("\nabcdef");
        });
      });
      describe("returning to normal-mode", function() {
        beforeEach(function() {
          editor.setText("012345\n\nabcdef");
          editor.selectLinesContainingCursors();
          return keydown('escape');
        });
        return it("operate on the current selection", function() {
          return expect(editor.getLastSelection().getText()).toEqual('');
        });
      });
      describe("the o keybinding", function() {
        it("reversed each selection", function() {
          editor.addCursorAtBufferPosition([0, 2e308]);
          keydown("i");
          keydown("w");
          expect(editor.getSelectedBufferRanges()).toEqual([[[0, 4], [0, 7]], [[0, 8], [0, 13]]]);
          expect(editor.getCursorBufferPositions()).toEqual([[0, 7], [0, 13]]);
          keydown("o");
          expect(editor.getSelectedBufferRanges()).toEqual([[[0, 4], [0, 7]], [[0, 8], [0, 13]]]);
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 4], [0, 8]]);
        });
        return it("harmonizes selection directions", function() {
          keydown("e");
          editor.addCursorAtBufferPosition([0, 2e308]);
          keydown("h");
          keydown("h");
          expect(editor.getSelectedBufferRanges()).toEqual([[[0, 4], [0, 5]], [[0, 11], [0, 13]]]);
          expect(editor.getCursorBufferPositions()).toEqual([[0, 5], [0, 11]]);
          keydown("o");
          expect(editor.getSelectedBufferRanges()).toEqual([[[0, 4], [0, 5]], [[0, 11], [0, 13]]]);
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 5], [0, 13]]);
        });
      });
      return describe("activate visualmode witin visualmode", function() {
        beforeEach(function() {
          keydown('escape');
          expect(vimState.mode).toEqual('normal');
          return expect(editorElement.classList.contains('normal-mode')).toBe(true);
        });
        it("activateVisualMode with same type puts the editor into normal mode", function() {
          keydown('v');
          expect(editorElement.classList.contains('visual-mode')).toBe(true);
          expect(vimState.submode).toEqual('characterwise');
          expect(editorElement.classList.contains('normal-mode')).toBe(false);
          keydown('v');
          expect(vimState.mode).toEqual('normal');
          expect(editorElement.classList.contains('normal-mode')).toBe(true);
          keydown('V', {
            shift: true
          });
          expect(editorElement.classList.contains('visual-mode')).toBe(true);
          expect(vimState.submode).toEqual('linewise');
          expect(editorElement.classList.contains('normal-mode')).toBe(false);
          keydown('V', {
            shift: true
          });
          expect(vimState.mode).toEqual('normal');
          expect(editorElement.classList.contains('normal-mode')).toBe(true);
          keydown('v', {
            ctrl: true
          });
          expect(editorElement.classList.contains('visual-mode')).toBe(true);
          expect(vimState.submode).toEqual('blockwise');
          expect(editorElement.classList.contains('normal-mode')).toBe(false);
          keydown('v', {
            ctrl: true
          });
          expect(vimState.mode).toEqual('normal');
          return expect(editorElement.classList.contains('normal-mode')).toBe(true);
        });
        return describe("change submode within visualmode", function() {
          beforeEach(function() {
            editor.setText("line one\nline two\nline three\n");
            editor.setCursorBufferPosition([0, 5]);
            return editor.addCursorAtBufferPosition([2, 5]);
          });
          it("can change submode within visual mode", function() {
            keydown('v');
            expect(editorElement.classList.contains('visual-mode')).toBe(true);
            expect(vimState.submode).toEqual('characterwise');
            expect(editorElement.classList.contains('normal-mode')).toBe(false);
            keydown('V', {
              shift: true
            });
            expect(editorElement.classList.contains('visual-mode')).toBe(true);
            expect(vimState.submode).toEqual('linewise');
            expect(editorElement.classList.contains('normal-mode')).toBe(false);
            keydown('v', {
              ctrl: true
            });
            expect(editorElement.classList.contains('visual-mode')).toBe(true);
            expect(vimState.submode).toEqual('blockwise');
            expect(editorElement.classList.contains('normal-mode')).toBe(false);
            keydown('v');
            expect(editorElement.classList.contains('visual-mode')).toBe(true);
            expect(vimState.submode).toEqual('characterwise');
            return expect(editorElement.classList.contains('normal-mode')).toBe(false);
          });
          return it("recover original range when shift from linewse to characterwise", function() {
            keydown('v');
            keydown('i');
            keydown('w');
            expect(_.map(editor.getSelections(), function(selection) {
              return selection.getText();
            })).toEqual(['one', 'three']);
            keydown('V', {
              shift: true
            });
            expect(_.map(editor.getSelections(), function(selection) {
              return selection.getText();
            })).toEqual(["line one\n", "line three\n"]);
            keydown('v', {
              ctrl: true
            });
            return expect(_.map(editor.getSelections(), function(selection) {
              return selection.getText();
            })).toEqual(['one', 'three']);
          });
        });
      });
    });
    return describe("marks", function() {
      beforeEach(function() {
        return editor.setText("text in line 1\ntext in line 2\ntext in line 3");
      });
      it("basic marking functionality", function() {
        editor.setCursorScreenPosition([1, 1]);
        keydown('m');
        normalModeInputKeydown('t');
        expect(editor.getText()).toEqual("text in line 1\ntext in line 2\ntext in line 3");
        editor.setCursorScreenPosition([2, 2]);
        keydown('`');
        normalModeInputKeydown('t');
        return expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
      });
      it("real (tracking) marking functionality", function() {
        editor.setCursorScreenPosition([2, 2]);
        keydown('m');
        normalModeInputKeydown('q');
        editor.setCursorScreenPosition([1, 2]);
        keydown('o');
        keydown('escape');
        keydown('`');
        normalModeInputKeydown('q');
        return expect(editor.getCursorScreenPosition()).toEqual([3, 2]);
      });
      return it("real (tracking) marking functionality", function() {
        editor.setCursorScreenPosition([2, 2]);
        keydown('m');
        normalModeInputKeydown('q');
        editor.setCursorScreenPosition([1, 2]);
        keydown('d');
        keydown('d');
        keydown('escape');
        keydown('`');
        normalModeInputKeydown('q');
        return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvdmltLXN0YXRlLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUNKLE9BQUEsR0FBVSxPQUFBLENBQVEsZUFBUjs7RUFDVixRQUFBLEdBQVcsT0FBQSxDQUFRLGtCQUFSOztFQUNYLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSwyQkFBUjs7RUFFbkIsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQTtBQUNuQixRQUFBO0lBQUEsTUFBb0MsRUFBcEMsRUFBQyxlQUFELEVBQVMsc0JBQVQsRUFBd0I7SUFFeEIsVUFBQSxDQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBZCxDQUEwQixVQUExQjtNQUNWLE9BQU8sQ0FBQyxpQkFBUixDQUFBO2FBRUEsT0FBTyxDQUFDLGdCQUFSLENBQXlCLFNBQUMsT0FBRDtRQUN2QixhQUFBLEdBQWdCO1FBQ2hCLE1BQUEsR0FBUyxhQUFhLENBQUMsUUFBZCxDQUFBO1FBQ1QsUUFBQSxHQUFXLGFBQWEsQ0FBQztRQUN6QixRQUFRLENBQUMsa0JBQVQsQ0FBQTtlQUNBLFFBQVEsQ0FBQyxlQUFULENBQUE7TUFMdUIsQ0FBekI7SUFKUyxDQUFYO0lBV0EsT0FBQSxHQUFVLFNBQUMsR0FBRCxFQUFNLE9BQU47O1FBQU0sVUFBUTs7O1FBQ3RCLE9BQU8sQ0FBQyxVQUFXOzthQUNuQixPQUFPLENBQUMsT0FBUixDQUFnQixHQUFoQixFQUFxQixPQUFyQjtJQUZRO0lBSVYsc0JBQUEsR0FBeUIsU0FBQyxHQUFELEVBQU0sSUFBTjs7UUFBTSxPQUFPOzthQUNwQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLFFBQXpDLENBQUEsQ0FBbUQsQ0FBQyxP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LEVBQUksQ0FBSixDQUEvQjtRQUNBLE9BQUEsQ0FBUSxHQUFSO1FBQ0Esc0JBQUEsQ0FBdUIsR0FBdkI7UUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtRQUNBLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsT0FBQSxDQUFRLFFBQVI7UUFDQSxPQUFBLENBQVEsR0FBUjtRQUNBLHNCQUFBLENBQXVCLEdBQXZCO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO01BVDBDLENBQTVDO2FBV0EsRUFBQSxDQUFHLHVDQUFILEVBQTRDLFNBQUE7UUFDMUMsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFDQSxPQUFBLENBQVEsR0FBUjtRQUNBLHNCQUFBLENBQXVCLEdBQXZCO1FBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFDQSxPQUFBLENBQVEsR0FBUjtRQUNBLE9BQUEsQ0FBUSxHQUFSO1FBQ0EsT0FBQSxDQUFRLFFBQVI7UUFDQSxPQUFBLENBQVEsR0FBUjtRQUNBLHNCQUFBLENBQXVCLEdBQXZCO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO01BVjBDLENBQTVDO0lBeEJnQixDQUFsQjtFQS9kbUIsQ0FBckI7QUFMQSIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5oZWxwZXJzID0gcmVxdWlyZSAnLi9zcGVjLWhlbHBlcidcblZpbVN0YXRlID0gcmVxdWlyZSAnLi4vbGliL3ZpbS1zdGF0ZSdcblN0YXR1c0Jhck1hbmFnZXIgPSByZXF1aXJlICcuLi9saWIvc3RhdHVzLWJhci1tYW5hZ2VyJ1xuXG5kZXNjcmliZSBcIlZpbVN0YXRlXCIsIC0+XG4gIFtlZGl0b3IsIGVkaXRvckVsZW1lbnQsIHZpbVN0YXRlXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHZpbU1vZGUgPSBhdG9tLnBhY2thZ2VzLmxvYWRQYWNrYWdlKCd2aW0tbW9kZScpXG4gICAgdmltTW9kZS5hY3RpdmF0ZVJlc291cmNlcygpXG5cbiAgICBoZWxwZXJzLmdldEVkaXRvckVsZW1lbnQgKGVsZW1lbnQpIC0+XG4gICAgICBlZGl0b3JFbGVtZW50ID0gZWxlbWVudFxuICAgICAgZWRpdG9yID0gZWRpdG9yRWxlbWVudC5nZXRNb2RlbCgpXG4gICAgICB2aW1TdGF0ZSA9IGVkaXRvckVsZW1lbnQudmltU3RhdGVcbiAgICAgIHZpbVN0YXRlLmFjdGl2YXRlTm9ybWFsTW9kZSgpXG4gICAgICB2aW1TdGF0ZS5yZXNldE5vcm1hbE1vZGUoKVxuXG4gIGtleWRvd24gPSAoa2V5LCBvcHRpb25zPXt9KSAtPlxuICAgIG9wdGlvbnMuZWxlbWVudCA/PSBlZGl0b3JFbGVtZW50XG4gICAgaGVscGVycy5rZXlkb3duKGtleSwgb3B0aW9ucylcblxuICBub3JtYWxNb2RlSW5wdXRLZXlkb3duID0gKGtleSwgb3B0cyA9IHt9KSAtPlxuICAgIGVkaXRvci5ub3JtYWxNb2RlSW5wdXRWaWV3LmVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKS5zZXRUZXh0KGtleSlcblxuICBkZXNjcmliZSBcImluaXRpYWxpemF0aW9uXCIsIC0+XG4gICAgaXQgXCJwdXRzIHRoZSBlZGl0b3IgaW4gbm9ybWFsLW1vZGUgaW5pdGlhbGx5IGJ5IGRlZmF1bHRcIiwgLT5cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygndmltLW1vZGUnKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcInB1dHMgdGhlIGVkaXRvciBpbiBpbnNlcnQtbW9kZSBpZiBzdGFydEluSW5zZXJ0TW9kZSBpcyB0cnVlXCIsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3ZpbS1tb2RlLnN0YXJ0SW5JbnNlcnRNb2RlJywgdHJ1ZVxuICAgICAgZWRpdG9yLnZpbVN0YXRlID0gbmV3IFZpbVN0YXRlKGVkaXRvckVsZW1lbnQsIG5ldyBTdGF0dXNCYXJNYW5hZ2VyKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgZGVzY3JpYmUgXCI6OmRlc3Ryb3lcIiwgLT5cbiAgICBpdCBcInJlLWVuYWJsZXMgdGV4dCBpbnB1dCBvbiB0aGUgZWRpdG9yXCIsIC0+XG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jb21wb25lbnQuaXNJbnB1dEVuYWJsZWQoKSkudG9CZUZhbHN5KClcbiAgICAgIHZpbVN0YXRlLmRlc3Ryb3koKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY29tcG9uZW50LmlzSW5wdXRFbmFibGVkKCkpLnRvQmVUcnV0aHkoKVxuXG4gICAgaXQgXCJyZW1vdmVzIHRoZSBtb2RlIGNsYXNzZXMgZnJvbSB0aGUgZWRpdG9yXCIsIC0+XG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJub3JtYWwtbW9kZVwiKSkudG9CZVRydXRoeSgpXG4gICAgICB2aW1TdGF0ZS5kZXN0cm95KClcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcIm5vcm1hbC1tb2RlXCIpKS50b0JlRmFsc3koKVxuXG4gICAgaXQgXCJpcyBhIG5vb3Agd2hlbiB0aGUgZWRpdG9yIGlzIGFscmVhZHkgZGVzdHJveWVkXCIsIC0+XG4gICAgICBlZGl0b3JFbGVtZW50LmdldE1vZGVsKCkuZGVzdHJveSgpXG4gICAgICB2aW1TdGF0ZS5kZXN0cm95KClcblxuICBkZXNjcmliZSBcIm5vcm1hbC1tb2RlXCIsIC0+XG4gICAgZGVzY3JpYmUgXCJ3aGVuIGVudGVyaW5nIGFuIGluc2VydGFibGUgY2hhcmFjdGVyXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+IGtleWRvd24oJ1xcXFwnKVxuXG4gICAgICBpdCBcInN0b3BzIHByb3BhZ2F0aW9uXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsICcnXG5cbiAgICBkZXNjcmliZSBcIndoZW4gZW50ZXJpbmcgYW4gb3BlcmF0b3JcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT4ga2V5ZG93bignZCcpXG5cbiAgICAgIGRlc2NyaWJlIFwid2l0aCBhbiBvcGVyYXRvciB0aGF0IGNhbid0IGJlIGNvbXBvc2VkXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT4ga2V5ZG93bigneCcpXG5cbiAgICAgICAgaXQgXCJjbGVhcnMgdGhlIG9wZXJhdG9yIHN0YWNrXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLm9wU3RhY2subGVuZ3RoKS50b0JlIDBcblxuICAgICAgZGVzY3JpYmUgXCJ0aGUgZXNjYXBlIGtleWJpbmRpbmdcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPiBrZXlkb3duKCdlc2NhcGUnKVxuXG4gICAgICAgIGl0IFwiY2xlYXJzIHRoZSBvcGVyYXRvciBzdGFja1wiLCAtPlxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5vcFN0YWNrLmxlbmd0aCkudG9CZSAwXG5cbiAgICAgIGRlc2NyaWJlIFwidGhlIGN0cmwtYyBrZXliaW5kaW5nXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT4ga2V5ZG93bignYycsIGN0cmw6IHRydWUpXG5cbiAgICAgICAgaXQgXCJjbGVhcnMgdGhlIG9wZXJhdG9yIHN0YWNrXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLm9wU3RhY2subGVuZ3RoKS50b0JlIDBcblxuICAgIGRlc2NyaWJlIFwidGhlIGVzY2FwZSBrZXliaW5kaW5nXCIsIC0+XG4gICAgICBpdCBcImNsZWFycyBhbnkgZXh0cmEgY3Vyc29yc1wiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0VGV4dChcIm9uZS10d28tdGhyZWVcIilcbiAgICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24oWzAsIDNdKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvcnMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBrZXlkb3duKCdlc2NhcGUnKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvcnMoKS5sZW5ndGgpLnRvQmUgMVxuXG4gICAgZGVzY3JpYmUgXCJ0aGUgdiBrZXliaW5kaW5nXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwiMDEyMzQ1XFxuYWJjZGVmXCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG4gICAgICAgIGtleWRvd24oJ3YnKVxuXG4gICAgICBpdCBcInB1dHMgdGhlIGVkaXRvciBpbnRvIHZpc3VhbCBjaGFyYWN0ZXJ3aXNlIG1vZGVcIiwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXN1YWwtbW9kZScpKS50b0JlKHRydWUpXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5zdWJtb2RlKS50b0VxdWFsICdjaGFyYWN0ZXJ3aXNlJ1xuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUoZmFsc2UpXG5cbiAgICAgIGl0IFwic2VsZWN0cyB0aGUgY3VycmVudCBjaGFyYWN0ZXJcIiwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkuZ2V0VGV4dCgpKS50b0VxdWFsICcwJ1xuXG4gICAgZGVzY3JpYmUgXCJ0aGUgViBrZXliaW5kaW5nXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwiMDEyMzQ1XFxuYWJjZGVmXCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG4gICAgICAgIGtleWRvd24oJ1YnLCBzaGlmdDogdHJ1ZSlcblxuICAgICAgaXQgXCJwdXRzIHRoZSBlZGl0b3IgaW50byB2aXN1YWwgbGluZXdpc2UgbW9kZVwiLCAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc3VhbC1tb2RlJykpLnRvQmUodHJ1ZSlcbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLnN1Ym1vZGUpLnRvRXF1YWwgJ2xpbmV3aXNlJ1xuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUoZmFsc2UpXG5cbiAgICAgIGl0IFwic2VsZWN0cyB0aGUgY3VycmVudCBsaW5lXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpLmdldFRleHQoKSkudG9FcXVhbCAnMDEyMzQ1XFxuJ1xuXG4gICAgZGVzY3JpYmUgXCJ0aGUgY3RybC12IGtleWJpbmRpbmdcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCIwMTIzNDVcXG5hYmNkZWZcIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAwXSlcbiAgICAgICAga2V5ZG93bigndicsIGN0cmw6IHRydWUpXG5cbiAgICAgIGl0IFwicHV0cyB0aGUgZWRpdG9yIGludG8gdmlzdWFsIGJsb2Nrd2lzZSBtb2RlXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygndmlzdWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuICAgICAgICBleHBlY3QodmltU3RhdGUuc3VibW9kZSkudG9FcXVhbCAnYmxvY2t3aXNlJ1xuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUoZmFsc2UpXG5cbiAgICBkZXNjcmliZSBcInNlbGVjdGluZyB0ZXh0XCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwiYWJjIGRlZlwiKVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBpdCBcInB1dHMgdGhlIGVkaXRvciBpbnRvIHZpc3VhbCBtb2RlXCIsIC0+XG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5tb2RlKS50b0VxdWFsICdub3JtYWwnXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgXCJjb3JlOnNlbGVjdC1yaWdodFwiKVxuXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5tb2RlKS50b0VxdWFsICd2aXN1YWwnXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5zdWJtb2RlKS50b0VxdWFsICdjaGFyYWN0ZXJ3aXNlJ1xuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKCkpLnRvRXF1YWwoW1tbMCwgMF0sIFswLCAxXV1dKVxuXG4gICAgICBpdCBcImhhbmRsZXMgdGhlIGVkaXRvciBiZWluZyBkZXN0cm95ZWQgc2hvcnRseSBhZnRlciBzZWxlY3RpbmcgdGV4dFwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoW1tbMCwgMF0sIFswLCAzXV1dKVxuICAgICAgICBlZGl0b3IuZGVzdHJveSgpXG4gICAgICAgIHZpbVN0YXRlLmRlc3Ryb3koKVxuICAgICAgICBhZHZhbmNlQ2xvY2soMTAwKVxuXG4gICAgICBpdCBcImhhbmRsZXMgbmF0aXZlIHNlbGVjdGlvbiBzdWNoIGFzIGNvcmU6c2VsZWN0LWFsbFwiLCAtPlxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvckVsZW1lbnQsIFwiY29yZTpzZWxlY3QtYWxsXCIpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKSkudG9FcXVhbChbW1swLCAwXSwgWzAsIDddXV0pXG5cbiAgICBkZXNjcmliZSBcInRoZSBpIGtleWJpbmRpbmdcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT4ga2V5ZG93bignaScpXG5cbiAgICAgIGl0IFwicHV0cyB0aGUgZWRpdG9yIGludG8gaW5zZXJ0IG1vZGVcIiwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtbW9kZScpKS50b0JlKHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZShmYWxzZSlcblxuICAgIGRlc2NyaWJlIFwidGhlIFIga2V5YmluZGluZ1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBrZXlkb3duKCdSJywgc2hpZnQ6IHRydWUpXG5cbiAgICAgIGl0IFwicHV0cyB0aGUgZWRpdG9yIGludG8gcmVwbGFjZSBtb2RlXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaW5zZXJ0LW1vZGUnKSkudG9CZSh0cnVlKVxuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3JlcGxhY2UtbW9kZScpKS50b0JlKHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZShmYWxzZSlcblxuICAgIGRlc2NyaWJlIFwid2l0aCBjb250ZW50XCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwiMDEyMzQ1XFxuXFxuYWJjZGVmXCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG5cbiAgICAgIGRlc2NyaWJlIFwib24gYSBsaW5lIHdpdGggY29udGVudFwiLCAtPlxuICAgICAgICBpdCBcImRvZXMgbm90IGFsbG93IGF0b20gY29tbWFuZHMgdG8gcGxhY2UgdGhlIGN1cnNvciBvbiB0aGUgXFxcXG4gY2hhcmFjdGVyXCIsIC0+XG4gICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JFbGVtZW50LCBcImVkaXRvcjptb3ZlLXRvLWVuZC1vZi1saW5lXCIpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA1XVxuXG4gICAgICBkZXNjcmliZSBcIm9uIGFuIGVtcHR5IGxpbmVcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMSwgMF0pXG4gICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JFbGVtZW50LCBcImVkaXRvcjptb3ZlLXRvLWVuZC1vZi1saW5lXCIpXG5cbiAgICAgICAgaXQgXCJhbGxvd3MgdGhlIGN1cnNvciB0byBiZSBwbGFjZWQgb24gdGhlIFxcXFxuIGNoYXJhY3RlclwiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMF1cblxuICAgIGRlc2NyaWJlICd3aXRoIGNoYXJhY3Rlci1pbnB1dCBvcGVyYXRpb25zJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT4gZWRpdG9yLnNldFRleHQoJzAxMjM0NVxcbmFiY2RlZicpXG5cbiAgICAgIGl0ICdwcm9wZXJseSBjbGVhcnMgdGhlIG9wU3RhY2snLCAtPlxuICAgICAgICBrZXlkb3duKCdkJylcbiAgICAgICAga2V5ZG93bigncicpXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5tb2RlKS50b0JlICdub3JtYWwnXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5vcFN0YWNrLmxlbmd0aCkudG9CZSAwXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yLm5vcm1hbE1vZGVJbnB1dFZpZXcuZWRpdG9yRWxlbWVudCwgXCJjb3JlOmNhbmNlbFwiKVxuICAgICAgICBrZXlkb3duKCdkJylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJzAxMjM0NVxcbmFiY2RlZidcblxuICBkZXNjcmliZSBcImluc2VydC1tb2RlXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAga2V5ZG93bignaScpXG5cbiAgICBkZXNjcmliZSBcIndpdGggY29udGVudFwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBlZGl0b3Iuc2V0VGV4dChcIjAxMjM0NVxcblxcbmFiY2RlZlwiKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gY3Vyc29yIGlzIGluIHRoZSBtaWRkbGUgb2YgdGhlIGxpbmVcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPiBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDNdKVxuXG4gICAgICAgIGl0IFwibW92ZXMgdGhlIGN1cnNvciB0byB0aGUgbGVmdCB3aGVuIGV4aXRpbmcgaW5zZXJ0IG1vZGVcIiwgLT5cbiAgICAgICAgICBrZXlkb3duKCdlc2NhcGUnKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMl1cblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIGN1cnNvciBpcyBhdCB0aGUgYmVnaW5uaW5nIG9mIGxpbmVcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPiBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDBdKVxuXG4gICAgICAgIGl0IFwibGVhdmVzIHRoZSBjdXJzb3IgYXQgdGhlIGJlZ2lubmluZyBvZiBsaW5lXCIsIC0+XG4gICAgICAgICAga2V5ZG93bignZXNjYXBlJylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzEsIDBdXG5cbiAgICAgIGRlc2NyaWJlIFwib24gYSBsaW5lIHdpdGggY29udGVudFwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAwXSlcbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvckVsZW1lbnQsIFwiZWRpdG9yOm1vdmUtdG8tZW5kLW9mLWxpbmVcIilcblxuICAgICAgICBpdCBcImFsbG93cyB0aGUgY3Vyc29yIHRvIGJlIHBsYWNlZCBvbiB0aGUgXFxcXG4gY2hhcmFjdGVyXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA2XVxuXG4gICAgaXQgXCJwdXRzIHRoZSBlZGl0b3IgaW50byBub3JtYWwgbW9kZSB3aGVuIDxlc2NhcGU+IGlzIHByZXNzZWRcIiwgLT5cbiAgICAgIGtleWRvd24oJ2VzY2FwZScpXG5cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtbW9kZScpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXN1YWwtbW9kZScpKS50b0JlKGZhbHNlKVxuXG4gICAgaXQgXCJwdXRzIHRoZSBlZGl0b3IgaW50byBub3JtYWwgbW9kZSB3aGVuIDxjdHJsLWM+IGlzIHByZXNzZWRcIiwgLT5cbiAgICAgIGhlbHBlcnMubW9ja1BsYXRmb3JtKGVkaXRvckVsZW1lbnQsICdwbGF0Zm9ybS1kYXJ3aW4nKVxuICAgICAga2V5ZG93bignYycsIGN0cmw6IHRydWUpXG4gICAgICBoZWxwZXJzLnVubW9ja1BsYXRmb3JtKGVkaXRvckVsZW1lbnQpXG5cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtbW9kZScpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXN1YWwtbW9kZScpKS50b0JlKGZhbHNlKVxuXG4gIGRlc2NyaWJlIFwicmVwbGFjZS1tb2RlXCIsIC0+XG4gICAgZGVzY3JpYmUgXCJ3aXRoIGNvbnRlbnRcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT4gZWRpdG9yLnNldFRleHQoXCIwMTIzNDVcXG5cXG5hYmNkZWZcIilcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIGN1cnNvciBpcyBpbiB0aGUgbWlkZGxlIG9mIHRoZSBsaW5lXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDNdKVxuICAgICAgICAgIGtleWRvd24oJ1InLCBzaGlmdDogdHJ1ZSlcblxuICAgICAgICBpdCBcIm1vdmVzIHRoZSBjdXJzb3IgdG8gdGhlIGxlZnQgd2hlbiBleGl0aW5nIHJlcGxhY2UgbW9kZVwiLCAtPlxuICAgICAgICAgIGtleWRvd24oJ2VzY2FwZScpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyXVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gY3Vyc29yIGlzIGF0IHRoZSBiZWdpbm5pbmcgb2YgbGluZVwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAwXSlcbiAgICAgICAgICBrZXlkb3duKCdSJywgc2hpZnQ6IHRydWUpXG5cbiAgICAgICAgaXQgXCJsZWF2ZXMgdGhlIGN1cnNvciBhdCB0aGUgYmVnaW5uaW5nIG9mIGxpbmVcIiwgLT5cbiAgICAgICAgICBrZXlkb3duKCdlc2NhcGUnKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMF1cblxuICAgICAgZGVzY3JpYmUgXCJvbiBhIGxpbmUgd2l0aCBjb250ZW50XCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBrZXlkb3duKCdSJywgc2hpZnQ6IHRydWUpXG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAwXSlcbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvckVsZW1lbnQsIFwiZWRpdG9yOm1vdmUtdG8tZW5kLW9mLWxpbmVcIilcblxuICAgICAgICBpdCBcImFsbG93cyB0aGUgY3Vyc29yIHRvIGJlIHBsYWNlZCBvbiB0aGUgXFxcXG4gY2hhcmFjdGVyXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA2XVxuXG4gICAgaXQgXCJwdXRzIHRoZSBlZGl0b3IgaW50byBub3JtYWwgbW9kZSB3aGVuIDxlc2NhcGU+IGlzIHByZXNzZWRcIiwgLT5cbiAgICAgIGtleWRvd24oJ1InLCBzaGlmdDogdHJ1ZSlcbiAgICAgIGtleWRvd24oJ2VzY2FwZScpXG5cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtbW9kZScpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZXBsYWNlLW1vZGUnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygndmlzdWFsLW1vZGUnKSkudG9CZShmYWxzZSlcblxuICAgIGl0IFwicHV0cyB0aGUgZWRpdG9yIGludG8gbm9ybWFsIG1vZGUgd2hlbiA8Y3RybC1jPiBpcyBwcmVzc2VkXCIsIC0+XG4gICAgICBrZXlkb3duKCdSJywgc2hpZnQ6IHRydWUpXG4gICAgICBoZWxwZXJzLm1vY2tQbGF0Zm9ybShlZGl0b3JFbGVtZW50LCAncGxhdGZvcm0tZGFyd2luJylcbiAgICAgIGtleWRvd24oJ2MnLCBjdHJsOiB0cnVlKVxuICAgICAgaGVscGVycy51bm1vY2tQbGF0Zm9ybShlZGl0b3JFbGVtZW50KVxuXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaW5zZXJ0LW1vZGUnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncmVwbGFjZS1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc3VhbC1tb2RlJykpLnRvQmUoZmFsc2UpXG5cbiAgZGVzY3JpYmUgXCJ2aXN1YWwtbW9kZVwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwib25lIHR3byB0aHJlZVwiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCA0XSlcbiAgICAgIGtleWRvd24oJ3YnKVxuXG4gICAgaXQgXCJzZWxlY3RzIHRoZSBjaGFyYWN0ZXIgdW5kZXIgdGhlIGN1cnNvclwiLCAtPlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpKS50b0VxdWFsIFtbWzAsIDRdLCBbMCwgNV1dXVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSkudG9CZShcInRcIilcblxuICAgIGl0IFwicHV0cyB0aGUgZWRpdG9yIGludG8gbm9ybWFsIG1vZGUgd2hlbiA8ZXNjYXBlPiBpcyBwcmVzc2VkXCIsIC0+XG4gICAgICBrZXlkb3duKCdlc2NhcGUnKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpKS50b0VxdWFsIFtbMCwgNF1dXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygndmlzdWFsLW1vZGUnKSkudG9CZShmYWxzZSlcblxuICAgIGl0IFwicHV0cyB0aGUgZWRpdG9yIGludG8gbm9ybWFsIG1vZGUgd2hlbiA8ZXNjYXBlPiBpcyBwcmVzc2VkIG9uIHNlbGVjdGlvbiBpcyByZXZlcnNlZFwiLCAtPlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSkudG9CZShcInRcIilcbiAgICAgIGtleWRvd24oXCJoXCIpXG4gICAgICBrZXlkb3duKFwiaFwiKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSkudG9CZShcImUgdFwiKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkuaXNSZXZlcnNlZCgpKS50b0JlKHRydWUpXG4gICAgICBrZXlkb3duKCdlc2NhcGUnKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpKS50b0VxdWFsIFtbMCwgMl1dXG5cbiAgICBkZXNjcmliZSBcIm1vdGlvbnNcIiwgLT5cbiAgICAgIGl0IFwidHJhbnNmb3JtcyB0aGUgc2VsZWN0aW9uXCIsIC0+XG4gICAgICAgIGtleWRvd24oJ3cnKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKS5nZXRUZXh0KCkpLnRvRXF1YWwgJ3R3byB0J1xuXG4gICAgICBpdCBcImFsd2F5cyBsZWF2ZXMgdGhlIGluaXRpYWxseSBzZWxlY3RlZCBjaGFyYWN0ZXIgc2VsZWN0ZWRcIiwgLT5cbiAgICAgICAga2V5ZG93bihcImhcIilcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSkudG9CZShcIiB0XCIpXG5cbiAgICAgICAga2V5ZG93bihcImxcIilcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSkudG9CZShcInRcIilcblxuICAgICAgICBrZXlkb3duKFwibFwiKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKS50b0JlKFwidHdcIilcblxuICAgIGRlc2NyaWJlIFwib3BlcmF0b3JzXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwiMDEyMzQ1XFxuXFxuYWJjZGVmXCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMF0pXG4gICAgICAgIGVkaXRvci5zZWxlY3RMaW5lc0NvbnRhaW5pbmdDdXJzb3JzKClcbiAgICAgICAga2V5ZG93bignZCcpXG5cbiAgICAgIGl0IFwib3BlcmF0ZSBvbiB0aGUgY3VycmVudCBzZWxlY3Rpb25cIiwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwgXCJcXG5hYmNkZWZcIlxuXG4gICAgZGVzY3JpYmUgXCJyZXR1cm5pbmcgdG8gbm9ybWFsLW1vZGVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCIwMTIzNDVcXG5cXG5hYmNkZWZcIilcbiAgICAgICAgZWRpdG9yLnNlbGVjdExpbmVzQ29udGFpbmluZ0N1cnNvcnMoKVxuICAgICAgICBrZXlkb3duKCdlc2NhcGUnKVxuXG4gICAgICBpdCBcIm9wZXJhdGUgb24gdGhlIGN1cnJlbnQgc2VsZWN0aW9uXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpLmdldFRleHQoKSkudG9FcXVhbCAnJ1xuXG4gICAgZGVzY3JpYmUgXCJ0aGUgbyBrZXliaW5kaW5nXCIsIC0+XG4gICAgICBpdCBcInJldmVyc2VkIGVhY2ggc2VsZWN0aW9uXCIsIC0+XG4gICAgICAgIGVkaXRvci5hZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uKFswLCBJbmZpbml0eV0pXG4gICAgICAgIGtleWRvd24oXCJpXCIpXG4gICAgICAgIGtleWRvd24oXCJ3XCIpXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpKS50b0VxdWFsKFtcbiAgICAgICAgICBbWzAsIDRdLCBbMCwgN11dLFxuICAgICAgICAgIFtbMCwgOF0sIFswLCAxM11dXG4gICAgICAgIF0pXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKCkpLnRvRXF1YWwoW1xuICAgICAgICAgIFswLCA3XVxuICAgICAgICAgIFswLCAxM11cbiAgICAgICAgXSlcblxuICAgICAgICBrZXlkb3duKFwib1wiKVxuXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKSkudG9FcXVhbChbXG4gICAgICAgICAgW1swLCA0XSwgWzAsIDddXSxcbiAgICAgICAgICBbWzAsIDhdLCBbMCwgMTNdXVxuICAgICAgICBdKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpKS50b0VxdWFsKFtcbiAgICAgICAgICBbMCwgNF1cbiAgICAgICAgICBbMCwgOF1cbiAgICAgICAgXSlcblxuICAgICAgaXQgXCJoYXJtb25pemVzIHNlbGVjdGlvbiBkaXJlY3Rpb25zXCIsIC0+XG4gICAgICAgIGtleWRvd24oXCJlXCIpXG4gICAgICAgIGVkaXRvci5hZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uKFswLCBJbmZpbml0eV0pXG4gICAgICAgIGtleWRvd24oXCJoXCIpXG4gICAgICAgIGtleWRvd24oXCJoXCIpXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpKS50b0VxdWFsKFtcbiAgICAgICAgICBbWzAsIDRdLCBbMCwgNV1dLFxuICAgICAgICAgIFtbMCwgMTFdLCBbMCwgMTNdXVxuICAgICAgICBdKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpKS50b0VxdWFsKFtcbiAgICAgICAgICBbMCwgNV1cbiAgICAgICAgICBbMCwgMTFdXG4gICAgICAgIF0pXG5cbiAgICAgICAga2V5ZG93bihcIm9cIilcblxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKCkpLnRvRXF1YWwoW1xuICAgICAgICAgIFtbMCwgNF0sIFswLCA1XV0sXG4gICAgICAgICAgW1swLCAxMV0sIFswLCAxM11dXG4gICAgICAgIF0pXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKCkpLnRvRXF1YWwoW1xuICAgICAgICAgIFswLCA1XVxuICAgICAgICAgIFswLCAxM11cbiAgICAgICAgXSlcblxuICAgIGRlc2NyaWJlIFwiYWN0aXZhdGUgdmlzdWFsbW9kZSB3aXRpbiB2aXN1YWxtb2RlXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGtleWRvd24oJ2VzY2FwZScpXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5tb2RlKS50b0VxdWFsICdub3JtYWwnXG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgICBpdCBcImFjdGl2YXRlVmlzdWFsTW9kZSB3aXRoIHNhbWUgdHlwZSBwdXRzIHRoZSBlZGl0b3IgaW50byBub3JtYWwgbW9kZVwiLCAtPlxuICAgICAgICBrZXlkb3duKCd2JylcbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXN1YWwtbW9kZScpKS50b0JlKHRydWUpXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5zdWJtb2RlKS50b0VxdWFsICdjaGFyYWN0ZXJ3aXNlJ1xuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUoZmFsc2UpXG5cbiAgICAgICAga2V5ZG93bigndicpXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5tb2RlKS50b0VxdWFsICdub3JtYWwnXG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgICAgIGtleWRvd24oJ1YnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXN1YWwtbW9kZScpKS50b0JlKHRydWUpXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5zdWJtb2RlKS50b0VxdWFsICdsaW5ld2lzZSdcbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKGZhbHNlKVxuXG4gICAgICAgIGtleWRvd24oJ1YnLCBzaGlmdDogdHJ1ZSlcbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLm1vZGUpLnRvRXF1YWwgJ25vcm1hbCdcbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICAgICAga2V5ZG93bigndicsIGN0cmw6IHRydWUpXG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygndmlzdWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuICAgICAgICBleHBlY3QodmltU3RhdGUuc3VibW9kZSkudG9FcXVhbCAnYmxvY2t3aXNlJ1xuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUoZmFsc2UpXG5cbiAgICAgICAga2V5ZG93bigndicsIGN0cmw6IHRydWUpXG4gICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5tb2RlKS50b0VxdWFsICdub3JtYWwnXG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgICBkZXNjcmliZSBcImNoYW5nZSBzdWJtb2RlIHdpdGhpbiB2aXN1YWxtb2RlXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChcImxpbmUgb25lXFxubGluZSB0d29cXG5saW5lIHRocmVlXFxuXCIpXG4gICAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCA1XSlcbiAgICAgICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbihbMiwgNV0pXG5cbiAgICAgICAgaXQgXCJjYW4gY2hhbmdlIHN1Ym1vZGUgd2l0aGluIHZpc3VhbCBtb2RlXCIsIC0+XG4gICAgICAgICAga2V5ZG93bigndicpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXN1YWwtbW9kZScpKS50b0JlKHRydWUpXG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLnN1Ym1vZGUpLnRvRXF1YWwgJ2NoYXJhY3Rlcndpc2UnXG4gICAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKGZhbHNlKVxuXG4gICAgICAgICAga2V5ZG93bignVicsIHNoaWZ0OiB0cnVlKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygndmlzdWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5zdWJtb2RlKS50b0VxdWFsICdsaW5ld2lzZSdcbiAgICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUoZmFsc2UpXG5cbiAgICAgICAgICBrZXlkb3duKCd2JywgY3RybDogdHJ1ZSlcbiAgICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc3VhbC1tb2RlJykpLnRvQmUodHJ1ZSlcbiAgICAgICAgICBleHBlY3QodmltU3RhdGUuc3VibW9kZSkudG9FcXVhbCAnYmxvY2t3aXNlJ1xuICAgICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZShmYWxzZSlcblxuICAgICAgICAgIGtleWRvd24oJ3YnKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygndmlzdWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuICAgICAgICAgIGV4cGVjdCh2aW1TdGF0ZS5zdWJtb2RlKS50b0VxdWFsICdjaGFyYWN0ZXJ3aXNlJ1xuICAgICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZShmYWxzZSlcblxuXG4gICAgICAgIGl0IFwicmVjb3ZlciBvcmlnaW5hbCByYW5nZSB3aGVuIHNoaWZ0IGZyb20gbGluZXdzZSB0byBjaGFyYWN0ZXJ3aXNlXCIsIC0+XG4gICAgICAgICAga2V5ZG93bigndicpXG4gICAgICAgICAga2V5ZG93bignaScpXG4gICAgICAgICAga2V5ZG93bigndycpXG5cbiAgICAgICAgICBleHBlY3QoXy5tYXAoZWRpdG9yLmdldFNlbGVjdGlvbnMoKSwgKHNlbGVjdGlvbikgLT5cbiAgICAgICAgICAgIHNlbGVjdGlvbi5nZXRUZXh0KCkpXG4gICAgICAgICAgKS50b0VxdWFsKFsnb25lJywgJ3RocmVlJ10pXG5cbiAgICAgICAgICBrZXlkb3duKCdWJywgc2hpZnQ6IHRydWUpXG4gICAgICAgICAgZXhwZWN0KF8ubWFwKGVkaXRvci5nZXRTZWxlY3Rpb25zKCksIChzZWxlY3Rpb24pIC0+XG4gICAgICAgICAgICBzZWxlY3Rpb24uZ2V0VGV4dCgpKVxuICAgICAgICAgICkudG9FcXVhbChbXCJsaW5lIG9uZVxcblwiLCBcImxpbmUgdGhyZWVcXG5cIl0pXG5cbiAgICAgICAgICBrZXlkb3duKCd2JywgY3RybDogdHJ1ZSlcbiAgICAgICAgICBleHBlY3QoXy5tYXAoZWRpdG9yLmdldFNlbGVjdGlvbnMoKSwgKHNlbGVjdGlvbikgLT5cbiAgICAgICAgICAgIHNlbGVjdGlvbi5nZXRUZXh0KCkpXG4gICAgICAgICAgKS50b0VxdWFsKFsnb25lJywgJ3RocmVlJ10pXG5cbiAgZGVzY3JpYmUgXCJtYXJrc1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT4gIGVkaXRvci5zZXRUZXh0KFwidGV4dCBpbiBsaW5lIDFcXG50ZXh0IGluIGxpbmUgMlxcbnRleHQgaW4gbGluZSAzXCIpXG5cbiAgICBpdCBcImJhc2ljIG1hcmtpbmcgZnVuY3Rpb25hbGl0eVwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsxLCAxXSlcbiAgICAgIGtleWRvd24oJ20nKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bigndCcpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9FcXVhbCBcInRleHQgaW4gbGluZSAxXFxudGV4dCBpbiBsaW5lIDJcXG50ZXh0IGluIGxpbmUgM1wiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzIsIDJdKVxuICAgICAga2V5ZG93bignYCcpXG4gICAgICBub3JtYWxNb2RlSW5wdXRLZXlkb3duKCd0JylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMV1cblxuICAgIGl0IFwicmVhbCAodHJhY2tpbmcpIG1hcmtpbmcgZnVuY3Rpb25hbGl0eVwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsyLCAyXSlcbiAgICAgIGtleWRvd24oJ20nKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bigncScpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDJdKVxuICAgICAga2V5ZG93bignbycpXG4gICAgICBrZXlkb3duKCdlc2NhcGUnKVxuICAgICAga2V5ZG93bignYCcpXG4gICAgICBub3JtYWxNb2RlSW5wdXRLZXlkb3duKCdxJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMywgMl1cblxuICAgIGl0IFwicmVhbCAodHJhY2tpbmcpIG1hcmtpbmcgZnVuY3Rpb25hbGl0eVwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFsyLCAyXSlcbiAgICAgIGtleWRvd24oJ20nKVxuICAgICAgbm9ybWFsTW9kZUlucHV0S2V5ZG93bigncScpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzEsIDJdKVxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdkJylcbiAgICAgIGtleWRvd24oJ2VzY2FwZScpXG4gICAgICBrZXlkb3duKCdgJylcbiAgICAgIG5vcm1hbE1vZGVJbnB1dEtleWRvd24oJ3EnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAyXVxuIl19
