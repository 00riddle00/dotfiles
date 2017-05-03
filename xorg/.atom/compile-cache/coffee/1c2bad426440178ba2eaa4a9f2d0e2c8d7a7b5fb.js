(function() {
  var InsertFootnoteView;

  InsertFootnoteView = require("../../lib/views/insert-footnote-view");

  describe("InsertFootnoteView", function() {
    var editor, insertFootnoteView, ref;
    ref = [], editor = ref[0], insertFootnoteView = ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
      return runs(function() {
        insertFootnoteView = new InsertFootnoteView({});
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe(".display", function() {
      it("display without set footnote", function() {
        insertFootnoteView.display();
        expect(insertFootnoteView.footnote).toBeUndefined();
        return expect(insertFootnoteView.labelEditor.getText().length).toEqual(8);
      });
      return it("display with footnote set", function() {
        editor.setText("[^1]");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertFootnoteView.display();
        expect(insertFootnoteView.footnote).toEqual({
          label: "1",
          content: "",
          isDefinition: false
        });
        return expect(insertFootnoteView.labelEditor.getText()).toEqual("1");
      });
    });
    describe(".insertFootnote", function() {
      return it("insert footnote with content", function() {
        insertFootnoteView.display();
        insertFootnoteView.insertFootnote({
          label: "footnote",
          content: "content"
        });
        return expect(editor.getText()).toEqual("[^footnote]\n\n[^footnote]: content");
      });
    });
    return describe(".updateFootnote", function() {
      var expected, fixture;
      fixture = "[^footnote]\n\n[^footnote]:\ncontent";
      expected = "[^note]\n\n[^note]:\ncontent";
      beforeEach(function() {
        return editor.setText(fixture);
      });
      it("update footnote definition to new label", function() {
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertFootnoteView.display();
        insertFootnoteView.updateFootnote({
          label: "note",
          content: ""
        });
        return expect(editor.getText()).toEqual(expected);
      });
      return it("update footnote reference to new label", function() {
        editor.setCursorBufferPosition([2, 0]);
        editor.selectToBufferPosition([2, 13]);
        insertFootnoteView.display();
        insertFootnoteView.updateFootnote({
          label: "note",
          content: ""
        });
        return expect(editor.getText()).toEqual(expected);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL3ZpZXdzL2luc2VydC1mb290bm90ZS12aWV3LXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsc0NBQVI7O0VBRXJCLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBO0FBQzdCLFFBQUE7SUFBQSxNQUErQixFQUEvQixFQUFDLGVBQUQsRUFBUztJQUVULFVBQUEsQ0FBVyxTQUFBO01BQ1QsZUFBQSxDQUFnQixTQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGdCQUFwQjtNQUFILENBQWhCO2FBQ0EsSUFBQSxDQUFLLFNBQUE7UUFDSCxrQkFBQSxHQUF5QixJQUFBLGtCQUFBLENBQW1CLEVBQW5CO2VBQ3pCLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFGTixDQUFMO0lBRlMsQ0FBWDtJQU1BLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUE7TUFDbkIsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUE7UUFDakMsa0JBQWtCLENBQUMsT0FBbkIsQ0FBQTtRQUNBLE1BQUEsQ0FBTyxrQkFBa0IsQ0FBQyxRQUExQixDQUFtQyxDQUFDLGFBQXBDLENBQUE7ZUFDQSxNQUFBLENBQU8sa0JBQWtCLENBQUMsV0FBVyxDQUFDLE9BQS9CLENBQUEsQ0FBd0MsQ0FBQyxNQUFoRCxDQUF1RCxDQUFDLE9BQXhELENBQWdFLENBQWhFO01BSGlDLENBQW5DO2FBS0EsRUFBQSxDQUFHLDJCQUFILEVBQWdDLFNBQUE7UUFDOUIsTUFBTSxDQUFDLE9BQVAsQ0FBZSxNQUFmO1FBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFDQSxNQUFNLENBQUMsaUJBQVAsQ0FBQTtRQUVBLGtCQUFrQixDQUFDLE9BQW5CLENBQUE7UUFDQSxNQUFBLENBQU8sa0JBQWtCLENBQUMsUUFBMUIsQ0FBbUMsQ0FBQyxPQUFwQyxDQUE0QztVQUFBLEtBQUEsRUFBTyxHQUFQO1VBQVksT0FBQSxFQUFTLEVBQXJCO1VBQXlCLFlBQUEsRUFBYyxLQUF2QztTQUE1QztlQUNBLE1BQUEsQ0FBTyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsT0FBL0IsQ0FBQSxDQUFQLENBQWdELENBQUMsT0FBakQsQ0FBeUQsR0FBekQ7TUFQOEIsQ0FBaEM7SUFObUIsQ0FBckI7SUFlQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQTthQUMxQixFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQTtRQUNqQyxrQkFBa0IsQ0FBQyxPQUFuQixDQUFBO1FBQ0Esa0JBQWtCLENBQUMsY0FBbkIsQ0FBa0M7VUFBQSxLQUFBLEVBQU8sVUFBUDtVQUFtQixPQUFBLEVBQVMsU0FBNUI7U0FBbEM7ZUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsT0FBekIsQ0FBaUMscUNBQWpDO01BSmlDLENBQW5DO0lBRDBCLENBQTVCO1dBV0EsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUE7QUFDMUIsVUFBQTtNQUFBLE9BQUEsR0FBVTtNQU9WLFFBQUEsR0FBVztNQU9YLFVBQUEsQ0FBVyxTQUFBO2VBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSxPQUFmO01BRFMsQ0FBWDtNQUdBLEVBQUEsQ0FBRyx5Q0FBSCxFQUE4QyxTQUFBO1FBQzVDLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1FBQ0EsTUFBTSxDQUFDLGlCQUFQLENBQUE7UUFFQSxrQkFBa0IsQ0FBQyxPQUFuQixDQUFBO1FBQ0Esa0JBQWtCLENBQUMsY0FBbkIsQ0FBa0M7VUFBQSxLQUFBLEVBQU8sTUFBUDtVQUFlLE9BQUEsRUFBUyxFQUF4QjtTQUFsQztlQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxRQUFqQztNQVA0QyxDQUE5QzthQVNBLEVBQUEsQ0FBRyx3Q0FBSCxFQUE2QyxTQUFBO1FBQzNDLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1FBQ0EsTUFBTSxDQUFDLHNCQUFQLENBQThCLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBOUI7UUFFQSxrQkFBa0IsQ0FBQyxPQUFuQixDQUFBO1FBQ0Esa0JBQWtCLENBQUMsY0FBbkIsQ0FBa0M7VUFBQSxLQUFBLEVBQU8sTUFBUDtVQUFlLE9BQUEsRUFBUyxFQUF4QjtTQUFsQztlQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxRQUFqQztNQVAyQyxDQUE3QztJQTNCMEIsQ0FBNUI7RUFuQzZCLENBQS9CO0FBRkEiLCJzb3VyY2VzQ29udGVudCI6WyJJbnNlcnRGb290bm90ZVZpZXcgPSByZXF1aXJlIFwiLi4vLi4vbGliL3ZpZXdzL2luc2VydC1mb290bm90ZS12aWV3XCJcblxuZGVzY3JpYmUgXCJJbnNlcnRGb290bm90ZVZpZXdcIiwgLT5cbiAgW2VkaXRvciwgaW5zZXJ0Rm9vdG5vdGVWaWV3XSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKFwiZW1wdHkubWFya2Rvd25cIilcbiAgICBydW5zIC0+XG4gICAgICBpbnNlcnRGb290bm90ZVZpZXcgPSBuZXcgSW5zZXJ0Rm9vdG5vdGVWaWV3KHt9KVxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgZGVzY3JpYmUgXCIuZGlzcGxheVwiLCAtPlxuICAgIGl0IFwiZGlzcGxheSB3aXRob3V0IHNldCBmb290bm90ZVwiLCAtPlxuICAgICAgaW5zZXJ0Rm9vdG5vdGVWaWV3LmRpc3BsYXkoKVxuICAgICAgZXhwZWN0KGluc2VydEZvb3Rub3RlVmlldy5mb290bm90ZSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICBleHBlY3QoaW5zZXJ0Rm9vdG5vdGVWaWV3LmxhYmVsRWRpdG9yLmdldFRleHQoKS5sZW5ndGgpLnRvRXF1YWwoOClcblxuICAgIGl0IFwiZGlzcGxheSB3aXRoIGZvb3Rub3RlIHNldFwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJbXjFdXCJcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICBlZGl0b3Iuc2VsZWN0VG9FbmRPZkxpbmUoKVxuXG4gICAgICBpbnNlcnRGb290bm90ZVZpZXcuZGlzcGxheSgpXG4gICAgICBleHBlY3QoaW5zZXJ0Rm9vdG5vdGVWaWV3LmZvb3Rub3RlKS50b0VxdWFsKGxhYmVsOiBcIjFcIiwgY29udGVudDogXCJcIiwgaXNEZWZpbml0aW9uOiBmYWxzZSlcbiAgICAgIGV4cGVjdChpbnNlcnRGb290bm90ZVZpZXcubGFiZWxFZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsKFwiMVwiKVxuXG4gIGRlc2NyaWJlIFwiLmluc2VydEZvb3Rub3RlXCIsIC0+XG4gICAgaXQgXCJpbnNlcnQgZm9vdG5vdGUgd2l0aCBjb250ZW50XCIsIC0+XG4gICAgICBpbnNlcnRGb290bm90ZVZpZXcuZGlzcGxheSgpXG4gICAgICBpbnNlcnRGb290bm90ZVZpZXcuaW5zZXJ0Rm9vdG5vdGUobGFiZWw6IFwiZm9vdG5vdGVcIiwgY29udGVudDogXCJjb250ZW50XCIpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0VxdWFsIFwiXCJcIlxuW15mb290bm90ZV1cblxuW15mb290bm90ZV06IGNvbnRlbnRcbiAgICAgIFwiXCJcIlxuXG4gIGRlc2NyaWJlIFwiLnVwZGF0ZUZvb3Rub3RlXCIsIC0+XG4gICAgZml4dHVyZSA9IFwiXCJcIlxuW15mb290bm90ZV1cblxuW15mb290bm90ZV06XG5jb250ZW50XG4gICAgXCJcIlwiXG5cbiAgICBleHBlY3RlZCA9IFwiXCJcIlxuW15ub3RlXVxuXG5bXm5vdGVdOlxuY29udGVudFxuICAgIFwiXCJcIlxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoZml4dHVyZSlcblxuICAgIGl0IFwidXBkYXRlIGZvb3Rub3RlIGRlZmluaXRpb24gdG8gbmV3IGxhYmVsXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuICAgICAgZWRpdG9yLnNlbGVjdFRvRW5kT2ZMaW5lKClcblxuICAgICAgaW5zZXJ0Rm9vdG5vdGVWaWV3LmRpc3BsYXkoKVxuICAgICAgaW5zZXJ0Rm9vdG5vdGVWaWV3LnVwZGF0ZUZvb3Rub3RlKGxhYmVsOiBcIm5vdGVcIiwgY29udGVudDogXCJcIilcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwoZXhwZWN0ZWQpXG5cbiAgICBpdCBcInVwZGF0ZSBmb290bm90ZSByZWZlcmVuY2UgdG8gbmV3IGxhYmVsXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzIsIDBdKVxuICAgICAgZWRpdG9yLnNlbGVjdFRvQnVmZmVyUG9zaXRpb24oWzIsIDEzXSlcblxuICAgICAgaW5zZXJ0Rm9vdG5vdGVWaWV3LmRpc3BsYXkoKVxuICAgICAgaW5zZXJ0Rm9vdG5vdGVWaWV3LnVwZGF0ZUZvb3Rub3RlKGxhYmVsOiBcIm5vdGVcIiwgY29udGVudDogXCJcIilcblxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvRXF1YWwoZXhwZWN0ZWQpXG4iXX0=
