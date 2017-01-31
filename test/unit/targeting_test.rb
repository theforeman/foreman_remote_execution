require 'test_plugin_helper'

describe Targeting do
  let(:targeting) { FactoryGirl.build(:targeting) }
  let(:bookmark) { bookmarks(:one) }
  let(:host) { FactoryGirl.create(:host) }

  before do
    bookmark.query = 'name = bar'
  end

  describe '#resolved?' do
    context 'resolved_at is nil' do
      before { targeting.resolved_at = nil }
      it { refute targeting.resolved? }
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

    it { targeting.hosts.must_include(host) }
  end

  context 'can delete a user' do
    before do
      targeting.user = users(:one)
      targeting.save!
      users(:one).destroy
    end

    it { assert targeting.reload.user.nil? }
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

    it { targeting.reload.hosts.must_be_empty }
  end

  describe '#build_query_from_hosts(ids)' do
    let(:second_host) { FactoryGirl.create(:host) }

    before do
      host
      second_host
    end

    context 'for two hosts' do
      let(:query) { Targeting.build_query_from_hosts([ host.id, second_host.id ]) }

      it 'builds query using host names joining inside ^' do
        query.must_include host.name
        query.must_include second_host.name
        query.must_include 'name ^'

        Host.search_for(query).must_include host
        Host.search_for(query).must_include second_host
      end
    end

    context 'for one host' do
      let(:query) { Targeting.build_query_from_hosts([ host.id ]) }

      it 'builds query using host name' do
        query.must_equal "name ^ (#{host.name})"
        Host.search_for(query).must_include host
        Host.search_for(query).wont_include second_host
      end
    end

    context 'for no id' do
      let(:query) { Targeting.build_query_from_hosts([]) }

      it 'builds query to find all hosts' do
        Host.search_for(query).must_include host
        Host.search_for(query).must_include second_host
      end
    end
  end
end
