import VueStickyBubbleComponent from './components/vue-sticky-bubble';

const VueStickyBubblePlugin = {
  install(Vue) {
    Vue.component('vue-sticky-bubble', VueStickyBubbleComponent);
  },
};

export default VueStickyBubblePlugin;
export const VueStickyBubble = VueStickyBubbleComponent;
