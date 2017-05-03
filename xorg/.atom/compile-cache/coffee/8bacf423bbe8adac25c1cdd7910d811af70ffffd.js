(function() {
  var CreateDefaultKeymaps, fs, path, utils;

  fs = require("fs-plus");

  path = require("path");

  utils = require("../utils");

  module.exports = CreateDefaultKeymaps = (function() {
    function CreateDefaultKeymaps() {}

    CreateDefaultKeymaps.prototype.trigger = function() {
      var keymaps, userKeymapFile;
      keymaps = fs.readFileSync(this.sampleKeymapFile());
      userKeymapFile = this.userKeymapFile();
      return fs.appendFile(userKeymapFile, keymaps, function(err) {
        if (!err) {
          return atom.workspace.open(userKeymapFile);
        }
      });
    };

    CreateDefaultKeymaps.prototype.userKeymapFile = function() {
      return path.join(atom.getConfigDirPath(), "keymap.cson");
    };

    CreateDefaultKeymaps.prototype.sampleKeymapFile = function() {
      return utils.getPackagePath("keymaps", this._sampleFilename());
    };

    CreateDefaultKeymaps.prototype._sampleFilename = function() {
      return {
        "darwin": "sample-osx.cson",
        "linux": "sample-linux.cson",
        "win32": "sample-win32.cson"
      }[process.platform] || "sample-osx.cson";
    };

    return CreateDefaultKeymaps;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvY3JlYXRlLWRlZmF1bHQta2V5bWFwcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSOztFQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQ007OzttQ0FDSixPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7TUFBQSxPQUFBLEdBQVUsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsSUFBQyxDQUFBLGdCQUFELENBQUEsQ0FBaEI7TUFFVixjQUFBLEdBQWlCLElBQUMsQ0FBQSxjQUFELENBQUE7YUFDakIsRUFBRSxDQUFDLFVBQUgsQ0FBYyxjQUFkLEVBQThCLE9BQTlCLEVBQXVDLFNBQUMsR0FBRDtRQUNyQyxJQUFBLENBQTJDLEdBQTNDO2lCQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixjQUFwQixFQUFBOztNQURxQyxDQUF2QztJQUpPOzttQ0FPVCxjQUFBLEdBQWdCLFNBQUE7YUFDZCxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxnQkFBTCxDQUFBLENBQVYsRUFBbUMsYUFBbkM7SUFEYzs7bUNBR2hCLGdCQUFBLEdBQWtCLFNBQUE7YUFDaEIsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsU0FBckIsRUFBZ0MsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUFoQztJQURnQjs7bUNBR2xCLGVBQUEsR0FBaUIsU0FBQTthQUNmO1FBQ0UsUUFBQSxFQUFVLGlCQURaO1FBRUUsT0FBQSxFQUFVLG1CQUZaO1FBR0UsT0FBQSxFQUFVLG1CQUhaO09BSUUsQ0FBQSxPQUFPLENBQUMsUUFBUixDQUpGLElBSXVCO0lBTFI7Ozs7O0FBcEJuQiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZShcImZzLXBsdXNcIilcbnBhdGggPSByZXF1aXJlKFwicGF0aFwiKVxuXG51dGlscyA9IHJlcXVpcmUgXCIuLi91dGlsc1wiXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIENyZWF0ZURlZmF1bHRLZXltYXBzXG4gIHRyaWdnZXI6IC0+XG4gICAga2V5bWFwcyA9IGZzLnJlYWRGaWxlU3luYyhAc2FtcGxlS2V5bWFwRmlsZSgpKVxuXG4gICAgdXNlcktleW1hcEZpbGUgPSBAdXNlcktleW1hcEZpbGUoKVxuICAgIGZzLmFwcGVuZEZpbGUgdXNlcktleW1hcEZpbGUsIGtleW1hcHMsIChlcnIpIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHVzZXJLZXltYXBGaWxlKSB1bmxlc3MgZXJyXG5cbiAgdXNlcktleW1hcEZpbGU6IC0+XG4gICAgcGF0aC5qb2luKGF0b20uZ2V0Q29uZmlnRGlyUGF0aCgpLCBcImtleW1hcC5jc29uXCIpXG5cbiAgc2FtcGxlS2V5bWFwRmlsZTogLT5cbiAgICB1dGlscy5nZXRQYWNrYWdlUGF0aChcImtleW1hcHNcIiwgQF9zYW1wbGVGaWxlbmFtZSgpKVxuXG4gIF9zYW1wbGVGaWxlbmFtZTogLT5cbiAgICB7XG4gICAgICBcImRhcndpblwiOiBcInNhbXBsZS1vc3guY3NvblwiLFxuICAgICAgXCJsaW51eFwiIDogXCJzYW1wbGUtbGludXguY3NvblwiLFxuICAgICAgXCJ3aW4zMlwiIDogXCJzYW1wbGUtd2luMzIuY3NvblwiXG4gICAgfVtwcm9jZXNzLnBsYXRmb3JtXSB8fCBcInNhbXBsZS1vc3guY3NvblwiXG4iXX0=
