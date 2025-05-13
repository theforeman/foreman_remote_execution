export const buildHostQuery = (selected, search) => {
  const { hosts, hostCollections, hostGroups } = selected;
  let [hostsSearch, hostCollectionsSearch, hostGroupsSearch] = [];
  if (hosts.length > 50) {
    hostsSearch = `id ^ (${hosts.map(({ id }) => id).join(',')})`;
    hostCollectionsSearch = `host_collection_id ^ (${hostCollections
      .map(({ id }) => id)
      .join(',')})`;
    hostGroupsSearch = `hostgroup_id ^ (${hostGroups
      .map(({ id }) => id)
      .join(',')})`;
  } else {
    hostsSearch = `name ^ (${hosts.map(({ name }) => name).join(',')})`;
    hostCollectionsSearch = `host_collection ^ (${hostCollections
      .map(({ name }) => name)
      .join(',')})`;
    hostGroupsSearch = `hostgroup_fullname ^ (${hostGroups
      .map(({ name }) => name)
      .join(',')})`;
  }
  const queryParts = [
    hosts.length ? hostsSearch : false,
    hostCollections.length ? hostCollectionsSearch : false,
    hostGroups.length ? hostGroupsSearch : false,
    search.length ? search : false,
  ].filter(Boolean);

  if (queryParts.length === 0) {
    return 'name=a AND name=b';
  }
  if (queryParts.length === 1) {
    return queryParts[0] || 'name=a AND name=b';
  }
  return queryParts.map(p => `(${p})`).join(' or ') || 'name=a AND name=b';
};
