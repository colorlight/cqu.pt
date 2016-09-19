// localStorage
(function(){
    var CrossStorageClient = require('cross-storage').CrossStorageClient;
    var cqupt_inner_storage = new CrossStorageClient('https://cqupt.congm.in/common/storage-iframe.html');
    cqupt_inner_storage.onConnect().then(function(){
        return cqupt_inner_storage.get('cqupt_inner');
    }).then(function(res) {
        var cqupt_inner = {};
        if(!res){
            cqupt_inner_storage.set('cqupt_inner', JSON.stringify({}));
        }
        try{
            cqupt_inner = JSON.parse(res);
        }catch(error){
            cqupt_inner_storage.set('cqupt_inner', JSON.stringify({}));
            cqupt_inner = {};
        }
        // 获取用户信息
        var user_xh = 0,
            user_xh_count = 3;
        if(cqupt_inner.xh_list){
            var xh_list = cqupt_inner.xh_list;
            for(var i in xh_list){
                if(xh_list.hasOwnProperty(i)){
                    if(xh_list[i] >= user_xh_count){
                        user_xh = i;
                        user_xh_count = xh_list[i];
                    }
                }
            }
        }
        // 查询用户信息
        if(parseInt(user_xh)){
            var request = new XMLHttpRequest();
            request.open('GET', 'https://blues.congm.in/stu.php?searchKey=' + parseInt(user_xh), true);
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    var data = JSON.parse(request.responseText);
                    if(data.total === 1){
                        window._cqupt_inner_user = data.rows[0];
                        _cqupt_inner_user_show();
                    }
                }
            };
            request.send();
        }
        // 收集用户信息
        if(location.hostname == "jwzx.cqupt.congm.in"){
            collect_user_info({
                form: 'form[action="login.php"]',
                btn: 'input[src="syspic/go.gif"]',
                input: 'input[name="id"]'
            });
        }
        if(location.hostname.indexOf('xk') != -1){
            collect_user_info({
                form: 'form#loginForm',
                btn: 'button#submitButton',
                input: 'input[name="id"]'
            });
        }
        function collect_user_info(options){
            var loginForm = document.querySelector(options.form);
            if(loginForm){
                loginForm.querySelector(options.btn).addEventListener('click', function(){
                    var xh = loginForm.querySelector(options.input).value;
                    if(!xh.trim()){ return; }
                    if(!cqupt_inner.xh_list){ cqupt_inner.xh_list = {}; }
                    if(!cqupt_inner.xh_list[xh]){
                        cqupt_inner.xh_list[xh] = 1;
                    }else{
                        cqupt_inner.xh_list[xh] += 1;
                    }
                    cqupt_inner_storage.set('cqupt_inner', JSON.stringify(cqupt_inner));
                });
            }
        }
    });
})();
(function(){
    /* side-box */
    var title_btn = document.querySelector("#_cqupt-title"),
        discuss_btn = document.querySelector("[data-target='#_cqupt-duosuo']"),
        duosuo = document.querySelector("#_cqupt-duosuo"),
        side = document.querySelector("#_cqupt-side-box");
    var sideTabs = document.querySelectorAll("[data-toggle='sideTab']"),
        sideTabLen = sideTabs.length,
        contentList = document.querySelectorAll("._cqupt-content-item"),
        contentLen = contentList.length;
    side.addEventListener('click', function(e){
        if(!e.target){ return; }
        var eTarget = e.target.getAttribute('data-toggle') == 'sideTab' ? e.target : e.target.parentNode;
        if(eTarget.getAttribute('data-toggle') == 'sideTab'){
            for(var i = 0; i < sideTabLen; i++){
                sideTabs[i].classList.remove('_cqupt-active');
            }
            for(var j = 0; j < contentLen; j++){
                contentList[j].classList.add('_cqupt-hidden');
            }
            var tabTarget = eTarget.getAttribute('data-target');
            if(tabTarget != 'close'){
                eTarget.classList.add('_cqupt-active');
                side.classList.add('_cqupt-active');
                document.querySelector(tabTarget).classList.remove('_cqupt-hidden');
            }else{
                side.classList.remove('_cqupt-active');
            }
        }
    });
    title_btn.onclick = function(){
        document.body.classList.remove('_cqupt-body');
        side.classList.remove('_cqupt-active');
        side.classList.add('_cqupt-close');
    };
    discuss_btn.addEventListener('click', function(){
        var el = document.createElement('div');
        el.setAttribute('data-thread-key', '1');
        el.setAttribute('data-title', '内网外入');
        el.setAttribute('data-url', 'https://cqupt.congm.in');
        DUOSHUO.EmbedThread(el);
        var duosuo_content = duosuo.querySelector("._cqupt-content-bd");
        duosuo_content.replaceChild(el, duosuo_content.lastElementChild);
    });
    // donate.json
    (function(data){
        var html = '<tbody>';
        for(var i = 0; i < data.length; i++){
            html += '<tr>';
            html += '<td>' + data[i].user_id +'</td>';
            html += '<td>' + data[i].user_name +'</td>';
            html += '<td>' + data[i].time +'</td>';
            html += '<td>' + data[i].money +'</td>';
            html += '</tr>';
        }
        html += '</tbody>';
        document.querySelector("._cqupt-donate-list").insertAdjacentHTML("afterbegin", html);
    })(require('../../json/donate'));
})();

function _cqupt_inner_user_show() {
    if(!_cqupt_inner_user.xh){ return; }
    // 个人中心
    document.querySelector("#_cqupt-user-id").innerHTML = '同学！我猜你是 ' + _cqupt_inner_user.xm + '。';
}