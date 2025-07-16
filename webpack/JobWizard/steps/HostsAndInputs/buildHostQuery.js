export const buildHostQuery = (selected, search) => {
  const nameEscape = name => `"${name.replaceAll('"', '\\"')}"`;
  const { hosts, hostCollections, hostGroups } = selected;
  const MAX_NAME_ITEMS = 50;
  let hostsSearch;
  if (hosts.length < MAX_NAME_ITEMS)
    hostsSearch = `name ^ (${hosts.map(({ name }) => name).join(',')})`;
  else hostsSearch = `id ^ (${hosts.map(({ id }) => id).join(',')})`;

  let hostCollectionsSearch;
  if (hostCollections.length < MAX_NAME_ITEMS)
    hostCollectionsSearch = `host_collection ^ (${hostCollections
      .map(({ name }) => nameEscape(name))
      .join(',')})`;
  else
    hostCollectionsSearch = `host_collection_id ^ (${hostCollections
      .map(({ id }) => id)
      .join(',')})`;

  let hostGroupsSearch;
  if (hostCollections.length < MAX_NAME_ITEMS)
    hostGroupsSearch = `hostgroup_fullname ^ (${hostGroups
      .map(({ name }) => nameEscape(name))
      .join(',')})`;
  else
    hostGroupsSearch = `hostgroup_id ^ (${hostGroups
      .map(({ id }) => id)
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
