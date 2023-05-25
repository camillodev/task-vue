import { shallowMount } from '@vue/test-utils';
import DescriptionField from '../../src/components/DescriptionField.vue';

describe('DescriptionField', () => {
  it('renders the description text correctly', () => {
    const wrapper = shallowMount(DescriptionField);

    const descriptionText = wrapper.find('.description-text');
    expect(descriptionText.text()).toBe('This is the description');
  });

  it('renders the checklist component', () => {
    const wrapper = shallowMount(DescriptionField);

    const checklist = wrapper.findComponent({ name: 'CheckList' });
    expect(checklist.exists()).toBe(true);
    expect(checklist.props('checklist')).toEqual([
      { text: 'Item 1', checked: false },
      { text: 'Item 2', checked: false },
      { text: 'Item 3', checked: false },
    ]);
  });
});
