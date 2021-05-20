/* eslint-disable camelcase */

import PropTypes from 'prop-types';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import ElipsisWithTooltip from 'react-ellipsis-with-tooltip';

import { Grid, GridItem } from '@patternfly/react-core';
import {
  PropertiesSidePanel,
  PropertyItem,
} from '@patternfly/react-catalog-view-extension';
import { ArrowIcon, ErrorCircleOIcon, OkIcon } from '@patternfly/react-icons';

import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import CardItem from 'foremanReact/components/HostDetails/Templates/CardItem/CardTemplate';
import RelativeDateTime from 'foremanReact/components/common/dates/RelativeDateTime';
import { translate as __ } from 'foremanReact/common/I18n';
import './styles.css';

const RecentJobsCard = ({ hostDetails: { name } }) => {
  const jobsUrl =
    name && `/api/job_invocations?search=host%3D${name}&per_page=3`;
  const {
    response: { results: jobs },
  } = useAPI('get', jobsUrl);

  const iconMarkup = status => {
    if (status === 1) return <ErrorCircleOIcon color="#C9190B" />;
    return <OkIcon color="#3E8635" />;
  };

  return (
    <CardItem
      header={
        <span>
          {__('Recent Jobs')}{' '}
          <a href={`/job_invocations?search=host+%3D+${name}`}>
            <ArrowIcon />
          </a>
        </span>
      }
    >
      <PropertiesSidePanel>
        {jobs?.map(({ status, status_label, id, start_at, description }) => (
          <PropertyItem
            key={id}
            label={
              description ? (
                <Grid>
                  <GridItem span={8}>
                    <ElipsisWithTooltip>{description}</ElipsisWithTooltip>
                  </GridItem>
                  <GridItem span={1}>{iconMarkup(status)}</GridItem>
                  <GridItem span={3}>{status_label}</GridItem>
                </Grid>
              ) : (
                <Skeleton />
              )
            }
            value={
              start_at ? (
                <a href={`/job_invocations/${id}`}>
                  <RelativeDateTime date={start_at} />
                </a>
              ) : (
                <Skeleton />
              )
            }
          />
        ))}
      </PropertiesSidePanel>
    </CardItem>
  );
};

export default RecentJobsCard;

RecentJobsCard.propTypes = {
  hostDetails: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};
