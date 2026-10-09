-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: mirissastays_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `meta_title` varchar(160) DEFAULT NULL,
  `meta_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Villa','villa','Luxury Villas in Mirissa | MirissaStays','Discover luxury and boutique private beachfront villas with private pools in Mirissa and Southern Sri Lanka.'),(2,'Guesthouse','guesthouse','Top Guesthouses in Mirissa | MirissaStays','Affordable, verified guesthouses and surf lodges in Mirissa with AC, breakfast, and direct host WhatsApp booking.'),(3,'Hotel','hotel','Boutique Hotels in Mirissa | MirissaStays','Top-rated beachfront hotels and boutique resorts in Mirissa Bay and Weligama.'),(4,'Hostel','hostel','Best Hostels in Mirissa for Backpackers | MirissaStays','Budget-friendly, high-vibe hostels and dorms for backpackers, surfers, and solo travelers.');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guide_comments`
--

DROP TABLE IF EXISTS `guide_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guide_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `guide_id` int(11) NOT NULL,
  `author_name` varchar(100) NOT NULL,
  `author_email` varchar(150) NOT NULL,
  `comment` text NOT NULL,
  `status` enum('approved','pending','spam') DEFAULT 'approved',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `guide_id` (`guide_id`),
  KEY `status` (`status`),
  CONSTRAINT `guide_comments_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guide_comments`
--

LOCK TABLES `guide_comments` WRITE;
/*!40000 ALTER TABLE `guide_comments` DISABLE KEYS */;
INSERT INTO `guide_comments` VALUES (1,3,'Sophie Dubois','sophie.d@outlook.fr','We booked our tour in December based on this advice and saw a mother blue whale and her calf! One of the most unforgettable moments of our trip to Sri Lanka. Highly recommend ethical operators.','approved','2026-09-12 17:42:51');
/*!40000 ALTER TABLE `guide_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guides`
--

DROP TABLE IF EXISTS `guides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `meta_description` varchar(255) NOT NULL,
  `primary_keyword` varchar(255) DEFAULT NULL,
  `tags` varchar(500) DEFAULT NULL,
  `author_name` varchar(120) DEFAULT 'Ruwan Jayasuriya',
  `author_role` varchar(150) DEFAULT 'Local Travel Specialist',
  `author_image` varchar(255) DEFAULT NULL,
  `author_bio` text DEFAULT NULL,
  `featured_image` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `views` int(10) unsigned NOT NULL DEFAULT 0,
  `status` enum('draft','published') DEFAULT 'published',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guides`
--

LOCK TABLES `guides` WRITE;
/*!40000 ALTER TABLE `guides` DISABLE KEYS */;
INSERT INTO `guides` VALUES (1,'Coconut Tree Hill','Coconut Tree Hill Mirissa: Photo Spots & Best Time to Visit','coconut-tree-hill-mirissa','Everything you need to know about visiting Coconut Tree Hill in Mirissa. The best time for photography, how to get there, and what to expect.','coconut tree hill mirissa','coconut tree hill sunrise, mirissa photography spots, how to get to coconut tree hill','Kavishka Deshan','Mirissa Native & Surf Guide','/uploads/author-kavishka.jpg','Lifelong southern province local, surf enthusiast, and contributing editor at MirissaStays. Ruwan explores hidden coastal trails, monitors seasonal marine life migrations, and collaborates with eco-conscious guesthouses across Mirissa and Weligama.','https://images.unsplash.com/photo-1653959699604-1eb000740b57?q=80&w=2070&auto=format&fit=crop','<h2>Why Coconut Tree Hill is Mirissa\'s Most Iconic Landmark</h2>\r\n<p class=\"lead\">Rising gracefully above the azure Indian Ocean on Mirissa\'s eastern headland, Coconut Tree Hill is one of Sri Lanka\'s most photogenic vistas. A private coconut plantation turned global photography sensation, this terracotta-red mound crowned with leaning palm trees offers an unforgettable panoramic seascape.</p>\r\n\r\n<h3>Best Time to Visit: Sunrise vs. Sunset</h3>\r\n<p>Timing your visit dictates your entire experience. Here is how to plan:</p>\r\n<ul>\r\n    <li><strong>Sunrise (5:45 AM – 6:30 AM):</strong> The absolute best time for calm photos and soft golden light. The morning ocean breeze is cool, and you will share the hill with only a handful of dedicated photographers.</li>\r\n    <li><strong>Midday (11:00 AM – 3:00 PM):</strong> The sun is intense, but the water turns an unbelievable electric turquoise. Bring polarized sunglasses and sun protection.</li>\r\n    <li><strong>Sunset (5:30 PM – 6:30 PM):</strong> The sky lights up in dramatic shades of mango, pink, and violet. It is more social and lively, but expect substantial crowds.</li>\r\n</ul>\r\n\r\n<h3>How to Get to Coconut Tree Hill</h3>\r\n<p>Reaching the hill is easy from any guesthouse or villa in Mirissa:</p>\r\n<ul>\r\n    <li><strong>Via Mirissa Beach (Low Tide):</strong> Walk east along Mirissa Beach past Parrot Rock. Continue around the rocky bend. During low tide, it takes roughly 15 to 20 minutes on foot.</li>\r\n    <li><strong>Via Matara Road (All Tides):</strong> Take a 3-minute tuk-tuk ride or stroll eastward along the main Matara Road. Turn right at the signpost for Maison D\'hotes Sanda and follow the sandy footpath up the hill.</li>\r\n</ul>\r\n\r\n<h3>Pro Photography Tips</h3>\r\n<ol>\r\n    <li><strong>Framing:</strong> Use a wide-angle lens (16mm-24mm) positioned low to the ground to exaggerate the curve of the hill and the height of the palms.</li>\r\n    <li><strong>Color Contrast:</strong> Wear bright white, yellow, or coral clothing to pop against the deep red clay and blue sea.</li>\r\n    <li><strong>Respect the Land:</strong> Coconut Tree Hill is private property graciously left open for travelers. Please stay on established dirt paths and carry all rubbish back with you.</li>\r</ol>',2486,'published','2026-09-13 19:26:03'),(2,'Secret Beaches','7 Hidden & Secret Beaches in Southern Sri Lanka (Map & Guide)','secret-beaches-south-sri-lanka','Escape the crowds with our guide to secret beaches in Southern Sri Lanka, including hidden coves near Mirissa, Weligama, and Tangalle.','secret beach mirissa','hidden beaches south sri lanka, quiet beaches near mirissa, secret beach snorkeling','Dilani Jayawardena','Coastal Explorer & Snorkeler','/uploads/author-kavishka.jpg','Dilani has charted every secluded cove between Galle and Tangalle. She specializes in secret beaches, marine conservation, and finding secluded paradises far from the tourist crowds.','/uploads/guides/guides_6aa704a198fb51.83299079.jpg','<h2>Southern Sri Lanka\'s Hidden Coastline</h2>\r\n<p class=\"lead\">While Mirissa Main Beach is world-renowned for surf breaks and lively beachside seafood grills, sometimes you crave secluded golden sands, gentle tidal lagoons, and pure tranquility. Southern Sri Lanka conceals some of the Indian Ocean\'s most stunning secluded coves.</p>\r\n\r\n<h3>1. Secret Beach, Mirissa</h3>\r\n<p>Tucked behind dense tropical cliffs west of Mirissa harbor, Secret Beach is divided into three picturesque pockets:</p>\r\n<ul>\r\n    <li><strong>The Blue Lagoon:</strong> A sheltered saltwater pool protected by an offshore reef, shallow and perfect for relaxed swimming.</li>\r\n    <li><strong>The Snorkeling Cove:</strong> Rich in colorful marine life, sea urchins, and green sea turtles.</li>\r\n    <li><strong>Sunset Beach:</strong> A tranquil stretch facing west, ideal for evening coconuts.</li>\r\n</ul>\r\n<p><em>How to reach:</em> Take a tuk-tuk up the steep, winding hill from Mirissa Harbor (approx. 500-800 LKR) or enjoy a vigorous 25-minute hike.</p>\r\n\r\n<h3>2. Hiriketiya Horseshoe Bay</h3>\r\n<p>Located near Dikwella, this lush jungle-fringed cove is paradise for intermediate surfers and digital nomads. Palm trees hang directly over the water, and trendy espresso cafes sit steps from the sand.</p>\r\n\r\n<h3>3. Goyambokka Beach (Tangalle)</h3>\r\n<p>Fringed with golden sand and dramatic granite boulders, Goyambokka feels like an upscale Robinson Crusoe hideaway. The water is crystalline turquoise, and rustic thatched-roof huts serve fresh papaya juice.</p>\r\n\r\n<h3>4. Silent Beach</h3>\r\n<p>True to its moniker, Silent Beach is an expansive, uninterrupted crescent of powder-soft white sand. While the shorebreak can be strong, the sense of untouched coastal seclusion is peerless.</p>\r\n\r\n<h3>5. Blue Beach Island (Nilwella)</h3>\r\n<p>A geological marvel known as a tombolo—a lush rocky island connected to the mainland by a narrow sandspit. It offers calm snorkeling on one side and rolling surf on the other.</p>\r\n\r\n<h3>6. Talalla Beach</h3>\r\n<p>A tranquil 2-kilometer golden crescent bordered by coconut groves. Almost completely free of vendors or crowds, it is made for meditative morning strolls.</p>',1863,'published','2026-09-13 19:26:03'),(3,'Whale Watching Season','Best Time for Whale Watching in Mirissa: Month-by-Month Guide','best-time-whale-watching-mirissa','Plan your trip perfectly. Find out the absolute best months to visit Mirissa for guaranteed Blue Whale sightings and calm seas.','mirissa whale watching season','best time to see blue whales mirissa, whale watching mirissa months, whale safari sri lanka','Kavinda Perera','Marine Biologist & Whale Specialist','/uploads/author-kavishka.jpg','With over a decade of experience tracking Blue Whale and Sperm Whale pod migrations in the Indian Ocean, Kavinda advocates for ethical, non-intrusive whale watching expeditions in Mirissa.','/uploads/guides/guides_6aa7047a1e9315.69934301.jpg','<h2>Encountering the Giants of the Indian Ocean</h2>\r\n<p class=\"lead\">Mirissa ranks as one of the best destinations on Earth to observe Blue Whales—the largest creatures ever to inhabit our planet. Just a few nautical miles off the Mirissa headland, the continental shelf drops dramatically, creating deep, nutrient-rich upwellings that attract feeding cetaceans year after year.</p>\r\n\r\n<h3>Peak Whale Watching Months (November to April)</h3>\r\n<p>The southern coast benefits from calm seas and sunny skies from late autumn through spring:</p>\r\n<ul>\r\n    <li><strong>November – December:</strong> Whales begin migrating along the southern maritime corridor. Ocean conditions settle down after the monsoon.</li>\r\n    <li><strong>January – February:</strong> Excellent visibility, calm waters, and consistent sightings of Blue Whales, Sperm Whales, and large pods of Spinner Dolphins.</li>\r\n    <li><strong>March – April (Peak Peak):</strong> The absolute best window. Sighting success rates frequently top 95%, with mothers and calves frequently spotted feeding in mirror-calm waters.</li>\r\n</ul>\r\n\r\n<h3>The Off-Season: May to October</h3>\r\n<p>During the Southwest Monsoon, rough winds and heavy ocean swells make boat excursions uncomfortable and potentially unsafe. Most certified, responsible tour operators halt trips during these months.</p>\r\n\r\n<h3>What to Expect on a Morning Whale Safari</h3>\r\n<ul>\r\n    <li><strong>Departure Time:</strong> Boats set sail from Mirissa Fisheries Harbour early, typically between 6:15 AM and 6:45 AM.</li>\r\n    <li><strong>Trip Duration:</strong> 3 to 5 hours depending on how far offshore the pods are feeding.</li>\r\n    <li><strong>Motion Sickness Preparation:</strong> Even on calm days, the rolling ocean swell can trigger nausea. Take motion sickness medication (available at any Mirissa pharmacy) 45 minutes before boarding.</li>\r\n</ul>\r\n\r\n<h3>How to Choose an Ethical Whale Watching Operator</h3>\r\n<p>Sustainable tourism is critical for protecting these majestic animals. Always choose an operator that adheres to international guidelines: maintaining a minimum 100-meter buffer, slowing engine speeds near pods, never boxing in or chasing whales, and never cutting across their path.</p>',1421,'published','2026-09-13 19:26:03'),(4,'Backpacker & Budget Guide','Mirissa Budget Travel Guide: Costs, Stays & Tips for Backpackers','mirissa-backpacker-budget-guide','Traveling Sri Lanka on a budget? Here is your complete backpacker guide to Mirissa, covering cheap eats, hostels, and free activities.','mirissa budget travel','mirissa backpacker guide, cheap hostels mirissa, how many days in mirissa','Kavishka Deshan','Coastal Explorer & Snorkeler','/uploads/author-kavishka.jpg','Lifelong southern province local, surf enthusiast, and contributing editor at MirissaStays.','https://images.unsplash.com/photo-1584804431210-6fff43aa8abd?q=80&w=2070&auto=format&fit=crop','<h2>Exploring Mirissa on a Shoestring Budget</h2>\r\n<p class=\"lead\">Mirissa has grown into a world-class travel hub with boutique resorts and luxury villas, but it remains one of the friendliest, most affordable coastal destinations for backpackers, solo travelers, and digital nomads.</p>\r\n\r\n<h3>Daily Budget Estimates for Mirissa</h3>\r\n<ul>\r\n    <li><strong>Backpacker Budget:</strong> $18 – $30 USD / day (Dorm bed, local rotti shops, surf rental, walking/public buses).</li>\r\n    <li><strong>Flashpacker Budget:</strong> $35 – $65 USD / day (Private guesthouse room, scooter rental, mix of beachfront cafes and local eateries).</li>\r\n</ul>\r\n\r\n<h3>Where to Stay: Hostels & Budget Guesthouses</h3>\r\n<p>Modern hostels in Mirissa offer air-conditioned dorms with privacy curtains, secure lockers, and fast Wi-Fi for $10 to $16 USD per night. If traveling as a couple or pair, look for family-run guesthouses on the lanes inland from Matara Road. You can often secure an immaculate double room with private bath and a home-cooked Sri Lankan breakfast for under $25 USD per night.</p>',964,'published','2026-09-13 19:26:03');
/*!40000 ALTER TABLE `guides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stay_id` int(11) NOT NULL,
  `guest_id` int(11) DEFAULT NULL,
  `guest_name` varchar(120) NOT NULL,
  `guest_email` varchar(150) NOT NULL,
  `guest_phone` varchar(30) NOT NULL,
  `checkin_date` date NOT NULL,
  `checkout_date` date NOT NULL,
  `guests_count` int(11) DEFAULT 2,
  `special_requests` text DEFAULT NULL,
  `status` enum('new','contacted','booked','cancelled') DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `stay_id` (`stay_id`),
  KEY `guest_id` (`guest_id`),
  CONSTRAINT `leads_ibfk_1` FOREIGN KEY (`stay_id`) REFERENCES `stays` (`id`) ON DELETE CASCADE,
  CONSTRAINT `leads_ibfk_2` FOREIGN KEY (`guest_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
