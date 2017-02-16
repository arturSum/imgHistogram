//outNode id: imgHist-graph


((global)=>{


    var createCanvasNode = (width, height, id, visibility)=>{

          var existingNode = document.getElementById(id),
              newNode = document.createElement('canvas');

          newNode.width = width;
          newNode.height = height;
          newNode.id = id;

          newNode.style.display = !visibility? 'none':'block';

          if(existingNode){

             document.body.replaceChild(newNode, existingNode);
          }
          else{

             document.body.appendChild(newNode);
          }

          return newNode;
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

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(axisLength, 0);

        ctx.stroke();


        //#################################

        ctx.beginPath();

        if(showXAxisScale){


            for(var i=0; i<255; i+=requiredDataInterval){

                ctx.moveTo(Math.round(axisLength*i/255), lineLength);
                ctx.lineTo(Math.round(axisLength*i/255), 0);
                ctx.stroke();

                ctx.fillText(`${i}`, (Math.round(axisLength*i/255))-8, 20);
                ctx.stroke();

            }

            //last one
            ctx.beginPath();
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

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -axisLength);
        ctx.stroke();


        //#####################################


        var lineQnt = 10,
            intervalWidth = Math.round(axisLength/lineQnt);


        ctx.beginPath();

        if(showXAxisScale){

            for(var i=0; i<lineQnt; i++){

                ctx.moveTo(-lineLength, -i*intervalWidth);
                ctx.lineTo(0, -i*intervalWidth);
                ctx.stroke();
            }

            //last val
            ctx.beginPath();
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


            ctx.save();

            //set start position
            ctx.translate(marginSize+1, marginSize + yAxisLength);


            while(colorQnt--){

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
            }

        ctx.restore();
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



        var params = setParams(conf, defaultConfig),
            canvasOutNode = createCanvasNode(params.width, params.height, 'imgHist-graph', true),

            canvasInNode,
            ctxIn,
            colorsMap,
            maxRgbVal,
            marginSize = 40;


        return{


            show(inputImg){

                if(!inputImg){
                    throw {
                        id:1,
                        msg: 'Input image source are required'
                    }
                }

                if(!inputImg.naturalHeight){
                    throw {
                        id:2,
                        msg: 'Input image not loaded yet'
                    }
                }

                canvasOutNode.getContext('2d').clearRect(0, 0, canvasOutNode.width, canvasOutNode.height);
                canvasOutNode.style.display = 'block';



                canvasInNode = createCanvasNode(inputImg.naturalWidth, inputImg.naturalHeight, 'imgHist-in', false);


                ctxIn = canvasInNode.getContext('2d');
                ctxIn.drawImage(inputImg, 0, 0);


                colorsMap = createColorsMap(
                    ctxIn.getImageData(0, 0, canvasInNode.width, canvasInNode.height).data
                );

                maxRgbVal = Math.max(...findMaximumVal(colorsMap));


                drawXAxis(canvasOutNode, marginSize, params.xLineDataInterval, params.xAxisScale);
                drawYAxis(canvasOutNode, marginSize, params.yAxisScale);

                drawGraph(colorsMap, canvasOutNode, marginSize, maxRgbVal);

            }


        }


    };


    global.imgHistogram = imgHistogram;

    global.imgHistogram.test = {
        createCanvasNode,
        createColorsMap,
        findMaximumVal,
        setParams,
        drawXAxis,
        drawYAxis,
        drawGraph
    }



})(window);