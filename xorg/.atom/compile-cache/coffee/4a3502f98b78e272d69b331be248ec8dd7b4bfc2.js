(function() {
  var OpenCheatSheet;

  OpenCheatSheet = require("../../lib/commands/open-cheat-sheet");

  describe("OpenCheatSheet", function() {
    return it("returns correct cheatsheetURL", function() {
      var cmd;
      cmd = new OpenCheatSheet();
      expect(cmd.cheatsheetURL()).toMatch("markdown-preview://");
      expect(cmd.cheatsheetURL()).toMatch("CHEATSHEET.md");
      return expect(cmd.cheatsheetURL()).toNotMatch("%5C");
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL2NvbW1hbmRzL29wZW4tY2hlYXQtc2hlZXQtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHFDQUFSOztFQUVqQixRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQTtXQUN6QixFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQTtBQUNsQyxVQUFBO01BQUEsR0FBQSxHQUFVLElBQUEsY0FBQSxDQUFBO01BQ1YsTUFBQSxDQUFPLEdBQUcsQ0FBQyxhQUFKLENBQUEsQ0FBUCxDQUEyQixDQUFDLE9BQTVCLENBQW9DLHFCQUFwQztNQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsYUFBSixDQUFBLENBQVAsQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxlQUFwQzthQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsYUFBSixDQUFBLENBQVAsQ0FBMkIsQ0FBQyxVQUE1QixDQUF1QyxLQUF2QztJQUprQyxDQUFwQztFQUR5QixDQUEzQjtBQUZBIiwic291cmNlc0NvbnRlbnQiOlsiT3BlbkNoZWF0U2hlZXQgPSByZXF1aXJlIFwiLi4vLi4vbGliL2NvbW1hbmRzL29wZW4tY2hlYXQtc2hlZXRcIlxuXG5kZXNjcmliZSBcIk9wZW5DaGVhdFNoZWV0XCIsIC0+XG4gIGl0IFwicmV0dXJucyBjb3JyZWN0IGNoZWF0c2hlZXRVUkxcIiwgLT5cbiAgICBjbWQgPSBuZXcgT3BlbkNoZWF0U2hlZXQoKVxuICAgIGV4cGVjdChjbWQuY2hlYXRzaGVldFVSTCgpKS50b01hdGNoKFwibWFya2Rvd24tcHJldmlldzovL1wiKVxuICAgIGV4cGVjdChjbWQuY2hlYXRzaGVldFVSTCgpKS50b01hdGNoKFwiQ0hFQVRTSEVFVC5tZFwiKVxuICAgIGV4cGVjdChjbWQuY2hlYXRzaGVldFVSTCgpKS50b05vdE1hdGNoKFwiJTVDXCIpXG4iXX0=
