/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Ext.ux.desktop.StartMenu', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.menu.Menu',
        'Ext.toolbar.Toolbar'
    ],

    ariaRole: 'menu',

    cls: 'x-menu ux-start-menu',

    defaultAlign: 'bl-tl',

    iconCls: 'user',

    floating: true,

    shadow: true,

    // We have to hardcode a width because the internal Menu cannot drive our width.
    // This is combined with changing the align property of the menu's layout from the
    // typical 'stretchmax' to 'stretch' which allows the the items to fill the menu
    // area.
    width: 300,
	height	: 300,

    initComponent: function() {
        var me = this;

        
        me.menu = new Ext.menu.Menu({
            cls: 'ux-start-menu-body',
            border: false,
            floating: false,
            items: []
        });
        
        Ext.Ajax.request({
			url: Wing.userSecurityMenuService,
			scope: me,
			success: function(menus){
				if(menus.responseText){
                    menus = Ext.decode(menus.responseText);
                }
				me.initMenuCls(menus);
				me.menu.add(me.buildMenus(menus));
			}
		});
        
        me.menu.layout.align = 'stretch';

        me.items = [me.menu];
        me.layout = 'fit';

        Ext.menu.Manager.register(me);
        me.callParent();

        me.toolbar = new Ext.toolbar.Toolbar(Ext.apply({
            dock: 'right',
            cls: 'ux-start-menu-toolbar',
            vertical: true,
            width: 100
        }, {
            width: 100,
            items: [
//                {
//                    text:'Settings',
//                    iconCls:'settings',
//                    handler: me.onSettings,
//                    scope: me
//                },
                {
                	text: '个性化设置',
                	iconCls:'settings',
                	handler: me.onPreference,
                	scope: me
                } ,
                '-',
                {
                    text:'注销',
                    iconCls:'logout',
                    handler: me.onLogout,
                    scope: me
                }
            ]
        }));

        me.toolbar.layout.align = 'stretch';
        me.addDocked(me.toolbar);

        delete me.toolItems;

        me.on('deactivate', function () {
            me.hide();
        });
    },
    
    onPreference: function(){
		Ext.require('Wing.desktop.Preference', function(){
			Wing.show('Wing.desktop.Preference', {
				title: '个性化设置',
				width: 600,
				height: 500
			});
		});    
    },
    
    onSettings: function(){
    	Ext.require('Wing.desktop.Settings', function(){
    		Ext.create('Wing.desktop.Settings', {
    			desktop: Wing.App.desktop
    		}).show();
    	});
    },
    
    onLogout: function(){
    	Ext.Ajax.request({
			url: 'service/login/logout',
			success: function(){
				location.replace(Wing.getUrl('login.html'));
			}
		});
    },
    
    addMenuItem: function() {
        var cmp = this.menu;
        cmp.add.apply(cmp, arguments);
    },

    addToolItem: function() {
        var cmp = this.toolbar;
        cmp.add.apply(cmp, arguments);
    },

    showBy: function(cmp, pos, off) {
        var me = this;

        if (me.floating && cmp) {
            me.layout.autoSize = true;
            me.show();

            // Component or Element
            cmp = cmp.el || cmp;

            // Convert absolute to floatParent-relative coordinates if necessary.
            var xy = me.el.getAlignToXY(cmp, pos || me.defaultAlign, off);
            if (me.floatParent) {
                var r = me.floatParent.getTargetEl().getViewRegion();
                xy[0] -= r.x;
                xy[1] -= r.y;
            }
            me.showAt(xy);
            me.doConstrain();
        }
        return me;
    },
    
    //初始化按钮的图标样式
	initMenuCls : function(menus){
		var defaultImage = 'default';
		var cssText = [],
			pathMiddle = " { background-image: url(images/menu/",
			pathEnd = ".png) !important; }";

		function eachMenus(items, cssText, pathMiddle, pathEnd){
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.image && item.image !== defaultImage) {
					cssText.push(
						Ext.String.format(".{0}-icon{1}{0}16x16{2}", item.image, pathMiddle, pathEnd)
						+ Ext.String.format(".x-btn-medium .{0}-icon{1}{0}24x24{2}", item.image, pathMiddle, pathEnd)
						+ Ext.String.format(".x-btn-large .{0}-icon{1}{0}32x32{2}", item.image, pathMiddle, pathEnd)
						+ Ext.String.format(".{0}-shortcut-icon{1}{0}48x48{2}", item.image, pathMiddle, pathEnd))
					;
				}
				if(item.childMenus){
					eachMenus(item.childMenus, cssText, pathMiddle, pathEnd);
				}
			}
		}

		eachMenus(menus, cssText, pathMiddle, pathEnd);

		if(cssText.length > 0){
			cssText.push(Ext.String.format(".{0}-icon{1}{0}16x16{2}", defaultImage, pathMiddle, pathEnd)
                + Ext.String.format(".x-btn-medium .{0}-icon{1}{0}24x24{2}", defaultImage, pathMiddle, pathEnd)
                + Ext.String.format(".x-btn-large .{0}-icon{1}{0}32x32{2}", defaultImage, pathMiddle, pathEnd)
                + Ext.String.format(".{0}-shortcut-icon{1}{0}48x48{2}", defaultImage, pathMiddle, pathEnd))
            ;
			Ext.util.CSS.createStyleSheet(cssText.join(''), "menuCls");
			Ext.util.CSS.refreshCache();
		}
	},
    
    //private
	buildMenus: function(menus){
		var result = [];
		Ext.each(menus, function(menu){
			var itemId = menu.id || Ext.util.Format.lowercase(menu.funcName),
				title = menu.title,
				funcName = menu.funcName,
				item = {
					itemId: itemId,
					text: title,
					iconCls: menu.image + '-icon'
				};
				if(funcName){
					item.handler = function(btn){
						Wing.App.runApplication(menu);
					};
				}
			this.buildChildMenus(item, menu.childMenus);
			result.push(item);
		}, this);
		return result;
	},
	
	//private
	buildChildMenus: function(parentMenu, menus){
		var result = [];
		Ext.each(menus, function(menu){
			var itemId = menu.id || Ext.util.Format.lowercase(menu.funcName),
				title = menu.title,
				funcName = menu.funcName,
				item = {
					itemId: itemId,
					text: title,
					iconCls: menu.image + '-icon'
				};
				if(funcName){
					item.handler = function(btn){
						Wing.App.runApplication(menu);
					};
				}
			this.buildChildMenus(item, menu.childMenus);
			result.push(item);
		}, this);
		if(result.length){
			parentMenu.menu = result;
		}
	}
}); // StartMenu

