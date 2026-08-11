import type { Core } from '@strapi/strapi';
import { DRINK_CATEGORIES, MENU_CATEGORIES } from './seed/menuData';
import { statSync } from 'node:fs';
import { resolve } from 'node:path';

const locations = [
  {
    name: 'Suwanee', slug: 'suwanee', state: 'Georgia',
    address: '3131 Lawrenceville-Suwanee Rd, Ste B5', city: 'Suwanee, GA 30024',
    phone: '470-589-1112', latitude: 34.0236, longitude: -84.0519,
    locationStatus: 'open', hours: 'Tue–Fri 4:30–10 · Sat 11–10 · Sun 12–9:30',
    orderUrl: 'https://order.toasttab.com/online/kitchen-master-bistro-2-3131-lawrenceville-suwanee-rd-b5',
    reservationUrl: 'https://resy.com/cities/suwanee-ga/venues/kitchen-master-suwanee?date=2026-08-11&seats=2', sortOrder: 1,
  },
  {
    name: 'Frisco', slug: 'frisco', state: 'Texas', address: '9285 Preston Rd',
    city: 'Frisco, TX 75033', phone: '469-362-8001', latitude: 33.1548354,
    longitude: -96.8039115, locationStatus: 'open',
    hours: 'Mon–Thu 11–2:30, 4:30–9 · Fri–Sat until 9:30',
    orderUrl: 'https://order.toasttab.com/online/kitchen-master-bistro-9285-preston-rd', sortOrder: 2,
  },
  {
    name: 'Southlake', slug: 'southlake', state: 'Texas', address: '3311 E State Hwy 114',
    city: 'Southlake, TX 76092', phone: '214-724-5600', latitude: 32.9369978,
    longitude: -97.1029086, locationStatus: 'open', hours: 'Tue–Thu 11–9 · Fri–Sat 11–10',
    orderUrl: 'https://order.toasttab.com/online/kitchen-master-bistro-southlake-3311-w-state-hwy-114', sortOrder: 3,
  },
  {
    name: 'Midtown Atlanta', slug: 'midtown', state: 'Georgia', address: 'Address to be announced',
    city: 'Atlanta, GA', phone: 'Coming soon', latitude: 33.7838, longitude: -84.3831,
    locationStatus: 'coming-soon', hours: 'Opening details coming soon', orderUrl: '', sortOrder: 4,
  },
] as const;

