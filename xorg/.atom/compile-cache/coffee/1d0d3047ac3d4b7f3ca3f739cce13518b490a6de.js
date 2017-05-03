(function() {
  var CompositeDisposable, Disposable, GlobalVimState, StatusBarManager, VimState, ref, settings;

  ref = require('event-kit'), Disposable = ref.Disposable, CompositeDisposable = ref.CompositeDisposable;

  StatusBarManager = require('./status-bar-manager');

  GlobalVimState = require('./global-vim-state');

  VimState = require('./vim-state');

  settings = require('./settings');

  module.exports = {
    config: settings.config,
    activate: function(state) {
      this.disposables = new CompositeDisposable;
      this.globalVimState = new GlobalVimState;
      this.statusBarManager = new StatusBarManager;
      this.vimStates = new Set;
      this.vimStatesByEditor = new WeakMap;
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var vimState;
          if (editor.isMini() || _this.getEditorState(editor)) {
            return;
          }
          vimState = new VimState(atom.views.getView(editor), _this.statusBarManager, _this.globalVimState);
          _this.vimStates.add(vimState);
          _this.vimStatesByEditor.set(editor, vimState);
          return vimState.onDidDestroy(function() {
            return _this.vimStates["delete"](vimState);
          });
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidChangeActivePaneItem(this.updateToPaneItem.bind(this)));
      return this.disposables.add(new Disposable((function(_this) {
        return function() {
          return _this.vimStates.forEach(function(vimState) {
            return vimState.destroy();
          });
        };
      })(this)));
    },
    deactivate: function() {
      return this.disposables.dispose();
    },
    getGlobalState: function() {
      return this.globalVimState;
    },
    getEditorState: function(editor) {
      return this.vimStatesByEditor.get(editor);
    },
    consumeStatusBar: function(statusBar) {
      this.statusBarManager.initialize(statusBar);
      this.statusBarManager.attach();
      return this.disposables.add(new Disposable((function(_this) {
        return function() {
          return _this.statusBarManager.detach();
        };
      })(this)));
    },
    updateToPaneItem: function(item) {
      var vimState;
      if (item != null) {
        vimState = this.getEditorState(item);
      }
      if (vimState != null) {
        return vimState.updateStatusBar();
      } else {
        return this.statusBarManager.hide();
      }
    },
    provideVimMode: function() {
      return {
        getGlobalState: this.getGlobalState.bind(this),
        getEditorState: this.getEditorState.bind(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi92aW0tbW9kZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQW9DLE9BQUEsQ0FBUSxXQUFSLENBQXBDLEVBQUMsMkJBQUQsRUFBYTs7RUFDYixnQkFBQSxHQUFtQixPQUFBLENBQVEsc0JBQVI7O0VBQ25CLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSOztFQUNqQixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQVEsUUFBUSxDQUFDLE1BQWpCO0lBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUNSLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSTtNQUNuQixJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFJO01BQ3RCLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFJO01BRXhCLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBSTtNQUNqQixJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSTtNQUV6QixJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtBQUNqRCxjQUFBO1VBQUEsSUFBVSxNQUFNLENBQUMsTUFBUCxDQUFBLENBQUEsSUFBbUIsS0FBQyxDQUFBLGNBQUQsQ0FBZ0IsTUFBaEIsQ0FBN0I7QUFBQSxtQkFBQTs7VUFFQSxRQUFBLEdBQWUsSUFBQSxRQUFBLENBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBRGEsRUFFYixLQUFDLENBQUEsZ0JBRlksRUFHYixLQUFDLENBQUEsY0FIWTtVQU1mLEtBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLFFBQWY7VUFDQSxLQUFDLENBQUEsaUJBQWlCLENBQUMsR0FBbkIsQ0FBdUIsTUFBdkIsRUFBK0IsUUFBL0I7aUJBQ0EsUUFBUSxDQUFDLFlBQVQsQ0FBc0IsU0FBQTttQkFBRyxLQUFDLENBQUEsU0FBUyxFQUFDLE1BQUQsRUFBVixDQUFrQixRQUFsQjtVQUFILENBQXRCO1FBWGlEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUFqQjtNQWFBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxJQUFsQixDQUF1QixJQUF2QixDQUF6QyxDQUFqQjthQUVBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFxQixJQUFBLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQzlCLEtBQUMsQ0FBQSxTQUFTLENBQUMsT0FBWCxDQUFtQixTQUFDLFFBQUQ7bUJBQWMsUUFBUSxDQUFDLE9BQVQsQ0FBQTtVQUFkLENBQW5CO1FBRDhCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLENBQXJCO0lBdkJRLENBRlY7SUE0QkEsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTtJQURVLENBNUJaO0lBK0JBLGNBQUEsRUFBZ0IsU0FBQTthQUNkLElBQUMsQ0FBQTtJQURhLENBL0JoQjtJQWtDQSxjQUFBLEVBQWdCLFNBQUMsTUFBRDthQUNkLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxHQUFuQixDQUF1QixNQUF2QjtJQURjLENBbENoQjtJQXFDQSxnQkFBQSxFQUFrQixTQUFDLFNBQUQ7TUFDaEIsSUFBQyxDQUFBLGdCQUFnQixDQUFDLFVBQWxCLENBQTZCLFNBQTdCO01BQ0EsSUFBQyxDQUFBLGdCQUFnQixDQUFDLE1BQWxCLENBQUE7YUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBcUIsSUFBQSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUM5QixLQUFDLENBQUEsZ0JBQWdCLENBQUMsTUFBbEIsQ0FBQTtRQUQ4QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxDQUFyQjtJQUhnQixDQXJDbEI7SUEyQ0EsZ0JBQUEsRUFBa0IsU0FBQyxJQUFEO0FBQ2hCLFVBQUE7TUFBQSxJQUFvQyxZQUFwQztRQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFoQixFQUFYOztNQUNBLElBQUcsZ0JBQUg7ZUFDRSxRQUFRLENBQUMsZUFBVCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLGdCQUFnQixDQUFDLElBQWxCLENBQUEsRUFIRjs7SUFGZ0IsQ0EzQ2xCO0lBa0RBLGNBQUEsRUFBZ0IsU0FBQTthQUNkO1FBQUEsY0FBQSxFQUFnQixJQUFDLENBQUEsY0FBYyxDQUFDLElBQWhCLENBQXFCLElBQXJCLENBQWhCO1FBQ0EsY0FBQSxFQUFnQixJQUFDLENBQUEsY0FBYyxDQUFDLElBQWhCLENBQXFCLElBQXJCLENBRGhCOztJQURjLENBbERoQjs7QUFQRiIsInNvdXJjZXNDb250ZW50IjpbIntEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2V2ZW50LWtpdCdcblN0YXR1c0Jhck1hbmFnZXIgPSByZXF1aXJlICcuL3N0YXR1cy1iYXItbWFuYWdlcidcbkdsb2JhbFZpbVN0YXRlID0gcmVxdWlyZSAnLi9nbG9iYWwtdmltLXN0YXRlJ1xuVmltU3RhdGUgPSByZXF1aXJlICcuL3ZpbS1zdGF0ZSdcbnNldHRpbmdzID0gcmVxdWlyZSAnLi9zZXR0aW5ncydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6IHNldHRpbmdzLmNvbmZpZ1xuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAZ2xvYmFsVmltU3RhdGUgPSBuZXcgR2xvYmFsVmltU3RhdGVcbiAgICBAc3RhdHVzQmFyTWFuYWdlciA9IG5ldyBTdGF0dXNCYXJNYW5hZ2VyXG5cbiAgICBAdmltU3RhdGVzID0gbmV3IFNldFxuICAgIEB2aW1TdGF0ZXNCeUVkaXRvciA9IG5ldyBXZWFrTWFwXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgcmV0dXJuIGlmIGVkaXRvci5pc01pbmkoKSBvciBAZ2V0RWRpdG9yU3RhdGUoZWRpdG9yKVxuXG4gICAgICB2aW1TdGF0ZSA9IG5ldyBWaW1TdGF0ZShcbiAgICAgICAgYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvciksXG4gICAgICAgIEBzdGF0dXNCYXJNYW5hZ2VyLFxuICAgICAgICBAZ2xvYmFsVmltU3RhdGVcbiAgICAgIClcblxuICAgICAgQHZpbVN0YXRlcy5hZGQodmltU3RhdGUpXG4gICAgICBAdmltU3RhdGVzQnlFZGl0b3Iuc2V0KGVkaXRvciwgdmltU3RhdGUpXG4gICAgICB2aW1TdGF0ZS5vbkRpZERlc3Ryb3kgPT4gQHZpbVN0YXRlcy5kZWxldGUodmltU3RhdGUpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0gQHVwZGF0ZVRvUGFuZUl0ZW0uYmluZCh0aGlzKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBuZXcgRGlzcG9zYWJsZSA9PlxuICAgICAgQHZpbVN0YXRlcy5mb3JFYWNoICh2aW1TdGF0ZSkgLT4gdmltU3RhdGUuZGVzdHJveSgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG5cbiAgZ2V0R2xvYmFsU3RhdGU6IC0+XG4gICAgQGdsb2JhbFZpbVN0YXRlXG5cbiAgZ2V0RWRpdG9yU3RhdGU6IChlZGl0b3IpIC0+XG4gICAgQHZpbVN0YXRlc0J5RWRpdG9yLmdldChlZGl0b3IpXG5cbiAgY29uc3VtZVN0YXR1c0JhcjogKHN0YXR1c0JhcikgLT5cbiAgICBAc3RhdHVzQmFyTWFuYWdlci5pbml0aWFsaXplKHN0YXR1c0JhcilcbiAgICBAc3RhdHVzQmFyTWFuYWdlci5hdHRhY2goKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgbmV3IERpc3Bvc2FibGUgPT5cbiAgICAgIEBzdGF0dXNCYXJNYW5hZ2VyLmRldGFjaCgpXG5cbiAgdXBkYXRlVG9QYW5lSXRlbTogKGl0ZW0pIC0+XG4gICAgdmltU3RhdGUgPSBAZ2V0RWRpdG9yU3RhdGUoaXRlbSkgaWYgaXRlbT9cbiAgICBpZiB2aW1TdGF0ZT9cbiAgICAgIHZpbVN0YXRlLnVwZGF0ZVN0YXR1c0JhcigpXG4gICAgZWxzZVxuICAgICAgQHN0YXR1c0Jhck1hbmFnZXIuaGlkZSgpXG5cbiAgcHJvdmlkZVZpbU1vZGU6IC0+XG4gICAgZ2V0R2xvYmFsU3RhdGU6IEBnZXRHbG9iYWxTdGF0ZS5iaW5kKHRoaXMpXG4gICAgZ2V0RWRpdG9yU3RhdGU6IEBnZXRFZGl0b3JTdGF0ZS5iaW5kKHRoaXMpXG4iXX0=
