import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import DefaultLoaderEmptyState from 'foremanReact/components/HostDetails/DetailsCard/DefaultLoaderEmptyState';
import {
  ChartDonut,
  ChartLabel,
  ChartLegend,
  ChartTooltip,
} from '@patternfly/react-charts';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  FlexItem,
  Text,
} from '@patternfly/react-core';
import {
  global_palette_black_600 as canceledColor,
  global_palette_black_500 as emptyChartDonut,
  global_palette_red_100 as failedColor,
  global_palette_blue_300 as inProgressColor,
  global_palette_green_500 as successedColor,
} from '@patternfly/react-tokens';
import './JobInvocationDetail.scss';

const JobInvocationSystemStatusChart = ({
  data,
  isAlreadyStarted,
  formattedStartDate,
}) => {
  const {
    succeeded,
    failed,
    pending,
    cancelled,
    total_hosts: totalHosts, // includes scheduled
  } = data;
  const total = succeeded + failed + pending + cancelled;
  const chartData = [
    { title: __('Succeeded:'), count: succeeded, color: successedColor.value },
    { title: __('Failed:'), count: failed, color: failedColor.value },
    { title: __('In Progress:'), count: pending, color: inProgressColor.value },
    { title: __('Canceled:'), count: cancelled, color: canceledColor.value },
  ];
  const chartDonutTitle = () => {
    if (total > 0) return `${succeeded.toString()}/${total}`;
    if (totalHosts > 0) return `0/${totalHosts}`;
    return '0';
  };
  const chartSize = 105;
  const [legendWidth, setLegendWidth] = useState(270);

  // Calculates chart legend width based on its content
  useEffect(() => {
    const legendContainer = document.querySelector('.chart-legend');
    if (legendContainer) {
      const rectElement = legendContainer.querySelector('rect');
      if (rectElement) {
        const rectWidth = parseFloat(rectElement.getAttribute('width'));
        setLegendWidth(rectWidth);
      }
    }
  }, [isAlreadyStarted, data]);

  return (
    <>
      <FlexItem className="chart-donut">
        <ChartDonut
          allowTooltip
          constrainToVisibleArea
          data={
            total > 0
              ? chartData.map(d => ({
                  label: sprintf(__(`${d.title} ${d.count} hosts`)),
                  y: d.count,
                }))
              : [{ label: sprintf(__(`Scheduled: ${totalHosts} hosts`)), y: 1 }]
          }
          colorScale={
            total > 0 ? chartData.map(d => d.color) : [emptyChartDonut.value]
          }
          labelComponent={
            <ChartTooltip
              pointerLength={0}
              constrainToVisibleArea
              renderInPortal={false}
            />
          }
          title={chartDonutTitle}
          titleComponent={
            // inline style overrides PatternFly default styling
            <ChartLabel style={{ fontSize: '20px' }} />
          }
          subTitle={__('Systems')}
          subTitleComponent={
            // inline style overrides PatternFly default styling
            <ChartLabel
              style={{ fontSize: '12px', fill: canceledColor.value }}
            />
          }
          padding={{
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          }}
          width={chartSize}
          height={chartSize}
        />
      </FlexItem>
      <FlexItem className="chart-legend">
        <Text ouiaId="legend-title" className="legend-title">
          {__('System status')}
        </Text>
        {isAlreadyStarted ? (
          <ChartLegend
            orientation="vertical"
            itemsPerRow={2}
            gutter={25}
            rowGutter={7}
            padding={{ left: 15 }}
            data={chartData.map(d => ({
              name: `${d.title} ${d.count}`,
              symbol: { type: 'circle' },
            }))}
            colorScale={chartData.map(d => d.color)}
            width={legendWidth}
            height={chartSize}
          />
        ) : (
          <DescriptionList>
            <DescriptionListGroup>
              <DescriptionListTerm>{__('Scheduled at:')}</DescriptionListTerm>
              <DescriptionListDescription>
                {formattedStartDate || <DefaultLoaderEmptyState />}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        )}
      </FlexItem>
    </>
  );
};

JobInvocationSystemStatusChart.propTypes = {
  data: PropTypes.object.isRequired,
  isAlreadyStarted: PropTypes.bool.isRequired,
  formattedStartDate: PropTypes.string,
};

JobInvocationSystemStatusChart.defaultProps = {
  formattedStartDate: undefined,
};

export default JobInvocationSystemStatusChart;
