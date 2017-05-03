(function() {
  var $, CompositeDisposable, FrontMatter, ManageFrontMatterView, TextEditorView, View, config, ref, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View, TextEditorView = ref.TextEditorView;

  config = require("../config");

  utils = require("../utils");

  FrontMatter = require("../helpers/front-matter");

  module.exports = ManageFrontMatterView = (function(superClass) {
    extend(ManageFrontMatterView, superClass);

    function ManageFrontMatterView() {
      return ManageFrontMatterView.__super__.constructor.apply(this, arguments);
    }

    ManageFrontMatterView.labelName = "Manage Field";

    ManageFrontMatterView.fieldName = "fieldName";

    ManageFrontMatterView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-selection"
      }, (function(_this) {
        return function() {
          _this.label(_this.labelName, {
            "class": "icon icon-book"
          });
          _this.p({
            "class": "error",
            outlet: "error"
          });
          _this.subview("fieldEditor", new TextEditorView({
            mini: true
          }));
          return _this.ul({
            "class": "candidates",
            outlet: "candidates"
          }, function() {
            return _this.li("Loading...");
          });
        };
      })(this));
    };

    ManageFrontMatterView.prototype.initialize = function() {
      this.candidates.on("click", "li", (function(_this) {
        return function(e) {
          return _this.appendFieldItem(e);
        };
      })(this));
      this.disposables = new CompositeDisposable();
      return this.disposables.add(atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.saveFrontMatter();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      }));
    };

    ManageFrontMatterView.prototype.display = function() {
      this.editor = atom.workspace.getActiveTextEditor();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.fetchSiteFieldCandidates();
      this.frontMatter = new FrontMatter(this.editor);
      if (this.frontMatter.parseError) {
        return this.detach();
      }
      this.setEditorFieldItems(this.frontMatter.getArray(this.constructor.fieldName));
      this.panel.show();
      return this.fieldEditor.focus();
    };

    ManageFrontMatterView.prototype.detach = function() {
      var ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((ref1 = this.previouslyFocusedElement) != null) {
          ref1.focus();
        }
      }
      return ManageFrontMatterView.__super__.detach.apply(this, arguments);
    };

    ManageFrontMatterView.prototype.detached = function() {
      var ref1;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return this.disposables = null;
    };

    ManageFrontMatterView.prototype.saveFrontMatter = function() {
      this.frontMatter.set(this.constructor.fieldName, this.getEditorFieldItems());
      this.frontMatter.save();
      return this.detach();
    };

    ManageFrontMatterView.prototype.setEditorFieldItems = function(fieldItems) {
      return this.fieldEditor.setText(fieldItems.join(","));
    };

    ManageFrontMatterView.prototype.getEditorFieldItems = function() {
      return this.fieldEditor.getText().split(/\s*,\s*/).filter(function(c) {
        return !!c.trim();
      });
    };

    ManageFrontMatterView.prototype.fetchSiteFieldCandidates = function() {};

    ManageFrontMatterView.prototype.displaySiteFieldItems = function(siteFieldItems) {
      var fieldItems, tagElems;
      fieldItems = this.frontMatter.getArray(this.constructor.fieldName) || [];
      tagElems = siteFieldItems.map(function(tag) {
        if (fieldItems.indexOf(tag) < 0) {
          return "<li>" + tag + "</li>";
        } else {
          return "<li class='selected'>" + tag + "</li>";
        }
      });
      return this.candidates.empty().append(tagElems.join(""));
    };

    ManageFrontMatterView.prototype.appendFieldItem = function(e) {
      var fieldItem, fieldItems, idx;
      fieldItem = e.target.textContent;
      fieldItems = this.getEditorFieldItems();
      idx = fieldItems.indexOf(fieldItem);
      if (idx < 0) {
        fieldItems.push(fieldItem);
        e.target.classList.add("selected");
      } else {
        fieldItems.splice(idx, 1);
        e.target.classList.remove("selected");
      }
      this.setEditorFieldItems(fieldItems);
      return this.fieldEditor.focus();
    };

    return ManageFrontMatterView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvbWFuYWdlLWZyb250LW1hdHRlci12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsb0dBQUE7SUFBQTs7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFELEVBQUksZUFBSixFQUFVOztFQUVWLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7RUFDVCxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVI7O0VBQ1IsV0FBQSxHQUFjLE9BQUEsQ0FBUSx5QkFBUjs7RUFFZCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0oscUJBQUMsQ0FBQSxTQUFELEdBQVk7O0lBQ1oscUJBQUMsQ0FBQSxTQUFELEdBQVk7O0lBRVoscUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLDJDQUFQO09BQUwsRUFBeUQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ3ZELEtBQUMsQ0FBQSxLQUFELENBQU8sS0FBQyxDQUFBLFNBQVIsRUFBbUI7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGdCQUFQO1dBQW5CO1VBQ0EsS0FBQyxDQUFBLENBQUQsQ0FBRztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sT0FBUDtZQUFnQixNQUFBLEVBQVEsT0FBeEI7V0FBSDtVQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsYUFBVCxFQUE0QixJQUFBLGNBQUEsQ0FBZTtZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWYsQ0FBNUI7aUJBQ0EsS0FBQyxDQUFBLEVBQUQsQ0FBSTtZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sWUFBUDtZQUFxQixNQUFBLEVBQVEs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QW5CLENBQTBCLFVBQTFCLEVBTEY7O01BTUEsSUFBQyxDQUFBLG1CQUFELENBQXFCLFVBQXJCO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFiLENBQUE7SUFYZTs7OztLQW5FaUI7QUFScEMiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xueyQsIFZpZXcsIFRleHRFZGl0b3JWaWV3fSA9IHJlcXVpcmUgXCJhdG9tLXNwYWNlLXBlbi12aWV3c1wiXG5cbmNvbmZpZyA9IHJlcXVpcmUgXCIuLi9jb25maWdcIlxudXRpbHMgPSByZXF1aXJlIFwiLi4vdXRpbHNcIlxuRnJvbnRNYXR0ZXIgPSByZXF1aXJlIFwiLi4vaGVscGVycy9mcm9udC1tYXR0ZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBNYW5hZ2VGcm9udE1hdHRlclZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBsYWJlbE5hbWU6IFwiTWFuYWdlIEZpZWxkXCIgIyBvdmVycmlkZVxuICBAZmllbGROYW1lOiBcImZpZWxkTmFtZVwiICMgb3ZlcnJpZGVcblxuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiBcIm1hcmtkb3duLXdyaXRlciBtYXJrZG93bi13cml0ZXItc2VsZWN0aW9uXCIsID0+XG4gICAgICBAbGFiZWwgQGxhYmVsTmFtZSwgY2xhc3M6IFwiaWNvbiBpY29uLWJvb2tcIlxuICAgICAgQHAgY2xhc3M6IFwiZXJyb3JcIiwgb3V0bGV0OiBcImVycm9yXCJcbiAgICAgIEBzdWJ2aWV3IFwiZmllbGRFZGl0b3JcIiwgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG4gICAgICBAdWwgY2xhc3M6IFwiY2FuZGlkYXRlc1wiLCBvdXRsZXQ6IFwiY2FuZGlkYXRlc1wiLCA9PlxuICAgICAgICBAbGkgXCJMb2FkaW5nLi4uXCJcblxuICBpbml0aWFsaXplOiAtPlxuICAgIEBjYW5kaWRhdGVzLm9uIFwiY2xpY2tcIiwgXCJsaVwiLCAoZSkgPT4gQGFwcGVuZEZpZWxkSXRlbShlKVxuXG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoXG4gICAgICBAZWxlbWVudCwge1xuICAgICAgICBcImNvcmU6Y29uZmlybVwiOiA9PiBAc2F2ZUZyb250TWF0dGVyKClcbiAgICAgICAgXCJjb3JlOmNhbmNlbFwiOiAgPT4gQGRldGFjaCgpXG4gICAgICB9KSlcblxuICBkaXNwbGF5OiAtPlxuICAgIEBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzLCB2aXNpYmxlOiBmYWxzZSlcbiAgICBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gJChkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxuXG4gICAgQGZldGNoU2l0ZUZpZWxkQ2FuZGlkYXRlcygpXG4gICAgQGZyb250TWF0dGVyID0gbmV3IEZyb250TWF0dGVyKEBlZGl0b3IpXG4gICAgcmV0dXJuIEBkZXRhY2goKSBpZiBAZnJvbnRNYXR0ZXIucGFyc2VFcnJvclxuICAgIEBzZXRFZGl0b3JGaWVsZEl0ZW1zKEBmcm9udE1hdHRlci5nZXRBcnJheShAY29uc3RydWN0b3IuZmllbGROYW1lKSlcblxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAZmllbGRFZGl0b3IuZm9jdXMoKVxuXG4gIGRldGFjaDogLT5cbiAgICBpZiBAcGFuZWwuaXNWaXNpYmxlKClcbiAgICAgIEBwYW5lbC5oaWRlKClcbiAgICAgIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQ/LmZvY3VzKClcbiAgICBzdXBlclxuXG4gIGRldGFjaGVkOiAtPlxuICAgIEBkaXNwb3NhYmxlcz8uZGlzcG9zZSgpXG4gICAgQGRpc3Bvc2FibGVzID0gbnVsbFxuXG4gIHNhdmVGcm9udE1hdHRlcjogLT5cbiAgICBAZnJvbnRNYXR0ZXIuc2V0KEBjb25zdHJ1Y3Rvci5maWVsZE5hbWUsIEBnZXRFZGl0b3JGaWVsZEl0ZW1zKCkpXG4gICAgQGZyb250TWF0dGVyLnNhdmUoKVxuICAgIEBkZXRhY2goKVxuXG4gIHNldEVkaXRvckZpZWxkSXRlbXM6IChmaWVsZEl0ZW1zKSAtPlxuICAgIEBmaWVsZEVkaXRvci5zZXRUZXh0KGZpZWxkSXRlbXMuam9pbihcIixcIikpXG5cbiAgZ2V0RWRpdG9yRmllbGRJdGVtczogLT5cbiAgICBAZmllbGRFZGl0b3IuZ2V0VGV4dCgpLnNwbGl0KC9cXHMqLFxccyovKS5maWx0ZXIoKGMpIC0+ICEhYy50cmltKCkpXG5cbiAgZmV0Y2hTaXRlRmllbGRDYW5kaWRhdGVzOiAtPiAjIG92ZXJyaWRlXG5cbiAgZGlzcGxheVNpdGVGaWVsZEl0ZW1zOiAoc2l0ZUZpZWxkSXRlbXMpIC0+XG4gICAgZmllbGRJdGVtcyA9IEBmcm9udE1hdHRlci5nZXRBcnJheShAY29uc3RydWN0b3IuZmllbGROYW1lKSB8fCBbXVxuICAgIHRhZ0VsZW1zID0gc2l0ZUZpZWxkSXRlbXMubWFwICh0YWcpIC0+XG4gICAgICBpZiBmaWVsZEl0ZW1zLmluZGV4T2YodGFnKSA8IDBcbiAgICAgICAgXCI8bGk+I3t0YWd9PC9saT5cIlxuICAgICAgZWxzZVxuICAgICAgICBcIjxsaSBjbGFzcz0nc2VsZWN0ZWQnPiN7dGFnfTwvbGk+XCJcbiAgICBAY2FuZGlkYXRlcy5lbXB0eSgpLmFwcGVuZCh0YWdFbGVtcy5qb2luKFwiXCIpKVxuXG4gIGFwcGVuZEZpZWxkSXRlbTogKGUpIC0+XG4gICAgZmllbGRJdGVtID0gZS50YXJnZXQudGV4dENvbnRlbnRcbiAgICBmaWVsZEl0ZW1zID0gQGdldEVkaXRvckZpZWxkSXRlbXMoKVxuICAgIGlkeCA9IGZpZWxkSXRlbXMuaW5kZXhPZihmaWVsZEl0ZW0pXG4gICAgaWYgaWR4IDwgMFxuICAgICAgZmllbGRJdGVtcy5wdXNoKGZpZWxkSXRlbSlcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKVxuICAgIGVsc2VcbiAgICAgIGZpZWxkSXRlbXMuc3BsaWNlKGlkeCwgMSlcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKVxuICAgIEBzZXRFZGl0b3JGaWVsZEl0ZW1zKGZpZWxkSXRlbXMpXG4gICAgQGZpZWxkRWRpdG9yLmZvY3VzKClcbiJdfQ==
