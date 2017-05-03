(function() {
  var OpenLinkInBrowser, child_process, shell, utils;

  child_process = require("child_process");

  shell = require("shell");

  utils = require("../utils");

  module.exports = OpenLinkInBrowser = (function() {
    function OpenLinkInBrowser() {}

    OpenLinkInBrowser.prototype.trigger = function(e) {
      var editor, link, range;
      editor = atom.workspace.getActiveTextEditor();
      range = utils.getTextBufferRange(editor, "link");
      link = utils.findLinkInRange(editor, range);
      if (!link || !link.url) {
        return e.abortKeyBinding();
      }
      switch (process.platform) {
        case 'darwin':
          return child_process.execFile("open", [link.url]);
        case 'linux':
          return child_process.execFile("xdg-open", [link.url]);
        case 'win32':
          return shell.openExternal(link.url);
      }
    };

    return OpenLinkInBrowser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvb3Blbi1saW5rLWluLWJyb3dzZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxlQUFSOztFQUNoQixLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0VBRVIsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSOztFQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztnQ0FDSixPQUFBLEdBQVMsU0FBQyxDQUFEO0FBQ1AsVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVCxLQUFBLEdBQVEsS0FBSyxDQUFDLGtCQUFOLENBQXlCLE1BQXpCLEVBQWlDLE1BQWpDO01BRVIsSUFBQSxHQUFPLEtBQUssQ0FBQyxlQUFOLENBQXNCLE1BQXRCLEVBQThCLEtBQTlCO01BQ1AsSUFBOEIsQ0FBQyxJQUFELElBQVMsQ0FBQyxJQUFJLENBQUMsR0FBN0M7QUFBQSxlQUFPLENBQUMsQ0FBQyxlQUFGLENBQUEsRUFBUDs7QUFFQSxjQUFPLE9BQU8sQ0FBQyxRQUFmO0FBQUEsYUFDTyxRQURQO2lCQUNxQixhQUFhLENBQUMsUUFBZCxDQUF1QixNQUF2QixFQUErQixDQUFDLElBQUksQ0FBQyxHQUFOLENBQS9CO0FBRHJCLGFBRU8sT0FGUDtpQkFFcUIsYUFBYSxDQUFDLFFBQWQsQ0FBdUIsVUFBdkIsRUFBbUMsQ0FBQyxJQUFJLENBQUMsR0FBTixDQUFuQztBQUZyQixhQUdPLE9BSFA7aUJBR3FCLEtBQUssQ0FBQyxZQUFOLENBQW1CLElBQUksQ0FBQyxHQUF4QjtBQUhyQjtJQVBPOzs7OztBQVBYIiwic291cmNlc0NvbnRlbnQiOlsiY2hpbGRfcHJvY2VzcyA9IHJlcXVpcmUgXCJjaGlsZF9wcm9jZXNzXCJcbnNoZWxsID0gcmVxdWlyZSBcInNoZWxsXCJcblxudXRpbHMgPSByZXF1aXJlIFwiLi4vdXRpbHNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBPcGVuTGlua0luQnJvd3NlclxuICB0cmlnZ2VyOiAoZSkgLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICByYW5nZSA9IHV0aWxzLmdldFRleHRCdWZmZXJSYW5nZShlZGl0b3IsIFwibGlua1wiKVxuXG4gICAgbGluayA9IHV0aWxzLmZpbmRMaW5rSW5SYW5nZShlZGl0b3IsIHJhbmdlKVxuICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpIGlmICFsaW5rIHx8ICFsaW5rLnVybFxuXG4gICAgc3dpdGNoIHByb2Nlc3MucGxhdGZvcm1cbiAgICAgIHdoZW4gJ2RhcndpbicgdGhlbiBjaGlsZF9wcm9jZXNzLmV4ZWNGaWxlKFwib3BlblwiLCBbbGluay51cmxdKVxuICAgICAgd2hlbiAnbGludXgnICB0aGVuIGNoaWxkX3Byb2Nlc3MuZXhlY0ZpbGUoXCJ4ZGctb3BlblwiLCBbbGluay51cmxdKVxuICAgICAgd2hlbiAnd2luMzInICB0aGVuIHNoZWxsLm9wZW5FeHRlcm5hbChsaW5rLnVybClcbiJdfQ==
