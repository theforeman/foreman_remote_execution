require 'test_plugin_helper'

class JobTemplateTest < ActiveSupport::TestCase
  context 'when creating a template' do
    let(:job_template) { FactoryBot.build(:job_template, :job_category => '') }
    let(:template_with_inputs) do
      FactoryBot.build(:job_template, :template => 'test').tap do |template|
        template.template_inputs << FactoryBot.build(:template_input, :name => 'command', :input_type => 'user')
        template.save!
      end
    end

    it 'has a unique name' do
      template1 = FactoryBot.create(:job_template)
      template2 = FactoryBot.build(:job_template, :name => template1.name)
      assert_not template2.valid?
    end

    it 'needs a job_category' do
      assert_not job_template.valid?
    end

    it 'does not need a job_category if it is a snippet' do
      job_template.snippet = true
      assert job_template.valid?
    end

    it 'validates the inputs are uniq in the template' do
      job_template.job_category = 'Miscellaneous'
      job_template.foreign_input_sets << FactoryBot.build(:foreign_input_set, :target_template => template_with_inputs)
      job_template.foreign_input_sets << FactoryBot.build(:foreign_input_set, :target_template => template_with_inputs)
      assert_not job_template.valid?
      _(job_template.errors.full_messages.first).must_include 'Duplicated inputs detected: ["command"]'
    end
  end

  context 'description format' do
    let(:template_with_description) { FactoryBot.build(:job_template, :with_description_format, :job_category => 'test job') }
    let(:template) { FactoryBot.build(:job_template, :with_input, :job_category => 'test job') }
    let(:minimal_template) { FactoryBot.build(:job_template) }

    it 'uses the description_format attribute if set' do
      _(template_with_description.generate_description_format).must_equal template_with_description.description_format
    end

    it 'uses the job name as description_format if not set or blank and has no inputs' do
      _(minimal_template.generate_description_format).must_equal '%{template_name}'
      minimal_template.description_format = ''
      _(minimal_template.generate_description_format).must_equal '%{template_name}'
    end

    it 'generates the description_format if not set or blank and has inputs' do
      input_name = template.template_inputs.first.name
      expected_result = %(%{template_name} with inputs #{input_name}="%{#{input_name}}")
      _(template.generate_description_format).must_equal expected_result
      template.description_format = ''
      _(template.generate_description_format).must_equal expected_result
    end
  end

  context 'cloning' do
    let(:job_template) { FactoryBot.build(:job_template, :with_input) }

    describe '#dup' do
      it 'duplicates also template inputs' do
        duplicate = job_template.dup
        _(duplicate).wont_equal job_template
        _(duplicate.template_inputs).wont_be_empty
        _(duplicate.template_inputs.first).wont_equal job_template.template_inputs.first
        _(duplicate.template_inputs.first.name).must_equal job_template.template_inputs.first.name
      end
    end
  end

  context 'importing a new template' do
    let(:remote_execution_feature) do
      FactoryBot.create(:remote_execution_feature)
    end

    let(:template) do
      template = <<-END_TEMPLATE
      <%#
      kind: job_template
      name: Service Restart
      job_category: Service Restart
      provider_type: SSH
      feature: #{remote_execution_feature.label}
      template_inputs:
      - name: service_name
        input_type: user
        required: true
      - name: verbose
        input_type: user
      %>

      service <%= input("service_name") %> restart

      <%# test comment %>
      END_TEMPLATE

      JobTemplate.import_raw!(template, :default => true)
    end

    let(:template_with_input_sets) do
      template_with_input_sets = <<-END_TEMPLATE
      <%#
      kind: job_template
      name: Service Restart - Custom
      job_category: Service Restart
      provider_type: SSH
      foreign_input_sets:
      - template: #{template.name}
        exclude: verbose
      %>

      service <%= input("service_name") %> restart
      END_TEMPLATE

      JobTemplate.import_raw!(template_with_input_sets, :default => true)
    end

    it 'sets the name' do
      _(template.name).must_equal 'Service Restart'
    end

    it 'has a template' do
      _(template.template.squish).must_equal 'service <%= input("service_name") %> restart <%# test comment %>'
    end

    it 'imports inputs' do
      _(template.template_inputs.first.name).must_equal 'service_name'
    end

    it 'imports input sets' do
      _(template_with_input_sets.foreign_input_sets.first.target_template).must_equal template
      _(template_with_input_sets.template_inputs_with_foreign.map(&:name)).must_equal ['service_name']
    end

    it 'imports feature' do
      template # let is lazy
      remote_execution_feature.reload
      _(remote_execution_feature.job_template).must_equal template
    end

    it 'sets additional options' do
      _(template.default).must_equal true
    end
  end

  context 'importing an existing template' do
    let(:included) do
      template = <<-END_TEMPLATE
      <%#
      kind: job_template
      name: Banner
      job_category: Commands
      provider_type: SSH
      template_inputs:
      - name: banner_message
        input_type: user
        required: true
      %>

      echo input(:banner_message)
      END_TEMPLATE

      JobTemplate.import_raw!(template, :default => true)
    end

    let(:existing) do
      template = <<-END_TEMPLATE
      <%#
      kind: job_template
      name: Ping a Thing
      job_category: Commands
      provider_type: SSH
      template_inputs:
      - name: hostname
        input_type: user
        options: "www.google.com"
        required: true
      foreign_input_sets:
        - template: #{included.name}
      %>

      ping -c 5 <%= input("hostname") %>
      END_TEMPLATE

      JobTemplate.import_raw!(template, :default => true)
    end

    let(:updated) do
      <<-END_TEMPLATE
      <%#
      kind: job_template
      name: Ping a Thing
      job_category: Commands
      provider_type: SSH
      template_inputs:
      - name: hostname
        input_type: user
        options: 'www.redhat.com'
        required: true
      - name: count
        input_type: user
        required: true
      foreign_input_sets:
        - template: #{included.name}
          exclude: banner_message
      %>

      ping -c <%= input('count') %> <%= input('hostname') %>
      END_TEMPLATE
    end

    it 'will not overwrite by default' do
      existing
      assert_not JobTemplate.import_raw!(updated)
    end

    let(:synced_template) do
      existing
      JobTemplate.import_raw!(updated, :update => true)
      existing.reload
    end

    it 'syncs inputs' do
      hostname = synced_template.template_inputs.find { |input| input.name == 'hostname' }
      _(hostname.options).must_equal 'www.redhat.com'
    end

    it 'syncs content' do
      _(synced_template.template).must_match(/ping -c <%= input\('count'\) %> <%= input\('hostname'\) %>/m)
    end

    it 'syncs input sets' do
      _(synced_template.foreign_input_sets.first.target_template).must_equal included
      _(synced_template.template_inputs_with_foreign.map(&:name)).must_equal ['hostname', 'count']
    end
  end

  context 'template export' do
    let(:exportable_template) do
      FactoryBot.create(:job_template, :with_input)
    end

    let(:erb) do
      exportable_template.to_erb
    end

    it 'exports name' do
      _(erb).must_match(/^name: #{exportable_template.name}$/)
    end

    it 'includes template inputs' do
      _(erb).must_match(/^template_inputs:$/)
    end

    it 'includes template contents' do
      _(erb).must_include exportable_template.template
    end

    it 'is importable' do
      erb
      old_name = exportable_template.name
      exportable_template.update(:name => "#{old_name}_renamed")

      imported = JobTemplate.import_raw!(erb)
      _(imported.name).must_equal old_name
      _(imported.template_inputs.first.to_export).must_equal exportable_template.template_inputs.first.to_export
    end

    it 'has taxonomies in metadata' do
      assert_equal 'Organization 1', exportable_template.to_export["organizations"].first
      assert_equal 'Location 1', exportable_template.to_export["locations"].first
    end
  end

  context 'there is existing template invocation of a job template' do
    let(:job_invocation) { FactoryBot.create(:job_invocation, :with_template) }
    let(:job_template) { job_invocation.pattern_template_invocations.first.template }

    describe 'job template deletion' do
      it 'succeeds' do
        _(job_template.pattern_template_invocations).wont_be_empty
        assert job_template.destroy
      end
    end
  end

  context 'template locked' do
    it 'inputs cannot be changed' do
      job_template = FactoryBot.create(:job_template, :with_input, :locked => true)
      Foreman.expects(:in_rake?).returns(false).at_least_once
      assert_valid job_template
      job_template.template_inputs.first.name = 'something else'
      refute_valid job_template
    end
  end

  context 'rendering' do
    it 'renders nested template as a non-admin user' do
      inner = FactoryBot.create(:job_template)
      template_invocation = FactoryBot.create(:template_invocation)
      template_invocation.template.template = "<wrap><%= render_template('#{inner.name}') %></wrap>"
      template_invocation.template.save!

      setup_user('view', 'job_templates')
      renderer = InputTemplateRenderer.new template_invocation.template,
        template_invocation.host,
        template_invocation
      result = renderer.render
      _(result).must_equal "<wrap>#{inner.template}</wrap>"
    end
  end
end
