require 'test_plugin_helper'

class JobTemplateEffectiveUserTest < ActiveSupport::TestCase
  let(:job_template) { FactoryBot.build(:job_template, :job_category => '') }
  let(:effective_user) { job_template.effective_user }

  before do
    Setting::RemoteExecution.load_defaults
  end

  describe 'by default' do
    it 'is overridable' do
      assert effective_user.overridable?
    end

    it 'does not use the current user' do
      assert_not effective_user.current_user?
    end
  end

  describe 'compute value' do
    it 'computes the value based on the current user when current_user set to true' do
      user = FactoryBot.create(:user)
      User.current = user
      effective_user.current_user = true
      _(effective_user.compute_value).must_equal user.login
    end

    it 'returns the value when not current user is set to true' do
      effective_user.current_user = false
      effective_user.value = 'testuser'
      _(effective_user.compute_value).must_equal 'testuser'
    end

    it 'returns a default value when no value is specified for the user' do
      effective_user.value = ''
      Setting[:remote_execution_effective_user] = 'myuser'
      _(effective_user.compute_value).must_equal 'myuser'
    end
  end
end
