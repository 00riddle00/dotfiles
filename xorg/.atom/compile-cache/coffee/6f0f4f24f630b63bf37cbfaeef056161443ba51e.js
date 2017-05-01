(function() {
  var ManagePostCategoriesView, ManagePostTagsView;

  ManagePostCategoriesView = require("../../lib/views/manage-post-categories-view");

  ManagePostTagsView = require("../../lib/views/manage-post-tags-view");

  describe("ManageFrontMatterView", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("front-matter.markdown");
      });
    });
    describe("ManagePostCategoriesView", function() {
      var categoriesView, editor, ref;
      ref = [], editor = ref[0], categoriesView = ref[1];
      beforeEach(function() {
        return categoriesView = new ManagePostCategoriesView({});
      });
      describe("when editor has malformed front matter", function() {
        return it("does nothing", function() {
          atom.confirm = function() {
            return {};
          };
          editor = atom.workspace.getActiveTextEditor();
          editor.setText("---\ntitle: Markdown Writer (Jekyll)\n----\n---");
          categoriesView.display();
          return expect(categoriesView.panel.isVisible()).toBe(false);
        });
      });
      return describe("when editor has front matter", function() {
        beforeEach(function() {
          editor = atom.workspace.getActiveTextEditor();
          return editor.setText("---\ntitle: Markdown Writer (Jekyll)\ndate: 2015-08-12 23:19\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
        });
        it("display edit panel", function() {
          categoriesView.display();
          return expect(categoriesView.panel.isVisible()).toBe(true);
        });
        return it("updates editor text", function() {
          categoriesView.display();
          categoriesView.saveFrontMatter();
          expect(categoriesView.panel.isVisible()).toBe(false);
          return expect(editor.getText()).toBe("---\ntitle: Markdown Writer (Jekyll)\ndate: '2015-08-12 23:19'\ncategories:\n  - Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
        });
      });
    });
    return describe("ManagePostTagsView", function() {
      var editor, ref, tagsView;
      ref = [], editor = ref[0], tagsView = ref[1];
      beforeEach(function() {
        return tagsView = new ManagePostTagsView({});
      });
      it("rank tags", function() {
        var fixture, tags;
        fixture = "ab ab cd ab ef gh ef";
        tags = ["ab", "cd", "ef", "ij"].map(function(t) {
          return {
            name: t
          };
        });
        tagsView.rankTags(tags, fixture);
        return expect(tags).toEqual([
          {
            name: "ab",
            count: 3
          }, {
            name: "ef",
            count: 2
          }, {
            name: "cd",
            count: 1
          }, {
            name: "ij",
            count: 0
          }
        ]);
      });
      return it("rank tags with regex escaped", function() {
        var fixture, tags;
        fixture = "c++ c.c^abc $10.0 +abc";
        tags = ["c++", "\\", "^", "$", "+abc"].map(function(t) {
          return {
            name: t
          };
        });
        tagsView.rankTags(tags, fixture);
        return expect(tags).toEqual([
          {
            name: "c++",
            count: 1
          }, {
            name: "^",
            count: 1
          }, {
            name: "$",
            count: 1
          }, {
            name: "+abc",
            count: 1
          }, {
            name: "\\",
            count: 0
          }
        ]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL3ZpZXdzL21hbmFnZS1mcm9udC1tYXR0ZXItdmlldy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsd0JBQUEsR0FBMkIsT0FBQSxDQUFRLDZDQUFSOztFQUMzQixrQkFBQSxHQUFxQixPQUFBLENBQVEsdUNBQVI7O0VBRXJCLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBO0lBQ2hDLFVBQUEsQ0FBVyxTQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLHVCQUFwQjtNQUFILENBQWhCO0lBRFMsQ0FBWDtJQUdBLFFBQUEsQ0FBUywwQkFBVCxFQUFxQyxTQUFBO0FBQ25DLFVBQUE7TUFBQSxNQUEyQixFQUEzQixFQUFDLGVBQUQsRUFBUztNQUVULFVBQUEsQ0FBVyxTQUFBO2VBQ1QsY0FBQSxHQUFxQixJQUFBLHdCQUFBLENBQXlCLEVBQXpCO01BRFosQ0FBWDtNQUdBLFFBQUEsQ0FBUyx3Q0FBVCxFQUFtRCxTQUFBO2VBQ2pELEVBQUEsQ0FBRyxjQUFILEVBQW1CLFNBQUE7VUFDakIsSUFBSSxDQUFDLE9BQUwsR0FBZSxTQUFBO21CQUFHO1VBQUg7VUFDZixNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO1VBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSxpREFBZjtVQU9BLGNBQWMsQ0FBQyxPQUFmLENBQUE7aUJBQ0EsTUFBQSxDQUFPLGNBQWMsQ0FBQyxLQUFLLENBQUMsU0FBckIsQ0FBQSxDQUFQLENBQXdDLENBQUMsSUFBekMsQ0FBOEMsS0FBOUM7UUFYaUIsQ0FBbkI7TUFEaUQsQ0FBbkQ7YUFjQSxRQUFBLENBQVMsOEJBQVQsRUFBeUMsU0FBQTtRQUN2QyxVQUFBLENBQVcsU0FB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cmVxdWlyZSBcIi4uLy4uL2xpYi92aWV3cy9tYW5hZ2UtcG9zdC1jYXRlZ29yaWVzLXZpZXdcIlxuTWFuYWdlUG9zdFRhZ3NWaWV3ID0gcmVxdWlyZSBcIi4uLy4uL2xpYi92aWV3cy9tYW5hZ2UtcG9zdC10YWdzLXZpZXdcIlxuXG5kZXNjcmliZSBcIk1hbmFnZUZyb250TWF0dGVyVmlld1wiLCAtPlxuICBiZWZvcmVFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oXCJmcm9udC1tYXR0ZXIubWFya2Rvd25cIilcblxuICBkZXNjcmliZSBcIk1hbmFnZVBvc3RDYXRlZ29yaWVzVmlld1wiLCAtPlxuICAgIFtlZGl0b3IsIGNhdGVnb3JpZXNWaWV3XSA9IFtdXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBjYXRlZ29yaWVzVmlldyA9IG5ldyBNYW5hZ2VQb3N0Q2F0ZWdvcmllc1ZpZXcoe30pXG5cbiAgICBkZXNjcmliZSBcIndoZW4gZWRpdG9yIGhhcyBtYWxmb3JtZWQgZnJvbnQgbWF0dGVyXCIsIC0+XG4gICAgICBpdCBcImRvZXMgbm90aGluZ1wiLCAtPlxuICAgICAgICBhdG9tLmNvbmZpcm0gPSAtPiB7fSAjIERvdWJsZSwgbXV0ZSBjb25maXJtXG4gICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgICAgICAtLS1cbiAgICAgICAgICB0aXRsZTogTWFya2Rvd24gV3JpdGVyIChKZWt5bGwpXG4gICAgICAgICAgLS0tLVxuICAgICAgICAgIC0tLVxuICAgICAgICBcIlwiXCJcblxuICAgICAgICBjYXRlZ29yaWVzVmlldy5kaXNwbGF5KClcbiAgICAgICAgZXhwZWN0KGNhdGVnb3JpZXNWaWV3LnBhbmVsLmlzVmlzaWJsZSgpKS50b0JlKGZhbHNlKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGVkaXRvciBoYXMgZnJvbnQgbWF0dGVyXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgICAgICAtLS1cbiAgICAgICAgICB0aXRsZTogTWFya2Rvd24gV3JpdGVyIChKZWt5bGwpXG4gICAgICAgICAgZGF0ZTogMjAxNS0wOC0xMiAyMzoxOVxuICAgICAgICAgIGNhdGVnb3JpZXM6IE1hcmtkb3duXG4gICAgICAgICAgdGFnczpcbiAgICAgICAgICAgIC0gV3JpdGVyXG4gICAgICAgICAgICAtIEpla3lsbFxuICAgICAgICAgIC0tLVxuXG4gICAgICAgICAgc29tZSByYW5kb20gdGV4dCAxXG4gICAgICAgICAgc29tZSByYW5kb20gdGV4dCAyXG4gICAgICAgIFwiXCJcIlxuXG4gICAgICBpdCBcImRpc3BsYXkgZWRpdCBwYW5lbFwiLCAtPlxuICAgICAgICBjYXRlZ29yaWVzVmlldy5kaXNwbGF5KClcbiAgICAgICAgZXhwZWN0KGNhdGVnb3JpZXNWaWV3LnBhbmVsLmlzVmlzaWJsZSgpKS50b0JlKHRydWUpXG5cbiAgICAgIGl0IFwidXBkYXRlcyBlZGl0b3IgdGV4dFwiLCAtPlxuICAgICAgICBjYXRlZ29yaWVzVmlldy5kaXNwbGF5KClcbiAgICAgICAgY2F0ZWdvcmllc1ZpZXcuc2F2ZUZyb250TWF0dGVyKClcblxuICAgICAgICBleHBlY3QoY2F0ZWdvcmllc1ZpZXcucGFuZWwuaXNWaXNpYmxlKCkpLnRvQmUoZmFsc2UpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgIC0tLVxuICAgICAgICAgIHRpdGxlOiBNYXJrZG93biBXcml0ZXIgKEpla3lsbClcbiAgICAgICAgICBkYXRlOiAnMjAxNS0wOC0xMiAyMzoxOSdcbiAgICAgICAgICBjYXRlZ29yaWVzOlxuICAgICAgICAgICAgLSBNYXJrZG93blxuICAgICAgICAgIHRhZ3M6XG4gICAgICAgICAgICAtIFdyaXRlclxuICAgICAgICAgICAgLSBKZWt5bGxcbiAgICAgICAgICAtLS1cblxuICAgICAgICAgIHNvbWUgcmFuZG9tIHRleHQgMVxuICAgICAgICAgIHNvbWUgcmFuZG9tIHRleHQgMlxuICAgICAgICBcIlwiXCJcblxuICBkZXNjcmliZSBcIk1hbmFnZVBvc3RUYWdzVmlld1wiLCAtPlxuICAgIFtlZGl0b3IsIHRhZ3NWaWV3XSA9IFtdXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICB0YWdzVmlldyA9IG5ldyBNYW5hZ2VQb3N0VGFnc1ZpZXcoe30pXG5cbiAgICBpdCBcInJhbmsgdGFnc1wiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiYWIgYWIgY2QgYWIgZWYgZ2ggZWZcIlxuICAgICAgdGFncyA9IFtcImFiXCIsIFwiY2RcIiwgXCJlZlwiLCBcImlqXCJdLm1hcCAodCkgLT4gbmFtZTogdFxuXG4gICAgICB0YWdzVmlldy5yYW5rVGFncyh0YWdzLCBmaXh0dXJlKVxuXG4gICAgICBleHBlY3QodGFncykudG9FcXVhbCBbXG4gICAgICAgIHtuYW1lOiBcImFiXCIsIGNvdW50OiAzfVxuICAgICAgICB7bmFtZTogXCJlZlwiLCBjb3VudDogMn1cbiAgICAgICAge25hbWU6IFwiY2RcIiwgY291bnQ6IDF9XG4gICAgICAgIHtuYW1lOiBcImlqXCIsIGNvdW50OiAwfVxuICAgICAgXVxuXG4gICAgaXQgXCJyYW5rIHRhZ3Mgd2l0aCByZWdleCBlc2NhcGVkXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJjKysgYy5jXmFiYyAkMTAuMCArYWJjXCJcbiAgICAgIHRhZ3MgPSBbXCJjKytcIiwgXCJcXFxcXCIsIFwiXlwiLCBcIiRcIiwgXCIrYWJjXCJdLm1hcCAodCkgLT4gbmFtZTogdFxuXG4gICAgICB0YWdzVmlldy5yYW5rVGFncyh0YWdzLCBmaXh0dXJlKVxuXG4gICAgICBleHBlY3QodGFncykudG9FcXVhbCBbXG4gICAgICAgIHtuYW1lOiBcImMrK1wiLCBjb3VudDogMX1cbiAgICAgICAge25hbWU6IFwiXlwiLCBjb3VudDogMX1cbiAgICAgICAge25hbWU6IFwiJFwiLCBjb3VudDogMX1cbiAgICAgICAge25hbWU6IFwiK2FiY1wiLCBjb3VudDogMX1cbiAgICAgICAge25hbWU6IFwiXFxcXFwiLCBjb3VudDogMH1cbiAgICAgIF1cbiJdfQ==
