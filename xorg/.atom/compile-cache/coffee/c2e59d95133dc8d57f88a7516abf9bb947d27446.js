(function() {
  var Find, MotionWithInput, Point, Range, Till, ViewModel, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  MotionWithInput = require('./general-motions').MotionWithInput;

  ViewModel = require('../view-models/view-model').ViewModel;

  ref = require('atom'), Point = ref.Point, Range = ref.Range;

  Find = (function(superClass) {
    extend(Find, superClass);

    Find.prototype.operatesInclusively = true;

    function Find(editor, vimState, opts) {
      var orig;
      this.editor = editor;
      this.vimState = vimState;
      if (opts == null) {
        opts = {};
      }
      Find.__super__.constructor.call(this, this.editor, this.vimState);
      this.offset = 0;
      if (!opts.repeated) {
        this.viewModel = new ViewModel(this, {
          "class": 'find',
          singleChar: true,
          hidden: true
        });
        this.backwards = false;
        this.repeated = false;
        this.vimState.globalVimState.currentFind = this;
      } else {
        this.repeated = true;
        orig = this.vimState.globalVimState.currentFind;
        this.backwards = orig.backwards;
        this.complete = orig.complete;
        this.input = orig.input;
        if (opts.reverse) {
          this.reverse();
        }
      }
    }

    Find.prototype.match = function(cursor, count) {
      var currentPosition, i, index, j, k, line, ref1, ref2;
      currentPosition = cursor.getBufferPosition();
      line = this.editor.lineTextForBufferRow(currentPosition.row);
      if (this.backwards) {
        index = currentPosition.column;
        for (i = j = 0, ref1 = count - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
          if (index <= 0) {
            return;
          }
          index = line.lastIndexOf(this.input.characters, index - 1 - (this.offset * this.repeated));
        }
        if (index >= 0) {
          return new Point(currentPosition.row, index + this.offset);
        }
      } else {
        index = currentPosition.column;
        for (i = k = 0, ref2 = count - 1; 0 <= ref2 ? k <= ref2 : k >= ref2; i = 0 <= ref2 ? ++k : --k) {
          index = line.indexOf(this.input.characters, index + 1 + (this.offset * this.repeated));
          if (index < 0) {
            return;
          }
        }
        if (index >= 0) {
          return new Point(currentPosition.row, index - this.offset);
        }
      }
    };

    Find.prototype.reverse = function() {
      this.backwards = !this.backwards;
      return this;
    };

    Find.prototype.moveCursor = function(cursor, count) {
      var match;
      if (count == null) {
        count = 1;
      }
      if ((match = this.match(cursor, count)) != null) {
        return cursor.setBufferPosition(match);
      }
    };

    return Find;

  })(MotionWithInput);

  Till = (function(superClass) {
    extend(Till, superClass);

    function Till(editor, vimState, opts) {
      this.editor = editor;
      this.vimState = vimState;
      if (opts == null) {
        opts = {};
      }
      Till.__super__.constructor.call(this, this.editor, this.vimState, opts);
      this.offset = 1;
    }

    Till.prototype.match = function() {
      var retval;
      this.selectAtLeastOne = false;
      retval = Till.__super__.match.apply(this, arguments);
      if ((retval != null) && !this.backwards) {
        this.selectAtLeastOne = true;
      }
      return retval;
    };

    Till.prototype.moveSelectionInclusively = function(selection, count, options) {
      Till.__super__.moveSelectionInclusively.apply(this, arguments);
      if (selection.isEmpty() && this.selectAtLeastOne) {
        return selection.modifySelection(function() {
          return selection.cursor.moveRight();
        });
      }
    };

    return Till;

  })(Find);

  module.exports = {
    Find: Find,
    Till: Till
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9tb3Rpb25zL2ZpbmQtbW90aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEseURBQUE7SUFBQTs7O0VBQUMsa0JBQW1CLE9BQUEsQ0FBUSxtQkFBUjs7RUFDbkIsWUFBYSxPQUFBLENBQVEsMkJBQVI7O0VBQ2QsTUFBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxpQkFBRCxFQUFROztFQUVGOzs7bUJBQ0osbUJBQUEsR0FBcUI7O0lBRVIsY0FBQyxNQUFELEVBQVUsUUFBVixFQUFxQixJQUFyQjtBQUNYLFVBQUE7TUFEWSxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxXQUFEOztRQUFXLE9BQUs7O01BQ3JDLHNDQUFNLElBQUMsQ0FBQSxNQUFQLEVBQWUsSUFBQyxDQUFBLFFBQWhCO01BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUVWLElBQUcsQ0FBSSxJQUFJLENBQUMsUUFBWjtRQUNFLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsU0FBQSxDQUFVLElBQVYsRUFBZ0I7VUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLE1BQVA7VUFBZSxVQUFBLEVBQVksSUFBM0I7VUFBaUMsTUFBQSxFQUFRLElBQXpDO1NBQWhCO1FBQ2pCLElBQUMsQ0FBQSxTQUFELEdBQWE7UUFDYixJQUFDLENBQUEsUUFBRCxHQUFZO1FBQ1osSUFBQyxDQUFBLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBekIsR0FBdUMsS0FKekM7T0FBQSxNQUFBO1FBT0UsSUFBQyxDQUFBLFFBQUQsR0FBWTtRQUVaLElBQUEsR0FBTyxJQUFDLENBQUEsUUFBUSxDQUFDLGNBQWMsQ0FBQztRQUNoQyxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUksQ0FBQztRQUNsQixJQUFDLENBQUEsUUFBRCxHQUFZLElBQUksQ0FBQztRQUNqQixJ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bnRlbnQiOlsie01vdGlvbldpdGhJbnB1dH0gPSByZXF1aXJlICcuL2dlbmVyYWwtbW90aW9ucydcbntWaWV3TW9kZWx9ID0gcmVxdWlyZSAnLi4vdmlldy1tb2RlbHMvdmlldy1tb2RlbCdcbntQb2ludCwgUmFuZ2V9ID0gcmVxdWlyZSAnYXRvbSdcblxuY2xhc3MgRmluZCBleHRlbmRzIE1vdGlvbldpdGhJbnB1dFxuICBvcGVyYXRlc0luY2x1c2l2ZWx5OiB0cnVlXG5cbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBAdmltU3RhdGUsIG9wdHM9e30pIC0+XG4gICAgc3VwZXIoQGVkaXRvciwgQHZpbVN0YXRlKVxuICAgIEBvZmZzZXQgPSAwXG5cbiAgICBpZiBub3Qgb3B0cy5yZXBlYXRlZFxuICAgICAgQHZpZXdNb2RlbCA9IG5ldyBWaWV3TW9kZWwodGhpcywgY2xhc3M6ICdmaW5kJywgc2luZ2xlQ2hhcjogdHJ1ZSwgaGlkZGVuOiB0cnVlKVxuICAgICAgQGJhY2t3YXJkcyA9IGZhbHNlXG4gICAgICBAcmVwZWF0ZWQgPSBmYWxzZVxuICAgICAgQHZpbVN0YXRlLmdsb2JhbFZpbVN0YXRlLmN1cnJlbnRGaW5kID0gdGhpc1xuXG4gICAgZWxzZVxuICAgICAgQHJlcGVhdGVkID0gdHJ1ZVxuXG4gICAgICBvcmlnID0gQHZpbVN0YXRlLmdsb2JhbFZpbVN0YXRlLmN1cnJlbnRGaW5kXG4gICAgICBAYmFja3dhcmRzID0gb3JpZy5iYWNrd2FyZHNcbiAgICAgIEBjb21wbGV0ZSA9IG9yaWcuY29tcGxldGVcbiAgICAgIEBpbnB1dCA9IG9yaWcuaW5wdXRcblxuICAgICAgQHJldmVyc2UoKSBpZiBvcHRzLnJldmVyc2VcblxuICBtYXRjaDogKGN1cnNvciwgY291bnQpIC0+XG4gICAgY3VycmVudFBvc2l0aW9uID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjdXJyZW50UG9zaXRpb24ucm93KVxuICAgIGlmIEBiYWNrd2FyZHNcbiAgICAgIGluZGV4ID0gY3VycmVudFBvc2l0aW9uLmNvbHVtblxuICAgICAgZm9yIGkgaW4gWzAuLmNvdW50LTFdXG4gICAgICAgIHJldHVybiBpZiBpbmRleCA8PSAwICMgd2UgY2FuJ3QgbW92ZSBiYWNrd2FyZHMgYW55IGZ1cnRoZXIsIHF1aWNrIHJldHVyblxuICAgICAgICBpbmRleCA9IGxpbmUubGFzdEluZGV4T2YoQGlucHV0LmNoYXJhY3RlcnMsIGluZGV4LTEtKEBvZmZzZXQqQHJlcGVhdGVkKSlcbiAgICAgIGlmIGluZGV4ID49IDBcbiAgICAgICAgbmV3IFBvaW50KGN1cnJlbnRQb3NpdGlvbi5yb3csIGluZGV4ICsgQG9mZnNldClcbiAgICBlbHNlXG4gICAgICBpbmRleCA9IGN1cnJlbnRQb3NpdGlvbi5jb2x1bW5cbiAgICAgIGZvciBpIGluIFswLi5jb3VudC0xXVxuICAgICAgICBpbmRleCA9IGxpbmUuaW5kZXhPZihAaW5wdXQuY2hhcmFjdGVycywgaW5kZXgrMSsoQG9mZnNldCpAcmVwZWF0ZWQpKVxuICAgICAgICByZXR1cm4gaWYgaW5kZXggPCAwICMgbm8gbWF0Y2ggZm91bmRcbiAgICAgIGlmIGluZGV4ID49IDBcbiAgICAgICAgbmV3IFBvaW50KGN1cnJlbnRQb3NpdGlvbi5yb3csIGluZGV4IC0gQG9mZnNldClcblxuICByZXZlcnNlOiAtPlxuICAgIEBiYWNrd2FyZHMgPSBub3QgQGJhY2t3YXJkc1xuICAgIHRoaXNcblxuICBtb3ZlQ3Vyc29yOiAoY3Vyc29yLCBjb3VudD0xKSAtPlxuICAgIGlmIChtYXRjaCA9IEBtYXRjaChjdXJzb3IsIGNvdW50KSk/XG4gICAgICBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24obWF0Y2gpXG5cbmNsYXNzIFRpbGwgZXh0ZW5kcyBGaW5kXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvciwgQHZpbVN0YXRlLCBvcHRzPXt9KSAtPlxuICAgIHN1cGVyKEBlZGl0b3IsIEB2aW1TdGF0ZSwgb3B0cylcbiAgICBAb2Zmc2V0ID0gMVxuXG4gIG1hdGNoOiAtPlxuICAgIEBzZWxlY3RBdExlYXN0T25lID0gZmFsc2VcbiAgICByZXR2YWwgPSBzdXBlclxuICAgIGlmIHJldHZhbD8gYW5kIG5vdCBAYmFja3dhcmRzXG4gICAgICBAc2VsZWN0QXRMZWFzdE9uZSA9IHRydWVcbiAgICByZXR2YWxcblxuICBtb3ZlU2VsZWN0aW9uSW5jbHVzaXZlbHk6IChzZWxlY3Rpb24sIGNvdW50LCBvcHRpb25zKSAtPlxuICAgIHN1cGVyXG4gICAgaWYgc2VsZWN0aW9uLmlzRW1wdHkoKSBhbmQgQHNlbGVjdEF0TGVhc3RPbmVcbiAgICAgIHNlbGVjdGlvbi5tb2RpZnlTZWxlY3Rpb24gLT5cbiAgICAgICAgc2VsZWN0aW9uLmN1cnNvci5tb3ZlUmlnaHQoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtGaW5kLCBUaWxsfVxuIl19
