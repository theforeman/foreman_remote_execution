Deface::Override.new(:virtual_path    => 'hosts/_form',
                     :name            => 'add_execution_interface_js',
                     :insert_before   => 'div#primary',
                     :text            => '<%= javascript "execution_interface" %>')

Deface::Override.new(:virtual_path  => 'nic/_base_form',
                     :name          => 'add_execution_interface',
                     :insert_after  => 'erb[loud]:contains("interface_provision")',
                     :partial       => 'overrides/nics/execution_interface')
