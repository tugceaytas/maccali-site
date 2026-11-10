/* MACCALI 11.11 kampanya katmani
   Tek dosya. Sayfalara dokunmadan topbar, ana sayfa bandi, kart rozeti ve sepette fiyat ekler.
   12 Kasim 00:00 (TR) sonrasi kendiliginden kapanir. Kapatmak icin AKTIF=false. */
(function(){
  var AKTIF = true;
  var ORAN = 11;                                   // yuzde
  var BAS = new Date('2026-11-11T00:00:00+03:00');
  var BIT = new Date('2026-11-12T00:00:00+03:00');
  var GOSTER = new Date('2026-11-09T00:00:00+03:00'); // on duyuru baslangici
  var WA = 'https://wa.me/905301213842';

  var now = new Date();
  if(!AKTIF || now < GOSTER || now >= BIT) return;
  var d = document.documentElement; d.classList.add('k1111');

  function tl(n){ return '₺' + Math.round(n).toLocaleString('tr-TR'); }
  function sp(f){ return f * (100-ORAN) / 100; }
  function pad(n){ return (n<10?'0':'') + n; }
  function kalan(){
    var t = new Date(), hedef = t < BAS ? BAS : BIT, ms = Math.max(0, hedef - t);
    var s = Math.floor(ms/1000);
    return { bas: t >= BAS, g: Math.floor(s/86400), sa: Math.floor(s%86400/3600), dk: Math.floor(s%3600/60), sn: s%60, bitti: t >= BIT };
  }
  var kok = (document.querySelector('link[href$="assets/site.css"]')||{}).getAttribute ?
            document.querySelector('link[href$="assets/site.css"]').getAttribute('href').replace('assets/site.css','') : '';

  function topbar(){
    var w = document.querySelector('.topbar .wrap'); if(!w || w.querySelector('.k-tb')) return;
    var el = document.createElement('a');
    el.className = 'k-tb'; el.href = kok + 'index.html#k1111';
    el.innerHTML = '<b>11.11</b><span>Sepette %' + ORAN + ' indirim</span><i>·</i><span class="k-tb-cd" data-k-cd></span>';
    w.insertBefore(el, w.firstChild);
  }

  function band(){
    var main = document.getElementById('main'); var hero = document.getElementById('hero');
    if(!main || !hero || document.getElementById('k1111')) return;
    var s = document.createElement('section');
    s.className = 'k-band'; s.id = 'k1111'; s.setAttribute('aria-label','11.11 indirim günü');
    s.innerHTML =
      '<div class="wrap k-band-in">' +
        '<div class="k-num" aria-hidden="true">11.11</div>' +
        '<div class="k-txt">' +
          '<p class="k-eyebrow" data-k-durum></p>' +
          '<h2>11.11 indirim günü. Erkek giyimde sepette %' + ORAN + '.</h2>' +
          '<p>Polo yaka tişört, sweatshirt, kazak ve büyük beden. Tüm ürünlerde indirim sepette uygulanır. Siparişte "11.11" yazman yeterli.</p>' +
          '<div class="k-ctas"><a class="k-btn" href="#coksatan">11.11 Seçkisi</a><a class="k-lk" href="katalog.html">Tüm ürünler</a></div>' +
        '</div>' +
        '<div class="k-cd" data-k-blok>' +
          '<div><b data-k="sa">00</b><span>Saat</span></div>' +
          '<div><b data-k="dk">00</b><span>Dakika</span></div>' +
          '<div><b data-k="sn">00</b><span>Saniye</span></div>' +
        '</div>' +
      '</div>';
    main.insertBefore(s, main.firstChild);
    var h = document.querySelector('#coksatan .eyebrow');
    if(h) h.textContent = '11.11 Seçkisi';
  }

  function kart(c){
    if(c.__k) return; c.__k = 1;
    var m = c.querySelector('.p-media, .frame, .s-media') || c.querySelector('a');
    if(m && !m.querySelector('.k-chip')){
      var ch = document.createElement('span'); ch.className = 'k-chip'; ch.textContent = '11.11';
      if(getComputedStyle(m).position === 'static') m.style.position = 'relative';
      m.appendChild(ch);
    }
    var f = parseFloat(c.getAttribute('data-mc-fiyat'));
    var pr = c.querySelector('.p-price, .s-price');
    if(f && pr && !c.querySelector('.k-sp')){
      var e = document.createElement('span'); e.className = 'k-sp';
      e.innerHTML = 'Sepette <b>' + tl(sp(f)) + '</b>';
      var row = c.querySelector('.p-row');
      (row && row.parentNode ? row.parentNode : pr.parentNode).insertBefore(e, row ? row.nextSibling : pr.nextSibling);
    }
  }
  function kartlar(r){ (r||document).querySelectorAll('.p-card, .s-card').forEach(kart); }

  function pdp(){
    var p = document.getElementById('pdpPrice'); if(!p) return;
    var tek = function(){
      var v = parseFloat((p.textContent||'').replace(/[^\d,]/g,'').replace(',','.'));
      var x = document.getElementById('kPdp');
      if(!v){ return; }
      if(!x){
        x = document.createElement('p'); x.id = 'kPdp'; x.className = 'k-pdp';
        p.parentNode.parentNode.insertBefore(x, p.parentNode.nextSibling);
      }
      x.innerHTML = '<b>11.11</b> Sepette <strong>' + tl(sp(v)) + '</strong><span>%' + ORAN + ' indirim, 11 Kasım boyunca</span>';
    };
    tek(); new MutationObserver(tek).observe(p, {childList:true, characterData:true, subtree:true});
    var b = document.getElementById('buyBtn');
    if(b){
      var fix = function(){
        if(b.href.indexOf('11.11') > -1) return;
        b.href = b.href + (b.href.indexOf('?text=') > -1 ? ' (11.11 sepette %' + ORAN + ')' : '?text=11.11 sepette %' + ORAN);
      };
      fix(); new MutationObserver(fix).observe(b, {attributes:true, attributeFilter:['href']});
    }
  }

  function tik(){
    var k = kalan();
    if(k.bitti){ d.classList.remove('k1111'); return; }
    var saat = k.g*24 + k.sa;
    var yazi = (k.bas ? 'Bitmesine ' : 'Başlamasına ') + pad(saat) + ':' + pad(k.dk) + ':' + pad(k.sn);
    document.querySelectorAll('[data-k-cd]').forEach(function(e){ e.textContent = yazi; });
    document.querySelectorAll('[data-k-durum]').forEach(function(e){ e.textContent = k.bas ? 'Bugün 11 Kasım. Kampanya sürüyor.' : 'Gece yarısı başlıyor.'; });
    var set = function(n,v){ document.querySelectorAll('[data-k="'+n+'"]').forEach(function(e){ e.textContent = pad(v); }); };
    set('sa', saat); set('dk', k.dk); set('sn', k.sn);
    document.querySelectorAll('[data-k-blok]').forEach(function(e){ e.setAttribute('aria-label', yazi); });
  }

  function basla(){
    topbar(); band(); kartlar(); pdp(); tik();
    setInterval(tik, 1000);
    new MutationObserver(function(ms){ ms.forEach(function(m){ m.addedNodes.forEach(function(n){
      if(n.nodeType !== 1) return;
      if(n.matches && n.matches('.p-card, .s-card')) kart(n); else if(n.querySelectorAll) kartlar(n);
    }); }); }).observe(document.body, {childList:true, subtree:true});
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();
})();
