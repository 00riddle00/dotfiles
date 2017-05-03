(function() {
  var $, CompositeDisposable, InsertTableView, TextEditorView, View, config, ref, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View, TextEditorView = ref.TextEditorView;

  config = require("../config");

  utils = require("../utils");

  module.exports = InsertTableView = (function(superClass) {
    extend(InsertTableView, superClass);

    function InsertTableView() {
      return InsertTableView.__super__.constructor.apply(this, arguments);
    }

    InsertTableView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Table", {
            "class": "icon icon-diff-added"
          });
          return _this.div(function() {
            _this.label("Rows", {
              "class": "message"
            });
            _this.subview("rowEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Columns", {
              "class": "message"
            });
            return _this.subview("columnEditor", new TextEditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    InsertTableView.prototype.initialize = function() {
      utils.setTabIndex([this.rowEditor, this.columnEditor]);
      this.disposables = new CompositeDisposable();
      return this.disposables.add(atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.onConfirm();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      }));
    };

    InsertTableView.prototype.onConfirm = function() {
      var col, row;
      row = parseInt(this.rowEditor.getText(), 10);
      col = parseInt(this.columnEditor.getText(), 10);
      if (this.isValidRange(row, col)) {
        this.insertTable(row, col);
      }
      return this.detach();
    };

    InsertTableView.prototype.display = function() {
      this.editor = atom.workspace.getActiveTextEditor();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.rowEditor.setText("3");
      this.columnEditor.setText("3");
      this.panel.show();
      return this.rowEditor.focus();
    };

    InsertTableView.prototype.detach = function() {
      var ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((ref1 = this.previouslyFocusedElement) != null) {
          ref1.focus();
        }
      }
      return InsertTableView.__super__.detach.apply(this, arguments);
    };

    InsertTableView.prototype.detached = function() {
      var ref1;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return this.disposables = null;
    };

    InsertTableView.prototype.insertTable = function(row, col) {
      var cursor;
      cursor = this.editor.getCursorBufferPosition();
      this.editor.insertText(this.createTable(row, col));
      return this.editor.setCursorBufferPosition(cursor);
    };

    InsertTableView.prototype.createTable = function(row, col) {
      var i, options, ref1, table;
      options = {
        numOfColumns: col,
        extraPipes: config.get("tableExtraPipes"),
        columnWidth: 1,
        alignment: config.get("tableAlignment")
      };
      table = [];
      table.push(utils.createTableRow([], options));
      table.push(utils.createTableSeparator(options));
      for (i = 0, ref1 = row - 2; 0 <= ref1 ? i <= ref1 : i >= ref1; 0 <= ref1 ? i++ : i--) {
        table.push(utils.createTableRow([], options));
      }
      return table.join("\n");
    };

    InsertTableView.prototype.isValidRange = function(row, col) {
      if (isNaN(row) || isNaN(col)) {
        return false;
      }
      if (row < 2 || col < 1) {
        return false;
      }
      return true;
    };

    return InsertTableView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvaW5zZXJ0LXRhYmxlLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxpRkFBQTtJQUFBOzs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLE1BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUQsRUFBSSxlQUFKLEVBQVU7O0VBRVYsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztFQUNULEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUjs7RUFFUixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0osZUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sd0NBQVA7T0FBTCxFQUFzRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDcEQsS0FBQyxDQUFBLEtBQUQsQ0FBTyxjQUFQLEVBQXVCO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxzQkFBUDtXQUF2QjtpQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUE7WUFDSCxLQUFDLENBQUEsS0FBRCxDQUFPLE1BQVAsRUFBZTtjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sU0FBUDthQUFmO1lBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxXQUFULEVBQTBCLElBQUEsY0FBQSxDQUFlO2NBQUEsSUFBQSxFQUFNLElBQU47YUFBZixDQUExQjtZQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBUCxFQUFrQjtjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sU0FBUDthQUFsQjttQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLGNBQVQsRUFBNkIsSUFBQSxjQUFBLENBQWU7Y0FBQSxJQUFBLEVBQU0sSUFBTjthQUFmLENBQTdCO1VB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YSxDQUZiO1FBR0EsU0FBQSxFQUFXLE1BQU0sQ0FBQyxHQUFQLENBQVcsZ0JBQVgsQ0FIWDs7TUFLRixLQUFBLEdBQVE7TUFHUixLQUFLLENBQUMsSUFBTixDQUFXLEtBQUssQ0FBQyxjQUFOLENBQXFCLEVBQXJCLEVBQXlCLE9BQXpCLENBQVg7TUFFQSxLQUFLLENBQUMsSUFBTixDQUFXLEtBQUssQ0FBQyxvQkFBTixDQUEyQixPQUEzQixDQUFYO0FBRUEsV0FBa0QsK0VBQWxEO1FBQUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFLLENBQUMsY0FBTixDQUFxQixFQUFyQixFQUF5QixPQUF6QixDQUFYO0FBQUE7YUFFQSxLQUFLLENBQUMsSUFBTixDQUFXLElBQVg7SUFoQlc7OzhCQW1CYixZQUFBLEdBQWMsU0FBQyxHQUFELEVBQU0sR0FBTjtNQUNaLElBQWdCLEtBQUEsQ0FBTSxHQUFOLENBQUEsSUFBYyxLQUFBLENBQU0sR0FBTixDQUE5QjtBQUFBLGVBQU8sTUFBUDs7TUFDQSxJQUFnQixHQUFBLEdBQU0sQ0FBTixJQUFXLEdBQUEsR0FBTSxDQUFqQztBQUFBLGVBQU8sTUFBUDs7QUFDQSxhQUFPO0lBSEs7Ozs7S0F2RWM7QUFQOUIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xueyQsIFZpZXcsIFRleHRFZGl0b3JWaWV3fSA9IHJlcXVpcmUgXCJhdG9tLXNwYWNlLXBlbi12aWV3c1wiXG5cbmNvbmZpZyA9IHJlcXVpcmUgXCIuLi9jb25maWdcIlxudXRpbHMgPSByZXF1aXJlIFwiLi4vdXRpbHNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBJbnNlcnRUYWJsZVZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6IFwibWFya2Rvd24td3JpdGVyIG1hcmtkb3duLXdyaXRlci1kaWFsb2dcIiwgPT5cbiAgICAgIEBsYWJlbCBcIkluc2VydCBUYWJsZVwiLCBjbGFzczogXCJpY29uIGljb24tZGlmZi1hZGRlZFwiXG4gICAgICBAZGl2ID0+XG4gICAgICAgIEBsYWJlbCBcIlJvd3NcIiwgY2xhc3M6IFwibWVzc2FnZVwiXG4gICAgICAgIEBzdWJ2aWV3IFwicm93RWRpdG9yXCIsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuICAgICAgICBAbGFiZWwgXCJDb2x1bW5zXCIsIGNsYXNzOiBcIm1lc3NhZ2VcIlxuICAgICAgICBAc3VidmlldyBcImNvbHVtbkVkaXRvclwiLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcblxuICBpbml0aWFsaXplOiAtPlxuICAgIHV0aWxzLnNldFRhYkluZGV4KFtAcm93RWRpdG9yLCBAY29sdW1uRWRpdG9yXSlcblxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICBAZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKFxuICAgICAgQGVsZW1lbnQsIHtcbiAgICAgICAgXCJjb3JlOmNvbmZpcm1cIjogPT4gQG9uQ29uZmlybSgpLFxuICAgICAgICBcImNvcmU6Y2FuY2VsXCI6ICA9PiBAZGV0YWNoKClcbiAgICAgIH0pKVxuXG4gIG9uQ29uZmlybTogLT5cbiAgICByb3cgPSBwYXJzZUludChAcm93RWRpdG9yLmdldFRleHQoKSwgMTApXG4gICAgY29sID0gcGFyc2VJbnQoQGNvbHVtbkVkaXRvci5nZXRUZXh0KCksIDEwKVxuXG4gICAgQGluc2VydFRhYmxlKHJvdywgY29sKSBpZiBAaXNWYWxpZFJhbmdlKHJvdywgY29sKVxuXG4gICAgQGRldGFjaCgpXG5cbiAgZGlzcGxheTogLT5cbiAgICBAZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcywgdmlzaWJsZTogZmFsc2UpXG4gICAgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9ICQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudClcbiAgICBAcm93RWRpdG9yLnNldFRleHQoXCIzXCIpXG4gICAgQGNvbHVtbkVkaXRvci5zZXRUZXh0KFwiM1wiKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAcm93RWRpdG9yLmZvY3VzKClcblxuICBkZXRhY2g6IC0+XG4gICAgaWYgQHBhbmVsLmlzVmlzaWJsZSgpXG4gICAgICBAcGFuZWwuaGlkZSgpXG4gICAgICBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50Py5mb2N1cygpXG4gICAgc3VwZXJcblxuICBkZXRhY2hlZDogLT5cbiAgICBAZGlzcG9zYWJsZXM/LmRpc3Bvc2UoKVxuICAgIEBkaXNwb3NhYmxlcyA9IG51bGxcblxuICBpbnNlcnRUYWJsZTogKHJvdywgY29sKSAtPlxuICAgIGN1cnNvciA9IEBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIEBlZGl0b3IuaW5zZXJ0VGV4dChAY3JlYXRlVGFibGUocm93LCBjb2wpKVxuICAgIEBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oY3Vyc29yKVxuXG4gIGNyZWF0ZVRhYmxlOiAocm93LCBjb2wpIC0+XG4gICAgb3B0aW9ucyA9XG4gICAgICBudW1PZkNvbHVtbnM6IGNvbFxuICAgICAgZXh0cmFQaXBlczogY29uZmlnLmdldChcInRhYmxlRXh0cmFQaXBlc1wiKVxuICAgICAgY29sdW1uV2lkdGg6IDFcbiAgICAgIGFsaWdubWVudDogY29uZmlnLmdldChcInRhYmxlQWxpZ25tZW50XCIpXG5cbiAgICB0YWJsZSA9IFtdXG5cbiAgICAjIGluc2VydCBoZWFkZXJcbiAgICB0YWJsZS5wdXNoKHV0aWxzLmNyZWF0ZVRhYmxlUm93KFtdLCBvcHRpb25zKSlcbiAgICAjIGluc2VydCBzZXBhcmF0b3JcbiAgICB0YWJsZS5wdXNoKHV0aWxzLmNyZWF0ZVRhYmxlU2VwYXJhdG9yKG9wdGlvbnMpKVxuICAgICMgaW5zZXJ0IGJvZHkgcm93c1xuICAgIHRhYmxlLnB1c2godXRpbHMuY3JlYXRlVGFibGVSb3coW10sIG9wdGlvbnMpKSBmb3IgWzAuLnJvdyAtIDJdXG5cbiAgICB0YWJsZS5qb2luKFwiXFxuXCIpXG5cbiAgIyBhdCBsZWFzdCAyIHJvdyArIDIgY29sdW1uc1xuICBpc1ZhbGlkUmFuZ2U6IChyb3csIGNvbCkgLT5cbiAgICByZXR1cm4gZmFsc2UgaWYgaXNOYU4ocm93KSB8fCBpc05hTihjb2wpXG4gICAgcmV0dXJuIGZhbHNlIGlmIHJvdyA8IDIgfHwgY29sIDwgMVxuICAgIHJldHVybiB0cnVlXG4iXX0=
