(function() {
  var path, utils;

  path = require("path");

  utils = require("../lib/utils");

  describe("utils", function() {
    describe(".incrementChars", function() {
      it("increment empty chars", function() {
        return expect(utils.incrementChars("")).toEqual("a");
      });
      it("increment 1 char", function() {
        expect(utils.incrementChars("a")).toEqual("b");
        expect(utils.incrementChars("f")).toEqual("g");
        expect(utils.incrementChars("y")).toEqual("z");
        return expect(utils.incrementChars("z")).toEqual("aa");
      });
      return it("increment 2 char", function() {
        expect(utils.incrementChars("AC")).toEqual("AD");
        expect(utils.incrementChars("EZ")).toEqual("FA");
        return expect(utils.incrementChars("ZZ")).toEqual("AAA");
      });
    });
    describe(".slugize", function() {
      it("slugize string", function() {
        var fixture;
        fixture = "hello world!";
        expect(utils.slugize(fixture)).toEqual("hello-world");
        fixture = "hello-world";
        expect(utils.slugize(fixture)).toEqual("hello-world");
        fixture = " hello     World";
        return expect(utils.slugize(fixture)).toEqual("hello-world");
      });
      it("slugize chinese", function() {
        var fixture;
        fixture = "中文也可以";
        expect(utils.slugize(fixture)).toEqual("中文也可以");
        fixture = "中文：也可以";
        expect(utils.slugize(fixture)).toEqual("中文：也可以");
        fixture = " 「中文」  『也可以』";
        return expect(utils.slugize(fixture)).toEqual("「中文」-『也可以』");
      });
      return it("slugize empty string", function() {
        expect(utils.slugize(void 0)).toEqual("");
        return expect(utils.slugize("")).toEqual("");
      });
    });
    describe(".getPackagePath", function() {
      it("get the package path", function() {
        var root;
        root = atom.packages.resolvePackagePath("markdown-writer");
        return expect(utils.getPackagePath()).toEqual(root);
      });
      return it("get the path to package file", function() {
        var cheatsheetPath, root;
        root = atom.packages.resolvePackagePath("markdown-writer");
        cheatsheetPath = path.join(root, "CHEATSHEET.md");
        return expect(utils.getPackagePath("CHEATSHEET.md")).toEqual(cheatsheetPath);
      });
    });
    describe(".getAbsolutePath", function() {
      return it("expand ~ to homedir", function() {
        var absPath;
        absPath = utils.getAbsolutePath(path.join("~", "markdown-writer"));
        return expect(absPath).toEqual(path.join(utils.getHomedir(), "markdown-writer"));
      });
    });
    describe(".template", function() {
      it("generate template", function() {
        var fixture;
        fixture = "<a href=''>hello <title>! <from></a>";
        return expect(utils.template(fixture, {
          title: "world",
          from: "markdown-writer"
        })).toEqual("<a href=''>hello world! markdown-writer</a>");
      });
      return it("generate template with data missing", function() {
        var fixture;
        fixture = "<a href='<url>' title='<title>'><img></a>";
        return expect(utils.template(fixture, {
          url: "//",
          title: ''
        })).toEqual("<a href='//' title=''><img></a>");
      });
    });
    describe(".untemplate", function() {
      it("generate untemplate for normal text", function() {
        var fn;
        fn = utils.untemplate("text");
        expect(fn("text")).toEqual({
          _: "text"
        });
        return expect(fn("abc")).toEqual(void 0);
      });
      it("generate untemplate for template", function() {
        var fn;
        fn = utils.untemplate("{year}-{month}");
        expect(fn("2016-11-12")).toEqual(void 0);
        return expect(fn("2016-01")).toEqual({
          _: "2016-01",
          year: "2016",
          month: "01"
        });
      });
      it("generate untemplate for complex template", function() {
        var fn;
        fn = utils.untemplate("{year}-{month}-{day} {hour}:{minute}");
        expect(fn("2016-11-12")).toEqual(void 0);
        return expect(fn("2016-01-03 12:19")).toEqual({
          _: "2016-01-03 12:19",
          year: "2016",
          month: "01",
          day: "03",
          hour: "12",
          minute: "19"
        });
      });
      return it("generate untemplate for template with regex chars", function() {
        var fn;
        fn = utils.untemplate("[{year}-{month}-{day}] - {hour}:{minute}");
        expect(fn("2016-11-12")).toEqual(void 0);
        return expect(fn("[2016-01-03] - 12:19")).toEqual({
          _: "[2016-01-03] - 12:19",
          year: "2016",
          month: "01",
          day: "03",
          hour: "12",
          minute: "19"
        });
      });
    });
    describe(".parseDate", function() {
      return it("parse date dashed string", function() {
        var date, parseDate;
        date = utils.getDate();
        parseDate = utils.parseDate(date);
        return expect(parseDate).toEqual(date);
      });
    });
    it("check is valid html image tag", function() {
      var fixture;
      fixture = "<img alt=\"alt\" src=\"src.png\" class=\"aligncenter\" height=\"304\" width=\"520\">";
      return expect(utils.isImageTag(fixture)).toBe(true);
    });
    it("check parse valid html image tag", function() {
      var fixture;
      fixture = "<img alt=\"alt\" src=\"src.png\" class=\"aligncenter\" height=\"304\" width=\"520\">";
      return expect(utils.parseImageTag(fixture)).toEqual({
        alt: "alt",
        src: "src.png",
        "class": "aligncenter",
        height: "304",
        width: "520"
      });
    });
    it("check parse valid html image tag with title", function() {
      var fixture;
      fixture = "<img title=\"\" src=\"src.png\" class=\"aligncenter\" height=\"304\" width=\"520\" />";
      return expect(utils.parseImageTag(fixture)).toEqual({
        title: "",
        src: "src.png",
        "class": "aligncenter",
        height: "304",
        width: "520"
      });
    });
    it("check is not valid image", function() {
      var fixture;
      fixture = "[text](url)";
      return expect(utils.isImage(fixture)).toBe(false);
    });
    it("check is valid image", function() {
      var fixture;
      fixture = "![](url)";
      expect(utils.isImage(fixture)).toBe(true);
      fixture = '![](url "title")';
      expect(utils.isImage(fixture)).toBe(true);
      fixture = "![text]()";
      expect(utils.isImage(fixture)).toBe(true);
      fixture = "![text](url)";
      expect(utils.isImage(fixture)).toBe(true);
      fixture = "![text](url 'title')";
      return expect(utils.isImage(fixture)).toBe(true);
    });
    it("parse valid image", function() {
      var fixture;
      fixture = "![text](url)";
      return expect(utils.parseImage(fixture)).toEqual({
        alt: "text",
        src: "url",
        title: ""
      });
    });
    it("check is valid image file", function() {
      var fixture;
      fixture = "fixtures/abc.jpg";
      expect(utils.isImageFile(fixture)).toBe(true);
      fixture = "fixtures/abc.txt";
      return expect(utils.isImageFile(fixture)).toBe(false);
    });
    describe(".isInlineLink", function() {
      it("check is text invalid inline link", function() {
        var fixture;
        fixture = "![text](url)";
        expect(utils.isInlineLink(fixture)).toBe(false);
        fixture = "[text][]";
        expect(utils.isInlineLink(fixture)).toBe(false);
        fixture = "[![](image.png)][id]";
        expect(utils.isInlineLink(fixture)).toBe(false);
        fixture = "[![image title](image.png)][id]";
        return expect(utils.isInlineLink(fixture)).toBe(false);
      });
      it("check is text valid inline link", function() {
        var fixture;
        fixture = "[text]()";
        expect(utils.isInlineLink(fixture)).toBe(true);
        fixture = "[text](url)";
        expect(utils.isInlineLink(fixture)).toBe(true);
        fixture = "[text](url title)";
        expect(utils.isInlineLink(fixture)).toBe(true);
        fixture = "[text](url 'title')";
        expect(utils.isInlineLink(fixture)).toBe(true);
        fixture = "[[link](in_another_link)][]";
        return expect(utils.isInlineLink(fixture)).toBe(true);
      });
      return it("check is image link valid inlink link", function() {
        var fixture;
        fixture = "[![](image.png)](url)";
        expect(utils.isInlineLink(fixture)).toBe(true);
        fixture = "[![text](image.png)](url)";
        expect(utils.isInlineLink(fixture)).toBe(true);
        fixture = "[![text](image.png)](url 'title')";
        return expect(utils.isInlineLink(fixture)).toBe(true);
      });
    });
    it("parse valid inline link text", function() {
      var fixture;
      fixture = "[text]()";
      expect(utils.parseInlineLink(fixture)).toEqual({
        text: "text",
        url: "",
        title: ""
      });
      fixture = "[text](url)";
      expect(utils.parseInlineLink(fixture)).toEqual({
        text: "text",
        url: "url",
        title: ""
      });
      fixture = "[text](url title)";
      expect(utils.parseInlineLink(fixture)).toEqual({
        text: "text",
        url: "url",
        title: "title"
      });
      fixture = "[text](url 'title')";
      return expect(utils.parseInlineLink(fixture)).toEqual({
        text: "text",
        url: "url",
        title: "title"
      });
    });
    it("parse valid image text inline link", function() {
      var fixture;
      fixture = "[![](image.png)](url)";
      expect(utils.parseInlineLink(fixture)).toEqual({
        text: "![](image.png)",
        url: "url",
        title: ""
      });
      fixture = "[![text](image.png)](url)";
      expect(utils.parseInlineLink(fixture)).toEqual({
        text: "![text](image.png)",
        url: "url",
        title: ""
      });
      fixture = "[![text](image.png 'title')](url 'title')";
      return expect(utils.parseInlineLink(fixture)).toEqual({
        text: "![text](image.png 'title')",
        url: "url",
        title: "title"
      });
    });
    describe(".isReferenceLink", function() {
      it("check is text invalid reference link", function() {
        var fixture;
        fixture = "![text](url)";
        expect(utils.isReferenceLink(fixture)).toBe(false);
        fixture = "[text](has)";
        expect(utils.isReferenceLink(fixture)).toBe(false);
        fixture = "[][]";
        expect(utils.isReferenceLink(fixture)).toBe(false);
        fixture = "[![](image.png)][]";
        expect(utils.isReferenceLink(fixture)).toBe(false);
        fixture = "[![text](image.png)][]";
        return expect(utils.isReferenceLink(fixture)).toBe(false);
      });
      it("check is text valid reference link", function() {
        var fixture;
        fixture = "[text][]";
        expect(utils.isReferenceLink(fixture)).toBe(true);
        fixture = "[text][id with space]";
        return expect(utils.isReferenceLink(fixture)).toBe(true);
      });
      return it("check is text valid image reference link", function() {
        var fixture;
        fixture = "[![](image.png)][]";
        expect(utils.isReferenceLink(fixture)).toBe(false);
        fixture = "[![text](image.png)][]";
        expect(utils.isReferenceLink(fixture)).toBe(false);
        fixture = "[![](image.png)][id with space]";
        expect(utils.isReferenceLink(fixture)).toBe(true);
        fixture = "[![text](image.png)][id with space]";
        return expect(utils.isReferenceLink(fixture)).toBe(true);
      });
    });
    describe(".parseReferenceLink", function() {
      var editor;
      editor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open("empty.markdown");
        });
        return runs(function() {
          editor = atom.workspace.getActiveTextEditor();
          return editor.setText("Transform your plain [text][] into static websites and blogs.\n\n[text]: http://www.jekyll.com\n[id]: http://jekyll.com \"Jekyll Website\"\n\nMarkdown (or Textile), Liquid, HTML & CSS go in [Jekyll][id].");
        });
      });
      it("parse valid reference link text without id", function() {
        var fixture;
        fixture = "[text][]";
        return expect(utils.parseReferenceLink(fixture, editor)).toEqual({
          id: "text",
          text: "text",
          url: "http://www.jekyll.com",
          title: "",
          definitionRange: {
            start: {
              row: 2,
              column: 0
            },
            end: {
              row: 2,
              column: 29
            }
          }
        });
      });
      it("parse valid reference link text with id", function() {
        var fixture;
        fixture = "[Jekyll][id]";
        return expect(utils.parseReferenceLink(fixture, editor)).toEqual({
          id: "id",
          text: "Jekyll",
          url: "http://jekyll.com",
          title: "Jekyll Website",
          definitionRange: {
            start: {
              row: 3,
              column: 0
            },
            end: {
              row: 3,
              column: 40
            }
          }
        });
      });
      return it("parse orphan reference link text", function() {
        var fixture;
        fixture = "[Jekyll][jekyll]";
        return expect(utils.parseReferenceLink(fixture, editor)).toEqual({
          id: "jekyll",
          text: "Jekyll",
          url: "",
          title: "",
          definitionRange: null
        });
      });
    });
    describe(".isReferenceDefinition", function() {
      it("check is text invalid reference definition", function() {
        var fixture;
        fixture = "[text] http";
        expect(utils.isReferenceDefinition(fixture)).toBe(false);
        fixture = "[^text]: http";
        return expect(utils.isReferenceDefinition(fixture)).toBe(false);
      });
      it("check is text valid reference definition", function() {
        var fixture;
        fixture = "[text text]: http";
        return expect(utils.isReferenceDefinition(fixture)).toBe(true);
      });
      return it("check is text valid reference definition with title", function() {
        var fixture;
        fixture = "  [text]: http 'title not in double quote'";
        return expect(utils.isReferenceDefinition(fixture)).toBe(true);
      });
    });
    describe(".parseReferenceDefinition", function() {
      var editor;
      editor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open("empty.markdown");
        });
        return runs(function() {
          editor = atom.workspace.getActiveTextEditor();
          return editor.setText("Transform your plain [text][] into static websites and blogs.\n\n[text]: http://www.jekyll.com\n[id]: http://jekyll.com \"Jekyll Website\"\n\nMarkdown (or Textile), Liquid, HTML & CSS go in [Jekyll][id].");
        });
      });
      it("parse valid reference definition text without id", function() {
        var fixture;
        fixture = "[text]: http://www.jekyll.com";
        return expect(utils.parseReferenceDefinition(fixture, editor)).toEqual({
          id: "text",
          text: "text",
          url: "http://www.jekyll.com",
          title: "",
          linkRange: {
            start: {
              row: 0,
              column: 21
            },
            end: {
              row: 0,
              column: 29
            }
          }
        });
      });
      it("parse valid reference definition text with id", function() {
        var fixture;
        fixture = "[id]: http://jekyll.com \"Jekyll Website\"";
        return expect(utils.parseReferenceDefinition(fixture, editor)).toEqual({
          id: "id",
          text: "Jekyll",
          url: "http://jekyll.com",
          title: "Jekyll Website",
          linkRange: {
            start: {
              row: 5,
              column: 48
            },
            end: {
              row: 5,
              column: 60
            }
          }
        });
      });
      return it("parse orphan reference definition text", function() {
        var fixture;
        fixture = "[jekyll]: http://jekyll.com \"Jekyll Website\"";
        return expect(utils.parseReferenceDefinition(fixture, editor)).toEqual({
          id: "jekyll",
          text: "",
          url: "http://jekyll.com",
          title: "Jekyll Website",
          linkRange: null
        });
      });
    });
    describe(".isFootnote", function() {
      it("check is text invalid footnote", function() {
        var fixture;
        fixture = "[text]";
        expect(utils.isFootnote(fixture)).toBe(false);
        fixture = "![abc]";
        return expect(utils.isFootnote(fixture)).toBe(false);
      });
      return it("check is text valid footnote", function() {
        var fixture;
        fixture = "[^1]";
        expect(utils.isFootnote(fixture)).toBe(true);
        fixture = "[^text]";
        expect(utils.isFootnote(fixture)).toBe(true);
        fixture = "[^text text]";
        expect(utils.isFootnote(fixture)).toBe(true);
        fixture = "[^12]:";
        return expect(utils.isFootnote(fixture)).toBe(true);
      });
    });
    describe(".parseFootnote", function() {
      return it("parse valid footnote", function() {
        var fixture;
        fixture = "[^1]";
        expect(utils.parseFootnote(fixture)).toEqual({
          label: "1",
          content: "",
          isDefinition: false
        });
        fixture = "[^text]: ";
        return expect(utils.parseFootnote(fixture)).toEqual({
          label: "text",
          content: "",
          isDefinition: true
        });
      });
    });
    describe(".isTableSeparator", function() {
      it("check is table separator", function() {
        var fixture;
        fixture = "----|";
        expect(utils.isTableSeparator(fixture)).toBe(false);
        fixture = "|--|";
        expect(utils.isTableSeparator(fixture)).toBe(true);
        fixture = "--|--";
        expect(utils.isTableSeparator(fixture)).toBe(true);
        fixture = "---- |------ | ---";
        return expect(utils.isTableSeparator(fixture)).toBe(true);
      });
      it("check is table separator with extra pipes", function() {
        var fixture;
        fixture = "|-----";
        expect(utils.isTableSeparator(fixture)).toBe(false);
        fixture = "|--|--";
        expect(utils.isTableSeparator(fixture)).toBe(true);
        fixture = "|---- |------ | ---|";
        return expect(utils.isTableSeparator(fixture)).toBe(true);
      });
      return it("check is table separator with format", function() {
        var fixture;
        fixture = ":--  |::---";
        expect(utils.isTableSeparator(fixture)).toBe(false);
        fixture = "|:---: |";
        expect(utils.isTableSeparator(fixture)).toBe(true);
        fixture = ":--|--:";
        expect(utils.isTableSeparator(fixture)).toBe(true);
        fixture = "|:---: |:----- | --: |";
        return expect(utils.isTableSeparator(fixture)).toBe(true);
      });
    });
    describe(".parseTableSeparator", function() {
      it("parse table separator", function() {
        var fixture;
        fixture = "|----|";
        expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: true,
          alignments: ["empty"],
          columns: ["----"],
          columnWidths: [4]
        });
        fixture = "--|--";
        expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: false,
          alignments: ["empty", "empty"],
          columns: ["--", "--"],
          columnWidths: [2, 2]
        });
        fixture = "---- |------ | ---";
        return expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: false,
          alignments: ["empty", "empty", "empty"],
          columns: ["----", "------", "---"],
          columnWidths: [4, 6, 3]
        });
      });
      it("parse table separator with extra pipes", function() {
        var fixture;
        fixture = "|--|--";
        expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: true,
          alignments: ["empty", "empty"],
          columns: ["--", "--"],
          columnWidths: [2, 2]
        });
        fixture = "|---- |------ | ---|";
        return expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: true,
          alignments: ["empty", "empty", "empty"],
          columns: ["----", "------", "---"],
          columnWidths: [4, 6, 3]
        });
      });
      return it("parse table separator with format", function() {
        var fixture;
        fixture = ":-|-:|::";
        expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: false,
          alignments: ["left", "right", "center"],
          columns: [":-", "-:", "::"],
          columnWidths: [2, 2, 2]
        });
        fixture = ":--|--:";
        expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: false,
          alignments: ["left", "right"],
          columns: [":--", "--:"],
          columnWidths: [3, 3]
        });
        fixture = "|:---: |:----- | --: |";
        return expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: true,
          alignments: ["center", "left", "right"],
          columns: [":---:", ":-----", "--:"],
          columnWidths: [5, 6, 3]
        });
      });
    });
    describe(".isTableRow", function() {
      it("check table separator is a table row", function() {
        var fixture;
        fixture = ":--  |:---";
        return expect(utils.isTableRow(fixture)).toBe(true);
      });
      return it("check is table row", function() {
        var fixture;
        fixture = "| empty content |";
        expect(utils.isTableRow(fixture)).toBe(true);
        fixture = "abc|feg";
        expect(utils.isTableRow(fixture)).toBe(true);
        fixture = "|   abc |efg | |";
        return expect(utils.isTableRow(fixture)).toBe(true);
      });
    });
    describe(".parseTableRow", function() {
      it("parse table separator by table row ", function() {
        var fixture;
        fixture = "|:---: |:----- | --: |";
        return expect(utils.parseTableRow(fixture)).toEqual({
          separator: true,
          extraPipes: true,
          alignments: ["center", "left", "right"],
          columns: [":---:", ":-----", "--:"],
          columnWidths: [5, 6, 3]
        });
      });
      return it("parse table row ", function() {
        var fixture;
        fixture = "| 中文 |";
        expect(utils.parseTableRow(fixture)).toEqual({
          separator: false,
          extraPipes: true,
          columns: ["中文"],
          columnWidths: [4]
        });
        fixture = "abc|feg";
        expect(utils.parseTableRow(fixture)).toEqual({
          separator: false,
          extraPipes: false,
          columns: ["abc", "feg"],
          columnWidths: [3, 3]
        });
        fixture = "|   abc |efg | |";
        return expect(utils.parseTableRow(fixture)).toEqual({
          separator: false,
          extraPipes: true,
          columns: ["abc", "efg", ""],
          columnWidths: [3, 3, 0]
        });
      });
    });
    it("create table separator", function() {
      var row;
      row = utils.createTableSeparator({
        numOfColumns: 3,
        extraPipes: false,
        columnWidth: 1,
        alignment: "empty"
      });
      expect(row).toEqual("--|---|--");
      row = utils.createTableSeparator({
        numOfColumns: 2,
        extraPipes: true,
        columnWidth: 1,
        alignment: "empty"
      });
      expect(row).toEqual("|---|---|");
      row = utils.createTableSeparator({
        numOfColumns: 1,
        extraPipes: true,
        columnWidth: 1,
        alignment: "left"
      });
      expect(row).toEqual("|:--|");
      row = utils.createTableSeparator({
        numOfColumns: 3,
        extraPipes: true,
        columnWidths: [2, 3, 3],
        alignment: "left"
      });
      expect(row).toEqual("|:---|:----|:----|");
      row = utils.createTableSeparator({
        numOfColumns: 4,
        extraPipes: false,
        columnWidth: 3,
        alignment: "left",
        alignments: ["empty", "right", "center"]
      });
      return expect(row).toEqual("----|----:|:---:|:---");
    });
    it("create empty table row", function() {
      var row;
      row = utils.createTableRow([], {
        numOfColumns: 3,
        columnWidth: 1,
        alignment: "empty"
      });
      expect(row).toEqual("  |   |  ");
      row = utils.createTableRow([], {
        numOfColumns: 3,
        extraPipes: true,
        columnWidths: [1, 2, 3],
        alignment: "empty"
      });
      return expect(row).toEqual("|   |    |     |");
    });
    it("create table row", function() {
      var row;
      row = utils.createTableRow(["中文", "English"], {
        numOfColumns: 2,
        extraPipes: true,
        columnWidths: [4, 7]
      });
      expect(row).toEqual("| 中文 | English |");
      row = utils.createTableRow(["中文", "English"], {
        numOfColumns: 2,
        columnWidths: [8, 10],
        alignments: ["right", "center"]
      });
      return expect(row).toEqual("    中文 |  English  ");
    });
    it("create an empty table", function() {
      var options, rows;
      rows = [];
      options = {
        numOfColumns: 3,
        columnWidths: [4, 1, 4],
        alignments: ["left", "center", "right"]
      };
      rows.push(utils.createTableRow([], options));
      rows.push(utils.createTableSeparator(options));
      rows.push(utils.createTableRow([], options));
      return expect(rows).toEqual(["     |   |     ", ":----|:-:|----:", "     |   |     "]);
    });
    it("create an empty table with extra pipes", function() {
      var options, rows;
      rows = [];
      options = {
        numOfColumns: 3,
        extraPipes: true,
        columnWidth: 1,
        alignment: "empty"
      };
      rows.push(utils.createTableRow([], options));
      rows.push(utils.createTableSeparator(options));
      rows.push(utils.createTableRow([], options));
      return expect(rows).toEqual(["|   |   |   |", "|---|---|---|", "|   |   |   |"]);
    });
    it("check is url", function() {
      var fixture;
      fixture = "https://github.com/zhuochun/md-writer";
      expect(utils.isUrl(fixture)).toBe(true);
      fixture = "/Users/zhuochun/md-writer";
      return expect(utils.isUrl(fixture)).toBe(false);
    });
    return it("normalize file path", function() {
      var expected, fixture;
      fixture = "https://github.com/zhuochun/md-writer";
      expect(utils.normalizeFilePath(fixture)).toEqual(fixture);
      fixture = "\\github.com\\zhuochun\\md-writer.gif";
      expected = "/github.com/zhuochun/md-writer.gif";
      expect(utils.normalizeFilePath(fixture)).toEqual(expected);
      return expect(utils.normalizeFilePath(expected)).toEqual(expected);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL3V0aWxzLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSOztFQUVSLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUE7SUFNaEIsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUE7TUFDMUIsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUE7ZUFDMUIsTUFBQSxDQUFPLEtBQUssQ0FBQyxjQUFOLENBQXFCLEVBQXJCLENBQVAsQ0FBZ0MsQ0FBQyxPQUFqQyxDQUF5QyxHQUF6QztNQUQwQixDQUE1QjtNQUdBLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBO1FBQ3JCLE1BQUEsQ0FBTyxLQUFLLENBQUMsY0FBTixDQUFxQixHQUFyQixDQUFQLENBQWlDLENBQUMsT0FBbEMsQ0FBMEMsR0FBMUM7UUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLGNBQU4sQ0FBcUIsR0FBckIsQ0FBUCxDQUFpQyxDQUFDLE9BQWxDLENBQTBDLEdBQTFDO1FBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxjQUFOLENBQXFCLEdBQXJCLENBQVAsQ0FBaUMsQ0FBQyxPQUFsQyxDQUEwQyxHQUExQztlQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsY0FBTixDQUFxQixHQUFyQixDQUFQLENBQWlDLENBQUMsT0FBbEMsQ0FBMEMsSUFBMUM7TUFKcUIsQ0FBdkI7YUFNQSxFQUFBLENBQUcsa0JBQUgsRUFBdUIsU0FBQTtRQUNyQixNQUFBLENBQU8sS0FBSyxDQUFDLGNBQU4sQ0FBcUIsSUFBckIsQ0FBUCxDQUFrQyxDQUFDLE9BQW5DLENBQTJDLElBQTNDO1FBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxjQUFOLENBQXFC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QixlQUZtQixFQUduQixlQUhtQixDQUFyQjtJQVgyQyxDQUE3QztJQXFCQSxFQUFBLENBQUcsY0FBSCxFQUFtQixTQUFBO0FBQ2pCLFVBQUE7TUFBQSxPQUFBLEdBQVU7TUFDVixNQUFBLENBQU8sS0FBSyxDQUFDLEtBQU4sQ0FBWSxPQUFaLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxJQUFsQztNQUNBLE9BQUEsR0FBVTthQUNWLE1BQUEsQ0FBTyxLQUFLLENBQUMsS0FBTixDQUFZLE9BQVosQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDO0lBSmlCLENBQW5CO1dBTUEsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUE7QUFDeEIsVUFBQTtNQUFBLE9BQUEsR0FBVTtNQUNWLE1BQUEsQ0FBTyxLQUFLLENBQUMsaUJBQU4sQ0FBd0IsT0FBeEIsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELE9BQWpEO01BRUEsT0FBQSxHQUFVO01BQ1YsUUFBQSxHQUFXO01BQ1gsTUFBQSxDQUFPLEtBQUssQ0FBQyxpQkFBTixDQUF3QixPQUF4QixDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsUUFBakQ7YUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLGlCQUFOLENBQXdCLFFBQXhCLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxRQUFsRDtJQVB3QixDQUExQjtFQW5sQmdCLENBQWxCO0FBSEEiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSBcInBhdGhcIlxudXRpbHMgPSByZXF1aXJlIFwiLi4vbGliL3V0aWxzXCJcblxuZGVzY3JpYmUgXCJ1dGlsc1wiLCAtPlxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIEdlbmVyYWwgVXRpbHNcbiNcblxuICBkZXNjcmliZSBcIi5pbmNyZW1lbnRDaGFyc1wiLCAtPlxuICAgIGl0IFwiaW5jcmVtZW50IGVtcHR5IGNoYXJzXCIsIC0+XG4gICAgICBleHBlY3QodXRpbHMuaW5jcmVtZW50Q2hhcnMoXCJcIikpLnRvRXF1YWwoXCJhXCIpXG5cbiAgICBpdCBcImluY3JlbWVudCAxIGNoYXJcIiwgLT5cbiAgICAgIGV4cGVjdCh1dGlscy5pbmNyZW1lbnRDaGFycyhcImFcIikpLnRvRXF1YWwoXCJiXCIpXG4gICAgICBleHBlY3QodXRpbHMuaW5jcmVtZW50Q2hhcnMoXCJmXCIpKS50b0VxdWFsKFwiZ1wiKVxuICAgICAgZXhwZWN0KHV0aWxzLmluY3JlbWVudENoYXJzKFwieVwiKSkudG9FcXVhbChcInpcIilcbiAgICAgIGV4cGVjdCh1dGlscy5pbmNyZW1lbnRDaGFycyhcInpcIikpLnRvRXF1YWwoXCJhYVwiKVxuXG4gICAgaXQgXCJpbmNyZW1lbnQgMiBjaGFyXCIsIC0+XG4gICAgICBleHBlY3QodXRpbHMuaW5jcmVtZW50Q2hhcnMoXCJBQ1wiKSkudG9FcXVhbChcIkFEXCIpXG4gICAgICBleHBlY3QodXRpbHMuaW5jcmVtZW50Q2hhcnMoXCJFWlwiKSkudG9FcXVhbChcIkZBXCIpXG4gICAgICBleHBlY3QodXRpbHMuaW5jcmVtZW50Q2hhcnMoXCJaWlwiKSkudG9FcXVhbChcIkFBQVwiKVxuXG4gIGRlc2NyaWJlIFwiLnNsdWdpemVcIiwgLT5cbiAgICBpdCBcInNsdWdpemUgc3RyaW5nXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJoZWxsbyB3b3JsZCFcIlxuICAgICAgZXhwZWN0KHV0aWxzLnNsdWdpemUoZml4dHVyZSkpLnRvRXF1YWwoXCJoZWxsby13b3JsZFwiKVxuICAgICAgZml4dHVyZSA9IFwiaGVsbG8td29ybGRcIlxuICAgICAgZXhwZWN0KHV0aWxzLnNsdWdpemUoZml4dHVyZSkpLnRvRXF1YWwoXCJoZWxsby13b3JsZFwiKVxuICAgICAgZml4dHVyZSA9IFwiIGhlbGxvICAgICBXb3JsZFwiXG4gICAgICBleHBlY3QodXRpbHMuc2x1Z2l6ZShmaXh0dXJlKSkudG9FcXVhbChcImhlbGxvLXdvcmxkXCIpXG5cbiAgICBpdCBcInNsdWdpemUgY2hpbmVzZVwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwi5Lit5paH5Lmf5Y+v5LulXCJcbiAgICAgIGV4cGVjdCh1dGlscy5zbHVnaXplKGZpeHR1cmUpKS50b0VxdWFsKFwi5Lit5paH5Lmf5Y+v5LulXCIpXG4gICAgICBmaXh0dXJlID0gXCLkuK3mlofvvJrkuZ/lj6/ku6VcIlxuICAgICAgZXhwZWN0KHV0aWxzLnNsdWdpemUoZml4dHVyZSkpLnRvRXF1YWwoXCLkuK3mlofvvJrkuZ/lj6/ku6VcIilcbiAgICAgIGZpeHR1cmUgPSBcIiDjgIzkuK3mlofjgI0gIOOAjuS5n+WPr+S7peOAj1wiXG4gICAgICBleHBlY3QodXRpbHMuc2x1Z2l6ZShmaXh0dXJlKSkudG9FcXVhbChcIuOAjOS4reaWh+OAjS3jgI7kuZ/lj6/ku6XjgI9cIilcblxuICAgIGl0IFwic2x1Z2l6ZSBlbXB0eSBzdHJpbmdcIiwgLT5cbiAgICAgIGV4cGVjdCh1dGlscy5zbHVnaXplKHVuZGVmaW5lZCkpLnRvRXF1YWwoXCJcIilcbiAgICAgIGV4cGVjdCh1dGlscy5zbHVnaXplKFwiXCIpKS50b0VxdWFsKFwiXCIpXG5cbiAgZGVzY3JpYmUgXCIuZ2V0UGFja2FnZVBhdGhcIiwgLT5cbiAgICBpdCBcImdldCB0aGUgcGFja2FnZSBwYXRoXCIsIC0+XG4gICAgICByb290ID0gYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoXCJtYXJrZG93bi13cml0ZXJcIilcbiAgICAgIGV4cGVjdCh1dGlscy5nZXRQYWNrYWdlUGF0aCgpKS50b0VxdWFsKHJvb3QpXG5cbiAgICBpdCBcImdldCB0aGUgcGF0aCB0byBwYWNrYWdlIGZpbGVcIiwgLT5cbiAgICAgIHJvb3QgPSBhdG9tLnBhY2thZ2VzLnJlc29sdmVQYWNrYWdlUGF0aChcIm1hcmtkb3duLXdyaXRlclwiKVxuICAgICAgY2hlYXRzaGVldFBhdGggPSBwYXRoLmpvaW4ocm9vdCwgXCJDSEVBVFNIRUVULm1kXCIpXG4gICAgICBleHBlY3QodXRpbHMuZ2V0UGFja2FnZVBhdGgoXCJDSEVBVFNIRUVULm1kXCIpKS50b0VxdWFsKGNoZWF0c2hlZXRQYXRoKVxuXG4gIGRlc2NyaWJlIFwiLmdldEFic29sdXRlUGF0aFwiLCAtPlxuICAgIGl0IFwiZXhwYW5kIH4gdG8gaG9tZWRpclwiLCAtPlxuICAgICAgYWJzUGF0aCA9IHV0aWxzLmdldEFic29sdXRlUGF0aChwYXRoLmpvaW4oXCJ+XCIsIFwibWFya2Rvd24td3JpdGVyXCIpKVxuICAgICAgZXhwZWN0KGFic1BhdGgpLnRvRXF1YWwocGF0aC5qb2luKHV0aWxzLmdldEhvbWVkaXIoKSwgXCJtYXJrZG93bi13cml0ZXJcIikpXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgVGVtcGxhdGVcbiNcblxuICBkZXNjcmliZSBcIi50ZW1wbGF0ZVwiLCAtPlxuICAgIGl0IFwiZ2VuZXJhdGUgdGVtcGxhdGVcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcIjxhIGhyZWY9Jyc+aGVsbG8gPHRpdGxlPiEgPGZyb20+PC9hPlwiXG4gICAgICBleHBlY3QodXRpbHMudGVtcGxhdGUoZml4dHVyZSwgdGl0bGU6IFwid29ybGRcIiwgZnJvbTogXCJtYXJrZG93bi13cml0ZXJcIikpXG4gICAgICAgIC50b0VxdWFsKFwiPGEgaHJlZj0nJz5oZWxsbyB3b3JsZCEgbWFya2Rvd24td3JpdGVyPC9hPlwiKVxuXG4gICAgaXQgXCJnZW5lcmF0ZSB0ZW1wbGF0ZSB3aXRoIGRhdGEgbWlzc2luZ1wiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiPGEgaHJlZj0nPHVybD4nIHRpdGxlPSc8dGl0bGU+Jz48aW1nPjwvYT5cIlxuICAgICAgZXhwZWN0KHV0aWxzLnRlbXBsYXRlKGZpeHR1cmUsIHVybDogXCIvL1wiLCB0aXRsZTogJycpKVxuICAgICAgICAudG9FcXVhbChcIjxhIGhyZWY9Jy8vJyB0aXRsZT0nJz48aW1nPjwvYT5cIilcblxuICBkZXNjcmliZSBcIi51bnRlbXBsYXRlXCIsIC0+XG4gICAgaXQgXCJnZW5lcmF0ZSB1bnRlbXBsYXRlIGZvciBub3JtYWwgdGV4dFwiLCAtPlxuICAgICAgZm4gPSB1dGlscy51bnRlbXBsYXRlKFwidGV4dFwiKVxuICAgICAgZXhwZWN0KGZuKFwidGV4dFwiKSkudG9FcXVhbChfOiBcInRleHRcIilcbiAgICAgIGV4cGVjdChmbihcImFiY1wiKSkudG9FcXVhbCh1bmRlZmluZWQpXG5cbiAgICBpdCBcImdlbmVyYXRlIHVudGVtcGxhdGUgZm9yIHRlbXBsYXRlXCIsIC0+XG4gICAgICBmbiA9IHV0aWxzLnVudGVtcGxhdGUoXCJ7eWVhcn0te21vbnRofVwiKVxuICAgICAgZXhwZWN0KGZuKFwiMjAxNi0xMS0xMlwiKSkudG9FcXVhbCh1bmRlZmluZWQpXG4gICAgICBleHBlY3QoZm4oXCIyMDE2LTAxXCIpKS50b0VxdWFsKF86IFwiMjAxNi0wMVwiLCB5ZWFyOiBcIjIwMTZcIiwgbW9udGg6IFwiMDFcIilcblxuICAgIGl0IFwiZ2VuZXJhdGUgdW50ZW1wbGF0ZSBmb3IgY29tcGxleCB0ZW1wbGF0ZVwiLCAtPlxuICAgICAgZm4gPSB1dGlscy51bnRlbXBsYXRlKFwie3llYXJ9LXttb250aH0te2RheX0ge2hvdXJ9OnttaW51dGV9XCIpXG4gICAgICBleHBlY3QoZm4oXCIyMDE2LTExLTEyXCIpKS50b0VxdWFsKHVuZGVmaW5lZClcbiAgICAgIGV4cGVjdChmbihcIjIwMTYtMDEtMDMgMTI6MTlcIikpLnRvRXF1YWwoXG4gICAgICAgIF86IFwiMjAxNi0wMS0wMyAxMjoxOVwiLCB5ZWFyOiBcIjIwMTZcIiwgbW9udGg6IFwiMDFcIixcbiAgICAgICAgZGF5OiBcIjAzXCIsIGhvdXI6IFwiMTJcIiwgbWludXRlOiBcIjE5XCIpXG5cbiAgICBpdCBcImdlbmVyYXRlIHVudGVtcGxhdGUgZm9yIHRlbXBsYXRlIHdpdGggcmVnZXggY2hhcnNcIiwgLT5cbiAgICAgIGZuID0gdXRpbHMudW50ZW1wbGF0ZShcIlt7eWVhcn0te21vbnRofS17ZGF5fV0gLSB7aG91cn06e21pbnV0ZX1cIilcbiAgICAgIGV4cGVjdChmbihcIjIwMTYtMTEtMTJcIikpLnRvRXF1YWwodW5kZWZpbmVkKVxuICAgICAgZXhwZWN0KGZuKFwiWzIwMTYtMDEtMDNdIC0gMTI6MTlcIikpLnRvRXF1YWwoXG4gICAgICAgIF86IFwiWzIwMTYtMDEtMDNdIC0gMTI6MTlcIiwgeWVhcjogXCIyMDE2XCIsIG1vbnRoOiBcIjAxXCIsXG4gICAgICAgIGRheTogXCIwM1wiLCBob3VyOiBcIjEyXCIsIG1pbnV0ZTogXCIxOVwiKVxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIERhdGUgYW5kIFRpbWVcbiNcblxuICBkZXNjcmliZSBcIi5wYXJzZURhdGVcIiwgLT5cbiAgICBpdCBcInBhcnNlIGRhdGUgZGFzaGVkIHN0cmluZ1wiLCAtPlxuICAgICAgZGF0ZSA9IHV0aWxzLmdldERhdGUoKVxuICAgICAgcGFyc2VEYXRlID0gdXRpbHMucGFyc2VEYXRlKGRhdGUpXG4gICAgICBleHBlY3QocGFyc2VEYXRlKS50b0VxdWFsKGRhdGUpXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgSW1hZ2UgSFRNTCBUYWdcbiNcblxuICBpdCBcImNoZWNrIGlzIHZhbGlkIGh0bWwgaW1hZ2UgdGFnXCIsIC0+XG4gICAgZml4dHVyZSA9IFwiXCJcIlxuICAgIDxpbWcgYWx0PVwiYWx0XCIgc3JjPVwic3JjLnBuZ1wiIGNsYXNzPVwiYWxpZ25jZW50ZXJcIiBoZWlnaHQ9XCIzMDRcIiB3aWR0aD1cIjUyMFwiPlxuICAgIFwiXCJcIlxuICAgIGV4cGVjdCh1dGlscy5pc0ltYWdlVGFnKGZpeHR1cmUpKS50b0JlKHRydWUpXG5cbiAgaXQgXCJjaGVjayBwYXJzZSB2YWxpZCBodG1sIGltYWdlIHRhZ1wiLCAtPlxuICAgIGZpeHR1cmUgPSBcIlwiXCJcbiAgICA8aW1nIGFsdD1cImFsdFwiIHNyYz1cInNyYy5wbmdcIiBjbGFzcz1cImFsaWduY2VudGVyXCIgaGVpZ2h0PVwiMzA0XCIgd2lkdGg9XCI1MjBcIj5cbiAgICBcIlwiXCJcbiAgICBleHBlY3QodXRpbHMucGFyc2VJbWFnZVRhZyhmaXh0dXJlKSkudG9FcXVhbFxuICAgICAgYWx0OiBcImFsdFwiLCBzcmM6IFwic3JjLnBuZ1wiLFxuICAgICAgY2xhc3M6IFwiYWxpZ25jZW50ZXJcIiwgaGVpZ2h0OiBcIjMwNFwiLCB3aWR0aDogXCI1MjBcIlxuXG4gIGl0IFwiY2hlY2sgcGFyc2UgdmFsaWQgaHRtbCBpbWFnZSB0YWcgd2l0aCB0aXRsZVwiLCAtPlxuICAgIGZpeHR1cmUgPSBcIlwiXCJcbiAgICA8aW1nIHRpdGxlPVwiXCIgc3JjPVwic3JjLnBuZ1wiIGNsYXNzPVwiYWxpZ25jZW50ZXJcIiBoZWlnaHQ9XCIzMDRcIiB3aWR0aD1cIjUyMFwiIC8+XG4gICAgXCJcIlwiXG4gICAgZXhwZWN0KHV0aWxzLnBhcnNlSW1hZ2VUYWcoZml4dHVyZSkpLnRvRXF1YWxcbiAgICAgIHRpdGxlOiBcIlwiLCBzcmM6IFwic3JjLnBuZ1wiLFxuICAgICAgY2xhc3M6IFwiYWxpZ25jZW50ZXJcIiwgaGVpZ2h0OiBcIjMwNFwiLCB3aWR0aDogXCI1MjBcIlxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIEltYWdlXG4jXG5cbiAgaXQgXCJjaGVjayBpcyBub3QgdmFsaWQgaW1hZ2VcIiwgLT5cbiAgICBmaXh0dXJlID0gXCJbdGV4dF0odXJsKVwiXG4gICAgZXhwZWN0KHV0aWxzLmlzSW1hZ2UoZml4dHVyZSkpLnRvQmUoZmFsc2UpXG5cbiAgaXQgXCJjaGVjayBpcyB2YWxpZCBpbWFnZVwiLCAtPlxuICAgIGZpeHR1cmUgPSBcIiFbXSh1cmwpXCJcbiAgICBleHBlY3QodXRpbHMuaXNJbWFnZShmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgIGZpeHR1cmUgPSAnIVtdKHVybCBcInRpdGxlXCIpJ1xuICAgIGV4cGVjdCh1dGlscy5pc0ltYWdlKGZpeHR1cmUpKS50b0JlKHRydWUpXG4gICAgZml4dHVyZSA9IFwiIVt0ZXh0XSgpXCJcbiAgICBleHBlY3QodXRpbHMuaXNJbWFnZShmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgIGZpeHR1cmUgPSBcIiFbdGV4dF0odXJsKVwiXG4gICAgZXhwZWN0KHV0aWxzLmlzSW1hZ2UoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICBmaXh0dXJlID0gXCIhW3RleHRdKHVybCAndGl0bGUnKVwiXG4gICAgZXhwZWN0KHV0aWxzLmlzSW1hZ2UoZml4dHVyZSkpLnRvQmUodHJ1ZSlcblxuICBpdCBcInBhcnNlIHZhbGlkIGltYWdlXCIsIC0+XG4gICAgZml4dHVyZSA9IFwiIVt0ZXh0XSh1cmwpXCJcbiAgICBleHBlY3QodXRpbHMucGFyc2VJbWFnZShmaXh0dXJlKSkudG9FcXVhbFxuICAgICAgYWx0OiBcInRleHRcIiwgc3JjOiBcInVybFwiLCB0aXRsZTogXCJcIlxuXG4gIGl0IFwiY2hlY2sgaXMgdmFsaWQgaW1hZ2UgZmlsZVwiLCAtPlxuICAgIGZpeHR1cmUgPSBcImZpeHR1cmVzL2FiYy5qcGdcIlxuICAgIGV4cGVjdCh1dGlscy5pc0ltYWdlRmlsZShmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgIGZpeHR1cmUgPSBcImZpeHR1cmVzL2FiYy50eHRcIlxuICAgIGV4cGVjdCh1dGlscy5pc0ltYWdlRmlsZShmaXh0dXJlKSkudG9CZShmYWxzZSlcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBMaW5rXG4jXG5cbiAgZGVzY3JpYmUgXCIuaXNJbmxpbmVMaW5rXCIsIC0+XG4gICAgaXQgXCJjaGVjayBpcyB0ZXh0IGludmFsaWQgaW5saW5lIGxpbmtcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcIiFbdGV4dF0odXJsKVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNJbmxpbmVMaW5rKGZpeHR1cmUpKS50b0JlKGZhbHNlKVxuICAgICAgZml4dHVyZSA9IFwiW3RleHRdW11cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzSW5saW5lTGluayhmaXh0dXJlKSkudG9CZShmYWxzZSlcbiAgICAgIGZpeHR1cmUgPSBcIlshW10oaW1hZ2UucG5nKV1baWRdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc0lubGluZUxpbmsoZml4dHVyZSkpLnRvQmUoZmFsc2UpXG4gICAgICBmaXh0dXJlID0gXCJbIVtpbWFnZSB0aXRsZV0oaW1hZ2UucG5nKV1baWRdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc0lubGluZUxpbmsoZml4dHVyZSkpLnRvQmUoZmFsc2UpXG5cbiAgICBpdCBcImNoZWNrIGlzIHRleHQgdmFsaWQgaW5saW5lIGxpbmtcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcIlt0ZXh0XSgpXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc0lubGluZUxpbmsoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICAgIGZpeHR1cmUgPSBcIlt0ZXh0XSh1cmwpXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc0lubGluZUxpbmsoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICAgIGZpeHR1cmUgPSBcIlt0ZXh0XSh1cmwgdGl0bGUpXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc0lubGluZUxpbmsoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICAgIGZpeHR1cmUgPSBcIlt0ZXh0XSh1cmwgJ3RpdGxlJylcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzSW5saW5lTGluayhmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgICAgIyBsaW5rIGluIGxpbmsgdGV4dCBpcyBpbnZhbGlkIHNlbWFudGljLCBidXQgaXQgY29udGFpbnMgb25lIHZhbGlkIGxpbmtcbiAgICAgIGZpeHR1cmUgPSBcIltbbGlua10oaW5fYW5vdGhlcl9saW5rKV1bXVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNJbmxpbmVMaW5rKGZpeHR1cmUpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImNoZWNrIGlzIGltYWdlIGxpbmsgdmFsaWQgaW5saW5rIGxpbmtcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcIlshW10oaW1hZ2UucG5nKV0odXJsKVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNJbmxpbmVMaW5rKGZpeHR1cmUpKS50b0JlKHRydWUpXG4gICAgICBmaXh0dXJlID0gXCJbIVt0ZXh0XShpbWFnZS5wbmcpXSh1cmwpXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc0lubGluZUxpbmsoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICAgIGZpeHR1cmUgPSBcIlshW3RleHRdKGltYWdlLnBuZyldKHVybCAndGl0bGUnKVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNJbmxpbmVMaW5rKGZpeHR1cmUpKS50b0JlKHRydWUpXG5cbiAgaXQgXCJwYXJzZSB2YWxpZCBpbmxpbmUgbGluayB0ZXh0XCIsIC0+XG4gICAgZml4dHVyZSA9IFwiW3RleHRdKClcIlxuICAgIGV4cGVjdCh1dGlscy5wYXJzZUlubGluZUxpbmsoZml4dHVyZSkpLnRvRXF1YWwoXG4gICAgICB7dGV4dDogXCJ0ZXh0XCIsIHVybDogXCJcIiwgdGl0bGU6IFwiXCJ9KVxuICAgIGZpeHR1cmUgPSBcIlt0ZXh0XSh1cmwpXCJcbiAgICBleHBlY3QodXRpbHMucGFyc2VJbmxpbmVMaW5rKGZpeHR1cmUpKS50b0VxdWFsKFxuICAgICAge3RleHQ6IFwidGV4dFwiLCB1cmw6IFwidXJsXCIsIHRpdGxlOiBcIlwifSlcbiAgICBmaXh0dXJlID0gXCJbdGV4dF0odXJsIHRpdGxlKVwiXG4gICAgZXhwZWN0KHV0aWxzLnBhcnNlSW5saW5lTGluayhmaXh0dXJlKSkudG9FcXVhbChcbiAgICAgIHt0ZXh0OiBcInRleHRcIiwgdXJsOiBcInVybFwiLCB0aXRsZTogXCJ0aXRsZVwifSlcbiAgICBmaXh0dXJlID0gXCJbdGV4dF0odXJsICd0aXRsZScpXCJcbiAgICBleHBlY3QodXRpbHMucGFyc2VJbmxpbmVMaW5rKGZpeHR1cmUpKS50b0VxdWFsKFxuICAgICAge3RleHQ6IFwidGV4dFwiLCB1cmw6IFwidXJsXCIsIHRpdGxlOiBcInRpdGxlXCJ9KVxuXG4gIGl0IFwicGFyc2UgdmFsaWQgaW1hZ2UgdGV4dCBpbmxpbmUgbGlua1wiLCAtPlxuICAgIGZpeHR1cmUgPSBcIlshW10oaW1hZ2UucG5nKV0odXJsKVwiXG4gICAgZXhwZWN0KHV0aWxzLnBhcnNlSW5saW5lTGluayhmaXh0dXJlKSkudG9FcXVhbChcbiAgICAgIHt0ZXh0OiBcIiFbXShpbWFnZS5wbmcpXCIsIHVybDogXCJ1cmxcIiwgdGl0bGU6IFwiXCJ9KVxuICAgIGZpeHR1cmUgPSBcIlshW3RleHRdKGltYWdlLnBuZyldKHVybClcIlxuICAgIGV4cGVjdCh1dGlscy5wYXJzZUlubGluZUxpbmsoZml4dHVyZSkpLnRvRXF1YWwoXG4gICAgICB7dGV4dDogXCIhW3RleHRdKGltYWdlLnBuZylcIiwgdXJsOiBcInVybFwiLCB0aXRsZTogXCJcIn0pXG4gICAgZml4dHVyZSA9IFwiWyFbdGV4dF0oaW1hZ2UucG5nICd0aXRsZScpXSh1cmwgJ3RpdGxlJylcIlxuICAgIGV4cGVjdCh1dGlscy5wYXJzZUlubGluZUxpbmsoZml4dHVyZSkpLnRvRXF1YWwoXG4gICAgICB7dGV4dDogXCIhW3RleHRdKGltYWdlLnBuZyAndGl0bGUnKVwiLCB1cmw6IFwidXJsXCIsIHRpdGxlOiBcInRpdGxlXCJ9KVxuXG4gIGRlc2NyaWJlIFwiLmlzUmVmZXJlbmNlTGlua1wiLCAtPlxuICAgIGl0IFwiY2hlY2sgaXMgdGV4dCBpbnZhbGlkIHJlZmVyZW5jZSBsaW5rXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCIhW3RleHRdKHVybClcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzUmVmZXJlbmNlTGluayhmaXh0dXJlKSkudG9CZShmYWxzZSlcbiAgICAgIGZpeHR1cmUgPSBcIlt0ZXh0XShoYXMpXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1JlZmVyZW5jZUxpbmsoZml4dHVyZSkpLnRvQmUoZmFsc2UpXG4gICAgICBmaXh0dXJlID0gXCJbXVtdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1JlZmVyZW5jZUxpbmsoZml4dHVyZSkpLnRvQmUoZmFsc2UpXG4gICAgICBmaXh0dXJlID0gXCJbIVtdKGltYWdlLnBuZyldW11cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzUmVmZXJlbmNlTGluayhmaXh0dXJlKSkudG9CZShmYWxzZSlcbiAgICAgIGZpeHR1cmUgPSBcIlshW3RleHRdKGltYWdlLnBuZyldW11cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzUmVmZXJlbmNlTGluayhmaXh0dXJlKSkudG9CZShmYWxzZSlcblxuICAgIGl0IFwiY2hlY2sgaXMgdGV4dCB2YWxpZCByZWZlcmVuY2UgbGlua1wiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiW3RleHRdW11cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzUmVmZXJlbmNlTGluayhmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgICAgZml4dHVyZSA9IFwiW3RleHRdW2lkIHdpdGggc3BhY2VdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1JlZmVyZW5jZUxpbmsoZml4dHVyZSkpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiY2hlY2sgaXMgdGV4dCB2YWxpZCBpbWFnZSByZWZlcmVuY2UgbGlua1wiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiWyFbXShpbWFnZS5wbmcpXVtdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1JlZmVyZW5jZUxpbmsoZml4dHVyZSkpLnRvQmUoZmFsc2UpXG4gICAgICBmaXh0dXJlID0gXCJbIVt0ZXh0XShpbWFnZS5wbmcpXVtdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1JlZmVyZW5jZUxpbmsoZml4dHVyZSkpLnRvQmUoZmFsc2UpXG4gICAgICBmaXh0dXJlID0gXCJbIVtdKGltYWdlLnBuZyldW2lkIHdpdGggc3BhY2VdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1JlZmVyZW5jZUxpbmsoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICAgIGZpeHR1cmUgPSBcIlshW3RleHRdKGltYWdlLnBuZyldW2lkIHdpdGggc3BhY2VdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1JlZmVyZW5jZUxpbmsoZml4dHVyZSkpLnRvQmUodHJ1ZSlcblxuICBkZXNjcmliZSBcIi5wYXJzZVJlZmVyZW5jZUxpbmtcIiwgLT5cbiAgICBlZGl0b3IgPSBudWxsXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihcImVtcHR5Lm1hcmtkb3duXCIpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgICAgVHJhbnNmb3JtIHlvdXIgcGxhaW4gW3RleHRdW10gaW50byBzdGF0aWMgd2Vic2l0ZXMgYW5kIGJsb2dzLlxuXG4gICAgICAgIFt0ZXh0XTogaHR0cDovL3d3dy5qZWt5bGwuY29tXG4gICAgICAgIFtpZF06IGh0dHA6Ly9qZWt5bGwuY29tIFwiSmVreWxsIFdlYnNpdGVcIlxuXG4gICAgICAgIE1hcmtkb3duIChvciBUZXh0aWxlKSwgTGlxdWlkLCBIVE1MICYgQ1NTIGdvIGluIFtKZWt5bGxdW2lkXS5cbiAgICAgICAgXCJcIlwiXG5cbiAgICBpdCBcInBhcnNlIHZhbGlkIHJlZmVyZW5jZSBsaW5rIHRleHQgd2l0aG91dCBpZFwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiW3RleHRdW11cIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlUmVmZXJlbmNlTGluayhmaXh0dXJlLCBlZGl0b3IpKS50b0VxdWFsXG4gICAgICAgIGlkOiBcInRleHRcIiwgdGV4dDogXCJ0ZXh0XCIsIHVybDogXCJodHRwOi8vd3d3Lmpla3lsbC5jb21cIiwgdGl0bGU6IFwiXCJcbiAgICAgICAgZGVmaW5pdGlvblJhbmdlOiB7c3RhcnQ6IHtyb3c6IDIsIGNvbHVtbjogMH0sIGVuZDoge3JvdzogMiwgY29sdW1uOiAyOX19XG5cbiAgICBpdCBcInBhcnNlIHZhbGlkIHJlZmVyZW5jZSBsaW5rIHRleHQgd2l0aCBpZFwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiW0pla3lsbF1baWRdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5wYXJzZVJlZmVyZW5jZUxpbmsoZml4dHVyZSwgZWRpdG9yKSkudG9FcXVhbFxuICAgICAgICBpZDogXCJpZFwiLCB0ZXh0OiBcIkpla3lsbFwiLCB1cmw6IFwiaHR0cDovL2pla3lsbC5jb21cIiwgdGl0bGU6IFwiSmVreWxsIFdlYnNpdGVcIlxuICAgICAgICBkZWZpbml0aW9uUmFuZ2U6IHtzdGFydDoge3JvdzogMywgY29sdW1uOiAwfSwgZW5kOiB7cm93OiAzLCBjb2x1bW46IDQwfX1cblxuICAgIGl0IFwicGFyc2Ugb3JwaGFuIHJlZmVyZW5jZSBsaW5rIHRleHRcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcIltKZWt5bGxdW2pla3lsbF1cIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlUmVmZXJlbmNlTGluayhmaXh0dXJlLCBlZGl0b3IpKS50b0VxdWFsXG4gICAgICAgIGlkOiBcImpla3lsbFwiLCB0ZXh0OiBcIkpla3lsbFwiLCB1cmw6IFwiXCIsIHRpdGxlOiBcIlwiLCBkZWZpbml0aW9uUmFuZ2U6IG51bGxcblxuICBkZXNjcmliZSBcIi5pc1JlZmVyZW5jZURlZmluaXRpb25cIiwgLT5cbiAgICBpdCBcImNoZWNrIGlzIHRleHQgaW52YWxpZCByZWZlcmVuY2UgZGVmaW5pdGlvblwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiW3RleHRdIGh0dHBcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzUmVmZXJlbmNlRGVmaW5pdGlvbihmaXh0dXJlKSkudG9CZShmYWxzZSlcbiAgICAgIGZpeHR1cmUgPSBcIltedGV4dF06IGh0dHBcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzUmVmZXJlbmNlRGVmaW5pdGlvbihmaXh0dXJlKSkudG9CZShmYWxzZSlcblxuICAgIGl0IFwiY2hlY2sgaXMgdGV4dCB2YWxpZCByZWZlcmVuY2UgZGVmaW5pdGlvblwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiW3RleHQgdGV4dF06IGh0dHBcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzUmVmZXJlbmNlRGVmaW5pdGlvbihmaXh0dXJlKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJjaGVjayBpcyB0ZXh0IHZhbGlkIHJlZmVyZW5jZSBkZWZpbml0aW9uIHdpdGggdGl0bGVcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcIiAgW3RleHRdOiBodHRwICd0aXRsZSBub3QgaW4gZG91YmxlIHF1b3RlJ1wiXG4gICAgICBleHBlY3QodXRpbHMuaXNSZWZlcmVuY2VEZWZpbml0aW9uKGZpeHR1cmUpKS50b0JlKHRydWUpXG5cbiAgZGVzY3JpYmUgXCIucGFyc2VSZWZlcmVuY2VEZWZpbml0aW9uXCIsIC0+XG4gICAgZWRpdG9yID0gbnVsbFxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oXCJlbXB0eS5tYXJrZG93blwiKVxuICAgICAgcnVucyAtPlxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIFRyYW5zZm9ybSB5b3VyIHBsYWluIFt0ZXh0XVtdIGludG8gc3RhdGljIHdlYnNpdGVzIGFuZCBibG9ncy5cblxuICAgICAgICBbdGV4dF06IGh0dHA6Ly93d3cuamVreWxsLmNvbVxuICAgICAgICBbaWRdOiBodHRwOi8vamVreWxsLmNvbSBcIkpla3lsbCBXZWJzaXRlXCJcblxuICAgICAgICBNYXJrZG93biAob3IgVGV4dGlsZSksIExpcXVpZCwgSFRNTCAmIENTUyBnbyBpbiBbSmVreWxsXVtpZF0uXG4gICAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJwYXJzZSB2YWxpZCByZWZlcmVuY2UgZGVmaW5pdGlvbiB0ZXh0IHdpdGhvdXQgaWRcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcIlt0ZXh0XTogaHR0cDovL3d3dy5qZWt5bGwuY29tXCJcbiAgICAgIGV4cGVjdCh1dGlscy5wYXJzZVJlZmVyZW5jZURlZmluaXRpb24oZml4dHVyZSwgZWRpdG9yKSkudG9FcXVhbFxuICAgICAgICBpZDogXCJ0ZXh0XCIsIHRleHQ6IFwidGV4dFwiLCB1cmw6IFwiaHR0cDovL3d3dy5qZWt5bGwuY29tXCIsIHRpdGxlOiBcIlwiXG4gICAgICAgIGxpbmtSYW5nZToge3N0YXJ0OiB7cm93OiAwLCBjb2x1bW46IDIxfSwgZW5kOiB7cm93OiAwLCBjb2x1bW46IDI5fX1cblxuICAgIGl0IFwicGFyc2UgdmFsaWQgcmVmZXJlbmNlIGRlZmluaXRpb24gdGV4dCB3aXRoIGlkXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJbaWRdOiBodHRwOi8vamVreWxsLmNvbSBcXFwiSmVreWxsIFdlYnNpdGVcXFwiXCJcbiAgICAgIGV4cGVjdCh1dGlscy5wYXJzZVJlZmVyZW5jZURlZmluaXRpb24oZml4dHVyZSwgZWRpdG9yKSkudG9FcXVhbFxuICAgICAgICBpZDogXCJpZFwiLCB0ZXh0OiBcIkpla3lsbFwiLCB1cmw6IFwiaHR0cDovL2pla3lsbC5jb21cIiwgdGl0bGU6IFwiSmVreWxsIFdlYnNpdGVcIlxuICAgICAgICBsaW5rUmFuZ2U6IHtzdGFydDoge3JvdzogNSwgY29sdW1uOiA0OH0sIGVuZDoge3JvdzogNSwgY29sdW1uOiA2MH19XG5cbiAgICBpdCBcInBhcnNlIG9ycGhhbiByZWZlcmVuY2UgZGVmaW5pdGlvbiB0ZXh0XCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJbamVreWxsXTogaHR0cDovL2pla3lsbC5jb20gXFxcIkpla3lsbCBXZWJzaXRlXFxcIlwiXG4gICAgICBleHBlY3QodXRpbHMucGFyc2VSZWZlcmVuY2VEZWZpbml0aW9uKGZpeHR1cmUsIGVkaXRvcikpLnRvRXF1YWxcbiAgICAgICAgaWQ6IFwiamVreWxsXCIsIHRleHQ6IFwiXCIsIHVybDogXCJodHRwOi8vamVreWxsLmNvbVwiLCB0aXRsZTogXCJKZWt5bGwgV2Vic2l0ZVwiLFxuICAgICAgICBsaW5rUmFuZ2U6IG51bGxcblxuICBkZXNjcmliZSBcIi5pc0Zvb3Rub3RlXCIsIC0+XG4gICAgaXQgXCJjaGVjayBpcyB0ZXh0IGludmFsaWQgZm9vdG5vdGVcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcIlt0ZXh0XVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNGb290bm90ZShmaXh0dXJlKSkudG9CZShmYWxzZSlcbiAgICAgIGZpeHR1cmUgPSBcIiFbYWJjXVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNGb290bm90ZShmaXh0dXJlKSkudG9CZShmYWxzZSlcblxuICAgIGl0IFwiY2hlY2sgaXMgdGV4dCB2YWxpZCBmb290bm90ZVwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiW14xXVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNGb290bm90ZShmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgICAgZml4dHVyZSA9IFwiW150ZXh0XVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNGb290bm90ZShmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgICAgZml4dHVyZSA9IFwiW150ZXh0IHRleHRdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc0Zvb3Rub3RlKGZpeHR1cmUpKS50b0JlKHRydWUpXG4gICAgICBmaXh0dXJlID0gXCJbXjEyXTpcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzRm9vdG5vdGUoZml4dHVyZSkpLnRvQmUodHJ1ZSlcblxuICBkZXNjcmliZSBcIi5wYXJzZUZvb3Rub3RlXCIsIC0+XG4gICAgaXQgXCJwYXJzZSB2YWxpZCBmb290bm90ZVwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiW14xXVwiXG4gICAgICBleHBlY3QodXRpbHMucGFyc2VGb290bm90ZShmaXh0dXJlKSkudG9FcXVhbChsYWJlbDogXCIxXCIsIGNvbnRlbnQ6IFwiXCIsIGlzRGVmaW5pdGlvbjogZmFsc2UpXG4gICAgICBmaXh0dXJlID0gXCJbXnRleHRdOiBcIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlRm9vdG5vdGUoZml4dHVyZSkpLnRvRXF1YWwobGFiZWw6IFwidGV4dFwiLCBjb250ZW50OiBcIlwiLCBpc0RlZmluaXRpb246IHRydWUpXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgVGFibGVcbiNcblxuICBkZXNjcmliZSBcIi5pc1RhYmxlU2VwYXJhdG9yXCIsIC0+XG4gICAgaXQgXCJjaGVjayBpcyB0YWJsZSBzZXBhcmF0b3JcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcIi0tLS18XCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1RhYmxlU2VwYXJhdG9yKGZpeHR1cmUpKS50b0JlKGZhbHNlKVxuXG4gICAgICBmaXh0dXJlID0gXCJ8LS18XCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1RhYmxlU2VwYXJhdG9yKGZpeHR1cmUpKS50b0JlKHRydWUpXG4gICAgICBmaXh0dXJlID0gXCItLXwtLVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNUYWJsZVNlcGFyYXRvcihmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgICAgZml4dHVyZSA9IFwiLS0tLSB8LS0tLS0tIHwgLS0tXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1RhYmxlU2VwYXJhdG9yKGZpeHR1cmUpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImNoZWNrIGlzIHRhYmxlIHNlcGFyYXRvciB3aXRoIGV4dHJhIHBpcGVzXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJ8LS0tLS1cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvQmUoZmFsc2UpXG5cbiAgICAgIGZpeHR1cmUgPSBcInwtLXwtLVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNUYWJsZVNlcGFyYXRvcihmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgICAgZml4dHVyZSA9IFwifC0tLS0gfC0tLS0tLSB8IC0tLXxcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiY2hlY2sgaXMgdGFibGUgc2VwYXJhdG9yIHdpdGggZm9ybWF0XCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCI6LS0gIHw6Oi0tLVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNUYWJsZVNlcGFyYXRvcihmaXh0dXJlKSkudG9CZShmYWxzZSlcblxuICAgICAgZml4dHVyZSA9IFwifDotLS06IHxcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICAgIGZpeHR1cmUgPSBcIjotLXwtLTpcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICAgIGZpeHR1cmUgPSBcInw6LS0tOiB8Oi0tLS0tIHwgLS06IHxcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvQmUodHJ1ZSlcblxuICBkZXNjcmliZSBcIi5wYXJzZVRhYmxlU2VwYXJhdG9yXCIsIC0+XG4gICAgaXQgXCJwYXJzZSB0YWJsZSBzZXBhcmF0b3JcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcInwtLS0tfFwiXG4gICAgICBleHBlY3QodXRpbHMucGFyc2VUYWJsZVNlcGFyYXRvcihmaXh0dXJlKSkudG9FcXVhbCh7XG4gICAgICAgIHNlcGFyYXRvcjogdHJ1ZVxuICAgICAgICBleHRyYVBpcGVzOiB0cnVlXG4gICAgICAgIGFsaWdubWVudHM6IFtcImVtcHR5XCJdXG4gICAgICAgIGNvbHVtbnM6IFtcIi0tLS1cIl1cbiAgICAgICAgY29sdW1uV2lkdGhzOiBbNF19KVxuXG4gICAgICBmaXh0dXJlID0gXCItLXwtLVwiXG4gICAgICBleHBlY3QodXRpbHMucGFyc2VUYWJsZVNlcGFyYXRvcihmaXh0dXJlKSkudG9FcXVhbCh7XG4gICAgICAgIHNlcGFyYXRvcjogdHJ1ZVxuICAgICAgICBleHRyYVBpcGVzOiBmYWxzZVxuICAgICAgICBhbGlnbm1lbnRzOiBbXCJlbXB0eVwiLCBcImVtcHR5XCJdXG4gICAgICAgIGNvbHVtbnM6IFtcIi0tXCIsIFwiLS1cIl1cbiAgICAgICAgY29sdW1uV2lkdGhzOiBbMiwgMl19KVxuXG4gICAgICBmaXh0dXJlID0gXCItLS0tIHwtLS0tLS0gfCAtLS1cIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvRXF1YWwoe1xuICAgICAgICBzZXBhcmF0b3I6IHRydWVcbiAgICAgICAgZXh0cmFQaXBlczogZmFsc2VcbiAgICAgICAgYWxpZ25tZW50czogW1wiZW1wdHlcIiwgXCJlbXB0eVwiLCBcImVtcHR5XCJdXG4gICAgICAgIGNvbHVtbnM6IFtcIi0tLS1cIiwgXCItLS0tLS1cIiwgXCItLS1cIl1cbiAgICAgICAgY29sdW1uV2lkdGhzOiBbNCwgNiwgM119KVxuXG4gICAgaXQgXCJwYXJzZSB0YWJsZSBzZXBhcmF0b3Igd2l0aCBleHRyYSBwaXBlc1wiLCAtPlxuICAgICAgZml4dHVyZSA9IFwifC0tfC0tXCJcbiAgICAgIGV4cGVjdCh1dGlscy5wYXJzZVRhYmxlU2VwYXJhdG9yKGZpeHR1cmUpKS50b0VxdWFsKHtcbiAgICAgICAgc2VwYXJhdG9yOiB0cnVlXG4gICAgICAgIGV4dHJhUGlwZXM6IHRydWVcbiAgICAgICAgYWxpZ25tZW50czogW1wiZW1wdHlcIiwgXCJlbXB0eVwiXVxuICAgICAgICBjb2x1bW5zOiBbXCItLVwiLCBcIi0tXCJdXG4gICAgICAgIGNvbHVtbldpZHRoczogWzIsIDJdfSlcblxuICAgICAgZml4dHVyZSA9IFwifC0tLS0gfC0tLS0tLSB8IC0tLXxcIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvRXF1YWwoe1xuICAgICAgICBzZXBhcmF0b3I6IHRydWVcbiAgICAgICAgZXh0cmFQaXBlczogdHJ1ZVxuICAgICAgICBhbGlnbm1lbnRzOiBbXCJlbXB0eVwiLCBcImVtcHR5XCIsIFwiZW1wdHlcIl1cbiAgICAgICAgY29sdW1uczogW1wiLS0tLVwiLCBcIi0tLS0tLVwiLCBcIi0tLVwiXVxuICAgICAgICBjb2x1bW5XaWR0aHM6IFs0LCA2LCAzXX0pXG5cbiAgICBpdCBcInBhcnNlIHRhYmxlIHNlcGFyYXRvciB3aXRoIGZvcm1hdFwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiOi18LTp8OjpcIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvRXF1YWwoe1xuICAgICAgICBzZXBhcmF0b3I6IHRydWVcbiAgICAgICAgZXh0cmFQaXBlczogZmFsc2VcbiAgICAgICAgYWxpZ25tZW50czogW1wibGVmdFwiLCBcInJpZ2h0XCIsIFwiY2VudGVyXCJdXG4gICAgICAgIGNvbHVtbnM6IFtcIjotXCIsIFwiLTpcIiwgXCI6OlwiXVxuICAgICAgICBjb2x1bW5XaWR0aHM6IFsyLCAyLCAyXX0pXG5cbiAgICAgIGZpeHR1cmUgPSBcIjotLXwtLTpcIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvRXF1YWwoe1xuICAgICAgICBzZXBhcmF0b3I6IHRydWVcbiAgICAgICAgZXh0cmFQaXBlczogZmFsc2VcbiAgICAgICAgYWxpZ25tZW50czogW1wibGVmdFwiLCBcInJpZ2h0XCJdXG4gICAgICAgIGNvbHVtbnM6IFtcIjotLVwiLCBcIi0tOlwiXVxuICAgICAgICBjb2x1bW5XaWR0aHM6IFszLCAzXX0pXG5cbiAgICAgIGZpeHR1cmUgPSBcInw6LS0tOiB8Oi0tLS0tIHwgLS06IHxcIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvRXF1YWwoe1xuICAgICAgICBzZXBhcmF0b3I6IHRydWVcbiAgICAgICAgZXh0cmFQaXBlczogdHJ1ZVxuICAgICAgICBhbGlnbm1lbnRzOiBbXCJjZW50ZXJcIiwgXCJsZWZ0XCIsIFwicmlnaHRcIl1cbiAgICAgICAgY29sdW1uczogW1wiOi0tLTpcIiwgXCI6LS0tLS1cIiwgXCItLTpcIl1cbiAgICAgICAgY29sdW1uV2lkdGhzOiBbNSwgNiwgM119KVxuXG4gIGRlc2NyaWJlIFwiLmlzVGFibGVSb3dcIiwgLT5cbiAgICBpdCBcImNoZWNrIHRhYmxlIHNlcGFyYXRvciBpcyBhIHRhYmxlIHJvd1wiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiOi0tICB8Oi0tLVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNUYWJsZVJvdyhmaXh0dXJlKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJjaGVjayBpcyB0YWJsZSByb3dcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcInwgZW1wdHkgY29udGVudCB8XCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1RhYmxlUm93KGZpeHR1cmUpKS50b0JlKHRydWUpXG4gICAgICBmaXh0dXJlID0gXCJhYmN8ZmVnXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1RhYmxlUm93KGZpeHR1cmUpKS50b0JlKHRydWUpXG4gICAgICBmaXh0dXJlID0gXCJ8ICAgYWJjIHxlZmcgfCB8XCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1RhYmxlUm93KGZpeHR1cmUpKS50b0JlKHRydWUpXG5cbiAgZGVzY3JpYmUgXCIucGFyc2VUYWJsZVJvd1wiLCAtPlxuICAgIGl0IFwicGFyc2UgdGFibGUgc2VwYXJhdG9yIGJ5IHRhYmxlIHJvdyBcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcInw6LS0tOiB8Oi0tLS0tIHwgLS06IHxcIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlVGFibGVSb3coZml4dHVyZSkpLnRvRXF1YWwoe1xuICAgICAgICBzZXBhcmF0b3I6IHRydWVcbiAgICAgICAgZXh0cmFQaXBlczogdHJ1ZVxuICAgICAgICBhbGlnbm1lbnRzOiBbXCJjZW50ZXJcIiwgXCJsZWZ0XCIsIFwicmlnaHRcIl1cbiAgICAgICAgY29sdW1uczogW1wiOi0tLTpcIiwgXCI6LS0tLS1cIiwgXCItLTpcIl1cbiAgICAgICAgY29sdW1uV2lkdGhzOiBbNSwgNiwgM119KVxuXG4gICAgaXQgXCJwYXJzZSB0YWJsZSByb3cgXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJ8IOS4reaWhyB8XCJcbiAgICAgIGV4cGVjdCh1dGlscy5wYXJzZVRhYmxlUm93KGZpeHR1cmUpKS50b0VxdWFsKHtcbiAgICAgICAgc2VwYXJhdG9yOiBmYWxzZVxuICAgICAgICBleHRyYVBpcGVzOiB0cnVlXG4gICAgICAgIGNvbHVtbnM6IFtcIuS4reaWh1wiXVxuICAgICAgICBjb2x1bW5XaWR0aHM6IFs0XX0pXG5cbiAgICAgIGZpeHR1cmUgPSBcImFiY3xmZWdcIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlVGFibGVSb3coZml4dHVyZSkpLnRvRXF1YWwoe1xuICAgICAgICBzZXBhcmF0b3I6IGZhbHNlXG4gICAgICAgIGV4dHJhUGlwZXM6IGZhbHNlXG4gICAgICAgIGNvbHVtbnM6IFtcImFiY1wiLCBcImZlZ1wiXVxuICAgICAgICBjb2x1bW5XaWR0aHM6IFszLCAzXX0pXG5cbiAgICAgIGZpeHR1cmUgPSBcInwgICBhYmMgfGVmZyB8IHxcIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlVGFibGVSb3coZml4dHVyZSkpLnRvRXF1YWwoe1xuICAgICAgICBzZXBhcmF0b3I6IGZhbHNlXG4gICAgICAgIGV4dHJhUGlwZXM6IHRydWVcbiAgICAgICAgY29sdW1uczogW1wiYWJjXCIsIFwiZWZnXCIsIFwiXCJdXG4gICAgICAgIGNvbHVtbldpZHRoczogWzMsIDMsIDBdfSlcblxuICBpdCBcImNyZWF0ZSB0YWJsZSBzZXBhcmF0b3JcIiwgLT5cbiAgICByb3cgPSB1dGlscy5jcmVhdGVUYWJsZVNlcGFyYXRvcihcbiAgICAgIG51bU9mQ29sdW1uczogMywgZXh0cmFQaXBlczogZmFsc2UsIGNvbHVtbldpZHRoOiAxLCBhbGlnbm1lbnQ6IFwiZW1wdHlcIilcbiAgICBleHBlY3Qocm93KS50b0VxdWFsKFwiLS18LS0tfC0tXCIpXG5cbiAgICByb3cgPSB1dGlscy5jcmVhdGVUYWJsZVNlcGFyYXRvcihcbiAgICAgIG51bU9mQ29sdW1uczogMiwgZXh0cmFQaXBlczogdHJ1ZSwgY29sdW1uV2lkdGg6IDEsIGFsaWdubWVudDogXCJlbXB0eVwiKVxuICAgIGV4cGVjdChyb3cpLnRvRXF1YWwoXCJ8LS0tfC0tLXxcIilcblxuICAgIHJvdyA9IHV0aWxzLmNyZWF0ZVRhYmxlU2VwYXJhdG9yKFxuICAgICAgbnVtT2ZDb2x1bW5zOiAxLCBleHRyYVBpcGVzOiB0cnVlLCBjb2x1bW5XaWR0aDogMSwgYWxpZ25tZW50OiBcImxlZnRcIilcbiAgICBleHBlY3Qocm93KS50b0VxdWFsKFwifDotLXxcIilcblxuICAgIHJvdyA9IHV0aWxzLmNyZWF0ZVRhYmxlU2VwYXJhdG9yKFxuICAgICAgbnVtT2ZDb2x1bW5zOiAzLCBleHRyYVBpcGVzOiB0cnVlLCBjb2x1bW5XaWR0aHM6IFsyLCAzLCAzXSxcbiAgICAgIGFsaWdubWVudDogXCJsZWZ0XCIpXG4gICAgZXhwZWN0KHJvdykudG9FcXVhbChcInw6LS0tfDotLS0tfDotLS0tfFwiKVxuXG4gICAgcm93ID0gdXRpbHMuY3JlYXRlVGFibGVTZXBhcmF0b3IoXG4gICAgICBudW1PZkNvbHVtbnM6IDQsIGV4dHJhUGlwZXM6IGZhbHNlLCBjb2x1bW5XaWR0aDogMyxcbiAgICAgIGFsaWdubWVudDogXCJsZWZ0XCIsIGFsaWdubWVudHM6IFtcImVtcHR5XCIsIFwicmlnaHRcIiwgXCJjZW50ZXJcIl0pXG4gICAgZXhwZWN0KHJvdykudG9FcXVhbChcIi0tLS18LS0tLTp8Oi0tLTp8Oi0tLVwiKVxuXG4gIGl0IFwiY3JlYXRlIGVtcHR5IHRhYmxlIHJvd1wiLCAtPlxuICAgIHJvdyA9IHV0aWxzLmNyZWF0ZVRhYmxlUm93KFtdLFxuICAgICAgbnVtT2ZDb2x1bW5zOiAzLCBjb2x1bW5XaWR0aDogMSwgYWxpZ25tZW50OiBcImVtcHR5XCIpXG4gICAgZXhwZWN0KHJvdykudG9FcXVhbChcIiAgfCAgIHwgIFwiKVxuXG4gICAgcm93ID0gdXRpbHMuY3JlYXRlVGFibGVSb3coW10sXG4gICAgICBudW1PZkNvbHVtbnM6IDMsIGV4dHJhUGlwZXM6IHRydWUsIGNvbHVtbldpZHRoczogWzEsIDIsIDNdLFxuICAgICAgYWxpZ25tZW50OiBcImVtcHR5XCIpXG4gICAgZXhwZWN0KHJvdykudG9FcXVhbChcInwgICB8ICAgIHwgICAgIHxcIilcblxuICBpdCBcImNyZWF0ZSB0YWJsZSByb3dcIiwgLT5cbiAgICByb3cgPSB1dGlscy5jcmVhdGVUYWJsZVJvdyhbXCLkuK3mlodcIiwgXCJFbmdsaXNoXCJdLFxuICAgICAgbnVtT2ZDb2x1bW5zOiAyLCBleHRyYVBpcGVzOiB0cnVlLCBjb2x1bW5XaWR0aHM6IFs0LCA3XSlcbiAgICBleHBlY3Qocm93KS50b0VxdWFsKFwifCDkuK3mlocgfCBFbmdsaXNoIHxcIilcblxuICAgIHJvdyA9IHV0aWxzLmNyZWF0ZVRhYmxlUm93KFtcIuS4reaWh1wiLCBcIkVuZ2xpc2hcIl0sXG4gICAgICBudW1PZkNvbHVtbnM6IDIsIGNvbHVtbldpZHRoczogWzgsIDEwXSwgYWxpZ25tZW50czogW1wicmlnaHRcIiwgXCJjZW50ZXJcIl0pXG4gICAgZXhwZWN0KHJvdykudG9FcXVhbChcIiAgICDkuK3mlocgfCAgRW5nbGlzaCAgXCIpXG5cbiAgaXQgXCJjcmVhdGUgYW4gZW1wdHkgdGFibGVcIiwgLT5cbiAgICByb3dzID0gW11cblxuICAgIG9wdGlvbnMgPVxuICAgICAgbnVtT2ZDb2x1bW5zOiAzLCBjb2x1bW5XaWR0aHM6IFs0LCAxLCA0XSxcbiAgICAgIGFsaWdubWVudHM6IFtcImxlZnRcIiwgXCJjZW50ZXJcIiwgXCJyaWdodFwiXVxuXG4gICAgcm93cy5wdXNoKHV0aWxzLmNyZWF0ZVRhYmxlUm93KFtdLCBvcHRpb25zKSlcbiAgICByb3dzLnB1c2godXRpbHMuY3JlYXRlVGFibGVTZXBhcmF0b3Iob3B0aW9ucykpXG4gICAgcm93cy5wdXNoKHV0aWxzLmNyZWF0ZVRhYmxlUm93KFtdLCBvcHRpb25zKSlcblxuICAgIGV4cGVjdChyb3dzKS50b0VxdWFsKFtcbiAgICAgIFwiICAgICB8ICAgfCAgICAgXCJcbiAgICAgIFwiOi0tLS18Oi06fC0tLS06XCJcbiAgICAgIFwiICAgICB8ICAgfCAgICAgXCJcbiAgICBdKVxuXG4gIGl0IFwiY3JlYXRlIGFuIGVtcHR5IHRhYmxlIHdpdGggZXh0cmEgcGlwZXNcIiwgLT5cbiAgICByb3dzID0gW11cblxuICAgIG9wdGlvbnMgPVxuICAgICAgbnVtT2ZDb2x1bW5zOiAzLCBleHRyYVBpcGVzOiB0cnVlLFxuICAgICAgY29sdW1uV2lkdGg6IDEsIGFsaWdubWVudDogXCJlbXB0eVwiXG5cbiAgICByb3dzLnB1c2godXRpbHMuY3JlYXRlVGFibGVSb3coW10sIG9wdGlvbnMpKVxuICAgIHJvd3MucHVzaCh1dGlscy5jcmVhdGVUYWJsZVNlcGFyYXRvcihvcHRpb25zKSlcbiAgICByb3dzLnB1c2godXRpbHMuY3JlYXRlVGFibGVSb3coW10sIG9wdGlvbnMpKVxuXG4gICAgZXhwZWN0KHJvd3MpLnRvRXF1YWwoW1xuICAgICAgXCJ8ICAgfCAgIHwgICB8XCJcbiAgICAgIFwifC0tLXwtLS18LS0tfFwiXG4gICAgICBcInwgICB8ICAgfCAgIHxcIlxuICAgIF0pXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgVVJMXG4jXG5cbiAgaXQgXCJjaGVjayBpcyB1cmxcIiwgLT5cbiAgICBmaXh0dXJlID0gXCJodHRwczovL2dpdGh1Yi5jb20vemh1b2NodW4vbWQtd3JpdGVyXCJcbiAgICBleHBlY3QodXRpbHMuaXNVcmwoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICBmaXh0dXJlID0gXCIvVXNlcnMvemh1b2NodW4vbWQtd3JpdGVyXCJcbiAgICBleHBlY3QodXRpbHMuaXNVcmwoZml4dHVyZSkpLnRvQmUoZmFsc2UpXG5cbiAgaXQgXCJub3JtYWxpemUgZmlsZSBwYXRoXCIsIC0+XG4gICAgZml4dHVyZSA9IFwiaHR0cHM6Ly9naXRodWIuY29tL3podW9jaHVuL21kLXdyaXRlclwiXG4gICAgZXhwZWN0KHV0aWxzLm5vcm1hbGl6ZUZpbGVQYXRoKGZpeHR1cmUpKS50b0VxdWFsKGZpeHR1cmUpXG5cbiAgICBmaXh0dXJlID0gXCJcXFxcZ2l0aHViLmNvbVxcXFx6aHVvY2h1blxcXFxtZC13cml0ZXIuZ2lmXCJcbiAgICBleHBlY3RlZCA9IFwiL2dpdGh1Yi5jb20vemh1b2NodW4vbWQtd3JpdGVyLmdpZlwiXG4gICAgZXhwZWN0KHV0aWxzLm5vcm1hbGl6ZUZpbGVQYXRoKGZpeHR1cmUpKS50b0VxdWFsKGV4cGVjdGVkKVxuICAgIGV4cGVjdCh1dGlscy5ub3JtYWxpemVGaWxlUGF0aChleHBlY3RlZCkpLnRvRXF1YWwoZXhwZWN0ZWQpXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgQXRvbSBUZXh0RWRpdG9yXG4jXG4iXX0=
