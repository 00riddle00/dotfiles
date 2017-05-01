(function() {
  var Operator, Put, _, settings,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('underscore-plus');

  Operator = require('./general-operators').Operator;

  settings = require('../settings');

  module.exports = Put = (function(superClass) {
    extend(Put, superClass);

    Put.prototype.register = null;

    function Put(editor, vimState, arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.location = (arg != null ? arg : {}).location;
      if (this.location == null) {
        this.location = 'after';
      }
      this.complete = true;
      this.register = settings.defaultRegister();
    }

    Put.prototype.execute = function(count) {
      var originalPosition, ref, selection, text, textToInsert, type;
      if (count == null) {
        count = 1;
      }
      ref = this.vimState.getRegister(this.register) || {}, text = ref.text, type = ref.type;
      if (!text) {
        return;
      }
      textToInsert = _.times(count, function() {
        return text;
      }).join('');
      selection = this.editor.getSelectedBufferRange();
      if (selection.isEmpty()) {
        if (type === 'linewise') {
          textToInsert = textToInsert.replace(/\n$/, '');
          if (this.location === 'after' && this.onLastRow()) {
            textToInsert = "\n" + textToInsert;
          } else {
            textToInsert = textToInsert + "\n";
          }
        }
        if (this.location === 'after') {
          if (type === 'linewise') {
            if (this.onLastRow()) {
              this.editor.moveToEndOfLine();
              originalPosition = this.editor.getCursorScreenPosition();
              originalPosition.row += 1;
            } else {
              this.editor.moveDown();
            }
          } else {
            if (!this.onLastColumn()) {
              this.editor.moveRight();
            }
          }
        }
        if (type === 'linewise' && (originalPosition == null)) {
          this.editor.moveToBeginningOfLine();
          originalPosition = this.editor.getCursorScreenPosition();
        }
      }
      this.editor.insertText(textToInsert);
      if (originalPosition != null) {
        this.editor.setCursorScreenPosition(originalPosition);
        this.editor.moveToFirstCharacterOfLine();
      }
      if (type !== 'linewise') {
        this.editor.moveLeft();
      }
      return this.vimState.activateNormalMode();
    };

    Put.prototype.onLastRow = function() {
      var column, ref, row;
      ref = this.editor.getCursorBufferPosition(), row = ref.row, column = ref.column;
      return row === this.editor.getBuffer().getLastRow();
    };

    Put.prototype.onLastColumn = function() {
      return this.editor.getLastCursor().isAtEndOfLine();
    };

    return Put;

  })(Operator);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9vcGVyYXRvcnMvcHV0LW9wZXJhdG9yLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsMEJBQUE7SUFBQTs7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSCxXQUFZLE9BQUEsQ0FBUSxxQkFBUjs7RUFDYixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBRVgsTUFBTSxDQUFDLE9BQVAsR0FJTTs7O2tCQUNKLFFBQUEsR0FBVTs7SUFFRyxhQUFDLE1BQUQsRUFBVSxRQUFWLEVBQXFCLEdBQXJCO01BQUMsSUFBQyxDQUFBLFNBQUQ7TUFBUyxJQUFDLENBQUEsV0FBRDtNQUFZLElBQUMsQ0FBQSwwQkFBRixNQUFZLElBQVY7O1FBQ2xDLElBQUMsQ0FBQSxXQUFZOztNQUNiLElBQUMsQ0FBQSxRQUFELEdBQVk7TUFDWixJQUFDLENBQUEsUUFBRCxHQUFZLFFBQVEsQ0FBQyxlQUFULENBQUE7SUFIRDs7a0JBVWIsT0FBQSxHQUFTLFNBQUMsS0FBRDtBQUNQLFVBQUE7O1FBRFEsUUFBTTs7TUFDZCxNQUFlLElBQUMsQ0FBQSxRQUFRLENBQUMsV0FBVixDQUFzQixJQUFDLENBQUEsUUFBdkIsQ0FBQSxJQUFvQyxFQUFuRCxFQUFDLGVBQUQsRUFBTztNQUNQLElBQUEsQ0FBYyxJQUFkO0FBQUEsZUFBQTs7TUFFQSxZQUFBLEdBQWUsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFSLEVBQWUsU0FBQTtlQUFHO01BQUgsQ0FBZixDQUF1QixDQUFDLElBQXhCLENBQTZCLEVBQTdCO01BRWYsU0FBQSxHQUFZLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBQTtNQUNaLElBQUcsU0FBUyxDQUFDLE9BQVYsQ0FBQSxDQUFIO1FBRUUsSUFBRyxJQUFBLEtBQVEsVUFBWDtVQUNFLFlBQUEsR0FBZSxZQUFZLENBQUMsT0FBYixDQUFxQixLQUFyQixFQUE0QixFQUE1QjtVQUNmLElBQUcsSUFBQyxDQUFBLFFBQUQsS0FBYSxPQUFiLElBQXlCLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBNUI7WUFDRSxZQUFBLEdBQWUsSUFBQSxHQUFLLGFBRHRCO1dBQUEsTUFBQTtZQUdFLFlBQUEsR0FBa0IsWUFBRCxHQUFjLEtBSGpDO1dBRkY7O1FBT0EsSUFBRyxJQUFDLENBQUEsUUFBRCxLQUFhLE9BQWhCO1VBQ0UsSUFBRyxJQUFBLEtBQVEsVUFBWDtZQUNFLElBQUcsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFIO2NBQ0UsSUFBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQUE7Y0FFQSxnQkFBQSxHQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUE7Y0FDbkIsZ0JBQWdCLENBQUMsR0FBakIsSUFBd0IsRUFKMUI7YUFBQSxNQUFBO2NBTUUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQUEsRUFORjthQURGO1dBQUEsTUFBQTtZQVNFLElBQUEsQ0FBTyxJQUFDLENBQUEsWUFBRCxDQUFBLENBQVA7Y0FDRSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxFQURGO2FBVEY7V0FERjs7UUFhQSxJQUFHLElBQUEsS0FBUSxVQUFSLElBQTJCLDBCQUE5QjtVQUNFLElBQUMsQ0FBQSxNQUFNLENBQUMscUJBQVIsQ0FBQTtVQUNBLGdCQUFBLEdBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxFQUZyQjtTQXRCRjs7TUEwQkEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLFlBQW5CO01BRUEsSUFBRyx3QkFBSDtRQUNFLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBZ0MsZ0JBQWhDO1FBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQywwQkFBUixDQUFBLEVBRkY7O01BSUEsSUFBRyxJQUFBLEtBQVUsVUFBYjtRQUNFLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFBLEVBREY7O2FBRUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxrQkFBVixDQUFBO0lBekNPOztrQkE4Q1QsU0FBQSxHQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsTUFBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFBLENBQWhCLEVBQUMsYUFBRCxFQUFNO2FBQ04sR0FBQSxLQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsVUFBcEIsQ0FBQTtJQUZFOztrQkFJWCxZQUFBLEdBQWMsU0FBQTthQUNaLElBQUMsQ0FBQSxNQUFNLENBQUMsYUFBUixDQUFBLENBQXVCLENBQUMsYUFBeEIsQ0FBQTtJQURZOzs7O0tBL0RFO0FBUmxCIiwic291cmNlc0NvbnRlbnQiOlsiXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcbntPcGVyYXRvcn0gPSByZXF1aXJlICcuL2dlbmVyYWwtb3BlcmF0b3JzJ1xuc2V0dGluZ3MgPSByZXF1aXJlICcuLi9zZXR0aW5ncydcblxubW9kdWxlLmV4cG9ydHMgPVxuI1xuIyBJdCBwYXN0ZXMgZXZlcnl0aGluZyBjb250YWluZWQgd2l0aGluIHRoZSBzcGVjaWZlZCByZWdpc3RlclxuI1xuY2xhc3MgUHV0IGV4dGVuZHMgT3BlcmF0b3JcbiAgcmVnaXN0ZXI6IG51bGxcblxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IsIEB2aW1TdGF0ZSwge0Bsb2NhdGlvbn09e30pIC0+XG4gICAgQGxvY2F0aW9uID89ICdhZnRlcidcbiAgICBAY29tcGxldGUgPSB0cnVlXG4gICAgQHJlZ2lzdGVyID0gc2V0dGluZ3MuZGVmYXVsdFJlZ2lzdGVyKClcblxuICAjIFB1YmxpYzogUGFzdGVzIHRoZSB0ZXh0IGluIHRoZSBnaXZlbiByZWdpc3Rlci5cbiAgI1xuICAjIGNvdW50IC0gVGhlIG51bWJlciBvZiB0aW1lcyB0byBleGVjdXRlLlxuICAjXG4gICMgUmV0dXJucyBub3RoaW5nLlxuICBleGVjdXRlOiAoY291bnQ9MSkgLT5cbiAgICB7dGV4dCwgdHlwZX0gPSBAdmltU3RhdGUuZ2V0UmVnaXN0ZXIoQHJlZ2lzdGVyKSBvciB7fVxuICAgIHJldHVybiB1bmxlc3MgdGV4dFxuXG4gICAgdGV4dFRvSW5zZXJ0ID0gXy50aW1lcyhjb3VudCwgLT4gdGV4dCkuam9pbignJylcblxuICAgIHNlbGVjdGlvbiA9IEBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpXG4gICAgaWYgc2VsZWN0aW9uLmlzRW1wdHkoKVxuICAgICAgIyBDbGVhbiB1cCBzb21lIGNvcm5lciBjYXNlcyBvbiB0aGUgbGFzdCBsaW5lIG9mIHRoZSBmaWxlXG4gICAgICBpZiB0eXBlIGlzICdsaW5ld2lzZSdcbiAgICAgICAgdGV4dFRvSW5zZXJ0ID0gdGV4dFRvSW5zZXJ0LnJlcGxhY2UoL1xcbiQvLCAnJylcbiAgICAgICAgaWYgQGxvY2F0aW9uIGlzICdhZnRlcicgYW5kIEBvbkxhc3RSb3coKVxuICAgICAgICAgIHRleHRUb0luc2VydCA9IFwiXFxuI3t0ZXh0VG9JbnNlcnR9XCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRleHRUb0luc2VydCA9IFwiI3t0ZXh0VG9JbnNlcnR9XFxuXCJcblxuICAgICAgaWYgQGxvY2F0aW9uIGlzICdhZnRlcidcbiAgICAgICAgaWYgdHlwZSBpcyAnbGluZXdpc2UnXG4gICAgICAgICAgaWYgQG9uTGFzdFJvdygpXG4gICAgICAgICAgICBAZWRpdG9yLm1vdmVUb0VuZE9mTGluZSgpXG5cbiAgICAgICAgICAgIG9yaWdpbmFsUG9zaXRpb24gPSBAZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKClcbiAgICAgICAgICAgIG9yaWdpbmFsUG9zaXRpb24ucm93ICs9IDFcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZWRpdG9yLm1vdmVEb3duKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHVubGVzcyBAb25MYXN0Q29sdW1uKClcbiAgICAgICAgICAgIEBlZGl0b3IubW92ZVJpZ2h0KClcblxuICAgICAgaWYgdHlwZSBpcyAnbGluZXdpc2UnIGFuZCBub3Qgb3JpZ2luYWxQb3NpdGlvbj9cbiAgICAgICAgQGVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZkxpbmUoKVxuICAgICAgICBvcmlnaW5hbFBvc2l0aW9uID0gQGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpXG5cbiAgICBAZWRpdG9yLmluc2VydFRleHQodGV4dFRvSW5zZXJ0KVxuXG4gICAgaWYgb3JpZ2luYWxQb3NpdGlvbj9cbiAgICAgIEBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24ob3JpZ2luYWxQb3NpdGlvbilcbiAgICAgIEBlZGl0b3IubW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUoKVxuXG4gICAgaWYgdHlwZSBpc250ICdsaW5ld2lzZSdcbiAgICAgIEBlZGl0b3IubW92ZUxlZnQoKVxuICAgIEB2aW1TdGF0ZS5hY3RpdmF0ZU5vcm1hbE1vZGUoKVxuXG4gICMgUHJpdmF0ZTogSGVscGVyIHRvIGRldGVybWluZSBpZiB0aGUgZWRpdG9yIGlzIGN1cnJlbnRseSBvbiB0aGUgbGFzdCByb3cuXG4gICNcbiAgIyBSZXR1cm5zIHRydWUgb24gdGhlIGxhc3Qgcm93IGFuZCBmYWxzZSBvdGhlcndpc2UuXG4gIG9uTGFzdFJvdzogLT5cbiAgICB7cm93LCBjb2x1bW59ID0gQGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgcm93IGlzIEBlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0TGFzdFJvdygpXG5cbiAgb25MYXN0Q29sdW1uOiAtPlxuICAgIEBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLmlzQXRFbmRPZkxpbmUoKVxuIl19