INSERT INTO `leads` VALUES (1,3,3,'Kapugama Geeganage Kavishka Deshan','kavishkadeshan20033@gmail.com','0760224529','2026-09-15','2026-09-23',2,'High floor with sea view if possible.','new','2026-09-13 19:18:22');
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `meta_title` varchar(160) DEFAULT NULL,
  `meta_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Mirissa','mirissa','Mirissa Hotels, Villas & Stays | MirissaStays','Find the best hotels, beachfront villas, and guesthouses in Mirissa Beach and Mirissa Bay.'),(2,'Weligama','weligama','Weligama Surf Stays & Hotels | MirissaStays','Top-rated surf camps, boutique hotels, and guesthouses located right on Weligama Bay.'),(3,'Madiha','madiha','Madiha Coastal Stays & Villas | MirissaStays','Quiet boutique stays, private villas, and surf spots in picturesque Madiha.'),(4,'Midigama','midigama','Midigama Surf Stays & Hostels | MirissaStays','Epic surf breaks, eco-lodges, and guesthouses in Midigama.'),(5,'Thalaramba','thalaramba','Thalaramba Stays & Beach Villas | MirissaStays','Discover peaceful beachfront villas and boutique guesthouses in Thalaramba, Mirissa.'),(6,'Kamburugamuwa','kamburugamuwa','Kamburugamuwa Accommodation | MirissaStays','Explore serene coastal retreats, budget guesthouses, and luxury stays in Kamburugamuwa.');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `key_name` varchar(100) NOT NULL,
  `value_text` longtext NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES ('hero_slides','[{\"image\":\"https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&w=1920&q=80\",\"title\":\"Coconut Tree Hill & Mirissa Bay\",\"subtitle\":\"Scenic Southern Province Coastline\"},{\"image\":\"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80\",\"title\":\"Secret Beaches & Coral Reefs\",\"subtitle\":\"Pristine Secluded Coastal Havens\"},{\"image\":\"https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1920&q=80\",\"title\":\"Luxury Oceanfront Villas & Pools\",\"subtitle\":\"Direct Host Bookings with Zero Fees\"},{\"image\":\"https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1920&q=80\",\"title\":\"Golden Hour at Weligama Bay\",\"subtitle\":\"World-Class Surf Breaks & Sunsets\"}]','2026-09-13 20:37:05');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stays`
