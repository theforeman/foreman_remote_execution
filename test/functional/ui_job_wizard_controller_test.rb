require 'test_plugin_helper'

class UIJobWizardControllerTest < ActionController::TestCase
  def setup
    FactoryBot.create(:job_template, :job_category => 'cat1')
    FactoryBot.create(:job_template, :job_category => 'cat2')
    FactoryBot.create(:job_template, :job_category => 'cat2')
  end

  test 'should respond with categories' do
    get :categories, :params => {}, :session => set_session_user
    assert_response :success
    res = JSON.parse @response.body
    assert_equal ['cat1','cat2'], res['job_categories']
  end
end
