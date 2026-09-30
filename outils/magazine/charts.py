FONT='font-family="IBM Plex Sans, sans-serif"'
def f(v): return f"{v:.1f}"
def staircase(uid, steps, end, ymin, ymax, yticks, years, hike_from, labels, bubble, aria):
    """steps: [(month, value)] month index from Jan 2024; hike_from: index in steps where highlighted segment starts"""
    W,H=896,300; x0,x1=56,880; y0,y1=36,250
    X=lambda m: x0+m/end*(x1-x0); Y=lambda v: y0+(ymax-v)/(ymax-ymin)*(y1-y0)
    def path(seq, last_to_end):
        d=f"M{f(X(seq[0][0]))},{f(Y(seq[0][1]))}"
        for i in range(1,len(seq)):
            d+=f" L{f(X(seq[i][0]))},{f(Y(seq[i-1][1]))} L{f(X(seq[i][0]))},{f(Y(seq[i][1]))}"
        if last_to_end: d+=f" L{f(X(end))},{f(Y(seq[-1][1]))}"
        return d
    base=steps[:hike_from]; hk=steps[hike_from-1:]
    d_base=path(base,False)+f" L{f(X(steps[hike_from][0]))},{f(Y(base[-1][1]))}"
    d_hk=f"M{f(X(steps[hike_from][0]))},{f(Y(base[-1][1]))}"
    for i in range(hike_from,len(steps)):
        prev=steps[i-1][1]
        if i>hike_from: d_hk+=f" L{f(X(steps[i][0]))},{f(Y(prev))}"
        d_hk+=f" L{f(X(steps[i][0]))},{f(Y(steps[i][1]))}"
    d_hk+=f" L{f(X(end))},{f(Y(steps[-1][1]))}"
    area=path(steps,True)+f" L{f(X(end))},{f(y1)} L{f(X(0))},{f(y1)} Z"
    o=[f'<svg viewBox="0 0 {W} {H}" width="100%" role="img" aria-label="{aria}">',
       f'<defs><linearGradient id="g{uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E72A8" stop-opacity="0.28"></stop><stop offset="1" stop-color="#8E72A8" stop-opacity="0.02"></stop></linearGradient></defs>']
    if labels.get('band'):
        a,b,t=labels['band']
        o.append(f'<rect x="{f(X(a))}" y="{y0-22}" width="{f(X(b)-X(a))}" height="{y1-y0+22}" fill="#8E72A8" fill-opacity="0.05"></rect>')
        o.append(f'<text x="{f((X(a)+X(b))/2)}" y="{y0-8}" text-anchor="middle" font-size="12" fill="#6E5690" font-weight="600" {FONT}>{t}</text>')
    for v,l in yticks:
        o.append(f'<line x1="{x0}" y1="{f(Y(v))}" x2="{x1}" y2="{f(Y(v))}" stroke="#D6CCB6" stroke-dasharray="2 5"></line>')
        o.append(f'<text x="{x0-12}" y="{f(Y(v)+4)}" text-anchor="end" font-size="12" fill="#8A8370" {FONT}>{l}</text>')
    o.append(f'<line x1="{x0}" y1="{y1}" x2="{x1}" y2="{y1}" stroke="#B7B09B"></line>')
    for q in range(0,int(end)+1,3):
        o.append(f'<line x1="{f(X(q))}" y1="{y1}" x2="{f(X(q))}" y2="{y1+(7 if q%12==0 else 4)}" stroke="#B7B09B"></line>')
    for m,l in years:
        o.append(f'<text x="{f(X(m))}" y="{y1+24}" font-size="13" font-weight="600" fill="#3E3A31" {FONT}>{l}</text>')
    o.append(f'<path d="{area}" fill="url(#g{uid})"></path>')
    o.append(f'<path d="{d_base}" fill="none" stroke="#8E72A8" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"></path>')
    o.append(f'<path d="{d_hk}" fill="none" stroke="#4F3C69" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"></path>')
    sm,sv,st=labels['start']
    o.append(f'<circle cx="{f(X(sm))}" cy="{f(Y(sv))}" r="4" fill="#8E72A8"></circle>')
    o.append(f'<text x="{f(X(sm)+10)}" y="{f(Y(sv)-10)}" font-size="13" fill="#3E3A31" {FONT}>{st}</text>')
    lm,lv,lt=labels['low']
    o.append(f'<text x="{f(X(lm))}" y="{f(Y(lv)-10)}" text-anchor="middle" font-size="13" fill="#3E3A31" {FONT}>{lt}</text>')
    px,py=X(steps[-1][0]),Y(steps[-1][1])
    o.append(f'<circle cx="{f(px)}" cy="{f(py)}" r="11" fill="#4F3C69" fill-opacity="0.15"></circle><circle cx="{f(px)}" cy="{f(py)}" r="5.5" fill="#4F3C69" stroke="#FFFFFF" stroke-width="2"></circle>')
    bw,bh=196,50; bx=min(px-bw+24, x1-bw); by=py-bh-26
    b1,b2=bubble
    o.append(f'<rect x="{f(bx)}" y="{f(by)}" width="{bw}" height="{bh}" rx="10" fill="#4F3C69"></rect>')
    o.append(f'<path d="M{f(px-8)},{f(by+bh)} L{f(px)},{f(by+bh+9)} L{f(px+8)},{f(by+bh)} Z" fill="#4F3C69"></path>')
    o.append(f'<text x="{f(bx+14)}" y="{f(by+21)}" font-size="12" fill="#E7DDF0" {FONT}>{b1}</text>')
    o.append(f'<text x="{f(bx+14)}" y="{f(by+40)}" font-size="15" font-weight="600" fill="#FFFFFF" {FONT}>{b2}</text>')
    o.append('</svg>')
    return "\n".join(o)

