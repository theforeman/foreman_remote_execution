require 'test_plugin_helper'

class PackageActionTemplateTest < ActiveSupport::TestCase
  NESTING_OPTIONS = [false, true].freeze
  GROUP_ACTIONS = ['group install', 'group update', 'group remove'].freeze
  PACKAGE_ACTIONS = ['install', 'update', 'remove'].freeze
  setup do
    @previous_user = User.current
    User.current = users(:admin)
    path = ForemanRemoteExecution::Engine.root.join('app/views/templates/script/package_action.erb')
    source = File.read(path).sub('name: Package Action - Script Default', 'name: Package Action - Regression Test')
    @template = JobTemplate.import_raw!(source, :default => true, :lock => false)
  end

  teardown do
    User.current = @previous_user
  end

  test 'only ordinary package actions are offered as user choices' do
    assert_equal ['install', 'update', 'remove'], @template.template_inputs.find_by!(:name => 'action').options_array
  end

  test 'errata actions render directly and through nested overrides' do
    [
      ['Redhat', 'update-minimal', '--advisory=RHSA-example'],
      ['Suse', 'install -n -t patch', 'SUSE-example'],
    ].each do |family, action, package|
      NESTING_OPTIONS.each do |nested|
        renderer = renderer_for(family, action, :nested => nested, :package => package)
        script = renderer.render
        assert script, renderer.error_message
        assert_includes script.squish, "#{action} #{package}"
        assert_includes script, 'echo pre script marker'
      end
    end
  end

  test 'ordinary package actions still render for every supported family' do
    ['Redhat', 'Debian', 'Suse'].each do |family|
      PACKAGE_ACTIONS.each do |action|
        renderer = renderer_for(family, action)
        assert renderer.render, renderer.error_message
      end
    end
  end

  test 'Debian update retains its package-specific command translation' do
    renderer = renderer_for('Debian', 'update')
    assert_includes renderer.render, '--only-upgrade install vim'
    renderer = renderer_for('Debian', 'update', :package => '')
    assert_match(/-y\s+upgrade\s/, renderer.render)
  end

  private

  def renderer_for(family, action, nested: false, package: 'vim')
    host = FactoryBot.build(:host, :operatingsystem => FactoryBot.build(:operatingsystem, :family => family))
    values = {
      'action' => action,
      'package' => package,
      'options' => '',
      'pre_script' => 'echo pre script marker',
      'post_script' => '',
      'refresh_subscription' => 'false',
    }
    template = @template
    if nested
      source = "<%= render_template(#{@template.name.inspect}, #{values.inspect}) %>"
      template = FactoryBot.build(:job_template, :template => source)
      values = {}
    end
    InputTemplateRenderer.new(template, host, nil, values)
  end
end
