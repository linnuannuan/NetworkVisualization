var scene = new THREE.Scene();

var width = $(window).width()-800;
// var width = 1920;
// console.log("width :",width);
var height = $(window).height() - 56;
// var height = 1024;

console.log("windowHeight: " + height);
var ratio = width / height;

var camera = new THREE.PerspectiveCamera(90, ratio, 0.1, 0.9);

// camera.position.z = 0.5;
camera.position.z =0.9;
var renderer = new THREE.WebGLRenderer({
    canvas: $('canvas')[0],
    antialias: true
});
renderer.setSize(width, height);


renderer.setClearColor(0xffffff);
// scene.background = new THREE.TextureLoader().load('background.jpg', function() {
// scene.background = new THREE.TextureLoader().load(0xffffff, function() {
//     renderer.render(scene, camera);
// });




var state = 'network';
var records = [];
function activateTransactionNetwork() {
    var bound = 0;
    var vertices = new Set();
    for (var i = 0; i < scene.children.length; i++) {
        if (!scene.children[i].userData.category) {
            bound = i;
            break;
        }
        if (scene.children[i].userData.category !== 'transaction') {
            records.push({
                object: scene.children[i],
                opacity: scene.children[i].material.opacity
            });
            scene.children[i].material.opacity = 0.1;
        } else {
            vertices.add(scene.children[i].userData.sourceID);
            vertices.add(scene.children[i].userData.targetID);
        }
    }
    for (var i = scene.children.length - 1; i > bound; i -= 2) {
        if (!vertices.has(scene.children[i].userData.id)) {
            records.push({
                object: scene.children[i],
                opacity: scene.children[i].material.opacity
            });
            scene.children[i].material.opacity = 0.1;
            records.push({
                object: scene.children[i - 1],
                opacity: scene.children[i - 1].material.opacity
            });
            scene.children[i - 1].material.opacity = 0.1;
        }
    }
    renderer.render(scene, camera);
}
function activateControlNetwork() {
    var bound = 0;
    var vertices = new Set();
    for (var i = 0; i < scene.children.length; i++) {
        if (!scene.children[i].userData.category) {
            bound = i;
            break;
        }
        if (scene.children[i].userData.category !== 'control') {
            records.push({
                object: scene.children[i],
                opacity: scene.children[i].material.opacity
            });
            scene.children[i].material.opacity = 0.1;
        } else {
            vertices.add(scene.children[i].userData.sourceID);
            vertices.add(scene.children[i].userData.targetID);
        }
    }
    for (var i = scene.children.length - 1; i > bound; i -= 2) {
        if (!vertices.has(scene.children[i].userData.id)) {
            records.push({
                object: scene.children[i],
                opacity: scene.children[i].material.opacity
            });
            scene.children[i].material.opacity = 0.1;
            records.push({
                object: scene.children[i - 1],
                opacity: scene.children[i - 1].material.opacity
            });
            scene.children[i - 1].material.opacity = 0.1;
        }
    }
    renderer.render(scene, camera);
}
function activateInvestmentNetwork() {
    var bound = 0;
    var vertices = new Set();
    for (var i = 0; i < scene.children.length; i++) {
        if (!scene.children[i].userData.category) {
            bound = i;
            break;
        }
        if (scene.children[i].userData.category !== 'investment') {
            records.push({
                object: scene.children[i],
                opacity: scene.children[i].material.opacity
            });
            scene.children[i].material.opacity = 0.1;
        } else {
            vertices.add(scene.children[i].userData.sourceID);
            vertices.add(scene.children[i].userData.targetID);
        }
    }
    for (var i = scene.children.length - 1; i > bound; i -= 2) {
        if (!vertices.has(scene.children[i].userData.id)) {
            records.push({
                object: scene.children[i],
                opacity: scene.children[i].material.opacity
            });
            scene.children[i].material.opacity = 0.1;
            records.push({
                object: scene.children[i - 1],
                opacity: scene.children[i - 1].material.opacity
            });
            scene.children[i - 1].material.opacity = 0.1;
        }
    }
    renderer.render(scene, camera);
}
var colors = {};
function activateGroup() {
    scene.children.forEach(function(object) {
        if (!object.userData.category) {
            return;
        }
        if (!colors[object.userData.groupID]) {
            colors[object.userData.groupID] = {
                r: Math.random(),
                g: Math.random(),
                b: Math.random()
            };
        }
        records.push({
            object: object,
            color: object.material.color.getHex()
        });
        object.material.color.setRGB(
            colors[object.userData.groupID].r,
            colors[object.userData.groupID].g,
            colors[object.userData.groupID].b
        );
    });
    renderer.render(scene, camera);
}

