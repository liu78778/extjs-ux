/**
 * @class Ext.ux.toolbar.PagingOptions
 * @namespace Ext.ux.toolbar
 * @extends Ext.toolbar.Paging
 * @constructor
 * @param {object} configObj
 */
Ext.define('Ext.ux.toolbar.PagingOptions', {
    extend : 'Ext.toolbar.Paging',
    alias: ['widget.pagingoptions'],
    pageSize: 25,

    getPagingItems: function() {
        var me            = this,
            pagingButtons = me.callParent();

        Ext.applyIf(me, {
            pageSizeOptions : [
            	{ pagesize : 5  },
                { pagesize : 10  },
                { pagesize : 15  },
                { pagesize : 20  },
                { pagesize : 25  },
                { pagesize : 50  },
                { pagesize : 100 }
            ]
        });

        pagingButtons.push('-', '显示', me.buildComboBox(), '行数/页');

        return pagingButtons;
    },

    buildComboBox: function() {
        var me = this;

        Ext.define('PageSize', {
            extend : 'Ext.data.Model',
            fields : [
                { name : 'pagesize' , type : 'int'}
            ]
        });

        return {
            xtype           : 'combobox',
            queryMode       : 'local',
            triggerAction   : 'all',
            displayField    : 'pagesize',
            valueField      : 'pagesize',
            width           : 100,
            lazyRender      : true,
            enableKeyEvents : true,
            value           : me.pageSize,
            maskRe      : /[0-9]/,
            allowBlank  : false,
            forceSelection  : me.forceSelection || false,
            store           : new Ext.data.Store({
                model : 'PageSize',
                data  : me.pageSizeOptions
            }),
            listeners       : {
                select   : function(combo, value) {
                    me.onPageSizeSelect(value[0].get('pagesize'));
                },
                keydown : {
                	fn: function(combo) {
	                    me.onPageSizeSelect(combo.getValue());
	                },
	                buffer: 500
                }
            }
        };
    },
    
    onPageSizeSelect: function(pageSize){
    	if(pageSize){
    	    this.store.pageSize = pageSize;
            this.moveFirst();
    	}
    },
    
    initComponent: function(){
    	this.store.pageSize = this.pageSize;
    	this.callParent(arguments);
    },
    
    getPageData : function(){
        var store = this.store,
            totalCount = store.getCount(),
            pageData = {
                total : totalCount,
                currentPage : store.currentPage,
                pageCount: Math.ceil(totalCount / store.pageSize),
                fromRecord: ((store.currentPage - 1) * store.pageSize) + 1,
                toRecord: Math.min(store.currentPage * store.pageSize, totalCount)

            };

        pageData.pageCount = isNaN(pageData.pageCount) ? 1 : pageData.pageCount;
        return pageData;
    },

    /**
     * @Override
     */
    getStoreListeners: function() {
        return Ext.apply(this.callParent(), {
            add: this.onLoad
        });
    }

});