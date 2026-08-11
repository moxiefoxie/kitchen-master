import type { Context } from 'koa';

export default {
  async index(ctx: Context) {
    const [locations, settings] = await Promise.all([
      strapi.documents('api::location.location').findMany({
        status: 'published',
        sort: ['sortOrder:asc'],
        limit: 100,
      }),
      strapi.documents('api::site-setting.site-setting').findFirst({ status: 'published' }),
    ]);

    ctx.body = { locations, settings };
  },
};
