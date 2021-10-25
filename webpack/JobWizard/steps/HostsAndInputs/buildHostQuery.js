export const buildHostQuery = (selected, search) => {
  const { hosts, hostCollections, hostGroups } = selected;
  const hostsSearch = `(name ^ (${hosts.map(({ id }) => id).join(',')}))`;
  const hostCollectionsSearch = `(host_collection_id ^ (${hostCollections
    .map(({ id }) => id)
    .join(',')}))`;
  const hostGroupsSearch = `(hostgroup_id ^ (${hostGroups
    .map(({ id }) => id)
    .join(',')}))`;
  return [
    hosts.length ? hostsSearch : false,
    hostCollections.length ? hostCollectionsSearch : false,
    hostGroups.length ? hostGroupsSearch : false,
    search.length ? `(${search})` : false,
  ]
    .filter(Boolean)
    .join(' or ');
};
