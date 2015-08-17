'use strict';

  var Chartee = {
        _canvas : null,
        el : null,
        container : {
            element : null,
            width : null,
            height : null,
        },
        chartProp : null,
        charts : {
            stroke: function(prop){
                
                var item;
                var i=0;
                var canvas = document.getElementById(prop.target);
                var ctx = canvas.getContext('2d');
                
                
                ctx.beginPath();
                ctx.moveTo(0,0);
                ctx.lineJoin = prop.lineJoin;
                ctx.lineCap = prop.lineCap;
                ctx.lineWidth = prop.lineWidth;
                
                
                for (item in prop.coordinates) {
                   ctx.lineTo(parseInt(document.getElementById(prop.target).width/4)*i, prop.coordinates[item].y); 
                    i++;
                }
                
                if(prop.solid){
                    ctx.lineTo(document.getElementById(prop.target).width, document.getElementById(prop.target).height); 
                    ctx.lineTo(0, document.getElementById(prop.target).height); 
                    ctx.closePath();
                    ctx.fillStyle = prop.background;
                    ctx.strokeStyle = prop.color;
                    ctx.fill();
                }
                ctx.stroke();
                ctx.closePath();
                
                // Chart divisions
                ctx.beginPath();
                for(i = 1; i<=4; i++) {
                    
                    ctx.rect(0*i, 0*i, parseInt(document.getElementById(prop.target).width/4)*i, parseInt(document.getElementById(prop.target).height));
                    ctx.strokeStyle = '#E1E1E1';
                    ctx.stroke();
                    
                }
                ctx.closePath();
                
                // Get the positions within the chart
                var column = function(position){
                    var val;
                    switch(position){
                            
                            case 'first':
                                val = parseInt((document.getElementById(prop.target).width/4)/2);
                            break;
                            case 'second':
                                val =  parseInt((document.getElementById(prop.target).width/4)/2)+parseInt(document.getElementById(prop.target).width/4);
                            break;
                            case 'third':
                                val = parseInt((document.getElementById(prop.target).width/4)/2)+parseInt(document.getElementById(prop.target).width/2);
                            break;
                            case 'fourth':
                                val = parseInt((document.getElementById(prop.target).width/4)/2)+parseInt((document.getElementById(prop.target).width/4) * 3);
                            break;
                            default:
                                val = false;
                            break;
                    }
                    return val;
                };
                
                // Division labels
                // AWARENESS
                ctx.beginPath();
                ctx.font = '12px Arial';
                ctx.fillStyle  = '#222';
                ctx.fillText('Awareness', column('first')-30, 30);
                ctx.closePath();
                
                // Engagement
                ctx.beginPath();
                ctx.font = '12px Arial';
                ctx.fillStyle  = '#222';
                ctx.fillText('Engagement', column('second')-35, 30);
                ctx.closePath();
                
                // USE
                ctx.beginPath();
                ctx.font = '12px Arial';
                ctx.fillStyle  = '#222';
                ctx.fillText('Use', column('third')-10, 30);
                ctx.closePath();
                
                // DEMAND
                ctx.beginPath();
                ctx.font = '12px Arial';
                ctx.fillStyle  = '#222';
                ctx.fillText('Demand', column('fourth')-25, 30);
                ctx.closePath();
                
            }
        },
        
        init:function(prop){
            
            if (Chartee.chartProp===null) {
                Chartee.chartProp = prop;
            }
            
            this.el = document.getElementById(prop.target);
            this.container.element = this.el.parentElement;
            
            
            
            window.onresize = (_.debounce(function resize(){
                
                    Chartee.init(Chartee.chartProp);
                
            }, 500));
            
            // Adjust size based on the wrapper
            this.utilities.sizeAjustment();
            
            Chartee.utilities.normalizeValues(prop);
            
            this.charts[prop.type](prop);
            
        },
        
        utilities: {
            normalizeValues : function(prop){
                if(!prop.started) {
                    var item;
                    var values = prop.coordinates;
                    var maxVal = 0;
                    var metrics = [];
                    prop.started = true;
                }
                
                    //console.log('Container Size');
                    //console.log('Width:' + Chartee.container.width);
                    //console.log('Height:' + Chartee.container.height);
                    //console.log('-----------------');
                
                // Getting the maxumum value to Map it
                for(item in values) {
                    if(values[item].y > maxVal) {
                        maxVal  = values[item].y;
                    }
                }
                
                // connect all the values relative to the bigest value
                for(item in values) {
                   metrics.push(values[item].y / maxVal *100);
                }
                
                //Constrain the max value to no more than the height of the container
                if(maxVal > Chartee.container.height) {
                    maxVal = 400;
                }
                
                
                for(item in values) {
                        
                    //console.log('Item: ' + item);
                    if(values[item].y !== maxVal) {
                        values[item].y=0;
                        values[item].y = Math.abs(maxVal * (metrics[item]/100)-Chartee.container.height);
                        //console.log('Y: ' + values[item].y + ' New value :'+ Math.abs(maxVal * (metrics[item]/100)-Chartee.container.height));
                        
                    }else{
                        
                        values[item].y = 0;
                        //console.log('Y: ' + values[item].y + ' New value :'+ values[item].y);
                        
                    }
                    //console.log('Proccesed Y: ' + metrics[item]);
                    //console.log('-----------------');
                    
                }
                 //console.log('MAX: ' + maxVal);
                 //console.log('EXCEDENT: ' + surPlus + '%');
                
            },
            sizeAjustment : function(){
                if(Chartee.container.element.style.width.length > 0 && Chartee.container.element.style.height.length > 0) {
                
                if(Chartee.container.element.style.width === '100%'){
                    Chartee.el.width =  Chartee.container.element.offsetWidth;
                    Chartee.container.width = Chartee.container.element.offsetWidth;
                    }else{
                        Chartee.el.width =  parseInt(Chartee.container.element.style.width);
                        Chartee.container.width = Chartee.container.element.offsetWidth;
                    }
                
                if(Chartee.container.element.style.height === '100%'){
                    Chartee.el.height =  Chartee.container.element.offsetHeight;
                     Chartee.container.height = Chartee.container.element.offsetHeight;
                }else{
                    Chartee.el.height =  parseInt(Chartee.container.element.style.height);
                    Chartee.container.height = parseInt(Chartee.container.element.style.height);
                }
                
                
                }else{
                    Chartee.el.width = parseInt(Chartee.container.element.getAttribute('width'));
                    Chartee.el.height = parseInt(Chartee.container.element.getAttribute('height'));
                    
                    Chartee.container.width = parseInt(Chartee.container.element.getAttribute('width'));
                    Chartee.container.height = parseInt(Chartee.container.element.getAttribute('height'));
                }
            }
        }
    };
    
    
    Chartee.init({
        target:'canvas', //Target element. Must be an ID
        type:'stroke',
        lineJoin : 'round',
        lineCap : 'round',
        color:'transparent',
        background:'#EEE',
        solid: true, // make the poligon solid
        lineWidth:1,
        coordinates:[
            {
                y:450
            },
            {
                y:1020
            },
            {
                y:200
            },
            {
                y:2000
            },
            {
                y:350
            }
        ]
    });