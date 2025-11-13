// graduation_app.js (non-module, compat)
// Khởi tạo Firebase compat và chạy logic theo từng trang tốt nghiệp

(function(){
  var appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  var firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
  var initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

  var db = null;
  var auth = null;
  var isAuthReady = false;

  var APP_ROOT = '/graduation';
  var INFO_URL = '/data/info.json';
  var GUESTS_URL = '/data/khach.json';

  var ASSETS = {
    GRADUATE_IMAGE: '/image/graduation/main.jpg',
    MAP_IMAGE: '/image/graduation/map.jpg',
    MAN_DEFAULT: '/image/graduation/man.jpg',
    WOMEN_DEFAULT: '/image/graduation/women.jpg',
    LAUREL_WREATH: '/image/nguyet-que.png',
    GOLD_FRAME: '/image/vien-vang.png',
    LOGO: '/image/graduation/logotruong.png',
    BG_VIDEO: '/video/sparkle-background.mp4'
  };

  function setupFirebaseCompat(){
    try {
      if (!firebaseConfig || !Object.keys(firebaseConfig).length) return false;
      var app = firebase.initializeApp(firebaseConfig);
      db = firebase.firestore(app);
      auth = firebase.auth(app);
      if (initialAuthToken) {
        return auth.signInWithCustomToken(initialAuthToken).then(function(){ isAuthReady=true; return true; }).catch(function(){ return auth.signInAnonymously().then(function(){ isAuthReady=true; return true; }); });
      } else {
        return auth.signInAnonymously().then(function(){ isAuthReady=true; return true; });
      }
    } catch(e){ console.error('Firebase compat init error:', e); return false; }
  }

  function getInfoDocRef(){
    return db.doc(['artifacts', appId, 'public', 'data', 'info', 'event_details'].join('/'));
  }
  function getGuestsColRef(){
    return db.collection(['artifacts', appId, 'public', 'data', 'khach'].join('/'));
  }
  function getRsvpsColRef(){
    return db.collection(['artifacts', appId, 'public', 'data', 'rsvps'].join('/'));
  }

  function normalize(s){
    return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  }

  function updateMeta(info, guest){
    var title = guest ? ('Thư mời dành cho ' + (guest.title||'') + ' ' + guest.name) : ('Thiệp Mời Lễ Tốt Nghiệp | ' + (info && info.graduateName || 'Graduate'));
    var desc = guest ? ('Thiệp mời đặc biệt từ ' + (info && info.graduateName || 'Tân cử nhân') + ' dành cho ' + (guest.title||'') + ' ' + guest.name + '.') : ('Trân trọng kính mời bạn đến chung vui cùng ' + (info && info.graduateName || 'tân cử nhân') + '.');
    var img = (guest && guest.previewImage) || (info && info.previewImage) || ASSETS.GRADUATE_IMAGE;
    document.title = title;
    var set=function(sel,attr,val){var m=document.querySelector(sel); if(m) m.setAttribute(attr,val);};
    set('meta[property="og:title"]','content',title);
    set('meta[property="og:description"]','content',desc);
    set('meta[property="og:image"]','content', img.indexOf('http')===0 ? img : (location.origin + img));
    set('meta[property="og:image:width"]','content','1200');
    set('meta[property="og:image:height"]','content','630');
    set('meta[name="twitter:card"]','content','summary_large_image');
  }

  function loadData(){
    return Promise.resolve().then(function(){ return setupFirebaseCompat(); }).then(function(canFs){
      var info = null; var guests = [];
      function fetchJson(url){ return fetch(url, { cache: 'no-store' }).then(function(r){ if(r.ok) return r.json(); return null; }).catch(function(){ return null; }); }
      var p = Promise.resolve();
      if (canFs) {
        p = getInfoDocRef().get().then(function(s){ if(s.exists) info = s.data(); }).catch(function(){}).then(function(){ return getGuestsColRef().get(); }).then(function(snap){ guests = snap.docs.map(function(d){ return d.data(); }); }).catch(function(){});
      }
      return p.then(function(){
        return Promise.resolve().then(function(){ if(!info) return fetchJson(INFO_URL).then(function(j){ info=j; }); }).then(function(){ if(!guests || guests.length===0) return fetchJson(GUESTS_URL).then(function(j){ guests = Array.isArray(j && j.guests) ? j.guests : (Array.isArray(j)? j : []); }); }).then(function(){ guests=(guests||[]).map(function(g){ g.nameEncoded = encodeURIComponent(g.name); return g; }); return { info: info, guests: guests }; });
      });
    });
  }

  function goldBurst(){ try { confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ['#FFD700','#FFF3B0'] }); } catch(_){} }

  function runInvitationMain(){
    var DEFAULT_INVITE_MESSAGE = 'Thân gửi bạn, hãy đến chung vui cùng tôi trong buổi lễ trọng đại này, đánh dấu một cột mốc quan trọng trên con đường sắp tới. Sự hiện diện của bạn là niềm vinh dự lớn nhất của tôi!';

    function renderDataError(message){
      return '<div class="text-center p-12 bg-white rounded-xl shadow-lg mt-12 max-w-md border-t-8 border-red-500">\n<div class="text-3xl font-bold text-red-600 mb-4">Lỗi Dữ Liệu</div>\n<p class="text-gray-600">'+message+'</p>\n<p class="text-sm text-gray-500 mt-2">Vui lòng đảm bảo Firebase đã được thiết lập.</p>\n</div>';
    }

    function renderLoading(){
      var el=document.getElementById('app'); if(!el) return; el.innerHTML='<div class="flex flex-col items-center justify-center min-h-screen w-full"><svg class="animate-spin -ml-1 mr-3 h-10 w-10 text-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p class="mt-4 text-navy font-semibold">Đang tải dữ liệu thiệp mời...</p></div>';
    }

    function renderMainPage(info, guests){
      if(!info || !info.graduateName) return renderDataError('Không tìm thấy thông tin sự kiện.');
      var guestSection = guests.length>0 ? '<div class="mt-8 text-center w-full p-4 bg-navy/20 rounded-lg border border-gold/50"><p class="text-sm text-gold mb-2 font-bold">Tìm Thiệp Mời Của Bạn:</p><form id="guestSearchForm" class="space-y-2"><input type="text" id="guestNameInput" placeholder="Nhập tên khách mời..." class="w-full px-3 py-2 rounded-md border border-gold/50 bg-transparent text-gold placeholder-gold/70 focus:outline-none focus:ring-2 focus:ring-gold"/><button type="submit" class="w-full bg-gold text-navy font-semibold py-2 rounded-md hover:bg-yellow-400 transition-colors">Tìm kiếm</button></form><p class="text-xs text-gold/80 mt-2">...và nhiều thiệp mời cá nhân khác.</p></div>' : '<p class="mt-8 text-sm text-gold/80">Chưa có danh sách khách mời.</p>';
      return '<div class="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl my-8">\n<div class="flex-1 p-8 md:p-12 text-white flex flex-col items-center justify-between relative overflow-hidden">\n<video id="background-video" autoplay loop muted playsinline class="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" poster="/image/graduation/main-preview.jpg"><source src="'+ASSETS.BG_VIDEO+'" type="video/mp4"></video>\n<div class="text-center w-full relative z-10">\n<h2 class="text-2xl font-serif text-gold mb-1">Thư Mời</h2>\n<h1 class="text-4xl md:text-5xl font-serif font-black text-gold gold-shine border-b border-gold/50 pb-2 mb-8">Tham Dự <br> LỄ TỐT NGHIỆP</h1>\n<div class="my-8 flex justify-center">\n<div class="relative inline-block w-56 h-56 md:w-64 md:h-64">\n<img src="'+ASSETS.LAUREL_WREATH+'" class="absolute inset-0 w-full h-full object-contain" alt="">\n<img src="'+ASSETS.GRADUATE_IMAGE+'" class="relative w-40 h-40 md:w-48 md:h-48 object-cover rounded-full golden-border left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" alt="">\n</div></div>\n<p class="text-base text-gold font-semibold tracking-wider">TÂN CỬ NHÂN</p>\n<h3 class="text-3xl md:text-4xl font-serif font-black text-gold mt-2">♦ '+info.graduateName+' ♦</h3>\n<div class="mt-8 w-full max-w-sm mx-auto">'+guestSection+'</div>\n</div>\n</div>\n<div class="flex-1 p-8 md:p-12 invitation-frame gold-frame-bg bg-white/60 backdrop-blur-sm text-navy flex flex-col relative">\n<img src="'+ASSETS.LOGO+'" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 md:w-28 opacity-90 z-[1]" alt="">\n<div class="absolute inset-0 bg-white/40 z-0"></div>\n<div class="relative z-10 flex-1 flex flex-col">\n<div class="text-center">\n<p class="text-sm font-semibold tracking-widest text-gray-500">'+(info.university||'Tên trường')+'</p>\n<h1 class="text-4xl font-serif font-black text-navy mt-2">LỄ TỐT NGHIỆP</h1>\n<p class="text-base font-bold text-white bg-navy py-1 px-4 inline-block rounded-full mt-3 shadow-md">'+(info.subEventDetails||info.universityShort||'UEH')+' - '+(info.date?('Ngày '+info.date):'Thông tin phụ')+'</p>\n<div class="w-full h-px bg-gray-300 my-6"></div>\n</div>\n<div class="space-y-6 mb-8">\n<div class="flex flex-col md:flex-row justify-center gap-8 mb-12">\n<div class="bg-purple-50 p-6 rounded-xl"><i data-lucide="calendar" class="w-8 h-8 text-purple-600 mb-3 mx-auto"></i><h3 class="font-bold text-gray-700">NGÀY</h3><p class="text-gray-600">'+(info.date||'Chưa cập nhật')+'</p></div>\n<div class="bg-indigo-50 p-6 rounded-xl"><i data-lucide="clock" class="w-8 h-8 text-indigo-600 mb-3 mx-auto"></i><h3 class="font-bold text-gray-700">Giờ</h3><p class="text-gray-600">'+(info.time||'Chưa cập nhật')+'</p></div>\n<div class="bg-blue-50 p-6 rounded-xl"><i data-lucide="map-pin" class="w-8 h-8 text-blue-600 mb-3 mx-auto"></i><h3 class="font-bold text-gray-700">ĐỊA ĐIỂM</h3><p class="text-gray-600">'+(info.venue||'Chưa cập nhật')+'</p></div>\n</div>\n<div><h3 class="text-sm font-black tracking-widest text-navy uppercase mb-1">ĐỊA ĐIỂM</h3><a href="'+(info.mapLink||'#')+'" target="_blank" class="block group text-navy hover:text-gold"><p class="text-lg font-bold flex items-center">'+(info.venue||'Chưa cập nhật')+'<i data-lucide="map-pin" class="w-4 h-4 ml-2"></i></p><p class="text-sm text-gray-600">'+(info.address||'Chưa cập nhật địa chỉ')+'</p><p class="text-xs text-blue-500 mt-1">Xem trên Google Maps</p></a></div></div>\n<div class="mt-auto pt-4"><h3 class="text-center text-sm font-black tracking-widest text-navy uppercase mb-2">Ảnh Dẫn Đường</h3>' + (info.mapLink?('<iframe src="'+info.mapLink+'" width="100%" height="360" style="border:0;" loading="lazy"></iframe>'):('<img src="'+ASSETS.MAP_IMAGE+'" class="w-full rounded-lg shadow-md border" alt="">')) + '</div>\n<div class="text-center mt-6 pt-4 border-t border-gray-200"><h3 class="text-lg font-bold text-navy">TRÂN TRỌNG KÍNH MỜI</h3><p class="text-xl font-serif font-extrabold text-navy mt-1">Sự hiện diện của Quý Vị</p></div>\n</div>\n</div>';
    }

    function renderGuestHtml(info, guest){
      var guestName = guest.name; var guestTitle = guest.title; var inviteMsg = (guest.message && guest.message.trim()) ? guest.message : DEFAULT_INVITE_MESSAGE;
      var guestImg = guest.image && guest.image.trim() ? ('/image/graduation/' + guest.image) : (guest.gender && guest.gender.toLowerCase()==='female' ? ASSETS.WOMEN_DEFAULT : ASSETS.MAN_DEFAULT);
      var mainCardClass = guest.special ? 'special-card text-white' : 'bg-navy/95 text-white';
      var frameClass = guest.special ? 'invitation-frame gold-frame-bg bg-white/95 text-navy' : 'invitation-frame bg-white text-navy';
      return '<div class="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl my-8">\n<div class="flex-1 p-8 md:p-12 '+mainCardClass+' text-white flex flex-col items-center justify-between relative overflow-hidden">\n<video id="background-video" autoplay loop muted playsinline class="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" poster="/image/graduation/main-preview.jpg"><source src="'+ASSETS.BG_VIDEO+'" type="video/mp4"></video>\n<div class="text-center w-full relative z-10">\n<h2 class="text-2xl font-serif text-gold mb-1">Thư Mời</h2>\n<h1 class="text-4xl md:text-5xl font-serif font-black text-gold border-b border-gold/50 pb-2 mb-8">Tham Dự <br> LỄ TỐT NGHIỆP</h1>\n<div class="my-8 flex items-center justify-center gap-6">\n<div class="relative inline-block w-56 h-56 md:w-64 md:h-64"><img src="'+ASSETS.LAUREL_WREATH+'" class="absolute inset-0 w-full h-full object-contain" alt=""><img src="'+ASSETS.GRADUATE_IMAGE+'" class="relative w-40 h-40 md:w-48 md:h-48 object-cover rounded-full golden-border left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" alt=""></div>\n<div class="relative inline-block w-56 h-56 md:w-64 md:h-64 hidden md:block"><img src="'+ASSETS.LAUREL_WREATH+'" class="absolute inset-0 w-full h-full object-contain" alt=""><img src="'+guestImg+'" onerror="this.onerror=null;this.src=\''+(guest.gender && guest.gender.toLowerCase()==='female' ? ASSETS.WOMEN_DEFAULT : ASSETS.MAN_DEFAULT)+'\';" class="relative w-40 h-40 md:w-48 md:h-48 object-cover rounded-full golden-border left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" alt=""></div>\n</div>\n<p class="text-base text-gold font-semibold tracking-wider">TRÂN TRỌNG KÍNH MỜI</p>\n<h3 class="text-3xl md:text-4xl font-serif font-bold text-gold mt-2">_ '+guestTitle+' _<br> ♦ '+guestName+' ♦</h3>\n</div>\n<a href="'+APP_ROOT+'" class="mt-8 text-sm text-gold hover:underline relative z-10">Quay về trang chủ</a>\n</div>\n<div class="flex-1 p-8 md:p-12 '+frameClass+' flex flex-col relative">\n<div class="absolute inset-0 bg-white/40 z-[2]"></div>\n<img src="'+ASSETS.LOGO+'" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 md:w-28 opacity-90 z-[1]" alt="">\n<div class="relative z-[10] flex-1 flex flex-col">\n<div class="text-center"><p class="text-sm font-semibold tracking-widest text-gray-500">'+(info.university||'Tên trường')+'</p><h1 class="text-4xl font-serif font-black text-navy mt-2">LỄ TỐT NGHIỆP</h1><p class="text-base font-bold text-gray-700 mt-2">'+(info.subEventDetails||info.universityShort||'UEH')+' - '+(info.date?('Ngày '+info.date):'Thông tin phụ')+'</p><div class="w-full h-px bg-gray-300 my-6"></div></div>\n<div class="space-y-6 mb-8"><div class="flex flex-col md:flex-row justify-center gap-8 mb-12"><div class="bg-purple-50 p-6 rounded-xl"><i data-lucide="calendar" class="w-8 h-8 text-purple-600 mb-3 mx-auto"></i><h3 class="font-bold text-gray-700">NGÀY</h3><p class="text-gray-600">'+(info.date||'Chưa cập nhật')+'</p></div><div class="bg-indigo-50 p-6 rounded-xl"><i data-lucide="clock" class="w-8 h-8 text-indigo-600 mb-3 mx-auto"></i><h3 class="font-bold text-gray-700">THỜI GIAN</h3><p class="text-gray-600">'+(info.time||'Chưa cập nhật')+'</p></div><div class="bg-blue-50 p-6 rounded-xl"><i data-lucide="map-pin" class="w-8 h-8 text-blue-600 mb-3 mx-auto"></i><h3 class="font-bold text-gray-700">ĐỊA ĐIỂM</h3><p class="text-gray-600">'+(info.venue||'Chưa cập nhật')+'</p></div></div><div><h3 class="text-sm font-black tracking-widest text-navy uppercase mb-1">ĐỊA ĐIỂM</h3><a href="'+(info.mapLink||'#')+'" target="_blank" class="block group text-navy hover:text-gold"><p class="text-lg font-bold flex items-center">'+(info.venue||'Chưa cập nhật')+'<i data-lucide="map-pin" class="w-4 h-4 ml-2"></i></p><p class="text-sm text-gray-600">'+(info.address||'Chưa cập nhật địa chỉ')+'</p><p class="text-xs text-blue-500 mt-1">Xem trên Google Maps</p></a></div></div>\n<div class="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200 mt-auto"><img src="'+guestImg+'" onerror="this.onerror=null;this.src=\''+(guest.gender && guest.gender.toLowerCase()==='female' ? ASSETS.WOMEN_DEFAULT : ASSETS.MAN_DEFAULT)+'\';" class="w-16 h-16 rounded-full object-cover mb-3 border-2 border-navy" alt=""><p class="text-lg font-serif italic text-gray-700 text-center mb-4">"'+inviteMsg+'"</p><p class="text-sm font-semibold text-navy">Trân trọng từ người tốt nghiệp, '+(info.graduateName||'')+' </p></div><div class="text-center mt-6 pt-4 border-t border-gray-200"><h3 class="text-lg font-bold text-navy">TRÂN TRỌNG KÍNH MỜI</h3><p class="text-2xl font-serif font-extrabold text-navy mt-1">'+guestTitle+' '+guestName+'</p></div>\n</div>\n</div>';
    }

    function attachGuestForm(guests){
      var forms = Array.prototype.slice.call(document.querySelectorAll('form#guestSearchForm'));
      forms.forEach(function(form){ var input = form.querySelector('input#guestNameInput'); if(!input) return; form.addEventListener('submit', function(e){ e.preventDefault(); var q=normalize(input.value); if(!q){ input.focus(); return; } var target = (guests||[]).find(function(g){ return normalize(g.name)===q; }) || (guests||[]).find(function(g){ return normalize(g.name).includes(q); }); if(target){ history.pushState({}, '', APP_ROOT + '/' + encodeURIComponent(target.name)); router(); } else { input.classList.add('ring-2','ring-red-500'); setTimeout(function(){ input.classList.remove('ring-2','ring-red-500'); }, 1200); } }); });
    }

    function renderControls(info){
      var controls = document.getElementById('controls'); if(!controls) return; var html = '<button id="celebrateBtn" class="bg-gold text-navy w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" title="Chúc mừng!"><i data-lucide="party-popper" class="w-6 h-6"></i></button>'; if(info && info.music){ html += '<button id="musicBtn" class="bg-gold text-navy w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" title="Tắt/Mở nhạc"><i data-lucide="volume-2" class="w-6 h-6"></i></button>'; }
      controls.innerHTML=html; try{ lucide.createIcons(); }catch(_){}
      var celebrateBtn=document.getElementById('celebrateBtn'); if(celebrateBtn) celebrateBtn.addEventListener('click', goldBurst);
      if(info && info.music){ var music=document.getElementById('background-music'); var musicBtn=document.getElementById('musicBtn'); if(music){ music.src=info.music; var playing=false; var render=function(){ musicBtn.innerHTML = playing ? '<i data-lucide="volume-2" class="w-6 h-6"></i>' : '<i data-lucide="volume-x" class="w-6 h-6"></i>'; try{ lucide.createIcons(); }catch(_){}}; var tryPlay=function(){ music.play().then(function(){ playing=true; render(); }).catch(function(){ playing=false; render(); }); }; musicBtn.addEventListener('click', function(){ if(!playing) tryPlay(); else { music.pause(); playing=false; render(); } }); setTimeout(function(){ tryPlay(); }, 800); document.body.addEventListener('click', function(){ if(!playing) tryPlay(); }, { once: true }); }
      }
    }

    function router(){
      renderLoading();
      loadData().then(function(loaded){ var info=loaded.info; var guests=loaded.guests; var path = location.pathname.replace(/\/+$/,''); var parts = path.split('/').filter(function(p){ return p.length>0; }); if(!info){ document.getElementById('app').innerHTML = renderDataError('Không thể tải dữ liệu sự kiện.'); return; }
        var html='';
        if(parts.length===1 && parts[0].toLowerCase()==='graduation'){ html = renderMainPage(info, guests); }
        else if(parts.length===2 && parts[0].toLowerCase()==='graduation'){ var guestName = decodeURIComponent(parts[1]); var g = guests.find(function(x){ return x.name.toLowerCase()===guestName.toLowerCase(); }); html = g ? renderGuestHtml(info, g) : '<div class="text-center p-12 bg-white rounded-xl shadow-lg mt-12 max-w-md border-t-8 border-red-500"><div class="text-3xl font-bold text-red-600 mb-4">Không tìm thấy</div><p class="text-gray-600">Không tìm thấy thiệp cho \"'+guestName+'\".</p><a href="'+APP_ROOT+'" class="mt-6 inline-block text-navy font-semibold hover:underline">Quay về trang chủ</a></div>'; }
        else { html = '<div class="p-8 text-center max-w-2xl mx-auto bg-white rounded-xl shadow-xl mt-12 border-t-8 border-red-500"><div class="text-4xl font-black text-red-500 mb-4">Lỗi Đường Dẫn</div><p class="text-xl text-gray-700 mb-6">Vui lòng truy cập đường dẫn chính:</p><a href="'+APP_ROOT+'" class="mt-6 inline-block text-white px-6 py-3 bg-navy rounded-full hover:bg-navy/80 font-semibold">Đi đến '+APP_ROOT+'</a></div>'; }
        document.getElementById('app').innerHTML = html; updateMeta(info, (parts.length===2 && parts[0].toLowerCase()==='graduation') ? guests.find(function(x){ return x.name.toLowerCase()===decodeURIComponent(parts[1]).toLowerCase(); }) : null ); renderControls(info); attachGuestForm(guests); try{ lucide.createIcons(); }catch(_){}
      });
    }

    window.addEventListener('load', router);
    window.addEventListener('popstate', router);
  }

  function runInvitation4PageMain(){
    function $(s,r){ return (r||document).querySelector(s); }
    function bindGuestSearch(forms, guests){
      forms.forEach(function(form){ var input=form.querySelector("input[name='guest']"); form.addEventListener('submit', function(e){ e.preventDefault(); var q=normalize(input.value); if(!q){ input.focus(); return; } var target = guests.find(function(g){ return normalize(g.name)===q; }) || guests.find(function(g){ return normalize(g.name).includes(q); }); if(target){ sessionStorage.setItem('guestName', target.name); history.pushState({}, '', APP_ROOT + '/' + encodeURIComponent(target.name)); renderPersonalInvite(INFO, target); updateMeta(INFO, target); goldBurst(); document.getElementById('s5').scrollIntoView({ behavior: 'smooth' }); } else { sessionStorage.setItem('guestName', input.value); document.getElementById('s4').scrollIntoView({ behavior: 'smooth' }); } }); });
    }
    var INFO=null, GUESTS=[];
    function renderEventInfo(info){
      $('#graduateNameHero').textContent = info && info.graduateName || 'Tên Tân Cử Nhân';
      $('#universityLabel').textContent = info && info.university || 'Tên Trường';
      $('#eventDate').textContent = info && info.date || 'Chưa cập nhật';
      $('#eventTime').textContent = info && info.time || 'Chưa cập nhật';
      $('#eventVenue').textContent = info && info.venue || 'Chưa cập nhật';
      var ml = info && info.mapLink || '#';
      $('#mapLinkBtn').setAttribute('href', ml);
      $('#mapEmbed').innerHTML = (info && info.mapLink) ? ('<iframe src="'+info.mapLink+'" width="100%" height="360" style="border:0;" loading="lazy"></iframe>') : ('<img src="'+ASSETS.MAP_IMAGE+'" class="w-full h-80 object-cover" alt="">');
      $('#graduateImage').src = info && info.graduateImage || ASSETS.GRADUATE_IMAGE;
      $('#graduateNameS3').textContent = info && info.graduateName || 'Tên Tân Cử Nhân';
      $('#graduateQuote').textContent = info && info.graduateQuote || 'Cảm ơn gia đình, thầy cô và bạn bè đã đồng hành trong chặng đường này.';
      var c = info && info.contact || {}; var cont=[]; if(c.phone) cont.push('<a href="tel:'+c.phone+'" class="hover:text-gold" title="Gọi"><i data-lucide="phone" class="w-5 h-5"></i></a>'); if(c.zalo) cont.push('<a href="'+c.zalo+'" target="_blank" class="hover:text-gold" title="Zalo"><i data-lucide="message-square" class="w-5 h-5"></i></a>'); if(c.facebook) cont.push('<a href="'+c.facebook+'" target="_blank" class="hover:text-gold" title="Facebook"><i data-lucide="facebook" class="w-5 h-5"></i></a>'); $('#contactWrap').innerHTML = cont.join('');
      $('#bgVideoSrc').src = ASSETS.BG_VIDEO;
      $('#logoOverlay').innerHTML = '<img src="'+ASSETS.LOGO+'" class="w-10 h-10 md:w-12 md:h-12" alt="">';
    }
    function currentGuestFromURL(guests){ var parts=location.pathname.replace(/\/+$/,'').split('/').filter(Boolean); if(parts.length===2 && parts[0].toLowerCase()==='graduation'){ var name=decodeURIComponent(parts[1]); return guests.find(function(g){ return g.name.toLowerCase()===name.toLowerCase(); }) || null; } return null; }
    function renderPersonalInvite(info, guest){
      var guestName = guest && guest.name || sessionStorage.getItem('guestName') || 'Bạn';
      var guestTitle = guest && guest.title ? guest.title + ' ' : '';
      var inviteMsg = (guest && guest.message && guest.message.trim()) ? guest.message : (info && info.personalInviteDefault || 'Sự hiện diện của bạn là niềm vinh dự lớn nhất!');
      var img = guest && guest.image ? ('/image/graduation/'+guest.image) : (guest && guest.gender && guest.gender.toLowerCase()==='female' ? ASSETS.WOMEN_DEFAULT : ASSETS.MAN_DEFAULT);
      document.getElementById('guestTarget').textContent = 'Dành cho ' + guestTitle + guestName;
      document.getElementById('inviteMessage').textContent = '"' + inviteMsg + '"';
      document.getElementById('inviterName').textContent = '— ' + (info && info.graduateName || 'Tân cử nhân');
      document.getElementById('guestAvatar').src = img;
      document.getElementById('guestNameLabel').textContent = guestTitle + guestName;
      var rsvpBtn = info && info.rsvpLink ? ('<a href="'+info.rsvpLink+'" target="_blank" class="btn btn-navy"><i data-lucide="calendar-check" class="w-5 h-5"></i> Mở trang RSVP</a>') : '';
      document.getElementById('rsvpActions').innerHTML = rsvpBtn + ' <a href="#s1" class="btn btn-gold"><i data-lucide="home" class="w-5 h-5"></i> Về trang đầu</a>';
      try{ lucide.createIcons(); }catch(_){}
    }
    function sendRsvpToFirestore(data){ if(!db) return Promise.resolve(false); return getRsvpsColRef().add({ name:data.name, email:data.email, attending:data.attending, message:data.message, timestamp: new Date().toISOString() }).then(function(){ return true; }).catch(function(){ return false; }); }
    function sendRsvpEmail(data, info){ return fetch('https://hethongthongminh.id.vn/api/rsvp', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ name:data.name, email:data.email, attending:data.attending, message:data.message, eventInfo:{ email: info && info.email || '', graduate: info && info.graduateName || '' } }) }).then(function(res){ var ct=res.headers.get('content-type')||''; if(!res.ok) return false; if(ct.indexOf('application/json')>=0){ return res.json().then(function(j){ return !!(j && (j.success || j.ok)); }); } return res.text().then(function(){ return false; }); }).catch(function(){ return false; }); }
    function initCountdown(){ var cd=document.getElementById('countdown'); if(!cd) return; var target=null; if(INFO && (INFO.datetime || (INFO.date && INFO.time))){ target = INFO.datetime ? new Date(INFO.datetime) : new Date((INFO.date||'')+' '+(INFO.time||'')); } if(!target || isNaN(target)){ cd.textContent=''; return; } function render(ms){ var s=Math.floor(ms/1000); var d=Math.floor(s/86400); var h=Math.floor((s%86400)/3600); var m=Math.floor((s%3600)/60); var sec=s%60; cd.innerHTML='<div class="rounded-xl border bg-white p-4 text-navy"><div class="text-3xl font-bold">'+d+'</div><div class="text-sm">Ngày</div></div><div class="rounded-xl border bg-white p-4 text-navy"><div class="text-3xl font-bold">'+h+'</div><div class="text-sm">Giờ</div></div><div class="rounded-xl border bg-white p-4 text-navy"><div class="text-3xl font-bold">'+m+'</div><div class="text-sm">Phút</div></div><div class="rounded-xl border bg-white p-4 text-navy"><div class="text-3xl font-bold">'+sec+'</div><div class="text-sm">Giây</div></div>'; }
      function tick(){ var now=new Date(); var diff=target-now; if(diff<=0){ cd.innerHTML='<div class="font-semibold">Sự kiện đang diễn ra</div>'; clearInterval(timer); return; } render(diff);} tick(); var timer=setInterval(tick,1000); }
    function bindSimpleRsvp(){ var btnYes=document.getElementById('btnYes'); var btnNo=document.getElementById('btnNo'); var instruction=document.getElementById('instructionCard'); var regretForm=document.getElementById('regretForm'); if(btnYes){ btnYes.addEventListener('click', function(){ if(instruction) instruction.classList.remove('hidden'); if(regretForm) regretForm.classList.add('hidden'); goldBurst(); }); } if(btnNo && regretForm){ btnNo.addEventListener('click', function(){ if(instruction) instruction.classList.add('hidden'); regretForm.classList.remove('hidden'); }); regretForm.addEventListener('submit', function(e){ e.preventDefault(); regretForm.reset(); regretForm.innerHTML='<p class="text-gold font-semibold">Cảm ơn bạn đã gửi lời nhắn 💌</p>'; }); }}
    function bindRsvpForm(info){ var form=document.getElementById('rsvpForm'); if(!form) return; form.addEventListener('submit', function(e){ e.preventDefault(); var name=document.getElementById('rsvpName').value.trim(); var email=document.getElementById('rsvpEmail').value.trim(); var attending=(document.querySelector("input[name='attending']:checked").value==='yes'); var message=document.getElementById('rsvpMessage').value.trim(); if(!name || !email) return; var data={ name:name, email:email, attending:attending, message:message }; sessionStorage.setItem('guestName', name); sendRsvpToFirestore(data).then(function(okFs){ return sendRsvpEmail(data, info).then(function(okMail){ if(okFs && okMail){ goldBurst(); renderPersonalInvite(info, null); document.getElementById('s5').scrollIntoView({ behavior:'smooth' }); } else if(okFs && !okMail){ renderPersonalInvite(info, null); document.getElementById('s5').scrollIntoView({ behavior:'smooth' }); } }); }); }); }
    function setupMusic(info){ var audio=document.getElementById('bgm'); var btn=document.getElementById('musicBtn'); if(!audio || !btn) return; audio.src = info && info.music || ''; var playing=false; var render=function(){ btn.innerHTML = playing ? '<i data-lucide="volume-2" class="w-6 h-6"></i>' : '<i data-lucide="volume-x" class="w-6 h-6"></i>'; try{ lucide.createIcons(); }catch(_){}}; var tryPlay=function(){ audio.play().then(function(){ playing=true; render(); }).catch(function(){ playing=false; render(); }); }; btn.addEventListener('click', function(){ if(!playing) tryPlay(); else { audio.pause(); playing=false; render(); } }); setTimeout(function(){ tryPlay(); }, 600); document.addEventListener('click', function(){ if(!playing) tryPlay(); }, { once: true }); }
    function main(){ loadData().then(function(res){ INFO=res.info; GUESTS=res.guests; if(!INFO){ document.getElementById('loading').innerHTML = '<div class="text-center"><div class="text-2xl font-bold text-red-600">Không thể tải dữ liệu</div><p class="mt-2 text-gray-700">Kiểm tra Firestore hoặc JSON.</p></div>'; return; } document.getElementById('app').classList.remove('hidden'); document.getElementById('loading').classList.add('hidden'); renderEventInfo(INFO); try{ AOS.init({ duration: 400, once: true, offset: 40 }); }catch(_){ } try{ lucide.createIcons(); }catch(_){ } setupMusic(INFO); var btn=document.getElementById('celebrateBtn'); if(btn) btn.addEventListener('click', goldBurst); bindGuestSearch([document.getElementById('guestSearchFormTop'), document.getElementById('guestSearchFormBottom')].filter(Boolean), GUESTS); var cg=currentGuestFromURL(GUESTS); if(cg){ renderPersonalInvite(INFO, cg); updateMeta(INFO, cg); } else { renderPersonalInvite(INFO, null); updateMeta(INFO, null); } bindRsvpForm(INFO); initCountdown(); bindSimpleRsvp(); window.addEventListener('popstate', function(){ var cg=currentGuestFromURL(GUESTS); renderPersonalInvite(INFO, cg); updateMeta(INFO, cg); }); }); }
    window.addEventListener('load', main);
  }

  function runRsvpAdminMain(){
    var INFO=null, RSVPS=[];
    function setup(){ return setupFirebaseCompat(); }
    function loadInfo(){ return getInfoDocRef().get().then(function(s){ if(s.exists) INFO=s.data(); }); }
    function loadInfoJson(){ return fetch(INFO_URL, { cache:'no-store' }).then(function(r){ if(r.ok) return r.json(); return null; }).catch(function(){ return null; }); }
    function loadRsvpsFs(){ return getRsvpsColRef().get().then(function(snap){ return snap.docs.map(function(d){ return d.data(); }); }); }
    function renderTable(data){ var body=document.getElementById('rsvpBody'); body.innerHTML=''; if(!data.length){ body.innerHTML='<tr><td colspan="5" class="text-center py-4 text-gray-500">Không có dữ liệu RSVP</td></tr>'; return; } data.forEach(function(r){ var attend=r.attending ? '✅' : '❌'; var tr=document.createElement('tr'); tr.dataset.id = r.id || ''; tr.dataset.ts = r.timestamp || ''; tr.innerHTML = '<td class="border-t px-3 py-2">'+(r.name||'-')+'</td><td class="border-t px-3 py-2">'+(r.email||'-')+'</td><td class="border-t px-3 py-2 text-center">'+attend+'</td><td class="border-t px-3 py-2">'+(r.message||'')+'</td><td class="border-t px-3 py-2 text-center text-gray-500">'+(new Date(r.timestamp||'').toLocaleString('vi-VN'))+'</td><td class="border-t px-3 py-2 text-center"><button class="delBtn bg-red-600 text-white px-2 py-1 rounded">Xóa</button></td>'; body.appendChild(tr); }); updateStats(data); }
    function updateStats(data){ var total=data.length; var yes=data.filter(function(r){ return r.attending; }).length; var no=total-yes; document.getElementById('countTotal').textContent=String(total); document.getElementById('countYes').textContent=String(yes); document.getElementById('countNo').textContent=String(no); }
    function filterData(){ var status=document.getElementById('filterStatus').value; var search=(document.getElementById('searchBox').value||'').toLowerCase().trim(); var filtered=RSVPS.slice(); if(status!=='all') filtered=filtered.filter(function(r){ return r.attending === (status==='yes'); }); if(search) filtered=filtered.filter(function(r){ return (r.name||'').toLowerCase().includes(search) || (r.email||'').toLowerCase().includes(search); }); renderTable(filtered); }
    function exportCSV(){ if(!RSVPS.length) return; var rows=[["Tên","Email","Tham dự","Lời nhắn","Thời gian"]]; RSVPS.forEach(function(r){ rows.push([ r.name||'', r.email||'', r.attending?'Có':'Không', r.message||'', new Date(r.timestamp||'').toLocaleString('vi-VN') ]); }); var csv=rows.map(function(e){ return e.map(function(x){ return '"'+String(x||'').replace(/"/g,'""')+'"'; }).join(','); }).join('\n'); var blob=new Blob([csv], { type:'text/csv;charset=utf-8;' }); var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='RSVP_List.csv'; a.click(); }
    function doLoginWithKey(keyInput){ return setup().then(function(canFs){ var p = canFs ? loadInfo() : Promise.resolve(); return p.then(function(){ if(!INFO){ return loadInfoJson().then(function(j){ INFO=j; }); } }); }).then(function(){ var key=String(keyInput||'').trim(); if(!INFO || !INFO.adminKey || key!==INFO.adminKey){ alert('Mã quản trị không hợp lệ!'); return false; } document.getElementById('loginPanel').classList.add('hidden'); document.getElementById('dashboard').classList.remove('hidden'); document.getElementById('logoutBtn').classList.remove('hidden'); return setup().then(function(canFs){ if(canFs){ return loadRsvpsFs().then(function(list){ RSVPS=list; renderTable(RSVPS); try{ lucide.createIcons(); }catch(_){ } return true; }); } else { return fetch('/api/rsvp', { method:'GET' }).then(function(res){ if(!res.ok) return []; return res.json().catch(function(){ return { data: [] }; }).then(function(j){ var list = Array.isArray(j && j.data) ? j.data : (Array.isArray(j && j.rsvps) ? j.rsvps : []); RSVPS=list; renderTable(RSVPS); try{ lucide.createIcons(); }catch(_){ } return true; }); }); } }); }); }
    function bind(){ document.getElementById('loginForm').addEventListener('submit', function(e){ e.preventDefault(); var val=document.getElementById('adminKeyInput').value; doLoginWithKey(val); }); var qp=new URLSearchParams(location.search); var urlPass=qp.get('pass')||qp.get('password'); if(urlPass){ var input=document.getElementById('adminKeyInput'); input.value=urlPass; doLoginWithKey(urlPass); } document.getElementById('logoutBtn').addEventListener('click', function(){ location.reload(); }); document.getElementById('filterStatus').addEventListener('change', filterData); document.getElementById('searchBox').addEventListener('input', filterData); document.getElementById('exportBtn').addEventListener('click', exportCSV); document.getElementById('addManualBtn').addEventListener('click', function(){ var fm=document.getElementById('manualForm'); fm.classList.toggle('hidden'); }); document.getElementById('mSubmit').addEventListener('click', function(e){ e.preventDefault(); var data={ name: document.getElementById('mName').value.trim(), email: document.getElementById('mEmail').value.trim(), attending: document.getElementById('mAttend').value==='yes', message: document.getElementById('mMessage').value.trim() }; if(!data.name) return alert('Vui lòng nhập họ tên'); fetch('/api/rsvp', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(data) }).then(function(res){ if(!res.ok) return Promise.reject(); return res.json().catch(function(){ return {}; }); }).then(function(j){ var entry={ name:data.name, email:data.email, attending:data.attending, message:data.message, timestamp: new Date().toISOString(), id: j.id||'' }; RSVPS.push(entry); renderTable(RSVPS); document.getElementById('manualForm').classList.add('hidden'); }).catch(function(){ alert('Thêm thất bại'); }); }); document.getElementById('rsvpBody').addEventListener('click', function(e){ var btn = e.target.closest('.delBtn'); if(!btn) return; var tr = btn.closest('tr'); var id = (tr && tr.dataset && tr.dataset.id)||''; var ts = (tr && tr.dataset && tr.dataset.ts)||''; fetch('/api/rsvp', { method:'DELETE', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ id:id, timestamp:ts }) }).then(function(res){ if(!res.ok){ var status=res.status; var msg='Xóa thất bại'; res.json().then(function(j){ if(j && j.error) msg=j.error; alert(status===501 ? 'Chưa cấu hình KV trên Vercel. Vui lòng thêm KV_REST_API_URL và KV_REST_API_TOKEN.' : msg); }).catch(function(){ alert(msg); }); return; } RSVPS = RSVPS.filter(function(r){ return id ? r.id !== id : r.timestamp !== ts; }); renderTable(RSVPS); }); }); }
    window.addEventListener('load', bind);
  }

  function detectPage(){
    var path = location.pathname.toLowerCase();
    if (path.indexOf('/graduation/graduation_invitation') !== -1 || (document.getElementById('app') && document.getElementById('controls'))) {
      runInvitationMain();
      return;
    }
    if (path.indexOf('/graduation/graduation_invitation_4page_guest_decor') !== -1 || document.getElementById('app')) {
      runInvitation4PageMain();
      return;
    }
    if (path.indexOf('/graduation/rsvp') !== -1 || document.getElementById('dashboard')) {
      runRsvpAdminMain();
      return;
    }
  }

  window.addEventListener('load', function(){
    try{ AOS && AOS.init && AOS.init({ duration: 400, once: true, offset: 40 }); }catch(_){}
    try{ lucide && lucide.createIcons && lucide.createIcons(); }catch(_){}
    var init = setupFirebaseCompat();
    Promise.resolve(init).finally(function(){ detectPage(); });
  });
})();