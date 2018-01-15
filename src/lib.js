import VueStickyBubble from './components/vue-sticky-bubble';

const vueStickyBubblePlugin = {};
vueStickyBubblePlugin.install = (Vue) => {
  Vue.component('VueStickyBubble', VueStickyBubble);
};

export default vueStickyBubblePlugin;
