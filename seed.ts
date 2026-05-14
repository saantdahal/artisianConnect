import "dotenv/config";
import { prisma } from "./lib/prisma";
import { auth } from "./app/lib/auth";

const dataset = [
  {
    "product_id": "TX-001",
    "name": "Fathia Beauty handwoven cotton–rayon kente scarf (4 inch width)",
    "category": "textiles",
    "subcategory": "scarf",
    "country_or_region_of_origin": "Ghana",
    "materials": [
      "cotton",
      "rayon"
    ],
    "dimensions": "11 cm W x 161 cm H",
    "price_range": null,
    "image_name": "p295650_2a_150.jpg",
    "image_url": "https://images1.novica.net/pictures/5/p295650_2a_150.jpg",
    "image_license_or_attribution": "Product image from NOVICA product page; rights/licence not specified (assume \u00a9 NOVICA/artisan; reference use).",
    "short_description": "A narrow-strip kente-inspired scarf woven on a traditional hand loom using a cotton\u2013rayon blend, featuring colourful motifs associated with Akan kente traditions.",
    "keywords": [
      "kente",
      "scarf",
      "hand loom",
      "woven",
      "Akan",
      "Ghana",
      "cotton",
      "rayon",
      "fair trade"
    ],
    "source_url": "https://www.novica.com/p/handwoven-cotton-blend-kente-cloth-scarf-4/295650/"
  },
  {
    "product_id": "TX-002",
    "name": "Steel Blue Gossamer 100% baby alpaca wrap scarf",
    "category": "textiles",
    "subcategory": "wrap scarf",
    "country_or_region_of_origin": "Peru",
    "materials": [
      "alpaca (baby alpaca fleece)"
    ],
    "dimensions": "150 cm L x 45 cm W",
    "price_range": null,
    "image_name": "p306261_2_150.jpg",
    "image_url": "https://images1.novica.net/pictures/4/p306261_2_150.jpg",
    "image_license_or_attribution": "Product image from NOVICA product page; rights/licence not specified (assume \u00a9 NOVICA/artisan; reference use).",
    "short_description": "A lightweight wrap scarf made from baby alpaca fleece, finished by hand in a muted steel-blue tone with a subtle wavy texture.",
    "keywords": [
      "alpaca",
      "wrap scarf",
      "Peru",
      "woven",
      "natural fibre",
      "hand finished"
    ],
    "source_url": "https://www.novica.com/p/100-percent-baby-alpaca-wrap-scarf-in-steel/306261/"
  },
  {
    "product_id": "TX-003",
    "name": "Stylish Green hand-woven fringed silk ikat scarf",
    "category": "textiles",
    "subcategory": "ikat scarf",
    "country_or_region_of_origin": "Uzbekistan",
    "materials": [
      "silk"
    ],
    "dimensions": "165 cm L x 48 cm W (fringe 12 cm)",
    "price_range": null,
    "image_name": "p437552_2_150.jpg",
    "image_url": "https://images1.novica.net/pictures/45/p437552_2_150.jpg",
    "image_license_or_attribution": "Product image from NOVICA product page; rights/licence not specified (assume \u00a9 NOVICA/artisan; reference use).",
    "short_description": "A fringed scarf handwoven from silk and decorated with traditional ikat patterning in olive-green and ivory hues.",
    "keywords": [
      "ikat",
      "silk scarf",
      "hand woven",
      "Uzbekistan",
      "fringe",
      "textile heritage"
    ],
    "source_url": "https://www.novica.com/p/hand-woven-fringed-silk-ikat-scarf-in-green/437552/"
  },
  {
    "product_id": "PT-001",
    "name": "Jade Elephant Parade celadon ceramic mug (9 oz)",
    "category": "pottery",
    "subcategory": "ceramic mug",
    "country_or_region_of_origin": "Thailand",
    "materials": [
      "celadon ceramic"
    ],
    "dimensions": "9.3 cm H x 12 cm W x 9 cm D; 275 ml (9 oz)",
    "price_range": null,
    "image_name": "p221071_2_150.jpg",
    "image_url": "https://images1.novica.net/pictures/9/p221071_2_150.jpg",
    "image_license_or_attribution": "Product image from NOVICA product page; rights/licence not specified (assume \u00a9 NOVICA/artisan; reference use).",
    "short_description": "A handmade celadon ceramic mug featuring elephants in low relief and a crackled green glaze associated with celadon traditions.",
    "keywords": [
      "celadon",
      "mug",
      "ceramic",
      "Thailand",
      "handmade",
      "elephant motif",
      "glaze"
    ],
    "source_url": "https://www.novica.com/en-ca/p/handcrafted-glazed-celadon-ceramic-mug-9-oz/221071/"
  },
  {
    "product_id": "PT-002",
    "name": "Web of Dew hand-painted ceramic mug (13 oz)",
    "category": "pottery",
    "subcategory": "ceramic mug",
    "country_or_region_of_origin": "Mexico (Guanajuato)",
    "materials": [
      "ceramic"
    ],
    "dimensions": "10 cm H x 9 cm Diam.; 400 ml (13 oz)",
    "price_range": null,
    "image_name": "p401685_2_150.jpg",
    "image_url": "https://images1.novica.net/pictures/7/p401685_2_150.jpg",
    "image_license_or_attribution": "Product image from NOVICA product page; rights/licence not specified (assume \u00a9 NOVICA/artisan; reference use).",
    "short_description": "A handcrafted ceramic mug hand-painted with a trellis-like motif in blue and brown, made using long-established regional techniques.",
    "keywords": [
      "ceramic",
      "hand painted",
      "mug",
      "Mexico",
      "Guanajuato",
      "tableware"
    ],
    "source_url": "https://www.novica.com/p/artisan-crafted-ceramic-mug-web-of-dew/401685/"
  },
  {
    "product_id": "PT-003",
    "name": "Piping Hot artisan-crafted ceramic mugs from Java (pair)",
    "category": "pottery",
    "subcategory": "ceramic mugs (pair)",
    "country_or_region_of_origin": "Indonesia (Java)",
    "materials": [
      "ceramic"
    ],
    "dimensions": "Each: 11 cm H x 12 cm W x 9 cm D; 250 ml (8 oz)",
    "price_range": null,
    "image_name": "p411046_2_150.jpg",
    "image_url": "https://images1.novica.net/pictures/10/p411046_2_150.jpg",
    "image_license_or_attribution": "Product image from NOVICA product page; rights/licence not specified (assume \u00a9 NOVICA/artisan; reference use).",
    "short_description": "A pair of ceramic mugs glazed in pale blue with splashed blue patterns, handcrafted and oven-fired in Java.",
    "keywords": [
      "ceramic",
      "mugs",
      "Java",
      "Indonesia",
      "handmade",
      "glazed"
    ],
    "source_url": "https://www.novica.com/p/artisan-crafted-ceramic-mugs-from-java-pair/411046/"
  },
  {
    "product_id": "WD-001",
    "name": "Ancient Mischief hand-carved suar wood mask of an ancient devil",
    "category": "woodwork",
    "subcategory": "carved mask",
    "country_or_region_of_origin": "Indonesia (Bali)",
    "materials": [
      "suar wood"
    ],
    "dimensions": "20 cm H x 16 cm W x 8 cm D",
    "price_range": null,
    "image_name": "p467402_2_150.jpg",
    "image_url": "https://images1.novica.net/pictures/10/p467402_2_150.jpg",
    "image_license_or_attribution": "Product image from NOVICA product page; rights/licence not specified (assume \u00a9 NOVICA/artisan; reference use).",
    "short_description": "A hand-carved Balinese mask made from suar wood, designed as wall d\u00e9cor and inspired by stylised \u2018ancient devil\u2019 imagery in local carving traditions.",
    "keywords": [
      "mask",
      "wood carving",
      "suar wood",
      "Bali",
      "Indonesia",
      "wall decor"
    ],
    "source_url": "https://www.novica.com/p/balinese-made-hand-carved-suar-wood-mask-of/467402/"
  },
  {
    "product_id": "WD-002",
    "name": "Totem Head hand-carved albesia wood totem wall mask",
    "category": "woodwork",
    "subcategory": "carved wall mask",
    "country_or_region_of_origin": "Indonesia (Bali)",
    "materials": [
      "albesia wood",
      "acrylic paint"
    ],
    "dimensions": "24 cm H x 18 cm W x 13 cm D",
    "price_range": null,
    "image_name": "p378742_2_150.jpg",
    "image_url": "https://images1.novica.net/pictures/10/p378742_2_150.jpg",
    "image_license_or_attribution": "Product image from NOVICA product page; rights/licence not specified (assume \u00a9 NOVICA/artisan; reference use).",
    "short_description": "A carved wall mask inspired by totem heads, finished with a distressed paint effect to emphasise bold facial features.",
    "keywords": [
      "totem",
      "mask",
      "albesia wood",
      "hand carved",
      "Bali",
      "distressed finish"
    ],
    "source_url": "https://www.novica.com/p/hand-carved-wood-totem-wall-mask-from-indonesia/378742/"
  },
  {
    "product_id": "WD-003",
    "name": "King of Elephants hand-carved kadam wood elephant sculpture with gold tone",
    "category": "woodwork",
    "subcategory": "wood sculpture",
    "country_or_region_of_origin": "India",
    "materials": [
      "kadam wood",
      "paint (gold tone)"
    ],
    "dimensions": "12 cm H x 15 cm W x 4 cm D",
    "price_range": null,
    "image_name": "p285098_2a_400.jpg",
    "image_url": "https://images1.novica.net/pictures/15/p285098_2a_400.jpg",
    "image_license_or_attribution": "Product image from UNICEF Market item page (image hosted on images1.novica.net); rights/licence not specified (assume \u00a9 maker / marketplace; reference use).",
    "short_description": "A small hand-carved elephant sculpture finished with an antiqued surface and gold-toned accents, designed as a decorative home accent.",
    "keywords": [
      "elephant",
      "kadam wood",
      "hand carved",
      "India",
      "sculpture",
      "decor"
    ],
    "source_url": "https://www.market.unicefusa.org/p/hand-carved-kadam-wood-elephant-sculpture/U485616/"
  },
  {
    "product_id": "MT-001",
    "name": "Mornings Past hand-hammered copper mugs with handles (pair)",
    "category": "metalwork",
    "subcategory": "copper mugs (pair)",
    "country_or_region_of_origin": "India",
    "materials": [
      "copper"
    ],
    "dimensions": "Each: 12 cm H x 8 cm Diam.; capacity 500 ml (16 oz)",
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see product page.",
    "short_description": "A pair of hand-hammered copper mugs intended for beverages, made as artisan metal tableware with a textured finish.",
    "keywords": [
      "copper",
      "hand hammered",
      "mugs",
      "India",
      "metal tableware"
    ],
    "source_url": "https://www.novica.com/p/hand-crafted-textured-copper-mugs-with-handles/410286/"
  },
  {
    "product_id": "MT-002",
    "name": "Green Tosca decorative copper bowl with hammered finish",
    "category": "metalwork",
    "subcategory": "copper bowl",
    "country_or_region_of_origin": "Indonesia (Java)",
    "materials": [
      "copper"
    ],
    "dimensions": "Bowl: 10 cm H x 13 cm Diam.; 600 ml (20 oz)",
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see product page.",
    "short_description": "A hand-crafted copper bowl painted green externally, with a hammered interior surface intended for serving or display.",
    "keywords": [
      "copper bowl",
      "hammered",
      "Java",
      "Indonesia",
      "food safe",
      "decor"
    ],
    "source_url": "https://www.novica.com/gb/p/decorative-copper-bowl-with-hammered-finish/411976/"
  },
  {
    "product_id": "MT-003",
    "name": "Luxurious Memories beaded brass elephant sculpture",
    "category": "metalwork",
    "subcategory": "brass sculpture",
    "country_or_region_of_origin": "India",
    "materials": [
      "brass",
      "resin",
      "plastic beads"
    ],
    "dimensions": "10.5 cm H x 16.5 cm W x 5 cm D",
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see product page.",
    "short_description": "A brass elephant sculpture embellished with decorative bead and resin accents, designed as a home accent drawing on symbolic associations of elephants with memory and prosperity.",
    "keywords": [
      "brass",
      "elephant",
      "sculpture",
      "beads",
      "India",
      "metalwork"
    ],
    "source_url": "https://www.novica.com/p/handcrafted-beaded-brass-sculpture-of-a-traditional/431949/"
  },
  {
    "product_id": "JW-001",
    "name": "Feathered Leaves sterling silver filigree leaf dangle earrings",
    "category": "jewellery",
    "subcategory": "dangle earrings",
    "country_or_region_of_origin": "Thailand",
    "materials": [
      "925 sterling silver"
    ],
    "dimensions": "6 cm L x 2.3 cm W",
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see product page.",
    "short_description": "Sterling silver filigree dangle earrings shaped as feathered leaves, made using filigree techniques associated with regional silversmithing traditions.",
    "keywords": [
      "sterling silver",
      "filigree",
      "earrings",
      "Thailand",
      "leaf motif",
      "handmade"
    ],
    "source_url": "https://www.novica.com/p/sterling-silver-filigree-leaf-dangle-earrings/284317/"
  },
  {
    "product_id": "JW-002",
    "name": "Junin Glam sterling silver filigree earrings",
    "category": "jewellery",
    "subcategory": "hook earrings",
    "country_or_region_of_origin": "Peru",
    "materials": [
      "sterling silver"
    ],
    "dimensions": "4 cm L x 2.3 cm W x 0.1 cm D",
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see product page.",
    "short_description": "Sterling silver filigree earrings featuring moon motifs above fine filigree patterns, crafted by hand in a Peruvian filigree tradition.",
    "keywords": [
      "sterling silver",
      "filigree",
      "earrings",
      "Peru",
      "moon motifs"
    ],
    "source_url": "https://www.novica.com/p/sterling-silver-filigree-earrings-from-peru/227156/"
  },
  {
    "product_id": "JW-003",
    "name": "Pepita sterling silver filigree dangle earrings",
    "category": "jewellery",
    "subcategory": "dangle earrings",
    "country_or_region_of_origin": "Indonesia (Bali)",
    "materials": [
      "sterling silver"
    ],
    "dimensions": null,
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see product page.",
    "short_description": "Sterling silver dangle earrings made using filigree methods, presented as artisan silver jewellery from Bali.",
    "keywords": [
      "sterling silver",
      "filigree",
      "earrings",
      "Bali",
      "Indonesia",
      "handmade"
    ],
    "source_url": "https://www.novica.com/p/sterling-silver-filigree-dangle-earrings-from-bali/266079/"
  },
  {
    "product_id": "BK-001",
    "name": "Kuba basket (y1953-126 a-b)",
    "category": "basketry",
    "subcategory": "lidded basket",
    "country_or_region_of_origin": "Democratic Republic of the Congo (Kuba)",
    "materials": [
      "cane",
      "raffia",
      "dye"
    ],
    "dimensions": "h. 27.0 cm; diam. 30.0 cm",
    "price_range": null,
    "image_name": "default.jpg",
    "image_url": "https://media.artmuseum.princeton.edu/iiif/3/collection/INV008362/full/max/0/default.jpg",
    "image_license_or_attribution": "Princeton University Art Museum image download for a public-domain work (museum provides free access to PD images).",
    "short_description": "A lidded woven basket attributed to a Kuba artist, made from cane and raffia with dyed patterning.",
    "keywords": [
      "basketry",
      "Kuba",
      "raffia",
      "cane",
      "woven",
      "DRC",
      "lidded basket"
    ],
    "source_url": "https://artmuseum.princeton.edu/art/collections/objects/24309"
  },
  {
    "product_id": "BK-002",
    "name": "Lumbee coiled pine-needle basket (NMAI_389365)",
    "category": "basketry",
    "subcategory": "coiled basket",
    "country_or_region_of_origin": "USA (North Carolina; Lumbee)",
    "materials": [
      "pine needles",
      "cotton twine/string"
    ],
    "dimensions": "29.2 x 17.8 cm",
    "price_range": null,
    "image_name": "268027_000.700x700.jpg",
    "image_url": "https://americanindian.si.edu/webmultimedia/10225/107/268027_000.700x700.jpg",
    "image_license_or_attribution": "National Museum of the American Indian record; metadata usage noted as CC0 (see record), but record also states usage conditions apply\u2014treat as source-attributed image.",
    "short_description": "A coiled basket made from pine needles and cotton twine/string, documented in the National Museum of the American Indian\u2019s collections database.",
    "keywords": [
      "basket",
      "coiled",
      "pine needles",
      "Lumbee",
      "North Carolina",
      "NMAI"
    ],
    "source_url": "https://americanindian.si.edu/collections-search/object/NMAI_389365"
  },
  {
    "product_id": "BK-003",
    "name": "Washoe basket (NMAI_143594)",
    "category": "basketry",
    "subcategory": "coiled basket",
    "country_or_region_of_origin": "USA (Nevada; Washoe)",
    "materials": [
      "willow",
      "bracken fern root"
    ],
    "dimensions": null,
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see museum record.",
    "short_description": "A coiled basket made from willow and bracken fern root, listed in the National Museum of the American Indian collections search.",
    "keywords": [
      "basket",
      "coiled",
      "willow",
      "Washoe",
      "Nevada",
      "NMAI"
    ],
    "source_url": "https://americanindian.si.edu/collections-search/object/NMAI_143594"
  },
  {
    "product_id": "PC-001",
    "name": "Paper-cutting Lady (Chinese paper-cut), 132 x 128 cm",
    "category": "paper crafts",
    "subcategory": "paper-cut wall decoration",
    "country_or_region_of_origin": "China (Shaanxi Province)",
    "materials": [
      "paper"
    ],
    "dimensions": "132 x 128 cm",
    "price_range": null,
    "image_name": "01597.jpg",
    "image_url": "https://ich.unesco.org/img/photo/src/01597.jpg",
    "image_license_or_attribution": "\u00a9 Xunyi County, Shaanxi Province; photograph by Ku Shulan; via UNESCO Intangible Cultural Heritage photo page.",
    "short_description": "A large-scale Chinese paper-cut artwork depicting a \u2018paper-cutting lady\u2019, documented by UNESCO as part of the Chinese paper-cut element.",
    "keywords": [
      "paper-cut",
      "jianzhi",
      "folk art",
      "China",
      "UNESCO",
      "decorative"
    ],
    "source_url": "https://ich.unesco.org/en/photo-pop-up-00973?photoID=01597"
  },
  {
    "product_id": "PC-002",
    "name": "Paper Doll Dining Room (1883)",
    "category": "paper crafts",
    "subcategory": "paper dollhouse scene",
    "country_or_region_of_origin": "Germany",
    "materials": [
      "printed paper",
      "wood engraving",
      "hand colouring"
    ],
    "dimensions": "11 \u00d7 9 1/16 \u00d7 3/8 in. (28 \u00d7 23 \u00d7 1 cm); opening: 11 \u00d7 17 5/16 in. (28 \u00d7 44 cm)",
    "price_range": null,
    "image_name": "main-image",
    "image_url": "https://collectionapi.metmuseum.org/api/collection/v1/iiif/916269/2297247/main-image",
    "image_license_or_attribution": "Public Domain (The Metropolitan Museum of Art).",
    "short_description": "A three-dimensional paper dollhouse \u2018dining room\u2019 scene assembled from printed and hand-coloured paper, held in the Met\u2019s collection and marked Public Domain.",
    "keywords": [
      "paper dolls",
      "paper model",
      "Germany",
      "19th century",
      "Met",
      "public domain"
    ],
    "source_url": "https://www.metmuseum.org/art/collection/search/916269"
  },
  {
    "product_id": "PC-003",
    "name": "Paper Cut-Out (10th century)",
    "category": "paper crafts",
    "subcategory": "paper cut-out",
    "country_or_region_of_origin": "Egypt",
    "materials": [
      "paper"
    ],
    "dimensions": "H. 3.8 cm; W. 19.7 cm",
    "price_range": null,
    "image_name": "main-image",
    "image_url": "https://collectionapi.metmuseum.org/api/collection/v1/iiif/452903/876976/main-image",
    "image_license_or_attribution": "Public Domain (The Metropolitan Museum of Art).",
    "short_description": "A small paper cut-out object dated to the 10th century, presented as a public-domain image in the Met\u2019s collection.",
    "keywords": [
      "paper cut-out",
      "Egypt",
      "10th century",
      "Met",
      "public domain"
    ],
    "source_url": "https://www.metmuseum.org/art/collection/search/452903"
  },
  {
    "product_id": "GL-001",
    "name": "Carousel unique handblown recycled-glass vase",
    "category": "glass",
    "subcategory": "blown glass vase",
    "country_or_region_of_origin": "Guatemala",
    "materials": [
      "recycled glass"
    ],
    "dimensions": "23.67 cm H x 12.67 cm Diam.",
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see product page.",
    "short_description": "A handblown vase made from recycled glass, described as watertight and produced in Guatemala.",
    "keywords": [
      "blown glass",
      "recycled glass",
      "vase",
      "Guatemala",
      "handblown"
    ],
    "source_url": "https://www.novica.com/p/unique-handblown-glass-recycled-vase-carousel/178868/"
  },
  {
    "product_id": "GL-002",
    "name": "Vase (Italian, Venice (Murano), probably 19th century) \u2014 The Met",
    "category": "glass",
    "subcategory": "glass vase",
    "country_or_region_of_origin": "Italy (Venice; Murano)",
    "materials": [
      "glass"
    ],
    "dimensions": "Overall: 21.6 \u00d7 16.2 cm",
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see museum record.",
    "short_description": "A 19th-century glass vase attributed to Venice (Murano), recorded in the Metropolitan Museum of Art\u2019s collection as glass.",
    "keywords": [
      "Murano",
      "Venice",
      "glass",
      "vase",
      "Met museum"
    ],
    "source_url": "https://www.metmuseum.org/art/collection/search/186220"
  },
  {
    "product_id": "GL-003",
    "name": "Goblet (Italian (Venice), ca. 1500\u20131525) \u2014 The Met",
    "category": "glass",
    "subcategory": "glass goblet",
    "country_or_region_of_origin": "Italy (Venice)",
    "materials": [
      "nonlead glass",
      "enamel",
      "gilding"
    ],
    "dimensions": "H. 3.2 cm; diam. of rim 8.2 cm",
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see museum record.",
    "short_description": "A Venetian glass goblet dated ca. 1500\u20131525, described as blown and decorated with enamelling and gilding in the Met\u2019s collection.",
    "keywords": [
      "Venetian glass",
      "goblet",
      "enamelled",
      "gilt",
      "Met museum"
    ],
    "source_url": "https://www.metmuseum.org/art/collection/search/460755"
  },
  {
    "product_id": "LE-001",
    "name": "Classic Inspiration embossed leather leaves on mohena wood treasure chest box",
    "category": "leather",
    "subcategory": "leather-covered box",
    "country_or_region_of_origin": "Peru",
    "materials": [
      "leather",
      "mohena wood",
      "metal hinges/lock (not specified)"
    ],
    "dimensions": "5 cm H x 15 cm W x 11 cm D",
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see product page.",
    "short_description": "A small treasure chest box made from mohena wood and decorated with embossed leather leaves, presented as a decorative storage box.",
    "keywords": [
      "leather",
      "embossed",
      "treasure chest",
      "Peru",
      "decorative box",
      "storage"
    ],
    "source_url": "https://www.novica.com/p/embossed-leather-leaves-on-mohena-wood-treasure/273210/"
  },
  {
    "product_id": "LE-002",
    "name": "Spice-colored zippered tooled leather coin purse",
    "category": "leather",
    "subcategory": "coin purse",
    "country_or_region_of_origin": "Mexico",
    "materials": [
      "tooled leather",
      "metal zipper"
    ],
    "dimensions": null,
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see product page.",
    "short_description": "A small coin purse made from tooled leather and finished with a metal zipper, designed for everyday carry.",
    "keywords": [
      "coin purse",
      "tooled leather",
      "zipper",
      "Mexico",
      "handcrafted"
    ],
    "source_url": "https://www.novica.com/p/spice-colored-zippered-leather-coin-purse/413147/"
  },
  {
    "product_id": "LE-003",
    "name": "Soft leather brown shoulder bag with bronze fixtures",
    "category": "leather",
    "subcategory": "shoulder bag",
    "country_or_region_of_origin": "Brazil",
    "materials": [
      "leather",
      "metal fittings (bronze fixtures)"
    ],
    "dimensions": "Bag: 16 cm H x 26 cm W x 4 cm D",
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see product page.",
    "short_description": "A compact leather shoulder bag with a slim profile and metal fixtures, designed as an everyday cross-body or shoulder bag.",
    "keywords": [
      "leather bag",
      "shoulder bag",
      "Brazil",
      "handbag",
      "bronze hardware"
    ],
    "source_url": "https://www.novica.com/p/soft-leather-brown-shoulder-bag-with-bronze/267238/"
  },
  {
    "product_id": "BD-001",
    "name": "Flower Harmony in Rose handmade glass bead bracelet",
    "category": "beadwork",
    "subcategory": "beaded wristband bracelet",
    "country_or_region_of_origin": "Guatemala",
    "materials": [
      "glass beads",
      "nylon filament"
    ],
    "dimensions": "17.78 cm min L \u2013 19.05 cm max L x 2.54 cm W",
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see product page.",
    "short_description": "A beaded wristband bracelet with pink, bronze and white glass beads arranged into floral patterns, secured with a beaded button closure.",
    "keywords": [
      "glass beads",
      "bracelet",
      "Guatemala",
      "floral",
      "handcrafted",
      "beadwork"
    ],
    "source_url": "https://www.novica.com/p/handmade-glass-bead-bracelet-flower-harmony/405174/"
  },
  {
    "product_id": "BD-002",
    "name": "Handcrafted modern recycled glass beaded bracelet (macram\u00e9-knotted)",
    "category": "beadwork",
    "subcategory": "beaded bracelet",
    "country_or_region_of_origin": "Ghana",
    "materials": [
      "recycled glass",
      "nylon cord"
    ],
    "dimensions": "19 cm L x 1 cm W",
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see product page.",
    "short_description": "A bracelet using recycled glass beads knotted with macram\u00e9 techniques on a nylon cord, presented as an eco-friendly accessory.",
    "keywords": [
      "recycled glass",
      "beads",
      "macram\u00e9",
      "Ghana",
      "bracelet",
      "eco-friendly"
    ],
    "source_url": "https://www.novica.com/p/handcrafted-modern-recycled-glass-beaded-bracelet/208785/"
  },
  {
    "product_id": "BD-003",
    "name": "Good Faith handmade recycled glass beaded bracelet",
    "category": "beadwork",
    "subcategory": "chunky beaded bracelet",
    "country_or_region_of_origin": "Ghana",
    "materials": [
      "recycled glass beads"
    ],
    "dimensions": "19 cm L x 2 cm W",
    "price_range": null,
    "image_name": null,
    "image_url": "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop",
    "image_license_or_attribution": "No direct image URL captured in this research snapshot; see product page.",
    "short_description": "A chunky bracelet made with recycled glass beads in an alternating pattern, described as eco-friendly beadwork.",
    "keywords": [
      "recycled glass",
      "bracelet",
      "Ghana",
      "chunky",
      "beads",
      "sustainable"
    ],
    "source_url": "https://www.novica.com/p/handmade-recycled-glass-beaded-bracelet-good/403163/"
  }
];

