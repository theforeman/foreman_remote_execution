import componentRegistry from 'foremanReact/components/componentRegistry';

const components = [];

components.forEach(component => {
  componentRegistry.register(component);
});
