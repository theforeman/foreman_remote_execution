import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'foremanReact/redux/API';
import { getBookmarks } from 'foremanReact/components/PF4/Bookmarks/BookmarksActions';
import {
  HOST_IDS,
  REX_FEATURE,
  hostsController,
  hostsSearchProps,
} from './JobWizardConstants';
import { selectHostBookmarks } from './JobWizardSelectors';
import './JobWizard.scss';

export const useAutoFill = ({
  fills,
  setFills,
  setSelectedTargets,
  setHostsSearchQuery,
  setSelectedBookmark,
  setJobTemplateID,
  setTemplateValues,
  setAdvancedValues,
}) => {
  const dispatch = useDispatch();
  const bookmarks = useSelector(selectHostBookmarks);
  const [pendingBookmarkId, setPendingBookmarkId] = useState(null);

  useEffect(() => {
    if (pendingBookmarkId === null || bookmarks.length === 0) return;
    const bookmark = bookmarks.find(bm => bm.id === pendingBookmarkId);
    if (bookmark) {
      setSelectedBookmark({
        id: bookmark.id,
        name: bookmark.name,
        query: bookmark.query,
      });
      setHostsSearchQuery(bookmark.query);
    }
    setPendingBookmarkId(null);
  }, [bookmarks, pendingBookmarkId, setSelectedBookmark, setHostsSearchQuery]);

  useEffect(() => {
    if (Object.keys(fills).length) {
      const {
        'host_ids[]': hostIds,
        search,
        feature,
        template_id: templateID,
        bookmark_id: bookmarkId,
        ...rest
      } = { ...fills };
      setFills({});
      if (hostIds) {
        setSelectedBookmark(null);
        const hostSearch = Array.isArray(hostIds)
          ? `id = ${hostIds.join(' or id = ')}`
          : `id = ${hostIds}`;
        dispatch(
          get({
            key: HOST_IDS,
            url: '/api/hosts',
            params: {
              search: hostSearch,
            },
            handleSuccess: ({ data }) => {
              setSelectedTargets(currentTargets => ({
                ...currentTargets,
                hosts: (data.results || []).map(
                  // eslint-disable-next-line camelcase
                  ({ id, name, display_name }) => ({
                    id,
                    // eslint-disable-next-line camelcase
                    name: display_name || name,
                  })
                ),
              }));
            },
          })
        );
      }
      if (bookmarkId) {
        setSelectedTargets({
          hosts: [],
          hostCollections: [],
          hostGroups: [],
        });
        const numericId = Number(bookmarkId);
        if (bookmarks.length > 0) {
          const bookmark = bookmarks.find(bm => bm.id === numericId);
          if (bookmark) {
            setSelectedBookmark({
              id: bookmark.id,
              name: bookmark.name,
              query: bookmark.query,
            });
            setHostsSearchQuery(bookmark.query);
          }
        } else {
          setPendingBookmarkId(numericId);
          dispatch(
            getBookmarks(hostsSearchProps.bookmarks.url, hostsController)
          );
        }
      } else if ((search || search === '') && !hostIds?.length) {
        // replace an empty string search with a dummy search query to match all hosts
        // but only if search query was entered (based on presence of :search parameter)

        setSelectedBookmark(null);
        const hostSearch = search === '' ? "name != ''" : search;
        setHostsSearchQuery(hostSearch);
      }
      if (templateID) {
        setJobTemplateID(+templateID);
      }
      if (feature) {
        dispatch(
          get({
            key: REX_FEATURE,
            url: `/api/remote_execution_features/${feature}`,
            handleSuccess: ({ data }) => {
              setJobTemplateID(data.job_template_id);
            },
          })
        );
      }
      if (rest) {
        Object.keys(rest).forEach(key => {
          const re = /inputs\[(?<input>.*)\]/g;
          const input = re.exec(key)?.groups?.input;
          if (input) {
            if (typeof rest[key] === 'string') {
              setTemplateValues(prev => ({ ...prev, [input]: rest[key] }));
              setAdvancedValues(prev => ({ ...prev, [input]: rest[key] }));
            } else if (rest[key].value !== null) {
              const { value, advanced } = rest[key];
              if (advanced) {
                setAdvancedValues(prev => ({
                  ...prev,
                  templateValues: { ...prev.templateValues, [input]: value },
                }));
              } else {
                setTemplateValues(prev => ({ ...prev, [input]: value }));
              }
            }
          }
        });
      }
    }
  }, [
    fills,
    setFills,
    setSelectedTargets,
    setHostsSearchQuery,
    setSelectedBookmark,
    setJobTemplateID,
    setTemplateValues,
    setAdvancedValues,
    dispatch,
    bookmarks,
  ]);
};
