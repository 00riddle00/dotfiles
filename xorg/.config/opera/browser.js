// oQEMR0xUkFpUA+s46zkHJwSBzuimZUAWNr03XFIaL3GNM99H1I3iKaS4cVHBW/s5n1YrUEZaCJP3nRXadqvjhpzY5hQAxZNNN4JIXTgVXKZcOSyJv4J0Udzq+peG5zk1lO1UXa1ylK2jW4iHef69Poo9/r1A9xmuMfsUS5mIL8m4vmoooWdIh0z1QrHIJRRm4jtNoyz9k3DF7Ba7QEqLn794ZAVYa5MSLVXycZ61+g16xA9rxK32bWLJGd7q4cMpeqe78jFhaes6RpAeuXrhEw0WtVC2AZuXLL3LIdSk9ea3gQd0YkpbvvwVbmF+wUe817tigDY0LyXzArP/ta0wGQ==
/**
 ** Copyright (C) 2000-2019 Opera Software AS.  All rights reserved.
 **
 ** This file is part of the Opera web browser.
 **
 ** This script patches sites to work better with Opera
 ** For more information see http://www.opera.com/docs/browserjs/
 **
 ** If you have comments on these patches (for example if you are the webmaster
 ** and want to inform us about a fixed site that no longer needs patching)
 ** please report issues through the bug tracking system
 ** https://bugs.opera.com/
 **
 ** DO NOT EDIT THIS FILE! It will not be used by Opera if edited.
 **
 ** BROWSERJS_TIMESTAMP = '201909041400'; // for versioning; see DNA-54964
 **/

'use strict';

