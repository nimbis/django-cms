'use strict';

// #############################################################################
// User login via the admin panel

var globals = require('./settings/globals');
var messages = require('./settings/messages').page.addContent;

casper.test.begin('User Add Content', function (test) {
    casper
        .start(globals.baseUrl, function () {
            this.click('.cms-toolbar-item-cms-mode-switcher .cms-btn[href="?build"]');
        })
        .waitUntilVisible('.cms-structure', function () {
            test.assertExists('.cms-submenu-add [data-tooltip="Add plugin"]', messages.active);
            this.click('.cms-submenu-add [data-tooltip="Add plugin"]');
        })
        .waitUntilVisible('.cms-plugin-picker .cms-submenu-item [data-rel="add"]', function () {
            this.sendKeys('.cms-quicksearch input', ' ');
            this.waitWhileVisible('.cms-plugin-picker .cms-submenu-item [data-rel="add"]', function () {
                test.assertNotVisible('.cms-plugin-picker .cms-submenu-item [data-rel="add"]', 'No possibility to add text plugin');
                this.capture('test_before.png');
                this.sendKeys('.cms-quicksearch input', 'text', { reset: true });
            });
            this.waitUntilVisible('.cms-plugin-picker .cms-submenu-item [data-rel="add"]', function () {
                test.assertVisible('.cms-plugin-picker .cms-submenu-item [data-rel="add"]', 'No possibility to add text plugin');
                this.capture('test_after.png');
            });
            this.then(function () {
                this.click('.cms-plugin-picker .cms-submenu-item [data-rel="add"]');
            });
            // ensure previous content has been changed
            this.waitWhileVisible('.cms-plugin-picker .cms-submenu-item [data-rel="add"]');
        })
        .withFrame(0, function () {
            casper.waitUntilVisible('#text_form', function () {
                test.assertExists('#text_form', 'Text form exists');
                // explicitly put text to ckeditor
                this.evaluate(function (contentData) {
                    CMS.CKEditor.editor.setData(contentData)
                }, 'some random text');
            });
        })
        .then(function () {
            this.click('.cms-modal-buttons .cms-btn-action.default');
        })
        .then(function () {
            this.click('.cms-toolbar-item-cms-mode-switcher .cms-btn[href="?edit"]');
        })
        .waitUntilVisible('.cms-plugin', function () {
            test.assertSelectorHasText('.cms-plugin p', 'some random text');
        })
        .run(function () {
            test.done();
        });
});
