import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { DropdownItem, Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import CardTemplate from 'foremanReact/components/HostDetails/Templates/CardItem/CardTemplate';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';

import {
  FINISHED_TAB,
  RUNNING_TAB,
  SCHEDULED_TAB,
  JOB_BASE_URL,
} from './constants';
import RecentJobsTable from './RecentJobsTable';

const RecentJobsCard = ({ hostDetails: { name, id } }) => {
  const [activeTab, setActiveTab] = useState(FINISHED_TAB);

  const handleTabClick = (evt, tabIndex) => setActiveTab(tabIndex);

  return (
    <CardTemplate
      overrideGridProps={{ xl2: 6, xl: 8, lg: 8, md: 12 }}
      header={__('Recent jobs')}
      dropdownItems={[
        <DropdownItem
          href={foremanUrl(`${JOB_BASE_URL}${name}`)}
          key="link-to-all"
        >
          {__('View All Jobs')}
        </DropdownItem>,
        <DropdownItem
          href={foremanUrl(
            `${JOB_BASE_URL}${name}+and+status+%3D+failed+or+status%3D+succeeded`
          )}
          key="link-to-finished"
        >
          {__('View Finished Jobs')}
        </DropdownItem>,
        <DropdownItem
          href={foremanUrl(`${JOB_BASE_URL}${name}+and+status+%3D+running`)}
          key="link-to-running"
        >
          {__('View Running Jobs')}
        </DropdownItem>,
        <DropdownItem
          href={foremanUrl(`${JOB_BASE_URL}${name}+and+status+%3D+queued`)}
          key="link-to-scheduled"
        >
          {__('View Scheduled Jobs')}
        </DropdownItem>,
      ]}
    >
      <Tabs
        mountOnEnter
        unmountOnExit
        activeKey={activeTab}
        onSelect={handleTabClick}
      >
        <Tab
          eventKey={FINISHED_TAB}
          title={<TabTitleText>{__('Finished')}</TabTitleText>}
        >
          <RecentJobsTable hostId={id} status="failed+or+status%3D+succeeded" />
        </Tab>
        <Tab
          eventKey={RUNNING_TAB}
          title={<TabTitleText>{__('Running')}</TabTitleText>}
        >
          <RecentJobsTable hostId={id} status="running" />
        </Tab>
        <Tab
          eventKey={SCHEDULED_TAB}
          title={<TabTitleText>{__('Scheduled')}</TabTitleText>}
        >
          <RecentJobsTable hostId={id} status="queued" />
        </Tab>
      </Tabs>
    </CardTemplate>
  );
};

export default RecentJobsCard;

RecentJobsCard.propTypes = {
  hostDetails: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
  }),
};

RecentJobsCard.defaultProps = {
  hostDetails: {},
};
