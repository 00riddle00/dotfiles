(function() {
  var AdjustIndentation, Autoindent, Indent, Operator, Outdent, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('underscore-plus');

  Operator = require('./general-operators').Operator;

  AdjustIndentation = (function(superClass) {
    extend(AdjustIndentation, superClass);

    function AdjustIndentation() {
      return AdjustIndentation.__super__.constructor.apply(this, arguments);
    }

    AdjustIndentation.prototype.execute = function(count) {
      var i, len, mode, originalRanges, range;
      mode = this.vimState.mode;
      this.motion.select(count);
      originalRanges = this.editor.getSelectedBufferRanges();
      if (mode === 'visual') {
        this.editor.transact((function(_this) {
          return function() {
            return _.times(count != null ? count : 1, function() {
              return _this.indent();
            });
          };
        })(this));
      } else {
        this.indent();
      }
      this.editor.clearSelections();
      this.editor.getLastCursor().setBufferPosition([originalRanges.shift().start.row, 0]);
      for (i = 0, len = originalRanges.length; i < len; i++) {
        range = originalRanges[i];
        this.editor.addCursorAtBufferPosition([range.start.row, 0]);
      }
      this.editor.moveToFirstCharacterOfLine();
      return this.vimState.activateNormalMode();
    };

    return AdjustIndentation;

  })(Operator);

  Indent = (function(superClass) {
    extend(Indent, superClass);

    function Indent() {
      return Indent.__super__.constructor.apply(this, arguments);
    }

    Indent.prototype.indent = function() {
      return this.editor.indentSelectedRows();
    };

    return Indent;

  })(AdjustIndentation);

  Outdent = (function(superClass) {
    extend(Outdent, superClass);

    function Outdent() {
      return Outdent.__super__.constructor.apply(this, arguments);
    }

    Outdent.prototype.indent = function() {
      return this.editor.outdentSelectedRows();
    };

    return Outdent;

  })(AdjustIndentation);

  Autoindent = (function(superClass) {
    extend(Autoindent, superClass);

    function Autoindent() {
      return Autoindent.__super__.constructor.apply(this, arguments);
    }

    Autoindent.prototype.indent = function() {
      return this.editor.autoIndentSelectedRows();
    };

    return Autoindent;

  })(AdjustIndentation);

  module.exports = {
    Indent: Indent,
    Outdent: Outdent,
    Autoindent: Autoindent
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9vcGVyYXRvcnMvaW5kZW50LW9wZXJhdG9ycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDJEQUFBO0lBQUE7OztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0gsV0FBWSxPQUFBLENBQVEscUJBQVI7O0VBRVA7Ozs7Ozs7Z0NBQ0osT0FBQSxHQUFTLFNBQUMsS0FBRDtBQUNQLFVBQUE7TUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFFBQVEsQ0FBQztNQUNqQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBZSxLQUFmO01BQ0EsY0FBQSxHQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUE7TUFFakIsSUFBRyxJQUFBLEtBQVEsUUFBWDtRQUNFLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNmLENBQUMsQ0FBQyxLQUFGLGlCQUFRLFFBQVEsQ0FBaEIsRUFBbUIsU0FBQTtxQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBO1lBQUgsQ0FBbkI7VUFEZTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsRUFERjtPQUFBLE1BQUE7UUFJRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBSkY7O01BTUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQUE7TUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsQ0FBQSxDQUF1QixDQUFDLGlCQUF4QixDQUEwQyxDQUFDLGNBQWMsQ0FBQyxLQUFmLENBQUEsQ0FBc0IsQ0FBQyxLQUFLLENBQUMsR0FBOUIsRUFBbUMsQ0FBbkMsQ0FBMUM7QUFDQSxXQUFBLGdEQUFBOztRQUNFLElBQUMsQ0FBQSxNQUFNLENBQUMseUJBQVIsQ0FBa0MsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQWIsRUFBa0IsQ0FBbEIsQ0FBbEM7QUFERjtNQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsMEJBQVIsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFRLENBQUMsa0JBQVYsQ0FBQTtJQWhCTzs7OztLQURxQjs7RUFtQjFCOzs7Ozs7O3FCQUNKLE1BQUEsR0FBUSxTQUFBO2FBQ04sSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixDQUFBO0lBRE07Ozs7S0FEVzs7RUFJZjs7Ozs7OztzQkFDSixNQUFBLEdBQVEsU0FBQTthQUNOLElBQUMsQ0FBQSxNQUFNLENBQUMsbUJBQVIsQ0FBQTtJQURNOzs7O0tBRFk7O0VBSWhCOzs7Ozs7O3lCQUNKLE1BQUEsR0FBUSxTQUFBO2FBQ04sSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUFBO0lBRE07Ozs7S0FEZTs7RUFJekIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFBQyxRQUFBLE1BQUQ7SUFBUyxTQUFBLE9BQVQ7SUFBa0IsWUFBQSxVQUFsQjs7QUFsQ2pCIiwic291cmNlc0NvbnRlbnQiOlsiXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcbntPcGVyYXRvcn0gPSByZXF1aXJlICcuL2dlbmVyYWwtb3BlcmF0b3JzJ1xuXG5jbGFzcyBBZGp1c3RJbmRlbnRhdGlvbiBleHRlbmRzIE9wZXJhdG9yXG4gIGV4ZWN1dGU6IChjb3VudCkgLT5cbiAgICBtb2RlID0gQHZpbVN0YXRlLm1vZGVcbiAgICBAbW90aW9uLnNlbGVjdChjb3VudClcbiAgICBvcmlnaW5hbFJhbmdlcyA9IEBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKVxuXG4gICAgaWYgbW9kZSBpcyAndmlzdWFsJ1xuICAgICAgQGVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgICBfLnRpbWVzKGNvdW50ID8gMSwgPT4gQGluZGVudCgpKVxuICAgIGVsc2VcbiAgICAgIEBpbmRlbnQoKVxuXG4gICAgQGVkaXRvci5jbGVhclNlbGVjdGlvbnMoKVxuICAgIEBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLnNldEJ1ZmZlclBvc2l0aW9uKFtvcmlnaW5hbFJhbmdlcy5zaGlmdCgpLnN0YXJ0LnJvdywgMF0pXG4gICAgZm9yIHJhbmdlIGluIG9yaWdpbmFsUmFuZ2VzXG4gICAgICBAZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24oW3JhbmdlLnN0YXJ0LnJvdywgMF0pXG4gICAgQGVkaXRvci5tb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZSgpXG4gICAgQHZpbVN0YXRlLmFjdGl2YXRlTm9ybWFsTW9kZSgpXG5cbmNsYXNzIEluZGVudCBleHRlbmRzIEFkanVzdEluZGVudGF0aW9uXG4gIGluZGVudDogLT5cbiAgICBAZWRpdG9yLmluZGVudFNlbGVjdGVkUm93cygpXG5cbmNsYXNzIE91dGRlbnQgZXh0ZW5kcyBBZGp1c3RJbmRlbnRhdGlvblxuICBpbmRlbnQ6IC0+XG4gICAgQGVkaXRvci5vdXRkZW50U2VsZWN0ZWRSb3dzKClcblxuY2xhc3MgQXV0b2luZGVudCBleHRlbmRzIEFkanVzdEluZGVudGF0aW9uXG4gIGluZGVudDogLT5cbiAgICBAZWRpdG9yLmF1dG9JbmRlbnRTZWxlY3RlZFJvd3MoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtJbmRlbnQsIE91dGRlbnQsIEF1dG9pbmRlbnR9XG4iXX0=
