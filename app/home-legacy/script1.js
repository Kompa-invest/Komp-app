(function(){
  var DEFAULTS = { bg:'#F8F3EA', text:'#1B1913', accent:'#8E72A8' };
  var OPTIONS = {
    bg:    [{hex:'#F8F3EA',label:'Crème'},{hex:'#FBFAF6',label:'Blanc cassé'},{hex:'#EDEAE1',label:'Gris clair'},{hex:'#1B1913',label:'Encre'}],
    text:  [{hex:'#1B1913',label:'Encre'},{hex:'#1F2E27',label:'Vert nuit'},{hex:'#2E1F33',label:'Prune'},{hex:'#F8F3EA',label:'Crème'}],
    accent:[{hex:'#8E72A8',label:'Violet clair'},{hex:'#5B3F72',label:'Violet'},{hex:'#3E5C4E',label:'Vert'},{hex:'#2E4A6B',label:'Bleu nuit'}]
  };
  var root = document.documentElement;
  var current = {};

  function load(){
    try{
      var saved = JSON.parse(localStorage.getItem('kompa-theme') || 'null');
      current = saved || {};
    }catch(e){ current = {}; }
    apply();
  }
  function apply(){
    ['bg','text','accent'].forEach(function(k){
      if(current[k]){ root.style.setProperty('--'+k, current[k]); }
    });
    renderSwatches();
  }
  function set(key, hex){
    current[key] = hex;
    root.style.setProperty('--'+key, hex);
    try{ localStorage.setItem('kompa-theme', JSON.stringify(current)); }catch(e){}
    renderSwatches();
  }
  function reset(){
    current = {};
    ['bg','text','accent'].forEach(function(k){ root.style.removeProperty('--'+k); });
    try{ localStorage.removeItem('kompa-theme'); }catch(e){}
    renderSwatches();
  }
  function activeHex(key){
    return current[key] || DEFAULTS[key];
  }
  function renderSwatches(){
    ['bg','text','accent'].forEach(function(key){
      var row = document.getElementById(key+'Row');
      row.innerHTML = '';
      OPTIONS[key].forEach(function(opt){
        var b = document.createElement('button');
        b.className = 'sw';
        b.style.background = opt.hex;
        b.title = opt.label;
        b.setAttribute('aria-label', opt.label);
        var isActive = activeHex(key).toLowerCase() === opt.hex.toLowerCase();
        b.style.boxShadow = isActive ? ('0 0 0 3px ' + activeHex('accent')) : '0 0 0 1px var(--border)';
        b.addEventListener('click', function(){ set(key, opt.hex); });
        row.appendChild(b);
      });
    });
  }

  var drawer = document.getElementById('drawer');
  var backdrop = document.getElementById('backdrop');
  document.getElementById('settingsBtn').addEventListener('click', function(){
    drawer.classList.add('open'); backdrop.classList.add('open');
  });
  document.getElementById('closeDrawer').addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  function closeDrawer(){ drawer.classList.remove('open'); backdrop.classList.remove('open'); }
  document.getElementById('resetBtn').addEventListener('click', reset);

  load();
})();
