
describe('imgHistogram', function(){

    var inputImageNode = document.createElement('img');

    inputImageNode.width = 133;
    inputImageNode.width = 100;
    inputImageNode.src = 'base/test/unit/picSource/1.jpg';

    document.body.appendChild(inputImageNode);

    afterEach(function(){

        var outCanvas = document.querySelectorAll('canvas');

        if(outCanvas[outCanvas.length-1]){
            document.body.removeChild(outCanvas[outCanvas.length-1]);
        }
    });

    describe('createCanvasNode', function(){

        it('should create new canvas node if that not exist yet in document body', function(){

            expect(document.querySelectorAll('canvas').length).toBe(0);

            imgHistogram.test.createCanvasNode(100, 65, 'someId', true);

            expect(document.querySelectorAll('canvas').length).toBe(1);

        });

        it('should replace canvas node if it with the same ID exist in document body', function(){

            imgHistogram.test.createCanvasNode(153, 12, 'id1', true);
            imgHistogram.test.createCanvasNode(1531, 121, 'id1', false);
            imgHistogram.test.createCanvasNode(1, 1, 'id1', true);

            expect(document.querySelectorAll('canvas').length).toBe(1);

        });

        it('should set certain property of canvas node, depends on input value', function(){

            var methodInput1 = {

                width : 100,
                height : 50,
                id : 'test',
                visibility : false
            },
            testCanvasNode = null;


            imgHistogram.test.createCanvasNode(methodInput1.width, methodInput1.height, methodInput1.id, methodInput1.visibility);

            testCanvasNode = document.querySelectorAll('canvas');

            expect(testCanvasNode.length).toBe(1);
            expect(testCanvasNode[0].width).toBe(methodInput1.width);
            expect(testCanvasNode[0].height).toBe(methodInput1.height);
            expect(testCanvasNode[0].id).toBe(methodInput1.id);
            expect(testCanvasNode[0].style.display).toBe(methodInput1.visibility? 'block' : 'none');

            //---------------------------

            var methodInput2 = {

                width : 1020,
                height : 151,
                id : 'test',
                visibility : true
            };

            imgHistogram.test.createCanvasNode(methodInput2.width, methodInput2.height, methodInput2.id, methodInput2.visibility);

            testCanvasNode = document.querySelectorAll('canvas');

            expect(testCanvasNode.length).toBe(1);
            expect(testCanvasNode[0].width).toBe(methodInput2.width);
            expect(testCanvasNode[0].height).toBe(methodInput2.height);
            expect(testCanvasNode[0].id).toBe(methodInput2.id);
            expect(testCanvasNode[0].style.display).toBe(methodInput2.visibility? 'block' : 'none');


        });

    });

    describe('createColorsMap', function(){

        var inData, canvasNode, inCtx, outMap;

        beforeEach(function(){

            canvasNode = imgHistogram.test.createCanvasNode(400, 300, 'inId', true);
            inCtx = canvasNode.getContext('2d');

            inData = inCtx.getImageData(0, 0, canvasNode.width, canvasNode.height).data;

            outMap = imgHistogram.test.createColorsMap(inData);

        });

        it('should return object with RBG props as array from 0 to 255', function(){

            expect(['R', 'G', 'B']).toEqual(Object.keys(outMap));

            expect(outMap.R.length).toBe(256);
            expect(outMap.G.length).toBe(256);
            expect(outMap.B.length).toBe(256);

        });

        it('should return single color component as a integer value', function(){

            expect(Number.isInteger(outMap.R[0])).toBe(true);
            expect(Number.isInteger(outMap.R[outMap.R.length-1])).toBe(true);
            expect(Number.isInteger(outMap.R[Math.round(outMap.R.length/2)])).toBe(true);

        });

        it('should assign pixel color value to correct position', function(){

            var outImgHeight = 60,
                outImgWidth = 60,
                outImgBuff = new ArrayBuffer((outImgHeight*outImgWidth*4)/8),
                outImgData = new Uint8ClampedArray(outImgBuff);

            outMap = imgHistogram.test.createColorsMap(outImgData);


            //all pixel ara black
            expect(outMap.R[0]).toBe(outImgData.length/4);
            expect(outMap.G[0]).toBe(outImgData.length/4);
            expect(outMap.B[0]).toBe(outImgData.length/4);

            expect(outMap.R[100]).toBe(0);
            expect(outMap.G[2]).toBe(0);
            expect(outMap.B[255]).toBe(0);

            //----------------------------
            //fill red chanel

            for(var i=0; i<outImgData.length; i+=4){
                outImgData[i] = 255;
            }

            outMap = imgHistogram.test.createColorsMap(outImgData);

            expect(outMap.R[255]).toBe(outImgData.length/4);
            expect(outMap.G[0]).toBe(outImgData.length/4);
            expect(outMap.B[0]).toBe(outImgData.length/4);

            expect(outMap.R[2]).toBe(0);
            expect(outMap.G[255]).toBe(0);
            expect(outMap.B[186]).toBe(0);


            //----------------------------
            //add some blue chanel val

            for(i=0; i<120; i+=4){
                outImgData[i+2] = 255;
            }

            outMap = imgHistogram.test.createColorsMap(outImgData);

            expect(outMap.R[255]).toBe(outImgData.length/4);
            expect(outMap.G[0]).toBe(outImgData.length/4);
            expect(outMap.B[255]).toBe(120/4);


        });

    });

    describe('findMaximumVal', function(){

        it('should find maximum value in each color component of RGB matrix object', function(){

            var genRandomData = function(randomNumbersQnt, maxVal){

                var outData = [];

                while(randomNumbersQnt--){
                    outData.push(Math.round(Math.random()*maxVal));
                }

                return outData;
            },

            rData =  genRandomData(100, 123),
            gData =  genRandomData(54, 111),
            bData = genRandomData(65, 12);

            rData.push(200);
            gData.push(300);
            bData.push(30);

            expect(

                imgHistogram.test.findMaximumVal({
                    R : rData,
                    G : gData,
                    B : bData
                })

            ).toEqual(
                [200, 300, 30]
            );

            //---------------------------

            rData[30] = 500;
            gData[51] = 600;
            bData[2] = 700;

            expect(

                imgHistogram.test.findMaximumVal({
                    R : rData,
                    G : gData,
                    B : bData
                })

            ).toEqual(
                [500, 600, 700]
            );

        });

    });

    describe('drawXAxis', function(){

        var outCanvas;

        beforeEach(function(){

            outCanvas = document.createElement('canvas');

            outCanvas.width = 400;
            outCanvas.height = 300;

            document.body.appendChild(outCanvas);

        });


        it('should draw X axis in correct position on canvas board', function(){

            //in : drawXAxis = (nodeOut, marginSize, requiredDataInterval, showXAxisScale)

            var marginSize = 20,
                requiredDataInterval = 50,
                showXAxisScale = false,
                oCtx = outCanvas.getContext('2d'),
                oData = null;


            oCtx.strokeStyle = 'red';

            imgHistogram.test.drawXAxis(outCanvas, marginSize, requiredDataInterval, showXAxisScale);

            oData = oCtx.getImageData(0, 0, outCanvas.width, outCanvas.height).data;


            var pickFilledPix = function(offsetX, offsetY){

                var y = outCanvas.height - marginSize + offsetY,
                    x = marginSize + offsetX;

                return ((outCanvas.width*y) + x)*4;
            },


            filledPixelPos = pickFilledPix(0, 0);


            expect(oData[filledPixelPos]).toBe(255);
            expect(oData[filledPixelPos+1]).toBe(0);
            expect(oData[filledPixelPos+2]).toBe(0);


            //--------------------------------

            filledPixelPos = pickFilledPix(0, 1);
            expect(oData[filledPixelPos]).toBe(0);

            filledPixelPos = pickFilledPix(0, -2);
            expect(oData[filledPixelPos]).toBe(0);

            //---------------------------------

            filledPixelPos = pickFilledPix(-1, 0);
            expect(oData[filledPixelPos]).toBe(0);

            var lineLength = outCanvas.width-(marginSize*2);

            filledPixelPos = pickFilledPix(lineLength-1, 0);
            expect(oData[filledPixelPos]).toBe(255);

            filledPixelPos = pickFilledPix(lineLength-50, 0);
            expect(oData[filledPixelPos]).toBe(255);

            filledPixelPos = pickFilledPix(lineLength, 0);
            expect(oData[filledPixelPos]).toBe(0);


        });

        it('should draw X axis scale on calculated position if param showXAxisScale=true', function(){

            var marginSize = 40,
                requiredDataInterval = 50,
                lineLength = 5,
                oCtx = outCanvas.getContext('2d'),
                axisLength = outCanvas.width - (2*marginSize);


            oCtx.strokeStyle = 'red';

            imgHistogram.test.drawXAxis(outCanvas, marginSize, requiredDataInterval, true);

            var oData = oCtx.getImageData(0, 0, outCanvas.width, outCanvas.height).data,

                getPixel = (offsetX, offsetY)=>{

                    var x = marginSize  + offsetX,
                        y = outCanvas.height - marginSize + offsetY;

                    return ((outCanvas.width*y) + x)*4;
                },

                expectedScaleLineXPos = Math.round(axisLength*requiredDataInterval/255),

                pix = getPixel(expectedScaleLineXPos, 4);



            expect(oData[pix]).toBe(255);
            expect(oData[pix+1]).toBe(0);
            expect(oData[pix+2]).toBe(0);

            pix = getPixel(expectedScaleLineXPos-1, 4);
            expect(oData[pix]).toBe(255);

            pix = getPixel(expectedScaleLineXPos+1, 4);
            expect(oData[pix]).toBe(0);

            pix = getPixel(expectedScaleLineXPos, 2);
            expect(oData[pix]).toBe(255);

            pix = getPixel(expectedScaleLineXPos, -2);
            expect(oData[pix]).toBe(0);

            //-------------------------------

            expectedScaleLineXPos = Math.round(axisLength*requiredDataInterval*2/255);

            pix = getPixel(expectedScaleLineXPos, 0);
            expect(oData[pix]).toBe(255);

            pix = getPixel(expectedScaleLineXPos, 4);
            expect(oData[pix]).toBe(255);

            pix = getPixel(expectedScaleLineXPos+1, 4);
            expect(oData[pix]).toBe(0);

            //---------------------------------

            pix = getPixel(axisLength-1, 0);
            expect(oData[pix]).toBe(255);

            pix = getPixel(axisLength-1, 4);
            expect(oData[pix]).toBe(255);

            pix = getPixel(axisLength+5, 0);
            expect(oData[pix]).toBe(0);

            pix = getPixel(axisLength-1, -2);
            expect(oData[pix]).toBe(0);

        });


    });

    describe('drawYAxis', function(){


        it('should draw Y axis in correct position on canvas board', function(){

            //in : drawYAxis = (nodeOut, marginSize, showXAxisScale)

            var outCanvas = document.createElement('canvas');

                outCanvas.width = 400;
                outCanvas.height = 300;

                document.body.appendChild(outCanvas);


            var marginSize = 20,
                showYAxisScale = false,
                oCtx = outCanvas.getContext('2d'),
                oData = null;


            oCtx.strokeStyle = 'red';

            imgHistogram.test.drawYAxis(outCanvas, marginSize, showYAxisScale);

            oData = oCtx.getImageData(0, 0, outCanvas.width, outCanvas.height).data;


            var pickFilledPix = function(offsetX, offsetY){

                    var y = outCanvas.height - marginSize + offsetY,
                        x = marginSize + offsetX;

                    return ((outCanvas.width*y) + x)*4;
                },

            filledPixelPos = pickFilledPix(0, -1);
            expect(oData[filledPixelPos]).toBe(255);
            expect(oData[filledPixelPos+1]).toBe(0);
            expect(oData[filledPixelPos+2]).toBe(0);

            //-----------------------------

            filledPixelPos = pickFilledPix(-2, -1);
            expect(oData[filledPixelPos]).toBe(0);

            filledPixelPos = pickFilledPix(1, -1);
            expect(oData[filledPixelPos]).toBe(0);

            filledPixelPos = pickFilledPix(0, -67);
            expect(oData[filledPixelPos]).toBe(255);

            filledPixelPos = pickFilledPix(0, -(outCanvas.height-2*marginSize));
            expect(oData[filledPixelPos]).toBe(255);

            filledPixelPos = pickFilledPix(1, -(outCanvas.height-2*marginSize));
            expect(oData[filledPixelPos]).toBe(0);

            filledPixelPos = pickFilledPix(-2, -(outCanvas.height-2*marginSize));
            expect(oData[filledPixelPos]).toBe(0);


        });


    });

    describe('drawGraph', function(){

        it('should draw line form one point to another depend on color value', function(){

            //drawGraph = (colorsMap, outNode, marginSize, maxVal)

            var graphCanvas = document.createElement('canvas'),
                sourceCanvas = document.createElement('canvas'),
                testCanvas = document.createElement('canvas'),
                docFrag = document.createDocumentFragment(),

                hist = imgHistogram.test,

                marginSize = 40,
                colorKeys = ['R', 'G', 'B'],
                colorComponentNmbr = 3,
                yAxisLength,
                xAxisLength,

                gData, tData, sData, inColorMap, maxVal,
                canvasDiff = new Map();

            //---------------------------

            sourceCanvas.width = 400;
            sourceCanvas.height = 300;

            graphCanvas.width = sourceCanvas.width;
            graphCanvas.height = sourceCanvas.height;

            testCanvas.width = sourceCanvas.width;
            testCanvas.height = sourceCanvas.height;

            docFrag.appendChild(sourceCanvas);
            docFrag.appendChild(graphCanvas);
            docFrag.appendChild(testCanvas);
            document.body.appendChild(docFrag);

            //----------------------------

            var gCtx = graphCanvas.getContext('2d'),
                sCtx = sourceCanvas.getContext('2d'),
                tCtx = testCanvas.getContext('2d');


            sCtx.drawImage(inputImageNode, 0, 0);

            //----------------------------

            sData = sCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height).data;
            inColorMap = hist.createColorsMap(sData);
            maxVal = Math.max( ...hist.findMaximumVal(inColorMap) );


            hist.drawGraph(inColorMap, graphCanvas, marginSize, maxVal);


            //-------- draw & count test data ------------

            yAxisLength = graphCanvas.height - (2*marginSize);
            xAxisLength = graphCanvas.width - (2*marginSize);

            tCtx.save();
            tCtx.translate(marginSize+1, testCanvas.height-marginSize);


            while(colorComponentNmbr--){

                tCtx.beginPath();

                tCtx.strokeStyle = (function(color){

                    switch(color){

                        case 'R':
                            return 'red';
                        case 'G':
                            return 'green';
                        case 'B':
                            return 'blue';

                    }

                })(colorKeys[colorComponentNmbr]);


                //first val
                tCtx.moveTo(
                    0,
                    -Math.round( yAxisLength*inColorMap[colorKeys[colorComponentNmbr]][0]/maxVal )
                );

                //next
                for(var i=0; i<255; i++){

                    tCtx.lineTo(
                        Math.round( xAxisLength*i/255 ),
                        -Math.round( yAxisLength*inColorMap[colorKeys[colorComponentNmbr]][i]/maxVal )
                    );

                }

                tCtx.stroke();
            }

            tCtx.restore();


            gData = gCtx.getImageData(0, 0, graphCanvas.width, graphCanvas.height).data;
            tData = tCtx.getImageData(0, 0, testCanvas.width, testCanvas.height).data;


            //------- check ------


            for(var x=0; x<gData.length; x++){

                if(gData[x] !== tData[x]){

                    canvasDiff.set(x, {
                        'org' : gData[x],
                        'exp' : tData[x]
                    });

                }

            }

            expect(gData.length).toBe(tData.length);
            expect(canvasDiff.size).toBe(0);

            //---------------------------

            testCanvas.parentNode.removeChild(testCanvas);
            sourceCanvas.parentNode.removeChild(sourceCanvas);

        })

    });

    describe('setParams', function(){

        //setParams = (user, def)

        var defaultConfig = {

            height : 400,
            width : 600,
            xLineDataInterval : 16,
            xAxisScale : true,
            yAxisScale : true

        },
        acceptedConfig = {};

        afterEach(function(){

            acceptedConfig = {};
        });


        it('should set correct height & width param', function(){

            var check = function(paramName){


                acceptedConfig = imgHistogram.test.setParams({
                    [paramName] : 0
                }, defaultConfig);

                expect(acceptedConfig[paramName]).toBe(defaultConfig[paramName]);


                acceptedConfig = imgHistogram.test.setParams({
                    [paramName] : null
                }, defaultConfig);

                expect(acceptedConfig[paramName]).toBe(defaultConfig[paramName]);


                acceptedConfig = imgHistogram.test.setParams({
                    [paramName] : ''
                }, defaultConfig);

                expect(acceptedConfig[paramName]).toBe(defaultConfig[paramName]);


                acceptedConfig = imgHistogram.test.setParams({
                    [paramName] : ''
                }, defaultConfig);

                expect(acceptedConfig[paramName]).toBe(defaultConfig[paramName]);


                acceptedConfig = imgHistogram.test.setParams({
                    [paramName] : '9'
                }, defaultConfig);

                expect(acceptedConfig[paramName]).toBe(defaultConfig[paramName]);


                acceptedConfig = imgHistogram.test.setParams({
                    [paramName] : '900'
                }, defaultConfig);

                expect(acceptedConfig[paramName]).toBe(defaultConfig[paramName]);


                //---------------------------


                acceptedConfig = imgHistogram.test.setParams({
                    [paramName] : 900
                }, defaultConfig);

                expect(acceptedConfig[paramName]).toBe(900);


                acceptedConfig = imgHistogram.test.setParams({
                    [paramName] : 900.4
                }, defaultConfig);

                expect(acceptedConfig[paramName]).toBe(900);


                acceptedConfig = imgHistogram.test.setParams({
                    [paramName] : 900.5
                }, defaultConfig);

                expect(acceptedConfig[paramName]).toBe(901);


                acceptedConfig = imgHistogram.test.setParams({
                    [paramName] : 90.41239876543218665
                }, defaultConfig);

                expect(acceptedConfig[paramName]).toBe(90);


                acceptedConfig = imgHistogram.test.setParams({
                    [paramName] : 30
                }, defaultConfig);

                expect(acceptedConfig[paramName]).toBe(30);


                acceptedConfig = imgHistogram.test.setParams({
                    [paramName] : Math.PI,
                }, defaultConfig);

                expect(acceptedConfig[paramName]).toBe(3);


                acceptedConfig = imgHistogram.test.setParams({
                    [paramName] : -123,
                }, defaultConfig);

                expect(acceptedConfig[paramName]).toBe(123);


                acceptedConfig = imgHistogram.test.setParams({
                    [paramName] : -Math.PI,
                }, defaultConfig);

                expect(acceptedConfig[paramName]).toBe(3);


            };

            check('height');

            check('width');

        });

        it('should set correct width param', function(){

            acceptedConfig = imgHistogram.test.setParams({
                width : 0
            }, defaultConfig);

            expect(acceptedConfig.width).toBe(defaultConfig.width);


            acceptedConfig = imgHistogram.test.setParams({
                width : null
            }, defaultConfig);

            expect(acceptedConfig.width).toBe(defaultConfig.width);


            acceptedConfig = imgHistogram.test.setParams({
                width : ''
            }, defaultConfig);

            expect(acceptedConfig.width).toBe(defaultConfig.width);


            acceptedConfig = imgHistogram.test.setParams({
                width : ''
            }, defaultConfig);

            expect(acceptedConfig.width).toBe(defaultConfig.width);


            acceptedConfig = imgHistogram.test.setParams({
                width : '9'
            }, defaultConfig);

            expect(acceptedConfig.width).toBe(defaultConfig.width);


            acceptedConfig = imgHistogram.test.setParams({
                width : '900'
            }, defaultConfig);

            expect(acceptedConfig.width).toBe(defaultConfig.width);


            //---------------------------


            acceptedConfig = imgHistogram.test.setParams({
                width : 900
            }, defaultConfig);

            expect(acceptedConfig.width).toBe(900);


            acceptedConfig = imgHistogram.test.setParams({
                width : 900.4
            }, defaultConfig);

            expect(acceptedConfig.width).toBe(900);


            acceptedConfig = imgHistogram.test.setParams({
                width : 900.5
            }, defaultConfig);

            expect(acceptedConfig.width).toBe(901);


            acceptedConfig = imgHistogram.test.setParams({
                width : 90.41239876543218665
            }, defaultConfig);

            expect(acceptedConfig.width).toBe(90);


            acceptedConfig = imgHistogram.test.setParams({
                width : 30
            }, defaultConfig);

            expect(acceptedConfig.width).toBe(30);


            acceptedConfig = imgHistogram.test.setParams({
                width : Math.PI,
            }, defaultConfig);

            expect(acceptedConfig.width).toBe(3);


            acceptedConfig = imgHistogram.test.setParams({
                width : -123,
            }, defaultConfig);

            expect(acceptedConfig.width).toBe(123);


            acceptedConfig = imgHistogram.test.setParams({
                width : -Math.PI,
            }, defaultConfig);

            expect(acceptedConfig.width).toBe(3);



        });

        it('should set correct xAxisScale & yAxisScale param', function(){

            var check = function(param){

                acceptedConfig = imgHistogram.test.setParams({
                    [param] : 0
                }, defaultConfig);


                expect(acceptedConfig[param]).toBe(true);


                acceptedConfig = imgHistogram.test.setParams({
                    [param] : false
                }, defaultConfig);

                expect(acceptedConfig[param]).toBe(false);


                acceptedConfig = imgHistogram.test.setParams({
                    [param] : ''
                }, defaultConfig);

                expect(acceptedConfig[param]).toBe(true);


                acceptedConfig = imgHistogram.test.setParams({
                    [param] : 'false'
                }, defaultConfig);

                expect(acceptedConfig[param]).toBe(true);


                acceptedConfig = imgHistogram.test.setParams({
                    [param] : null
                }, defaultConfig);

                expect(acceptedConfig[param]).toBe(true);


                acceptedConfig = imgHistogram.test.setParams({
                    [param] : 12
                }, defaultConfig);

                expect(acceptedConfig[param]).toBe(true);


                acceptedConfig = imgHistogram.test.setParams({
                    [param] : {}
                }, defaultConfig);

                expect(acceptedConfig[param]).toBe(true);

                acceptedConfig = imgHistogram.test.setParams({
                    [param] : 1
                }, defaultConfig);

                expect(acceptedConfig[param]).toBe(true);

            };


            check('xAxisScale');

            check('yAxisScale');

        });

        it('should set correct xLineDataInterval param', function(){

            var minAccepted = 4;


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : 0
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(acceptedConfig.xLineDataInterval);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : 2
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(acceptedConfig.xLineDataInterval);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : {}
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(acceptedConfig.xLineDataInterval);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : null
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(acceptedConfig.xLineDataInterval);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : -3
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(acceptedConfig.xLineDataInterval);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : 4
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(minAccepted);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : -4
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(minAccepted);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : 20
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(20);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : -40
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(40);

            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : '-40'
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(acceptedConfig.xLineDataInterval);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : 599
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(599);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : 600
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(600);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : 601
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(acceptedConfig.xLineDataInterval);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : -64362472472472727
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(acceptedConfig.xLineDataInterval);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : Math.PI
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(acceptedConfig.xLineDataInterval);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : 0.1212612376344612414515
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(acceptedConfig.xLineDataInterval);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : 0.00000000000000000000000000000000000000000001
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(acceptedConfig.xLineDataInterval);


            acceptedConfig = imgHistogram.test.setParams({
                xLineDataInterval : -0.00000000000000000000000000000000000000000001
            }, defaultConfig);

            expect(acceptedConfig.xLineDataInterval).toBe(acceptedConfig.xLineDataInterval);


        });


    });

});