var group;
function activateSingleAffiliatedGroup(vertex) {
    var bound = 0;
    var edges = [];

    //获取当前视图的所有边
    for (var i = 0; i < scene.children.length; i++) {
        if (!scene.children[i].userData.category) {
            bound = i;
            break;
        }
        // if (scene.children[i].userData.groupID === group) {
        //     edges.push(scene.children[i]);
        // }
        edges.push(scene.children[i]);
    }

    //获取当前视图的所有节点
    var vertices = [];
    for (var i = scene.children.length - 1; i > bound; i -= 2) {
        // if (scene.children[i].userData.groupID === group) {
            vertices.push(scene.children[i], scene.children[i - 1]);
        // }
    }

    edges.forEach(function(object) {
        // if (!patternVertices.has(object.userData.sourceID) || !patternVertices.has(object.userData.targetID)) {
        //!(object.userData.isAffiliated == num[0]&&object.userData.affiliated_id == num [1])
        if (num == 3){
            if (!(object.userData.three_affiliated_id == vertex)){
                records.push({
                level: 2,
                object: object,
                opacity: object.material.opacity
                });
                object.material.opacity = 0.1;
            }
        }
        else if (!(object.userData.three_affiliated_id == vertex)) {
            records.push({
                level: 2,
                object: object,
                opacity: object.material.opacity
            });
            object.material.opacity = 0.1;
        }
    });

    for (var i = 0; i < vertices.length; i+=2) {
        // if (!patternVertices.has(vertices[i].userData.id)) {
        // && vertices[i].userData.affiliated_id == num[1]
            if (!(vertices[i].userData.three_affiliated_id == vertex)){
                records.push({
                level: 2,
                object: vertices[i],
                opacity: vertices[i].material.opacity
                });
                vertices[i].material.opacity = 0.1;
                records.push({
                level: 2,
                object: vertices[i + 1],
                opacity: vertices[i + 1].material.opacity
                });
                vertices[i + 1].material.opacity = 0.1;
            }
    }
    renderer.render(scene, camera);

}
function activateSingleGroup() {
    var bound = 0;
    for (var i = 0; i < scene.children.length; i++) {
        if (!scene.children[i].userData.category) {
            bound = i;
            break;
        }
        if (scene.children[i].userData.groupID !== group) {
            records.push({
                level: 1,
                object: scene.children[i],
                opacity: scene.children[i].material.opacity
            });
            scene.children[i].material.opacity = 0.1;
        }
    }
    for (var i = scene.children.length - 1; i > bound; i -= 2) {
        if (scene.children[i].userData.groupID !== group) {
            records.push({
                level: 1,
                object: scene.children[i],
                opacity: scene.children[i].material.opacity
            });
            scene.children[i].material.opacity = 0.1;
            records.push({
                level: 1,
                object: scene.children[i - 1],
                opacity: scene.children[i - 1].material.opacity
            });
            scene.children[i - 1].material.opacity = 0.1;
        }
        else{
            console.log("groupid: "+ scene.children[i].userData.groupID)
            console.log("userdata: ",scene.children[i].userData)

        }
    }
    renderer.render(scene, camera);
}

