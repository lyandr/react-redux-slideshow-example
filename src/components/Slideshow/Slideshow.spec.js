import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { mockStore } from 'testUtils';
import { ACTIONS } from 'constants';

import Slideshow from './Slideshow.jsx';

describe('Slideshow.jsx', () => {
    const mockState = {
        noSlide: {
            SlideshowControlsReducer: {
                currentSlideIndex: 0,
                direction: 'next'
            },
            SlideshowReducer: {},
            SlideshowSettingsReducer: {
                transition: 'slide'
            }
        },
        slide: {
            SlideshowControlsReducer: {
                currentSlideIndex: 0,
                direction: 'next'
            },
            SlideshowReducer: {
                slides: [
                    { src: 'mock', views: 10, id: 'mock' },
                    { src: 'mock', views: 7, id: 'mock2' }
                ]
            },
            SlideshowSettingsReducer: {
                transition: 'slide'
            }
        }
    };

    describe('Basic rendering', () => {
        it('Should render expected components and content if no current slide is available yet', (done) => {
            const component = mount(
                <Provider
                    store={mockStore({
                        state: mockState.noSlide
                    })}
                >
                    <Slideshow />
                </Provider>
            );

            expect(component).to.be.ok;
            expect(component.find('Slide').length, 'Slide').to.equal(0);
            expect(component.find('SlideshowControls').length, 'SlideshowControls').to.equal(1);
            expect(component.find('SlideshowControls').props().enabled, 'SlideshowControls.props.enabled').to.equal(false);

            done();
        });

        it('Should render expected components and content if slide if current slide is available', (done) => {
            const component = mount(
                <Provider
                    store={mockStore({
                        state: mockState.slide
                    })}
                >
                    <Slideshow />
                </Provider>
            );

            expect(component).to.be.ok;
            expect(component.find('Slide').length, 'Slide').to.equal(1);
            expect(component.find('Slide').props().id, 'Slide.props.id').to.equal('mock');
            expect(component.find('Slide').props().src, 'Slide.props.src').to.equal('mock');
            expect(component.find('Slide').props().views, 'Slide.props.views').to.equal(10);
            expect(component.find('SlideshowControls').length, 'SlideshowControls').to.equal(1);
            expect(component.find('SlideshowControls').props().enabled, 'SlideshowControls.props.enabled').to.equal(true);

            done();
        });
    });

    describe('User interactions', () => {
        it(`Should dispatch ${ACTIONS.SLIDESHOW_JSON_REQUEST} on mount`, (done) => {
            const store = mockStore({
                expectedActions: [
                    {
                        filePath: 'src/json/slideshow.json',
                        type: ACTIONS.SLIDESHOW_JSON_REQUEST
                    }
                ],
                state: mockState.noSlide
            });

            mount(
                <Provider store={store}>
                    <Slideshow />
                </Provider>
            );

            store.testExpectedActions();

            done();
        });
    });
});
