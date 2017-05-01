(function() {
  var CompositeDisposable, basicConfig, config;

  CompositeDisposable = require("atom").CompositeDisposable;

  config = require("./config");

  basicConfig = require("./config-basic");

  module.exports = {
    config: basicConfig,
    modules: {},
    disposables: null,
    activate: function() {
      this.disposables = new CompositeDisposable();
      this.registerWorkspaceCommands();
      return this.registerEditorCommands();
    },
    deactivate: function() {
      var ref;
      if ((ref = this.disposables) != null) {
        ref.dispose();
      }
      this.disposables = null;
      return this.modules = {};
    },
    registerWorkspaceCommands: function() {
      var workspaceCommands;
      workspaceCommands = {};
      ["draft", "post"].forEach((function(_this) {
        return function(file) {
          return workspaceCommands["markdown-writer:new-" + file] = _this.registerView("./views/new-" + file + "-view", {
            optOutGrammars: true
          });
        };
      })(this));
      ["open-cheat-sheet", "create-default-keymaps", "create-project-configs"].forEach((function(_this) {
        return function(command) {
          return workspaceCommands["markdown-writer:" + command] = _this.registerCommand("./commands/" + command, {
            optOutGrammars: true
          });
        };
      })(this));
      return this.disposables.add(atom.commands.add("atom-workspace", workspaceCommands));
    },
    registerEditorCommands: function() {
      var editorCommands;
      editorCommands = {};
      ["tags", "categories"].forEach((function(_this) {
        return function(attr) {
          return editorCommands["markdown-writer:manage-post-" + attr] = _this.registerView("./views/manage-post-" + attr + "-view");
        };
      })(this));
      ["link", "footnote", "image", "table"].forEach((function(_this) {
        return function(media) {
          return editorCommands["markdown-writer:insert-" + media] = _this.registerView("./views/insert-" + media + "-view");
        };
      })(this));
      ["code", "codeblock", "bold", "italic", "keystroke", "strikethrough"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style + "-text"] = _this.registerCommand("./commands/style-text", {
            args: style
          });
        };
      })(this));
      ["h1", "h2", "h3", "h4", "h5", "ul", "ol", "task", "taskdone", "blockquote"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style] = _this.registerCommand("./commands/style-line", {
            args: style
          });
        };
      })(this));
      ["previous-heading", "next-heading", "next-table-cell", "reference-definition"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:jump-to-" + command] = _this.registerCommand("./commands/jump-to", {
            args: command
          });
        };
      })(this));
      ["insert-new-line", "indent-list-line"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/edit-line", {
            args: command,
            skipList: ["autocomplete-active"]
          });
        };
      })(this));
      ["correct-order-list-numbers", "format-table"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/format-text", {
            args: command
          });
        };
      })(this));
      ["publish-draft", "open-link-in-browser"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/" + command);
        };
      })(this));
      return this.disposables.add(atom.commands.add("atom-text-editor", editorCommands));
    },
    registerView: function(path, options) {
      if (options == null) {
        options = {};
      }
      return (function(_this) {
        return function(e) {
          var base, moduleInstance;
          if ((options.optOutGrammars || _this.isMarkdown()) && !_this.inSkipList(options.skipList)) {
            if ((base = _this.modules)[path] == null) {
              base[path] = require(path);
            }
            moduleInstance = new _this.modules[path](options.args);
            if (config.get("_skipAction") == null) {
              return moduleInstance.display();
            }
          } else {
            return e.abortKeyBinding();
          }
        };
      })(this);
    },
    registerCommand: function(path, options) {
      if (options == null) {
        options = {};
      }
      return (function(_this) {
        return function(e) {
          var base, moduleInstance;
          if ((options.optOutGrammars || _this.isMarkdown()) && !_this.inSkipList(options.skipList)) {
            if ((base = _this.modules)[path] == null) {
              base[path] = require(path);
            }
            moduleInstance = new _this.modules[path](options.args);
            if (config.get("_skipAction") == null) {
              return moduleInstance.trigger(e);
            }
          } else {
            return e.abortKeyBinding();
          }
        };
      })(this);
    },
    isMarkdown: function() {
      var editor, grammars;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return false;
      }
      grammars = config.get("grammars") || [];
      return grammars.indexOf(editor.getGrammar().scopeName) >= 0;
    },
    inSkipList: function(list) {
      var editorElement;
      if (list == null) {
        return false;
      }
      editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
      if (!((editorElement != null) && (editorElement.classList != null))) {
        return false;
      }
      return list.every(function(className) {
        return editorElement.classList.contains(className);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvbWFya2Rvd24td3JpdGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0VBQ1QsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUjs7RUFFZCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUFRLFdBQVI7SUFFQSxPQUFBLEVBQVMsRUFGVDtJQUdBLFdBQUEsRUFBYSxJQUhiO0lBS0EsUUFBQSxFQUFVLFNBQUE7TUFDUixJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLG1CQUFBLENBQUE7TUFFbkIsSUFBQyxDQUFBLHlCQUFELENBQUE7YUFDQSxJQUFDLENBQUEsc0JBQUQsQ0FBQTtJQUpRLENBTFY7SUFXQSxVQUFBLEVBQVksU0FBQTtBQUNWLFVBQUE7O1dBQVksQ0FBRSxPQUFkLENBQUE7O01BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZTthQUNmLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFIRCxDQVhaO0lBZ0JBLHlCQUFBLEVBQTJCLFNBQUE7QUFDekIsVUFBQTtNQUFBLGlCQUFBLEdBQW9CO01BRXBCLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtpQkFDeEIsaUJBQWtCLENBQUEsc0JBQUEsR0FBdUIsSUFBdkIsQ0FBbEIsR0FDRSxLQUFDLENBQUEsWUFBRCxDQUFjLGNBQUEsR0FBZSxJQUFmLEdBQW9CLE9BQWxDLEVBQTBDO1lBQUEsY0FBQSxFQUFnQixJQUFoQjtXQUExQztRQUZzQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUI7TUFJQSxDQUFDLGtCQUFELEVBQXFCLHdCQUFy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QXJDLENBQUEsSUFBbUQ7SUFMaEQsQ0F6Rlo7SUFnR0EsVUFBQSxFQUFZLFNBQUMsSUFBRDtBQUNWLFVBQUE7TUFBQSxJQUFvQixZQUFwQjtBQUFBLGVBQU8sTUFBUDs7TUFDQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBbkI7TUFDaEIsSUFBQSxDQUFBLENBQW9CLHVCQUFBLElBQWtCLGlDQUF0QyxDQUFBO0FBQUEsZUFBTyxNQUFQOztBQUNBLGFBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxTQUFDLFNBQUQ7ZUFBZSxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLFNBQWpDO01BQWYsQ0FBWDtJQUpHLENBaEdaOztBQU5GIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSBcImF0b21cIlxuXG5jb25maWcgPSByZXF1aXJlIFwiLi9jb25maWdcIlxuYmFzaWNDb25maWcgPSByZXF1aXJlIFwiLi9jb25maWctYmFzaWNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzogYmFzaWNDb25maWdcblxuICBtb2R1bGVzOiB7fSAjIFRvIGNhY2hlIHJlcXVpcmVkIG1vZHVsZXNcbiAgZGlzcG9zYWJsZXM6IG51bGwgIyBDb21wb3NpdGUgZGlzcG9zYWJsZVxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIEByZWdpc3RlcldvcmtzcGFjZUNvbW1hbmRzKClcbiAgICBAcmVnaXN0ZXJFZGl0b3JDb21tYW5kcygpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAZGlzcG9zYWJsZXM/LmRpc3Bvc2UoKVxuICAgIEBkaXNwb3NhYmxlcyA9IG51bGxcbiAgICBAbW9kdWxlcyA9IHt9XG5cbiAgcmVnaXN0ZXJXb3Jrc3BhY2VDb21tYW5kczogLT5cbiAgICB3b3Jrc3BhY2VDb21tYW5kcyA9IHt9XG5cbiAgICBbXCJkcmFmdFwiLCBcInBvc3RcIl0uZm9yRWFjaCAoZmlsZSkgPT5cbiAgICAgIHdvcmtzcGFjZUNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOm5ldy0je2ZpbGV9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyVmlldyhcIi4vdmlld3MvbmV3LSN7ZmlsZX0tdmlld1wiLCBvcHRPdXRHcmFtbWFyczogdHJ1ZSlcblxuICAgIFtcIm9wZW4tY2hlYXQtc2hlZXRcIiwgXCJjcmVhdGUtZGVmYXVsdC1rZXltYXBzXCIsXG4gICAgIFwiY3JlYXRlLXByb2plY3QtY29uZmlnc1wiXS5mb3JFYWNoIChjb21tYW5kKSA9PlxuICAgICAgd29ya3NwYWNlQ29tbWFuZHNbXCJtYXJrZG93bi13cml0ZXI6I3tjb21tYW5kfVwiXSA9XG4gICAgICAgIEByZWdpc3RlckNvbW1hbmQoXCIuL2NvbW1hbmRzLyN7Y29tbWFuZH1cIiwgb3B0T3V0R3JhbW1hcnM6IHRydWUpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKFwiYXRvbS13b3Jrc3BhY2VcIiwgd29ya3NwYWNlQ29tbWFuZHMpKVxuXG4gIHJlZ2lzdGVyRWRpdG9yQ29tbWFuZHM6IC0+XG4gICAgZWRpdG9yQ29tbWFuZHMgPSB7fVxuXG4gICAgW1widGFnc1wiLCBcImNhdGVnb3JpZXNcIl0uZm9yRWFjaCAoYXR0cikgPT5cbiAgICAgIGVkaXRvckNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOm1hbmFnZS1wb3N0LSN7YXR0cn1cIl0gPVxuICAgICAgICBAcmVnaXN0ZXJWaWV3KFwiLi92aWV3cy9tYW5hZ2UtcG9zdC0je2F0dHJ9LXZpZXdcIilcblxuICAgIFtcImxpbmtcIiwgXCJmb290bm90ZVwiLCBcImltYWdlXCIsIFwidGFibGVcIl0uZm9yRWFjaCAobWVkaWEpID0+XG4gICAgICBlZGl0b3JDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjppbnNlcnQtI3ttZWRpYX1cIl0gPVxuICAgICAgICBAcmVnaXN0ZXJWaWV3KFwiLi92aWV3cy9pbnNlcnQtI3ttZWRpYX0tdmlld1wiKVxuXG4gICAgW1wiY29kZVwiLCBcImNvZGVibG9ja1wiLCBcImJvbGRcIiwgXCJpdGFsaWNcIixcbiAgICAgXCJrZXlzdHJva2VcIiwgXCJzdHJpa2V0aHJvdWdoXCJdLmZvckVhY2ggKHN0eWxlKSA9PlxuICAgICAgZWRpdG9yQ29tbWFuZHNbXCJtYXJrZG93bi13cml0ZXI6dG9nZ2xlLSN7c3R5bGV9LXRleHRcIl0gPVxuICAgICAgICBAcmVnaXN0ZXJDb21tYW5kKFwiLi9jb21tYW5kcy9zdHlsZS10ZXh0XCIsIGFyZ3M6IHN0eWxlKVxuXG4gICAgW1wiaDFcIiwgXCJoMlwiLCBcImgzXCIsIFwiaDRcIiwgXCJoNVwiLCBcInVsXCIsIFwib2xcIixcbiAgICAgXCJ0YXNrXCIsIFwidGFza2RvbmVcIiwgXCJibG9ja3F1b3RlXCJdLmZvckVhY2ggKHN0eWxlKSA9PlxuICAgICAgZWRpdG9yQ29tbWFuZHNbXCJtYXJrZG93bi13cml0ZXI6dG9nZ2xlLSN7c3R5bGV9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyQ29tbWFuZChcIi4vY29tbWFuZHMvc3R5bGUtbGluZVwiLCBhcmdzOiBzdHlsZSlcblxuICAgIFtcInByZXZpb3VzLWhlYWRpbmdcIiwgXCJuZXh0LWhlYWRpbmdcIiwgXCJuZXh0LXRhYmxlLWNlbGxcIixcbiAgICAgXCJyZWZlcmVuY2UtZGVmaW5pdGlvblwiXS5mb3JFYWNoIChjb21tYW5kKSA9PlxuICAgICAgZWRpdG9yQ29tbWFuZHNbXCJtYXJrZG93bi13cml0ZXI6anVtcC10by0je2NvbW1hbmR9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyQ29tbWFuZChcIi4vY29tbWFuZHMvanVtcC10b1wiLCBhcmdzOiBjb21tYW5kKVxuXG4gICAgW1wiaW5zZXJ0LW5ldy1saW5lXCIsIFwiaW5kZW50LWxpc3QtbGluZVwiXS5mb3JFYWNoIChjb21tYW5kKSA9PlxuICAgICAgZWRpdG9yQ29tbWFuZHNbXCJtYXJrZG93bi13cml0ZXI6I3tjb21tYW5kfVwiXSA9XG4gICAgICAgIEByZWdpc3RlckNvbW1hbmQoXCIuL2NvbW1hbmRzL2VkaXQtbGluZVwiLFxuICAgICAgICAgIGFyZ3M6IGNvbW1hbmQsIHNraXBMaXN0OiBbXCJhdXRvY29tcGxldGUtYWN0aXZlXCJdKVxuXG4gICAgW1wiY29ycmVjdC1vcmRlci1saXN0LW51bWJlcnNcIiwgXCJmb3JtYXQtdGFibGVcIl0uZm9yRWFjaCAoY29tbWFuZCkgPT5cbiAgICAgIGVkaXRvckNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOiN7Y29tbWFuZH1cIl0gPVxuICAgICAgICBAcmVnaXN0ZXJDb21tYW5kKFwiLi9jb21tYW5kcy9mb3JtYXQtdGV4dFwiLCBhcmdzOiBjb21tYW5kKVxuXG4gICAgW1wicHVibGlzaC1kcmFmdFwiLCBcIm9wZW4tbGluay1pbi1icm93c2VyXCJdLmZvckVhY2ggKGNvbW1hbmQpID0+XG4gICAgICBlZGl0b3JDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjoje2NvbW1hbmR9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyQ29tbWFuZChcIi4vY29tbWFuZHMvI3tjb21tYW5kfVwiKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZChcImF0b20tdGV4dC1lZGl0b3JcIiwgZWRpdG9yQ29tbWFuZHMpKVxuXG4gIHJlZ2lzdGVyVmlldzogKHBhdGgsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICAoZSkgPT5cbiAgICAgIGlmIChvcHRpb25zLm9wdE91dEdyYW1tYXJzIHx8IEBpc01hcmtkb3duKCkpICYmICFAaW5Ta2lwTGlzdChvcHRpb25zLnNraXBMaXN0KVxuICAgICAgICBAbW9kdWxlc1twYXRoXSA/PSByZXF1aXJlKHBhdGgpXG4gICAgICAgIG1vZHVsZUluc3RhbmNlID0gbmV3IEBtb2R1bGVzW3BhdGhdKG9wdGlvbnMuYXJncylcbiAgICAgICAgbW9kdWxlSW5zdGFuY2UuZGlzcGxheSgpIHVubGVzcyBjb25maWcuZ2V0KFwiX3NraXBBY3Rpb25cIik/XG4gICAgICBlbHNlXG4gICAgICAgIGUuYWJvcnRLZXlCaW5kaW5nKClcblxuICByZWdpc3RlckNvbW1hbmQ6IChwYXRoLCBvcHRpb25zID0ge30pIC0+XG4gICAgKGUpID0+XG4gICAgICBpZiAob3B0aW9ucy5vcHRPdXRHcmFtbWFycyB8fCBAaXNNYXJrZG93bigpKSAmJiAhQGluU2tpcExpc3Qob3B0aW9ucy5za2lwTGlzdClcbiAgICAgICAgQG1vZHVsZXNbcGF0aF0gPz0gcmVxdWlyZShwYXRoKVxuICAgICAgICBtb2R1bGVJbnN0YW5jZSA9IG5ldyBAbW9kdWxlc1twYXRoXShvcHRpb25zLmFyZ3MpXG4gICAgICAgIG1vZHVsZUluc3RhbmNlLnRyaWdnZXIoZSkgdW5sZXNzIGNvbmZpZy5nZXQoXCJfc2tpcEFjdGlvblwiKT9cbiAgICAgIGVsc2VcbiAgICAgICAgZS5hYm9ydEtleUJpbmRpbmcoKVxuXG4gIGlzTWFya2Rvd246IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBlZGl0b3I/XG5cbiAgICBncmFtbWFycyA9IGNvbmZpZy5nZXQoXCJncmFtbWFyc1wiKSB8fCBbXVxuICAgIHJldHVybiBncmFtbWFycy5pbmRleE9mKGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKSA+PSAwXG5cbiAgaW5Ta2lwTGlzdDogKGxpc3QpIC0+XG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBsaXN0P1xuICAgIGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKVxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgZWRpdG9yRWxlbWVudD8gJiYgZWRpdG9yRWxlbWVudC5jbGFzc0xpc3Q/XG4gICAgcmV0dXJuIGxpc3QuZXZlcnkgKGNsYXNzTmFtZSkgLT4gZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKVxuIl19
