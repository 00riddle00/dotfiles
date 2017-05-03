(function() {
  var MotionWithInput, MoveToFirstCharacterOfLine, MoveToMark, Point, Range, ViewModel, ref, ref1,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('./general-motions'), MotionWithInput = ref.MotionWithInput, MoveToFirstCharacterOfLine = ref.MoveToFirstCharacterOfLine;

  ViewModel = require('../view-models/view-model').ViewModel;

  ref1 = require('atom'), Point = ref1.Point, Range = ref1.Range;

  module.exports = MoveToMark = (function(superClass) {
    extend(MoveToMark, superClass);

    function MoveToMark(editor, vimState, linewise) {
      this.editor = editor;
      this.vimState = vimState;
      this.linewise = linewise != null ? linewise : true;
      MoveToMark.__super__.constructor.call(this, this.editor, this.vimState);
      this.operatesLinewise = this.linewise;
      this.viewModel = new ViewModel(this, {
        "class": 'move-to-mark',
        singleChar: true,
        hidden: true
      });
    }

    MoveToMark.prototype.isLinewise = function() {
      return this.linewise;
    };

    MoveToMark.prototype.moveCursor = function(cursor, count) {
      var markPosition;
      if (count == null) {
        count = 1;
      }
      markPosition = this.vimState.getMark(this.input.characters);
      if (this.input.characters === '`') {
        if (markPosition == null) {
          markPosition = [0, 0];
        }
        this.vimState.setMark('`', cursor.getBufferPosition());
      }
      if (markPosition != null) {
        cursor.setBufferPosition(markPosition);
      }
      if (this.linewise) {
        return cursor.moveToFirstCharacterOfLine();
      }
    };

    return MoveToMark;

  })(MotionWithInput);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9tb3Rpb25zL21vdmUtdG8tbWFyay1tb3Rpb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwyRkFBQTtJQUFBOzs7RUFBQSxNQUFnRCxPQUFBLENBQVEsbUJBQVIsQ0FBaEQsRUFBQyxxQ0FBRCxFQUFrQjs7RUFDakIsWUFBYSxPQUFBLENBQVEsMkJBQVI7O0VBQ2QsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxrQkFBRCxFQUFROztFQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNTLG9CQUFDLE1BQUQsRUFBVSxRQUFWLEVBQXFCLFFBQXJCO01BQUMsSUFBQyxDQUFBLFNBQUQ7TUFBUyxJQUFDLENBQUEsV0FBRDtNQUFXLElBQUMsQ0FBQSw4QkFBRCxXQUFVO01BQzFDLDRDQUFNLElBQUMsQ0FBQSxNQUFQLEVBQWUsSUFBQyxDQUFBLFFBQWhCO01BQ0EsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUMsQ0FBQTtNQUNyQixJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLFNBQUEsQ0FBVSxJQUFWLEVBQWdCO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxjQUFQO1FBQXVCLFVBQUEsRUFBWSxJQUFuQztRQUF5QyxNQUFBLEVBQVEsSUFBakQ7T0FBaEI7SUFITjs7eUJBS2IsVUFBQSxHQUFZLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSjs7eUJBRVosVUFBQSxHQUFZLFNBQUMsTUFBRCxFQUFTLEtBQVQ7QUFDVixVQUFBOztRQURtQixRQUFNOztNQUN6QixZQUFBLEdBQWUsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQWtCLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBekI7TUFFZixJQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxLQUFxQixHQUF4Qjs7VUFDRSxlQUFnQixDQUFDLENBQUQsRUFBSSxDQUFKOztRQUNoQixJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBa0IsR0FBbEIsRUFBdUIsTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBdkIsRUFGRjs7TUFJQSxJQUEwQyxvQkFBMUM7UUFBQSxNQUFNLENBQUMsaUJBQVAsQ0FBeUIsWUFBekIsRUFBQTs7TUFDQSxJQUFHLElBQUMsQ0FBQSxRQUFKO2VBQ0UsTUFBTSxDQUFDLDBCQUFQLENBQUEsRUFERjs7SUFSVTs7OztLQVJXO0FBTHpCIiwic291cmNlc0NvbnRlbnQiOlsie01vdGlvbldpdGhJbnB1dCwgTW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmV9ID0gcmVxdWlyZSAnLi9nZW5lcmFsLW1vdGlvbnMnXG57Vmlld01vZGVsfSA9IHJlcXVpcmUgJy4uL3ZpZXctbW9kZWxzL3ZpZXctbW9kZWwnXG57UG9pbnQsIFJhbmdlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIE1vdmVUb01hcmsgZXh0ZW5kcyBNb3Rpb25XaXRoSW5wdXRcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBAdmltU3RhdGUsIEBsaW5ld2lzZT10cnVlKSAtPlxuICAgIHN1cGVyKEBlZGl0b3IsIEB2aW1TdGF0ZSlcbiAgICBAb3BlcmF0ZXNMaW5ld2lzZSA9IEBsaW5ld2lzZVxuICAgIEB2aWV3TW9kZWwgPSBuZXcgVmlld01vZGVsKHRoaXMsIGNsYXNzOiAnbW92ZS10by1tYXJrJywgc2luZ2xlQ2hhcjogdHJ1ZSwgaGlkZGVuOiB0cnVlKVxuXG4gIGlzTGluZXdpc2U6IC0+IEBsaW5ld2lzZVxuXG4gIG1vdmVDdXJzb3I6IChjdXJzb3IsIGNvdW50PTEpIC0+XG4gICAgbWFya1Bvc2l0aW9uID0gQHZpbVN0YXRlLmdldE1hcmsoQGlucHV0LmNoYXJhY3RlcnMpXG5cbiAgICBpZiBAaW5wdXQuY2hhcmFjdGVycyBpcyAnYCcgIyBkb3VibGUgJ2AnIHByZXNzZWRcbiAgICAgIG1hcmtQb3NpdGlvbiA/PSBbMCwgMF0gIyBpZiBtYXJrUG9zaXRpb24gbm90IHNldCwgZ28gdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgZmlsZVxuICAgICAgQHZpbVN0YXRlLnNldE1hcmsoJ2AnLCBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKSlcblxuICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihtYXJrUG9zaXRpb24pIGlmIG1hcmtQb3NpdGlvbj9cbiAgICBpZiBAbGluZXdpc2VcbiAgICAgIGN1cnNvci5tb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZSgpXG4iXX0=
