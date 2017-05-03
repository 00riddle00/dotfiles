(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("Insert mode commands", function() {
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
    return describe("Copy from line above/below", function() {
      beforeEach(function() {
        editor.setText("12345\n\nabcd\nefghi");
        editor.setCursorBufferPosition([1, 0]);
        editor.addCursorAtBufferPosition([3, 0]);
        return keydown('i');
      });
      describe("the ctrl-y command", function() {
        it("copies from the line above", function() {
          keydown('y', {
            ctrl: true
          });
          expect(editor.getText()).toBe('12345\n1\nabcd\naefghi');
          editor.insertText(' ');
          keydown('y', {
            ctrl: true
          });
          return expect(editor.getText()).toBe('12345\n1 3\nabcd\na cefghi');
        });
        it("does nothing if there's nothing above the cursor", function() {
          editor.insertText('fill');
          keydown('y', {
            ctrl: true
          });
          expect(editor.getText()).toBe('12345\nfill5\nabcd\nfillefghi');
          keydown('y', {
            ctrl: true
          });
          return expect(editor.getText()).toBe('12345\nfill5\nabcd\nfillefghi');
        });
        return it("does nothing on the first line", function() {
          editor.setCursorBufferPosition([0, 2]);
          editor.addCursorAtBufferPosition([3, 2]);
          editor.insertText('a');
          expect(editor.getText()).toBe('12a345\n\nabcd\nefaghi');
          keydown('y', {
            ctrl: true
          });
          return expect(editor.getText()).toBe('12a345\n\nabcd\nefadghi');
        });
      });
      return describe("the ctrl-e command", function() {
        beforeEach(function() {
          return atom.keymaps.add("test", {
            'atom-text-editor.vim-mode.insert-mode': {
              'ctrl-e': 'vim-mode:copy-from-line-below'
            }
          });
        });
        it("copies from the line below", function() {
          keydown('e', {
            ctrl: true
          });
          expect(editor.getText()).toBe('12345\na\nabcd\nefghi');
          editor.insertText(' ');
          keydown('e', {
            ctrl: true
          });
          return expect(editor.getText()).toBe('12345\na c\nabcd\n efghi');
        });
        return it("does nothing if there's nothing below the cursor", function() {
          editor.insertText('foo');
          keydown('e', {
            ctrl: true
          });
          expect(editor.getText()).toBe('12345\nfood\nabcd\nfooefghi');
          keydown('e', {
            ctrl: true
          });
          return expect(editor.getText()).toBe('12345\nfood\nabcd\nfooefghi');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvaW5zZXJ0LW1vZGUtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsZUFBUjs7RUFFVixRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQTtBQUMvQixRQUFBO0lBQUEsTUFBb0MsRUFBcEMsRUFBQyxlQUFELEVBQVMsc0JBQVQsRUFBd0I7SUFFeEIsVUFBQSxDQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBZCxDQUEwQixVQUExQjtNQUNWLE9BQU8sQ0FBQyxpQkFBUixDQUFBO2FBRUEsT0FBTyxDQUFDLGdCQUFSLENBQXlCLFNBQUMsT0FBRDtRQUN2QixhQUFBLEdBQWdCO1FBQ2hCLE1BQUEsR0FBUyxhQUFhLENBQUMsUUFBZCxDQUFBO1FBQ1QsUUFBQSxHQUFXLGFBQWEsQ0FBQztRQUN6QixRQUFRLENBQUMsa0JBQVQsQ0FBQTtlQUNBLFFBQVEsQ0FBQyxlQUFULENBQUE7TUFMdUIsQ0FBekI7SUFKUyxDQUFYO0lBV0EsT0FBQSxHQUFVLFNBQUMsR0FBRCxFQUFNLE9BQU47O1FBQU0sVUFBUTs7O1FBQ3RCLE9BQU8sQ0FBQyxVQUFXOzthQUNuQixPQUFPLENBQUMsT0FBUixDQUFnQixHQUFoQixFQUFxQixPQUFyQjtJQUZRO1dBSVYsUUFBQSxDQUFTLDRCQUFULEVBQXVDLFNBQUE7TUFDckMsVUFBQSxDQUFXLFNBQUE7UUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLHNCQUFmO1FBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFDQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQztlQUNBLE9BQUEsQ0FBUSxH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QU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDZCQUE5QjtRQU5xRCxDQUF2RDtNQWQ2QixDQUEvQjtJQWhDcUMsQ0FBdkM7RUFsQitCLENBQWpDO0FBRkEiLCJzb3VyY2VzQ29udGVudCI6WyJoZWxwZXJzID0gcmVxdWlyZSAnLi9zcGVjLWhlbHBlcidcblxuZGVzY3JpYmUgXCJJbnNlcnQgbW9kZSBjb21tYW5kc1wiLCAtPlxuICBbZWRpdG9yLCBlZGl0b3JFbGVtZW50LCB2aW1TdGF0ZV0gPSBbXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICB2aW1Nb2RlID0gYXRvbS5wYWNrYWdlcy5sb2FkUGFja2FnZSgndmltLW1vZGUnKVxuICAgIHZpbU1vZGUuYWN0aXZhdGVSZXNvdXJjZXMoKVxuXG4gICAgaGVscGVycy5nZXRFZGl0b3JFbGVtZW50IChlbGVtZW50KSAtPlxuICAgICAgZWRpdG9yRWxlbWVudCA9IGVsZW1lbnRcbiAgICAgIGVkaXRvciA9IGVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKVxuICAgICAgdmltU3RhdGUgPSBlZGl0b3JFbGVtZW50LnZpbVN0YXRlXG4gICAgICB2aW1TdGF0ZS5hY3RpdmF0ZU5vcm1hbE1vZGUoKVxuICAgICAgdmltU3RhdGUucmVzZXROb3JtYWxNb2RlKClcblxuICBrZXlkb3duID0gKGtleSwgb3B0aW9ucz17fSkgLT5cbiAgICBvcHRpb25zLmVsZW1lbnQgPz0gZWRpdG9yRWxlbWVudFxuICAgIGhlbHBlcnMua2V5ZG93bihrZXksIG9wdGlvbnMpXG5cbiAgZGVzY3JpYmUgXCJDb3B5IGZyb20gbGluZSBhYm92ZS9iZWxvd1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiMTIzNDVcXG5cXG5hYmNkXFxuZWZnaGlcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMSwgMF0pXG4gICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbihbMywgMF0pXG4gICAgICBrZXlkb3duICdpJ1xuXG4gICAgZGVzY3JpYmUgXCJ0aGUgY3RybC15IGNvbW1hbmRcIiwgLT5cbiAgICAgIGl0IFwiY29waWVzIGZyb20gdGhlIGxpbmUgYWJvdmVcIiwgLT5cbiAgICAgICAga2V5ZG93biAneScsIGN0cmw6IHRydWVcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJzEyMzQ1XFxuMVxcbmFiY2RcXG5hZWZnaGknXG5cbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgJyAnXG4gICAgICAgIGtleWRvd24gJ3knLCBjdHJsOiB0cnVlXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICcxMjM0NVxcbjEgM1xcbmFiY2RcXG5hIGNlZmdoaSdcblxuICAgICAgaXQgXCJkb2VzIG5vdGhpbmcgaWYgdGhlcmUncyBub3RoaW5nIGFib3ZlIHRoZSBjdXJzb3JcIiwgLT5cbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgJ2ZpbGwnXG4gICAgICAgIGtleWRvd24gJ3knLCBjdHJsOiB0cnVlXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICcxMjM0NVxcbmZpbGw1XFxuYWJjZFxcbmZpbGxlZmdoaSdcblxuICAgICAgICBrZXlkb3duICd5JywgY3RybDogdHJ1ZVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnMTIzNDVcXG5maWxsNVxcbmFiY2RcXG5maWxsZWZnaGknXG5cbiAgICAgIGl0IFwiZG9lcyBub3RoaW5nIG9uIHRoZSBmaXJzdCBsaW5lXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMl0pXG4gICAgICAgIGVkaXRvci5hZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uKFszLCAyXSlcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgJ2EnXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICcxMmEzNDVcXG5cXG5hYmNkXFxuZWZhZ2hpJ1xuICAgICAgICBrZXlkb3duICd5JywgY3RybDogdHJ1ZVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnMTJhMzQ1XFxuXFxuYWJjZFxcbmVmYWRnaGknXG5cbiAgICBkZXNjcmliZSBcInRoZSBjdHJsLWUgY29tbWFuZFwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBhdG9tLmtleW1hcHMuYWRkIFwidGVzdFwiLFxuICAgICAgICAgICdhdG9tLXRleHQtZWRpdG9yLnZpbS1tb2RlLmluc2VydC1tb2RlJzpcbiAgICAgICAgICAgICdjdHJsLWUnOiAndmltLW1vZGU6Y29weS1mcm9tLWxpbmUtYmVsb3cnXG5cbiAgICAgIGl0IFwiY29waWVzIGZyb20gdGhlIGxpbmUgYmVsb3dcIiwgLT5cbiAgICAgICAga2V5ZG93biAnZScsIGN0cmw6IHRydWVcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJzEyMzQ1XFxuYVxcbmFiY2RcXG5lZmdoaSdcblxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCAnICdcbiAgICAgICAga2V5ZG93biAnZScsIGN0cmw6IHRydWVcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJzEyMzQ1XFxuYSBjXFxuYWJjZFxcbiBlZmdoaSdcblxuICAgICAgaXQgXCJkb2VzIG5vdGhpbmcgaWYgdGhlcmUncyBub3RoaW5nIGJlbG93IHRoZSBjdXJzb3JcIiwgLT5cbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgJ2ZvbydcbiAgICAgICAga2V5ZG93biAnZScsIGN0cmw6IHRydWVcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJzEyMzQ1XFxuZm9vZFxcbmFiY2RcXG5mb29lZmdoaSdcblxuICAgICAgICBrZXlkb3duICdlJywgY3RybDogdHJ1ZVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnMTIzNDVcXG5mb29kXFxuYWJjZFxcbmZvb2VmZ2hpJ1xuIl19
