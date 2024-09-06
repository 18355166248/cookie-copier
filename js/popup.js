const $hostInput = document.querySelector('#input');
$hostInput.value = localStorage.localHost || 'http://localhost:3000';

document.querySelector('#copy-cookie').addEventListener('click', function () {
  const localHost = $hostInput.value || 'http://localhost:3000';

  localStorage.localHost = localHost;

  chrome.cookies.getAll(
    { domain: 'ops.test.ximalaya.com' },
    function (allCookies) {
      allCookies.forEach((cookie) => {
        if (
          cookie.name !== 'JSESSIONID' &&
          cookie.name !== '_const_cas_ticket'
        ) {
          return;
        }

        const newCookie = {
          name: cookie.name,
          path: cookie.path,
          value: cookie.value,
          url: localHost + '/*',
        };
        chrome.cookies.set(newCookie, function (err) {
          if (err) {
            console.log(err);
          }
        });
        // console.log('newCookie: ', newCookie);
      });
      alert('复制成功 o(￣▽￣)ｄ');
    }
  );

  chrome.cookies.getAll({ domain: '.ximalaya.com' }, function (allCookies) {
    allCookies.forEach((cookie) => {
      if (cookie.name !== '4&_token') {
        return;
      }
      const cookieValue = cookie.value;
      const newCookie = {
        name: '4&_token',
        path: '/',
        value: cookieValue,
        url: localHost + '/*',
      };
      chrome.cookies.set(newCookie, function (err) {
        if (err) {
          console.log(err);
        }
      });
    });
  });
});
