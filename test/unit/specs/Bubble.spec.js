import Vue from 'vue';
import VueStickyBubble from '../../../src/lib';

describe('VueStickyBubble.vue', () => {
  it('should render correct contents without badge count', () => {
    const Constructor = Vue.extend(VueStickyBubble);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('#vsb-bubble img'))
      .to.not.equal(null);
    expect(vm.$el.querySelector('#vsb-bubble #vsb-badge'))
      .to.equal(null);
  });
  it('should render correct contents with a badge count', () => {
    const Constructor = Vue.extend(VueStickyBubble);
    const vm = new Constructor({
      propsData: {
        badgeCount: 5,
      },
    }).$mount();
    expect(vm.$el.querySelector('#vsb-bubble img'))
      .to.not.equal(null);
    expect(vm.$el.querySelector('div#vsb-badge'))
      .to.not.equal(null);
  });
});
