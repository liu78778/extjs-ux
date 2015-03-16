/**
 * @class Bleext.desktop.Shortcuts
 * @extends Ext.view.View
 * requires 
 * @autor Crysfel Villa
 * @date Thu Jul 28 23:10:29 CDT 2011
 *
 * Description
 *
 *
 **/

Ext.define("Ext.ux.desktop.Shortcuts",{
	extend		: "Ext.view.View",
	cls			: "wing-shortcuts-view",
	overItemCls : 'wing-shortcut-over',
    trackOver	: true,
    itemSelector: "div.wing-shortcut",
	config		: {
		iconWidth	: 48
	},
	requires: [
        'Ext.ux.desktop.ShortcutStore'
    ],
    style: {
        position: 'absolute'
    },
    x: 0, y: 0,
    
    shortcutTpl: [
		'<div class="wing-shorcuts-container">',
        '<tpl for=".">',
            '<div class="wing-shortcut">',
                '<div class="ux-desktop-shortcut-icon {image}-shortcut-icon">',
                    '<img src="', Ext.BLANK_IMAGE_URL, '" title="{title}">',
                '</div>',
                '<span class="wing-shortcut-text">{title}</span>',
            '</div>',
        '</tpl>',
        '</div>'
    ],

	initComponent: function() {
        var me = this,
            menus = Ext.decode(Ext.util.Cookies.get('qo-preferences-shortcuts'));
		me.store = Ext.create('Ext.ux.desktop.ShortcutStore');
		if(menus){
			me.store.loadData(menus);
		}
        me.tpl = new Ext.XTemplate(me.shortcutTpl);

		me.initConfig(arguments);
		me.callParent();
		
        me.on('resize', me.refreshView, me);
        me.on('viewready', me.refreshView, me);
	},
	
	refreshView: function(){
		var me = this,
			container = me.el.select(".wing-shorcuts-container").first();
			
		if(container){
			container.setWidth((me.getIconWidth() + 40) * me.calculateColumns());
		}
	},
	
	calculateColumns: function(){
		var me = this,
			total = me.store.getCount(),
			shortcut = me.el.select(".wing-shortcut").first();
			itemsPerColumn = 0; 
			
		if(shortcut){
			itemsPerColumn = Math.floor(me.el.getHeight()/(shortcut.getHeight()+20));
		}	

		return itemsPerColumn > 0?Math.ceil(total/itemsPerColumn):itemsPerColumn;	
	},
    
    setFontColor: function(hex){
    	Ext.util.CSS.updateRule('.wing-shortcuts-view .wing-shortcut .wing-shortcut-text', 'color', '#' + hex);
    }
});