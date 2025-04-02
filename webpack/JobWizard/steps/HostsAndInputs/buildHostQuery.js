export const buildHostQuery = (selected, search) => {
  const { hosts, hostCollections, hostGroups } = selected;
  const hostsSearch = `name ^ (${hosts.map(({ name }) => name).join(',')})`;
  const hostCollectionsSearch = `host_collection ^ (${hostCollections
    .map(({ name }) => name)
    .join(',')})`;
  const hostGroupsSearch = `hostgroup_fullname ^ (${hostGroups
    .map(({ name }) => name)
    .join(',')})`;
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
