<template>
  <div ref="vsb-bubble" id="vsb-bubble" :style="appliedBubbleStyle">
    <img :src="icon" :style="iconStyle" draggable="false">
    <div id="vsb-badge" v-if="hasBadgeCount" :style="appliedBadgeStyle">
      {{ badgeCount }}
    </div>
  </div>
</template>
<script>
import { FRICTION,
         RESTING_PERIOD,
         REBOUND_STRENGTH,
         RESTING_VELOCITY,
         TOLERANCE } from '../constants';

const sqr = x => x * x;
const abs = ({ x, y }) => Math.sqrt(sqr(x) + sqr(y));

export default {
  name: 'vue-sticky-bubble',
  props: {
    size: {
      type: Number,
      default: 40,
    },
    bubbleStyle: {
      type: Object,
      default: () => {},
    },
    icon: {
      type: String,
      default: 'https://vuejs.org/images/logo.png',
    },
    badgeStyle: {
      type: Object,
      default: () => {},
    },
    badgeCount: {
      type: Number,
    },
  },
  methods: {
    handleTap() {
      this.$emit('tapped');
    },
    handlePointerDownWithCoords({ x, y }) {
      this.isDragging = true;
      this.hasRested = false;
      this.initialPosition.x = x - this.limits.left;
      this.initialPosition.y = y - this.limits.top;
    },
    handlePointerMoveWithCoords({ x, y }) {
      this.pointerPosition.x = x - this.limits.left;
      this.pointerPosition.y = y - this.limits.top;
    },
    handlePointerUp() {
      const hasNoSignificantVelocity = abs(this.velocity) < RESTING_VELOCITY;
      const isNearTheEdge = (this.position.x < (this.radius + TOLERANCE)) ||
                            (this.position.x > (this.limits.width - this.radius - TOLERANCE));
      const isNearOriginalPosition = abs(this.position) < (abs(this.initialPosition) + TOLERANCE);
      if (isNearTheEdge && hasNoSignificantVelocity && isNearOriginalPosition) {
        this.handleTap();
      }
    },
    tick() {
      const bubble = this.$refs['vsb-bubble'];
      if (!bubble) return;

      requestAnimationFrame(this.tick);

      if (this.isDragging && !this.hasRested) {
        this.previousPosition.x = this.position.x;
        this.previousPosition.y = this.position.y;

        this.position.x = this.pointerPosition.x;
        this.position.y = this.pointerPosition.y;

        this.velocity.x = (this.position.x - this.previousPosition.x);
        this.velocity.y = (this.position.y - this.previousPosition.y);
      } else {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.x *= FRICTION;
        this.velocity.y *= FRICTION;
      }

      if (this.position.x > this.limits.width - this.radius) {
        this.velocity.x *= -REBOUND_STRENGTH;
        this.position.x = this.limits.width - this.radius;
      }

      if (this.position.x < this.radius) {
        this.velocity.x *= -REBOUND_STRENGTH;
        this.position.x = this.radius;
      }

      if (this.position.y > this.limits.height - this.radius) {
        this.velocity.y *= -REBOUND_STRENGTH;
        this.position.y = this.limits.height - this.radius;
      }

      if (this.position.y < this.radius) {
        this.velocity.y *= -REBOUND_STRENGTH;
        this.position.y = this.radius;
      }

      if (this.velocity.x < RESTING_VELOCITY &&
         this.velocity.y < RESTING_VELOCITY &&
         !this.isDragging) {
        if (this.position.x < this.limits.width / 2) {
          this.isRestingRight = false;
          this.velocity.x = (this.radius - this.position.x) / RESTING_PERIOD;
        } else {
          this.isRestingRight = true;
          this.velocity.x = (this.limits.width - this.position.x - this.radius) / RESTING_PERIOD;
        }
        this.isResting = true;
      }

      if (this.isResting &&
          (this.position.x === (this.limits.width - this.radius) ||
           (this.position.x === this.radius))) {
        this.isResting = false;
        this.hasRested = true;
      }

      bubble.style.left = `${this.position.x}px`;
      bubble.style.top = `${this.position.y}px`;
    },
  },
  computed: {
    hasBadgeCount() {
      return !!this.badgeCount;
    },
    appliedBadgeStyle() {
      return this.isRestingRight ? this.badgeStyle : {
        ...this.badgeStyle,
        right: 0,
      };
    },
    iconStyle() {
      const size = this.size || 40;
      return {
        width: `${size / 2}px`,
        height: `${size / 2}px`,
        marginTop: `${size / 4}px`,
        userSelect: 'none',
      };
    },
    sizeStyle() {
      const size = this.size || 40;
      return {
        width: `${size}px`,
        height: `${size}px`,
        margin: `-${size / 2}px 0 0 -${size / 2}px`,
        borderRadius: `${size}px`,
      };
    },
    appliedBubbleStyle() {
      return {
        ...this.bubbleStyle,
        ...this.sizeStyle,
      };
    },
  },
  data: () => ({
    hasTouchSupport: false,
    isResting: false,
    isRestingRight: false,
    hasRested: true,
    isDragging: false,
    initialPosition: { x: 0, y: 0 },
    pointerPosition: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    previousPosition: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    limits: {},
    radius: 0,
    pointerDownListener: null,
    pointerUpListeners: new Map(),
    pointerMoveListener: null,
  }),
  mounted() {
    if (typeof document === 'undefined') {
      return;
    }

    const bubble = this.$refs['vsb-bubble'];
    const container = bubble.parentNode;

    const containerStyle = window.getComputedStyle(container, null);
    if (!['relative', 'absolute'].includes(containerStyle.position)) {
      throw new Error('Vue sticky bubble requires its parent to be positioned absolutely/relatively.');
    }

    this.hasTouchSupport = 'ontouchstart' in document.documentElement;
    this.radius = bubble.offsetWidth / 2;
    this.limits = container.getBoundingClientRect();

    window.addEventListener('resize', () => {
      this.radius = bubble.offsetWidth / 2;
      this.limits = container.getBoundingClientRect();
    });

    this.pointerUpListeners.set('documentPointerUpListener', () => {
      this.isDragging = false;
    });

    this.pointerUpListeners.set('bubblePointerUpListener', () => {
      this.handlePointerUp();
    });

    if (this.hasTouchSupport) {
      this.pointerDownListener = (event) => {
        const { clientX: x, clientY: y } = event.touches[0];
        this.handlePointerDownWithCoords({ x, y });
      };

      this.pointerMoveListener = (event) => {
        const { clientX: x, clientY: y } = event.touches[0];
        this.handlePointerMoveWithCoords({ x, y });
      };

      bubble.addEventListener('touchstart', this.pointerDownListener);
      bubble.addEventListener('touchend', this.pointerUpListeners.get('bubblePointerUpListener'));
      document.addEventListener('touchend', this.pointerUpListeners.get('documentPointerUpListener'));
      container.addEventListener('touchmove', this.pointerMoveListener);
    } else {
      this.pointerDownListener = ({ x, y }) => {
        this.handlePointerDownWithCoords({ x, y });
      };

      this.pointerMoveListener = ({ x, y }) => {
        this.handlePointerMoveWithCoords({ x, y });
      };

      bubble.addEventListener('mousedown', this.pointerDownListener);
      bubble.addEventListener('mouseup', this.pointerUpListeners.get('bubblePointerUpListener'));
      document.addEventListener('mouseup', this.pointerUpListeners.get('documentPointerUpListener'));
      container.addEventListener('mousemove', this.pointerMoveListener);
    }

    this.tick();
  },
  beforeDestroy() {
    const bubble = this.$refs['vsb-bubble'];
    const container = bubble.parentNode;

    bubble.removeEventListener('mousedown', this.pointerDownListener);
    bubble.removeEventListener('mouseup', this.pointerUpListeners.get('bubblePointerUpListener'));
    document.removeEventListener('mouseup', this.pointerUpListeners.get('documentPointerUpListener'));
    container.removeEventListener('mousemove', this.pointerMoveListener);
  },
};
</script>

<style scoped>
  #vsb-bubble {
    z-index: 9999;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08);
    border-radius: 40px;
    background: #fff;
    position: absolute;
    margin: -20px 0 0 -20px;
    height: 40px;
    width: 40px;
    display: inline-block;
  }
  #vsb-badge{
    border-radius: 9999px;
    width: 30%;
    height: 30%;
    font-size: 0.75em;
    background: red;
    color: white;
    position: absolute;
    top: 0;
    padding: 2px;
  }
</style>
