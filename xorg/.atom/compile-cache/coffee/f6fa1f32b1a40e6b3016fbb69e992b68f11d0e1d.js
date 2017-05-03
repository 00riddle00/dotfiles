(function() {
  var $, CompositeDisposable, InsertFootnoteView, TextEditorView, View, config, guid, helper, ref, templateHelper, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View, TextEditorView = ref.TextEditorView;

  guid = require("guid");

  config = require("../config");

  utils = require("../utils");

  helper = require("../helpers/insert-link-helper");

  templateHelper = require("../helpers/template-helper");

  module.exports = InsertFootnoteView = (function(superClass) {
    extend(InsertFootnoteView, superClass);

    function InsertFootnoteView() {
      return InsertFootnoteView.__super__.constructor.apply(this, arguments);
    }

    InsertFootnoteView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Footnote", {
            "class": "icon icon-pin"
          });
          _this.div(function() {
            _this.label("Label", {
              "class": "message"
            });
            return _this.subview("labelEditor", new TextEditorView({
              mini: true
            }));
          });
          return _this.div({
            outlet: "contentBox"
          }, function() {
            _this.label("Content", {
              "class": "message"
            });
            return _this.subview("contentEditor", new TextEditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    InsertFootnoteView.prototype.initialize = function() {
      utils.setTabIndex([this.labelEditor, this.contentEditor]);
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

    InsertFootnoteView.prototype.onConfirm = function() {
      var footnote;
      footnote = {
        label: this.labelEditor.getText(),
        content: this.contentEditor.getText()
      };
      this.editor.transact((function(_this) {
        return function() {
          if (_this.footnote) {
            return _this.updateFootnote(footnote);
          } else {
            return _this.insertFootnote(footnote);
          }
        };
      })(this));
      return this.detach();
    };

    InsertFootnoteView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.editor = atom.workspace.getActiveTextEditor();
      this._normalizeSelectionAndSetFootnote();
      this.panel.show();
      this.labelEditor.getModel().selectAll();
      return this.labelEditor.focus();
    };

    InsertFootnoteView.prototype.detach = function() {
      var ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((ref1 = this.previouslyFocusedElement) != null) {
          ref1.focus();
        }
      }
      return InsertFootnoteView.__super__.detach.apply(this, arguments);
    };

    InsertFootnoteView.prototype.detached = function() {
      var ref1;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return this.disposables = null;
    };

    InsertFootnoteView.prototype._normalizeSelectionAndSetFootnote = function() {
      this.range = utils.getTextBufferRange(this.editor, "link", {
        selectBy: "nope"
      });
      this.selection = this.editor.getTextInRange(this.range) || "";
      if (utils.isFootnote(this.selection)) {
        this.footnote = utils.parseFootnote(this.selection);
        this.contentBox.hide();
        return this.labelEditor.setText(this.footnote["label"]);
      } else {
        return this.labelEditor.setText(guid.raw().slice(0, 8));
      }
    };

    InsertFootnoteView.prototype.updateFootnote = function(footnote) {
      var definitionText, findText, referenceText, replaceText, updateText;
      referenceText = templateHelper.create("footnoteReferenceTag", footnote);
      definitionText = templateHelper.create("footnoteDefinitionTag", footnote).trim();
      if (this.footnote["isDefinition"]) {
        updateText = definitionText;
        findText = templateHelper.create("footnoteReferenceTag", this.footnote).trim();
        replaceText = referenceText;
      } else {
        updateText = referenceText;
        findText = templateHelper.create("footnoteDefinitionTag", this.footnote).trim();
        replaceText = definitionText;
      }
      this.editor.setTextInBufferRange(this.range, updateText);
      return this.editor.buffer.scan(RegExp("" + (utils.escapeRegExp(findText))), function(match) {
        match.replace(replaceText);
        return match.stop();
      });
    };

    InsertFootnoteView.prototype.insertFootnote = function(footnote) {
      var definitionText, referenceText;
      referenceText = templateHelper.create("footnoteReferenceTag", footnote);
      definitionText = templateHelper.create("footnoteDefinitionTag", footnote).trim();
      this.editor.setTextInBufferRange(this.range, this.selection + referenceText);
      if (config.get("footnoteInsertPosition") === "article") {
        return helper.insertAtEndOfArticle(this.editor, definitionText);
      } else {
        return helper.insertAfterCurrentParagraph(this.editor, definitionText);
      }
    };

    return InsertFootnoteView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvaW5zZXJ0LWZvb3Rub3RlLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxrSEFBQTtJQUFBOzs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLE1BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUQsRUFBSSxlQUFKLEVBQVU7O0VBQ1YsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7RUFDVCxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVI7O0VBQ1IsTUFBQSxHQUFTLE9BQUEsQ0FBUSwrQkFBUjs7RUFDVCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSw0QkFBUjs7RUFFakIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztJQUNKLGtCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyx3Q0FBUDtPQUFMLEVBQXNELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNwRCxLQUFDLENBQUEsS0FBRCxDQUFPLGlCQUFQLEVBQTBCO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxlQUFQO1dBQTFCO1VBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBO1lBQ0gsS0FBQyxDQUFBLEtBQUQsQ0FBTyxPQUFQLEVBQWdCO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxTQUFQO2FBQWhCO21CQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsYUFBVCxFQUE0QixJQUFBLGNBQUEsQ0FBZTtjQUFBLElBQUEsRUFBTSxJQUFOO2FBQWYsQ0FBNUI7VUFGRyxDQUFMO2lCQUdBLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxNQUFBLEVBQVEsWUFBUjtXQUFMLEVBQTJCLFNBQUE7WUFDekIsS0FBQyxDQUFBLEtBQUQsQ0FBTyxTQUFQLEVBQWtCO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxTQUFQO2FBQWxCO21CQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsZUFBVCxFQUE4QixJQUFBLGNBQUEsQ0FBZTtjQUFBLElBQUEsRUFBTSxJQUFOO2FBQWYsQ0FBOUI7VUFGeUIsQ0FBM0I7UUFMb0Q7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXREO0lBRFE7O2lDQVVWLFVBQUEsR0FBWSxTQUFBO01BQ1YsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsQ0FBQyxJQUFDLENBQUEsV0FBRixFQUFlLElBQUMsQ0FBQSxhQUFoQixDQUFsQjtNQUVBLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsbUJBQUEsQ0FBQTthQUNuQixJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQ2YsSUFBQyxDQUFBLE9BRGMsRUFDTDtRQUNSLGNBQUEsRUFBZ0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsU0FBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFI7UUFFUixhQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZSO09BREssQ0FBakI7SUFKVTs7aUNBVVosU0FBQSxHQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsUUFBQSxHQUNFO1FBQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBQVA7UUFDQSxPQUFBLEVBQVMsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FEVDs7TUFHRixJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBaUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ2YsSUFBRyxLQUFDLENBQUEsUUFBSjttQkFDRSxLQUFDLENBQUEsY0FBRCxDQUFnQixRQUFoQixFQURGO1dBQUEsTUFBQTttQkFHRSxLQUFDLENBQUEsY0FBRCxDQUFnQixRQUFoQixFQUhGOztRQURlO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjthQU1BLElBQUMsQ0FBQSxNQUFELENBQUE7SUFYUzs7aUNBYVgsT0FBQSxHQUFTLFNBQUE7O1FBQ1AsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47VUFBWSxPQUFBLEVBQVMsS0FBckI7U0FBN0I7O01BQ1YsSUFBQyxDQUFBLHdCQUFELEdBQTRCLENBQUEsQ0FBRSxRQUFRLENBQUMsYUFBWDtNQUM1QixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNWLElBQUMsQ0FBQSxpQ0FBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLFFBQWIsQ0FBQSxDQUF1QixDQUFDLFNBQXhCLENBQUE7YUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEtBQWIsQ0FBQTtJQVBPOztpQ0FTVCxNQUFBLEdBQVEsU0FBQTtBQUNOLFVBQUE7TUFBQSxJQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsU0FBUCxDQUFBLENBQUg7UUFDRSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTs7Y0FDeUIsQ0FBRSxLQUEzQixDQUFBO1NBRkY7O2FBR0EsZ0RBQUEsU0FBQTtJQUpNOztpQ0FNUixRQUFBLEdBQVUsU0FBQTtBQUNSLFVBQUE7O1lBQVksQ0FBRSxPQUFkLENBQUE7O2FBQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZTtJQUZQOztpQ0FJVixpQ0FBQSxHQUFtQyxTQUFBO01BQ2pDLElBQUMsQ0FBQSxLQUFELEdBQVMsS0FBSyxDQUFDLGtCQUFOLENBQXlCLElBQUMsQ0FBQSxNQUExQixFQUFrQyxNQUFsQyxFQUEwQztRQUFBLFFBQUEsRUFBVSxNQUFWO09BQTFDO01BQ1QsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBdUIsSUFBQyxDQUFBLEtBQXhCLENBQUEsSUFBa0M7TUFFL0MsSUFBRyxLQUFLLENBQUMsVUFBTixDQUFpQixJQUFDLENBQUEsU0FBbEIsQ0FBSDtRQUNFLElBQUMsQ0FBQSxRQUFELEdBQVksS0FBSyxDQUFDLGFBQU4sQ0FBb0IsSUFBQyxDQUFBLFNBQXJCO1FBQ1osSUFBQyxDQUFBLFVBQVUsQ0FBQyxJQUFaLENBQUE7ZUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBcUIsSUFBQyxDQUFBLFFBQVMsQ0FBQSxPQUFBLENBQS9CLEVBSEY7T0FBQSxNQUFBO2VBS0UsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQXFCLElBQUksQ0FBQyxHQUFMLENBQUEsQ0FBVyxZQUFoQyxFQUxGOztJQUppQzs7aUNBV25DLGNBQUEsR0FBZ0IsU0FBQyxRQUFEO0FBQ2QsVUFBQTtNQUFBLGFBQUEsR0FBZ0IsY0FBYyxDQUFDLE1BQWYsQ0FBc0Isc0JBQXRCLEVBQThDLFFBQTlDO01BQ2hCLGNBQUEsR0FBaUIsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsdUJBQXRCLEVBQStDLFFBQS9DLENBQXdELENBQUMsSUFBekQsQ0FBQTtNQUVqQixJQUFHLElBQUMsQ0FBQSxRQUFTLENBQUEsY0FBQSxDQUFiO1FBQ0UsVUFBQSxHQUFhO1FBQ2IsUUFBQSxHQUFXLGNBQWMsQ0FBQyxNQUFmLENBQXNCLHNCQUF0QixFQUE4QyxJQUFDLENBQUEsUUFBL0MsQ0FBd0QsQ0FBQyxJQUF6RCxDQUFBO1FBQ1gsV0FBQSxHQUFjLGNBSGhCO09BQUEsTUFBQTtRQUtFLFVBQUEsR0FBYTtRQUNiLFFBQUEsR0FBVyxjQUFjLENBQUMsTUFBZixDQUFzQix1QkFBdEIsRUFBK0MsSUFBQyxDQUFBLFFBQWhELENBQXlELENBQUMsSUFBMUQsQ0FBQTtRQUNYLFdBQUEsR0FBYyxlQVBoQjs7TUFTQSxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLElBQUMsQ0FBQSxLQUE5QixFQUFxQyxVQUFyQzthQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQWYsQ0FBb0IsTUFBQSxDQUFBLEVBQUEsR0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFOLENBQW1CLFFBQW5CLENBQUQsQ0FBTCxDQUFwQixFQUE2RCxTQUFDLEtBQUQ7UUFDM0QsS0FBSyxDQUFDLE9BQU4sQ0FBYyxXQUFkO2VBQ0EsS0FBSyxDQUFDLElBQU4sQ0FBQTtNQUYyRCxDQUE3RDtJQWRjOztpQ0FrQmhCLGNBQUEsR0FBZ0IsU0FBQyxRQUFEO0FBQ2QsVUFBQTtNQUFBLGFBQUEsR0FBZ0IsY0FBYyxDQUFDLE1BQWYsQ0FBc0Isc0JBQXRCLEVBQThDLFFBQTlDO01BQ2hCLGNBQUEsR0FBaUIsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsdUJBQXRCLEVBQStDLFFBQS9DLENBQXdELENBQUMsSUFBekQsQ0FBQTtNQUVqQixJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLElBQUMsQ0FBQSxLQUE5QixFQUFxQyxJQUFDLENBQUEsU0FBRCxHQUFhLGFBQWxEO01BRUEsSUFBRyxNQUFNLENBQUMsR0FBUCxDQUFXLHdCQUFYLENBQUEsS0FBd0MsU0FBM0M7ZUFDRSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsSUFBQyxDQUFBLE1BQTdCLEVBQXFDLGNBQXJDLEVBREY7T0FBQSxNQUFBO2VBR0UsTUFBTSxDQUFDLDJCQUFQLENBQW1DLElBQUMsQ0FBQSxNQUFwQyxFQUE0QyxjQUE1QyxFQUhGOztJQU5jOzs7O0tBbEZlO0FBVmpDIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbnskLCBWaWV3LCBUZXh0RWRpdG9yVmlld30gPSByZXF1aXJlIFwiYXRvbS1zcGFjZS1wZW4tdmlld3NcIlxuZ3VpZCA9IHJlcXVpcmUgXCJndWlkXCJcblxuY29uZmlnID0gcmVxdWlyZSBcIi4uL2NvbmZpZ1wiXG51dGlscyA9IHJlcXVpcmUgXCIuLi91dGlsc1wiXG5oZWxwZXIgPSByZXF1aXJlIFwiLi4vaGVscGVycy9pbnNlcnQtbGluay1oZWxwZXJcIlxudGVtcGxhdGVIZWxwZXIgPSByZXF1aXJlIFwiLi4vaGVscGVycy90ZW1wbGF0ZS1oZWxwZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBJbnNlcnRGb290bm90ZVZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6IFwibWFya2Rvd24td3JpdGVyIG1hcmtkb3duLXdyaXRlci1kaWFsb2dcIiwgPT5cbiAgICAgIEBsYWJlbCBcIkluc2VydCBGb290bm90ZVwiLCBjbGFzczogXCJpY29uIGljb24tcGluXCJcbiAgICAgIEBkaXYgPT5cbiAgICAgICAgQGxhYmVsIFwiTGFiZWxcIiwgY2xhc3M6IFwibWVzc2FnZVwiXG4gICAgICAgIEBzdWJ2aWV3IFwibGFiZWxFZGl0b3JcIiwgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG4gICAgICBAZGl2IG91dGxldDogXCJjb250ZW50Qm94XCIsID0+XG4gICAgICAgIEBsYWJlbCBcIkNvbnRlbnRcIiwgY2xhc3M6IFwibWVzc2FnZVwiXG4gICAgICAgIEBzdWJ2aWV3IFwiY29udGVudEVkaXRvclwiLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcblxuICBpbml0aWFsaXplOiAtPlxuICAgIHV0aWxzLnNldFRhYkluZGV4KFtAbGFiZWxFZGl0b3IsIEBjb250ZW50RWRpdG9yXSlcblxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICBAZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKFxuICAgICAgQGVsZW1lbnQsIHtcbiAgICAgICAgXCJjb3JlOmNvbmZpcm1cIjogPT4gQG9uQ29uZmlybSgpLFxuICAgICAgICBcImNvcmU6Y2FuY2VsXCI6ICA9PiBAZGV0YWNoKClcbiAgICAgIH0pKVxuXG4gIG9uQ29uZmlybTogLT5cbiAgICBmb290bm90ZSA9XG4gICAgICBsYWJlbDogQGxhYmVsRWRpdG9yLmdldFRleHQoKVxuICAgICAgY29udGVudDogQGNvbnRlbnRFZGl0b3IuZ2V0VGV4dCgpXG5cbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBpZiBAZm9vdG5vdGVcbiAgICAgICAgQHVwZGF0ZUZvb3Rub3RlKGZvb3Rub3RlKVxuICAgICAgZWxzZVxuICAgICAgICBAaW5zZXJ0Rm9vdG5vdGUoZm9vdG5vdGUpXG5cbiAgICBAZGV0YWNoKClcblxuICBkaXNwbGF5OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMsIHZpc2libGU6IGZhbHNlKVxuICAgIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSAkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpXG4gICAgQGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBfbm9ybWFsaXplU2VsZWN0aW9uQW5kU2V0Rm9vdG5vdGUoKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAbGFiZWxFZGl0b3IuZ2V0TW9kZWwoKS5zZWxlY3RBbGwoKVxuICAgIEBsYWJlbEVkaXRvci5mb2N1cygpXG5cbiAgZGV0YWNoOiAtPlxuICAgIGlmIEBwYW5lbC5pc1Zpc2libGUoKVxuICAgICAgQHBhbmVsLmhpZGUoKVxuICAgICAgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudD8uZm9jdXMoKVxuICAgIHN1cGVyXG5cbiAgZGV0YWNoZWQ6IC0+XG4gICAgQGRpc3Bvc2FibGVzPy5kaXNwb3NlKClcbiAgICBAZGlzcG9zYWJsZXMgPSBudWxsXG5cbiAgX25vcm1hbGl6ZVNlbGVjdGlvbkFuZFNldEZvb3Rub3RlOiAtPlxuICAgIEByYW5nZSA9IHV0aWxzLmdldFRleHRCdWZmZXJSYW5nZShAZWRpdG9yLCBcImxpbmtcIiwgc2VsZWN0Qnk6IFwibm9wZVwiKVxuICAgIEBzZWxlY3Rpb24gPSBAZWRpdG9yLmdldFRleHRJblJhbmdlKEByYW5nZSkgfHwgXCJcIlxuXG4gICAgaWYgdXRpbHMuaXNGb290bm90ZShAc2VsZWN0aW9uKVxuICAgICAgQGZvb3Rub3RlID0gdXRpbHMucGFyc2VGb290bm90ZShAc2VsZWN0aW9uKVxuICAgICAgQGNvbnRlbnRCb3guaGlkZSgpXG4gICAgICBAbGFiZWxFZGl0b3Iuc2V0VGV4dChAZm9vdG5vdGVbXCJsYWJlbFwiXSlcbiAgICBlbHNlXG4gICAgICBAbGFiZWxFZGl0b3Iuc2V0VGV4dChndWlkLnJhdygpWzAuLjddKVxuXG4gIHVwZGF0ZUZvb3Rub3RlOiAoZm9vdG5vdGUpIC0+XG4gICAgcmVmZXJlbmNlVGV4dCA9IHRlbXBsYXRlSGVscGVyLmNyZWF0ZShcImZvb3Rub3RlUmVmZXJlbmNlVGFnXCIsIGZvb3Rub3RlKVxuICAgIGRlZmluaXRpb25UZXh0ID0gdGVtcGxhdGVIZWxwZXIuY3JlYXRlKFwiZm9vdG5vdGVEZWZpbml0aW9uVGFnXCIsIGZvb3Rub3RlKS50cmltKClcblxuICAgIGlmIEBmb290bm90ZVtcImlzRGVmaW5pdGlvblwiXVxuICAgICAgdXBkYXRlVGV4dCA9IGRlZmluaXRpb25UZXh0XG4gICAgICBmaW5kVGV4dCA9IHRlbXBsYXRlSGVscGVyLmNyZWF0ZShcImZvb3Rub3RlUmVmZXJlbmNlVGFnXCIsIEBmb290bm90ZSkudHJpbSgpXG4gICAgICByZXBsYWNlVGV4dCA9IHJlZmVyZW5jZVRleHRcbiAgICBlbHNlXG4gICAgICB1cGRhdGVUZXh0ID0gcmVmZXJlbmNlVGV4dFxuICAgICAgZmluZFRleHQgPSB0ZW1wbGF0ZUhlbHBlci5jcmVhdGUoXCJmb290bm90ZURlZmluaXRpb25UYWdcIiwgQGZvb3Rub3RlKS50cmltKClcbiAgICAgIHJlcGxhY2VUZXh0ID0gZGVmaW5pdGlvblRleHRcblxuICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoQHJhbmdlLCB1cGRhdGVUZXh0KVxuICAgIEBlZGl0b3IuYnVmZmVyLnNjYW4gLy8vICN7dXRpbHMuZXNjYXBlUmVnRXhwKGZpbmRUZXh0KX0gLy8vLCAobWF0Y2gpIC0+XG4gICAgICBtYXRjaC5yZXBsYWNlKHJlcGxhY2VUZXh0KVxuICAgICAgbWF0Y2guc3RvcCgpXG5cbiAgaW5zZXJ0Rm9vdG5vdGU6IChmb290bm90ZSkgLT5cbiAgICByZWZlcmVuY2VUZXh0ID0gdGVtcGxhdGVIZWxwZXIuY3JlYXRlKFwiZm9vdG5vdGVSZWZlcmVuY2VUYWdcIiwgZm9vdG5vdGUpXG4gICAgZGVmaW5pdGlvblRleHQgPSB0ZW1wbGF0ZUhlbHBlci5jcmVhdGUoXCJmb290bm90ZURlZmluaXRpb25UYWdcIiwgZm9vdG5vdGUpLnRyaW0oKVxuXG4gICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShAcmFuZ2UsIEBzZWxlY3Rpb24gKyByZWZlcmVuY2VUZXh0KVxuXG4gICAgaWYgY29uZmlnLmdldChcImZvb3Rub3RlSW5zZXJ0UG9zaXRpb25cIikgPT0gXCJhcnRpY2xlXCJcbiAgICAgIGhlbHBlci5pbnNlcnRBdEVuZE9mQXJ0aWNsZShAZWRpdG9yLCBkZWZpbml0aW9uVGV4dClcbiAgICBlbHNlXG4gICAgICBoZWxwZXIuaW5zZXJ0QWZ0ZXJDdXJyZW50UGFyYWdyYXBoKEBlZGl0b3IsIGRlZmluaXRpb25UZXh0KVxuIl19
