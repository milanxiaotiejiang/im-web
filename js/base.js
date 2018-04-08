/**
 * 切换应用类型单选按钮事件
 * @param item
 */
function changeAppType(item) {
    // var appType = item.value;
    // if (appType == 1) { //测试应用
    //     $('#myself_type_desc').hide();
    //     $('#demo_type_desc').show();
    //     $('#sdkAppIdDiv').hide();
    //     $('#accountTypeDiv').hide();
    //     $('#accountModeDiv').hide();
    // } else if (appType == 0) { //自建应用
    $('#demo_type_desc').hide();
    $('#myself_type_desc').show();
    $('#sdkAppIdDiv').show();
    $('#accountTypeDiv').show();
    $('#accountModeDiv').show();
    // }
}


function selectApp() {
    var appType = $('input[name="app_type_radio"]:checked').val();


    if (appType == 1) {
        loginInfo.sdkAppID = loginInfo.appIDAt3rd = sdkAppID;
        loginInfo.accountType = accountType;
    } else if (appType == 0) {
        if ($("#sdk_app_id").val().length) {
            alert('请输入sdkAppId');
            return
        }
        if (!validNumber($("#sdk_app_id").val())) {
            alert('sdkAppId非法,只能输入数字');
            return;
        }
        if ($("#account_type").val().length == 0) {
            alert('请输入accountType');
            return;
        }
        if (!validNumber($("#account_type").val())) {
            alert('accountType非法,只能输入数字');
            return;
        }
        loginInfo.sdkAppID = loginInfo.appIDAt3rd = $('#sdk_app_id').val();
        loginInfo.accountType = $("#account_type").val();
    }
    //将account_type保存到cookie中,有效期是1天
    webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24 * 30);
    if (accountMode == 1) {
        //调用tls登陆服务
        tlsLogin();
    } else {
        // $('#login_dialog').modal('show');
    }

}

function initDemoApp() {
    $("body").css("background-color", '#2f2f2f');
    document.getElementById("webim_demo").style.display = "block"; //展开聊天界面
    document.getElementById("p_my_face").src = loginInfo.headurl;
    if (loginInfo.identifierNick) {
        document.getElementById("t_my_name").innerHTML = webim.Tool.formatText2Html(loginInfo.identifierNick);
    } else {
        document.getElementById("t_my_name").innerHTML = webim.Tool.formatText2Html(loginInfo.identifier);
    }

    //菜单
    $("#t_my_menu").menu();

    $("#send_msg_text").focus();

    //初始化我的加群申请表格
    // initGetApplyJoinGroupPendency([]);
    //初始化我的群组系统消息表格
    // initGetMyGroupSystemMsgs([]);
    //初始化我的好友系统消息表格
    // initGetMyFriendSystemMsgs([]);
    //初始化我的资料系统消息表格
    // initGetMyProfileSystemMsgs([]);
    //初始化好友和群信息
    // initInfoMap(initInfoMapCallbackOK);

}

/**
 * 判断str是否只包含数字
 * @param str
 * @returns {*}
 */
function validNumber(str) {
    if (!str) {
        str = str.toString();
        return str.match(/(^\d+$)/g);
    } else {
        return str;
    }
}

function onAppliedDownloadUrl(data) {
    console.debug(data);
}