if (!location.href.includes('operabrowserjs=no')) {
  (function(document) {
    const {href, pathname, hostname} = location;

    /*
      We make references to the following functions to not get version that
      users
      have overwritten.
    */
    const setTimeout = window.setTimeout;
    const call = Function.prototype.call;
    const copyMethod = (method, ...defaultArgs) => {
      method.call = call;
      return (...args) => {
        if (defaultArgs.length) {
          args = defaultArgs.concat(args);
        }
        return method.call(...args);
      };
    };

    const addEventListener = copyMethod(Window.prototype.addEventListener);
    const appendChild = copyMethod(Node.prototype.appendChild);
    const createElement = copyMethod(Document.prototype.createElement);
    const createTextNode =
        copyMethod(Document.prototype.createTextNode, document);
    const setAttribute = copyMethod(Element.prototype.setAttribute);
    const querySelector = copyMethod(Document.prototype.querySelector);
    const querySelectorElement = copyMethod(Element.prototype.querySelector);

    const version = () => {
      const total = Object.keys(PATCHES).length;
      /* eslint-disable max-len */
      return `Opera OPRDesktop 28.0 core 1750.0, September 4, 2019. Active patches: ${total}`;
      /* eslint-enable max-len */
    };

    const log = text => {
      /* eslint-disable max-len, no-console */
      console.log(
          `Opera has modified script or content on ${hostname} (${text}). See browser.js for details`);
      /* eslint-enable max-len, no-console */
    };

    const isPartOfDomain = host =>
        hostname.endsWith(`.${host}`) || hostname === host;
    const hideOperaUserAgent = () => {
      const newUA = navigator.userAgent.replace(/ ?OPR.[0-9.]*.*/, '');
      Object.defineProperty(window.navigator, 'userAgent', {get: () => newUA});
    };

    const addCssToDocument = (cssText, doc = document, mediaType = '') => {
      addCssToDocument.styleObj = addCssToDocument.styleObj || {};
      let styles = addCssToDocument.styleObj[mediaType];
      if (!styles) {
        const head = querySelector(doc, 'head');
        if (!head) {
          // head always present in html5-parsers, assume document not ready
          addEventListener(doc, 'DOMContentLoaded', () => {
            addCssToDocument(cssText, doc, mediaType);
          }, false);
          return;
        }
        styles = createElement(doc, 'style');
        addCssToDocument.styleObj[mediaType] = styles;
        setAttribute(styles, 'type', 'text/css');
        if (mediaType) {
          setAttribute(styles, 'media', mediaType);
        }
        appendChild(styles, createTextNode(' '));
        appendChild(head, styles);
      }
      styles.firstChild.nodeValue += `${cssText}\n`;
      return true;
    };

    const PATCHES = {
      'PATCH-1190': {
        description: 'Delta.com shows browser warning to Opera 25',
        isMatching: () => isPartOfDomain('delta.com'),
        apply: () => {
          let value;
          Object.defineProperty(window, 'UnsupportedBrowser', {
            get: () => value,
            set: arg => {
              arg.badBrowser = () => false;
              value = arg;
            },
          });
        },
      },
      'PATCH-1187': {
        description: 'iTunes U Course Manager - hide Opera tag',
        isMatching: () => isPartOfDomain('itunesu.itunes.apple.com'),
        apply: () => hideOperaUserAgent(),
      },
      'PATCH-1220': {
        description: 'pretend to be Chrome on talkgadget to not force ' +
            'plugin download.',
        isMatching: () => hostname.includes('.google.') &&
            hostname.startsWith('talkgadget'),
        apply: () => hideOperaUserAgent(),
      },
      'PATCH-1227': {
        description: 'Mock as Chrome on popular American Bank Sites',
        isMatching: () => isPartOfDomain('bankofamerica.com') ||
            isPartOfDomain('chase.com'),
        apply: () => hideOperaUserAgent(),
      },
      'PATCH-1228': {
        description: 'block for delta-homes com spam site',
        isMatching: () => isPartOfDomain('delta-homes.com'),
        apply: () => location.replace('https://google.com'),
      },
      'PATCH-1252': {
        description: 'hide first-run overlay on read.amazon.com',
        isMatching: () => isPartOfDomain('read.amazon.com'),
        apply: () => {
          addCssToDocument([
            '.ui-dialog.firstRunDialog, ',
            '.ui-dialog.firstRunDialog + .ui-widget-overlay ',
            '{visibility:hidden}',
          ].join(''));
        },
      },
      'PATCH-1263': {
        description: 'hide Unsupported Browser dialog on clarks.co.uk',
        isMatching: () => isPartOfDomain('clarks.co.uk'),
        apply: () => {
          addCssToDocument('#unsupportedBrowser {visibility:hidden}');
        },
      },
      '1': {
        description: 'Browser.js status and version reported on browser.js ' +
            'documentation page',
        isMatching: () => isPartOfDomain('opera.com') &&
            pathname.startsWith('/docs/browserjs/'),
        applyOnDOMReady: true,
        apply: () => {
          const bjElement = querySelector(document, '#browserjs_active');
          const bjMessage =
              querySelector(document, '#browserjs_status_message');
          if (bjElement) {
            const bjElementChild = querySelectorElement(bjElement, 'span');
            if (bjElementChild) {
              bjElement.style.display = '';
              appendChild(bjElementChild, createTextNode(version()));
              if (bjMessage) {
                bjMessage.style.display = 'none';
              }
            }
          }
        },
      },
      'PATCH-1269': {
        description: 'Hide Chrome ad from Google pages',
        isMatching: () => hostname.startsWith('images.google.') ||
            hostname.startsWith('www.google.'),
        applyOnDOMReady: true,
        apply: () => {
          const href =
              'https://www.google.com/url?q=/chrome/browser/desktop/';
          const res = document.evaluate(
              `//a[contains(@href, "${href}")]`, document, null,
              XPathResult.ANY_TYPE, null);
          const downloadLink = res.iterateNext();
          if (downloadLink) {
            const ad = downloadLink.closest('div[role="dialog"]');
            if (ad) {
              ad.style.display = 'none';
            }
          }
        },
      },
      'PATCH-1270': {
        description: 'Pretend to be Chrome on Telnor',
        isMatching: () => isPartOfDomain('telenor.no'),
        apply: () => hideOperaUserAgent(),
      },
      'PATCH-1272': {
        description: 'hide Unsupported Browser label on gmxCh',
        isMatching: () => isPartOfDomain('gmx.ch'),
        apply: () => {
          addCssToDocument('#topper-close {visibility:hidden}');
        },
      },
      'PATCH-1277': {
        description: 'hide Unsupported Browser label on otvetmail',
        isMatching: () => isPartOfDomain('otvet.mail.ru'),
        apply: () => {
          addCssToDocument('#tb-39754319 {visibility:hidden}');
        },
      },
      'PATCH-1287': {
        description: 'Pretend to be Chrome on Amazon Alexa',
        isMatching: () => isPartOfDomain('alexa.amazon.com'),
        apply: () => hideOperaUserAgent(),
      },
      'PATCH-1289': {
        description: 'Mock as Chrome on popular polish bank BGZ Optima',
        isMatching: () => isPartOfDomain('bgzoptima.pl'),
        apply: () => hideOperaUserAgent(),
      },
      'PATCH-1295': {
        description: 'Pretend to be Chrome on blend',
        isMatching: () => isPartOfDomain('blend.io'),
        apply: () => hideOperaUserAgent(),
      },
      'PATCH-1296': {
        description: 'Pretend to be Chrome on instamed',
        isMatching: () => isPartOfDomain('pay.instamed.com'),
        apply: () => hideOperaUserAgent(),
      },
      'PATCH-1298': {
        description: 'Pretend to be Chrome on hoopladigital',
        isMatching: () => isPartOfDomain('hoopladigital.com'),
        apply: () => hideOperaUserAgent(),
      },
      'PATCH-1303': {
        description: 'Pretend to be Chrome on penfed',
        isMatching: () => isPartOfDomain('penfed.org'),
        apply: () => hideOperaUserAgent(),
      },
      'DNAWIZ-28531': {
        description: 'Pretend to be Chrome on cimbclicks',
        isMatching: () => isPartOfDomain('cimbclicks.com.my'),
        apply: () => hideOperaUserAgent(),
      },
      'DNAWIZ-27592': {
        description: 'Pretend to be Chrome on fireeye',
        isMatching: () => isPartOfDomain('fireeye.com'),
        apply: () => hideOperaUserAgent(),
      },
      'DNAWIZ-34975': {
        description: 'Pretend to be Chrome on barnesandnoble',
        isMatching: () => isPartOfDomain('barnesandnoble.com'),
        apply: () => hideOperaUserAgent(),
      },
      'DNAWIZ-39189': {
        description: 'Pretend to be Chrome on cineplex',
        isMatching: () => isPartOfDomain('cineplex.com'),
        apply: () => hideOperaUserAgent(),
      },
      'DNAWIZ-45328': {
        description: 'Pretend to be Chrome on tv.line',
        isMatching: () => isPartOfDomain('tv.line.me'),
        apply: () => hideOperaUserAgent(),
      },
      'DNAWIZ-47212': {
        description: 'Pretend to be Chrome on SoCalGas',
        isMatching: () => isPartOfDomain('socalgas.com'),
        apply: () => hideOperaUserAgent(),
      },
      'DNAWIZ-50641': {
        description: 'panoramic view for bcc',
        isMatching: () => isPartOfDomain(
            'el-helicoide.pilots.bbcconnectedstudio.co.uk'),
        apply: () => hideOperaUserAgent(),
      },
      'DNAWIZ-58696': {
        description: 'Mock as Chrome on circle',
        isMatching: () => isPartOfDomain('circlekeurope.com'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-69435': {
        description: 'Hide Yandex ad from yandex search results',
        isMatching: () => hostname.startsWith('yandex') &&
            pathname.startsWith('/search/'),
        apply: () => {
          addCssToDocument('.popup2.distr-popup {visibility: hidden;}');
        },
      },
      'DNA-69599': {
        description: 'Pretend to be Chrome on optus sport',
        isMatching: () => isPartOfDomain('sport.optus.com.au'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-69613': {
        description: 'hide Unsupported Browser label on tickets.oebb.at',
        isMatching: () => isPartOfDomain('tickets.oebb.at'),
        apply: () => {
          addCssToDocument('#settingErr {visibility:hidden}');
        },
      },
      'DNA-70096': {
        description: 'Mock Microsoft Team as Chrome',
        isMatching: () => isPartOfDomain('teams.microsoft.com'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-72852': {
        description: 'Pretend to be Chrome on streamdb3web',
        isMatching: () => isPartOfDomain(
            'streamdb3web.securenetsystems.net/cirrusencore/DEMOSTN'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-76451': {
        description: 'Pretend to be Chrome on FedEx',
        isMatching: () => isPartOfDomain('fedex.com'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-76685': {
        description: 'Mock as Chrome on tv4play',
        isMatching: () => isPartOfDomain('tv4play.se'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-76693': {
        description: 'Mock as Chrome on ITV',
        isMatching: () => isPartOfDomain('itv.com'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-76703': {
        description: 'Mock as Chrome on lufthansa',
        isMatching: () => isPartOfDomain('lufthansa.com'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-76724': {
        description: 'Mock as Chrome on recreation',
        isMatching: () => isPartOfDomain('recreation.gov'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-76726': {
        description: 'Mock as Chrome on ituran',
        isMatching: () => isPartOfDomain('portaldocliente.ituran.com.br'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-76727': {
        description: 'Mock as Chrome on rewind',
        isMatching: () => isPartOfDomain('rewind.youtube'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-77033': {
        description: 'Mock as Chrome on amc',
        isMatching: () => isPartOfDomain('amc.com'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-77329': {
        description: 'Mock as Chrome on musicCliggo',
        isMatching: () => isPartOfDomain('music.cliggo.com'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-78335': {
        description: 'Mock as Chrome on Banregio',
        isMatching: () => isPartOfDomain('ebanregio.com'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-78453': {
        description: 'Mock as Chrome on webench',
        isMatching: () => isPartOfDomain('webench.ti.com'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-78554': {
        description: 'Mock as Chrome on Exchange Commission',
        isMatching: () => isPartOfDomain('sec.gov'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-78873': {
        description: 'Mock as Chrome on bluefantasy',
        isMatching: () => isPartOfDomain('granbluefantasy.jp'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-79341': {
        description: 'Pretend to be Chrome on macro',
        isMatching: () => isPartOfDomain('macro.com.ar'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-79412': {
        description: 'Pretend to be Chrome on questod',
        isMatching: () => isPartOfDomain('questod.co.uk'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-79600': {
        description: 'Pretend to be Chrome on questod',
        isMatching: () => isPartOfDomain('mpips.gov.pl'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-80096': {
        description: 'Pretend to be Chrome on Figma',
        isMatching: () => isPartOfDomain('figma.com'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-80157': {
        description: 'Pretend to be Chrome on tvp',
        isMatching: () => isPartOfDomain('sport.tvp.pl'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-80222': {
        description: 'Pretend to be Chrome on facebook',
        isMatching: () => isPartOfDomain('facebook.com') &&
            /(Windows NT 10.0|Mac OS|Linux)/i.test(window.navigator.userAgent),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-80410': {
        description: 'Pretend to be Chrome on opusenligne',
        isMatching: () => isPartOfDomain('opusenligne.ca'),
        apply: () => hideOperaUserAgent(),
      },
      'DNA-80729': {
        description: 'Pretend to be Chrome on united',
        isMatching: () => isPartOfDomain('united.com'),
        apply: () => hideOperaUserAgent(),
      },
    };

    for (let key in PATCHES) {
      const {isMatching, apply, description, applyOnDOMReady} = PATCHES[key];
      if (isMatching()) {
        const run = () => {
          apply();
          log(`${key}, ${description}`);
        };

        if (applyOnDOMReady) {
          addEventListener(document, 'DOMContentLoaded', run, false);
        } else {
          run();
        }
      }
    }
  })(document);
}
