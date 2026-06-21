import { renderHook, act } from '@testing-library/react-native';
import { useDebounce } from '../useDebounce';

jest.useFakeTimers();

describe('useDebounce Hook', () => {
  it('should return initial value immediately', async () => {
    const { result } = await renderHook(() => useDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('should update value only after specified delay', async () => {
    const { result, rerender } = await renderHook(
      (props: { value: string; delay: number }) => useDebounce(props.value, props.delay),
      { initialProps: { value: 'hello', delay: 500 } }
    );

    expect(result.current).toBe('hello');

    // Change value
    await act(async () => {
      rerender({ value: 'world', delay: 500 });
    });
    
    expect(result.current).toBe('hello'); // still old value

    // Fast-forward time
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('world'); // updated value
  });
});
