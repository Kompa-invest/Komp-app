import base64, sys, os
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]  # racine du dépôt Komp-app
PUBLIC = len(sys.argv)>1 and sys.argv[1]=='public'
CONFIRMED={'warsh','bourse','eurosign','europiece','raffinerie','bercy'}
sys.path.insert(0,str(HERE))
import charts
from content import E
def b64(p): return base64.b64encode(open(p,'rb').read()).decode()
IMG={k:str(ROOT/"public"/"magazine"/"img"/f"{k}.jpg") for k in ["bercy","raffinerie","bourse","eurosign","europiece","warsh"]}
LOGO=b64(str(ROOT/'public'/'kompa-logo.png'))
CH={"fed":charts.fed(),"bce":charts.bce(),"inflation":charts.inflation(),"dumbbell":charts.dumbbell(),"taux_fr_de":charts.taux_fr_de()}
hl=lambda text,frag: text.replace(frag,f'<mark>{frag}</mark>',1)
def img(key,alt,cls): return f'<img data-img="{key}" alt="{alt}" class="{cls}">'
def compass(a): return f'<svg class="cmp" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5"></circle><g transform="rotate({a} 10 10)"><path class="nb" d="M10 3.5 L12 10 L10 16.5 L8 10 Z"></path><path class="nt" d="M10 3.5 L12 10 L8 10 Z"></path></g><circle class="ctr" cx="10" cy="10" r="1.2"></circle></svg>'
def sec(n,label,note,side,content,a):
    return f'''<section class="sec" id="{{ed}}-s{n}"><div class="rail"><div class="rail-num"><span class="num">0{n}</span>{compass(a)}</div><span class="rail-lab">{label}</span><span class="rail-note">{note}</span>{side}</div><div class="main">{content}</div></section>'''
