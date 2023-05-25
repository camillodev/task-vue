import { shallowMount } from '@vue/test-utils';
import CheckList from '../../src/components/CheckList.vue';

describe('CheckList', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(CheckList, {
      propsData: {
        checklist: [],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the correct number of checklist items', () => {
    const checklist = [
      { text: 'Item 1', checked: false },
      { text: 'Item 2', checked: true },
      { text: 'Item 3', checked: false },
    ];
    const wrapper = shallowMount(CheckList, {
      propsData: {
        checklist,
      },
    });
    const items = wrapper.findAll('.checklist-item');
    expect(items.length).toBe(checklist.length);
  });

  it('removes an item when it is empty and loses focus', () => {
    const checklist = [
      { text: 'Item 1', checked: false },
      { text: 'Item 2', checked: true },
      { text: '', checked: false },
    ];
    const wrapper = shallowMount(CheckList, {
      propsData: {
        checklist,
      },
    });
    const items = wrapper.findAll('.checklist-item');
    expect(items.length).toBe(3);

    const input = items.at(2).find('.checklist-item-input');
    input.trigger('blur');

    expect(wrapper.vm.editableChecklist.length).toBe(2);
    expect(wrapper.vm.editableChecklist[2]).toBeUndefined();
  });

  it('handles drag and drop events correctly', () => {
    const checklist = [
      { text: 'Item 1', checked: false },
      { text: 'Item 2', checked: true },
      { text: 'Item 3', checked: false },
    ];
    const wrapper = shallowMount(CheckList, {
      propsData: {
        checklist,
      },
    });

    const item1 = wrapper.findAll('.checklist-item').at(0);
    const item2 = wrapper.findAll('.checklist-item').at(1);

    item1.trigger('dragstart', { dataTransfer: { setData: jest.fn() } });
    item2.trigger('dragenter');
    item2.trigger('dragover');
    item2.trigger('drop');

    expect(wrapper.vm.editableChecklist[0].text).toBe('Item 2');
    expect(wrapper.vm.editableChecklist[1].text).toBe('Item 1');
  });
});
