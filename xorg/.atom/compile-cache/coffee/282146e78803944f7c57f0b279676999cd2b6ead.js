(function() {
  var $, FrontMatter, config, create, getDateTime, getEditor, getFileRelativeDir, getFileSlug, getFrontMatter, getFrontMatterDate, getTemplateVariables, parseFrontMatterDate, path, utils,
    slice = [].slice;

  $ = require("atom-space-pen-views").$;

  path = require("path");

  config = require("../config");

  utils = require("../utils");

  FrontMatter = require("./front-matter");

  create = function() {
    var data, key;
    key = arguments[0], data = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    data = $.extend.apply($, [{}, getTemplateVariables()].concat(slice.call(data)));
    return utils.template(config.get(key), data);
  };

  getTemplateVariables = function() {
    return $.extend({
      site: config.get("siteUrl")
    }, config.get("templateVariables") || {});
  };

  getDateTime = function(date) {
    if (date == null) {
      date = new Date();
    }
    return utils.getDate(date);
  };

  getFrontMatterDate = function(dateTime) {
    return utils.template(config.get("frontMatterDate"), dateTime);
  };

  parseFrontMatterDate = function(str) {
    var dateHash, fn;
    fn = utils.untemplate(config.get("frontMatterDate"));
    dateHash = fn(str);
    if (dateHash) {
      return utils.parseDate(dateHash);
    }
  };

  getFrontMatter = function(frontMatter) {
    return {
      layout: frontMatter.getLayout(),
      published: frontMatter.getPublished(),
      title: frontMatter.getTitle(),
      slug: frontMatter.getSlug(),
      date: frontMatter.getDate(),
      extension: frontMatter.getExtension()
    };
  };

  getFileSlug = function(filePath) {
    var filename, hash, i, len, template, templates;
    if (!filePath) {
      return "";
    }
    filename = path.basename(filePath);
    templates = [config.get("newPostFileName"), config.get("newDraftFileName"), "{slug}{extension}"];
    for (i = 0, len = templates.length; i < len; i++) {
      template = templates[i];
      hash = utils.untemplate(template)(filename);
      if (hash && (hash["slug"] || hash["title"])) {
        return hash["slug"] || hash["title"];
      }
    }
  };

  getFileRelativeDir = function(filePath) {
    var fileDir, siteDir;
    if (!filePath) {
      return "";
    }
    siteDir = utils.getSitePath(config.get("siteLocalDir"));
    fileDir = path.dirname(filePath);
    return path.relative(siteDir, fileDir);
  };

  getEditor = function(editor) {
    var data, frontMatter;
    frontMatter = new FrontMatter(editor, {
      silent: true
    });
    data = frontMatter.getContent();
    data["category"] = frontMatter.getArray(config.get("frontMatterNameCategories", {
      allow_blank: false
    }))[0];
    data["tag"] = frontMatter.getArray(config.get("frontMatterNameTags", {
      allow_blank: false
    }))[0];
    data["directory"] = getFileRelativeDir(editor.getPath());
    data["slug"] = getFileSlug(editor.getPath()) || utils.slugize(data["title"], config.get("slugSeparator"));
    data["extension"] = path.extname(editor.getPath()) || config.get("fileExtension");
    return data;
  };

  module.exports = {
    create: create,
    getTemplateVariables: getTemplateVariables,
    getDateTime: getDateTime,
    getFrontMatter: getFrontMatter,
    getFrontMatterDate: getFrontMatterDate,
    parseFrontMatterDate: parseFrontMatterDate,
    getEditor: getEditor,
    getFileSlug: getFileSlug
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvaGVscGVycy90ZW1wbGF0ZS1oZWxwZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxvTEFBQTtJQUFBOztFQUFDLElBQUssT0FBQSxDQUFRLHNCQUFSOztFQUNOLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVI7O0VBQ1QsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSOztFQUNSLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0VBR2QsTUFBQSxHQUFTLFNBQUE7QUFDUCxRQUFBO0lBRFEsb0JBQUs7SUFDYixJQUFBLEdBQU8sQ0FBQyxDQUFDLE1BQUYsVUFBUyxDQUFBLEVBQUEsRUFBSSxvQkFBQSxDQUFBLENBQXdCLFNBQUEsV0FBQSxJQUFBLENBQUEsQ0FBckM7V0FDUCxLQUFLLENBQUMsUUFBTixDQUFlLE1BQU0sQ0FBQyxHQUFQLENBQVcsR0FBWCxDQUFmLEVBQWdDLElBQWhDO0VBRk87O0VBSVQsb0JBQUEsR0FBdUIsU0FBQTtXQUNyQixDQUFDLENBQUMsTUFBRixDQUFTO01BQUUsSUFBQSxFQUFNLE1BQU0sQ0FBQyxHQUFQLENBQVcsU0FBWCxDQUFSO0tBQVQsRUFBMEMsTUFBTSxDQUFDLEdBQVAsQ0FBVyxtQkFBWCxDQUFBLElBQW1DLEVBQTdFO0VBRHFCOztFQUd2QixXQUFBLEdBQWMsU0FBQyxJQUFEOztNQUFDLE9BQVcsSUFBQSxJQUFBLENBQUE7O1dBQ3hCLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBZDtFQURZOztFQUdkLGtCQUFBLEdBQXFCLFNBQUMsUUFBRDtXQUNuQixLQUFLLENBQUMsUUFBTixDQUFlLE1BQU0sQ0FBQyxHQUFQLENBQVcsaUJBQVgsQ0FBZixFQUE4QyxRQUE5QztFQURtQjs7RUFHckIsb0JBQUEs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SSxDQUFDLE9BQUwsQ0FBYSxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWIsQ0FBQSxJQUFrQyxNQUFNLENBQUMsR0FBUCxDQUFXLGVBQVg7V0FDdEQ7RUFSVTs7RUFVWixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUFRLE1BQVI7SUFDQSxvQkFBQSxFQUFzQixvQkFEdEI7SUFFQSxXQUFBLEVBQWEsV0FGYjtJQUdBLGNBQUEsRUFBZ0IsY0FIaEI7SUFJQSxrQkFBQSxFQUFvQixrQkFKcEI7SUFLQSxvQkFBQSxFQUFzQixvQkFMdEI7SUFNQSxTQUFBLEVBQVcsU0FOWDtJQU9BLFdBQUEsRUFBYSxXQVBiOztBQTlERiIsInNvdXJjZXNDb250ZW50IjpbInskfSA9IHJlcXVpcmUgXCJhdG9tLXNwYWNlLXBlbi12aWV3c1wiXG5wYXRoID0gcmVxdWlyZSBcInBhdGhcIlxuXG5jb25maWcgPSByZXF1aXJlIFwiLi4vY29uZmlnXCJcbnV0aWxzID0gcmVxdWlyZSBcIi4uL3V0aWxzXCJcbkZyb250TWF0dGVyID0gcmVxdWlyZSBcIi4vZnJvbnQtbWF0dGVyXCJcblxuIyBBbGwgdGVtcGxhdGUgc2hvdWxkIGJlIGNyZWF0ZWQgZnJvbSBoZXJlXG5jcmVhdGUgPSAoa2V5LCBkYXRhLi4uKSAtPlxuICBkYXRhID0gJC5leHRlbmQoe30sIGdldFRlbXBsYXRlVmFyaWFibGVzKCksIGRhdGEuLi4pXG4gIHV0aWxzLnRlbXBsYXRlKGNvbmZpZy5nZXQoa2V5KSwgZGF0YSlcblxuZ2V0VGVtcGxhdGVWYXJpYWJsZXMgPSAtPlxuICAkLmV4dGVuZCh7IHNpdGU6IGNvbmZpZy5nZXQoXCJzaXRlVXJsXCIpIH0sIGNvbmZpZy5nZXQoXCJ0ZW1wbGF0ZVZhcmlhYmxlc1wiKSB8fCB7fSlcblxuZ2V0RGF0ZVRpbWUgPSAoZGF0ZSA9IG5ldyBEYXRlKCkpIC0+XG4gIHV0aWxzLmdldERhdGUoZGF0ZSlcblxuZ2V0RnJvbnRNYXR0ZXJEYXRlID0gKGRhdGVUaW1lKSAtPlxuICB1dGlscy50ZW1wbGF0ZShjb25maWcuZ2V0KFwiZnJvbnRNYXR0ZXJEYXRlXCIpLCBkYXRlVGltZSlcblxucGFyc2VGcm9udE1hdHRlckRhdGUgPSAoc3RyKSAtPlxuICBmbiA9IHV0aWxzLnVudGVtcGxhdGUoY29uZmlnLmdldChcImZyb250TWF0dGVyRGF0ZVwiKSlcbiAgZGF0ZUhhc2ggPSBmbihzdHIpXG4gIHV0aWxzLnBhcnNlRGF0ZShkYXRlSGFzaCkgaWYgZGF0ZUhhc2hcblxuZ2V0RnJvbnRNYXR0ZXIgPSAoZnJvbnRNYXR0ZXIpIC0+XG4gIGxheW91dDogZnJvbnRNYXR0ZXIuZ2V0TGF5b3V0KClcbiAgcHVibGlzaGVkOiBmcm9udE1hdHRlci5nZXRQdWJsaXNoZWQoKVxuICB0aXRsZTogZnJvbnRNYXR0ZXIuZ2V0VGl0bGUoKVxuICBzbHVnOiBmcm9udE1hdHRlci5nZXRTbHVnKClcbiAgZGF0ZTogZnJvbnRNYXR0ZXIuZ2V0RGF0ZSgpXG4gIGV4dGVuc2lvbjogZnJvbnRNYXR0ZXIuZ2V0RXh0ZW5zaW9uKClcblxuZ2V0RmlsZVNsdWcgPSAoZmlsZVBhdGgpIC0+XG4gIHJldHVybiBcIlwiIHVubGVzcyBmaWxlUGF0aFxuXG4gIGZpbGVuYW1lID0gcGF0aC5iYXNlbmFtZShmaWxlUGF0aClcbiAgdGVtcGxhdGVzID0gW2NvbmZpZy5nZXQoXCJuZXdQb3N0RmlsZU5hbWVcIiksIGNvbmZpZy5nZXQoXCJuZXdEcmFmdEZpbGVOYW1lXCIpLCBcIntzbHVnfXtleHRlbnNpb259XCJdXG4gIGZvciB0ZW1wbGF0ZSBpbiB0ZW1wbGF0ZXNcbiAgICBoYXNoID0gdXRpbHMudW50ZW1wbGF0ZSh0ZW1wbGF0ZSkoZmlsZW5hbWUpXG4gICAgaWYgaGFzaCAmJiAoaGFzaFtcInNsdWdcIl0gfHwgaGFzaFtcInRpdGxlXCJdKSAjIHRpdGxlIGlzIHRoZSBsZWdhY3kgc2x1ZyBhbGlhcyBpbiBmaWxlbmFtZVxuICAgICAgcmV0dXJuIGhhc2hbXCJzbHVnXCJdIHx8IGhhc2hbXCJ0aXRsZVwiXVxuXG5nZXRGaWxlUmVsYXRpdmVEaXIgPSAoZmlsZVBhdGgpIC0+XG4gIHJldHVybiBcIlwiIHVubGVzcyBmaWxlUGF0aFxuXG4gIHNpdGVEaXIgPSB1dGlscy5nZXRTaXRlUGF0aChjb25maWcuZ2V0KFwic2l0ZUxvY2FsRGlyXCIpKVxuICBmaWxlRGlyID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKVxuICBwYXRoLnJlbGF0aXZlKHNpdGVEaXIsIGZpbGVEaXIpXG5cbmdldEVkaXRvciA9IChlZGl0b3IpIC0+XG4gIGZyb250TWF0dGVyID0gbmV3IEZyb250TWF0dGVyKGVkaXRvciwgeyBzaWxlbnQ6IHRydWUgfSlcbiAgZGF0YSA9IGZyb250TWF0dGVyLmdldENvbnRlbnQoKVxuICBkYXRhW1wiY2F0ZWdvcnlcIl0gPSBmcm9udE1hdHRlci5nZXRBcnJheShjb25maWcuZ2V0KFwiZnJvbnRNYXR0ZXJOYW1lQ2F0ZWdvcmllc1wiLCBhbGxvd19ibGFuazogZmFsc2UpKVswXVxuICBkYXRhW1widGFnXCJdID0gZnJvbnRNYXR0ZXIuZ2V0QXJyYXkoY29uZmlnLmdldChcImZyb250TWF0dGVyTmFtZVRhZ3NcIiwgYWxsb3dfYmxhbms6IGZhbHNlKSlbMF1cbiAgZGF0YVtcImRpcmVjdG9yeVwiXSA9IGdldEZpbGVSZWxhdGl2ZURpcihlZGl0b3IuZ2V0UGF0aCgpKVxuICBkYXRhW1wic2x1Z1wiXSA9IGdldEZpbGVTbHVnKGVkaXRvci5nZXRQYXRoKCkpIHx8IHV0aWxzLnNsdWdpemUoZGF0YVtcInRpdGxlXCJdLCBjb25maWcuZ2V0KFwic2x1Z1NlcGFyYXRvclwiKSlcbiAgZGF0YVtcImV4dGVuc2lvblwiXSA9IHBhdGguZXh0bmFtZShlZGl0b3IuZ2V0UGF0aCgpKSB8fCBjb25maWcuZ2V0KFwiZmlsZUV4dGVuc2lvblwiKVxuICBkYXRhXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY3JlYXRlOiBjcmVhdGVcbiAgZ2V0VGVtcGxhdGVWYXJpYWJsZXM6IGdldFRlbXBsYXRlVmFyaWFibGVzXG4gIGdldERhdGVUaW1lOiBnZXREYXRlVGltZVxuICBnZXRGcm9udE1hdHRlcjogZ2V0RnJvbnRNYXR0ZXJcbiAgZ2V0RnJvbnRNYXR0ZXJEYXRlOiBnZXRGcm9udE1hdHRlckRhdGVcbiAgcGFyc2VGcm9udE1hdHRlckRhdGU6IHBhcnNlRnJvbnRNYXR0ZXJEYXRlXG4gIGdldEVkaXRvcjogZ2V0RWRpdG9yXG4gIGdldEZpbGVTbHVnOiBnZXRGaWxlU2x1Z1xuIl19
