/* eslint-env node, mocha */
/* eslint-disable no-console */
const expect = require('chai').expect;
const fs = require('fs');
const sass = require('node-sass');

const selectorImporter = require('../');
const SelectorImporterClass = require('../dist/SelectorImporter.js');

describe('selectorImporter', () => {
  it('should be a function', () => expect(selectorImporter).to.be.a('function'));

  it('should resolve selector import', (done) => {
    const expectedResult = fs.readFileSync('test/files/selectors-reference.css', {
      encoding: 'utf8'
    });
    sass.render({
      file: 'test/files/selectors.scss',
      importer: selectorImporter
    }, (error, result) => {
      if (!error) {
        expect(result.css.toString()).to.equal(expectedResult);
        done();
      } else {
        console.log(error);
      }
    });
  });
});

describe('SelectorImporterClass', () => {
  it('should be a function', () => expect(SelectorImporterClass).to.be.a('function'));

  /**
   * cleanUrl()
   */
  describe('cleanUrl()', () => {
    it('should return the url unmodified', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const url = 'normal/path/without/tilde';
      const expectedResult = url;
      return expect(selectorImporterInstance.cleanUrl(url)).to.equal(expectedResult);
    });

    it('should return the unmodified home path relative url', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const url = '~/home/path/with/tilde';
      const expectedResult = url;
      return expect(selectorImporterInstance.cleanUrl(url)).to.equal(expectedResult);
    });

    it('should return a cleaned up url without tilde', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const url = '~path/with/tilde';
      const expectedResult = 'path/with/tilde';
      return expect(selectorImporterInstance.cleanUrl(url)).to.equal(expectedResult);
    });
  });

  /**
   * parseUrl()
   */
  describe('parseUrl()', () => {
    it('should return object with url and empty selector filters', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const url = 'path/without/selector/filters.scss';
      const expectedResult = {
        url,
        selectorFilters: undefined
      };
      return expect(selectorImporterInstance.parseUrl(url)).to.deep.equal(expectedResult);
    });

    it('should return object with url and selector filters', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const url = 'path/with/selector/filters.scss';
      const selectorFilters = [
        ['.selector1'],
        ['.selector2']
      ];
      const selectorFilterString = selectorFilters.map((x) => x.join(' as ')).join(', ');
      const urlWithSelectorFilters = `{ ${selectorFilterString} } from ${url}`;
      const expectedResult = {
        url,
        selectorFilters
      };
      return expect(selectorImporterInstance.parseUrl(urlWithSelectorFilters))
        .to.deep.equal(expectedResult);
    });

    it('should return object with url and selector filters with replacements', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const url = 'path/with/selector/filters/and/replacements.scss';
      const selectorFilters = [
        ['.selector1', '.replacement1'],
        ['.selector2', '.replacement1']
      ];
      const selectorFilterString = selectorFilters.map((x) => x.join(' as ')).join(', ');
      const urlWithSelectorFilters = `{ ${selectorFilterString} } from ${url}`;
      const expectedResult = {
        url,
        selectorFilters
      };
      return expect(selectorImporterInstance.parseUrl(urlWithSelectorFilters))
        .to.deep.equal(expectedResult);
    });
  });

  /**
   * resolve()
   */
  describe('resolve()', () => {
    // @TODO
  });
});
