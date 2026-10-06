(function(){
  var IMGS=__IMGS__;
  document.querySelectorAll('img[data-img]').forEach(function(im){var k=im.getAttribute('data-img');if(IMGS[k])im.src=IMGS[k];});
  var pages=['une','marches','n1','n2','n3','n4','n5','mots','glossaire'];
  var pendingTerm=null, pendingJump=null;
  function show(){
    var h=(location.hash||'#une').slice(1); if(pages.indexOf(h)<0) h='une';
    pages.forEach(function(p){var el=document.getElementById('p-'+p); if(el) el.hidden=(p!==h);});
    var tab = /^n\d$/.test(h)?'marches':h;
    document.querySelectorAll('.tabs a').forEach(function(a){a.classList.toggle('on',a.getAttribute('data-tab')===tab);});
    if(pendingJump){var j=document.getElementById(pendingJump); pendingJump=null; if(j){j.scrollIntoView(); return;}}
    if((h==='glossaire'||h==='mots') && pendingTerm){var t=document.querySelector('#p-'+h+' [data-t="'+pendingTerm+'"]'); pendingTerm=null; if(t){t.scrollIntoView({block:'center'}); t.classList.add('flash'); setTimeout(function(){t.classList.remove('flash');},1600); return;}}
    window.scrollTo(0,0);
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('a'); if(!a) return;
    if(a.hasAttribute('data-term')) pendingTerm=a.getAttribute('data-term');
    if(a.hasAttribute('data-mot')) pendingTerm=a.getAttribute('data-mot');
    if(a.hasAttribute('data-jump')){e.preventDefault(); var el=document.getElementById(a.getAttribute('data-jump')); if(el) el.scrollIntoView(); return;}
    if(a.getAttribute('href')===location.hash){e.preventDefault(); show();}
  });
  window.addEventListener('hashchange',show);
  var q=document.getElementById('gq');
  if(q) q.addEventListener('input',function(){
    var v=q.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); var n=0;
    document.querySelectorAll('.term').forEach(function(t){var name=t.getAttribute('data-name').normalize('NFD').replace(/[\u0300-\u036f]/g,''); var ok=!v||name.indexOf(v)>=0||t.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').indexOf(v)>=0; t.hidden=!ok; if(ok)n++;});
    document.querySelectorAll('.gcat').forEach(function(g){g.hidden=!g.querySelector('.term:not([hidden])');});
    document.querySelector('.empty').hidden=n>0;
  });
  show();
})();
