(function() {
  var VimNormalModeInputElement,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  VimNormalModeInputElement = (function(superClass) {
    extend(VimNormalModeInputElement, superClass);

    function VimNormalModeInputElement() {
      return VimNormalModeInputElement.__super__.constructor.apply(this, arguments);
    }

    VimNormalModeInputElement.prototype.createdCallback = function() {
      return this.className = "normal-mode-input";
    };

    VimNormalModeInputElement.prototype.initialize = function(viewModel, mainEditorElement, opts) {
      var ref;
      this.viewModel = viewModel;
      this.mainEditorElement = mainEditorElement;
      if (opts == null) {
        opts = {};
      }
      if (opts["class"] != null) {
        this.classList.add(opts["class"]);
      }
      this.editorElement = document.createElement("atom-text-editor");
      this.editorElement.classList.add('editor');
      this.editorElement.getModel().setMini(true);
      this.editorElement.setAttribute('mini', '');
      this.appendChild(this.editorElement);
      this.singleChar = opts.singleChar;
      this.defaultText = (ref = opts.defaultText) != null ? ref : '';
      if (opts.hidden) {
        this.classList.add('vim-hidden-normal-mode-input');
        this.mainEditorElement.parentNode.appendChild(this);
      } else {
        this.panel = atom.workspace.addBottomPanel({
          item: this,
          priority: 100
        });
      }
      this.focus();
      this.handleEvents();
      return this;
    };

    VimNormalModeInputElement.prototype.handleEvents = function() {
      var compositing;
      if (this.singleChar != null) {
        compositing = false;
        this.editorElement.getModel().getBuffer().onDidChange((function(_this) {
          return function(e) {
            if (e.newText && !compositing) {
              return _this.confirm();
            }
          };
        })(this));
        this.editorElement.addEventListener('compositionstart', function() {
          return compositing = true;
        });
        this.editorElement.addEventListener('compositionend', function() {
          return compositing = false;
        });
      } else {
        atom.commands.add(this.editorElement, 'editor:newline', this.confirm.bind(this));
      }
      atom.commands.add(this.editorElement, 'core:confirm', this.confirm.bind(this));
      atom.commands.add(this.editorElement, 'core:cancel', this.cancel.bind(this));
      return atom.commands.add(this.editorElement, 'blur', this.cancel.bind(this));
    };

    VimNormalModeInputElement.prototype.confirm = function() {
      this.value = this.editorElement.getModel().getText() || this.defaultText;
      this.viewModel.confirm(this);
      return this.removePanel();
    };

    VimNormalModeInputElement.prototype.focus = function() {
      return this.editorElement.focus();
    };

    VimNormalModeInputElement.prototype.cancel = function(e) {
      this.viewModel.cancel(this);
      return this.removePanel();
    };

    VimNormalModeInputElement.prototype.removePanel = function() {
      atom.workspace.getActivePane().activate();
      if (this.panel != null) {
        return this.panel.destroy();
      } else {
        return this.remove();
      }
    };

    return VimNormalModeInputElement;

  })(HTMLDivElement);

  module.exports = document.registerElement("vim-normal-mode-input", {
    "extends": "div",
    prototype: VimNormalModeInputElement.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi92aWV3LW1vZGVscy92aW0tbm9ybWFsLW1vZGUtaW5wdXQtZWxlbWVudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHlCQUFBO0lBQUE7OztFQUFNOzs7Ozs7O3dDQUNKLGVBQUEsR0FBaUIsU0FBQTthQUNmLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFERTs7d0NBR2pCLFVBQUEsR0FBWSxTQUFDLFNBQUQsRUFBYSxpQkFBYixFQUFpQyxJQUFqQztBQUNWLFVBQUE7TUFEVyxJQUFDLENBQUEsWUFBRDtNQUFZLElBQUMsQ0FBQSxvQkFBRDs7UUFBb0IsT0FBTzs7TUFDbEQsSUFBRyxxQkFBSDtRQUNFLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLElBQUksRUFBQyxLQUFELEVBQW5CLEVBREY7O01BR0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsa0JBQXZCO01BQ2pCLElBQUMsQ0FBQSxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQXpCLENBQTZCLFFBQTdCO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxRQUFmLENBQUEsQ0FBeUIsQ0FBQyxPQUExQixDQUFrQyxJQUFsQztNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsWUFBZixDQUE0QixNQUE1QixFQUFvQyxFQUFwQztNQUNBLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLGFBQWQ7TUFFQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUksQ0FBQztNQUNuQixJQUFDLENBQUEsV0FBRCw0Q0FBa0M7TUFFbEMsSUFBRyxJQUFJLENBQUMsTUFBUjtRQUNFLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLDhCQUFmO1FBQ0EsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxXQUE5QixDQUEwQyxJQUEx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b250ZW50IjpbImNsYXNzIFZpbU5vcm1hbE1vZGVJbnB1dEVsZW1lbnQgZXh0ZW5kcyBIVE1MRGl2RWxlbWVudFxuICBjcmVhdGVkQ2FsbGJhY2s6IC0+XG4gICAgQGNsYXNzTmFtZSA9IFwibm9ybWFsLW1vZGUtaW5wdXRcIlxuXG4gIGluaXRpYWxpemU6IChAdmlld01vZGVsLCBAbWFpbkVkaXRvckVsZW1lbnQsIG9wdHMgPSB7fSkgLT5cbiAgICBpZiBvcHRzLmNsYXNzP1xuICAgICAgQGNsYXNzTGlzdC5hZGQob3B0cy5jbGFzcylcblxuICAgIEBlZGl0b3JFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcImF0b20tdGV4dC1lZGl0b3JcIlxuICAgIEBlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2VkaXRvcicpXG4gICAgQGVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKS5zZXRNaW5pKHRydWUpXG4gICAgQGVkaXRvckVsZW1lbnQuc2V0QXR0cmlidXRlKCdtaW5pJywgJycpXG4gICAgQGFwcGVuZENoaWxkKEBlZGl0b3JFbGVtZW50KVxuXG4gICAgQHNpbmdsZUNoYXIgPSBvcHRzLnNpbmdsZUNoYXJcbiAgICBAZGVmYXVsdFRleHQgPSBvcHRzLmRlZmF1bHRUZXh0ID8gJydcblxuICAgIGlmIG9wdHMuaGlkZGVuXG4gICAgICBAY2xhc3NMaXN0LmFkZCgndmltLWhpZGRlbi1ub3JtYWwtbW9kZS1pbnB1dCcpXG4gICAgICBAbWFpbkVkaXRvckVsZW1lbnQucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzKVxuICAgIGVsc2VcbiAgICAgIEBwYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKGl0ZW06IHRoaXMsIHByaW9yaXR5OiAxMDApXG5cbiAgICBAZm9jdXMoKVxuICAgIEBoYW5kbGVFdmVudHMoKVxuXG4gICAgdGhpc1xuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICBpZiBAc2luZ2xlQ2hhcj9cbiAgICAgIGNvbXBvc2l0aW5nID0gZmFsc2VcbiAgICAgIEBlZGl0b3JFbGVtZW50LmdldE1vZGVsKCkuZ2V0QnVmZmVyKCkub25EaWRDaGFuZ2UgKGUpID0+XG4gICAgICAgIEBjb25maXJtKCkgaWYgZS5uZXdUZXh0IGFuZCBub3QgY29tcG9zaXRpbmdcbiAgICAgIEBlZGl0b3JFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ2NvbXBvc2l0aW9uc3RhcnQnLCAtPiBjb21wb3NpdGluZyA9IHRydWVcbiAgICAgIEBlZGl0b3JFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ2NvbXBvc2l0aW9uZW5kJywgLT4gY29tcG9zaXRpbmcgPSBmYWxzZVxuICAgIGVsc2VcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKEBlZGl0b3JFbGVtZW50LCAnZWRpdG9yOm5ld2xpbmUnLCBAY29uZmlybS5iaW5kKHRoaXMpKVxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoQGVkaXRvckVsZW1lbnQsICdjb3JlOmNvbmZpcm0nLCBAY29uZmlybS5iaW5kKHRoaXMpKVxuICAgIGF0b20uY29tbWFuZHMuYWRkKEBlZGl0b3JFbGVtZW50LCAnY29yZTpjYW5jZWwnLCBAY2FuY2VsLmJpbmQodGhpcykpXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoQGVkaXRvckVsZW1lbnQsICdibHVyJywgQGNhbmNlbC5iaW5kKHRoaXMpKVxuXG4gIGNvbmZpcm06IC0+XG4gICAgQHZhbHVlID0gQGVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKS5nZXRUZXh0KCkgb3IgQGRlZmF1bHRUZXh0XG4gICAgQHZpZXdNb2RlbC5jb25maXJtKHRoaXMpXG4gICAgQHJlbW92ZVBhbmVsKClcblxuICBmb2N1czogLT5cbiAgICBAZWRpdG9yRWxlbWVudC5mb2N1cygpXG5cbiAgY2FuY2VsOiAoZSkgLT5cbiAgICBAdmlld01vZGVsLmNhbmNlbCh0aGlzKVxuICAgIEByZW1vdmVQYW5lbCgpXG5cbiAgcmVtb3ZlUGFuZWw6IC0+XG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmFjdGl2YXRlKClcbiAgICBpZiBAcGFuZWw/XG4gICAgICBAcGFuZWwuZGVzdHJveSgpXG4gICAgZWxzZVxuICAgICAgdGhpcy5yZW1vdmUoKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJ2aW0tbm9ybWFsLW1vZGUtaW5wdXRcIlxuICBleHRlbmRzOiBcImRpdlwiLFxuICBwcm90b3R5cGU6IFZpbU5vcm1hbE1vZGVJbnB1dEVsZW1lbnQucHJvdG90eXBlXG4pXG4iXX0=