def fed():
    return staircase("fed",[(0,5.50),(8.6,5.00),(10.2,4.75),(11.6,4.50),(20.55,4.25),(21.95,4.00),(23.3,3.75),(32.5,4.00)],33.5,3.5,5.75,
        [(4,"4 %"),(5,"5 %")],[(0,"2024"),(12,"2025"),(24,"2026")],7,
        {"band":(8.6,23.3,"Cycle de baisses : −1,75 point"),"start":(0,5.5,"5,5 % début 2024"),"low":(27.9,3.75,"3,75 %, le plus bas (déc. 2025)")},
        ("16 sept. 2026","4 %  ·  +0,25 point"),
        "Le taux de la Fed reste à 5,5 % jusqu'en septembre 2024, baisse par étapes jusqu'à 3,75 % fin 2025, puis remonte à 4 % le 16 septembre 2026.")

def bce():
    return staircase("bce",[(0,4.00),(5.2,3.75),(8.6,3.50),(9.75,3.25),(11.6,3.00),(13.15,2.75),(14.4,2.50),(15.75,2.25),(17.35,2.00),(29.35,2.25),(32.3,2.50)],33.5,1.5,4.25,
        [(2,"2 %"),(3,"3 %"),(4,"4 %")],[(0,"2024"),(12,"2025"),(24,"2026")],9,
        {"band":(5.2,17.35,"Cycle de baisses : −2 points"),"start":(0,4.0,"4 % début 2024"),"low":(23.3,2.0,"2 %, le plus bas (juin 2025 à juin 2026)")},
        ("10 sept. 2026","2,50 %  ·  +0,25 point"),
        "Le taux de dépôt de la BCE baisse de 4 % début 2024 à 2 % en juin 2025, reste stable un an, puis remonte à 2,25 % en juin 2026 et 2,50 % le 10 septembre 2026.")

