import Vue from 'vue';
import VueStickyBubble from '../../../src/lib';

describe('VueStickyBubble.vue', () => {
  it('should render correct contents without badge count', () => {
    const Constructor = Vue.extend(VueStickyBubble);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('#vsb-bubble img'))
      .to.not.equal(null);
    expect(vm.$el.querySelector('div#vsb-badge'))
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
    expect(vm.$el.querySelector('#vsb-badge'))
      .to.not.equal(null);
    expect(vm.$el.querySelector('#vsb-badge').textContent)
      .to.equal('5');
  });
  it('should apply custom bubble styles', () => {
    const Constructor = Vue.extend(VueStickyBubble);
    const vm = new Constructor({
      propsData: {
        badgeCount: 5,
        bubbleStyle: {
          background: 'green',
        },
      },
    }).$mount();
    expect(vm.$el.style.background)
      .to.equal('green');
  });
  it('should override default icon if provided', () => {
    const Constructor = Vue.extend(VueStickyBubble);
    const vm = new Constructor({
      propsData: {
        badgeCount: 5,
        icon: 'https://somepath/to/image.png',
      },
    }).$mount();
    expect(vm.$el.querySelector('#vsb-bubble img').src)
      .to.equal('https://somepath/to/image.png');
  });
  it('should apply correct bubble size', () => {
    const Constructor = Vue.extend(VueStickyBubble);
    const vm = new Constructor({
      propsData: {
        badgeCount: 5,
        size: 80,
      },
    }).$mount();
    expect(vm.$el.style.height)
      .to.equal('80px');
    expect(vm.$el.style.width)
      .to.equal('80px');
  });
});
