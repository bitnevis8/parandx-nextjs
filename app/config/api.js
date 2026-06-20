import { getApiBaseUrl } from './getApiBaseUrl';

function createApiEndpoints(API_BASE_URL) {
  return {
  // تمام بخش‌های مربوط به aryafoulad حذف شود (unit-locations, mission-orders, rate-settings, warehouse-module و ...)
  // ... existing code ...
  users: {
    base: `${API_BASE_URL}/user/user`,
    getAll: `${API_BASE_URL}/user/user/getAll`,
    getById: (id) => `${API_BASE_URL}/user/user/getOne/${id}`,
    getOne: (id) => `${API_BASE_URL}/user/user/getOne/${id}`,
    create: `${API_BASE_URL}/user/user/create`,
    update: (id) => `${API_BASE_URL}/user/user/update/${id}`,
    delete: (id) => `${API_BASE_URL}/user/user/delete/${id}`,
    search: `${API_BASE_URL}/user/user/search`,
    getCurrentProfile: `${API_BASE_URL}/user/user/profile/current`,
    updateCurrentProfile: `${API_BASE_URL}/user/user/profile/current`,
    profileById: (id) => `${API_BASE_URL}/user/user/profile/${id}`,
    updateProfileById: (id) => `${API_BASE_URL}/user/user/profile/${id}`,
  },
  roles: {
    base: `${API_BASE_URL}/user/role`,
    getAll: `${API_BASE_URL}/user/role/getAll`,
    getById: (id) => `${API_BASE_URL}/user/role/getOne/${id}`,
    create: `${API_BASE_URL}/user/role/create`,
    update: (id) => `${API_BASE_URL}/user/role/update/${id}`,
    delete: (id) => `${API_BASE_URL}/user/role/delete/${id}`,
  },
  // انبارداری
  warehouse: {
    base: `${API_BASE_URL}/aryafoulad/warehouse-module/warehouse`,
    getAll: `${API_BASE_URL}/aryafoulad/warehouse-module/warehouse/getAll`,
    getById: (id) => `${API_BASE_URL}/aryafoulad/warehouse-module/warehouse/getOne/${id}`,
    create: `${API_BASE_URL}/aryafoulad/warehouse-module/warehouse/create`,
    update: (id) => `${API_BASE_URL}/aryafoulad/warehouse-module/warehouse/update/${id}`,
    delete: (id) => `${API_BASE_URL}/aryafoulad/warehouse-module/warehouse/delete/${id}`,
    search: (query) => `${API_BASE_URL}/aryafoulad/warehouse-module/warehouse/search?query=${query}`,
  },
  items: {
    base: `${API_BASE_URL}/aryafoulad/warehouse-module/item`,
    getAll: `${API_BASE_URL}/aryafoulad/warehouse-module/item/getAll`,
    getById: (id) => `${API_BASE_URL}/aryafoulad/warehouse-module/item/getOne/${id}`,
    create: `${API_BASE_URL}/aryafoulad/warehouse-module/item/create`,
    update: (id) => `${API_BASE_URL}/aryafoulad/warehouse-module/item/update/${id}`,
    delete: (id) => `${API_BASE_URL}/aryafoulad/warehouse-module/item/delete/${id}`,
  },
  inventory: {
    base: `${API_BASE_URL}/aryafoulad/warehouse-module/inventory`,
    getAll: `${API_BASE_URL}/aryafoulad/warehouse-module/inventory/getAll`,
    getById: (id) => `${API_BASE_URL}/aryafoulad/warehouse-module/inventory/getOne/${id}`,
    create: `${API_BASE_URL}/aryafoulad/warehouse-module/inventory/create`,
    update: (id) => `${API_BASE_URL}/aryafoulad/warehouse-module/inventory/update/${id}`,
    delete: (id) => `${API_BASE_URL}/aryafoulad/warehouse-module/inventory/delete/${id}`,
  },
  itemAssignments: {
    base: `${API_BASE_URL}/aryafoulad/warehouse-module/item-assignment`,
    getAll: `${API_BASE_URL}/aryafoulad/warehouse-module/item-assignment/getAll`,
    getById: (id) => `${API_BASE_URL}/aryafoulad/warehouse-module/item-assignment/getOne/${id}`,
    create: `${API_BASE_URL}/aryafoulad/warehouse-module/item-assignment/create`,
    update: (id) => `${API_BASE_URL}/aryafoulad/warehouse-module/item-assignment/update/${id}`,
    delete: (id) => `${API_BASE_URL}/aryafoulad/warehouse-module/item-assignment/delete/${id}`,
  },
  auth: {
    checkIdentifier: `${API_BASE_URL}/user/auth/check-identifier`,
    sendLoginOtp: `${API_BASE_URL}/user/auth/send-login-otp`,
    verifyLoginOtp: `${API_BASE_URL}/user/auth/verify-login-otp`,
    registerEmail: `${API_BASE_URL}/user/auth/register/email`,
    registerMobile: `${API_BASE_URL}/user/auth/register/mobile`,
    login: `${API_BASE_URL}/user/auth/login`,
    verifyEmail: `${API_BASE_URL}/user/auth/verify/email`,
    resendEmailCode: `${API_BASE_URL}/user/auth/resend-code/email`,
    resendMobileCode: `${API_BASE_URL}/user/auth/resend-code/mobile`,
    verifyMobile: `${API_BASE_URL}/user/auth/verify/mobile`,
    forgotPasswordOptions: `${API_BASE_URL}/user/auth/forgot-password/options`,
    forgotPasswordSend: `${API_BASE_URL}/user/auth/forgot-password/send`,
    forgotPasswordReset: `${API_BASE_URL}/user/auth/forgot-password/reset`,
    me: `${API_BASE_URL}/user/auth/me`,
    logout: `${API_BASE_URL}/user/auth/logout`,
  },
  // مقالات - حذف شده: برای سازگاری موقت، مسیرهای خنثی
  articles: {
    base: `${API_BASE_URL}/__removed_articles__`,
    getAll: `${API_BASE_URL}/__removed_articles__/getAll`,
    getById: (id) => `${API_BASE_URL}/__removed_articles__/getOne/${id}`,
    getByCategory: (categoryId, limit = 10) => `${API_BASE_URL}/__removed_articles__/getByCategory/${categoryId}?limit=${limit}`,
    getByCategorySlug: (categorySlug, limit = 10) => `${API_BASE_URL}/__removed_articles__/getByCategorySlug/${categorySlug}?limit=${limit}`,
    getByTag: (tagId, limit = 10) => `${API_BASE_URL}/__removed_articles__/getByTag/${tagId}?limit=${limit}`,
    getByTagSlug: (tagSlug, limit = 10) => `${API_BASE_URL}/__removed_articles__/getByTagSlug/${tagSlug}?limit=${limit}`,
    getByTags: (tagIds, limit = 10) => `${API_BASE_URL}/__removed_articles__/getByTags?tagIds=${tagIds}&limit=${limit}`,
    getByAgency: (agencyId, limit = 10) => `${API_BASE_URL}/__removed_articles__/getByAgency/${agencyId}?limit=${limit}`,
    search: `${API_BASE_URL}/__removed_articles__/search`,
    create: `${API_BASE_URL}/__removed_articles__/create`,
    update: (id) => `${API_BASE_URL}/__removed_articles__/update/${id}`,
    delete: (id) => `${API_BASE_URL}/__removed_articles__/delete/${id}`,
  },
  // تگ‌ها - حذف شده: مسیرهای خنثی
  tags: {
    base: `${API_BASE_URL}/__removed_articles__/tags`,
    getAll: `${API_BASE_URL}/__removed_articles__/tags/getAll`,
    getAllForSearch: `${API_BASE_URL}/__removed_articles__/tags/getAllForSearch`,
    getAllWithArticleCount: `${API_BASE_URL}/__removed_articles__/tags/getAllWithArticleCount`,
    getByClasses: `${API_BASE_URL}/__removed_articles__/tags/getByClasses`,
    testDatabase: `${API_BASE_URL}/__removed_articles__/tags/testDatabase`,
    getById: (id) => `${API_BASE_URL}/__removed_articles__/tags/getOne/${id}`,
    getByName: (name) => `${API_BASE_URL}/__removed_articles__/tags/getByName/${encodeURIComponent(name)}`,
    getByFamily: (familyId) => `${API_BASE_URL}/__removed_articles__/tags/getByFamily/${familyId}`,
    search: `${API_BASE_URL}/__removed_articles__/tags/search`,
    create: `${API_BASE_URL}/__removed_articles__/tags/create`,
    update: (id) => `${API_BASE_URL}/__removed_articles__/tags/update/${id}`,
    delete: (id) => `${API_BASE_URL}/__removed_articles__/tags/delete/${id}`,
  },
  // دسته‌بندی‌ها - حذف شده
  categories: {
    base: `${API_BASE_URL}/category`,
    getAll: (marketplaceType = 'services', categoryUsage) => {
      const params = new URLSearchParams();
      if (marketplaceType) params.set('marketplaceType', marketplaceType);
      if (categoryUsage) params.set('categoryUsage', categoryUsage);
      const query = params.toString();
      return `${API_BASE_URL}/category${query ? `?${query}` : ''}`;
    },
    getMapModelsRegistry: (marketplaceType = 'goods') =>
      `${API_BASE_URL}/category/map-models?marketplaceType=${encodeURIComponent(marketplaceType)}`,
    adminMapModels: (marketplaceType = 'goods') =>
      `${API_BASE_URL}/category/admin/map-models?marketplaceType=${encodeURIComponent(marketplaceType)}`,
    updateMapModel: (id) => `${API_BASE_URL}/category/admin/${id}/map-model`,
    uploadMapModel: (id) => `${API_BASE_URL}/category/admin/${id}/map-model/upload`,
    deleteMapModelFile: (id) => `${API_BASE_URL}/category/admin/${id}/map-model/file`,
    getById: (id) => `${API_BASE_URL}/category/${id}`,
    getBySlug: (slug, { marketplaceType, categoryUsage } = {}) => {
      const params = new URLSearchParams();
      if (marketplaceType) params.set('marketplaceType', marketplaceType);
      if (categoryUsage) params.set('categoryUsage', categoryUsage);
      const query = params.toString();
      return `${API_BASE_URL}/category/slug/${slug}${query ? `?${query}` : ''}`;
    },
    create: `${API_BASE_URL}/category`,
    update: (id) => `${API_BASE_URL}/category/${id}`,
    delete: (id) => `${API_BASE_URL}/category/${id}`,
  },
  cities: {
    getAll: `${API_BASE_URL}/city`,
    getById: (id) => `${API_BASE_URL}/city/${id}`,
    getBySlug: (slug) => `${API_BASE_URL}/city/slug/${slug}`,
    getGeoJson: (slug) => `${API_BASE_URL}/city/geojson/${encodeURIComponent(slug)}`,
    getLocations: (id) => `${API_BASE_URL}/city/${id}/locations`,
    getProvinces: `${API_BASE_URL}/city/provinces`,
    admin: {
      searchCities: (params = {}) => {
        const qs = new URLSearchParams();
        if (params.q) qs.set('q', params.q);
        if (params.active) qs.set('active', params.active);
        if (params.provinceId) qs.set('provinceId', params.provinceId);
        if (params.page) qs.set('page', params.page);
        if (params.limit) qs.set('limit', params.limit);
        const query = qs.toString();
        return `${API_BASE_URL}/city/admin/search${query ? `?${query}` : ''}`;
      },
      createCity: `${API_BASE_URL}/city/admin`,
      updateCity: (id) => `${API_BASE_URL}/city/admin/${id}`,
      toggleCityActive: (id) => `${API_BASE_URL}/city/admin/${id}/toggle-active`,
      uploadCityGeoJson: (id) => `${API_BASE_URL}/city/admin/${id}/geojson`,
      deleteCityGeoJson: (id) => `${API_BASE_URL}/city/admin/${id}/geojson`,
      deleteCity: (id) => `${API_BASE_URL}/city/admin/${id}`,
      searchProvinces: (params = {}) => {
        const qs = new URLSearchParams();
        if (params.q) qs.set('q', params.q);
        if (params.active) qs.set('active', params.active);
        if (params.page) qs.set('page', params.page);
        if (params.limit) qs.set('limit', params.limit);
        const query = qs.toString();
        return `${API_BASE_URL}/city/admin/provinces/search${query ? `?${query}` : ''}`;
      },
      createProvince: `${API_BASE_URL}/city/admin/provinces`,
      updateProvince: (id) => `${API_BASE_URL}/city/admin/provinces/${id}`,
      toggleProvinceActive: (id) => `${API_BASE_URL}/city/admin/provinces/${id}/toggle-active`,
      deleteProvince: (id) => `${API_BASE_URL}/city/admin/provinces/${id}`,
    },
  },
  search: (q, cityId) => {
    let url = `${API_BASE_URL}/search?q=${encodeURIComponent(q)}`;
    if (cityId) url += `&cityId=${encodeURIComponent(cityId)}`;
    return url;
  },
  experts: {
    base: `${API_BASE_URL}/expert`,
    getAll: (cityId) => {
      let url = `${API_BASE_URL}/expert`;
      if (cityId) url += `?cityId=${encodeURIComponent(cityId)}`;
      return url;
    },
    getAllWithLimit: (limit, cityId) => {
      let url = `${API_BASE_URL}/expert?limit=${limit}`;
      if (cityId) url += `&cityId=${encodeURIComponent(cityId)}`;
      return url;
    },
    getLatestForCity: (cityId, limit = 8) =>
      `${API_BASE_URL}/expert?cityId=${encodeURIComponent(cityId)}&limit=${limit}&sort=latest`,
    getById: (id) => `${API_BASE_URL}/expert/${id}`,
    create: `${API_BASE_URL}/expert`,
    update: (id) => `${API_BASE_URL}/expert/${id}`,
    delete: (id) => `${API_BASE_URL}/expert/${id}`,
    getCurrentProfile: `${API_BASE_URL}/expert/profile/current`,
    getUserProfile: `${API_BASE_URL}/expert/profile/user`,
    updateCurrentProfile: `${API_BASE_URL}/expert/profile/current`,
    updateUserProfile: (userId) =>
      `${API_BASE_URL}/expert/profile/user?userId=${encodeURIComponent(userId)}`,
    getSpecializations: `${API_BASE_URL}/expert/specializations/current`,
    getUserSpecializations: `${API_BASE_URL}/expert/specializations/user`,
    addSpecialization: `${API_BASE_URL}/expert/specializations/add`,
    removeSpecialization: (categoryId) => `${API_BASE_URL}/expert/specializations/${categoryId}`,
    deleteByUserId: (userId) => `${API_BASE_URL}/expert/user/${userId}`,
    followStatus: (expertId) => `${API_BASE_URL}/expert/${expertId}/follow/status`,
    follow: (expertId) => `${API_BASE_URL}/expert/${expertId}/follow`,
    unfollow: (expertId) => `${API_BASE_URL}/expert/${expertId}/follow`,
    trustStatus: (expertId) => `${API_BASE_URL}/expert/${expertId}/trust/status`,
    connectionStatus: (expertId) => `${API_BASE_URL}/expert/${expertId}/connection/status`,
    connection: (expertId) => `${API_BASE_URL}/expert/${expertId}/connection`,
    connectionsIncoming: `${API_BASE_URL}/expert/connections/incoming`,
    connectionAccept: (connectionId) =>
      `${API_BASE_URL}/expert/connections/${connectionId}/accept`,
    connectionReject: (connectionId) =>
      `${API_BASE_URL}/expert/connections/${connectionId}/reject`,
    trustReasons: (expertId) => `${API_BASE_URL}/expert/${expertId}/trust/reasons`,
    trust: (expertId) => `${API_BASE_URL}/expert/${expertId}/trust`,
    untrust: (expertId) => `${API_BASE_URL}/expert/${expertId}/trust`,
    posts: (expertId, limit) => {
      let url = `${API_BASE_URL}/expert/${expertId}/posts`;
      if (limit) url += `?limit=${limit}`;
      return url;
    },
    createPost: `${API_BASE_URL}/expert/posts`,
    deletePost: (postId) => `${API_BASE_URL}/expert/posts/${postId}`,
  },
  merchants: {
    registerProfile: `${API_BASE_URL}/merchant/profile/register`,
    getCurrentProfile: `${API_BASE_URL}/merchant/profile/current`,
    getUserProfile: `${API_BASE_URL}/merchant/profile/user`,
    getPublicProfile: (slugOrId) => `${API_BASE_URL}/merchant/public/${encodeURIComponent(slugOrId)}`,
    updateCurrentProfile: `${API_BASE_URL}/merchant/profile/current`,
    updateUserProfile: (userId) =>
      `${API_BASE_URL}/merchant/profile/user?userId=${encodeURIComponent(userId)}`,
    getCategories: `${API_BASE_URL}/merchant/categories/current`,
    getUserCategories: `${API_BASE_URL}/merchant/categories/user`,
    addCategory: `${API_BASE_URL}/merchant/categories/add`,
    removeCategory: (categoryId) => `${API_BASE_URL}/merchant/categories/${categoryId}`,
    getForMap: (cityId, limit = 200, categorySlug) => {
      let url = `${API_BASE_URL}/merchant/map?limit=${limit}`;
      if (cityId) url += `&cityId=${encodeURIComponent(cityId)}`;
      if (categorySlug) url += `&category=${encodeURIComponent(categorySlug)}`;
      return url;
    },
    getBrowse: (cityId, categorySlug, limit = 50) => {
      let url = `${API_BASE_URL}/merchant/browse?limit=${limit}`;
      if (cityId) url += `&cityId=${encodeURIComponent(cityId)}`;
      if (categorySlug) url += `&category=${encodeURIComponent(categorySlug)}`;
      return url;
    },
    getBrowseCount: (cityId, categorySlug) => {
      let url = `${API_BASE_URL}/merchant/browse?countOnly=true`;
      if (cityId) url += `&cityId=${encodeURIComponent(cityId)}`;
      if (categorySlug) url += `&category=${encodeURIComponent(categorySlug)}`;
      return url;
    },
  },
  shopProducts: {
    mine: `${API_BASE_URL}/shop-product/mine`,
    byMerchant: (merchantId) => `${API_BASE_URL}/shop-product?merchantId=${merchantId}`,
    create: `${API_BASE_URL}/shop-product`,
    update: (id) => `${API_BASE_URL}/shop-product/${id}`,
    remove: (id) => `${API_BASE_URL}/shop-product/${id}`,
    publishToDivar: (id) => `${API_BASE_URL}/shop-product/${id}/publish-to-divar`,
    unpublishFromDivar: (id) => `${API_BASE_URL}/shop-product/${id}/publish-to-divar`,
  },
  requests: {
    base: `${API_BASE_URL}/request`,
    getAll: (cityId) => {
      let url = `${API_BASE_URL}/request`;
      if (cityId) url += `?cityId=${encodeURIComponent(cityId)}`;
      return url;
    },
    getLatestForHome: (cityId, limit = 5) => {
      let url = `${API_BASE_URL}/request/latest?limit=${limit}`;
      if (cityId) url += `&cityId=${encodeURIComponent(cityId)}`;
      return url;
    },
    getForMap: (cityId, limit = 200, marketplaceType = 'services', requestKind) => {
      let url = `${API_BASE_URL}/request/map?limit=${limit}&marketplaceType=${marketplaceType}`;
      if (cityId) url += `&cityId=${encodeURIComponent(cityId)}`;
      if (requestKind) url += `&requestKind=${encodeURIComponent(requestKind)}`;
      return url;
    },
    getById: (id) => `${API_BASE_URL}/request/${id}`,
    create: `${API_BASE_URL}/request`,
    update: (id) => `${API_BASE_URL}/request/${id}`,
    updateStatus: (id) => `${API_BASE_URL}/request/${id}/status`,
    delete: (id) => `${API_BASE_URL}/request/${id}`,
    alerts: `${API_BASE_URL}/request/alerts`,
    alertCount: `${API_BASE_URL}/request/alerts/count`,
    dismissAlert: (id) => `${API_BASE_URL}/request/alerts/${id}/dismiss`,
    mine: (marketplaceType, requestKind) => {
      const params = new URLSearchParams();
      if (marketplaceType) params.set('marketplaceType', marketplaceType);
      if (requestKind) params.set('requestKind', requestKind);
      const qs = params.toString();
      return qs ? `${API_BASE_URL}/request/mine?${qs}` : `${API_BASE_URL}/request/mine`;
    },
    createGoodsNeed: `${API_BASE_URL}/request`,
    createGoodsSupply: `${API_BASE_URL}/request`,
    expertInvolvements: `${API_BASE_URL}/request/expert/involvements`,
    merchantInvolvements: `${API_BASE_URL}/request/merchant/involvements`,
    dismissMerchantAlert: (id) => `${API_BASE_URL}/request/merchant-alerts/${id}/dismiss`,
    buyerInvolvements: `${API_BASE_URL}/request/buyer/involvements`,
    dismissBuyerSupplyAlert: (id) => `${API_BASE_URL}/request/buyer-supply-alerts/${id}/dismiss`,
  },
  listings: {
    base: `${API_BASE_URL}/listing`,
    getAll: ({ cityId, categoryId, subCategoryId, subCategorySlug, limit } = {}) => {
      const params = new URLSearchParams();
      if (cityId) params.set('cityId', String(cityId));
      if (categoryId) params.set('categoryId', String(categoryId));
      if (subCategoryId) params.set('subCategoryId', String(subCategoryId));
      if (subCategorySlug) params.set('subCategorySlug', subCategorySlug);
      if (limit) params.set('limit', String(limit));
      const qs = params.toString();
      return `${API_BASE_URL}/listing${qs ? `?${qs}` : ''}`;
    },
    getById: (id) => `${API_BASE_URL}/listing/${id}`,
    create: `${API_BASE_URL}/listing`,
    mine: `${API_BASE_URL}/listing/mine`,
    updateStatus: (id) => `${API_BASE_URL}/listing/${id}/status`,
  },
  bids: {
    base: `${API_BASE_URL}/bid`,
    getAll: (requestId) => {
      let url = `${API_BASE_URL}/bid`;
      if (requestId) url += `?requestId=${encodeURIComponent(requestId)}`;
      return url;
    },
    getMy: (requestId) => `${API_BASE_URL}/bid/my?requestId=${encodeURIComponent(requestId)}`,
    getById: (id) => `${API_BASE_URL}/bid/${id}`,
    create: `${API_BASE_URL}/bid`,
    update: (id) => `${API_BASE_URL}/bid/${id}`,
    updateStatus: (id) => `${API_BASE_URL}/bid/${id}/status`,
    delete: (id) => `${API_BASE_URL}/bid/${id}`,
  },
  reviews: {
    base: `${API_BASE_URL}/review`,
    getAll: `${API_BASE_URL}/review`,
    getById: (id) => `${API_BASE_URL}/review/${id}`,
    create: `${API_BASE_URL}/review`,
    update: (id) => `${API_BASE_URL}/review/${id}`,
    delete: (id) => `${API_BASE_URL}/review/${id}`,
  },
  messages: {
    base: `${API_BASE_URL}/message`,
    conversations: `${API_BASE_URL}/message/conversations`,
    unreadCount: `${API_BASE_URL}/message/unread-count`,
    conversation: (userId) => `${API_BASE_URL}/message/conversation/${userId}`,
    send: `${API_BASE_URL}/message/send`,
    markRead: (id) => `${API_BASE_URL}/message/${id}/read`,
  },
  // کلاس‌ها - حذف شده
  classes: {
    base: `${API_BASE_URL}/__removed_articles__/classes`,
    getAll: `${API_BASE_URL}/__removed_articles__/classes`,
    getById: (id) => `${API_BASE_URL}/__removed_articles__/classes/${id}`,
    create: `${API_BASE_URL}/__removed_articles__/classes`,
    update: (id) => `${API_BASE_URL}/__removed_articles__/classes/${id}`,
    delete: (id) => `${API_BASE_URL}/__removed_articles__/classes/${id}`,
  },
  // آژانس‌ها - حذف شده
  agencies: {
    base: `${API_BASE_URL}/__removed_articles__/agencies`,
    getAll: `${API_BASE_URL}/__removed_articles__/agencies/getAll`,
    getById: (id) => `${API_BASE_URL}/__removed_articles__/agencies/getOne/${id}`,
    create: `${API_BASE_URL}/__removed_articles__/agencies/create`,
    update: (id) => `${API_BASE_URL}/__removed_articles__/agencies/update/${id}`,
    delete: (id) => `${API_BASE_URL}/__removed_articles__/agencies/delete/${id}`,
  },
  // خانواده‌های تگ - حذف شده
  tagFamilies: {
    base: `${API_BASE_URL}/__removed_articles__/tag-families`,
    getAll: `${API_BASE_URL}/__removed_articles__/tag-families/getAll`,
    getById: (id) => `${API_BASE_URL}/__removed_articles__/tag-families/getOne/${id}`,
    create: `${API_BASE_URL}/__removed_articles__/tag-families/create`,
    update: (id) => `${API_BASE_URL}/__removed_articles__/tag-families/update/${id}`,
    delete: (id) => `${API_BASE_URL}/__removed_articles__/tag-families/delete/${id}`,
  },
  // مکان‌ها
  locations: {
    base: `${API_BASE_URL}/location`,
    getAll: `${API_BASE_URL}/location/getAll`,
    getById: (id) => `${API_BASE_URL}/location/getOne/${id}`,
    getBySlug: (slug) => `${API_BASE_URL}/location/getBySlug/${encodeURIComponent(slug)}`,
    getByName: (name) => `${API_BASE_URL}/location/getByName/${encodeURIComponent(name)}`,
    getChildren: (parentId) => `${API_BASE_URL}/location/getChildren/${parentId}`,
    getChildrenBySlug: (parentSlug) => `${API_BASE_URL}/location/getChildrenBySlug/${encodeURIComponent(parentSlug)}`,
    getByDivisionType: (type) => `${API_BASE_URL}/location/getByDivisionType/${type}`,
    getHierarchy: (id) => `${API_BASE_URL}/location/getHierarchy/${id}`,
    getHierarchyBySlug: (slug) => `${API_BASE_URL}/location/getHierarchyBySlug/${encodeURIComponent(slug)}`,
    getLocationNews: (id, limit = 20, offset = 0) => `${API_BASE_URL}/location/getLocationNews/${id}?limit=${limit}&offset=${offset}`,
    getLocationNewsBySlug: (slug, limit = 20, offset = 0) => `${API_BASE_URL}/location/getLocationNewsBySlug/${encodeURIComponent(slug)}?limit=${limit}&offset=${offset}`,
    getWikiDetails: (id) => `${API_BASE_URL}/location/getWikiDetails/${id}`,
    getWikiDetailsBySlug: (slug) => `${API_BASE_URL}/location/getWikiDetailsBySlug/${encodeURIComponent(slug)}`,
    getWikidataInfo: (id) => `${API_BASE_URL}/location/getWikidataInfo/${id}`,
    getWikidataInfoBySlug: (slug) => `${API_BASE_URL}/location/getWikidataInfoBySlug/${encodeURIComponent(slug)}`,
    getGeoJson: (slug) => `${API_BASE_URL}/city/geojson/${encodeURIComponent(slug)}`,
    search: `${API_BASE_URL}/location/search`,
    create: `${API_BASE_URL}/location/create`,
    update: (id) => `${API_BASE_URL}/location/update/${id}`,
    updateBySlug: (slug) => `${API_BASE_URL}/location/updateBySlug/${encodeURIComponent(slug)}`,
    delete: (id) => `${API_BASE_URL}/location/delete/${id}`,
    deleteBySlug: (slug) => `${API_BASE_URL}/location/deleteBySlug/${encodeURIComponent(slug)}`,
  },
  // کلاس تگ‌ها - حذف شده
  classTags: {
    base: `${API_BASE_URL}/__removed_articles__/class-tags`,
    getAll: `${API_BASE_URL}/__removed_articles__/class-tags/getAll`,
    getById: (id) => `${API_BASE_URL}/__removed_articles__/class-tags/getOne/${id}`,
    getTagsByLocation: `${API_BASE_URL}/__removed_articles__/class-tags/get-tags-by-location`,
    testData: `${API_BASE_URL}/__removed_articles__/class-tags/test-data`,
    search: `${API_BASE_URL}/__removed_articles__/class-tags/search`,
    create: `${API_BASE_URL}/__removed_articles__/class-tags/create`,
    update: (id) => `${API_BASE_URL}/__removed_articles__/class-tags/update/${id}`,
    delete: (id) => `${API_BASE_URL}/__removed_articles__/class-tags/delete/${id}`,
    classifyTags: `${API_BASE_URL}/__removed_articles__/class-tags/classify-tags`,
    fixParentClasses: `${API_BASE_URL}/__removed_articles__/class-tags/fix-parent-classes`,
  },
  siteSetting: {
    homeRequestBanner: `${API_BASE_URL}/site-setting/home-request-banner`,
    adminHomeRequestBanner: `${API_BASE_URL}/site-setting/admin/home-request-banner`,
    homeRequestTypewriter: `${API_BASE_URL}/site-setting/home-request-typewriter`,
    adminHomeRequestTypewriter: `${API_BASE_URL}/site-setting/admin/home-request-typewriter`,
    nightSkyStars: `${API_BASE_URL}/site-setting/night-sky-stars`,
    adminNightSkyStars: `${API_BASE_URL}/site-setting/admin/night-sky-stars`,
    homeRequestFloatingQuotes: `${API_BASE_URL}/site-setting/home-request-floating-quotes`,
    adminHomeRequestFloatingQuotes: `${API_BASE_URL}/site-setting/admin/home-request-floating-quotes`,
  },
  };
}

export function getApiEndpoints() {
  return createApiEndpoints(getApiBaseUrl());
}

export const API_ENDPOINTS = new Proxy(
  {},
  {
    get(_target, prop) {
      if (prop === 'then' || typeof prop === 'symbol') return undefined;
      return getApiEndpoints()[prop];
    },
  }
);

export { getApiBaseUrl }; 