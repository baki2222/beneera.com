import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.substring(0, max - 3) + '...';
}

// Category-specific feature/spec templates
const categoryTemplates: Record<string, {
  features: (title: string) => string[];
  specs: (title: string) => Record<string, string>;
  descriptionTemplate: (title: string) => string;
}> = {
  'brake-parts': {
    features: (title) => [
      `Premium quality ${title.toLowerCase().includes('ceramic') ? 'ceramic' : 'semi-metallic'} brake pads engineered for optimal stopping power`,
      'Low-dust formula keeps wheels cleaner and reduces brake noise for a quieter ride',
      'Scorched and chamfered edges for immediate, noise-free braking right out of the box',
      'OE-style hardware included for easy, bolt-on installation with no modifications required',
      'Designed for daily driving, highway commutes, and light towing applications',
      'Meets or exceeds OEM specifications for quality assurance and reliable performance',
    ],
    specs: (title) => ({
      'Material': title.toLowerCase().includes('ceramic') ? 'Advanced Ceramic Compound' : 'Carbon-Fiber Ceramic',
      'Position': title.toLowerCase().includes('rear') ? 'Rear Axle' : 'Front Axle',
      'Noise Level': 'Low / Noise-Free',
      'Dust Level': 'Low Dust',
      'Hardware Included': 'Yes',
      'Warranty': 'Limited Lifetime',
    }),
    descriptionTemplate: (title) => `The ${title} delivers superior stopping performance for your vehicle. Engineered with advanced friction materials, these pads provide consistent, fade-free braking in both everyday driving and demanding conditions. The precision-engineered design ensures a perfect fit with OE-spec tolerances, while the included hardware kit makes installation straightforward. Featuring noise-dampening shims and chamfered edges, these brake pads offer a smooth, quiet braking experience right from the start. Whether you're commuting to work or navigating stop-and-go traffic, trust these brake pads to deliver safe, reliable stopping power mile after mile.`,
  },
  'engine-parts': {
    features: (title) => [
      `High-quality ${title.split(' ').slice(0, 3).join(' ')} designed for reliable engine performance`,
      'Precision-engineered to meet or exceed OEM specifications for a perfect fit',
      'Durable construction using premium materials for extended service life',
      'Easy direct-fit installation — no special tools or modifications required',
      'Helps maintain optimal engine efficiency and fuel economy',
      'Compatible with a wide range of popular vehicle makes and models',
    ],
    specs: (title) => ({
      'Material': 'Premium Grade',
      'Fitment Type': 'Direct Replacement',
      'Installation': 'Direct Fit / Bolt-On',
      'OEM Compatible': 'Yes',
      'Warranty': '1 Year Limited',
    }),
    descriptionTemplate: (title) => `Keep your engine running at its best with the ${title}. This precision-engineered component is designed to deliver reliable, consistent performance throughout its service life. Made from premium-grade materials, it meets or exceeds original equipment specifications to ensure a perfect fit and optimal function. Whether you're performing routine maintenance or replacing a worn part, this component makes installation easy with its direct-fit design. Maintain your vehicle's performance, fuel efficiency, and reliability with confidence — backed by our satisfaction guarantee and fast shipping on orders over $49.`,
  },
  'automotive-lighting': {
    features: (title) => [
      `Ultra-bright ${title.toLowerCase().includes('led') ? 'LED' : ''} lighting with enhanced visibility for safer driving`,
      'Energy-efficient design consumes less power than standard bulbs while producing brighter output',
      'Plug-and-play installation — fits standard sockets with no wiring modifications needed',
      'Premium materials with advanced heat dissipation for longer lifespan (50,000+ hours)',
      'Wide-angle beam pattern for maximum road coverage and visibility',
      'DOT/SAE compliant design ensures legal operation on public roads',
    ],
    specs: (title) => ({
      'Light Source': title.toLowerCase().includes('led') ? 'LED' : 'Standard',
      'Color Temperature': '6000K Pure White',
      'Lifespan': '50,000+ Hours',
      'Installation': 'Plug & Play',
      'Waterproof Rating': 'IP67',
      'Voltage': '12V DC',
    }),
    descriptionTemplate: (title) => `Upgrade your vehicle's lighting with the ${title}. These high-performance lights deliver brilliant illumination that dramatically improves your visibility and safety on the road. Featuring advanced optical design and premium components, they produce a powerful, consistent beam that cuts through darkness, fog, and adverse weather conditions. The plug-and-play design makes installation a breeze — simply swap out your old bulbs and enjoy immediate results. Built to last with superior heat management and weather-resistant construction, these lights provide reliable performance season after season.`,
  },
  'car-care-detailing': {
    features: (title) => [
      `Professional-grade ${title.split(' ').slice(0, 4).join(' ').toLowerCase()} for showroom-quality results`,
      'Safe for use on all automotive surfaces including paint, chrome, glass, and trim',
      'Advanced formula that lifts and removes contaminants without scratching or swirling',
      'Easy application and buffing — no special tools or experience required',
      'Long-lasting protection helps repel water, dirt, and UV damage',
      'Economical concentrated formula provides exceptional value per use',
    ],
    specs: (title) => ({
      'Product Type': 'Car Care / Detailing',
      'Surface Compatibility': 'All Automotive Surfaces',
      'Application Method': 'Hand or Machine',
      'Safe for Clear Coat': 'Yes',
      'UV Protection': 'Yes',
    }),
    descriptionTemplate: (title) => `Achieve professional detailing results at home with the ${title}. This premium car care product is formulated with advanced cleaning and protection technology to restore and maintain your vehicle's appearance. Whether you're tackling a weekend wash or performing a full detail, this product delivers consistent, impressive results that rival professional services. Safe for use on all exterior and interior surfaces, it effectively removes road grime, water spots, and environmental contaminants while leaving behind a protective layer that keeps your car looking its best longer.`,
  },
  'tools-equipment': {
    features: (title) => [
      `Professional-quality ${title.split(' ').slice(0, 4).join(' ').toLowerCase()} built for demanding automotive work`,
      'Heavy-duty construction with premium materials for years of reliable use',
      'Ergonomic design for comfortable use during extended work sessions',
      'Versatile functionality suitable for DIY enthusiasts and professional mechanics alike',
      'Precision-machined components ensure accurate and consistent results',
      'Compact and portable design with organized storage solution',
    ],
    specs: (title) => ({
      'Material': 'Chrome Vanadium / Hardened Steel',
      'Professional Grade': 'Yes',
      'Warranty': 'Limited Lifetime',
      'Storage': 'Blow-Molded Case / Organized Tray',
    }),
    descriptionTemplate: (title) => `The ${title} is an essential addition to any home garage or professional workshop. Built with professional-grade materials and precision engineering, this tool delivers the performance and durability you need for automotive repair and maintenance tasks. The ergonomic design ensures comfortable operation even during extended use, while the robust construction withstands the demands of daily professional use. Whether you're a weekend warrior or a certified technician, this tool provides the reliability and precision you need to get the job done right.`,
  },
  'interior-accessories': {
    features: (title) => [
      `Premium ${title.split(' ').slice(0, 4).join(' ').toLowerCase()} designed to enhance your driving experience`,
      'Universal fit compatible with most cars, trucks, and SUVs',
      'Easy installation with no tools or permanent modifications required',
      'Durable materials built to withstand daily use and temperature extremes',
      'Sleek, modern design that complements any vehicle interior',
      'Improves comfort, convenience, and organization during every drive',
    ],
    specs: (title) => ({
      'Compatibility': 'Universal Fit — Most Cars, Trucks, SUVs',
      'Installation': 'Tool-Free / No Modifications',
      'Material': 'Premium ABS / Silicone / Microfiber',
      'Temperature Range': '-20°F to 200°F',
    }),
    descriptionTemplate: (title) => `Transform your daily commute with the ${title}. This thoughtfully designed interior accessory adds convenience, comfort, and style to your vehicle's cabin. With its universal fit design, it works seamlessly with most cars, trucks, and SUVs — no special tools or permanent modifications needed. Made from premium, automotive-grade materials, it's built to withstand the rigors of daily use including temperature extremes and UV exposure. Upgrade your driving experience with this must-have accessory that combines practical functionality with modern aesthetics.`,
  },
  'exterior-accessories': {
    features: (title) => [
      `High-quality ${title.split(' ').slice(0, 4).join(' ').toLowerCase()} for enhanced exterior protection and style`,
      'Precision-engineered for a seamless, factory-quality appearance',
      'Weather-resistant materials that withstand rain, sun, snow, and road debris',
      'Easy installation with included hardware — no drilling or modification needed',
      'UV-stabilized finish that won\'t fade, crack, or peel over time',
      'Custom-fit design available for popular vehicle makes and models',
    ],
    specs: (title) => ({
      'Material': 'Automotive-Grade ABS / Rubber / Chrome',
      'Weather Resistant': 'Yes — All Seasons',
      'UV Protected': 'Yes',
      'Installation': 'Hardware Included / Adhesive',
      'Finish': 'OEM-Match / Paintable',
    }),
    descriptionTemplate: (title) => `Add style and protection to your vehicle with the ${title}. Crafted from premium automotive-grade materials, this exterior accessory is designed to enhance your vehicle's appearance while providing real-world protection against the elements. The precision-engineered fit delivers a clean, factory-quality look that seamlessly integrates with your vehicle's existing design. Built to withstand harsh weather conditions, UV exposure, and road debris, this accessory maintains its appearance and performance season after season.`,
  },
  'car-electronics': {
    features: (title) => [
      `Advanced ${title.split(' ').slice(0, 4).join(' ').toLowerCase()} with cutting-edge technology`,
      'Crystal-clear high-resolution display for optimal visibility day and night',
      'Easy setup with wireless connectivity — Bluetooth, WiFi, or plug-and-play USB',
      'Compact, sleek design that integrates seamlessly into your vehicle\'s dashboard',
      'Built-in memory or expandable storage via microSD card',
      'Automatic operation with smart features for hands-free convenience',
    ],
    specs: (title) => ({
      'Display': 'HD / 4K Resolution',
      'Connectivity': 'Bluetooth 5.0, WiFi, USB',
      'Power Supply': '12V Car Adapter / Battery',
      'Storage': 'Built-in + microSD Expansion',
      'Operating Temperature': '-4°F to 158°F',
    }),
    descriptionTemplate: (title) => `Stay connected and protected on the road with the ${title}. This state-of-the-art automotive electronics device delivers premium features and reliable performance for today's connected driver. With its intuitive interface and wireless connectivity options, it integrates seamlessly into your driving routine. The high-resolution display ensures crystal-clear visibility in all lighting conditions, while the robust construction withstands the temperature extremes of a vehicle environment. Smart features automate common tasks so you can focus on the road ahead.`,
  },
  'tires-wheels': {
    features: (title) => [
      `Premium ${title.split(' ').slice(0, 4).join(' ').toLowerCase()} for optimal wheel performance and appearance`,
      'Durable construction from high-quality materials for long-lasting use',
      'Universal compatibility with standard tire stem and wheel sizes',
      'Helps maintain tire pressure and monitor valve conditions',
      'Corrosion-resistant finish for year-round reliability in all weather',
      'Easy installation — no special tools required',
    ],
    specs: (title) => ({
      'Compatibility': 'Universal Standard Valve Stems',
      'Material': 'Anodized Aluminum / Premium Alloy',
      'Corrosion Resistant': 'Yes',
      'Qty Per Package': 'Set of 4',
    }),
    descriptionTemplate: (title) => `Keep your wheels looking great and performing their best with the ${title}. Made from premium materials with corrosion-resistant finishes, these accessories are built to withstand the harsh conditions your wheels face daily — from road salt and rain to UV exposure and debris. The universal fit design works with standard wheel and valve stem sizes across most vehicle types. Easy to install in minutes with no special tools, they add both functional value and visual appeal to your ride.`,
  },
  'truck-accessories': {
    features: (title) => [
      `Heavy-duty ${title.split(' ').slice(0, 4).join(' ').toLowerCase()} built for trucks and full-size vehicles`,
      'Rugged construction that handles tough conditions — hauling, towing, and off-road use',
      'Direct-fit design for popular truck makes including Ford, Chevy, RAM, and Toyota',
      'Weather-resistant materials rated for extreme temperatures and outdoor exposure',
      'Tool-free or simple bolt-on installation with included hardware',
      'Backed by our satisfaction guarantee and dedicated support team',
    ],
    specs: (title) => ({
      'Vehicle Type': 'Trucks, Full-Size SUVs, Heavy Duty',
      'Material': 'Heavy-Duty Steel / Industrial Polymer',
      'Weather Rating': 'All-Season / Extreme Conditions',
      'Installation': 'Bolt-On / Hardware Included',
      'Load Rating': 'Rated for Truck/Towing Use',
    }),
    descriptionTemplate: (title) => `Built tough for truck life, the ${title} is engineered to handle the demanding conditions that truck owners face daily. Whether you're hauling cargo, towing a trailer, or tackling rough terrain, this accessory delivers the rugged reliability you expect. Constructed from heavy-duty materials with weather-resistant finishes, it stands up to the elements season after season. The straightforward installation gets you back on the road quickly, with all necessary hardware included.`,
  },
  'performance-parts': {
    features: (title) => [
      `High-performance ${title.split(' ').slice(0, 4).join(' ').toLowerCase()} for enhanced engine output`,
      'Engineered for increased horsepower, torque, and throttle response',
      'Premium materials and precision construction for racing-grade durability',
      'Direct bolt-on installation — no cutting, welding, or permanent modification',
      'Dyno-tested and proven to deliver measurable performance gains',
      'Compatible with factory ECU — no custom tuning required',
    ],
    specs: (title) => ({
      'Performance Gain': 'Up to 10-15% Improvement',
      'Installation Type': 'Direct Bolt-On',
      'ECU Compatible': 'Yes — No Tune Required',
      'Material': 'Billet Aluminum / High-Flow Media',
      'Warranty': '1 Year Performance Guarantee',
    }),
    descriptionTemplate: (title) => `Unleash your vehicle's true potential with the ${title}. This performance-engineered upgrade is designed to deliver measurable gains in horsepower, torque, and overall drivability. Using premium materials and precision manufacturing, it provides racing-inspired performance in a bolt-on package that won't void your factory warranty. The direct-fit design integrates seamlessly with your vehicle's existing systems, requiring no custom fabrication or ECU tuning. Experience the difference that quality performance parts make — sharper throttle response, stronger acceleration, and a more engaging driving experience.`,
  },
  'towing-hitches': {
    features: (title) => [
      `Premium ${title.split(' ').slice(0, 4).join(' ').toLowerCase()} rated for heavy towing and hauling`,
      'Constructed from high-strength steel with corrosion-resistant finish',
      'Meets or exceeds SAE J684 standard for towing safety certification',
      'Universal or vehicle-specific fit for secure, wobble-free towing',
      'Easy installation with included mounting hardware and instructions',
      'Perfect for trailers, boat hauling, bike racks, and cargo carriers',
    ],
    specs: (title) => ({
      'Material': 'High-Strength Steel',
      'Finish': 'Powder-Coated / Chrome',
      'Towing Standard': 'SAE J684 Certified',
      'Hitch Class': 'Class III / IV',
      'Receiver Size': '2-inch Standard',
    }),
    descriptionTemplate: (title) => `Tow with confidence using the ${title}. Engineered from high-strength steel and finished with corrosion-resistant coatings, this towing accessory delivers the strength and reliability you need for safe hauling. Whether you're pulling a boat, connecting a bike rack, or securing a cargo carrier, this product provides a secure, wobble-free connection that inspires confidence. The included hardware and straightforward installation instructions make setup quick and easy.`,
  },
  'oil-fluids-chemicals': {
    features: (title) => [
      `Advanced ${title.split(' ').slice(0, 4).join(' ').toLowerCase()} formulated for maximum engine protection`,
      'Reduces friction, heat, and wear to extend engine and component life',
      'Compatible with conventional, synthetic, and blend oils and fluids',
      'Easy pour bottle with precise application — no special tools needed',
      'Proven formula used by professional mechanics and racing teams',
      'Helps restore lost performance and improve fuel efficiency',
    ],
    specs: (title) => ({
      'Product Type': 'Engine Treatment / Fluid Additive',
      'Compatibility': 'Conventional, Synthetic & Blend',
      'Application': 'Add to Existing Fluids',
      'Treatment Period': 'Every Oil Change / As Needed',
    }),
    descriptionTemplate: (title) => `Protect and optimize your engine with the ${title}. This advanced automotive chemical is formulated with cutting-edge technology to deliver superior protection for your vehicle's critical systems. By reducing friction and heat buildup, it helps extend component life while maintaining peak performance. The easy-to-use formula can be added directly to your existing fluids with no special tools or expertise required. Trusted by professional mechanics and automotive enthusiasts alike, this product represents the latest in fluid technology for modern engines.`,
  },
  'body-parts-mirrors': {
    features: (title) => [
      `Precision-fit ${title.split(' ').slice(0, 4).join(' ').toLowerCase()} matching OEM quality and appearance`,
      'Direct replacement design for easy, bolt-on installation',
      'Durable construction meeting or exceeding factory specifications',
      'Includes all necessary mounting hardware and wiring connectors',
      'Factory-match finish or paintable surface for seamless integration',
      'Full adjustability for optimal viewing angles and driver safety',
    ],
    specs: (title) => ({
      'Fitment': 'Direct OEM Replacement',
      'Finish': 'Factory-Match / Paintable',
      'Hardware Included': 'Yes — Complete Kit',
      'Adjustability': 'Manual / Power (Vehicle Specific)',
      'DOT Certified': 'Yes',
    }),
    descriptionTemplate: (title) => `Restore your vehicle's appearance and safety with the ${title}. This precision-engineered replacement part is designed to match factory quality and fit, providing the same performance and appearance as the original. The direct-fit design ensures hassle-free installation with included mounting hardware and connectors. Whether you're replacing a damaged component or upgrading your vehicle's style, this part delivers the quality, durability, and safety you expect from OE-grade components.`,
  },
  'safety-emergency': {
    features: (title) => [
      `Essential ${title.split(' ').slice(0, 4).join(' ').toLowerCase()} for vehicle safety and roadside emergencies`,
      'Compact design stores easily in your trunk, glove box, or center console',
      'Durable construction built to perform when you need it most',
      'Easy to use — designed for quick deployment in high-stress situations',
      'Meets DOT/FMVSS safety standards for regulatory compliance',
      'Ideal gift for new drivers, road trips, and everyday peace of mind',
    ],
    specs: (title) => ({
      'Product Type': 'Vehicle Safety / Emergency',
      'Certification': 'DOT / FMVSS Compliant',
      'Storage': 'Compact — Trunk / Glove Box',
      'Includes': 'Carrying Case / Storage Bag',
    }),
    descriptionTemplate: (title) => `Be prepared for the unexpected with the ${title}. This essential vehicle safety product gives you peace of mind on every drive, whether you're commuting to work or heading out on a long road trip. Designed for quick, intuitive use in high-stress situations, it requires no special training or expertise. The compact design fits conveniently in your trunk or center console, always ready when you need it most. Meets all applicable DOT safety standards for reliable, certified protection.`,
  },
};

