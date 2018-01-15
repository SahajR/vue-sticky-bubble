import vueStickyBubble from './components/vue-sticky-bubble';

const vueStickyBubblePlugin = {};
vueStickyBubblePlugin.install = (Vue) => {
  Vue.component(vueStickyBubble.name, vueStickyBubble);
};

export default vueStickyBubblePlugin;
