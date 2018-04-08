/**
 * 聊天页面增加一条消息
 * @param msg
 * @param prepend
 */
function addMsg(msg, prepend) {
    var isSelfSend, fromAccount, fromAccountNick, fromAccountImage, sessType, subType;

    //获取会话类型，目前只支持群聊
    //webim.SESSION_TYPE.GROUP-群聊，
    //webim.SESSION_TYPE.C2C-私聊，
    sessType = msg.getSession().type();

    isSelfSend = msg.getIsSend();//消息是否为自己发的

    fromAccount = msg.getFromAccount();

    if (!fromAccount) {
        return;
    }

    if (isSelfSend) {//如果是自己发的消息
        if (loginInfo.identifierNick) {
            fromAccountNick = loginInfo.identifierNick;
        } else {
            fromAccountNick = fromAccount;
        }
        //获取头像
        if (loginInfo.headurl) {
            fromAccountImage = loginInfo.headurl;
        } else {
            fromAccountImage = friendHeadUrl;
        }

    } else {

        var key = webim.SESSION_TYPE.C2C + "_" + fromAccount;
        var info = infoMap[key];
        if (info && info.name) {
            fromAccountNick = info.name;
        } else if (msg.getFromAccountNick()) {
            fromAccountNick = msg.getFromAccountNick();
        } else {
            fromAccountNick = fromAccount;
        }
        //获取头像
        if (info && info.image) {
            fromAccountImage = info.image;
        } else if (msg.fromAccountHeadurl) {
            fromAccountImage = msg.fromAccountHeadurl;
        } else {
            fromAccountImage = friendHeadUrl;
        }
    }

    var onemsg = document.createElement("div");
    if (msg.sending) {
        onemsg.id = "id_" + msg.random;
        //发送中
        var spinner = document.createElement("div");
        spinner.className = "spinner";
        spinner.innerHTML = '<div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div>';
        onemsg.appendChild(spinner);
    } else {
        $("#id_" + msg.random).remove();
    }

    onemsg.className = "onemsg";
    var msghead = document.createElement("p");
    var msgbody = document.createElement("p");
    var msgPre = document.createElement("pre");
    msghead.className = "msghead";
    msgbody.className = "msgbody";

    //如果是发给自己的消息
    if (!isSelfSend)
        msghead.style.color = "blue";
    //昵称  消息时间
    msghead.innerHTML = "<img class='headurlClass' src='" + fromAccountImage + "'>" + "&nbsp;&nbsp;" + webim.Tool.formatText2Html(fromAccountNick + "&nbsp;&nbsp;" + webim.Tool.formatTimeStamp(msg.getTime()));

    //解析消息

    //获取消息子类型
    //会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
    //会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
    subType = msg.getSubType();

    switch (subType) {
        case webim.GROUP_MSG_SUB_TYPE.COMMON://群普通消息
            msgPre.innerHTML = convertMsgtoHtml(msg);
            break;
        case webim.GROUP_MSG_SUB_TYPE.REDPACKET://群红包消息
            msgPre.innerHTML = "[群红包消息]" + convertMsgtoHtml(msg);
            break;
        case webim.GROUP_MSG_SUB_TYPE.LOVEMSG://群点赞消息
            //业务自己可以增加逻辑，比如展示点赞动画效果
            msgPre.innerHTML = "[群点赞消息]" + convertMsgtoHtml(msg);
            //展示点赞动画
            //showLoveMsgAnimation();
            break;
        case webim.GROUP_MSG_SUB_TYPE.TIP://群提示消息
            msgPre.innerHTML = "[群提示消息]" + convertMsgtoHtml(msg);
            break;
    }

    msgbody.appendChild(msgPre);

    onemsg.appendChild(msghead);
    onemsg.appendChild(msgbody);
    //消息列表
    var msgflow = document.getElementsByClassName("msgflow")[0];

    if (prepend) {
        //300ms后,等待图片加载完，滚动条自动滚动到底部
        msgflow.insertBefore(onemsg, msgflow.firstChild);
        if (msgflow.scrollTop == 0) {
            setTimeout(function () {
                msgflow.scrollTop = 0;
            }, 300);
        }
    } else {
        msgflow.appendChild(onemsg);
        //300ms后,等待图片加载完，滚动条自动滚动到底部
        setTimeout(function () {
            msgflow.scrollTop = msgflow.scrollHeight;
        }, 300);
    }
}

function convertMsgtoHtml(msg) {

    var html = "", elems, elem, type, content;

    elems = msg.getElems(); //获取消息包含的元素数组
    var count = elems.length;

    for (var i = 0; i < count; i++) {

        elem = elems[i];
        type = elem.getType();//获取元素类型
        content = elem.getContent();//获取元素对象

        //todo
        switch (type) {
            case webim.MSG_ELEMENT_TYPE.TEXT:
                var eleHtml = convertTextMsgToHtml(content);
                //转义，防XSS
                html += webim.Tool.formatText2Html(eleHtml);
                break;
            case webim.MSG_ELEMENT_TYPE.FACE:
                // html += convertFaceMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.IMAGE:
                // if (i <= count - 2) {
                //     var customMsgElem = elems[i + 1];//获取保存图片名称的自定义消息elem
                //     var imgName = customMsgElem.getContent().getData();//业务可以自定义保存字段，demo中采用data字段保存图片文件名
                //     html += convertImageMsgToHtml(content, imgName);
                //     i++;//下标向后移一位
                // } else {
                //     html += convertImageMsgToHtml(content);
                // }
                break;
            case webim.MSG_ELEMENT_TYPE.SOUND:
                // html += convertSoundMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.FILE:
                // html += convertFileMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.LOCATION:
                // html += convertLocationMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.CUSTOM:
                // var eleHtml = convertCustomMsgToHtml(content);
                //转义，防XSS
                // html += webim.Tool.formatText2Html(eleHtml);
                break;
            case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
                // var eleHtml = convertGroupTipMsgToHtml(content);
                //转义，防XSS
                // html += webim.Tool.formatText2Html(eleHtml);
                break;
            default:
                webim.Log.error('未知消息元素类型: elemType=' + type);
                break;
        }

    }

    return html;
}

/**
 * 解析文本消息元素
 * @param content
 * @returns {*}
 */
function convertTextMsgToHtml(content) {
    return content.getText();
}















