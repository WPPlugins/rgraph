// version: 2016-07-09
    /**
    * o--------------------------------------------------------------------------------o
    * | This file is part of the RGraph package - you can learn more at:               |
    * |                                                                                |
    * |                          http://www.rgraph.net                                 |
    * |                                                                                |
    * | RGraph is dual licensed under the Open Source GPL (General Public License)     |
    * | v2.0 license and a commercial license which means that you're not bound by     |
    * | the terms of the GPL. The commercial license starts at just 99 GBP and      |
    * | you can read about it here:                                                    |
    * |                                                                                |
    * |                      http://www.rgraph.net/license                             |
    * o--------------------------------------------------------------------------------o
    */

    RGraph = window.RGraph || {isRGraph: true};

    /**
    * The horizontal bar chart constructor. The horizontal bar is a minor variant
    * on the bar chart. If you have big labels, this may be useful as there is usually
    * more space available for them.
    * 
    * @param object canvas The canvas object
    * @param array  data   The chart data
    */
    RGraph.HBar = function (conf)
    {
        /**
        * Allow for object config style
        */
        if (   typeof conf === 'object'
            && typeof conf.data === 'object'
            && typeof conf.id === 'string') {

            var id                        = conf.id
            var canvas                    = document.getElementById(id);
            var data                      = conf.data;
            var parseConfObjectForOptions = true; // Set this so the config is parsed (at the end of the constructor)
        
        } else {
        
            var id     = conf;
            var canvas = document.getElementById(id);
            var data   = arguments[1];
        }


        this.id                = id;
        this.canvas            = canvas;
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d", {alpha: (typeof id === 'object' && id.alpha === false) ? false : true}) : null;
        this.canvas.__object__ = this;
        this.data              = data;
        this.type              = 'hbar';
        this.isRGraph          = true;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed      = false;
        this.coords            = [];
        this.coords2           = [];
        this.coordsText        = [];
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false



        
        this.max = 0;
        this.stackedOrGrouped  = false;

        // Default properties
        this.properties =
        {
            'chart.gutter.left':            75,
            'chart.gutter.left.autosize':   false,
            'chart.gutter.right':           25,
            'chart.gutter.top':             25,
            'chart.gutter.bottom':          25,
            'chart.background.grid':        true,
            'chart.background.grid.color':  '#ddd',
            'chart.background.grid.width':  1,
            'chart.background.grid.hsize':  25,
            'chart.background.grid.vsize':  25,
            'chart.background.barcolor1':   'rgba(0,0,0,0)',
            'chart.background.barcolor2':   'rgba(0,0,0,0)',
            'chart.background.grid.hlines': true,
            'chart.background.grid.vlines': true,
            'chart.background.grid.border': true,
            'chart.background.grid.autofit':true,
            'chart.background.grid.autofit.align':true,
            'chart.background.grid.autofit.numhlines': null,
            'chart.background.grid.autofit.numvlines': 5,
            'chart.background.grid.dashed': false,
            'chart.background.grid.dotted': false,
            'chart.background.color':       null,
            'chart.linewidth':              1,
            'chart.title':                  '',
            'chart.title.background':       null,
            'chart.title.xaxis':            '',
            'chart.title.xaxis.bold':       true,
            'chart.title.xaxis.size':       null,
            'chart.title.xaxis.font':       null,
            'chart.title.yaxis':            '',
            'chart.title.yaxis.bold':       true,
            'chart.title.yaxis.size':       null,
            'chart.title.yaxis.font':       null,
            'chart.title.yaxis.color':      null,
            'chart.title.xaxis.pos':        null,
            'chart.title.yaxis.pos':        0.8,
            'chart.title.yaxis.x':          null,
            'chart.title.yaxis.y':          null,
            'chart.title.xaxis.x':          null,
            'chart.title.xaxis.y':          null,
            'chart.title.hpos':             null,
            'chart.title.vpos':             null,
            'chart.title.bold':             true,
            'chart.title.font':             null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,
            'chart.text.size':              12,
            'chart.text.color':             'black',
            'chart.text.font':              'Segoe UI, Arial, Verdana, sans-serif',
            'chart.text.accessible':               true,
            'chart.text.accessible.overflow':      'visible',
            'chart.text.accessible.pointerevents': true,
            'chart.colors':                 ['red', 'blue', 'green', 'pink', 'yellow', 'cyan', 'navy', 'gray', 'black'],
            'chart.colors.sequential':      false,
            'chart.xlabels.specific':       null,
            'chart.labels':                 [],
            'chart.labels.bold':            false,
            'chart.labels.color':           null,

            'chart.labels.above':           false,
            'chart.labels.above.decimals':  0,
            'chart.labels.above.specific':  null,
            'chart.labels.above.color':     null,
            'chart.labels.above.units.pre':  '',
            'chart.labels.above.units.post': '',
            'chart.labels.above.font':       null,
            'chart.labels.above.size':       null,
            'chart.labels.above.bold':       false,
            'chart.labels.above.italic':     false,

            'chart.labels.offsetx':  0,
            'chart.labels.offsety':  0,
            'chart.xlabels.offsetx':  0,
            'chart.xlabels.offsety':  0,
            'chart.xlabels':                true,
            'chart.xlabels.count':          5,
            'chart.contextmenu':            null,
            'chart.key':                    null,
            'chart.key.background':         'white',
            'chart.key.position':           'graph',
            'chart.key.halign':             'right',
            'chart.key.shadow':             false,
            'chart.key.shadow.color':       '#666',
            'chart.key.shadow.blur':        3,
            'chart.key.shadow.offsetx':     2,
            'chart.key.shadow.offsety':     2,
            'chart.key.position.gutter.boxed': false,
            'chart.key.position.x':         null,
            'chart.key.position.y':         null,
            'chart.key.color.shape':        'square',
            'chart.key.rounded':            true,
            'chart.key.linewidth':          1,
            'chart.key.colors':             null,
            'chart.key.interactive':        false,
            'chart.key.interactive.highlight.chart.stroke': 'black',
            'chart.key.interactive.highlight.chart.fill':'rgba(255,255,255,0.7)',
            'chart.key.interactive.highlight.label':'rgba(255,0,0,0.2)',
            'chart.key.text.color':         'black',
            'chart.units.pre':              '',
            'chart.units.post':             '',
            'chart.units.ingraph':          false,
            'chart.strokestyle':            'rgba(0,0,0,0)',
            'chart.xmin':                   0,
            'chart.xmax':                   0,
            'chart.axis.color':             'black',
            'chart.shadow':                 false,
            'chart.shadow.color':           '#666',
            'chart.shadow.blur':            3,
            'chart.shadow.offsetx':         3,
            'chart.shadow.offsety':         3,
            'chart.vmargin':                2,
            'chart.vmargin.grouped':        2,
            'chart.grouping':               'grouped',
            'chart.tooltips':               null,
            'chart.tooltips.event':         'onclick',
            'chart.tooltips.effect':        'fade',
            'chart.tooltips.css.class':     'RGraph_tooltip',
            'chart.tooltips.highlight':     true,
            'chart.highlight.fill':         'rgba(255,255,255,0.7)',
            'chart.highlight.stroke':       'rgba(0,0,0,0)',
            'chart.highlight.style':        null,
            'chart.annotatable':            false,
            'chart.annotate.color':         'black',
            'chart.zoom.factor':            1.5,
            'chart.zoom.fade.in':           true,
            'chart.zoom.fade.out':          true,
            'chart.zoom.hdir':              'right',
            'chart.zoom.vdir':              'down',
            'chart.zoom.frames':            25,
            'chart.zoom.delay':             16.666,
            'chart.zoom.shadow':            true,
            'chart.zoom.background':        true,
            'chart.zoom.action':            'zoom',
            'chart.resizable':              false,
            'chart.resize.handle.adjust':   [0,0],
            'chart.resize.handle.background': null,
            'chart.scale.point':            '.',
            'chart.scale.thousand':         ',',
            'chart.scale.decimals':         null,
            'chart.scale.zerostart':        true,
            'chart.noredraw':               false,
            'chart.events.click':           null,
            'chart.events.mousemove':       null,
            'chart.noxaxis':                false,
            'chart.noyaxis':                false,
            'chart.noaxes':                 false,
            'chart.noxtickmarks':           false,
            'chart.noytickmarks':           false,
            'chart.numyticks':              data.length,
            'chart.numxticks':              10,
            'chart.variant':                'hbar',
            'chart.variant.threed.angle':   0.1,
            'chart.variant.threed.offsetx': 10,
            'chart.variant.threed.offsety': 5,
            'chart.variant.threed.xaxis':   true,
            'chart.variant.threed.yaxis':   true,
            'chart.yaxispos':               'left',
            'chart.variant':                'hbar',
            'chart.clearto':   'rgba(0,0,0,0)'
        }

        // Check for support
        if (!this.canvas) {
            alert('[HBAR] No canvas support');
            return;
        }

        // This loop is used to check for stacked or grouped charts and now
        // also to convert strings to numbers
        for (i=0,len=this.data.length; i<len; ++i) {
            if (typeof this.data[i] == 'object' && !RGraph.isNull(this.data[i])) {
                
                this.stackedOrGrouped = true;
                
                for (var j=0,len2=this.data[i].length; j<len2; ++j) {
                    if (typeof this.data[i][j] === 'string') {
                        this.data[i][j] = parseFloat(this.data[i][j]);
                    }
                }

            } else if (typeof this.data[i] == 'string') {
                this.data[i] = parseFloat(this.data[i]) || 0;
            }
        }


        /**
        * Create the dollar objects so that functions can be added to them
        */
        var linear_data = RGraph.arrayLinearize(data);
        for (var i=0,len=linear_data.length; i<len; ++i) {
            this['$' + i] = {};
        }



        /**
        * Create the linear data array
        */
        this.data_arr = RGraph.arrayLinearize(this.data);


        /**
        * Translate half a pixel for antialiasing purposes - but only if it hasn't beeen
        * done already
        */
        if (!this.canvas.__rgraph_aa_translated__) {
            this.context.translate(0.5,0.5);
            
            this.canvas.__rgraph_aa_translated__ = true;
        }




        // Short variable names
        var RG   = RGraph,
            ca   = this.canvas,
            co   = ca.getContext('2d'),
            prop = this.properties,
            pa2  = RG.path2,
            win  = window,
            doc  = document,
            ma   = Math
        
        
        
        /**
        * "Decorate" the object with the generic effects if the effects library has been included
        */
        if (RG.Effects && typeof RG.Effects.decorate === 'function') {
            RG.Effects.decorate(this);
        }




        /**
        * A setter
        * 
        * @param name  string The name of the property to set
        * @param value mixed  The value of the property
        */
        this.set =
        this.Set = function (name)
        {
            var value = typeof arguments[1] === 'undefined' ? null : arguments[1];

            /**
            * the number of arguments is only one and it's an
            * object - parse it for configuration data and return.
            */
            if (arguments.length === 1 && typeof name === 'object') {
                RG.parseObjectStyleConfig(this, name);
                return this;
            }



    
            /**
            * This should be done first - prepend the propertyy name with "chart." if necessary
            */
            if (name.substr(0,6) != 'chart.') {
                name = 'chart.' + name;
            }
            
            
            
            // Convert uppercase letters to dot+lower case letter
            while(name.match(/([A-Z])/)) {
                name = name.replace(/([A-Z])/, '.' + RegExp.$1.toLowerCase());
            }
    
            if (name == 'chart.labels.abovebar') {
                name = 'chart.labels.above';
            }

            prop[name] = value;
    
            return this;
        };




        /**
        * A getter
        * 
        * @param name  string The name of the property to get
        */
        this.get =
        this.Get = function (name)
        {
            /**
            * This should be done first - prepend the property name with "chart." if necessary
            */
            if (name.substr(0,6) != 'chart.') {
                name = 'chart.' + name;
            }
            
            // Convert uppercase letters to dot+lower case letter
            while(name.match(/([A-Z])/)) {
                name = name.replace(/([A-Z])/, '.' + RegExp.$1.toLowerCase());
            }


            if (name == 'chart.labels.abovebar') {
                name = 'chart.labels.above';
            }

            return prop[name];
        };




        /**
        * The function you call to draw the bar chart
        */
        this.draw =
        this.Draw = function ()
        {
            /**
            * Fire the onbeforedraw event
            */
            RG.FireCustomEvent(this, 'onbeforedraw');




            //
            // If the chart is 3d then angle it it
            //

            if (prop['chart.variant'] === '3d') {
                
                if (prop['chart.text.accessible']) {
                    // Nada
                } else {
                    co.setTransform(1,prop['chart.variant.threed.angle'],0,1,0.5,0.5);
                }
                
                // Enlarge the gutter if its 25
                if (prop['chart.gutter.bottom'] === 25) {
                    this.set('gutterBottom', 80);
                }
            }



    
            /**
            * Parse the colors. This allows for simple gradient syntax
            */
            if (!this.colorsParsed) {
                this.parseColors();
                
                // Don't want to do this again
                this.colorsParsed = true;
            }
            
            
            
            
            
            
            /**
            * Accomodate autosizing the left gutter
            */
            if (prop['chart.gutter.left.autosize']) {
                var len    = 0;
                var labels = prop['chart.labels'];
                var font   = prop['chart.text.font'];
                var size   = prop['chart.text.size'];

                for (var i=0; i<labels.length; i+=1) {
                    var length = RG.measureText(labels[i], false, font, size)[0] || 0
                    len = ma.max(len, length);
                }
                
                prop['chart.gutter.left'] = len + 10;
            }
            
            
            
            
            
            
            
            
            
            
            
    
    
            /**
            * This is new in May 2011 and facilitates indiviual gutter settings,
            * eg chart.gutter.left
            */
            this.gutterLeft   = prop['chart.gutter.left'];
            this.gutterRight  = prop['chart.gutter.right'];
            this.gutterTop    = prop['chart.gutter.top'];
            this.gutterBottom = prop['chart.gutter.bottom'];

            


            /**
            * Stop the coords array from growing uncontrollably
            */
            this.coords     = [];
            this.coords2    = [];
            this.coordsText = [];
            this.max        = 0;
    
            /**
            * Check for chart.xmin in stacked charts
            */
            if (prop['chart.xmin'] > 0 && prop['chart.grouping'] == 'stacked') {
                alert('[HBAR] Using chart.xmin is not supported with stacked charts, resetting chart.xmin to zero');
                this.Set('chart.xmin', 0);
            }
    
            /**
            * Work out a few things. They need to be here because they depend on things you can change before you
            * call Draw() but after you instantiate the object
            */
            this.graphwidth     = ca.width - this.gutterLeft - this.gutterRight;
            this.graphheight    = ca.height - this.gutterTop - this.gutterBottom;
            this.halfgrapharea  = this.grapharea / 2;
            this.halfTextHeight = prop['chart.text.size'] / 2;
            this.halfway = ma.round((this.graphwidth / 2) + this.gutterLeft)
    
    
    
    
    
    
            // Progressively Draw the chart
            RG.Background.draw(this);
    
            this.Drawbars();
            this.DrawAxes();
            this.DrawLabels();
    
    
            // Draw the key if necessary
            if (prop['chart.key'] && prop['chart.key'].length) {
                RG.DrawKey(this, prop['chart.key'], prop['chart.colors']);
            }
    
    
    
            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.ShowContext(this);
            }


    
            /**
            * Draw "in graph" labels
            */
            RG.DrawInGraphLabels(this);
    
            
            /**
            * This function enables resizing
            */
            if (prop['chart.resizable']) {
                RG.AllowResizing(this);
            }
    
    
            /**
            * This installs the event listeners
            */
            RG.InstallEventListeners(this);
    

            /**
            * Fire the onfirstdraw event
            */
            if (this.firstDraw) {
                RG.fireCustomEvent(this, 'onfirstdraw');
                this.firstDraw = false;
                this.firstDrawFunc();
            }



            /**
            * Fire the RGraph ondraw event
            */
            RG.FireCustomEvent(this, 'ondraw');

            return this;
        };
        
        
        
        /**
        * Used in chaining. Runs a function there and then - not waiting for
        * the events to fire (eg the onbeforedraw event)
        * 
        * @param function func The function to execute
        */
        this.exec = function (func)
        {
            func(this);
            
            return this;
        };




        /**
        * This draws the axes
        */
        this.drawAxes =
        this.DrawAxes = function ()
        {
            var halfway = this.halfway






            co.beginPath();
                
                co.lineWidth   = prop['chart.axis.linewidth'] ? prop['chart.axis.linewidth'] + 0.001 : 1.001;
                co.strokeStyle = prop['chart.axis.color'];




                // Draw the Y axis
                if (prop['chart.noyaxis'] == false && prop['chart.noaxes'] == false) {
                    if (prop['chart.yaxispos'] == 'center') {
                        co.moveTo(halfway, this.gutterTop);
                        co.lineTo(halfway, ca.height - this.gutterBottom);
                    
                    } else if (prop['chart.yaxispos'] == 'right') {
                        co.moveTo(ca.width - this.gutterRight, this.gutterTop);
                        co.lineTo(ca.width - this.gutterRight, ca.height - this.gutterBottom);
                    
                    } else {
                        co.moveTo(this.gutterLeft, this.gutterTop);
                        co.lineTo(this.gutterLeft, ca.height - this.gutterBottom);
                    }
                }
    
                // Draw the X axis
                if (prop['chart.noxaxis'] == false && prop['chart.noaxes'] == false) {
                    co.moveTo(this.gutterLeft +0.001, ca.height - this.gutterBottom + 0.001);
                    co.lineTo(ca.width - this.gutterRight + 0.001, ca.height - this.gutterBottom + 0.001);
                }
    
                // Draw the Y tickmarks
                if (   prop['chart.noytickmarks'] == false
                    && prop['chart.noyaxis'] == false
                    && prop['chart.numyticks'] > 0
                    && prop['chart.noaxes'] == false
                   ) {
        
                    var yTickGap = (ca.height - this.gutterTop - this.gutterBottom) / (prop['chart.numyticks'] > 0 ? prop['chart.numyticks'] : this.data.length);
            
                    for (y=this.gutterTop; y<(ca.height - this.gutterBottom - 1); y+=yTickGap) {
                        if (prop['chart.yaxispos'] == 'center') {
                            co.moveTo(halfway + 3, ma.round(y));
                            co.lineTo(halfway  - 3, ma.round(y));

                        } else if (prop['chart.yaxispos'] == 'right') {
                            co.moveTo(ca.width - this.gutterRight, ma.round(y));
                            co.lineTo(ca.width - this.gutterRight + 3, ma.round(y));

                        } else {
                            co.moveTo(this.gutterLeft, ma.round(y));
                            co.lineTo( this.gutterLeft  - 3, ma.round(y));
                        }
                    }
                    
                    // If the X axis isn't being shown draw the end tick
                    if (prop['chart.noxaxis'] == true) {
                        if (prop['chart.yaxispos'] == 'center') {
                            co.moveTo(halfway + 3, ma.round(y));
                            co.lineTo(halfway  - 3, ma.round(y));
                        
                        } else if (prop['chart.yaxispos'] == 'right') {
                            co.moveTo(ca.width - this.gutterRight, ma.round(y));
                            co.lineTo(ca.width - this.gutterRight + 3, ma.round(y));

                        } else {
                            co.moveTo(this.gutterLeft, ma.round(y));
                            co.lineTo( this.gutterLeft  - 3, ma.round(y));
                        }
                    }
                }
        
        
                // Draw the X tickmarks
                if (   prop['chart.noxtickmarks'] == false
                    && prop['chart.noxaxis'] == false
                    && prop['chart.numxticks'] > 0
                    && prop['chart.noaxes'] == false) {

                    xTickGap = (ca.width - this.gutterLeft - this.gutterRight ) / prop['chart.numxticks'];
                    yStart   = ca.height - this.gutterBottom;
                    yEnd     = (ca.height - this.gutterBottom) + 3;





                    var i = prop['chart.numxticks']
                    
                    while(i--) {

                        var x   = ca.width - this.gutterRight - (i * xTickGap);
                        
                        if (prop['chart.yaxispos'] === 'right') {
                            x -= xTickGap;
                        }

                        co.moveTo(ma.round(x), yStart);
                        co.lineTo(ma.round(x), yEnd);
                    }



                    if (prop['chart.yaxispos'] === 'center') {
                        var i = 5; while (i--) {
                            var x   = this.gutterLeft + (xTickGap * i);

                            co.moveTo(ma.round(x), yStart);
                            co.lineTo(ma.round(x), yEnd);
                            
                        }
                    }





                    // If the Y axis isn't being shown draw the end tick
                    if (prop['chart.noyaxis'] == true) {
                        co.moveTo(this.gutterLeft, ma.round(yStart));
                        co.lineTo( this.gutterLeft, ma.round(yEnd));
                    }
                }
            co.stroke();
                
            /**
            * Reset the linewidth
            */
            co.lineWidth = 1;
        };




        /**
        * This draws the labels for the graph
        */
        this.drawLabels =
        this.DrawLabels = function ()
        {
            var units_pre  = prop['chart.units.pre'],
                units_post = prop['chart.units.post'],
                text_size  = prop['chart.text.size'],
                font       = prop['chart.text.font'],
                offsetx    = prop['chart.xlabels.offsetx'],
                offsety    = prop['chart.xlabels.offsety']
    
    
    
            /**
            * Set the units to blank if they're to be used for ingraph labels only
            */
            if (prop['chart.units.ingraph']) {
                units_pre  = '';
                units_post = '';
            }
    
    
            /**
            * Draw the X axis labels
            */
            if (prop['chart.xlabels']) {
            
                /**
                * Specific X labels
                */
                if (RG.isArray(prop['chart.xlabels.specific'])) {

                    if (prop['chart.yaxispos'] == 'center') {

                        var halfGraphWidth = this.graphwidth / 2;
                        var labels         = prop['chart.xlabels.specific'];
                        var interval       = (this.graphwidth / 2) / (labels.length - 1);

                        co.fillStyle = prop['chart.text.color'];

                        for (var i=0; i<labels.length; i+=1) {
                                RG.text2(this, {
                                    'font':font,
                                    'size':text_size,
                                    'x':this.gutterLeft + halfGraphWidth + (interval * i) + offsetx,
                                    'y':ca.height - this.gutterBottom + offsetx,
                                    'text':labels[i],
                                    'valign':'top',
                                    'halign':'center',
                                    'tag': 'scale'
                                });
                        }
                        
                        for (var i=(labels.length - 1); i>0; i-=1) {
                                RG.Text2(this, {
                                    'font':font,
                                    'size':text_size,
                                    'x':this.gutterLeft + (interval * (labels.length - i - 1)) + offsetx,
                                    'y':ca.height - this.gutterBottom + offsety,
                                    'text':labels[i],
                                    'valign':'top',
                                    'halign':'center',
                                    'tag': 'scale'
                                });
                        }

                    } else if (prop['chart.yaxispos'] == 'right') {

                        var labels         = prop['chart.xlabels.specific'];
                        var interval       = this.graphwidth / (labels.length - 1);

                        co.fillStyle = prop['chart.text.color'];
                        
                        for (var i=0; i<labels.length; i+=1) {
                                RG.text2(this, {
                                    'font': font,
                                    'size': text_size,
                                    'x':    this.gutterLeft + (interval * i) + offsetx,
                                    'y':    ca.height - this.gutterBottom + offsety,
                                    'text': labels[labels.length - i - 1],
                                   'valign':'top',
                                   'halign':'center',
                                    'tag':  'scale'
                                });
                        }

                    } else {

                        var labels   = prop['chart.xlabels.specific'];
                        var interval = this.graphwidth / (labels.length - 1);
                        
                        co.fillStyle = prop['chart.text.color'];
                        
                        for (var i=0; i<labels.length; i+=1) {
                                RG.text2(this, {
                                    font:  font,
                                    size:  text_size,
                                    x:     this.gutterLeft + (interval * i) + offsetx,
                                    y:     ca.height - this.gutterBottom + offsety,
                                    text:  labels[i],
                                    valign:'top',
                                    halign:'center',
                                    tag:   'scale'
                                });
                        }
                    }

                /**
                * Draw an X scale
                */
                } else {
    
                    var gap = 7;
        
                    co.beginPath();
                    co.fillStyle = prop['chart.text.color'];
        
        
                    if (prop['chart.yaxispos'] == 'center') {
        
                        for (var i=0; i<this.scale2.labels.length; ++i) {
                            RG.text2(this, {
                                'font':font,
                                'size':text_size,
                                'x':this.gutterLeft + (this.graphwidth / 2) - ((this.graphwidth / 2) * ((i+1)/this.scale2.labels.length)) + offsetx,
                                'y':this.gutterTop + this.halfTextHeight + this.graphheight + gap + offsety,
                                'text':'-' + this.scale2.labels[i],
                                'valign':'center',
                                'halign':'center',
                                'tag': 'scale'
                            });
                        }
        
                        for (var i=0; i<this.scale2.labels.length; ++i) {
                            RG.text2(this, {
                                'font':font,
                                'size':text_size,
                                'x':this.gutterLeft + ((this.graphwidth / 2) * ((i+1)/this.scale2.labels.length)) + (this.graphwidth / 2) + offsetx,
                                'y':this.gutterTop + this.halfTextHeight + this.graphheight + gap + offsety,
                                'text':this.scale2.labels[i],
                                'valign':'center',
                                'halign':'center',
                                'tag': 'scale'
                            });
                        }
                
                    }else if (prop['chart.yaxispos'] == 'right') {

                    
                        for (var i=0,len=this.scale2.labels.length; i<len; ++i) {
                            RG.Text2(this, {
                                'font':font,
                                'size':text_size,
                                'x':this.gutterLeft + (i * (this.graphwidth / len)) + offsetx,
                                'y':this.gutterTop + this.halfTextHeight + this.graphheight + gap + offsety,
                                'text':'-' + this.scale2.labels[len - 1 - i],
                                'valign':'center',
                                'halign':'center',
                                'tag': 'scale'
                            });
                        }


                    } else {
                        for (var i=0,len=this.scale2.labels.length; i<len; ++i) {
                            RG.Text2(this, {
                                'font':font,
                                'size':text_size,
                                'x':this.gutterLeft + (this.graphwidth * ((i+1)/len)) + offsetx,
                                'y':this.gutterTop + this.halfTextHeight + this.graphheight + gap + offsety,
                                'text':this.scale2.labels[i],
                                'valign':'center',
                                'halign':'center',
                                'tag': 'scale'
                            });
                        }
                    }
        
                    /**
                    * If xmin is not zero - draw that
                    */
                    if (prop['chart.xmin'] > 0 || prop['chart.noyaxis'] == true || prop['chart.scale.zerostart'] || prop['chart.noaxes']) {

                        var x = prop['chart.yaxispos'] == 'center' ?  this.gutterLeft + (this.graphwidth / 2): this.gutterLeft;
                        
                        /**
                        * Y axis on the right
                        */
                        if (prop['chart.yaxispos'] === 'right') {
                            var x = ca.width - this.gutterRight;
                        }
        
                        RG.text2(this, {
                            'font':font,
                            'size':text_size,
                            'x':x + offsetx,
                            'y':this.gutterTop + this.halfTextHeight + this.graphheight + gap + offsety,
                            'text':RG.numberFormat(this, prop['chart.xmin'].toFixed(prop['chart.xmin'] === 0 ? 0 : prop['chart.scale.decimals']), units_pre, units_post),
                            'valign':'center',
                            'halign':'center',
                            'tag': 'scale'
                        });
                    }
        
                    co.fill();
                    co.stroke();
                }
            }







            /**
            * The Y axis labels
            */
            if (typeof prop['chart.labels'] == 'object') {
            
                var xOffset = prop['chart.variant'] === '3d' && prop['chart.yaxispos'] === 'right' ? 15 : 5,
                    font    = prop['chart.text.font'],
                    color   = prop['chart.labels.color'] || prop['chart.text.color'],
                    bold    = prop['chart.labels.bold'],
                    offsetx = prop['chart.labels.offsetx'],
                    offsety = prop['chart.labels.offsety']
                
    
                // Draw the X axis labels
                co.fillStyle = color;
                
                // How high is each bar
                var barHeight = (ca.height - this.gutterTop - this.gutterBottom ) / prop['chart.labels'].length;
                
                // Reset the yTickGap
                yTickGap = (ca.height - this.gutterTop - this.gutterBottom) / prop['chart.labels'].length

                /**
                * If the Y axis is on the right set the alignment and the X position, otherwise on the left
                */
                if (prop['chart.yaxispos'] === 'right') {
                    var x = ca.width - this.gutterRight + xOffset;
                    var halign = 'left'
                } else {
                    var x = this.gutterLeft - xOffset;
                    var halign = 'right'
                }

                // Draw the X tickmarks
                var i=0;
                for (y=this.gutterTop + (yTickGap / 2); y<=ca.height - this.gutterBottom; y+=yTickGap) {
                
                    RG.text2(this, {
                        'font': font,
                        'size': prop['chart.text.size'],
                        'bold': bold,
                        'x': x + offsetx,
                        'y': y + offsety,
                        'text': String(prop['chart.labels'][i++]),
                        'halign': halign,
                        'valign': 'center',
                        'tag': 'labels'
                    });
                }
            }
        };




        /**
        * This function draws the bars. It also draw 3D axes as the axes drawing bit
        * is don AFTER the bars are drawn
        */
        this.drawbars =
        this.Drawbars = function ()
        {
            co.lineWidth   = prop['chart.linewidth'];
            co.strokeStyle = prop['chart.strokestyle'];
            co.fillStyle   = prop['chart.colors'][0];

            var prevX = 0,
                prevY = 0;
            
    
            /**
            * Work out the max value
            */
            if (prop['chart.xmax']) {

                this.scale2 = RG.getScale2(this, {
                    'max':prop['chart.xmax'],
                    'min':prop['chart.xmin'],
                    'scale.decimals':Number(prop['chart.scale.decimals']),
                    'scale.point':prop['chart.scale.point'],
                    'scale.thousand':prop['chart.scale.thousand'],
                    'scale.round':prop['chart.scale.round'],
                    'units.pre':prop['chart.units.pre'],
                    'units.post':prop['chart.units.post'],
                    'ylabels.count':prop['chart.xlabels.count'],
                    'strict':true
                 });

                this.max = this.scale2.max;
    
            } else {

                var grouping = prop['chart.grouping'];

                for (i=0; i<this.data.length; ++i) {
                    if (typeof(this.data[i]) == 'object') {
                        var value = grouping == 'grouped' ? Number(RG.array_max(this.data[i], true)) : Number(RG.array_sum(this.data[i])) ;
                    } else {
                        var value = Number(ma.abs(this.data[i]));
                    }
    
                    this.max = ma.max(Math.abs(this.max), Math.abs(value));
                }
    
                this.scale2 = RG.getScale2(this, {
                    'max':this.max,
                    'min':prop['chart.xmin'],
                    'scale.decimals':Number(prop['chart.scale.decimals']),
                    'scale.point':prop['chart.scale.point'],
                    'scale.thousand':prop['chart.scale.thousand'],
                    'scale.round':prop['chart.scale.round'],
                    'units.pre':prop['chart.units.pre'],
                    'units.post':prop['chart.units.post'],
                    'ylabels.count':prop['chart.xlabels.count']
                });


                this.max = this.scale2.max;
                this.min = this.scale2.min;
            }
    
            if (prop['chart.scale.decimals'] == null && Number(this.max) == 1) {
                this.Set('chart.scale.decimals', 1);
            }
            
            /**
            * This is here to facilitate sequential colors
            */
            var colorIdx = 0;



            // Draw the 3d axes if necessary
            if (prop['chart.variant'] === '3d') {
                RG.draw3DAxes(this);
            }






            /**
            * The bars are drawn HERE
            */
            var graphwidth = (ca.width - this.gutterLeft - this.gutterRight);
            var halfwidth  = graphwidth / 2;

            for (i=(len=this.data.length-1); i>=0; --i) {

                // Work out the width and height
                var width  = ma.abs((this.data[i] / this.max) *  graphwidth);
                var height = this.graphheight / this.data.length;

                var orig_height = height;

                var x       = this.gutterLeft;
                var y       = this.gutterTop + (i * height);
                var vmargin = prop['chart.vmargin'];
                
                // Account for the Y axis being on the right hand side
                if (prop['chart.yaxispos'] === 'right') {
                    x = ca.width - this.gutterRight - ma.abs(width);
                }

                // Account for negative lengths - Some browsers (eg Chrome) don't like a negative value
                if (width < 0) {
                    x -= width;
                    width = ma.abs(width);
                }
    
                /**
                * Turn on the shadow if need be
                */
                if (prop['chart.shadow']) {
                    co.shadowColor   = prop['chart.shadow.color'];
                    co.shadowBlur    = prop['chart.shadow.blur'];
                    co.shadowOffsetX = prop['chart.shadow.offsetx'];
                    co.shadowOffsetY = prop['chart.shadow.offsety'];
                }

                /**
                * Draw the bar
                */
                co.beginPath();
                
                    // Standard (non-grouped and non-stacked) bars here
                    if (typeof this.data[i] == 'number' || RG.isNull(this.data[i])) {

                        var barHeight = height - (2 * vmargin),
                            barWidth  = ((this.data[i] - prop['chart.xmin']) / (this.max - prop['chart.xmin'])) * this.graphwidth,
                            barX      = this.gutterLeft;
    
                        // Account for Y axis pos
                        if (prop['chart.yaxispos'] == 'center') {
                            barWidth /= 2;
                            barX += halfwidth;
                            
                            if (this.data[i] < 0) {
                                barWidth = (ma.abs(this.data[i]) - prop['chart.xmin']) / (this.max - prop['chart.xmin']);
                                barWidth = barWidth * (this.graphwidth / 2);
                                barX = ((this.graphwidth / 2) + this.gutterLeft) - barWidth;
                            }

                        } else if (prop['chart.yaxispos'] == 'right') {

                            barWidth = ma.abs(barWidth);
                            barX = ca.width - this.gutterRight - barWidth;

                        }

                        // Set the fill color
                        co.strokeStyle = prop['chart.strokestyle'];
                        co.fillStyle   = prop['chart.colors'][0];

                        // Sequential colors
                        if (prop['chart.colors.sequential']) {
                            co.fillStyle = prop['chart.colors'][colorIdx++];
                        }
















                        co.strokeRect(barX, this.gutterTop + (i * height) + prop['chart.vmargin'], barWidth, barHeight);
                        co.fillRect(barX, this.gutterTop + (i * height) + prop['chart.vmargin'], barWidth, barHeight);




















                            



                        this.coords.push([
                            barX,
                            y + vmargin,
                            barWidth,
                            height - (2 * vmargin),
                            co.fillStyle,
                            this.data[i],
                            true
                        ]);






                        // Draw the 3D effect using the coords that have just been stored
                        if (prop['chart.variant'] === '3d' && typeof this.data[i] == 'number') {


                            var prevStrokeStyle = co.strokeStyle,
                                prevFillStyle   = co.fillStyle;

                            /**
                            * Turn off the shadow for the 3D bits
                            */
                            RG.noShadow(this);
                            
                            // DRAW THE 3D BITS HERE
                            var barX    = barX,
                                barY    = y + vmargin,
                                barW    = barWidth,
                                barH    = height - (2 * vmargin),
                                offsetX = prop['chart.variant.threed.offsetx'],
                                offsetY = prop['chart.variant.threed.offsety'],
                                value   = this.data[i];


                            pa2(
                                co,
                                [
                                 'b',
                                 'm', barX, barY,
                                 'l', barX + offsetX - (prop['chart.yaxispos'] == 'left' && value < 0 ? offsetX : 0), barY - offsetY,
                                 'l', barX + barW + offsetX - (prop['chart.yaxispos'] == 'center' && value < 0 ? offsetX : 0), barY - offsetY,
                                 'l', barX + barW, barY,
                                 'c',
                                 's', co.strokeStyle,
                                 'f', co.fillStyle,
                                 'f','rgba(255,255,255,0.6)'//Fill again to lighten it
                                ]
                            );

                            if (   prop['chart.yaxispos'] !== 'right'
                                && !(prop['chart.yaxispos'] === 'center' && value < 0)
                                && value >= 0
                                && !RG.isNull(value)
                               ) {

                                pa2(
                                    co,
                                    [
                                     'b',
                                     'fs', prevFillStyle,
                                     'm', barX + barW, barY,
                                     'l', barX + barW + offsetX, barY - offsetY,
                                     'l', barX + barW + offsetX, barY - offsetY + barH,
                                     'l', barX + barW, barY + barH,
                                     'c',
                                     's', co.strokeStyle,
                                     'f', prevFillStyle,
                                     'f', 'rgba(0,0,0,0.25)'
                                    ]
                                );
                            }

                        }






                    /**
                    * Stacked bar chart
                    */
                    } else if (typeof(this.data[i]) == 'object' && prop['chart.grouping'] == 'stacked') {

                        if (prop['chart.yaxispos'] == 'center') {
                            alert('[HBAR] You can\'t have a stacked chart with the Y axis in the center, change it to grouped');
                        } else if (prop['chart.yaxispos'] == 'right') {
                            var x = ca.width - this.gutterRight
                        }

                        var barHeight = height - (2 * vmargin);

                        if (typeof this.coords2[i] == 'undefined') {
                            this.coords2[i] = [];
                        }

                        for (j=0; j<this.data[i].length; ++j) {

                            // The previous 3D segments would have turned the shadow off - so turn it back on
                            if (prop['chart.shadow'] && prop['chart.variant'] === '3d') {
                                co.shadowColor   = prop['chart.shadow.color'];
                                co.shadowBlur    = prop['chart.shadow.blur'];
                                co.shadowOffsetX = prop['chart.shadow.offsetx'];
                                co.shadowOffsetY = prop['chart.shadow.offsety'];
                            }

                            //
                            // Ensure the number is positive
                            //(even though having the X axis on the right implies a
                            //negative value)
                            //
                            if (!RG.isNull(this.data[i][j])) this.data[i][j] = ma.abs(this.data[i][j]);

    
                            var last = (j === (this.data[i].length - 1) );
                            
                            // Set the fill/stroke colors
                            co.strokeStyle = prop['chart.strokestyle'];
                            co.fillStyle   = prop['chart.colors'][j];
                            
    
                            // Sequential colors
                            if (prop['chart.colors.sequential']) {
                                co.fillStyle = prop['chart.colors'][colorIdx++];
                            }
                            
    
                            var width = (((this.data[i][j]) / (this.max))) * this.graphwidth;
                            var totalWidth = (RG.arraySum(this.data[i]) / this.max) * this.graphwidth;
                            
                            if (prop['chart.yaxispos'] === 'right') {
                                x -= width;
                            }
                            


                            co.strokeRect(x, this.gutterTop + prop['chart.vmargin'] + (this.graphheight / this.data.length) * i, width, height - (2 * vmargin) );
                            co.fillRect(x, this.gutterTop + prop['chart.vmargin'] + (this.graphheight / this.data.length) * i, width, height - (2 * vmargin) );


                            /**
                            * Store the coords for tooltips
                            */
    
                            // The last property of this array is a boolean which tells you whether the value is the last or not
                            this.coords.push([
                                x,
                                y + vmargin,
                                width,
                                height - (2 * vmargin),
                                co.fillStyle,
                                RG.array_sum(this.data[i]),
                                j == (this.data[i].length - 1)
                            ]);

                            this.coords2[i].push([
                                x,
                                y + vmargin,
                                width,
                                height - (2 * vmargin),
                                co.fillStyle,
                                RG.array_sum(this.data[i]),
                                j == (this.data[i].length - 1)
                            ]);






                            // 3D effect
                            if (prop['chart.variant'] === '3d') {
                            
                                /**
                                * Turn off the shadow for the 3D bits
                                */
                                RG.noShadow(this);

                                var prevStrokeStyle = co.strokeStyle,
                                    prevFillStyle   = co.fillStyle;

                                // DRAW THE 3D BITS HERE
                                var barX    = x,
                                    barY    = y + vmargin,
                                    barW    = width,
                                    barH    = height - (2 * vmargin),
                                    offsetX = prop['chart.variant.threed.offsetx'],
                                    offsetY = prop['chart.variant.threed.offsety'],
                                    value   = this.data[i][j];

                                if (!RG.isNull(value)) {
                                    pa2(
                                        co,
                                        [
                                         'b',
                                         'm', barX, barY,
                                         'l', barX + offsetX, barY - offsetY,
                                         'l', barX + barW + offsetX, barY - offsetY,
                                         'l', barX + barW, barY,
                                         'c',
                                         's', co.strokeStyle,
                                         'f', co.fillStyle,
                                         'f','rgba(255,255,255,0.6)'//Fill again to lighten it
                                        ]
                                    );
                                }
    
                                if (   prop['chart.yaxispos'] !== 'right'
                                    && !(prop['chart.yaxispos'] === 'center' && value < 0)
                                    && !RG.isNull(value)
                                   ) {

                                    pa2(
                                        co,
                                        [
                                         'fs', prevFillStyle,
                                         'b',
                                         'm', barX + barW, barY,
                                         'l', barX + barW + offsetX, barY - offsetY,
                                         'l', barX + barW + offsetX, barY - offsetY + barH,
                                         'l', barX + barW, barY + barH,
                                         'c',
                                         's', co.strokeStyle,
                                         'f', prevFillStyle,
                                         'f', 'rgba(0,0,0,0.25)'
                                        ]
                                    );
                                }
                            
                                co.beginPath();
                                co.strokeStyle = prevStrokeStyle;
                                co.fillStyle   = prevFillStyle;
                            }
    
    
    
    
    
    
                            if (prop['chart.yaxispos'] !== 'right') {
                                x += width;
                            }
                        }








                    /**
                    * A grouped bar chart
                    */
                    } else if (typeof(this.data[i]) == 'object' && prop['chart.grouping'] == 'grouped') {

                        var vmarginGrouped      = prop['chart.vmargin.grouped'];
                        var individualBarHeight = ((height - (2 * vmargin) - ((this.data[i].length - 1) * vmarginGrouped)) / this.data[i].length)
                        
                        if (typeof this.coords2[i] == 'undefined') {
                            this.coords2[i] = [];
                        }
                        
                        for (j=(this.data[i].length - 1); j>=0; --j) {

    
                            /**
                            * Turn on the shadow if need be
                            */
                            if (prop['chart.shadow']) {
                                RG.setShadow(this, prop['chart.shadow.color'], prop['chart.shadow.offsetx'], prop['chart.shadow.offsety'], prop['chart.shadow.blur']);
                            }
    
                            // Set the fill/stroke colors
                            co.strokeStyle = prop['chart.strokestyle'];
                            co.fillStyle   = prop['chart.colors'][j];
    
                            // Sequential colors
                            if (prop['chart.colors.sequential']) {
                                co.fillStyle = prop['chart.colors'][colorIdx++];
                            }
    
    
    
                            var startY = this.gutterTop + (height * i) + (individualBarHeight * j) + vmargin + (vmarginGrouped * j);
                            var width = ((this.data[i][j] - prop['chart.xmin']) / (this.max - prop['chart.xmin'])) * (ca.width - this.gutterLeft - this.gutterRight );
                            var startX = this.gutterLeft;
    
    

                            // Account for the Y axis being in the middle
                            if (prop['chart.yaxispos'] == 'center') {
                                width  /= 2;
                                startX += halfwidth;
                            
                            // Account for the Y axis being on the right
                            } else if (prop['chart.yaxispos'] == 'right') {
                                width = ma.abs(width);
                                startX = ca.width - this.gutterRight - ma.abs(width);;
                            }
                            
                            if (width < 0) {
                                startX += width;
                                width *= -1;
                            }
    
                            co.strokeRect(startX, startY, width, individualBarHeight);
                            co.fillRect(startX, startY, width, individualBarHeight);






                            this.coords.push([
                                startX,
                                startY,
                                width,
                                individualBarHeight,
                                co.fillStyle,
                                this.data[i][j],
                                true
                            ]);
    
                            this.coords2[i].push([
                                startX,
                                startY,
                                width,
                                individualBarHeight,
                                co.fillStyle,
                                this.data[i][j],
                                true
                            ]);












                            // 3D effect
                            if (prop['chart.variant'] === '3d') {
                            
                                /**
                                * Turn off the shadow for the 3D bits
                                */
                                RG.noShadow(this);

                                var prevStrokeStyle = co.strokeStyle,
                                    prevFillStyle   = co.fillStyle;
                            
                                // DRAW THE 3D BITS HERE
                                var barX    = startX,
                                    barY    = startY,
                                    barW    = width,
                                    barH    = individualBarHeight,
                                    offsetX = prop['chart.variant.threed.offsetx'],
                                    offsetY = prop['chart.variant.threed.offsety'],
                                    value   = this.data[i][j];
                                
                                pa2(
                                    co,
                                    [
                                     'b',
                                     'm', barX, barY,
                                     'l', barX + offsetX, barY - offsetY,
                                     'l', barX + barW + offsetX - (value < 0 ? offsetX : 0), barY - offsetY,
                                     'l', barX + barW, barY,
                                     'c',
                                     's', co.strokeStyle,
                                     'f', co.fillStyle,
                                     'f','rgba(255,255,255,0.6)'//Fill again to lighten it
                                    ]
                                );
    
                                if (   prop['chart.yaxispos'] !== 'right'
                                    && !(prop['chart.yaxispos'] === 'center' && value < 0)
                                    && value >= 0
                                    && !RG.isNull(value)
                                   ) {

                                    pa2(
                                        co,
                                        [
                                         'fs', prevFillStyle,
                                         'b',
                                         'm', barX + barW, barY,
                                         'l', barX + barW + offsetX, barY - offsetY,
                                         'l', barX + barW + offsetX, barY - offsetY + barH,
                                         'l', barX + barW, barY + barH,
                                         'c',
                                         's', co.strokeStyle,
                                         'f', prevFillStyle,
                                         'f', 'rgba(0,0,0,0.25)'
                                        ]
                                    );
                                }





                                co.beginPath();
                                co.strokeStyle = prevStrokeStyle;
                                co.fillStyle   = prevFillStyle;
                            }






                        }
                        
                        startY += vmargin;
                    }
    
                co.closePath();
            }
    
            co.stroke();
            co.fill();
            
            // Under certain circumstances we can cover the shadow
            // overspill with a white rectangle
            if (prop['chart,yaxispos'] === 'right') {
                pa2(co, 'cr % % % %',
                    ca.width - this.gutterRight + prop['chart.variant.threed.offsetx'],
                    '0',
                    this.gutterRight,
                    ca.height
                );
            }






            // Draw the 3d axes AGAIN if the Y axis is on the right
            if (   prop['chart.yaxispos'] === 'right'
                && prop['chart.variant'] === '3d'
               ) {
                RG.draw3DYAxis(this);
            }
    
            /**
            * Now the bars are stroke()ed, turn off the shadow
            */
            RG.noShadow(this);
            
            
            //
            // Reverse the coords arrays as the bars are drawn from the borrom up now
            //
            this.coords  = RG.arrayReverse(this.coords);
            
            if (prop['chart.grouping'] === 'grouped') {
                for (var i=0; i<this.coords2.length; ++i) {
                    this.coords2[i] = RG.arrayReverse(this.coords2[i]);
                }
            }
            

            this.redrawBars();
        };




        /**
        * This function goes over the bars after they been drawn, so that upwards shadows are underneath the bars
        */
        this.redrawBars =
        this.RedrawBars = function ()
        {
            if (prop['chart.noredraw']) {
                return;
            }
    
            var coords = this.coords;
    
            var font   = prop['chart.text.font'],
                size   = prop['chart.text.size'],
                color  = prop['chart.text.color'];
    
            RG.noShadow(this);
            co.strokeStyle = prop['chart.strokestyle'];
    
            for (var i=0; i<coords.length; ++i) {

                if (prop['chart.shadow']) {
                    
                    pa2(co, 'b lw % r % % % % s % f %',
                        prop['chart.linewidth'],
                        coords[i][0],
                        coords[i][1],
                        coords[i][2],
                        coords[i][3],
                        prop['chart.strokestyle'],
                        coords[i][4]
                    );
                }
    
                /**
                * Draw labels "above" the bar
                */
                var halign = 'left';
                if (prop['chart.labels.above'] && coords[i][6]) {
    
                    var border = (coords[i][0] + coords[i][2] + 7 + co.measureText(prop['chart.labels.above.units.pre'] + this.coords[i][5] + prop['chart.labels.above.units.post']).width) > ca.width ? true : false,
                        text   = RG.numberFormat(this, (this.coords[i][5]).toFixed(prop['chart.labels.above.decimals']), prop['chart.labels.above.units.pre'], prop['chart.labels.above.units.post']);

                    RG.noShadow(this);

                    /**
                    * Default to the value - then check for specific labels
                    */
                    

                    if (typeof prop['chart.labels.above.specific'] === 'object' && prop['chart.labels.above.specific'] && prop['chart.labels.above.specific'][i]) {
                        text = prop['chart.labels.above.specific'][i];
                    }

                    var x = coords[i][0] + coords[i][2] + 5;
                    var y = coords[i][1] + (coords[i][3] / 2);
                    
                    if (prop['chart.yaxispos'] === 'right') {
                        x = coords[i][0] - 5;
                        halign = 'right';
                    } else if (prop['chart.yaxispos'] === 'center' && this.data_arr[i] < 0) {
                        x = coords[i][0] - 5;
                        halign = 'right';
                    }

                    RG.text2(this, {
                          font: typeof prop['chart.labels.above.font'] === 'string' ? prop['chart.labels.above.font'] : font,
                          size: typeof prop['chart.labels.above.size'] === 'number' ? prop['chart.labels.above.size'] : size,
                         color: typeof prop['chart.labels.above.color'] ==='string' ? prop['chart.labels.above.color'] : color,
                             x: x,
                             y: y,
                          bold: prop['chart.labels.above.bold'],
                        italic: prop['chart.labels.above.italic'],
                          text: text,
                        valign: 'center',
                        halign: halign,
                           tag: 'labels.above'
                    });
                }
            }
        };




        /**
        * This function can be used to get the appropriate bar information (if any)
        * 
        * @param  e Event object
        * @return   Appriate bar information (if any)
        */
        this.getShape =
        this.getBar = function (e)
        {
            var mouseXY = RG.getMouseXY(e);
    
            /**
            * Loop through the bars determining if the mouse is over a bar
            */
            for (var i=0,len=this.coords.length; i<len; i++) {
    
                var mouseX = mouseXY[0],  // In relation to the canvas
                    mouseY = mouseXY[1],  // In relation to the canvas
                    left   = this.coords[i][0],
                    top    = this.coords[i][1],
                    width  = this.coords[i][2],
                    height = this.coords[i][3],
                    idx    = i;



                // Recreate the path/rectangle so that it can be tested
                //  ** DO NOT STROKE OR FILL IT **
                pa2(co,['b','r',left,top,width,height]);

                if (co.isPointInPath(mouseX, mouseY)) {
    
                    var tooltip = RG.parseTooltipText(prop['chart.tooltips'], i);

                    return {
                        0: this,   'object': this,
                        1: left,   'x': left,
                        2: top,    'y': top,
                        3: width,  'width': width,
                        4: height, 'height': height,
                        5: idx,    'index': idx,
                        'tooltip': tooltip
                    };
                }
            }
        };




        /**
        * When you click on the chart, this method can return the X value at that point. It works for any point on the
        * chart (that is inside the gutters) - not just points within the Bars.
        * 
        * @param object e The event object
        */
        this.getValue = function (arg)
        {
            if (arg.length == 2) {
                var mouseX = arg[0];
                var mouseY = arg[1];
            } else {
                var mouseCoords = RG.getMouseXY(arg);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];
            }
            
            if (   mouseY < this.gutterTop
                || mouseY > (ca.height - this.gutterBottom)
                || mouseX < this.gutterLeft
                || mouseX > (ca.width - this.gutterRight)
               ) {
                return null;
            }
            
            if (prop['chart.yaxispos'] == 'center') {
                var value = ((mouseX - this.gutterLeft) / (this.graphwidth / 2)) * (this.max - prop['chart.xmin']);
                    value = value - this.max
                    
                    // Special case if xmin is defined
                    if (prop['chart.xmin'] > 0) {
                        value = ((mouseX - this.gutterLeft - (this.graphwidth / 2)) / (this.graphwidth / 2)) * (this.max - prop['chart.xmin']);
                        value += prop['chart.xmin'];
                        
                        if (mouseX < (this.gutterLeft + (this.graphwidth / 2))) {
                            value -= (2 * prop['chart.xmin']);
                        }
                    }
            } else {
                var value = ((mouseX - this.gutterLeft) / this.graphwidth) * (this.max - prop['chart.xmin']);
                    value += prop['chart.xmin'];
            }
    
            return value;
        };




        /**
        * Each object type has its own Highlight() function which highlights the appropriate shape
        * 
        * @param object shape The shape to highlight
        */
        this.highlight =
        this.Highlight = function (shape)
        {
            if (typeof prop['chart.highlight.style'] === 'function') {
                (prop['chart.highlight.style'])(shape);
            } else {
                RG.Highlight.Rect(this, shape);
            }
        };




        /**
        * The getObjectByXY() worker method. Don't call this call:
        * 
        * RG.ObjectRegistry.getObjectByXY(e)
        * 
        * @param object e The event object
        */
        this.getObjectByXY = function (e)
        {
            var mouseXY = RG.getMouseXY(e);

            // Adjust the mouse Y coordinate for when the bar chart is
            // a 3D variant
            if (prop['chart.variant'] === '3d') {
                var adjustment = prop['chart.variant.threed.angle'] * mouseXY[0];
                mouseXY[1] -= adjustment;
            }


            if (
                   mouseXY[0] > this.gutterLeft
                && mouseXY[0] < (ca.width - this.gutterRight)
                && mouseXY[1] > this.gutterTop
                && mouseXY[1] < (ca.height - this.gutterBottom)
                ) {
    
                return this;
            }
        };




        /**
        * This function positions a tooltip when it is displayed
        * 
        * @param obj object    The chart object
        * @param int x         The X coordinate specified for the tooltip
        * @param int y         The Y coordinate specified for the tooltip
        * @param objec tooltip The tooltips DIV element
        *
        this.positionTooltip = function (obj, x, y, tooltip, idx)
        {
            var coordX     = obj.coords[tooltip.__index__][0],
                coordY     = obj.coords[tooltip.__index__][1],
                coordW     = obj.coords[tooltip.__index__][2],
                coordH     = obj.coords[tooltip.__index__][3],
                canvasXY   = RG.getCanvasXY(obj.canvas),
                gutterLeft = obj.gutterLeft,
                gutterTop  = obj.gutterTop,
                width      = tooltip.offsetWidth,
                height     = tooltip.offsetHeight,
                mouseXY    = RG.getMouseXY(window.event);

            // If the chart is a 3D version the tooltip Y position needs this
            // adjustment
            if (prop['chart.variant'] === '3d' && coordW) {
                var adjustment = (prop['chart.variant.threed.angle'] * ((coordX + coordW) / 2));
            }



            // Set the top position
            tooltip.style.left = 0;
            tooltip.style.top  = window.event.pageY - height - 5 + 'px';
            
            // By default any overflow is hidden
            tooltip.style.overflow = '';
            
            // Reposition the tooltip if at the edges:

            // LEFT edge
            if (canvasXY[0] + mouseXY[0] - (width / 2) < 0) {
                tooltip.style.left = canvasXY[0] + mouseXY[0]  - (width * 0.1) + 'px';
    
            // RIGHT edge
            } else if (canvasXY[0] + mouseXY[0]  + (width / 2) > doc.body.offsetWidth) {
                tooltip.style.left = canvasXY[0] + mouseXY[0]  - (width * 0.9) + 'px';
    
            // Default positioning - CENTERED
            } else {
                tooltip.style.left = canvasXY[0] + mouseXY[0]  - (width / 2) + 'px';
            }
        };*/




        /**
        * Returns the appropriate Y coord for the given value
        * 
        * @param number value The value to get the coord for
        */
        this.getXCoord = function (value)
        {
    
            if (prop['chart.yaxispos'] == 'center') {
        
                // Range checking
                if (value > this.max || value < (-1 * this.max)) {
                    return null;
                }
    
                var width = (ca.width - prop['chart.gutter.left'] - prop['chart.gutter.right']) / 2;
                var coord = (((value - prop['chart.xmin']) / (this.max - prop['chart.xmin'])) * width) + width;
    
                    coord = prop['chart.gutter.left'] + coord;
            } else {
            
                // Range checking
                if (value > this.max || value < 0) {
                    return null;
                }
    
                var width = ca.width - prop['chart.gutter.left'] - prop['chart.gutter.right'];
                var coord = ((value - prop['chart.xmin']) / (this.max - prop['chart.xmin'])) * width;
    
                    coord = prop['chart.gutter.left'] + coord;
            }
    
            return coord;
        };




        /**
        * 
        */
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                //this.original_colors['chart.'] = RG.array_clone(prop['chart.']);
                this.original_colors['chart.colors']                = RG.array_clone(prop['chart.colors']);
                this.original_colors['chart.background.grid.color'] = RG.array_clone(prop['chart.background.grid.color']);
                this.original_colors['chart.background.color']      = RG.array_clone(prop['chart.background.color']);
                this.original_colors['chart.background.barcolor1']  = RG.array_clone(prop['chart.background.barcolor1']);
                this.original_colors['chart.background.barcolor2']  = RG.array_clone(prop['chart.background.barcolor2']);
                this.original_colors['chart.text.color']            = RG.array_clone(prop['chart.text.color']);
                this.original_colors['chart.labels.colors']         = RG.array_clone(prop['chart.labels.colors']);
                this.original_colors['chart.strokestyle']           = RG.array_clone(prop['chart.strokestyle']);
                this.original_colors['chart.axis.color']            = RG.array_clone(prop['chart.axis.color']);
                this.original_colors['chart.highlight.fill']        = RG.array_clone(prop['chart.highlight.fill']);
                this.original_colors['chart.highlight.stroke']      = RG.array_clone(prop['chart.highlight.stroke']);
                
            }

            var colors = prop['chart.colors'];
    
            for (var i=0; i<colors.length; ++i) {
                colors[i] = this.parseSingleColorForGradient(colors[i]);
            }
            
            prop['chart.background.grid.color'] = this.parseSingleColorForGradient(prop['chart.background.grid.color']);
            prop['chart.background.color']      = this.parseSingleColorForGradient(prop['chart.background.color']);
            prop['chart.background.barcolor1']  = this.parseSingleColorForGradient(prop['chart.background.barcolor1']);
            prop['chart.background.barcolor2']  = this.parseSingleColorForGradient(prop['chart.background.barcolor2']);
            prop['chart.text.color']            = this.parseSingleColorForGradient(prop['chart.text.color']);
            prop['chart.labels.colors']         = this.parseSingleColorForGradient(prop['chart.labels.colors']);
            prop['chart.strokestyle']           = this.parseSingleColorForGradient(prop['chart.strokestyle']);
            prop['chart.axis.color']            = this.parseSingleColorForGradient(prop['chart.axis.color']);
            prop['chart.highlight.fill']        = this.parseSingleColorForGradient(prop['chart.highlight.fill']);
            prop['chart.highlight.stroke']      = this.parseSingleColorForGradient(prop['chart.highlight.stroke']);
        };




        /**
        * Use this function to reset the object to the post-constructor state. Eg reset colors if
        * need be etc
        */
        this.reset = function ()
        {
        };



        /**
        * This parses a single color value
        */
        this.parseSingleColorForGradient = function (color)
        {
            if (!color || typeof(color) != 'string') {
                return color;
            }
    
            if (color.match(/^gradient\((.*)\)$/i)) {
                
                var parts = RegExp.$1.split(':');
                
                if (prop['chart.yaxispos'] === 'right') {
                    parts = RG.arrayReverse(parts);
                }
    
                // Create the gradient
                var grad = co.createLinearGradient(prop['chart.gutter.left'],0,ca.width - prop['chart.gutter.right'],0);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1; j<parts.length; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
                
            return grad ? grad : color;
        };




        /**
        * This function handles highlighting an entire data-series for the interactive
        * key
        * 
        * @param int index The index of the data series to be highlighted
        */
        this.interactiveKeyHighlight = function (index)
        {
            var obj = this;

            this.coords2.forEach(function (value, idx, arr)
            {
                var shape = obj.coords2[idx][index]
                var pre_linewidth = co.lineWidth;
                co.lineWidth = 2;
                co.fillStyle   = prop['chart.key.interactive.highlight.chart.fill'];
                co.strokeStyle = prop['chart.key.interactive.highlight.chart.stroke'];
                co.fillRect(shape[0], shape[1], shape[2], shape[3]);
                co.strokeRect(shape[0], shape[1], shape[2], shape[3]);
                
                // Reset the lineWidth
                co.lineWidth = pre_linewidth;
            });
        };




        /**
        * Using a function to add events makes it easier to facilitate method chaining
        * 
        * @param string   type The type of even to add
        * @param function func 
        */
        this.on = function (type, func)
        {
            if (type.substr(0,2) !== 'on') {
                type = 'on' + type;
            }
            
            this[type] = func;
    
            return this;
        };




        /**
        * This function runs once only
        * (put at the end of the file (before any effects))
        */
        this.firstDrawFunc = function ()
        {
        };




        /**
        * Grow
        * 
        * The HBar chart Grow effect gradually increases the values of the bars
        * 
        * @param object   OPTIONAL Options for the effect. You can pass frames here
        * @param function OPTIONAL A callback function
        */
        this.grow = function ()
        {
            var obj         = this,
                opt         = arguments[0] || {},
                frames      = opt.frames || 30,
                frame       = 0,
                callback    = arguments[1] || function () {},
                labelsAbove = prop['chart.labels.above'];
            
            this.set('labelsAbove', false);


            // Save the data
            obj.original_data = RG.arrayClone(obj.data);


            // Stop the scale from changing by setting chart.ymax (if it's not already set)
            if (prop['chart.xmax'] == 0) {

                var xmax = 0;
    
                for (var i=0; i<obj.data.length; ++i) {
                    if (RG.isArray(obj.data[i]) && prop['chart.grouping'] == 'stacked') {
                        xmax = ma.max(xmax, RG.arraySum(obj.data[i]));
                    } else if (RG.isArray(obj.data[i]) && prop['chart.grouping'] == 'grouped') {
                        xmax = ma.max(xmax, RG.arrayMax(obj.data[i]));
                    } else {
                        xmax = ma.max(xmax, ma.abs(RG.arrayMax(obj.data[i])));
                    }
                }

                var scale2 = RG.getScale2(obj, {'max':xmax});
                obj.Set('chart.xmax', scale2.max);
            }

            function iterator ()
            {
                // Alter the Bar chart data depending on the frame
                for (var j=0,len=obj.original_data.length; j<len; ++j) {
                    
                    // This stops the animation from being completely linear
                    var easingFactor = RG.Effects.getEasingMultiplier(frames, frame);
    
                    if (typeof obj.data[j] === 'object' && obj.data[j]) {
                        for (var k=0,len2=obj.data[j].length; k<len2; ++k) {
                            obj.data[j][k] = RG.isNull(obj.data[j][k]) ? null : obj.original_data[j][k] * easingFactor;
                        }
                    } else {
                        obj.data[j] = RG.isNull(obj.data[j]) ? null : obj.original_data[j] * easingFactor;
                    }
                }
    
    

                RG.redrawCanvas(obj.canvas);
    
                if (frame < frames) {
                    frame += 1;
                    RG.Effects.updateCanvas(iterator);
                } else {

                    if (labelsAbove) {
                        obj.set('labelsAbove', true);
                        RG.redraw();
                    }

                    callback(obj);
                }
            }
            
            iterator();
            
            return this;
        };




        /**
        * (new) Bar chart Wave effect. This is a rewrite that should be smoother
        * because it just uses a single loop and not setTimeout
        * 
        * @param object   OPTIONAL An object map of options. You specify 'frames' here to give the number of frames in the effect
        * @param function OPTIONAL A function that will be called when the effect is complete
        */
        this.wave = function ()
        {
            var obj = this,
                opt = arguments[0] || {};
                opt.frames      = opt.frames || 60;
                opt.startFrames = [];
                opt.counters    = [];

            var framesperbar   = opt.frames / 3,
                frame          = -1,
                callback       = arguments[1] || function () {},
                original       = RG.arrayClone(obj.data),
                labelsAbove    = prop['chart.labels.above'];

            this.set('labelsAbove', false);

            for (var i=0,len=obj.data.length; i<len; i+=1) {
                opt.startFrames[i] = ((opt.frames / 2) / (obj.data.length - 1)) * i;
                
                if (typeof obj.data[i] === 'object' && obj.data[i]) {
                    opt.counters[i] = [];
                    for (var j=0; j<obj.data[i].length; j++) {
                        opt.counters[i][j] = 0;
                    }
                } else {
                    opt.counters[i]    = 0;
                }
            }

            /**
            * This stops the chart from jumping
            */
            obj.draw();
            obj.Set('xmax', obj.scale2.max);
            RG.clear(obj.canvas);

            function iterator ()
            {
                ++frame;

                for (var i=0,len=obj.data.length; i<len; i+=1) {
                    if (frame > opt.startFrames[i]) {
                        if (typeof obj.data[i] === 'number') {
                            
                            obj.data[i] = ma.min(
                                ma.abs(original[i]),
                                ma.abs(original[i] * ( (opt.counters[i]++) / framesperbar))
                            );
                            
                            // Make the number negative if the original was
                            if (original[i] < 0) {
                                obj.data[i] *= -1;
                            }
                        } else if (!RG.isNull(obj.data[i])) {
                            for (var j=0,len2=obj.data[i].length; j<len2; j+=1) {
                                
                                obj.data[i][j] = ma.min(
                                    ma.abs(original[i][j]),
                                    ma.abs(original[i][j] * ( (opt.counters[i][j]++) / framesperbar))
                                );

                                // Make the number negative if the original was
                                if (original[i][j] < 0) {
                                    obj.data[i][j] *= -1;
                                }
                            }
                        }
                    } else {
                        obj.data[i] = typeof obj.data[i] === 'object' && obj.data[i] ? RG.arrayPad([], obj.data[i].length, 0) : (RG.isNull(obj.data[i]) ? null : 0);
                    }
                }


                if (frame >= opt.frames) {

                    if (labelsAbove) {
                        obj.set('labelsAbove', true);
                        RG.redrawCanvas(obj.canvas);
                    }

                    callback(obj);
                } else {
                    RG.redrawCanvas(obj.canvas);
                    RG.Effects.updateCanvas(iterator);
                }
            }
            
            iterator();

            return this;
        };




        /**
        * Charts are now always registered
        */
        RG.Register(this);




        /**
        * This is the 'end' of the constructor so if the first argument
        * contains configuration data - handle that.
        */
        if (parseConfObjectForOptions) {
            RG.parseObjectStyleConfig(this, conf.options);
        }
    };