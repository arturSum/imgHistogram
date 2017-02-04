((global)=>{


    var createCanvasNode = (width, height)=>{

      var node = document.createElement('canvas');

      node.width = width;
      node.height = height;

      node.style.display = 'none';

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
    };



    //#########################################



    var imgHistogram = (conf={})=>{


        var inImg = new Image(),
            canvasInNode, ctxIn,
            canvasOutNode, ctxOut,
            colorsMap;


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

                    console.log('color map: ', colorsMap);





                };


                inImg.src = inputSrc;












            }


        }


    };




    global.imgHistogram = imgHistogram;


})(window);