(function() {
  var copyCharacterFromAbove, copyCharacterFromBelow;

  copyCharacterFromAbove = function(editor, vimState) {
    return editor.transact(function() {
      var column, cursor, i, len, range, ref, ref1, results, row;
      ref = editor.getCursors();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        cursor = ref[i];
        ref1 = cursor.getScreenPosition(), row = ref1.row, column = ref1.column;
        if (row === 0) {
          continue;
        }
        range = [[row - 1, column], [row - 1, column + 1]];
        results.push(cursor.selection.insertText(editor.getTextInBufferRange(editor.bufferRangeForScreenRange(range))));
      }
      return results;
    });
  };

  copyCharacterFromBelow = function(editor, vimState) {
    return editor.transact(function() {
      var column, cursor, i, len, range, ref, ref1, results, row;
      ref = editor.getCursors();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        cursor = ref[i];
        ref1 = cursor.getScreenPosition(), row = ref1.row, column = ref1.column;
        range = [[row + 1, column], [row + 1, column + 1]];
        results.push(cursor.selection.insertText(editor.getTextInBufferRange(editor.bufferRangeForScreenRange(range))));
      }
      return results;
    });
  };

  module.exports = {
    copyCharacterFromAbove: copyCharacterFromAbove,
    copyCharacterFromBelow: copyCharacterFromBelow
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9pbnNlcnQtbW9kZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLHNCQUFBLEdBQXlCLFNBQUMsTUFBRCxFQUFTLFFBQVQ7V0FDdkIsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsU0FBQTtBQUNkLFVBQUE7QUFBQTtBQUFBO1dBQUEscUNBQUE7O1FBQ0UsT0FBZ0IsTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBaEIsRUFBQyxjQUFELEVBQU07UUFDTixJQUFZLEdBQUEsS0FBTyxDQUFuQjtBQUFBLG1CQUFBOztRQUNBLEtBQUEsR0FBUSxDQUFDLENBQUMsR0FBQSxHQUFJLENBQUwsRUFBUSxNQUFSLENBQUQsRUFBa0IsQ0FBQyxHQUFBLEdBQUksQ0FBTCxFQUFRLE1BQUEsR0FBTyxDQUFmLENBQWxCO3FCQUNSLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBakIsQ0FBNEIsTUFBTSxDQUFDLG9CQUFQLENBQTRCLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxLQUFqQyxDQUE1QixDQUE1QjtBQUpGOztJQURjLENBQWhCO0VBRHVCOztFQVF6QixzQkFBQSxHQUF5QixTQUFDLE1BQUQsRUFBUyxRQUFUO1dBQ3ZCLE1BQU0sQ0FBQyxRQUFQLENBQWdCLFNBQUE7QUFDZCxVQUFBO0FBQUE7QUFBQTtXQUFBLHFDQUFBOztRQUNFLE9BQWdCLE1BQU0sQ0FBQyxpQkFBUCxDQUFBLENBQWhCLEVBQUMsY0FBRCxFQUFNO1FBQ04sS0FBQSxHQUFRLENBQUMsQ0FBQyxHQUFBLEdBQUksQ0FBTCxFQUFRLE1BQVIsQ0FBRCxFQUFrQixDQUFDLEdBQUEsR0FBSSxDQUFMLEVBQVEsTUFBQSxHQUFPLENBQWYsQ0FBbEI7cUJBQ1IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFqQixDQUE0QixNQUFNLENBQUMsb0JBQVAsQ0FBNEIsTUFBTSxDQUFDLHlCQUFQLENBQWlDLEtBQWpDLENBQTVCLENBQTVCO0FBSEY7O0lBRGMsQ0FBaEI7RUFEdUI7O0VBT3pCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQ2Ysd0JBQUEsc0JBRGU7SUFFZix3QkFBQSxzQkFGZTs7QUFmakIiLCJzb3VyY2VzQ29udGVudCI6WyJjb3B5Q2hhcmFjdGVyRnJvbUFib3ZlID0gKGVkaXRvciwgdmltU3RhdGUpIC0+XG4gIGVkaXRvci50cmFuc2FjdCAtPlxuICAgIGZvciBjdXJzb3IgaW4gZWRpdG9yLmdldEN1cnNvcnMoKVxuICAgICAge3JvdywgY29sdW1ufSA9IGN1cnNvci5nZXRTY3JlZW5Qb3NpdGlvbigpXG4gICAgICBjb250aW51ZSBpZiByb3cgaXMgMFxuICAgICAgcmFuZ2UgPSBbW3Jvdy0xLCBjb2x1bW5dLCBbcm93LTEsIGNvbHVtbisxXV1cbiAgICAgIGN1cnNvci5zZWxlY3Rpb24uaW5zZXJ0VGV4dChlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoZWRpdG9yLmJ1ZmZlclJhbmdlRm9yU2NyZWVuUmFuZ2UocmFuZ2UpKSlcblxuY29weUNoYXJhY3RlckZyb21CZWxvdyA9IChlZGl0b3IsIHZpbVN0YXRlKSAtPlxuICBlZGl0b3IudHJhbnNhY3QgLT5cbiAgICBmb3IgY3Vyc29yIGluIGVkaXRvci5nZXRDdXJzb3JzKClcbiAgICAgIHtyb3csIGNvbHVtbn0gPSBjdXJzb3IuZ2V0U2NyZWVuUG9zaXRpb24oKVxuICAgICAgcmFuZ2UgPSBbW3JvdysxLCBjb2x1bW5dLCBbcm93KzEsIGNvbHVtbisxXV1cbiAgICAgIGN1cnNvci5zZWxlY3Rpb24uaW5zZXJ0VGV4dChlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoZWRpdG9yLmJ1ZmZlclJhbmdlRm9yU2NyZWVuUmFuZ2UocmFuZ2UpKSlcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvcHlDaGFyYWN0ZXJGcm9tQWJvdmUsXG4gIGNvcHlDaGFyYWN0ZXJGcm9tQmVsb3dcbn1cbiJdfQ==
