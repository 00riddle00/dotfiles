(function() {
  var OpenCheatSheet, utils;

  utils = require("../utils");

  module.exports = OpenCheatSheet = (function() {
    function OpenCheatSheet() {}

    OpenCheatSheet.prototype.trigger = function(e) {
      if (!this.hasPreview()) {
        return e.abortKeyBinding();
      }
      return atom.workspace.open(this.cheatsheetURL(), {
        split: 'right',
        searchAllPanes: true
      });
    };

    OpenCheatSheet.prototype.hasPreview = function() {
      return !!atom.packages.activePackages['markdown-preview'];
    };

    OpenCheatSheet.prototype.cheatsheetURL = function() {
      var cheatsheet;
      cheatsheet = utils.getPackagePath("CHEATSHEET.md");
      return "markdown-preview://" + cheatsheet;
    };

    return OpenCheatSheet;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvb3Blbi1jaGVhdC1zaGVldC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUjs7RUFFUixNQUFNLENBQUMsT0FBUCxHQUNNOzs7NkJBQ0osT0FBQSxHQUFTLFNBQUMsQ0FBRDtNQUNQLElBQUEsQ0FBa0MsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFsQztBQUFBLGVBQU8sQ0FBQyxDQUFDLGVBQUYsQ0FBQSxFQUFQOzthQUVBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFDLENBQUEsYUFBRCxDQUFBLENBQXBCLEVBQ0U7UUFBQSxLQUFBLEVBQU8sT0FBUDtRQUFnQixjQUFBLEVBQWdCLElBQWhDO09BREY7SUFITzs7NkJBTVQsVUFBQSxHQUFZLFNBQUE7YUFDVixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFlLENBQUEsa0JBQUE7SUFEckI7OzZCQUdaLGFBQUEsR0FBZSxTQUFBO0FBQ2IsVUFBQTtNQUFBLFVBQUEsR0FBYSxLQUFLLENBQUMsY0FBTixDQUFxQixlQUFyQjthQUNiLHFCQUFBLEdBQXNCO0lBRlQ7Ozs7O0FBYmpCIiwic291cmNlc0NvbnRlbnQiOlsidXRpbHMgPSByZXF1aXJlIFwiLi4vdXRpbHNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBPcGVuQ2hlYXRTaGVldFxuICB0cmlnZ2VyOiAoZSkgLT5cbiAgICByZXR1cm4gZS5hYm9ydEtleUJpbmRpbmcoKSB1bmxlc3MgQGhhc1ByZXZpZXcoKVxuXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBAY2hlYXRzaGVldFVSTCgpLFxuICAgICAgc3BsaXQ6ICdyaWdodCcsIHNlYXJjaEFsbFBhbmVzOiB0cnVlXG5cbiAgaGFzUHJldmlldzogLT5cbiAgICAhIWF0b20ucGFja2FnZXMuYWN0aXZlUGFja2FnZXNbJ21hcmtkb3duLXByZXZpZXcnXVxuXG4gIGNoZWF0c2hlZXRVUkw6IC0+XG4gICAgY2hlYXRzaGVldCA9IHV0aWxzLmdldFBhY2thZ2VQYXRoKFwiQ0hFQVRTSEVFVC5tZFwiKVxuICAgIFwibWFya2Rvd24tcHJldmlldzovLyN7Y2hlYXRzaGVldH1cIlxuIl19
