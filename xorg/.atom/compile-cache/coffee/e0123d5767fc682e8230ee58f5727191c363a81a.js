(function() {
  var StyleText;

  StyleText = require("../../lib/commands/style-text");

  describe("StyleText", function() {
    describe(".isStyleOn", function() {
      it("check a style is added", function() {
        var cmd, fixture;
        cmd = new StyleText("bold");
        fixture = "**bold**";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      it("check any bold style is in string", function() {
        var cmd, fixture;
        cmd = new StyleText("bold");
        fixture = "hello **bold** world";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      it("check any italic is in string", function() {
        var cmd, fixture;
        cmd = new StyleText("italic");
        fixture = "_italic_ yah _text_";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      it("check any strike is in string", function() {
        var cmd, fixture;
        cmd = new StyleText("strikethrough");
        fixture = "**bold** one ~~strike~~ two _italic_";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      return it("check a style is not added", function() {
        var cmd, fixture;
        cmd = new StyleText("bold");
        fixture = "_not bold_";
        return expect(cmd.isStyleOn(fixture)).toBe(false);
      });
    });
    describe(".removeStyle", function() {
      it("remove a style from text", function() {
        var cmd, fixture;
        cmd = new StyleText("italic");
        fixture = "_italic text_";
        return expect(cmd.removeStyle(fixture)).toEqual("italic text");
      });
      it("remove bold style from text", function() {
        var cmd, fixture;
        cmd = new StyleText("bold");
        fixture = "**bold text** in a string";
        return expect(cmd.removeStyle(fixture)).toEqual("bold text in a string");
      });
      return it("remove italic styles from text", function() {
        var cmd, fixture;
        cmd = new StyleText("italic");
        fixture = "_italic_ yah _text_ loh _more_";
        return expect(cmd.removeStyle(fixture)).toEqual("italic yah text loh more");
      });
    });
    describe(".addStyle", function() {
      return it("add a style to text", function() {
        var cmd, fixture;
        cmd = new StyleText("bold");
        fixture = "bold text";
        return expect(cmd.addStyle(fixture)).toEqual("**bold text**");
      });
    });
    return describe(".trigger", function() {
      var editor;
      editor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open("empty.markdown");
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it("insert empty bold style", function() {
        new StyleText("bold").trigger();
        expect(editor.getText()).toBe("****");
        return expect(editor.getCursorBufferPosition().column).toBe(2);
      });
      it("apply italic style to word", function() {
        editor.setText("italic");
        editor.setCursorBufferPosition([0, 2]);
        new StyleText("italic").trigger();
        expect(editor.getText()).toBe("_italic_");
        return expect(editor.getCursorBufferPosition().column).toBe(8);
      });
      it("remove italic style from word", function() {
        editor.setText("_italic_");
        editor.setCursorBufferPosition([0, 3]);
        new StyleText("italic").trigger();
        expect(editor.getText()).toBe("italic");
        return expect(editor.getCursorBufferPosition().column).toBe(6);
      });
      return it("toggle code style on selection", function() {
        editor.setText("some code here");
        editor.setSelectedBufferRange([[0, 5], [0, 9]]);
        new StyleText("code").trigger();
        expect(editor.getText()).toBe("some `code` here");
        return expect(editor.getCursorBufferPosition().column).toBe(11);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL2NvbW1hbmRzL3N0eWxlLXRleHQtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsK0JBQVI7O0VBRVosUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQTtJQUNwQixRQUFBLENBQVMsWUFBVCxFQUF1QixTQUFBO01BQ3JCLEVBQUEsQ0FBRyx3QkFBSCxFQUE2QixTQUFBO0FBQzNCLFlBQUE7UUFBQSxHQUFBLEdBQVUsSUFBQSxTQUFBLENBQVUsTUFBVjtRQUNWLE9BQUEsR0FBVTtlQUNWLE1BQUEsQ0FBTyxHQUFHLENBQUMsU0FBSixDQUFjLE9BQWQsQ0FBUCxDQUE4QixDQUFDLElBQS9CLENBQW9DLElBQXBDO01BSDJCLENBQTdCO01BS0EsRUFBQSxDQUFHLG1DQUFILEVBQXdDLFNBQUE7QUFDdEMsWUFBQTtRQUFBLEdBQUEsR0FBVSxJQUFBLFNBQUEsQ0FBVSxNQUFWO1FBQ1YsT0FBQSxHQUFVO2VBQ1YsTUFBQSxDQUFPLEdBQUcsQ0FBQyxTQUFKLENBQWMsT0FBZCxDQUFQLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsSUFBcEM7TUFIc0MsQ0FBeEM7TUFLQSxFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQTtBQUNsQyxZQUFBO1FBQUEsR0FBQSxHQUFVLElBQUEsU0FBQSxDQUFVLFFBQVY7UUFDVixPQUFBLEdBQVU7ZUFDVixNQUFBLENBQU8sR0FBRyxDQUFDLFNBQUosQ0FBYyxPQUFkLENBQVAsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxJQUFwQztNQUhrQyxDQUFwQztNQUtBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBO0FBQ2xDLFlBQUE7UUFBQSxHQUFBLEdBQVUsSUFBQSxTQUFBLENBQVUsZUFBVjtRQUNWLE9BQUEsR0FBVTtl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VUFBOUI7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBZ0MsQ0FBQyxNQUF4QyxDQUErQyxDQUFDLElBQWhELENBQXFELENBQXJEO01BUCtCLENBQWpDO01BU0EsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUE7UUFDbEMsTUFBTSxDQUFDLE9BQVAsQ0FBZSxVQUFmO1FBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFFSSxJQUFBLFNBQUEsQ0FBVSxRQUFWLENBQW1CLENBQUMsT0FBcEIsQ0FBQTtRQUVKLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixRQUE5QjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFnQyxDQUFDLE1BQXhDLENBQStDLENBQUMsSUFBaEQsQ0FBcUQsQ0FBckQ7TUFQa0MsQ0FBcEM7YUFTQSxFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQTtRQUNuQyxNQUFNLENBQUMsT0FBUCxDQUFlLGdCQUFmO1FBQ0EsTUFBTSxDQUFDLHNCQUFQLENBQThCLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQTlCO1FBRUksSUFBQSxTQUFBLENBQVUsTUFBVixDQUFpQixDQUFDLE9BQWxCLENBQUE7UUFFSixNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsa0JBQTlCO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQWdDLENBQUMsTUFBeEMsQ0FBK0MsQ0FBQyxJQUFoRCxDQUFxRCxFQUFyRDtNQVBtQyxDQUFyQztJQS9CbUIsQ0FBckI7RUFqRG9CLENBQXRCO0FBRkEiLCJzb3VyY2VzQ29udGVudCI6WyJTdHlsZVRleHQgPSByZXF1aXJlIFwiLi4vLi4vbGliL2NvbW1hbmRzL3N0eWxlLXRleHRcIlxuXG5kZXNjcmliZSBcIlN0eWxlVGV4dFwiLCAtPlxuICBkZXNjcmliZSBcIi5pc1N0eWxlT25cIiwgLT5cbiAgICBpdCBcImNoZWNrIGEgc3R5bGUgaXMgYWRkZWRcIiwgLT5cbiAgICAgIGNtZCA9IG5ldyBTdHlsZVRleHQoXCJib2xkXCIpXG4gICAgICBmaXh0dXJlID0gXCIqKmJvbGQqKlwiXG4gICAgICBleHBlY3QoY21kLmlzU3R5bGVPbihmaXh0dXJlKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJjaGVjayBhbnkgYm9sZCBzdHlsZSBpcyBpbiBzdHJpbmdcIiwgLT5cbiAgICAgIGNtZCA9IG5ldyBTdHlsZVRleHQoXCJib2xkXCIpXG4gICAgICBmaXh0dXJlID0gXCJoZWxsbyAqKmJvbGQqKiB3b3JsZFwiXG4gICAgICBleHBlY3QoY21kLmlzU3R5bGVPbihmaXh0dXJlKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJjaGVjayBhbnkgaXRhbGljIGlzIGluIHN0cmluZ1wiLCAtPlxuICAgICAgY21kID0gbmV3IFN0eWxlVGV4dChcIml0YWxpY1wiKVxuICAgICAgZml4dHVyZSA9IFwiX2l0YWxpY18geWFoIF90ZXh0X1wiXG4gICAgICBleHBlY3QoY21kLmlzU3R5bGVPbihmaXh0dXJlKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJjaGVjayBhbnkgc3RyaWtlIGlzIGluIHN0cmluZ1wiLCAtPlxuICAgICAgY21kID0gbmV3IFN0eWxlVGV4dChcInN0cmlrZXRocm91Z2hcIilcbiAgICAgIGZpeHR1cmUgPSBcIioqYm9sZCoqIG9uZSB+fnN0cmlrZX5+IHR3byBfaXRhbGljX1wiXG4gICAgICBleHBlY3QoY21kLmlzU3R5bGVPbihmaXh0dXJlKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJjaGVjayBhIHN0eWxlIGlzIG5vdCBhZGRlZFwiLCAtPlxuICAgICAgY21kID0gbmV3IFN0eWxlVGV4dChcImJvbGRcIilcbiAgICAgIGZpeHR1cmUgPSBcIl9ub3QgYm9sZF9cIlxuICAgICAgZXhwZWN0KGNtZC5pc1N0eWxlT24oZml4dHVyZSkpLnRvQmUoZmFsc2UpXG5cbiAgZGVzY3JpYmUgXCIucmVtb3ZlU3R5bGVcIiwgLT5cbiAgICBpdCBcInJlbW92ZSBhIHN0eWxlIGZyb20gdGV4dFwiLCAtPlxuICAgICAgY21kID0gbmV3IFN0eWxlVGV4dChcIml0YWxpY1wiKVxuICAgICAgZml4dHVyZSA9IFwiX2l0YWxpYyB0ZXh0X1wiXG4gICAgICBleHBlY3QoY21kLnJlbW92ZVN0eWxlKGZpeHR1cmUpKS50b0VxdWFsKFwiaXRhbGljIHRleHRcIilcblxuICAgIGl0IFwicmVtb3ZlIGJvbGQgc3R5bGUgZnJvbSB0ZXh0XCIsIC0+XG4gICAgICBjbWQgPSBuZXcgU3R5bGVUZXh0KFwiYm9sZFwiKVxuICAgICAgZml4dHVyZSA9IFwiKipib2xkIHRleHQqKiBpbiBhIHN0cmluZ1wiXG4gICAgICBleHBlY3QoY21kLnJlbW92ZVN0eWxlKGZpeHR1cmUpKS50b0VxdWFsKFwiYm9sZCB0ZXh0IGluIGEgc3RyaW5nXCIpXG5cbiAgICBpdCBcInJlbW92ZSBpdGFsaWMgc3R5bGVzIGZyb20gdGV4dFwiLCAtPlxuICAgICAgY21kID0gbmV3IFN0eWxlVGV4dChcIml0YWxpY1wiKVxuICAgICAgZml4dHVyZSA9IFwiX2l0YWxpY18geWFoIF90ZXh0XyBsb2ggX21vcmVfXCJcbiAgICAgIGV4cGVjdChjbWQucmVtb3ZlU3R5bGUoZml4dHVyZSkpLnRvRXF1YWwoXCJpdGFsaWMgeWFoIHRleHQgbG9oIG1vcmVcIilcblxuICBkZXNjcmliZSBcIi5hZGRTdHlsZVwiLCAtPlxuICAgIGl0IFwiYWRkIGEgc3R5bGUgdG8gdGV4dFwiLCAtPlxuICAgICAgY21kID0gbmV3IFN0eWxlVGV4dChcImJvbGRcIilcbiAgICAgIGZpeHR1cmUgPSBcImJvbGQgdGV4dFwiXG4gICAgICBleHBlY3QoY21kLmFkZFN0eWxlKGZpeHR1cmUpKS50b0VxdWFsKFwiKipib2xkIHRleHQqKlwiKVxuXG4gIGRlc2NyaWJlIFwiLnRyaWdnZXJcIiwgLT5cbiAgICBlZGl0b3IgPSBudWxsXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihcImVtcHR5Lm1hcmtkb3duXCIpXG4gICAgICBydW5zIC0+IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgaXQgXCJpbnNlcnQgZW1wdHkgYm9sZCBzdHlsZVwiLCAtPlxuICAgICAgbmV3IFN0eWxlVGV4dChcImJvbGRcIikudHJpZ2dlcigpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKFwiKioqKlwiKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLmNvbHVtbikudG9CZSgyKVxuXG4gICAgaXQgXCJhcHBseSBpdGFsaWMgc3R5bGUgdG8gd29yZFwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJpdGFsaWNcIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMl0pXG5cbiAgICAgIG5ldyBTdHlsZVRleHQoXCJpdGFsaWNcIikudHJpZ2dlcigpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKFwiX2l0YWxpY19cIilcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5jb2x1bW4pLnRvQmUoOClcblxuICAgIGl0IFwicmVtb3ZlIGl0YWxpYyBzdHlsZSBmcm9tIHdvcmRcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiX2l0YWxpY19cIilcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgM10pXG5cbiAgICAgIG5ldyBTdHlsZVRleHQoXCJpdGFsaWNcIikudHJpZ2dlcigpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKFwiaXRhbGljXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkuY29sdW1uKS50b0JlKDYpXG5cbiAgICBpdCBcInRvZ2dsZSBjb2RlIHN0eWxlIG9uIHNlbGVjdGlvblwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoXCJzb21lIGNvZGUgaGVyZVwiKVxuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UoW1swLCA1XSwgWzAsIDldXSlcblxuICAgICAgbmV3IFN0eWxlVGV4dChcImNvZGVcIikudHJpZ2dlcigpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKFwic29tZSBgY29kZWAgaGVyZVwiKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLmNvbHVtbikudG9CZSgxMSlcbiJdfQ==