function
activateAffiliatedTransaction( num ) {

    //隐藏pattern
    showPattern(0)
    //num 表示当前需要渲染的是4还是5
    console.log('show num ',num)
    var bound = 0;
    console.log("bound:"+bound);
    var edges = [];

    //获取当前视图的所有边
    for (var i = 0; i < scene.children.length; i++) {
        if (!scene.children[i].userData.category) {
            bound = i;
            break;
        }
        // if (scene.children[i].userData.groupID === group) {
        //     edges.push(scene.children[i]);
        // }
        edges.push(scene.children[i]);
    }
    console.log("bound:"+bound);
    //获取当前视图的所有节点
    var vertices = [];
    for (var i = scene.children.length - 1; i > bound; i -= 2) {
        // if (scene.children[i].userData.groupID === group) {
            vertices.push(scene.children[i], scene.children[i - 1]);
        // }
    }
    $('#information').hide();
    $('#list').html("");
    $('<h4>&nbsp;&nbsp;<i class="iconfont-title">&#xe62c;</i>Suspicious Group List</h4>').appendTo('#list');
    switch (num) {
        case 3:
             $.getJSON('../three_affiliated', {
             }, function(data) {
                 // data = [[id,person_name],[],[]]
                 data.forEach(
                     function(group, index, arr){
                         console.log(group)
                          $('<div style="text-align: left;cursor: pointer; margin-top: 20px; margin-left: 10px" ' + 'id=3'+ (index+1) + ' onclick= "showSingleAffiliatedTransaction(3,'+group[0]+','+group[0]+')"><b>[ '+group[1]+' ] et. al.</b>  Group</div>').appendTo('#list')
                          $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id='+ group[0] + ' onclick= "showSingleAffiliatedTransaction(3,'+group[0]+','+group[0]+')"><i class="iconfont">&#xe663;  </i>&nbsp;'+group[1]+'</div>').appendTo('#3'+(index+1))
                          $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id='+ group[0] + ' onclick= "showSingleAffiliatedTransaction(3,'+group[0]+','+group[2]+')"><i class="iconfont">&#xe62e;  </i>&nbsp;'+group[3]+'</div>').appendTo('#3'+(index+1))
                          $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id='+ group[0] + ' onclick= "showSingleAffiliatedTransaction(3,'+group[0]+','+group[4]+')"><i class="iconfont">&#xe62e;  </i>&nbsp;'+group[5]+'</div>').appendTo('#3'+(index+1))
                     }
                 )
                 $('<div id="changePage" style="margin-top: 20px; font-size: 16px;font-weight: bold"></div>').appendTo('#list');
                 $('<span style="margin:0px 20px 0px 20px"><a class="pointer">First</a> &nbsp;&nbsp;&nbsp;<a class="pointer">Prev</a></span>').appendTo('#changePage');
                 $('<span style="margin:0px 30px 0px 30px"><a class="pointer">1</a>&nbsp;&nbsp;&nbsp;&nbsp; <a class="pointer">2</a> &nbsp;&nbsp;&nbsp;&nbsp; <a class="pointer">3</a> &nbsp;&nbsp;&nbsp;&nbsp; <a class="pointer">4</a> &nbsp;&nbsp;&nbsp;&nbsp;<a class="pointer">5</a>&nbsp;&nbsp;&nbsp;&nbsp; <a class="pointer">6</a></span>').appendTo('#changePage');
                 $('<span style="margin:0px 20px 0px 20px"><a class="pointer">Next</a>&nbsp;&nbsp;&nbsp; <a class="pointer">Last</a></span>').appendTo('#changePage');

             });
            break;
        case 4:
            var group_41 =[82491,"Guo Zhi An",110703,"Chen Ping",10396,"Shan Xi Hua Yue Qi Che Pei Jian Wei Xiu You Xian Gong Si",33524,"Xi An Hou Ren Shang Mao You Xian Gong Si"]
            var group_42 =[55172,"Shao Mao Qing",65810,"Wang Yan Shan",24177,"Shan Xi Zhi Bo Ji Dian She Bei You Xian Gong Si",9526,"Shan Xi Hui Shang Bai Tong Gong Mao You Xian Gong Si"]

            $('<div style="text-align: left;cursor: pointer; margin-top: 20px;margin-left: 10px" ' + 'id=41 ' + 'onclick= "showSingleAffiliatedTransaction(4,1,1)"><b> [ Guo Zhi An & Chen Ping ] et. al.</b> Group</div>').appendTo('#list');
            $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id=4'+ group_41[0] + ' onclick= "showSingleAffiliatedTransaction(4,1,'+group_41[0]+')"><i class="iconfont">&#xe663;</i>&nbsp;'+group_41[1]+'</div>').appendTo('#41');
            $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id=4'+ group_41[0] + ' onclick= "showSingleAffiliatedTransaction(4,1'+group_41[2]+')"><i class="iconfont">&#xe663;</i>&nbsp;'+group_41[3]+'</div>').appendTo('#41')
            $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id=4'+ group_41[0] + ' onclick= "showSingleAffiliatedTransaction(4,1'+group_41[4]+')"><i class="iconfont">&#xe62e;</i> '+group_41[5]+'</div>').appendTo('#41')
            $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id=4'+ group_41[0] + ' onclick= "showSingleAffiliatedTransaction(4,1'+group_41[6]+')"><i class="iconfont">&#xe62e;</i> '+group_41[7]+'</div>').appendTo('#41')


            $('<div style="text-align: left;cursor: pointer; margin-top: 20px;margin-left: 10px" ' + 'id=42 ' + 'onclick= "showSingleAffiliatedTransaction(4,2)"><b> [ Shao Mao Qing & Wang Yan Shan ] et. al.</b> Group</div>').appendTo('#list');
            $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id='+ group_42[0] + ' onclick= "showSingleAffiliatedTransaction(4,2,'+group_42[0]+')"><i class="iconfont">&#xe663;</i>&nbsp;'+group_42[1]+'</div>').appendTo('#42')
            $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id='+ group_42[0] + ' onclick= "showSingleAffiliatedTransaction(4,2,'+group_42[2]+')"><i class="iconfont">&#xe663;</i> '+group_42[3]+'</div>').appendTo('#42')
            $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id='+ group_42[0] + ' onclick= "showSingleAffiliatedTransaction(4,2,'+group_42[4]+')"><i class="iconfont">&#xe62e;</i> '+group_42[5]+'</div>').appendTo('#42')
            $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id='+ group_42[0] + ' onclick= "showSingleAffiliatedTransaction(4,2,'+group_42[6]+')"><i class="iconfont">&#xe62e;</i> '+group_42[7]+'</div>').appendTo('#42')

            break;
        case 5:
            var group_51 =[50993,"Zou Yong",60241,"Bai Rui Feng",18111,"Xi An Tian Bo Dian Zi You Xian Gong Si",9526,"Shan Xi Hui Shang Bai Tong Gong Mao You Xian Gong Si",3384,"Xi An Tian Bo Dian Zi You Xian Gong Si",29708,"Shan Xi San Tai Ke Ji Shi Ye You Xian Gong Si"]
            $('<div style="text-align: left;cursor: pointer; margin-top: 20px;margin-left: 10px" ' + 'id=51 ' + 'onclick= "showSingleAffiliatedTransaction(5,1)"><b> [ Zou Yong & Bai Rui Feng ] et. al.</b> Group</div>').appendTo('#list');
            $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id='+ group_51[0] + ' onclick= "showSingleAffiliatedTransaction(5,1,'+group_51[0]+')"><i class="iconfont">&#xe663;</i> '+group_51[1]+'</div>').appendTo('#51')
            $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id='+ group_51[0] + ' onclick= "showSingleAffiliatedTransaction(5,1,'+group_51[2]+')"><i class="iconfont">&#xe663;</i> '+group_51[3]+'</div>').appendTo('#51')
            $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id='+ group_51[0] + ' onclick= "showSingleAffiliatedTransaction(5,1,'+group_51[4]+')"><i class="iconfont">&#xe62e;</i> '+group_51[5]+'</div>').appendTo('#51')
            $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id='+ group_51[0] + ' onclick= "showSingleAffiliatedTransaction(5,1,'+group_51[6]+')"><i class="iconfont">&#xe62e;</i> '+group_51[7]+'</div>').appendTo('#51')
            $('<div style="text-align: left;cursor: pointer; margin-top: 5px; margin-left: 20px" ' + 'id='+ group_51[0] + ' onclick= "showSingleAffiliatedTransaction(5,1,'+group_51[8]+')"><i class="iconfont">&#xe62e;</i> '+group_51[9]+'</div>').appendTo('#51')

            break;
    }
    $("#list").show();

    edges.forEach(function(object) {
        if (num == 3){
            if (!(object.userData.is_three_affiliated == num)){
                records.push({
                level: 2,
                object: object,
                opacity: object.material.opacity
                });
                object.material.opacity = 0.1;
                // object.material.opacity = 0.0;

            }
        }
        else if (!(object.userData.isAffiliated == num)) {
            records.push({
                level: 2,
                object: object,
                opacity: object.material.opacity
            });
            object.material.opacity = 0.1;
            // object.material.opacity = 0.0;

        }
    });

    for (var i = 0; i < vertices.length; i+=2) {
        if (num == 3){
            if (!(vertices[i].userData.is_three_affiliated == num)){
                records.push({
                level: 2,
                object: vertices[i],
                opacity: vertices[i].material.opacity
                });
                vertices[i].material.opacity = 0.1;
                // vertices[i].material.opacity = 0.0;
                records.push({
                level: 2,
                object: vertices[i + 1],
                opacity: vertices[i + 1].material.opacity
                });
                vertices[i + 1].material.opacity = 0.1;
                // vertices[i+1].material.opacity = 0.0;

            }
        }
        else if (!(vertices[i].userData.isAffiliated == num)) {
            records.push({
                level: 2,
                object: vertices[i],
                opacity: vertices[i].material.opacity
            });
            vertices[i].material.opacity = 0.1;
            // vertices[i].material.opacity = 0.0;

            records.push({
                level: 2,
                object: vertices[i + 1],
                opacity: vertices[i + 1].material.opacity
            });
            vertices[i + 1].material.opacity = 0.1;
            // vertices[i+1].material.opacity = 0.0;

        }
    }
    renderer.render(scene, camera);
}
function removeAllClass(id ,type){
    //type表示需要被清理的div模块
    if(type == "label"){
        console.log(!$("#p1").hasClass("hidden"))
        if(!$("#p1").hasClass("hidden"))$("#p1").addClass("hidden");
        $("#p2").addClass("hidden");
        $("#c1").addClass("hidden");
        $("#c2").addClass("hidden");
        $("#c3").addClass("hidden");
        $("#p1").removeClass("label-p1-3").removeClass("label-p1-4").removeClass("label-p1-5");
        $("#p2").removeClass("label-p2-4").removeClass("label-p2-5");
        $("#c1").removeClass("label-c1-3").removeClass("label-c1-4").removeClass("label-c1-5");
        $("#c2").removeClass("label-c2-3").removeClass("label-c2-4").removeClass("label-c2-5");
        $("#c3").removeClass("label-c3-5");
    }
    if(type == "detail"){
        $("#detail-3").addClass("hidden");
        $("#explanation-3").addClass("hidden");
        $("#detail-4").addClass("hidden");
        $("#explanation-4").addClass("hidden");
        $("#detail-5").addClass("hidden");
        $("#explanation-5").addClass("hidden");
    }
}
function activeClass(id ,type){
    //type表示需要被清理的div模块
    if(type == "label"){
        if(id==3){
            // while($("#p1").hasClass("hidden")) {
                // console.log("active class",$("#p1").hasClass("hidden"))
                // console.log("remove hidden")
                $("#p1").removeClass("hidden");
            // }
            // console.log("active class",$("#p1").hasClass("hidden"))

            $("#c1"). removeClass("hidden");
            $("#c2"). removeClass("hidden");
            $("#p1"). addClass("label-p1-3");
            $("#c1"). addClass("label-c1-3");
            $("#c2"). addClass("label-c2-3");
        }
        if(id==4){
            $("#p1"). removeClass("hidden");
            $("#p2"). removeClass("hidden");
            $("#c1"). removeClass("hidden");
            $("#c2"). removeClass("hidden");

            $("#p1"). addClass("label-p1-4");
            $("#p2"). addClass("label-p2-4");
            $("#c1"). addClass("label-c1-4");
            $("#c2"). addClass("label-c2-4");
        }
        if(id==5){
            $("#p1"). removeClass("hidden");
            $("#p2"). removeClass("hidden");
            $("#c1"). removeClass("hidden");
            $("#c2"). removeClass("hidden");
            $("#c3"). removeClass("hidden");

            $("#p1"). addClass("label-p1-5");
            $("#p2"). addClass("label-p2-5");
            $("#c1"). addClass("label-c1-5");
            $("#c2"). addClass("label-c2-5");
            $("#c3"). addClass("label-c3-5");
        }
    }
    if(type == "detail"){
        if(id == 3) {
            $("#detail-3").removeClass("hidden");
            $("#explanation-3").removeClass("hidden");
        }
        if(id == 4) {
            $("#detail-4").removeClass("hidden");
            $("#explanation-4").removeClass("hidden");
        }
        if(id == 5) {
            $("#detail-5").removeClass("hidden");
            $("#explanation-5").removeClass("hidden");
        }
    }
}
function showSingleAffiliatedTransaction( num, id ) {
    console.log('show AffiliatedTransaction',num, id);

    var pattern_block = document.getElementById('detail');

    if (num == 3 && id == 70472){

        //由许坚构成的三角嫌疑群组
        img_url = 'pattern-3.png';
    }
    if (num == 4 && id == 1){
        //由许坚构成的三角嫌疑群组
        img_url = 'pattern-41.png';
    }
    if (num == 4 && id == 2){
        img_url = 'pattern-42.png';
    }
    if (num == 5 && id == 1){
        //由许坚构成的三角嫌疑群组
        img_url = 'pattern-5.png';
    }

    // detail
    removeAllClass(num,"detail");
    removeAllClass(num,"label");
    activeClass(num,"detail");
    activeClass(num,"label");

    person_vertex = ''
    enterprise_vertex = ''

    if(num == 3 && id == 70472){
        person_vertex = id;
        enterprise_vertex = 28422;
    }
    if (num == 4){
        switch (id) {
        case 1:     person_vertex = 10396;
                    enterprise_vertex = 10396;
                    break;
        case 2:     person_vertex = 24177;
                    enterprise_vertex = 24873;
                    break;
        }
    }
    if (num == 5){
        switch (id) {
        case 1:     person_vertex = 18111;
                    enterprise_vertex = 18111;
                    break;
        }
    }
    // if (activatedObject) {
    //     deactivateObject()
    // }
    $.getJSON('../search_vertex', {
        vertex_id:  person_vertex
    }, function(result) {
                camera.position.x = result[0][0];
                                // camera.position.x = result[0][1];

                camera.position.y = result[0][1];
                                // camera.position.y = result[0][2];

                // $('#information').
                // $('#information').addClass("detail-block-position-3");


                updateSence(function () {
                    $('#x').text(camera.position.x.toFixed(2));
                    $('#y').text(camera.position.y.toFixed(2));
                    console.log("result",result)
                            var bound = 0;
                            var edges = [];

                            //获取当前视图的所有边
                            for (var i = 0; i < scene.children.length; i++) {
                                if (!scene.children[i].userData.category) {
                                    bound = i;
                                    break;
                                }
                                edges.push(scene.children[i]);
                            }

                            //获取当前视图的所有节点
                            var vertices = [];
                            for (var i = scene.children.length - 1; i > bound; i -= 2) {
                                    vertices.push(scene.children[i], scene.children[i - 1]);
                            }
                            edges.forEach(function(object) {
                                if(num == 3){
                                     if (!(object.userData.three_affiliated_id == result[0][2])){
                                        records.push({
                                        level: 2,
                                        object: object,
                                        opacity: object.material.opacity
                                        });
                                        object.material.opacity = 0.1;
                                        // object.material.opacity = 0.0;
                                        // console.log("project",object.project)
                                    }
                                }

                            });
                            for (var i = 0; i < vertices.length; i+=2) {
                                    if (num==3&&!(vertices[i].userData.three_affiliated_id == result[0][2])){
                                        records.push({
                                        level: 2,
                                        object: vertices[i],
                                        opacity: vertices[i].material.opacity
                                        });
                                        vertices[i].material.opacity = 0.1;
                                        // vertices[i].material.opacity = 0.0;

                                        records.push({
                                        level: 2,
                                        object: vertices[i + 1],
                                        opacity: vertices[i + 1].material.opacity
                                        });
                                        vertices[i + 1].material.opacity = 0.1;
                                        // vertices[i+1].material.opacity = 0.0;

                                    }
                            }
                            renderer.render(scene, camera);
                            for (var i = 0; i < scene.children.length; i++) {
                                   if (scene.children[i].userData.id == enterprise_vertex) {
                                        console.log("scene.children[i] == group_id",scene.children[i].userData)
                                        activateObject(scene.children[i]);
                                        break;
                                    }
                            }
                });
            // console.log("vertex",vertices)
            // console.log("result",result)

    });
    renderer.render(scene, camera);

}

