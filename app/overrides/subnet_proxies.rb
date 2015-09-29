Deface::Override.new(:virtual_path => 'subnets/_form',
                     :name => 'add_remote_execution_proxies_tab',
                     :insert_after => 'li.active',
                     :partial => '../overrides/foreman/subnets/rex_tab')

Deface::Override.new(:virtual_path => 'subnets/_form',
                     :name => 'add_remote_execution_proxies_tab_pane',
                     :insert_after => 'div#proxies',
                     :partial => '../overrides/foreman/subnets/rex_tab_pane')
