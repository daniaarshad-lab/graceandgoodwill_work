export interface Region {
  name: string;
  counties: County[];
}

export interface County {
  name: string;
  towns: string[];
}

export const regions: Region[] = [
  {
    name: "South East",
    counties: [
      {
        name: "Surrey",
        towns: ["Addlestone","Ash Vale","Ashtead","Bagshot","Banstead","Betchworth","Byfleet","Camberley","Caterham","Charlwood","Chertsey","Cranleigh","Dorking","East Horsley","East Molesey","Egham","Epsom","Esher","Ewell","Farnham","Frimley","Godalming","Godstone","Guildford","Haslemere","Headley","Hersham","Hindhead","Horley","Leatherhead","Lingfield","Milford","Oxted","Redhill","Reigate","Salfords","Send","Shepperton","Staines","Stanwell","Sunbury-on-Thames","Tadworth","Thames Ditton","Walton-on-Thames","Warlingham","West Byfleet","West Molesey","Weybridge","Windlesham","Woking"],
      },
      {
        name: "West Sussex",
        towns: ["Arundel","Billingshurst","Bognor Regis","Broadbridge Heath","Burgess Hill","Chichester","Crawley","East Grinstead","Findon","Hassocks","Haywards Heath","Henfield","Horsham","Hurstpierpoint","Lancing","Littlehampton","Midhurst","Petworth","Pulborough","Rusper","Selsey","Sompting","Southwater","Southwick","Steyning","Storrington","Worthing"],
      },
      {
        name: "Hampshire",
        towns: ["Aldershot","Alresford","Alton","Andover","Anstey","Ashurst","Basingstoke","Bishops Waltham","Brockenhurst","Chandler's Ford","Chineham","Denmead","Eastleigh","Emsworth","Fareham","Farnborough","Fleet","Fordingbridge","Gosport","Havant","Headley Down","Heckfield","Hook","Kings Worthy","Lee-on-the-Solent","Liphook","Liss","Locks Heath","Lymington","Lyndhurst","Marchwood","Milford on Sea","New Milton","Odiham","Petersfield","Portchester","Portsmouth","Ringwood","Romsey","Silchester","Southampton","Southsea","Stockbridge","Swanmore","Tadley","Titchfield","Totton","Waterlooville","Winchester","Yateley"],
      },
      {
        name: "Oxfordshire",
        towns: ["Abingdon","Banbury","Benson","Bicester","Bloxham","Burford","Carterton","Chalgrove","Chinnor","Chipping Norton","Didcot","Drayton","Eynsham","Faringdon","Henley on Thames","Kidlington","Kingston Bagpuize","Langford","Leafield","Lewknor","Nettlebed","Oxford","Shrivenham","Sutton Courtenay","Thame","Upper Heyford","Wallingford","Wantage","Wheatley","Witney","Woodstock"],
      },
      {
        name: "Kent",
        towns: ["Ashford","Birchington","Borough Green","Brasted","Broadstairs","Canterbury","Chatham","Cobham","Cranbrook","Dartford","Deal","Dover","Dymchurch","Edenbridge","Faversham","Folkestone","Gillingham","Gravesend","Greenhithe","Hawkinge","Herne Bay","Hildenborough","Hoo","Horton Kirby","Hythe","Lenham","Littlebourne","Longfield","Maidstone","Margate","Meopham","Minster","New Romney","Northfleet","Otford","Paddock Wood","Pembury","Rainham","Ramsgate","Rochester","Royal Tunbridge Wells","Sandwich","Sevenoaks","Sheerness","Shoreham","Sittingbourne","Snodland","Stansted","Staplehurst","Strood","Swanley","Tenterden","Tonbridge","Waltham","West Malling","Westerham","Whitfield","Whitstable","Yalding"],
      },
      {
        name: "Buckinghamshire",
        towns: ["Amersham","Aylesbury","Beaconsfield","Bellingdon","Bletchley","Bourne End","Brill","Broughton","Buckingham","Burnham","Chalfont St Giles","Chalfont St Peter","Chesham","Gerrards Cross","Great Missenden","Haddenham","Halton","Hanslope","High Wycombe","Iver","Little Chalfont","Marlow","Milton Keynes","Newport Pagnell","Olney","Princes Risborough","Soulbury","Stoke Poges","Stony Stratford","Wendover","Winslow","Woburn Sands"],
      },
      {
        name: "East Sussex",
        towns: ["Battle","Brighton","Crowborough","Eastbourne","Etchingham","Forest Row","Hailsham","Hartfield","Hastings","Heathfield","Hove","Lewes","Newhaven","Polegate","Robertsbridge","Rottingdean","Rye","Seaford","Sedlescombe","Uckfield","Wadhurst"],
      },
      {
        name: "Berkshire",
        towns: ["Aldermaston","Ascot","Binfield","Bracknell","Cookham","Crowthorne","Donnington","Earley","Hungerford","Maidenhead","Newbury","Pangbourne","Reading","Ruscombe","Sandhurst","Slough","Sunninghill","Swallowfield","Thatcham","Theale","Twyford","Windsor","Winnersh","Wokingham","Woodley"],
      },
    ],
  },
  {
    name: "South West",
    counties: [
      {
        name: "Somerset",
        towns: ["Bath","Bridgwater","Burnham-on-Sea","Frome","Glastonbury","Minehead","Shepton Mallet","Street","Taunton","Wells","Weston-super-Mare","Yeovil"],
      },
      {
        name: "Devon",
        towns: ["Barnstaple","Bideford","Crediton","Dartmouth","Dawlish","Exeter","Exmouth","Honiton","Ilfracombe","Kingsbridge","Newton Abbot","Okehampton","Paignton","Plymouth","Salcombe","Sidmouth","Tavistock","Teignmouth","Tiverton","Torquay","Totnes"],
      },
      {
        name: "Gloucestershire",
        towns: ["Cheltenham","Chipping Campden","Cirencester","Dursley","Gloucester","Lydney","Moreton-in-Marsh","Nailsworth","Newent","Stroud","Tewkesbury","Tetbury"],
      },
      {
        name: "Wiltshire",
        towns: ["Amesbury","Bradford on Avon","Calne","Chippenham","Devizes","Malmesbury","Marlborough","Melksham","Salisbury","Swindon","Tidworth","Trowbridge","Warminster","Westbury"],
      },
      {
        name: "Dorset",
        towns: ["Blandford Forum","Bournemouth","Bridport","Christchurch","Dorchester","Ferndown","Poole","Portland","Sherborne","Swanage","Wareham","Weymouth","Wimborne Minster"],
      },
      {
        name: "Cornwall",
        towns: ["Bodmin","Bude","Camborne","Falmouth","Helston","Launceston","Liskeard","Newquay","Padstow","Penzance","Redruth","St Austell","St Ives","Truro","Wadebridge"],
      },
      {
        name: "Bristol",
        towns: ["Bristol City Centre","Clifton","Filton","Fishponds","Henleaze","Horfield","Kingswood","Nailsea","Portishead","Thornbury","Westbury-on-Trym","Weston-super-Mare","Yate"],
      },
    ],
  },
  {
    name: "West Midlands",
    counties: [
      {
        name: "Worcestershire",
        towns: ["Bromsgrove","Droitwich Spa","Evesham","Kidderminster","Malvern","Pershore","Redditch","Stourport-on-Severn","Tenbury Wells","Upton upon Severn","Worcester"],
      },
      {
        name: "Herefordshire",
        towns: ["Bromyard","Hereford","Kington","Ledbury","Leominster","Ross-on-Wye"],
      },
      {
        name: "Warwickshire",
        towns: ["Atherstone","Bedworth","Kenilworth","Leamington Spa","Nuneaton","Rugby","Shipston-on-Stour","Solihull","Stratford-upon-Avon","Warwick"],
      },
      {
        name: "Shropshire",
        towns: ["Bridgnorth","Ludlow","Market Drayton","Oswestry","Shrewsbury","Telford","Whitchurch"],
      },
      {
        name: "Staffordshire",
        towns: ["Burntwood","Burton upon Trent","Cannock","Leek","Lichfield","Newcastle-under-Lyme","Rugeley","Stafford","Stoke-on-Trent","Tamworth","Uttoxeter"],
      },
      {
        name: "West Midlands",
        towns: ["Birmingham","Coventry","Dudley","Sandwell","Solihull","Walsall","Wolverhampton"],
      },
    ],
  },
  {
    name: "Eastern",
    counties: [
      {
        name: "Essex",
        towns: ["Basildon","Billericay","Braintree","Brentwood","Chelmsford","Clacton-on-Sea","Colchester","Epping","Grays","Harlow","Harwich","Maldon","Rayleigh","Rochford","Saffron Walden","Southend-on-Sea","Thurrock","Witham"],
      },
      {
        name: "Hertfordshire",
        towns: ["Berkhamsted","Bishop's Stortford","Borehamwood","Broxbourne","Cheshunt","Harpenden","Hatfield","Hemel Hempstead","Hertford","Hoddesdon","Letchworth","Potters Bar","Rickmansworth","St Albans","Stevenage","Watford","Welwyn Garden City"],
      },
      {
        name: "Cambridgeshire",
        towns: ["Cambridge","Chatteris","Ely","Huntingdon","March","Peterborough","Ramsey","St Ives","St Neots","Wisbech"],
      },
      {
        name: "Norfolk",
        towns: ["Attleborough","Cromer","Dereham","Diss","Downham Market","Fakenham","Great Yarmouth","Holt","King's Lynn","North Walsham","Norwich","Swaffham","Thetford","Wells-next-the-Sea","Wymondham"],
      },
      {
        name: "Suffolk",
        towns: ["Aldeburgh","Beccles","Bury St Edmunds","Felixstowe","Haverhill","Ipswich","Lowestoft","Mildenhall","Newmarket","Saxmundham","Southwold","Stowmarket","Sudbury","Woodbridge"],
      },
      {
        name: "Bedfordshire",
        towns: ["Ampthill","Bedford","Biggleswade","Dunstable","Flitwick","Leighton Buzzard","Luton","Sandy","Shefford","Woburn"],
      },
    ],
  },
  {
    name: "North East",
    counties: [
      {
        name: "Northumberland",
        towns: ["Alnwick","Ashington","Berwick-upon-Tweed","Blyth","Cramlington","Hexham","Morpeth","Prudhoe"],
      },
      {
        name: "Durham",
        towns: ["Barnard Castle","Bishop Auckland","Chester-le-Street","Consett","Darlington","Durham","Newton Aycliffe","Peterlee","Seaham","Spennymoor","Stanley"],
      },
      {
        name: "Tyne and Wear",
        towns: ["Gateshead","Jarrow","Newcastle upon Tyne","North Shields","South Shields","Sunderland","Washington","Whitley Bay"],
      },
    ],
  },
  {
    name: "Wales",
    counties: [
      {
        name: "Dyfed",
        towns: ["Aberaeron","Aberystwyth","Ammanford","Cardigan","Carmarthen","Fishguard","Haverfordwest","Lampeter","Llandeilo","Llandovery","Llandrindod Wells","Milford Haven","Pembroke","Tenby"],
      },
      {
        name: "Mid Glamorgan",
        towns: ["Aberdare","Bridgend","Caerphilly","Llantrisant","Maesteg","Merthyr Tydfil","Mountain Ash","Pontypridd","Porthcawl","Rhondda","Treorchy"],
      },
      {
        name: "Gwynedd",
        towns: ["Bangor","Barmouth","Blaenau Ffestiniog","Caernarfon","Criccieth","Dolgellau","Harlech","Llandudno","Llanrwst","Porthmadog","Pwllheli"],
      },
      {
        name: "West Glamorgan",
        towns: ["Neath","Port Talbot","Swansea"],
      },
      {
        name: "Clwyd",
        towns: ["Colwyn Bay","Denbigh","Flint","Holywell","Llangollen","Mold","Prestatyn","Rhyl","Ruthin","Wrexham"],
      },
      {
        name: "South Glamorgan",
        towns: ["Barry","Cardiff","Cowbridge","Llantwit Major","Penarth"],
      },
    ],
  },
  {
    name: "Scotland",
    counties: [
      {
        name: "City of Edinburgh",
        towns: ["Edinburgh","Leith","Morningside","Portobello","Stockbridge"],
      },
      {
        name: "Fife",
        towns: ["Cupar","Dunfermline","Glenrothes","Kirkcaldy","Leven","St Andrews"],
      },
      {
        name: "Perth and Kinross",
        towns: ["Aberfeldy","Blairgowrie","Crieff","Kinross","Perth","Pitlochry"],
      },
      {
        name: "City of Aberdeen",
        towns: ["Aberdeen","Dyce","Kingswells","Portlethen","Westhill"],
      },
      {
        name: "Stirling and Falkirk",
        towns: ["Alloa","Bo'ness","Bridge of Allan","Callander","Denny","Falkirk","Grangemouth","Larbert","Stirling"],
      },
      {
        name: "City of Glasgow",
        towns: ["Bearsden","Bishopbriggs","Clydebank","East Kilbride","Glasgow","Hamilton","Motherwell","Paisley","Rutherglen"],
      },
      {
        name: "City of Dundee",
        towns: ["Arbroath","Brechin","Carnoustie","Dundee","Forfar","Montrose"],
      },
    ],
  },
  {
    name: "London",
    counties: [
      {
        name: "Central London",
        towns: ["Camden","City of London","Islington","Kensington & Chelsea","Lambeth","Southwark","Tower Hamlets","Wandsworth","Westminster"],
      },
      {
        name: "Greater London",
        towns: ["Barking","Barnet","Bexley","Brent","Bromley","Croydon","Ealing","Enfield","Greenwich","Hackney","Hammersmith","Haringey","Harrow","Havering","Hillingdon","Hounslow","Kingston upon Thames","Lewisham","Merton","Newham","Redbridge","Richmond upon Thames","Sutton","Waltham Forest"],
      },
    ],
  },
  {
    name: "East Midlands",
    counties: [
      {
        name: "Northamptonshire",
        towns: ["Brackley","Corby","Daventry","Kettering","Northampton","Rushden","Towcester","Wellingborough"],
      },
      {
        name: "Leicestershire",
        towns: ["Ashby-de-la-Zouch","Coalville","Hinckley","Leicester","Loughborough","Lutterworth","Market Harborough","Melton Mowbray","Oadby"],
      },
      {
        name: "Derbyshire",
        towns: ["Alfreton","Ashbourne","Bakewell","Belper","Buxton","Chesterfield","Derby","Glossop","Heanor","Ilkeston","Long Eaton","Matlock","Ripley","Swadlincote"],
      },
      {
        name: "Lincolnshire",
        towns: ["Boston","Bourne","Gainsborough","Grantham","Horncastle","Lincoln","Louth","Market Rasen","Sleaford","Skegness","Spalding","Stamford"],
      },
      {
        name: "Nottinghamshire",
        towns: ["Arnold","Beeston","Eastwood","Hucknall","Kirkby in Ashfield","Mansfield","Newark-on-Trent","Nottingham","Retford","Southwell","Worksop"],
      },
      {
        name: "Rutland",
        towns: ["Oakham","Uppingham"],
      },
    ],
  },
  {
    name: "Yorkshire and the Humber",
    counties: [
      {
        name: "South Yorkshire",
        towns: ["Barnsley","Doncaster","Rotherham","Sheffield"],
      },
      {
        name: "West Yorkshire",
        towns: ["Bradford","Brighouse","Dewsbury","Halifax","Harrogate","Huddersfield","Ilkley","Keighley","Leeds","Morley","Ossett","Pontefract","Pudsey","Wakefield","Wetherby"],
      },
      {
        name: "North Yorkshire",
        towns: ["Filey","Harrogate","Knaresborough","Malton","Northallerton","Pickering","Richmond","Ripon","Scarborough","Selby","Skipton","Thirsk","Whitby","York"],
      },
      {
        name: "East Riding of Yorkshire",
        towns: ["Beverley","Bridlington","Driffield","Goole","Hornsea","Hull","Market Weighton","Pocklington","Withernsea"],
      },
    ],
  },
  {
    name: "North West",
    counties: [
      {
        name: "Greater Manchester",
        towns: ["Altrincham","Bolton","Bury","Manchester","Oldham","Rochdale","Salford","Stockport","Tameside","Trafford","Wigan"],
      },
      {
        name: "Lancashire",
        towns: ["Accrington","Blackburn","Blackpool","Burnley","Chorley","Clitheroe","Fleetwood","Lancaster","Lytham St Annes","Morecambe","Nelson","Preston","Rawtenstall","Skelmersdale"],
      },
      {
        name: "Cumbria",
        towns: ["Barrow-in-Furness","Carlisle","Kendal","Keswick","Penrith","Ulverston","Whitehaven","Windermere","Workington"],
      },
      {
        name: "Cheshire",
        towns: ["Chester","Congleton","Crewe","Ellesmere Port","Knutsford","Macclesfield","Middlewich","Nantwich","Northwich","Runcorn","Sandbach","Warrington","Widnes","Wilmslow","Winsford"],
      },
      {
        name: "Merseyside",
        towns: ["Birkenhead","Bootle","Kirkby","Liverpool","Prescot","Southport","St Helens","Wallasey","Widnes"],
      },
    ],
  },
  {
    name: "Northern Ireland",
    counties: [
      {
        name: "County Derry / Londonderry",
        towns: ["Coleraine","Derry","Limavady","Magherafelt","Portrush","Portstewart"],
      },
    ],
  },
  {
    name: "Channel Islands",
    counties: [
      {
        name: "Channel Islands",
        towns: ["Guernsey","Jersey"],
      },
    ],
  },
];