--

DROP TABLE IF EXISTS `stays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stays` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `host_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `meta_description` varchar(255) NOT NULL,
  `short_desc` text NOT NULL,
  `full_content` longtext NOT NULL,
  `price_per_night` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'USD',
  `rating` decimal(2,1) DEFAULT 5.0,
  `review_count` int(11) DEFAULT 1,
  `featured_image` varchar(255) NOT NULL,
  `gallery_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `amenities_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `map_embed` text DEFAULT NULL,
  `affiliate_url` varchar(500) DEFAULT NULL,
  `whatsapp_number` varchar(30) NOT NULL,
  `allow_booking` tinyint(1) NOT NULL DEFAULT 1,
  `status` enum('draft','published','archived') DEFAULT 'published',
  `is_featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `host_id` (`host_id`),
  KEY `category_id` (`category_id`),
  KEY `location_id` (`location_id`),
  KEY `status` (`status`),
  KEY `is_featured` (`is_featured`),
  CONSTRAINT `stays_ibfk_1` FOREIGN KEY (`host_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `stays_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `stays_ibfk_3` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stays`
--

LOCK TABLES `stays` WRITE;
/*!40000 ALTER TABLE `stays` DISABLE KEYS */;
INSERT INTO `stays` VALUES (1,2,1,1,'White Sunrise Villa','sunrise-villa-mirissa','A beautiful sunrise villa right next to Mirissa beach with private infinity pool and ocean views.','Relax by the ocean with private pool and tropical gardens.','Full description of White Sunrise Villa... Featuring 3 spacious air-conditioned bedrooms, a sun-drenched private infinity pool, fully equipped kitchen, and incredible panoramic views of the Indian Ocean. Walk directly onto the golden sands of Mirissa Beach in seconds.',150.00,'USD',5.0,14,'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80','[\"https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80\",\"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80\",\"https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80\",\"https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80\"]','[\"Free Wi-Fi\",\"Air Conditioning\",\"Clean Linen\",\"Swimming Pool\",\"Kitchen\",\"Breakfast Included\"]','Beach Road, Mirissa',5.93834538,80.47742810,'https://maps.google.com/maps?q=5.93834538,80.47742810&hl=en&z=16&output=embed',NULL,'+94754361265',1,'draft',0,'2026-09-13 19:09:13'),(2,2,2,1,'Cozy Mirissa Guest House','cozy-guest-house','Affordable cozy guest house for backpackers and surfers in central Mirissa.','Comfortable AC rooms, lush garden patio, and 5 minutes to surf breaks.','Located just 5 minutes from Mirissa main surf break and beachfront restaurants. Fast Wi-Fi, air conditioning, daily housekeeping, and welcoming local hosts ready to help arrange scooter rentals and whale watching tours.',30.00,'USD',5.0,9,'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80','[\"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80\",\"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80\",\"https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80\",\"https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80\"]','[\"Free Wi-Fi\",\"Air Conditioning\",\"Clean Linen\",\"Breakfast Included\",\"Free Parking\"]','Main Street, Mirissa',5.94721000,80.45832000,NULL,NULL,'+94754361265',1,'draft',0,'2026-09-13 19:09:13'),(3,2,3,2,'Weligama Surf Hotel & Resort','weligama-surf-hotel','Premium beachfront boutique hotel near Weligama surf break with rooftop ocean terrace.','Steps away from beginner & intermediate surf breaks with on-site board rentals.','Modern minimalist rooms, rooftop sunset cocktail terrace, and direct access to Weligama Bay surf point. Perfect for digital nomads, solo travelers, and couples seeking comfortable coastal hospitality.',80.00,'USD',5.0,16,'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80','[\"https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80\",\"https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80\",\"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80\",\"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80\"]','[\"Free Wi-Fi\",\"Air Conditioning\",\"Swimming Pool\",\"Ocean View\",\"Breakfast Included\",\"Free Parking\"]','Surf Road, Weligama',5.97254000,80.43051000,NULL,NULL,'+94754361265',1,'draft',0,'2026-09-13 19:09:13'),(4,5,2,1,'Sandy Coconut Guest','sandy-coconut-guest','Book Sandy Coconut Guest in Mirissa, Sri Lanka. Top-rated 5.0-star guesthouse on Thappawatta Road with AC rooms, breakfast, free Wi-Fi, and quick beach access.','A tranquil, top-rated 5.0-star guesthouse on Thappawatta Road in Mirissa. Comfortable AC rooms, fresh breakfast, high-speed Wi-Fi, and just minutes from the beach.','Welcome to Sandy Coconut Guest, your peaceful coastal escape in Mirissa, Sri Lanka. Proudly rated a perfect 5.0 stars with outstanding guest reviews, our guesthouse is located along serene Thappawatta Road, offering the ideal balance between quiet relaxation and easy access to the vibrant south coast.\r\n\r\nOur guest rooms feature modern air conditioning, comfortable queen and twin beds, private ensuite bathrooms with fresh hot showers, and complimentary high-speed Wi-Fi. Every morning, guests are treated to a delicious freshly prepared Sri Lankan breakfast, served in our breezy tropical garden terrace.\r\n\r\nSituated just a short 3-minute walk from the beach and within easy reach of Coconut Tree Hill, Mirissa Harbour whale watching charters, and Weligama\'s famous surf breaks. On-site scooter rentals, surf board storage, free secure parking, and round-the-clock friendly host support are available to make your stay unforgettable.',25.00,'USD',5.0,8,'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmxuvx3kI9m30yw54uqI1Zh5WFSSJ82fQf93LICcAsqfF1YKiS6qdI8r-Ze7RboaXFyH1wgvuO-5-gnDWgTsz2hIYHlt_DA0SNRqgVpJhI5Q4Ze5AS2Xycjv9Ps8gT1OTPFKkuplIvqh81x=s1360-w1360-h1020-rw','[\"https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkT49W7VwSOPMUbq9T3SNIaNJAauKddfx6Wh2Hvuz4vNUq0pAbkMEkuVmzqQRlp0r1Wz4ZKhzM0HepQ7w67UlGlQq3CoKeSdmxbX0TOOAkIJUzRJVpmGLm0S-FT8aUJDSumU4BYqsXngxY8=s1360-w1360-h1020-rw\",\"https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlDTuaryx927gqX1rXch4thvN6JeJiq5CQUfDl6C-nBNg37lxyX-L45Uk4HcYdpAXkozVg_xXTdE1B6Ziy43ZX7DGWJXQ7Vb3236FX0A9FIx0F4Isgd6wVZC5JLHadfQt4oTzog8jFURtA=s1360-w1360-h1020-rw\",\"https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlGCBKCwkJvaAmZccGoDtSnETlCe9owhs0kzs8qY-cr_8qLOgFcWTrcFTnp7KLwuomQUqF1fmHprk7_qxMOiMM3e0jz-KNmE8EY260pKYiYiwkasLgfaKORRYeWxXgHJoID0lx_WXFNuGOx=s1360-w1360-h1020-rw\",\"https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmxuvx3kI9m30yw54uqI1Zh5WFSSJ82fQf93LICcAsqfF1YKiS6qdI8r-Ze7RboaXFyH1wgvuO-5-gnDWgTsz2hIYHlt_DA0SNRqgVpJhI5Q4Ze5AS2Xycjv9Ps8gT1OTPFKkuplIvqh81x=s1360-w1360-h1020-rw\"]','[\"Free Wi-Fi\",\"Air Conditioning\",\"Clean Linen\",\"Kitchen\",\"Breakfast Included\",\"Free Parking\"]','Thappawatta Rd, Mirissa 81000, Sri Lanka',5.93781490,80.48068100,'<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3968.411979396201!2d80.47591739678951!3d5.9378149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae13f904f161509%3A0xb6b4abf6db398257!2sSandy%20Coconut%20Guest!5e0!3m2!1sen!2slk!4v1789362295461!5m2!1sen!2slk\" width=\"100%\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"strict-origin-when-cross-origin\"></iframe>',NULL,'+94754361265',1,'published',1,'2026-09-13 20:26:47'),(5,1,1,5,'Thalaramba Ocean Villa','thalaramba-ocean-villa','Luxury beachfront villa in Thalaramba with ocean views, private pool, and direct beach access.','Nestled along the serene shores of Thalaramba, this private beachfront villa offers tranquility, tropical gardens, and panoramic Indian Ocean views.','Escape to peaceful Thalaramba, just minutes from bustling Mirissa. This luxury private villa features an infinity swimming pool, expansive sun terrace, fully equipped modern kitchen, and direct sandy beach access. Fall asleep to the rhythm of gentle waves and enjoy sunrise breakfast overlooking the coconut palms.',185.00,'USD',4.9,18,'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80','[\"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80\",\"https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80\",\"https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80\"]','[\"Free Wi-Fi\",\"Air Conditioning\",\"Swimming Pool\",\"Ocean View\",\"Clean Linen\",\"Kitchen\",\"Breakfast Included\",\"Free Parking\"]','Thalaramba Beach Road, Thalaramba',5.93800000,80.47200000,NULL,NULL,'+94754361265',1,'draft',0,'2026-09-13 20:57:34'),(6,1,1,6,'Kamburugamuwa Coastal Retreat','kamburugamuwa-coastal-retreat','Serene boutique holiday retreat in Kamburugamuwa with lush gardens and coastal serenity.','A tranquil escape in Kamburugamuwa offering spacious contemporary suites, private garden balconies, and authentic hospitality.','Discover calm living in Kamburugamuwa, situated right between Mirissa and Matara. Ideal for travelers seeking uncrowded beaches, sea breezes, and effortless access to southern Sri Lanka attractions.',95.00,'USD',4.8,12,'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80','[\"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80\",\"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80\"]','[\"Free Wi-Fi\",\"Air Conditioning\",\"Swimming Pool\",\"Ocean View\",\"Breakfast Included\",\"Free Parking\"]','Beach Road, Kamburugamuwa',5.94500000,80.50500000,NULL,NULL,'+94754361265',1,'draft',0,'2026-09-13 20:57:34'),(7,1,3,1,'The Nine Mirissa','the-nine-mirissa','Planning a visit to The Nine Mirissa? Explore 5+ Google Maps photos, 4.7★ reviews, exact Badugoda location, directions, pool amenities, and nearby Mirissa Beach guide.','A celebrated boutique luxury villa & pool retreat on the Badugoda hillside in Mirissa, featuring modern architecture, infinity pool, and serene ocean breezes.','The Nine Mirissa is one of the southern coast\'s most celebrated boutique architectural gems, perched peacefully on the scenic hillside along Badugoda Cross Road in Mirissa, Sri Lanka. Renowned for its minimalist tropical brutalist design, seamless indoor-outdoor living, and tranquil atmosphere, this boutique retreat has earned an exceptional 4.7-star rating with near-unanimous guest praise.\r\n\r\n### The Setting & Architecture\r\nDesigned with clean geometric lines, polished concrete, warm tropical woods, and lush native foliage, The Nine Mirissa merges contemporary aesthetics with coastal Sri Lankan tranquility. The property centers around a striking outdoor infinity swimming pool framed by sun loungers and swaying palms, providing an intimate oasis away from the main coastal road.\r\n\r\n### Location & Getting Around\r\n- **Proximity to Beach:** Located just a gentle 5 to 6-minute walk (approx. 400 meters) from the golden sands of Mirissa Beach and Weligambay Beach.\r\n- **Neighborhood:** Tucked into the peaceful Badugoda hillside neighborhood, offering quiet nights free from beach road traffic while keeping beachfront restaurants, surf schools, and sunset cocktail lounges within immediate walking distance.\r\n- **Whale Watching & Harbour:** Approximately 3 minutes by tuk-tuk to Mirissa Fisheries Harbour for early morning blue whale and dolphin excursions.\r\n\r\n### Highlights & Signature Experiences\r\n- **Outdoor Swimming Pool:** A centerpiece infinity-style pool with panoramic garden views and comfortable shaded loungers.\r\n- **Rooftop Yoga & Wellness Shala:** An elevated open-air pavilion designed for morning yoga, meditation, and sunset golden-hour stretches overlooking the coconut canopies.\r\n- **Ocean & Garden Vistas:** Well-appointed private terraces offering refreshing sea breezes and sunrise views over southern palm tops.\r\n- **Curated Dining:** Known for its fresh, locally sourced breakfast offerings, seasonal tropical juices, and ocean-to-table culinary attention.\r\n\r\n*Note: MirissaStays provides this listing as a verified local destination guide for travelers visiting Mirissa. Direct reservations are managed through the property\'s official channels. If you are looking for verified guesthouses and villas with direct WhatsApp host booking, explore our recommended nearby stays below.*',0.00,'USD',4.7,99,'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWk9SmHRKiAyHigoHLpjDTNE1wW8wCHvcLoml_NS67tpdU59ZVc0q1d3FxhZULSYLIR6WDJg23PFUwSqgtRCGMVqjm7uwTmhBbeFLWsJ7uXMpeqnooMlPAuMfIBfyZ8kNRWxJ3Rs=s1360-w1360-h1020-rw','[\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWmPmge3G9z1r6UdYaBFw0MGpsskZMu_ZTABi9LXkvnGNgwSO74R55j0YveBrNG59fnvj0o5aVz39yaiAfueJ-dYTVNtBNhvAcNmpsv5N2NAxndfzXaMGqohArhuvXu9H2ycnnVY0LQuvvbK=s1360-w1360-h1020-rw\",\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWnAz8zdLzGWovnXCAIbZAwQQyxZuRvQfqskEvhhRYxn1RJOV-SxjxQqvS4d3UXRNcJfawXEoOIiTQxlwp5lDngW0awvGTx5NdlFHTXVQIh29jaAtXTa9LIi0-HIpY5Qqk-rpSq_OA=s1360-w1360-h1020-rw\",\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWkh9ggc8yDftVe3FcOGTPv2nhvT_0G8nIPnSvmP6XNqbmDTC8GdnG492scYysAxMC80hDnQ2SNPFd5ldlXyooYbpjYmJtNr-_P9vPKI5GwYrJTUS7rq2KFZxMTIfA9vthKB-GAYp9nuOU91=s1360-w1360-h1020-rw\",\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWl0zdYHiez1X25zxE1jzj2K7rWKnIT9Au0gpHwuu8z34s-_EhJKDdakCn4RJ2piZuLz8BOAWdQ6AxexvsKN63Wd1CBsFWhnTGWzqd8kV6uqKftDtUNumGlmWNJSSqHB-QknJ4P4Eg=s1360-w1360-h1020-rw\"]','[\"Free Wi-Fi\",\"Air Conditioning\",\"Clean Linen\",\"Swimming Pool\",\"Ocean View\",\"Free Parking\"]','Badugoda Cross Road, Mirissa 81740, Sri Lanka',5.94511870,80.45222020,'https://maps.google.com/maps?q=5.9451187,80.4522202&hl=en&z=16&output=embed','https://share.google/rmgvbD0RNfFsuvSRh','',0,'published',1,'2026-09-17 19:42:45'),(8,1,1,1,'Mirissa Hills','mirissa-hills','Discover Mirissa Hills in Henwalle, Mirissa. Explore 4.5★ reviews, working cinnamon plantation, the Cinnamon Museum, 5+ photos, map directions, and travel tips.','A legendary working cinnamon plantation, Cinnamon Museum, and luxury boutique estate offering 360° panoramic views over the southern Sri Lankan hills and ocean.','Mirissa Hills is an extraordinary boutique estate, working cinnamon plantation, and cultural landmark perched atop the verdant coastal hills above Weligama Bay and Mirissa in southern Sri Lanka. Rated an impressive 4.5 stars with 284+ Google reviews, this historic multi-acre property combines authentic agricultural heritage with breathtaking 360-degree views across lush tropical valleys, distant mountains, and the Indian Ocean.\n\n### The Working Cinnamon Plantation & Museum\nMirissa Hills is globally celebrated for its dedicated commitment to preserving Sri Lanka\'s indigenous spice legacy:\n- **The Cinnamon Museum:** Widely recognized as the world\'s first museum dedicated exclusively to the history, agricultural processing, and botanical varieties of pure Ceylon cinnamon (Cinnamomum verum). Visitors can discover traditional cinnamon peeling demonstrations and learn about ancient spice trading routes.\n- **The Estate Grounds:** Spanning rolling emerald hillsides planted with cinnamon shrubs, rubber trees, pepper vines, and tropical fruit orchards that attract vibrant birds, peacocks, and playful monkeys.\n\n### Distinct Properties of the Estate\nThe estate features three unique heritage settings:\n1. **Mount Cinnamon:** A striking contemporary villa designed by architect Channa Daswatte, set high upon the hilltop with a sweeping infinity pool that appears to spill into the jungle canopy below.\n2. **The Cinnamon Museum Rooms:** Intimate heritage suites integrated seamlessly with the museum grounds.\n3. **The Bungalow:** A meticulously restored antique walauwa (traditional colonial manor house) nestled at the base of the plantation amid manicured courtyard gardens.\n\n### Getting to Mirissa Hills\n- **Directions:** Located along Henwalle Road, approximately 1 kilometer inland from the main coastal road (A2) past the Polwathumodara Bridge.\n- **Distance:** An 8-minute tuk-tuk ride from Weligama Bay surf point and approximately 10 to 12 minutes from Mirissa Beach and Coconut Tree Hill.\n- **Navigation:** Accessible by car, tuk-tuk, or scooter with dedicated on-site parking at the estate entrance.\n\n*Note: MirissaStays publishes this guide to help travelers discover unique heritage attractions and sights across Mirissa. Direct bookings for Mirissa Hills are operated through the estate. To explore verified local guesthouses and beachfront villas with instant host contact, browse our recommended stays below.*',0.00,'USD',4.5,284,'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkXxyTY3ZOrNN9YQnMjR8ivNxW_xorLY275SgxzePgaiO4ssTs2ecJSNtONnhMMDt8dUhEvGxFfY9lw6Q3UdbiPfE_SgtvxGUHYXXeQiDS-wmrGyrHm7jnagJUKMjEpQKsKFlY=s1360-w1360-h1020-rw','[\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWkQnEshQypve8waNJbjd1iXwJwGCS_5W63uRlwqH5jMMFHTWzRk0Gng5SySfNMnFH7bCgljslnlqmop1S9Z7Vjwj8WVID523Z5SyhQ8Xk-HZiXJM_8pZrl11JrFcW_lWFL89N6UGA=s1360-w1360-h1020-rw\",\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWlaB9bOZiTvRd7f4ohzixveZ2z5_evhNSRIhiQxQiHo3hdA19tlBk4-iPfe4Rs-DijR958EHdsnn_N4JHRW-6afaOHlOOmhR2hVB93M4EnM04upi3RdqjDsgvduA3Q16-1g5UC-=s1360-w1360-h1020-rw\",\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWllzXBZOrJtAIkLZMY0wEe8smDlAo8t7PxLnvWZfCcZOHtPPpES7qH8rsXzzAf8y4oL6ZaK8_CQ5lph0xkqPFZoAFb20YOFvTwD9zNwd-hic3lT6sOXC_F8Av0a58O4jDy3OXU=s1360-w1360-h1020-rw\",\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWlj0rs3fbK5Codum_WIJ4a_vBwwK11boFb-sjWoTwIsW_BgvUkAjNkYcGIzfCnjTDo3_y1DkWChMtTATyZrLPvL9ijebIRxUbXh5s2dvkYZaaV4QRFwzblFHqbUN2X4GAOAgPtE_Q=s1360-w1360-h1020-rw\"]','[\"Swimming Pool\",\"Ocean View\",\"Free Wi-Fi\",\"Free Parking\",\"Clean Linen\",\"Breakfast Included\"]','Henwalle Road, Henwalle, Mirissa, Sri Lanka',5.96335380,80.46641830,'https://maps.google.com/maps?q=5.9633538,80.4664183&hl=en&z=16&output=embed','https://share.google/cCK65MX5rMN2sPr2C','',0,'published',1,'2026-09-17 19:42:45'),(9,1,3,1,'Asaya Sands Mirissa','asaya-sands-mirissa','Discover Asaya Sands Mirissa, a luxury 4.9★ beachfront hotel on Mirissa Beach. View 5+ photos, location map, reviews, swimming pool amenities, and guest guide.','An exquisite beachfront luxury boutique hotel & coastal sanctuary in Mirissa featuring panoramic ocean views, private infinity pool, and fine seaside dining.','Asaya Sands Mirissa is an extraordinary 5-star beachfront luxury hotel and private coastal sanctuary set directly along the tranquil sands of Mirissa on Sri Lanka\'s sun-kissed southern coast. Garnering an exceptional 4.9-star rating with over 207 glowing Google reviews, Asaya Sands is revered by international travelers for its barefoot luxury philosophy, impeccable architectural elegance, and warm Sri Lankan hospitality.\r\n\r\n### Beachfront Architecture & Coastal Design\r\nPositioned right where lush tropical palms meet the golden sands of the Indian Ocean, Asaya Sands features a masterfully curated blend of tropical modernism and relaxed bohemian coastal aesthetics. Every suite and common pavilion is oriented to catch cooling ocean breezes and showcase sweeping, unobstructed panoramas of the rolling waves and fiery south coast sunsets. The property is anchored by a glistening beachfront swimming pool lined with plush daybeds and private cabanas.\r\n\r\n### Luxurious Suites & Oceanfront Living\r\n- **Oceanfront Master Suites:** Expansive air-conditioned living sanctuaries boasting floor-to-ceiling glass doors, private timber decks, handcrafted king beds, and open-air rain showers enveloped by tropical greenery.\r\n- **Direct Beach Access:** Step straight from your private terrace onto the pristine sands of Mirissa\'s peaceful eastern bay, ideal for morning walks, private sunbathing, and watching sea turtles cruise the shallows.\r\n- **Curated Ocean Dining:** Indulge in artisanal breakfasts, freshly caught seafood grill dinners, tropical smoothie bowls, and signature sunset cocktails served against the soundtrack of breaking waves.\r\n\r\n### Prime Mirissa Location & Highlights\r\n- **Beach Proximity:** Direct beachfront frontage with immediate ocean access.\r\n- **Coconut Tree Hill:** A scenic 10-minute stroll along the shoreline leads directly to Mirissa\'s most famous palm-covered promontory.\r\n- **Whale Watching & Water Sports:** Mirissa Harbour is just a 5-minute tuk-tuk ride away for world-renowned blue whale watching excursions, guided snorkeling, and surf lessons.\r\n- **Nightlife & Dining:** A peaceful, private haven positioned just minutes away from Mirissa\'s beachfront seafood bistros, vibrant cafes, and sunset bars.\r\n\r\n*Note: MirissaStays provides this comprehensive guide to assist travelers in discovering premier luxury boutique hotels across Mirissa. Direct reservations and inquiries are handled directly by the hotel. To discover verified nearby guesthouses and villas with instant WhatsApp host booking, explore our recommended accommodations below.*',0.00,'USD',4.9,207,'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn3MgXBLoi2gnBm085wY4G-NSrEmzeEMlfkhUqRR83NrIhP57P9tWf_Fh2pl684sWZquiesztCy02Vifi-ObpXfFtDTbZ6DYw27MnJUXYrChH7SGGE5ERtkSEZs52oujkq-FmWozhZFwD9b=s1360-w1360-h1020-rw','[\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWkN8l0FOnJJHIZtaLAmed3Orq5_G4CcV0UhpwwoEwsK3S33C20fyKbfZqju3OBa4-smjmTCGug4RZCOkHdoPHyR2Z8jwvD6nW7Og8JR0Vc7T10rr9_0xDSosD5PV5atNMyP8yPWC22iXKE=s1360-w1360-h1020-rw\",\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWn611pMtgfZ4lSnJPFlZu6EuJfZSGeH370atqks2HZFKWU-WVCwS6oWdwRpC2Ve-jLv17_Hl2-mR5HLG3NIaepcy_4rtf9ImKSNE9bXLYc2rvCufjvZA2dhLWxbNMyEY3QjiRF2c9Qyk7pO=s1360-w1360-h1020-rw\",\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWlBRIR9jpfV6lVT4l4nEhDiqJ5JDbAiAo-Zbzz_HwsfZOS8kk3CUhhYRT9VL8nNKCgO3GE4Zzq_BYtRFawOGcPz8Ojm1Qs3jGZTkli70OJa3x0VqnGyE7PyFf4lqYn61tbnEClctkaQBwZQ=s1360-w1360-h1020-rw\",\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWk39xg92IiicBod-izAPcEoVHU-htkoJHZ5iSA_WEmi__u5SN5b66v8okfH8VvVyH3CwvzbDz3ym3WZI0GozfVJ01ocrG6Sv_XJkPnUsm5RGy5CiwCMUG6jX4rSPgE7271LnDPXCwdLvren=s1360-w1360-h1020-rw\"]','[\"Swimming Pool\",\"Ocean View\",\"Free Wi-Fi\",\"Air Conditioning\",\"Breakfast Included\",\"Free Parking\"]','WFQF+F3C, Mirissa 81740, Sri Lanka',5.93852780,80.47213890,'https://maps.google.com/maps?q=5.9385278,80.4721389&hl=en&z=16&output=embed','https://share.google/s3mftkgwCLWra5tJ0','',0,'published',1,'2026-09-17 20:28:56'),(10,1,3,1,'Paradise Beach Club','paradise-beach-club','Explore Paradise Beach Club in Mirissa, Sri Lanka. Iconic 4.0★ beachfront resort on Mirissa Beach with swimming pool, 5+ photos, reviews, location map & guide.','One of Mirissa\'s most famous beachfront resorts directly on Mirissa Beach, featuring direct ocean access, large swimming pool, and tropical beach club.','Paradise Beach Club is one of Mirissa\'s longest-standing and most iconic beachfront resorts, positioned right on the golden crescent of Mirissa Beach in southern Sri Lanka. With over 1,300 verified Google reviews, this premier beach resort offers direct sea access, a vast lagoon swimming pool overlooking the ocean, and front-row seats to Mirissa\'s famous coastal sunsets.\r\n\r\n### Iconic Beachfront Resort Experience\r\nNestled directly along the sand, Paradise Beach Club combines relaxed tropical island life with full resort amenities. Guests step immediately from the poolside terrace onto the golden shores of Mirissa Beach, where tranquil swimming zones, surf breaks, and coral reefs are just footsteps away. The centerpiece is the large oceanfront swimming pool framed by swaying palm trees, dedicated sun loungers, and a lively beach bar serving fresh coconut drinks and signature cocktails.\r\n\r\n### Accommodation & Amenities\r\n- **Beachfront & Pool View Rooms:** Air-conditioned guest rooms and family suites with private balconies overlooking either the turquoise swimming pool or the Indian Ocean waves.\r\n- **Oceanfront Restaurant & Bar:** Dine with your feet in the sand on fresh southern Sri Lankan curries, grilled jumbo prawns, catch-of-the-day seafood, and continental breakfast favorites.\r\n- **Ayurveda & Wellness:** On-site traditional Ayurvedic massage and wellness treatments designed to rejuvenate body and mind after a day of beach activities.\r\n\r\n### Location & Nearby Attractions\r\n- **Mirissa Main Beach:** Direct walk-out access to the main beachfront promenade, surf schools, and sunset dining spots.\r\n- **Parrot Rock:** Located just 200 meters down the beach, offering panoramic 360-degree views over Mirissa Bay.\r\n- **Mirissa Harbour Whale Watching:** Just 4 minutes by tuk-tuk to the harbour for early morning blue whale and spinner dolphin excursions.\r\n- **Coconut Tree Hill:** A picturesque 15-minute coastal walk to the southeast.\r\n\r\n*Note: MirissaStays publishes this guide as a verified directory of Mirissa\'s prominent beachfront resorts. Direct reservations are operated through the resort\'s official channels. If you are looking for local boutique guesthouses and villas with direct WhatsApp host booking, explore our recommended nearby stays below.*',0.00,'USD',4.0,1300,'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWk15_ey0OuFx4AcrSiCrs9AjD6xlSt15Llurr8-FZQ5D6cBBgZxliTXEi3H_mNWkLjA21fxp6Gy_r_YR3MrCVgkcnHQEFLgg9Sz1TDxF8nlt7EhhOs--zUOuWA2By0AwLf9DWev5Ae2dy1l=s1360-w1360-h1020-rw','[\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWlvBMwE-SQzHQ3h1c--1rrXk7n2M7JMtSLVtR8ODWHHiB35XOsY5ux0JQMPOEO6stW6-EaZFvI_w7rjfPxckCLWnLNR9hlB4B7eRPPsfmWxH_YIzmrtoiZgs_jAUg_-wPneBxHDVCINGZ_d=s1360-w1360-h1020-rw\",\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWlGfX3HdF4eMn-7c16dziQH4kUNpvl_hbU6HSsOTH1cHzEpBD9A7rqz4E0qBu_lFbybXBSDYmWyCPj2Mvh_JF6xsMuzI36fKS7GZ78Xid9q4Fth_uOqx1wPY2LqEre_hdm7qs0V=s1360-w1360-h1020-rw\",\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWlH6XVr7gkyHGjAC0w3A8Lep-oqSAEHAU6V0Wn1RDW5UrpcHkrejxKVypoYIp3UxYmSAZfWDnWBbvpuuqA_8iB2zpsFyBLTb2JtqMCpWoi5SVBnMekTm84fagmVUG9IYyw4HAo7=s1360-w1360-h1020-rw\",\"https:\\/\\/lh3.googleusercontent.com\\/gps-cs-s\\/AHRPTWk96yskvT1evI1495DAc-EYyLkHZ3tCjx3e9WxrRMGET3076NKbSiNILCPwcw7OcLPtlv2z3ubWqHmFERUpEYjmSWW9ZUZKcFt-Bnd8KOKUtq4ubmI-vELLxF7ESx3rJ15gO4gu_5sGxCSM=s1360-w1360-h1020-rw\"]','[\"Swimming Pool\",\"Ocean View\",\"Free Wi-Fi\",\"Air Conditioning\",\"Clean Linen\",\"Breakfast Included\",\"Free Parking\"]','140, Ven. Gunasiri Mahimi Mawatha, Mirissa 81740, Sri Lanka',5.94520000,80.45780000,'https://maps.google.com/maps?q=5.9452,80.4578&hl=en&z=16&output=embed','https://www.google.com/travel/search?ts=CAESCgoCCAMKAggDEAAaHBIaEhQKBwjqDxAJGBMSBwjqDxAJGBQYATICEAAqBwoFOgNMS1I&qs=CAEyEkNna0l2LU96eW96RzRTb1FBUTgIQgkRDCJOV9Rq1XlCCRGqtgXPmmsufkIJESN4nMNCFAYc&utm_campaign=sharing&utm_medium=link_btn&utm_source=htls','',0,'published',1,'2026-09-17 20:28:56');
/*!40000 ALTER TABLE `stays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` enum('admin','host','guest') NOT NULL DEFAULT 'guest',
  `full_name` varchar(120) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `status` enum('pending','active','suspended') NOT NULL DEFAULT 'pending',
  `business_reg_no` varchar(100) DEFAULT NULL,
  `reset_token` varchar(64) DEFAULT NULL,
  `reset_expires` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role` (`role`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','Super Admin','admin@mirissastays.com','0760224529','$2y$10$AVXBnEIJaUEISM5bwUDgj.upMhAAaGqKrEK5mXIJMHxAyQH453sPi','active',NULL,NULL,NULL,'2026-09-13 19:09:13'),(2,'host','Mirissa Local Host','host@mirissastays.com','0760224529','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',NULL,NULL,NULL,'2026-09-13 19:09:13'),(3,'guest','Kapugama Geeganage Kavishka Deshan','kavishkadeshan20033@gmail.com','0760224529','$2y$10$9WTak1/vTCuoLDKuC7zu2OEoqBdM95v6CyGGKuVxv0QxK1VLa5e3O','active','',NULL,NULL,'2026-09-13 19:17:05'),(4,'host','Kapugama Geeganage Kavishka Deshan','kavishkadeshan2003@gmail.com','0760224529','$2y$10$XlnYvnG4asE7NE5mvHTFbuTQFowaNAB/bAmAmraGpG8OS5eF2qr0a','active','200306610089',NULL,NULL,'2026-09-13 20:22:48'),(5,'host','Kapugama Geeganage Kavishka Deshan','kavishkadeshan@gmail.com','0760224529','$2y$10$nPyFynKw7BZzw.uV256ATuENLaP3tEtsDoA3YK7pIN18cAvNCiYUi','active','200306610089',NULL,NULL,'2026-09-13 20:23:12');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-18 10:23:16
