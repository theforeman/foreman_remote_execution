require 'test_plugin_helper'

describe Targeting do
  let(:targeting) { FactoryGirl.build(:targeting) }
  let(:bookmark) { bookmarks(:one) }
  let(:host) { FactoryGirl.create(:host) }

  before do
    bookmark.query = "name = bar"
  end

  context 'Able to be created with search term' do
    before { targeting.search_query = "name = foo" }
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
      targeting.search_query = nil
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

  context 'setting static with bookmark does not resolve dynamically' do
    before do
      @old_query = bookmark.query
      targeting.search_query = nil
      targeting.user = users(:admin)
      targeting.bookmark = bookmark
      targeting.save!
      targeting.bookmark.query = "someotherquery"
      targeting.resolve_hosts!
    end

    it { assert_equal @old_query, targeting.search_query  }
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
end
