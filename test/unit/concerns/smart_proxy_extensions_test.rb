require 'test_plugin_helper'

class ForemanRemoteExecutionSmartProxyExtensionsTest < ActiveSupport::TestCase
  let(:proxy) { FactoryBot.create(:smart_proxy, :ssh) }

  describe '#pubkey' do
    context 'when key is cached in the database' do
      it 'returns the cached key without fetching from proxy' do
        proxy.expects(:update_pubkey).never
        assert_equal 'ssh-rsa AAAAB3N...', proxy.pubkey
        assert_equal 'ssh-rsa AAAAB3N...', proxy.pubkey(refresh: false)
      end
    end

    context 'when key is not cached' do
      before { proxy.update(pubkey: nil) }

      it 'fetches from proxy by default' do
        proxy.expects(:update_pubkey).returns('ssh-rsa FETCHED...')
        assert_equal 'ssh-rsa FETCHED...', proxy.pubkey
      end

      it 'returns nil without fetching when refresh: false' do
        proxy.expects(:update_pubkey).never
        assert_nil proxy.pubkey(refresh: false)
      end
    end
  end

  describe '#ca_pubkey' do
    context 'when key is cached in the database' do
      before { proxy.update(ca_pubkey: 'ssh-rsa CA_KEY...') }

      it 'returns the cached key without fetching from proxy' do
        proxy.expects(:update_ca_pubkey).never
        assert_equal 'ssh-rsa CA_KEY...', proxy.ca_pubkey
        assert_equal 'ssh-rsa CA_KEY...', proxy.ca_pubkey(refresh: false)
      end
    end

    context 'when key is not cached' do
      before { proxy.update(ca_pubkey: nil) }

      it 'fetches from proxy by default' do
        proxy.expects(:update_ca_pubkey).returns('ssh-rsa FETCHED_CA...')
        assert_equal 'ssh-rsa FETCHED_CA...', proxy.ca_pubkey
      end

      it 'returns nil without fetching when refresh: false' do
        proxy.expects(:update_ca_pubkey).never
        assert_nil proxy.ca_pubkey(refresh: false)
      end
    end
  end

  describe '#refresh' do
    context 'when the key is cached' do
      before do
        proxy.update(pubkey: 'ssh-rsa KEY...', ca_pubkey: 'ssh-rsa CA_KEY...')
      end

      it 'fetches the keys' do
        proxy.expects(:update_pubkey).once
        proxy.expects(:update_ca_pubkey).once

        proxy.refresh
      end
    end

    context 'when the key is not cached' do
      before do
        proxy.update(pubkey: nil, ca_pubkey: nil)
      end

      it 'fetches the keys' do
        proxy.expects(:update_pubkey).once
        proxy.expects(:update_ca_pubkey).once

        proxy.refresh
      end
    end
  end
end
