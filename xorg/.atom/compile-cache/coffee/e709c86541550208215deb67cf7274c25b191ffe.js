(function() {
  var ManageFrontMatterView, ManagePostTagsView, config, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  config = require("../config");

  utils = require("../utils");

  ManageFrontMatterView = require("./manage-front-matter-view");

  module.exports = ManagePostTagsView = (function(superClass) {
    extend(ManagePostTagsView, superClass);

    function ManagePostTagsView() {
      return ManagePostTagsView.__super__.constructor.apply(this, arguments);
    }

    ManagePostTagsView.labelName = "Manage Post Tags";

    ManagePostTagsView.fieldName = config.get("frontMatterNameTags", {
      allow_blank: false
    });

    ManagePostTagsView.prototype.fetchSiteFieldCandidates = function() {
      var error, succeed, uri;
      uri = config.get("urlForTags");
      succeed = (function(_this) {
        return function(body) {
          var tags;
          tags = body.tags.map(function(tag) {
            return {
              name: tag,
              count: 0
            };
          });
          _this.rankTags(tags, _this.editor.getText());
          return _this.displaySiteFieldItems(tags.map(function(tag) {
            return tag.name;
          }));
        };
      })(this);
      error = (function(_this) {
        return function(err) {
          return _this.error.text((err != null ? err.message : void 0) || ("Error fetching tags from '" + uri + "'"));
        };
      })(this);
      return utils.getJSON(uri, succeed, error);
    };

    ManagePostTagsView.prototype.rankTags = function(tags, content) {
      tags.forEach(function(tag) {
        var ref, tagRegex;
        tagRegex = RegExp("" + (utils.escapeRegExp(tag.name)), "ig");
        return tag.count = ((ref = content.match(tagRegex)) != null ? ref.length : void 0) || 0;
      });
      return tags.sort(function(t1, t2) {
        return t2.count - t1.count;
      });
    };

    return ManagePostTagsView;

  })(ManageFrontMatterView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvbWFuYWdlLXBvc3QtdGFncy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsd0RBQUE7SUFBQTs7O0VBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztFQUNULEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUjs7RUFFUixxQkFBQSxHQUF3QixPQUFBLENBQVEsNEJBQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFDSixrQkFBQyxDQUFBLFNBQUQsR0FBWTs7SUFDWixrQkFBQyxDQUFBLFNBQUQsR0FBWSxNQUFNLENBQUMsR0FBUCxDQUFXLHFCQUFYLEVBQWtDO01BQUEsV0FBQSxFQUFhLEtBQWI7S0FBbEM7O2lDQUVaLHdCQUFBLEdBQTBCLFNBQUE7QUFDeEIsVUFBQTtNQUFBLEdBQUEsR0FBTSxNQUFNLENBQUMsR0FBUCxDQUFXLFlBQVg7TUFDTixPQUFBLEdBQVUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7QUFDUixjQUFBO1VBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBVixDQUFjLFNBQUMsR0FBRDttQkFBUztjQUFBLElBQUEsRUFBTSxHQUFOO2NBQVcsS0FBQSxFQUFPLENBQWxCOztVQUFULENBQWQ7VUFDUCxLQUFDLENBQUEsUUFBRCxDQUFVLElBQVYsRUFBZ0IsS0FBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUEsQ0FBaEI7aUJBQ0EsS0FBQyxDQUFBLHFCQUFELENBQXVCLElBQUksQ0FBQyxHQUFMLENBQVMsU0FBQyxHQUFEO21CQUFTLEdBQUcsQ0FBQztVQUFiLENBQVQsQ0FBdkI7UUFIUTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7TUFJVixLQUFBLEdBQVEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7aUJBQ04sS0FBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLGdCQUFZLEdBQUcsQ0FBRSxpQkFBTCxJQUFnQixDQUFBLDRCQUFBLEdBQTZCLEdBQTdCLEdBQWlDLEdBQWpDLENBQTVCO1FBRE07TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO2FBRVIsS0FBSyxDQUFDLE9BQU4sQ0FBYyxHQUFkLEVBQW1CLE9BQW5CLEVBQTRCLEtBQTVCO0lBUndCOztpQ0FXMUIsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLE9BQVA7TUFDUixJQUFJLENBQUMsT0FBTCxDQUFhLFNBQUMsR0FBRDtBQUNYLFlBQUE7UUFBQSxRQUFBLEdBQVcsTUFBQSxDQUFBLEVBQUEsR0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFOLENBQW1CLEdBQUcsQ0FBQyxJQUF2QixDQUFELENBQUwsRUFBdUMsSUFBdkM7ZUFDWCxHQUFHLENBQUMsS0FBSixpREFBbUMsQ0FBRSxnQkFBekIsSUFBbUM7TUFGcEMsQ0FBYjthQUdBLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBQyxFQUFELEVBQUssRUFBTDtlQUFZLEVBQUUsQ0FBQyxLQUFILEdBQVcsRUFBRSxDQUFDO01BQTFCLENBQVY7SUFKUTs7OztLQWZxQjtBQU5qQyIsInNvdXJjZXNDb250ZW50IjpbImNvbmZpZyA9IHJlcXVpcmUgXCIuLi9jb25maWdcIlxudXRpbHMgPSByZXF1aXJlIFwiLi4vdXRpbHNcIlxuXG5NYW5hZ2VGcm9udE1hdHRlclZpZXcgPSByZXF1aXJlIFwiLi9tYW5hZ2UtZnJvbnQtbWF0dGVyLXZpZXdcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBNYW5hZ2VQb3N0VGFnc1ZpZXcgZXh0ZW5kcyBNYW5hZ2VGcm9udE1hdHRlclZpZXdcbiAgQGxhYmVsTmFtZTogXCJNYW5hZ2UgUG9zdCBUYWdzXCJcbiAgQGZpZWxkTmFtZTogY29uZmlnLmdldChcImZyb250TWF0dGVyTmFtZVRhZ3NcIiwgYWxsb3dfYmxhbms6IGZhbHNlKVxuXG4gIGZldGNoU2l0ZUZpZWxkQ2FuZGlkYXRlczogLT5cbiAgICB1cmkgPSBjb25maWcuZ2V0KFwidXJsRm9yVGFnc1wiKVxuICAgIHN1Y2NlZWQgPSAoYm9keSkgPT5cbiAgICAgIHRhZ3MgPSBib2R5LnRhZ3MubWFwKCh0YWcpIC0+IG5hbWU6IHRhZywgY291bnQ6IDApXG4gICAgICBAcmFua1RhZ3ModGFncywgQGVkaXRvci5nZXRUZXh0KCkpXG4gICAgICBAZGlzcGxheVNpdGVGaWVsZEl0ZW1zKHRhZ3MubWFwKCh0YWcpIC0+IHRhZy5uYW1lKSlcbiAgICBlcnJvciA9IChlcnIpID0+XG4gICAgICBAZXJyb3IudGV4dChlcnI/Lm1lc3NhZ2UgfHwgXCJFcnJvciBmZXRjaGluZyB0YWdzIGZyb20gJyN7dXJpfSdcIilcbiAgICB1dGlscy5nZXRKU09OKHVyaSwgc3VjY2VlZCwgZXJyb3IpXG5cbiAgIyByYW5rIHRhZ3MgYmFzZWQgb24gdGhlIG51bWJlciBvZiB0aW1lcyB0aGV5IGFwcGVhcmVkIGluIGNvbnRlbnRcbiAgcmFua1RhZ3M6ICh0YWdzLCBjb250ZW50KSAtPlxuICAgIHRhZ3MuZm9yRWFjaCAodGFnKSAtPlxuICAgICAgdGFnUmVnZXggPSAvLy8gI3t1dGlscy5lc2NhcGVSZWdFeHAodGFnLm5hbWUpfSAvLy9pZ1xuICAgICAgdGFnLmNvdW50ID0gY29udGVudC5tYXRjaCh0YWdSZWdleCk/Lmxlbmd0aCB8fCAwXG4gICAgdGFncy5zb3J0ICh0MSwgdDIpIC0+IHQyLmNvdW50IC0gdDEuY291bnRcbiJdfQ==
