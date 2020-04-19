const { getBuilds } = require('../api/storageMethods');
const { WAITING } = require('../const/buildStatus');

module.exports = ({ limit, offset }, lastLoadedBuildId) => {
  const params = { limit, offset };
  const result = {
    builds: [],
    lastLoadedBuildId: undefined,
  };

  const load = async () => {
    try {
      const query = `?limit=${params.limit}&offset=${params.offset}`;
      const response = await getBuilds(query);

      const { data = [] } = response.data;

      let hasMore;

      if (lastLoadedBuildId) {
        const indexOfLastLoadedBuild = data.findIndex(build => build.id === lastLoadedBuildId);
        const includesLastLoadedBuild = indexOfLastLoadedBuild !== -1;
        hasMore = data.length === params.limit && !includesLastLoadedBuild;

        const builds = includesLastLoadedBuild ? data.slice(0, indexOfLastLoadedBuild) : data;
        const waitingBuilds = builds.filter(build => build.status === WAITING);
        result.builds.push(...waitingBuilds);
      } else {
        hasMore = data.length === params.limit;

        const waitingBuilds = data.filter(build => build.status === WAITING);
        result.builds.push(...waitingBuilds);
      }

      if (data.length && !result.lastLoadedBuildId) {
        result.lastLoadedBuildId = data[0].id;
      }

      if (hasMore) {
        params.offset = params.offset + params.limit;
        return await load();
      } else {
        return result;
      }
    } catch (e) {
      console.log('Could not load waiting builds', e);
      return result;
    }
  };

  return load();
};
