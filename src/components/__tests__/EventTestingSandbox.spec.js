import { shallowMount, createLocalVue } from '@vue/test-utils';
import Component from '../EventTestingSandbox';

// create mocks for injected plugins
const localVue = createLocalVue();

describe(Component.name, () => {
  // wrapper factory function to be called at the beginning of every test
  const createWrapper = propsDataOverrides => {
    const options = {
      propsData: {},
      stubs: {
        EventTestingSandboxChild: true,
      },
      localVue,
    };

    // override default mounting options' propsData
    options.propsData = Object.assign(options.propsData, propsDataOverrides);

    return shallowMount(Component, options);
  };

  // isolate between tests by making use of both beforeEach AND afterEach
  beforeEach(() => {});

  afterEach(() => {
    // clear all mocks - this resets things like toBeCalled
    jest.clearAllMocks();
  });

  describe('vue components', () => {
    describe('testing component output', () => {
      /* the tests AFTER this one will focus on how to check if a function was or wasn't called. Often, this is NOT what you want: you don't want to know if a function was called, but if the RESULT of the function is there
       */
      it('emits child-click event when child is clicked', () => {
        const wrapper = createWrapper();
        const child = wrapper.findComponent({ ref: 'with-handler-name' });
        // it's a vue component, so use vm.$emit instead of trigger
        child.vm.$emit('click');
        console.log('wrapper.emitted():', wrapper.emitted());
        expect(wrapper.emitted('child-click')).toHaveLength(1);
      });
    });

    describe('component with event handler referred to by function name', () => {
      /* component defined like this:
    <event-testing-sandbox-child
      @click="clickHandler"
      ref="with-handler-name" />

    when you define @click with only the name of the event handler, this is resolved when the component is mounted. The handler is then tied to the event handler function the way it is at the time of mounting.
    Maybe this is a bit like a closure (or maybe it is a closure?),
    or maybe it does not even point to a function anymore, but internally just "inserts" the function body or something like that?
    When you change the component's method in the test file (wrapper.vm.clickHandler = jest.fn();), the event handler on this child component still points to the original version of clickHandler
    */
      it("calls component's original clickHandler on click", () => {
        const wrapper = createWrapper();
        wrapper.vm.clickHandler = jest.fn(() => {
          console.log('redefined clickHandler for ref with-handler-name');
        });

        const child = wrapper.findComponent({ ref: 'with-handler-name' });
        // it's a vue component, so use vm.$emit instead of trigger
        child.vm.$emit('click'); // since component's event handler is resolved at time of mounting, this will still result in the component's original clickHandler being called
        // NOTE: we're testing here for .not.toBeCalled to prove this doesn't work
        expect(wrapper.vm.clickHandler).not.toBeCalled();

        // when calling the component's method directly, that will result in a call to the redefined function
        wrapper.vm.clickHandler();
        expect(wrapper.vm.clickHandler).toBeCalled();
      });
    });

    describe('component with event handler referred to by function expression', () => {
      /* component defined like this:
    <event-testing-sandbox-child
      @click="clickHandler()"
      ref="with-handler-expression" />

    When you define @click as function expression (with parentheses), this is resolved when the actual event is triggered.
    When you change the component's method in the test file (wrapper.vm.clickHandler = jest.fn();), and a click is emitted, then the event handler will be resolved to the redefined function
    */
      it('calls clickHandler on click', () => {
        const wrapper = createWrapper();
        wrapper.vm.clickHandler = jest.fn(() => {
          console.log('redefined clickHandler for ref with-handler-expression');
        });

        const child = wrapper.findComponent({ ref: 'with-handler-expression' });
        // it's a vue component, so use vm.$emit instead of trigger
        child.vm.$emit('click');
        expect(wrapper.vm.clickHandler).toBeCalled();
      });
    });

    describe('component with event handler referred to by wrapper name', () => {
      /* component defined like this:
    <event-testing-sandbox-child
      @click="clickHandlerWrapper"
      ref="with-handler-wrapper-name" />

    When you define @click with the name of the event handler, the handler itself will be resolved at mounttime, but any functions inside that handler will still be resolved at runtime.
    So redefining the wrapper function in the test (wrapper.vm.clickHandlerWrapper = jest.fn();) won't work,
    but redefining the function inside the wrapper (wrapper.vm.clickHandler = jest.fn();) will work.
    */
      it('calls clickHandler on click', () => {
        const wrapper = createWrapper();
        wrapper.vm.clickHandler = jest.fn(() => {
          console.log(
            'redefined clickHandler for ref with-handler-wrapper-name',
          );
        });

        const child = wrapper.findComponent({
          ref: 'with-handler-wrapper-name',
        });
        // it's a vue component, so use vm.$emit instead of trigger
        child.vm.$emit('click');
        expect(wrapper.vm.clickHandler).toBeCalled();
      });
    });

    describe('component with click handler set in props', () => {
      /* component defined like this:
    <event-testing-sandbox-child
      @click="clickHandlerProp"
      ref="with-handler-from-props" />

    When you define the event handler as a passed-in property, even just with its name, redefining the property in your test (wrapper.setProps({clickHandlerProps: jest.fn()});) will result in the new function being bound to the event handler.
    */
      it('calls clickHandlerProp on click', async () => {
        const propsDataOverrides = {
          // specify regular function, not jest.fn(). Such a function can't be spied for toBeCalled
          clickHandlerProp: () => {
            console.log('clickHandlerProp set in test propsData');
          },
        };
        const wrapper = createWrapper(propsDataOverrides);
        await wrapper.setProps({
          clickHandlerProp: jest.fn(() => {
            console.log(
              'redefined clickHandler for ref with-handler-from-props',
            );
          }),
        });

        const child = wrapper.findComponent({ ref: 'with-handler-from-props' });
        // it's a vue component, so use vm.$emit instead of trigger
        child.vm.$emit('click');
        expect(wrapper.vm.clickHandlerProp).toBeCalled();
      });
    });
  }); // vue components

  // ---------------------------------------------------
  // html element seem to work the same way as vue components

  describe('html elements', () => {
    describe('html element with event handler referred to by function name', () => {
      /* html element defined like this:
    <button
      @click="clickHandler"
      ref="button-with-handler-name" />
    */
      it("calls element's original clickHandler on click", () => {
        const wrapper = createWrapper();
        wrapper.vm.clickHandler = jest.fn(() => {
          console.log(
            'redefined clickHandler for ref button-with-handler-name',
          );
        });

        const button = wrapper.find('[data-qa="button-with-handler-name"]');
        // it's an html element, so use element.trigger instead of vm.$emit
        button.trigger('click');
        // NOTE: we're testing here for .not.toBeCalled to prove this doesn't work
        expect(wrapper.vm.clickHandler).not.toBeCalled();
      });
    });

    describe('html element with event handler referred to by function expression', () => {
      /* html element defined like this:
    <button
      @click="clickHandler()"
      ref="button-with-handler-expression" />
    */
      it("calls element's original clickHandler on click", () => {
        const wrapper = createWrapper();
        wrapper.vm.clickHandler = jest.fn(() => {
          console.log(
            'redefined clickHandler for ref button-with-handler-expression',
          );
        });

        const button = wrapper.find(
          '[data-qa="button-with-handler-expression"]',
        );
        // it's an html element, so use element.trigger instead of vm.$emit
        button.trigger('click');
        expect(wrapper.vm.clickHandler).toBeCalled();
      });
    });
  }); // html elements
});
