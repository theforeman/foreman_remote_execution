require 'test_plugin_helper'

class RendererScopeInputTest < ActiveSupport::TestCase
  let(:source) { Foreman::Renderer::Source::String.new(content: '') }

  describe 'caching helper in real mode' do
    let(:input) do
      input = ForemanRemoteExecution::Renderer::Scope::Input.new(source: source)
      input.stubs(:invocation => OpenStruct.new(:job_invocation_id => 1))
      input
    end

    it 'caches the value under given key' do
      i = 1
      result = input.cached('some_key') { i }
      assert_equal 1, result

      i += 1
      result = input.cached('some_key') { i }
      assert_equal 1, result

      i += 1
      result = input.cached('different_key') { i }
      assert_equal 3, result
    end
  end

  describe 'caching helper in preview mode' do
    let(:input) do
      input = ForemanRemoteExecution::Renderer::Scope::Input.new(source: source)
      input.stubs(:invocation => OpenStruct.new(:job_invocation_id => 1), :preview? => true)
      input
    end

    it 'does not cache the value' do
      i = 1
      result = input.cached('some_key') { i }
      assert_equal 1, result

      i += 1
      result = input.cached('some_key') { i }
      assert_equal 2, result

      i += 1
      result = input.cached('different_key') { i }
      assert_equal 3, result
    end
  end
end
