(function() {
  var config,
    slice = [].slice;

  config = require("./config");

  module.exports = {
    siteEngine: {
      title: "Site Engine",
      type: "string",
      "default": config.getDefault("siteEngine"),
      "enum": [config.getDefault("siteEngine")].concat(slice.call(config.engineNames()))
    },
    siteUrl: {
      title: "Site URL",
      type: "string",
      "default": config.getDefault("siteUrl")
    },
    siteLocalDir: {
      title: "Site Local Directory",
      description: "The absolute path to your site's local directory",
      type: "string",
      "default": config.getDefault("siteLocalDir")
    },
    siteDraftsDir: {
      title: "Site Drafts Directory",
      description: "The relative path from your site's local directory",
      type: "string",
      "default": config.getDefault("siteDraftsDir")
    },
    sitePostsDir: {
      title: "Site Posts Directory",
      description: "The relative path from your site's local directory",
      type: "string",
      "default": config.getDefault("sitePostsDir")
    },
    siteImagesDir: {
      title: "Site Images Directory",
      description: "The relative path from your site's local directory",
      type: "string",
      "default": config.getDefault("siteImagesDir")
    },
    urlForTags: {
      title: "URL to Tags JSON definitions",
      type: "string",
      "default": config.getDefault("urlForTags")
    },
    urlForPosts: {
      title: "URL to Posts JSON definitions",
      type: "string",
      "default": config.getDefault("urlForPosts")
    },
    urlForCategories: {
      title: "URL to Categories JSON definitions",
      type: "string",
      "default": config.getDefault("urlForCategories")
    },
    newDraftFileName: {
      title: "New Draft File Name",
      type: "string",
      "default": config.getCurrentDefault("newDraftFileName")
    },
    newPostFileName: {
      title: "New Post File Name",
      type: "string",
      "default": config.getCurrentDefault("newPostFileName")
    },
    fileExtension: {
      title: "File Extension",
      type: "string",
      "default": config.getCurrentDefault("fileExtension")
    },
    relativeImagePath: {
      title: "Use Relative Image Path",
      description: "Use relative image path from the open file",
      type: "boolean",
      "default": config.getCurrentDefault("relativeImagePath")
    },
    renameImageOnCopy: {
      title: "Rename Image File Name",
      description: "Rename image filename when you chose to copy to image directory",
      type: "boolean",
      "default": config.getCurrentDefault("renameImageOnCopy")
    },
    tableAlignment: {
      title: "Table Cell Alignment",
      type: "string",
      "default": config.getDefault("tableAlignment"),
      "enum": ["empty", "left", "right", "center"]
    },
    tableExtraPipes: {
      title: "Table Extra Pipes",
      description: "Insert extra pipes at the start and the end of the table rows",
      type: "boolean",
      "default": config.getDefault("tableExtraPipes")
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29uZmlnLWJhc2ljLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsTUFBQTtJQUFBOztFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsVUFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLGFBQVA7TUFDQSxJQUFBLEVBQU0sUUFETjtNQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsWUFBbEIsQ0FGVDtNQUdBLENBQUEsSUFBQSxDQUFBLEVBQU8sQ0FBQSxNQUFNLENBQUMsVUFBUCxDQUFrQixZQUFsQixDQUFpQyxTQUFBLFdBQUEsTUFBTSxDQUFDLFdBQVAsQ0FBQSxDQUFBLENBQUEsQ0FIeEM7S0FERjtJQUtBLE9BQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxVQUFQO01BQ0EsSUFBQSxFQUFNLFFBRE47TUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFNBQWxCLENBRlQ7S0FORjtJQVNBLFlBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxzQkFBUDtNQUNBLFdBQUEsRUFBYSxrREFEYjtNQUVBLElBQUEsRUFBTSxRQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUFNLENBQUMsVUFBUCxDQUFrQixjQUFsQixDQUhUO0tBVkY7SUFjQSxhQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sdUJBQVA7TUFDQSxXQUFBLEVBQWEsb0RBRGI7TUFFQSxJQUFBLEVBQU0sUUFGTjtNQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsZUFBbEIsQ0FIVDtLQWZGO0lBbUJBLFlBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxzQkFBUDtNQUNBLFdBQUEsRUFBYSxvREFEYjtNQUVBLElBQUEsRUFBTSxRQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUFNLENBQUMsVUFBUCxDQUFrQixjQUFsQixDQUhUO0tBcEJGO0lBd0JBLGFBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyx1QkFBUDtNQUNBLFdBQUEsRUFBYSxvREFEYjtNQUVBLElBQUEsRUFBTSxRQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUFNLENBQUMsVUFBUCxDQUFrQixlQUFsQixDQUhUO0tBekJGO0lBNkJBLFVBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyw4QkFBUDtNQUNBLElBQUEsRUFBTSxRQUROO01BRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUFNLENBQUMsVUFBUCxDQUFrQixZQUFsQixDQUZUO0tBOUJGO0lBaUNBLFdBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTywrQkFBUDtNQUNBLElBQUEsRUFBTSxRQUROO01BRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUFNLENBQUMsVUFBUCxDQUFrQixhQUFsQixDQUZUO0tBbENGO0lBcUNBLGdCQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sb0NBQVA7TUFDQSxJQUFBLEVBQU0sUUFETjtNQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0Isa0JBQWxCLENBRlQ7S0F0Q0Y7SUF5Q0EsZ0JBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxxQkFBUDtNQUNBLElBQUEsRUFBTSxRQUROO01BRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUFNLENBQUMsaUJBQVAsQ0FBeUIsa0JBQXpCLENBRlQ7S0ExQ0Y7SUE2Q0EsZUFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLG9CQUFQO01BQ0EsSUFBQSxFQUFNLFFBRE47TUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixpQkFBekIsQ0FGVDtLQTlDRjtJQWlEQSxhQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sZ0JBQVA7TUFDQSxJQUFBLEVBQU0sUUFETjtNQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFBTSxDQUFDLGlCQUFQLENBQXlCLGVBQXpCLENBRlQ7S0FsREY7SUFxREEsaUJBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyx5QkFBUDtNQUNBLFdBQUEsRUFBYSw0Q0FEYjtNQUVBLElBQUEsRUFBTSxTQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUFNLENBQUMsaUJBQVAsQ0FBeUIsbUJBQXpCLENBSFQ7S0F0REY7SUEwREEsaUJBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyx3QkFBUDtNQUNBLFdBQUEsRUFBYSxpRUFEYjtNQUVBLElBQUEsRUFBTSxTQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUFNLENBQUMsaUJBQVAsQ0FBeUIsbUJBQXpCLENBSFQ7S0EzREY7SUErREEsY0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLHNCQUFQO01BQ0EsSUFBQSxFQUFNLFFBRE47TUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLGdCQUFsQixDQUZUO01BR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxNQUFWLEVBQWtCLE9BQWxCLEVBQTJCLFFBQTNCLENBSE47S0FoRUY7SUFvRUEsZUFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLG1CQUFQO01BQ0EsV0FBQSxFQUFhLCtEQURiO01BRUEsSUFBQSxFQUFNLFNBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLGlCQUFsQixDQUhUO0tBckVGOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsiY29uZmlnID0gcmVxdWlyZSBcIi4vY29uZmlnXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzaXRlRW5naW5lOlxuICAgIHRpdGxlOiBcIlNpdGUgRW5naW5lXCJcbiAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgZGVmYXVsdDogY29uZmlnLmdldERlZmF1bHQoXCJzaXRlRW5naW5lXCIpXG4gICAgZW51bTogW2NvbmZpZy5nZXREZWZhdWx0KFwic2l0ZUVuZ2luZVwiKSwgY29uZmlnLmVuZ2luZU5hbWVzKCkuLi5dXG4gIHNpdGVVcmw6XG4gICAgdGl0bGU6IFwiU2l0ZSBVUkxcIlxuICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICBkZWZhdWx0OiBjb25maWcuZ2V0RGVmYXVsdChcInNpdGVVcmxcIilcbiAgc2l0ZUxvY2FsRGlyOlxuICAgIHRpdGxlOiBcIlNpdGUgTG9jYWwgRGlyZWN0b3J5XCJcbiAgICBkZXNjcmlwdGlvbjogXCJUaGUgYWJzb2x1dGUgcGF0aCB0byB5b3VyIHNpdGUncyBsb2NhbCBkaXJlY3RvcnlcIlxuICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICBkZWZhdWx0OiBjb25maWcuZ2V0RGVmYXVsdChcInNpdGVMb2NhbERpclwiKVxuICBzaXRlRHJhZnRzRGlyOlxuICAgIHRpdGxlOiBcIlNpdGUgRHJhZnRzIERpcmVjdG9yeVwiXG4gICAgZGVzY3JpcHRpb246IFwiVGhlIHJlbGF0aXZlIHBhdGggZnJvbSB5b3VyIHNpdGUncyBsb2NhbCBkaXJlY3RvcnlcIlxuICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICBkZWZhdWx0OiBjb25maWcuZ2V0RGVmYXVsdChcInNpdGVEcmFmdHNEaXJcIilcbiAgc2l0ZVBvc3RzRGlyOlxuICAgIHRpdGxlOiBcIlNpdGUgUG9zdHMgRGlyZWN0b3J5XCJcbiAgICBkZXNjcmlwdGlvbjogXCJUaGUgcmVsYXRpdmUgcGF0aCBmcm9tIHlvdXIgc2l0ZSdzIGxvY2FsIGRpcmVjdG9yeVwiXG4gICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIGRlZmF1bHQ6IGNvbmZpZy5nZXREZWZhdWx0KFwic2l0ZVBvc3RzRGlyXCIpXG4gIHNpdGVJbWFnZXNEaXI6XG4gICAgdGl0bGU6IFwiU2l0ZSBJbWFnZXMgRGlyZWN0b3J5XCJcbiAgICBkZXNjcmlwdGlvbjogXCJUaGUgcmVsYXRpdmUgcGF0aCBmcm9tIHlvdXIgc2l0ZSdzIGxvY2FsIGRpcmVjdG9yeVwiXG4gICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIGRlZmF1bHQ6IGNvbmZpZy5nZXREZWZhdWx0KFwic2l0ZUltYWdlc0RpclwiKVxuICB1cmxGb3JUYWdzOlxuICAgIHRpdGxlOiBcIlVSTCB0byBUYWdzIEpTT04gZGVmaW5pdGlvbnNcIlxuICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICBkZWZhdWx0OiBjb25maWcuZ2V0RGVmYXVsdChcInVybEZvclRhZ3NcIilcbiAgdXJsRm9yUG9zdHM6XG4gICAgdGl0bGU6IFwiVVJMIHRvIFBvc3RzIEpTT04gZGVmaW5pdGlvbnNcIlxuICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICBkZWZhdWx0OiBjb25maWcuZ2V0RGVmYXVsdChcInVybEZvclBvc3RzXCIpXG4gIHVybEZvckNhdGVnb3JpZXM6XG4gICAgdGl0bGU6IFwiVVJMIHRvIENhdGVnb3JpZXMgSlNPTiBkZWZpbml0aW9uc1wiXG4gICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIGRlZmF1bHQ6IGNvbmZpZy5nZXREZWZhdWx0KFwidXJsRm9yQ2F0ZWdvcmllc1wiKVxuICBuZXdEcmFmdEZpbGVOYW1lOlxuICAgIHRpdGxlOiBcIk5ldyBEcmFmdCBGaWxlIE5hbWVcIlxuICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICBkZWZhdWx0OiBjb25maWcuZ2V0Q3VycmVudERlZmF1bHQoXCJuZXdEcmFmdEZpbGVOYW1lXCIpXG4gIG5ld1Bvc3RGaWxlTmFtZTpcbiAgICB0aXRsZTogXCJOZXcgUG9zdCBGaWxlIE5hbWVcIlxuICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICBkZWZhdWx0OiBjb25maWcuZ2V0Q3VycmVudERlZmF1bHQoXCJuZXdQb3N0RmlsZU5hbWVcIilcbiAgZmlsZUV4dGVuc2lvbjpcbiAgICB0aXRsZTogXCJGaWxlIEV4dGVuc2lvblwiXG4gICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIGRlZmF1bHQ6IGNvbmZpZy5nZXRDdXJyZW50RGVmYXVsdChcImZpbGVFeHRlbnNpb25cIilcbiAgcmVsYXRpdmVJbWFnZVBhdGg6XG4gICAgdGl0bGU6IFwiVXNlIFJlbGF0aXZlIEltYWdlIFBhdGhcIlxuICAgIGRlc2NyaXB0aW9uOiBcIlVzZSByZWxhdGl2ZSBpbWFnZSBwYXRoIGZyb20gdGhlIG9wZW4gZmlsZVwiXG4gICAgdHlwZTogXCJib29sZWFuXCJcbiAgICBkZWZhdWx0OiBjb25maWcuZ2V0Q3VycmVudERlZmF1bHQoXCJyZWxhdGl2ZUltYWdlUGF0aFwiKVxuICByZW5hbWVJbWFnZU9uQ29weTpcbiAgICB0aXRsZTogXCJSZW5hbWUgSW1hZ2UgRmlsZSBOYW1lXCJcbiAgICBkZXNjcmlwdGlvbjogXCJSZW5hbWUgaW1hZ2UgZmlsZW5hbWUgd2hlbiB5b3UgY2hvc2UgdG8gY29weSB0byBpbWFnZSBkaXJlY3RvcnlcIlxuICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgZGVmYXVsdDogY29uZmlnLmdldEN1cnJlbnREZWZhdWx0KFwicmVuYW1lSW1hZ2VPbkNvcHlcIilcbiAgdGFibGVBbGlnbm1lbnQ6XG4gICAgdGl0bGU6IFwiVGFibGUgQ2VsbCBBbGlnbm1lbnRcIlxuICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICBkZWZhdWx0OiBjb25maWcuZ2V0RGVmYXVsdChcInRhYmxlQWxpZ25tZW50XCIpXG4gICAgZW51bTogW1wiZW1wdHlcIiwgXCJsZWZ0XCIsIFwicmlnaHRcIiwgXCJjZW50ZXJcIl1cbiAgdGFibGVFeHRyYVBpcGVzOlxuICAgIHRpdGxlOiBcIlRhYmxlIEV4dHJhIFBpcGVzXCJcbiAgICBkZXNjcmlwdGlvbjogXCJJbnNlcnQgZXh0cmEgcGlwZXMgYXQgdGhlIHN0YXJ0IGFuZCB0aGUgZW5kIG9mIHRoZSB0YWJsZSByb3dzXCJcbiAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIGRlZmF1bHQ6IGNvbmZpZy5nZXREZWZhdWx0KFwidGFibGVFeHRyYVBpcGVzXCIpXG4iXX0=
