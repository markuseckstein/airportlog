/**
 * Created by marku on 06.01.2016.
 */

'use strict';
var GulpConfig = (function () {
    function gulpConfig() {
        this.source = './src/';
        this.sourceApp = this.source + 'app/';

        this.baseOutputPath = 'dist/';
        this.tsOutputPath = this.baseOutputPath + '/js';
        this.allJavaScript = [this.baseOutputPath + '/**/*.js'];
        this.allTypeScript = this.sourceApp + '/**/*.ts';

        this.typings = './tools/typings/';
        this.libraryTypeScriptDefinitions = './tools/typings/**/*.ts';
    }
    return gulpConfig;
})();
module.exports = GulpConfig;