def details(title,body): return f'<details class="plus"><summary><span>Pour aller plus loin · {title}</span><span class="ic" aria-hidden="true">+</span></summary><div class="plus-body">{body}</div></details>'
def calc_bond():
    return '''<p>Prenons une obligation de 1 000 €, qui verse 3 % par an (30 €) pendant 10 ans. Si les nouvelles obligations rapportent 4 %, un acheteur ne paiera la vôtre qu'au prix qui lui assure aussi 4 % par an.</p>
<div class="trio small"><div><span>Valeur de départ</span><strong>1 000 €</strong></div><div><span>Prix de revente à 4 %</span><strong>≈ 919 €</strong></div><div class="hi"><span>Écart</span><strong>≈ −8 %</strong></div></div>
<p>Plus l'obligation est longue, plus la baisse est forte : c'est ce qu'on appelle la sensibilité aux taux. Si vous gardez l'obligation jusqu'au bout, vous récupérez bien vos 1 000 € : la perte n'existe que si vous vendez avant.</p>
<span class="fine">Exemple illustratif. Calcul Kompa : 10 coupons de 30 € et le remboursement de 1 000 €, actualisés à 4 %.</span>'''
def edition(e):
    ed=e['slug']; n=e['n']
    ok_photo = e['photo'] and (not PUBLIC or e['photo'] in CONFIRMED)
    photo = (f'<figure class="hero">{img(e["photo"],e["photo_alt"],"hero-img")}<figcaption>{e["photo_cap"]}</figcaption></figure>' if ok_photo
             else ('' if PUBLIC else f'<figure class="hero"><div class="ph">{e["photo_cap"]}</div></figure>'))
    reps="".join(f'<div><span class="lab">{a}</span><strong>{b}</strong><span class="dir">{c}</span><span class="txt">{d}</span></div>' for a,b,c,d in e['reps'])
    k,ct,cs,csrc=e['chart']
    chart=f'<figure class="chart"><div class="chart-h"><span class="kick">Le graphique de la semaine</span><strong>{ct}</strong><span>{cs}</span></div>{CH[k]}<figcaption>{csrc}</figcaption></figure>'
    t1,b1=e['plus1']; rdv="".join(f'<div class="rdv"><strong>{d}</strong><span>{t} <em>{s}</em></span></div>' for d,t,s in e['rdv'])
    plus1=details(f"{t1}, et les prochains rendez-vous", f'<strong class="ph3">{t1}</strong>'+"".join(f'<p>{p}</p>' for p in b1.split("|"))+'<strong class="ph3">Les prochains rendez-vous</strong><p>Des dates, pas des prévisions.</p>'+rdv)
    side3=(f'{img(e["person"][0],e["person"][1],"person")}<span class="rail-note">{e["person"][2]}</span>' if e['person'] else '')
    vents="".join(f'<p class="body">{hl(p,e["vents_hl"])}</p>' for p in e['vents'])
    ex="".join(f'<div{" class=hi" if i==2 else ""}><span>{a}</span><strong>{b}</strong><em>{c}</em></div>' for i,(a,b,c) in enumerate(e['ex']))
    plus2=details(e['plus2'][0].lower()[0:1]+e['plus2'][0][1:], calc_bond()) if e['plus2'] else ''
    mw,mn,md=e['mot']
    prev_=E.get(n-1); next_=E.get(n+1)
    pn=(f'<a href="#{prev_["slug"]}">← N°{n-1} · {prev_["short"]}</a>' if prev_ else '<span></span>')+(f'<a href="#{next_["slug"]}">N°{n+1} · {next_["short"]} →</a>' if next_ else '<span></span>')
    s=f'''<div class="page" id="p-{ed}" hidden>
<article class="edition">
<header class="ed-head"><div class="rail"><span class="rail-lab muted">Édition</span><span class="big-n">N°{n}</span></div>
<div class="main"><span class="kick">Marchés · {e['week']}</span><h1>{e['title']}</h1><p class="chapo">{e['chapo']}</p><span class="meta">{e['read']} de lecture · {e['theme']}{(' · '+e['note']) if e['note'] else ''}</span></div></header>
<nav class="somm" aria-label="Sommaire de l'édition"><span class="rail-lab muted">Au sommaire</span><div><a href="#{ed}" data-jump="{ed}-s1"><b>01</b> Le cap</a><a href="#{ed}" data-jump="{ed}-s2"><b>02</b> Les repères</a><a href="#{ed}" data-jump="{ed}-s3"><b>03</b> Les vents dominants</a><a href="#{ed}" data-jump="{ed}-s4"><b>04</b> Cap sur votre épargne</a><a href="#{ed}" data-jump="{ed}-s5"><b>05</b> Le mot de la semaine</a></div></nav>
{photo}
{sec(1,"Le cap","Si vous ne lisez qu'une chose.","",f'<p class="cap">{hl(e["cap"],e["cap_hl"])}</p>',0)}
{sec(2,"Les repères","Les trois chiffres pour situer la semaine.","",f'<div class="reps">{reps}</div>',72)}
{sec(3,"Les vents dominants","Les forces qui ont fait bouger les marchés.",side3,vents+chart+plus1,144)}
{sec(4,"Cap sur votre épargne","Ce que ça change, concrètement, pour un portefeuille.","",f'<p class="body">{hl(e["epargne"],e["epargne_hl"])}</p><div class="trio">{ex}</div><span class="fine">{e["ex_note"]}</span>'+plus2,216)}
{sec(5,"Le mot de la semaine","Chaque semaine, un mot de l'actualité.","",f'<div class="mot"><div class="mot-h"><strong>{mw}</strong><em>{mn}</em></div><p>{md}</p><a href="#mots" data-mot="{mw}">Tous les mots de la semaine →</a></div>',288)}
<footer class="ed-foot"><div class="rail"><span class="rail-lab">Faire le point</span><span class="rail-note">En une phrase.</span></div>
<div class="main"><p class="point">{e['point']}</p><div class="escale"><span>Prochaine escale : <b>{e['next_']}</b></span><em>À lundi prochain.</em></div>
<nav class="prevnext" aria-label="Autres éditions">{pn}</nav>
<span class="fine">Sources : {e['sources']}. Kompa fournit de l'information, pas de conseil personnalisé.</span></div></footer>
</article></div>'''
    return s.replace('{ed}',ed)

