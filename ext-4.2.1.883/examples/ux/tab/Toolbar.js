Ext.define('Ext.ux.tab.Toolbar', {
    alias: 'plugin.tabtoolbar',
    
    /**
     * @cfg {String} position The position where the toolbar will appear inside the tabbar. Supported values are
     * 'left' and 'right' (defaults to right).
     */
    position: 'right',

    constructor: function(config) {
        config = config || {};
        Ext.apply(this, config);
    },
    
    //private
    init: function(tabPanel) {
        var me = this;

        Ext.apply(tabPanel, me.parentOverrides);
        me.tabPanel = tabPanel;
        
        // ensure we have a valid position
        if (this.position !== 'left') {
            this.position = 'right';
        }

        tabPanel.on({
            render: function() {
                me.tabBar = tabPanel.tabBar;
                me.layout = me.tabBar.layout;
                me.layout.availableSpaceOffset = me.width;
            },
            afterrender: function() {
                var contentEl = me.tabBar.body.createChild({
                        style: 'width:' + me.width + 'px;',
                        cls: Ext.baseCSSPrefix + 'tab-toolbar-' + me.position
                    }, me.tabBar.body.child('.' + Ext.baseCSSPrefix + 'box-scroller-' + me.position));

                me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
                    cls: 'x-tab-toolbar',
                    renderTo: contentEl,
                    items: me.items || []
                });
            },
            beforedestroy: function() {
                me.toolbar.destroy();
            },
            single: true
        });
    }
});