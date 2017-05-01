(function() {
  var OperatorWithInput, Range, Replace, ViewModel, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('underscore-plus');

  OperatorWithInput = require('./general-operators').OperatorWithInput;

  ViewModel = require('../view-models/view-model').ViewModel;

  Range = require('atom').Range;

  module.exports = Replace = (function(superClass) {
    extend(Replace, superClass);

    function Replace(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      Replace.__super__.constructor.call(this, this.editor, this.vimState);
      this.viewModel = new ViewModel(this, {
        "class": 'replace',
        hidden: true,
        singleChar: true,
        defaultText: '\n'
      });
    }

    Replace.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.input.characters === "") {
        if (this.vimState.mode === "visual") {
          this.vimState.resetVisualMode();
        } else {
          this.vimState.activateNormalMode();
        }
        return;
      }
      this.editor.transact((function(_this) {
        return function() {
          var currentRowLength, cursor, i, j, len, len1, point, pos, ref, ref1, results, selection;
          if (_this.motion != null) {
            if (_.contains(_this.motion.select(), true)) {
              _this.editor.replaceSelectedText(null, function(text) {
                return text.replace(/./g, _this.input.characters);
              });
              ref = _this.editor.getSelections();
              results = [];
              for (i = 0, len = ref.length; i < len; i++) {
                selection = ref[i];
                point = selection.getBufferRange().start;
                results.push(selection.setBufferRange(Range.fromPointWithDelta(point, 0, 0)));
              }
              return results;
            }
          } else {
            ref1 = _this.editor.getCursors();
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              cursor = ref1[j];
              pos = cursor.getBufferPosition();
              currentRowLength = _this.editor.lineTextForBufferRow(pos.row).length;
              if (!(currentRowLength - pos.column >= count)) {
                continue;
              }
              _.times(count, function() {
                point = cursor.getBufferPosition();
                _this.editor.setTextInBufferRange(Range.fromPointWithDelta(point, 0, 1), _this.input.characters);
                return cursor.moveRight();
              });
              cursor.setBufferPosition(pos);
            }
            if (_this.input.characters === "\n") {
              _.times(count, function() {
                return _this.editor.moveDown();
              });
              return _this.editor.moveToFirstCharacterOfLine();
            }
          }
        };
      })(this));
      return this.vimState.activateNormalMode();
    };

    return Replace;

  })(OperatorWithInput);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9vcGVyYXRvcnMvcmVwbGFjZS1vcGVyYXRvci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLCtDQUFBO0lBQUE7OztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0gsb0JBQXFCLE9BQUEsQ0FBUSxxQkFBUjs7RUFDckIsWUFBYSxPQUFBLENBQVEsMkJBQVI7O0VBQ2IsUUFBUyxPQUFBLENBQVEsTUFBUjs7RUFFVixNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFDUyxpQkFBQyxNQUFELEVBQVUsUUFBVjtNQUFDLElBQUMsQ0FBQSxTQUFEO01BQVMsSUFBQyxDQUFBLFdBQUQ7TUFDckIseUNBQU0sSUFBQyxDQUFBLE1BQVAsRUFBZSxJQUFDLENBQUEsUUFBaEI7TUFDQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLFNBQUEsQ0FBVSxJQUFWLEVBQWdCO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxTQUFQO1FBQWtCLE1BQUEsRUFBUSxJQUExQjtRQUFnQyxVQUFBLEVBQVksSUFBNUM7UUFBa0QsV0FBQSxFQUFhLElBQS9EO09BQWhCO0lBRk47O3NCQUliLE9BQUEsR0FBUyxTQUFDLEtBQUQ7O1FBQUMsUUFBTTs7TUFDZCxJQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxLQUFxQixFQUF4QjtRQUdFLElBQUcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLEtBQWtCLFFBQXJCO1VBQ0UsSUFBQyxDQUFBLFFBQVEsQ0FBQyxlQUFWLENBQUEsRUFERjtTQUFBLE1BQUE7VUFHRSxJQUFDLENBQUEsUUFBUSxDQUFDLGtCQUFWLENBQUEsRUFIRjs7QUFLQSxlQVJGOztNQVVBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDZixjQUFBO1VBQUEsSUFBRyxvQkFBSDtZQUNFLElBQUcsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxLQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBQSxDQUFYLEVBQTZCLElBQTdCLENBQUg7Y0FDRSxLQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLENBQTRCLElBQTVCLEVBQWtDLFNBQUMsSUFBRDt1QkFDaEMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLEtBQUMsQ0FBQSxLQUFLLENBQUMsVUFBMUI7Y0FEZ0MsQ0FBbEM7QUFFQTtBQUFBO21CQUFBLHFDQUFBOztnQkFDRSxLQUFBLEdBQVEsU0FBUyxDQUFDLGNBQVYsQ0FBQSxDQUEwQixDQUFDOzZCQUNuQyxTQUFTLENBQUMsY0FBVixDQUF5QixLQUFLLENBQUMsa0JBQU4sQ0FBeUIsS0FBekIsRUFBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkMsQ0FBekI7QUFGRjs2QkFIRjthQURGO1dBQUEsTUFBQTtBQVFFO0FBQUEsaUJBQUEsd0NBQUE7O2NBQ0UsR0FBQSxHQUFNLE1BQU0sQ0FBQyxpQkFBUCxDQUFBO2NBQ04sZ0JBQUEsR0FBbUIsS0FBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixHQUFHLENBQUMsR0FBakMsQ0FBcUMsQ0FBQztjQUN6RCxJQUFBLENBQUEsQ0FBZ0IsZ0JBQUEsR0FBbUIsR0FBRyxDQUFDLE1BQXZCLElBQWlDLEtBQWpELENBQUE7QUFBQSx5QkFBQTs7Y0FFQSxDQUFDLENBQUMsS0FBRixDQUFRLEtBQVIsRUFBZSxTQUFBO2dCQUNiLEtBQUEsR0FBUSxNQUFNLENBQUMsaUJBQVAsQ0FBQTtnQkFDUixLQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLEtBQUssQ0FBQyxrQkFBTixDQUF5QixLQUF6QixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQyxDQUE3QixFQUFvRSxLQUFDLENBQUEsS0FBSyxDQUFDLFVBQTNFO3VCQUNBLE1BQU0sQ0FBQyxTQUFQLENBQUE7Y0FIYSxDQUFmO2NBSUEsTUFBTSxDQUFDLGlCQUFQLENBQXlCLEdBQXpCO0FBVEY7WUFhQSxJQUFHLEtBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxLQUFxQixJQUF4QjtjQUNFLENBQUMsQ0FBQyxLQUFGLENBQVEsS0FBUixFQUFlLFNBQUE7dUJBQ2IsS0FBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQUE7Y0FEYSxDQUFmO3FCQUVBLEtBQUMsQ0FBQSxNQUFNLENBQUMsMEJBQVIsQ0FBQSxFQUhGO2FBckJGOztRQURlO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjthQTJCQSxJQUFDLENBQUEsUUFBUSxDQUFDLGtCQUFWLENBQUE7SUF0Q087Ozs7S0FMVztBQU50QiIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG57T3BlcmF0b3JXaXRoSW5wdXR9ID0gcmVxdWlyZSAnLi9nZW5lcmFsLW9wZXJhdG9ycydcbntWaWV3TW9kZWx9ID0gcmVxdWlyZSAnLi4vdmlldy1tb2RlbHMvdmlldy1tb2RlbCdcbntSYW5nZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBSZXBsYWNlIGV4dGVuZHMgT3BlcmF0b3JXaXRoSW5wdXRcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBAdmltU3RhdGUpIC0+XG4gICAgc3VwZXIoQGVkaXRvciwgQHZpbVN0YXRlKVxuICAgIEB2aWV3TW9kZWwgPSBuZXcgVmlld01vZGVsKHRoaXMsIGNsYXNzOiAncmVwbGFjZScsIGhpZGRlbjogdHJ1ZSwgc2luZ2xlQ2hhcjogdHJ1ZSwgZGVmYXVsdFRleHQ6ICdcXG4nKVxuXG4gIGV4ZWN1dGU6IChjb3VudD0xKSAtPlxuICAgIGlmIEBpbnB1dC5jaGFyYWN0ZXJzIGlzIFwiXCJcbiAgICAgICMgcmVwbGFjZSBjYW5jZWxlZFxuXG4gICAgICBpZiBAdmltU3RhdGUubW9kZSBpcyBcInZpc3VhbFwiXG4gICAgICAgIEB2aW1TdGF0ZS5yZXNldFZpc3VhbE1vZGUoKVxuICAgICAgZWxzZVxuICAgICAgICBAdmltU3RhdGUuYWN0aXZhdGVOb3JtYWxNb2RlKClcblxuICAgICAgcmV0dXJuXG5cbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBpZiBAbW90aW9uP1xuICAgICAgICBpZiBfLmNvbnRhaW5zKEBtb3Rpb24uc2VsZWN0KCksIHRydWUpXG4gICAgICAgICAgQGVkaXRvci5yZXBsYWNlU2VsZWN0ZWRUZXh0IG51bGwsICh0ZXh0KSA9PlxuICAgICAgICAgICAgdGV4dC5yZXBsYWNlKC8uL2csIEBpbnB1dC5jaGFyYWN0ZXJzKVxuICAgICAgICAgIGZvciBzZWxlY3Rpb24gaW4gQGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgICAgICAgICAgIHBvaW50ID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuc3RhcnRcbiAgICAgICAgICAgIHNlbGVjdGlvbi5zZXRCdWZmZXJSYW5nZShSYW5nZS5mcm9tUG9pbnRXaXRoRGVsdGEocG9pbnQsIDAsIDApKVxuICAgICAgZWxzZVxuICAgICAgICBmb3IgY3Vyc29yIGluIEBlZGl0b3IuZ2V0Q3Vyc29ycygpXG4gICAgICAgICAgcG9zID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICAgICAgICBjdXJyZW50Um93TGVuZ3RoID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhwb3Mucm93KS5sZW5ndGhcbiAgICAgICAgICBjb250aW51ZSB1bmxlc3MgY3VycmVudFJvd0xlbmd0aCAtIHBvcy5jb2x1bW4gPj0gY291bnRcblxuICAgICAgICAgIF8udGltZXMgY291bnQsID0+XG4gICAgICAgICAgICBwb2ludCA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICAgICAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKFJhbmdlLmZyb21Qb2ludFdpdGhEZWx0YShwb2ludCwgMCwgMSksIEBpbnB1dC5jaGFyYWN0ZXJzKVxuICAgICAgICAgICAgY3Vyc29yLm1vdmVSaWdodCgpXG4gICAgICAgICAgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHBvcylcblxuICAgICAgICAjIFNwZWNpYWwgY2FzZTogd2hlbiByZXBsYWNlZCB3aXRoIGEgbmV3bGluZSBtb3ZlIHRvIHRoZSBzdGFydCBvZiB0aGVcbiAgICAgICAgIyBuZXh0IHJvdy5cbiAgICAgICAgaWYgQGlucHV0LmNoYXJhY3RlcnMgaXMgXCJcXG5cIlxuICAgICAgICAgIF8udGltZXMgY291bnQsID0+XG4gICAgICAgICAgICBAZWRpdG9yLm1vdmVEb3duKClcbiAgICAgICAgICBAZWRpdG9yLm1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lKClcblxuICAgIEB2aW1TdGF0ZS5hY3RpdmF0ZU5vcm1hbE1vZGUoKVxuIl19