def une():
    e=E[5]
    reps="".join(f'<div><strong>{a}</strong><span>{d}</span></div>' for a,_,_,d in e['reps'])
    prev="".join(f'''<a class="pcard" href="#{E[k]['slug']}">{(img(E[k]['photo'],E[k]['photo_alt'],'thumb') if (not PUBLIC or E[k]['photo'] in CONFIRMED) else f'<span class="thumb thumb-n" aria-hidden="true">N°{k}</span>')}<span class="kick">N°{k} · {E[k]['week'].replace('Semaine du ','')}</span><strong>{E[k]['title']}</strong></a>''' for k in (4,3,2))
    bases=[("Risque","Plus un placement peut rapporter, plus il peut baisser.","#glossaire","Risque"),("Diversification","Pas tous vos œufs dans des paniers qui se ressemblent.","#glossaire","Diversification"),("Frais","Un petit pourcentage qui pèse lourd sur la durée.","#glossaire","Frais courants"),("Intérêts composés","Avec le calculateur, pour le voir de vos yeux.","/interets-composes","")]
    bh="".join(f'<a class="bcard" href="{h}"{f" data-term=\"{t}\"" if t else ""}><strong>{a}</strong><span>{b}</span></a>' for a,b,h,t in bases)
    return f'''<div class="page" id="p-une" hidden>
<div class="une">
<article class="lead"><span class="kick">Marchés · L'édition de la semaine · N°5</span><h1><a class="lead-link" href="#n5">{e['title']}</a></h1><p class="chapo">{e['chapo']}</p>
<figure class="chart mini"><div class="chart-h"><strong>{e['chart'][1]}</strong><span>{e['chart'][2]}</span></div>{CH[e['chart'][0]]}</figure>
<div class="lead-reps">{reps}</div><a class="lead-cta" href="#n5"><span class="lc-l"><b>Lire l'édition N°5 en entier</b><em>Le cap, les repères, les vents dominants, votre épargne et le mot de la semaine</em></span><span class="lc-r">4 min <span class="arr" aria-hidden="true">→</span></span></a></article>
<aside class="side"><section class="side-mot"><span class="kick">Le mot de la semaine</span><strong>{e['mot'][0]}</strong><p>{e['mot'][2].split('. ')[0]}.</p><a href="#mots" data-mot="{e['mot'][0]}">Tous les mots de la semaine →</a></section>
<section class="news"><strong>Recevez l'édition chaque lundi</strong><span>Un e-mail, quatre minutes, sans jargon.</span><label for="nl" class="sr">Votre e-mail</label><input id="nl" type="email" placeholder="Votre e-mail" disabled><button type="button" disabled>Bientôt disponible</button></section></aside>
</div>
<section class="block"><div class="block-h"><h2>Les éditions précédentes</h2><a href="#marches">Toutes les éditions →</a></div><div class="pgrid">{prev}</div></section>
<section class="block"><div class="block-h"><h2>Les bases, à lire avant de commencer</h2><a href="#glossaire">Tout le glossaire →</a></div><div class="bgrid">{bh}</div></section>
</div>'''

def marches():
    e=E[5]
    rows="".join(f'<a class="row" href="#{E[k]["slug"]}"><span class="d">{E[k]["week"].replace("Semaine du ","")}</span><span class="nn">N°{k}</span><strong>{E[k]["title"]}</strong><span class="t">{E[k]["theme"]}</span></a>' for k in (4,3,2,1))
    return f'''<div class="page" id="p-marches" hidden>
<header class="rub-h"><h1>Marchés</h1><p>Chaque lundi, les mouvements de la semaine précédente expliqués : pas seulement de combien ça a bougé, mais pourquoi, et ce que ça change pour votre épargne.</p></header>
<a class="latest" href="#n5"><div><span class="kick">Dernière édition · N°5 · {e['week'].replace('Semaine du ','')}</span><strong>{e['title']}</strong><span class="chapo">{e['chapo']}</span><span class="more">Lire →</span></div>{img(e["photo"],e["photo_alt"],"latest-img") if (e["photo"] and (not PUBLIC or e["photo"] in CONFIRMED)) else '<span class="latest-n" aria-hidden="true">N°5</span>'}</a>
<section class="block"><h2 class="lab-h">Les éditions précédentes</h2>{rows}</section></div>'''

