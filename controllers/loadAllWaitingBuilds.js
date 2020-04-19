const { getBuilds } = require('../api/storageMethods');
const { WAITING } = require('../const/buildStatus');

module.exports = ({ limit, offset }) => {
  const builds = [];
  const params = { limit, offset };
  console.log('params', params);

  const load = async () => {
    try {
      const query = `?limit=${params.limit}&offset=${params.offset}`;
      const response = await getBuilds(query);

      const { data = [] } = response.data;
      const waitingBuilds = data.filter(build => build.status === WAITING);
      builds.push(...waitingBuilds);

      const hasMore = data.length === params.limit;

      if (hasMore) {
        params.offset = params.offset + params.limit;
      } else {
        params.offset = params.offset + data.length;
      }

      if (hasMore) {
        await load();
      } else {
        return { builds, params };
      }
    } catch (e) {
      console.log('Could not load waiting builds', e);
      return { builds, params };
    }
  };

  return load();
};