function showPattern(tag) {
    //tag = 0 / 1 , 表示当前需要 show / hidden
    if(tag) {
        $("#affiliated-pattern").removeClass('hidden');
        $("#cancel-show-pattern").removeClass('hidden');
    }
    else  {
        // $("#affiliated-pattern").addClass('hidden');
        // $("#cancel-show-pattern").addClass('hidden');
    }
}


//获取当前坐标，请求layout对应坐标系下的所有点和边，渲染为画面
function updateSence(callback) {
    $.getJSON('../network', {
        x_lower_bound: -0.9 * ratio + camera.position.x,
        x_upper_bound: 0.9 * ratio + camera.position.x,
        y_lower_bound: -0.9 + camera.position.y,
        y_upper_bound: 0.9 + camera.position.y
    }, function(data) {
        var z = 0;
        var meshes = [];
        console.log(data)
        data.edges.forEach(function(edge) {
            var geometry = new THREE.Geometry();
            //建立7个边为一个箭头
            geometry.vertices.push(
                new THREE.Vector3(edge[3], edge[4], z),
                new THREE.Vector3(edge[5], edge[6], z),
                new THREE.Vector3(edge[7], edge[8], z),
                new THREE.Vector3(edge[9], edge[10], z),
                new THREE.Vector3(edge[11], edge[12], z),
                new THREE.Vector3(edge[13], edge[14], z),
                new THREE.Vector3(edge[15], edge[16], z)
            );
            z += 1e-13;
            geometry.faces.push(
                new THREE.Face3(0, 1, 2),
                new THREE.Face3(2, 3, 0),
                new THREE.Face3(4, 5, 6)
            );
            switch (edge[2]) {
                case 'transaction':
                    var material = new THREE.MeshBasicMaterial({
                        color: 0x0beefc,
                        transparent: true
                    });
                    break;
                case 'control':
                    var material = new THREE.MeshBasicMaterial({
                        color: 0xffcc00,
                        transparent: true
                    });
                    break;
                case 'investment':
                    var material = new THREE.MeshBasicMaterial({
                        color: 0x66cc66,
                        transparent: true
                    });
                    break;
                case 'family':
                    var material = new THREE.MeshBasicMaterial({
                        transparent: true,
                        color: 0xff0000,
                    });
                    break;
            }
            var mesh = new THREE.Mesh(geometry, material);
            mesh.userData.sourceID = edge[0];
            mesh.userData.targetID = edge[1];
            mesh.userData.category = edge[2];
            mesh.userData.groupID = edge[17];
            mesh.userData.isAffiliated = edge[18];
            mesh.userData.affiliated_id = edge[19];
            mesh.userData.is_three_affiliated = edge[20];
            mesh.userData.three_affiliated_id = edge[21];
            meshes.push(mesh);
        });
        data.vertices.forEach(function(vertex) {
            switch (vertex[4]) {
                case 'enterprise':
                    var geometry1 = new THREE.PlaneGeometry(0.02, 0.02);
                    var geometry2 = new THREE.PlaneGeometry(0.018, 0.018);
                    break;
                case 'person':
                    var geometry1 = new THREE.CircleGeometry(0.01, 16);
                    var geometry2 = new THREE.CircleGeometry(0.009, 16);
            }
            var material1 = new THREE.MeshBasicMaterial({
                transparent: true
            });
            var material2 = new THREE.MeshBasicMaterial({
                color: 0x319dff,
                transparent: true
            });
            var mesh1 = new THREE.Mesh(geometry1, material1);
            var mesh2 = new THREE.Mesh(geometry2, material2);
            mesh1.position.x = vertex[1];
            mesh1.position.y = vertex[2];
            mesh1.position.z = z;
            z += 1e-13;
            mesh2.position.x = vertex[1];
            mesh2.position.y = vertex[2];
            mesh2.position.z = z;
            z += 1e-13;
            mesh2.userData.id = vertex[0];
            mesh2.userData.groupID = vertex[3];
            mesh2.userData.category = vertex[4];
            mesh2.userData.isAffiliated= vertex[5];
            mesh2.userData.affiliated_id = vertex[6];
            mesh2.userData.is_three_affiliated = vertex[7];
            mesh2.userData.three_affiliated_id = vertex[8];

            meshes.push(mesh1, mesh2);
        });
        if (state !== 'network') {
            records.splice(0, records.length);
        }
        while (scene.children.length > 0) {
            var object = scene.children[0];
            scene.remove(object);
            object.geometry.dispose();
            object.material.dispose();
        }
        meshes.forEach(function(mesh) {
            scene.add(mesh);
        });
        switch (state) {
            case 'network':
                renderer.render(scene, camera);
                break;
            case 'transaction-network':
                activateTransactionNetwork();
                break;
            case 'control-network':
                activateControlNetwork();
                break;
            case 'investment-network':
                activateInvestmentNetwork();
                break;
            case 'group':
                activateGroup();
                break;
            case 'single-group':
                activateSingleGroup();
                break;
            case 'affiliated-transaction':
                activateSingleGroup();
                activateAffiliatedTransaction();
                break;
            case 'all-affiliated-transaction':
                activateAffiliatedTransaction(3);
                break;
            case 'all-affiliated-transaction-4':
                activateAffiliatedTransaction(4);
                break;
            case 'all-affiliated-transaction-5':
                activateAffiliatedTransaction(5);
                break;
        }
        if (callback) {
            callback();
        }
    });
}
updateSence();

