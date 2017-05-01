(function() {
  var pkg;

  pkg = require("../package");

  describe("MarkdownWriter", function() {
    var activationPromise, ditor, editorView, ref, workspaceView;
    ref = [], workspaceView = ref[0], ditor = ref[1], editorView = ref[2], activationPromise = ref[3];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("test");
      });
      return runs(function() {
        var editor;
        workspaceView = atom.views.getView(atom.workspace);
        editor = atom.workspace.getActiveTextEditor();
        editorView = atom.views.getView(editor);
        return activationPromise = atom.packages.activatePackage("markdown-writer");
      });
    });
    pkg.activationCommands["atom-workspace"].forEach(function(cmd) {
      return it("registered workspace commands " + cmd, function() {
        atom.config.set("markdown-writer._skipAction", true);
        atom.commands.dispatch(workspaceView, cmd);
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return expect(true).toBe(true);
        });
      });
    });
    return pkg.activationCommands["atom-text-editor"].forEach(function(cmd) {
      return it("registered editor commands " + cmd, function() {
        atom.config.set("markdown-writer._skipAction", true);
        atom.commands.dispatch(editorView, cmd);
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return expect(true).toBe(true);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL21hcmtkb3duLXdyaXRlci1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxZQUFSOztFQU9OLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBO0FBQ3pCLFFBQUE7SUFBQSxNQUF3RCxFQUF4RCxFQUFDLHNCQUFELEVBQWdCLGNBQWhCLEVBQXVCLG1CQUF2QixFQUFtQztJQUVuQyxVQUFBLENBQVcsU0FBQTtNQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixNQUFwQjtNQUFILENBQWhCO2FBQ0EsSUFBQSxDQUFLLFNBQUE7QUFDSCxZQUFBO1FBQUEsYUFBQSxHQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCO1FBQ2hCLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7UUFDVCxVQUFBLEdBQWEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CO2VBQ2IsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGlCQUE5QjtNQUpqQixDQUFMO0lBRlMsQ0FBWDtJQVlBLEdBQUcsQ0FBQyxrQkFBbUIsQ0FBQSxnQkFBQSxDQUFpQixDQUFDLE9BQXpDLENBQWlELFNBQUMsR0FBRDthQUMvQyxFQUFBLENBQUcsZ0NBQUEsR0FBaUMsR0FBcEMsRUFBMkMsU0FBQTtRQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLEVBQStDLElBQS9DO1FBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGFBQXZCLEVBQXNDLEdBQXRDO1FBRUEsZUFBQSxDQUFnQixTQUFBO2lCQUFHO1FBQUgsQ0FBaEI7ZUFDQSxJQUFBLENBQUssU0FBQTtpQkFBRyxNQUFBLENBQU8sSUFBUCxDQUFZLENBQUMsSUFBYixDQUFrQixJQUFsQjtRQUFILENBQUw7TUFOeUMsQ0FBM0M7SUFEK0MsQ0FBakQ7V0FTQSxHQUFHLENBQUMsa0JBQW1CLENBQUEsa0JBQUEsQ0FBbUIsQ0FBQyxPQUEzQyxDQUFtRCxTQUFDLEdBQUQ7YUFDakQsRUFBQSxDQUFHLDZCQUFBLEdBQThCLEdBQWpDLEVBQXdDLFNBQUE7UUFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixFQUErQyxJQUEvQztRQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixVQUF2QixFQUFtQyxHQUFuQztRQUVBLGVBQUEsQ0FBZ0IsU0FBQTtpQkFBRztRQUFILENBQWhCO2VBQ0EsSUFBQSxDQUFLLFNBQUE7aUJBQUcsTUFBQSxDQUFPLElBQVAsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsSUFBbEI7UUFBSCxDQUFMO01BTnNDLENBQXhDO0lBRGlELENBQW5EO0VBeEJ5QixDQUEzQjtBQVBBIiwic291cmNlc0NvbnRlbnQiOlsicGtnID0gcmVxdWlyZSBcIi4uL3BhY2thZ2VcIlxuXG4jIFVzZSB0aGUgY29tbWFuZCBgd2luZG93OnJ1bi1wYWNrYWdlLXNwZWNzYCAoY21kLWFsdC1jdHJsLXApIHRvIHJ1biBzcGVjcy5cbiNcbiMgVG8gcnVuIGEgc3BlY2lmaWMgYGl0YCBvciBgZGVzY3JpYmVgIGJsb2NrIGFkZCBhbiBgZmAgdG8gdGhlIGZyb250IChlLmcuIGBmaXRgXG4jIG9yIGBmZGVzY3JpYmVgKS4gUmVtb3ZlIHRoZSBgZmAgdG8gdW5mb2N1cyB0aGUgYmxvY2suXG5cbmRlc2NyaWJlIFwiTWFya2Rvd25Xcml0ZXJcIiwgLT5cbiAgW3dvcmtzcGFjZVZpZXcsIGRpdG9yLCBlZGl0b3JWaWV3LCBhY3RpdmF0aW9uUHJvbWlzZV0gPSBbXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihcInRlc3RcIilcbiAgICBydW5zIC0+XG4gICAgICB3b3Jrc3BhY2VWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBlZGl0b3JWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICAgIGFjdGl2YXRpb25Qcm9taXNlID0gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoXCJtYXJrZG93bi13cml0ZXJcIilcblxuICAjIFRvIHRlc3QgZGlzcGF0Y2ggY29tbWFuZHMsIHJlbW92ZSB0aGUgY29tbWVudHMgaW4gbWFya2Rvd24td3JpdGVyLmNvZmZlZSB0b1xuICAjIG1ha2Ugc3VyZSBfc2tpcEFjdGlvbiBub3QgYWN0dWFsbHkgdHJpZ2dlciBldmVudHMuXG4gICNcbiAgIyBUT0RPIFVwZGF0ZSBpbmRpdmlkdWFsIGNvbW1hbmQgc3BlY3MgdG8gdGVzdCBjb21tYW5kIGRpc3BhdGNoZXMgaW4gZnV0dXJlLlxuICBwa2cuYWN0aXZhdGlvbkNvbW1hbmRzW1wiYXRvbS13b3Jrc3BhY2VcIl0uZm9yRWFjaCAoY21kKSAtPlxuICAgIGl0IFwicmVnaXN0ZXJlZCB3b3Jrc3BhY2UgY29tbWFuZHMgI3tjbWR9XCIsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJtYXJrZG93bi13cml0ZXIuX3NraXBBY3Rpb25cIiwgdHJ1ZSlcblxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VWaWV3LCBjbWQpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhY3RpdmF0aW9uUHJvbWlzZVxuICAgICAgcnVucyAtPiBleHBlY3QodHJ1ZSkudG9CZSh0cnVlKVxuXG4gIHBrZy5hY3RpdmF0aW9uQ29tbWFuZHNbXCJhdG9tLXRleHQtZWRpdG9yXCJdLmZvckVhY2ggKGNtZCkgLT5cbiAgICBpdCBcInJlZ2lzdGVyZWQgZWRpdG9yIGNvbW1hbmRzICN7Y21kfVwiLCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KFwibWFya2Rvd24td3JpdGVyLl9za2lwQWN0aW9uXCIsIHRydWUpXG5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yVmlldywgY21kKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gYWN0aXZhdGlvblByb21pc2VcbiAgICAgIHJ1bnMgLT4gZXhwZWN0KHRydWUpLnRvQmUodHJ1ZSlcbiJdfQ==
