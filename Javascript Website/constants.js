/////////////////////////////////////////////////////////////////////////////////////////////////////
//// DATABASE
/////////////////////////////////////////////////////////////////////////////////////////////////////
const USERS_DB_NAME = "UserAccounts";
const SYSTEMS_DB_NAME = "Systems";
const COMPONENTS_DB_NAME = "Components";
const CART_DB_NAME = "ShoppingCart";
const FORUMS_DB_NAME = "Forum";
const AVOID_DB_NAME = "AvoidList";
const VERSION = 1;
/////////////////////////////////////////////////////////////////////////////////////////////////////
//DESCRIPTION FOR SYSTEMS
/////////////////////////////////////////////////////////////////////////////////////////////////////
const HP_PREBUILT_DESC = "</br>Windows 10 operating system</br>Windows 10 brings back the Start Menu from Windows 7 and introduces new features, like the Edge Web browser that lets you markup Web pages on your screen.</br></br>Enjoy high application performance and smoother gaming experiences with AMD Ryzen™ 5 processors, with machine intelligence, multitasking capabilities and efficient architecture with up to 6 cores and 12 processing. 12GB system memory for full-power multitasking</br></br>Plenty of high-bandwidth RAM to smoothly run your games and photo- and video-editing applications, as well as multiple programs and browser tabs all at once.</br>DVD/CD burner</br></br>256GB solid state drive (SSD)</br></br>While offering less storage space than a hard drive, a flash-based SSD has no moving parts, resulting in faster start-up times and data access, no noise, and reduced heat production and power draw on the battery.</br>Built-in media reader for simple photo transfer</br></br>Supports select memory card formats.</br>4 USB 2.0 and 4 USB 3.1 ports</br></br>Quick plug-and-play connectivity for your devices and accessories.</br>Next-generation wireless connectivity</br></br>Connects to your network or hotspots on all current Wi-Fi standards. Connect to a Wireless-AC router for speed nearly 3x faster than Wireless-N. Gigabit LAN port also plugs into wired networks.</br>Bluetooth 4.2 interface syncs with compatible devices</br></br>Wirelessly transfer photos, music and other media between the desktop and your Bluetooth-enabled cell phone or MP3 player, or connect Bluetooth wireless accessories.";
const HP_ENVY_DESC = "</br>Windows 10 operating system</br></br>Windows 10 brings back the Start Menu from Windows 7 and introduces new features, like the Edge Web browser that lets you markup Web pages on your screen.</br>16GB system memory for intense multitasking and gaming</br></br>Reams of high-bandwidth DDR3 RAM to smoothly run your graphics-heavy PC games and video-editing applications, as well as numerous programs and browser tabs all at once.</br>512GB solid state drive (SSD)</br></br>While offering less storage space than a hard drive, a flash-based SSD has no moving parts, resulting in faster start-up times and data access, no noise, and reduced heat production and power draw on the battery.</br>DVD/CD burner</br></br>Reads and writes to a variety of media formats, including DVD+R/RW, DVD-R/RW and CD-R/RW.</br>Dual display support</br></br>Add a second display for a more immersive and productive computing experience.</br>Wi-Fi 5 (2x2) & Bluetooth® 5.0</br></br>With a Wi-Fi 5 (2x2) WLAN adapter and Bluetooth® 5.0, all your connections are rock solid.</br>Intel® UHD Graphics</br></br>Smoothly stream 4K content and play your favorite games.</br>5.1 Surround Sound output</br></br>All the necessary ports for truly immersive sound quality with 5.1 surround sound.</br>Brushed thermal louvers</br></br>Enhance your creativity with ease using stylish, three-sided thermal vents. Designed to increase your systems airflow and reduce noise level, keep your system running smoothly.</br>SuperSpeed USB Type-A 5Gbps signaling data rate</br></br>Plug in your external storage with this Superspeed USB Type-A port, featuring 5Gbps signaling data rate.</br>SuperSpeed USB Type-C® 5Gbps signaling data rate</br></br>Plug in your external storage with this Superspeed USB Type-C® port, featuring 5Gbps signaling data rate. And it’s reversible, so you never have to worry about plugging in upside down.";
const DELL_INSPIRON_DESC = "Windows 10 Operating System</br></br>Windows 10 brings back the Start Menu from Windows 7 and introduces new features, like the Edge Web browser that lets you markup Web pages on your screen.</br>10th Gen Intel® Core™ i7-10700 processor</br></br>Powerful eight-core, 16-way processing performance. The Intel® Turbo Boost technology delivers dynamic extra power when you need it while increasing energy efficiency when you don't.</br>12GB System Memory for Powerful Multi-Tasking</br></br>Plenty of high-bandwidth RAM to smoothly run your games and photo- and video-editing applications, as well as multiple programs and browser tabs all at once.</br>512GB Solid State Drive (SSD)</br></br>While offering less storage space than a hard drive, a flash-based SSD has no moving parts, resulting in faster start-up times and data access, no noise, and reduced heat production and power draw on the battery.</br>Intel UHD 630 Graphics</br></br>Run multiple apps faster and enjoy sharp, high-quality visuals with Intel UHD Graphics 630 shared graphics memory.</br>Built-in Media Reader for Simple Photo Transfer</br></br>Supports MultiMediaCard, SD, SDHC and SDXC memory card formats.</br>Bluetooth Interface Syncs with Compatible Devices</br></br>Wirelessly transfer photos, music and other media between the desktop and your Bluetooth-enabled cell phone or MP3 player, or connect Bluetooth wireless accessories.</br>Wireless and Wired Network Connectivity (802.11ac 1x1 WiFi + Gigabit Ethernet)</br></br>Built-in high-speed wireless LAN connects to your network on the most common Wi-Fi standards. 1x10/100/1000 Gigabit Ethernet LAN port plugs into wired networks.</br>4 USB 2.0 ports, 4 USB 3.2</br></br>Quick plug-and-play connectivity for your devices and accessories.</br>Conveniently Compact</br></br>It’s easier than ever to find a space for this small desktop with a profile reduced from 17L to 14.8L. 16% smaller than the previous generation while maintaining strong performance and upgradeability.</br>Basic Software Package Included</br></br>1-month trial of McAfee LiveSafe. 1-month trial of Microsoft.</br>Waves MaxxAudio</br></br>Audio professionally tuned with Waves MaxxAudio® Pro (Windows) - No external speakers</br>";
const iMAC_DESC = "The 21.5-inch iMac with Retina 4K display comes packed with powerful processors, ultrafast SSD storage, and phenomenal graphics. And it all comes to life on an incredibly bright and vibrant Retina display with one billion colors.</br></br>Intel 8th Generation Core i3</br></br>21.5-inch (diagonal) 4096-by-2304 Retina 4K display</br></br>Eighth-generation quad-core Intel Core i3 or 6-core Intel Core i5 processor</br></br>AMD Radeon Pro 555X or 560X graphics</br></br>Ultrafast SSD storage</br></br>Two Thunderbolt 3 (USB-C) ports</br></br>Four USB-A ports</br></br>Gigabit Ethernet port</br></br>FaceTime HD camera</br></br>802.11ac Wi-Fi and Bluetooth 4.2</br></br>Magic Mouse 2</br></br>Magic Keyboard</br></br>Configurable processor, memory, and storage options are available</br>"
const iMAC_PRO_DESC = "iMac Pro features powerful processors and graphics, along with advanced memory and storage in an all-in-one design—so the most demanding professionals can turn their biggest ideas into their greatest work.</br></br>27-inch (diagonal) Retina 5K display</br></br>5120 by 2880 resolution with support for one billion colors</br></br>Stunning 5-mm-thin design</br></br>10-core Xeon processor</br></br>AMD Radeon Pro Vega 56 graphics with 8GB of HBM2 memory</br></br>32GB of memory</br></br>1TB of SSD storage</br></br>Four Thunderbolt 3 (USB-C) ports, four USB-A ports, SDXC card slot, 10Gb Ethernet, 3.5 mm headphone jack, stereo speakers, and four mics</br></br>802.11ac Wi-Fi and Bluetooth 5.0</br></br>Magic Mouse 2</br></br>Magic Keyboard with Numeric Keypad</br></br>The latest version of macOS</br></br>Configurable processor, memory, storage, and graphics options are available.</br></br>1TB = 1 trillion bytes; actual formatted capacity less.</br>";
const HP_PAVILION_DESC = "The HP Pavilion Desktop is all about smooth performance and crisp graphics wrapped up in a bold design. This PC offers the latest technology plus the ability to upgrade, keeping performance up-to-date.Windows 10 Home 649th Generation Intel Core i5 processor Discrete NVIDIA GeForce GTX 1660 Ti Graphics (6 GB GDDR6 dedicated) Powered by NVIDIA Pascal architecture </br></br>Brand 	HP</br>CPU Model 	Core i5</br>Computer Memory Size 	16 GB</br>Ram Memory Installed Size 	6 GB</br>Graphics Coprocessor 	NVIDIA GeForce GTX 1660</br>Graphics RAM Type 	GDDR6</br>RAM Memory Maximum Size 	16 GB</br>Wireless Communication Technology 	Wi-fi</br>Wireless Type 	802.11ac</br>Hard Disk Interface 	Solid State</br>";
const SKYTECH_DESC = "Archangel is the ideal Esports, Real Time Strategy and multi-player First Person Shooter gaming PC. Whether you want to play Fortnite Chapter 2, World of Warcraft, or multiplayer first person shooters like Rainbow Six Siege, CS:GO & Call of Duty, Archangel is well optimized for delivering solid 1080p/60+ FPS gaming performance.</br></br>Processor: Ryzen 3 1200 4-Core 3.1 GHz (3.4 GHz Turbo)</br>Motherboard: A320M</br>Memory: 8GB DDR4 2400MHz Gaming Memory</br>Graphics: Nvidia GeForce GTX 1050 Ti 4GB</br>Hard Drive: 1 TB 7200RPM</br>Display Ports: 1x Dual-link DVI, 1x DisplayPort(version 1.4), 1x HDMI</br>I/O: 9x USB (4x USB 2.0; 5x USB 3.0), Ethernet, HD Audio In, Microphone Jack</br>Cooling: Wraith Air Cooler, 3x Blue LED Fans</br></br>";
const ASUS_ROG_DESC = "ASUS ROG Strix G15CS Desktop: Make every shot count with this ASUS ROG Strix gaming PC. The Intel Core i7 processor and 16GB of RAM offer powerful performance, while the NVIDIA GeForce RTX 2070 SUPER graphics card runs AAA titles at high settings. This ASUS ROG Strix gaming PC features a 1TB hard drive and 512GB SSD, combining massive storage and rapid load times.</br></br>Windows 10 operating system</br></br>Windows 10 brings back the Start Menu from Windows 7 and introduces new features, like the Edge Web browser that lets you markup Web pages on your screen. Learn more ›</br>9th Gen Intel® Core™ i7-9700F processor</br></br>Powerful eight-core, eight-way processing performance.</br>16GB system memory for intense multitasking and gaming</br></br>Reams of high-bandwidth DDR4 RAM to smoothly run your graphics-heavy PC games and video-editing applications, as well as numerous programs and browser tabs all at once.</br>1TB hard drive and 512GB solid state drive (SSD) for a blend of storage space and speed</br></br>The hard drive provides ample storage, while the SSD delivers faster start-uptimes and data access.</br>NVIDIA GeForce RTX 2070 SUPER graphics</br></br>Driven by 8GB GDDR6 dedicated video memory to quickly render high-quality images for videos and games.</br>1 USB Type-C port</br></br>To maximize performance on the latest high-speed devices.</br>Next-generation wireless connectivity</br></br>Connects to your network or hotspots on all current Wi-Fi standards. Connect to a Wireless-AC router for speed nearly 3x faster than Wireless-N. Gigabit LAN port also plugs into wired networks.</br>Bluetooth 5.0 interface syncs with compatible devices</br></br>Wirelessly transfer photos, music and other media between the desktop and your Bluetooth-enabled cell phone or MP3 player, or connect Bluetooth wireless accessories.</br>";
const LENOVO_DESC = "</br>Engineered out of a passion for savage power and unmatched speed, the Lenovo™ Legion Tower 5 AMD delivers mind-blowing performance that combines AMD Ryzen processors and top-of-the-line NVIDIA® GeForce® graphics cards for blazing-fast frame rates at up to 4K resolution. Pushing far beyond the upper bounds of smaller rig configurations while keeping things cool and whisper quiet, the Legion Tower 5 is a marvel of build and design, accentuated by its illuminated blue LED logo and lighting, as well a transparent side panel that can properly showcase your internals.</br></br>Windows 10 operating system</br></br>Windows 10 brings back the Start Menu from Windows 7 and introduces new features, like the Edge Web browser that lets you markup Web pages on your screen. Learn more ›</br>Ryzen 7 3700X</br></br>Imagine, design and create without boundaries. The powerful AMD Ryzen™ 7 processor features machine intelligence that anticipates your needs. Discover true responsiveness with 8 cores and 16 threads for ultimate performance.</br>16GB system memory for intense multitasking and gaming</br></br>Reams of high-bandwidth DDR4 RAM to smoothly run your graphics-heavy PC games and video-editing applications, as well as numerous programs and browser tabs all at once.</br>1TB hard drive and 256GB solid state drive (SSD) for a blend of storage space and speed</br></br>The hard drive provides ample storage, while the SSD delivers faster start-up times and data access.</br>NVIDIA GeForce GTX 1660 Super graphics</br></br>Backed by 6GB GDDR6 dedicated video memory for a fast, advanced GPU to fuel your games.</br>4 USB 3.2 ports maximize the latest high-speed devices</br></br>Also includes 1 USB C port and 2 USB 2.0 ports to connect more accessories and peripherals. The USB 3.2 ports are backward-compatible with USB 2.0 devices (at 2.0 speeds).</br>Wireless and wired network connectivity</br></br>Built-in high-speed wireless LAN connects to your network on 802.11ax (2.4Gbps) Wi-Fi standards. The Gigabit Ethernet LAN port plugs into wired 10/100/1000 networks.</br>Bluetooth 5.0 interface syncs with compatible devices</br></br>Wirelessly transfer photos, music and other media between the desktop and your Bluetooth-enabled cell phone or MP3 player, or connect Bluetooth wireless accessories.";
const ARC_DESC = "Upgrade your current gaming rig with this iBUYPOWER Desktop. It’s 8GB of RAM and Intel i3-9100F processor let you run multiple programs at once, and its NVIDIA GeForce GT 710 card renders fast-paced action smoothly without screen tearing. This iBUYPOWER desktop also has a 480GB solid state drive for saving your favorite games.</br>Features</br></br>Intel 9th Generation Core i3</br></br>Windows 10 operating system</br></br>Windows 10 brings back the Start Menu from Windows 7 and introduces new features, like the Edge Web browser that lets you markup Web pages on your screen. Learn more ›</br>Intel i3-9100F processor</br></br>Native four-core processing delivers aggressive yet power-smart performance for advanced gaming, complex modeling and HD video editing.</br>8GB system memory for advanced multitasking</br></br>Ream of high-bandwidth DDR4 RAM to smoothly run your graphics-heavy PC games and video-editing applications, as well as numerous programs and browser tabs all at once.</br>480GB solid state drive (SSD) for a blend of storage space and speed</br></br>The SSD offers tons of storage for your files and favorite games, while also providing blazing fast boot up times.</br>NVIDIA GeForce GT 710 graphics</br></br>Driven by 1GB dedicated video memory to quickly render high-quality images for videos and games.</br>Wired network connectivity</br></br>Built-in Gigabit Ethernet LAN port plugs into your wired network.</br>"
const HP_OMEN_DESC = "HP OMEN 30L by HP Desktop: Edge out the competition with this HP OMEN 30L gaming desktop PC. The AMD Ryzen 7 processor and 16GB of RAM run multiplayer titles smoothly, while the NVIDIA GeForce RTX 2060 graphics card delivers fluid visuals in fast-paced scenes. This HP OMEN 30L gaming desktop PC combines a 256GB SSD and a 1TB hard drive for spacious, high-performance storage.</br></br>Windows 10 operating system</br></br>Windows 10 brings back the Start Menu from Windows 7 and introduces new features, like the Edge Web browser that lets you markup Web pages on your screen. Learn more ›</br>Ryzen 7</br></br>Imagine, design and create without boundaries. The powerful AMD Ryzen™ 7 processor features machine intelligence that anticipates your needs. Discover true responsiveness with 8 cores and 16 threads for ultimate performance.</br>16GB system memory for intense multitasking and gaming</br></br>Reams of high-bandwidth DDR4 RAM to smoothly run your graphics-heavy PC games and video-editing applications, as well as numerous programs and browser tabs all at once.</br>1TB hard drive and 256GB solid state drive (SSD) for a blend of storage space and speed</br></br>The hard drive provides ample storage, while the SSD delivers faster start-up times and data access.</br>Cloud support lets you access your files anywhere</br></br>Store your photos, videos, documents and other files on Dropbox for secure access across multiple devices. Fees may apply.</br>NVIDIA GeForce RTX 2060 graphics</br></br>Driven by 6GB GDDR6 dedicated video memory to quickly render high-quality images for videos and games.</br>1 SuperSpeed 10Gbs USB 3.1 port</br></br>Ultra-fast data connections to transfer large files rapidly.</br>6 USB 3.0 ports maximize the latest high-speed devices</br></br>The USB 3.0 ports are backward-compatible with USB 2.0 devices (at 2.0 speeds).</br>Wireless and wired network connectivity</br></br>Built-in high-speed wireless LAN connects to your network on the most common Wi-Fi standards. Gigabit Ethernet LAN port plugs into wired networks.</br>Bluetooth 5.0 interface syncs with compatible devices</br></br>Wirelessly transfer photos, music and other media between the desktop and your Bluetooth-enabled cell phone or MP3 player, or connect Bluetooth wireless accessories.</br>"; 
const DELL_G5_DESC = "Dell G5 Desktop: Dominate the battlefield with this Dell G5 desktop computer. The Intel Core i7 processor and 16GB of RAM deliver solid power for running modern titles smoothly, while the 1TB SSD offers ample storage for games and high performance. This Dell G5 desktop computer has an NVIDIA GeForce GTX 1660 Ti graphics card for high-quality visuals and total immersion in your favorite RPG or FPS titles.</br></br>Windows 10 Operating System</br></br>Windows 10 brings back the Start Menu from Windows 7 and introduces new features, like the Edge Web browser that lets you markup Web pages on your screen.</br>10 Gen Intel Core i7-10700Fprocessor</br></br>Powerful 8-core, 16-way processing performance. Intel Turbo Boost Technology delivers dynamic extra power when you need it, while increasing energy efficiency when you don't.</br>16GB system memory for intense multitasking and gaming</br></br>Reams of high-bandwidth DDR4 RAM to smoothly run your graphics-heavy PC games and video-editing applications, as well as numerous programs and browser tabs all at once</br>1TB Solid State Drive</br></br>A solid state drive with ample storage and faster start-up times and data access.</br>NVIDIA GTX 1660 Ti</br></br>Backed by 6 GB GDDR6 dedicated video memory for a fast, advanced GPU to fuel your games. NVIDIA technology optimizes the computer for both graphics performance and power conservation.</br>Bluetooth 5.1 Interface Syncs with Compatible Devices</br></br>Wirelessly transfer photos, music and other media between the desktop and your Bluetooth-enabled cell phone or MP3 player, or connect Bluetooth wireless accessories.</br>Upgrades Made Easy</br></br>By loosening two thumbscrews on the back, you can easily remove the side panel to access the internals of the system.</br>RGB Chassis Lighting plus a Clear Side Panel</br></br>2-zone RGB LED lighting so you can use Alienware Command Center to customize the lighting color of bar on the front of the PC and inside the unit (visible through the clear side panel).</br>Alienware Command Center</br></br>The Alienware Command Center is continuously updated. Our latest version now includes features specifically desired by the gaming community with auto-tuned game profiles, a new responsive UI, intuitive overclocking options and all-new AlienFX settings.</br>Conveniently Compact</br></br>The surprisingly compact design takes up minimal space, making it easier to adjust your full gaming setup or transport your PC to LAN parties.</br>Optimal cooling</br></br>With four thermal mode options that can be set in the Alienware Command Center, you can adjust based on your needs whether gaming, working, studying or watching videos.</br>Multidisplay capability</br></br>Connect a single monitor or add a second monitor to double your viewing space. Complete your gaming set up with one of Dell's gaming monitors or an Alienware monitor. (Monitors sold separately)</br>Basic Software Package Included</br></br>1-month trial of McAfee LiveSafe. 1-month trial of Microsoft.</br>Waves MaxxAudio</br></br>Integrated 7.1 with Waves MaxxAudio Pro (No External Speakers)</br>Additional ports</br></br>Microphone and headphone jacks</br>Wireless connectivity (Killer Wi-Fi 6 AX 1650i) and wired network connectivity</br></br>Flexible, dual-band connectivity w/ greater reliability thanks to two data streams and antennas. Wi-Fi speeds nearly 3X faster vs. standard Wi-Fi 5. 1x 10/100/1000 Ethernet port plugs into wired networks.</br>500W Chassis</br></br>Power supply with 500W to provide the performance needed for gaming.</br></br>";
/////////////////////////////////////////////////////////////////////////////////////////////////////
//// SYSTEMS
/////////////////////////////////////////////////////////////////////////////////////////////////////
const BUSINESS_SYSTEMS = [
    ["HP Office Prebuilt", 570, HP_PREBUILT_DESC, "Business", "Windows", "HP"],
    ["HP ENVY Desktop", 870, HP_ENVY_DESC, "Business", "Windows", "HP"],
    ["Dell Inspiron 3880 Desktop", 900, DELL_INSPIRON_DESC, "Business", "Windows", "Dell"],
    ["21.5-inch iMac", 1300, iMAC_DESC, "Business", "macOS", "Apple"]
];

