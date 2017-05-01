(function() {
  var FrontMatter;

  FrontMatter = require("../../lib/helpers/front-matter");

  describe("FrontMatter", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("front-matter.markdown");
      });
    });
    describe("editor without front matter", function() {
      var editor;
      editor = null;
      beforeEach(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
      it("is empty when editor is empty", function() {
        var frontMatter;
        frontMatter = new FrontMatter(editor);
        expect(frontMatter.isEmpty).toBe(true);
        return expect(frontMatter.content).toEqual({});
      });
      it("is empty when editor has no front matter", function() {
        var frontMatter;
        editor.setText("some random text 1\nsome random text 2");
        frontMatter = new FrontMatter(editor);
        expect(frontMatter.isEmpty).toBe(true);
        return expect(frontMatter.content).toEqual({});
      });
      return it("is empty when editor has invalid front matter", function() {
        var frontMatter;
        editor.setText("---\n---\n\nsome random text 1\nsome random text 2");
        frontMatter = new FrontMatter(editor);
        expect(frontMatter.isEmpty).toBe(true);
        return expect(frontMatter.content).toEqual({});
      });
    });
    describe("editor with jekyll front matter", function() {
      var editor, frontMatter, ref;
      ref = [], editor = ref[0], frontMatter = ref[1];
      beforeEach(function() {
        editor = atom.workspace.getActiveTextEditor();
        editor.setText("---\ntitle: Markdown Writer (Jekyll)\ndate: 2015-08-12 23:19\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
        return frontMatter = new FrontMatter(editor);
      });
      it("is not empty", function() {
        return expect(frontMatter.isEmpty).toBe(false);
      });
      it("has fields", function() {
        expect(frontMatter.has("title")).toBe(true);
        expect(frontMatter.has("date")).toBe(true);
        expect(frontMatter.has("categories")).toBe(true);
        return expect(frontMatter.has("tags")).toBe(true);
      });
      it("get field value", function() {
        expect(frontMatter.get("title")).toBe("Markdown Writer (Jekyll)");
        return expect(frontMatter.get("date")).toBe("2015-08-12 23:19");
      });
      it("set field value", function() {
        frontMatter.set("title", "Markdown Writer");
        return expect(frontMatter.get("title")).toBe("Markdown Writer");
      });
      it("normalize field to an array", function() {
        expect(frontMatter.normalizeField("field")).toEqual([]);
        expect(frontMatter.normalizeField("categories")).toEqual(["Markdown"]);
        return expect(frontMatter.normalizeField("tags")).toEqual(["Writer", "Jekyll"]);
      });
      it("get content text with leading fence", function() {
        return expect(frontMatter.getContentText()).toBe("---\ntitle: Markdown Writer (Jekyll)\ndate: '2015-08-12 23:19'\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n");
      });
      return it("save the content to editor", function() {
        frontMatter.save();
        return expect(editor.getText()).toBe("---\ntitle: Markdown Writer (Jekyll)\ndate: '2015-08-12 23:19'\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
      });
    });
    return describe("editor with hexo front matter", function() {
      var editor, frontMatter, ref;
      ref = [], editor = ref[0], frontMatter = ref[1];
      beforeEach(function() {
        editor = atom.workspace.getActiveTextEditor();
        editor.setText("title: Markdown Writer (Hexo)\ndate: 2015-08-12 23:19\n---\n\nsome random text 1\nsome random text 2");
        return frontMatter = new FrontMatter(editor);
      });
      it("is not empty", function() {
        return expect(frontMatter.isEmpty).toBe(false);
      });
      it("has field title/date", function() {
        expect(frontMatter.has("title")).toBe(true);
        return expect(frontMatter.has("date")).toBe(true);
      });
      it("get field value", function() {
        expect(frontMatter.get("title")).toBe("Markdown Writer (Hexo)");
        return expect(frontMatter.get("date")).toBe("2015-08-12 23:19");
      });
      return it("get content text without leading fence", function() {
        return expect(frontMatter.getContentText()).toBe("title: Markdown Writer (Hexo)\ndate: '2015-08-12 23:19'\n---\n");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL2hlbHBlcnMvZnJvbnQtbWF0dGVyLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdDQUFSOztFQUVkLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUE7SUFDdEIsVUFBQSxDQUFXLFNBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsdUJBQXBCO01BQUgsQ0FBaEI7SUFEUyxDQUFYO0lBR0EsUUFBQSxDQUFTLDZCQUFULEVBQXdDLFNBQUE7QUFDdEMsVUFBQTtNQUFBLE1BQUEsR0FBUztNQUVULFVBQUEsQ0FBVyxTQUFBO2VBQ1QsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQURBLENBQVg7TUFHQSxFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQTtBQUNsQyxZQUFBO1FBQUEsV0FBQSxHQUFrQixJQUFBLFdBQUEsQ0FBWSxNQUFaO1FBQ2xCLE1BQUEsQ0FBTyxXQUFXLENBQUMsT0FBbkIsQ0FBMkIsQ0FBQyxJQUE1QixDQUFpQyxJQUFqQztlQUNBLE1BQUEsQ0FBTyxXQUFXLENBQUMsT0FBbkIsQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxFQUFwQztNQUhrQyxDQUFwQztNQUtBLEVBQUEsQ0FBRywwQ0FBSCxFQUErQyxTQUFBO0FBQzdDLFlBQUE7UUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLHdDQUFmO1FBS0EsV0FBQSxHQUFrQixJQUFBLFdBQUEsQ0FBWSxNQUFaO1FBQ2xCLE1BQUEsQ0FBTyxXQUFXLENBQUMsT0FBbkIsQ0FBMkIsQ0FBQyxJQUE1QixDQUFpQyxJQUFqQztlQUNBLE1BQUEsQ0FBTyxXQUFXLENBQUMsT0FBbkIsQ0FBMkIsQ0FB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QUFyQyxDQUEwQyxnRUFBMUM7TUFEMkMsQ0FBN0M7SUExQndDLENBQTFDO0VBL0dzQixDQUF4QjtBQUZBIiwic291cmNlc0NvbnRlbnQiOlsiRnJvbnRNYXR0ZXIgPSByZXF1aXJlIFwiLi4vLi4vbGliL2hlbHBlcnMvZnJvbnQtbWF0dGVyXCJcblxuZGVzY3JpYmUgXCJGcm9udE1hdHRlclwiLCAtPlxuICBiZWZvcmVFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oXCJmcm9udC1tYXR0ZXIubWFya2Rvd25cIilcblxuICBkZXNjcmliZSBcImVkaXRvciB3aXRob3V0IGZyb250IG1hdHRlclwiLCAtPlxuICAgIGVkaXRvciA9IG51bGxcblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgaXQgXCJpcyBlbXB0eSB3aGVuIGVkaXRvciBpcyBlbXB0eVwiLCAtPlxuICAgICAgZnJvbnRNYXR0ZXIgPSBuZXcgRnJvbnRNYXR0ZXIoZWRpdG9yKVxuICAgICAgZXhwZWN0KGZyb250TWF0dGVyLmlzRW1wdHkpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5jb250ZW50KS50b0VxdWFsKHt9KVxuXG4gICAgaXQgXCJpcyBlbXB0eSB3aGVuIGVkaXRvciBoYXMgbm8gZnJvbnQgbWF0dGVyXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgICAgc29tZSByYW5kb20gdGV4dCAxXG4gICAgICAgIHNvbWUgcmFuZG9tIHRleHQgMlxuICAgICAgXCJcIlwiXG5cbiAgICAgIGZyb250TWF0dGVyID0gbmV3IEZyb250TWF0dGVyKGVkaXRvcilcbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5pc0VtcHR5KS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuY29udGVudCkudG9FcXVhbCh7fSlcblxuICAgIGl0IFwiaXMgZW1wdHkgd2hlbiBlZGl0b3IgaGFzIGludmFsaWQgZnJvbnQgbWF0dGVyXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgICAgLS0tXG4gICAgICAgIC0tLVxuXG4gICAgICAgIHNvbWUgcmFuZG9tIHRleHQgMVxuICAgICAgICBzb21lIHJhbmRvbSB0ZXh0IDJcbiAgICAgIFwiXCJcIlxuXG4gICAgICBmcm9udE1hdHRlciA9IG5ldyBGcm9udE1hdHRlcihlZGl0b3IpXG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuaXNFbXB0eSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGZyb250TWF0dGVyLmNvbnRlbnQpLnRvRXF1YWwoe30pXG5cbiAgZGVzY3JpYmUgXCJlZGl0b3Igd2l0aCBqZWt5bGwgZnJvbnQgbWF0dGVyXCIsIC0+XG4gICAgW2VkaXRvciwgZnJvbnRNYXR0ZXJdID0gW11cblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIC0tLVxuICAgICAgICB0aXRsZTogTWFya2Rvd24gV3JpdGVyIChKZWt5bGwpXG4gICAgICAgIGRhdGU6IDIwMTUtMDgtMTIgMjM6MTlcbiAgICAgICAgY2F0ZWdvcmllczogTWFya2Rvd25cbiAgICAgICAgdGFnczpcbiAgICAgICAgICAtIFdyaXRlclxuICAgICAgICAgIC0gSmVreWxsXG4gICAgICAgIC0tLVxuXG4gICAgICAgIHNvbWUgcmFuZG9tIHRleHQgMVxuICAgICAgICBzb21lIHJhbmRvbSB0ZXh0IDJcbiAgICAgIFwiXCJcIlxuXG4gICAgICBmcm9udE1hdHRlciA9IG5ldyBGcm9udE1hdHRlcihlZGl0b3IpXG5cbiAgICBpdCBcImlzIG5vdCBlbXB0eVwiLCAtPlxuICAgICAgZXhwZWN0KGZyb250TWF0dGVyLmlzRW1wdHkpLnRvQmUoZmFsc2UpXG5cbiAgICBpdCBcImhhcyBmaWVsZHNcIiwgLT5cbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5oYXMoXCJ0aXRsZVwiKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGZyb250TWF0dGVyLmhhcyhcImRhdGVcIikpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5oYXMoXCJjYXRlZ29yaWVzXCIpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuaGFzKFwidGFnc1wiKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJnZXQgZmllbGQgdmFsdWVcIiwgLT5cbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5nZXQoXCJ0aXRsZVwiKSkudG9CZShcIk1hcmtkb3duIFdyaXRlciAoSmVreWxsKVwiKVxuICAgICAgZXhwZWN0KGZyb250TWF0dGVyLmdldChcImRhdGVcIikpLnRvQmUoXCIyMDE1LTA4LTEyIDIzOjE5XCIpXG5cbiAgICBpdCBcInNldCBmaWVsZCB2YWx1ZVwiLCAtPlxuICAgICAgZnJvbnRNYXR0ZXIuc2V0KFwidGl0bGVcIiwgXCJNYXJrZG93biBXcml0ZXJcIilcbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5nZXQoXCJ0aXRsZVwiKSkudG9CZShcIk1hcmtkb3duIFdyaXRlclwiKVxuXG4gICAgaXQgXCJub3JtYWxpemUgZmllbGQgdG8gYW4gYXJyYXlcIiwgLT5cbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5ub3JtYWxpemVGaWVsZChcImZpZWxkXCIpKS50b0VxdWFsKFtdKVxuICAgICAgZXhwZWN0KGZyb250TWF0dGVyLm5vcm1hbGl6ZUZpZWxkKFwiY2F0ZWdvcmllc1wiKSkudG9FcXVhbChbXCJNYXJrZG93blwiXSlcbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5ub3JtYWxpemVGaWVsZChcInRhZ3NcIikpLnRvRXF1YWwoW1wiV3JpdGVyXCIsIFwiSmVreWxsXCJdKVxuXG4gICAgaXQgXCJnZXQgY29udGVudCB0ZXh0IHdpdGggbGVhZGluZyBmZW5jZVwiLCAtPlxuICAgICAgZXhwZWN0KGZyb250TWF0dGVyLmdldENvbnRlbnRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgIC0tLVxuICAgICAgICB0aXRsZTogTWFya2Rvd24gV3JpdGVyIChKZWt5bGwpXG4gICAgICAgIGRhdGU6ICcyMDE1LTA4LTEyIDIzOjE5J1xuICAgICAgICBjYXRlZ29yaWVzOiBNYXJrZG93blxuICAgICAgICB0YWdzOlxuICAgICAgICAgIC0gV3JpdGVyXG4gICAgICAgICAgLSBKZWt5bGxcbiAgICAgICAgLS0tXG5cbiAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJzYXZlIHRoZSBjb250ZW50IHRvIGVkaXRvclwiLCAtPlxuICAgICAgZnJvbnRNYXR0ZXIuc2F2ZSgpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAtLS1cbiAgICAgICAgdGl0bGU6IE1hcmtkb3duIFdyaXRlciAoSmVreWxsKVxuICAgICAgICBkYXRlOiAnMjAxNS0wOC0xMiAyMzoxOSdcbiAgICAgICAgY2F0ZWdvcmllczogTWFya2Rvd25cbiAgICAgICAgdGFnczpcbiAgICAgICAgICAtIFdyaXRlclxuICAgICAgICAgIC0gSmVreWxsXG4gICAgICAgIC0tLVxuXG4gICAgICAgIHNvbWUgcmFuZG9tIHRleHQgMVxuICAgICAgICBzb21lIHJhbmRvbSB0ZXh0IDJcbiAgICAgIFwiXCJcIlxuXG4gIGRlc2NyaWJlIFwiZWRpdG9yIHdpdGggaGV4byBmcm9udCBtYXR0ZXJcIiwgLT5cbiAgICBbZWRpdG9yLCBmcm9udE1hdHRlcl0gPSBbXVxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgICAgdGl0bGU6IE1hcmtkb3duIFdyaXRlciAoSGV4bylcbiAgICAgICAgZGF0ZTogMjAxNS0wOC0xMiAyMzoxOVxuICAgICAgICAtLS1cblxuICAgICAgICBzb21lIHJhbmRvbSB0ZXh0IDFcbiAgICAgICAgc29tZSByYW5kb20gdGV4dCAyXG4gICAgICBcIlwiXCJcbiAgICAgIGZyb250TWF0dGVyID0gbmV3IEZyb250TWF0dGVyKGVkaXRvcilcblxuICAgIGl0IFwiaXMgbm90IGVtcHR5XCIsIC0+XG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuaXNFbXB0eSkudG9CZShmYWxzZSlcblxuICAgIGl0IFwiaGFzIGZpZWxkIHRpdGxlL2RhdGVcIiwgLT5cbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5oYXMoXCJ0aXRsZVwiKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGZyb250TWF0dGVyLmhhcyhcImRhdGVcIikpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiZ2V0IGZpZWxkIHZhbHVlXCIsIC0+XG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuZ2V0KFwidGl0bGVcIikpLnRvQmUoXCJNYXJrZG93biBXcml0ZXIgKEhleG8pXCIpXG4gICAgICBleHBlY3QoZnJvbnRNYXR0ZXIuZ2V0KFwiZGF0ZVwiKSkudG9CZShcIjIwMTUtMDgtMTIgMjM6MTlcIilcblxuICAgIGl0IFwiZ2V0IGNvbnRlbnQgdGV4dCB3aXRob3V0IGxlYWRpbmcgZmVuY2VcIiwgLT5cbiAgICAgIGV4cGVjdChmcm9udE1hdHRlci5nZXRDb250ZW50VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICB0aXRsZTogTWFya2Rvd24gV3JpdGVyIChIZXhvKVxuICAgICAgICBkYXRlOiAnMjAxNS0wOC0xMiAyMzoxOSdcbiAgICAgICAgLS0tXG5cbiAgICAgIFwiXCJcIlxuIl19
