((global)=>{


    var createCanvasNode = (width, height, visible = false)=>{

      var node = document.createElement('canvas');

      node.width = width;
      node.height = height;

      if(!visible){
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


        return {

            height : user.height && typeof user.height == 'number'? Math.abs(Math.floor(user.height)) : def.height,
            width : user.width && typeof user.width == 'number'? Math.abs(Math.floor(user.width)) : def.width

        }


    },


    drawXAxis = (nodeOut, marginSize, requiredDataInterval)=>{

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


        var lineQnt = Math.round(255/requiredDataInterval),
            intervalWidth = Math.round(axisLength/lineQnt);


        for(var i=0; i<lineQnt; i++){

            ctx.moveTo(i*intervalWidth, lineLength);
            ctx.lineTo(i*intervalWidth, 0);
            ctx.stroke();

            ctx.fillText(`${i*requiredDataInterval}`, (i*intervalWidth)-8, 20);
            ctx.stroke();

        }

        //last one
        ctx.moveTo(axisLength-1, lineLength);
        ctx.lineTo(axisLength-1, 0);
        ctx.stroke();

        ctx.fillText(`255`, axisLength-7, 20);
        ctx.stroke();

        ctx.restore();

    },

    drawYAxis = (nodeOut, marginSize)=>{

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


        for(var i=0; i<lineQnt; i++){

            ctx.moveTo(-lineLength, -i*intervalWidth);
            ctx.lineTo(0, -i*intervalWidth);
            ctx.stroke();
        }

        //last val
        ctx.moveTo(-lineLength, -axisLength+1);
        ctx.lineTo(0, -axisLength+1);
        ctx.stroke();

        ctx.restore();

        //text
        ctx.fillText(`max`, marginSize-10, marginSize-10);
        ctx.stroke();

    };




    //#########################################

    var defaultConfig = {

        height : 400,
        width : 600



    };









    //#########################################



    var imgHistogram = (conf=defaultConfig)=>{


        var inImg = new Image(),
            canvasInNode, ctxIn,
            canvasOutNode, ctxOut,
            colorsMap, maxRgbVal,


            params = setParams(conf, defaultConfig),
            marginSize = 40;







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

                    console.log('color map: ', colorsMap);
                    console.log(maxRgbVal);

                    canvasOutNode = createCanvasNode(params.width, params.height, true);
                    document.body.appendChild(canvasOutNode);
                    ctxOut = canvasOutNode.getContext('2d');


                    drawXAxis(canvasOutNode, marginSize, 16);
                    drawYAxis(canvasOutNode, marginSize, maxRgbVal, 1000);






                };


                inImg.src = inputSrc;












            }


        }


    };




    global.imgHistogram = imgHistogram;


})(window);