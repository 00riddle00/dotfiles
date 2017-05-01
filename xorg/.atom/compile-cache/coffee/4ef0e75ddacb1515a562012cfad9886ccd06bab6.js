(function() {
  var ContentsByMode, StatusBarManager;

  ContentsByMode = {
    'insert': ["status-bar-vim-mode-insert", "Insert"],
    'insert.replace': ["status-bar-vim-mode-insert", "Replace"],
    'normal': ["status-bar-vim-mode-normal", "Normal"],
    'visual': ["status-bar-vim-mode-visual", "Visual"],
    'visual.characterwise': ["status-bar-vim-mode-visual", "Visual"],
    'visual.linewise': ["status-bar-vim-mode-visual", "Visual Line"],
    'visual.blockwise': ["status-bar-vim-mode-visual", "Visual Block"]
  };

  module.exports = StatusBarManager = (function() {
    function StatusBarManager() {
      this.element = document.createElement("div");
      this.element.id = "status-bar-vim-mode";
      this.container = document.createElement("div");
      this.container.className = "inline-block";
      this.container.appendChild(this.element);
    }

    StatusBarManager.prototype.initialize = function(statusBar) {
      this.statusBar = statusBar;
    };

    StatusBarManager.prototype.update = function(currentMode, currentSubmode) {
      var klass, newContents, text;
      if (currentSubmode != null) {
        currentMode = currentMode + "." + currentSubmode;
      }
      if (newContents = ContentsByMode[currentMode]) {
        klass = newContents[0], text = newContents[1];
        this.element.className = klass;
        return this.element.textContent = text;
      } else {
        return this.hide();
      }
    };

    StatusBarManager.prototype.hide = function() {
      return this.element.className = 'hidden';
    };

    StatusBarManager.prototype.attach = function() {
      return this.tile = this.statusBar.addRightTile({
        item: this.container,
        priority: 20
      });
    };

    StatusBarManager.prototype.detach = function() {
      return this.tile.destroy();
    };

    return StatusBarManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9zdGF0dXMtYmFyLW1hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxjQUFBLEdBQ0U7SUFBQSxRQUFBLEVBQVUsQ0FBQyw0QkFBRCxFQUErQixRQUEvQixDQUFWO0lBQ0EsZ0JBQUEsRUFBa0IsQ0FBQyw0QkFBRCxFQUErQixTQUEvQixDQURsQjtJQUVBLFFBQUEsRUFBVSxDQUFDLDRCQUFELEVBQStCLFFBQS9CLENBRlY7SUFHQSxRQUFBLEVBQVUsQ0FBQyw0QkFBRCxFQUErQixRQUEvQixDQUhWO0lBSUEsc0JBQUEsRUFBd0IsQ0FBQyw0QkFBRCxFQUErQixRQUEvQixDQUp4QjtJQUtBLGlCQUFBLEVBQW1CLENBQUMsNEJBQUQsRUFBK0IsYUFBL0IsQ0FMbkI7SUFNQSxrQkFBQSxFQUFvQixDQUFDLDRCQUFELEVBQStCLGNBQS9CLENBTnBCOzs7RUFRRixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MsMEJBQUE7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO01BQ1gsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULEdBQWM7TUFFZCxJQUFDLENBQUEsU0FBRCxHQUFhLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO01BQ2IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLEdBQXVCO01BQ3ZCLElBQUMsQ0FBQSxTQUFTLENBQUMsV0FBWCxDQUF1QixJQUFDLENBQUEsT0FBeEI7SUFOVzs7K0JBUWIsVUFBQSxHQUFZLFNBQUMsU0FBRDtNQUFDLElBQUMsQ0FBQSxZQUFEO0lBQUQ7OytCQUVaLE1BQUEsR0FBUSxTQUFDLFdBQUQsRUFBYyxjQUFkO0FBQ04sVUFBQTtNQUFBLElBQW9ELHNCQUFwRDtRQUFBLFdBQUEsR0FBYyxXQUFBLEdBQWMsR0FBZCxHQUFvQixlQUFsQzs7TUFDQSxJQUFHLFdBQUEsR0FBYyxjQUFlLENBQUEsV0FBQSxDQUFoQztRQUNHLHNCQUFELEVBQVE7UUFDUixJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsR0FBcUI7ZUFDckIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULEdBQXVCLEtBSHpCO09BQUEsTUFBQTtlQUtFLElBQUMsQ0FBQSxJQUFELENBQUEsRUFMRjs7SUFGTTs7K0JBU1IsSUFBQSxHQUFNLFNBQUE7YUFDSixJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsR0FBcUI7SUFEakI7OytCQUtOLE1BQUEsR0FBUSxTQUFBO2FBQ04sSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsU0FBUyxDQUFDLFlBQVgsQ0FBd0I7UUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLFNBQVA7UUFBa0IsUUFBQSxFQUFVLEVBQTVCO09BQXhCO0lBREY7OytCQUdSLE1BQUEsR0FBUSxTQUFBO2FBQ04sSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7SUFETTs7Ozs7QUF0Q1YiLCJzb3VyY2VzQ29udGVudCI6WyJDb250ZW50c0J5TW9kZSA9XG4gICdpbnNlcnQnOiBbXCJzdGF0dXMtYmFyLXZpbS1tb2RlLWluc2VydFwiLCBcIkluc2VydFwiXVxuICAnaW5zZXJ0LnJlcGxhY2UnOiBbXCJzdGF0dXMtYmFyLXZpbS1tb2RlLWluc2VydFwiLCBcIlJlcGxhY2VcIl1cbiAgJ25vcm1hbCc6IFtcInN0YXR1cy1iYXItdmltLW1vZGUtbm9ybWFsXCIsIFwiTm9ybWFsXCJdXG4gICd2aXN1YWwnOiBbXCJzdGF0dXMtYmFyLXZpbS1tb2RlLXZpc3VhbFwiLCBcIlZpc3VhbFwiXVxuICAndmlzdWFsLmNoYXJhY3Rlcndpc2UnOiBbXCJzdGF0dXMtYmFyLXZpbS1tb2RlLXZpc3VhbFwiLCBcIlZpc3VhbFwiXVxuICAndmlzdWFsLmxpbmV3aXNlJzogW1wic3RhdHVzLWJhci12aW0tbW9kZS12aXN1YWxcIiwgXCJWaXN1YWwgTGluZVwiXVxuICAndmlzdWFsLmJsb2Nrd2lzZSc6IFtcInN0YXR1cy1iYXItdmltLW1vZGUtdmlzdWFsXCIsIFwiVmlzdWFsIEJsb2NrXCJdXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFN0YXR1c0Jhck1hbmFnZXJcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgQGVsZW1lbnQuaWQgPSBcInN0YXR1cy1iYXItdmltLW1vZGVcIlxuXG4gICAgQGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICBAY29udGFpbmVyLmNsYXNzTmFtZSA9IFwiaW5saW5lLWJsb2NrXCJcbiAgICBAY29udGFpbmVyLmFwcGVuZENoaWxkKEBlbGVtZW50KVxuXG4gIGluaXRpYWxpemU6IChAc3RhdHVzQmFyKSAtPlxuXG4gIHVwZGF0ZTogKGN1cnJlbnRNb2RlLCBjdXJyZW50U3VibW9kZSkgLT5cbiAgICBjdXJyZW50TW9kZSA9IGN1cnJlbnRNb2RlICsgXCIuXCIgKyBjdXJyZW50U3VibW9kZSBpZiBjdXJyZW50U3VibW9kZT9cbiAgICBpZiBuZXdDb250ZW50cyA9IENvbnRlbnRzQnlNb2RlW2N1cnJlbnRNb2RlXVxuICAgICAgW2tsYXNzLCB0ZXh0XSA9IG5ld0NvbnRlbnRzXG4gICAgICBAZWxlbWVudC5jbGFzc05hbWUgPSBrbGFzc1xuICAgICAgQGVsZW1lbnQudGV4dENvbnRlbnQgPSB0ZXh0XG4gICAgZWxzZVxuICAgICAgQGhpZGUoKVxuXG4gIGhpZGU6IC0+XG4gICAgQGVsZW1lbnQuY2xhc3NOYW1lID0gJ2hpZGRlbidcblxuICAjIFByaXZhdGVcblxuICBhdHRhY2g6IC0+XG4gICAgQHRpbGUgPSBAc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZShpdGVtOiBAY29udGFpbmVyLCBwcmlvcml0eTogMjApXG5cbiAgZGV0YWNoOiAtPlxuICAgIEB0aWxlLmRlc3Ryb3koKVxuIl19
