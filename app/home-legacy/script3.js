(function(){
  var FUNDS = [
    {
      id:'world', isin:'IE00B4L5Y983', name:'iShares Core MSCI World UCITS ETF',
      match:['world','msci world','monde','ie00b4l5y983'],
      ter:0.20, replication:'Physique',
      geo:[{c:'États-Unis',p:72},{c:'Japon',p:5},{c:'Royaume-Uni',p:4},{c:'Reste',p:19}],
      whatIsIt:"Un fonds qui réplique un panier de plus de 1 500 grandes entreprises des pays développés, en détenant réellement les actions sous-jacentes.",
      gain:"Le fonds gagne de la valeur quand les entreprises qu'il détient, très majoritairement américaines, voient leur cours monter ou versent des dividendes réinvestis.",
      lose:"Le fonds perd de la valeur si les marchés actions baissent, en particulier le marché américain et le secteur technologique, qui pèsent le plus dans sa composition.",
      risks:["Risque actions (le cours peut baisser)","Concentration géographique : 72 % États-Unis malgré le nom \u00ab World \u00bb","Risque de change (exposition au dollar)"],
      monte:["Les grandes entreprises technologiques américaines publient de bons résultats","Les banques centrales baissent leurs taux d'intérêt","Le dollar se renforce face à l'euro"],
      baisse:["Une récession touche les États-Unis","Les taux d'intérêt remontent fortement","Le dollar s'affaiblit face à l'euro"],
      pros:["Diversifié sur plus de 1 500 entreprises en une seule ligne","Frais bas (0,20 % par an)","Réplication physique : le fonds détient réellement les actions"],
      cons:["Très concentré sur les États-Unis malgré son nom","Aucune exposition aux marchés émergents (Chine, Inde, Brésil)","Dépendant du secteur technologique"],
      liquidite:"Coté en bourse, vous pouvez acheter ou vendre vos parts n'importe quel jour d'ouverture des marchés.",
      notThis:"Ce n'est pas un fonds équilibré entre les grandes régions du monde malgré son nom : les marchés émergents en sont totalement absents."
    },
    {
      id:'sp500', isin:'IE00B5BMR087', name:'iShares Core S&P 500 UCITS ETF',
      match:['s&p 500','s&p500','sp500','500 americain','ie00b5bmr087','cspx'],
      ter:0.07, replication:'Physique',
      geo:[{c:'États-Unis',p:100}],
      whatIsIt:"Un fonds qui réplique les 500 plus grandes entreprises cotées aux États-Unis, en détenant réellement leurs actions.",
      gain:"Le fonds gagne de la valeur quand les grandes entreprises américaines cotées voient leur cours monter.",
      lose:"Le fonds perd de la valeur si le marché actions américain baisse, en particulier si le secteur technologique, qui représente plus d'un tiers du fonds, recule.",
      risks:["Risque actions","Concentration à 100 % sur un seul pays, les États-Unis","Poids important du secteur technologique (environ 38 %)"],
      monte:["Les entreprises technologiques américaines publient de bons résultats","L'économie américaine accélère","Les taux américains baissent"],
      baisse:["Une récession touche spécifiquement les États-Unis","Le secteur technologique traverse une correction","Le dollar s'affaiblit fortement face à l'euro"],
      pros:["Un des ETF les moins chers du marché (0,07 % par an)","Très liquide, encours considérable","Expose à des entreprises parmi les plus rentables au monde"],
      cons:["Aucune diversification géographique, 100 % États-Unis","Pas d'exposition à l'Europe, au Japon ou aux marchés émergents","Sensible aux mouvements du dollar"],
      liquidite:"Très liquide, coté en bourse, achat et vente possibles chaque jour d'ouverture des marchés.",
      notThis:"Ce n'est pas un fonds mondial malgré sa popularité : il n'investit que dans des entreprises américaines, aucune autre région n'est représentée."
    },
    {
      id:'nasdaq', isin:'LU1681038243', name:'Amundi Nasdaq-100 UCITS ETF',
      match:['nasdaq','nasdaq 100','nasdaq-100','lu1681038243'],
      ter:0.23, replication:'Synthétique',
      geo:[{c:'États-Unis',p:100}],
      whatIsIt:"Un fonds qui réplique les 100 plus grandes entreprises non financières cotées au Nasdaq, très orienté technologie.",
      gain:"Le fonds gagne de la valeur quand les grandes entreprises technologiques américaines progressent en bourse.",
      lose:"Le fonds perd de la valeur si le secteur technologique recule, ce qui pèse fortement puisque plus de la moitié du fonds est liée à la tech.",
      risks:["Risque actions élevé, forte concentration sectorielle","Réplication synthétique : le fonds passe par un contrat avec une banque plutôt que de détenir toujours les actions directement","Risque de contrepartie lié à cette structure synthétique"],
      monte:["Les entreprises de semi-conducteurs publient de bons résultats","L'appétit pour le risque des investisseurs augmente","Les taux d'intérêt américains baissent"],
      baisse:["Le secteur technologique traverse une correction","Les taux d'intérêt américains remontent fortement","Une entreprise très pondérée déçoit fortement le marché"],
      pros:["Exposition concentrée aux plus grandes entreprises technologiques mondiales","Bonne liquidité"],
      cons:["Frais plus élevés qu'un simple S&P 500 (0,23 %)","Réplication synthétique, plus complexe à comprendre qu'une réplication physique","Très concentré sur un seul secteur"],
      liquidite:"Liquide, coté en bourse, achat et vente possibles chaque jour d'ouverture.",
      notThis:"Ce n'est pas un fonds diversifié en actions américaines : c'est un pari concentré sur la technologie, pas une exposition large au marché américain."
    },
    {
      id:'em', isin:'IE00BKM4GZ66', name:'iShares Core MSCI EM IMI UCITS ETF',
      match:['emerging','emergent','emergents','marches emergents','pays emergents','ie00bkm4gz66','eimi'],
      ter:0.18, replication:'Physique',
      geo:[{c:'Chine',p:22},{c:'Inde',p:21},{c:'Taïwan',p:19},{c:'Reste',p:38}],
      whatIsIt:"Un fonds qui réplique des milliers d'entreprises de pays émergents (Chine, Inde, Taïwan, Brésil...), en détenant réellement leurs actions.",
      gain:"Le fonds gagne de la valeur quand les économies émergentes, en particulier la Chine, l'Inde et Taïwan, croissent et que leurs marchés actions progressent.",
      lose:"Le fonds perd de la valeur en cas de ralentissement économique dans ces pays, de tensions géopolitiques, ou de fuite des capitaux vers des marchés jugés plus sûrs.",
      risks:["Risque actions plus élevé que sur les marchés développés","Risque politique et réglementaire, notamment en Chine","Risque de change sur plusieurs devises à la fois"],
      monte:["La croissance économique chinoise ou indienne accélère","Les tensions commerciales internationales s'apaisent","Le dollar s'affaiblit, ce qui favorise historiquement les émergents"],
      baisse:["Des tensions géopolitiques ou commerciales s'intensifient","Le dollar se renforce fortement","Un ralentissement économique touche la Chine"],
      pros:["Diversifié sur des milliers d'entreprises et plusieurs pays","Expose à une croissance économique généralement plus rapide que les pays développés"],
      cons:["Plus volatil que les fonds sur pays développés","Concentré sur trois pays qui représentent plus de 60 % du fonds","Gouvernance et transparence des entreprises parfois plus faibles"],
      liquidite:"Liquide, coté en bourse, mais peut être plus volatil en période de tensions sur ces marchés.",
      notThis:"Ce n'est pas un fonds réparti équitablement entre tous les pays émergents : plus de 60 % est concentré sur seulement trois pays."
    },
    {
      id:'cac40', isin:'FR0007052782', name:'Amundi CAC 40 UCITS ETF',
      match:['cac 40','cac40','france','fr0007052782'],
      ter:0.25, replication:'Physique',
      geo:[{c:'France',p:99},{c:'Reste',p:1}],
      whatIsIt:"Un fonds qui réplique les 40 plus grandes entreprises cotées à la Bourse de Paris, en détenant réellement leurs actions.",
      gain:"Le fonds gagne de la valeur quand les grandes entreprises françaises cotées progressent en bourse.",
      lose:"Le fonds perd de la valeur si l'économie française ou européenne ralentit, ou si ses grandes entreprises, souvent très exportatrices, sont pénalisées par un euro fort.",
      risks:["Risque actions","Concentration sur un seul pays et seulement 40 entreprises","Les 3 premières lignes représentent à elles seules près d'un quart du fonds"],
      monte:["Les grandes entreprises du luxe ou de l'industrie publient de bons résultats","L'économie européenne accélère","L'euro s'affaiblit, ce qui favorise les entreprises exportatrices"],
      baisse:["Une récession touche la France ou l'Europe","L'euro se renforce fortement, pénalisant les exportateurs","Une des grandes entreprises du fonds déçoit fortement"],
      pros:["Éligible au PEA, avantageux fiscalement pour un résident français","Expose aux plus grandes entreprises françaises en une seule ligne"],
      cons:["Peu diversifié : seulement 40 entreprises, un seul pays","Quelques valeurs pèsent très lourd dans le fonds","Frais plus élevés que d'autres ETF actions larges (0,25 %)"],
      liquidite:"Très liquide, coté à Paris, achat et vente possibles chaque jour d'ouverture.",
      notThis:"Ce n'est pas un fonds diversifié à l'échelle européenne : c'est une concentration sur 40 entreprises françaises seulement."
    },
    {
      id:'acwi', isin:'IE00B44Z5B48', name:'SPDR MSCI ACWI UCITS ETF',
      match:['msci acwi','acwi','ie00b44z5b48'],
      ter:0.12, replication:'Optimisée',
      geo:[{c:'États-Unis',p:62},{c:'Japon',p:5},{c:'Royaume-Uni',p:4},{c:'Reste',p:29}],
      whatIsIt:"Un fonds qui réplique environ 2 500 grandes et moyennes entreprises réparties entre pays développés et pays émergents, en une seule ligne.",
      gain:"Le fonds gagne de la valeur quand les marchés actions mondiaux progressent, avec un poids déterminant des grandes entreprises américaines.",
      lose:"Le fonds perd de la valeur si les marchés développés reculent, en particulier les États-Unis qui représentent l'essentiel du fonds.",
      risks:["Risque actions","Concentration sur les États-Unis malgré l'inclusion des marchés émergents (environ 62 %)","Risque de change sur plusieurs devises"],
      monte:["Les grandes entreprises technologiques américaines publient de bons résultats","La croissance mondiale accélère","Les taux d'intérêt baissent"],
      baisse:["Une récession touche les États-Unis","Les marchés émergents traversent une crise de confiance","Le dollar s'affaiblit fortement"],
      pros:["Combine pays développés et émergents en une seule ligne","Très large diversification (environ 2 500 entreprises)","Frais bas (0,12 % par an)"],
      cons:["Reste très concentré sur les États-Unis dans les faits","La part des marchés émergents (environ 11 %) reste limitée malgré le nom","Moins connu, donc parfois moins liquide que MSCI World"],
      liquidite:"Coté en bourse, achat et vente possibles chaque jour d'ouverture des marchés.",
      notThis:"Ce n'est pas un fonds qui traite pays développés et émergents à parts égales : les États-Unis représentent à eux seuls plus de 60 % du fonds."
    },
    {
      id:'ftseallworld', isin:'IE00BK5BQT80', name:'Vanguard FTSE All-World UCITS ETF',
      match:['ftse all-world','ftse all world','vwce','ie00bk5bqt80'],
      ter:0.19, replication:'Physique',
      geo:[{c:'États-Unis',p:59},{c:'Japon',p:6},{c:'Chine',p:3},{c:'Reste',p:32}],
      whatIsIt:"Un fonds qui réplique environ 3 600 entreprises de pays développés et émergents, avec une méthodologie légèrement différente de MSCI World ou ACWI.",
      gain:"Le fonds gagne de la valeur quand les marchés actions mondiaux progressent, porté principalement par les grandes entreprises américaines.",
      lose:"Le fonds perd de la valeur si les marchés développés, en particulier les États-Unis et le secteur technologique, reculent.",
      risks:["Risque actions","Concentration sur les États-Unis (environ 59 %)","Risque de change (exposition au dollar)"],
      monte:["Les grandes entreprises technologiques progressent","La croissance économique mondiale s'accélère","Le dollar se renforce"],
      baisse:["Une récession touche les États-Unis","Le secteur technologique corrige fortement","Le dollar s'affaiblit"],
      pros:["Très large diversification (plus de 3 600 entreprises)","Inclut à la fois pays développés et émergents","Frais bas (0,19 % par an)"],
      cons:["Concentration sur les États-Unis comparable à MSCI World","Poids du secteur technologique élevé (environ 37 %)"],
      liquidite:"Très liquide, l'un des ETF les plus échangés en Europe.",
      notThis:"Ce n'est pas un fonds fondamentalement différent de MSCI World ou ACWI dans sa répartition finale, malgré une méthodologie et un nombre de lignes différents."
    },
    {
      id:'worldsmallcap', isin:'IE00BF4RFH31', name:'iShares MSCI World Small Cap UCITS ETF',
      match:['world small cap','msci world small cap','small cap monde','ie00bf4rfh31'],
      ter:0.35, replication:'Physique optimisée',
      geo:[{c:'Amérique du Nord',p:62},{c:'Europe',p:20},{c:'Japon',p:10},{c:'Reste',p:8}],
      whatIsIt:"Un fonds qui réplique plus de 3 500 petites entreprises des pays développés, à l'opposé des grandes capitalisations des indices World ou S&P 500.",
      gain:"Le fonds gagne de la valeur quand les petites entreprises, souvent plus sensibles à la conjoncture économique locale, progressent en bourse.",
      lose:"Le fonds perd de la valeur si l'économie ralentit, les petites entreprises étant généralement plus fragiles et plus volatiles que les grandes.",
      risks:["Risque actions plus élevé que sur les grandes capitalisations","Entreprises individuellement plus fragiles financièrement","Plus sensible aux hausses de taux d'intérêt"],
      monte:["L'économie accélère et favorise les entreprises domestiques","Les taux d'intérêt baissent","L'appétit pour le risque des investisseurs augmente"],
      baisse:["Une récession touche les économies développées","Les taux d'intérêt remontent fortement","Les investisseurs se replient vers les grandes valeurs jugées plus sûres"],
      pros:["Extrêmement diversifié (plus de 3 500 lignes, aucune ne dépasse 0,4 % du fonds)","Complète bien un ETF composé uniquement de grandes entreprises"],
      cons:["Frais plus élevés que les grands indices (0,35 %)","Plus volatil que MSCI World","Moins connu, donc parfois moins liquide"],
      liquidite:"Liquide, coté en bourse, mais peut afficher des écarts de prix plus larges en période de tensions.",
      notThis:"Ce n'est pas un ETF alternatif à MSCI World, c'est un complément : il cible délibérément les petites entreprises que MSCI World exclut."
    },
    {
      id:'russell2000', isin:null, name:'ETF Russell 2000 (plusieurs émetteurs)',
      match:['russell 2000','russell2000'],
      ter:0.30, replication:'Physique optimisée',
      geo:[{c:'États-Unis',p:100}],
      whatIsIt:"Un fonds qui réplique environ 2 000 petites capitalisations américaines, à l'opposé des grandes entreprises du S&P 500.",
      gain:"Le fonds gagne de la valeur quand les petites entreprises américaines, plus sensibles à l'économie domestique, progressent en bourse.",
      lose:"Le fonds perd de la valeur si l'économie américaine ralentit ou si le crédit se resserre, les petites entreprises étant plus dépendantes du financement bancaire.",
      risks:["Risque actions élevé","Entreprises individuellement plus fragiles que les grandes capitalisations","Très sensible aux taux d'intérêt américains"],
      monte:["L'économie américaine accélère","La Réserve fédérale baisse ses taux","L'appétit pour le risque augmente"],
      baisse:["Une récession touche spécifiquement les États-Unis","Les taux d'intérêt américains remontent","Le crédit bancaire se resserre"],
      pros:["Très diversifié (environ 2 000 lignes, faible concentration individuelle)","Bon complément à un ETF S&P 500 pour couvrir aussi les petites entreprises"],
      cons:["Frais plus élevés que les grands indices (0,30 %)","Concentré à 100 % sur les États-Unis","Plus volatil que le S&P 500"],
      liquidite:"Liquide, coté en bourse, achat et vente possibles chaque jour d'ouverture.",
      notThis:"Ce n'est pas une alternative diversifiée au S&P 500 : c'est un pari concentré sur les petites entreprises américaines uniquement, avec un profil de risque différent."
    },
    {
      id:'sp500ew', isin:'IE00BLNMYC90', name:'Xtrackers S&P 500 Equal Weight UCITS ETF',
      match:['s&p 500 equal weight','sp500 equal weight','equal weight','ie00blnmyc90'],
      ter:0.20, replication:'Physique',
      geo:[{c:'États-Unis',p:100}],
      whatIsIt:"Un fonds qui réplique les mêmes 500 entreprises que le S&P 500, mais en donnant à chacune le même poids plutôt que de favoriser les plus grandes.",
      gain:"Le fonds gagne de la valeur quand l'ensemble des 500 entreprises progresse de façon équilibrée, y compris les plus petites d'entre elles.",
      lose:"Le fonds perd de la valeur si le marché américain recule dans son ensemble, avec un effet moins concentré sur quelques valeurs qu'un S&P 500 classique.",
      risks:["Risque actions","Concentration à 100 % sur un seul pays","Rééquilibrage régulier qui peut générer des coûts internes"],
      monte:["Les entreprises moyennes et petites du S&P 500 rattrapent leur retard sur les géants technologiques","L'économie américaine accélère largement","Les taux d'intérêt baissent"],
      baisse:["Une récession touche les États-Unis","Les grandes entreprises technologiques tirent le marché vers le bas alors que le reste résiste","Les taux remontent fortement"],
      pros:["Moins dépendant de quelques géants technologiques que le S&P 500 classique","Répartition plus équilibrée entre les 500 entreprises"],
      cons:["Frais légèrement supérieurs à un S&P 500 classique (0,20 %)","Reste concentré à 100 % sur les États-Unis","Peut sous-performer quand les plus grandes entreprises dominent le marché"],
      liquidite:"Liquide, coté en bourse, achat et vente possibles chaque jour d'ouverture.",
      notThis:"Ce n'est pas un fonds plus diversifié géographiquement que le S&P 500 classique : la différence porte uniquement sur la pondération entre les 500 mêmes entreprises."
    },
    {
      id:'stoxx600', isin:'DE0002635307', name:'iShares STOXX Europe 600 UCITS ETF',
      match:['stoxx europe 600','stoxx 600','ie0002635307','de0002635307'],
      ter:0.20, replication:'Physique',
      geo:[{c:'Royaume-Uni',p:22},{c:'Suisse',p:15},{c:'Allemagne',p:14},{c:'France',p:13},{c:'Reste',p:36}],
      whatIsIt:"Un fonds qui réplique 600 grandes, moyennes et petites entreprises réparties sur 18 pays européens développés.",
      gain:"Le fonds gagne de la valeur quand les marchés actions européens dans leur ensemble progressent.",
      lose:"Le fonds perd de la valeur si l'économie européenne ralentit ou si l'euro et la livre sterling s'apprécient fortement, pénalisant les entreprises exportatrices.",
      risks:["Risque actions","Exposition à plusieurs devises (livre sterling, franc suisse, couronnes scandinaves, en plus de l'euro)","Aucun pays ne dépasse un quart du fonds, mais le Royaume-Uni, la Suisse, l'Allemagne et la France représentent les parts les plus importantes"],
      monte:["L'économie européenne accélère","La Banque centrale européenne baisse ses taux","L'euro s'affaiblit, ce qui favorise les entreprises exportatrices"],
      baisse:["Une récession touche l'Europe","L'euro ou la livre sterling se renforcent fortement","Une crise politique ou énergétique touche le continent"],
      pros:["Large diversification sur 600 entreprises et 18 pays","Peu concentré (les 10 premières lignes pèsent environ 20 % du fonds)","Frais bas (0,20 % par an)"],
      cons:["Exposition à plusieurs devises différentes, pas seulement l'euro","Moins dynamique historiquement que les indices américains","Secteurs défensifs davantage représentés que la technologie"],
      liquidite:"Liquide, coté en bourse, achat et vente possibles chaque jour d'ouverture.",
      notThis:"Ce n'est pas un fonds limité à la zone euro : il inclut aussi le Royaume-Uni, la Suisse et les pays scandinaves, qui n'utilisent pas l'euro."
    },
    {
      id:'eurostoxx50', isin:'IE00B53L3W79', name:'iShares Core EURO STOXX 50 UCITS ETF',
      match:['euro stoxx 50','eurostoxx 50','eurostoxx50','ie00b53l3w79'],
      ter:0.10, replication:'Physique',
      geo:[{c:'France',p:30},{c:'Allemagne',p:29},{c:'Pays-Bas',p:19},{c:'Espagne',p:11},{c:'Reste',p:11}],
      whatIsIt:"Un fonds qui réplique les 50 plus grandes entreprises de la zone euro uniquement, sans le Royaume-Uni ni la Suisse.",
      gain:"Le fonds gagne de la valeur quand les grandes entreprises de la zone euro, notamment françaises et allemandes, progressent en bourse.",
      lose:"Le fonds perd de la valeur si l'économie de la zone euro ralentit ou si l'euro s'apprécie fortement face aux autres devises.",
      risks:["Risque actions","Forte concentration géographique : France et Allemagne représentent à elles seules près de 60 % du fonds","Seulement 50 entreprises, donc peu de lignes par rapport à d'autres indices"],
      monte:["Les grandes entreprises françaises et allemandes publient de bons résultats","La croissance de la zone euro accélère","L'euro s'affaiblit, favorisant les exportateurs"],
      baisse:["Une récession touche la zone euro","L'euro se renforce fortement","Une crise politique touche la France ou l'Allemagne"],
      pros:["Éligible au PEA pour un résident français","Frais très bas (0,10 % par an)","Bonne liquidité, indice très suivi"],
      cons:["Très concentré : les 10 premières lignes représentent environ 40 % du fonds","Seulement 50 entreprises, peu diversifié","N'inclut ni le Royaume-Uni ni la Suisse, deux économies européennes majeures"],
      liquidite:"Très liquide, l'un des indices européens les plus échangés.",
      notThis:"Ce n'est pas un ETF sur l'ensemble de l'Europe : il se limite à la zone euro, et à seulement 50 entreprises parmi les plus grandes."
    },
    {
      id:'japan', isin:'IE00B02KXH56', name:'iShares MSCI Japan UCITS ETF',
      match:['msci japan','japon','ie00b02kxh56'],
      ter:0.12, replication:'Physique',
      geo:[{c:'Japon',p:100}],
      whatIsIt:"Un fonds qui réplique environ 200 grandes et moyennes entreprises cotées au Japon, en détenant réellement leurs actions.",
      gain:"Le fonds gagne de la valeur quand les entreprises japonaises progressent en bourse, ou quand le yen se renforce face à l'euro.",
      lose:"Le fonds perd de la valeur si l'économie japonaise ralentit ou si le yen s'affaiblit fortement face à l'euro.",
      risks:["Risque actions","Concentration à 100 % sur un seul pays","Risque de change sur le yen, une devise qui peut fortement fluctuer"],
      monte:["Les grandes entreprises japonaises publient de bons résultats","Le yen se renforce face à l'euro","La Banque du Japon ajuste sa politique monétaire favorablement"],
      baisse:["Une récession touche le Japon","Le yen s'affaiblit fortement face à l'euro","Un ralentissement démographique freine la croissance japonaise"],
      pros:["Diversifié sur environ 200 entreprises","Expose à la troisième économie mondiale","Frais bas (0,12 % par an)"],
      cons:["Concentré à 100 % sur un seul pays","Risque de change non couvert sur le yen","Marché historiquement moins dynamique que les indices américains"],
      liquidite:"Liquide, coté en bourse, achat et vente possibles chaque jour d'ouverture.",
      notThis:"Ce n'est pas un fonds couvert contre le risque de change : les variations du yen affectent directement votre performance en euros."
    },
    {
      id:'china', isin:'IE00BJ5JPG56', name:'iShares MSCI China UCITS ETF',
      match:['msci china','chine','ie00bj5jpg56'],
      ter:0.28, replication:'Physique',
      geo:[{c:'Chine',p:100}],
      whatIsIt:"Un fonds qui réplique les grandes entreprises chinoises cotées, y compris certaines cotées à l'étranger (Hong Kong, États-Unis).",
      gain:"Le fonds gagne de la valeur quand les grandes entreprises technologiques et financières chinoises progressent en bourse.",
      lose:"Le fonds perd de la valeur en cas de ralentissement économique chinois, de tensions géopolitiques, ou de durcissement réglementaire envers les grandes entreprises technologiques.",
      risks:["Risque actions élevé","Forte concentration : les deux premières lignes (Tencent, Alibaba) représentent environ un quart du fonds","Risque politique et réglementaire propre à la Chine"],
      monte:["L'économie chinoise accélère","Les tensions commerciales s'apaisent","Les autorités chinoises assouplissent leur réglementation envers la tech"],
      baisse:["Des tensions géopolitiques ou commerciales s'intensifient","Les autorités chinoises durcissent leur réglementation envers les grandes entreprises","Le marché immobilier chinois traverse une nouvelle crise"],
      pros:["Accès direct à la deuxième économie mondiale","Expose aux plus grandes entreprises technologiques et financières chinoises"],
      cons:["Très concentré sur deux entreprises (environ 25 % du fonds à elles deux)","Risque politique et réglementaire important","Frais plus élevés que la moyenne (0,28 %)"],
      liquidite:"Liquide, coté en bourse, mais peut être plus volatil en période de tensions géopolitiques.",
      notThis:"Ce n'est pas un fonds largement diversifié sur l'économie chinoise : environ un quart de sa valeur dépend de deux entreprises seulement."
    },
    {
      id:'india', isin:'IE00BZCQB185', name:'iShares MSCI India UCITS ETF',
      match:['msci india','inde','ie00bzcqb185'],
      ter:0.65, replication:'Physique',
      geo:[{c:'Inde',p:100}],
      whatIsIt:"Un fonds qui réplique environ 165 grandes et moyennes entreprises cotées en Inde, en détenant réellement leurs actions.",
      gain:"Le fonds gagne de la valeur quand les grandes entreprises indiennes, notamment financières, progressent en bourse.",
      lose:"Le fonds perd de la valeur si la croissance économique indienne ralentit ou si la roupie s'affaiblit fortement face à l'euro.",
      risks:["Risque actions élevé","Concentration à 100 % sur un seul pays","Risque de change sur la roupie indienne"],
      monte:["La croissance économique indienne accélère","Les grandes banques et entreprises technologiques indiennes publient de bons résultats","Les investisseurs étrangers renforcent leur exposition à l'Inde"],
      baisse:["Un ralentissement économique touche l'Inde","La roupie s'affaiblit fortement face à l'euro","Les investisseurs étrangers se retirent des marchés émergents"],
      pros:["Accès direct à l'une des économies à la croissance la plus rapide au monde","Diversifié sur 165 entreprises"],
      cons:["Frais nettement plus élevés que la plupart des autres ETF actions (0,65 %)","Concentré à 100 % sur un seul pays","Le secteur financier représente à lui seul environ 30 % du fonds"],
      liquidite:"Liquide, coté en bourse, mais plus volatil que les marchés développés.",
      notThis:"Ce n'est pas le fonds le moins cher pour s'exposer aux marchés émergents : ses frais sont parmi les plus élevés de cette bibliothèque, à mettre en balance avec son potentiel de croissance."
    },
    {
      id:'apple-action', isin:'US0378331005', name:'Action Apple Inc. (AAPL)',
      match:['apple','aapl','action apple','us0378331005'],
      ter:null, replication:'n/a',
      geo:[{c:'États-Unis',p:100}],
      whatIsIt:"Une part de propriété du fabricant américain d'iPhone, Mac et services numériques, cotée au Nasdaq.",
      gain:"Vous gagnez si le cours de l'action progresse en bourse, et via les dividendes versés chaque trimestre (environ 1,08 $ par action et par an actuellement).",
      lose:"Vous perdez de l'argent si le cours recule, par exemple en cas de déception sur les ventes d'iPhone, de ralentissement en Chine ou de correction du secteur technologique.",
      risks:["Risque actions individuelle : aucune diversification, tout dépend d'une seule entreprise","Risque de change (action cotée en dollars)","Risque sectoriel : forte dépendance au marché des smartphones et à la Chine"],
      monte:["Les ventes d'iPhone ou de services dépassent les attentes","Le marché anticipe une avancée dans l'intelligence artificielle chez Apple","Le dollar se renforce face à l'euro"],
      baisse:["Les ventes d'iPhone déçoivent, notamment en Chine","Un litige réglementaire ou un scandale touche l'entreprise","Le secteur technologique traverse une correction généralisée"],
      pros:["Entreprise parmi les plus rentables et les plus capitalisées au monde","Marque forte et fidélité élevée de sa clientèle"],
      cons:["Aucune diversification : le sort de votre investissement dépend d'une seule entreprise","Dividende faible comparé à d'autres actions (rendement d'environ 0,3 % par an)"],
      liquidite:"Très liquide : cotée au Nasdaq, achat et vente possibles à tout moment pendant les heures de bourse américaines.",
      notThis:"Ce n'est pas un placement diversifié comme un ETF : détenir une seule action vous expose entièrement au sort d'une seule entreprise, quelle que soit sa taille."
    },
    {
      id:'lvmh-action', isin:'FR0000121014', name:'Action LVMH Moët Hennessy Louis Vuitton',
      match:['lvmh','action lvmh','fr0000121014'],
      ter:null, replication:'n/a',
      geo:[{c:'France',p:100}],
      whatIsIt:"Une part de propriété du numéro un mondial du luxe (mode, maroquinerie, vins et spiritueux, parfums), cotée à la Bourse de Paris.",
      gain:"Vous gagnez si le cours progresse en bourse, et via un dividende annuel (estimé à environ 13,4 € par action pour 2026, soit un rendement de l'ordre de 2,9 %).",
      lose:"Vous perdez de l'argent si le cours recule, par exemple lors d'un ralentissement de la demande en Chine ou aux États-Unis, moteurs importants du secteur du luxe.",
      risks:["Risque actions individuelle, concentré sur une seule entreprise","Forte sensibilité à la conjoncture en Chine et aux dépenses des clients aisés","Risque de change (chiffre d'affaires réalisé en plusieurs devises)"],
      monte:["La demande de produits de luxe reprend en Chine","Les résultats trimestriels dépassent les attentes des analystes","Le tourisme international accélère"],
      baisse:["La consommation ralentit en Chine ou aux États-Unis","Une des maisons du groupe déçoit sur ses ventes","Une crise économique réduit les dépenses discrétionnaires des ménages aisés"],
      pros:["Leader mondial incontesté du secteur du luxe, portefeuille de marques très diversifié","Historique de versement de dividende régulier"],
      cons:["Cours sensible aux cycles économiques et à la conjoncture chinoise","Valorisation élevée, ce qui peut amplifier les baisses en cas de déception"],
      liquidite:"Très liquide, l'une des valeurs les plus échangées de la Bourse de Paris, cotée en continu.",
      notThis:"Ce n'est pas un placement à l'abri des cycles économiques : le secteur du luxe, bien que réputé résilient, reste sensible aux ralentissements de la consommation."
    },
    {
      id:'totalenergies-action', isin:'FR0000120271', name:'Action TotalEnergies SE',
      match:['totalenergies','total energies','action total','fr0000120271'],
      ter:null, replication:'n/a',
      geo:[{c:'France',p:100}],
      whatIsIt:"Une part de propriété du groupe énergétique français, présent dans le pétrole, le gaz et de plus en plus dans l'électricité et les renouvelables, cotée à la Bourse de Paris.",
      gain:"Vous gagnez si le cours progresse, et via un dividende élevé versé chaque trimestre (dividende 2026 estimé à environ 3,60 € par action, soit un rendement de l'ordre de 4,5 % à 5 %).",
      lose:"Vous perdez de l'argent si le cours recule, notamment lors d'une baisse durable des prix du pétrole ou du gaz.",
      risks:["Risque actions individuelle, concentré sur une seule entreprise","Forte dépendance aux prix du pétrole et du gaz, très volatils","Risque de transition énergétique et réglementaire (normes environnementales, taxes)"],
      monte:["Les prix du pétrole ou du gaz remontent","L'entreprise annonce des rachats d'actions ou une hausse de dividende","Les marges de raffinage s'améliorent"],
      baisse:["Les prix du pétrole ou du gaz chutent durablement","Une réglementation environnementale plus stricte pèse sur l'activité","Une tension géopolitique perturbe la production"],
      pros:["Dividende parmi les plus élevés du CAC 40","Groupe diversifié entre énergies fossiles et renouvelables"],
      cons:["Cours très dépendant des cours du pétrole et du gaz, difficiles à anticiper","Exposition à des risques réglementaires et d'image liés au climat"],
      liquidite:"Très liquide, l'une des plus fortes capitalisations et des valeurs les plus échangées de la Bourse de Paris.",
      notThis:"Ce n'est pas un placement stable et prévisible : malgré son dividende attractif, le cours suit les variations parfois brutales des prix de l'énergie."
    },
    {
      id:'oat-france', isin:null, name:"Obligation d'État française (OAT) à 10 ans",
      match:['oat',"obligation d'etat francaise","obligation etat francais",'oat 10 ans'],
      ter:null, replication:'n/a',
      geo:[{c:'France',p:100}],
      whatIsIt:"Un prêt que vous faites à l'État français : vous lui prêtez de l'argent pour une durée fixée (ici 10 ans), en échange d'un intérêt versé chaque année et du remboursement du capital à l'échéance.",
      gain:"Vous gagnez l'intérêt annuel fixé à l'émission (le rendement des OAT à 10 ans tourne autour de 4,5 % courant 2026, un niveau qui varie chaque jour selon les marchés) ; si vous la revendez avant échéance et que les taux ont baissé, son prix peut aussi avoir augmenté.",
      lose:"Si vous la revendez avant l'échéance et que les taux d'intérêt ont monté depuis l'achat, son prix de revente peut être inférieur à ce que vous avez payé.",
      risks:["Risque de taux : la valeur de revente baisse si les taux montent","Risque de crédit, généralement faible pour un État comme la France mais pas nul (la note de la dette française peut évoluer)","Risque d'inflation : un rendement fixe peut être rogné par une inflation plus forte que prévue"],
      monte:["Les taux d'intérêt de marché baissent (le prix des obligations déjà émises monte)","La perception du risque sur la dette française s'améliore","La Banque centrale européenne assouplit sa politique monétaire"],
      baisse:["Les taux d'intérêt de marché remontent","Les inquiétudes sur le déficit ou la dette publique française s'accentuent","Une agence de notation dégrade la note de la France"],
      pros:["Placement jugé parmi les plus sûrs si conservé jusqu'à l'échéance","Revenu régulier et prévisible (coupon fixe)"],
      cons:["Rendement qui peut rester inférieur à l'inflation certaines années","Valeur de revente avant échéance qui peut fluctuer, parfois fortement, avec les taux"],
      liquidite:"Assez liquide sur le marché obligataire pour les gros investisseurs, mais un particulier y accède le plus souvent via un fonds ou une assurance-vie plutôt qu'en direct.",
      notThis:"Ce n'est pas un placement à capital totalement garanti à tout moment : la garantie ne joue qu'à l'échéance, pas si vous revendez en cours de route."
    },
    {
      id:'treasury-us', isin:null, name:'Obligation du Trésor américain (US Treasury) à 10 ans',
      match:['obligation tresor americain','treasury','bon du tresor americain','us treasury'],
      ter:null, replication:'n/a',
      geo:[{c:'États-Unis',p:100}],
      whatIsIt:"Un prêt que vous faites à l'État américain, considéré comme la référence mondiale des placements obligataires jugés très sûrs.",
      gain:"Vous gagnez l'intérêt annuel fixé à l'émission (le rendement des Treasuries à 10 ans se situe autour de 4,5 % à 5 % courant 2026) ainsi qu'un éventuel effet de change si le dollar se renforce face à l'euro.",
      lose:"Vous perdez de la valeur en cas de revente avant échéance si les taux américains ont monté depuis l'achat, ou si le dollar s'affaiblit face à l'euro pour un investisseur européen.",
      risks:["Risque de taux, comme pour toute obligation à taux fixe","Risque de change pour un investisseur en euros, le dollar pouvant fluctuer fortement","Risque de crédit très faible mais pas nul, lié à la situation budgétaire américaine"],
      monte:["La Réserve fédérale américaine baisse ses taux directeurs","Une aversion au risque pousse les investisseurs vers les actifs jugés les plus sûrs","Le dollar se renforce face à l'euro"],
      baisse:["La Réserve fédérale relève ses taux ou les marchés anticipent une inflation plus élevée","Les inquiétudes sur le déficit budgétaire américain s'intensifient","Le dollar s'affaiblit fortement face à l'euro"],
      pros:["Placement de référence mondiale, très liquide sur les marchés internationaux","Rendement actuellement plus élevé que sur les obligations d'État européennes équivalentes"],
      cons:["Risque de change non négligeable pour un investisseur en euros","Valeur de revente sensible aux décisions de politique monétaire américaine"],
      liquidite:"Marché obligataire le plus liquide au monde, mais un particulier y accède généralement via un fonds ou un ETF obligataire plutôt qu'en direct.",
      notThis:"Ce n'est pas un placement sans risque pour un investisseur européen : même si le risque de défaut est jugé très faible, les variations du dollar peuvent peser sur votre performance en euros."
    },
    {
      id:'obligation-entreprise', isin:null, name:"Obligation d'entreprise (investment grade)",
      match:["obligation d'entreprise",'obligation entreprise','corporate bond','obligation corporate'],
      ter:null, replication:'n/a',
      geo:[],
      whatIsIt:"Un prêt que vous faites à une entreprise plutôt qu'à un État, en échange d'un intérêt généralement plus élevé qu'une obligation d'État pour compenser un risque de défaut plus important.",
      gain:"Vous gagnez l'intérêt versé chaque année (les obligations d'entreprises bien notées, dites « investment grade », rapportent typiquement autour de 5 % à 5,5 % courant 2026, soit environ 0,9 à 1 point de plus qu'une obligation d'État équivalente).",
      lose:"Vous perdez de l'argent si l'entreprise fait défaut et ne peut plus rembourser, ou si vous revendez avant échéance alors que les taux ont monté ou que la situation financière de l'entreprise s'est dégradée.",
      risks:["Risque de crédit : l'entreprise peut rencontrer des difficultés financières, voire faire défaut","Risque de taux, comme pour toute obligation à taux fixe","Risque de liquidité : certaines obligations d'entreprises s'échangent moins facilement que les obligations d'État"],
      monte:["La note de crédit de l'entreprise s'améliore","Les taux d'intérêt de marché baissent","La perception du risque de crédit en général s'améliore, resserrant les écarts avec les obligations d'État"],
      baisse:["La situation financière de l'entreprise se dégrade ou sa note de crédit est abaissée","Les taux d'intérêt de marché remontent","Une crise économique généralisée fait craindre davantage de défauts d'entreprises"],
      pros:["Rendement généralement supérieur aux obligations d'État pour un risque supplémentaire mesuré (via la notation de crédit)","Diversification possible entre de nombreux secteurs et entreprises"],
      cons:["Risque de défaut réel, contrairement à une obligation d'État jugée très sûre","Nécessite d'examiner la notation de crédit de l'émetteur, ce qu'un particulier isolé maîtrise rarement bien"],
      liquidite:"Variable selon l'émetteur et la taille de l'émission ; un particulier y accède le plus souvent via un fonds obligataire plutôt qu'en détenant une obligation en direct.",
      notThis:"Ce n'est pas un placement aussi sûr qu'une obligation d'État : même une entreprise solide peut voir sa situation se dégrader, et toutes les obligations d'entreprises n'ont pas le même niveau de risque."
    },
    {
      id:'fonds-actif-actions', isin:null, name:"Fonds actions géré activement (OPCVM, exemple générique)",
      match:['fonds actions gere activement','fonds actif','gestion active','opcvm actions'],
      ter:1.58, replication:'n/a',
      geo:[],
      whatIsIt:"Un fonds dans lequel une équipe de gérants choisit elle-même les actions à acheter et à vendre, dans l'espoir de faire mieux qu'un indice de référence, contrairement à un ETF qui se contente de le suivre.",
      gain:"Vous gagnez si les choix du gérant sont payants et si les entreprises sélectionnées progressent en bourse plus que la moyenne du marché.",
      lose:"Vous perdez de l'argent si les marchés baissent, ou même si les marchés montent mais que les choix du gérant sont moins bons que la moyenne, une fois les frais déduits.",
      risks:["Risque actions, comme pour tout fonds investi en bourse","Risque de sous-performance : la grande majorité des fonds actifs font moins bien que leur indice de référence sur longue période","Frais plus élevés qui pèsent sur la performance nette, qu'il y ait gain ou perte"],
      monte:["Les entreprises sélectionnées par le gérant publient de bons résultats","Le style de gestion du fonds est favorisé par le marché à un moment donné","Les marchés actions progressent globalement"],
      baisse:["Les marchés actions reculent dans leur ensemble","Les choix du gérant se révèlent moins performants que la moyenne du marché","Une ou plusieurs valeurs fortement pondérées dans le fonds déçoivent"],
      pros:["Possibilité, en théorie, de mieux faire que le marché ou de mieux le protéger en cas de baisse","Une équipe humaine peut ajuster la stratégie selon le contexte économique"],
      cons:["Frais courants nettement plus élevés qu'un ETF, souvent autour de 1,5 % à 2 % par an en France","Des études indépendantes montrent qu'environ 80 % à 90 % des fonds actifs font moins bien que leur indice sur 15 à 20 ans, une fois les frais déduits"],
      liquidite:"Généralement liquide, avec un rachat possible chaque jour ou chaque semaine selon le fonds, mais moins immédiat qu'un ETF coté en continu.",
      notThis:"Ce n'est pas un raccourci automatique vers une meilleure performance : payer des frais plus élevés ne garantit pas de battre le marché, bien au contraire dans la majorité des cas historiquement observés."
    },
    {
      id:'fonds-diversifie', isin:null, name:'Fonds diversifié (profil équilibré, exemple générique)',
      match:['fonds diversifie','fonds patrimonial','fonds equilibre'],
      ter:null, replication:'n/a',
      geo:[],
      whatIsIt:"Un fonds qui mélange actions, obligations et parfois d'autres actifs, dans des proportions définies à l'avance selon un profil de risque (prudent, équilibré, dynamique).",
      gain:"Vous gagnez quand la partie actions du fonds progresse en bourse et/ou quand la partie obligataire verse ses intérêts, le tout combiné selon la répartition du fonds.",
      lose:"Vous perdez de l'argent si les actions et les obligations reculent en même temps, ce qui peut arriver lors de certaines phases de hausse des taux d'intérêt.",
      risks:["Risque actions sur la partie actions du fonds","Risque de taux sur la partie obligataire","Risque de frais cumulés qui réduisent la performance nette dans la durée"],
      monte:["Les marchés actions et obligataires progressent simultanément","Le gérant augmente la part actions au bon moment","Les taux d'intérêt baissent, ce qui profite à la partie obligataire"],
      baisse:["Les marchés actions et obligataires reculent en même temps","Le gérant réduit la part actions au mauvais moment","Une remontée des taux pénalise la partie obligataire du fonds"],
      pros:["Diversification automatique entre plusieurs classes d'actifs en une seule ligne","Profil de risque ajustable en amont selon vos objectifs (prudent, équilibré, dynamique)"],
      cons:["Frais courants des fonds actifs mixtes souvent proches de 1,5 % à 1,6 % par an en France, qui s'ajoutent parfois à ceux d'une assurance-vie","Moins de transparence qu'un ETF sur la composition exacte à un instant donné"],
      liquidite:"Généralement liquide, avec un rachat possible chaque jour ou chaque semaine selon le fonds.",
      notThis:"Ce n'est pas un placement sans risque de perte : même un fonds « équilibré » peut perdre de la valeur, notamment quand actions et obligations reculent en même temps."
    },
    {
      id:'fonds-flexible', isin:null, name:"Fonds flexible (allocation d'actifs discrétionnaire, exemple générique)",
      match:['fonds flexible','allocation flexible','gestion flexible'],
      ter:null, replication:'n/a',
      geo:[],
      whatIsIt:"Un fonds diversifié dont le gérant peut faire varier librement la part d'actions et d'obligations, parfois de 0 % à 100 %, selon sa lecture des conditions de marché.",
      gain:"Vous gagnez si le gérant augmente la part actions avant une hausse des marchés, ou la réduit avant une baisse, en plus des gains classiques sur les actifs détenus.",
      lose:"Vous perdez de l'argent si les arbitrages du gérant sont mal calibrés, par exemple s'il reste investi en actions juste avant une baisse ou s'il en sort juste avant une hausse.",
      risks:["Risque de marché variable selon l'exposition choisie par le gérant à un instant donné","Risque lié aux décisions du gérant : une mauvaise anticipation peut coûter cher","Frais de gestion généralement élevés, incluant parfois une commission de surperformance"],
      monte:["Le gérant anticipe correctement une phase de hausse des marchés et augmente la part actions à temps","Les marchés actions et obligataires progressent","La stratégie du fonds est favorisée par le contexte économique du moment"],
      baisse:["Le gérant maintient une exposition élevée aux actions juste avant une baisse des marchés","Les arbitrages du fonds se révèlent à contretemps","Les marchés traversent une période de forte volatilité difficile à anticiper"],
      pros:["Grande liberté de gestion qui peut permettre de limiter les pertes en cas de baisse anticipée","Une seule ligne pour déléguer entièrement les choix d'allocation entre actions et obligations"],
      cons:["Performance très dépendante de la qualité des décisions du gérant, difficile à juger à l'avance","Frais souvent plus élevés qu'un fonds diversifié classique, avec parfois une commission de surperformance"],
      liquidite:"Généralement liquide, avec un rachat possible chaque jour ou chaque semaine selon le fonds.",
      notThis:"Ce n'est pas un placement qui protège automatiquement des baisses de marché : la flexibilité dépend entièrement du jugement du gérant, qui peut se tromper comme n'importe quel investisseur."
    },
    {
      id:'fonds-monetaire-euro', isin:null, name:'Fonds monétaire euro (exemple générique)',
      match:['fonds monetaire','fonds monetaire euro','monetaire'],
      ter:0.25, replication:'n/a',
      geo:[{c:'Zone euro',p:100}],
      whatIsIt:"Un fonds qui place l'argent des investisseurs dans des titres de créance très court terme et très sûrs (bons du Trésor, certificats de dépôt de grandes banques), pour viser la stabilité plutôt que la performance.",
      gain:"Le fonds suit de près un taux de référence de la zone euro, l'€STR (autour de 2,2 % fin août 2026) ; une fois les frais de gestion déduits (généralement 0,10 % à 0,65 % par an selon le fonds), le rendement net se situe un peu en dessous.",
      lose:"La perte de capital est très rare, mais possible en théorie si les frais dépassent le rendement des actifs détenus, ou dans un contexte de taux d'intérêt négatifs comme cela a existé en Europe entre 2015 et 2022.",
      risks:["Risque de taux très faible, car les titres détenus sont à très court terme","Risque de crédit très faible mais pas nul (défaut d'un émetteur)","Risque de rendement négatif si les taux directeurs redeviennent négatifs"],
      monte:["La Banque centrale européenne relève ses taux directeurs","L'€STR augmente","Le fonds choisit des émetteurs offrant un léger surplus de rendement sans risque excessif"],
      baisse:["La Banque centrale européenne baisse fortement ses taux, voire les rend négatifs","Les frais de gestion du fonds sont élevés par rapport à son rendement brut","Un émetteur détenu par le fonds fait défaut (cas très rare pour ce type de fonds)"],
      pros:["Capital quasiment stable au jour le jour, très faible volatilité","Rachat possible très rapidement, en général en un à deux jours ouvrés"],
      cons:["Rendement modeste, à peine supérieur à l'inflation certaines années, voire inférieur","Après fiscalité, le rendement net peut devenir peu attractif comparé à un livret réglementé"],
      liquidite:"Très liquide, parmi les supports les plus faciles à racheter rapidement en cas de besoin.",
      notThis:"Ce n'est pas un placement garanti à 100 % comme un livret réglementé : la valeur du fonds peut, en théorie, légèrement fluctuer à la baisse, même si cela reste rare en pratique."
    },
    {
      id:'compte-a-terme', isin:null, name:'Compte à terme (CAT)',
      match:['compte a terme','cat','compte terme'],
      ter:null, replication:'n/a',
      geo:[],
      whatIsIt:"Un compte bancaire sur lequel vous bloquez une somme pour une durée fixée à l'avance (de quelques mois à plusieurs années), en échange d'un taux d'intérêt garanti dès la souscription.",
      gain:"Vous gagnez l'intérêt garanti prévu au contrat, versé à échéance ou périodiquement selon les offres (les taux observés en 2026 vont généralement de 1,8 % à un peu plus de 3 % selon la durée et l'établissement).",
      lose:"Vous ne perdez normalement pas de capital, mais vous pouvez perdre une partie des intérêts, voire subir une pénalité, si vous retirez l'argent avant l'échéance prévue.",
      risks:["Risque de blocage : l'argent n'est pas disponible avant l'échéance sans pénalité","Risque de taux figé : si les taux du marché montent après votre souscription, vous ne pouvez pas en profiter avant l'échéance","Risque de contrepartie très limité, l'argent étant couvert par la garantie des dépôts jusqu'à 100 000 € par banque et par déposant"],
      monte:["Vous souscrivez au moment où les taux proposés par les banques sont élevés","Vous choisissez une durée plus longue, généralement mieux rémunérée","Vous négociez un taux préférentiel pour un montant important"],
      baisse:["Les taux du marché montent après votre souscription, rendant votre taux figé moins compétitif","Vous devez retirer l'argent avant l'échéance et perdez une partie des intérêts","L'inflation dépasse le taux garanti, réduisant votre pouvoir d'achat réel"],
      pros:["Taux garanti connu à l'avance, aucune surprise sur le rendement","Capital protégé par la garantie des dépôts jusqu'à 100 000 € par banque"],
      cons:["Argent bloqué pendant toute la durée choisie, avec pénalité en cas de retrait anticipé","Intérêts soumis à la fiscalité classique de l'épargne (flat tax de 30 % en général)"],
      liquidite:"Faible avant l'échéance : l'argent est bloqué, un retrait anticipé étant souvent pénalisé ou parfois impossible selon les contrats.",
      notThis:"Ce n'est pas un placement disponible à tout moment comme un livret : le capital est immobilisé jusqu'à l'échéance choisie, sauf à accepter de perdre une partie du gain."
    },
    {
      id:'livret-reglemente', isin:null, name:'Livret bancaire réglementé (Livret A)',
      match:['livret a','livret bancaire reglemente','livret reglemente'],
      ter:null, replication:'n/a',
      geo:[],
      whatIsIt:"Un livret d'épargne dont le taux est fixé par l'État (revu généralement deux fois par an), disponible à tout moment, dans la limite d'un plafond de versement.",
      gain:"Vous gagnez l'intérêt versé, calculé quinzaine par quinzaine sur les sommes présentes sur le compte, au taux réglementé en vigueur (1,7 % depuis le 1er août 2026 pour le Livret A).",
      lose:"Il n'y a pas de perte en capital possible : le capital est garanti à 100 % et les intérêts, une fois acquis, ne peuvent pas être repris.",
      risks:["Risque de rendement réel négatif si l'inflation dépasse le taux du livret","Risque d'opportunité : l'argent placé ici ne profite pas d'un potentiel de performance supérieur d'autres placements","Aucun risque de perte en capital, contrairement à la plupart des autres produits de cette liste"],
      monte:["L'État relève le taux réglementé lors d'une révision semestrielle","L'inflation reste élevée, ce qui pousse les pouvoirs publics à ajuster le taux à la hausse","Vous versez davantage, dans la limite du plafond autorisé"],
      baisse:["L'État abaisse le taux réglementé lors d'une révision semestrielle","L'inflation dépasse le taux du livret, réduisant votre pouvoir d'achat réel malgré des intérêts positifs","Le plafond de versement limite le montant sur lequel vous pouvez percevoir ces intérêts"],
      pros:["Capital garanti à 100 %, aucun risque de perte","Disponible à tout moment sans pénalité, intérêts exonérés d'impôt et de prélèvements sociaux"],
      cons:["Plafond de versement limité (22 950 € pour le Livret A), qui borne les sommes pouvant en bénéficier","Rendement modeste, qui peut rester inférieur à l'inflation certaines années"],
      liquidite:"Totalement liquide : versements et retraits possibles à tout moment, sans délai ni pénalité.",
      notThis:"Ce n'est pas un placement de performance : sa vocation est la sécurité et la disponibilité immédiate de l'argent, pas de faire fructifier significativement votre épargne sur la durée."
    },
    {
      id:'scpi', isin:null, name:'SCPI de rendement (Société Civile de Placement Immobilier)',
      match:['scpi','scpi de rendement'],
      ter:null, replication:'n/a',
      geo:[],
      whatIsIt:"Vous achetez des parts d'un parc immobilier locatif (bureaux, commerces, entrepôts...) géré par une société de gestion, qui perçoit les loyers et vous les reverse, sans que vous ayez à gérer un bien vous-même.",
      gain:"Vous gagnez via les loyers redistribués (le taux de distribution moyen des SCPI a atteint environ 4,9 % en 2025 selon l'ASPIM) et, potentiellement, via une plus-value si la valeur des parts progresse à la revente.",
      lose:"Vous perdez de la valeur si le marché immobilier concerné se dégrade (vacance locative, baisse de valeur des biens) ou si vous revendez rapidement, les frais d'entrée élevés pesant lourd sur une courte durée.",
      risks:["Risque de baisse de la valeur des parts, lié à l'évolution du marché immobilier sous-jacent","Risque de vacance locative, qui réduit les loyers distribués","Risque de liquidité : la revente des parts peut prendre du temps, sans garantie de trouver un acheteur"],
      monte:["Les loyers du parc immobilier progressent (indexation, nouvelles acquisitions)","Le taux d'occupation du parc s'améliore","La valeur des actifs immobiliers détenus est réévaluée à la hausse"],
      baisse:["Le taux de vacance locative augmente","La valeur des biens immobiliers détenus recule (essor du télétravail, marché des bureaux en difficulté, par exemple)","Vous devez revendre rapidement, ce qui ne permet pas d'amortir les frais d'entrée"],
      pros:["Accès à l'immobilier locatif sans gérer soi-même un bien (pas de travaux, pas de recherche de locataire)","Revenus généralement réguliers et diversifiés sur plusieurs biens et parfois plusieurs pays"],
      cons:["Frais d'entrée élevés, souvent entre 8 % et 12 % du capital investi pour les SCPI classiques","Liquidité limitée : la revente des parts peut prendre plusieurs mois, sans garantie de prix"],
      liquidite:"Faible à moyenne : contrairement à une action ou un ETF, la revente des parts n'est pas immédiate et dépend de l'existence d'un marché secondaire ou du bon vouloir de la société de gestion.",
      notThis:"Ce n'est pas un placement aussi liquide qu'un compte-titres : revendre ses parts de SCPI peut prendre plusieurs semaines à plusieurs mois, contrairement à une action cotée en bourse."
    },
    {
      id:'opci', isin:null, name:'OPCI (Organisme de Placement Collectif en Immobilier)',
      match:['opci'],
      ter:null, replication:'n/a',
      geo:[],
      whatIsIt:"Un fonds qui mélange immobilier (60 % à 70 % environ, souvent des bureaux, commerces ou entrepôts), actifs financiers (actions, obligations) et une poche de liquidités, pour offrir une meilleure disponibilité qu'une SCPI classique.",
      gain:"Vous gagnez via les loyers de la partie immobilière, la performance de la partie financière, et une éventuelle plus-value sur la valeur des parts.",
      lose:"Vous perdez de la valeur si le marché immobilier ou les marchés financiers reculent, la partie financière du fonds pouvant amplifier la volatilité par rapport à une SCPI.",
      risks:["Risque immobilier sur la partie majoritaire du fonds","Risque de marché sur la partie actions et obligations, qui peut être plus volatile que l'immobilier seul","Risque de liquidité limité mais réel en période de tensions sur les marchés"],
      monte:["Les loyers de la partie immobilière progressent","La partie actions et obligations du fonds profite d'une hausse des marchés financiers","La valorisation globale du parc immobilier est révisée à la hausse"],
      baisse:["Le marché immobilier sous-jacent se dégrade","La partie financière du fonds recule en cas de baisse des marchés actions ou obligataires","Une vague de demandes de rachat oblige le fonds à vendre des actifs dans de mauvaises conditions"],
      pros:["Meilleure liquidité qu'une SCPI grâce à la poche de liquidités et d'actifs financiers","Frais d'entrée généralement plus faibles qu'une SCPI, souvent entre 3 % et 5 %"],
      cons:["Performance plus volatile qu'une SCPI pure, du fait de la partie financière","Structure plus complexe à comprendre qu'une SCPI, mêlant plusieurs classes d'actifs"],
      liquidite:"Meilleure que celle d'une SCPI classique, avec des rachats possibles en quelques jours à quelques semaines selon les fonds, mais reste inférieure à celle d'une action ou d'un ETF coté.",
      notThis:"Ce n'est pas l'équivalent d'une SCPI : la présence d'une poche financière significative rend l'OPCI plus liquide mais aussi plus sensible aux variations des marchés financiers, pas seulement de l'immobilier."
    },
    {
      id:'fonciere-cotee', isin:null, name:'Foncière cotée (SIIC / REIT, exemple générique)',
      match:['fonciere cotee','siic','reit','foncieres cotees'],
      ter:null, replication:'n/a',
      geo:[{c:'Europe',p:100}],
      whatIsIt:"Une entreprise cotée en bourse qui détient et exploite un patrimoine immobilier professionnel (bureaux, commerces, entrepôts logistiques...), et qui doit reverser au moins 85 % de ses bénéfices locatifs à ses actionnaires en échange d'avantages fiscaux.",
      gain:"Vous gagnez via le dividende versé (les foncières cotées offrent généralement des rendements bruts de l'ordre de 6 % à 8 % en 2026) et via une éventuelle hausse du cours de l'action.",
      lose:"Vous perdez de l'argent si le cours recule, notamment lors d'une hausse des taux d'intérêt, d'une hausse de la vacance locative ou d'une crise sur un segment particulier (bureaux, commerces).",
      risks:["Risque actions : le cours peut être volatil au jour le jour, bien plus qu'une SCPI non cotée","Forte sensibilité aux taux d'intérêt, qui influencent à la fois le coût de la dette et la valorisation des actifs","Risque sectoriel propre à l'immobilier détenu (vacance des bureaux, difficultés du commerce physique, par exemple)"],
      monte:["Les taux d'intérêt baissent, ce qui allège le coût de la dette et soutient la valorisation des actifs","Le taux d'occupation du patrimoine s'améliore","La foncière annonce des acquisitions ou des cessions créatrices de valeur"],
      baisse:["Les taux d'intérêt remontent fortement","La vacance locative augmente, notamment sur les bureaux ou les commerces","Le niveau d'endettement de la foncière inquiète les investisseurs"],
      pros:["Liquidité immédiate, contrairement à une SCPI ou un OPCI : achat et vente en bourse à tout moment","Ticket d'entrée très accessible, à partir de quelques dizaines d'euros"],
      cons:["Volatilité boursière quotidienne bien supérieure à celle d'une SCPI ou d'un OPCI","Forte sensibilité aux taux d'intérêt, qui peut faire baisser le cours même si les loyers sont stables"],
      liquidite:"Très liquide : cotée en bourse, achat et vente possibles à tout moment pendant les heures d'ouverture des marchés.",
      notThis:"Ce n'est pas un équivalent d'une SCPI en termes de comportement : bien qu'investie dans les mêmes types d'actifs immobiliers, une foncière cotée se comporte en bourse comme une action, avec des variations de cours parfois marquées."
    },
    {
      id:'produit-capital-garanti', isin:null, name:'Produit structuré à capital garanti (exemple générique)',
      match:['produit a capital garanti','capital garanti','produit structure capital garanti'],
      ter:null, replication:'n/a',
      geo:[],
      whatIsIt:"Un produit combiné par une banque, composé d'une partie sécurisée qui vise à restituer votre capital à l'échéance, et d'une partie liée à un indice ou un panier de valeurs qui détermine le rendement potentiel.",
      gain:"Vous gagnez si le sous-jacent (par exemple un indice boursier) évolue favorablement selon la formule prévue au contrat, dans la limite d'un rendement souvent plafonné.",
      lose:"Vous ne perdez normalement pas votre capital si vous conservez le produit jusqu'à l'échéance prévue, mais vous perdez de l'argent en termes réels si le rendement obtenu reste inférieur à l'inflation, et vous risquez une décote si vous sortez avant l'échéance.",
      risks:["Risque de contrepartie : la garantie du capital dépend de la solidité financière de la banque émettrice, pas d'une garantie de l'État","Risque de liquidité : une sortie avant l'échéance peut entraîner une décote de plusieurs pourcents","Risque de rendement réel négatif une fois l'inflation et les frais pris en compte"],
      monte:["Le sous-jacent choisi (indice, panier d'actions) évolue favorablement selon la formule du produit","Vous conservez le produit jusqu'à son échéance maximale, sans besoin de retrait anticipé","Les conditions de marché à la souscription permettent d'obtenir un coupon ou un plafond de gain attractif"],
      baisse:["Le sous-jacent évolue défavorablement, limitant ou annulant le gain potentiel","Vous devez sortir avant l'échéance, ce qui peut entraîner une décote","Les frais cumulés (structuration, gestion) rognent le rendement net obtenu"],
      pros:["Capital protégé à l'échéance sous réserve de la solvabilité de la banque émettrice","Permet de s'exposer partiellement aux marchés financiers avec un risque de perte en capital limité si conservé jusqu'au terme"],
      cons:["Rendement souvent plafonné, ce qui peut limiter fortement le gain en cas de forte hausse des marchés","Produit complexe, avec des frais parfois peu visibles (marge de structuration incluse dans le prix)","La garantie ne joue qu'à l'échéance, pas en cas de sortie anticipée"],
      liquidite:"Faible avant l'échéance : une sortie anticipée est généralement possible mais à un prix de marché qui peut être inférieur au capital investi.",
      notThis:"Ce n'est pas un placement garanti à tout moment comme un livret : la protection du capital ne s'applique qu'à l'échéance finale prévue au contrat, et reste conditionnée à la solidité de la banque émettrice."
    },
    {
      id:'autocall', isin:null, name:'Autocall (produit structuré à remboursement anticipé conditionnel)',
      match:['autocall','produit structure autocall'],
      ter:null, replication:'n/a',
      geo:[],
      whatIsIt:"Un produit structuré qui verse un coupon conditionnel et peut être remboursé automatiquement par anticipation si un indice de référence atteint un certain niveau à une date d'observation, généralement chaque année.",
      gain:"Vous gagnez un coupon (souvent de l'ordre de 6 % à 10 % par an selon les conditions de marché à la souscription) si l'indice de référence est au-dessus du seuil fixé à une date d'observation, ce qui déclenche aussi le remboursement anticipé du capital.",
      lose:"Vous perdez une partie de votre capital si, à l'échéance finale, l'indice de référence est resté en dessous d'une barrière de protection (souvent fixée autour de 60 % de sa valeur de départ), la perte étant alors proportionnelle à la baisse de l'indice.",
      risks:["Risque de perte en capital en cas de forte baisse du sous-jacent sous la barrière de protection à l'échéance","Risque de contrepartie : le remboursement dépend de la solidité financière de la banque émettrice","Risque de liquidité : le produit est conçu pour être conservé jusqu'à un rappel ou l'échéance, une sortie anticipée se faisant à un prix de marché potentiellement défavorable"],
      monte:["L'indice de référence dépasse le seuil fixé à une date d'observation, déclenchant le rappel et le versement des coupons","Les marchés progressent régulièrement sans forte baisse intermédiaire","La volatilité élevée au moment de la souscription a permis de fixer un coupon attractif"],
      baisse:["L'indice de référence reste durablement sous son niveau de départ, retardant ou empêchant le rappel","Une crise boursière sévère fait chuter l'indice sous la barrière de protection à l'échéance finale","Vous devez revendre le produit avant son terme, à un prix potentiellement inférieur au capital investi"],
      pros:["Coupon potentiellement attractif par rapport à d'autres placements obligataires, même en l'absence de forte hausse du marché","Barrière de protection qui absorbe une baisse modérée du sous-jacent sans perte en capital à l'échéance"],
      cons:["Perte en capital possible et parfois importante en cas de crise boursière sévère (des indices ont perdu plus de 50 % de leur valeur lors de certaines crises passées)","Produit complexe dont la date de sortie (le rappel) est décidée par la formule du produit, pas par l'investisseur"],
      liquidite:"Faible : le produit est conçu pour être conservé jusqu'au rappel automatique ou à l'échéance finale, une revente anticipée se faisant à un prix de marché incertain.",
      notThis:"Ce n'est pas un placement à capital garanti : contrairement à une idée reçue entretenue par le mot « autocall », une baisse sévère et durable du marché peut faire perdre une partie significative du capital investi."
    }
  ];

  function norm(s){ return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim(); }

  function findFund(query){
    var q = norm(query);
    if(!q) return null;
    var best = null;
    FUNDS.forEach(function(f){
      var hit = f.match.some(function(m){ return norm(m).indexOf(q) !== -1 || q.indexOf(norm(m)) !== -1; }) || norm(f.isin) === q;
      if(hit && !best) best = f;
    });
    return best;
  }

  function list(items){
    return '<ul>' + items.map(function(i){ return '<li>' + i + '</li>'; }).join('') + '</ul>';
  }

  function renderFund(f){
    var geoBars = (f.geo || []).map(function(g, idx){
      var op = idx === 0 ? '1' : '0.4';
      return '<div class="bar-row"><span>' + g.c + '</span><div class="bar"><i style="width:' + g.p + '%;background:var(--accent);opacity:' + op + ';"></i></div><b>' + g.p + ' %</b></div>';
    }).join('');
    var geoBlock = geoBars
      ? '<div class="result-block"><h4>Répartition géographique</h4>' + geoBars + '</div>'
      : '<div class="result-block"><h4>Répartition géographique</h4><p>Non applicable pour ce type de produit.</p></div>';

    var idLine = (f.isin ? f.isin : 'Pas d\'ISIN (produit non coté sous cette forme)') +
      (f.replication && f.replication !== 'n/a' ? ' · réplication ' + f.replication : '');

    var costBlock;
    if(typeof f.ter === 'number'){
      var costo10k = Math.round(10000 * f.ter) / 100;
      var costo100k = Math.round(100000 * f.ter) / 100;
      costBlock = '<div class="cost-box"><b>' + f.ter.toFixed(2).replace('.', ',') + ' %</b> par an<br><span style="font-size:13px;color:var(--muted);">soit environ ' + costo10k + ' € /an sur 10 000 €, ou ' + costo100k + ' € /an sur 100 000 €</span></div>';
    } else {
      costBlock = '<div class="cost-box"><span style="font-size:13px;color:var(--muted);">Pas de frais annuels exprimés en pourcentage fixe pour ce type de produit : voir le détail ci-dessus (frais d\'intermédiaire, de souscription ou d\'entrée selon le cas).</span></div>';
    }

    return '' +
      '<div class="result-card">' +
        '<div class="result-head"><h3>' + f.name + '</h3><span class="result-isin">' + idLine + '</span></div>' +
        '<div class="result-grid">' +
          '<div class="result-block"><h4>Qu\'est-ce que c\'est ?</h4><p>' + f.whatIsIt + '</p></div>' +
          geoBlock +
          '<div class="result-block"><h4>Comment gagner de l\'argent ?</h4><p>' + f.gain + '</p></div>' +
          '<div class="result-block"><h4>Comment perdre de l\'argent ?</h4><p>' + f.lose + '</p></div>' +
          '<div class="result-block"><h4>Principaux risques</h4>' + list(f.risks) + '</div>' +
          '<div class="result-block"><h4>Combien ça coûte ?</h4>' + costBlock + '</div>' +
          '<div class="result-block"><h4>Le cours peut monter si</h4>' + list(f.monte) + '</div>' +
          '<div class="result-block"><h4>Le cours peut baisser si</h4>' + list(f.baisse) + '</div>' +
          '<div class="result-block"><h4>Avantages</h4>' + list(f.pros) + '</div>' +
          '<div class="result-block"><h4>Inconvénients</h4>' + list(f.cons) + '</div>' +
          '<div class="result-block"><h4>Mon argent est-il disponible facilement ?</h4><p>' + f.liquidite + '</p></div>' +
        '</div>' +
        '<div class="not-this"><b>Ce que ce produit n\'est pas :</b> ' + f.notThis + '</div>' +
      '</div>';
  }

  function renderEmpty(query){
    return '<div class="empty-result">Le produit « ' + query + ' » n\'est pas encore dans notre base de test (limitée à 5 produits pour cette version bêta). Essayez « World », « S&amp;P 500 », « Nasdaq », « Emerging » ou « CAC 40 ».</div>';
  }

  var ETF_GROUPS = [
    { id:'monde', label:'Monde', items:[
      { name:'MSCI World', query:'World', one:"Suit environ 1 500 grandes entreprises des pays développés.", risk:'modere', extra:false },
      { name:'MSCI Emerging Markets', query:'Emerging', one:"Regroupe les grandes économies en développement : Chine, Inde, Brésil...", risk:'eleve', extra:false },
      { name:'MSCI ACWI', query:'MSCI ACWI', one:"Comme MSCI World, mais inclut aussi les marchés émergents dans un seul indice.", risk:'modere', extra:true },
      { name:'FTSE All-World', query:'FTSE All-World', one:"Une alternative à MSCI World, avec une méthodologie et des frais parfois différents.", risk:'modere', extra:true },
      { name:'MSCI World Small Cap', query:'MSCI World Small Cap', one:"Cible les petites capitalisations des pays développés, plus dynamiques mais plus volatiles.", risk:'eleve', extra:true }
    ]},
    { id:'usa', label:'États-Unis', items:[
      { name:'S&P 500', query:'S&P 500', one:"Les 500 plus grandes entreprises cotées aux États-Unis.", risk:'modere', extra:false },
      { name:'Nasdaq-100', query:'Nasdaq', one:"Les 100 plus grandes entreprises non financières du Nasdaq, très orienté technologie.", risk:'eleve', extra:false },
      { name:'Russell 2000', query:'Russell 2000', one:"Réunit 2 000 petites capitalisations américaines, plus sensibles à l'économie domestique.", risk:'eleve', extra:true },
      { name:'S&P 500 Equal Weight', query:'S&P 500 Equal Weight', one:"Les mêmes 500 entreprises que le S&P 500, mais pondérées à parts égales plutôt que par taille.", risk:'modere', extra:true }
    ]},
    { id:'europe', label:'Europe', items:[
      { name:'STOXX Europe 600', query:'STOXX Europe 600', one:"600 grandes et moyennes entreprises européennes, toutes régions confondues.", risk:'modere', extra:false },
      { name:'CAC 40', query:'CAC 40', one:"Les 40 plus grandes entreprises cotées à la Bourse de Paris.", risk:'eleve', extra:false },
      { name:'EURO STOXX 50', query:'EURO STOXX 50', one:"Les 50 plus grandes entreprises de la zone euro uniquement.", risk:'modere', extra:true }
    ]},
    { id:'asie', label:'Asie', items:[
      { name:'MSCI Japan', query:'MSCI Japan', one:"Les grandes et moyennes entreprises cotées au Japon.", risk:'modere', extra:false },
      { name:'MSCI China', query:'MSCI China', one:"Les grandes entreprises chinoises cotées, y compris certaines cotées à l'étranger.", risk:'eleve', extra:false },
      { name:'MSCI India', query:'MSCI India', one:"Les grandes et moyennes entreprises cotées en Inde.", risk:'eleve', extra:true }
    ]}
  ];

  function riskLabel(r){ return r === 'eleve' ? 'Risque élevé' : 'Risque modéré'; }

  function renderProductCardMini(item){
    return '' +
      '<div class="product-card-mini">' +
        '<span class="risk-badge risk-' + item.risk + '">' + riskLabel(item.risk) + '</span>' +
        '<h4>' + item.name + '</h4>' +
        '<p>' + item.one + '</p>' +
        '<button class="decode-btn" data-query="' + item.query + '">Décoder</button>' +
      '</div>';
  }

  function renderEtfGroups(){
    var html = ETF_GROUPS.map(function(g){
      var cards = g.items.map(renderProductCardMini).join('');
      return '' +
        '<div class="group-heading">' + g.label + '</div>' +
        '<div class="product-row">' + cards + '</div>';
    }).join('');
    document.getElementById('etfGroups').innerHTML = html;
    wireDecodeButtons();
  }

  function wireDecodeButtons(){
    document.querySelectorAll('.decode-btn').forEach(function(b){
      b.addEventListener('click', function(){
        openProduct(b.getAttribute('data-query'));
      });
    });
  }

  var productScreen = document.getElementById('productScreen');
  var productScreenBody = document.getElementById('productScreenBody');
  var productBack = document.getElementById('productBack');

  function openProduct(query){
    var f = findFund(query);
    productScreenBody.innerHTML = f ? renderFund(f) : renderEmpty(query);
    productScreen.classList.add('open');
    productScreen.scrollTop = 0;
  }
  if(productBack) productBack.addEventListener('click', function(){
    productScreen.classList.remove('open');
  });

  document.querySelectorAll('.cat-tab').forEach(function(tab){
    tab.addEventListener('click', function(){
      document.querySelectorAll('.cat-tab').forEach(function(t){ t.classList.remove('active'); });
      document.querySelectorAll('.tab-panel').forEach(function(p){ p.style.display = 'none'; });
      tab.classList.add('active');
      var panel = document.querySelector('.tab-panel[data-tab="' + tab.getAttribute('data-tab') + '"]');
      if(panel){ panel.style.display = 'block'; }
    });
  });
  var etfPanel = document.querySelector('.tab-panel[data-tab="etf"]');
  document.querySelectorAll('.tab-panel').forEach(function(p){ p.style.display = 'none'; });
  if(etfPanel){ etfPanel.style.display = 'block'; }

  var glossaryScreen = document.getElementById('glossaryScreen');
  var glossaryOpen = document.getElementById('glossaryOpen');
  var glossaryBack = document.getElementById('glossaryBack');
  if(glossaryOpen) glossaryOpen.addEventListener('click', function(){
    glossaryScreen.classList.add('open');
    glossaryScreen.scrollTop = 0;
  });
  if(glossaryBack) glossaryBack.addEventListener('click', function(){
    glossaryScreen.classList.remove('open');
  });

  var OTHER_CATEGORIES = {
    actions: [
      { name:'Une action Apple', query:'Apple', one:"Une part de propriété dans Apple, cotée au Nasdaq.", risk:'eleve' },
      { name:'Une action LVMH', query:'LVMH', one:"Une part de propriété dans le groupe de luxe LVMH, cotée à Paris.", risk:'eleve' },
      { name:'Une action TotalEnergies', query:'TotalEnergies', one:"Une part de propriété dans le groupe énergétique, cotée à Paris.", risk:'eleve' }
    ],
    obligations: [
      { name:"Obligation d'État française (OAT)", query:'OAT', one:"Un prêt à l'État français, remboursé à échéance avec un intérêt fixe.", risk:'modere' },
      { name:'Obligation Trésor américain', query:'Treasury', one:"Un prêt à l'État américain, référence mondiale de la dette jugée sûre.", risk:'modere' },
      { name:"Obligation d'entreprise", query:'Obligation entreprise', one:"Un prêt à une entreprise, avec un taux plus élevé qu'un État mais un risque de défaut plus important.", risk:'eleve' }
    ],
    fonds: [
      { name:'Fonds actions géré activement', query:'Fonds actif', one:"Une équipe choisit les titres en visant à faire mieux qu'un indice, avec des frais plus élevés.", risk:'eleve' },
      { name:'Fonds diversifié', query:'Fonds diversifié', one:"Un mélange d'actions et d'obligations géré selon un profil de risque donné.", risk:'modere' },
      { name:'Fonds flexible', query:'Fonds flexible', one:"Un fonds qui ajuste librement sa part d'actions et d'obligations selon les conditions de marché.", risk:'modere' }
    ],
    monetaires: [
      { name:'Fonds monétaire euro', query:'Fonds monétaire', one:"Investit dans des titres de dette très court terme, vise la stabilité plutôt que la performance.", risk:'faible' },
      { name:'Compte à terme', query:'Compte à terme', one:"Votre argent est bloqué pour une durée fixée, contre un taux garanti à l'avance.", risk:'faible' },
      { name:'Livret bancaire réglementé', query:'Livret A', one:"Disponible à tout moment, plafonné, taux fixé par l'État.", risk:'faible' }
    ],
    immobilier: [
      { name:'SCPI', query:'SCPI', one:"Vous achetez des parts d'un parc immobilier locatif géré pour vous, sans gérer de bien vous-même.", risk:'modere' },
      { name:'OPCI', query:'OPCI', one:"Un mélange d'immobilier et d'actifs financiers plus liquides qu'une SCPI classique.", risk:'modere' },
      { name:'Foncière cotée (REIT)', query:'Foncière cotée', one:"Une entreprise immobilière cotée en bourse, aussi liquide qu'une action.", risk:'eleve' }
    ],
    structures: [
      { name:'Produit à capital garanti', query:'Capital garanti', one:"Votre capital de départ est protégé à échéance, en échange d'un potentiel de gain limité.", risk:'modere' },
      { name:'Autocall', query:'Autocall', one:"Un rendement conditionnel versé si un indice reste au-dessus d'un seuil fixé, avec un risque de perte en capital sinon.", risk:'eleve' }
    ]
  };

  function renderOtherCategory(key){
    var el = document.getElementById('grid-' + key);
    if(!el || !OTHER_CATEGORIES[key]) return;
    el.innerHTML = OTHER_CATEGORIES[key].map(function(it){
      return '' +
        '<div class="product-card">' +
          '<span class="risk-badge risk-' + it.risk + '">' + (it.risk === 'faible' ? 'Risque faible' : riskLabel(it.risk)) + '</span>' +
          '<span class="badge" style="position:static;align-self:flex-start;">Bientôt</span>' +
          '<h4>' + it.name + '</h4>' +
          '<p>' + it.one + '</p>' +
          '<button class="decode-btn" data-query="' + (it.query || it.name) + '">Décoder</button>' +
        '</div>';
    }).join('');
    wireDecodeButtons();
  }
  Object.keys(OTHER_CATEGORIES).forEach(renderOtherCategory);

  var input = document.getElementById('decoderInput');
  var btn = document.getElementById('decoderBtn');
  var screen = document.getElementById('decodeur-tool');
  var backBtn = document.getElementById('decoderBack');

  function openScreen(){
    screen.classList.add('open');
    document.body.style.overflow = 'hidden';
    screen.scrollTop = 0;
  }
  function closeScreen(){
    screen.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('a[href="#decodeur-tool"]').forEach(function(a){
    a.addEventListener('click', function(e){ e.preventDefault(); openScreen(); });
  });
  if(backBtn) backBtn.addEventListener('click', closeScreen);

  var soScreen = document.getElementById('secondOpinionScreen');
  var soBack = document.getElementById('soBack');
  var soCard = document.getElementById('second-opinion');
  var soDropzone = document.getElementById('soDropzone');
  var soFileInput = document.getElementById('soFileInput');
  var soFileInfo = document.getElementById('soFileInfo');
  var soForm = document.getElementById('soForm');
  var soConfirmation = document.getElementById('soConfirmation');
  var SO_MAX_SIZE = 10 * 1024 * 1024;
  var SO_ALLOWED_EXT = ['pdf','jpg','jpeg','png','doc','docx'];

  function openSecondOpinion(){
    if(!soScreen) return;
    soScreen.classList.add('open');
    document.body.style.overflow = 'hidden';
    soScreen.scrollTop = 0;
    if(soConfirmation) soConfirmation.style.display = 'none';
  }
  function closeSecondOpinion(){
    if(!soScreen) return;
    soScreen.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('a[href="#second-opinion-tool"]').forEach(function(a){
    a.addEventListener('click', function(e){ e.preventDefault(); openSecondOpinion(); });
  });
  if(soCard) soCard.addEventListener('click', function(e){
    if(e.target.closest('a[href="#second-opinion-tool"]')) return;
    openSecondOpinion();
  });
  if(soBack) soBack.addEventListener('click', closeSecondOpinion);

  var xrayScreen = document.getElementById('xrayScreen');
  var xrayBack = document.getElementById('xrayBack');
  var xrayCard = document.getElementById('comprendre');
  var xrayQuery = document.getElementById('xrayQuery');
  var xrayAmount = document.getElementById('xrayAmount');
  var xrayAddBtn = document.getElementById('xrayAddBtn');
  var xrayAddError = document.getElementById('xrayAddError');
  var xrayListEl = document.getElementById('xrayList');
  var xrayResultsEl = document.getElementById('xrayResults');
  var xrayProductList = document.getElementById('xrayProductList');
  var XRAY_MAX_ROWS = 4;
  var xrayRows = [];

  function openXray(){
    if(!xrayScreen) return;
    xrayScreen.classList.add('open');
    document.body.style.overflow = 'hidden';
    xrayScreen.scrollTop = 0;
  }
  function closeXray(){
    if(!xrayScreen) return;
    xrayScreen.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('a[href="#xray-tool"]').forEach(function(a){
    a.addEventListener('click', function(e){ e.preventDefault(); openXray(); });
  });
  if(xrayCard) xrayCard.addEventListener('click', function(e){
    if(e.target.closest('a[href="#xray-tool"]')) return;
    openXray();
  });
  if(xrayBack) xrayBack.addEventListener('click', closeXray);

  if(xrayProductList){
    xrayProductList.innerHTML = FUNDS.map(function(f){ return '<option value="' + f.name + '">'; }).join('');
  }

  function xrayShowError(msg){
    if(!xrayAddError) return;
    if(msg){ xrayAddError.textContent = msg; xrayAddError.classList.add('show'); }
    else { xrayAddError.textContent = ''; xrayAddError.classList.remove('show'); }
  }

  function xrayFormatEUR(n){
    return Math.round(n).toLocaleString('fr-FR') + ' €';
  }

  function xrayRenderList(){
    if(!xrayListEl) return;
    if(xrayRows.length === 0){
      xrayListEl.innerHTML = '<div class="empty-result">Aucun produit ajouté pour l\'instant. Ajoutez-en au moins 2 pour voir votre portefeuille combiné.</div>';
      return;
    }
    xrayListEl.innerHTML = xrayRows.map(function(row, idx){
      return '' +
        '<div class="xray-row">' +
          '<div class="xray-row-info"><b>' + row.fund.name + '</b><span>' + xrayFormatEUR(row.amount) + ' investis</span></div>' +
          '<button class="decode-btn" data-remove-idx="' + idx + '">Retirer</button>' +
        '</div>';
    }).join('');
    xrayListEl.querySelectorAll('[data-remove-idx]').forEach(function(b){
      b.addEventListener('click', function(){
        var i = parseInt(b.getAttribute('data-remove-idx'), 10);
        xrayRows.splice(i, 1);
        xrayRenderList();
        xrayRenderResults();
      });
    });
  }

  function xrayRenderResults(){
    if(!xrayResultsEl) return;
    if(xrayRows.length < 2){
      xrayResultsEl.innerHTML = xrayRows.length === 1
        ? '<div class="empty-result">Ajoutez au moins un second produit pour calculer le portefeuille combiné.</div>'
        : '';
      return;
    }

    var totalAmount = xrayRows.reduce(function(sum, r){ return sum + r.amount; }, 0);

    // Frais pondérés : uniquement sur les produits dont le champ "ter" est un nombre.
    var terRows = xrayRows.filter(function(r){ return typeof r.fund.ter === 'number'; });
    var noTerRows = xrayRows.filter(function(r){ return typeof r.fund.ter !== 'number'; });
    var terCoveredAmount = terRows.reduce(function(sum, r){ return sum + r.amount; }, 0);
    var annualFeeEUR = terRows.reduce(function(sum, r){ return sum + r.amount * r.fund.ter / 100; }, 0);
    var weightedTerPct = terCoveredAmount > 0 ? (annualFeeEUR / terCoveredAmount) * 100 : null;

    var feeBlock;
    if(weightedTerPct !== null){
      feeBlock = '<div class="cost-box"><b>' + weightedTerPct.toFixed(2).replace('.', ',') + ' %</b> par an, pondéré par montant<br>' +
        '<span style="font-size:13px;color:var(--muted);">soit environ ' + xrayFormatEUR(annualFeeEUR) + ' /an</span></div>';
    } else {
      feeBlock = '<div class="cost-box"><span style="font-size:13px;color:var(--muted);">Aucun des produits sélectionnés n\'a de frais annuels exprimés en pourcentage dans notre base.</span></div>';
    }
    if(noTerRows.length > 0){
      feeBlock += '<p class="xray-note">Non inclus dans ce calcul (pas de frais en % applicable dans notre base) : ' + noTerRows.map(function(r){ return r.fund.name; }).join(', ') + '. Ce calcul porte donc sur ' + xrayFormatEUR(terCoveredAmount) + ' sur les ' + xrayFormatEUR(totalAmount) + ' investis.</p>';
    }

    // Répartition géographique combinée, en % du portefeuille total (pas seulement des produits ayant un "geo").
    var countryTotals = {};
    var contributors = {};
    var noGeoRows = [];
    xrayRows.forEach(function(r){
      if(!r.fund.geo || r.fund.geo.length === 0){
        noGeoRows.push(r.fund.name);
        return;
      }
      r.fund.geo.forEach(function(g){
        var contrib = r.amount * (g.p / 100);
        countryTotals[g.c] = (countryTotals[g.c] || 0) + contrib;
        contributors[g.c] = contributors[g.c] || [];
        contributors[g.c].push({ name: r.fund.name, amount: contrib });
      });
    });

    var countries = Object.keys(countryTotals).sort(function(a, b){ return countryTotals[b] - countryTotals[a]; });
    var geoBars = countries.map(function(c, idx){
      var pct = totalAmount > 0 ? (countryTotals[c] / totalAmount) * 100 : 0;
      var op = idx === 0 ? '1' : '0.4';
      return '<div class="bar-row"><span>' + c + '</span><div class="bar"><i style="width:' + Math.min(pct, 100).toFixed(1) + '%;background:var(--accent);opacity:' + op + ';"></i></div><b>' + Math.round(pct) + ' %</b></div>';
    }).join('');

    var geoNote = '';
    if(noGeoRows.length > 0){
      geoNote = '<p class="xray-note">Pas de répartition géographique disponible dans notre base pour : ' + noGeoRows.join(', ') + '. Ces produits ne sont donc pas reflétés dans les pourcentages ci-dessus, qui restent calculés sur le montant total du portefeuille (' + xrayFormatEUR(totalAmount) + ').</p>';
    }

    // Alerte de concentration : un pays réel (on exclut le libellé générique "Reste") qui dépasse 50 % du portefeuille total.
    var alertHTML = '';
    countries.forEach(function(c){
      if(c === 'Reste') return;
      var pct = totalAmount > 0 ? (countryTotals[c] / totalAmount) * 100 : 0;
      if(pct > 50){
        var names = (contributors[c] || []).sort(function(a, b){ return b.amount - a.amount; }).map(function(x){ return x.name; });
        var uniqueNames = names.filter(function(n, i){ return names.indexOf(n) === i; });
        var namesText;
        if(uniqueNames.length === 1){
          namesText = uniqueNames[0] + ' vous expose';
        } else {
          namesText = uniqueNames.slice(0, -1).join(', ') + ' et ' + uniqueNames[uniqueNames.length - 1] + ' vous exposent';
        }
        alertHTML += '<div class="xray-alert"><b>Concentration géographique élevée</b>' + namesText + ' à ' + Math.round(pct) + ' % à ' + c + (uniqueNames.length > 1 ? ' à eux ' + (uniqueNames.length === 2 ? 'deux' : 'tous') : '') + '.</div>';
      }
    });

    xrayResultsEl.innerHTML = '' +
      '<div class="result-card">' +
        '<div class="result-head"><h3 style="font-size:18px;">Votre portefeuille combiné</h3></div>' +
        '<div class="result-grid">' +
          '<div class="result-block"><h4>Montant total investi</h4><p>' + xrayFormatEUR(totalAmount) + '</p></div>' +
          '<div class="result-block"><h4>Frais annuels moyens pondérés</h4>' + feeBlock + '</div>' +
          '<div class="result-block" style="grid-column:1/-1"><h4>Répartition géographique combinée</h4>' + (geoBars || '<p>Aucune donnée géographique disponible pour les produits sélectionnés.</p>') + geoNote + '</div>' +
        '</div>' +
        alertHTML +
      '</div>';
  }

  if(xrayAddBtn) xrayAddBtn.addEventListener('click', function(){
    xrayShowError('');
    var query = xrayQuery.value.trim();
    var amount = parseFloat(xrayAmount.value);

    if(!query){ xrayShowError('Indiquez le nom d\'un produit.'); return; }
    var fund = findFund(query);
    if(!fund){ xrayShowError('Produit introuvable dans notre bibliothèque. Essayez un nom proche de celui utilisé dans le Décodeur (ex. « World », « Apple », « SCPI »).'); return; }
    if(!amount || amount <= 0 || isNaN(amount)){ xrayShowError('Indiquez un montant investi supérieur à 0 €.'); return; }
    if(xrayRows.some(function(r){ return r.fund.id === fund.id; })){ xrayShowError('Ce produit est déjà dans votre portefeuille.'); return; }
    if(xrayRows.length >= XRAY_MAX_ROWS){ xrayShowError('Cette simulation est limitée à ' + XRAY_MAX_ROWS + ' produits.'); return; }

    xrayRows.push({ fund: fund, amount: amount });
    xrayQuery.value = '';
    xrayAmount.value = '';
    xrayRenderList();
    xrayRenderResults();
  });

  xrayRenderList();

  var MARKET_EPISODES = [
    {
      id: 'fed-hike-sept-2026',
      tag: 'Banque centrale',
      date: '16 septembre 2026',
      title: 'La Fed relève ses taux pour la première fois depuis 2023',
      teaser: "Contre l'attente de nombreux investisseurs, la banque centrale américaine a resserré sa politique monétaire plutôt que de la baisser.",
      faits: "Le 16 septembre 2026, la Réserve fédérale américaine (la « Fed ») a relevé son taux directeur de 0,25 point, le portant dans une fourchette de 3,75 % à 4,00 %. C'est la première hausse depuis 2023. Les projections publiées ce jour-là par la Fed (le « dot plot ») indiquent que d'autres hausses sont jugées probables avant la fin de l'année.",
      pourquoi: "La Fed a justifié cette décision par une inflation encore jugée trop élevée : les indices de prix restaient nettement au-dessus de son objectif de 2 %, malgré une économie américaine solide (chômage stable entre 4,2 % et 4,5 %, dépenses des ménages résilientes, forte croissance de la productivité). Plutôt que de laisser filer les prix, la banque centrale a choisi de resserrer sa politique monétaire pour tenter d'y revenir plus vite.",
      mecanisme: "Quand une banque centrale relève ses taux directeurs, emprunter de l'argent devient plus coûteux pour les banques, les entreprises et les ménages, ce qui ralentit en principe la consommation et l'investissement et freine la hausse des prix. En contrepartie, les placements sans risque deviennent plus rémunérateurs, ce qui peut rendre les actions relativement moins attractives par comparaison, et renforce généralement la devise du pays concerné : dans les heures qui ont suivi l'annonce, le dollar s'est effectivement renforcé, et l'or, qui ne verse aucun intérêt, a d'abord reculé avant de se stabiliser."
    },
    {
      id: 'opec-oil-aug-2026',
      tag: 'Pétrole',
      date: 'Août 2026',
      title: "Pourquoi plus de pétrole n'a pas fait baisser les prix",
      teaser: "L'OPEP+ a annoncé une hausse de sa production, mais le prix du baril n'a presque pas bougé. La raison ne tient pas qu'à l'offre et à la demande.",
      faits: "Le 2 août 2026, sept pays membres de l'OPEP+ ont validé une hausse de leur production de 188 000 barils par jour à partir de septembre. Le baril de Brent est pourtant resté autour de 87 dollars, et le brut américain proche de 84 dollars, à peine affecté par cette annonce.",
      pourquoi: "Plusieurs tensions géopolitiques ont neutralisé une partie de cette hausse de l'offre. Le détroit d'Ormuz, par lequel transite environ un cinquième du pétrole mondial, a connu une navigation perturbée sur fond de tensions entre l'Iran et les États-Unis. La mer Rouge est devenue plus risquée, obligeant certains navires à contourner l'Afrique. Des attaques de drones ont endommagé des infrastructures pétrolières et des raffineries russes, réduisant les capacités d'exportation de la Russie.",
      mecanisme: "Le prix du pétrole ne dépend pas seulement du volume produit, mais aussi de la capacité réelle à l'acheminer jusqu'aux raffineries et aux consommateurs. Quand les routes de transport ou les capacités d'exportation d'un grand producteur se grippent, une hausse de production ailleurs peut simplement combler ce manque plutôt que de faire baisser les prix. C'est ce qui explique que les automobilistes n'aient guère vu de différence à la pompe : en Californie, l'essence a atteint 5,49 dollars le gallon début août 2026."
    },
    {
      id: 'france-oat-cac40-2026',
      tag: 'Taux souverains',
      date: 'Fin août - septembre 2026',
      title: 'Pourquoi les taux français ont grimpé, et le CAC 40 avec',
      teaser: "Les craintes sur le budget de l'État ont fait bondir le coût de la dette française, et pesé sur la Bourse de Paris.",
      faits: "Fin août et début septembre 2026, le rendement de l'OAT (l'obligation d'État française) à 10 ans a atteint son plus haut niveau depuis 2008, autour de 4,5 % à 4,6 %, dans un climat de nervosité autour des finances publiques et d'une procédure budgétaire jugée particulièrement tendue. Le 27 août 2026, les valeurs bancaires françaises ont nettement reculé à la Bourse de Paris, BNP Paribas perdant environ 4 % en séance, ce qui a entraîné le CAC 40 dans le rouge.",
      pourquoi: "Quand les investisseurs doutent de la capacité d'un État à maîtriser ses finances publiques, ils exigent un taux d'intérêt plus élevé pour continuer à lui prêter de l'argent : c'est ce qu'on appelle la « prime de risque ». Une incertitude budgétaire prolongée pousse ainsi mécaniquement les taux à la hausse.",
      mecanisme: "Cette hausse des taux pèse en particulier sur les banques, qui détiennent une grande quantité de dette d'État dans leurs bilans et sont directement exposées à la santé financière du pays qui l'a émise. Une inquiétude sur le budget se transmet ainsi rapidement du marché obligataire (les taux) au marché actions (la Bourse), notamment via le secteur bancaire, qui sert souvent de baromètre à la confiance des investisseurs envers un pays."
    },
    {
      id: 'eurusd-sept-2026',
      tag: 'Devises',
      date: 'Début septembre 2026',
      title: "Pourquoi le dollar s'est renforcé face à l'euro",
      teaser: "Deux mouvements séparés, les taux américains et les inquiétudes françaises, se sont combinés pour faire reculer l'euro.",
      faits: "Début septembre 2026, l'euro est tombé face au dollar à environ 1,1565 dollar, un plus bas de quatre semaines, tandis que l'indice du dollar (qui mesure sa force face à un panier de devises) progressait à 99,35 points.",
      pourquoi: "Deux mouvements se sont combinés. D'un côté, l'inflation américaine a accéléré sur un mois (+0,4 % contre +0,1 % le mois précédent), ce qui a renforcé les anticipations d'une Fed plus stricte sur ses taux, et donc soutenu le dollar. De l'autre, la Banque centrale européenne avait bien relevé son propre taux de dépôt à 2,5 % la semaine précédente, mais sans donner d'indication claire sur la suite, ce qui a privé l'euro du soutien qu'aurait apporté un discours plus tranché. Les inquiétudes autour du budget français, au même moment, ont ajouté une pression supplémentaire sur la monnaie unique.",
      mecanisme: "Le taux de change entre deux devises reflète en grande partie l'écart de rémunération et de confiance entre les deux zones économiques. Quand les taux américains montent, ou sont attendus à la hausse plus vite que les taux européens, ou quand la confiance dans une des deux zones s'effrite (ici, les doutes sur les finances publiques françaises), les capitaux se déplacent vers la devise jugée la plus rémunératrice ou la plus sûre à court terme, ce qui fait mécaniquement varier le taux de change."
    }
  ];

  var marketsScreen = document.getElementById('marketsScreen');
  var marketsBack = document.getElementById('marketsBack');
  var marketsCard = document.getElementById('marches');
  var marketsGrid = document.getElementById('marketsGrid');
  var marketEpisodeScreen = document.getElementById('marketEpisodeScreen');
  var marketEpisodeBack = document.getElementById('marketEpisodeBack');
  var marketEpisodeBody = document.getElementById('marketEpisodeBody');

  function openMarkets(){
    if(!marketsScreen) return;
    marketsScreen.classList.add('open');
    document.body.style.overflow = 'hidden';
    marketsScreen.scrollTop = 0;
  }
  function closeMarkets(){
    if(!marketsScreen) return;
    marketsScreen.classList.remove('open');
    document.body.style.overflow = '';
  }
  function closeMarketEpisode(){
    if(!marketEpisodeScreen) return;
    marketEpisodeScreen.classList.remove('open');
  }
  function renderMarketsGrid(){
    if(!marketsGrid) return;
    marketsGrid.innerHTML = MARKET_EPISODES.map(function(ep){
      return '' +
        '<div class="mk-card">' +
          '<span class="mk-tag">' + ep.tag + '</span>' +
          '<h4>' + ep.title + '</h4>' +
          '<span class="mk-date">' + ep.date + '</span>' +
          '<p>' + ep.teaser + '</p>' +
          '<button class="decode-btn" data-episode="' + ep.id + '">Lire →</button>' +
        '</div>';
    }).join('');
    marketsGrid.querySelectorAll('[data-episode]').forEach(function(b){
      b.addEventListener('click', function(){ openMarketEpisode(b.getAttribute('data-episode')); });
    });
  }
  function openMarketEpisode(id){
    var ep = MARKET_EPISODES.filter(function(e){ return e.id === id; })[0];
    if(!ep || !marketEpisodeBody || !marketEpisodeScreen) return;
    marketEpisodeBody.innerHTML = '' +
      '<div class="kicker">' + ep.tag + ' · ' + ep.date + '</div>' +
      '<h2 class="serif" style="font-weight:480;font-size:28px;margin:10px 0 24px;">' + ep.title + '</h2>' +
      '<div class="mk-article">' +
        '<h4>Ce qui s\'est passé</h4><p>' + ep.faits + '</p>' +
        '<h4>Pourquoi</h4><p>' + ep.pourquoi + '</p>' +
        '<h4>Le mécanisme, en langage clair</h4><p>' + ep.mecanisme + '</p>' +
      '</div>';
    marketEpisodeScreen.classList.add('open');
    marketEpisodeScreen.scrollTop = 0;
  }
  document.querySelectorAll('a[href="#markets-tool"]').forEach(function(a){
    a.addEventListener('click', function(e){ e.preventDefault(); openMarkets(); });
  });
  if(marketsCard) marketsCard.addEventListener('click', function(e){
    if(e.target.closest('a[href="#markets-tool"]')) return;
    openMarkets();
  });
  if(marketsBack) marketsBack.addEventListener('click', closeMarkets);
  if(marketEpisodeBack) marketEpisodeBack.addEventListener('click', closeMarketEpisode);

  renderMarketsGrid();

  function soFileExt(name){
    var parts = (name || '').split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
  }
  function soFormatSize(bytes){
    return bytes >= 1024*1024 ? (Math.round(bytes/1024/1024*10)/10) + ' Mo' : Math.round(bytes/1024) + ' Ko';
  }
  var soSelectedFile = null;
  function soHandleFile(file){
    if(!file){ return; }
    var ext = soFileExt(file.name);
    if(SO_ALLOWED_EXT.indexOf(ext) === -1){
      soSelectedFile = null;
      soFileInfo.className = 'so-file-info error';
      soFileInfo.style.display = 'block';
      soFileInfo.textContent = 'Format non accepté (' + (ext || 'inconnu') + '). Utilisez un PDF, une image JPG/PNG ou un fichier Word.';
      return;
    }
    if(file.size > SO_MAX_SIZE){
      soSelectedFile = null;
      soFileInfo.className = 'so-file-info error';
      soFileInfo.style.display = 'block';
      soFileInfo.textContent = 'Ce fichier dépasse 10 Mo (' + soFormatSize(file.size) + '). Choisissez un fichier plus léger.';
      return;
    }
    soSelectedFile = file;
    soFileInfo.className = 'so-file-info';
    soFileInfo.style.display = 'block';
    soFileInfo.textContent = 'Fichier sélectionné : ' + file.name + ' (' + soFormatSize(file.size) + ')';
  }
  if(soDropzone && soFileInput){
    soDropzone.addEventListener('click', function(){ soFileInput.click(); });
    soDropzone.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); soFileInput.click(); }
    });
    soFileInput.addEventListener('change', function(){
      if(soFileInput.files && soFileInput.files[0]) soHandleFile(soFileInput.files[0]);
    });
    soDropzone.addEventListener('dragover', function(e){ e.preventDefault(); soDropzone.classList.add('dragover'); });
    soDropzone.addEventListener('dragleave', function(){ soDropzone.classList.remove('dragover'); });
    soDropzone.addEventListener('drop', function(e){
      e.preventDefault();
      soDropzone.classList.remove('dragover');
      if(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) soHandleFile(e.dataTransfer.files[0]);
    });
  }

  function soShowError(fieldId, errorId, show){
    var field = document.getElementById(fieldId);
    var err = document.getElementById(errorId);
    if(field) field.style.borderColor = show ? 'var(--accent)' : 'var(--border)';
    if(err) err.classList.toggle('show', !!show);
  }
  function soValidateEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Envoi du Second Opinion : le document part directement dans l'espace privé Kompa,
  // puis Kompa reçoit un e-mail avec un lien vers le document.
  function soSetSendError(msg){
    var el = document.getElementById('soSendError');
    if(!el) return;
    el.textContent = msg || '';
    el.classList.toggle('show', !!msg);
  }
  function soPostJson(url, payload){
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function(res){
      return res.json().catch(function(){ return {}; }).then(function(data){
        if(!res.ok) throw new Error(data.error || 'L\'envoi n\'a pas abouti. Réessayez dans quelques minutes.');
        return data;
      });
    });
  }
  var soSending = false;

  if(soForm) soForm.addEventListener('submit', function(e){
    e.preventDefault();
    if(soSending) return;
    soSetSendError('');

    var civilityEl = document.getElementById('soCivility');
    var civility = civilityEl ? civilityEl.value : '';
    var firstName = document.getElementById('soFirstName').value.trim();
    var lastName = document.getElementById('soLastName').value.trim();
    var email = document.getElementById('soEmail').value.trim();
    var phone = document.getElementById('soPhone').value.trim();
    var message = document.getElementById('soMessage').value.trim();
    var consentEl = document.getElementById('soConsent');
    var websiteEl = document.getElementById('soWebsite');

    var fileOk = !!soSelectedFile;
    var firstNameOk = firstName.length > 0;
    var lastNameOk = lastName.length > 0;
    var emailOk = soValidateEmail(email);
    var phoneOk = phone.replace(/[^0-9]/g,'').length >= 6;
    var consentOk = !!(consentEl && consentEl.checked);

    if(!fileOk){
      soFileInfo.className = 'so-file-info error';
      soFileInfo.style.display = 'block';
      if(!soFileInfo.textContent || soFileInfo.textContent.indexOf('Fichier sélectionné') === 0){
        soFileInfo.textContent = 'Ajoutez le document que vous avez reçu.';
      }
    }
    soShowError('soFirstName','soFirstNameError', !firstNameOk);
    soShowError('soLastName','soLastNameError', !lastNameOk);
    soShowError('soEmail','soEmailError', !emailOk);
    soShowError('soPhone','soPhoneError', !phoneOk);
    var consentErr = document.getElementById('soConsentError');
    if(consentErr) consentErr.classList.toggle('show', !consentOk);

    if(!fileOk || !firstNameOk || !lastNameOk || !emailOk || !phoneOk || !consentOk){
      if(!fileOk){ soDropzone.focus(); }
      else if(!firstNameOk){ document.getElementById('soFirstName').focus(); }
      else if(!lastNameOk){ document.getElementById('soLastName').focus(); }
      else if(!emailOk){ document.getElementById('soEmail').focus(); }
      else if(!phoneOk){ document.getElementById('soPhone').focus(); }
      else if(consentEl){ consentEl.focus(); }
      return;
    }

    var file = soSelectedFile;
    var ext = soFileExt(file.name);
    var submitBtn = document.getElementById('soSubmitBtn');
    var submitLabel = submitBtn ? submitBtn.textContent : '';
    soSending = true;
    if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Envoi en cours…'; }

    soPostJson('/api/second-opinion/start', {
      civility: civility, firstName: firstName, lastName: lastName,
      email: email, phone: phone, message: message,
      fileName: file.name, fileSize: file.size, ext: ext,
      consent: true, website: websiteEl ? websiteEl.value : ''
    }).then(function(start){
      var body = new FormData();
      body.append('cacheControl', '3600');
      body.append('', new File([file], 'proposition.' + ext, { type: start.contentType }));
      var headers = { 'x-upsert': 'false' };
      if(start.apiKey) headers.apikey = start.apiKey;
      return fetch(start.uploadUrl, { method: 'PUT', headers: headers, body: body }).then(function(res){
        if(!res.ok) throw new Error('Le document n\'a pas pu être envoyé. Vérifiez votre connexion et réessayez.');
        return soPostJson('/api/second-opinion/finish', { id: start.id });
      });
    }).then(function(){
      soForm.style.display = 'none';
      if(soConfirmation){
        soConfirmation.style.display = 'block';
        soConfirmation.scrollIntoView({behavior:'smooth', block:'nearest'});
      }
    }).catch(function(err){
      soSetSendError(err && err.message ? err.message : 'L\'envoi n\'a pas abouti. Réessayez dans quelques minutes.');
    }).then(function(){
      soSending = false;
      if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = submitLabel; }
    });
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      if(productScreen.classList.contains('open')){ productScreen.classList.remove('open'); }
      else if(glossaryScreen.classList.contains('open')){ glossaryScreen.classList.remove('open'); }
      else if(soScreen && soScreen.classList.contains('open')){ closeSecondOpinion(); }
      else if(xrayScreen && xrayScreen.classList.contains('open')){ closeXray(); }
      else if(marketEpisodeScreen && marketEpisodeScreen.classList.contains('open')){ closeMarketEpisode(); }
      else if(marketsScreen && marketsScreen.classList.contains('open')){ closeMarkets(); }
      else if(screen.classList.contains('open')){ closeScreen(); }
    }
  });

  if(btn) btn.addEventListener('click', function(){ if(input.value) openProduct(input.value); });
  if(input) input.addEventListener('keydown', function(e){ if(e.key === 'Enter' && input.value) openProduct(input.value); });

  renderEtfGroups();
})();