const GAMING_SYSTEMS = [
    ["SkyTech Archangel", 1250, SKYTECH_DESC, "Gaming", "Windows", "Skytech"],
    ["ASUS ROG Gaming Desktop", 1550, ASUS_ROG_DESC, "Gaming", "Windows", "ASUS"],
    ["Lenovo Legion Tower 5", 1050, LENOVO_DESC, "Gaming", "Windows", "Lenovo"],
    ["iBUYPOWER ARC", 600, ARC_DESC, "Gaming", "Windows", "iBUYPOWER"]
];

const STREAMING_SYSTEMS = [
    ["27-inch iMac Pro", 5000, iMAC_PRO_DESC, "Streaming", "macOS", "Apple"],
    ["HP Pavilion", 1488, HP_PAVILION_DESC, "Streaming", "Windows", "HP"],
    ["HP OMEN", 1300, HP_OMEN_DESC, "Streaming", "Windows", "HP"],
    ["Dell G5", 1350, DELL_G5_DESC, "Streaming", "Windows", "Dell"]
];

const SYSTEMS = [BUSINESS_SYSTEMS, GAMING_SYSTEMS, STREAMING_SYSTEMS];
/////////////////////////////////////////////////////////////////////////////////////////////////////
//// COMPONENTS
/////////////////////////////////////////////////////////////////////////////////////////////////////
const GPU = [
    ["GTX 1060", "3 GB VRAM, VR ready", 250, "Nvidia", "GPU"],
    ["GTX 1080", "8GB VRAM, VR Ready, RTX compatible", 600, "Nvidia", "GPU"],
    ["R9 270", "4GB of VRAM, double fan heatsink", 300, "AMD", "GPU"]
];

