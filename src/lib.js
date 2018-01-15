import vueStickyBubble from './components/vue-sticky-bubble';

const vueStickyBubblePlugin = {};
vueStickyBubblePlugin.install = (Vue) => {
  Vue.component('vue-sticky-bubble', vueStickyBubble);
};

export default vueStickyBubblePlugin;
