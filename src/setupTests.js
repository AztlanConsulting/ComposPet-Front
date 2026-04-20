// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest.mock("axios", () => ({
    post: jest.fn(),
    get: jest.fn(),
}));

jest.mock('swiper/react', () => ({
  Swiper: ({ children }) => children,
  SwiperSlide: ({ children }) => children,
}), { virtual: true });

jest.mock('swiper/modules', () => ({
  Navigation: jest.fn(),
}), { virtual: true });

jest.mock('swiper/css', () => ({}), { virtual: true });
jest.mock('swiper/css/navigation', () => ({}), { virtual: true });