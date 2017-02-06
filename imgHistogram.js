((global)=>{


    var createCanvasNode = (width, height, visibility = false, id='')=>{

          var node = document.getElementById(id);


          if(!node){
              node = document.createElement('canvas');
          }


          node.width = width;
          node.height = height;

          node.id = id;

          if(!visibility){
              node.style.display = 'none';
          }

          return node;
    },


    createColorsMap = (imgData)=>{

        var imgDataQnt = imgData.length,
            colorsMap = {
                R : new Array(256).fill(0),
                G : new Array(256).fill(0),
                B : new Array(256).fill(0)
            };



        for(var i=0; i<imgDataQnt; i+=4){

            colorsMap.R[ imgData[i] ]++;
            colorsMap.G[ imgData[i+1] ]++;
            colorsMap.B[ imgData[i+2] ]++;

        }

        return colorsMap;
    },


    findMaximumVal = (matrix)=>{

            var currentMax = 0,
                maximumColorVal = [];

            for(let colorStorage of Object.values(matrix)){

                colorStorage.forEach((val)=>{

                    if(val > currentMax){
                        currentMax = val;
                    }

                });

                maximumColorVal.push(currentMax);
                currentMax = 0;
            }


            return maximumColorVal;
    },


    setParams = (user, def)=>{


        var width = (()=>{

            return user.width && typeof user.width == 'number'? Math.abs(Math.round(user.width)) : def.width

        })(),

        setXLineDataInterval = (width)=>{

            var minAccepted = 4,
                userDef = null;

            if(user.xLineDataInterval && typeof user.xLineDataInterval == 'number'){

                userDef = Math.round( Math.abs(user.xLineDataInterval) );

                return userDef >= minAccepted && userDef <= width? userDef : def.xLineDataInterval;
            }

            return def.xLineDataInterval;
        };


        //#################################################


        return {

            width,
            height : user.height && typeof user.height == 'number'? Math.abs(Math.round(user.height)) : def.height,
            xLineDataInterval : setXLineDataInterval(width),

            xAxisScale : typeof user.xAxisScale == 'boolean'? user.xAxisScale : def.xAxisScale,
            yAxisScale : typeof user.yAxisScale == 'boolean'? user.yAxisScale : def.yAxisScale

        };

    },


    drawXAxis = (nodeOut, marginSize, requiredDataInterval, showXAxisScale)=>{

        var ctx = nodeOut.getContext('2d'),
            axisLength = nodeOut.width - (2*marginSize),
            lineLength = 5;


        //draw axis
        ctx.save();
        ctx.translate(marginSize, nodeOut.height - marginSize);

        ctx.moveTo(0, 0);
        ctx.lineTo(axisLength, 0);

        ctx.stroke();


        //#################################


        if(showXAxisScale){


            for(var i=0; i<255; i+=requiredDataInterval){

                ctx.moveTo(Math.round(axisLength*i/255), lineLength);
                ctx.lineTo(Math.round(axisLength*i/255), 0);
                ctx.stroke();

                ctx.fillText(`${i}`, (Math.round(axisLength*i/255))-8, 20);
                ctx.stroke();

            }

            //last one
            ctx.moveTo(axisLength-1, lineLength);
            ctx.lineTo(axisLength-1, 0);
            ctx.stroke();

            ctx.fillText(`255`, axisLength-7, 20);
            ctx.stroke();

        }


        ctx.restore();

    },

    drawYAxis = (nodeOut, marginSize, showXAxisScale)=>{

        var ctx = nodeOut.getContext('2d'),
            axisLength = nodeOut.height - (2*marginSize),
            lineLength = 5;


        ctx.save();
        ctx.translate(marginSize, marginSize + axisLength);

        ctx.moveTo(0, 0);
        ctx.lineTo(0, -axisLength);
        ctx.stroke();


        //#####################################


        var lineQnt = 10,
            intervalWidth = Math.round(axisLength/lineQnt);



        if(showXAxisScale){

            for(var i=0; i<lineQnt; i++){

                ctx.moveTo(-lineLength, -i*intervalWidth);
                ctx.lineTo(0, -i*intervalWidth);
                ctx.stroke();
            }

            //last val
            ctx.moveTo(-lineLength, -axisLength+1);
            ctx.lineTo(0, -axisLength+1);
            ctx.stroke();


        }

        ctx.restore();

        //text
        ctx.fillText(`max`, marginSize-10, marginSize-10);
        ctx.stroke();

    },

    drawGraph = (colorsMap, outNode, marginSize, maxVal)=>{

            var ctx = outNode.getContext('2d'),
                availableGraphColor = {R:'red', G:'green', B:'blue'},
                colorKeys = Object.keys(colorsMap),
                colorQnt = colorKeys.length,
                yAxisLength = outNode.height - (2*marginSize),
                xAxisLength = outNode.width - (2*marginSize);


            while(colorQnt--){

                ctx.save();

                //set start position
                ctx.translate(marginSize+1, marginSize + yAxisLength);

                ctx.beginPath();

                //first val
                ctx.moveTo(0, -Math.round(yAxisLength*colorsMap[colorKeys[colorQnt]][0]/maxVal ));
                ctx.strokeStyle = availableGraphColor[colorKeys[colorQnt]];

                //next val
                for(var i=1; i<255; i++){

                    ctx.lineTo(
                        Math.round(xAxisLength*i/255),
                        -Math.round(yAxisLength*colorsMap[colorKeys[colorQnt]][i]/maxVal)
                    );

                }

                ctx.stroke();
                ctx.restore();
            }

    };




    //#########################################

    var defaultConfig = {

        height : 400,
        width : 600,
        xLineDataInterval : 16,
        xAxisScale : true,
        yAxisScale : true



    };









    //#########################################



    var imgHistogram = (conf=defaultConfig)=>{


        var inImg = new Image(),
            canvasInNode, ctxIn,
            canvasOutNode, ctxOut,
            colorsMap, maxRgbVal,

            marginSize = 40,
            params = setParams(conf, defaultConfig);






        return{


            show(inputSrc){


                if(!inputSrc){
                    throw {
                        id:1,
                        msg: 'Input image source are required'
                    }
                }


                inImg.onload = function(){


                    canvasInNode = createCanvasNode(this.width, this.height);
                    document.body.appendChild(canvasInNode);

                    ctxIn = canvasInNode.getContext('2d');

                    ctxIn.drawImage(this, 0, 0);


                    colorsMap = createColorsMap(
                        ctxIn.getImageData(0, 0, this.width, this.height).data
                    );

                    maxRgbVal = Math.max(...findMaximumVal(colorsMap));


                    canvasOutNode = createCanvasNode(params.width, params.height, true, 'graph');
                    document.body.appendChild(canvasOutNode);
                    ctxOut = canvasOutNode.getContext('2d');


                    drawXAxis(canvasOutNode, marginSize, params.xLineDataInterval, params.xAxisScale);
                    drawYAxis(canvasOutNode, marginSize, params.yAxisScale);

                    drawGraph(colorsMap, canvasOutNode, marginSize, maxRgbVal);



                };

                inImg.src = inputSrc;

            }


        }


    };



    global.imgHistogram = imgHistogram;


})(window);