$('canvas').mousewheel(function(event) {
    camera.position.z -= event.deltaY * 0.1;
    if (camera.position.z < 0.1) {
        camera.position.z = 0.1
    }
    if (camera.position.z > 0.9) {
        camera.position.z = 0.9
    }
    renderer.render(scene, camera);
});

var raycaster = new THREE.Raycaster();
var activatedObject;
var color;
var chinese = {
    enterprise: 'enterprise',
    person: 'person',
    transaction: 'transaction relation',
    control: 'control relation',
    investment: 'investment relation'
};
function addOtherOperation(object) {
    // $('<div style="text-align: center; margin-top: 10px;font-weight: bold">OTHER OPERATION</div>').appendTo('#information');
    // if (state === 'network') {
    //     $('<div style="cursor: pointer;">enter community</div>').click(function() {
    //         state = 'single-group';
    //         group = object.userData.groupID;
    //         activateSingleGroup();
    //         $('#search').hide();
    //         $('#structure').hide();
    //         $('#group').hide();
    //         $('#affiliated-transaction').show();
    //         $('#backtrack').show();
    //         $(this).hide();
    //         $('#level').text(1);
    //     }).appendTo('#information');
    // }
    // if (object.userData.category === 'enterprise') {
    //     $('<div>jump to Tian Wang Cha</div>').appendTo('#information');
    // }
}
function activateObject(object) {
    console.log('activeObject',object);
    if (object === activatedObject) {
        return;
    }
    if (activatedObject) {
        activatedObject.material.color.set(color);
    }
    activatedObject = object;
    color = object.material.color.getHex();
    object.material.color.set(0xff0000);
    renderer.render(scene, camera);
    var html = '<div style="text-align: center;font-weight: bold;color: #fff;margin:5px 0px 10px 0px ">DETAIL INFORMATION</div>';
    html += '<div><span class="attribute">type</span>：' + chinese[object.userData.category] + '</div>';
    html += '<div><span class="attribute">community ID</span>：' + object.userData.groupID + '</div>';
    switch (object.userData.category) {
        case 'enterprise':
            html += '<div><span class="attribute">company num</span>：' + object.userData.id + '</div>';
            $.getJSON('../enterprise_detail', {
                vertex_id: object.userData.id
            }, function(data) {
                html += '<div><span class="attribute">ID</span>：' + data[0] + '</div>';
                html += '<div><span class="attribute">record num</span>：' + data[1] + '</div>';
                html += '<div><span class="attribute">name</span>: ' + data[2] + '</div>';
                //转换部分行业的英文
                html += '<div><span class="attribute">industry：</span>' + data[3] + '</div>';
                $.getJSON('../search_vertex', {
                    vertex_id:  object.userData.id
                }, function(result) {
                    // camera.position.x = result[0][0];
                    // camera.position.y = result[0][1];
                    console.log("click vertex_id",object.userData.id,"position",result[0][0],result[0][1])
                });
                $('#information').html(html);
                addOtherOperation(object);
                $('#information').show();
                //添加联动操作 data[1]表示电子档案号，获取电子档案号改变其他iframe的url
                console.log(data[1]);
                changeDataSource(data[1]);
            });
            break;
        case 'person':
            html += '<div><span class="attribute">number</span>：' + object.userData.id + '</div>';
            $.getJSON('../person_detail', {
                vertex_id: object.userData.id
            }, function(data) {
                html += '<div><span class="attribute">ID</span>：' + data[0] + '</div>';
                html += '<div><span class="attribute">name</span>：' + data[1] + '</div>';
                $('#information').html(html);
                addOtherOperation(object);
                $('#information').show();
                document.getElementById('xyltp').src = 'http://localhost:8080/tianwangcha/demo/xyltp/' + data[1];
                document.getElementById('xycd').src = 'http://localhost:8080/tianwangcha/demo/xycd/'+data[1];
                document.getElementById('zbfx').src = 'http://localhost:8080/tianwangcha/yzk/nsr/demo/zbfx?nsrdzdah='+data[1];
                document.getElementById('qytp').src = 'http://localhost:8080/tianwangcha/demo/qytp/'+data[1];
                $("#xyltp").show();
                $("#xycd").show();
                $("#zbfx").show();
                console.log("person -> xyltp"+document.getElementById('xyltp').src);
            });
            break;
        case 'transaction':
            html += '<div>start num：' + object.userData.sourceID + '</div>';
            html += '<div>end num：' + object.userData.targetID + '</div>';
            $.getJSON('../transaction_detail', {
                source_id: object.userData.sourceID,
                target_id: object.userData.targetID
            }, function(data) {
                html += '<div>money：' + data[0] + '</div>';
                html += '<div>amount：' + data[1] + '</div>';
                $('#information').html(html);
                addOtherOperation(object);
                $('#information').show();
                document.getElementById('xyltp').src = 'http://localhost:8080/tianwangcha/demo/xyltp/' + data[1];
                document.getElementById('xycd').src = 'http://localhost:8080/tianwangcha/demo/xycd/'+data[1];
                document.getElementById('zbfx').src = 'http://localhost:8080/tianwangcha/yzk/nsr/demo/zbfx?nsrdzdah='+data[1];
                document.getElementById('qytp').src = 'http://localhost:8080/tianwangcha/demo/qytp/'+data[1];
                console.log("transaction -> xyltp"+document.getElementById('xyltp').src);
            });
            break;
        case 'control':
            html += '<div>source vertex:' + object.userData.sourceID + '</div>';
            html += '<div>target veretx:' + object.userData.targetID + '</div>';
            $('#information').html(html);
            addOtherOperation(object);
            $('#information').show();
            document.getElementById('xyltp').src = 'http://localhost:8080/tianwangcha/demo/xyltp/' + data[1];
            document.getElementById('xycd').src = 'http://localhost:8080/tianwangcha/demo/xycd/'+data[1];
            document.getElementById('zbfx').src = 'http://localhost:8080/tianwangcha/yzk/nsr/demo/zbfx?nsrdzdah='+data[1];
            document.getElementById('qytp').src = 'http://localhost:8080/tianwangcha/demo/qytp/'+data[1];
            console.log("control -> xyltp:"+document.getElementById('xyltp').src);
            break;
        case 'investment':
            html += '<div>source vertex：' + object.userData.sourceID + '</div>';
            html += '<div>target vertex：' + object.userData.targetID + '</div>';
            $.getJSON('../investment_detail', {
                source_id: object.userData.sourceID,
                target_id: object.userData.targetID
            }, function(data) {
                html += '<div>ratio：' + data + '</div>';
                $('#information').html(html);
                addOtherOperation(object);
                $('#information').show();
                document.getElementById('xyltp').src = 'http://localhost:8080/tianwangcha/demo/xyltp/' + data[1];
                document.getElementById('xycd').src = 'http://localhost:8080/tianwangcha/demo/xycd/'+data[1];
                document.getElementById('zbfx').src = 'http://localhost:8080/tianwangcha/yzk/nsr/demo/zbfx?nsrdzdah='+data[1];
                document.getElementById('qytp').src = 'http://localhost:8080/tianwangcha/demo/qytp/'+data[1];
                console.log("investment -> xyltp:"+document.getElementById('xyltp').src);
            });
    }
}
var down;
function deactivateObject() {
    activatedObject.material.color.set(color);
    activatedObject = null;
    color = null;
    renderer.render(scene, camera);
}
$('canvas').mousedown(function(event) {
    raycaster.setFromCamera({
        x: event.pageX / width * 2 - 1,
        y: - (event.pageY - 56) / height * 2 + 1
    }, camera);
    var intersections = raycaster.intersectObjects(scene.children);
    if (intersections.length > 0 && intersections[0].object.userData.category) {
        activateObject(intersections[0].object);
    } else {
        down = true;
        if (activatedObject) {
            deactivateObject();
        }
        if ($('#information').is(':visible')) {
            $('#information').hide().empty();
        }
    }
});
$('canvas').mouseup(function() {
    if (down) {
        updateSence();
    }
    down = false;
});
var x;
var y;
$('canvas').mousemove(function(event) {
    if (down) {
        camera.position.x -= (event.pageX - x) / width * ratio * (camera.position.z / 0.5);
        camera.position.y += (event.pageY - y) / height * (camera.position.z / 0.5);
        renderer.render(scene, camera);
        $('#x').text(camera.position.x.toFixed(2));
        $('#y').text(camera.position.y.toFixed(2));
    }
    x = event.pageX;
    y = event.pageY;
});

