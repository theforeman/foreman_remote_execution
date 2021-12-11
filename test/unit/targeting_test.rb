require 'test_plugin_helper'

class TargetingTest < ActiveSupport::TestCase
  let(:targeting) { FactoryBot.build(:targeting) }
  let(:bookmark) { bookmarks(:one) }
  let(:host) { FactoryBot.create(:host) }

  before do
    bookmark.query = 'name = bar'
  end

  describe '#resolved?' do
    context 'resolved_at is nil' do
      before { targeting.resolved_at = nil }
      it { assert_not targeting.resolved? }
    end

    context 'resolved_at is set' do
      before { targeting.resolved_at = Time.now.getlocal }
      it { assert targeting.resolved? }
    end

  end

  context 'able to be created with search term' do
    before { targeting.search_query = 'name = foo' }
    it { assert targeting.save }
  end

  context 'able to be created with a bookmark' do
    before do
      targeting.search_query = nil
      targeting.bookmark = bookmark
    end
    it { assert_valid targeting }
  end

  context 'cannot create without search term or bookmark' do
    before do
      targeting.targeting_type = Targeting::DYNAMIC_TYPE
      targeting.search_query = ''
      targeting.bookmark = nil
    end
    it { refute_valid targeting }
  end

  context 'can resolve hosts via query' do
    before do
      targeting.user = users(:admin)
      targeting.search_query = "name = #{host.name}"
      targeting.resolve_hosts!
    end

    it { _(targeting.hosts).must_include(host) }
  end

  context 'can delete a user' do
    before do
      targeting.user = users(:one)
      targeting.save!
      users(:one).destroy
    end

    it { assert_nil targeting.reload.user }
    it do
      -> { targeting.resolve_hosts! }.must_raise(Foreman::Exception)
    end
  end

  context 'can delete a host' do
    before do
      targeting.hosts << host
      targeting.save!
      host.destroy
    end

    it { _(targeting.reload.hosts).must_be_empty }
  end

  describe '#resolve_hosts!' do
    let(:second_host) { FactoryBot.create(:host) }
    let(:infra_host) { FactoryBot.create(:host, :with_infrastructure_facet) }
    let(:targeting) { FactoryBot.build(:targeting) }

    before do
      host
      second_host
      infra_host
    end

    context 'with infrastructure host permission' do
      before do
        setup_user('view', 'hosts')
        setup_user('execute_jobs_on', 'infrastructure_hosts')
      end

      it 'resolves all hosts' do
        hosts = [host, second_host, infra_host]
        targeting.search_query = "name ^ (#{hosts.map(&:name).join(',')})"
        targeting.user = User.current
        targeting.resolve_hosts!

        targeting.hosts.must_include host
        targeting.hosts.must_include second_host
        targeting.hosts.must_include infra_host
      end
    end

    context 'without infrastructure host permission' do
      before { setup_user('view', 'hosts') }

      it 'ignores infrastructure hosts' do
        hosts = [host, second_host, infra_host]
        targeting.search_query = "name ^ (#{hosts.map(&:name).join(',')})"
        targeting.user = User.current
        targeting.resolve_hosts!

        targeting.hosts.must_include host
        targeting.hosts.must_include second_host
        targeting.hosts.wont_include infra_host
      end
    end
  end

  describe '#build_query_from_hosts(ids)' do
    let(:second_host) { FactoryBot.create(:host) }
    let(:infra_host) { FactoryBot.create(:host, :with_infrastructure_facet) }

    before do
      host
      second_host
      infra_host
    end

    context 'for two hosts' do
      let(:query) { Targeting.build_query_from_hosts([ host.id, second_host.id, infra_host.id ]) }

      it 'builds query using host names joining inside ^' do
        _(query).must_include host.name
        _(query).must_include second_host.name
        _(query).must_include infra_host.name
        _(query).must_include 'name ^'

        Host.search_for(query).must_include host
        Host.search_for(query).must_include second_host
        Host.search_for(query).must_include infra_host
      end
    end

    context 'for one host' do
      let(:query) { Targeting.build_query_from_hosts([ host.id ]) }

      it 'builds query using host name' do
        _(query).must_equal "name ^ (#{host.name})"
        Host.search_for(query).must_include host
        Host.search_for(query).wont_include second_host
        Host.search_for(query).wont_include infra_host
      end
    end

    context 'for no id' do
      let(:query) { Targeting.build_query_from_hosts([]) }

      it 'builds query to find all hosts' do
        Host.search_for(query).must_include host
        Host.search_for(query).must_include second_host
        Host.search_for(query).must_include infra_host
      end
    end

    context 'without infrastructure host permission' do
      before { User.current = nil }

      it 'ignores the infrastructure host' do
        query = Targeting.build_query_from_hosts([host.id, second_host.id, infra_host.id])
        _(query).must_include host.name
        _(query).must_include second_host.name
        _(query).wont_include infra_host.name
        _(query).must_include 'name ^'

        Host.search_for(query).must_include host
        Host.search_for(query).must_include second_host
        Host.search_for(query).wont_include infra_host
      end
    end
  end

  context 'randomized ordering' do
    let(:targeting) { FactoryBot.build(:targeting, :with_randomized_ordering) }
    let(:hosts) { (0..4).map { FactoryBot.create(:host) } }

    it 'loads the hosts in random order' do
      rng = Random.new(4) # Chosen by a fair dice roll
      Random.stubs(:new).returns(rng)
      hosts
      targeting.search_query = 'name ~ host*'
      targeting.user = users(:admin)
      targeting.resolve_hosts!
      randomized_host_ids = targeting.hosts.map(&:id)
      host_ids = hosts.map(&:id)

      assert_not_equal host_ids, randomized_host_ids
      assert_equal host_ids, randomized_host_ids.sort
    end
  end
end
