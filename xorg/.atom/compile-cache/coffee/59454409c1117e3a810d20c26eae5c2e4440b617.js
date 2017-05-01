(function() {
  var $, FOOTNOTE_REGEX, FOOTNOTE_TEST_REGEX, IMG_EXTENSIONS, IMG_OR_TEXT, IMG_REGEX, IMG_TAG_ATTRIBUTE, IMG_TAG_REGEX, INLINE_LINK_REGEX, INLINE_LINK_TEST_REGEX, LINK_ID, OPEN_TAG, REFERENCE_DEF_REGEX, REFERENCE_DEF_REGEX_OF, REFERENCE_LINK_REGEX, REFERENCE_LINK_REGEX_OF, REFERENCE_LINK_TEST_REGEX, SLUGIZE_CONTROL_REGEX, SLUGIZE_SPECIAL_REGEX, TABLE_ONE_COLUMN_ROW_REGEX, TABLE_ONE_COLUMN_SEPARATOR_REGEX, TABLE_ROW_REGEX, TABLE_SEPARATOR_REGEX, TEMPLATE_REGEX, UNTEMPLATE_REGEX, URL_AND_TITLE, URL_REGEX, cleanDiacritics, createTableRow, createTableSeparator, createUntemplateMatcher, escapeRegExp, findLinkInRange, getAbsolutePath, getBufferRangeForScope, getDate, getHomedir, getJSON, getPackagePath, getProjectPath, getScopeDescriptor, getSitePath, getTextBufferRange, incrementChars, isFootnote, isImage, isImageFile, isImageTag, isInlineLink, isReferenceDefinition, isReferenceLink, isTableRow, isTableSeparator, isUpperCase, isUrl, normalizeFilePath, os, parseDate, parseFootnote, parseImage, parseImageTag, parseInlineLink, parseReferenceDefinition, parseReferenceLink, parseTableRow, parseTableSeparator, path, setTabIndex, slugize, template, untemplate, wcswidth,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = require("atom-space-pen-views").$;

  os = require("os");

  path = require("path");

  wcswidth = require("wcwidth");

  getJSON = function(uri, succeed, error) {
    if (uri.length === 0) {
      return error();
    }
    return $.getJSON(uri).done(succeed).fail(error);
  };

  escapeRegExp = function(str) {
    if (!str) {
      return "";
    }
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  };

  isUpperCase = function(str) {
    if (str.length > 0) {
      return str[0] >= 'A' && str[0] <= 'Z';
    } else {
      return false;
    }
  };

  incrementChars = function(str) {
    var carry, chars, index, lowerCase, nextCharCode, upperCase;
    if (str.length < 1) {
      return "a";
    }
    upperCase = isUpperCase(str);
    if (upperCase) {
      str = str.toLowerCase();
    }
    chars = str.split("");
    carry = 1;
    index = chars.length - 1;
    while (carry !== 0 && index >= 0) {
      nextCharCode = chars[index].charCodeAt() + carry;
      if (nextCharCode > "z".charCodeAt()) {
        chars[index] = "a";
        index -= 1;
        carry = 1;
        lowerCase = 1;
      } else {
        chars[index] = String.fromCharCode(nextCharCode);
        carry = 0;
      }
    }
    if (carry === 1) {
      chars.unshift("a");
    }
    str = chars.join("");
    if (upperCase) {
      return str.toUpperCase();
    } else {
      return str;
    }
  };

  cleanDiacritics = function(str) {
    var from, to;
    if (!str) {
      return "";
    }
    from = "ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșšŝťțŭùúüűûñÿýçżźž";
    to = "aaaaaaaaaccceeeeeghiiiijllnnoooooooossssttuuuuuunyyczzz";
    from += from.toUpperCase();
    to += to.toUpperCase();
    to = to.split("");
    from += "ß";
    to.push('ss');
    return str.replace(/.{1}/g, function(c) {
      var index;
      index = from.indexOf(c);
      if (index === -1) {
        return c;
      } else {
        return to[index];
      }
    });
  };

  SLUGIZE_CONTROL_REGEX = /[\u0000-\u001f]/g;

  SLUGIZE_SPECIAL_REGEX = /[\s~`!@#\$%\^&\*\(\)\-_\+=\[\]\{\}\|\\;:"'<>,\.\?\/]+/g;

  slugize = function(str, separator) {
    var escapedSep;
    if (separator == null) {
      separator = '-';
    }
    if (!str) {
      return "";
    }
    escapedSep = escapeRegExp(separator);
    return cleanDiacritics(str).trim().toLowerCase().replace(SLUGIZE_CONTROL_REGEX, '').replace(SLUGIZE_SPECIAL_REGEX, separator).replace(new RegExp(escapedSep + '{2,}', 'g'), separator).replace(new RegExp('^' + escapedSep + '+|' + escapedSep + '+$', 'g'), '');
  };

  getPackagePath = function() {
    var segments;
    segments = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    segments.unshift(atom.packages.resolvePackagePath("markdown-writer"));
    return path.join.apply(null, segments);
  };

  getProjectPath = function() {
    var paths;
    paths = atom.project.getPaths();
    if (paths && paths.length > 0) {
      return paths[0];
    } else {
      return atom.config.get("core.projectHome");
    }
  };

  getSitePath = function(configPath) {
    return getAbsolutePath(configPath || getProjectPath());
  };

  getHomedir = function() {
    var env, home, user;
    if (typeof os.homedir === "function") {
      return os.homedir();
    }
    env = process.env;
    home = env.HOME;
    user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;
    if (process.platform === "win32") {
      return env.USERPROFILE || env.HOMEDRIVE + env.HOMEPATH || home;
    } else if (process.platform === "darwin") {
      return home || (user ? "/Users/" + user : void 0);
    } else if (process.platform === "linux") {
      return home || (process.getuid() === 0 ? "/root" : void 0) || (user ? "/home/" + user : void 0);
    } else {
      return home;
    }
  };

  getAbsolutePath = function(path) {
    var home;
    home = getHomedir();
    if (home) {
      return path.replace(/^~($|\/|\\)/, home + '$1');
    } else {
      return path;
    }
  };

  setTabIndex = function(elems) {
    var elem, i, j, len1, results1;
    results1 = [];
    for (i = j = 0, len1 = elems.length; j < len1; i = ++j) {
      elem = elems[i];
      results1.push(elem[0].tabIndex = i + 1);
    }
    return results1;
  };

  TEMPLATE_REGEX = /[\<\{]([\w\.\-]+?)[\>\}]/g;

  UNTEMPLATE_REGEX = /(?:\<|\\\{)([\w\.\-]+?)(?:\>|\\\})/g;

  template = function(text, data, matcher) {
    if (matcher == null) {
      matcher = TEMPLATE_REGEX;
    }
    return text.replace(matcher, function(match, attr) {
      if (data[attr] != null) {
        return data[attr];
      } else {
        return match;
      }
    });
  };

  untemplate = function(text, matcher) {
    var keys;
    if (matcher == null) {
      matcher = UNTEMPLATE_REGEX;
    }
    keys = [];
    text = escapeRegExp(text).replace(matcher, function(match, attr) {
      keys.push(attr);
      if (["year"].indexOf(attr) !== -1) {
        return "(\\d{4})";
      } else if (["month", "day", "hour", "minute", "second"].indexOf(attr) !== -1) {
        return "(\\d{2})";
      } else if (["i_month", "i_day", "i_hour", "i_minute", "i_second"].indexOf(attr) !== -1) {
        return "(\\d{1,2})";
      } else if (["extension"].indexOf(attr) !== -1) {
        return "(\\.\\w+)";
      } else {
        return "([\\s\\S]+)";
      }
    });
    return createUntemplateMatcher(keys, RegExp("^" + text + "$"));
  };

  createUntemplateMatcher = function(keys, regex) {
    return function(str) {
      var matches, results;
      if (!str) {
        return;
      }
      matches = regex.exec(str);
      if (!matches) {
        return;
      }
      results = {
        "_": matches[0]
      };
      keys.forEach(function(key, idx) {
        return results[key] = matches[idx + 1];
      });
      return results;
    };
  };

  parseDate = function(hash) {
    var date, key, map, value, values;
    date = new Date();
    map = {
      setYear: ["year"],
      setMonth: ["month", "i_month"],
      setDate: ["day", "i_day"],
      setHours: ["hour", "i_hour"],
      setMinutes: ["minute", "i_minute"],
      setSeconds: ["second", "i_second"]
    };
    for (key in map) {
      values = map[key];
      value = values.find(function(val) {
        return !!hash[val];
      });
      if (value) {
        value = parseInt(hash[value], 10);
        if (key === 'setMonth') {
          value = value - 1;
        }
        date[key](value);
      }
    }
    return getDate(date);
  };

  getDate = function(date) {
    if (date == null) {
      date = new Date();
    }
    return {
      year: "" + date.getFullYear(),
      month: ("0" + (date.getMonth() + 1)).slice(-2),
      day: ("0" + date.getDate()).slice(-2),
      hour: ("0" + date.getHours()).slice(-2),
      minute: ("0" + date.getMinutes()).slice(-2),
      second: ("0" + date.getSeconds()).slice(-2),
      i_month: "" + (date.getMonth() + 1),
      i_day: "" + date.getDate(),
      i_hour: "" + date.getHours(),
      i_minute: "" + date.getMinutes(),
      i_second: "" + date.getSeconds()
    };
  };

  IMG_TAG_REGEX = /<img(.*?)\/?>/i;

  IMG_TAG_ATTRIBUTE = /([a-z]+?)=('|")(.*?)\2/ig;

  isImageTag = function(input) {
    return IMG_TAG_REGEX.test(input);
  };

  parseImageTag = function(input) {
    var attributes, img, pattern;
    img = {};
    attributes = IMG_TAG_REGEX.exec(input)[1].match(IMG_TAG_ATTRIBUTE);
    pattern = RegExp("" + IMG_TAG_ATTRIBUTE.source, "i");
    attributes.forEach(function(attr) {
      var elem;
      elem = pattern.exec(attr);
      if (elem) {
        return img[elem[1]] = elem[3];
      }
    });
    return img;
  };

  URL_AND_TITLE = /(\S*?)(?: +["'\\(]?(.*?)["'\\)]?)?/.source;

  IMG_OR_TEXT = /(!\[.*?\]\(.+?\)|[^\[]+?)/.source;

  OPEN_TAG = /(?:^|[^!])(?=\[)/.source;

  LINK_ID = /[^\[\]]+/.source;

  IMG_REGEX = RegExp("!\\[(.*?)\\]\\(" + URL_AND_TITLE + "\\)");

  isImage = function(input) {
    return IMG_REGEX.test(input);
  };

  parseImage = function(input) {
    var image;
    image = IMG_REGEX.exec(input);
    if (image && image.length >= 2) {
      return {
        alt: image[1],
        src: image[2],
        title: image[3] || ""
      };
    } else {
      return {
        alt: input,
        src: "",
        title: ""
      };
    }
  };

  IMG_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".ico"];

  isImageFile = function(file) {
    var ref;
    return file && (ref = path.extname(file).toLowerCase(), indexOf.call(IMG_EXTENSIONS, ref) >= 0);
  };

  INLINE_LINK_REGEX = RegExp("\\[" + IMG_OR_TEXT + "\\]\\(" + URL_AND_TITLE + "\\)");

  INLINE_LINK_TEST_REGEX = RegExp("" + OPEN_TAG + INLINE_LINK_REGEX.source);

  isInlineLink = function(input) {
    return INLINE_LINK_TEST_REGEX.test(input);
  };

  parseInlineLink = function(input) {
    var link;
    link = INLINE_LINK_REGEX.exec(input);
    if (link && link.length >= 2) {
      return {
        text: link[1],
        url: link[2],
        title: link[3] || ""
      };
    } else {
      return {
        text: input,
        url: "",
        title: ""
      };
    }
  };

  REFERENCE_LINK_REGEX_OF = function(id, opts) {
    if (opts == null) {
      opts = {};
    }
    if (!opts.noEscape) {
      id = escapeRegExp(id);
    }
    return RegExp("\\[(" + id + ")\\] ?\\[\\]|\\[" + IMG_OR_TEXT + "\\] ?\\[(" + id + ")\\]");
  };

  REFERENCE_DEF_REGEX_OF = function(id, opts) {
    if (opts == null) {
      opts = {};
    }
    if (!opts.noEscape) {
      id = escapeRegExp(id);
    }
    return RegExp("^ *\\[(" + id + ")\\]: +" + URL_AND_TITLE + "$", "m");
  };

  REFERENCE_LINK_REGEX = REFERENCE_LINK_REGEX_OF(LINK_ID, {
    noEscape: true
  });

  REFERENCE_LINK_TEST_REGEX = RegExp("" + OPEN_TAG + REFERENCE_LINK_REGEX.source);

  REFERENCE_DEF_REGEX = REFERENCE_DEF_REGEX_OF(LINK_ID, {
    noEscape: true
  });

  isReferenceLink = function(input) {
    return REFERENCE_LINK_TEST_REGEX.test(input);
  };

  parseReferenceLink = function(input, editor) {
    var def, id, link, text;
    link = REFERENCE_LINK_REGEX.exec(input);
    text = link[2] || link[1];
    id = link[3] || link[1];
    def = void 0;
    editor && editor.buffer.scan(REFERENCE_DEF_REGEX_OF(id), function(match) {
      return def = match;
    });
    if (def) {
      return {
        id: id,
        text: text,
        url: def.match[2],
        title: def.match[3] || "",
        definitionRange: def.range
      };
    } else {
      return {
        id: id,
        text: text,
        url: "",
        title: "",
        definitionRange: null
      };
    }
  };

  isReferenceDefinition = function(input) {
    var def;
    def = REFERENCE_DEF_REGEX.exec(input);
    return !!def && def[1][0] !== "^";
  };

  parseReferenceDefinition = function(input, editor) {
    var def, id, link;
    def = REFERENCE_DEF_REGEX.exec(input);
    id = def[1];
    link = void 0;
    editor && editor.buffer.scan(REFERENCE_LINK_REGEX_OF(id), function(match) {
      return link = match;
    });
    if (link) {
      return {
        id: id,
        text: link.match[2] || link.match[1],
        url: def[2],
        title: def[3] || "",
        linkRange: link.range
      };
    } else {
      return {
        id: id,
        text: "",
        url: def[2],
        title: def[3] || "",
        linkRange: null
      };
    }
  };

  FOOTNOTE_REGEX = /\[\^(.+?)\](:)?/;

  FOOTNOTE_TEST_REGEX = RegExp("" + OPEN_TAG + FOOTNOTE_REGEX.source);

  isFootnote = function(input) {
    return FOOTNOTE_TEST_REGEX.test(input);
  };

  parseFootnote = function(input) {
    var footnote;
    footnote = FOOTNOTE_REGEX.exec(input);
    return {
      label: footnote[1],
      isDefinition: footnote[2] === ":",
      content: ""
    };
  };

  TABLE_SEPARATOR_REGEX = /^(\|)?((?:\s*(?:-+|:-*:|:-*|-*:)\s*\|)+(?:\s*(?:-+|:-*:|:-*|-*:)\s*))(\|)?$/;

  TABLE_ONE_COLUMN_SEPARATOR_REGEX = /^(\|)(\s*:?-+:?\s*)(\|)$/;

  isTableSeparator = function(line) {
    line = line.trim();
    return TABLE_SEPARATOR_REGEX.test(line) || TABLE_ONE_COLUMN_SEPARATOR_REGEX.test(line);
  };

  parseTableSeparator = function(line) {
    var columns, matches;
    line = line.trim();
    matches = TABLE_SEPARATOR_REGEX.exec(line) || TABLE_ONE_COLUMN_SEPARATOR_REGEX.exec(line);
    columns = matches[2].split("|").map(function(col) {
      return col.trim();
    });
    return {
      separator: true,
      extraPipes: !!(matches[1] || matches[matches.length - 1]),
      columns: columns,
      columnWidths: columns.map(function(col) {
        return col.length;
      }),
      alignments: columns.map(function(col) {
        var head, tail;
        head = col[0] === ":";
        tail = col[col.length - 1] === ":";
        if (head && tail) {
          return "center";
        } else if (head) {
          return "left";
        } else if (tail) {
          return "right";
        } else {
          return "empty";
        }
      })
    };
  };

  TABLE_ROW_REGEX = /^(\|)?(.+?\|.+?)(\|)?$/;

  TABLE_ONE_COLUMN_ROW_REGEX = /^(\|)(.+?)(\|)$/;

  isTableRow = function(line) {
    line = line.trimRight();
    return TABLE_ROW_REGEX.test(line) || TABLE_ONE_COLUMN_ROW_REGEX.test(line);
  };

  parseTableRow = function(line) {
    var columns, matches;
    if (isTableSeparator(line)) {
      return parseTableSeparator(line);
    }
    line = line.trimRight();
    matches = TABLE_ROW_REGEX.exec(line) || TABLE_ONE_COLUMN_ROW_REGEX.exec(line);
    columns = matches[2].split("|").map(function(col) {
      return col.trim();
    });
    return {
      separator: false,
      extraPipes: !!(matches[1] || matches[matches.length - 1]),
      columns: columns,
      columnWidths: columns.map(function(col) {
        return wcswidth(col);
      })
    };
  };

  createTableSeparator = function(options) {
    var columnWidth, i, j, ref, row;
    if (options.columnWidths == null) {
      options.columnWidths = [];
    }
    if (options.alignments == null) {
      options.alignments = [];
    }
    row = [];
    for (i = j = 0, ref = options.numOfColumns - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      columnWidth = options.columnWidths[i] || options.columnWidth;
      if (!options.extraPipes && (i === 0 || i === options.numOfColumns - 1)) {
        columnWidth += 1;
      } else {
        columnWidth += 2;
      }
      switch (options.alignments[i] || options.alignment) {
        case "center":
          row.push(":" + "-".repeat(columnWidth - 2) + ":");
          break;
        case "left":
          row.push(":" + "-".repeat(columnWidth - 1));
          break;
        case "right":
          row.push("-".repeat(columnWidth - 1) + ":");
          break;
        default:
          row.push("-".repeat(columnWidth));
      }
    }
    row = row.join("|");
    if (options.extraPipes) {
      return "|" + row + "|";
    } else {
      return row;
    }
  };

  createTableRow = function(columns, options) {
    var columnWidth, i, j, len, ref, row;
    if (options.columnWidths == null) {
      options.columnWidths = [];
    }
    if (options.alignments == null) {
      options.alignments = [];
    }
    row = [];
    for (i = j = 0, ref = options.numOfColumns - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      columnWidth = options.columnWidths[i] || options.columnWidth;
      if (!columns[i]) {
        row.push(" ".repeat(columnWidth));
        continue;
      }
      len = columnWidth - wcswidth(columns[i]);
      if (len < 0) {
        throw new Error("Column width " + columnWidth + " - wcswidth('" + columns[i] + "') cannot be " + len);
      }
      switch (options.alignments[i] || options.alignment) {
        case "center":
          row.push(" ".repeat(len / 2) + columns[i] + " ".repeat((len + 1) / 2));
          break;
        case "left":
          row.push(columns[i] + " ".repeat(len));
          break;
        case "right":
          row.push(" ".repeat(len) + columns[i]);
          break;
        default:
          row.push(columns[i] + " ".repeat(len));
      }
    }
    row = row.join(" | ");
    if (options.extraPipes) {
      return "| " + row + " |";
    } else {
      return row;
    }
  };

  URL_REGEX = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/i;

  isUrl = function(url) {
    return URL_REGEX.test(url);
  };

  normalizeFilePath = function(path) {
    return path.split(/[\\\/]/).join('/');
  };

  getScopeDescriptor = function(cursor, scopeSelector) {
    var scopes;
    scopes = cursor.getScopeDescriptor().getScopesArray().filter(function(scope) {
      return scope.indexOf(scopeSelector) >= 0;
    });
    if (scopes.indexOf(scopeSelector) >= 0) {
      return scopeSelector;
    } else if (scopes.length > 0) {
      return scopes[0];
    }
  };

  getBufferRangeForScope = function(editor, cursor, scopeSelector) {
    var pos, range;
    pos = cursor.getBufferPosition();
    range = editor.bufferRangeForScopeAtPosition(scopeSelector, pos);
    if (range) {
      return range;
    }
    if (!cursor.isAtBeginningOfLine()) {
      range = editor.bufferRangeForScopeAtPosition(scopeSelector, [pos.row, pos.column - 1]);
      if (range) {
        return range;
      }
    }
    if (!cursor.isAtEndOfLine()) {
      range = editor.bufferRangeForScopeAtPosition(scopeSelector, [pos.row, pos.column + 1]);
      if (range) {
        return range;
      }
    }
  };

  getTextBufferRange = function(editor, scopeSelector, selection, opts) {
    var cursor, scope, selectBy, wordRegex;
    if (opts == null) {
      opts = {};
    }
    if (typeof selection === "object") {
      opts = selection;
      selection = void 0;
    }
    if (selection == null) {
      selection = editor.getLastSelection();
    }
    cursor = selection.cursor;
    selectBy = opts["selectBy"] || "nearestWord";
    if (selection.getText()) {
      return selection.getBufferRange();
    } else if (scope = getScopeDescriptor(cursor, scopeSelector)) {
      return getBufferRangeForScope(editor, cursor, scope);
    } else if (selectBy === "nearestWord") {
      wordRegex = cursor.wordRegExp({
        includeNonWordCharacters: false
      });
      return cursor.getCurrentWordBufferRange({
        wordRegex: wordRegex
      });
    } else if (selectBy === "currentLine") {
      return cursor.getCurrentLineBufferRange();
    } else {
      return selection.getBufferRange();
    }
  };

  findLinkInRange = function(editor, range) {
    var link, selection;
    selection = editor.getTextInRange(range);
    if (selection === "") {
      return;
    }
    if (isUrl(selection)) {
      return {
        text: "",
        url: selection,
        title: ""
      };
    }
    if (isInlineLink(selection)) {
      return parseInlineLink(selection);
    }
    if (isReferenceLink(selection)) {
      link = parseReferenceLink(selection, editor);
      link.linkRange = range;
      return link;
    } else if (isReferenceDefinition(selection)) {
      selection = editor.lineTextForBufferRow(range.start.row);
      range = editor.bufferRangeForBufferRow(range.start.row);
      link = parseReferenceDefinition(selection, editor);
      link.definitionRange = range;
      return link;
    }
  };

  module.exports = {
    getJSON: getJSON,
    escapeRegExp: escapeRegExp,
    isUpperCase: isUpperCase,
    incrementChars: incrementChars,
    slugize: slugize,
    normalizeFilePath: normalizeFilePath,
    getPackagePath: getPackagePath,
    getProjectPath: getProjectPath,
    getSitePath: getSitePath,
    getHomedir: getHomedir,
    getAbsolutePath: getAbsolutePath,
    setTabIndex: setTabIndex,
    template: template,
    untemplate: untemplate,
    getDate: getDate,
    parseDate: parseDate,
    isImageTag: isImageTag,
    parseImageTag: parseImageTag,
    isImage: isImage,
    parseImage: parseImage,
    isInlineLink: isInlineLink,
    parseInlineLink: parseInlineLink,
    isReferenceLink: isReferenceLink,
    parseReferenceLink: parseReferenceLink,
    isReferenceDefinition: isReferenceDefinition,
    parseReferenceDefinition: parseReferenceDefinition,
    isFootnote: isFootnote,
    parseFootnote: parseFootnote,
    isTableSeparator: isTableSeparator,
    parseTableSeparator: parseTableSeparator,
    createTableSeparator: createTableSeparator,
    isTableRow: isTableRow,
    parseTableRow: parseTableRow,
    createTableRow: createTableRow,
    isUrl: isUrl,
    isImageFile: isImageFile,
    getTextBufferRange: getTextBufferRange,
    findLinkInRange: findLinkInRange
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvcmlkZGxlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdXRpbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxpcENBQUE7SUFBQTs7O0VBQUMsSUFBSyxPQUFBLENBQVEsc0JBQVI7O0VBQ04sRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxRQUFBLEdBQVcsT0FBQSxDQUFRLFNBQVI7O0VBTVgsT0FBQSxHQUFVLFNBQUMsR0FBRCxFQUFNLE9BQU4sRUFBZSxLQUFmO0lBQ1IsSUFBa0IsR0FBRyxDQUFDLE1BQUosS0FBYyxDQUFoQztBQUFBLGFBQU8sS0FBQSxDQUFBLEVBQVA7O1dBQ0EsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxHQUFWLENBQWMsQ0FBQyxJQUFmLENBQW9CLE9BQXBCLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEM7RUFGUTs7RUFJVixZQUFBLEdBQWUsU0FBQyxHQUFEO0lBQ2IsSUFBQSxDQUFpQixHQUFqQjtBQUFBLGFBQU8sR0FBUDs7V0FDQSxHQUFHLENBQUMsT0FBSixDQUFZLHdCQUFaLEVBQXNDLE1BQXRDO0VBRmE7O0VBSWYsV0FBQSxHQUFjLFNBQUMsR0FBRDtJQUNaLElBQUcsR0FBRyxDQUFDLE1BQUosR0FBYSxDQUFoQjthQUF3QixHQUFJLENBQUEsQ0FBQSxDQUFKLElBQVUsR0FBVixJQUFpQixHQUFJLENBQUEsQ0FBQSxDQUFKLElBQVUsSUFBbkQ7S0FBQSxNQUFBO2FBQ0ssTUFETDs7RUFEWTs7RUFLZCxjQUFBLEdBQWlCLFNBQUMsR0FBRDtBQUNmLFFBQUE7SUFBQSxJQUFjLEdBQUcsQ0FBQyxNQUFKLEdBQWEsQ0FBM0I7QUFBQSxhQUFPLElBQVA7O0lBRUEsU0FBQSxHQUFZLFdBQUEsQ0FBWSxHQUFaO0lBQ1osSUFBMkIsU0FBM0I7TUFBQSxH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SUFrQ0EsYUFBQSxFQUFlLGFBbENmO0lBb0NBLGdCQUFBLEVBQWtCLGdCQXBDbEI7SUFxQ0EsbUJBQUEsRUFBcUIsbUJBckNyQjtJQXNDQSxvQkFBQSxFQUFzQixvQkF0Q3RCO0lBdUNBLFVBQUEsRUFBWSxVQXZDWjtJQXdDQSxhQUFBLEVBQWUsYUF4Q2Y7SUF5Q0EsY0FBQSxFQUFnQixjQXpDaEI7SUEyQ0EsS0FBQSxFQUFPLEtBM0NQO0lBNENBLFdBQUEsRUFBYSxXQTVDYjtJQThDQSxrQkFBQSxFQUFvQixrQkE5Q3BCO0lBK0NBLGVBQUEsRUFBaUIsZUEvQ2pCOztBQTFvQkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7JH0gPSByZXF1aXJlIFwiYXRvbS1zcGFjZS1wZW4tdmlld3NcIlxub3MgPSByZXF1aXJlIFwib3NcIlxucGF0aCA9IHJlcXVpcmUgXCJwYXRoXCJcbndjc3dpZHRoID0gcmVxdWlyZSBcIndjd2lkdGhcIlxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIEdlbmVyYWwgVXRpbHNcbiNcblxuZ2V0SlNPTiA9ICh1cmksIHN1Y2NlZWQsIGVycm9yKSAtPlxuICByZXR1cm4gZXJyb3IoKSBpZiB1cmkubGVuZ3RoID09IDBcbiAgJC5nZXRKU09OKHVyaSkuZG9uZShzdWNjZWVkKS5mYWlsKGVycm9yKVxuXG5lc2NhcGVSZWdFeHAgPSAoc3RyKSAtPlxuICByZXR1cm4gXCJcIiB1bmxlc3Mgc3RyXG4gIHN0ci5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csIFwiXFxcXCQmXCIpXG5cbmlzVXBwZXJDYXNlID0gKHN0cikgLT5cbiAgaWYgc3RyLmxlbmd0aCA+IDAgdGhlbiAoc3RyWzBdID49ICdBJyAmJiBzdHJbMF0gPD0gJ1onKVxuICBlbHNlIGZhbHNlXG5cbiMgaW5jcmVtZW50IHRoZSBjaGFyczogYSAtPiBiLCB6IC0+IGFhLCBheiAtPiBiYVxuaW5jcmVtZW50Q2hhcnMgPSAoc3RyKSAtPlxuICByZXR1cm4gXCJhXCIgaWYgc3RyLmxlbmd0aCA8IDFcblxuICB1cHBlckNhc2UgPSBpc1VwcGVyQ2FzZShzdHIpXG4gIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpIGlmIHVwcGVyQ2FzZVxuXG4gIGNoYXJzID0gc3RyLnNwbGl0KFwiXCIpXG4gIGNhcnJ5ID0gMVxuICBpbmRleCA9IGNoYXJzLmxlbmd0aCAtIDFcblxuICB3aGlsZSBjYXJyeSAhPSAwICYmIGluZGV4ID49IDBcbiAgICBuZXh0Q2hhckNvZGUgPSBjaGFyc1tpbmRleF0uY2hhckNvZGVBdCgpICsgY2FycnlcblxuICAgIGlmIG5leHRDaGFyQ29kZSA+IFwielwiLmNoYXJDb2RlQXQoKVxuICAgICAgY2hhcnNbaW5kZXhdID0gXCJhXCJcbiAgICAgIGluZGV4IC09IDFcbiAgICAgIGNhcnJ5ID0gMVxuICAgICAgbG93ZXJDYXNlID0gMVxuICAgIGVsc2VcbiAgICAgIGNoYXJzW2luZGV4XSA9IFN0cmluZy5mcm9tQ2hhckNvZGUobmV4dENoYXJDb2RlKVxuICAgICAgY2FycnkgPSAwXG5cbiAgY2hhcnMudW5zaGlmdChcImFcIikgaWYgY2FycnkgPT0gMVxuXG4gIHN0ciA9IGNoYXJzLmpvaW4oXCJcIilcbiAgaWYgdXBwZXJDYXNlIHRoZW4gc3RyLnRvVXBwZXJDYXNlKCkgZWxzZSBzdHJcblxuIyBodHRwczovL2dpdGh1Yi5jb20vZXBlbGkvdW5kZXJzY29yZS5zdHJpbmcvYmxvYi9tYXN0ZXIvY2xlYW5EaWFjcml0aWNzLmpzXG5jbGVhbkRpYWNyaXRpY3MgPSAoc3RyKSAtPlxuICByZXR1cm4gXCJcIiB1bmxlc3Mgc3RyXG5cbiAgZnJvbSA9IFwixIXDoMOhw6TDosOjw6XDpsSDxIfEjcSJxJnDqMOpw6vDqsSdxKXDrMOtw6/DrsS1xYLEvsWExYjDssOzw7bFkcO0w7XDsMO4xZvImcWhxZ3Fpcibxa3DucO6w7zFscO7w7HDv8O9w6fFvMW6xb5cIlxuICB0byA9IFwiYWFhYWFhYWFhY2NjZWVlZWVnaGlpaWlqbGxubm9vb29vb29vc3Nzc3R0dXV1dXV1bnl5Y3p6elwiXG5cbiAgZnJvbSArPSBmcm9tLnRvVXBwZXJDYXNlKClcbiAgdG8gKz0gdG8udG9VcHBlckNhc2UoKVxuXG4gIHRvID0gdG8uc3BsaXQoXCJcIilcblxuICAjIGZvciB0b2tlbnMgcmVxdWlyZWluZyBtdWx0aXRva2VuIG91dHB1dFxuICBmcm9tICs9IFwiw59cIlxuICB0by5wdXNoKCdzcycpXG5cbiAgc3RyLnJlcGxhY2UgLy57MX0vZywgKGMpIC0+XG4gICAgaW5kZXggPSBmcm9tLmluZGV4T2YoYylcbiAgICBpZiBpbmRleCA9PSAtMSB0aGVuIGMgZWxzZSB0b1tpbmRleF1cblxuU0xVR0laRV9DT05UUk9MX1JFR0VYID0gL1tcXHUwMDAwLVxcdTAwMWZdL2dcblNMVUdJWkVfU1BFQ0lBTF9SRUdFWCA9IC9bXFxzfmAhQCNcXCQlXFxeJlxcKlxcKFxcKVxcLV9cXCs9XFxbXFxdXFx7XFx9XFx8XFxcXDs6XCInPD4sXFwuXFw/XFwvXSsvZ1xuXG4jIGh0dHBzOi8vZ2l0aHViLmNvbS9oZXhvanMvaGV4by11dGlsL2Jsb2IvbWFzdGVyL2xpYi9zbHVnaXplLmpzXG5zbHVnaXplID0gKHN0ciwgc2VwYXJhdG9yID0gJy0nKSAtPlxuICByZXR1cm4gXCJcIiB1bmxlc3Mgc3RyXG5cbiAgZXNjYXBlZFNlcCA9IGVzY2FwZVJlZ0V4cChzZXBhcmF0b3IpXG5cbiAgY2xlYW5EaWFjcml0aWNzKHN0cikudHJpbSgpLnRvTG93ZXJDYXNlKClcbiAgICAjIFJlbW92ZSBjb250cm9sIGNoYXJhY3RlcnNcbiAgICAucmVwbGFjZShTTFVHSVpFX0NPTlRST0xfUkVHRVgsICcnKVxuICAgICMgUmVwbGFjZSBzcGVjaWFsIGNoYXJhY3RlcnNcbiAgICAucmVwbGFjZShTTFVHSVpFX1NQRUNJQUxfUkVHRVgsIHNlcGFyYXRvcilcbiAgICAjIFJlbW92ZSBjb250aW5vdXMgc2VwYXJhdG9yc1xuICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoZXNjYXBlZFNlcCArICd7Mix9JywgJ2cnKSwgc2VwYXJhdG9yKVxuICAgICMgUmVtb3ZlIHByZWZpeGluZyBhbmQgdHJhaWxpbmcgc2VwYXJ0b3JzXG4gICAgLnJlcGxhY2UobmV3IFJlZ0V4cCgnXicgKyBlc2NhcGVkU2VwICsgJyt8JyArIGVzY2FwZWRTZXAgKyAnKyQnLCAnZycpLCAnJylcblxuZ2V0UGFja2FnZVBhdGggPSAoc2VnbWVudHMuLi4pIC0+XG4gIHNlZ21lbnRzLnVuc2hpZnQoYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoXCJtYXJrZG93bi13cml0ZXJcIikpXG4gIHBhdGguam9pbi5hcHBseShudWxsLCBzZWdtZW50cylcblxuZ2V0UHJvamVjdFBhdGggPSAtPlxuICBwYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpXG4gIGlmIHBhdGhzICYmIHBhdGhzLmxlbmd0aCA+IDBcbiAgICBwYXRoc1swXVxuICBlbHNlICMgR2l2ZSB0aGUgdXNlciBhIHBhdGggaWYgdGhlcmUncyBubyBwcm9qZWN0IHBhdGhzLlxuICAgIGF0b20uY29uZmlnLmdldChcImNvcmUucHJvamVjdEhvbWVcIilcblxuZ2V0U2l0ZVBhdGggPSAoY29uZmlnUGF0aCkgLT5cbiAgZ2V0QWJzb2x1dGVQYXRoKGNvbmZpZ1BhdGggfHwgZ2V0UHJvamVjdFBhdGgoKSlcblxuIyBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL29zLWhvbWVkaXIvYmxvYi9tYXN0ZXIvaW5kZXguanNcbmdldEhvbWVkaXIgPSAtPlxuICByZXR1cm4gb3MuaG9tZWRpcigpIGlmIHR5cGVvZihvcy5ob21lZGlyKSA9PSBcImZ1bmN0aW9uXCJcblxuICBlbnYgPSBwcm9jZXNzLmVudlxuICBob21lID0gZW52LkhPTUVcbiAgdXNlciA9IGVudi5MT0dOQU1FIHx8IGVudi5VU0VSIHx8IGVudi5MTkFNRSB8fCBlbnYuVVNFUk5BTUVcblxuICBpZiBwcm9jZXNzLnBsYXRmb3JtID09IFwid2luMzJcIlxuICAgIGVudi5VU0VSUFJPRklMRSB8fCBlbnYuSE9NRURSSVZFICsgZW52LkhPTUVQQVRIIHx8IGhvbWVcbiAgZWxzZSBpZiBwcm9jZXNzLnBsYXRmb3JtID09IFwiZGFyd2luXCJcbiAgICBob21lIHx8IChcIi9Vc2Vycy9cIiArIHVzZXIgaWYgdXNlcilcbiAgZWxzZSBpZiBwcm9jZXNzLnBsYXRmb3JtID09IFwibGludXhcIlxuICAgIGhvbWUgfHwgKFwiL3Jvb3RcIiBpZiBwcm9jZXNzLmdldHVpZCgpID09IDApIHx8IChcIi9ob21lL1wiICsgdXNlciBpZiB1c2VyKVxuICBlbHNlXG4gICAgaG9tZVxuXG4jIEJhc2ljYWxseSBleHBhbmQgfi8gdG8gaG9tZSBkaXJlY3RvcnlcbiMgaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy91bnRpbGRpZnkvYmxvYi9tYXN0ZXIvaW5kZXguanNcbmdldEFic29sdXRlUGF0aCA9IChwYXRoKSAtPlxuICBob21lID0gZ2V0SG9tZWRpcigpXG4gIGlmIGhvbWUgdGhlbiBwYXRoLnJlcGxhY2UoL15+KCR8XFwvfFxcXFwpLywgaG9tZSArICckMScpIGVsc2UgcGF0aFxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIEdlbmVyYWwgVmlldyBIZWxwZXJzXG4jXG5cbnNldFRhYkluZGV4ID0gKGVsZW1zKSAtPlxuICBlbGVtWzBdLnRhYkluZGV4ID0gaSArIDEgZm9yIGVsZW0sIGkgaW4gZWxlbXNcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBUZW1wbGF0ZVxuI1xuXG5URU1QTEFURV9SRUdFWCA9IC8vL1xuICBbXFw8XFx7XSAgICAgICAgIyBzdGFydCB3aXRoIDwgb3Ige1xuICAoW1xcd1xcLlxcLV0rPykgICMgYW55IHJlYXNvbmFibGUgd29yZHMsIC0gb3IgLlxuICBbXFw+XFx9XSAgICAgICAgIyBlbmQgd2l0aCA+IG9yIH1cbiAgLy8vZ1xuXG5VTlRFTVBMQVRFX1JFR0VYID0gLy8vXG4gICg/OlxcPHxcXFxcXFx7KSAgICMgc3RhcnQgd2l0aCA8IG9yIFxce1xuICAoW1xcd1xcLlxcLV0rPykgICMgYW55IHJlYXNvbmFibGUgd29yZHMsIC0gb3IgLlxuICAoPzpcXD58XFxcXFxcfSkgICAjIGVuZCB3aXRoID4gb3IgXFx9XG4gIC8vL2dcblxudGVtcGxhdGUgPSAodGV4dCwgZGF0YSwgbWF0Y2hlciA9IFRFTVBMQVRFX1JFR0VYKSAtPlxuICB0ZXh0LnJlcGxhY2UgbWF0Y2hlciwgKG1hdGNoLCBhdHRyKSAtPlxuICAgIGlmIGRhdGFbYXR0cl0/IHRoZW4gZGF0YVthdHRyXSBlbHNlIG1hdGNoXG5cbiMgUmV0dXJuIGEgZnVuY3Rpb24gdGhhdCByZXZlcnNlIHBhcnNlIHRoZSB0ZW1wbGF0ZSwgZS5nLlxuI1xuIyBQYXNzIGB1bnRlbXBsYXRlKFwie3llYXJ9LXttb250aH1cIilgIHJldHVybnMgYSBmdW5jdGlvbiBgZm5gLCB0aGF0IGBmbihcIjIwMTUtMTFcIikgIyA9PiB7IF86IFwiMjAxNS0xMVwiLCB5ZWFyOiAyMDE1LCBtb250aDogMTEgfWBcbiNcbnVudGVtcGxhdGUgPSAodGV4dCwgbWF0Y2hlciA9IFVOVEVNUExBVEVfUkVHRVgpIC0+XG4gIGtleXMgPSBbXVxuXG4gIHRleHQgPSBlc2NhcGVSZWdFeHAodGV4dCkucmVwbGFjZSBtYXRjaGVyLCAobWF0Y2gsIGF0dHIpIC0+XG4gICAga2V5cy5wdXNoKGF0dHIpXG4gICAgaWYgW1wieWVhclwiXS5pbmRleE9mKGF0dHIpICE9IC0xIHRoZW4gXCIoXFxcXGR7NH0pXCJcbiAgICBlbHNlIGlmIFtcIm1vbnRoXCIsIFwiZGF5XCIsIFwiaG91clwiLCBcIm1pbnV0ZVwiLCBcInNlY29uZFwiXS5pbmRleE9mKGF0dHIpICE9IC0xIHRoZW4gXCIoXFxcXGR7Mn0pXCJcbiAgICBlbHNlIGlmIFtcImlfbW9udGhcIiwgXCJpX2RheVwiLCBcImlfaG91clwiLCBcImlfbWludXRlXCIsIFwiaV9zZWNvbmRcIl0uaW5kZXhPZihhdHRyKSAhPSAtMSB0aGVuIFwiKFxcXFxkezEsMn0pXCJcbiAgICBlbHNlIGlmIFtcImV4dGVuc2lvblwiXS5pbmRleE9mKGF0dHIpICE9IC0xIHRoZW4gXCIoXFxcXC5cXFxcdyspXCJcbiAgICBlbHNlIFwiKFtcXFxcc1xcXFxTXSspXCJcblxuICBjcmVhdGVVbnRlbXBsYXRlTWF0Y2hlcihrZXlzLCAvLy8gXiAje3RleHR9ICQgLy8vKVxuXG5jcmVhdGVVbnRlbXBsYXRlTWF0Y2hlciA9IChrZXlzLCByZWdleCkgLT5cbiAgKHN0cikgLT5cbiAgICByZXR1cm4gdW5sZXNzIHN0clxuXG4gICAgbWF0Y2hlcyA9IHJlZ2V4LmV4ZWMoc3RyKVxuICAgIHJldHVybiB1bmxlc3MgbWF0Y2hlc1xuXG4gICAgcmVzdWx0cyA9IHsgXCJfXCIgOiBtYXRjaGVzWzBdIH1cbiAgICBrZXlzLmZvckVhY2ggKGtleSwgaWR4KSAtPiByZXN1bHRzW2tleV0gPSBtYXRjaGVzW2lkeCArIDFdXG4gICAgcmVzdWx0c1xuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIERhdGUgYW5kIFRpbWVcbiNcblxucGFyc2VEYXRlID0gKGhhc2gpIC0+XG4gIGRhdGUgPSBuZXcgRGF0ZSgpXG5cbiAgbWFwID1cbiAgICBzZXRZZWFyOiBbXCJ5ZWFyXCJdXG4gICAgc2V0TW9udGg6IFtcIm1vbnRoXCIsIFwiaV9tb250aFwiXVxuICAgIHNldERhdGU6IFtcImRheVwiLCBcImlfZGF5XCJdXG4gICAgc2V0SG91cnM6IFtcImhvdXJcIiwgXCJpX2hvdXJcIl1cbiAgICBzZXRNaW51dGVzOiBbXCJtaW51dGVcIiwgXCJpX21pbnV0ZVwiXVxuICAgIHNldFNlY29uZHM6IFtcInNlY29uZFwiLCBcImlfc2Vjb25kXCJdXG5cbiAgZm9yIGtleSwgdmFsdWVzIG9mIG1hcFxuICAgIHZhbHVlID0gdmFsdWVzLmZpbmQgKHZhbCkgLT4gISFoYXNoW3ZhbF1cbiAgICBpZiB2YWx1ZVxuICAgICAgdmFsdWUgPSBwYXJzZUludChoYXNoW3ZhbHVlXSwgMTApXG4gICAgICB2YWx1ZSA9IHZhbHVlIC0gMSBpZiBrZXkgPT0gJ3NldE1vbnRoJ1xuICAgICAgZGF0ZVtrZXldKHZhbHVlKVxuXG4gIGdldERhdGUoZGF0ZSlcblxuZ2V0RGF0ZSA9IChkYXRlID0gbmV3IERhdGUoKSkgLT5cbiAgeWVhcjogXCJcIiArIGRhdGUuZ2V0RnVsbFllYXIoKVxuICAjIHdpdGggcHJlcGVuZGVkIDBcbiAgbW9udGg6IChcIjBcIiArIChkYXRlLmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpXG4gIGRheTogKFwiMFwiICsgZGF0ZS5nZXREYXRlKCkpLnNsaWNlKC0yKVxuICBob3VyOiAoXCIwXCIgKyBkYXRlLmdldEhvdXJzKCkpLnNsaWNlKC0yKVxuICBtaW51dGU6IChcIjBcIiArIGRhdGUuZ2V0TWludXRlcygpKS5zbGljZSgtMilcbiAgc2Vjb25kOiAoXCIwXCIgKyBkYXRlLmdldFNlY29uZHMoKSkuc2xpY2UoLTIpXG4gICMgd2l0aG91dCBwcmVwZW5kIDBcbiAgaV9tb250aDogXCJcIiArIChkYXRlLmdldE1vbnRoKCkgKyAxKVxuICBpX2RheTogXCJcIiArIGRhdGUuZ2V0RGF0ZSgpXG4gIGlfaG91cjogXCJcIiArIGRhdGUuZ2V0SG91cnMoKVxuICBpX21pbnV0ZTogXCJcIiArIGRhdGUuZ2V0TWludXRlcygpXG4gIGlfc2Vjb25kOiBcIlwiICsgZGF0ZS5nZXRTZWNvbmRzKClcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBJbWFnZSBIVE1MIFRhZ1xuI1xuXG5JTUdfVEFHX1JFR0VYID0gLy8vIDxpbWcgKC4qPylcXC8/PiAvLy9pXG5JTUdfVEFHX0FUVFJJQlVURSA9IC8vLyAoW2Etel0rPyk9KCd8XCIpKC4qPylcXDIgLy8vaWdcblxuIyBEZXRlY3QgaXQgaXMgYSBIVE1MIGltYWdlIHRhZ1xuaXNJbWFnZVRhZyA9IChpbnB1dCkgLT4gSU1HX1RBR19SRUdFWC50ZXN0KGlucHV0KVxucGFyc2VJbWFnZVRhZyA9IChpbnB1dCkgLT5cbiAgaW1nID0ge31cbiAgYXR0cmlidXRlcyA9IElNR19UQUdfUkVHRVguZXhlYyhpbnB1dClbMV0ubWF0Y2goSU1HX1RBR19BVFRSSUJVVEUpXG4gIHBhdHRlcm4gPSAvLy8gI3tJTUdfVEFHX0FUVFJJQlVURS5zb3VyY2V9IC8vL2lcbiAgYXR0cmlidXRlcy5mb3JFYWNoIChhdHRyKSAtPlxuICAgIGVsZW0gPSBwYXR0ZXJuLmV4ZWMoYXR0cilcbiAgICBpbWdbZWxlbVsxXV0gPSBlbGVtWzNdIGlmIGVsZW1cbiAgcmV0dXJuIGltZ1xuXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgU29tZSBzaGFyZWQgcmVnZXggYmFzaWNzXG4jXG5cbiMgW3VybHx1cmwgXCJ0aXRsZVwiXVxuVVJMX0FORF9USVRMRSA9IC8vL1xuICAoXFxTKj8pICAgICAgICAgICAgICAgICAgIyBhIHVybFxuICAoPzpcbiAgICBcXCArICAgICAgICAgICAgICAgICAgICMgc3BhY2VzXG4gICAgW1wiJ1xcXFwoXT8oLio/KVtcIidcXFxcKV0/ICMgcXVvdGVkIHRpdGxlXG4gICk/ICAgICAgICAgICAgICAgICAgICAgICMgbWlnaHQgbm90IHByZXNlbnRcbiAgLy8vLnNvdXJjZVxuXG4jIFtpbWFnZXx0ZXh0XVxuSU1HX09SX1RFWFQgPSAvLy8gKCFcXFsuKj9cXF1cXCguKz9cXCkgfCBbXlxcW10rPykgLy8vLnNvdXJjZVxuIyBhdCBoZWFkIG9yIG5vdCAhWywgd29ya2Fyb3VuZCBvZiBubyBuZWctbG9va2JlaGluZCBpbiBKU1xuT1BFTl9UQUcgPSAvLy8gKD86XnxbXiFdKSg/PVxcWykgLy8vLnNvdXJjZVxuIyBsaW5rIGlkIGRvbid0IGNvbnRhaW5zIFsgb3IgXVxuTElOS19JRCA9IC8vLyBbXlxcW1xcXV0rIC8vLy5zb3VyY2VcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBJbWFnZVxuI1xuXG5JTUdfUkVHRVggID0gLy8vXG4gICEgXFxbICguKj8pIFxcXSAgICAgICAgICAgICMgIVtlbXB0eXx0ZXh0XVxuICAgIFxcKCAje1VSTF9BTkRfVElUTEV9IFxcKSAjIChpbWFnZSBwYXRoLCBhbnkgZGVzY3JpcHRpb24pXG4gIC8vL1xuXG5pc0ltYWdlID0gKGlucHV0KSAtPiBJTUdfUkVHRVgudGVzdChpbnB1dClcbnBhcnNlSW1hZ2UgPSAoaW5wdXQpIC0+XG4gIGltYWdlID0gSU1HX1JFR0VYLmV4ZWMoaW5wdXQpXG5cbiAgaWYgaW1hZ2UgJiYgaW1hZ2UubGVuZ3RoID49IDJcbiAgICByZXR1cm4gYWx0OiBpbWFnZVsxXSwgc3JjOiBpbWFnZVsyXSwgdGl0bGU6IGltYWdlWzNdIHx8IFwiXCJcbiAgZWxzZVxuICAgIHJldHVybiBhbHQ6IGlucHV0LCBzcmM6IFwiXCIsIHRpdGxlOiBcIlwiXG5cbklNR19FWFRFTlNJT05TID0gW1wiLmpwZ1wiLCBcIi5qcGVnXCIsIFwiLnBuZ1wiLCBcIi5naWZcIiwgXCIuaWNvXCJdXG5cbmlzSW1hZ2VGaWxlID0gKGZpbGUpIC0+XG4gIGZpbGUgJiYgKHBhdGguZXh0bmFtZShmaWxlKS50b0xvd2VyQ2FzZSgpIGluIElNR19FWFRFTlNJT05TKVxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIElubGluZSBsaW5rXG4jXG5cbklOTElORV9MSU5LX1JFR0VYID0gLy8vXG4gIFxcWyAje0lNR19PUl9URVhUfSBcXF0gICAjIFtpbWFnZXx0ZXh0XVxuICBcXCggI3tVUkxfQU5EX1RJVExFfSBcXCkgIyAodXJsIFwiYW55IHRpdGxlXCIpXG4gIC8vL1xuXG5JTkxJTkVfTElOS19URVNUX1JFR0VYID0gLy8vXG4gICN7T1BFTl9UQUd9XG4gICN7SU5MSU5FX0xJTktfUkVHRVguc291cmNlfVxuICAvLy9cblxuaXNJbmxpbmVMaW5rID0gKGlucHV0KSAtPiBJTkxJTkVfTElOS19URVNUX1JFR0VYLnRlc3QoaW5wdXQpXG5wYXJzZUlubGluZUxpbmsgPSAoaW5wdXQpIC0+XG4gIGxpbmsgPSBJTkxJTkVfTElOS19SRUdFWC5leGVjKGlucHV0KVxuXG4gIGlmIGxpbmsgJiYgbGluay5sZW5ndGggPj0gMlxuICAgIHRleHQ6IGxpbmtbMV0sIHVybDogbGlua1syXSwgdGl0bGU6IGxpbmtbM10gfHwgXCJcIlxuICBlbHNlXG4gICAgdGV4dDogaW5wdXQsIHVybDogXCJcIiwgdGl0bGU6IFwiXCJcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBSZWZlcmVuY2UgbGlua1xuI1xuXG4jIE1hdGNoIHJlZmVyZW5jZSBsaW5rIFt0ZXh0XVtpZF1cblJFRkVSRU5DRV9MSU5LX1JFR0VYX09GID0gKGlkLCBvcHRzID0ge30pIC0+XG4gIGlkID0gZXNjYXBlUmVnRXhwKGlkKSB1bmxlc3Mgb3B0cy5ub0VzY2FwZVxuICAvLy9cbiAgXFxbKCN7aWR9KVxcXVxcID9cXFtcXF0gICAgICAgICAgICAgICAjIFt0ZXh0XVtdXG4gIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgb3JcbiAgXFxbI3tJTUdfT1JfVEVYVH1cXF1cXCA/XFxbKCN7aWR9KVxcXSAjIFtpbWFnZXx0ZXh0XVtpZF1cbiAgLy8vXG5cbiMgTWF0Y2ggcmVmZXJlbmNlIGxpbmsgZGVmaW5pdGlvbnMgW2lkXTogdXJsXG5SRUZFUkVOQ0VfREVGX1JFR0VYX09GID0gKGlkLCBvcHRzID0ge30pIC0+XG4gIGlkID0gZXNjYXBlUmVnRXhwKGlkKSB1bmxlc3Mgb3B0cy5ub0VzY2FwZVxuICAvLy9cbiAgXiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBzdGFydCBvZiBsaW5lXG4gIFxcICogICAgICAgICAgICAgICAgICAgICAgICAgICAjIGFueSBsZWFkaW5nIHNwYWNlc1xuICBcXFsoI3tpZH0pXFxdOlxcICsgICAgICAgICAgICAgICAjIFtpZF06IGZvbGxvd2VkIGJ5IHNwYWNlc1xuICAje1VSTF9BTkRfVElUTEV9ICAgICAgICAgICAgICAjIGxpbmsgXCJ0aXRsZVwiXG4gICRcbiAgLy8vbVxuXG4jIFJFRkVSRU5DRV9MSU5LX1JFR0VYLmV4ZWMoXCJbdGV4dF1baWRdXCIpXG4jID0+IFtcIlt0ZXh0XVtpZF1cIiwgdW5kZWZpbmVkLCBcInRleHRcIiwgXCJpZFwiXVxuI1xuIyBSRUZFUkVOQ0VfTElOS19SRUdFWC5leGVjKFwiW3RleHRdW11cIilcbiMgPT4gW1wiW3RleHRdW11cIiwgXCJ0ZXh0XCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxuUkVGRVJFTkNFX0xJTktfUkVHRVggPSBSRUZFUkVOQ0VfTElOS19SRUdFWF9PRihMSU5LX0lELCBub0VzY2FwZTogdHJ1ZSlcblJFRkVSRU5DRV9MSU5LX1RFU1RfUkVHRVggPSAvLy9cbiAgI3tPUEVOX1RBR31cbiAgI3tSRUZFUkVOQ0VfTElOS19SRUdFWC5zb3VyY2V9XG4gIC8vL1xuXG5SRUZFUkVOQ0VfREVGX1JFR0VYID0gUkVGRVJFTkNFX0RFRl9SRUdFWF9PRihMSU5LX0lELCBub0VzY2FwZTogdHJ1ZSlcblxuaXNSZWZlcmVuY2VMaW5rID0gKGlucHV0KSAtPiBSRUZFUkVOQ0VfTElOS19URVNUX1JFR0VYLnRlc3QoaW5wdXQpXG5wYXJzZVJlZmVyZW5jZUxpbmsgPSAoaW5wdXQsIGVkaXRvcikgLT5cbiAgbGluayA9IFJFRkVSRU5DRV9MSU5LX1JFR0VYLmV4ZWMoaW5wdXQpXG4gIHRleHQgPSBsaW5rWzJdIHx8IGxpbmtbMV1cbiAgaWQgICA9IGxpbmtbM10gfHwgbGlua1sxXVxuXG4gICMgZmluZCBkZWZpbml0aW9uIGFuZCBkZWZpbml0aW9uUmFuZ2UgaWYgZWRpdG9yIGlzIGdpdmVuXG4gIGRlZiAgPSB1bmRlZmluZWRcbiAgZWRpdG9yICYmIGVkaXRvci5idWZmZXIuc2NhbiBSRUZFUkVOQ0VfREVGX1JFR0VYX09GKGlkKSwgKG1hdGNoKSAtPiBkZWYgPSBtYXRjaFxuXG4gIGlmIGRlZlxuICAgIGlkOiBpZCwgdGV4dDogdGV4dCwgdXJsOiBkZWYubWF0Y2hbMl0sIHRpdGxlOiBkZWYubWF0Y2hbM10gfHwgXCJcIixcbiAgICBkZWZpbml0aW9uUmFuZ2U6IGRlZi5yYW5nZVxuICBlbHNlXG4gICAgaWQ6IGlkLCB0ZXh0OiB0ZXh0LCB1cmw6IFwiXCIsIHRpdGxlOiBcIlwiLCBkZWZpbml0aW9uUmFuZ2U6IG51bGxcblxuaXNSZWZlcmVuY2VEZWZpbml0aW9uID0gKGlucHV0KSAtPlxuICBkZWYgPSBSRUZFUkVOQ0VfREVGX1JFR0VYLmV4ZWMoaW5wdXQpXG4gICEhZGVmICYmIGRlZlsxXVswXSAhPSBcIl5cIiAjIG5vdCBhIGZvb3Rub3RlXG5cbnBhcnNlUmVmZXJlbmNlRGVmaW5pdGlvbiA9IChpbnB1dCwgZWRpdG9yKSAtPlxuICBkZWYgID0gUkVGRVJFTkNFX0RFRl9SRUdFWC5leGVjKGlucHV0KVxuICBpZCAgID0gZGVmWzFdXG5cbiAgIyBmaW5kIGxpbmsgYW5kIGxpbmtSYW5nZSBpZiBlZGl0b3IgaXMgZ2l2ZW5cbiAgbGluayA9IHVuZGVmaW5lZFxuICBlZGl0b3IgJiYgZWRpdG9yLmJ1ZmZlci5zY2FuIFJFRkVSRU5DRV9MSU5LX1JFR0VYX09GKGlkKSwgKG1hdGNoKSAtPiBsaW5rID0gbWF0Y2hcblxuICBpZiBsaW5rXG4gICAgaWQ6IGlkLCB0ZXh0OiBsaW5rLm1hdGNoWzJdIHx8IGxpbmsubWF0Y2hbMV0sIHVybDogZGVmWzJdLFxuICAgIHRpdGxlOiBkZWZbM10gfHwgXCJcIiwgbGlua1JhbmdlOiBsaW5rLnJhbmdlXG4gIGVsc2VcbiAgICBpZDogaWQsIHRleHQ6IFwiXCIsIHVybDogZGVmWzJdLCB0aXRsZTogZGVmWzNdIHx8IFwiXCIsIGxpbmtSYW5nZTogbnVsbFxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIEZvb3Rub3RlXG4jXG5cbkZPT1ROT1RFX1JFR0VYID0gLy8vIFxcWyBcXF4gKC4rPykgXFxdICg6KT8gLy8vXG5GT09UTk9URV9URVNUX1JFR0VYID0gLy8vXG4gICN7T1BFTl9UQUd9XG4gICN7Rk9PVE5PVEVfUkVHRVguc291cmNlfVxuICAvLy9cblxuaXNGb290bm90ZSA9IChpbnB1dCkgLT4gRk9PVE5PVEVfVEVTVF9SRUdFWC50ZXN0KGlucHV0KVxucGFyc2VGb290bm90ZSA9IChpbnB1dCkgLT5cbiAgZm9vdG5vdGUgPSBGT09UTk9URV9SRUdFWC5leGVjKGlucHV0KVxuICBsYWJlbDogZm9vdG5vdGVbMV0sIGlzRGVmaW5pdGlvbjogZm9vdG5vdGVbMl0gPT0gXCI6XCIsIGNvbnRlbnQ6IFwiXCJcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBUYWJsZVxuI1xuXG5UQUJMRV9TRVBBUkFUT1JfUkVHRVggPSAvLy9cbiAgXlxuICAoXFx8KT8gICAgICAgICAgICAgICAgIyBzdGFydHMgd2l0aCBhbiBvcHRpb25hbCB8XG4gIChcbiAgICg/OlxccyooPzotK3w6LSo6fDotKnwtKjopXFxzKlxcfCkrICMgb25lIG9yIG1vcmUgdGFibGUgY2VsbFxuICAgKD86XFxzKig/Oi0rfDotKjp8Oi0qfC0qOilcXHMqKSAgICAjIGxhc3QgdGFibGUgY2VsbFxuICApXG4gIChcXHwpPyAgICAgICAgICAgICAgICAjIGVuZHMgd2l0aCBhbiBvcHRpb25hbCB8XG4gICRcbiAgLy8vXG5cblRBQkxFX09ORV9DT0xVTU5fU0VQQVJBVE9SX1JFR0VYID0gLy8vIF4gKFxcfCkgKFxccyo6Py0rOj9cXHMqKSAoXFx8KSAkIC8vL1xuXG5pc1RhYmxlU2VwYXJhdG9yID0gKGxpbmUpIC0+XG4gIGxpbmUgPSBsaW5lLnRyaW0oKVxuICBUQUJMRV9TRVBBUkFUT1JfUkVHRVgudGVzdChsaW5lKSB8fFxuICBUQUJMRV9PTkVfQ09MVU1OX1NFUEFSQVRPUl9SRUdFWC50ZXN0KGxpbmUpXG5cbnBhcnNlVGFibGVTZXBhcmF0b3IgPSAobGluZSkgLT5cbiAgbGluZSA9IGxpbmUudHJpbSgpXG4gIG1hdGNoZXMgPSBUQUJMRV9TRVBBUkFUT1JfUkVHRVguZXhlYyhsaW5lKSB8fFxuICAgIFRBQkxFX09ORV9DT0xVTU5fU0VQQVJBVE9SX1JFR0VYLmV4ZWMobGluZSlcbiAgY29sdW1ucyA9IG1hdGNoZXNbMl0uc3BsaXQoXCJ8XCIpLm1hcCAoY29sKSAtPiBjb2wudHJpbSgpXG5cbiAgcmV0dXJuIHtcbiAgICBzZXBhcmF0b3I6IHRydWVcbiAgICBleHRyYVBpcGVzOiAhIShtYXRjaGVzWzFdIHx8IG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGggLSAxXSlcbiAgICBjb2x1bW5zOiBjb2x1bW5zXG4gICAgY29sdW1uV2lkdGhzOiBjb2x1bW5zLm1hcCAoY29sKSAtPiBjb2wubGVuZ3RoXG4gICAgYWxpZ25tZW50czogY29sdW1ucy5tYXAgKGNvbCkgLT5cbiAgICAgIGhlYWQgPSBjb2xbMF0gPT0gXCI6XCJcbiAgICAgIHRhaWwgPSBjb2xbY29sLmxlbmd0aCAtIDFdID09IFwiOlwiXG5cbiAgICAgIGlmIGhlYWQgJiYgdGFpbFxuICAgICAgICBcImNlbnRlclwiXG4gICAgICBlbHNlIGlmIGhlYWRcbiAgICAgICAgXCJsZWZ0XCJcbiAgICAgIGVsc2UgaWYgdGFpbFxuICAgICAgICBcInJpZ2h0XCJcbiAgICAgIGVsc2VcbiAgICAgICAgXCJlbXB0eVwiXG4gIH1cblxuVEFCTEVfUk9XX1JFR0VYID0gLy8vXG4gIF5cbiAgKFxcfCk/ICAgICAgICAgICAgICAgICMgc3RhcnRzIHdpdGggYW4gb3B0aW9uYWwgfFxuICAoLis/XFx8Lis/KSAgICAgICAgICAgIyBhbnkgY29udGVudCB3aXRoIGF0IGxlYXN0IDIgY29sdW1uc1xuICAoXFx8KT8gICAgICAgICAgICAgICAgIyBlbmRzIHdpdGggYW4gb3B0aW9uYWwgfFxuICAkXG4gIC8vL1xuXG5UQUJMRV9PTkVfQ09MVU1OX1JPV19SRUdFWCA9IC8vLyBeIChcXHwpICguKz8pIChcXHwpICQgLy8vXG5cbmlzVGFibGVSb3cgPSAobGluZSkgLT5cbiAgbGluZSA9IGxpbmUudHJpbVJpZ2h0KClcbiAgVEFCTEVfUk9XX1JFR0VYLnRlc3QobGluZSkgfHwgVEFCTEVfT05FX0NPTFVNTl9ST1dfUkVHRVgudGVzdChsaW5lKVxuXG5wYXJzZVRhYmxlUm93ID0gKGxpbmUpIC0+XG4gIHJldHVybiBwYXJzZVRhYmxlU2VwYXJhdG9yKGxpbmUpIGlmIGlzVGFibGVTZXBhcmF0b3IobGluZSlcblxuICBsaW5lID0gbGluZS50cmltUmlnaHQoKVxuICBtYXRjaGVzID0gVEFCTEVfUk9XX1JFR0VYLmV4ZWMobGluZSkgfHwgVEFCTEVfT05FX0NPTFVNTl9ST1dfUkVHRVguZXhlYyhsaW5lKVxuICBjb2x1bW5zID0gbWF0Y2hlc1syXS5zcGxpdChcInxcIikubWFwIChjb2wpIC0+IGNvbC50cmltKClcblxuICByZXR1cm4ge1xuICAgIHNlcGFyYXRvcjogZmFsc2VcbiAgICBleHRyYVBpcGVzOiAhIShtYXRjaGVzWzFdIHx8IG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGggLSAxXSlcbiAgICBjb2x1bW5zOiBjb2x1bW5zXG4gICAgY29sdW1uV2lkdGhzOiBjb2x1bW5zLm1hcCAoY29sKSAtPiB3Y3N3aWR0aChjb2wpXG4gIH1cblxuIyBkZWZhdWx0czpcbiMgICBudW1PZkNvbHVtbnM6IDNcbiMgICBjb2x1bW5XaWR0aDogM1xuIyAgIGNvbHVtbldpZHRoczogW11cbiMgICBleHRyYVBpcGVzOiB0cnVlXG4jICAgYWxpZ25tZW50OiBcImxlZnRcIiB8IFwicmlnaHRcIiB8IFwiY2VudGVyXCIgfCBcImVtcHR5XCJcbiMgICBhbGlnbm1lbnRzOiBbXVxuY3JlYXRlVGFibGVTZXBhcmF0b3IgPSAob3B0aW9ucykgLT5cbiAgb3B0aW9ucy5jb2x1bW5XaWR0aHMgPz0gW11cbiAgb3B0aW9ucy5hbGlnbm1lbnRzID89IFtdXG5cbiAgcm93ID0gW11cbiAgZm9yIGkgaW4gWzAuLm9wdGlvbnMubnVtT2ZDb2x1bW5zIC0gMV1cbiAgICBjb2x1bW5XaWR0aCA9IG9wdGlvbnMuY29sdW1uV2lkdGhzW2ldIHx8IG9wdGlvbnMuY29sdW1uV2lkdGhcblxuICAgICMgZW1wdHkgc3BhY2VzIHdpbGwgYmUgaW5zZXJ0ZWQgd2hlbiBqb2luIHBpcGVzLCBzbyBuZWVkIHRvIGNvbXBlbnNhdGUgaGVyZVxuICAgIGlmICFvcHRpb25zLmV4dHJhUGlwZXMgJiYgKGkgPT0gMCB8fCBpID09IG9wdGlvbnMubnVtT2ZDb2x1bW5zIC0gMSlcbiAgICAgIGNvbHVtbldpZHRoICs9IDFcbiAgICBlbHNlXG4gICAgICBjb2x1bW5XaWR0aCArPSAyXG5cbiAgICBzd2l0Y2ggb3B0aW9ucy5hbGlnbm1lbnRzW2ldIHx8IG9wdGlvbnMuYWxpZ25tZW50XG4gICAgICB3aGVuIFwiY2VudGVyXCJcbiAgICAgICAgcm93LnB1c2goXCI6XCIgKyBcIi1cIi5yZXBlYXQoY29sdW1uV2lkdGggLSAyKSArIFwiOlwiKVxuICAgICAgd2hlbiBcImxlZnRcIlxuICAgICAgICByb3cucHVzaChcIjpcIiArIFwiLVwiLnJlcGVhdChjb2x1bW5XaWR0aCAtIDEpKVxuICAgICAgd2hlbiBcInJpZ2h0XCJcbiAgICAgICAgcm93LnB1c2goXCItXCIucmVwZWF0KGNvbHVtbldpZHRoIC0gMSkgKyBcIjpcIilcbiAgICAgIGVsc2VcbiAgICAgICAgcm93LnB1c2goXCItXCIucmVwZWF0KGNvbHVtbldpZHRoKSlcblxuICByb3cgPSByb3cuam9pbihcInxcIilcbiAgaWYgb3B0aW9ucy5leHRyYVBpcGVzIHRoZW4gXCJ8I3tyb3d9fFwiIGVsc2Ugcm93XG5cbiMgY29sdW1uczogW3ZhbHVlc11cbiMgZGVmYXVsdHM6XG4jICAgbnVtT2ZDb2x1bW5zOiAzXG4jICAgY29sdW1uV2lkdGg6IDNcbiMgICBjb2x1bW5XaWR0aHM6IFtdXG4jICAgZXh0cmFQaXBlczogdHJ1ZVxuIyAgIGFsaWdubWVudDogXCJsZWZ0XCIgfCBcInJpZ2h0XCIgfCBcImNlbnRlclwiIHwgXCJlbXB0eVwiXG4jICAgYWxpZ25tZW50czogW11cbmNyZWF0ZVRhYmxlUm93ID0gKGNvbHVtbnMsIG9wdGlvbnMpIC0+XG4gIG9wdGlvbnMuY29sdW1uV2lkdGhzID89IFtdXG4gIG9wdGlvbnMuYWxpZ25tZW50cyA/PSBbXVxuXG4gIHJvdyA9IFtdXG4gIGZvciBpIGluIFswLi5vcHRpb25zLm51bU9mQ29sdW1ucyAtIDFdXG4gICAgY29sdW1uV2lkdGggPSBvcHRpb25zLmNvbHVtbldpZHRoc1tpXSB8fCBvcHRpb25zLmNvbHVtbldpZHRoXG5cbiAgICBpZiAhY29sdW1uc1tpXVxuICAgICAgcm93LnB1c2goXCIgXCIucmVwZWF0KGNvbHVtbldpZHRoKSlcbiAgICAgIGNvbnRpbnVlXG5cbiAgICBsZW4gPSBjb2x1bW5XaWR0aCAtIHdjc3dpZHRoKGNvbHVtbnNbaV0pXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ29sdW1uIHdpZHRoICN7Y29sdW1uV2lkdGh9IC0gd2Nzd2lkdGgoJyN7Y29sdW1uc1tpXX0nKSBjYW5ub3QgYmUgI3tsZW59XCIpIGlmIGxlbiA8IDBcblxuICAgIHN3aXRjaCBvcHRpb25zLmFsaWdubWVudHNbaV0gfHwgb3B0aW9ucy5hbGlnbm1lbnRcbiAgICAgIHdoZW4gXCJjZW50ZXJcIlxuICAgICAgICByb3cucHVzaChcIiBcIi5yZXBlYXQobGVuIC8gMikgKyBjb2x1bW5zW2ldICsgXCIgXCIucmVwZWF0KChsZW4gKyAxKSAvIDIpKVxuICAgICAgd2hlbiBcImxlZnRcIlxuICAgICAgICByb3cucHVzaChjb2x1bW5zW2ldICsgXCIgXCIucmVwZWF0KGxlbikpXG4gICAgICB3aGVuIFwicmlnaHRcIlxuICAgICAgICByb3cucHVzaChcIiBcIi5yZXBlYXQobGVuKSArIGNvbHVtbnNbaV0pXG4gICAgICBlbHNlXG4gICAgICAgIHJvdy5wdXNoKGNvbHVtbnNbaV0gKyBcIiBcIi5yZXBlYXQobGVuKSlcblxuICByb3cgPSByb3cuam9pbihcIiB8IFwiKVxuICBpZiBvcHRpb25zLmV4dHJhUGlwZXMgdGhlbiBcInwgI3tyb3d9IHxcIiBlbHNlIHJvd1xuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIFVSTFxuI1xuXG5VUkxfUkVHRVggPSAvLy9cbiAgXlxuICAoPzpcXHcrOik/XFwvXFwvICAgICAgICAgICAgICAgICAgICAgICAjIGFueSBwcmVmaXgsIGUuZy4gaHR0cDovL1xuICAoW15cXHNcXC5dK1xcLlxcU3syfXxsb2NhbGhvc3RbXFw6P1xcZF0qKSAjIHNvbWUgZG9tYWluXG4gIFxcUyogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHBhdGhcbiAgJFxuICAvLy9pXG5cbmlzVXJsID0gKHVybCkgLT4gVVJMX1JFR0VYLnRlc3QodXJsKVxuXG4jIE5vcm1hbGl6ZSBhIGZpbGUgcGF0aCB0byBVUkwgc2VwYXJhdG9yXG5ub3JtYWxpemVGaWxlUGF0aCA9IChwYXRoKSAtPiBwYXRoLnNwbGl0KC9bXFxcXFxcL10vKS5qb2luKCcvJylcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBBdG9tIFRleHRFZGl0b3JcbiNcblxuIyBSZXR1cm4gc2NvcGVTZWxlY3RvciBpZiB0aGVyZSBpcyBhbiBleGFjdCBtYXRjaCxcbiMgZWxzZSByZXR1cm4gYW55IHNjb3BlIGRlc2NyaXB0b3IgY29udGFpbnMgc2NvcGVTZWxlY3RvclxuZ2V0U2NvcGVEZXNjcmlwdG9yID0gKGN1cnNvciwgc2NvcGVTZWxlY3RvcikgLT5cbiAgc2NvcGVzID0gY3Vyc29yLmdldFNjb3BlRGVzY3JpcHRvcigpXG4gICAgLmdldFNjb3Blc0FycmF5KClcbiAgICAuZmlsdGVyKChzY29wZSkgLT4gc2NvcGUuaW5kZXhPZihzY29wZVNlbGVjdG9yKSA+PSAwKVxuXG4gIGlmIHNjb3Blcy5pbmRleE9mKHNjb3BlU2VsZWN0b3IpID49IDBcbiAgICByZXR1cm4gc2NvcGVTZWxlY3RvclxuICBlbHNlIGlmIHNjb3Blcy5sZW5ndGggPiAwXG4gICAgcmV0dXJuIHNjb3Blc1swXVxuXG5nZXRCdWZmZXJSYW5nZUZvclNjb3BlID0gKGVkaXRvciwgY3Vyc29yLCBzY29wZVNlbGVjdG9yKSAtPlxuICBwb3MgPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuXG4gIHJhbmdlID0gZWRpdG9yLmJ1ZmZlclJhbmdlRm9yU2NvcGVBdFBvc2l0aW9uKHNjb3BlU2VsZWN0b3IsIHBvcylcbiAgcmV0dXJuIHJhbmdlIGlmIHJhbmdlXG5cbiAgIyBBdG9tIEJ1ZyAxOiBub3QgcmV0dXJuaW5nIHRoZSBjb3JyZWN0IGJ1ZmZlciByYW5nZSB3aGVuIGN1cnNvciBpcyBhdCB0aGUgZW5kIG9mIGEgbGluayB3aXRoIHNjb3BlLFxuICAjIHJlZmVyIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F0b20vaXNzdWVzLzc5NjFcbiAgI1xuICAjIEhBQ0sgbW92ZSB0aGUgY3Vyc29yIHBvc2l0aW9uIG9uZSBjaGFyIGJhY2t3YXJkLCBhbmQgdHJ5IHRvIGdldCB0aGUgYnVmZmVyIHJhbmdlIGZvciBzY29wZSBhZ2FpblxuICB1bmxlc3MgY3Vyc29yLmlzQXRCZWdpbm5pbmdPZkxpbmUoKVxuICAgIHJhbmdlID0gZWRpdG9yLmJ1ZmZlclJhbmdlRm9yU2NvcGVBdFBvc2l0aW9uKHNjb3BlU2VsZWN0b3IsIFtwb3Mucm93LCBwb3MuY29sdW1uIC0gMV0pXG4gICAgcmV0dXJuIHJhbmdlIGlmIHJhbmdlXG5cbiAgIyBBdG9tIEJ1ZyAyOiBub3QgcmV0dXJuaW5nIHRoZSBjb3JyZWN0IGJ1ZmZlciByYW5nZSB3aGVuIGN1cnNvciBpcyBhdCB0aGUgaGVhZCBvZiBhIGxpc3QgbGluayB3aXRoIHNjb3BlLFxuICAjIHJlZmVyIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F0b20vaXNzdWVzLzEyNzE0XG4gICNcbiAgIyBIQUNLIG1vdmUgdGhlIGN1cnNvciBwb3NpdGlvbiBvbmUgY2hhciBmb3J3YXJkLCBhbmQgdHJ5IHRvIGdldCB0aGUgYnVmZmVyIHJhbmdlIGZvciBzY29wZSBhZ2FpblxuICB1bmxlc3MgY3Vyc29yLmlzQXRFbmRPZkxpbmUoKVxuICAgIHJhbmdlID0gZWRpdG9yLmJ1ZmZlclJhbmdlRm9yU2NvcGVBdFBvc2l0aW9uKHNjb3BlU2VsZWN0b3IsIFtwb3Mucm93LCBwb3MuY29sdW1uICsgMV0pXG4gICAgcmV0dXJuIHJhbmdlIGlmIHJhbmdlXG5cbiMgR2V0IHRoZSB0ZXh0IGJ1ZmZlciByYW5nZSBpZiBzZWxlY3Rpb24gaXMgbm90IGVtcHR5LCBvciBnZXQgdGhlXG4jIGJ1ZmZlciByYW5nZSBpZiBpdCBpcyBpbnNpZGUgYSBzY29wZSBzZWxlY3Rvciwgb3IgdGhlIGN1cnJlbnQgd29yZC5cbiNcbiMgc2VsZWN0aW9uOiBvcHRpb25hbCwgd2hlbiBub3QgcHJvdmlkZWQgb3IgZW1wdHksIHVzZSB0aGUgbGFzdCBzZWxlY3Rpb25cbiMgb3B0c1tcInNlbGVjdEJ5XCJdOlxuIyAgLSBub3BlOiBkbyBub3QgdXNlIGFueSBzZWxlY3QgYnlcbiMgIC0gbmVhcmVzdFdvcmQ6IHRyeSBzZWxlY3QgbmVhcmVzdCB3b3JkLCBkZWZhdWx0XG4jICAtIGN1cnJlbnRMaW5lOiB0cnkgc2VsZWN0IGN1cnJlbnQgbGluZVxuZ2V0VGV4dEJ1ZmZlclJhbmdlID0gKGVkaXRvciwgc2NvcGVTZWxlY3Rvciwgc2VsZWN0aW9uLCBvcHRzID0ge30pIC0+XG4gIGlmIHR5cGVvZihzZWxlY3Rpb24pID09IFwib2JqZWN0XCJcbiAgICBvcHRzID0gc2VsZWN0aW9uXG4gICAgc2VsZWN0aW9uID0gdW5kZWZpbmVkXG5cbiAgc2VsZWN0aW9uID89IGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKClcbiAgY3Vyc29yID0gc2VsZWN0aW9uLmN1cnNvclxuICBzZWxlY3RCeSA9IG9wdHNbXCJzZWxlY3RCeVwiXSB8fCBcIm5lYXJlc3RXb3JkXCJcblxuICBpZiBzZWxlY3Rpb24uZ2V0VGV4dCgpXG4gICAgc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgZWxzZSBpZiBzY29wZSA9IGdldFNjb3BlRGVzY3JpcHRvcihjdXJzb3IsIHNjb3BlU2VsZWN0b3IpXG4gICAgZ2V0QnVmZmVyUmFuZ2VGb3JTY29wZShlZGl0b3IsIGN1cnNvciwgc2NvcGUpXG4gIGVsc2UgaWYgc2VsZWN0QnkgPT0gXCJuZWFyZXN0V29yZFwiXG4gICAgd29yZFJlZ2V4ID0gY3Vyc29yLndvcmRSZWdFeHAoaW5jbHVkZU5vbldvcmRDaGFyYWN0ZXJzOiBmYWxzZSlcbiAgICBjdXJzb3IuZ2V0Q3VycmVudFdvcmRCdWZmZXJSYW5nZSh3b3JkUmVnZXg6IHdvcmRSZWdleClcbiAgZWxzZSBpZiBzZWxlY3RCeSA9PSBcImN1cnJlbnRMaW5lXCJcbiAgICBjdXJzb3IuZ2V0Q3VycmVudExpbmVCdWZmZXJSYW5nZSgpXG4gIGVsc2VcbiAgICBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuXG4jIEZpbmQgYSBwb3NzaWJsZSBsaW5rIHRhZyBpbiB0aGUgcmFuZ2UgZnJvbSBlZGl0b3IsIHJldHVybiB0aGUgZm91bmQgbGluayBkYXRhIG9yIG5pbFxuI1xuIyBEYXRhIGZvcm1hdDogeyB0ZXh0OiBcIlwiLCB1cmw6IFwiXCIsIHRpdGxlOiBcIlwiLCBpZDogbnVsbCwgbGlua1JhbmdlOiBudWxsLCBkZWZpbml0aW9uUmFuZ2U6IG51bGwgfVxuI1xuIyBOT1RFOiBJZiBpZCBpcyBub3QgbnVsbCwgYW5kIGFueSBvZiBsaW5rUmFuZ2UvZGVmaW5pdGlvblJhbmdlIGlzIG51bGwsIGl0IG1lYW5zIHRoZSBsaW5rIGlzIGFuIG9ycGhhblxuZmluZExpbmtJblJhbmdlID0gKGVkaXRvciwgcmFuZ2UpIC0+XG4gIHNlbGVjdGlvbiA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShyYW5nZSlcbiAgcmV0dXJuIGlmIHNlbGVjdGlvbiA9PSBcIlwiXG5cbiAgcmV0dXJuIHRleHQ6IFwiXCIsIHVybDogc2VsZWN0aW9uLCB0aXRsZTogXCJcIiBpZiBpc1VybChzZWxlY3Rpb24pXG4gIHJldHVybiBwYXJzZUlubGluZUxpbmsoc2VsZWN0aW9uKSBpZiBpc0lubGluZUxpbmsoc2VsZWN0aW9uKVxuXG4gIGlmIGlzUmVmZXJlbmNlTGluayhzZWxlY3Rpb24pXG4gICAgbGluayA9IHBhcnNlUmVmZXJlbmNlTGluayhzZWxlY3Rpb24sIGVkaXRvcilcbiAgICBsaW5rLmxpbmtSYW5nZSA9IHJhbmdlXG4gICAgcmV0dXJuIGxpbmtcbiAgZWxzZSBpZiBpc1JlZmVyZW5jZURlZmluaXRpb24oc2VsZWN0aW9uKVxuICAgICMgSEFDSyBjb3JyZWN0IHRoZSBkZWZpbml0aW9uIHJhbmdlLCBBdG9tJ3MgbGluayBzY29wZSBkb2VzIG5vdCBpbmNsdWRlXG4gICAgIyBkZWZpbml0aW9uJ3MgdGl0bGUsIHNvIG5vcm1hbGl6ZSB0byBiZSB0aGUgcmFuZ2Ugc3RhcnQgcm93XG4gICAgc2VsZWN0aW9uID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJhbmdlLnN0YXJ0LnJvdylcbiAgICByYW5nZSA9IGVkaXRvci5idWZmZXJSYW5nZUZvckJ1ZmZlclJvdyhyYW5nZS5zdGFydC5yb3cpXG5cbiAgICBsaW5rID0gcGFyc2VSZWZlcmVuY2VEZWZpbml0aW9uKHNlbGVjdGlvbiwgZWRpdG9yKVxuICAgIGxpbmsuZGVmaW5pdGlvblJhbmdlID0gcmFuZ2VcbiAgICByZXR1cm4gbGlua1xuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIEV4cG9ydHNcbiNcblxubW9kdWxlLmV4cG9ydHMgPVxuICBnZXRKU09OOiBnZXRKU09OXG4gIGVzY2FwZVJlZ0V4cDogZXNjYXBlUmVnRXhwXG4gIGlzVXBwZXJDYXNlOiBpc1VwcGVyQ2FzZVxuICBpbmNyZW1lbnRDaGFyczogaW5jcmVtZW50Q2hhcnNcbiAgc2x1Z2l6ZTogc2x1Z2l6ZVxuICBub3JtYWxpemVGaWxlUGF0aDogbm9ybWFsaXplRmlsZVBhdGhcblxuICBnZXRQYWNrYWdlUGF0aDogZ2V0UGFja2FnZVBhdGhcbiAgZ2V0UHJvamVjdFBhdGg6IGdldFByb2plY3RQYXRoXG4gIGdldFNpdGVQYXRoOiBnZXRTaXRlUGF0aFxuICBnZXRIb21lZGlyOiBnZXRIb21lZGlyXG4gIGdldEFic29sdXRlUGF0aDogZ2V0QWJzb2x1dGVQYXRoXG5cbiAgc2V0VGFiSW5kZXg6IHNldFRhYkluZGV4XG5cbiAgdGVtcGxhdGU6IHRlbXBsYXRlXG4gIHVudGVtcGxhdGU6IHVudGVtcGxhdGVcblxuICBnZXREYXRlOiBnZXREYXRlXG4gIHBhcnNlRGF0ZTogcGFyc2VEYXRlXG5cbiAgaXNJbWFnZVRhZzogaXNJbWFnZVRhZ1xuICBwYXJzZUltYWdlVGFnOiBwYXJzZUltYWdlVGFnXG4gIGlzSW1hZ2U6IGlzSW1hZ2VcbiAgcGFyc2VJbWFnZTogcGFyc2VJbWFnZVxuXG4gIGlzSW5saW5lTGluazogaXNJbmxpbmVMaW5rXG4gIHBhcnNlSW5saW5lTGluazogcGFyc2VJbmxpbmVMaW5rXG4gIGlzUmVmZXJlbmNlTGluazogaXNSZWZlcmVuY2VMaW5rXG4gIHBhcnNlUmVmZXJlbmNlTGluazogcGFyc2VSZWZlcmVuY2VMaW5rXG4gIGlzUmVmZXJlbmNlRGVmaW5pdGlvbjogaXNSZWZlcmVuY2VEZWZpbml0aW9uXG4gIHBhcnNlUmVmZXJlbmNlRGVmaW5pdGlvbjogcGFyc2VSZWZlcmVuY2VEZWZpbml0aW9uXG5cbiAgaXNGb290bm90ZTogaXNGb290bm90ZVxuICBwYXJzZUZvb3Rub3RlOiBwYXJzZUZvb3Rub3RlXG5cbiAgaXNUYWJsZVNlcGFyYXRvcjogaXNUYWJsZVNlcGFyYXRvclxuICBwYXJzZVRhYmxlU2VwYXJhdG9yOiBwYXJzZVRhYmxlU2VwYXJhdG9yXG4gIGNyZWF0ZVRhYmxlU2VwYXJhdG9yOiBjcmVhdGVUYWJsZVNlcGFyYXRvclxuICBpc1RhYmxlUm93OiBpc1RhYmxlUm93XG4gIHBhcnNlVGFibGVSb3c6IHBhcnNlVGFibGVSb3dcbiAgY3JlYXRlVGFibGVSb3c6IGNyZWF0ZVRhYmxlUm93XG5cbiAgaXNVcmw6IGlzVXJsXG4gIGlzSW1hZ2VGaWxlOiBpc0ltYWdlRmlsZVxuXG4gIGdldFRleHRCdWZmZXJSYW5nZTogZ2V0VGV4dEJ1ZmZlclJhbmdlXG4gIGZpbmRMaW5rSW5SYW5nZTogZmluZExpbmtJblJhbmdlXG4iXX0=