$('#x').text(camera.position.x.toFixed(2));
$('#y').text(camera.position.y.toFixed(2));

$('button').click(function() {
    if (activatedObject) {
        deactivateObject()
    }
    if ($('#information').is(':visible')) {
        $('#information').hide().empty();
    }
    // vertex_id: $('input').val()
    $.getJSON('../search', {
        enterprise_name: $('input').val()
    }, function(data) {
        if (data.length > 0) {
            $('#list').html("");
            data.forEach(function(result) {
                $('<div style="cursor: pointer;">' + result[0] + '</div>').click(function() {
                    camera.position.x = result[1];
                    camera.position.y = result[2];
                    updateSence(function() {
                        $('#x').text(camera.position.x.toFixed(2));
                        $('#y').text(camera.position.y.toFixed(2));
                        for (var i = 0; i < scene.children.length; i++) {
                            if (scene.children[i].userData.id === result[3]) {
                                activateObject(scene.children[i]);
                                break;
                            }
                        }
                    });
                }).appendTo('#list');
            });
        } else {
            $('#list').text('没有找到相关企业!');
        }
        $('#list').show();
    });
});

$('#backtrack').click(function() {
    switch (state) {
        case 'transaction-network':
        case 'control-network':
        case 'investment-network':
            state = 'network';
            records.forEach(function(record) {
                record.object.material.opacity = record.opacity;
            });
            records.splice(0, records.length);
            $('#backtrack').hide();
            $('#search').show();
            $('#structure').show();
            $('#group').show();
            $('#level').text(0);
            break;
        case 'group':
            state = 'network';
            records.forEach(function(record) {
                record.object.material.color.set(record.color);
            });
            records.splice(0, records.length);
            $('#backtrack').hide();
            $('#search').show();
            $('#structure').show();
            $('#group').show();
            $('#level').text(0);
            break;
        case 'single-group':
            state = 'network';
            group = null;
            records.forEach(function(record) {
                record.object.material.opacity = record.opacity;
            });
            records.splice(0, records.length);
            $('#affiliated-transaction').hide();
            $('#backtrack').hide();
            $('#search').show();
            $('#structure').show();
            $('#group').show();
            $('#level').text(0);
            break;
        case 'affiliated-transaction':
            state = 'single-group';
            var i;
            for (i = records.length - 1; i >= 0; i--) {
                if (records[i].level === 2) {
                    records[i].object.material.opacity = records[i].opacity;
                } else {
                    break;
                }
            }
            records.splice(i + 1, records.length - i - 1);
            $('#affiliated-transaction').show();
            $('#level').text(1);
    }
    renderer.render(scene, camera);
});

