$(document).ready(function(){new customAlert;alert('<div style="font-size: 4em; background: #000; color: yellow; border-radius: 8px;">⚠</div><br><u>WARNING: Do not store large value in this wallet!!!</u><br><br>We\'re making every effort towards a secure design, and do not store any wallet file or data on this computer. Regardless, we cannot guarantee the security of your cryptocurrency in this stage of the project!<br><br>',{title:"",button:"Understood"});var clicked=0;$(".click").click(function(){if(!clicked){var userid=$("#inputUserID").val();var passcode=$("#inputPasscode").val();if(userid.length==16&&passcode.length==16){clicked=1;session_step=0;$("#arc0").css("background-color",$("#combinator").css("color"));$("#generatebutton").attr("disabled","disabled");$("#helpbutton").attr("disabled","disabled");rotate_login(0);setTimeout(function(){main(userid,passcode)},1e3)}else{checkfields();helpbutton()}}})});init.login=function(args){};function helpbutton(){alert("Welcome to this Internet of Coins node.<br><br>To sign in, you need to enter an account code and password that are both 16 characters long.<br><br>If you don't have sign in credentials yet, you can generate them by clicking on the NEW ACCOUNT button, and the new credentials will be filled in for you.<br><br>",{title:"",button:"Close"})}function checkfields(){var userid=String($("#inputUserID").val());var passwd=String($("#inputPasscode").val());if(userid.length==16&&passwd.length==16&&userid!=passwd){$("#generatebutton").attr("disabled","disabled");$("#loginbutton").removeAttr("disabled")}else{$("#loginbutton").attr("disabled","disabled");$("#generatebutton").removeAttr("disabled")}}function animate_login(){$("#arc0").css("background-color",$("#combinator").css("color"));if(blink("arc0")&&rotate_login(0)&&dial_login(0)){return true}}function blink(target){var el=document.getElementById(target);if(el!=null&&typeof el.style!="undefined"){if(typeof el.style.visibility!="undefined"&&el.style.visibility=="hidden"){el.style.visibility="visible"}else{el.style.visibility="hidden"}}setTimeout("blink('"+target+"')",400);return true}function rotate_login(turn){var el=document.getElementById("arc3");var bgcl=$("#combinator").css("background-color");if(el!=null){if(el.style["border-left"]=="4px solid "+bgcl){el.style["border-left"]="4px solid";el.style["border-right"]="4px solid";el.style["border-top"]="4px solid "+bgcl;el.style["border-bottom"]="4px solid "+bgcl}else{el.style["border-left"]="4px solid "+bgcl;el.style["border-right"]="4px solid "+bgcl;el.style["border-top"]="4px solid";el.style["border-bottom"]="4px solid"}}if(turn==0){turn=1}else{turn=0}setTimeout("rotate_login("+turn+")",1500);return true}function dial_login(turn){var el=document.getElementById("arc2");var bgcl=$("#combinator").css("background-color");if(turn==0){el.style["border-left"]="2px solid";el.style["border-top"]="2px solid "+bgcl;el.style["border-right"]="2px solid "+bgcl;el.style["border-bottom"]="2px solid "+bgcl}if(turn==1){el.style["border-left"]="2px solid";el.style["border-top"]="2px solid";el.style["border-right"]="2px solid "+bgcl;el.style["border-bottom"]="2px solid "+bgcl}if(turn==2){el.style["border-left"]="2px solid";el.style["border-top"]="2px solid";el.style["border-right"]="2px solid";el.style["border-bottom"]="2px solid "+bgcl}if(turn==3){el.style["border-left"]="2px solid";el.style["border-top"]="2px solid";el.style["border-right"]="2px solid";el.style["border-bottom"]="2px solid"}return true}function main(userid,passcode){nacl=nacl_factory.instantiate();blink("arc0");var nonce=nacl.crypto_box_random_nonce();var user_keys=generate_keys(passcode,userid);var user_pubkey=nacl.to_hex(user_keys.boxPk);do_login(user_keys,nonce);continue_session(user_keys,nonce,userid)}function next_step(){var current_session=session_step;session_step++;return current_session+1}function read_session(user_keys,nonce){var sess_bin=nacl.from_hex($("#session_data").text());var session_data=nacl.crypto_box_open(sess_bin,nonce,user_keys.boxPk,user_keys.boxSk);var session_string=nacl.decode_utf8(session_data);return JSON.parse(session_string)}function continue_session(user_keys,nonce,userid){var session_watch=$("#session_data").text();if(session_watch==""){setTimeout(function(){continue_session(user_keys,nonce,userid)},1e3)}else{setTimeout(function(){fetchview("interface",{user_keys:user_keys,nonce:nonce,userid:userid})},3e3)}}function do_login(user_keys,nonce){var session_seed=nacl.random_bytes(4096);var session_keypair=nacl.crypto_box_keypair_from_seed(session_seed);var session_sign_seed=nacl.crypto_hash_sha256(session_seed);var session_signpair=nacl.crypto_sign_keypair_from_seed(session_sign_seed);var session_nonce=nacl.to_hex(nonce);var session_hexkey=nacl.to_hex(session_keypair.boxPk);var session_hexsign=nacl.to_hex(session_signpair.signPk);var session_seckey=nacl.to_hex(session_keypair.boxSk);var session_secsign=nacl.to_hex(session_signpair.signSk);dial_login(1);$.ajax({url:path+"x/"+session_hexsign+"/"+session_step,dataType:"json"}).done(function(data){if(clean(data.nonce1).length==48){session_step++;var nonce2=nacl.crypto_box_random_nonce();var nonce2_hex=nacl.to_hex(nonce2);var nonce2_hex=nonce2_hex.replace(/^[8-9a-f]/,function(match){var range=["8","9","a","b","c","d","e","f"];return range.indexOf(match)});var nonce1_hex=clean(data.nonce1);var nonce1=nacl.from_hex(nonce1_hex);var nonce1_hex=nonce1_hex.replace(/^[8-9a-f]/,function(match){var range=["8","9","a","b","c","d","e","f"];return range.indexOf(match)});var secrets_json={nonce1:nonce1_hex,nonce2:nonce2_hex,client_session_pubkey:session_hexkey};var session_secrets=JSON.stringify(secrets_json);var crypt_bin=nacl.encode_utf8(session_secrets);var crypt_response=nacl.crypto_sign(crypt_bin,session_signpair.signSk);var crypt_hex=nacl.to_hex(crypt_response);$.ajax({url:path+"x/"+session_hexsign+"/"+session_step+"/"+crypt_hex,dataType:"json"}).done(function(data){dial_login(2);var server_sign_binkey=nacl.from_hex(clean(data.server_sign_pubkey));var crypt_bin=nacl.from_hex(clean(data.crhex));var crypt_pack=nacl.crypto_sign_open(crypt_bin,server_sign_binkey);var crypt_str=nacl.decode_utf8(crypt_pack);var crypt_vars=JSON.parse(crypt_str);if(crypt_vars.server_sign_pubkey==data.server_sign_pubkey){var key_array={nonce:session_nonce,nonce1:nonce1_hex,nonce2:nonce2_hex,session_secsign:session_secsign,session_seckey:session_seckey,session_pubsign:session_hexsign,session_pubkey:session_hexkey,server_pubsign:crypt_vars.server_sign_pubkey,server_pubkey:crypt_vars.server_session_pubkey};var sess_bin=nacl.encode_utf8(JSON.stringify(key_array));var sess_response=nacl.crypto_box(sess_bin,nonce,user_keys.boxPk,user_keys.boxSk);var sess_hex=nacl.to_hex(sess_response);$("#session_data").text(sess_hex);dial_login(3)}})}})}function generate_keys(secret,salt){var secr_ba=sjcl.codec.utf8String.toBits(secret.toUpperCase());var salt_ba=sjcl.codec.utf8String.toBits(salt.toLowerCase());var key_seed1=sjcl.misc.pbkdf2(secr_ba,salt_ba,5e3,4096,false);var rsecret=secret.split("").reverse().join("");var rsecr_ba=sjcl.codec.utf8String.toBits(rsecret);var usalt_ba=sjcl.codec.utf8String.toBits(salt.toUpperCase());var key_seed2=sjcl.misc.pbkdf2(rsecr_ba,usalt_ba,5e3,4096,false);var key_seed3=sjcl.misc.pbkdf2(key_seed1,key_seed2,5e3,4096,false);var key_seed_str3=sjcl.codec.hex.fromBits(key_seed3);var final_key_seed=nacl.from_hex(key_seed_str3);var user_key=nacl.crypto_box_keypair_from_seed(final_key_seed);dial_login(0);return user_key}function clean(dirty){var dirty_str=dirty.toString();var clean_str=dirty_str.replace(/[^A-Za-z0-9]/g,"");return clean_str}