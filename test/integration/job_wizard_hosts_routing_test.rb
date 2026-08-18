require File.expand_path('../test_plugin_helper', __dir__)
require 'integration_test_helper'

class JobWizardHostsRoutingTest < ActionDispatch::IntegrationTest
  test 'routes host preview searches to the hosts API via POST' do
    assert_recognizes(
      {:controller => 'api/v2/hosts', :action => 'index', :format => 'json'},
      {:path => '/ui_job_wizard/hosts', :method => :post}
    )
  end
end
