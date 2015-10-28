logged = function(data){
  if (data['code'] == 400001){
    window.location.replace("/user_tkw/login");
  }
}

generateUrlKey = function(){
  return '?consumer_key=' + Cookies.get('consumer_key') + '&secret_key=' + Cookies.get('secret_key')
}

getJobStatusHash = function(){
  return {
    'DRAFT': 0,
    'PUBLISHED': 1,
    'FILLED': 2,
    'EXPIRED': 3,
    'DASHBOARD': 4
  };
}

setTitle = function(input){
  var titleDescription = input.value.split('\n')[0]
  last = titleDescription.replace(/[^0-9a-z \-\_\.\,]/i, '')
  while(last != titleDescription){
    titleDescription = last
    last = titleDescription.replace(/[^0-9a-z \-\_\.\,]/i, '');
  };
  return titleDescription;
}

setCookie = function(key){
  Cookies.set('consumer_key', key['consumer_key']);
  Cookies.set('secret_key', key['secret_key']);
  Cookies.set('key_id', key['id']);
  Cookies.set('user_id', key['user_id']);
}

generateTimeFormat = function(time){
  return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() +
  ' ' + time.getHours() + ':' + time.getMinutes()
}


// VALIDATION

// for candidate
validateName = function(name){
  if (name == null){
    return false
  }
  var re = /^[a-zA-Z]{3,}$/i;
  return re.test(name);
}

validateEmailFormat = function(email){
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}

validatePhoneNumber = function(phoneNumber){
  var re = /^[0-9]{10}$/i;
  return re.test(phoneNumber);
}