const CPU = [
    ["Core i3-7700k", "3.0 Ghz, Kirby Lake architecture", 120, "Intel", "CPU"],
    ["Ryzen 5 3600", "6 Cores, 4.2 Ghz", 200, "AMD", "CPU"],
    ["Core i7-10700k", "10 Cores, 4.5 Ghz", 250, "Intel", "CPU"]
];

const MOBO = [
    ["Z490-A PRO", "LGA1200 Socket, 64GB", 180, "MSI", "MOBO"],
    ["ROG STRIX B550", "AM4 Socket, 128GB", 200, "ASUS", "MOBO"],
    ["ASRock B450M", "AM4 Socket, 64GB", 130, "ASRock", "MOBO"]
];

const RAM = [
    ["Vengeance LPX", "DDR4-3200, 2x8GB", 90, "Corsair", "RAM"], 
    ["Trident Z RGB", "DDR4-3600", 100, "G.Skill", "RAM"],
    ["Ballistix", "DDR4-3200", 85, "Crucial", "RAM"]
];

const STORAGE = [
    ["Barracuda Compute", "2TB, 7200RPM", 60, "Seagate", "STORAGE"], 
    ["970 Evo", "1TB, SSD", 350, "Samsung", "STORAGE"],
    ["Blue SN550", "1TB, SSD", 120, "Western Digital", "STORAGE"]
];

