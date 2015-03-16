/**
 * @class Ext.ux.app.PortalColumn
 * @extends Ext.container.Container
 * A layout column class used internally be {@link Ext.ux.app.PortalPanel}.
 */
Ext.define('Ext.ux.app.PortalColumn', {
    extend: 'Ext.container.Container',
    alias: 'widget.portalcolumn',

    requires: [
        'Ext.layout.container.Anchor',
        'Ext.ux.app.Portlet'
    ],

    layout: 'anchor',
    defaultType: 'portlet',
    cls: 'x-portal-column'

    // This is a class so that it could be easily extended
    // if necessary to provide additional behavior.
});