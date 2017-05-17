require 'test_plugin_helper'

class JobTemplateImporterTest < ActiveSupport::TestCase
  context 'importing a new template' do
    # JobTemplate tests handle most of this, we just check that the shim
    # correctly loads a template returns a hash
    let(:remote_execution_feature) do
      FactoryGirl.create(:remote_execution_feature)
    end

    let(:result) do
      name = 'Community Service Restart'
      metadata = {
        'model' => 'JobTemplate',
        'kind' => 'job_template',
        'name' => 'Service Restart',
        'job_category' => 'Service Restart',
        'provider_type' => 'SSH',
        'feature' => remote_execution_feature.label,
        'template_inputs' => [
          { 'name' => 'service_name', 'input_type' => 'user', 'required' => true },
          { 'name' => 'verbose', 'input_type' => 'user' }
        ]
      }
      text = <<-END_TEMPLATE
<%#
#{YAML.dump(metadata)}
%>

service <%= input("service_name") %> restart
END_TEMPLATE

      JobTemplateImporter.import!(name, text, metadata)
    end

    let(:template) { JobTemplate.find_by name: 'Community Service Restart' }

    it 'returns a valid foreman_templates hash' do
      result[:status].must_equal true
      result[:result].must_equal '  Created Template :Community Service Restart'
      result[:old].must_equal nil
      result[:new].must_equal template.template.squish
    end
  end
end
