import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Word from '@/components/WordComponent.vue';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(Word, {
      propsData: { msg },
    });
    expect(wrapper.text()).to.include(msg);
  });
});
