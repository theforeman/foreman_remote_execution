export const buildHostQuery = (selected, search) => {
  const { hosts, hostCollections, hostGroups } = selected;
  const hostsSearch = `id ^ (${hosts.map(({ id }) => id).join(',')})`;
  const hostCollectionsSearch = `host_collection_id ^ (${hostCollections
    .map(({ id }) => id)
    .join(',')})`;
  const hostGroupsSearch = `hostgroup_id ^ (${hostGroups
    .map(({ id }) => id)
    .join(',')})`;
  const queryParts = [
    hosts.length ? hostsSearch : false,
    hostCollections.length ? hostCollectionsSearch : false,
    hostGroups.length ? hostGroupsSearch : false,
    search.length ? search : false,
  ].filter(Boolean);
  if (queryParts.length === 0) {
    return null;
  }
  if (queryParts.length === 1) {
    return queryParts[0];
  }
  return queryParts.map(p => `(${p})`).join(' or ');
};
