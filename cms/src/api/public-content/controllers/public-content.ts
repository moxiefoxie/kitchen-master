import type { Context } from 'koa';

export default {
  async index(ctx: Context) {
    const requestedPreview = ctx.query.preview === '1';
    const validPreview = requestedPreview && ctx.query.previewSecret === process.env.PREVIEW_SECRET;
    const status = validPreview ? 'draft' : 'published';
    const [locations, settings, menuCategories, pages] = await Promise.all([
      strapi.documents('api::location.location').findMany({
        status,
        sort: ['sortOrder:asc'],
        limit: 100,
        populate: ['heroImage', 'gallery'],
      }),
      strapi.documents('api::site-setting.site-setting').findFirst({ status }),
      strapi.documents('api::menu-category.menu-category').findMany({
        status,
        sort: ['sortOrder:asc'],
        limit: 100,
        populate: { items: { sort: ['sortOrder:asc'] }, locations: true },
      }),
      strapi.documents('api::site-page.site-page').findMany({
        status,
        sort: ['sortOrder:asc'],
        limit: 100,
        populate: ['location', 'heroImage', 'socialImage', 'storyImage', 'menuCard1Image', 'menuCard2Image', 'menuCard3Image', 'featureImage', 'privateDiningImage'],
      }),
    ]);

    ctx.body = { locations, settings, menuCategories, pages, preview: validPreview };
  },
};
