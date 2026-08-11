import type { Context } from 'koa';

export default {
  async index(ctx: Context) {
    const [locations, settings, menuCategories] = await Promise.all([
      strapi.documents('api::location.location').findMany({
        status: 'published',
        sort: ['sortOrder:asc'],
        limit: 100,
      }),
      strapi.documents('api::site-setting.site-setting').findFirst({ status: 'published' }),
      strapi.documents('api::menu-category.menu-category').findMany({
        status: 'published',
        sort: ['sortOrder:asc'],
        limit: 100,
        populate: { items: { sort: ['sortOrder:asc'] } },
      }),
    ]);

    ctx.body = { locations, settings, menuCategories };
  },
};
