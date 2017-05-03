(function() {
  var FRONT_MATTER_REGEX, FrontMatter, yaml;

  yaml = require("js-yaml");

  FRONT_MATTER_REGEX = /^(?:---\s*$)?([^:]+:[\s\S]*?)^---\s*$/m;

  module.exports = FrontMatter = (function() {
    function FrontMatter(editor, options) {
      if (options == null) {
        options = {};
      }
      this.editor = editor;
      this.options = options;
      this.content = {};
      this.leadingFence = true;
      this.isEmpty = true;
      this.parseError = null;
      this._findFrontMatter((function(_this) {
        return function(match) {
          var error;
          try {
            _this.content = yaml.safeLoad(match.match[1].trim()) || {};
            _this.leadingFence = match.matchText.startsWith("---");
            return _this.isEmpty = false;
          } catch (error1) {
            error = error1;
            _this.parseError = error;
            _this.content = {};
            if (options["silent"] !== true) {
              return atom.confirm({
                message: "[Markdown Writer] Error!",
                detailedMessage: "Invalid Front Matter:\n" + error.message,
                buttons: ['OK']
              });
            }
          }
        };
      })(this));
    }

    FrontMatter.prototype._findFrontMatter = function(onMatch) {
      return this.editor.buffer.scan(FRONT_MATTER_REGEX, onMatch);
    };

    FrontMatter.prototype.normalizeField = function(field) {
      if (Object.prototype.toString.call(this.content[field]) === "[object Array]") {
        return this.content[field];
      } else if (typeof this.content[field] === "string") {
        return this.content[field] = [this.content[field]];
      } else {
        return this.content[field] = [];
      }
    };

    FrontMatter.prototype.has = function(field) {
      return field && (this.content[field] != null);
    };

    FrontMatter.prototype.get = function(field) {
      return this.content[field];
    };

    FrontMatter.prototype.getArray = function(field) {
      this.normalizeField(field);
      return this.content[field];
    };

    FrontMatter.prototype.set = function(field, content) {
      return this.content[field] = content;
    };

    FrontMatter.prototype.setIfExists = function(field, content) {
      if (this.has(field)) {
        return this.content[field] = content;
      }
    };

    FrontMatter.prototype.getContent = function() {
      return JSON.parse(JSON.stringify(this.content));
    };

    FrontMatter.prototype.getContentText = function() {
      var text;
      text = yaml.safeDump(this.content);
      if (this.leadingFence) {
        return ["---", text + "---", ""].join("\n");
      } else {
        return [text + "---", ""].join("\n");
      }
    };

    FrontMatter.prototype.save = function() {
      return this._findFrontMatter((function(_this) {
        return function(match) {
          return match.replace(_this.getContentText());
        };
      })(this));
    };

    return FrontMatter;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvaGVscGVycy9mcm9udC1tYXR0ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVI7O0VBRVAsa0JBQUEsR0FBcUI7O0VBU3JCLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFHUyxxQkFBQyxNQUFELEVBQVMsT0FBVDs7UUFBUyxVQUFVOztNQUM5QixJQUFDLENBQUEsTUFBRCxHQUFVO01BQ1YsSUFBQyxDQUFBLE9BQUQsR0FBVztNQUNYLElBQUMsQ0FBQSxPQUFELEdBQVc7TUFDWCxJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUNoQixJQUFDLENBQUEsT0FBRCxHQUFXO01BQ1gsSUFBQyxDQUFBLFVBQUQsR0FBYztNQUdkLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtBQUNoQixjQUFBO0FBQUE7WUFDRSxLQUFDLENBQUEsT0FBRCxHQUFXLElBQUksQ0FBQyxRQUFMLENBQWMsS0FBSyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFmLENBQUEsQ0FBZCxDQUFBLElBQXdDO1lBQ25ELEtBQUMsQ0FBQSxZQUFELEdBQWdCLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBaEIsQ0FBMkIsS0FBM0I7bUJBQ2hCLEtBQUMsQ0FBQSxPQUFELEdBQVcsTUFIYjtXQUFBLGNBQUE7WUFJTTtZQUNKLEtBQUMsQ0FBQSxVQUFELEdBQWM7WUFDZCxLQUFDLENBQUEsT0FBRCxHQUFXO1lBQ1gsSUFBTyxPQUFRLENBQUEsUUFBQSxDQUFSLEtBQXFCLElBQTVCO3FCQUNFLElBQUksQ0FBQyxPQUFMLENBQ0U7Z0JBQUEsT0FBQSxFQUFTLDBCQUFUO2dCQUNBLGVBQUEsRUFBaUIseUJBQUEsR0FBMEIsS0FBSyxDQUFDLE9BRGpEO2dCQUVBLE9BQUEsRUFBUyxDQUFDLElBQUQsQ0FGVDtlQURGLEVBREY7YUFQRjs7UUFEZ0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCO0lBVFc7OzBCQXVCYixnQkFBQSxHQUFrQixTQUFDLE9BQUQ7YUFDaEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBZixDQUFvQixrQkFBcEIsRUFBd0MsT0FBeEM7SUFEZ0I7OzBCQUlsQixjQUFBLEdBQWdCLFNBQUMsS0FBRDtNQUNkLElBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBMUIsQ0FBK0IsSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFBLENBQXhDLENBQUEsS0FBbUQsZ0JBQXREO2VBQ0UsSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFBLEVBRFg7T0FBQSxNQUVLLElBQUcsT0FBTyxJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUEsQ0FBaEIsS0FBMEIsUUFBN0I7ZUFDSCxJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUEsQ0FBVCxHQUFrQixDQUFDLElBQUMsQ0FBQSxPQUFRLENBQUEsS0FBQSxDQUFWLEVBRGY7T0FBQSxNQUFBO2VBR0gsSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFBLENBQVQsR0FBa0IsR0FIZjs7SUFIUzs7MEJBUWhCLEdBQUEsR0FBSyxTQUFDLEtBQUQ7YUFBVyxLQUFBLElBQVM7SUFBcEI7OzBCQUVMLEdBQUEsR0FBSyxTQUFDLEtBQUQ7YUFBVyxJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUE7SUFBcEI7OzBCQUVMLFFBQUEsR0FBVSxTQUFDLEtBQUQ7TUFDUixJQUFDLENBQUEsY0FBRCxDQUFnQixLQUFoQjthQUNBLElBQUMsQ0FBQSxPQUFRLENBQUEsS0FBQTtJQUZEOzswQkFJVixHQUFBLEdBQUssU0FBQyxLQUFELEVBQVEsT0FBUjthQUFvQixJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUEsQ0FBVCxHQUFrQjtJQUF0Qzs7MEJBRUwsV0FBQSxHQUFhLFNBQUMsS0FBRCxFQUFRLE9BQVI7TUFDWCxJQUE2QixJQUFDLENBQUEsR0FBRCxDQUFLLEtBQUwsQ0FBN0I7ZUFBQSxJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUEsQ0FBVCxHQUFrQixRQUFsQjs7SUFEVzs7MEJBR2IsVUFBQSxHQUFZLFNBQUE7YUFBRyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBQyxDQUFBLE9BQWhCLENBQVg7SUFBSDs7MEJBRVosY0FBQSxHQUFnQixTQUFBO0FBQ2QsVUFBQTtNQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsUUFBTCxDQUFjLElBQUMsQ0FBQSxPQUFmO01BQ1AsSUFBRyxJQUFDLENBQUEsWUFBSjtlQUNFLENBQUMsS0FBRCxFQUFXLElBQUQsR0FBTSxLQUFoQixFQUFzQixFQUF0QixDQUF5QixDQUFDLElBQTFCLENBQStCLElBQS9CLEVBREY7T0FBQSxNQUFBO2VBR0UsQ0FBSSxJQUFELEdBQU0sS0FBVCxFQUFlLEVBQWYsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixJQUF4QixFQUhGOztJQUZjOzswQkFPaEIsSUFBQSxHQUFNLFNBQUE7YUFDSixJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7aUJBQVcsS0FBSyxDQUFDLE9BQU4sQ0FBYyxLQUFDLENBQUEsY0FBRCxDQUFBLENBQWQ7UUFBWDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEI7SUFESTs7Ozs7QUF4RVIiLCJzb3VyY2VzQ29udGVudCI6WyJ5YW1sID0gcmVxdWlyZSBcImpzLXlhbWxcIlxuXG5GUk9OVF9NQVRURVJfUkVHRVggPSAvLy9cbiAgXig/Oi0tLVxccyokKT8gICMgbWF0Y2ggb3BlbiAtLS0gKGlmIGFueSlcbiAgKFxuICAgIFteOl0rOiAgICAgICMgbWF0Y2ggYXQgbGVhc3QgMSBvcGVuIGtleVxuICAgIFtcXHNcXFNdKj8gICAgIyBtYXRjaCB0aGUgcmVzdFxuICApXG4gIF4tLS1cXHMqJCAgICAgICAjIG1hdGNoIGVuZGluZyAtLS1cbiAgLy8vbVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBGcm9udE1hdHRlclxuICAjIG9wdGlvbnM6XG4gICMgICBzaWxpZW50ID0gdHJ1ZS9mYWxzZVxuICBjb25zdHJ1Y3RvcjogKGVkaXRvciwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIEBlZGl0b3IgPSBlZGl0b3JcbiAgICBAb3B0aW9ucyA9IG9wdGlvbnNcbiAgICBAY29udGVudCA9IHt9XG4gICAgQGxlYWRpbmdGZW5jZSA9IHRydWVcbiAgICBAaXNFbXB0eSA9IHRydWVcbiAgICBAcGFyc2VFcnJvciA9IG51bGxcblxuICAgICMgZmluZCBhbmQgcGFyc2UgZnJvbnQgbWF0dGVyXG4gICAgQF9maW5kRnJvbnRNYXR0ZXIgKG1hdGNoKSA9PlxuICAgICAgdHJ5XG4gICAgICAgIEBjb250ZW50ID0geWFtbC5zYWZlTG9hZChtYXRjaC5tYXRjaFsxXS50cmltKCkpIHx8IHt9XG4gICAgICAgIEBsZWFkaW5nRmVuY2UgPSBtYXRjaC5tYXRjaFRleHQuc3RhcnRzV2l0aChcIi0tLVwiKVxuICAgICAgICBAaXNFbXB0eSA9IGZhbHNlXG4gICAgICBjYXRjaCBlcnJvclxuICAgICAgICBAcGFyc2VFcnJvciA9IGVycm9yXG4gICAgICAgIEBjb250ZW50ID0ge31cbiAgICAgICAgdW5sZXNzIG9wdGlvbnNbXCJzaWxlbnRcIl0gPT0gdHJ1ZVxuICAgICAgICAgIGF0b20uY29uZmlybVxuICAgICAgICAgICAgbWVzc2FnZTogXCJbTWFya2Rvd24gV3JpdGVyXSBFcnJvciFcIlxuICAgICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIkludmFsaWQgRnJvbnQgTWF0dGVyOlxcbiN7ZXJyb3IubWVzc2FnZX1cIlxuICAgICAgICAgICAgYnV0dG9uczogWydPSyddXG5cbiAgX2ZpbmRGcm9udE1hdHRlcjogKG9uTWF0Y2gpIC0+XG4gICAgQGVkaXRvci5idWZmZXIuc2NhbihGUk9OVF9NQVRURVJfUkVHRVgsIG9uTWF0Y2gpXG5cbiAgIyBub3JtYWxpemUgdGhlIGZpZWxkIHRvIGFuIGFycmF5XG4gIG5vcm1hbGl6ZUZpZWxkOiAoZmllbGQpIC0+XG4gICAgaWYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKEBjb250ZW50W2ZpZWxkXSkgPT0gXCJbb2JqZWN0IEFycmF5XVwiXG4gICAgICBAY29udGVudFtmaWVsZF1cbiAgICBlbHNlIGlmIHR5cGVvZiBAY29udGVudFtmaWVsZF0gPT0gXCJzdHJpbmdcIlxuICAgICAgQGNvbnRlbnRbZmllbGRdID0gW0Bjb250ZW50W2ZpZWxkXV1cbiAgICBlbHNlXG4gICAgICBAY29udGVudFtmaWVsZF0gPSBbXVxuXG4gIGhhczogKGZpZWxkKSAtPiBmaWVsZCAmJiBAY29udGVudFtmaWVsZF0/XG5cbiAgZ2V0OiAoZmllbGQpIC0+IEBjb250ZW50W2ZpZWxkXVxuXG4gIGdldEFycmF5OiAoZmllbGQpIC0+XG4gICAgQG5vcm1hbGl6ZUZpZWxkKGZpZWxkKVxuICAgIEBjb250ZW50W2ZpZWxkXVxuXG4gIHNldDogKGZpZWxkLCBjb250ZW50KSAtPiBAY29udGVudFtmaWVsZF0gPSBjb250ZW50XG5cbiAgc2V0SWZFeGlzdHM6IChmaWVsZCwgY29udGVudCkgLT5cbiAgICBAY29udGVudFtmaWVsZF0gPSBjb250ZW50IGlmIEBoYXMoZmllbGQpXG5cbiAgZ2V0Q29udGVudDogLT4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShAY29udGVudCkpXG5cbiAgZ2V0Q29udGVudFRleHQ6IC0+XG4gICAgdGV4dCA9IHlhbWwuc2FmZUR1bXAoQGNvbnRlbnQpXG4gICAgaWYgQGxlYWRpbmdGZW5jZVxuICAgICAgW1wiLS0tXCIsIFwiI3t0ZXh0fS0tLVwiLCBcIlwiXS5qb2luKFwiXFxuXCIpXG4gICAgZWxzZVxuICAgICAgW1wiI3t0ZXh0fS0tLVwiLCBcIlwiXS5qb2luKFwiXFxuXCIpXG5cbiAgc2F2ZTogLT5cbiAgICBAX2ZpbmRGcm9udE1hdHRlciAobWF0Y2gpID0+IG1hdGNoLnJlcGxhY2UoQGdldENvbnRlbnRUZXh0KCkpXG4iXX0=
