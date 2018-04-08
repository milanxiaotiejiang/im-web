/**
 * 被新实例踢下线的回调处理
 */
function onKickedEventCall() {
    webim.Log.error("其他地方登录，被T了");
    document.getElementById("webim_demo").style.display = "none";
}

//多终端登录被T

function onMultipleDeviceKickedOut() {
    webim.Log.error("多终端登录，被T了");
    document.getElementById("webim_demo").style.display = "none";
}