(function() {
  var CreateProjectConfigs, config, fs;

  fs = require("fs-plus");

  config = require("../config");

  module.exports = CreateProjectConfigs = (function() {
    function CreateProjectConfigs() {}

    CreateProjectConfigs.prototype.trigger = function() {
      var configFile, content, err;
      configFile = config.getProjectConfigFile();
      if (!this.inProjectFolder(configFile)) {
        return;
      }
      if (this.fileExists(configFile)) {
        return;
      }
      content = fs.readFileSync(config.getSampleConfigFile());
      err = fs.writeFileSync(configFile, content);
      if (!err) {
        return atom.workspace.open(configFile);
      }
    };

    CreateProjectConfigs.prototype.inProjectFolder = function(configFile) {
      if (configFile) {
        return true;
      }
      atom.confirm({
        message: "[Markdown Writer] Error!",
        detailedMessage: "Cannot create file if you are not in a project folder.",
        buttons: ['OK']
      });
      return false;
    };

    CreateProjectConfigs.prototype.fileExists = function(configFile) {
      var exists;
      exists = fs.existsSync(configFile);
      if (exists) {
        atom.confirm({
          message: "[Markdown Writer] Error!",
          detailedMessage: "Project config file already exists:\n" + configFile,
          buttons: ['OK']
        });
      }
      return exists;
    };

    return CreateProjectConfigs;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvY3JlYXRlLXByb2plY3QtY29uZmlncy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFFTCxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O21DQUNKLE9BQUEsR0FBUyxTQUFBO0FBQ1AsVUFBQTtNQUFBLFVBQUEsR0FBYSxNQUFNLENBQUMsb0JBQVAsQ0FBQTtNQUViLElBQUEsQ0FBYyxJQUFDLENBQUEsZUFBRCxDQUFpQixVQUFqQixDQUFkO0FBQUEsZUFBQTs7TUFDQSxJQUFVLElBQUMsQ0FBQSxVQUFELENBQVksVUFBWixDQUFWO0FBQUEsZUFBQTs7TUFFQSxPQUFBLEdBQVUsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsTUFBTSxDQUFDLG1CQUFQLENBQUEsQ0FBaEI7TUFDVixHQUFBLEdBQU0sRUFBRSxDQUFDLGFBQUgsQ0FBaUIsVUFBakIsRUFBNkIsT0FBN0I7TUFFTixJQUFBLENBQXVDLEdBQXZDO2VBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFVBQXBCLEVBQUE7O0lBVE87O21DQVdULGVBQUEsR0FBaUIsU0FBQyxVQUFEO01BQ2YsSUFBZSxVQUFmO0FBQUEsZUFBTyxLQUFQOztNQUNBLElBQUksQ0FBQyxPQUFMLENBQ0U7UUFBQSxPQUFBLEVBQVMsMEJBQVQ7UUFDQSxlQUFBLEVBQWlCLHdEQURqQjtRQUVBLE9BQUEsRUFBUyxDQUFDLElBQUQsQ0FGVDtPQURGO2FBSUE7SUFOZTs7bUNBUWpCLFVBQUEsR0FBWSxTQUFDLFVBQUQ7QUFDVixVQUFBO01BQUEsTUFBQSxHQUFTLEVBQUUsQ0FBQyxVQUFILENBQWMsVUFBZDtNQUNULElBQUcsTUFBSDtRQUNFLElBQUksQ0FBQyxPQUFMLENBQ0U7VUFBQSxPQUFBLEVBQVMsMEJBQVQ7VUFDQSxlQUFBLEVBQWlCLHVDQUFBLEdBQXdDLFVBRHpEO1VBRUEsT0FBQSxFQUFTLENBQUMsSUFBRCxDQUZUO1NBREYsRUFERjs7YUFLQTtJQVBVOzs7OztBQXpCZCIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZShcImZzLXBsdXNcIilcblxuY29uZmlnID0gcmVxdWlyZSBcIi4uL2NvbmZpZ1wiXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIENyZWF0ZVByb2plY3RDb25maWdzXG4gIHRyaWdnZXI6IC0+XG4gICAgY29uZmlnRmlsZSA9IGNvbmZpZy5nZXRQcm9qZWN0Q29uZmlnRmlsZSgpXG5cbiAgICByZXR1cm4gdW5sZXNzIEBpblByb2plY3RGb2xkZXIoY29uZmlnRmlsZSlcbiAgICByZXR1cm4gaWYgQGZpbGVFeGlzdHMoY29uZmlnRmlsZSlcblxuICAgIGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoY29uZmlnLmdldFNhbXBsZUNvbmZpZ0ZpbGUoKSlcbiAgICBlcnIgPSBmcy53cml0ZUZpbGVTeW5jKGNvbmZpZ0ZpbGUsIGNvbnRlbnQpXG5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGNvbmZpZ0ZpbGUpIHVubGVzcyBlcnJcblxuICBpblByb2plY3RGb2xkZXI6IChjb25maWdGaWxlKSAtPlxuICAgIHJldHVybiB0cnVlIGlmIGNvbmZpZ0ZpbGVcbiAgICBhdG9tLmNvbmZpcm1cbiAgICAgIG1lc3NhZ2U6IFwiW01hcmtkb3duIFdyaXRlcl0gRXJyb3IhXCJcbiAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJDYW5ub3QgY3JlYXRlIGZpbGUgaWYgeW91IGFyZSBub3QgaW4gYSBwcm9qZWN0IGZvbGRlci5cIlxuICAgICAgYnV0dG9uczogWydPSyddXG4gICAgZmFsc2VcblxuICBmaWxlRXhpc3RzOiAoY29uZmlnRmlsZSkgLT5cbiAgICBleGlzdHMgPSBmcy5leGlzdHNTeW5jKGNvbmZpZ0ZpbGUpXG4gICAgaWYgZXhpc3RzXG4gICAgICBhdG9tLmNvbmZpcm1cbiAgICAgICAgbWVzc2FnZTogXCJbTWFya2Rvd24gV3JpdGVyXSBFcnJvciFcIlxuICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiUHJvamVjdCBjb25maWcgZmlsZSBhbHJlYWR5IGV4aXN0czpcXG4je2NvbmZpZ0ZpbGV9XCJcbiAgICAgICAgYnV0dG9uczogWydPSyddXG4gICAgZXhpc3RzXG4iXX0=
