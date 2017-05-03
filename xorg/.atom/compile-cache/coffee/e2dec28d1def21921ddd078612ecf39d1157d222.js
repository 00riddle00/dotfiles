(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("Prefixes", function() {
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
    describe("Repeat", function() {
      describe("with operations", function() {
        beforeEach(function() {
          editor.setText("123456789abc");
          return editor.setCursorScreenPosition([0, 0]);
        });
        it("repeats N times", function() {
          keydown('3');
          keydown('x');
          return expect(editor.getText()).toBe('456789abc');
        });
        return it("repeats NN times", function() {
          keydown('1');
          keydown('0');
          keydown('x');
          return expect(editor.getText()).toBe('bc');
        });
      });
      describe("with motions", function() {
        beforeEach(function() {
          editor.setText('one two three');
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("repeats N times", function() {
          keydown('d');
          keydown('2');
          keydown('w');
          return expect(editor.getText()).toBe('three');
        });
      });
      return describe("in visual mode", function() {
        beforeEach(function() {
          editor.setText('one two three');
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("repeats movements in visual mode", function() {
          keydown("v");
          keydown("2");
          keydown("w");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 9]);
        });
      });
    });
    return describe("Register", function() {
      describe("the a register", function() {
        it("saves a value for future reading", function() {
          vimState.setRegister('a', {
            text: 'new content'
          });
          return expect(vimState.getRegister("a").text).toEqual('new content');
        });
        return it("overwrites a value previously in the register", function() {
          vimState.setRegister('a', {
            text: 'content'
          });
          vimState.setRegister('a', {
            text: 'new content'
          });
          return expect(vimState.getRegister("a").text).toEqual('new content');
        });
      });
      describe("the B register", function() {
        it("saves a value for future reading", function() {
          vimState.setRegister('B', {
            text: 'new content'
          });
          expect(vimState.getRegister("b").text).toEqual('new content');
          return expect(vimState.getRegister("B").text).toEqual('new content');
        });
        it("appends to a value previously in the register", function() {
          vimState.setRegister('b', {
            text: 'content'
          });
          vimState.setRegister('B', {
            text: 'new content'
          });
          return expect(vimState.getRegister("b").text).toEqual('contentnew content');
        });
        it("appends linewise to a linewise value previously in the register", function() {
          vimState.setRegister('b', {
            type: 'linewise',
            text: 'content\n'
          });
          vimState.setRegister('B', {
            text: 'new content'
          });
          return expect(vimState.getRegister("b").text).toEqual('content\nnew content\n');
        });
        return it("appends linewise to a character value previously in the register", function() {
          vimState.setRegister('b', {
            text: 'content'
          });
          vimState.setRegister('B', {
            type: 'linewise',
            text: 'new content\n'
          });
          return expect(vimState.getRegister("b").text).toEqual('content\nnew content\n');
        });
      });
      describe("the * register", function() {
        describe("reading", function() {
          return it("is the same the system clipboard", function() {
            expect(vimState.getRegister('*').text).toEqual('initial clipboard content');
            return expect(vimState.getRegister('*').type).toEqual('character');
          });
        });
        return describe("writing", function() {
          beforeEach(function() {
            return vimState.setRegister('*', {
              text: 'new content'
            });
          });
          return it("overwrites the contents of the system clipboard", function() {
            return expect(atom.clipboard.read()).toEqual('new content');
          });
        });
      });
      describe("the + register", function() {
        describe("reading", function() {
          return it("is the same the system clipboard", function() {
            expect(vimState.getRegister('*').text).toEqual('initial clipboard content');
            return expect(vimState.getRegister('*').type).toEqual('character');
          });
        });
        return describe("writing", function() {
          beforeEach(function() {
            return vimState.setRegister('*', {
              text: 'new content'
            });
          });
          return it("overwrites the contents of the system clipboard", function() {
            return expect(atom.clipboard.read()).toEqual('new content');
          });
        });
      });
      describe("the _ register", function() {
        describe("reading", function() {
          return it("is always the empty string", function() {
            return expect(vimState.getRegister("_").text).toEqual('');
          });
        });
        return describe("writing", function() {
          return it("throws away anything written to it", function() {
            vimState.setRegister('_', {
              text: 'new content'
            });
            return expect(vimState.getRegister("_").text).toEqual('');
          });
        });
      });
      describe("the % register", function() {
        beforeEach(function() {
          return spyOn(editor, 'getURI').andReturn('/Users/atom/known_value.txt');
        });
        describe("reading", function() {
          return it("returns the filename of the current editor", function() {
            return expect(vimState.getRegister('%').text).toEqual('/Users/atom/known_value.txt');
          });
        });
        return describe("writing", function() {
          return it("throws away anything written to it", function() {
            vimState.setRegister('%', "new content");
            return expect(vimState.getRegister('%').text).toEqual('/Users/atom/known_value.txt');
          });
        });
      });
      return describe("the ctrl-r command in insert mode", function() {
        beforeEach(function() {
          editor.setText("02\n");
          editor.setCursorScreenPosition([0, 0]);
          vimState.setRegister('"', {
            text: '345'
          });
          vimState.setRegister('a', {
            text: 'abc'
          });
          atom.clipboard.write("clip");
          keydown('a');
          return editor.insertText('1');
        });
        it("inserts contents of the unnamed register with \"", function() {
          keydown('r', {
            ctrl: true
          });
          keydown('"');
          return expect(editor.getText()).toBe('013452\n');
        });
        describe("when useClipboardAsDefaultRegister enabled", function() {
          return it("inserts contents from clipboard with \"", function() {
            atom.config.set('vim-mode.useClipboardAsDefaultRegister', true);
            keydown('r', {
              ctrl: true
            });
            keydown('"');
            return expect(editor.getText()).toBe('01clip2\n');
          });
        });
        it("inserts contents of the 'a' register", function() {
          keydown('r', {
            ctrl: true
          });
          keydown('a');
          return expect(editor.getText()).toBe('01abc2\n');
        });
        return it("is cancelled with the escape key", function() {
          keydown('r', {
            ctrl: true
          });
          keydown('escape');
          expect(editor.getText()).toBe('012\n');
          expect(vimState.mode).toBe("insert");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvcHJlZml4ZXMtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsZUFBUjs7RUFFVixRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBO0FBQ25CLFFBQUE7SUFBQSxNQUFvQyxFQUFwQyxFQUFDLGVBQUQsRUFBUyxzQkFBVCxFQUF3QjtJQUV4QixVQUFBLENBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFkLENBQTBCLFVBQTFCO01BQ1YsT0FBTyxDQUFDLGlCQUFSLENBQUE7YUFFQSxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsU0FBQyxPQUFEO1FBQ3ZCLGFBQUEsR0FBZ0I7UUFDaEIsTUFBQSxHQUFTLGFBQWEsQ0FBQyxRQUFkLENBQUE7UUFDVCxRQUFBLEdBQVcsYUFBYSxDQUFDO1FBQ3pCLFFBQVEsQ0FBQyxrQkFBVCxDQUFBO2VBQ0EsUUFBUSxDQUFDLGVBQVQsQ0FBQTtNQUx1QixDQUF6QjtJQUpTLENBQVg7SUFXQSxPQUFBLEdBQVUsU0FBQyxHQUFELEVBQU0sT0FBTjs7UUFBTSxVQUFROzs7UUFDdEIsT0FBTyxDQUFDLFVBQVc7O2FBQ25CLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEdBQWhCLEVBQXFCLE9BQXJCO0lBRlE7SUFJVixRQUFBLENBQVMsUUFBVCxFQUFtQixTQUFBO01BQ2pCLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBO1FBQzFCLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSxjQUFmO2lCQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1FBRlMsQ0FBWDtRQUlBLEVBQUEsQ0FBRyxpQkFBSCxFQUFzQixTQUFB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dCI6WyJoZWxwZXJzID0gcmVxdWlyZSAnLi9zcGVjLWhlbHBlcidcblxuZGVzY3JpYmUgXCJQcmVmaXhlc1wiLCAtPlxuICBbZWRpdG9yLCBlZGl0b3JFbGVtZW50LCB2aW1TdGF0ZV0gPSBbXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICB2aW1Nb2RlID0gYXRvbS5wYWNrYWdlcy5sb2FkUGFja2FnZSgndmltLW1vZGUnKVxuICAgIHZpbU1vZGUuYWN0aXZhdGVSZXNvdXJjZXMoKVxuXG4gICAgaGVscGVycy5nZXRFZGl0b3JFbGVtZW50IChlbGVtZW50KSAtPlxuICAgICAgZWRpdG9yRWxlbWVudCA9IGVsZW1lbnRcbiAgICAgIGVkaXRvciA9IGVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKVxuICAgICAgdmltU3RhdGUgPSBlZGl0b3JFbGVtZW50LnZpbVN0YXRlXG4gICAgICB2aW1TdGF0ZS5hY3RpdmF0ZU5vcm1hbE1vZGUoKVxuICAgICAgdmltU3RhdGUucmVzZXROb3JtYWxNb2RlKClcblxuICBrZXlkb3duID0gKGtleSwgb3B0aW9ucz17fSkgLT5cbiAgICBvcHRpb25zLmVsZW1lbnQgPz0gZWRpdG9yRWxlbWVudFxuICAgIGhlbHBlcnMua2V5ZG93bihrZXksIG9wdGlvbnMpXG5cbiAgZGVzY3JpYmUgXCJSZXBlYXRcIiwgLT5cbiAgICBkZXNjcmliZSBcIndpdGggb3BlcmF0aW9uc1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBlZGl0b3Iuc2V0VGV4dChcIjEyMzQ1Njc4OWFiY1wiKVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBpdCBcInJlcGVhdHMgTiB0aW1lc1wiLCAtPlxuICAgICAgICBrZXlkb3duKCczJylcbiAgICAgICAga2V5ZG93bigneCcpXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJzQ1Njc4OWFiYydcblxuICAgICAgaXQgXCJyZXBlYXRzIE5OIHRpbWVzXCIsIC0+XG4gICAgICAgIGtleWRvd24oJzEnKVxuICAgICAgICBrZXlkb3duKCcwJylcbiAgICAgICAga2V5ZG93bigneCcpXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ2JjJ1xuXG4gICAgZGVzY3JpYmUgXCJ3aXRoIG1vdGlvbnNcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoJ29uZSB0d28gdGhyZWUnKVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBpdCBcInJlcGVhdHMgTiB0aW1lc1wiLCAtPlxuICAgICAgICBrZXlkb3duKCdkJylcbiAgICAgICAga2V5ZG93bignMicpXG4gICAgICAgIGtleWRvd24oJ3cnKVxuXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICd0aHJlZSdcblxuICAgIGRlc2NyaWJlIFwiaW4gdmlzdWFsIG1vZGVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQoJ29uZSB0d28gdGhyZWUnKVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBpdCBcInJlcGVhdHMgbW92ZW1lbnRzIGluIHZpc3VhbCBtb2RlXCIsIC0+XG4gICAgICAgIGtleWRvd24oXCJ2XCIpXG4gICAgICAgIGtleWRvd24oXCIyXCIpXG4gICAgICAgIGtleWRvd24oXCJ3XCIpXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS50b0VxdWFsIFswLCA5XVxuXG4gIGRlc2NyaWJlIFwiUmVnaXN0ZXJcIiwgLT5cbiAgICBkZXNjcmliZSBcInRoZSBhIHJlZ2lzdGVyXCIsIC0+XG4gICAgICBpdCBcInNhdmVzIGEgdmFsdWUgZm9yIGZ1dHVyZSByZWFkaW5nXCIsIC0+XG4gICAgICAgIHZpbVN0YXRlLnNldFJlZ2lzdGVyKCdhJywgdGV4dDogJ25ldyBjb250ZW50JylcbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKFwiYVwiKS50ZXh0KS50b0VxdWFsICduZXcgY29udGVudCdcblxuICAgICAgaXQgXCJvdmVyd3JpdGVzIGEgdmFsdWUgcHJldmlvdXNseSBpbiB0aGUgcmVnaXN0ZXJcIiwgLT5cbiAgICAgICAgdmltU3RhdGUuc2V0UmVnaXN0ZXIoJ2EnLCB0ZXh0OiAnY29udGVudCcpXG4gICAgICAgIHZpbVN0YXRlLnNldFJlZ2lzdGVyKCdhJywgdGV4dDogJ25ldyBjb250ZW50JylcbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKFwiYVwiKS50ZXh0KS50b0VxdWFsICduZXcgY29udGVudCdcblxuICAgIGRlc2NyaWJlIFwidGhlIEIgcmVnaXN0ZXJcIiwgLT5cbiAgICAgIGl0IFwic2F2ZXMgYSB2YWx1ZSBmb3IgZnV0dXJlIHJlYWRpbmdcIiwgLT5cbiAgICAgICAgdmltU3RhdGUuc2V0UmVnaXN0ZXIoJ0InLCB0ZXh0OiAnbmV3IGNvbnRlbnQnKVxuICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoXCJiXCIpLnRleHQpLnRvRXF1YWwgJ25ldyBjb250ZW50J1xuICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoXCJCXCIpLnRleHQpLnRvRXF1YWwgJ25ldyBjb250ZW50J1xuXG4gICAgICBpdCBcImFwcGVuZHMgdG8gYSB2YWx1ZSBwcmV2aW91c2x5IGluIHRoZSByZWdpc3RlclwiLCAtPlxuICAgICAgICB2aW1TdGF0ZS5zZXRSZWdpc3RlcignYicsIHRleHQ6ICdjb250ZW50JylcbiAgICAgICAgdmltU3RhdGUuc2V0UmVnaXN0ZXIoJ0InLCB0ZXh0OiAnbmV3IGNvbnRlbnQnKVxuICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoXCJiXCIpLnRleHQpLnRvRXF1YWwgJ2NvbnRlbnRuZXcgY29udGVudCdcblxuICAgICAgaXQgXCJhcHBlbmRzIGxpbmV3aXNlIHRvIGEgbGluZXdpc2UgdmFsdWUgcHJldmlvdXNseSBpbiB0aGUgcmVnaXN0ZXJcIiwgLT5cbiAgICAgICAgdmltU3RhdGUuc2V0UmVnaXN0ZXIoJ2InLCB7dHlwZTogJ2xpbmV3aXNlJywgdGV4dDogJ2NvbnRlbnRcXG4nfSlcbiAgICAgICAgdmltU3RhdGUuc2V0UmVnaXN0ZXIoJ0InLCB0ZXh0OiAnbmV3IGNvbnRlbnQnKVxuICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoXCJiXCIpLnRleHQpLnRvRXF1YWwgJ2NvbnRlbnRcXG5uZXcgY29udGVudFxcbidcblxuICAgICAgaXQgXCJhcHBlbmRzIGxpbmV3aXNlIHRvIGEgY2hhcmFjdGVyIHZhbHVlIHByZXZpb3VzbHkgaW4gdGhlIHJlZ2lzdGVyXCIsIC0+XG4gICAgICAgIHZpbVN0YXRlLnNldFJlZ2lzdGVyKCdiJywgdGV4dDogJ2NvbnRlbnQnKVxuICAgICAgICB2aW1TdGF0ZS5zZXRSZWdpc3RlcignQicsIHt0eXBlOiAnbGluZXdpc2UnLCB0ZXh0OiAnbmV3IGNvbnRlbnRcXG4nfSlcbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKFwiYlwiKS50ZXh0KS50b0VxdWFsICdjb250ZW50XFxubmV3IGNvbnRlbnRcXG4nXG5cblxuICAgIGRlc2NyaWJlIFwidGhlICogcmVnaXN0ZXJcIiwgLT5cbiAgICAgIGRlc2NyaWJlIFwicmVhZGluZ1wiLCAtPlxuICAgICAgICBpdCBcImlzIHRoZSBzYW1lIHRoZSBzeXN0ZW0gY2xpcGJvYXJkXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCcqJykudGV4dCkudG9FcXVhbCAnaW5pdGlhbCBjbGlwYm9hcmQgY29udGVudCdcbiAgICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJyonKS50eXBlKS50b0VxdWFsICdjaGFyYWN0ZXInXG5cbiAgICAgIGRlc2NyaWJlIFwid3JpdGluZ1wiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgdmltU3RhdGUuc2V0UmVnaXN0ZXIoJyonLCB0ZXh0OiAnbmV3IGNvbnRlbnQnKVxuXG4gICAgICAgIGl0IFwib3ZlcndyaXRlcyB0aGUgY29udGVudHMgb2YgdGhlIHN5c3RlbSBjbGlwYm9hcmRcIiwgLT5cbiAgICAgICAgICBleHBlY3QoYXRvbS5jbGlwYm9hcmQucmVhZCgpKS50b0VxdWFsICduZXcgY29udGVudCdcblxuICAgICMgRklYTUU6IG9uY2UgbGludXggc3VwcG9ydCBjb21lcyBvdXQsIHRoaXMgbmVlZHMgdG8gcmVhZCBmcm9tXG4gICAgIyB0aGUgY29ycmVjdCBjbGlwYm9hcmQuIEZvciBub3cgaXQgYmVoYXZlcyBqdXN0IGxpa2UgdGhlICogcmVnaXN0ZXJcbiAgICAjIFNlZSA6aGVscCB4MTEtY3V0LWJ1ZmZlciBhbmQgOmhlbHAgcmVnaXN0ZXJzIGZvciBtb3JlIGRldGFpbHMgb24gaG93IHRoZXNlXG4gICAgIyByZWdpc3RlcnMgd29yayBvbiBhbiBYMTEgYmFzZWQgc3lzdGVtLlxuICAgIGRlc2NyaWJlIFwidGhlICsgcmVnaXN0ZXJcIiwgLT5cbiAgICAgIGRlc2NyaWJlIFwicmVhZGluZ1wiLCAtPlxuICAgICAgICBpdCBcImlzIHRoZSBzYW1lIHRoZSBzeXN0ZW0gY2xpcGJvYXJkXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCcqJykudGV4dCkudG9FcXVhbCAnaW5pdGlhbCBjbGlwYm9hcmQgY29udGVudCdcbiAgICAgICAgICBleHBlY3QodmltU3RhdGUuZ2V0UmVnaXN0ZXIoJyonKS50eXBlKS50b0VxdWFsICdjaGFyYWN0ZXInXG5cbiAgICAgIGRlc2NyaWJlIFwid3JpdGluZ1wiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgdmltU3RhdGUuc2V0UmVnaXN0ZXIoJyonLCB0ZXh0OiAnbmV3IGNvbnRlbnQnKVxuXG4gICAgICAgIGl0IFwib3ZlcndyaXRlcyB0aGUgY29udGVudHMgb2YgdGhlIHN5c3RlbSBjbGlwYm9hcmRcIiwgLT5cbiAgICAgICAgICBleHBlY3QoYXRvbS5jbGlwYm9hcmQucmVhZCgpKS50b0VxdWFsICduZXcgY29udGVudCdcblxuICAgIGRlc2NyaWJlIFwidGhlIF8gcmVnaXN0ZXJcIiwgLT5cbiAgICAgIGRlc2NyaWJlIFwicmVhZGluZ1wiLCAtPlxuICAgICAgICBpdCBcImlzIGFsd2F5cyB0aGUgZW1wdHkgc3RyaW5nXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKFwiX1wiKS50ZXh0KS50b0VxdWFsICcnXG5cbiAgICAgIGRlc2NyaWJlIFwid3JpdGluZ1wiLCAtPlxuICAgICAgICBpdCBcInRocm93cyBhd2F5IGFueXRoaW5nIHdyaXR0ZW4gdG8gaXRcIiwgLT5cbiAgICAgICAgICB2aW1TdGF0ZS5zZXRSZWdpc3RlcignXycsIHRleHQ6ICduZXcgY29udGVudCcpXG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKFwiX1wiKS50ZXh0KS50b0VxdWFsICcnXG5cbiAgICBkZXNjcmliZSBcInRoZSAlIHJlZ2lzdGVyXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHNweU9uKGVkaXRvciwgJ2dldFVSSScpLmFuZFJldHVybignL1VzZXJzL2F0b20va25vd25fdmFsdWUudHh0JylcblxuICAgICAgZGVzY3JpYmUgXCJyZWFkaW5nXCIsIC0+XG4gICAgICAgIGl0IFwicmV0dXJucyB0aGUgZmlsZW5hbWUgb2YgdGhlIGN1cnJlbnQgZWRpdG9yXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCclJykudGV4dCkudG9FcXVhbCAnL1VzZXJzL2F0b20va25vd25fdmFsdWUudHh0J1xuXG4gICAgICBkZXNjcmliZSBcIndyaXRpbmdcIiwgLT5cbiAgICAgICAgaXQgXCJ0aHJvd3MgYXdheSBhbnl0aGluZyB3cml0dGVuIHRvIGl0XCIsIC0+XG4gICAgICAgICAgdmltU3RhdGUuc2V0UmVnaXN0ZXIoJyUnLCBcIm5ldyBjb250ZW50XCIpXG4gICAgICAgICAgZXhwZWN0KHZpbVN0YXRlLmdldFJlZ2lzdGVyKCclJykudGV4dCkudG9FcXVhbCAnL1VzZXJzL2F0b20va25vd25fdmFsdWUudHh0J1xuXG4gICAgZGVzY3JpYmUgXCJ0aGUgY3RybC1yIGNvbW1hbmQgaW4gaW5zZXJ0IG1vZGVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldFRleHQgXCIwMlxcblwiXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbiBbMCwgMF1cbiAgICAgICAgdmltU3RhdGUuc2V0UmVnaXN0ZXIoJ1wiJywgdGV4dDogJzM0NScpXG4gICAgICAgIHZpbVN0YXRlLnNldFJlZ2lzdGVyKCdhJywgdGV4dDogJ2FiYycpXG4gICAgICAgIGF0b20uY2xpcGJvYXJkLndyaXRlIFwiY2xpcFwiXG4gICAgICAgIGtleWRvd24gJ2EnXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0ICcxJ1xuXG4gICAgICBpdCBcImluc2VydHMgY29udGVudHMgb2YgdGhlIHVubmFtZWQgcmVnaXN0ZXIgd2l0aCBcXFwiXCIsIC0+XG4gICAgICAgIGtleWRvd24gJ3InLCBjdHJsOiB0cnVlXG4gICAgICAgIGtleWRvd24gJ1wiJ1xuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnMDEzNDUyXFxuJ1xuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdXNlQ2xpcGJvYXJkQXNEZWZhdWx0UmVnaXN0ZXIgZW5hYmxlZFwiLCAtPlxuICAgICAgICBpdCBcImluc2VydHMgY29udGVudHMgZnJvbSBjbGlwYm9hcmQgd2l0aCBcXFwiXCIsIC0+XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0ICd2aW0tbW9kZS51c2VDbGlwYm9hcmRBc0RlZmF1bHRSZWdpc3RlcicsIHRydWVcbiAgICAgICAgICBrZXlkb3duICdyJywgY3RybDogdHJ1ZVxuICAgICAgICAgIGtleWRvd24gJ1wiJ1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICcwMWNsaXAyXFxuJ1xuXG4gICAgICBpdCBcImluc2VydHMgY29udGVudHMgb2YgdGhlICdhJyByZWdpc3RlclwiLCAtPlxuICAgICAgICBrZXlkb3duICdyJywgY3RybDogdHJ1ZVxuICAgICAgICBrZXlkb3duICdhJ1xuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnMDFhYmMyXFxuJ1xuXG4gICAgICBpdCBcImlzIGNhbmNlbGxlZCB3aXRoIHRoZSBlc2NhcGUga2V5XCIsIC0+XG4gICAgICAgIGtleWRvd24gJ3InLCBjdHJsOiB0cnVlXG4gICAgICAgIGtleWRvd24gJ2VzY2FwZSdcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJzAxMlxcbidcbiAgICAgICAgZXhwZWN0KHZpbVN0YXRlLm1vZGUpLnRvQmUgXCJpbnNlcnRcIlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDJdXG4iXX0=