async function seed() {
    console.log("Seeding Database with handicraft products...");
    
    // Create Categories
    const categories = [...new Set(dataset.map((d) => d.category))];
    const categoryMap = new Map<string, string>();
    
    for (const catName of categories) {
        const slug = catName.toLowerCase().replace(/\s+/g, '-');
        let cat = await prisma.category.findUnique({ where: { slug } });
        if (!cat) {
            cat = await prisma.category.create({
                data: {
                    name: catName.charAt(0).toUpperCase() + catName.slice(1),
                    slug: slug,
                }
            });
            console.log("Created category:", cat.name);
        } else {
            console.log("Category exists:", cat.name);
        }
        categoryMap.set(catName, cat.id);
    }
    
    // Create Artisans
    const artisans = [
        { email: "artisan1@example.com", name: "Alice Artisan", password: "Password123!", storeName: "Alice's Handicrafts", description: "Beautiful textiles and pottery crafted with love." },
        { email: "artisan2@example.com", name: "Bob Builder", password: "Password123!", storeName: "Bob's Wood & Stone", description: "Hand-carved woodwork and metalwork." },
        { email: "artisan3@example.com", name: "Carol Crafts", password: "Password123!", storeName: "Carol's Creations", description: "Exquisite jewelry, beadwork, and glass." },
    ];
    
    const artisanIds: string[] = [];
    
    for (const data of artisans) {
        let user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) {
            const res = await auth.api.signUpEmail({
                body: {
                    email: data.email,
                    password: data.password,
                    name: data.name,
                    role: "VENDOR" 
                }
            });
            user = res.user;
            
            // Wait, we need to create the vendor application to make it an active store
            await prisma.vendorApplication.create({
                data: {
                    userId: user.id,
                    storeName: data.storeName,
                    description: data.description,
                    status: "APPROVED"
                }
            });
            console.log("Created Vendor:", user.name);
        } else {
            console.log("Vendor exists:", user.name);
            // Ensure application exists
            const app = await prisma.vendorApplication.findFirst({ where: { userId: user.id } });
            if (!app) {
                await prisma.vendorApplication.create({
                    data: {
                        userId: user.id,
                        storeName: data.storeName,
                        description: data.description,
                        status: "APPROVED"
                    }
                });
            }
        }
        artisanIds.push(user.id);
    }
    
    // Create Customers
    const customers = [
        { email: "customer1@example.com", name: "Customer One", password: "Password123!" },
        { email: "customer2@example.com", name: "Customer Two", password: "Password123!" },
        { email: "customer3@example.com", name: "Customer Three", password: "Password123!" },
        { email: "customer4@example.com", name: "Customer Four", password: "Password123!" },
        { email: "customer5@example.com", name: "Customer Five", password: "Password123!" },
    ];
    
    const customerIds: string[] = [];
    
    for (const data of customers) {
        let user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) {
            const res = await auth.api.signUpEmail({
                body: {
                    email: data.email,
                    password: data.password,
                    name: data.name,
                    role: "USER" 
                }
            });
            user = res.user;
            console.log("Created Customer:", user.name);
        } else {
            console.log("Customer exists:", user.name);
        }
        customerIds.push(user.id);
    }
    
    // Create Products and Reviews
    console.log("Inserting products and reviews...");
    for (let i = 0; i < dataset.length; i++) {
        const item = dataset[i];
        const artisanId = artisanIds[i % 3]; // distribute items
        
        let product = await prisma.product.findUnique({ where: { slug: item.product_id } });
        if (!product) {
            product = await prisma.product.create({
                data: {
                    name: item.name,
                    slug: item.product_id,
                    description: item.short_description,
                    price: Math.floor(Math.random() * 100) + 20, // Random price 20-120
                    images: item.image_url ? [item.image_url] : [],
                    categoryId: categoryMap.get(item.category)!,
                    userId: artisanId,
                    stock: 10,
                    status: "ACTIVE",
                    attributes: {
                        materials: item.materials,
                        dimensions: item.dimensions,
                        origin: item.country_or_region_of_origin
                    }
                }
            });
            console.log("Created Product:", product.name);
            
            // Create reviews to adjust averageRating and totalRatings
            // Give each product 1 to 5 random reviews
            const numReviews = Math.floor(Math.random() * 5) + 1;
            let sumRating = 0;
            
            for (let j = 0; j < numReviews; j++) {
               const customerId = customerIds[(i + j) % 5];
               const rating = Math.floor(Math.random() * 3) + 3; // 3 to 5 stars
               sumRating += rating;
               
               await prisma.review.create({
                   data: {
                       productId: product.id,
                       userId: customerId,
                       rating: rating,
                       title: "Great product!",
                       comment: "Really loved this piece. Beautifully made.",
                       isVerified: true
                   }
               });
            }
            
            // Update average rating on product
            await prisma.product.update({
                where: { id: product.id },
                data: {
                    averageRating: sumRating / numReviews,
                    totalRatings: numReviews
                }
            });
        }
    }
    
    console.log("Seed completed!");
    
    console.log("\\n\\n----- CREDENTIALS -----");
    console.log("Artisans:");
    artisans.forEach(a => console.log(`  Email: ${a.email} | Password: ${a.password}`));
    console.log("Customers:");
    customers.forEach(c => console.log(`  Email: ${c.email} | Password: ${c.password}`));
    console.log("-----------------------");
}

seed().catch(console.error).finally(() => prisma.$disconnect());