// Default template for any category not specifically listed
const defaultTemplate = {
  features: (title: string) => [
    `Premium quality ${title.split(' ').slice(0, 4).join(' ').toLowerCase()} for your vehicle`,
    'Constructed from durable, high-quality automotive-grade materials',
    'Easy installation with no special tools or modifications required',
    'Compatible with a wide range of popular vehicle makes and models',
    'Backed by our satisfaction guarantee and dedicated customer support',
    'Free shipping on orders over $49 within the continental U.S.',
  ],
  specs: (title: string) => ({
    'Product Type': 'Automotive Accessory',
    'Material': 'Premium Automotive Grade',
    'Installation': 'Easy / DIY Friendly',
    'Compatibility': 'Universal / Multi-Vehicle',
  }),
  descriptionTemplate: (title: string) => `Upgrade your vehicle with the ${title}. This premium automotive product is designed to deliver exceptional quality and performance for today's drivers. Made from carefully selected materials and engineered with precision, it provides a perfect balance of durability, functionality, and value. The straightforward installation process means you can enjoy the benefits without costly professional labor. Whether you're maintaining your daily driver or customizing your weekend project, trust this product to deliver results that exceed your expectations.`,
};

async function main() {
  console.log('🔍 Starting SEO product data enrichment...\n');

  const products = await prisma.product.findMany({
    where: {
      sourceUrl: { not: '' },
      features: { isEmpty: true },
    },
    select: {
      id: true,
      title: true,
      sourceUrl: true,
      category: { select: { slug: true, name: true } },
    },
    orderBy: { id: 'asc' },
  });

  console.log(`Found ${products.length} products to enrich.\n`);

  let successCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const catSlug = product.category?.slug || '';
    const template = categoryTemplates[catSlug] || defaultTemplate;

    const features = template.features(product.title);
    const specifications = template.specs(product.title);
    const description = template.descriptionTemplate(product.title);
    const shortDescription = features[0];
    const seoTitle = truncate(`${product.title} | Beneera Auto Parts`, 70);
    const metaDescription = truncate(`${features[0]}. ${features[1]}`, 155);

    try {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          features,
          specifications,
          description,
          shortDescription,
          seoTitle,
          metaDescription,
        },
      });
      console.log(`[${i + 1}/${products.length}] ✅ ${product.title.substring(0, 50)}... (${product.category?.name || 'No category'})`);
      successCount++;
    } catch (err: any) {
      console.error(`[${i + 1}/${products.length}] ❌ ${product.title.substring(0, 50)}... Error: ${err.message}`);
    }
  }

  console.log(`\n✅ Enrichment complete! ${successCount}/${products.length} products updated.`);
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
