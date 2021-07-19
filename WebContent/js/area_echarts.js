$(function () {
	
	relationship("全国")
	map("各省人口");
    var pyName= "china"
    
    function map(city) {
        // 基于准备好的dom，初始化echarts实例
    	var myChart = echarts.init(document.getElementById('map_1'));
    	
        $.ajax({
            url: "queryPeopleNum?city="+city, //json文件位置
            type: "GET", //请求方式为get
            async: false,
            dataType: "json", //返回数据格式为json
            success: function(res) { //请求成功完成后要执行的方法 
              
                data = res
                console.log(data)
//                if(data.length==0){
//                	map("各省人口")
//                }

            }
        })

       

        var yMax = 0;
        for (var j = 0; j < data.length; j++) {
            if (yMax < data[j].value) {
                yMax = data[j].value;
            }
        }
      
        option = {

            tooltip: {
                trigger: 'item',
                formatter: data
            },


            visualMap: {
                min: 0,
                max: yMax,
                text: ['高', '低'],
                orient: 'horizontal',
                itemWidth: 15,
                itemHeight: 200,
                right: 500,
                bottom: 30,
                show:true,
                inRange: {
                    color: ['#75ddff', '#0e94eb']
                },
                textStyle: {
                    color: 'white'
                }
            },
            series: [{
                name: '数据名称',
                type: 'map',
                roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启

                mapType: 'china',
                selectedMode: 'single',     //添加点击事件 此处必须设置
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}<br/>{c}'
                },
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        borderColor: '#0e94eb',
                        background: '#f00',
                        label: {
                            show: true
                        }
                    },
                    emphasis: { // 也是选中样式
                        borderWidth: 1,
                        borderColor: '#fff',
                        areaColor: 'rgb(179, 167, 104)',
                        label: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    }
                },
                data: data,
            }]


        };

        $.get('./json/geojson.json', function (chinaJson) {
//            console.log(chinaJson);
            echarts.registerMap('china', chinaJson);
            myChart.setOption(
                option
            );
        }); 
//        myChart.on('click', function (params) {
//        	
////            var city = params.name;
//              // 城市中文名
//            var cityName = params.name;
////            console.log(params.data)
//            
////            console.log(cityName);
//            // 查找是否有对应城市有则加载城市
//            if(typeof(params.data)=="undefined"){
//            	option.series[0].mapType = 'china';
//            	relationship("全国")
////            	map("各省人口")
//            }
//            else{
//            	map(cityName)
//            	if(cityName=="陕西"){
//            		pyName = pinyinUtil.getPinyin(cityName,'')+"1"
//            	}else{
//            		pyName = pinyinUtil.getPinyin(cityName,'')
//            	}
//            	
//            	showCity(cityName,pyName );
//            }
//            
//
//            //没有找到对应城市的话，那么返回到全国地图 
//            
//            
//            myChart.setOption(option);
//            
//            
//            
//        });
//        
        

        if (pName === "china") { // 全国时，添加click 进入省级
          myChart.on('click', function (param) {
            console.log(param.name);
            var cityName = params.name;
            
            if(cityName=="陕西"){
        		pyName = pinyinUtil.getPinyin(cityName,'')+"1"
        	}else{
        		pyName = pinyinUtil.getPinyin(cityName,'')
        	}
            
             showCity(cityName, pyName);
              
//              if (param.componentType === 'series') {
//                  var provinceName =param.name;
//                  $('#box').css('display','block');
//                  $("#box-title").html(provinceName);
//
//              }
          });
        } else { // 省份，添加双击 回退到全国
          myChart.on("dblclick", function () {
            initEcharts("china", "中国");
          });
        }
    }
    function showCity(zhName, pyName) {
//        console.log(zhName, pyName);
    	var myChart = echarts.init(document.getElementById('map_1'));
        $.get('./json/province/'+pyName+'.json', function (chinaJson) {
            //设定中文省份名才能显示相关省份，之后想要设置什么数据，直接设置到option这里就可以了
            
            echarts.registerMap(pyName, chinaJson);
            console.log(chinaJson);
            option.series[0].mapType = pyName;
//            console.log(option.series[0].mapType)
            // 深拷贝，另建option以免丢失原始option数据
            var cityOption = JSON.parse(JSON.stringify(option));
            
            myChart.setOption(cityOption)
            
           
        })
        relationship(zhName)
    }
    

    function relationship(city){
        	var x;
        	$.ajax({
                url: "kMap?city="+city, //json文件位置
                type: "GET", //请求方式为get
                async: false,
                dataType: "json", //返回数据格式为json
                success: function(data) { //请求成功完成后要执行的方法 
                 
                    x = data
//                    console.log(data)

                }
            })
            
        //console.log(x['data']);
        var listdata = [];
        var links = [];



        function setData(arr) {
        	listdata.push({
        		 "name": x["0"][0]['name'],
        		 symbolSize: 50,
        		 
                
        		 
        	})
            for (var i = 0; i < Object.keys(x).length; i++) {
                num = ""+i
            	listdata.push({
                    "name": x[num][2]['name'],
                    symbolSize: 30
                    
                  
                })
            }
        }

        function setLinkData(arr) {
            for (var i = 0; i < Object.keys(x).length; i++) {
            	num = ""+i
                links.push({
                    "source": x[num][0]["name"],
                    "target": ""+x[num][2]["name"],
                    "name": x[num][1]['type'],
                    "des": x[num][1]['type'],
                    lineStyle: {
                        normal: {
                            color: "#3db148",
                            
                        }
                    }
                })
            }
        }



        setData(x);


        setLinkData(x);
//        console.log(links)
                var myChart_guanxi = echarts.init(document.getElementById('echart4'));
              
                option1 = {
                    // 图的标题
                    title: {
                        text: x["0"][0]['name']+'人口 关系图',
                        x:'center',
                        textStyle:{
                            color:'#fff',
                            fontSize: 14,
                        }
                    },
                    // 提示框的配置
                    tooltip: {
                        formatter: function (x) {
//                            console.log(x.data.des);
                            return x.data.des;
                        }
                    },
                    // 工具箱
                    toolbox: {
                        // 显示工具箱
                        show: true,
                        feature: {
                            mark: {
                                show: true
                            },
                            // 还原
                            restore: {
                                show: true
                            },
                            // 保存为图片
                            saveAsImage: {
                                show: true
                            }
                        }
                    },
                  
                    series: [{
                        type: 'graph', // 类型:关系图
                        layout: 'force', //图的布局，类型为力导图
                        roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
                        edgeSymbol: ['circle', 'arrow'],
                        edgeSymbolSize: [2, 10],
                        draggable:true,
                        opacity:0.5,
                        edgeLabel: {
                        	fontSize: 5,
                            normal: {
                                textStyle: {
                                    fontSize: 5
                                }
                            }
                        },
                        force: {
                        	gravity : 0.1,
                            repulsion: 600,
                            friction : 0.6,
                            edgeLength: [20, 20],
                            layoutAnimation : true
                        },
                        draggable: true,
                        lineStyle: {
                            normal: {
                                width: 2,
                                color: '#4b565b',
                                
                            }
                        },
                        edgeLabel: {
                        	
                            normal: {
                                show: true,
                                width:80,
                            	ellipsis:'...',
                            	color:'#fff',
                            	overflow: "truncate",
                                formatter: function (x) {
                                    return x.data.name;
                                }
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                
                                
                            }
                        },

                        // 数据
                        data: listdata,
                        links: links,
                    }]
                };
                myChart_guanxi.setOption(option1);
    }
})
     