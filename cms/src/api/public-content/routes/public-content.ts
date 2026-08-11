export default {
  routes: [
    {
      method: 'GET',
      path: '/kitchen-master-content',
      handler: 'public-content.index',
      config: { auth: false },
    },
  ],
};
