(function() {
  var InsertImageView, config;

  config = require("../../lib/config");

  InsertImageView = require("../../lib/views/insert-image-view");

  describe("InsertImageView", function() {
    var editor, insertImageView, ref;
    ref = [], editor = ref[0], insertImageView = ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
      return runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        return insertImageView = new InsertImageView({});
      });
    });
    describe(".isInSiteDir", function() {
      beforeEach(function() {
        return atom.config.set("markdown-writer.siteLocalDir", editor.getPath().replace("empty.markdown", ""));
      });
      it("check a file is in site local dir", function() {
        var fixture;
        fixture = (config.get("siteLocalDir")) + "/image.jpg";
        return expect(insertImageView.isInSiteDir(fixture)).toBe(true);
      });
      return it("check a file is not in site local dir", function() {
        var fixture;
        fixture = 'some/random/path/image.jpg';
        return expect(insertImageView.isInSiteDir(fixture)).toBe(false);
      });
    });
    describe(".resolveImagePath", function() {
      it("return empty image path", function() {
        var fixture;
        fixture = "";
        return expect(insertImageView.resolveImagePath(fixture)).toBe(fixture);
      });
      it("return URL image path", function() {
        var fixture;
        fixture = "https://assets-cdn.github.com/images/icons/emoji/octocat.png";
        return expect(insertImageView.resolveImagePath(fixture)).toBe(fixture);
      });
      it("return relative image path", function() {
        var fixture;
        insertImageView.editor = editor;
        fixture = editor.getPath().replace("empty.markdown", "octocat.png");
        return expect(insertImageView.resolveImagePath(fixture)).toBe(fixture);
      });
      return it("return absolute image path", function() {
        var expected, fixture;
        insertImageView.editor = editor;
        atom.config.set("markdown-writer.siteLocalDir", editor.getPath().replace("empty.markdown", ""));
        fixture = "octocat.png";
        expected = editor.getPath().replace("empty.markdown", "octocat.png");
        return expect(insertImageView.resolveImagePath(fixture)).toBe(expected);
      });
    });
    describe(".copyImageDestPath", function() {
      it("return the local path with original filename", function() {
        var fixture;
        atom.config.set("markdown-writer.renameImageOnCopy", false);
        fixture = "images/icons/emoji/octocat.png";
        return expect(insertImageView.copyImageDestPath(fixture, "name")).toMatch(/[\/\\]octocat\.png/);
      });
      return it("return the local path with new filename", function() {
        var fixture;
        atom.config.set("markdown-writer.renameImageOnCopy", true);
        fixture = "images/icons/emoji/octocat.png";
        expect(insertImageView.copyImageDestPath(fixture, "New name")).toMatch(/[\/\\]new-name\.png/);
        fixture = "images/icons/emoji/octocat";
        expect(insertImageView.copyImageDestPath(fixture, "New name")).toMatch(/[\/\\]new-name/);
        fixture = "images/icons/emoji/octocat.png";
        return expect(insertImageView.copyImageDestPath(fixture, "")).toMatch(/[\/\\]octocat.png/);
      });
    });
    return describe(".generateImageSrc", function() {
      it("return empty image path", function() {
        var fixture;
        fixture = "";
        return expect(insertImageView.generateImageSrc(fixture)).toBe(fixture);
      });
      it("return URL image path", function() {
        var fixture;
        fixture = "https://assets-cdn.github.com/images/icons/emoji/octocat.png";
        return expect(insertImageView.generateImageSrc(fixture)).toBe(fixture);
      });
      it("return relative image path from file", function() {
        var fixture;
        insertImageView.editor = editor;
        atom.config.set("markdown-writer.relativeImagePath", true);
        fixture = editor.getPath().replace("empty.markdown", "octocat.png");
        return expect(insertImageView.generateImageSrc(fixture)).toBe("octocat.png");
      });
      it("return relative image path from site", function() {
        var fixture;
        atom.config.set("markdown-writer.siteLocalDir", "/assets/images/icons/emoji");
        fixture = "/assets/images/icons/emoji/octocat.png";
        return expect(insertImageView.generateImageSrc(fixture)).toBe("octocat.png");
      });
      return it("return image dir path using config template", function() {
        var expected, fixture;
        insertImageView.display();
        fixture = "octocat.png";
        expected = /^\/images\/\d{4}\/\d\d\/octocat\.png$/;
        return expect(insertImageView.generateImageSrc(fixture)).toMatch(expected);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL3ZpZXdzL2luc2VydC1pbWFnZS12aWV3LXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGtCQUFSOztFQUNULGVBQUEsR0FBa0IsT0FBQSxDQUFRLG1DQUFSOztFQUVsQixRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQTtBQUMxQixRQUFBO0lBQUEsTUFBNEIsRUFBNUIsRUFBQyxlQUFELEVBQVM7SUFFVCxVQUFBLENBQVcsU0FBQTtNQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixnQkFBcEI7TUFBSCxDQUFoQjthQUVBLElBQUEsQ0FBSyxTQUFBO1FBQ0gsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtlQUNULGVBQUEsR0FBc0IsSUFBQSxlQUFBLENBQWdCLEVBQWhCO01BRm5CLENBQUw7SUFIUyxDQUFYO0lBT0EsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQTtNQUN2QixVQUFBLENBQVcsU0FBQTtlQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsRUFBZ0QsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLE9BQWpCLENBQXlCLGdCQUF6QixFQUEyQyxFQUEzQyxDQUFoRDtNQURTLENBQVg7TUFHQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQTtBQUN0QyxZQUFBO1FBQUEsT0FBQSxHQUFZLENBQUMsTUFBTSxDQUFDLEdBQVAsQ0FBVyxjQUFYLENBQUQsQ0FBQSxHQUE0QjtlQUN4QyxNQUFBLENBQU8sZUFBZSxDQUFDLFdBQWhCLENBQTRCLE9BQTVCLENBQVAsQ0FBNEMsQ0FBQyxJQUE3QyxDQUFrRCxJQUFsRDtN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Q0FBQTtRQUNBLE9BQUEsR0FBVTtRQUNWLFFBQUEsR0FBVztlQUNYLE1BQUEsQ0FBTyxlQUFlLENBQUMsZ0JBQWhCLENBQWlDLE9BQWpDLENBQVAsQ0FBaUQsQ0FBQyxPQUFsRCxDQUEwRCxRQUExRDtNQUpnRCxDQUFsRDtJQXRCNEIsQ0FBOUI7RUE5RDBCLENBQTVCO0FBSEEiLCJzb3VyY2VzQ29udGVudCI6WyJjb25maWcgPSByZXF1aXJlIFwiLi4vLi4vbGliL2NvbmZpZ1wiXG5JbnNlcnRJbWFnZVZpZXcgPSByZXF1aXJlIFwiLi4vLi4vbGliL3ZpZXdzL2luc2VydC1pbWFnZS12aWV3XCJcblxuZGVzY3JpYmUgXCJJbnNlcnRJbWFnZVZpZXdcIiwgLT5cbiAgW2VkaXRvciwgaW5zZXJ0SW1hZ2VWaWV3XSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKFwiZW1wdHkubWFya2Rvd25cIilcblxuICAgIHJ1bnMgLT5cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgaW5zZXJ0SW1hZ2VWaWV3ID0gbmV3IEluc2VydEltYWdlVmlldyh7fSlcblxuICBkZXNjcmliZSBcIi5pc0luU2l0ZURpclwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldChcIm1hcmtkb3duLXdyaXRlci5zaXRlTG9jYWxEaXJcIiwgZWRpdG9yLmdldFBhdGgoKS5yZXBsYWNlKFwiZW1wdHkubWFya2Rvd25cIiwgXCJcIikpXG5cbiAgICBpdCBcImNoZWNrIGEgZmlsZSBpcyBpbiBzaXRlIGxvY2FsIGRpclwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiI3tjb25maWcuZ2V0KFwic2l0ZUxvY2FsRGlyXCIpfS9pbWFnZS5qcGdcIlxuICAgICAgZXhwZWN0KGluc2VydEltYWdlVmlldy5pc0luU2l0ZURpcihmaXh0dXJlKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJjaGVjayBhIGZpbGUgaXMgbm90IGluIHNpdGUgbG9jYWwgZGlyXCIsIC0+XG4gICAgICBmaXh0dXJlID0gJ3NvbWUvcmFuZG9tL3BhdGgvaW1hZ2UuanBnJ1xuICAgICAgZXhwZWN0KGluc2VydEltYWdlVmlldy5pc0luU2l0ZURpcihmaXh0dXJlKSkudG9CZShmYWxzZSlcblxuICBkZXNjcmliZSBcIi5yZXNvbHZlSW1hZ2VQYXRoXCIsIC0+XG4gICAgaXQgXCJyZXR1cm4gZW1wdHkgaW1hZ2UgcGF0aFwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiXCJcbiAgICAgIGV4cGVjdChpbnNlcnRJbWFnZVZpZXcucmVzb2x2ZUltYWdlUGF0aChmaXh0dXJlKSkudG9CZShmaXh0dXJlKVxuXG4gICAgaXQgXCJyZXR1cm4gVVJMIGltYWdlIHBhdGhcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcImh0dHBzOi8vYXNzZXRzLWNkbi5naXRodWIuY29tL2ltYWdlcy9pY29ucy9lbW9qaS9vY3RvY2F0LnBuZ1wiXG4gICAgICBleHBlY3QoaW5zZXJ0SW1hZ2VWaWV3LnJlc29sdmVJbWFnZVBhdGgoZml4dHVyZSkpLnRvQmUoZml4dHVyZSlcblxuICAgIGl0IFwicmV0dXJuIHJlbGF0aXZlIGltYWdlIHBhdGhcIiwgLT5cbiAgICAgIGluc2VydEltYWdlVmlldy5lZGl0b3IgPSBlZGl0b3JcbiAgICAgIGZpeHR1cmUgPSBlZGl0b3IuZ2V0UGF0aCgpLnJlcGxhY2UoXCJlbXB0eS5tYXJrZG93blwiLCBcIm9jdG9jYXQucG5nXCIpXG4gICAgICBleHBlY3QoaW5zZXJ0SW1hZ2VWaWV3LnJlc29sdmVJbWFnZVBhdGgoZml4dHVyZSkpLnRvQmUoZml4dHVyZSlcblxuICAgIGl0IFwicmV0dXJuIGFic29sdXRlIGltYWdlIHBhdGhcIiwgLT5cbiAgICAgIGluc2VydEltYWdlVmlldy5lZGl0b3IgPSBlZGl0b3JcbiAgICAgIGF0b20uY29uZmlnLnNldChcIm1hcmtkb3duLXdyaXRlci5zaXRlTG9jYWxEaXJcIiwgZWRpdG9yLmdldFBhdGgoKS5yZXBsYWNlKFwiZW1wdHkubWFya2Rvd25cIiwgXCJcIikpXG5cbiAgICAgIGZpeHR1cmUgPSBcIm9jdG9jYXQucG5nXCJcbiAgICAgIGV4cGVjdGVkID0gZWRpdG9yLmdldFBhdGgoKS5yZXBsYWNlKFwiZW1wdHkubWFya2Rvd25cIiwgXCJvY3RvY2F0LnBuZ1wiKVxuICAgICAgZXhwZWN0KGluc2VydEltYWdlVmlldy5yZXNvbHZlSW1hZ2VQYXRoKGZpeHR1cmUpKS50b0JlKGV4cGVjdGVkKVxuXG4gIGRlc2NyaWJlIFwiLmNvcHlJbWFnZURlc3RQYXRoXCIsIC0+XG4gICAgaXQgXCJyZXR1cm4gdGhlIGxvY2FsIHBhdGggd2l0aCBvcmlnaW5hbCBmaWxlbmFtZVwiLCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KFwibWFya2Rvd24td3JpdGVyLnJlbmFtZUltYWdlT25Db3B5XCIsIGZhbHNlKVxuICAgICAgZml4dHVyZSA9IFwiaW1hZ2VzL2ljb25zL2Vtb2ppL29jdG9jYXQucG5nXCJcbiAgICAgIGV4cGVjdChpbnNlcnRJbWFnZVZpZXcuY29weUltYWdlRGVzdFBhdGgoZml4dHVyZSwgXCJuYW1lXCIpKS50b01hdGNoKC9bXFwvXFxcXF1vY3RvY2F0XFwucG5nLylcblxuICAgIGl0IFwicmV0dXJuIHRoZSBsb2NhbCBwYXRoIHdpdGggbmV3IGZpbGVuYW1lXCIsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJtYXJrZG93bi13cml0ZXIucmVuYW1lSW1hZ2VPbkNvcHlcIiwgdHJ1ZSlcbiAgICAgICMgbm9ybWFsIGNhc2VcbiAgICAgIGZpeHR1cmUgPSBcImltYWdlcy9pY29ucy9lbW9qaS9vY3RvY2F0LnBuZ1wiXG4gICAgICBleHBlY3QoaW5zZXJ0SW1hZ2VWaWV3LmNvcHlJbWFnZURlc3RQYXRoKGZpeHR1cmUsIFwiTmV3IG5hbWVcIikpLnRvTWF0Y2goL1tcXC9cXFxcXW5ldy1uYW1lXFwucG5nLylcbiAgICAgICMgbm8gZXh0ZW5zaW9uXG4gICAgICBmaXh0dXJlID0gXCJpbWFnZXMvaWNvbnMvZW1vamkvb2N0b2NhdFwiXG4gICAgICBleHBlY3QoaW5zZXJ0SW1hZ2VWaWV3LmNvcHlJbWFnZURlc3RQYXRoKGZpeHR1cmUsIFwiTmV3IG5hbWVcIikpLnRvTWF0Y2goL1tcXC9cXFxcXW5ldy1uYW1lLylcbiAgICAgICMgbm8gYWx0IHRleHQgc2V0XG4gICAgICBmaXh0dXJlID0gXCJpbWFnZXMvaWNvbnMvZW1vamkvb2N0b2NhdC5wbmdcIlxuICAgICAgZXhwZWN0KGluc2VydEltYWdlVmlldy5jb3B5SW1hZ2VEZXN0UGF0aChmaXh0dXJlLCBcIlwiKSkudG9NYXRjaCgvW1xcL1xcXFxdb2N0b2NhdC5wbmcvKVxuXG4gIGRlc2NyaWJlIFwiLmdlbmVyYXRlSW1hZ2VTcmNcIiwgLT5cbiAgICBpdCBcInJldHVybiBlbXB0eSBpbWFnZSBwYXRoXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJcIlxuICAgICAgZXhwZWN0KGluc2VydEltYWdlVmlldy5nZW5lcmF0ZUltYWdlU3JjKGZpeHR1cmUpKS50b0JlKGZpeHR1cmUpXG5cbiAgICBpdCBcInJldHVybiBVUkwgaW1hZ2UgcGF0aFwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiaHR0cHM6Ly9hc3NldHMtY2RuLmdpdGh1Yi5jb20vaW1hZ2VzL2ljb25zL2Vtb2ppL29jdG9jYXQucG5nXCJcbiAgICAgIGV4cGVjdChpbnNlcnRJbWFnZVZpZXcuZ2VuZXJhdGVJbWFnZVNyYyhmaXh0dXJlKSkudG9CZShmaXh0dXJlKVxuXG4gICAgaXQgXCJyZXR1cm4gcmVsYXRpdmUgaW1hZ2UgcGF0aCBmcm9tIGZpbGVcIiwgLT5cbiAgICAgIGluc2VydEltYWdlVmlldy5lZGl0b3IgPSBlZGl0b3JcbiAgICAgIGF0b20uY29uZmlnLnNldChcIm1hcmtkb3duLXdyaXRlci5yZWxhdGl2ZUltYWdlUGF0aFwiLCB0cnVlKVxuXG4gICAgICBmaXh0dXJlID0gZWRpdG9yLmdldFBhdGgoKS5yZXBsYWNlKFwiZW1wdHkubWFya2Rvd25cIiwgXCJvY3RvY2F0LnBuZ1wiKVxuICAgICAgZXhwZWN0KGluc2VydEltYWdlVmlldy5nZW5lcmF0ZUltYWdlU3JjKGZpeHR1cmUpKS50b0JlKFwib2N0b2NhdC5wbmdcIilcblxuICAgIGl0IFwicmV0dXJuIHJlbGF0aXZlIGltYWdlIHBhdGggZnJvbSBzaXRlXCIsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJtYXJrZG93bi13cml0ZXIuc2l0ZUxvY2FsRGlyXCIsIFwiL2Fzc2V0cy9pbWFnZXMvaWNvbnMvZW1vamlcIilcblxuICAgICAgZml4dHVyZSA9IFwiL2Fzc2V0cy9pbWFnZXMvaWNvbnMvZW1vamkvb2N0b2NhdC5wbmdcIlxuICAgICAgZXhwZWN0KGluc2VydEltYWdlVmlldy5nZW5lcmF0ZUltYWdlU3JjKGZpeHR1cmUpKS50b0JlKFwib2N0b2NhdC5wbmdcIilcblxuICAgIGl0IFwicmV0dXJuIGltYWdlIGRpciBwYXRoIHVzaW5nIGNvbmZpZyB0ZW1wbGF0ZVwiLCAtPlxuICAgICAgaW5zZXJ0SW1hZ2VWaWV3LmRpc3BsYXkoKVxuICAgICAgZml4dHVyZSA9IFwib2N0b2NhdC5wbmdcIlxuICAgICAgZXhwZWN0ZWQgPSAvLy8gXiBcXC9pbWFnZXNcXC9cXGR7NH1cXC9cXGRcXGRcXC9vY3RvY2F0XFwucG5nICQgLy8vXG4gICAgICBleHBlY3QoaW5zZXJ0SW1hZ2VWaWV3LmdlbmVyYXRlSW1hZ2VTcmMoZml4dHVyZSkpLnRvTWF0Y2goZXhwZWN0ZWQpXG4iXX0=
