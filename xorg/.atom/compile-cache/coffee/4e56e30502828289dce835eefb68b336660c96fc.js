(function() {
  var NewFileView, NewPostView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NewFileView = require("./new-file-view");

  module.exports = NewPostView = (function(superClass) {
    extend(NewPostView, superClass);

    function NewPostView() {
      return NewPostView.__super__.constructor.apply(this, arguments);
    }

    NewPostView.fileType = "Post";

    NewPostView.pathConfig = "sitePostsDir";

    NewPostView.fileNameConfig = "newPostFileName";

    return NewPostView;

  })(NewFileView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvbmV3LXBvc3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHdCQUFBO0lBQUE7OztFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsaUJBQVI7O0VBRWQsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztJQUNKLFdBQUMsQ0FBQSxRQUFELEdBQVk7O0lBQ1osV0FBQyxDQUFBLFVBQUQsR0FBYzs7SUFDZCxXQUFDLENBQUEsY0FBRCxHQUFrQjs7OztLQUhNO0FBSDFCIiwic291cmNlc0NvbnRlbnQiOlsiTmV3RmlsZVZpZXcgPSByZXF1aXJlIFwiLi9uZXctZmlsZS12aWV3XCJcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTmV3UG9zdFZpZXcgZXh0ZW5kcyBOZXdGaWxlVmlld1xuICBAZmlsZVR5cGUgPSBcIlBvc3RcIlxuICBAcGF0aENvbmZpZyA9IFwic2l0ZVBvc3RzRGlyXCJcbiAgQGZpbGVOYW1lQ29uZmlnID0gXCJuZXdQb3N0RmlsZU5hbWVcIlxuIl19
