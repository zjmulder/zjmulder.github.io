var drawSVG = function() {
                var counter=0;
                var skillsToSelect=[];
                var detailToSelect=0;

                var lastClick=null;
                var isActivated=false;

                var fontSizeLabel=14,
                    fontSizeExp=28,
                    fontSizeProj = 18,
                    fontSizeInfo = 24,
                    fontSizeHeader = 18,
                    tLength = 500;

                var vis = {
                    width:$('.skills svg').width()*.4,
                    height:$('.skills svg').height(),
                    gap:5,
                    maxRows:5,
                    maxCols:3,
                    xMargin:$('.skills svg').width()*.3,
                    top:0
                };

                var exp = {
                    width:$('.skills svg').width()*.3,
                    height:$('.skills svg').height(),
                    maxRows:4,
                    xMargin:0
                };

                var proj = {
                    width:$('.skills svg').width()*.3,
                    height:$('.skills svg').height(),
                    maxRows:4,
                    xMargin:vis.xMargin + vis.width
                };

                var info = {
                    width: vis.width + exp.width/2 + proj.width/2,
                    height:vis.top,
                    xMargin:exp.width/2,
                    radius:20
                };

                var total = {
                    width:vis.width + exp.width + proj.width,
                    height:vis.height
                }

                //hex calcs
                var lx = (vis.width-2*vis.maxCols*vis.gap)/(2*vis.maxCols*Math.cos(Math.PI/6));
                var ly = (vis.height-vis.gap*(vis.maxRows+1))/((3/2)*vis.maxRows+(1/2));

                var hex = {
                    l:Math.min(lx,ly)
                }
                var dx = hex.l * Math.cos(Math.PI/6);
                var dy = (3/2)*hex.l + vis.gap;
                var h = (hex.l/2)/(Math.tan(Math.PI/3));

                var getHexagon = function(n,x,y,i,d) {

                    var out = [];

                    out.push({x:x + vis.xMargin,y:y-hex.l});
                    out.push({x:x-dx + vis.xMargin, y:y-hex.l/2});
                    out.push({x:x-dx + vis.xMargin, y:y+hex.l/2});
                    out.push({x:x + vis.xMargin, y:y+hex.l});
                    out.push({x:x+dx + vis.xMargin, y:y+hex.l/2});
                    out.push({x:x+dx + vis.xMargin, y:y-hex.l/2});

                    return {n:n, p:out, cx:x, cy:y, icon:i, d:d};

                };

                //Takes in an array of directions
                //{d:L,M,Etc... x:0, y:0}
                //and returns a string with teh path object
                var getPath = function(a){
                    var out="";
                    a.forEach(function(e){
                        if(e.d=="A"){
                            out+=e.d + e.rx + "," + e.ry + "," + e.xrot + "," + e.l + "," + e.s + "," + e.x + "," + e.y;
                        } else {
                            out+=e.d + e.x + "," + e.y + " ";
                        }
                    });
                    return out;
                }

                var icons = {
                    blank: [{
                        d:"",
                        fill:"#FFF",
                        height:1,
                        width:1
                    }],
                    java:
                        {
                            d:
                                "M0 0M47.617 98.12c-19.192 5.362 11.677 16.439 36.115 5.969-4.003-1.556-6.874-3.351-6.874-3.351-10.897 2.06-15.952 2.222-25.844 1.092-8.164-.935-3.397-3.71-3.397-3.71zM80.806 87.66c-14.444 2.779-22.787 2.69-33.354 1.6-8.171-.845-2.822-4.805-2.822-4.805-21.137 7.016 11.767 14.977 41.309 6.336-3.14-1.106-5.133-3.131-5.133-3.131zM92.125 27.085c.001 0-42.731 10.669-22.323 34.187 6.024 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.793 15.634-29.58zM102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.095.171-4.45-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.952-3.487-32.013 6.85-13.742 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM85 77.896c2.395-1.634 5.703-3.053 5.703-3.053s-9.424 1.685-18.813 2.474c-11.494.964-23.823 1.154-30.012.326-14.652-1.959 8.033-7.348 8.033-7.348s-8.812-.596-19.644 4.644c-12.812 6.195 31.691 9.019 54.733 2.957zM90.609 93.041c-.108.29-.468.616-.468.616 31.273-8.221 19.775-28.979 4.822-23.725-1.312.464-2 1.543-2 1.543s.829-.334 2.678-.72c7.559-1.575 18.389 10.119-5.032 22.286zM64.181 70.069c-4.614-10.429-20.26-19.553.007-35.559 25.271-19.947 12.304-32.923 12.304-32.923 5.23 20.608-18.451 26.833-26.999 39.667-5.821 8.745 2.857 18.142 14.688 28.815zM91.455 121.817c-19.187 3.612-42.854 3.191-56.887.874 0 0 2.874 2.38 17.646 3.331 22.476 1.437 57-.8 57.816-11.436.001 0-1.57 4.032-18.575 7.231z M128 128",
                            class:
                                "coding-skill",
                            width:128,
                            height:128,
                            }
                    ,
                    html:
                        {
                            d:"M0 0M9.032 2l10.005 112.093 44.896 12.401 45.02-12.387 10.015-112.107h-109.936zm89.126 26.539l-.627 7.172-.276 3.289h-52.665000000000006l1.257 14h50.156000000000006l-.336 3.471-3.233 36.119-.238 2.27-28.196 7.749v.002l-.034.018-28.177-7.423-1.913-21.206h13.815000000000001l.979 10.919 15.287 4.081h.043v-.546l15.355-3.875 1.604-17.579h-47.698l-3.383-38.117-.329-3.883h68.939l-.33 3.539z M128 128",
                            class:"coding-skill",
                            width:128,
                            height:128
                        }
                    , js: {
                            d:"M0 0M2 1v125h125v-125h-125zm66.119 106.513c-1.845 3.749-5.367 6.212-9.448 7.401-6.271 1.44-12.269.619-16.731-2.059-2.986-1.832-5.318-4.652-6.901-7.901l9.52-5.83c.083.035.333.487.667 1.071 1.214 2.034 2.261 3.474 4.319 4.485 2.022.69 6.461 1.131 8.175-2.427 1.047-1.81.714-7.628.714-14.065-.001-10.115.046-20.188.046-30.188h11.709c0 11 .06 21.418 0 32.152.025 6.58.596 12.446-2.07 17.361zm48.574-3.308c-4.07 13.922-26.762 14.374-35.83 5.176-1.916-2.165-3.117-3.296-4.26-5.795 4.819-2.772 4.819-2.772 9.508-5.485 2.547 3.915 4.902 6.068 9.139 6.949 5.748.702 11.531-1.273 10.234-7.378-1.333-4.986-11.77-6.199-18.873-11.531-7.211-4.843-8.901-16.611-2.975-23.335 1.975-2.487 5.343-4.343 8.877-5.235l3.688-.477c7.081-.143 11.507 1.727 14.756 5.355.904.916 1.642 1.904 3.022 4.045-3.772 2.404-3.76 2.381-9.163 5.879-1.154-2.486-3.069-4.046-5.093-4.724-3.142-.952-7.104.083-7.926 3.403-.285 1.023-.226 1.975.227 3.665 1.273 2.903 5.545 4.165 9.377 5.926 11.031 4.474 14.756 9.271 15.672 14.981.882 4.916-.213 8.105-.38 8.581z M128 128",
                            class:'coding-skill',
                            width:128,
                            height:128
                    }
                    , css: {
                        d:"M0 0M8.76 1l10.055 112.883 45.118 12.58 45.244-12.626 10.063-112.837h-110.48zm89.591 25.862l-3.347 37.605.01.203-.014.467v-.004l-2.378 26.294-.262 2.336-28.36 7.844v.001l-.022.019-28.311-7.888-1.917-21.739h13.883l.985 11.054 15.386 4.17-.004.008v-.002l15.443-4.229 1.632-18.001h-32.282999999999994l-.277-3.043-.631-7.129-.331-3.828h34.748999999999995l1.264-14h-52.926l-.277-3.041-.63-7.131-.332-3.828h69.281l-.331 3.862z M128 128",
                        class:"coding-skill",
                        width:128,
                        height:128
                    }
                    , sql: {
                        d:"M0 0M262.24,172.91c0-0.82-0.136-1.606-0.379-2.344V43.641C261.861,14.99,199.508,0,137.914,0S13.967,14.99,13.967,43.641v188.926c0,28.65,62.354,43.641,123.947,43.641s123.947-14.99,123.947-43.641v-55.866C262.109,175.465,262.24,174.202,262.24,172.91z M28.967,65.614c22.171,14.291,65.744,21.667,108.947,21.667c23.078,0,45.5-2.062,64.842-5.961c4.061-0.819,6.688-4.774,5.87-8.835s-4.772-6.691-8.834-5.869c-18.382,3.706-39.779,5.665-61.877,5.665c-30.371,0-58.824-3.64-80.118-10.248c-19.915-6.182-28.83-13.691-28.83-18.393s8.915-12.211,28.83-18.393C79.09,18.64,107.543,15,137.914,15s58.824,3.64,80.118,10.248c19.915,6.181,28.83,13.691,28.83,18.393v62.997c0,4.701-8.915,12.211-28.83,18.392c-21.293,6.608-49.747,10.248-80.118,10.248c-30.371,0-58.824-3.64-80.118-10.248c-19.915-6.181-28.83-13.69-28.83-18.392V65.614z M218.032,250.959c-21.293,6.608-49.747,10.248-80.118,10.248s-58.824-3.64-80.118-10.248c-19.915-6.182-28.83-13.691-28.83-18.393V128.611c22.171,14.291,65.744,21.667,108.947,21.667s86.776-7.376,108.947-21.667v46.071c-1.877,4.681-10.88,11.167-28.451,16.62c-21.294,6.608-49.747,10.248-80.118,10.248c-30.372,0-58.825-3.64-80.118-10.248c-3.958-1.227-8.158,0.984-9.386,4.94c-1.228,3.956,0.984,8.158,4.94,9.386c22.694,7.043,52.726,10.922,84.564,10.922c42.961,0,86.284-7.295,108.568-21.428v37.445C246.861,237.268,237.947,244.778,218.032,250.959z M276.21 276.21",
                        class:"coding-skill",
                        width:276.21,
                        height:276.21
                    }, analytics: {
                        d:"M0 0M149.435 119.164V63.57c13.007-3.342 22.648-15.168 22.648-29.204 0-16.624-13.524-30.148-30.148-30.148 -16.623 0-30.147 13.524-30.147 30.148 0 14.036 9.641 25.861 22.647 29.203v55.594c-15.775 2.374-29.169 12.115-36.556 25.597l-32.99-25.646c0.807-2.271 1.25-4.714 1.25-7.258 0-11.99-9.755-21.745-21.745-21.745s-21.745 9.755-21.745 21.745 9.755 21.745 21.745 21.745c3.972 0 7.695-1.076 10.903-2.943l37.29 28.989c-0.55 2.971-0.852 6.027-0.852 9.155 0 11.14 3.652 21.44 9.815 29.777l-42.163 42.163c-2.929 2.929-2.929 7.678 0 10.606 1.465 1.464 3.385 2.197 5.304 2.197s3.839-0.732 5.304-2.197l42.163-42.163c6.429 4.753 14.026 8.012 22.277 9.254v55.718c-8.306 3.062-14.245 11.056-14.245 20.411 0 11.99 9.755 21.745 21.745 21.745s21.745-9.755 21.745-21.745c0-9.356-5.939-17.35-14.245-20.411v-55.717c24.136-3.631 42.7-24.506 42.7-49.637C192.135 143.67 173.57 122.795 149.435 119.164zM44.394 118.602c-3.72 0-6.745-3.026-6.745-6.745s3.025-6.745 6.745-6.745 6.745 3.026 6.745 6.745S48.113 118.602 44.394 118.602zM126.787 34.366c0-8.353 6.795-15.148 15.147-15.148s15.148 6.795 15.148 15.148c0 8.353-6.796 15.148-15.148 15.148S126.787 42.719 126.787 34.366zM141.935 301.313c-3.72 0-6.745-3.026-6.745-6.745 0-3.255 2.317-5.979 5.389-6.608 0.44 0.081 0.892 0.129 1.356 0.129s0.916-0.048 1.356-0.129c3.072 0.629 5.389 3.353 5.389 6.608C148.68 298.287 145.654 301.313 141.935 301.313zM141.935 204.001c-19.409 0-35.199-15.791-35.199-35.2 0-3.425 0.501-6.734 1.417-9.867 0.049-0.155 0.095-0.309 0.133-0.466 4.425-14.382 17.834-24.867 33.649-24.867 19.409 0 35.2 15.791 35.2 35.2C177.135 188.211 161.344 204.001 141.935 204.001zM290.384 95.953c-16.624 0-30.148 13.524-30.148 30.148 0 0.775 0.039 1.54 0.097 2.3l-54.238 18.493c-3.921 1.336-6.016 5.599-4.679 9.519 1.063 3.119 3.977 5.082 7.098 5.082 0.803 0 1.619-0.13 2.421-0.403l54.236-18.492c5.392 8.212 14.677 13.65 25.214 13.65 16.623 0 30.147-13.524 30.147-30.148C320.531 109.478 307.007 95.953 290.384 95.953zM290.384 141.25c-8.353 0-15.148-6.795-15.148-15.148 0-8.353 6.796-15.148 15.148-15.148s15.147 6.795 15.147 15.148C305.531 134.454 298.736 141.25 290.384 141.25zM30.148 250.44C13.524 250.44 0 263.965 0 280.588c0 16.624 13.524 30.148 30.148 30.148 16.623 0 30.147-13.524 30.147-30.148C60.296 263.965 46.771 250.44 30.148 250.44zM30.148 295.737c-8.353 0-15.148-6.795-15.148-15.148 0-8.353 6.796-15.148 15.148-15.148s15.147 6.795 15.147 15.148C45.296 288.941 38.501 295.737 30.148 295.737z M320.53 320.53",
                        class:"analytics-skill",
                        width:320.53,
                        height:320.53
                    }, modeling :{
                        d:"M0 0M290 258.723h-16.19V186.23c0-4.142-3.358-7.5-7.5-7.5h-53.333c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5h45.833v64.993h-38.333v-20.918c0-4.142-3.358-7.5-7.5-7.5s-7.5 3.358-7.5 7.5v20.918h-22.561V145.182c0-4.142-3.358-7.5-7.5-7.5h-53.333c-4.142 0-7.5 3.358-7.5 7.5v113.542H92.023v-49.337c0-4.142-3.358-7.5-7.5-7.5s-7.5 3.358-7.5 7.5v49.337H38.69v-41.837h15.06c4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5H31.19c-4.142 0-7.5 3.358-7.5 7.5v49.337H7.5c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5h23.69 53.333 37.561 53.333 37.561 53.333H290c4.142 0 7.5-3.358 7.5-7.5S294.142 258.723 290 258.723zM129.583 258.723V152.682h38.333v106.042H129.583zM49.737 126.015c1.507 0 3.029-0.453 4.349-1.395l93.584-66.749 37.395 41.302c2.59 2.862 6.928 3.29 10.028 0.99l65.426-48.54 -0.024 4.116c-0.024 4.142 3.314 7.52 7.456 7.544 0.015 0 0.03 0 0.045 0 4.121 0 7.475-3.329 7.499-7.456l0.11-18.774c0.014-0.25 0.016-0.5 0.004-0.75l0.007-1.274c0.021-3.643-2.579-6.775-6.164-7.424l-20.465-3.706c-4.077-0.741-7.978 1.967-8.716 6.043 -0.738 4.076 1.968 7.979 6.043 8.716l5.227 0.947 -59.924 44.458 -37.31-41.208c-2.554-2.821-6.817-3.283-9.915-1.072l-99.019 70.625c-3.373 2.405-4.156 7.089-1.751 10.461C45.088 124.922 47.395 126.015 49.737 126.015z M297.5 297.5",
                        class:"analytics-skill",
                        width:297.5,
                        height:297.5
                    }, learning: {
                        d:"M0 0M143.665 219.841h61.3c4.143 0 7.5-3.357 7.5-7.5v-92.197c0-4.143-3.357-7.5-7.5-7.5h-92.197c-4.143 0-7.5 3.357-7.5 7.5v92.197c0 4.143 3.357 7.5 7.5 7.5s7.5-3.357 7.5-7.5v-84.697h77.197v77.197h-53.8c-4.143 0-7.5 3.357-7.5 7.5S139.522 219.841 143.665 219.841zM158.865 148.745c1.979 0 3.909-0.8 5.3-2.2 1.399-1.39 2.2-3.33 2.2-5.3 0-1.971-0.801-3.9-2.2-5.3 -1.391-1.4-3.33-2.2-5.3-2.2 -1.971 0-3.91 0.8-5.301 2.2 -1.399 1.39-2.199 3.329-2.199 5.3 0 1.979 0.8 3.91 2.199 5.3C154.955 147.945 156.895 148.745 158.865 148.745zM153.564 170.865c1.391 1.399 3.33 2.199 5.301 2.199 1.979 0 3.909-0.8 5.3-2.199 1.399-1.391 2.2-3.33 2.2-5.301 0-1.97-0.801-3.899-2.2-5.3 -1.391-1.399-3.32-2.2-5.3-2.2 -1.971 0-3.91 0.801-5.301 2.2 -1.399 1.391-2.199 3.33-2.199 5.3C151.365 167.545 152.165 169.475 153.564 170.865zM153.564 195.185c1.391 1.4 3.33 2.2 5.301 2.2 1.979 0 3.909-0.8 5.3-2.2 1.399-1.39 2.2-3.33 2.2-5.3s-0.801-3.91-2.2-5.3c-1.391-1.4-3.32-2.2-5.3-2.2 -1.971 0-3.91 0.8-5.301 2.2 -1.399 1.39-2.199 3.33-2.199 5.3C151.365 191.865 152.165 193.795 153.564 195.185zM129.245 195.185c1.399 1.4 3.33 2.2 5.3 2.2 1.979 0 3.91-0.8 5.31-2.2 1.391-1.39 2.19-3.319 2.19-5.3 0-1.979-0.8-3.91-2.19-5.3 -1.399-1.4-3.33-2.2-5.31-2.2 -1.97 0-3.91 0.8-5.3 2.2 -1.4 1.39-2.2 3.33-2.2 5.3S127.845 193.795 129.245 195.185zM177.885 170.865c1.39 1.399 3.33 2.199 5.3 2.199 1.98 0 3.91-0.8 5.3-2.199 1.4-1.391 2.2-3.33 2.2-5.301 0-1.97-0.8-3.899-2.2-5.3 -1.39-1.399-3.319-2.2-5.3-2.2 -1.979 0-3.91 0.801-5.3 2.2 -1.4 1.391-2.2 3.32-2.2 5.3C175.685 167.545 176.484 169.475 177.885 170.865zM177.885 195.185c1.39 1.4 3.33 2.2 5.3 2.2 1.98 0 3.91-0.8 5.3-2.2 1.4-1.39 2.2-3.33 2.2-5.3s-0.8-3.91-2.2-5.3c-1.39-1.4-3.319-2.2-5.3-2.2 -1.979 0-3.91 0.8-5.3 2.2 -1.4 1.39-2.2 3.32-2.2 5.3C175.685 191.865 176.484 193.795 177.885 195.185zM183.185 148.745c1.971 0 3.91-0.8 5.3-2.19 1.4-1.399 2.2-3.34 2.2-5.31 0-1.971-0.8-3.9-2.2-5.3 -1.39-1.4-3.319-2.2-5.3-2.2 -1.979 0-3.91 0.8-5.3 2.2 -1.4 1.39-2.2 3.329-2.2 5.3 0 1.979 0.8 3.91 2.2 5.31C179.274 147.945 181.215 148.745 183.185 148.745zM129.245 170.865c1.399 1.399 3.33 2.199 5.3 2.199 1.979 0 3.91-0.8 5.31-2.199 1.391-1.391 2.19-3.32 2.19-5.301 0-1.97-0.8-3.909-2.19-5.3 -1.399-1.399-3.33-2.2-5.31-2.2 -1.97 0-3.91 0.801-5.3 2.2 -1.4 1.391-2.2 3.33-2.2 5.3C127.045 167.535 127.845 169.475 129.245 170.865zM134.545 148.745c1.979 0 3.91-0.8 5.31-2.19 1.391-1.399 2.19-3.33 2.19-5.31 0-1.98-0.8-3.91-2.19-5.3 -1.399-1.4-3.33-2.2-5.31-2.2 -1.97 0-3.91 0.8-5.3 2.2 -1.4 1.39-2.2 3.329-2.2 5.3 0 1.979 0.8 3.91 2.2 5.31C130.645 147.945 132.575 148.745 134.545 148.745zM23.399 186.478C10.497 186.478 0 196.975 0 209.877s10.497 23.398 23.399 23.398 23.398-10.496 23.398-23.398S36.302 186.478 23.399 186.478zM23.399 218.275c-4.632 0-8.399-3.768-8.399-8.398 0-4.632 3.768-8.399 8.399-8.399 4.631 0 8.398 3.768 8.398 8.399C31.798 214.508 28.03 218.275 23.399 218.275zM299.931 150.588c-12.902 0-23.398 10.497-23.398 23.399s10.496 23.398 23.398 23.398 23.399-10.496 23.399-23.398S312.833 150.588 299.931 150.588zM299.931 182.386c-4.631 0-8.398-3.768-8.398-8.398 0-4.632 3.768-8.399 8.398-8.399 4.632 0 8.399 3.768 8.399 8.399C308.33 178.618 304.563 182.386 299.931 182.386zM276.953 138.616l-12.804-12.805c-1.407-1.407-3.314-2.197-5.304-2.197h-20.299v-15.545c0-11.859-9.648-21.507-21.508-21.507h-16.896V50.961c9.233-3.134 15.898-11.88 15.898-22.159 0-12.902-10.496-23.398-23.398-23.398s-23.399 10.496-23.399 23.398c0 10.279 6.666 19.025 15.899 22.159v35.601h-4.812c-4.143 0-7.5 3.357-7.5 7.5s3.357 7.5 7.5 7.5h36.707c3.589 0 6.508 2.919 6.508 6.507v116.345c0 3.589-2.919 6.508-6.508 6.508H100.694c-3.589 0-6.508-2.919-6.508-6.508V108.069c0-3.588 2.919-6.507 6.508-6.507h48.971c4.143 0 7.5-3.357 7.5-7.5s-3.357-7.5-7.5-7.5h-10.319V63.814c0-1.989-0.79-3.896-2.197-5.304l-26.969-26.969c0.105-0.899 0.166-1.813 0.166-2.74 0-12.902-10.496-23.398-23.398-23.398S63.548 15.899 63.548 28.802s10.496 23.399 23.398 23.399c6.269 0 11.964-2.482 16.169-6.51l21.23 21.229v19.642h-23.651c-11.859 0-21.508 9.647-21.508 21.507v96.771H61.665c-4.143 0-7.5 3.357-7.5 7.5s3.357 7.5 7.5 7.5h17.521v4.573c0 11.859 9.648 21.508 21.508 21.508h62.156v20.141c0 1.989 0.79 3.896 2.196 5.304l13.087 13.087c-1.463 3.053-2.283 6.47-2.283 10.075 0 12.902 10.496 23.398 23.398 23.398s23.399-10.496 23.399-23.398 -10.497-23.399-23.399-23.399c-3.834 0-7.453 0.933-10.65 2.575l-10.749-10.748v-17.034h39.188c11.859 0 21.508-9.648 21.508-21.508v-85.8h17.192l10.606 10.607c1.465 1.465 3.384 2.197 5.304 2.197 1.919 0 3.839-0.732 5.303-2.196C279.882 146.294 279.882 141.545 276.953 138.616zM192.644 20.403c4.631 0 8.398 3.768 8.398 8.398 0 4.632-3.768 8.399-8.398 8.399 -4.632 0-8.399-3.768-8.399-8.399C184.244 24.171 188.012 20.403 192.644 20.403zM86.946 37.201c-4.631 0-8.398-3.768-8.398-8.399 0-4.631 3.768-8.398 8.398-8.398s8.398 3.768 8.398 8.398C95.345 33.434 91.577 37.201 86.946 37.201zM207.648 294.528c0 4.631-3.768 8.398-8.399 8.398 -4.631 0-8.398-3.768-8.398-8.398 0-4.632 3.768-8.399 8.398-8.399C203.881 286.129 207.648 289.896 207.648 294.528z M323.33 323.33",
                        class:"analytics-skill",
                        height:323.33,
                        width:323.33
                    }, r:{
                        d:"M0 0M361.453,485.937 C162.329,485.937 0.906,377.828 0.906,244.469 C0.906,111.109 162.329,3.000 361.453,3.000 C560.578,3.000 722.000,111.109 722.000,244.469 C722.000,377.828 560.578,485.937 361.453,485.937 ZM416.641,97.406 C265.289,97.406 142.594,171.314 142.594,262.484 C142.594,353.654 265.289,427.562 416.641,427.562 C567.992,427.562 679.687,377.033 679.687,262.484 C679.687,147.971 567.992,97.406 416.641,97.406 Z M550.000,377.000 C550.000,377.000 571.822,383.585 584.500,390.000 C588.899,392.226 596.510,396.668 602.000,402.500 C607.378,408.212 610.000,414.000 610.000,414.000 L696.000,559.000 L557.000,559.062 L492.000,437.000 C492.000,437.000 478.690,414.131 470.500,407.500 C463.668,401.969 460.755,400.000 454.000,400.000 C449.298,400.000 420.974,400.000 420.974,400.000 L421.000,558.974 L298.000,559.026 L298.000,152.938 L545.000,152.938 C545.000,152.938 657.500,154.967 657.500,262.000 C657.500,369.033 550.000,377.000 550.000,377.000 ZM496.500,241.024 L422.037,240.976 L422.000,310.026 L496.500,310.002 C496.500,310.002 531.000,309.895 531.000,274.877 C531.000,239.155 496.500,241.024 496.500,241.024 ZM722 722",
                        class:"coding-skill",
                        width:722,
                        height:722
                    }
                };

                var projects =[
                    [
                        {
                            id:"rankings",
                            text:"CSGO Scraper & Rankings",
                            skills:[
                                "analytics", "modeling", "java", "r", "sql"
                            ]
                        }, {
                            id:"ergodox",
                            text:"ErgoDox",
                            skills:[]
                        }, {
                            id:"website",
                            text:"This Website",
                            skills:[
                                "analytics", "java", "sql", "html", "js", "css"
                            ]
                        }
                    ],
                    [

                        {
                            id:"predictive",
                            text:"CSGO Live Predictions",
                            skills:[
                                "analytics", "modeling", "learning", "java", "r"
                            ]
                        }, {
                            id:"mobility",
                            text:"Mobility Simulation",
                            skills:[
                                "analytics", "modeling",
                            ]
                        }
                    ],
                    [],
                    [
                        {
                            id:"sonos",
                            text:"Dashboard for SONOS",
                            skills:[
                                "analytics", "modeling"
                            ]
                        }, {
                            id:"simulation",
                            text:"Get on Board",
                            skills:[
                                "analytics", "modeling"
                            ]
                        }
                    ]
                ];            

                var diamond = [];

                diamond.push(getHexagon("analytics", vis.width/2, vis.height/2 - 2*dy, icons.analytics, "Analytics"));
                diamond.push(getHexagon("modeling",vis.width/2-(vis.gap+dx), vis.height/2-1*dy, icons.modeling, "Modeling"));
                diamond.push(getHexagon("learning", vis.width/2+(vis.gap+dx), vis.height/2-1*dy, icons.learning, "Machine Learning"));
                diamond.push(getHexagon("java", vis.width/2-2*(vis.gap+dx), vis.height/2, icons.java, "Java"));
                diamond.push(getHexagon("r", vis.width/2, vis.height/2, icons.r,"R"));
                diamond.push(getHexagon("sql", vis.width/2+2*(vis.gap+dx), vis.height/2, icons.sql, "SQL"));
                diamond.push(getHexagon("html", vis.width/2-(vis.gap+dx), vis.height/2 + 1*dy, icons.html, "HTML"));
                diamond.push(getHexagon("js", vis.width/2+(vis.gap+dx), vis.height/2 + 1*dy, icons.js, "JavaScript"));
                diamond.push(getHexagon("css", vis.width/2, vis.height/2 + 2*dy, icons.css, "CSS"));

                var seps = [
                    {
                        x1:0,
                        y1:diamond[1].p[1].y,
                        x2:diamond[1].p[1].x-vis.gap*4,
                        y2:diamond[1].p[1].y
                    },
                    {
                        x1:vis.gap*4 + diamond[2].p[5].x,
                        y1:diamond[1].p[1].y,
                        x2:proj.xMargin + proj.width,
                        y2:diamond[1].p[1].y
                    },
                    {
                        x1:0,
                        y1:diamond[3].cy,
                        x2:diamond[3].p[1].x-vis.gap*4,
                        y2:diamond[3].cy
                    },
                    {
                        x1:vis.gap*4 + diamond[5].p[5].x,
                        y1:diamond[5].cy,
                        x2:proj.xMargin + proj.width,
                        y2:diamond[5].cy
                    },
                    



                ];

                var labs = [
                    {
                        text:"Grad",
                        x:vis.gap,
                        y:seps[0].y1 + fontSizeLabel,
                        textAnchor:"start",
                        fontSize:fontSizeLabel
                    }, 
                    {
                        text:"Grad",
                        x:proj.xMargin + proj.width-vis.gap,
                        y:seps[1].y1 + fontSizeLabel,
                        textAnchor:"end",
                        fontSize:fontSizeLabel
                    },
                    {
                        text:"Undergrad",
                        x:vis.gap,
                        y:seps[2].y1 + fontSizeLabel,
                        textAnchor:"start",
                        fontSize:fontSizeLabel
                    }, 
                    {
                        text:"Undergrad",
                        x:proj.xMargin + proj.width-vis.gap,
                        y:seps[3].y1 + fontSizeLabel,
                        textAnchor:"end",
                        fontSize:fontSizeLabel
                    }
                ];

                var exps = [
                        {
                            text:"Deloitte",
                            x:exp.width/2,
                            y:seps[0].y1/2,
                            skills:[
                                "analytics", "sql", "r", "html", "js", "css"
                            ]
                        },
                        {
                            text:"GSI",
                            x:exp.width/2,
                            y:seps[0].y1 + (seps[2].y1-seps[0].y1)/2,
                            skills:[
                                "analytics", "modeling", "r", "sql"
                            ]
                        },
                        {
                            text:"Boeing",
                            x:exp.width/2,
                            y:seps[2].y1 + seps[0].y1/2,
                            skills:[
                                "analytics", "sql"
                            ]
                        },
                        {
                            text:"AutoLab",
                            x:exp.width/2,
                            y:seps[2].y1 + seps[0].y1 + (seps[2].y1-seps[0].y1)/2,
                            skills:[
                                "analytics", "modeling", "learning", "r"
                            ]
                        }
                    ];

                d3.selectAll('.skills svg *').remove();
                var svg = d3.select(".skills svg");


                var box = svg;
                svg = svg.append("g").attr("transform", "translate(0," + vis.top + ")");


                svg.selectAll("filter")
                    .data([2,15])
                    .enter()
                    .append("filter")
                    .attr("id", function(f){return "hexFilter_" + f;})
                    .append("feGaussianBlur")
                    .attr("in", "SourceGraphic")
                    .attr("stdDeviation", function(f){return f});

                var x = d3.scaleLinear()
                        .domain([0, vis.width])
                        .range([0, vis.width]);

                var y = d3.scaleLinear()
                        .domain([0, vis.width])
                        .range([0, vis.width]);            

                var maxLabSize=0;
                var labBox=[];

                svg.selectAll(".hex-group")
                    .data(diamond)
                    .enter()
                    .append("g")
                    .attr("class", "hex-group")
                    .attr("id", function(d){
                            return "hex-group-" + d.n;
                    })
                    .each(function(f, i) {
                        d3.select(this)
                            .append("polygon")
                            .attr("points", function(d) {
                                var a=d.p.map(function(d) {
                                    return [x(d.x),y(d.y)].join(",");
                                    }).join(" ");
                                return a;
                            })
                            .attr("href", function(d){
                                return "#skill_" + d.n;
                            })
                            .attr("class", "hex-skill-back")
                            .attr("stroke-width", function(d,i){
                                if(i==0){
                                    return 0;
                                } else {
                                    return 0;
                                }
                            })
                            .attr("stroke","#000")
                            .attr("fill", "#11151C");

                        d3.select(this)
                            .append("path")
                            .attr("d", function(d){
                                return d.icon.d;
                            })
                            .attr("class", function(d){
                                return d.icon.class;
                            })
                            .attr("transform", function(d){
                                return 'translate(' + (d.p[1].x + dx - hex.l/2) + ',' + (d.p[1].y) + ') scale(' + hex.l/d.icon.width + ',' + hex.l/d.icon.height + ')';
                            });

                        d3.select(this)
                            .append("polygon")
                            .attr("points", function(d) {
                                var a=d.p.map(function(d) {
                                    return [x(d.x),y(d.y)].join(",");
                                    }).join(" ");
                                return a;
                            })
                            .attr("href", function(d){
                                return "#skill_" + d.n;
                            })
                            .attr("class", function(d) {
                                if(i==0){
                                    return "hex-skill active " + d.icon.class;
                                } else {
                                    return "hex-skill " + d.icon.class;
                                }
                            })
                            .attr("fill", "#FFF")
                            .attr("fill-opacity", "0")
                            .attr("id", function(d){return "hex_" + d.n;});

                        words=[];
                        words=f.d.split(" ");
                        var that = this;
                        words.forEach(function(g,i){
                            d3.select(that)
                                .append("text")
                                .text(g)
                                .attr("text-anchor", "middle")
                                .attr("font-size", "12")
                                .attr("alignment-baseline", "central")
                                .attr('fill', "#FFF")
                                .attr("x", (f.p[1].x + dx))
                                .attr("y", (f.p[1].y + vis.gap))
                                .attr("class", "hex-skill-lab")
                                .each(function(h){
                                    var boxSize = this.getBBox();
                                    labBox.push(boxSize);
                                    if(boxSize.width>maxLabSize){
                                        maxLabSize=boxSize.width;
                                    }
                                });
                        })

                        d3.select(this)
                            .append("path")
                            .attr("asd")

                      });

                var ratio = (dx*2-2*vis.gap)/(maxLabSize);
                var counter = 0;
                var last;
                d3.selectAll('.hex-group')
                    .each(function(r, j){
                        d3.select(this)
                            .selectAll('.hex-skill-lab')
                            .each(function (h, i){
                                d3.select(this)
                                    .attr('x', (h.p[1].x + dx)/ratio)
                                    .attr('y', function() {
                                        counter++;
                                        if(r.d.split(" ").length>1) {
                                            if(i==0) {
                                                return ((h.p[0].y + hex.l - vis.gap/2 - (labBox[counter].height*ratio)/2)/ratio);
                                            } else {
                                                return ((h.p[0].y + hex.l + vis.gap/2 + (labBox[counter].height*ratio)/2)/ratio);
                                            }
                                        } else {
                                            return (h.p[0].y + hex.l)/ratio;
                                        }
                                    })
                                    .attr("transform", "scale(" + ratio + ")")
                                    .attr("fill-opacity", "0");
                    });
                });


                var separators = svg.selectAll('.separator')
                    .data(seps)
                    .enter()
                    .append("line")
                    .attr("x1", function(d){return d.x1;})
                    .attr("y1", function(d){return d.y1;})
                    .attr("x2", function(d){return d.x2;})
                    .attr("y2", function(d){return d.y2;})
                    .attr("class", "separator")
                    .attr("stroke-dasharray", "25 15");

                var labels = svg.selectAll(".label.separator")
                    .data(labs)
                    .enter()
                    .append("text")
                    .attr("x", function(d) {return d.x;})
                    .attr("y", function(d) {return d.y;})
                    .attr("text-anchor", function(d){return d.textAnchor;})    
                    .text(function(d) {return d.text})  
                    .attr("font-size", function(d){return d.fontSize;})
                    .attr("class", "label separator");

                var expBox = [];
                var expBoxWidest;
                var maxWidth = 0;
                var experiences = svg.selectAll(".experience")
                    .data(exps)
                    .enter()
                    .append("text")
                    .attr("x", function(d){return d.x;})
                    .attr("y", function(d){return d.y;})
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "central")
                    .text(function(d) {return d.text;})
                    .attr("font-size", fontSizeExp)
                    .attr("class", "experience")
                    .each(function(d){
                        expBox.push({box:this.getBBox(), exp:d});
                        if(this.getBBox().width>=maxWidth){
                            maxWidth=this.getBBox().width;
                            expBoxWidest = this.getBBox();
                        }
                    });

                var experiencesBox = svg.selectAll(".experienceBox")
                    .data(expBox)
                    .enter()
                    .append("g")
                    .attr("class", "exp-click")
                    .attr("href", function(d){return d.exp.skills.toString();})
                    .attr("detail", function(d){return d.exp.text;})
                    .each(function(d, i){
                        exp=d.exp;
                        d=d.box;
                        //var gap = (i==2) ? vis.gap : 0;
                        var gap = 0;
                        var lX = d.x-vis.gap,
                            rX = d.x + d.width + vis.gap,
                            tY = d.y-vis.gap,
                            dY = d.y+d.height-vis.gap,
                            bY = d.y+d.height,
                            gapX = seps[2].x2-(expBoxWidest.x + expBoxWidest.width + vis.gap),
                            conX = (expBoxWidest.x + expBoxWidest.width + vis.gap) - rX,
                            gapY = seps[2].y2-dY;

                        //Bottom
                        d3.select(this)
                            .append("path")
                            .attr("d", function(e){
                                e=e.box;
                                return "M" + (e.x-vis.gap) + " " + (e.y + e.height-vis.gap) + "L" + (e.x-vis.gap) + " " + (e.y+e.height + gap) + "L" + (e.x + e.width + vis.gap) + " " + (e.y + e.height + gap) + "L" + (e.x + e.width + vis.gap) + " " + (e.y + e.height - vis.gap); 
                            })
                            .attr("fill", "none")
                            .attr("stroke", "#33658A")
                            .attr("stroke-width", "1")
                            .attr("class", "exp-click-inactive");

                        //Box
                        d3.select(this)
                            .append("path")
                            .attr("d", function(e){
                                return getPath([
                                    {d:"M", x:rX, y:(bY-vis.gap)},
                                    {d:"L", x:rX, y:bY},
                                    {d:"L", x:lX, y:bY},
                                    {d:"L", x:lX, y:tY},
                                    {d:"L", x:rX, y:tY},
                                    {d:"L", x:rX, y:(bY-d.height/2)}
                                ]);
                            })
                            .attr("fill", "none")
                            .attr("stroke", "#33658A")
                            .attr("stroke-width", "0")
                            .attr("class", "exp-click-active");

                        //Wee little leg for the box
                        d3.select(this)
                            .append('path')
                            .attr("d", function(e){
                                return getPath([
                                    {d:"M", x:rX, y:(bY - d.height/2)},
                                    {d:"L", x:rX, y:bY}
                                ]);
                            })
                            .attr("fill","none")
                            .attr("stroke", "#33658A")
                            .attr("stroke-width","0")
                            .attr("class", "exp-click-leg");

                        //Rect for on click
                        d3.select(this)
                            .append("rect")
                            .attr("x", function(e){return d.x-vis.gap;})
                            .attr("y", function(e){return d.y-vis.gap;})
                            .attr("width", function(e){return d.width + 2*vis.gap;})
                            .attr("height", function(e){return d.height + 2*vis.gap;})
                            .attr("fill", "#AAA")
                            .attr("fill-opacity", "0");

                        //Line towards skills
                        d3.select(this)
                            .append("path")
                            .attr("d", function(e){
                                return getPath([
                                    {d:"M", x:rX, y:bY - d.height/2},
                                    {d:"L", x:rX + conX, y:bY - d.height/2},
                                    {d:"L", x:rX + conX + gapX/3, y:bY-d.height/2},
                                    {d:"L", x:rX + conX + 2*gapX/3, y:dY + gapY},
                                    {d:"L", x:rX + conX + gapX, y:dY + gapY}
                                ]); 
                            })
                            .attr("fill", "none")
                            .attr("stroke", "none")
                            .attr("stroke-width", "0")
                            .attr("class", "exp-click-path");
                    });

                //Projects
                var widestWidth=0;
                svg.selectAll(".projects_row")
                    .data(projects)
                    .enter()
                    .each(function(d, i){
                        //d is one row
                        //i is row number
                        x = proj.xMargin + proj.width/2;
                        l = d.length;
                        if(i==0){
                            y = seps[0].y1/2;
                        }else if(i==1){
                            y = seps[0].y1 + (seps[2].y1-seps[0].y1)/2;
                        } else {
                            y=((seps[2].y1 + seps[0].y1 + (seps[2].y1-seps[0].y1)/2) - (seps[2].y1 + seps[0].y1/2))/2 + (seps[2].y1 + seps[0].y1/2);
                        }
                        //draw each text to get the width
                        var projBoxes = [];
                        var widestBox;
                        svg.selectAll(".projects-row.row-" + i)
                            .data(d)
                            .enter()
                            .append("g")
                            .attr("class", "projects-row row-" + i)
                            .each(function(e,i) {

                                d3.select(this)
                                    .append("text")
                                    .attr("x", x)
                                    .attr("y", y)
                                    .attr("text-anchor", "middle")
                                    .attr("alignment-baseline", "central")
                                    .text(function(f){return f.text;})
                                    .attr("font-size", fontSizeProj)
                                    .attr("class", "project")
                                    .each(function(){
                                        projBoxes.push({box:this.getBBox(), x:0, y:y, e:e});
                                        if(this.getBBox().width>widestWidth){
                                            widestWidth = this.getBBox().width;
                                        }
                                        //this.remove();
                                    });
                            });
                    
                        d3.selectAll(".projects-row").remove();

                        if(projBoxes.length!=0) {
                            if(projBoxes.length % 2 == 0){
                                var start = projBoxes.length/2-1;
                                var xBaseL = x - 2*vis.gap,
                                    xBaseR = x + 2*vis.gap;
                            } else {
                                var midBox = Math.floor(projBoxes.length/2);
                                var start = midBox-1;
                                var xBaseL = x - projBoxes[midBox].box.width/2 - 4 * vis.gap,
                                    xBaseR = x - projBoxes[midBox].box.width/2;
                            }

                            var xVal = xBaseL;
                            for(var j =start; j>=0;j--){
                                xVal = xVal - projBoxes[j].box.width;
                                projBoxes[j].x=xVal;
                                xVal = xVal - 4 * vis.gap;
                            }

                            xVal = xBaseR;
                            for (var j = start+1; j<projBoxes.length;j++){
                                projBoxes[j].x = xVal;
                                xVal += projBoxes[j].box.width + 4 * vis.gap;

                                if(xVal>=total.width){
                                }
                            }

                        }

                        //now actually draw the text with the new x coord
                        svg.selectAll(".projects-row.row-" + i)
                            .remove();

                        svg.selectAll(".project-row.row-" + i)
                            .data(projBoxes)
                            .enter()
                            .append("g")
                            .attr("class", "project-row row-" + i)
                            .attr('href', function(e){return e.e.skills.toString();})
                            .attr('detail', function(e){return e.e.id;})
                            .each(function(e,j) {


                                var mX = proj.xMargin + proj.width/2,
                                    lX = mX - e.box.width/2 - vis.gap,
                                    rX = mX + e.box.width/2 + vis.gap;

                                if(projBoxes.length==3){
                                    if(j==0){
                                        var dY = e.y - 3*vis.gap - e.box.height/2;
                                        //var dY = e.y - vis.gap - e.box.height;
                                    } else if(j==1){
                                        var dY=e.y + e.box.height/2-vis.gap;
                                        //var dY=e.y + e.box.height/2;
                                    } else {
                                        //var dY= e.y + (3/2) * e.box.height  + 1* vis.gap;
                                        var dY= e.y + (3/2) * e.box.height  + vis.gap;
                                    }
                                } else if(projBoxes.length==2){
                                    if(j==0){
                                        //var dY= e.y + e.box.height/2 - (vis.gap + e.box.height/2);
                                        var dY= e.y - 2*vis.gap;
                                        
                                    } else {
                                        //var dY = e.y + e.box.height/2 + (vis.gap + e.box.height/2);
                                        var dY = e.y + e.box.height + vis.gap;
                                    }
                                }
                            
                                //var tY = dY-e.box.height/2,
                                var tY = dY - e.box.height,
                                pY = tY + e.box.height/2,
                                mY = tY + e.box.height,
                                bY = tY + e.box.height+vis.gap;

                                var gapX = mX - widestWidth/2 - seps[3].x1,
                                    sX = mX - widestWidth/2 - gapX/3;

                                //Text first
                                d3.select(this)
                                    .append("text")
                                    .attr("x", function(f){return mX;})
                                    .attr("y", dY)
                                    .attr("text-anchor", "middle")

                                    .text(function(f){return f.e.text;})
                                    .attr("font-size", fontSizeProj)
                                    .attr("class", "project");

                                //Underline
                                d3.select(this)
                                    .append("path")
                                    .attr("d", function(f){
                                        return getPath([
                                            {d:"M", x:lX, y:mY},
                                            {d:"L", x:lX, y:bY},
                                            {d:"L", x:rX, y:bY},
                                            {d:"L", x:rX, y:mY}
                                        ]);
                                    })
                                    .attr("stroke", "#49306B")
                                    .attr("stroke-width", "1")
                                    .attr("fill", "none");

                                //Box path
                                d3.select(this)
                                    .append("path")
                                    .attr("d", function(f){

                                        return getPath([
                                            {d:"M", x:lX, y:mY},
                                            {d:"L", x:lX, y:bY},
                                            {d:"L", x:rX, y:bY},
                                            {d:"L", x:rX, y:mY},
                                            {d:"L", x:rX, y:tY},
                                            {d:"L", x:lX, y:tY},
                                            {d:"L", x:lX, y:pY}
                                        ])

                                    })
                                    .attr("fill", "none")
                                    .attr("stroke", "#49306B")
                                    .attr("stroke-width", "0")
                                    .attr("class", "project-click-active");

                                d3.select(this)
                                    .append("path")
                                    .attr("d", function(f){

                                        return getPath([
                                            {d:"M", x:lX, y:pY},
                                            {d:"L", x:lX, y:bY}
                                        ])
                                    })
                                    .attr("fill", "none")
                                    .attr("stroke", "#49306B")
                                    .attr("stroke-width", "0")
                                    .attr("class", "project-click-active-leg");

                                //Line from mid bottom to right side of thing
                                var hGap = 0;
                                var sY = 0;
                                if(i==0){
                                    hGap = seps[0].y1 - bY;
                                    sY = bY
                                } else if(i==1) {
                                    sY = bY;
                                    hGap = seps[2].y1 - bY;
                                } else {
                                    sY = tY;
                                    hGap = seps[2].y1-tY;
                                }

                                d3.select(this)
                                    .append('path')
                                    .attr("d", function(f){

                                        return getPath([
                                            {d:"M", x:lX, y:pY},
                                            {d:"L", x:sX, y:pY},
                                            {d:"L", x:sX - gapX/3, y:seps[3].y1},
                                            {d:"L", x:sX - 2*gapX/3, y:seps[3].y1}
                                        ])

                                    })
                                    .attr("fill", "none")
                                    .attr("stroke", "none")
                                    .attr("stroke-width", "0")
                                    .attr("class", "project-click-active-path");

                                //onclick rect
                                d3.select(this)
                                    .append("rect")
                                    .attr("x", function(f) {return lX;})
                                    .attr("y", function(f) {return tY;})
                                    .attr("width", function(f){return f.box.width + vis.gap*2;})
                                    .attr("height", function(f){return f.box.height;})
                                    .attr("fill-opacity", "0")
                                    .attr("class", "project-click");
                            });
                    });


                    var applyFilter = function(e, targ){
                        targ = targ || this;
                        $('polygon', targ).attr("filter", "url(#hexFilter_2)");
                        $('.hex-skill', targ).addClass("hover");
                        $('path', targ).attr("filter", "url(#hexFilter_15)");
                        $('.hex-skill-lab', targ).attr("fill-opacity", "1");
                    }
                    var unapplyFilter = function(e, targ, force){
                        force = force || false;

                        if(targ!=this && !force){
                            targ = targ || this;
                            if($('.hex-skill', targ).hasClass("active")) {return;}
                        }
                        targ = targ || this;
                        $(targ).children().removeAttr("filter");
                        $('.hex-skill', targ).removeClass("hover");
                        $('.hex-skill-lab', targ).attr("fill-opacity", "0");
                    }
                    $('.hex-group').hover(applyFilter, unapplyFilter);

                    var selectSkills = function() {
                        if(skillsToSelect != undefined && skillsToSelect.length!=0){
                            skillsToSelect.forEach(function(d){
                                $('#hex_' + d).addClass("active");
                                applyFilter(null,$('#hex-group-' +d));
                                $('.skills-container').removeClass('first');
                                $('.skills-container.active').removeClass('active');
                                $('#detail-' + detailToSelect).addClass('active');
                            });

                            skillsToSelect = [];
                            detailToSelect = null;
                        }

                    }
                    //EXP click
                    var expClick = function(e, eraseOnly, tran, tran2) {
                        
                        var transitionLength = tLength;
                        
                        if(!isActivated){
                            transitionLength=0;
                        }
                        if(this == lastClick) {
                            return;
                        }
                        isActivated=true;
                        eraseOnly = eraseOnly || false;
                        tran = tran || false;
                        tran2 = tran2 || false;

                        var erase = d3.select(".exp-click-active.active");
                        var eraseGap = d3.select(".exp-click.active .exp-click-path");
                        var eraseLeg = d3.select(".exp-click.active .exp-click-leg");

                        $('.exp-click-active').removeClass("active");
                        if(!eraseOnly) {
                            lastClick = this;
                            $('.hex-group').each(function() {unapplyFilter(null, this, true);});
                            $('.exp-click').removeClass('active');
                            $('.hex-skill').removeClass("active");
                            $('.exp-click-active', this).addClass("active");
                            $(this).addClass('active');

                            skillsToSelect = this.attributes.href.value.split(",");
                            detailToSelect = this.attributes.detail.value.toLowerCase();
                            var path = d3.select(this)
                                .select(".exp-click-active");
                            
                            var gapPath = d3.select(this)
                                .select(".exp-click-path");
                            
                            var leg = d3.select(this)
                                .select(".exp-click-leg");

                            totalLength = path.node().getTotalLength();
                        }


                        //Transition 1
                        //Draw box
                        var t = d3.transition()
                            .duration(transitionLength)
                            .ease(d3.easeLinear);

                        //Transition 2a
                        var t2a = t.transition()
                            .duration(transitionLength)
                            .ease(d3.easeLinear)
                            .on("end", selectSkills);

                        if(!eraseOnly) {
                            
                            if(path.attr("stroke-dashoffset")!=0){ 
                                path
                                .attr("stroke-width", "2")
                                .attr("stroke-dasharray", totalLength + " " + totalLength)
                                .attr("stroke-dashoffset", totalLength)
                                .transition(t)
                                    .attr("stroke-dashoffset", 0);
                            }

                            var gapPathLength = gapPath.node().getTotalLength();

                            gapPath
                                .attr("stroke-width", "2")
                                .attr("stroke","#33658A")
                                .attr("stroke-dasharray", gapPathLength + " " + gapPathLength)
                                .attr("stroke-dashoffset", gapPathLength)
                                .transition(t2a)
                                    .attr("stroke-dashoffset", 0);

                            legLength = leg.node().getTotalLength();
                            legTime = legLength/(totalLength/tLength);

                            if(leg.attr("stroke-dashoffset")!=0) {
                                leg.interrupt()
                                .attr("stroke-width", "2")
                                .attr("stroke","#33658A")
                                .attr("stroke-dasharray", legLength + " " + legLength)
                                .attr("stroke-dashoffset", legLength)
                                .transition(t2a)
                                    .duration(legTime)
                                    .attr("stroke-dashoffset", 0);
                            }
                        }

                        if(eraseGap.node() != null) {
                            eraseGapLength = eraseGap.node().getTotalLength();

                            eraseGap.transition(t)
                                .attr("stroke-dashoffset",eraseGapLength);
                        }


                        if(eraseLeg.node() != null) {
                            lEraseLeg = eraseLeg.node().getTotalLength();

                            eraseLeg.transition(t2a)
                                .duration(legTime)
                                .attr("stroke-dashoffset", lEraseLeg);
                        }

                        if(erase.node() !=null){

                            totalLengthErase = erase.node().getTotalLength();

                            erase.transition(t2a)
                                .delay(legTime)
                                .duration(tLength-legTime)
                                .attr("stroke-dashoffset", totalLengthErase);
                        }

                        if(!eraseOnly) {projClick(e, true, t, t2a);}

                    }


                    var expMouseOver = function(e) {
                        if($(this).hasClass('active') || e.target.nodeName=='path'){
                            return;
                        }
                        $(this).addClass('hover');
                        var path = d3.select(this)
                                .select(".exp-click-active");

                        totalLength = path.node().getTotalLength();

                        var leg = d3.select(this)
                                .select(".exp-click-leg");

                            legLength = leg.node().getTotalLength();
                            legTime = legLength/(totalLength/tLength);
                        var t = d3.transition()
                            .duration(tLength)
                            .ease(d3.easeLinear);

                        var t2 = t.transition()
                            .duration(legTime)
                            .ease(d3.easeLinear)
                            .on("end", selectSkills);;

                         path.interrupt()
                                .attr("stroke-width", "2")
                                .attr("stroke-dasharray", totalLength + " " + totalLength)
                                .attr("stroke-dashoffset", totalLength)
                                .transition(t)
                                    .attr("stroke-dashoffset", 0);

                            leg.interrupt()
                                .attr("stroke-width", "2")
                                .attr("stroke","#33658A")
                                .attr("stroke-dasharray", legLength + " " + legLength)
                                .attr("stroke-dashoffset", legLength)
                                .transition(t2)
                                    .duration(legTime)
                                    .attr("stroke-dashoffset", 0);

                    }

                    var expMouseOut = function(e){
                        if($(this).hasClass('active') || e.target.nodeName=='path') {
                            return;
                        }
                        var erase = d3.select(this).select(".exp-click-active");
                        var eraseLeg = d3.select(this).select(".exp-click-leg");

                        var t = d3.transition()
                            .duration(tLength)
                            .ease(d3.easeLinear);

                        if(erase.node() !=null && eraseLeg.node()!=null){
                            totalLengthErase = erase.node().getTotalLength();
                            lEraseLeg = eraseLeg.node().getTotalLength();

                            eDrawnLength = lEraseLeg-$(".exp-click-leg",this).attr("stroke-dashoffset")

                            if(eDrawnLength < lEraseLeg){
                                legTime = eDrawnLength/(totalLengthErase/tLength);

                            }
                            var t = d3.transition()
                                .duration(legTime)
                                .ease(d3.easeLinear);

                            eraseLeg.transition(t)
                                .attr("stroke-dashoffset", lEraseLeg)

                            t2 = t.transition()
                                .duration(tLength)
                                .ease(d3.easeLinear)
                                .on("end", selectSkills);;

                            var that = this;
                            erase.transition(t2)
                                .attr("stroke-dashoffset", totalLengthErase)
                                .on("end", function(){
                                    $(that).removeClass('hover');
                                    selectSkills();
                                });
                        }

                        //$(this).removeClass('hover');
                    }

                    $('.exp-click').on('click', expClick);
                    $('.exp-click').on('mouseover', expMouseOver);
                    $('.exp-click').on('mouseout', expMouseOut);


                    //Project click
                    var projClick = function(e, eraseOnly, tran, tran2) {

                        /**if($(this).hasClass('active')){
                            return;
                        }*/
                        if(this==lastClick){
                            return;
                        }
                        isActivated=true;
                        eraseOnly = eraseOnly || false;
                        tran = tran || false;
                        tran2 = tran2 || false;

                        var eBox = d3.select('.project-row.active')
                            .select(".project-click-active");
                        var eLeg = d3.select('.project-row.active')
                            .select('.project-click-active-leg');
                        var ePath = d3.select('.project-row.active')
                            .select('.project-click-active-path');

                        $('.project-row').removeClass('active');

                        if(!eraseOnly) {
                            lastClick=this;
                            $('.hex-group').each(function() {unapplyFilter(null, this, true);});
                            $('.hex-skill').removeClass("active");

                            skillsToSelect = this.attributes.href.value.split(",");
                            detailToSelect = this.attributes.detail.value.toLowerCase();
                            var box = d3.select(this)
                                .select(".project-click-active");
                            var leg = d3.select(this)
                                .select(".project-click-active-leg");
                            var path = d3.select(this)
                                .select('.project-click-active-path');

                            $(this).addClass('active');

                            var pathLength = path.node().getTotalLength(),
                                boxLength = box.node().getTotalLength(),
                                legLength = leg.node().getTotalLength();

                        }

                        var t = d3.transition()
                            .duration(tLength)
                            .ease(d3.easeLinear);

                        var t2 = t.transition()
                            .duration(tLength)
                            .ease(d3.easeLinear)
                            .on("end", selectSkills);


                        if(!eraseOnly) {
                            if(box.attr("stroke-dashoffset")!=0){
                                box.attr("stroke-width", "2")
                                    .attr("stroke-dasharray", boxLength + " " + boxLength)
                                    .attr("stroke-dashoffset", boxLength)
                                    .transition(t)
                                        .attr("stroke-dashoffset", 0);
                            }
                            
                            legLength = leg.node().getTotalLength();
                            legTime = legLength/(boxLength/tLength);
                            
                            if(leg.attr("stroke-dashoffset")!=0){
                                leg.interrupt().attr("stroke-width", "2")
                                .attr("stroke-dasharray", legLength + " " + legLength)
                                .attr("stroke-dashoffset", legLength)
                                .transition(t2)
                                    .duration(legTime)
                                    .attr("stroke-dashoffset", 0);
                            }

                            path.attr("stroke-width", "2")
                                .attr('stroke', '#49306B')
                                .attr("stroke-dasharray", pathLength + " " + pathLength)
                                .attr("stroke-dashoffset", pathLength)
                                .transition(t2)
                                    .attr("stroke-dashoffset", 0);
                        }

                        var myT = (!eraseOnly) ? t : tran;
                        var myT2 = (!eraseOnly) ? t2: tran2;

                        if(eBox.node()!=null && ePath.node()!=null && eLeg.node()!=null){
                           var eBoxLength = eBox.node().getTotalLength(),
                               eLegLength = eLeg.node().getTotalLength(),
                               ePathLength = ePath.node().getTotalLength();


                            ePath.transition(myT)
                                .attr("stroke-dashoffset", ePathLength)

                            eBox.transition(myT2)
                                .attr("stroke-dashoffset", eBoxLength);

                            eLeg.transition(myT2)
                                .attr("stroke-dashoffset", eLegLength);

                        }
                        if(!eraseOnly) {expClick(e, true, myT, myT2);}

                    }

                    var projMouseOut = function(e){
                        if($(this).hasClass('active') || e.target.nodeName=='path'){
                            return;
                        }

                        var eBox = d3.select(this)
                            .select(".project-click-active");
                        var eLeg = d3.select(this)
                            .select('.project-click-active-leg');

                        var that = this;

                        if(eBox.node()!=null && eLeg.node()!=null){
                            var eBoxLength = eBox.node().getTotalLength(),
                                eLegLength = eLeg.node().getTotalLength();

                            var legTime = legLength/(eBoxLength/tLength);

                            var t = d3.transition()
                                .duration(legTime)
                                .ease(d3.easeLinear)


                            var t2 = t.transition()
                                .duration(tLength)
                                .ease(d3.easeLinear)
                                .on("end", function(){
                                    $(that).removeClass('hover');
                                    selectSkills();
                                });

                            eLeg.transition(t)
                                .attr("stroke-dashoffset", eLegLength);

                            eBox.transition(t2)
                                .attr("stroke-dashoffset", eBoxLength);
                        }

                    }

                    var projMouseOver = function(e){
                        if($(this).hasClass('active') || e.target.nodeName=='path'){
                            return;
                        }

                        $(this).addClass('hover');

                        var box = d3.select(this)
                            .select(".project-click-active");
                        var leg = d3.select(this)
                            .select(".project-click-active-leg");

                        var boxLength = box.node().getTotalLength(),
                            legLength = leg.node().getTotalLength();

                        var t = d3.transition()
                            .duration(tLength)
                            .ease(d3.easeLinear);

                        var legTime = legLength/(boxLength/tLength);

                        var t2 = t.transition()
                            .duration(legTime)
                            .on('end', selectSkills);

                        box.interrupt().attr("stroke-width", "2")
                            .attr("stroke-dasharray", boxLength + " " + boxLength)
                            .attr("stroke-dashoffset", boxLength)
                            .transition(t)
                                .attr("stroke-dashoffset", 0);

                        leg.interrupt().attr("stroke-width", "2")
                            .attr("stroke-dasharray", legLength + " " + legLength)
                            .attr("stroke-dashoffset", legLength)
                            .transition(t2)
                                .attr("stroke-dashoffset", 0);
                    }


                    $('.project-row').on('mouseout', projMouseOut);
                    $('.project-row').on('mouseover', projMouseOver);
                    $('.project-row').on('click', projClick);
          
            }