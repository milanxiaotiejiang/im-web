/**
 * 新增一条最近会话
 * @param sess_type
 * @param to_id
 * @param name
 * @param face_url
 * @param unread_msg_count
 * @param sesslist
 * @param addPositonType
 */
function addSess(sess_type, to_id, name, face_url, unread_msg_count, sesslist, addPositonType) {
    var sessDivId = "sessDiv_" + to_id;
    var sessDiv = document.getElementById(sessDivId);
    if (sessDiv) {//先判断是否存在会话DIV，已经存在，则不需要增加
        return;
    }
    var sessList = document.getElementsByClassName(sessList)[0];
    sessDiv = document.createElement("div");
    sessDiv.id = sessDivId;
    //如果当前选中的用户是最后一个用户
    sessDiv.className = "sessinfo";
    //添加单击用户头像事件
    sessDiv.onclick = function () {
        if (sessDiv.className == 'sessinfo-sel')
            return
        //todo
        // onSelSess(sess_type, to_id);
    }

    var faceImg = document.createElement("img");
    faceImg.id = "faceImg_" + to_id;
    faceImg.className = "face";
    faceImg.src = face_url;

    if (name.length > maxNameLen) { //名称过长，截取一部分
        name = name.substr(0, maxNameLen) + "...";
    }

    var delchat = document.createElement("div");
    delchat.className = 'delChat';
    delchat.innerHTML = '删除会话';

    delchat.onclick = function (e) {
        var selSess = webim.MsgStore.sessByTypeId(sess_type, to_id)
        if (sess_type == 'C2C') {
            sess_type = 1;
            webim.setAutoRead(selSess, true, false)
        } else {
            sess_type = 2;
            webim.groupMsgReaded({
                "GroupId": to_id,
                "MsgReadedSeq": selSess._impl.curMaxMsgSeq
            })
        }
        //todo
        // delChat(sess_type, to_id);
        e.preventDefault()
        e.stopPropagation()
        return false;
    }

    var nameDiv = document.createElement("div");
    nameDiv.id = "nameDiv_" + to_id;
    nameDiv.className = "name";
    nameDiv.innerHTML = name;
    var badgeDiv = document.createElement("div");
    badgeDiv.id = "badgeDiv_" + to_id;
    badgeDiv.className = "badge";

    if (unread_msg_count > 0) {
        if (unread_msg_count >= 100) {
            unread_msg_count = '99+';
        }
        badgeDiv.innerHTML = "<span>" + unread_msg_count + "</span>";
        badgeDiv.style.display = "block";
    }
    sessDiv.appendChild(faceImg);
    sessDiv.appendChild(nameDiv);
    sessDiv.appendChild(badgeDiv);
    sessDiv.appendChild(delchat);

    if (!addPositonType || addPositonType == 'TAIL') {
        sessList.appendChild(sessDiv); //默认插入尾部
    } else if (addPositonType == 'HEAD') {
        sessList.insertBefore(sessDiv); //插入头部
    } else {
        console.log(webim.Log.error('未知addPositonType' + addPositonType));
    }
}


function setSelSessStyleOn(newSelToID) {

    var selSessDiv = document.getElementById("sessDiv_" + newSelToID);

    if (selSessDiv) {
        selSessDiv.className = "sessinfo-sel"; //设置当前选中用户的样式为选中样式
    } else {
        webim.Log.warn("不存在selSessDiv: selSessDivId=" + "sessDiv_" + newSelToID);
    }

    var selBadgeDiv = document.getElementById("badgeDiv_" + newSelToID);
    if (selBadgeDiv) {
        selBadgeDiv.style.display = "none";
    } else {
        webim.Log.warn("不存在selBadgeDiv: selBadgeDivId=" + "badgeDiv_" + selToID);
    }
}

/**
 * 更新最近会话的未读消息数
 * @param sess_type
 * @param to_id
 * @param name
 * @param unread_msg_count
 */
function updateSessDiv(sess_type, to_id, name, unread_msg_count) {
    var badgeDiv = document.getElementById("badgeDiv_" + to_id);
    if (badgeDiv && unread_msg_count > 0) {
        if (unread_msg_count >= 100) {
            unread_msg_count = '99+';
        }
        badgeDiv.innerHTML = "<span>" + unread_msg_count + "</span>";
        badgeDiv.style.display = "block";
    } else if (badgeDiv == null) { //没有找到对应的聊天id
        var headUrl;
        if (sess_type == webim.SESSION_TYPE.C2C) {
            headUrl = friendHeadUrl;
        } else {
            headUrl = groupHeadUrl;
        }
        addSess(sess_type, to_id, name, headUrl, unread_msg_count, 'sesslist');
    }
}

















