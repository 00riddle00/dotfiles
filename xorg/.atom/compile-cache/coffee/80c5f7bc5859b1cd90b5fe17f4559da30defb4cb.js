(function() {
  var Input, ViewModel, VimNormalModeInputElement;

  VimNormalModeInputElement = require('./vim-normal-mode-input-element');

  ViewModel = (function() {
    function ViewModel(operation, opts) {
      var ref;
      this.operation = operation;
      if (opts == null) {
        opts = {};
      }
      ref = this.operation, this.editor = ref.editor, this.vimState = ref.vimState;
      this.view = new VimNormalModeInputElement().initialize(this, atom.views.getView(this.editor), opts);
      this.editor.normalModeInputView = this.view;
      this.vimState.onDidFailToCompose((function(_this) {
        return function() {
          return _this.view.remove();
        };
      })(this));
    }

    ViewModel.prototype.confirm = function(view) {
      return this.vimState.pushOperations(new Input(this.view.value));
    };

    ViewModel.prototype.cancel = function(view) {
      if (this.vimState.isOperatorPending()) {
        this.vimState.pushOperations(new Input(''));
      }
      return delete this.editor.normalModeInputView;
    };

    return ViewModel;

  })();

  Input = (function() {
    function Input(characters) {
      this.characters = characters;
    }

    Input.prototype.isComplete = function() {
      return true;
    };

    Input.prototype.isRecordable = function() {
      return true;
    };

    return Input;

  })();

  module.exports = {
    ViewModel: ViewModel,
    Input: Input
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi92aWV3LW1vZGVscy92aWV3LW1vZGVsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEseUJBQUEsR0FBNEIsT0FBQSxDQUFRLGlDQUFSOztFQUV0QjtJQUNTLG1CQUFDLFNBQUQsRUFBYSxJQUFiO0FBQ1gsVUFBQTtNQURZLElBQUMsQ0FBQSxZQUFEOztRQUFZLE9BQUs7O01BQzdCLE1BQXVCLElBQUMsQ0FBQSxTQUF4QixFQUFDLElBQUMsQ0FBQSxhQUFBLE1BQUYsRUFBVSxJQUFDLENBQUEsZUFBQTtNQUNYLElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSx5QkFBQSxDQUFBLENBQTJCLENBQUMsVUFBNUIsQ0FBdUMsSUFBdkMsRUFBNkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUMsQ0FBQSxNQUFwQixDQUE3QyxFQUEwRSxJQUExRTtNQUNaLElBQUMsQ0FBQSxNQUFNLENBQUMsbUJBQVIsR0FBOEIsSUFBQyxDQUFBO01BQy9CLElBQUMsQ0FBQSxRQUFRLENBQUMsa0JBQVYsQ0FBNkIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCO0lBSlc7O3dCQU1iLE9BQUEsR0FBUyxTQUFDLElBQUQ7YUFDUCxJQUFDLENBQUEsUUFBUSxDQUFDLGNBQVYsQ0FBNkIsSUFBQSxLQUFBLENBQU0sSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFaLENBQTdCO0lBRE87O3dCQUdULE1BQUEsR0FBUSxTQUFDLElBQUQ7TUFDTixJQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsaUJBQVYsQ0FBQSxDQUFIO1FBQ0UsSUFBQyxDQUFBLFFBQVEsQ0FBQyxjQUFWLENBQTZCLElBQUEsS0FBQSxDQUFNLEVBQU4sQ0FBN0IsRUFERjs7YUFFQSxPQUFPLElBQUMsQ0FBQSxNQUFNLENBQUM7SUFIVDs7Ozs7O0VBS0o7SUFDUyxlQUFDLFVBQUQ7TUFBQyxJQUFDLENBQUEsYUFBRDtJQUFEOztvQkFDYixVQUFBLEdBQVksU0FBQTthQUFHO0lBQUg7O29CQUNaLFlBQUEsR0FBYyxTQUFBO2FBQUc7SUFBSDs7Ozs7O0VBRWhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQ2YsV0FBQSxTQURlO0lBQ0osT0FBQSxLQURJOztBQXRCakIiLCJzb3VyY2VzQ29udGVudCI6WyJWaW1Ob3JtYWxNb2RlSW5wdXRFbGVtZW50ID0gcmVxdWlyZSAnLi92aW0tbm9ybWFsLW1vZGUtaW5wdXQtZWxlbWVudCdcblxuY2xhc3MgVmlld01vZGVsXG4gIGNvbnN0cnVjdG9yOiAoQG9wZXJhdGlvbiwgb3B0cz17fSkgLT5cbiAgICB7QGVkaXRvciwgQHZpbVN0YXRlfSA9IEBvcGVyYXRpb25cbiAgICBAdmlldyA9IG5ldyBWaW1Ob3JtYWxNb2RlSW5wdXRFbGVtZW50KCkuaW5pdGlhbGl6ZSh0aGlzLCBhdG9tLnZpZXdzLmdldFZpZXcoQGVkaXRvciksIG9wdHMpXG4gICAgQGVkaXRvci5ub3JtYWxNb2RlSW5wdXRWaWV3ID0gQHZpZXdcbiAgICBAdmltU3RhdGUub25EaWRGYWlsVG9Db21wb3NlID0+IEB2aWV3LnJlbW92ZSgpXG5cbiAgY29uZmlybTogKHZpZXcpIC0+XG4gICAgQHZpbVN0YXRlLnB1c2hPcGVyYXRpb25zKG5ldyBJbnB1dChAdmlldy52YWx1ZSkpXG5cbiAgY2FuY2VsOiAodmlldykgLT5cbiAgICBpZiBAdmltU3RhdGUuaXNPcGVyYXRvclBlbmRpbmcoKVxuICAgICAgQHZpbVN0YXRlLnB1c2hPcGVyYXRpb25zKG5ldyBJbnB1dCgnJykpXG4gICAgZGVsZXRlIEBlZGl0b3Iubm9ybWFsTW9kZUlucHV0Vmlld1xuXG5jbGFzcyBJbnB1dFxuICBjb25zdHJ1Y3RvcjogKEBjaGFyYWN0ZXJzKSAtPlxuICBpc0NvbXBsZXRlOiAtPiB0cnVlXG4gIGlzUmVjb3JkYWJsZTogLT4gdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVmlld01vZGVsLCBJbnB1dFxufVxuIl19
