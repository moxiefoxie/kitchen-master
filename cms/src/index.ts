import type { Core } from '@strapi/strapi';
import { DRINK_CATEGORIES, MENU_CATEGORIES } from './seed/menuData';

const locations = [
  {
    name: 'Suwanee', slug: 'suwanee', state: 'Georgia',
    address: '3131 Lawrenceville-Suwanee Rd, Ste B5', city: 'Suwanee, GA 30024',
    phone: '470-589-1112', latitude: 34.0236, longitude: -84.0519,
    locationStatus: 'open', hours: 'Tue–Fri 4:30–10 · Sat 11–10 · Sun 12–9:30',
    orderUrl: 'https://order.toasttab.com/online/kitchen-master-bistro-2-3131-lawrenceville-suwanee-rd-b5',
    reservationUrl: 'https://resy.com/cities/suwanee-ga/venues/kitchen-master', sortOrder: 1,
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
    const existingLocations = await strapi.documents('api::location.location').findMany({ limit: 1 });

    if (existingLocations.length === 0) {
      for (const location of locations) {
        await strapi.documents('api::location.location').create({
          data: location,
          status: 'published',
        });
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
          defaultReservationUrl: 'https://resy.com/cities/suwanee-ga/venues/kitchen-master',
        },
        status: 'published',
      });
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
