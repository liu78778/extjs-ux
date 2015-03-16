Ext.define('Ext.ux.desktop.ShortcutStore', {
	extend: 'Ext.data.Store',
	model: 'Ext.ux.desktop.ShortcutModel',
	proxy: {
        type: 'ajax',
        url : Wing.userMenuService
    }
});