(function() {
  var helper;

  helper = require("../../lib/helpers/template-helper");

  describe("templateHelper", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("front-matter.markdown");
      });
    });
    describe(".getFrontMatterDate", function() {
      return it("get date + time to string", function() {
        var date;
        date = helper.getFrontMatterDate(helper.getDateTime());
        return expect(date).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/);
      });
    });
    describe(".parseFrontMatterDate", function() {
      return it("parse date + time to hash", function() {
        var dateTime, expected, i, key, len, results, value;
        atom.config.set("markdown-writer.frontMatterDate", "{year}-{month}-{day} {hour}:{minute}");
        dateTime = helper.parseFrontMatterDate("2016-01-03 19:11");
        expected = {
          year: "2016",
          month: "01",
          day: "03",
          hour: "19",
          minute: "11"
        };
        results = [];
        for (value = i = 0, len = expected.length; i < len; value = ++i) {
          key = expected[value];
          results.push(expect(dateTime[key]).toEqual(value));
        }
        return results;
      });
    });
    return describe(".getFileSlug", function() {
      it("get title slug", function() {
        var fixture, slug;
        slug = "hello-world";
        fixture = "abc/hello-world.markdown";
        expect(helper.getFileSlug(fixture)).toEqual(slug);
        fixture = "abc/2014-02-12-hello-world.markdown";
        return expect(helper.getFileSlug(fixture)).toEqual(slug);
      });
      it("get title slug", function() {
        var fixture, slug;
        atom.config.set("markdown-writer.newPostFileName", "{slug}-{day}-{month}-{year}{extension}");
        slug = "hello-world";
        fixture = "abc/hello-world-02-12-2014.markdown";
        return expect(helper.getFileSlug(fixture)).toEqual(slug);
      });
      return it("get empty slug", function() {
        expect(helper.getFileSlug(void 0)).toEqual("");
        return expect(helper.getFileSlug("")).toEqual("");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL2hlbHBlcnMvdGVtcGxhdGUtaGVscGVyLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLG1DQUFSOztFQUVULFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBO0lBQ3pCLFVBQUEsQ0FBVyxTQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLHVCQUFwQjtNQUFILENBQWhCO0lBRFMsQ0FBWDtJQUdBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBO2FBQzlCLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBO0FBQzlCLFlBQUE7UUFBQSxJQUFBLEdBQU8sTUFBTSxDQUFDLGtCQUFQLENBQTBCLE1BQU0sQ0FBQyxXQUFQLENBQUEsQ0FBMUI7ZUFDUCxNQUFBLENBQU8sSUFBUCxDQUFZLENBQUMsT0FBYixDQUFxQiwrQkFBckI7TUFGOEIsQ0FBaEM7SUFEOEIsQ0FBaEM7SUFLQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQTthQUNoQyxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQTtBQUM5QixZQUFBO1FBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQixFQUFtRCxzQ0FBbkQ7UUFDQSxRQUFBLEdBQVcsTUFBTSxDQUFDLG9CQUFQLENBQTRCLGtCQUE1QjtRQUNYLFFBQUEsR0FBVztVQUFBLElBQUEsRUFBTSxNQUFOO1VBQWMsS0FBQSxFQUFPLElBQXJCO1VBQTJCLEdBQUEsRUFBSyxJQUFoQztVQUFzQyxJQUFBLEVBQU0sSUFBNUM7VUFBa0QsTUFBQSxFQUFRLElBQTFEOztBQUNYO2FBQUEsMERBQUE7O3VCQUFBLE1BQUEsQ0FBTyxRQUFTLENBQUEsR0FBQSxDQUFoQixDQUFxQixDQUFDLE9BQXRCLENBQThCLEtBQTlCO0FBQUE7O01BSjhCLENBQWhDO0lBRGdDLENBQWxDO1dBT0EsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQTtNQUN2QixFQUFBLENBQUcsZ0JBQUgsRUFBcUIsU0FBQTtBQUNuQixZQUFBO1FBQUEsSUFBQSxHQUFPO1FBQ1AsT0FBQSxHQUFVO1FBQ1YsTUFBQSxDQUFPLE1BQU0sQ0FBQyxXQUFQLENBQW1CLE9BQW5CLENBQVAsQ0FBbUMsQ0FBQyxPQUFwQyxDQUE0QyxJQUE1QztRQUNBLE9BQUEsR0FBVTtlQUNWLE1BQUEsQ0FBTyxNQUFNLENBQUMsV0FBUCxDQUFtQixPQUFuQixDQUFQLENBQW1DLENBQUMsT0FBcEMsQ0FBNEMsSUFBNUM7TUFMbUIsQ0FBckI7TUFPQSxFQUFBLENBQUcsZ0JBQUgsRUFBcUIsU0FBQTtBQUNuQixZQUFBO1FBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQixFQUFtRCx3Q0FBbkQ7UUFDQSxJQUFBLEdBQU87UUFDUCxPQUFBLEdBQVU7ZUFDVixNQUFBLENBQU8sTUFBTSxDQUFDLFdBQVAsQ0FBbUIsT0FBbkIsQ0FBUCxDQUFtQyxDQUFDLE9BQXBDLENBQTRDLElBQTVDO01BSm1CLENBQXJCO2FBTUEsRUFBQSxDQUFHLGdCQUFILEVBQXFCLFNBQUE7UUFDbkIsTUFBQSxDQUFPLE1BQU0sQ0FBQyxXQUFQLENBQW1CLE1BQW5CLENBQVAsQ0FBcUMsQ0FBQyxPQUF0QyxDQUE4QyxFQUE5QztlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsV0FBUCxDQUFtQixFQUFuQixDQUFQLENBQThCLENBQUMsT0FBL0IsQ0FBdUMsRUFBdkM7TUFGbUIsQ0FBckI7SUFkdUIsQ0FBekI7RUFoQnlCLENBQTNCO0FBRkEiLCJzb3VyY2VzQ29udGVudCI6WyJoZWxwZXIgPSByZXF1aXJlIFwiLi4vLi4vbGliL2hlbHBlcnMvdGVtcGxhdGUtaGVscGVyXCJcblxuZGVzY3JpYmUgXCJ0ZW1wbGF0ZUhlbHBlclwiLCAtPlxuICBiZWZvcmVFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oXCJmcm9udC1tYXR0ZXIubWFya2Rvd25cIilcblxuICBkZXNjcmliZSBcIi5nZXRGcm9udE1hdHRlckRhdGVcIiwgLT5cbiAgICBpdCBcImdldCBkYXRlICsgdGltZSB0byBzdHJpbmdcIiwgLT5cbiAgICAgIGRhdGUgPSBoZWxwZXIuZ2V0RnJvbnRNYXR0ZXJEYXRlKGhlbHBlci5nZXREYXRlVGltZSgpKVxuICAgICAgZXhwZWN0KGRhdGUpLnRvTWF0Y2goL1xcZHs0fS1cXGR7Mn0tXFxkezJ9IFxcZHsyfTpcXGR7Mn0vKVxuXG4gIGRlc2NyaWJlIFwiLnBhcnNlRnJvbnRNYXR0ZXJEYXRlXCIsIC0+XG4gICAgaXQgXCJwYXJzZSBkYXRlICsgdGltZSB0byBoYXNoXCIsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJtYXJrZG93bi13cml0ZXIuZnJvbnRNYXR0ZXJEYXRlXCIsIFwie3llYXJ9LXttb250aH0te2RheX0ge2hvdXJ9OnttaW51dGV9XCIpXG4gICAgICBkYXRlVGltZSA9IGhlbHBlci5wYXJzZUZyb250TWF0dGVyRGF0ZShcIjIwMTYtMDEtMDMgMTk6MTFcIilcbiAgICAgIGV4cGVjdGVkID0geWVhcjogXCIyMDE2XCIsIG1vbnRoOiBcIjAxXCIsIGRheTogXCIwM1wiLCBob3VyOiBcIjE5XCIsIG1pbnV0ZTogXCIxMVwiXG4gICAgICBleHBlY3QoZGF0ZVRpbWVba2V5XSkudG9FcXVhbCh2YWx1ZSkgZm9yIGtleSwgdmFsdWUgaW4gZXhwZWN0ZWRcblxuICBkZXNjcmliZSBcIi5nZXRGaWxlU2x1Z1wiLCAtPlxuICAgIGl0IFwiZ2V0IHRpdGxlIHNsdWdcIiwgLT5cbiAgICAgIHNsdWcgPSBcImhlbGxvLXdvcmxkXCJcbiAgICAgIGZpeHR1cmUgPSBcImFiYy9oZWxsby13b3JsZC5tYXJrZG93blwiXG4gICAgICBleHBlY3QoaGVscGVyLmdldEZpbGVTbHVnKGZpeHR1cmUpKS50b0VxdWFsKHNsdWcpXG4gICAgICBmaXh0dXJlID0gXCJhYmMvMjAxNC0wMi0xMi1oZWxsby13b3JsZC5tYXJrZG93blwiXG4gICAgICBleHBlY3QoaGVscGVyLmdldEZpbGVTbHVnKGZpeHR1cmUpKS50b0VxdWFsKHNsdWcpXG5cbiAgICBpdCBcImdldCB0aXRsZSBzbHVnXCIsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJtYXJrZG93bi13cml0ZXIubmV3UG9zdEZpbGVOYW1lXCIsIFwie3NsdWd9LXtkYXl9LXttb250aH0te3llYXJ9e2V4dGVuc2lvbn1cIilcbiAgICAgIHNsdWcgPSBcImhlbGxvLXdvcmxkXCJcbiAgICAgIGZpeHR1cmUgPSBcImFiYy9oZWxsby13b3JsZC0wMi0xMi0yMDE0Lm1hcmtkb3duXCJcbiAgICAgIGV4cGVjdChoZWxwZXIuZ2V0RmlsZVNsdWcoZml4dHVyZSkpLnRvRXF1YWwoc2x1ZylcblxuICAgIGl0IFwiZ2V0IGVtcHR5IHNsdWdcIiwgLT5cbiAgICAgIGV4cGVjdChoZWxwZXIuZ2V0RmlsZVNsdWcodW5kZWZpbmVkKSkudG9FcXVhbChcIlwiKVxuICAgICAgZXhwZWN0KGhlbHBlci5nZXRGaWxlU2x1ZyhcIlwiKSkudG9FcXVhbChcIlwiKVxuIl19