const PSU = [
    ["RM 2019", "ATX, 80+ Gold, 750 W", 125, "Corsair", "PSU"], 
    ["BQ", "ATX, 80+ Bronze, 600W", 60, "EVGA", "PSU"],
    ["SuperNOVA GA", "ATX, 80+ Gold, 750 W", 100, "EVGA", "PSU"]
];

const CASE = [
    ["NZXT H510", "ATX Mid, White", 70, "NZXT", "CASE"], 
    ["275R Airflow", "ATX Mid, Black", 100, "Corsair", "CASE"],
    ["Eclipse P300A", "ATX Full Tower, Black", 160, "Phanteks", "CASE"]
];

const COMPONENTS = [GPU, CPU, MOBO, RAM, STORAGE, PSU, CASE];

// PERMISSION LEVELS
const VISITOR = 0;
const USER = 1;
const DELIVERER = 2;
const MANU = 3;
const CLERK = 4;
const ADMIN = 5;


// LINKS TO PAGES
const HREFS = [
    "../Welcome/welcome.html",
    "", // account info
    "../Balance/index.html",
    "../MarketPlace/index.html",
    "../Cart Page/index.html",
    "", // forum
    "", // delivery
    "../Admin/index.html"
];

const LINK_NAMES = [
    "Home Page",
    "Account Info",
    "Balance",
    "Marketplace",
    "Shopping Cart",
    "Forum",
    "Delivery System",
    "Administrative"
];