$('#transaction-network').click(function() {
    state = 'transaction-network';
    activateTransactionNetwork();
    $('#search').hide();
    $('#structure').hide();
    $('#group').hide();
    $('#backtrack').show();
    $('#level').text(1);
});

$('#control-network').click(function() {
    state = 'control-network';
    activateControlNetwork();
    $('#search').hide();
    $('#structure').hide();
    $('#group').hide();
    $('#backtrack').show();
    $('#level').text(1);
});

$('#investment-network').click(function() {
    state = 'investment-network';
    activateInvestmentNetwork();
    $('#search').hide();
    $('#structure').hide();
    $('#group').hide();
    $('#backtrack').show();
    $('#level').text(1);
});

$('#group').click(function() {
    state = 'group';
    activateGroup();
    $('#search').hide();
    $('#structure').hide();
    $('#group').hide();
    $('#backtrack').show();
    $('#level').text(1);
});

$('#affiliated-transaction').click(function() {
    state = 'affiliated-transaction';
    activateAffiliatedTransaction();
    $('#affiliated-transaction').hide();
    $('#level').text(2);
});

$('#all-affiliated-transaction').click(function() {
    state = 'all-affiliated-transaction';
    activateAffiliatedTransaction();
    // $('#affiliated-transaction').hide();
    removeAllClass(3,"label")
    $('#level').text(2);
});

$('#all-affiliated-transaction-4').click(function() {
    state = 'all-affiliated-transaction-4';
    activateAffiliatedTransaction(4);
    console.log($('#affiliated-transaction-4'));
    // $('#affiliated-transaction-4').hide();
    removeAllClass(4,"label")
    $('#level').text(2);
});

$('#all-affiliated-transaction-5').click(function() {
    state = 'all-affiliated-transaction-5';
    activateAffiliatedTransaction(5);
    // $('#affiliated-transaction-5').hide();
    removeAllClass(5,"label")
    $('#level').text(2);
});

$('#level').text(0);