(function() {
  describe("VimMode", function() {
    var editor, editorElement, ref, workspaceElement;
    ref = [], editor = ref[0], editorElement = ref[1], workspaceElement = ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.workspace.open();
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('vim-mode');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('status-bar');
      });
      return runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        return editorElement = atom.views.getView(editor);
      });
    });
    describe(".activate", function() {
      it("puts the editor in normal-mode initially by default", function() {
        expect(editorElement.classList.contains('vim-mode')).toBe(true);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("shows the current vim mode in the status bar", function() {
        var statusBarTile;
        statusBarTile = null;
        waitsFor(function() {
          return statusBarTile = workspaceElement.querySelector("#status-bar-vim-mode");
        });
        return runs(function() {
          expect(statusBarTile.textContent).toBe("Normal");
          atom.commands.dispatch(editorElement, "vim-mode:activate-insert-mode");
          return expect(statusBarTile.textContent).toBe("Insert");
        });
      });
      return it("doesn't register duplicate command listeners for editors", function() {
        var newPane, pane;
        editor.setText("12345");
        editor.setCursorBufferPosition([0, 0]);
        pane = atom.workspace.getActivePane();
        newPane = pane.splitRight();
        pane.removeItem(editor);
        newPane.addItem(editor);
        atom.commands.dispatch(editorElement, "vim-mode:move-right");
        return expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
      });
    });
    return describe(".deactivate", function() {
      it("removes the vim classes from the editor", function() {
        atom.packages.deactivatePackage('vim-mode');
        expect(editorElement.classList.contains("vim-mode")).toBe(false);
        return expect(editorElement.classList.contains("normal-mode")).toBe(false);
      });
      return it("removes the vim commands from the editor element", function() {
        var vimCommands;
        vimCommands = function() {
          return atom.commands.findCommands({
            target: editorElement
          }).filter(function(cmd) {
            return cmd.name.startsWith("vim-mode:");
          });
        };
        expect(vimCommands().length).toBeGreaterThan(0);
        atom.packages.deactivatePackage('vim-mode');
        return expect(vimCommands().length).toBe(0);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvdmltLW1vZGUtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBO0FBQ2xCLFFBQUE7SUFBQSxNQUE0QyxFQUE1QyxFQUFDLGVBQUQsRUFBUyxzQkFBVCxFQUF3QjtJQUV4QixVQUFBLENBQVcsU0FBQTtNQUNULGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEI7TUFFbkIsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQUE7TUFEYyxDQUFoQjtNQUdBLGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixVQUE5QjtNQURjLENBQWhCO01BR0EsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFlBQTlCO01BRGMsQ0FBaEI7YUFHQSxJQUFBLENBQUssU0FBQTtRQUNILE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7ZUFDVCxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQjtNQUZiLENBQUw7SUFaUyxDQUFYO0lBZ0JBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUE7TUFDcEIsRUFBQSxDQUFHLHFEQUFILEVBQTBELFNBQUE7UUFDeEQsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsVUFBakMsQ0FBUCxDQUFvRCxDQUFDLElBQXJELENBQTBELElBQTFEO2VBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdEO01BRndELENBQTFEO01BSUEsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUE7QUFDakQsWUFBQTtRQUFBLGFBQUEsR0FBZ0I7UUFFaEIsUUFBQSxDQUFTLFNBQUE7aUJBQ1AsYUFBQSxHQUFnQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixzQkFBL0I7UUFEVCxDQUFUO2VBR0EsSUFBQSxDQUFLLFNBQUE7VUFDSCxNQUFBLENBQU8sYUFBYSxDQUFDLFdBQXJCLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsUUFBdkM7VUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MsK0JBQXRDO2lCQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsV0FBckIsQ0FBaUMsQ0FBQyxJQUFsQyxDQUF1QyxRQUF2QztRQUhHLENBQUw7TUFOaUQsQ0FBbkQ7YUFXQSxFQUFBLENBQUcsMERBQUgsRUFBK0QsU0FBQTtBQUM3RCxZQUFBO1FBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxPQUFmO1FBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFFQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUE7UUFDUCxPQUFBLEdBQVUsSUFBSSxDQUFDLFVBQUwsQ0FBQTtRQUNWLElBQUksQ0FBQyxVQUFMLENBQWdCLE1BQWhCO1FBQ0EsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsTUFBaEI7UUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MscUJBQXRDO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO01BVjZELENBQS9EO0lBaEJvQixDQUF0QjtXQTRCQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBO01BQ3RCLEVBQUEsQ0FBRyx5Q0FBSCxFQUE4QyxTQUFBO1FBQzVDLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWQsQ0FBZ0MsVUFBaEM7UUFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxVQUFqQyxDQUFQLENBQW9ELENBQUMsSUFBckQsQ0FBMEQsS0FBMUQ7ZUFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsS0FBN0Q7TUFINEMsQ0FBOUM7YUFLQSxFQUFBLENBQUcsa0RBQUgsRUFBdUQsU0FBQTtBQUNyRCxZQUFBO1FBQUEsV0FBQSxHQUFjLFNBQUE7aUJBQ1osSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFkLENBQTJCO1lBQUEsTUFBQSxFQUFRLGFBQVI7V0FBM0IsQ0FBaUQsQ0FBQyxNQUFsRCxDQUF5RCxTQUFDLEdBQUQ7bUJBQ3ZELEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVCxDQUFvQixXQUFwQjtVQUR1RCxDQUF6RDtRQURZO1FBSWQsTUFBQSxDQUFPLFdBQUEsQ0FBQSxDQUFhLENBQUMsTUFBckIsQ0FBNEIsQ0FBQyxlQUE3QixDQUE2QyxDQUE3QztRQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWQsQ0FBZ0MsVUFBaEM7ZUFDQSxNQUFBLENBQU8sV0FBQSxDQUFBLENBQWEsQ0FBQyxNQUFyQixDQUE0QixDQUFDLElBQTdCLENBQWtDLENBQWxDO01BUHFELENBQXZEO0lBTnNCLENBQXhCO0VBL0NrQixDQUFwQjtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZGVzY3JpYmUgXCJWaW1Nb2RlXCIsIC0+XG4gIFtlZGl0b3IsIGVkaXRvckVsZW1lbnQsIHdvcmtzcGFjZUVsZW1lbnRdID0gW11cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbigpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCd2aW0tbW9kZScpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdzdGF0dXMtYmFyJylcblxuICAgIHJ1bnMgLT5cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG5cbiAgZGVzY3JpYmUgXCIuYWN0aXZhdGVcIiwgLT5cbiAgICBpdCBcInB1dHMgdGhlIGVkaXRvciBpbiBub3JtYWwtbW9kZSBpbml0aWFsbHkgYnkgZGVmYXVsdFwiLCAtPlxuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aW0tbW9kZScpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vcm1hbC1tb2RlJykpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwic2hvd3MgdGhlIGN1cnJlbnQgdmltIG1vZGUgaW4gdGhlIHN0YXR1cyBiYXJcIiwgLT5cbiAgICAgIHN0YXR1c0JhclRpbGUgPSBudWxsXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIHN0YXR1c0JhclRpbGUgPSB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc3RhdHVzLWJhci12aW0tbW9kZVwiKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChzdGF0dXNCYXJUaWxlLnRleHRDb250ZW50KS50b0JlKFwiTm9ybWFsXCIpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgXCJ2aW0tbW9kZTphY3RpdmF0ZS1pbnNlcnQtbW9kZVwiKVxuICAgICAgICBleHBlY3Qoc3RhdHVzQmFyVGlsZS50ZXh0Q29udGVudCkudG9CZShcIkluc2VydFwiKVxuXG4gICAgaXQgXCJkb2Vzbid0IHJlZ2lzdGVyIGR1cGxpY2F0ZSBjb21tYW5kIGxpc3RlbmVycyBmb3IgZWRpdG9yc1wiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCIxMjM0NVwiKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcblxuICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgbmV3UGFuZSA9IHBhbmUuc3BsaXRSaWdodCgpXG4gICAgICBwYW5lLnJlbW92ZUl0ZW0oZWRpdG9yKVxuICAgICAgbmV3UGFuZS5hZGRJdGVtKGVkaXRvcilcblxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JFbGVtZW50LCBcInZpbS1tb2RlOm1vdmUtcmlnaHRcIilcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbChbMCwgMV0pXG5cbiAgZGVzY3JpYmUgXCIuZGVhY3RpdmF0ZVwiLCAtPlxuICAgIGl0IFwicmVtb3ZlcyB0aGUgdmltIGNsYXNzZXMgZnJvbSB0aGUgZWRpdG9yXCIsIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmRlYWN0aXZhdGVQYWNrYWdlKCd2aW0tbW9kZScpXG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJ2aW0tbW9kZVwiKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcIm5vcm1hbC1tb2RlXCIpKS50b0JlKGZhbHNlKVxuXG4gICAgaXQgXCJyZW1vdmVzIHRoZSB2aW0gY29tbWFuZHMgZnJvbSB0aGUgZWRpdG9yIGVsZW1lbnRcIiwgLT5cbiAgICAgIHZpbUNvbW1hbmRzID0gLT5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5maW5kQ29tbWFuZHModGFyZ2V0OiBlZGl0b3JFbGVtZW50KS5maWx0ZXIgKGNtZCkgLT5cbiAgICAgICAgICBjbWQubmFtZS5zdGFydHNXaXRoKFwidmltLW1vZGU6XCIpXG5cbiAgICAgIGV4cGVjdCh2aW1Db21tYW5kcygpLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgICBhdG9tLnBhY2thZ2VzLmRlYWN0aXZhdGVQYWNrYWdlKCd2aW0tbW9kZScpXG4gICAgICBleHBlY3QodmltQ29tbWFuZHMoKS5sZW5ndGgpLnRvQmUoMClcbiJdfQ==
