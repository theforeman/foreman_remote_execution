# frozen_string_literal: true

require 'test_plugin_helper'

class ApiParamsTest < ActiveSupport::TestCase
  describe '#format_datetime' do
    let(:params) { JobInvocationComposer::ApiParams.allocate }

    it 'leaves empty string as is' do
      assert_equal params.send(:format_datetime, ''), ''
    end

    it 'honors explicitly supplied time zone' do
      Time.use_zone(ActiveSupport::TimeZone['America/New_York']) do
        assert_equal '2022-07-08 08:53', params.send(:format_datetime, '2022-07-08 12:53:20 UTC')
      end
    end

    it 'implicitly honors current user\'s time zone' do
      Time.use_zone(ActiveSupport::TimeZone['America/New_York']) do
        assert_equal '2022-07-08 12:53', params.send(:format_datetime, '2022-07-08 12:53:20')
      end
    end
  end
end