const sitePages = [
  { title: 'Home', slug: 'home', pageType: 'home', heroTitle: 'Tradition,', heroAccent: 'mastered.', heroDescription: 'Soup dumplings, fresh sushi, and bold modern plates—crafted daily at Kitchen Master.', sortOrder: 1 },
  { title: 'Our Story', slug: 'our-story', pageType: 'story', heroTitle: 'Old-world technique.', heroAccent: 'New-world spirit.', heroDescription: 'Taiwanese and Japanese traditions meet a modern American point of view.', sortOrder: 2 },
  { title: 'Private Dining', slug: 'private-dining', pageType: 'private-dining', heroTitle: 'Gather around', heroAccent: 'our table.', heroDescription: 'Plan a private dinner, celebration, or group dining experience.', sortOrder: 3 },
  { title: 'Contact', slug: 'contact', pageType: 'contact', heroTitle: 'Come say', heroAccent: 'hello.', heroDescription: 'Questions, feedback, and general inquiries for Kitchen Master.', sortOrder: 4 },
  { title: 'Careers', slug: 'careers', pageType: 'careers', heroTitle: 'Master your', heroAccent: 'craft.', heroDescription: 'Build your hospitality career with Kitchen Master.', sortOrder: 5 },
  { title: 'Franchise Opportunities', slug: 'franchise', pageType: 'franchise', heroTitle: 'Grow with', heroAccent: 'Kitchen Master.', heroDescription: 'Learn about future franchise and development opportunities.', sortOrder: 6 },
] as const;

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    async function cmsImage(fileName: string) {
      const existing = await strapi.db.query('plugin::upload.file').findOne({ where: { name: fileName } });
      if (existing) return existing.id;
      const path = resolve(process.cwd(), '..', 'public', 'images', fileName);
      const type = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
      const uploaded = await strapi.plugin('upload').service('upload').upload({
        data: {}, files: { filepath: path, originalFilename: fileName, mimetype: type, size: statSync(path).size },
      });
      return uploaded[0]?.id;
    }
    const existingLocations = await strapi.documents('api::location.location').findMany({ limit: 1 });

    if (existingLocations.length === 0) {
      for (const location of locations) {
        await strapi.documents('api::location.location').create({
          data: location,
          status: 'published',
        });
      }
    }

    for (const location of locations) {
      const existing = await strapi.documents('api::location.location').findFirst({ filters: { slug: location.slug } });
      if (existing && !existing.heroTitle) {
        await strapi.documents('api::location.location').update({
          documentId: existing.documentId,
          data: {
            contactEmail: 'Management@kitchenmasterga.com',
            heroEyebrow: 'Taiwanese craft · Japanese precision',
            heroTitle: 'Tradition,', heroAccent: 'mastered.',
            heroDescription: `Soup dumplings, fresh sushi, and bold modern plates—crafted daily in ${location.name}.`,
            seoTitle: `Kitchen Master ${location.name} | Taiwanese & Japanese Dining`,
            seoDescription: `Explore menus, hours, reservations, and directions for Kitchen Master in ${location.city}.`,
            seoKeywords: `Kitchen Master, ${location.name} restaurant, soup dumplings, sushi, Taiwanese food, Japanese food`,
          },
          status: 'published',
        });
      }
      if (existing && location.slug === 'suwanee' && existing.reservationUrl !== location.reservationUrl) {
        await strapi.documents('api::location.location').update({ documentId: existing.documentId, data: { reservationUrl: location.reservationUrl }, status: 'published' });
      }
    }

    const existingSettings = await strapi.documents('api::site-setting.site-setting').findFirst();
    if (!existingSettings) {
      await strapi.documents('api::site-setting.site-setting').create({
        data: {
          heroEyebrow: 'Taiwanese craft · Japanese precision',
          heroTitle: 'Tradition,',
          heroAccent: 'mastered.',
          heroDescription: 'Soup dumplings, fresh sushi, and bold modern plates—crafted daily in {{location}}.',
          contactEmail: 'Management@kitchenmasterga.com',
          instagramUrl: 'https://www.instagram.com/kitchenmasterga/',
          facebookUrl: 'https://www.facebook.com/kitchenmasterga/',
          defaultReservationUrl: 'https://resy.com/cities/suwanee-ga/venues/kitchen-master-suwanee?date=2026-08-11&seats=2',
        },
        status: 'published',
      });
    }

    const existingPages = await strapi.documents('api::site-page.site-page').findMany({ limit: 1 });
    if (existingPages.length === 0) {
      for (const page of sitePages) {
        await strapi.documents('api::site-page.site-page').create({
          data: {
            ...page,
            sections: [],
            seoTitle: `${page.title} | Kitchen Master`,
            seoDescription: page.heroDescription,
          },
          status: 'published',
        });
      }
    }

    const existingHomepageSections = await strapi.documents('api::homepage-section.homepage-section').findMany({ limit: 1 });
    if (existingHomepageSections.length === 0) {
      const [heroImage, storyImage, card1, card2, card3, featureImage, privateDiningImage] = await Promise.all([
        cmsImage('hero.png'), cmsImage('dining.png'), cmsImage('soup-dumplings.png'), cmsImage('lamb-chop.png'),
        cmsImage('szechuan-wonton.png'), cmsImage('spread.jpg'), cmsImage('private-room.png'),
      ]);
      const sections = [
        { name:'Location Gateway',sectionKey:'location-gateway',eyebrow:'Welcome to Kitchen Master',title:'Choose your',accent:'location.',body:'Menus, reservations, hours, and restaurant details are tailored to your selected Kitchen Master.',image:heroImage,sortOrder:1 },
        { name:'Our Story',sectionKey:'story',eyebrow:'Our philosophy',title:'Old-world technique.',accent:'New-world spirit.',body:'At Kitchen Master, Taiwanese and Japanese traditions meet a modern American point of view. Every fold, slice, and sizzle reflects our dedication to craft, flavor, and ingredients prepared fresh each day.',image:storyImage,sortOrder:2 },
        { name:'Featured Menu',sectionKey:'featured-menu',eyebrow:'What we’re known for',title:'Made with patience.',accent:'Remembered by flavor.',items:[{eyebrow:'The signature',title:'Soup Dumplings'},{eyebrow:'From the wok',title:'Modern Plates'},{eyebrow:'Made to share',title:'Small Plates'}],images:[card1,card2,card3],sortOrder:3 },
        { name:'Food Menu',sectionKey:'food-menu',title:'The full menu.',body:'Handcrafted daily. Menu availability and pricing may change. Please tell your server about any allergies before ordering.',items:['V · Vegetarian','Raw · May be served raw or undercooked','Parties of six or more are subject to 20% gratuity'],sortOrder:4 },
        { name:'Drinks',sectionKey:'drinks',eyebrow:'From the bar',title:'Pour something',accent:'memorable.',body:'House cocktails inspired by Asian flavors, a considered wine and sake list, and thoughtful zero-proof drinks.',items:['Must be 21+ with valid identification','Selections and vintages may change','Please enjoy responsibly'],sortOrder:5 },
        { name:'Dining Feature',sectionKey:'dining-feature',eyebrow:'Dinner, done differently',title:'A table worth',accent:'gathering around.',body:'From a quick dinner to a long celebration, every meal is made to be shared.',image:featureImage,sortOrder:6 },
        { name:'Private Dining',sectionKey:'private-dining',eyebrow:'Private dining',title:'Your occasion.',accent:'Our craft.',body:'Host an intimate dinner or a full celebration in a space designed for memorable meals. Our team will help shape the room and menu around your event.',image:privateDiningImage,caption:'Private rooms · Custom menus · Personal service',linkLabel:'Plan your event',linkUrl:'/pages/private-dining',sortOrder:7 },
        { name:'Connect Links',sectionKey:'connect',eyebrow:'More from Kitchen Master',title:'Come be part',accent:'of the story.',sortOrder:8 },
        { name:'Footer',sectionKey:'footer',title:'Tradition meets innovation.',caption:'© 2026 Kitchen Master',sortOrder:9 },
      ];
      for (const section of sections) await strapi.documents('api::homepage-section.homepage-section').create({ data: section as any, status:'published' });
    }

    const existingCategories = await strapi.documents('api::menu-category.menu-category').findMany({ limit: 1 });
    if (existingCategories.length === 0) {
      const menus = [
        ...MENU_CATEGORIES.map((category) => ({ ...category, menuType: 'food' as const })),
        ...DRINK_CATEGORIES.map((category) => ({ ...category, menuType: 'drink' as const })),
      ];

      for (const [categoryIndex, menu] of menus.entries()) {
        const category = await strapi.documents('api::menu-category.menu-category').create({
          data: {
            name: menu.name,
            slug: `${menu.menuType}-${menu.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
            menuType: menu.menuType,
            note: menu.note,
            sortOrder: categoryIndex + 1,
          },
          status: 'published',
        });

        for (const [itemIndex, item] of menu.items.entries()) {
          await strapi.documents('api::menu-item.menu-item').create({
            data: {
              name: item.name,
              price: item.price,
              description: item.description,
              tags: item.tags ?? [],
              sortOrder: itemIndex + 1,
              category: category.documentId,
            },
            status: 'published',
          });
        }
      }
    }
  },
};