const USER1 = [
    "user@pc.com",
    "user123",
    "user123",
    1,
    500,
    0,
    0
];

// SUPERUSERS
const DELIVERER1 = [
    "ups@ups.com",
    "ups_delivery",
    "delivery1",
    2,
    500,
    0,
    0
];

const DELIVERER2 = [
    "fedex@fedex.com",
    "fedex_delivery",
    "delivery2",
    2,
    500,
    0,
    0
];

const MANU1 = [
    "intel@pc.com",
    "intel",
    "intel",
    3,
    500,
    0,
    0
];

const MANU2 = [
    "nvidia@pc.com",
    "nvidia",
    "nvidia",
    3,
    500,
    0,
    0
];

const MANU3 = [
    "amd@pc.com",
    "amd",
    "amd",
    3,
    500,
    0,
    0
];

const MANU4 = [
    "corsair@pc.com",
    "corsair",
    "corsair",
    3,
    500,
    0,
    0
];

const CLERK1 = [
    "clerk@pc.com",
    "clerk",
    "clerk1",
    4,
    500,
    0,
    0
];

const ADMIN1 = [
    "admin@pc.com",
    "admin",
    "admin1",
    5,
    99999999,
    99999999,
    0
];

// database will always contain these users
const SUPERUSERS = [
    DELIVERER1, DELIVERER2, CLERK1, ADMIN1,
    MANU1, MANU2, MANU3, MANU4, USER1
];


// IDs for the component/system tables
const TABLE_COMPONENT_IDs = [
    "gpu-table", "cpu-table", "mobo-table", "ram-table", "storage-table",
    "psu-table", "case-table"
];

const TABLE_COMPUTER_IDs = [
    "windows-table", "mac-table", "business-table", "gaming-table", "streaming-table"
]

// Table Header names
const COMPONENT_HEADER_NAMES = [
    "Image", "Name", "Description", "Price ($)", "Manufacturer"
];

const COMPUTER_HEADER_NAMES = [
    "Image", "Name", "Operating System", "Price ($)", "Manufacturer"
];