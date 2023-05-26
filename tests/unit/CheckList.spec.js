import { mount } from '@vue/test-utils';
import Checklist from '@/components/CheckList.vue';

jest.useFakeTimers(); // Mock the timers

describe('Checklist', () => {
  it('renders the checklist items correctly', () => {
    const externalChecklistItems = [
      { text: 'Item 1', checked: false },
      { text: 'Item 2', checked: true },
    ];

    const wrapper = mount(Checklist, {
      propsData: {
        externalChecklistItems,
        templateData: [],
      },
    });

    const items = wrapper.findAll('.checklist-item');
    expect(items.length).toBe(externalChecklistItems.length);

    items.wrappers.forEach((itemWrapper, index) => {
      const item = externalChecklistItems[index];
      expect(itemWrapper.find('.checklist-item-input').element.value).toBe(
        item.text
      );
    });
  });

  it('emits the correct checklist data on change', () => {
    const externalChecklistItems = [
      { text: 'Item 1', checked: false },
      { text: 'Item 2', checked: true },
    ];

    const wrapper = mount(Checklist, {
      propsData: {
        externalChecklistItems,
        templateData: [],
      },
    });

    const newChecklistItems = [
      { text: 'Updated Item 1', checked: true },
      { text: 'Updated Item 2', checked: false },
    ];

    wrapper.vm.internalChecklistItems = newChecklistItems;

    // Manually trigger the debounced function
    wrapper.vm.emitChangesWithDelay();

    jest.runAllTimers(); // Flush the debounce timer

    expect(wrapper.emitted('change')).toBeTruthy();
    expect(wrapper.emitted('change')[0][0]).toEqual(newChecklistItems);
  });

  it('removes an item when it is empty and loses focus', async () => {
    const externalChecklistItems = [
      { text: 'Item 1', checked: false },
      { text: 'Item 2', checked: false },
      { text: 'Item 3', checked: false },
    ];

    const wrapper = mount(Checklist, {
      propsData: {
        externalChecklistItems,
        templateData: [],
      },
    });

    const items = wrapper.findAll('.checklist-item');
    const emptyItemIndex = 1;
    const emptyItemInput = items
      .at(emptyItemIndex)
      .find('.checklist-item-input');

    // Store the text of the item to be removed
    const removedItemText = externalChecklistItems[emptyItemIndex].text;

    emptyItemInput.setValue('');
    emptyItemInput.trigger('blur');

    await wrapper.vm.$nextTick();

    const updatedItems = wrapper.findAll('.checklist-item');
    expect(updatedItems.length).toBe(externalChecklistItems.length - 1);

    // Check that the text of the new item at emptyItemIndex does not match the removed item's text
    expect(updatedItems.at(emptyItemIndex).text()).not.toContain(
      removedItemText
    );
  });

  // TODO
  // it('handles drag and drop', async () => {});

  // TODO
  // FIX THE TEST BELLOW
  // it('creates a new item when the user presses Enter in the middle of the text', async () => {
  //   const externalChecklistItems = [
  //     { text: 'Item 1', checked: false },
  //     { text: 'Item 2', checked: false },
  //   ];

  //   const wrapper = mount(Checklist, {
  //     propsData: {
  //       externalChecklistItems,
  //       templateData: [],
  //     },
  //   });

  //   const initialText = 'Lorem Ipsum';
  //   const newItemText = 'Dolor Sit Amet';
  //   const newItemInput = wrapper.findAll('.checklist-item-input').at(0);
  //   newItemInput.setValue(initialText);

  //   const cursorPosition = 6; // Position where the Enter key will be pressed

  //   // Simulate pressing the Enter key at the specified cursor position
  //   await newItemInput.trigger('keydown.enter', { key: 'Enter' });
  //   await newItemInput.trigger('input');

  //   // Set the cursor position to the specified index
  //   newItemInput.element.selectionStart = cursorPosition;
  //   newItemInput.element.selectionEnd = cursorPosition;

  //   // Simulate pressing the Enter key at the specified cursor position
  //   await newItemInput.trigger('keyup.enter', { key: 'Enter' });
  //   await newItemInput.trigger('input');

  //   await wrapper.vm.$nextTick();

  //   const items = wrapper.findAll('.checklist-item');
  //   expect(items.length).toBe(externalChecklistItems.length + 1);

  //   // Check the text of the new items
  //   expect(items.at(1).find('input').element.value).toBe(
  //     initialText.slice(0, cursorPosition)
  //   );
  //   expect(items.at(2).find('input').element.value).toBe(
  //     initialText.slice(cursorPosition)
  //   );

  //   // Check the checked state of the new items
  //   expect(items.at(1).find('a-checkbox').props('checked')).toBe(false);
  //   expect(items.at(2).find('a-checkbox').props('checked')).toBe(false);
  // });

  it('breaks line when user presses Enter in the middle of the text', async () => {
    const externalChecklistItems = [
      { text: 'Item 1', checked: false },
      { text: 'Item 2', checked: false },
    ];

    const wrapper = mount(Checklist, {
      propsData: {
        externalChecklistItems,
        templateData: [],
      },
    });

    const existingItemIndex = 0;
    const existingItemText = externalChecklistItems[existingItemIndex].text;

    const existingItemInput = wrapper
      .findAll('.checklist-item-input')
      .at(existingItemIndex);

    const cursorPosition = 3;
    existingItemInput.setValue(existingItemText);
    existingItemInput.element.setSelectionRange(cursorPosition, cursorPosition);
    existingItemInput.trigger('keyup.enter');

    await wrapper.vm.$nextTick();

    const updatedItems = wrapper.vm.internalChecklistItems;

    const updatedItemText = existingItemText.substring(0, cursorPosition);
    const newItemText = existingItemText.substring(cursorPosition);

    expect(updatedItems[existingItemIndex].text).toBe(updatedItemText);
    expect(updatedItems[existingItemIndex + 1].text).toBe(newItemText);
  });

  // TODO: Fix this test
  // it('debounces the checklist changes', async () => {
  //   const externalChecklistItems = [
  //     { text: 'Item 1', checked: false },
  //     { text: 'Item 2', checked: false },
  //   ];

  //   const templateData = [
  //     {
  //       key: 1,
  //       value: 'Template 1',
  //       items: [
  //         { text: 'Template Item 1', checked: true },
  //         { text: 'Template Item 2', checked: false },
  //       ],
  //     },
  //   ];

  //   const wrapper = mount(Checklist, {
  //     propsData: {
  //       externalChecklistItems,
  //       templateData,
  //     },
  //   });

  //   const selectedTemplate = templateData[0];

  //   // Simulate selecting a template
  //   await wrapper.find('a-select').trigger('change', selectedTemplate);

  //   await wrapper.vm.$nextTick();

  //   expect(wrapper.emitted('change')).toBeTruthy();
  //   expect(wrapper.emitted('change')[0][0]).toEqual(selectedTemplate.items);
  // });
});
