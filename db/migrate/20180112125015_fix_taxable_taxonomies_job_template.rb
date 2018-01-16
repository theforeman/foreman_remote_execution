class FixTaxableTaxonomiesJobTemplate < ActiveRecord::Migration[4.2]
  def up
    # we need to count on the fact that the user might already has assigned the templates
    # to taxonomies after the previous update
    already_present = TaxableTaxonomy.where(:taxable_type => 'JobTemplate').pluck(:taxable_id)
    missing = JobTemplate.unscoped.pluck(:id) - already_present
    TaxableTaxonomy.unscoped.where(:taxable_type => 'Template', :taxable_id => missing).update_all(:taxable_type => 'JobTemplate')
    TaxableTaxonomy.unscoped.where(:taxable_type => 'Template', :taxable_id => already_present).delete_all
  end

  def down
    TaxableTaxonomy.unscoped.where(:taxable_type => 'JobTemplate').update_all(:taxable_type => 'Template')
  end
end
