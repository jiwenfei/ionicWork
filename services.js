/**
 * 提供一系列的服务
  * ticket:{
   *  time:121331311144,
   *  loginkey:'jiwenfei',
   *  token:'ewsdfdsee12322we//='
 * }
   * 加密方法：
   * 1.把loginkey，time，apppwd（程序间通讯密码）生成一个字符串数组，
   * 2.对这个数组按照字典顺序进行排序
   * 3.按照sh1进行加密
   * 4.进行base64编码。
   * java代码可参考com.xbstar.wei.JFWeiservice的dopost方法
 */

angular.module('starter.services', [])
.factory('StorageService',[function () {
  var gets=function (str_){
    var resstr=localStorage.getItem(str_);
    if(resstr){
      if(angular.fromJson(resstr)){
        return angular.fromJson(resstr);
      }
      if(JSON.parse(resstr)){
        return JSON.parse(resstr);
      }
      return resstr;
    }
    else{
      return "";
    }
  };
  var setNameAndHttpDatas=function(name_,httpData_){
    if(name_&&httpData_){
      localStorage.setItem("encodeusername",name_);
      localStorage.setItem("httpData",JSON.stringify(httpData_));
    }else{
      return false;
    }
  }
  var sets=function(key_,obj_){
    
  }
  return{
    
    get:function(key_){
      return gets(key_);
    },
    setNameAndHttpData:function(name_,httpData_){
      setNameAndHttpDatas(name_,httpData_);
    }
  }
}])


/**
 * 一些程序使用工具服务
 */
.factory('APPTools',[function(){
   var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
   var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                                              -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                                              -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
                                              58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0,  1,  2,  3,  4,  5,  6,
                                              7,  8,  9,  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                                              25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
                                              37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
                                              -1, -1);
  encodes=function(str){
                var out, i, len;
                var c1, c2, c3;
                len = str.length;
                i = 0;
                out = "";
                while (i < len){
                    c1 = str.charCodeAt(i++) & 0xff;
                    if (i == len){
                        out += base64EncodeChars.charAt(c1 >> 2);
                        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                        out += "==";
                        break
                     }
                    c2 = str.charCodeAt(i++);
                    if (i == len){
                        out += base64EncodeChars.charAt(c1 >> 2);
                        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                        out += "=";
                        break
                     }
                    c3 = str.charCodeAt(i++);
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                    out += base64EncodeChars.charAt(c3 & 0x3F)
          }
          return out
  };
    decodes=function(str){
                var c1, c2, c3, c4;
                var i, len, out;
                len = str.length;
                i = 0;
                out = "";
                while (i < len){
                    do {
                        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
                    } while (i < len && c1 == -1);
                    if (c1 == -1)
                        break;
                    do {
                        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
                     } while (i < len && c2 == -1);
                    if (c2 == -1)
                        break;
                    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
                    do {
                        c3 = str.charCodeAt(i++) & 0xff;
                        if (c3 == 61)
                            return out;
                        c3 = base64DecodeChars[c3]
                    } while (i < len && c3 == -1);
                    if (c3 == -1)
                        break;
                    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
                    do {
                        c4 = str.charCodeAt(i++) & 0xff;
                        if (c4 == 61)
                            return out;
                        c4 = base64DecodeChars[c4]
                    } while (i < len && c4 == -1);
                    if (c4 == -1)
                        break;
                    out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
                 }

                return out
        };
        return{
          decode:function(str_){
            return decodes(str_);
          },
          encode:function(str_){
           return  encodes(str_);
          }
          
        }
}])
/**
 * 用于提供用户相关的服务
 * 包含用户认证，用户基本信息。
 */
.factory('UserLoginService', ['$http','StorageService',function($http,StorageService) {
  //登录地址
  var loginUrl="";
  //登录htpp的方法
  var loginMethod="";
  //未加密字符串
  var username="";
  var encodeusername="";
  //用户票据
  var ticket={};
  var serviceUrl="";
  var httpData={};
  var isLogineds=function (name_) {
    username=name_;
    var tmpname=AppTools.encode(name_);
    //1.判断是否在缓存中
    if(encodeusername==tmpname){
      return true;
    }else{
      //2.去存储中取
      var tmpname=StorageService.get("encodeusername");
      if(tmpname!=null&&tmpname!=""){
         httpData=StorageService.get("httpData");
         encodeusername=tmpname;
        return true;
      }else{
        return false;
      }
    }
    
  }
  //var isLogined=false;
  /**
   * 从服务器端获得所需的ticket
   * @param  {string} appname 软件名
   * @param  {String} tmppwd  加密后的密码
   * @param  {String} tmpname 加密后的用户名称 
   */
  var getTicketFromServer=function (appname,tmppwd,tmpname) {
      var deferred = $q.defer(); 
      $http({
        url:loginUrl,
        method:loginMethod,
        params:{
          appname:appname,
          userpwd:tmppwd,
          loginkey:tmpname
        },
      }).success(function(data,status,config,headers){
        if(data&&data.status&&data.status=="200"){
          httpData=data;
          StorageService.setNameAndHttpData(tmpname,data);
          encodeusername=tmpname;
          deferred.resolve(data.ticket);
        }else{
          if(data&&data.error){
             deferred.reject(data.error);  
          }else{   
            deferred.reject("400");  
          }
          
        }
      }).error(function(data,status,hedaers,config){
         deferred.reject("500");  
      });
      return deferred.promise;
  };
  
  /**
   * 提供用户登录方法
   * @param  {String} userpwd  未加密用户字符串
   * @param  {String} username  已MD5加密用户密码
   */
  var userLogins=function(userpwd,username){
    var tmpUserName="";
    var tmpPWD="";
    var deferred = $q.defer(); 
    if(username&&userpwd){
      tmpUserName=AppTools.encode(username);
      //tmpPWD=AppTools.encode(userpwd);
      tmpPWD=userpwd;
    }else{
      //501:未实现方法，即缺少参数
      deferred.reject("501");
    }
    //1.判断用户是否登录
    if(isLogineds(tmpUserName)){
      deferred.resolve(httpData.ticket);
    }else{
      var appname='';
       getTicketFromServer(appname,tmpPWD,tmpUserName)
       .then(function (data) {
          deferred.resolve(data);
       },function (error) {
          deferred.resolve(error);
       });
    }
    return deferred.promise; 
  }

  return {
    //用户登录
    //name_
    //pwd_
    userLogin:function(name_,pwd_) {
      return userLogins(pwd_,name_);
    },
    isLogined:function (name_) {
      return isLogineds(name_);
    },
    serviceUrl:function(name_) {
      if(isLogineds(name_)){
        return httpData.serviceurl;
      }else{
        return "";
      }
    }
    
  };
}])
.factory('Chats', function() {

  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});




/**
 * 登录业务逻辑
 * 1.发送appname，username，userpasswd
 * 2.返回appurl，ticket,
 *  ticket:{
   *  time:121331311144,
   *  loginkey:'jiwenfei',
   *  token:'ewsdfdsee12322we//='
 * }
 * token加密方法：
   * 1.把loginkey，time，apppwd（程序间通讯密码）生成一个字符串数组，
   * 2.对这个数组按照字典顺序进行排序
   * 3.按照sh1进行加密
   * 4.进行base64编码。
   * java代码可参考com.xbstar.wei.JFWeiservice的dopost方法
 * 
 */