sys.path.insert(0,str(HERE))
from glossary import GLOSS
def glossaire():
    secs=""
    for cat,terms in GLOSS:
        items="".join(f'<div class="term" data-name="{t.lower()}" data-t="{t}"><strong>{t}</strong><p>{d}</p></div>' for t,d in terms)
        secs+=f'<section class="gcat"><h2 class="gcat-h">{cat}</h2><div class="terms">{items}</div></section>'
    return f"""<div class="page" id="p-glossaire" hidden>
<header class="rub-h"><h1>Glossaire</h1><p>Les 30 notions à connaître pour comprendre ce que l'on possède et ce qu'on vous propose. Des définitions courtes, sans jargon.</p></header>
<div class="gl-top"><div><label for="gq" class="sr">Chercher un terme</label><input id="gq" type="search" placeholder="Chercher un terme : ETF, PEA, frais…"></div>
<a class="gl-mot" href="#mots"><span class="kick">Rubrique</span><strong>Les mots de la semaine</strong><span>Un mot de l'actualité chaque lundi, avec l'édition où il a été employé.</span></a></div>
{secs}<p class="empty" hidden>Aucun terme ne correspond. Essayez un autre mot.</p></div>"""

def mots():
    cards=""
    for k in (5,4,3,2,1):
        e=E[k]; w,n,d=e['mot']
        cards+=f"""<article class="mword" data-t="{w}"><div class="mw-meta"><span class="big">N°{k}</span><span>{e['week'].replace('Semaine du ','')}</span></div>
<div class="mw-body"><div class="mot-h"><strong>{w}</strong><em>{n}</em></div><p>{d}</p><a href="#{e['slug']}">Lire l'édition N°{k} où il a été employé →</a></div></article>"""
    return f"""<div class="page" id="p-mots" hidden>
<header class="rub-h"><h1>Le mot de la semaine</h1><p>Chaque lundi, un mot croisé dans l'actualité, expliqué simplement. Les voici tous, du plus récent au plus ancien, avec l'édition où il a été employé.</p></header>
<div class="mwords">{cards}</div></div>"""

CSS=open(HERE/'style.css').read()
IMGMAP=('{'+",".join(f'"{k}":"/magazine/img/{k}.jpg"' for k in sorted(CONFIRMED))+'}') if PUBLIC else ('{'+",".join(f'"{k}":"data:image/jpeg;base64,{b64(v)}"' for k,v in IMG.items() if os.path.exists(v))+'}')
JS=open(HERE/'app.js').read().replace('__IMGS__',IMGMAP)
H='' if PUBLIC else 'https://kompa-invest.fr'
LOGOSRC='/kompa-logo.png' if PUBLIC else 'data:image/png;base64,'+LOGO
html=f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light">
<title>Le Magazine · Kompa</title>
<meta name="description" content="Chaque lundi, les mouvements des marchés de la semaine expliqués en langage clair, et ce que ça change pour votre épargne. Information, jamais de conseil.">
<link rel="icon" href="/favicon.ico">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<style>{CSS}</style>
</head>
<body>
<header class="site"><a class="logo" href="{H}/"><img src="{LOGOSRC}" alt="Kompa"></a>
<nav class="site-nav" aria-label="Kompa"><a href="{H}/#decodeur-tool">Décodeur</a><a href="{H}/#second-opinion-tool">Second Opinion</a><a href="{H}/#xray-tool">Mes investissements</a><a href="#une" class="on">Le Magazine</a></nav>
<a class="btn" href="{H}/portfolio">Mon portefeuille</a></header>
<div class="mast"><div class="mast-line"><span>Lundi 5 octobre 2026</span><span>N°5</span></div>
<a class="mast-logo" href="#une"><img src="{LOGOSRC}" alt="Kompa"><span>Le Magazine</span></a>
<nav class="tabs" aria-label="Rubriques du Magazine"><a href="#une" data-tab="une">À la une</a><a href="#marches" data-tab="marches">Marchés</a><a href="#mots" data-tab="mots">Le mot de la semaine</a><a href="#glossaire" data-tab="glossaire">Glossaire</a></nav></div>
<main>
{une()}
{marches()}
{"".join(edition(E[k]) for k in (5,4,3,2,1))}
{mots()}
{glossaire()}
</main>
<footer class="site-foot"><span>Kompa fournit de l'information. Kompa ne formule pas de conseil personnalisé et ne gère pas votre argent.</span></footer>
<script>{JS}</script>
</body>
</html>'''
out=str(ROOT/'public'/'magazine'/'index.html') if PUBLIC else str(HERE/'apercu-magazine.html')
os.makedirs(os.path.dirname(out),exist_ok=True)
open(out,'w').write(html)
print(len(html))
