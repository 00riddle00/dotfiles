(function() {
  var Decrease, Increase, Operator, Range, settings,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Operator = require('./general-operators').Operator;

  Range = require('atom').Range;

  settings = require('../settings');

  Increase = (function(superClass) {
    extend(Increase, superClass);

    Increase.prototype.step = 1;

    function Increase() {
      Increase.__super__.constructor.apply(this, arguments);
      this.complete = true;
      this.numberRegex = new RegExp(settings.numberRegex());
    }

    Increase.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.editor.transact((function(_this) {
        return function() {
          var cursor, i, increased, len, ref;
          increased = false;
          ref = _this.editor.getCursors();
          for (i = 0, len = ref.length; i < len; i++) {
            cursor = ref[i];
            if (_this.increaseNumber(count, cursor)) {
              increased = true;
            }
          }
          if (!increased) {
            return atom.beep();
          }
        };
      })(this));
    };

    Increase.prototype.increaseNumber = function(count, cursor) {
      var cursorPosition, newValue, numEnd, numStart, number, range;
      cursorPosition = cursor.getBufferPosition();
      numEnd = cursor.getEndOfCurrentWordBufferPosition({
        wordRegex: this.numberRegex,
        allowNext: false
      });
      if (numEnd.column === cursorPosition.column) {
        numEnd = cursor.getEndOfCurrentWordBufferPosition({
          wordRegex: this.numberRegex,
          allowNext: true
        });
        if (numEnd.row !== cursorPosition.row) {
          return;
        }
        if (numEnd.column === cursorPosition.column) {
          return;
        }
      }
      cursor.setBufferPosition(numEnd);
      numStart = cursor.getBeginningOfCurrentWordBufferPosition({
        wordRegex: this.numberRegex,
        allowPrevious: false
      });
      range = new Range(numStart, numEnd);
      number = parseInt(this.editor.getTextInBufferRange(range), 10);
      if (isNaN(number)) {
        cursor.setBufferPosition(cursorPosition);
        return;
      }
      number += this.step * count;
      newValue = String(number);
      this.editor.setTextInBufferRange(range, newValue, {
        normalizeLineEndings: false
      });
      cursor.setBufferPosition({
        row: numStart.row,
        column: numStart.column - 1 + newValue.length
      });
      return true;
    };

    return Increase;

  })(Operator);

  Decrease = (function(superClass) {
    extend(Decrease, superClass);

    function Decrease() {
      return Decrease.__super__.constructor.apply(this, arguments);
    }

    Decrease.prototype.step = -1;

    return Decrease;

  })(Increase);

  module.exports = {
    Increase: Increase,
    Decrease: Decrease
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9vcGVyYXRvcnMvaW5jcmVhc2Utb3BlcmF0b3JzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNkNBQUE7SUFBQTs7O0VBQUMsV0FBWSxPQUFBLENBQVEscUJBQVI7O0VBQ1osUUFBUyxPQUFBLENBQVEsTUFBUjs7RUFDVixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBS0w7Ozt1QkFDSixJQUFBLEdBQU07O0lBRU8sa0JBQUE7TUFDWCwyQ0FBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQUEsQ0FBUDtJQUhSOzt1QkFLYixPQUFBLEdBQVMsU0FBQyxLQUFEOztRQUFDLFFBQU07O2FBQ2QsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUNmLGNBQUE7VUFBQSxTQUFBLEdBQVk7QUFDWjtBQUFBLGVBQUEscUNBQUE7O1lBQ0UsSUFBRyxLQUFDLENBQUEsY0FBRCxDQUFnQixLQUFoQixFQUF1QixNQUF2QixDQUFIO2NBQXVDLFNBQUEsR0FBWSxLQUFuRDs7QUFERjtVQUVBLElBQUEsQ0FBbUIsU0FBbkI7bUJBQUEsSUFBSSxDQUFDLElBQUwsQ0FBQSxFQUFBOztRQUplO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjtJQURPOzt1QkFPVCxjQUFBLEdBQWdCLFNBQUMsS0FBRCxFQUFRLE1BQVI7QUFFZCxVQUFBO01BQUEsY0FBQSxHQUFpQixNQUFNLENBQUMsaUJBQVAsQ0FBQTtNQUNqQixNQUFBLEdBQVMsTUFBTSxDQUFDLGlDQUFQLENBQXlDO1FBQUEsU0FBQSxFQUFXLElBQUMsQ0FBQSxXQUFaO1FBQXlCLFNBQUEsRUFBVyxLQUFwQztPQUF6QztNQUVULElBQUcsTUFBTSxDQUFDLE1BQVAsS0FBaUIsY0FBYyxDQUFDLE1BQW5DO1FBRUUsTUFBQSxHQUFTLE1BQU0sQ0FBQyxpQ0FBUCxDQUF5QztVQUFBLFNBQUEsRUFBVyxJQUFDLENBQUEsV0FBWjtVQUF5QixTQUFBLEVBQVcsSUFBcEM7U0FBekM7UUFDVCxJQUFVLE1BQU0sQ0FBQyxHQUFQLEtBQWdCLGNBQWMsQ0FBQyxHQUF6QztBQUFBLGlCQUFBOztRQUNBLElBQVUsTUFBTSxDQUFDLE1BQVAsS0FBaUIsY0FBYyxDQUFDLE1BQTFDO0FBQUEsaUJBQUE7U0FKRjs7TUFNQSxNQUFNLENBQUMsaUJBQVAsQ0FBeUIsTUFBekI7TUFDQSxRQUFBLEdBQVcsTUFBTSxDQUFDLHVDQUFQLENBQStDO1FBQUEsU0FBQSxFQUFXLElBQUMsQ0FBQSxXQUFaO1FBQXlCLGFBQUEsRUFBZSxLQUF4QztPQUEvQztNQUVYLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTSxRQUFOLEVBQWdCLE1BQWhCO01BR1osTUFBQSxHQUFTLFFBQUEsQ0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLEtBQTdCLENBQVQsRUFBOEMsRUFBOUM7TUFDVCxJQUFHLEtBQUEsQ0FBTSxNQUFOLENBQUg7UUFDRSxNQUFNLENBQUMsaUJBQVAsQ0FBeUIsY0FBekI7QUFDQSxlQUZGOztNQUlBLE1BQUEsSUFBVSxJQUFDLENBQUEsSUFBRCxHQUFNO01BR2hCLFFBQUEsR0FBVyxNQUFBLENBQU8sTUFBUDtNQUNYLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsS0FBN0IsRUFBb0MsUUFBcEMsRUFBOEM7UUFBQSxvQkFBQSxFQUFzQixLQUF0QjtPQUE5QztNQUVBLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QjtRQUFBLEdBQUEsRUFBSyxRQUFRLENBQUMsR0FBZDtRQUFtQixNQUFBLEVBQVEsUUFBUSxDQUFDLE1BQVQsR0FBZ0IsQ0FBaEIsR0FBa0IsUUFBUSxDQUFDLE1BQXREO09BQXpCO0FBQ0EsYUFBTztJQTdCTzs7OztLQWZLOztFQThDakI7Ozs7Ozs7dUJBQ0osSUFBQSxHQUFNLENBQUM7Ozs7S0FEYzs7RUFHdkIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFBQyxVQUFBLFFBQUQ7SUFBVyxVQUFBLFFBQVg7O0FBeERqQiIsInNvdXJjZXNDb250ZW50IjpbIntPcGVyYXRvcn0gPSByZXF1aXJlICcuL2dlbmVyYWwtb3BlcmF0b3JzJ1xue1JhbmdlfSA9IHJlcXVpcmUgJ2F0b20nXG5zZXR0aW5ncyA9IHJlcXVpcmUgJy4uL3NldHRpbmdzJ1xuXG4jXG4jIEl0IGluY3JlYXNlcyBvciBkZWNyZWFzZXMgdGhlIG5leHQgbnVtYmVyIG9uIHRoZSBsaW5lXG4jXG5jbGFzcyBJbmNyZWFzZSBleHRlbmRzIE9wZXJhdG9yXG4gIHN0ZXA6IDFcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBzdXBlclxuICAgIEBjb21wbGV0ZSA9IHRydWVcbiAgICBAbnVtYmVyUmVnZXggPSBuZXcgUmVnRXhwKHNldHRpbmdzLm51bWJlclJlZ2V4KCkpXG5cbiAgZXhlY3V0ZTogKGNvdW50PTEpIC0+XG4gICAgQGVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgaW5jcmVhc2VkID0gZmFsc2VcbiAgICAgIGZvciBjdXJzb3IgaW4gQGVkaXRvci5nZXRDdXJzb3JzKClcbiAgICAgICAgaWYgQGluY3JlYXNlTnVtYmVyKGNvdW50LCBjdXJzb3IpIHRoZW4gaW5jcmVhc2VkID0gdHJ1ZVxuICAgICAgYXRvbS5iZWVwKCkgdW5sZXNzIGluY3JlYXNlZFxuXG4gIGluY3JlYXNlTnVtYmVyOiAoY291bnQsIGN1cnNvcikgLT5cbiAgICAjIGZpbmQgcG9zaXRpb24gb2YgY3VycmVudCBudW1iZXIsIGFkYXB0ZWQgZnJvbSBmcm9tIFNlYXJjaEN1cnJlbnRXb3JkXG4gICAgY3Vyc29yUG9zaXRpb24gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIG51bUVuZCA9IGN1cnNvci5nZXRFbmRPZkN1cnJlbnRXb3JkQnVmZmVyUG9zaXRpb24od29yZFJlZ2V4OiBAbnVtYmVyUmVnZXgsIGFsbG93TmV4dDogZmFsc2UpXG5cbiAgICBpZiBudW1FbmQuY29sdW1uIGlzIGN1cnNvclBvc2l0aW9uLmNvbHVtblxuICAgICAgIyBlaXRoZXIgd2UgZG9uJ3QgaGF2ZSBhIGN1cnJlbnQgbnVtYmVyLCBvciBpdCBlbmRzIG9uIGN1cnNvciwgaS5lLiBwcmVjZWRlcyBpdCwgc28gbG9vayBmb3IgdGhlIG5leHQgb25lXG4gICAgICBudW1FbmQgPSBjdXJzb3IuZ2V0RW5kT2ZDdXJyZW50V29yZEJ1ZmZlclBvc2l0aW9uKHdvcmRSZWdleDogQG51bWJlclJlZ2V4LCBhbGxvd05leHQ6IHRydWUpXG4gICAgICByZXR1cm4gaWYgbnVtRW5kLnJvdyBpc250IGN1cnNvclBvc2l0aW9uLnJvdyAjIGRvbid0IGxvb2sgYmV5b25kIHRoZSBjdXJyZW50IGxpbmVcbiAgICAgIHJldHVybiBpZiBudW1FbmQuY29sdW1uIGlzIGN1cnNvclBvc2l0aW9uLmNvbHVtbiAjIG5vIG51bWJlciBhZnRlciBjdXJzb3JcblxuICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbiBudW1FbmRcbiAgICBudW1TdGFydCA9IGN1cnNvci5nZXRCZWdpbm5pbmdPZkN1cnJlbnRXb3JkQnVmZmVyUG9zaXRpb24od29yZFJlZ2V4OiBAbnVtYmVyUmVnZXgsIGFsbG93UHJldmlvdXM6IGZhbHNlKVxuXG4gICAgcmFuZ2UgPSBuZXcgUmFuZ2UobnVtU3RhcnQsIG51bUVuZClcblxuICAgICMgcGFyc2UgbnVtYmVyLCBpbmNyZWFzZS9kZWNyZWFzZVxuICAgIG51bWJlciA9IHBhcnNlSW50KEBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpLCAxMClcbiAgICBpZiBpc05hTihudW1iZXIpXG4gICAgICBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24oY3Vyc29yUG9zaXRpb24pXG4gICAgICByZXR1cm5cblxuICAgIG51bWJlciArPSBAc3RlcCpjb3VudFxuXG4gICAgIyByZXBsYWNlIGN1cnJlbnQgbnVtYmVyIHdpdGggbmV3XG4gICAgbmV3VmFsdWUgPSBTdHJpbmcobnVtYmVyKVxuICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UsIG5ld1ZhbHVlLCBub3JtYWxpemVMaW5lRW5kaW5nczogZmFsc2UpXG5cbiAgICBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24ocm93OiBudW1TdGFydC5yb3csIGNvbHVtbjogbnVtU3RhcnQuY29sdW1uLTErbmV3VmFsdWUubGVuZ3RoKVxuICAgIHJldHVybiB0cnVlXG5cbmNsYXNzIERlY3JlYXNlIGV4dGVuZHMgSW5jcmVhc2VcbiAgc3RlcDogLTFcblxubW9kdWxlLmV4cG9ydHMgPSB7SW5jcmVhc2UsIERlY3JlYXNlfVxuIl19
