(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("TextObjects", function() {
    var editor, editorElement, keydown, ref, vimState;
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
    describe("Text Object commands in normal mode not preceded by an operator", function() {
      beforeEach(function() {
        return vimState.activateNormalMode();
      });
      return it("selects the appropriate text", function() {
        editor.setText("<html> text </html>");
        editor.setCursorScreenPosition([0, 7]);
        atom.commands.dispatch(editorElement, "vim-mode:select-inside-tags");
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 6], [0, 12]]);
      });
    });
    describe("the 'iw' text object", function() {
      beforeEach(function() {
        editor.setText("12345 abcde (ABCDE)");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('w');
        expect(editor.getText()).toBe("12345  (ABCDE)");
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        expect(vimState.getRegister('"').text).toBe("abcde");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("selects inside the current word in visual mode", function() {
        keydown('v');
        keydown('i');
        keydown('w');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 6], [0, 11]]);
      });
      it("expands an existing selection in visual mode", function() {
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('w');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 9], [0, 18]]);
      });
      it("works with multiple cursors", function() {
        editor.addCursorAtBufferPosition([0, 1]);
        keydown("v");
        keydown("i");
        keydown("w");
        return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 6], [0, 11]], [[0, 0], [0, 5]]]);
      });
      return it("doesn't expand to include delimeters", function() {
        editor.setCursorScreenPosition([0, 13]);
        keydown('d');
        keydown('i');
        keydown('w');
        return expect(editor.getText()).toBe("12345 abcde ()");
      });
    });
    describe("the 'iW' text object", function() {
      beforeEach(function() {
        editor.setText("12(45 ab'de ABCDE");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current whole word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('W', {
          shift: true
        });
        expect(editor.getText()).toBe("12(45  ABCDE");
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        expect(vimState.getRegister('"').text).toBe("ab'de");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("selects inside the current whole word in visual mode", function() {
        keydown('v');
        keydown('i');
        keydown('W', {
          shift: true
        });
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 6], [0, 11]]);
      });
      return it("expands an existing selection in visual mode", function() {
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('W', {
          shift: true
        });
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 9], [0, 17]]);
      });
    });
    describe("the 'i(' text object", function() {
      beforeEach(function() {
        editor.setText("( something in here and in (here) )");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('(');
        expect(editor.getText()).toBe("()");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators inside the current word in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('(');
        expect(editor.getText()).toBe("( something in here and in () )");
        expect(editor.getCursorScreenPosition()).toEqual([0, 28]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("works with multiple cursors", function() {
        editor.setText("( a b ) cde ( f g h ) ijk");
        editor.setCursorBufferPosition([0, 2]);
        editor.addCursorAtBufferPosition([0, 18]);
        keydown("v");
        keydown("i");
        keydown("(");
        return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 1], [0, 6]], [[0, 13], [0, 20]]]);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('(');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 32]]);
      });
    });
    describe("the 'i{' text object", function() {
      beforeEach(function() {
        editor.setText("{ something in here and in {here} }");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('{');
        expect(editor.getText()).toBe("{}");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators inside the current word in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('{');
        expect(editor.getText()).toBe("{ something in here and in {} }");
        expect(editor.getCursorScreenPosition()).toEqual([0, 28]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('{');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 32]]);
      });
    });
    describe("the 'i<' text object", function() {
      beforeEach(function() {
        editor.setText("< something in here and in <here> >");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('<');
        expect(editor.getText()).toBe("<>");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators inside the current word in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('<');
        expect(editor.getText()).toBe("< something in here and in <> >");
        expect(editor.getCursorScreenPosition()).toEqual([0, 28]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('<');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 32]]);
      });
    });
    describe("the 'it' text object", function() {
      beforeEach(function() {
        editor.setText("<something>here</something><again>");
        return editor.setCursorScreenPosition([0, 5]);
      });
      it("applies only if in the value of a tag", function() {
        keydown('d');
        keydown('i');
        keydown('t');
        expect(editor.getText()).toBe("<something>here</something><again>");
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        editor.setCursorScreenPosition([0, 13]);
        keydown('d');
        keydown('i');
        keydown('t');
        expect(editor.getText()).toBe("<something></something><again>");
        expect(editor.getCursorScreenPosition()).toEqual([0, 11]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 7]);
        keydown('v');
        keydown('6');
        keydown('l');
        keydown('i');
        keydown('t');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 7], [0, 15]]);
      });
    });
    describe("the 'ip' text object", function() {
      beforeEach(function() {
        editor.setText("\nParagraph-1\nParagraph-1\nParagraph-1\n\n");
        return editor.setCursorBufferPosition([2, 2]);
      });
      it("applies operators inside the current paragraph in operator-pending mode", function() {
        keydown('y');
        keydown('i');
        keydown('p');
        expect(editor.getText()).toBe("\nParagraph-1\nParagraph-1\nParagraph-1\n\n");
        expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
        expect(vimState.getRegister('"').text).toBe("Paragraph-1\nParagraph-1\nParagraph-1\n");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("selects inside the current paragraph in visual mode", function() {
        keydown('v');
        keydown('i');
        keydown('p');
        return expect(editor.getSelectedScreenRange()).toEqual([[1, 0], [4, 0]]);
      });
      it("selects between paragraphs in visual mode if invoked on a empty line", function() {
        editor.setText("text\n\n\n\ntext\n");
        editor.setCursorBufferPosition([1, 0]);
        keydown('v');
        keydown('i');
        keydown('p');
        return expect(editor.getSelectedScreenRange()).toEqual([[1, 0], [4, 0]]);
      });
      it("selects all the lines", function() {
        editor.setText("text\ntext\ntext\n");
        editor.setCursorBufferPosition([0, 0]);
        keydown('v');
        keydown('i');
        keydown('p');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 0], [3, 0]]);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setText("\nParagraph-1\nParagraph-1\nParagraph-1\n\n\nParagraph-2\nParagraph-2\nParagraph-2\n");
        editor.setCursorBufferPosition([2, 2]);
        keydown('v');
        keydown('i');
        keydown('p');
        keydown('j');
        keydown('j');
        keydown('j');
        keydown('i');
        keydown('p');
        return expect(editor.getSelectedScreenRange()).toEqual([[1, 0], [9, 0]]);
      });
    });
    describe("the 'ap' text object", function() {
      beforeEach(function() {
        editor.setText("text\n\nParagraph-1\nParagraph-1\nParagraph-1\n\n\nmoretext");
        return editor.setCursorScreenPosition([3, 2]);
      });
      it("applies operators around the current paragraph in operator-pending mode", function() {
        keydown('y');
        keydown('a');
        keydown('p');
        expect(editor.getText()).toBe("text\n\nParagraph-1\nParagraph-1\nParagraph-1\n\n\nmoretext");
        expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        expect(vimState.getRegister('"').text).toBe("Paragraph-1\nParagraph-1\nParagraph-1\n\n\n");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("selects around the current paragraph in visual mode", function() {
        keydown('v');
        keydown('a');
        keydown('p');
        return expect(editor.getSelectedScreenRange()).toEqual([[2, 0], [7, 0]]);
      });
      it("applies operators around the next paragraph in operator-pending mode when started from a blank/only-whitespace line", function() {
        editor.setText("text\n\n\n\nParagraph-1\nParagraph-1\nParagraph-1\n\n\nmoretext");
        editor.setCursorBufferPosition([1, 0]);
        keydown('y');
        keydown('a');
        keydown('p');
        expect(editor.getText()).toBe("text\n\n\n\nParagraph-1\nParagraph-1\nParagraph-1\n\n\nmoretext");
        expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
        expect(vimState.getRegister('"').text).toBe("\n\n\nParagraph-1\nParagraph-1\nParagraph-1\n");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("selects around the next paragraph in visual mode when started from a blank/only-whitespace line", function() {
        editor.setText("text\n\n\n\nparagraph-1\nparagraph-1\nparagraph-1\n\n\nmoretext");
        editor.setCursorBufferPosition([1, 0]);
        keydown('v');
        keydown('a');
        keydown('p');
        return expect(editor.getSelectedScreenRange()).toEqual([[1, 0], [7, 0]]);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setText("text\n\n\n\nparagraph-1\nparagraph-1\nparagraph-1\n\n\n\nparagraph-2\nparagraph-2\nparagraph-2\n\n\nmoretext");
        editor.setCursorBufferPosition([5, 0]);
        keydown('v');
        keydown('a');
        keydown('p');
        keydown('j');
        keydown('j');
        keydown('j');
        keydown('i');
        keydown('p');
        return expect(editor.getSelectedScreenRange()).toEqual([[4, 0], [13, 0]]);
      });
    });
    describe("the 'i[' text object", function() {
      beforeEach(function() {
        editor.setText("[ something in here and in [here] ]");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('[');
        expect(editor.getText()).toBe("[]");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators inside the current word in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('[');
        expect(editor.getText()).toBe("[ something in here and in [] ]");
        expect(editor.getCursorScreenPosition()).toEqual([0, 28]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('[');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 32]]);
      });
    });
    describe("the 'i\'' text object", function() {
      beforeEach(function() {
        editor.setText("' something in here and in 'here' ' and over here");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current string in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('\'');
        expect(editor.getText()).toBe("''here' ' and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators inside the next string in operator-pending mode (if not in a string)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('\'');
        expect(editor.getText()).toBe("' something in here and in 'here'' and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 33]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("makes no change if past the last string on a line", function() {
        editor.setCursorScreenPosition([0, 39]);
        keydown('d');
        keydown('i');
        keydown('\'');
        expect(editor.getText()).toBe("' something in here and in 'here' ' and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 39]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('\'');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 34]]);
      });
    });
    describe("the 'i\"' text object", function() {
      beforeEach(function() {
        editor.setText("\" something in here and in \"here\" \" and over here");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current string in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('"');
        expect(editor.getText()).toBe("\"\"here\" \" and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators inside the next string in operator-pending mode (if not in a string)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('"');
        expect(editor.getText()).toBe("\" something in here and in \"here\"\" and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 33]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("makes no change if past the last string on a line", function() {
        editor.setCursorScreenPosition([0, 39]);
        keydown('d');
        keydown('i');
        keydown('"');
        expect(editor.getText()).toBe("\" something in here and in \"here\" \" and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 39]);
        return expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('"');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 34]]);
      });
    });
    describe("the 'aw' text object", function() {
      beforeEach(function() {
        editor.setText("12345 abcde ABCDE");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators from the start of the current word to the start of the next word in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('w');
        expect(editor.getText()).toBe("12345 ABCDE");
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        expect(vimState.getRegister('"').text).toBe("abcde ");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("selects from the start of the current word to the start of the next word in visual mode", function() {
        keydown('v');
        keydown('a');
        keydown('w');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 6], [0, 12]]);
      });
      it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 2]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('w');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 2], [0, 12]]);
      });
      it("doesn't span newlines", function() {
        editor.setText("12345\nabcde ABCDE");
        editor.setCursorBufferPosition([0, 3]);
        keydown("v");
        keydown("a");
        keydown("w");
        return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 0], [0, 5]]]);
      });
      return it("doesn't span special characters", function() {
        editor.setText("1(345\nabcde ABCDE");
        editor.setCursorBufferPosition([0, 3]);
        keydown("v");
        keydown("a");
        keydown("w");
        return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 2], [0, 5]]]);
      });
    });
    describe("the 'aW' text object", function() {
      beforeEach(function() {
        editor.setText("12(45 ab'de ABCDE");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators from the start of the current whole word to the start of the next whole word in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('W', {
          shift: true
        });
        expect(editor.getText()).toBe("12(45 ABCDE");
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        expect(vimState.getRegister('"').text).toBe("ab'de ");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("selects from the start of the current whole word to the start of the next whole word in visual mode", function() {
        keydown('v');
        keydown('a');
        keydown('W', {
          shift: true
        });
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 6], [0, 12]]);
      });
      it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 2]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('W', {
          shift: true
        });
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 2], [0, 12]]);
      });
      return it("doesn't span newlines", function() {
        editor.setText("12(45\nab'de ABCDE");
        editor.setCursorBufferPosition([0, 4]);
        keydown('v');
        keydown('a');
        keydown('W', {
          shift: true
        });
        return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 0], [0, 5]]]);
      });
    });
    describe("the 'a(' text object", function() {
      beforeEach(function() {
        editor.setText("( something in here and in (here) )");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current parentheses in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('(');
        expect(editor.getText()).toBe("");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators around the current parentheses in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('(');
        expect(editor.getText()).toBe("( something in here and in  )");
        expect(editor.getCursorScreenPosition()).toEqual([0, 27]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('(');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 33]]);
      });
    });
    describe("the 'a{' text object", function() {
      beforeEach(function() {
        editor.setText("{ something in here and in {here} }");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current curly brackets in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('{');
        expect(editor.getText()).toBe("");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators around the current curly brackets in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('{');
        expect(editor.getText()).toBe("{ something in here and in  }");
        expect(editor.getCursorScreenPosition()).toEqual([0, 27]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('{');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 33]]);
      });
    });
    describe("the 'a<' text object", function() {
      beforeEach(function() {
        editor.setText("< something in here and in <here> >");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current angle brackets in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('<');
        expect(editor.getText()).toBe("");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators around the current angle brackets in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('<');
        expect(editor.getText()).toBe("< something in here and in  >");
        expect(editor.getCursorScreenPosition()).toEqual([0, 27]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('<');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 33]]);
      });
    });
    describe("the 'a[' text object", function() {
      beforeEach(function() {
        editor.setText("[ something in here and in [here] ]");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current square brackets in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('[');
        expect(editor.getText()).toBe("");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators around the current square brackets in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('[');
        expect(editor.getText()).toBe("[ something in here and in  ]");
        expect(editor.getCursorScreenPosition()).toEqual([0, 27]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('[');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 33]]);
      });
    });
    describe("the 'a\'' text object", function() {
      beforeEach(function() {
        editor.setText("' something in here and in 'here' '");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current single quotes in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('\'');
        expect(editor.getText()).toBe("here' '");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators around the current single quotes in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('\'');
        expect(editor.getText()).toBe("' something in here and in 'here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 31]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('\'');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 35]]);
      });
    });
    return describe("the 'a\"' text object", function() {
      beforeEach(function() {
        editor.setText("\" something in here and in \"here\" \"");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current double quotes in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('""');
        expect(editor.getText()).toBe('here" "');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators around the current double quotes in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('"');
        expect(editor.getText()).toBe("\" something in here and in \"here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 31]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('"');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 35]]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvdGV4dC1vYmplY3RzLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGVBQVI7O0VBRVYsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQTtBQUN0QixRQUFBO0lBQUEsTUFBb0MsRUFBcEMsRUFBQyxlQUFELEVBQVMsc0JBQVQsRUFBd0I7SUFFeEIsVUFBQSxDQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBZCxDQUEwQixVQUExQjtNQUNWLE9BQU8sQ0FBQyxpQkFBUixDQUFBO2FBRUEsT0FBTyxDQUFDLGdCQUFSLENBQXlCLFNBQUMsT0FBRDtRQUN2QixhQUFBLEdBQWdCO1FBQ2hCLE1BQUEsR0FBUyxhQUFhLENBQUMsUUFBZCxDQUFBO1FBQ1QsUUFBQSxHQUFXLGFBQWEsQ0FBQztRQUN6QixRQUFRLENBQUMsa0JBQVQsQ0FBQTtlQUNBLFFBQVEsQ0FBQyxlQUFULENBQUE7TUFMdUIsQ0FBekI7SUFKUyxDQUFYO0lBV0EsT0FBQSxHQUFVLFNBQUMsR0FBRCxFQUFNLE9BQU47O1FBQU0sVUFBUTs7O1FBQ3RCLE9BQU8sQ0FBQyxVQUFXOzthQUNuQixPQUFPLENBQUMsT0FBUixDQUFnQixHQUFoQixFQUFxQixPQUFyQjtJQUZRO0lBSVYsUUFBQSxDQUFTLGlFQUFULEVBQTRFLFNBQUE7TUFDMUUsVUFBQSxDQUFXLFNBQUE7ZUFDVCxRQUFRLENBQUMsa0JBQVQsQ0FBQTtNQURTLENBQVg7YUFHQSxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQTtRQUNqQyxNQUFNLENBQUMsT0FBUCxDQUFlLHFCQUFmO1FBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7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QyxDQUFELEVBQUksRUFBSixDQUFWLENBQWhEO01BVmlELENBQW5EO0lBeEJnQyxDQUFsQztFQTN4QnNCLENBQXhCO0FBRkEiLCJzb3VyY2VzQ29udGVudCI6WyJoZWxwZXJzID0gcmVxdWlyZSAnLi9zcGVjLWhlbHBlcidcblxuZGVzY3JpYmUgXCJUZXh0T2JqZWN0c1wiLCAtPlxuICBbZWRpdG9yLCBlZGl0b3JFbGVtZW50LCB2aW1TdGF0ZV0gPSBbXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICB2aW1Nb2RlID0gYXRvbS5wYWNrYWdlcy5sb2FkUGFja2FnZSgndmltLW1vZGUnKVxuICAgIHZpbU1vZGUuYWN0aXZhdGVSZXNvdXJjZXMoKVxuXG4gICAgaGVscGVycy5nZXRFZGl0b3JFbGVtZW50IChlbGVtZW50KSAtPlxuICAgICAgZWRpdG9yRWxlbWVudCA9IGVsZW1lbnRcbiAgICAgIGVkaXRvciA9IGVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKVxuICAgICAgdmltU3RhdGUgPSBlZGl0b3JFbGVtZW50LnZpbVN0YXRlXG4gICAgICB2aW1TdGF0ZS5hY3RpdmF0ZU5vcm1hbE1vZGUoKVxuICAgICAgdmltU3RhdGUucmVzZXROb3JtYWxNb2RlKClcblxuICBrZXlkb3duID0gKGtleSwgb3B0aW9ucz17fSkgLT5cbiAgICBvcHRpb25zLmVsZW1lbnQgPz0gZWRpdG9yRWxlbWVudFxuICAgIGhlbHBlcnMua2V5ZG93bihrZXksIG9wdGlvbnMpXG5cbiAgZGVzY3JpYmUgXCJUZXh0IE9iamVjdCBjb21tYW5kcyBpbiBub3JtYWwgbW9kZSBub3QgcHJlY2VkZWQgYnkgYW4gb3BlcmF0b3JcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICB2aW1TdGF0ZS5hY3RpdmF0ZU5vcm1hbE1vZGUoKVxuXG4gICAgaXQgXCJzZWxlY3RzIHRoZSBhcHByb3ByaWF0ZSB0ZXh0XCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIjxodG1sPiB0ZXh0IDwvaHRtbD5cIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgN10pXG4gICAgICAjIFVzZXJzIGNvdWxkIGRpc3BhdGNoIGl0IHZpYSB0aGUgY29tbWFuZCBwYWxldHRlXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvckVsZW1lbnQsIFwidmltLW1vZGU6c2VsZWN0LWluc2lkZS10YWdzXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkU2NyZWVuUmFuZ2UoKSkudG9FcXVhbCBbWzAsIDZdLCBbMCwgMTJdXVxuXG4gIGRlc2NyaWJlIFwidGhlICdpdycgdGV4dCBvYmplY3RcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIjEyMzQ1IGFiY2RlIChBQkNERSlcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgOV0pXG5cbiAgICBpdCBcImFwcGxpZXMgb3BlcmF0b3JzIGluc2lkZSB0aGUgY3VycmVudCB3b3JkIGluIG9wZXJhdG9yLXBlbmRpbmcgbW9kZVwiLCAtPlxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdpJylcbiAgICAgIGtleWRvd24oJ3cnKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjEyMzQ1ICAoQUJDREUpXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNl1cbiAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlIFwiYWJjZGVcIlxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVyYXRvci1wZW5kaW5nLW1vZGUnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJzZWxlY3RzIGluc2lkZSB0aGUgY3VycmVudCB3b3JkIGluIHZpc3VhbCBtb2RlXCIsIC0+XG4gICAgICBrZXlkb3duKCd2JylcbiAgICAgIGtleWRvd24oJ2knKVxuICAgICAga2V5ZG93bigndycpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRTY3JlZW5SYW5nZSgpKS50b0VxdWFsIFtbMCwgNl0sIFswLCAxMV1dXG5cbiAgICBpdCBcImV4cGFuZHMgYW4gZXhpc3Rpbmcgc2VsZWN0aW9uIGluIHZpc3VhbCBtb2RlXCIsIC0+XG4gICAgICBrZXlkb3duKCd2JylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2knKVxuICAgICAga2V5ZG93bigndycpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRTY3JlZW5SYW5nZSgpKS50b0VxdWFsIFtbMCwgOV0sIFswLCAxOF1dXG5cbiAgICBpdCBcIndvcmtzIHdpdGggbXVsdGlwbGUgY3Vyc29yc1wiLCAtPlxuICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24oWzAsIDFdKVxuICAgICAga2V5ZG93bihcInZcIilcbiAgICAgIGtleWRvd24oXCJpXCIpXG4gICAgICBrZXlkb3duKFwid1wiKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpKS50b0VxdWFsIFtcbiAgICAgICAgW1swLCA2XSwgWzAsIDExXV1cbiAgICAgICAgW1swLCAwXSwgWzAsIDVdXVxuICAgICAgXVxuXG4gICAgaXQgXCJkb2Vzbid0IGV4cGFuZCB0byBpbmNsdWRlIGRlbGltZXRlcnNcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMTNdKVxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdpJylcbiAgICAgIGtleWRvd24oJ3cnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMjM0NSBhYmNkZSAoKVwiXG5cbiAgZGVzY3JpYmUgXCJ0aGUgJ2lXJyB0ZXh0IG9iamVjdFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiMTIoNDUgYWInZGUgQUJDREVcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgOV0pXG5cbiAgICBpdCBcImFwcGxpZXMgb3BlcmF0b3JzIGluc2lkZSB0aGUgY3VycmVudCB3aG9sZSB3b3JkIGluIG9wZXJhdG9yLXBlbmRpbmcgbW9kZVwiLCAtPlxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdpJylcbiAgICAgIGtleWRvd24oJ1cnLCBzaGlmdDogdHJ1ZSlcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMig0NSAgQUJDREVcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA2XVxuICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgXCJhYidkZVwiXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ29wZXJhdG9yLXBlbmRpbmctbW9kZScpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcInNlbGVjdHMgaW5zaWRlIHRoZSBjdXJyZW50IHdob2xlIHdvcmQgaW4gdmlzdWFsIG1vZGVcIiwgLT5cbiAgICAgIGtleWRvd24oJ3YnKVxuICAgICAga2V5ZG93bignaScpXG4gICAgICBrZXlkb3duKCdXJywgc2hpZnQ6IHRydWUpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRTY3JlZW5SYW5nZSgpKS50b0VxdWFsIFtbMCwgNl0sIFswLCAxMV1dXG5cbiAgICBpdCBcImV4cGFuZHMgYW4gZXhpc3Rpbmcgc2VsZWN0aW9uIGluIHZpc3VhbCBtb2RlXCIsIC0+XG4gICAgICBrZXlkb3duKCd2JylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2knKVxuICAgICAga2V5ZG93bignVycsIHNoaWZ0OiB0cnVlKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkU2NyZWVuUmFuZ2UoKSkudG9FcXVhbCBbWzAsIDldLCBbMCwgMTddXVxuXG4gIGRlc2NyaWJlIFwidGhlICdpKCcgdGV4dCBvYmplY3RcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIiggc29tZXRoaW5nIGluIGhlcmUgYW5kIGluIChoZXJlKSApXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDldKVxuXG4gICAgaXQgXCJhcHBsaWVzIG9wZXJhdG9ycyBpbnNpZGUgdGhlIGN1cnJlbnQgd29yZCBpbiBvcGVyYXRvci1wZW5kaW5nIG1vZGVcIiwgLT5cbiAgICAgIGtleWRvd24oJ2QnKVxuICAgICAga2V5ZG93bignaScpXG4gICAgICBrZXlkb3duKCcoJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiKClcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAxXVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVyYXRvci1wZW5kaW5nLW1vZGUnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJhcHBsaWVzIG9wZXJhdG9ycyBpbnNpZGUgdGhlIGN1cnJlbnQgd29yZCBpbiBvcGVyYXRvci1wZW5kaW5nIG1vZGUgKHNlY29uZCB0ZXN0KVwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAyOV0pXG4gICAgICBrZXlkb3duKCdkJylcbiAgICAgIGtleWRvd24oJ2knKVxuICAgICAga2V5ZG93bignKCcpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIiggc29tZXRoaW5nIGluIGhlcmUgYW5kIGluICgpIClcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyOF1cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwid29ya3Mgd2l0aCBtdWx0aXBsZSBjdXJzb3JzXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIiggYSBiICkgY2RlICggZiBnIGggKSBpamtcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMl0pXG4gICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbihbMCwgMThdKVxuXG4gICAgICBrZXlkb3duKFwidlwiKVxuICAgICAga2V5ZG93bihcImlcIilcbiAgICAgIGtleWRvd24oXCIoXCIpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKSkudG9FcXVhbCBbXG4gICAgICAgIFtbMCwgMV0sICBbMCwgNl1dXG4gICAgICAgIFtbMCwgMTNdLCBbMCwgMjBdXVxuICAgICAgXVxuXG4gICAgaXQgXCJleHBhbmRzIGFuIGV4aXN0aW5nIHNlbGVjdGlvbiBpbiB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAyNV0pXG4gICAgICBrZXlkb3duKCd2JylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignaScpXG4gICAgICBrZXlkb3duKCcoJylcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFNjcmVlblJhbmdlKCkpLnRvRXF1YWwgW1swLCAyNV0sIFswLCAzMl1dXG5cbiAgZGVzY3JpYmUgXCJ0aGUgJ2l7JyB0ZXh0IG9iamVjdFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwieyBzb21ldGhpbmcgaW4gaGVyZSBhbmQgaW4ge2hlcmV9IH1cIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgOV0pXG5cbiAgICBpdCBcImFwcGxpZXMgb3BlcmF0b3JzIGluc2lkZSB0aGUgY3VycmVudCB3b3JkIGluIG9wZXJhdG9yLXBlbmRpbmcgbW9kZVwiLCAtPlxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdpJylcbiAgICAgIGtleWRvd24oJ3snKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJ7fVwiXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDFdXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ29wZXJhdG9yLXBlbmRpbmctbW9kZScpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImFwcGxpZXMgb3BlcmF0b3JzIGluc2lkZSB0aGUgY3VycmVudCB3b3JkIGluIG9wZXJhdG9yLXBlbmRpbmcgbW9kZSAoc2Vjb25kIHRlc3QpXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDI5XSlcbiAgICAgIGtleWRvd24oJ2QnKVxuICAgICAga2V5ZG93bignaScpXG4gICAgICBrZXlkb3duKCd7JylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwieyBzb21ldGhpbmcgaW4gaGVyZSBhbmQgaW4ge30gfVwiXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDI4XVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVyYXRvci1wZW5kaW5nLW1vZGUnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJleHBhbmRzIGFuIGV4aXN0aW5nIHNlbGVjdGlvbiBpbiB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAyNV0pXG4gICAgICBrZXlkb3duKCd2JylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignaScpXG4gICAgICBrZXlkb3duKCd7JylcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFNjcmVlblJhbmdlKCkpLnRvRXF1YWwgW1swLCAyNV0sIFswLCAzMl1dXG5cbiAgZGVzY3JpYmUgXCJ0aGUgJ2k8JyB0ZXh0IG9iamVjdFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiPCBzb21ldGhpbmcgaW4gaGVyZSBhbmQgaW4gPGhlcmU+ID5cIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgOV0pXG5cbiAgICBpdCBcImFwcGxpZXMgb3BlcmF0b3JzIGluc2lkZSB0aGUgY3VycmVudCB3b3JkIGluIG9wZXJhdG9yLXBlbmRpbmcgbW9kZVwiLCAtPlxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdpJylcbiAgICAgIGtleWRvd24oJzwnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCI8PlwiXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDFdXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ29wZXJhdG9yLXBlbmRpbmctbW9kZScpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImFwcGxpZXMgb3BlcmF0b3JzIGluc2lkZSB0aGUgY3VycmVudCB3b3JkIGluIG9wZXJhdG9yLXBlbmRpbmcgbW9kZSAoc2Vjb25kIHRlc3QpXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDI5XSlcbiAgICAgIGtleWRvd24oJ2QnKVxuICAgICAga2V5ZG93bignaScpXG4gICAgICBrZXlkb3duKCc8JylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiPCBzb21ldGhpbmcgaW4gaGVyZSBhbmQgaW4gPD4gPlwiXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDI4XVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVyYXRvci1wZW5kaW5nLW1vZGUnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJleHBhbmRzIGFuIGV4aXN0aW5nIHNlbGVjdGlvbiBpbiB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAyNV0pXG4gICAgICBrZXlkb3duKCd2JylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignaScpXG4gICAgICBrZXlkb3duKCc8JylcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFNjcmVlblJhbmdlKCkpLnRvRXF1YWwgW1swLCAyNV0sIFswLCAzMl1dXG5cbiAgZGVzY3JpYmUgXCJ0aGUgJ2l0JyB0ZXh0IG9iamVjdFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiPHNvbWV0aGluZz5oZXJlPC9zb21ldGhpbmc+PGFnYWluPlwiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCA1XSlcblxuICAgIGl0IFwiYXBwbGllcyBvbmx5IGlmIGluIHRoZSB2YWx1ZSBvZiBhIHRhZ1wiLCAtPlxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdpJylcbiAgICAgIGtleWRvd24oJ3QnKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCI8c29tZXRoaW5nPmhlcmU8L3NvbWV0aGluZz48YWdhaW4+XCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgNV1cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiYXBwbGllcyBvcGVyYXRvcnMgaW5zaWRlIHRoZSBjdXJyZW50IHdvcmQgaW4gb3BlcmF0b3ItcGVuZGluZyBtb2RlXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDEzXSlcbiAgICAgIGtleWRvd24oJ2QnKVxuICAgICAga2V5ZG93bignaScpXG4gICAgICBrZXlkb3duKCd0JylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiPHNvbWV0aGluZz48L3NvbWV0aGluZz48YWdhaW4+XCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMTFdXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ29wZXJhdG9yLXBlbmRpbmctbW9kZScpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImV4cGFuZHMgYW4gZXhpc3Rpbmcgc2VsZWN0aW9uIGluIHZpc3VhbCBtb2RlXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDddKVxuICAgICAga2V5ZG93bigndicpXG4gICAgICBrZXlkb3duKCc2JylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignaScpXG4gICAgICBrZXlkb3duKCd0JylcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFNjcmVlblJhbmdlKCkpLnRvRXF1YWwgW1swLCA3XSwgWzAsIDE1XV1cblxuICBkZXNjcmliZSBcInRoZSAnaXAnIHRleHQgb2JqZWN0XCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJcXG5QYXJhZ3JhcGgtMVxcblBhcmFncmFwaC0xXFxuUGFyYWdyYXBoLTFcXG5cXG5cIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMiwgMl0pXG5cbiAgICBpdCBcImFwcGxpZXMgb3BlcmF0b3JzIGluc2lkZSB0aGUgY3VycmVudCBwYXJhZ3JhcGggaW4gb3BlcmF0b3ItcGVuZGluZyBtb2RlXCIsIC0+XG4gICAgICBrZXlkb3duKCd5JylcbiAgICAgIGtleWRvd24oJ2knKVxuICAgICAga2V5ZG93bigncCcpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXFxuUGFyYWdyYXBoLTFcXG5QYXJhZ3JhcGgtMVxcblBhcmFncmFwaC0xXFxuXFxuXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMSwgMF1cbiAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlIFwiUGFyYWdyYXBoLTFcXG5QYXJhZ3JhcGgtMVxcblBhcmFncmFwaC0xXFxuXCJcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwic2VsZWN0cyBpbnNpZGUgdGhlIGN1cnJlbnQgcGFyYWdyYXBoIGluIHZpc3VhbCBtb2RlXCIsIC0+XG4gICAgICBrZXlkb3duKCd2JylcbiAgICAgIGtleWRvd24oJ2knKVxuICAgICAga2V5ZG93bigncCcpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRTY3JlZW5SYW5nZSgpKS50b0VxdWFsIFtbMSwgMF0sIFs0LCAwXV1cblxuICAgIGl0IFwic2VsZWN0cyBiZXR3ZWVuIHBhcmFncmFwaHMgaW4gdmlzdWFsIG1vZGUgaWYgaW52b2tlZCBvbiBhIGVtcHR5IGxpbmVcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwidGV4dFxcblxcblxcblxcbnRleHRcXG5cIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMSwgMF0pXG5cbiAgICAgIGtleWRvd24oJ3YnKVxuICAgICAga2V5ZG93bignaScpXG4gICAgICBrZXlkb3duKCdwJylcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFNjcmVlblJhbmdlKCkpLnRvRXF1YWwgW1sxLCAwXSwgWzQsIDBdXVxuXG4gICAgaXQgXCJzZWxlY3RzIGFsbCB0aGUgbGluZXNcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwidGV4dFxcbnRleHRcXG50ZXh0XFxuXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBrZXlkb3duKCd2JylcbiAgICAgIGtleWRvd24oJ2knKVxuICAgICAga2V5ZG93bigncCcpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRTY3JlZW5SYW5nZSgpKS50b0VxdWFsIFtbMCwgMF0sIFszLCAwXV1cblxuICAgIGl0IFwiZXhwYW5kcyBhbiBleGlzdGluZyBzZWxlY3Rpb24gaW4gdmlzdWFsIG1vZGVcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiXFxuUGFyYWdyYXBoLTFcXG5QYXJhZ3JhcGgtMVxcblBhcmFncmFwaC0xXFxuXFxuXFxuUGFyYWdyYXBoLTJcXG5QYXJhZ3JhcGgtMlxcblBhcmFncmFwaC0yXFxuXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzIsIDJdKVxuXG4gICAgICBrZXlkb3duKCd2JylcbiAgICAgIGtleWRvd24oJ2knKVxuICAgICAga2V5ZG93bigncCcpXG5cbiAgICAgIGtleWRvd24oJ2onKVxuICAgICAga2V5ZG93bignaicpXG4gICAgICBrZXlkb3duKCdqJylcbiAgICAgIGtleWRvd24oJ2knKVxuICAgICAga2V5ZG93bigncCcpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRTY3JlZW5SYW5nZSgpKS50b0VxdWFsIFtbMSwgMF0sIFs5LCAwXV1cblxuICBkZXNjcmliZSBcInRoZSAnYXAnIHRleHQgb2JqZWN0XCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJ0ZXh0XFxuXFxuUGFyYWdyYXBoLTFcXG5QYXJhZ3JhcGgtMVxcblBhcmFncmFwaC0xXFxuXFxuXFxubW9yZXRleHRcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMywgMl0pXG5cbiAgICBpdCBcImFwcGxpZXMgb3BlcmF0b3JzIGFyb3VuZCB0aGUgY3VycmVudCBwYXJhZ3JhcGggaW4gb3BlcmF0b3ItcGVuZGluZyBtb2RlXCIsIC0+XG4gICAgICBrZXlkb3duKCd5JylcbiAgICAgIGtleWRvd24oJ2EnKVxuICAgICAga2V5ZG93bigncCcpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwidGV4dFxcblxcblBhcmFncmFwaC0xXFxuUGFyYWdyYXBoLTFcXG5QYXJhZ3JhcGgtMVxcblxcblxcbm1vcmV0ZXh0XCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMiwgMF1cbiAgICAgIGV4cGVjdCh2aW1TdGF0ZS5nZXRSZWdpc3RlcignXCInKS50ZXh0KS50b0JlIFwiUGFyYWdyYXBoLTFcXG5QYXJhZ3JhcGgtMVxcblBhcmFncmFwaC0xXFxuXFxuXFxuXCJcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwic2VsZWN0cyBhcm91bmQgdGhlIGN1cnJlbnQgcGFyYWdyYXBoIGluIHZpc3VhbCBtb2RlXCIsIC0+XG4gICAgICBrZXlkb3duKCd2JylcbiAgICAgIGtleWRvd24oJ2EnKVxuICAgICAga2V5ZG93bigncCcpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRTY3JlZW5SYW5nZSgpKS50b0VxdWFsIFtbMiwgMF0sIFs3LCAwXV1cblxuICAgIGl0IFwiYXBwbGllcyBvcGVyYXRvcnMgYXJvdW5kIHRoZSBuZXh0IHBhcmFncmFwaCBpbiBvcGVyYXRvci1wZW5kaW5nIG1vZGUgd2hlbiBzdGFydGVkIGZyb20gYSBibGFuay9vbmx5LXdoaXRlc3BhY2UgbGluZVwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJ0ZXh0XFxuXFxuXFxuXFxuUGFyYWdyYXBoLTFcXG5QYXJhZ3JhcGgtMVxcblBhcmFncmFwaC0xXFxuXFxuXFxubW9yZXRleHRcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMSwgMF0pXG5cbiAgICAgIGtleWRvd24oJ3knKVxuICAgICAga2V5ZG93bignYScpXG4gICAgICBrZXlkb3duKCdwJylcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJ0ZXh0XFxuXFxuXFxuXFxuUGFyYWdyYXBoLTFcXG5QYXJhZ3JhcGgtMVxcblBhcmFncmFwaC0xXFxuXFxuXFxubW9yZXRleHRcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFsxLCAwXVxuICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCdcIicpLnRleHQpLnRvQmUgXCJcXG5cXG5cXG5QYXJhZ3JhcGgtMVxcblBhcmFncmFwaC0xXFxuUGFyYWdyYXBoLTFcXG5cIlxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVyYXRvci1wZW5kaW5nLW1vZGUnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJzZWxlY3RzIGFyb3VuZCB0aGUgbmV4dCBwYXJhZ3JhcGggaW4gdmlzdWFsIG1vZGUgd2hlbiBzdGFydGVkIGZyb20gYSBibGFuay9vbmx5LXdoaXRlc3BhY2UgbGluZVwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJ0ZXh0XFxuXFxuXFxuXFxucGFyYWdyYXBoLTFcXG5wYXJhZ3JhcGgtMVxcbnBhcmFncmFwaC0xXFxuXFxuXFxubW9yZXRleHRcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMSwgMF0pXG5cbiAgICAgIGtleWRvd24oJ3YnKVxuICAgICAga2V5ZG93bignYScpXG4gICAgICBrZXlkb3duKCdwJylcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFNjcmVlblJhbmdlKCkpLnRvRXF1YWwgW1sxLCAwXSwgWzcsIDBdXVxuXG4gICAgaXQgXCJleHBhbmRzIGFuIGV4aXN0aW5nIHNlbGVjdGlvbiBpbiB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJ0ZXh0XFxuXFxuXFxuXFxucGFyYWdyYXBoLTFcXG5wYXJhZ3JhcGgtMVxcbnBhcmFncmFwaC0xXFxuXFxuXFxuXFxucGFyYWdyYXBoLTJcXG5wYXJhZ3JhcGgtMlxcbnBhcmFncmFwaC0yXFxuXFxuXFxubW9yZXRleHRcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbNSwgMF0pXG5cbiAgICAgIGtleWRvd24oJ3YnKVxuICAgICAga2V5ZG93bignYScpXG4gICAgICBrZXlkb3duKCdwJylcblxuICAgICAga2V5ZG93bignaicpXG4gICAgICBrZXlkb3duKCdqJylcbiAgICAgIGtleWRvd24oJ2onKVxuICAgICAga2V5ZG93bignaScpXG4gICAgICBrZXlkb3duKCdwJylcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFNjcmVlblJhbmdlKCkpLnRvRXF1YWwgW1s0LCAwXSwgWzEzLCAwXV1cblxuICBkZXNjcmliZSBcInRoZSAnaVsnIHRleHQgb2JqZWN0XCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJbIHNvbWV0aGluZyBpbiBoZXJlIGFuZCBpbiBbaGVyZV0gXVwiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCA5XSlcblxuICAgIGl0IFwiYXBwbGllcyBvcGVyYXRvcnMgaW5zaWRlIHRoZSBjdXJyZW50IHdvcmQgaW4gb3BlcmF0b3ItcGVuZGluZyBtb2RlXCIsIC0+XG4gICAgICBrZXlkb3duKCdkJylcbiAgICAgIGtleWRvd24oJ2knKVxuICAgICAga2V5ZG93bignWycpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIltdXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMV1cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiYXBwbGllcyBvcGVyYXRvcnMgaW5zaWRlIHRoZSBjdXJyZW50IHdvcmQgaW4gb3BlcmF0b3ItcGVuZGluZyBtb2RlIChzZWNvbmQgdGVzdClcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMjldKVxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdpJylcbiAgICAgIGtleWRvd24oJ1snKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJbIHNvbWV0aGluZyBpbiBoZXJlIGFuZCBpbiBbXSBdXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMjhdXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ29wZXJhdG9yLXBlbmRpbmctbW9kZScpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImV4cGFuZHMgYW4gZXhpc3Rpbmcgc2VsZWN0aW9uIGluIHZpc3VhbCBtb2RlXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDI1XSlcbiAgICAgIGtleWRvd24oJ3YnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdpJylcbiAgICAgIGtleWRvd24oJ1snKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkU2NyZWVuUmFuZ2UoKSkudG9FcXVhbCBbWzAsIDI1XSwgWzAsIDMyXV1cblxuICBkZXNjcmliZSBcInRoZSAnaVxcJycgdGV4dCBvYmplY3RcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIicgc29tZXRoaW5nIGluIGhlcmUgYW5kIGluICdoZXJlJyAnIGFuZCBvdmVyIGhlcmVcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgOV0pXG5cbiAgICBpdCBcImFwcGxpZXMgb3BlcmF0b3JzIGluc2lkZSB0aGUgY3VycmVudCBzdHJpbmcgaW4gb3BlcmF0b3ItcGVuZGluZyBtb2RlXCIsIC0+XG4gICAgICBrZXlkb3duKCdkJylcbiAgICAgIGtleWRvd24oJ2knKVxuICAgICAga2V5ZG93bignXFwnJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiJydoZXJlJyAnIGFuZCBvdmVyIGhlcmVcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAxXVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVyYXRvci1wZW5kaW5nLW1vZGUnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJhcHBsaWVzIG9wZXJhdG9ycyBpbnNpZGUgdGhlIG5leHQgc3RyaW5nIGluIG9wZXJhdG9yLXBlbmRpbmcgbW9kZSAoaWYgbm90IGluIGEgc3RyaW5nKVwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAyOV0pXG4gICAgICBrZXlkb3duKCdkJylcbiAgICAgIGtleWRvd24oJ2knKVxuICAgICAga2V5ZG93bignXFwnJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiJyBzb21ldGhpbmcgaW4gaGVyZSBhbmQgaW4gJ2hlcmUnJyBhbmQgb3ZlciBoZXJlXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMzNdXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ29wZXJhdG9yLXBlbmRpbmctbW9kZScpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcIm1ha2VzIG5vIGNoYW5nZSBpZiBwYXN0IHRoZSBsYXN0IHN0cmluZyBvbiBhIGxpbmVcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMzldKVxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdpJylcbiAgICAgIGtleWRvd24oJ1xcJycpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIicgc29tZXRoaW5nIGluIGhlcmUgYW5kIGluICdoZXJlJyAnIGFuZCBvdmVyIGhlcmVcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAzOV1cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiZXhwYW5kcyBhbiBleGlzdGluZyBzZWxlY3Rpb24gaW4gdmlzdWFsIG1vZGVcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMjVdKVxuICAgICAga2V5ZG93bigndicpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2knKVxuICAgICAga2V5ZG93bignXFwnJylcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFNjcmVlblJhbmdlKCkpLnRvRXF1YWwgW1swLCAyNV0sIFswLCAzNF1dXG5cbiAgZGVzY3JpYmUgXCJ0aGUgJ2lcXFwiJyB0ZXh0IG9iamVjdFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiXFxcIiBzb21ldGhpbmcgaW4gaGVyZSBhbmQgaW4gXFxcImhlcmVcXFwiIFxcXCIgYW5kIG92ZXIgaGVyZVwiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCA5XSlcblxuICAgIGl0IFwiYXBwbGllcyBvcGVyYXRvcnMgaW5zaWRlIHRoZSBjdXJyZW50IHN0cmluZyBpbiBvcGVyYXRvci1wZW5kaW5nIG1vZGVcIiwgLT5cbiAgICAgIGtleWRvd24oJ2QnKVxuICAgICAga2V5ZG93bignaScpXG4gICAgICBrZXlkb3duKCdcIicpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlxcXCJcXFwiaGVyZVxcXCIgXFxcIiBhbmQgb3ZlciBoZXJlXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMV1cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiYXBwbGllcyBvcGVyYXRvcnMgaW5zaWRlIHRoZSBuZXh0IHN0cmluZyBpbiBvcGVyYXRvci1wZW5kaW5nIG1vZGUgKGlmIG5vdCBpbiBhIHN0cmluZylcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMjldKVxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdpJylcbiAgICAgIGtleWRvd24oJ1wiJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXFxcIiBzb21ldGhpbmcgaW4gaGVyZSBhbmQgaW4gXFxcImhlcmVcXFwiXFxcIiBhbmQgb3ZlciBoZXJlXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMzNdXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ29wZXJhdG9yLXBlbmRpbmctbW9kZScpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcIm1ha2VzIG5vIGNoYW5nZSBpZiBwYXN0IHRoZSBsYXN0IHN0cmluZyBvbiBhIGxpbmVcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMzldKVxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdpJylcbiAgICAgIGtleWRvd24oJ1wiJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXFxcIiBzb21ldGhpbmcgaW4gaGVyZSBhbmQgaW4gXFxcImhlcmVcXFwiIFxcXCIgYW5kIG92ZXIgaGVyZVwiXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDM5XVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVyYXRvci1wZW5kaW5nLW1vZGUnKSkudG9CZShmYWxzZSlcblxuICAgIGl0IFwiZXhwYW5kcyBhbiBleGlzdGluZyBzZWxlY3Rpb24gaW4gdmlzdWFsIG1vZGVcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMjVdKVxuICAgICAga2V5ZG93bigndicpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2knKVxuICAgICAga2V5ZG93bignXCInKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkU2NyZWVuUmFuZ2UoKSkudG9FcXVhbCBbWzAsIDI1XSwgWzAsIDM0XV1cblxuICBkZXNjcmliZSBcInRoZSAnYXcnIHRleHQgb2JqZWN0XCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCIxMjM0NSBhYmNkZSBBQkNERVwiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCA5XSlcblxuICAgIGl0IFwiYXBwbGllcyBvcGVyYXRvcnMgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIGN1cnJlbnQgd29yZCB0byB0aGUgc3RhcnQgb2YgdGhlIG5leHQgd29yZCBpbiBvcGVyYXRvci1wZW5kaW5nIG1vZGVcIiwgLT5cbiAgICAgIGtleWRvd24oJ2QnKVxuICAgICAga2V5ZG93bignYScpXG4gICAgICBrZXlkb3duKCd3JylcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMjM0NSBBQkNERVwiXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDZdXG4gICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSBcImFiY2RlIFwiXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ29wZXJhdG9yLXBlbmRpbmctbW9kZScpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcInNlbGVjdHMgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIGN1cnJlbnQgd29yZCB0byB0aGUgc3RhcnQgb2YgdGhlIG5leHQgd29yZCBpbiB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAga2V5ZG93bigndicpXG4gICAgICBrZXlkb3duKCdhJylcbiAgICAgIGtleWRvd24oJ3cnKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkU2NyZWVuUmFuZ2UoKSkudG9FcXVhbCBbWzAsIDZdLCBbMCwgMTJdXVxuXG4gICAgaXQgXCJleHBhbmRzIGFuIGV4aXN0aW5nIHNlbGVjdGlvbiBpbiB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAyXSlcbiAgICAgIGtleWRvd24oJ3YnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignYScpXG4gICAgICBrZXlkb3duKCd3JylcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFNjcmVlblJhbmdlKCkpLnRvRXF1YWwgW1swLCAyXSwgWzAsIDEyXV1cblxuICAgIGl0IFwiZG9lc24ndCBzcGFuIG5ld2xpbmVzXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIjEyMzQ1XFxuYWJjZGUgQUJDREVcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgM10pXG5cbiAgICAgIGtleWRvd24oXCJ2XCIpXG4gICAgICBrZXlkb3duKFwiYVwiKVxuICAgICAga2V5ZG93bihcIndcIilcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpKS50b0VxdWFsIFtbWzAsIDBdLCBbMCwgNV1dXVxuXG4gICAgaXQgXCJkb2Vzbid0IHNwYW4gc3BlY2lhbCBjaGFyYWN0ZXJzXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIjEoMzQ1XFxuYWJjZGUgQUJDREVcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgM10pXG5cbiAgICAgIGtleWRvd24oXCJ2XCIpXG4gICAgICBrZXlkb3duKFwiYVwiKVxuICAgICAga2V5ZG93bihcIndcIilcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpKS50b0VxdWFsIFtbWzAsIDJdLCBbMCwgNV1dXVxuXG4gIGRlc2NyaWJlIFwidGhlICdhVycgdGV4dCBvYmplY3RcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIjEyKDQ1IGFiJ2RlIEFCQ0RFXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDldKVxuXG4gICAgaXQgXCJhcHBsaWVzIG9wZXJhdG9ycyBmcm9tIHRoZSBzdGFydCBvZiB0aGUgY3VycmVudCB3aG9sZSB3b3JkIHRvIHRoZSBzdGFydCBvZiB0aGUgbmV4dCB3aG9sZSB3b3JkIGluIG9wZXJhdG9yLXBlbmRpbmcgbW9kZVwiLCAtPlxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdhJylcbiAgICAgIGtleWRvd24oJ1cnLCBzaGlmdDogdHJ1ZSlcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxMig0NSBBQkNERVwiXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDZdXG4gICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJ1wiJykudGV4dCkudG9CZSBcImFiJ2RlIFwiXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ29wZXJhdG9yLXBlbmRpbmctbW9kZScpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcInNlbGVjdHMgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIGN1cnJlbnQgd2hvbGUgd29yZCB0byB0aGUgc3RhcnQgb2YgdGhlIG5leHQgd2hvbGUgd29yZCBpbiB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAga2V5ZG93bigndicpXG4gICAgICBrZXlkb3duKCdhJylcbiAgICAgIGtleWRvd24oJ1cnLCBzaGlmdDogdHJ1ZSlcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFNjcmVlblJhbmdlKCkpLnRvRXF1YWwgW1swLCA2XSwgWzAsIDEyXV1cblxuICAgIGl0IFwiZXhwYW5kcyBhbiBleGlzdGluZyBzZWxlY3Rpb24gaW4gdmlzdWFsIG1vZGVcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMl0pXG4gICAgICBrZXlkb3duKCd2JylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2EnKVxuICAgICAga2V5ZG93bignVycsIHNoaWZ0OiB0cnVlKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkU2NyZWVuUmFuZ2UoKSkudG9FcXVhbCBbWzAsIDJdLCBbMCwgMTJdXVxuXG4gICAgaXQgXCJkb2Vzbid0IHNwYW4gbmV3bGluZXNcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiMTIoNDVcXG5hYidkZSBBQkNERVwiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCA0XSlcblxuICAgICAga2V5ZG93bigndicpXG4gICAgICBrZXlkb3duKCdhJylcbiAgICAgIGtleWRvd24oJ1cnLCBzaGlmdDogdHJ1ZSlcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpKS50b0VxdWFsIFtbWzAsIDBdLCBbMCwgNV1dXVxuXG4gIGRlc2NyaWJlIFwidGhlICdhKCcgdGV4dCBvYmplY3RcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIiggc29tZXRoaW5nIGluIGhlcmUgYW5kIGluIChoZXJlKSApXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDldKVxuXG4gICAgaXQgXCJhcHBsaWVzIG9wZXJhdG9ycyBhcm91bmQgdGhlIGN1cnJlbnQgcGFyZW50aGVzZXMgaW4gb3BlcmF0b3ItcGVuZGluZyBtb2RlXCIsIC0+XG4gICAgICBrZXlkb3duKCdkJylcbiAgICAgIGtleWRvd24oJ2EnKVxuICAgICAga2V5ZG93bignKCcpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ29wZXJhdG9yLXBlbmRpbmctbW9kZScpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImFwcGxpZXMgb3BlcmF0b3JzIGFyb3VuZCB0aGUgY3VycmVudCBwYXJlbnRoZXNlcyBpbiBvcGVyYXRvci1wZW5kaW5nIG1vZGUgKHNlY29uZCB0ZXN0KVwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAyOV0pXG4gICAgICBrZXlkb3duKCdkJylcbiAgICAgIGtleWRvd24oJ2EnKVxuICAgICAga2V5ZG93bignKCcpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIiggc29tZXRoaW5nIGluIGhlcmUgYW5kIGluICApXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMjddXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ29wZXJhdG9yLXBlbmRpbmctbW9kZScpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3JtYWwtbW9kZScpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImV4cGFuZHMgYW4gZXhpc3Rpbmcgc2VsZWN0aW9uIGluIHZpc3VhbCBtb2RlXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDI1XSlcbiAgICAgIGtleWRvd24oJ3YnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdhJylcbiAgICAgIGtleWRvd24oJygnKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkU2NyZWVuUmFuZ2UoKSkudG9FcXVhbCBbWzAsIDI1XSwgWzAsIDMzXV1cblxuICBkZXNjcmliZSBcInRoZSAnYXsnIHRleHQgb2JqZWN0XCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJ7IHNvbWV0aGluZyBpbiBoZXJlIGFuZCBpbiB7aGVyZX0gfVwiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCA5XSlcblxuICAgIGl0IFwiYXBwbGllcyBvcGVyYXRvcnMgYXJvdW5kIHRoZSBjdXJyZW50IGN1cmx5IGJyYWNrZXRzIGluIG9wZXJhdG9yLXBlbmRpbmcgbW9kZVwiLCAtPlxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdhJylcbiAgICAgIGtleWRvd24oJ3snKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAwXVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVyYXRvci1wZW5kaW5nLW1vZGUnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJhcHBsaWVzIG9wZXJhdG9ycyBhcm91bmQgdGhlIGN1cnJlbnQgY3VybHkgYnJhY2tldHMgaW4gb3BlcmF0b3ItcGVuZGluZyBtb2RlIChzZWNvbmQgdGVzdClcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMjldKVxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdhJylcbiAgICAgIGtleWRvd24oJ3snKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJ7IHNvbWV0aGluZyBpbiBoZXJlIGFuZCBpbiAgfVwiXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDI3XVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVyYXRvci1wZW5kaW5nLW1vZGUnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJleHBhbmRzIGFuIGV4aXN0aW5nIHNlbGVjdGlvbiBpbiB2aXN1YWwgbW9kZVwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAyNV0pXG4gICAgICBrZXlkb3duKCd2JylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignYScpXG4gICAgICBrZXlkb3duKCd7JylcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFNjcmVlblJhbmdlKCkpLnRvRXF1YWwgW1swLCAyNV0sIFswLCAzM11dXG5cbiAgZGVzY3JpYmUgXCJ0aGUgJ2E8JyB0ZXh0IG9iamVjdFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiPCBzb21ldGhpbmcgaW4gaGVyZSBhbmQgaW4gPGhlcmU+ID5cIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgOV0pXG5cbiAgICBpdCBcImFwcGxpZXMgb3BlcmF0b3JzIGFyb3VuZCB0aGUgY3VycmVudCBhbmdsZSBicmFja2V0cyBpbiBvcGVyYXRvci1wZW5kaW5nIG1vZGVcIiwgLT5cbiAgICAgIGtleWRvd24oJ2QnKVxuICAgICAga2V5ZG93bignYScpXG4gICAgICBrZXlkb3duKCc8JylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMF1cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiYXBwbGllcyBvcGVyYXRvcnMgYXJvdW5kIHRoZSBjdXJyZW50IGFuZ2xlIGJyYWNrZXRzIGluIG9wZXJhdG9yLXBlbmRpbmcgbW9kZSAoc2Vjb25kIHRlc3QpXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDI5XSlcbiAgICAgIGtleWRvd24oJ2QnKVxuICAgICAga2V5ZG93bignYScpXG4gICAgICBrZXlkb3duKCc8JylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiPCBzb21ldGhpbmcgaW4gaGVyZSBhbmQgaW4gID5cIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyN11cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiZXhwYW5kcyBhbiBleGlzdGluZyBzZWxlY3Rpb24gaW4gdmlzdWFsIG1vZGVcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMjVdKVxuICAgICAga2V5ZG93bigndicpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2EnKVxuICAgICAga2V5ZG93bignPCcpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRTY3JlZW5SYW5nZSgpKS50b0VxdWFsIFtbMCwgMjVdLCBbMCwgMzNdXVxuXG4gIGRlc2NyaWJlIFwidGhlICdhWycgdGV4dCBvYmplY3RcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIlsgc29tZXRoaW5nIGluIGhlcmUgYW5kIGluIFtoZXJlXSBdXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDldKVxuXG4gICAgaXQgXCJhcHBsaWVzIG9wZXJhdG9ycyBhcm91bmQgdGhlIGN1cnJlbnQgc3F1YXJlIGJyYWNrZXRzIGluIG9wZXJhdG9yLXBlbmRpbmcgbW9kZVwiLCAtPlxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdhJylcbiAgICAgIGtleWRvd24oJ1snKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAwXVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVyYXRvci1wZW5kaW5nLW1vZGUnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJhcHBsaWVzIG9wZXJhdG9ycyBhcm91bmQgdGhlIGN1cnJlbnQgc3F1YXJlIGJyYWNrZXRzIGluIG9wZXJhdG9yLXBlbmRpbmcgbW9kZSAoc2Vjb25kIHRlc3QpXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDI5XSlcbiAgICAgIGtleWRvd24oJ2QnKVxuICAgICAga2V5ZG93bignYScpXG4gICAgICBrZXlkb3duKCdbJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiWyBzb21ldGhpbmcgaW4gaGVyZSBhbmQgaW4gIF1cIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAyN11cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiZXhwYW5kcyBhbiBleGlzdGluZyBzZWxlY3Rpb24gaW4gdmlzdWFsIG1vZGVcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMjVdKVxuICAgICAga2V5ZG93bigndicpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2EnKVxuICAgICAga2V5ZG93bignWycpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRTY3JlZW5SYW5nZSgpKS50b0VxdWFsIFtbMCwgMjVdLCBbMCwgMzNdXVxuXG4gIGRlc2NyaWJlIFwidGhlICdhXFwnJyB0ZXh0IG9iamVjdFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiJyBzb21ldGhpbmcgaW4gaGVyZSBhbmQgaW4gJ2hlcmUnICdcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgOV0pXG5cbiAgICBpdCBcImFwcGxpZXMgb3BlcmF0b3JzIGFyb3VuZCB0aGUgY3VycmVudCBzaW5nbGUgcXVvdGVzIGluIG9wZXJhdG9yLXBlbmRpbmcgbW9kZVwiLCAtPlxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdhJylcbiAgICAgIGtleWRvd24oJ1xcJycpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcImhlcmUnICdcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAwXVxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVyYXRvci1wZW5kaW5nLW1vZGUnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm9ybWFsLW1vZGUnKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJhcHBsaWVzIG9wZXJhdG9ycyBhcm91bmQgdGhlIGN1cnJlbnQgc2luZ2xlIHF1b3RlcyBpbiBvcGVyYXRvci1wZW5kaW5nIG1vZGUgKHNlY29uZCB0ZXN0KVwiLCAtPlxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKFswLCAyOV0pXG4gICAgICBrZXlkb3duKCdkJylcbiAgICAgIGtleWRvd24oJ2EnKVxuICAgICAga2V5ZG93bignXFwnJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiJyBzb21ldGhpbmcgaW4gaGVyZSBhbmQgaW4gJ2hlcmVcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAzMV1cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiZXhwYW5kcyBhbiBleGlzdGluZyBzZWxlY3Rpb24gaW4gdmlzdWFsIG1vZGVcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMjVdKVxuICAgICAga2V5ZG93bigndicpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2EnKVxuICAgICAga2V5ZG93bignXFwnJylcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFNjcmVlblJhbmdlKCkpLnRvRXF1YWwgW1swLCAyNV0sIFswLCAzNV1dXG5cbiAgZGVzY3JpYmUgXCJ0aGUgJ2FcXFwiJyB0ZXh0IG9iamVjdFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiXFxcIiBzb21ldGhpbmcgaW4gaGVyZSBhbmQgaW4gXFxcImhlcmVcXFwiIFxcXCJcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgOV0pXG5cbiAgICBpdCBcImFwcGxpZXMgb3BlcmF0b3JzIGFyb3VuZCB0aGUgY3VycmVudCBkb3VibGUgcXVvdGVzIGluIG9wZXJhdG9yLXBlbmRpbmcgbW9kZVwiLCAtPlxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdhJylcbiAgICAgIGtleWRvd24oJ1wiXCInKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ2hlcmVcIiBcIidcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkudG9FcXVhbCBbMCwgMF1cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiYXBwbGllcyBvcGVyYXRvcnMgYXJvdW5kIHRoZSBjdXJyZW50IGRvdWJsZSBxdW90ZXMgaW4gb3BlcmF0b3ItcGVuZGluZyBtb2RlIChzZWNvbmQgdGVzdClcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMjldKVxuICAgICAga2V5ZG93bignZCcpXG4gICAgICBrZXlkb3duKCdhJylcbiAgICAgIGtleWRvd24oJ1wiJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXFxcIiBzb21ldGhpbmcgaW4gaGVyZSBhbmQgaW4gXFxcImhlcmVcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCAzMV1cbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnb3BlcmF0b3ItcGVuZGluZy1tb2RlJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiZXhwYW5kcyBhbiBleGlzdGluZyBzZWxlY3Rpb24gaW4gdmlzdWFsIG1vZGVcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihbMCwgMjVdKVxuICAgICAga2V5ZG93bigndicpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2wnKVxuICAgICAga2V5ZG93bignbCcpXG4gICAgICBrZXlkb3duKCdsJylcbiAgICAgIGtleWRvd24oJ2EnKVxuICAgICAga2V5ZG93bignXCInKVxuXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkU2NyZWVuUmFuZ2UoKSkudG9FcXVhbCBbWzAsIDI1XSwgWzAsIDM1XV1cbiJdfQ==
