(function() {
  var NewDraftView, NewFileView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NewFileView = require("./new-file-view");

  module.exports = NewDraftView = (function(superClass) {
    extend(NewDraftView, superClass);

    function NewDraftView() {
      return NewDraftView.__super__.constructor.apply(this, arguments);
    }

    NewDraftView.fileType = "Draft";

    NewDraftView.pathConfig = "siteDraftsDir";

    NewDraftView.fileNameConfig = "newDraftFileName";

    return NewDraftView;

  })(NewFileView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvbmV3LWRyYWZ0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx5QkFBQTtJQUFBOzs7RUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGlCQUFSOztFQUVkLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFDSixZQUFDLENBQUEsUUFBRCxHQUFZOztJQUNaLFlBQUMsQ0FBQSxVQUFELEdBQWM7O0lBQ2QsWUFBQyxDQUFBLGNBQUQsR0FBa0I7Ozs7S0FITztBQUgzQiIsInNvdXJjZXNDb250ZW50IjpbIk5ld0ZpbGVWaWV3ID0gcmVxdWlyZSBcIi4vbmV3LWZpbGUtdmlld1wiXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIE5ld0RyYWZ0VmlldyBleHRlbmRzIE5ld0ZpbGVWaWV3XG4gIEBmaWxlVHlwZSA9IFwiRHJhZnRcIlxuICBAcGF0aENvbmZpZyA9IFwic2l0ZURyYWZ0c0RpclwiXG4gIEBmaWxlTmFtZUNvbmZpZyA9IFwibmV3RHJhZnRGaWxlTmFtZVwiXG4iXX0=
