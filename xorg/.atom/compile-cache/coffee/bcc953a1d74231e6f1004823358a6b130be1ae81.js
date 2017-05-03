(function() {
  var ManageFrontMatterView, ManagePostCategoriesView, config, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  config = require("../config");

  utils = require("../utils");

  ManageFrontMatterView = require("./manage-front-matter-view");

  module.exports = ManagePostCategoriesView = (function(superClass) {
    extend(ManagePostCategoriesView, superClass);

    function ManagePostCategoriesView() {
      return ManagePostCategoriesView.__super__.constructor.apply(this, arguments);
    }

    ManagePostCategoriesView.labelName = "Manage Post Categories";

    ManagePostCategoriesView.fieldName = config.get("frontMatterNameCategories", {
      allow_blank: false
    });

    ManagePostCategoriesView.prototype.fetchSiteFieldCandidates = function() {
      var error, succeed, uri;
      uri = config.get("urlForCategories");
      succeed = (function(_this) {
        return function(body) {
          return _this.displaySiteFieldItems(body.categories || []);
        };
      })(this);
      error = (function(_this) {
        return function(err) {
          return _this.error.text((err != null ? err.message : void 0) || ("Error fetching categories from '" + uri + "'"));
        };
      })(this);
      return utils.getJSON(uri, succeed, error);
    };

    return ManagePostCategoriesView;

  })(ManageFrontMatterView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvbWFuYWdlLXBvc3QtY2F0ZWdvcmllcy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsOERBQUE7SUFBQTs7O0VBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztFQUNULEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUjs7RUFFUixxQkFBQSxHQUF3QixPQUFBLENBQVEsNEJBQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFDSix3QkFBQyxDQUFBLFNBQUQsR0FBWTs7SUFDWix3QkFBQyxDQUFBLFNBQUQsR0FBWSxNQUFNLENBQUMsR0FBUCxDQUFXLDJCQUFYLEVBQXdDO01BQUEsV0FBQSxFQUFhLEtBQWI7S0FBeEM7O3VDQUVaLHdCQUFBLEdBQTBCLFNBQUE7QUFDeEIsVUFBQTtNQUFBLEdBQUEsR0FBTSxNQUFNLENBQUMsR0FBUCxDQUFXLGtCQUFYO01BQ04sT0FBQSxHQUFVLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO2lCQUNSLEtBQUMsQ0FBQSxxQkFBRCxDQUF1QixJQUFJLENBQUMsVUFBTCxJQUFtQixFQUExQztRQURRO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtNQUVWLEtBQUEsR0FBUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtpQkFDTixLQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsZ0JBQVksR0FBRyxDQUFFLGlCQUFMLElBQWdCLENBQUEsa0NBQUEsR0FBbUMsR0FBbkMsR0FBdUMsR0FBdkMsQ0FBNUI7UUFETTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7YUFFUixLQUFLLENBQUMsT0FBTixDQUFjLEdBQWQsRUFBbUIsT0FBbkIsRUFBNEIsS0FBNUI7SUFOd0I7Ozs7S0FKVztBQU52QyIsInNvdXJjZXNDb250ZW50IjpbImNvbmZpZyA9IHJlcXVpcmUgXCIuLi9jb25maWdcIlxudXRpbHMgPSByZXF1aXJlIFwiLi4vdXRpbHNcIlxuXG5NYW5hZ2VGcm9udE1hdHRlclZpZXcgPSByZXF1aXJlIFwiLi9tYW5hZ2UtZnJvbnQtbWF0dGVyLXZpZXdcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBNYW5hZ2VQb3N0Q2F0ZWdvcmllc1ZpZXcgZXh0ZW5kcyBNYW5hZ2VGcm9udE1hdHRlclZpZXdcbiAgQGxhYmVsTmFtZTogXCJNYW5hZ2UgUG9zdCBDYXRlZ29yaWVzXCJcbiAgQGZpZWxkTmFtZTogY29uZmlnLmdldChcImZyb250TWF0dGVyTmFtZUNhdGVnb3JpZXNcIiwgYWxsb3dfYmxhbms6IGZhbHNlKVxuXG4gIGZldGNoU2l0ZUZpZWxkQ2FuZGlkYXRlczogLT5cbiAgICB1cmkgPSBjb25maWcuZ2V0KFwidXJsRm9yQ2F0ZWdvcmllc1wiKVxuICAgIHN1Y2NlZWQgPSAoYm9keSkgPT5cbiAgICAgIEBkaXNwbGF5U2l0ZUZpZWxkSXRlbXMoYm9keS5jYXRlZ29yaWVzIHx8IFtdKVxuICAgIGVycm9yID0gKGVycikgPT5cbiAgICAgIEBlcnJvci50ZXh0KGVycj8ubWVzc2FnZSB8fCBcIkVycm9yIGZldGNoaW5nIGNhdGVnb3JpZXMgZnJvbSAnI3t1cml9J1wiKVxuICAgIHV0aWxzLmdldEpTT04odXJpLCBzdWNjZWVkLCBlcnJvcilcbiJdfQ==