def inflation():
    W,H=896,230; x0,x1=320,860; mx=16
    X=lambda v: x0+v/mx*(x1-x0)
    rows=[("Énergie","14,3 %",14.3,"#4F3C69"),("Ensemble des prix","3,3 %",3.3,"#8E72A8"),("Hors énergie, alimentation, alcool et tabac","2,4 %",2.4,"#C9BCDB")]
    o=[f'<svg viewBox="0 0 {W} {H}" width="100%" role="img" aria-label="En août, l\'inflation de la zone euro atteint 3,3 % au total, 14,3 % pour l\'énergie et 2,4 % hors énergie, alimentation, alcool et tabac, contre un objectif de 2 %.">']
    for i,(lab,val,v,c) in enumerate(rows):
        y=30+i*62
        o.append(f'<text x="{x0-16}" y="{y+22}" text-anchor="end" font-size="14" fill="#1B1913" {FONT}>{lab}</text>')
        o.append(f'<rect x="{x0}" y="{y}" width="{f(X(v)-x0)}" height="32" rx="6" fill="{c}"></rect>')
        o.append(f'<text x="{f(X(v)+10)}" y="{y+22}" font-size="15" font-weight="600" fill="#1B1913" {FONT}>{val}</text>')
    xo=X(2)
    o.append(f'<line x1="{f(xo)}" y1="14" x2="{f(xo)}" y2="{H-24}" stroke="#1B1913" stroke-width="1.5" stroke-dasharray="4 4"></line>')
    o.append(f'<text x="{f(xo+8)}" y="{H-8}" font-size="12" fill="#1B1913" font-weight="600" {FONT}>Objectif de la BCE : 2 %</text>')
    o.append('</svg>'); return "\n".join(o)

def dumbbell():
    W,H=896,250; x0,x1=300,840
    o=[f'<svg viewBox="0 0 {W} {H}" width="100%" role="img" aria-label="En septembre, l\'indice PMI de la zone euro passe de 52,0 à 53,1, au-dessus du seuil de 50 ; le climat des affaires en France recule de 98 à 96, sous sa moyenne de 100.">']
    rows=[("Activité, zone euro","Indice PMI composite",48,56,50,"seuil de 50",52.0,53.1,"52,0","53,1",60),
          ("Climat des affaires, France","Indicateur Insee",92,102,100,"moyenne de 100",98,96,"98","96",160)]
    for lab,sub,a,b,ref,refl,v1,v2,l1,l2,y in rows:
        X=lambda v: x0+(v-a)/(b-a)*(x1-x0)
        o.append(f'<text x="{x0-24}" y="{y-2}" text-anchor="end" font-size="15" font-weight="600" fill="#1B1913" {FONT}>{lab}</text>')
        o.append(f'<text x="{x0-24}" y="{y+18}" text-anchor="end" font-size="12" fill="#5E584C" {FONT}>{sub}</text>')
        o.append(f'<line x1="{x0}" y1="{y}" x2="{x1}" y2="{y}" stroke="#E4DCC9" stroke-width="2"></line>')
        o.append(f'<line x1="{f(X(ref))}" y1="{y-26}" x2="{f(X(ref))}" y2="{y+26}" stroke="#1B1913" stroke-dasharray="3 4"></line>')
        o.append(f'<text x="{f(X(ref))}" y="{y+42}" text-anchor="middle" font-size="11" fill="#5E584C" {FONT}>{refl}</text>')
        o.append(f'<line x1="{f(X(v1))}" y1="{y}" x2="{f(X(v2))}" y2="{y}" stroke="#4F3C69" stroke-width="4"></line>')
        o.append(f'<circle cx="{f(X(v1))}" cy="{y}" r="7" fill="#FFFFFF" stroke="#8E72A8" stroke-width="2.5"></circle>')
        o.append(f'<circle cx="{f(X(v2))}" cy="{y}" r="8" fill="#4F3C69"></circle>')
        o.append(f'<text x="{f(X(v1))}" y="{y-16}" text-anchor="middle" font-size="12" fill="#5E584C" {FONT}>août {l1}</text>')
        o.append(f'<text x="{f(X(v2))}" y="{y-16}" text-anchor="middle" font-size="13" font-weight="600" fill="#4F3C69" {FONT}>sept. {l2}</text>')
    o.append('</svg>'); return "\n".join(o)
